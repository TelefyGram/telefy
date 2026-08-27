import 'dart:convert';
import 'dart:async';
import 'dart:ffi';

import 'dart:io';

import 'package:ffi/ffi.dart';
import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';

import '../logging/app_logger_platform.dart';
import 'telegram_api.dart';
import 'tdlib.dart';

export 'telegram_api.dart';

class TelegramClient implements TelegramClientApi {
  final TdLibBindings _tdlib;
  late final Pointer<Void> _client;

  bool _disposed = false;
  final List<VoidCallback> _authorizationStateListeners = [];
  bool _tdlibParametersSet = false;
  Future<void>? _initializationFuture;
  String? _authorizationStateType;
  int _requestSequence = 0;
  final Map<String, Completer<Map<String, dynamic>>> _pendingResponses = {};
  final Map<bool, List<TelegramChatInfo>> _chatCache = {};
  Timer? _responsePump;

  static const String apiIdValue = String.fromEnvironment('TELEGRAM_API_ID');
  static const String apiHash = String.fromEnvironment('TELEGRAM_API_HASH');

  TelegramClient() : _tdlib = TdLibBindings() {
    _client = _tdlib.create();
    _responsePump = Timer.periodic(
      const Duration(milliseconds: 20),
      (_) => _drainResponses(),
    );
    AppLogger.event('tdlib.native.created', {'client': _client.address});
  }

  @override
  String? get authorizationStateType => _authorizationStateType;

  void addAuthorizationStateListener(VoidCallback listener) {
    _authorizationStateListeners.add(listener);
  }

  void removeAuthorizationStateListener(VoidCallback listener) {
    _authorizationStateListeners.remove(listener);
  }

  @override
  Future<void> initialize({
    required String systemLanguageCode,
    required String deviceModel,
    required String systemVersion,
    required String appVersion,
  }) {
    AppLogger.event('tdlib.initialize.requested', {
      'language': systemLanguageCode,
      'device': deviceModel,
      'system': systemVersion,
      'app': appVersion,
    });
    return _initializationFuture ??= setTdlibParameters(
      systemLanguageCode: systemLanguageCode,
      deviceModel: deviceModel,
      systemVersion: systemVersion,
      appVersion: appVersion,
    );
  }

  void send(Map<String, dynamic> request) {
    if (_disposed) {
      throw StateError('TelegramClient has already been disposed');
    }

    final json = jsonEncode(request);
    AppLogger.event('tdlib.request.queued', {
      'type': request['@type'],
      'extra': request['@extra'],
    });
    final requestId = request['@extra']?.toString();
    if (requestId != null) {
      _pendingResponses.putIfAbsent(
        requestId,
        Completer<Map<String, dynamic>>.new,
      );
    }
    final nativeString = json.toNativeUtf8();

    try {
      _tdlib.send(_client, nativeString);
    } finally {
      calloc.free(nativeString);
    }
  }

  @override
  Future<void> setAuthenticationPhoneNumber({
    required String phoneNumber,
    bool allowFlashCall = false,
    bool allowMissedCall = false,
    bool isCurrentPhoneNumber = false,
    bool allowSmsRetrieverApi = true,
  }) async {
    AppLogger.event('auth.phone.requested');
    if (!_tdlibParametersSet) {
      final initializationFuture = _initializationFuture;
      if (initializationFuture == null) {
        throw StateError('TDLib parameters must be set before authentication');
      }
      await initializationFuture;
    }

    if (_authorizationStateType == 'authorizationStateWaitCode') {
      return;
    }

    if (_authorizationStateType != 'authorizationStateWaitPhoneNumber') {
      throw StateError(
        'Cannot request authentication code in state: '
        '${_authorizationStateType ?? 'unknown'}',
      );
    }

    final requestId = 'setAuthenticationPhoneNumber-${++_requestSequence}';
    send({
      '@type': 'setAuthenticationPhoneNumber',
      '@extra': requestId,
      'phone_number': phoneNumber,
      'settings': {
        '@type': 'phoneNumberAuthenticationSettings',
        'allow_flash_call': allowFlashCall,
        'allow_missed_call': allowMissedCall,
        'is_current_phone_number': isCurrentPhoneNumber,
        'allow_sms_retriever_api': allowSmsRetrieverApi,
      },
    });

    final response = await _waitForResponse(requestId);
    if (response['@type'] == 'error') {
      throw StateError(
        'Authentication code request failed: '
        '${response['code']}: ${response['message']}',
      );
    }
  }

  @override
  Future<AuthenticationCodeResult> checkAuthenticationCode({
    required String code,
  }) async {
    AppLogger.event('auth.code.submitted');
    if (!_tdlibParametersSet) {
      throw StateError('TDLib parameters must be set before authentication');
    }

    final requestId = 'checkAuthenticationCode-${++_requestSequence}';
    send({
      '@type': 'checkAuthenticationCode',
      '@extra': requestId,
      'code': code,
    });

    final response = await _waitForResponse(requestId);
    if (response['@type'] == 'error') {
      throw StateError(
        'Authentication code check failed: ${response['message']}',
      );
    }

    return _authorizationStateType == 'authorizationStateWaitPassword'
        ? AuthenticationCodeResult.passwordRequired
        : AuthenticationCodeResult.authorized;
  }

  @override
  Future<TelegramUserInfo> checkAuthenticationPassword({
    required String password,
  }) async {
    AppLogger.event('auth.password.submitted');
    if (!_tdlibParametersSet) {
      throw StateError('TDLib parameters must be set before authentication');
    }

    final requestId = 'checkAuthenticationPassword-${++_requestSequence}';
    send({
      '@type': 'checkAuthenticationPassword',
      '@extra': requestId,
      'password': password,
    });

    final response = await _waitForResponse(requestId);
    if (response['@type'] == 'error') {
      throw StateError(
        'Authentication password check failed: ${response['message']}',
      );
    }

    return getMe();
  }

  @override
  Future<TelegramUserInfo> getMe() async {
    AppLogger.event('tdlib.get_me.requested');
    final requestId = 'getMe-${++_requestSequence}';
    send({'@type': 'getMe', '@extra': requestId});

    final response = await _waitForResponse(requestId);
    if (response['@type'] == 'error') {
      throw StateError(
        'Failed to get account information: ${response['message']}',
      );
    }

    final usernames = response['usernames'];
    final activeUsernames = usernames is Map<String, dynamic>
        ? usernames['active_usernames']
        : null;
    final username = activeUsernames is List && activeUsernames.isNotEmpty
        ? activeUsernames.first as String?
        : response['username'] as String?;
    final profilePhoto = response['profile_photo'];
    final smallPhoto = profilePhoto is Map ? profilePhoto['small'] : null;
    final avatarPath = await _downloadPhotoPath(smallPhoto)
        .timeout(const Duration(seconds: 3), onTimeout: () => null);
    final userId = _intValue(response['id']);
    final fullInfo = userId == null
        ? <String, dynamic>{}
        : await _requestSafely('getUserFullInfo', {'user_id': userId}).timeout(
            const Duration(seconds: 3),
            onTimeout: () => <String, dynamic>{},
          );
    return TelegramUserInfo(
      firstName: response['first_name'] as String?,
      lastName: response['last_name'] as String?,
      username: username,
      phoneNumber: response['phone_number'] as String?,
      id: userId,
      avatarPath: avatarPath,
      bio: _formattedText(fullInfo['bio']),
      accentColorId: _intValue(response['profile_accent_color_id']),
      backgroundCustomEmojiId: _intValue(
        response['profile_background_custom_emoji_id'],
      ),
      emojiStatusId: _emojiStatusId(response['emoji_status']),
      isPremium: response['is_premium'] == true,
      isVerified: response['is_verified'] == true,
      gifts: const [],
      channelId: _intValue(fullInfo['community_id']),
    );
  }

  @override
  Future<List<TelegramMessageInfo>> getChatMessages(int chatId) async {
    AppLogger.event('chats.messages.requested', {'chatId': chatId});
    final response = await _requestSafely('getChatHistory', {
      'chat_id': chatId,
      'from_message_id': 0,
      'offset': 0,
      'limit': 100,
      'only_local': false,
    });
    final messages = response['messages'];
    if (messages is! List) return const [];
    final result = <TelegramMessageInfo>[];
    for (final value in messages.whereType<Map>()) {
      final parsed = await _parseMessage(value);
      if (parsed != null) result.add(parsed);
    }
    return result;
  }

  @override
  Future<List<TelegramChatInfo>> getChats({
    bool archive = false,
    bool forceRefresh = false,
  }) async {
    AppLogger.event('chats.list.requested', {'archive': archive});
    if (!forceRefresh && _chatCache.containsKey(archive)) {
      AppLogger.event('chats.list.cache_hit', {'archive': archive});
      return List.unmodifiable(_chatCache[archive]!);
    }
    final response = await _requestSafely('getChats', {
      'chat_list': {'@type': archive ? 'chatListArchive' : 'chatListMain'},
      'limit': 100,
    });
    final ids = response['chat_ids'];
    if (ids is! List) return const [];
    final chats = await Future.wait(
      ids.whereType<num>().map((id) async {
        final chat = await _requestSafely('getChat', {'chat_id': id.toInt()});
        return _chatFromResponse(chat, archive: archive);
      }),
    );
    final result = chats.whereType<TelegramChatInfo>().toList();
    _chatCache[archive] = result;
    return result;
  }

  @override
  Future<void> sendMessage({required int chatId, required String text}) async {
    AppLogger.event('chats.message.send_requested', {'chatId': chatId});
    await _request('sendMessage', {
      'chat_id': chatId,
      'input_message_content': {
        '@type': 'inputMessageText',
        'text': {'@type': 'formattedText', 'text': text},
      },
    });
    _chatCache.clear();
  }

  TelegramChatInfo? _chatFromResponse(
    Map<String, dynamic> response, {
    required bool archive,
  }) {
    final id = _intValue(response['id']);
    if (id == null) return null;
    final type = response['type'];
    final isChannel = type is Map && type['@type'] == 'chatTypeSupergroup'
        ? type['is_channel'] == true
        : false;
    final lastMessage = response['last_message'];
    final content = lastMessage is Map ? lastMessage['content'] : null;
    final text = content is Map ? content['text'] : null;
    return TelegramChatInfo(
      id: id,
      title: response['title']?.toString() ?? '',
      username: _stringValue(
        response['usernames'] is Map
            ? (response['usernames']['active_usernames'] as List?)?.firstOrNull
            : null,
      ),
      isChannel: isChannel,
      isArchived: archive,
      lastMessage: text is Map ? _formattedText(text) : null,
    );
  }

  Future<TelegramMessageInfo?> _parseMessage(Map message) async {
    final content = message['content'];
    if (content is! Map) return null;
    final type = content['@type']?.toString();
    final text = _formattedText(content['text'] ?? content['caption']) ?? '';
    if (type == 'messageText') {
      return TelegramMessageInfo(
        id: (message['id'] as int?) ?? 0,
        type: TelegramMessageType.text,
        text: text,
      );
    }
    if (type == 'messagePhoto') {
      final photo = content['photo'];
      final sizes = photo is Map ? photo['sizes'] : null;
      final paths = <String>[];
      if (sizes is List) {
        for (final size in sizes.whereType<Map>()) {
          final path = await _downloadPhotoPath(size['photo']);
          if (path != null) paths.add(path);
        }
      }
      return TelegramMessageInfo(
        id: (message['id'] as int?) ?? 0,
        type: TelegramMessageType.photo,
        text: text,
        mediaPath: paths.isEmpty ? null : paths.last,
      );
    }
    if (type == 'messagePoll') {
      final poll = content['poll'];
      final options = poll is Map && poll['options'] is List
          ? (poll['options'] as List)
                .whereType<Map>()
                .map((option) => _formattedText(option['text']) ?? '')
                .where((option) => option.isNotEmpty)
                .toList()
          : const <String>[];
      return TelegramMessageInfo(
        id: (message['id'] as int?) ?? 0,
        type: TelegramMessageType.poll,
        text: poll is Map ? poll['question']?.toString() ?? text : text,
        pollOptions: options,
      );
    }
    return TelegramMessageInfo(
      id: (message['id'] as int?) ?? 0,
      type: _messageType(type),
      text: text,
    );
  }

  TelegramMessageType _messageType(String? type) {
    if (type == 'messageVideo') return TelegramMessageType.video;
    if (type == 'messageDocument') return TelegramMessageType.document;
    if (type == 'messageVoiceNote') return TelegramMessageType.voice;
    return TelegramMessageType.text;
  }

  Future<Map<String, dynamic>> _requestSafely(
    String type,
    Map<String, dynamic> parameters,
  ) async {
    try {
      return await _request(type, parameters);
    } on Object {
      return <String, dynamic>{};
    }
  }

  String? _formattedText(dynamic value) {
    if (value is Map) return value['text']?.toString();
    return null;
  }

  int? _emojiStatusId(dynamic value) {
    if (value is! Map) return null;
    final type = value['type'];
    return type is Map ? _intValue(type['custom_emoji_id']) : null;
  }

  int? _intValue(dynamic value) {
    if (value is int) return value;
    if (value is num) return value.toInt();
    return int.tryParse(value?.toString() ?? '');
  }

  String? _stringValue(dynamic value) {
    if (value == null) return null;
    final text = value.toString().trim();
    return text.isEmpty ? null : text;
  }

  Future<Map<String, dynamic>> _request(
    String type,
    Map<String, dynamic> parameters,
  ) async {
    final requestId = '$type-${++_requestSequence}';
    send({'@type': type, '@extra': requestId, ...parameters});
    return _waitForResponse(requestId);
  }

  Future<String?> _downloadPhotoPath(dynamic photo) async {
    if (photo is! Map || photo['id'] is! int) return null;
    final fileId = photo['id'] as int;
    final local = photo['local'];
    if (local is Map && local['is_downloading_completed'] == true) {
      final path = local['path'];
      if (path is String && path.isNotEmpty) return path;
    }

    final requestId = 'downloadProfilePhoto-${++_requestSequence}';
    send({
      '@type': 'downloadFile',
      '@extra': requestId,
      'file_id': fileId,
      'priority': 32,
      'offset': 0,
      'limit': 0,
      'synchronous': true,
    });
    final downloaded = await _waitForResponse(requestId);
    final downloadedLocal = downloaded['local'];
    if (downloadedLocal is Map) {
      final path = downloadedLocal['path'];
      if (path is String && path.isNotEmpty) return path;
    }
    return null;
  }

  @override
  Future<void> logOut() async {
    if (!_tdlibParametersSet) {
      throw StateError('TDLib parameters must be set before logging out');
    }

    final requestId = 'logOut-${++_requestSequence}';
    send({'@type': 'logOut', '@extra': requestId});
    final response = await _waitForResponse(requestId);
    if (response['@type'] == 'error') {
      throw StateError('Failed to log out: ${response['message']}');
    }
  }

  /// Receives the next response/update from TDLib
  /// Returns null if TDLib has returned nothing within the timeout
  Map<String, dynamic>? receive([double timeout = 0.1]) {
    if (_disposed) {
      throw StateError('TelegramClient has already been disposed');
    }

    final result = _tdlib.receive(_client, timeout);

    if (result == nullptr) {
      return null;
    }

    final json = result.toDartString();

    if (json.isEmpty) {
      return null;
    }

    final decoded = jsonDecode(json);

    if (decoded is! Map<String, dynamic>) {
      return null;
    }

    _handleAuthorizationState(decoded);

    return decoded;
  }

  Future<void> setTdlibParameters({
    required String systemLanguageCode,
    required String deviceModel,
    required String systemVersion,
    required String appVersion,
  }) async {
    if (_disposed) {
      throw StateError('TelegramClient has already been disposed');
    }

    final apiId = int.tryParse(apiIdValue) ?? 0;

    if (apiId == 0) {
      throw StateError(
        'TELEGRAM_API_ID is not configured. '
        'Use --dart-define=TELEGRAM_API_ID=...',
      );
    }

    if (apiHash.isEmpty) {
      throw StateError(
        'TELEGRAM_API_HASH is not configured. '
        'Use --dart-define=TELEGRAM_API_HASH=...',
      );
    }

    final appDirectory = await getApplicationSupportDirectory();

    final databaseDirectory = '${appDirectory.path}/tdlib';
    final filesDirectory = '$databaseDirectory/files';
    await Directory(filesDirectory).create(recursive: true);

    send({
      '@type': 'setOption',
      'name': 'prefer_ipv6',
      'value': {'@type': 'optionValueBoolean', 'value': false},
    });

    send({
      '@type': 'setNetworkType',
      'type': {'@type': 'networkTypeOther'},
    });

    send({
      '@type': 'setTdlibParameters',
      '@extra': 'setTdlibParameters',
      'database_directory': databaseDirectory,
      'files_directory': filesDirectory,
      'use_message_database': true,
      'use_secret_chats': true,
      'use_file_database': true,
      'api_id': apiId,
      'api_hash': apiHash,
      'system_language_code': systemLanguageCode,
      'device_model': deviceModel,
      'system_version': systemVersion,
      'application_version': appVersion,
      'enable_storage_optimizer': true,
      'use_test_dc': false,
    });

    _tdlibParametersSet = true;

    const stateRequestId = 'getAuthorizationState';
    send({'@type': 'getAuthorizationState', '@extra': stateRequestId});
    final response = await _waitForResponse(stateRequestId, attempts: 180);
    _updateAuthorizationState(response);
    await _waitForUsableAuthorizationState();
  }

  Future<void> _waitForUsableAuthorizationState() async {
    final deadline = DateTime.now().add(const Duration(seconds: 60));
    while (DateTime.now().isBefore(deadline)) {
      final state = _authorizationStateType;
      if (state == 'authorizationStateWaitPhoneNumber' ||
          state == 'authorizationStateReady' ||
          state == 'authorizationStateWaitCode' ||
          state == 'authorizationStateWaitPassword') {
        return;
      }

      await Future<void>.delayed(const Duration(milliseconds: 50));
    }

    throw StateError(
      'Timed out waiting for usable authorization state: '
      '${_authorizationStateType ?? 'unknown'}',
    );
  }

  Future<Map<String, dynamic>> _waitForResponse(
    String requestId, {
    int attempts = 300,
  }) async {
    final stopwatch = Stopwatch()..start();
    final completer = _pendingResponses.putIfAbsent(
      requestId,
      Completer<Map<String, dynamic>>.new,
    );
    final deadline = DateTime.now().add(Duration(milliseconds: attempts * 150));
    while (DateTime.now().isBefore(deadline)) {
      final response = await Future.any([
        completer.future,
        Future<Map<String, dynamic>?>.delayed(
          const Duration(milliseconds: 50),
          () => null,
        ),
      ]);
      if (response is! Map<String, dynamic>) continue;

      AppLogger.event('tdlib.response.received', {
        'requestId': requestId,
        'type': response['@type'],
        'elapsedMs': stopwatch.elapsedMilliseconds,
      });

      _pendingResponses.remove(requestId);
      if (response['@type'] == 'error') {
        throw StateError(
          'TDLib request failed: ${response['code']}: ${response['message']}',
        );
      }

      return response;
    }

    AppLogger.event('tdlib.response.timeout', {
      'requestId': requestId,
      'elapsedMs': stopwatch.elapsedMilliseconds,
    });
    _pendingResponses.remove(requestId);
    throw StateError('Timed out waiting for TDLib response: $requestId');
  }

  void _drainResponses() {
    if (_disposed) return;
    try {
      var response = receive(0.02);
      while (response != null) {
        final requestId = response['@extra']?.toString();
        if (requestId != null) {
          final completer = _pendingResponses.remove(requestId);
          if (completer != null && !completer.isCompleted) {
            completer.complete(response);
          }
        }
        response = receive(0);
      }
    } on Object catch (error, stack) {
      AppLogger.exception('tdlib.receive.failed', error, stack);
    }
  }

  void dispose() {
    if (_disposed) {
      return;
    }

    AppLogger.event('tdlib.native.destroyed', {'client': _client.address});
    _responsePump?.cancel();
    for (final completer in _pendingResponses.values) {
      if (!completer.isCompleted) {
        completer.completeError(StateError('TelegramClient disposed'));
      }
    }
    _pendingResponses.clear();
    _tdlib.destroy(_client);
    _disposed = true;
  }

  void _handleAuthorizationState(Map<String, dynamic> response) {
    _updateAuthorizationState(response);
  }

  void _updateAuthorizationState(Map<String, dynamic> response) {
    final previousState = _authorizationStateType;
    final state = response['authorization_state'] is Map<String, dynamic>
        ? response['authorization_state']
        : response['@type']?.toString().startsWith('authorizationState') == true
        ? response
        : null;
    if (state is! Map<String, dynamic>) {
      return;
    }

    _authorizationStateType = state['@type'] as String?;
    AppLogger.event('auth.state.changed', {
      'from': previousState,
      'to': _authorizationStateType,
    });

    if (_authorizationStateType != previousState) {
      for (final listener in List<VoidCallback>.from(
        _authorizationStateListeners,
      )) {
        listener();
      }
    }

    if (state['@type'] == 'authorizationStateWaitEncryptionKey') {
      send({
        '@type': 'checkDatabaseEncryptionKey',
        '@extra': 'checkDatabaseEncryptionKey',
        'encryption_key': '',
      });
    }
  }
}

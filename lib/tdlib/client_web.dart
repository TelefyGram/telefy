import 'dart:js_util' as js_util;

import 'package:flutter/foundation.dart';

import '../logging/app_logger_platform.dart';
import 'telegram_api.dart';

export 'telegram_api.dart';

class TelegramClient implements TelegramClientApi {
  late final dynamic _client;
  String? _authorizationStateType;
  final List<VoidCallback> _authorizationStateListeners = [];
  Future<void>? _initializationFuture;
  bool _disposed = false;

  static const _apiId = String.fromEnvironment('TELEGRAM_API_ID');
  static const _apiHash = String.fromEnvironment('TELEGRAM_API_HASH');

  TelegramClient() {
    final exported = js_util.getProperty(js_util.globalThis, 'tdweb');
    if (exported == null) {
      throw StateError('tdweb.js is not loaded');
    }
    final constructor = js_util.getProperty(exported, 'default') ?? exported;
    _client = js_util.callConstructor(constructor, [
      js_util.jsify({
        'instanceName': 'telefy',
        'useDatabase': true,
        'onUpdate': js_util.allowInterop(_handleUpdate),
      }),
    ]);
    AppLogger.event('tdlib.web.created');
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
    return _initializationFuture ??= _initialize(
      systemLanguageCode: systemLanguageCode,
      deviceModel: deviceModel,
      systemVersion: systemVersion,
      appVersion: appVersion,
    );
  }

  Future<void> _initialize({
    required String systemLanguageCode,
    required String deviceModel,
    required String systemVersion,
    required String appVersion,
  }) async {
    final apiId = int.tryParse(_apiId) ?? 0;
    if (apiId == 0 || _apiHash.isEmpty) {
      throw StateError('Telegram API credentials are not configured');
    }
    await _send({
      '@type': 'setTdlibParameters',
      'database_directory': 'tdlib',
      'files_directory': 'tdlib/files',
      'use_message_database': true,
      'use_secret_chats': true,
      'use_file_database': true,
      'api_id': apiId,
      'api_hash': _apiHash,
      'system_language_code': systemLanguageCode,
      'device_model': deviceModel,
      'system_version': systemVersion,
      'application_version': appVersion,
      'enable_storage_optimizer': true,
      'use_test_dc': false,
    });
    await _send({
      '@type': 'setNetworkType',
      'type': {'@type': 'networkTypeOther'},
    });
    _updateAuthorizationState(await _send({'@type': 'getAuthorizationState'}));
  }

  @override
  Future<void> setAuthenticationPhoneNumber({
    required String phoneNumber,
  }) async {
    await _send({
      '@type': 'setAuthenticationPhoneNumber',
      'phone_number': phoneNumber,
      'settings': {
        '@type': 'phoneNumberAuthenticationSettings',
        'allow_flash_call': false,
        'allow_missed_call': false,
        'is_current_phone_number': false,
        'allow_sms_retriever_api': false,
      },
    });
  }

  @override
  Future<AuthenticationCodeResult> checkAuthenticationCode({
    required String code,
  }) async {
    await _send({'@type': 'checkAuthenticationCode', 'code': code});
    final state = await _send({'@type': 'getAuthorizationState'});
    _updateAuthorizationState(state);
    return _authorizationStateType == 'authorizationStateWaitPassword'
        ? AuthenticationCodeResult.passwordRequired
        : AuthenticationCodeResult.authorized;
  }

  @override
  Future<TelegramUserInfo> checkAuthenticationPassword({
    required String password,
  }) async {
    await _send({'@type': 'checkAuthenticationPassword', 'password': password});
    return getMe();
  }

  @override
  Future<TelegramUserInfo> getMe() async {
    final response = await _send({'@type': 'getMe'});
    final user = _userFromResponse(response);
    Map<String, dynamic> full = <String, dynamic>{};
    if (user.id != null) {
      try {
        full = await _send({'@type': 'getUserFullInfo', 'user_id': user.id})
            .timeout(
              const Duration(seconds: 3),
              onTimeout: () => <String, dynamic>{},
            );
      } on Object {
        full = <String, dynamic>{};
      }
    }
    return TelegramUserInfo(
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      phoneNumber: user.phoneNumber,
      id: user.id,
      avatarPath: user.avatarPath,
      bio: _stringValue(full['bio'] is Map ? full['bio']['text'] : null),
      accentColorId: user.accentColorId,
      backgroundCustomEmojiId: user.backgroundCustomEmojiId,
      emojiStatusId: user.emojiStatusId,
      isPremium: user.isPremium,
      isVerified: user.isVerified,
      channelId: _intValue(full['community_id']),
    );
  }

  @override
  Future<List<TelegramMessageInfo>> getChatMessages(int chatId) async {
    final response = await _send({
      '@type': 'getChatHistory',
      'chat_id': chatId,
      'from_message_id': 0,
      'offset': 0,
      'limit': 100,
      'only_local': false,
    });
    final messages = response['messages'];
    if (messages is! List) return const [];
    return messages.whereType<Map>().map(_messageFromResponse).toList();
  }

  @override
  Future<List<TelegramChatInfo>> getChats({
    bool archive = false,
    bool forceRefresh = false,
  }) async {
    final response = await _send({
      '@type': 'getChats',
      'chat_list': {'@type': archive ? 'chatListArchive' : 'chatListMain'},
      'limit': 100,
    });
    final ids = response['chat_ids'];
    if (ids is! List) return const [];
    final result = <TelegramChatInfo>[];
    for (final id in ids.whereType<num>()) {
      final chat = await _send({'@type': 'getChat', 'chat_id': id.toInt()});
      final parsed = _chatFromResponse(chat, archive: archive);
      if (parsed != null) result.add(parsed);
    }
    return result;
  }

  @override
  Future<void> sendMessage({required int chatId, required String text}) async {
    await _send({
      '@type': 'sendMessage',
      'chat_id': chatId,
      'input_message_content': {
        '@type': 'inputMessageText',
        'text': {'@type': 'formattedText', 'text': text},
      },
    });
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
      isChannel: isChannel,
      isArchived: archive,
      lastMessage: text is Map ? _stringValue(text['text']) : null,
    );
  }

  TelegramMessageInfo _messageFromResponse(Map message) {
    final content = message['content'];
    final type = content is Map ? content['@type']?.toString() : null;
    return TelegramMessageInfo(
      id: _intValue(message['id']) ?? 0,
      type: type == 'messagePhoto'
          ? TelegramMessageType.photo
          : type == 'messagePoll'
          ? TelegramMessageType.poll
          : TelegramMessageType.text,
      text: content is Map
          ? (content['text'] is Map
                ? content['text']['text']?.toString() ?? ''
                : content['caption'] is Map
                ? content['caption']['text']?.toString() ?? ''
                : '')
          : '',
    );
  }

  @override
  Future<void> logOut() async {
    await _send({'@type': 'logOut'});
    _authorizationStateType = null;
  }

  void dispose() {
    if (_disposed) return;
    AppLogger.event('tdlib.web.destroyed');
    _disposed = true;
    js_util.callMethod<void>(_client, 'close', const []);
  }

  Future<Map<String, dynamic>> _send(Map<String, dynamic> request) async {
    if (_disposed) throw StateError('TelegramClient has already been disposed');
    final stopwatch = Stopwatch()..start();
    AppLogger.event('tdlib.request.sent', {'type': request['@type']});
    final promise = js_util.callMethod<dynamic>(_client, 'send', [
      js_util.jsify(request),
    ]);
    final response = js_util.dartify(
      await js_util.promiseToFuture<dynamic>(promise),
    );
    if (response is! Map)
      throw StateError('TDLib returned an invalid response');
    final result = Map<String, dynamic>.from(response);
    AppLogger.event('tdlib.response.received', {
      'type': result['@type'],
      'elapsedMs': stopwatch.elapsedMilliseconds,
    });
    if (result['@type'] == 'error') {
      throw StateError(result['message']?.toString() ?? 'TDLib request failed');
    }
    _updateAuthorizationState(result);
    return result;
  }

  void _handleUpdate(dynamic update) {
    final dartUpdate = js_util.dartify(update);
    if (dartUpdate is Map)
      _updateAuthorizationState(Map<String, dynamic>.from(dartUpdate));
  }

  void _updateAuthorizationState(Map<String, dynamic> response) {
    final previousState = _authorizationStateType;
    final state = response['authorization_state'];
    if (state is Map) {
      _authorizationStateType = state['@type']?.toString();
    } else if (response['@type']?.toString().startsWith('authorizationState') ==
        true) {
      _authorizationStateType = response['@type']?.toString();
    }
    if (_authorizationStateType != previousState) {
      for (final listener in List<VoidCallback>.from(
        _authorizationStateListeners,
      )) {
        listener();
      }
    }
  }

  TelegramUserInfo _userFromResponse(Map<String, dynamic> response) {
    final user = response['user'] is Map
        ? Map<String, dynamic>.from(response['user'] as Map)
        : response;
    return TelegramUserInfo(
      firstName: _stringValue(user['first_name']),
      lastName: _stringValue(user['last_name']),
      username: _stringValue(user['username']),
      phoneNumber: _stringValue(user['phone_number']),
      id: _intValue(user['id']),
      avatarPath: _avatarPath(user),
      accentColorId: _intValue(user['profile_accent_color_id']),
      backgroundCustomEmojiId: _intValue(
        user['profile_background_custom_emoji_id'],
      ),
      emojiStatusId: _emojiStatusId(user['emoji_status']),
      isPremium: user['is_premium'] == true,
      isVerified: user['is_verified'] == true,
    );
  }

  int? _emojiStatusId(dynamic value) {
    if (value is! Map || value['type'] is! Map) return null;
    return _intValue(value['type']['custom_emoji_id']);
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

  String? _avatarPath(Map<String, dynamic> user) {
    final photo = user['profile_photo'];
    final small = photo is Map ? photo['small'] : null;
    final local = small is Map ? small['local'] : null;
    final path = local is Map ? local['path'] : null;
    return path is String && path.isNotEmpty ? path : null;
  }
}

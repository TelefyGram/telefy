import 'dart:convert';
import 'dart:ffi';

import 'dart:io';

import 'package:ffi/ffi.dart';
import 'package:path_provider/path_provider.dart';

import 'tdlib.dart';

enum AuthenticationCodeResult { authorized, passwordRequired }

class TelegramUserInfo {
  final String? firstName;
  final String? lastName;
  final String? username;
  final String? phoneNumber;
  final int? id;

  const TelegramUserInfo({
    this.firstName,
    this.lastName,
    this.username,
    this.phoneNumber,
    this.id,
  });
}

class TelegramClient {
  final TdLibBindings _tdlib;
  late final Pointer<Void> _client;

  bool _disposed = false;
  bool _tdlibParametersSet = false;
  Future<void>? _initializationFuture;
  String? _authorizationStateType;
  int _requestSequence = 0;

  static const String apiIdValue = String.fromEnvironment('TELEGRAM_API_ID');
  static const String apiHash = String.fromEnvironment('TELEGRAM_API_HASH');

  TelegramClient() : _tdlib = TdLibBindings() {
    _client = _tdlib.create();
  }

  Future<void> initialize({
    required String systemLanguageCode,
    required String deviceModel,
    required String systemVersion,
    required String appVersion,
  }) {
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
    final nativeString = json.toNativeUtf8();

    try {
      _tdlib.send(_client, nativeString);
    } finally {
      calloc.free(nativeString);
    }
  }

  Future<void> setAuthenticationPhoneNumber({
    required String phoneNumber,
    bool allowFlashCall = false,
    bool allowMissedCall = false,
    bool isCurrentPhoneNumber = false,
    bool allowSmsRetrieverApi = false,
  }) async {
    if (!_tdlibParametersSet) {
      final initializationFuture = _initializationFuture;
      if (initializationFuture == null) {
        throw StateError('TDLib parameters must be set before authentication');
      }
      await initializationFuture;
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

    for (var attempt = 0; attempt < 60; attempt++) {
      final response = receive();
      if (response == null || response['@extra'] != requestId) {
        continue;
      }

      if (response['@type'] == 'error') {
        throw StateError(
          'Authentication code request failed: ${response['message']}',
        );
      }

      if (response['@type'] == 'ok') {
        return;
      }
    }

    throw StateError('Timed out waiting for authentication code request');
  }

  Future<AuthenticationCodeResult> checkAuthenticationCode({
    required String code,
  }) async {
    if (!_tdlibParametersSet) {
      throw StateError('TDLib parameters must be set before authentication');
    }

    final requestId = 'checkAuthenticationCode-${++_requestSequence}';
    send({
      '@type': 'checkAuthenticationCode',
      '@extra': requestId,
      'code': code,
    });

    for (var attempt = 0; attempt < 30; attempt++) {
      final response = receive();
      if (response == null || response['@extra'] != requestId) {
        continue;
      }

      if (response['@type'] == 'error') {
        throw StateError(
          'Authentication code check failed: ${response['message']}',
        );
      }

      if (response['@type'] == 'ok') {
        return _authorizationStateType == 'authorizationStateWaitPassword'
            ? AuthenticationCodeResult.passwordRequired
            : AuthenticationCodeResult.authorized;
      }
    }

    throw StateError('Timed out waiting for authentication code check');
  }

  Future<TelegramUserInfo> checkAuthenticationPassword({
    required String password,
  }) async {
    if (!_tdlibParametersSet) {
      throw StateError('TDLib parameters must be set before authentication');
    }

    final requestId = 'checkAuthenticationPassword-${++_requestSequence}';
    send({
      '@type': 'checkAuthenticationPassword',
      '@extra': requestId,
      'password': password,
    });

    for (var attempt = 0; attempt < 30; attempt++) {
      final response = receive();
      if (response == null || response['@extra'] != requestId) continue;
      if (response['@type'] == 'error') {
        throw StateError(
          'Authentication password check failed: ${response['message']}',
        );
      }
      if (response['@type'] == 'ok') return getMe();
    }

    throw StateError('Timed out waiting for authentication password check');
  }

  Future<TelegramUserInfo> getMe() async {
    final requestId = 'getMe-${++_requestSequence}';
    send({'@type': 'getMe', '@extra': requestId});

    for (var attempt = 0; attempt < 30; attempt++) {
      final response = receive();
      if (response == null || response['@extra'] != requestId) continue;
      if (response['@type'] == 'error') {
        throw StateError(
          'Failed to get account information: ${response['message']}',
        );
      }
      if (response['@type'] == 'user') {
        final usernames = response['usernames'];
        final activeUsernames = usernames is Map<String, dynamic>
            ? usernames['active_usernames']
            : null;
        final username = activeUsernames is List && activeUsernames.isNotEmpty
            ? activeUsernames.first as String?
            : response['username'] as String?;
        return TelegramUserInfo(
          firstName: response['first_name'] as String?,
          lastName: response['last_name'] as String?,
          username: username,
          phoneNumber: response['phone_number'] as String?,
          id: response['id'] as int?,
        );
      }
    }

    throw StateError('Timed out waiting for account information');
  }

  /// Receives the next response/update from TDLib
  /// Returns null if TDLib has returned nothing within the timeout
  Map<String, dynamic>? receive() {
    if (_disposed) {
      throw StateError('TelegramClient has already been disposed');
    }

    final result = _tdlib.receive(_client, 1.0);

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

    await _waitForResponse('setTdlibParameters');
    _tdlibParametersSet = true;

    const stateRequestId = 'getAuthorizationState';
    send({'@type': 'getAuthorizationState', '@extra': stateRequestId});
    await _waitForResponse(stateRequestId);
  }

  Future<Map<String, dynamic>> _waitForResponse(String requestId) async {
    for (var attempt = 0; attempt < 60; attempt++) {
      final response = receive();
      if (response == null || response['@extra'] != requestId) {
        continue;
      }

      if (response['@type'] == 'error') {
        throw StateError('TDLib request failed: ${response['message']}');
      }

      return response;
    }

    throw StateError('Timed out waiting for TDLib response: $requestId');
  }

  void dispose() {
    if (_disposed) {
      return;
    }

    _tdlib.destroy(_client);
    _disposed = true;
  }

  void _handleAuthorizationState(Map<String, dynamic> response) {
    final state = response['authorization_state'];
    if (state is! Map<String, dynamic>) {
      return;
    }

    _authorizationStateType = state['@type'] as String?;

    if (state['@type'] == 'authorizationStateWaitEncryptionKey') {
      send({
        '@type': 'checkDatabaseEncryptionKey',
        '@extra': 'checkDatabaseEncryptionKey',
        'encryption_key': '',
      });
    }
  }
}

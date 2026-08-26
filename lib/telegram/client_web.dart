import 'dart:js_util' as js_util;

import 'telegram_api.dart';

export 'telegram_api.dart';

class TelegramClient implements TelegramClientApi {
  late final dynamic _client;
  String? _authorizationStateType;
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
  }

  @override
  String? get authorizationStateType => _authorizationStateType;

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
    final response = await _send({
      '@type': 'checkAuthenticationCode',
      'code': code,
    });
    return response['@type'] == 'error' ||
            _authorizationStateType == 'authorizationStateWaitPassword'
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
    return _userFromResponse(await _send({'@type': 'getMe'}));
  }

  @override
  Future<void> logOut() async {
    await _send({'@type': 'logOut'});
    _authorizationStateType = null;
  }

  void dispose() {
    if (_disposed) return;
    _disposed = true;
    js_util.callMethod<void>(_client, 'close', const []);
  }

  Future<Map<String, dynamic>> _send(Map<String, dynamic> request) async {
    if (_disposed) throw StateError('TelegramClient has already been disposed');
    final promise = js_util.callMethod<dynamic>(_client, 'send', [
      js_util.jsify(request),
    ]);
    final response = js_util.dartify(
      await js_util.promiseToFuture<dynamic>(promise),
    );
    if (response is! Map)
      throw StateError('TDLib returned an invalid response');
    final result = Map<String, dynamic>.from(response);
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
    final state = response['authorization_state'];
    if (state is Map) {
      _authorizationStateType = state['@type']?.toString();
    } else if (response['@type']?.toString().startsWith('authorizationState') ==
        true) {
      _authorizationStateType = response['@type']?.toString();
    }
  }

  TelegramUserInfo _userFromResponse(Map<String, dynamic> response) {
    final user = response['user'] is Map
        ? Map<String, dynamic>.from(response['user'] as Map)
        : response;
    return TelegramUserInfo(
      firstName: user['first_name'] as String?,
      lastName: user['last_name'] as String?,
      username: user['username'] as String?,
      phoneNumber: user['phone_number'] as String?,
      id: user['id'] as int?,
    );
  }
}

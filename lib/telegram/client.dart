import 'dart:convert';
import 'dart:ffi';

import 'package:ffi/ffi.dart';
import 'package:path_provider/path_provider.dart';

import 'tdlib.dart';

class TelegramClient {
  final TdLibBindings _tdlib;
  late final Pointer<Void> _client;

  bool _disposed = false;

  static const int apiId = int.fromEnvironment('TELEGRAM_API_ID');

  static const String apiHash =
      String.fromEnvironment('TELEGRAM_API_HASH');

  TelegramClient() : _tdlib = TdLibBindings() {
    _client = _tdlib.create();
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

    send({
      '@type': 'setTdlibParameters',
      'parameters': {
        '@type': 'tdlibParameters',

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
      },
    });
  }

  void dispose() {
    if (_disposed) {
      return;
    }

    _tdlib.destroy(_client);
    _disposed = true;
  }
}
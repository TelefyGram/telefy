import 'package:flutter/foundation.dart';

class AppLogger {
  static dynamic get currentFile => null;

  static Future<void> initialize() async {
    FlutterError.onError = (details) {
      debugPrint(
        _redactCredentials(
          'FlutterError: ${details.exception}\n${details.stack}',
        ),
      );
      FlutterError.presentError(details);
    };
    PlatformDispatcher.instance.onError = (error, stack) {
      debugPrint(_redactCredentials('Unhandled error: $error\n$stack'));
      return false;
    };
  }

  static void log(String message) {
    debugPrint(_redactCredentials(message));
  }

  static String _redactCredentials(String message) {
    return message.replaceAllMapped(
      RegExp(
        r'((?:TELEGRAM_API_ID|TELEGRAM_API_HASH|api_id|api_hash)\s*[:=]\s*)([^,\s}\]]+)',
        caseSensitive: false,
      ),
      (match) => '${match.group(1)}<redacted>',
    );
  }
}

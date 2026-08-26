import 'package:flutter/foundation.dart';

class AppLogger {
  static Future<void> initialize() async {
    FlutterError.onError = (details) {
      debugPrint('FlutterError: ${details.exception}\n${details.stack}');
      FlutterError.presentError(details);
    };
    PlatformDispatcher.instance.onError = (error, stack) {
      debugPrint('Unhandled error: $error\n$stack');
      return false;
    };
  }

  static void log(String message) {
    debugPrint(message);
  }
}

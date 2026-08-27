import 'package:flutter/foundation.dart';

import 'dart:html' as html;

class AppLogger {
  static final StringBuffer _buffer = StringBuffer();
  static void Function(String? message, {int? wrapWidth})? _previousDebugPrint;

  static dynamic get currentFile => null;

  static Future<void> initialize() async {
    _previousDebugPrint = debugPrint;
    debugPrint = (message, {wrapWidth}) {
      if (message != null) {
        _append(message);
      }
      _previousDebugPrint?.call(message, wrapWidth: wrapWidth);
    };
    FlutterError.onError = (details) {
      log('FlutterError: ${details.exception}\n${details.stack}');
      FlutterError.presentError(details);
    };
    PlatformDispatcher.instance.onError = (error, stack) {
      log('Unhandled error: $error\n$stack');
      return false;
    };
  }

  static void log(String message) {
    final safeMessage = _redactCredentials(message);
    _append(safeMessage);
    _previousDebugPrint?.call(safeMessage);
  }

  static void _append(String message) {
    _buffer.writeln('${DateTime.now().toUtc().toIso8601String()} $message');
  }

  static Future<bool> exportLog() async {
    final content = _buffer.isEmpty
        ? '--- Telefy web log is empty ---\n'
        : _buffer.toString();
    try {
      await html.window.navigator.clipboard?.writeText(content);
    } on Object {
      // Clipboard permissions may be unavailable outside a secure context.
    }
    final blob = html.Blob([content], 'text/plain;charset=utf-8');
    final url = html.Url.createObjectUrlFromBlob(blob);
    final anchor = html.AnchorElement(href: url)
      ..download = 'telefy.log'
      ..click();
    anchor.remove();
    html.Url.revokeObjectUrl(url);
    return true;
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

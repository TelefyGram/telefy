import 'dart:async';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';

class AppLogger {
  static const _retention = Duration(minutes: 30);
  static File? _file;
  static Future<void> _writeQueue = Future<void>.value();
  static void Function(String? message, {int? wrapWidth})? _previousDebugPrint;

  static Future<void> initialize() async {
    final supportDirectory = await getApplicationSupportDirectory();
    final logsDirectory = Directory('${supportDirectory.path}/logs');
    await logsDirectory.create(recursive: true);
    await _removeExpiredLogs(logsDirectory);

    final timestamp = DateTime.now().toUtc().toIso8601String();
    final file = File(
      '${logsDirectory.path}/telefy-${DateTime.now().millisecondsSinceEpoch}.log',
    );
    _file = file;
    await file.writeAsString('--- Telefy start $timestamp ---\n');

    _previousDebugPrint = debugPrint;
    debugPrint = (message, {wrapWidth}) {
      final safeMessage = message == null ? null : _redactCredentials(message);
      _previousDebugPrint?.call(safeMessage, wrapWidth: wrapWidth);
      if (safeMessage != null) {
        log(safeMessage);
      }
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
    final file = _file;
    if (file == null) return;

    final safeMessage = _redactCredentials(message);
    final line = '${DateTime.now().toUtc().toIso8601String()} $safeMessage\n';
    _writeQueue = _writeQueue.then((_) async {
      await _removeExpiredLogs(file.parent);
      await file.writeAsString(line, mode: FileMode.append, flush: true);
    });
  }

  static File? get currentFile => _file;

  static Future<bool> exportLog() async {
    final file = _file;
    if (file == null || !await file.exists()) return false;
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

  static Future<void> _removeExpiredLogs(Directory directory) async {
    final threshold = DateTime.now().subtract(_retention);
    await for (final entity in directory.list()) {
      if (entity is! File || !entity.path.endsWith('.log')) continue;
      final modified = await entity.lastModified();
      if (modified.isBefore(threshold)) {
        await entity.delete();
      }
    }
  }
}

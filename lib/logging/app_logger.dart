import 'dart:async';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';

class AppLogger {
  static const _retention = Duration(minutes: 30);
  static File? _file;
  static Future<void> _writeQueue = Future<void>.value();
  static final StringBuffer _pendingLines = StringBuffer();
  static Timer? _flushTimer;
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
    log('logger.initialized path=${file.path}');

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
    _pendingLines.write('${DateTime.now().toUtc().toIso8601String()} ');
    _pendingLines.writeln(safeMessage);
    _flushTimer ??= Timer(const Duration(milliseconds: 120), _flush);
  }

  static void _flush() {
    _flushTimer = null;
    if (_pendingLines.isEmpty) return;
    final file = _file;
    if (file == null) return;
    final lines = _pendingLines.toString();
    _pendingLines.clear();
    _writeQueue = _writeQueue.then((_) async {
      try {
        await file.writeAsString(lines, mode: FileMode.append);
      } on Object catch (error, stack) {
        _previousDebugPrint?.call('Log write failed: $error\n$stack');
      }
    });
    if (_pendingLines.isNotEmpty) {
      _flushTimer ??= Timer(const Duration(milliseconds: 120), _flush);
    }
  }

  static void event(String name, [Map<String, Object?> fields = const {}]) {
    final details = fields.entries
        .map((entry) => '${entry.key}=${_safeValue(entry.value)}')
        .join(' ');
    log(details.isEmpty ? name : '$name $details');
  }

  static void exception(String name, Object error, StackTrace stack) {
    event(name, {'error': error, 'stack': stack});
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

  static String _safeValue(Object? value) {
    if (value == null) return 'null';
    final text = value.toString();
    if (text.length <= 240) return _redactCredentials(text);
    return '${_redactCredentials(text.substring(0, 240))}...';
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

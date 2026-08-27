import 'dart:async';
import 'dart:html' as html;

import '../logging/app_logger_platform.dart';

void startPingService({required String url, required Duration interval}) {
  Future<void> check() async {
    try {
      final response = await html.HttpRequest.getString(url);
      AppLogger.log(
        'The server is ready to work. Available modules: $response',
      );
    } on Object catch (error) {
      AppLogger.log('Ping failed: $error');
    }
  }

  unawaited(check());
  Timer.periodic(interval, (_) => unawaited(check()));
}

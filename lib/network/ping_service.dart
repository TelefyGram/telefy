import 'ping_service_stub.dart' if (dart.library.html) 'ping_service_web.dart';

class PingService {
  static void start({
    required String url,
    Duration interval = const Duration(seconds: 10),
  }) {
    startPingService(url: url, interval: interval);
  }
}

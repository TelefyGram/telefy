import 'package:flutter/widgets.dart';

import 'app.dart';
import 'logging/app_logger_platform.dart';
import 'tdlib/client.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    await AppLogger.initialize();
  } on Object catch (error, stack) {
    debugPrint('Не удалось включить файловое логирование: $error\n$stack');
  }

  final client = TelegramClient();
  runApp(TelefyApp(client: client));
}

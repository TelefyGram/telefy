import 'package:flutter/widgets.dart';

import 'app.dart';
import 'logging/app_logger_platform.dart';
import 'tdlib/client.dart';
import 'translations/translation.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Translations.setLanguage('en');

  AppLogger.initialize().then<void>(
    (_) {},
    onError: (Object error, StackTrace stack) {
      debugPrint('Failed to enable file logging: $error\n$stack');
    },
  );

  final client = TelegramClient();
  runApp(TelefyApp(client: client));
}

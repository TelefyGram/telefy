import 'package:flutter/widgets.dart';

import 'app.dart';
import 'logging/app_logger_platform.dart';
import 'network/ping_service.dart';
import 'tdlib/client.dart';
import 'translations/translation.dart';
import 'internal/ui/theme_controller.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await AppLogger.initialize();
  AppLogger.event('app.start');
  await Translations.loadFallbacks();
  AppLogger.event('translations.fallbacks_loaded');
  await Translations.setLanguage('en');
  AppLogger.event('translations.language_set', {'language': 'en'});
  await ThemeController.load();
  AppLogger.event('theme.loaded', {
    'theme': ThemeController.selectedName.value,
  });
  Translations.startAutoReload();
  PingService.start(
    url: const String.fromEnvironment(
      'SERVER_URL',
      defaultValue: 'http://localhost:16100/ping',
    ),
  );

  final client = TelegramClient();
  AppLogger.event('tdlib.client_created');
  runApp(TelefyApp(client: client));
  AppLogger.event('app.run_app');
}

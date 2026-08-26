import 'dart:io';

import 'package:flutter/widgets.dart';

import 'app.dart';
import 'telegram/client.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final client = TelegramClient();
  runApp(TelefyApp(client: client));

  try {
    await client.initialize(
      systemLanguageCode: 'ru',
      deviceModel: Platform.operatingSystem,
      systemVersion: Platform.operatingSystemVersion,
      appVersion: '1.0.0',
    );
  } on Object catch (error) {
    debugPrint('TDLib не инициализирован: $error');
  }
}

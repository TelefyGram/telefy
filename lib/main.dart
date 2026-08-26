import 'package:flutter/widgets.dart';

import 'app.dart';
import 'telegram/client.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final client = TelegramClient();
  runApp(TelefyApp(client: client));
}

import 'package:flutter/material.dart';

import 'telegram/client.dart';
import 'ui/screens/auth/hello_screen.dart';

class TelefyApp extends StatefulWidget {
  final TelegramClient client;

  const TelefyApp({required this.client, super.key});

  @override
  State<TelefyApp> createState() => _TelefyAppState();
}

class _TelefyAppState extends State<TelefyApp> {
  @override
  void dispose() {
    widget.client.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Telefy',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: OnboardingScreen(client: widget.client),
    );
  }
}

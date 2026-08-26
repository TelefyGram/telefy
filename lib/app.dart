import 'dart:io';

import 'package:flutter/material.dart';

import 'telegram/client.dart';
import 'ui/screens/auth/hello_screen.dart';
import 'ui/screens/home/profile.dart';

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
        scaffoldBackgroundColor: Colors.white,
        useMaterial3: true,
      ),
      home: _AuthGate(client: widget.client),
    );
  }
}

class _AuthGate extends StatelessWidget {
  final TelegramClient client;

  const _AuthGate({required this.client});

  Future<void> _initialize() {
    return client.initialize(
      systemLanguageCode: 'ru',
      deviceModel: Platform.operatingSystem,
      systemVersion: Platform.operatingSystemVersion,
      appVersion: '1.0.0',
    );
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<void>(
      future: _initialize(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            backgroundColor: Colors.white,
            body: Center(child: CircularProgressIndicator()),
          );
        }

        if (snapshot.hasError) {
          debugPrint('TDLib не инициализирована: ${snapshot.error}');
        }

        return client.authorizationStateType == 'authorizationStateReady'
            ? ProfileScreen(client: client)
            : OnboardingScreen(client: client);
      },
    );
  }
}

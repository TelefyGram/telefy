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
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            minimumSize: const Size(0, 56),
            padding: const EdgeInsets.symmetric(horizontal: 24),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(18),
            ),
            textStyle: const TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w600,
            ),
            animationDuration: const Duration(milliseconds: 200),
          ),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            minimumSize: const Size(0, 56),
            padding: const EdgeInsets.symmetric(horizontal: 24),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(18),
            ),
            textStyle: const TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w600,
            ),
            animationDuration: const Duration(milliseconds: 200),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(0, 56),
            padding: const EdgeInsets.symmetric(horizontal: 24),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(18),
            ),
            textStyle: const TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w600,
            ),
            animationDuration: const Duration(milliseconds: 200),
          ),
        ),
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            minimumSize: const Size(0, 56),
            padding: const EdgeInsets.symmetric(horizontal: 24),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(18),
            ),
            textStyle: const TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w600,
            ),
            animationDuration: const Duration(milliseconds: 200),
          ),
        ),
        iconButtonTheme: IconButtonThemeData(
          style: IconButton.styleFrom(
            minimumSize: const Size(56, 56),
            padding: const EdgeInsets.all(16),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(18),
            ),
            animationDuration: const Duration(milliseconds: 200),
          ),
        ),
      ),
      home: _AuthGate(client: widget.client),
    );
  }
}

class _AuthGate extends StatefulWidget {
  final TelegramClient client;

  const _AuthGate({required this.client});

  @override
  State<_AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<_AuthGate> {
  late final Future<void> _initializationFuture;

  TelegramClient get client => widget.client;

  @override
  void initState() {
    super.initState();
    _initializationFuture = _initialize();
  }

  Future<void> _initialize() {
    return client.initialize(
      systemLanguageCode: 'ru',
      deviceModel: Platform.operatingSystem,
      systemVersion: Platform.operatingSystemVersion,
      appVersion: '0.0.1',
    );
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<void>(
      future: _initializationFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return OnboardingScreen(client: client);
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

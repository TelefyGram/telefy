import 'package:flutter/material.dart';

import 'ui/screens/auth/hello_screen.dart';

class TelefyApp extends StatelessWidget {
  const TelefyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Telefy',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.blue,
        ),
        useMaterial3: true,
      ),
      home: const OnboardingScreen(),
    );
  }
}
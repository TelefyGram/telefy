import 'package:flutter/material.dart';

void main() {
  runApp(const TelegramApp());
}

class TelegramApp extends StatelessWidget {
  const TelegramApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'telefy',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.blue,
        ),
        useMaterial3: true,
      ),
      home: const ChatWindow(),
    );
  }
}

class ChatWindow extends StatelessWidget {
  const ChatWindow({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('telefy'),
      ),

      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Мои чаты',
              style: TextStyle(fontSize: 24),
            ),

            const SizedBox(height: 20),

            ElevatedButton(
              onPressed: () {
                print('Нажали!');
              },
              child: const Text('Нажми меня'),
            ),
          ],
        ),
      ),
    );
  }
}
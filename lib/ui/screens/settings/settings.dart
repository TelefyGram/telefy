import 'package:flutter/material.dart';
import 'package:share_plus/share_plus.dart';

import '../../../logging/app_logger_platform.dart';
import '../../../translations/translation.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  Future<void> _shareLog(BuildContext context) async {
    final file = AppLogger.currentFile;
    if (file == null || !await file.exists()) {
      if (context.mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(tr('settings.logUnavailable'))));
      }
      return;
    }

    await SharePlus.instance.share(
      ShareParams(
        files: [XFile(file.path)],
        subject: 'Telefy log',
        text: 'Telefy application log',
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(tr('settings.title'))),
      body: ListView(
        children: [
          ListTile(
            leading: const Icon(Icons.description_outlined),
            title: Text(tr('settings.exportLog')),
            subtitle: Text(tr('settings.exportLogDescription')),
            onTap: () => _shareLog(context),
          ),
        ],
      ),
    );
  }
}

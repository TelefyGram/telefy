import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart';
import 'package:share_plus/share_plus.dart';

import 'app_logger_platform.dart';
import '../translations/translation.dart';

class LogExporter {
  const LogExporter._();

  static Future<void> share(BuildContext context) async {
    if (kIsWeb) {
      await AppLogger.exportLog();
      if (context.mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(tr('settings.logExported'))));
      }
      return;
    }
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
}

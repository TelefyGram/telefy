import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widget_previews.dart';

import 'ui/widgets/animation.dart';
import 'ui/widgets/dialog.dart';
import 'ui/widgets/loading.dart';
import 'translations/translation.dart';
import 'internal/ui/app_theme.dart';
import 'ui/widgets/telefy_controls.dart';

@Preview(name: 'Loading', group: 'Telefy widgets', size: Size(160, 120))
Widget loadingPreview() {
  return const Center(child: Loading(size: 48));
}

@Preview(name: 'Telefy controls', group: 'Telefy widgets', size: Size(420, 260))
Widget telefyControlsPreview() {
  return MaterialApp(
    theme: buildTelefyTheme(),
    home: Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TelefyTextField(hintText: tr('chats.messageHint')),
            const SizedBox(height: 12),
            TelefyPrimaryButton(
              onPressed: () {},
              child: Text(tr('chats.send')),
            ),
          ],
        ),
      ),
    ),
  );
}

@Preview(
  name: 'Duck communicate animation',
  group: 'Telefy widgets',
  size: Size(220, 220),
)
Widget duckCommunicateAnimationPreview() {
  return const Center(child: DuckCommunicateAnimation(size: 160));
}

@Preview(name: 'Dialog', group: 'Telefy widgets', size: Size(480, 320))
Widget dialogPreview() {
  return MaterialApp(
    theme: buildTelefyTheme(),
    home: Scaffold(
      body: Center(
        child: FilledButton(
          onPressed: () {
            TelefyDialog.show(
              navigatorKey.currentContext!,
              title: tr('preview.dialogTitle'),
              message: tr('preview.dialogMessage'),
              actions: [
                TelefyDialogAction(
                  label: tr('preview.cancel'),
                  onPressed: () {},
                  shortcut: const SingleActivator(LogicalKeyboardKey.escape),
                ),
                TelefyDialogAction(
                  label: tr('preview.delete'),
                  onPressed: () {},
                  shortcut: const SingleActivator(LogicalKeyboardKey.enter),
                ),
              ],
            );
          },
          child: Text(tr('preview.openDialog')),
        ),
      ),
    ),
    navigatorKey: navigatorKey,
  );
}

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widget_previews.dart';

import 'ui/widgets/animation.dart';
import 'ui/widgets/dialog.dart';
import 'ui/widgets/loading.dart';

@Preview(name: 'Loading', group: 'Telefy widgets', size: Size(160, 120))
Widget loadingPreview() {
  return const Center(child: Loading(size: 48));
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
    theme: ThemeData(useMaterial3: true),
    home: Scaffold(
      body: Center(
        child: FilledButton(
          onPressed: () {
            TelefyDialog.show(
              navigatorKey.currentContext!,
              title: 'Удалить черновик?',
              message: 'Это действие нельзя отменить.',
              actions: [
                TelefyDialogAction(
                  label: 'Отмена',
                  onPressed: () {},
                  shortcut: const SingleActivator(LogicalKeyboardKey.escape),
                ),
                TelefyDialogAction(
                  label: 'Удалить',
                  onPressed: () {},
                  shortcut: const SingleActivator(LogicalKeyboardKey.enter),
                ),
              ],
            );
          },
          child: const Text('Открыть диалог'),
        ),
      ),
    ),
    navigatorKey: navigatorKey,
  );
}

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

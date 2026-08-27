import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../logging/log_exporter.dart';
import '../../translations/translation.dart';

class TelefyDialogAction {
  final String label;
  final VoidCallback onPressed;
  final ShortcutActivator? shortcut;

  const TelefyDialogAction({
    required this.label,
    required this.onPressed,
    this.shortcut,
  });
}

class TelefyDialog {
  const TelefyDialog._();

  static Future<void> show(
    BuildContext context, {
    required String title,
    required String message,
    required List<TelefyDialogAction> actions,
    bool includeLogAction = false,
  }) {
    final dialogActions = includeLogAction
        ? [
            TelefyDialogAction(
              label: tr('settings.exportLog'),
              shortcut: const SingleActivator(LogicalKeyboardKey.keyL),
              onPressed: () => unawaited(LogExporter.share(context)),
            ),
            ...actions,
          ]
        : actions;
    return showGeneralDialog<void>(
      context: context,
      barrierDismissible: false,
      barrierLabel: 'Диалоговое окно',
      barrierColor: Colors.black26,
      transitionDuration: const Duration(milliseconds: 180),
      pageBuilder: (context, animation, secondaryAnimation) {
        return _TelefyDialogBody(
          title: title,
          message: message,
          actions: dialogActions,
        );
      },
      transitionBuilder: (context, animation, secondaryAnimation, child) {
        final curvedAnimation = CurvedAnimation(
          parent: animation,
          curve: Curves.easeOutCubic,
          reverseCurve: Curves.easeInCubic,
        );
        return FadeTransition(
          opacity: curvedAnimation,
          child: ScaleTransition(
            scale: Tween<double>(begin: 0.96, end: 1).animate(curvedAnimation),
            child: child,
          ),
        );
      },
    );
  }
}

class _TelefyDialogBody extends StatefulWidget {
  final String title;
  final String message;
  final List<TelefyDialogAction> actions;

  const _TelefyDialogBody({
    required this.title,
    required this.message,
    required this.actions,
  });

  @override
  State<_TelefyDialogBody> createState() => _TelefyDialogBodyState();
}

class _TelefyDialogBodyState extends State<_TelefyDialogBody> {
  final FocusNode _focusNode = FocusNode();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _focusNode.requestFocus();
      }
    });
  }

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  void _invoke(TelefyDialogAction action) {
    Navigator.of(context).pop();
    action.onPressed();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Focus(
      focusNode: _focusNode,
      autofocus: true,
      onKeyEvent: (node, event) {
        for (final action in widget.actions) {
          final shortcut = action.shortcut;
          if (shortcut != null &&
              shortcut.accepts(event, HardwareKeyboard.instance)) {
            _invoke(action);
            return KeyEventResult.handled;
          }
        }
        return KeyEventResult.ignored;
      },
      child: Center(
        child: Material(
          color: Colors.transparent,
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 24),
              padding: const EdgeInsets.fromLTRB(24, 24, 16, 12),
              decoration: BoxDecoration(
                color: theme.colorScheme.surface,
                borderRadius: BorderRadius.circular(22),
                boxShadow: const [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 18,
                    offset: Offset(0, 6),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.title,
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    widget.message,
                    style: theme.textTheme.bodyLarge?.copyWith(
                      color: theme.colorScheme.onSurfaceVariant,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Align(
                    alignment: Alignment.centerRight,
                    child: Wrap(
                      alignment: WrapAlignment.end,
                      children: widget.actions
                          .map(
                            (action) => TextButton(
                              onPressed: () => _invoke(action),
                              style: TextButton.styleFrom(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                ),
                                minimumSize: const Size(0, 40),
                                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              ),
                              child: Text(action.label),
                            ),
                          )
                          .toList(),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

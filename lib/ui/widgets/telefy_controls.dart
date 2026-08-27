import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../internal/ui/theme_controller.dart';

class TelefyPrimaryButton extends StatelessWidget {
  final VoidCallback? onPressed;
  final Widget child;

  const TelefyPrimaryButton({
    required this.onPressed,
    required this.child,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    final configuredHeight = Theme.of(context)
        .filledButtonTheme
        .style
        ?.minimumSize
        ?.resolve({})
        ?.height;
    return SizedBox(
      height: configuredHeight ?? TelefyUiConfig.buttonHeight,
      width: double.infinity,
      child: FilledButton(onPressed: onPressed, child: child),
    );
  }
}

class TelefyTextField extends StatelessWidget {
  final TextEditingController? controller;
  final String? hintText;
  final TextInputAction? textInputAction;
  final TextInputType? keyboardType;
  final ValueChanged<String>? onSubmitted;
  final List<TextInputFormatter>? inputFormatters;

  const TelefyTextField({
    this.controller,
    this.hintText,
    this.textInputAction,
    this.keyboardType,
    this.onSubmitted,
    this.inputFormatters,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      textInputAction: textInputAction,
      inputFormatters: inputFormatters,
      onSubmitted: onSubmitted,
      decoration: InputDecoration(hintText: hintText),
    );
  }
}

class TelefyPanel extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;

  const TelefyPanel({required this.child, this.padding, super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.zero,
      child: Padding(
        padding: padding ?? EdgeInsets.all(TelefyUiConfig.pagePadding / 2),
        child: child,
      ),
    );
  }
}

class TelefyEmptyState extends StatelessWidget {
  final String message;

  const TelefyEmptyState({required this.message, super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: EdgeInsets.all(TelefyUiConfig.pagePadding),
        child: Text(
          message,
          textAlign: TextAlign.center,
          style: TextStyle(color: TelefyUiConfig.secondaryText),
        ),
      ),
    );
  }
}

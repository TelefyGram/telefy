import 'package:flutter/material.dart';

import '../../internal/ui/theme_controller.dart';

class TelefyAuthNotice extends StatelessWidget {
  final Widget child;

  const TelefyAuthNotice({required this.child, super.key});

  @override
  Widget build(BuildContext context) {
    final color = TelefyUiConfig.danger;
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        horizontal: TelefyUiConfig.authNoticeHorizontalPadding,
        vertical: TelefyUiConfig.authNoticeVerticalPadding,
      ),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.07),
        border: Border.all(color: color.withValues(alpha: 0.35)),
        borderRadius: BorderRadius.circular(TelefyUiConfig.authNoticeRadius),
      ),
      child: child,
    );
  }
}

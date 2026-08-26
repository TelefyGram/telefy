import 'package:flutter/material.dart';

class Loading extends StatelessWidget {
  final double size;
  final Color? color;

  const Loading({super.key, this.size = 34, this.color});

  @override
  Widget build(BuildContext context) {
    return SizedBox.square(
      dimension: size,
      child: CircularProgressIndicator(
        color: color ?? Theme.of(context).colorScheme.primary,
        strokeWidth: size >= 64 ? 4 : 3,
      ),
    );
  }
}

import 'dart:math' as math;

import 'package:flutter/material.dart';

class Loading extends StatefulWidget {
  final double size;
  final Color? color;

  const Loading({super.key, this.size = 34, this.color});

  @override
  State<Loading> createState() => _LoadingState();
}

class _LoadingState extends State<Loading> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3000),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox.square(
      dimension: widget.size,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return CustomPaint(
            painter: _GeometricLoadingPainter(
              progress: _controller.value,
              color: widget.color ?? Theme.of(context).colorScheme.primary,
            ),
          );
        },
      ),
    );
  }
}

class _GeometricLoadingPainter extends CustomPainter {
  final double progress;
  final Color color;

  const _GeometricLoadingPainter({required this.progress, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.shortestSide * 0.31;
    final count = 12;

    for (var index = 0; index < count; index++) {
      final phase = (progress + index / count) % 1;
      final angle = phase * math.pi * 2 - math.pi / 2;
      final figureCenter =
          center + Offset(math.cos(angle) * radius, math.sin(angle) * radius);
      final opacity = 0.3 + 0.7 * math.pow(phase, 1.8).toDouble();
      final figureSize = size.shortestSide * (0.075 + 0.035 * phase);
      final paint = Paint()
        ..color = color.withValues(alpha: opacity)
        ..style = PaintingStyle.fill;

      canvas.drawCircle(figureCenter, figureSize, paint);
    }

    final corePaint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.shortestSide * 0.09
      ..strokeCap = StrokeCap.round;
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: size.shortestSide * 0.22),
      progress * math.pi * 2,
      math.pi * 1.35,
      false,
      corePaint,
    );
  }

  @override
  bool shouldRepaint(_GeometricLoadingPainter oldDelegate) {
    return oldDelegate.progress != progress || oldDelegate.color != color;
  }
}

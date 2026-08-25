import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

class DuckAnimation extends StatelessWidget {
  const DuckAnimation({
    super.key,
    this.size = 140,
  });

  final double size;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Lottie.asset(
        'assets/animations/duck.tgs',
        decoder: LottieComposition.decodeGZip,
        fit: BoxFit.contain,
        repeat: true,
        animate: true,
      ),
    );
  }
}

class DuckCommunicateAnimation extends StatelessWidget {
  const DuckCommunicateAnimation({
    super.key,
    this.size = 140,
  });

  final double size;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Lottie.asset(
        'assets/animations/communicate.tgs',
        decoder: LottieComposition.decodeGZip,
        fit: BoxFit.contain,
        repeat: true,
        animate: true,
      ),
    );
  }
}
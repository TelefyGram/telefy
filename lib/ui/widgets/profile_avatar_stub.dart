import 'package:flutter/material.dart';

Widget buildProfileAvatar({
  required String? path,
  required String fallback,
  required double radius,
  required Color backgroundColor,
  required Color foregroundColor,
}) {
  return CircleAvatar(
    radius: radius,
    backgroundColor: backgroundColor,
    child: Text(
      fallback,
      style: TextStyle(
        fontSize: radius * .78,
        color: foregroundColor,
        fontWeight: FontWeight.w700,
      ),
    ),
  );
}

Widget buildProfileImage(String path) => const SizedBox.shrink();

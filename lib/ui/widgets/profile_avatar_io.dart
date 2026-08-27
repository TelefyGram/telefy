import 'dart:io';

import 'package:flutter/material.dart';

Widget buildProfileAvatar({
  required String? path,
  required String fallback,
  required double radius,
  required Color backgroundColor,
  required Color foregroundColor,
}) {
  final image = path == null || path.isEmpty ? null : FileImage(File(path));
  return CircleAvatar(
    radius: radius,
    backgroundColor: backgroundColor,
    backgroundImage: image,
    child: image == null
        ? Text(
            fallback,
            style: TextStyle(
              fontSize: radius * .78,
              color: foregroundColor,
              fontWeight: FontWeight.w700,
            ),
          )
        : null,
  );
}

Widget buildProfileImage(String path) {
  return Image.file(File(path), fit: BoxFit.contain);
}

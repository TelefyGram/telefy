import 'package:flutter/material.dart';

import 'profile_avatar_stub.dart' if (dart.library.io) 'profile_avatar_io.dart';

Widget profileAvatar({
  required String? path,
  required String fallback,
  required double radius,
  required Color backgroundColor,
  required Color foregroundColor,
}) {
  return buildProfileAvatar(
    path: path,
    fallback: fallback,
    radius: radius,
    backgroundColor: backgroundColor,
    foregroundColor: foregroundColor,
  );
}

Widget profileImage(String path) => buildProfileImage(path);

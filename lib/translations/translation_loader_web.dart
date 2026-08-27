import 'dart:html' as html;

import 'package:flutter/services.dart';

Future<String> loadTranslationJsonImpl(
  String languageCode,
  String assetPath,
) async {
  try {
    final cacheBust = DateTime.now().millisecondsSinceEpoch;
    return await html.HttpRequest.getString(
      '/translations/$languageCode.json?v=$cacheBust',
    );
  } on Object {
    return rootBundle.loadString(assetPath);
  }
}

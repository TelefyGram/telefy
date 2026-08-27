import 'dart:html' as html;

import 'package:flutter/services.dart';

Future<String> loadTranslationJsonImpl(
  String languageCode,
  String assetPath,
) async {
  const translationsBaseUrl = String.fromEnvironment('TRANSLATIONS_URL');
  if (translationsBaseUrl.isEmpty) {
    return rootBundle.loadString(assetPath);
  }

  try {
    final cacheBust = DateTime.now().millisecondsSinceEpoch;
    return await html.HttpRequest.getString(
      '$translationsBaseUrl/$languageCode.json?v=$cacheBust',
    );
  } on Object {
    return rootBundle.loadString(assetPath);
  }
}

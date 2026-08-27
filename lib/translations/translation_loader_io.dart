import 'package:flutter/services.dart';

Future<String> loadTranslationJsonImpl(String languageCode, String assetPath) {
  return rootBundle.loadString(assetPath);
}

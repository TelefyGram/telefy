import 'dart:convert';

import 'package:flutter/services.dart';

class TranslationModel {
  final Map<String, dynamic> _values;

  const TranslationModel(this._values);

  String get(String key) {
    dynamic value = _values;
    for (final part in key.split('.')) {
      if (value is! Map<String, dynamic> || !value.containsKey(part)) {
        return key;
      }
      value = value[part];
    }
    return value is String ? value : key;
  }
}

class Translations {
  static TranslationModel _current = const TranslationModel({});
  static String _languageCode = 'ru';

  static const languages = <String, String>{
    'ru': 'assets/translations/ru.json',
    'en': 'assets/translations/en.json',
  };

  static String get languageCode => _languageCode;

  static Future<void> load(String assetPath) async {
    final json = await rootBundle.loadString(assetPath);
    final decoded = jsonDecode(json);
    if (decoded is! Map) {
      throw const FormatException('Translation JSON must contain an object');
    }
    _current = TranslationModel(Map<String, dynamic>.from(decoded));
  }

  static Future<void> setLanguage(String languageCode) async {
    final assetPath = languages[languageCode];
    if (assetPath == null) {
      throw ArgumentError.value(languageCode, 'languageCode');
    }
    await load(assetPath);
    _languageCode = languageCode;
  }

  static String get languageName => tr('language.name');
  static String get languageShort => tr('language.short');

  static String get otherLanguageShort {
    return _languageCode == 'ru' ? 'EN' : 'RU';
  }

  static String tr(String key) => _current.get(key);
}

String tr(String key) => Translations.tr(key);

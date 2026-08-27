import 'dart:convert';
import 'dart:async';

import 'package:flutter/foundation.dart';

import 'translation_loader.dart';

class TranslationModel {
  final Map<String, dynamic> _values;

  const TranslationModel(this._values);

  String? find(String key) {
    dynamic value = _values;
    for (final part in key.split('.')) {
      if (value is! Map<String, dynamic> || !value.containsKey(part)) {
        return null;
      }
      value = value[part];
    }
    return value is String ? value : null;
  }

  String get(String key) {
    return find(key) ?? key;
  }
}

class Translations {
  static TranslationModel _current = const TranslationModel({});
  static TranslationModel _english = const TranslationModel({});
  static TranslationModel _russian = const TranslationModel({});
  static String _languageCode = 'ru';
  static final List<VoidCallback> _listeners = [];
  static Timer? _reloadTimer;

  static const languages = <String, String>{
    'ru': 'assets/translations/ru.json',
    'en': 'assets/translations/en.json',
  };

  static String get languageCode => _languageCode;

  static Future<void> load(String assetPath) async {
    _current = await _loadModel(assetPath);
    _notifyListeners();
  }

  static Future<void> setLanguage(String languageCode) async {
    final assetPath = languages[languageCode];
    if (assetPath == null) {
      throw ArgumentError.value(languageCode, 'languageCode');
    }
    final selected = await _loadModel(assetPath);
    _current = selected;
    _languageCode = languageCode;
    _notifyListeners();
  }

  static Future<void> loadFallbacks() async {
    _english = await _loadModel(languages['en']!);
    _russian = await _loadModel(languages['ru']!);
  }

  static void startAutoReload({
    Duration interval = const Duration(seconds: 5),
  }) {
    _reloadTimer?.cancel();
    _reloadTimer = Timer.periodic(interval, (_) => _reloadRemote());
  }

  static void addListener(VoidCallback listener) => _listeners.add(listener);

  static void removeListener(VoidCallback listener) =>
      _listeners.remove(listener);

  static Future<void> _reloadRemote() async {
    try {
      final english = await _loadModel(languages['en']!);
      final russian = await _loadModel(languages['ru']!);
      final current = await _loadModel(languages[_languageCode]!);
      _english = english;
      _russian = russian;
      _current = current;
      _notifyListeners();
    } on Object {
      // Keep the last valid translations when the server is unavailable.
    }
  }

  static void _notifyListeners() {
    for (final listener in List<VoidCallback>.from(_listeners)) {
      listener();
    }
  }

  static Future<TranslationModel> _loadModel(String assetPath) async {
    final languageCode = languages.entries
        .firstWhere(
          (entry) => entry.value == assetPath,
          orElse: () => const MapEntry('custom', ''),
        )
        .key;
    final json = await loadTranslationJson(languageCode, assetPath);
    final decoded = jsonDecode(json);
    if (decoded is! Map) {
      throw const FormatException('Translation JSON must contain an object');
    }
    return TranslationModel(Map<String, dynamic>.from(decoded));
  }

  static String get languageName => tr('language.name');
  static String get languageShort => tr('language.short');

  static String get otherLanguageShort {
    return _languageCode == 'ru' ? 'EN' : 'RU';
  }

  static String tr(String key) {
    return _current.find(key) ?? _english.find(key) ?? _russian.get(key);
  }
}

String tr(String key) => Translations.tr(key);

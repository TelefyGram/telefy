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
  static bool _reloadInProgress = false;
  static bool _fallbacksLoaded = false;

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
    final selected = _fallbacksLoaded
        ? languageCode == 'en'
              ? _english
              : _russian
        : await _loadModel(assetPath);
    _current = selected;
    _languageCode = languageCode;
    _notifyListeners();
  }

  static Future<void> loadFallbacks() async {
    final models = await Future.wait([
      _loadModel(languages['en']!),
      _loadModel(languages['ru']!),
    ]);
    _english = models[0];
    _russian = models[1];
    _fallbacksLoaded = true;
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
    if (_reloadInProgress) return;
    _reloadInProgress = true;
    try {
      final models = await Future.wait([
        _loadModel(languages['en']!),
        _loadModel(languages['ru']!),
      ]);
      final english = models[0];
      final russian = models[1];
      _english = english;
      _russian = russian;
      _current = _languageCode == 'en' ? english : russian;
      _notifyListeners();
    } on Object {
      // Keep the last valid translations when the server is unavailable.
    } finally {
      _reloadInProgress = false;
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

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../translations/translation.dart';

class ThemeController {
  static const themes = <String, String>{
    'telegram_classic': 'assets/themes/telegram_classic.json.theme',
    'telegram_liquid_glass': 'assets/themes/telegram_liquid_glass.json.theme',
  };

  static const _preferenceKey = 'theme_name';
  static final ValueNotifier<String> selectedName = ValueNotifier(
    themes.keys.first,
  );
  static ThemeModel _currentModel = const ThemeModel({});
  static ThemeData _current = buildTelefyThemeFromData(const {});

  static ThemeData get current => _current;
  static ThemeModel get model => _currentModel;

  static Future<void> load() async {
    final preferences = await SharedPreferences.getInstance();
    final savedName = preferences.getString(_preferenceKey);
    final name = themes.containsKey(savedName) ? savedName! : themes.keys.first;
    await setTheme(name, persist: false);
  }

  static Future<void> setTheme(String name, {bool persist = true}) async {
    final assetPath = themes[name];
    if (assetPath == null) throw ArgumentError.value(name, 'name');

    final json = await rootBundle.loadString(assetPath);
    final decoded = jsonDecode(json);
    if (decoded is! Map) {
      throw const FormatException('Theme JSON must contain an object');
    }

    _currentModel = ThemeModel(Map<String, dynamic>.from(decoded));
    if (_currentModel.name != name) {
      throw FormatException(
        'Theme name must be "$name", got "${_currentModel.name}"',
      );
    }
    _current = buildTelefyThemeFromData(_currentModel.data);
    selectedName.value = name;
    if (persist) {
      final preferences = await SharedPreferences.getInstance();
      await preferences.setString(_preferenceKey, name);
    }
  }

  static String title(String name) => tr('settings.$name');
}

ThemeData buildTelefyTheme() => ThemeController.current;

Color theme(String key, [Color fallback = Colors.transparent]) {
  return ThemeController.model.color(key) ?? fallback;
}

dynamic themeValue(String key) => ThemeController.model.value(key);

Color themeColor(String key, [Color fallback = Colors.transparent]) =>
    theme(key, fallback);

double themeNumber(String key, [double fallback = 0]) =>
    ThemeController.model.number(key, fallback);

bool themeBool(String key, [bool fallback = false]) =>
    ThemeController.model.boolean(key, fallback);

String themeString(String key, [String fallback = '']) =>
    ThemeController.model.string(key, fallback);

@immutable
class ThemeModel {
  final Map<String, dynamic> data;

  const ThemeModel(this.data);

  String get name => string('name');

  dynamic value(String key) {
    dynamic result = data;
    for (final part in key.split('.')) {
      if (result is! Map<String, dynamic> || !result.containsKey(part)) {
        return null;
      }
      result = result[part];
    }
    return result;
  }

  Color? color(String key) {
    final value = this.value(key);
    if (value is! String) return null;
    final normalized = value.replaceFirst('#', '');
    final parsed = int.tryParse(normalized, radix: 16);
    if (parsed == null) return null;
    return Color(normalized.length == 6 ? 0xff000000 | parsed : parsed);
  }

  double number(String key, [double fallback = 0]) {
    return (value(key) as num?)?.toDouble() ?? fallback;
  }

  bool boolean(String key, [bool fallback = false]) {
    final result = value(key);
    return result is bool ? result : fallback;
  }

  String string(String key, [String fallback = '']) {
    return value(key)?.toString() ?? fallback;
  }
}

ThemeData buildTelefyThemeFromData(Map<String, dynamic> data) {
  final model = ThemeModel(data);
  final seedColor =
      model.color('colors.brand') ??
      _color(data['seedColor'], const Color(0xff3390ec));
  final brightness = data['brightness'] == 'dark'
      ? Brightness.dark
      : Brightness.light;
  final scheme = ColorScheme.fromSeed(
    seedColor: seedColor,
    brightness: brightness,
  );
  final radius = model.number(
    'elements.button.radius',
    (data['radius'] as num?)?.toDouble() ?? 18,
  );
  final cardRadius = model.number('elements.card.radius', radius);
  final inputRadius = model.number('elements.input.radius', radius);
  final listRadius = model.number('elements.list.radius', 12);
  final surfaceOpacity = model.number(
    'elements.surface.opacity',
    (data['surfaceOpacity'] as num?)?.toDouble() ?? 1,
  );
  final primary = model.color('colors.primary') ?? scheme.primary;
  final background = model.color('colors.background') ?? scheme.surface;
  final panel = model.color('colors.panel') ?? scheme.surfaceContainerLow;
  final input = model.color('colors.input') ?? scheme.surfaceContainerHighest;
  final outline = model.color('colors.outline') ?? scheme.outline;
  final bodySize = model.number('typography.body.size', 16);
  final titleSize = model.number('typography.title.size', 22);
  final bodyWeight = _fontWeight(model.number('typography.body.weight', 400));
  final titleWeight = _fontWeight(model.number('typography.title.weight', 700));
  final buttonHeight = model.number('elements.button.height', 56);
  final cardElevation = model.number('elements.card.elevation', 0);
  final colorScheme = scheme.copyWith(
    primary: primary,
    surface: background,
    surfaceContainerLow: panel,
    surfaceContainerHighest: input,
    error: model.color('colors.danger') ?? scheme.error,
    outline: outline,
  );
  final buttonShape = RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(radius),
  );
  final buttonText = const TextStyle(fontSize: 17, fontWeight: FontWeight.w600);

  return ThemeData(
    colorScheme: colorScheme,
    scaffoldBackgroundColor: background,
    useMaterial3: data['useMaterial3'] != false,
    appBarTheme: AppBarTheme(
      backgroundColor: background.withValues(alpha: surfaceOpacity),
      surfaceTintColor: colorScheme.surfaceTint.withValues(
        alpha: surfaceOpacity,
      ),
      centerTitle: true,
      scrolledUnderElevation: surfaceOpacity < 1 ? 0 : 2,
    ),
    cardTheme: CardThemeData(
      color: panel.withValues(alpha: surfaceOpacity),
      elevation: cardElevation,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(cardRadius),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: input.withValues(alpha: surfaceOpacity),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(inputRadius),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(inputRadius),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(inputRadius),
        borderSide: BorderSide(color: primary, width: 2),
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        minimumSize: Size(0, buttonHeight),
        padding: const EdgeInsets.symmetric(horizontal: 24),
        shape: buttonShape,
        textStyle: buttonText,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        minimumSize: Size(0, buttonHeight),
        padding: const EdgeInsets.symmetric(horizontal: 24),
        shape: buttonShape,
        textStyle: buttonText,
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        minimumSize: Size(0, buttonHeight),
        padding: const EdgeInsets.symmetric(horizontal: 24),
        shape: buttonShape,
        textStyle: buttonText,
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        minimumSize: Size(0, buttonHeight),
        padding: const EdgeInsets.symmetric(horizontal: 24),
        shape: buttonShape,
        textStyle: buttonText,
      ),
    ),
    iconButtonTheme: IconButtonThemeData(
      style: IconButton.styleFrom(
        minimumSize: const Size(56, 56),
        padding: const EdgeInsets.all(16),
        shape: buttonShape,
      ),
    ),
    listTileTheme: ListTileThemeData(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(listRadius),
      ),
      minVerticalPadding: 8,
    ),
    textTheme: TextTheme(
      bodyLarge: TextStyle(fontSize: bodySize, fontWeight: bodyWeight),
      bodyMedium: TextStyle(fontSize: bodySize - 2, fontWeight: bodyWeight),
      titleLarge: TextStyle(fontSize: titleSize, fontWeight: titleWeight),
    ),
  );
}

FontWeight _fontWeight(double value) {
  final weight = value.round().clamp(100, 900);
  return FontWeight.values[(weight ~/ 100) - 1];
}

Color _color(dynamic value, Color fallback) {
  if (value is String) {
    final normalized = value.replaceFirst('#', '');
    final parsed = int.tryParse(normalized, radix: 16);
    if (parsed != null) {
      return Color(normalized.length == 6 ? 0xff000000 | parsed : parsed);
    }
  }
  return fallback;
}

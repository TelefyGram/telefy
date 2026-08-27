import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/foundation.dart';
import 'package:sensors_plus/sensors_plus.dart';

import 'internal/ui/app_theme.dart';
import 'internal/ui/hidden_settings_data.dart';
import 'internal/ui/ui_descriptions.dart';
import 'logging/log_exporter.dart';
import 'platform/platform_info.dart';
import 'tdlib/client.dart';
import 'translations/translation.dart';
import 'ui/screens/auth/hello_screen.dart';
import 'ui/screens/profile/profile.dart';

class TelefyApp extends StatefulWidget {
  final TelegramClient client;

  const TelefyApp({required this.client, super.key});

  @override
  State<TelefyApp> createState() => _TelefyAppState();
}

class _TelefyAppState extends State<TelefyApp> {
  final _navigatorKey = GlobalKey<NavigatorState>();
  StreamSubscription<AccelerometerEvent>? _shakeSubscription;
  DateTime? _lastShakePeak;
  DateTime? _lastMenuOpening;
  bool _isHiddenSettingsOpen = false;

  @override
  void initState() {
    super.initState();
    Translations.addListener(_onTranslationsChanged);
    ThemeController.selectedName.addListener(_onThemeChanged);
    if (!kIsWeb &&
        (defaultTargetPlatform == TargetPlatform.android ||
            defaultTargetPlatform == TargetPlatform.iOS)) {
      _shakeSubscription = accelerometerEventStream().listen(_onMotion);
    }
  }

  @override
  void dispose() {
    Translations.removeListener(_onTranslationsChanged);
    ThemeController.selectedName.removeListener(_onThemeChanged);
    _shakeSubscription?.cancel();
    widget.client.dispose();
    super.dispose();
  }

  void _onTranslationsChanged() {
    if (mounted) setState(() {});
  }

  void _onThemeChanged() {
    if (mounted) setState(() {});
  }

  void _onMotion(AccelerometerEvent event) {
    final force = math.sqrt(
      event.x * event.x + event.y * event.y + event.z * event.z,
    );
    if (force < 24.0) return;
    final now = DateTime.now();
    if (_lastMenuOpening != null &&
        now.difference(_lastMenuOpening!) < const Duration(seconds: 3)) {
      return;
    }
    final previousPeak = _lastShakePeak;
    _lastShakePeak = now;
    if (previousPeak == null ||
        now.difference(previousPeak) > const Duration(milliseconds: 900)) {
      return;
    }
    _lastShakePeak = null;
    if (_isHiddenSettingsOpen || _navigatorKey.currentContext == null) return;
    _lastMenuOpening = now;
    _isHiddenSettingsOpen = true;
    unawaited(_showHiddenSettings());
  }

  Future<void> _showHiddenSettings() async {
    final context = _navigatorKey.currentContext;
    if (context == null) {
      _isHiddenSettingsOpen = false;
      return;
    }
    final languageSetting = hiddenSettingDescriptions[0];
    final exportSetting = hiddenSettingDescriptions[1];
    try {
      await showModalBottomSheet<void>(
        context: context,
        showDragHandle: true,
        builder: (sheetContext) => SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.lock_open_outlined),
                title: Text(tr('profile.hiddenSettings')),
                subtitle: Text(tr('profile.hiddenSettingsDescription')),
              ),
              ListTile(
                leading: const Icon(Icons.palette_outlined),
                title: Text(tr('settings.theme')),
                subtitle: Text(tr('settings.themeDescription')),
                trailing: DropdownButton<String>(
                  value: ThemeController.selectedName.value,
                  items: ThemeController.themes.keys
                      .map(
                        (name) => DropdownMenuItem(
                          value: name,
                          child: Text(ThemeController.title(name)),
                        ),
                      )
                      .toList(),
                  onChanged: (name) {
                    if (name != null) unawaited(ThemeController.setTheme(name));
                  },
                ),
              ),
              ListTile(
                leading: const Icon(Icons.language_outlined),
                title: Text(languageSetting.title),
                subtitle: Text(languageSetting.subtitle!),
                trailing: DropdownButton<String>(
                  value: Translations.languageCode,
                  items: Translations.languages.keys
                      .map(
                        (code) => DropdownMenuItem(
                          value: code,
                          child: Text(code.toUpperCase()),
                        ),
                      )
                      .toList(),
                  onChanged: (code) {
                    if (code != null) unawaited(Translations.setLanguage(code));
                  },
                ),
              ),
              ListTile(
                leading: const Icon(Icons.description_outlined),
                title: Text(exportSetting.title),
                subtitle: Text(exportSetting.subtitle!),
                onTap: () => unawaited(LogExporter.share(sheetContext)),
              ),
            ],
          ),
        ),
      );
    } finally {
      _isHiddenSettingsOpen = false;
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: UiDescriptions.appTitle(),
      theme: ThemeController.current,
      navigatorKey: _navigatorKey,
      home: _AuthGate(client: widget.client),
    );
  }
}

class _AuthGate extends StatefulWidget {
  final TelegramClient client;

  const _AuthGate({required this.client});

  @override
  State<_AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<_AuthGate> {
  late final Future<void> _initializationFuture;

  TelegramClient get client => widget.client;

  @override
  void initState() {
    super.initState();
    client.addAuthorizationStateListener(_onAuthorizationStateChanged);
    _initializationFuture = _initialize();
  }

  @override
  void dispose() {
    client.removeAuthorizationStateListener(_onAuthorizationStateChanged);
    super.dispose();
  }

  void _onAuthorizationStateChanged() {
    if (mounted) {
      setState(() {});
    }
  }

  Future<void> _initialize() {
    return client.initialize(
      systemLanguageCode: 'ru',
      deviceModel: deviceModel,
      systemVersion: systemVersion,
      appVersion: '0.0.1',
    );
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<void>(
      future: _initializationFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const _LoadingScreen();
        }

        if (snapshot.hasError) {
          debugPrint('TDLib initialization failed: ${snapshot.error}');
        }

        return client.authorizationStateType == 'authorizationStateReady'
            ? ProfileScreen(client: client)
            : OnboardingScreen(client: client);
      },
    );
  }
}

class _LoadingScreen extends StatelessWidget {
  const _LoadingScreen();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SizedBox(
          width: 160,
          height: 160,
          child: Lottie.asset(
            'assets/animations/loading.tgs',
            decoder: LottieComposition.decodeGZip,
            fit: BoxFit.contain,
            repeat: true,
            animate: true,
          ),
        ),
      ),
    );
  }
}

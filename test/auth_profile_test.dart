import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:telefy/telegram/client.dart';
import 'package:telefy/ui/screens/auth/password_screen.dart';
import 'package:telefy/ui/screens/home/profile.dart';

void main() {
  group('ProfileScreen', () {
    testWidgets('shows only account fields returned by TDLib', (tester) async {
      final client = FakeTelegramClient(
        account: const TelegramUserInfo(
          firstName: 'Slava',
          username: 'example',
          id: 123456789,
        ),
      );

      await tester.pumpWidget(_host(ProfileScreen(client: client)));
      await tester.pump();

      expect(find.text('Slava'), findsNWidgets(2));
      expect(find.text('Username'), findsOneWidget);
      expect(find.text('@example'), findsOneWidget);
      expect(find.text('ID'), findsOneWidget);
      expect(find.text('123456789'), findsOneWidget);
      expect(find.text('Телефон'), findsNothing);
    });

    testWidgets('shows an error and retry action when account loading fails', (
      tester,
    ) async {
      final client = FakeTelegramClient(accountError: StateError('failed'));

      await tester.pumpWidget(_host(ProfileScreen(client: client)));
      await tester.pumpAndSettle();

      expect(
        find.text('Не удалось загрузить данные аккаунта.'),
        findsOneWidget,
      );
      expect(find.text('Повторить'), findsOneWidget);
    });
  });

  group('PasswordScreen', () {
    testWidgets('disables continue while password is empty', (tester) async {
      await tester.pumpWidget(
        _host(PasswordScreen(client: FakeTelegramClient())),
      );
      await tester.pump();

      final button = tester.widget<FilledButton>(find.byType(FilledButton));
      expect(button.onPressed, isNull);
    });

    testWidgets('submits password and shows the account screen', (
      tester,
    ) async {
      final client = FakeTelegramClient(
        account: const TelegramUserInfo(firstName: 'Slava'),
      );

      await tester.pumpWidget(_host(PasswordScreen(client: client)));
      await tester.enterText(find.byType(TextField), 'secret');
      await tester.tap(find.text('Продолжить'));
      await tester.testTextInput.receiveAction(TextInputAction.done);
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 500));

      expect(client.checkedPassword, 'secret');
      expect(find.byType(ProfileScreen), findsOneWidget);
      expect(find.text('Slava'), findsNWidgets(2));
    });

    testWidgets('clears password and shows the existing error dialog', (
      tester,
    ) async {
      final client = FakeTelegramClient(
        passwordError: StateError('wrong password'),
      );

      await tester.pumpWidget(_host(PasswordScreen(client: client)));
      await tester.enterText(find.byType(TextField), 'wrong');
      await tester.tap(find.text('Продолжить'));
      await tester.testTextInput.receiveAction(TextInputAction.done);
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 500));

      expect(find.text('Неверный пароль'), findsOneWidget);
      expect(
        find.text('Проверьте пароль и попробуйте ещё раз.'),
        findsOneWidget,
      );
      expect(find.text('Понятно'), findsOneWidget);
      expect(find.text('wrong'), findsNothing);
    });

    testWidgets('toggles password visibility', (tester) async {
      await tester.pumpWidget(
        _host(PasswordScreen(client: FakeTelegramClient())),
      );
      await tester.pump();

      var field = tester.widget<TextField>(find.byType(TextField));
      expect(field.obscureText, isTrue);

      await tester.tap(find.byTooltip('Показать пароль'));
      await tester.pump();
      field = tester.widget<TextField>(find.byType(TextField));
      expect(field.obscureText, isFalse);
    });
  });
}

Widget _host(Widget child) {
  return MaterialApp(theme: ThemeData(useMaterial3: true), home: child);
}

class FakeTelegramClient implements TelegramClientApi {
  final TelegramUserInfo? account;
  final Object? accountError;
  final Object? passwordError;
  String? checkedPassword;

  FakeTelegramClient({this.account, this.accountError, this.passwordError});

  @override
  String? get authorizationStateType => 'authorizationStateReady';

  @override
  Future<void> initialize({
    required String systemLanguageCode,
    required String deviceModel,
    required String systemVersion,
    required String appVersion,
  }) async {}

  @override
  Future<void> setAuthenticationPhoneNumber({
    required String phoneNumber,
  }) async {}

  @override
  Future<AuthenticationCodeResult> checkAuthenticationCode({
    required String code,
  }) async {
    return AuthenticationCodeResult.authorized;
  }

  @override
  Future<TelegramUserInfo> checkAuthenticationPassword({
    required String password,
  }) async {
    checkedPassword = password;
    if (passwordError != null) throw passwordError!;
    return account ?? const TelegramUserInfo();
  }

  @override
  Future<TelegramUserInfo> getMe() async {
    if (accountError != null) throw accountError!;
    return account ?? const TelegramUserInfo();
  }
}

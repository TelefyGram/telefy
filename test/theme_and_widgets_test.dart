import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:telefy/internal/ui/theme_controller.dart';
import 'package:telefy/tdlib/telegram_api.dart';
import 'package:telefy/ui/screens/auth/code_screen.dart';
import 'package:telefy/ui/widgets/telefy_auth_widgets.dart';
import 'package:telefy/ui/widgets/telefy_controls.dart';

void main() {
  group('ThemeModel', () {
    test('reads nested values and typed tokens', () {
      const model = ThemeModel({
        'name': 'test',
        'colors': {'accent': '#123456'},
        'elements': {
          'card': {'radius': 21},
        },
      });

      expect(model.name, 'test');
      expect(model.color('colors.accent'), const Color(0xff123456));
      expect(model.number('elements.card.radius'), 21);
      expect(model.string('missing', 'fallback'), 'fallback');
    });

    testWidgets('shared controls use theme values', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: buildTelefyThemeFromData({
            'colors': {'primary': '#123456'},
            'elements': {
              'button': {'height': 61},
              'page': {'padding': 30},
            },
          }),
          home: Scaffold(
            body: Column(
              children: [
                TelefyPrimaryButton(
                  onPressed: () {},
                  child: const Text('button'),
                ),
                const TelefyAuthNotice(child: Text('notice')),
              ],
            ),
          ),
        ),
      );

      final buttonSize = tester.getSize(find.byType(TelefyPrimaryButton));
      expect(buttonSize.height, 61);
      expect(find.byType(TelefyAuthNotice), findsOneWidget);
    });

    testWidgets('code screen renders configured auth layout', (tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: buildTelefyThemeFromData({
            'colors': {'primary': '#123456'},
            'elements': {
              'auth': {'illustrationSize': 120, 'titleSize': 26},
              'code': {'cellRadius': 19},
            },
          }),
          home: CodeScreen(client: _CodeClient(), phoneNumber: '+70000000000'),
        ),
      );
      await tester.pump();

      expect(find.byType(CodeScreen), findsOneWidget);
      expect(find.byType(AnimatedContainer), findsNWidgets(5));
    });
  });
}

class _CodeClient implements TelegramClientApi {
  @override
  String? get authorizationStateType => 'authorizationStateWaitCode';

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
  }) async => AuthenticationCodeResult.authorized;

  @override
  Future<TelegramUserInfo> checkAuthenticationPassword({
    required String password,
  }) async => const TelegramUserInfo();

  @override
  Future<TelegramUserInfo> getMe() async => const TelegramUserInfo();

  @override
  Future<List<TelegramMessageInfo>> getChatMessages(int chatId) async =>
      const [];

  @override
  Future<List<TelegramChatInfo>> getChats({
    bool archive = false,
    bool forceRefresh = false,
  }) async => const [];

  @override
  Future<void> sendMessage({required int chatId, required String text}) async {}

  @override
  Future<void> logOut() async {}
}

enum AuthenticationCodeResult { authorized, passwordRequired }

class TelegramUserInfo {
  final String? firstName;
  final String? lastName;
  final String? username;
  final String? phoneNumber;
  final int? id;

  const TelegramUserInfo({
    this.firstName,
    this.lastName,
    this.username,
    this.phoneNumber,
    this.id,
  });
}

abstract interface class TelegramClientApi {
  String? get authorizationStateType;

  Future<void> initialize({
    required String systemLanguageCode,
    required String deviceModel,
    required String systemVersion,
    required String appVersion,
  });

  Future<void> setAuthenticationPhoneNumber({required String phoneNumber});

  Future<AuthenticationCodeResult> checkAuthenticationCode({
    required String code,
  });

  Future<TelegramUserInfo> checkAuthenticationPassword({
    required String password,
  });

  Future<TelegramUserInfo> getMe();

  Future<void> logOut();
}

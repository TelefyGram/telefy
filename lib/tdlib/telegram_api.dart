enum AuthenticationCodeResult { authorized, passwordRequired }

enum TelegramMessageType { text, photo, album, poll, document, video, voice }

class TelegramMessageInfo {
  final int id;
  final TelegramMessageType type;
  final String text;
  final String? mediaPath;
  final List<String> albumPaths;
  final List<String> pollOptions;

  const TelegramMessageInfo({
    required this.id,
    required this.type,
    this.text = '',
    this.mediaPath,
    this.albumPaths = const [],
    this.pollOptions = const [],
  });
}

class TelegramUserInfo {
  final String? firstName;
  final String? lastName;
  final String? username;
  final String? phoneNumber;
  final int? id;
  final String? avatarPath;
  final String? bio;
  final int? accentColorId;
  final int? backgroundCustomEmojiId;
  final int? emojiStatusId;
  final bool isPremium;
  final bool isVerified;
  final List<TelegramGiftInfo> gifts;
  final int? channelId;

  const TelegramUserInfo({
    this.firstName,
    this.lastName,
    this.username,
    this.phoneNumber,
    this.id,
    this.avatarPath,
    this.bio,
    this.accentColorId,
    this.backgroundCustomEmojiId,
    this.emojiStatusId,
    this.isPremium = false,
    this.isVerified = false,
    this.gifts = const [],
    this.channelId,
  });
}

class TelegramGiftInfo {
  final String id;
  final String name;
  final String? model;
  final String? symbol;
  final int date;
  final String? stickerPath;

  const TelegramGiftInfo({
    required this.id,
    required this.name,
    this.model,
    this.symbol,
    required this.date,
    this.stickerPath,
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

  Future<List<TelegramMessageInfo>> getChatMessages(int chatId);

  Future<void> logOut();
}

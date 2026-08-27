import '../../../../tdlib/client.dart';

Future<void> requestAuthenticationCode({
  required TelegramClient client,
  required String phoneNumber,
}) async {
  final normalizedPhoneNumber = phoneNumber.replaceAll(RegExp(r'[\s\-()]'), '');

  if (!RegExp(r'^\+[0-9]+$').hasMatch(normalizedPhoneNumber)) {
    throw ArgumentError.value(
      phoneNumber,
      'phoneNumber',
      'Phone number must contain a leading + and digits only',
    );
  }

  await client.setAuthenticationPhoneNumber(phoneNumber: normalizedPhoneNumber);
}

import 'dart:convert';
import 'package:ffi/ffi.dart';
import 'dart:ffi';

import 'tdlib.dart';

class TelegramClient {
  final TdLibBindings _tdlib;

  late final Pointer<Void> _client;

  TelegramClient()
      : _tdlib = TdLibBindings() {
    _client = _tdlib.create();
  }

  void send(Map<String, dynamic> request) {
    final json = jsonEncode(request);

    final nativeString = json.toNativeUtf8();

    try {
      _tdlib.send(
        _client,
        nativeString,
      );
    } finally {
      calloc.free(nativeString);
    }
  }

  String? receive() {
    final result = _tdlib.receive(
      _client,
      1.0,
    );

    if (result == nullptr) {
      return null;
    }

    return result.toDartString();
  }

  void dispose() {
    _tdlib.destroy(_client);
  }
}
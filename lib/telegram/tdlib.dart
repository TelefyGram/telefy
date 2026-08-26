import 'dart:ffi';
import 'dart:io';

import 'package:ffi/ffi.dart';

typedef CreateNative = Pointer<Void> Function();
typedef CreateDart = Pointer<Void> Function();

typedef SendNative = Void Function(Pointer<Void> client, Pointer<Utf8> request);

typedef SendDart = void Function(Pointer<Void> client, Pointer<Utf8> request);

typedef ReceiveNative = Pointer<Utf8> Function(
  Pointer<Void> client,
  Double timeout,
);

typedef ReceiveDart = Pointer<Utf8> Function(
  Pointer<Void> client,
  double timeout,
);

typedef DestroyNative = Void Function(Pointer<Void> client);

typedef DestroyDart = void Function(Pointer<Void> client);

class TdLibBindings {
  late final DynamicLibrary _lib;

  late final CreateDart create;
  late final SendDart send;
  late final ReceiveDart receive;
  late final DestroyDart destroy;

  TdLibBindings() {
    _lib = _loadLibrary();

    create = _lib.lookupFunction<CreateNative, CreateDart>('telefy_create');

    send = _lib.lookupFunction<SendNative, SendDart>('telefy_send');

    receive = _lib.lookupFunction<ReceiveNative, ReceiveDart>('telefy_receive');

    destroy = _lib.lookupFunction<DestroyNative, DestroyDart>('telefy_destroy');
  }

  DynamicLibrary _loadLibrary() {
    if (Platform.isWindows) {
      return DynamicLibrary.open('telefy.dll');
    }

    if (Platform.isLinux) {
      return DynamicLibrary.open('libtelefy.so');
    }

    if (Platform.isMacOS) {
      DynamicLibrary.open('libtdjson.dylib');
      return DynamicLibrary.open('libtelefy.dylib');
    }

    if (Platform.isAndroid) {
      return DynamicLibrary.open('libtelefy.so');
    }

    if (Platform.isIOS) {
      // link in app
      return DynamicLibrary.process();
    }

    throw UnsupportedError(
      'TDLib is not supported on ${Platform.operatingSystem}',
    );
  }
}

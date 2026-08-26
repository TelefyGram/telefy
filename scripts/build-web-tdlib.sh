#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
TD_ROOT="$ROOT/tdlib"
WEB_ROOT="$TD_ROOT/example/web"
GENERATE_BUILD="$WEB_ROOT/build/generate"
WASM_BUILD="$WEB_ROOT/build/wasm"
OPENSSL_ROOT="$WEB_ROOT/build/crypto"

mkdir -p "$GENERATE_BUILD" "$WASM_BUILD"

cmake -S "$TD_ROOT" -B "$GENERATE_BUILD" \
  -DTD_GENERATE_SOURCE_FILES=ON

emcmake cmake -S "$TD_ROOT" -B "$WASM_BUILD" -G Ninja \
  -DCMAKE_BUILD_TYPE=MinSizeRel \
  -DCMAKE_NINJA_FORCE_RESPONSE_FILE=OFF \
  -DOPENSSL_FOUND=1 \
  -DOPENSSL_ROOT_DIR="$OPENSSL_ROOT" \
  -DOPENSSL_INCLUDE_DIR="$OPENSSL_ROOT/include" \
  -DOPENSSL_CRYPTO_LIBRARY="$OPENSSL_ROOT/lib/libcrypto.a" \
  -DOPENSSL_SSL_LIBRARY="$OPENSSL_ROOT/lib/libssl.a" \
  -DOPENSSL_LIBRARIES="$OPENSSL_ROOT/lib/libssl.a;$OPENSSL_ROOT/lib/libcrypto.a" \
  -DOPENSSL_VERSION=1.1.0l

cmake --build "$GENERATE_BUILD" --parallel "${JOBS:-4}"
cmake --build "$WASM_BUILD" --target td_wasm --parallel "${JOBS:-4}"

mkdir -p "$WEB_ROOT/tdweb/src/prebuilt/release"
cp "$WASM_BUILD/td_wasm.js" "$WASM_BUILD/td_wasm.wasm" \
  "$WEB_ROOT/tdweb/src/prebuilt/release/"

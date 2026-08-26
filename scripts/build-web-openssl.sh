#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
WEB_ROOT="$ROOT/tdlib/example/web"
OPENSSL_VERSION=OpenSSL_1_1_0l
OPENSSL_ARCHIVE="$WEB_ROOT/$OPENSSL_VERSION.tar.gz"
OPENSSL_SOURCE="$WEB_ROOT/openssl-$OPENSSL_VERSION"
OUTPUT="$WEB_ROOT/build/crypto"

mkdir -p "$WEB_ROOT/build"
if [ ! -f "$OPENSSL_ARCHIVE" ]; then
  echo "Downloading OpenSSL $OPENSSL_VERSION..."
  curl -fL --retry 3 -o "$OPENSSL_ARCHIVE" \
    "https://github.com/openssl/openssl/archive/$OPENSSL_VERSION.tar.gz"
fi

rm -rf "$OPENSSL_SOURCE"
tar xzf "$OPENSSL_ARCHIVE" -C "$WEB_ROOT"
cd "$OPENSSL_SOURCE"

emconfigure ./Configure linux-generic32 no-shared no-threads no-dso no-engine no-unit-test no-ui
sed -i.bak 's/CROSS_COMPILE=.*/CROSS_COMPILE=/g' Makefile
sed -i.bak 's/-ldl //g' Makefile
sed -i.bak 's/-O3/-Os/g' Makefile
emmake make depend
emmake make build_libs -j "${JOBS:-4}"

rm -rf "$OUTPUT"
mkdir -p "$OUTPUT/lib"
cp libcrypto.a libssl.a "$OUTPUT/lib/"
cp -R include "$OUTPUT/"

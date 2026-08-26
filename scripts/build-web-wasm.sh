#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
WEB_ROOT="$ROOT/tdlib/example/web"
TDWEB_ROOT="$WEB_ROOT/tdweb"
TDWEB_BUILD="$WEB_ROOT/build/tdweb-build"
FORCE=${FORCE_WEB_WASM_BUILD:-0}

needs_native_build=0
if [ "$FORCE" = "1" ] || [ ! -f "$WEB_ROOT/build/crypto/lib/libcrypto.a" ] || [ ! -f "$WEB_ROOT/build/crypto/lib/libssl.a" ]; then needs_native_build=1; fi
if [ "$FORCE" = "1" ] || [ ! -f "$WEB_ROOT/build/wasm/td_wasm.js" ] || [ ! -f "$WEB_ROOT/build/wasm/td_wasm.wasm" ]; then needs_native_build=1; fi

if [ "$needs_native_build" = "1" ]; then
  command -v emcc >/dev/null 2>&1 || { echo "Emscripten is required. Activate emsdk_env.sh first."; exit 1; }
  command -v emcmake >/dev/null 2>&1 || { echo "emcmake is required. Activate emsdk_env.sh first."; exit 1; }
  if [ "$FORCE" = "1" ] || [ ! -f "$WEB_ROOT/build/crypto/lib/libcrypto.a" ] || [ ! -f "$WEB_ROOT/build/crypto/lib/libssl.a" ]; then
    JOBS=${JOBS:-4} "$ROOT/scripts/build-web-openssl.sh"
  else
    echo "WebAssembly OpenSSL: cached"
  fi
  JOBS=${JOBS:-4} "$ROOT/scripts/build-web-tdlib.sh"
else
  echo "TDLib WebAssembly: cached"
  if [ "$FORCE" = "1" ] || [ ! -f "$TDWEB_ROOT/src/prebuilt/release/td_wasm.js" ] || [ ! -f "$TDWEB_ROOT/src/prebuilt/release/td_wasm.wasm" ]; then
    mkdir -p "$TDWEB_ROOT/src/prebuilt/release"
    cp "$WEB_ROOT/build/wasm/td_wasm.js" "$WEB_ROOT/build/wasm/td_wasm.wasm" "$TDWEB_ROOT/src/prebuilt/release/"
  fi
fi

if [ "$FORCE" = "1" ] || [ ! -f "$TDWEB_ROOT/dist/tdweb.js" ]; then
  rm -rf "$TDWEB_BUILD"
  mkdir -p "$TDWEB_BUILD"
  cp -R "$TDWEB_ROOT/src" "$TDWEB_ROOT/package.json" "$TDWEB_ROOT/package-lock.json" "$TDWEB_BUILD/"
  cp "$TDWEB_ROOT/webpack.config.js" "$TDWEB_BUILD/webpack.config.js"
  cd "$TDWEB_BUILD"
  npm install --no-save --legacy-peer-deps @babel/core@^7 @babel/preset-env@^7 babel-loader@^8
  npm run build
  rm -rf "$TDWEB_ROOT/dist"
  cp -R "$TDWEB_BUILD/dist" "$TDWEB_ROOT/dist"
else
  echo "tdweb JavaScript plugin: cached"
fi

test -f "$TDWEB_ROOT/dist/tdweb.js" || { echo "tdweb plugin is missing"; exit 1; }
mkdir -p "$ROOT/web/tdweb"
cp -R "$TDWEB_ROOT/dist/." "$ROOT/web/tdweb/"
echo "TDLib WebAssembly plugin copied to web/tdweb"

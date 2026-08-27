#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
WEB_ROOT="$ROOT/tdlib/example/web"
TDWEB_ROOT="$WEB_ROOT/tdweb"
TDWEB_BUILD="$ROOT/build/tdweb-build"
WASM_ROOT="$WEB_ROOT/build/wasm"
OUTPUT_ROOT="${WEB_TDWEB_OUTPUT_ROOT:-$ROOT/web/tdweb}"
FORCE=${FORCE_WEB_WASM_BUILD:-0}

if [ ! -f "$WASM_ROOT/td_wasm.js" ] || [ ! -f "$WASM_ROOT/td_wasm.wasm" ]; then
  echo "TDLib WebAssembly cache is missing: $WASM_ROOT" >&2
  echo "Build TDLib WebAssembly outside this integration script, then retry." >&2
  exit 1
fi

if [ "$FORCE" = "1" ] || [ ! -f "$OUTPUT_ROOT/tdweb.js" ]; then
  rm -rf "$TDWEB_BUILD"
  mkdir -p "$TDWEB_BUILD/src/prebuilt/release"
  cp -R "$TDWEB_ROOT/src" "$TDWEB_ROOT/package.json" "$TDWEB_ROOT/package-lock.json" "$TDWEB_BUILD/"
  cp "$WASM_ROOT/td_wasm.wasm" "$TDWEB_BUILD/src/prebuilt/release/td_wasm.wasm"
  sed 's/createTdwebModule\.ready\.FS=Module\.FS;/Module["FS"]=FS;/' \
    "$WASM_ROOT/td_wasm.js" > "$TDWEB_BUILD/td_wasm.js"
  awk '
    /const td_module = await import\('\''\.\/prebuilt\/release\/td_wasm\.js'\''\);/ {
      print "  importScripts('\''/tdweb/td_wasm.js'\'');"
      print "  /* eslint-disable no-undef */"
      print "  const td_module = { default: globalThis.createTdwebModule };"
      next
    }
    /onRuntimeInitialized: \(\) => \{/ {
      skip_runtime_callback = 1
      next
    }
    skip_runtime_callback && /^[[:space:]]*},$/ {
      skip_runtime_callback = 0
      next
    }
    skip_runtime_callback { next }
    /module = await module;/ {
      print
      print "  onFS(module.FS);"
      next
    }
    { print }
  ' "$TDWEB_ROOT/src/worker.js" > "$TDWEB_BUILD/src/worker.js"
  awk '
    /path: path.resolve\(__dirname, '\''dist'\''\),/ {
      print
      print "    publicPath: '\''/tdweb/'\'',"
      next
    }
    /optimization:\{/ {
      print "  devtool: false,"
    }
    /minimize:[[:space:]]*false/ {
      sub(/minimize:[[:space:]]*false/, "minimize: true")
      sub(/[[:space:]]*\/\/.*$/, "")
    }
    { print }
  ' "$TDWEB_ROOT/webpack.config.js" > "$TDWEB_BUILD/webpack.config.js"
  cd "$TDWEB_BUILD"
  npm install --no-save --legacy-peer-deps @babel/core@^7 @babel/preset-env@^7 babel-loader@^8
  npm run build
else
  echo "tdweb JavaScript plugin: cached"
fi

test -f "$TDWEB_BUILD/dist/tdweb.js" || { echo "tdweb plugin is missing"; exit 1; }
rm -rf "$OUTPUT_ROOT"
mkdir -p "$OUTPUT_ROOT"
cp "$TDWEB_BUILD/td_wasm.js" "$OUTPUT_ROOT/td_wasm.js"
cp -R "$TDWEB_BUILD/dist/." "$OUTPUT_ROOT/"
echo "TDLib WebAssembly plugin copied to web/tdweb"

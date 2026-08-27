#!/bin/bash
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
RELEASES="$ROOT/build/web-releases"
RELEASE="$RELEASES/$(date +%Y%m%d-%H%M%S)-$$"
CURRENT="$ROOT/build/web-current"
FLUTTER_BIN=${FLUTTER:-flutter}

cleanup() {
  if [ -d "$RELEASE" ] && [ ! -L "$CURRENT" ]; then
    rm -rf "$RELEASE"
  fi
}
trap cleanup EXIT

test -f "$ROOT/.env" || {
  echo ".env is missing; create it with: cp .env.example .env" >&2
  exit 1
}

mkdir -p "$RELEASES" "$RELEASE"
api_id=$(grep -E '^TELEGRAM_API_ID=' "$ROOT/.env" | cut -d= -f2-)
api_hash=$(grep -E '^TELEGRAM_API_HASH=' "$ROOT/.env" | cut -d= -f2-)

WEB_TDWEB_OUTPUT_ROOT="$RELEASE/tdweb" \
  FORCE_WEB_WASM_BUILD=${FORCE_WEB_WASM_BUILD:-0} \
  "$ROOT/scripts/build-web-wasm.sh"

cd "$ROOT"
"$FLUTTER_BIN" pub get
"$FLUTTER_BIN" build web --release -o "$RELEASE" \
  --optimization-level=4 \
  --no-source-maps \
  --strip-wasm \
  --dart-define="TELEGRAM_API_ID=$api_id" \
  --dart-define="TELEGRAM_API_HASH=$api_hash"

find "$RELEASE" -type f -name '*.map' -delete
find "$RELEASE" -type f -name '*.js' -exec sed -i.bak '/sourceMappingURL/d' {} +
find "$RELEASE" -type f -name '*.bak' -delete
mkdir -p "$RELEASE/translations"
cp "$ROOT/assets/translations/"*.json "$RELEASE/translations/"

test -f "$RELEASE/main.dart.js"
test -f "$RELEASE/tdweb/tdweb.js"

link="$CURRENT.tmp.$$"
rm -f "$link"
ln -s "web-releases/$(basename "$RELEASE")" "$link"
rm -f "$CURRENT"
mv -f "$link" "$CURRENT"
trap - EXIT

echo "Web release updated: $CURRENT"
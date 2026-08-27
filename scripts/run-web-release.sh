#!/bin/bash
set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
FLUTTER_BIN=${FLUTTER:-flutter}
PORT=${PORT:-8080}

cleanup() {
  rm -f "$ROOT/build/web/main.dart.js.map"
}

trap cleanup EXIT

"$FLUTTER_BIN" run -d chrome --release --web-port="$PORT" \
  --dart-define="TELEGRAM_API_ID=${TELEGRAM_API_ID:?TELEGRAM_API_ID is required}" \
  --dart-define="TELEGRAM_API_HASH=${TELEGRAM_API_HASH:?TELEGRAM_API_HASH is required}" &
flutter_pid=$!

trap 'kill -INT "$flutter_pid" 2>/dev/null || true' INT TERM

while kill -0 "$flutter_pid" 2>/dev/null; do
  rm -f "$ROOT/build/web/main.dart.js.map"
  sleep 0.1
done

wait "$flutter_pid"
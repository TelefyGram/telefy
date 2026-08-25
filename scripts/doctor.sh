#!/usr/bin/env bash
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$ROOT_DIR/scripts/deps.sh"
telefy_detect_environment

printf 'Telefy Doctor\n'
printf '=============\n\n'
printf '%-22s %-8s %s\n' 'Component' 'Status' 'Details'
printf '%-22s %-8s %s\n' 'OS' "$( [[ "$OS_NAME" == "macOS" ]] && echo OK || echo INFO )" "$OS_NAME $HOST_ARCH"
printf '%-22s %-8s %s\n' 'Git' "$( [[ -n "$GIT_BIN" ]] && echo OK || echo ERROR )" "${GIT_BIN:-missing}"
printf '%-22s %-8s %s\n' 'Flutter' "$( [[ -n "$FLUTTER_BIN" ]] && echo OK || echo ERROR )" "${FLUTTER_BIN:-missing}"
printf '%-22s %-8s %s\n' 'Dart' "$( [[ -n "$DART_BIN" ]] && echo OK || echo ERROR )" "${DART_BIN:-missing}"
printf '%-22s %-8s %s\n' 'Java' "$( [[ -n "$JAVA_BIN" ]] && echo OK || echo ERROR )" "${JAVA_BIN:-missing}"
printf '%-22s %-8s %s\n' 'Android SDK' "$( [[ -n "$ANDROID_SDK_ROOT" ]] && echo OK || echo ERROR )" "${ANDROID_SDK_ROOT:-missing}"
printf '%-22s %-8s %s\n' 'Android NDK' "$( [[ -n "$ANDROID_NDK_ROOT" ]] && echo OK || echo ERROR )" "${ANDROID_NDK_ROOT:-missing}"
printf '%-22s %-8s %s\n' 'CMake' "$( [[ -n "$CMAKE_BIN" ]] && echo OK || echo ERROR )" "${CMAKE_BIN:-missing}"
printf '%-22s %-8s %s\n' 'Ninja' "$( [[ -n "$NINJA_BIN" ]] && echo OK || echo ERROR )" "${NINJA_BIN:-missing}"
printf '%-22s %-8s %s\n' 'OpenSSL Android' "$( [[ -f "$OPENSSL_CACHE_DIR/$ANDROID_NDK_VERSION/.ready" ]] && echo OK || echo ERROR )" "${OPENSSL_CACHE_DIR:-missing}"

if [[ -n "$ANDROID_NDK_ROOT" && -n "$CMAKE_BIN" && -n "$NINJA_BIN" && -f "$OPENSSL_CACHE_DIR/$ANDROID_NDK_VERSION/.ready" ]]; then
  echo
  echo 'Result: READY'
else
  echo
  echo 'Result: NOT READY'
  echo 'Run: make setup'
  exit 1
fi

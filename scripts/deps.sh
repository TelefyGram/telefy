#!/usr/bin/env bash
set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$ROOT_DIR/config/dependencies.env" 2>/dev/null || true

telefy_detect_os() {
  local uname_os="$(uname -s 2>/dev/null || echo unknown)"
  case "$uname_os" in
    Darwin) echo "macOS" ;;
    Linux) echo "Linux" ;;
    MINGW*|MSYS*|CYGWIN*) echo "Windows" ;;
    *) echo "Unknown" ;;
  esac
}

telefy_detect_arch() {
  uname -m 2>/dev/null || echo "unknown"
}

telefy_detect_homebrew_prefix() {
  if [[ -x "/opt/homebrew/bin/brew" ]]; then
    echo "/opt/homebrew"
  elif [[ -x "/usr/local/bin/brew" ]]; then
    echo "/usr/local"
  else
    echo ""
  fi
}

telefy_detect_android_sdk() {
  local candidates=()
  if [[ -n "${ANDROID_HOME:-}" ]]; then candidates+=("$ANDROID_HOME"); fi
  if [[ -n "${ANDROID_SDK_ROOT:-}" ]]; then candidates+=("$ANDROID_SDK_ROOT"); fi
  candidates+=("$HOME/Library/Android/sdk" "$HOME/Android/Sdk" "/opt/android-sdk" "/usr/local/android-sdk")
  for candidate in "${candidates[@]}"; do
    if [[ -n "$candidate" && -d "$candidate" ]]; then
      echo "$candidate"
      return 0
    fi
  done
  return 1
}

telefy_resolve_android_ndk_version() {
  local sdk_root="${1:-}"
  local required_version="${ANDROID_NDK_VERSION:-}"

  if [[ -n "$sdk_root" && -d "$sdk_root/ndk" ]]; then
    if [[ -n "$required_version" && -d "$sdk_root/ndk/$required_version" ]]; then
      echo "$required_version"
      return 0
    fi
    local latest_version
    latest_version="$(find "$sdk_root/ndk" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | sed 's#^.*/##' | sort -V | tail -n 1)"
    if [[ -n "$latest_version" ]]; then
      echo "$latest_version"
      return 0
    fi
  fi

  if [[ -n "$required_version" ]]; then
    echo "$required_version"
    return 0
  fi

  return 1
}

telefy_detect_android_ndk() {
  local sdk_root="${1:-}"
  local resolved_version
  resolved_version="$(telefy_resolve_android_ndk_version "$sdk_root" || true)"

  if [[ -n "${ANDROID_NDK:-}" && -d "${ANDROID_NDK}" ]]; then
    echo "$ANDROID_NDK"
    return 0
  fi
  if [[ -n "${ANDROID_NDK_HOME:-}" && -d "${ANDROID_NDK_HOME}" ]]; then
    echo "$ANDROID_NDK_HOME"
    return 0
  fi
  if [[ -n "$sdk_root" && -d "$sdk_root/ndk" ]]; then
    if [[ -n "$resolved_version" && -d "$sdk_root/ndk/$resolved_version" ]]; then
      echo "$sdk_root/ndk/$resolved_version"
      return 0
    fi
    local version_dir
    version_dir="$(find "$sdk_root/ndk" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | sort -V | tail -n 1)"
    if [[ -n "$version_dir" ]]; then
      echo "$version_dir"
      return 0
    fi
  fi
  return 1
}

telefy_find_tool() {
  command -v "$1" 2>/dev/null || true
}

telefy_detect_environment() {
  export OS_NAME="$(telefy_detect_os)"
  export HOST_ARCH="$(telefy_detect_arch)"
  export HOMEBREW_PREFIX="$(telefy_detect_homebrew_prefix)"
  export CMAKE_BIN="$(telefy_find_tool cmake)"
  export NINJA_BIN="$(telefy_find_tool ninja)"
  export FLUTTER_BIN="$(telefy_find_tool flutter)"
  export DART_BIN="$(telefy_find_tool dart)"
  export JAVA_BIN="$(telefy_find_tool java)"
  export GIT_BIN="$(telefy_find_tool git)"
  export ANDROID_SDK_ROOT="$(telefy_detect_android_sdk || true)"
  export ANDROID_NDK_ROOT="$(telefy_detect_android_ndk "$ANDROID_SDK_ROOT" || true)"

  local discovered_ndk_version="$(telefy_resolve_android_ndk_version "$ANDROID_SDK_ROOT" || true)"
  if [[ -n "$discovered_ndk_version" ]]; then
    export ANDROID_NDK_VERSION="$discovered_ndk_version"
  elif [[ -z "${ANDROID_NDK_VERSION:-}" ]]; then
    export ANDROID_NDK_VERSION="23.2.8568313"
  fi

  export OPENSSL_VERSION="${OPENSSL_VERSION:-OpenSSL_1_1_1w}"
  export ANDROID_ABIS="${ANDROID_ABIS:-arm64-v8a x86_64}"
  export BUILD_ROOT="$ROOT_DIR/build"
  export PLATFORM_BUILD_ROOT="$BUILD_ROOT/${PLATFORM:-android}"
  export DEPS_ROOT="$PLATFORM_BUILD_ROOT/deps"
  export ANDROID_DEPS_ROOT="$DEPS_ROOT"
  export OPENSSL_CACHE_DIR="$ANDROID_DEPS_ROOT/openssl"
  export TELEFY_NATIVE_BUILD_DIR="$PLATFORM_BUILD_ROOT/telefy"
  export TDLIB_NATIVE_BUILD_DIR="$PLATFORM_BUILD_ROOT/tdlib"
}

telefy_print_status() {
  local label="$1"
  local state="$2"
  local detail="${3:-}"
  if [[ -n "$detail" ]]; then
    printf '%-22s %s %s\n' "$label" "$state" "$detail"
  else
    printf '%-22s %s\n' "$label" "$state"
  fi
}

telefy_require_or_warn() {
  local value="$1"
  local label="$2"
  if [[ -n "$value" ]]; then
    echo "OK"
  else
    echo "MISSING"
    printf 'Missing %s. Run: make setup\n' "$label" >&2
  fi
}

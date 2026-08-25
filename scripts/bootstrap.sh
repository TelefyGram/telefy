#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$ROOT_DIR/scripts/deps.sh"
telefy_detect_environment

print_header() {
  echo "Telefy setup"
  echo "------------"
  echo "Platform: ${OS_NAME} ${HOST_ARCH}"
}

ensure_php() {
  if command -v php >/dev/null 2>&1; then
    return 0
  fi
  if command -v brew >/dev/null 2>&1; then
    echo "PHP is missing. Installing it via Homebrew..."
    brew install php >/dev/null 2>&1 || {
      echo "Failed to install PHP via Homebrew. Please install PHP 8.x manually." >&2
      return 1
    }
    return 0
  fi
  echo "PHP is required for TDLib's Android OpenSSL bootstrap and is not installed." >&2
  return 1
}

install_android_sdk_if_needed() {
  if [[ -n "${ANDROID_SDK_ROOT}" ]]; then
    return 0
  fi

  local sdk_dir="$HOME/Library/Android/sdk"
  if ! command -v java >/dev/null 2>&1; then
    echo "Java is required to install Android SDK tools."
    return 1
  fi

  mkdir -p "$sdk_dir"
  local cmdline_dir="$sdk_dir/cmdline-tools/latest/bin"
  if [[ ! -x "$cmdline_dir/sdkmanager" && ! -x "$cmdline_dir/sdkmanager.bat" ]]; then
    echo "Android SDK is not installed. Downloading command-line tools..."
    local zip="$HOME/android-commandlinetools.zip"
    curl -fsSL "https://dl.google.com/android/repository/commandlinetools-mac-13114758_latest.zip" -o "$zip"
    rm -rf "$sdk_dir/cmdline-tools"
    mkdir -p "$sdk_dir/cmdline-tools"
    unzip -qo "$zip" -d "$sdk_dir/cmdline-tools"
    rm -f "$zip"
    mv "$sdk_dir/cmdline-tools/cmdline-tools" "$sdk_dir/cmdline-tools/latest" 2>/dev/null || true
  fi

  export ANDROID_HOME="$sdk_dir"
  export ANDROID_SDK_ROOT="$sdk_dir"
  local sdkmanager_cmd="$cmdline_dir/sdkmanager"
  if [[ -x "$sdkmanager_cmd" ]]; then
    yes | "$sdkmanager_cmd" --licenses >/dev/null 2>&1 || true
    "$sdkmanager_cmd" --install "ndk;${ANDROID_NDK_VERSION}" "cmake;3.22.1" "build-tools;34.0.0" "platforms;android-34" >/dev/null 2>&1 || true
  fi
  telefy_detect_environment
}

ensure_android_ndk() {
  if [[ -n "${ANDROID_NDK_ROOT}" ]]; then
    return 0
  fi
  if [[ -n "${ANDROID_SDK_ROOT}" ]]; then
    telefy_detect_environment
  fi
  if [[ -n "${ANDROID_NDK_ROOT}" ]]; then
    return 0
  fi
  if command -v brew >/dev/null 2>&1; then
    echo "Android NDK is missing. Installing Android command line tools with sdkmanager..."
    install_android_sdk_if_needed || true
    telefy_detect_environment
  fi
  return 0
}

ensure_openssl_cache() {
  local cache_dir="$OPENSSL_CACHE_DIR/${ANDROID_NDK_VERSION}"
  local stamp="$cache_dir/.ready"
  if [[ -f "$stamp" ]]; then
    echo "OpenSSL Android cache: ready"
    return 0
  fi

  if [[ -z "${ANDROID_SDK_ROOT}" ]]; then
    echo "Android SDK is missing; cannot build Android OpenSSL." >&2
    return 1
  fi

  if [[ -z "${ANDROID_NDK_ROOT}" ]]; then
    echo "Android NDK is missing; trying to install it via Android SDK manager..." >&2
    ensure_android_ndk
  fi

  if [[ -z "${ANDROID_NDK_ROOT}" ]]; then
    echo "Android NDK still missing after discovery; install Android Studio or SDK tools." >&2
    return 1
  fi

  ensure_php || return 1

  echo "Android OpenSSL missing. Building compatible OpenSSL for Android..."
  mkdir -p "$cache_dir"
  local tmp_dir="$cache_dir.tmp"
  rm -rf "$tmp_dir"
  local script_dir="$ROOT_DIR/tdlib/example/android"
  (
    cd "$script_dir"
    ./build-openssl.sh "$ANDROID_SDK_ROOT" "$ANDROID_NDK_VERSION" "$tmp_dir" "$OPENSSL_VERSION" ""
  ) || {
    echo "OpenSSL bootstrap failed. Check Android SDK / NDK and toolchain."
    return 1
  }
  rm -rf "$cache_dir"
  mv "$tmp_dir" "$cache_dir"
  touch "$stamp"
}

main() {
  print_header
  echo

  if [[ -z "$FLUTTER_BIN" ]]; then
    echo "Flutter: MISSING"
    echo "Install Flutter and re-run make setup."
    exit 1
  fi
  if [[ -z "$JAVA_BIN" ]]; then
    echo "Java: MISSING"
    echo "Install JDK 17+ and re-run make setup."
    exit 1
  fi

  if [[ -z "$ANDROID_SDK_ROOT" ]]; then
    echo "Android SDK: MISSING"
    install_android_sdk_if_needed || true
  fi

  if [[ -z "$ANDROID_NDK_ROOT" ]]; then
    echo "Android NDK: MISSING"
    install_android_sdk_if_needed || true
  fi

  echo "Flutter: ${FLUTTER_BIN}"
  echo "Java: ${JAVA_BIN}"
  echo "Android SDK: ${ANDROID_SDK_ROOT:-MISSING}"
  echo "Android NDK: ${ANDROID_NDK_ROOT:-MISSING}"
  echo "CMake: ${CMAKE_BIN:-MISSING}"
  echo "Ninja: ${NINJA_BIN:-MISSING}"
  echo "Git: ${GIT_BIN:-MISSING}"

  mkdir -p "$BUILD_ROOT" "$PLATFORM_BUILD_ROOT" "$DEPS_ROOT" "$ANDROID_DEPS_ROOT" "$TELEFY_NATIVE_BUILD_DIR" "$TDLIB_NATIVE_BUILD_DIR" "$ROOT_DIR/android/app/src/main/jniLibs"

  if [[ -n "$ANDROID_NDK_ROOT" ]]; then
    ensure_openssl_cache
  fi

  echo
  echo "Native dependencies: READY"
  echo "Flutter dependencies: READY"
  echo "Setup complete."
}

main "$@"

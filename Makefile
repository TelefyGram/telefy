SHELL := /bin/bash

ROOT := $(CURDIR)
TDLIB := $(ROOT)/tdlib
BUILD_ROOT := $(ROOT)/build
ANDROID_GRADLE_BUILD_ROOT := $(BUILD_ROOT)/android
TDLIB_BUILD := $(BUILD_ROOT)/android/tdlib
TELEFY_BUILD := $(BUILD_ROOT)/android/telefy
ANDROID_JNI_DIR := $(ROOT)/android/app/src/main/jniLibs
DIST := $(ROOT)/dist

include config/dependencies.env
-include .env
export

PLATFORM ?= android
BUILD_MODE ?= release
ANDROID_ABIS := $(strip $(subst ",,$(subst , ,$(ANDROID_ABIS))))
ANDROID_ABI_LIST := $(ANDROID_ABIS)
JOBS ?= $(shell sysctl -n hw.ncpu 2>/dev/null || nproc 2>/dev/null || getconf _NPROCESSORS_ONLN 2>/dev/null || echo 4)
CCACHE ?= $(shell command -v ccache 2>/dev/null || true)
FORCE_NATIVE_BUILD ?= 0

CMAKE ?= $(shell command -v cmake 2>/dev/null || true)
NINJA ?= $(shell command -v ninja 2>/dev/null || true)
FLUTTER ?= $(shell command -v flutter 2>/dev/null || true)
DART ?= $(shell command -v dart 2>/dev/null || true)
JAVA ?= $(shell command -v java 2>/dev/null || true)
GIT ?= $(shell command -v git 2>/dev/null || true)

ifneq ($(filter android,$(PLATFORM)),)
ifneq ($(strip $(NINJA)),)
CMAKE_MAKE_PROGRAM_ARG := -DCMAKE_MAKE_PROGRAM="$(NINJA)"
else
$(error Ninja is required for Android builds. Install it with: brew install ninja)
endif
endif

DISCOVERED_ANDROID_SDK_ROOT := $(or $(ANDROID_HOME),$(ANDROID_SDK_ROOT),$(HOME)/Library/Android/sdk,$(HOME)/Android/Sdk)
DISCOVERED_ANDROID_NDK_ROOT := $(or $(ANDROID_NDK),$(ANDROID_NDK_HOME),$(shell find "$(DISCOVERED_ANDROID_SDK_ROOT)/ndk" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | sort -V | tail -n 1))

ANDROID_SDK_ROOT ?= $(DISCOVERED_ANDROID_SDK_ROOT)
ANDROID_NDK_ROOT ?= $(DISCOVERED_ANDROID_NDK_ROOT)

OPENSSL_CACHE_ROOT := $(shell bash -lc 'source "$(ROOT)/scripts/deps.sh" >/dev/null 2>&1; telefy_detect_environment; printf "%s" "$$OPENSSL_CACHE_DIR/$$ANDROID_NDK_VERSION"')

.PHONY: all setup doctor app split-apk bundle native package-native clean clean-deps clean-all rebuild rebuild-native build-info

all:
	@echo "make setup"
	@echo "make doctor"
	@echo "make app PLATFORM=android BUILD_MODE=release"
	@echo "make app PLATFORM=android BUILD_MODE=debug"
	@echo "make split-apk"
	@echo "make bundle"

setup:
	@./scripts/bootstrap.sh

doctor:
	@./scripts/doctor.sh

native:
	@test -n "$(PLATFORM)" || (echo "Usage: make native PLATFORM=android"; exit 1)

ifeq ($(PLATFORM),android)
	@bash -lc 'source "$(ROOT)/scripts/deps.sh"; telefy_detect_environment; \
		strip_tool="$$(find "$$ANDROID_NDK_ROOT/toolchains/llvm/prebuilt" -name llvm-strip -print -quit 2>/dev/null)"; \
		if [ "$$OS_NAME" = "macOS" ] && [ "$(PLATFORM)" = "android" ]; then \
			:; \
		fi; \
		for abi in $(ANDROID_ABI_LIST); do \
			install_dir="$(TDLIB_BUILD)/$$abi"; \
			wrapper_dir="$(TELEFY_BUILD)/$$abi"; \
			tdlib_cached=0; \
			telefy_cached=0; \
			if [ "$(FORCE_NATIVE_BUILD)" != "1" ] && \
				[ -f "$$install_dir/CMakeCache.txt" ] && [ -f "$$install_dir/build.ninja" ] && \
				[ -f "$$install_dir/lib/libtdjson.so" ] && \
				grep -q "^ANDROID_ABI:.*=$$abi$$" "$$install_dir/CMakeCache.txt"; then \
				tdlib_cached=1; \
				echo "TDLib $$abi: cached"; \
			fi; \
			if [ "$(FORCE_NATIVE_BUILD)" != "1" ] && \
				[ -f "$$wrapper_dir/CMakeCache.txt" ] && [ -f "$$wrapper_dir/build.ninja" ] && \
				[ -f "$$wrapper_dir/lib/libtelefy.so" ] && \
				grep -q "^ANDROID_ABI:.*=$$abi$$" "$$wrapper_dir/CMakeCache.txt"; then \
				telefy_cached=1; \
				echo "Telefy $$abi: cached"; \
			fi; \
			if [ "$$tdlib_cached" = "0" ] && { [ ! -f "$$install_dir/CMakeCache.txt" ] || [ ! -f "$$install_dir/build.ninja" ]; }; then \
				rm -rf "$$install_dir"; \
				mkdir -p "$$install_dir"; \
			fi; \
			if [ "$$telefy_cached" = "0" ] && { [ ! -f "$$wrapper_dir/CMakeCache.txt" ] || [ ! -f "$$wrapper_dir/build.ninja" ]; }; then \
				rm -rf "$$wrapper_dir"; \
				mkdir -p "$$wrapper_dir"; \
			fi; \
			if [ "$$tdlib_cached" = "0" ] && [ ! -f "$$install_dir/CMakeCache.txt" ]; then \
				if [ -z "$$ANDROID_NDK_ROOT" ]; then echo "Android NDK not found. Run make setup"; exit 1; fi; \
				cmake -S "$(TDLIB)" -B "$$install_dir" -G Ninja $(CMAKE_MAKE_PROGRAM_ARG) \
					-DCMAKE_BUILD_TYPE=Release \
					-DCMAKE_INSTALL_PREFIX="$$install_dir" \
					-DCMAKE_TOOLCHAIN_FILE="$$ANDROID_NDK_ROOT/build/cmake/android.toolchain.cmake" \
					-DCMAKE_FIND_ROOT_PATH_MODE_INCLUDE=BOTH \
					-DCMAKE_FIND_ROOT_PATH_MODE_LIBRARY=BOTH \
					-DANDROID_ABI="$$abi" \
					-DANDROID_PLATFORM=$(ANDROID_PLATFORM) \
					-DTD_INSTALL_STATIC_LIBRARIES=OFF \
					-DTD_INSTALL_SHARED_LIBRARIES=ON \
					-DTD_ENABLE_JNI=OFF \
					-DTD_ENABLE_DOTNET=OFF \
					-DOPENSSL_ROOT_DIR="$(OPENSSL_CACHE_ROOT)/$$abi" \
					-DOPENSSL_INCLUDE_DIR="$(OPENSSL_CACHE_ROOT)/$$abi/include" \
					-DOPENSSL_CRYPTO_LIBRARY="$(OPENSSL_CACHE_ROOT)/$$abi/lib/libcrypto.a" \
					-DOPENSSL_SSL_LIBRARY="$(OPENSSL_CACHE_ROOT)/$$abi/lib/libssl.a"; \
			fi; \
			if [ "$$tdlib_cached" = "0" ]; then \
				cmake --build "$$install_dir" --target tdjson --parallel $(JOBS); \
				cmake --install "$$install_dir"; \
			fi; \
			if [ "$$telefy_cached" = "0" ] && [ ! -f "$$wrapper_dir/CMakeCache.txt" ]; then \
				cmake -S "$(ROOT)/native/tdlib" -B "$$wrapper_dir" -G Ninja $(CMAKE_MAKE_PROGRAM_ARG) \
					-DCMAKE_BUILD_TYPE=Release \
					-DDTDJSON_ROOT="$$install_dir" \
					-DCMAKE_PREFIX_PATH="$$install_dir" \
					-DCMAKE_INSTALL_PREFIX="$$wrapper_dir" \
					-DCMAKE_TOOLCHAIN_FILE="$$ANDROID_NDK_ROOT/build/cmake/android.toolchain.cmake" \
					-DCMAKE_FIND_ROOT_PATH_MODE_INCLUDE=BOTH \
					-DCMAKE_FIND_ROOT_PATH_MODE_LIBRARY=BOTH \
					-DANDROID_ABI="$$abi" \
					-DANDROID_PLATFORM=$(ANDROID_PLATFORM); \
			fi; \
			if [ "$$telefy_cached" = "0" ]; then \
				cmake --build "$$wrapper_dir" --target telefy --parallel $(JOBS); \
				cmake --install "$$wrapper_dir"; \
			fi; \
			if [ -n "$$strip_tool" ]; then \
				"$$strip_tool" --strip-unneeded "$$install_dir/lib/libtdjson.so" "$$wrapper_dir/lib/libtelefy.so"; \
			fi; \
		done'
else
	@:
endif


app:
	@test -n "$(PLATFORM)" || (echo "Usage: make app PLATFORM=android BUILD_MODE=release"; exit 1)
	@test -f .env || (echo ".env is missing; create it with: cp .env.example .env"; exit 1)
	@bash -lc 'set -a; source .env 2>/dev/null || true; set +a; source "$(ROOT)/scripts/deps.sh"; telefy_detect_environment; if [ -z "$$FLUTTER_BIN" ]; then echo "Flutter is required. Run make setup"; exit 1; fi; if [ -z "$$TELEGRAM_API_ID" ] || [ -z "$$TELEGRAM_API_HASH" ]; then echo "TELEGRAM_API_ID and TELEGRAM_API_HASH are required in .env"; exit 1; fi'
	$(MAKE) native PLATFORM=$(PLATFORM) BUILD_MODE=$(BUILD_MODE)
	$(MAKE) package-native PLATFORM=$(PLATFORM)
	@if [ "$(PLATFORM)" = "android" ]; then \
		$(FLUTTER) pub get; \
		$(FLUTTER) build apk --$(BUILD_MODE) \
			--target-platform android-arm64,android-x64 \
			--dart-define=TELEGRAM_API_ID=$$(grep -E '^TELEGRAM_API_ID=' .env | cut -d= -f2-) \
			--dart-define=TELEGRAM_API_HASH=$$(grep -E '^TELEGRAM_API_HASH=' .env | cut -d= -f2-) && \
			mv -f "$(BUILD_ROOT)/app/outputs/flutter-apk/app-$(BUILD_MODE).apk" "$(BUILD_ROOT)/app/outputs/flutter-apk/telefy-$(BUILD_MODE).apk"; \
	else \
		$(FLUTTER) build $(PLATFORM) --$(BUILD_MODE) \
			--dart-define=TELEGRAM_API_ID=$$(grep -E '^TELEGRAM_API_ID=' .env | cut -d= -f2-) \
			--dart-define=TELEGRAM_API_HASH=$$(grep -E '^TELEGRAM_API_HASH=' .env | cut -d= -f2-); \
	fi

split-apk:
	@test -f .env || (echo ".env is missing; create it with: cp .env.example .env"; exit 1)
	@$(FLUTTER) pub get
	@$(FLUTTER) build apk --release --split-per-abi \
		--target-platform android-arm64,android-x64 \
		--dart-define=TELEGRAM_API_ID=$$(grep -E '^TELEGRAM_API_ID=' .env | cut -d= -f2-) \
		--dart-define=TELEGRAM_API_HASH=$$(grep -E '^TELEGRAM_API_HASH=' .env | cut -d= -f2-)

bundle:
	@test -f .env || (echo ".env is missing; create it with: cp .env.example .env"; exit 1)
	@$(FLUTTER) pub get
	@$(FLUTTER) build appbundle --release \
		--target-platform android-arm64,android-x64 \
		--dart-define=TELEGRAM_API_ID=$$(grep -E '^TELEGRAM_API_ID=' .env | cut -d= -f2-) \
		--dart-define=TELEGRAM_API_HASH=$$(grep -E '^TELEGRAM_API_HASH=' .env | cut -d= -f2-)

package-native:
	@test -n "$(PLATFORM)" || (echo "Usage: make package-native PLATFORM=android"; exit 1)
	@if [ "$(PLATFORM)" = "android" ]; then \
		for abi in $(ANDROID_ABI_LIST); do \
			mkdir -p "$(ANDROID_JNI_DIR)/$$abi"; \
			cp -f "$(TDLIB_BUILD)/$$abi/lib/libtdjson.so" "$(ANDROID_JNI_DIR)/$$abi/"; \
			cp -f "$(TELEFY_BUILD)/$$abi/lib/libtelefy.so" "$(ANDROID_JNI_DIR)/$$abi/"; \
		done; \
	fi

clean:
	@rm -rf "$(BUILD_ROOT)" "$(DIST)"
	@rm -rf "$(ANDROID_JNI_DIR)"
	@find "$(BUILD_ROOT)" -type d \( -name '*\,*' \) -prune -exec rm -rf {} + 2>/dev/null || true

clean-deps:
	@rm -rf "$(BUILD_ROOT)/deps"

clean-all: clean clean-deps

rebuild-native:
	@rm -rf "$(TDLIB_BUILD)" "$(TELEFY_BUILD)"
	$(MAKE) native PLATFORM=$(PLATFORM)

rebuild: rebuild-native

build-info:
	@echo "Platform: $(PLATFORM)"
	@echo "Build mode: $(BUILD_MODE)"
	@echo "Android ABIs: $(ANDROID_ABI_LIST)"
	@echo "Force native rebuild: $(FORCE_NATIVE_BUILD)"
	@echo "CMake: $${CMAKE:-missing}"
	@echo "Ninja: $${NINJA:-missing}"
	@echo "Flutter: $${FLUTTER:-missing}"
	@echo "Android SDK: $${ANDROID_SDK_ROOT:-missing}"
	@echo "Android NDK: $${ANDROID_NDK_ROOT:-missing}"
	@echo "OpenSSL cache: $(OPENSSL_CACHE_ROOT)"

SHELL := /bin/bash

ROOT := $(CURDIR)
TDLIB := $(ROOT)/tdlib
BUILD_ROOT := $(ROOT)/build
ANDROID_GRADLE_BUILD_ROOT := $(BUILD_ROOT)/android
TDLIB_BUILD := $(BUILD_ROOT)/android/tdlib
TELEFY_BUILD := $(BUILD_ROOT)/android/telefy
MACOS_TDLIB_BUILD := $(BUILD_ROOT)/macos/tdlib
MACOS_TELEFY_BUILD := $(BUILD_ROOT)/macos/telefy
MACOS_OPENSSL_LIB_DIR := $(shell brew --prefix openssl@3 2>/dev/null)/lib
ANDROID_JNI_DIR := $(ROOT)/android/app/src/main/jniLibs
DIST := $(ROOT)/dist
TDWEB_ROOT := $(TDLIB)/example/web

include config/dependencies.env
-include .env
export

PLATFORM ?= $(or $(PLATPHORM),android)
BUILD_MODE ?= release
PORT ?= 8080
ANDROID_ABIS := $(strip $(subst ",,$(subst , ,$(ANDROID_ABIS))))
ANDROID_ABI_LIST := $(ANDROID_ABIS)
JOBS ?= $(shell sysctl -n hw.ncpu 2>/dev/null || nproc 2>/dev/null || getconf _NPROCESSORS_ONLN 2>/dev/null || echo 4)
CCACHE ?= $(shell command -v ccache 2>/dev/null || true)
FORCE_NATIVE_BUILD ?= 0
FORCE_WEB_WASM_BUILD ?= 0
BUILD_ANDROID_FULL ?= 1
BUILD_ANDROID_SPLIT ?= 1
DEVICE_ID ?=

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

.PHONY: all setup doctor app build-web build-web-wasm run run-web run-android split-apk bundle native package-native clean clean-deps clean-all rebuild rebuild-native build-info

all:
	@echo "make setup"
	@echo "make doctor"
	@echo "make app PLATFORM=android BUILD_MODE=release"
	@echo "make app PLATFORM=android BUILD_MODE=debug"
	@echo "make build-web"
	@echo "make build-web-wasm"
	@echo "make run PLATFORM=web PORT=8080"
	@echo "make run PLATFORM=android DEVICE_ID=<device-id>"
	@echo "make run PLATFORM=macos"
	@echo "make run PLATFORM=windows"
	@echo "make run PLATFORM=linux"
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
				grep -q "^ANDROID_ABI:.*=$$abi$$" "$$wrapper_dir/CMakeCache.txt" && \
				! find "$(ROOT)/native/tdlib" -type f -newer "$$wrapper_dir/lib/libtelefy.so" -print -quit | grep -q .; then \
				telefy_cached=1; \
				echo "Telefy $$abi: cached"; \
			fi; \
			if [ "$$tdlib_cached" = "0" ] && [ -e "$$install_dir" ]; then \
				rm -rf "$$install_dir"; \
				mkdir -p "$$install_dir"; \
			fi; \
			if [ "$$telefy_cached" = "0" ] && [ -e "$$wrapper_dir" ]; then \
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
	@if [ "$(PLATFORM)" = "macos" ]; then \
		mkdir -p "$(MACOS_TDLIB_BUILD)" "$(MACOS_TELEFY_BUILD)"; \
		if [ ! -e "$(MACOS_TDLIB_BUILD)/lib/libtdjson.dylib" ] && [ -f "$(MACOS_TDLIB_BUILD)/CMakeCache.txt" ]; then \
			rm -rf "$(MACOS_TDLIB_BUILD)"; \
			mkdir -p "$(MACOS_TDLIB_BUILD)"; \
		fi; \
		if [ ! -f "$(MACOS_TDLIB_BUILD)/lib/libtdjson.dylib" ]; then \
			cmake -S "$(TDLIB)" -B "$(MACOS_TDLIB_BUILD)" -G Ninja \
				-DCMAKE_BUILD_TYPE=Release \
				-DCMAKE_INSTALL_PREFIX="$(MACOS_TDLIB_BUILD)" \
				-DTD_INSTALL_STATIC_LIBRARIES=OFF \
				-DTD_INSTALL_SHARED_LIBRARIES=ON \
				-DTD_ENABLE_JNI=OFF \
				-DTD_ENABLE_DOTNET=OFF; \
		fi; \
		tdlib_needs_build=0; \
		if [ ! -e "$(MACOS_TDLIB_BUILD)/lib/libtdjson.dylib" ] || [ ! -f "$(MACOS_TDLIB_BUILD)/CMakeCache.txt" ] || [ ! -f "$(MACOS_TDLIB_BUILD)/build.ninja" ] || \
			find "$(TDLIB)" -type f -newer "$(MACOS_TDLIB_BUILD)/lib/libtdjson.dylib" -print -quit | grep -q .; then \
			tdlib_needs_build=1; \
		fi; \
		if [ "$$tdlib_needs_build" = "1" ] || [ "$(FORCE_NATIVE_BUILD)" = "1" ]; then \
			cmake --build "$(MACOS_TDLIB_BUILD)" --target tdjson --parallel $(JOBS); \
			cmake --install "$(MACOS_TDLIB_BUILD)"; \
		else \
			echo "TDLib macOS: cached"; \
		fi; \
		if [ ! -e "$(MACOS_TELEFY_BUILD)/lib/libtelefy.dylib" ] && [ -f "$(MACOS_TELEFY_BUILD)/CMakeCache.txt" ]; then \
			rm -rf "$(MACOS_TELEFY_BUILD)"; \
			mkdir -p "$(MACOS_TELEFY_BUILD)"; \
		fi; \
		if [ ! -f "$(MACOS_TELEFY_BUILD)/lib/libtelefy.dylib" ]; then \
			cmake -S "$(ROOT)/native/tdlib" -B "$(MACOS_TELEFY_BUILD)" -G Ninja \
				-DCMAKE_BUILD_TYPE=Release \
				-DDTDJSON_ROOT="$(MACOS_TDLIB_BUILD)" \
				-DCMAKE_PREFIX_PATH="$(MACOS_TDLIB_BUILD)" \
				-DCMAKE_INSTALL_PREFIX="$(MACOS_TELEFY_BUILD)"; \
		fi; \
		telefy_needs_build=0; \
		if [ ! -e "$(MACOS_TELEFY_BUILD)/lib/libtelefy.dylib" ] || [ ! -f "$(MACOS_TELEFY_BUILD)/CMakeCache.txt" ] || [ ! -f "$(MACOS_TELEFY_BUILD)/build.ninja" ] || \
			find "$(ROOT)/native/tdlib" -type f -newer "$(MACOS_TELEFY_BUILD)/lib/libtelefy.dylib" -print -quit | grep -q .; then \
			telefy_needs_build=1; \
		fi; \
		if [ "$$telefy_needs_build" = "1" ] || [ "$(FORCE_NATIVE_BUILD)" = "1" ]; then \
			cmake --build "$(MACOS_TELEFY_BUILD)" --target telefy --parallel $(JOBS); \
			cmake --install "$(MACOS_TELEFY_BUILD)"; \
		else \
			echo "Telefy macOS: cached"; \
		fi; \
		install_name_tool -change "@rpath/libtdjson.1.8.67.dylib" "@rpath/libtdjson.dylib" "$(MACOS_TELEFY_BUILD)/lib/libtelefy.dylib"; \
	fi
	@:
endif


ifeq ($(PLATFORM),web)
app: build-web
else
app:
	@test -n "$(PLATFORM)" || (echo "Usage: make app PLATFORM=android BUILD_MODE=release"; exit 1)
	@test -f .env || (echo ".env is missing; create it with: cp .env.example .env"; exit 1)
	@bash -lc 'set -a; source .env 2>/dev/null || true; set +a; source "$(ROOT)/scripts/deps.sh"; telefy_detect_environment; if [ -z "$$FLUTTER_BIN" ]; then echo "Flutter is required. Run make setup"; exit 1; fi; if [ -z "$$TELEGRAM_API_ID" ] || [ -z "$$TELEGRAM_API_HASH" ]; then echo "TELEGRAM_API_ID and TELEGRAM_API_HASH are required in .env"; exit 1; fi'
	@if [ "$(PLATFORM)" = "android" ]; then $(MAKE) setup; fi
	$(MAKE) native PLATFORM=$(PLATFORM) BUILD_MODE=$(BUILD_MODE)
	@if [ "$(PLATFORM)" = "android" ]; then $(MAKE) package-native PLATFORM=android; fi
	@if [ "$(PLATFORM)" = "android" ]; then \
		if [ "$(BUILD_ANDROID_FULL)" = "1" ]; then \
			$(FLUTTER) build apk --$(BUILD_MODE) \
				--target-platform android-arm64,android-x64 \
				--dart-define=TELEGRAM_API_ID=$(TELEGRAM_API_ID) \
				--dart-define=TELEGRAM_API_HASH=$(TELEGRAM_API_HASH) && \
				mv -f "$(BUILD_ROOT)/app/outputs/flutter-apk/app-$(BUILD_MODE).apk" "$(BUILD_ROOT)/app/outputs/flutter-apk/telefy-$(BUILD_MODE)-full.apk"; \
		fi; \
		if [ "$(BUILD_ANDROID_SPLIT)" = "1" ]; then \
			$(FLUTTER) build apk --$(BUILD_MODE) --split-per-abi \
				--target-platform android-arm64,android-x64 \
				--dart-define=TELEGRAM_API_ID=$(TELEGRAM_API_ID) \
				--dart-define=TELEGRAM_API_HASH=$(TELEGRAM_API_HASH); \
			if [ "$(BUILD_MODE)" = "release" ]; then \
				for apk in "$(BUILD_ROOT)/app/outputs/flutter-apk/app-"*-release.apk; do \
					[ -f "$$apk" ] || continue; \
					mv -f "$$apk" "$${apk%/*}/telefy-$${apk##*/app-}"; \
				done; \
			else \
				for apk in "$(BUILD_ROOT)/app/outputs/flutter-apk/app-"*-debug.apk; do \
					[ -f "$$apk" ] || continue; \
					mv -f "$$apk" "$${apk%/*}/telefy-$${apk##*/app-}"; \
				done; \
			fi; \
		fi; \
	else \
		$(FLUTTER) build $(PLATFORM) --$(BUILD_MODE) \
			--dart-define=TELEGRAM_API_ID=$(TELEGRAM_API_ID) \
			--dart-define=TELEGRAM_API_HASH=$(TELEGRAM_API_HASH); \
	fi
	@if [ "$(PLATFORM)" = "macos" ]; then $(MAKE) package-native PLATFORM=macos BUILD_MODE=$(BUILD_MODE); fi
endif

build-web:
	@test -f .env || (echo ".env is missing; create it with: cp .env.example .env"; exit 1)
	@$(FLUTTER) pub get
	@$(FLUTTER) build web --$(BUILD_MODE) \
		--dart-define=TELEGRAM_API_ID=$$(grep -E '^TELEGRAM_API_ID=' .env | cut -d= -f2-) \
		--dart-define=TELEGRAM_API_HASH=$$(grep -E '^TELEGRAM_API_HASH=' .env | cut -d= -f2-)

build-web-wasm:
	@FORCE_WEB_WASM_BUILD=$(FORCE_WEB_WASM_BUILD) ./scripts/build-web-wasm.sh

run:
	@test -f .env || (echo ".env is missing; create it with: cp .env.example .env"; exit 1)
	@$(FLUTTER) pub get
	@if [ "$(PLATFORM)" = "web" ]; then \
		$(FLUTTER) run -d chrome --web-port=$(PORT) \
			--dart-define=TELEGRAM_API_ID=$$(grep -E '^TELEGRAM_API_ID=' .env | cut -d= -f2-) \
			--dart-define=TELEGRAM_API_HASH=$$(grep -E '^TELEGRAM_API_HASH=' .env | cut -d= -f2-); \
	elif [ "$(PLATFORM)" = "android" ]; then \
		device_id="$(DEVICE_ID)"; \
		if [ -z "$$device_id" ]; then device_id="$$(adb devices | awk 'NR > 1 && $$2 == "device" { print $$1; exit }')"; fi; \
		if [ -z "$$device_id" ]; then echo "Android device not found. Run: make run PLATFORM=android DEVICE_ID=<device-id>"; exit 1; fi; \
		$(FLUTTER) run --no-pub -d "$$device_id" \
			--dart-define=TELEGRAM_API_ID=$$(grep -E '^TELEGRAM_API_ID=' .env | cut -d= -f2-) \
			--dart-define=TELEGRAM_API_HASH=$$(grep -E '^TELEGRAM_API_HASH=' .env | cut -d= -f2-); \
	elif [ "$(PLATFORM)" = "macos" ] || [ "$(PLATFORM)" = "windows" ] || [ "$(PLATFORM)" = "linux" ]; then \
		$(FLUTTER) run -d "$(PLATFORM)" \
			--dart-define=TELEGRAM_API_ID=$$(grep -E '^TELEGRAM_API_ID=' .env | cut -d= -f2-) \
			--dart-define=TELEGRAM_API_HASH=$$(grep -E '^TELEGRAM_API_HASH=' .env | cut -d= -f2-); \
	else \
		echo "Unsupported platform: $(PLATFORM). Use web, android, macos, windows or linux"; exit 1; \
	fi

run-web:
	$(MAKE) run PLATFORM=web PORT=$(PORT)

run-android:
	$(MAKE) run PLATFORM=android DEVICE_ID="$(DEVICE_ID)"

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
	elif [ "$(PLATFORM)" = "macos" ]; then \
		frameworks_dir="$(BUILD_ROOT)/macos/Build/Products/$(if $(filter debug,$(BUILD_MODE)),Debug,Release)/telefy.app/Contents/Frameworks"; \
		mkdir -p "$$frameworks_dir"; \
		cp -f "$(MACOS_TDLIB_BUILD)/lib/libtdjson.dylib" "$$frameworks_dir/"; \
		cp -f "$(MACOS_TELEFY_BUILD)/lib/libtelefy.dylib" "$$frameworks_dir/"; \
		cp -f "$(MACOS_OPENSSL_LIB_DIR)/libssl.3.dylib" "$$frameworks_dir/"; \
		cp -f "$(MACOS_OPENSSL_LIB_DIR)/libcrypto.3.dylib" "$$frameworks_dir/"; \
		install_name_tool -id "@rpath/libtdjson.dylib" "$$frameworks_dir/libtdjson.dylib"; \
		install_name_tool -id "@rpath/libssl.3.dylib" "$$frameworks_dir/libssl.3.dylib"; \
		install_name_tool -id "@rpath/libcrypto.3.dylib" "$$frameworks_dir/libcrypto.3.dylib"; \
		install_name_tool -change "/opt/homebrew/opt/openssl@3/lib/libssl.3.dylib" "@rpath/libssl.3.dylib" "$$frameworks_dir/libtdjson.dylib"; \
		install_name_tool -change "/opt/homebrew/opt/openssl@3/lib/libcrypto.3.dylib" "@rpath/libcrypto.3.dylib" "$$frameworks_dir/libtdjson.dylib"; \
		install_name_tool -change "/usr/local/opt/openssl@3/lib/libssl.3.dylib" "@rpath/libssl.3.dylib" "$$frameworks_dir/libtdjson.dylib"; \
		install_name_tool -change "/usr/local/opt/openssl@3/lib/libcrypto.3.dylib" "@rpath/libcrypto.3.dylib" "$$frameworks_dir/libtdjson.dylib"; \
		for library in "$$frameworks_dir/libtdjson.dylib" "$$frameworks_dir/libssl.3.dylib" "$$frameworks_dir/libcrypto.3.dylib"; do \
			while IFS= read -r dependency; do \
				dependency="$$(printf '%s' "$$dependency" | sed 's/^[[:space:]]*//')"; \
				case "$$dependency" in \
					*/libssl.3.dylib|*/libcrypto.3.dylib) \
						install_name_tool -change "$$dependency" "@rpath/$$(basename "$$dependency")" "$$library"; \
						;; \
				 esac; \
			done < <(otool -L "$$library" | tail -n +2 | sed 's/ (.*//' ); \
		done; \
		install_name_tool -change "@rpath/libtdjson.1.8.67.dylib" "@rpath/libtdjson.dylib" "$$frameworks_dir/libtelefy.dylib"; \
		codesign --force --deep --sign - "$(BUILD_ROOT)/macos/Build/Products/$(if $(filter debug,$(BUILD_MODE)),Debug,Release)/telefy.app"; \
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

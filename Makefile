SHELL := /bin/bash

ifneq (,$(wildcard .env))
include .env
export
endif

ROOT := $(CURDIR)
TDLIB := $(ROOT)/tdlib
BUILD := $(ROOT)/build/tdlib
DIST := $(ROOT)/dist

APP_NAME ?= telefy
FLUTTER ?= flutter
CODESIGN_IDENTITY ?= -
MACOS_APP := $(ROOT)/build/macos/Build/Products/Release/$(APP_NAME).app
MACOS_FRAMEWORKS := $(MACOS_APP)/Contents/Frameworks

ARM_CMAKE := /opt/homebrew/bin/cmake
ARM_NINJA := /opt/homebrew/bin/ninja
ARM_BREW := /opt/homebrew/bin/brew
ARM_OPENSSL := /opt/homebrew/opt/openssl@3

X86_CMAKE := /usr/local/bin/cmake
X86_NINJA := /usr/local/bin/ninja
X86_BREW := /usr/local/bin/brew
X86_OPENSSL := /usr/local/opt/openssl@3

ANDROID_NDK ?= $(ANDROID_NDK_HOME)
LINUX_ARM64_TOOLCHAIN ?=
VCPKG_ROOT ?=

UNAME_S := $(shell uname -s 2>/dev/null)
JOBS := $(shell \
	if [ "$(UNAME_S)" = "Darwin" ]; then sysctl -n hw.ncpu; \
	elif [ "$(UNAME_S)" = "Linux" ]; then nproc 2>/dev/null || getconf _NPROCESSORS_ONLN; \
	elif [ -n "$$NUMBER_OF_PROCESSORS" ]; then printf '%s' "$$NUMBER_OF_PROCESSORS"; \
	else getconf _NPROCESSORS_ONLN 2>/dev/null || printf '4'; fi)

CCACHE := $(shell command -v ccache 2>/dev/null)
ifeq ($(strip $(CCACHE)),)
CMAKE_CACHE_FLAGS :=
else
CMAKE_CACHE_FLAGS := -DCMAKE_C_COMPILER_LAUNCHER=$(CCACHE) -DCMAKE_CXX_COMPILER_LAUNCHER=$(CCACHE)
endif

WRAPPER_BUILD := $(ROOT)/build/telefy

CMAKE_COMMON := \
	-DCMAKE_BUILD_TYPE=Release \
	-DTD_INSTALL_STATIC_LIBRARIES=OFF \
	-DTD_INSTALL_SHARED_LIBRARIES=ON \
	-DTD_ENABLE_JNI=OFF \
	-DTD_ENABLE_DOTNET=OFF

define BUILD_TELEFY
	@mkdir -p $(2)
	@if [ ! -f $(2)/CMakeCache.txt ]; then \
		$(3) -S $(ROOT)/native/tdlib -B $(2) -G Ninja \
			-DCMAKE_BUILD_TYPE=Release $(CMAKE_CACHE_FLAGS) \
			-DDTDJSON_ROOT=$(1) -DCMAKE_INSTALL_PREFIX=$(1) $(4); \
	fi
	$(3) --build $(2) --target telefy --parallel $(JOBS)
	$(3) --install $(2)
endef

.PHONY: all setup tdlib \
	macos macos-arm64 macos-x86_64 \
	linux linux-x86_64 linux-arm64 \
	windows windows-x64 windows-arm64 \
	android android-arm64 android-armv7 android-x86_64 \
	ios ios-device ios-simulator \
	app sign-universal sign-native clean-macos clean rebuild cache-stats build-info

all:
	@echo "make app PLATFORM=macos"
	@echo "make app PLATFORM=linux"
	@echo "make app PLATFORM=windows"
	@echo "make app PLATFORM=android"
	@echo "make app PLATFORM=ios"

setup:
	@test -x "$(ARM_CMAKE)" || (echo "Missing $(ARM_CMAKE)"; exit 1)
	@test -x "$(ARM_NINJA)" || (echo "Missing $(ARM_NINJA)"; exit 1)
	@test -x "$(X86_CMAKE)" || (echo "Missing $(X86_CMAKE)"; exit 1)
	@test -x "$(X86_NINJA)" || (echo "Missing $(X86_NINJA)"; exit 1)
	@test -d "$(ARM_OPENSSL)" || (echo "Missing $(ARM_OPENSSL)"; exit 1)
	@test -d "$(X86_OPENSSL)" || (echo "Missing $(X86_OPENSSL)"; exit 1)

tdlib:
	@test -n "$(PLATFORM)" || (echo "Usage: make tdlib PLATFORM=macos"; exit 1)
	$(MAKE) $(PLATFORM)

macos: macos-arm64 macos-x86_64
	@mkdir -p $(BUILD)/macos/universal/lib
	@if [ ! -e $(BUILD)/macos/universal/lib/libtdjson.dylib ] || \
		[ $(BUILD)/macos/arm64/lib/libtdjson.dylib -nt $(BUILD)/macos/universal/lib/libtdjson.dylib ] || \
		[ $(BUILD)/macos/x86_64/lib/libtdjson.dylib -nt $(BUILD)/macos/universal/lib/libtdjson.dylib ]; then \
		lipo -create $(BUILD)/macos/arm64/lib/libtdjson.dylib $(BUILD)/macos/x86_64/lib/libtdjson.dylib -output $(BUILD)/macos/universal/lib/libtdjson.dylib; \
	fi
	@if [ ! -e $(BUILD)/macos/universal/lib/libtelefy.dylib ] || \
		[ $(BUILD)/macos/arm64/lib/libtelefy.dylib -nt $(BUILD)/macos/universal/lib/libtelefy.dylib ] || \
		[ $(BUILD)/macos/x86_64/lib/libtelefy.dylib -nt $(BUILD)/macos/universal/lib/libtelefy.dylib ]; then \
		lipo -create $(BUILD)/macos/arm64/lib/libtelefy.dylib $(BUILD)/macos/x86_64/lib/libtelefy.dylib -output $(BUILD)/macos/universal/lib/libtelefy.dylib; \
	fi
	@lipo -info $(BUILD)/macos/universal/lib/libtdjson.dylib
	@lipo -info $(BUILD)/macos/universal/lib/libtelefy.dylib

macos-arm64:
	@mkdir -p $(BUILD)/macos/arm64
	@if [ ! -f $(BUILD)/macos/arm64/CMakeCache.txt ]; then \
	$(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/macos/arm64 \
		-G Ninja \
		$(CMAKE_COMMON) \
		$(CMAKE_CACHE_FLAGS) \
		-DCMAKE_OSX_ARCHITECTURES=arm64 \
		-DOPENSSL_ROOT_DIR=$(ARM_OPENSSL) \
		-DOPENSSL_INCLUDE_DIR=$(ARM_OPENSSL)/include \
		-DOPENSSL_CRYPTO_LIBRARY=$(ARM_OPENSSL)/lib/libcrypto.dylib \
		-DOPENSSL_SSL_LIBRARY=$(ARM_OPENSSL)/lib/libssl.dylib \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/macos/arm64; fi
	$(ARM_CMAKE) --build $(BUILD)/macos/arm64 \
		--target tdjson \
		--parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/macos/arm64
	$(call BUILD_TELEFY,$(BUILD)/macos/arm64,$(WRAPPER_BUILD)/macos/arm64,$(ARM_CMAKE),-DCMAKE_OSX_ARCHITECTURES=arm64)

macos-x86_64:
	@mkdir -p $(BUILD)/macos/x86_64
	@if [ ! -f $(BUILD)/macos/x86_64/CMakeCache.txt ]; then arch -x86_64 /bin/bash -lc '\
		"$(X86_CMAKE)" -S "$(TDLIB)" \
		-B "$(BUILD)/macos/x86_64" \
		-G Ninja \
		$(CMAKE_COMMON) \
		$(CMAKE_CACHE_FLAGS) \
		-DCMAKE_OSX_ARCHITECTURES=x86_64 \
		-DOPENSSL_ROOT_DIR="$(X86_OPENSSL)" \
		-DOPENSSL_INCLUDE_DIR="$(X86_OPENSSL)/include" \
		-DOPENSSL_CRYPTO_LIBRARY="$(X86_OPENSSL)/lib/libcrypto.dylib" \
		-DOPENSSL_SSL_LIBRARY="$(X86_OPENSSL)/lib/libssl.dylib" \
		-DCMAKE_INSTALL_PREFIX="$(BUILD)/macos/x86_64" \
	'; fi
	arch -x86_64 /bin/bash -lc '\
		"$(X86_CMAKE)" --build "$(BUILD)/macos/x86_64" \
		--target tdjson \
		--parallel $(JOBS) \
	'
	arch -x86_64 /bin/bash -lc '\
		"$(X86_CMAKE)" --install "$(BUILD)/macos/x86_64" \
	'
	@if [ ! -f $(WRAPPER_BUILD)/macos/x86_64/CMakeCache.txt ]; then arch -x86_64 /bin/bash -lc '\
		"$(X86_CMAKE)" -S "$(ROOT)/native/tdlib" -B "$(WRAPPER_BUILD)/macos/x86_64" -G Ninja \
		-DCMAKE_BUILD_TYPE=Release $(CMAKE_CACHE_FLAGS) -DDTDJSON_ROOT="$(BUILD)/macos/x86_64" \
		-DCMAKE_INSTALL_PREFIX="$(BUILD)/macos/x86_64" -DCMAKE_OSX_ARCHITECTURES=x86_64 \
	'; fi
	arch -x86_64 /bin/bash -lc '"$(X86_CMAKE)" --build "$(WRAPPER_BUILD)/macos/x86_64" --target telefy --parallel $(JOBS)'
	arch -x86_64 /bin/bash -lc '"$(X86_CMAKE)" --install "$(WRAPPER_BUILD)/macos/x86_64"'

linux: linux-x86_64
	@if [ -n "$(LINUX_ARM64_TOOLCHAIN)" ]; then $(MAKE) linux-arm64; fi

linux-x86_64:
	@if [ ! -f $(BUILD)/linux/x86_64/CMakeCache.txt ]; then \
	$(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/linux/x86_64 \
		-G Ninja \
		$(CMAKE_COMMON) \
		$(CMAKE_CACHE_FLAGS) \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/linux/x86_64; fi
	$(ARM_CMAKE) --build $(BUILD)/linux/x86_64 \
		--target tdjson \
		--parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/linux/x86_64
	$(call BUILD_TELEFY,$(BUILD)/linux/x86_64,$(WRAPPER_BUILD)/linux/x86_64,$(ARM_CMAKE),)

linux-arm64:
	@test -n "$(LINUX_ARM64_TOOLCHAIN)" || (echo "LINUX_ARM64_TOOLCHAIN is required"; exit 1)
	@if [ ! -f $(BUILD)/linux/arm64/CMakeCache.txt ]; then \
	$(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/linux/arm64 \
		-G Ninja \
		$(CMAKE_COMMON) \
		$(CMAKE_CACHE_FLAGS) \
		-DCMAKE_TOOLCHAIN_FILE=$(LINUX_ARM64_TOOLCHAIN) \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/linux/arm64; fi
	$(ARM_CMAKE) --build $(BUILD)/linux/arm64 \
		--target tdjson \
		--parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/linux/arm64
	$(call BUILD_TELEFY,$(BUILD)/linux/arm64,$(WRAPPER_BUILD)/linux/arm64,$(ARM_CMAKE),-DCMAKE_TOOLCHAIN_FILE=$(LINUX_ARM64_TOOLCHAIN))

windows: windows-x64
	@if [ -n "$(VCPKG_ROOT)" ]; then $(MAKE) windows-arm64; fi

windows-x64:
	@if [ ! -f $(BUILD)/windows/x64/CMakeCache.txt ]; then \
	$(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/windows/x64 \
		-G "Visual Studio 17 2022" \
		-A x64 \
		$(CMAKE_COMMON) \
		$(CMAKE_CACHE_FLAGS) \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/windows/x64 \
		$(if $(VCPKG_ROOT),-DCMAKE_TOOLCHAIN_FILE=$(VCPKG_ROOT)/scripts/buildsystems/vcpkg.cmake); fi
	$(ARM_CMAKE) --build $(BUILD)/windows/x64 \
		--config Release \
		--target tdjson \
		--parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/windows/x64 --config Release
	@if [ ! -f $(WRAPPER_BUILD)/windows/x64/CMakeCache.txt ]; then $(ARM_CMAKE) -S $(ROOT)/native/tdlib -B $(WRAPPER_BUILD)/windows/x64 \
		-G "Visual Studio 17 2022" -A x64 -DDTDJSON_ROOT=$(BUILD)/windows/x64 \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/windows/x64; fi
	$(ARM_CMAKE) --build $(WRAPPER_BUILD)/windows/x64 --config Release --target telefy --parallel $(JOBS)
	$(ARM_CMAKE) --install $(WRAPPER_BUILD)/windows/x64 --config Release

windows-arm64:
	@if [ ! -f $(BUILD)/windows/arm64/CMakeCache.txt ]; then \
	$(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/windows/arm64 \
		-G "Visual Studio 17 2022" \
		-A ARM64 \
		$(CMAKE_COMMON) \
		$(CMAKE_CACHE_FLAGS) \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/windows/arm64 \
		$(if $(VCPKG_ROOT),-DCMAKE_TOOLCHAIN_FILE=$(VCPKG_ROOT)/scripts/buildsystems/vcpkg.cmake); fi
	$(ARM_CMAKE) --build $(BUILD)/windows/arm64 \
		--config Release \
		--target tdjson \
		--parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/windows/arm64 --config Release
	@if [ ! -f $(WRAPPER_BUILD)/windows/arm64/CMakeCache.txt ]; then $(ARM_CMAKE) -S $(ROOT)/native/tdlib -B $(WRAPPER_BUILD)/windows/arm64 \
		-G "Visual Studio 17 2022" -A ARM64 -DDTDJSON_ROOT=$(BUILD)/windows/arm64 \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/windows/arm64; fi
	$(ARM_CMAKE) --build $(WRAPPER_BUILD)/windows/arm64 --config Release --target telefy --parallel $(JOBS)
	$(ARM_CMAKE) --install $(WRAPPER_BUILD)/windows/arm64 --config Release

android: android-arm64 android-armv7 android-x86_64
	$(MAKE) package-native PLATFORM=android

android-arm64:
	@test -n "$(ANDROID_NDK)" || (echo "ANDROID_NDK or ANDROID_NDK_HOME is required"; exit 1)
	@if [ ! -f $(BUILD)/android/arm64-v8a/CMakeCache.txt ]; then $(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/android/arm64-v8a \
		-G Ninja \
		$(CMAKE_COMMON) \
		$(CMAKE_CACHE_FLAGS) \
		-DCMAKE_TOOLCHAIN_FILE=$(ANDROID_NDK)/build/cmake/android.toolchain.cmake \
		-DANDROID_ABI=arm64-v8a \
		-DANDROID_PLATFORM=android-24 \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/android/arm64-v8a \
		-DCMAKE_CXX_FLAGS="-Oz -flto=thin"; fi
	$(ARM_CMAKE) --build $(BUILD)/android/arm64-v8a \
		--target tdjson \
		--parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/android/arm64-v8a
	$(call BUILD_TELEFY,$(BUILD)/android/arm64-v8a,$(WRAPPER_BUILD)/android/arm64-v8a,$(ARM_CMAKE),-DCMAKE_TOOLCHAIN_FILE=$(ANDROID_NDK)/build/cmake/android.toolchain.cmake -DANDROID_ABI=arm64-v8a -DANDROID_PLATFORM=android-24)

android-armv7:
	@test -n "$(ANDROID_NDK)" || (echo "ANDROID_NDK or ANDROID_NDK_HOME is required"; exit 1)
	@if [ ! -f $(BUILD)/android/armeabi-v7a/CMakeCache.txt ]; then $(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/android/armeabi-v7a \
		-G Ninja \
		$(CMAKE_COMMON) \
		$(CMAKE_CACHE_FLAGS) \
		-DCMAKE_TOOLCHAIN_FILE=$(ANDROID_NDK)/build/cmake/android.toolchain.cmake \
		-DANDROID_ABI=armeabi-v7a \
		-DANDROID_PLATFORM=android-24 \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/android/armeabi-v7a \
		-DCMAKE_CXX_FLAGS="-Oz -flto=thin"; fi
	$(ARM_CMAKE) --build $(BUILD)/android/armeabi-v7a \
		--target tdjson \
		--parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/android/armeabi-v7a
	$(call BUILD_TELEFY,$(BUILD)/android/armeabi-v7a,$(WRAPPER_BUILD)/android/armeabi-v7a,$(ARM_CMAKE),-DCMAKE_TOOLCHAIN_FILE=$(ANDROID_NDK)/build/cmake/android.toolchain.cmake -DANDROID_ABI=armeabi-v7a -DANDROID_PLATFORM=android-24)

android-x86_64:
	@test -n "$(ANDROID_NDK)" || (echo "ANDROID_NDK or ANDROID_NDK_HOME is required"; exit 1)
	@if [ ! -f $(BUILD)/android/x86_64/CMakeCache.txt ]; then $(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/android/x86_64 \
		-G Ninja \
		$(CMAKE_COMMON) \
		$(CMAKE_CACHE_FLAGS) \
		-DCMAKE_TOOLCHAIN_FILE=$(ANDROID_NDK)/build/cmake/android.toolchain.cmake \
		-DANDROID_ABI=x86_64 \
		-DANDROID_PLATFORM=android-24 \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/android/x86_64 \
		-DCMAKE_CXX_FLAGS="-Oz -flto=thin"; fi
	$(ARM_CMAKE) --build $(BUILD)/android/x86_64 \
		--target tdjson \
		--parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/android/x86_64
	$(call BUILD_TELEFY,$(BUILD)/android/x86_64,$(WRAPPER_BUILD)/android/x86_64,$(ARM_CMAKE),-DCMAKE_TOOLCHAIN_FILE=$(ANDROID_NDK)/build/cmake/android.toolchain.cmake -DANDROID_ABI=x86_64 -DANDROID_PLATFORM=android-24)

ios: ios-device ios-simulator
	@if [ ! -e $(BUILD)/ios/Telefy.xcframework ] || [ $(BUILD)/ios/device/lib/libtelefy.a -nt $(BUILD)/ios/Telefy.xcframework ] || [ $(BUILD)/ios/simulator/lib/libtelefy.a -nt $(BUILD)/ios/Telefy.xcframework ]; then xcodebuild -create-xcframework \
		-library $(BUILD)/ios/device/lib/libtelefy.a \
		-library $(BUILD)/ios/simulator/lib/libtelefy.a \
		-output $(BUILD)/ios/Telefy.xcframework; fi

ios-device:
	@if [ ! -f $(BUILD)/ios/device/CMakeCache.txt ]; then $(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/ios/device \
		-G Xcode \
		$(CMAKE_COMMON) \
		$(CMAKE_CACHE_FLAGS) \
		-DTD_INSTALL_SHARED_LIBRARIES=OFF \
		-DTD_INSTALL_STATIC_LIBRARIES=ON \
		-DCMAKE_SYSTEM_NAME=iOS \
		-DCMAKE_OSX_DEPLOYMENT_TARGET=13.0 \
		-DCMAKE_OSX_ARCHITECTURES=arm64 \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/ios/device; fi
	$(ARM_CMAKE) --build $(BUILD)/ios/device --config Release --target tdjson_static --parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/ios/device --config Release
	@if [ ! -f $(WRAPPER_BUILD)/ios/device/CMakeCache.txt ]; then $(ARM_CMAKE) -S $(ROOT)/native/tdlib -B $(WRAPPER_BUILD)/ios/device -G Xcode \
		-DCMAKE_SYSTEM_NAME=iOS -DCMAKE_OSX_DEPLOYMENT_TARGET=13.0 \
		-DCMAKE_OSX_ARCHITECTURES=arm64 -DDTDJSON_ROOT=$(BUILD)/ios/device \
		-DDTDJSON_LIBRARY=$(BUILD)/ios/device/lib/libtdjson_static.a \
		-DTELEFY_BUILD_SHARED=OFF -DCMAKE_INSTALL_PREFIX=$(BUILD)/ios/device; fi
	$(ARM_CMAKE) --build $(WRAPPER_BUILD)/ios/device --config Release --target telefy --parallel $(JOBS)
	$(ARM_CMAKE) --install $(WRAPPER_BUILD)/ios/device --config Release

ios-simulator:
	@if [ ! -f $(BUILD)/ios/simulator/CMakeCache.txt ]; then $(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/ios/simulator \
		-G Xcode \
		$(CMAKE_COMMON) \
		$(CMAKE_CACHE_FLAGS) \
		-DTD_INSTALL_SHARED_LIBRARIES=OFF \
		-DTD_INSTALL_STATIC_LIBRARIES=ON \
		-DCMAKE_SYSTEM_NAME=iOS \
		-DCMAKE_OSX_DEPLOYMENT_TARGET=13.0 \
		-DCMAKE_OSX_SYSROOT=iphonesimulator \
		-DCMAKE_OSX_ARCHITECTURES="arm64;x86_64" \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/ios/simulator; fi
	$(ARM_CMAKE) --build $(BUILD)/ios/simulator --config Release --target tdjson_static --parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/ios/simulator --config Release
	@if [ ! -f $(WRAPPER_BUILD)/ios/simulator/CMakeCache.txt ]; then $(ARM_CMAKE) -S $(ROOT)/native/tdlib -B $(WRAPPER_BUILD)/ios/simulator -G Xcode \
		-DCMAKE_SYSTEM_NAME=iOS -DCMAKE_OSX_DEPLOYMENT_TARGET=13.0 \
		-DCMAKE_OSX_SYSROOT=iphonesimulator -DCMAKE_OSX_ARCHITECTURES="arm64;x86_64" \
		-DDTDJSON_ROOT=$(BUILD)/ios/simulator -DDTDJSON_LIBRARY=$(BUILD)/ios/simulator/lib/libtdjson_static.a \
		-DTELEFY_BUILD_SHARED=OFF -DCMAKE_INSTALL_PREFIX=$(BUILD)/ios/simulator; fi
	$(ARM_CMAKE) --build $(WRAPPER_BUILD)/ios/simulator --config Release --target telefy --parallel $(JOBS)
	$(ARM_CMAKE) --install $(WRAPPER_BUILD)/ios/simulator --config Release

app:
	@test -n "$(PLATFORM)" || (echo "Usage: make app PLATFORM=macos"; exit 1)
	@test -f .env || (echo ".env is missing; create it with: cp .env.example .env"; exit 1)
	@test -n "$(TELEGRAM_API_ID)" || (echo "TELEGRAM_API_ID is missing in .env"; exit 1)
	@test -n "$(TELEGRAM_API_HASH)" || (echo "TELEGRAM_API_HASH is missing in .env"; exit 1)
	$(MAKE) tdlib PLATFORM=$(PLATFORM)
	@if [ "$(PLATFORM)" = "macos" ]; then \
		$(MAKE) sign-universal PLATFORM=macos; \
		$(MAKE) package-native PLATFORM=macos; \
	fi
	@if [ "$(PLATFORM)" = "android" ]; then \
		$(FLUTTER) build apk --release \
			--dart-define=TELEGRAM_API_ID=$(TELEGRAM_API_ID) \
			--dart-define=TELEGRAM_API_HASH=$(TELEGRAM_API_HASH); \
	else \
		$(FLUTTER) build $(PLATFORM) --release \
			--dart-define=TELEGRAM_API_ID=$(TELEGRAM_API_ID) \
			--dart-define=TELEGRAM_API_HASH=$(TELEGRAM_API_HASH); \
	fi
	$(MAKE) package-native PLATFORM=$(PLATFORM)
	@if [ "$(PLATFORM)" = "macos" ]; then $(MAKE) sign-native PLATFORM=macos; fi

sign-universal:
	@test "$(PLATFORM)" = "macos" || (echo "Usage: make sign-universal PLATFORM=macos"; exit 1)
	@test -f "$(BUILD)/macos/universal/lib/libtdjson.dylib" || (echo "Missing universal libtdjson.dylib"; exit 1)
	@test -f "$(BUILD)/macos/universal/lib/libtelefy.dylib" || (echo "Missing universal libtelefy.dylib"; exit 1)
	@lipo -info "$(BUILD)/macos/universal/lib/libtdjson.dylib"
	@lipo -info "$(BUILD)/macos/universal/lib/libtelefy.dylib"
	codesign --force --sign "$(CODESIGN_IDENTITY)" "$(BUILD)/macos/universal/lib/libtdjson.dylib"
	codesign --force --sign "$(CODESIGN_IDENTITY)" "$(BUILD)/macos/universal/lib/libtelefy.dylib"
	codesign --verify --verbose "$(BUILD)/macos/universal/lib/libtdjson.dylib"
	codesign --verify --verbose "$(BUILD)/macos/universal/lib/libtelefy.dylib"

sign-native:
	@test "$(PLATFORM)" = "macos" || (echo "Usage: make sign-native PLATFORM=macos"; exit 1)
	@test -f "$(MACOS_FRAMEWORKS)/libtdjson.dylib" || (echo "Missing $(MACOS_FRAMEWORKS)/libtdjson.dylib"; exit 1)
	@test -f "$(MACOS_FRAMEWORKS)/libtelefy.dylib" || (echo "Missing $(MACOS_FRAMEWORKS)/libtelefy.dylib"; exit 1)
	@lipo -info "$(MACOS_FRAMEWORKS)/libtdjson.dylib"
	@lipo -info "$(MACOS_FRAMEWORKS)/libtelefy.dylib"
	codesign --force --sign "$(CODESIGN_IDENTITY)" "$(MACOS_FRAMEWORKS)/libtdjson.dylib"
	codesign --force --sign "$(CODESIGN_IDENTITY)" "$(MACOS_FRAMEWORKS)/libtelefy.dylib"
	codesign --verify --verbose "$(MACOS_FRAMEWORKS)/libtdjson.dylib"
	codesign --verify --verbose "$(MACOS_FRAMEWORKS)/libtelefy.dylib"
	codesign --force --sign "$(CODESIGN_IDENTITY)" "$(MACOS_APP)"
	codesign --verify --verbose "$(MACOS_APP)"
	codesign -dv --verbose=4 "$(MACOS_FRAMEWORKS)/libtdjson.dylib" 2>&1 | sed -n '1,8p'
	codesign -dv --verbose=4 "$(MACOS_FRAMEWORKS)/libtelefy.dylib" 2>&1 | sed -n '1,8p'

clean-macos:
	rm -rf $(ROOT)/build/macos

.PHONY: package-native

package-native:
	@test -n "$(PLATFORM)" || (echo "Usage: make package-native PLATFORM=android"; exit 1)
	@if [ "$(PLATFORM)" = "android" ]; then \
		for abi in arm64-v8a armeabi-v7a x86_64; do \
			mkdir -p android/app/src/main/jniLibs/$$abi; \
			cp $(BUILD)/android/$$abi/lib/libtdjson.so android/app/src/main/jniLibs/$$abi/; \
			cp $(BUILD)/android/$$abi/lib/libtelefy.so android/app/src/main/jniLibs/$$abi/; \
		done; \
	fi
	@if [ "$(PLATFORM)" = "macos" ]; then \
		mkdir -p build/macos/Build/Products/Release/telefy.app/Contents/Frameworks; \
		cp $(BUILD)/macos/universal/lib/libtdjson.dylib build/macos/Build/Products/Release/telefy.app/Contents/Frameworks/; \
		cp $(BUILD)/macos/universal/lib/libtelefy.dylib build/macos/Build/Products/Release/telefy.app/Contents/Frameworks/; \
	fi
	@if [ "$(PLATFORM)" = "linux" ]; then \
		mkdir -p build/linux/x64/release/bundle/lib; \
		cp $(BUILD)/linux/x86_64/lib/libtdjson.so build/linux/x64/release/bundle/lib/; \
		cp $(BUILD)/linux/x86_64/lib/libtelefy.so build/linux/x64/release/bundle/lib/; \
	fi
	@if [ "$(PLATFORM)" = "windows" ]; then \
		cp $(BUILD)/windows/x64/bin/tdjson.dll build/windows/x64/runner/Release/; \
		cp $(BUILD)/windows/x64/bin/telefy.dll build/windows/x64/runner/Release/; \
	fi

clean:
	rm -rf $(BUILD)
	rm -rf $(WRAPPER_BUILD)
	rm -rf $(DIST)

rebuild:
	$(MAKE) clean
	$(MAKE) tdlib PLATFORM=$(PLATFORM)

cache-stats:
	@if [ -n "$(CCACHE)" ]; then $(CCACHE) --show-stats; else echo "ccache is not installed"; fi

build-info:
	@echo "CPU count: $(JOBS)"
	@echo "CMake: $(ARM_CMAKE)"
	@echo "Ninja: $(ARM_NINJA)"
	@if [ -n "$(CCACHE)" ]; then echo "ccache: $(CCACHE)"; else echo "ccache: unavailable"; fi
	@echo "Platform: $${PLATFORM:-unspecified}"
	@echo "Architecture: $$(uname -m 2>/dev/null || echo unspecified)"
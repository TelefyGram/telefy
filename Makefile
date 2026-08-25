SHELL := /bin/bash

ROOT := $(CURDIR)
TDLIB := $(ROOT)/tdlib
BUILD := $(ROOT)/build/tdlib
DIST := $(ROOT)/dist

APP_NAME ?= telefy
FLUTTER ?= flutter

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

JOBS := $(shell sysctl -n hw.ncpu 2>/dev/null || echo 4)

CMAKE_COMMON := \
	-DCMAKE_BUILD_TYPE=Release \
	-DTD_INSTALL_STATIC_LIBRARIES=OFF \
	-DTD_INSTALL_SHARED_LIBRARIES=ON \
	-DTD_ENABLE_JNI=OFF \
	-DTD_ENABLE_DOTNET=OFF

.PHONY: all setup tdlib \
	macos macos-arm64 macos-x86_64 \
	linux linux-x86_64 linux-arm64 \
	windows windows-x64 windows-arm64 \
	android android-arm64 android-armv7 android-x86_64 \
	ios ios-device ios-simulator \
	app clean

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
	@lipo -create \
		$(BUILD)/macos/arm64/lib/libtdjson.dylib \
		$(BUILD)/macos/x86_64/lib/libtdjson.dylib \
		-output $(BUILD)/macos/universal/lib/libtdjson.dylib
	@lipo -info $(BUILD)/macos/universal/lib/libtdjson.dylib

macos-arm64:
	@rm -rf $(BUILD)/macos/arm64
	@mkdir -p $(BUILD)/macos/arm64
	$(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/macos/arm64 \
		-G Ninja \
		$(CMAKE_COMMON) \
		-DCMAKE_OSX_ARCHITECTURES=arm64 \
		-DOPENSSL_ROOT_DIR=$(ARM_OPENSSL) \
		-DOPENSSL_INCLUDE_DIR=$(ARM_OPENSSL)/include \
		-DOPENSSL_CRYPTO_LIBRARY=$(ARM_OPENSSL)/lib/libcrypto.dylib \
		-DOPENSSL_SSL_LIBRARY=$(ARM_OPENSSL)/lib/libssl.dylib \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/macos/arm64
	$(ARM_CMAKE) --build $(BUILD)/macos/arm64 \
		--target tdjson \
		--parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/macos/arm64

macos-x86_64:
	@rm -rf $(BUILD)/macos/x86_64
	@mkdir -p $(BUILD)/macos/x86_64
	arch -x86_64 /bin/bash -lc '\
		"$(X86_CMAKE)" -S "$(TDLIB)" \
		-B "$(BUILD)/macos/x86_64" \
		-G Ninja \
		$(CMAKE_COMMON) \
		-DCMAKE_OSX_ARCHITECTURES=x86_64 \
		-DOPENSSL_ROOT_DIR="$(X86_OPENSSL)" \
		-DOPENSSL_INCLUDE_DIR="$(X86_OPENSSL)/include" \
		-DOPENSSL_CRYPTO_LIBRARY="$(X86_OPENSSL)/lib/libcrypto.dylib" \
		-DOPENSSL_SSL_LIBRARY="$(X86_OPENSSL)/lib/libssl.dylib" \
		-DCMAKE_INSTALL_PREFIX="$(BUILD)/macos/x86_64" \
	'
	arch -x86_64 /bin/bash -lc '\
		"$(X86_CMAKE)" --build "$(BUILD)/macos/x86_64" \
		--target tdjson \
		--parallel $(JOBS) \
	'
	arch -x86_64 /bin/bash -lc '\
		"$(X86_CMAKE)" --install "$(BUILD)/macos/x86_64" \
	'

linux: linux-x86_64
	@if [ -n "$(LINUX_ARM64_TOOLCHAIN)" ]; then $(MAKE) linux-arm64; fi

linux-x86_64:
	@rm -rf $(BUILD)/linux/x86_64
	$(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/linux/x86_64 \
		-G Ninja \
		$(CMAKE_COMMON) \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/linux/x86_64
	$(ARM_CMAKE) --build $(BUILD)/linux/x86_64 \
		--target tdjson \
		--parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/linux/x86_64

linux-arm64:
	@test -n "$(LINUX_ARM64_TOOLCHAIN)" || (echo "LINUX_ARM64_TOOLCHAIN is required"; exit 1)
	@rm -rf $(BUILD)/linux/arm64
	$(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/linux/arm64 \
		-G Ninja \
		$(CMAKE_COMMON) \
		-DCMAKE_TOOLCHAIN_FILE=$(LINUX_ARM64_TOOLCHAIN) \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/linux/arm64
	$(ARM_CMAKE) --build $(BUILD)/linux/arm64 \
		--target tdjson \
		--parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/linux/arm64

windows: windows-x64
	@if [ -n "$(VCPKG_ROOT)" ]; then $(MAKE) windows-arm64; fi

windows-x64:
	$(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/windows/x64 \
		-G "Visual Studio 17 2022" \
		-A x64 \
		$(CMAKE_COMMON) \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/windows/x64 \
		$(if $(VCPKG_ROOT),-DCMAKE_TOOLCHAIN_FILE=$(VCPKG_ROOT)/scripts/buildsystems/vcpkg.cmake)
	$(ARM_CMAKE) --build $(BUILD)/windows/x64 \
		--config Release \
		--target tdjson \
		--parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/windows/x64 --config Release

windows-arm64:
	$(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/windows/arm64 \
		-G "Visual Studio 17 2022" \
		-A ARM64 \
		$(CMAKE_COMMON) \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/windows/arm64 \
		$(if $(VCPKG_ROOT),-DCMAKE_TOOLCHAIN_FILE=$(VCPKG_ROOT)/scripts/buildsystems/vcpkg.cmake)
	$(ARM_CMAKE) --build $(BUILD)/windows/arm64 \
		--config Release \
		--target tdjson \
		--parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/windows/arm64 --config Release

android: android-arm64 android-armv7 android-x86_64

android-arm64:
	@test -n "$(ANDROID_NDK)" || (echo "ANDROID_NDK or ANDROID_NDK_HOME is required"; exit 1)
	@rm -rf $(BUILD)/android/arm64-v8a
	$(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/android/arm64-v8a \
		-G Ninja \
		$(CMAKE_COMMON) \
		-DCMAKE_TOOLCHAIN_FILE=$(ANDROID_NDK)/build/cmake/android.toolchain.cmake \
		-DANDROID_ABI=arm64-v8a \
		-DANDROID_PLATFORM=android-24 \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/android/arm64-v8a \
		-DCMAKE_CXX_FLAGS="-Oz -flto=thin"
	$(ARM_CMAKE) --build $(BUILD)/android/arm64-v8a \
		--target tdjson \
		--parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/android/arm64-v8a

android-armv7:
	@test -n "$(ANDROID_NDK)" || (echo "ANDROID_NDK or ANDROID_NDK_HOME is required"; exit 1)
	@rm -rf $(BUILD)/android/armeabi-v7a
	$(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/android/armeabi-v7a \
		-G Ninja \
		$(CMAKE_COMMON) \
		-DCMAKE_TOOLCHAIN_FILE=$(ANDROID_NDK)/build/cmake/android.toolchain.cmake \
		-DANDROID_ABI=armeabi-v7a \
		-DANDROID_PLATFORM=android-24 \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/android/armeabi-v7a \
		-DCMAKE_CXX_FLAGS="-Oz -flto=thin"
	$(ARM_CMAKE) --build $(BUILD)/android/armeabi-v7a \
		--target tdjson \
		--parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/android/armeabi-v7a

android-x86_64:
	@test -n "$(ANDROID_NDK)" || (echo "ANDROID_NDK or ANDROID_NDK_HOME is required"; exit 1)
	@rm -rf $(BUILD)/android/x86_64
	$(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/android/x86_64 \
		-G Ninja \
		$(CMAKE_COMMON) \
		-DCMAKE_TOOLCHAIN_FILE=$(ANDROID_NDK)/build/cmake/android.toolchain.cmake \
		-DANDROID_ABI=x86_64 \
		-DANDROID_PLATFORM=android-24 \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/android/x86_64 \
		-DCMAKE_CXX_FLAGS="-Oz -flto=thin"
	$(ARM_CMAKE) --build $(BUILD)/android/x86_64 \
		--target tdjson \
		--parallel $(JOBS)
	$(ARM_CMAKE) --install $(BUILD)/android/x86_64

ios: ios-device ios-simulator

ios-device:
	@rm -rf $(BUILD)/ios/device
	$(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/ios/device \
		-G Xcode \
		$(CMAKE_COMMON) \
		-DCMAKE_SYSTEM_NAME=iOS \
		-DCMAKE_OSX_DEPLOYMENT_TARGET=13.0 \
		-DCMAKE_OSX_ARCHITECTURES=arm64 \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/ios/device
	$(ARM_CMAKE) --build $(BUILD)/ios/device \
		--config Release \
		--target tdjson \
		--parallel $(JOBS)

ios-simulator:
	@rm -rf $(BUILD)/ios/simulator
	$(ARM_CMAKE) -S $(TDLIB) \
		-B $(BUILD)/ios/simulator \
		-G Xcode \
		$(CMAKE_COMMON) \
		-DCMAKE_SYSTEM_NAME=iOS \
		-DCMAKE_OSX_DEPLOYMENT_TARGET=13.0 \
		-DCMAKE_OSX_SYSROOT=iphonesimulator \
		-DCMAKE_OSX_ARCHITECTURES="arm64;x86_64" \
		-DCMAKE_INSTALL_PREFIX=$(BUILD)/ios/simulator
	$(ARM_CMAKE) --build $(BUILD)/ios/simulator \
		--config Release \
		--target tdjson \
		--parallel $(JOBS)

app:
	@test -n "$(PLATFORM)" || (echo "Usage: make app PLATFORM=macos"; exit 1)
	$(MAKE) tdlib PLATFORM=$(PLATFORM)
	$(FLUTTER) build $(PLATFORM) --release

clean:
	rm -rf $(BUILD)
	rm -rf $(DIST)
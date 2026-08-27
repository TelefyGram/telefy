# Contributing to Telefy

## Требования

- Flutter 3.47.1 или совместимая стабильная версия
- Dart SDK 3.13.1 или совместимая версия
- Xcode и CocoaPods для macOS/iOS
- Android SDK и `adb` для Android
- Node.js и npm для упаковки `tdweb`

TDLib находится в `tdlib/` и считается неизменяемой зависимостью. Не изменяйте,
не форматируйте и не пересобирайте файлы внутри этого каталога. Интеграционные
скрипты проекта могут использовать TDLib только как источник.

## Настройка

```bash
cp .env.example .env
flutter pub get
```

Заполните `.env`:

```dotenv
TELEGRAM_API_ID=your_api_id
TELEGRAM_API_HASH=your_api_hash
```

Не добавляйте `.env` в Git.

## Makefile

Основные параметры:

```bash
make run PLATFORM=web PORT=8080 BUILD_MODE=debug
```

Доступные цели:

```text
make setup          Установить зависимости проекта
make doctor         Проверить окружение
make run-web        Сгенерировать tdweb и запустить web-приложение
make run-android    Запустить Android-приложение
make build-web      Собрать Flutter Web
make build-web-wasm Собрать web-плагин TDLib из имеющегося WASM-кэша
make split-apk      Собрать APK по архитектурам
make bundle         Собрать Android App Bundle
make package-native Упаковать native-библиотеки
make clean          Очистить сборочные результаты
make clean-all      Очистить сборочные результаты и зависимости
make build-info     Показать параметры сборки
```

## Web

`make run-web` сначала запускает `scripts/build-web-wasm.sh`, затем Flutter.
Скрипт создаёт временную сборку в `build/tdweb-build/` и генерирует артефакты
в `web/tdweb/`:

- `tdweb.js`
- worker-файл webpack
- `td_wasm.js`
- `.wasm`

Для production-сборки:

```bash
make build-web BUILD_MODE=release
```

## Widget Preview

Для локального preview компонентов:

```bash
flutter widget-preview start
```

Декларации находятся в `lib/widget_previews.dart`. Служебный каталог

## Проверки перед PR

```bash
dart format lib test
flutter analyze
flutter test
```

Для web-изменений дополнительно выполните:

```bash
make build-web-wasm
flutter build web
```

## Pull Request

- Описывайте причину изменения и способ проверки.
- Не добавляйте секреты и generated-файлы.
- Не изменяйте `tdlib/`.
- Держите изменения сфокусированными на одной задаче.
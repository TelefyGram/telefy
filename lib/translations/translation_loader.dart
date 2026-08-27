import 'translation_loader_io.dart'
    if (dart.library.html) 'translation_loader_web.dart';

Future<String> loadTranslationJson(String languageCode, String assetPath) {
  return loadTranslationJsonImpl(languageCode, assetPath);
}

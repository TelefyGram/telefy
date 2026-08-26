import 'package:flutter/foundation.dart';

@immutable
class OnboardingPage {
  final String asset;
  final String title;
  final String description;

  const OnboardingPage({
    required this.asset,
    required this.title,
    required this.description,
  });
}

const onboardingPages = <OnboardingPage>[
  OnboardingPage(
    asset: 'assets/animations/hello.tgs',
    title: 'Привет!',
    description: 'Добро пожаловать в Telefy',
  ),
  OnboardingPage(
    asset: 'assets/animations/source.tgs',
    title: 'Telefy',
    description: 'Открытый. Безопасный. Стабильный.',
  ),
  OnboardingPage(
    asset: 'assets/animations/platform.tgs',
    title: 'Кроссплатформенность',
    description: 'Пользуйся Telefy на любом устройстве\nwindows, macos, linux, ios, android',
  ),
  OnboardingPage(
    asset: 'assets/animations/communicate.tgs',
    title: 'Общайся с удобством',
    description: 'Общайся с пользователями из других мессенджеров',
  ),
  OnboardingPage(
    asset: 'assets/animations/agitation.tgs',
    title: 'Находи аудиторию',
    description: 'Публикуй посты в общей ленте и развивай свой канал',
  ),
  OnboardingPage(
    asset: 'assets/animations/music.tgs',
    title: 'Музыка',
    description: 'Добавляй музыку и слушай то, что добавляют другие',
  ),
];

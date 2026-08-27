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
    title: 'auth.hellotitle',
    description: 'auth.hellomsg',
  ),
  OnboardingPage(
    asset: 'assets/animations/source.tgs',
    title: 'onboarding.sourceTitle',
    description: 'onboarding.sourceDescription',
  ),
  OnboardingPage(
    asset: 'assets/animations/platform.tgs',
    title: 'onboarding.platformTitle',
    description: 'onboarding.platformDescription',
  ),
  OnboardingPage(
    asset: 'assets/animations/communicate.tgs',
    title: 'onboarding.communicateTitle',
    description: 'onboarding.communicateDescription',
  ),
  OnboardingPage(
    asset: 'assets/animations/agitation.tgs',
    title: 'onboarding.audienceTitle',
    description: 'onboarding.audienceDescription',
  ),
  OnboardingPage(
    asset: 'assets/animations/music.tgs',
    title: 'onboarding.musicTitle',
    description: 'onboarding.musicDescription',
  ),
];

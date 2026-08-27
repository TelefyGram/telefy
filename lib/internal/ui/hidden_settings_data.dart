import 'package:flutter/material.dart';

import '../../translations/translation.dart';

@immutable
class HiddenSettingDescription {
  final IconData icon;
  final String titleKey;
  final String? subtitleKey;

  const HiddenSettingDescription({
    required this.icon,
    required this.titleKey,
    this.subtitleKey,
  });

  String get title => tr(titleKey);
  String? get subtitle => subtitleKey == null ? null : tr(subtitleKey!);
}

const hiddenSettingDescriptions = <HiddenSettingDescription>[
  HiddenSettingDescription(
    icon: Icons.language_outlined,
    titleKey: 'settings.language',
    subtitleKey: 'settings.languageDescription',
  ),
  HiddenSettingDescription(
    icon: Icons.description_outlined,
    titleKey: 'settings.exportLog',
    subtitleKey: 'settings.exportLogDescription',
  ),
];

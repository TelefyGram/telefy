# Translation Preview

VS Code extension for showing JSON translations inline and completing keys in Dart calls such as `tr('profile.logoutFailed')`.

The inline result appears after the call. Completion reads keys from the selected JSON, so typing `tr('auth.` offers keys such as `hellotitle` and `hellomsg`. The selected JSON value is also shown as completion detail.

## Select a config

Run `Translation Preview: Select Config` from the Command Palette and choose a JSON file. The selected workspace setting is stored in `translationPreview.configFiles`.

Example `.vscode/settings.json`:

```json
{
  "translationPreview.configFiles": [
    "assets/translations/ru.json",
    "assets/translations/en.json"
  ]
}
```

The first existing valid JSON file is used. Nested keys are resolved with dots, for example `profile.logoutFailed`.

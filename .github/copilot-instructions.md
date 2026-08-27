# Project Agent Instructions

## Localized UI Text

- All user-visible text in Flutter UI must use the `tr` function from `lib/translations/translation.dart`.
- Add a key to both `assets/translations/ru.json` and `assets/translations/en.json` instead of hardcoding labels, button text, titles, tooltips, messages, or placeholders.
- Do not use literal user-visible strings in widgets, including fallback labels and accessibility text; keep technical protocol values and log messages localized only when shown to users.

## Widget Previews

- Every new Flutter UI widget must have a representative `@Preview` example in `lib/widget_previews.dart`.
- Preview sample text must use `tr` and have keys in both translation files.
- Keep previews interactive when the widget has meaningful interaction, and include loading, empty, and error states when they are part of the widget contract.

## UI Architecture And Material 3

- Use Material 3 consistently across the entire Flutter interface: `ThemeData(useMaterial3: true)`, `ColorScheme`, Material 3 components, and shared theme tokens.
- Keep UI rendering and interaction logic in widgets/screens, but move UI descriptions, configuration data, labels, sections, and presentation metadata into the relevant `internal/` module.
- Do not duplicate theme values or presentation descriptions in individual widgets; reuse the shared internal UI modules.

## Theme Files And Design Tokens

- Store selectable themes in `assets/themes/*.json.theme`; keep theme names in `ThemeController.themes`.
- Define reusable colors under `colors` and widget-specific values under `elements` in every theme file.
- Read colors with `theme('colors.tokenName', fallback)` and other values with `themeValue('elements.widget.property')` from `lib/internal/ui/app_theme.dart`; do not hardcode design colors or radii in widgets.
- Add every new theme token to all selectable theme files, and keep user-visible theme names localized in both translation JSON files.
- When adding a widget with a distinct visual role, give it a dedicated token such as `colors.chatIncoming` or `elements.profile.avatarRadius` instead of reusing an unrelated token.

## Immutable TDLib

- Treat `tdlib/` as immutable and read-only.
- Never create, edit, delete, format, regenerate, or revert any file inside `tdlib/`, including shell scripts, JavaScript, WebAssembly sources, configuration, generated files, and submodule metadata.
- Do not run commands that write into `tdlib/` or change its Git state.
- Preserve any existing user changes inside `tdlib/`.
- If a task appears to require changing `tdlib/`, stop that part of the work and explain that the change must be made outside `tdlib/` or explicitly approved by the user.
- Project integration files outside `tdlib/`, such as `scripts/`, `lib/`, `web/`, and `build/`, may be changed when required, but do not modify TDLib to make them work.

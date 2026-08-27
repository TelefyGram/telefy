import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../tdlib/client.dart';
import '../../../internal/ui/app_theme.dart';
import '../chats/chats_screen.dart';
import '../../../translations/translation.dart';
import '../../widgets/dialog.dart';
import '../../widgets/loading.dart';
import '../../widgets/profile_avatar.dart';
import '../auth/hello_screen.dart';
import '../settings/settings.dart';

class ProfileScreen extends StatefulWidget {
  final TelegramClientApi client;
  final TelegramUserInfo? initialAccount;

  const ProfileScreen({required this.client, this.initialAccount, super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late Future<TelegramUserInfo> _accountFuture;
  bool _isLoggingOut = false;

  @override
  void initState() {
    super.initState();
    _accountFuture = widget.initialAccount != null
        ? Future.value(widget.initialAccount)
        : widget.client.getMe();
  }

  Future<void> _reload() async {
    final accountFuture = widget.client.getMe();
    setState(() {
      _accountFuture = accountFuture;
    });
    await accountFuture;
  }

  Future<void> _logout() async {
    if (_isLoggingOut) return;

    var confirmed = false;
    await TelefyDialog.show(
      context,
      title: tr('profile.logoutTitle'),
      message: tr('profile.logoutMessage'),
      actions: [
        TelefyDialogAction(
          label: tr('profile.cancel'),
          onPressed: () {},
          shortcut: const SingleActivator(LogicalKeyboardKey.escape),
        ),
        TelefyDialogAction(
          label: tr('profile.logout'),
          onPressed: () => confirmed = true,
          shortcut: const SingleActivator(LogicalKeyboardKey.enter),
        ),
      ],
    );
    if (!confirmed || !mounted) return;

    setState(() => _isLoggingOut = true);
    try {
      await widget.client.logOut();
      if (!mounted) return;
      final client = widget.client;
      if (client is! TelegramClient) {
        return;
      }
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (_) => OnboardingScreen(client: client)),
        (_) => false,
      );
    } on Object catch (error) {
      if (!mounted) return;
      setState(() => _isLoggingOut = false);
      debugPrint('Logout failed: $error');
      await TelefyDialog.show(
        context,
        title: tr('profile.logoutFailed'),
        message: tr('profile.tryAgain'),
        actions: [
          TelefyDialogAction(label: tr('auth.understood'), onPressed: () {}),
        ],
        includeLogAction: true,
      );
    }
  }

  @override
  void dispose() {
    super.dispose();
  }

  String? _value(String? value) {
    final trimmed = value?.trim();
    return trimmed == null || trimmed.isEmpty ? null : trimmed;
  }

  String _name(TelegramUserInfo account) {
    final parts = [
      account.firstName,
      account.lastName,
    ].map(_value).whereType<String>().toList();
    return parts.isEmpty ? tr('profile.title') : parts.join(' ');
  }

  List<_ProfileRow> _rows(TelegramUserInfo account) {
    return [
      if (_value(account.firstName) != null || _value(account.lastName) != null)
        _ProfileRow(
          label: tr('profile.name'),
          value: [
            account.firstName,
            account.lastName,
          ].map(_value).whereType<String>().join(' '),
        ),
      if (_value(account.username) != null)
        _ProfileRow(
          label: tr('profile.username'),
          value: '@${account.username}',
          copyable: true,
        ),
      if (_value(account.phoneNumber) != null)
        _ProfileRow(label: tr('profile.phone'), value: account.phoneNumber!),
      if (account.id != null)
        _ProfileRow(
          label: tr('profile.peerId'),
          value: account.id.toString(),
          copyable: true,
        ),
    ];
  }

  Future<void> _copy(String value) async {
    await Clipboard.setData(ClipboardData(text: value));
    if (!mounted) return;
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(tr('profile.copied'))));
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(tr('profile.title')),
        centerTitle: true,
        actions: [
          IconButton(
            tooltip: tr('profile.refresh'),
            onPressed: _reload,
            icon: const Icon(Icons.refresh_rounded),
          ),
          IconButton(
            tooltip: tr('profile.logoutTooltip'),
            onPressed: _isLoggingOut ? null : _logout,
            icon: const Icon(Icons.logout_rounded),
          ),
          IconButton(
            tooltip: tr('chats.title'),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => ChatsScreen(client: widget.client),
              ),
            ),
            icon: const Icon(Icons.forum_outlined),
          ),
        ],
      ),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final contentWidth = constraints.maxWidth.clamp(0.0, 560.0);
            return ListView(
              padding: const EdgeInsets.only(bottom: 28),
              children: [
                Align(
                  alignment: Alignment.topCenter,
                  child: SizedBox(
                    width: contentWidth,
                    child: FutureBuilder<TelegramUserInfo>(
                      future: _accountFuture,
                      builder: (context, snapshot) {
                        if (snapshot.connectionState ==
                            ConnectionState.waiting) {
                          return const SizedBox(
                            height: 160,
                            child: Center(child: Loading(size: 34)),
                          );
                        }
                        if (snapshot.hasError) {
                          return _ProfileError(
                            onRetry: _reload,
                            message: tr('profile.accountLoadFailed'),
                          );
                        }
                        final account = snapshot.data;
                        if (account == null) {
                          return _ProfileError(
                            onRetry: _reload,
                            message: tr('profile.accountUnavailable'),
                          );
                        }
                        return _ProfileHeader(
                          account: account,
                          name: _name(account),
                          onOpenAvatar: account.avatarPath == null
                              ? null
                              : () => Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => _AvatarViewer(
                                      path: account.avatarPath!,
                                      name: _name(account),
                                    ),
                                  ),
                                ),
                        );
                      },
                    ),
                  ),
                ),
                Align(
                  alignment: Alignment.topCenter,
                  child: ConstrainedBox(
                    constraints: BoxConstraints(maxWidth: contentWidth),
                    child: FutureBuilder<TelegramUserInfo>(
                      future: _accountFuture,
                      builder: (context, snapshot) {
                        final account = snapshot.data;
                        if (account == null) return const SizedBox.shrink();
                        return _ProfileContent(
                          client: widget.client,
                          account: account,
                          rows: _rows(account),
                          onCopy: _copy,
                          onSettings: () => Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const SettingsScreen(),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class _ProfileRow {
  final String label;
  final String value;
  final bool copyable;

  const _ProfileRow({
    required this.label,
    required this.value,
    this.copyable = false,
  });
}

class _ProfileHeader extends StatelessWidget {
  final TelegramUserInfo account;
  final String name;
  final VoidCallback? onOpenAvatar;

  const _ProfileHeader({
    required this.account,
    required this.name,
    this.onOpenAvatar,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final accent = _accentColor(account.accentColorId, theme);
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 28, 24, 24),
      child: Column(
        children: [
          GestureDetector(
            onTap: onOpenAvatar,
            child: profileAvatar(
              path: account.avatarPath,
              fallback: name.characters.first.toUpperCase(),
              radius: 44,
              backgroundColor: accent,
              foregroundColor: theme.colorScheme.onPrimary,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                name,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                ),
              ),
              if (account.emojiStatusId != null) ...[
                const SizedBox(width: 6),
                Text(
                  tr('profile.emojiMarker'),
                  style: const TextStyle(fontSize: 18),
                ),
              ],
            ],
          ),
          const SizedBox(height: 4),
          Text(
            account.username == null
                ? tr('profile.online')
                : '@${account.username}',
            style: TextStyle(color: theme.colorScheme.primary, fontSize: 15),
          ),
        ],
      ),
    );
  }

  Color _accentColor(int? colorId, ThemeData themeData) {
    const colors = [
      Color(0xff3390ec),
      Color(0xffe17076),
      Color(0xfff5a623),
      Color(0xff58b85c),
      Color(0xff9c6ade),
      Color(0xffe85aad),
    ];
    return colorId == null
        ? theme('colors.profileAccent', themeData.colorScheme.primary)
        : colors[colorId.abs() % colors.length];
  }
}

class _ProfileContent extends StatelessWidget {
  final TelegramClientApi client;
  final TelegramUserInfo account;
  final List<_ProfileRow> rows;
  final Future<void> Function(String value) onCopy;
  final VoidCallback onSettings;

  const _ProfileContent({
    required this.client,
    required this.account,
    required this.rows,
    required this.onCopy,
    required this.onSettings,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _ProfileSection(
          children: [
            for (final row in rows)
              _ProfileInfoTile(
                label: row.label,
                value: row.value,
                onTap: row.copyable ? () => onCopy(row.value) : null,
              ),
          ],
        ),
        const SizedBox(height: 12),
        _ProfileSection(
          children: [
            if (account.bio != null && account.bio!.trim().isNotEmpty)
              _ProfileInfoTile(label: tr('profile.about'), value: account.bio!),
            _ProfileInfoTile(
              label: tr('profile.status'),
              value: account.isPremium
                  ? tr('profile.premium')
                  : tr('profile.online'),
            ),
            if (account.emojiStatusId != null)
              _ProfileInfoTile(
                label: tr('profile.emojiStatus'),
                value: account.emojiStatusId.toString(),
              ),
            _ProfileInfoTile(
              label: tr('profile.workHours'),
              value: tr('profile.workHoursEmpty'),
            ),
          ],
        ),
        const SizedBox(height: 12),
        _ProfileSection(
          children: [
            if (account.channelId != null)
              ExpansionTile(
                leading: const Icon(Icons.campaign_outlined),
                title: Text(tr('profile.channel')),
                subtitle: Text(tr('profile.channelOpen')),
                //
              )
            else
              _ProfileInfoTile(
                label: tr('profile.publications'),
                value: tr('profile.noPublications'),
              ),
          ],
        ),
        if (account.gifts.isNotEmpty) ...[
          const SizedBox(height: 12),
          _ProfileSection(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 14, 16, 6),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    tr('profile.gifts'),
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                ),
              ),
              for (final gift in account.gifts) _GiftTile(gift: gift),
            ],
          ),
        ],
        const SizedBox(height: 12),
        _ProfileSection(
          children: [
            _ProfileAction(
              icon: Icons.settings_outlined,
              title: tr('profile.settings'),
              onTap: onSettings,
            ),
          ],
        ),
      ],
    );
  }
}

class _ProfileSection extends StatelessWidget {
  final List<Widget> children;

  const _ProfileSection({required this.children});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Theme.of(context).colorScheme.surface,
      borderRadius: BorderRadius.circular(12),
      clipBehavior: Clip.antiAlias,
      child: Column(children: children),
    );
  }
}

class _ProfileInfoTile extends StatelessWidget {
  final String label;
  final String value;
  final VoidCallback? onTap;

  const _ProfileInfoTile({
    required this.label,
    required this.value,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final icon = label == tr('profile.phone')
        ? Icons.phone_outlined
        : label == tr('profile.peerId')
        ? Icons.tag_outlined
        : Icons.person_outline;
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
      leading: Icon(icon, color: theme.colorScheme.primary),
      title: Text(value),
      subtitle: Text(label),
      trailing: onTap == null
          ? null
          : Icon(
              Icons.copy_outlined,
              size: 20,
              color: theme.colorScheme.primary,
            ),
      onTap: onTap,
    );
  }
}

class _GiftTile extends StatelessWidget {
  final TelegramGiftInfo gift;

  const _GiftTile({required this.gift});

  @override
  Widget build(BuildContext context) {
    final title = gift.name.isEmpty ? tr('profile.gift') : gift.name;
    return ListTile(
      leading: gift.stickerPath == null
          ? const Icon(Icons.card_giftcard_outlined)
          : SizedBox(
              width: 42,
              height: 42,
              child: profileImage(gift.stickerPath!),
            ),
      title: Text(title),
      subtitle: Text(tr('profile.giftReceived')),
    );
  }
}

class _ProfileAction extends StatelessWidget {
  final IconData icon;
  final String title;
  final VoidCallback onTap;

  const _ProfileAction({
    required this.icon,
    required this.title,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
      leading: Icon(icon),
      title: Text(title),
      onTap: onTap,
    );
  }
}

class _ProfileError extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;

  const _ProfileError({required this.message, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(message, textAlign: TextAlign.center),
        const SizedBox(height: 16),
        TextButton(onPressed: onRetry, child: Text(tr('profile.retry'))),
      ],
    );
  }
}

class _AvatarViewer extends StatelessWidget {
  final String path;
  final String name;

  const _AvatarViewer({required this.path, required this.name});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        title: Text(name),
      ),
      body: Center(child: profileImage(path)),
    );
  }
}

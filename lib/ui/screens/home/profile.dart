import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../tdlib/client.dart';
import '../../widgets/dialog.dart';
import '../../widgets/loading.dart';
import '../auth/hello_screen.dart';

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
      title: 'Выйти из аккаунта?',
      message: 'Сохранённая сессия будет завершена на этом устройстве.',
      actions: [
        TelefyDialogAction(
          label: 'Отмена',
          onPressed: () {},
          shortcut: const SingleActivator(LogicalKeyboardKey.escape),
        ),
        TelefyDialogAction(
          label: 'Выйти',
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
      debugPrint('Не удалось выйти из аккаунта: $error');
      await TelefyDialog.show(
        context,
        title: 'Не удалось выйти',
        message: 'Попробуйте ещё раз.',
        actions: [TelefyDialogAction(label: 'Понятно', onPressed: () {})],
      );
    }
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
    return parts.isEmpty ? 'Профиль' : parts.join(' ');
  }

  List<_ProfileRow> _rows(TelegramUserInfo account) {
    return [
      if (_value(account.firstName) != null || _value(account.lastName) != null)
        _ProfileRow(
          label: 'Имя',
          value: [
            account.firstName,
            account.lastName,
          ].map(_value).whereType<String>().join(' '),
        ),
      if (_value(account.username) != null)
        _ProfileRow(label: 'Username', value: '@${account.username}'),
      if (_value(account.phoneNumber) != null)
        _ProfileRow(label: 'Телефон', value: account.phoneNumber!),
      if (account.id != null)
        _ProfileRow(label: 'ID', value: account.id.toString()),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Профиль'),
        centerTitle: true,
        actions: [
          IconButton(
            tooltip: 'Обновить',
            onPressed: _reload,
            icon: const Icon(Icons.refresh_rounded),
          ),
          IconButton(
            tooltip: 'Выйти из аккаунта',
            onPressed: _isLoggingOut ? null : _logout,
            icon: const Icon(Icons.logout_rounded),
          ),
        ],
      ),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final contentWidth = constraints.maxWidth.clamp(0.0, 560.0);
            return Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(24, 32, 24, 32),
                child: SizedBox(
                  width: contentWidth,
                  child: FutureBuilder<TelegramUserInfo>(
                    future: _accountFuture,
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const SizedBox(
                          height: 160,
                          child: Center(child: Loading(size: 34)),
                        );
                      }
                      if (snapshot.hasError) {
                        return _ProfileError(
                          onRetry: _reload,
                          message: 'Не удалось загрузить данные аккаунта.',
                        );
                      }

                      final account = snapshot.data;
                      if (account == null) {
                        return _ProfileError(
                          onRetry: _reload,
                          message: 'Данные аккаунта недоступны.',
                        );
                      }

                      final rows = _rows(account);
                      return Column(
                        children: [
                          CircleAvatar(
                            radius: 48,
                            backgroundColor: theme.colorScheme.primaryContainer,
                            child: Text(
                              _name(account).characters.first.toUpperCase(),
                              style: TextStyle(
                                fontSize: 36,
                                color: theme.colorScheme.onPrimaryContainer,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),
                          Text(
                            _name(account),
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 28),
                          if (rows.isEmpty)
                            const Text('Данные аккаунта недоступны.')
                          else
                            ...rows.map(
                              (row) => _ProfileInfoTile(
                                label: row.label,
                                value: row.value,
                              ),
                            ),
                        ],
                      );
                    },
                  ),
                ),
              ),
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

  const _ProfileRow({required this.label, required this.value});
}

class _ProfileInfoTile extends StatelessWidget {
  final String label;
  final String value;

  const _ProfileInfoTile({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
      decoration: BoxDecoration(
        color: theme.colorScheme.surfaceContainerHighest,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 92,
            child: Text(
              label,
              style: TextStyle(color: theme.colorScheme.onSurfaceVariant),
            ),
          ),
          Expanded(
            child: Text(
              value,
              textAlign: TextAlign.end,
              style: const TextStyle(fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
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
        TextButton(onPressed: onRetry, child: const Text('Повторить')),
      ],
    );
  }
}

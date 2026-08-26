import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

import '../../../telegram/client.dart';
import '../../widgets/dialog.dart';

class PasswordScreen extends StatefulWidget {
  final TelegramClient client;

  const PasswordScreen({required this.client, super.key});

  @override
  State<PasswordScreen> createState() => _PasswordScreenState();
}

class _PasswordScreenState extends State<PasswordScreen>
    with SingleTickerProviderStateMixin {
  final _passwordController = TextEditingController();
  final _focusNode = FocusNode();
  late final AnimationController _shakeController;

  bool _isVerifying = false;
  bool _obscurePassword = true;
  bool _hasError = false;

  bool get _canContinue => _passwordController.text.trim().isNotEmpty;

  @override
  void initState() {
    super.initState();
    _shakeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 360),
    );
    _passwordController.addListener(_onPasswordChanged);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _passwordController
      ..removeListener(_onPasswordChanged)
      ..dispose();
    _focusNode.dispose();
    _shakeController.dispose();
    super.dispose();
  }

  void _onPasswordChanged() {
    setState(() => _hasError = false);
  }

  double _responsiveSize(
    double value,
    double width,
    double height, {
    double min = 0,
    double max = double.infinity,
  }) {
    final scale = ((width / 400) + (height / 800)) / 2;
    return (value * scale).clamp(min, max);
  }

  Future<void> _continue() async {
    if (!_canContinue || _isVerifying) return;

    setState(() {
      _isVerifying = true;
      _hasError = false;
    });

    try {
      final account = await widget.client.checkAuthenticationPassword(
        password: _passwordController.text,
      );
      if (!mounted) return;
      await _showAccount(account);
      if (mounted) Navigator.pop(context);
    } on Object catch (error) {
      if (!mounted) return;
      debugPrint('Не удалось проверить пароль: $error');
      setState(() {
        _isVerifying = false;
        _hasError = true;
      });
      _shakeController.forward(from: 0);
      _passwordController.clear();
      await TelefyDialog.show(
        context,
        title: 'Неверный пароль',
        message: 'Проверьте пароль и попробуйте ещё раз.',
        actions: [
          TelefyDialogAction(
            label: 'Понятно',
            onPressed: _focusNode.requestFocus,
          ),
        ],
      );
    }
  }

  Future<void> _showAccount(TelegramUserInfo account) {
    final details = <String>[
      if (_value(account.firstName) != null || _value(account.lastName) != null)
        'Имя: ${[account.firstName, account.lastName].whereType<String>().join(' ')}',
      if (_value(account.username) != null) 'Username: @${account.username}',
      if (_value(account.phoneNumber) != null)
        'Телефон: ${account.phoneNumber}',
      if (account.id != null) 'ID: ${account.id}',
    ];
    return TelefyDialog.show(
      context,
      title: 'Аккаунт',
      message: details.isEmpty
          ? 'Данные аккаунта недоступны.'
          : details.join('\n'),
      actions: [TelefyDialogAction(label: 'Понятно', onPressed: () {})],
    );
  }

  String? _value(String? value) => value?.trim().isEmpty == true ? null : value;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          tooltip: 'Назад',
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: _isVerifying ? null : () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final width = constraints.maxWidth;
            final height = constraints.maxHeight;
            final titleSize = _responsiveSize(
              30,
              width,
              height,
              min: 24,
              max: 36,
            );
            final descriptionSize = _responsiveSize(
              17,
              width,
              height,
              min: 14,
              max: 19,
            );
            return Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(24, 12, 24, 32),
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 500),
                  child: AnimatedBuilder(
                    animation: _shakeController,
                    builder: (context, child) {
                      final progress = _shakeController.value;
                      final offset =
                          (progress < 0.5 ? progress * 2 : (1 - progress) * 2) *
                          8;
                      return Transform.translate(
                        offset: Offset(offset * (progress < 0.5 ? -1 : 1), 0),
                        child: child,
                      );
                    },
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SizedBox(
                          width: 150,
                          height: 150,
                          child: Lottie.asset(
                            'assets/animations/password.tgs',
                            decoder: LottieComposition.decodeGZip,
                            fit: BoxFit.contain,
                            repeat: true,
                            animate: true,
                          ),
                        ),
                        const SizedBox(height: 20),
                        Text(
                          'Введите пароль',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: titleSize,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Введите пароль двухэтапной аутентификации',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: descriptionSize,
                            height: 1.4,
                            color: Colors.grey.shade600,
                          ),
                        ),
                        const SizedBox(height: 32),
                        TextField(
                          controller: _passwordController,
                          focusNode: _focusNode,
                          obscureText: _obscurePassword,
                          keyboardType: TextInputType.visiblePassword,
                          textInputAction: TextInputAction.done,
                          onSubmitted: (_) => _continue(),
                          decoration: InputDecoration(
                            hintText: 'Пароль',
                            errorText: _hasError ? 'Неверный пароль' : null,
                            suffixIcon: IconButton(
                              tooltip: _obscurePassword
                                  ? 'Показать пароль'
                                  : 'Скрыть пароль',
                              icon: Icon(
                                _obscurePassword
                                    ? Icons.visibility_rounded
                                    : Icons.visibility_off_rounded,
                              ),
                              onPressed: () => setState(
                                () => _obscurePassword = !_obscurePassword,
                              ),
                            ),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: BorderSide(
                                color: _hasError
                                    ? theme.colorScheme.error
                                    : Colors.grey.shade300,
                              ),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: BorderSide(
                                color: _hasError
                                    ? theme.colorScheme.error
                                    : theme.colorScheme.primary,
                                width: 2,
                              ),
                            ),
                          ),
                        ),
                        // TODO: Добавить восстановление пароля после подключения
                        // соответствующего сценария в текущем TDLib auth flow.
                        const SizedBox(height: 28),
                        SizedBox(
                          width: double.infinity,
                          height: 56,
                          child: FilledButton(
                            onPressed: _canContinue && !_isVerifying
                                ? _continue
                                : null,
                            style: FilledButton.styleFrom(
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(18),
                              ),
                              textStyle: const TextStyle(
                                fontSize: 17,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            child: _isVerifying
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                    ),
                                  )
                                : const Text('Продолжить'),
                          ),
                        ),
                      ],
                    ),
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

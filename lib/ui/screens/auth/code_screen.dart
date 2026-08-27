import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lottie/lottie.dart';

import '../../../tdlib/client.dart';
import '../../../translations/translation.dart';
import '../../widgets/dialog.dart';
import '../../widgets/loading.dart';
import '../profile/profile.dart';
import 'password_screen.dart';

class CodeScreen extends StatefulWidget {
  final TelegramClient client;
  final String phoneNumber;

  const CodeScreen({
    required this.client,
    required this.phoneNumber,
    super.key,
  });

  @override
  State<CodeScreen> createState() => _CodeScreenState();
}

class _CodeScreenState extends State<CodeScreen>
    with SingleTickerProviderStateMixin {
  final _codeController = TextEditingController();
  final _focusNode = FocusNode();
  late final AnimationController _shakeController;

  bool _isVerifying = false;
  bool? _isCorrect;
  bool _isClearingCode = false;

  @override
  void initState() {
    super.initState();
    _shakeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 360),
    );
    _codeController.addListener(_onCodeChanged);
  }

  @override
  void dispose() {
    _codeController
      ..removeListener(_onCodeChanged)
      ..dispose();
    _focusNode.dispose();
    _shakeController.dispose();
    super.dispose();
  }

  void _onCodeChanged() {
    if (_isClearingCode) return;
    final code = _codeController.text;
    setState(() {
      if (code.length < 5) _isCorrect = null;
    });
    if (code.length == 5 && !_isVerifying) {
      _verifyCode(code);
    }
  }

  Future<void> _verifyCode(String code) async {
    if (code.length != 5 || _isVerifying) return;

    setState(() {
      _isVerifying = true;
    });

    try {
      final result = await widget.client.checkAuthenticationCode(code: code);
      if (!mounted) return;
      if (result == AuthenticationCodeResult.passwordRequired) {
        setState(() {
          _isVerifying = false;
          _isCorrect = false;
        });
        _isClearingCode = true;
        _codeController.clear();
        _isClearingCode = false;
        await Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => PasswordScreen(client: widget.client),
          ),
        );
        return;
      }
      setState(() {
        _isVerifying = false;
        _isCorrect = true;
      });
      await Future<void>.delayed(const Duration(milliseconds: 420));
      if (mounted) {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(
            builder: (_) => ProfileScreen(client: widget.client),
          ),
          (_) => false,
        );
      }
    } on Object catch (error) {
      if (!mounted) return;
      final message = _codeErrorMessage(error);
      setState(() {
        _isVerifying = false;
        _isCorrect = false;
      });
      _shakeController.forward(from: 0);
      _focusNode.unfocus();
      _isClearingCode = true;
      _codeController.clear();
      _isClearingCode = false;
      await TelefyDialog.show(
        context,
        title: message.$1,
        message: message.$2,
        actions: [
          TelefyDialogAction(label: tr('auth.understood'), onPressed: () {}),
        ],
      );
      await Future<void>.delayed(const Duration(milliseconds: 400));
      if (mounted && _codeController.text.isEmpty) {
        setState(() => _isCorrect = null);
      }
    }
  }

  (String, String) _codeErrorMessage(Object error) {
    final message = error.toString().toLowerCase();
    if (message.contains('password')) {
      return (
        tr('auth.passwordRequiredTitle'),
        tr('auth.passwordRequiredMessage'),
      );
    }
    if (message.contains('network') || message.contains('connection')) {
      return (tr('auth.codeErrorTitle'), tr('auth.networkError'));
    }
    if (message.contains('expired')) {
      return (tr('auth.expiredCode'), tr('auth.expiredCodeMessage'));
    }
    if (message.contains('flood') ||
        message.contains('too many') ||
        message.contains('429')) {
      return (tr('auth.tooManyAttempts'), tr('auth.tryLater'));
    }
    return (tr('auth.wrongCode'), tr('auth.wrongCodeMessage'));
  }

  void _submit() => _verifyCode(_codeController.text.replaceAll(' ', ''));

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return PopScope(
      canPop: false,
      child: Scaffold(
        appBar: AppBar(automaticallyImplyLeading: false),
        body: SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              final contentWidth = (constraints.maxWidth - 48).clamp(
                0.0,
                460.0,
              );
              final spacing = contentWidth < 360 ? 6.0 : 8.0;
              final cellSize = ((contentWidth - spacing * 4) / 5).clamp(
                40.0,
                64.0,
              );
              return Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(24, 12, 24, 32),
                  child: SizedBox(
                    width: contentWidth,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SizedBox(
                          width: 150,
                          height: 150,
                          child: Lottie.asset(
                            'assets/animations/safe.tgs',
                            decoder: LottieComposition.decodeGZip,
                            fit: BoxFit.contain,
                            repeat: true,
                            animate: true,
                          ),
                        ),
                        const SizedBox(height: 20),
                        Text(
                          tr('auth.codeTitle'),
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 30,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          tr('auth.codeDescription'),
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 16,
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          widget.phoneNumber,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 28),
                        _CodeInput(
                          controller: _codeController,
                          focusNode: _focusNode,
                          cellSize: cellSize,
                          spacing: spacing,
                          isVerifying: _isVerifying,
                          isCorrect: _isCorrect,
                          shakeAnimation: _shakeController,
                        ),
                        SizedBox(
                          height: 28,
                          child: _isVerifying
                              ? const Padding(
                                  padding: EdgeInsets.only(top: 10),
                                  child: Loading(size: 16),
                                )
                              : null,
                        ),
                        const SizedBox(height: 12),
                        SizedBox(
                          width: double.infinity,
                          height: 56,
                          child: FilledButton(
                            onPressed:
                                _codeController.text.length == 5 &&
                                    !_isVerifying
                                ? _submit
                                : null,
                            child: Text(tr('auth.continue')),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

class _CodeInput extends StatefulWidget {
  final TextEditingController controller;
  final FocusNode focusNode;
  final double cellSize;
  final double spacing;
  final bool isVerifying;
  final bool? isCorrect;
  final Animation<double> shakeAnimation;

  const _CodeInput({
    required this.controller,
    required this.focusNode,
    required this.cellSize,
    required this.spacing,
    required this.isVerifying,
    required this.isCorrect,
    required this.shakeAnimation,
  });

  @override
  State<_CodeInput> createState() => _CodeInputState();
}

class _CodeInputState extends State<_CodeInput> {
  int? _selectedIndex;

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_onCodeChanged);
    widget.focusNode.addListener(_onFocusChanged);
  }

  @override
  void dispose() {
    widget.controller.removeListener(_onCodeChanged);
    widget.focusNode.removeListener(_onFocusChanged);
    super.dispose();
  }

  void _onFocusChanged() {
    if (!mounted || widget.focusNode.hasFocus) return;
    setState(() => _selectedIndex = null);
  }

  void _onCodeChanged() {
    if (!mounted) return;
    final selection = widget.controller.selection;
    final length = widget.controller.text.length;
    setState(() {
      _selectedIndex = selection.isValid
          ? selection.baseOffset.clamp(0, length.clamp(0, 4))
          : null;
    });
  }

  void _selectIndex(int index) {
    final text = _normalizedText(widget.controller.text);
    final target = index.clamp(0, text.length);
    widget.controller.selection = target < text.length
        ? TextSelection(baseOffset: target, extentOffset: target + 1)
        : TextSelection.collapsed(offset: target);
    widget.focusNode.requestFocus();
    SystemChannels.textInput.invokeMethod<void>('TextInput.show');
  }

  String _normalizedText(String text) {
    final digits = text.replaceAll(RegExp(r'[^0-9]'), '');
    return digits.substring(0, digits.length.clamp(0, 5));
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: widget.shakeAnimation,
      builder: (context, child) {
        final progress = widget.shakeAnimation.value;
        final offset =
            (progress < 0.5 ? progress * 2 : (1 - progress) * 2) * 10;
        return Transform.translate(
          offset: Offset(offset * (progress < 0.5 ? -1 : 1), 0),
          child: child,
        );
      },
      child: Stack(
        alignment: Alignment.center,
        children: [
          Row(
            mainAxisSize: MainAxisSize.min,
            children: List.generate(
              5,
              (index) => Padding(
                padding: EdgeInsets.only(
                  right: index == 4 ? 0 : widget.spacing,
                ),
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: widget.isVerifying ? null : () => _selectIndex(index),
                  child: _CodeCell(
                    value: index < widget.controller.text.length
                        ? widget.controller.text[index]
                        : null,
                    isActive:
                        _selectedIndex == index &&
                        !widget.isVerifying &&
                        widget.isCorrect == null,
                    isCorrect: widget.isCorrect,
                    size: widget.cellSize,
                  ),
                ),
              ),
            ),
          ),
          Positioned(
            left: 0,
            top: 0,
            child: SizedBox(
              width: 1,
              height: 1,
              child: Opacity(
                opacity: 0,
                child: TextField(
                  controller: widget.controller,
                  focusNode: widget.focusNode,
                  readOnly: widget.isVerifying,
                  keyboardType: TextInputType.number,
                  textInputAction: TextInputAction.done,
                  inputFormatters: const [_CodeInputFormatter()],
                  decoration: const InputDecoration(
                    counterText: '',
                    border: InputBorder.none,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _CodeCell extends StatelessWidget {
  final String? value;
  final bool isActive;
  final bool? isCorrect;
  final double size;

  const _CodeCell({
    required this.value,
    required this.isActive,
    required this.isCorrect,
    required this.size,
  });

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final borderColor = isCorrect == true
        ? Colors.green
        : isCorrect == false
        ? colorScheme.error
        : isActive
        ? colorScheme.primary
        : Colors.grey.shade300;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 150),
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: isCorrect == true
            ? Colors.green.withValues(alpha: 0.08)
            : isCorrect == false
            ? colorScheme.error.withValues(alpha: 0.08)
            : colorScheme.surface,
        border: Border.all(color: borderColor, width: isActive ? 2 : 1),
        borderRadius: BorderRadius.circular(15),
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 120),
            transitionBuilder: (child, animation) =>
                ScaleTransition(scale: animation, child: child),
            child: isCorrect == true
                ? Icon(
                    Icons.check_rounded,
                    key: const ValueKey('success'),
                    color: Colors.green,
                    size: 30,
                  )
                : Text(
                    value ?? '',
                    key: ValueKey(value),
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}

class _CodeInputFormatter extends TextInputFormatter {
  const _CodeInputFormatter();

  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final digits = newValue.text.replaceAll(RegExp(r'[^0-9]'), '');
    final text = digits.substring(0, digits.length.clamp(0, 5));
    final nextOffset = newValue.selection.baseOffset.clamp(0, text.length);
    return TextEditingValue(
      text: text,
      selection: nextOffset == 5
          ? const TextSelection(baseOffset: 4, extentOffset: 5)
          : TextSelection.collapsed(offset: nextOffset),
    );
  }
}

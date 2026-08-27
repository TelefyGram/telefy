import 'package:country_picker/country_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lottie/lottie.dart';

import '../../../telegram/client.dart';
import '../../widgets/dialog.dart';
import '../../widgets/loading.dart';
import 'internal/auth.dart';
import 'internal/auth_constants.dart';
import 'code_screen.dart';

class PhoneNumberScreen extends StatefulWidget {
  final TelegramClient client;

  const PhoneNumberScreen({required this.client, super.key});

  @override
  State<PhoneNumberScreen> createState() => _PhoneNumberScreenState();
}

class _PhoneNumberScreenState extends State<PhoneNumberScreen> {
  final FocusNode _focusNode = FocusNode();
  bool _isAnonymousNumber = false;
  bool _isRequestingCode = false;
  final TextEditingController _phoneController = TextEditingController();

  Country? _selectedCountry = Country.parse('RU');

  bool get _canContinue {
    return _phoneController.text.trim().isNotEmpty;
  }

  @override
  void initState() {
    super.initState();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        _focusNode.requestFocus();
      }
    });

    _phoneController.addListener(_onPhoneChanged);
  }

  @override
  void dispose() {
    _focusNode.dispose();
    _phoneController.removeListener(_onPhoneChanged);
    _phoneController.dispose();
    super.dispose();
  }

  void _onPhoneChanged() {
    setState(() {});
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

  void _selectCountry() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return _CountrySelectorSheet(
          selectedCountry: _selectedCountry,
          isAnonymousNumber: _isAnonymousNumber,
          onCountrySelected: (country) {
            setState(() {
              _selectedCountry = country;
              _isAnonymousNumber = false;
            });

            Navigator.pop(context);
          },
          onAnonymousSelected: () {
            setState(() {
              _selectedCountry = null;
              _isAnonymousNumber = true;
            });

            Navigator.pop(context);
          },
        );
      },
    );
  }

  Future<void> _continue() async {
    if (!_canContinue || _isRequestingCode) {
      return;
    }

    final phone = _phoneController.text.trim();

    final phoneCode = _isAnonymousNumber
        ? AnonymousNumber.phoneCode
        : _selectedCountry!.phoneCode;
    final fullPhoneNumber = '+$phoneCode$phone';

    var confirmed = false;
    await TelefyDialog.show(
      context,
      title: 'Ваш номер',
      message: fullPhoneNumber,
      actions: [
        TelefyDialogAction(
          label: 'Изменить',
          onPressed: () {},
          shortcut: const SingleActivator(LogicalKeyboardKey.escape),
        ),
        TelefyDialogAction(
          label: 'Да',
          onPressed: () => confirmed = true,
          shortcut: const SingleActivator(LogicalKeyboardKey.enter),
        ),
      ],
    );
    if (!confirmed || !mounted) {
      return;
    }

    setState(() => _isRequestingCode = true);

    try {
      await requestAuthenticationCode(
        client: widget.client,
        phoneNumber: fullPhoneNumber,
      ).timeout(const Duration(seconds: 45));
      if (!mounted) {
        return;
      }
      await Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) =>
              CodeScreen(client: widget.client, phoneNumber: fullPhoneNumber),
        ),
      );
    } on Object catch (error) {
      debugPrint('Не удалось запросить код: $error');
      if (mounted) {
        final message = error.toString().replaceFirst('Bad state: ', '');
        final isFloodWait =
            message.contains('429') ||
            message.toLowerCase().contains('flood_wait');
        await TelefyDialog.show(
          context,
          title: isFloodWait
              ? 'Код пока недоступен'
              : 'Не удалось получить код',
          message: isFloodWait
              ? 'Telegram временно ограничил запросы. Попробуйте снова позже.'
              : 'Проверьте номер телефона и попробуйте ещё раз.',
          actions: [TelefyDialogAction(label: 'Понятно', onPressed: () {})],
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isRequestingCode = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: Stack(
        children: [
          KeyboardListener(
            focusNode: _focusNode,
            autofocus: true,
            child: SafeArea(
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

                  final horizontalPadding = width < 500 ? 24.0 : 32.0;

                  return Padding(
                    padding: EdgeInsets.symmetric(
                      horizontal: horizontalPadding,
                    ),
                    child: Column(
                      children: [
                        const Spacer(flex: 2),

                        SizedBox(
                          width: _responsiveSize(
                            180,
                            width,
                            height,
                            min: 64,
                            max: 200,
                          ),
                          height: _responsiveSize(
                            180,
                            width,
                            height,
                            min: 64,
                            max: 200,
                          ),
                          child: Lottie.asset(
                            'assets/animations/communicate.tgs',
                            decoder: LottieComposition.decodeGZip,
                            fit: BoxFit.contain,
                            repeat: true,
                            animate: true,
                          ),
                        ),

                        SizedBox(
                          height: _responsiveSize(
                            32,
                            width,
                            height,
                            min: 20,
                            max: 36,
                          ),
                        ),

                        Text(
                          'Введите номер телефона',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: titleSize,
                            height: 1.1,
                            fontWeight: FontWeight.w700,
                          ),
                        ),

                        const SizedBox(height: 12),

                        ConstrainedBox(
                          constraints: const BoxConstraints(maxWidth: 420),
                          child: Text(
                            'Мы отправим код подтверждения на ваш номер телефона',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: descriptionSize,
                              height: 1.4,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ),

                        SizedBox(
                          height: _responsiveSize(
                            36,
                            width,
                            height,
                            min: 24,
                            max: 44,
                          ),
                        ),

                        ConstrainedBox(
                          constraints: const BoxConstraints(maxWidth: 500),
                          child: Container(
                            height: 56,
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: _phoneController.text.isNotEmpty
                                    ? theme.colorScheme.primary
                                    : Colors.grey.shade300,
                              ),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Row(
                              children: [
                                // Выбор страны и кода
                                InkWell(
                                  onTap: _selectCountry,
                                  borderRadius: const BorderRadius.only(
                                    topLeft: Radius.circular(16),
                                    bottomLeft: Radius.circular(16),
                                  ),
                                  child: SizedBox(
                                    width: 150,
                                    child: Padding(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 12,
                                      ),
                                      child: Row(
                                        children: [
                                          Text(
                                            _isAnonymousNumber
                                                ? AnonymousNumber.emoji
                                                : _selectedCountry!.flagEmoji,
                                            style: const TextStyle(
                                              fontSize: 21,
                                            ),
                                          ),

                                          const SizedBox(width: 7),

                                          SizedBox(
                                            width: 72,
                                            child: Text(
                                              _isAnonymousNumber
                                                  ? '+${AnonymousNumber.phoneCode}'
                                                  : '+${_selectedCountry!.phoneCode}',
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              style: const TextStyle(
                                                fontSize: 17,
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                          ),

                                          Icon(
                                            Icons.keyboard_arrow_down_rounded,
                                            size: 19,
                                            color: Colors.grey.shade600,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                                // Разделитель
                                Container(
                                  width: 1,
                                  height: 28,
                                  color: Colors.grey.shade300,
                                ),

                                // Номер телефона
                                Expanded(
                                  child: TextField(
                                    controller: _phoneController,
                                    keyboardType: TextInputType.phone,
                                    textInputAction: TextInputAction.done,
                                    inputFormatters: [
                                      FilteringTextInputFormatter.allow(
                                        RegExp(r'[0-9\s\-\(\)]'),
                                      ),
                                    ],
                                    decoration: const InputDecoration(
                                      hintText: 'Номер телефона',
                                      border: InputBorder.none,
                                      contentPadding: EdgeInsets.symmetric(
                                        horizontal: 12,
                                      ),
                                    ),
                                    onSubmitted: (_) {
                                      if (_canContinue) {
                                        _continue();
                                      }
                                    },
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const Spacer(flex: 3),

                        SizedBox(
                          width: double.infinity,
                          height: 56,
                          child: FilledButton(
                            onPressed: _canContinue && !_isRequestingCode
                                ? _continue
                                : null,
                            child: const Text('Продолжить'),
                          ),
                        ),

                        const SizedBox(height: 24),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
          if (_isRequestingCode)
            Positioned.fill(
              child: ColoredBox(
                color: Colors.black12,
                child: Center(
                  child: Loading(
                    size: 112,
                    color: Theme.of(context).colorScheme.primary,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _CountrySelectorSheet extends StatefulWidget {
  final Country? selectedCountry;
  final bool isAnonymousNumber;

  final ValueChanged<Country> onCountrySelected;
  final VoidCallback onAnonymousSelected;

  const _CountrySelectorSheet({
    required this.selectedCountry,
    required this.isAnonymousNumber,
    required this.onCountrySelected,
    required this.onAnonymousSelected,
  });

  @override
  State<_CountrySelectorSheet> createState() => _CountrySelectorSheetState();
}

class _CountrySelectorSheetState extends State<_CountrySelectorSheet> {
  final TextEditingController _searchController = TextEditingController();

  late final List<Country> _allCountries;
  late List<_PhoneCountryItem> _visibleItems;

  @override
  void initState() {
    super.initState();

    _allCountries = CountryService().getAll();
    _visibleItems = _buildItems();

    _searchController.addListener(_search);
  }

  @override
  void dispose() {
    _searchController.removeListener(_search);
    _searchController.dispose();
    super.dispose();
  }

  void _search() {
    final query = _searchController.text.trim().toLowerCase();

    setState(() {
      _visibleItems = _buildItems(query);
    });
  }

  List<_PhoneCountryItem> _buildItems([String query = '']) {
    final recommendedCodes = ['RU', 'BY', 'UA', 'US', 'KZ', 'NL', 'DE', 'GB'];
    final recommended = recommendedCodes
        .map(
          (code) => _allCountries.firstWhere(
            (country) => country.countryCode == code,
          ),
        )
        .map(_PhoneCountryItem.country)
        .toList();
    final anonymous = _PhoneCountryItem.anonymous();
    final all = _allCountries.map(_PhoneCountryItem.country).toList();
    final items = [...recommended, anonymous, ...all];

    if (query.isEmpty) {
      return items;
    }

    return items.where((item) => item.matches(query)).toList();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return SafeArea(
      child: SizedBox(
        height: MediaQuery.of(context).size.height * 0.82,
        child: Material(
          color: theme.scaffoldBackgroundColor,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          clipBehavior: Clip.antiAlias,
          child: Column(
            children: [
              const SizedBox(height: 10),

              // Полоска сверху
              Container(
                width: 42,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade400,
                  borderRadius: BorderRadius.circular(10),
                ),
              ),

              const SizedBox(height: 18),

              const Text(
                'Выберите страну',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
              ),

              const SizedBox(height: 16),

              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: TextField(
                  controller: _searchController,
                  autofocus: true,
                  decoration: InputDecoration(
                    hintText: 'Поиск страны',
                    prefixIcon: const Icon(Icons.search_rounded),
                    filled: true,
                    fillColor: Colors.grey.shade100,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 8),

              Expanded(
                child: ListView.separated(
                  keyboardDismissBehavior:
                      ScrollViewKeyboardDismissBehavior.onDrag,
                  itemCount: _searchController.text.trim().isEmpty
                      ? _visibleItems.length + 2
                      : _visibleItems.length,
                  separatorBuilder: (context, index) =>
                      index == 0 || index == 10
                      ? const SizedBox(height: 8)
                      : const SizedBox.shrink(),
                  itemBuilder: (context, index) {
                    if (_searchController.text.trim().isEmpty && index == 0) {
                      return const _SectionTitle('Рекомендуемые страны');
                    }
                    if (_searchController.text.trim().isEmpty && index == 10) {
                      return const _SectionTitle('Все страны');
                    }

                    final itemIndex = _searchController.text.trim().isEmpty
                        ? index < 10
                              ? index - 1
                              : index - 2
                        : index;
                    final item = _visibleItems[itemIndex];
                    final selected = item.isAnonymous
                        ? widget.isAnonymousNumber
                        : !widget.isAnonymousNumber &&
                              item.country!.countryCode ==
                                  widget.selectedCountry!.countryCode;

                    return ListTile(
                      onTap: () {
                        if (item.isAnonymous) {
                          widget.onAnonymousSelected();
                        } else {
                          widget.onCountrySelected(item.country!);
                        }
                      },
                      leading: Text(
                        item.isAnonymous
                            ? AnonymousNumber.emoji
                            : item.country!.flagEmoji,
                        style: const TextStyle(fontSize: 27),
                      ),
                      title: Text(
                        item.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          SizedBox(
                            width: 55,
                            child: Text(
                              '+${item.phoneCode}',
                              textAlign: TextAlign.right,
                              style: TextStyle(
                                color: Colors.grey.shade600,
                                fontSize: 15,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          SizedBox(
                            width: 20,
                            child: selected
                                ? Icon(
                                    Icons.check_rounded,
                                    color: theme.colorScheme.primary,
                                    size: 20,
                                  )
                                : null,
                          ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PhoneCountryItem {
  static final _russianLocalizations = CountryLocalizations(const Locale('ru'));

  final Country? country;
  final bool isAnonymous;

  const _PhoneCountryItem({this.country, this.isAnonymous = false});

  factory _PhoneCountryItem.country(Country country) {
    return _PhoneCountryItem(country: country);
  }

  factory _PhoneCountryItem.anonymous() {
    return const _PhoneCountryItem(isAnonymous: true);
  }

  String get phoneCode =>
      isAnonymous ? AnonymousNumber.phoneCode : country!.phoneCode;

  String get name => isAnonymous
      ? 'Анонимные номера'
      : _russianLocalizations.countryName(countryCode: country!.countryCode) ??
            country!.name;

  bool matches(String query) {
    if (isAnonymous) {
      return 'анонимные номера anonymous 888 +888'.contains(query);
    }
    final value = country!;
    return name.toLowerCase().contains(query) ||
        value.name.toLowerCase().contains(query) ||
        value.phoneCode.toLowerCase().contains(query.replaceFirst('+', '')) ||
        value.countryCode.toLowerCase().contains(query);
  }
}

class _SectionTitle extends StatelessWidget {
  final String title;

  const _SectionTitle(this.title);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
      child: Text(
        title,
        style: TextStyle(
          color: Theme.of(context).colorScheme.primary,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

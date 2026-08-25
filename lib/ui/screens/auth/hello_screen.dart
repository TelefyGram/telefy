import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();

  int _currentPage = 0;

  final List<OnboardingPage> _pages = const [
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
      description:
          'Пользуйся Telefy на любом устройстве\nwindows, macos, linux, ios, android',
    ),
    OnboardingPage(
      asset: 'assets/animations/communicate.tgs',
      title: 'Общайся с удобством',
      description:
          'Общайся с пользователями из других мессенджеров',
    ),
    OnboardingPage(
      asset: 'assets/animations/agitation.tgs',
      title: 'Находи аудиторию',
      description:
          'Публикуй посты в общей ленте и развивай свой канал',
    ),
    OnboardingPage(
      asset: 'assets/animations/music.tgs',
      title: 'Музыка',
      description:
          'Добавляй музыку и слушай то, что добавляют другие',
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (_currentPage < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _start();
    }
  }

  void _start() {
    debugPrint('Начать');
  }

  Widget _buildAsset({
    required String asset,
    required double size,
  }) {
    if (asset.toLowerCase().endsWith('.tgs')) {
      return SizedBox(
        width: size,
        height: size,
        child: Lottie.asset(
          asset,
          decoder: LottieComposition.decodeGZip,
          fit: BoxFit.contain,
          repeat: true,
          animate: true,
        ),
      );
    }

    return Image.asset(
      asset,
      width: size,
      height: size,
      fit: BoxFit.contain,
    );
  }

  double _responsiveSize(
    double value,
    double width,
    double height, {
    double min = 0,
    double max = double.infinity,
  }) {
    // 400x800.
    final scale = ((width / 400) + (height / 800)) / 2;

    return (value * scale).clamp(min, max);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                itemCount: _pages.length,
                onPageChanged: (page) {
                  setState(() {
                    _currentPage = page;
                  });
                },
                itemBuilder: (context, index) {
                  final page = _pages[index];

                  return LayoutBuilder(
                    builder: (context, constraints) {
                      final width = constraints.maxWidth;
                      final height = constraints.maxHeight;

                      // Размер анимации
                      final assetSize = _responsiveSize(
                        180,
                        width,
                        height,
                        min: 130,
                        max: 220,
                      );

                      // Размер заголовка
                      final titleSize = _responsiveSize(
                        30,
                        width,
                        height,
                        min: 22,
                        max: 36,
                      );

                      // Размер описания
                      final descriptionSize = _responsiveSize(
                        17,
                        width,
                        height,
                        min: 14,
                        max: 19,
                      );

                      // Отступ между анимацией и заголовком
                      final assetTitleSpacing = _responsiveSize(
                        32,
                        width,
                        height,
                        min: 16,
                        max: 36,
                      );

                      // Отступ между заголовком и описанием
                      final titleDescriptionSpacing = _responsiveSize(
                        12,
                        width,
                        height,
                        min: 8,
                        max: 16,
                      );

                      return Padding(
                        padding: EdgeInsets.symmetric(
                          horizontal: width < 500 ? 24 : 32,
                        ),
                        child: Column(
                          children: [
                            const Spacer(flex: 2),

                            _buildAsset(
                              asset: page.asset,
                              size: assetSize,
                            ),

                            SizedBox(height: assetTitleSpacing),

                            Text(
                              page.title,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: titleSize,
                                height: 1.1,
                                fontWeight: FontWeight.w700,
                              ),
                            ),

                            SizedBox(
                              height: titleDescriptionSpacing,
                            ),

                            ConstrainedBox(
                              constraints: BoxConstraints(
                                maxWidth: width < 500 ? width - 48 : 420,
                              ),
                              child: Text(
                                page.description,
                                textAlign: TextAlign.center,
                                style: TextStyle(
                                  fontSize: descriptionSize,
                                  height: 1.4,
                                  color: Colors.grey.shade600,
                                ),
                              ),
                            ),

                            const Spacer(flex: 3),
                          ],
                        ),
                      );
                    },
                  );
                },
              ),
            ),

            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                _pages.length,
                (index) {
                  final selected = index == _currentPage;

                  return GestureDetector(
                    onTap: () {
                      _pageController.animateToPage(
                        index,
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      );
                    },
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 4,
                        vertical: 8,
                      ),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 250),
                        curve: Curves.easeOut,
                        width: selected ? 28 : 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: selected
                              ? Theme.of(context).colorScheme.primary
                              : Colors.grey.shade300,
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            Padding(
              padding: const EdgeInsets.fromLTRB(
                24,
                20,
                24,
                24,
              ),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: FilledButton(
                  onPressed: _nextPage,
                  style: FilledButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18),
                    ),
                    textStyle: const TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  child: Text(
                    _currentPage == _pages.length - 1
                        ? 'Начать'
                        : 'Далее',
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

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
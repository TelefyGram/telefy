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
      asset: 'assets/animations/duck.tgs',
      size: 180,
      title: 'Привет!',
      description: 'Добро пожаловать в Telefy',
    ),
    OnboardingPage(
      asset: 'assets/animations/src.tgs',
      size: 180,
      title: 'Telefy',
      description: 'Открытый. Безопасный. Стабильный.',
    ),
    OnboardingPage(
      asset: 'assets/animations/cross_platform.tgs',
      size: 180,
      title: 'Кросплатформеность',
      description: 'Доступно с любого устройства',
    ),
    OnboardingPage(
      asset: 'assets/animations/music.tgs',
      size: 180,
      title: 'Музыка',
      description: 'Большая коллекция музыки, которую создают сами пользователи',
    ),
    OnboardingPage(
      asset: 'assets/animations/communicate.tgs',
      size: 180,
      title: 'Общайся с удобством',
      description: 'Отправляй сообщения пользователям других мессенджеры',
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

  Widget _buildAsset(OnboardingPage page) {
    if (page.asset.toLowerCase().endsWith('.tgs')) {
      return SizedBox(
        width: page.size,
        height: page.size,
        child: Lottie.asset(
          page.asset,
          decoder: LottieComposition.decodeGZip,
          fit: BoxFit.contain,
          repeat: true,
          animate: true,
        ),
      );
    }

    return Image.asset(
      page.asset,
      width: page.size,
      height: page.size,
      fit: BoxFit.contain,
    );
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

                  return Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 32,
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        _buildAsset(page),

                        const SizedBox(height: 48),

                        Text(
                          page.title,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 30,
                            fontWeight: FontWeight.bold,
                          ),
                        ),

                        const SizedBox(height: 16),

                        Text(
                          page.description,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 17,
                            color: Colors.grey.shade600,
                          ),
                        ),
                      ],
                    ),
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

                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    margin: const EdgeInsets.symmetric(
                      horizontal: 4,
                    ),
                    width: selected ? 20 : 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: selected
                          ? Theme.of(context).colorScheme.primary
                          : Colors.grey.shade400,
                      borderRadius: BorderRadius.circular(10),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 24),

            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 24,
              ),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: FilledButton(
                  onPressed: _nextPage,
                  child: Text(
                    _currentPage == _pages.length - 1
                        ? 'Начать'
                        : 'Далее',
                  ),
                ),
              ),
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

class OnboardingPage {
  final String asset;
  final double size;
  final String title;
  final String description;

  const OnboardingPage({
    required this.asset,
    required this.size,
    required this.title,
    required this.description,
  });
}
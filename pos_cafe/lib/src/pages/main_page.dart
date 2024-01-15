import 'package:flutter/material.dart';
import 'package:google_nav_bar/google_nav_bar.dart';
import 'package:pos_cafe/src/pages/favorite_page.dart';
import 'package:pos_cafe/src/pages/my_orders_page.dart';
import 'package:pos_cafe/src/pages/profile_page.dart';
import 'home_page.dart';

class MainPage extends StatefulWidget {
  const MainPage({super.key});
  static const routeName = '/';

  @override
  State<MainPage> createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  int _currentScreen = 0;
  List<Widget?> mainScreens = [];

  _MainPageState() {
    mainScreens = [
      HomePage(
        goProfile: () {
          setState(() {
            _currentScreen = 3;
          });
        },
      ),
      FavoritePage(onBack: onBack),
      MyOrdersPage(onBack: onBack),
      ProfilePage(onBack: onBack)
    ];
  }

  void onBack() {
    setState(() {
      _currentScreen = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              blurRadius: 20,
              color: Colors.black.withOpacity(.1),
            )
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
          child: GNav(
            rippleColor: Theme.of(context).colorScheme.inversePrimary,
            hoverColor: Theme.of(context).colorScheme.inversePrimary,
            tabBorderRadius: 50,
            color: Colors.black87,
            curve: Curves.easeInCubic, // tab animation curves
            duration:
                const Duration(milliseconds: 500), // tab animation duration
            gap: 8, // the tab button gap between icon and text
            activeColor: Colors.white,
            tabBackgroundColor: Theme.of(context).colorScheme.primary,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            onTabChange: (int index) {
              setState(() {
                _currentScreen = index;
              });
            },
            selectedIndex: _currentScreen,
            tabs: const [
              GButton(
                icon: Icons.restaurant,
                text: 'Home',
              ),
              GButton(
                icon: Icons.favorite,
                text: 'My Favorites',
              ),
              GButton(
                icon: Icons.receipt_rounded,
                text: 'My Orders',
              ),
              GButton(
                icon: Icons.person,
                text: 'Profile',
              ),
            ],
          ),
        ),
      ),
      body: mainScreens[_currentScreen],
    );
  }
}

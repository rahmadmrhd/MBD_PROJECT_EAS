import 'package:flutter/material.dart';
import 'package:pos_cafe/src/pages/menu_detail_page.dart';
import 'package:pos_cafe/src/pages/order_detail.dart';
import 'package:pos_cafe/src/pages/order_page.dart';
import 'package:pos_cafe/src/pages/rate_order_page.dart';
import 'package:pos_cafe/src/pages/rating_page.dart';
import 'package:pos_cafe/src/pages/spalsh_screen.dart';
import 'package:pos_cafe/src/resources/cart/cart_provider.dart';
import 'package:pos_cafe/src/resources/category/category_provider.dart';
import 'package:pos_cafe/src/resources/favorite/favorite_provider.dart';
import 'package:pos_cafe/src/resources/menu/menu_provider.dart';
import 'package:pos_cafe/src/resources/order/order_provider.dart';
import 'package:pos_cafe/src/resources/table/table_provider.dart';
import 'package:pos_cafe/src/resources/user/user_povider.dart';
import 'package:pos_cafe/src/pages/auth/signin_page.dart';
import 'package:pos_cafe/src/pages/auth/signup_page.dart';
import 'package:provider/provider.dart';
import 'pages/main_page.dart';
import 'pages/search_page.dart';

/// The Widget that configures your application.
final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => MenuProvider()),
        ChangeNotifierProvider(create: (_) => CategoryProvider()),
        ProxyProvider(
            create: (_) => UserProvider(),
            update: (_, session, instanceOfStateClass) {
              return instanceOfStateClass!..reinitialize(session);
            }),
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => FavoriteProvider()),
        ChangeNotifierProvider(create: (_) => TableProvider()),
        ChangeNotifierProvider(create: (_) => OrderProvider()),
      ],
      child: MaterialApp(
        navigatorKey: navigatorKey,
        debugShowCheckedModeBanner: false,
        restorationScopeId: 'app',
        title: 'Cafe',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            primary: const Color(0xfffc5b31),
            seedColor: const Color(0xfffc5b31),
            error: Colors.red[900],
            background: Colors.white,
          ),
        ),
        initialRoute: SplashScreen.routeName,
        routes: {
          SplashScreen.routeName: (context) => const SplashScreen(),
          SigninPage.routeName: (context) => const SigninPage(),
          SignupPage.routeName: (context) => const SignupPage(),
          MainPage.routeName: (context) => const MainPage(),
          MenuDetailPage.routeName: (context) => const MenuDetailPage(),
          SearchPage.routeName: (context) => const SearchPage(),
          OrderPage.routeName: (context) => const OrderPage(),
          OrderDetailPage.routeName: (context) => const OrderDetailPage(),
          RateOrderPage.routeName: (context) => const RateOrderPage(),
          RatingPage.routeName: (context) => const RatingPage(),
        },
      ),
    );
  }
}

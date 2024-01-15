import 'package:flutter/material.dart';
import 'package:pos_cafe/src/components/cart_page.dart';
import 'package:pos_cafe/src/formater/currency_formater.dart';
import 'package:pos_cafe/src/resources/cart/cart_provider.dart';
import 'package:pos_cafe/src/resources/favorite/favorite_provider.dart';
import 'package:provider/provider.dart';
import '../components/food_item.dart';

class FavoritePage extends StatefulWidget {
  const FavoritePage({super.key, required this.onBack});
  final void Function() onBack;

  @override
  State<FavoritePage> createState() => _FavoritePageState();
}

class _FavoritePageState extends State<FavoritePage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<FavoriteProvider>().getAll();
    });
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvoked: (value) => widget.onBack(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('My Favorites'),
        ),
        bottomSheet: Consumer<CartProvider>(
          builder: (context, provider, _) {
            if (provider.count > 0) {
              return Container(
                height: 56,
                padding: const EdgeInsets.only(left: 12),
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.background,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey[300]!,
                      blurRadius: 8,
                      offset: const Offset(0, -2),
                    )
                  ],
                ),
                child: Row(
                  children: [
                    IconButton(
                      color: Theme.of(context).colorScheme.primary,
                      onPressed: () {
                        showModalBottomSheet(
                          context: context,
                          isScrollControlled: true,
                          builder: (context) {
                            return const CartPage();
                          },
                        );
                      },
                      icon: Badge.count(
                        count: provider.count,
                        child: const Icon(
                          Icons.shopping_cart,
                          size: 32,
                        ),
                      ),
                    ),
                    const Spacer(),
                    Text(
                      formatCurrency(provider.totalPriceAfterDiscount),
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        shape: const RoundedRectangleBorder(),
                        fixedSize: const Size(100, 56),
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor:
                            Theme.of(context).colorScheme.onPrimary,
                        padding: const EdgeInsets.all(0),
                      ),
                      onPressed: () {
                        showModalBottomSheet(
                          context: context,
                          isScrollControlled: true,
                          builder: (context) {
                            return const CartPage();
                          },
                        );
                      },
                      child: const Text(
                        'Checkout',
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                    )
                  ],
                ),
              );
            }
            return const SizedBox.shrink();
          },
        ),
        body: RefreshIndicator(
          onRefresh: () async {
            context.read<FavoriteProvider>().refresh();
          },
          child: SafeArea(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: CustomScrollView(
                slivers: [
                  Consumer<FavoriteProvider>(
                    builder: (context, provider, _) {
                      if (provider.isFirst && provider.isLoading) {
                        return SliverGrid(
                          gridDelegate:
                              const SliverGridDelegateWithMaxCrossAxisExtent(
                            maxCrossAxisExtent: 250,
                            crossAxisSpacing: 8,
                            mainAxisSpacing: 8,
                            childAspectRatio: 0.8,
                          ),
                          delegate: SliverChildListDelegate([1, 2, 3, 4].map(
                            (e) {
                              return const SkeletonFoodItem();
                            },
                          ).toList()),
                        );
                      }
                      return SliverGrid(
                        gridDelegate:
                            const SliverGridDelegateWithMaxCrossAxisExtent(
                          maxCrossAxisExtent: 250,
                          crossAxisSpacing: 8,
                          mainAxisSpacing: 8,
                          childAspectRatio: 0.8,
                        ),
                        delegate: SliverChildListDelegate(
                          provider.listMenu.map((menu) {
                            return FoodItem(menu);
                          }).toList(),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

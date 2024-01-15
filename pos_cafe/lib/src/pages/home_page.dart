import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_sticky_header/flutter_sticky_header.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:pos_cafe/src/components/cart_page.dart';
import 'package:pos_cafe/src/formater/currency_formater.dart';
import 'package:pos_cafe/src/pages/order_page.dart';
import 'package:pos_cafe/src/resources/cart/cart_provider.dart';
import 'package:pos_cafe/src/resources/category/category_provider.dart';
import 'package:pos_cafe/src/resources/menu/menu_provider.dart';
import 'package:pos_cafe/src/resources/user/user_povider.dart';
import 'package:provider/provider.dart';
import 'package:skeletons/skeletons.dart';
import '../components/food_item.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key, required this.goProfile});
  final void Function() goProfile;
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final TextEditingController _searchController =
      TextEditingController(text: null);
  Timer? timer;
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CartProvider>().getAll();
      final categoryProvider = context.read<CategoryProvider>();
      categoryProvider.getAll();
      context
          .read<MenuProvider>()
          .getAll(categoryId: categoryProvider.categoryId);
      context.read<UserProvider>().getUser();
    });
    timer = Timer.periodic(const Duration(seconds: 5), (Timer t) {
      context.read<CartProvider>().getAll();
    });
  }

  @override
  void dispose() {
    timer?.cancel();
    _searchController.dispose();
    super.dispose();
  }

  void onCategorySelected(CategoryProvider provider, String value) {
    if (provider.categorySelected == value) return;
    provider.onCategorySelected(value);
    context.read<MenuProvider>().refresh(categoryId: provider.categoryId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                      foregroundColor: Theme.of(context).colorScheme.onPrimary,
                      padding: const EdgeInsets.all(0),
                    ),
                    onPressed: () {
                      Navigator.pushNamed(context, OrderPage.routeName);
                    },
                    child: const Text(
                      'Checkout',
                      style:
                          TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  )
                ],
              ),
            );
          }
          return const SizedBox.shrink();
        },
      ),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            final categoryProvider = context.read<CategoryProvider>();
            categoryProvider.refresh();
            context
                .read<MenuProvider>()
                .refresh(categoryId: categoryProvider.categoryId);
            context.read<UserProvider>().refreshUser();
          },
          child: CustomScrollView(
            slivers: [
              SliverList(
                delegate: SliverChildListDelegate(
                  [
                    Padding(
                      padding: const EdgeInsets.only(
                          top: 12, bottom: 0, right: 24, left: 24),
                      child: Consumer<UserProvider>(
                        builder: (context, provider, _) {
                          if (provider.isFirst && provider.isLoading) {
                            return Row(
                              children: [
                                const Expanded(
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      SkeletonLine(
                                        style: SkeletonLineStyle(
                                          width: 100,
                                        ),
                                      ),
                                      SizedBox(height: 4),
                                      SkeletonLine(),
                                    ],
                                  ),
                                ),
                                ButtonBar(
                                  children: [
                                    SkeletonAvatar(
                                      style: SkeletonAvatarStyle(
                                        width: 32,
                                        height: 32,
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                    ),
                                    SkeletonAvatar(
                                      style: SkeletonAvatarStyle(
                                        borderRadius: BorderRadius.circular(50),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            );
                          }
                          return Row(
                            children: [
                              Expanded(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      "Hello,",
                                      style: TextStyle(
                                        fontFamily: "Mulish",
                                        fontSize: 16,
                                        fontWeight: FontWeight.w400,
                                        color: Color(0xff3b3936),
                                      ),
                                    ),
                                    Text(
                                      provider.user?.name ?? '',
                                      style: const TextStyle(
                                        fontFamily: "Mulish",
                                        fontSize: 28,
                                        fontWeight: FontWeight.w700,
                                        color: Color(0xff333333),
                                      ),
                                    )
                                  ],
                                ),
                              ),
                              ButtonBar(
                                children: [
                                  // IconButton(
                                  //   splashRadius: 26,
                                  //   onPressed: () {},
                                  //   icon: const Badge(
                                  //     label: Text("3"),
                                  //     child: Icon(Icons.notifications),
                                  //   ),
                                  // ),
                                  (provider.user?.imageUrl ?? '').isNotEmpty
                                      ? Container(
                                          clipBehavior:
                                              Clip.antiAliasWithSaveLayer,
                                          width: 48,
                                          height: 48,
                                          decoration: BoxDecoration(
                                            borderRadius:
                                                BorderRadius.circular(30),
                                            image: DecorationImage(
                                              fit: BoxFit.cover,
                                              image: NetworkImage(
                                                provider.user!.imageUrl!,
                                              ),
                                            ),
                                          ),
                                        )
                                      : CircleAvatar(
                                          radius: 24,
                                          backgroundColor: Theme.of(context)
                                              .colorScheme
                                              .primary,
                                          child: IconButton(
                                            splashRadius: 28,
                                            onPressed: () {
                                              widget.goProfile();
                                            },
                                            icon: Text(
                                              provider.user?.name
                                                      .substring(0, 1)
                                                      .toUpperCase() ??
                                                  '',
                                              style: TextStyle(
                                                color: Theme.of(context)
                                                    .colorScheme
                                                    .onPrimary,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 20,
                                              ),
                                            ),
                                          ),
                                        ),
                                ],
                              ),
                            ],
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ),
              SliverStickyHeader(
                header: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.only(top: 12),
                  decoration: BoxDecoration(
                    boxShadow: [
                      BoxShadow(
                        offset: const Offset(0, 10),
                        color: Colors.grey[300]!,
                        blurRadius: 12,
                        spreadRadius: 0,
                      )
                    ],
                    color: Theme.of(context).colorScheme.background,
                  ),
                  child: Column(
                    children: [
                      Container(
                        margin: const EdgeInsets.symmetric(horizontal: 24),
                        padding: const EdgeInsets.symmetric(
                            vertical: 0, horizontal: 24),
                        decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(50),
                            border: Border.all(color: Colors.black87)),
                        child: Stack(
                          children: [
                            TextField(
                              controller: _searchController,
                              decoration: const InputDecoration(
                                hintText: 'Search Menu',
                                suffixIcon: Icon(Icons.search),
                                border: InputBorder.none,
                                constraints: BoxConstraints(),
                              ),
                              onChanged: (value) {
                                setState(() {
                                  context
                                      .read<MenuProvider>()
                                      .refresh(categoryId: null, search: value);
                                });
                              },
                            ),
                            if (_searchController.text.isNotEmpty)
                              Positioned(
                                right: 36,
                                child: IconButton(
                                  onPressed: () {
                                    setState(() {
                                      _searchController.clear();
                                      context.read<MenuProvider>().refresh(
                                            categoryId: context
                                                .read<CategoryProvider>()
                                                .categoryId,
                                          );
                                    });
                                  },
                                  icon: const Icon(Icons.close),
                                ),
                              )
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      if (_searchController.text.isEmpty)
                        Consumer<CategoryProvider>(
                          builder: (context, provider, _) {
                            if (provider.isFirst && provider.isLoading) {
                              return SingleChildScrollView(
                                scrollDirection: Axis.horizontal,
                                child: ButtonBar(
                                  layoutBehavior:
                                      ButtonBarLayoutBehavior.padded,
                                  alignment: MainAxisAlignment.start,
                                  children: [
                                    const SizedBox(width: 10),
                                    ...[1, 2, 3, 4, 5].map((e) {
                                      return Container(
                                        width: 56,
                                        margin: const EdgeInsets.only(right: 8),
                                        child: Column(
                                          children: [
                                            SkeletonAvatar(
                                              style: SkeletonAvatarStyle(
                                                width: 56,
                                                height: 56,
                                                borderRadius:
                                                    BorderRadius.circular(48),
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            const SkeletonLine(),
                                          ],
                                        ),
                                      );
                                    }).toList(),
                                    const SizedBox(width: 10),
                                  ],
                                ),
                              );
                            } else {
                              final data = provider.list;
                              return SingleChildScrollView(
                                scrollDirection: Axis.horizontal,
                                child: ButtonBar(
                                  layoutBehavior:
                                      ButtonBarLayoutBehavior.padded,
                                  alignment: MainAxisAlignment.start,
                                  children: [
                                    const SizedBox(width: 10),
                                    Container(
                                      width: 56,
                                      margin: const EdgeInsets.only(right: 8),
                                      child: Column(
                                        children: [
                                          ElevatedButton(
                                            style: ElevatedButton.styleFrom(
                                              padding: const EdgeInsets.all(8),
                                              shape: const CircleBorder(),
                                              fixedSize: const Size(56, 56),
                                              backgroundColor:
                                                  provider.categorySelected ==
                                                          'All'
                                                      ? Theme.of(context)
                                                          .colorScheme
                                                          .primary
                                                      : Theme.of(context)
                                                          .colorScheme
                                                          .onPrimary,
                                              foregroundColor:
                                                  provider.categorySelected !=
                                                          'All'
                                                      ? Theme.of(context)
                                                          .colorScheme
                                                          .primary
                                                      : Theme.of(context)
                                                          .colorScheme
                                                          .onPrimary,
                                              shadowColor: Colors.black87,
                                            ),
                                            onPressed: () {
                                              onCategorySelected(
                                                  provider, 'All');
                                            },
                                            child: const Icon(Icons.apps),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            "All",
                                            style: TextStyle(
                                                fontSize: 14,
                                                fontWeight: FontWeight.bold,
                                                color: Theme.of(context)
                                                    .colorScheme
                                                    .primary),
                                          ),
                                        ],
                                      ),
                                    ),
                                    ...data.map((item) {
                                      return Container(
                                        width: 56,
                                        margin: const EdgeInsets.only(right: 8),
                                        child: Column(
                                          children: [
                                            ElevatedButton(
                                              style: ElevatedButton.styleFrom(
                                                padding:
                                                    const EdgeInsets.all(8),
                                                shape: const CircleBorder(),
                                                fixedSize: const Size(56, 56),
                                                backgroundColor:
                                                    provider.categorySelected ==
                                                            item.name
                                                        ? Theme.of(context)
                                                            .colorScheme
                                                            .primary
                                                        : Theme.of(context)
                                                            .colorScheme
                                                            .onPrimary,
                                                shadowColor: Colors.black87,
                                              ),
                                              onPressed: () {
                                                onCategorySelected(
                                                    provider, item.name);
                                              },
                                              child: SvgPicture.network(
                                                item.iconUrl,
                                                theme: SvgTheme(
                                                  currentColor:
                                                      provider.categorySelected !=
                                                              item.name
                                                          ? Theme.of(context)
                                                              .colorScheme
                                                              .primary
                                                          : Theme.of(context)
                                                              .colorScheme
                                                              .onPrimary,
                                                ),
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              item.name,
                                              style: TextStyle(
                                                fontSize: 14,
                                                fontWeight: FontWeight.bold,
                                                color: Theme.of(context)
                                                    .colorScheme
                                                    .primary,
                                              ),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                              textAlign: TextAlign.center,
                                            ),
                                          ],
                                        ),
                                      );
                                    }).toList(),
                                    const SizedBox(width: 10),
                                  ],
                                ),
                              );
                            }
                          },
                        ),
                    ],
                  ),
                ),
                sliver: SliverPadding(
                  padding: const EdgeInsets.only(left: 24, right: 24, top: 12),
                  sliver:
                      Consumer<MenuProvider>(builder: (context, provider, _) {
                    if (provider.isFirst && provider.isLoading) {
                      return SliverGrid(
                        gridDelegate:
                            const SliverGridDelegateWithMaxCrossAxisExtent(
                          maxCrossAxisExtent: 250,
                          crossAxisSpacing: 8,
                          mainAxisSpacing: 8,
                          childAspectRatio: 0.8,
                        ),
                        delegate:
                            SliverChildListDelegate([1, 2, 3, 4, 5, 6].map(
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
                  }),
                ),
              ),
              const SliverToBoxAdapter(
                child: SizedBox(height: 100),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

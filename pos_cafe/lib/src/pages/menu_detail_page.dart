import 'package:clippy_flutter/arc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:pos_cafe/src/components/cart_page.dart';
import 'package:pos_cafe/src/components/error_dialog.dart';
import 'package:pos_cafe/src/components/menu_add_to_cart.dart';
import 'package:pos_cafe/src/formater/currency_formater.dart';
import 'package:pos_cafe/src/pages/rating_page.dart';
import 'package:pos_cafe/src/resources/cart/cart_model.dart';
import 'package:pos_cafe/src/resources/cart/cart_provider.dart';
import 'package:pos_cafe/src/resources/menu/menu_model.dart';
import 'package:pos_cafe/src/resources/menu/menu_services.dart';
import 'package:provider/provider.dart';
import 'package:skeletons/skeletons.dart';

class MenuDetailPage extends StatefulWidget {
  const MenuDetailPage({super.key});
  static const routeName = '/menu_detail';

  @override
  State<MenuDetailPage> createState() => _MenuDetailPageState();
}

class _MenuDetailPageState extends State<MenuDetailPage> {
  Future<MenuDetail> getMenu(int menuId) async {
    return await MenuServices.getById(menuId);
  }

  void addToCart(BuildContext context, MenuDetail menu) {
    if (menu.options != null && menu.options!.isNotEmpty) {
      showModalBottomSheet(
          context: context,
          isScrollControlled: true,
          builder: (context) {
            return MenuAddToCart(menu.id);
          });
    } else {
      context.read<CartProvider>().add(
            Cart(
              menuId: menu.id,
              menuName: menu.name,
              menuPrice: menu.price.toDouble(),
              menuAfterDiscount: menu.afterDiscount.toDouble(),
              menuImageUrl: menu.image,
              quantity: 1,
              details: [],
            ),
          );
    }
  }

  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)!.settings.arguments as int;

    return Scaffold(
      extendBodyBehindAppBar: true,
      backgroundColor: Colors.white,
      appBar: AppBar(
        elevation: 0,
        forceMaterialTransparency: true,
        backgroundColor: const Color(0x44000000),
      ),
      body: FutureBuilder(
        future: getMenu(args),
        builder: (context, AsyncSnapshot<MenuDetail> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Column(
              children: [
                Arc(
                  edge: Edge.BOTTOM,
                  height: 30,
                  arcType: ArcType.CONVEX,
                  child: SkeletonAvatar(
                      style: SkeletonAvatarStyle(
                    width: MediaQuery.of(context).size.width,
                    height: 300,
                  )),
                ),
                Expanded(
                  child: Container(
                    width: MediaQuery.of(context).size.width,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    color: Colors.white,
                    child: Padding(
                      padding: const EdgeInsets.only(
                        top: 30,
                        bottom: 10,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SkeletonLine(),
                          const SizedBox(height: 8),
                          const Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              SkeletonLine(
                                style: SkeletonLineStyle(width: 125),
                              ),
                              Spacer(),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  SkeletonLine(
                                      style: SkeletonLineStyle(width: 75)),
                                  SizedBox(height: 4),
                                  SkeletonLine(
                                      style: SkeletonLineStyle(width: 125)),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          const SkeletonLine(),
                          const SizedBox(height: 8),
                          const SkeletonLine(),
                          const SizedBox(height: 8),
                          const SkeletonLine(),
                          const SizedBox(height: 8),
                          const SkeletonLine(),
                          const SizedBox(height: 8),
                          const SkeletonLine(),
                          const SizedBox(height: 12),
                          Expanded(
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                ButtonBar(
                                  buttonPadding: const EdgeInsets.all(0),
                                  children: [
                                    SkeletonAvatar(
                                      style: SkeletonAvatarStyle(
                                        borderRadius: BorderRadius.circular(8),
                                        height: 36,
                                        width: 36,
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    const SkeletonLine(
                                      style: SkeletonLineStyle(width: 24),
                                    ),
                                    const SizedBox(width: 16),
                                    SkeletonAvatar(
                                      style: SkeletonAvatarStyle(
                                        borderRadius: BorderRadius.circular(8),
                                        height: 36,
                                        width: 36,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                )
              ],
            );
          } else if (snapshot.hasError) {
            return ErrorDialog(
                onTry: () {}, msgError: snapshot.error.toString());
          } else {
            final menu = snapshot.data!;
            return Consumer<CartProvider>(builder: (context, provider, _) {
              return RefreshIndicator(
                onRefresh: () async {
                  setState(() {});
                },
                child: Column(
                  children: [
                    Arc(
                      edge: Edge.BOTTOM,
                      height: 30,
                      arcType: ArcType.CONVEX,
                      child: Container(
                        height: 300,
                        clipBehavior: Clip.antiAliasWithSaveLayer,
                        decoration: BoxDecoration(
                          image: DecorationImage(
                            fit: BoxFit.cover,
                            image: menu.image != null
                                ? NetworkImage(menu.image ?? '')
                                : const AssetImage(
                                        'assets/images/empty_menu.jpg')
                                    as ImageProvider,
                          ),
                        ),
                      ),
                    ),
                    Expanded(
                      child: Container(
                        width: MediaQuery.of(context).size.width,
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        color: Colors.white,
                        child: Padding(
                          padding: const EdgeInsets.only(
                            top: 30,
                            bottom: 10,
                          ),
                          child: SingleChildScrollView(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  menu.name,
                                  style: const TextStyle(
                                    fontSize: 25,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                InkWell(
                                  onTap: () {
                                    if (menu.ratingCount > 0) {
                                      Navigator.pushNamed(
                                          context, RatingPage.routeName,
                                          arguments: menu.id);
                                    }
                                  },
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    children: [
                                      ...menu.ratingCount > 0
                                          ? [
                                              RatingBarIndicator(
                                                rating: menu.rating.toDouble(),
                                                itemBuilder: (context, index) =>
                                                    Icon(
                                                  Icons.star,
                                                  color: Colors.amber[600],
                                                ),
                                                itemCount: 5,
                                                itemSize: 18.0,
                                                unratedColor:
                                                    Colors.amber.withAlpha(50),
                                                // direction: Axis.ve,
                                              ),
                                              const SizedBox(width: 8),
                                              Text(
                                                menu.rating.toString(),
                                                style: const TextStyle(
                                                    fontSize: 14,
                                                    fontWeight:
                                                        FontWeight.bold),
                                              ),
                                            ]
                                          : [
                                              const Text(
                                                'Not rated yet.',
                                                style: TextStyle(
                                                    fontSize: 14,
                                                    fontWeight:
                                                        FontWeight.normal),
                                              ),
                                            ],
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.end,
                                          children: [
                                            if (menu.discount > 0)
                                              Text(
                                                formatCurrency(menu.price),
                                                style: const TextStyle(
                                                  decoration: TextDecoration
                                                      .lineThrough,
                                                ),
                                              ),
                                            Text(
                                              formatCurrency(
                                                  menu.afterDiscount),
                                              style: TextStyle(
                                                fontSize: 18,
                                                fontWeight: FontWeight.bold,
                                                color: Theme.of(context)
                                                    .colorScheme
                                                    .primary,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  menu.description,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    color: Colors.black,
                                  ),
                                  textAlign: TextAlign.justify,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Padding(
                      padding: const EdgeInsets.only(bottom: 24),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          ButtonBar(
                            buttonPadding: const EdgeInsets.all(0),
                            children: [
                              IconButton(
                                onPressed: () {
                                  showModalBottomSheet(
                                    context: context,
                                    isScrollControlled: true,
                                    builder: (context) {
                                      return const CartPage();
                                    },
                                  );
                                },
                                padding: const EdgeInsets.all(0),
                                constraints: const BoxConstraints(),
                                style: IconButton.styleFrom(
                                  backgroundColor:
                                      Theme.of(context).colorScheme.primary,
                                  foregroundColor:
                                      Theme.of(context).colorScheme.onPrimary,
                                  fixedSize: const Size(36, 36),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  padding: const EdgeInsets.all(0),
                                ),
                                icon: const Icon(Icons.remove, size: 20),
                              ),
                              const SizedBox(width: 16),
                              Text(
                                provider.getCountByMenu(args).toString(),
                                style: const TextStyle(
                                  fontSize: 18,
                                ),
                              ),
                              const SizedBox(width: 16),
                              IconButton(
                                onPressed: () {
                                  addToCart(context, menu);
                                },
                                padding: const EdgeInsets.all(0),
                                constraints: const BoxConstraints(),
                                style: IconButton.styleFrom(
                                  backgroundColor:
                                      Theme.of(context).colorScheme.primary,
                                  foregroundColor:
                                      Theme.of(context).colorScheme.onPrimary,
                                  fixedSize: const Size(36, 36),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  padding: const EdgeInsets.all(0),
                                ),
                                icon: const Icon(Icons.add, size: 20),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            });
          }
        },
      ),
    );
  }
}

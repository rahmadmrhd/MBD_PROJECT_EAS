import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:pos_cafe/src/components/menu_add_to_cart.dart';
import 'package:pos_cafe/src/formater/currency_formater.dart';
import 'package:pos_cafe/src/pages/menu_detail_page.dart';
import 'package:pos_cafe/src/pages/rating_page.dart';
import 'package:pos_cafe/src/resources/cart/cart_model.dart';
import 'package:pos_cafe/src/resources/cart/cart_provider.dart';
import 'package:pos_cafe/src/resources/menu/menu_model.dart';
import 'package:pos_cafe/src/resources/menu/menu_services.dart';
import 'package:provider/provider.dart';
import 'package:skeletons/skeletons.dart';

class FoodItem extends StatefulWidget {
  const FoodItem(this.menu, {super.key});

  final Menu menu;

  @override
  State<FoodItem> createState() => _FoodItemState();
}

class _FoodItemState extends State<FoodItem> {
  bool _isFavorite = false;

  @override
  void initState() {
    super.initState();
    _isFavorite = widget.menu.isFavorite;
  }

  void setFavorite(bool value) async {
    final defaultValue = value;
    setState(() {
      _isFavorite = value;
    });
    try {
      final isFavorite = await MenuServices.setFavorite(widget.menu.id);
      setState(() {
        _isFavorite = isFavorite > 0;
      });
    } catch (e) {
      setState(() {
        _isFavorite = defaultValue;
      });
    }
  }

  void addToCart(BuildContext context) async {
    if (widget.menu.availableOptions) {
      showModalBottomSheet(
          context: context,
          isScrollControlled: true,
          builder: (context) {
            return MenuAddToCart(widget.menu.id);
          });
    } else {
      await context.read<CartProvider>().add(
            Cart(
              menuId: widget.menu.id,
              menuName: widget.menu.name,
              menuPrice: widget.menu.price.toDouble(),
              menuAfterDiscount: widget.menu.afterDiscount.toDouble(),
              menuImageUrl: widget.menu.image,
              quantity: 1,
              details: [],
            ),
          );
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, MenuDetailPage.routeName,
            arguments: widget.menu.id);
      },
      child: Container(
        clipBehavior: Clip.antiAliasWithSaveLayer,
        decoration: BoxDecoration(boxShadow: [
          BoxShadow(
            color: Colors.grey[300]!,
            blurRadius: 8,
          )
        ], color: Colors.white, borderRadius: BorderRadius.circular(20)),
        child: Stack(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Container(
                    clipBehavior: Clip.antiAliasWithSaveLayer,
                    decoration: BoxDecoration(
                      image: DecorationImage(
                        fit: BoxFit.cover,
                        image: widget.menu.image != null
                            ? NetworkImage(widget.menu.image ?? '')
                            : const AssetImage('assets/images/empty_menu.jpg')
                                as ImageProvider,
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              widget.menu.name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              formatCurrency(widget.menu.afterDiscount),
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Theme.of(context).colorScheme.primary,
                              ),
                            ),
                            const SizedBox(height: 4),
                          ],
                        ),
                      ),
                      IconButton(
                          onPressed: () => addToCart(context),
                          style: IconButton.styleFrom(
                            backgroundColor:
                                Theme.of(context).colorScheme.primary,
                            foregroundColor:
                                Theme.of(context).colorScheme.onPrimary,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            padding: const EdgeInsets.all(0),
                          ),
                          icon: const Icon(Icons.add_shopping_cart, size: 20)),
                    ],
                  ),
                ),
              ],
            ),
            Positioned(
              top: 8,
              right: 8,
              child: CircleAvatar(
                radius: 18,
                backgroundColor: _isFavorite
                    ? Colors.white
                    : const Color.fromARGB(60, 0, 0, 0),
                child: IconButton(
                  splashRadius: 28,
                  iconSize: 18,
                  onPressed: () {
                    setFavorite(!_isFavorite);
                  },
                  icon: Icon(
                    Icons.favorite,
                    color: _isFavorite ? Colors.red : Colors.white,
                  ),
                ),
              ),
            ),
            if (widget.menu.ratingCount > 0)
              Positioned(
                top: 8,
                left: 8,
                child: InkWell(
                  onTap: () {
                    Navigator.pushNamed(context, RatingPage.routeName,
                        arguments: widget.menu.id);
                  },
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(.8),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      children: [
                        RatingBarIndicator(
                          rating: widget.menu.rating.toDouble(),
                          itemBuilder: (context, index) => Icon(
                            Icons.star,
                            color: Colors.amber[600],
                          ),
                          itemCount: 1,
                          itemSize: 18.0,
                          unratedColor: Colors.amber.withAlpha(50),
                          // direction: Axis.ve,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          widget.menu.rating.toString(),
                          style: const TextStyle(
                              fontSize: 12, fontWeight: FontWeight.bold),
                        ),
                      ],
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

class SkeletonFoodItem extends StatelessWidget {
  const SkeletonFoodItem({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      clipBehavior: Clip.antiAliasWithSaveLayer,
      decoration: BoxDecoration(boxShadow: [
        BoxShadow(
          color: Colors.grey[300]!,
          blurRadius: 8,
        )
      ], color: Colors.white, borderRadius: BorderRadius.circular(20)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: SkeletonItem(child: Container()),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
            child: Row(
              children: [
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SkeletonLine(),
                      SizedBox(height: 4),
                      SkeletonLine(),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                SkeletonAvatar(
                  style: SkeletonAvatarStyle(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

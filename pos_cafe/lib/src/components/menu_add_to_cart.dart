import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flutter_sticky_header/flutter_sticky_header.dart';
import 'package:pos_cafe/src/formater/currency_formater.dart';
import 'package:pos_cafe/src/resources/cart/cart_model.dart';
import 'package:pos_cafe/src/resources/cart/cart_provider.dart';
import 'package:pos_cafe/src/resources/menu/menu_model.dart';
import 'package:pos_cafe/src/resources/menu/menu_services.dart';
import 'package:provider/provider.dart';

class MenuAddToCart extends StatefulWidget {
  const MenuAddToCart(this.menuId, {super.key});
  final int menuId;

  @override
  State<MenuAddToCart> createState() => _MenuAddToCartState();
}

class _MenuAddToCartState extends State<MenuAddToCart> {
  late Future<MenuDetail> futureMenu;
  int qty = 1;
  final TextEditingController _noteController = TextEditingController();
  @override
  void initState() {
    super.initState();
    futureMenu = getMenuDetail();
  }

  Future<MenuDetail> getMenuDetail() async {
    return await MenuServices.getById(widget.menuId);
  }

  void addToCart(BuildContext context, MenuDetail menu) {
    // final List<MenuDetailOption> options = menu.options
    context.read<CartProvider>().add(
          Cart(
            menuId: widget.menuId,
            menuName: menu.name,
            menuPrice: menu.price,
            menuAfterDiscount: menu.afterDiscount,
            menuImageUrl: menu.image,
            quantity: qty,
            note: _noteController.text,
            details: menu.options
                    ?.where((e) => e.checklist.isNotEmpty)
                    .map(
                      (e) => CartDetail(
                          optionName: e.name,
                          items: e.checklist
                              .map(
                                (x) => CartDetailItem(
                                    id: x.id,
                                    itemName: x.name,
                                    itemPrice: x.price),
                              )
                              .toList()),
                    )
                    .toList() ??
                [],
          ),
        );
    Navigator.pop(context);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        width: MediaQuery.of(context).size.width,
        color: Colors.white,
        height: 600,
        padding: const EdgeInsets.only(top: 12),
        child: FutureBuilder(
          future: futureMenu,
          builder: (BuildContext context, AsyncSnapshot<MenuDetail> snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(child: CircularProgressIndicator());
            } else if (snapshot.hasError) {
              return Text(snapshot.error.toString());
            } else {
              final menu = snapshot.data;

              return Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                    width: MediaQuery.of(context).size.width,
                    height: 50,
                    child: Stack(
                      children: [
                        const Column(
                          mainAxisAlignment: MainAxisAlignment.end,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Text(
                              'Add To Cart',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Divider()
                          ],
                        ),
                        Positioned(
                          right: 8,
                          bottom: 8,
                          child: IconButton(
                            onPressed: () {
                              Navigator.pop(context);
                            },
                            icon: const Icon(Icons.close),
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    height: 100,
                    padding: const EdgeInsets.symmetric(horizontal: 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 100,
                          height: 100,
                          clipBehavior: Clip.antiAliasWithSaveLayer,
                          decoration: BoxDecoration(
                            image: DecorationImage(
                              fit: BoxFit.cover,
                              image: menu?.image != null
                                  ? NetworkImage(menu!.image ?? '')
                                  : const AssetImage(
                                          'assets/images/empty_menu.jpg')
                                      as ImageProvider,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            // mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                menu?.name ?? '',
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              if (menu!.ratingCount > 0)
                                RatingBarIndicator(
                                  rating: menu.rating,
                                  itemBuilder: (context, index) => Icon(
                                    Icons.star,
                                    color: Colors.amber[600],
                                  ),
                                  itemCount: 5,
                                  itemSize: 18.0,
                                  unratedColor: Colors.amber.withAlpha(50),
                                ),
                              const Spacer(),
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      if (menu.discount > 0)
                                        Text(
                                          formatCurrency(menu.price),
                                          style: const TextStyle(
                                            decoration:
                                                TextDecoration.lineThrough,
                                          ),
                                        ),
                                      Text(
                                        formatCurrency(menu.afterDiscount),
                                        style: TextStyle(
                                          fontSize: 18,
                                          color: Theme.of(context)
                                              .colorScheme
                                              .primary,
                                        ),
                                      ),
                                    ],
                                  ),
                                  Expanded(
                                    child: ButtonBar(
                                      buttonPadding: const EdgeInsets.all(0),
                                      children: [
                                        IconButton(
                                          onPressed: () {
                                            if (qty > 1) {
                                              setState(() {
                                                qty--;
                                              });
                                            }
                                          },
                                          padding: const EdgeInsets.all(0),
                                          constraints: const BoxConstraints(),
                                          style: IconButton.styleFrom(
                                            backgroundColor: Theme.of(context)
                                                .colorScheme
                                                .primary,
                                            foregroundColor: Theme.of(context)
                                                .colorScheme
                                                .onPrimary,
                                            fixedSize: const Size(24, 24),
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                            ),
                                            padding: const EdgeInsets.all(0),
                                          ),
                                          icon: const Icon(Icons.remove,
                                              size: 20),
                                        ),
                                        Text(qty.toString()),
                                        IconButton(
                                          onPressed: () {
                                            setState(() {
                                              qty++;
                                            });
                                          },
                                          padding: const EdgeInsets.all(0),
                                          constraints: const BoxConstraints(),
                                          style: IconButton.styleFrom(
                                            backgroundColor: Theme.of(context)
                                                .colorScheme
                                                .primary,
                                            foregroundColor: Theme.of(context)
                                                .colorScheme
                                                .onPrimary,
                                            fixedSize: const Size(24, 24),
                                            shape: RoundedRectangleBorder(
                                              borderRadius:
                                                  BorderRadius.circular(8),
                                            ),
                                            padding: const EdgeInsets.all(0),
                                          ),
                                          icon: const Icon(Icons.add, size: 20),
                                        ),
                                      ],
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
                  Padding(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    child: TextField(
                      controller: _noteController,
                      decoration: const InputDecoration(
                        filled: true,
                        prefixIcon: Icon(Icons.description),
                        fillColor: Colors.transparent,
                        hintText: 'Note',
                        border: OutlineInputBorder(
                          borderSide: BorderSide.none,
                        ),
                      ),
                    ),
                  ),
                  Expanded(
                    child: CustomScrollView(
                      slivers: menu.options!.map((option) {
                        String title = option.name;
                        if (option.min == option.max && option.min > 0) {
                          title += ' (Pilih ${option.min})';
                        } else {
                          title +=
                              ' (${option.min > 0 ? 'Pilih ${option.min}' : 'Optional'}${option.max > 0 ? ', Maximal ${option.max}' : ''})';
                        }
                        return SliverStickyHeader(
                          header: Container(
                            height: 40.0,
                            color: Colors.grey[350],
                            padding:
                                const EdgeInsets.symmetric(horizontal: 16.0),
                            alignment: Alignment.centerLeft,
                            child: Text(
                              title,
                              style: const TextStyle(
                                color: Colors.black87,
                                fontSize: 16,
                              ),
                            ),
                          ),
                          sliver: SliverList(
                            delegate: SliverChildListDelegate(
                                option.items.map((item) {
                              return CheckboxListTile(
                                title: Text(item.name),
                                subtitle: Text(formatCurrency(item.price)),
                                value: option.isChecklist(item),
                                visualDensity: VisualDensity.comfortable,
                                onChanged: (value) {
                                  setState(() {
                                    option.setChecklist(item);
                                  });
                                },
                              );
                            }).toList()),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      if (!menu.isValid()) return;
                      addToCart(context, menu);
                    },
                    style: ElevatedButton.styleFrom(
                      shape: const RoundedRectangleBorder(),
                      minimumSize: const Size.fromHeight(56),
                      backgroundColor: menu.isValid()
                          ? Theme.of(context).colorScheme.primary
                          : Theme.of(context).colorScheme.surfaceVariant,
                      foregroundColor: menu.isValid()
                          ? Theme.of(context).colorScheme.onPrimary
                          : Theme.of(context).colorScheme.onSurfaceVariant,
                    ),
                    child: Text(
                      'Add to cart - ${formatCurrency(menu.getFinalPrice() * qty)}',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  )
                ],
              );
            }
          },
        ));
  }
}

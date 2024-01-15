import 'package:flutter/material.dart';
import 'package:pos_cafe/src/components/note_box.dart';
import 'package:pos_cafe/src/formater/currency_formater.dart';
import 'package:pos_cafe/src/pages/order_page.dart';
import 'package:pos_cafe/src/resources/cart/cart_provider.dart';
import 'package:provider/provider.dart';

class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding:
          EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Container(
        width: MediaQuery.of(context).size.width,
        color: Colors.white,
        height: 500,
        padding: const EdgeInsets.only(top: 12),
        child: Consumer<CartProvider>(
          builder: (context, provider, _) {
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
                            'Cart',
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
                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      children: provider.list.isNotEmpty
                          ? provider.list
                              .map(
                                (item) {
                                  return [
                                    ConstrainedBox(
                                      constraints: BoxConstraints(
                                        maxWidth:
                                            MediaQuery.of(context).size.width,
                                        minHeight: 100,
                                      ),
                                      child: Row(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Container(
                                            width: 100,
                                            height: 100,
                                            clipBehavior:
                                                Clip.antiAliasWithSaveLayer,
                                            decoration: BoxDecoration(
                                              image: DecorationImage(
                                                fit: BoxFit.cover,
                                                image: item.menuImageUrl != null
                                                    ? NetworkImage(
                                                        item.menuImageUrl ?? '')
                                                    : const AssetImage(
                                                            'assets/images/empty_menu.jpg')
                                                        as ImageProvider,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: Column(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.start,
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  item.menuName,
                                                  style: const TextStyle(
                                                    fontSize: 18,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                                IconButton(
                                                    onPressed: () {
                                                      showModalBottomSheet(
                                                        context: context,
                                                        builder: (context) {
                                                          return NoteBox(
                                                            note: item.note,
                                                            setNote:
                                                                (value) async {
                                                              setState(() {
                                                                item.note =
                                                                    value;
                                                              });
                                                              await provider
                                                                  .updateQty(
                                                                      item);
                                                            },
                                                          );
                                                        },
                                                      );
                                                    },
                                                    constraints:
                                                        const BoxConstraints(),
                                                    style: IconButton.styleFrom(
                                                      padding:
                                                          const EdgeInsets.all(
                                                              0),
                                                      foregroundColor:
                                                          Theme.of(context)
                                                              .colorScheme
                                                              .onBackground,
                                                    ),
                                                    icon: Row(
                                                      children: [
                                                        const Icon(
                                                            Icons.description),
                                                        const SizedBox(
                                                            width: 8),
                                                        Text(((item.note ==
                                                                    null ||
                                                                item.note
                                                                        ?.isEmpty ==
                                                                    true)
                                                            ? 'Add note...'
                                                            : item.note)!),
                                                      ],
                                                    )),
                                                const SizedBox(height: 4),
                                                if (item.details.isNotEmpty)
                                                  ...item.details.map(
                                                    (detail) {
                                                      return <Widget>[
                                                        ...() {
                                                          if (detail.items
                                                                  .length >
                                                              1) {
                                                            return [
                                                              Text(
                                                                '${detail.optionName} : ',
                                                                style:
                                                                    TextStyle(
                                                                  fontSize: 14,
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .bold,
                                                                  color: Theme.of(
                                                                          context)
                                                                      .colorScheme
                                                                      .onBackground
                                                                      .withOpacity(
                                                                          0.8),
                                                                ),
                                                              ),
                                                              ...detail.items
                                                                  .map((item) {
                                                                return Text(
                                                                  "    - ${item.itemName}",
                                                                  style:
                                                                      TextStyle(
                                                                    fontSize:
                                                                        14,
                                                                    color: Theme.of(
                                                                            context)
                                                                        .colorScheme
                                                                        .onBackground
                                                                        .withOpacity(
                                                                            0.8),
                                                                  ),
                                                                );
                                                              })
                                                            ];
                                                          } else {
                                                            return [
                                                              Row(
                                                                children: [
                                                                  Text(
                                                                    '${detail.optionName} : ',
                                                                    style:
                                                                        TextStyle(
                                                                      fontSize:
                                                                          14,
                                                                      fontWeight:
                                                                          FontWeight
                                                                              .bold,
                                                                      color: Theme.of(
                                                                              context)
                                                                          .colorScheme
                                                                          .onBackground
                                                                          .withOpacity(
                                                                              0.8),
                                                                    ),
                                                                  ),
                                                                  Text(
                                                                    detail
                                                                        .items
                                                                        .first
                                                                        .itemName,
                                                                    style:
                                                                        TextStyle(
                                                                      fontSize:
                                                                          14,
                                                                      color: Theme.of(
                                                                              context)
                                                                          .colorScheme
                                                                          .onBackground
                                                                          .withOpacity(
                                                                              0.8),
                                                                    ),
                                                                  )
                                                                ],
                                                              ),
                                                            ];
                                                          }
                                                        }()
                                                      ];
                                                    },
                                                  ).reduce((value, element) =>
                                                      [...value, ...element]),
                                                Row(
                                                  crossAxisAlignment:
                                                      CrossAxisAlignment.center,
                                                  children: [
                                                    Column(
                                                      crossAxisAlignment:
                                                          CrossAxisAlignment
                                                              .start,
                                                      children: [
                                                        if (item.menuAfterDiscount !=
                                                            item.menuPrice)
                                                          Text(
                                                            formatCurrency(
                                                              item.totalPrice *
                                                                  item.quantity,
                                                            ),
                                                            style:
                                                                const TextStyle(
                                                              decoration:
                                                                  TextDecoration
                                                                      .lineThrough,
                                                            ),
                                                          ),
                                                        Text(
                                                          formatCurrency(item
                                                                  .totalPriceAfterDiscount *
                                                              item.quantity),
                                                          style: TextStyle(
                                                            fontSize: 18,
                                                            color: Theme.of(
                                                                    context)
                                                                .colorScheme
                                                                .primary,
                                                          ),
                                                        ),
                                                      ],
                                                    ),
                                                    Expanded(
                                                      child: ButtonBar(
                                                        buttonPadding:
                                                            const EdgeInsets
                                                                .all(0),
                                                        children: [
                                                          IconButton(
                                                            onPressed:
                                                                () async {
                                                              if (item.quantity >
                                                                  1) {
                                                                setState(() {
                                                                  item.quantity--;
                                                                });
                                                                await provider
                                                                    .updateQty(
                                                                        item);
                                                              } else {
                                                                await provider
                                                                    .remove(
                                                                        item,
                                                                        () {
                                                                  Navigator.pop(
                                                                      context);
                                                                });
                                                              }
                                                            },
                                                            padding:
                                                                const EdgeInsets
                                                                    .all(0),
                                                            constraints:
                                                                const BoxConstraints(),
                                                            style: IconButton
                                                                .styleFrom(
                                                              backgroundColor:
                                                                  Theme.of(
                                                                          context)
                                                                      .colorScheme
                                                                      .primary,
                                                              foregroundColor:
                                                                  Theme.of(
                                                                          context)
                                                                      .colorScheme
                                                                      .onPrimary,
                                                              fixedSize:
                                                                  const Size(
                                                                      24, 24),
                                                              shape:
                                                                  RoundedRectangleBorder(
                                                                borderRadius:
                                                                    BorderRadius
                                                                        .circular(
                                                                            8),
                                                              ),
                                                              padding:
                                                                  const EdgeInsets
                                                                      .all(0),
                                                            ),
                                                            icon: const Icon(
                                                                Icons.remove,
                                                                size: 20),
                                                          ),
                                                          Text(item.quantity
                                                              .toString()),
                                                          IconButton(
                                                            onPressed:
                                                                () async {
                                                              setState(() {
                                                                item.quantity++;
                                                              });
                                                              await provider
                                                                  .updateQty(
                                                                      item);
                                                            },
                                                            padding:
                                                                const EdgeInsets
                                                                    .all(0),
                                                            constraints:
                                                                const BoxConstraints(),
                                                            style: IconButton
                                                                .styleFrom(
                                                              backgroundColor:
                                                                  Theme.of(
                                                                          context)
                                                                      .colorScheme
                                                                      .primary,
                                                              foregroundColor:
                                                                  Theme.of(
                                                                          context)
                                                                      .colorScheme
                                                                      .onPrimary,
                                                              fixedSize:
                                                                  const Size(
                                                                      24, 24),
                                                              shape:
                                                                  RoundedRectangleBorder(
                                                                borderRadius:
                                                                    BorderRadius
                                                                        .circular(
                                                                            8),
                                                              ),
                                                              padding:
                                                                  const EdgeInsets
                                                                      .all(0),
                                                            ),
                                                            icon: const Icon(
                                                                Icons.add,
                                                                size: 20),
                                                          ),
                                                        ],
                                                      ),
                                                    )
                                                  ],
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const Divider()
                                  ];
                                },
                              )
                              .reduce((x, y) => [...x, ...y])
                              .toList()
                          : [],
                    ),
                  ),
                ),
                Container(
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
                          Navigator.pop(context);
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
                          backgroundColor:
                              Theme.of(context).colorScheme.primary,
                          foregroundColor:
                              Theme.of(context).colorScheme.onPrimary,
                          padding: const EdgeInsets.all(0),
                        ),
                        onPressed: () {
                          Navigator.pop(context);
                          Navigator.pushNamed(context, OrderPage.routeName);
                        },
                        child: const Text(
                          'Checkout',
                          style: TextStyle(
                              fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                      )
                    ],
                  ),
                )
              ],
            );
          },
        ),
      ),
    );
  }
}

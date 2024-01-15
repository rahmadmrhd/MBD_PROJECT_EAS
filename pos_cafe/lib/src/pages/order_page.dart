import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:pos_cafe/src/components/loading_dialog.dart';
import 'package:pos_cafe/src/components/note_box.dart';
import 'package:pos_cafe/src/formater/currency_formater.dart';
import 'package:pos_cafe/src/resources/cart/cart_provider.dart';
import 'package:pos_cafe/src/resources/order/order_model.dart';
import 'package:pos_cafe/src/resources/order/order_services.dart';
import 'package:pos_cafe/src/resources/table/table_provider.dart';
import 'package:pos_cafe/src/resources/voucher/voucher_model.dart';
import 'package:pos_cafe/src/resources/voucher/voucher_services.dart';
import 'package:provider/provider.dart';

class OrderPage extends StatefulWidget {
  const OrderPage({super.key});
  static const routeName = '/order';

  @override
  State<OrderPage> createState() => _OrderPageState();
}

class _OrderPageState extends State<OrderPage> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _noteController = TextEditingController();
  final TextEditingController _voucherController = TextEditingController();
  int? _tableId;
  double discount = 0;
  double ppn = 0.11;
  double totalTax = 0;
  double total = 0;
  Voucher? voucher;
  bool isLoadingVoucher = false;
  String? msgErrorVoucher;

  Future checkVoucher(String value, CartProvider cart) async {
    if (_voucherController.text.isNotEmpty) {
      setState(() {
        isLoadingVoucher = true;
      });
      try {
        final voucher = await VoucherServices.get(value.trim());
        setState(() {
          this.voucher = voucher;
          isLoadingVoucher = false;
        });
      } catch (e) {
        if (kDebugMode) print(e);
        setState(() {
          msgErrorVoucher = 'Voucher not found';
          voucher = null;
          discount = 0;
          isLoadingVoucher = false;
        });
      }
    } else {
      setState(() {
        msgErrorVoucher = null;
        voucher = null;
        discount = 0;
        isLoadingVoucher = false;
      });
      return null;
    }
  }

  Future orderNow(BuildContext context, CartProvider cart) async {
    loadingDialog(context);
    try {
      if (_voucherController.text.isNotEmpty) {
        await checkVoucher(
            _voucherController.text, context.read<CartProvider>());
      }
      if (_formKey.currentState!.validate() &&
          ((voucher != null && msgErrorVoucher == null) ||
              _voucherController.text.isEmpty)) {
        final listCartId =
            cart.list.where((e) => e.id != null).map((e) => e.id!).toList();
        final order = Order(
          listCartId: listCartId,
          note: _noteController.text,
          voucherId: voucher?.id,
          tableId: _tableId!,
          ppn: ppn,
        );
        await OrderServices.create(order);
        if (mounted) await context.read<CartProvider>().getAll();
        if (mounted) {
          Navigator.pop(context);
        }
      }
    } finally {
      if (mounted) {
        Navigator.pop(context);
      }
    }
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CartProvider>().getAll();
      context.read<TableProvider>().getAll();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Confirm Order'),
      ),
      bottomSheet: Consumer<CartProvider>(builder: (context, provider, _) {
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
              const Spacer(),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text(
                    'Total Payment',
                    style: TextStyle(),
                  ),
                  Text(
                    formatCurrency(total),
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 16),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  shape: const RoundedRectangleBorder(),
                  fixedSize: const Size(128, 56),
                  backgroundColor: Theme.of(context).colorScheme.primary,
                  foregroundColor: Theme.of(context).colorScheme.onPrimary,
                  padding: const EdgeInsets.all(0),
                ),
                onPressed: () async {
                  await orderNow(context, provider);
                },
                child: const Text(
                  'Order Now',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        );
      }),
      body: Consumer<CartProvider>(
        builder: (context, provider, _) {
          if (voucher != null) {
            if (voucher!.expiredAt.isBefore(DateTime.now())) {
              msgErrorVoucher = 'Voucher is expired';
              discount = 0;
            } else if ((voucher!.usedByUser >= voucher!.maxUse &&
                    voucher!.maxUse > 0) ||
                voucher!.status == 'Sold Out') {
              msgErrorVoucher = 'Voucher is used up';
              discount = 0;
            } else if (provider.totalPriceAfterDiscount <
                voucher!.minPurchase) {
              msgErrorVoucher =
                  'Minimum purchase is ${formatCurrency(voucher!.minPurchase)}';
              discount = 0;
            } else {
              msgErrorVoucher = null;
              discount = provider.totalPriceAfterDiscount * voucher!.discount;
              if (discount > voucher!.maxDiscount) {
                discount = voucher!.maxDiscount;
              }
            }
          }
          totalTax = (provider.totalPriceAfterDiscount - discount) * ppn;
          total = (provider.totalPriceAfterDiscount - discount) + totalTax;
          return SafeArea(
            child: SingleChildScrollView(
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    const SizedBox(height: 8),
                    ...provider.list.isNotEmpty
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
                                                              item.note = value;
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
                                                        const EdgeInsets.all(0),
                                                    foregroundColor:
                                                        Theme.of(context)
                                                            .colorScheme
                                                            .onBackground,
                                                  ),
                                                  icon: Row(
                                                    children: [
                                                      const Icon(Icons.note),
                                                      const SizedBox(width: 8),
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
                                                        if (detail
                                                                .items.length >
                                                            1) {
                                                          return [
                                                            Text(
                                                              '${detail.optionName} : ',
                                                              style: TextStyle(
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
                                                                  fontSize: 14,
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
                                                        formatCurrency(
                                                            item.totalPriceAfterDiscount *
                                                                item.quantity),
                                                        style: TextStyle(
                                                          fontSize: 18,
                                                          color:
                                                              Theme.of(context)
                                                                  .colorScheme
                                                                  .primary,
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  Expanded(
                                                    child: ButtonBar(
                                                      buttonPadding:
                                                          const EdgeInsets.all(
                                                              0),
                                                      children: [
                                                        IconButton(
                                                          onPressed: () async {
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
                                                                  .remove(item,
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
                                                          onPressed: () async {
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
                    Container(
                      height: 56,
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: Row(
                        children: [
                          Text(
                            'Order Total (${provider.totalOrder})',
                            style: const TextStyle(fontSize: 16),
                          ),
                          Expanded(
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                if (provider.totalPriceAfterDiscount !=
                                    provider.totalPrice)
                                  Text(
                                    formatCurrency(provider.totalPrice),
                                    style: const TextStyle(
                                      decoration: TextDecoration.lineThrough,
                                    ),
                                  ),
                                const SizedBox(width: 4),
                                Text(
                                  formatCurrency(
                                      provider.totalPriceAfterDiscount),
                                  style: TextStyle(
                                    fontSize: 18,
                                    color:
                                        Theme.of(context).colorScheme.primary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    Divider(
                      height: 0,
                      thickness: 8,
                      color: Colors.grey[300],
                    ),
                    ConstrainedBox(
                      constraints: const BoxConstraints(minHeight: 56),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        child: Row(
                          children: [
                            Icon(
                              Icons.local_movies_rounded,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                            const SizedBox(width: 12),
                            const Text(
                              'Voucher',
                              style: TextStyle(fontSize: 16),
                            ),
                            const Spacer(),
                            SizedBox(
                              width: 200,
                              child: TextFormField(
                                autovalidateMode:
                                    AutovalidateMode.onUserInteraction,
                                controller: _voucherController,
                                decoration: InputDecoration(
                                  prefixIcon: isLoadingVoucher
                                      ? Transform.scale(
                                          scale: 0.5,
                                          child:
                                              const CircularProgressIndicator(
                                            strokeWidth: 4,
                                          ),
                                        )
                                      : msgErrorVoucher == null &&
                                              voucher != null
                                          ? const Icon(Icons.check)
                                          : _voucherController.text.isNotEmpty
                                              ? const Icon(Icons.error)
                                              : null,
                                  prefixIconColor:
                                      msgErrorVoucher == null && voucher != null
                                          ? Colors.green[400]
                                          : _voucherController.text.isNotEmpty
                                              ? Colors.red
                                              : null,
                                  hintText: 'Voucher code',
                                  contentPadding: const EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 16,
                                  ),
                                  border: const OutlineInputBorder(
                                    borderSide: BorderSide.none,
                                  ),
                                ),
                                textAlign: TextAlign.right,
                                onChanged: (value) {
                                  checkVoucher(value, provider);
                                },
                                validator: (value) => msgErrorVoucher,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const Divider(
                      height: 0,
                    ),
                    ConstrainedBox(
                      constraints: const BoxConstraints(minHeight: 56),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        child: Row(
                          children: [
                            Icon(
                              Icons.description,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                            const SizedBox(width: 12),
                            const Text(
                              'Note',
                              style: TextStyle(fontSize: 16),
                            ),
                            const Spacer(),
                            SizedBox(
                              width: 200,
                              child: TextField(
                                controller: _noteController,
                                maxLines: 3,
                                minLines: 1,
                                // onTap: () {
                                //   showModalBottomSheet(
                                //     context: context,
                                //     builder: (context) {
                                //       return NoteBox(
                                //         note: _noteController.text,
                                //         setNote: (value) async {
                                //           _noteController.text = value;
                                //         },
                                //       );
                                //     },
                                //   );
                                // },
                                decoration: const InputDecoration(
                                  hintText: 'Please leave a note...',
                                  contentPadding: EdgeInsets.symmetric(
                                    horizontal: 16,
                                    vertical: 16,
                                  ),
                                  border: OutlineInputBorder(
                                    borderSide: BorderSide.none,
                                  ),
                                ),
                                textAlign: TextAlign.right,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const Divider(
                      height: 0,
                    ),
                    ConstrainedBox(
                      constraints: const BoxConstraints(minHeight: 56),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        child: Row(
                          children: [
                            Icon(
                              Icons.table_restaurant,
                              color: Theme.of(context).colorScheme.primary,
                            ),
                            const SizedBox(width: 12),
                            const Text(
                              'Table',
                              style: TextStyle(fontSize: 16),
                            ),
                            const Spacer(),
                            SizedBox(
                              width: 200,
                              child: Consumer<TableProvider>(
                                builder: (contex, provider, _) {
                                  return DropdownButtonFormField(
                                    autovalidateMode:
                                        AutovalidateMode.onUserInteraction,
                                    decoration: const InputDecoration(
                                      hintText: 'Select your table!',
                                      contentPadding: EdgeInsets.symmetric(
                                          horizontal: 16, vertical: 16),
                                      border: OutlineInputBorder(
                                        borderSide: BorderSide.none,
                                      ),
                                    ),
                                    alignment: AlignmentDirectional.centerEnd,
                                    items: provider.list.map((e) {
                                      return DropdownMenuItem(
                                        value: e.id,
                                        enabled: e.isAvailable,
                                        alignment:
                                            AlignmentDirectional.centerEnd,
                                        child: Text(e.name),
                                      );
                                    }).toList(),
                                    onChanged: (int? value) {
                                      setState(() {
                                        _tableId = value as int;
                                      });
                                    },
                                    value: _tableId,
                                    validator: (value) {
                                      if (value == null) {
                                        return 'Please select your table!';
                                      }
                                      return null;
                                    },
                                  );
                                },
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Divider(
                      height: 0,
                      thickness: 8,
                      color: Colors.grey[300],
                    ),
                    const SizedBox(height: 16),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              Text(
                                'Order Subtotal (${provider.totalOrder})',
                                style: const TextStyle(fontSize: 16),
                              ),
                              const Spacer(),
                              Text(
                                formatCurrency(
                                    provider.totalPriceAfterDiscount),
                                style: const TextStyle(fontSize: 16),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          if (msgErrorVoucher == null && voucher != null)
                            Row(
                              children: [
                                Text(
                                  'Discount (${voucher!.discount * 100}%)',
                                  style: const TextStyle(fontSize: 16),
                                ),
                                const Spacer(),
                                Text(
                                  formatCurrency(-discount),
                                  style: const TextStyle(fontSize: 16),
                                ),
                              ],
                            ),
                          if (msgErrorVoucher == null && voucher != null)
                            const SizedBox(height: 12),
                          Row(
                            children: [
                              Text(
                                'PPN (${ppn * 100}%)',
                                style: const TextStyle(fontSize: 16),
                              ),
                              const Spacer(),
                              Text(
                                formatCurrency(totalTax),
                                style: const TextStyle(fontSize: 16),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              const Text(
                                'TOTAL',
                                style: TextStyle(
                                    fontSize: 18, fontWeight: FontWeight.bold),
                              ),
                              const Spacer(),
                              Text(
                                formatCurrency(total),
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Theme.of(context).colorScheme.primary,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 100),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

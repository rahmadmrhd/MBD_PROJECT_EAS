import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:intl/intl.dart';
import 'package:pos_cafe/src/components/loading_dialog.dart';
import 'package:pos_cafe/src/pages/menu_detail_page.dart';
import 'package:pos_cafe/src/pages/rate_order_page.dart';
import 'package:pos_cafe/src/resources/order/order_model.dart';
import 'package:pos_cafe/src/resources/order/order_services.dart';
import 'package:skeletons/skeletons.dart';

class OrderDetailPage extends StatefulWidget {
  const OrderDetailPage({super.key});
  static const routeName = '/orderDetail';

  @override
  State<OrderDetailPage> createState() => _OrderDetailPageState();
}

class _OrderDetailPageState extends State<OrderDetailPage> {
  int? _orderId;
  Future<MyOrders>? futureOrder;

  @override
  void initState() {
    super.initState();
  }

  final statusMap = {
    'waiting confirmation': {
      'text': 'Waiting Confirmation',
      'bgcolor': const Color(0xfffdf0e1),
      'fgcolor': const Color(0xff492b08),
      'icon': Icons.pending_actions_rounded,
    },
    'in process': {
      'text': 'In Process',
      'bgcolor': const Color(0xffe3effb),
      'fgcolor': const Color(0xff126bbd),
      'icon': 'eos-icons:hourglass',
    },
    'done': {
      'text': 'Completed',
      'bgcolor': const Color(0xffe3fbe3),
      'fgcolor': const Color(0xff0a470a),
      'icon': Icons.task_alt_rounded,
    },
    'canceled': {
      'text': 'Canceled',
      'bgcolor': const Color(0xfffce4e4),
      'fgcolor': const Color(0xff7d1212),
      'icon': Icons.close,
    },
  };

  Widget getStatus(String status) {
    final statusData = statusMap[status.toLowerCase()];
    if (statusData == null) return const SizedBox.shrink();
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: statusData['bgcolor'] as Color,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        children: [
          if (statusData['icon'] is IconData)
            Icon(
              statusData['icon'] as IconData,
              color: statusData['fgcolor'] as Color,
            )
          else
            SvgPicture.network(
                'https://api.iconify.design/${(statusData['icon'] as String).split(':')[0]}/${(statusData['icon'] as String).split(':')[1]}.svg?height=none',
                theme: SvgTheme(currentColor: statusData['fgcolor'] as Color)),
          const SizedBox(
            width: 4,
          ),
          Text(
            statusData['text'] as String,
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    _orderId = ModalRoute.of(context)!.settings.arguments as int;
    return FutureBuilder(
      future: futureOrder ?? OrderServices.getById(_orderId!),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Scaffold(
            appBar: AppBar(
              title: const Text('Detail Order'),
            ),
            body: SafeArea(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    const SizedBox(height: 8),
                    ...[1, 2, 3, 4, 5]
                        .map(
                          (item) {
                            return [
                              ConstrainedBox(
                                constraints: BoxConstraints(
                                  maxWidth: MediaQuery.of(context).size.width,
                                  minHeight: 100,
                                ),
                                child: const Padding(
                                  padding:
                                      EdgeInsets.symmetric(horizontal: 12.0),
                                  child: Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      SkeletonAvatar(
                                        style: SkeletonAvatarStyle(
                                          height: 100,
                                          width: 100,
                                        ),
                                      ),
                                      SizedBox(width: 4),
                                      SkeletonLine(
                                        style: SkeletonLineStyle(
                                          width: 28,
                                        ),
                                      ),
                                      SizedBox(width: 4),
                                      Expanded(
                                        child: Column(
                                          mainAxisAlignment:
                                              MainAxisAlignment.start,
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            SkeletonLine(
                                              style: SkeletonLineStyle(
                                                width: 120,
                                              ),
                                            ),
                                            SizedBox(height: 4),
                                            SkeletonLine(
                                              style: SkeletonLineStyle(
                                                width: 100,
                                              ),
                                            ),
                                            SizedBox(height: 4),
                                            SkeletonLine(
                                              style: SkeletonLineStyle(
                                                width: 80,
                                              ),
                                            ),
                                            SizedBox(height: 4),
                                          ],
                                        ),
                                      ),
                                      Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.end,
                                        children: [
                                          SkeletonLine(
                                            style: SkeletonLineStyle(
                                              width: 75,
                                            ),
                                          ),
                                          SizedBox(height: 4),
                                          SkeletonLine(
                                            style: SkeletonLineStyle(
                                              width: 100,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const Divider()
                            ];
                          },
                        )
                        .reduce((x, y) => [...x, ...y])
                        .toList(),
                    Container(
                      height: 32,
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: const Row(
                        children: [
                          SkeletonLine(
                            style: SkeletonLineStyle(
                              width: 100,
                            ),
                          ),
                          Expanded(
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                SkeletonLine(
                                  style: SkeletonLineStyle(
                                    width: 100,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Divider(
                      height: 0,
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: const Column(
                        children: [
                          SizedBox(height: 8),
                          Row(
                            children: [
                              SkeletonLine(
                                style: SkeletonLineStyle(
                                  width: 100,
                                ),
                              ),
                              Spacer(),
                              SkeletonLine(
                                style: SkeletonLineStyle(
                                  width: 100,
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 12),
                          Row(
                            children: [
                              SkeletonLine(
                                style: SkeletonLineStyle(
                                  width: 100,
                                ),
                              ),
                              Spacer(),
                              SkeletonLine(
                                style: SkeletonLineStyle(
                                  width: 100,
                                ),
                              ),
                            ],
                          ),
                          Divider(),
                          SizedBox(height: 100),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        } else if (snapshot.hasError) {
          Navigator.pop(context);
          return Scaffold(
            appBar: AppBar(
              title: const Text('Detail Order'),
            ),
            body: Text(
              snapshot.error.toString(),
            ),
          );
        } else if (!snapshot.hasData) {
          return const SizedBox.shrink();
        } else {
          final order = snapshot.data!;
          return Scaffold(
            appBar: AppBar(
              title: const Text('Detail Order'),
            ),
            bottomSheet: (order.status == 'Waiting Confirmation' ||
                        order.status == 'Done') &&
                    order.rating == null
                ? ElevatedButton(
                    onPressed: () async {
                      if (order.status == 'Waiting Confirmation') {
                        loadingDialog(context);
                        await OrderServices.cancel(order.id);
                        if (mounted) Navigator.pop(context);
                        setState(() {
                          futureOrder = OrderServices.getById(_orderId!);
                        });
                      } else {
                        Navigator.pushNamed(
                          context,
                          RateOrderPage.routeName,
                          arguments: order.id,
                        );
                      }
                      // addToCart(context, menu);
                    },
                    style: ElevatedButton.styleFrom(
                      shape: const RoundedRectangleBorder(),
                      minimumSize: const Size.fromHeight(56),
                      backgroundColor: order.status == 'Waiting Confirmation'
                          ? Theme.of(context).colorScheme.error
                          : Theme.of(context).colorScheme.primary,
                      foregroundColor: Theme.of(context).colorScheme.onPrimary,
                    ),
                    child: Text(
                      order.status == 'Waiting Confirmation'
                          ? 'Cancel'
                          : 'Rate',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  )
                : null,
            body: SafeArea(
              child: RefreshIndicator(
                onRefresh: () async {
                  setState(() {
                    futureOrder = OrderServices.getById(_orderId!);
                  });
                },
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      const SizedBox(height: 8),
                      ...order.details.isNotEmpty
                          ? order.details
                              .map(
                                (item) {
                                  return [
                                    InkWell(
                                      onTap: () {
                                        Navigator.pushNamed(
                                          context,
                                          MenuDetailPage.routeName,
                                          arguments: item.menuId,
                                        );
                                      },
                                      child: ConstrainedBox(
                                        constraints: BoxConstraints(
                                          maxWidth:
                                              MediaQuery.of(context).size.width,
                                          minHeight: 100,
                                        ),
                                        child: Padding(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 12.0),
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
                                                    image: item.image != null
                                                        ? NetworkImage(
                                                            item.image ?? '')
                                                        : const AssetImage(
                                                                'assets/images/empty_menu.jpg')
                                                            as ImageProvider,
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(width: 4),
                                              Text(
                                                '${item.qty} X ',
                                                style: const TextStyle(
                                                  fontSize: 18,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              const SizedBox(width: 4),
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
                                                        fontWeight:
                                                            FontWeight.bold,
                                                      ),
                                                      overflow:
                                                          TextOverflow.ellipsis,
                                                    ),
                                                    if (item.note != null &&
                                                        item.note!.isNotEmpty)
                                                      Text(
                                                        'Note : ${item.note}',
                                                        style: const TextStyle(
                                                          fontSize: 14,
                                                        ),
                                                        overflow: TextOverflow
                                                            .ellipsis,
                                                      ),
                                                    const SizedBox(height: 4),
                                                    if (item.options.isNotEmpty)
                                                      ...item.options.map(
                                                        (detail) {
                                                          return <Widget>[
                                                            ...() {
                                                              if (detail.items
                                                                      .length >
                                                                  1) {
                                                                return [
                                                                  Text(
                                                                    '${detail.name} : ',
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
                                                                  ...detail
                                                                      .items
                                                                      .map(
                                                                          (item) {
                                                                    return Text(
                                                                      "    - ${item.name}",
                                                                      style:
                                                                          TextStyle(
                                                                        fontSize:
                                                                            14,
                                                                        color: Theme.of(context)
                                                                            .colorScheme
                                                                            .onBackground
                                                                            .withOpacity(0.8),
                                                                      ),
                                                                    );
                                                                  })
                                                                ];
                                                              } else {
                                                                return [
                                                                  Row(
                                                                    children: [
                                                                      Text(
                                                                        '${detail.name} : ',
                                                                        style:
                                                                            TextStyle(
                                                                          fontSize:
                                                                              14,
                                                                          fontWeight:
                                                                              FontWeight.bold,
                                                                          color: Theme.of(context)
                                                                              .colorScheme
                                                                              .onBackground
                                                                              .withOpacity(0.8),
                                                                        ),
                                                                      ),
                                                                      Text(
                                                                        detail
                                                                            .items
                                                                            .first
                                                                            .name,
                                                                        style:
                                                                            TextStyle(
                                                                          fontSize:
                                                                              14,
                                                                          color: Theme.of(context)
                                                                              .colorScheme
                                                                              .onBackground
                                                                              .withOpacity(0.8),
                                                                        ),
                                                                      )
                                                                    ],
                                                                  ),
                                                                ];
                                                              }
                                                            }()
                                                          ];
                                                        },
                                                      ).reduce(
                                                          (value, element) => [
                                                                ...value,
                                                                ...element
                                                              ]),
                                                  ],
                                                ),
                                              ),
                                              Column(
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.end,
                                                children: [
                                                  if (item.afterDiscount !=
                                                      item.price)
                                                    Text(
                                                      item.price.toString(),
                                                      style: const TextStyle(
                                                        decoration:
                                                            TextDecoration
                                                                .lineThrough,
                                                      ),
                                                    ),
                                                  Text(
                                                    item.total ?? '',
                                                    style: TextStyle(
                                                      fontSize: 18,
                                                      color: Theme.of(context)
                                                          .colorScheme
                                                          .primary,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ),
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
                        height: 32,
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        child: Row(
                          children: [
                            Text(
                              'Order Total (${order.details.map((e) => e.qty).reduce((x, y) => x! + y!)})',
                              style: const TextStyle(fontSize: 16),
                            ),
                            Expanded(
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  Text(
                                    order.subtotal,
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
                      const Divider(
                        height: 0,
                      ),
                      const SizedBox(height: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        child: Column(
                          children: [
                            const SizedBox(height: 8),
                            ...() {
                              if (order.voucherCode != null) {
                                return [
                                  Row(
                                    children: [
                                      const Text(
                                        'Voucher Code',
                                        style: TextStyle(fontSize: 16),
                                      ),
                                      const Spacer(),
                                      Text(
                                        order.voucherCode ?? '-',
                                        style: const TextStyle(fontSize: 16),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      Text(
                                        'Discount (${order.voucherDiscount})',
                                        style: const TextStyle(fontSize: 16),
                                      ),
                                      const Spacer(),
                                      Text(
                                        order.discount,
                                        style: const TextStyle(fontSize: 16),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                ];
                              } else {
                                return [];
                              }
                            }(),
                            Row(
                              children: [
                                Text(
                                  'PPN (${order.ppn})',
                                  style: const TextStyle(fontSize: 16),
                                ),
                                const Spacer(),
                                Text(
                                  order.totalPpn,
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
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold),
                                ),
                                const Spacer(),
                                Text(
                                  order.total,
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color:
                                        Theme.of(context).colorScheme.primary,
                                  ),
                                ),
                              ],
                            ),
                            const Divider(),
                            const SizedBox(height: 12),
                            const Row(
                              children: [
                                Text(
                                  'Order Detail',
                                  textAlign: TextAlign.left,
                                  style: TextStyle(fontSize: 20),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Note',
                                  style: TextStyle(fontSize: 16),
                                ),
                                const Spacer(),
                                SizedBox(
                                  width:
                                      MediaQuery.of(context).size.width * 0.5,
                                  child: Text(
                                    order.note.isEmpty ? '-' : order.note,
                                    textAlign: TextAlign.right,
                                    style: const TextStyle(fontSize: 16),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                const Text(
                                  'Table',
                                  style: TextStyle(fontSize: 16),
                                ),
                                const Spacer(),
                                Text(
                                  order.tableName,
                                  style: const TextStyle(fontSize: 16),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                const Text(
                                  'Order ID',
                                  style: TextStyle(fontSize: 16),
                                ),
                                const Spacer(),
                                Text(
                                  '#${order.orderCode}',
                                  style: const TextStyle(fontSize: 16),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                const Text(
                                  'Order Time',
                                  style: TextStyle(fontSize: 16),
                                ),
                                const Spacer(),
                                Text(
                                  DateFormat('dd MMMM yyyy  HH:mm')
                                      .format(order.timestamp),
                                  style: const TextStyle(fontSize: 16),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                const Text(
                                  'Status',
                                  style: TextStyle(fontSize: 16),
                                ),
                                const Spacer(),
                                getStatus(order.status),
                              ],
                            ),
                            const Divider(),
                            ...() {
                              if (order.rating != null) {
                                return [
                                  const SizedBox(height: 12),
                                  const Row(
                                    children: [
                                      Text(
                                        'Order Review',
                                        textAlign: TextAlign.left,
                                        style: TextStyle(fontSize: 20),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      const Text(
                                        'Rate',
                                        style: TextStyle(fontSize: 16),
                                      ),
                                      const Spacer(),
                                      RatingBarIndicator(
                                        rating: order.rating ?? 0.0,
                                        itemBuilder: (context, index) => Icon(
                                          Icons.star,
                                          color: Colors.amber[600],
                                        ),
                                        itemCount: 5,
                                        itemSize: 18.0,
                                        unratedColor:
                                            Colors.amber.withOpacity(0.25),
                                        // direction: Axis.ve,
                                      ),
                                      const SizedBox(width: 8),
                                      Text(
                                        '${order.rating ?? 0.0}',
                                        style: const TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.bold),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Review',
                                        style: TextStyle(fontSize: 16),
                                      ),
                                      const Spacer(),
                                      SizedBox(
                                        width:
                                            MediaQuery.of(context).size.width *
                                                0.5,
                                        child: Text(
                                          (order.review ?? '').isEmpty
                                              ? '-'
                                              : order.review!,
                                          textAlign: TextAlign.right,
                                          style: const TextStyle(fontSize: 16),
                                        ),
                                      ),
                                    ],
                                  )
                                ];
                              } else {
                                return [];
                              }
                            }(),
                            const SizedBox(height: 100),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        }
      },
    );
  }
}

import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:intl/intl.dart';
import 'package:pos_cafe/src/components/loading_dialog.dart';
import 'package:pos_cafe/src/pages/order_detail.dart';
import 'package:pos_cafe/src/pages/rate_order_page.dart';
import 'package:pos_cafe/src/resources/order/order_provider.dart';
import 'package:pos_cafe/src/resources/order/order_services.dart';
import 'package:provider/provider.dart';
import 'package:skeletons/skeletons.dart';

class MyOrdersPage extends StatefulWidget {
  const MyOrdersPage({super.key, required this.onBack});
  final void Function() onBack;

  @override
  State<MyOrdersPage> createState() => _MyOrdersPageState();
}

class _MyOrdersPageState extends State<MyOrdersPage> {
  Timer? timer;
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<OrderProvider>().getAll();
    });
    timer = Timer.periodic(const Duration(seconds: 5), (Timer t) {
      context.read<OrderProvider>().getAll();
    });
  }

  @override
  void dispose() {
    timer?.cancel();
    super.dispose();
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
    return PopScope(
      canPop: false,
      onPopInvoked: (value) => widget.onBack(),
      child: Scaffold(
        appBar: AppBar(
          title: const Text('My Orders'),
        ),
        body: RefreshIndicator(
          onRefresh: () async {
            context.read<OrderProvider>().refresh();
          },
          child: SafeArea(
            child: SingleChildScrollView(
              child: Consumer<OrderProvider>(
                builder: (context, provider, _) {
                  if (provider.isLoading && provider.isFirst) {
                    return Column(
                      children: [1, 2, 3]
                          .map(
                            (order) {
                              return [
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 12, vertical: 12),
                                  height: 300,
                                  child: Column(
                                    children: [
                                      const SizedBox(
                                        height: 48,
                                        child: Row(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.center,
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                SkeletonLine(
                                                  style: SkeletonLineStyle(
                                                    width: 200,
                                                    height: 24,
                                                  ),
                                                ),
                                                SizedBox(height: 4),
                                                SkeletonLine(
                                                  style: SkeletonLineStyle(
                                                    width: 150,
                                                  ),
                                                ),
                                              ],
                                            ),
                                            SkeletonLine(
                                              style: SkeletonLineStyle(
                                                width: 120,
                                                height: 42,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      const Divider(
                                        height: 5,
                                      ),
                                      const SizedBox(height: 12),
                                      SizedBox(
                                        height: 140,
                                        child: SingleChildScrollView(
                                          physics:
                                              const NeverScrollableScrollPhysics(),
                                          scrollDirection: Axis.horizontal,
                                          child: Row(
                                            children: [1, 2, 3, 4].map((menu) {
                                              return Container(
                                                padding: const EdgeInsets.only(
                                                  right: 12,
                                                ),
                                                child: Column(
                                                  children: [
                                                    SkeletonAvatar(
                                                      style:
                                                          SkeletonAvatarStyle(
                                                        height: 100,
                                                        width: 100,
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(0),
                                                      ),
                                                    ),
                                                    const SizedBox(height: 8),
                                                    const SkeletonLine(
                                                      style: SkeletonLineStyle(
                                                        width: 100,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              );
                                            }).toList(),
                                          ),
                                        ),
                                      ),
                                      const Divider(
                                        height: 0,
                                      ),
                                      const SizedBox(height: 12),
                                      const Row(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.center,
                                        children: [
                                          Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              SkeletonLine(
                                                style: SkeletonLineStyle(
                                                  width: 100,
                                                ),
                                              ),
                                              SizedBox(height: 4),
                                              SkeletonLine(
                                                style: SkeletonLineStyle(
                                                  width: 150,
                                                ),
                                              ),
                                            ],
                                          ),
                                          Spacer(),
                                          SkeletonAvatar(
                                            style: SkeletonAvatarStyle(
                                              width: 100,
                                            ),
                                          )
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                                Divider(
                                  height: 0,
                                  thickness: 8,
                                  color: Colors.grey[300],
                                ),
                              ];
                            },
                          )
                          .reduce((x, y) => [...x, ...y])
                          .toList(),
                    );
                  }
                  return Column(children: [
                    ...provider.listOrder.isNotEmpty
                        ? provider.listOrder
                            .map(
                              (order) {
                                return [
                                  InkWell(
                                    onTap: () {
                                      Navigator.pushNamed(
                                        context,
                                        OrderDetailPage.routeName,
                                        arguments: order.id,
                                      );
                                    },
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 12, vertical: 12),
                                      height: 280,
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          SizedBox(
                                            height: 48,
                                            child: Row(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.center,
                                              mainAxisAlignment:
                                                  MainAxisAlignment
                                                      .spaceBetween,
                                              children: [
                                                Column(
                                                  crossAxisAlignment:
                                                      CrossAxisAlignment.start,
                                                  children: [
                                                    Text(
                                                      '#${order.orderCode}',
                                                      style: const TextStyle(
                                                        fontSize: 20,
                                                        fontWeight:
                                                            FontWeight.bold,
                                                      ),
                                                    ),
                                                    Text(
                                                      DateFormat(
                                                              'dd MMMM yyyy HH:mm')
                                                          .format(
                                                              order.timestamp),
                                                      style: const TextStyle(
                                                        fontSize: 18,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                getStatus(order.status),
                                              ],
                                            ),
                                          ),
                                          const Divider(
                                            height: 5,
                                          ),
                                          const SizedBox(height: 12),
                                          SizedBox(
                                            height: 140,
                                            child: SingleChildScrollView(
                                              scrollDirection: Axis.horizontal,
                                              child: Row(
                                                mainAxisAlignment:
                                                    MainAxisAlignment.start,
                                                children:
                                                    order.details.map((menu) {
                                                  return Container(
                                                    padding:
                                                        const EdgeInsets.only(
                                                      right: 12,
                                                    ),
                                                    child: Column(
                                                      children: [
                                                        Container(
                                                          width: 100,
                                                          height: 100,
                                                          clipBehavior: Clip
                                                              .antiAliasWithSaveLayer,
                                                          decoration:
                                                              BoxDecoration(
                                                            image:
                                                                DecorationImage(
                                                              fit: BoxFit.cover,
                                                              image: menu.image !=
                                                                      null
                                                                  ? NetworkImage(
                                                                      menu.image ??
                                                                          '')
                                                                  : const AssetImage(
                                                                          'assets/images/empty_menu.jpg')
                                                                      as ImageProvider,
                                                            ),
                                                          ),
                                                        ),
                                                        Text(
                                                          menu.menuName,
                                                          textAlign:
                                                              TextAlign.center,
                                                          maxLines: 2,
                                                          overflow: TextOverflow
                                                              .ellipsis,
                                                          style:
                                                              const TextStyle(
                                                            fontSize: 16,
                                                          ),
                                                        )
                                                      ],
                                                    ),
                                                  );
                                                }).toList(),
                                              ),
                                            ),
                                          ),
                                          const Divider(
                                            height: 0,
                                          ),
                                          Expanded(
                                            child: Row(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.center,
                                              children: [
                                                Column(
                                                  mainAxisAlignment:
                                                      MainAxisAlignment.center,
                                                  crossAxisAlignment:
                                                      CrossAxisAlignment.start,
                                                  children: [
                                                    Text(
                                                      'Total (${order.details.map((e) => e.qty).reduce((x, y) => x! + y!)} item) :',
                                                      style: const TextStyle(
                                                        fontSize: 14,
                                                      ),
                                                    ),
                                                    Text(
                                                      order.total,
                                                      style: const TextStyle(
                                                        fontSize: 18,
                                                        fontWeight:
                                                            FontWeight.bold,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                const Spacer(),
                                                if (order.status ==
                                                    'Waiting Confirmation')
                                                  ElevatedButton(
                                                    style: ElevatedButton
                                                        .styleFrom(
                                                      shape:
                                                          const RoundedRectangleBorder(),
                                                      fixedSize:
                                                          const Size.fromWidth(
                                                              100),
                                                      backgroundColor:
                                                          Theme.of(context)
                                                              .colorScheme
                                                              .error,
                                                      foregroundColor:
                                                          Theme.of(context)
                                                              .colorScheme
                                                              .onError,
                                                      padding:
                                                          const EdgeInsets.all(
                                                              0),
                                                    ),
                                                    onPressed: () async {
                                                      loadingDialog(context);
                                                      await OrderServices
                                                          .cancel(order.id);
                                                      if (mounted) {
                                                        Navigator.pop(context);
                                                      }
                                                      provider.refresh();
                                                    },
                                                    child: const Text(
                                                      'Cancel',
                                                      style: TextStyle(
                                                        fontSize: 18,
                                                        fontWeight:
                                                            FontWeight.bold,
                                                      ),
                                                    ),
                                                  ),
                                                if (order.status == 'Done' &&
                                                    order.rating == null)
                                                  ElevatedButton(
                                                    style: ElevatedButton
                                                        .styleFrom(
                                                      shape:
                                                          const RoundedRectangleBorder(),
                                                      fixedSize:
                                                          const Size.fromWidth(
                                                              100),
                                                      backgroundColor:
                                                          Theme.of(context)
                                                              .colorScheme
                                                              .primary,
                                                      foregroundColor:
                                                          Theme.of(context)
                                                              .colorScheme
                                                              .onPrimary,
                                                      padding:
                                                          const EdgeInsets.all(
                                                              0),
                                                    ),
                                                    onPressed: () {
                                                      Navigator.pushNamed(
                                                        context,
                                                        RateOrderPage.routeName,
                                                        arguments: order.id,
                                                      );
                                                    },
                                                    child: const Text(
                                                      'Rate',
                                                      style: TextStyle(
                                                          fontSize: 18,
                                                          fontWeight:
                                                              FontWeight.bold),
                                                    ),
                                                  )
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                  Divider(
                                    height: 0,
                                    thickness: 8,
                                    color: Colors.grey[300],
                                  ),
                                ];
                              },
                            )
                            .reduce((x, y) => [...x, ...y])
                            .toList()
                        : [],
                  ]);
                },
              ),
            ),
          ),
        ),
      ),
    );
  }
}

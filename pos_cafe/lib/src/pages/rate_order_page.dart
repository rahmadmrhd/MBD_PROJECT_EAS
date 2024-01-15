import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:pos_cafe/src/components/loading_dialog.dart';
import 'package:pos_cafe/src/resources/order/order_model.dart';
import 'package:pos_cafe/src/resources/order/order_services.dart';

class RateOrderPage extends StatefulWidget {
  const RateOrderPage({super.key});
  static const routeName = '/rateOrder';

  @override
  State<RateOrderPage> createState() => _RateOrderPageState();
}

class _RateOrderPageState extends State<RateOrderPage> {
  int? _orderId;
  Future<List<OrderDetails>>? futureOrder;
  double rating = 0;
  final TextEditingController _reviewController = TextEditingController();
  List<OrderDetails> listMenu = [];

  bool get isValid {
    if (rating > 0 && listMenu.map((e) => e.rating ?? 0).any((e) => e > 0)) {
      return true;
    }
    return false;
  }

  @override
  void initState() {
    super.initState();
  }

  String getLabelText(double value) {
    if (value <= 0) return '';
    if (value <= 1) return "Useless";
    if (value <= 2) return "Poor";
    if (value <= 3) return "Acceptable";
    if (value <= 4) return "Good";
    if (value <= 5) return "Excellent";
    return '';
  }

  void submit() async {
    if (isValid) {
      loadingDialog(context);
      try {
        await OrderServices.rateOrder(_orderId ?? 0, {
          'rate': rating,
          'description': _reviewController.text,
          'menu': listMenu
              .map((e) => {
                    'menuId': e.menuId,
                    'rate': e.rating,
                    'description': e.review
                  })
              .toList(),
        });
      } finally {
        if (mounted) {
          Navigator.pop(context);
          Navigator.pop(context);
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    _orderId = ModalRoute.of(context)!.settings.arguments as int;
    futureOrder ??= OrderServices.getByIdDetails(_orderId!);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rate our service and menu'),
      ),
      bottomSheet: ElevatedButton(
        onPressed: submit,
        style: ElevatedButton.styleFrom(
          shape: const RoundedRectangleBorder(),
          minimumSize: const Size.fromHeight(56),
          backgroundColor: isValid
              ? Theme.of(context).colorScheme.primary
              : Theme.of(context).colorScheme.surfaceVariant,
          foregroundColor: isValid
              ? Theme.of(context).colorScheme.onPrimary
              : Theme.of(context).colorScheme.onSurfaceVariant,
        ),
        child: const Text(
          'Submit',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: FutureBuilder(
        future: futureOrder,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Text(snapshot.error.toString());
          } else if (!snapshot.hasData) {
            return const SizedBox.shrink();
          } else {
            final order = snapshot.data!;
            listMenu = order;
            return SafeArea(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    const SizedBox(height: 8),
                    RatingBar.builder(
                      initialRating: rating,
                      minRating: 1,
                      direction: Axis.horizontal,
                      allowHalfRating: true,
                      itemCount: 5,
                      glow: false,
                      wrapAlignment: WrapAlignment.end,
                      updateOnDrag: true,
                      itemPadding: const EdgeInsets.symmetric(horizontal: 2),
                      itemBuilder: (context, _) => const Icon(
                        Icons.star,
                        color: Colors.amber,
                      ),
                      onRatingUpdate: (rating) {
                        setState(() {
                          this.rating = rating;
                        });
                      },
                    ),
                    const SizedBox(height: 12),
                    Text(
                      getLabelText(rating),
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Divider(
                      height: 16,
                      thickness: 8,
                      color: Colors.grey[300],
                    ),
                    const SizedBox(height: 8),
                    TextFormField(
                      minLines: 8,
                      maxLines: 10,
                      controller: _reviewController,
                      textInputAction: TextInputAction.next,
                      decoration: const InputDecoration(
                        contentPadding: EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 0,
                        ),
                        border: OutlineInputBorder(
                          borderSide: BorderSide.none,
                        ),
                        hintText: 'Share your reviews here...',
                      ),
                    ),
                    Divider(
                      height: 16,
                      thickness: 8,
                      color: Colors.grey[300],
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'How was each menu?',
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Divider(),
                    const SizedBox(height: 8),
                    ...order.isNotEmpty
                        ? order
                            .map(
                              (item) {
                                return [
                                  ConstrainedBox(
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
                                          const SizedBox(width: 8),
                                          Expanded(
                                            child: Column(
                                              mainAxisAlignment:
                                                  MainAxisAlignment.start,
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.stretch,
                                              children: [
                                                Text(
                                                  item.menuName,
                                                  style: const TextStyle(
                                                    fontSize: 18,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                ),
                                                const SizedBox(height: 8),
                                                RatingBar.builder(
                                                  initialRating:
                                                      item.rating ?? 0,
                                                  minRating: 1,
                                                  direction: Axis.horizontal,
                                                  allowHalfRating: true,
                                                  itemCount: 5,
                                                  glow: false,
                                                  wrapAlignment:
                                                      WrapAlignment.end,
                                                  itemPadding: const EdgeInsets
                                                      .symmetric(horizontal: 2),
                                                  itemBuilder: (context, _) =>
                                                      const Icon(
                                                    Icons.star,
                                                    color: Colors.amber,
                                                  ),
                                                  onRatingUpdate: (rating) {
                                                    setState(() {
                                                      item.rating = rating;
                                                    });
                                                  },
                                                ),
                                                const SizedBox(height: 4),
                                                TextFormField(
                                                  minLines: 1,
                                                  maxLines: 2,
                                                  initialValue: item.review,
                                                  textInputAction:
                                                      TextInputAction.next,
                                                  decoration:
                                                      const InputDecoration(
                                                    contentPadding:
                                                        EdgeInsets.symmetric(
                                                      horizontal: 12,
                                                      vertical: 0,
                                                    ),
                                                    border: OutlineInputBorder(
                                                      borderSide: BorderSide(
                                                        width: 0.5,
                                                      ),
                                                    ),
                                                    hintText:
                                                        'Please rate our menu',
                                                  ),
                                                  onChanged: (value) {
                                                    setState(() {
                                                      item.review = value;
                                                    });
                                                  },
                                                ),
                                              ],
                                            ),
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
                            .toList()
                        : [],
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            );
          }
        },
      ),
    );
  }
}

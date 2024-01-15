class Order {
  final List<int> listCartId;
  final String? note;
  final int? voucherId;
  final int tableId;
  final double ppn;

  Order({
    required this.listCartId,
    required this.note,
    required this.voucherId,
    required this.tableId,
    required this.ppn,
  });
}

class MyOrders {
  MyOrders({
    required this.id,
    required this.orderCode,
    required this.note,
    required this.ppn,
    required this.tableName,
    required this.status,
    required this.timestamp,
    required this.voucherCode,
    required this.voucherDiscount,
    required this.discount,
    required this.total,
    required this.totalPpn,
    required this.subtotal,
    required this.details,
    this.rating,
    this.review,
  });

  int id;
  String orderCode;
  String note;
  String ppn;
  String tableName;
  String status;
  DateTime timestamp;
  String? voucherCode;
  String voucherDiscount;
  String discount;
  String total;
  String totalPpn;
  String subtotal;
  double? rating;
  String? review;
  List<OrderDetails> details;

  factory MyOrders.fromJson(Map<String, dynamic> json) {
    return MyOrders(
      id: json['id'],
      orderCode: json['orderCode'],
      note: json['note'],
      ppn: json['ppn'],
      tableName: json['tableName'],
      status: json['status'],
      timestamp: DateTime.parse(json['timestamp']).toLocal(),
      voucherCode: json['voucherCode'],
      voucherDiscount: json['voucherDiscount'],
      discount: json['discount'],
      total: json['total'],
      totalPpn: json['totalPpn'],
      subtotal: json['subtotal'],
      rating: double.tryParse(json['rating'].toString()),
      review: json['review'],
      details: List.from(json['details'])
          .map((x) => OrderDetails.fromJson(x))
          .toList(),
    );
  }
}

class OrderDetails {
  OrderDetails({
    this.id,
    required this.menuId,
    required this.menuName,
    this.price,
    this.discount,
    this.afterDiscount,
    this.subtotal,
    this.total,
    required this.image,
    this.qty,
    this.note,
    required this.options,
  });

  int? id;
  int menuId;
  String menuName;
  String? price;
  String? discount;
  String? afterDiscount;
  String? subtotal;
  String? total;
  String? image;
  double? rating;
  String? review;
  int? qty;
  String? note;
  List<OrderDetailOptions> options;

  factory OrderDetails.fromJson(Map<String, dynamic> json) {
    return OrderDetails(
      id: json['id'],
      menuId: json['menuId'],
      menuName: json['menuName'],
      price: json['price'],
      discount: json['discount'],
      afterDiscount: json['afterDiscount'],
      subtotal: json['subtotal'],
      total: json['total'],
      image: json['image'],
      qty: json['qty'],
      note: json['note'],
      options: json['options'] == null
          ? []
          : List.from(json['options'])
              .map((e) => OrderDetailOptions.fromJson(e))
              .toList(),
    );
  }
}

class OrderDetailOptions {
  OrderDetailOptions({
    required this.name,
    required this.items,
  });

  String name;
  List<OrderDetailOptionItem> items;

  factory OrderDetailOptions.fromJson(Map<String, dynamic> json) {
    return OrderDetailOptions(
      name: json['name'],
      items: List.from(json['items'])
          .map((e) => OrderDetailOptionItem.fromJson(e))
          .toList(),
    );
  }
}

class OrderDetailOptionItem {
  OrderDetailOptionItem({
    required this.name,
    required this.price,
  });

  String name;
  String price;
  factory OrderDetailOptionItem.fromJson(Map<String, dynamic> json) {
    return OrderDetailOptionItem(
      name: json['name'],
      price: json['price'],
    );
  }
}

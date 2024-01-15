class Cart {
  final int? id;
  final int menuId;
  final String menuName;
  final double menuPrice;
  final double menuAfterDiscount;
  final String? menuImageUrl;
  String? note;
  int quantity;
  List<CartDetail> details;

  double get totalPrice =>
      menuPrice +
      (details.isNotEmpty
          ? details
              .map((x) =>
                  x.items.map((y) => y.itemPrice).reduce((x, y) => x + y))
              .reduce((x, y) => x + y)
          : 0.0);
  double get totalPriceAfterDiscount =>
      menuAfterDiscount +
      (details.isNotEmpty
          ? details
              .map((x) =>
                  x.items.map((y) => y.itemPrice).reduce((x, y) => x + y))
              .reduce((x, y) => x + y)
          : 0.0);

  Cart({
    this.id,
    required this.menuId,
    required this.menuName,
    required this.menuPrice,
    required this.menuAfterDiscount,
    this.menuImageUrl,
    required this.quantity,
    required this.details,
    this.note,
  });

  factory Cart.fromJson(Map<String, dynamic> json) {
    return Cart(
      id: json['id'],
      menuId: json['menuId'],
      menuName: json['menuName'],
      menuPrice: double.tryParse(json['menuPrice'].toString()) ?? 0.0,
      menuAfterDiscount:
          double.tryParse(json['menuAfterDiscount'].toString()) ?? 0.0,
      menuImageUrl: json['menuImageUrl'],
      quantity: json['qty'],
      note: json['note'],
      details: List.from(json['details'])
          .map((e) => CartDetail.fromJson(e))
          .toList(),
    );
  }
}

class CartDetail {
  final String optionName;
  final List<CartDetailItem> items;

  CartDetail({
    required this.optionName,
    required this.items,
  });

  factory CartDetail.fromJson(Map<String, dynamic> json) {
    return CartDetail(
      optionName: json['optionName'],
      items: List.from(json['items'])
          .map((x) => CartDetailItem.fromJson(x))
          .toList(),
    );
  }
}

class CartDetailItem {
  final int id;
  final String itemName;
  final double itemPrice;

  CartDetailItem({
    required this.id,
    required this.itemName,
    required this.itemPrice,
  });

  factory CartDetailItem.fromJson(Map<String, dynamic> json) {
    return CartDetailItem(
      id: json['optionItemId'],
      itemName: json['optionItemName'],
      itemPrice: (json['optionItemPrice'] as num).toDouble(),
    );
  }
}

class Voucher {
  final int id;
  final String code;
  final String? description;
  final double discount;
  final double minPurchase;
  final double maxDiscount;
  final int maxUse;
  final int qty;
  final int used;
  final DateTime expiredAt;
  final String status;
  final int usedByUser;

  Voucher({
    required this.id,
    required this.code,
    required this.description,
    required this.discount,
    required this.minPurchase,
    required this.maxDiscount,
    required this.maxUse,
    required this.qty,
    required this.used,
    required this.expiredAt,
    required this.status,
    required this.usedByUser,
  });
  factory Voucher.fromJson(Map<String, dynamic> json) {
    return Voucher(
      id: json['id'],
      code: json['code'],
      description: json['description'],
      discount: double.tryParse(json['discount'].toString()) ?? 0,
      minPurchase: double.tryParse(json['minPurchase'].toString()) ?? 0,
      maxDiscount: double.tryParse(json['maxDiscount'].toString()) ?? 0,
      maxUse: json['maxUse'],
      qty: json['qty'],
      used: json['used'],
      expiredAt: DateTime.parse(json['expiredAt']).toLocal(),
      status: json['status'],
      usedByUser: json['usedByCustomer'],
    );
  }
}

import 'package:pos_cafe/src/resources/category/category_model.dart';
import 'package:pos_cafe/src/resources/user/user_model.dart';

class Menu {
  final int id;
  final Category category;
  final String name;
  final String description;
  final num price;
  final num discount;
  final num afterDiscount;
  final String? image;
  final bool isAvailable;
  final num rating;
  final num ratingCount;
  final bool availableOptions;
  final bool isFavorite;

  Menu({
    required this.id,
    required this.category,
    required this.name,
    required this.description,
    required this.price,
    required this.discount,
    required this.afterDiscount,
    required this.image,
    required this.isAvailable,
    required this.rating,
    required this.ratingCount,
    required this.availableOptions,
    required this.isFavorite,
  });
  factory Menu.fromJson(Map<String, dynamic> json) {
    return Menu(
      id: json['id'],
      category: Category.fromJson(json['category']),
      name: json['name'],
      description: json['description'],
      price: json['price'],
      discount: json['discount'],
      afterDiscount: json['afterDiscount'],
      image: json['image'],
      isAvailable: json['available'],
      rating: json['rating'],
      ratingCount: json['ratingCount'],
      availableOptions: json['availableOptions'],
      isFavorite: json['isFavorite'],
    );
  }
}

class MenuDetail {
  final int id;
  final Category category;
  final String name;
  final String description;
  final double price;
  final double discount;
  final double afterDiscount;
  final bool available;
  final String? image;
  final double rating;
  final int ratingCount;
  final List<MenuDetailOption>? options;

  MenuDetail({
    required this.id,
    required this.category,
    required this.name,
    required this.description,
    required this.price,
    required this.discount,
    required this.afterDiscount,
    required this.available,
    required this.image,
    required this.rating,
    required this.ratingCount,
    this.options,
  });
  factory MenuDetail.fromJson(Map<String, dynamic> json) {
    return MenuDetail(
      id: json['id'],
      category: Category.fromJson(json['category']),
      name: json['name'],
      description: json['description'],
      price: double.tryParse(json['price'].toString()) ?? 0,
      discount: double.tryParse(json['discount'].toString()) ?? 0,
      afterDiscount: double.tryParse(json['afterDiscount'].toString()) ?? 0,
      available: json['available'],
      image: json['image'],
      rating: double.tryParse(json['rating'].toString()) ?? 0,
      ratingCount: json['ratingCount'],
      options: json['options'] != null
          ? (json['options'] as List)
              .map((option) => MenuDetailOption.fromJson(option))
              .toList()
          : null,
    );
  }
  double getFinalPrice() {
    if (options == null) return afterDiscount;
    var finalPrice = options!
            .map((item) => item.checklist.isNotEmpty
                ? item.checklist.map((e) => e.price).reduce((x, y) => x + y)
                : 0.0)
            .reduce((x, y) => x + y) +
        afterDiscount;
    return finalPrice;
  }

  bool isValid() {
    if (options == null) return true;
    return options!.map((option) => option.isValid()).reduce((x, y) => x && y);
  }
}

class MenuDetailOption {
  MenuDetailOption({
    required this.id,
    required this.name,
    required this.min,
    required this.max,
    required this.items,
  });

  int id;
  String name;
  int min;
  int max;
  List<MenuDetailOptionItem> items;
  List<MenuDetailOptionItem> checklist = [];

  bool isChecklist(MenuDetailOptionItem item) {
    return checklist.any((x) => x.id == item.id);
  }

  void setChecklist(MenuDetailOptionItem item) {
    if (isChecklist(item)) {
      checklist.removeWhere((x) => x.id == item.id);
      return;
    } else if (max == 1 && checklist.isNotEmpty) {
      checklist.removeAt(0);
    } else if (checklist.length >= max) {
      return;
    }
    checklist.add(item);
  }

  bool isValid() {
    return checklist.length >= min;
  }

  factory MenuDetailOption.fromJson(Map<String, dynamic> json) {
    return MenuDetailOption(
      id: json['id'],
      name: json['name'],
      min: json['min'],
      max: json['max'],
      items: (json['items'] as List)
          .map((item) => MenuDetailOptionItem.fromJson(item))
          .toList(),
    );
  }
}

class MenuDetailOptionItem {
  MenuDetailOptionItem({
    required this.id,
    required this.name,
    required this.price,
    required this.available,
  });

  int id;
  String name;
  double price;
  bool available;

  factory MenuDetailOptionItem.fromJson(Map<String, dynamic> json) {
    return MenuDetailOptionItem(
      id: json['id'],
      name: json['name'],
      price: double.tryParse(json['price'].toString()) ?? 0,
      available: json['available'],
    );
  }
}

class MenuRating {
  final double rating;
  final String? review;
  final DateTime timestamp;
  final String? imageUrl;
  final User user;

  MenuRating({
    required this.rating,
    required this.review,
    required this.timestamp,
    required this.user,
    this.imageUrl,
  });

  factory MenuRating.formJson(Map<String, dynamic> json) {
    return MenuRating(
      rating: double.tryParse(json['rating'].toString()) ?? 0,
      review: json['review'],
      timestamp: DateTime.parse(json['timestamp']).toLocal(),
      user: User.fromJson(json['customer']),
      imageUrl: json['image'],
    );
  }
}

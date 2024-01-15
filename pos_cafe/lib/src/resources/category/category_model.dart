class Category {
  final int id;
  final String name;
  final String iconUrl;

  Category({required this.id, required this.name, required this.iconUrl});

  factory Category.fromJson(Map<String, dynamic> json) {
    final nameIcon = (json['icon'] as String).split(':');
    return Category(
      id: json['id'],
      name: json['name'],
      iconUrl:
          'https://api.iconify.design/${nameIcon[0]}/${nameIcon[1]}.svg?height=none',
    );
  }
}

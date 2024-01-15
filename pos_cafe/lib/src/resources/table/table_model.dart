class Table {
  final int id;
  final String name;
  final int capacity;
  final bool isAvailable;

  Table({
    required this.id,
    required this.name,
    required this.capacity,
    required this.isAvailable,
  });

  factory Table.fromJson(Map<String, dynamic> json) {
    return Table(
      id: json['id'],
      name: json['name'],
      capacity: json['capacity'],
      isAvailable: json['available'],
    );
  }
}

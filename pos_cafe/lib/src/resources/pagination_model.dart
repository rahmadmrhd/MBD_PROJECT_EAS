class Pagination<T> {
  final int total;
  final int pageSize;
  final int currentPage;
  List<T> data = [];

  Pagination({
    required this.total,
    required this.pageSize,
    required this.currentPage,
  });

  factory Pagination.fromJson(Map<String, dynamic> json) {
    return Pagination(
      total: json['pagination']['total'],
      pageSize: json['pagination']['pageSize'],
      currentPage: json['pagination']['current'],
    );
  }
}

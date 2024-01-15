class User {
  String name;
  String username;
  String? gender;
  DateTime? birthDate;
  String? phone;
  String? imageUrl;

  User({
    required this.name,
    required this.username,
    required this.gender,
    required this.birthDate,
    required this.phone,
    this.imageUrl,
  });
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      name: json['name'],
      username: json['username'],
      gender: json['gender'],
      birthDate: DateTime.tryParse(json['birthdate'] ?? '')?.toLocal(),
      phone: formatPhoneNumber(json['no_telp']) ?? '',
    );
  }
}

String? formatPhoneNumber(String? phoneNumberString, {String code = "62"}) {
  if (phoneNumberString == null) return null;

  final cleaned = phoneNumberString.replaceAll(RegExp(r'\D'), '');
  final regex = RegExp(r'^(62|)?(\d{1,3})(\d{3,4})(\d*)$');
  final match = regex.firstMatch(cleaned);

  if (match != null) {
    final intlCode =
        match.group(1) != null ? '(+${match.group(1)}) ' : '(+$code) ';
    return [intlCode, match.group(2), '-', match.group(3), '-', match.group(4)]
        .join();
  }

  return null;
}

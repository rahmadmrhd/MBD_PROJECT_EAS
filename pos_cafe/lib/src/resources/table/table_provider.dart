import 'package:flutter/foundation.dart';
import 'package:pos_cafe/src/resources/table/table_model.dart';
import 'package:pos_cafe/src/resources/table/table_services.dart';

class TableProvider extends ChangeNotifier {
  List<Table> list = [];

  Future getAll() async {
    try {
      list = await TableServices.get();
      notifyListeners();
    } catch (e) {
      if (kDebugMode) print(e);
    }
  }
}

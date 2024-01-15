import 'package:flutter/foundation.dart' hide Category;
import 'package:pos_cafe/src/resources/category/category_services.dart';
import 'package:pos_cafe/src/resources/category/category_model.dart';

class CategoryProvider extends ChangeNotifier {
  bool isLoading = false;
  List<Category> list = [];
  String categorySelected = 'All';
  int? get categoryId {
    if (categorySelected == 'All') {
      return null;
    }
    return list.firstWhere((e) => e.name == categorySelected).id;
  }

  bool isFirst = true;

  void onCategorySelected(String value) {
    categorySelected = value;
    notifyListeners();
  }

  Future getAll() async {
    isLoading = true;
    notifyListeners();
    try {
      var response = await CategoryServices.get();

      list = response;
      if (!list.any((e) => e.name == categorySelected)) {
        categorySelected = 'All';
      }
      isFirst = false;
      notifyListeners();
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future refresh() async {
    list.clear();
    isFirst = true;
    await getAll();
    notifyListeners();
  }
}

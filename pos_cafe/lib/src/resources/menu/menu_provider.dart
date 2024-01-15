import 'package:flutter/foundation.dart';
import 'package:pos_cafe/src/resources/menu/menu_model.dart';
import 'package:pos_cafe/src/resources/menu/menu_services.dart';

class MenuProvider extends ChangeNotifier {
  // final _pageSize = 20;
  // int _currentPage = 1;
  // bool hasMore = true;
  bool isLoading = false;
  bool isFirst = true;
  List<Menu> listMenu = [];

  Future getAll({int? categoryId, String? search}) async {
    isLoading = true;
    notifyListeners();
    try {
      var response = await MenuServices.get(
          // pageSize: _pageSize,
          // currentPage: _currentPage,
          categoryId: categoryId,
          search: search);
      // if (response.currentPage >= response.total) {
      //   hasMore = false;
      // }
      // for (var menu in response.data) {
      //   final findMenu = listMenu.firstWhereOrNull((e) => e.id == menu.id);
      //   if (findMenu != null) {
      //     continue;
      //   }
      //   listMenu.add(menu);
      // }
      listMenu = response.data;
      // _currentPage++;
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

  Future refresh({int? categoryId, String? search}) async {
    // _currentPage = 1;
    // hasMore = true;
    listMenu.clear();
    isFirst = true;
    await getAll(categoryId: categoryId, search: search);
    notifyListeners();
  }
}

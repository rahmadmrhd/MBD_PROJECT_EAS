import 'package:flutter/foundation.dart';
import 'package:pos_cafe/src/resources/menu/menu_model.dart';
import 'package:pos_cafe/src/resources/menu/menu_services.dart';

class FavoriteProvider extends ChangeNotifier {
  // final _pageSize = 20;
  // int _currentPage = 1;
  // bool hasMore = true;
  bool isLoading = false;
  bool isFirst = true;
  List<Menu> listMenu = [];

  Future getAll({int? categoryId}) async {
    isLoading = true;
    notifyListeners();
    try {
      var response = await MenuServices.getFavorite(
          // pageSize: _pageSize,
          // currentPage: _currentPage,
          );
      // if (response.currentPage >= response.total) {
      //   hasMore = false;
      // }

      listMenu = response.data;
      // _currentPage++;      isFirst = false;
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

  Future refresh({int? categoryId}) async {
    // _currentPage = 1;
    // hasMore = true;
    listMenu.clear();
    isFirst = true;
    await getAll(categoryId: categoryId);
    notifyListeners();
  }
}

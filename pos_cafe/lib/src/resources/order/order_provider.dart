import 'package:flutter/foundation.dart';
import 'package:pos_cafe/src/resources/order/order_model.dart';
import 'package:pos_cafe/src/resources/order/order_services.dart';

class OrderProvider extends ChangeNotifier {
  bool isLoading = false;
  bool isFirst = true;
  List<MyOrders> listOrder = [];

  Future getAll() async {
    isLoading = true;
    notifyListeners();
    try {
      var response = await OrderServices.get();
      listOrder = response;
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
    listOrder.clear();
    isFirst = true;
    await getAll();
    notifyListeners();
  }
}

import 'package:flutter/foundation.dart';
import 'package:pos_cafe/src/resources/user/user_model.dart';
import 'package:pos_cafe/src/resources/user/user_service.dart';

class UserProvider extends ChangeNotifier {
  User? user;
  bool isFirst = true;
  bool isLoading = false;

  Future getUser() async {
    isLoading = true;
    notifyListeners();
    try {
      user = await UserServices.getUser();
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

  Future refreshUser() async {
    user = null;
    isFirst = true;
    await getUser();
    notifyListeners();
  }

  reinitialize(Object? session) {}
}

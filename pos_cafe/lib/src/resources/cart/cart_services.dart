import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:pos_cafe/src/resources/cart/cart_model.dart';
import 'package:pos_cafe/src/resources/user/user_service.dart';
import 'package:pos_cafe/src/utils/dio.dart';

class CartServices {
  static Future<List<Cart>> get() async {
    try {
      var response = await dio.get(
        '/cart',
        options: Options(
          headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          },
        ),
      );
      return (response.data['data'] as List)
          .map((e) => Cart.fromJson(e))
          .toList();
    } catch (e) {
      rethrow;
    }
  }

  static Future<void> add(Cart cart) async {
    try {
      await dio.post(
        '/cart',
        data: {
          'menuId': cart.menuId,
          'qty': cart.quantity,
          'note': cart.note,
          'details': cart.details.isNotEmpty
              ? cart.details
                  .map((e) => e.items.map((e) => e.id))
                  .reduce((x, y) => [...x, ...y])
                  .map((e) => {'menuOptionItemId': e})
                  .toList()
              : [],
        },
        options: Options(
          headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          },
        ),
      );
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
  }

  static Future<void> edit(Cart cart) async {
    try {
      await dio.put(
        '/cart/${cart.id}',
        data: {
          'qty': cart.quantity,
          'note': cart.note,
        },
        options: Options(
          headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          },
        ),
      );
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
  }

  static Future<void> delete(int cartId) async {
    try {
      await dio.delete(
        '/cart/$cartId',
        options: Options(
          headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          },
        ),
      );
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
  }
}

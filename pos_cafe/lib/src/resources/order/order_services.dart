import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:pos_cafe/src/resources/order/order_model.dart';
import 'package:pos_cafe/src/resources/user/user_service.dart';
import 'package:pos_cafe/src/utils/dio.dart';

class OrderServices {
  static Future<void> create(Order order) async {
    try {
      await dio.post('/order',
          data: {
            'tableId': order.tableId,
            'note': order.note,
            'voucherId': order.voucherId,
            'listCartId': order.listCartId,
            'ppn': order.ppn,
          },
          options: Options(headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          }));
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
  }

  static Future<void> rateOrder(int orderId, Object order) async {
    try {
      await dio.post('/order/$orderId/rate',
          data: order,
          options: Options(headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          }));
    } catch (e) {
      rethrow;
    }
  }

  static Future<List<MyOrders>> get() async {
    try {
      var response = await dio.get('/order',
          options: Options(headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          }));
      final list = response.data['data'] as List;
      final newList = list.map((e) => MyOrders.fromJson(e)).toList();
      return newList;
    } catch (e) {
      rethrow;
    }
  }

  static Future<MyOrders> getById(int id) async {
    try {
      var response = await dio.get(
        '/order/$id',
        options: Options(
          headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          },
        ),
      );
      return MyOrders.fromJson(response.data['data']);
    } catch (e) {
      rethrow;
    }
  }

  static Future<List<OrderDetails>> getByIdDetails(int id) async {
    try {
      var response = await dio.get(
        '/order/$id/details',
        options: Options(
          headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          },
        ),
      );
      return List.from(response.data['data'])
          .map((e) => OrderDetails.fromJson(e))
          .toList();
    } catch (e) {
      rethrow;
    }
  }

  static Future<void> cancel(int id) async {
    try {
      await dio.put(
        '/order/$id',
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

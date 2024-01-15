import 'package:dio/dio.dart';
import 'package:pos_cafe/src/resources/user/user_service.dart';
import 'package:pos_cafe/src/resources/voucher/voucher_model.dart';
import 'package:pos_cafe/src/utils/dio.dart';

class VoucherServices {
  static Future<Voucher> get(String? code) async {
    try {
      final result = await dio.get('/voucher/$code',
          options: Options(headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          }));
      return Voucher.fromJson(result.data['data']);
    } catch (e) {
      rethrow;
    }
  }
}

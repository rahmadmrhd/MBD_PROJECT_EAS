import 'package:dio/dio.dart';
import 'package:pos_cafe/src/resources/table/table_model.dart';
import 'package:pos_cafe/src/resources/user/user_service.dart';
import 'package:pos_cafe/src/utils/dio.dart';

class TableServices {
  static Future<List<Table>> get() async {
    try {
      var response = await dio.get(
        '/table',
        options: Options(
          headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          },
        ),
      );
      return (response.data['data'] as List)
          .map((e) => Table.fromJson(e))
          .toList();
    } catch (e) {
      rethrow;
    }
  }
}

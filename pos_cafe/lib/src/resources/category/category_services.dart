import 'package:dio/dio.dart';
import 'package:pos_cafe/src/resources/user/user_service.dart';

import '../../utils/dio.dart';
import 'category_model.dart';

class CategoryServices {
  static Future<List<Category>> get() async {
    try {
      var response = await dio.get(
        '/category',
        options: Options(
          headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          },
        ),
      );
      final body = response.data['data'] as List;
      List<Category> list = body.map((e) => Category.fromJson(e)).toList();
      return list;
    } on DioException {
      rethrow;
    } catch (e) {
      rethrow;
    }
  }
}

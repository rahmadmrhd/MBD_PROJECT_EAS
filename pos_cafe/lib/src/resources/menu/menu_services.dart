import 'package:dio/dio.dart';
import 'package:pos_cafe/src/resources/menu/menu_model.dart';
import 'package:pos_cafe/src/resources/pagination_model.dart';
import 'package:pos_cafe/src/resources/user/user_service.dart';

import '../../utils/dio.dart';

class MenuServices {
  static Future<Pagination<Menu>> get({
    int? pageSize,
    int? currentPage,
    int? categoryId,
    String? search,
    String? sort,
  }) async {
    try {
      var response = await dio.get(
        '/menu?pageSize=$pageSize&page=$currentPage${categoryId != null ? '&categoryId=$categoryId' : ''}${search != null ? '&search=$search' : ''}',
        options: Options(
          headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          },
        ),
      );
      final data = response.data['data'] as Map<String, dynamic>;
      Pagination<Menu> list = Pagination<Menu>.fromJson(data);
      list.data =
          (data['rows'] as List).map((menu) => Menu.fromJson(menu)).toList();

      return list;
    } on DioException {
      rethrow;
    } catch (e) {
      rethrow;
    }
  }

  static Future<MenuDetail> getById(int id) async {
    try {
      var response = await dio.get(
        '/menu/$id',
        options: Options(
          headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          },
        ),
      );
      final data = response.data['data'] as Map<String, dynamic>;
      return MenuDetail.fromJson(data);
    } on DioException {
      rethrow;
    } catch (e) {
      rethrow;
    }
  }

  static Future<num> setFavorite(int id) async {
    try {
      var response = await dio.put(
        '/menu/favorite/$id',
        options: Options(
          headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          },
        ),
      );
      final data = response.data['data'] as num;
      return data;
    } on DioException {
      rethrow;
    } catch (e) {
      rethrow;
    }
  }

  static Future<Pagination<Menu>> getFavorite({
    int? pageSize,
    int? currentPage,
    String? search,
    String? sort,
  }) async {
    try {
      var response = await dio.get(
        '/menu?isFavorite=true&pageSize=$pageSize&page=$currentPage${search != null ? '&search=$search' : ''}',
        options: Options(
          headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          },
        ),
      );
      final data = response.data['data'] as Map<String, dynamic>;
      Pagination<Menu> list = Pagination<Menu>.fromJson(data);
      list.data =
          (data['rows'] as List).map((menu) => Menu.fromJson(menu)).toList();

      return list;
    } on DioException {
      rethrow;
    } catch (e) {
      rethrow;
    }
  }

  static Future<List<MenuRating>> getRating(int menuId) async {
    try {
      var response = await dio.get(
        '/menu/$menuId/rating',
        options: Options(
          headers: {
            'Authorization': 'Customer ${await UserServices.getToken()}'
          },
        ),
      );
      final data = response.data['data'] as List;
      return data.map((e) => MenuRating.formJson(e)).toList();
    } on DioException {
      rethrow;
    } catch (e) {
      rethrow;
    }
  }
}

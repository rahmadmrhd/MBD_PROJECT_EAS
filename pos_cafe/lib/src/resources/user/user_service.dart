import 'package:dio/dio.dart';
import 'package:pos_cafe/src/resources/user/user_model.dart';
import 'package:pos_cafe/src/utils/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserServices {
  static Future<dynamic> signup({
    required String name,
    required String username,
    required String password,
    required String phone,
    required String gender,
    required String birthDate,
  }) async {
    try {
      var response = await dio.post('/auth/customer', data: {
        'name': name,
        'username': username,
        'password': password,
        'noTelp': phone,
        'gender': gender,
        'birthdate': birthDate
      });
      final body = response.data['data'] as Map<String, dynamic>;

      return body;
    } on DioException {
      rethrow;
    } catch (e) {
      rethrow;
    }
  }

  static Future<void> login({
    required String username,
    required String password,
  }) async {
    try {
      var response = await dio.post('/auth/customer/login', data: {
        'username': username,
        'password': password,
      });
      final body = response.data['data'] as Map<String, dynamic>;
      final token = body['token'];
      final prefs = await SharedPreferences.getInstance();
      prefs.setString('token', token);
    } on DioException {
      rethrow;
    } catch (e) {
      rethrow;
    }
  }

  static DateTime? _lastVerify;
  static Future<String?> getToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';
      if (token.isEmpty) return null;

      if (_lastVerify != null &&
          DateTime.now().difference(_lastVerify!) <
              const Duration(minutes: 1)) {
        return token;
      }

      await dio.get(
        '/auth/customer/verify',
        options: Options(headers: {'Authorization': 'Customer $token'}),
      );
      _lastVerify = DateTime.now();
      return token;
    } catch (e) {
      return null;
    }
  }

  static Future<User?> getUser() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';
      if (token.isEmpty) return null;

      final result = await dio.get(
        '/auth/customer/current',
        options: Options(headers: {'Authorization': 'Customer $token'}),
      );
      return User.fromJson(result.data['data']);
    } catch (e) {
      return null;
    }
  }

  static Future<void> logout() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token') ?? '';
      if (token.isEmpty) return;
      await dio.delete(
        '/auth/customer/current',
        options: Options(headers: {'Authorization': 'Customer $token'}),
      );
      prefs.remove('token');
    } catch (e) {
      return;
    }
  }
}

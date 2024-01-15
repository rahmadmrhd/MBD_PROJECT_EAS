import 'package:dio/dio.dart';

final _dio = Dio(); // With default `Options`.

Dio get dio {
  _dio.options.baseUrl = 'https://7fn1bhg9-5000.asse.devtunnels.ms';
  _dio.options.connectTimeout = const Duration(seconds: 10);
  _dio.options.receiveTimeout = const Duration(seconds: 10);
  return _dio;
}

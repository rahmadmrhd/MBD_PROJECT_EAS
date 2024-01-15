import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:pos_cafe/src/components/loading_dialog.dart';
import 'package:pos_cafe/src/resources/user/user_service.dart';
import 'package:pos_cafe/src/pages/auth/signup_page.dart';
import 'package:pos_cafe/src/pages/main_page.dart';

class SigninPage extends StatefulWidget {
  const SigninPage({super.key});
  static const routeName = '/signin';

  @override
  State<SigninPage> createState() => _SigninPageState();
}

class _SigninPageState extends State<SigninPage> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool showPassword = false;

  void signin(BuildContext context) async {
    if (_formKey.currentState!.validate()) {
      try {
        loadingDialog(context);
        await UserServices.login(
            username: _usernameController.text,
            password: _passwordController.text);
        if (!mounted) return;
        Navigator.pop(context);
        Navigator.pushReplacementNamed(context, MainPage.routeName);
      } catch (e) {
        if (!mounted) return;
        Navigator.pop(context);
        dialogResult(context, false, e.toString());
      }
    }
  }

  //fungsi menampilkan dialog
  void dialogResult(BuildContext context, bool isSuccess, String msg) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(isSuccess ? 'Berhasil' : 'Gagal'),
          icon: Icon(
            isSuccess ? Icons.check : Icons.cancel,
            color: isSuccess ? Colors.green : Colors.red,
          ),
          content: Text(
            msg,
            textAlign: TextAlign.center,
          ),
        );
      },
    );
  }

  //validasi textfield tidak boleh kosong
  String? validatorNotEmpty(String? value) {
    if (value == null || value.isEmpty) {
      return 'Tidak Boleh Kosong';
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Container(
          alignment: Alignment.center,
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: SingleChildScrollView(
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  SvgPicture.string(
                    '<svg xmlns="http://www.w3.org/2000/svg" fill="#fc5b31" viewBox="0 0 32 32"><path d="M13.114 5.728c.025.153-.051.28-.306.408a3.457 3.457 0 0 0-1.63-.229c-.637.051-1.172.255-1.1.688c.1.433.713.688 1.808.586c2.674-.229 2.649-2.038 6.571-2.394c3.056-.28 4.763.662 4.992 1.808c.178.891-.56 1.757-2.776 1.936c-1.961.178-3.107-.357-3.209-.891c-.051-.28.1-.688 1.044-.79c.1.433.637.891 1.91.764C21.341 7.536 22.1 7.2 22 6.7c-.1-.535-1.07-.84-2.6-.713c-3.107.28-3.871 1.987-6.52 2.216c-1.88.173-3.408-.514-3.612-1.533c-.076-.382-.076-1.273 1.91-1.452c1.019-.076 1.834.1 1.936.509ZM3.181 16.374A5.279 5.279 0 0 0 2.01 19.99a4.206 4.206 0 0 0 1.655 3.056a4 4 0 0 0 3.362.79a11.434 11.434 0 0 0 1.5-.484a4.238 4.238 0 0 1-2.751-1.019a4.13 4.13 0 0 1-1.732-2.827a3.79 3.79 0 0 1 .614-3.006A3.977 3.977 0 0 1 7.409 15a4.806 4.806 0 0 1 3.209.942a6.95 6.95 0 0 0-.866-.866a4.1 4.1 0 0 0-3.464-.688a5.2 5.2 0 0 0-3.107 1.987Zm13.652-5.884A40.837 40.837 0 0 1 8.5 9.7c-2.263-.56-3.46-1.171-3.46-1.96c0-.331.153-.611.611-.942c-1.426.56-2.19 1.019-2.19 1.732c.076.79 1.35 1.579 3.948 2.19a39.443 39.443 0 0 0 9.347.942a38.993 38.993 0 0 0 9.344-.942c2.6-.611 3.846-1.426 3.846-2.19c0-.56-.56-1.1-1.579-1.5a.862.862 0 0 1 .408.688c0 .79-1.172 1.426-3.54 1.961a39.324 39.324 0 0 1-8.402.811m9.373 2.19a42.315 42.315 0 0 1-9.347.942a44.144 44.144 0 0 1-9.424-.942c-2.19-.56-3.362-1.172-3.769-1.808a23.186 23.186 0 0 0 2.6 7.641c.942 1.426 1.885 2.674 2.827 4.024a9.883 9.883 0 0 1 .866 2.369a4.559 4.559 0 0 0 2.6 1.732a10.611 10.611 0 0 0 4.177.611h.153a11.839 11.839 0 0 0 4.3-.611a4.869 4.869 0 0 0 2.521-1.732h.076a9.592 9.592 0 0 1 .79-2.369c.942-1.35 1.885-2.6 2.827-4.024A24.62 24.62 0 0 0 30 10.872c-.509.713-1.681 1.328-3.795 1.809Z"/></svg>',
                    height: 150,
                  ),
                  Text(
                    'Welcome Back',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 36,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                  Text(
                    'Sign to continue',
                    style: TextStyle(fontSize: 18, color: Colors.grey[500]!),
                  ),
                  const SizedBox(height: 42),
                  //form login
                  const SizedBox(height: 18),
                  TextFormField(
                    controller: _usernameController,
                    keyboardType: TextInputType.name,
                    textInputAction: TextInputAction.next,
                    // inputFormatters: [FilteringTextInputFormatter.allow(filterPattern)],
                    decoration: InputDecoration(
                      labelText: 'Username',
                      floatingLabelStyle: const TextStyle(
                        fontSize: 20,
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 18,
                      ),
                      border: OutlineInputBorder(
                        borderSide: BorderSide(
                            color: Theme.of(context)
                                .colorScheme
                                .primary
                                .withOpacity(0.5)),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderSide: BorderSide(
                          color: Theme.of(context).colorScheme.primary,
                          width: 1,
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      prefixIcon: Icon(
                        Icons.person,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ),
                    validator: validatorNotEmpty,
                  ),
                  const SizedBox(height: 18),
                  TextFormField(
                    controller: _passwordController,
                    keyboardType: TextInputType.name,
                    textInputAction: TextInputAction.next,
                    // inputFormatters: [FilteringTextInputFormatter.allow(filterPattern)],
                    decoration: InputDecoration(
                        labelText: 'Password',
                        floatingLabelStyle: const TextStyle(
                          fontSize: 20,
                        ),
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 18,
                        ),
                        border: OutlineInputBorder(
                          borderSide: BorderSide(
                              color: Theme.of(context)
                                  .colorScheme
                                  .primary
                                  .withOpacity(0.5)),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Theme.of(context).colorScheme.primary,
                            width: 1,
                          ),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        prefixIcon: Icon(
                          Icons.password_rounded,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                        suffixIcon: IconButton(
                          onPressed: () {
                            setState(() {
                              showPassword = !showPassword;
                            });
                          },
                          icon: Icon(showPassword
                              ? Icons.visibility_off
                              : Icons.visibility),
                        )),
                    obscureText: !showPassword,
                    validator: validatorNotEmpty,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      IconButton(
                        constraints: const BoxConstraints(),
                        onPressed: () {},
                        icon: Text(
                          'Forgot Password?',
                          style: TextStyle(
                            fontSize: 16,
                            color: Theme.of(context).colorScheme.primary,
                            decoration: TextDecoration.underline,
                            decorationColor:
                                Theme.of(context).colorScheme.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        minimumSize: const Size.fromHeight(50)),
                    onPressed: () {
                      signin(context);
                    },
                    child: const Text(
                      'LOGIN',
                      style: TextStyle(
                        fontSize: 24,
                        letterSpacing: 5,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        "Don't have an account?",
                      ),
                      IconButton(
                        constraints: const BoxConstraints(),
                        onPressed: () {
                          Navigator.pushNamed(context, SignupPage.routeName);
                        },
                        icon: Text(
                          'Sign Up',
                          style: TextStyle(
                            fontSize: 16,
                            color: Theme.of(context).colorScheme.primary,
                            decoration: TextDecoration.underline,
                            decorationColor:
                                Theme.of(context).colorScheme.primary,
                          ),
                        ),
                      ),
                    ],
                  )
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

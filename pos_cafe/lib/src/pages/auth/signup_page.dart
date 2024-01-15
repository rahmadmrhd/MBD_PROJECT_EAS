import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:intl/intl.dart';
import 'package:pos_cafe/src/components/loading_dialog.dart';
import 'package:pos_cafe/src/formater/phone_formater.dart';
import 'package:pos_cafe/src/resources/user/user_service.dart';

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});
  static const routeName = '/signup';

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final _formKey = GlobalKey<FormState>();

  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _phoneController = TextEditingController();
  final TextEditingController _dateController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();
  bool showPassword = false;
  String? gender;
  DateTime? _pickedDate;

  void signup(BuildContext context) async {
    if (_formKey.currentState!.validate()) {
      loadingDialog(context);
      try {
        await UserServices.signup(
          name: _nameController.text,
          username: _usernameController.text,
          password: _passwordController.text,
          phone: _phoneController.text.replaceAll(RegExp(r'-|(\(\+62\))'), ''),
          gender: gender ?? 'L',
          birthDate: DateFormat('yyyy-MM-dd').format(_pickedDate!),
        );
        if (!mounted) return;
        Navigator.pop(context);
        dialogResult(context, true, 'Sign Up Success\nRedirecting...');
        Future.delayed(const Duration(seconds: 1), () {
          Navigator.pop(context);
          Navigator.pop(context);
        });
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
      return 'Cannot be empty';
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(
      //   backgroundColor: Colors.transparent,
      //   forceMaterialTransparency: true,
      //   foregroundColor: Theme.of(context).colorScheme.primary,
      // ),
      body: SafeArea(
        child: Container(
          alignment: Alignment.center,
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: SingleChildScrollView(
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  Text(
                    'Create Account',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 36,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.primary,
                    ),
                  ),
                  Text(
                    'Create a new account',
                    style: TextStyle(fontSize: 18, color: Colors.grey[500]!),
                  ),
                  const SizedBox(height: 42),
                  TextFormField(
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    controller: _nameController,
                    keyboardType: TextInputType.name,
                    textInputAction: TextInputAction.next,
                    // inputFormatters: [FilteringTextInputFormatter.allow(filterPattern)],
                    decoration: InputDecoration(
                      labelText: 'Name',
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
                    autovalidateMode: AutovalidateMode.onUserInteraction,
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
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    textInputAction: TextInputAction.next,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      PhoneTextInputFormatter()
                    ],
                    decoration: InputDecoration(
                      labelText: 'Phone',
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
                        Icons.phone_android,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ),
                    validator: validatorNotEmpty,
                  ),
                  const SizedBox(height: 18),
                  DropdownButtonFormField(
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    value: gender,
                    decoration: InputDecoration(
                      labelText: 'Gender',
                      floatingLabelStyle: const TextStyle(
                        fontSize: 20,
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 24,
                        vertical: 14,
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
                      prefixIcon: gender == 'L' || gender == 'P'
                          ? Icon(
                              gender == 'L' ? Icons.male : Icons.female,
                              color: Theme.of(context).colorScheme.primary,
                            )
                          : Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: SvgPicture.network(
                                'https://api.iconify.design/icons8/gender.svg',
                                theme: SvgTheme(
                                  currentColor:
                                      Theme.of(context).colorScheme.primary,
                                ),
                              ),
                            ),
                    ),
                    items: const [
                      DropdownMenuItem(
                        value: "L",
                        child: Text('Male'),
                      ),
                      DropdownMenuItem(
                        value: "P",
                        child: Text('Female'),
                      )
                    ],
                    onChanged: (value) {
                      setState(() {
                        gender = value;
                      });
                    },
                    validator: validatorNotEmpty,
                  ),
                  const SizedBox(height: 18),
                  TextFormField(
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    controller: _dateController,
                    readOnly: true,
                    decoration: InputDecoration(
                      labelText: 'Birth Date',
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
                              .withOpacity(0.5),
                        ),
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
                        Icons.date_range_rounded,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                    ),
                    validator: (value) => validatorNotEmpty(value),
                    onTap: () async {
                      DateTime? pickedDate = await showDatePicker(
                          context: context,
                          initialEntryMode: DatePickerEntryMode.calendarOnly,
                          initialDate: _pickedDate,
                          firstDate: DateTime(1970),
                          lastDate: DateTime(DateTime.now().year - 13));
                      _dateController.text = pickedDate != null
                          ? DateFormat('dd MMMM yyyy').format(pickedDate)
                          : _dateController.text;
                      setState(() {
                        _pickedDate = pickedDate ?? _pickedDate;
                      });
                    },
                  ),
                  const SizedBox(height: 18),
                  TextFormField(
                    autovalidateMode: AutovalidateMode.onUserInteraction,
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
                              .withOpacity(0.5),
                        ),
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
                        icon: Icon(
                          showPassword
                              ? Icons.visibility_off
                              : Icons.visibility,
                        ),
                      ),
                    ),
                    obscureText: !showPassword,
                    validator: validatorNotEmpty,
                  ),
                  const SizedBox(height: 18),
                  TextFormField(
                    autovalidateMode: AutovalidateMode.onUserInteraction,
                    controller: _confirmPasswordController,
                    keyboardType: TextInputType.name,
                    textInputAction: TextInputAction.next,
                    // inputFormatters: [FilteringTextInputFormatter.allow(filterPattern)],
                    decoration: InputDecoration(
                      labelText: 'Confirm Password',
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
                              .withOpacity(0.5),
                        ),
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
                        icon: Icon(
                          showPassword
                              ? Icons.visibility_off
                              : Icons.visibility,
                        ),
                      ),
                    ),
                    obscureText: !showPassword,
                    validator: (value) {
                      if (value != _passwordController.text) {
                        return 'Password Not Match';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 36),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).colorScheme.primary,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        minimumSize: const Size.fromHeight(50)),
                    onPressed: () {
                      signup(context);
                    },
                    child: const Text(
                      'CREATE ACCOUNT',
                      style: TextStyle(
                        fontSize: 18,
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
                        "Already have an account?",
                      ),
                      IconButton(
                        constraints: const BoxConstraints(),
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        icon: Text(
                          'Sign In',
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

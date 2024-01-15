/// Rahmad Maulana
/// 1462200017
///
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:pos_cafe/src/resources/user/user_model.dart';
import 'package:pos_cafe/src/resources/user/user_service.dart';
import 'package:pos_cafe/src/pages/auth/signin_page.dart';
import 'package:skeletons/skeletons.dart';

import '../components/error_dialog.dart';
import '../components/loading_dialog.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({super.key, required this.onBack});
  final Function() onBack;

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  late Future<User?> data;

  _ProfilePageState() {
    data = UserServices.getUser();
  }

  void logout(BuildContext context) async {
    // memverifikasi apakah user ingin keluar
    final result = await showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          icon: const Icon(
            Icons.warning,
            color: Colors.amber,
          ),
          title: const Text(
            'Logout',
          ),
          content: const Text(
            'Apakah anda yakin ingin keluar?',
          ),
          actions: [
            TextButton(
              child: const Text('Tidak'),
              onPressed: () => Navigator.pop(context, false),
            ),
            TextButton(
              child: const Text('Ya'),
              onPressed: () => Navigator.pop(context, true),
            ),
          ],
        );
      },
    );
    if (!result) return;
    if (mounted) loadingDialog(context);
    await UserServices.logout();
    if (!mounted) return;
    
    Navigator.pop(context);
    Navigator.pushReplacementNamed(context, SigninPage.routeName);
  }

  @override
  Widget build(BuildContext context) {
    //menampilkan data user
    return PopScope(
      canPop: false,
      onPopInvoked: (value) => widget.onBack(),
      child: Scaffold(
        extendBodyBehindAppBar: true,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          foregroundColor: Theme.of(context).colorScheme.onPrimary,
        ),
        body: FutureBuilder(
          future: data,
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return Column(
                children: [
                  Container(
                    decoration: BoxDecoration(
                      borderRadius: const BorderRadius.only(
                        bottomLeft: Radius.circular(50),
                        bottomRight: Radius.circular(50),
                      ),
                      color: Theme.of(context).colorScheme.primary,
                    ),
                    alignment: Alignment.center,
                    padding: const EdgeInsets.only(
                        top: 50, left: 10, right: 10, bottom: 25),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        //header
                        SkeletonAvatar(
                          style: SkeletonAvatarStyle(
                            height: 150,
                            width: 150,
                            borderRadius: BorderRadius.circular(75),
                          ),
                        ),
                        const SizedBox(height: 24),
                        const SkeletonLine(
                          style: SkeletonLineStyle(
                            width: 200,
                            alignment: Alignment.center,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const SkeletonLine(
                          style: SkeletonLineStyle(
                            width: 150,
                            alignment: Alignment.center,
                          ),
                        ),
                      ],
                    ),
                  ),
                  //menampilkan informasi user
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 36),
                      child: ListView(
                        children: const [
                          ListTile(
                            tileColor: Colors.white,
                            leading: SkeletonAvatar(),
                            title: SkeletonLine(),
                            subtitle: SkeletonLine(),
                          ),
                          ListTile(
                            tileColor: Colors.white,
                            leading: SkeletonAvatar(),
                            title: SkeletonLine(),
                            subtitle: SkeletonLine(),
                          ),
                          SizedBox(height: 8),
                          ListTile(
                            tileColor: Colors.white,
                            leading: SkeletonAvatar(),
                            title: SkeletonLine(),
                            subtitle: SkeletonLine(),
                          ),
                          SizedBox(height: 8),
                          ListTile(
                            tileColor: Colors.white,
                            leading: SkeletonAvatar(),
                            title: SkeletonLine(),
                            subtitle: SkeletonLine(),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 18),
                ],
              );
            } else if (snapshot.hasError) {
              //menampilkan pesan error
              return ErrorDialog(
                onTry: () {
                  setState(() {
                    data = UserServices.getUser();
                  });
                },
                msgError: snapshot.error.toString(),
              );
            } else {
              final user = snapshot.data!;
              return RefreshIndicator(
                onRefresh: () async {
                  setState(() {
                    data = UserServices.getUser();
                  });
                },
                child: Column(
                  children: [
                    Container(
                      decoration: BoxDecoration(
                        borderRadius: const BorderRadius.only(
                          bottomLeft: Radius.circular(50),
                          bottomRight: Radius.circular(50),
                        ),
                        color: Theme.of(context).colorScheme.primary,
                      ),
                      alignment: Alignment.center,
                      padding: const EdgeInsets.only(
                          top: 56, left: 10, right: 10, bottom: 25),
                      child: Column(
                        children: [
                          //header
                          ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              shape: const CircleBorder(),
                              fixedSize: const Size(150, 150),
                              padding: const EdgeInsets.all(0),
                              backgroundColor: Colors.white,
                            ),
                            onPressed: () {},
                            child: user.imageUrl == null
                                ? Text(
                                    user.username.substring(0, 1).toUpperCase(),
                                    style: TextStyle(
                                      color:
                                          Theme.of(context).colorScheme.primary,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 88,
                                    ),
                                  )
                                : CircleAvatar(
                                    radius: 75,
                                    foregroundImage:
                                        NetworkImage(user.imageUrl!),
                                  ),
                          ),
                          const SizedBox(height: 24),
                          Text(
                            user.name,
                            style: const TextStyle(
                                fontWeight: FontWeight.w800,
                                fontSize: 24,
                                color: Colors.white),
                          ),
                          Text(
                            user.username,
                            style: const TextStyle(
                              fontWeight: FontWeight.normal,
                              fontSize: 18,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                    //menampilkan informasi user
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: SingleChildScrollView(
                          child: Column(
                            children: [
                              const SizedBox(height: 24),
                              ListTile(
                                tileColor: Colors.white,
                                leading: Icon(user.gender == 'P'
                                    ? Icons.female
                                    : Icons.male),
                                title: const Text(
                                  'Gender',
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16),
                                ),
                                subtitle: Text(
                                  user.gender == 'P' ? 'Female' : 'Male',
                                ),
                              ),
                              const SizedBox(height: 8),
                              ListTile(
                                tileColor: Colors.white,
                                leading: const Icon(Icons.date_range_rounded),
                                title: const Text(
                                  'Birthdate',
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16),
                                ),
                                subtitle: Text(
                                  DateFormat('dd MMMM yyyy')
                                      .format(user.birthDate ?? DateTime.now()),
                                ),
                              ),
                              const SizedBox(height: 8),
                              ListTile(
                                tileColor: Colors.white,
                                leading: const Icon(Icons.phone_android),
                                title: const Text(
                                  'Phone',
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16),
                                ),
                                subtitle: Text(
                                  user.phone ?? '',
                                ),
                              ),
                              const SizedBox(height: 8),
                              //tombol logout
                              GestureDetector(
                                onTap: () => logout(context),
                                child: const ListTile(
                                  tileColor: Colors.white,
                                  iconColor: Colors.red,
                                  textColor: Colors.red,
                                  leading: Icon(Icons.logout),
                                  title: Text(
                                    'Logout',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 16),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),
                  ],
                ),
              );
            }
          },
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import 'package:intl/intl.dart';
import 'package:pos_cafe/src/resources/menu/menu_model.dart';
import 'package:pos_cafe/src/resources/menu/menu_services.dart';
import 'package:skeletons/skeletons.dart';

class RatingPage extends StatefulWidget {
  const RatingPage({super.key});
  static const routeName = '/rating';

  @override
  State<RatingPage> createState() => _RatingPageState();
}

class _RatingPageState extends State<RatingPage> {
  Future<List<MenuRating>>? futureMenuRating;
  @override
  Widget build(BuildContext context) {
    final menuId = ModalRoute.of(context)!.settings.arguments as int;
    futureMenuRating ??= MenuServices.getRating(menuId);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rating'),
      ),
      body: FutureBuilder(
        future: futureMenuRating,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return ListView.builder(
              itemCount: 2,
              itemBuilder: (context, index) {
                return Card(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(),
                    child: Container(
                      color: Theme.of(context).colorScheme.background,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 12),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          SkeletonAvatar(
                            style: SkeletonAvatarStyle(
                              width: 48,
                              height: 48,
                              borderRadius: BorderRadius.circular(30),
                            ),
                          ),
                          const SizedBox(width: 16),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Expanded(
                                      child: SkeletonLine(),
                                    ),
                                    SizedBox(width: 16),
                                    SkeletonLine(
                                      style: SkeletonLineStyle(
                                        width: 100,
                                      ),
                                    )
                                  ],
                                ),
                                SizedBox(height: 4),
                                SkeletonLine(
                                  style: SkeletonLineStyle(
                                    width: 150,
                                    height: 24,
                                  ),
                                ),
                                SizedBox(height: 4),
                                SkeletonLine(),
                                SizedBox(height: 4),
                                SkeletonLine(),
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                );
              },
            );
          }
          if (snapshot.hasError) {
            return Center(child: Text(snapshot.error.toString()));
          } else {
            final listRating = snapshot.data!;
            return ListView.builder(
              itemCount: listRating.length,
              itemBuilder: (context, index) {
                final rating = listRating[index];
                return Card(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(),
                    child: Container(
                      color: Theme.of(context).colorScheme.background,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 12),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          (rating.user.imageUrl ?? '').isNotEmpty
                              ? Container(
                                  clipBehavior: Clip.antiAliasWithSaveLayer,
                                  width: 48,
                                  height: 48,
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(30),
                                    image: DecorationImage(
                                      fit: BoxFit.cover,
                                      image:
                                          NetworkImage(rating.user.imageUrl!),
                                    ),
                                  ),
                                )
                              : CircleAvatar(
                                  radius: 24,
                                  backgroundColor:
                                      Theme.of(context).colorScheme.primary,
                                  child: Text(
                                    rating.user.username
                                        .substring(0, 1)
                                        .toUpperCase(),
                                    style: TextStyle(
                                      color: Theme.of(context)
                                          .colorScheme
                                          .onPrimary,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 20,
                                    ),
                                  ),
                                ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Expanded(
                                      child: Text(
                                        rating.user.username,
                                        style: const TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        maxLines: 2,
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    Text(
                                      DateFormat('dd MMMM yyyy HH:mm').format(
                                        rating.timestamp,
                                      ),
                                    )
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    RatingBarIndicator(
                                      rating: rating.rating,
                                      itemBuilder: (context, index) => Icon(
                                        Icons.star,
                                        color: Colors.amber[600],
                                      ),
                                      itemCount: 5,
                                      itemSize: 18.0,
                                      unratedColor: Colors.amber.withAlpha(50),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      rating.rating.toString(),
                                      style: const TextStyle(
                                          fontSize: 14,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ],
                                ),
                                if (rating.review != null)
                                  const SizedBox(height: 4),
                                if (rating.review != null)
                                  Text(
                                    rating.review!,
                                    style: const TextStyle(fontSize: 14),
                                  ),
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                  ),
                );
              },
            );
          }
        },
      ),
    );
  }
}

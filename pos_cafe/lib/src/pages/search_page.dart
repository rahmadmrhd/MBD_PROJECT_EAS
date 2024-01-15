import 'package:flutter/material.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({super.key});
  static const routeName = '/search';

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  bool _isEmpty = true;
  final TextEditingController _searchController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Theme.of(context).colorScheme.onPrimary,
        // shadowColor: Colors.black87,
        elevation: 0,
        titleSpacing: 0,
        title: Stack(
          children: [
            TextField(
              controller: _searchController,
              autofocus: true,
              keyboardType: TextInputType.text,
              textAlign: TextAlign.left,
              textInputAction: TextInputAction.search,
              maxLines: 1,
              decoration: InputDecoration(
                filled: true,
                fillColor: Colors.grey[200]!,
                contentPadding:
                    const EdgeInsets.only(left: 12, right: 42, bottom: 16),
                focusedBorder: const UnderlineInputBorder(
                  borderSide: BorderSide(
                    color: Colors.blue,
                    width: 2,
                  ),
                  borderRadius: BorderRadius.all(
                    Radius.circular(8),
                  ),
                ),
                border: const UnderlineInputBorder(
                  borderSide: BorderSide(
                    color: Colors.transparent,
                    width: 0,
                  ),
                  borderRadius: BorderRadius.all(
                    Radius.circular(8),
                  ),
                ),
                labelText: "Search Menu",
                hintText: "Search Menu",
                floatingLabelBehavior: FloatingLabelBehavior.never,
              ),
              onChanged: (value) {
                if (_isEmpty == value.isEmpty) return;
                setState(() {
                  _isEmpty = value.isEmpty;
                });
              },
            ),
            if (!_isEmpty)
              Positioned(
                right: 0,
                child: Row(
                  children: [
                    IconButton(
                      splashRadius: 1,
                      onPressed: () {
                        _searchController.clear();
                        setState(() {
                          _isEmpty = true;
                        });
                      },
                      icon: const Icon(Icons.close,
                          color: Colors.black87, size: 18),
                    ),
                  ],
                ),
              ),
          ],
        ),
        actions: [
          const SizedBox(width: 6),
          IconButton(
            tooltip: "Search",
            onPressed: () {},
            icon: const Icon(Icons.search),
          ),
          IconButton(
            tooltip: "Filter",
            onPressed: () {},
            icon: const Icon(Icons.filter_alt),
          ),
          const SizedBox(width: 12),
        ],
      ),
    );
  }
}

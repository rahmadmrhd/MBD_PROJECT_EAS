import 'package:flutter/material.dart';

class NoteBox extends StatefulWidget {
  const NoteBox({super.key, required this.setNote, required this.note});
  final void Function(String value) setNote;
  final String? note;

  @override
  State<NoteBox> createState() => _NoteBoxState();
}

class _NoteBoxState extends State<NoteBox> {
  final TextEditingController _noteController = TextEditingController();
  @override
  void initState() {
    super.initState();
    if (widget.note != null) {
      _noteController.text = widget.note!;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding:
          EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: Container(
        height: 220,
        color: Colors.white,
        padding: const EdgeInsets.all(12),
        child: Column(
          children: [
            SizedBox(
              width: MediaQuery.of(context).size.width,
              height: 50,
              child: Stack(
                children: [
                  const Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        'Note',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Divider()
                    ],
                  ),
                  Positioned(
                    right: 8,
                    bottom: 8,
                    child: IconButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      icon: const Icon(Icons.close),
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: TextField(
                maxLines: 3,
                controller: _noteController,
              ),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                shape: const RoundedRectangleBorder(),
                fixedSize: Size(MediaQuery.of(context).size.width, 48),
                backgroundColor: Theme.of(context).colorScheme.primary,
                foregroundColor: Theme.of(context).colorScheme.onPrimary,
              ),
              onPressed: () {
                widget.setNote(_noteController.text);
                Navigator.pop(context);
              },
              child: const Text('Done', style: TextStyle()),
            )
          ],
        ),
      ),
    );
  }
}

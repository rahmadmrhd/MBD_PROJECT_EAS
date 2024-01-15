import 'package:flutter/foundation.dart';
import 'package:pos_cafe/src/resources/cart/cart_model.dart';
import 'package:collection/collection.dart';
import 'package:pos_cafe/src/resources/cart/cart_services.dart';

class CartProvider extends ChangeNotifier {
  List<Cart> list = [];

  double get totalPriceAfterDiscount {
    return list.fold(0.0,
        (sum, item) => sum + (item.totalPriceAfterDiscount * item.quantity));
  }

  double get totalPrice {
    return list.fold(
        0.0, (sum, item) => sum + (item.totalPrice * item.quantity));
  }

  int get totalOrder {
    return list.fold(0, (sum, item) => sum + item.quantity);
  }

  int get count => list.length;

  int getCountByMenu(int menuId) {
    final listMenu =
        list.where((x) => x.menuId == menuId).map((e) => e.quantity);
    if (listMenu.isEmpty) return 0;
    return listMenu.reduce((a, b) => a + b);
  }

  void clear() {
    list = [];
    notifyListeners();
  }

  Future getAll() async {
    try {
      list = await CartServices.get();
      notifyListeners();
    } catch (e) {
      if (kDebugMode) print(e);
    }
  }

  Future add(Cart cart) async {
    if (cart.details.isEmpty) {
      final findCart = list.firstWhereOrNull(
          (x) => x.menuId == cart.menuId && x.details.isEmpty);
      if (findCart != null) {
        findCart.quantity += cart.quantity;
        await CartServices.edit(findCart);
      } else {
        list.add(cart);
        await CartServices.add(cart);
      }
    } else {
      final listCart = list
          .where((x) => x.menuId == cart.menuId && x.details.isNotEmpty)
          .toList();
      if (listCart.isEmpty) {
        list.add(cart);
        await CartServices.add(cart);
      } else {
        final findCart = listCart.firstWhereOrNull((x) {
          final listItemInListCart = x.details
              .map((e) => e.items.map((e) => e.itemName).toList())
              .reduce((value, element) => [...value, ...element])
              .toList();
          final listItemInCart = cart.details
              .map((e) => e.items.map((e) => e.itemName).toList())
              .reduce((value, element) => [...value, ...element])
              .toList();
          if (const DeepCollectionEquality()
              .equals(listItemInListCart, listItemInCart)) {
            return true;
          }
          return false;
        });

        if (findCart != null) {
          findCart.quantity += cart.quantity;
          await CartServices.edit(findCart);
        } else {
          list.add(cart);
          await CartServices.add(cart);
        }
      }
    }
    notifyListeners();
    getAll();
  }

  Future updateQty(Cart cart) async {
    await CartServices.edit(cart);
    getAll();
  }

  Future remove(Cart cart, [void Function()? onEmpty]) async {
    list.remove(cart);
    await CartServices.delete(cart.id!);
    notifyListeners();
    await getAll();
    if (list.isEmpty) {
      onEmpty?.call();
    }
  }
}

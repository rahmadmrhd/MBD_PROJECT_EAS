import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import db from "../../app/database";
import { Cart } from "./cart-model";
import cartValidations from "./cart-validation";
import validate from "../../app/validation";
import { Request, Response } from "express";
import ResponseError from "../../responses/response-error";
import { currencyFormat, percentFormat } from "../../app/formatter";

namespace cartServices {
  export const getAll = async (res: Response) => {
    const [data] = await db.query<RowDataPacket[]>(
      `SELECT * FROM cart_view WHERE customerId = ?`,
      [res.locals.customer.id]
    );
    const newData: any[] = [];

    data.forEach((cart) => {
      const findMenu = newData.find((x) => x.id === cart.id);
      if (!findMenu) {
        const details: any[] = [];

        if (cart.optionName) {
          const findOption = details.find(
            (x: any) => x.optionName === cart.optionName
          );
          if (!findOption) {
            details.push({
              optionName: cart.optionName,
              items: [
                {
                  optionItemId: cart.optionItemId,
                  optionItemName: cart.optionItemName,
                  optionItemPrice: cart.optionItemPrice,
                },
              ],
            });
          } else {
            findOption.items.push({
              optionItemId: cart.optionItemId,
              optionItemName: cart.optionItemName,
              optionItemPrice: cart.optionItemPrice,
            });
          }
        }
        newData.push({
          id: cart.id,
          menuId: cart.menuId,
          menuName: cart.menuName,
          menuPrice: cart.menuPrice,
          menuDiscount: cart.menuDiscount,
          menuAfterDiscount:
            cart.menuPrice - cart.menuPrice * cart.menuDiscount,
          menuImage: cart.menuImage,
          qty: cart.qty,
          note: cart.note,
          details: details,
        });
      } else {
        if (cart.optionName) {
          const findOption = findMenu.details.find(
            (x: any) => x.optionName === cart.optionName
          );
          if (!findOption) {
            findMenu.details.push({
              optionName: cart.optionName,
              items: [
                {
                  optionItemId: cart.optionItemId,
                  optionItemName: cart.optionItemName,
                  optionItemPrice: cart.optionItemPrice,
                },
              ],
            });
          } else {
            findOption.items.push({
              optionItemId: cart.optionItemId,
              optionItemName: cart.optionItemName,
              optionItemPrice: cart.optionItemPrice,
            });
          }
        }
      }
    });
    return newData;
  };

  export const getById = async (conn: PoolConnection, id: number) => {
    const [data] = await conn.query<RowDataPacket[]>(
      `SELECT * FROM cart_view WHERE id = ?`,
      [id]
    );
    const details: any[] = [];
    const firstCart = data[0];
    data.forEach((cart) => {
      if (cart.optionName) {
        const findOption = details.find(
          (x: any) => x.optionName === cart.optionName
        );
        if (!findOption) {
          details.push({
            optionName: cart.optionName,
            items: [
              {
                optionItemId: cart.optionItemId,
                optionItemName: cart.optionItemName,
                optionItemPrice: cart.optionItemPrice,
              },
            ],
          });
        } else {
          findOption.items.push({
            optionItemId: cart.optionItemId,
            optionItemName: cart.optionItemName,
            optionItemPrice: cart.optionItemPrice,
          });
        }
      }
    });
    const newData = {
      id: firstCart.id,
      menuId: firstCart.menuId,
      menuName: firstCart.menuName,
      menuPrice: firstCart.menuPrice,
      menuDiscount: firstCart.menuDiscount,
      menuAfterDiscount:
        firstCart.menuPrice - firstCart.menuPrice * firstCart.menuDiscount,
      menuImage: firstCart.menuImage,
      qty: firstCart.qty,
      note: firstCart.note,
      details: details,
    };

    return newData;
  };
  export const create = async (req: Request, res: Response) => {
    const conn = await db.getConnection();
    await conn.beginTransaction();
    try {
      const createRequest = validate(cartValidations.create, req);
      const [newCart] = await conn.query<ResultSetHeader>(
        "INSERT INTO cart (customer_id, menu_id, qty, note) VALUES (?,?,?,?)",
        [
          res.locals.customer.id,
          createRequest.menuId,
          createRequest.qty,
          createRequest.note,
        ]
      );

      createRequest.details?.forEach(async (item) => {
        await conn.query<ResultSetHeader>(
          "INSERT INTO cart_detail (cart_id, menu_option_item_id) VALUES (?,?)",
          [newCart.insertId, item.menuOptionItemId]
        );
      });
      conn.commit();
    } catch (err) {
      conn.rollback();
      throw err;
    }
  };
  export const update = async (req: Request<{ id: number }>, res: Response) => {
    const updateRequest = validate(cartValidations.update, req);
    const [newCart] = await db.query<ResultSetHeader>(
      "UPDATE cart SET qty = ?, note = ? WHERE id = ?",
      [updateRequest.qty, updateRequest.note, req.params.id]
    );
  };
  export const remove = async (req: Request<{ id: number }>, res: Response) => {
    const [newCart] = await db.query<ResultSetHeader>(
      "DELETE FROM cart  WHERE id = ?",
      [req.params.id]
    );
  };
}
export default cartServices;

import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import db from "../../app/database";
import { Order, OrderDetail, OrderDetailOption } from "./order-model";
import orderValidations from "./order-validation";
import validate from "../../app/validation";
import { Request, Response } from "express";
import ResponseError from "../../responses/response-error";
import {
  currencyFormat,
  dateTimeFormater,
  percentFormat,
} from "../../app/formatter";
import generateString from "../../app/randomString";
import { Cart } from "../cart/cart-model";
import cartServices from "../cart/cart-services";

const createOrderDetail = async (
  conn: PoolConnection,
  cartId: number,
  orderId: number
) => {
  const cart = await cartServices.getById(conn, cartId);

  const [newDetail] = await conn.query<ResultSetHeader>(
    "INSERT INTO order_detail (order_id, menu_id, name_menu, price, discount, image, qty, note) VALUES (?,?,?,?,?,?,?,?)",
    [
      orderId,
      cart.menuId,
      cart.menuName,
      cart.menuPrice,
      cart.menuDiscount,
      cart.menuImage,
      cart.qty,
      cart.note,
    ]
  );
  cart.details = cart.details
    .map((x) => x.items.map((y: any) => ({ optionName: x.optionName, ...y })))
    .reduce((a, b) => [...a, ...b], []);
  for (let j = 0; j < cart.details.length; j++) {
    await createOrderDetailItem(conn, cart.details[j], newDetail.insertId);
  }
  await conn.query<ResultSetHeader>("DELETE FROM cart WHERE id = ?", [cartId]);
};
const createOrderDetailItem = async (
  conn: PoolConnection,
  option: any,
  detailId: number
) => {
  const [newItem] = await conn.query<ResultSetHeader>(
    "INSERT INTO order_detail_option (order_detail_id, name_option, name_option_item, price) VALUES (?,?,?,?)",
    [detailId, option.optionName, option.optionItemName, option.optionItemPrice]
  );
};

namespace orderServices {
  export const getAll = async (req: Request, customerId?: any) => {
    let searchQuery = " WHERE (0=0) ";
    // console.log(req.query);

    if (req.query.status)
      searchQuery += ` AND status = '${req.query.status
        .toString()
        .toUpperCase()}' `;
    if (customerId) searchQuery += ` AND customerId = '${customerId}' `;
    if (req.query.search)
      searchQuery += ` AND (order_code LIKE '%${req.query.search}%' \ 
                      OR customerName LIKE '%${req.query.search}%' \
                      OR table LIKE '%${req.query.search}%') `;
    if (req.query.sort) {
      const [sortBy, sort] = (req.query.sort as string).split(":");
      searchQuery += ` ORDER BY ${sortBy} ${sort} `;
    }
    // console.log({ searchQuery });
    const [count] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) count FROM order_view ${searchQuery}`
    );

    const total = (count as any)[0].count;
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);

    if (pageSize) searchQuery += ` LIMIT ${(page - 1) * pageSize},${pageSize} `;

    const [data] = await db.query<Order[]>(
      `SELECT * FROM order_view ${searchQuery}`
    );
    const listOrder: {
      id: number;
      orderCode: string;
      customer?: {
        name: string | null;
        noTelp: string | null;
        image: string | null;
      };
      employeeName: string | null;
      tableName: string;
      status: string;
      timestamp: string;
    }[] = [];
    data.forEach((order) => {
      listOrder.push({
        id: order.id!,
        orderCode: order.orderCode!,
        customer: {
          name: order.customerName ?? null,
          noTelp: order.customerNoTelp ?? null,
          image: order.customerImage ?? null,
        },
        employeeName: order.employeeName ?? null,
        tableName: order.tableName!,
        status: {
          WAITING_CONFIRMATION: "Waiting Confirmation",
          IN_PROCESS: "In Process",
          DONE: "Done",
          CANCELED: "Canceled",
        }[order.status!]!,
        timestamp: order.timestamp!,
      });
    });
    return {
      pagination: {
        current: page,
        pageSize,
        total: Math.ceil(total / pageSize),
      },
      rows: listOrder,
    };
  };

  export const getAllInCustomer = async (req: Request, res: Response) => {
    let searchQuery = " WHERE (0=0) ";
    searchQuery += ` AND customerId = '${res.locals.customer.id}' `;
    searchQuery += ` ORDER BY timestamp DESC `;

    const [listId] = await db.query<RowDataPacket[]>(
      `SELECT id FROM order_view ${searchQuery}`
    );
    const newData: any[] = [];
    for (let i = 0; i < listId.length; i++) {
      const item = listId[i];
      try {
        const result: any = await getById(item.id);
        if (result) {
          result.status = {
            WAITING_CONFIRMATION: "Waiting Confirmation",
            IN_PROCESS: "In Process",
            DONE: "Done",
            CANCELED: "Canceled",
          }[result.status as string]!;
          newData.push(result);
        }
        if (result.details.length > 1) {
          result.details = result.details.reduce((prev: any, curr: any) => {
            try {
              const indexMenu = prev.findIndex(
                (item: any) => item.menuId === curr.menuId
              );
              if (indexMenu < 0) {
                return [...prev, curr];
              }
              prev[indexMenu].qty += curr.qty;
              return prev;
            } catch {
              if (prev.menuId == curr.menuId) {
                prev.qty += curr.qty;
                return [prev];
              }
              return [prev, curr];
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    return newData;
  };
  export const getAllWaitingList = async (req: Request) => {
    const [count] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) count FROM order_view WHERE status = 'WAITING_CONFIRMATION'`
    );
    return count[0].count;
  };
  export const getById = async (id: number) => {
    const [data] = await db.query<any[]>(
      "select * from `order_detail_view` WHERE id = ?",
      [id]
    );
    if (data.length <= 0) throw new ResponseError(404, "Order not found");

    const order = data[0];
    let subtotal = 0;
    const newData: any = {
      id: order.id!,
      orderCode: order.orderCode!,
      customer: {
        name: order.customerName ?? null,
        noTelp: order.customerNoTelp ?? null,
        image: order.customerImage ?? null,
      },
      employee: {
        name: order.employeeName ?? null,
        image: order.employeeImage ?? null,
      },
      note: order.note,
      ppn: order.ppn,
      tableName: order.tableName!,
      status: order.status!,
      timestamp: order.timestamp,
      voucherCode: order.voucherCode ?? null,
      voucherDiscount: order.voucherDiscount ?? 0,
      rating: order.rating,
      review: order.review,
    };
    let detailsMap: any = new Map<string, any>();

    data.forEach((menu) => {
      const detailId = menu.detailId;

      if (detailId) {
        if (!detailsMap.has(detailId)) {
          detailsMap.set(detailId, {
            id: menu.detailId,
            menuId: menu.menuId,
            menuName: menu.menuName,
            price: menu.menuPrice,
            discount: menu.menuDiscount,
            afterDiscount: menu.menuPriceAfterDiscount,
            subtotal: menu.menuPriceAfterDiscount,
            total: 0,
            image: menu.menuImage,
            qty: menu.menuQty,
            note: menu.menuNote,
            options: new Map<string, any>(),
          });
        }
        const getMenu = detailsMap.get(detailId);
        if (!menu.optionName && !menu.optionItem) {
          getMenu.subtotal = getMenu.subtotal * getMenu.qty;
          getMenu.subtotal = getMenu.afterDiscount;
          return;
        }
        if (!getMenu.options.has(menu.optionName)) {
          getMenu.options.set(menu.optionName, {
            name: menu.optionName,
            items: [],
          });
          getMenu.subtotal += menu.optionItemPrice;
          // getMenu.total = getMenu.subtotal * getMenu.qty;

          // subtotal += getMenu.subtotal;
          getMenu.options.get(menu.optionName).items.push({
            name: menu.optionItemName,
            price: currencyFormat(menu.optionItemPrice),
          });
          // getMenu.price = currencyFormat(getMenu.price);
          // getMenu.afterDiscount = currencyFormat(getMenu.afterDiscount);
          // getMenu.subtotal = currencyFormat(getMenu.subtotal);
          // getMenu.total = currencyFormat(getMenu.total);
          // getMenu.discount = percentFormat(getMenu.discount);
        }
      }
    });

    detailsMap = Array.from(detailsMap.values()).map((detail: any) => {
      detail.total = detail.subtotal * detail.qty;
      subtotal += detail.total;
      return {
        ...detail,
        price: currencyFormat(detail.price),
        afterDiscount: currencyFormat(detail.afterDiscount),
        discount: percentFormat(detail.discount),
        subtotal: currencyFormat(detail.subtotal),
        total: currencyFormat(detail.total),
        options: Array.from(detail.options.values()),
      };
    });
    newData.discount = subtotal * newData.voucherDiscount;
    newData.total = subtotal - newData.discount;
    newData.totalPpn = newData.total * newData.ppn;
    newData.subtotal = currencyFormat(subtotal);
    newData.total = currencyFormat(newData.total + newData.totalPpn);
    newData.totalPpn = currencyFormat(newData.totalPpn);
    newData.discount = currencyFormat(-newData.discount);
    newData.voucherDiscount = percentFormat(newData.voucherDiscount);
    newData.ppn = percentFormat(newData.ppn);
    newData.details = detailsMap;

    return newData;
  };

  export const getByIdFromCustomer = async (id: number) => {
    const result = await getById(id);
    if (result) {
      result.status = {
        WAITING_CONFIRMATION: "Waiting Confirmation",
        IN_PROCESS: "In Process",
        DONE: "Done",
        CANCELED: "Canceled",
      }[result.status as string]!;
    }
    return result;
  };

  export const getByIdDetails = async (id: number) => {
    let result = await getByIdFromCustomer(id);
    if (result.details.length > 1) {
      result.details = result.details.reduce((prev: any, curr: any) => {
        try {
          const indexMenu = prev.findIndex(
            (item: any) => item.menuId === curr.menuId
          );
          if (indexMenu < 0) {
            curr = {
              menuId: curr.menuId,
              menuName: curr.menuName,
              image: curr.image,
            };
            return [...prev, curr];
          }
          return prev;
        } catch {
          if (prev.menuId == curr.menuId) {
            prev = {
              menuId: prev.menuId,
              menuName: prev.menuName,
              image: prev.image,
            };
            return [prev];
          }
          prev = {
            menuId: prev.menuId,
            menuName: prev.menuName,
            image: prev.image,
          };
          curr = {
            menuId: curr.menuId,
            menuName: curr.menuName,
            image: curr.image,
          };
          return [prev, curr];
        }
      });
    } else {
      result.details[0] = {
        menuId: result.details[0].menuId,
        menuName: result.details[0].menuName,
        image: result.details[0].image,
      };
    }
    return result.details;
  };

  export const create = async (req: Request, res: Response) => {
    // console.log(res.locals);
    const conn = await db.getConnection();
    await conn.beginTransaction();
    try {
      const createRequest = validate(orderValidations.create, req);
      const date = new Date();
      const year = date.toLocaleString("default", { year: "numeric" });
      const month = date.toLocaleString("default", { month: "2-digit" });
      const day = date.toLocaleString("default", { day: "2-digit" });
      const [newOrder] = await conn.query<ResultSetHeader>(
        "INSERT INTO `order` (order_code, customer_id, table_id, note, voucher_id, ppn, status, created_at) VALUES (?,?,?,?,?,?,?,?)",
        [
          `INV-${[year, month, day].join("")}-${generateString(6)}`,
          res.locals.customer.id,
          createRequest.tableId,
          createRequest.note,
          createRequest.voucherId,
          createRequest.ppn,
          "WAITING_CONFIRMATION",
          dateTimeFormater(date),
        ]
      );
      for (let i = 0; i < createRequest.listCartId.length; i++) {
        await createOrderDetail(
          conn,
          createRequest.listCartId[i],
          newOrder.insertId
        );
      }
      await conn.commit();

      const data = await getById(newOrder.insertId);
      return data;
    } catch (err) {
      await conn.rollback();
      throw err;
    }
  };

  export const updateFromEmployee = async (
    req: Request<{ id: number }>,
    res: Response
  ) => {
    const updateRequest = validate(orderValidations.update, req);
    await db.query<ResultSetHeader>(
      "UPDATE `order` SET status=?, employee_id = ? WHERE id = ?",
      [updateRequest.status, res.locals.employee.id, req.params.id]
    );
    return await getById(req.params.id);
  };
  export const updateFromCustomer = async (
    req: Request<{ id: number }>,
    res: Response
  ) => {
    await db.query<ResultSetHeader>(
      "UPDATE `order` SET status='CANCELED' WHERE id = ?",
      [req.params.id]
    );
    return await getById(req.params.id);
  };
  export const rateOrder = async (req: Request<{ id: number }>) => {
    const conn = await db.getConnection();
    conn.beginTransaction;
    try {
      const updateRequest = validate(orderValidations.rateOrder, req);
      const [result] = await conn.query<ResultSetHeader>(
        "INSERT INTO rating (order_id, rate, description) VALUES (?,?,?)",
        [req.params.id, updateRequest.rate, updateRequest.description]
      );
      for (let i = 0; i < updateRequest.menu.length; i++) {
        const menu = validate(
          orderValidations.rateOrder,
          updateRequest.menu[i]
        );
        await conn.query<ResultSetHeader>(
          "INSERT INTO menu_rating (rating_id, menu_id, rate, description) VALUES (?,?,?,?)",
          [result.insertId, menu.menuId, menu.rate, menu.description]
        );
      }
      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    }
  };
}
export default orderServices;

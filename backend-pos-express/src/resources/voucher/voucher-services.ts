import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import db from "../../app/database";
import { Voucher } from "./voucher-model";
import voucherValidations from "./voucher-validation";
import validate from "../../app/validation";
import { Request, Response } from "express";
import ResponseError from "../../responses/response-error";
import {
  currencyFormat,
  dateTimeFormater,
  percentFormat,
} from "../../app/formatter";

namespace voucherServices {
  export const getAll = async (req: Request) => {
    let searchQuery = " WHERE (0=0) ";
    // console.log(req.query);

    if (req.query.status) searchQuery += ` AND status = '${req.query.status}' `;
    if (req.query.search)
      searchQuery += ` AND (code LIKE '%${req.query.search}%' OR description LIKE '%${req.query.search}%') `;
    if (req.query.sort) {
      const [sortBy, sort] = (req.query.sort as string).split(":");
      searchQuery += ` ORDER BY ${sortBy} ${sort} `;
    }
    // console.log({ searchQuery });
    const [count] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) count FROM voucher_view ${searchQuery}`
    );

    const total = (count as any)[0].count;
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);

    if (pageSize) searchQuery += ` LIMIT ${(page - 1) * pageSize},${pageSize} `;

    const [data] = await db.query<Voucher[]>(
      `SELECT * FROM voucher_view ${searchQuery}`
    );
    const newData = data.map((item) => {
      return {
        ...item,
        discount: percentFormat(item.discount ?? 0),
        maxDiscount: currencyFormat(item.maxDiscount ?? 0),
        minPurchase: currencyFormat(item.minPurchase ?? 0),
        // expiredAt: item.expiredAt
      };
    });
    return {
      pagination: {
        current: page,
        pageSize,
        total: Math.ceil(total / pageSize),
      },
      rows: newData,
    };
  };
  export const getById = async (id: number) => {
    const [data] = await db.query<any[]>(
      "SELECT * FROM voucher_view WHERE id = ?",
      [id]
    );
    if (data.length <= 0) throw new ResponseError(404, "Voucher not found");

    return {
      ...data[0],
      discount: data[0].discount * 100,
    };
  };
  export const getByCode = async (code: string, res: Response) => {
    const [data] = await db.query<any[]>(
      "SELECT *, (SELECT COUNT(*) FROM `order` WHERE voucher_id = `voucher_view`.`id` AND `customer_id` = ?) AS 'usedByCustomer' FROM voucher_view WHERE code = ?",
      [res.locals.customer.id, code]
    );

    if (data.length <= 0) throw new ResponseError(404, "Voucher not found");

    return data[0];
  };

  export const create = async (req: Request, res: Response) => {
    // console.log(res.locals);
    const createRequest = validate(voucherValidations.create, req);
    const [newVoucher] = await db.query<ResultSetHeader>(
      "INSERT INTO voucher (code, description, discount, min_purchase, max_discount, max_use, qty, expired_at, last_update_by) VALUES (?,?,?,?,?,?,?,?,?)",
      [
        createRequest.code,
        createRequest.description,
        (createRequest.discount ?? 0) / 100,
        createRequest.minPurchase,
        createRequest.maxDiscount,
        createRequest.maxUse,
        createRequest.qty,
        dateTimeFormater(createRequest.expiredAt),
        res.locals.employee.id,
      ]
    );
    const data = await getById(newVoucher.insertId);
    return data;
  };

  export const update = async (req: Request<{ id: number }>, res: Response) => {
    const updateRequest = validate(voucherValidations.update, req);
    console.log(updateRequest.expiredAt?.toString());
    const newData: any = {
      code: updateRequest.code,
      description: updateRequest.description,
      discount: (updateRequest.discount ?? 0) / 100,
      min_purchase: updateRequest.minPurchase,
      max_discount: updateRequest.maxDiscount,
      max_use: updateRequest.maxUse,
      qty: updateRequest.qty,
      expired_at: dateTimeFormater(updateRequest.expiredAt),
      last_update_by: res.locals.employee.id,
    };

    await db.query<ResultSetHeader>("UPDATE voucher SET ? WHERE id = ?", [
      newData,
      req.params.id,
    ]);
    const data = await getById(req.params.id);
    return data;
  };

  export const remove = async (req: Request<{ id: number }>) => {
    await db.query<ResultSetHeader>("DELETE FROM voucher WHERE id = ?", [
      req.params.id,
    ]);
    // return true;
  };
}
export default voucherServices;

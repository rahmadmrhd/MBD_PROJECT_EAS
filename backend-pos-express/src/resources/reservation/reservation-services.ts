import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import db from "../../app/database";
import { Reservation } from "./reservation-model";
import reservationValidations from "./reservation-validation";
import validate from "../../app/validation";
import { Request, Response } from "express";
import ResponseError from "../../responses/response-error";
import {
  currencyFormat,
  dateTimeFormater,
  percentFormat,
} from "../../app/formatter";
import generateString from "../../app/randomString";

namespace reservationServices {
  export const getAll = async (req: Request, customerId?: any) => {
    let searchQuery = " WHERE (0=0) ";
    // console.log(req.query);

    if (req.query.status)
      searchQuery += ` AND status = '${req.query.status
        .toString()
        .toUpperCase()}' `;
    if (customerId) searchQuery += ` AND customerId = '${customerId}' `;
    if (req.query.search)
      searchQuery += ` AND (reservationCode LIKE '%${req.query.search}%' \
                       OR note LIKE '%${req.query.search}%' \
                       OR customerName LIKE '%${req.query.search}%') `;
    if (req.query.sort) {
      const [sortBy, sort] = (req.query.sort as string).split(":");
      searchQuery += ` ORDER BY ${sortBy} ${sort} `;
    }
    // console.log({ searchQuery });
    const [count] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) count FROM reservation_view ${searchQuery}`
    );

    const total = (count as any)[0].count;
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);

    if (pageSize) searchQuery += ` LIMIT ${(page - 1) * pageSize},${pageSize} `;

    const [data] = await db.query<Reservation[]>(
      `SELECT * FROM reservation_view ${searchQuery}`
    );
    const newData = data.map((item) => {
      return {
        id: item.id,
        reservationCode: item.reservationCode,
        datetime: item.datetime,
        timestamp: item.timestamp,
        totalGuests: item.totalGuests,
        tableName: item.tableName,
        status: {
          WAITING_CONFIRMATION: "Waiting Confirmation",
          CONFIRMED: "Confirmed",
          CANCELED: "Canceled",
        }[item.status!]!,
        customer: {
          name: item.customerName,
          noTelp: item.customerNoTelp,
          image: item.customerImage,
        },
        note: item.note,
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
  export const getAllInCustomer = async (req: Request, res: Response) => {
    return await getAll(req, res.locals.customer.id);
  };
  export const getAllWaitingList = async (req: Request) => {
    const [count] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) count FROM reservation_view WHERE status = 'WAITING_CONFIRMATION'`
    );
    return count[0].count;
  };
  export const getById = async (id: number) => {
    const [data] = await db.query<any[]>(
      "SELECT * FROM reservation_view WHERE id = ?",
      [id]
    );
    if (data.length <= 0) throw new ResponseError(404, "Reservation not found");

    return {
      id: data[0].id,
      reservationCode: data[0].reservationCode,
      datetime: data[0].datetime,
      timestamp: data[0].timestamp,
      totalGuests: data[0].totalGuests,
      tableName: data[0].tableName,
      status: data[0].status,
      customer: {
        name: data[0].customerName,
        noTelp: data[0].customerNoTelp,
        image: data[0].customerImage,
      },
      note: data[0].note,
    };
  };

  export const createFromEmployee = async (req: Request, res: Response) => {
    // console.log(res.locals);
    const createRequest = validate(
      reservationValidations.createFromEmployee,
      req
    );
    const [table] = await db.query<any>("SELECT * FROM `table` WHERE id = ?", [
      createRequest.tableId,
    ]);
    const [newReservation] = await db.query<ResultSetHeader>(
      "INSERT INTO reservation (code, customer_name, customer_no_telp, note, total_guests, table_id, table_name, datetime, status, type, last_update_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [
        generateString(10),
        createRequest.customerName,
        createRequest.customerNoTelp,
        createRequest.note,
        createRequest.totalGuests,
        createRequest.tableId,
        table.name,
        dateTimeFormater(createRequest.datetime),
        "CONFIRMED",
        "EMPLOYEE",
        res.locals.employee.id,
      ]
    );
    const data = await getById(newReservation.insertId);
    return data;
  };
  export const createFromCustomer = async (req: Request, res: Response) => {
    // console.log(res.locals);
    const createRequest = validate(
      reservationValidations.createFromCustomer,
      req
    );
    const [customer] = await db.query<any>(
      "SELECT * FROM customer WHERE id = ?",
      [createRequest.customerId]
    );
    const [table] = await db.query<any>("SELECT * FROM `table` WHERE id = ?", [
      createRequest.tableId,
    ]);
    const [newReservation] = await db.query<ResultSetHeader>(
      "INSERT INTO reservation (code, customer_id, customer_name, customer_no_telp, note, total_guests, datetime, status, type, last_update_by) VALUES (?,?,?,?,?,?,?,?,?,?)",
      [
        generateString(10),
        createRequest.customerId,
        customer.name,
        customer.no_telp,
        createRequest.note,
        createRequest.totalGuests,
        createRequest.tableId,
        table.name,
        dateTimeFormater(createRequest.datetime),
        "CONFIRMED",
        "CUSTOMER",
        res.locals.employee.id,
      ]
    );
    const data = await getById(newReservation.insertId);
    return data;
  };

  export const updateFromEmployee = async (
    req: Request<{ id: number }>,
    res: Response
  ) => {
    const updateRequest = validate(reservationValidations.update, req);
    await db.query<ResultSetHeader>(
      "UPDATE `reservation` SET status=?, last_update_by = ? WHERE id = ?",
      [updateRequest.status, res.locals.employee.id, req.params.id]
    );
    return await getById(req.params.id);
  };
  export const updateFromCustomer = async (
    req: Request<{ id: number }>,
    res: Response
  ) => {
    const updateRequest = validate(reservationValidations.update, req);
    await db.query<ResultSetHeader>(
      "UPDATE `reservation` SET status=? WHERE id = ?",
      [updateRequest.status, req.params.id]
    );
    return await getById(req.params.id);
  };
}

export default reservationServices;

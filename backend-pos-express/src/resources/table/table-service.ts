import { Request, Response } from "express";
import Table from "./table-model";
import db from "../../app/database";
import validate from "../../app/validation";
import tableValidations from "./table-validation";
import { ResultSetHeader, RowDataPacket } from "mysql2";

namespace tableServices {
  export const getAll = async () => {
    const [data] = await db.query<RowDataPacket[]>(
      "SELECT id, name, available, capacity FROM `table`"
    );
    return data.map((table) => ({
      id: table.id,
      name: table.name,
      available: (table.available ?? 0) === 1 ? true : false,
      capacity: table.capacity,
    }));
  };
  export const getById = async (id: number) => {
    const [data] = await db.query<Table[]>(
      "SELECT id, name, available, capacity FROM `table` WHERE id = ?",
      [id]
    );
    return data[0];
  };
  export const create = async (req: Request, res: Response) => {
    const table = validate(tableValidations.create, req);
    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO `table`(name, available, capacity, last_update_by) VALUES (?,?,?,?)",
      [table.name, table.available, table.capacity, res.locals.employee.id]
    );
    return getById(table.id);
  };
  export const update = async (req: Request<{ id: number }>, res: Response) => {
    const table = validate(tableValidations.update, req);
    const newData: any = {
      name: table.name,
      available: table.available,
      capacity: table.capacity,
      last_update_by: res.locals.employee.id,
    };
    await db.query<ResultSetHeader>("UPDATE `table` SET ? WHERE id = ?", [
      newData,
      req.params.id,
    ]);
    return getById(table.id);
  };
  export const createAndUpdate = async (req: Request, res: Response) => {
    const conn = await db.getConnection();
    await conn.beginTransaction();
    try {
      for (let i = 0; i < req.body.new.length; i++) {
        const createRequest = validate(
          tableValidations.create,
          req.body.new[i]
        );
        const [newTable] = await conn.query<ResultSetHeader>(
          "INSERT INTO `table`(name, available, capacity, last_update_by) VALUES (?,?,?,?)",
          [
            createRequest.name,
            createRequest.available,
            createRequest.capacity,
            res.locals.employee.id,
          ]
        );
      }

      for (let i = 0; i < req.body.update.length; i++) {
        const updateRequest = validate(
          tableValidations.update,
          req.body.update[i]
        );
        const newData: any = {
          name: updateRequest.name,
          available: updateRequest.available,
          capacity: updateRequest.capacity,
          last_update_by: res.locals.employee.id,
        };
        await db.query<ResultSetHeader>("UPDATE `table` SET ? WHERE id = ?", [
          newData,
          updateRequest.id,
        ]);
      }

      await conn.commit();

      const data = await getAll();
      return data;
    } catch (err) {
      await conn.rollback();
      throw err;
    }
  };
  // export const deleteById = async (id: number) => {
  //   const [data] = await db.query<ResultSetHeader>(
  //     "DELETE FROM table WHERE id = ?",
  //     [id]
  //   );
  //   return data;
  // };
}
export default tableServices;

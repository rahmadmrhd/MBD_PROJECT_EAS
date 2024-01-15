import { Request, Response } from "express";
import Category from "./category-model";
import db from "../../app/database";
import validate from "../../app/validation";
import categoryValidations from "./category-validation";
import { ResultSetHeader } from "mysql2";

namespace categoryServices {
  export const getAll = async () => {
    const [data] = await db.query<Category[]>(
      "SELECT id, name, `order`, icon FROM category ORDER BY `order` ASC"
    );
    return data;
  };
  export const getById = async (id: number) => {
    const [data] = await db.query<Category[]>(
      "SELECT id, name, `order`, icon FROM category WHERE id = ?",
      [id]
    );
    return data[0];
  };
  export const create = async (req: Request, res: Response) => {
    const category = validate(categoryValidations, req);
    const [result] = await db.query<ResultSetHeader>(
      "INSERT INTO category(name, `order`, last_update_by) VALUES(?,?)",
      [category.name, category.order, res.locals.employee.id]
    );
    const [data] = await db.query<Category[]>(
      "SELECT id, name FROM category WHERE id = ?",
      [result.insertId]
    );
    return data;
  };
  export const update = async (req: Request<{ id: number }>, res: Response) => {
    const name = validate(categoryValidations, req).name;
    await db.query<ResultSetHeader>(
      "UPDATE category SET name = ?, last_update_by = ? WHERE id = ?",
      [name, res.locals.employee.id, req.params.id]
    );
    const [data] = await db.query<Category[]>(
      "SELECT id, name FROM category WHERE id = ?",
      [req.params.id]
    );
    return data[0];
  };
  export const createAndUpdate = async (req: Request, res: Response) => {
    const conn = await db.getConnection();
    await conn.beginTransaction();
    try {
      for (let i = 0; i < req.body.new.length; i++) {
        const createRequest = validate(categoryValidations, req.body.new[i]);
        const [newCategory] = await conn.query<ResultSetHeader>(
          "INSERT INTO category(name, `order`, icon, last_update_by) VALUES(?,?,?,?)",
          [
            createRequest.name,
            createRequest.order,
            createRequest.icon,
            res.locals.employee.id,
          ]
        );
      }

      for (let i = 0; i < req.body.update.length; i++) {
        const updateRequest = validate(categoryValidations, req.body.update[i]);
        var newData: any = {
          name: updateRequest.name,
          [`order`]: updateRequest.order,
          icon: updateRequest.icon,
          last_update_by: res.locals.employee.id,
        };
        const [updateCategory] = await conn.query<ResultSetHeader>(
          "UPDATE category SET ? WHERE id = ?",
          [newData, updateRequest.id]
        );
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
  //     "DELETE FROM category WHERE id = ?",
  //     [id]
  //   );
  //   return data;
  // };
}
export default categoryServices;

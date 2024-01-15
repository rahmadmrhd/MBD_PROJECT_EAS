import { ResultSetHeader } from "mysql2";
import db from "../../app/database";
import validate from "../../app/validation";
import ResponseError from "../../responses/response-error";
import Customer from "./customer-model";
import customerValidations from "./customer-validation";
import { Request } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { dateTimeFormater } from "../../app/formatter";

namespace customerServices {
  export const register = async (req: Request) => {
    const customer = validate(customerValidations.register, req);
    const [row] = await db.query(
      "SELECT COUNT(*) as count FROM customer WHERE username = ?",
      [customer.username]
    );
    const count = (row as any)[0].count;
    if (count > 0) {
      throw new ResponseError(400, "Username already exist");
    }

    customer.password = await bcrypt.hash(customer.password, 10);

    const regis = await db.execute<ResultSetHeader>(
      "INSERT INTO customer (username, password, name, gender, no_telp, birthdate) VALUES (?, ?, ?, ?, ?,?)",
      [
        customer.username,
        customer.password,
        customer.name,
        customer.gender,
        customer.noTelp || null,
        customer.birthdate,
      ]
    );

    const [data] = await db.query<Customer[]>(
      "SELECT username, name FROM customer WHERE id = ?",
      [regis[0].insertId]
    );
    return data[0];
  };

  export const login = async (req: Request) => {
    const loginRequest = validate(customerValidations.login, req);

    const [custs] = await db.query<Customer[]>(
      "SELECT id, username, name, password FROM customer WHERE username = ?",
      [loginRequest.username]
    );
    if (custs.length <= 0) {
      throw new ResponseError(400, "Username or password wrong");
    }

    const cust = custs[0];
    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      cust.password
    );
    if (!isPasswordValid) {
      throw new ResponseError(400, "Username or password wrong");
    }
    const token = uuidv4();
    await db.execute<ResultSetHeader>(
      "UPDATE customer SET token = ? WHERE id = ?",
      [token, cust.id]
    );
    return { username: cust.username, name: cust.name, token };
  };
  export const get = async (username: string) => {
    const get = validate(customerValidations.get, { username });
    const [custs] = await db.query<Customer[]>(
      "SELECT username, name, gender, no_telp, birthdate FROM customer WHERE username = ?",
      [get.username]
    );
    if (custs.length <= 0) {
      throw new ResponseError(404, "Username is not found");
    }
    return {
      ...custs[0],
      birthdate: custs[0].birthdate,
    };
  };

  export const verifyToken = async (token: string) => {
    const [custs] = await db.query<Customer[]>(
      "SELECT id, username, name FROM customer WHERE token = ?",
      [token]
    );
    if (custs.length <= 0) {
      throw new ResponseError(404, "Token is not found");
    }
    return custs[0];
  };

  export const update = async (req: Request, username: string) => {
    const updateRequest = validate(customerValidations.update, req);
    const [row] = await db.query(
      "SELECT id,COUNT(*) as count FROM customer WHERE username = ?",
      [username]
    );
    const count = (row as any)[0].count;
    if (count <= 0) {
      throw new ResponseError(404, "User is not found");
    }

    const data: any = {};
    if (updateRequest.name) {
      data.name = updateRequest.name;
    }
    if (updateRequest.gender) {
      data.gender = updateRequest.gender;
    }
    if (updateRequest.noTelp) {
      data.no_telp = updateRequest.noTelp;
    }
    if (updateRequest.password) {
      data.password = await bcrypt.hash(updateRequest.password, 10);
    }
    await db.execute<ResultSetHeader>(
      "UPDATE customer SET ? WHERE username = ?",
      [data, username]
    );

    const [result] = await db.query<Customer[]>(
      "SELECT username, name FROM customer WHERE id = ?",
      [(row as any)[0].id]
    );
    return result[0];
  };

  export const logout = async (username: string) => {
    const logoutRequest = validate(customerValidations.get, { username });

    const [custs] = await db.query<Customer[]>(
      "SELECT id, username, token FROM customer WHERE username = ?",
      [logoutRequest.username]
    );
    if (custs.length <= 0) {
      throw new ResponseError(404, "Username is not found");
    }

    const result = await db.execute<ResultSetHeader>(
      "UPDATE customer SET token = NULL WHERE id = ?",
      [custs[0].id]
    );

    return result[0].affectedRows > 0;
  };
}

export default customerServices;

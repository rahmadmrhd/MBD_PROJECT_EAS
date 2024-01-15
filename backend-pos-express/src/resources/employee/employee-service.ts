import { ResultSetHeader } from "mysql2";
import db from "../../app/database";
import validate from "../../app/validation";
import ResponseError from "../../responses/response-error";
import Employee from "./employee-model";
import employeeValidations from "./employee-validation";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

namespace employeeServices {
  export const register = async (req: Request) => {
    const employee = validate(employeeValidations.register, req);
    const [row] = await db.query(
      "SELECT COUNT(*) as count FROM employee WHERE username = ?",
      [employee.username]
    );
    const count = (row as any)[0].count;
    if (count > 0) {
      throw new ResponseError(400, "Username already exist");
    }

    employee.password = await bcrypt.hash(employee.password, 10);

    const regis = await db.execute<ResultSetHeader>(
      "INSERT INTO employee (username, password, name, gender, no_telp) VALUES (?, ?, ?, ?, ?)",
      [
        employee.username,
        employee.password,
        employee.name,
        employee.gender ?? null,
        employee.noTelp ?? null,
      ]
    );

    const [data] = await db.query<Employee[]>(
      "SELECT username, name FROM employee WHERE id = ?",
      [regis[0].insertId]
    );
    return data[0];
  };

  export const login = async (req: Request) => {
    const loginRequest = validate(employeeValidations.login, req);

    const [result] = await db.query<Employee[]>(
      "SELECT id, username, name, role, password FROM employee WHERE username = ?",
      [loginRequest.username]
    );
    if (result.length <= 0) {
      throw new ResponseError(400, "Username or password wrong");
    }

    const employee = result[0];
    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      employee.password
    );
    if (!isPasswordValid) {
      throw new ResponseError(400, "Username or password wrong");
    }
    const token = uuidv4();
    await db.execute<ResultSetHeader>(
      "UPDATE employee SET token = ? WHERE id = ?",
      [token, employee.id]
    );
    return {
      username: employee.username,
      name: employee.name,
      role: employee.role,
      token,
    };
  };
  export const get = async (username: string) => {
    const get = validate(employeeValidations.get, { username });
    const [employee] = await db.query<Employee[]>(
      "SELECT username, name, gender, role, no_telp as noTelp FROM employee WHERE username = ?",
      [get.username]
    );
    if (employee.length <= 0) {
      throw new ResponseError(404, "Username is not found");
    }
    return employee[0];
  };

  export const verify = async (req: Request, res: Response) => {
    const [result] = await db.query<Employee[]>(
      "SELECT username, name, gender, role, no_telp as noTelp FROM employee WHERE token = ?",
      [res.locals.employee.token]
    );
    if (result.length <= 0) {
      throw new ResponseError(404, "Token is not valid");
    }
    return result[0];
  };

  export const update = async (req: Request, username: string) => {
    const updateRequest = validate(employeeValidations.update, req);
    const [row] = await db.query(
      "SELECT id,COUNT(*) as count FROM employee WHERE username = ?",
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
    if (updateRequest.role) {
      data.role = updateRequest.role;
    }
    await db.execute<ResultSetHeader>(
      "UPDATE customer SET ? WHERE username = ?",
      [data, username]
    );

    const [result] = await db.query<Employee[]>(
      "SELECT username, name FROM employee WHERE id = ?",
      [(row as any)[0].id]
    );
    return result[0];
  };

  export const logout = async (username: string) => {
    const logoutRequest = validate(employeeValidations.get, { username });

    const [employee] = await db.query<Employee[]>(
      "SELECT id, username, token FROM employee WHERE username = ?",
      [logoutRequest.username]
    );
    if (employee.length <= 0) {
      throw new ResponseError(404, "Username is not found");
    }

    const result = await db.execute<ResultSetHeader>(
      "UPDATE employee SET token = NULL WHERE id = ?",
      [employee[0].id]
    );

    return result[0].affectedRows > 0;
  };
}

export default employeeServices;

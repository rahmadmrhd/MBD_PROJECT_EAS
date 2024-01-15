import { RowDataPacket } from "mysql2";

interface Employee extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  name: string;
  gender: string | null;
  noTelp: string | null;
  role: "ADMIN" | "CASIER";
  token: string | null;
}

export default Employee;

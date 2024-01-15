import { RowDataPacket } from "mysql2";

interface Customer extends RowDataPacket {
  id: number;
  username: string;
  password: string;
  name: string;
  gender: string;
  noTelp: string | null;
  token: string | null;
}

export default Customer;

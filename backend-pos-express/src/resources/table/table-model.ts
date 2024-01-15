import { RowDataPacket } from "mysql2";

interface Table extends RowDataPacket {
  id: number;
  name?: string;
  available?: boolean;
  capacity?: number;
}

export default Table;

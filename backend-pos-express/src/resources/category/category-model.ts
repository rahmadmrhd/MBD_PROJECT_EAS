import { RowDataPacket } from "mysql2";

interface Category extends RowDataPacket {
  id: number;
  order: number;
  name: string;
  icon: string;
}

export default Category;

import { RowDataPacket } from "mysql2";
import Category from "../category/category-model";

export interface Order extends RowDataPacket {
  id?: number;
  orderCode?: string;
  customerId?: number;
  customerName?: string;
  customerNoTelp?: string;
  customerUsername?: string;
  customerImage?: string;
  employeeId?: number;
  tableId?: number;
  timestamp?: string;
  amount?: number;
  discount?: number;
  note?: string;
  voucherId?: number;
  status?: string;
  details: OrderDetail[];
}

export type OrderDetail = {
  id?: number;
  menuId?: number;
  nameMenu?: string;
  price?: number;
  discount?: number;
  image?: string;
  qty?: number;
  note?: string;
  options: OrderDetailOption[];
};

export type OrderDetailOption = {
  id?: number;
  optionId?: number;
  nameOption?: string;
  optionItemId?: number;
  nameOptionItem?: string;
  price?: number;
};

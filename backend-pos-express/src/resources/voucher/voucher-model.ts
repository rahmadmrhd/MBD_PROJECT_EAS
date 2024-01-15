import { RowDataPacket } from "mysql2";
import Category from "../category/category-model";

export interface Voucher extends RowDataPacket {
  id: number;
  code?: string;
  description?: string;
  discount?: number;
  minPurchase?: number;
  maxDiscount?: number;
  maxUse?: number;
  qty?: number;
  used?: number;
  expiredAt?: Date;
  status?: string;
}

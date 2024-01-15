import { RowDataPacket } from "mysql2";

export interface Cart extends RowDataPacket {
  id?: number;
  customerId?: number;
  menuId?: number;
  qty?: number;
  details?: CartDetail[];
}

export interface CartDetail {
  cartId?: number;
  menuOptionItemId?: number;
}

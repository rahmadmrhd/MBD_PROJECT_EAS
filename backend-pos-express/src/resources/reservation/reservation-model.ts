import { RowDataPacket } from "mysql2";

export interface Reservation extends RowDataPacket {
  id?: number;
  reservationCode?: string;
  timestamp: string;
  datetime: Date;
  customerName?: string;
  customerNoTelp?: string;
  note?: string;
  totalGuests?: number;
  tableId?: number;
  tableName?: number;
  type?: string;
  status?: string;
}

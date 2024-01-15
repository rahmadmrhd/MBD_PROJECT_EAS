export default interface ReservationModel {
  id?: number;
  reservationCode?: string;
  timestamp: string;
  datetime: string;
  customerName?: string;
  customerNoTelp?: string;
  customer?: {
    imageUrl?: string;
    name?: string;
    noTelp?: string;
  };
  note?: string;
  totalGuests?: number;
  tableId?: number;
  tableName?: number;
  type?: string;
  status?: string;
}

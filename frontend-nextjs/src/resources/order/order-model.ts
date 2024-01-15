export default interface OrderModel {
  id?: number;
  orderCode: string;
  timestamp: string;
  customer?: {
    imageUrl?: string;
    name?: string;
    noTelp?: string;
  };
  employee?: {
    imageUrl?: string;
    name?: string;
  };
  note?: string;
  ppn?: string;
  totalPpn?: string;
  tableName: string;
  status: string;
  voucherCode?: string;
  voucherDiscount?: string;
  discount: string;
  total: string;
  subtotal: string;
  details: OrderDetailModel[];
  rating?: number | null;
  review?: string | null;
}

export interface OrderDetailModel {
  id?: number;
  note: string;
  menuId: number;
  menuName: string;
  price: string;
  discount: string;
  afterDiscount: string;
  subtotal: string;
  total: string;
  image?: string;
  qty: number;
  options?: OrderDetailOptionModel[];
}

export interface OrderDetailOptionModel {
  name: string;
  items: {
    name: string;
    price: string;
  }[];
}

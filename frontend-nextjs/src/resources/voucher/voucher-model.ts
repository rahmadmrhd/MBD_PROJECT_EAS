export default interface VoucherModel {
  id?: number;
  code?: string;
  description?: string;
  discount?: number;
  minPurchase?: number;
  maxDiscount?: number;
  maxUse?: number;
  qty?: number;
  used?: number;
  expiredAt?: string;
  status?: string;
}

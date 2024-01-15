import Joi from "joi";
import { Voucher } from "./voucher-model";

namespace voucherValidations {
  export const create = Joi.object<Voucher>({
    code: Joi.string().max(25).required(),
    description: [Joi.string(), Joi.allow(null)],
    discount: Joi.number().required(),
    minPurchase: Joi.number().required(),
    maxDiscount: Joi.number().required(),
    maxUse: Joi.number().required(),
    qty: Joi.number().required(),
    expiredAt: Joi.date().required(),
  });
  export const update = Joi.object<Voucher>({
    description: [Joi.string(), Joi.allow(null)],
    discount: [Joi.number(), Joi.allow(null)],
    minPurchase: [Joi.number(), Joi.allow(null)],
    maxDiscount: [Joi.number(), Joi.allow(null)],
    maxUse: [Joi.number(), Joi.allow(null)],
    qty: [Joi.number(), Joi.allow(null)],
    expiredAt: [Joi.date(), Joi.allow(null)],
  });
}

export default voucherValidations;

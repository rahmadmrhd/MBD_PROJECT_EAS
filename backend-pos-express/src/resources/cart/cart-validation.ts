import Joi from "joi";
import { Cart } from "./cart-model";

namespace cartValidations {
  export const create = Joi.object<Cart>({
    menuId: Joi.number().required(),
    qty: Joi.number().required(),
    note: [Joi.string().min(0).optional(), Joi.allow(null)],
  });
  export const update = Joi.object<Cart>({
    qty: Joi.number().required(),
    note: [Joi.string().min(0).optional(), Joi.allow(null)],
  });
}

export default cartValidations;

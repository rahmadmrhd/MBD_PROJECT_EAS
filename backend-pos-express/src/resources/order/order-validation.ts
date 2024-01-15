import Joi from "joi";
import { Order, OrderDetail, OrderDetailOption } from "./order-model";

namespace orderValidations {
  export const orderDetailCreate = Joi.object<OrderDetail>({
    menuId: Joi.number().required(),
    qty: Joi.number().required(),
    note: [Joi.string().min(0).optional(), Joi.allow(null)],
  });
  export const orderDetailOptionCreate = Joi.object<OrderDetailOption>({
    optionId: Joi.number().required(),
    optionItemId: Joi.number().required(),
  });

  export const rateOrder = Joi.object({
    rate: Joi.number().required(),
    description: [Joi.string().min(0).optional(), Joi.allow(null)],
  });

  // export const orderDetailUpdate = Joi.object<OrderDetail>({
  //   menuId: [Joi.number().required(),Joi.allow(null)],
  //   qty: [Joi.number().required(),Joi.allow(null)],
  //   note: [Joi.string().min(0).optional(), Joi.allow(null)],
  // });
  // export const orderDetailOptionUpdate = Joi.object<OrderDetailOption>({
  //   optionId: [Joi.number().required(),Joi.allow(null)],
  //   optionItemId: [Joi.number().required(),Joi.allow(null)],
  // });

  export const create = Joi.object<Order>({
    tableId: Joi.number().required(),
    ppn: Joi.number().required(),
    note: [Joi.string().min(0).optional(), Joi.allow(null)],
    voucherId: [Joi.number(), Joi.allow(null)],
  });
  export const update = Joi.object<Order>({
    status: [
      Joi.valid("WAITING_CONFIRMAYION", "IN_PROCESS", "DONE", "CANCELED"),
      Joi.allow(null),
    ],
  });
}

export default orderValidations;

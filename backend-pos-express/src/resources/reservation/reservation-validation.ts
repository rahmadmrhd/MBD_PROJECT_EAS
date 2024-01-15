import Joi from "joi";
import { Reservation } from "./reservation-model";

namespace reservationValidations {
  export const createFromCustomer = Joi.object<Reservation>({
    customerId: Joi.number().required(),
    note: [Joi.string().min(0).optional(), Joi.allow(null)],
    totalGuests: Joi.number().required(),
    datetime: Joi.date().required(),
  });
  export const createFromEmployee = Joi.object<Reservation>({
    tableId: Joi.number().required(),
    customerName: [Joi.string(), Joi.allow(null)],
    customerNoTelp: [Joi.string(), Joi.allow(null)],
    note: [Joi.string().min(0).optional(), Joi.allow(null)],
    totalGuests: Joi.number().required(),
    datetime: Joi.date().required(),
  });
  export const update = Joi.object<Reservation>({
    status: [
      Joi.valid("WAITING_CONFIRMAYION", "CONFIRMED", "CANCELED"),
      Joi.allow(null),
    ],
  });
}

export default reservationValidations;

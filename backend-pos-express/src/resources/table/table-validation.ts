import Joi from "joi";
import Table from "./table-model";

namespace tableValidations {
  export const create = Joi.object<Table>({
    name: Joi.string().max(10).required(),
    capacity: Joi.number().required(),
    available: Joi.boolean().required(),
  });
  export const update = Joi.object<Table>({
    name: [Joi.string().max(10), Joi.allow(null)],
    capacity: [Joi.number(), Joi.allow(null)],
    available: [Joi.boolean(), Joi.allow(null)],
  });
}

export default tableValidations;

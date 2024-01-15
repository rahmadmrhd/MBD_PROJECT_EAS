import Joi from "joi";
import Customer from "./customer-model";

namespace customerValidations {
  export const register = Joi.object<Customer>({
    username: Joi.string().max(25).required(),
    password: Joi.string().required(),
    name: Joi.string().max(255).required(),
    gender: Joi.string().valid("L", "P").required(),
    noTelp: Joi.string().max(20),
    birthdate: Joi.string().required(),
  });
  export const update = Joi.object<Customer>({
    password: Joi.string(),
    name: Joi.string().max(255),
    gender: Joi.string().valid("L", "P"),
    noTelp: Joi.string().max(20),
  });

  export const login = Joi.object<Customer>({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  export const get = Joi.object<{ username: string }>({
    username: Joi.string().required(),
  });
}
export default customerValidations;

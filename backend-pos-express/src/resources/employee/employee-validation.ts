import Joi from "joi";
import Employee from "./employee-model";

namespace employeeValidations {
  export const register = Joi.object<Employee>({
    username: Joi.string().max(25).required(),
    password: Joi.string().required(),
    name: Joi.string().max(255).required(),
    role: Joi.valid("ADMIN", "CASIER").required(),
    noTelp: Joi.string().max(20),
  });
  export const update = Joi.object<Employee>({
    password: Joi.string(),
    name: Joi.string().max(255),
    gender: Joi.string().valid("L", "P"),
    role: Joi.valid("ADMIN", "CASIER"),
    noTelp: Joi.string().max(20),
  });

  export const login = Joi.object<Employee>({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  export const get = Joi.object<{ username: string }>({
    username: Joi.string().required(),
  });
}
export default employeeValidations;

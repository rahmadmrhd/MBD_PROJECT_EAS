import { Request } from "express";
import Joi, { ObjectSchema } from "joi";
import ResponseError from "../responses/response-error";
import userValidation from "../resources/customer/customer-validation";

const validate = <T>(
  schema: Joi.ObjectSchema<T>,
  request: Request | Object
): T => {
  const result = schema.validate((request as Request).body || request, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (result.error) {
    throw new ResponseError(400, result.error.message);
  } else {
    return result.value as T;
  }
};

export default validate;

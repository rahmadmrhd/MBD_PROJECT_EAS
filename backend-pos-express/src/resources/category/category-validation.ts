import Joi from "joi";
import Category from "./category-model";

const categoryValidations = Joi.object<Category>({
  name: Joi.string().max(100).required(),
  order: Joi.number().required(),
  icon: [Joi.string().max(255), Joi.allow(null)],
});

export default categoryValidations;

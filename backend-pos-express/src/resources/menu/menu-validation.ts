import Joi from "joi";
import { Menu, MenuOption, MenuOptionItem } from "./menu-model";

namespace menuValidations {
  export const menuOptionCreate = Joi.object<MenuOption>({
    name: Joi.string().max(100).required(),
    min: Joi.number().required(),
    max: Joi.number().required(),
    items: Joi.array().required(),
  });
  export const MenuOptionItemCreate = Joi.object<MenuOptionItem>({
    name: Joi.string().max(100).required(),
    price: Joi.number().required(),
    available: Joi.boolean().required(),
  });

  export const menuOptionUpdate = Joi.object<MenuOption>({
    name: [Joi.string().max(100), Joi.allow(null)],
    min: [Joi.number(), Joi.allow(null)],
    max: [Joi.number(), Joi.allow(null)],
  });
  export const MenuOptionItemUpdate = Joi.object<MenuOptionItem>({
    name: [Joi.string().max(100), Joi.allow(null)],
    price: [Joi.number(), Joi.allow(null)],
    available: [Joi.boolean(), Joi.allow(null)],
  });

  export const create = Joi.object<Menu>({
    categoryId: Joi.number().required(),
    name: Joi.string().max(100).required(),
    price: Joi.number().required(),
    available: Joi.boolean().required(),
    description: [Joi.string().min(0).optional(), Joi.allow(null)],
    discount: Joi.number(),
    image: [Joi.string().min(0).optional(), Joi.allow(null)],
  });
  export const update = Joi.object<Menu>({
    categoryId: Joi.number(),
    name: Joi.string().max(100),
    price: Joi.number(),
    available: Joi.boolean(),
    description: [Joi.string().min(0).optional(), Joi.allow(null)],
    discount: Joi.number(),
    image: [Joi.string().min(0).optional(), Joi.allow(null)],
  });
}

export default menuValidations;

import CategoryModel from "../category/category-model";
import User from "../user/user-model";

export default interface MenuModel {
  id?: number;
  category?: CategoryModel;
  categoryId?: number;
  name?: string;
  description?: string;
  price?: number;
  discount?: number;
  available?: boolean;
  image?: string;
  rating?: number;
  ratingCount?: number;
  options?: MenuOptionModel[];
}

export type MenuOptionModel = {
  id?: number | string;
  menuId?: number;
  name: string;
  min: number;
  max: number;
  items: MenuOptionItemModel[];
};

export type MenuOptionItemModel = {
  id?: number | string;
  menuId?: number;
  name: string;
  price: number;
  available: boolean;
  isNew: boolean;
};

export type MenuOptionUpdateModel = {
  new: MenuOptionModel[];
  update: (Omit<MenuOptionModel, "items"> & {
    items: MenuOptionItemUpdateModel;
  })[];
  delete: number[]; //list of id
};

export type MenuOptionItemUpdateModel = {
  new: MenuOptionItemModel[];
  update: MenuOptionItemModel[];
  delete: number[]; //list of id
};

export type MenuRating = {
  customer: User;
  rating: number;
  review: number;
  timestamp: Date;
};

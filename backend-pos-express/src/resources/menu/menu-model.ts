import { RowDataPacket } from "mysql2";
import Category from "../category/category-model";

export interface Menu extends RowDataPacket {
  id: number;
  categoryId: number | null;
  categoryName: string | null;
  name: string;
  description: string;
  price: number;
  discount: number;
  available: boolean;
  image: string | null;
  rating: number;
  ratingCount: number;
  options: MenuOption[];
}

export type MenuOption = {
  id: number;
  name: string;
  min: number;
  max: number;
  items: MenuOptionItem[];
};

export type MenuOptionItem = {
  id: number;
  name: string;
  price: number;
  available: boolean;
};

export type MenuOptionUpdateModel = {
  new: MenuOption[];
  update: (Omit<MenuOption, "items"> & { items: MenuOptionItemUpdateModel })[];
  delete: number[]; //list of id
};

export type MenuOptionItemUpdateModel = {
  new: MenuOptionItem[];
  update: MenuOptionItem[];
  delete: number[]; //list of id
};

import { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import db from "../../app/database";
import {
  Menu,
  MenuOption,
  MenuOptionItem,
  MenuOptionItemUpdateModel,
  MenuOptionUpdateModel,
} from "./menu-model";
import menuValidations from "./menu-validation";
import validate from "../../app/validation";
import { Request, Response } from "express";
import ResponseError from "../../responses/response-error";
import { currencyFormat, percentFormat } from "../../app/formatter";

const createMenuOption = async (
  conn: PoolConnection,
  option: MenuOption,
  menuId: number,
  employeeId: number
) => {
  const optionRequest = validate(menuValidations.menuOptionCreate, option);
  if (optionRequest.items?.length > 0) {
    const [newOption] = await conn.query<ResultSetHeader>(
      "INSERT INTO menu_option (menu_id, name, min, max, last_update_by) VALUES(?,?,?,?,?)",
      [
        menuId,
        optionRequest.name,
        optionRequest.min,
        optionRequest.max,
        employeeId,
      ]
    );
    for (let j = 0; j < optionRequest.items.length; j++) {
      createMenuOptionItem(
        conn,
        optionRequest.items[j],
        newOption.insertId,
        employeeId
      );
    }
  }
};
const updateMenuOption = async (
  conn: PoolConnection,
  option: Omit<MenuOption, "items"> & { items: MenuOptionItemUpdateModel },
  employeeId: number
) => {
  const optionRequest = validate(menuValidations.menuOptionUpdate, option);
  const newData: any = {
    name: optionRequest.name,
    min: optionRequest.min,
    max: optionRequest.max,
    last_update_by: employeeId,
  };
  await conn.query<ResultSetHeader>("UPDATE menu_option SET ? WHERE id = ?", [
    newData,
    optionRequest.id,
  ]);

  if (option.items.new.length > 0) {
    for (let i = 0; i < option.items.new.length; i++) {
      createMenuOptionItem(
        conn,
        option.items.new[i],
        optionRequest.id,
        employeeId
      );
    }
  }
  if (option.items.update.length > 0) {
    for (let i = 0; i < option.items.update.length; i++) {
      updateMenuOptionItem(conn, option.items.update[i], employeeId);
    }
  }
  if (option.items.delete.length > 0) {
    for (let i = 0; i < option.items.delete.length; i++) {
      await conn.query<ResultSetHeader>(
        "DELETE FROM menu_option_item WHERE id = ?",
        [option.items.delete[i]]
      );
    }
  }
  const [countOption] = await conn.query<RowDataPacket[]>(
    "SELECT COUNT(*) AS count FROM menu_option_item WHERE menu_option_id = ?",
    [optionRequest.id]
  );
  if (countOption[0].count <= 0) {
    await conn.query<ResultSetHeader>("DELETE FROM menu_option WHERE id = ?", [
      optionRequest.id,
    ]);
  }
};
const createMenuOptionItem = async (
  conn: PoolConnection,
  item: MenuOptionItem,
  optionId: number,
  employeeId: number
) => {
  const itemRequest = validate(menuValidations.MenuOptionItemCreate, item);
  const [newItem] = await conn.query<ResultSetHeader>(
    "INSERT INTO menu_option_item (menu_option_id, name, price, available, last_update_by) VALUES(?,?,?,?,?)",
    [
      optionId,
      itemRequest.name,
      itemRequest.price,
      itemRequest.available,
      employeeId,
    ]
  );
};
const updateMenuOptionItem = async (
  conn: PoolConnection,
  item: MenuOptionItem,
  employeeId: number
) => {
  const itemRequest = validate(menuValidations.MenuOptionItemUpdate, item);
  const newItem: any = {
    name: itemRequest.name,
    price: itemRequest.price,
    available: itemRequest.available,
    last_update_by: employeeId,
  };
  await conn.query<ResultSetHeader>(
    "UPDATE menu_option_item SET ? WHERE id = ?",
    [newItem, itemRequest.id]
  );
};

namespace menuServices {
  export const getAll = async (req: Request) => {
    let searchQuery = " WHERE (0=0) ";
    // console.log(req.query);

    if (req.query.categoryName)
      searchQuery += ` AND categoryName = '${req.query.categoryName}' `;
    if (req.query.isAvailable)
      searchQuery += ` AND available = ${
        req.query.isAvailable === "true" ? 1 : 0
      } `;
    if (req.query.search)
      searchQuery += ` AND (name LIKE '%${req.query.search}%' OR description LIKE '%${req.query.search}%') `;
    if (req.query.sort) {
      const [sortBy, sort] = (req.query.sort as string).split(":");
      searchQuery += ` ORDER BY ${sortBy} ${sort} `;
    }
    // console.log({ searchQuery });
    const [count] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) count FROM menu_view ${searchQuery}`
    );

    const total = (count as any)[0].count;
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);

    if (pageSize) searchQuery += ` LIMIT ${(page - 1) * pageSize},${pageSize} `;

    const [data] = await db.query<Menu[]>(
      `SELECT * FROM menu_view ${searchQuery}`
    );
    const listMenu: {
      id: number;
      category: {
        id: number | null;
        name: string | null;
        icon: string | null;
      };
      name: string;
      description: string;
      price: string;
      discount: string;
      afterDiscount: string;
      available: boolean;
      image: string | null;
      rating: number;
      ratingCount: number;
    }[] = [];
    data.forEach((menu) => {
      listMenu.push({
        id: menu.id,
        category: {
          id: menu.categoryId,
          name: menu.categoryName,
          icon: menu.categoryIcon,
        },
        name: menu.name,
        description: menu.description,
        price: currencyFormat(Number(menu.price)),
        discount: percentFormat(menu.discount),
        afterDiscount: currencyFormat(
          Number(menu.price) - (Number(menu.price) * menu.discount) / 100
        ),
        available: menu.available ? true : false,
        image: menu.image,
        rating: menu.rating,
        ratingCount: menu.ratingCount,
      });
    });
    return {
      pagination: {
        current: page || 1,
        pageSize: pageSize || listMenu.length,
        total: Math.ceil(total / pageSize) || 1,
      },
      rows: listMenu,
    };
  };
  export const getAllFromCustomer = async (req: Request, res: Response) => {
    let searchQuery = ` WHERE (0=0) `;
    // console.log(req.query);
    if (req.query.isFavorite)
      searchQuery += ` AND isFavorite = ${
        req.query.isFavorite === "true" ? 1 : 0
      } AND customerId = ${res.locals.customer.id} `;
    if (req.query.categoryId)
      searchQuery += ` AND categoryId = '${req.query.categoryId}' `;
    if (req.query.isAvailable)
      searchQuery += ` AND available = ${
        req.query.isAvailable === "true" ? 1 : 0
      } `;
    if (req.query.search)
      searchQuery += ` AND (name LIKE '%${req.query.search}%' OR description LIKE '%${req.query.search}%') `;
    if (req.query.sort) {
      const [sortBy, sort] = (req.query.sort as string).split(":");
      searchQuery += ` ORDER BY ${sortBy} ${sort} `;
    }
    // console.log({ searchQuery });
    const [count] = await db.query<RowDataPacket[]>(
      `SELECT COUNT(*) count FROM menu_customer_view ${searchQuery}`
    );

    const total = (count as any)[0].count;
    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);

    if (pageSize) searchQuery += ` LIMIT ${(page - 1) * pageSize},${pageSize} `;
    const [data] = await db.query<Menu[]>(
      `SELECT * FROM menu_customer_view ${searchQuery}`,
      [res.locals.customer?.id]
    );
    const listMenu: {
      id: number;
      category: {
        id: number | null;
        name: string | null;
        icon: string | null;
      };
      name: string;
      description: string;
      price: number;
      discount: number;
      afterDiscount: number;
      available: boolean;
      image: string | null;
      rating: number;
      ratingCount: number;
      isFavorite: boolean;
      availableOptions: boolean;
    }[] = [];
    data.forEach((menu) => {
      listMenu.push({
        id: menu.id,
        category: {
          id: menu.categoryId,
          name: menu.categoryName,
          icon: menu.categoryIcon,
        },
        name: menu.name,
        description: menu.description,
        price: Number(menu.price),
        discount: menu.discount,
        afterDiscount: Number(menu.price) - Number(menu.price) * menu.discount,
        available: menu.available ? true : false,
        image: menu.image,
        rating: menu.rating,
        ratingCount: menu.ratingCount,
        isFavorite:
          menu.isFavorite > 0 && menu.customerId === res.locals.customer?.id
            ? true
            : false,
        availableOptions: menu.availableOptions > 0 ? true : false,
      });
    });
    return {
      pagination: {
        current: page || 1,
        pageSize: pageSize || listMenu.length,
        total: Math.ceil(total / pageSize) || 1,
      },
      rows: listMenu,
    };
  };
  export const getById = async (id: number) => {
    const [data] = await db.query<any[]>(
      "SELECT\
      `menu`.*,\
      `menu_option`.`id` AS 'option_id',\
      `menu_option`.`name` AS 'option_name',\
      `menu_option`.`min` AS 'option_min',\
      `menu_option`.`max` AS 'option_max',\
      `menu_option_item`.`id` AS 'option_item_id',\
      `menu_option_item`.`name` AS 'option_item_name',\
      `menu_option_item`.`price` AS 'option_item_price',\
      `menu_option_item`.`available` AS 'option_item_available'\
      FROM `menu_view` AS `menu`\
      LEFT JOIN `menu_option` ON `menu`.`id` = `menu_option`.`menu_id`\
      LEFT JOIN `menu_option_item` ON `menu_option_item`.`menu_option_id` = `menu_option`.`id`\
      WHERE `menu`.`id` = ?",
      [id]
    );
    if (data.length <= 0) throw new ResponseError(404, "Menu not found");

    const newData: any = {
      id: data[0].id,
      category: {
        id: data[0].categoryId,
        name: data[0].categoryName,
        icon: data[0].categoryIcon,
      },
      name: data[0].name,
      description: data[0].description,
      price: data[0].price,
      discount: data[0].discount ?? 0,
      afterDiscount:
        Number(data[0].price) - Number(data[0].price) * data[0].discount,
      available: data[0].available ? true : false,
      image: data[0].image,
      rating: data[0].rating,
      ratingCount: data[0].ratingCount,
    };
    const optionsMap = new Map<string, any>();

    data.forEach((item) => {
      const optionName = item.option_name;
      const itemName = item.option_item_name;

      if (optionName || itemName) {
        if (!optionsMap.has(optionName)) {
          optionsMap.set(optionName, {
            id: item.option_id,
            name: optionName,
            min: item.option_min,
            max: item.option_max,
            items: [],
          });
        }
        if (!item.option_item_id) return;
        optionsMap.get(optionName).items.push({
          id: item.option_item_id,
          name: itemName,
          price: item.option_item_price,
          available: item.option_item_available ? true : false,
        });
      }
    });

    const options = Array.from(optionsMap.values());
    if (options.length > 0) newData.options = options;

    return newData;
  };
  export const getRateById = async (id: number) => {
    const [data] = await db.query<any[]>(
      "SELECT * FROM `menu_rating_view` WHERE `menuId` = ?",
      [id]
    );

    const newData: any = data.map((item) => ({
      rating: item.rating,
      review: item.review,
      timestamp: item.timestamp,
      customer: {
        name: item.customerName,
        username: item.customerUsername,
        image: item.customerImage,
      },
    }));
    return newData;
  };

  export const create = async (req: Request, res: Response) => {
    // console.log(res.locals);
    const conn = await db.getConnection();
    await conn.beginTransaction();
    try {
      const createRequest = validate(menuValidations.create, req);
      const [newMenu] = await conn.query<ResultSetHeader>(
        "INSERT INTO menu (category_id, name, description, price, discount, available, last_update_by) VALUES(?,?,?,?,?,?,?)",
        [
          createRequest.categoryId,
          createRequest.name,
          createRequest.description ?? null,
          createRequest.price,
          (createRequest.discount ?? 0) / 100,
          createRequest.available,
          res.locals.employee.id,
        ]
      );
      if (createRequest.options?.length > 0) {
        for (let i = 0; i < createRequest.options.length; i++) {
          createMenuOption(
            conn,
            createRequest.options[i],
            newMenu.insertId,
            res.locals.employee.id
          );
        }
      }
      await conn.commit();

      const data = await getById(newMenu.insertId);
      return data;
    } catch (err) {
      await conn.rollback();
      throw err;
    }
  };

  export const update = async (req: Request<{ id: number }>, res: Response) => {
    const conn = await db.getConnection();
    await conn.beginTransaction();
    try {
      const originalData = req.body as Omit<Menu, "options"> & {
        options?: MenuOptionUpdateModel;
      };
      const updateRequest = validate(menuValidations.update, req);
      const newData: any = {
        category_id: updateRequest.categoryId,
        name: updateRequest.name,
        description: updateRequest.description,
        price: updateRequest.price,
        discount: (updateRequest.discount ?? 0) / 100,
        available: updateRequest.available,
        image: updateRequest.image,
        last_update_by: res.locals.employee.id,
      };

      await conn.query<ResultSetHeader>("UPDATE menu SET ? WHERE id = ?", [
        newData,
        req.params.id,
      ]);

      // await conn.query("DELETE FROM menu_option WHERE menu_id = ?", [
      //   req.params.id,
      // ]);
      if ((originalData.options?.new?.length ?? 0) > 0) {
        for (let i = 0; i < originalData.options?.new?.length!; i++) {
          createMenuOption(
            conn,
            originalData.options?.new[i]!,
            req.params.id,
            res.locals.employee.id
          );
        }
      }
      if ((originalData.options?.update?.length ?? 0) > 0) {
        for (let i = 0; i < originalData.options?.update?.length!; i++) {
          updateMenuOption(
            conn,
            originalData.options?.update[i]!,
            res.locals.employee.id
          );
        }
      }
      if ((originalData.options?.delete?.length ?? 0) > 0) {
        for (let i = 0; i < originalData.options?.delete?.length!; i++) {
          await conn.query<ResultSetHeader>(
            "DELETE FROM menu_option WHERE id = ?",
            [originalData.options?.delete[i]!]
          );
        }
      }

      await conn.commit();

      const data = await getById(req.params.id);
      return data;
    } catch (err) {
      await conn.rollback();
      throw err;
    }
  };

  export const remove = async (req: Request<{ id: number }>) => {
    await db.query<ResultSetHeader>("DELETE FROM menu WHERE id = ?", [
      req.params.id,
    ]);
    // return true;
  };

  export const setFavorite = async (
    req: Request<{ id: number }>,
    res: Response
  ) => {
    const conn = await db.getConnection();
    await conn.beginTransaction();
    try {
      const [isAlready] = await conn.query<RowDataPacket[]>(
        "SELECT COUNT(*) as count FROM menu_favorite WHERE menu_id = ? AND customer_id = ?",
        [req.params.id, res.locals.customer.id]
      );
      if (isAlready[0].count > 0) {
        await conn.query<ResultSetHeader>(
          "DELETE FROM menu_favorite WHERE menu_id = ? AND customer_id = ?",
          [req.params.id, res.locals.customer.id]
        );
      } else {
        await conn.query<ResultSetHeader>(
          "INSERT INTO menu_favorite (menu_id, customer_id) VALUES (?,?)",
          [req.params.id, res.locals.customer.id]
        );
      }
      await conn.commit();
      const [isFavorite] = await db.query<RowDataPacket[]>(
        "SELECT COUNT(*) as count FROM menu_favorite WHERE menu_id = ? AND customer_id = ?"
      );
      return isFavorite[0].count;
    } catch (err) {
      await conn.rollback();
      throw err;
    }
  };
}
export default menuServices;

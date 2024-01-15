import { ResponseAxios } from "@/src/utils/response-type";
import MenuModel, { MenuOptionUpdateModel } from "./menu-model";
import { PaginationModel } from "@/src/utils/pagination-model";
import axios, { AxiosError } from "axios";
import { optionAxios } from "@/src/utils/axios-config";
import { SortType } from "@/src/components/EnhancedTableHead";

namespace MenuServices {
  export const getAll = async (
    token: string,
    page: number,
    pageSize: number,
    category: string | null,
    isAvailable: string | null,
    search: string,
    sort?: SortType
  ): Promise<ResponseAxios<PaginationModel<MenuModel>>> => {
    if (!token)
      return {
        data: null,
        error: {
          code: 401,
          title: "Unauthorized",
        },
      };
    return await axios
      .get(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/menu?page=${page}&pageSize=${pageSize}${
          category ? `&categoryName=${category}` : ""
        }${isAvailable ? `&isAvailable=${isAvailable}` : ""}${
          search ? `&search=${search}` : ""
        }${sort ? `&sort=${sort.orderBy}:${sort.order}` : ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Employee ${token}`,
          },
          ...optionAxios,
        }
      )
      .then((res) => {
        if (res.status == 200) {
          const data = res.data.data as PaginationModel<MenuModel>;
          return { data, error: undefined };
        }
        return { data: null, error: undefined };
      })
      .catch((err) => {
        const error = err as AxiosError;
        return {
          data: null,
          error: error.response?.status
            ? {
                code: error.response?.status,
                title: error.response?.statusText,
                message: (error.response?.data as any).message.toString(),
              }
            : {
                code: 500,
                title: "Something went wrong",
              },
        };
      });
  };
  export const getById = async (
    token: string,
    id: number
  ): Promise<ResponseAxios<MenuModel>> => {
    if (!token)
      return {
        data: null,
        error: {
          code: 401,
          title: "Unauthorized",
        },
      };
    return await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/menu/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Employee ${token}`,
        },
        ...optionAxios,
      })
      .then((res) => {
        if (res.status == 200) {
          const data = res.data.data as MenuModel;
          return { data, error: undefined };
        }
        return { data: null, error: undefined };
      })
      .catch((err) => {
        const error = err as AxiosError;
        return {
          data: null,
          error: error.response?.status
            ? {
                code: error.response?.status,
                title: error.response?.statusText,
                message: (error.response?.data as any).message.toString(),
              }
            : {
                code: 500,
                title: "Something went wrong",
              },
        };
      });
  };
  export const create = async (
    token: string,
    menu: MenuModel
  ): Promise<ResponseAxios<MenuModel>> => {
    if (!token)
      return {
        data: null,
        error: {
          code: 401,
          title: "Unauthorized",
        },
      };

    delete menu["category"];
    return await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/menu`, menu, {
        method: "POST",
        headers: {
          withCredentials: true,
          "Content-Type": "application/json",
          Authorization: `Employee ${token}`,
        },
        ...optionAxios,
      })
      .then((res) => {
        if (res.status == 200) {
          const data = res.data.data as MenuModel;
          return { data, error: undefined };
        }
        return { data: null, error: undefined };
      })
      .catch((err) => {
        const error = err as AxiosError;
        return {
          data: null,
          error: error.response?.status
            ? {
                code: error.response?.status,
                title: error.response?.statusText,
                message: (error.response?.data as any).message.toString(),
              }
            : {
                code: 500,
                title: "Something went wrong",
              },
        };
      });
  };
  export const update = async (
    token: string,
    menu: Omit<MenuModel, "options" | "category"> & {
      options: MenuOptionUpdateModel;
    }
  ): Promise<ResponseAxios<MenuModel>> => {
    if (!token)
      return {
        data: null,
        error: {
          code: 401,
          title: "Unauthorized",
        },
      };

    return await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/menu/${menu.id}`, menu, {
        method: "PUT",
        headers: {
          withCredentials: true,
          "Content-Type": "application/json",
          Authorization: `Employee ${token}`,
        },
        ...optionAxios,
      })
      .then((res) => {
        if (res.status == 200) {
          const data = res.data.data as MenuModel;
          return { data, error: undefined };
        }
        return { data: null, error: undefined };
      })
      .catch((err) => {
        const error = err as AxiosError;
        return {
          data: null,
          error: error.response?.status
            ? {
                code: error.response?.status,
                title: error.response?.statusText,
                message: (error.response?.data as any).message.toString(),
              }
            : {
                code: 500,
                title: "Something went wrong",
              },
        };
      });
  };

  export const remove = async (
    token: string,
    id: number
  ): Promise<ResponseAxios<any>> => {
    if (!token)
      return {
        data: null,
        error: {
          code: 401,
          title: "Unauthorized",
        },
      };

    return await axios
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/menu/${id}`, {
        method: "DELETE",
        headers: {
          withCredentials: true,
          "Content-Type": "application/json",
          Authorization: `Employee ${token}`,
        },
        ...optionAxios,
      })
      .then((res) => {
        if (res.status == 200) {
          const data = res.data.data as MenuModel;
          return { data, error: undefined };
        }
        return { data: null, error: undefined };
      })
      .catch((err) => {
        const error = err as AxiosError;
        return {
          data: null,
          error: error.response?.status
            ? {
                code: error.response?.status,
                title: error.response?.statusText,
                message: (error.response?.data as any).message.toString(),
              }
            : {
                code: 500,
                title: "Something went wrong",
              },
        };
      });
  };
}
export default MenuServices;

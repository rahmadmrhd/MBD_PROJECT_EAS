import axios, { AxiosError } from "axios";
import CategoryModel from "./category-model";
import { ResponseAxios } from "@/src/utils/response-type";
import { optionAxios } from "@/src/utils/axios-config";

namespace CategoryServices {
  export const getAll = async (
    token: string
  ): Promise<ResponseAxios<CategoryModel[]>> => {
    if (!token)
      return {
        data: null,
        error: {
          code: 401,
          title: "Unauthorized",
        },
      };
    return await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Employee ${token}`,
        },
        ...optionAxios,
      })
      .then((res) => {
        if (res.status == 200) {
          const data = res.data.data as CategoryModel[];
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

  export const updateAll = async (
    token: string,
    data: {
      new: CategoryModel[];
      update: CategoryModel[];
    }
  ): Promise<ResponseAxios<CategoryModel[]>> => {
    if (!token)
      return {
        data: null,
        error: {
          code: 401,
          title: "Unauthorized",
        },
      };

    return await axios
      .put(`${process.env.NEXT_PUBLIC_API_URL}/category`, data, {
        method: "Put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Employee ${token}`,
        },
        ...optionAxios,
      })
      .then((res) => {
        if (res.status == 200) {
          const data = res.data.data as CategoryModel[];
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
export default CategoryServices;

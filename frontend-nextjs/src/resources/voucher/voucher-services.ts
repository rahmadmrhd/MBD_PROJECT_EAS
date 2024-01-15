import { ResponseAxios } from "@/src/utils/response-type";
import VoucherModel from "./voucher-model";
import { PaginationModel } from "@/src/utils/pagination-model";
import axios, { AxiosError } from "axios";
import { optionAxios } from "@/src/utils/axios-config";
import { SortType } from "@/src/components/EnhancedTableHead";

namespace VoucherServices {
  export const getAll = async (
    token: string,
    page: number,
    pageSize: number,
    status: string | null,
    search: string,
    sort?: SortType
  ): Promise<ResponseAxios<PaginationModel<VoucherModel>>> => {
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
        }/voucher?page=${page}&pageSize=${pageSize}${
          status ? `&status=${status}` : ""
        }${search ? `&search=${search}` : ""}${
          sort ? `&sort=${sort.orderBy}:${sort.order}` : ""
        }`,
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
          const data = res.data.data as PaginationModel<VoucherModel>;
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
  ): Promise<ResponseAxios<VoucherModel>> => {
    if (!token)
      return {
        data: null,
        error: {
          code: 401,
          title: "Unauthorized",
        },
      };
    return await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/voucher/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Employee ${token}`,
        },
        ...optionAxios,
      })
      .then((res) => {
        if (res.status == 200) {
          const data = res.data.data as VoucherModel;
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
    voucher: VoucherModel
  ): Promise<ResponseAxios<VoucherModel>> => {
    if (!token)
      return {
        data: null,
        error: {
          code: 401,
          title: "Unauthorized",
        },
      };

    return await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/voucher`, voucher, {
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
          const data = res.data.data as VoucherModel;
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
    voucher: VoucherModel
  ): Promise<ResponseAxios<VoucherModel>> => {
    if (!token)
      return {
        data: null,
        error: {
          code: 401,
          title: "Unauthorized",
        },
      };

    return await axios
      .put(
        `${process.env.NEXT_PUBLIC_API_URL}/voucher/${voucher.id}`,
        voucher,
        {
          method: "PUT",
          headers: {
            withCredentials: true,
            "Content-Type": "application/json",
            Authorization: `Employee ${token}`,
          },
          ...optionAxios,
        }
      )
      .then((res) => {
        if (res.status == 200) {
          const data = res.data.data as VoucherModel;
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
      .delete(`${process.env.NEXT_PUBLIC_API_URL}/voucher/${id}`, {
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
          const data = res.data.data as VoucherModel;
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
export default VoucherServices;

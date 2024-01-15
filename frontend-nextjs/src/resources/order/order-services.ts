import { optionAxios } from "@/src/utils/axios-config";
import axios, { AxiosError } from "axios";
import OrderModel from "./order-model";

namespace OrderServices {
  export const changeStatus = async (
    id: number,
    status: "IN_PROCESS" | "DONE" | "CANCELED",
    token?: string
  ) => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/order/${id}`,
        { status },
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
          const data = res.data.data as OrderModel;
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

export default OrderServices;

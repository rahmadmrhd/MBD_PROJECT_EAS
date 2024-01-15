import { optionAxios } from "@/src/utils/axios-config";
import axios, { AxiosError } from "axios";
import ReservationModel from "./reservation-model";
import { ResponseAxios } from "@/src/utils/response-type";

namespace ReservationServices {
  export const changeStatus = async (
    id: number,
    status: "CANCELED" | "CONFIRMED",
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
        `${process.env.NEXT_PUBLIC_API_URL}/reservation/${id}`,
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
          const data = res.data.data as ReservationModel;
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
    data: ReservationModel
  ): Promise<ResponseAxios<ReservationModel>> => {
    if (!token)
      return {
        data: null,
        error: {
          code: 401,
          title: "Unauthorized",
        },
      };

    return await axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/reservation`, data, {
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
          const data = res.data.data as ReservationModel;
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

export default ReservationServices;

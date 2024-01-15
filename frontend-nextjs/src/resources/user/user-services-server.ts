import axios, { AxiosError } from "axios";
import User from "./user-model";
import { cookies } from "next/headers";
import { ErrorType } from "../../utils/error-types";
import { optionAxios } from "@/src/utils/axios-config";

namespace userServicesServer {
  export const getUser = async (): Promise<{
    user: User | null;
    error?: ErrorType;
  }> => {
    const token = cookies().get("token")?.value;
    if (!token) return { user: null };
    return await axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/employee/current`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Employee ${token}`,
        },
        ...optionAxios,
      })
      .then((res) => {
        if (res.status == 200) {
          const user: User = res.data.data;
          user.token = token;
          user.imageUrl = res.data.data.image
            ? `${process.env.NEXT_PUBLIC_API_URL}/files/${res.data.data.image}`
            : undefined;
          return { user };
        }
        return { user: null };
      })
      .catch((err) => {
        const error = err as AxiosError;
        return {
          user: null,
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
export default userServicesServer;

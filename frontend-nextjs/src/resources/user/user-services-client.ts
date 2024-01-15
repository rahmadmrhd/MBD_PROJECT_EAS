import axios, { AxiosError } from "axios";
import User from "./user-model";
import { ErrorToString, ErrorType } from "../../utils/error-types";
import { optionAxios } from "@/src/utils/axios-config";

namespace userServicesClient {
  export const getUser = async (
    token?: string
  ): Promise<{
    user: User | null;
    error?: ErrorType;
  }> => {
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
  export const logout = async (token?: string): Promise<void> => {
    if (!token)
      throw new Error(ErrorToString({ code: 401, title: "Unauthorized" }));
    await axios({
      method: "DELETE",
      url: `${process.env.NEXT_PUBLIC_API_URL}/auth/employee/current`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Employee ${token}`,
      },
      ...optionAxios,
      responseType: "json",
    })
      .then(() => {
        return { error: undefined };
      })
      .catch((err) => {
        throw err;
      });
  };

  export const login = async (
    username: string,
    password: string
  ): Promise<User | null> => {
    return await axios({
      method: "POST",
      // withCredentials: true,
      url: `${process.env.NEXT_PUBLIC_API_URL}/auth/employee/login`,
      data: {
        username: username,
        password: password,
      },
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "json",
      ...optionAxios,
    })
      .then((response) => {
        if (response.status >= 300) {
          return null;
        }
        return response.data.data;
      })
      .catch((error: AxiosError) => {
        throw error;
      });
  };
}
export default userServicesClient;

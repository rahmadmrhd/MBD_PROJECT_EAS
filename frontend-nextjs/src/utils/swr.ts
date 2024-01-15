"use client";

import useSWR from "swr";
import { ResponseAxios } from "./response-type";
import { optionAxios } from "./axios-config";
import axios, { AxiosError } from "axios";
import { useCookies } from "next-client-cookies";

const fetcher = async <T>([url, token]: [string, string]) => {
  return await axios
    .get(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Employee ${token}`,
      },
      ...optionAxios,
    })
    .then((res) => {
      if (res.status == 200) {
        const data = res.data.data as T;
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

const useAccessData = <T>(path: string, shouldFetch = true) => {
  const cookies = useCookies();
  const target = [path, cookies.get("token") ?? ""];
  const swr = useSWR<ResponseAxios<T>>(shouldFetch ? target : null, fetcher, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
    revalidateOnReconnect: true,
    refreshWhenHidden: true,
    revalidateOnMount: true,
    refreshInterval: 5000,
  });
  return swr;
};
export default useAccessData;

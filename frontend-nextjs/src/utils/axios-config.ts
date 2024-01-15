import { AxiosRequestConfig } from "axios";

export const optionAxios: AxiosRequestConfig = {
  timeout: 5000,
};
// const instance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   timeout: 5000,
//   headers: {
//     Accept: "application/json, text/plain, */*",
//     "Content-Type": "application/json; charset=utf-8",
//   },
// });

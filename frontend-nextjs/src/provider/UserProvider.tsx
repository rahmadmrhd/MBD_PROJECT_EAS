"use client";

import React, { useEffect } from "react";
import { UserContext } from "@src/context/UserContext";
import User from "../resources/user/user-model";
import useAccessData from "../utils/swr";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "next-client-cookies";

type Properties = {
  children: React.ReactNode;
  user?: User | null;
};

export function UserProviders({ children, user }: Properties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cookies = useCookies();
  const token = cookies.get("token");
  const [firstLoad, setFirstLoad] = React.useState(true);

  const { data, error, isValidating } = useAccessData<User>(
    "/auth/employee/current",
    !firstLoad
  );
  useEffect(() => {
    setTimeout(() => {
      if (firstLoad) {
        setFirstLoad(false);
      }
    }, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    throw error;
  }
  if (data && !isValidating) {
    const callbackUrl = searchParams.get("callbackUrl");
    if (data.data == null && !pathname.startsWith("/auth/signin")) {
      router.replace(
        callbackUrl
          ? `/auth/signin?callbackUrl=${callbackUrl}`
          : `/auth/signin?callbackUrl=${pathname}`
      );
      return <></>;
    } else if (data.data != null && pathname.startsWith("/auth/signin")) {
      {
        router.replace(callbackUrl || "/app");
        return <></>;
      }
    }
    if (data.data) {
      data!.data!.token = token;
    }
  }
  return (
    <>
      <UserContext.Provider value={(data?.data as User) || user}>
        {children}
      </UserContext.Provider>
    </>
  );
}

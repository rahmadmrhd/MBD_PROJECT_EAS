import React from "react";
import { UserProviders } from "@/src/provider/UserProvider";
import userServicesServer from "@/src/resources/user/user-services-server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, error } = await userServicesServer.getUser();
  const headersList = headers();
  const pathname = headersList.get("x-url") || "";
  if (pathname.startsWith("/auth/signin") && user) {
    redirect("/app");
  } else if (pathname.startsWith("/app") && !user) {
    redirect(`/auth/signin?callbackUrl=${pathname}`);
  }

  return <UserProviders user={user}>{children}</UserProviders>;
}

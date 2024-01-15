import React from "react";
import MyBreadcrumbs from "@/src/components/Breadcrumbs";

// eslint-disable-next-line react/prop-types
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MyBreadcrumbs rootPath='/'>{children}</MyBreadcrumbs>
    </>
  );
}

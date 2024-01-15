"use client";
import { Breadcrumbs, Box, Typography, Link as LinkJoy } from "@mui/joy";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname } from "next/navigation";
import { useSidebarContext } from "../context/SidebarContext";
import {
  BreadcrumbsContext,
  ReplaceProperties,
} from "../context/BreadcrumbsContext";
import React from "react";
import MyLink from "./MyLink";

type Properties = {
  rootPath: string;
  children: React.ReactNode;
};

function MyBreadcrumbs({ children, ...props }: Properties) {
  const sidebar = useSidebarContext();
  const pathname = usePathname();
  const originalPath = pathname.replace(
    `${sidebar.rootPath}${props.rootPath}`,
    ""
  );
  const listOriginalPath = originalPath.split("/");
  const [listPath, setListPath] = React.useState<string[]>([]);
  const [replace, setReplace] = React.useState<ReplaceProperties>({});
  React.useEffect(() => {
    getListPath();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replace, pathname]);

  const getListPath = () => {
    const currentPath = originalPath.replace(
      replace.searchValue ?? "",
      replace.replaceValue ?? ""
    );
    setListPath(currentPath.split("/"));
  };
  let newPath = `${sidebar.rootPath}${
    props.rootPath == "/" ? "" : props.rootPath
  }`;
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Breadcrumbs
          size='sm'
          aria-label='breadcrumbs'
          separator={<Icon icon='mdi:chevron-right' />}
          sx={{ pl: 0 }}
        >
          <LinkJoy
            underline='none'
            color='neutral'
            component={MyLink}
            href={`${sidebar.rootPath}/`}
            aria-label='Home'
          >
            <Icon icon='ic:round-dashboard' />
          </LinkJoy>
          {listPath.map((item, index) => {
            const isForce = item.includes(":force");
            let title = item.charAt(0).toUpperCase() + item.slice(1);
            if (isForce) {
              title = item.split(":")[0];
            }

            if (!item) return null;
            if (listPath.length - 1 === index) {
              return (
                <Typography
                  key={index}
                  color='primary'
                  fontWeight={500}
                  fontSize={12}
                >
                  {title}
                </Typography>
              );
            }
            newPath += `/${listOriginalPath[index]}`;
            return (
              <LinkJoy
                key={index}
                underline='hover'
                color='neutral'
                component={MyLink}
                href={newPath}
                aria-label='Home'
              >
                <Typography color='neutral' fontWeight={500} fontSize={12}>
                  {title}
                </Typography>
              </LinkJoy>
            );
          })}
        </Breadcrumbs>
      </Box>
      <BreadcrumbsContext.Provider value={{ replace, setReplace }}>
        {children}
      </BreadcrumbsContext.Provider>
    </>
  );
}

export default MyBreadcrumbs;

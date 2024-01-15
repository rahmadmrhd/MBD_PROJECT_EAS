"use client";

import React, { useEffect, useState } from "react";
import { ListItemButton, ListItemButtonProps } from "@mui/joy";
import { usePathname } from "next/navigation";
import { LinkProps } from "next/link";
import MyLink from "./MyLink";

interface Properties extends ListItemButtonProps {
  href: LinkProps["href"];
  exact?: boolean;
  redirect?: boolean;
  onActive?: () => void;
}

export default function ActiveListItemButton({
  href,
  children,
  exact,
  redirect = true,
  onActive,
  ...props
}: Properties) {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let active = false;
    if (!href) return;

    if (exact)
      active = pathname === href || (href as string).startsWith(pathname);
    else active = pathname.startsWith(href as string);

    setIsActive(active);
    if (active) onActive?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return redirect ? (
    <ListItemButton
      role='menuitem'
      component={MyLink}
      href={href}
      {...(props as ListItemButtonProps)}
      selected={isActive}
    >
      {children}
    </ListItemButton>
  ) : (
    <ListItemButton
      role='menuitem'
      {...(props as ListItemButtonProps)}
      selected={isActive}
    >
      {children}
    </ListItemButton>
  );
}

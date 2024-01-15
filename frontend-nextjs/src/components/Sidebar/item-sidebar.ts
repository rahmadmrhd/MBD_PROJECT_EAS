import React from "react";
import { UrlObject } from "url";
export type Url = string | UrlObject;
export type ItemSidebar = {
  label: string;
  href: Url;
  icon?: string | React.JSX.Element;
  exact?: boolean;
};
export type ItemSidebarExpanded = {
  label: string;
  href: Url;
  icon?: string | React.JSX.Element;
  exact?: boolean;
  children: Array<ItemSidebar | ItemSidebarExpanded>;
  disable: boolean;
};

export function isItemSidebarExpanded(
  item: ItemSidebar | ItemSidebarExpanded
): item is ItemSidebarExpanded {
  return "children" in item;
}

const listItemSidebar: Array<ItemSidebar | ItemSidebarExpanded> = [
  {
    label: "Dashboard",
    href: "/",
    icon: "ic:round-dashboard",
    exact: true,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: "material-symbols:order-approve-rounded",
  },
  {
    label: "Reservations",
    href: "/reservations",
    icon: "fluent-mdl2:reservation-orders",
  },
  {
    label: "Database",
    href: "/db",
    icon: "mdi:database",
    disable: true,
    children: [
      {
        label: "Table",
        href: "/table",
      },
      {
        label: "Category",
        href: "/category",
      },
      {
        label: "Menu",
        href: "/menu",
      },
      {
        label: "Voucher",
        href: "/voucher",
      },
    ],
  },
];
export default listItemSidebar;

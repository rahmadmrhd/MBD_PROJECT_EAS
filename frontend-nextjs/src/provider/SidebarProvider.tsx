"use client";

import React, { useState } from "react";
import { SidebarContext } from "../context/SidebarContext";

type Properties = {
  children: React.ReactNode;
  rootPath: string;
};

export function SidebarProvider({ children, rootPath }: Properties) {
  const [title, setTitle] = useState("");
  const [menuSelected, setMenuSelected] = useState("");

  const value = { title, setTitle, menuSelected, setMenuSelected };
  return (
    <SidebarContext.Provider value={{ rootPath, ...value }}>
      {children}
    </SidebarContext.Provider>
  );
}

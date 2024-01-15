/* eslint-disable no-unused-vars */
import { createContext, useContext } from "react";
export interface SidebarContextType {
  rootPath: string;
  title: string;
  setTitle: (title: string) => void;
  menuSelected: string;
  setMenuSelected: (title: string) => void;
  // route?: string;
  // setRoute?: (route: string) => void;
}
export const SidebarContext = createContext<SidebarContextType>({
  rootPath: "/app",
  title: "",
  setTitle: () => {},
  menuSelected: "",
  setMenuSelected: () => {},
});
export const useSidebarContext = () => useContext(SidebarContext);

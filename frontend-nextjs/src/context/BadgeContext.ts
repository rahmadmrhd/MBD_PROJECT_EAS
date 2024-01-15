import { createContext, useContext } from "react";
export type BadgeType = {
  [key: string]: number | undefined;
};
export const BadgeContext = createContext<BadgeType>({});
export const useBadgeContext = () => useContext(BadgeContext);

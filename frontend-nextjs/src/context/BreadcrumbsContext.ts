import React, { createContext, useContext } from "react";

export type ReplaceProperties = {
  searchValue?: string;
  replaceValue?: string;
};

export type BreadcrumbsContextType = {
  replace: ReplaceProperties;
  setReplace: React.Dispatch<React.SetStateAction<ReplaceProperties>>;
};
export const BreadcrumbsContext = createContext<BreadcrumbsContextType>({
  replace: {},
  setReplace: () => {},
});
export const useBreadcrumbsContext = () => useContext(BreadcrumbsContext);

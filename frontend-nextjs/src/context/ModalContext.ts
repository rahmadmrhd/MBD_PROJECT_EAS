import React, { createContext, useContext } from "react";
export type Modals = {
  modals: Record<string, React.ReactNode>;
  // eslint-disable-next-line no-unused-vars
  open: (key: React.Key, child: React.ReactNode) => void;
  // eslint-disable-next-line no-unused-vars
  close: (key: React.Key) => void;
};
export const ModalContext = createContext<Modals>({
  modals: {},
  open: () => {},
  close: () => {},
});
export const useModalContext = () => useContext(ModalContext);

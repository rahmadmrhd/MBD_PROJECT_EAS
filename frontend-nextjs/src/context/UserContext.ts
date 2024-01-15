import { createContext, useContext } from "react";
import User from "../resources/user/user-model";
export type UserContextType = {
  user?: User | null;
  session?: boolean;
};
export const UserContext = createContext<User | null>({});
export const useUserContext = () => useContext(UserContext);

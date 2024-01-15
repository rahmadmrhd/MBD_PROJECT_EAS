export const isUser = (error: any): error is User => {
  if (error == null || error == undefined) return false;
  return "username" in error || "token" in error;
};

interface User {
  id?: number;
  username?: string;
  password?: string;
  name?: string;
  gender?: string;
  noTelp?: string;
  role?: "ADMIN" | "CASIER";
  token?: string;
  imageUrl?: string;
}
export default User;

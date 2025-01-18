import { createContext } from "react";

export const AdminContext = createContext<any>(undefined);

const AdminContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = {};
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;

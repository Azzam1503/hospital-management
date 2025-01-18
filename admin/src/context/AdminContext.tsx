import { createContext, useState } from "react";

export const AdminContext = createContext<any>(undefined);

const AdminContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem("Admin token"));

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const value = {
    token,
    setToken,
    backendUrl,
  };
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;

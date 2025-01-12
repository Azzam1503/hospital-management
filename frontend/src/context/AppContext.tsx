import React, { createContext } from "react";
import { doctors } from "../assets/assets_frontend/assets";

export const AppContext = createContext<any>(undefined);

const AppConextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = {
    doctors,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppConextProvider;

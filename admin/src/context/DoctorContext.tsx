import React, { createContext } from "react";

export const DoctorContext = createContext<any>(undefined);

const DoctorContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = {};
  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvider;

import React, { createContext } from "react";

export const AppContext = createContext<any>(undefined);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birtDate = new Date(dob);

    let age = today.getFullYear() - birtDate.getFullYear();
    return age;
  };

  const value = {
    calculateAge,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;

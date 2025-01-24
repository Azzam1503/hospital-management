import React, { createContext } from "react";

export const AppContext = createContext<any>(undefined);

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birtDate = new Date(dob);

    let age = today.getFullYear() - birtDate.getFullYear();
    return age;
  };

  const months = [
    "January",
    "Feburary",
    "March",
    "Apr",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const slotDateFormat = (slotDate: string): string => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] +
      " " +
      months[parseInt(dateArray[1]) - 1] +
      " " +
      dateArray[2]
    );
  };

  const value = {
    calculateAge,
    slotDateFormat,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;

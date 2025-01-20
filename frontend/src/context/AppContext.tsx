import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext<any>(undefined);

const AppConextProvider = ({ children }: { children: React.ReactNode }) => {
  const [doctors, setDoctors] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/doctor/list`);
      if (res.status === 200) {
        setDoctors(res.data.doctors);
      } else {
        throw new Error("Error while fetching doctors");
      }
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    setToken(localStorage.getItem("user_token"));
    getAllDoctors();
  }, []);

  const value = {
    doctors,
    backendUrl,
    token,
    setToken,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppConextProvider;

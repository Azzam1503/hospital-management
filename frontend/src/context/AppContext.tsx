import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext<any>(undefined);

const AppConextProvider = ({ children }: { children: React.ReactNode }) => {
  const [doctors, setDoctors] = useState(null);
  const [userToken, setUserToken] = useState(
    localStorage.getItem("user_token")
  );
  const [userData, setUserData] = useState<UserData | null>(null);

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

  const getUserProfileData = async () => {
    try {
      console.log("I am called");
      const res = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: {
          user_token: userToken,
        },
      });
      console.log(res.data);
      setUserData(res.data.user);
    } catch (error) {
      toast.error("Server Error");
      console.log("error in the getProfileData", error);
    }
  };

  useEffect(() => {
    setUserToken(localStorage.getItem("user_token"));
    getAllDoctors();
  }, []);

  useEffect(() => {
    if (userToken) {
      getUserProfileData();
    } else {
      setUserData(null);
    }
  }, [userToken]);

  const value = {
    doctors,
    backendUrl,
    userToken,
    setUserToken,
    userData,
    setUserData,
    getUserProfileData,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppConextProvider;

interface Address {
  line1: string;
  line2: string;
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  address: Address;
  image: string;
  gender: string;
  dob: string;
}

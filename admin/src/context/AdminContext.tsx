import axios from "axios";
import { createContext, useState } from "react";

export const AdminContext = createContext<any>(undefined);

const AdminContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem("Admin token"));
  const [doctors, setDoctors] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllDoctors = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        headers: {
          token,
        },
      });
      if (res.status === 200) {
        setDoctors(res.data.doctors);
      } else {
        throw new Error("Error while fetching doctors");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    token,
    setToken,
    backendUrl,
    doctors,
    getAllDoctors,
  };
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;

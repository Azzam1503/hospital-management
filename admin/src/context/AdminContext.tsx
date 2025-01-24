import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext<any>(undefined);

const AdminContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem("Admin token"));
  const [doctors, setDoctors] = useState(null);
  const [appointments, setAppointments] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

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

  const changeAvailability = async (docId: string): Promise<void> => {
    try {
      await axios.post(
        `${backendUrl}/api/admin/change-availability`,
        { docId },
        {
          headers: {
            token,
          },
        }
      );
      getAllDoctors();
      toast.success("Availability Changed");
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const getAllAppointments = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/get-appointments`, {
        headers: {
          token,
        },
      });
      console.log(res.data);
      setAppointments(res.data.appointments);
    } catch (error) {
      console.log(error);
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { id },
        {
          headers: {
            token,
          },
        }
      );

      toast.success(res.data.message);
      getAllAppointments();
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const getDashboardData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/dashboard-data`, {
        headers: {
          token,
        },
      });

      console.log(res.data);
      setDashboardData(res.data.data);
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
    changeAvailability,
    appointments,
    getAllAppointments,
    cancelAppointment,
    dashboardData,
    getDashboardData,
  };
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

export default AdminContextProvider;

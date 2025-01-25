import axios from "axios";
import React, { createContext, useState } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext<any>(undefined);

const DoctorContextProvider = ({ children }: { children: React.ReactNode }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [appointments, setAppointments] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [profile, setProfile] = useState(null);

  const [doctorToken, setDoctorToken] = useState(
    localStorage.getItem("Doctor token") || null
  );

  const getDoctorAppointments = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/doctor/get-appointments`, {
        headers: {
          token: doctorToken,
        },
      });

      setAppointments(res.data.appointments.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const completeAppointment = async (id: string) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId: id },
        {
          headers: {
            token: doctorToken,
          },
        }
      );
      toast.success(res.data.message);
      getDoctorAppointments();
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId: id },
        {
          headers: {
            token: doctorToken,
          },
        }
      );
      toast.success(res.data.message);
      getDoctorAppointments();
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  const getDashboardData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/doctor/dashboard-data`, {
        headers: {
          token: doctorToken,
        },
      });
      setDashboardData(res.data.dashboardData);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDoctorProfile = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/doctor/profile`, {
        headers: {
          token: doctorToken,
        },
      });

      console.log(res);
      setProfile(res.data.doctor);
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    backendUrl,
    doctorToken,
    setDoctorToken,
    appointments,
    getDoctorAppointments,
    completeAppointment,
    cancelAppointment,
    dashboardData,
    getDashboardData,
    getDoctorProfile,
    profile,
    setProfile,
  };
  return (
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};

export default DoctorContextProvider;

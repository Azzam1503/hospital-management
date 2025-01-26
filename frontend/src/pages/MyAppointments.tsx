import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyAppointments = () => {
  const { backendUrl, userToken, getAllDoctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [appoinments, setAppointments] = useState([]);

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

  const getUserAppointments = async () => {
    if (!userToken) {
      toast.warn("Login first");
      return navigate("/login");
    }

    try {
      const res = await axios.get(`${backendUrl}/api/user/get-appointments`, {
        headers: {
          user_token: userToken,
        },
      });
      console.log(res.data);
      setAppointments(res.data.appointments.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const cancelAppointment = async (id: string) => {
    try {
      console.log(id);
      const res = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId: id },
        {
          headers: {
            user_token: userToken,
          },
        }
      );
      toast.success("Appointment cancelled");
      getUserAppointments();
      getAllDoctors();
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const finalPayment = async (order: any) => {
    const options = {
      key: import.meta.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response: any) => {
        console.log(response);
        try {
          const { data } = await axios.post(
            `${backendUrl}/api/user/verify-razorpay`,
            { details: response },
            {
              headers: {
                user_token: userToken,
              },
            }
          );

          toast.success(data.message);
          getUserAppointments();
        } catch (error: any) {
          toast.error(error.response.data.message);
          console.log(error);
        }
      },
    };

    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId: string) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/payment-razorpay`,
        { appointmentId },
        {
          headers: {
            user_token: userToken,
          },
        }
      );

      finalPayment(data.order);

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserAppointments();
  }, []);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-300 border-b">
        My appointments
      </p>
      <div>
        {appoinments.length > 0 &&
          appoinments.map((item: any, index: number) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            >
              <div>
                <img
                  className="w-32 bg-indigo-50"
                  src={item.docData.image}
                  alt=""
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">
                  {item.docData.name}
                </p>
                <p>{item.docData.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p className="text-xs">{item.docData.address.line1}</p>
                <p className="text-xs">{item.docData.address.line2}</p>
                <p className="text-xs mt-1">
                  <span className="text-xs text-neutral-700 font-medium">
                    Date & Time:
                  </span>
                  {" " + slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>
              <div></div>
              <div className="flex flex-col gap-2 justify-end">
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">
                    Paid
                  </button>
                )}
                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button
                    onClick={() => {
                      appointmentRazorpay(item._id);
                    }}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Pay Online
                  </button>
                )}

                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border  hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    Cancel appoinment
                  </button>
                )}
                {item.cancelled && !item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment Cancelled
                  </button>
                )}
                {item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border green-red-500 rounded text-green-500">
                    Completed
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyAppointments;

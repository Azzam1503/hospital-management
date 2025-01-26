import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Admin");
  const { setToken, backendUrl } = useContext(AdminContext);
  const { setDoctorToken } = useContext(DoctorContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${backendUrl}/api/${state.toLowerCase()}/login`,
        {
          email,
          password,
        }
      );

      if (res.data.success) {
        console.log("token", res.data.token);
        if (state === "Admin") {
          setToken(res.data.token);
        } else {
          setDoctorToken(res.data.token);
        }

        localStorage.setItem(`${state} token`, res.data.token);

        if (state === "Admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/doctor-dashboard");
        }
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log("Error in login", error);
    }
  };

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5e5e5e] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary">{state}</span> Login{" "}
        </p>
        <div className="w-full">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            required
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </div>
        <div className="w-full">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            required
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </div>
        <button className="bg-primary text-white w-full py-2 rounded-md text-base">
          Login
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login?{" "}
            <span
              onClick={() => setState("Doctor")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span
              onClick={() => setState("Admin")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;

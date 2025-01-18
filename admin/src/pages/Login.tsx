import React, { useState } from "react";
import { assets } from "../assets/assets_admin/assets";

const Login = () => {
  const [state, setState] = useState("Admin");

  return (
    <form className="min-h-[80vh] flex items-center">
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
          />
        </div>
        <div className="w-full">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            required
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
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

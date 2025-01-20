import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [state, setState] = useState("Sign up");
  const { setUserToken, backendUrl, userToken } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (state === "Sign up") {
        const res = await axios.post(`${backendUrl}/api/user/register`, {
          email,
          password,
          name,
        });
        console.log(res.data);
        if (res.data.success) {
          toast.success("Registered Successfully");
          setUserToken(res.data.user_token);
          localStorage.setItem("user_token", res.data.user_token);
        }
      } else {
        const res = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        console.log(res.data);
        if (res.data.success) {
          toast.success("Logged In Successfully");
          setUserToken(res.data.user_token);
          localStorage.setItem("user_token", res.data.user_token);
        }
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (userToken) {
      navigate("/");
    }
  }, [userToken]);

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign up" ? "Create Account" : "Login"} to book
          appointment
        </p>
        {state === "Sign up" && (
          <div className="w-full">
            <label htmlFor="name">Full Name</label>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
            />
          </div>
        )}
        <div className="w-full">
          <label htmlFor="email">Email</label>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <div className="w-full">
          <label htmlFor="password">Password</label>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="text"
            id="password"
            name="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary py-2 text-white rounded-md text-base"
        >
          {state === "Sign up" ? "Create Account" : "Login"}
        </button>
        {state === "Sign up" ? (
          <p onClick={() => setState("Login")}>
            Already have an account?{" "}
            <span className="cursor-pointer text-primary underline">
              Login here
            </span>
          </p>
        ) : (
          <p onClick={() => setState("Sign up")}>
            Don't have an account?{" "}
            <span className="cursor-pointer text-primary underline">
              Create here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;

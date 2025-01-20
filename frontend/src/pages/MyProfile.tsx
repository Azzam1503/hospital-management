import React, { useContext, useEffect, useState } from "react";
import { AppContext, UserData } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets_frontend/assets";

const MyProfile = () => {
  const { userToken, userData, setUserData, backendUrl, getUserProfileData } =
    useContext(AppContext);
  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (!userToken) navigate("/login");
  }, []);

  const updateUserProfile = async () => {
    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("dob", userData.dob);
      formData.append("gender", userData.gender);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("phone", userData.phone);

      image !== null && formData.append("image", image);

      const res = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        {
          headers: {
            user_token: userToken,
          },
        }
      );

      console.log(res.data);
      toast.success(res.data.message);
      await getUserProfileData();
      console.log("reached here");
      setIsEdit(false);
      setImage(null);
    } catch (error: any) {
      console.log("here in the error", error);
      toast.error(error.response.data.message);
    }
  };

  return (
    userData && (
      <div className="max-w-lg flex flex-col gap-2 text-sm">
        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="w-36 rounded opacity-75"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt=""
              />
              <img
                className="w-10 absolute bottom-12 right-12"
                src={image ? "" : assets.upload_icon}
                alt=""
              />
            </div>
            <input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setImage(e.target.files ? e.target.files[0] : null);
              }}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img className="w-36 rounded" src={userData?.image} alt="" />
        )}
        {isEdit ? (
          <input
            className="bg-gray-100 text-3xl font-medium max-w-60 mt-4"
            type="text"
            value={userData.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUserData((prev: UserData) => ({
                ...prev,
                ["name"]: e.target.value,
              }))
            }
          />
        ) : (
          <p className="font-medium text-3xl text-neutral-800 mt-4">
            {userData.name}
          </p>
        )}

        <hr className="bg-zinc-400 h-[1px] border-none" />
        <div>
          <p className="text-neutral-500 underline mt-3">CONTACT INFROMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Email id:</p>
            <p className="text-blue-500">{userData.email}</p>
            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                className="bg-gray-100 max-w-52"
                type="text"
                value={userData.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUserData((prev: UserData) => ({
                    ...prev,
                    ["phone"]: e.target.value,
                  }))
                }
              />
            ) : (
              <p className="text-blue-500">{userData.phone}</p>
            )}
            <p className="font-medium">Address:</p>
            {isEdit ? (
              <p>
                <input
                  type="text"
                  value={userData.address.line1}
                  className="bg-gray-100 max"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUserData((prev: UserData) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                />
                <br />
                <input
                  type="text"
                  value={userData.address.line2}
                  className="bg-gray-100 max"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUserData((prev: UserData) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                />
              </p>
            ) : (
              <p className="text-gray-500">
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </div>
        </div>
        <div>
          <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                className="max-w-20 bg-gray-100"
                value={userData.gender}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setUserData((prev: UserData) => ({
                    ...prev,
                    ["gender"]: e.target.value,
                  }))
                }
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            ) : (
              <p className="text-gray-400">{userData.gender}</p>
            )}

            <p>Birthday:</p>
            {isEdit ? (
              <input
                className="max-w-28 bg-gray-100"
                type="date"
                onChange={(e: React.ChangeEvent<HTMLDataElement>) => {
                  setUserData((prev: UserData) => ({
                    ...prev,
                    ["dob"]: e.target.value,
                  }));
                }}
              />
            ) : (
              <p className="text-gray-400">{userData.dob}</p>
            )}
          </div>
        </div>

        <div className="mt-10">
          {isEdit ? (
            <button
              className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
              onClick={() => {
                updateUserProfile();
              }}
            >
              Save Information
            </button>
          ) : (
            <button
              className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;

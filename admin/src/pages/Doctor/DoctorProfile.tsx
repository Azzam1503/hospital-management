import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";

const DoctorProfile = () => {
  const { getDoctorProfile, profile, doctorToken, setProfile } =
    useContext(DoctorContext);
  const { backendUrl } = useContext(AdminContext);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!doctorToken) {
      toast.warn("Login first");
      navigate("/login");
      return;
    }
    getDoctorProfile();
  }, [doctorToken]);

  const updateProfile = async () => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/doctor/update-profile`,
        {
          address: profile.address,
          available: profile.available,
          fee: profile.fee,
        },
        {
          headers: {
            token: doctorToken,
          },
        }
      );
      console.log(res);
      getDoctorProfile();
      setIsEdit(false);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Error while updating");
      console.log(error);
    }
  };

  return (
    profile && (
      <div>
        <div className="flex flex-col gap-4 m-5">
          <div className="bg-primary/80 w-full sm:max-w-64 rounded-lg">
            <img src={profile.image} alt="" />
          </div>
          <div className="flex-1 border border-stone-100 rounded-lg bg-white">
            <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
              {profile.name}
            </p>
            <div className="flex items-center gap-2 mt-1 text-gray-600">
              <p>
                {profile.degree} - {profile.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {profile.experience}
              </button>
            </div>

            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
                About:
              </p>
              <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                {profile.about}
              </p>
            </div>

            <p className="text-gray-600 font-medium mt-4">
              Appointment Fee:{" "}
              <span className="text-gray-800">
                $
                {isEdit ? (
                  <input
                    type="number"
                    value={profile.fee}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProfile((prev: any) => ({
                        ...prev,
                        fee: e.target.value,
                      }))
                    }
                  />
                ) : (
                  profile.fee
                )}
              </span>
            </p>

            <div className="flex gap-2 py-2">
              <p className="text-sm">Address:</p>
              <p>
                {isEdit ? (
                  <input
                    type="text"
                    value={profile.address.line1}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProfile((prev: any) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                  />
                ) : (
                  profile.address.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    type="text"
                    value={profile.address.line2}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProfile((prev: any) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                  />
                ) : (
                  profile.address.line2
                )}
              </p>
            </div>

            <div className="flex gap-1 pt-2">
              <input
                onChange={() =>
                  isEdit &&
                  setProfile((prev: any) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                type="checkbox"
                name=""
                checked={profile.available}
              />
              <label htmlFor="">Available</label>
            </div>
            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-1 border border-primary text-sm rounded-full mt-5 hover:bg-primary hover:text-white transition-all"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;

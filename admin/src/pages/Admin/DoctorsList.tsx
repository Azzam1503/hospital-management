import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const DoctorsList = () => {
  const { getAllDoctors, token, doctors } = useContext(AdminContext);
  useEffect(() => {
    if (token) {
      getAllDoctors();
      console.log(doctors);
    }
  }, [token]);

  return (
    <div className="m-5 max-h-[90vh] overflow-scroll">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors &&
          doctors.map((doctor: any) => (
            <div
              key={doctor._id}
              className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer group"
            >
              <img
                className="bg-indigo-50 group hover:bg-primary transition-all duration-500"
                src={doctor.image}
                alt=""
              />
              <div className="p-4">
                <p className="text-neutral-800 text-lg font-medium">
                  {doctor.name}
                </p>
                <p className="text-zinc-600 text-sm">{doctor.speciality}</p>
              </div>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <input type="checkbox" checked={doctor.available} />
                <p>Available</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DoctorsList;

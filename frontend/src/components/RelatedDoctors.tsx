import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

interface props {
  docId: string | undefined;
  speciality: string;
}

const RelatedDoctors: React.FC<props> = ({ docId, speciality }) => {
  const { doctors } = useContext(AppContext);
  const [relDoctors, setRelDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(doctors);
    console.log(doctors.length);
    console.log(speciality);
    if (doctors.length > 0 && speciality.length > 0) {
      console.log("condition is true");
      const dcotorsData = doctors.filter(
        (doc: any) => doc.speciality === speciality && doc._id != docId
      );
      setRelDoctors(dcotorsData);
      console.log("rel", relDoctors);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:x-10">
      <h1 className="text-3xl font-medium">Related Doctors</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply Browse through our extensive list of trusted doctors
      </p>
      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {relDoctors.slice(0, 5).map((item: any, ind: number) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={ind}
          >
            <img className="bg-blue-50" src={item.image} alt="" />
            <div className="p-4">
              <div className="flex items-center gap-4 text-sm text-center text-green-500">
                <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                <p>Available</p>
              </div>
              <p className="text-gray-900 text-lg font-medium">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedDoctors;

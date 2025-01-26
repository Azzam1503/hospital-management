import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, userToken, backendUrl, getAllDoctors } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState<any>(null);
  const [docSlots, setDocSlots] = useState<any>([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDoctorInfo = async () => {
    if (doctors === null) {
      console.log("returned-------");
      return;
    }
    const docInfo = doctors.find(
      (doc: { _id: string | undefined }) => doc._id === docId
    );
    setDocInfo(docInfo);
  };

  const navigate = useNavigate();

  const getAvailableSlots = async () => {
    if (!docInfo) return;
    setDocSlots([]);

    //getting curr date
    let today = new Date();
    console.log(today);

    for (let i = 0; i < 7; i++) {
      //getting date with index
      let currDate = new Date(today);
      currDate.setDate(today.getDate() + i);

      //setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      //setting hours
      if (today.getDate() === currDate.getDate()) {
        currDate.setHours(
          currDate.getHours() > 10 ? currDate.getHours() + 1 : 10
        );
        currDate.setMinutes(currDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currDate.setHours(10);
        currDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currDate < endTime) {
        let formattedTime = currDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currDate.getDate();
        let month = currDate.getMonth() + 1;
        let year = currDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;
        let isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        //add slots to array
        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currDate),
            time: formattedTime,
          });
        }

        //increment curr time by 30 min
        currDate.setMinutes(currDate.getMinutes() + 30);
      }

      setDocSlots((prev: any) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!userToken) {
      console.log(userToken);
      toast.warn("Login First");
      return navigate("/login");
    }

    try {
      console.log("object");
      const date = docSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotTime, slotDate },
        {
          headers: {
            user_token: userToken,
          },
        }
      );
      console.log(data);
      toast.success(data.message);
      getAllDoctors();
      navigate("/my-appointments");
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDoctorInfo();
    console.log("docInfo is here", docInfo);
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  return (
    docInfo && (
      <div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo?.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
                <button className="py-0.5 px-2 ml-1 border text-xs rounded-full">
                  {docInfo.experience}
                </button>
              </p>
            </div>

            <div>
              <p className="flex items-center gap-1 text.sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>

            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600"> ${docInfo.fee}</span>
            </p>
          </div>
        </div>
        {/*-----Booking slots------*/}
        <div className="sm:ml-72 sm:pl-4 mt-2 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots.map((item: any, index: number) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length &&
              docSlots[slotIndex].map((item: any, index: number) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "text-gray-400 border border-gray-300"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <div>
            <button
              onClick={bookAppointment}
              className="bg-primary text-white text-sm font-light px-4 py-3 rounded-full my-6"
            >
              Book an appointment
            </button>
          </div>
        </div>
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;

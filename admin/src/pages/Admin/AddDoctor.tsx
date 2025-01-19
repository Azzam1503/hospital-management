import React, { ReactHTML, useContext, useState } from "react";
import { assets } from "../../assets/assets_admin/assets";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";

const AddDoctor = () => {
  const { backendUrl, token } = useContext(AdminContext);

  const [docImg, setDocImg] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 year");
  const [fee, setFee] = useState("1 year");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General Physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (docImg === null) {
        toast.error("No image selected");
        return;
      }
      console.log(name, email, password, experience, degree);
      const formdata = new FormData();
      formdata.append("name", name);
      formdata.append("email", email);
      formdata.append("password", password);
      formdata.append("experience", experience);
      formdata.append("degree", degree);
      formdata.append("fee", fee);
      formdata.append("speciality", speciality);
      formdata.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );
      formdata.append("about", about);
      formdata.append("image", docImg);
      const res = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formdata,
        {
          headers: {
            token,
          },
        }
      );
      console.log(res);
      if (res.status === 200) {
        console.log("res is here");
        setDocImg(null);
        setName("");
        setEmail("");
        setPassword("");
        setDegree("");
        setFee("");
        setAbout("");
        setAddress1("");
        setAddress2("");
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };
  // "Content-Type": "multipart/form-data",
  return (
    <form className="m-5 w-full" onSubmit={handleSubmit}>
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex item-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={
                docImg !== null
                  ? URL.createObjectURL(docImg)
                  : assets.upload_area
              }
              alt=""
            />
          </label>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setDocImg(e.target.files ? e.target.files[0] : null);
            }}
            type="file"
            id="doc-img"
            hidden
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor name</p>
              <input
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                type="text"
                required
                placeholder="Name"
                className="border-rounded px-3 py-2"
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                type="email"
                required
                placeholder="email"
                className="border-rounded px-3 py-2"
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                type="password"
                required
                className="border-rounded px-3 py-2"
                placeholder="password"
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Experience</p>
              <select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setExperience(e.target.value)
                }
                className="border-rounded px-3 py-2"
              >
                <option value="1 year">1 year</option>
                <option value="2 year">2 year</option>
                <option value="3 year">3 year</option>
                <option value="4 year">4 year</option>
                <option value="5 year">5 year</option>
                <option value="6 year">6 year</option>
                <option value="7 year">7 year</option>
                <option value="8 year">8 year</option>
                <option value="8 year">8 year</option>
                <option value="10 year">10 year</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input
                value={fee}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFee(e.target.value)
                }
                type="number"
                required
                placeholder="enter the fee"
                className="border-rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSpeciality(e.target.value)
                }
                className="border-rounded px-3 py-2"
              >
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Education</p>
              <input
                value={degree}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDegree(e.target.value)
                }
                type="text"
                placeholder="Education"
                required
                className="border-rounded px-3 py-2"
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                value={address1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAddress1(e.target.value)
                }
                type="text"
                placeholder="address 1"
                required
                className="border-rounded px-3 py-2"
              />
              <input
                value={address2}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAddress2(e.target.value)
                }
                type="text"
                placeholder="address 2"
                required
                className="border-rounded px-3 py-2"
              />
            </div>
          </div>
        </div>
        <div>
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
            value={about}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setAbout(e.target.value)
            }
            placeholder="write about doctor"
            rows={5}
            required
            className="w-full px-4 pt-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-primary px-10 py-3 mt-3 text-white rounded-full"
        >
          Add Doctor{" "}
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;

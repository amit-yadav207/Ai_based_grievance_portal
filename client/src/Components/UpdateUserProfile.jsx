import React, { useState } from "react";
import axios from "axios";
import Loading from "./Loading";

export default function UpdateUserProfile(props) {
  // const BASE_URL="http://localhost:5000/api/v1"
  const BASE_URL="https://ai-based-grievance-portal.onrender.com/api/v1"

  const [data, setData] = useState({
    name: "",
    age: "",
    phone: "",
    district: "",
  });

  function handleChange(e) {
    setData({ ...data, [e.target.name]: e.target.value });
  }

  const token = localStorage.getItem("token");

  let config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `${BASE_URL}/user`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: data,
  };

  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!data.name || !data.age || !data.phone || !data.district) {
      alert("Please fill all the fields");
      return;
    } else {
      setLoading(true);
      axios
        .request(config)
        .then((response) => {
          setLoading(false);
          alert("Profile Updated Successfully");
          window.location.reload(true);
        })
        .catch((error) => {
          console.log(error);
          alert("Error Occurred:" + error.response.data.message);
        });
    }
  }

  function checkLogin() {
    if (!token) {
      navigate("/userAdminLogin");
    }
  }

  return (
    <>
      {checkLogin}
      <div
        className={
          props.visible === "update"
            ? "p-4 update-profile-content dashboard w-full md:w-3/4 h-100  pt-16"
            : "hidden"
        }
      >
        <h1 className="text-center text-4xl md:text-7xl font-semibold">
          UPDATE YOUR PROFILE
        </h1>
        <div className="mt-16 flex justify-center">
          <form
            className="flex flex-col gap-4 w-full max-w-lg p-6 border border-gray-300 rounded-xl shadow-2xl"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Name"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-light-blue-500"
              onChange={handleChange}
            />
            <input
              type="number"
              name="age"
              id="age"
              placeholder="Age"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-light-blue-500"
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              id="phone"
              placeholder="Contact Number"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-light-blue-500"
              onChange={handleChange}
            />
            <input
              type="text"
              name="district"
              id="district"
              placeholder="District"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:border-light-blue-500"
              onChange={handleChange}
            />
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-light-green p-3 w-40 rounded-md text-white text-xl font-semibold hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-300"
              >
                {loading ? <Loading /> : "UPDATE"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

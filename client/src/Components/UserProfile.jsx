import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import pfp from "../Images/pfp.png";

export default function UserProfile(props) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/userAdminLogin");
    } else {
      axios
        .get("http://localhost:3000/api/v1/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserData(response.data.user);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          alert("Error Occurred");
        });
    }
  }, [navigate, token]);

  return (
    <>
      <div
        className={`${
          props.visible === "profile" && !loading
            ? "p-4 view-profile-content dashboard w-full md:w-3/4 h-100 pt-16"
            : "hidden"
        }`}
      >
        <h1 className="text-center text-3xl md:text-4xl lg:text-5xl font-semibold mb-8">YOUR PROFILE</h1>
        <div className="flex justify-center">
          <div className="bg-white border border-gray-300 shadow-lg rounded-xl p-8 md:w-4/6 mt-12 md:mt-24">
            <ProfileItem label="Name" value={userData.name} />
            <ProfileItem label="Email" value={userData.email} />
            <ProfileItem label="Phone Number" value={userData.phone} />
            <ProfileItem label="Age" value={userData.age} />
            <ProfileItem label="District" value={userData.district} />
          </div>
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
}

const ProfileItem = ({ label, value }) => (
  <div className="flex justify-between items-center border-b py-3">
    <h4 className="text-lg md:text-xl font-semibold">{label}</h4>
    <h4 className="text-lg md:text-xl">{value}</h4>
  </div>
);

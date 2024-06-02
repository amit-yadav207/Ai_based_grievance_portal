import React, { useState, useEffect } from "react";
import UserNavbar from "./UserNavbar";
import axios from "axios";
import Dashboard from "./Dashboard";
import UserProfile from "./UserProfile";
import UpdateUserProfile from "./UpdateUserProfile";
import FileNewGrievance from "./FileNewGrievance";
import MyGrievance from "./MyGrievance";
import Footer from "./Footer";
import Chatbot from "./Chatbot";
export default function UserPage() {
  const [items, setItems] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const [isClicked, setIsClicked] = useState("1");
  const [visible, setVisible] = useState("profile");
  // const BASE_URL="http://localhost:5000/api/v1"
  const BASE_URL="https://ai-based-grievance-portal.onrender.com/api/v1"

  useEffect(() => {
    if (localStorage.getItem("token") == null) {
      window.location.href = "/userlogin";
    }
    const api = `${BASE_URL}/user`;
    const token = localStorage.getItem("token");
    axios
      .get(api, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        // console.log("res ",res.data);
        setItems(res.data);
        setIsLoaded(true);
        setRedirectToReferrer(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        // Handle error, e.g., show error message
      });
  }, []);

  function handleClick(val, vis) {
    setIsClicked(val);
    setVisible(vis);
  }

  return (
    <div className={localStorage.getItem("token") == null ? "hidden" : ""}>
      <div className="User-Page">
        <div className="navbar hidden md:block">
          <UserNavbar first="" second="" third="" button="logout" hidden={true} />
        </div>
        <div className="navbar md:hidden">
          <UserNavbar
            first="HOME"
            second="GRIEVANCE"
            third="NEW"
            fourth="UPDATE PROFILE"
            hidden={true}
            handle={handleClick}
          />
        </div>
        <div className="User-page-content h-100 hidden md:flex">
          <Dashboard
            clicked={isClicked}
            visible={visible}
            handle={handleClick}
            first={"HOME"}
            second="MY GRIEVANCE"
            third="NEW GRIEVANCE"
            fourth="UPDATE PROFILE"
          />
          <UserProfile
            visible={visible}
            uName={"Amit yadav"}
            mail={"amity.cs.21@nitj.ac.in"}
            contact={"0123456789"}
            address={"NIT Jalandhar"}
          />
          <FileNewGrievance visible={visible} />
          <MyGrievance visible={visible} />
          <UpdateUserProfile visible={visible} />
        </div>
        <div className="User-page-content h-100 md:hidden relative">
          <UserProfile
            visible={visible}
            uName={"Jiya Mittal"}
            mail={"jiya.cs.21@nitj.ac.in"}
            contact={"0123456789"}
            address={"NITJ Jalandhar"}
          />
          <FileNewGrievance visible={visible} />
          <MyGrievance visible={visible} />
          <UpdateUserProfile visible={visible} />
        </div>
        <Chatbot/>
        <Footer className="z-10" />
      </div>
    </div>
  );
}

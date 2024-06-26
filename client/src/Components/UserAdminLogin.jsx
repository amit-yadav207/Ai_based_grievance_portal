import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";   
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import Loading from "./Loading";

function Login(props){
  const [loginData, setLoginData] = React.useState({email:"", password:""});
  const [user, setUser] = React.useState("Citizen");
  const BASE_URL="https://ai-based-grievance-portal.onrender.com/api/v1"
  function handleChange(e){
    setLoginData({...loginData, [e.target.name]:e.target.value});
  }
  
  function handleUserChange(e){
    setUser(e.target.value);
  }

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(loginData.email === "" || loginData.password === ""){
      alert("Please fill all the fields");
    } else { 
      try {
        const url = user === "Citizen" ? `${BASE_URL}/auth/login` : 
                    user === "Officer" ? `${BASE_URL}/auth/officer/login` : 
                                          `${BASE_URL}/auth/admin/login`;
        const config = {
          method: "post",
          maxBodyLength: Infinity,
          url: url,
          headers: {
            Authorization: "Bearer ",
            "Content-Type": "application/json",
          },
          data: loginData,
        };

        const response = await axios.request(config);
        console.log("got user")
        console.log(JSON.stringify(response.data));
        localStorage.setItem("token", response.data.token);
        setLoading(false);
        navigate(user === "Citizen" ? "/userpage" : user === "Officer" ? "/adminpage" : "/MainAdminPage");
      } catch (error) {
        if(error.response && error.response.status === 401){
          alert("Invalid Credentials");
        }
        console.log("error in handleSubmit", error);
      }
    }
  }
  
  const [loading, setLoading] = React.useState(false);
  
  function forgotPassword(){
    navigate("/ForgotPassword");
  }
  
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <Navbar />
      <div className="flex-row md:flex  md:h-100 mt-0 ">
        <div className="  px-8 md:w-2/3 ">
          <div className="md:px-20 px-10 pt-20  md:pt-48 py-20 ">
            <div className="w-full md:w-2/3 h-64 ">
              <h2 className=" mt-0 text-6xl font-bold text-dark-blue">PORTAL</h2>

              <p className=" mt-4 text  md:text-2xl text-dark-blue ">
                This web application allows the concerned users and admins to
                communicate regarding the grievances with the provided features
                in order to simplify the tedious procedure of listing the
                grievances.
              </p>
            </div>
          </div>
        </div>

        <div className=" md:px-36 px-10 py-20  bg-dark-blue">
          <div className="">
            <p className="mt-3  text-2xl text-white">
              Sign in to access your account
            </p>
          </div>

          <div className="mt-8">
            <div>
              <div>
                <label htmlFor="email" className="block text-sm text-white">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="example@example.com"
                  className="block w-full px-4 py-2 mt-2 bg-white rounded-md"
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="mt-6">
                <div className="flex justify-between mb-2">
                  <label htmlFor="password" className="text-sm text-white">
                    Password
                  </label>
                  <button
                    href="#"
                    className="text-sm text-gray-400 text-white hover:underline"
                    onClick={forgotPassword}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="flex justify-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Your Password"
                    className="block w-full px-4 py-2 mt-2 bg-white  rounded-md"
                    onChange={(e) => handleChange(e)}
                  />
                  <button
                    onClick={togglePasswordVisibility}
                    className="text-white p-2 rounded-3xl m-auto  "
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="userRole" className="text-white block mb-2">User Role:</label>
                <select
                  id="userRole"
                  name="userRole"
                  value={user}
                  onChange={handleUserChange}
                  className="block w-full px-4 py-2 mt-2 bg-white rounded-md"
                >
                  <option value="Citizen">Citizen</option>
                  <option value="Officer">Officer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="mt-6 flex justify-center ">
                <button
                  className="w-1/2 hover:animate-bounce  px-4 py-2  text-white bg-light-green rounded-md"
                  onClick={handleSubmit}
                >
                  Sign in
                </button>
                {loading && <Loading />}
              </div>
            </div>

            <p className="mt-6 text-sm text-center text-white">
              Don't have an account yet?{" "}
              <NavLink to="/" className="text-light-green hover:underline">
                Sign up
              </NavLink>
              .
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;

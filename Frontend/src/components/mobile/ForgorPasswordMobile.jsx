import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backBtn = (
  <FontAwesomeIcon icon={faArrowLeft} className="text-2xl px-5 py-5" />
);

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [forgotPassData, setForgotPassData] = useState({
    email: "",
    password: "",
    newPassword: "",
  });

  useEffect(() => {
    document.title = "!Facebook - forgot-password";

    axios
      .get("http://localhost:5000/user", {
        withCredentials: true,
      })
      .then((res) => res.data)
      .then((data) => {
        if (data.logged_in) {
          navigate("/dashboard");
        }
      });
  }, [navigate]);

  try {
    const handleReset = axios.post(
      "http://localhost:5000/forgot_password",
      forgotPassData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    navigate("/");
  } catch (error) {
    Console.error("Something went wrong");
  }

  return (
    <>
      <Link to={"/"}>{backBtn}</Link>
      <div className="h-[100vh] w-[100%] p-5 flex flex-col gap-2">
        <div>
          <h1 className="font-semibold text-2xl">Reset Password</h1>
        </div>
        <div>
          <input
            type="email"
            placeholder="Enter email"
            className="border-1 p-3 w-full rounded-2xl text-lg focus:outline-1 focus:outline-blue-500"
          />
          <input
            type="password"
            placeholder="Old password"
            className="border-1 p-3 w-full rounded-2xl text-lg focus:outline-1 focus:outline-blue-500"
          />
          <input
            type="password"
            placeholder="New password"
            className="border-1 p-3 w-full rounded-2xl text-lg focus:outline-1 focus:outline-blue-500"
          />
        </div>
      </div>
    </>
  );
}

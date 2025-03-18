import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faArrowLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer";

const backBtn = (
  <FontAwesomeIcon icon={faArrowLeft} className="text-2xl px-5 py-5" />
);
const show = <FontAwesomeIcon icon={faEye} className="text-gray-500" />;
const hide = <FontAwesomeIcon icon={faEyeSlash} className="text-gray-500" />;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [passwordVisibility, setPasswordVisibility] = useState({
    oldPassword: true,
    newPassword: true,
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [forgotPassData, setForgotPassData] = useState({
    email: "",
    password: "",
    newPassword: "",
  });

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    document.title = "Facebook - Forgot Password";
    axios
      .get("http://localhost:5000/user", { withCredentials: true })
      .then((res) => res.data)
      .then((data) => {
        if (data.logged_in) navigate(data.redirect);
      });
  }, [navigate]);

  useEffect(() => {
    if (
      forgotPassData.password &&
      forgotPassData.password === forgotPassData.newPassword
    ) {
      setError("New password cannot be the same as old password.");
    } else {
      setError("");
    }
  }, [forgotPassData.password, forgotPassData.newPassword]);

  const handleReset = async (e) => {
    e.preventDefault();
    setInvalidEmail(false);

    try {
      await axios.post(
        "http://localhost:5000/forgot_password",
        forgotPassData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      navigate("/");
    } catch (error) {
      if (error.response?.status === 401) {
        setError("The password you've entered is incorrect.");
      } else if (error.response?.status === 400) {
        setInvalidEmail(true);
      } else {
        setErrors("Error resetting password. Please try again later.");
        console.error("Reset password error:", error);
      }
    }
  };

  return (
    <>
      <Link to={"/"}>{backBtn}</Link>
      <div className="h-[90vh] w-[100%] p-5 flex flex-col gap-9">
        <div>
          <h1 className="font-semibold text-2xl">Reset Password</h1>
          <p>
            Choose a strong password with at least 8 characters, including
            uppercase, lowercase, numbers, and symbols.
          </p>
        </div>
        <form onSubmit={handleReset} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Enter email"
            value={forgotPassData.email}
            autoComplete="off"
            onChange={(e) =>
              setForgotPassData({ ...forgotPassData, email: e.target.value })
            }
            className="border-1 p-3 w-full rounded-2xl text-lg focus:outline-1 focus:outline-blue-500"
          />
          {invalidEmail && (
            <p className="text-red-500 text-sm">
              No user found with this email.
            </p>
          )}
          <div className="flex border-1 p-3 w-full rounded-2xl text-lg focus:outline-1 focus:outline-blue-500">
            <input
              type={passwordVisibility.oldPassword ? "password" : "text"}
              placeholder="Old password"
              value={forgotPassData.password}
              autoComplete="off"
              onChange={(e) =>
                setForgotPassData({
                  ...forgotPassData,
                  password: e.target.value,
                })
              }
              className="w-[95%] outline-0"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("oldPassword")}
            >
              {passwordVisibility.oldPassword ? show : hide}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex border-1 p-3 w-full rounded-2xl text-lg focus:outline-1 focus:outline-blue-500">
            <input
              type={passwordVisibility.newPassword ? "password" : "text"}
              placeholder="New password"
              value={forgotPassData.newPassword}
              autoComplete="off"
              onChange={(e) =>
                setForgotPassData({
                  ...forgotPassData,
                  newPassword: e.target.value,
                })
              }
              className="w-[95%] outline-0"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("newPassword")}
            >
              {passwordVisibility.newPassword ? show : hide}
            </button>
          </div>

          {errors && <p className="text-red-500 text-sm">{errors}</p>}

          <button
            type="submit"
            className="bg-[#1333E7] mt-3 py-4 rounded-[50px] text-white text-lg"
          >
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

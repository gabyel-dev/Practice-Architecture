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

  function validatePassword(password) {
    const errors = [];
    if (!/[a-z]/.test(password))
      errors.push("• At least one lowercase letter required.");
    if (!/[A-Z]/.test(password))
      errors.push("• At least one uppercase letter required.");
    if (!/\d/.test(password)) errors.push("• At least one number required.");
    if (!/\W/.test(password))
      errors.push("• At least one special character required.");
    if (password.length < 8)
      errors.push("• Password must be at least 8 characters long.");
    return errors.length === 0 ? true : errors;
  }

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    document.title = "Facebook - Forgot Password";
    axios
      .get("epbi-production.up.railway.app/user", { withCredentials: true })
      .then((res) => res.data)
      .then((data) => {
        if (data.logged_in) navigate(data.redirect);
      })
      .catch((err) => console.error("Error fetching user data:", err));
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
        "epbi-production.up.railway.app/forgot_password",
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
            className="border border-gray-300 p-3 w-full rounded-2xl text-lg focus:outline-1 focus:outline-blue-500"
          />
          {invalidEmail && (
            <p className="text-red-500 text-sm">
              No user found with this email.
            </p>
          )}

          <div className="flex border border-gray-300 p-3 w-full rounded-2xl text-lg focus:outline-1 focus:outline-blue-500">
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

          <div className="flex border border-gray-300 p-3 w-full rounded-2xl text-lg focus:outline-1 focus:outline-blue-500">
            <input
              type={passwordVisibility.newPassword ? "password" : "text"}
              placeholder="New password"
              value={forgotPassData.newPassword}
              autoComplete="off"
              onChange={(e) => {
                setForgotPassData({
                  ...forgotPassData,
                  newPassword: e.target.value,
                });
                const validation = validatePassword(e.target.value);
                setErrors(validation === true ? "" : validation.join("\n"));
              }}
              className="w-[95%] outline-0"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("newPassword")}
            >
              {passwordVisibility.newPassword ? show : hide}
            </button>
          </div>

          {errors && (
            <div className="text-red-500 text-sm flex flex-col text-left">
              {errors.split("\n").map((err, index) => (
                <p key={index}>{err}</p>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={
              !forgotPassData.email ||
              !forgotPassData.password ||
              !forgotPassData.newPassword
            }
            className={`mt-3 py-4 rounded-[50px] text-white text-lg ${
              !forgotPassData.email ||
              !forgotPassData.password ||
              !forgotPassData.newPassword
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1333E7]"
            }`}
          >
            Submit
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}

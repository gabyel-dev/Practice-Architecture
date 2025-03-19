import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/base.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [errorMsg, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    newPassword: "",
  });

  const validatePassword = (newPassword) => {
    const errors = [];

    if (!/[a-z]/.test(newPassword))
      errors.push("• At least one lowercase letter required.");
    if (!/[A-Z]/.test(newPassword))
      errors.push("• At least one uppercase letter required.");
    if (!/\d/.test(newPassword)) errors.push("• At least one number required.");
    if (!/\W/.test(newPassword))
      errors.push("• At least one special character required.");
    if (newPassword.length < 8)
      errors.push("• Password must be at least 8 characters long.");

    return errors.length === 0 ? true : errors;
  };

  useEffect(() => {
    axios
      .get("https://epbi-production.up.railway.app/user", {
        withCredentials: true,
      })
      .then((res) => res.data)
      .then((data) => {
        if (data.logged_in) {
          navigate("/dashboard");
        }
      });
  }, [navigate]);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear previous errors
    try {
      axios.post(
        "https://epbi-production.up.railway.app/forgot_password",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      navigate("/");
    } catch {
      if (error.response?.status === 401) {
        setErrorMessage("The password you've entered is incorrect.");
      } else if (error.response?.status === 400) {
        setErrorMessage("Invalid login credentials.");
      } else {
        setErrorMessage("Error logging in. Please try again later.");
        console.error("Login error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <form
          onSubmit={handleReset}
          className="flex flex-col gap-2 justify-center items-center min-w-[400px] max-w-[400px] p-4 rounded-lg shadow-md bg-[#feffff]"
        >
          <h1 className="text-[1.6em] font-bold">Reset Password</h1>
          <hr className="border-t-1 border-gray-300 w-[109%] mt-2 mb-4" />
          <input
            type="text"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            required
            className="w-[100%] h-13 text-md border-gray-200 border-2 rounded-md p-3 focus:outline-1 focus:outline-[#0866ff]"
          />

          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
            className="w-full h-13 text-md border-gray-200 border-2 rounded-md p-3 focus:outline-1 focus:outline-[#0866ff]"
          />

          <input
            type="password"
            placeholder="New password"
            value={loginData.newPassword}
            onChange={(e) => {
              setLoginData({ ...loginData, newPassword: e.target.value });
              const validatePass = validatePassword(e.target.value);
              setError(validatePass === true ? "" : validatePass.join("\n"));
            }}
            required
            className="w-full h-13 text-md border-gray-200 border-2 rounded-md p-3 focus:outline-1 focus:outline-[#0866ff]"
          />

          {errorMsg && (
            <p className="text-red-500 text-[0.8em]">
              {errorMsg}{" "}
              <Link to="/" className="font-semibold">
                Back
              </Link>
            </p>
          )}

          {error && (
            <div className="bg-[#f2f5f6] p-2 rounded-md flex flex-col w-[100%]">
              <p className="text-left text-[0.8rem] text-red-500 flex flex-col">
                {error.split("\n").map((str, i) => (
                  <span key={i}>{str}</span>
                ))}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#0866ff] rounded-[5px] text-white pt-2 pb-2 font-bold text-[1.3em] cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {loading ? "Submit" : "Submit"}
          </button>
          <Link to={"/"} className="text-[1em] text-[#0866ff] pb-2 pt-3">
            Back to login
          </Link>
        </form>
      </div>
    </>
  );
}

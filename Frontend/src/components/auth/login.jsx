import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/base.css";
import "./css/mobileLogin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const show = <FontAwesomeIcon icon={faEye} className="text-gray-500" />;
const hide = <FontAwesomeIcon icon={faEyeSlash} className="text-gray-500" />;

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    showPassword: true,
  });
  const [errorMsg, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "" });
  const passwordRef = useRef(null); // Use ref instead of state for passwords

  const handleClick = (e) => {
    e.preventDefault();
    setValues({ showPassword: !values.showPassword });
  };

  useEffect(() => {
    document.title = "!Facebook - Login";
    axios
      .get("epbi-production.up.railway.app/user", { withCredentials: true })
      .then((res) => {
        if (res.data.logged_in) navigate(res.data.redirect);
      })
      .catch((err) => console.error("Error checking user session:", err));
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Clear previous errors

    try {
      await axios.post(
        "epbi-production.up.railway.app/login",
        { ...loginData, password: passwordRef.current.value },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage("The password you've entered is incorrect.");
      } else if (error.response?.status === 400) {
        setErrorMessage("Invalid login credentials.");
      } else if (error.response?.status === 404) {
        setErrorMessage("There is no such user.");
      } else {
        setErrorMessage("Error logging in. Please try again later.");
        console.error("Login error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-parent flex flex-row w-full h-[60vh] justify-center bg-[#f2f4f7]">
      <div className="left-hero w-[50%] pr-10">
        <img src="_fb_logo.png" alt="logo" />
        <h1 className="fb_logo text-[#0866ff] font-[700] Mont lg:text-[4em] pt-12">
          !facebook
        </h1>
        <p className="desc text-[1.7em]">
          Connect with friends and the world around you on Facebook.
        </p>
      </div>
      <div className="right-hero w-[50%] flex justify-center">
        <form
          onSubmit={handleLogin}
          className="login-form flex flex-col gap-y-3 items-center bg-white p-4 rounded-[10px] shadow-md max-w-[380px] min-w-[395px] h-[fit-content]"
        >
          <input
            type="text"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            required
            className="w-full h-13 text-md border-gray-200 border-2 rounded-md p-3 outline-0"
          />

          <div className="w-full h-13 text-md border-gray-200 border-2 rounded-2xl focus:outline-1 p-3 focus:outline-[#0866ff] flex ">
            <input
              type={values.showPassword ? "password" : "text"}
              placeholder="Password"
              ref={passwordRef}
              required
              className="outline-0 w-[95%] rounded-0 "
            />
            <button onClick={handleClick}>
              {values.showPassword ? show : hide}
            </button>
          </div>

          {errorMsg && (
            <p className="text-red-500 text-[0.8em]">
              {errorMsg}{" "}
              {errorMsg === "There is no such user." && (
                <Link to="/register" className="font-semibold">
                  Create an account?
                </Link>
              )}
              {errorMsg !== "There is no such user." && (
                <Link to="/forgot_password" className="font-semibold">
                  Forgot password?
                </Link>
              )}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`login-btn w-full bg-[#0866ff] rounded-[5px] text-white pt-2 pb-2 font-bold text-[1.3em] cursor-pointer ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <Link
            to="/forgot_password"
            className="forgot-btn text-[#0866ff] text-[0.9em]"
          >
            Forgot password?
          </Link>

          <Link
            to="/m/forgot_password"
            className="forgot-mobile text-[#0866ff] text-[0.9em]"
          >
            Forgot password?
          </Link>
          <hr className="border-t-1 border-gray-300 w-full mt-2 mb-3" />
          <Link
            to="/register"
            className="create-account-pc w-[55%] bg-[#42b72a] rounded-[5px] text-white pt-2.5 pb-2.5 font-bold text-[1.06em] hover:bg-green-600 cursor-pointer text-center"
          >
            Create new account
          </Link>
          <Link
            to="/m/register/name"
            className="create-account-mobile w-[55%] bg-[#42b72a] rounded-[5px] text-white pt-2.5 pb-2.5 font-bold text-[1.06em] hover:bg-green-600 cursor-pointer text-center"
          >
            Create new account
          </Link>
        </form>
      </div>
    </div>
  );
}

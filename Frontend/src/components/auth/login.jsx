import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/base.css";

/**
 * Login Component
 * Handles user authentication by submitting login credentials to the backend.
 * Redirects authenticated users to the dashboard.
 *
 * @returns {JSX.Element} The Login form UI.
 */
export default function Login() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMessage] = useState(""); // State to store login error messages
  const [prevPassword, setPrevPassword] = useState(""); // Tracks previous password value to reset error messages
  const [loginData, setLoginData] = useState({ username: "", password: "" }); // Stores user input for login

  /**
   * Resets the error message when the password input changes.
   */
  useEffect(() => {
    if (loginData.password.length !== prevPassword.length) {
      setErrorMessage("");
    }
    setPrevPassword(loginData.password);
  }, [loginData]);

  /**
   * Checks if the user is already logged in and redirects if necessary.
   * Calls the backend to verify user session.
   */
  useEffect(() => {
    document.title = "!Facebook - Login";
    axios
      .get("http://localhost:5000/user", { withCredentials: true })
      .then((res) => res.data)
      .then((data) => {
        if (data.logged_in) {
          navigate(data.redirect); // Redirect to the appropriate page
        }
      })
      .catch((err) => console.error("Error checking user session:", err));
  }, [navigate]);

  /**
   * Handles login form submission.
   * Sends login credentials to the backend for authentication.
   *
   * @param {React.FormEvent} e - The form submission event.
   */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/login", loginData, {
        withCredentials: true,
      });
      navigate("/dashboard"); // Redirect to dashboard on successful login
    } catch (error) {
      // Handle authentication errors
      if (error.response?.status === 401) {
        setErrorMessage("The password you've entered is incorrect.");
      } else {
        setErrorMessage("Error logging in. Please try again later.");
        console.error("Login error:", error);
      }
    }
  };

  /**
   * Renders the login form UI.
   *
   * @returns {JSX.Element} The login form.
   */
  return (
    <div className="flex flex-row w-[100%] h-[60vh] justify-center bg-[#f2f4f7]">
      <div className="left-hero w-[50%] pr-10">
        <h1 className="text-[#0866ff] font-[700] Mont lg:text-[4em] pt-12">
          !facebook
        </h1>
        <p className="text-[1.7em]">
          Connect with friends and the world around you on Facebook.
        </p>
      </div>
      <div className="right-hero w-[50%] h-[fit-content] flex items-center justify-center">
        {/* Login form */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-y-3 items-center bg-[#feffff] p-4 rounded-[10px] shadow-md max-w-[380px] min-w-[395px] "
        >
          {/* Username input */}
          <input
            type="text"
            placeholder="Email or username"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
            required
            className="w-[100%] h-13 text-md border-gray-200 border-2 rounded-md p-3  focus:outline focus:outline-1 focus:outline-[#0866ff] placeholder-gray-400"
          />

          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
            className="w-[100%] h-13 text-md border-gray-200 border-2 rounded-md p-3 focus:outline focus:outline-1 focus:outline-[#0866ff] placeholder-gray-400"
          />

          {/* Display error message if login fails */}
          {errorMsg && (
            <p className="text-red-500 text-[0.8em] text-nowrap">
              {errorMsg}{" "}
              <Link to={"/forgot_password"} className="font-semibold">
                Forgot password?
              </Link>
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-[100%] bg-[#0866ff] rounded-[5px] text-[#ffffff] pt-2 pb-2 font-bold text-[1.3em] active:bg-blue-300 hover:bg-blue-600 cursor-pointer"
          >
            Log In
          </button>

          <Link to={"/forgot_password"} className="text-[0.9em] text-[#0866ff]">
            Forgot password?
          </Link>
          <hr class="border-t-1 border-gray-300 w-[100%] mt-2 mb-3" />

          {/* Link to the registration page */}
          <button className="w-[55%] text-center text-nowrap bg-[#42b72a] rounded-[5px] text-[#ffffff] pt-2.5 pb-2.5 pr-2.5 pl-2.5 font-bold text-[1.06em] mb-3 hover:bg-green-600">
            <Link to={"/register"}>Create new account</Link>
          </button>
        </form>
      </div>
    </div>
  );
}

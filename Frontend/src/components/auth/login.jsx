import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
        setErrorMessage("Wrong Password");
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
    <div className="w-full h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Login</h1>

      {/* Login form */}
      <form onSubmit={handleLogin} className="flex flex-col space-y-2">
        {/* Username input */}
        <input
          type="text"
          placeholder="Username"
          value={loginData.username}
          onChange={(e) =>
            setLoginData({ ...loginData, username: e.target.value })
          }
          required
          className="border p-2 rounded"
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
          className="border p-2 rounded"
        />

        {/* Display error message if login fails */}
        {errorMsg && (
          <p className="text-red-500 text-left text-[0.8rem] p-0">{errorMsg}</p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="bg-gray-500 text-white py-2 px-4 rounded-lg cursor-pointer"
        >
          Login
        </button>
      </form>

      {/* Link to the registration page */}
      <p>
        <Link to={"/register"} className="text-blue-500 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}

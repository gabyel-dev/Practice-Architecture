import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMessage] = useState("");
  const [prevPassword, setPrevPassword] = useState("");
  const [loginData, setLoginData] = useState({ username: "", password: "" });

  // Reset error message when the password input changes
  useEffect(() => {
    if (loginData.password.length !== prevPassword.length) {
      setErrorMessage("");
    }
    setPrevPassword(loginData.password);
  }, [loginData]);

  // Check if the user is already logged in and redirect if necessary
  useEffect(() => {
    axios
      .get("http://localhost:5000/user", { withCredentials: true })
      .then((res) => res.data)
      .then((data) => {
        if (data.logged_in) {
          navigate(data.redirect);
        }
      });
  }, [navigate]);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/login", loginData, {
        withCredentials: true,
      });
      navigate("/dashboard"); // Redirect to dashboard on successful login
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage("Wrong Password");
      } else {
        setErrorMessage("Error logging in:", error);
      }
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-2xl mb-4">Login</h1>

      {/* Login form */}
      <form onSubmit={handleLogin} className="flex flex-col space-y-2">
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

        <button
          type="submit"
          className="bg-gray-500 text-white py-2 px-4 rounded-lg cursor-pointer"
        >
          Login
        </button>
      </form>

      {/* Link to the registration page */}
      <p>
        <Link to={"/register"}>Register</Link>
      </p>
    </div>
  );
}

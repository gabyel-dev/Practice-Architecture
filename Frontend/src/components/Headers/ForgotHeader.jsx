import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotHeader() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    document.title = "!Facebook - Forgot Password";
    axios
      .get("http://localhost:5000/user", { withCredentials: true })
      .then((res) => {
        if (res.data.logged_in) navigate(res.data.redirect);
      })
      .catch((err) => console.error("Error checking user session:", err));
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setErrorMessage("");
    setShowError(false);
    setFadeOut(false); // Reset fade effect

    try {
      await axios.post("http://localhost:5000/login", loginData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 400) {
        setShowError(true);
        setTimeout(() => setFadeOut(true), 2000);
        setTimeout(() => setShowError(false), 2000);
        setLoginData((prev) => ({ ...prev, password: "" }));
      } else {
        setError(true);
        setErrorMessage("Error logging in. Please try again later.");
        console.error("Login error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between items-center p-2 shadow-sm bg-[#feffff] w-full">
        <h1 className="text-[#0866ff] font-bold text-3xl">!facebook</h1>
        <form onSubmit={handleLogin} className="flex gap-2">
          <input
            type="text"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            required
            className="w-full h-10 text-sm border-gray-200 border-2 rounded-md p-3 focus:outline-[#0866ff]"
          />

          <input
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
            className={`w-full h-10 text-sm border-2 rounded-md p-3 focus:outline-[#0866ff] ${
              error ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errorMsg && <p className="text-red-500 text-[0.8em]">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-[50%] bg-[#0866ff] rounded-[5px] text-white pt-1 pb-1 font-bold text-[1.1em] ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>

      {/* Error message with fade-out effect */}
      {showError && (
        <div
          className={`bg-red-500 text-white text-sm p-2 rounded-md mt-3 transition-opacity duration-300 ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          Incorrect password. Please try again.
        </div>
      )}
    </div>
  );
}

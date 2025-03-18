import { useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardHeader from "../Headers/DashboardHeader";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user", {
          withCredentials: true, // Ensure cookies are sent
        });
        if (!res.data.logged_in) {
          navigate("/");
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };

    checkSession();
  }, [navigate, location.pathname]);

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <DashboardHeader />
      <div>Dashboard</div>
      <button
        onClick={logout}
        className="bg-gray-500 text-white py-2 px-4 rounded-lg cursor-pointer"
      >
        Logout
      </button>
    </>
  );
}

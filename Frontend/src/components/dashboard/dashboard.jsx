import { useEffect } from "react";
import axios from "axios";
import { data, useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:5000/user", {
        withCredentials: true,
      })
      .then((res) => res.data)
      .then((data) => {
        if (!data.logged_in) {
          navigate("/login");
        }
      });
  }, [navigate]);

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <div>Dashboard</div>
      <button
        onClick={logout}
        className="bg-gray-500 text-white py-2 px-4 rounded-lg cursor-pointer"
      >
        logout
      </button>
    </>
  );
}

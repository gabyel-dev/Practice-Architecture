import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardHeader from "../Headers/DashboardHeader";

export default function Profile() {
  const { id } = useParams(); // Ensure this matches the route
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || id === "0") return; // Prevent API call if ID is missing or invalid

    const fetchUser = async () => {
      try {
        console.log("Fetching user with ID:", id); // Debugging
        const res = await axios.get(`http://localhost:5000/user/${id}`);
        setUser(res.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("User not found or failed to fetch.");
      }
    };

    fetchUser();
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <>
      <DashboardHeader />
      <div className="p-4">
        <h1 className="text-2xl font-bold">
          {user.first_name} {user.last_name}
        </h1>
        <p>Email: {user.email}</p>
      </div>
    </>
  );
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faHouse, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function DashboardHeader() {
  const [result, setResult] = useState([]);
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios.get(
          "https://epbi-production.up.railway.app/user",
          { withCredentials: true }
        );
        console.log("User API Response:", res.data); // Debugging
        if (res.data.user && res.data.user.id) {
          setUserId(res.data.user.id);
          console.log("User ID set to:", res.data.user.id);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      setResult([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `https://epbi-production.up.railway.app/search?query=${query}`
      );
      console.log("Search API Response:", res.data); // Debugging

      if (Array.isArray(res.data.users)) {
        setResult(res.data.users);
      } else {
        console.error("Unexpected API Response:", res.data);
        setResult([]);
      }

      setShowResults(true);
    } catch (error) {
      console.error("Error searching:", error);
      setError("Something went wrong. Please try again.");
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setShowResults(false);
    setQuery("");
    setResult([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center px-5 py-1 justify-between bg-white shadow-sm">
      {/* Search Bar */}
      <div className="flex items-center gap-3 relative" ref={searchRef}>
        <Link to={"/dashboard"}>
          <img src="/_fb_logo.png" alt="logo" className="w-10 h-10" />
        </Link>

        <div className="flex items-center px-3 py-1 rounded-3xl border border-gray-300 bg-gray-100 relative w-60">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 mr-2" />
          <input
            type="text"
            className="bg-transparent outline-none placeholder-gray-400 w-full"
            placeholder="Search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!e.target.value.trim()) {
                setResult([]);
                setShowResults(false);
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>

        {/* Search Results Dropdown */}
        {showResults && (
          <div className="absolute top-full left-12 bg-white border border-gray-300 mt-2 w-60 rounded-lg shadow-md z-10">
            {loading ? (
              <div className="p-2 text-gray-500">Loading...</div>
            ) : error ? (
              <div className="p-2 text-red-500">{error}</div>
            ) : result.length === 0 ? (
              <div className="p-2 text-gray-500">No results found</div>
            ) : (
              result.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user.id)}
                  className="block p-2 hover:bg-gray-100 cursor-pointer text-black"
                >
                  {user.first_name} {user.last_name}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <div className="w-12 h-12 flex items-center justify-center border-1 border-gray-300 rounded-full">
          <Link to={"/dashboard"}>
            <FontAwesomeIcon
              icon={faHouse}
              size="xl"
              className="text-gray-300 active:scale-70 hover:text-gray-200 transition-all"
            />
          </Link>
        </div>
      </div>

      {/* Profile Icon */}
      <div>
        <div className="w-10 h-10 flex justify-center items-center border border-gray-300 rounded-full overflow-hidden">
          <button
            onClick={() => {
              if (userId) {
                navigate(`/profile/${userId}`);
              } else {
                console.warn("User ID not available yet");
              }
            }}
          >
            <img
              src="/profile_icon.png"
              alt="Profile Icon"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

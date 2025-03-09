import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/user", {
        credentials: "include",
      })
      .then((res) => res.data)
      .then((data) => data);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/login", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.status === 200) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error Logging user", error);
    }
  };
  return (
    <>
      <div className="w-[100%] h-[100vh] bg-gray-50">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={loginData.username}
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
          />
          <input
            type="password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
          <button
            type="submit"
            className="bg-gray-500 pt-2 pb-2 pr-4 pl-4 rounded-[10px]"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
}

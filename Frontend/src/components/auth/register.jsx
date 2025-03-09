import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/user", {
        withCredentials: true,
      })
      .then((res) => res.data)
      .then((data) => {
        if (data.logged_in) {
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      });
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/register",
        registerData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.log("Error registering user", error);
    }
  };

  return (
    <>
      <div className="w-[100%] h-[100vh] bg-gray-50">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            value={registerData.name}
            onChange={(e) =>
              setRegisterData({ ...registerData, name: e.target.value })
            }
            required
          />
          <input
            type="text"
            value={registerData.username}
            onChange={(e) =>
              setRegisterData({ ...registerData, username: e.target.value })
            }
            required
          />
          <input
            type="password"
            value={registerData.password}
            onChange={(e) =>
              setRegisterData({ ...registerData, password: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="bg-gray-500 pt-2 pb-2 pr-4 pl-4 rounded-[10px]"
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
}

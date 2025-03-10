import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [registerData, setRegisterData] = useState({
    name: "",
    username: "",
    password: "",
  });

  function validatePassword(password) {
    const errors = [];

    if (!/[a-z]/.test(password))
      errors.push("• At least one lowercase letter required.");
    if (!/[A-Z]/.test(password))
      errors.push("• At least one uppercase letter required.");
    if (!/\d/.test(password)) errors.push("• At least one number required.");
    if (!/\W/.test(password))
      errors.push("• At least one special character required.");
    if (password.length < 8)
      errors.push("• Password must be at least 8 characters long.");

    return errors.length === 0 ? true : errors;
  }

  useEffect(() => {
    axios
      .get("http://localhost:5000/user", { withCredentials: true })
      .then((res) => res.data)
      .then((data) => {
        if (data.logged_in) {
          navigate("/dashboard");
        }
      });
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    const passwordValidation = validatePassword(registerData.password);
    if (passwordValidation !== true) {
      setError(passwordValidation.join("\n"));
      return;
    } else {
      setError("");
    }

    try {
      const response = await axios
        .post("http://localhost:5000/register", registerData, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        .then((res) => {
          if (response.status === 200) {
            navigate(res.data.redirect);
          }
        });
    } catch (error) {
      console.log("Error registering user", error);
    }
  };

  return (
    <>
      <div className="w-full h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl mb-4">Register</h1>
        <form
          onSubmit={handleRegister}
          className="flex flex-col space-y-2 w-[fit-content]"
        >
          <input
            type="text"
            value={registerData.name}
            onChange={(e) =>
              setRegisterData({ ...registerData, name: e.target.value })
            }
            placeholder="Name"
            required
            className="border p-2 rounded outline-none"
          />
          <input
            type="text"
            value={registerData.username}
            onChange={(e) =>
              setRegisterData({ ...registerData, username: e.target.value })
            }
            placeholder="Username"
            required
            className="border p-2 rounded outline-none"
          />
          <input
            type="password"
            value={registerData.password}
            onChange={(e) => {
              setRegisterData({ ...registerData, password: e.target.value });
              const passwordValidation = validatePassword(e.target.value);
              setError(
                passwordValidation === true ? "" : passwordValidation.join("\n")
              );
            }}
            placeholder="Password"
            required
            className={`border p-2 rounded ${
              error
                ? "border-red-500 outline-none"
                : registerData.password
                ? "border-green-500"
                : ""
            }`}
          />
          {error && (
            <p className="text-left text-[0.8rem] p-0 whitespace-pre-line">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="bg-gray-500 text-white py-2 px-4 rounded-lg cursor-pointer"
          >
            Register
          </button>
        </form>
        <p>
          <Link to={"/login"}>Back to login</Link>
        </p>
      </div>
    </>
  );
}

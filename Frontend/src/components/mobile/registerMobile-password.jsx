import { useNavigate, Link } from "react-router-dom";
import { useForm } from "../FormContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";

const back = (
  <FontAwesomeIcon icon={faArrowLeft} className="text-2xl px-5 py-5" />
);

export default function RegMobilePassword() {
  const navigate = useNavigate();
  const { formData, setFormData } = useForm();
  const [error, setError] = useState("");
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    axios
      .get("epbi-production.up.railway.app/user", { withCredentials: true })
      .then((res) => res.data)
      .then((data) => {
        if (data.logged_in) {
          navigate("/dashboard");
        }
      });
  }, [navigate]);

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

  const handleChange = (e) => {
    const password = e.target.value;
    setFormData((prev) => ({ ...prev, password }));
    const validation = validatePassword(password);
    setError(validation === true ? "" : validation.join("\n"));
  };

  const handleSubmit = async () => {
    if (formData.password === "") {
      setError("Fill out all fields.");
      return;
    }
    if (error) return;

    try {
      await fetch("epbi-production.up.railway.app/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      navigate("/");
    } catch (error) {
      setError("Registration failed.");
      console.error("Registration failed", error);
    }
  };

  return (
    <>
      {windowSize < 550 ? "" : navigate("/register")}
      <Link to={"/m/register/email"}>{back}</Link>
      <div className="p-5 flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Create a password</h1>
        <p className="pb-3 text-[1.2em]">
          Enter a strong password to protect your account.
        </p>

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border-1 p-3 w-full rounded-2xl text-lg focus:outline-1 focus:outline-blue-500"
        />

        {error && (
          <div className="text-red-500 text-sm mt-2 whitespace-pre-line">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className={`mt-3 py-4 rounded-[50px] text-white text-lg ${
            error ? "bg-gray-400 cursor-not-allowed" : "bg-[#1333E7]"
          }`}
          disabled={!!error}
        >
          Register
        </button>
      </div>
    </>
  );
}

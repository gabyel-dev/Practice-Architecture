import { useNavigate, Link } from "react-router-dom";
import { useForm } from "../FormContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const back = (
  <FontAwesomeIcon icon={faArrowLeft} className="text-2xl px-5 py-5" />
);

export default function RegMobilePassword() {
  const navigate = useNavigate();
  const { formData, setFormData } = useForm();
  const [error, setError] = useState("");

  // Password Validation Function
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
    if (error) return; // Prevent submission if password is weak

    try {
      await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      navigate("/");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <>
      <Link to={"/register/email"}>{back}</Link>
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

        {/* Password Error Messages */}
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
          disabled={!!error} // Disable if password is weak
        >
          Register
        </button>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [birthError, setBirthError] = useState("");
  const [birthErrorDay, setBirthErrorDay] = useState("");
  const [registerData, setRegisterData] = useState({
    first_name: "",
    last_name: "",
    Birthday_month: "",
    Birthday_day: "",
    Birthday_year: "",
    email: "",
    password: "",
  });

  const isValidMonth = (month) => {
    const fullMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const shortMonths = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedMonth = month.trim().toLowerCase();

    return (
      fullMonths.some((m) => m.toLowerCase() === formattedMonth) ||
      shortMonths.some((m) => m.toLowerCase() === formattedMonth)
    );
  };

  const isValidDay = (day) => {
    const validDay = Number(day);

    return !isNaN(validDay) && validDay >= 1 && validDay <= 31;
  };

  /**
   * Validates the provided password against common security requirements.
   * @param {string} password - The password to validate.
   * @returns {boolean | string[]} - Returns true if valid, or an array of error messages.
   */
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

  function ValidateBirthmonth() {
    const bmonth = registerData.Birthday_month;

    const checkMonth = isValidMonth(bmonth);

    if (checkMonth !== true) {
      setBirthError("Invalid month");
    } else {
      setBirthError("");
    }
  }

  function ValidateDay() {
    const bday = registerData.Birthday_day;

    const checkdays = isValidDay(bday);

    if (checkdays === true) {
      setBirthErrorDay("");
    } else {
      setBirthErrorDay("Invalid day");
    }
  }

  /**
   * Checks if the user is already logged in and redirects to the dashboard if so.
   */
  useEffect(() => {
    document.title = "!Facebook - Register";
    ValidateBirthmonth();
    axios
      .get("http://localhost:5000/user", { withCredentials: true })
      .then((res) => res.data)
      .then((data) => {
        if (data.logged_in) {
          navigate("/dashboard");
        }
      });
  }, [navigate]);

  useEffect(() => {
    ValidateBirthmonth();
  }, [registerData.Birthday_month]);

  useEffect(() => {
    ValidateDay();
  }, [registerData.Birthday_day]);

  /**
   * Handles the registration form submission.
   * Validates the password and sends user data to the backend.
   * @param {Event} e - The form submit event.
   */
  const handleRegister = async (e) => {
    setBirthError("");
    e.preventDefault();

    const passwordValidation = validatePassword(registerData.password);
    if (passwordValidation !== true) {
      setError(passwordValidation.join("\n"));
      return;
    } else {
      setError("");
    }

    try {
      await axios.post("http://localhost:5000/register", registerData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.log("Error registering user", error);
    }
  };

  return (
    <div className="flex flex-row w-[100%] h-[110vh] justify-center bg-[#f2f4f7]">
      <div className="right-hero w-[50%] h-[fit-content] flex flex-col items-center justify-center">
        {/* Registration Form */}
        <h1 className="text-[#0866ff] Mont font-[700] Mont lg:text-[3.7em]">
          !facebook
        </h1>
        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-y-3 items-center bg-[#feffff] p-4 rounded-[10px] shadow-md max-w-[420px] min-w-[420px]"
        >
          <div className="flex flex-col text-center">
            <h1 className="text-[1.6em] font-bold">Create a new account</h1>
            <p className="text-gray-500 text-[0.9em]">It's quick and easy.</p>
          </div>
          <hr className="border-t-1 border-gray-300 w-[109%] mt-1 mb-1" />
          {/* Name Input */}
          <div className="flex gap-2.5">
            <input
              type="text"
              value={registerData.first_name}
              onChange={(e) =>
                setRegisterData({ ...registerData, first_name: e.target.value })
              }
              placeholder="First name"
              required
              className="w-[50%] h-10 text-sm border-gray-200 border-2 rounded-md p-3 focus:outline focus:outline-1 focus:outline-[#0866ff] placeholder-gray-400"
            />
            <input
              type="text"
              value={registerData.last_name}
              onChange={(e) =>
                setRegisterData({ ...registerData, last_name: e.target.value })
              }
              placeholder="Last name"
              required
              className="w-[50%] h-10 text-sm border-gray-200 border-2 rounded-md p-3 focus:outline focus:outline-1 focus:outline-[#0866ff] placeholder-gray-400"
            />
          </div>

          <div className="flex flex-col">
            <p className="text-left text-[0.7em] text-gray-500">Birthday</p>
            <div className="flex gap-2.5">
              <div className="flex flex-col w-[fit-content]">
                <input
                  type="text"
                  value={registerData.Birthday_month}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      Birthday_month: e.target.value,
                    })
                  }
                  placeholder="Month"
                  required
                  className="w-[100%] h-10 text-sm border-gray-200 border-2 rounded-md p-3 focus:outline focus:outline-1 focus:outline-[#0866ff] placeholder-gray-400"
                />
                {birthError && (
                  <div className="">
                    <p className="text-[0.7em] text-red-500">{birthError}</p>
                  </div>
                )}
              </div>
              <div className="">
                <input
                  type="text"
                  value={registerData.Birthday_day}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      Birthday_day: e.target.value,
                    })
                  }
                  placeholder="Day"
                  required
                  className="w-[100%] h-10 text-sm border-gray-200 border-2 rounded-md p-3 focus:outline focus:outline-1 focus:outline-[#0866ff] placeholder-gray-400"
                />
                {birthErrorDay && (
                  <div className="">
                    <p className="text-[0.7em] text-red-500">{birthErrorDay}</p>
                  </div>
                )}
              </div>
              <div>
                <input
                  type="text"
                  value={registerData.Birthday_year}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      Birthday_year: e.target.value,
                    })
                  }
                  placeholder="Year"
                  required
                  className="w-[100%] h-10 text-md border-gray-200 border-2 rounded-md p-3 focus:outline focus:outline-1 focus:outline-[#0866ff] placeholder-gray-400"
                />
                {birthError && (
                  <div className="">
                    <p className="text-[0.7em] text-red-500">{birthError}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Username Input */}
          <input
            type="email"
            value={registerData.email}
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
            placeholder="Email"
            required
            className="w-[100%] h-10 text-sm border-gray-200 border-2 rounded-md p-3 focus:outline focus:outline-1 focus:outline-[#0866ff] placeholder-gray-400"
          />

          {/* Password Input */}
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
            placeholder="New password"
            required
            className={`w-[100%] h-10 text-sm border-2 rounded-md p-3 focus:outline focus:outline-1 focus:outline-[#0866ff] placeholder-gray-400 ${
              error
                ? "border-red-500"
                : registerData.password
                ? "border-green-500"
                : "border-gray-200"
            }`}
          />

          {/* Display Password Validation Errors */}
          {error && (
            <div className="bg-[#f2f5f6] p-2 rounded-md flex flex-col w-[100%]">
              <p className="text-left text-[0.8rem] text-red-500 flex flex-col">
                {error.split("\n").map((str, i) => (
                  <span key={i}>{str}</span>
                ))}
              </p>
            </div>
          )}
          <p className="text-left text-[0.7em] text-gray-500">
            People who use our service may have uploaded your contact
            information to !Facebook.{" "}
            <Link to={"/learn_more"} className="text-[#0866ff]">
              Learn More
            </Link>
          </p>
          <p className="text-left text-[0.7em] text-gray-500">
            By clicking Sign Up, you agree to our{" "}
            <Link to={"/terms_and_condition"} className="text-[#0866ff]">
              Terms
            </Link>
            . You may receive Notifications from us and can opt out any time.
          </p>

          {/* Register Button */}
          <button
            type="submit"
            className="w-[50%] bg-[#42b72a] rounded-[5px] text-[#ffffff] pt-1 pb-1 font-bold text-[1.1em] mt-1 mb-1 active:bg-green-300 hover:bg-green-600 cursor-pointer"
          >
            Sign Up
          </button>

          {/* Link to Login Page */}
          <Link to={"/"} className="text-[1em] text-[#0866ff] pb-2">
            Already have an account?
          </Link>
        </form>
      </div>
    </div>
  );
}

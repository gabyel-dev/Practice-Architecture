import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [birthError, setBirthError] = useState("");
  const [registerData, setRegisterData] = useState({
    first_name: "",
    last_name: "",
    birthday: "", // Store birthday as YYYY-MM-DD
    email: "",
    password: "",
  });
  const [size, setSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  // Months List
  const months = [
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

  // Generate Days (1 to 31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Generate Years (1900 to Current Year)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1899 },
    (_, i) => 1900 + i
  ).reverse();

  // Store selected values for controlled components
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Handle Birthday Change
  const handleBirthdayChange = (month, day, year) => {
    setSelectedMonth(month);
    setSelectedDay(day);
    setSelectedYear(year);

    if (!month || !day || !year) {
      setBirthError("Please select a valid birthday.");
      return;
    }

    const monthIndex = months.indexOf(month) + 1; // Convert month name to number
    const formattedDate = `${year}-${String(monthIndex).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    setRegisterData((prev) => ({ ...prev, birthday: formattedDate }));
    setBirthError("");
  };

  // Validate Password
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

  // Check if user is already logged in
  useEffect(() => {
    document.title = "!Facebook - Register";
    axios
      .get("http://localhost:5000/user", { withCredentials: true })
      .then((res) => res.data)
      .then((data) => {
        if (data.logged_in) navigate("/dashboard");
      });
  }, [navigate]);

  // Handle Registration Submit
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
    <>
      {size < 550 ? navigate("/register/name") : ""}
      <div className="flex flex-row w-full h-screen justify-center bg-[#f2f4f7]">
        <div className="right-hero w-[50%] flex flex-col items-center justify-center">
          {/* Registration Form */}
          <h1 className="text-[#0866ff] font-bold text-5xl">!facebook</h1>
          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-y-3 items-center bg-white p-6 rounded-lg shadow-md max-w-[420px] min-w-[420px]"
          >
            <h1 className="text-2xl font-bold">Create a new account</h1>
            <p className="text-gray-500 text-sm">It's quick and easy.</p>
            <hr className="border-t border-gray-300 w-full" />

            {/* Name Inputs */}
            <div className="flex gap-3 w-full">
              <input
                type="text"
                value={registerData.first_name}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    first_name: e.target.value,
                  })
                }
                placeholder="First name"
                required
                className="w-1/2 h-10 text-sm border-gray-300 border rounded-md p-3 placeholder-gray-400 focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="text"
                value={registerData.last_name}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    last_name: e.target.value,
                  })
                }
                placeholder="Last name"
                required
                className="w-1/2 h-10 text-sm border-gray-300 border rounded-md p-3 placeholder-gray-400 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Birthday Select Inputs */}
            <div className="flex flex-col w-full">
              <p className="text-left text-xs text-gray-500">Birthday</p>
              <div className="flex gap-2">
                <select
                  className="w-1/3 h-10 border-gray-300 border rounded-md p-2 focus:ring-1 focus:ring-blue-500 text-sm"
                  value={selectedMonth}
                  onChange={(e) =>
                    handleBirthdayChange(
                      e.target.value,
                      selectedDay,
                      selectedYear
                    )
                  }
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>

                <select
                  className="w-1/3 h-10 border-gray-300 border rounded-md p-2 focus:ring-1 focus:ring-blue-500 text-sm"
                  value={selectedDay}
                  onChange={(e) =>
                    handleBirthdayChange(
                      selectedMonth,
                      e.target.value,
                      selectedYear
                    )
                  }
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>

                <select
                  className="w-1/3 h-10 border-gray-300 border rounded-md p-2 focus:ring-1 focus:ring-blue-500 text-sm"
                  value={selectedYear}
                  onChange={(e) =>
                    handleBirthdayChange(
                      selectedMonth,
                      selectedDay,
                      e.target.value
                    )
                  }
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              {birthError && (
                <p className="text-xs text-red-500">{birthError}</p>
              )}
            </div>

            {/* Email & Password Inputs */}
            <input
              type="email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              placeholder="Email"
              required
              className="w-full h-10 text-sm border-gray-300 border rounded-md p-3 focus:ring-1 focus:ring-blue-500"
            />

            <input
              type="password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              placeholder="New password"
              required
              className="w-full h-10 text-sm border-gray-300 border rounded-md p-3 focus:ring-1 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-1/2 bg-green-500 text-white py-2 rounded-md font-bold hover:bg-green-600 cursor-pointer"
            >
              Sign Up
            </button>

            <Link to="/" className="text-blue-500">
              Already have an account?
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}

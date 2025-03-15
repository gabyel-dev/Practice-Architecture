import { useNavigate, Link } from "react-router-dom";
import { useForm } from "../FormContext";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const back = (
  <FontAwesomeIcon icon={faArrowLeft} className="text-2xl px-5 py-5" />
);

export default function RegMobileBirthday() {
  const navigate = useNavigate();
  const { formData, setFormData } = useForm();
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
        }
      });
  }, [navigate]);

  // State for month, day, and year
  const [birthday, setBirthday] = useState({
    month: "",
    day: "",
    year: "",
  });

  // Month options
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

  // Generate days (1-31)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // Generate years (e.g., 1900 - current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBirthday((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // Convert month name to number
    const monthIndex = months.indexOf(birthday.month) + 1;
    const formattedBirthday = `${birthday.year}-${String(monthIndex).padStart(
      2,
      "0"
    )}-${String(birthday.day).padStart(2, "0")}`;

    setFormData((prev) => ({ ...prev, birthday: formattedBirthday }));
    navigate("/register/email");
  };

  return (
    <>
      {windowSize < 550 ? "" : navigate("/register")}
      <Link to={"/register/name"}>{back}</Link>
      <div className="p-5 flex flex-col gap-2">
        <h1 className="text-3xl font-bold">When's your birthday?</h1>
        <p className="pb-3 text-[1.2em]">
          Choose your date of birth. You can always make this private later.
        </p>

        <div className="flex gap-2">
          <select
            name="month"
            value={birthday.month}
            onChange={handleChange}
            required
            className="border-1 p-3 w-1/3 rounded-2xl text-lg focus:outline-1 focus:outline-blue-500 text-md"
          >
            {months.map((month, index) => (
              <option key={index} value={month}>
                {month}
              </option>
            ))}
          </select>

          <select
            name="day"
            value={birthday.day}
            onChange={handleChange}
            required
            className="border-1 p-3 w-1/3 rounded-2xl text-lg focus:outline-1 focus:outline-blue-500 text-md"
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          <select
            name="year"
            value={birthday.year}
            onChange={handleChange}
            required
            className="text-md border-1 p-3 w-1/3 rounded-2xl text-lg focus:outline-1 focus:outline-blue-500"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleNext}
          className="bg-[#1333E7] mt-3 py-4 rounded-[50px] text-white text-lg"
        >
          Next
        </button>
      </div>
    </>
  );
}

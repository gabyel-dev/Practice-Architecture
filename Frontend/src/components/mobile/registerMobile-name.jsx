import { useNavigate, Link } from "react-router-dom";
import { useForm } from "../FormContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";

const back = (
  <FontAwesomeIcon icon={faArrowLeft} className="text-2xl px-5 py-5" />
);

export default function RegMobileName() {
  const navigate = useNavigate();
  const { formData, setFormData } = useForm();
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    navigate("/register/birthday");
  };

  return (
    <>
      <Link to={"/"}>{back}</Link>
      <div className="p-5 flex flex-col gap-2">
        <h1 className="text-3xl font-bold">What's your name?</h1>
        <p className="pb-3 text-[1.2em]">
          Enter the name you use in real life.
        </p>

        {windowSize < 550 ? "" : navigate("/register")}

        <div className="flex gap-4 w-[100%]">
          {/* First Name */}
          <div className="relative w-[50%]">
            <input
              type="text"
              name="first_name"
              id="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="border border-gray-400 p-3 w-full rounded-2xl h-14 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
            />
            <label
              htmlFor="first_name"
              className={`absolute left-3 transition-all duration-200 text-lg text-gray-500 
                ${
                  formData.first_name
                    ? "top-0 text-sm text-blue-500"
                    : "top-7 -translate-y-1/2"
                }
              `}
            >
              First Name
            </label>
          </div>

          {/* Last Name */}
          <div className="relative w-[50%]">
            <input
              type="text"
              name="last_name"
              id="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="border border-gray-400 p-3 w-full rounded-2xl h-14 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
            />
            <label
              htmlFor="last_name"
              className={`absolute left-3 transition-all duration-200 text-lg text-gray-500 
                ${
                  formData.last_name
                    ? "top-0 text-sm text-blue-500"
                    : "top-7 -translate-y-1/2"
                }
              `}
            >
              Last Name
            </label>
          </div>
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

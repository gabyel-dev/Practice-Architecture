import { useNavigate, Link } from "react-router-dom";
import { useForm } from "../FormContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const back = (
  <FontAwesomeIcon icon={faArrowLeft} className="text-2xl px-5 py-5" />
);

export default function RegMobileName() {
  const navigate = useNavigate();
  const { formData, setFormData } = useForm();

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
        <div className="flex gap-4 w-[100%]">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            className="border-1 p-3 w-[50%] rounded-2xl h-15 text-lg focus:outline-1 focus:outline-blue-500"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            className="border-1 p-3 w-[50%] rounded-2xl h-15 text-lg focus:outline-1 focus:outline-blue-500"
          />
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

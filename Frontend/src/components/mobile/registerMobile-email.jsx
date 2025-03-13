import { useNavigate, Link } from "react-router-dom";
import { useForm } from "../FormContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const back = (
  <FontAwesomeIcon icon={faArrowLeft} className="text-2xl px-5 py-5" />
);

export default function RegMobileEmail() {
  const navigate = useNavigate();
  const { formData, setFormData } = useForm();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
  };

  const handleNext = () => {
    navigate("/register/password");
  };

  return (
    <>
      <Link to={"/"}>{back}</Link>
      <div className="p-5 flex flex-col gap-2">
        <h1 className="text-3xl font-bold">What's your email?</h1>
        <p className="pb-3 text-[1.2em]">
          Enter your email so you can sign in and receive updates.
        </p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border-1 p-3 w-full rounded-2xl text-lg focus:outline-1 focus:outline-blue-500"
        />

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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  faArrowLeft,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backBtn = (
  <FontAwesomeIcon icon={faArrowLeft} className="text-2xl px-5 py-5" />
);
const show = <FontAwesomeIcon icon={faEye} />;
const hide = <FontAwesomeIcon icon={faEyeSlash} />;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [valueNew, setValueNew] = useState({ showPassword: true });
  const [valueOld, setValueOld] = useState({ showPassword: true });
  const [error, setError] = useState("");
  const [forgotPassData, setForgotPassData] = useState({
    email: "",
    password: "",
    newPassword: "",
  });

  const handleClickNew = () =>
    setValueNew({ showPassword: !valueNew.showPassword });
  const handleClickOld = () =>
    setValueOld({ showPassword: !valueOld.showPassword });

  useEffect(() => {
    if (
      forgotPassData.password &&
      forgotPassData.password === forgotPassData.newPassword
    ) {
      setError("Password cannot be the same as Old password");
    } else {
      setError("");
    }
  }, [forgotPassData.password, forgotPassData.newPassword]);

  useEffect(() => {
    document.title = "!Facebook - forgot-password";

    axios
      .get("http://localhost:5000/user", { withCredentials: true })
      .then((res) => res.data)
      .then((data) => {
        if (data.logged_in) navigate("/dashboard");
      });
  }, [navigate]);

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/forgot_password",
        forgotPassData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      navigate("/");
    } catch (error) {
      console.error("Something went wrong:", error);
    }
  };

  return (
    <>
      <Link to={"/"}>{backBtn}</Link>
      <div className="h-[100vh] w-[100%] p-5 flex flex-col gap-9">
        <div>
          <h1 className="font-semibold text-2xl">Reset Password</h1>
          <p>
            Choose a strong password with at least 8 characters, including
            uppercase, lowercase, numbers, and symbols.
          </p>
        </div>
        <form onSubmit={handleReset} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Enter email"
            value={forgotPassData.email}
            onChange={(e) =>
              setForgotPassData({ ...forgotPassData, email: e.target.value })
            }
            className="border-1 p-3 w-full rounded-2xl text-lg focus:outline-1 focus:outline-blue-500"
          />
          <div className="flex border-1 p-3 w-full rounded-2xl text-lg focus:outline-1 focus:outline-blue-500">
            <input
              type={valueOld.showPassword ? "password" : "text"}
              placeholder="Old password"
              value={forgotPassData.password}
              onChange={(e) =>
                setForgotPassData({
                  ...forgotPassData,
                  password: e.target.value,
                })
              }
              className="w-[95%] outline-0"
            />
            <button type="button" onClick={handleClickOld}>
              {valueOld.showPassword ? show : hide}
            </button>
          </div>

          <div className="flex border-1 p-3 w-full rounded-2xl text-lg focus:outline-1 focus:outline-blue-500">
            <input
              type={valueNew.showPassword ? "password" : "text"}
              placeholder="New password"
              value={forgotPassData.newPassword}
              onChange={(e) =>
                setForgotPassData({
                  ...forgotPassData,
                  newPassword: e.target.value,
                })
              }
              className="w-[95%] outline-0"
            />
            <button type="button" onClick={handleClickNew}>
              {valueNew.showPassword ? show : hide}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-[#1333E7] mt-3 py-4 rounded-[50px] text-white text-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

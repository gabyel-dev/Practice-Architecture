import Forgot from "../auth/forgot_password";
import Footer from "../Footer";
import ForgotHeader from "../Headers/ForgotHeader";

export default function ForgotBody() {
  return (
    <>
      <ForgotHeader />
      <div className="pt-[18vh] pl-[16vw] pr-[16vw] flex  justify-center w-[100%] h-[100vh]">
        <Forgot />
      </div>
      <Footer />
    </>
  );
}

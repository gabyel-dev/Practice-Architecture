import Register from "../auth/register";
import Footer from "../Footer";

export default function RegisterBody() {
  return (
    <>
      <div className="pt-[5vh] pl-[16vw] pr-[16vw] flex  justify-center w-[100%] h-[110vh]">
        <Register />
      </div>
      <Footer />
    </>
  );
}

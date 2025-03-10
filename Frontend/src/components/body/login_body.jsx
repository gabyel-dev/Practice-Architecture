import Login from "../auth/login";
import Footer from "../Footer";

export default function LoginBody() {
  return (
    <>
      <div className="pt-[18vh] pl-[16vw] pr-[16vw] flex  justify-center w-[100%] h-[100vh]">
        <Login />
      </div>
      <Footer />
    </>
  );
}

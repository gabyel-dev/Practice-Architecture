import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoginBody from "./components/body/login_body";
import ForgotBody from "./components/body/forgot_password_body";
import RegisterBody from "./components/body/register_body";
import Dashboard from "./components/dashboard/dashboard";
import LearnMorePage from "./components/LearnMore";
import TermsAndConditions from "./components/Terms";
import React from "react";
import RegMobileName from "./components/mobile/registerMobile-name";
import { FormProvider } from "./components/FormContext"; // Import FormProvider
import RegMobileBirthday from "./components/mobile/registerMobile-birthday";
import RegMobileEmail from "./components/mobile/registerMobile-email";
import RegMobilePassword from "./components/mobile/registerMobile-password";
import ForgotPassword from "./components/mobile/ForgorPasswordMobile";

function App() {
  return (
    <FormProvider>
      {" "}
      {/* Wrap everything with FormProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<LoginBody />} />
          <Route path="/forgot_password" element={<ForgotBody />} />
          <Route path="/learn_more" element={<LearnMorePage />} />
          <Route path="/terms_and_condition" element={<TermsAndConditions />} />
          <Route path="/register" element={<RegisterBody />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/m/register/name" element={<RegMobileName />} />
          <Route path="/m/register/birthday" element={<RegMobileBirthday />} />
          <Route path="/m/register/email" element={<RegMobileEmail />} />
          <Route path="/m/register/password" element={<RegMobilePassword />} />
          <Route path="/m/forgot_password" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </FormProvider>
  );
}

export default App;

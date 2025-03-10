import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoginBody from "./components/body/login_body";
import RegisterBody from "./components/body/register_body";
import Dashboard from "./components/dashboard/dashboard";
import LearnMorePage from "./components/LearnMore";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginBody />} />
          <Route path="/learn_more" element={<LearnMorePage />} />
          <Route path="/register" element={<RegisterBody />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LoginBody from "./components/body/body";
import Register from "./components/auth/register";
import Dashboard from "./components/dashboard/dashboard";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginBody />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

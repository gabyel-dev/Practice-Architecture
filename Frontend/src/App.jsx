import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { useEffect } from "react";
import axios from "axios";

function App() {
  useEffect(() => {
    axios
      .get("http://localhost:5000/user")
      .then((res) => res.data)
      .catch((error) => console.log(error));
  }, []);
  return <></>;
}

export default App;

import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import "./index.css";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Pages/Homepage/homepage";
import AdminPanel from "./components/Pages/Admin Panel/admin-panel";
import EmployeePanel from "./components/Pages/Employee Panel/employee-panel";

function App() {
  const [accounts, setAccounts] = useState("");

  return (
    <div className="App">
      <Router>
        <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/employee-panel" element={<EmployeePanel />} />
          </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

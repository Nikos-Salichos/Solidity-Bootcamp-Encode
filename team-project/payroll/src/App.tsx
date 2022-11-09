import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import "./index.css";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Pages/Homepage/homepage";
import AdminPanel from "./components/Pages/Admin Panel/admin-panel";
import EmployeePanel from "./components/Pages/Employee Panel/employee-panel";
import AddEmployee from "./components/Pages/Add An Employee/add-employee";
import Stake from "./components/Pages/Employee Panel/stake";
import UpdateEmployeeSalary from "./components/Pages/Admin Panel/update-salary";
import GiveBonus from "./components/Pages/Admin Panel/give-bonus";

function App() {
  const [accounts, setAccounts] = useState("");

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/Encode-Solidity-Bootcamp/" element={<Homepage />} />
          <Route path="/Encode-Solidity-Bootcamp/admin-panel" element={<AdminPanel />} />
          <Route path="/Encode-Solidity-Bootcamp/employee-panel" element={<EmployeePanel />} />
          <Route path="/Encode-Solidity-Bootcamp/add-employee" element={<AddEmployee />} />
          <Route path="/Encode-Solidity-Bootcamp/stake" element={<Stake />} />
          <Route path="/Encode-Solidity-Bootcamp/update-salary" element={<UpdateEmployeeSalary />} />
          <Route path="/Encode-Solidity-Bootcamp/give-bonus" element={<GiveBonus />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;

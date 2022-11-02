import React, { useState } from "react";
import "./App.css";
import ReadPayroll from "./components/readPayroll";
import AddEmployee from "./components/addEmployee";
import RemoveEmployee from "./components/removeEmployee";
import FundCompanyAccount from "./components/FundCompanyAccount";
import PayEmployees from "./components/PayEmployees";
import PayAnEmployee from "./components/PayAnEmployee";
import Navbar from "./components/Navbar/Navbar";
import "./index.css";
import Footer from "./components/Footer/Footer";

function App() {
  const [accounts, setAccounts] = useState("");

  return (
    <div className="App">
      <Navbar />
      <ReadPayroll accounts={accounts} setAccounts={setAccounts}></ReadPayroll>
      <AddEmployee accounts={accounts} setAccounts={setAccounts}></AddEmployee>
      <RemoveEmployee accounts={accounts} setAccounts={setAccounts}></RemoveEmployee>
      <FundCompanyAccount accounts={accounts} setAccounts={setAccounts}></FundCompanyAccount>
      <PayEmployees accounts={accounts} setAccounts={setAccounts}></PayEmployees>
      <PayAnEmployee accounts={accounts} setAccounts={setAccounts}></PayAnEmployee>
      <Footer />
    </div>
  );
}

export default App;

import React, { useState } from "react";
import "./App.css";
import ReadPayroll from "./components/ReadPayroll";
import AddEmployee from "./components/AddEmployee";
import RemoveEmployee from "./components/RemoveEmployee";
import FundCompanyAccount from "./components/FundCompanyAccount";
import PayEmployees from "./components/PayEmployees";
import PayAnEmployee from "./components/PayAnEmployee";

function App() {
  const [accounts, setAccounts] = useState("");

  return (
    <div className="App">
      <header></header>
      <ReadPayroll accounts={accounts} setAccounts={setAccounts}></ReadPayroll>
      <AddEmployee accounts={accounts} setAccounts={setAccounts}></AddEmployee>
      <RemoveEmployee accounts={accounts} setAccounts={setAccounts}></RemoveEmployee>
      <FundCompanyAccount accounts={accounts} setAccounts={setAccounts}></FundCompanyAccount>
      <PayEmployees accounts={accounts} setAccounts={setAccounts}></PayEmployees>
      <PayAnEmployee accounts={accounts} setAccounts={setAccounts}></PayAnEmployee>
    </div>
  );
}

export default App;

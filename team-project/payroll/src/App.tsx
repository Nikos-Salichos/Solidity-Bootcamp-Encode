import React, { useState } from "react";
import "./App.css";
import ReadPayroll from "./components/readPayroll";
import AddEmployee from "./components/addEmployee";
import RemoveEmployee from "./components/removeEmployee";

function App() {
  const [accounts, setAccounts] = useState("");

  return (
    <div className="App">
      <header></header>
      <ReadPayroll accounts={accounts} setAccounts={setAccounts}></ReadPayroll>
      <AddEmployee accounts={accounts} setAccounts={setAccounts}></AddEmployee>
      <RemoveEmployee accounts={accounts} setAccounts={setAccounts}></RemoveEmployee>
    </div>
  );
}

export default App;

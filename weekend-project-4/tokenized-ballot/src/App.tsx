import React, { useState } from "react";
import "./App.css";
import ReadSmartContract from "./components/readSmartContract";
import Mint from "./components/mint";
import Delegate from "./components/delegate";
import Vote from "./components/vote";

function App() {
  const [accounts, setAccounts] = useState("");
  const [amountOfTokens, setAmountOfTokens] = useState("");

  return (
    <div className="App">
      <div>
        <ReadSmartContract accounts={accounts} setAccounts={setAccounts}></ReadSmartContract>
        <Mint amountOfTokens={amountOfTokens} setAmountOfTokens={setAmountOfTokens} accounts={accounts} setAccounts={setAccounts}></Mint>
        <Delegate accounts={accounts} setAccounts={setAccounts}></Delegate>
        <br></br>
        <Vote accounts={accounts} setAccounts={setAccounts}></Vote>
      </div>
    </div>
  );
}

export default App;

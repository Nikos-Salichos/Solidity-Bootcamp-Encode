import React, { useState } from "react";
import "./App.css";
import ReadSmartContract from "./components/readSmartContract";
import Mint from "./components/mint";
import Delegate from "./components/delegate";
import Vote from "./components/vote";
import Header from "./components/header/header";

function App() {
  const [accounts, setAccounts] = useState("");
  const [amountOfTokens, setAmountOfTokens] = useState("");

  return (
    <div className="App">
      <Header />
      <div className="section">
        <div className="container-default">
          <ReadSmartContract accounts={accounts} setAccounts={setAccounts}></ReadSmartContract>
          <div className="grid-section">
            <Mint amountOfTokens={amountOfTokens} setAmountOfTokens={setAmountOfTokens} accounts={accounts} setAccounts={setAccounts}></Mint>
            <Delegate accounts={accounts} setAccounts={setAccounts}></Delegate>
          </div>
          <Vote accounts={accounts} setAccounts={setAccounts}></Vote>
        </div>
      </div>
    </div>
  );
}

export default App;

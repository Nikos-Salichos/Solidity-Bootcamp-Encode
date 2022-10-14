import React, { useState } from "react";
import "./App.css";
import ReadSmartContract from "./components/readSmartContract";
import Mint from "./components/mint";
import Delegate from "./components/delegate";
import Vote from "./components/vote";

function App() {
  const [accounts, setAccounts] = useState("");

  return (
    <div className="App">
      <div>
        <ReadSmartContract accounts={accounts} setAccounts={setAccounts}></ReadSmartContract>
      </div>
    </div>
  );
}

export default App;

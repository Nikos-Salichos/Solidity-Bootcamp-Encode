import React, { useState } from "react";
import "./App.css";
import bet from "./components/bet";
import closeLottery from "./components/closeLottery";
import OpenBets from "./components/openBets";
import ownerWithdraw from "./components/ownerWithdraw";
import prizeWithdraw from "./components/prizeWithdraw";
import purchaseTokens from "./components/purchaseTokens";
import ReadLottery from "./components/readLottery";
import ReturnTokens from "./components/returnTokens";

function App() {
  const [accounts, setAccounts] = useState("");
  const [amountOfTokens, setAmountOfTokens] = useState("");

  return (
    <div className="App">
      <OpenBets accounts={accounts} setAccounts={setAccounts}></OpenBets>
      <ReadLottery accounts={accounts} setAccounts={setAccounts}></ReadLottery>
    </div>
  );
}

export default App;

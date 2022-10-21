import React, { useState } from "react";
import "./App.css";
import Bet from "./components/bet";
import CloseLottery from "./components/closeLottery";
import OpenBets from "./components/openBets";
import OwnerWithdraw from "./components/ownerWithdraw";
import PrizeWithdraw from "./components/prizeWithdraw";
import PurchaseTokens from "./components/purchaseTokens";
import ReadLottery from "./components/readLottery";
import ReturnTokens from "./components/returnTokens";

function App() {
  const [accounts, setAccounts] = useState("");
  const [amountOfTokens, setAmountOfTokens] = useState("");

  return (
    <div className="App">
      <OpenBets accounts={accounts} setAccounts={setAccounts}></OpenBets>
      <PurchaseTokens accounts={accounts} setAccounts={setAccounts}></PurchaseTokens>
      <ReadLottery accounts={accounts} setAccounts={setAccounts}></ReadLottery>
      <OwnerWithdraw></OwnerWithdraw>
      <ReturnTokens accounts={accounts} setAccounts={setAccounts}></ReturnTokens>
    </div>
  );
}

export default App;

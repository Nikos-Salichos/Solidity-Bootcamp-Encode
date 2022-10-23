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
import Navbar  from "./components/navbar/navbar";

function App() {
  const [accounts, setAccounts] = useState("");

  return (
    <div className="App">
      <Navbar />
      <div className="container-default">
        <ReadLottery accounts={accounts} setAccounts={setAccounts} />
        <div className="grid-section">
          <OpenBets accounts={accounts} setAccounts={setAccounts} />
          <PurchaseTokens accounts={accounts} setAccounts={setAccounts} />
        </div>
        <div className="grid-section">
          <Bet accounts={accounts} setAccounts={setAccounts} />
          <OwnerWithdraw></OwnerWithdraw>
        </div>
        <div className="grid-section">
          <PrizeWithdraw accounts={accounts} setAccounts={setAccounts} />
          <ReturnTokens accounts={accounts} setAccounts={setAccounts}></ReturnTokens>
        </div>
        <CloseLottery accounts={accounts} setAccounts={setAccounts} />
      </div>
    </div>
  );
}

export default App;

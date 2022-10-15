import React from "react";

function Delegate({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  async function delegateTokens() {
    if (accounts[0] !== "undefined") {
    }
  }

  return (
    <div>
      <button className="mintButton" onClick={delegateTokens}>
        Delegate
      </button>
    </div>
  );
}

export default Delegate;

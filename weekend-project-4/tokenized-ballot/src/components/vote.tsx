import React from "react";

function Vote({ accounts, setAccounts }: { accounts: any; setAccounts: any }) {
  async function vote() {
    if (accounts[0] !== "undefined") {
    }
  }

  return (
    <div>
      <button className="mintButton" onClick={vote}>
        Vote
      </button>
    </div>
  );
}

export default Vote;

import { ethers } from "ethers";
import React, { useState } from "react";
import { payrollContract } from "../../../assets/PayrollContract";
import { payrollAddress } from "../../../assets/PayrollAddress";
import "./admin-panel.css";

function AdminPanel() {
    return (
        <>
            <div className="admin-panel">
                <div className="section">
                    <div className="container-default">
                        <h1>Admin Panel</h1>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AdminPanel;
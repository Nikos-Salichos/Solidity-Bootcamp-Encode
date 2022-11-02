import { ethers } from "ethers";
import React, { useState } from "react";
import { payrollContract } from "../../../assets/PayrollContract";
import { payrollAddress } from "../../../assets/PayrollAddress";
import "./employee-panel.css";

function EmployeePanel() {
    return (
        <>
            <div className="employee-panel">
                <div className="section">
                    <div className="container-default">
                        <h1>Employee Panel</h1>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EmployeePanel;
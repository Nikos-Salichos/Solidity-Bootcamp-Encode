import React from "react";
import "./Footer.css";

function Footer() {
    return (
        <>
            <div className="footer">
                <div className="footer-container">
                    <div className="footer-link">
                        <a target="_blank" href="https://github.com/Nikos-Salichos/Encode-Solidity-Bootcamp-Weekend-Projects" className="link">Github</a>
                        <a target="_blank" href={`https://goerli.etherscan.io/address/`} className="link">Etherscan</a>
                    </div>
                    <p>© 2022 N&E</p>
                </div>
            </div>
        </>
    );      
}

export default Footer;
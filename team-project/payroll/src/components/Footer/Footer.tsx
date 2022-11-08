import React from "react";
import { Button, Icon, Label } from "semantic-ui-react";
// import "./Footer.css";

function Footer() {
  return (
    <>
      <div
        className="footer h-[50vh] flex flex-col items-center justify-center
      bg-gradient-to-t from-green-900 to-green-600"
      >
        {/* <div className="footer-container "> */}
        <div className="footer-link w-1/2 flex justify-around pb-10">
          {/* <div className="buttons-container"> */}
          <a
            target="_blank"
            href="https://github.com/Nikos-Salichos/Encode-Solidity-Bootcamp-Weekend-Projects"
          >
            <Button as="div" labelPosition="right">
              <Button size="huge" color="black">
                <Icon name="star" />
                Star
              </Button>
              <Label as="a" basic color="black" pointing="left">
                2,048
              </Label>
            </Button>
          </a>
          <a
            target="_blank"
            href="https://github.com/Nikos-Salichos/Encode-Solidity-Bootcamp-Weekend-Projects/fork"
          >
            <Button as="div" labelPosition="right">
              <Button size="huge" color="black">
                <Icon name="fork" />
                Fork
              </Button>
              <Label as="a" basic color="black" pointing="left">
                1,453
              </Label>
            </Button>
          </a>
          {/* </div> */}
        </div>
      </div>
      <div className="bg-green-900 py-1 text-sm text-gray-300">© 2022 N&E</div>
      {/* </div> */}
    </>
  );
}

export default Footer;

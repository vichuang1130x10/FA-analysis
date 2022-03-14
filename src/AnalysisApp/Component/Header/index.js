import React from "react";
import { Link } from "@reach/router";
import logo from "../../../logo.svg";

const Header = () => (
  <header>
    <div className="App-Header">
      <Link to="/">
        <img src={logo} className="App-Logo" alt="logo" />
      </Link>
    </div>
  </header>
);

export default Header;

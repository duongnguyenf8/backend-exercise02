import React from "react";
import { NavLink } from "react-router-dom";

export default function HomePage() {
  return (
    <header>
      <ul>
        <li className="success">
          <NavLink to={"/otp"} className={"success"} >
            Fake OTP
          </NavLink>
        </li>
      </ul>
    </header>
  );
}

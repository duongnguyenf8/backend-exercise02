import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../Pages/global/HomePage";
import OTPHome from "../Pages/otp/OTPHome";
import Account from "../Pages/otp/Account";
import Success from "../Pages/otp/Success";
import Error from "../Pages/global/Error";
export default function Routers() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/otp">
        <Route path="" element={<OTPHome />} />
        <Route path="account/:slug" element={<Account />} />
        <Route path="success/:slug" element={<Success />} />
      </Route>
      <Route path="*" element={<Error />} />
    </Routes>
  );
}

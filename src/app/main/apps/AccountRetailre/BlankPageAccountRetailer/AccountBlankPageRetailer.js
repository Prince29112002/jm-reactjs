import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";

const AccountBlankPageRetailer = () => {
  const dispatch = useDispatch();
  useEffect(() => {
     NavbarSetting("Accounts-Retailer", dispatch);
  },[]);

  return <></>;
};

export default AccountBlankPageRetailer;

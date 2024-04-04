import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";

const SalesBlankPageRetailer = () => {
  const dispatch = useDispatch();
  useEffect(() => {
     NavbarSetting("Sales-Retailer", dispatch);
  },[]);

  return <></>;
};

export default SalesBlankPageRetailer;

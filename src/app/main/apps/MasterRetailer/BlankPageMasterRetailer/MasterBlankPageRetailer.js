import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";

const MasterBlankPageRetailer = () => {
  const dispatch = useDispatch();
  useEffect(() => {
     NavbarSetting("Master-Retailer", dispatch);
  },[]);

  return <></>;
};

export default MasterBlankPageRetailer;

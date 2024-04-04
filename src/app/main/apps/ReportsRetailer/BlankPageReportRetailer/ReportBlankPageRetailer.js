import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";

const ReportBlankPageRetailer = () => {
  const dispatch = useDispatch();
  useEffect(() => {
     NavbarSetting("Reports-Retailer", dispatch);
  },[]);

  return <></>;
};

export default ReportBlankPageRetailer;

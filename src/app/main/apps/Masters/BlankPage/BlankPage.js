import React, { useEffect } from "react";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import { useDispatch } from "react-redux";

const BlankPage = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    NavbarSetting('Master', dispatch);
    //eslint-disable-next-line
  }, []);

  return <div>
  </div>;
};

export default BlankPage;

import React, { useContext, useState, useEffect } from "react";
import {
  AppBar,
  Avatar,
  FormControl,
  Grid,
  Hidden,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Toolbar,
} from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import { FuseSearch } from "@fuse"; //, FuseShortcuts
import NavbarMobileToggleButton from "app/fuse-layouts/shared-components/NavbarMobileToggleButton";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useTheme } from "@material-ui/core/styles";
import jwtService from "app/services/jwtService";
import UserMenu from "app/fuse-layouts/shared-components/UserMenu";
import Notification from "app/fuse-layouts/shared-components/Notification";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import Select, { createFilter } from "react-select";
import AppContext from "app/AppContext";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import logo from "assets/images/logo/logo 2.png";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  separator: {
    width: 1,
    height: 64,
    backgroundColor: theme.palette.divider,
  },
}));

function ToolbarLayout1(props) {
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);

  const classes = useStyles(props);
  const dispatch = useDispatch();
  const theme = useTheme();

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const [departmentData, setDepartmentData] = useState([]);
  const { selectedDepartment, setSelectedDepartment } = useContext(AppContext);
  const [master, setMaster] = useState(false);
  function handleDepartmentChange(value) {
    let tempVal = Number(value.value.split("-")[1]);
    setSelectedDepartment(value);
    localStorage.setItem("SelectedDepartment", tempVal);
    localStorage.setItem("selDeptNm", value.label);
  }
  useEffect(() => {
    setTimeout(() => {
      let authToken = jwtService.getAccessToken();
      if (authToken !== null && jwtService.isAuthTokenValid(authToken))
        getDepartmentData(); //user department
    }, 1000);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    return () => {
    };
  }, []);

  useEffect(() => {
    checkRoute();
    //eslint-disable-next-line
  }, [window.location.pathname]);

  const checkRoute = () => {
    const currPath = window.location.pathname;
    const pathArr = currPath.split("/");
    if (
      `${pathArr[1]}/${pathArr[2]}` === "dashboard/masters" ||
      `${pathArr[1]}/${pathArr[2]}` === "dashboard/mobappadmin"
    ) {
      setMaster(true);
    } else {
      setMaster(false);
    }
  };

  function getDepartmentData() {
    axios
      .get(Config.getCommonUrl() + "api/admin/getdepartmentlist")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);

          // let data = response.data.data;
          let data = response.data.data.filter((s) => s.is_location !== 1);
          setDepartmentData(data);
          localStorage.setItem("allDepartments", JSON.stringify(data));
          const findIndex = data.findIndex((a) => a.is_main === 1);
          const prevDept = localStorage.getItem("SelectedDepartment");
          if (prevDept) {
            data.map((item, index) => {
              if (Number(prevDept) === item.id) {
                setSelectedDepartment({
                  value: `SL${index}-${item.id}`, // item.id,
                  label: item.name,
                });
                localStorage.setItem("selDeptNm", item.name);
              }
              return null;
            });
            localStorage.setItem("SelectedDepartment", prevDept);
          } else {
            if (findIndex > -1) {
              setSelectedDepartment({
                value: `SL${findIndex}-${data[findIndex].id}`, //data[findIndex].id,
                label: data[findIndex].name,
              });
              localStorage.setItem("SelectedDepartment", data[findIndex].id);
              localStorage.setItem("selDeptNm", data[findIndex].name);
            }
          }
        } else {
          setDepartmentData([]);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        }
      })
      .catch((error) => {
   
        handleError(error, dispatch, { api: "api/admin/getdepartmentlist" });
      });
  }

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar
        id="fuse-toolbar"
        className="flex relative z-10 navbar-dv"
        color="default"
      >
        <Toolbar className="p-0">
          {config.navbar.display && config.navbar.position === "left" && (
            <Hidden lgUp>
              <NavbarMobileToggleButton className="w-64 h-64 p-0" />
              <div className={classes.separator} />
            </Hidden>
          )}

          <div className="flex flex-1 menu-left-jm" style={{alignItems:"center"}}>
            <ConditionalLink
              to="/dashboard"
              condition={localStorage.getItem("isDesigner") == "true"}
            >
              <img
                className="jm-navbar-logo "
                style={{ alignSelf: "start", cursor: "pointer" }}
                src={Config.getjvmLogo()}
                alt="logo1"
              />
            </ConditionalLink>

            {/* <Link to="/dashboard" tabIndex="-1">
              <img
                className="jm-navbar-logo "
                style={{ alignSelf: "start", cursor: "pointer" }}
                src={
                  Config.getS3Url() +
                  "images/avatars/vk-jewels-pvt-ltd-logo.svg"
                }
                alt="logo"
              //   onClick={handleLogoClick}
              />
            </Link> */}

            <Icon className="home-hoverbtn">
              <img src={Icones.home_hover} alt="" />
            </Icon>
            <ConditionalLink
              to="/dashboard"
              condition={localStorage.getItem("isDesigner") == "true"}
            >
              <IconButton className="main-home-btn">
                <Icon className="home-btn">
                  <img src={Icones.home} alt="" />
                </Icon>
                <Icon className="home-hoverbtn">
                  <img src={Icones.home_hover} alt="" />
                </Icon>
              </IconButton>
            </ConditionalLink>
          </div>

          <div className="flex right-menu-dv">
            <div className="inner-right-navbar-dv">
              <UserMenu />

              <div className={classes}></div>
              <Notification />
              {localStorage.getItem("isDesigner") !== "true" && (
                <>
                  <div className={classes}>
                    <FuseSearch />
                  </div>
                </>
              )}

              {/* <div className={classes.separator} />

              {
                !master ? <Select
                  id="nav-dropdown-dv"
                  tabIndex="1"
                  filterOption={createFilter({ ignoreAccents: false })}
                  classes={classes}
                  styles={selectStyles}
                  style={{ alignSelf: "center" }}
                  // options={departmentData.map((suggestion) => ({
                  //   value: suggestion.id,
                  //   label: suggestion.name,
                  //   isDisabled : suggestion.is_location === 1 ? true : false
                  // }))}
                  options={departmentData.map((suggestion, i) => ({
                    value: `SL${i}-${suggestion.id}`,
                    label: suggestion.name,
                    isDisabled: suggestion.is_location === 1 ? true : false
                  }))}

                  // components={components}
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  placeholder="Select Location/ Dept"
                /> : null
              }



              {/* <Hidden lgUp> chat panel and quick panel button right above

                            <div className={classes.separator}/>

                            <ChatPanelToggleButton/>
                        </Hidden>

                        <div className={classes.separator}/>

                        <QuickPanelToggleButton/> */}
            </div>
          </div>

          {config.navbar.display && config.navbar.position === "right" && (
            <Hidden lgUp>
              <NavbarMobileToggleButton />
            </Hidden>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

//if user is designer then he can not redirect to dashboard by clicking logo
function ConditionalLink({ children, condition, ...props }) {
  return !condition && props.to ? (
    <Link {...props}>{children}</Link>
  ) : (
    <>{children}</>
  );
}

export default ToolbarLayout1;

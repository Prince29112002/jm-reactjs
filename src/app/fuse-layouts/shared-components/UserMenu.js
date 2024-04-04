import React, { useContext, useState, useEffect } from "react";
import {
  Button,
  Icon,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import * as authActions from "app/auth/store/actions";
import * as Actions from "app/store/actions";
import { Link } from "react-router-dom";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";
import AppContext from "app/AppContext";
import Select, { createFilter,components  } from "react-select";
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import { useTheme } from "@material-ui/core/styles";
import jwtService from "app/services/jwtService";
import CachedIcon from '@material-ui/icons/Cached';
const useStyles = makeStyles((theme) => ({
  separator: {
    width: 1,
    height: 64,
    backgroundColor: theme.palette.divider,
  },
  control: (provided, state) => ({
    ...provided,
    width: 288,
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: 160,
    overflowY: 'auto',
  }),
}));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 288,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: 160,
      overflowY: 'auto',
    }),
  };


function UserMenu(props) {
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const [departmentData, setDepartmentData] = useState([]);
  const { selectedDepartment, setSelectedDepartment } = useContext(AppContext);
  const [master, setMaster] = useState(false);
  const [chainRetail, setChainRetailer] = useState("");
  const [Retail, setRetailer] = useState("");
console.log(Retail);
  const classes = useStyles(props);
  const theme = useTheme();

  function handleDepartmentChange(value) {
    let tempVal = Number(value.value.split("-")[1]);
    setSelectedDepartment(value);
    localStorage.setItem("SelectedDepartment", tempVal);
    localStorage.setItem("selDeptNm", value.label);
  }

const is_retailer_admin=localStorage.getItem("is_retailer_admin")

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

  function callLogOutApi() {
    axios
      .post(Config.getCommonUrl() + "admin/logout")
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          handleClose();
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          dispatch(authActions.logoutUser("Logout", { api: "admin/logout" }));
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "admin/logout" });
      });
  }

  useEffect(() => {
    checkRoute();
    //eslint-disable-next-
    let chain = localStorage.getItem("isChainRetailer")
    setChainRetailer(chain)
    const is_retailer_admin=localStorage.getItem("is_retailer_admin")
    setRetailer(is_retailer_admin)
    console.log(is_retailer_admin);
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
          dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
        }
      })
      .catch((error) => {

        handleError(error, dispatch, { api: "api/admin/getdepartmentlist" });
      });
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const Option = (props) => (
    <components.Option {...props} isDisabled={props.data.isDisabled} />
  );
  const options = departmentData.map((suggestion, i) => ({
    value: `SL${i}-${suggestion.id}`,
    label: suggestion.name,
    isDisabled: suggestion.is_location === 1,
  }));

  return (
    <React.Fragment>
      <Button
        className="h-64 profilebtn"
        // onClick={userMenuClick}
        onClick={handleClick}
        tabIndex="4"
        id="basic-button"
        aria-controls={open ? "basic-menu" : null}
        aria-haspopup="true"
        aria-expanded={open ? "true" : null}
      >
        <Icon style={{fontSize: "28px"}}>account_circle</Icon>
        { !master ?   <div style={{paddingLeft: "20px", maxWidth:"185px"}} className="hidden md:flex flex-col">
        <div className="hidden md:flex flex-col  items-start" style={{alignItems:"end"}}>
          <Typography component="span" className="capitalize font-800 flex">
            {user.data.displayName}
          </Typography>
       
{ chainRetail === "0" && Retail==="0" ?
         <div className="normal-case font-300 hidden md:flex flex-col"style={{alignItems:"end"}}>{selectedDepartment.label}</div>:""}
          </div>
          </div> :    <div className="hidden md:flex flex-col">
        <div className="hidden md:flex flex-col ml-12 items-start" style={{alignItems:"end"}}>
          <Typography component="span" className="capitalize font-800 flex">
            {user.data.displayName}
          </Typography>
        </div>
          </div>}
        <Icon className="text-14 ml-12 hidden sm:flex" variant="action">
          <img src={Icones.dropdown} alt="" />   </Icon>
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        open={open}
        onClose={handleClose}

        classes={{
       
        }}

        keepMounted={false}
        className="h-400 "
        PaperProps={{
          style: {
            transform: !master ? "translateX(16px) translateY(50px)" : "translateX(20px) translateY(50px)",
            overflow:"initial"
          },
        }}
      >
        {/* <React.Fragment> */}
        { chainRetail === "0" && Retail==="0" ? "":
        <MenuItem component={Link} to={chainRetail !== "0" ? "/dashboard/mastersretailer/profilechainretailer" : "/dashboard/mastersretailer/profileretailer"} onClick={handleClose}>
          <ListItemIcon className="min-w-40">
            <Icon>account_circle</Icon>
          </ListItemIcon>
          <ListItemText className="pl-0" primary="My Profile" />
        </MenuItem>}
        <MenuItem component={Link} to="/pages/profile" onClick={handleClose}>
          <ListItemIcon className="min-w-40">
            <CachedIcon />
          </ListItemIcon>
          <ListItemText className="pl-0" primary="Change Password" />
        </MenuItem>
       
        <MenuItem
          onClick={() => {
            callLogOutApi();
          }}
        >
          <ListItemIcon className="min-w-40">
            <Icon>exit_to_app</Icon>
          </ListItemIcon>
          <ListItemText className="pl-0" primary="Logout" />
        </MenuItem>
        {/* </React.Fragment> */}
        <div style={{padding: "10px 10px 0px 10px"}}>
          {
            chainRetail === "0" && Retail==="0" ? <Select
            className="pt-0"
            tabIndex="1"
            filterOption={createFilter({ ignoreAccents: false })}
            styles={customStyles}
            components={{ Option }}
            options={options}
            value={selectedDepartment}
            onChange={handleDepartmentChange}
            placeholder="Select Location/Dept"
          /> : null
          }
        </div>
      </Menu>

    </React.Fragment>
  );
}

export default UserMenu;

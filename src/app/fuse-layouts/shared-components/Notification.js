import React, { useContext, useState, useEffect } from "react";
import { IconButton, ListItemText, Popover, MenuItem } from "@material-ui/core"; //ListItemIcon

import { Link } from "react-router-dom";
import Badge from "@material-ui/core/Badge";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import jwtService from "app/services/jwtService";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import History from "@history";
import AppContext from "app/AppContext";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

function Notification(props) {
  const dispatch = useDispatch();
  // const user = useSelector(({auth}) => auth.user);

  const useStyles = makeStyles((theme) => ({
    root: {},
  }));

  const classes = useStyles(props);

  const [notificationMenu, setNotificationMenu] = useState(null);
  // const [invisible, setInvisible] = useState(false);
  const [count, setCount] = useState(0);

  const [notificationData, setNotificationData] = useState([]);
  const [acceptTransNoti, setAcceptTransNoti] = useState([]);

  // const departmentId = localStorage.getItem('SelectedDepartment');
  const [departmentID, setDepartmentID] = useState();

  const appContext = useContext(AppContext);

  const { selectedDepartment } = appContext;

  useEffect(() => {
    //eslint-disable-next-line
    if (selectedDepartment !== "") {
      // setFilters()
      setDepartmentID(selectedDepartment.value.split("-")[1]);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    getAlerts(); //for first time
    const interval = setInterval(() => getAlerts(), 10000);
    return () => {
      clearInterval(interval);
    };

    //eslint-disable-next-line
  }, [departmentID]);

  useEffect(() => {
    return () => {
    };
  }, []);

  useEffect(() => {
    if (acceptTransNoti.length > 0) {
      updateAcceptViewNotification();
    }
    //eslint-disable-next-line
  }, [acceptTransNoti]);

  function getAlerts() {
    setTimeout(() => {
      let authToken = jwtService.getAccessToken();

      if (authToken !== null && jwtService.isAuthTokenValid(authToken)) {
        if (selectedDepartment !== "" && departmentID !== undefined) {
        }
      }
    }, 500);
  }

  function getNotifications(selectedDept) {

    axios
      .get(Config.getCommonUrl() + `api/notification/all/${selectedDept}`)
      .then(function (response) {

        if (response.data.success === true) {
          const key = Object.values(response.data.data);
          const values = Object.keys(response.data.data);

          let temp = [];
          for (let i = 0; i < values.length; i++) {
            temp.push({
              value: values[i],
              label: key[i],
            });
          }

          for (let j = 0; j < values.length; j++) {
            setTimeout(function () {
              dispatch(
                Actions.showMessage({
                  message: key[j].massage,
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  autoHideDuration: 1500,
                })
              );
            }, 1000 * j);
          }

          setCount(temp.length);
          // setInvisible(false)
          setNotificationData(temp);
        } else {
          setCount(0);
          setNotificationData([]);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/notification/all/${selectedDept}`,
        });
      });
  }

  function updateAcceptViewNotification() {
    const body = {
      id: acceptTransNoti,
    };
    var callApi = `api/notification/update`;
    axios
      .put(Config.getCommonUrl() + callApi, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/notification/update",
          body: body,
        });
      });
  }

  const userMenuClick = (event) => {
    setNotificationMenu(event.currentTarget);
    // setInvisible(!invisible);
    // setInvisible(true);
    setCount(0);
    const notiData = [...notificationData];
    const selArr = [];
    notiData.map((item) => {
      if (item.label.is_info === 1) {
        selArr.push(item.label.id);
      }
      return null;
    });
    if (selArr.length > 0) {
      setAcceptTransNoti(selArr);
    }
  };

  const notificationHandleClik = (element) => {
    if (element.label.is_info === 0) {
      History.push("/dashboard/stock/accepttransferstock");
    }
  };

  const userMenuClose = () => {
    setNotificationMenu(null);
  };

  return (
    <React.Fragment>
      <div className={clsx(classes.root, "flex", props.className)}>
        {/* <Icon className="absolute top-0 right-0 h-48 w-48 p-12 pointer-events-none" color="action">search</Icon> */}
        <IconButton
          className="w-64 h-64"
          color="inherit"
          tabIndex="3"
          onClick={userMenuClick}
        >
          {/* <Badge color="secondary" overlap="rectangular" badgeContent={count} invisible={invisible}>
            <Icon>notifications</Icon>
          </Badge> */}
          <Badge
            color="secondary"
            badgeContent={count}
            className={classes.margin}
            overlap="rectangular"
          >
            <img src={Icones.notification} alt="" />
          </Badge>
        </IconButton>
        {notificationData.length > 0 && (
          <Popover
            open={Boolean(notificationMenu)}
            anchorEl={notificationMenu}
            onClose={userMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            classes={{
              paper: "py-8 overflow-y-auto noty-block-d",
            }}
          >
            <React.Fragment>
              {notificationData.map((element, index) => (
                <MenuItem
                  key={index}
                  component={Link}
                  to="#"
                  onClick={userMenuClose}
                >
                  <ListItemText
                    className="pl-0"
                    primary={element.label.massage}
                    onClick={() => notificationHandleClik(element)}
                  />
                </MenuItem>
              ))}
            </React.Fragment>
          </Popover>
        )}
      </div>
    </React.Fragment>
  );
}

export default Notification;

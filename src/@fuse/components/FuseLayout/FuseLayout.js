import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { withRouter } from "react-router-dom";
import { matchRoutes } from "react-router-config";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "app/store/actions";
import _ from "@lodash";
import AppContext from "app/AppContext";
import * as authActions from "app/auth/store/actions";
import { logoutUser } from "app/auth/store/actions";
import Layout2 from "app/fuse-layouts/layout2/Layout2";
import { useIdleTimer } from "react-idle-timer";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    '& code:not([class*="language-"])': {
      color: theme.palette.secondary.dark,
      backgroundColor: "#F5F5F5",
      padding: "2px 3px",
      borderRadius: 2,
      lineHeight: 1.7,
    },
    "& table.simple tbody tr td": {
      borderColor: theme.palette.divider,
    },
    "& table.simple thead tr th": {
      borderColor: theme.palette.divider,
    },
    "& a:not([role=button])": {
      color: theme.palette.secondary.main,
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    '& [class^="border-"]': {
      borderColor: theme.palette.divider,
    },
    '& [class*="border-"]': {
      borderColor: theme.palette.divider,
    },
  },
}));

function FuseLayout(props) {
  const dispatch = useDispatch();
  const defaultSettings = useSelector(({ fuse }) => fuse.settings.defaults);
  const settings = useSelector(({ fuse }) => fuse.settings.current);

  const classes = useStyles(props);
  const appContext = useContext(AppContext);
  const { routes } = appContext;
  const { setSelectedDepartment } = useContext(AppContext);

  useEffect(() => {
    const handleInvalidToken = (e) => {
      if (e.key === "authToken" && e.oldValue && !e.newValue) {
        // Your logout logic here
        // dispatch(authActions.logoutUser("tab_logout", null));
        // not needed here on logout user or idle time session is expired we just need to
        // logout user locally and send to login page, no need to call logs api, process is same, we can reload page
        window.location.reload();
        // logoutAction(history);
      } else if (e.key === "selDeptNm") {
        //for changing department in other tab
        // if we go through both storage condition, it will be called both time so one will be undefined thats why checked only one and got other from storage
        // checked which will be changed after, so we have latest department id in storage
        // deptNm = e.newValue;

        let allDept = JSON.parse(localStorage.getItem("allDepartments"));
        let index = allDept.findIndex(
          (item) =>
            item.id.toString() === e.storageArea.SelectedDepartment.toString()
        );
        let deptIDvalue = "";
        if (index > -1) {
          deptIDvalue = `SL${index}-${e.storageArea.SelectedDepartment}`;
        } else {
          deptIDvalue = e.storageArea.SelectedDepartment;
        }
        setSelectedDepartment({
          value: deptIDvalue,
          label: e.newValue,
        });
        // setSelectedDepartment({
        //     value: e.storageArea.SelectedDepartment,
        //     label: e.newValue,
        // });
      }
    };
    window.addEventListener("storage", handleInvalidToken, { passive: false });
    return function cleanup() {
      window.removeEventListener("storage", handleInvalidToken);
    };
    //eslint-disable-next-line
  }, [logoutUser]);

  useEffect(() => {
    function routeSettingsCheck() {
      const matched = matchRoutes(routes, props.location.pathname)[0];
      if (matched && matched.route.settings) {
        const routeSettings = _.merge(
          {},
          defaultSettings,
          matched.route.settings
        );
        if (!_.isEqual(settings, routeSettings)) {
          dispatch(Actions.setSettings(_.merge({}, routeSettings)));
        } else {
        }
      } else {
        if (!_.isEqual(settings, defaultSettings)) {
          dispatch(Actions.resetSettings());
        }
      }
    }

    routeSettingsCheck();
  }, [defaultSettings, dispatch, props.location.pathname, routes, settings]);
  let path = props.location.pathname.split("/");
  var Layout = Layout2;

  const onIdle = () => {
    // Close Modal Prompt
    // Do some idle action like log out your user
    dispatch(authActions.logoutUser("idle"));
  };

  //   const onActive = (event) => {
  //     // Close Modal Prompt

  //     // Do some active action
  //   };

  //   const onAction = (event) => {
  //     // Do something when a user triggers a watched event
  //   };
  // useIdleTimer({ onIdle, onActive, onAction, timeout: 10000 });
  useIdleTimer({
    // onPrompt,
    onIdle,
    // onActive,
    // onAction,
    timeout: process.env.REACT_APP_TIME ? process.env.REACT_APP_TIME : 600000, //10 minutes
    promptTimeout: 0,
    events: [
      "mousemove",
      "keydown",
      "wheel",
      "DOMMouseScroll",
      "mousewheel",
      "mousedown",
      "touchstart",
      "touchmove",
      "MSPointerDown",
      "MSPointerMove",
      "visibilitychange",
    ],
    immediateEvents: [],
    debounce: 0,
    throttle: 0,
    eventsThrottle: 200,
    element: document,
    startOnMount: true,
    startManually: false,
    stopOnIdle: false,
    crossTab: true,
    syncTimers: 0,
  });

  return <Layout classes={{ root: classes.root }} {...props} />;
}

export default withRouter(React.memo(FuseLayout));

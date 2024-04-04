import React from "react";
import { AppBar, Hidden, Icon, IconButton, Toolbar } from "@material-ui/core";
import { makeStyles, ThemeProvider } from "@material-ui/styles";
import { FuseSearch } from "@fuse";
import NavbarMobileToggleButton from "app/fuse-layouts/shared-components/NavbarMobileToggleButton";
import UserMenu from "app/fuse-layouts/shared-components/UserMenu";
import { useSelector } from "react-redux";
import Notification from "app/fuse-layouts/shared-components/Notification";
import { Link } from "react-router-dom";
import Config from "app/fuse-configs/Config";
import NavbarWrapperLayout2 from "./NavbarWrapperLayout2";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  separator: {
    width: 1,
    height: 64,
    backgroundColor: theme.palette.divider,
  },
}));

function ToolbarLayout2(props) {
  const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
  const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);
  const roleOfUser = localStorage.getItem('isChainRetailer')
  console.log(roleOfUser);
  const is_retailer_admin=localStorage.getItem("is_retailer_admin")
  const classes = useStyles(props);
  const pathname = window.location.pathname

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar
        id="fuse-toolbar"
        className="flex relative z-10  navbar-dv"
        color="default"
      >
        <Toolbar className="p-0">
          {/* {config.navbar.display && ( */}
          <Hidden lgUp>
            <NavbarMobileToggleButton className="w-64 h-64 p-0" />
            <div className={classes.separator} />
          </Hidden>
          {/* )} */}

          <div className="flex flex-1 menu-left-jm" style={{ alignItems: "center" }}>
            {/* <Hidden mdDown>
                            <FuseShortcuts className="px-16"/>
                        </Hidden> */}
            <Link to="/dashboard">
              <img
                className="jm-navbar-logo "
                style={{ alignSelf: "start", cursor: "pointer" }}
                src={Config.getjvmLogo()}
                alt="logo"
              //   onClick={handleLogoClick}
              />
            </Link>
            {/* {roleOfUser === "1"  ?<> */}
            <Icon className="home-hoverbtn">
              <img src={Icones.home_hover} alt="" />
            </Icon>
            <ConditionalLink
              to="/dashboard"
              condition={localStorage.getItem("isDesigner") == "true"}
              className="home-page-div"
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

          {pathname !== "/dashboard" && pathname !== "/dashboard/orderretailer" &&
            pathname !== "/dashboard/orderretailer/addorderretailer" && pathname !== "/dashboard/mortage"
            && pathname !== "/dashboard/mortage/addmortage" && pathname !== "/dashboard/scheme"
            && pathname !== "/dashboard/scheme/addscheme" && pathname !== "/dashboard/scheme/emipay"
            && pathname !== "/pages/profile" && pathname !== "/dashboard/stocktaggingretailer/:stock"&&
             pathname !== "/dashboard/productionOrder"&& pathname !== "/dashboard/Productionorders/addorders"
              && pathname !=="/dashboard/planningdashboard" && pathname !== "/dashboard/createplanandlot" 
              && pathname !== "/dashboard/planningdashboard/planningorders" 
              && pathname !== "/dashboard/planningdashboard/planninglots" ? (
            <NavbarWrapperLayout2 />) : null
          }

          <div className="flex right-menu-dv">
            <UserMenu />

            <div className={classes.separator} />

            {roleOfUser === "0" && is_retailer_admin==="0"?
              <Notification /> : ""}

            <div className={classes.separator} />
            {roleOfUser === "0" && is_retailer_admin==="0"?(pathname !== "/dashboard" && pathname !== "/dashboard/orderretailer" &&
              pathname !== "/dashboard/orderretailer/addorderretailer" && pathname !== "/dashboard/mortage"
              && pathname !== "/dashboard/mortage/addmortage" && pathname !== "/dashboard/scheme"
              && pathname !== "/dashboard/scheme/addscheme" && pathname !== "/dashboard/scheme/emipay"
              && pathname !== "/pages/profile" && pathname !== "/dashboard/stocktaggingretailer/:stock"&& pathname !== "/dashboard/createplanandlot" 
              && pathname !=="/dashboard/planningdashboard" && pathname !== "/dashboard/planningdashboard/planninglots" 
              && pathname !== "/dashboard/planningdashboard/planningorders" ? (
              <FuseSearch />) : null):""
            }
            {/* <Hidden lgUp>
                <div className={classes.separator} />
                <ChatPanelToggleButton />
                </Hidden>
                <div className={classes.separator} />
                <QuickPanelToggleButton /> */}
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}
function ConditionalLink({ children, condition, ...props }) {
  return !condition && props.to ? (
    <Link {...props}>{children}</Link>
  ) : (
    <>{children}</>
  );
}
export default ToolbarLayout2;

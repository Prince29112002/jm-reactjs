import React, { useEffect, useState, useLayoutEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { Avatar } from "@material-ui/core";
import clsx from "clsx";
import axios from "axios";
import { useDispatch } from "react-redux";
import jwtService from "app/services/jwtService";
import Config from "app/fuse-configs/Config";
import History from "@history";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "../ErrorComponent/ErrorComponent";
import Loader from "../Loader/Loader";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(6, 4),
  },
  card: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    // border: "1px solid black",
    borderRadius: "5px",
    transition: "0.4s",
    textAlign: "center",
    "&:focus": {
      // outline: "1px solid !important"
    },
  },
  title: {
    padding: theme.spacing(2),
    lineHeight: "1.2",
    color: " #586A9A!important",
    "&:hover": {
      cursor: "pointer",
      textDecoration: "underline",
    },
  },
  roundedDiv: {
    borderRadius: "50%",
    background: "white",
    "&:hover": {
      cursor: "pointer",
    },
  },
  avatar: {
    width: 140,
    height: 140,

    // position: "absolute",
    // top: 92,
    padding: 8,
    margin: 10,
    boxSizing: "content-box",

    "& > img": {},
  },
}));

const MainDashboard = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const roleOfUser = localStorage.getItem("permission")
    ? JSON.parse(localStorage.getItem("permission"))
    : null;
  const masterFirst =
    roleOfUser && roleOfUser["Master-Retailer"]
      ? Object.keys(roleOfUser["Master-Retailer"])
      : [];
  const accountFirst =
    roleOfUser && roleOfUser["Accounts-Retailer"]
      ? Object.keys(roleOfUser["Accounts-Retailer"])
      : [];
  const reportFirst =
    roleOfUser && roleOfUser["Reports-Retailer"]
      ? Object.keys(roleOfUser["Reports-Retailer"])
      : [];
  const salesPurchaseFirst =
    roleOfUser && roleOfUser["Sales-Retailer"]
      ? Object.keys(roleOfUser["Sales-Retailer"])
      : [];
  const isDesigner = localStorage.getItem("isDesigner");

  // first call layoutEffect then useEffect
  useLayoutEffect(() => {
    if (isDesigner == "true") {
      History.push("/dashboard/design");
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      let authToken = jwtService.getAccessToken();
      if (authToken !== null && jwtService.isAuthTokenValid(authToken)) {
        getAllOppositeAccountData();
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [loading]);

  useEffect(() => {
    NavbarSetting("Dashboard", dispatch);
  }, []);

  const dashBoardOptions = [
    // {
    //   id: "Orders",
    //   title: "Orders",
    //   icon: "assets/fonts/moduleIcone/Orders.svg",
    //   to: "/dashboard/productionOrder",
    //   uid: "Stock",
    // },
    {
      id: "Design",
      title: "Design",
      icon: "assets/fonts/moduleIcone/design.svg",
      to: "/dashboard/design",
      uid: "Design",
    },
    {
      id: "Mobile-app Admin",
      title: "Mobile App Admin",
      icon: "assets/fonts/moduleIcone/mobile app admin.svg",
      to: "/dashboard/mobappadmin/orders",
      uid: "Mobile-app-Admin",
    },
    {
      id: "Planning",
      title: "Planning",
      icon: "assets/fonts/moduleIcone/Planning.svg",
      to: "/dashboard/planningdashboard",
      uid: "Stock",
    },
    {
      id: "Production",
      title: "Production",
      icon: "assets/fonts/moduleIcone/production.svg",
      to: "/dashboard/production",
      uid: "Production",
    },

    {
      id: "Stock",
      title: "Stock",
      icon: "assets/fonts/moduleIcone/stock.svg",
      to: "/dashboard/stock/:stock",
      uid: "Stock",
    },
    {
      id: "Stock-Retailer",
      title: "Stock",
      icon: "assets/fonts/moduleIcone/stock.svg",
      to: "/dashboard/stocktaggingretailer/:stock",
      uid: "Stock",
    },

    {
      id: "Tagging",
      title: "Tagging",
      icon: "assets/fonts/moduleIcone/tagging.svg",
      to: "/dashboard/stock",
      uid: "Tagging",
    },
    {
      id: "Tagging-Retailer",
      title: "Tagging",
      icon: "assets/fonts/moduleIcone/tagging.svg",
      to: "/dashboard/stocktaggingretailer",
      uid: "Tagging",
    },
    

    {
      id: "Hallmark",
      title: "Hallmark",
      icon: "assets/fonts/moduleIcone/hallmark.svg",
      to: "/dashboard/hallmark",
      uid: "Hallmark",
    },
    {
      id: "Sales",
      title: "Sales/Purchase",
      icon: "assets/fonts/moduleIcone/sales purchase account.svg",
      to: "/dashboard/sales",
      uid: "Sales",
    },
    {
      id: "Sales-Retailer",
      title:
        parseFloat(window.localStorage.getItem("isChainZamZam")) === 1
          ? "Chain / Fine"
          : salesPurchaseFirst.includes("Artician Issue Metal-Chain-Retailer")
          ? "Metal Issue/Return"
          : "Sales/Purchase",
      icon: "assets/fonts/moduleIcone/sales purchase account.svg",
      to: salesPurchaseFirst.includes("Artician Issue Metal-Chain-Retailer")
        ? "/dashboard/sales/articianissuechainretailer"
        : "/dashboard/salesretailer",
      uid: "Sales",
    },

    {
      id: "Accounts",
      title: "Account",
      icon: "assets/fonts/moduleIcone/account.svg",
      uid: "Accounts",
      to: "/dashboard/accounts",
    },
    {
      id: "Accounts-Retailer",
      title: "Account",
      icon: "assets/fonts/moduleIcone/account.svg",
      uid: "Accounts",
      to: accountFirst.includes("Account-Retailer")
        ? "/dashboard/accountretailer/createaccountretailer"
        : "/dashboard/accountretailer",
    },

    {
      id: "Reports-Retailer",
      title: "Reports",
      icon: "assets/fonts/moduleIcone/reports.svg",
      to: reportFirst.includes("Sales Reports-Retailer")
        ? "/dashboard/reportsretailer/salesreportsretailer"
        : reportFirst.includes("Job Work Stock Statement-Chain-Retailer")
        ? "/dashboard/reportsretailer/JobWorkchainstockstatementretailer"
        : "/dashboard/reportsretailer",
      uid: "Factory-Report",
    },
    {
      id: "Factory Report",
      class: "Factory-Report",
      title: "Reports",
      icon: "assets/fonts/moduleIcone/reports.svg",
      to: "/dashboard/report",
      uid: "Factory-Report",
    },

    {
      id: "Master",
      title: "Master",
      icon: "assets/fonts/moduleIcone/masters.svg",
      to: "/dashboard/masters/goldrate", //'/apps/dashboards/analytics'
      uid: "Master",
    },
    {
      id: "Master-Retailer",
      title: "Master",
      icon: "assets/fonts/moduleIcone/mastericon.svg",
      to: masterFirst.includes("Gold Rate Today-Retailer")
        ? "/dashboard/mastersretailer/goldrateretailer"
        : masterFirst.includes("Client-Chain-Retailer")
        ? "/dashboard/mastersretailer/clientschainretailer"
        : "/dashboard/masterretailer", //'/apps/dashboards/analytics'
      uid: "Master-Retailer",
    },
   
    {
      id: "Orders-Retailer",
      title: "Custom Order",
      icon: "assets/fonts/moduleIcone/design.svg",
      to: "/dashboard/orderretailer",
      uid: "Design",
    },
   
    {
      id: "SETTINGS",
      title: "SETTINGS",
      icon: "images/avatars/settings.svg",
      to: "#",
      uid: "SETTINGS",
    },
   
    // {
    //   id: "Mobile-app Admin",
    //   title: "Mobile App Admin Retailer",
    //   icon: "assets/fonts/moduleIcone/mobile app admin.svg",
    //   to: "/dashboard/mobappadmin/OrdersRetailer",
    //   uid: "Mobile-app-Admin",
    // },
   
    {
      id: "Mortage-Retailer",
      title: "Gold/Silver Mortgage",
      icon: "assets/fonts/moduleIcone/mortgage.svg",
      to: "/dashboard/mortage",
      uid: "Mortage",
    },
    {
      id: "Scheme-Retailer",
      title: "Gold/Silver Scheme",
      icon: "assets/fonts/moduleIcone/hallmark.svg",
      to: "/dashboard/scheme",
      uid: "Scheme",
    },
    {
      id: "DBJewellers-Retailer", //DB Jeweler
      title: "Tagging Sheet",
      icon: "assets/fonts/moduleIcone/tagging.svg",
      to: "/dashboard/dbjeweler",
      uid: "Tagging",
    },
  ];

  function getAllOppositeAccountData() {
    axios
      .get(Config.getCommonUrl() + "api/oppositeAccounts")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          var apiRes = JSON.stringify(response.data.data);
          localStorage.setItem("oppositeAccount", apiRes);
        } else {
          localStorage.setItem("oppositeAccount", []);
        }
      })
      .catch(function (error) {
        localStorage.setItem("oppositeAccount", []);
        handleError(error, dispatch, { api: "api/oppositeAccounts" });
      });
  }

  function handleKeyChange(e, item) {
    var keyCode = 0;
    if (document.selection) {
      keyCode = e.keyCode;
    } else {
      keyCode = e.which;
    }
    if (keyCode === 32 || keyCode === 13) {
      NavbarSetting(item.id, dispatch);
      History.push(item.to);
    }
  }

  return (
    <div
      className={clsx(
        "flex flex-col flex-auto flex-shrink-0 items-center dashbord-main dashbord-bg-image dashbord-bg-image-dv p-32"
      )}
      style={{
        // background: "initial",
        // backgroundImage: `url(${Config.getS3Url() + "images/avatars/dashbord-bg-img.jpg"
        //   })`,
        background: "#FFFFFF",
      }}
    >
      <div
        className="flex flex-col items-center justify-center w-full "
        style={{ marginTop: "25px" }}
      >
        <Container component="section" maxWidth="lg" className={classes.root}>
          <Grid
            container
            spacing={5}
            alignItems="stretch"
            className="main-dasbord-d"
          >
            {loading && <Loader />}
            {roleOfUser &&
              dashBoardOptions.map((item, index) => {
                if (item.id in roleOfUser) {
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={index}>
                      {/* <Link
                    className="font-medium"
                    // to={item.to}
                    // onClick={() => onLinkClick(item.title)}
                    tabIndex="-1"
                  > */}
                      <div
                        className={classes.card}
                        tabIndex="0"
                        id={item.uid}
                        onClick={() => {
                          NavbarSetting(item.id, dispatch);
                          History.push(item.to);
                        }}
                        onKeyDown={(e) => {
                          handleKeyChange(e, item);
                        }}
                        style={{
                          marginRight: "20px",
                          direction: "unset",
                        }}
                      >
                        <div className={classes.roundedDiv}>
                          <Avatar
                            className={clsx(
                              classes.avatar,
                              "avatar rounde-menu"
                            )}
                            alt="user photo"
                            src={item.icon}
                          />
                        </div>

                        <Typography
                          component="h2"
                          className={clsx(classes.title, "rounde-title")}
                        >
                          {item.title}
                        </Typography>
                      </div>
                      {/* </Link> */}
                    </Grid>
                  );
                }
              })}
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default MainDashboard;

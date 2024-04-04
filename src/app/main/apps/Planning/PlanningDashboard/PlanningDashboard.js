import React, { useState, useEffect } from "react";
import { AppBar, Button, Grid, Tab, Tabs, Typography } from "@material-ui/core";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { FuseAnimate } from "@fuse";
import PlanningOrders from "../PlanningOrders/PlanningOrders";
import PlanningLots from "../PlanningLots/PlanningLots";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useDispatch } from "react-redux";
import History from "@history";
import * as Actions from "app/store/actions";
// import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
  },
}));

const PlanningDashboard = (props) => {
  const passedProps = props.location.state;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [showOrders, setShowOrders] = useState(true);
  const [planningOrdersList, setPlanningOrdersList] = useState([]);
  const [tabView, setTabView] = useState(0);

  const handleButtonClick = (show) => {
    setShowOrders(show);
    if (show) {
      History.push("/dashboard/planningdashboard/planningorders");
    } else {
      History.push("/dashboard/planningdashboard/planninglots");
    }
  };

  // const handleButtonClick = (e, newValue) => {
  //   console.log(newValue);
  //   setTabView(newValue);
  //   setShowOrders(newValue === 0 ? true : false);
  //   if (newValue === 0) {
  //     History.push("/dashboard/planningdashboard/planningorders");
  //   } else {
  //     History.push("/dashboard/planningdashboard/planninglots");
  //   }
  // };

  useEffect(() => {
    // NavbarSetting("Planing", dispatch);
    History.push("/dashboard/planningdashboard/planningorders");
  }, []);

  useEffect(() => {
    if (passedProps === "1") {
      setShowOrders(false);
      History.push("/dashboard/planningdashboard/planninglots");
    }
  }, [passedProps]);

  function getPlanningOrders() {
    Axios.get(Config.getCommonUrl() + `api/ProductionOrder/orders/listing`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setPlanningOrdersList(response.data.data);
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
          api: `api/ProductionOrder/orders/listing`,
        });
      });
  }

  useEffect(() => {
    getPlanningOrders();
  }, []);

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container table-width-mt">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            <Grid
              container
              alignItems="center"
              style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
            >
              <Grid item xs={9} sm={9} md={8} key="1">
                <FuseAnimate delay={300}>
                  <div>
                    <Typography className="pt-16 text-18 font-700 mb-8">
                      Planning
                    </Typography>

                    <Button
                      style={{
                        width: "100px",
                        marginRight: "10px",
                        backgroundColor: "#415bd4",
                      }}
                      variant="contained"
                      color="primary"
                      aria-label="Register"
                      onClick={() => handleButtonClick(true)}
                    >
                      Orders
                    </Button>
                    <Button
                      style={{ width: "100px", backgroundColor: "#415bd4" }}
                      variant="contained"
                      color="primary"
                      aria-label="Register"
                      onClick={() => handleButtonClick(false)}
                    >
                      Lots
                    </Button>

                  </div>
                </FuseAnimate>
              </Grid>
            </Grid>

            {/* <Grid
              container
              alignItems="center"
              style={{ marginBottom: 16, marginTop: 16, paddingInline: 16 }}
            >
              <Grid item xs={12} key="1">
                <AppBar position="static" style={{ width: "max-content" }}>
                  <Tabs
                    value={tabView}
                    onChange={handleButtonClick}
                    variant="scrollable"
                  >
                    <Tab style={{color:"#000000"}} value={0} label="Orders" />
                    <Tab style={{color:"#000000"}} value={1} label="Lots" />
                  </Tabs>
                </AppBar>

              </Grid>
            </Grid> */}


            <div className="main-div-alll">
              {showOrders ? (
                <PlanningOrders
                // planningOrdersData={planningOrdersList}
                />
              ) : (
                <PlanningLots />
              )}
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default PlanningDashboard;

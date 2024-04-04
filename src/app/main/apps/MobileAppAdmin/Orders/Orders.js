import React, { useState, useEffect } from "react";
import { Typography, Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CustomerOrder from "./SubView/CustomerOrder";
import BulkOrder from "./SubView/BulkOrder";
import DistributorOrder from "./SubView/DistributorOrder";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import History from "@history";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
  },
}));

const Orders = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [modalView, setModalView] = useState(0);
  const [buttonArr, setButtonArr] = useState([]);

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  useEffect(() => {
    if (props.location.state) {
      setModalView(props.location.state.mainTab);
    }
  }, [props.location.state]);

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    Statuslist();
    //eslint-disable-next-line
  }, []);

  function Statuslist() {
    axios
      .get(Config.getCommonUrl() + "api/mobileOrderStatusLogs/statusDropDown")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);

          const key = Object.values(response.data.data);
          const values = Object.keys(response.data.data);
          let temp = [{ value: 0, label: "All Order" }];
          for (let i = 0; i < values.length; i++) {
            temp.push({
              value: values[i],
              label: key[i],
            });
          }
          setButtonArr(temp);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/mobileOrderStatusLogs/statusDropDown",
        });
      });
  }

  const handleChangeTab = (event, value) => {
    setModalView(value);
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={7} sm={7} md={7} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Orders
                    {/* {isView ? "View Sales Invoice (Jobwork)" : "Add Sales Invoice (Jobwork)"} */}
                  </Typography>
                </FuseAnimate>
                {/* {!isView && <BreadcrumbsHelper />} */}
                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={5}
                sm={5}
                md={5}
                key="2"
                style={{ textAlign: "right" }}
              >
                <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={() =>
                    History.push("/dashboard/mobappadmin/orders/addorder")
                  }
                >
                  Add New Order
                </Button>
              </Grid>
            </Grid>
            <div
              className="pb-32 pt-16   salesdomestic-work-pt"
              // style={{ marginBottom: "10%" }}
            >
              <Grid container spacing={3}></Grid>

              {/* <Grid className="salesjobwork-table-main addsalesinvoice-blg"> */}
              {/* <Grid className=""> */}
              <div className={classes.root}>
                <Typography
                  className="pl-28 mb-5 text-18 font-700"
                  position="static"
                >
                  <Tabs value={modalView} onChange={handleChangeTab}>
                    <Tab label="Customer Order" />
                    <Tab label="Bulk Order" />
                    <Tab label="Distributor Order" />
                  </Tabs>
                </Typography>
                <div className="main-div-alll">
                  {modalView === 0 && buttonArr.length > 0 ? (
                    <CustomerOrder props={props} Statuslist={buttonArr} />
                  ) : (
                    ""
                  )}
                  {modalView === 1 && buttonArr.length > 0 ? (
                    <BulkOrder props={props} Statuslist={buttonArr} />
                  ) : (
                    ""
                  )}
                  {modalView === 2 && <DistributorOrder props={props} />}
                </div>
                {/* </Grid> */}
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default Orders;

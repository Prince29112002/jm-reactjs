import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import clsx from "clsx";
import { Typography, Button } from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import SalesmanInformation from "./SubView/SalesmanInformation";
import Device from "./SubView/Device";
import Screenshorts from "./SubView/Screenshorts";
import History from "@history";
import { useDispatch } from "react-redux";

import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
}));

const AddSalesmanMob = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  // const [productData, setProductData] = useState([]); //category wise Data
  const childRef = useRef();

  const [modalView, setModalView] = useState(0);

  const handleChangeTab = (event, value) => {
    setModalView(value);
  };

  const idToBeEdited = props.location.state;

  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [userID, setUserID] = useState("");

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (idToBeEdited !== undefined) {
      setIsViewOnly(idToBeEdited.isViewOnly);
      setUserID(idToBeEdited.row.id);
      setIsEdit(idToBeEdited.isEdit);
 
    }
   
  }, []);

 

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={6} sm={5} md={5} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                <Typography className="p-16 pb-8 text-18 pl-32 font-700">
                    <Tabs value={modalView} onChange={handleChangeTab}>
                      <Tab label="Salesman Information" />
                    </Tabs>{" "}
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid item xs={6} sm={7} md={7} key="2">
                <div className="btn-back mt-8">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    className=""
                    size="small"
                    onClick={(event) => {
                      // History.push("/dashboard/masters/clients");
                      History.goBack();
                      //   setDefaultView(btndata.id);
                      //   setIsEdit(false);
                    }}
                  >
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>

            {/* {loading && <Loader />} */}
            <div className="main-div-alll">

            <div className=" salesdomestic-work-pt">
              <Grid className="">
                <div className={classes.root}>
                  {modalView === 0 && (
                    <SalesmanInformation
                      isViewOnly={isViewOnly}
                      userID={userID}
                      ref={childRef}
                      isEdit={isEdit}
                    />
                  )}
                  {modalView === 1 && <Device />}
                  {modalView === 2 && <Screenshorts />}
                </div>
              </Grid>
            </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddSalesmanMob;

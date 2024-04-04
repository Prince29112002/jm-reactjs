import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import clsx from "clsx";
import { Typography, Button } from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import UserInformation from "./SubView/UserInformation";
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

const AddUser = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  // const [productData, setProductData] = useState([]); //category wise Data
  const childRef = useRef();
  const parth = props.location.pathname

  const [modalView, setModalView] = useState(0);

  const handleChangeTab = (event, value) => {
      setModalView(value);
  };

  const propsData = props.location.state;

  const [isViewOnly, setIsViewOnly] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [userID, setUserID] = useState("")

  useEffect(() => {
      return () => {
          console.log("cleaned up");
      };
  }, []);

  useEffect(() => {
      NavbarSetting('Mobile-app Admin', dispatch)
      //eslint-disable-next-line
  }, [])

  useEffect(() => {
      console.log("propsData", propsData);
      if (propsData !== undefined) {
          setIsViewOnly(propsData.isViewOnly);
          setUserID(propsData.row)
          setIsEdit(propsData.isEdit)
          // GetOneRetailer();
          // getRateProfileData();
      }
      //eslint-disable-next-line
  }, []);

  // function checkDetails(){
  //     console.log(childRef.current.checkValidation())
  //     console.log(childRef.current.getData())
  // }

 
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
              <Grid item xs={7} sm={7} md={7} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="p-16 pb-8 text-18 pl-32 font-700">
                    <Tabs value={modalView} onChange={handleChangeTab}>
                      <Tab label="User Information" />
                    </Tabs>
                  </Typography>
                </FuseAnimate>
              </Grid>

              <Grid
                item
                xs={5}
                sm={5}
                md={5}
                key="2"
                style={{ textAlign: "right" }}
              >
                <div className="btn-back mt-10">
                  <Button
                    id="btn-back"
                    size="small"
                    onClick={(event) => {
                      History.goBack();
                    }}
                  >
                      <img
                          className="back_arrow"
                          src={Icones.arrow_left_pagination}
                          alt=""/>
                  
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>

            {/* {loading && <Loader />} */}

            <div
              className="salesdomestic-work-pt"
              style={{ marginBottom: "10%" }}
            >
              <Grid className="">
                <div className={classes.root}>
                  {modalView === 0 && (
                    <UserInformation
                      isViewOnly={isViewOnly}
                      userID={userID}
                      ref={childRef}
                      isEdit={isEdit}
                      page={propsData.page} 
                      search={propsData.search}
                      apiData={propsData.apiData}
                      count={propsData.count} 
                    />
                  )}
                  {modalView === 1 && <Device />}
                  {modalView === 2 && <Screenshorts />}
                </div>

                {/* <Button
                                    variant="contained"
                                    color="primary"
                                    className=" mx-auto mt-16"
                                    aria-label="Register"
                                    //   disabled={!isFormValid()}
                                    // type="submit"
                                    onClick={(e) => {
                                        // handleFormSubmit(e);
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="ml-16 mx-auto mt-16"
                                    aria-label="Register"
                                    // disabled={isView}
                                    // type="submit"
                                    onClick={() => checkDetails()}
                                // onClick={(e) => {
                                //     // handleFormSubmit(e);
                                // }}
                                >
                                    Create Company
                                </Button> */}
              </Grid>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddUser;

import React, { useState, useEffect } from "react";
import { IconButton, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import Loader from "../../../Loader/Loader";
import SliderImgComponent from "./Components/SliderImgComponent";
import BannerImgComponent from "./Components/BannerImgComponent";
import SplashComponent from "./Components/SplashComponent";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ViewPopup from "./Components/ViewPopup";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
}));

const Branding = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [splashData, setSplashData] = useState([]);

  const [sliderData, setSliderData] = useState([]);

  const [bannerData, setBannerData] = useState([]);

  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [selectedFlagDelete, setSeletedFlagDelete] = useState("");

  const [open, setOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalFlag, setModalFlag] = useState(0);
  const [modalData, setModalData] = useState("");

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    getSplashScreens();
    getSliderData();
    getBannerData();
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  function getSplashScreens() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/splashScreen")
      .then(function (response) {
        setLoading(false);

        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;

          setSplashData(tempData);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "api/splashScreen" });
      });
  }

  function getSliderData() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/sliderImages")
      .then(function (response) {
        setLoading(false);

        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;

          setSliderData(tempData);
          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "api/sliderImages" });
      });
  }

  function getBannerData() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/brandBannerImages")
      .then(function (response) {
        setLoading(false);

        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          setBannerData(tempData);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "api/brandBannerImages" });
      });
  }

  function deleteHandler(id, flag) {
    setSelectedIdForDelete(id);
    setSeletedFlagDelete(flag);
    setOpen(true);
  }

  function viewHandler(data, flag) {
    setShowModal(true);
    setModalFlag(flag);
    setModalData(data);
  }

  function handleModClose() {
    setShowModal(false);
    setModalFlag("");
    setModalData("");
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setSeletedFlagDelete("");
    setOpen(false);
  }

  console.log(selectedFlagDelete);
  console.log(selectedIdForDelete);
  function callDeleteApi() {
    let url = "";
    if (selectedFlagDelete === 1) {
      url = "api/splashScreen/" + selectedIdForDelete;
    } else if (selectedFlagDelete === 2) {
      url = "api/sliderImages/" + selectedIdForDelete;
    } else if (selectedFlagDelete === 3) {
      url = "api/brandBannerImages/" + selectedIdForDelete;
    }

    setLoading(true);

    axios
      .delete(Config.getCommonUrl() + url)
      .then(function (response) {
        console.log(response);
        setOpen(false);
        setLoading(false);
        if (response.data.success === true) {
          handleClose();
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          getSplashScreens();
          getSliderData();
          getBannerData();
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch((error) => {
        setOpen(false);
        setLoading(false);
        handleError(error, dispatch, { api: url });
      });
  }


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
              <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pt-16 text-18 font-700 pl-40">
                    Branding
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              ></Grid>
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll">
              <div className="add-client-row" style={{ paddingTop: "10px" }}>
                <Grid
                  className="department-main-dv"
                  container
                  spacing={4}
                  alignItems="stretch"
                  style={{ marginLeft: "1px" }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    key="1"
                    style={{ padding: 0 }}
                  >
                    <Typography className="p-16 pb-8 text-16 font-700">
                      Splash Screen
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    key="2"
                    style={{ textAlign: "right" }}
                  >
                    <Link
                      to={{
                        pathname: "/dashboard/mobappadmin/updatebrandings",
                        state: { flag: 1, isEdit: false, row: "" },
                      }}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Button
                        id="btn-save"
                        variant="contained"
                        // className={classes.button}
                        size="small"
                        onClick={(event) => {
                          //   setDefaultView(btndata.id);
                          //   setIsEdit(false);
                        }}
                      >
                        Add New
                      </Button>
                    </Link>
                  </Grid>
                </Grid>

                {/* <div>Splash Screen</div> */}
                <Grid
                  className="department-main-dv"
                  container
                  spacing={4}
                  // alignItems="stretch"
                  alignItems="flex-start"
                  style={{
                    // paddingInline: 16,
                    // justifyContent: "space-between",
                    gap:"20px",
                    marginLeft: "7px",
                    marginBottom: "1px",
                    paddingBottom: "25px",
                  }}
                >
                  {splashData.map((row, index) => (
                    <SplashComponent
                      key={index}
                      row={row}
                      deleteHandler={deleteHandler}
                      viewHandler={viewHandler}
                    />
                  ))}
                </Grid>
              </div>

              <div className="add-client-row" style={{ paddingTop: "35px" }}>
                <Grid
                  className="department-main-dv"
                  container
                  spacing={4}
                  alignItems="stretch"
                  style={{ marginLeft: "1px" }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    key="1"
                    style={{ padding: 0 }}
                  >
                    <Typography className="p-16 pb-8 text-18 font-700">
                      Slider Images
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    key="2"
                    style={{ textAlign: "right" }}
                  >
                    <Link
                      to={{
                        pathname: "/dashboard/mobappadmin/updatebrandings",
                        state: { flag: 2, isEdit: false, row: "" },
                      }}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Button
                        id="btn-save"
                        variant="contained"
                        // className={classes.button}
                        size="small"
                        onClick={(event) => {
                          //   setDefaultView(btndata.id);
                          //   setIsEdit(false);
                        }}
                      >
                        Add New
                      </Button>
                    </Link>
                  </Grid>
                </Grid>

                <Grid
                  className="department-main-dv"
                  container
                  spacing={4}
                  // alignItems="stretch"
                  alignItems="flex-start"
                  style={{
                    display: "flex",
                    // justifyContent: "space-between",
                    gap:"20px",
                    marginLeft: "7px",
                    marginBottom: "1px",
                    paddingBottom: "25px",
                  }}
                >
                  {sliderData.map((row, index) => (
                    <SliderImgComponent
                      num={index + 1}
                      key={index}
                      row={row}
                      className={index > 0 ? "ml-128" : ""}
                      deleteHandler={deleteHandler}
                      viewHandler={viewHandler}
                    />
                  ))}
                </Grid>
              </div>

              <div className="add-client-row" style={{ paddingTop: "35px" }}>
                <Grid
                  className="department-main-dv"
                  container
                  spacing={4}
                  alignItems="stretch"
                  style={{ marginLeft: "1px" }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    key="1"
                    style={{ padding: 0 }}
                  >
                    <Typography className="p-16 pb-8 text-18 font-700">
                      Brand Banners
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    key="2"
                    style={{ textAlign: "right" }}
                  >
                    <Link
                      to={{
                        pathname: "/dashboard/mobappadmin/updatebrandings",
                        state: { flag: 3, isEdit: false, row: "" },
                      }}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Button
                        id="btn-save"
                        variant="contained"
                        // className={classes.button}
                        size="small"
                        onClick={(event) => {
                          //   setDefaultView(btndata.id);
                          //   setIsEdit(false);
                        }}
                      >
                        Add New
                      </Button>
                    </Link>
                  </Grid>
                </Grid>

                <Grid
                  className="department-main-dv"
                  container
                  spacing={4}
                  // alignItems="stretch"
                  alignItems="flex-start"
                  style={{
                    display: "flex",
                    // justifyContent: "space-between",
                    gap:"20px",
                    marginLeft: "7px",
                    marginBottom: "1px",
                    paddingBottom: "35px",
                  }}
                >
                  {bannerData.map((row, index) => (
                    <BannerImgComponent
                      num={index + 1}
                      key={index}
                      row={row}
                      className={index > 0 ? "ml-128" : ""}
                      deleteHandler={deleteHandler}
                      viewHandler={viewHandler}
                    />
                  ))}
                </Grid>
              </div>

              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title" className="popup-delete">
                  {"Alert!!!"}
                  <IconButton
                    style={{
                      position: "absolute",
                      marginTop: "-5px",
                      right: "15px",
                    }}
                    onClick={handleClose}
                  >
                    <img
                      src={Icones.cross}
                      className="delete-dialog-box-image-size"
                      alt=""
                    />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete ?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleClose}
                    className="delete-dialog-box-cancle-button"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={callDeleteApi}
                    className="delete-dialog-box-delete-button"
                  >
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>

              {showModal && (
                <ViewPopup
                  modalFlag={modalFlag}
                  modalData={modalData}
                  modalColsed={handleModClose}
                  // deleteHandler={deleteHandler}
                />
              )}
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default Branding;

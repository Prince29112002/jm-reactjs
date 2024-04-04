import React, { useState, useEffect } from "react";
import { Box, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import History from "@history";
import Loader from "app/main/Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import TypeThreeComp from "../Components/TypeThreeComp";
// import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import Icones from 'assets/fornt-icons/Mainicons';

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
  },
  tableRowPad: {
    padding: 7,
  },
}));

const ProductionOrderDetails = (props) => {
  let propsData = props.location.state;

  const [orderType, setOrderType] = useState("");
  const [apiData, setApiData] = useState([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [subTab, setSubTab] = useState("");
  const [mainTab, setMainTab] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  useEffect(() => {
    NavbarSetting("Planing", dispatch);
  }, []);

  useEffect(() => {
    if (props.location.state) {
      setMainTab(props.location.state.mainTab);
      setSubTab(props.location.state.subTab);
    }
  }, [props]);

  useEffect(() => {
    if (propsData !== undefined) {
      setIsEdit(propsData.isEdit);
      setIsView(propsData.isView);
      getOrderDetails(propsData.id);
      setOrderType(propsData.order_type);
    }
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  function getOrderDetails(id) {
    console.log(id);
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() + "api/ProductionOrder/orders/listing/one/" + id
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          setApiData(tempData);

          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/ProductionOrder/orders/listing/one/" + id,
        });
      });
  }

  
  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            <Grid container alignItems="center" style={{ paddingRight: 11 }}>
              <Grid item xs={7} sm={7} md={7} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="p-16 pb-8 text-18 font-700">
                    Order
                  </Typography>
                </FuseAnimate>
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
                  id="btn-back"
                  className={classes.button}
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
              </Grid>
            </Grid>
            {/* <div className="main-div-alll"
             style={{ marginTop: "20px" }}> */}

            {loading && <Loader />}
            <div className="main-div-alll ">
              <Grid
                container
                spacing={2}
                alignItems="flex-end"
                style={{ paddingInline: "30", width: "100%" }}
              >

            <Box style={{ marginTop: 30 }}>
              <div className="mx-16 mb-76">
                <TypeThreeComp
                  apiData={apiData}
                  callApi={getOrderDetails}
                  isEdit={isEdit}
                  isView={isView}
                />
              </div>
            </Box>
           
            </Grid>
           </div>

          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default ProductionOrderDetails;

import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import Collection from "./ProductSubViews/Collection/Collection";
import CAD from "./ProductSubViews/CAD/CAD";
import CAM from "./ProductSubViews/CAM/CAM";
import ChromePlating from "./ProductSubViews/ChromePlating/ChromePlating";
import Master from "./ProductSubViews/Master/Master";
import MoldCutting from "./ProductSubViews/MoldCutting/MoldCutting";
import SilverCasting from "./ProductSubViews/SilverCasting/SilverCasting";
import EngineerImage from "./ProductSubViews/EngineeredImage/EngineerImage";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  button1: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "transparent !important",
    color: "#242424",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#242424",
    borderBottom: " 2px solid #415BD4",
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  tableFooter: {
    padding: 7,
    backgroundColor: "#E3E3E3",
  },
  searchBox: {
    padding: 6,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
}));

const ProductDevelopment = ({ props }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [modalView , setModalView] = useState("")
  const roleOfUser = JSON.parse(localStorage.getItem('permission'));
  console.log(roleOfUser)
  const module = roleOfUser['Product Development'] 
  console.log(module)
  let key = Object.keys(module)

  useEffect(() => {
    if (props.location.state) {
      setModalView(props.location.state.sub);
    }
  }, []);

  const ButtonArr = [
    { id: 1, text: "Design Job" },
    { id: 2, text: "Cad Job" },
    { id: 3, text: "Cam Job" },
    { id: 4, text: "Master Finish" },
    { id: 5, text: "Silver Casting" },
    { id: 6, text: "Chrome Plating" },
    { id: 7, text: "Mold Cutting" },
    { id: 8, text: "Engineering Image and Data" },
  ];
  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            {/* <Grid className="department-main-dv create-account-main-dv"
                  container
                  spacing={4}
                  alignItems="stretch"
                  style={{ margin: 0 }}
                  >
                  </Grid> */}
            <Grid
              className="packing-fullwidth-title pb-20"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={4} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Product Development
                  </Typography>
                </FuseAnimate>
              </Grid>

              <Grid item xs={4} sm={4} md={9} key="2"></Grid>
            </Grid>
            {/* <div className="main-div-alll"> */}
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              key="1"
              style={{ padding: 0, marginLeft: "10px" }}
            >
              {ButtonArr.map((btndata, idx) => {
                      if(key.includes(btndata.text)){
                        return (
                    <Button
                      // variant="contained"
                      className={
                        btndata.id === modalView
                          ? "btn-design m-5 "
                          : " btn-design-hover m-5"
                      }
                      size="small"
                      key={idx}
                      onClick={(event) => setModalView(btndata.id)}
                    >
                      {btndata.text}
                    </Button>
                  );
                }
              })}
            </Grid>
            <Grid
              className="title-search-input"
              item
              xs={12}
              sm={4}
              md={9}
              key="2"
              style={{ textAlign: "right" }}
            >
              {/* <label style={{ display: "contents" }}> Search  :   </label>
                    <input id="input-ml" type="search" className={classes.searchBox}  onChange={(event) => setSearchData(event.target.value)} /> */}
            </Grid>

            {modalView === 1 && <Collection props={props} />}
            {modalView === 2 && <CAD props={props} />}
            {modalView === 3 && <CAM props={props} />}
            {modalView === 4 && <Master props={props} />}
            {modalView === 5 && <SilverCasting props={props} />}
            {modalView === 6 && <ChromePlating props={props} />}
            {modalView === 7 && <MoldCutting props={props} />}
            {modalView === 8 && <EngineerImage props={props} />}
          </div>
          {/* </div> */}
        </div>
      </FuseAnimate>
    </div>
  );
};

export default ProductDevelopment;

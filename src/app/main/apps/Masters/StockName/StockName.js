import React, { useState, useEffect } from "react";
import { Tab, Tabs, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import StockNameView from "./SubViews/StockNameView";
import StoneSize from "./SubViews/StoneSize";
import StoneShape from "./SubViews/StoneShape";
import StoneColor from "./SubViews/StoneColor";
import GoldColor from "./SubViews/GoldColor";
import CreateStockCode from "./SubViews/CreateStockCode";
import AddNewStock from "./SubViews/AddNewStock";
import EditStockCode from "./SubViews/EditStockCode";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import StockNameDesc from "./SubViews/StockNameDesc";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import { useDispatch } from "react-redux";
import Unit from "./SubViews/Unit";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
    padding: "10px",
    lineHeight: 1,
  },
  tab: {
    padding: 0,
    minWidth: "auto",
    marginRight: 30,
    textTransform: "capitalize",
  },
}));

const StockName = (props) => {
  const [defaultView, setDefaultView] = useState(0);
  const [dataToBeEdited, setDataToBeEdited] = useState("");
  const [searchData, setSearchData] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const handleClose = () => {
    setDefaultView(0);
    setDataToBeEdited("");
  };

  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);

  const classes = useStyles();

  const ButtonArr = [
    { id: 7, text: "Add Stock Code" },
    { id: 8, text: "Add New Stock" },
  ];

  // const BtnArr = [
  //   { id: "1", text: "Stock" },
  //   { id: "2", text: "Stone Size" },
  //   { id: "3", text: "Stone Shape" },
  //   { id: "4", text: "Stone Color" },
  //   { id: "5", text: "Gold Color" },
  //   { id: "6", text: "Unit" },
  //   { id: "7", text: "Stock Name Description" },
  // ];
  function EditHandler(data, searchData) {
    setSearchData(searchData);
    //if not added stock code yet then dont let them update
    if (data.stock_name_code !== null) {
      if (
        data.stock_name_code.stock_code !== null &&
        data.stock_name_code.stock_description !== null
      ) {
        setDataToBeEdited(data);
        setDefaultView(9);
      } else {
        setOpen(true);
      }
    } else {
      setOpen(true);
    }
  }
  function handleDialogClose() {
    setDefaultView(3);
    setDataToBeEdited("");
    setOpen(false);
  }
  const handleChangeTab = (event, value) => {
    setDefaultView(value);
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div
            className="flex flex-1 flex-col min-w-0 stockname-main-dv stockname-main-blg"
            style={{ marginTop: "30px" }}
          >
            <Grid
              container
              alignItems="center"
              style={{ paddingInline: "30px" }}
            >
              <Grid item xs={5} sm={6} md={6} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="font-700 text-18">
                    Stock Name Master
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={7}
                sm={6}
                md={6}
                key="2"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  columnGap: "20px",
                }}
              >
                {ButtonArr.map((btndata, idx) => (
                  <Button
                    className={classes.button}
                    size="small"
                    key={idx}
                    onClick={(event) => setDefaultView(btndata.id)}
                  >
                    {btndata.text}
                  </Button>
                ))}
              </Grid>
            </Grid>
            <div className="main-div-alll" style={{ marginTop: "20px" , paddingTop: "10px"}}>
              <div>
                <Tabs
                  value={defaultView}
                  onChange={handleChangeTab}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab className={classes.tab} label="Stock" />
                  <Tab className={classes.tab} label="Stone Size" />
                  <Tab className={classes.tab} label="Stone Shape" />
                  <Tab className={classes.tab} label="Stone Color" />
                  <Tab className={classes.tab} label="Gold Color" />
                  <Tab className={classes.tab} label="Unit" />
                  <Tab className={classes.tab} label="Stock Name Description" />
                </Tabs>
                {/* {BtnArr.map((btndata, idx) => (
                <p
                  variant="contained"
                  className={`${
                    btndata.id === defaultView
                      ? "btn-hover stock-mater-menu flex flex-row mr-16 ml-40"
                      : "btn stock-mater-menu flex flex-row mr-16 ml-40"
                  }`}
                  size="small"
                  key={idx}
                  onClick={(event) => setDefaultView(btndata.id)}
                >
                  {btndata.text}
                </p>
              ))} */}
              </div>
              {defaultView === 0 && (
                <StockNameView
                  dataTobeEdited={EditHandler}
                  search={searchData}
                />
              )}
              {defaultView === 1 && <StoneSize />}
              {defaultView === 2 && <StoneShape />}
              {defaultView === 3 && <StoneColor />}
              {defaultView === 4 && <GoldColor />}
              {defaultView === 5 && <Unit />}
              {defaultView === 6 && <StockNameDesc />}
              {defaultView === 7 && (
                <CreateStockCode modalColsed={handleClose} />
              )}
              {defaultView === 8 && <AddNewStock modalColsed={handleClose} />}

              {defaultView === 9 && (
                <EditStockCode
                  modalColsed={handleClose}
                  editData={dataToBeEdited}
                />
              )}
            </div>
          </div>

          <Dialog
            open={open}
            onClose={handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Alert!!!"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                First you Need to Add Stock Code Details!
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Dismiss
              </Button>
              {/* <Button
                onClick={callDeleteStockNameApi}
                color="primary"
                autoFocus
              >
                Delete
              </Button> */}
            </DialogActions>
          </Dialog>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default StockName;

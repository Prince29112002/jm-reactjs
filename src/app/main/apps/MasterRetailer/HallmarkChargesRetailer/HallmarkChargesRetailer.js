import React, { useState, useEffect } from "react";
import { Paper, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import MaUTable from "@material-ui/core/Table";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {},
  searchBox: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
    tableRowPad: {
    padding: 7,
  },
}));

const HallmarkChargesRetailer = (props) => {
  //   const theme = useTheme();

  const classes = useStyles();
  const dispatch = useDispatch();

  const [rateValue, setRateValue] = useState("");
  const [rateValueErr, setRateValueErr] = useState("");
  const [apiList, setApiList] = useState([]);
  const [HallMarkChargeDate, setHallMarkChargeDate] = useState("");

  useEffect(() => {
    getHallmarkCharges();
    getHallmarkChargesList();
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Master-Retailer", dispatch);
    //eslint-disable-next-line
  }, []);

  const inputRef = React.useRef();

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current.focus();
    }, 800);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  function getHallmarkCharges() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/goldRateToday/hallmarkcharges")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setRateValue(response.data.data.per_piece_charges);
        } else {
          dispatch(
            Actions.showMessage({
              message: "Today's Gold Rate is not set",
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "retailerProduct/api/goldRateToday/hallmarkcharges",
        });
      });
  }

  function getHallmarkChargesList() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/goldRateToday/oldhallmarkcharges")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiList(response.data.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: "No data",
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "retailerProduct/api/goldRateToday/oldhallmarkcharges",
        });
      });
  }

  function rateValueValidation() {
    // const Regex = /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/;
    if (!rateValue || isNaN(Number(rateValue))) {
      setRateValueErr("Enter rate");
      return false;
    }
    return true;
  }

  const checkforUpdate = (evt) => {
    evt.preventDefault();
    if (rateValueValidation()) {
      addHallmarkCharges();
    }
  };

  function addHallmarkCharges() {
    axios
      .post(Config.getCommonUrl() + "retailerProduct/api/goldRateToday/hallmarkcharges", {
        per_piece_charges: rateValue,
      })
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          getHallmarkChargesList()
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
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
          api: "retailerProduct/api/goldRateToday/hallmarkcharges",
          body: {
            per_piece_charges: rateValue,
          },
        });
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            <Grid
              container
              alignItems="center"
              style={{ paddingInline: 30, marginBottom: 20 }}
            >
              <Grid item xs={12} sm={6} md={4} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Hallmark Charges
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>
            <div className="main-div-alll ">
              <div>
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                >
                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <p style={{marginBottom: 0}}>Hallmark Charges Per Piece</p>
                      <TextField
                        placeholder="Enter Hallmark Charges Per Piece"
                        name="rateValue"
                        value={rateValue}
                        error={rateValueErr.length > 0 ? true : false}
                        helperText={rateValueErr}
                        onChange={(e) => {setRateValue(e.target.value); setRateValueErr("")}}
                        variant="outlined"
                        required
                        fullWidth
                        inputRef={inputRef}
                        autoFocus
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        id="btn-save"
                        variant="contained"
                        color="primary"
                        className="w-128 mx-auto"
                        onClick={(e) => checkforUpdate(e)}
                      >
                        Save
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </div>

             <div style={{ marginTop: "20px" }}>
                <Paper
                  className={clsx(
                    classes.tabroot,
                    "table-responsive createaccount-tbel-blg createaccount-tbel-dv"
                  )}
                >
                  <MaUTable className={clsx(classes.table,"Table_UI")}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Hallmark Charges
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        apiList.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell className={classes.tableRowPad}>
                        {moment.utc(row.date).local().format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {row.per_piece_charges}
                        </TableCell>
                      </TableRow>
                        ))
                      }
                    </TableBody>
                  </MaUTable>
                </Paper>
              </div> 
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default HallmarkChargesRetailer;

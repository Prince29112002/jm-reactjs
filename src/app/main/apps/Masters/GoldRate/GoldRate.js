import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
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
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Loader from "../../../Loader/Loader";
import moment from "moment";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";

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
  button: {
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
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
  filterbtn: {
    marginTop:'22px',
    display: 'flex',
    justifyContent: 'flex-start',

    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-end',
    },
  },
}));

const GoldRate = (props) => {
  //   const theme = useTheme();

  const classes = useStyles();
  const dispatch = useDispatch();

  const [rateValue, setRateValue] = useState("");
  const [rateValueErr, setRateValueErr] = useState("");

  const [percentage, setPercentage] = useState("");
  const [percentErr, setPercentErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [goldList, setGoldList] = useState([]);

  useEffect(() => {
    getTodaysGoldRate();
    getGoldRateList();
    //eslint-disable-next-line
  }, [dispatch]);

  const inputRef = React.useRef();

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current.focus();
    }, 800);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);

  function getGoldRateList() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/goldRateToday/old`)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setGoldList(response.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: `api/goldRateToday/old` });
      });
  }

  function getTodaysGoldRate() {
    axios
      .get(Config.getCommonUrl() + "api/goldRateToday")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // setLedgerMainData(response.data.data);
          setRateValue(response.data.data.rate);
          setPercentage(response.data.data.percentage);
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
        handleError(error, dispatch, { api: "api/goldRateToday" });
      });
  }

  function handleInputChange(event) {

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "rateValue") {
      setRateValue(value);
      setRateValueErr("");
    } else if (name === "percentage") {
      setPercentage(value);
      setPercentErr("");
    }
  }

  function rateValueValidation() {
    var Regex = /^(?!0+(?:\.0+)?$)(?:\d{1,6}(?:\.\d{1,2})?|\d{1,3}(?:,\d{3}){0,2}(?:\.\d{1,2})?)$/;
    if (!rateValue || Regex.test(rateValue) === false) {
      if(rateValue == ""){
        setRateValueErr("Enter rate");
      }else{
        setRateValueErr("Enter a valid number other than zero");
      }
      return false;
    }
    return true;
  }

  function percentageValidation() {
    let percentRegex = /^(0.[1-9]|1-9?|1(.\d+)?|2(.\d+)?|3(?!\d+(.\d+)?)|3(.0+)?)$/;
    if (!percentage || percentRegex.test(percentage) === false) {
      setPercentErr("Please enter a percentage between 0.1 and 3");
      return false;
    }
    return true;
  }

  const checkforUpdate = (evt) => {
    evt.preventDefault();
    if (rateValueValidation() && percentageValidation()) {
      CallAddNewRate();
    }
  };

  function CallAddNewRate() {
    axios
      .post(Config.getCommonUrl() + "api/goldRateToday", {
        rate: rateValue,
        percentage: percentage,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id
          // setRateValue("")
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          //   handleModalClose(true);
          getGoldRateList();
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
          api: "api/goldRateToday",
          body: {
            rate: rateValue,
            percentage: percentage,
          },
        });
      });
  }


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1" style={{marginTop: "30px"}}>
            <Grid
              container
              alignItems="center"
              style={{paddingInline: "30px"}}
            >
              <Grid item xs={4} sm={4} md={4} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Today's Gold Rate
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>
            <div className="main-div-alll" style={{marginTop: "20px"}}>
              <div className="">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} md={4} lg={3}>
                    <p style={{marginBottom: "5px"}}>Today's Rate*</p>{" "}
                    <TextField
                      className=""
                      // label="Today's Rate"
                      name="rateValue"
                      value={rateValue}
                      error={rateValueErr.length > 0 ? true : false}
                      helperText={rateValueErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      inputRef={inputRef}
                      autoFocus
                      placeholder="Enter Today's Rate*"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={3}>
                    {" "}
                    <p style={{marginBottom: "5px"}}>Percentage*</p>{" "}
                    <TextField
                      // label="percentage"
                      name="percentage"
                      value={percentage}
                      error={percentErr.length > 0 ? true : false}
                      helperText={percentErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      placeholder="Enter percentage*"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={3} className={classes.filterbtn}>
                    <Button
                      variant="contained"
                      color="primary"
                      id="btn-save"
                      onClick={(e) => checkforUpdate(e)}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </div>
              {loading && <Loader />}

              <div style={{ marginTop: "30px" }}>
                <Paper
                  className={clsx(
                    classes.tabroot,
                    "table-responsive createaccount-tbel-blg createaccount-tbel-dv"
                  )}
                >
                  <MaUTable className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Rate
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Percentage
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad}>Sub Group</TableCell>
                          <TableCell className={classes.tableRowPad}>Main Group</TableCell> */}
                        {/* <TableCell className={classes.tableRowPad}>Action</TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {goldList.length > 0 &&
                        goldList.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className={classes.tableRowPad}>
                              {moment
                                .utc(row.date)
                                .local()
                                .format("DD-MM-YYYY")}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                               {Config.numWithComma(row.rate)}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row.percentage}
                            </TableCell>
                            {/* <TableCell className={classes.tableRowPad}>
                            {row.main_group_name}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {row.sub_group_name}
                          </TableCell> */}
                            {/* <TableCell className={classes.tableRowPad}>
                          <IconButton
                          style={{ padding: "0" }}
                          onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                             editHandler(row);
                          }}
                        >
                          <Icon
                            className="mr-8"
                            style={{ color: "dodgerblue" }}
                          >
                            edit
                          </Icon>
                        </IconButton>
                        <IconButton
                            style={{ padding: "0" }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              ev.stopPropagation();
                             deleteHandler(row);
                            }}
                          >
                            <Icon className="mr-8" style={{ color: "red" }}>
                              delete
                            </Icon>
                          </IconButton>
                          </TableCell> */}
                          </TableRow>
                        ))}
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

export default GoldRate;

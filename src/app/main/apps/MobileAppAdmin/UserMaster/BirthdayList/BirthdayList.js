import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Link } from "react-router-dom";
import History from "@history";
import Loader from "../../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import useSortableData from "../../../Stock/Components/useSortableData";
import { Autocomplete } from "@material-ui/lab";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100px",
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    // height: "100%",
    height: "100%",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  searchBox: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
  bolderName: {
    fontWeight: 700,
  },
}));

const BirthdayList = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [future, setFuture] = useState([]);
  const [current, setCurrent] = useState([]);
  const [past, setPast] = useState([]);

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    getUserBirthdayData();
    //eslint-disable-next-line
  }, [dispatch]);

  function getUserBirthdayData() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/usermaster/user/birthday")
      .then(function (response) {
        if (response.data.success === true) {
          let tempFuture = response.data.data?.response?.userFuture;
          let tempCurrent = response.data.data?.response?.userCurrent;
          let tempPast = response.data.data?.response?.userPast;
          setCurrent(tempCurrent);
          setFuture(tempFuture);
          setPast(tempPast);
          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "api/usermaster/user/birthday" });
      });
  }

  //   const { items, requestSort, sortConfig } = useSortableData(apiData);

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
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Birthday List
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
              >
                <div className="btn-back">
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

            {/* <div style={{ textAlign: "right" }} className="mr-16">
              <label style={{ display: "contents" }}> Search : </label>
              <Search
                className={classes.searchBox}
                onSearch={onSearchHandler}
              />
            </div> */}
            {loading && <Loader />}
            <div className="main-div-alll">
              <div className="department-tbl-mt-dv">
                {/* <Paper className={classes.tabroot} id="department-tbl-fix "> */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid item xs="auto">
                      <h3>Today:</h3>
                    </Grid>
                    <Grid item xs="auto">
                      <div className="table-responsive  ">
                        <Table className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                User Name
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Mobile No
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                User Type
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Company
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Date of Birth
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {current.map((row) => (
                              <TableRow key={row.id}>
                                <TableCell
                                  align="left"
                                  className={clsx(classes.tableRowPad)}
                                >
                                  {row.full_name}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* mobile_number */}
                                  {row.mobile_number}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* userType */}
                                  {row.type_name}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* Company */}
                                  {row.company_name}
                                </TableCell>

                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* date_of_birth */}
                                  {moment(row.date_of_birth).format(
                                    "DD-MM-YYYY"
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid item xs="auto">
                      <h3>Future:</h3>
                    </Grid>
                    <Grid item xs="auto">
                      <div className="table-responsive  ">
                        <Table className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                User Name
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Mobile No
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                User Type
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Company
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Date of Birth
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {future.map((row) => (
                              <TableRow key={row.id}>
                                <TableCell
                                  align="left"
                                  className={clsx(classes.tableRowPad)}
                                >
                                  {row.full_name}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* mobile_number */}
                                  {row.mobile_number}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* userType */}
                                  {row.type_name}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* Company */}
                                  {row.company_name}
                                </TableCell>

                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* date_of_birth */}
                                  {moment(row.date_of_birth).format(
                                    "DD-MM-YYYY"
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid item xs="auto">
                      <h3>Past:</h3>
                    </Grid>
                    <Grid item xs="auto">
                      <div className="table-responsive  ">
                        <Table className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                User Name
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Mobile No
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                User Type
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Company
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Date of Birth
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {past.map((row) => (
                              <TableRow key={row.id}>
                                <TableCell
                                  align="left"
                                  className={clsx(classes.tableRowPad)}
                                >
                                  {row.full_name}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* mobile_number */}
                                  {row.mobile_number}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* userType */}
                                  {row.type_name}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* Company */}
                                  {row.company_name}
                                </TableCell>

                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* date_of_birth */}
                                  {moment(row.date_of_birth).format(
                                    "DD-MM-YYYY"
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                {/* </Paper> */}
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default BirthdayList;

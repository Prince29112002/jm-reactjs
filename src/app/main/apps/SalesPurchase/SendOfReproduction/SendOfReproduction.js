import React, { useContext, useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import BreadcrumbsHelper from "../../../BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Icon, IconButton } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "app/main/Loader/Loader";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AppContext from "app/AppContext";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
  },
  button: {
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
  },
  filterBtn: {
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
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
  searchBox: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
  filterbtn: {
    marginTop:'22px',
    display: 'flex',
    justifyContent: 'flex-start',

    [theme.breakpoints.down('md')]: {
      justifyContent: 'flex-end',
    },
  },
}));

const SendOfReproduction = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);

  const [apiData, setApiData] = useState([]);
  const [fromDate, setFromDate] = useState(
    moment().subtract(1, "months").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteReasonErr, setDeleteReasonErr] = useState("");

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };
  const appContext = useContext(AppContext);
  const { selectedDepartment } = appContext;

  useEffect(() => {
    console.log(">>>>>>>>", selectedDepartment);
    if (selectedDepartment !== "") {
      setFilters();
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (props.reportView === "Report") {
      NavbarSetting("Factory Report", dispatch);
    } else if (props.reportView === "Account") {
      NavbarSetting("Accounts", dispatch);
    } else {
      NavbarSetting("Sales", dispatch);
    }
    //eslint-disable-next-line
  }, []);

  //   useEffect(() => {
  //     if (loading) {
  //       setTimeout(() => setLoading(false), 7000);
  //     }
  //   }, [loading]);
  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("YYYY-MM-DD"); //new Date();

    if (name === "fromDate") {
      setFromDate(value);
      // today.setHours(0,0,0,0);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      // console.log(today,dateVal,dateVal <= today, minDateVal < dateVal)
      if (dateVal <= today && minDateVal < dateVal) {
        setFromDtErr("");
      } else {
        setFromDtErr("Enter Valid Date");
      }
    } else if (name === "toDate") {
      setToDate(value);
      // today.setHours(0,0,0,0);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      // console.log(today,dateVal,dateVal <= today, minDateVal < dateVal)
      if (dateVal <= today && minDateVal < dateVal) {
        setToDtErr("");
      } else {
        setToDtErr("Enter Valid Date");
      }
    }
  }

  function fromDtValidation() {
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    if (!fromDate || dateRegex.test(fromDate) === false) {
      var today = moment().format("YYYY-MM-DD"); //new Date();
      // today.setHours(0,0,0,0);
      let dateVal = moment(fromDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      // console.log(today,dateVal,dateVal <= today, minDateVal < dateVal)
      if (dateVal <= today && minDateVal < dateVal) {
        return true;
      } else {
        setFromDtErr("Enter Valid Date!");
        return false;
      }
    }
    return true;
  }

  function toDtValidation() {
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    if (!toDate || dateRegex.test(toDate) === false) {
      var today = moment().format("YYYY-MM-DD"); //new Date();
      // today.setHours(0,0,0,0);
      let dateVal = moment(toDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      // console.log(today,dateVal,dateVal <= today, minDateVal < dateVal)
      if (dateVal <= today && minDateVal < dateVal) {
        return true;
      } else {
        setToDtErr("Enter Valid Date!");
        return false;
      }
    }
    return true;
  }
  function getSendOfReproduction(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              setApiData(response.data.data);
            } else {
              setApiData([]);
            }
          } else {
            setApiData([]);
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
        } else {
          setLoading(false);
          setApiData([]);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: url });
      });
  }
  function setFilters() {
    //check if single date added
    // if (fromDate === "" && toDate === "" && selectedVendor === "") {
    //   console.log("return");
    //   return;
    // }
    let url = "api/lotfrombarcode/reproduction/list/";

    if (
      moment(new Date(fromDate)).format("YYYY-MM-DD") >
      moment(new Date(toDate)).format("YYYY-MM-DD")
    ) {
      setToDtErr("Enter Valid Date!");
      return;
    }

    if (fromDate !== "" || toDate !== "") {
      if (fromDtValidation() && toDtValidation()) {
        // if (selectedVendor !== "") {
        //     url = url + "&start=" + fromDate + "&end=" + toDate;
        // } else {
        url =
          url +
          `${selectedDepartment.value.split("-")[1]}` +
          "?startDate=" +
          fromDate +
          "&endDate=" +
          toDate;

        // }
      } else {
        console.log("Date return");
        return;
      }
    }
    getSendOfReproduction(url);
  }
  function resetFilters() {
    // setSelectedVendor("");
    setFromDate("");
    setFromDtErr("");
    setToDate("");
    setToDtErr("");
    // setSelectedCompany("");
    // setClient(false);
    // call api without filter
    getSendOfReproduction(
      `api/lotfrombarcode/reproduction/list/${
        selectedDepartment.value.split("-")[1]
      }`
    );
  }
  function viewHandler(data) {
    console.log("viewHandler", data);
    props.history.push(
      "/dashboard/sales/sendofreproduction/viewsendofreproduction",
      {
        data: data,
      }
    );
  }

  // function deleteHandler(id) {
  //   console.log("deleteHandler", id);
  //   setSelectedIdForDelete(id);
  //   setOpen(true);
  // }
  // function handleClose() {
  //   setSelectedIdForDelete("");
  //   setOpen(false);
  //   setDeleteReason("")
  //   setDeleteReasonErr("")
  // }


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1" style={{marginTop: "30px"}}>
               <Grid container alignItems="center" style={{paddingInline: "30px" }} >
              <Grid item xs={8} sm={8} md={8} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Send Of Reproduction
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>
              <Grid
                item
                xs={4}
                sm={4}
                md={4}
                key="2"
                style={{ textAlign: "right", }}
              >
                <Link
                  to="/dashboard/sales/sendofreproduction/addsendofreproduction"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button
                    variant="contained"
                    className={classes.button}
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

            {/* {loading && <Loader />} */}
            <div className="main-div-alll" style={{marginTop: "20px"}}>

            <Grid
              container
              spacing={2}
              alignItems="center"
              style={{ padding: 16 }}
            >
              <Grid item lg={3} md={4} sm={4} xs={12}>
              <p style={{ paddingBottom: "3px" }}>From date</p>

                <TextField
                  // label="From Date"
                  name="fromDate"
                    value={fromDate}
                    error={fromDtErr.length > 0 ? true : false}
                    helperText={fromDtErr}
                  type="date"
                    onChange={(e) => handleInputChange(e)}
                  // onKeyDown={(e => e.preventDefault())}
                  variant="outlined"
                  fullWidth
                  format="yyyy/MM/dd"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item lg={3} md={4} sm={4} xs={12}>
              <p style={{ paddingBottom: "3px" }}>To date</p>

                <TextField
                  // label="To Date"
                  name="toDate"
                    value={toDate}
                    error={toDtErr.length > 0 ? true : false}
                    helperText={toDtErr}
                  type="date"
                    onChange={(e) => handleInputChange(e)}  
                  // onKeyDown={(e => e.preventDefault())}
                  variant="outlined"
                  fullWidth
                  format="yyyy/MM/dd"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item lg={2} md={12} sm={12} xs={12} className={classes.filterbtn}>
                <Button
                  variant="contained"
                  className={clsx(classes.filterBtn)}
                  size="small"
                  onClick={(event) => {
                    setFilters();
                  }}
                >
                  filter
                </Button>

                <Button
                  variant="contained"
                  className={clsx(classes.filterBtn, "ml-16")}
                  size="small"
                  onClick={(event) => {
                    resetFilters();
                  }}
                >
                  reset
                </Button>
              </Grid>
            </Grid>

            <div className="mt-20 department-tbl-mt-dv repairedissue-table">
              <Paper
                className={clsx(
                  classes.tabroot,
                )}
              >
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad}>
                        Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Voucher Number
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Category Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Note
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left" width={100}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">No Data</TableCell>
                      </TableRow>
                    ) : (
                    apiData
                      .map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className={classes.tableRowPad}>
                            {moment
                              .utc(row.party_voucher_date)
                              .local()
                              .format("DD-MM-YYYY")}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {row.party_voucher_no}
                          </TableCell>

                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {row.ProductCategory?.category_name}
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            {row.note}
                          </TableCell>
                          <TableCell className={classes.tableRowPad} style={{textAlign: "left"}}>
                            {/* {
                              authAccessArr.includes('View Consumable Consumption') &&   */}
                              <IconButton
                              style={{ padding: "0" }}
                              onClick={(ev) => {
                                ev.preventDefault();
                                ev.stopPropagation();
                                viewHandler(row);
                              }}
                            >
                              <Icon
                                style={{ color: "dodgerblue" }}
                              >
                                visibility
                              </Icon>
                            </IconButton>
                            {/* } */}
                           
                            {/* {authAccessArr.includes('Delete Consumable Consumption') && moment().isSameOrBefore(
                              new Date(row.date_to_delete_before)
                            ) ? ( */}
                              {/* <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  deleteHandler(row.id);
                                }}
                              >
                                <Icon className="mr-8" style={{ color: "red" }}>
                                  delete
                                </Icon>
                              </IconButton> */}
                            {/* ) : null} */}
                          </TableCell>
                        </TableRow>
                      )))}
                  </TableBody>
                </Table>
              </Paper>
            </div>
</div>
            {/* <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Alert!!!"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this record ?
                </DialogContentText>
                <TextField
                      className="mt-16"
                      label="Deletion Reason"
                      name="deleteReason"
                      value={deleteReason}
                      error={deleteReasonErr.length > 0 ? true : false}
                      helperText={deleteReasonErr}
                      onChange={(e) => {setDeleteReason(e.target.value); setDeleteReasonErr("")}}
                      variant="outlined"
                      required
                      fullWidth
                      multiline
                      maxrows={4}
                      minRows={4}
                  />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button
                  // onClick={callDeleteConsumablePurchaseApi}
                  color="primary"
                  autoFocus
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog> */}
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default SendOfReproduction;

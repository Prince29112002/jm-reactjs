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
import Select, { createFilter } from "react-select";
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
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
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
    marginBlock: "3px",
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
}));

const StockArticianIssueMetal = (props) => {
  // const [searchData, setSearchData] = useState("");
  const [apiData, setApiData] = useState([]);
  const classes = useStyles();
  const dispatch = useDispatch();

  const theme = useTheme();

  const [loading, setLoading] = useState(true);

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const [jobworkerData, setJobworkerData] = useState([]);
  const [selectedJobWorker, setSelectedJobWorker] = useState("");

  const [fromDate, setFromDate] = useState(moment().subtract(1, 'months').format('YYYY-MM-DD'));
  const [fromDtErr, setFromDtErr] = useState("");

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");

  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [open, setOpen] = useState(false);

  const appContext = useContext(AppContext);
  const adminId = localStorage.getItem('userId')
  const [deleteReason, setDeleteReason] = useState("")
  const [deleteReasonErr, setDeleteReasonErr] = useState("")
  const { selectedDepartment } = appContext;

  // const roleOfUser = localStorage.getItem("permission")
  // ? JSON.parse(localStorage.getItem("permission"))
  // : null;
  // const [authAccessArr, setAuthAccessArr] = useState([]);

  // useEffect(() => {
  //   let arr = roleOfUser
  //       ? roleOfUser["Sales Purchase"]["Artician Issue Metal"]
  //         ? roleOfUser["Sales Purchase"]["Artician Issue Metal"]
  //         : []
  //       : [];
  //   const arrData = [];
  //   if (arr.length > 0) {
  //     arr.map((item) => {
  //       arrData.push(item.name);
  //     });
  //   }
  //   setAuthAccessArr(arrData);
  // }, []);

  useEffect(() => {
    console.log(">>>>>>>>", selectedDepartment)
    //eslint-disable-next-line
    if (selectedDepartment !== "") {
      setFilters()
    }
  }, [selectedDepartment]);

  useEffect(() => {
    // visible true -> false
    if (loading) {
      //setTimeout(() => setLoaded(true), 250); // 0.25초 뒤에 해제
      //debugger;
      setTimeout(() => setLoading(false), 7000); // 10초 뒤에
    }

    //setLoaded(loaded);
  }, [loading]);

  useEffect(() => {
    // console.log("useEffect");
    // getArticianIssueIR("api/jobworkarticianissue");
    getJobworkerdata();
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    if (props.reportView === "Report") {
      NavbarSetting('Report', dispatch)
    }else if (props.reportView === "Account"){
      NavbarSetting('Accounts', dispatch)
    }else {
      NavbarSetting('Sales', dispatch)
    }
    //eslint-disable-next-line
  }, [])

  function getJobworkerdata() {
    axios
      .get(Config.getCommonUrl() + "api/jobworker/listing/listing")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setJobworkerData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {api : "api/jobworker/listing/listing"})
      });
  }

  function getArticianIssueIR(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        setLoading(false);
        console.log(response);
        if (response.data.success === true) {
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              setApiData(response.data.data);
            } else {
              setApiData([]);
            }
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
            setApiData([]);
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setApiData([]);
        }
      })
      .catch(function (error) {
        // console.log(error);
        setLoading(false);

        handleError(error, dispatch, {api : url})
      });
  }

  function handlePartyChange(value) {
    console.log(value);
    setSelectedJobWorker(value);
  }

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

  function setFilters() {
    //check if single date added
    // if (fromDate === "" && toDate === "" && selectedJobWorker === "") {
    //   console.log("return");
    //   return;
    // }
    let url = "api/stockJVjobworkarticianissue/jv/?department_id=" + selectedDepartment.value.split("-")[1];

    if (selectedJobWorker !== "") {
      url = url + "&jobworker=" + selectedJobWorker.value;
    }

    if (moment(new Date(fromDate)).format("YYYY-MM-DD") > moment(new Date(toDate)).format("YYYY-MM-DD")) {
      setToDtErr("Enter Valid Date!");
      return;
    }

    if (fromDate !== "" || toDate !== "") {
      if (fromDtValidation() && toDtValidation()) {
        if (selectedJobWorker !== "") {
          url = url + "&start=" + fromDate + "&end=" + toDate;
        } else {
          url = url + "&start=" + fromDate + "&end=" + toDate;
        }
      } else {
        console.log("Date return");
        return;
      }
    }

    console.log(url);
    getArticianIssueIR(url);
  }

  function resetFilters() {
    setSelectedJobWorker("");
    setFromDate("");
    setFromDtErr("");
    setToDate("");
    setToDtErr("");
    // call api without filter
    getArticianIssueIR("api/stockJVjobworkarticianissue/jv/?department_id=" + selectedDepartment.value.split("-")[1]);
  }

  function deleteHandler(id) {
    console.log("deleteHandler", id);
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function viewHandler(id) {
    console.log("viewHandler", id);
    props.history.push("/dashboard/sales/stockarticianissuemetal/addstockarticianissuemetal", {
      id: id
    });
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
    setDeleteReason("")
    setDeleteReasonErr("")
  }

  const validateDelete = () => {
    if(deleteReason === ""){
      setDeleteReasonErr("Enter Valid delete reason");
      return false
    }
    return true;
  }

  function callDeleteJobWorkMetalRecApi() {
    if(validateDelete()){
      const body = {
        delete_remark : deleteReason,
        admin_id : adminId
      }  
      axios
      .post(
        Config.getCommonUrl() + "api/stockJVjobworkarticianissue/jv/" + selectedIdForDelete , body
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          resetFilters();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {api : "api/stockJVjobworkarticianissue/jv/" + selectedIdForDelete,body})
      });
      handleClose()
    }
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0" style={{ marginTop: "30px" }}>
            <Grid
              container
              alignItems="center"
              style={{ paddingInline: "30px" }}
            >
              <Grid item xs={12} sm={6} md={6} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                  Artician Issue Metal (Stock Journal Voucher)
                  </Typography>
                </FuseAnimate>
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
                  to="/dashboard/sales/stockarticianissuemetal/addstockarticianissuemetal"
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

            {/* <div style={{ textAlign: "right" }} className="mr-16">
              <label style={{ display: "contents" }}> Search : </label>
              <Search
                className={classes.searchBox}
                onSearch={onSearchHandler}
              />
            </div> */}
            {loading && <Loader />}
            <div className="main-div-alll" style={{ marginTop: "20px" }}>
            <Grid
              container
              spacing={2}
              alignItems="flex-end"
            >
              <Grid item lg={2} md={4} sm={4} xs={12}>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  classes={classes}
                  styles={selectStyles}
                  options={jobworkerData.map((suggestion) => ({
                    value: suggestion.id,
                    label: suggestion.name,
                  }))}
                  // components={components}
                  value={selectedJobWorker}
                  onChange={handlePartyChange}
                  placeholder="Jobworker Name"
                  autoFocus
                  blurInputOnSelect
                  tabSelectsValue={false}
                />
              </Grid>
              <Grid item lg={2} md={4} sm={4} xs={12}>
                <p style={{ paddingBottom: "3px" }}>From date</p>
                <TextField
                  name="fromDate"
                  value={fromDate}
                  error={fromDtErr.length > 0 ? true : false}
                  helperText={fromDtErr}
                  type="date"
                  // onKeyDown={(e => e.preventDefault())}
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  fullWidth
                  format="yyyy/MM/dd"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item lg={2} md={4} sm={4} xs={12}>
                <p style={{ paddingBottom: "5px" }}>To date</p>
                <TextField
                  name="toDate"
                  value={toDate}
                  error={toDtErr.length > 0 ? true : false}
                  helperText={toDtErr}
                  // onKeyDown={(e => e.preventDefault())}
                  type="date"
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  fullWidth
                  format="yyyy/MM/dd"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item lg={2} md={4} sm={4} xs={12}>
                <Button
                  variant="contained"
                  className={classes.filterBtn}
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

            <div className="mt-16 department-tbl-mt-dv">
              {/* <p>Some content or children or something.</p> */}
              <Paper className={clsx(classes.tabroot, "table-responsive articianissueIR-dv articianissueIR_tabel-dv")}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad} align="left">
                        Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Voucher Number
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Party Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Firm Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        Total Fine
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiData
                      // .filter(
                      //   (temp) =>
                      //     temp.code
                      //       .toLowerCase()
                      //       .includes(searchData.toLowerCase()) ||
                      //     temp.name
                      //       .toLowerCase()
                      //       .includes(searchData.toLowerCase()) ||
                      //     temp.client_contact_name
                      //       .toLowerCase()
                      //       .includes(searchData.toLowerCase()) ||
                      //     temp.client_contact_number
                      //       .toLowerCase()
                      //       .includes(searchData.toLowerCase()) ||
                      //     temp.client_contact_email
                      //       .toLowerCase()
                      //       .includes(searchData.toLowerCase()) ||
                      //     temp.address
                      //       .toLowerCase()
                      //       .includes(searchData.toLowerCase())
                      // )
                      .map((row) => (
                        <TableRow key={row.id}>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {moment.utc(row.purchase_voucher_create_date).local().format("DD-MM-YYYY")}

                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {row.voucher_no}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {row.StockJVJobWorker !== null && row.StockJVJobWorker.name}
                          </TableCell>

                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {row.StockJVJobWorker !== null && row.StockJVJobWorker.firm_name}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {parseFloat(row.totalFineGold).toFixed(3)}
                          </TableCell>

                          <TableCell className={classes.tableRowPad}>
                            <IconButton
                              style={{ padding: "0" }}
                              onClick={(ev) => {
                                ev.preventDefault();
                                ev.stopPropagation();
                                viewHandler(row.id);
                              }}
                            >
                              <Icon
                                className="mr-8"
                                style={{ color: "dodgerblue" }}
                              >
                                visibility
                              </Icon>
                            </IconButton>
                            {moment().isSameOrBefore(
                              new Date(row.date_to_delete_before)
                            ) ? (
                                <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    deleteHandler(row.id);
                                  }}
                                >
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "red" }}
                                  >
                                    delete
                                  </Icon>
                                </IconButton>
                              ) : null}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Paper>
            </div>

            <Dialog
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
                  onClick={callDeleteJobWorkMetalRecApi}
                  color="primary"
                  autoFocus
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default StockArticianIssueMetal;

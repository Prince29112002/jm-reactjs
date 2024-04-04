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
    margin: 5,
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
  filterbtn: {
    marginTop:'22px',
    display: 'flex',
    justifyContent: 'flex-start',

    [theme.breakpoints.down('md')]: {
      justifyContent: 'flex-end',
    },
  },
}));


const SalesConsumable = (props) => {
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

  const [vendorData, setVendorData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");

  const [selectDepartment, setSelectDepartment] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);

  const [fromDate, setFromDate] = useState(
    moment().subtract(1, "months").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");

  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const adminId = localStorage.getItem("userId");
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteReasonErr, setDeleteReasonErr] = useState("");

  const [open, setOpen] = useState(false);
  const [client, setClient] = useState(false);
  const [clientCompany, setClientCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyErr, setSelectedCompanyErr] = useState("");
  const appContext = useContext(AppContext);

  const { selectedDepartment } = appContext;

  useEffect(() => {
    console.log(">>>>>>>>", selectedDepartment);
    //eslint-disable-next-line
    if (selectedDepartment !== "") {
      setFilters();
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (props.reportView === "Report") {
      NavbarSetting('Factory Report', dispatch)
    }else if (props.reportView === "Account"){
      NavbarSetting('Accounts', dispatch)
    }else {
      NavbarSetting('Sales', dispatch)
    }
    //eslint-disable-next-line
  }, [])

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
    // getConsumablePurchases("api/consumablepurchase");
    getVendordata();
    getDepartmentListdata();
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    if (client && selectedVendor) {
      getClientCompany();
    }
  }, [selectedVendor]);

  function getClientCompany() {
    const cliId = selectedVendor.value.split("-")[0];
    console.log(cliId);
    axios
      .get(
        Config.getCommonUrl() + `api/client/company/listing/listing/${cliId}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setClientCompany(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/client/company/listing/listing/${cliId}`,
        });
      });
  }
  function getDepartmentListdata() {
    // setLoading(true)
    axios
      .get(Config.getCommonUrl() + "api/admin/getdepartmentlist")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setDepartmentList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          // setLoading(false)
        }
      })
      .catch((error) => {
        // setLoading(false)
        handleError(error, dispatch, { api: "api/admin/getdepartmentlist" });
      });
  }

  function getVendordata() {
    axios
      .get(Config.getCommonUrl() + "api/vendor/both/vendorandclient")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setVendorData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/vendor/both/vendorandclient",
        });
      });
  }

  function getConsumablePurchases(url) {
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

  function handlePartyChange(value) {
    setClient(false);
    setSelectedCompany("");
    setSelectedVendor(value);
    if (value.type === 2) {
      setClient(true);
    }
  }

  const handlePartyCompanyChange = (value) => {
    setSelectedCompany(value);
    setSelectedCompanyErr("");
  };

  const handleDepartmentChange = (value) => {
    setSelectDepartment(value);
  };

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
    // if (fromDate === "" && toDate === "" && selectedVendor === "") {
    //   console.log("return");
    //   return;
    // }
    let url = "api/salesofconsumable?";

    if (selectDepartment.length !== 0) {
      const departmentId = selectDepartment.value;
      url = url + "department_id=" + departmentId;
    }

    if (selectedVendor !== "") {
      if (client) {
        if (selectedCompany !== "") {
          var venClient = selectedCompany.value;
          var isVendor = 2;
        } else {
          setSelectedCompanyErr("Select Firm Name");
          return;
        }
      } else {
        var venClient = selectedVendor.value.split("-")[0];
        var isVendor = 1;
      }
      url = url + "&vendor=" + venClient + "&is_vendor_client=" + isVendor;
    }

    if (
      moment(new Date(fromDate)).format("YYYY-MM-DD") >
      moment(new Date(toDate)).format("YYYY-MM-DD")
    ) {
      setToDtErr("Enter Valid Date!");
      return;
    }

    if (fromDate !== "" || toDate !== "") {
      if (fromDtValidation() && toDtValidation()) {
        if (selectedVendor !== "") {
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
    getConsumablePurchases(url);
  }

  function resetFilters() {
    setSelectedVendor("");
    setFromDate("");
    setFromDtErr("");
    setToDate("");
    setToDtErr("");
    setSelectedCompany("");
    setSelectDepartment([]);
    setClient(false);
    // call api without filter
    getConsumablePurchases("api/salesofconsumable?");
  }

  function deleteHandler(id) {
    console.log("deleteHandler", id);
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function viewHandler(id) {
    console.log("viewHandler", id);
    props.history.push("/dashboard/sales/salesconsumable/addsalesconsumable", {
      id: id,
    });
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
    setDeleteReason("");
    setDeleteReasonErr("");
  }

  const validateDelete = () => {
    if (deleteReason === "") {
      setDeleteReasonErr("Enter Valid delete reason");
      return false;
    }
    return true;
  };

  function callDeleteConsumablePurchaseApi() {
    if (validateDelete()) {
      const body = {
        delete_remark: deleteReason,
        admin_id: adminId,
      };
      axios
        .post(
          Config.getCommonUrl() +
            "api/salesofconsumable/" +
            selectedIdForDelete,
          body
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
          handleError(error, dispatch, {
            api: "api/salesofconsumable/" + selectedIdForDelete,
            body,
          });
        });
      handleClose();
    }
  }


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1"style={{marginTop: "30px"}}>
            <Grid
              // className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{paddingInline: "30px" }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" >
                <FuseAnimate delay={300}>
                <Typography className="text-18 font-700">
                   Sales Consumable
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
              {
                // authAccessArr.includes('Add Sales of Consumable') &&
                 <Grid
                item
                xs={12}
                sm={4}
                md={9}
                key="2"
                style={{ textAlign: "right" }}
              >
                <Link
                  to="/dashboard/sales/salesconsumable/addsalesconsumable"
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
              }
              
            </Grid>

            {/* <div style={{ textAlign: "right" }} className="mr-16">
              <label style={{ display: "contents" }}> Search : </label>
              <Search
                className={classes.searchBox}
                onSearch={onSearchHandler}
              />
            </div> */}
            <div className="main-div-alll" style={{marginTop: "20px"}}>

            {loading && <Loader />}

            <Grid
              // className="department-main-dv p-16"
              container
              spacing={2}
              alignItems="stretch"
            >

              <Grid item lg={3} md={4} sm={4} xs={12}>
              <p style={{ paddingBottom: "3px" }}>Select Party</p>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  classes={classes}
                  styles={selectStyles}
                  options={vendorData.map((suggestion) => ({
                    value: suggestion.id +"-"+suggestion.type,
                    label: suggestion.name,
                    type : suggestion.type
                  }))}
                  // components={components}
                  value={selectedVendor}
                  onChange={handlePartyChange}
                  autoFocus
                  blurInputOnSelect
                  tabSelectsValue={false}
                  placeholder="Party Name"
                />
              </Grid>

              {
                client && <Grid item lg={3} md={4} sm={4} xs={12} style={{ padding: 6 }}>
              <p style={{ paddingBottom: "3px" }}>Select Firm Name</p>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  classes={classes}
                  styles={selectStyles}
                  options={clientCompany.map((suggestion) => ({
                    value: suggestion.id,
                    label: suggestion.company_name,
                  }))}
                  // components={components}
                  autoFocus
                  blurInputOnSelect
                  tabSelectsValue={false}
                  value={selectedCompany}
                  onChange={handlePartyCompanyChange}
                  placeholder="Firm Name"
                />
                 <span style={{ color: "red" }}>
                    {selectedCompanyErr.length > 0 ? selectedCompanyErr : ""}
                  </span>
              </Grid>
              }

          <Grid item lg={3} md={4} sm={4} xs={12} style={{ padding: 6 }}>
               <p style={{ paddingBottom: "3px" }}>Select Department Name</p>
               <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  classes={classes}
                  styles={selectStyles}
                  options={departmentList.map((suggestion) => ({
                    value: suggestion.id,
                    label: suggestion.name,
                  }))}
                  value={selectDepartment}
                  onChange={handleDepartmentChange}
                  autoFocus
                  blurInputOnSelect
                  tabSelectsValue={false}
                  placeholder="Department Name"
                />
              </Grid>

              <Grid item lg={3} md={4} sm={4} xs={12} style={{ padding: 6 }}>
              <p style={{ paddingBottom: "3px" }}>From Date</p>

                <TextField
                  // label="From Date"
                  name="fromDate"
                  value={fromDate}
                  error={fromDtErr.length > 0 ? true : false}
                  helperText={fromDtErr}
                  type="date"
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                 // onKeyDown={(e => e.preventDefault())}
                  fullWidth
                  format="yyyy/MM/dd"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 6 }}>
              <p style={{ paddingBottom: "3px" }}>To Date</p>

                <TextField
                  // label="To Date"
                  name="toDate"
                  value={toDate}
                  error={toDtErr.length > 0 ? true : false}
                  helperText={toDtErr}
                  type="date"
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  fullWidth
                 // onKeyDown={(e => e.preventDefault())}
                  format="yyyy/MM/dd"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item lg={2} md={4} sm={4} xs={12} className={classes.filterbtn}>
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

            <div className="mt-20 department-tbl-mt-dv repairedissue-table">
              {/* <p>Some content or children or something.</p> */}
              <Paper className={clsx(classes.tabroot, "new-add_stock_group_tbel table-responsive consumablepurchase-tabel consumablepurchase-tabel-dv")}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad}>
                        Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Department Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Voucher Number
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Party Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Firm Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Amount
                      </TableCell>

                      <TableCell className={classes.tableRowPad} align="left">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiData.length === 0 ? (
                      <>
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            colSpan={7}
                            style={{textAlign:"center"}}
                          >
                            No Data
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      apiData
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
                        {/* component="th" scope="row" */}
                        <TableCell className={classes.tableRowPad}>
                          {moment
                            .utc(row.purchase_voucher_create_date)
                            .local()
                            .format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {row.department.name}
                        </TableCell>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                        >
                          {row.voucher_no}
                        </TableCell>

                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                        >
                          {row.is_vendor_client === 1
                            ? row.Vendor.name
                            : row.ClientCompany.client.name}
                        </TableCell>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                        >
                          {row.is_vendor_client === 1
                            ? row.Vendor.firm_name
                            : row.ClientCompany.firm_name}
                        </TableCell>

                        <TableCell
                          className={classes.tableRowPad}
                          align="left"
                        >
                          {/* {parseFloat(row.total_invoice_amount).toFixed(3)} */}
                          {Config.numWithComma(row.total_invoice_amount)}
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
                          
                        </TableCell>
                      </TableRow>
                      ))
                      )}
                  </TableBody>
                </Table>
              </Paper>
            </div>
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
                  onClick={callDeleteConsumablePurchaseApi}
                  color="primary"
                  autoFocus
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default SalesConsumable;

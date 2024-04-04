import React, { useContext, useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import moment from "moment";
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
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

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
  filterbtn: {
    marginTop:'22px',
    display: 'flex',
    justifyContent: 'flex-start',

    [theme.breakpoints.down('md')]: {
      justifyContent: 'flex-end',
    },
  },
}));

const MetalPurchaseReturn = (props) => {
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
    //eslint-disable-next-line
    if (selectedDepartment !== "") {
      setFilters();
    }
  }, [selectedDepartment]);

  useEffect(() => {
    // visible true -> false
    if (loading) {
      setTimeout(() => setLoading(false), 7000); // 10초 뒤에
    }

    //setLoaded(loaded);
  }, [loading]);

  useEffect(() => {
    getVendordata();
    getDepartmentListdata()
  }, [dispatch]);

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

  useEffect(() => {
    if (client && selectedVendor) {
      getClientCompany();
    }
  }, [selectedVendor]);

  function getClientCompany() {
    const cliId = selectedVendor.value.split("-")[0];
    axios
      .get(
        Config.getCommonUrl() + `api/client/company/listing/listing/${cliId}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setClientCompany(response.data.data);
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
          api: "api/vendor/both/vendorandclient",
        });
      });
  }

  function getMetalpurchases(url) {
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
            dispatch(
              Actions.showMessage({
                message: response.data.message,
                // variant: "error",
              })
            );
            setApiData([]);
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setLoading(false);
          setApiData([]);
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
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
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
      let dateVal = moment(fromDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
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
      let dateVal = moment(toDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
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
    let url =
      "api/metalpurchasereturn?department_id=" +
      selectedDepartment.value.split("-")[1];

      if (selectDepartment.length !== 0) {
        const departmentId = selectDepartment.value
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
      moment(new Date(fromDate)).format("YYYY-MM-DD") >=
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

    getMetalpurchases(url);
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
    getMetalpurchases(
      "api/metalpurchasereturn?department_id=" +
        selectedDepartment.value.split("-")[1]
    );
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function viewHandler(id) {
    props.history.push("/dashboard/sales/addmetalpurchasereturn", {
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

  function callDeleteMetalPurchaseRetApi() {
    if (validateDelete()) {
      const body = {
        delete_remark: deleteReason,
        admin_id: adminId,
      };
      axios
        .post(
          Config.getCommonUrl() +
            "api/metalpurchasereturn/" +
            selectedIdForDelete,
          body
        )
        .then(function (response) {
          console.log(response);
          // setOpen(false);
          if (response.data.success === true) {
            dispatch(
              Actions.showMessage({
                message: response.data.message,
                variant: "success",
              })
            );
            // setSelectedIdForDelete("");
            resetFilters();
          } else {
            dispatch(
              Actions.showMessage({
                message: response.data.message,
                // variant: "error",
              })
            );
          }
        })
        .catch((error) => {
          handleError(error, dispatch, {
            api: "api/metalpurchasereturn/" + selectedIdForDelete,
            body,
          });
        });
      handleClose();
    }
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container ">
          <div
            className="flex flex-1 flex-col min-w-0  makeStyles-root-1"
            style={{ marginTop: "30px" }}
          >
            <Grid
              container
              alignItems="center"
              style={{ paddingInline: "30px" }}
            >
              <Grid item xs={9} sm={9} md={8} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Metal Purchase Return
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={3}
                sm={3}
                md={4}
                key="2"
                style={{ textAlign: "right" }}
              >
                <Link
                  to="/dashboard/sales/addmetalpurchasereturn"
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
            <div className="main-div-alll" style={{ marginTop: "20px" }}>
              {loading && <Loader />}

              <Grid
                // className="department-main-dv p-16 pb-0"
                container
                spacing={2}
                alignItems="center"
              >
                <Grid item lg={3} md={4} sm={12} xs={12}>
                  <p style={{ paddingBottom: "5px" }}>Party name</p>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={vendorData.map((suggestion) => ({
                      value: suggestion.id + "-" + suggestion.type,
                      label: suggestion.name,
                      type: suggestion.type,
                    }))}
                    // components={components}
                    value={selectedVendor}
                    onChange={handlePartyChange}
                    autoFocus
                    blurInputOnSelect
                    tabSelectsValue={false}
                    placeholder="Party name"
                  />
                </Grid>
                <Grid item lg={3} md={4} sm={12} xs={12}>
                  <p style={{ paddingBottom: "5px" }}>Department Name</p>
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
                {client && (
                  <Grid item lg={3} md={4} sm={6} xs={12}>
                    <p style={{ paddingBottom: "5px" }}>Firm name</p>
                    <Select
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      options={clientCompany.map((suggestion) => ({
                        value: suggestion.id,
                        label: suggestion.company_name,
                      }))}
                      autoFocus
                      blurInputOnSelect
                      tabSelectsValue={false}
                      value={selectedCompany}
                      onChange={handlePartyCompanyChange}
                      placeholder="Firm name"
                    />
                    <span style={{ color: "red" }}>
                      {selectedCompanyErr.length > 0 ? selectedCompanyErr : ""}
                    </span>
                  </Grid>
                )}
                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <p style={{ paddingBottom: "3px" }}>From date</p>
                  <TextField
                    placeholder="From date"
                    name="fromDate"
                    value={fromDate}
                    error={fromDtErr.length > 0 ? true : false}
                    helperText={fromDtErr}
                    type="date"
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      max: moment().format("YYYY-MM-DD")
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <p style={{ paddingBottom: "3px" }}>To date</p>
                  <TextField
                    placeholder="To date"
                    name="toDate"
                    value={toDate}
                    error={toDtErr.length > 0 ? true : false}
                    helperText={toDtErr}
                    type="date"
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      max: moment().format("YYYY-MM-DD")
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid
                  item
                  lg={2}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.filterbtn}
                >
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

              <div className="mt-20 department-tbl-mt-dv">
                {/* <p>Some content or children or something.</p> */}
                <Paper
                  className={clsx(
                    classes.tabroot,
                    "table-responsive metalepurchase-tabel-dv repairedissue-table jewelleryreturnpurchase-tabel"
                  )}
                >
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad} align="left">
                          Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                        Department Name
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
                        <TableCell className={classes.tableRowPad} align="left">
                          Total Fine
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Fine Rate
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
                      {apiData.length === 0 ? (<>
                      <TableRow>
                        <TableCell className={classes.tableRowPad} colSpan={9} 
                                   style={{textAlign:"center"}}>
                          No Data
                        </TableCell>
                      </TableRow>
                      </>) : apiData
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
                              {moment
                                .utc(row.purchase_voucher_create_date)
                                .local()
                                .format("DD-MM-YYYY")}
                            </TableCell>
                            <TableCell
                            className={classes.tableRowPad}
                          >
                            {row.department.name}
                          </TableCell>
                            <TableCell className={classes.tableRowPad}>
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
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {parseFloat(row.totalFineGold).toFixed(3)}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {Config.numWithComma(row.rate)}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
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
                                <Icon className="mr-8 view-icone">
                                  <img src={Icones.view} alt="" />
                                </Icon>
                              </IconButton>
                              {moment().isSameOrBefore(
                                new Date(row.date_to_delete_before)
                              ) && (
                                <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    deleteHandler(row.id);
                                  }}
                                >
                                  <Icon className="mr-8 delete-icone">
                                    <img src={Icones.delete_red} alt="" />
                                  </Icon>
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
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
              id="DialogBox"
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
                  Are you sure you want to delete this record?
                </DialogContentText>
              </DialogContent>
              <div className="pl-32 pr-32 pb-5 pt-5">
                <p className="popup-labl">Deletion reason</p>
                <TextField
                  className="mt-1 input-select-bdr-dv"
                  placeholder="Deletion Reason"
                  name="deleteReason"
                  value={deleteReason}
                  error={deleteReasonErr.length > 0 ? true : false}
                  helperText={deleteReasonErr}
                  onChange={(e) => {
                    setDeleteReason(e.target.value);
                    setDeleteReasonErr("");
                  }}
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  maxrows={4}
                  minRows={4}
                />
              </div>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  className="delete-dialog-box-cancle-button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteMetalPurchaseRetApi}
                  className="delete-dialog-box-delete-button"
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
export default MetalPurchaseReturn;

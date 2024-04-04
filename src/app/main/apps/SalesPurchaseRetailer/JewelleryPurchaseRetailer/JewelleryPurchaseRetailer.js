import React, { useContext, useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
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
    // margin: 5,
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
}));

const JewelleryPurchaseRetailer = (props) => {
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
  const adminId = localStorage.getItem("userId");
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteReasonErr, setDeleteReasonErr] = useState("");
  const [vendorData, setVendorData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");

  const [fromDate, setFromDate] = useState(
    moment().subtract(1, "months").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");

  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [open, setOpen] = useState(false);
  const [client, setClient] = useState(false);
  const [clientCompany, setClientCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyErr, setSelectedCompanyErr] = useState("");
  const isPasswordTwo = localStorage.getItem("isPasswordTwo");
  const appContext = useContext(AppContext);

  const { selectedDepartment } = appContext;

  useEffect(() => {
    if (selectedDepartment !== "") {
      setFilters();
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000); // 10초 뒤에
    }
  }, [loading]);

  useEffect(() => {
    getVendordata();
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Sales-Retailer", dispatch);
  }, []);

  useEffect(() => {
    if (selectedVendor) {
      getFrimeName(selectedVendor.value);
      console.log(selectedVendor.value);
    }
  }, [selectedVendor]);

  const roleOfUser = localStorage.getItem("permission")
  ? JSON.parse(localStorage.getItem("permission"))
  : null;
    const [authAccessArr, setAuthAccessArr] = useState([]);

    useEffect(() => {
      let arr = roleOfUser
          ? roleOfUser["Sales-Retailer"]["Jewellery Purchase-Retailer"]
            ? roleOfUser["Sales-Retailer"]["Jewellery Purchase-Retailer"]
            : []
          : [];
      const arrData = [];
      if (arr.length > 0) {
        arr.map((item) => {
          arrData.push(item.name);
        });
      }
      setAuthAccessArr(arrData);
    }, []);

  function getFrimeName(vendorId) {
    axios
      .get(
        Config.getCommonUrl() +
        `retailerProduct/api/vendor/all/company/${vendorId}`
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
          api: `retailerProduct/api/vendor/all/company/${vendorId}`
        });
      });
  }

  function getVendordata() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/vendor/both/vendorandclient")
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
          api: "retailerProduct/api/vendor/both/vendorandclient",
        });
      });
  }

  function getJewellarypurchases(url) {
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
              dispatch(
                Actions.showMessage({
                  message: response.data.message,
                  variant: "error",
                })
              );
              setApiData([]);
            }
          } else {
            dispatch(
              Actions.showMessage({
                message: response.data.message,
                variant: "error",
              })
            );
            setApiData([]);
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
          setApiData([]);
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: url });
      });
  }

  function handlePartyChange(value) {
    setSelectedCompany("");
    setSelectedVendor(value);
  }

  const handlePartyCompanyChange = (value) => {
    setSelectedCompany(value);
    // console.log();
    setSelectedCompanyErr("");
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
        setFromDtErr("");
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
    let url = ""

    if(isPasswordTwo == 1){
     url = "retailerProduct/api/jewelleryPurchaseWt/wt?department_id=" +
      selectedDepartment.value.split("-")[1];
    }else{
     url = "retailerProduct/api/jewellerypurchase?department_id=" +
     selectedDepartment.value.split("-")[1];
    } 
      
    if (selectedVendor !== "") {
        if (selectedCompany !== "") {
          var venClient = selectedCompany.value;
          var isVendor = 1;
        } else {
          setSelectedCompanyErr("Select Firm Name");
          return;
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
        return;
      }
    }

    getJewellarypurchases(url);
  }

  function resetFilters() {
    setSelectedVendor("");
    setFromDate("");
    setFromDtErr("");
    setToDate("");
    setToDtErr("");
    setSelectedCompany("");
    setClient(false);
    // call api without filter
    if(isPasswordTwo == 1){
      getJewellarypurchases(
        "retailerProduct/api/jewelleryPurchaseWt/wt?department_id=" +
          selectedDepartment.value.split("-")[1]
      );
    }else{
      getJewellarypurchases(
        "retailerProduct/api/jewellerypurchase?department_id=" +
          selectedDepartment.value.split("-")[1]
      );
    }
   
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function viewHandler(id) {
    props.history.push("/dashboard/sales/jewellerypurchaseretailer/addjewellarypurchase", {
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

  function callDeleteJewellaryPurchaseApi() {
    if (validateDelete()) {
      const body = {
        delete_remark: deleteReason,
        admin_id: adminId,
      };
      axios
        .post(
          Config.getCommonUrl() +
            "retailerProduct/api/jewellerypurchase/" +
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
            setFilters();
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
          // setOpen(false);
          handleError(error, dispatch, {
            api: "retailerProduct/api/jewellerypurchase/" + selectedIdForDelete,
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
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            <Grid
              container
              alignItems="center"
              style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
            >
              <Grid item xs={6} sm={6} md={6} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Jewellery Purchase
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>
              {
                authAccessArr.includes('Add /Edit Jewellery Purchase-Retailer') && <Grid
                item
                xs={6}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              >
                <Link
                  to="/dashboard/sales/jewellerypurchaseretailer/addjewellarypurchase"
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
            <div className="main-div-alll ">
              {loading && <Loader />}

              <Grid
                // className="department-main-dv p-16"
                container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0, width: "100%" }}
              >
                <Grid item lg={2} md={4} sm={12} xs={12} style={{ padding: 6 }}>
                  <p style={{ paddingBottom: "3px" }}>Party Name</p>
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
                    autoFocus
                    blurInputOnSelect
                    tabSelectsValue={false}
                    onChange={handlePartyChange}
                    placeholder="Party Name"
                  />
                </Grid>
          
                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={12}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p style={{ paddingBottom: "3px" }}>Firm Name</p>
                    <Select
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      options={clientCompany.map((suggestion) => ({
                        value: suggestion.id,
                        label: suggestion.firm_name,
                      }))}
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
                
                <Grid item lg={2} md={4} sm={12} xs={12} style={{ padding: 6 }}>
                  <p style={{ paddingBottom: "3px" }}>From Date</p>
                  <TextField
                    placeholder="From Date"
                    name="fromDate"
                    value={fromDate}
                    error={fromDtErr.length > 0 ? true : false}
                    helperText={fromDtErr}
                    type="date"
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      max: moment().format("YYYY-MM-DD"),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item lg={2} md={4} sm={12} xs={12} style={{ padding: 6 }}>
                  <p style={{ paddingBottom: "3px" }}>To Date</p>
                  <TextField
                    placeholder="To Date"
                    name="toDate"
                    value={toDate}
                    error={toDtErr.length > 0 ? true : false}
                    helperText={toDtErr}
                    type="date"
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      max: moment().format("YYYY-MM-DD"),
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
                   style={{ alignItems: "end", display: "flex" }}
                >
                  <Button
                    variant="contained"
                    className={classes.filterBtn}
                    size="small"
                    onClick={(event) => {
                      setFilters();
                    }}
                    style={{float:"right"}}
                  >
                    filter
                  </Button>

                  <Button
                    variant="contained"
                    className={clsx(classes.filterBtn,"ml-16")}
                    size="small"
                    onClick={(event) => {
                      resetFilters();
                    }}
                    style={{float:"right"}}
                  >
                    reset
                  </Button>
                </Grid>
              </Grid>

              <div className="mt-20 department-tbl-mt-dv repairedissue-table metalpurchase-tbl-blg" id="jewelleryPurRetailer">
                {/* <p>Some content or children or something.</p> */}
                <Paper
                  className={clsx(
                    classes.tabroot,
                    "table-responsive new-add_stock_group_tbel"
                  )}
                >
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
                      {apiData.map((row) => (
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
                          <TableCell className={classes.tableRowPad}>
                            {row.voucher_no}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                           {row.VendorCompany.vendorDetailJP.name}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                           {row.VendorCompany.firm_name}
                            
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
                            {Config.numWithComma(
                              parseFloat(row.rate).toFixed(3)
                            )}
                          </TableCell>

                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {Config.numWithComma(row.total_invoice_amount)}
                          </TableCell>

                          <TableCell className={classes.tableRowPad}>
                            {
                              authAccessArr.includes('View Jewellery Purchase-Retailer') &&  <IconButton
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
                            }
                            {
                             isPasswordTwo == 0 && authAccessArr.includes('Delete Jewellery Purchase-Retailer') && moment().isSameOrBefore(
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
                                  <Icon className="mr-8 delete-icone">
                                    <img src={Icones.delete_red} alt="" />
                                  </Icon>
                                </IconButton>
                              ) : null
                            }
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
                  onClick={callDeleteJewellaryPurchaseApi}
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

export default JewelleryPurchaseRetailer;

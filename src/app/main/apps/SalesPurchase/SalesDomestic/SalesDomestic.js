import React, { useContext, useState, useEffect, useRef } from "react";
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
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
  },
  filterBtn: {
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
    marginBlock: "3px"
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

const SalesDomestic = (props) => {
  // const [searchData, setSearchData] = useState("");
  const [apiData, setApiData] = useState([]);
  const classes = useStyles();
  const dispatch = useDispatch();

  const theme = useTheme();

  const [loading, setLoading] = useState(true);

  const SelectRef = useRef(null);

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
  const [client, setClient] = useState(false);

  const [selectDepartment, setSelectDepartment] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);

  const [clientCompany, setClientCompany] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompanyErr, setSelectedCompanyErr] = useState("");
  const adminId = localStorage.getItem('userId')
  const [deleteReason, setDeleteReason] = useState("")
  const [deleteReasonErr, setDeleteReasonErr] = useState("")
  const [fromDate, setFromDate] = useState(moment().subtract(1, 'months').format('YYYY-MM-DD'));
  const [fromDtErr, setFromDtErr] = useState("");

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");

  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [open, setOpen] = useState(false);

  const appContext = useContext(AppContext);

  const { selectedDepartment } = appContext;
  const roleOfUser = localStorage.getItem("permission")
  ? JSON.parse(localStorage.getItem("permission"))
  : null;
  const [authAccessArr, setAuthAccessArr] = useState([]);

  useEffect(() => {
    //eslint-disable-next-line
    if (selectedDepartment !== "") {
      setFilters();
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
    return () => {
      console.log("cleaned up");
    };
  }, []);

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
    // getSalesDomestic("api/salesJobworkReturn");
    getVendordata();
    getDepartmentListdata()
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    if(client && selectedVendor){
      getClientCompany()
    }
  }, [selectedVendor])

  function getClientCompany() {
    const cliId = selectedVendor.value.split("-")[0];
    axios
      .get(Config.getCommonUrl() + `api/client/company/listing/listing/${cliId}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setClientCompany(response.data.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {api:`api/client/company/listing/listing/${cliId}`})
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
        handleError(error, dispatch, {api : "api/vendor/both/vendorandclient"})
      });
  }

  function getSalesDomestic(url) {
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
            dispatch(Actions.showMessage({ message: response.data.message }));
            setApiData([]);
          }
        } else {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
          setApiData([]);
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {api : url})
      });
  }

  function handlePartyChange(value) {
    setClient(false);
    setSelectedCompany("")
    setSelectedVendor(value);
    if(value.type === 2){
      setClient(true);
    }
  }

  const handlePartyCompanyChange = (value) => {
    setSelectedCompany(value);
    setSelectedCompanyErr("")
  }

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
    // if (
    //   fromDate === "" &&
    //   toDate === "" &&
    //   selectedVendor === "" &&
    //   selectedCompany === ""
    // ) {
    //   console.log("return");
    //   return;
    // }

    let url = "api/salesDomestic?";

    if (selectDepartment.length !== 0) {
      const departmentId = selectDepartment.value
      url = url + "department_id=" + departmentId;
    }
    // if (selectedVendor !== "") {
    //   url = url + "&jobworker=" + selectedVendor.value;
    // }

    // if (selectedCompany !== "") {
    //   if (selectedVendor !== "") {
    //     //if client selected then build using &, else ?
    //     url = url + "&clientCompany=" + selectedCompany.value;
    //   } else {
    //     url = url + "&clientCompany=" + selectedCompany.value;
    //   }
    // }

    if (selectedVendor !== "") {
      if(client){
        if(selectedCompany !== ""){
          let client = selectedVendor.value
          let clientCom = selectedCompany.value
          var isVendor = 2;
          url = url + "&client=" + client + "&clientCompany=" + clientCom + "&is_vendor_client=" + isVendor;
        }else{
          setSelectedCompanyErr("Select Firm Name");
          return;
        }
      }else{
        var venClient = selectedVendor.value.split("-")[0];
        var isVendor = 1;
        url = url + "&clientCompany=" + venClient + "&is_vendor_client=" + isVendor;
      }
    }

    if (moment(new Date(fromDate)).format("YYYY-MM-DD") > moment(new Date(toDate)).format("YYYY-MM-DD")) {
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
    getSalesDomestic(url);
  }

  function resetFilters() {
    setFromDate("");
    setFromDtErr("");
    setSelectDepartment([]);
    setToDate("");
    setToDtErr("");
    setSelectedCompany("");
    setClient(false);
    setSelectedVendor("");
    // call api without filter
    getSalesDomestic(
      "api/salesDomestic?department_id=" +
      selectedDepartment.value.split("-")[1]
    );
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function viewHandler(id) {
    props.history.push("/dashboard/sales/adddomesticsale", {
      id: id,
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

  function callDeleteRepairRecFromCust() {
    if(validateDelete()){
      const body = {
        delete_remark : deleteReason,
        admin_id : adminId
      }  
      axios
      .post(
        Config.getCommonUrl() + "api/salesDomestic/" + selectedIdForDelete , body
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
        handleError(error, dispatch, {api : "api/salesDomestic/" + selectedIdForDelete , body})
      });
      handleClose()
    }
  }


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
                  {/* <Typography className="p-16 pb-8 text-18 font-700"> */}
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Sales Invoice (Domestic)
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
                <Link
                  to="/dashboard/sales/adddomesticsale"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button
                    variant="contained"
                    // id="btn-save"
                    className={classes.button}
                    size="small"
                    onClick={(event) => {
                      //   setDefaultView(btndata.id);
                      //   setIsEdit(false);
                    }}
                  >
                    add new
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
            <div className="main-div-alll ">
              <Grid
                container
                spacing={2}
                alignItems="center"
              >
                <Grid
                  item
                  lg={2}
                  md={4}
                  sm={4}
                  xs={12}
                >
                  <p style={{ paddingBottom: "3px" }}>Select Party</p>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={vendorData
                      // .filter((item) => item.id !== selectedVendor.value)
                      .map((suggestion) => ({
                        value: suggestion.id + "-" + suggestion.type,
                        label: suggestion.name,
                        type: suggestion.type,
                      }))}
                    autoFocus
                    blurInputOnSelect
                    tabSelectsValue={false}
                    // components={components}
                    value={selectedVendor}
                    onChange={handlePartyChange}
                    placeholder="Select party"
                  />
                </Grid>
                {client && (
                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                  >
                    <p style={{ paddingBottom: "3px" }}>Select firm</p>
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
                      placeholder="Firm name"
                    />
                    <span style={{ color: "red" }}>
                      {selectedCompanyErr.length > 0 ? selectedCompanyErr : ""}
                    </span>
                  </Grid>
                )}

                <Grid item lg={2} md={4} sm={4} xs={12}>
                  <p style={{ paddingBottom: "3px" }}>Department Name</p>
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

                <Grid item lg={2} md={4} sm={4} xs={12}>
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
                    inputProps={{
                      max: moment().format("YYYY-MM-DD")
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 6 }}>
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
                    "table-responsive new-add_stock_group_tbel"
                  )}
                  id="salesdomestic-tabel-dv"
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
                        <TableCell className={classes.tableRowPad} colSpan={8} style={{textAlign:"center"}}>
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
                                : row.Client.name}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.is_vendor_client === 1
                                ? row.Vendor.firm_name
                                : row.ClientCompany.company_name}
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
                      onChange={(e) => {setDeleteReason(e.target.value); setDeleteReasonErr("")}}
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
                    onClick={callDeleteRepairRecFromCust}
                    className="delete-dialog-box-delete-button"
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

export default SalesDomestic;

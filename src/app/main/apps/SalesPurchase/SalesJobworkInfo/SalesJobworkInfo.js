import React, { useContext, useState, useEffect, useRef } from "react";
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
    marginBlock: "3px",
    color: "white",
  },
  filterbtn: {
    marginTop: '22px',
    display: 'flex',
    justifyContent: 'flex-start',

    [theme.breakpoints.down('md')]: {
      justifyContent: 'flex-end',
    },
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
    minWidth: 700,
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

const SalesJobworkInfo = (props) => {
  // const [searchData, setSearchData] = useState("");
  const [apiData, setApiData] = useState([]);
  const classes = useStyles();
  const dispatch = useDispatch();

  const theme = useTheme();

  const [loading, setLoading] = useState(true);

  const SelectRef = useRef(null)

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const [clientdata, setClientdata] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectClientErr, setSelectClientErr] = useState("");

  const [clientCompanies, setClientCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompErr, setSelectedCompErr] = useState("");

  const [selectDepartment, setSelectDepartment] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);

  const [fromDate, setFromDate] = useState(moment().subtract(1, 'months').format('YYYY-MM-DD'));
  const [fromDtErr, setFromDtErr] = useState("");

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");
  const adminId = localStorage.getItem('userId')
  const [deleteReason, setDeleteReason] = useState("")
  const [deleteReasonErr, setDeleteReasonErr] = useState("")
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [open, setOpen] = useState(false);

  const appContext = useContext(AppContext);

  const { selectedDepartment } = appContext;
  // const roleOfUser = localStorage.getItem("permission")
  // ? JSON.parse(localStorage.getItem("permission"))
  // : null;

  // const [authAccessArr, setAuthAccessArr] = useState([]);

  // useEffect(() => {
  //   let arr = roleOfUser
  //       ? roleOfUser["Sales Purchase"]["Sales Job Work Info"]
  //         ? roleOfUser["Sales Purchase"]["Sales Job Work Info"]
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
    NavbarSetting('Sales', dispatch)
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
    return () => {
      console.log("cleaned up");
    };
  }, []);

  useEffect(() => {
    // console.log("useEffect");
    // getSalesJobwork("api/salesJobwork");
    getClientData();
    getDepartmentListdata();
    //eslint-disable-next-line
  }, [dispatch]);

  function getClientData() {
    axios
      .get(Config.getCommonUrl() + "api/client/listing/listing")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setClientdata(response.data.data);
          // setData(response.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/client/listing/listing" })

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

  function getSalesJobwork(url) {
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
            dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
            setApiData([]);
          }
        } else {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
          setApiData([]);
        }
      })
      .catch(function (error) {
        // console.log(error);
        setLoading(false);

        handleError(error, dispatch, { api: url })

      });
  }

  function handlePartyChange(value) {
    setSelectedClient(value);
    setSelectClientErr("");
    let findIndex = clientdata.findIndex((item) => item.id === value.value);
    //   // console.log(findIndex, i);
    if (findIndex > -1) {
      getClientCompanies(value.value, function (response) {
        console.log(response);
        if (response !== null) {
          setClientCompanies(response);
        } else {
          setClientCompanies([]);
        }
      });
    }
    SelectRef.current.focus()

  }

  function getClientCompanies(clientId, callback) {
    // setClientCompanies

    axios
      .get(Config.getCommonUrl() + `api/client/company/listing/listing/${clientId}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(JSON.stringify(response.data.data));
          var compData = response.data.data;
          callback(compData);
          // setClientCompanies(compData);
        } else {
          callback(null);
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
      })
      .catch((error) => {
        callback(null);
        handleError(error, dispatch, { api: `api/client/company/listing/listing/${clientId}` })
      });
  }

  function handleCompanyChange(value) {
    setSelectedCompany(value);
    setSelectedCompErr("");
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

  const handleDepartmentChange = (value) => {
    setSelectDepartment(value);
  };

  function setFilters() {
    //check if single date added
    // if (
    //   fromDate === "" &&
    //   toDate === "" &&
    //   selectedClient === "" &&
    //   selectedCompany === ""
    // ) {
    //   console.log("return");
    //   return;
    // }
    let url = "api/tempSalesJobwork?";

    if (selectDepartment.length !== 0) {
      const departmentId = selectDepartment.value
      url = url + "department_id=" + departmentId;
    }

    
    if (selectedClient !== "") {
      url = url + "&client=" + selectedClient.value;
    }

    if (selectedCompany !== "") {
      if (selectedClient !== "") {
        //if client selected then build using &, else ?
        url = url + "&clientCompany=" + selectedCompany.value + "&is_vendor_client=" + 2;
      } else {
        url = url + "&clientCompany=" + selectedCompany.value + "&is_vendor_client=" + 2;
      }
    }

    if (moment(new Date(fromDate)).format("YYYY-MM-DD") > moment(new Date(toDate)).format("YYYY-MM-DD")) {
      setToDtErr("Enter Valid Date!");
      return;
    }

    if (fromDate !== "" || toDate !== "") {
      if (fromDtValidation() && toDtValidation()) {
        if (selectedClient !== "") {
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
    getSalesJobwork(url);
  }


  // function setFilters() {
  //   //check if single date added
  //   // if (
  //   //   fromDate === "" &&
  //   //   toDate === "" &&
  //   //   selectedClient === "" &&
  //   //   selectedCompany === ""
  //   // ) {
  //   //   console.log("return");
  //   //   return;
  //   // }
  //   let url = "api/tempSalesJobwork?department_id=" + selectedDepartment.value.split("-")[1];

  //   if (selectedClient !== "") {
  //     url = url + "&client=" + selectedClient.value;
  //   }

  //   if (selectedCompany !== "") {
  //     if (selectedClient !== "") {
  //       //if client selected then build using &, else ?
  //       url = url + "&clientCompany=" + selectedCompany.value + "&is_vendor_client=" + 2;
  //     } else {
  //       url = url + "&clientCompany=" + selectedCompany.value + "&is_vendor_client=" + 2;
  //     }
  //   }

  //   if (moment(new Date(fromDate)).format("YYYY-MM-DD") > moment(new Date(toDate)).format("YYYY-MM-DD")) {
  //     setToDtErr("Enter Valid Date!");
  //     return;
  //   }

  //   if (fromDate !== "" || toDate !== "") {
  //     if (fromDtValidation() && toDtValidation()) {
  //       if (selectedClient !== "") {
  //         url = url + "&start=" + fromDate + "&end=" + toDate;
  //       } else {
  //         url = url + "&start=" + fromDate + "&end=" + toDate;
  //       }
  //     } else {
  //       console.log("Date return");
  //       return;
  //     }
  //   }

  //   console.log(url);
  //   getSalesJobwork(url);
  // }

  function resetFilters() {
    setSelectedClient("");
    setSelectedCompany("")
    setFromDate("");
    setFromDtErr("");
    setToDate("");
    setToDtErr("");
    // call api without filter
    getSalesJobwork("api/tempSalesJobwork?");
    // getSalesJobwork("api/tempSalesJobwork?department_id=" + selectedDepartment.value.split("-")[1]);
  }

  function deleteHandler(id) {
    console.log("deleteHandler", id);
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function viewHandler(id) {
    console.log("viewHandler", id);
    props.history.push("/dashboard/sales/salejobworkinfo/addsalejobworkinfo", {
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
    if (deleteReason === "") {
      setDeleteReasonErr("Enter Valid delete reason");
      return false
    }
    return true;
  }

  function callDeleteRepairRecFromCust() {
    if (validateDelete()) {
      const body = {
        delete_remark: deleteReason,
        admin_id: adminId
      }
      axios
        .post(
          Config.getCommonUrl() + "api/tempSalesJobwork/" + selectedIdForDelete, body
        )
        .then(function (response) {
          console.log(response);
          if (response.data.success === true) {
            dispatch(Actions.showMessage({ message: response.data.message, variant: "success" }));
            resetFilters();
          } else {
            dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
          }
        })
        .catch((error) => {
          handleError(error, dispatch, { api: "api/tempSalesJobwork/" + selectedIdForDelete, body })
        });
      handleClose()
    }
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container overflow-x-hidden">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1" style={{ marginTop: "30px" }}>
            <Grid
              container
              alignItems="center"
              style={{ paddingInline: "30px" }}
            >
              <Grid item xs={9} sm={6} md={6} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Sales Invoice Info (Jobwork)
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>
              {
                // authAccessArr.includes('Add Sales Job Work Info') && 
                <Grid
                  item
                  xs={3}
                  sm={6}
                  md={6}
                  key="2"
                  style={{ textAlign: "right" }}
                >
                  <Link
                    to="/dashboard/sales/salejobworkinfo/addsalejobworkinfo"
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
            {loading && <Loader />}

            <div className="main-div-alll" style={{ marginTop: "20px" }}>

              <Grid
                container
                spacing={2}
                style={{ marginBottom: 16 }}
              >
                <Grid item lg={2} md={4} sm={6} xs={12}>
                  <p style={{ paddingBottom: "3px" }}>Party name</p>

                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={clientdata
                      // .filter((item) => item.id !== selectedVendor.value)
                      .map((suggestion) => ({
                        value: suggestion.id,
                        label: suggestion.name,
                      }))}
                    autoFocus
                    blurInputOnSelect
                    tabSelectsValue={false}
                    // components={components}
                    value={selectedClient}
                    onChange={handlePartyChange}
                    placeholder="Select Party"
                  />

                  <span style={{ color: "red" }}>
                    {selectClientErr.length > 0 ? selectClientErr : ""}
                  </span>
                </Grid>

                <Grid item lg={2} md={4} sm={6} xs={12}>
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

                <Grid item lg={2} md={4} sm={6} xs={12}>
                  <p style={{ paddingBottom: "3px" }}>Firm name</p>

                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={clientCompanies
                      // .filter((item) => item.id !== selectedVendor.value)
                      .map((suggestion) => ({
                        value: suggestion.id,
                        label: suggestion.company_name,
                      }))}
                    ref={SelectRef}
                    blurInputOnSelect
                    tabSelectsValue={false}
                    // components={components}
                    value={selectedCompany}
                    onChange={handleCompanyChange}
                    placeholder="Select Firm"
                  />

                  <span style={{ color: "red" }}>
                    {selectedCompErr.length > 0 ? selectedCompErr : ""}
                  </span>
                </Grid>

                <Grid item lg={2} md={4} sm={6} xs={12}>
                  <p style={{ paddingBottom: "3px" }}>From Date</p>

                  <TextField
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

                <Grid item lg={2} md={4} sm={6} xs={12}>
                  <p style={{ paddingBottom: "3px" }}>To date</p>

                  <TextField
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

                <Grid item lg={2} md={12} sm={12} xs={12}
                  className={classes.filterbtn}
                >
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

              <div className="jobwork-metal-mt department-tbl-mt-dv">
                {/* <p>Some content or children or something.</p> */}
                <Paper className={clsx(classes.tabroot, "table-responsive new-add_stock_group_tbel")} id="salesjobwork-tbel-dv">
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad} align="left">
                          Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
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
                      {apiData.length === 0 ? (
                      <>
                      <TableRow>
                        <TableCell className={classes.tableRowPad} colSpan={8} style={{textAlign:"center"}}>
                          No Data
                        </TableCell>
                      </TableRow>
                      </>
                      ) : apiData
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
                             {row.department.name}
                            </TableCell> 

                            <TableCell className={classes.tableRowPad}>
                              {row.voucher_no}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.Client !== null && row.Client.name}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.ClientCompany !== null &&
                                row.ClientCompany.company_name}
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
                              {
                                // authAccessArr.includes('View Sales Job Work Info') && 
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
                              }
                              {
                                // authAccessArr.includes('Delete Sales Job Work Info') && 
                                moment().isSameOrBefore(
                                  new Date(row.date_to_delete_before)
                                ) ? <IconButton
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
                                </IconButton> : null
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
                  onChange={(e) => { setDeleteReason(e.target.value); setDeleteReasonErr("") }}
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
                  onClick={callDeleteRepairRecFromCust}
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

export default SalesJobworkInfo;

import { FuseAnimate } from "@fuse";
import {
  Box,
  Button,
  Grid,
  Icon,
  IconButton,
  Modal,
  Paper,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Icones from "assets/fornt-icons/Mainicons";
import { useReactToPrint } from "react-to-print";
import SalesPendingAmountPrintComp from "./SalesPendingAmountPrintComp/SalesPendingAmountPrintComp";
import SalesPendingOldAmountPrintComp from "./SalesPendingAmountPrintComp/SalesPendingOldAmountPrintComp";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import moment from "moment";
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "calc(100vh - 218px)",
  },
  table: {
    minWidth: 1500,
  },
  search: {
    display: "flex",
    border: "1px solid #cccccc",
    height: "38px",
    width: "100%",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
    marginLeft: "auto",
  },
  paper: {
    position: "absolute",
    maxWidth: 950,
    width: "calc(100% - 30px)",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
  },
  tableRowPad: {
    padding: 7,
    fontSize: "1.2rem",
  },
  leftBorder: {
    borderLeft: "1px solid darkgray",
  },
  hoverClass: {
    color: "#1e90ff",
    "&:hover": {
      cursor: "pointer",
    },
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
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "100%",
    height: "37px",
    color: "#CCCCCC",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter",
  },
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
  },
  tableFooter: {
    padding: 7,
    backgroundColor: "#E3E3E3",
  },
}));

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const SalesPendingAmountReport = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [GraphData, setGraphData] = useState("");
  const [searchData, setSearchData] = useState("");
  const [apiData, setApiData] = useState([]);

  const [apiReadOnlyData, setApiReadOnlyData] = useState([]);
  const [apiPartialPaymentData, setApiPartialPaymentData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);

  const [isEdit, setIsEdit] = useState(false);
  const [isClose, setIsClose] = useState(false);
  const [isPartial, setIsPartial] = useState(false);
  const [simpleOrCompound, setSimpleOrCompound] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedVoucherId, setSelectedVoucherId] = useState("");
  const [partialAmountErr, setPartialAmountErr] = useState("");
  const [partialDateErr, setPartialDateErr] = useState("");
  const [parDateVal, setParDateVal] = useState("");
  const [isRemZero, setIsRemZero] = useState(0);
  const [toDate, setToDate] = useState("");
  const [toDtErr, setToDtErr] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [fromDtErr, setFromDtErr] = useState("");
  const [dateFilter, setDateFilter] = useState(false);

  const [apiOldUdhaarReadOnlyData, setApiOldUdhaarReadOnlyData] = useState([]);
  const [apiOldPaymentData, setApiOldPaymentData] = useState([]);
  const [selectedOldVoucherId, setSelectedOldVoucherId] = useState("");
  
  const [isOldEdit, setIsOldEdit] = useState(false);
  const [isOldClose, setIsOldClose] = useState(false);
  const [isOldPartial, setIsOldPartial] = useState(false);

  const [oldDateVal, setOldParDateVal] = useState("");
  const [isOldRemZero, setIsOldRemZero] = useState(0);

  const [oldModalOpen, setOldModalOpen] = useState(false);
  const [oldAmountErr, setOldAmountErr] = useState("");
  const [oldDateErr, setOldDateErr] = useState("");

  const [Err, ] = useState("");

  useEffect(() => {
    NavbarSetting("Reports-Retailer", dispatch);
  }, []);

  useEffect(() =>{
    const timeout = setTimeout(() => {
      setApiData([])
      setFilters()
    }, 800);
    return () => {
        clearTimeout(timeout);
    };
  },[searchData,dateFilter])

  function handleFormSubmit() {
    if (
      partialDateValidation(PartialInternalData.payment_date) &&
      partialAmountValidation(PartialInternalData.part_pay_amount)
    ) {
      postPendingAmountInputData();
    }
  }

  const [PartialInternalData, setPartialInternalData] = useState({
    payment_date: "",
    part_pay_amount: "",
    notes: "",
  });

  function clearData() {
    setPartialInternalData({
      payment_date: "",
      part_pay_amount: "",
      notes: "",
    });
  }

  function handleInputChange(e) {
    const { value, name } = e.target;
    setPartialInternalData((prevData) => ({
      ...prevData,
      [name]: value,

    }));
    if (name === "payment_date") {
      partialDateValidation(value);
    } else if (name === "part_pay_amount" && !isNaN(value)) {
      partialAmountValidation(value);
    }
  }


  function handleOldUdhaarFormSubmit() {
    if (
      oldDateValidation(udhharInternalData.payment_date) &&
      oldAmountValidation(udhharInternalData.part_pay_amount)
    ) {
      postOldAmountInputData();
    }
  }

  const [udhharInternalData, setudhharInternalData] = useState({
    payment_date: "",
    part_pay_amount: "",
    notes: "",
  });

  function clearDataOldUdhhar() {
    setudhharInternalData({
      payment_date: "",
      part_pay_amount: "",
      notes: "",
    });
  }

  function handleOldUdhaarInputChange(e) {
    const { value, name } = e.target;
    setudhharInternalData((prevData) => ({
      ...prevData,
      [name]: value,
  
    }));
    if (name === "payment_date") {
      oldDateValidation(value);
    } else if (name === "part_pay_amount" && !isNaN(value)) {
      oldAmountValidation(value);
    }
  }

  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
    //eslint-disable-next-line
  }, [componentRef.current]);

  function getDateAndTime() {
    return (
      new Date().getDate() +
      "_" +
      (new Date().getMonth() + 1) +
      "_" +
      new Date().getFullYear() +
      "_" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes()
    );
  }

  const handleBeforePrint = React.useCallback(() => {}, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        // setLoading(false);
        // setText("New, Updated Text!");
        resolve();
      }, 10);
    });
  }, []); //setText

  const handleAfterPrint = () => {
    setModalOpen(false);
    setOldModalOpen(false);
  };

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Sales Pending Amount_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });

  function checkforPrint() {
    handlePrint();
  }

  function handlePartialPayment(id) {
    getPendingAmountReadOnlyData(id);
    setIsEdit(false);
    setIsClose(false)
    setIsPartial(true);
    setModalOpen(true);


    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const setToday = `${year}-${month}-${day}`;
    console.log(setToday);
  }


  const handleOldUdhaarPrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Old Sales Pending Amount_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });

  function checkforOldUdhaarPrint() {
    handleOldUdhaarPrint();
  }

  function handleOldUdhaarPayment(id) {
    getOldAmountReadOnlyData(id);

    setIsOldEdit(false);
    setIsOldClose(false);
    setIsOldPartial(true);
    setOldModalOpen(true);

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const setToday = `${year}-${month}-${day}`;
    console.log(setToday);
  }

  function setFilters() {
    let url = 
    `retailerProduct/api/salesDomestic/pendingAmount/Report?search=${searchData}&from_date=${fromDate}&to_date=${toDate}`;
    getPendingAmountData(url);
  }
  
  function getPendingAmountData(api) {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() + api)

      .then(function (response) {

           if (response.data.success === true) {
          
            const data1 = response.data.data;
            const oldUdhaarData = response.data.oldUdhaarData;
            const data = [...data1, ...oldUdhaarData];
            const groupedData = {};

            data.forEach((row) => {
              const date = row.created_at;
              if (!groupedData[date]) {
                groupedData[date] = [];
              }
              groupedData[date].push(row);
            });

            const sortedData = [];
            for (const date in groupedData) {
              sortedData.push(...groupedData[date]);
            }

            setApiData(sortedData);
         
            // let totalRemaningBalance = HelperFunc.getTotalOfField(
            //   apiData,
            //   "remaining_balance"
            // );
            // setTotalremainingBalance(parseFloat(totalRemaningBalance).toFixed(3));

          console.log(response.data.data);
          setLoading(false);
          
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: api,
        });
      });
  }

  function getPendingAmountReadOnlyData(id) {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() +
          `retailerProduct/api/salesDomestic/pendingAmountReport/${id}`)

      .then(function (response) {
        if (response.data.success === true) {
          setApiReadOnlyData(response.data.data);
          console.log(response.data.data);
          console.log(response.data.data.PartialPaymentData);
          setLoading(false);
          setApiPartialPaymentData(response.data.data.PartialPaymentData);
          setSelectedVoucherId(response.data.data.id);
          setParDateVal(
            response.data.data.PartialPaymentData.length !== 0
              ? response.data.data.PartialPaymentData[0].payment_date
              : ""
          );
          const updateIsRem =
            response.data.data.PartialPaymentData.length !== 0
              ? parseFloat(
                  response.data.data.PartialPaymentData[0].remaining_balance,
                  response.data.data.PartialPaymentData[0].udhar_amount
                ) === 0
                ? 1
                : 0
              : 0;

          setIsRemZero(updateIsRem);
          console.log(updateIsRem);
          console.log(response.data.data.id);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        // setLoading(false);
        handleError(error, dispatch, {
          api: `retailerProduct/api/salesDomestic/pendingAmountReport/${id}`,
        });
      });
  }

  function postPendingAmountInputData() {
    setLoading(true);
    axios
      .post(
        Config.getCommonUrl() +
          `retailerProduct/api/salesDomestic/pending/amount/${selectedVoucherId}`,
        PartialInternalData
      )

      .then(function (response) {
        if (response.data.success === true) {
          // setApiReadOnlyData(response.data.data)
          console.log(response.data.data);
          setModalOpen(false);
          clearData();
          setLoading(false);
          setFilters();
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
              variant: "success",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        // setLoading(false);
        handleError(error, dispatch, {
          api: `retailerProduct/api/salesDomestic/pending/amount/${selectedVoucherId}`,
        });
      });
  }

  function partialAmountValidation(value) {
    console.log(value);
    if (value === "" || value === null || value === 0) {
      setPartialAmountErr("Enter Amount");
      return false;
    } else {
      setPartialAmountErr("");
      return true;
    }
  }

  function partialDateValidation(value) {
    if (value < parDateVal) {
      setPartialDateErr("Enter Date");
      return false;
    } else {
      setPartialDateErr("");
      return true;
    }
  }

  function handleModalClose() {
    setModalOpen(false);
    clearData();
  }
 
  function resetFilters() {
    setFromDate("");
    setDateFilter(false)
    setFromDtErr("");
    setToDate("");
    setToDtErr("");
  }


  function oldAmountValidation(value) {
    console.log(value);
    if (value === "" || value === null || value === 0) {
      setOldAmountErr("Enter Amount");
      return false;
    } else {
      setOldAmountErr("");
      return true;
    }
  }

  function oldDateValidation(value) {
    if (value < parDateVal) {
      setOldDateErr("Enter Date");
      return false;
    } else {
      setOldDateErr("");
      return true;
    }
  }

  function handleOldUdhharModalClose() {
    setOldModalOpen(false);
    clearDataOldUdhhar();
  }

  function getOldAmountReadOnlyData(id) {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() + 
        `retailerProduct/api/salesDomestic/oldUdhaar/voucher/${id}` )

      .then(function (response) {
        if (response.data.success === true) {
          setApiOldUdhaarReadOnlyData(response.data.data);
          console.log(response.data.data);
          console.log(response.data.data.SalesPartialPaymentData);

          setLoading(false);
          setApiOldPaymentData(response.data.data.SalesPartialPaymentData);
          setSelectedOldVoucherId(response.data.data.id);

          setOldParDateVal(
            response.data.data.SalesPartialPaymentData?.length !== 0
              ? response.data.data.SalesPartialPaymentData[0].payment_date
              : ""
          );
          const updateIsOldRem =
            response.data.data.SalesPartialPaymentData?.length !== 0
              ? parseFloat(
                  response.data.data.SalesPartialPaymentData[0].remaining_balance
                ) === 0
                ? 1
                : 0
              : 0;

          console.log(updateIsOldRem);
          setIsOldRemZero(updateIsOldRem);
          console.log(response.data.data.id);

        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        // setLoading(false);
        handleError(error, dispatch, {
          api: `retailerProduct/api/salesDomestic/oldUdhaar/voucher/${id}` ,
        });
      });
  }

  function postOldAmountInputData() {
    setLoading(true);
  
    axios
      .post(
        Config.getCommonUrl() +
          `retailerProduct/api/salesDomestic/oldUdhaar/pendingamount/${selectedOldVoucherId}`,
        udhharInternalData
      )

      .then(function (response) {
        if (response.data.success === true) {
          // setApiReadOnlyData(response.data.data)
          console.log(response.data.data);
          setOldModalOpen(false);
          clearDataOldUdhhar();
          setLoading(false);

          setFilters();
          dispatch(Actions.showMessage({message: response.data.message,variant: "success"}));
        } else {
          dispatch(
            Actions.showMessage({message: response.data.message,variant: "success"}));
          setLoading(false);
        }
      })
      .catch((error) => {
        // setLoading(false);
        handleError(error, dispatch, {
          api: `retailerProduct/api/salesDomestic/oldUdhaar/pendingamount/${selectedOldVoucherId}`,
        });
      });
  }

  const exportToExcel = (type, fn, dl) => {
    if (apiData.length > 0) {
        const wb = XLSX.utils.book_new();

        // Export the first table
        const tbl1 = document.getElementById("tbl_exporttable_to_xls");
        // Remove last column from table
        const tbl1Modified = removeLastColumnFromTable(tbl1);
        const ws1 = XLSX.utils.table_to_sheet(tbl1Modified);
        XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

        return dl
            ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
            : XLSX.writeFile(
                wb,
                fn || `Udhaar_Amount.${type || "xlsx"}`
            );
    } else {
        dispatch(Actions.showMessage({ message: "Can not Export Empty Data" }));
    }
};

// Function to remove last column from a table
const removeLastColumnFromTable = (table) => {
  const rows = table.rows;
  for (let i = 0; i < rows.length; i++) {
      const cells = rows[i].cells;
      if (cells.length > 0) {
          rows[i].deleteCell(cells.length - 1); // Delete last cell in each row
      }
  }
  return table;
};


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container ">
          <div className="flex flex-1 flex-col min-w-0  makeStyles-root-1">

            <Grid
              container
              alignItems="center"
              style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
            >
              <Grid item xs={6} sm={6} md={6} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Udhaar Amount Reports
                  </Typography>
                </FuseAnimate>
              </Grid>

              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              >
                 <Link
                  to="/dashboard/reportsretailer/udhaaramountreports/addudhaaramount"
                  style={{ textDecoration: "none", color: "inherit", marginRight: "10px" }}
                >
                <Button
                style={{marginLeft:8}}
                  variant="contained"
                  size="small"
                  // onClick={() => setOpenModal(true)}
                  className={classes.button}
                >
                  Add Old Udhaar Amount
                </Button>
                </Link>
              </Grid>

            </Grid>

            <div className="main-div-alll">
            <Grid container spacing={2}   
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                }}>

              <Grid item xs={12} sm={6} md={3} lg={2}>
                 
                 <div
                   style={{ borderRadius: "7px !important" }}
                   component="form"
                   className={classes.search}
                 >
                   <InputBase
                     className={classes.input}
                     placeholder="Search"
                     inputProps={{ "aria-label": "search" }}
                     value={searchData}
                     onChange={(event) => setSearchData(event.target.value)}
                   />
                   <IconButton
                     type="submit"
                     className={classes.iconButton}
                     aria-label="search"
                   >
                     <SearchIcon />
                   </IconButton>
                 </div>
               </Grid>

                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <p style={{ paddingBottom: "3px" }}>From Date</p>
                  <TextField
                    placeholder="From Date"
                    name="fromDate"
                    value={fromDate}
                    error={fromDtErr.length > 0 ? true : false}
                    helperText={fromDtErr}
                    type="date"
                    onChange={(e) => setFromDate(e.target.value)}
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

                <Grid item lg={3} md={4} sm={6} xs={12}>
                  <p style={{ paddingBottom: "3px" }}>To Date</p>
                  <TextField
                    placeholder="To Date"
                    name="toDate"
                    value={toDate}
                    error={toDtErr.length > 0 ? true : false}
                    helperText={toDtErr}
                    type="date"
                    onChange={(e) => setToDate(e.target.value)}
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
                  lg={3}
                  md={4}
                  sm={12}
                  xs={12}
                  style={{
                    alignItems: "end",
                    display: "flex",
                    alignSelf: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    className={classes.filterBtn}
                    size="small"
                    onClick={(event) => {
                      setDateFilter(true);
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

                  <Button
                  className={clsx(classes.filterBtn, "ml-16")}
                  variant="contained"
                  color="primary"
                  aria-label="Register"
                  size="small"
                  onClick={(event) => {
                    exportToExcel("xlsx");
                  }}
                >
                  Export 
                </Button>
                </Grid>
              </Grid>

              <div className="mt-16 department-tbl-mt-dv">
                {/* {loading && <Loader style={{ height: "100px" }} />} */}

                <Paper className={clsx(classes.tabroot)}>
                  <Table className={classes.table} id="tbl_exporttable_to_xls">
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Voucher Number
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="center"
                        >
                          Party Name
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ paddingRight: "30px" }}
                        >
                          Card
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          Cash
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          Cheque
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          Online
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad} align="right">
                      Total Fine
                      </TableCell>
                      <TableCell className={classes.tableRowPad}  align="right">
                      Fine Rate  
                      </TableCell> */}
                       <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          Udhaar Amount
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          Remaining Balance
                        </TableCell>
                       
                    

                           <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        ></TableCell>

                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {apiData.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className={classes.tableRowPad}
                            style={{ textAlign: "center" }}
                          >
                            No Data
                          </TableCell>
                        </TableRow>
                      ) : (
                        <>
                          {apiData.map((row, i) => (
                            <TableRow key={i}>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {/* {moment
                                // 2024-03-31T13:39:24.000Z
                                  .utc(row.created_at)
                                  .local()
                                  .format("DD-MM-YYYY")} */}
                                  {row.created_at ? 
                                  moment(row.created_at,
                                   "YYYY-MM-DDThh:mm:ss").format("DD-MM-YYYY") : "-" }

                              </TableCell>

                              <TableCell className={classes.tableRowPad}>
                                {row.voucher_no ? row.voucher_no : "-"}
                              </TableCell>

                              <TableCell
                                align="center"
                                className={classes.tableRowPad}
                              >
                                {row.Client ? row.Client.client_Name : ""}
                                {/* {row.Client.client_Name ? row?.Client?.client_Name : ""} */}
                              </TableCell>

                              <TableCell
                                align="right"
                                className={classes.tableRowPad}
                                style={{ paddingRight: "30px" }}
                              >
                                {row.card
                                  ? parseFloat(row.card).toFixed(2)
                                  : "-"}
                              </TableCell>

                              <TableCell
                                align="right"
                                className={classes.tableRowPad}
                              >
                                {row.cash
                                  ? parseFloat(row.cash).toFixed(2)
                                  : "-"}
                              </TableCell>

                              <TableCell
                                align="right"
                                className={classes.tableRowPad}
                              >
                                {row.cheque
                                  ? parseFloat(row.cheque).toFixed(2)
                                  : "-"}
                              </TableCell>

                              <TableCell
                                align="right"
                                className={classes.tableRowPad}
                              >
                                {row.online
                                  ? parseFloat(row.online).toFixed(2)
                                  : "-"}
                              </TableCell>

                              {/* 
                          <TableCell
                            align="right"
                            className={classes.tableRowPad}
                          >
                            {row.totalFineGold ? parseFloat(row.totalFineGold).toFixed(2) : "-"}
                          </TableCell> */}

                              {/* <TableCell
                            align="right"
                            className={classes.tableRowPad}
                          >
                            {row.total_invoice_amount ? parseFloat(row.total_invoice_amount).toFixed(2) : "-"}
                          </TableCell> */}

                              <TableCell
                                align="right"
                                className={classes.tableRowPad}
                                style={{ textAlign: "right" }}
                              >
                                {row.udhar_amount ? row.udhar_amount : ""}
                              </TableCell>

                              <TableCell
                                align="right"
                                className={classes.tableRowPad}
                                style={{ textAlign: "right" }}
                              >
                                {row.remaining_balance
                                  ? row.remaining_balance
                                  : "-"}
                              </TableCell>
                          
                              <TableCell
                                align="right"
                                className={classes.tableRowPad}
                                style={{ width: "35px" }}
                              >
                                <Button
                                  variant="contained"
                                  className={classes.button}
                                  size="small"

                                  onClick={row.is_old_sales_voucher === 0 ?  
                                    () => handlePartialPayment(row.id) : 
                                    () => handleOldUdhaarPayment(row.id) 
                                    }
                                >
                                  partial payment
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow style={{ backgroundColor: "#EBEEFB" }}>
                        <TableCell
                          className={classes.tableRowPad}
                          align="left"
                          style={{ fontWeight: "700" }}
                        >
                          Total
                        </TableCell>

                        <TableCell
                          className={classes.tableRowPad}
                          align="left"
                          style={{ fontWeight: "700" }}
                        ></TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="left"
                          style={{ fontWeight: "700" }}
                        ></TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ fontWeight: "700", paddingRight: "30px" }}
                        >
                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(apiData, "card")
                          )}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ fontWeight: "700" }}
                        >
                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(apiData, "cash")
                          )}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ fontWeight: "700" }}
                        >
                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(apiData, "cheque")
                          )}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ fontWeight: "700" }}
                        >
                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(apiData, "online")
                          )}
                        </TableCell>
                        {/* <TableCell
                            className={classes.tableRowPad}
                            align="right"
                            style={{ fontWeight: "700" }}
                          >   
                            {Config.numWithComma(
                              HelperFunc.getTotalOfField(apiData, "totalFineGold")
                            )}
                          </TableCell> */}

                        {/* <TableCell
                            className={classes.tableRowPad}
                            align="right"
                            style={{ fontWeight: "700" }}
                          >
                            {Config.numWithComma(
                              HelperFunc.getTotalOfField(apiData, "total_invoice_amount")
                            )}
                          </TableCell> */}
                       
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ fontWeight: "700", textAlign: "right" }}
                        >

                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(
                              apiData,
                              "udhar_amount"
                            )
                          )}

                        </TableCell>

                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ fontWeight: "700", textAlign: "right" }}
                        >
                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(
                              apiData,
                              "remaining_balance"
                            )
                          )}
                        </TableCell>

                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ fontWeight: "700", textAlign: "right" }}
                        ></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>

      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={modalOpen}
        // onClose={(_, reason) => {
        //   if (reason !== "backdropClick") {
        //     handleModalClose(false);
        //   }
        // }}
      >
        {/* {modalOpen && loading ? <Loader /> : ""} */}
        <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
          <>
            <h5 className="popup-head p-20">
              {isEdit === true
                ? "Edit"
                : isClose
                ? "Close Payment"
                : isPartial
                ? "Partial Payment"
                : "Add New"}
              <IconButton
                style={{ position: "absolute", top: "3px", right: "6px" }}
                onClick={handleModalClose}
              >
                <Icon>
                  <img src={Icones.cross} alt="" />
                </Icon>
              </IconButton>
            </h5>

            <Box
              style={{ overflowX: "auto", maxHeight: "calc(100vh - 200px)" }}
            >
              <div style={{ padding: "30px" }}>
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid
                    item
                    xs={12}
                    md={6}
                    style={{ marginTop: "15px", position: "relative" }}
                  >
                    <label className={classes.label}>Voucher number</label>
                    <TextField
                      name="voucher_no"
                      variant="outlined"
                      fullWidth
                      value={apiReadOnlyData.voucher_no}
                      disabled
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    style={{ marginTop: "15px", position: "relative" }}
                  >
                    <label className={classes.label}>Party Name</label>
                    <TextField
                      name="client_Name"
                      variant="outlined"
                      fullWidth
                      disabled
                      value={apiReadOnlyData?.Client?.client_Name}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    style={{ marginTop: "15px", position: "relative" }}
                  >
                    <label className={classes.label}>Udhaar Amount</label>
                    <TextField
                      name="udhar_amount"
                      variant="outlined"
                      fullWidth
                      value={apiReadOnlyData.udhar_amount}
                      disabled
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    style={{ marginTop: "15px", position: "relative" }}
                  >
                    <label className={classes.label}>Date</label>
                    <TextField
                      name="payment_date"
                      type="date"
                      variant="outlined"
                      fullWidth
                      inputProps={{
                        min:
                          parDateVal && moment(parDateVal).format("DD-MM-YYYY"),
                        max: moment().format("YYYY-MM-DD"),
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      error={partialDateErr.length > 0 ? true : false}
                      helperText={partialDateErr}
                      onChange={(e) => handleInputChange(e)}
                      value={
                        PartialInternalData.payment_date
                          ? PartialInternalData.payment_date
                          : ""
                      }
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    style={{ marginTop: "15px", position: "relative" }}
                  >
                    <label className={classes.label}>Amount</label>
                    <TextField
                      name="part_pay_amount"
                      variant="outlined"
                      fullWidth
                      error={partialAmountErr.length > 0 ? true : false}
                      helperText={partialAmountErr}
                      onChange={(e) => handleInputChange(e)}
                      value={PartialInternalData.part_pay_amount}
                      // disabled
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    style={{ marginTop: "15px", position: "relative" }}
                  >
                    <label className={classes.label}>Note</label>
                    <TextField
                      name="notes"
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e)}
                      value={apiReadOnlyData.notes}
                    />
                  </Grid>
                </Grid>
              </div>

              <Paper
                style={{
                  padding: "30px",
                  boxShadow: "none",
                  paddingTop: 0,
                }}
              >
                <h3 style={{ marginBottom: "10px" }}>New Issue Amount</h3>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad}>
                        Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Paid Amount
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Remaining Balance
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ textAlign: "center" }}
                      >
                        Note
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {apiPartialPaymentData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} style={{ textAlign: "center" }}>
                        No Data
                      </TableCell>
                    </TableRow>
                  ) : (
                    apiPartialPaymentData.map((row, i) => {
                      return (
                        <TableBody key={i}>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              {row.payment_date
                                ? moment(row.payment_date, "YYYY-MM-DD").format(
                                    "DD-MM-YYYY"
                                  )
                                : "-"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {parseFloat(row.part_pay_amount).toFixed(2)}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {parseFloat(row.remaining_balance).toFixed(2)}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{
                                paddingRight: "28px",
                                textAlign: "center",
                              }}
                            >
                              {row.notes ? row.notes : "-"}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      );
                    })
                  )}
                </Table>
              </Paper>

              <Grid
                item
                xs={12}
                style={{
                  marginTop: "30px",
                  textAlign: "center",
                  marginBottom: "40px",
                }}
              >
                <Button
                  variant="contained"
                  className="w-128 mx-auto popup-cancel"
                  aria-label="Register"
                  onClick={handleModalClose}
                >
                  Cancel
                </Button>
                {isPartial ? (
                  <Button
                    variant="contained"
                    className="w-160 mx-auto popup-save"
                    style={{ marginLeft: "20px" }}
                    onClick={checkforPrint}
                  >
                    Print
                  </Button>
                ) : (
                  ""
                )}
                <Button
                  // variant="contained"
                  className="w-160 mx-auto"
                  style={{
                    marginLeft: "20px",
                    color: isRemZero === 1 ? "#00000042" : "#ffffff",
                    backgroundColor: isRemZero === 1 ? "#0000001f" : "#415bd4",
                  }}
                  // onClick={isClose ? setModalOpen(false) : handleFormSubmit()}

                  onClick={() => handleFormSubmit()}
                  disabled={isRemZero === 1}
                >
                  Save
                  {/* {isClose ? "Paid & Close" : "Save"} */}
                </Button>
              </Grid>
            </Box>
          </>
        </div>
      </Modal>



      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={oldModalOpen}
      >
        <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
          <>
            <h5 className="popup-head p-20">
               {/* {"Old Udhaar Payment"} */}

              {isOldEdit === true
                ? "Edit Old Udhaar"
                : isOldClose
                ? "Close Old Udhaar Payment"
                : isOldPartial
                ? "Old Udhaar Payment"
                : "Add New"} 

              <IconButton
                style={{ position: "absolute", top: "3px", right: "6px" }}
                onClick={handleOldUdhharModalClose}
              >
                <Icon>
                  <img src={Icones.cross} alt="" />
                </Icon>
              </IconButton>
            </h5>

            <Box
              style={{ overflowX: "auto", maxHeight: "calc(100vh - 200px)" }}
            >
              <div style={{ padding: "30px" }}>

                <Grid container spacing={2} alignItems="flex-end">
                  <Grid
                    item
                    xs={12}
                    md={6}
                    style={{ marginTop: "15px", position: "relative" }}
                  >
                    <label className={classes.label}>Voucher number</label>
                    <TextField
                      name="voucher_no"
                      variant="outlined"
                      fullWidth
                      value={apiOldUdhaarReadOnlyData.transaction_number}
                      disabled
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    style={{ marginTop: "15px", position: "relative" }}
                  >
                    <label className={classes.label}>Party Name</label>
                    <TextField
                      name="client_Name"
                      variant="outlined"
                      fullWidth
                      disabled
                      value={apiOldUdhaarReadOnlyData?.Client?.client_Name}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    style={{ marginTop: "15px", position: "relative" }}
                  >
                    <label className={classes.label}>Udhaar Amount</label>
                    <TextField
                      name="udhar_amount"
                      variant="outlined"
                      fullWidth
                      value={apiOldUdhaarReadOnlyData.udhaar_amount}
                      disabled
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    style={{ marginTop: "15px", position: "relative" }}
                  >
                    <label className={classes.label}>Date</label>
                    <TextField
                      name="payment_date"
                      type="date"
                      variant="outlined"
                      fullWidth
                      inputProps={{
                        min:
                          parDateVal && moment(parDateVal).format("DD-MM-YYYY"),
                        max: moment().format("YYYY-MM-DD"),
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                       
                      error={oldDateErr.length > 0 ? true : false}
                      helperText={oldDateErr}
                      onChange={(e) => handleOldUdhaarInputChange(e)}
                      value={
                        udhharInternalData.payment_date
                          ? udhharInternalData.payment_date
                          : ""
                      }
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    style={{ marginTop: "15px", position: "relative" }}
                  >
                    <label className={classes.label}>Amount</label>
                    <TextField
                      name="part_pay_amount"
                      variant="outlined"
                      fullWidth
                      error={oldAmountErr.length > 0 ? true : false}
                      helperText={oldAmountErr}
                      onChange={(e) => handleOldUdhaarInputChange(e)}
                      value={udhharInternalData.part_pay_amount}
                      // disabled
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={6}
                    style={{ marginTop: "15px", position: "relative" }}
                  >
                    <label className={classes.label}>Note</label>
                    <TextField
                      name="notes"
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleOldUdhaarInputChange(e)}
                      value={apiOldUdhaarReadOnlyData.notes}
                    />
                  </Grid>
                </Grid>
              </div>

              <Paper
                style={{
                  padding: "30px",
                  boxShadow: "none",
                  paddingTop: 0,
                }}
              >
                <h3 style={{ marginBottom: "10px" }}>New Issue Amount</h3>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad}>
                        Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Paid Amount
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Remaining Balance
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ textAlign: "center" }}
                      >
                        Note
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  
                  {apiOldPaymentData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} style={{ textAlign: "center" }}>
                        No Data
                      </TableCell>
                    </TableRow>
                  ) : (
                    apiOldPaymentData.map((row, i) => {
                      return (
                        <TableBody key={i}>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              {row.payment_date
                                ? moment(row.payment_date, "YYYY-MM-DD").format(
                                    "DD-MM-YYYY"
                                  )
                                : "-"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {parseFloat(row.part_pay_amount).toFixed(2)}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {parseFloat(row.remaining_balance).toFixed(2)}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{
                                paddingRight: "28px",
                                textAlign: "center",
                              }}
                            >
                              {row.notes ? row.notes : "-"}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      );
                    })
                  )}
                </Table>
              </Paper>

              <Grid
                item
                xs={12}
                style={{
                  marginTop: "30px",
                  textAlign: "center",
                  marginBottom: "40px",
                }}
              >
                <Button
                  variant="contained"
                  className="w-128 mx-auto popup-cancel"
                  aria-label="Register"
                  onClick={handleOldUdhharModalClose}
                >
                  Cancel
                </Button>
                {isOldPartial ? (
                  <Button
                    variant="contained"
                    className="w-160 mx-auto popup-save"
                    style={{ marginLeft: "20px" }}
                    onClick={checkforOldUdhaarPrint}
                  >
                    Print
                  </Button>
                ) : (
                  ""
                )}
                <Button
                  // variant="contained"
                  className="w-160 mx-auto"
                  style={{
                    marginLeft: "20px",
                    color: isOldRemZero === 1 ? "#00000042" : "#ffffff",
                    backgroundColor: isOldRemZero === 1 ? "#0000001f" : "#415bd4",
                  }}
                  onClick={() => handleOldUdhaarFormSubmit()}
                  disabled={isOldRemZero === 1}
                >
                  Save
                </Button>
              </Grid>
            </Box>

          </>
        </div>
      </Modal>

      <div style={{ display: "none" }}>
        <SalesPendingAmountPrintComp
          ref={componentRef}
          apiReadOnlyData={apiReadOnlyData}
          apiPartialPaymentData={apiPartialPaymentData}
        />
      </div>

      <div style={{ display: "none" }}>
        <SalesPendingOldAmountPrintComp
          ref={componentRef}
          apiOldUdhaarReadOnlyData={apiOldUdhaarReadOnlyData}
          apiOldPaymentData={apiOldPaymentData}
        />
      </div>

    </div>
  );
};

export default SalesPendingAmountReport;

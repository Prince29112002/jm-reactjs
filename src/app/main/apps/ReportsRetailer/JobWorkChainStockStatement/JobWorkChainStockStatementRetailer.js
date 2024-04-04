import React, { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
// import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
} from "recharts";
import axios from "axios";
import clsx from "clsx";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { FuseAnimate } from "@fuse";
import {
  Button,
  Grid,
  Icon,
  IconButton,
  TableFooter,
  TextField,
  Typography,
} from "@material-ui/core";
import Select, { createFilter } from "react-select";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import moment from "moment";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import * as Actions from "app/store/actions";
import AppContext from "app/AppContext";
import * as XLSX from "xlsx";
import Loader from "app/main/Loader/Loader";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";
import jsPDF from "jspdf";
import "jspdf-autotable";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    tableLayout: "auto",
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
  },
  tableRowPad: {
    padding: 7,
    fontSize: "1.2rem",
  },
  pdftableRowPad: {
    padding: 7,
    border: "1px solid #ebeefb",
  },
  leftBorder: {
    borderLeft: "1px solid darkgray",
  },
  hoverClass: {
    // backgroundColor: "#fff",
    color: "#1e90ff",
    "&:hover": {
      // backgroundColor: "#999",
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
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    // height: "100%",
    height: "100%",
  },
  // table: {
  //   minWidth: 650,
  // },
  tableFooter: {
    padding: 7,
    backgroundColor: "#E3E3E3",
  },
}));
const JobWorChainkStockStatementRetailer = (props) => {
  const [GraphData, setGraphData] = useState("");
  const [loading, setLoading] = useState(true);
  const classes = useStyles();
  const theme = useTheme();
  const [vendorData, setVendorData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [fromDate, setFromDate] = useState(
    moment().subtract(1, "months").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");
  const appContext = useContext(AppContext);
  const [apiData, setApiData] = useState([]);
  const [total, settotal] = useState("");
  const [totalFineGold, settotalFineGold] = useState("");
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");
  const [isExpert, setIsExpert] = useState(false);
  const [isChainZamZam, setIsChainZamZam] = useState(0);
  // const [creditSum, setCreditSum] = useState("");
  // const [debitSum, setDebitSum] = useState("");
  // const GrandTotal = debitSum - creditSum;
  const [pdfAcName, setPdfAcName] = useState("");
  const { selectedDepartment } = appContext;

  const [pdfTotalData, setPdfTotalData] = useState({
    issueFineTotal: "",
    returnFineTotal: "",
    issueAmountTotal: "",
    returnAmountTotal: "",
  });

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };
  useEffect(() => {
    //eslint-disable-next-line
    if (selectedDepartment !== "") {
      setFilters();
    }
  }, [selectedDepartment]);
  useEffect(() => {
    NavbarSetting("Reports-Retailer", dispatch);
    setIsChainZamZam(parseFloat(window.localStorage.getItem("isChainZamZam")));
  }, []);

  const dispatch = useDispatch();
  useEffect(() => {
    // getGraphData();
    getVendordata();

    // NavbarSetting('Sales',dispatch)
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 3000); // 10초 뒤에
    }
  }, [loading]);

  // useEffect(() => {
  //   getGraphData();
  //   //eslint-disable-next-line
  // },[])
  function handlePartyChange(value) {
    // setClient(false);
    setSelectedVendor(value);

    // setSelectedCompany("");
    // setSelectedVendor(value);
    // if (value.type === 2) {
    //   setClient(true);
    // }
  }
  function getVendordata() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/clientret/listing")
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
          api: "retailerProduct/api/clientret/listing/",
        });
      });
  }
  function getJobworkerStockStatement(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // setLoading(false);
          if (response.data.issuedata === undefined) {
            setApiData([]);
            setLoading(false);
            settotal(0.0);
            settotalFineGold(0.0);
            dispatch(
              Actions.showMessage({ message: "No Data", variant: "error" })
            );
          } else {
            const issuedata = response.data.issuedata;
            const returndata = response.data.returndata;

            const data = [...issuedata, ...returndata];
            const groupedData = {};

            // Group objects by date
            data.forEach((obj) => {
              const date = obj.purchase_voucher_create_date;
              if (!groupedData[date]) {
                groupedData[date] = [];
              }
              groupedData[date].push(obj);
            });

            // Flatten the grouped data into a sorted array
            const sortedData = [];
            for (const date in groupedData) {
              sortedData.push(...groupedData[date]);
            }
            setGraphData(response.data.GraphData);
            console.log(response.data.GraphData);
            setApiData(sortedData);
            calculateFineGoldTotals(sortedData);
            let total = HelperFunc.getTotalOfField(data, "rate_of_fine_gold");
            settotal(parseFloat(total).toFixed(3));
            let totalfinegold = HelperFunc.getTotalOfField(
              data,
              "totalFineGold"
            );
            settotalFineGold(parseFloat(totalfinegold).toFixed(3));
            setLoading(false);
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "false",
            })
          );
          setLoading(false);
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: url });
        console.log(error);
      });
  }
  // console.log(GraphData);
  function getGraphData() {
    // setLoading(true);
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/reports/viewGraph")
      .then((response) => {
        console.log(response);
        setGraphData(response.data.GraphData);
        // setLoading(false);
      })
      .catch((error) => {
        // setLoading(false);
        handleError(error, dispatch, {
          api: "retailerProduct/api/reports/viewGraph",
        });
      });
  }
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
        setFromDtErr("Enter valid date");
      }
    } else if (name === "toDate") {
      setToDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      if (dateVal <= today && minDateVal < dateVal) {
        setToDtErr("");
      } else {
        setToDtErr("Enter valid date");
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
        setFromDtErr("Enter valid date");
        return false;
      }
    }
    return true;
  }
  function setFilters() {
    let url =
      "retailerProduct/api/chainReports/chainReport?department_id=" +
      selectedDepartment.value.split("-")[1];

    if (selectedVendor !== "") {
      var venClient = selectedVendor.value;
      var isVendor = 2;
      url = url + "&jobworker=" + venClient;
    }

    if (
      moment(new Date(fromDate)).format("YYYY-MM-DD") >
      moment(new Date(toDate)).format("YYYY-MM-DD")
    ) {
      setToDtErr("Enter valid date");
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

    getJobworkerStockStatement(url);
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
        setToDtErr("Enter Valid Date");
        return false;
      }
    }
    return true;
  }
  function resetFilters() {
    setSelectedVendor("");
    setFromDate("");
    setFromDtErr("");
    setToDate("");
    setToDtErr("");
    // setSelectedCompany("");
    // setClient(false);
    // call api without filter
    getJobworkerStockStatement(
      "retailerProduct/api/chainReports/chainReport?department_id=" +
        selectedDepartment.value.split("-")[1]
    );
  }
  const exportToExcel = (type, fn, dl) => {
    setIsExpert(true);
    if (apiData.length > 0) {
      const wb = XLSX.utils.book_new();

      // Export the first table
      const tbl1 = document.getElementById("tbl_exporttable_to_xls");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(
            wb,
            fn || `Party_Wise_Metal_Account_Balance.${type || "xlsx"}`
          );
    } else {
      setIsExpert(false);
      dispatch(
        Actions.showMessage({
          message: "Can not Export Empty Data",
          variant: "error",
        })
      );
    }
    setIsExpert(false);
  };
  const getTotalOfDebit = () => {
    let debitSum = 0;
    apiData.map((data) => {
      if (data.debit_or_credit === "Debit") {
        debitSum += parseFloat(data.totalFineGold);
      }
    });
    debitSum = parseFloat(debitSum).toFixed(3);
    // setDebitSum(debitSum)
    return debitSum;
  };
  const getTotalOfCredit = () => {
    let creditSum = 0;
    apiData.map((data) => {
      if (data.debit_or_credit === "Credit") {
        creditSum += parseFloat(data.totalFineGold);
      }
    });
    creditSum = parseFloat(creditSum).toFixed(3);
    // setCreditSum(creditSum)
    return creditSum;
  };
  let totalOfDebit = getTotalOfDebit();
  let totalOfCredit = getTotalOfCredit();
  const higherTotal = Math.max(
    parseFloat(totalOfDebit),
    parseFloat(totalOfCredit)
  );
  const GrandTotal = parseFloat(totalOfDebit) - parseFloat(totalOfCredit);
  console.log(GrandTotal, "😀😀😀😀");
  console.log(parseFloat(totalOfDebit), parseFloat(totalOfCredit), higherTotal);
  console.log(apiData);

  function calculateFineGoldTotals(data) {
    let issueFineTotal = 0;
    let returnFineTotal = 0;
    let issueAmountTotal = 0;
    let returnAmountTotal = 0;

    data.forEach((obj) => {
      if (obj.ChainJobWorkArticiaIssueOrder) {
        obj.ChainJobWorkArticiaIssueOrder.forEach((item) => {
          issueFineTotal += parseFloat(item.finegold);
          issueAmountTotal += parseFloat(item.amount);
        });
      }

      if (obj.ChainJobWorkArticianIssueOrder) {
        obj.ChainJobWorkArticianIssueOrder.forEach((item) => {
          returnFineTotal += parseFloat(item.finegold);
          returnAmountTotal += parseFloat(item.amount);
        });
      }
    });
    setPdfTotalData({
      issueFineTotal: issueFineTotal,
      returnFineTotal: returnFineTotal,
      issueAmountTotal: issueAmountTotal,
      returnAmountTotal: returnAmountTotal,
    });
    console.log(issueFineTotal);
    console.log(returnFineTotal);
    console.log(issueAmountTotal);
    console.log(returnAmountTotal);
    // return {
    //   issueTotal,
    //   returnTotal,
    // };
  }
  const downloadPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    doc.autoTableSetDefaults({
      margin: { top: 10, right: 10, left: 10 },
      tableWidth: "auto",
      showHead: "everyPage",
      showFoot: "lastPage",
      tableLineWidth: 0.5,
      headStyles: {
        fillColor: [211, 211, 211],
        textColor: [0, 0, 0],
        halign: "center", // Center align the text horizontally
      },
      footStyles: {
        fillColor: [211, 211, 211],
        textColor: [0, 0, 0],
      },
    });

    const tables = [document.getElementById("exportPdf")];
    let startY = 100;
    let firstPage = true;

    doc.autoTable({
      html: tables[0],
      startY,
      styles: { fontSize: 9 },
      didDrawPage: (data) => {
        if (firstPage) {
          // Title
          const titleText = "LEDGER";
          const titleWidth = doc.getTextDimensions(titleText, {
            fontSize: 12,
          }).w;
          const pageWidth = doc.internal.pageSize.width;
          const titleX = (pageWidth - titleWidth) / 2;

          // Set margin below the title
          const titleY = data.settings.margin.top + 15;
          doc.text(titleText, titleX, titleY);

          // Additional Content
          const additionalContentText = `Date From : ${moment(fromDate).format(
            "DD-MM-YYYY"
          )} To ${moment(toDate).format("DD-MM-YYYY")}`;
          const additionalContentWidth = doc.getTextDimensions(
            additionalContentText,
            { fontSize: 10 }
          ).w;
          const additionalContentX = (pageWidth - additionalContentWidth) / 2;
          const spacingBelowAdditionalContent = 15;
          doc.setFontSize(11);
          doc.text(
            additionalContentText,
            additionalContentX,
            titleY + spacingBelowAdditionalContent
          );
          console.log(selectedVendor);

          // Additional Text below additionalContentText
          const additionalText = `A/c Name : ${
            pdfAcName ? pdfAcName.label : ""
          }`;
          const additionalTextWidth = doc.getTextDimensions(additionalText, {
            fontSize: 14, // Set the font size for additionalText
          }).w;
          const additionalTextX = data.settings.margin.left;
          const spacingBelowAdditionalText = 30;

          doc.setFontSize(12); // Set the font size before calling doc.text
          doc.text(
            additionalText,
            additionalTextX,
            titleY + spacingBelowAdditionalContent + spacingBelowAdditionalText
          );

          // Extra Text below additionalText
          const extraText = `Ph : ${pdfAcName ? pdfAcName.number : ""}`;
          const extraTextWidth = doc.getTextDimensions(extraText, {
            fontSize: 12, // Set the font size for extraText
          }).w;
          const extraTextX = data.settings.margin.left;
          const spacingBelowExtraText = 15;

          doc.setFontSize(12); // Set the font size before calling doc.text
          doc.text(
            extraText,
            extraTextX,
            titleY +
              spacingBelowAdditionalContent +
              spacingBelowAdditionalText +
              spacingBelowExtraText
          );

          firstPage = false; // Set the flag to false after drawing on the first page
        }
      },
    });

    doc.save("JobworkStockStatemnt.pdf");
  };
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
                    Jobwork Stock Statement
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
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
              {/* {loading && <Loader />} */}

              <Grid container spacing={2} alignItems="center">
                <Grid item lg={3} md={4} sm={12} xs={12}>
                  <p style={{ paddingBottom: "5px" }}>Client Name</p>
                  {console.log(vendorData)}
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={vendorData.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.client_Name,
                      number: suggestion.mobile_number,
                    }))}
                    // components={components}
                    value={selectedVendor}
                    onChange={handlePartyChange}
                    autoFocus
                    blurInputOnSelect
                    tabSelectsValue={false}
                    placeholder="Client Name"
                  />
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
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    format="yyyy-MM-dd"
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
                    onChange={(e) => handleInputChange(e)}
                    onKeyDown={(e) => e.preventDefault()}
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
                      setPdfAcName(selectedVendor);
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
                  <Button
                    // className="metal-ledger-btn "
                    className={clsx(classes.filterBtn, "ml-16")}
                    variant="contained"
                    size="small"
                    aria-label="Register"
                    onClick={(event) => {
                      exportToExcel("xlsx");
                    }}
                  >
                    Export
                  </Button>
                  {/* {isChainZamZam === 0 && ( */}
                  <Button
                    // className="metal-ledger-btn "
                    className={clsx(classes.filterBtn, "ml-16")}
                    variant="contained"
                    size="small"
                    aria-label="Register"
                    onClick={(event) => {
                      downloadPDF();
                    }}
                  >
                    Export PDF
                  </Button>
                  {/* )} */}
                </Grid>
              </Grid>
              {apiData.length == 0 ? (
                ""
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="30%"
                  className="mt-16"
                >
                  <BarChart
                    width={500}
                    height={300}
                    data={GraphData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    {/* <CartesianGrid strokeDasharray="3 3" /> */}
                    <XAxis dataKey="Month" />
                    <YAxis
                      tickFormatter={(value) => value.toLocaleString("en-IN")}
                    />
                    <Legend />
                    <Tooltip
                      formatter={(value) => value.toLocaleString("en-IN")}
                    />
                    <Bar
                      dataKey="JobWorkArticianIssue"
                      name="Jobwork Artician Issue"
                      fill="#0080008a"
                    />
                    <Bar
                      dataKey="JobWorkArticianReturn"
                      name="Jobwork Artician Return"
                      fill="#ff000073"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div className="mt-20 department-tbl-mt-dv">
                {/* <p>Some content or children or something.</p> */}
                {loading && <Loader style={{ height: "100px" }} />}
                <Paper
                  className={clsx(
                    classes.tabroot,
                    "table-responsive metalepurchase-tabel-dv repairedissue-table jewelleryreturnpurchase-tabel"
                  )}
                >
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad} width="26%">
                          Voucher No.
                        </TableCell>
                        <TableCell className={classes.tableRowPad} width={150}>
                          Customer Name
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          width="17%"
                        >
                          DR (Udhar)
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          width="20%"
                        >
                          CR (Jama)
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad}>
                          Amount
                        </TableCell> */}
                        {/* <TableCell className={classes.tableRowPad}>
                          Voucher no.
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left" style={{ width: "260px" }}>
                          IN/OUT
                        </TableCell> <TableCell className={classes.tableRowPad} align="left">
                          Name of job worker
                        </TableCell>

                        <TableCell className={classes.tableRowPad} align="left">
                          Total Fine
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left" style={{ width: "125px", textAlign: "left" }}>
                          Fine Rate
                        </TableCell> */}
                        {/* <TableCell className={classes.tableRowPad} align="left">
                          Total Fine
                        </TableCell> */}
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          width="70px"
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiData
                        .sort((a, b) => {
                          const dateA = new Date(
                            a.purchase_voucher_create_date
                          );
                          const dateB = new Date(
                            b.purchase_voucher_create_date
                          );
                          const voucherDateA = new Date(
                            a.purchase_voucher_create_date
                          );
                          const voucherDateB = new Date(
                            b.purchase_voucher_create_date
                          );

                          if (dateB - dateA !== 0) {
                            return dateB - dateA;
                          }
                          return voucherDateA - voucherDateB;
                        })
                        .map((row) => {
                          console.log(row);
                          return (
                            <TableRow key={row.voucher_no}>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {console.log(isExpert)}
                                {moment
                                  .utc(row.purchase_voucher_create_date)
                                  .local()
                                  .format("DD-MM-YYYY")}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.voucher_no}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>{row.JobWorker.client_Name}</div>
                                  {console.log(row)}
                                  <div>
                                    {row?.cash === "cash" ? (
                                      <span style={{ color: "#75ba75" }}>
                                        Cash
                                      </span>
                                    ) : // <Icon style={{color: "#75ba75"}}>
                                    //   <MonetizationOnIcon />
                                    // </Icon>
                                    null}
                                  </div>
                                </div>
                              </TableCell>
                              {row.debit_or_credit === "Credit" ? (
                                <>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    align="right"
                                  >
                                    -
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    align="right"
                                    style={{ paddingRight: 27 }}
                                  >
                                    {Config.numWithComma(row.totalFineGold)}
                                  </TableCell>
                                </>
                              ) : (
                                <>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    align="right"
                                  >
                                    {Config.numWithComma(row.totalFineGold)}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    align="right"
                                    style={{ paddingRight: 27 }}
                                  >
                                    -
                                  </TableCell>
                                </>
                              )}
                              {/* <TableCell className={classes.tableRowPad}>
                            {Config.numWithComma(row.totalAmount)}
                          </TableCell> */}
                              <TableCell
                                className={classes.tableRowPad}
                                align="right"
                                width="70px"
                              ></TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                    <TableFooter>
                      <TableRow style={{ backgroundColor: "#d1d8f5" }}>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ fontWeight: "600", fontSize: "16px" }}
                        >
                          Total
                        </TableCell>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ fontWeight: "700" }}
                        ></TableCell>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ fontWeight: "700" }}
                        ></TableCell>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{
                            fontWeight: "700",
                            fontSize: "16px",
                            textAlign: "right",
                          }}
                        >
                          {Config.numWithComma(getTotalOfDebit())}
                        </TableCell>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{
                            fontWeight: "700",
                            fontSize: "16px",
                            textAlign: "right",
                            paddingRight: 27,
                          }}
                        >
                          {Config.numWithComma(getTotalOfCredit())}
                        </TableCell>
                        {/* <TableCell
                          className={classes.tableRowPad}
                          style={{ fontWeight: "600", fontSize:"16px", textAlign: "right" }}
                        >
                          {Config.numWithComma(HelperFunc.getTotalOfFieldNoDecimal(
                            apiData,
                            "totalAmount"
                          ))}
                        </TableCell> */}
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          width="70px"
                        ></TableCell>
                      </TableRow>
                      <TableRow style={{ backgroundColor: "#d1d8f5" }}>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ fontWeight: "600", fontSize: "16px" }}
                        >
                          Grand Total
                        </TableCell>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ fontWeight: "700" }}
                        ></TableCell>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ fontWeight: "700" }}
                        ></TableCell>
                        <TableCell
                          // align="center"
                          className={classes.tableRowPad}
                          style={{
                            fontWeight: "700",
                            textAlign: "center",
                            fontSize: "16px",
                            backgroundColor:
                              GrandTotal > 0 ? "#0080008a" : "#ff000073",
                          }}
                          colSpan={2}
                        >
                          {Config.numWithComma(GrandTotal)}
                        </TableCell>
                        {/* <TableCell
                          align="left"
                          className={classes.tableRowPad}
                        >
                        </TableCell> */}
                        {/* <TableCell
                          className={classes.tableRowPad}
                          style={{ fontWeight: "600", fontSize:"16px", textAlign: "right" }}
                        >
                          {Config.numWithComma(HelperFunc.getTotalOfFieldNoDecimal(
                            apiData,
                            "totalAmount"
                          ))}
                        </TableCell> */}
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          width="70px"
                        ></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>

                  <Table
                    className={classes.table}
                    id="tbl_exporttable_to_xls"
                    style={{ display: "none" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad} width="26%">
                          Voucher No.
                        </TableCell>
                        <TableCell className={classes.tableRowPad} width={150}>
                          Customer Name
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          width="17%"
                        >
                          DR (Udhar)
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          width="20%"
                        >
                          CR (Jama)
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad}>
                          Amount
                        </TableCell> */}
                        {/* <TableCell className={classes.tableRowPad}>
                          Voucher no.
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left" style={{ width: "260px" }}>
                          IN/OUT
                        </TableCell> <TableCell className={classes.tableRowPad} align="left">
                          Name of job worker
                        </TableCell>

                        <TableCell className={classes.tableRowPad} align="left">
                          Total Fine
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left" style={{ width: "125px", textAlign: "left" }}>
                          Fine Rate
                        </TableCell> */}
                        {/* <TableCell className={classes.tableRowPad} align="left">
                          Total Fine
                        </TableCell> */}
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          width="70px"
                        ></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiData
                        .sort((a, b) => {
                          const dateA = new Date(
                            b.purchase_voucher_create_date
                          );
                          const dateB = new Date(
                            a.purchase_voucher_create_date
                          );
                          const voucherDateA = new Date(
                            a.purchase_voucher_create_date
                          );
                          const voucherDateB = new Date(
                            b.purchase_voucher_create_date
                          );

                          if (dateB - dateA !== 0) {
                            return dateB - dateA;
                          }
                          return voucherDateA - voucherDateB;
                        })
                        .map((row) => {
                          console.log(row);
                          return (
                            <TableRow key={row.voucher_no}>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {console.log(isExpert)}
                                {moment
                                  .utc(row.purchase_voucher_create_date)
                                  .local()
                                  .format("YYYY-MM-DD")}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.voucher_no}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>{row.JobWorker.client_Name}</div>
                                  {console.log(row)}
                                  {/* <div>
                                {row?.cash === "cash" ? (
                                  <span style={{color: "#75ba75"}}>
                                    Cash
                                  </span>
                                  // <Icon style={{color: "#75ba75"}}>
                                  //   <MonetizationOnIcon />
                                  // </Icon>
                                ): null}
                              </div> */}
                                </div>
                              </TableCell>
                              {row.debit_or_credit === "Credit" ? (
                                <>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    align="right"
                                  >
                                    -
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    align="right"
                                    style={{ paddingRight: 27 }}
                                  >
                                    {Config.numWithComma(row.totalFineGold)}
                                  </TableCell>
                                </>
                              ) : (
                                <>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    align="right"
                                  >
                                    {Config.numWithComma(row.totalFineGold)}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    align="right"
                                    style={{ paddingRight: 27 }}
                                  >
                                    -
                                  </TableCell>
                                </>
                              )}
                              {/* <TableCell className={classes.tableRowPad}>
                            {Config.numWithComma(row.totalAmount)}
                          </TableCell> */}
                              <TableCell
                                className={classes.tableRowPad}
                                align="right"
                                width="70px"
                              ></TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                    <TableFooter>
                      <TableRow style={{ backgroundColor: "#d1d8f5" }}>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ fontWeight: "600", fontSize: "16px" }}
                        >
                          Total
                        </TableCell>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ fontWeight: "700" }}
                        ></TableCell>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ fontWeight: "700" }}
                        ></TableCell>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{
                            fontWeight: "700",
                            fontSize: "16px",
                            textAlign: "right",
                          }}
                        >
                          {Config.numWithComma(getTotalOfDebit())}
                        </TableCell>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{
                            fontWeight: "700",
                            fontSize: "16px",
                            textAlign: "right",
                            paddingRight: 27,
                          }}
                        >
                          {Config.numWithComma(getTotalOfCredit())}
                        </TableCell>
                        {/* <TableCell
                          className={classes.tableRowPad}
                          style={{ fontWeight: "600", fontSize:"16px", textAlign: "right" }}
                        >
                          {Config.numWithComma(HelperFunc.getTotalOfFieldNoDecimal(
                            apiData,
                            "totalAmount"
                          ))}
                        </TableCell> */}
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          width="70px"
                        ></TableCell>
                      </TableRow>
                      <TableRow style={{ backgroundColor: "#d1d8f5" }}>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ fontWeight: "600", fontSize: "16px" }}
                        >
                          Grand Total
                        </TableCell>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ fontWeight: "700" }}
                        ></TableCell>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ fontWeight: "700" }}
                        ></TableCell>
                        <TableCell
                          // align="center"
                          className={classes.tableRowPad}
                          style={{
                            fontWeight: "700",
                            textAlign: "center",
                            fontSize: "16px",
                            backgroundColor:
                              GrandTotal > 0 ? "#0080008a" : "#ff000073",
                          }}
                          colSpan={2}
                        >
                          {Config.numWithComma(GrandTotal)}
                        </TableCell>
                        {/* <TableCell
                          align="left"
                          className={classes.tableRowPad}
                        >
                        </TableCell> */}
                        {/* <TableCell
                          className={classes.tableRowPad}
                          style={{ fontWeight: "600", fontSize:"16px", textAlign: "right" }}
                        >
                          {Config.numWithComma(HelperFunc.getTotalOfFieldNoDecimal(
                            apiData,
                            "totalAmount"
                          ))}
                        </TableCell> */}
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          width="70px"
                        ></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                  <div>
                    <Table
                      id="exportPdf"
                      className={classes.table}
                      style={{ display: "none" }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            className={classes.pdftableRowPad}
                            colSpan={3}
                            align="center"
                          ></TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            colSpan={5}
                            align="center"
                          >
                            Receive
                          </TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            colSpan={5}
                            align="center"
                          >
                            Issue
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            className={classes.pdftableRowPad}
                            width={90}
                          >
                            Date
                          </TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            width={90}
                          ></TableCell>
                          {/* <TableCell className={classes.pdftableRowPad} width="17%">
                          Customer Name
                        </TableCell> */}
                          <TableCell
                            className={classes.pdftableRowPad}
                            width="14%"
                          >
                            Particulars
                          </TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            width={80}
                            align="right"
                          >
                            Gwt
                          </TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            width={80}
                            align="right"
                          >
                            T
                          </TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            width={80}
                            align="right"
                          >
                            W
                          </TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            width={80}
                            align="right"
                          >
                            Fine
                          </TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            width={80}
                            align="right"
                          >
                            Amnt
                          </TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            width={80}
                            align="right"
                          >
                            Gwt
                          </TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            width={80}
                            align="right"
                          >
                            T
                          </TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            width={80}
                            align="right"
                          >
                            W
                          </TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            width={80}
                            align="right"
                          >
                            Fine
                          </TableCell>
                          <TableCell
                            className={clsx(
                              classes.pdftableRowPad,
                              "textright"
                            )}
                            width={80}
                            align="right"
                          >
                            Amnt
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {apiData
                          .sort((a, b) => {
                            const dateA = new Date(
                              b.purchase_voucher_create_date
                            );
                            const dateB = new Date(
                              a.purchase_voucher_create_date
                            );
                            const voucherDateA = new Date(
                              a.purchase_voucher_create_date
                            );
                            const voucherDateB = new Date(
                              b.purchase_voucher_create_date
                            );

                            if (dateB - dateA !== 0) {
                              return dateB - dateA;
                            }
                            return voucherDateA - voucherDateB;
                          })
                          .map((row) => {
                            console.log(row);
                            return row.ChainJobWorkArticiaIssueOrder
                              ? row.ChainJobWorkArticiaIssueOrder.map(
                                  (data, idx) => {
                                    console.log(data);
                                    return (
                                      <TableRow key={idx}>
                                        <TableCell
                                          align="left"
                                          className={classes.pdftableRowPad}
                                        >
                                          {/* {moment( */}
                                          {
                                            row.purchase_voucher_create_date_format
                                          }
                                          {/* ).format("YYYY-MM-DD")} */}
                                          {/* {moment
                                            .utc(
                                              row.purchase_voucher_create_date
                                            )
                                            .local()
                                            .format("DD-MM-YYYY")} */}
                                        </TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                        >
                                          ISS
                                          {/* {row.voucher_no} */}
                                        </TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width="20%"
                                        >
                                          {data.description}
                                          {/* Particulars */}
                                        </TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        ></TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        ></TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        ></TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        ></TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        ></TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        >
                                          {data.gross_weight}
                                          {/* Gwt */}
                                        </TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        >
                                          {data.purity}
                                          {/* T + W */}
                                        </TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        >
                                          {parseFloat(data.wastage).toFixed(2)}
                                          {/* T + W */}
                                        </TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        >
                                          {parseFloat(data.finegold).toFixed(3)}
                                          {/* Fine */}
                                        </TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        >
                                          {Config.numWithComma(
                                            parseFloat(data.amount).toFixed(2)
                                          )}
                                          {/* Amnt */}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  }
                                )
                              : row.ChainJobWorkArticianIssueOrder.map(
                                  (data, idx) => {
                                    console.log(data);
                                    return (
                                      <TableRow key={idx}>
                                        <TableCell
                                          align="left"
                                          className={classes.pdftableRowPad}
                                        >
                                          {/* {moment
                                            .utc( */}
                                          {
                                            row.purchase_voucher_create_date_format
                                          }
                                          {/* )
                                            .local()
                                            .format("YYYY-MM-DD")} */}
                                        </TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                        >
                                          REC
                                          {/* {row.voucher_no} */}
                                        </TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width="20%"
                                        >
                                          {data.description}
                                          {/* Particulars */}
                                        </TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        >
                                          {Config.numWithComma(
                                            data.gross_weight
                                          )}
                                          {/* Gwt */}
                                        </TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        >
                                          {data.purity}
                                          {/* T + W */}
                                        </TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        >
                                          {parseFloat(data.wastage).toFixed(2)}
                                          {/* T + W */}
                                        </TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        >
                                          {parseFloat(data.finegold).toFixed(3)}
                                          {/* Fine */}
                                        </TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        >
                                          {Config.numWithComma(
                                            parseFloat(data.amount).toFixed(2)
                                          )}
                                          {/* Amnt */}
                                        </TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        ></TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        ></TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        ></TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        ></TableCell>
                                        <TableCell
                                          className={classes.pdftableRowPad}
                                          width={70}
                                          align="right"
                                        ></TableCell>
                                      </TableRow>
                                    );
                                  }
                                );
                          })}
                      </TableBody>
                      <TableFooter>
                        <TableRow style={{ backgroundColor: "#d1d8f5" }}>
                          <TableCell
                            align="left"
                            className={classes.pdftableRowPad}
                            style={{ fontWeight: "600", fontSize: "16px" }}
                          >
                            Total
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.pdftableRowPad}
                            style={{ fontWeight: "700" }}
                          ></TableCell>
                          <TableCell
                            align="left"
                            className={classes.pdftableRowPad}
                            style={{ fontWeight: "700" }}
                          ></TableCell>
                          <TableCell
                            align="left"
                            className={classes.pdftableRowPad}
                            style={{ fontWeight: "700" }}
                          ></TableCell>
                          <TableCell
                            align="left"
                            className={classes.pdftableRowPad}
                            style={{ fontWeight: "700" }}
                          ></TableCell>
                          <TableCell
                            align="left"
                            className={classes.pdftableRowPad}
                            style={{ fontWeight: "700" }}
                          ></TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            align="right"
                          >
                            <b>
                              {Config.numWithComma(
                                parseFloat(
                                  pdfTotalData.returnFineTotal
                                ).toFixed(3)
                              )}
                            </b>
                          </TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            align="right"
                          >
                            <b>
                              {Config.numWithComma(
                                parseFloat(
                                  pdfTotalData.returnAmountTotal
                                ).toFixed(2)
                              )}
                            </b>
                          </TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            align="right"
                          ></TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            align="right"
                          ></TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            align="right"
                          ></TableCell>
                          <TableCell
                            align="right"
                            className={classes.pdftableRowPad}
                          >
                            <b>
                              {Config.numWithComma(
                                parseFloat(pdfTotalData.issueFineTotal).toFixed(
                                  3
                                )
                              )}
                            </b>
                          </TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            align="right"
                          >
                            <b>
                              {Config.numWithComma(
                                parseFloat(
                                  pdfTotalData.issueAmountTotal
                                ).toFixed(2)
                              )}
                            </b>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            align="left"
                            className={classes.pdftableRowPad}
                            colSpan={2}
                            style={{ fontWeight: "600", fontSize: "16px" }}
                          >
                            Closing Balance
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.pdftableRowPad}
                            style={{ fontWeight: "700" }}
                          ></TableCell>
                          <TableCell
                            align="left"
                            className={classes.pdftableRowPad}
                            style={{ fontWeight: "700" }}
                          ></TableCell>
                          <TableCell
                            align="left"
                            className={classes.pdftableRowPad}
                            style={{ fontWeight: "700" }}
                          ></TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            align="right"
                          ></TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            align="right"
                          ></TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            align="right"
                          ></TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            align="right"
                          ></TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            align="right"
                          ></TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            align="right"
                          ></TableCell>
                          <TableCell
                            align="right"
                            className={classes.pdftableRowPad}
                          ></TableCell>
                          <TableCell
                            className={classes.pdftableRowPad}
                            align="right"
                          >
                            <b>{Config.numWithComma(GrandTotal)}</b>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default JobWorChainkStockStatementRetailer;

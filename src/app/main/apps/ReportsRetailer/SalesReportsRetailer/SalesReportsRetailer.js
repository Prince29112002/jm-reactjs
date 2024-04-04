import React, { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import clsx from "clsx";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { FuseAnimate } from "@fuse";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import Select, { createFilter } from "react-select";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
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
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {},
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
  tableFooter: {
    padding: 7,
    backgroundColor: "#E3E3E3",
  },
}));
const SalesReportsRetailer = (props) => {
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
  const [totalFineGold, settotalFineGold] = useState("");
  const [totalRate, settotalRate] = useState("");
  const [invoiceAmount, settotalInvoiceAmount] = useState("");
  const [CardCash, settotalCardCash] = useState("");
  const [Cash, settotalCash] = useState("");
  const [ChequeCash, settotalChequeCash] = useState("");
  const [OnlineCash, settotalOnlineCash] = useState("");

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");
  const { selectedDepartment } = appContext;

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
  }, []);

  const dispatch = useDispatch();
  useEffect(() => {
    getVendordata();
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
      .get(Config.getCommonUrl() + "retailerProduct/api/clientRet/listing")
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
          api: "retailerProduct/api/clientRet/listing",
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
          console.log(response.data.data);
          const data = response?.data?.data;
          if (data === undefined) {
            setApiData([]);
            setLoading(false);
            settotalFineGold(0.0);
            settotalRate(0.0);
            settotalInvoiceAmount(0.0);
            settotalCardCash(0.0);
            settotalCash(0.0);
            settotalChequeCash(0.0);
            settotalOnlineCash(0.0);
            dispatch(
              Actions.showMessage({ message: "No Data", variant: "error" })
            );
          } else {
            setApiData(data);
            setGraphData(response.data.GraphData);
            let totalfinegold = HelperFunc.getTotalOfField(
              data,
              "totalFineGold"
            );
            settotalFineGold(parseFloat(totalfinegold).toFixed(3));
            let totalrate = HelperFunc.getTotalOfField(data, "rate");
            settotalRate(parseFloat(totalrate).toFixed(3));
            let totalinvoiceamount = HelperFunc.getTotalOfField(
              data,
              "total_invoice_amount"
            );
            settotalInvoiceAmount(parseFloat(totalinvoiceamount).toFixed(3));
            let totalcardcash = HelperFunc.getTotalOfField(data, "card");
            settotalCardCash(parseFloat(totalcardcash).toFixed(3));
            let totalcash = HelperFunc.getTotalOfField(data, "cash");
            settotalCash(parseFloat(totalcash).toFixed(3));
            let totalchequecash = HelperFunc.getTotalOfField(data, "cheque");
            settotalChequeCash(parseFloat(totalchequecash).toFixed(3));
            let totalonlinecash = HelperFunc.getTotalOfField(data, "online");
            settotalOnlineCash(parseFloat(totalonlinecash).toFixed(3));
            setLoading(false);
          }
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
      "retailerProduct/api/reports/totalsales?department_id=" +
      selectedDepartment.value.split("-")[1];

    if (selectedVendor !== "") {
      var venClient = selectedVendor.value;
      var isVendor = 2;
      url = url + "&client=" + venClient + "&is_vendor_client=" + isVendor;
    }

    if (
      moment(new Date(fromDate)).format("YYYY-MM-DD") >
      moment(new Date(toDate)).format("YYYY-MM-DD")
    ) {
      setToDtErr("Enter valid to date!");

      console.log(fromDate, toDate, "toDatetoDatetoDate");
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
    getMetalpurchases(
      "retailerProduct/api/reports/totalsales?department_id=" +
        selectedDepartment.value.split("-")[1]
    );
  }

  const exportToExcel = (type, fn, dl) => {
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
      dispatch(
        Actions.showMessage({
          message: "Can not Export Empty Data",
          variant: "error",
        })
      );
    }
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
              <Grid item xs={9} sm={9} md={8} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Sales Reports
                  </Typography>
                </FuseAnimate>
              </Grid>
            </Grid>

            {/* <div style={{ textAlign: "right" }} className="mr-16">
              <label style={{ display: "contents" }}> Search : </label>
              <Search
                className={classes.searchBox}
                onSearch={onSearchHandler}
              />
            </div> */}
            <div className="main-div-alll">
              {/* {loading && <Loader />} */}

              <Grid container spacing={2} alignItems="center">
                <Grid item lg={3} md={4} sm={12} xs={12}>
                  <p style={{ paddingBottom: "5px" }}>Party Name</p>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={vendorData.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.client_Name,
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
                </Grid>
              </Grid>
              {apiData.length === 0 ? (
                ""
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="35%"
                  maxHeight="350px"
                  minHeight="350px"
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
                    <Bar dataKey="Sales" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div className="mt-16 department-tbl-mt-dv">
                {/* <p>Some content or children or something.</p> */}
                {loading && <Loader style={{ height: "100px" }} />}
                <Paper
                  className={clsx(
                    classes.tabroot,
                    "table-responsive metalepurchase-tabel-dv repairedissue-table"
                  )}
                  style={{ height: "auto" }}
                >
                  <Table className={classes.table} id="tbl_exporttable_to_xls">
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
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
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
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          Total Fine
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          Fine Rate
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ textAlign: "right", width: "125px" }}
                        >
                          Amount
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "35px" }}
                        ></TableCell>

                        {/* <TableCell className={classes.tableRowPad} align="left">
                          Action
                        </TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiData.map((row) => (
                        <TableRow key={row.voucher_no}>
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
                            {row.is_vendor_client === 2
                              ? row.Client.client_Name
                              : row.Client.client_Name}
                          </TableCell>
                          <TableCell
                            align="right"
                            className={classes.tableRowPad}
                          >
                            {Config.numWithComma(
                              parseFloat(row.card).toFixed(3)
                            )}
                          </TableCell>
                          <TableCell
                            align="right"
                            className={classes.tableRowPad}
                          >
                            {Config.numWithComma(
                              parseFloat(row.cash).toFixed(3)
                            )}
                          </TableCell>
                          <TableCell
                            align="right"
                            className={classes.tableRowPad}
                          >
                            {Config.numWithComma(
                              parseFloat(row.cheque).toFixed(3)
                            )}
                          </TableCell>
                          <TableCell
                            align="right"
                            className={classes.tableRowPad}
                          >
                            {Config.numWithComma(
                              parseFloat(row.online).toFixed(3)
                            )}
                          </TableCell>
                          <TableCell
                            align="right"
                            className={classes.tableRowPad}
                          >
                            {Config.numWithComma(
                              parseFloat(row.totalFineGold).toFixed(3)
                            )}
                          </TableCell>

                          <TableCell
                            align="right"
                            className={classes.tableRowPad}
                          >
                            {Config.numWithComma(row.rate)}
                          </TableCell>

                          <TableCell
                            align="right"
                            className={classes.tableRowPad}
                            style={{ textAlign: "right" }}
                          >
                            {Config.numWithComma(row.total_invoice_amount)}
                          </TableCell>
                          <TableCell
                            align="right"
                            className={classes.tableRowPad}
                            style={{ width: "35px" }}
                          ></TableCell>
                        </TableRow>
                      ))}
                      <TableRow style={{ backgroundColor: "#d1d8f5" }}>
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
                          style={{ fontWeight: "700" }}
                        >
                          {Config.numWithComma(CardCash)}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ fontWeight: "700" }}
                        >
                          {Config.numWithComma(Cash)}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ fontWeight: "700" }}
                        >
                          {Config.numWithComma(ChequeCash)}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ fontWeight: "700" }}
                        >
                          {Config.numWithComma(OnlineCash)}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ fontWeight: "700" }}
                        >
                          {Config.numWithComma(totalFineGold)}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ fontWeight: "700" }}
                        >
                          {Config.numWithComma(totalRate)}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ fontWeight: "700", textAlign: "right" }}
                        >
                          {Config.numWithComma(invoiceAmount)}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "35px" }}
                        ></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default SalesReportsRetailer;

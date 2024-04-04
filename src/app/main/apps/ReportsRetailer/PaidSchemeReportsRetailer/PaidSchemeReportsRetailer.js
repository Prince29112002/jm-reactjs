import React, { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import clsx from "clsx";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { FuseAnimate } from "@fuse";
import {
  Button,
  Grid,
  TableFooter,
  TablePagination,
  TextField,
  Typography,
} from "@material-ui/core";
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
    minWidth: 750,
  },
  tableRowPad: {
    padding: 7,
  },
  tableFooter: {
    padding: 7,
    backgroundColor: "#E3E3E3",
  },
}));
const PaidSchemeReportsRetailer = (props) => {
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
  console.log(apiData);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [count, setCount] = useState(0);

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");
  const [selectedData, setSelectedData] = useState("");
  const [SelectedDatalabel, setSelectedDatalabel] = useState("");
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

  const totalAmount = apiData.reduce((accumulator, currentObject) => {
    // Parse the "amount" string as a float and add it to the accumulator
    return accumulator + parseFloat(currentObject.amount);
  }, 0); //

  console.log(totalAmount.toFixed(2));

  function handlePartyChange(value) {
    setSelectedVendor(value);
  }

  function handleGoldSilverChange(value) {
    console.log(value);
    setSelectedData(value.value);
    setSelectedDatalabel(value);
  }

  function getVendordata() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/scheme/list/user")
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
          api: "retailerProduct/api/scheme/list/user",
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
          setCount(Number(response.data.totalRecord));
          // if (data === undefined) {
          //   setApiData([]);
          //   setLoading(false);
          //   dispatch(
          //     Actions.showMessage({ message: "No Data", variant: "error" })
          //   );
          // } else {
          //   setApiData(data);
          //   setLoading(false);
          // }
          console.log(data);
          if (apiData.length === 0) {
            console.log("if");
            setApiData(data);
          } else {
            setApiData((apiData) => [...apiData, ...data]);
          }
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
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: url });
        console.log(error);
      });
  }

  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 20 > apiData.length) {
      setFilters(Number(newPage + 1));
    }
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    // var today = moment().format("YYYY-MM-DD"); //new Date();

    if (name === "fromDate") {
      setFromDate(value);
      // let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      // let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      // if (dateVal <= today && minDateVal < dateVal) {
      //   setFromDtErr("");
      // } else {
      //   setFromDtErr("Enter valid date");
      // }
    } else if (name === "toDate") {
      setToDate(value);
      // let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      // let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      // if (dateVal <= today && minDateVal < dateVal) {
      //   setToDtErr("");
      // } else {
      //   setToDtErr("Enter valid date");
      // }
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

  function setFilters(tempPageNo) {
    let url = `retailerProduct/api/scheme/list/report?filter=${1}&is_paid=${1}`;

    if (selectedData !== "") {
      var Data = selectedData;
      console.log(Data);
      url = url + "&is_gold_silver=" + Data;
    }

    if (selectedVendor !== "") {
      var venClient = selectedVendor.label;
      console.log(venClient);
      url = url + "&name=" + venClient;
    }

    if (page !== "") {
      if (!tempPageNo) {
        url = url + "&page=" + 1;
      } else {
        url = url + "&page=" + tempPageNo;
      }
    }

    if (
      moment(new Date(fromDate)).format("YYYY-MM-DD") >
      moment(new Date(toDate)).format("YYYY-MM-DD")
    ) {
      setToDtErr("Enter valid to date!");

      return;
    }

    if (fromDate !== "" || toDate !== "") {
      if (fromDtValidation() && toDtValidation()) {
        if (selectedVendor !== "") {
          url = url + "&from_date=" + fromDate + "&to_date=" + toDate;
        } else {
          // url = url + "&from_date=" + fromDate + "&to_date=" + toDate;
        }
      } else {
        console.log("Date return");
        return;
      }
    }

    // getMetalpurchases(url);
    if (!tempPageNo) {
      console.log("innnnnnnnnnnnnnn444444");
      getMetalpurchases(url);
    } else {
      if (count > apiData.length) {
        getMetalpurchases(url);
      }
    }
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
    setApiData([]);
    setSelectedVendor("");
    setFromDate("");
    setFromDtErr("");
    setToDate("");
    setToDtErr("");
    setSelectedData("");

    // call api without filter
    getMetalpurchases(
      `retailerProduct/api/scheme/list/report?filter=${1}&is_paid=${1}`
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
        : XLSX.writeFile(wb, fn || `Paid Scheme Report.${type || "xlsx"}`);
    } else {
      dispatch(
        Actions.showMessage({
          message: "Can not Export Empty Data",
          variant: "error",
        })
      );
    }
  };

  const GoldsilverData = [
    { id: 0, type: "Gold" },
    { id: 1, type: "Silver" },
  ];

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
                    Paid Scheme Report
                  </Typography>
                </FuseAnimate>
              </Grid>
            </Grid>

            <div className="main-div-alll">
              {/* {loading && <Loader />} */}

              <Grid container spacing={2} alignItems="center">
                <Grid item lg={2} md={2} sm={12} xs={12}>
                  <p style={{ paddingBottom: "5px" }}>Gold/Silver</p>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={GoldsilverData.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.type,
                    }))}
                    // components={components}
                    value={SelectedDatalabel}
                    onChange={handleGoldSilverChange}
                    autoFocus
                    blurInputOnSelect
                    tabSelectsValue={false}
                    placeholder="Gold/Silver"
                  />
                </Grid>

                <Grid item lg={2} md={2} sm={12} xs={12}>
                  <p style={{ paddingBottom: "5px" }}>Customer name</p>
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
                    placeholder="Customer name"
                  />
                </Grid>

                <Grid item lg={2} md={2} sm={6} xs={12}>
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
                    format="YYYY-MM-DD"
                    // inputProps={{
                    //   max: moment().format("YYYY-MM-DD"),
                    // }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid item lg={2} md={2} sm={6} xs={12}>
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
                    format="YYYY-MM-DD"
                    // inputProps={{
                    //   max: moment().format("YYYY-MM-DD"),
                    // }}
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
                      setApiData([]);
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

              <div className="mt-16 department-tbl-mt-dv">
                {loading && <Loader style={{ height: "100px" }} />}
                <Paper
                  className={clsx(
                    classes.tabroot,
                    "table-responsive repairedissue-table"
                  )}
                  style={{ maxHeight: "calc(100vh - 387px)" }}
                >
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad} align="left">
                          Sr no
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Gold/Silver
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Document no.
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Due Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Notes
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          EMI Payment
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Paid Date
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiData.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className={classes.tableRowPad}
                            style={{ textAlign: "center" }}
                          >
                            No data found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        apiData
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, i) => (
                            <TableRow key={row.voucher_no || i}>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {page * rowsPerPage + i + 1}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.SchemeDetails?.is_gold_silver === 0
                                  ? "Gold"
                                  : "silver"}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.SchemeDetails?.doc_number}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.SchemeDetails?.ClientDetails?.client_Name}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {moment
                                  .utc(row.due_date)
                                  .local()
                                  .format("DD-MM-YYYY")}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.SchemeDetails?.notes}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableRowPad}
                              >
                                {parseFloat(row.amount).toFixed(2)}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                                style={{ paddingRight: "18px" }}
                              >
                                {row.payment_date
                                  ? moment
                                      .utc(row.payment_date)
                                      .local()
                                      .format("DD-MM-YYYY")
                                  : ""}
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow style={{ backgroundColor: "#ebeefb" }}>
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
                          align="left"
                          style={{ fontWeight: "700" }}
                        ></TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ fontWeight: "700" }}
                        >
                          {Config.numWithComma(totalAmount)}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="left"
                          style={{ fontWeight: "700" }}
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
                        <TableCell className={classes.tableRowPad} align="left">
                          Sr no
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Gold/Silver
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Document no.
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Due Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Notes
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          EMI Payment
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Paid Date
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiData.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className={classes.tableRowPad}
                            style={{ textAlign: "center" }}
                          >
                            No data found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        apiData
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, i) => (
                            <TableRow key={row.voucher_no}>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {page * rowsPerPage + i + 1}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.SchemeDetails?.is_gold_silver === 0
                                  ? "Gold"
                                  : "silver"}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.SchemeDetails?.doc_number}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.SchemeDetails?.ClientDetails?.client_Name}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {moment
                                  .utc(row.due_date)
                                  .local()
                                  .format("YYYY-MM-DD")}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.SchemeDetails?.notes}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableRowPad}
                              >
                                {parseFloat(row.amount).toFixed(2)}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                                style={{ paddingRight: "18px" }}
                              >
                                {row.payment_date
                                  ? moment
                                      .utc(row.payment_date)
                                      .local()
                                      .format("YYYY-MM-DD")
                                  : ""}
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                      <TableRow style={{ backgroundColor: "#ebeefb" }}>
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
                          align="left"
                          style={{ fontWeight: "700" }}
                        ></TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                          style={{ fontWeight: "700" }}
                        >
                          {Config.numWithComma(totalAmount)}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="left"
                          style={{ fontWeight: "700" }}
                        ></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
                <TablePagination
                  labelRowsPerPage=""
                  component="div"
                  count={count}
                  rowsPerPage={20}
                  page={page}
                  backIconButtonProps={{
                    "aria-label": "Previous Page",
                  }}
                  nextIconButtonProps={{
                    "aria-label": "Next Page",
                  }}
                  onPageChange={handleChangePage}
                />
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default PaidSchemeReportsRetailer;

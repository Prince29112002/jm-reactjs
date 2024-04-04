import React, { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { FuseAnimate } from "@fuse";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from 'clsx';
import AppContext from "app/AppContext";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import Select, { createFilter } from "react-select";
import * as XLSX from "xlsx";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  button: {
    // margin: 5,
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
    minWidth: 1000,
  },
  tableRowPad: {
    padding: 7,
  },
  filterBtn: {
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
    marginBlock: "3px",
  },
  tab: {
    padding: 0,
    minWidth: "auto",
    marginInline: 10,
    textTransform: "uppercase",
    zIndex: 9,
    minHeight: "40px",
    color: "#415BD4"
  },
}));
const UnpaidSchemeReports = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const appContext = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [unpaidSchemeReportData, setUnpaidSchemeReportData] = useState([]);

  // for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [count, setCount] = useState(0);

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");
  const [fromDate, setFromDate] = useState(
    moment().subtract(1, "months").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [vendorData, setVendorData] = useState([]);
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
    NavbarSetting("Reports-Retailer", dispatch);
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    //eslint-disable-next-line
    if (selectedDepartment !== "") {
      setFilters();
    }
  }, [selectedDepartment]);

  const totalAmount = unpaidSchemeReportData.reduce((accumulator, currentObject) => {
    // Parse the "amount" string as a float and add it to the accumulator
    return accumulator + parseFloat(currentObject.amount);
  }, 0); //

  console.log(totalAmount.toFixed(2));

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

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("YYYY-MM-DD"); //new Date();

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

  function handleGoldSilverChange(value) {
    console.log(value);
    setSelectedData(value.value);
    setSelectedDatalabel(value);
  }

  const GoldsilverData = [
    { id: 0, type: 'Gold' },
    { id: 1, type: 'Silver' },
  ];

  function setFilters(tempPageNo) {
    let url = `retailerProduct/api/scheme/list/report?filter=${0}&is_paid=${0}`;

    if (selectedVendor !== "") {
      var venClient = selectedVendor.label;
      console.log(venClient);
      url = url + "&name=" + venClient;
    }

    if (selectedData !== "") {
      var Data = selectedData;
      console.log(Data);
      url = url + "&is_gold_silver=" + Data;
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

      console.log(fromDate, toDate, "toDatetoDatetoDate");
      return;
    }

    if (fromDate !== "" || toDate !== "") {
      if (fromDtValidation() && toDtValidation()) {
        url = url + "&from_date=" + fromDate + "&to_date=" + toDate;
      } else {
        console.log("Date return");
        return;
      }
    }
    if (!tempPageNo) {
      getUnpaidSchemeReportData(url);
    } else {
      if (count > unpaidSchemeReportData.length) {
        getUnpaidSchemeReportData(url);
      }
    }
  }

  function resetFilters() {
    setUnpaidSchemeReportData([]);
    setSelectedVendor("");
    setFromDate("");
    setFromDtErr("");
    setToDate("");
    setToDtErr("");
    // setSelectedCompany("");
    // setClient(false);
    // call api without filter
    
    getUnpaidSchemeReportData(
      `retailerProduct/api/scheme/list/report?filter=${0}&is_paid=${0}`
    );
  }
  
  function getUnpaidSchemeReportData(url) {
    // setUnpaidSchemeReportData([]);
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() +
          url
      )
      .then(function (response) {
        if (response.data.success === true) {
          const data = response.data.data
          setCount(Number(response.data.totalRecord));
          if (unpaidSchemeReportData.length === 0) {
            console.log("if");
            setUnpaidSchemeReportData(data);
          } else {
            setUnpaidSchemeReportData((unpaidSchemeReportData) => [...unpaidSchemeReportData, ...data]);
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
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: url,
        });
      });
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

  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 20 > unpaidSchemeReportData.length) {
      setFilters(Number(newPage + 1));
    }
  }
 
  function handlePartyChange(value) {
    setSelectedVendor(value);
  }

  useEffect(() => {
    getVendordata();
    //eslint-disable-next-line
  }, []);

  const exportToExcel = (type, fn, dl) => {
    if (unpaidSchemeReportData.length > 0) {
      const wb = XLSX.utils.book_new();

      // Export the first table
      const tbl1 = document.getElementById("tbl_exporttable_to_xls");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(
          wb,
          fn || `Unpaid Scheme Report.${type || "xlsx"}`
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
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0  makeStyles-root-1">
            <Grid
             container
             alignItems="center"
             style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
            >
              <Grid item xs={9} sm={9} md={8} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Unpaid Scheme Report
                  </Typography>
                </FuseAnimate>
              </Grid>
            </Grid>
            <div className="main-div-alll">
              <Grid container spacing={2}>
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
                  <p style={{ paddingBottom: "5px" }}>Customer Name</p>
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
                    placeholder="Customer Name"
                  />
                </Grid>

              <Grid item lg={2} md={2} sm={6} xs={12}>
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
                  <p style={{ paddingBottom: "3px" }}>To Date</p>
                  <TextField
                    placeholder="To Date"
                    name="toDate"
                    value={toDate}
                    error={toDtErr.length > 0 ? true : false}
                    helperText={toDtErr}
                    type="date"
                    onChange={(e) => handleInputChange(e)}
                    // onKeyDown={(e) => e.preventDefault()}
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
                      setUnpaidSchemeReportData([])
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
              {/* <Grid container style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10}}>
                <Grid item>
                <Tabs
                    value={showGoldSilverVarient}
                    onChange={handleChangeVarient}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab label="Gold" className={classes.tab} value={1} />
                    <Tab label="Silver" className={classes.tab} value={2} />
                  </Tabs>
                </Grid>
              </Grid> */}

              <Paper style={{ marginTop: "16px", overflowY: "auto", maxHeight: "calc(100vh - 332px)"}}>

                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad}>Sr No.</TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Gold/Silver
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                      Document No.
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                      Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                      Due Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Notes
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        EMI Payment
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {unpaidSchemeReportData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className={classes.tableRowPad}
                          style={{ textAlign: "center" }}
                        >
                          No data found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      unpaidSchemeReportData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((data, i) => (
                        <TableRow key={i}>
                          <TableCell className={classes.tableRowPad}>
                            {page * rowsPerPage + i + 1}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                          {data.SchemeDetails?.is_gold_silver === 0 ? "Gold" :"silver"}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                          {data.SchemeDetails?.doc_number}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                          {data.SchemeDetails?.ClientDetails?.client_Name}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                          {moment.utc(data.due_date).local().format("DD-MM-YYYY")}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                              {data.SchemeDetails?.notes ? data.SchemeDetails?.notes : "-"}
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="right" style={{paddingRight:"26px"}}>
                          {parseFloat(data.amount).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow style={{ backgroundColor: "#ebeefb" }}>
                      <TableCell className={classes.tableRowPad} colSpan={2} 
                      style={{ fontWeight: "800" }}>
                        Total
                      </TableCell>

                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}  align="right" style={{ fontWeight: "800", paddingRight:"26px"}}>
                      {Config.numWithComma(totalAmount)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>

                <Table className={classes.table} id="tbl_exporttable_to_xls" style={{display:"none"}}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad}>Sr No.</TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Gold/Silver
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                      Document No.
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                      Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                      Due Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Notes
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        EMI Payment
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {unpaidSchemeReportData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className={classes.tableRowPad}
                          style={{ textAlign: "center" }}
                        >
                          No data found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      unpaidSchemeReportData
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((data, i) => (
                        <TableRow key={i}>
                          <TableCell className={classes.tableRowPad}>
                            {page * rowsPerPage + i + 1}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                          {data.SchemeDetails?.is_gold_silver === 0 ? "Gold" :"silver"}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                          {data.SchemeDetails?.doc_number}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                          {data.SchemeDetails?.ClientDetails?.client_Name}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                          {moment.utc(data.due_date).local().format("YYYY-MM-DD")}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                              {data.SchemeDetails?.notes ? data.SchemeDetails?.notes : "-"}
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="right">
                          {parseFloat(data.amount).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow style={{ backgroundColor: "#ebeefb" }}>
                      <TableCell className={classes.tableRowPad} colSpan={2} 
                      style={{ fontWeight: "800" }}>
                        Total
                      </TableCell>

                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}  align="right" style={{ fontWeight: "800" }}>
                      {Config.numWithComma(totalAmount)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
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
      </FuseAnimate>
    </div>
  );
};

export default UnpaidSchemeReports;

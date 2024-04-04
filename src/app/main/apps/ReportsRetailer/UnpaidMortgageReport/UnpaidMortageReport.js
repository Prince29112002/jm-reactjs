import React, { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
// import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import { FuseAnimate } from "@fuse";
// import Select, { createFilter } from "react-select";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import AppContext from "app/AppContext";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { CSVLink } from "react-csv";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import {
  FormControlLabel,
  Box,
  Button,
  Grid,
  IconButton,
  Icon,
  InputBase,
  Paper,
  Tab,
  Modal,
  Table,
  Radio,
  RadioGroup,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";
import moment from "moment";
import SearchIcon from "@material-ui/icons/Search";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  paperModal: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  paper: {
    position: "absolute",
    maxWidth: 1150,
    width: "calc(100% - 30px)",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
  },
  button: {
    margin: 5,
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
    // lineHeight: "initial",
    color: "#415BD4",
  },
  search: {
    display: "flex",
    border: "1px solid #cccccc",
    height: "38px",
    width: "340px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
    marginLeft: "auto",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "340px",
    height: "37px",
    color: "#CCCCCC",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter",
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
const UnpaidMortageReport = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [modalStyle] = React.useState(getModalStyle);
  const appContext = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [reportMortage, setReportMortage] = useState([]);

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
  const [showGoldSilverVarient, setShowGoldSilverVarient] = useState(1);
  const [searchData, setSearchData] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [readOneData, setReadOneData] = useState([]);
  const [imgFiles, setImgFile] = useState([]);
  const [mortgagePayments, setMortgagePayments] = useState([]);
  const [mortagePartialEntry, setMortagePartialEntry] = useState([]);
  const [productData, setProductData] = useState([]);
  const [totalSilverWeight, setTotalSilverWeight] = useState("");
  const [totalGoldWeight, setTotalGoldWeight] = useState("");
  const csvLink = React.useRef(null);
  const [csvData, setCSVData] = useState([])

  useEffect(() => {
    NavbarSetting("Reports-Retailer", dispatch);
  }, []);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   setFilters();
  // }, [showGoldSilverVarient]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // if (searchData) {
      setReportMortage([]);
      setCount(0);
      setPage(0);
      setFilters();
      // }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchData, showGoldSilverVarient]);

  function getMortageReportData(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          const data = response.data.data;
          setCount(Number(response.data.totalRecord));
          if (reportMortage.length === 0) {
            console.log("if");
            setReportMortage(data);
          } else {
            setReportMortage((reportMortage) => [...reportMortage, ...data]);
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

  function setFilters(tempPageNo) {
    // setReportMortage([])
    // setCount(0);
    // setPage(0);
    let url = `retailerProduct/api/mortage/list/unpaid?name=&is_gold_silver=${showGoldSilverVarient}&search=${searchData}`;

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
      getMortageReportData(url);
    } else {
      if (count > reportMortage.length) {
        getMortageReportData(url);
      }
    }
  }

  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 20 > reportMortage.length) {
      setFilters(Number(newPage + 1));
    }
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

  function resetFilters() {
    setFromDate("");
    setFromDtErr("");
    setToDate("");
    setToDtErr("");
    setSearchData("");
    setReportMortage([]);
    setCount(0);
    setPage(0);
    // setSelectedCompany("");
    // setClient(false);
    // call api without filter
    getMortageReportData(
      `retailerProduct/api/mortage/list/unpaid?name=&is_gold_silver=${showGoldSilverVarient}&page=1`
    );
  }
  function handleChangeVarient(event, newValue) {
    setReportMortage([]);
    setShowGoldSilverVarient(newValue);
  }

  function exportFile() {
    if (reportMortage.length > 0) {
      getCsvReportData()
    } else {
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data",variant:"error" }));
    }
  }

  function getCsvReportData() {
    setLoading(true);
    const api = `retailerProduct/api/mortage/list/unpaid?name=&is_gold_silver=${showGoldSilverVarient}&from_date=${fromDate}&to_date=${toDate}&is_download=1`
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          const data = response.data.data;
          const csvArr = []
          data.map((item)=>{
            csvArr.push({
              "Issue Date" : item.issue_date,
              "Document No." : item.doc_number,
              "Name" : item?.user_name,
              "Address" : item?.address,
              "Mobile No." : item?.mobile_number,
              "Notes": item?.notes,
              "Net WT(Gram)" : item.weight,
              "Principle Amount" : Config.numWithComma(item.principal_amount),
              "Interest (%)" : item.percentage,
              "Interest Amount" :  Config.numWithComma(
                item.remaining_interest_amount
              ),
            })
          })
          setCSVData(csvArr);
          setLoading(false);
          csvLink.current.link.click();
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

  function getMortgageDetail(clientId) {
    axios
      .get(Config.getCommonUrl() + `retailerProduct/api/mortage/${clientId}`)
      .then(function (response) {
        if (response.data.success === true) {
          setModalOpen(true);
          setReadOneData(response.data.data);
          setImgFile(response.data.data.MortgageDoc);
          setMortagePartialEntry(response.data.data.MortagePartialEntry);
          setMortgagePayments(response.data.data.MortgagePayments);
          setProductData(response.data.data.MortgageProducts);
          if (response.data.data.is_gold_silver) {
            const silverProducts = response.data.data.MortgageProducts.filter(
              (product) => product.is_gold_silver === 2
            );
            const goldProducts = response.data.data.MortgageProducts.filter(
              (product) => product.is_gold_silver === 1
            );

            const totalSilverWeights = silverProducts.reduce(
              (total, product) => total + parseFloat(product.weight),
              0
            );
            const totalGoldWeights = goldProducts.reduce(
              (total, product) => total + parseFloat(product.weight),
              0
            );

            setTotalGoldWeight(totalGoldWeights);
            setTotalSilverWeight(totalSilverWeights);
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/client/company/listing/listing/${clientId}`,
        });
      });
  }

  function handleModalClose() {
    setModalOpen(false);
    setTotalSilverWeight("");
    setTotalGoldWeight("");
  }

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
                    Unpaid Loan
                  </Typography>
                </FuseAnimate>
              </Grid>
            </Grid>
            <div className="main-div-alll">
              <Grid container spacing={2}>
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
                      setSearchData("");
                      setReportMortage([]);
                      setCount(0);
                      setPage(0);
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
                  {/* <Button
                    className={clsx(classes.filterBtn, "ml-16")}
                    variant="contained"
                    size="small"
                    aria-label="Register"
                    onClick={(event) => {
                      exportToExcel("xlsx");
                    }}
                  >
                    Export
                  </Button> */}
                </Grid>
              </Grid>
              <Grid
                container
                style={{
                  display: "flex",
                  alignItems: "center",
                  // justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <Grid item>
                  <Tabs
                    value={showGoldSilverVarient}
                    onChange={handleChangeVarient}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab label="Gold" className={classes.tab} value={1} />
                    <Tab label="Silver" className={classes.tab} value={2} />
                    <Tab label="Mix" className={classes.tab} value={3} />
                  </Tabs>
                </Grid>
                <Grid item style={{ marginLeft: "auto"}}>
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
                <Grid item>
                <Button
                    className={clsx(classes.filterBtn, "ml-16")}
                    // className="ml-2"
                    variant="contained"
                    color="primary"
                    aria-label="Register"
                    onClick={(event) => {
                      // setFilters();
                      exportFile();
                    }}
                  >
                    Export
                  </Button>
                  <CSVLink
                    data={csvData}
                    style={{ display: "none" }}
                    ref={csvLink}
                    target="_blank"
                    filename={
                      "UnPaid_Mortgage" +
                      new Date().getDate() +
                      "_" +
                      (new Date().getMonth() + 1) +
                      "_" +
                      new Date().getFullYear() +
                      ".csv"
                    }
                  >
                    Export
                  </CSVLink>
                </Grid>
              </Grid>
              <Paper style={{ marginTop: "10px", overflowY: "auto" }}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      {/* <TableCell className={classes.tableRowPad}>Sr No.</TableCell> */}
                      <TableCell className={classes.tableRowPad}>
                        Issued Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Document No.
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Address
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Mobile No.
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Notes
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Net WT(Gram)
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ textAlign: "right" }}
                      >
                        Principal Amount
                      </TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Interest (%)
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad} style={{ textAlign: "right" }}
                      >
                        Interest Amount
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ paddingRight: "20px" }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportMortage.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className={classes.tableRowPad}
                          style={{ textAlign: "center" }}
                        >
                          No Data Found
                        </TableCell>
                      </TableRow>
                    ) : (
                      reportMortage
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((data, i) => (
                          <TableRow key={i}>
                            {/* <TableCell className={classes.tableRowPad}>
                            {page * rowsPerPage + i + 1}
                          </TableCell> */}
                            <TableCell className={classes.tableRowPad}>
                              {/* {data.issue_date} */}
                              {moment(data.issue_date).format("DD-MM-YYYY")}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.doc_number}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.user_name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.address ? data.address : "-"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.mobile_number ? data.mobile_number : "-"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.notes ? data.notes : "-"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.weight}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ textAlign: "right" }}
                            >
                              {Config.numWithComma(data.principal_amount)}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.percentage}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad} style={{ textAlign: "right" }}
                            >
                              {Config.numWithComma(
                                data.remaining_interest_amount
                              )}
                            </TableCell>
                            <TableCell
                                className={classes.tableRowPad}
                                rowSpan={data.rowspans}
                                style={{paddingRight: "20px",
                                }}
                              >
                                <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    getMortgageDetail(
                                      data.mortage_id
                                        ? data.mortage_id
                                        : data.id
                                    );
                                  }}
                                >
                                  <Icon className="mr-8 view-icone">
                                    <img src={Icones.view} alt="" />
                                  </Icon>
                                </IconButton>
                              </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow style={{ backgroundColor: "#ebeefb" }}>
                      <TableCell className={classes.tableRowPad} colSpan={2}>
                        <b>Grand Total</b>
                      </TableCell>

                      {/* <TableCell className={classes.tableRowPad}></TableCell> */}
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b>
                          {HelperFunc.getTotalOfField(reportMortage, "weight")}
                        </b>
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ textAlign: "right" }}
                      >
                        <b>
                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(
                              reportMortage,
                              "principal_amount"
                            )
                          )}
                        </b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ textAlign: "right" }}
                      >
                        <b>
                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(
                              reportMortage,
                              "remaining_interest_amount"
                            )
                          )}
                        </b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>

                    </TableRow>
                  </TableFooter>
                </Table>
              </Paper>
              <TablePagination
                labelRowsPerPage=""
                component="div"
                // count={apiData.length}
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
                // onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </div>
          </div>
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
            <div
              style={modalStyle}
              className={clsx(classes.paper, "rounded-8")}
            >
              <>
                <h5 className="popup-head p-20">
                  {/* {isEdit === true
              ? "Edit Category"
              : isView
              ? "View Category"
              : "Add New Category"} */}
                  View Mortgage Details
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
                  style={{
                    overflowX: "auto",
                    maxHeight: "calc(100vh - 200px)",
                  }}
                >
                  <div style={{ padding: "30px" }}>
                    <Grid container spacing={2} alignItems="flex-end">
                      <Grid item xs={12}>
                        {/* <div style={{padding: 7, background: "#ccc", display: "inline-block", borderRadius: 10}}> */}
                        {console.log(readOneData.is_gold_silver)}
                        <Tabs
                          value={readOneData.is_gold_silver}
                          variant="scrollable"
                          scrollButtons="auto"
                        >
                          <Tab label="Gold" className={classes.tab} value={1} />
                          <Tab
                            label="Silver"
                            className={classes.tab}
                            value={2}
                          />
                          <Tab label="Mix" className={classes.tab} value={3} />
                        </Tabs>
                        {/* </div> */}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        style={{ marginTop: "15px", position: "relative" }}
                      >
                        <label className={classes.label}>Document No</label>
                        <TextField
                          name="documentnumb"
                          variant="outlined"
                          fullWidth
                          value={readOneData.doc_number}
                          disabled
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        style={{ marginTop: "15px", position: "relative" }}
                      >
                        <label className={classes.label}>Name</label>
                        <TextField
                          name="name"
                          variant="outlined"
                          fullWidth
                          value={readOneData?.MortgageUser?.name}
                          required
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>Mobile Number</label>
                        <TextField
                          name="mobilenumber"
                          variant="outlined"
                          fullWidth
                          value={readOneData?.MortgageUser?.mobile_number}
                          required
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>Address</label>
                        <TextField
                          name="address"
                          variant="outlined"
                          type="text"
                          fullWidth
                          value={readOneData?.MortgageUser?.address}
                          required
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>Issue Date</label>
                        <TextField
                          name="issue_date"
                          value={readOneData.issue_date}
                          type="date"
                          variant="outlined"
                          fullWidth
                          inputProps={{
                            max: moment().format("DD-MM-YYYY"),
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          required
                          disabled
                        />
                      </Grid>
                      {readOneData.is_gold_silver === 3 && (
                        <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <label className={classes.label}>
                                {/* {selectshowGoldSilverVarient === 1 ? "Gold" : "Silver"} */}
                                Total Gold Weight(G)
                              </label>
                              <TextField
                                name="gold_weight"
                                variant="outlined"
                                fullWidth
                                value={parseFloat(totalGoldWeight).toFixed(3)}
                                disabled
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <label className={classes.label}>
                                {/* {selectshowGoldSilverVarient === 1 ? "Gold" : "Silver"} */}
                                Total Silver Weight(G)
                              </label>
                              <TextField
                                name="gold_weight"
                                variant="outlined"
                                fullWidth
                                value={parseFloat(totalSilverWeight).toFixed(3)}
                                disabled
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>
                          {/* {selectshowGoldSilverVarient === 1 ? "Gold" : "Silver"} */}
                          Total Weight(G)
                        </label>
                        <TextField
                          name="gold_weight"
                          variant="outlined"
                          fullWidth
                          value={parseFloat(readOneData.weight).toFixed(3)}
                          required
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <div>
                          <label className={classes.label}>Issue Amount</label>
                          <TextField
                            name="issue_amount"
                            variant="outlined"
                            fullWidth
                            value={readOneData.principal_amount}
                            required
                            disabled
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <div>
                          <label className={classes.label}>
                            Customer Review
                          </label>
                          <TextField
                            name="cutomerreview"
                            variant="outlined"
                            fullWidth
                            value={readOneData?.review}
                            required
                            disabled
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>
                          Interest Percentage (%)
                        </label>
                        <TextField
                          name="percentage"
                          variant="outlined"
                          fullWidth
                          value={readOneData.percentage}
                          required
                          disabled
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        style={{ marginTop: "15px", position: "relative" }}
                      >
                        <div className="packing-slip-input height">
                          <label className={classes.label}>Note</label>
                          <TextField
                            name="notes"
                            variant="outlined"
                            fullWidth
                            value={readOneData?.notes}
                            required
                            disabled
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>Reminder Date</label>
                        <TextField
                          name="remindardate"
                          type="date"
                          variant="outlined"
                          fullWidth
                          inputProps={{
                            max: moment().format("DD-MM-YYYY"),
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={readOneData.reminder_date}
                        />
                      </Grid>
                      <Grid item xs={12} style={{ marginTop: "15px" }}>
                        <RadioGroup
                          row
                          aria-labelledby="demo-radio-buttons-group-label"
                          value={parseFloat(readOneData?.is_simple_compound)}
                          name="simpleorcompound"
                        >
                          <FormControlLabel
                            value={1}
                            disabled
                            control={<Radio />}
                            label="Simple Interest"
                          />
                          <FormControlLabel
                            value={2}
                            disabled
                            control={<Radio />}
                            label="Compound Interest (Monthly)"
                          />
                          <FormControlLabel
                            value={3}
                            disabled
                            control={<Radio />}
                            label="Compound Interest (Yearly)"
                          />
                        </RadioGroup>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      justifyContent="flex-start"
                      style={{ marginTop: 16 }}
                    >
                      <>
                        {imgFiles
                          // .filter((row) =>
                          //   /\.(gif|jpe?g|png|webp|bmp|svg)$/i.test(row.upload_file_name)
                          // )
                          .map((row, index) => {
                            console.log(row.image_file);
                            return (
                              <Grid item key={index}>
                                <div
                                  style={{
                                    padding: 10,
                                    border: "1px dashed black",
                                    borderRadius: "25px",
                                    cursor: "pointer",
                                    position: "relative",
                                  }}
                                >
                                  {console.log(row)}
                                  <img
                                    src={row.image_file}
                                    style={{
                                      width: "auto",
                                      height: "100px",
                                      marginInline: "auto",
                                      display: "block",
                                    }}
                                    alt="img"
                                    onClick={() => {
                                      // setModalView(3);
                                      // setImageUrl(row.image_file);
                                      // setImage(row.upload_file_name);
                                    }}
                                  />
                                </div>
                              </Grid>
                            );
                          })}
                      </>
                    </Grid>
                  </div>
                  {productData.length !== 0 ? (
                    <Paper
                      style={{
                        padding: "30px",
                        boxShadow: "none",
                        paddingTop: 0,
                      }}
                    >
                      <h3 style={{ marginBottom: "10px" }}>Product Details</h3>
                      <Table style={{ marginTop: 10, tableLayout: "auto" }}>
                        <TableHead style={{ position: "static" }}>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              Issue Date
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Metal Type
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Product Name
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Gross Weight
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Net Weight
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Purity
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Fine
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Rate
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              PCS
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Amount
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ paddingRight: 20, textAlign: "left" }}
                            >
                              Close Date
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {productData.map((data, index) => (
                            <TableRow
                              key={index}
                              style={{
                                backgroundColor:
                                  data.close_date !== null
                                    ? "#ffcfcf4a"
                                    : "inherit",
                              }}
                            >
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {moment(data.issue_date).format("DD-MM-YYYY")}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {data.is_gold_silver === 1 ? "Gold" : "Silver"}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {data.product_name}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {data.gross_weight
                                  ? parseFloat(data.gross_weight).toFixed(3)
                                  : "-"}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {parseFloat(data.weight).toFixed(3)}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {data.purity ? data.purity : "-"}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {data.fine ? data.fine : "-"}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {data.current_rate ? data.current_rate : "-"}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {data.pcs ? data.pcs : "-"}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {data.product_amount
                                  ? data.product_amount
                                  : "-"}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  paddingRight: 20,
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                  textAlign: "left",
                                }}
                              >
                                {data.close_date
                                  ? moment(data.close_date).format("DD-MM-YYYY")
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper>
                  ) : null}

                  <>
                    {mortgagePayments.length > 1 ? (
                      <Paper
                        style={{
                          padding: "30px",
                          boxShadow: "none",
                          paddingTop: 0,
                        }}
                      >
                        <h3 style={{ marginBottom: "10px" }}>
                          New Issue Amount
                        </h3>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
                                Date
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Amount
                              </TableCell>
                              {/* <TableCell
                                className={classes.tableRowPad}
                                style={{ textAlign: "left" }}
                              >
                                Interest
                              </TableCell> */}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {mortgagePayments
                              .filter((data) => data.is_added !== 0)
                              .map((data, i) => (
                                <TableRow key={i}>
                                  <TableCell className={classes.tableRowPad}>
                                    {moment(data.issue_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    style={{ textAlign: "left" }}
                                  >
                                    {data.amount}
                                  </TableCell>
                                  {/* <TableCell
                                  className={classes.tableRowPad}
                                  style={{ textAlign: "left" }}
                                >
                                  {data.interest}
                                </TableCell> */}
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    ) : null}
                  </>
                  <>
                    {mortagePartialEntry.length > 0 ? (
                      <Paper
                        style={{
                          padding: "30px",
                          boxShadow: "none",
                          paddingTop: 0,
                        }}
                      >
                        <h3 style={{ marginBottom: "10px" }}>
                          Partial Payments
                        </h3>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
                                Date
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Principal Amount
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Refinance Amount
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Interest
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Paid Amount
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Balance
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{ textAlign: "left" }}
                              >
                                Type
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {mortagePartialEntry
                              // .filter((data) => data.is_added !== 1)
                              .map((data, i) => (
                                <TableRow key={i}>
                                  <TableCell className={classes.tableRowPad}>
                                    {moment(data.payment_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.principal_amount}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.added_amount}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.interest}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.part_pay_amount}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.remaining_balance}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    style={{ textAlign: "left" }}
                                  >
                                    <span
                                      style={{
                                        padding: 3,
                                        borderRadius: 4,
                                        background: "#ebeefb",
                                        color:
                                          data.is_added === 1 ? "green" : "red",
                                      }}
                                    >
                                      {data.is_added === 1 ? "Added" : "Paid"}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    ) : null}
                  </>
                </Box>
              </>
            </div>
          </Modal>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default UnpaidMortageReport;

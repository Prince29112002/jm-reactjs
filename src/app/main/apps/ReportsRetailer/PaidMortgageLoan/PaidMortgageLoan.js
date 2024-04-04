import React, { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
// import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import { FuseAnimate } from "@fuse";
import { CSVLink } from "react-csv";
// import Select, { createFilter } from "react-select";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import AppContext from "app/AppContext";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import {
  Button,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Tab,
  Table,
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
const PaidMortgageLoan = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const appContext = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [reportMortage, setReportMortage] = useState([]);

  // for Pagination
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
          // const arrData = [];
          // data.map((item,index) => {
          //   const mLen = item.MortgageProducts.length;
          //   const colorId = index + 1;
          //   if(mLen > 0){
          //     item.MortgageProducts.map((entry,i)=>{
          //       if(i === 0){
          //         arrData.push({
          //           ...item,
          //           ...entry,
          //           colorId,
          //           rowId: index + 1,
          //           rowspans: mLen,
          //           ismain: true,
          //         })
          //       }else{
          //         arrData.push({
          //           ...item,
          //           ...entry,
          //           colorId,
          //         });
          //       }
          //     })
          //   }else{
          //     arrData.push({
          //       ...item,
          //       rowId: index + 1,
          //       ismain: true,
          //       colorId,
          //     });
          //   }
          // })
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

  function exportFile() {
    if (reportMortage.length > 0) {
      getCsvReportData()
    } else {
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data",variant:"error" }));
    }
  }

  function getCsvReportData() {
    setLoading(true);
    const api = `retailerProduct/api/mortage/paidMortgage/Loan?close=1&is_gold_silver=${showGoldSilverVarient}&from_date=${fromDate}&to_date=${toDate}&is_download=1`
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
              "Name" : item?.MortgageUser?.name,
              "Address" : item?.MortgageUser?.address,
              "Product Name": item.MortgageProducts.length > 0 ? item.MortgageProducts.map(product => product.product_name).join(', ') : "-",
              "Total NWT(Gram)" : item.weight,
              "Principle Amount" : Config.numWithComma(item.principal_amount),
              "Interest (%)" : item.percentage,
              "Interest Amount" : item.final_interest,
              "Close Amount" : item.close_amount,
              "Close Date" : item?.close_date,
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


  function setFilters(tempPageNo) {
    let url = `retailerProduct/api/mortage/paidMortgage/Loan?close=1&is_gold_silver=${showGoldSilverVarient}&search=${searchData}`;
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

  function handleChangeVarient(event, newValue) {
    setReportMortage([]);
    setShowGoldSilverVarient(newValue);
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
      `retailerProduct/api/mortage/paidMortgage/Loan?close=1&is_gold_silver=${showGoldSilverVarient}&page=1`
    );
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
                    Paid Mortgage Loan
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
                      "Paid_Mortgage" +
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
              <Paper style={{ marginTop: "16px", overflowY: "auto", height: "auto" }}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      {/* <TableCell className={classes.tableRowPad}>Sr No.</TableCell> */}
                      <TableCell className={classes.tableRowPad}>
                        Issue Date
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
                        Product Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Total NWT(Gram)
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ textAlign: "right" }}
                      >
                        Principle Amount
                      </TableCell>
                      <TableCell className={classes.tableRowPad} style={{ textAlign: "center" }}>
                        Interest (%)
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ textAlign: "right" }}
                      >
                        Interest Amount
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        Close Amount
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        Close Date
                      </TableCell>
                      {/* <TableCell
                        className={classes.tableRowPad}
                        style={{ paddingRight: "20px" }}
                      >
                        Total Amount
                      </TableCell> */}
                      {/* <TableCell className={classes.tableRowPad}>
                        Close Amount
                      </TableCell> */}
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
                          <TableRow key={i}  
                          // style={{
                          //   backgroundColor: data.colorId % 2 == 0
                          //       ? "#F7F8FB"
                          //       : "#FFFFFF",
                          //   border: "1px solid #F7F8FB",
                          // }}
                          >
                            {/* <TableCell className={classes.tableRowPad}>
                            {page * rowsPerPage + i + 1}
                          </TableCell> */}
                          
                              
                              <TableCell className={classes.tableRowPad} 
                                  style={{ border: "1px solid #EBEEFB" }}>
                              {/* {data.issue_date} */}
                              {moment(data.issue_date).format("DD-MM-YYYY")}
                            </TableCell>
                            <TableCell className={classes.tableRowPad} 
                                  style={{ border: "1px solid #EBEEFB" }}>
                              {data.doc_number}
                            </TableCell>
                            <TableCell className={classes.tableRowPad} 
                                  style={{ border: "1px solid #EBEEFB" }}>
                              {data.MortgageUser.name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad} 
                                  style={{ border: "1px solid #EBEEFB" }}>
                              {data.MortgageUser.address
                                ? data.MortgageUser.address
                                : "-"}
                            </TableCell>
                             
                           
                            <TableCell className={classes.tableRowPad} style={{ border: "1px solid #EBEEFB", textAlign: "left" }}>
                              {
                                data.MortgageProducts.length > 0 ?  data.MortgageProducts.map((temp, index) => (
                                  <div key={index} style={{ borderBottom:  index !== data.MortgageProducts.length - 1 && "1px solid #EBEEFB" }}>
                                    <span>{temp.product_name}</span>
                                  </div>
                                )) : "-"
                              }
                            </TableCell>
                           
                                <TableCell className={classes.tableRowPad} 
                                  style={{ border: "1px solid #EBEEFB" }}>
                              {data.weight}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              
                              style={{ border: "1px solid #EBEEFB" ,  textAlign : "right" }}
                            >
                              {Config.numWithComma(data.principal_amount)}
                            </TableCell>
                            <TableCell className={classes.tableRowPad} 
                                  style={{ border: "1px solid #EBEEFB" ,textAlign : "center" }}>
                              {data.percentage}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              
                                  style={{ border: "1px solid #EBEEFB", textAlign : "right"}}
                            >
                              {data.final_interest}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              
                                  style={{ border: "1px solid #EBEEFB" , textAlign : "right"}}
                            >
                              {data.close_amount}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              
                              style={{ border: "1px solid #EBEEFB"}}
                            >
                              {data.close_date ? moment(data.close_date).format("DD-MM-YYYY") : ''}
                            </TableCell>
                            
                          
                            {/* <TableCell
                              className={classes.tableRowPad}
                              style={{ paddingRight: "20px" }}
                            >
                              {parseFloat(parseFloat(data.final_interest) +
                                parseFloat(data.close_amount)).toFixed(2)}
                            </TableCell> */}
                            {/* <TableCell className={classes.tableRowPad}>
                            {data.close_amount}
                          </TableCell> */}
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
                      {/* <TableCell className={classes.tableRowPad}></TableCell> */}
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
                      <TableCell className={classes.tableRowPad} align="right">
                        <b>
                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(
                              reportMortage,
                              "final_interest"
                            )
                          )}
                        </b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        <b>
                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(
                              reportMortage,
                              "close_amount"
                            )
                          )}
                        </b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>

                      {/* <TableCell
                        className={classes.tableRowPad}
                        style={{ paddingRight: "20px" }}
                      >
                        <b>
                          {Config.numWithComma(
                            parseFloat(
                              parseFloat(
                                HelperFunc.getTotalOfField(
                                  reportMortage,
                                  "final_interest"
                                )
                              ) +
                                parseFloat(
                                  HelperFunc.getTotalOfField(
                                    reportMortage,
                                    "close_amount"
                                  )
                                )
                            ).toFixed(2)
                          )}
                        </b>
                      </TableCell> */}
                      {/* <TableCell className={classes.tableRowPad}></TableCell> */}
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
        </div>
      </FuseAnimate>
    </div>
  );
};

export default PaidMortgageLoan;

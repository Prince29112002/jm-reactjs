import React, { useState, useEffect } from "react";
import { Typography, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Loader from "app/main/Loader/Loader";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment";
import { CSVLink } from "react-csv";
import ViewPopupRetailer from "../../SalesPurchaseRetailer/ViewPopupRetailer/ViewPopupRetailer";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
    fontSize: "1.2rem",
  },
  hoverClass: {
    // backgroundColor: "#fff",
    color: "#1e90ff",
    "&:hover": {
      // backgroundColor: "#999",
      cursor: "pointer",
    },
  },
  buttonEx: {
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
    lineHeight: "2.25rem",
  },
  errorMessage: {
    color: "#f44336",
    position: "absolute",
    bottom: "-3px",
    fontSize: "11px",
    lineHeight: "7px",
    marginTop: 3,
    fontFamily: 'Muli,Roboto,"Helvetica",Arial,sans-serif',
  },
}));

const LedgerRepAccRetailer = (props) => {
  const classes = useStyles();
  // const theme = useTheme();

  const csvLink = React.useRef(null); // setup the ref that we'll use for the hidden CsvLink click once we've updated the data

  const dispatch = useDispatch();

  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");

  const [loading, setLoading] = useState(false);

  const [apiData, setApiData] = useState([]);

  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);

  const [closingBalance, setClosingBalance] = useState(0);

  const [csvData, setCsvData] = useState([]);

  const [voucherSearch, setVoucherSearch] = useState("");
  const [voucherApiData, setVoucherApiData] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [selectedVouErr, setSelectedVouErr] = useState("");
  const [selectedVoucherNm, setSelectedVoucherNm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [row, setRow] = useState("");
  //   const [GroupId, setGroupId] = useState("");

  // const selectStyles = {
  //   input: (base) => ({
  //     ...base,
  //     color: theme.palette.text.primary,
  //     "& input": {
  //       font: "inherit",
  //     },
  //   }),
  // };

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000); // 10초 뒤에
    }
  }, [loading]);

  useEffect(() => {
    NavbarSetting("Accounts-Retailer", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (voucherSearch) {
        getVoucherSearchApi(voucherSearch);
      } else {
        setVoucherApiData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
    //eslint-disable-next-line
  }, [voucherSearch]);

  // 1 means ledger search
  // 0 means group search
  function getVoucherSearchApi(sData) {
    axios
      .get(
        Config.getCommonUrl() +
          `retailerProduct/api/ledger/group/ledger/1/${sData}`
      )
      .then(function (response) {
        console.log(response.data);
        if (response.data.success === true) {
          if (response.data.data.length > 0) {
            setVoucherApiData(response.data.data);
          } else {
            setVoucherApiData([]);
            dispatch(
              Actions.showMessage({
                message: "Please Insert Proper Value",
              })
            );
          }
        } else {
          setVoucherApiData([]);
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
          api: `retailerProduct/api/ledger/group/ledger/1/${sData}`,
        });
      });
  }

  let handleVoucherSelect = (voucherNum) => {
    //find and set id
    //removing unmatched records so it will not reflect in voucher dropdown list
    let filteredArray = voucherApiData.filter(
      (item) => item.name === voucherNum
    );

    if (filteredArray.length > 0) {
      setVoucherApiData(filteredArray);
      setSelectedVoucher(filteredArray[0].id);
      setSelectedVouErr("");
      setSelectedVoucherNm(voucherNum);
    } else {
      setSelectedVoucher("");
      setSelectedVoucherNm("");
      setSelectedVouErr("Please Select Proper Voucher");
    }
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
    if (fromDate === "" && toDate === "" && selectedVoucher === "") {
      return;
    }

    let url = "retailerProduct/api/ledger/ledger/report";

    if (selectedVoucher === "") {
      setSelectedVouErr("Please Select Proper Group or Account");
      return;
    }

    if (fromDate === "") {
      setFromDtErr("Enter Valid Date!");
      return;
    }

    if (toDate === "") {
      setToDtErr("Enter Valid Date!");
      return;
    }

    if (selectedVoucher !== "") {
      url = url + "?ledger_id=" + selectedVoucher;
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
        url = url + "&start=" + fromDate + "&end=" + toDate;
      } else {
        return;
      }
    }
    getAccountLedger(url);
    // getReportGroupWise(filteredArray[0].id, api/ledger/ledger/report)
  }

  function getAccountLedger(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setLoading(false);

          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              let data = response.data.data;

              const tempArray = data
                // .filter((item) => item.voucher_type !== "Rate Fix")
                .map((item) => {
                  return {
                    // ...item,
                    is_gift_item_entry : item.VoucherEntry.is_gift_item_entry ? item.VoucherEntry.is_gift_item_entry : "",
                    flag: item.flag ? item.flag : "",
                    id: item.id ? item.id : "",
                    date: item.date,
                    view_flag: item.VoucherEntry
                      ? item.VoucherEntry.view_flag
                        ? item.VoucherEntry.view_flag
                        : ""
                      : "",
                    particular: item.particular,
                    voucher_type: item.VoucherEntry
                      ? item.VoucherEntry.voucher_type
                        ? item.VoucherEntry.voucher_type
                        : ""
                      : "",
                    voucher_no: item.VoucherEntry
                      ? item.VoucherEntry.voucher_number
                        ? item.VoucherEntry.voucher_number
                        : ""
                      : "",
                    refrence_voucher: item.VoucherEntry
                      ? item.VoucherEntry.refrence_voucher
                        ? item.VoucherEntry.refrence_voucher
                        : ""
                      : "",
                    voucher_setting_detail_id: item.VoucherEntry
                      ? item.VoucherEntry.voucher_setting_detail_id
                      : "",
                    balance: item.balance ? item.balance.toFixed(3) : "",
                    gst: item.hasOwnProperty("gst")
                      ? parseFloat(item.gst).toFixed(3)
                      : "",
                    debit: item.hasOwnProperty("amount")
                      ? item.credit_debit === 0
                        ? parseFloat(item.amount) < 0
                          ? Math.abs(parseFloat(item.amount).toFixed(3))
                          : parseFloat(item.amount).toFixed(3)
                        : ""
                      : "",
                    credit: item.hasOwnProperty("amount")
                      ? item.credit_debit === 1
                        ? parseFloat(item.amount) < 0
                          ? Math.abs(parseFloat(item.amount).toFixed(3))
                          : parseFloat(item.amount).toFixed(3)
                        : ""
                      : "",
                  };
                });

              const excelArray = data
                // .filter((item) => item.voucher_type !== "Rate Fix")
                .map((item) => {
                  return {
                    Date: moment(item.date).format("DD-MM-YYYY"),
                    "Voucher Type": item.VoucherEntry
                      ? item.VoucherEntry.voucher_type
                        ? item.VoucherEntry.voucher_type
                        : ""
                      : "",
                    "Voucher No": item.VoucherEntry
                      ? item.VoucherEntry.voucher_number
                        ? item.VoucherEntry.voucher_number
                        : ""
                      : "",
                    // "Reference Voucher No": item.reference_voucher_no ? item.reference_voucher_no : "",
                    Dr: item.hasOwnProperty("amount")
                      ? item.credit_debit === 0
                        ? parseFloat(item.amount) < 0
                          ? Math.abs(parseFloat(item.amount).toFixed(3))
                          : parseFloat(item.amount).toFixed(3)
                        : ""
                      : "",
                    Cr: item.hasOwnProperty("amount")
                      ? item.credit_debit === 1
                        ? parseFloat(item.amount) < 0
                          ? Math.abs(parseFloat(item.amount).toFixed(3))
                          : parseFloat(item.amount).toFixed(3)
                        : ""
                      : "",
                    Balance: item.balance
                      ? parseFloat(item.balance).toFixed(3)
                      : "",
                  };
                });
              //if negative than converting to positive Math.abs

              setApiData(tempArray);
              setCsvData(excelArray);

              let tempDrTot = parseFloat(
                tempArray
                  .filter((item) => item.debit !== "")
                  .map((item) => parseFloat(item.debit))
                  .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                  }, 0)
              ).toFixed(3);

              let tempCrTot = parseFloat(
                tempArray
                  .filter((item) => item.credit !== "")
                  .map((item) => parseFloat(item.credit))
                  .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                  }, 0)
              ).toFixed(3);

              let tempClosing = parseFloat(
                parseFloat(tempDrTot) - parseFloat(tempCrTot)
              ).toFixed(3);

              if (tempClosing < 0) {
                tempClosing = Config.numWithComma(tempClosing) + " Cr";
              } else {
                tempClosing = Config.numWithComma(tempClosing) + " Dr";
              }

              setTotalDebit(tempDrTot);
              setTotalCredit(tempCrTot);
              setClosingBalance(tempClosing);
            } else {
              setApiData([]);
              setTotalDebit(0);
              setTotalCredit(0);
              setClosingBalance(0);
            }
          } else {
            setApiData([]);
            setTotalDebit(0);
            setTotalCredit(0);
            setClosingBalance(0);
          }
        } else {
          setLoading(false);
          setTotalDebit(0);
          setTotalCredit(0);
          setClosingBalance(0);
          setApiData([]);
        }
      })
      .catch(function (error) {
        setLoading(false);

        handleError(error, dispatch, { api: url });
      });
  }

  function exportFile() {
    if (apiData.length > 0) {
      csvLink.current.link.click();
    } else {
      dispatch(
        Actions.showMessage({
          message: "You can not export empty data.",
          variant: "error",
        })
      );
    }
  }

  const handleLinkClick = (element) => {
    setModalOpen(true);
    setRow(element);
  };

  const handleMOdalClose = () => {
    setModalOpen(false);
    setRow("");
  };

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
              <Grid item xs={11} sm={8} md={4} lg={5} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Ledger Report Ledger Wise
                  </Typography>
                </FuseAnimate>
              </Grid>
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll ">
              <Grid
                container
                spacing={2}
                alignItems="flex-end"
                style={{ paddingInline: "30", width: "100%" }}
              >
                <Grid
                  item
                  lg={3}
                  md={4}
                  sm={4}
                  xs={12}
                  style={{ position: "relative" }}
                >
                  <p>Search ledger</p>
                  <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    disableClearable
                    style={{ padding: 0 }}
                    onChange={(event, newValue) => {
                      handleVoucherSelect(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                      if (event !== null) {
                        if (event.type === "change")
                          // not using this condition because all other data is showing in dropdown
                          setVoucherSearch(newInputValue);
                      } else {
                        setVoucherSearch("");
                      }
                    }}
                    value={selectedVoucherNm}
                    options={voucherApiData.map((option) => option.name)}
                    renderInput={(params) => (
                      <TextField
                        className="salesreturn-voucher-input"
                        {...params}
                        variant="outlined"
                        style={{ padding: 0 }}
                        placeholder="Search ledger"
                      />
                    )}
                  />
                  <span
                    style={{ color: "red" }}
                    className={classes.errorMessage}
                  >
                    {selectedVouErr.length > 0 ? selectedVouErr : ""}
                  </span>
                </Grid>

                <Grid item lg={3} md={4} sm={4} xs={12}>
                  <p>Start Date</p>
                  <TextField
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
                <Grid item lg={3} md={4} sm={4} xs={12}>
                  <p>End Date</p>
                  <TextField
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
                {/* <Grid className="ledger-pt-btn" item lg={2} md={4} sm={4} xs={12}>
                <Button
                  className="metal-ledger-btn"
                  variant="contained"
                  color="primary"
                  aria-label="Register"
                  onClick={(event) => {
                    setFilters();
                  }}
                >
                  Load Data
                </Button>
              </Grid> */}

                <Grid
                  item
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  style={{
                    alignItems: "flex-start",
                    display: "flex",
                    marginTop: "16px",
                  }}
                >
                  <Button
                    className={classes.buttonEx}
                    variant="contained"
                    color="primary"
                    aria-label="Register"
                    onClick={(event) => {
                      setFilters();
                    }}
                  >
                    Load Data
                  </Button>
                  <Button
                    className={clsx(classes.buttonEx, "ml-16")}
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
                      "Ledger_report_ledger_wise_" +
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

              <div className="ledge_report_group_header-tabl" style={{marginTop:"19px"}}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad} align="left">
                        Date
                      </TableCell>

                      <TableCell className={classes.tableRowPad} align="left">
                        Voucher Type
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Voucher No
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Reference Voucher No
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        Dr
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        Cr
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        Balance
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiData.map((element, index) => (
                      <TableRow key={index}>
                        <TableCell className={classes.tableRowPad} align="left">
                          {moment
                            .utc(element.date)
                            .local()
                            .format("DD-MM-YYYY")}
                        </TableCell>

                        <TableCell className={classes.tableRowPad} align="left">
                          {/* Voucher Type */}
                          {element.voucher_type}
                        </TableCell>
                        <TableCell
                          className={clsx(
                            classes.tableRowPad,
                            classes.hoverClass
                          )}
                          align="left"
                          onClick={() => handleLinkClick(element)}
                        >
                          {/* Voucher No */}
                          {element.voucher_no}
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {/* Reference Voucher No */}
                          {element.refrence_voucher}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          {/* Dr */}
                          {Config.numWithComma(element.debit)}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          {/* Cr */}
                          {Config.numWithComma(element.credit)}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          {Config.numWithComma(element.balance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {modalOpen ? (
                <ViewPopupRetailer
                  rowData={row}
                  modalColsed={handleMOdalClose}
                  fromReport="Accounts-Retailer"
                />
              ) : (
                ""
              )}

              <div
                className="mb-16 mt-16"
                style={{ textAlign: "end", fontWeight: "700" }}
              >
                Total Debit : {Config.numWithComma(totalDebit)}
              </div>
              <div
                className="mb-16"
                style={{ textAlign: "end", fontWeight: "700" }}
              >
                Total Credit : {Config.numWithComma(totalCredit)}
              </div>
              <div style={{ textAlign: "end", fontWeight: "700" }}>
                Closing Account Balance : {closingBalance}
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default LedgerRepAccRetailer;

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
import ViewPopup from "../../SalesPurchase/ViewPopup/ViewPopup";
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
    tableLayout: "auto",
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
    marginBottom: "2px"
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

const LedgerReport = (props) => {
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
    NavbarSetting('Accounts', dispatch)
    //eslint-disable-next-line
  }, [modalOpen]);

  useEffect(() => {
    return () => {
    };
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

  // 1 means leadger search
  // 0 means group search
  function getVoucherSearchApi(sData) {
    axios
      .get(Config.getCommonUrl() + `api/ledger/group/ledger/0/${sData}`)
      .then(function (response) {
        if (response.data.success === true) {
          if (response.data.data.length > 0) {
            setVoucherApiData(response.data.data);
          } else {
            setVoucherApiData([]);
            dispatch(
              Actions.showMessage({
                message: "Please Insert Proper Voucher No",
                variant: "error" 
              })
            );
          }
        } else {
          setVoucherApiData([]);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/ledger/group/ledger/0/${sData}`,
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

    let url = "api/ledger/ledger/report";

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
      url = url + "?groups_id=" + selectedVoucher;
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
                    flag: item.flag ? item.flag : "",
                    id: item.id ? item.id : "",
                    date: item.date,
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
                  };
                });

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
      dispatch(Actions.showMessage({ message: "You Can not Export Empty Data.", variant: "error"}));
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
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1" style={{marginTop: "30px"}}>
            <Grid
              container
              alignItems="center"
              style={{paddingInline: "30px"}}
            >
              <Grid item xs={9} sm={9} md={8} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Ledger Report Group Wise
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll" style={{marginTop: "20px"}}>

              <Grid
                container
                spacing={2}
                alignItems="center"
              >
                <Grid item lg={2} md={4} sm={12} xs={12}>
                  <p style={{marginBottom: "5px"}}>Search ledger</p>
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
                        placeholder="Search Group"
                      />
                    )}
                  />
                  <span style={{ color: "red" }}>
                    {selectedVouErr.length > 0 ? selectedVouErr : ""}
                  </span>
                </Grid>

                <Grid item lg={2} md={4} sm={6} xs={12}>
                  <p style={{marginBottom: "5px"}}>Start Date</p>
                  <TextField
                    // label="Start Date"
                    name="fromDate"
                    value={fromDate}
                    // onKeyDown={(e => e.preventDefault())}
                    error={fromDtErr.length > 0 ? true : false}
                    helperText={fromDtErr}
                    type="date"
                    onChange={(e) => handleInputChange(e)}
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
                <Grid item lg={2} md={4} sm={6} xs={12}>
                  <p style={{marginBottom: "5px"}}>End Date</p>
                  <TextField
                    // label="End Date"
                    name="toDate"
                    value={toDate}
                    // onKeyDown={(e => e.preventDefault())}
                    error={toDtErr.length > 0 ? true : false}
                    helperText={toDtErr}
                    type="date"
                    onChange={(e) => handleInputChange(e)}
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
                {/* <Grid className="ledger-pt-btn" item lg={2} md={4} sm={4} xs={12}>
               
              </Grid> */}

                <Grid
                  item
                  lg={6}
                  md={12}
                  sm={12}
                  xs={12}
                  className={classes.filterbtn}
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
                      "Ledger_report_grp_wise_" +
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

              <div className="accountledgerstatement-tbl ledge_report_group_header ledge_report_group_header-tabl overflow-x-auto" style={{marginTop: "20px"}}>
                <Table aria-label="simple table" className={classes.table}>
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

                      <TableCell className={classes.tableRowPad} align="right">
                        Dr
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        Cr
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiData.map((element, index) => (
                      <TableRow key={index}>
                        <TableCell className={classes.tableRowPad} align="left">
                          {moment.utc(element.date).local().format("DD-MM-YYYY")}
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

                        <TableCell className={classes.tableRowPad} align="right">
                          {/* Dr */}
                          {Config.numWithComma(element.debit)}
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="right">
                          {/* Cr */}
                          {Config.numWithComma(element.credit)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {modalOpen ? (
                <ViewPopup
                  rowData={row}
                  modalColsed={handleMOdalClose}
                  fromReport="Account"
                />
              ) : (
                ""
              )}

              <div
                className="ml-16 mb-16 mt-16"
                style={{ textAlign: "end", fontWeight: "700" }}
              >
                Total Debit : {Config.numWithComma(totalDebit)}
              </div>
              <div
                className="ml-16 mb-16"
                style={{ textAlign: "end", fontWeight: "700" }}
              >
                Total Credit : {Config.numWithComma(totalCredit)}
              </div>
              <div
                className="ml-16"
                style={{ textAlign: "end", fontWeight: "700" }}
              >
                Closing Account Balance : {closingBalance}
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default LedgerReport;

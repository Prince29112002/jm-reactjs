import React, { useState, useEffect, useRef } from "react";
import { Typography, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";

import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
import Select, { createFilter } from "react-select";
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
}));

const AccountLedgerStatement = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const csvLink = React.useRef(null); // setup the ref that we'll use for the hidden CsvLink click once we've updated the data

  //client vendor both
  const [clientdata, setClientdata] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectClientErr, setSelectClientErr] = useState("");

  //1 means client and 0 means vendor, 2 means jobworker
  const [partyType, setPartyType] = useState("");
  const SelectRef = useRef(null);

  const [clientCompanies, setClientCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompErr, setSelectedCompErr] = useState("");

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
  const [modalOpen, setModalOpen] = useState(false);
  const [row, setRow] = useState("");
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
    if (loading) {
      setTimeout(() => setLoading(false), 7000); // 10초 뒤에
    }
  }, [loading]);

  useEffect(() => {
    NavbarSetting("Factory Report", dispatch);
  }, []);

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  useEffect(() => {
    getClientVendorData();
    //eslint-disable-next-line
  }, [dispatch]);

  function getClientVendorData() {
    axios
      .get(Config.getCommonUrl() + "api/vendor/both/client")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setClientdata(response.data.data);
          // setData(response.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/vendor/both/client" });
      });
  }

  function handlePartyChange(value) {
    let tempVal = Number(value.value.split("-")[1]);
    setSelectedClient(value);
    setSelectClientErr("");
    setSelectedCompany("");
    setCsvData([]);
    let findIndex = clientdata.findIndex(
      (item) => item.id === tempVal && item.type === value.type
    );
    setApiData([]);
    if (findIndex > -1 && value.type === 1) {
      setPartyType(clientdata[findIndex].type);

      if (clientdata[findIndex].type === 1) {
        getClientCompanies(tempVal, function (response) {
          if (response !== null) {
            setClientCompanies(response);
          } else {
            setClientCompanies([]);
          }
        });
        setTimeout(() => {
          SelectRef.current.focus();
        }, 800);
      }
    }
    setPartyType(value.type);
  }

  function getClientCompanies(clientId, callback) {
    // setClientCompanies

    axios
      .get(Config.getCommonUrl() + `api/client/company/${clientId}`)
      .then(function (response) {
        if (response.data.success === true) {
          var compData = response.data.data;
          callback(compData);
          // setClientCompanies(compData);
        } else {
          callback(null);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch((error) => {
        callback(null);

        handleError(error, dispatch, { api: `api/client/company/${clientId}` });
      });
  }

  function handleCompanyChange(value) {
    setSelectedCompany(value);
    setSelectedCompErr("");
    setApiData([]);
    setTotalDebit(0);
    setTotalCredit(0);
    setClosingBalance(0);
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
    if (fromDate === "" && toDate === "" && selectedClient === "") {
      return;
    }

    if (
      moment(new Date(fromDate)).format("YYYY-MM-DD") >
      moment(new Date(toDate)).format("YYYY-MM-DD")
    ) {
      setToDtErr("Enter Valid Date!");
      return;
    }

    let url = "";
    url = "api/metalledger/accountLedger";

    if (selectedClient === "") {
      setSelectClientErr("Please Select Party");
      return;
    }

    if (partyType === 1) {
      if (selectedClient !== "" && selectedCompany === "") {
        setSelectedCompErr("Please Select Firm");
        return;
      }
    }

    if (fromDate === "") {
      setFromDtErr("Enter Valid Date!");
      return;
    }

    if (toDate === "") {
      setToDtErr("Enter Valid Date!");
      return;
    }

    if (selectedClient !== "") {
      const clientSelect = selectedClient.value.split("-")[1];
      if (partyType === 1) {
        url =
          url +
          "?ven_cli_job_id=" +
          selectedCompany.value +
          "&is_ven_cli_job=" +
          2;
      } else if (partyType === 0) {
        url = url + "?ven_cli_job_id=" + clientSelect + "&is_ven_cli_job=" + 1;
      } else if (partyType === 2) {
        url = url + "?ven_cli_job_id=" + clientSelect + "&is_ven_cli_job=" + 3;
      }
    }

    // if (partyType === 1) {
    //   if (selectedCompany !== "") {
    //     if (selectedClient !== "") {
    //       //if client selected then build using &, else ?
    //       url = url + "&clientCompany=" + selectedCompany.value;
    //     } else {
    //       url = url + "?clientCompany=" + selectedCompany.value;
    //     }
    //   }
    // }

    if (fromDate !== "" || toDate !== "") {
      if (fromDtValidation() && toDtValidation()) {
        if (selectedClient !== "") {
          url = url + "&start=" + fromDate + "&end=" + toDate;
        } else {
          url = url + "?start=" + fromDate + "&end=" + toDate;
        }
      } else {
        return;
      }
    }

    getAccountLedger(url);
  }

  function getAccountLedger(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          setLoading(false);

          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              let data = response.data.data;

              const tempArray = data
                .filter((item) => item.voucher_type !== "Rate Fix")
                .map((item) => {
                  return {
                    // ...item,
                    flag: item.flag ? item.flag : "",
                    id: item.id ? item.id : "",
                    date: item.created_at,
                    particular: item.particular,
                    view_flag: item.view_flag,
                    voucher_type: item.voucher_type,
                    voucher_no: item.voucher_number,
                    refrence_voucher: item.refrence_voucher,
                    voucher_setting_detail_id: item.voucher_setting_detail_id,
                    taxable_amount: item.hasOwnProperty("taxable_amount")
                      ? parseFloat(item.taxable_amount).toFixed(3)
                      : "",
                    totalHallMarkCharges: item.hasOwnProperty(
                      "hallmark_charges"
                    )
                      ? parseFloat(item.hallmark_charges).toFixed(3)
                      : "",
                    gst: item.hasOwnProperty("gst")
                      ? parseFloat(item.gst).toFixed(3)
                      : "",
                    debit:
                      item.credit_debit === 0
                        ? parseFloat(item.amount) < 0
                          ? Math.abs(
                              parseFloat(item.amount).toFixed(3)
                            ).toFixed(3)
                          : parseFloat(item.amount).toFixed(3)
                        : "",
                    credit:
                      item.credit_debit === 1
                        ? parseFloat(item.amount) < 0
                          ? Math.abs(
                              parseFloat(item.amount).toFixed(3)
                            ).toFixed(3)
                          : parseFloat(item.amount).toFixed(3)
                        : "",
                    balance: parseFloat(item.balance).toFixed(3),
                  };
                });
              const excelArray = data
                .filter((item) => item.voucher_type !== "Rate Fix")
                .map((item) => {
                  return {
                    Date: moment
                      .utc(item.created_at)
                      .local()
                      .format("DD-MM-YYYY"),
                    // particular: item.particular,
                    "Voucher Type": item.voucher_type,
                    "Voucher No": item.voucher_number,
                    // "refrence_voucher": item.refrence_voucher,
                    "Taxable amount": item.hasOwnProperty("taxable_amount")
                      ? parseFloat(item.taxable_amount).toFixed(3)
                      : "",
                    "Hallmark Charges": item.hasOwnProperty("hallmark_charges")
                      ? parseFloat(item.hallmark_charges).toFixed(3)
                      : "",
                    Gst: item.hasOwnProperty("gst")
                      ? parseFloat(item.gst).toFixed(3)
                      : "",
                    Dr:
                      item.credit_debit === 0
                        ? parseFloat(item.amount) < 0
                          ? Math.abs(
                              parseFloat(item.amount).toFixed(3)
                            ).toFixed(3)
                          : parseFloat(item.amount).toFixed(3)
                        : "",
                    Cr:
                      item.credit_debit === 1
                        ? parseFloat(item.amount) < 0
                          ? Math.abs(
                              parseFloat(item.amount).toFixed(3)
                            ).toFixed(3)
                          : parseFloat(item.amount).toFixed(3)
                        : "",
                    balance: parseFloat(item.balance).toFixed(3),
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

              setTotalDebit(Config.numWithComma(tempDrTot));
              setTotalCredit(Config.numWithComma(tempCrTot));
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
          message: "Can not Export Empty Data",
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
        <div className="flex flex-col md:flex-row container table-width-mt">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="jewellerypreturn-main pb-12"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Account Ledger Statement
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll">
              <Grid
                className="metalled-statement-pr"
                container
                spacing={3}
                style={{ padding: 20 }}
              >
                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Select Party</label>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={clientdata
                      // .filter((item) => item.id !== selectedVendor.value)
                      .map((suggestion, i) => ({
                        value: `SL${i}-${suggestion.id}`,
                        label: suggestion.name,
                        type: suggestion.type,
                      }))}
                    // components={components}
                    value={selectedClient}
                    onChange={handlePartyChange}
                    placeholder="Select Party"
                    autoFocus
                    blurInputOnSelect
                    tabSelectsValue={false}
                  />

                  <span style={{ color: "red" }}>
                    {selectClientErr.length > 0 ? selectClientErr : ""}
                  </span>
                </Grid>

                {partyType === 1 && (
                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ padding: 6 }}
                    className="ml-8"
                  >
                    <label>Select Firm</label>
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
                      // components={components}
                      value={selectedCompany}
                      onChange={handleCompanyChange}
                      placeholder="Select Firm"
                      ref={SelectRef}
                      blurInputOnSelect
                      tabSelectsValue={false}
                    />

                    <span style={{ color: "red" }}>
                      {selectedCompErr.length > 0 ? selectedCompErr : ""}
                    </span>
                  </Grid>
                )}

                <Grid
                  item
                  lg={2}
                  md={4}
                  sm={4}
                  xs={12}
                  style={{ padding: 6 }}
                  className="ml-8"
                >
                  <label>Start Date</label>
                  <TextField
                    placeholder="Start Date"
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
                <Grid
                  item
                  lg={2}
                  md={4}
                  sm={4}
                  xs={12}
                  style={{ padding: 6 }}
                  className="ml-8"
                >
                  <label>End Date</label>
                  <TextField
                    placeholder="End Date"
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

                <Grid style={{ marginTop: "25px" }} className="ml-8">
                  <Button
                    className="load_Data-btn"
                    variant="contained"
                    aria-label="Register"
                    onClick={(event) => {
                      setFilters();
                    }}
                  >
                    Load Data
                  </Button>

                  <Button
                    className="export_btn"
                    variant="contained"
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
                      "Account_ledger_" +
                      selectedClient.label +
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

              <div
                className="ml-16 mr-16 mb-16 accountledgerstatement-tbl metalled_statements_table"
                style={{ marginBottom: "8%" }}
              >
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad} align="left">
                        Date
                      </TableCell>
                      {/* <TableCell className={classes.tableRowPad} align="left">
                      Particular
                    </TableCell> */}
                      <TableCell className={classes.tableRowPad} align="left">
                        Voucher Type
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Voucher No
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        Taxable amount
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        Hallmark Charges
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        Gst
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
                          {/* Date */}
                          {/* {element.date} */}
                          {moment
                            .utc(element.date)
                            .local()
                            .format("DD-MM-YYYY")}
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad} align="left">
                        {element.particular}
                      </TableCell> */}
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
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          {/* Texeable amount */}
                          {Config.numWithComma(element.taxable_amount)}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          {/* Hallmark Charges */}
                          {Config.numWithComma(element.totalHallMarkCharges)}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          {/* Gst */}
                          {Config.numWithComma(element.gst)}
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

                    <TableRow style={{ backgroundColor: "#D3D3D3" }}>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                        style={{ fontWeight: "700" }}
                      >
                        {/* Date */}
                      </TableCell>

                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                        style={{ fontWeight: "700" }}
                      >
                        {/* Voucher Type */}
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                        style={{ fontWeight: "700" }}
                      >
                        {/* Voucher No */}
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="right"
                        style={{ fontWeight: "700" }}
                      >
                        {/* Texeable amount */}
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="right"
                        style={{ fontWeight: "700" }}
                      >
                        {/* Hallmark Charges */}
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="right"
                        style={{ fontWeight: "700" }}
                      >
                        {/* Gst */}
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ fontWeight: "700" }}
                        align="right"
                      >
                        {/* Dr */}
                        {totalDebit}
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ fontWeight: "700" }}
                        align="right"
                      >
                        {/* Cr */}
                        {totalCredit}
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ fontWeight: "700" }}
                        align="right"
                      >
                        {closingBalance}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            {modalOpen ? (
              <ViewPopup
                rowData={row}
                modalColsed={handleMOdalClose}
                fromReport={true}
              />
            ) : (
              ""
            )}
            <div
              className="ml-16 mr-16 mb-16"
              style={{ textAlign: "end", fontWeight: "700" }}
            >
              Closing Account Balance : {closingBalance}
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AccountLedgerStatement;

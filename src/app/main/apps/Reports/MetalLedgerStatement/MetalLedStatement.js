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
import Select, { createFilter } from "react-select";
import moment from "moment";
import Loader from "app/main/Loader/Loader";
import { CSVLink } from "react-csv";
import ViewPopup from "../../SalesPurchase/ViewPopup/ViewPopup";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    // minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
    fontSize: "1.2rem",
  },
  leftBorder: {
    borderLeft: "3px solid #ffff",
  },
  hoverClass: {
    // backgroundColor: "#fff",
    color: "#1e90ff",
    "&:hover": {
      // backgroundColor: "#999",
      cursor: "pointer",
    },
  },
  finalRow: {
    border: "3px solid #ffff",
    borderRadius: "10px !important",
  },
}));

const MetalLedStatement = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const csvLink = React.useRef(null); // setup the ref that we'll use for the hidden CsvLink click once we've updated the data

  //client vendor both
  const [clientdata, setClientdata] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectClientErr, setSelectClientErr] = useState("");

  //1 means client and 0 means vendor, 2 means jobworker
  const [partyType, setPartyType] = useState("");

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

  const [csvData, setCsvData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const SelectRef = useRef(null);
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
    return () => {
      console.log("cleaned up");
    };
  }, []);

  useEffect(() => {
    NavbarSetting("Factory Report", dispatch);
  }, [modalOpen]);

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
          console.log(response);
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
          console.log(JSON.stringify(response.data.data));
          var compData = response.data.data;
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          // setClientCompanies(compData);
        } else {
          callback(null);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
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
  }

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

    let url = "";
    if (partyType === 1) {
      url = "api/metalledger/clientOrVendor";
    } else if (partyType === 0) {
      url = "api/metalledger/clientOrVendor";
    } else if (partyType === 2) {
      url = "api/metalledger/jobworker";
    }

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
          url + "?vendor=" + selectedCompany.value + "&is_vendor_client=" + 2;
      } else if (partyType === 0) {
        url = url + "?vendor=" + clientSelect + "&is_vendor_client=" + 1;
      } else if (partyType === 2) {
        url = url + "?jobworker=" + clientSelect;
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

    if (
      moment(new Date(fromDate)).format("YYYY-MM-DD") >
      moment(new Date(toDate)).format("YYYY-MM-DD")
    ) {
      setToDtErr("Enter Valid Date!");
      return;
    }

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

    getmMtalLedger(url);
  }

  function getmMtalLedger(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setLoading(false);

          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              setApiData(response.data.data);
              const tempData = response.data.data;
              const arrData = tempData.map((item) => {
                return {
                  Date: moment.utc(item.date).local().format("DD-MM-YYYY"),
                  "Doc. No": item.voucher_no,
                  "Voucher Type": item.voucher_type,
                  "Gross Weight": item.hasOwnProperty("totalGrossWeight")
                    ? parseFloat(item.totalGrossWeight).toFixed(3)
                    : "",
                  "Net Weight": item.hasOwnProperty("totalNetWeight")
                    ? parseFloat(item.totalNetWeight).toFixed(3)
                    : "",
                  "Stone+Other Amount": item.hasOwnProperty(
                    "stonePlusOtherAmount"
                  )
                    ? parseFloat(item.stonePlusOtherAmount).toFixed(3)
                    : "",
                  "Hallmark Charges": item.hasOwnProperty(
                    "totalHallMarkCharges"
                  )
                    ? parseFloat(item.totalHallMarkCharges).toFixed(3)
                    : "",
                  Gst: item.hasOwnProperty("gst")
                    ? parseFloat(item.gst).toFixed(3)
                    : "",
                  Fine: parseFloat(item.fine).toFixed(3),
                  "Entry Effect Fine": item.PFINE ? item.PFINE : "",
                  "Entry Effect Amount": item.PAMOUNT ? item.PAMOUNT : "",
                  "Balance Fine": item.hasOwnProperty("balanceFine")
                    ? parseFloat(item.balanceFine).toFixed(3)
                    : "",
                  "Balance Amount": item.hasOwnProperty("balanceAmount")
                    ? parseFloat(item.balanceAmount).toFixed(3)
                    : "",
                };
              });

              setCsvData(arrData);
            } else {
              setApiData([]);
            }
          } else {
            setApiData([]);
          }
        } else {
          setLoading(false);

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
              className="MetalLedStatement-main pb-16"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Metal Ledger Statement
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
                <Grid style={{ marginTop: "25px" }}>
                  <Button
                    className="load_Data-btn ml-8"
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
                      "Metal_ledger_" +
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

              <div className="ml-16 mr-16 mb-16 metalled_statements_blg metalled_statements_table">
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow className={classes.finalRow}>
                      <TableCell
                        id="table_first_child"
                        className={classes.tableRowPad}
                        align="center"
                        colSpan={9}
                      ></TableCell>
                      <TableCell
                        id="table_second_child"
                        className={clsx(
                          classes.tableRowPad,
                          classes.leftBorder
                        )}
                        colSpan={2}
                      >
                        Entry Effect
                      </TableCell>
                      <TableCell
                        id="table_third_child"
                        className={clsx(
                          classes.tableRowPad,
                          classes.leftBorder
                        )}
                        align="center"
                        colSpan={2}
                      >
                        Balance
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell
                        className={clsx(
                          classes.tableRowPad,
                          "border_Radius_left"
                        )}
                        align="center"
                      >
                        Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        Doc.No
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        Voucher Type
                      </TableCell>
                      {/* <TableCell className={classes.tableRowPad} align="left">
                      Dr/Cr
                    </TableCell> */}
                      {/* <TableCell className={classes.tableRowPad} align="left">
                      Purity
                    </TableCell> */}
                      <TableCell className={classes.tableRowPad} align="center">
                        Gross
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        Net
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        Stone+Other Amt
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        Hallmark Charges
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        Gst
                      </TableCell>
                      <TableCell
                        className={clsx(
                          classes.tableRowPad,
                          "border_Radius_right"
                        )}
                        align="center"
                      >
                        Fine
                      </TableCell>

                      <TableCell
                        className={clsx(
                          classes.tableRowPad,
                          classes.leftBorder,
                          "border_Radius_left"
                        )}
                        align="center"
                      >
                        Fine
                      </TableCell>
                      <TableCell
                        className={clsx(
                          classes.tableRowPad,
                          "border_Radius_right"
                        )}
                        align="center"
                      >
                        Amount
                      </TableCell>

                      <TableCell
                        className={clsx(
                          classes.tableRowPad,
                          classes.leftBorder,
                          "border_Radius_left"
                        )}
                        align="center"
                      >
                        Fine
                      </TableCell>
                      <TableCell
                        className={clsx(
                          classes.tableRowPad,
                          "border_Radius_right"
                        )}
                        align="right"
                      >
                        Amount
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
                        <TableCell
                          className={clsx(
                            classes.tableRowPad,
                            classes.hoverClass
                          )}
                          align="left"
                          onClick={() => handleLinkClick(element)}
                        >
                          {/* Doc.No */}
                          {element.voucher_no}
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {/* Voucher Type */}
                          {element.voucher_type}
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad} align="left">
                        
                        {element.credit_debit === 1 ? "Cr" : "Dr"}
                      </TableCell> */}
                        {/* <TableCell className={classes.tableRowPad} align="left">
                        
                        {element.purity}
                      </TableCell> */}
                        <TableCell className={classes.tableRowPad} align="left">
                          {/* Gross */}

                          {element.hasOwnProperty("totalGrossWeight")
                            ? parseFloat(element.totalGrossWeight).toFixed(3)
                            : ""}
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {/* Net */}
                          {element.hasOwnProperty("totalNetWeight")
                            ? parseFloat(element.totalNetWeight).toFixed(3)
                            : ""}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          {/* Stone+Other Amt */}
                          {element.hasOwnProperty("stonePlusOtherAmount")
                            ? Config.numWithComma(element.stonePlusOtherAmount)
                            : ""}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          {/* Hallmark Charges */}
                          {element.hasOwnProperty("totalHallMarkCharges")
                            ? Config.numWithComma(element.totalHallMarkCharges)
                            : ""}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          {/* Gst */}
                          {element.hasOwnProperty("gst")
                            ? Config.numWithComma(element.gst)
                            : ""}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          {/* Fine */}
                          {parseFloat(element.fine).toFixed(3)}
                        </TableCell>

                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          {/* Fine */}
                          {element.hasOwnProperty("PFINE") ? element.PFINE : ""}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          {/* Amount */}
                          {element.PAMOUNT}
                        </TableCell>

                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          {/* Fine */}
                          {parseFloat(element.balanceFine).toFixed(3)}
                        </TableCell>

                        <TableCell
                          className={classes.tableRowPad}
                          align="right"
                        >
                          {/* Amount */}
                          {Config.numWithComma(
                            parseFloat(element.balanceAmount).toFixed(3)
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
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
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default MetalLedStatement;

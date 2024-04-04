import React, { useState, useEffect } from "react";
import {
  Typography,
  Checkbox,
  TextField,
  Table,
  Paper,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import Loader from "../../../Loader/Loader";
import Select, { createFilter } from "react-select";
import History from "@history";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},

  button: {
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
  group: {
    flexDirection: "row",
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    tableLayout: "auto",
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
}));

const RateMatch = (props) => {
  const [loading, setLoading] = useState(false);
  const [selectOptions, setSelectOptions] = useState("1");
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [clientData, setClientData] = useState([]);
  const [clientSelected, setClientSelected] = useState("");
  const [clientSelectErr, setClientSelectErr] = useState("");

  const [firmData, setFirmData] = useState([]);
  const [firmSelected, setFirmSelected] = useState("");
  const [firmSelectedErr, setFirmSelectedErr] = useState("");

  const [vendorData, setVendorData] = useState([]);
  const [vendorSelected, setVendorSelected] = useState("");
  const [vendorSelectErr, setVendorSelectErr] = useState("");

  const [tempRateList, setTempRateList] = useState([]);
  const [rateList, setRateList] = useState([]);

  const [selectLeft, setSelectLeft] = useState("");
  const [selectRight, setSelectRight] = useState("");

  const [leftWeight, setLeftWeight] = useState("");
  const [rightWeight, setRightWeight] = useState("");
  const [leftRate, setLeftRate] = useState("");
  const [rightRate, setRightRate] = useState("");
  const [fixVoucher, setFixVoucher] = useState("");
  const [tempVoucher, setTempVoucher] = useState("");
  const [fixRate, setFixRate] = useState("");
  const [difference, setDifference] = useState("");
  const [leftAmt, setLeftAmt] = useState("");
  const [rightAmt, setRightAmt] = useState("");

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
    getClients();
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Sales", dispatch);
  }, []);

  useEffect(() => {
    if (selectLeft && selectRight) {
      calculateDifference();
    }
  }, [selectLeft, selectRight]);

  const handleRadioOption = (event) => {
    setSelectOptions(event.target.value);
    setTempRateList([]);
    setRateList([]);
    setSelectLeft("");
    setSelectRight("");
    setLeftWeight("");
    setRightWeight("");
    setLeftRate("");
    setRightRate("");
    setFixVoucher("");
    setTempVoucher("");
    setFixRate("");
    setClientSelected("");
    setFirmSelected("");
    setVendorSelected("");
    if (event.target.value === "1") {
      getClients();
    } else {
      getVendors();
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (selectOptions === "1") {
      if (validateClient() && validateFirm() && validateLeftRight()) {
        createMatchRateApi();
      }
    } else {
      if (validateVendor() && validateLeftRight()) {
        createMatchRateApi();
      }
    }
  };

  function createMatchRateApi() {
    const body = {
      party_type: selectOptions,
      party_id:
        selectOptions === "1" ? clientSelected.value : vendorSelected.value,
      client_company_id: selectOptions === "1" ? firmSelected.value : null,
      fweight: leftWeight,
      frate: leftRate,
      tweight: rightWeight,
      trate: rightRate,
      frefrence_voucher: fixVoucher,
      trefrence_voucher: tempVoucher,
      fix_rate: fixRate,
      rate_fix_temporary_id: selectRight,
      create_date: moment(new Date()).format("DD-MM-YYYY"),
      voucher_date: moment(new Date()).format("DD-MM-YYYY"),
    };
    axios
      .post(Config.getCommonUrl() + "api/ratefix/match/fix/rate", body)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          if (selectOptions === "1") {
            History.push("/dashboard/sales/ratefixclient");
          } else {
            History.push("/dashboard/sales/ratefixvendor");
          }
          dispatch(
            Actions.showMessage({
              message: "Added SuccessFully",
              variant: "success",
            })
          );
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
          api: "api/ratefix/match/fix/rate",
          body: body,
        });
      });
  }

  function validateLeftRight() {
    if (selectLeft === "" || selectRight === "") {
      if (selectLeft === "" && selectRight === "") {
        dispatch(
          Actions.showMessage({
            message: "Select Rate from Fix rate and Temp Rate",
            variant: "error",
          })
        );
      } else if (selectRight === "") {
        dispatch(
          Actions.showMessage({
            message: "Select Rate from Temp Rate",
            variant: "error",
          })
        );
      } else {
        dispatch(
          Actions.showMessage({
            message: "Select Rate from Fix Rate",
            variant: "error",
          })
        );
      }
      return false;
    }
    return true;
  }

  function validateClient() {
    if (clientSelected === "") {
      setClientSelectErr("Please select Party Name");
      return false;
    }
    return true;
  }

  function validateFirm() {
    if (firmSelected === "") {
      setFirmSelectedErr("Please select Firm Name");
      return false;
    }
    return true;
  }

  function validateVendor() {
    if (vendorSelected === "") {
      setVendorSelectErr("Please select Party Name");
      return false;
    }
    return true;
  }

  function getClients() {
    axios
      .get(Config.getCommonUrl() + "api/client/listing/listing")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setClientData(response.data.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/client/listing/listing" });
      });
  }

  function getClientFirmData(clientId) {
    axios
      .get(Config.getCommonUrl() + "api/ratefix/company/" + clientId)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setFirmData(response.data.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/ratefix/company/" + clientId,
        });
      });
  }

  function handlePartyNameChange(value) {
    setClientSelected(value);
    setClientSelectErr("");
    setFirmData([]);
    setFirmSelected("");
    getClientFirmData(value.value);
  }

  function handleVendorNameChange(value) {
    setVendorSelected(value);
    setVendorSelectErr("");
    if (value.value) {
      callVendorRateFixApi(value.value);
      callVendorTempRateFixApi(value.value);
    }
  }

  function handleFirmChange(value) {
    setFirmSelected(value);
    setFirmSelectedErr("");
    if (clientSelected && value.value) {
      callClientRateFixApi(clientSelected.value, value.value);
      callClientTempRateFixApi(clientSelected.value, value.value);
    }
  }

  function callVendorRateFixApi(clientId) {
    axios
      .get(Config.getCommonUrl() + `api/ratefix/party/balance/0/${clientId}/0`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setRateList(response.data.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: `api/ratefix/party/balance/0/${clientId}/0`,
        });
      });
  }

  function callVendorTempRateFixApi(clientId) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/ratefix/temp/rate/${clientId}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setTempRateList(response.data.data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/ratefix/temp/rate/${clientId}`,
        });
      });
  }

  function callClientRateFixApi(clientId, companyId) {
    axios
      .get(
        Config.getCommonUrl() +
          `api/ratefix/party/balance/1/${clientId}/${companyId}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setRateList(response.data.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: `api/ratefix/party/balance/1/${clientId}/${companyId}`,
        });
      });
  }

  function callClientTempRateFixApi(clientId, companyId) {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() + `api/ratefix/temp/rate/${clientId}/${companyId}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setTempRateList(response.data.data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/ratefix/temp/rate/${clientId}/${companyId}`,
        });
      });
  }

  function getVendors() {
    axios
      .get(Config.getCommonUrl() + "api/vendor/listing/listing")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setVendorData(response.data.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/vendor/listing/listing" });
      });
  }

  const handleLeftList = (event) => {
    if (event.target.checked) {
      const leftRowData = JSON.parse(event.target.value);
      setSelectLeft(leftRowData.id);
      setLeftWeight(leftRowData.weight);
      setLeftRate(leftRowData.rate);
      setFixVoucher(leftRowData.voucher_no);
      setFixRate(leftRowData.rate);
    } else {
      setSelectLeft("");
      setLeftWeight("");
      setLeftRate("");
      setFixVoucher("");
      setFixRate("");
      setLeftAmt("");
    }
  };

  const handleRightList = (event) => {
    if (event.target.checked) {
      const rightRowData = JSON.parse(event.target.value);
      setSelectRight(rightRowData.id);
      setRightWeight(rightRowData.weight);
      setTempVoucher(rightRowData.voucher_no);
      setRightRate(rightRowData.rate);
    } else {
      setSelectRight("");
      setRightWeight("");
      setTempVoucher("");
      setRightRate("");
      setRightAmt("");
    }
  };

  const calculateDifference = () => {
    const leftRateAmt = (leftRate * rightWeight) / 10;
    setLeftAmt(parseFloat(leftRateAmt).toFixed(3));
    const rightRateAmt = (rightWeight * rightRate) / 10;
    setRightAmt(parseFloat(rightRateAmt).toFixed(3));
    const diff = parseFloat(leftRateAmt) - parseFloat(rightRateAmt);
    setDifference(parseFloat(diff).toFixed(3));
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div
            className="flex flex-1 flex-col min-w-0"
            style={{ marginTop: "30px" }}
          >
            <Grid
              container
              alignItems="center"
              style={{ paddingInline: "30px" }}
            >
              <Grid item xs={12} sm={4} md={3} key="1">
                <FuseAnimate delay={300}>
                  {/* <Typography className="p-16 pb-8 text-18 font-700"> */}
                  <Typography className="text-18 font-700">
                    Rate Match
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll" style={{ marginTop: "20px" }}>
              <div className="">
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                  style={{ marginBottom: "10px" }}
                >
                  <RadioGroup
                    aria-label="Select"
                    name="Select"
                    className={classes.group}
                    value={selectOptions}
                    onChange={handleRadioOption}
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio style={{ paddingBlock: 0 }} />}
                      label="Client"
                    />
                    <FormControlLabel
                      value="0"
                      control={<Radio style={{ paddingBlock: 0 }} />}
                      label="Vendor"
                    />
                  </RadioGroup>
                </FormControl>
                {selectOptions === "1" && (
                  <>
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      style={{ marginBottom: "16px" }}
                    >
                      <Grid item lg={4} md={4} sm={6} xs={12}>
                        <Select
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          autoFocus
                          options={clientData.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.name,
                          }))}
                          // components={components}
                          value={clientSelected}
                          onChange={handlePartyNameChange}
                          placeholder="Party Name"
                        />

                        <span style={{ color: "red" }}>
                          {clientSelectErr.length > 0 ? clientSelectErr : ""}
                        </span>
                      </Grid>
                      <Grid item lg={4} md={4} sm={6} xs={12}>
                        <Select
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          options={firmData.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.company_name,
                          }))}
                          // components={components}
                          value={firmSelected}
                          onChange={handleFirmChange}
                          placeholder="Firm Name"
                        />

                        <span style={{ color: "red" }}>
                          {firmSelectedErr.length > 0 ? firmSelectedErr : ""}
                        </span>
                      </Grid>
                    </Grid>
                    {/* <div className="my-16" style={{ width: "30%" }}>
                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        autoFocus
                        options={clientData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        value={clientSelected}
                        onChange={handlePartyNameChange}
                        placeholder="Party Name"
                      />

                      <span style={{ color: "red" }}>
                        {clientSelectErr.length > 0 ? clientSelectErr : ""}
                      </span>

                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        className="mt-16"
                        classes={classes}
                        styles={selectStyles}
                        options={firmData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.company_name,
                        }))}
                        // components={components}
                        value={firmSelected}
                        onChange={handleFirmChange}
                        placeholder="Firm Name"
                      />

                      <span style={{ color: "red" }}>
                        {firmSelectedErr.length > 0 ? firmSelectedErr : ""}
                      </span>
                    </div> */}
                    <div className="ratematch-main-tabel">
                      <div>
                        <h4>Fix rate</h4>
                      </div>
                      <div>
                        <h4>Temp Rate </h4>
                      </div>
                    </div>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Paper
                          className={clsx(classes.tabroot, "table-responsive")}
                          id="ratematch-tbel-dv"
                        >
                          <Table className={classes.table}>
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  className={classes.tableRowPad}
                                ></TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Date
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Voucher Number
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Weight
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Rate
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rateList.map((row, i) => (
                                <TableRow key={i}>
                                  <TableCell className={classes.tableRowPad}>
                                    <Checkbox
                                      type="checkbox"
                                      value={JSON.stringify(row)}
                                      onChange={handleLeftList}
                                      checked={
                                        selectLeft == row.id ? true : false
                                      }
                                    />
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {/* {moment(new Date(row.date)).format("DD-MM-YYYY")} */}
                                    {row.date}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.voucher_no}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {parseFloat(row.balance).toFixed(3)}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {Config.numWithComma(row.rate)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Paper
                          className={clsx(classes.tabroot, "table-responsive")}
                          id="ratematch-tbel-dv"
                        >
                          <Table className={classes.table}>
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  className={classes.tableRowPad}
                                ></TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Date
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Voucher Number
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Weight
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Rate
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {tempRateList.map((row, i) => (
                                <TableRow key={i}>
                                  <TableCell className={classes.tableRowPad}>
                                    <Checkbox
                                      name="selectlot"
                                      type="checkbox"
                                      value={JSON.stringify(row)}
                                      onChange={handleRightList}
                                      checked={
                                        selectRight == row.id ? true : false
                                      }
                                    />
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.date}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.voucher_no}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {parseFloat(row.weight).toFixed(3)}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {Config.numWithComma(row.rate)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Paper>
                      </Grid>
                    </Grid>
                  </>
                )}
                {selectOptions === "0" && (
                  <>
                    <Grid
                      container
                      alignItems="center"
                      style={{ marginBottom: "16px" }}
                    >
                      <Grid item lg={4} md={4} sm={6} xs={12}>
                        <Select
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          autoFocus
                          options={vendorData.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.name,
                          }))}
                          // components={components}
                          value={vendorSelected}
                          onChange={handleVendorNameChange}
                          placeholder="Party Name"
                        />

                        <span style={{ color: "red" }}>
                          {vendorSelectErr.length > 0 ? vendorSelectErr : ""}
                        </span>
                      </Grid>
                    </Grid>
                    <div className="ratematch-main-tabel">
                      <div>
                        <h4>Fix rate</h4>
                      </div>
                      <div>
                        <h4>Temp Rate </h4>
                      </div>
                    </div>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Paper
                          className={clsx(classes.tabroot, "table-responsive")}
                          id="ratematch-tbel-dv"
                        >
                          <Table className={classes.table}>
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  className={classes.tableRowPad}
                                ></TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Date
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Voucher Number
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Weight
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Rate
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rateList.map((row, i) => (
                                <TableRow key={i}>
                                  <TableCell className={classes.tableRowPad}>
                                    <Checkbox
                                      name="selectlot"
                                      type="checkbox"
                                      value={JSON.stringify(row)}
                                      onChange={handleLeftList}
                                      checked={
                                        selectLeft == row.id ? true : false
                                      }
                                    />
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {/* {moment(new Date(row.date)).format("DD-MM-YYYY")} */}
                                    {row.date}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.voucher_no}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {parseFloat(row.balance).toFixed(3)}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {Config.numWithComma(row.rate)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Paper
                          className={clsx(classes.tabroot, "table-responsive")}
                          id="ratematch-tbel-dv"
                        >
                          <Table className={classes.table}>
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  className={classes.tableRowPad}
                                ></TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Date
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Voucher Number
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Weight
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Rate
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {tempRateList.map((row, i) => (
                                <TableRow key={i}>
                                  <TableCell className={classes.tableRowPad}>
                                    <Checkbox
                                      name="selectlot"
                                      type="checkbox"
                                      value={JSON.stringify(row)}
                                      onChange={handleRightList}
                                      checked={
                                        selectRight == row.id ? true : false
                                      }
                                    />
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.date}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.voucher_no}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {parseFloat(row.weight).toFixed(3)}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {Config.numWithComma(row.rate)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Paper>
                      </Grid>
                    </Grid>
                  </>
                )}
                <Grid
                  container
                  style={{
                    flexDirection: "column",
                    alignItems: "flex-end",
                    marginTop: "20px",
                  }}
                >
                  <Grid
                    item
                    sx={12}
                    md={6}
                    style={{
                      fontWeight: "600",
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      width: "100%",
                      marginBottom: "16px",
                      paddingLeft: "16px",
                    }}
                  >
                    <label>
                      <b>FixRateAmt - TempRateAmt =</b>
                    </label>
                    <TextField
                      className="ml-2"
                      value={leftAmt}
                      disabled
                      variant="outlined"
                    />
                    <label style={{ paddingInline: "5px" }}>
                      <b>-</b>
                    </label>
                    <TextField
                      className="ml-2"
                      value={rightAmt}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    sx={12}
                    md={6}
                    style={{
                      fontWeight: "600",
                      justifyContent: "start",
                      display: "flex",
                      width: "100%",
                      marginBottom: "16px",
                      paddingLeft: "16px",
                      alignItems: "center",
                    }}
                  >
                    <label>
                      <b> Difference = </b>
                    </label>
                    <TextField
                      className="ml-2"
                      value={difference}
                      disabled
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item sx={12} md={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      className="w-224 mx-auto mt-16 btn-print-save"
                      aria-label="Register"
                      style={{ float: "right" }}
                      onClick={(e) => {
                        handleFormSubmit(e);
                      }}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default RateMatch;

import React, { useState, useEffect } from "react";
import { InputAdornment, Typography } from "@material-ui/core";
import { Button, TextField, Checkbox } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import History from "@history";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import moment from "moment";
import Select, { createFilter } from "react-select";
import MaUTable from '@material-ui/core/Table';
import Loader from '../../../../Loader/Loader';
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  form: {
    marginTop: "3%",
    display: "contents",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  formControl: {
    // margin: theme.spacing(3),
  },
  group: {
    // margin: theme.spacing(1, 0),

    flexDirection: "row",
  },
  verticalCen: {
    display: "flex",
    alignItems: "center",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
  },
}));


const AddRateFixVendor = (props) => {
  // const isEdit = props.isEdit; //if comes from edit
  // const idToBeEdited = props.editID;

  // const [apiData, setApiData] = useState([]);
  const dispatch = useDispatch();
  const [todayGoldRate, setTodayGoldRate] = useState(0);

  const [selecetedInvoice, setSelectedInvoice] = useState("");
  const [invoiceErr, setInvoiceErr] = useState("");

  const [weight, setWeight] = useState("");
  const [weightErr, setWeightErr] = useState("");

  const [rateValue, setRateValue] = useState("");
  const [rateValueErr, setRateValueErr] = useState("");

  const [totalValue, setTotalValue] = useState("");
  const [totalValueErr, setTotalValueErr] = useState("");

  const [narration, setNarration] = useState("");
  const [narrationErr, setNarrationErr] = useState("");

  // const [listData, setListData] = useState([]);

  const [oldInvWeight, setOldInvWeight] = useState("");
  const [oldInvWeightErr, setOldInvWeightErr] = useState("");

  const [oldInvRateValue, setOldInvRateValue] = useState("");
  const [ldInvRateValueErr, setOldInvRateValueErr] = useState("");

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [vendorData, setVendorData] = useState([]);
  const [vendorSelected, setVendorSelected] = useState("");
  const [vendorSelectErr, setVendorSelectErr] = useState("");

  const [percentageGold, setPercentageGold] = useState("");

  const [tempRateList, setTempRateList] = useState([]);
  const [selectedRateList, setSelectedRateList] = useState("");
  const [fine, setFine] = useState(0);
  const [tempRate, setTempRate] = useState(0);
  const [tempAmt, setTempAmt] = useState("");
  const [FixRate, setFixRate] = useState(0);
  const [FixRateErr, setFixRateErr] = useState("");
  const [difference, setDifference] = useState(0);
  const [refVoucher, setRefVoucher] = useState("");
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const classes = useStyles();
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
    getVendors();
    getTodaysGoldRate();
    getVoucherNumber();
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting('Sales', dispatch)
    //eslint-disable-next-line
  }, []);

  function getVendors() {
    axios
      .get(Config.getCommonUrl() + "api/vendor/listing/listing")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setVendorData(response.data.data);
          // setData(response.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {api : "api/vendor/listing/listing"})

      });
  }


  function getTodaysGoldRate() {
    axios
      .get(Config.getCommonUrl() + "api/goldRateToday")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // setLedgerMainData(response.data.data);
          setPercentageGold(response.data.data.percentage);
          setTodayGoldRate(response.data.data.rate);
        } else {
          dispatch(
            Actions.showMessage({
              message: "Please Set Today's Gold Rate First",
            })
          );
        }
      })
      .catch(function (error) {
        
        handleError(error, dispatch, {api : "api/goldRateToday"})

      });
  }

  function getVoucherNumber() {
    axios
      .get(Config.getCommonUrl() + "api/ratefix/get/voucher?party_type=0")//vendor
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // setProductCategory(response.data.data);
          setVoucherNumber(response.data.data.voucherNo);
          if (response.data.data.allowed_back_date_entry === 1) {
            setAllowedBackDate(true);
            setBackEnteyDays(response.data.data.back_entry_days);
          } else {
            setAllowedBackDate(false);
            setBackEnteyDays(0);
          }
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {api: "api/ratefix/get/voucher?party_type=0"})

      });
  }

  function handlePartyNameChange(value) {
    setVendorSelected(value);
    setVendorSelectErr("");

    // value.value is id field so we have to get index of this id and set gst number from index array
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
   if (name === "weight") {
      setWeight(value);
      if(value>0){
      setWeightErr("");
      }else{
      setWeightErr("Enter valid weight.");       
      }

      if (
        !isNaN(value) &&
        !isNaN(rateValue) &&
        value !== "" &&
        rateValue !== ""
      ) {
        setTotalValue((parseFloat(value) * parseFloat(rateValue)) / 10);
      } else {
        setTotalValue("");
      }
    } else if (name === "rateValue") {
      if (/^\d*\.?\d{0,3}$/.test(value)) {
        setRateValue(value);
      }
      setRateValueErr("");
      if (!isNaN(value) && !isNaN(weight) && value !== "" && weight !== "") {
        setTotalValue((parseFloat(value) * parseFloat(weight)) / 10);
      } else {
        setTotalValue("");
      }
    } else if (name === "voucherDate") {
      setVoucherDate(value);
      setVoucherDtErr("");
    } else if (name === "totalValue") {
      setTotalValue(value);
      setTotalValueErr("");
    } else if (name === "narration") {
      setNarration(value);
      setNarrationErr("");
    } else if (name === "oldInvWeight") {
      setOldInvWeight(value);
      setOldInvWeightErr("");
    } else if (name === "oldInvRateValue") {
      setOldInvRateValue(value);
      setOldInvRateValueErr("");
    }
  }

  function handleChecked(event, id) {
    console.log(event.target.checked, "id", id);
  }

  function weightValidation() {
    var Regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/; // /[1-9][0-9]*(?:\/[1-9][0-9])*/g;
    if (!weight || Regex.test(weight) === false || weight==0) {
      setWeightErr("Please Enter Valid Weight");

      return false;
    }
    return true;
  }

  function ratevalidation() {
    var Regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

    if (!rateValue || Regex.test(rateValue) === false) {
      setRateValueErr("Please Enter Valid Rate");
      return false;
    } else if (
      relDiff(Number(todayGoldRate), Number(rateValue)).toFixed(3) > percentageGold
    ) {
      console.log(relDiff(Number(todayGoldRate), Number(rateValue)).toFixed(3));
      setRateValueErr(
        `Rate Can not be Less or Greater than ${percentageGold} of Today's Gold Rate`
      );
      return false;
    }
    return true;
  }

  function relDiff(a, b) {
    // if (isNaN(+a) || isNaN(+b)){
    //    return log('<b class="warn">input error</b> (a=',a,' b=',b,')');
    // }
    return a - b === 0 ? 0 : 100 * Math.abs((a - b) / b);
  }

  function oldInvRateValidation() {
    var Regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
    if (!oldInvRateValue || Regex.test(oldInvRateValue) === false) {
      setOldInvRateValueErr("Please Enter Valid Rate");
      return false;
    }
    return true;
  }

  function oldInvWeightValidation() {
    var Regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/; // /[1-9][0-9]*(?:\/[1-9][0-9])*/g;
    if (!oldInvWeight || Regex.test(oldInvWeight) === false) {
      setOldInvWeightErr("Please Enter Valid Weight");

      return false;
    }
    return true;
  }

  function voucherNumValidation() {
    if (voucherNumber === "") {
      setVoucherNumErr("Enter Valid Voucher Number");
      return false;
    }
    return true;
  }

  function oldvoucherNumValidation() {
    if (refVoucher === "") {
      dispatch(
        Actions.showMessage({ message: "Select Voucher from list" })
      );
      return false;
    }
    return true;
  }

  function validateFixRate() {
    if (FixRate === "" || FixRate === 0) {
      setFixRateErr("Enter Valid Fix Rate");
      return false;
    }
    return true;
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();
    // resetForm();
    if (selecetedInvoice !== "") {
      if (selecetedInvoice === "1") {
        if (voucherNumValidation() && weightValidation() && ratevalidation()) {
          callAddRateFixVendorApi();
        } else {
        }
      } else {
        if (oldvoucherNumValidation() && validateFixRate()) {
          callOldRateFixApi()
        }
      }
    } else {
      setInvoiceErr("Please Select valid Invoice");
    }
  }

  function callAddRateFixVendorApi() {
    // party_type: 1 client, 0 vendor
    // dataToBeAdded.clientID.value
    // dataToBeAdded.companyId.value

    axios
      .post(Config.getCommonUrl() + "api/ratefix/client", {
        party_type: 0, //vendor
        old_new: parseInt(selecetedInvoice),
        party_id: vendorSelected.value,
        client_compny_id: null, //dataToBeAdded.companyId.value,
        weight: selecetedInvoice === "1" ? weight : oldInvWeight,
        rate: selecetedInvoice === "1" ? rateValue : oldInvRateValue,
        amount: totalValue,
        note: narration,
        ...(allowedBackDate && {
          purchaseCreateDate: voucherDate,
        }),
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data
          // setGoldColor("");
          History.goBack(); //.push("/dashboard/masters/vendors");

          dispatch(
            Actions.showMessage({
              message: response.data.message,
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
        handleError(error, dispatch, {api : "api/ratefix/client",body: {
          party_type: 0, //vendor
          old_new: parseInt(selecetedInvoice),
          party_id: vendorSelected.value,
          client_compny_id: null, //dataToBeAdded.companyId.value,
          weight: selecetedInvoice === "1" ? weight : oldInvWeight,
          rate: selecetedInvoice === "1" ? rateValue : oldInvRateValue,
          amount: totalValue,
          note: narration,
          ...(allowedBackDate && {
            purchaseCreateDate: voucherDate,
          }),
        }})

      });
  }

  function callOldRateFixApi() {
    const body = {
      party_type: 0,
      old_new: 0,
      party_id: vendorSelected.value,
      client_company_id: null,
      weight: fine,
      rate: tempRate,
      refrence_voucher: refVoucher,
      amount: tempAmt,
      fix_rate: FixRate,
      rate_fix_temporary_id : selectedRateList,
      create_date: moment(new Date()).format("DD-MM-YYYY"),
      voucher_date : moment(new Date()).format("DD-MM-YYYY")
    }
    axios
      .post(Config.getCommonUrl() + "api/ratefix/old/fix/rate", body)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          History.goBack(); //.push("/dashboard/masters/vendors");
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
        handleError(error, dispatch, {api : "api/ratefix/old/fix/rate", body:body})

      });
  }

  const handleSelectRateList = (event) => {
    setDifference(0)
    setFixRate(0)
    if (event.target.checked) {
      const rowData = JSON.parse(event.target.value)
      // console.log(rowData)
      setSelectedRateList(rowData.id);
      setFine(rowData.weight)
      setTempRate(rowData.rate)
      setRefVoucher(rowData.voucher_no)
      const preAmt = (rowData.weight * rowData.rate) / 10;
      setTempAmt(preAmt)
    } else {
      setSelectedRateList("")
      setRefVoucher("")
      setFine(0)
      setTempRate(0)
      setTempAmt(0)
    }
  }

  const handleInputRateChange = (event) => {
    const name = event.target.name
    const value = event.target.value

    if (name === "FixRate") {
      setFixRate(value);
      if (value === "" || isNaN(Number(value))) {
        setFixRateErr("Enter Valid Fix Rate")
      } else {
        setFixRateErr("")
      }
      if (value && !isNaN(Number(value))) {
        const fixVal = value;
        const diff = (fine * fixVal) / 10;
        const finalDiff = diff - tempAmt  ;
        setDifference(finalDiff.toFixed(3))
      }
    }
  }

  function handleInvoiceTypeChange(event) {
    setSelectedInvoice(event.target.value);
    if (event.target.value == 0) {
      if (validatePartyName()) {
        callTempRateFixApi()
      } else {
        setSelectedInvoice("")
      }
    }
    setInvoiceErr("");
  }

  function validatePartyName() {
    if (vendorSelected === "") {
      setVendorSelectErr("Please select Party Name");
      return false;
    }
    return true;
  }

  function callTempRateFixApi() {
    setLoading(true);
    axios.get(Config.getCommonUrl() + `api/ratefix/temp/rate/${vendorSelected.value}`)
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
        // console.log(error);
        setLoading(false);
        handleError(error, dispatch, {api : `api/ratefix/temp/rate/${vendorSelected.value}`})
      });
  }  


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={6} sm={5} md={5} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="p-16 pb-8 text-18 font-700">
                    Add Rate Fix Vendor
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={6}
                sm={7}
                md={7}
                key="2"
                style={{ textAlign: "right" }}
              >
                <div className="btn-back mt-2">
                  <Button
                    id="btn-back"
                    size="small"
                    onClick={(event) => {
                      History.goBack();
                    }}
                  >
                    <img
                      className="back_arrow"
                     src={Icones.arrow_left_pagination}
                     alt=""
                    />

                    Back
                  </Button>
                </div>
                {/* <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={(event) => {
                    // History.push("/dashboard/masters/vendors");
                    History.goBack();
                    //   setDefaultView(btndata.id);
                    //   setIsEdit(false);
                  }}
                >
                  Back
                </Button> */}
              </Grid>
            </Grid>
            {loading && <Loader />}

            <div className="main-div-alll ">
              <div
                // className="pb-32 pt-32 pl-16 pr-16"
                className="pb-32"
                style={{ marginBottom: "10%", height: "90%" }}
              >
                {/* {JSON.stringify(contDetails)} */}
                <div>
                  <form
                    name="registerForm"
                    noValidate
                    className="flex flex-col justify-center w-full"
                    onSubmit={handleFormSubmit}
                  >
                    <div className="my-16" style={{ width: "30%" }}>
                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={vendorData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        value={vendorSelected}
                        onChange={handlePartyNameChange}
                        placeholder="Party Name"
                        autoFocus
                        blurInputOnSelect
                        tabSelectsValue={false}
                      />
                      <span style={{ color: "red" }}>
                        {vendorSelectErr.length > 0 ? vendorSelectErr : ""}
                      </span>
                    </div>

                    <FormControl
                      component="fieldset"
                      className={classes.formControl}
                    >
                      <FormLabel component="legend">Invoice :</FormLabel>
                      <RadioGroup
                        aria-label="Invoice"
                        name="Invoice"
                        className={classes.group}
                        value={selecetedInvoice}
                        onChange={handleInvoiceTypeChange}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="New Invoice"
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="Old Invoice"
                        />
                      </RadioGroup>
                      <span style={{ color: "red" }}>
                        {invoiceErr.length > 0 ? invoiceErr : ""}
                      </span>
                    </FormControl>

                    {selecetedInvoice === "1" && (
                      <>
                        <Grid
                          className="department-main-dv p-16 pb-0"
                          container
                          spacing={12}
                          alignItems="stretch"
                          style={{ margin: 0 }}
                        >

                          <Grid item lg={4} md={4} sm={4} xs={12} style={{ padding: 6 }}>
                            <label>Date</label>
                            {allowedBackDate && (
                              <TextField
                                // label="Date"
                                // style={{ width: "30%" }}
                                type="date"
                                // className="mt-16"
                                name="voucherDate"
                                value={voucherDate}
                                error={VoucherDtErr.length > 0 ? true : false}
                                helperText={VoucherDtErr}
                                onChange={(e) => handleInputChange(e)}
                                variant="outlined"
                                // defaultValue={moment().format("yyyy-mm-dd")}
                                required
                                fullWidth
                                // InputProps={{inputProps: { min: moment(new Date("2022-03-17")).format("YYYY-MM-DD"), max: moment().format("YYYY-MM-DD")} }}
                                inputProps={{
                                  min: moment()
                                    .subtract(backEntryDays, "day")
                                    .format("YYYY-MM-DD"),
                                  max: moment().format("YYYY-MM-DD"),
                                }}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                            )}
                          </Grid>

                          <Grid item lg={4} md={4} sm={4} xs={12} style={{ padding: 6 }}>
                            <label>Voucher Number</label>
                            <TextField
                              // style={{ width: "30%" }}
                              // label="Voucher Number"
                              name="voucherNumber"
                              // className="mt-16"
                              value={voucherNumber}
                              error={voucherNumErr.length > 0 ? true : false}
                              helperText={voucherNumErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                              disabled />
                          </Grid>
                        </Grid>

                        <Grid
                          className="department-main-dv p-16 pb-0"
                          container
                          spacing={12}
                          alignItems="stretch"
                          style={{ margin: 0 }}
                        >
                          <Grid item lg={4} md={4} sm={4} xs={12} style={{ padding: 6 }}>
                            <label>Weight</label>
                            <TextField
                              placeholder="Weight"
                              name="weight"
                              value={weight}
                              error={weightErr.length > 0 ? true : false}
                              helperText={weightErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                              InputProps={{
                                endAdornment: <InputAdornment position="end">Gram</InputAdornment>,
                              }}
                            />
                          </Grid>

                          <Grid item lg={4} md={4} sm={4} xs={12} style={{ padding: 6 }}>
                            <label>Rate</label>
                            <TextField
                              placeholder="Rate"
                              name="rateValue"
                              step="0.001"
                              value={rateValue}
                              error={rateValueErr.length > 0 ? true : false}
                              helperText={rateValueErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                              InputProps={{
                                endAdornment: <InputAdornment position="end">/ 10 Gram</InputAdornment>,
                              }}
                            />
                          </Grid>
                        </Grid>

                        <Grid
                          className="department-main-dv p-16 pb-0"
                          container
                          spacing={12}
                          alignItems="stretch"
                          style={{ margin: 0 }}
                        >

                          <Grid item lg={4} md={4} sm={4} xs={12} style={{ padding: 6 }}>
                            <label>Total</label>
                            <TextField
                              className="mb-16"
                              label="Total"
                              type="number"
                              name="totalValue"
                              value={parseFloat(totalValue).toFixed(3)}
                              error={totalValueErr.length > 0 ? true : false}
                              helperText={totalValueErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                              disabled
                            />
                          </Grid>

                          <Grid item lg={4} md={4} sm={4} xs={12} style={{ padding: 6 }}>
                            <label>Narration</label>
                            <TextField
                              className="textarea-p-blg"
                              // style={{ width: "30%" }}
                              placeholder="Narration"
                              name="narration"
                              value={narration}
                              error={narrationErr.length > 0 ? true : false}
                              helperText={narrationErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                              multiline
                              minRows={6}
                              maxrows={6}
                            />
                          </Grid>
                        </Grid>

                      </>
                    )}

                    {selecetedInvoice === "0" && (
                      <div>
                        <div>
                          <Paper
                            className={clsx(
                              classes.tabroot,
                              "table-responsive ratefixvendor_tbl addratefixvendor_tbl"
                            )}
                          >
                            <MaUTable className={classes.table}>
                              <TableHead>
                                  <TableRow>
                                <TableCell className={classes.tableRowPad}></TableCell>
                                <TableCell className={classes.tableRowPad}>Voucher Number</TableCell>
                                <TableCell className={classes.tableRowPad}>Fine</TableCell>
                                <TableCell className={classes.tableRowPad}>Temp Rate</TableCell>
                              </TableRow>
                              </TableHead>
                              <TableBody>
                                {tempRateList.map((row, i) => (
                                   <TableRow key={row.id}>
                                   <TableCell className={classes.tableRowPad}>
                                     <Checkbox name="selectlot" type="checkbox" value={JSON.stringify(row)} onChange={handleSelectRateList} checked={selectedRateList == row.id ? true : false} />
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                     {row.voucher_no}
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                     {row.weight}
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                     {Config.numWithComma(row.rate)}
                                   </TableCell>
                                 </TableRow>
                                ))}
                              </TableBody>
                            </MaUTable>
                          </Paper>
                        </div>

                        {selecetedInvoice === "0" && (
                          <>
                            <div
                              className="mt-5 sub-total-dv"
                              style={{
                                fontWeight: "600",
                                justifyContent: "start",
                                display: "flex",
                              }}
                            >
                              <div
                                style={{ display: "flex", alignItems: "center" }}
                              >
                                <label>
                                  <b>Fine : </b>
                                </label>
                                <label className="ml-2 input-sub-total">
                                  <TextField
                                    className={clsx(classes.inputBoxTEST, "ml-2  addconsumble-dv")}
                                    name="fine"
                                    value={fine}
                                    disabled
                                    variant="outlined"
                                    fullWidth
                                  />
                                </label>
                              </div>
                            </div>

                            <div
                              className="mt-5 sub-total-dv"
                              style={{
                                fontWeight: "600",
                                justifyContent: "start",
                                display: "flex",
                              }}
                            >
                              <div
                                style={{ display: "flex", alignItems: "center" }}
                              >
                                <label>
                                  <b> Temp Rate : </b>
                                </label>
                                <label className="ml-2 input-sub-total">
                                  <TextField
                                    className={clsx(classes.inputBoxTEST, "ml-2  addconsumble-dv")}
                                    name="temprate"
                                    value={tempRate}
                                    disabled
                                    variant="outlined"
                                    fullWidth
                                  />
                                </label>
                              </div>
                            </div>

                            <div
                              className="mt-5 sub-total-dv"
                              style={{
                                fontWeight: "600",
                                justifyContent: "start",
                                display: "flex",
                              }}
                            >
                              <div
                                style={{ display: "flex", alignItems: "center" }}
                              >
                                <label>
                                  <b> Fix Rate : </b>
                                </label>
                                <label className="ml-2 input-sub-total">
                                  <TextField
                                    className={clsx(classes.inputBoxTEST, "ml-2  addconsumble-dv")}
                                    autoFocus
                                    name="FixRate"
                                    value={FixRate}
                                    error={FixRateErr.length > 0 ? true : false}
                                    helperText={FixRateErr}
                                    onChange={(e) => handleInputRateChange(e)}
                                    variant="outlined"
                                    fullWidth
                                  />
                                </label>
                              </div>
                            </div>

                            <div
                              className="mt-5 sub-total-dv"
                              style={{
                                fontWeight: "600",
                                justifyContent: "start",
                                display: "flex",
                              }}
                            >
                              <div
                                style={{ display: "flex", alignItems: "center" }}
                              >
                                <label>
                                  <b> Difference : </b>
                                </label>
                                <label className="ml-2 input-sub-total">
                                  <TextField
                                    className={clsx(classes.inputBoxTEST, "ml-2  addconsumble-dv")}
                                    value={difference}
                                    disabled
                                    variant="outlined"
                                    fullWidth
                                  />
                                </label>
                              </div>
                            </div>

                          </>
                        )}
                      </div>
                    )}
                  </form>

                  <Button
                    variant="contained"
                    color="primary"
                    className="w-224 mx-auto mt-16 btn-print-save"
                    aria-label="Register"
                    style={{ float: "right" }}
                    //   disabled={!isFormValid()}
                    // type="submit"
                    onClick={(e) => {
                      handleFormSubmit(e);
                    }}
                  >
                    Save
                  </Button>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddRateFixVendor;

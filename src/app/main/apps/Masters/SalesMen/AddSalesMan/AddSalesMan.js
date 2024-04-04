import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import History from "@history";
import Select, { createFilter } from "react-select";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  form: {
    marginTop: "3%",
    display: "contents",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const AddSalesMan = (props) => {
  const dispatch = useDispatch();

  const [SalesManName, setSalesManName] = useState("");
  const [SalesManNameErr, setSalesManNameErr] = useState("");

  const [SalesManCode, setSalesManCode] = useState("");
  const [SalesManCodeErr, setSalesManCodeErr] = useState("");

  const [phoneNumOne, setPhoneNumOne] = useState("");
  const [phoneNumOneErr, setPhoneNumOneErr] = useState("");

  const [phoneNumTwo, setPhoneNumTwo] = useState("");
  const [phoneNumTwoErr, setPhoneNumTwoErr] = useState("");

  const [SalesManEmail, setSalesManEmail] = useState("");
  const [SalesManEmailErr, setSalesManEmailErr] = useState("");

  const [mpin, setmpin] = useState("");
  const [mpinErr, setmpinErr] = useState("");

  const [panNumber, setpanNumber] = useState("");
  const [panNumberErr, setpanNumberErr] = useState("");

  const [SalesManAddress, setSalesManAddress] = useState("");
  const [SalesManAddressErr, setSalesManAddressErr] = useState("");

  const [bankName, setBankName] = useState("");
  const [bankNameErr, setBankNameErr] = useState("");

  const [accHolderName, setAccHolderName] = useState("");
  const [accHolderNameErr, setAccHolderNameErr] = useState("");

  // const [tcsOrTdsValue, setTcsOrTdsValue] = useState("");
  // const [tcsOrTdsErr, setTcsOrTdsErr] = useState("");

  const [stateData, setStateData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateErr, setSelectedStateErr] = useState("");

  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryErr, setSelectedCountryErr] = useState("");

  const [cityData, setCityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCityErr, setSelectedCityErr] = useState("");

  const [accType, setAccType] = useState("");
  const [accTypeErr, setAccTypeErr] = useState("");

  const [accNumber, setAccNumber] = useState("");
  const [accNumberErr, setAccNumberErr] = useState("");

  const [pincode, setPincode] = useState("");
  const [pincodeErr, setPincodeErr] = useState("");

  const [IFSCcode, setIFSCcode] = useState("");
  const [IFSCcodeErr, setIFSCcodeErr] = useState("");

  const [mobileNoContry, setMobileNoContry] = useState("");
  const [SecltedmobileNoContry, setSelectedMobileNoContry] = useState("");
  const [mobileNoContryErr, setMobileNoContryErr] = useState("");

  const [secondMobileNoContry, setSecondMobileNoContry] = useState("");
  const [secondSelectedMobileNoContry, setSecondSelectedMobileNoContry] =
    useState("");
  const [secondMobileNoContryErr, setSecondMobileNoContryErr] = useState("");

  const theme = useTheme();

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
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);

  const classes = useStyles();

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "SalesManName") {
      setSalesManName(value);
      setSalesManNameErr("");
    } else if (name === "SalesManCode") {
      setSalesManCodeErr("");
      setSalesManCode(value);
    } else if (name === "phoneNo") {
      setPhoneNumOne(value);
      setPhoneNumOneErr("");
    } else if (name === "phoneNotwo") {
      setPhoneNumTwo(value);
      setPhoneNumTwoErr("");
    } else if (name === "SalesManEmail") {
      setSalesManEmail(value);
      setSalesManEmailErr("");
    } else if (name === "mpin") {
      setmpin(value);
      setmpinErr("");
    } else if (name === "panNumber") {
      setpanNumber(value);
      setpanNumberErr("");
    } else if (name === "address") {
      setSalesManAddress(value);
      setSalesManAddressErr("");
    } else if (name === "accHoldNm") {
      setAccHolderName(value);
      setAccHolderNameErr("");
    } else if (name === "bankName") {
      setBankName(value);
      setBankNameErr("");
    } else if (name === "accType") {
      setAccType(value);
      setAccTypeErr("");
    } else if (name === "accNumber") {
      setAccNumber(value);
      setAccNumberErr("");
    } else if (name === "pincode") {
      setPincode(value);
      setPincodeErr("");
    } else if (name === "IfseCode") {
      setIFSCcode(value);
      setIFSCcodeErr("");
    }
  }

  function SalesManNameValidation() {
    var Regex = /^[a-zA-Z\s]*$/;
    if (!SalesManName || Regex.test(SalesManName) === false) {
      setSalesManNameErr("Enter Valid Salesman Name");
      return false;
    }
    return true;
  }

  function SalesManCodeValidation() {
    var Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (!SalesManCode || Regex.test(SalesManCode) === false) {
      setSalesManCodeErr("Enter Valid Salesman Code");
      return false;
    }
    return true;
  }

  function phoneNumberValidation() {
    var Regex = /^[0-9]{10}$/;
    if (!phoneNumOne || Regex.test(phoneNumOne) === false) {
      setPhoneNumOneErr("Enter Valid Phone Number");
      return false;
    }
    return true;
  }

  function emailValidation() {
    //const Regex = /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g;
    const Regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!SalesManEmail || Regex.test(SalesManEmail) === false) {
      setSalesManEmailErr("Enter Valid Email Id");
      return false;
    }
    return true;
  }

  function mpinvalidation() {
    const Regex = /^(\d{4}|\d{6})$/;
    if (mpin && (mpin.length === 4 || mpin.length === 6)) {
      if (Regex.test(mpin)) {
        return true;
      } else {
        setmpinErr("Enter Valid MPIN");
        return false;
      }
    } else {
      setmpinErr("Enter Valid MPIN");
      return false;
    }
  }

  function validatePAN() {
    var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    if (panNumber && regpan.test(panNumber)) {
      return true;
    } else {
      setpanNumberErr("Enter valid pan number");
      return false;
    }
  }

  function countryValidation() {
    if (selectedCountry === "") {
      setSelectedCountryErr("Please Select Country");
      return false;
    }
    return true;
  }

  function stateValidation() {
    if (selectedState === "") {
      setSelectedStateErr("Please Select State");
      return false;
    }
    return true;
  }

  function cityValidation() {
    if (selectedCity === "") {
      setSelectedCityErr("Please Select City");
      return false;
    }
    return true;
  }

  function accNumberValidation() {
    const Regex = /^[0-9]*$/;
    if (!accNumber || Regex.test(accNumber) === false) {
      setAccNumberErr("Enter Valid Account Number");
      return false;
    }
    return true;
  }

  function pincodeValidation() {
    const Regex = /^(\d{4}|\d{6})$/;
    if (!pincode || Regex.test(pincode) === false) {
      setPincodeErr("Enter Valid pincode");
      return false;
    }
    return true;
  }

  function accTypeValidation() {
    const Regex = /^[a-zA-Z\s]*$/;
    if (!accType || Regex.test(accType) === false) {
      setAccTypeErr("Enter Valid Account Type");
      return false;
    }
    return true;
  }

  function addressValidation() {
    // const Regex = ""; Regex.test(SalesManAddress) === false
    if (!SalesManAddress || SalesManAddress === "") {
      setSalesManAddressErr("Enter Valid Address");
      return false;
    }
    return true;
  }

  function IFSCcodeValidation() {
    const Regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!IFSCcode || Regex.test(IFSCcode) === false) {
      setIFSCcodeErr("Enter Valid IFSC Code");
      return false;
    }
    return true;
  }

  function bankNameVAlidation() {
    const Regex = /^[a-zA-Z\s]*$/;
    if (!bankName || Regex.test(bankName) === false) {
      setBankNameErr("Enter Valid Bank Name");
      return false;
    }
    return true;
  }

  function accHolderNameVAlidation() {
    const Regex = /^[a-zA-Z\s]*$/;
    if (!accHolderName || Regex.test(accHolderName) === false) {
      setAccHolderNameErr("Enter Valid Account Holder Name");
      return false;
    }
    return true;
  }

  function handleChangefirstcode(value) {
    setMobileNoContry(value);
    setSelectedMobileNoContry(value.Ccode);
    setMobileNoContryErr("");
  }

  function handleChangeSecondcode(value) {
    setSecondMobileNoContry(value);
    setSecondSelectedMobileNoContry(value.Ccode);
    setSecondMobileNoContryErr("");
  }

  function countryCodeValidation() {
    if (SecltedmobileNoContry === "") {
      setMobileNoContryErr("Please select country code");
      return false;
    }
    return true;
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();
    // resetForm();

    if (
      SalesManNameValidation() &&
      SalesManCodeValidation() &&
      countryCodeValidation() &&
      phoneNumberValidation() &&
      emailValidation() &&
      mpinvalidation() &&
      validatePAN() &&
      countryValidation() &&
      bankNameVAlidation() &&
      stateValidation() &&
      accHolderNameVAlidation() &&
      cityValidation() &&
      accNumberValidation() &&
      pincodeValidation() &&
      accTypeValidation() &&
      addressValidation() &&
      IFSCcodeValidation()
    ) {
      callAddSalesManApi();
    } else {
    }
  }

  function callAddSalesManApi() {
    let data;
    if (phoneNumTwo !== "") {
      data = {
        account_holder_name: accHolderName,
        account_number: accNumber,
        account_type: accType,
        address: SalesManAddress,
        bank_name: bankName,
        city: selectedCity.value,
        code: SalesManCode,
        country: selectedCountry.value,
        email: SalesManEmail,
        ifsc_code: IFSCcode,
        name: SalesManName,
        number: phoneNumOne,
        sec_number: phoneNumTwo,
        pincode: pincode,
        state: selectedState.value,
        pan_number: panNumber,
        m_pin: mpin,
        first_country_id: mobileNoContry.value,
        second_country_id: secondMobileNoContry.value,
      };
    } else {
      data = {
        account_holder_name: accHolderName,
        account_number: accNumber,
        account_type: accType,
        address: SalesManAddress,
        bank_name: bankName,
        city: selectedCity.value,
        code: SalesManCode,
        country: selectedCountry.value,
        email: SalesManEmail,
        ifsc_code: IFSCcode,
        name: SalesManName,
        number: phoneNumOne,
        // sec_number: phoneNumTwo,
        pincode: pincode,
        state: selectedState.value,
        pan_number: panNumber,
        m_pin: mpin,
        first_country_id: mobileNoContry.value,
        second_country_id: secondMobileNoContry.value,
      };
    }
    axios
      .post(Config.getCommonUrl() + "api/salesMan", data)
      .then(function (response) {
        if (response.data.success === true) {
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
        handleError(error, dispatch, { api: "api/salesMan", body: data });
      });
  }

  useEffect(() => {
    // getStatedata();
    getCountrydata();
    //eslint-disable-next-line
  }, []);

  function getCountrydata() {
    axios
      .get(Config.getCommonUrl() + "api/country")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setCountryData(response.data.data);
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
        handleError(error, dispatch, { api: "api/country" });
      });
  }

  function getStatedata(countryID) {
    axios
      .get(Config.getCommonUrl() + "api/country/state/" + countryID)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStateData(response.data.data);
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
        handleError(error, dispatch, { api: "api/country/state/" + countryID });
      });
  }

  function handleCountryChange(value) {
    setSelectedCountry(value);
    setSelectedCountryErr("");

    setStateData([]);
    setSelectedState("");
    setSelectedStateErr("");

    setCityData([]);
    setSelectedCity("");
    // getCityData(value.value);
    getStatedata(value.value);
  }

  function handleChangeState(value) {
    setSelectedState(value);
    setSelectedStateErr("");
    setCityData([]);
    setSelectedCity("");
    getCityData(value.value);
  }

  function getCityData(stateID) {
    axios
      .get(Config.getCommonUrl() + "api/country/city/" + stateID)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setCityData(response.data.data);
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
        handleError(error, dispatch, { api: "api/country/city/" + stateID });
      });
  }

  function handleChangeCity(value) {
    setSelectedCity(value);
    setSelectedCityErr("");
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={6} sm={5} md={5} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Add New Salesman
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid item xs={6} sm={7} md={7} key="2">
                <div className="btn-back">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    className=""
                    size="small"
                    onClick={(event) => {
                      // History.push("/dashboard/masters/clients");
                      History.goBack();
                      //   setDefaultView(btndata.id);
                      //   setIsEdit(false);
                    }}
                  >
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>
            <div className="main-div-alll ">
              {/* {JSON.stringify(contDetails)} */}
              <div>
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  onSubmit={handleFormSubmit}
                >
                  <div className="w-full flex flex-row flex-wrap  ">
                    <div className="add-textfiled">
                      <p>Salesman name*</p>
                      <TextField
                        className=""
                        placeholder="Enter salesman name"
                        autoFocus
                        name="SalesManName"
                        value={SalesManName}
                        error={SalesManNameErr.length > 0 ? true : false}
                        helperText={SalesManNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>Salesman code*</p>
                      <TextField
                        className=""
                        placeholder="Enter salesman code"
                        name="SalesManCode"
                        value={SalesManCode}
                        error={SalesManCodeErr.length > 0 ? true : false}
                        helperText={SalesManCodeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>

                    <div className="add-textfiled">
                      <p>Mobile number*</p>
                      <div style={{ display: "flex" }}>
                        <div style={{ width: "40%" }}>
                          <Select
                            className="input-select-bdr-dv"
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            classes={classes}
                            styles={selectStyles}
                            placeholder={<div>Country Code</div>}
                            options={countryData.map((suggestion) => ({
                              value: suggestion.id,
                              label: `${suggestion.name} (${suggestion.phonecode})
                            `,
                              Ccode: suggestion.phonecode,
                            }))}
                            value={mobileNoContry}
                            onChange={handleChangefirstcode}
                            // disabled={isView}
                          />
                          <span className={classes.errorMessage}>
                            {mobileNoContryErr.length > 0
                              ? mobileNoContryErr
                              : ""}
                          </span>
                        </div>

                        <div style={{ width: "60%" }}>
                          <TextField
                            className=""
                            placeholder="Enter mobile number"
                            name="phoneNo"
                            value={phoneNumOne}
                            error={phoneNumOneErr.length > 0 ? true : false}
                            helperText={phoneNumOneErr}
                            onChange={(e) => handleInputChange(e)}
                            variant="outlined"
                            required
                            fullWidth
                          />
                        </div>
                      </div>
                    </div>

                    <div className="add-textfiled">
                      <p>Phone number*</p>
                      <div style={{ display: "flex" }}>
                        <div style={{ width: "40%" }}>
                          <Select
                            className="input-select-bdr-dv"
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            classes={classes}
                            styles={selectStyles}
                            placeholder={<div>Country Code</div>}
                            options={countryData.map((suggestion) => ({
                              value: suggestion.id,
                              label: `${suggestion.name} (${suggestion.phonecode})
                            `,
                              Ccode: suggestion.phonecode,
                            }))}
                            value={secondMobileNoContry}
                            onChange={handleChangeSecondcode}
                            // disabled={isView}
                          />
                          <span className={classes.errorMessage}>
                            {secondMobileNoContryErr.length > 0
                              ? secondMobileNoContryErr
                              : ""}
                          </span>
                        </div>

                        <div style={{ width: "60%" }}>
                          <TextField
                            className=""
                            placeholder="Enter phone number"
                            name="phoneNotwo"
                            value={phoneNumTwo}
                            error={phoneNumTwoErr.length > 0 ? true : false}
                            helperText={phoneNumTwoErr}
                            onChange={(e) => handleInputChange(e)}
                            variant="outlined"
                            required
                            fullWidth
                          />
                        </div>
                      </div>
                    </div>
                    <div className="add-textfiled">
                      <p>Email id*</p>
                      <TextField
                        className=""
                        placeholder="Enter email id"
                        name="SalesManEmail"
                        value={SalesManEmail}
                        error={SalesManEmailErr.length > 0 ? true : false}
                        helperText={SalesManEmailErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>MPIN*</p>
                      <TextField
                        className=""
                        placeholder="Enter mpin"
                        name="mpin"
                        value={mpin}
                        error={mpinErr.length > 0 ? true : false}
                        helperText={mpinErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>

                    <div className="add-textfiled">
                      <p>Pan no.</p>
                      <TextField
                        className=""
                        placeholder="Enter pan no"
                        name="panNumber"
                        value={panNumber}
                        error={panNumberErr.length > 0 ? true : false}
                        helperText={panNumberErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>Country</p>
                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={countryData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        placeholder="Select country"
                      />

                      <span style={{ color: "red" }}>
                        {selectedCountryErr.length > 0
                          ? selectedCountryErr
                          : ""}
                      </span>
                    </div>
                    <div className="add-textfiled">
                      <p>State</p>
                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={stateData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        value={selectedState}
                        onChange={handleChangeState}
                        placeholder="Select state"
                      />

                      <span style={{ color: "red" }}>
                        {selectedStateErr.length > 0 ? selectedStateErr : ""}
                      </span>
                    </div>
                    <div className="add-textfiled">
                      <p>City</p>
                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={cityData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        value={selectedCity}
                        onChange={handleChangeCity}
                        placeholder="Select city"
                      />

                      <span style={{ color: "red" }}>
                        {selectedCityErr.length > 0 ? selectedCityErr : ""}
                      </span>
                    </div>
                    <div className="add-textfiled">
                      <p>Pincode*</p>
                      <TextField
                        className=""
                        placeholder="Enter pincode"
                        name="pincode"
                        value={pincode}
                        error={pincodeErr.length > 0 ? true : false}
                        helperText={pincodeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>
                    <div className="add-textfiled addmaster-textara">
                      <p>Address*</p>
                      <TextField
                        className="textarea-input-dv "
                        style={{ background: "white" }}
                        placeholder="Enter address"
                        name="address"
                        value={SalesManAddress}
                        error={SalesManAddressErr.length > 0 ? true : false}
                        helperText={SalesManAddressErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>Bank name*</p>
                      <TextField
                        className=""
                        placeholder="Enter bank name"
                        name="bankName"
                        value={bankName}
                        error={bankNameErr.length > 0 ? true : false}
                        helperText={bankNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>Account holder name*</p>
                      <TextField
                        className=""
                        placeholder="Enter account holder name"
                        name="accHoldNm"
                        value={accHolderName}
                        error={accHolderNameErr.length > 0 ? true : false}
                        helperText={accHolderNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>Account number*</p>
                      <TextField
                        className=""
                        placeholder="Enter account number"
                        name="accNumber"
                        value={accNumber}
                        error={accNumberErr.length > 0 ? true : false}
                        helperText={accNumberErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>IFSC code*</p>
                      <TextField
                        className=""
                        placeholder="Enter ifsc code"
                        name="IfseCode"
                        value={IFSCcode}
                        error={IFSCcodeErr.length > 0 ? true : false}
                        helperText={IFSCcodeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>Account type*</p>
                      <TextField
                        className=""
                        placeholder="Enter account type"
                        name="accType"
                        value={accType}
                        error={accTypeErr.length > 0 ? true : false}
                        helperText={accTypeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>
                  </div>
                </form>

                <Button
                  variant="contained"
                  id="btn-save"
                  className="w-128 mx-auto mt-16 float-right"
                  aria-placeholder="Register"
                  //   disabled={!isFormValid()}
                  // type="submit"
                  onClick={(e) => {
                    handleFormSubmit(e);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddSalesMan;

import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton } from "@material-ui/core";
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
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Modal from "@material-ui/core/Modal";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    // minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  inputBox: {
    // marginTop: 8,
    // padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
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
  selectBox: {
    // marginTop: 8,
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    // marginLeft: 15,
  },
  linkButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    display: "inline",
    margin: 0,
    padding: 0,
    color: "blue",
  },
  rateFixPaper: {
    position: "absolute",
    width: 600,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
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

const AddVendor = (props) => {
  // const isEdit = props.isEdit; //if comes from edit
  // const idToBeEdited = props.editID;
  const [modalStyle] = useState(getModalStyle);
  // const [apiData, setApiData] = useState([]);
  const dispatch = useDispatch();

  const [vendorName, setVendorName] = useState("");
  const [vendorNameErr, setVendorNameErr] = useState("");

  const [vendorCode, setvendorCode] = useState("");
  const [vendorCodeErr, setvendorCodeErr] = useState("");

  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");

  const [GstNumber, setGstNumber] = useState("");
  const [gstNumErr, setGstNumErr] = useState("");

  const [panNumber, setPanNumber] = useState("");
  const [panNumErr, setPanNumErr] = useState("");

  // const [ledgerData, setLedgerData] = useState("");
  // const [ledgerDataErr, setLedgerDataErr] = useState("");

  // const [dateValue, setDateValue] = useState("");
  // const [dateValueErr, setDateValueErr] = useState("");

  // const [rateValue, setRateValue] = useState("");
  // const [rateValueErr, setRateValueErr] = useState("");

  const [phoneNumOne, setPhoneNumOne] = useState("");
  const [phoneNumOneErr, setPhoneNumOneErr] = useState("");

  const [phoneNumTwo, setPhoneNumTwo] = useState("");
  const [phoneNumTwoErr, setPhoneNumTwoErr] = useState("");

  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorEmailErr, setVendorEmailErr] = useState("");

  const [vendorAddress, setVendorAddress] = useState("");
  const [vendorAddressErr, setVendorAddressErr] = useState("");

  // const [country, setCountry] = useState("");
  // const [countryErr, setCountryErr] = useState("");

  const [bankName, setBankName] = useState("");
  const [bankNameErr, setBankNameErr] = useState("");

  const [accHolderName, setAccHolderName] = useState("");
  const [accHolderNameErr, setAccHolderNameErr] = useState("");

  const [tcsOrTdsValue, setTcsOrTdsValue] = useState("");
  const [tcsOrTdsErr, setTcsOrTdsErr] = useState("");

  const [partyTypeData, setPartyTypeData] = useState([]);
  const [partyType, setPartyType] = useState("");
  const [partyTypeErr, setPartyTypeErr] = useState("");

  const [gstType, setGstType] = useState("1");
  const [gstTypeErr, setGstTypeErr] = useState("");

  const [status, setStatus] = useState("");
  const [statusErr, setStatusErr] = useState("");

  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryErr, setSelectedCountryErr] = useState("");

  const [stateData, setStateData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateErr, setSelectedStateErr] = useState("");

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

  const theme = useTheme();

  // const [ledgerMainData, setLedgerMainData] = useState([]);
  // const [selectMainLedger, setSelectMainLedger] = useState("");
  // const [selMainLedgerErr, setSelMainLedgerErr] = useState("");

  const [voucherModalOpen, setvoucherModalOpen] = useState(false);
  // const [changeRateErr, setChangeRateErr] = useState("");

  // const [ledgerRateApiData, setLedgerRateApiData] = useState([]); // all ledger Data

  // const [selectedLedgerData, setSelectedLedgerData] = useState([]); // selected Ledger Rate and Date Data

  const [rateProfData, setRateProfData] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedProfErrTxt, setSelectedProfErrTxt] = useState("");

  const [isView, setIsView] = useState(false);
  const [mobileNoContry, setMobileNoContry] = useState("");
  const [SecltedmobileNoContry, setSelectedMobileNoContry] = useState("");
  const [mobileNoContryErr, setMobileNoContryErr] = useState("");

  const [secondMobileNoContry, setSecondMobileNoContry] = useState("");
  const [secondSelectedMobileNoContry, setSecondSelectedMobileNoContry] =
    useState("");
  const [secondMobileNoContryErr, setSecondMobileNoContryErr] = useState("");

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
  }, []);

  const classes = useStyles();

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "vendorName") {
      setVendorName(value);
      setVendorNameErr("");
    } else if (name === "vendorCode") {
      setvendorCodeErr("");
      setvendorCode(value);
    } else if (name === "firmName") {
      setFirmName(value);
      setFirmNameErr("");
    } else if (name === "GstNumber") {
      setGstNumber(value);
      setGstNumErr("");
    } else if (name === "phoneNo") {
      setPhoneNumOne(value);
      setPhoneNumOneErr("");
    } else if (name === "phoneNotwo") {
      setPhoneNumTwo(value);
      setPhoneNumTwoErr("");
    } else if (name === "vendorEmail") {
      setVendorEmail(value);
      setVendorEmailErr("");
    } else if (name === "address") {
      setVendorAddress(value);
      setVendorAddressErr("");
    } else if (name === "panNumber") {
      setPanNumber(value);
      setPanNumErr("");
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

  function countryCodeValidation() {
    if (SecltedmobileNoContry === "") {
      setMobileNoContryErr("Please select country code");
      return false;
    }
    return true;
  }

  function vendorNameValidation() {
    var Regex = /^[a-zA-Z\s]*$/;
    if (!vendorName || Regex.test(vendorName) === false) {
      setVendorNameErr("Enter Valid Vendor Name");
      return false;
    }
    return true;
  }

  function vendorCodeValidation() {
    var Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (!vendorCode || Regex.test(vendorCode) === false) {
      setvendorCodeErr("Enter Valid Vendor Code");
      return false;
    }
    return true;
  }

  function firmNameValidation() {
    var Regex = /^[a-zA-Z0-9 ]+$/;
    if (!firmName || Regex.test(firmName) === false) {
      setFirmNameErr("Enter Valid Firm Name");
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
    if (!vendorEmail || Regex.test(vendorEmail) === false) {
      setVendorEmailErr("Enter Valid Email Id");
      return false;
    }
    return true;
  }

  function gstTypeValidation() {
    if (gstType === "") {
      setGstTypeErr("Please select Type");
      return false;
    }
    return true;
  }

  function gstNumberValidation() {
    const Regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    // /^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;
    if (!GstNumber || Regex.test(String(GstNumber)) === false) {
      setGstNumErr(
        "Gst number must be contain state-code, pan number and 14th character z."
      );
      return false;
    }
    return true;
  }

  function tcsOrTdsValidation() {
    if (tcsOrTdsValue === "") {
      setTcsOrTdsErr("Please Select Valid Option");
      return false;
    }
    return true;
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
    // const Regex = ""; Regex.test(vendorAddress) === false
    if (!vendorAddress || vendorAddress === "") {
      setVendorAddressErr("Enter Valid Address");
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

  function StatusValidation() {
    if (status === "") {
      setStatusErr("Please Select Status");
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

  function panNumberValidation() {
    const Regex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    if (!panNumber || Regex.test(panNumber) === false) {
      setPanNumErr("Enter Valid Pan Number");
      return false;
    }
    return true;
  }

  function partyTypeValidation() {
    if (partyType === "") {
      setPartyTypeErr("Please select party type");
      return false;
    }
    return true;
  }

  function rateProfileValidation() {
    if (selectedProfile === "") {
      setSelectedProfErrTxt("Please Select Rate Profile");
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

  function handleFormSubmit(ev) {
    ev.preventDefault();
    // resetForm();

    if (
      vendorNameValidation() &&
      vendorCodeValidation() &&
      firmNameValidation() &&
      partyTypeValidation() &&
      countryCodeValidation() &&
      phoneNumberValidation() &&
      emailValidation() &&
      gstTypeValidation() &&
      panNumberValidation() &&
      tcsOrTdsValidation() &&
      countryValidation() &&
      bankNameVAlidation() &&
      stateValidation() &&
      accHolderNameVAlidation() &&
      cityValidation() &&
      accNumberValidation() &&
      pincodeValidation() &&
      accTypeValidation() &&
      addressValidation() &&
      IFSCcodeValidation() &&
      StatusValidation() &&
      rateProfileValidation()
    ) {
      if (gstType === "1") {
        //check for gst number
        if (gstNumberValidation()) {
          // <option value="1">TCS </option>
          // <option value="2">TDS </option>
          // <option value="0"> NA</option>
          callAddVendorApi();
        }
      } else {
        callAddVendorApi();
      }
    }
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

  function callAddVendorApi() {
    axios
      .post(Config.getCommonUrl() + "api/vendor", {
        first_country_id: mobileNoContry.value,
        second_country_id: secondMobileNoContry.value,
        code: vendorCode,
        name: vendorName,
        type_id: partyType.value,
        number: phoneNumOne,
        sec_number: phoneNumTwo,
        email: vendorEmail,
        address: vendorAddress,
        country: selectedCountry.value,
        state: selectedState.value,
        city: selectedCity.value,
        pincode: pincode,
        bank_name: bankName,
        account_holder_name: accHolderName,
        account_number: accNumber,
        account_type: accType,
        ifsc_code: IFSCcode,
        firm_name: firmName,
        gst_type: parseInt(gstType),
        gst_number: GstNumber,
        pan_number: panNumber,
        is_tds_tcs: parseInt(tcsOrTdsValue),
        // ledger_id: selectMainLedger.value,
        // change_date: dateValue,
        // rate: rateValue,
        status: parseInt(status),
        rate_profile_id: selectedProfile.value,
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
        handleError(error, dispatch, {
          api: "api/vendor",
          body: {
            code: vendorCode,
            name: vendorName,
            type_id: partyType.value,
            number: phoneNumOne,
            sec_number: phoneNumTwo,
            email: vendorEmail,
            address: vendorAddress,
            country: selectedCountry.value,
            state: selectedState.value,
            city: selectedCity.value,
            pincode: pincode,
            bank_name: bankName,
            account_holder_name: accHolderName,
            account_number: accNumber,
            account_type: accType,
            ifsc_code: IFSCcode,
            firm_name: firmName,
            gst_type: parseInt(gstType),
            gst_number: GstNumber,
            pan_number: panNumber,
            is_tds_tcs: parseInt(tcsOrTdsValue),
            // ledger_id: selectMainLedger.value,
            // change_date: dateValue,
            // rate: rateValue,
            status: parseInt(status),
            rate_profile_id: selectedProfile.value,
            first_country_id: mobileNoContry.value,
            second_country_id: secondMobileNoContry.value,
          },
        });
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

  useEffect(() => {
    getCountrydata();
    getPartyType();
    getRateProfileData();
    //eslint-disable-next-line
  }, []);

  function getRateProfileData() {
    axios
      .get(Config.getCommonUrl() + "api/jobworkerRateProfile")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setRateProfData(response.data.data);
          // setData(response.data);
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
        handleError(error, dispatch, { api: "api/jobworkerRateProfile" });
      });
  }

  function getPartyType() {
    axios
      .get(Config.getCommonUrl() + "api/vendor/type/list")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // setPartyTypeData(response.data.data);

          const key = Object.values(response.data.data);
          const values = Object.keys(response.data.data);

          let temp = [];

          for (let i = 0; i < values.length; i++) {
            temp.push({
              value: values[i],
              label: key[i],
            });
          }
          setPartyTypeData(temp);
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
        handleError(error, dispatch, { api: "api/vendor/type/list" });
      });
  }

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

  function handleChange(event) {
    setGstType(event.target.value);
    setGstTypeErr("");
  }

  function handleChangeStatus(event) {
    setStatus(event.target.value);
    setStatusErr("");
  }

  function handleProfileChange(value) {
    setSelectedProfile(value);
    setSelectedProfErrTxt("");
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

  function handleVoucherModalClose() {
    setvoucherModalOpen(false);
  }

  function handleTcsTdsChange(e) {
    let value = e.target.value;
    setTcsOrTdsValue(value);
    setTcsOrTdsErr("");
  }

  function handleChangePartyType(value) {
    setPartyType(value);
    setPartyTypeErr("");
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
                    Add New Vendor
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
                      History.goBack();
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
                      <p>Vendor name*</p>
                      <TextField
                        className=""
                        placeholder="Enter party name"
                        autoFocus
                        name="vendorName"
                        value={vendorName}
                        error={vendorNameErr.length > 0 ? true : false}
                        helperText={vendorNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>Vendor code*</p>
                      <TextField
                        className=""
                        placeholder="Enter party code"
                        name="vendorCode"
                        value={vendorCode}
                        error={vendorCodeErr.length > 0 ? true : false}
                        helperText={vendorCodeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>Firm name*</p>
                      <TextField
                        className=""
                        placeholder="Enter firm name"
                        name="firmName"
                        value={firmName}
                        error={firmNameErr.length > 0 ? true : false}
                        helperText={firmNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>Type (Distributor or Retailer)</p>
                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={partyTypeData}
                        value={partyType}
                        onChange={handleChangePartyType}
                        placeholder="Type (Distributor or Retailer)"
                      />
                      <span style={{ color: "red" }}>
                        {partyTypeErr.length > 0 ? partyTypeErr : ""}
                      </span>
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
                            value={mobileNoContry}
                            onChange={handleChangefirstcode}
                            disabled={isView}
                          />
                          <span
                            className={classes.errorMessage}
                            style={{ bottom: "-10px" }}
                          >
                            {mobileNoContryErr.length > 0
                              ? mobileNoContryErr
                              : ""}
                          </span>
                        </div>

                        <div style={{ width: "60%" }}>
                          <TextField
                            className=""
                            placeholder="Phone No"
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
                            value={secondMobileNoContry}
                            onChange={handleChangeSecondcode}
                            disabled={isView}
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
                            placeholder="Enter mobile no"
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
                      <p>Email id</p>
                      <TextField
                        className=""
                        placeholder="Enter email id"
                        name="vendorEmail"
                        value={vendorEmail}
                        error={vendorEmailErr.length > 0 ? true : false}
                        helperText={vendorEmailErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>
                    <div className="add-textfiled"></div>
                    <div className="add-textfiled"></div>
                    <div className="add-textfiled"></div>
                  </div>
                  <div className="w-full flex flex-row flex-wrap  ">
                    <div className="add-textfiled">
                      <FormControl
                        component="fieldset"
                        className={classes.formControl}
                      >
                        <FormLabel component="legend">GST type :</FormLabel>
                        <RadioGroup
                          aria-label="GST Type "
                          name="GSTType"
                          className={classes.group}
                          value={gstType}
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="Registered"
                          />
                          <FormControlLabel
                            value="0"
                            control={<Radio />}
                            label="UnRegistered"
                          />
                        </RadioGroup>
                        <span style={{ color: "red" }}>
                          {gstTypeErr.length > 0 ? gstTypeErr : ""}
                        </span>
                      </FormControl>
                    </div>
                    {gstType === "1" && (
                      <>
                        <div className="add-textfiled">
                          <p>GST number</p>
                          <TextField
                            className=""
                            placeholder="Enter gst number"
                            name="GstNumber"
                            value={GstNumber}
                            error={gstNumErr.length > 0 ? true : false}
                            helperText={gstNumErr}
                            onChange={(e) => handleInputChange(e)}
                            variant="outlined"
                            required
                            fullWidth
                          />
                        </div>
                      </>
                    )}
                    <div className="add-textfiled">
                      <p>Pan no.</p>
                      <TextField
                        className=""
                        placeholder="Enter pan no"
                        name="panNumber"
                        value={panNumber}
                        error={panNumErr.length > 0 ? true : false}
                        helperText={panNumErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>TCS/TDS/NA</p>
                      <select
                        className={classes.selectBox}
                        required
                        value={tcsOrTdsValue}
                        onChange={(e) => {
                          handleTcsTdsChange(e);
                        }}
                      >
                        <option hidden value="">
                          Select tcs/tds/na
                        </option>
                        <option value="1">TCS </option>
                        <option value="2">TDS </option>
                        <option value="0"> NA</option>
                      </select>

                      <span style={{ color: "red" }}>
                        {tcsOrTdsErr.length > 0 ? tcsOrTdsErr : ""}
                      </span>
                    </div>
                    <div className="add-textfiled"></div>
                  </div>
                  <div className="w-full flex flex-row flex-wrap  ">
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
                    </div>{" "}
                    <div className="add-textfiled">
                      <p>Pincode</p>
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
                    <div className="add-textfiled">
                      <p>Address</p>
                      <TextField
                        placeholder="Enter address"
                        name="address"
                        value={vendorAddress}
                        error={vendorAddressErr.length > 0 ? true : false}
                        helperText={vendorAddressErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>Bank name</p>
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
                      <p>Account holder name</p>
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
                      <p>Account number</p>
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
                      <p>Account type</p>
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
                    <div className="add-textfiled">
                      <p>IFSC code</p>
                      <TextField
                        className="mb-16"
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
                      <FormControl
                        component="fieldset"
                        className={classes.formControl}
                      >
                        <FormLabel component="legend">Status :</FormLabel>
                        <RadioGroup
                          aria-label="Status"
                          name="status"
                          className={classes.group}
                          value={status}
                          onChange={handleChangeStatus}
                        >
                          <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="Active"
                          />
                          <FormControlLabel
                            value="2"
                            control={<Radio />}
                            label="Deactive"
                          />
                        </RadioGroup>
                        <span style={{ color: "red" }}>
                          {statusErr.length > 0 ? statusErr : ""}
                        </span>
                      </FormControl>
                    </div>
                    <div className="add-textfiled">
                      <p>Rate profile</p>
                      <Select
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        classes={classes}
                        styles={selectStyles}
                        options={rateProfData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.profile_name,
                        }))}
                        // components={components}
                        value={selectedProfile}
                        onChange={handleProfileChange}
                        placeholder="Select rate profile"
                      />

                      <span style={{ color: "red" }}>
                        {selectedProfErrTxt.length > 0
                          ? selectedProfErrTxt
                          : ""}
                      </span>
                    </div>
                    <div className="add-textfiled"></div>
                    <div className="add-textfiled"></div>
                    <div className="add-textfiled">
                      <Button
                        id="btn-save"
                        variant="contained"
                        color="primary"
                        className="w-128 mx-auto mt-16 float-right"
                        aria-label="Register"
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
                </form>
              </div>
            </div>

            <Modal
              // disableBackdropClick rfModalOpen, setRfModalOpen
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={voucherModalOpen}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleVoucherModalClose();
                }
              }}
            >
              <div style={modalStyle} className={classes.rateFixPaper}>
                <h5
                  className="p-5"
                  style={{
                    textAlign: "center",
                    backgroundColor: "black",
                    color: "white",
                  }}
                >
                  All Rates
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={handleVoucherModalClose}
                  >
                    <Icon style={{ color: "white" }}>close</Icon>
                  </IconButton>
                </h5>

                <div className="p-5 pl-16 pr-16">
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          align="center"
                        >
                          Date
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="center"
                        >
                          Rate (%)
                        </TableCell>
                        {/* <TableCell
                          className={classes.tableRowPad}
                          align="center"
                        ></TableCell> */}
                      </TableRow>
                    </TableHead>
                  </Table>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddVendor;

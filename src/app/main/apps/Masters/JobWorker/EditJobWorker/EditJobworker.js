import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton } from "@material-ui/core";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import History from "@history";
import Select, { createFilter } from "react-select";
import moment from "moment";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
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

const EditJobworker = (props) => {
  const dataToBeEdited = props.location.state;
  const [isViewOnly, setIsViewOnly] = useState(false);

  const [modalStyle] = useState(getModalStyle);

  const dispatch = useDispatch();

  const [jobWorkerName, setJobWorkerName] = useState("");
  const [jobWorkerNameErr, setJobWorkerNameErr] = useState("");

  const [jobWrokerCode, setJobWrokerCode] = useState("");
  const [jobWrokerCodeErr, setJobWrokerCodeErr] = useState("");

  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");

  const [GstNumber, setGstNumber] = useState("");
  const [gstNumErr, setGstNumErr] = useState("");

  const [panNumber, setPanNumber] = useState("");
  const [panNumErr, setPanNumErr] = useState("");

  // const [ledgerData, setLedgerData] = useState("");
  // const [ledgerDataErr, setLedgerDataErr] = useState("");

  const [dateValue, setDateValue] = useState("");
  const [dateValueErr, setDateValueErr] = useState("");

  const [rateValue, setRateValue] = useState("");
  const [rateValueErr, setRateValueErr] = useState("");

  const [phoneNumOne, setPhoneNumOne] = useState("");
  const [phoneNumOneErr, setPhoneNumOneErr] = useState("");

  const [phoneNumTwo, setPhoneNumTwo] = useState("");
  const [phoneNumTwoErr, setPhoneNumTwoErr] = useState("");

  const [jobWrokerEmail, setJobWrokerEmail] = useState("");
  const [jobWrokerEmailErr, setJobWrokerEmailErr] = useState("");

  const [jobWrokerAddress, setJobWrokerAddress] = useState("");
  const [jobWrokerAddressErr, setJobWrokerAddressErr] = useState("");

  const [bankName, setBankName] = useState("");
  const [bankNameErr, setBankNameErr] = useState("");

  const [accHolderName, setAccHolderName] = useState("");
  const [accHolderNameErr, setAccHolderNameErr] = useState("");

  const [tcsOrTdsValue, setTcsOrTdsValue] = useState("");
  const [tcsOrTdsErr, setTcsOrTdsErr] = useState("");

  // const [partyTypeData, setPartyTypeData] = useState([]);
  // const [partyType, setPartyType] = useState("");
  // const [partyTypeErr, setPartyTypeErr] = useState("");

  const [gstType, setGstType] = useState("1");
  const [gstTypeErr, setGstTypeErr] = useState("");

  const [status, setStatus] = useState("");
  const [statusErr, setStatusErr] = useState("");

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

  const [rateProfData, setRateProfData] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedProfErrTxt, setSelectedProfErrTxt] = useState("");

  const theme = useTheme();

  const [ledgerMainData, setLedgerMainData] = useState([]);
  const [selectMainLedger, setSelectMainLedger] = useState("");
  const [selMainLedgerErr, setSelMainLedgerErr] = useState("");

  const [voucherModalOpen, setvoucherModalOpen] = useState(false);
  // const [changeRateErr, setChangeRateErr] = useState("");

  const [ledgerRateApiData, setLedgerRateApiData] = useState([]); // all ledger Data

  const [selectedLedgerData, setSelectedLedgerData] = useState([]); // selected Ledger Rate and Date Data

  const [HSNMasterData, setHSNMasterData] = useState([]); // hsn details dropdown

  const [HSNMasterErrTxt, setHSNMasterErrTxt] = useState("");
  const [hsnSelected, setHsnSelected] = useState("");

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
    //eslint-disable-next-line
  }, []);

  const classes = useStyles();

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "jobWorkerName") {
      setJobWorkerName(value);
      setJobWorkerNameErr("");
    } else if (name === "jobWrokerCode") {
      setJobWrokerCodeErr("");
      setJobWrokerCode(value);
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
    } else if (name === "jobWrokerEmail") {
      setJobWrokerEmail(value);
      setJobWrokerEmailErr("");
    } else if (name === "address") {
      setJobWrokerAddress(value);
      setJobWrokerAddressErr("");
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

  function jobWorkerNameValidation() {
    var Regex = /^[a-zA-Z\s]*$/;
    if (!jobWorkerName || Regex.test(jobWorkerName) === false) {
      setJobWorkerNameErr("Enter Valid job Worker Name");
      return false;
    }
    return true;
  }

  function jobWrokerCodeValidation() {
    var Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (!jobWrokerCode || Regex.test(jobWrokerCode) === false) {
      setJobWrokerCodeErr("Enter Valid Job Worker Code");
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
    if (!jobWrokerEmail || Regex.test(jobWrokerEmail) === false) {
      setJobWrokerEmailErr("Enter Valid Email Id");
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

  function HsnNumValidation() {
    // var Regex = /^[a-zA-Z0-9 ]+$/;
    if (hsnSelected === "") {
      setHSNMasterErrTxt("Enter Valid HSN Number");
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
    // const Regex = ""; Regex.test(jobWrokerAddress) === false
    if (!jobWrokerAddress || jobWrokerAddress === "") {
      setJobWrokerAddressErr("Enter Valid Address");
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

  function ledgerForSaleValidation() {
    if (selectMainLedger === "") {
      setSelMainLedgerErr("Select Valid Ledger For Sale");
      return false;
    }
    return true;
  }

  function dateValidation() {
    const Regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    if (!dateValue || Regex.test(dateValue) === false) {
      setDateValueErr("Enter Valid Date");
      return false;
    }
    return true;
  }

  function rateValueValidation() {
    const Regex = /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/;
    if (!rateValue || Regex.test(rateValue) === false) {
      setRateValueErr("Enter Valid Rate");
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
      jobWorkerNameValidation() &&
      jobWrokerCodeValidation() &&
      firmNameValidation() &&
      phoneNumberValidation() &&
      emailValidation() &&
      gstTypeValidation() &&
      panNumberValidation() &&
      tcsOrTdsValidation() &&
      countryValidation() &&
      HsnNumValidation() &&
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
          if (tcsOrTdsValue === "0") {
            callEditJobWorkerApi();
          } else {
            if (
              ledgerForSaleValidation() &&
              dateValidation() &&
              rateValueValidation()
            ) {
              callEditJobWorkerApi();
            }
          }
        }
      } else {
        //no need to check for gst
        if (tcsOrTdsValue === "0") {
          callEditJobWorkerApi();
        } else {
          if (
            ledgerForSaleValidation() &&
            dateValidation() &&
            rateValueValidation()
          ) {
            callEditJobWorkerApi();
          }
        }
      }
    }
  }

  function callEditJobWorkerApi() {
    let data;
    if (phoneNumTwo !== "") {
      data = {
        code: jobWrokerCode,
        name: jobWorkerName,
        number: phoneNumOne,
        sec_number: phoneNumTwo,
        email: jobWrokerEmail,
        address: jobWrokerAddress,
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
        ledger_id: selectMainLedger.value,
        hsn_number_id: hsnSelected.value,
        // change_date: dateValue,
        // rate: rateValue,
        status: parseInt(status),
        rate_profile_id: selectedProfile.value,
        first_country_id: mobileNoContry.value,
        second_country_id: secondMobileNoContry.value,
      };
    } else {
      data = {
        code: jobWrokerCode,
        name: jobWorkerName,
        number: phoneNumOne,
        email: jobWrokerEmail,
        address: jobWrokerAddress,
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
        ledger_id: selectMainLedger.value,
        hsn_number_id: hsnSelected.value,
        // change_date: dateValue,
        // rate: rateValue,
        status: parseInt(status),
        rate_profile_id: selectedProfile.value,
        first_country_id: mobileNoContry.value,
      };
    }
    axios
      .put(
        Config.getCommonUrl() + "api/jobworker/" + dataToBeEdited.row.id,
        data
      )
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
          api: "api/jobworker/" + dataToBeEdited.row.id,
          body: data,
        });
      });
  }

  useEffect(() => {
    getCountrydata();
    getRateProfileData();
    getHSNData();
    //eslint-disable-next-line
  }, []);

  function getHSNData() {
    axios
      .get(Config.getCommonUrl() + "api/hsnmaster")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setHSNMasterData(response.data.data);
          let data = response.data.data;
          const findIndex = data.findIndex(
            (a) => a.id === dataToBeEdited.row.hsn_number_id
          );
          if (findIndex > -1) {
            setHsnSelected({
              value: dataToBeEdited.row.hsn_number_id,
              label: data[findIndex].hsn_number,
            });
          }
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
        handleError(error, dispatch, { api: "api/hsnmaster" });
      });
  }

  useEffect(() => {
    //
    setIsViewOnly(dataToBeEdited.isViewOnly);
    setJobWorkerName(dataToBeEdited.row.name);
    setJobWrokerCode(dataToBeEdited.row.code);
    setFirmName(dataToBeEdited.row.firm_name);
    setMobileNoContry({
      value: dataToBeEdited.row.country_name.id,
      label: `${dataToBeEdited.row.country_name.name} (${dataToBeEdited.row.country_name.phonecode})`,
      Ccode: dataToBeEdited.row.country_name.phonecode,
    });

    if (dataToBeEdited.row.second_country_id !== null) {
      setSecondMobileNoContry({
        value: dataToBeEdited.row.second_country.id,
        label: `${dataToBeEdited.row.second_country.name} (${dataToBeEdited.row.second_country.phonecode})`,
        Ccode: dataToBeEdited.row.second_country.phonecode,
      });
    }
    setPhoneNumOne(dataToBeEdited.row.number);
    setPhoneNumTwo(
      dataToBeEdited.row.sec_number !== null
        ? dataToBeEdited.row.sec_number
        : ""
    );
    setJobWrokerEmail(dataToBeEdited.row.email);
    setJobWrokerAddress(dataToBeEdited.row.address);
    setPanNumber(dataToBeEdited.row.pan_number);
    // setLedgerData(
    //   dataToBeEdited.row.ledger_for_sale !== null
    //     ? dataToBeEdited.row.ledger_for_sale
    //     : ""
    // );
    // setDateValue(dataToBeEdited.row.change_date);
    // setRateValue(dataToBeEdited.row.tds_tcs_rate);
    // setCountry(dataToBeEdited.row.country);
    setAccHolderName(dataToBeEdited.row.account_holder_name);
    setBankName(dataToBeEdited.row.bank_name);
    setAccType(dataToBeEdited.row.account_type);
    setAccNumber(dataToBeEdited.row.account_number);
    setPincode(dataToBeEdited.row.pincode);
    setIFSCcode(dataToBeEdited.row.ifsc_code);
    setGstType(dataToBeEdited.row.gst_type === "register" ? "1" : "0");
    //if gst type condition setGstNumber(dataToBeEdited.row.gst_number);
    if (dataToBeEdited.row.gst_type === "register") {
      setGstNumber(dataToBeEdited.row.gst_number);
    }
    let value = dataToBeEdited.row.is_tds_tcs.toString();

    setTcsOrTdsValue(value);
    if (value !== "0") {
      getAllLedgerFromAccount(value === "1" ? "tcs" : "tds");
    }
    setSelectedCountry({
      value: dataToBeEdited.row.country_name.id,
      label: dataToBeEdited.row.country_name.name,
    });
    getStatedata(dataToBeEdited.row.country_name.id, true);
    setStatus(dataToBeEdited.row.status.toString());
    getCityData(dataToBeEdited.row.state_name.id);
    setSelectedCity({
      value: dataToBeEdited.row.city_name.id,
      label: dataToBeEdited.row.city_name.name,
    });
    //eslint-disable-next-line
  }, [dataToBeEdited]);

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

  function getRateProfileData() {
    axios
      .get(Config.getCommonUrl() + "api/jobworkerRateProfile")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setRateProfData(response.data.data);
          // setData(response.data);

          setSelectedProfile({
            value: dataToBeEdited.row.JobWorkerRateProfile.id,
            label: dataToBeEdited.row.JobWorkerRateProfile.profile_name,
          });
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

  function getStatedata(countryID, flag) {
    axios
      .get(Config.getCommonUrl() + "api/country/state/" + countryID)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStateData(response.data.data);
          if (flag === true) {
            const stateArr = response.data.data;
            stateArr.map((stateVal) => {
              if (stateVal.id === dataToBeEdited.row.state_name.id) {
                setSelectedState({
                  value: stateVal.id,
                  label: stateVal.name,
                });
              }
              return true;
            });
          }
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

  function handleProfileChange(value) {
    setSelectedProfile(value);
    setSelectedProfErrTxt("");
  }

  function handleChange(event) {
    setGstType(event.target.value);
    setGstTypeErr("");
  }

  function handleChangeStatus(event) {
    setStatus(event.target.value);
    setStatusErr("");
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
    getStatedata(value.value, false);
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

  function checkRate(e) {
    e.preventDefault();
    setvoucherModalOpen(true);
  }

  function handleVoucherModalClose() {
    setvoucherModalOpen(false);
  }

  function handleTcsTdsChange(e) {
    let value = e.target.value;
    setTcsOrTdsValue(value);
    setTcsOrTdsErr("");
    if (value !== "0") {
      // value="1" TCS
      // value="2" TDS
      getAllLedgerFromAccount(value === "1" ? "tcs" : "tds");
    } else {
      setLedgerMainData([]);
      setLedgerRateApiData([]);
      setSelectedLedgerData([]);
      setSelectMainLedger("");
      setDateValue("");
      setRateValue("");
    }
  }

  function getAllLedgerFromAccount(val) {
    //showing list in popup in main page

    axios
      .get(Config.getCommonUrl() + "api/ledgerMastar/" + val)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let ledgerPopupData = response.data.data;
          setLedgerRateApiData(ledgerPopupData);

          let tempArray = [];
          let allData = [];

          for (let item of ledgerPopupData) {
            let ledgerNm = item.Ledger.name;
            let LedgerId = item.id;

            //other array for select dropdown name and id only
            tempArray.push({
              name: ledgerNm,
              id: LedgerId,
            });

            for (let d of item.LedgerRate) {
              allData.push({
                name: ledgerNm,
                id: LedgerId,
                isEditing: false,
                rate: d.rate,
                change_date: d.change_date,
                rowId: d.id,
                ledger_id_from_master: d.ledger_id_from_master,
              });
            }
          }

          setLedgerMainData(tempArray); //dropdown

          let ledger_id = dataToBeEdited.row.ledger_id;

          if (ledger_id !== null && ledger_id !== undefined) {
            const findIndex = tempArray.findIndex((a) => a.id === ledger_id);

            if (findIndex !== -1) {
              setSelectMainLedger({
                value: ledger_id,
                label: tempArray[findIndex].name,
              });

              setSelectedLedgerData(ledgerPopupData[findIndex].LedgerRate); // popup data here should be update on selected from drop down

              function findClosestPrevDate(arr, target) {
                let targetDate = new Date(target);
                let previousDates = arr.filter(
                  (e) => targetDate - new Date(e.change_date) >= 0
                );

                if (previousDates.length === 1) {
                  return previousDates[0];
                }

                //nearest date in rate and date textfield
                let sortedPreviousDates = previousDates.sort(
                  (a, b) =>
                    Date.parse(b.change_date) - Date.parse(a.change_date)
                );

                return sortedPreviousDates[0] || null;
              }

              let r1 = findClosestPrevDate(
                ledgerPopupData[findIndex].LedgerRate,
                moment().format("YYYY-MM-DD")
              );

              setDateValue(r1.change_date);
              setRateValue(r1.rate);
            } else {
              setSelectMainLedger("");
              setSelectedLedgerData([]);
              setDateValue("");
              setRateValue("");
            }
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/ledgerMastar/" + val });
      });
  }

  function handleLedgerChange(value) {
    // const [ledgerApiData, setLedgerApiData] = useState("");
    setSelectMainLedger(value);
    setSelMainLedgerErr("");
    //check and change date and rate here, rate and dates are disabled

    let ledger_id = value.value;

    if (ledger_id !== null && ledger_id !== undefined) {
      const findIndex = ledgerMainData.findIndex((a) => a.id === ledger_id);

      if (findIndex !== -1) {
        setSelectedLedgerData(ledgerRateApiData[findIndex].LedgerRate); // popup data here should be update on selected from drop down

        function findClosestPrevDate(arr, target) {
          let targetDate = new Date(target);
          let previousDates = arr.filter(
            (e) => targetDate - new Date(e.change_date) >= 0
          );

          if (previousDates.length === 1) {
            return previousDates[0];
          }

          //nearest date in rate and date textfield
          let sortedPreviousDates = previousDates.sort(
            (a, b) => Date.parse(b.change_date) - Date.parse(a.change_date)
          );

          return sortedPreviousDates[0] || null;
        }

        let r1 = findClosestPrevDate(
          ledgerRateApiData[findIndex].LedgerRate,
          moment().format("YYYY-MM-DD")
        );

        setDateValue(r1.change_date);
        setRateValue(r1.rate);
      }
    }
  }

  function handleChangeHsnNum(value) {
    setHsnSelected(value);
    setHSNMasterErrTxt("");
    // value.value is id field so we have to get index of this id and set gst number from index array
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
                    {isViewOnly ? "View Job Worker" : "Edit Job Worker"}
                  </Typography>
                </FuseAnimate>

                {/* {!isViewOnly && <BreadcrumbsHelper />} */}
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
                      <p>Job worker name*</p>
                      <TextField
                        placeholder="Job Worker Name"
                        autoFocus
                        name="jobWorkerName"
                        value={jobWorkerName}
                        error={jobWorkerNameErr.length > 0 ? true : false}
                        helperText={jobWorkerNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isViewOnly}
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>Job worker code*</p>
                      <TextField
                        placeholder="Job Worker Code"
                        name="jobWrokerCode"
                        value={jobWrokerCode}
                        error={jobWrokerCodeErr.length > 0 ? true : false}
                        helperText={jobWrokerCodeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isViewOnly}
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>Firm type*</p>
                      <TextField
                        placeholder="Firm Name"
                        name="firmName"
                        value={firmName}
                        error={firmNameErr.length > 0 ? true : false}
                        helperText={firmNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isViewOnly}
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
                            isDisabled={isViewOnly}
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
                            placeholder="Enter Mobile No"
                            name="phoneNo"
                            value={phoneNumOne}
                            error={phoneNumOneErr.length > 0 ? true : false}
                            helperText={phoneNumOneErr}
                            onChange={(e) => handleInputChange(e)}
                            variant="outlined"
                            required
                            fullWidth
                            disabled={isViewOnly}
                          />
                        </div>
                      </div>
                    </div>{" "}
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
                            isDisabled={isViewOnly}
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
                            placeholder="Enter Phone No"
                            name="phoneNotwo"
                            value={phoneNumTwo}
                            error={phoneNumTwoErr.length > 0 ? true : false}
                            helperText={phoneNumTwoErr}
                            onChange={(e) => handleInputChange(e)}
                            variant="outlined"
                            required
                            disabled={isViewOnly}
                            fullWidth
                          />
                        </div>
                      </div>
                    </div>{" "}
                    <div className="add-textfiled">
                      <p>Email id*</p>
                      <TextField
                        className=""
                        placeholder="Email Id"
                        name="jobWrokerEmail"
                        value={jobWrokerEmail}
                        error={jobWrokerEmailErr.length > 0 ? true : false}
                        helperText={jobWrokerEmailErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isViewOnly}
                      />
                    </div>{" "}
                    <div className="add-textfiled">
                      <p>GST type:</p>
                      <FormControl
                        component="fieldset"
                        className={classes.formControl}
                      >
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
                            disabled={isViewOnly}
                          />
                          <FormControlLabel
                            value="0"
                            control={<Radio />}
                            label="UnRegistered"
                            disabled={isViewOnly}
                          />
                        </RadioGroup>
                        <span style={{ color: "red" }}>
                          {gstTypeErr.length > 0 ? gstTypeErr : ""}
                        </span>
                      </FormControl>
                    </div>{" "}
                    {gstType === "1" && (
                      <div className="add-textfiled">
                        <p>GST number</p>
                        <TextField
                          className=""
                          placeholder="Job Worker Name"
                          name="GstNumber"
                          value={GstNumber}
                          error={gstNumErr.length > 0 ? true : false}
                          helperText={gstNumErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          // disabled={gstType !== "1" || isViewOnly}
                          disabled={isViewOnly}
                        />
                      </div>
                    )}
                    <div className="add-textfiled">
                      <p>Pan no.</p>
                      <TextField
                        className=""
                        placeholder="PAN Number"
                        name="panNumber"
                        disabled={isViewOnly}
                        value={panNumber}
                        error={panNumErr.length > 0 ? true : false}
                        helperText={panNumErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>{" "}
                    {gstType !== "1" && <div className="add-textfiled"></div>}
                    <div className="add-textfiled"></div>
                    <div className="add-textfiled">
                      <p>TCS/TDS/NA</p>
                      <select
                        className={classes.selectBox}
                        required
                        disabled={isViewOnly}
                        value={tcsOrTdsValue}
                        onChange={(e) => {
                          handleTcsTdsChange(e);
                        }}
                      >
                        <option hidden value="">
                          TCS/TDS/NA
                        </option>
                        <option value="1">TCS </option>
                        <option value="2">TDS </option>
                        <option value="0"> NA</option>
                      </select>

                      <span style={{ color: "red" }}>
                        {tcsOrTdsErr.length > 0 ? tcsOrTdsErr : ""}
                      </span>
                    </div>
                    <div className="add-textfiled">
                      <p>Ledger of sales</p>
                      <Select
                        classes={classes}
                        filterOption={createFilter({ ignoreAccents: false })}
                        styles={selectStyles}
                        options={ledgerMainData.map((item) => ({
                          value: item.id,
                          label: item.name,
                        }))}
                        isDisabled={isViewOnly}
                        value={selectMainLedger}
                        onChange={handleLedgerChange}
                        placeholder="Ledger for Sales"
                      />

                      <span style={{ color: "red" }}>
                        {selMainLedgerErr.length > 0 ? selMainLedgerErr : ""}
                      </span>
                    </div>
                    <div className="add-textfiled">
                      <p>Date*</p>
                      <TextField
                        id="date"
                        placeholder="Date"
                        type="date"
                        className={classes.inputBox}
                        name="datevalue"
                        value={dateValue}
                        error={dateValueErr.length > 0 ? true : false}
                        helperText={dateValueErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>Rate(%)*</p>
                      <TextField
                        // className=""
                        placeholder="Enter Rate (%)"
                        name="rateValue"
                        value={rateValue}
                        error={rateValueErr.length > 0 ? true : false}
                        helperText={rateValueErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled
                      />
                    </div>{" "}
                    <div className="add-textfiled flex align-middle justify-start ">
                      <button
                        type="button"
                        className={clsx(classes.linkButton, "mt-16")}
                        onClick={(e) => checkRate(e)}
                      >
                        Show All Rates
                      </button>
                    </div>
                    <div className="add-textfiled">
                      <p>HSN</p>
                      <Select
                        className=" input-select-bdr-dv"
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={HSNMasterData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.hsn_number,
                        }))}
                        isDisabled={isViewOnly}
                        value={hsnSelected}
                        onChange={handleChangeHsnNum}
                        placeholder="HSN"
                      />

                      <span style={{ color: "red" }}>
                        {HSNMasterErrTxt.length > 0 ? HSNMasterErrTxt : ""}
                      </span>
                    </div>{" "}
                    <div className="add-textfiled">
                      <p>Country</p>
                      <Select
                        classes={classes}
                        filterOption={createFilter({ ignoreAccents: false })}
                        styles={selectStyles}
                        options={countryData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        isDisabled={isViewOnly}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        placeholder="Country"
                      />

                      <span style={{ color: "red" }}>
                        {selectedCountryErr.length > 0
                          ? selectedCountryErr
                          : ""}
                      </span>
                    </div>{" "}
                    <div className="add-textfiled">
                      <p>State</p>
                      <Select
                        classes={classes}
                        filterOption={createFilter({ ignoreAccents: false })}
                        styles={selectStyles}
                        options={stateData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        isDisabled={isViewOnly}
                        value={selectedState}
                        onChange={handleChangeState}
                        placeholder="State"
                      />

                      <span style={{ color: "red" }}>
                        {selectedStateErr.length > 0 ? selectedStateErr : ""}
                      </span>
                    </div>{" "}
                    <div className="add-textfiled">
                      <p>City</p>
                      <Select
                        classes={classes}
                        filterOption={createFilter({ ignoreAccents: false })}
                        styles={selectStyles}
                        options={cityData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        isDisabled={isViewOnly}
                        value={selectedCity}
                        onChange={handleChangeCity}
                        placeholder="City"
                      />

                      <span style={{ color: "red" }}>
                        {selectedCityErr.length > 0 ? selectedCityErr : ""}
                      </span>
                    </div>{" "}
                    <div className="add-textfiled">
                      <p>Pincode*</p>
                      <TextField
                        className=""
                        placeholder="Pincode"
                        name="pincode"
                        value={pincode}
                        error={pincodeErr.length > 0 ? true : false}
                        helperText={pincodeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isViewOnly}
                      />
                    </div>{" "}
                    <div className="add-textfiled addmaster-textara">
                      <p>Address*</p>
                      <TextField
                        className="textarea-input-dv "
                        placeholder="Address"
                        value={jobWrokerAddress}
                        error={jobWrokerAddressErr.length > 0 ? true : false}
                        helperText={jobWrokerAddressErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isViewOnly}
                      />
                    </div>{" "}
                    <div className="add-textfiled"></div>{" "}
                    <div className="add-textfiled">
                      <p>Bank name*</p>
                      <TextField
                        className=""
                        placeholder="Bank Name"
                        name="bankName"
                        value={bankName}
                        error={bankNameErr.length > 0 ? true : false}
                        helperText={bankNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isViewOnly}
                      />
                    </div>{" "}
                    <div className="add-textfiled">
                      <p>Account holder name*</p>
                      <TextField
                        className="mb-16"
                        placeholder="Account Holder Name"
                        name="accNumber"
                        value={accNumber}
                        error={accNumberErr.length > 0 ? true : false}
                        helperText={accNumberErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isViewOnly}
                      />
                    </div>{" "}
                    <div className="add-textfiled">
                      <p>Account number*</p>
                      <TextField
                        className=""
                        placeholder="Account Number"
                        name="accNumber"
                        value={accNumber}
                        error={accNumberErr.length > 0 ? true : false}
                        helperText={accNumberErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>{" "}
                    <div className="add-textfiled">
                      <p>IFSC code*</p>
                      <TextField
                        className=""
                        placeholder="IFSC code"
                        name="IfseCode"
                        value={IFSCcode}
                        error={IFSCcodeErr.length > 0 ? true : false}
                        helperText={IFSCcodeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isViewOnly}
                      />
                    </div>{" "}
                    <div className="add-textfiled">
                      <p>Account type*</p>
                      <TextField
                        className=""
                        placeholder="Account Type"
                        name="accType"
                        value={accType}
                        error={accTypeErr.length > 0 ? true : false}
                        helperText={accTypeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isViewOnly}
                      />
                    </div>
                    <div className="add-textfiled">
                      <p>Rate profile</p>
                      <Select
                        classes={classes}
                        filterOption={createFilter({ ignoreAccents: false })}
                        styles={selectStyles}
                        options={rateProfData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.profile_name,
                        }))}
                        isDisabled={isViewOnly}
                        value={selectedProfile}
                        onChange={handleProfileChange}
                        placeholder="Rate Profile"
                      />

                      <span style={{ color: "red" }}>
                        {selectedProfErrTxt.length > 0
                          ? selectedProfErrTxt
                          : ""}
                      </span>
                    </div>
                    <div className="add-textfiled">
                      <p>Status</p>
                      <FormControl
                        component="fieldset"
                        className={classes.formControl}
                      >
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
                            disabled={isViewOnly}
                          />
                          <FormControlLabel
                            value="2"
                            control={<Radio />}
                            label="Deactive"
                            disabled={isViewOnly}
                          />
                        </RadioGroup>
                        <span style={{ color: "red" }}>
                          {statusErr.length > 0 ? statusErr : ""}
                        </span>
                      </FormControl>
                    </div>
                    <div className="add-textfiled"></div>
                    <div className="add-textfiled"></div>
                  </div>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    {!isViewOnly && (
                      <Button
                        id="btn-save"
                        variant="contained"
                        color="primary"
                        className="w-128 mx-auto mt-16 float-right"
                        aria-placeholder="Register"
                        onClick={(e) => {
                          handleFormSubmit(e);
                        }}
                      >
                        Save
                      </Button>
                    )}
                  </Grid>
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
              <div
                style={modalStyle}
                className={clsx(classes.rateFixPaper, "rounded-8")}
              >
                {" "}
                <h5 className="popup-head p-20">
                  All Rates
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={handleVoucherModalClose}
                  >
                    <Icon>
                      <img src={Icones.cross} alt="" />
                    </Icon>{" "}
                  </IconButton>
                </h5>
                <div className="p-40 ">
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
                    <TableBody>
                      {selectedLedgerData !== "" &&
                        selectedLedgerData.map((row, index) => (
                          <TableRow
                            key={index}
                            // onClick={(e) => handleVoucherSelect(row.id)}
                            // className={classes.hoverClass}
                          >
                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                            >
                              {row.change_date}
                            </TableCell>

                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                            >
                              {row.rate}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>

                  {/* <Button
                    variant="contained"
                    color="primary"
                    className="w-full mx-auto mt-16"
                    style={{
                      backgroundColor: "#4caf50",
                      border: "none",
                      color: "white",
                    }}
                    onClick={(e) => adjustRateFix(e)}
                  >
                    Save
                  </Button> */}
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default EditJobworker;

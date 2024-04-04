import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, Paper, Divider } from "@material-ui/core";
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
import moment from "moment";
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

const AddJobWorkerRetailer = (props) => {
  const dispatch = useDispatch();

  const [modalStyle] = useState(getModalStyle);

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
  const [accTypeData, setaccTypeData] = useState([{id:"1",name:"Savings account"},{id:"2",name:"Current account"}]);

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
  const [confirmaccNumber, setconfirmaccNumber] = useState("");
  const [confirmaccNumberErr, setconfirmaccNumberErr] = useState("");
  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  function handleacctypeChange(value) {
    setAccType(value)
    console.log(value);
  }
  useEffect(() => {
    NavbarSetting("Master-Retailer", dispatch);
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
      if (/^\d{0,10}$/.test(value)) {
        setPhoneNumOne(value);
        setPhoneNumOneErr("");
      }
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
    }else if (name === "confirmaccNumber") {
      setconfirmaccNumber(value);
      setconfirmaccNumberErr("");
    }
  }

  function jobWorkerNameValidation() {
    var Regex = /^[a-zA-Z\s.'-]{2,30}$/;
    if (!jobWorkerName || Regex.test(jobWorkerName) === false) {
      if(jobWorkerName === ""){
        setJobWorkerNameErr("Enter job worker name");
      }else{
        setJobWorkerNameErr("Enter valid job worker name");
      }
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
      if(phoneNumOne == ""){
        setPhoneNumOneErr("Enter mobile number");
      }else{
        setPhoneNumOneErr("Enter valid mobile number");
      }
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
    const Regex = /^[0-9]{9,18}$/;
    if (accNumber !== "" && Regex.test(accNumber) === false) {
      if(accNumber === ""){
        setAccNumberErr("Enter account number");
      }else{
        setAccNumberErr("Enter valid account number");
      }
      return false;
    }
    return true;
  }

  function validateConfiACN() {
    if (accNumber !== confirmaccNumber) {
      if(confirmaccNumber === ""){
        setconfirmaccNumberErr("Enter confirm account number");
      }else{
        setconfirmaccNumberErr("Account number don't match");
      }
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
    var Regex = /^[a-zA-Z\s.'-]{2,10}$/;
    if (accType!=="" && Regex.test(accType) === false) {
      if(accType === ""){
        setAccTypeErr("Enter account type");
      }else{
        setAccTypeErr("Enter valid account type");
      }
      return false;
    }
    return true;
  }

  function addressValidation() {
    // const Regex = ""; Regex.test(jobWrokerAddress) === false
    if (!jobWrokerAddress || jobWrokerAddress === "") {
      setJobWrokerAddressErr("Enter address");
      return false;
    }
    return true;
  }

  function IFSCcodeValidation() {
    const Regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (IFSCcode !=="" && Regex.test(IFSCcode) === false) {
      if(IFSCcode === ""){
        setIFSCcodeErr("Enter IFSC code");
      }else{
        setIFSCcodeErr("Enter valid IFSC code");
      }
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
    var Regex = /^[a-zA-Z\s.'-]{2,30}$/;
    if (bankName !== "" && Regex.test(bankName) === false) {
      if(bankName === ""){
        setBankNameErr("Enter bank name");
      }else{
        setBankNameErr("Enter valid bank name");
      }
      return false;
    }
    return true;
  }

  function accHolderNameVAlidation() {
    var Regex = /^[a-zA-Z\s.'-]{2,30}$/;
    if (accHolderName !== "" && Regex.test(accHolderName) === false) {
      if(accHolderName === ""){
        setAccHolderNameErr("Enter account holder name");
      }else{
        setAccHolderNameErr("Enter valid account holder name");
      }
      return false;
    }
    return true;
  }

  function panNumberValidation() {
    const Regex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    if (panNumber !=="" && Regex.test(panNumber) === false) {
      if(panNumber === ""){
        setPanNumErr("Enter pan number");
      }else{
        setPanNumErr("Enter valid pan number");
      }
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

  function HsnNumValidation() {
    // var Regex = /^[a-zA-Z0-9 ]+$/;
    if (hsnSelected === "") {
      setHSNMasterErrTxt("Enter Valid HSN Number");
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

  function handleFormSubmit(ev) {
    ev.preventDefault();
    // resetForm();
    if (
      jobWorkerNameValidation() &&
      phoneNumberValidation() &&
      // gstTypeValidation() &&
      panNumberValidation() &&
      // addressValidation() &&
      bankNameVAlidation() &&
      accHolderNameVAlidation() &&
      accNumberValidation() &&
      validateConfiACN()&&
      IFSCcodeValidation()
      // accTypeValidation() 
    ) {
      callAddJobWorkerApi();
      // if (gstType === "1") {
      //   //check for gst number
      //   if (gstNumberValidation()) {
      //     // <option value="1">TCS </option>
      //     // <option value="2">TDS </option>
      //     // <option value="0"> NA</option>
      //     if (tcsOrTdsValue === "0") {
      //       callAddJobWorkerApi();
      //     } else {
      //       if (
      //         ledgerForSaleValidation() &&
      //         dateValidation() &&
      //         rateValueValidation()
      //       ) {
      //         callAddJobWorkerApi();
      //       }
      //     }
      //   }
      // } else {
      //   //no need to check for gst
      //   if (tcsOrTdsValue === "0") {
      //     callAddJobWorkerApi();
      //   } else {
      //     if (
      //       ledgerForSaleValidation() &&
      //       dateValidation() &&
      //       rateValueValidation()
      //     ) {
      //       callAddJobWorkerApi();
      //     }
      //   }
      // }
    } else {
    }
  }

  function callAddJobWorkerApi() {
    let data;
      data = {
        name: jobWorkerName,
        mobile_number: phoneNumOne,
        address: jobWrokerAddress,
        bank_name: bankName,
        account_holder_name: accHolderName,
        account_number: accNumber,
        confirm_account_number: confirmaccNumber,
        account_type: accType.label,
        ifsc_code: IFSCcode,
        // gst_type: parseInt(gstType),
        gst_number: GstNumber,
        pan_number: panNumber,
      };
    axios
      .post(Config.getCommonUrl() + "retailerProduct/api/jobworkerRet/add", data)
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
        handleError(error, dispatch, { api: "retailerProduct/api/jobworkerRet/add", body: data });
      });
  }

  useEffect(() => {
    // getStatedata();
    getCountrydata();
    // getRateProfileData();
    // getHSNData();
    //eslint-disable-next-line
  }, []);

  // function getHSNData() {
  //   axios
  //     .get(Config.getCommonUrl() + "api/hsnmaster")
  //     .then(function (response) {
  //       if (response.data.success === true) {
  //         console.log(response);
  //         setHSNMasterData(response.data.data);
  //       } else {
  //         dispatch(
  //           Actions.showMessage({
  //             message: response.data.message,
  //             variant: "error",
  //           })
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       handleError(error, dispatch, { api: "api/hsnmaster" });
  //     });
  // }

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

  // function getRateProfileData() {
  //   axios
  //     .get(Config.getCommonUrl() + "api/jobworkerRateProfile")
  //     .then(function (response) {
  //       if (response.data.success === true) {
  //         console.log(response);
  //         setRateProfData(response.data.data);
  //         // setData(response.data);
  //       } else {
  //         dispatch(
  //           Actions.showMessage({
  //             message: response.data.message,
  //             variant: "error",
  //           })
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       handleError(error, dispatch, { api: "api/jobworkerRateProfile" });
  //     });
  // }

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
      setSelectedLedgerData([]);
      setSelectMainLedger("");
      setDateValue("");
      setRateValue("");
      // value="1" TCS
      // value="2" TDS
      // getAllLedgerFromAccount(value === "1" ? "tcs" : "tds");
    } else {
      setLedgerMainData([]);
      setLedgerRateApiData([]);
      setSelectedLedgerData([]);
      setSelectMainLedger("");
      setDateValue("");
      setRateValue("");
    }
  }

  // function getAllLedgerFromAccount(val) {
  //   //showing list in popup in main page

  //   axios
  //     .get(Config.getCommonUrl() + "api/ledgerMastar/" + val)
  //     .then(function (response) {
  //       if (response.data.success === true) {
  //         console.log(response);
  //         let ledgerPopupData = response.data.data;
  //         setLedgerRateApiData(ledgerPopupData);

  //         let tempArray = [];
  //         // let allData = [];

  //         for (let item of ledgerPopupData) {
  //           let ledgerNm = item.Ledger.name;
  //           let LedgerId = item.id;

  //           //other array for select dropdown name and id only
  //           tempArray.push({
  //             name: ledgerNm,
  //             id: LedgerId,
  //           });

  //           // for (let d of item.LedgerRate) {
  //           //   allData.push({
  //           //     name: ledgerNm,
  //           //     id: LedgerId,
  //           //     isEditing: false,
  //           //     rate: d.rate,
  //           //     change_date: d.change_date,
  //           //     rowId: d.id,
  //           //     ledger_id_from_master: d.ledger_id_from_master,
  //           //   });
  //           // }
  //         }

  //         setLedgerMainData(tempArray); //dropdown
  //       } else {
  //         dispatch(
  //           Actions.showMessage({
  //             message: response.data.message,
  //             variant: "error",
  //           })
  //         );
  //       }
  //     })
  //     .catch(function (error) {
  //       handleError(error, dispatch, { api: "api/ledgerMastar/" + val });
  //     });
  // }

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
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            <Grid
              container
              alignItems="center"
              style={{ paddingInline: 30, marginBlock: 20 }}
            >
              <Grid item xs={6} sm={5} md={5} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Add New Job Worker
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid item xs={6} sm={7} md={7} key="2">
                <div className="btn-back">
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
                  <img src={Icones.arrow_left_pagination} className="back_arrow" alt="" />

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
                  <h4 style={{marginBottom: 16}}>Job Worker Details</h4>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Job Worker Name*</p>
                      <TextField
                        placeholder="Enter Party Name"
                        autoFocus
                        name="jobWorkerName"
                        value={jobWorkerName}
                        error={jobWorkerNameErr.length > 0 ? true : false}
                        helperText={jobWorkerNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <p>Mobile Number*</p>
                      <TextField
                        placeholder="Enter Mobile Number"
                        name="phoneNo"
                        value={phoneNumOne}
                        error={phoneNumOneErr.length > 0 ? true : false}
                        helperText={phoneNumOneErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Pan no.</p>
                      <TextField
                        placeholder="Enter Pan No"
                        name="panNumber"
                        value={panNumber}
                        error={panNumErr.length > 0 ? true : false}
                        helperText={panNumErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>GST Number</p>
                        <TextField
                          placeholder="Enter Gst Number"
                          autoFocus
                          name="GstNumber"
                          value={GstNumber}
                          error={gstNumErr.length > 0 ? true : false}
                          helperText={gstNumErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Address</p>
                        <TextField
                         className="textarea-input-dv "
                          placeholder="Enter Address"
                          name="address"
                          value={jobWrokerAddress}
                          error={jobWrokerAddressErr.length > 0 ? true : false}
                          helperText={jobWrokerAddressErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          multiline
                          maxRows={3}
                          fullWidth
                        />
                    </Grid>
                  </Grid>
                  <Divider style={{marginBlock: 20}} />
                  <h4 style={{marginBottom: 16}}>Bank Details</h4>
                   <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Bank Name</p>
                      <TextField
                        placeholder="Enter Bank Name"
                        name="bankName"
                        value={bankName}
                        error={bankNameErr.length > 0 ? true : false}
                        helperText={bankNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Account Holder Name</p>
                      <TextField
                        placeholder="Enter Account Holder Name"
                        name="accHoldNm"
                        value={accHolderName}
                        error={accHolderNameErr.length > 0 ? true : false}
                        helperText={accHolderNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Account Number</p>
                      <TextField
                        placeholder="Enter Account Number"
                        name="accNumber"
                        value={accNumber}
                        error={accNumberErr.length > 0 ? true : false}
                        helperText={accNumberErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Confirm Account Number</p>
                      <TextField
                        placeholder="Enter Confirm Account Number"
                        name="confirmaccNumber"
                        value={confirmaccNumber}
                        error={confirmaccNumberErr.length > 0 ? true : false}
                        helperText={confirmaccNumberErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>IFSC Code</p>
                      <TextField
                        placeholder="Enter Ifsc Code"
                        name="IfseCode"
                        value={IFSCcode}
                        error={IFSCcodeErr.length > 0 ? true : false}
                        helperText={IFSCcodeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Account Type</p>
                    <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={accTypeData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        value={accType}
                        onChange={handleacctypeChange}
                        placeholder="Select Account Type"
                        // isDisabled={isView}
                      />
                    </Grid>
                   </Grid>
                    <Divider style={{marginBlock: 20}} />
                </form>
                    <div className="ml-auto" style={{display: "flex"}}>
                      <Button
                        id="btn-save"
                        variant="contained"
                        color="primary"
                        className="w-128 ml-auto"
                        aria-placeholder="Register"
                        onClick={(e) => {
                          handleFormSubmit(e);
                        }}
                      >
                        Save
                      </Button>
                    </div>
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
                <h5 className="popup-head p-20">
                  All Rates
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={handleVoucherModalClose}
                  >
                    <Icon>
                      <img src={Icones.cross} alt="" />
                    </Icon>
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
                              {/* disabled textfield and enable on edit */}
                              {/* <TextField
                                // className=""
                                // placeholder="Rate (%)"
                                name="rate"
                                value={row.rate}
                                error={changeRateErr.length > 0 ? true : false}
                                helperText={changeRateErr}
                                onChange={(e) => handleRateChange(e, index)}
                                variant="outlined"
                                required
                                fullWidth
                                disabled={!row.isEditing}
                              /> */}
                              {row.rate}
                              {/* if editing flag is true then show input box here and save button too */}
                            </TableCell>
                            {/* <TableCell
                              align="center"
                              className={classes.tableRowPad}
                              style={{ width: "35%" }}
                            >
                              {!selectedLedgerData.some(
                                (el) => el.isEditing === true
                              ) &&
                                !row.isEditing && (
                                  <IconButton
                                    style={{ padding: "0" }}
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      editHandler(index);
                                    }}
                                  >
                                       <Icon className="mr-8 edit-icone">
                                  <img src={Icones.edit} alt="" />
                                </Icon>
                                  </IconButton>
                                )}

                              {row.isEditing && (
                                <>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    // className="w-224 mx-auto mt-16"
                                    // aria-placeholder="Register"
                                    //   disabled={!isFormValid()}
                                    // type="submit"
                                    onClick={(e) => {
                                      changeRate(e, index);
                                    }}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    className="ml-2"
                                    // aria-placeholder="Register"
                                    //   disabled={!isFormValid()}
                                    // type="submit"
                                    onClick={(e) => {
                                      cancelEdit(e, index);
                                    }}
                                  >
                                    cancel
                                  </Button>
                                </>
                              )}
                            </TableCell> */}
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

export default AddJobWorkerRetailer;

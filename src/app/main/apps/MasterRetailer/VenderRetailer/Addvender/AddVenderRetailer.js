import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, Divider } from "@material-ui/core";
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
    marginTop:"5px "
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

const AddVenderRetailer = (props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const statesData = JSON.parse(localStorage.getItem('myprofile'))
  const [vendorId,setVendorId] = useState("");
  const [isView, setView] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [delBankIds, setBankIds] = useState([])

  const [vendorName, setVendorName] = useState("");
  const [vendorNameErr, setVendorNameErr] = useState("");

  const [vendorCode, setvendorCode] = useState("");
  const [vendorCodeErr, setvendorCodeErr] = useState("");

  const [phoneNumOne, setPhoneNumOne] = useState("");
  const [phoneNumOneErr, setPhoneNumOneErr] = useState("");

  const [phoneNumTwo, setPhoneNumTwo] = useState("");
  const [phoneNumTwoErr, setPhoneNumTwoErr] = useState("");

  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorEmailErr, setVendorEmailErr] = useState("");

  const [vendorAddress, setVendorAddress] = useState("");
  const [vendorAddressErr, setVendorAddressErr] = useState("");

  const [status, setStatus] = useState("1");
  const [statusErr, setStatusErr] = useState("");

  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({value : statesData?.CountryName?.id , label : statesData?.CountryName?.name});
  const [selectedCountryErr, setSelectedCountryErr] = useState("");

  const [stateData, setStateData] = useState([]);
  const [selectedState, setSelectedState] = useState({value : statesData?.StateName?.id , label : statesData?.StateName?.name});
  const [selectedStateErr, setSelectedStateErr] = useState("");

  const [cityData, setCityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState({value : statesData?.CityName?.id , label : statesData?.CityName?.name});
  const [selectedCityErr, setSelectedCityErr] = useState("");

  const [pincode, setPincode] = useState("");
  const [pincodeErr, setPincodeErr] = useState("");
  const [accTypeData, setaccTypeData] = useState([{id:"1",name:"Savings account"},{id:"2",name:"Current account"}]);
  const [bankData, setBankData] = useState([{
    firmName : "",
    GstNumber : "",
    panNumber : "",
    bankName : "",
    accHolderName : "",
    accNumber : "",
    conAccNum : "",
    accType : "",
    IFSCcode : "",
    errors : {}
  }])

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
    NavbarSetting("Master-Retailer", dispatch);
  }, []);

  useEffect(() => {
    if(props.location.state){
      setView(props.location.state.isViewOnly)
      setEdit(props.location.state.isEditOnly)
      setVendorId(props.location.state.id)
      if(props.location.state.isEditOnly){
        getCountrydata();
      }
      getVendorData(props.location.state.id)
    }else{
      getVendorCode()
      getCountrydata();
      if(statesData){
        getStatedata(statesData?.CountryName?.id)
        getCityData(statesData?.StateName?.id)
      }
    }
    //eslint-disable-next-line
  }, []);

  function getVendorData(id) {
    axios
      .get(Config.getCommonUrl() + `retailerProduct/api/vendor/readonevendor/${id}`)
      .then((res) => {
        console.log(res);
        const arrData = res.data.data;
        setVendorName(arrData.name);
        setvendorCode(arrData.vendor_code);
        setPhoneNumOne(arrData.mobile_number);
        setPhoneNumTwo(arrData.phone_number);
        setVendorEmail(arrData?.email);
        setVendorAddress(arrData.address);
        setPincode(arrData.pincode);
        
       
        if (arrData.country_name?.id) {
          getStatedata(arrData.country_name?.id);
        getCityData(arrData.state_name?.id);
          setSelectedCountry({
            value: arrData?.country_name?.id,
            label: arrData?.country_name?.name,
          });
          setSelectedCity({
            value: arrData?.city_name?.id,
            label: arrData?.city_name?.name,
          });
          setSelectedState({
            value: arrData?.state_name?.id,
            label: arrData?.state_name?.name,
          });
        }
        
        setStatus(arrData.status.toString());
        const bankObj = []
        arrData.vendorCompanies.map((item)=>{
          bankObj.push({
            firmName : item.firm_name,
            GstNumber : item.gst_number,
            panNumber : item.pan_number,
            bankName : item.bank_name,
            accHolderName : item.account_holder_name,
            accNumber : item.account_number,
            conAccNum : item.confirm_account_number,
            accType : {
              value: accTypeData.id,
              label: item.account_type,
            },
            IFSCcode : item.ifsc_code,
            id : item.id,
            errors : {}
          })
        })

        setBankData(bankObj)
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `retailerProduct/api/vendor/readonevendor/${id}` });
      });
  }

  function getVendorCode() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/vendor/autogenerated")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setvendorCode(response.data.data);
          // setData(response.data);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "retailerProduct/api/vendor/autogenerated" });
      });
  }

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
    } else if (name === "phoneNo") {
      if (/^\d{0,10}$/.test(value)) {
        setPhoneNumOne(value);
        setPhoneNumOneErr("");
      }
    } else if (name === "phoneNotwo") {
      if (/^\d{0,10}$/.test(value)) {
        setPhoneNumTwo(value);
        setPhoneNumTwoErr("");
      }
    } else if (name === "vendorEmail") {
      setVendorEmail(value);
      setVendorEmailErr("");
    } else if (name === "address") {
      setVendorAddress(value);
      setVendorAddressErr("");
    } else if (name === "pincode") {
      setPincode(value);
      setPincodeErr("");
    } 
  }
  // function handleacctypeChange(value) {
  //   setAccType(value)
  //   console.log(value);
  // }
  let handleBankInputtypeChange = (e, i) => {
    let newFormValues = [...bankData];
    newFormValues[i].accType = {
      value: e.value,
      label: e.label,
    };
    console.log(newFormValues[i].accType);
    // let findIndex = accTypeData.findIndex(
    //   (item) => item.id === e.value
    // );
    // console.log(findIndex);
    setBankData(newFormValues)
  };
  const handleBankInputChange = (e,i) => {
    console.log(e);
    const name = e.target.name;
    const value = e.target.value;
    console.log(name, value);
    const bankArr = [...bankData]
    bankArr[i][name] = value;
    bankArr[i].errors[name] = "";
    setBankData(bankArr)
  }

  function vendorNameValidation() {
    var Regex = /^[a-zA-Z\s.'-]{2,30}$/;
    if (!vendorName ) {
      setVendorNameErr  ("Enter vendor name")
      return false;
    }
    return true;
  }

  function phoneNumberValidation() {
    var Regex = /^[0-9]{10}$/;
    if (!phoneNumOne || Regex.test(phoneNumOne) === false) {
      if(phoneNumOne == ""){
        setPhoneNumOneErr("Enter mobile number")
      }else{
        setPhoneNumOneErr("Enter valid mobile number");
      }
      return false;
    }
    return true;
  }
  function phoneNumbertwoValidation() {
    var Regex = /^[0-9]{10}$/;
    if (phoneNumTwo !== "" && Regex.test(phoneNumTwo) === false) {
      if(phoneNumTwo == ""){
        setPhoneNumTwoErr("Enter phone number")
      }else{
        setPhoneNumTwoErr("Enter valid phone number");
      }
      return false;
    }
    return true;
  }

  function emailValidation() {
    //const Regex = /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g;
    const Regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!vendorEmail || Regex.test(vendorEmail) === false) {
      if(vendorEmail == ""){
        setVendorEmailErr("Enter email id")
      }else{
        setVendorEmailErr("Enter valid email id");
      }
      return false;
    }
    return true;
  }

  function countryValidation() {
    if (selectedCountry === "") {
      setSelectedCountryErr("Please select country");
      return false;
    }
    return true;
  }

  function stateValidation() {
    if (selectedState === "") {
      setSelectedStateErr("Please select state");
      return false;
    }
    return true;
  }

  function cityValidation() {
    if (selectedCity === "") {
      setSelectedCityErr("Please select city");
      return false;
    }
    return true;
  }

  function pincodeValidation() {
    const Regex = /^(\d{4}|\d{6})$/;
    if (!pincode || Regex.test(pincode) === false) {
      if(pincode == "")
      {
        setPincodeErr("Enter pincode")
      }else{
        setPincodeErr("Enter valid pincode");
      }
      return false;
    }
    return true;
  }

  function addressValidation() {
    // const Regex = ""; Regex.test(vendorAddress) === false
    if (!vendorAddress || vendorAddress === "") {
      setVendorAddressErr("Enter address");
      return false;
    }
    return true;
  }

  function StatusValidation() {
    if (status === "") {
      setStatusErr("Please select status");
      return false;
    }
    return true;
  }

  const validateBankField = () => {
    const bankArr = [...bankData];

    const accRegex = /^[a-zA-Z\s.'-]{2,30}$/;
    const acccNumRegex = /^[0-9]{9,18}$/;
    const ifSCRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const gstRegex = /^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;
    const panRegex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    const accTypeRegex = /^[a-zA-Z\s.'-]{2,10}$/;

    bankArr.map((item,i) => {
      if(item.firmName === "" || accRegex.test(item.firmName) === false){
        if(item.firmName === ""){
        item.errors['firmName'] = "Enter firm name";
        }else{
          item.errors['firmName'] = "Enter valid firm name";
        }
      }else if(item.panNumber !== "" && panRegex.test(item.panNumber) === false){
        item.errors['panNumber'] = "Enter valid pan number";
      }else 
       if(item.GstNumber !== "" && gstRegex.test(item.GstNumber) === false){
        item.errors['GstNumber'] = "Gst number must be contain state-code, pan number and 14th character z.";
      }else if(item.bankName !== "" && accRegex.test(item.bankName) === false ){
        if(item.bankName === ""){
          item.errors['bankName'] = "Enter bank name";
          }else{
            item.errors['bankName'] = "Enter valid bank name";
          }
      }else if(item.accHolderName !== "" && accRegex.test(item.accHolderName) === false ){
        if(item.accHolderName === ""){
          item.errors['accHolderName'] = "Enter account holder name";
          }else{
            item.errors['accHolderName'] = "Enter valid account holder name";
          }
      }else if(item.accNumber !== "" && acccNumRegex.test(item.accNumber) === false){
        if(item.accNumber === ""){
          item.errors['accNumber'] = "Enter account number";
          }else{
            item.errors['accNumber'] = "Enter valid account number";
          }
      }else if(item.conAccNum !== "" && acccNumRegex.test(item.conAccNum) === false || item.conAccNum !== item.accNumber){
        item.errors['conAccNum'] = "Account number does not match";
      }else if(item.IFSCcode !== "" && ifSCRegex.test(item.IFSCcode) === false){
        if(item.IFSCcode === ""){
          item.errors['IFSCcode'] = "Enter IFSC code";
          }else{
            item.errors['IFSCcode'] = "Enter valid IFSC code";
          }
      }
    })
    setBankData(bankArr)
    return true;
  }

  const validateEmptyError = () => {
    let arrData = [...bankData];
    let flag = true;
    arrData.map((item) => {
      if (!errorCheck(item.errors)) {
        flag = false;
      }
    })
    return flag;
  };

  const errorCheck = (error) => {
    let valid = true;
    Object.values(error).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();
    if (
      vendorNameValidation() &&
      // vendorCodeValidation() &&
      phoneNumberValidation() &&
      // phoneNumbertwoValidation()&&
      // emailValidation() &&
      // addressValidation() &&
      // countryValidation() &&
      // stateValidation() &&
      // cityValidation() &&
      // pincodeValidation() &&
      validateBankField() &&
      validateEmptyError() 
      // StatusValidation() 
    ) {
      const bankArrObj = []
      bankData.map((item) => {
        bankArrObj.push({
          pan_number: item.panNumber,
          firm_name: item.firmName,
          gst_number: item.GstNumber,
          bank_name: item.bankName,
          account_holder_name: item.accHolderName,
          account_number: item.accNumber,
          confirm_account_number: item.conAccNum,
          ifsc_code: item.IFSCcode,
          account_type: item.accType.label,
          ...(item.id && {
            id : item.id,
          }),
        })
      })
      const body = {
        name: vendorName,
        vendor_code: vendorCode,
        mobile_number: phoneNumOne,
        phone_number: phoneNumTwo,
        email: vendorEmail,
        address: vendorAddress,
        country: selectedCountry.value,
        state: selectedState.value,
        city: selectedCity.value,
        pincode: pincode,
        status: parseInt(status),
        CompanyData : bankArrObj,
        ...(isEdit  && {
          deleteVendorCompanyIds: delBankIds,
        }),
      }
      if(isEdit){
        callEditVendorApi(body)
      }else{
        callAddVendorApi(body); 
      }
        
      }
    }

    function callEditVendorApi(body) {
      console.log(body)
      axios
        .put(Config.getCommonUrl() + `retailerProduct/api/vendor/${vendorId}`, body)
        .then(function (response) {
          console.log(response);
  
          if (response.data.success === true) {
            History.goBack(); //.push("/dashboard/masters/vendors");
  
            dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          }  else {
            dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
          }
        })
        .catch((error) => {
          handleError(error, dispatch, {
            api: `retailerProduct/api/vendor/${vendorId}`,
            body: body,
          });
        });
    }

  function callAddVendorApi(body) {
    console.log(body)
    axios
      .post(Config.getCommonUrl() + "retailerProduct/api/vendor", body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          History.goBack(); //.push("/dashboard/masters/vendors");

          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "retailerProduct/api/vendor",
          body: body,
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

  function getCountrydata() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/country")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setCountryData(response.data.data);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "retailerProduct/api/country" });
      });
  }

  function getStatedata(countryID) {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/country/state/" + countryID)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStateData(response.data.data);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "retailerProduct/api/country/state/" + countryID });
      });
  }

  function handleChangeStatus(event) {
    setStatus(event.target.value);
    setStatusErr("");
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
      .get(Config.getCommonUrl() + "retailerProduct/api/country/city/" + stateID)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setCityData(response.data.data);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "retailerProduct/api/country/city/" + stateID });
      });
  }

  function handleChangeCity(value) {
    setSelectedCity(value);
    setSelectedCityErr("");
  }

  const addNewRow = () => {
    if( validateBankField() &&
    validateEmptyError() ){
      setBankData([...bankData,{
        firmName : "",
        GstNumber : "",
        panNumber : "",
        bankName : "",
        accHolderName : "",
        accNumber : "",
        accType : "",
        IFSCcode : "",
        conAccNum : "",
        errors : {}
      }]);
    }
  }

  const deleteHandler = (delId,row) => {
    let rowData = [...bankData];
    if (rowData[delId + 1] || delId !== 0) {
      const newData = rowData.filter((item, i) => {
        if (i !== delId) return item;
        return false;
      })
      setBankData(newData)
    }else{
        rowData[delId].firmName = ""
        rowData[delId].GstNumber = ""
        rowData[delId].panNumber = ""
        rowData[delId].bankName = ""
        rowData[delId].accHolderName = ""
        rowData[delId].accNumber = ""
        rowData[delId].conAccNum = ""
        rowData[delId].accType = ""
        rowData[delId].IFSCcode = ""
        rowData[delId].errors = {}
      setBankData(rowData)
    }

    if(isEdit && row.id){
      setBankIds([...delBankIds,row.id])
    }
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
                    {isEdit ? "Edit Vendor" : isView ? "View Vendor" : "Add New Vendor" }
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid item xs={6} sm={7} md={7} key="2">
                <div className="btn-back">
                  {" "}
                  <Button
                    id="btn-back"
                    size="small"
                    onClick={(event) => {
                      History.goBack();
                    }}
                  >
                  <img className="back_arrow" src={Icones.arrow_left_pagination} alt="" />
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>

            <div className="main-div-alll ">
              <div>
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  onSubmit={handleFormSubmit}
                >
                  <h4 className="mb-10">Vendor Details</h4>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Vendor Name*</p>
                      <TextField
                        className=""
                        placeholder="Enter Party Name"
                        autoFocus
                        name="vendorName"
                        value={vendorName}
                        error={vendorNameErr.length > 0 ? true : false}
                        helperText={vendorNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        multiline
                        fullWidth
                        disabled={isView}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Vendor Code*</p>
                      <TextField
                        className=""
                        placeholder="Enter Party Code"
                        name="vendorCode"
                        value={vendorCode}
                        error={vendorCodeErr.length > 0 ? true : false}
                        helperText={vendorCodeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        multiline
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Mobile No.*</p>
                      <TextField
                        className=""
                        placeholder="Enter Number"
                        name="phoneNo"
                        value={phoneNumOne}
                        error={phoneNumOneErr.length > 0 ? true : false}
                        helperText={phoneNumOneErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Phone No.</p>
                      <TextField
                        className=""
                        placeholder="Enter Number"
                        name="phoneNotwo"
                        value={phoneNumTwo}
                        error={phoneNumTwoErr.length > 0 ? true : false}
                        helperText={phoneNumTwoErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Email Id</p>
                      <TextField
                        placeholder="Enter Email Id"
                        name="vendorEmail"
                        value={vendorEmail}
                        error={vendorEmailErr.length > 0 ? true : false}
                        helperText={vendorEmailErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Address</p>
                      <TextField
                        placeholder="Enter Address"
                        name="address"
                        value={vendorAddress}
                        error={vendorAddressErr.length > 0 ? true : false}
                        helperText={vendorAddressErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        maxRows={3}
                        multiline
                        disabled={isView}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
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
                        placeholder="Select Country"
                        isDisabled={isView}
                      />

                      <span className="fornt-Err-Select">
                        {selectedCountryErr.length > 0
                          ? selectedCountryErr
                          : ""}
                      </span>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
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
                        placeholder="Select State"
                        isDisabled={isView}
                      />

                      <span className="fornt-Err-Select">
                        {selectedStateErr.length > 0 ? selectedStateErr : ""}
                      </span>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
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
                        placeholder="Select City"
                        isDisabled={isView}
                      />

                      <span className="fornt-Err-Select">
                        {selectedCityErr.length > 0 ? selectedCityErr : ""}
                      </span>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Pincode</p>
                      <TextField
                        className=""
                        placeholder="Enter Pincode"
                        name="pincode"
                        value={pincode}
                        error={pincodeErr.length > 0 ? true : false}
                        helperText={pincodeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </Grid>
                  </Grid>
                  <Divider style={{marginBlock: 20}} />
                  {/* <div className="w-full mb-32 flex flex-row flex-wrap add-client-row ">
                    <div className="add-textfiled">
                      
                    </div>
                    <div className="add-textfiled">
                      
                    </div>
                    
                    <div className="add-textfiled">
                      
                    </div>
                    <div className="add-textfiled">
                      
                    </div>
                    <div className="add-textfiled">
                      
                    </div>
                    <div className="add-textfiled">
                      
                    </div>
                    <div className="add-textfiled">
                      
                    </div>
                    <div className="add-textfiled">
                      
                    </div>
                    <div className="add-textfiled">
                      
                    </div>{" "}
                    <div className="add-textfiled">
                      
                    </div>
                  </div> */}
                </form>
                <div>
                {
                  !isView && <Button
                  id="btn-save"
                  variant="contained"
                  color="primary"
                  className="mx-auto float-right"
                  aria-label="Register"
                  onClick={addNewRow}
                >
                  Add Bank
                </Button>
                }
                  
                </div>
              {
              bankData.map((item, index) =>(
                <div key={index}>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <h4 className="mb-0">Firm Details</h4> 
                    {
                    !isView &&
                    
                      <IconButton
                    style={{ padding: "0" }}
                    onClick={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      deleteHandler(index,item);
                    }}
                  >
                    <Icon className="mr-8 delete-icone">
                      <img src={Icones.delete_red} alt="" />
                    </Icon>
                </IconButton>
                    }
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Firm Name*</p>
                    <TextField
                      placeholder="Enter Firm Name"
                      name="firmName"
                      value={item.firmName}
                      error={item.errors.firmName ? true : false}
                      helperText={item.errors?.firmName}
                      onChange={(e) => handleBankInputChange(e,index)}
                      variant="outlined"
                      required
                      multiline
                      fullWidth
                      disabled={isView}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>GST Number</p>
                    <TextField
                      placeholder="Enter Gst Number"
                      name="GstNumber"
                      value={item.GstNumber}
                      error={item.errors.GstNumber ? true : false}
                      helperText={item.errors?.GstNumber}
                      onChange={(e) => handleBankInputChange(e,index)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled={isView}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <p>Pan No.</p>
                    <TextField
                      placeholder="Enter Pan No"
                      name="panNumber"
                      value={item.panNumber}
                      error={item.errors.panNumber ? true : false}
                      helperText={item.errors?.panNumber}
                      onChange={(e) => handleBankInputChange(e,index)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled={isView}
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
                      value={item.bankName}
                      error={item.errors.bankName ? true : false}
                      helperText={item.errors?.bankName}
                      onChange={(e) => handleBankInputChange(e,index)}
                      variant="outlined"
                      required
                      multiline
                      fullWidth
                      disabled={isView}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Account Holder Name</p>
                    <TextField
                      placeholder="Enter Account Holder Name"
                      name="accHolderName"
                      value={item.accHolderName}
                      error={item.errors.accHolderName ? true : false}
                      helperText={item.errors?.accHolderName}
                      onChange={(e) => handleBankInputChange(e,index)}
                      variant="outlined"
                      required
                      multiline
                      fullWidth
                      disabled={isView}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Account Number</p>
                    <TextField
                      placeholder="Enter Account Number"
                      name="accNumber"
                      value={item.accNumber}
                      error={item.errors.accNumber ? true : false}
                      helperText={item.errors?.accNumber}
                      onChange={(e) => handleBankInputChange(e,index)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled={isView}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>Conform Account Number</p>
                    <TextField
                      placeholder="Enter Confirm Account Number"
                      name="conAccNum"
                      value={item.conAccNum}
                      error={item.errors.conAccNum ? true : false}
                      helperText={item.errors?.conAccNum}
                      onChange={(e) => handleBankInputChange(e,index)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled={isView}
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
                        value={item.accType}
                        onChange={(e) => handleBankInputtypeChange(e,index)}
                        placeholder="Select Account Type"
                        // isDisabled={isView}
                      
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p>IFSC Code</p>
                    <TextField
                      className="mb-16"
                      placeholder="Enter Ifsc Code"
                      name="IFSCcode"
                      value={item.IFSCcode}
                      error={item.errors.IFSCcode ? true : false}
                      helperText={item.errors?.IFSCcode}
                      onChange={(e) => handleBankInputChange(e,index)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled={isView}
                    />
                    </Grid>
                  </Grid>
              </div>
              ))}
                 
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
                    disabled={isView}
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="Active"
                      disabled={isView}
                    />
                    <FormControlLabel
                      value="2"
                      control={<Radio />}
                      label="Deactive"
                      disabled={isView}
                    />
                  </RadioGroup>
                  <span className="fornt-Err-Select">
                    {statusErr.length > 0 ? statusErr : ""}
                  </span>
                </FormControl>
              <div className=" float-right">
                {
                  !isView &&  <Button
                  id="btn-save"
                  variant="contained"
                  color="primary"
                  className="w-128 mx-auto mt-28 float-right"
                  aria-label="Register"
                  //   disabled={!isFormValid()}
                  // type="submit"
                  onClick={(e) => {
                    handleFormSubmit(e);
                  }}
                >
                  {isEdit ? "Update" : "Save"}
                </Button>
                }
               
              </div>
            </div>
          </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddVenderRetailer;

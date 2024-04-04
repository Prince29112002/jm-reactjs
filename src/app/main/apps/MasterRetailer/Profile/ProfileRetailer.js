import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import { FuseAnimate } from "@fuse";
import { Button, Grid, Checkbox, TextField, Typography } from "@material-ui/core";
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as Actions from "app/store/actions";
import Select, { createFilter } from "react-select";
import { Icon, IconButton } from "@material-ui/core";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  uibuttion: {
    border: "1px dashed #415BD4",
    backgroundColor: " #EDF0FD !important",
    color: "#415BD4 !important",
  },
}));

const ProfileRetailer = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [topHeaderName, setTopHeaderName] = useState("");
  const [topHeaderNameErr, setTopHeaderNameErr] = useState("");
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [phoneNumOne, setPhoneNumOne] = useState("");
  const [phoneNumOneErr, setPhoneNumOneErr] = useState("");
  const [phoneNumTwo, setPhoneNumTwo] = useState("");
  const [phoneNumTwoErr, setPhoneNumTwoErr] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imgFile, setImgFile] = useState("");
  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyAddressErr, setCompanyAddressErr] = useState("");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [gstNoErr, setGstNoErr] = useState("");
  const [panNo, setPanNo] = useState("");
  const [panNoErr, setPanNoErr] = useState("");
  const [pincode, setpincode] = useState("");
  const [pincodeErr, setpincodeErr] = useState("");
  const [siteId, setSiteId] = useState("");
  const [voucherLogo, setVoucherLogo] = useState("");
  const [voucherLogoUrl, setVoucherLogoUrl] = useState("");

  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryErr, setSelectedCountryErr] = useState("");

  const [stateData, setStateData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateErr, setSelectedStateErr] = useState("");

  const [cityData, setcityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCityErr, setSelectedCityErr] = useState("");
  const [tandCdata, setTandCdata] = useState("")
  const [tandCdataErr, setTandCdataErr] = useState("")

  const [name_flag, setNameFlag] = useState(false)
  const [mobile_no_flag, setMobileNoFlag] = useState(false)
  const [phone_no_flag, setPhoneNoFlag] = useState(false)
  const [email_flag, setEmailFlag] = useState(false)
  const [address_flag, setAddressFlag] = useState(false)
  const [city_flag, setCityFlag] = useState(false)
  const [state_flag, setStateFlag] = useState(false)
  const [country_flag, setCountryFlag] = useState(false)
  const [pincode_flag, setPincodeFlag] = useState(false)
  const [firm_name_flag, setFirmNameFlag] = useState(false)
  const [gst_number_flag, setGstNumberFlag] = useState(false)
  const [pan_number_flag, setPanNumberFlag] = useState(false)
  const [terms_and_conditions_flag, setTermsAndConditionsFlag] = useState(false)
  const [top_header_name_flag, setTopHeaderNameFlag] = useState(false)
  const profileData = localStorage.getItem("myprofile") && JSON.parse(localStorage.getItem("myprofile"))

  const roleOfUser = localStorage.getItem("permission")
    ? JSON.parse(localStorage.getItem("permission"))
    : null;
  const [authAccessArr, setAuthAccessArr] = useState([]);

  useEffect(() => {
    let arr = roleOfUser
      ? roleOfUser["Master-Retailer"]["My Profile-Retailer"]
        ? roleOfUser["Master-Retailer"]["My Profile-Retailer"]
        : []
      : [];
    const arrData = [];
    if (arr.length > 0) {
      arr.map((item) => {
        arrData.push(item.name);
      });
    }
    setAuthAccessArr(arrData);
  }, []);

  useEffect(() => {
    NavbarSetting("Master-Retailer", dispatch);
    //eslint-disable-next-line
  }, []);

  function setImages(imgFile) {
    setImageUrl(URL.createObjectURL(imgFile));
    setImgFile(imgFile);
  }

  function setVoucherImages(img) {
    setVoucherLogoUrl(URL.createObjectURL(img));
    setVoucherLogo(img);
  }

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleClickVoucher = (event) => {
    hiddenFileInputVoucher.current.click();
  };
  const hiddenFileInput = React.useRef(null);
  const hiddenFileInputVoucher = React.useRef(null);
  useEffect(() => {
    console.log("innnn")
    getAllMyprofileData();
    getCountrydata()
    //eslint-disable-next-line
  }, []);

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

  function handleFormSubmit(event) {
    event.preventDefault();
    if (topHeaderNameValidate() && nameValidation() &&
      firmNamevalidation() &&
      emailValidation() &&
      numberValidation() &&
      numbertwoValidation() &&
      Addressvalidation() &&
      panNoValidation() &&
      gstNoValidation() &&
      countryValidation() &&
      stateValidation() &&
      cityValidation() &&
      pincodeValidation() &&
      termandcondition()
    ) {
      callAddProfileApi()
    }
  }

  function handleCountryChange(value) {
    setSelectedCountry(value);
    setSelectedCountryErr("");
    setStateData([]);
    setSelectedState("");
    setSelectedStateErr("");
    setcityData([]);
    setSelectedCity("");
    getStatedata(value.value)
  }

  function handleChangeState(value) {
    setSelectedState(value);
    setSelectedStateErr("");
    setcityData([]);
    setSelectedCity("");
    getCitydata(value.value);
  }

  function getCountrydata() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/country")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setCountryData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "retailerProduct/api/country" });
      });
  }
  function getStatedata(countyId, i) {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/country/state/" + countyId)
      .then(function (response) {
        if (response.data.success === true) {
          setStateData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "retailerProduct/api/partyDetails/state/all" + countyId,
        });
      });
  }
  function handleChangeCity(value) {
    setSelectedCity(value);
    setSelectedCityErr("");
  }

  function getCitydata(stateID) {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/country/city/" + stateID)
      .then(function (response) {
        if (response.data.success === true) {
          setcityData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "retailerProduct/api/partyDetails/city/" + stateID,
        });
      });
  }

  function callAddProfileApi() {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile_no", phoneNumOne);
    formData.append("phone_no", phoneNumTwo);
    formData.append("firm_name", firmName);
    formData.append("address", companyAddress);
    formData.append("email", email);
    formData.append("gst_number", gstNo);
    formData.append("pan_number", panNo);
    formData.append("country", selectedCountry.value);
    formData.append("state", selectedState.value);
    formData.append("city", selectedCity.value);
    formData.append("pincode", pincode);
    formData.append("top_header_name", topHeaderName);
    formData.append("terms_and_conditions", tandCdata);
    
    // Append flags (assuming they are boolean values)
    formData.append("name_flag", name_flag);
    formData.append("mobile_no_flag", mobile_no_flag);
    formData.append("phone_no_flag", phone_no_flag);
    formData.append("email_flag", email_flag);
    formData.append("address_flag", address_flag);
    formData.append("city_flag", city_flag);
    formData.append("state_flag", state_flag);
    formData.append("country_flag", country_flag);
    formData.append("pincode_flag", pincode_flag);
    formData.append("firm_name_flag", firm_name_flag);
    formData.append("gst_number_flag", gst_number_flag);
    formData.append("pan_number_flag", pan_number_flag);
    formData.append("terms_and_conditions_flag", terms_and_conditions_flag);
    formData.append("top_header_name_flag", top_header_name_flag);
    
    // Append image file
    formData.append("image", imgFile);
    formData.append("voucher_logo", voucherLogo);
    
   
    axios.put(Config.getCommonUrl() + `retailerProduct/api/myprofile`, formData)
      .then(function (response) {
        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "success" }));
          getAllMyprofileData()
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `retailerProduct/api/myprofile/${siteId}`, body: formData })
      });
  }

  function getAllMyprofileData() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/myprofile")
      .then(function (response) {
        if (response.data.success === true) {
          const data = response.data.data[0]
          const apiData = JSON.stringify(data);
          localStorage.setItem("myprofile", apiData);
          setSiteId(data?.id)
          setName(data?.name)
          setPhoneNumOne(data?.mobile_no)
          setPhoneNumTwo(data?.phone_no)
          setFirmName(data?.firm_name)
          setCompanyAddress(data?.address)
          setEmail(data?.email)
          setGstNo(data?.gst_number)
          setPanNo(data?.pan_number)
          setpincode(data?.pincode)
          setSelectedCountry(
            {
              value: data?.CountryName?.id,
              label: data?.CountryName?.name,
            }
          );
          if (data.CountryName.id) getStatedata(data?.CountryName?.id)
          setSelectedState(
            {
              value: data?.StateName?.id,
              label: data?.StateName?.name,
            }
          );
          if (data.StateName.id) getCitydata(data.StateName.id)
          setSelectedCity({
            value: data?.CityName?.id,
            label: data?.CityName?.name,
          });
          setTopHeaderName(data?.top_header_name)
          setTandCdata(data?.terms_and_conditions)
          setNameFlag(data?.name_flag)
          setMobileNoFlag(data?.mobile_no_flag)
          setPhoneNoFlag(data?.phone_no_flag)
          setEmailFlag(data?.email_flag)
          setAddressFlag(data?.address_flag)
          setCityFlag(data?.city_flag)
          setStateFlag(data?.state_flag)
          setCountryFlag(data?.country_flag)
          setPincodeFlag(data?.pincode_flag)
          setFirmNameFlag(data?.firm_name_flag)
          setGstNumberFlag(data?.gst_number_flag)
          setPanNumberFlag(data?.pan_number_flag)
          setTermsAndConditionsFlag(data?.terms_and_conditions_flag)
          setTopHeaderNameFlag(data?.top_header_name_flag)
          setImageUrl(data?.logo);
          setVoucherLogoUrl(data?.voucher_logo);
        } else {
          localStorage.setItem("myprofile", []);
        }
      })
      .catch(function (error) {
        localStorage.setItem("myprofile", []);
        handleError(error, dispatch, { api: "retailerProduct/api/myprofile" })
      });
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;

    const name = target.name;
    if (name === "name") {
      setName(value);
      setNameErr("");
    } else if (name === "topHeaderName") {
      setTopHeaderName(value);
      setTopHeaderNameErr("")
    }
    else if (name === "firmName") {
      setFirmName(value);
      setFirmNameErr("");
    }
    else if (name === "number") {
      if (/^\d{0,10}$/.test(value)) {
        setPhoneNumOne(value);
        setPhoneNumOneErr("");
      }
    }
    else if (name === "Phone") {
      setPhoneNumTwo(value);
      setPhoneNumTwoErr("");
    }
    else if (name === "companyAddress") {
      setCompanyAddress(value);
      setCompanyAddressErr("");
    }
    else if (name === "email") {
      setEmail(value);
      setEmailErr("");
    }
    else if (name === "gstNo") {
      setGstNo(value);
      setGstNoErr("");
    }
    else if (name === "panNo") {
      setPanNo(value);
      setPanNoErr("");
    }
    else if (name === "pincod") {
      setpincode(value);
      setpincodeErr("");
    } else if (name === "tandCdata") {
      setTandCdata(value);
      setTandCdataErr("")
    }
  }

  function topHeaderNameValidate() {
    if (top_header_name_flag && topHeaderName === "") {
      setTopHeaderNameErr("Enter top header name");
      return false;
    }
    return true;
  }

  function termandcondition() {
    if (terms_and_conditions_flag && tandCdata === "") {
      setTandCdataErr("Enter term and condtions");
      return false;
    }
    return true;
  }

  function pincodeValidation() {
    const Regex = /^(\d{4}|\d{6})$/;
    if (!pincode || Regex.test(pincode) === false) {
      if (pincode == "") {
        setpincodeErr("Enter pincode")
      } else {
        setpincodeErr("Enter valid pincode");
      }
      return false;
    }
    return true;
  }

  function nameValidation() {
    const Regex = /^[A-Za-z0-9\s\-.,&()'"!#]{1,100}$/;
    if (!name || Regex.test(name) === false) {
      if (name == "") {
        setNameErr("Enter name")
      } else {
        setNameErr("Enter valid name");
      }
      return false;
    }
    return true;
  }

  function numberValidation() {
    const Regex = /^[0-9]{10}$/;
    if (!phoneNumOne || Regex.test(phoneNumOne) === false) {
      if (phoneNumOne == "") {
        setPhoneNumOneErr("Enter phone number")
      } else {
        setPhoneNumOneErr("Enter valid phone number");
      }
      return false;
    }
    return true;
  }

  function numbertwoValidation() {
    const Regex = /^[0-9]{10}$/;
    if (phoneNumTwo !== "" && Regex.test(phoneNumTwo) === false) {
      if (phoneNumTwo == "") {
        setPhoneNumOneErr("Enter phone number")
      } else {
        setPhoneNumOneErr("Enter valid phone number");
      }
      return false;
    }
    return true;
  }

  function firmNamevalidation() {
    const Regex = /^[A-Za-z0-9\s\-.,&()'"!#]{1,100}$/;
    if (!firmName || Regex.test(firmName) === false) {
      if (firmName == "") {
        setFirmNameErr("Enter firm name");
      } else {
        setFirmNameErr("Enter valid firm name");
      }
      return false;
    }
    return true;
  }

  function Addressvalidation() {
    if (companyAddress === "") {
      if (companyAddress == "") {
        setCompanyAddressErr("Enter address")
      } else {
        setCompanyAddressErr("Enter valid address");
      }
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

  function emailValidation() {
    const Regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email || Regex.test(email) === false) {
      if (email == "") {
        setEmailErr("Enter email id")
      } else {
        setEmailErr("Enter valid email id");
      }
      return false;
    }
    return true;
  }

  function panNoValidation() {
    const panNumRegex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    if (panNo !== "" && panNumRegex.test(panNo) === false) {
      setPanNoErr("Enter valid pan number");
      return false;
    }
    return true;
  }

  function gstNoValidation() {
    const GstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (gstNo !== "" && GstRegex.test(gstNo) === false) {
      setGstNoErr("Enter valid gst number");
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

  function callDeleteTagLogoApi() {
    if(profileData.logo){
      axios
      .delete(Config.getCommonUrl() + "retailerProduct/api/myprofile/removeTaggingLogo")
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "success" })); 
          getAllMyprofileData()
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "retailerProduct/api/myprofile/removeTaggingLogo",
        });
      });
    }else{
      setImgFile("")
      setImageUrl("")
    }
  }

  function callDeleteApi() {
    if(profileData.voucher_logo){
      axios
      .delete(Config.getCommonUrl() + "retailerProduct/api/myprofile/removeVoucherLogo")
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "success" })); 
          getAllMyprofileData()
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "retailerProduct/api/myprofile/removeVoucherLogo",
        });
      });
    }else{
      setVoucherLogo("")
      setVoucherLogoUrl("")
    }
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
              <Grid item xs={12} sm={4} md={4} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    My Profile
                  </Typography>
                </FuseAnimate>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                md={9}
                key="2"
                style={{ textAlign: "right" }}
              >
              </Grid>
            </Grid>
            <div className="main-div-alll ">
              <div
                style={{ height: "90%" }}
              >
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <><p>Top Header Name
                        <Checkbox
                          onChange={(e) => setTopHeaderNameFlag(e.target.checked)}
                          checked={top_header_name_flag}
                        />
                      </p></>
                      <TextField
                        autoFocus
                        name="topHeaderName"
                        value={topHeaderName}
                        error={topHeaderNameErr.length > 0 ? true : false}
                        helperText={topHeaderNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        placeholder="Enter Top Header Name"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <><p>Name*
                        <Checkbox
                          onChange={(e) => setNameFlag(e.target.checked)}
                          checked={name_flag}
                        />
                      </p></>
                      <TextField
                        autoFocus
                        name="name"
                        value={name}
                        error={nameErr.length > 0 ? true : false}
                        helperText={nameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        placeholder="Enter Name"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <><p>Firm Name*
                        <Checkbox
                          onChange={(e) => setFirmNameFlag(e.target.checked)}
                          checked={firm_name_flag}
                        />
                      </p></>
                      <TextField
                        placeholder="Enter Firm Name"
                        autoFocus
                        name="firmName"
                        value={firmName}
                        error={firmNameErr.length > 0 ? true : false}
                        helperText={firmNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <><p>Email Id*
                        <Checkbox
                          onChange={(e) => setEmailFlag(e.target.checked)}
                          checked={email_flag}
                        />
                      </p></>
                      <TextField
                        autoFocus
                        name="email"
                        value={email}
                        error={emailErr.length > 0 ? true : false}
                        helperText={emailErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        placeholder="Enter Email"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <><p>Mobile No.*
                        <Checkbox
                          onChange={(e) => setMobileNoFlag(e.target.checked)}
                          checked={mobile_no_flag}
                        />
                      </p></>
                      <TextField
                        placeholder="Enter Number"
                        name="number"
                        value={phoneNumOne}
                        error={phoneNumOneErr.length > 0 ? true : false}
                        helperText={phoneNumOneErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} >
                      <><p>Phone No.
                        <Checkbox
                          onChange={(e) => setPhoneNoFlag(e.target.checked)}
                          checked={phone_no_flag}
                        />
                      </p></>
                      <TextField
                        placeholder="Enter Number"
                        name="Phone"
                        value={phoneNumTwo}
                        error={phoneNumTwoErr.length > 0 ? true : false}
                        helperText={phoneNumTwoErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} >
                      <><p>Address*
                        <Checkbox
                          onChange={(e) => setAddressFlag(e.target.checked)}
                          checked={address_flag}
                        />
                      </p></>
                      <TextField
                        placeholder="Enter Address "
                        autoFocus
                        name="companyAddress"
                        value={companyAddress}
                        error={companyAddressErr.length > 0 ? true : false}
                        helperText={companyAddressErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} style={{ marginTop: "20px" }}>
                      <><p>PAN No.
                        {/* <Checkbox
                       onChange={(e) => setPanNumberFlag(e.target.checked)}
                       checked={pan_number_flag}
                    /> */}
                      </p></>
                      <TextField
                        placeholder="Enter Pan No"
                        autoFocus
                        name="panNo"
                        value={panNo}
                        error={panNoErr.length > 0 ? true : false}
                        helperText={panNoErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} >
                      <><p>GST No.
                        <Checkbox
                          onChange={(e) => setGstNumberFlag(e.target.checked)}
                          checked={gst_number_flag}
                        />
                      </p></>
                      <TextField
                        placeholder="Enter Gst No"
                        autoFocus
                        name="gstNo"
                        value={gstNo}
                        error={gstNoErr.length > 0 ? true : false}
                        helperText={gstNoErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} >
                      <><p>Country*
                        <Checkbox
                          onChange={(e) => setCountryFlag(e.target.checked)}
                          checked={country_flag}
                        />
                      </p></>
                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={countryData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        placeholder="Select Country"
                      />
                      <span className="fornt-Err-Select">
                        {selectedCountryErr.length > 0
                          ? selectedCountryErr
                          : ""}
                      </span>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} >
                      <><p>State*
                        <Checkbox
                          onChange={(e) => setStateFlag(e.target.checked)}
                          checked={state_flag}
                        />
                      </p></>
                      <Select
                        className={classes.selectBox}
                        name="state"
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        styles={selectStyles}
                        options={stateData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        onChange={handleChangeState}
                        value={selectedState}
                        placeholder="Select state"
                      />
                      <span className="fornt-Err-Select">
                        {selectedStateErr.length > 0 ? selectedStateErr : ""}
                      </span>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} >
                      <><p>City*
                        <Checkbox
                          onChange={(e) => setCityFlag(e.target.checked)}
                          checked={city_flag}
                        />
                      </p></>
                      <Select
                        className={classes.selectBox}
                        name="city"
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        styles={selectStyles}
                        options={cityData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        onChange={handleChangeCity}
                        value={selectedCity}
                        placeholder="Select City"
                      />
                      <span className="fornt-Err-Select">
                        {selectedCityErr.length > 0 ? selectedCityErr : ""}
                      </span>

                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} >
                      <><p>Pincode*
                        <Checkbox
                          onChange={(e) => setPincodeFlag(e.target.checked)}
                          checked={pincode_flag}
                        />
                      </p></>
                      <TextField
                        placeholder="Enter Pincode"
                        autoFocus
                        name="pincod"
                        value={pincode}
                        error={pincodeErr.length > 0 ? true : false}
                        helperText={pincodeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3} >
                      <><p>Terms and Condition
                        <Checkbox
                          onChange={(e) => setTermsAndConditionsFlag(e.target.checked)}
                          checked={terms_and_conditions_flag}
                        />
                      </p></>
                      <TextField
                        placeholder="Enter Terms and Condition"
                        autoFocus
                        name="tandCdata"
                        error={tandCdataErr.length > 0 ? true : false}
                        helperText={tandCdataErr}
                        value={tandCdata}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        multiline
                        maxRows={2}
                      />
                    </Grid>
                  </Grid>
                  <div className="add-client-row flex flex-row flex-wrap">
                  
                  <div className="add-textfiled">
                    <p></p>
                    <Button
                      id="upload-btn-jewellery"
                      variant="contained"
                      color="primary"
                      style={{
                        backgroundColor: "#283428",
                        color: "white",
                        width: "60%",
                        marginTop: "15%",
                      }}
                      onClick={handleClick}
                    >
                      Upload Your Tag Logo
                    </Button>

                    <input
                      type="file"
                      ref={hiddenFileInput}
                      onChange={(event) => {
                        setImages(event.target.files[0]);
                      }}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </div>
                  <div className="add-textfiled" style={{ position: 'relative' }}>
                    {imageUrl && (
                      <>
                      <img
                        src={imageUrl}
                        style={{ width: "auto", height: "100px" }}
                        className="mt-16"
                        alt=""
                      />
                    <IconButton
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100px', 
                        height: '60px' 
                      }}
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        callDeleteTagLogoApi();
                      }}
                    >
                      <Icon className="mr-8 delete-icone">
                        <img src={Icones.delete_red} alt="" />
                      </Icon>
                    </IconButton>
                      </>
                    )}
                  </div>
                  <div className="add-textfiled">
                    <p></p>
                    <Button
                      id="upload-btn-jewellery"
                      variant="contained"
                      color="primary"
                      style={{
                        backgroundColor: "#283428",
                        color: "white",
                        width: "60%",
                        marginTop: "15%",
                      }}
                      onClick={handleClickVoucher}
                    >
                      Upload Your Voucher Logo
                    </Button>

                    <input
                      type="file"
                      ref={hiddenFileInputVoucher}
                      onChange={(event) => {
                        setVoucherImages(event.target.files[0]);
                      }}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </div>
                  <div className="add-textfiled" style={{ position: 'relative' }}>
                    {voucherLogoUrl && (
                      <>
                        <img
                        src={voucherLogoUrl}
                        style={{ width: "auto", height: "100px" }}
                        className="mt-16"
                        alt=""
                      />
                      <IconButton
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100px', 
                        height: '60px' 
                      }}
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        callDeleteApi();
                      }}
                    >
                      <Icon className="mr-8 delete-icone">
                        <img src={Icones.delete_red} alt="" />
                      </Icon>
                    </IconButton>
                      </>
                    )}
                  </div>
                </div>
                </form>
                {
                  authAccessArr.includes('Add /Edit My Profile-Retailer') && <Button
                    id="btn-save"
                    variant="contained"
                    color="primary"
                    className="w-128 mx-auto mt-16 float-right"
                    aria-label="Register"
                    onClick={(e) => {
                      handleFormSubmit(e);
                    }}
                  >
                    Save
                  </Button>
                }
              </div>
              <div style={{ marginTop: '40px' }}>
                <span style={{ color: 'red' }}>Note : Check the checkbox for display data in print voucher</span>
              </div>
            </div>
            <>
              <div
                className="increase-padding-dv jewellery_main_print-blg"
                style={{ width: "805px", height: "395px" }}
              >
                {/* Metal_purchase */}
                <style type="text/css" media="print">
                  {
                    "\
            @page { size: A5 landscape !important; margin:10px 25px 10px 25px; }"
                  }
                </style>
                <ul>
                  <div
                    style={{
                      // display: "flex",
                      // width: "100%",
                      // justifyContent: "space-around",
                      padding: "5px",
                      height: "106px",
                    }}
                  >
                    {top_header_name_flag && <h5 style={{ textAlign: "center", fontWeight: 500 }}>{topHeaderName && topHeaderName}</h5>}

                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%", height: "75px" ,alignItems:"flex-end"}}>
                      <div style={{ flexBasis: "33.33%" }}>
                        {name_flag && <h5 style={{ fontWeight: 500 }}>{name && name}</h5>}
                        {email_flag && <h5 style={{ fontWeight: 500 }}>{email && email}</h5>}
                        {mobile_no_flag || phone_no_flag ? <h5 style={{ fontWeight: 500 }}>{mobile_no_flag && phoneNumOne && phoneNumOne} {mobile_no_flag && phone_no_flag ? "," : ""}{phone_no_flag && phoneNumTwo && phoneNumTwo} </h5> : ''}
                      </div>
                      <div style={{ flexBasis: "33.33%" , alignSelf:"flex-start" }}>
                        {firm_name_flag && <h2 style={{ textAlign: "center" }}>{firmName && firmName}</h2>}
                        {voucherLogoUrl && 
                        <img src={voucherLogoUrl} alt="" width="auto" height="50px" style={{display: "block", marginInline:"auto", marginTop: 5}} />
                        } 
                      </div>
                      <div style={{ flexBasis: "33.33%", textAlign: "right" }}>
                        {address_flag && <h5 style={{ fontWeight: 500 }}>{companyAddress && companyAddress}</h5>}
                        {state_flag && <h5 style={{ fontWeight: 500 }}>{selectedState && selectedState.label}</h5>}
                        {city_flag || pincode_flag ? <h5 style={{ fontWeight: 500 }}>{city_flag && selectedCity && selectedCity.label} {city_flag && pincode_flag ? "-" : ''} {pincode_flag && pincode && pincode}</h5> : ''}
                      </div>
                    </div>
                  </div>
                  <div className="add-client-row"></div>
                  <div style={{ margin: "5px", height: "200px" }}>

                  </div>
                  {/* <li className="d-block mt-10">
                <div className="tabel-deta-show multiple-tabel-blg">
                  <div className="row">
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{borderTop:"1px solid black"}}>Customer Sign.</span>
                      <span style={{borderTop:"1px solid black",width:"130px",textAlign:"center"}}>For, {myprofileData.firm_name}</span>
                    </div>
                  </div>
                </div>
              </li> */}
                  <div className="add-client-row"></div>
                  <div
                    style={{
                      width: "805px",
                      height: "75px",
                      padding: "5px"
                    }}
                  >
                    {
                      terms_and_conditions_flag && <><p>terms and conditions</p><p>{tandCdata && tandCdata}</p></>
                    }

                  </div>
                </ul>
              </div>
            </>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default ProfileRetailer;

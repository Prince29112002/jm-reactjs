import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import { FuseAnimate } from "@fuse";
import { Button, FormControl, FormControlLabel, FormLabel, Grid, Icon, IconButton, Radio, RadioGroup, TextareaAutosize, TextField, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import History from "@history";
import clsx from "clsx";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as Actions from "app/store/actions";
import Select, { createFilter } from "react-select";
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

const AddClientChainRetailer = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");

  const [phoneNumOne, setPhoneNumOne] = useState("");
  const [phoneNumOneErr, setPhoneNumOneErr] = useState("");
  const [phoneNumTwo, setPhoneNumTwo] = useState("");
  const [phoneNumTwoErr, setPhoneNumTwoErr] = useState("");
  const [adharcad, setAdharCad] = useState("");
  const [adharCadErr, setAdharCadErr] = useState("");
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
  const [imageUrl, setImageUrl] = useState("");
  const [imgFile, setImgFile] = useState("");
  const [siteId, setSiteId] = useState("");
  const [forceUpdate, setForceUpdate] = useState("");
  const [status, setStatus] = useState("0");
  const [statusErr, setStatusErr] = useState("");
  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryErr, setSelectedCountryErr] = useState("");

  const [stateData, setStateData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateErr, setSelectedStateErr] = useState("");

  const [cityData, setcityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCityErr, setSelectedCityErr] = useState("");

  useEffect(() => {
    if(props.callFrom){
      NavbarSetting(props.callFrom, dispatch);
    }else{
      NavbarSetting("Master-Retailer", dispatch);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    getCountrydata()
    if(props.name){
      setName(props.name);
    }
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
  // function validateAllInputs() {
  //   const isPartyNameValid = nameValidation();
  //   const isCompanyNameValid = companyNamevalidation();
  //   const isEmailValid = emailValidation();
  //   const isPhoneNumOneValid = numberValidation();
  //   const isGstNoValid = gstNoValidation();
  //   const ispanNumOneValid = panNoValidation();
  //   const isAddressValid =  panNoValidation();
  //  const isStatevalid = stateValidation();
  // const isCityvalid = cityValidation();
  //   return (
  //     isPartyNameValid &&
  //     isCompanyNameValid &&
  //     isEmailValid &&
  //     isPhoneNumOneValid &&
  //     isGstNoValid &&
  //     ispanNumOneValid &&
  //     isAddressValid &&
  //     isStatevalid&&
  //     isCityvalid
  //   );
  // }
  function handleFormSubmit(event) {
    console.log("0000000");
    event.preventDefault();
    if (nameValidation() &&
      //  firmNamevalidation()&&
      emailValidation() &&
      numberValidation() &&
      // Addressvalidation() &&
      countryValidation() &&
      stateValidation() &&
      cityValidation() &&
      panNoValidation() &&
      gstNoValidation() &&
      AadhaarCardValidation() &&
      pincodeValidation() &&
      StatusValidation()
    ) {
      console.log("11111");
      callAddClientApi()
      // callAddProfileApi()
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
    // getCityData(value.value);
    getStatedata(value.value);
  }
  function handleChangeState(value) {
    setSelectedState(value);
    setSelectedStateErr("");

    // setSelectedCountryErr("");
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
          console.log(response, "////////////////State");
          setStateData(response.data.data);
          // let newFormValues = [...formValues];
          // // console.log(newFormValues);
          // newFormValues[i]["states"] = response.data.data;
          // setFormValues(newFormValues);
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
    // console.log(value);
    setSelectedCity(value);
    setSelectedCityErr("");
  }
  function getCitydata(stateID) {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/country/city/" + stateID)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response, "////////////////city");
          setcityData(response.data.data);

        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "retailerProduct/api/country/city/" + stateID,
        });
      });
  }

  // function editHandler(id) {
  //     console.log("editHandler", id);
  //     // setSelectedIdForEdit(row.id);
  //     // setIsEdit(true);
  //     props.history.push("/dashboard/masters/editprofile", {
  //       id: id,
  //       isViewOnly: false,
  //     });
  //     // setDefaultView("2");
  //   }
  function callAddClientApi() {
    var body = {
      client_Name: name,
      mobile_number: phoneNumOne,
      email: email,
      pan_number: panNo,
      gst_number: gstNo,
      status: parseInt(status),
      address: companyAddress,
      adhar_card: adharcad,
      pincode:pincode,
      country: selectedCountry.value,
      state: selectedState.value,
      city: selectedCity.value
    }
    axios
      .post(Config.getCommonUrl() + "retailerProduct/api/clientRet/add", body)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          if(props.name){
            props.setClientdetail(response.data.data,false)
          }else{
            History.goBack();
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
        handleError(error, dispatch, { api: "retailerProduct/api/clientRet/add", body });
      });
  }
  // console.log(siteId,"000000000");

  // function callAddProfileApi() {
  // // const formData = new FormData();
  // const adddata = {
  //   "name": name,
  //   "phone":phoneNumOne,
  //   "company_name":company,
  //   'address': companyAddress,
  //   'email': email,
  //   'gst_number': gstNo,
  //   'pan_number': panNo,
  //    "state_id": selectedState.value,
  //   "city_id": selectedCity.value,
  // }


  // // formData.append('image', imgFile);

  //     axios
  //         .put(Config.getCommonUrl() + `api/profile/${siteId}`,adddata)


  //         .then(function (response) {
  //             if (response.data.success === true) {

  //                 dispatch(Actions.showMessage({ message: response.data.message ,variant: "success"}));
  //             } else {
  //                 dispatch(Actions.showMessage({ message: response.data.message ,variant: "error"}));
  //             }
  //         })
  //         .catch((error) => {
  //             handleError(error, dispatch, { api: `api/profile/${siteId}`, body: JSON.stringify(adddata)})
  //         });
  // }

  // function setImages(imgFile) {
  //     console.log(imgFile);
  //     setImageUrl(URL.createObjectURL(imgFile));
  //     setImgFile(imgFile);

  //   }
  function handleChangeStatus(event) {
    setStatus(event.target.value);
    setStatusErr("");
  }
  function handleInputChange(event) {
    // console.log("handleInputChange");

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForceUpdate(event.target.value);

    const name = target.name;
    if (name === "name") {
      setName(value);
      setNameErr("");

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
    // return true;
  }

    
    else if (name === "panNo") {
      setPanNo(value);
      setPanNoErr("");
    }
    else if (name === "pincod") {
      setpincode(value);
      setpincodeErr("");

    }
    else if (name === "adharcard") {
      setAdharCad(value);
      setAdharCadErr("");

    }

  }
  function AadhaarCardValidation() {
    const aadhaarPattern = /^\d{12}$/;
    if (adharcad !== ""  && aadhaarPattern.test(adharcad) === false) {
        setAdharCadErr("Enter valid aadhar number");
      return false;
    }
    return true;
  }

  function pincodeValidation() {
    const Regex = /^(\d{4}|\d{6})$/;
    if (!pincode || Regex.test(pincode) === false) {
      if(pincode == ""){
        setpincodeErr("Enter pincode")
      }else{
        setpincodeErr("Enter valid pincode");
      }
      return false;
    }
    return true;
  }
  function nameValidation() {
    const Regex = /^[a-zA-Z\s]*$/;
    // let name = event.target.value;
    if (!name || Regex.test(name) === false) {
      if(name == ""){
        setNameErr("Enter name")
      }else{
        setNameErr("Enter valid name");
      }
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
  
  function numberValidation() {
    const Regex = /^[0-9]{10}$/;
    if (phoneNumOne !== "" && Regex.test(phoneNumOne) === false) {
      setPhoneNumOneErr("Enter valid mobile number");
      return false;
    }
    return true;
  }

  function firmNamevalidation() {
    const Regex = /^[a-zA-Z\s]*$/;
    if (!firmName || Regex.test(firmName) === false) {
      setFirmNameErr("Enter firm name");
      return false;
    }
    return true;
  }
  function Addressvalidation() {

    if (companyAddress === "") {
       if(companyAddress == ""){
        setCompanyAddressErr("Enter address")
      }else{
        setCompanyAddressErr("Enter valid address");
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


  function emailValidation() {

    const Regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email !== "" && Regex.test(email) === false) {
        setEmailErr("Enter valid email id");
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

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const hiddenFileInput = React.useRef(null);
  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            <Grid
              className=" department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={6} sm={5} md={5} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Add Client/Party
                  </Typography>
                </FuseAnimate>
              </Grid>
              {
                !props.name &&  <Grid item xs={6} sm={7} md={7} key="2">
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
              }
            </Grid>


            <div className="main-div-alll ">
              <div
                className=""
                style={{ marginBottom: "10%", height: "90%" }}
              >
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                >
                  <Grid container spacing={3}>
                    <Grid item xs={3} style={{ paddingRight: "0px" }}>
                      <p>Client name*</p>

                      <TextField
                        className="mb-16"
                        //   label="Name "
                        autoFocus
                        name="name"
                        value={name}
                        error={nameErr.length > 0 ? true : false}
                        helperText={nameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        placeholder="Enter name"
                      />
                    </Grid>{" "}
                    {/* <Grid item xs={3} style={{ paddingRight: "0px" }}>
                      <p>Firm name*</p>

                        <TextField
                          className="mb-16"
                        //   label="Company Name "
                        placeholder="Enter firm name"
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
                      </Grid>{" "} */}
                    <Grid item xs={3} style={{ paddingRight: "0px" }}>
                      <p>Email Id</p>

                      <TextField
                        className="mb-16"
                        //   label="Email"
                        autoFocus
                        name="email"
                        value={email}
                        error={emailErr.length > 0 ? true : false}
                        helperText={emailErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        placeholder="Enter email"
                      />
                    </Grid>{" "}

                    <Grid item xs={3} style={{ paddingRight: "0px" }}>
                      <p>Mobile no.</p>

                      <TextField
                        className="mb-16"
                        placeholder="Enter number"
                        name="number"
                        value={phoneNumOne}
                        error={phoneNumOneErr.length > 0 ? true : false}
                        helperText={phoneNumOneErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>{" "}



                    {/* <Grid item xs={3} style={{ paddingRight: "0px" }}>
                      <p>Phone No.*</p>

                        <TextField
                          className="mb-16"
                        //   label="Mo.Number "
                        placeholder="Enter number"
                          // autoFocus
                          name="Phone"
                          value={phoneNumTwo}
                          error={phoneNumTwoErr.length > 0 ? true : false}
                          helperText={phoneNumTwoErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                        //   required
                          fullWidth
                        />
                      </Grid>{" "} */}

                    <Grid item xs={3} style={{ paddingRight: "0px" }}>
                      {/* <label><b>Company Address:</b> </label> */}
                      <p>Address</p>

                      <TextField
                        className="mb-16"
                        placeholder="Enter address "
                        autoFocus
                        name="companyAddress"
                        value={companyAddress}
                        error={companyAddressErr.length > 0 ? true : false}
                        helperText={companyAddressErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        maxRows={3}
                        multiline

                      //   style={{height:"60%",width:"100%",marginTop:"1%",border:"1px solid #e6e6e6"}}
                      />


                    </Grid>{" "}

                    <Grid item xs={3} style={{ paddingRight: "0px" }}>
                      <p>Country*</p>
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

                      <span className="fornt-Err-Select">
                        {selectedCountryErr.length > 0
                          ? selectedCountryErr
                          : ""}
                      </span>
                    </Grid>
                    <Grid item xs={3} style={{ paddingRight: "0px" }}>
                      {/* <label><b>Company Address:</b> </label> */}
                      <p>State*</p>

                      <Select
                        className={classes.selectBox}
                        name="state"
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}

                        styles={selectStyles}
                        options={stateData.map((suggestion) => ({
                          // key: suggestion.id,
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        // value={itemType}
                        onChange={
                          handleChangeState
                        }
                        value={selectedState}
                        placeholder="Select state"
                      />
                      <span className="fornt-Err-Select">
                        {selectedStateErr.length > 0 ? selectedStateErr : ""}
                      </span>
                    </Grid>{" "}
                    <Grid item xs={3} style={{ paddingRight: "0px" }}>
                      {/* <label><b>Company Address:</b> </label> */}
                      <p>City*</p>

                      <Select
                        className={classes.selectBox}
                        name="state"
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}

                        styles={selectStyles}
                        options={cityData.map((suggestion) => ({
                          // key: suggestion.id,
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        // value={itemType}
                        onChange={
                          handleChangeCity
                        }
                        value={selectedCity}
                        placeholder="Select city"
                      />
                      <span className="fornt-Err-Select">
                        {selectedCityErr.length > 0 ? selectedCityErr : ""}
                      </span>

                    </Grid>{" "}
                    <Grid item xs={3} style={{ paddingRight: "0px" }}>
                      <p>Pan no.</p>
                      <TextField
                        className=""
                        placeholder="Enter pan no"
                        name="panNo"
                        value={panNo}
                        error={panNoErr.length > 0 ? true : false}
                        helperText={panNoErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>{" "}

                    <Grid item xs={3} style={{ paddingRight: "0px" }}>
                      <p>GST no.</p>

                      <TextField
                        className="mb-16"
                        //   label="GST No"
                        placeholder="Enter gst.no"
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
                    </Grid>{" "}
                    <Grid item xs={3} style={{ paddingRight: "0px" }}>
                      <p>Aadhaar number</p>

                      <TextField
                        className="mb-16"
                        //   label="PAN No"
                        placeholder="Enter aadhaar number"
                        autoFocus
                        name="adharcard"
                        value={adharcad}
                        error={adharCadErr.length > 0 ? true : false}
                        helperText={adharCadErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>{" "}
                    <Grid item xs={3} style={{ paddingRight: "0px" }}>
                      <p>Pincode*</p>

                      <TextField
                        className="mb-16"
                        //   label="PAN No"
                        placeholder="enter pincode"
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
                    </Grid>{" "}
                  </Grid>

                  <div className="add-textfiled">
                    <FormControl
                      component="fieldset"
                      className={classes.formControl}
                    >
                      <FormLabel component="legend">Status :</FormLabel>
                      <RadioGroup
                        aria-label="Status"
                        name="status"
                        style={{display:"block"}}
                        className={classes.group}
                        value={status}
                        onChange={handleChangeStatus}
                      >
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="Active"
                        />
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Deactive"
                        />
                      </RadioGroup>
                      <span className="fornt-Err-Select">
                        {statusErr.length > 0 ? statusErr : ""}
                      </span>
                    </FormControl>
                  </div>
                </form>

                {/* <Grid
                    container={true}
                    item
                    xs={3}
                    sm={3}
                    md={3}
                    style={{ padding: 0 }}
                  >
                    <Grid item xs={6} sm={6} md={6} style={{ padding: 0 }}>
                      {imageUrl !== "" && (
                        <img
                          src={imageUrl}
                          style={{ width: "300px", height: "200px" }}
                          className="mt-16"
                          alt=""
                        />
                      )}
                      <Button
                      className={clsx( classes.uibuttion,"uplod-btn ")}
                        id="upload-btn-jewellery"
                        variant="contained"
                        color="primary"
                        // style={{
                        //   // backgroundColor: "#283428",
                        //   // color: "white",
                        //   // width: "100%",
                        // }}
                        onClick={handleClick}
                        fullWidth
                      >
                        Browse Image
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
                    </Grid>
                  </Grid> */}

                <Button
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
              </div>
            </div>

          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddClientChainRetailer;

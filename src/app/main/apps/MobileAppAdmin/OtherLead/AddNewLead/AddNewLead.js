import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";
import Config from "app/fuse-configs/Config";
import { Typography, Button, TextField, Box, Table, Paper, TableHead, TableRow, TableCell, TableBody } from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import * as Actions from "app/store/actions";
import History from "@history";
import { useDispatch } from "react-redux";
import axios from "axios";
import Select, { createFilter } from "react-select";
import handleError from "app/main/ErrorComponent/ErrorComponent";

import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import moment from "moment";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
  group: {
    flexDirection: "row",
  },
}));


const AddNewLead = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [entryId, setEntryID] = useState("");

  const [userName, setUserName] = useState("");
  const [userNmErr, setUserNmErr] = useState("");

  const [mobileNo, setMobileNo] = useState("");
  const [mobileNumErr, setMobileNumErr] = useState("");
  const [mobileNoContry, setMobileNoContry] = useState("");
  const [mobileNoContryErr, setMobileNoContryErr] = useState("");
  const [SecltedmobileNoContry, setSelectedMobileNoContry] = useState("");

  const [designation, setDesignation] = useState("");
  const [designationErr, setDesignationErr] = useState("");

  const [userEmail, setUserEmail] = useState("");
  const [userEmailErr, setUserEmailErr] = useState("");

  const [gender, setGender] = useState("");
  const [genderErr, setGenderErr] = useState("");

  const [birthDate, setBirthDate] = useState("");
  const [birthDateErr, setBirthDateErr] = useState("");

  const [anniversaryDt, setAnniversaryDt] = useState("");
  const [anniversaryDtErr, setAnniversaryDtErr] = useState("");

  const [companyNm, setCompanyNm] = useState("");
  const [companyNmErr, setCompanyNmErr] = useState("");

  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryErr, setSelectedCountryErr] = useState("");

  const [stateData, setStateData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateErr, setSelectedStateErr] = useState("");

  const [pincode, setPincode] = useState("");
  const [pincodeErr, setPincodeErr] = useState("");

  const [historyApiData, setHistoryApiData] = useState([])
  const [description, setDescription] = useState("")
  const [descriptionErr, setDescriptionErr] = useState("")
  const [loading, setLoading] = useState(false);

  const [entryVia, setEntryVia] = useState("0");
  const [referenceFromList, setReferenceFromList] = useState([]);
  const [referenceFrom, setReferenceFrom] = useState("");
  const [cityData, setCityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCityErr, setSelectedCityErr] = useState("");
  const propsData = props.location.state;
  const rolesArr = Config.getDesignationList()

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

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
    console.log("propsData", propsData);
    if (propsData !== undefined) {
      setEntryID(propsData.row);
      setIsEdit(propsData.isEdit);
      setIsView(propsData.isViewOnly);
      getDataforEdit(propsData.row);
    }
    //eslint-disable-next-line
  }, []);

  function getDataforEdit(id) {
    let apiS
    if(propsData?.modalView === 0){
      apiS = `api/usermaster/lead/user/${id}`
    }else if(propsData?.modalView === 1){
      apiS = `api/usermaster/lead/existingUser/${id}`
    }
    axios
      .get(Config.getCommonUrl() + apiS)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          var data = response.data.data;
          setUserName(data.full_name);
          setMobileNoContry({
            value: data.first_country_id,
            label: `${data.first_country_name} (${data.first_country_code})
            `,
            Ccode: data.first_country_code,
          })
          setMobileNo(data.mobile_number);
          if(rolesArr.includes(data.designation)){
            setDesignation({value : data.designation,label:data.designation});
          }else{
            setDesignation({value : "Other",label:"Other"});
          }
          setEntryVia(data.addedBy === 1 ? "0" : "1");
          setGender({
            value: data.gender,
            label: data.gender === 0 ? "Male" : "Female",
          });
          setBirthDate(
            moment(new Date(data.date_of_birth)).format("YYYY-MM-DD")
          );
          setAnniversaryDt(
            moment(new Date(data.date_of_anniversary)).format("YYYY-MM-DD")
          );
          setUserEmail(data.email ? data.email : "");
          setCompanyNm(data.company_name);
          setSelectedCountry({
            value: data?.country_name?.id,
            label: data?.country_name?.name,
          });
          setSelectedState({
            value: data?.state_name?.id,
            label: data?.state_name?.name,
          });
          setSelectedCity({
            value: data?.city_name?.id,
            label: data?.city_name?.name,
          });
          setPincode(data.pincode);
          if(data?.country_name?.id){
            getStatedata(data?.country_name?.id);
          }
          if(data?.state_name?.id){
            getCityData(data?.state_name?.id);
          }
          if (data.entry_reference) {
            setReferenceFrom({
              value: data.entry_reference_key,
              label: data.entry_reference,
            });
          }
          if(propsData?.modalView === 1){
            setHistoryApiData(data?.conversationDetails)
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: apiS });
      });
  }

  useEffect(() => {
    getCountrydata();
    getReferenceList();
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
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/country" });
      });
  }

  function getReferenceList() {
    axios
      .get(Config.getCommonUrl() + "api/usermaster/lead/typelist")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);

          const key = Object.values(response.data.data);
          const values = Object.keys(response.data.data);
          let temp = [{ value: 0, label: "Manual" }];
          for (let i = 0; i < values.length; i++) {
            temp.push({
              value: values[i],
              label: key[i],
            });
          }
          console.log(temp);
          setReferenceFromList(temp);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/usermaster/lead/typelist",
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

  function handleChangefirstcode(value) {
    setMobileNoContry(value);
    setSelectedMobileNoContry(value.Ccode)
    setMobileNoContryErr("");
  }

  function getCityData(stateID) {
    axios
      .get(Config.getCommonUrl() + "api/country/city/" + stateID)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setCityData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/country/city/" + stateID });
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
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/country/state/" + countryID });
      });
  }

  function handleChangeState(value) {
    // console.log(value);
    setSelectedState(value);
    setSelectedStateErr("");
    setCityData([]);
    setSelectedCity("");
    getCityData(value.value);
  }

  function handleChangeCity(value) {
    // console.log(value);
    setSelectedCity(value);
    setSelectedCityErr("");
  }

  function handleInputChange(event) {
    // console.log("handleInputChange");

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "userName") {
      setUserName(value);
      setUserNmErr("");
    } else if (name === "mobileNo") {
      setMobileNo(value);
      setMobileNumErr("");
    } else if (name === "designation") {
      setDesignation(value);
      setDesignationErr("");
    } else if (name === "userEmail") {
      setUserEmail(value);
      setUserEmailErr("");
    } else if (name === "companyNm") {
      setCompanyNm(value);
      setCompanyNmErr("");
    } else if (name === "birthDate") {
      setBirthDateErr("");
      setBirthDate(value);
    } else if (name === "anniversary") {
      setAnniversaryDt(value);
      setAnniversaryDtErr("");
    } else if (name === "pincode") {
      setPincode(value);
      setPincodeErr("");
    }
  }

  function hangleGenderChange(value) {
    setGender(value);
    setGenderErr("");
  }

  function NameValidation() {
    // var Regex = /^[a-zA-Z\s]*$/;
    if (userName === "") {
      setUserNmErr("Enter Full Name");
      return false;
    }
    return true;
  }

  function designationValidation() {
    // var Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (designation === "" || designation === null) {
      setDesignationErr("Enter designation");
      return false;
    }
    return true;
  }

  function contryCodeValidation() {
    if (mobileNoContry.value === undefined) {
      setMobileNoContryErr("Please select Country");
      return false;
    }
    return true;
  }

  function mobileNoValidation() {
    var Regex = /^[0-9]{3,}$/;
    if (!mobileNo) {
      setMobileNumErr("Please Enter Mobile No");
      return false;
    } else if (Regex.test(mobileNo) === false) {
      setMobileNumErr("Please Enter Valid Mobile No");
      return false;
    }
    return true;
  }

  function genderValidation() {
    if (gender === "") {
      setGenderErr("Please Select Gender");
      return false;
    }
    return true;
  }

  function emailValidation() {
    //const Regex = /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g;
    const Regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!userEmail || Regex.test(userEmail) === false) {
      setUserEmailErr("Enter Valid Email Id");
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

  function validateCompany() {
    if (companyNm === "") {
      setCompanyNmErr("Please enter company name");
      return false;
    }
    return true;
  }

  const handleRolesChange = (value) => {
    console.log(value);
    setDesignation(value);
    setDesignationErr("")
  }

  const genderArr = [
    { id: 0, name: "Male" },
    { id: 1, name: "Female" },
  ];

  function handleFormSubmit() {
    console.log("handleFormSubmit");
    if (
      NameValidation() &&
      contryCodeValidation() &&
      mobileNoValidation() &&
      designationValidation() &&
      genderValidation() &&
      validateCompany() &&
      emailValidation() &&
      pincodeValidation() &&
      countryValidation() &&
      stateValidation() &&
      cityValidation()
    ) {
      let body = {
        full_name: userName,
        mobile_number: mobileNo,
        designation: designation.value,
        gender: gender.value,
        email: userEmail,
        company_name: companyNm,
        country: selectedCountry.value,
        state: selectedState.value,
        city: selectedCity.value,
        pincode: pincode,
        date_of_anniversary: anniversaryDt,
        date_of_birth: birthDate,
        entry_reference: referenceFrom.label,
        first_country_id:mobileNoContry.value,
        conversation : description
      };
      if (isEdit) {
        updateApi(body);
      } else {
        AddUserApi(body);
      }
    }
  }

  function AddUserApi(body) {
    console.log(body);
    axios
      .post(Config.getCommonUrl() + "api/usermaster/lead-user-create", body)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          History.push(`/dashboard/mobappadmin/otherlead`);
          dispatch(Actions.showMessage({ message: response.data.message }));
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/usermaster/lead-user-create",
          body: body,
        });
      });
  }

  function updateApi(body) {
    console.log(body);
    let upApi 
    if(propsData?.modalView === 0){
      upApi = `api/usermaster/lead/user/update/${entryId}`
    }else if(propsData?.modalView === 1){
      upApi = `api/usermaster/updateExistingUser/${entryId}`
    }
    axios
      .put(
        Config.getCommonUrl() + upApi,
        body
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          propsData.apiData.splice(propsData.page*10)
          History.push(`/dashboard/mobappadmin/otherlead`,{iseditView : true , page : propsData.page , search : propsData.search , apiData : propsData.apiData, count : propsData.count});
          dispatch(Actions.showMessage({ message: response.data.message }));
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: upApi,
          body: body,
        });
      });
  }

  const hanglerefChange = (value) => {
    setReferenceFrom(value);
  };

  
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
              <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                 
                    {isEdit ? "Edit" : "Add"} Other Lead

                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              >
                <div className="btn-back">
                  <Button
                    id="btn-back"
                    className=""
                    size="small"
                    onClick={(event) =>{ (isEdit || isView) && !propsData.from?
                      History.push('/dashboard/mobappadmin/otherlead', { page : propsData.page , search : propsData.search , apiData : propsData.apiData, count : propsData.count}): 
                      propsData?.from ? History.push(propsData.from ,{mainTab : propsData?.mainTab , subTab : propsData?.subTab,page : propsData.page , search : propsData.search , apiData : propsData.apiData, count : propsData.count}) 
                      : History.push('/dashboard/mobappadmin/otherlead')
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
                
              </Grid>
            </Grid>
            <div className="main-div-alll ">
              <div>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <RadioGroup
                    aria-label="Invoice"
                    name="Invoice"
                    className={classes.group}
                    value={entryVia}
                  >
                    <FormControlLabel
                      disabled
                      value="0"
                      control={<Radio />}
                      label="Manually Entry"
                    />
                    <FormControlLabel
                      disabled
                      value="1"
                      control={<Radio />}
                      label="Entry via URL"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              <div className="pb-32 pt-32 pl-16 pr-16">
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  onSubmit={handleFormSubmit}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={3} style={{ padding: 5 }}>
                      <p className="popup-labl pb-1">Full Name*</p>
                      <TextField
                        // className="mt-16"
                        placeholder="Full Name"
                        autoFocus
                        name="userName"
                        value={userName}
                        error={userNmErr.length > 0 ? true : false}
                        helperText={userNmErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </Grid>

                    <Grid item xs={3} style={{ padding: 5 }}>
                     <p className="popup-labl pb-1">Mobile Number*</p>
                        <div style={{display:"flex"}}>
                        <Grid style={{width:"40%"}}>   
                          <Select
                           className="input-select-bdr-dv"
                           filterOption={createFilter({ ignoreAccents: false })}
                           classes={classes}
                           styles={selectStyles}
                           placeholder={<div>Country Code</div>}
                           options={countryData.map((suggestion) => ({
                           value: suggestion.id,
                           label: `${suggestion.name} (${suggestion.phonecode})`,
                           Ccode: suggestion.phonecode,
                          // index: index,
                           }))}
                           value={mobileNoContry}
                           onChange={handleChangefirstcode}
                           isDisabled={isView}
                         />
                         <span className={classes.errorMessage}>
                           {mobileNoContryErr.length > 0 ? mobileNoContryErr : ""}
                         </span>
                       </Grid>     
                       <Grid style={{width:"60%"}}>
                            <TextField 
                              // label="Mobile Number"
                              name="mobileNo"
                              placeholder="Mobile No"
                              value={mobileNo}
                              error={mobileNumErr.length > 0 ? true : false}
                              helperText={mobileNumErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                              disabled={isView}
                             />
                         </Grid>
                       </div>
                    </Grid>           

                    <Grid item xs={3} style={{ padding: 5 , marginTop:"22px"}}>
                        <Select
                        // className="mt-16"
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={rolesArr.map((suggestion) => ({
                          value: suggestion,
                          label: suggestion,
                        }))}
                        value={designation}
                        onChange={handleRolesChange}
                        placeholder="Designation"
                        isDisabled={isView}
                      />
                      <span style={{ color: "red" }}>
                        {designationErr.length > 0 ? designationErr : ""}
                      </span>
                    </Grid>

                    <Grid item xs={3} style={{ padding: 5 }}>
                      <p className="popup-labl pb-1">Select Gender</p>
                      <Select
                        // className="mt-16"
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={genderArr.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        value={gender}
                        onChange={hangleGenderChange}
                        placeholder="Select Gender"
                        isDisabled={isView}
                      />

                      <span style={{ color: "red" }}>
                        {genderErr.length > 0 ? genderErr : ""}
                      </span>
                    </Grid>

                    <Grid item xs={3} style={{ padding: 5 }}>
                      <p className="popup-labl pb-1">Birth Date</p>
                      <TextField
                        // label="Birth Date"
                        // className="mt-16"
                        name="birthDate"
                        value={birthDate}
                        type="date"
                        variant="outlined"
                        fullWidth
                        onKeyDown={(e) => e.preventDefault()}
                        error={birthDateErr.length > 0 ? true : false}
                        helperText={birthDateErr}
                        onChange={(e) => handleInputChange(e)}
                        format="yyyy/MM/dd"
                        inputProps={{
                          max: moment().format("YYYY-MM-DD"),
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={isView}
                      />
                    </Grid>

                    <Grid item xs={3} style={{ padding: 5 }}>
                      <p className="popup-labl pb-1">Aniversary Date</p>
                      <TextField
                        // className="mt-16"
                        // label="Aniversary Date"
                        name="anniversary"
                        value={anniversaryDt}
                        type="date"
                        variant="outlined"
                        fullWidth
                        onKeyDown={(e) => e.preventDefault()}
                        error={anniversaryDtErr.length > 0 ? true : false}
                        helperText={anniversaryDtErr}
                        onChange={(e) => handleInputChange(e)}
                        format="yyyy/MM/dd"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: moment(new Date(birthDate))
                            .add(1, "days")
                            .format("YYYY-MM-DD"),
                        }}
                        disabled={isView}
                      />
                    </Grid>

                    <Grid item xs={3} style={{ padding: 5 }}>
                      <p className="popup-labl pb-1">Company Name*</p>
                      <TextField
                        // className="mt-16"
                        placeholder="Company Name"
                        name="companyNm"
                        value={companyNm}
                        error={companyNmErr.length > 0 ? true : false}
                        helperText={companyNmErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </Grid>

                    <Grid item xs={3} style={{ padding: 5 }}>
                      <p className="popup-labl pb-1">Email ID*</p>
                      <TextField
                        // className="mt-16"
                        placeholder="Email ID"
                        name="userEmail"
                        value={userEmail}
                        error={userEmailErr.length > 0 ? true : false}
                        helperText={userEmailErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </Grid>

                    <Grid item xs={3} style={{ padding: 5 }}>
                      <p className="popup-labl pb-1">Pincode*</p>
                      <TextField
                        // className="mt-16"
                        placeholder="Pincode"
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

                    <Grid item xs={3} style={{ padding: 5 }}>
                      <p className="popup-labl pb-1">Country</p>
                      <Select
                        // className="mt-16"
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
                        placeholder="Country"
                        isDisabled={isView}
                      />

                      <span style={{ color: "red" }}>
                        {selectedCountryErr.length > 0
                          ? selectedCountryErr
                          : ""}
                      </span>
                    </Grid>

                    <Grid item xs={3} style={{ padding: 5 }}>
                      <p className="popup-labl pb-1">State</p>
                      <Select
                        // className="mt-16"
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
                        placeholder="State"
                        isDisabled={isView}
                      />

                      <span style={{ color: "red" }}>
                        {selectedStateErr.length > 0 ? selectedStateErr : ""}
                      </span>
                    </Grid>

                    <Grid item xs={3} style={{ padding: 5 }}>
                      <p className="popup-labl pb-1">City</p>
                      <Select
                        // className="mt-16"
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
                        isDisabled={isView}
                        placeholder="City"
                      />

                      <span style={{ color: "red" }}>
                        {selectedCityErr.length > 0 ? selectedCityErr : ""}
                      </span>
                    </Grid>
                    <Grid item xs={3} style={{ padding: 5 }}>
                      <p className="popup-labl pb-1">Select Reference From</p>
                      <Select
                        // className="mt-16"
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={referenceFromList.map((suggestion) => ({
                          value: suggestion.value,
                          label: suggestion.label,
                        }))}
                        value={referenceFrom}
                        onChange={hanglerefChange}
                        placeholder="Select Reference From"
                        isDisabled={isView}
                      />
                    </Grid>

                    {
                    propsData?.modalView === 1 && <>
                  <Grid item xs={3} style={{ padding: 5 }}>
                      <TextField
                      // className="mt-16"
                      placeholder="Description"
                      name="description"
                      value={description}
                      error={descriptionErr.length > 0 ? true : false}
                      helperText={descriptionErr}
                      onChange={(e) => {setDescription(e.target.value); setDescriptionErr("")}}
                      variant="outlined"
                      required
                      fullWidth
                      multiline
                      minRows={4}
                      maxrows={4}
                      disabled={isView}
                    />
                  </Grid>
                    </>
                  }

                  </Grid>
                </form>
              </div>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  id="btn-save"
                  aria-label="Register"
                  hidden={isView}
                  style={{ float: "right", margin: "20px" }}
                  onClick={handleFormSubmit}
                >
                  {isEdit ? "Update" : "Save"}
                </Button>
              </div>

              {
              propsData?.modalView === 1 &&  
                <>
                 <Typography className="ml-32 p-16 pb-8 pl-0 text-18 font-700">
                    Conversation History : 
                  </Typography>
                <Paper className={clsx(classes.tabroot, "ml-16 mr-16 stockitemyype-tabe-dv")}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableRowPad}>Admin Name</TableCell>
                    <TableCell className={classes.tableRowPad}>Craeted at</TableCell>
                    <TableCell className={classes.tableRowPad}>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyApiData.map((row) => (
                      <TableRow key={row.createdAt}>
                        <TableCell className={classes.tableRowPad}>{row.adminDetails.username}</TableCell>
                        <TableCell className={classes.tableRowPad}>{row.created_at}</TableCell>
                        <TableCell className={classes.tableRowPad}>{row.conversation}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Paper>
                </>
            }

            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddNewLead;

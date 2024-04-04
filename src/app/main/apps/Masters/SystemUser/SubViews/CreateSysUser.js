import React, { useState, useEffect } from "react";
import { Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField } from "@material-ui/core";
import Select, { createFilter } from "react-select";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  form: {
    marginTop: "3%",
    display: "contents",
  },
  Select:{
    margin:"10px"

  }
}));

const CreateSysUser = (props) => {
  const isEdit = props.isEdit; //if comes from edit
  const idToBeEdited = props.editID;
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [cPassword, setCpassword] = useState("");
  const [role, setRole] = useState("");

  const [isEmailErr, setIsEmailErr] = useState(false);
  const [emailErrTex, setEmailErrTxt] = useState("");

  const [isUNmErr, setIsUNmErr] = useState(false);
  const [uNmErrTxt, setUNmErrTxt] = useState("");

  const [isPwdErr, setIsPwdErr] = useState(false);
  const [pwdErrTxt, setPwdErrTxt] = useState("");

  const [isCPwdErr, setIsCPwdErr] = useState(false);
  const [cPwdErrTxt, setCPwdErrTxt] = useState("");

  const [isRoleErr, setIsRoleErr] = useState(false);
  const [roleErrTxt, setRoleErrTxt] = useState("");

  const [roleOptions, setRoleOption] = useState([]);

  const [departmentData, setDepartmentData] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState([]); //multi
  const [selectedDeptErr, setSelectedDeptErr] = useState("");

  const [locationArr, setLocationArr] = useState([]);
  const [selectLocation, setLocation] = useState([]);
  const [selectLocationErr, setLocationErr] = useState("");

  const [selectedDefDept, setSelectedDefDept] = useState("");
  const [selectedDefErr, setSelectedDefErr] = useState("");
  
  const [SelectedValue, setSelectedValue] = useState("");
  const [database, setDatabase] = useState("");
  const [databaseErr, setDatabaseErr] = useState("")

  const [signatureimageUrl, setSignatureImageUrl] = useState("");
  const [signatureimgFile, setSignatureImgFile] = useState("");

  const [adharCardImageUrl, setAdharCardImageUrl] = useState("");
  const [adharCardImgFile, setAdharCardImgFile] = useState("");

  const [mNumber, setMNumber] = useState("");
  const [mNumberErr, setMNumberErr] = useState("");

  const [adharCardNumber, setAdharCardNumber] = useState("");
  const [adharCardNumberErr, setAdharCardNumberErr] = useState("");

  const [designation, setDesignation] = useState("");

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
  }, []);

  function handleChange(event) {
    setSelectedValue(event.target.value);
  }

  useEffect(() => {
    if (!isEdit) {
      setUserName("");
      getAdminRoleList();
    }

    if (isEdit === true) {
      //get one admin data
      axios
        .get(Config.getCommonUrl() + "api/admin/" + idToBeEdited)
        .then(function (response) {
          if (response.data.success === true) {
            console.log(response);
            setUserName(response.data.data.username);
            setEmail(response.data.data.email)
            getAllDepartmentData(response.data.data.departments);
            getLocations(response.data.data.locations);
            getAdminRoleList(response.data.data.role_id);
            setMNumber(response.data.data?.mobile_number);
            setAdharCardNumber(response.data.data.adhar_card_number);
            setAdharCardImageUrl(response.data.data.adhar_card_photo);
            setSignatureImageUrl(response.data.data.signature_image);
            console.log(response.data.data);
            setDesignation(response.data.data?.designation);

            if(response.data.data.is_retailer_admin == 0){
              setSelectedValue("0");
              setDatabase(response.data.data.database);
            }else{
              setSelectedValue("1");
              setDatabase(response.data.data.database);
            }
          } else {
            dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          }
        })
        .catch(function (error) {
          handleError(error, dispatch, { api: "api/admin/" + idToBeEdited });
        });
    } else {
      getAllDepartmentData([]);
      getLocations([]);
    }
  }, []);

  function getAllDepartmentData(array) {
    //all department data
    axios
      .get(Config.getCommonUrl() + "api/department/all")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setDepartmentData(response.data.data);
          let tempData = response.data.data;
          if (array.length > 0) {
            if (isEdit === true) {
              let temp = [];
              for (let i = 0; i < array.length; i++) {
                const findIndex = tempData.findIndex(
                  (a) => a.id === array[i].department_id
                );

                if (array[i].is_main === 1) {
                  const defIndex = tempData.findIndex(
                    (a) => a.id === array[i].department_id
                  );
                  setSelectedDefDept({
                    value: tempData[defIndex].id,
                    label: tempData[defIndex].name,
                  });
                }
                if (findIndex > -1) {
                  temp.push({
                    value: tempData[findIndex].id,
                    label: tempData[findIndex].name,
                  });
                }
              }
              setSelectedDepartment(temp);
            }
          }
        } else {
          setDepartmentData([]);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/department/all" });
      });
  }

  function getLocations(array) {
    axios
      .get(Config.getCommonUrl() + "api/jobworker/listing/listing")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setLocationArr(response.data.data);
          const tempData = response.data.data;
          if (array.length > 0) {
            if (isEdit === true) {
              let temp = [];
              for (let i = 0; i < array.length; i++) {
                const findIndex = tempData.findIndex(
                  (a) => a.id === array[i].department_id
                );

                if (findIndex > -1) {
                  temp.push({
                    value: tempData[findIndex].id,
                    label: tempData[findIndex].name,
                  });
                }
              }
              setLocation(temp);
            }
          }
        } else {
          setLocationArr([]);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/jobworker/listing/listing" });
      });
  }

  function getAdminRoleList(roleId) {
    //role list
    axios
      .get(Config.getCommonUrl() + "api/adminrole")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const roleData = response.data.data;
          setRoleOption(roleData);

          if (isEdit && roleId) {
            roleData.map((rVal) => {
              if (rVal.id === roleId) {
                setRole({
                  value: rVal.id,
                  label: rVal.role_name,
                });
              }
            });
          }
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/adminrole" });
      });
  }

  const classes = useStyles();

  function handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    if (name === "userName") {
      setIsUNmErr(false);
      setUNmErrTxt("");
      setUserName(value);
    } 
    else 
    if (name === "email") {
      setIsEmailErr(false);
      setEmailErrTxt("");
      setEmail(value);
    }else
     if (name === "password") {
      setIsPwdErr(false);
      setPwdErrTxt("");
      setPassword(value);
    } else if (name === "pConfirm") {
      setIsCPwdErr(false);
      setCPwdErrTxt("");
      setCpassword(value);
    } else if(name === "database") {
      setDatabase(value);
      setDatabaseErr("");
    } else if (name === "mnumber") {
      setMNumberErr("");
      mNumberValidation(value);
      setMNumber(value);
    } else if (name === "adharnumber") {
      setAdharCardNumberErr("");
      adharCardValidation(value);
      setAdharCardNumber(value);
    } else if (name === "designation") {
      setDesignation(value);
    }
  }

  function handleSelectRole(value) {
    setIsRoleErr(false);
    setRoleErrTxt("");
    setRole(value);
  }

  function emailValidation() {
    var emailRegex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || emailRegex.test(email) === false) {
      setIsEmailErr(true);
      setEmailErrTxt("Enter email id");
      return false;
    }
    return true;
  }

  function mNumberValidation(value) {
    const mobileNumberPattern = /^[0-9]{10}$/;
    if (value !== "" && !mobileNumberPattern.test(value)) {
      setMNumberErr("Please enter valid mobile number");
      return false;
    }
    return true;
  }
  function adharCardValidation(value) {
    const mobileNumberPattern = /^[2-9]{1}[0-9]{11}$/;
    if (value !== "" && !mobileNumberPattern.test(value)) {
      setAdharCardNumberErr("Please enter valid adhar number");
      return false;
    }
    return true;
  }

  function usernameValidation() {
    //username
    // const regex = /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g;        regex.test(email) === false ||
    // var usernameRegex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    var usernameRegex = /^[a-zA-Z]+$/;
    if (!userName || usernameRegex.test(userName) === false) {
      setIsUNmErr(true);
      setUNmErrTxt(
        "Please enter a valid Username. Does not accept space, numbers, and special characters in Username."
      );

      return false;
    }
    return true;
  }

  function password_validate() {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!password || regex.test(password) === false) {
      setIsPwdErr(true);
      setPwdErrTxt(
        "Password must have Uppercase, Lowercase, special character,number and limit 8 must be required"
      );

      return false;
    }
    return true;
  }

  function validateConfiPwd() {
    if (password !== cPassword) {
      setIsCPwdErr(true);
      setCPwdErrTxt("Passwords don't match");
      return false;
    }
    return true;
  }

  function validateSelectRole() {
    if (role === "") {
      setIsRoleErr(true);
      setRoleErrTxt("Please Select Role");
      return false;
    }
    return true;
  }

  function validateDepartments() {
    if (selectedDepartment.length === 0) {
      setSelectedDeptErr("Please Select Department");
      return false;
    }
    return true;
  }

  function validatedDefDepartment() {
    if (selectedDefDept === "") {
      setSelectedDefErr("Please Select Default Department");
      return false;
    }
    return true;
  }

  function validateDatabase() {
    if (parseInt(SelectedValue) !== 0  && database === ""){
      setDatabaseErr("Please Enter Database Name");
      return false;
    }
    return true;
  }
  console.log(databaseErr,"err")

  function handleFormSubmit(ev) {
    ev.preventDefault();
    if (isEdit === false) {
      // add new flow
      if (
        usernameValidation() &&
        emailValidation()&&
        password_validate() &&
        validateConfiPwd() &&
        validateSelectRole() &&
        validateDepartments() &&
        validatedDefDepartment() &&
        validateDatabase() &&
        mNumberValidation(mNumber) &&
        adharCardValidation(adharCardNumber)
        ) {
        callCreateAdminApi();
      }
    } else {
      //edit flow
      if (password !== "" || cPassword !== "") {
        //if they dont want to change Pwd
        //if not null then check
        if (
          emailValidation()&&
          password_validate() &&
          validateConfiPwd() &&
          validateDepartments() &&
          validatedDefDepartment() &&
          mNumberValidation(mNumber) &&
          adharCardValidation(adharCardNumber)
        ) {
          callChangePassword();
        }
      } else {
        if (
          emailValidation() && 
          validateDepartments() && 
          validatedDefDepartment() &&
          mNumberValidation(mNumber) &&
          adharCardValidation(adharCardNumber)
         ) {
          callChangePassword();
        }
      }
    }
  }

  //regestering new admin user
  function callCreateAdminApi() {

    let tempDepartments = selectedDepartment.map((curVal) =>
      Number(curVal.value)
    );

    let tempLocation = selectLocation.map((temp) => Number(temp.value));

    const formData = new FormData();
    formData.append("username", userName);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("role_id", role.value);
    formData.append("departments", tempDepartments);
    formData.append("default_department", selectedDefDept.value);
    formData.append("locations", tempLocation);
    formData.append("signature_image", signatureimgFile);
    formData.append("mobile_number", mNumber);
    formData.append("adhar_card_number", adharCardNumber);
    formData.append("adhar_card_image", adharCardImgFile);
    formData.append("designation", designation);


    axios
      .post(Config.getCommonUrl() + "api/admin", formData)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // Data stored successfully
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setUserName("");
          setPassword("");
          setCpassword("");
          setSelectedDefDept("");
          setSelectedDepartment([]);
          setLocation([]);
          props.changeView();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/admin",
          body: {
            username: userName,
            email:email,
            password: password,
            role_id: role.value,
            departments: tempDepartments,
            default_department: selectedDefDept.value,
            locations: tempLocation,
            ...(SelectedValue == 0 
            ? { is_retailer_admin: parseFloat(SelectedValue), database: null }
            : {  is_retailer_admin: parseFloat(SelectedValue),database: database})
          },
        });
      });
  }

  function callChangePassword() {
    let tempDepartments = selectedDepartment.map((curVal) =>
      Number(curVal.value)
    );

    let tempLocation = selectLocation.map((temp) => Number(temp.value));

    const formData = new FormData();
    formData.append("id", idToBeEdited);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("name", userName);
    formData.append("role_id", role.value);
    formData.append("departments", tempDepartments);
    formData.append("location", tempLocation);
    // formData.append("location_id");
    formData.append("default_department", selectedDefDept.value);
    formData.append("signature_image", signatureimgFile);
    formData.append("mobile_number", mNumber);
    formData.append("adhar_card_number", adharCardNumber);
    formData.append("adhar_card_image", adharCardImgFile);
    formData.append("designation", designation);

    console.log("callChangePassword", idToBeEdited);
    console.log("password", password);
    console.log("role", role);

  
    axios
      .post(Config.getCommonUrl() + "api/admin/changepassword", formData)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // Data stored successfully
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setUserName("");
          setEmail("");
          setPassword("");
          setCpassword("");
          setSelectedDefDept("");
          setSelectedDepartment([]);
          props.changeView();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/admin/changepassword",
          body: {
            name: "",
            email:email,
            id: idToBeEdited,
            password: password,
            role_id: role.value,
            departments: tempDepartments,
            default_department: selectedDefDept.value,
            locations: tempLocation,
            ...(SelectedValue == 0
              ? { is_retailer_admin: parseFloat(SelectedValue), database: null }
              : {  is_retailer_admin: parseFloat(SelectedValue),database: database})
          },
        });
      });
  }

  const handleDepartment = (value) => {
    setSelectedDepartment(value);
    setSelectedDeptErr("");

    setSelectedDefDept("");
  };

  const handleLocation = (value) => {
    setLocation(value);
    setLocationErr("");
  };

  const handleDefDept = (value) => {
    setSelectedDefDept(value);
    setSelectedDefErr("");
  };

  const handleSignatureClick = (event) => {
    hiddenSignatureFileInput.current.click();
  };
  const hiddenSignatureFileInput = React.useRef(null);

  function setSignature(signatureimgFile) {
    console.log(signatureimgFile);
    setSignatureImageUrl(URL.createObjectURL(signatureimgFile));
    setSignatureImgFile(signatureimgFile);
  }

  const handleClickAdharCard = (event) => {
    hiddenFileInput.current.click();
  };
  const hiddenFileInput = React.useRef(null);

  function setAdharCardImages(adharCardImgFile) {
    console.log(adharCardImgFile);
    setAdharCardImageUrl(URL.createObjectURL(adharCardImgFile));
    setAdharCardImgFile(adharCardImgFile);
  }
  
  return (
    <div className={clsx(classes.root, props.className, "w-full ")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            <div>
              <div style={{ width: "100%" }}>
                {/* <h4 className="mt-16 mb-16">
                  {isEdit === false ? "CREATE USER" : "EDIT USER"}
                </h4> */}

                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  onSubmit={handleFormSubmit}
                >
                  {" "}
                  <p className="">User name*</p>
                  <TextField
                  className="user-item-w mb-8"
                    // className="mt-8"
                    placeholder="Enter designer name"
                    autoFocus
                    type="name"
                    name="userName"
                    disabled={isEdit}
                    value={userName}
                    error={isUNmErr}
                    helperText={uNmErrTxt}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    style={{width:"30%"}}
                  />

                  <p className="mt-8">Email*</p>
                   <TextField
                        className="mb-8"
                        // label="Email"
                        autoFocus
                        type="email"
                        name="email"
                        // disabled={isEdit}
                        value={email}
                        error={isEmailErr}
                        helperText={emailErrTex}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        style={{width:"30%"}}
                        placeholder='Enter email id'
                                />

                     <p className="mt-8">Password*</p>
                  <TextField
                    placeholder="**************"
                  className="user-item-w mb-8"
                    type="password"
                    name="password"
                    value={password}
                    error={isPwdErr}
                    helperText={pwdErrTxt}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    style={{width:"30%"}}
                  />
                  <p className="mt-8">Confirm password*</p>
                  <TextField
                    placeholder=""
                  className="user-item-w mb-8"

                    type="password"
                    name="pConfirm"
                    value={cPassword}
                    error={isCPwdErr}
                    helperText={cPwdErrTxt}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    style={{width:"30%"}}
                  />
                  <p className="mt-8">User role*  </p>
                  <Select
                  className={"all-select-user mb-8"}
                    filterOption={createFilter({ ignoreAccents: false })}
                    lable="Select User Role"
                    placeholder="Select user role"
                    options={roleOptions.map((optn) => ({
                      value: optn.id,
                      label: optn.role_name,
                    }))}
                    value={role}
                    onChange={handleSelectRole}
                    required
                  />
                  <span style={{ color: "red" }}>
                    {isRoleErr ? roleErrTxt : ""}
                  </span>
                  <p className="mt-2">
                  Department {" "}
                  </p>
                  <Select
                    classes={classes}
                    className={"all-select-user mb-8"}
                    styles={selectStyles}
                    closeMenuOnSelect={false}
                    isMulti
                    options={departmentData.map((optn) => ({
                      value: optn.id,
                      label: optn.name,
                    }))}
                    value={selectedDepartment}
                    onChange={handleDepartment}
                    filterOption={createFilter({
                      ignoreAccents: false,
                    })}
                    placeholder="Select department"
                  />
                  <span>
                    {selectedDeptErr.length > 0 ? selectedDeptErr : ""}
                  </span>
                  <p className="mt-2">Select location </p>
                  <Select
                    classes={classes}
                  className={"all-select-user mb-8"}
                    styles={selectStyles}
                    // className="mt-2"
                    closeMenuOnSelect={false}
                    isMulti
                    options={locationArr.map((optn) => ({
                      value: optn.id,
                      label: optn.name,
                    }))}
                    value={selectLocation}
                    onChange={handleLocation}
                    filterOption={createFilter({
                      ignoreAccents: false,
                    })}
                    placeholder="Select location"
                  />
                  <span>
                    {selectLocationErr.length > 0 ? selectLocationErr : ""}
                  </span>
                  <p className="mt-2">
                  Default department {" "}
                  </p>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    className={"all-select-user mb-8 "}
                    lable="Default department"
                    placeholder="Select default department"
                    options={selectedDepartment.map((optn) => ({
                      value: optn.value,
                      label: optn.label,
                    }))}
                    value={selectedDefDept}
                    onChange={handleDefDept}
                    required
                  />
                  <span style={{ color: "red" }}>
                    {selectedDefErr.length > 0 ? selectedDefErr : ""}
                  </span>
                  <div>

                  <p className="mt-8">Mobile Number</p>
                   <TextField
                        className="mb-8"
                        autoFocus
                        type="number"
                        name="mnumber"
                        value={mNumber}
                        error={mNumberErr.length > 0 ? true : false}
                        helperText={mNumberErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        style={{width:"30%"}}
                        placeholder='Enter Mobile Number'
                                />

                <p className="mt-8">Aadhar Card Number</p>
                   <TextField
                        className="mb-8"
                        autoFocus
                        name="adharnumber"
                        value={adharCardNumber}
                        error={adharCardNumberErr.length > 0 ? true : false}
                        helperText={adharCardNumberErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        style={{width:"30%"}}
                        placeholder='Enter Aadhar Card No'
                                />

                  <p className="mt-8">Designation</p>
                   <TextField
                        className="mb-8"
                        autoFocus
                        name="designation"
                        value={designation}
                        // error={isUNmErr}
                        // helperText={uNmErrTxt}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        style={{width:"30%"}}
                        placeholder='Enter Designation'
                                />

                <div className="add-textfiled mt-6">
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <RadioGroup
                    name="SelectedValue"
                    // className={classes.group}
                    value={SelectedValue}
                    onChange={handleChange}
                    style={{ display: "block" }}
                  >
                    <FormControlLabel
                      value="0"
                      control={<Radio />}
                      label="ERP"
                    />
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="Retailor "
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              {SelectedValue === "1" && (
                <>
                  <div className="add-textfiled">
                    <p>Database name</p>
                    <TextField
                      placeholder="Enter database name"
                      name="database"
                      value={database}
                      error={databaseErr.length > 0 ? true : false}
                      helperText={databaseErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
                </>
              )}

                  <Grid item xs={12}>
                      <Grid container spacing={2}>

                        <Grid item xs={12} sm={3}>
                          {console.log(signatureimageUrl)}
                          <div
                            style={{
                              height:
                                adharCardImageUrl !== null ||
                                signatureimageUrl !== null
                                  ? "200px"
                                  : "",
                            }}
                          >
                            {signatureimageUrl !== "" &&
                              signatureimageUrl !== null && (
                                <img
                                  src={signatureimageUrl}
                                  style={{
                                    width: "auto",
                                    height: "200px",
                                    marginInline: "auto",
                                    display: "block",
                                  }}
                                  alt="signature"
                                />
                              )}
                          </div>

                          <Button
                            id="upload-btn-jewellery"
                            variant="contained"
                            color="primary"
                            style={{
                              backgroundColor: "#283428",
                              color: "white",
                              width: "100%",
                            }}
                            onClick={handleSignatureClick}
                          >
                            Upload Signature
                          </Button>

                          <input
                            type="file"
                            ref={hiddenSignatureFileInput}
                            onChange={(event) => {
                              setSignature(event.target.files[0]);
                            }}
                            accept="image/png"
                            style={{ display: "none" }}
                          />
                        </Grid>


                        <Grid item xs={12} sm={3}>
                          {console.log(adharCardImageUrl)}
                          <div
                            style={{
                              height:
                                adharCardImageUrl !== null ||
                                signatureimageUrl !== null
                                  ? "200px"
                                  : "",
                            }}
                          >
                            {adharCardImageUrl !== "" &&
                              adharCardImageUrl !== null && (
                                <img
                                  src={adharCardImageUrl}
                                  style={{
                                    width: "auto",
                                    height: "200px",
                                    marginInline: "auto",
                                    display: "block",
                                  }}
                                  alt="adharcardimage"
                                />
                              )}
                          </div>
                          <Button
                            id="upload-btn-jewellery"
                            variant="contained"
                            color="primary"
                            style={{
                              backgroundColor: "#283428",
                              color: "white",
                              width: "100%",
                            }}
                            onClick={handleClickAdharCard}
                          >
                            Aadhar Card Image
                          </Button>

                          <input
                            type="file"
                            ref={hiddenFileInput}
                            onChange={(event) => {
                              setAdharCardImages(event.target.files[0]);
                            }}
                            accept="image/*"
                            style={{ display: "none" }}
                          />
                        </Grid>


                      </Grid>
                    </Grid>

                  <Button
                    id="btn-save"
                    style={{float:"right"}}
                    variant="contained"
                    color="primary"
                    className="w-128 mt-16"
                    aria-placeholder="Register"
                    //   disabled={!isFormValid()}
                    // type="submit"
                    onClick={handleFormSubmit}
                  >
                    Save
                  </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default CreateSysUser;

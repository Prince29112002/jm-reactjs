import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import { Button, TextField } from "@material-ui/core";
import Select, { createFilter } from "react-select";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  form: {
    marginTop: "3%",
    display: "contents",
  },
  TextFieldWidth: {
    maxWidth:"400px"
  }
}));

const CreateDesignUser = (props) => {
  const isEdit = props.isEdit; //if comes from edit
  const idToBeEdited = props.editID;
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCpassword] = useState("");
  const [role, setRole] = useState("");

  const [isUNmErr, setIsUNmErr] = useState(false);
  const [uNmErrTxt, setUNmErrTxt] = useState("");

  const [isPwdErr, setIsPwdErr] = useState(false);
  const [pwdErrTxt, setPwdErrTxt] = useState("");

  const [isCPwdErr, setIsCPwdErr] = useState(false);
  const [cPwdErrTxt, setCPwdErrTxt] = useState("");

  const [isRoleErr, setIsRoleErr] = useState(false);
  const [roleErrTxt, setRoleErrTxt] = useState("");

  const [roleOptions, setRoleOption] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState({ value: 7, label: "Design" }); //multi
  const [selectedDeptErr, setSelectedDeptErr] = useState("");

  const [locationArr, setLocationArr] = useState([])
  const [selectLocation, setLocation] = useState([]);
  const [selectLocationErr, setLocationErr] = useState("");

  // const [selectedDefDept, setSelectedDefDept] = useState("");
  // const [selectedDefErr, setSelectedDefErr] = useState("");

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
    NavbarSetting('Master', dispatch);
  }, []);

  useEffect(() => {

    getLocations()

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
            const apiData = response.data.data
            setUserName(apiData.username);
            getAdminRoleList(apiData.role_id);
            setLocation({
              value: apiData.location_id,
              label: apiData.location_name
            })
          } else {
            dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          }
        })
        .catch(function (error) {
          handleError(error, dispatch, { api: "api/admin/" + idToBeEdited })

        });
    }
  }, []);

  function getLocations() {
    axios
      .get(Config.getCommonUrl() + "api/designerlocation")
      .then(function (response) {
        if (response.data.success) {
          console.log(response);
          setLocationArr(response.data.data)
        } else {
          setLocationArr([]);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/designerlocation" })

      });
  }

  function getAdminRoleList(roleId) {
    //role list
    axios
      .get(Config.getCommonUrl() + "api/adminrole?is_design_master=1")
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
        handleError(error, dispatch, { api: "api/adminrole?is_design_master=1" })
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
    } else if (name === "password") {
      setIsPwdErr(false);
      setPwdErrTxt("");
      setPassword(value);
    } else if (name === "pConfirm") {
      setIsCPwdErr(false);
      setCPwdErrTxt("");
      setCpassword(value);
    }
  }

  function handleSelectRole(value) {
    setIsRoleErr(false);
    setRoleErrTxt("");
    setRole(value);
  }

  function emailValidation() {
    //username
    // const regex = /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g;        regex.test(email) === false ||
    // var usernameRegex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    var usernameRegex = /^[a-zA-Z]+$/
    if (!userName || usernameRegex.test(userName) === false) {
      setIsUNmErr(true);
      setUNmErrTxt("Please enter a valid Username. Does not accept space, numbers, and special characters in Username.");

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
    if (selectedDepartment === "") {
      setSelectedDeptErr("Please Select Department");
      return false;
    }
    return true;
  }

  // function validatedDefDepartment() {
  //   if (selectedDefDept === "") {
  //     setSelectedDefErr("Please Select Default Department");
  //     return false;
  //   }
  //   return true;
  // }

  function handleFormSubmit(ev) {
    ev.preventDefault();
    if (isEdit === false) {
      // add new flow
      if (
        emailValidation() &&
        password_validate() &&
        validateConfiPwd() &&
        validateSelectRole() &&
        validateDepartments()
      ) {
        callCreateAdminApi();
      }
    } else {
      //edit flow
      if (password !== "" || cPassword !== "") {
        //if they dont want to change Pwd
        //if not null then check
        if (
          password_validate() &&
          validateConfiPwd() &&
          validateDepartments()
        ) {
          callChangePassword();
        }
      } else {
        if (validateDepartments()
          // && validatedDefDepartment()
        ) {
          callChangePassword();
        }
      }
    }
  }

  //regestering new admin user
  function callCreateAdminApi() {

    axios
      .post(Config.getCommonUrl() + "api/admin", {
        username: userName,
        password: password,
        role_id: role.value,
        departments: selectedDepartment.value,
        default_department: selectedDepartment.value,
        location_id: selectLocation.value,
      })
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // Data stored successfully
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setUserName("");
          setPassword("");
          setCpassword("");
          // setSelectedDefDept("");
          setSelectedDepartment([]);
          setLocation([]);
          props.changeView();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/admin", body: {
            username: userName,
            password: password,
            role_id: role.value,
            departments: selectedDepartment.value,
            default_department: selectedDepartment.value,
            location_id: selectLocation.value,
          }
        })

      });
  }

  function callChangePassword() {
    axios
      .post(Config.getCommonUrl() + "api/admin/changepassword", {
        name: "",
        id: idToBeEdited,
        password: password,
        role_id: role.value,
        departments: selectedDepartment.value,
        default_department: selectedDepartment.value,
        location_id: selectLocation.value
      })
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // Data stored successfully
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setUserName("");
          setPassword("");
          setCpassword("");
          // setSelectedDefDept("");
          setSelectedDepartment([]);
          props.changeView();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/admin/changepassword", body: {
            name: "",
            id: idToBeEdited,
            password: password,
            role_id: role.value,
            departments: selectedDepartment.value,
            default_department: selectedDepartment.value,
            location_id: selectLocation.value
          }
        })

      });
  }

  const handleDepartment = (value) => {
    setSelectedDepartment(value);
    setSelectedDeptErr("");

    // setSelectedDefDept("");
  };

  const handleLocation = (value) => {
    setLocation(value);
    setLocationErr("");
  }

  // const handleDefDept = (value) => {
  //   setSelectedDefDept(value);
  //   setSelectedDefErr("");
  // };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            <div className="pb-32  pl-16 pr-16">
              <div style={{ width: "100%" }}>
                {/* <Typography variant="h6" className="mt-16 mb-16">
                  {isEdit === false ? "CREATE DESIGN USER" : "EDIT DESIGN USER"}
                </Typography> */}

                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  onSubmit={handleFormSubmit}
                >
                  <label className="mt-16 mb-2">Designer name* </label>
                   <Grid item xs={12}>
                  <TextField
                    className={classes.TextFieldWidth}
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
                    fullWidth
                    placeholder="Enter designer name"
                  />
                  </Grid>
                  <label className="mt-16 ">Password* </label>
                  <Grid item xs={8} sm={6} md={5} lg={3}>
                  <TextField
                    className="mt-2"
                    type="password"
                    name="password"
                    value={password}
                    error={isPwdErr}
                    helperText={pwdErrTxt}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                    placeholder="****************"

                  />
                  </Grid>
                  <label className="mt-16 ">Confirm password* </label>
                  <Grid item xs={8} sm={6} md={5} lg={3}>
                  <TextField
                    className="mt-2"
                    type="password"
                    name="pConfirm"
                    value={cPassword}
                    error={isCPwdErr}
                    helperText={cPwdErrTxt}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                    placeholder=""

                  />
</Grid>
                  <label className="mt-16 ">Designer Role : </label>
                  <Grid item xs={8} sm={6} md={5} lg={3}>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    className="mt-2"
                    lable="Designer Role"
                    placeholder="Designer Role"
                    options={roleOptions.map((optn) => ({
                      value: optn.id,
                      label: optn.role_name,
                    }))}
                    value={role}
                    onChange={handleSelectRole}
                    required
                  />
                  </Grid>
                  <span style={{ color: "red" }}>
                    {isRoleErr ? roleErrTxt : ""}
                  </span>

                  <label className="mt-16 ">Select department </label>
                  <Grid item xs={8} sm={6} md={5} lg={3}>
                  <Select
                    classes={classes}
                    styles={selectStyles}
                    className="mt-2"
                    value={selectedDepartment}
                    onChange={handleDepartment}
                    filterOption={createFilter({
                      ignoreAccents: false,
                    })}
                    isDisabled
                    placeholder="Select department"
                  />
                  </Grid>
                  <span style={{ color: "red" }}>
                    {selectedDeptErr.length > 0 ? selectedDeptErr : ""}
                  </span>

                  <label className="mt-16 ">Select location</label>
                  <Grid item xs={8} sm={6} md={5} lg={3}>
                  <Select
                    classes={classes}
                    styles={selectStyles}
                    className="mt-2"
                    options={locationArr.map((optn) => ({
                      value: optn.id,
                      label: optn.location,
                    }))}
                    value={selectLocation}
                    onChange={handleLocation}
                    filterOption={createFilter({
                      ignoreAccents: false,
                    })}
                    placeholder="Select location"
                  />
                  </Grid>
                  <span style={{ color: "red" }}>
                    {selectLocationErr.length > 0 ? selectLocationErr : ""}
                  </span>

                  {/* <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    className="mt-16"
                    lable="Default Department"
                    placeholder="Default Department"
                    value={selectedDepartment}
                    disabled
                    required
                  />
                  <span style={{ color: "red" }}>
                    {selectedDefErr.length > 0 ? selectedDefErr : ""}
                  </span> */}
<div>
                  <Button
                    variant="contained"
                    color="primary"
                    className="mt-16"
                    style={{float:"right",backgroundColor: "#415BD4"}}
                    aria-label="Register"
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

export default CreateDesignUser;

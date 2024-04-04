import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Button, Box, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import History from "@history";
import Select, { createFilter } from "react-select";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},

  form: {
    marginTop: "3%",
    display: "contents",
  },
  formControl: {
    // margin: theme.spacing(3),
  },
  group: {
    // margin: theme.spacing(1, 0),

    flexDirection: "row",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
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
}));

const SalesmanInformation = forwardRef((props, ref) => {
  // const isEdit = props.isEdit; //if comes from edit
  // const idToBeEdited = props.editID;
  useImperativeHandle(ref, () => ({
    checkValidation() {
      // alert("getAlert from Child");
      return NameValidation() && emailValidation();
    },

    getData() {
      return { email: userEmail };
    },
  }));
  // const [apiData, setApiData] = useState([]);
  const dispatch = useDispatch();

  const [userName, setUserName] = useState("");
  const [userNmErr, setUserNmErr] = useState("");

  const [mobileNo, setMobileNo] = useState("");
  const [mobileNumErr, setMobileNumErr] = useState("");
  const [mobileNoContry, setMobileNoContry] = useState("");
  const [SecltedmobileNoContry, setSelectedMobileNoContry] = useState("");
  const [mobileNoContryErr, setMobileNoContryErr] = useState("");

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

  const [mPin, setmPin] = useState("");
  const [mPinErr, setmPinErr] = useState("");
  const [companyNm, setCompanyNm] = useState("");
  const [companyNmErr, setCompanyNmErr] = useState("");

  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryErr, setSelectedCountryErr] = useState("");

  const [stateData, setStateData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateErr, setSelectedStateErr] = useState("");

  const [cityData, setCityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCityErr, setSelectedCityErr] = useState("");

  const [pincode, setPincode] = useState("");
  const [pincodeErr, setPincodeErr] = useState("");

  const [status, setStatus] = useState("");
  const [statusErr, setStatusErr] = useState("");

  const classes = useStyles();

  const [isEdit, setIsEdit] = useState(false);
  const theme = useTheme();

  const [isView, setIsView] = useState(false);

  // const [disable, setDisable] = useState(false)

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
    setIsView(props.isViewOnly);
    setIsEdit(props.isEdit);
    // if(props.isEdit === false){
    //     setDisable(false)
    // }else{
    if (props.isViewOnly === true && props.isEdit === false) {
      // setDisable(true)
    }
    // }
    // if (props.isViewOnly === true) {
    let userID = props.userID;
    if (userID !== "" && userID !== undefined) {
      callReadOneSalesmanApi(userID);
    }

    // }
    //eslint-disable-next-line
  }, [props]);

  function callReadOneSalesmanApi(userID) {
    axios
      .get(Config.getCommonUrl() + "api/salesManMaster/" + userID)
      .then(function (response) {
        if (response.data.success === true) {
          var data = response.data.data;
          console.log(data);
          // setOneData(data)
          setUserName(data.full_name);
          setMobileNoContry({
            value: data.first_country_id,
            label: `${data.first_country_name} (${data.first_country_code})
            `,
            Ccode: data.first_country_code,
          });
          setMobileNo(data.mobile_number);
          setDesignation(data.designation);
          setGender(data.gender?.toString());
          setBirthDate(
            moment(new Date(data.date_of_birth)).format("YYYY-MM-DD")
          );
          setAnniversaryDt(
            moment(new Date(data.date_of_anniversary)).format("YYYY-MM-DD")
          );
          setUserEmail(data.email);
          setmPin(data.m_pin);
          setCompanyNm(data.company_name);
          setSelectedCountry({
            value: data.country_name.id,
            label: data.country_name.name,
          });

          getStatedata(data.country_name.id);
          getCityData(data.state_name.id);

          setSelectedState({
            value: data.state_name.id,
            label: data.state_name.name,
          });

          setSelectedCity({
            value: data.city_name.id,
            label: data.city_name.name,
          });

          setPincode(data.pincode);
          setStatus(data.status?.toString());
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
        handleError(error, dispatch, { api: "api/salesManMaster/" + userID });
      });
  }
  function handleChangefirstcode(value) {
    setMobileNoContry(value);
    setSelectedMobileNoContry(value.Ccode);
    setMobileNoContryErr("");
  }

  function handleInputChange(event) {
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
    } else if (name === "birthDate") {
      setBirthDateErr("");
      setBirthDate(value);
    } else if (name === "anniversary") {
      setAnniversaryDt(value);
      setAnniversaryDtErr("");
    } else if (name === "userEmail") {
      setUserEmail(value);
      setUserEmailErr("");
    } else if (name === "mPin") {
      setmPin(value);
      setmPinErr("");
    } else if (name === "companyNm") {
      setCompanyNm(value);
      setCompanyNmErr("");
    } else if (name === "pincode") {
      setPincode(value);
      setPincodeErr("");
    }
  }

  function NameValidation() {
    var Regex = /^[a-zA-Z\s]*$/;
    if (!userName || Regex.test(userName) === false) {
      setUserNmErr("Enter Valid Full Name");
      return false;
    }
    return true;
  }

  function designationValidation() {
    var Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (!designation || Regex.test(designation) === false) {
      setDesignationErr("Enter Valid Designation");
      return false;
    }
    return true;
  }

  function birthDtValidation() {
    if (birthDate === "") {
      setBirthDateErr("Please Enter Birth Date");
      return false;
    }
    return true;
  }
  function contryCodeValidation() {
    if (mobileNoContry.value === undefined) {
      setMobileNoContryErr("Please select country");
      return false;
    }
    return true;
  }

  function anniDtValidation() {
    if (anniversaryDt === "") {
      setAnniversaryDtErr("Please Enter Anniversary Date");
      return false;
    }
    return true;
  }

  function mobileNoValidation() {
    var Regex = /^[0-9]{10}$/;
    if (!mobileNo || Regex.test(mobileNo) === false) {
      setMobileNumErr("Enter Valid Mobile Number");
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

  function mPinValidation() {
    const Regex = /^(\d{4})$/;
    if (!mPin || Regex.test(mPin) === false) {
      setmPinErr("Please Enter Valid 4 Digit M-Pin");
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

  function StatusValidation() {
    if (status === "") {
      setStatusErr("Please Select Status");
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

  function handleFormSubmit(ev) {
    ev.preventDefault();
    // resetForm();

    if (
      NameValidation() &&
      contryCodeValidation() &&
      mobileNoValidation() &&
      designationValidation() &&
      genderValidation() &&
      // birthDtValidation() &&
      // anniDtValidation() &&
      emailValidation() &&
      pincodeValidation() &&
      countryValidation() &&
      stateValidation() &&
      cityValidation() &&
      mPinValidation() &&
      StatusValidation()
    ) {
      if (isEdit === true) {
        updateSalesmanApi();
      } else {
        AddSalesmanApi();
      }
    }
  }

  useEffect(() => {
    getPartyType();
    getCountrydata();
    //eslint-disable-next-line
  }, []);

  function getPartyType() {
    axios
      .get(Config.getCommonUrl() + "api/usermaster/client/type")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);

          const key = Object.values(response.data.data);
          const values = Object.keys(response.data.data);

          let temp = [];

          for (let i = 0; i < values.length; i++) {
            temp.push({
              value: values[i],
              label: key[i],
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
        handleError(error, dispatch, { api: "api/usermaster/client/type" });
      });
  }

  function AddSalesmanApi() {
    let data = {
      full_name: userName,
      mobile_number: mobileNo,
      designation: designation,
      gender: Number(gender),
      date_of_birth: birthDate,
      date_of_anniversary: anniversaryDt,
      email: userEmail,
      m_pin: mPin,
      company_name: companyNm,
      country: selectedCountry.value,
      state: selectedState.value,
      city: selectedCity.value,
      pincode: pincode,
      status: status,
      first_country_id: mobileNoContry.value,
    };

    axios
      .post(Config.getCommonUrl() + "api/salesManMaster", data)
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
        handleError(error, dispatch, { api: "api/salesManMaster", body: data });
      });
  }

  function updateSalesmanApi() {
    let data = {
      full_name: userName,
      mobile_number: mobileNo,
      designation: designation,
      gender: Number(gender),
      date_of_birth: birthDate,
      date_of_anniversary: anniversaryDt,
      email: userEmail,
      m_pin: mPin,
      company_name: companyNm,
      country: selectedCountry.value,
      state: selectedState.value,
      city: selectedCity.value,
      pincode: pincode,
      status: status,
      first_country_id: mobileNoContry.value,
    };

    axios
      .put(
        Config.getCommonUrl() + "api/salesManMaster/update/" + props.userID,
        data
      )
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id

          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          // History.push("/dashboard/masters/clients");
          History.goBack();
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
          api: "api/salesManMaster/update/" + props.userID,
          body: data,
        });
      });
  }

  function hangleGenderChange(e) {
    let value = e.target.value;
    setGender(value);
    setGenderErr("");
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

  function handleChangeStatus(event) {
    setStatus(event.target.value);
    setStatusErr("");
  }

  return (
    <div>
      <form
        name="registerForm"
        noValidate
        className="flex flex-col justify-center w-full"
        onSubmit={handleFormSubmit}
      >
        <div className="w-full flex flex-row flex-wrap  ">
          <div className="add-textfiled">
            <p>Full Name</p>
            <TextField
              className=""
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
          </div>
          <div style={{ display: "flex" }} className="add-textfiled">
            <div style={{ width: "40%" }}>
              <p>Mobile Number</p>
              <Select
                className="view_consumablepurchase_dv"
                filterOption={createFilter({ ignoreAccents: false })}
                classes={classes}
                styles={selectStyles}
                placeholder="Country Code"
                options={countryData.map((suggestion) => ({
                  value: suggestion.id,
                  label: `${suggestion.name} (${suggestion.phonecode})
                            `,
                  Ccode: suggestion.phonecode,
                }))}
                // components={components}
                value={mobileNoContry}
                onChange={handleChangefirstcode}
                isDisabled={isView}
              />
              <span className={classes.errorMessage}>
                {mobileNoContryErr.length > 0 ? mobileNoContryErr : ""}
              </span>
            </div>

            <div style={{ width: "60%", marginTop: "25px" }}>
              <TextField
                style={{}}
                // className="mt-12"
                placeholder="Mobile Number"
                name="mobileNo"
                value={mobileNo}
                error={mobileNumErr.length > 0 ? true : false}
                helperText={mobileNumErr}
                onChange={(e) => handleInputChange(e)}
                variant="outlined"
                required
                fullWidth
                disabled={isView}
              />
            </div>
          </div>
          <div className="add-textfiled">
            <p>Designation</p>
            <TextField
              className=""
              placeholder="Designation"
              name="designation"
              value={designation}
              error={designationErr.length > 0 ? true : false}
              helperText={designationErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              required
              fullWidth
              disabled={isView}
            />
          </div>
          <div className="add-textfiled">
            <p>Gender</p>
            <select
              name="gender"
              className={classes.selectBox}
              value={gender}
              disabled={isView}
              onChange={(e) => {
                hangleGenderChange(e);
              }}
            >
              <option hidden value="">
                Select Gender
              </option>
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>

            <span style={{ color: "red" }}>
              {genderErr.length > 0 ? genderErr : ""}
            </span>
          </div>
          <div className="add-textfiled">
            <p>Company Name</p>
            <TextField
              className=""
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
          </div>{" "}
          <div className="add-textfiled">
            <p>Birth Date</p>
            <TextField
              // className="mt-32"
              placeholder="Birth Date"
              name="birthDate"
              value={birthDate}
              type="date"
              variant="outlined"
              fullWidth
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
          </div>{" "}
          <div className="add-textfiled">
            <p>Aniversary Date</p>
            <TextField
              // className="mt-32"
              placeholder="Aniversary Date"
              name="anniversary"
              value={anniversaryDt}
              type="date"
              variant="outlined"
              fullWidth
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
          </div>{" "}
          <div className="add-textfiled">
            <p>Email ID</p>
            <TextField
              className=""
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
          </div>
          <div className="add-textfiled">
            <p>Pincode</p>
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
              disabled={isView}
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
              placeholder="Country"
              isDisabled={isView}
            />

            <span style={{ color: "red" }}>
              {selectedCountryErr.length > 0 ? selectedCountryErr : ""}
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
              placeholder="State"
              isDisabled={isView}
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
              placeholder="City"
              isDisabled={isView}
            />

            <span style={{ color: "red" }}>
              {selectedCityErr.length > 0 ? selectedCityErr : ""}
            </span>
          </div>
          <div className="add-textfiled">
            <p>M-Pin</p>
            <TextField
              className=""
              placeholder="M-Pin"
              type="password"
              name="mPin"
              value={mPin}
              error={mPinErr.length > 0 ? true : false}
              helperText={mPinErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              required
              fullWidth
              disabled={isView}
            />
          </div>{" "}
          <div className="add-textfiled">
            <p>Status</p>
            <FormControl component="fieldset" className={classes.formControl}>
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
                  disabled={isView}
                />
                <FormControlLabel
                  value="0"
                  control={<Radio />}
                  label="Deactive"
                  disabled={isView}
                />
              </RadioGroup>
              <span style={{ color: "red" }}>
                {statusErr.length > 0 ? statusErr : ""}
              </span>
            </FormControl>
          </div>{" "}
          <div className="add-textfiled"></div>
        </div>
      </form>
      <Button
        id="btn-save"
        className="w-128 mx-auto mt-16 float-right"
        aria-placeholder="Register"
        hidden={isView}
        // type="submit"
        onClick={(e) => {
          handleFormSubmit(e);
        }}
      >
        Save
      </Button>
    </div>
  );
});

export default SalesmanInformation;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Select, { createFilter } from "react-select";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { TextField, Icon, IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import LoaderPopup from "../../../../Loader/LoaderPopup";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";
import clsx from "clsx";

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

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
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
}));

const AddEditStation = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [stationName, setStationName] = useState("");
  const [stationNameErr, setStationNameErr] = useState("");

  const [stationAddress, setStationAddress] = useState("");
  const [stationAddressErr, setStationAddressErr] = useState("");

  const [stateList, setStateList] = useState([]);
  const [stationState, setStationState] = useState("");
  const [stationStateErr, setStationStateErr] = useState("");

  const [cityList, setCityList] = useState([]);
  const [stationCity, setStationCity] = useState("");
  const [stationCityErr, setStationCityErr] = useState("");

  const [countryData, setCountryData] = useState([]);
  const [mobileNoContry, setMobileNoContry] = useState("");
  const [SecltedmobileNoContry, setSelectedMobileNoContry] = useState("");
  const [mobileNoContryErr, setMobileNoContryErr] = useState("");

  const [registrationNum, setRegistrationNum] = useState("");
  const [registrationNumErr, setRegistrationNumErr] = useState("");

  const [stationContact, setStationContact] = useState("");
  const [stationContactErr, setStationContactErr] = useState("");

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
    if (props.data) {
      const EditDataId = props.data;
      getDataForEdit(EditDataId);
    } else {
      getStatedata();
    }
  }, []);

  useEffect(() => {
    if (stationState === null || stationState === "") {
      setCityList([]);
      setStationCity("");
    } else {
      getCitydata(stationState.value);
    }
  }, [stationState]);

  useEffect(() => {
    getCountrydata();
    //eslint-disable-next-line
  }, []);

  const getDataForEdit = (id) => {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/hallmarkissue/station/${id}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const tempData = response.data.Stations[0];
          setStationName(tempData.name);
          setStationAddress(tempData.address);
          setRegistrationNum(tempData.registration_no);
          setStationContact(tempData.contact);
          getStatedata(tempData.state_id);
          getCitydata(tempData.state_id, tempData.city_id);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/hallmarkissue/station/${id}`,
        });
      });
  };

  const getStatedata = (stateId) => {
    axios
      .get(Config.getCommonUrl() + "api/country/state/" + 1)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const tempData = response.data.data;
          setStateList(tempData);
          if (stateId) {
            tempData.map((item) => {
              if (item.id === stateId) {
                setStationState({
                  value: item.id,
                  label: item.name,
                });
              }
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
        handleError(error, dispatch, { api: "api/country/state/" + 1 });
      });
  };

  const handleClose = () => {
    setOpen(false);
    props.modalColsed();
  };

  const handleModalClose = () => {
    setOpen(false);
    props.headerClose();
  };

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "stationName") {
      setStationNameErr("");
      setStationName(value);
    } else if (name === "stationAddress") {
      setStationAddressErr("");
      setStationAddress(value);
    } else if (name === "stationContact") {
      setStationContactErr("");
      setStationContact(value);
    } else if (name === "registrationNum") {
      setRegistrationNum(value);
      setRegistrationNumErr("");
    }
  };

  function stationNameValidate() {
    if (stationName === "") {
      setStationNameErr("Please Enter Station Name");
      return false;
    }
    return true;
  }

  function stationAddressValidate() {
    if (stationAddress === "") {
      setStationAddressErr("Please Enter Station Address");
      return false;
    }
    return true;
  }

  function validateState() {
    if (stationState === "" || stationState === null) {
      setStationStateErr("Please Select Station State");
      return false;
    }
    return true;
  }

  function validateCity() {
    if (stationCity === "" || stationCity === null) {
      setStationCityErr("Please Select Station City");
      return false;
    }
    return true;
  }

  function validateRegNum() {
    if (registrationNum === "") {
      setRegistrationNumErr("Please Enter Registration Number");
      return false;
    }
    return true;
  }

  function contactNumberValidation() {
    var Regex = /^[0-9]{10}$/;
    if (!stationContact || Regex.test(stationContact) === false) {
      setStationContactErr("Enter Valid Contact Number");
      return false;
    }
    return true;
  }

  function handleChangefirstcode(value) {
    setMobileNoContry(value);
    setSelectedMobileNoContry(value.Ccode);
    setMobileNoContryErr("");
  }
  function countryCodeValidation() {
    if (mobileNoContry === "") {
      setMobileNoContryErr("Please select country code");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (
      stationNameValidate() &&
      stationAddressValidate() &&
      validateState() &&
      validateCity() &&
      validateRegNum() &&
      countryCodeValidation() &&
      contactNumberValidation()
    ) {
      props.data ? callUpdateStationApi() : callAddStationApi();
    }
  };

  function callAddStationApi() {
    const body = {
      name: stationName,
      address: stationAddress,
      contact: stationContact,
      city_id: stationCity.value,
      state_id: stationState.value,
      registration_no: registrationNum,
      first_country_id: mobileNoContry.value,
    };
    axios
      .post(Config.getCommonUrl() + "api/hallmarkissue/station/add", body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setStationName("");
          setStationAddress("");
          setStationContact("");
          setStateList([]);
          setStationState("");
          setCityList([]);
          setStationCity("");
          setRegistrationNum("");
          dispatch(
            Actions.showMessage({
              message: "Station Added Successfully",
              variant: "success",
            })
          );
          handleClose();
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
          api: "api/hallmarkissue/station/add",
          body: body,
        });
      });
  }

  function callUpdateStationApi() {
    const id = props.data;
    const body = {
      name: stationName,
      address: stationAddress,
      contact: stationContact,
      city_id: stationCity.value,
      state_id: stationState.value,
      registration_no: registrationNum,
      first_country_id: mobileNoContry.value,
    };
    axios
      .put(
        Config.getCommonUrl() + `api/hallmarkissue/station/update/${id}`,
        body
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setStationName("");
          setStationAddress("");
          setStationContact("");
          setStateList([]);
          setStationState("");
          setCityList([]);
          setStationCity("");
          setRegistrationNum("");
          dispatch(
            Actions.showMessage({
              message: "Station Updated Successfully",
              variant: "success",
            })
          );
          handleClose();
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
          api: `api/hallmarkissue/station/update/${id}`,
          body: body,
        });
      });
  }

  const handleChangeState = (value) => {
    setStationCity("");
    setStationState(value);
    setStationStateErr("");
  };

  const handleChangeCity = (value) => {
    setStationCity(value);
    setStationCityErr("");
  };

  const getCitydata = (stateId, cityId) => {
    if (stateId !== "") {
      axios
        .get(Config.getCommonUrl() + "api/country/city/" + stateId)
        .then(function (response) {
          if (response.data.success === true) {
            const tempData = response.data.data;
            setCityList(tempData);
            if (cityId) {
              tempData.map((item) => {
                if (item.id === cityId) {
                  setStationCity({
                    value: item.id,
                    label: item.name,
                  });
                }
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
          handleError(error, dispatch, { api: "api/country/city/" + stateId });
        });
    }
  };

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

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleModalClose();
          }
        }}
      >
        <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
          <h5 className="popup-head p-20">
            {loading && <LoaderPopup />}
            {props.data ? "Edit Station" : "Add Station"}
            <IconButton
              style={{ position: "absolute", top: 5, right: 8 }}
              onClick={handleModalClose}
            >
              <Icon>
                <img src={Icones.cross} alt="" />
              </Icon>
            </IconButton>
          </h5>
          <div className="p-40 pb-32">
            <p className="popup-labl pl-1 pb-1">Station name</p>
            <TextField
              placeholder="Enter station name"
              name="stationName"
              className="mb-20"
              value={stationName}
              error={stationNameErr.length > 0 ? true : false}
              helperText={stationNameErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              fullWidth
            />

            <p className="popup-labl pl-1 pb-1">Station address</p>
            <TextField
              className="mb-20"
              placeholder="Enter station address"
              name="stationAddress"
              value={stationAddress}
              error={stationAddressErr.length > 0 ? true : false}
              helperText={stationAddressErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              fullWidth
            />

            <p className="popup-labl pl-1 pb-1">Select State</p>
            <Select
              className="mb-20"
              classes={classes}
              styles={selectStyles}
              options={stateList.map((group) => ({
                value: group.id,
                label: group.name,
              }))}
              isClearable
              filterOption={createFilter({ ignoreAccents: false })}
              value={stationState}
              onChange={handleChangeState}
              placeholder="Select state"
            />
            <span style={{ color: "red" }}>
              {stationStateErr.length > 0 ? stationStateErr : ""}
            </span>

            <p className="popup-labl pl-1 pb-1">Select city</p>
            <Select
              className="mb-20"
              classes={classes}
              styles={selectStyles}
              options={cityList.map((group) => ({
                value: group.id,
                label: group.name,
              }))}
              isClearable
              filterOption={createFilter({ ignoreAccents: false })}
              value={stationCity}
              onChange={handleChangeCity}
              placeholder="Select city"
            />
            <span style={{ color: "red" }}>
              {stationCityErr.length > 0 ? stationCityErr : ""}
            </span>

            <p className="popup-labl pl-1 pb-1">Registration no</p>
            <TextField
              className="mb-20"
              placeholder="Enter registration no"
              name="registrationNum"
              value={registrationNum}
              error={registrationNumErr.length > 0 ? true : false}
              helperText={registrationNumErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              fullWidth
            />

            <p className="popup-labl pl-1 pb-1">Select Country Code</p>
            <Select
              // className="mt-16 input-select-bdr-dv"
              className="mb-20"
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
              value={mobileNoContry}
              onChange={handleChangefirstcode}
            />
            <span className={classes.errorMessage}>
              {mobileNoContryErr.length > 0 ? mobileNoContryErr : ""}
            </span>

            <p className="popup-labl pl-1 pb-1">Contact no</p>
            <TextField
              // className="mb-20"
              placeholder="Enter contact no"
              name="stationContact"
              value={stationContact}
              error={stationContactErr.length > 0 ? true : false}
              helperText={stationContactErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              fullWidth
            />

            <div className="popup-button-div">
              <Button
                variant="contained"
                className="cancle-button-css"
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="save-button-css"
                onClick={(e) => handleFormSubmit(e)}
              >
                {props.data ? "Update Station" : "SAVE"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddEditStation;

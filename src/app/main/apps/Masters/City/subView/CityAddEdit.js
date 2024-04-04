import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { TextField, Icon, IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Select, { createFilter } from "react-select";
import clsx from "clsx";
import Icones from "assets/fornt-icons/Mainicons";

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
  inputBoxTEST: {
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
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

const CityAddEdit = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  // const theme = useTheme();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");

  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryErr, setSelectedCountryErr] = useState("");

  const [stateData, setStateData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateErr, setSelectedStateErr] = useState("");

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
    if (props.data) {
      getDataForEdit();
    }
  }, [dispatch]);
  
  function getDataForEdit() {
    const id = props.data;
    axios
      .get(Config.getCommonUrl() + `api/city/read/${id}`)
      .then((res) => {
        console.log(res);
        
        if (res.data.success === true) {
          const stateData = res.data.data;
          setName(stateData.name);
          setSelectedCountry({
            value: stateData.statename?.country_id,
            label: stateData.statename?.countryname?.name,
          });
          setSelectedState({
            value: stateData.statename?.id,
            label: stateData.statename?.name,
          });
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/city/read/${id}` });
      });
  }

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "city") {
      setName(value);
      setNameErr("");
    }
  };

  const handleClose = () => {
    setOpen(false);
    props.modalColsed();
  };

  const handleModalClose = () => {
    setOpen(false);
    props.headerClose();
  };

  function cityValidation() {
    if (name === "") {
      setNameErr("Please enter city name");
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

  const handleSubmitdata = (event) => {
    event.preventDefault();
    if (countryValidation() && stateValidation() && cityValidation()) {
      props.data ? callUpdateApi() : createStateApi();
    }
  };

  function createStateApi() {
    const body = {
      name: name,
      state_id: selectedState.value,
    };
    axios
      .post(Config.getCommonUrl() + "api/city/", body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setName("");
          setSelectedCountry("");
          setSelectedState("");
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          handleClose();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/city/", body: body });
      });
  }

  
  function callUpdateApi() {
    const id = props.data;
    const body = {
      name: name,
      state_id: selectedState.value,
    };
  
    axios
      .put(Config.getCommonUrl() + `api/city/update/${id}`, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setName("");
          setSelectedCountry("");
          setSelectedState("");
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          handleClose();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/city/update/${id}`,
          body: body,
        });
      });
  }
  function handleCountryChange(data) {
    setSelectedCountry(data);
    setSelectedCountryErr("");
    setStateData([]);
    setSelectedState("");
    setSelectedStateErr("");
    getStatedata(data.value);
  }
  function handleStateChange(data) {
    setSelectedState(data);
    setSelectedStateErr("");
  }

  useEffect(() => {
    if(selectedCountry){
      getStatedata();
    }
    getCountrydata();
  }, []);

  function getCountrydata() {
    axios
      .get(Config.getCommonUrl() + "api/country")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setCountryData(response.data.data);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
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
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/country/state/" + countryID });
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
          <h5
            className="popup-head p-20"
          
          >
            {props.data ? "Edit City" : "Add City"}
            <IconButton
              style={{ position: "absolute", top: 5, right: 8 }}
              onClick={handleModalClose}
            >
                 <Icon> <img src={Icones.cross} alt="" /> </Icon>
            </IconButton>
          </h5>
          <div className="pl-32 pr-32 pb-10 pt-10">
          <p className="popup-labl mt-16 ">Select country</p>
            <Select
              className="mt-4 input-select-bdr-dv pb-4"
              // label="Country"
              filterOption={createFilter({ ignoreAccents: false })}
              classes={classes}
              styles={selectStyles}
              options={countryData.map((suggestion) => ({
                value: suggestion.id,
                label: suggestion.name,
              }))}
              value={selectedCountry}
              onChange={handleCountryChange}
              placeholder="Country"
            />

            <span style={{ color: "red", fontSize: "9px" }}>
              {selectedCountryErr.length > 0 ? selectedCountryErr : ""}
            </span>
            <p className="popup-labl mt-16 ">Select state</p>
            <Select
              className="mt-4 input-select-bdr-dv pb-4"
              // label="State"
              filterOption={createFilter({ ignoreAccents: false })}
              classes={classes}
              styles={selectStyles}
              options={stateData.map((suggestion) => ({
                value: suggestion.id,
                label: suggestion.name,
              }))}
              value={selectedState}
              onChange={handleStateChange}
              placeholder="State"
            />
            <span style={{ color: "red", fontSize: "9px" }}>
              {selectedStateErr.length > 0 ? selectedStateErr : ""}
            </span>
            <p className="popup-labl mt-16 ">Select city</p>
            <TextField
              className="mt-4 input-select-bdr-dv pb-4"
              // label="city"
              name="city"
              value={name}
              error={nameErr.length > 0 ? true : false}
              helperText={nameErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              autoFocus
              required
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
                        onClick={(e) => handleSubmitdata(e)}
                      >
                        {props.data ? "Update" : "SAVE"}
                      </Button>
                      </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CityAddEdit;

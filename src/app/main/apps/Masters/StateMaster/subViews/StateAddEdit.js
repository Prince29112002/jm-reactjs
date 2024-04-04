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
    backgroundColor: "cornflowerblue",
    color: "white",
  },
}));

const StateAddEdit = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  // const theme = useTheme();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");

  const [gst, setGst] = useState("");
  const [gstErr, setGstErr] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryErr, setSelectedCountryErr] = useState("");
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
    //eslint-disable-next-line
  }, [dispatch]);

  function getDataForEdit() {
    const id = props.data;
    axios
      .get(Config.getCommonUrl() + `api/state/${id}`)
      .then((res) => {
        console.log(res);
        if (res.data.success === true) {
          const stateData = res.data.data;
          setName(stateData.name);
          setSelectedCountry({
            value: stateData.country_id,
            label: stateData.countryname?.name,
          });
          // setLabel(stateData.label);
          setGst(stateData.gst_code);
          setWhatsapp(stateData.whatsapp_contact);
        } else {
          dispatch(
            Actions.showMessage({ message: res.data.message, variant: "error" })
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/state/${id}` });
      });
  }

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "name") {
      setName(value);
      setNameErr("");
    } else if (name === "Gst") {
      setGst(value);
      setGstErr("");
    } else if (name === "whatsapp") {
      setWhatsapp(value);
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

  function validateState() {
    if (name === "") {
      setNameErr("Please enter state");
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

  function validateGst() {
    if (!gst) {
      setGstErr("Please enter gst");
      return false;
    }
    return true;
  }

  const handleSubmitdata = (event) => {
    event.preventDefault();
    if (validateState() && countryValidation() && validateGst()) {
      props.data ? callUpdateApi() : createStateApi();
    }
  };

  function createStateApi() {
    const body = {
      name: name,
      country_id: selectedCountry.value,
      gst_code: gst,
      whatsapp_contact: whatsapp,
    };
    axios
      .post(Config.getCommonUrl() + "api/state", body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setName("");
          setSelectedCountry("");
          setGst("");
          setWhatsapp("");
          dispatch(
            Actions.showMessage({
              message: response.data.message,
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
        handleError(error, dispatch, { api: "api/state", body: body });
      });
  }
  function callUpdateApi() {
    const id = props.data;
    const body = {
      name: name,
      country_id: selectedCountry.value,
      gst_code: gst,
      whatsapp_contact: whatsapp,
    };
    axios
      .put(Config.getCommonUrl() + `api/state/${id}`, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setName("");
          setSelectedCountry("");
          setGst("");
          setWhatsapp("");
          dispatch(
            Actions.showMessage({
              message: response.data.message,
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
          api: `api/state/${id}`,
          body: body,
        });
      });
  }
  function handleCountryChange(data) {
    setSelectedCountry(data);
    setSelectedCountryErr("");
  }

  useEffect(() => {
    // getStatedata();
    getCountrydata();
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
            {props.data ? "Edit State" : "Add New State"}
            <IconButton
              style={{ position: "absolute", top: 5, right: 8 }}
              onClick={handleModalClose}
            >
              <Icon>
                {" "}
                <img src={Icones.cross} alt="" />{" "}
              </Icon>
            </IconButton>
          </h5>
          <div className="pl-32 pr-32 pb-10 pt-10">
            <p className="popup-labl mt-16 ">State*</p>
            <TextField
              className="mt-4 input-select-bdr-dv pb-4"
              placeholder="Enter State"
              name="name"
              value={name}
              error={nameErr.length > 0 ? true : false}
              helperText={nameErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              autoFocus
              required
              fullWidth
            />

            <p className="popup-labl mt-16">Country*</p>
            <Select
              className="mt-4 input-select-bdr-dv pb-4"
              filterOption={createFilter({ ignoreAccents: false })}
              classes={classes}
              styles={selectStyles}
              options={countryData.map((suggestion) => ({
                value: suggestion.id,
                label: suggestion.name,
              }))}
              value={selectedCountry}
              onChange={handleCountryChange}
              placeholder="Enter Country"
            />

            <span style={{ color: "red", fontSize: "9px" }}>
              {selectedCountryErr.length > 0 ? selectedCountryErr : ""}
            </span>

            <p className="popup-labl mt-16 ">GST*</p>
            <TextField
              className={clsx(classes.inputBoxTEST, "mt-4 input-select-bdr-dv")}
              placeholder=" Enter GST"
              name="Gst"
              value={gst}
              type={"number"}
              error={gstErr.length > 0 ? true : false}
              helperText={gstErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              required
              fullWidth
            />
            <p className="popup-labl mt-16 ">Whatsapp No*</p>
            <TextField
              className={clsx(classes.inputBoxTEST, "mt-4 input-select-bdr-dv")}
              placeholder="Whatsapp No."
              name="whatsapp"
              value={whatsapp}
              type={"number"}
              // error={gstErr.length > 0 ? true : false}
              // helperText={gstErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
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

export default StateAddEdit;

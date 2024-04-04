import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { TextField, Icon, IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import handleError from "app/main/ErrorComponent/ErrorComponent";
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
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
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
}));

const CountryAddEdit = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  // const theme = useTheme();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");

  const [shortname, setShortname] = useState("");
  const [shortnameErr, setShortnameErr] = useState("");

  const [phoneCode, setPhoneCode] = useState("");
  const [phoneCodeErr, setPhoneCodeErr] = useState("");

  useEffect(() => {
    if (props.data) {
      getDataForEdit();
    }
    //eslint-disable-next-line
  }, [dispatch]);

  function getDataForEdit() {
    const id = props.data;
    axios
      .get(Config.getCommonUrl() + `api/country/${id}`)
      .then((res) => {
        console.log(res);
        if (res.data.success === true) {
          const ledData = res.data.data;
          setName(ledData.name);
          setShortname(ledData.shortname);
          setPhoneCode(ledData.phonecode);
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/country/${id}` });
      });
  }

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "name") {
      setName(value);
      setNameErr("");
    } else if (name === "shortName") {
      setShortname(value);
      setShortnameErr("");
    } else if (name === "phoneCode") {
      setPhoneCode(value);
      setPhoneCodeErr("");
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

  function validateName() {
    if (!name) {
      setNameErr("Enter Valid Name");
      return false;
    }
    return true;
  }

  function validateShortName() {
    if (!shortname || shortname.length > 2) {
      setShortnameErr("Enter Valid Short Name in two character ");
      return false;
    }
    return true;
  }

  function validatephoneCode() {
      var Regex = /^[0-9]{1,5}$/;
      if (!phoneCode || Regex.test(phoneCode) === false) {
          setPhoneCodeErr("Enter Valid Phone Code");
          return false;
      }
      return true;
  }

  const handleSubmitdata = (event) => {
    event.preventDefault();
    if (validateName() && validateShortName() && validatephoneCode()) {
      props.data ? callUpdateApi() : addCountrtyDataApi();
    }
  };

  function addCountrtyDataApi() {
    const body = {
      name: name,
      shortname: shortname,
      phonecode: phoneCode,
    };
    axios
      .post(Config.getCommonUrl() + "api/country", body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setName("");
          setShortname("");
          setPhoneCode("");
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          handleClose();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/country",
          body: body,
        });
      });
  }
  function callUpdateApi() {
    const id = props.data;
    const body = {
      name: name,
      shortname: shortname,
      phonecode: phoneCode,
    };
    axios
      .put(Config.getCommonUrl() + `api/country/${id}`, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setName("");
          setShortname("");
          setPhoneCode("");
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          handleClose();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/country/${id}`,
          body: body,
        });
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
            {props.data ? "Edit Country" : "Add New Country"}
            <IconButton
              style={{ position: "absolute", top:5, right:8}}
              onClick={handleModalClose}
            >
              <Icon> <img src={Icones.cross} alt="" /> </Icon>
            </IconButton>
          </h5>
          <div className="pl-32 pr-32 pb-10 pt-10">
          <p className="popup-labl mt-16 ">Name*</p>
            <TextField
              className="mt-4 input-select-bdr-dv pb-4"
              placeholder="Enter country name"
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

            <p className="popup-labl mt-16 ">Short name*</p>
            <TextField
              className="mt-4 input-select-bdr-dv pb-4"
              placeholder="Enter short name"
              name="shortName"
              value={shortname}
              error={shortnameErr.length > 0 ? true : false}
              helperText={shortnameErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              required
              fullWidth
            />

            <p className="popup-labl mt-16 ">Phone code*</p>
            <TextField
              placeholder="Enter phone code"
              name="phoneCode"
              className={clsx(
                classes.inputBoxTEST,
                "mt-4 input-select-bdr-dv pb-4"
              )}
              // type={"number"}
              value={phoneCode}
              error={phoneCodeErr.length > 0 ? true : false}
              helperText={phoneCodeErr}
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

export default CountryAddEdit;

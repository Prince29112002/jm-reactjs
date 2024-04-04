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
import LoaderPopup from '../../../../Loader/LoaderPopup';
import handleError from "app/main/ErrorComponent/ErrorComponent";
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

const AddEditLocation = (props) => {

  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [stationName, setStationName] = useState("");
  const [stationNameErr, setStationNameErr] = useState("");

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
      getDataForEdit(EditDataId)
    } 
  }, [])

  const getDataForEdit = (id) => {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/designerlocation/${id}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const tempData = response.data.data;
          setStationName(tempData.location)
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {api : `api/designerlocation/${id}`})
      });
  }

  const handleClose = () => {
    setOpen(false);
    props.modalColsed();
  };

  const handleModalClose = () => {
    setOpen(false);
    props.headerClose();
  }

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "stationName") {
      setStationNameErr("");
      setStationName(value)
    } 
  }

  function stationNameValidate() {
    if (stationName === "") {
      setStationNameErr("Please Enter Station Name");
      return false;
    }
    return true;
  }

 
  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (stationNameValidate() ) {
      props.data ? callUpdateStationApi() : callAddStationApi();
    }
  }

  function callAddStationApi() {
    const body = {
        location: stationName,
    }
    axios.post(Config.getCommonUrl() + "api/designerlocation", body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setStationName("");
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          handleClose();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {api : "api/designerlocation",body: body})
      })
  }

  function callUpdateStationApi() {
    const id = props.data;
    const body = {
        location: stationName,
    }
    axios.put(Config.getCommonUrl() + `api/designerlocation/${id}`, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setStationName("");
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          handleClose();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {api : `api/designerlocation/${id}`,body: body})
      })
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
        <div style={modalStyle} className={clsx(classes.paper,"rounded-8")}>
          <h5 className="popup-head p-20">
            {/* {loading && <LoaderPopup />} */}
            {props.data ? "Edit Location" : "Add Location"}
            <IconButton
              style={{ position: "absolute", top:5, right:8}}
              onClick={handleModalClose}
            ><Icon style={{ color: "white" }}>
                close
              </Icon></IconButton>
          </h5>
          <div className="pl-32 pr-32 pb-10 pt-10">
          <p className="popup-labl mt-16 ">Location name</p>
            <TextField
              className="mt-4 mb-8"
              placeholder="Enter location name"
              name="stationName"
              value={stationName}
              error={stationNameErr.length > 0 ? true : false}
              helperText={stationNameErr}
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
                        {props.data ? "Update Location" : "SAVE"}
                      </Button>
                      </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AddEditLocation;
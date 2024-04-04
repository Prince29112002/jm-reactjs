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

const PurityAddEdit = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  // const theme = useTheme();
  const dispatch = useDispatch();

  const [purity, setPurity] = useState("");
  const [purityErr, setPurityErr] = useState("");

  const [label, setLabel] = useState("");
  const [labelErr, setLabelErr] = useState("");

  const [Invoice, setInvoice] = useState("");
  const [InvoiceErr, setInvoiceErr] = useState("");

  const [Density, setDensity] = useState("");
  const [DensityErr, setDensityErr] = useState("");

  useEffect(() => {
    if (props.data) {
      getDataForEdit();
    }
    //eslint-disable-next-line
  }, [dispatch]);

  function getDataForEdit() {
    const id = props.data;
    axios
      .get(Config.getCommonUrl() + `api/finishPurityMaster/${id}`)
      .then((res) => {
        console.log(res);
        if (res.data.success === true) {
          const ledData = res.data.data;
          setPurity(ledData.purity);
          setLabel(ledData.label);
          setInvoice(ledData.invoice);
          setDensity(ledData.density);
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {api :  `api/finishPurityMaster/${id}`})
      });
  }

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "purity") {
      setPurity(value);
      setPurityErr("");
    } else if (name === "label") {
      setLabel(value);
      setLabelErr("");
    } else if (name === "Invoice") {
      setInvoice(value);
      setInvoiceErr("");
    } else if( name === "Density") {
      setDensity(value);
      setDensityErr("");
    }
  };

  const handleClose = () => {
    setOpen(false);
    props.modalColsed();
  };

  const handleModalClose = () => {
    setOpen(false);
    props.headerClose();
  }

  function validatePurity() {
    if (!purity) {
      setPurityErr("Enter Valid Purity");
      return false;
    }
    return true;
  }

  function validateLabel() {
    if (!label) {
      setLabelErr("Enter Valid Label");
      return false;
    }
    return true;
  }

  function validateInvoice() {
    if (!Invoice) {
      setInvoiceErr("Enter Valid Invoice");
      return false;
    }
    return true;
  }

  function validateDensity() {
    if (!Density) {
      setDensityErr("Enter Valid Density");
      return false;
    }
    return true;
  }

  const handleSubmitdata = (event) => {
    event.preventDefault();
    if (validatePurity() && validateLabel() && validateInvoice() && validateDensity()) {
      props.data ? callUpdateApi() : createFinishMasterApi();
    }
  };

  function createFinishMasterApi() {
    const body = {
      purity: purity,
      label: label,
      invoice: Invoice,
      density: Density,
    };
    axios
      .post(Config.getCommonUrl() + "api/finishPurityMaster", body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setPurity("");
          setLabel("");
          setInvoice("");
          setDensity("");
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          handleClose();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {api : "api/finishPurityMaster",body: body})
      });
  }
  function callUpdateApi() {
    const id = props.data;
    const body = {
      purity: purity,
      label: label,
      invoice: Invoice,
      density: Density,
    };
    axios
      .put(Config.getCommonUrl() + `api/finishPurityMaster/${id}`, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setPurity("");
          setLabel("");
          setInvoice("");
          setDensity("");
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          handleClose();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {api : `api/finishPurityMaster/${id}`, body: body})
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
            {props.data
              ? "Edit Finish Purity Master"
              : "Add Finish Purity Master"}
            <IconButton
              style={{ position: "absolute", top:5, right:8}}
              onClick={handleModalClose}
            ><Icon style={{ color: "white" }}>
                <img src={Icones.cross} alt="" />
              </Icon></IconButton>
          </h5>
          <div className="pl-32 pr-32 pb-10 pt-10">
          <p className="popup-labl mt-16">Purity*</p>
            <TextField
              className="mt-4 input-select-bdr-dv pb-4"
              placeholder="Enter Purity"
              name="purity"
              value={purity}
              error={purityErr.length > 0 ? true : false}
              helperText={purityErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              autoFocus
              required
              fullWidth
            />

            <p className="popup-labl mt-16">Label*</p>
            <TextField
              className="mt-4 input-select-bdr-dv pb-4"
              placeholder="Enter Label"
              name="label"
              value={label}
              error={labelErr.length > 0 ? true : false}
              helperText={labelErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              required
              fullWidth
            />
 
            <p className="popup-labl mt-16">Invoice*</p>
            <TextField
              className="mt-4 input-select-bdr-dv"
              placeholder="Enter Invoice"
              name="Invoice"
              value={Invoice}
              error={InvoiceErr.length > 0 ? true : false}
              helperText={InvoiceErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              required
              fullWidth
            />

          <p className="popup-labl mt-16">Density*</p>
            <TextField
              className="mt-4 input-select-bdr-dv"
              placeholder="Enter Invoice"
              name="Density"
              value={Density}
              error={DensityErr.length > 0 ? true : false}
              helperText={DensityErr}
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
            {/* <Button
            id="btn-save"
              variant="contained"
              color="primary"
              className="w-full mx-auto mt-20"
              style={{
                backgroundColor: "#4caf50",
                border: "none",
                color: "white",
              }}
              onClick={(e) => handleSubmitdata(e)}
            >
              {props.data ? "Update" : "SAVE"}
            </Button> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PurityAddEdit;

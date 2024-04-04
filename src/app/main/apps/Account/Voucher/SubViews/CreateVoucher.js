import React, { useState } from "react";
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
    backgroundColor: "cornflowerblue",
    color: "white",
  },
}));

const CreateGroup = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  // const theme = useTheme();
  const dispatch = useDispatch();

  const [voucherName, setVoucherName] = useState("");
  const [voucherNameErrTxt, setVoucherNameErrTxt] = useState("");

  const handleClose = (id) => {
    setOpen(false);
    props.modalColsed(id);
  };

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "voucherName") {
      setVoucherNameErrTxt("");
      setVoucherName(value);
    }
  };

  function voucherNameValidate() {
    if (voucherName === "") {
      setVoucherNameErrTxt("Please Enter Voucher Name");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (voucherNameValidate()) {
      callAddVoucherApi();
    }
  };

  function callAddVoucherApi() {
    axios
      .post(Config.getCommonUrl() + "api/vouchersettingdetail/", {
        name: voucherName,
      })
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setVoucherName("");
          dispatch(
            Actions.showMessage({
              message: "Voucher Added Successfully",
              variant: "success",
            })
          );
          handleClose(response.data.data.id);
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
          api: "api/vouchersettingdetail/",
          body: {
            name: voucherName,
          },
        });
      });
  }

  const handleModalClose = () => {
    setOpen(false);
    props.modalColsed();
  };

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
          <h5 className="popup-head p-5">
            Create Voucher
            <IconButton
              style={{ position: "absolute", top: "3px", right: "7px" }}
              onClick={handleModalClose}
            >
              <img src={Icones.cross} alt="" />
            </IconButton>
          </h5>
          <div style={{ padding: "30px" }}>
            <p style={{ marginBottom: "10px", paddingLeft: "15px", color: "#242424" }}>Voucher name</p>
            <TextField
              autoFocus
              placeholder="Voucher name"
              name="voucherName"
              value={voucherName}
              error={voucherNameErrTxt.length > 0 ? true : false}
              helperText={voucherNameErrTxt}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              fullWidth
            />
            {/* <Button
              variant="contained"
              color="primary"
              className="w-full mx-auto mt-16"
              style={{
                backgroundColor: "#4caf50",
                border: "none",
                color: "white",
              }}
              onClick={(e) => handleFormSubmit(e)}
            >
              Save
            </Button> */}
            <div
              className="flex flex-row justify-between"
              style={{ paddingTop: "30px" }}
            >
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
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateGroup;

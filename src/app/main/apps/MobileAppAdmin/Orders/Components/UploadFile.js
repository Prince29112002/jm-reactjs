import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as authActions from "app/auth/store/actions";
import * as Actions from "app/store/actions";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { TextField, Icon, IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Loader from '../../../../Loader/Loader';
import handleError from "app/main/ErrorComponent/ErrorComponent";
import sampleFile from "app/main/SampleFiles/Order/addNewDesign.csv"
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
    backgroundColor: "cornflowerblue",
    color: "white",
  },
}));

const UploadFile = (props) => {

  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [variantFile, setVariantFile] = useState(null);
  const [variantFileErr, setVariantFileErr] = useState("");


  const handleInputChange = (e) => {
    setVariantFile(e.target.files);
    setVariantFileErr("");
  }

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (variantFile === null) {
      setVariantFileErr("Please choose file")
    } else {
      const formData = new FormData();
      for (let i = 0; i < variantFile.length; i++) {
        formData.append("file", variantFile[i]);
      }
      callFileUploadApi(formData);
    }
  }

  function callFileUploadApi(formData) {
    setLoading(true);
    if (props.karat) {
      formData.append("karat", props.karat)
      formData.append("order_type", props.orderType)
      formData.append("exhibition_id", props.exhibitionId)
      var api = `api/order/upload/neworder/csv`
    } else {
      var api = `api/order/upload/order/csv/${props.id}`
    }
    const body = formData

    axios.post(Config.getCommonUrl() + api, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setVariantFile("");
          setVariantFileErr("");
          setOpen(false);
          if (props.karat) {
            props.handleModalClose(true, response.data.data);
          } else {
            dispatch(Actions.showMessage({ message: response.data.message,variant:"success"}));
            props.handleModalClose(true);
          }
        } else {
          document.getElementById("fileinput").value = "";
          let downloadUrl = response.data.url;
          window.open(downloadUrl);
          setVariantFile("");
          setVariantFileErr("");
          setOpen(false);
          props.handleModalClose(false);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: api, body: body })
      })
    document.getElementById("fileinput").value = "";
  }

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  return (
    <div>
      {loading && <Loader />}
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            setOpen(false);
            props.handleModalClose(false);
          }
        }}
      >
        <div style={modalStyle}
          //  className={classes.paper}
          className={clsx(classes.paper, "rounded-8")}
        >
          <h5
            className="popup-head p-5"
          /* style={{
            textAlign: "center",
            backgroundColor: "black",
            color: "white",
          }} */
          >
            Upload New Design
            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={() => { props.handleModalClose(false); setOpen(false); }}
            ><Icon style={{ color: "white" }}>
                close
              </Icon></IconButton>
          </h5>

          <div className="p-5 pl-16 pr-16">
            <label>Upload CSV Excel File</label>
            <TextField
              id="fileinput"
              className="mt-16 mb-16"
              // label="Upload CSV Excel File"
              name="variantFile"
              type="file"
              error={variantFileErr.length > 0 ? true : false}
              helperText={variantFileErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />

            <a href={sampleFile} download="Upload_New_Design.csv">Download Sample </a>
            <div className="flex flex-row justify-around p-5 pb-20">
              <Button
                variant="contained"
                className="cancle-button-css"
                onClick={() => { props.handleModalClose(false); setOpen(false); }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="save-button-css"
                onClick={(e) => handleFileUpload(e)}
              >
                Upload
              </Button>
            </div>

            {/* <Button
              variant="contained"
              color="primary"
              className="w-full mx-auto mt-16"
              style={{
                backgroundColor: "#4caf50",
                border: "none",
                color: "white",
              }}
               onClick={(e) => handleFileUpload(e)}
            >
              Upload
            </Button> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UploadFile
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
import Loader from "../../../../Loader/Loader";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import sampleFile from "app/main/SampleFiles/DesignModule/Designs.csv";
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

const FileUpload = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [variantFile, setVariantFile] = useState(null);
  const [variantFileErr, setVariantFileErr] = useState("");

  const handleClose = () => {
    setOpen(false);
    props.modalColsed();
  };

  const handleCloseModal = () => {
    setOpen(false);
    props.moldalheaderClose();
  };

  const handleInputChange = (e) => {
    setVariantFile(e.target.files);
    setVariantFileErr("");
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (variantFile === null) {
      setVariantFileErr("Please choose file");
    } else {
      const formData = new FormData();
      for (let i = 0; i < variantFile.length; i++) {
        formData.append("file", variantFile[i]);
      }
      callFileUploadApi(formData);
    }
  };
  useEffect(() => {
    pageUpdate();
  }, [pageUpdate]);

  const pageUpdate = () => {
    props.setPage(0);
  };
  function callFileUploadApi(formData) {
    setLoading(true);
    const body = formData;
    if (props.btn === 1) {
      var api = "api/design/upload";
      axios
        .post(Config.getCommonUrl() + api, body)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            setVariantFile("");
            setVariantFileErr("");
            handleClose();
            dispatch(
              Actions.showMessage({
                message: "New Variant File Uploaded Successfully",
                variant: "success",
              })
            );
          } else {
            let downloadUrl = response.data.url;
            window.open(downloadUrl);
            setVariantFile("");
            setVariantFileErr("");
            handleClose();
            dispatch(
              Actions.showMessage({
                message: response.data.message,
                variant: "error",
              })
            );
            document.getElementById("fileinput").value = "";
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          handleError(error, dispatch, { api: api, body: body });
        });
      document.getElementById("fileinput").value = "";
    } else if (props.btn === 5) {
      var api = "api/design/upload/update";
      axios
        .put(Config.getCommonUrl() + api, body)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            setVariantFile("");
            setVariantFileErr("");
            handleClose();
            dispatch(
              Actions.showMessage({
                message: "New Variant File Uploaded Successfully",
                variant: "success",
              })
            );
          } else {
            let downloadUrl = response.data.url;
            window.open(downloadUrl);
            setVariantFile("");
            setVariantFileErr("");
            handleClose();
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
          handleError(error, dispatch, { api: api, body: body });
        });
    }
    // else if(props.btn === 6){
    //   var api = "api/design/variant/combination"
    // }else if(props.btn === 7){
    //   var api = "api/design/size/combination"
    // }
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
            handleCloseModal();
          }
        }}
      >
        <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
          <h5
            className="popup-head p-20"
            style={{
              textAlign: "center",
              backgroundColor: "#415BD4",
              color: "white",
            }}
          >
            {props.btn === 1 && "Upload New Variants"}
            {props.btn === 5 && "Upload Updated Variants"}
            {/* {props.btn === 6 &&  "Upload Collection Variant Wise"}
            {props.btn === 7 &&  "Upload Collection Size Wise"}  */}
            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={handleCloseModal}
            >
              <Icon style={{ color: "white" }}>close</Icon>
            </IconButton>
          </h5>

          <div className="p-5 pl-16 pr-16">
            <p className="popup-labl p-4 ">Upload CSV Excel File</p>
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

            <a
              href={sampleFile}
              download={
                props.btn === 1
                  ? "Upload_New_Variants.csv"
                  : "Upload_Updated_Variants.csv"
              }
            >
              Download Sample{" "}
            </a>
            {/* 
            <Button
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
            <div className="flex flex-row justify-between">
              <Button
                variant="contained"
                className="w-155 mt-5 popup-cancel delete-dialog-box-cancle-button"
                onClick={handleCloseModal}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="w-155 mt-5 popup-save"
                onClick={(e) => handleFileUpload(e)}
              >
                upload a file
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FileUpload;

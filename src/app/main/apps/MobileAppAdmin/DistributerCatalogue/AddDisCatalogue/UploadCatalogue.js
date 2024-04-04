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
import sampleFile from "app/main/SampleFiles/DistributerCatalogue/distributerCatalogue.csv";
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

const UploadCatalogue = (props) => {

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
    var api = `api/distributorCatalogue/upload`
    const body = formData
    
      axios.post(Config.getCommonUrl() + api, body)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            setVariantFile("");
            setVariantFileErr("");
            setOpen(false)
            props.handleModalClose(true,response.data.data);   
          } else {
            document.getElementById("fileinput").value = "";
            let downloadUrl = response.data.url;
            console.log(downloadUrl);
            window.open(downloadUrl);
            setVariantFile("");
            setVariantFileErr("");
            setOpen(false)
            props.handleModalClose(false);
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
          setLoading(false);
        })
        .catch((error) => {
          document.getElementById("fileinput").value = "";
          setLoading(false);
          setVariantFile("");
          setVariantFileErr("");
          setOpen(false)
          props.handleModalClose(false);
          console.log(error);
          handleError(error, dispatch, { api: api, body: body })
        })  
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
        <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
          <h5
            className="popup-head p-12"
          // style={{
          //   textAlign: "center",
          //   backgroundColor: "black",
          //   color: "white",
          // }}
          >
            Upload New Design
            <IconButton
              style={{ position: "absolute", top: "-2px", right: "0" }}
              onClick={() => {
                setOpen(false);
                props.handleModalClose(false);
              }}
            >
              <Icon style={{ color: "white" }}>close</Icon>
            </IconButton>
          </h5>

          <div className="p-5 pl-16 pr-16">
            <label>Upload csv excel file</label>
            <TextField
              id="fileinput"
              className="mt-1 mb-16"
              placeholder="Upload csv excel file"
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

            <a href={sampleFile} download="Upload_Distributer_Design.csv">
              Download Sample{" "}
            </a>

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
            <div className="model-actions flex flex-row pb-20">
              <Button
                variant="contained"
                className="w-128 mx-auto mt-20 popup-cancel"
                onClick={() => {
                  setOpen(false);
                  props.handleModalClose(false);
                }}
              >
                Cancel

              </Button>
              <Button
                variant="contained"
                className="w-128 mx-auto mt-20 popup-save"
                onClick={(e) => handleFileUpload(e)}
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UploadCatalogue;

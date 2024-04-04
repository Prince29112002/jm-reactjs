import React, { useState, useEffect } from "react";
import Select, { createFilter } from "react-select";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import Modal from "@material-ui/core/Modal";
import { TextField, Icon, IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
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
    // padding: theme.spacing(4),
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

const AddNewStock = (props) => {
  const [open, setOpen] = useState(true);

  const [modalStyle] = useState(getModalStyle);
  const theme = useTheme();
  const dispatch = useDispatch();

  const [stockGroupData, setStockGroupData] = useState([]); //stockgroup dropdown
  const [stockGroupErrTxt, setStockGroupErrTxt] = useState("");

  const [HSNMasterData, setHSNMasterData] = useState([]); // hsn details dropdown
  const [HSNMasterErrTxt, setHSNMasterErrTxt] = useState("");

  const [stockName, setStockName] = useState("");
  const [stockNmErrTxt, setStockNmErrTxt] = useState("");

  const [billStkNm, setBillStkNm] = useState("");
  const [billStkNmErrTxt, setBillStkNmErrTxt] = useState("");

  const [GSTNumber, setGSTNumber] = useState("");
  const [GstNumErrTxt, setGstNumErrTxt] = useState("");

  const [hsnSelected, setHsnSelected] = useState("");
  const [stockGroupSelected, setStockGroupSelected] = useState("");

  const classes = useStyles();

  useEffect(() => {
    getStockGroup();
    getHSNData();
    //eslint-disable-next-line
  }, [dispatch]);

  function getHSNData() {
    axios
      .get(Config.getCommonUrl() + "api/hsnmaster")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setHSNMasterData(response.data.data);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/hsnmaster" });
      });
  }

  function getStockGroup() {
    axios
      .get(Config.getCommonUrl() + "api/stockgroup")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockGroupData(response.data.data);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/stockgroup" });
      });
  }

  function handleChangeStockGroup(value) {
    setStockGroupSelected(value);
    setStockGroupErrTxt("");
  }

  function handleChangeHsnNum(value) {
    setHsnSelected(value);
    setHSNMasterErrTxt("");

    const findIndex = HSNMasterData.findIndex((a) => a.id === value.value);
    if (findIndex > -1) {
      setGSTNumber(HSNMasterData[findIndex].gst);
      setGstNumErrTxt("");
    }
  }

  const handleClose = () => {
    setOpen(false);
    props.modalColsed();
  };

  function handleInputChange(event) {

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "stockName") {
      setStockName(value);
      setStockNmErrTxt("");
    } else if (name === "billStockNm") {
      setBillStkNm(value);
      setBillStkNmErrTxt("");
    } else if (name === "gstNum") {
      setGSTNumber(value);
      setGstNumErrTxt("");
    }
  }

  const validateAndSubmit = (evt) => {
    evt.preventDefault();
    if (
      StockGroupvalidation() &&
      stockNameValidation() &&
      billStckNmValidation() &&
      HsnnumValidation()
    ) {
      callAddNewStockApi();
    }
  };

  function StockGroupvalidation() {
    if (stockGroupSelected === "") {
      setStockGroupErrTxt("Please Select Stock Group");
      return false;
    }
    return true;
  }

  function billStckNmValidation() {
    // var Regex = /^[a-zA-Z0-9 ]+$/; Regex.test(billStkNm) === false
    if (!billStkNm || billStkNm.trim() === "") {
      setBillStkNmErrTxt("Please Enter Billing Stock Name");
      return false;
    }
    return true;
  }

  function HsnnumValidation() {
    if (hsnSelected === "") {
      setHSNMasterErrTxt("Please Select HSN Number");
      setGstNumErrTxt(
        "Gst number must be contain state-code, pan number and 14th character z."
      );
      return false;
    }
    return true;
  }

  function stockNameValidation() {
    // var Regex = /^[a-zA-Z0-9 ]+$/; Regex.test(stockName) === false
    if (!stockName || stockName.trim() === "") {
      setStockName(true);
      setStockNmErrTxt("Please Enter Valid Stock Name");

      return false;
    }
    return true;
  }

  function callAddNewStockApi() {
    axios
      .post(Config.getCommonUrl() + "api/stockname", {
        stock_group_id: parseInt(stockGroupSelected.value),
        stock_name: stockName,
        billing_name: billStkNm,
        hsn_master_id: parseInt(hsnSelected.value),
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id
          // setGoldColor("");

          setStockName("");
          setBillStkNm("");
          setGSTNumber("");
          setHsnSelected("");
          setStockGroupSelected("");

          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));

          handleClose();
          // getGoldColor();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/stockname",
          body: {
            stock_group_id: parseInt(stockGroupSelected.value),
            stock_name: stockName,
            billing_name: billStkNm,
            hsn_master_id: parseInt(hsnSelected.value),
          },
        });
      });
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
      <Modal
        // disableBackdropClick
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
      >
        <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
          <h5
            className="popup-head"
            style={{padding: "16px"}}
          >
            Add New Stock
            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={handleClose}
            >
              <Icon>
                <img src={Icones.cross} alt="" />
              </Icon>
            </IconButton>
          </h5>
          <div style={{padding: "30px"}}>
            <p className="popup-labl" style={{paddingLeft: "15px", marginBottom: "10px"}}>Stock group</p>
            <Select
              filterOption={createFilter({ ignoreAccents: false })}
              className=" input-select-bdr-dv"
              classes={classes}
              styles={selectStyles}
              options={stockGroupData.map((suggestion) => ({
                value: suggestion.id,
                label: suggestion.group_name,
              }))}
              // components={components}
              value={stockGroupSelected}
              onChange={handleChangeStockGroup}
              placeholder="Select stock group"
            />

            <span style={{ color: "red" }}>
              {stockGroupErrTxt.length > 0 ? stockGroupErrTxt : ""}
            </span>
            <p className="popup-labl" style={{paddingLeft: "15px", marginBottom: "10px", marginTop: "15px"}}>Stock name</p>
            <TextField
              className="input-select-bdr-dv"
              placeholder="Enter stock name"
              name="stockName"
              value={stockName}
              error={stockNmErrTxt.length > 0 ? true : false}
              helperText={stockNmErrTxt}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              fullWidth
            />

            <p className="popup-labl" style={{paddingLeft: "15px", marginBottom: "10px", marginTop: "15px"}}>Billing stock name</p>
            <TextField
              className="input-select-bdr-dv"
              placeholder="Enter billing stock name"
              name="billStockNm"
              value={billStkNm}
              error={billStkNmErrTxt.length > 0 ? true : false}
              helperText={billStkNmErrTxt}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              fullWidth
            />

            <p className="popup-labl" style={{paddingLeft: "15px", marginBottom: "10px", marginTop: "15px"}}>HSN</p>
            <Select
              filterOption={createFilter({ ignoreAccents: false })}
              className="input-select-bdr-dv"
              classes={classes}
              styles={selectStyles}
              options={HSNMasterData.map((suggestion) => ({
                value: suggestion.id,
                label: suggestion.hsn_number,
              }))}
              // components={components}
              value={hsnSelected}
              onChange={handleChangeHsnNum}
              placeholder="Select hsn"
            />

            <span style={{ color: "red" }}>
              {HSNMasterErrTxt.length > 0 ? HSNMasterErrTxt : ""}
            </span>

            <p className="popup-labl" style={{paddingLeft: "15px", marginBottom: "10px", marginTop: "15px"}}>GST</p>
            <TextField
              className="input-select-bdr-dv"
              placeholder="Enter gst"
              name="gstNum"
              value={GSTNumber}
              error={GstNumErrTxt.length > 0 ? true : false}
              helperText={GstNumErrTxt}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              fullWidth
              disabled
            />

            <div className="popup-button-div">
              <Button
                variant="contained"
                className="cancle-button-css"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="save-button-css"
                onClick={(e) => validateAndSubmit(e)}
              >
                Save
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
              onClick={(e) => validateAndSubmit(e)}
            >
              Save
            </Button> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddNewStock;

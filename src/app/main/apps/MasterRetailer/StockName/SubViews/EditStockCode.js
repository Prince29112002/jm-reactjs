import React, { useState, useEffect } from "react";
import { IconButton } from "@material-ui/core";
import Select, { createFilter } from "react-select";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import Modal from "@material-ui/core/Modal";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
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

const EditStockCode = (props) => {
  const dataToBeEdited = props.editData;
  const [open, setOpen] = useState(true);

  const [modalStyle] = useState(getModalStyle);
  const theme = useTheme();
  const dispatch = useDispatch();

  const [stockGroupData, setStockGroupData] = useState([]); //stockgroup dropdown
  const [stockGroupErrTxt, setStockGroupErrTxt] = useState("");

  const [HSNMasterData, setHSNMasterData] = useState([]); // hsn details dropdown
  const [HSNMasterErrTxt, setHSNMasterErrTxt] = useState("");

  const [billStkNm, setBillStkNm] = useState("");
  const [billStkNmErrTxt, setBillStkNmErrTxt] = useState("");

  const [GSTNumber, setGSTNumber] = useState("");
  const [GstNumErrTxt, setGstNumErrTxt] = useState("");

  const [hsnSelected, setHsnSelected] = useState("");
  const [stockGroupSelected, setStockGroupSelected] = useState("");

  const [stockNameData, setStockNameData] = useState([]);
  const [selectedStockNm, setSelectedStockNmn] = useState("");
  const [stockNameErrTxt, setStockNameErrTxt] = useState("");

  const [StockType, setStockType] = useState(""); //to check and show conditional inputs based on stock group

  const [goldColorData, setGoldColorData] = useState([]);
  const [selectedGoldColor, setSelectedGoldColor] = useState("");
  const [goldColorErrTxt, setGoldColorErrTxt] = useState("");

  const [stoneColorData, setStoneColorData] = useState([]);
  const [selectedStoneColor, setSelectedStoneColor] = useState("");
  const [stoneColorErrTxt, setStoneColorErrTxt] = useState("");

  const [stoneShapeData, setStoneShapeData] = useState([]);
  const [selectedStoneShape, setSelectedStoneShape] = useState("");
  const [stoneShapeErrTxt, setStoneShapeErrTxt] = useState("");

  const [unitData, setUnitData] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [unitErrTxt, setUnitErrTxt] = useState("");

  const [stoneSizeData, setStoneSizeData] = useState([]);
  const [selectedStoneSize, setSelectedStoneSize] = useState("");
  const [stoneSizeErrTxt, setStoneSizeErrTxt] = useState("");

  // const [stoneSizeData, setStoneSizeData] = useState([]);
  // const [selectedStoneSize, setSelectedStoneSize] = useState("");
  // const [stoneSizeErrTxt, setStoneSizeErrTxt] = useState("");

  const [stockCode, setStockCode] = useState("");
  const [stockCodeErrTxt, setStockCodeErrTxt] = useState("");

  const [selectedStockDesc, setSelectedStockDesc] = useState("");
  const [stockNmDescData, setStockNmDescData] = useState([]);
  const [stkNmdescErrTxt, setstkNmdescErrTxt] = useState("");

  const [purity, setPurity] = useState("");
  const [purityErrTxt, setPurityErrTxt] = useState("");

  const [weight, setWeight] = useState(" ");
  const [weightErrTxt, setWeightErrTxt] = useState("");

  const [finding, setFinding] = useState("");

  const classes = useStyles();

  useEffect(() => {
    setStockType(dataToBeEdited.stock_type);
    getStockGroup();
    getHSNData();
    getStockName();
    setFinding(dataToBeEdited.id);
    getStockDescData(dataToBeEdited.id);
    if (dataToBeEdited.stock_type === 1) {
      //gold
      getGoldColor();
    } else if (dataToBeEdited.stock_type) {
      //metal
      getStoneColor();
      getStoneShape();
      getStoneSize();
      getUnitData();
    }

    // value: suggestion.id,
    //             label: suggestion.group_name,

    //eslint-disable-next-line
  }, [dispatch]);

  function getHSNData() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/hsnmaster")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setHSNMasterData(response.data.data);

          setHsnSelected({
            value: dataToBeEdited.hsn_master.id,
            label: dataToBeEdited.hsn_master.hsn_number,
          });

          let tempHsnData = response.data.data;

          const findIndex = tempHsnData.findIndex(
            (a) => a.id === dataToBeEdited.hsn_master.id
          );
          if (findIndex > -1) {
            setGSTNumber(tempHsnData[findIndex].gst);
            setGstNumErrTxt("");
          }
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
        handleError(error, dispatch, { api: "retailerProduct/api/hsnmaster" });
      });
  }

  function getStockGroup() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/stockgroup")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockGroupData(response.data.data);
          //edit
          setStockGroupSelected({
            label: dataToBeEdited.stock_group.group_name,
            value: dataToBeEdited.stock_group.id,
          });
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
        handleError(error, dispatch, { api: "retailerProduct/api/stockgroup" });
      });
  }

  function getStockName() {
    //only records will comes which data is not set like stock_code, description etc
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/stockname?pending_stock_code=1")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockNameData(response.data.data);
          // setData(response.data);

          setSelectedStockNmn({
            label: dataToBeEdited.stock_name,
            value: dataToBeEdited.id,
          });

          setBillStkNm(dataToBeEdited.billing_name);
          setStockCode(dataToBeEdited.stock_name_code.stock_code);
          setWeight(
            dataToBeEdited.stock_name_code.weight
              ? dataToBeEdited.stock_name_code.weight
              : ""
          );
          // setStockNmDesc(dataToBeEdited.stock_name_code.stock_description);
          //
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "retailerProduct/api/stockname?pending_stock_code=1",
        });
      });
  }

  function getGoldColor() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/goldcolor")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setGoldColorData(response.data.data);
          // setData(response.data);
          if (dataToBeEdited.stock_name_code.gold_color !== null) {
            setSelectedGoldColor({
              value: dataToBeEdited.stock_name_code.gold_color.id,
              label: dataToBeEdited.stock_name_code.gold_color.name,
            });
            setPurity(dataToBeEdited.stock_name_code.purity);
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "retailerProduct/api/goldcolor" });
      });
  }

  function getStoneColor() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/stonecolor")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStoneColorData(response.data.data);
          // setData(response.data);
          if (dataToBeEdited.stock_name_code.stone_color !== null) {
            setSelectedStoneColor({
              value: dataToBeEdited.stock_name_code.stone_color.id,
              label: dataToBeEdited.stock_name_code.stone_color.name,
            });
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "retailerProduct/api/stonecolor" });
      });
  }

  function getStoneShape() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/stoneshape")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStoneShapeData(response.data.data);
          // setData(response.data);
          if (dataToBeEdited.stock_name_code.stone_shape !== null) {
            setSelectedStoneShape({
              value: dataToBeEdited.stock_name_code.stone_shape.id,
              label: dataToBeEdited.stock_name_code.stone_shape.name,
            });
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "retailerProduct/api/stoneshape" });
      });
  }

  function getUnitData() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/unitofmeasurement")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setUnitData(response.data.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "retailerProduct/api/unitofmeasurement" });
      });
  }

  function getStoneSize() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/stonesize")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStoneSizeData(response.data.data);
          // setData(response.data);

          if (dataToBeEdited.stone_size !== null) {
            setSelectedStoneSize({
              value: dataToBeEdited.stock_name_code.stone_size.id,
              label: dataToBeEdited.stock_name_code.stone_size.size,
            });
          }
          if (dataToBeEdited.weight !== null) {
            setWeight(parseFloat(dataToBeEdited.stock_name_code.weight));
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "retailerProduct/api/stonesize" });
      });
  }

  function handleChangeGoldColor(value) {
    setSelectedGoldColor(value);
    setGoldColorErrTxt("");
  }

  function handleChangeStoneColor(value) {
    setSelectedStoneColor(value);
    setStoneColorErrTxt("");
  }

  function handleChangeStoneShape(value) {
    setSelectedStoneShape(value);
    setStoneShapeErrTxt("");
  }
  function handleChangeUnit(value) {
    setSelectedUnit(value);
    setUnitErrTxt("");
  }

  function handleChangeStoneSize(value) {
    setSelectedStoneSize(value);
    setStoneSizeErrTxt("");
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

  function handleChangeStockType(value) {
    setSelectedStockNmn(value);
    setStockNameErrTxt("");
    let id = value.value;
    const Index = stockNameData.findIndex((a) => a.id === id);
    if (Index > -1) {
      setStockType(stockNameData[Index].stock_type);
      getStockDescData(value.value);
    }
    //which type of stock to show conditional inputs
  }

  function handleStockDescChange(value) {
    setSelectedStockDesc(value);
    setstkNmdescErrTxt("");
  }

  function getStockDescData(stockNmId) {
    axios
      .get(Config.getCommonUrl() + `retailerProduct/api/stockdescription/${stockNmId}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockNmDescData(response.data.data);
          // setData(response.data);
          // if(stockNmId === dataToBeEdited.stock_name_code.stock_description.id){
          setSelectedStockDesc({
            value: dataToBeEdited.stock_name_code.stock_description.id,
            label: dataToBeEdited.stock_name_code.stock_description.description,
          });

          // }
        } else {
          setStockNmDescData("");

          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: `retailerProduct/api/stockdescription/${stockNmId}`,
        });
      });
  }

  const handleClose = () => {
    setOpen(false);
    props.modalColsed(); //closing from here so we can change the view to first one
  };

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "billStockNm") {
      setBillStkNm(value);
      setBillStkNmErrTxt("");
    } else if (name === "gstNum") {
      setGSTNumber(value);
      setGstNumErrTxt("");
    } else if (name === "stockCode") {
      setStockCodeErrTxt("");
      setStockCode(value);
    } else if (name === "purity") {
      setPurityErrTxt("");
      setPurity(value);
    } else if (name === "weight") {
      setWeight(value);
      setWeightErrTxt("");
    }
  }

  const validateAndSubmit = (evt) => {
    evt.preventDefault();
    if (
      StockGroupvalidation() &&
      stockNameValidation() &&
      billStckNmValidation() &&
      HsnnumValidation() &&
      UnitValidation
    ) {
      if (stockCodeValidation() && stockNameDescValidation()) {
        if (StockType === 1) {
          if (purityValidation() && goldColorValidation()) {
            if (finding === 14 || finding === 15) {
              if (weightValidation()) {
                upadteStockNameDetails();
              }
            } else {
              upadteStockNameDetails();
            }
          }
        } else if (StockType === 2) {
          //metal

          if (
            colorValidation() &&
            shapeValidation() &&
            sizeValidation() &&
            weightValidation()
          ) {
            upadteStockNameDetails();
          }
        }
      }
    }
  };

  function upadteStockNameDetails() {
    let data;
    if (StockType === 1) {
      if (finding === 14 || finding === 15) {
        data = {
          stock_name: selectedStockNm.label,
          billing_name: billStkNm,
          hsn_master_id: hsnSelected.value,
          stock_code: stockCode,
          stock_description_id: selectedStockDesc.value,
          purity: purity,
          gold_color_id: selectedGoldColor.value,
          weight: weight,
        };
      } else {
        data = {
          stock_name: selectedStockNm.label,
          billing_name: billStkNm,
          hsn_master_id: hsnSelected.value,
          stock_code: stockCode,
          stock_description_id: selectedStockDesc.value,
          purity: purity,
          gold_color_id: selectedGoldColor.value,
        };
      }
    } else if (StockType === 2) {
      data = {
        stock_name: selectedStockNm.label,
        billing_name: billStkNm,
        hsn_master_id: hsnSelected.value,
        stock_code: stockCode,
        stock_description_id: selectedStockDesc.value,
        stone_color_id: selectedStoneColor.value,
        stone_size_id: selectedStoneSize.value,
        stone_shape_id: selectedStoneShape.value,
        unit_id: selectedUnit.value,
        weight: weight,
      };
    }

    axios
      .put(
        Config.getCommonUrl() +
          "retailerProduct/api/stockname/" +
          dataToBeEdited.stock_name_code.id,
        data
      )
      .then(function (response) {
        if (response.data.success === true) {
          setStockCode("");
          setSelectedStockDesc("");
          setPurity("");
          setSelectedGoldColor("");
          setSelectedStoneColor("");
          setSelectedStoneShape("");
          setSelectedUnit("");
          setSelectedStoneSize("");
          setWeight("");
          handleClose();
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
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
          api: "retailerProduct/api/stockname/" + dataToBeEdited.stock_name_code.id,
          body: data,
        });
      });
  }

  function stockNameValidation() {
    if (selectedStockNm === "") {
      setStockNameErrTxt("Please Select Stock Name To Be Updated!");
      return false;
    }
    return true;
  }

  function stockCodeValidation() {
    // var Regex = /^[a-zA-Z0-9 ]+$/; Regex.test(stockCode) === false
    if (!stockCode || stockCode.trim() === "") {
      setStockCodeErrTxt("Enter Valid Stock Code");
      return false;
    }
    return true;
  }

  function stockNameDescValidation() {
    // var Regex = /^[a-zA-Z0-9 ]+$/; Regex.test(stockNmDesc) === false
    if (selectedStockDesc === "") {
      setstkNmdescErrTxt("Select Valid Stock Name Description");
      return false;
    }
    return true;
  }

  function purityValidation() {
    var Regex = /^100(\.[0]{1,2})?|([0-9]|[1-9][0-9])(\.[0-9]{1,2})?$/; ///^[a-zA-Z0-9 ]+$/; ///[1-9][0-9]*(?:\/[1-9][0-9])*/g;
    if (!purity || Regex.test(purity) === false) {
      setPurityErrTxt("Please Enter Valid Purity");

      return false;
    }
    return true;
  }

  function goldColorValidation() {
    if (selectedGoldColor === "") {
      setGoldColorErrTxt("Please Select Gold Color!");
      return false;
    }
    return true;
  }

  function colorValidation() {
    if (selectedStoneColor === "") {
      setStoneColorErrTxt("Please Select Stone Color!");
      return false;
    }
    return true;
  }

  function shapeValidation() {
    if (selectedStoneShape === "") {
      setStoneShapeErrTxt("Please Select Stone Shape!");
      return false;
    }
    return true;
  }

  function sizeValidation() {
    if (selectedStoneSize === "") {
      setStoneSizeErrTxt("Please Select Stone Size!");
      return false;
    }
    return true;
  }

  function weightValidation() {
    var Regex = /^[0-9]{1,11}(?:\.[0-9]{1,6})?$/;
    if (!weight || Regex.test(weight) === false) {
      setWeightErrTxt("Please Enter Valid Stone Weight");
      return false;
    }
    return true;
  }

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
      setGstNumErrTxt("Please Select Valid HSN Number");
      return false;
    }
    return true;
  }
  function UnitValidation() {
    if (selectedUnit === "") {
      setUnitErrTxt("Please Unit!");
      return false;
    }
    return true;
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

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

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
          <h5 className="popup-head p-20">
            Edit Stock
            <IconButton
              style={{ position: "absolute", top: "8px", right: "8px" }}
              onClick={handleClose}
            >
              <img src={Icones.cross} alt="" />
            </IconButton>
          </h5>
          <div className="pl-32 pr-32 pb-10 pt-10 h-360 overflow-y-scroll">
            <p className="popup-labl pb-4 pt-12 ">Stock Group</p>
            <Select
              filterOption={createFilter({ ignoreAccents: false })}
              classes={classes}
              styles={selectStyles}
              options={stockGroupData.map((suggestion) => ({
                value: suggestion.id,
                label: suggestion.group_name,
              }))}
              // components={components}
              value={stockGroupSelected}
              onChange={handleChangeStockGroup}
              placeholder="Stock Group"
              isDisabled
            />

            <span style={{ color: "red" }}>
              {stockGroupErrTxt.length > 0 ? stockGroupErrTxt : ""}
            </span>

            <p className="popup-labl pb-4 pt-12 ">Stock Name</p>
            <Select
              filterOption={createFilter({ ignoreAccents: false })}
              classes={classes}
              styles={selectStyles}
              options={stockNameData.map((suggestion) => ({
                value: suggestion.id,
                label: suggestion.stock_name,
              }))}
              // components={components}
              value={selectedStockNm}
              onChange={handleChangeStockType}
              placeholder="Stock Name"
              isDisabled
            />
            <span style={{ color: "red" }}>
              {stockNameErrTxt.length > 0 ? stockNameErrTxt : ""}
            </span>

            <p className="popup-labl pb-4 pt-12 ">billStockNm</p>
            <TextField
              placeholder="Billing Stock Name"
              name="billStockNm"
              value={billStkNm}
              error={billStkNmErrTxt.length > 0 ? true : false}
              helperText={billStkNmErrTxt}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              fullWidth
            />

            <p className="popup-labl pb-4 pt-12 ">HSN</p>
            <Select
              filterOption={createFilter({ ignoreAccents: false })}
              classes={classes}
              styles={selectStyles}
              options={HSNMasterData.map((suggestion) => ({
                value: suggestion.id,
                label: suggestion.hsn_number,
              }))}
              // components={components}
              value={hsnSelected}
              onChange={handleChangeHsnNum}
              placeholder="HSN"
            />

            <span style={{ color: "red" }}>
              {HSNMasterErrTxt.length > 0 ? HSNMasterErrTxt : ""}
            </span>

            <p className="popup-labl pb-4 pt-12 ">GST</p>
            <TextField
              placeholder="GST"
              name="gstNum"
              value={GSTNumber}
              error={GstNumErrTxt.length > 0 ? true : false}
              helperText={GstNumErrTxt}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              fullWidth
              disabled
            />

            <p className="popup-labl pb-4 pt-12 ">Stock Code</p>
            <TextField
              placeholder="Stock Code"
              name="stockCode"
              value={stockCode}
              error={stockCodeErrTxt.length > 0 ? true : false}
              helperText={stockCodeErrTxt}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              fullWidth
            />

            {/* <TextField
              className="mt-16"
              label="Stock Name Description"
              name="stockNmDesc"
              value={stockNmDesc}
              error={stkNmdescErrTxt.length > 0 ? true : false}
              helperText={stkNmdescErrTxt}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              fullWidth
            /> */}

            <p className="popup-labl pb-4 pt-12 ">Stock Name Description</p>
            <Select
              filterOption={createFilter({ ignoreAccents: false })}
              className="mb-6 input-select-bdr-dv"
              classes={classes}
              styles={selectStyles}
              options={stockNmDescData.map((suggestion) => ({
                value: suggestion.id,
                label: suggestion.description,
              }))}
              // components={components}
              value={selectedStockDesc}
              onChange={handleStockDescChange}
              placeholder="Stock Name Description"
            />

            <span style={{ color: "red" }}>
              {stkNmdescErrTxt.length > 0 ? stkNmdescErrTxt : ""}
            </span>

            {StockType === 1 && (
              <div>
                <p className="popup-labl pb-4 pt-12 ">Purity</p>
                <TextField
                  className="mb-6"
                  placeholder="Purity"
                  name="purity"
                  value={purity}
                  error={purityErrTxt.length > 0 ? true : false}
                  helperText={purityErrTxt}
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  fullWidth
                />

                <p className="popup-labl pb-4 pt-12 ">Gold Color</p>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  className="mb-6"
                  classes={classes}
                  styles={selectStyles}
                  options={goldColorData.map((suggestion) => ({
                    value: suggestion.id,
                    label: suggestion.name,
                  }))}
                  // components={components}
                  value={selectedGoldColor}
                  onChange={handleChangeGoldColor}
                  placeholder="Gold Color"
                />

                <span style={{ color: "red" }}>
                  {goldColorErrTxt.length > 0 ? goldColorErrTxt : ""}
                </span>
              </div>
            )}

            {StockType === 2 && (
              <div>
                <p className="popup-labl pb-4 pt-12 ">Color</p>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  className="mb-6"
                  classes={classes}
                  styles={selectStyles}
                  options={stoneColorData.map((suggestion) => ({
                    value: suggestion.id,
                    label: suggestion.name,
                  }))}
                  // components={components}
                  value={selectedStoneColor}
                  onChange={handleChangeStoneColor}
                  placeholder="Color"
                />
                <span style={{ color: "red" }}>
                  {stoneColorErrTxt.length > 0 ? stoneColorErrTxt : ""}
                </span>

                <p className="popup-labl pb-4 pt-12 ">Shape</p>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  className="mb-6"
                  classes={classes}
                  styles={selectStyles}
                  options={stoneShapeData.map((suggestion) => ({
                    value: suggestion.id,
                    label: suggestion.name,
                  }))}
                  // components={components}
                  value={selectedStoneShape}
                  onChange={handleChangeStoneShape}
                  placeholder="Shape"
                />
                <span style={{ color: "red" }}>
                  {stoneShapeErrTxt.length > 0 ? stoneShapeErrTxt : ""}
                </span>

                <p className="popup-labl pb-4 pt-12 ">Size</p>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  className="mb-6"
                  classes={classes}
                  styles={selectStyles}
                  options={stoneSizeData.map((suggestion) => ({
                    value: suggestion.id,
                    label: suggestion.size,
                  }))}
                  // components={components}
                  value={selectedStoneSize}
                  onChange={handleChangeStoneSize}
                  placeholder="Size"
                />
                <span style={{ color: "red" }}>
                  {stoneSizeErrTxt.length > 0 ? stoneSizeErrTxt : ""}
                </span>

                <p className="popup-labl pb-4 pt-12 ">Unit</p>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  className="mb-6 input-select-bdr-dv"
                  classes={classes}
                  styles={selectStyles}
                  options={unitData.map((suggestion) => ({
                    value: suggestion.id,
                    label: suggestion.unit_name,
                  }))}
                  // components={components}
                  value={selectedUnit}
                  onChange={handleChangeUnit}
                  placeholder="Unit"
                />
                <span style={{ color: "red" }}>
                  {unitErrTxt.length > 0 ? unitErrTxt : ""}
                </span>

                <p className="popup-labl pb-4 pt-12 ">Weight</p>
                <TextField
                  className="mb-6"
                  placeholder="Weight"
                  name="weight"
                  value={weight}
                  error={weightErrTxt.length > 0 ? true : false}
                  helperText={weightErrTxt}
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  fullWidth
                />
              </div>
            )}

            {finding === 14 || finding === 15 ? (
              <div>
                <p className="popup-labl pb-4 pt-12 ">Weight</p>
                <TextField
                  className="mb-6 input-select-bdr-dv"
                  placeholder="Weight"
                  name="weight"
                  value={weight}
                  error={weightErrTxt.length > 0 ? true : false}
                  helperText={weightErrTxt}
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  fullWidth
                />
              </div>
            ) : (
              ""
            )}

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
              variant="contained"
              color="primary"
              className="w-full mx-auto mt-16"
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

export default EditStockCode;

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
import { matchSorter } from "match-sorter";
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

const CreateStockCode = (props) => {
  const [open, setOpen] = React.useState(true);

  const dispatch = useDispatch();

  const [modalStyle] = React.useState(getModalStyle);

  const [stockNameData, setStockNameData] = useState([]);
  const [selectedStockNm, setSelectedStockNmn] = useState("");
  const [stockNameErrTxt, setStockNameErrTxt] = useState("");

  const theme = useTheme();
  const [stockCode, setStockCode] = useState("");
  const [stockCodeErrTxt, setStockCodeErrTxt] = useState("");

  const [selectedStockDesc, setSelectedStockDesc] = useState("");
  const [stockNmDescData, setStockNmDescData] = useState([]);
  const [stkNmdescErrTxt, setstkNmdescErrTxt] = useState("");

  const [purity, setPurity] = useState("");
  const [purityErrTxt, setPurityErrTxt] = useState("");

  const [goldColorData, setGoldColorData] = useState([]);
  const [selectedGoldColor, setSelectedGoldColor] = useState("");
  const [goldColorErrTxt, setGoldColorErrTxt] = useState("");

  const [stoneColorData, setStoneColorData] = useState([]);
  const [selectedStoneColor, setSelectedStoneColor] = useState("");
  const [stoneColorErrTxt, setStoneColorErrTxt] = useState("");

  const [stoneShapeData, setStoneShapeData] = useState([]);
  const [selectedStoneShape, setSelectedStoneShape] = useState("");
  const [stoneShapeErrTxt, setStoneShapeErrTxt] = useState("");

  const [constStoneSizeData, setConstStoneSizeData] = useState([]);
  const [stoneSizeData, setStoneSizeData] = useState([]);
  const [selectedStoneSize, setSelectedStoneSize] = useState("");
  const [stoneSizeErrTxt, setStoneSizeErrTxt] = useState("");

  const [unitData, setUnitData] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [unitErrTxt, setUnitErrTxt] = useState("");

  const [finding, setFinding] = useState("");

  // const [Size, setSize] = useState("");
  // const [sizeErrTxt, setSizeErrTxt] = useState("");

  const [weight, setWeight] = useState("");
  const [weightErrTxt, setWeightErrTxt] = useState("");

  const [StockType, setStockType] = useState(""); //to check and show conditional inputs based on stock group
  // stock_type 1 means gold and 2 means metal
  const classes = useStyles();

  useEffect(() => {
    getStockName();
    getGoldColor();
    getStoneColor();
    getStoneShape();
    getUnitData();
    getStoneSize();

    //eslint-disable-next-line
  }, [dispatch]);

  function getStockName() {
    //only records will comes which data is not set like stock_code, description etc
    axios
      .get(Config.getCommonUrl() + "api/stockname?pending_stock_code=1")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockNameData(response.data.data);
          // setData(response.data);
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
          api: "api/stockname?pending_stock_code=1",
        });
      });
  }

  function getGoldColor() {
    axios
      .get(Config.getCommonUrl() + "api/goldcolor")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setGoldColorData(response.data.data);
          // setData(response.data);
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
        handleError(error, dispatch, { api: "api/goldcolor" });
      });
  }

  function getStoneColor() {
    axios
      .get(Config.getCommonUrl() + "api/stonecolor")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStoneColorData(response.data.data);
          // setData(response.data);
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
        handleError(error, dispatch, { api: "api/stonecolor" });
      });
  }

  function getStoneShape() {
    axios
      .get(Config.getCommonUrl() + "api/stoneshape")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStoneShapeData(response.data.data);
          // setData(response.data);
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
        handleError(error, dispatch, { api: "api/stoneshape" });
      });
  }
  function getUnitData() {
    axios
      .get(Config.getCommonUrl() + "api/unitofmeasurement")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setUnitData(response.data.data);
          // setData(response.data);
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
        handleError(error, dispatch, { api: "api/unitofmeasurement" });
      });
  }

  function getStoneSize() {
    axios
      .get(Config.getCommonUrl() + "api/stonesize")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStoneSizeData(response.data.data);
          setConstStoneSizeData(response.data.data);
          // setData(response.data);
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
        handleError(error, dispatch, { api: "api/stonesize" });
      });
  }

  function handleChangeStockType(value) {
    setSelectedStockNmn(value);
    setStockNameErrTxt("");
    setFinding(value.value);
    let id = value.value;
    const Index = stockNameData.findIndex((a) => a.id === id);
    if (Index > -1) {
      setStockType(stockNameData[Index].stock_type);
      getStockDescData(value.value);
    }
  }

  function handleStockDescChange(value) {
    setSelectedStockDesc(value);
    setstkNmdescErrTxt("");
  }

  function getStockDescData(stockNmId) {
    axios
      .get(Config.getCommonUrl() + `api/stockdescription/${stockNmId}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockNmDescData(response.data.data);
          // setData(response.data);
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
          api: `api/stockdescription/${stockNmId}`,
        });
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

  const handleClose = () => {
    setOpen(false);
    props.modalColsed(); //closing from here so we can change the view to first one
  };

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "stockCode") {
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
      stockNameValidation() &&
      stockNameDescValidation() &&
      stockCodeValidation()
    ) {
      if (StockType === 1) {
        //gold
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
          weightValidation() &&
          UnitValidation()
        ) {
          upadteStockNameDetails();
        }
      } else if (StockType === 3) {
        //Consumable
        upadteStockNameDetails();
      } else {
        upadteStockNameDetails();
      }
    }
  };

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
  function UnitValidation() {
    if (selectedUnit === "") {
      setUnitErrTxt("Please Unit!");
      return false;
    }
    return true;
  }

  function weightValidation() {
    var Regex = /^[0-9]{1,11}(?:\.[0-9]{1,6})?$/; // /[1-9][0-9]*(?:\/[1-9][0-9])*/g;
    if (!weight || Regex.test(weight) === false) {
      setWeightErrTxt("Please Enter Valid Stone Weight");
      return false;
    }
    return true;
  }

  function upadteStockNameDetails() {
    let data;
    if (StockType === 1) {
      if (finding === 14 || finding === 15) {
        data = {
          stock_name_id: selectedStockNm.value,
          stock_code: stockCode,
          stock_description_id: selectedStockDesc.value,
          purity: purity,
          gold_color_id: selectedGoldColor.value,
          weight: weight,
        };
      } else {
        data = {
          stock_name_id: selectedStockNm.value,
          stock_code: stockCode,
          stock_description_id: selectedStockDesc.value,
          purity: purity,
          gold_color_id: selectedGoldColor.value,
        };
      }
    } else if (StockType === 2) {
      data = {
        stock_name_id: selectedStockNm.value,
        stock_code: stockCode,
        stock_description_id: selectedStockDesc.value,
        stone_color_id: selectedStoneColor.value,
        stone_size_id: selectedStoneSize.value,
        stone_shape_id: selectedStoneShape.value,
        unit_id: selectedUnit.value,
        weight: weight,
      };
    } else if (StockType === 3) {
      data = {
        stock_name_id: selectedStockNm.value,
        stock_code: stockCode,
        stock_description_id: selectedStockDesc.value,
      };
    } else {
      data = {
        stock_name_id: selectedStockNm.value,
        stock_code: stockCode,
        stock_description_id: selectedStockDesc.value,
      };
    }

    axios
      .post(Config.getCommonUrl() + "api/stockname/stockcode", data)
      .then(function (response) {
        console.log(response);
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
          api: "api/stockname/stockcode",
          body: data,
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
          <h5 className="popup-head" style={{padding: "16px"}}>
            Create Stock Code
            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={handleClose}
            >
              <Icon>
                <img src={Icones.cross} alt="" />
              </Icon>
            </IconButton>
          </h5>
          <div className="overflow-y-scroll" style={{padding: "30px", maxHeight: "calc(100vh - 150px)"}}>
            <p className="popup-labl" style={{paddingLeft: "15px", marginBottom: "10px"}}>Stock name</p>
            <Select
              filterOption={createFilter({ ignoreAccents: false })}
              className="input-select-bdr-dv"
              styles={selectStyles}
              options={stockNameData.map((suggestion) => ({
                value: suggestion.id,
                label: suggestion.stock_name,
              }))}
              // components={components}
              value={selectedStockNm}
              onChange={handleChangeStockType}
              placeholder="Enter stock name"
            />

            <span style={{ color: "red" }}>
              {stockNameErrTxt.length > 0 ? stockNameErrTxt : ""}
            </span>
            <p className="popup-labl" style={{paddingLeft: "15px", marginBottom: "10px", marginTop: "30px"}}>Stock name description</p>
            <Select
              filterOption={createFilter({ ignoreAccents: false })}
              className="input-select-bdr-dv"
              styles={selectStyles}
              options={stockNmDescData.map((suggestion) => ({
                value: suggestion.id,
                label: suggestion.description,
              }))}
              // components={components}
              value={selectedStockDesc}
              onChange={handleStockDescChange}
              placeholder=" Enter stock name description"
            />

            <span style={{ color: "red" }}>
              {stkNmdescErrTxt.length > 0 ? stkNmdescErrTxt : ""}
            </span>
            <p className="popup-labl" style={{paddingLeft: "15px", marginBottom: "10px", marginTop: "30px"}}>Stock code</p>
            <TextField
              className="input-select-bdr-dv"
              placeholder=" Enter stock code"
              name="stockCode"
              value={stockCode}
              error={stockCodeErrTxt.length > 0 ? true : false}
              helperText={stockCodeErrTxt}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              fullWidth
            />

            {/* <TextField
              className="mt-4 input-select-bdr-dv"
              placeholder="Stock Name Description"
              name="stockNmDesc"
              value={stockNmDesc}
              error={stkNmdescErrTxt.length > 0 ? true : false}
              helperText={stkNmdescErrTxt}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              fullWidth
            /> */}

            {StockType === 1 && (
              <div>
                <p className="popup-labl" style={{marginTop: "30px"}}>Purity</p>
                <TextField
                  className="input-select-bdr-dv"
                  placeholder=" Enter Purity"
                  name="purity"
                  value={purity}
                  error={purityErrTxt.length > 0 ? true : false}
                  helperText={purityErrTxt}
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  fullWidth
                />
                <p className="popup-labl" style={{marginTop: "30px"}}>Gold Color</p>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  className="input-select-bdr-dv"
                  styles={selectStyles}
                  options={goldColorData.map((suggestion) => ({
                    value: suggestion.id,
                    label: suggestion.name,
                  }))}
                  // components={components}
                  value={selectedGoldColor}
                  onChange={handleChangeGoldColor}
                  placeholder=" Enter Gold Color"
                />

                <span style={{ color: "red" }}>
                  {goldColorErrTxt.length > 0 ? goldColorErrTxt : ""}
                </span>
              </div>
            )}

            {StockType === 2 && (
              <div>
                <p className="popup-labl mt-16 ">Stone Color</p>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  className="mt-4 input-select-bdr-dv"
                  styles={selectStyles}
                  options={stoneColorData.map((suggestion) => ({
                    value: suggestion.id,
                    label: suggestion.name,
                  }))}
                  // components={components}
                  value={selectedStoneColor}
                  onChange={handleChangeStoneColor}
                  placeholder=" Enter Color"
                />
                <span style={{ color: "red" }}>
                  {stoneColorErrTxt.length > 0 ? stoneColorErrTxt : ""}
                </span>
                <p className="popup-labl mt-16 ">Stone Shape</p>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  className="mt-4 input-select-bdr-dv"
                  styles={selectStyles}
                  options={stoneShapeData.map((suggestion) => ({
                    value: suggestion.id,
                    label: suggestion.name,
                  }))}
                  // components={components}
                  value={selectedStoneShape}
                  onChange={handleChangeStoneShape}
                  placeholder="Enter Shape"
                />
                <span style={{ color: "red" }}>
                  {stoneShapeErrTxt.length > 0 ? stoneShapeErrTxt : ""}
                </span>
                <p className="popup-labl mt-16 ">Stone Size</p>
                <Select
                  filterOption={createFilter({
                    ignoreAccents: false,
                  })}
                  className="mt-4 input-select-bdr-dv"
                  styles={selectStyles}
                  options={stoneSizeData.map((suggestion) => ({
                    value: suggestion.id,
                    label: suggestion.size,
                  }))}
                  onInputChange={(inputValue) => {
                    setStoneSizeData(
                      matchSorter(constStoneSizeData, inputValue, {
                        keys: ["size"],
                      })
                    );
                  }}
                  value={selectedStoneSize}
                  onChange={handleChangeStoneSize}
                  placeholder="Enter Size"
                />
                <span style={{ color: "red" }}>
                  {stoneSizeErrTxt.length > 0 ? stoneSizeErrTxt : ""}
                </span>
                <p className="popup-labl mt-16 ">Unit</p>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  className="mt-4 input-select-bdr-dv"
                  styles={selectStyles}
                  options={unitData.map((suggestion) => ({
                    value: suggestion.id,
                    label: suggestion.unit_name,
                  }))}
                  // components={components}
                  value={selectedUnit}
                  onChange={handleChangeUnit}
                  placeholder="Enter Unit"
                />
                <span style={{ color: "red" }}>
                  {unitErrTxt.length > 0 ? unitErrTxt : ""}
                </span>
                <p className="popup-labl mt-16 ">Weight</p>
                <TextField
                  className="mt-4 input-select-bdr-dv"
                  placeholder=" Enter Weight"
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
                <p className="popup-labl mt-16 ">Purity</p>
                <TextField
                  className="mt-4 input-select-bdr-dv"
                  placeholder="Enter Weight"
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

export default CreateStockCode;

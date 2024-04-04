import { FuseAnimate } from "@fuse";
import History from "@history";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import ReactDOM from "react-dom";
import { makeStyles } from "@material-ui/styles";
import Config from "app/fuse-configs/Config";
// import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import { useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Select, { createFilter } from "react-select";
import { Icon, IconButton } from "@material-ui/core";
import { filter } from "lodash";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
import { useReactToPrint } from "react-to-print";
import IssueToWorkerPrint from "../../ProductionComp/IssueToWorkerPrint/IssueToWorkerPrint";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Icones from "assets/fornt-icons/Mainicons";
import { HtmlPrintAddApi } from "app/main/apps/Production/ProductionMain/Helper/HtmlPrintAdd";
import DesignZoomModal from "../../ProductionComp/DesignZoomModal/DesignZoomModal";

const useStyles = makeStyles((theme) => ({
  root: {},
  bredcrumbTitle: {
    fontWeight: "700",
    fontSize: "18px",
    marginBottom: 12,
    paddingLeft: 16,
  },
  modalContainer: {
    paddingBlock: "20px",
    background: "rgba(0,0,0,0)",
    justifyContent: "space-between",
  },
  // model: {
  //   position: "absolute",
  //   background: "#FFFFFF",
  //   top: "65px",
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   opacity: 1,
  //   zIndex: 1,
  // },
  addBtn: {
    display: "block",
    borderRadius: "8px",
    background: "#1E65FD",
    minWidth: "40px",
  },
  addStockTableContainer: {
    fontSize: 14,
    minWidth: 900,
  },
  addTableHead: {
    fontSize: 12,
    lineHeight: 1.5,
    padding: 10,
  },
  scroll: {
    overflowX: "initial",
  },
  disabledInput: {
    "& input:disabled": {
      color: "inherit",
    },
  },
  tablePad: {
    padding: 0,
  },
  tableRowPad: {
    padding: 7,
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
  errorMessage: {
    color: "#f44336",
    position: "absolute",
    bottom: "1px",
    fontSize: "9px",
    lineHeight: "8px",
  },
}));

const AddToLot = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [apiDataArray, setApiDataArray] = useState("");
  const [stockCodeList, setStockCodeList] = useState([]);
  const [settingTypeList, setSettingTypeList] = useState([]);
  const [printObj, setPrintObj] = useState([]);
  const [lotNumber, setLotNumber] = useState("");
  const [selectedLotNumber, setSelectedLotNumber] = useState("");
  const [lotApiData, setLotApiData] = useState([]);
  const [goldVariantList, setGoldVariantList] = useState([]);
  const [addMetalData, setAddMetalData] = useState([
    {
      lotNo: "",
      stockCode: "",
      purity: "",
      pcs: "",
      weight: "",
      errors: {},
    },
  ]);
  const [addStockData, setAddStockData] = useState([
    {
      lotNo: "",
      batchNo: "",
      stockCode: "",
      settingType: "",
      purity: "",
      pcs: "",
      weight: "",
      remark: "",
      LotDesigns: [],
      is_batch: "",
      errors: {},
    },
  ]);
  const [workstationId, setWorkStationId] = useState("");
  const [processId, setProcessId] = useState("");
  const [workstationData, setWorkstationData] = useState("");
  const [processData, setProcessData] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [lotDesignList, setLotDesignList] = useState([]);
  const [selectedlotId, setSelectedlotId] = useState("");
  const [transferredRows, setTransferredRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [designLotSearchData, setDesignLotSearchData] = useState("");
  const [selectedLotSearchData, setSelectedLotSearchData] = useState("");
  const department_id = window.localStorage.getItem("SelectedDepartment");

  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
    //eslint-disable-next-line
  }, [componentRef.current]);

  function getDateAndTime() {
    return (
      new Date().getDate() +
      "_" +
      (new Date().getMonth() + 1) +
      "_" +
      new Date().getFullYear() +
      "_" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes()
    );
  }

  const handleBeforePrint = React.useCallback(() => {}, []);
  const handleOnBeforeGetContent = React.useCallback(() => {
    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;
      setTimeout(() => {
        // setLoading(false);
        // setText("New, Updated Text!");
        resolve();
      }, 10);
    });
  }, []); //setText

  const handleAfterPrint = () => {
    // Create a new instance of the component
    const componentInstance = (
      <IssueToWorkerPrint
        ref={componentRef}
        printObj={printObj}
        from="Add To Lot For"
      />
    );

    // Create a container div element
    const containerDiv = document.createElement("div");

    // Append the component to the container div
    ReactDOM.render(componentInstance, containerDiv);

    // Access the HTML content of the container div
    const printedContent = containerDiv.innerHTML;

    // Log or use the printed content as needed
    console.log("Printed HTML content:", printedContent);
    HtmlPrintAddApi(dispatch, printedContent, printObj);

    // Clean up: Unmount the component and remove the container div
    ReactDOM.unmountComponentAtNode(containerDiv);
    containerDiv.remove();
    History.goBack();
  };

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Add_to_Lot_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });

  useEffect(() => {
    if (printObj.length > 0) {
      handlePrint();
    }
  }, [printObj]);

  useEffect(() => {
    clearData(false);
  }, [department_id]);

  useEffect(() => {
    if (selectedLotNumber) {
      getAddToLotListing();
    }
  }, [selectedLotNumber]);

  function getAddToLotListing() {
    const body = {
      number: selectedLotNumber,
      department_id: department_id,
    };
    Axios.post(Config.getCommonUrl() + `api/production/lot/number/addlot`, body)
      .then(function (response) {
        if (response.data.success) {
          console.log(response.data.data);
          setApiDataArray(response.data.data);
          getGoldVariantStock(response.data.data.purity);
        } else {
          setApiDataArray("");
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
          api: `api/production/lot/number/addlot`,
        });
      });
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (lotNumber) {
        getProductData(lotNumber);
      } else {
        setLotApiData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [lotNumber]);

  function getGoldVariantStock(purity) {
    const api = `api/production/addlot/purityWise/metalStock?department_id=${department_id}&purity=${purity}`;
    Axios.get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success) {
          setGoldVariantList(response.data.data);
        } else {
          setGoldVariantList([]);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: api,
        });
      });
  }

  function getProductData(sData) {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/lot/number/searching?department_id=${department_id}&number=${sData}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let responseData = response.data.data;
          if (responseData.length > 0) {
            console.log(response.data.data);
            setLotApiData(response.data.data);
          } else {
            setLotApiData([]);
          }
        } else {
          setLotApiData([]);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/production/lot/number/searching?department_id=${department_id}&number=${sData}`,
        });
      });
  }

  function getSettingTypeId(batchNo, stockId, i) {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/addlot/settingtype/list?batch_no=${batchNo}&stock_code_id=${stockId}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let responseData = response.data.data;
          setSettingTypeList(responseData);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/production/addlot/settingtype/list?batch_no=${batchNo}&stock_code_id=${stockId}`,
        });
      });
  }

  function getStockCode(batchNum) {
    const api = `api/production/stone/batchwise?department_id=${department_id}&batch_no=${batchNum}`;
    Axios.get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockCodeList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: api,
        });
      });
  }

  function clearData(fromSave) {
    if (!fromSave) {
      setLotNumber("");
      setSelectedLotNumber("");
    }
    setLotApiData([]);
    setApiDataArray("");
    setGoldVariantList([]);
    setStockCodeList([]);
    setAddStockData([
      {
        lotNo: "",
        batchNo: "",
        stockCode: "",
        settingType: "",
        purity: "",
        pcs: "",
        weight: "",
        remark: "",
        LotDesigns: [],
        is_batch: "",
        errors: {},
      },
    ]);
    setProcessData("");
    setAddMetalData([
      {
        lotNo: "",
        stockCode: "",
        purity: "",
        pcs: "",
        weight: "",
        errors: {},
      },
    ]);
    setWorkstationData("");
    setProcessId("");
    setWorkStationId("");
    setLotDesignList([]);
    setTransferredRows([]);
    setIsEdit(false);
  }

  let handleLotSelect = (value) => {
    let filteredArray = lotApiData.filter((item) => item.number === value);
    if (filteredArray.length > 0) {
      setSelectedLotNumber(value);
    }
  };

  function handleLotOptionSelect(option, i) {
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData[i].lotNo = option;
    addStockUpdatedData[i].LotDesigns = option.data.LotDesigns;
    addStockUpdatedData[i].is_batch = 0;
    addStockUpdatedData[i].purity = option.data.purity;
    setAddStockData(addStockUpdatedData);

    if (!addStockData[i + 1]) {
      setAddStockData([
        ...addStockData,
        {
          lotNo: "",
          batchNo: "",
          stockCode: "",
          settingType: "",
          purity: "",
          pcs: "",
          weight: "",
          remark: "",
          LotDesigns: [],
          is_batch: "",
          errors: {},
        },
      ]);
    }
  }

  function handleBatchOptionSelect(option, i) {
    console.log(option);
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData[i].batchNo = {
      value: option.value,
      label: option.label,
    };
    addStockUpdatedData[i].errors.batchNo = "";
    addStockUpdatedData[i].is_batch = 1;
    setAddStockData(addStockUpdatedData);
    getStockCode(option.label);
  }

  function handleStockCodeSelect(option, i, data) {
    console.log(option);
    console.log(data);
    const addStockUpdatedData = [...addStockData];
    let isStockCodeAvailable = addStockUpdatedData.some(
      (item) => item.stockCode && item.stockCode.value === option.value
    );
    if (!isStockCodeAvailable) {
      addStockUpdatedData[i].stockCode = option;
      addStockUpdatedData[i].settingType = "";
      addStockUpdatedData[i].errors.stockCode = "";
      addStockUpdatedData[i].pcs = "";
      addStockUpdatedData[i].weight = "";
      setAddStockData(addStockUpdatedData);
      getSettingTypeId(data.batchNo.label, option.value, i);
    } else {
      dispatch(
        Actions.showMessage({
          message: "This stock code alredy added",
        })
      );
    }
  }

  function handleSettingTypeSelect(option, i, data) {
    console.log(option);
    console.log(data);
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData[i].settingType = option;
    addStockUpdatedData[i].errors.settingType = "";
    setAddStockData(addStockUpdatedData);
  }

  const handleChangeMetal = (e, i) => {
    const { name, value } = e.target;
    if ((name === "weight" || name === "pcs") && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    const addMetalStock = [...addMetalData];
    addMetalStock[i][name] = value;
    addMetalStock[i].errors[name] = "";
    setAddMetalData(addMetalStock);
  };

  let handleChange = (e, i) => {
    const { name, value } = e.target;
    if ((name === "weight" || name === "pcs") && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData[i][name] = value;
    addStockUpdatedData[i].errors[name] = "";
    if (name === "pcs") {
      const pcsVal = value ? value : 0;
      const calculateWgt =
        parseFloat(addStockUpdatedData[i].stockCode?.data?.single_stone_wgt) *
        parseFloat(pcsVal);
      addStockUpdatedData[i].weight = parseFloat(calculateWgt).toFixed(4);
    }
    setAddStockData(addStockUpdatedData);
  };

  function handleSubmitAddStock() {
    const finalArrmetal = [];
    addMetalData.map((item) => {
      if (item.lotNo) {
        finalArrmetal.push({
          stock_name_code_id: item.stockCode.value,
          added_weight: item.weight,
          purity: item.purity,
          pcs: item.pcs,
        });
      }
    });
    const finalArrstock = [];
    addStockData.map((item) => {
      if (item.lotNo) {
        finalArrstock.push({
          stock_name_code_id: item.stockCode.value,
          added_weight: item.weight,
          pcs: item.pcs,
          batch_number: item.batchNo.label,
          type_of_setting_id: item.settingType.value,
        });
      }
    });
    const body = {
      department_id: department_id,
      process_id: apiDataArray?.ProcessDetails?.id,
      workstation_id: apiDataArray?.WorkStationDetails?.id,
      lot_id: apiDataArray.id,
      MetalArray: finalArrmetal,
      stockArray: finalArrstock,
    };
    console.log(body);
    Axios.post(Config.getCommonUrl() + `api/production/add`, body)
      .then(function (response) {
        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setPrintObj([response.data.data]);
          clearData(true);
          getAddToLotListing();
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
          api: `api/production/add`,
          body: body,
        });
      });
  }

  const handleLotOptionMetalSelect = (val, i) => {
    const addMetalStock = [...addMetalData];
    addMetalStock[i].lotNo = val;
    addMetalStock[i].errors.lotNo = "";
    setAddMetalData(addMetalStock);
  };

  const handleMetalCodeSelect = (option, i) => {
    const addMetalStock = [...addMetalData];

    let isStockCodeAvailable = addMetalStock.some(
      (item) => item.stockCode && item.stockCode.value === option.value
    );
    if (!isStockCodeAvailable) {
      addMetalStock[i].stockCode = option;
      addMetalStock[i].errors.stockCode = "";
      addMetalStock[i].purity = option.purity;
      setAddMetalData(addMetalStock);
    } else {
      dispatch(
        Actions.showMessage({
          message: "This stock code alredy added",
        })
      );
    }
    if (!addMetalStock[i + 1]) {
      addNewMetalRow();
    }
  };

  function addNewMetalRow() {
    setAddMetalData([
      ...addMetalData,
      {
        lotNo: "",
        stockCode: "",
        purity: "",
        pcs: "",
        weight: "",
        errors: {},
      },
    ]);
  }

  function deleteLotHandler(index) {
    const arrData = [...addStockData];
    if (!arrData[index + 1]) {
      setAddStockData([
        {
          lotNo: "",
          batchNo: "",
          stockCode: "",
          settingType: "",
          purity: "",
          pcs: "",
          weight: "",
          remark: "",
          LotDesigns: [],
          is_batch: "",
          errors: {},
        },
      ]);
    } else {
      const remainingArr = arrData.filter((item, i) => i !== index);
      setAddStockData(remainingArr);
    }
  }

  const deleteMetalHandler = (index) => {
    const arrData = [...addMetalData];
    if (!arrData[index + 1]) {
      setAddMetalData([
        {
          lotNo: "",
          stockCode: "",
          purity: "",
          pcs: "",
          weight: "",
          errors: {},
        },
      ]);
    } else {
      const remainingArr = arrData.filter((item, i) => i !== index);
      setAddMetalData(remainingArr);
    }
  };

  function getItemOfLot(data) {
    setLotDesignList(data.LotDesigns);
  }

  const handleCheckboxChange = (row) => {
    const selectedIndex = selectedRows.indexOf(row);
    if (selectedIndex === -1) {
      setSelectedRows([...selectedRows, row]);
    } else {
      const updatedSelectedRows = [...selectedRows];
      updatedSelectedRows.splice(selectedIndex, 1);
      setSelectedRows(updatedSelectedRows);
    }
  };
  const handleSearchLoginData = (event) => {
    const { name, value } = event.target;
    if (name === "searchselectedlot") {
      setSelectedLotSearchData(value);
    } else if (name === "searchlotdesign") {
      setDesignLotSearchData(value);
    }
  };

  function validateScanlot() {
    if (apiDataArray === "") {
      dispatch(
        Actions.showMessage({
          message: "Scan lot",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  }

  function validateWorker() {
    if (!apiDataArray?.WorkStationDetails?.name) {
      dispatch(
        Actions.showMessage({
          message: "Scan lot must have worker or work station",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  }

  function validateAddStock() {
    if (addMetalData[0].lotNo === "" && addStockData[0].lotNo === "") {
      dispatch(
        Actions.showMessage({
          message: "Add metal or add any stock",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  }

  function validateMetal() {
    const newFormValues = [...addMetalData];
    const weightRegex = /^(?:\d{1,4}(?:\.\d{1,4})?|\.\d{1,4}|9999(?:\.9999)?)$/;
    let result = false;
    if (newFormValues[0].lotNo) {
      newFormValues.map((item, i) => {
        if (item.lotNo) {
          if (!item.stockCode) {
            newFormValues[i].errors.stockCode = "Select Stock";
          } else if (!item.pcs) {
            newFormValues[i].errors.pcs = "Enter PCS";
          } else if (
            !item.weight ||
            weightRegex.test(item.weight) === false ||
            item.weight == 0
          ) {
            newFormValues[i].errors.weight = "Enter valid Weight";
          } else {
            result = true;
          }
        }
      });
      setAddMetalData(newFormValues);
    } else {
      result = true;
    }
    return result;
  }

  function validateStone() {
    const newFormValues = [...addStockData];
    const weightRegex = /^(?:\d{1,4}(?:\.\d{1,4})?|\.\d{1,4}|9999(?:\.9999)?)$/;
    let result = false;
    if (newFormValues[0].lotNo) {
      newFormValues.map((item, i) => {
        if (item.lotNo) {
          if (!item.batchNo) {
            newFormValues[i].errors.batchNo = "Select Batch Number";
          } else if (!item.stockCode) {
            newFormValues[i].errors.stockCode = "Select Stock";
          } else if (!item.settingType) {
            newFormValues[i].errors.settingType = "Select Setting Type";
          } else if (!item.pcs) {
            newFormValues[i].errors.pcs = "Enter Pcs";
          } else if (
            !item.weight ||
            item.weight == 0 ||
            weightRegex.test(item.weight) === false
          ) {
            newFormValues[i].errors.weight = "Enter valid Weight";
          } else {
            result = true;
          }
        }
      });
      setAddStockData(newFormValues);
    } else {
      result = true;
    }
    return result;
  }

  const addStockValidate = () => {
    if (
      validateScanlot() &&
      validateWorker() &&
      validateAddStock() &&
      validateMetal() &&
      validateStone()
    ) {
      handleSubmitAddStock();
    }
  };

  return (
    <>
      <Box className={classes.model} style={{ overflowY: "auto" }}>
        <Grid container className={classes.modalContainer}>
          <Grid item xs={12} sm={4} md={3} key="1">
            <FuseAnimate delay={300}>
              <Typography className="pl-28 pb-16 pt-16 text-18 font-700">
                Add To Lot
              </Typography>
            </FuseAnimate>
            {/* <BreadcrumbsHelper /> */}
          </Grid>
          <Grid
            item
            sm={8}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 16,
              columnGap: 10,
            }}
          >
            <div className="btn-back mt-2">
              {" "}
              {/* <img src={Icones.arrow_left_pagination} alt="" /> */}
              <Button
                id="btn-back"
                size="small"
                onClick={(event) => {
                  History.goBack();
                }}
              >
                <img
                  className="back_arrow"
                  src={Icones.arrow_left_pagination}
                  alt=""
                />
                Back
              </Button>
            </div>
          </Grid>
        </Grid>
        <div className="main-div-alll ">
          <Box sx={{ paddingInline: 16 }}>
            <Grid container style={{ marginBottom: 16 }}>
              <Grid item className="packing-slip-input">
                <Autocomplete
                  id="free-solo-demos"
                  freeSolo
                  disableClearable
                  onChange={(event, newValue) => {
                    handleLotSelect(newValue);
                  }}
                  onInputChange={(event, newInputValue) => {
                    if (event !== null) {
                      if (event.type === "change") setLotNumber(newInputValue);
                    } else {
                      setLotNumber("");
                    }
                  }}
                  value={selectedLotNumber}
                  options={lotApiData.map((option) => option.number)}
                  fullWidth
                  style={{ width: 200 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search Lot Number"
                      variant="outlined"
                      style={{
                        padding: 0,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Box>
              <TableContainer
                className={classes.scroll}
                style={{ marginBottom: 16 }}
              >
                <Table
                  className={`${classes.table}`}
                  style={{ minWidth: "900px" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell width="150px" className={classes.tableRowPad}>
                        Lot Number
                      </TableCell>
                      <TableCell width="190px" className={classes.tableRowPad}>
                        Lot Category
                      </TableCell>
                      <TableCell width="70px" className={classes.tableRowPad}>
                        Purity
                      </TableCell>
                      <TableCell width="90px" className={classes.tableRowPad}>
                        Lot Pcs
                      </TableCell>
                      <TableCell width="100px" className={classes.tableRowPad}>
                        Stone Pcs
                      </TableCell>
                      <TableCell width="130px" className={classes.tableRowPad}>
                        Gross Weight
                      </TableCell>
                      <TableCell width="130px" className={classes.tableRowPad}>
                        Stone Weight
                      </TableCell>
                      <TableCell width="120px" className={classes.tableRowPad}>
                        Net Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!apiDataArray ? (
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          colSpan={9}
                          align="center"
                        >
                          <div style={{ textAlign: "center" }}>No Data</div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          <span
                            onClick={(e) => getItemOfLot(apiDataArray)}
                            style={{ color: "blue", cursor: "pointer" }}
                          >
                            {apiDataArray?.number}
                          </span>
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray.LotProductCategory?.category_name}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.purity}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.pcs}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.stone_pcs}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.total_gross_wgt}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.total_stone_weight}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.total_net_wgt}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Grid container spacing={2}>
              <Grid item md={12} lg={12} xl={7}>
                <Grid container spacing={1} style={{ marginBottom: 16 }}>
                  <Grid item xs={12} md={6} lg={4}>
                    <Typography style={{ fontWeight: "600" }}>
                      Worker / Work Station Name
                    </Typography>
                    <TextField
                      fullWidth
                      id="work-station-name"
                      variant="outlined"
                      style={{ marginTop: 5 }}
                      value={apiDataArray?.WorkStationDetails?.name}
                      disabled
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4}>
                    <Typography style={{ fontWeight: "600" }}>
                      Process
                    </Typography>
                    <TextField
                      fullWidth
                      id="process"
                      variant="outlined"
                      style={{ marginTop: 5 }}
                      disabled
                      value={apiDataArray?.ProcessDetails?.process_name}
                    />
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    pointerEvents: isEdit ? "none" : "auto",
                    opacity: isEdit ? 0.7 : 1,
                  }}
                >
                  <Typography
                    style={{
                      paddingBlock: 5,
                      paddingLeft: 16,
                      background: "#e3e3e3",
                      fontWeight: "700",
                    }}
                  >
                    Add Metal
                  </Typography>
                  <TableContainer className={classes.scroll}>
                    <Table className={classes.addStockTableContainer}>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            width={40}
                            align="center"
                          ></TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Lot No.
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Stock Code
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Purity
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Pcs
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Weight
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {addMetalData.map((data, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell
                                style={{
                                  padding: "4px",
                                  textAlign: "center",
                                  border: "1px solid #e6e6e6",
                                  borderBottom: "2px solid #e6e6e6",
                                }}
                              >
                                <IconButton
                                  style={{ padding: "0" }}
                                  tabIndex="-1"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    deleteMetalHandler(index);
                                  }}
                                >
                                  <Icon className="" style={{ color: "red" }}>
                                    delete
                                  </Icon>
                                </IconButton>
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <Select
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  placeholder="Lot No"
                                  options={[
                                    {
                                      value: apiDataArray.number,
                                      label: apiDataArray.number,
                                      data: apiDataArray,
                                    },
                                  ]}
                                  value={data?.lotNo}
                                  isDisabled={!apiDataArray}
                                  onChange={(e) =>
                                    handleLotOptionMetalSelect(e, index)
                                  }
                                />
                              </TableCell>

                              <TableCell
                                className={classes.tablePad}
                                style={{ position: "relative" }}
                              >
                                <Select
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  placeholder="Stock code"
                                  options={goldVariantList.map((suggestion) => {
                                    return {
                                      value: suggestion.stock_name_code_id,
                                      label:
                                        suggestion.StockNameCode.stock_code,
                                      purity: suggestion.StockNameCode.purity,
                                      data: suggestion,
                                    };
                                  })}
                                  isDisabled={!data.lotNo}
                                  value={data.stockCode}
                                  onChange={(e) =>
                                    handleMetalCodeSelect(e, index)
                                  }
                                />
                                {data.errors !== undefined &&
                                  data.errors.stockCode && (
                                    <span className={classes.errorMessage}>
                                      {data.errors.stockCode}
                                    </span>
                                  )}
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  variant="outlined"
                                  value={data.purity}
                                  name="purity"
                                  disabled={!data.stockCode}
                                  style={{ width: "100%" }}
                                  onChange={(e) => handleChangeMetal(e, index)}
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="pcs"
                                  variant="outlined"
                                  type="number"
                                  className={classes.inputBoxTEST}
                                  disabled={!data.stockCode}
                                  value={data.pcs}
                                  style={{ width: "100%" }}
                                  onChange={(e) => handleChangeMetal(e, index)}
                                  error={
                                    data.errors !== undefined
                                      ? data.errors.pcs
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    data.errors !== undefined
                                      ? data.errors.pcs
                                      : ""
                                  }
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="weight"
                                  variant="outlined"
                                  value={data.weight}
                                  style={{ width: "100%" }}
                                  onChange={(e) => handleChangeMetal(e, index)}
                                  disabled={!data.stockCode}
                                  error={
                                    data.errors !== undefined
                                      ? data.errors.weight
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    data.errors !== undefined
                                      ? data.errors.weight
                                      : ""
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                <Box
                  sx={{
                    pointerEvents: isEdit ? "none" : "auto",
                    opacity: isEdit ? 0.7 : 1,
                  }}
                  className="mt-16"
                >
                  <Typography
                    style={{
                      paddingBlock: 5,
                      paddingLeft: 16,
                      background: "#e3e3e3",
                      fontWeight: "700",
                    }}
                  >
                    Add Any Stock
                  </Typography>
                  <TableContainer className={classes.scroll}>
                    <Table className={classes.addStockTableContainer}>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            width={40}
                            align="center"
                          ></TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Lot No.
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Design No / Batch No
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Stock Code
                          </TableCell>
                          {/* <TableCell
                          className={classes.tableRowPad}
                          width="100px"
                        >
                          Purity
                        </TableCell> */}
                          <TableCell
                            className={classes.tableRowPad}
                            width="100px"
                          >
                            Pcs
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="100px"
                          >
                            Weight
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Remark
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {addStockData.map((data, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell
                                style={{
                                  padding: "4px",
                                  textAlign: "center",
                                  border: "1px solid #e6e6e6",
                                  borderBottom: "2px solid #e6e6e6",
                                }}
                              >
                                <IconButton
                                  style={{ padding: "0" }}
                                  tabIndex="-1"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    deleteLotHandler(index);
                                  }}
                                >
                                  <Icon className="" style={{ color: "red" }}>
                                    delete
                                  </Icon>
                                </IconButton>
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <Select
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  placeholder="Lot No"
                                  options={[
                                    {
                                      value: apiDataArray.number,
                                      label: apiDataArray.number,
                                      data: apiDataArray,
                                    },
                                  ]}
                                  value={data.lotNo}
                                  isDisabled={!apiDataArray}
                                  onChange={(e) =>
                                    handleLotOptionSelect(e, index)
                                  }
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <Select
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  placeholder="Batch No / Design No"
                                  options={data.LotDesigns.map((data) => ({
                                    value: data.design_id,
                                    label: data.batch_no,
                                    data: data,
                                  }))}
                                  value={data.batchNo}
                                  onChange={(e) =>
                                    handleBatchOptionSelect(e, index)
                                  }
                                />
                                {data.errors !== undefined &&
                                  data.errors.batchNo && (
                                    <span className={classes.errorMessage}>
                                      {data.errors.batchNo}
                                    </span>
                                  )}
                              </TableCell>
                              <TableCell
                                className={classes.tablePad}
                                style={{ position: "relative" }}
                              >
                                <Select
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  placeholder="Stock code"
                                  options={stockCodeList.map((data) => ({
                                    value: data.StockNameCode.id,
                                    label: data.StockNameCode.stock_code,
                                    data: data,
                                  }))}
                                  isDisabled={!(data.is_batch === 1)}
                                  value={data.stockCode}
                                  onChange={(e) =>
                                    handleStockCodeSelect(e, index)
                                  }
                                />
                                {data.errors !== undefined &&
                                  data.errors.stockCode && (
                                    <span className={classes.errorMessage}>
                                      {data.errors.stockCode}
                                    </span>
                                  )}
                              </TableCell>
                              {/* <TableCell className={classes.tablePad}>
                              <TextField
                                variant="outlined"
                                value={data.purity}
                                name="purity"
                                disabled={data.is_batch === 1}
                                style={{ width: "100%" }}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </TableCell> */}
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="pcs"
                                  variant="outlined"
                                  type="number"
                                  className={classes.inputBoxTEST}
                                  disabled={!(data.is_batch === 1)}
                                  value={data.pcs}
                                  style={{ width: "100%" }}
                                  onChange={(e) => handleChange(e, index)}
                                  error={
                                    data.errors !== undefined
                                      ? data.errors.pcs
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    data.errors !== undefined
                                      ? data.errors.pcs
                                      : ""
                                  }
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="weight"
                                  variant="outlined"
                                  value={data.weight}
                                  style={{ width: "100%" }}
                                  onChange={(e) => handleChange(e, index)}
                                  error={
                                    data.errors !== undefined
                                      ? data.errors.weight
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    data.errors !== undefined
                                      ? data.errors.weight
                                      : ""
                                  }
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="remark"
                                  variant="outlined"
                                  value={data.remark}
                                  style={{ width: "100%" }}
                                  onChange={(e) => handleChange(e, index)}
                                  error={
                                    data.errors !== undefined
                                      ? data.errors.remark
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    data.errors !== undefined
                                      ? data.errors.remark
                                      : ""
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    id="btn-all-production"
                    variant="contained"
                    style={{
                      // background: "#1FD319",
                      color: "#FFFFFF",
                      marginTop: 15,
                      display: "block",
                      marginLeft: "auto",
                    }}
                    onClick={addStockValidate}
                  >
                    Save & Print
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} xl={5}>
                <Box sx={{ marginBottom: 16 }}>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ padding: 10, background: "#e3e3e3" }}
                  >
                    <Grid item>
                      Item of Lot(<span>{lotDesignList.length}</span>)
                    </Grid>
                    <Grid item>
                      <TextField
                        variant="outlined"
                        name="searchlotdesign"
                        placeholder="Scan / Search"
                        onChange={(e) => handleSearchLoginData(e)}
                      />
                    </Grid>
                  </Grid>
                  <TableContainer style={{ overflowX: "auto" }}>
                    <Table className={classes.addStockTableContainer}>
                      <TableHead>
                        <TableRow>
                          {isEdit && (
                            <TableCell
                              width="25px"
                              className={classes.tableRowPad}
                              align="center"
                            ></TableCell>
                          )}
                          <TableCell
                            width="110px"
                            className={classes.tableRowPad}
                          >
                            Design No
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="80px"
                            align="center"
                          >
                            Design
                          </TableCell>
                          <TableCell
                            width="130px"
                            className={classes.tableRowPad}
                          >
                            Batch No
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="50px"
                          >
                            Design Pcs
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="80px"
                          >
                            No of Stone
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="80px"
                          >
                            Gross Weight
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="80px"
                          >
                            Stone Weight
                          </TableCell>
                          <TableCell
                            width="80px"
                            className={classes.tableRowPad}
                          >
                            Net Weight
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {lotDesignList.length === 0 ? (
                          <TableRow>
                            <TableCell
                              align="center"
                              colSpan={8}
                              className={classes.tableRowPad}
                            >
                              <div style={{ textAlign: "center" }}>No Data</div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          lotDesignList
                            .filter((temp) => {
                              if (designLotSearchData) {
                                return (
                                  temp.batch_no !== null &&
                                  temp.batch_no !== "" &&
                                  temp.batch_no
                                    .toLowerCase()
                                    .includes(designLotSearchData.toLowerCase())
                                );
                              } else {
                                return temp;
                              }
                            })
                            .map((data, index) => {
                              return (
                                <TableRow key={index}>
                                  {isEdit && (
                                    <TableCell
                                      className={classes.tablePad}
                                      align="center"
                                    >
                                      <Checkbox
                                        style={{
                                          padding: 0,
                                          color: "#415bd4",
                                        }}
                                        color="primary"
                                        checked={selectedRows.includes(data)}
                                        onChange={() =>
                                          handleCheckboxChange(data)
                                        }
                                      />
                                    </TableCell>
                                  )}
                                  <TableCell className={classes.tableRowPad}>
                                    {data.LotDesignData?.variant_number}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    <DesignZoomModal
                                      imgPath={
                                        data?.LotDesignData?.image_files[0]
                                          ?.image_file
                                      }
                                    />
                                    {/* <div>
                                    <Zoom>
                                      <img
                                        alt="hmm"
                                        src={
                                          data?.LotDesignData?.image_files[0]
                                            ?.image_file
                                        }
                                        style={{ height: "50px" }}
                                      />
                                    </Zoom>
                                  </div> */}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.batch_no}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.design_pcs}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.total_stone_pcs * data.design_pcs}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.total_gross_weight}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.total_stone_weight}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.total_net_weight}
                                  </TableCell>
                                </TableRow>
                              );
                            })
                        )}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          {isEdit && (
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                          )}
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <b>Total</b>
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <b>
                              {HelperFunc.getTotalOfFieldNoDecimal(
                                lotDesignList,
                                "design_pcs"
                              )}
                            </b>
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <b>
                              {parseInt(
                                HelperFunc.getTotalOfMultipliedFields(
                                  lotDesignList,
                                  "total_stone_pcs",
                                  "design_pcs"
                                )
                              )}
                            </b>
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <b>
                              {HelperFunc.getTotalOfField(
                                lotDesignList,
                                "total_gross_weight"
                              )}
                            </b>
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <b>
                              {HelperFunc.getTotalOfField(
                                lotDesignList,
                                "total_stone_weight"
                              )}
                            </b>
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <b>
                              {HelperFunc.getTotalOfField(
                                lotDesignList,
                                "total_net_weight"
                              )}
                            </b>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <div style={{ display: "none" }}>
          <IssueToWorkerPrint
            ref={componentRef}
            printObj={printObj}
            from="Add To Lot For"
            isAddToLotOrRemove={true}
          />
        </div>
        </div>
      </Box>
      {/* </Modal> */}
    </>
  );
};

export default AddToLot;

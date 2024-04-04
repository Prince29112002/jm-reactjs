import { FuseAnimate } from "@fuse";
import History from "@history";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Icon,
  IconButton,
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
// import { Add, Delete, KeyboardBackspace, Search } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
// import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import React, { useEffect, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Select, { createFilter } from "react-select";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
import { useReactToPrint } from "react-to-print";
import IssueToWorkerPrint from "../../ProductionComp/IssueToWorkerPrint/IssueToWorkerPrint";
// import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
// import { values } from "lodash";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// import FormControl from "@material-ui/core/FormControl";
// import FormLabel from "@material-ui/core/FormLabel";
import DesignZoomModal from "../../ProductionComp/DesignZoomModal/DesignZoomModal";
import { HtmlPrintAddApi } from "app/main/apps/Production/ProductionMain/Helper/HtmlPrintAdd";
import ReactDOM from "react-dom";
import Icones from "assets/fornt-icons/Mainicons";

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
  addBtn: {
    display: "block",
    borderRadius: "8px",
    background: "#1E65FD",
    minWidth: "40px",
  },
  addStockTableContainer: {
    fontSize: 14,
    minWidth: 700,
  },
  addTableHead: {
    fontSize: 12,
    lineHeight: 1.5,
    padding: 10,
  },
  scroll: {
    overflowX: "initial",
  },
  setPadding: {
    padding: 8,
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
    bottom: "0px",
    fontSize: "9px",
    lineHeight: "8px",
  },
}));

const ReceiveFromWorker = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [apiDataArray, setApiDataArray] = useState("");
  const [lotNumberSearch, setLotNumberSearch] = useState("");
  const [selectedLotNumber, setSelectedLotNumber] = useState("");
  const [lotApiData, setLotApiData] = useState([]);
  const [stockCodeList, setStockCodeList] = useState([]);
  const [workStationList, setWorkStationList] = useState([]);
  const [selectedWorkstation, setSelectedWorkstation] = useState("");
  const [processList, setProcessList] = useState([]);
  const [selcetdProcess, setSelcetdProcess] = useState("");
  const [remark, setRemark] = useState("");
  const [lotDesignList, setLotDesignList] = useState([]);
  const [designLotSearchData, setDesignLotSearchData] = useState("");
  const [selectedLotSearchData, setSelectedLotSearchData] = useState("");
  const [printObj, setPrintObj] = useState([]);
  const department_id = window.localStorage.getItem("SelectedDepartment");
  const [itemFlag, setItemFlag] = useState(0);
  const [isCasted, setIsCasted] = useState(1);
  const [grossWgtErr, setGrossWgtErr] = useState("");

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
        from="Receive From Workstation For"
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
    documentTitle: "Receive_From_Worker_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });

  useEffect(() => {
    if (printObj.length > 0) {
      handlePrint();
    }
  }, [printObj]);

  const [addStockData, setAddStockData] = useState([
    {
      lotNo: "",
      batchNo: "",
      stockCode: "",
      purity: "",
      pcs: "",
      weight: "",
      remark: "",
      LotDesigns: [],
      is_batch: "",
      errors: {},
    },
  ]);

  useEffect(() => {
    clearData();
  }, [window.localStorage.getItem("SelectedDepartment")]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (lotNumberSearch) {
        getProductData(lotNumberSearch);
      } else {
        setLotApiData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [lotNumberSearch]);

  function clearData() {
    setAddStockData([
      {
        lotNo: "",
        batchNo: "",
        stockCode: "",
        purity: "",
        pcs: "",
        weight: "",
        remark: "",
        LotDesigns: [],
        is_batch: "",
        errors: {},
      },
    ]);
    setApiDataArray("");
    setSelectedLotNumber("");
    setLotDesignList([]);
    setLotNumberSearch("");
    setLotApiData([]);
    setStockCodeList([]);
    setSelectedWorkstation("");
    setSelcetdProcess("");
    setRemark("");
    setIsCasted(1);
  }

  function getProductData(sData) {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/lot/number/searching?department_id=${department_id}&number=${sData}&issue_receive=1`
    )
      .then(function (response) {
        if (response.data.success === true) {
          let responseData = response.data.data;
          if (responseData.length > 0) {
            setLotApiData(responseData);
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
          api: `api/production/lot/number/searching?department_id=${department_id}&number=${sData}&issue_receive=1`,
        });
      });
  }

  useEffect(() => {
    if (selectedLotNumber) {
      getAddToLotListing();
    }
  }, [selectedLotNumber]);

  function getAddToLotListing() {
    const body = {
      number: selectedLotNumber,
      department_id: parseFloat(
        window.localStorage.getItem("SelectedDepartment")
      ),
    };
    Axios.post(Config.getCommonUrl() + `api/production/lot/number`, body)
      .then(function (response) {
        if (response.data.success) {
          console.log(response.data.data);
          const apiData = response.data.data;
          const objDtaa = { ...apiData };
          const stoneWgt = apiData.total_stone_weight
            ? apiData.total_stone_weight
            : "";
          objDtaa.total_gross_wgt_new = stoneWgt;
          console.log(objDtaa);
          setApiDataArray(objDtaa);
          setIsCasted(response.data.data.order_info);
          getStockCode(response.data.data.purity);
          lossCalculation(response.data.data);
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
          api: `api/production/lot/number`,
        });
      });
  }
  console.log(apiDataArray);
  const lossCalculation = (data, metalWgt) => {
    const updatedArray = { ...data };

    let lossWgt = data.total_gross_wgt
      ? parseFloat(data.total_gross_wgt).toFixed(3)
      : 0;
    if (metalWgt) {
      lossWgt -= parseFloat(metalWgt).toFixed(3);
    }
    if (data.total_gross_wgt_new) {
      lossWgt -= parseFloat(data.total_gross_wgt_new).toFixed(3);
    }
    console.log(lossWgt, data.purity);
    const lossFine = parseFloat(
      (parseFloat(lossWgt) * parseFloat(data.purity)) / 100
    ).toFixed(2);

    updatedArray.loss_wgt = parseFloat(lossWgt).toFixed(3);
    updatedArray.loss_fine = lossFine;

    setApiDataArray(updatedArray);
  };
  function getStockCode(lotPurity) {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/removelot/metalStock?purity=${lotPurity}`
    )
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
          api: `api/production/removelot/metalStock?purity=${lotPurity}`,
        });
      });
  }

  let handleLotSelect = (value) => {
    let filteredArray = lotApiData.filter((item) => item.number === value);
    if (filteredArray.length > 0) {
      setSelectedLotNumber(value);
    }
  };
  console.log(addStockData);
  let handleChange = (e, i) => {
    const { name, value } = e.target;
    if (
      (name === "weight" || name === "purity") &&
      !/^\d*\.?\d*$/.test(value)
    ) {
      return;
    }
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData[i][e.target.name] = e.target.value;
    addStockUpdatedData[i].errors[e.target.name] = "";
    if (name === "weight") {
      let totalWeight = 0;

      addStockUpdatedData.forEach((item) => {
        // Convert weight to number and add to totalWeight if it's a valid number
        const weight = parseFloat(item.weight);
        if (!isNaN(weight)) {
          totalWeight += weight;
        }
      });
      // const objDtaa = { ...apiDataArray };
      // if (value) {
      //   objDtaa.loss_wgt = (
      //     parseFloat(objDtaa.loss_wgt) - parseFloat(value)
      //   ).toFixed(3);
      // }
      // if (objDtaa.loss_wgt) {
      //   objDtaa.loss_fine = parseFloat(
      //     (parseFloat(objDtaa.loss_wgt) * objDtaa.purity) / 100
      //   ).toFixed(3);
      // } else {
      //   objDtaa.loss_fine = 0;
      // }
      // setApiDataArray(objDtaa);
      lossCalculation(apiDataArray, totalWeight);
    }
    setAddStockData(addStockUpdatedData);
  };

  function deleteLotHandler(index) {
    const arrData = [...addStockData];
    if (!arrData[index + 1]) {
      setAddStockData([
        {
          lotNo: "",
          batchNo: "",
          stockCode: "",
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

  function handleLotOptionSelect(option, i) {
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData[i].lotNo = option;
    addStockUpdatedData[i].LotDesigns = option.data.LotDesigns;
    addStockUpdatedData[i].is_batch = 0;
    addStockUpdatedData[i].purity = option.data.purity;
    setAddStockData(addStockUpdatedData);

    if (addStockData.length - i === 1) {
      setAddStockData([
        ...addStockData,
        {
          lotNo: "",
          batchNo: "",
          stockCode: "",
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
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData[i].batchNo = {
      value: option.value,
      label: option.label,
    };
    addStockUpdatedData[i].is_batch = 1;
    addStockUpdatedData[i].errors.batchNo = "";
    setAddStockData(addStockUpdatedData);
  }

  function handleStockCodeSelect(option, i) {
    const addStockUpdatedData = [...addStockData];
    let isStockCodeAvailable = addStockUpdatedData.some(
      (item) => item.stockCode && item.stockCode.value === option.value
    );
    if (!isStockCodeAvailable) {
      addStockUpdatedData[i].stockCode = {
        value: option.value,
        label: option.label,
      };
      addStockUpdatedData[i].errors.stockCode = "";
      setAddStockData(addStockUpdatedData);
    } else {
      dispatch(
        Actions.showMessage({
          message: "This stock code alredy added",
        })
      );
    }
  }

  function getItemOfLot(data) {
    setLotDesignList(data.LotDesigns);
  }

  const handleSearchLoginData = (event) => {
    const { name, value } = event.target;
    if (name === "searchselectedlot") {
      setSelectedLotSearchData(value);
    } else if (name === "searchlotdesign") {
      setDesignLotSearchData(value);
    }
  };

  const validateAddedWgt = () => {
    const newFormValues = [...addStockData];
    // Calculate the sum of the 'weight' property
    const totalWeight = newFormValues.reduce((accumulator, currentValue) => {
      // Parse the 'weight' property as a float and add it to the accumulator
      return accumulator + parseFloat(currentValue.weight || 0); // Use 0 if weight is undefined or falsy
    }, 0); // Initialize accumulator with 0

    console.log("Total Weight:", totalWeight);
    if (parseFloat(apiDataArray.loss_wgt) < parseFloat(totalWeight)) {
      dispatch(
        Actions.showMessage({
          message: "Receive metal weight is higher then loss weight",
          variant: "error",
        })
      );
      return false;
    } else {
      return true;
    }
  };

  const handleSubmitData = () => {
    if (
      validateScanlot() &&
      validGrossWeight() &&
      validateWorker() &&
      validateprocess() &&
      validateMetal()
      // validateAddedWgt()
    ) {
      handleSubmitAddStock();
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
          message: "Select work station",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  }
  console.log(apiDataArray);
  function validGrossWeight() {
    if (
      !apiDataArray.total_gross_wgt_new ||
      apiDataArray.total_gross_wgt_new === ""
    ) {
      setGrossWgtErr("Plz Enter Gross Weight");
      return false;
    }
    // else if (isCasted !== 1) {
    //   if (
    //     apiDataArray.total_stone_weight === apiDataArray.total_gross_wgt_new
    //   ) {
    //     return true;
    //   } else {
    //     dispatch(
    //       Actions.showMessage({
    //         message: "Plz Enter Valid Gross Weight",
    //         variant: "error",
    //       })
    //     );
    //     return false;
    //   }
    // }
    return true;
  }

  function validateprocess() {
    if (!apiDataArray?.ProcessDetails?.process_name) {
      dispatch(
        Actions.showMessage({
          message: "Select Process",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  }

  function validateMetal() {
    const newFormValues = [...addStockData];
    const weightRegex = /^(?:\d{1,4}(?:\.\d{1,4})?|\.\d{1,4}|9999(?:\.9999)?)$/;
    let result = false;
    // if (newFormValues[0].lotNo) {
    newFormValues.map((item, i) => {
      if (item.lotNo) {
        // if (!item.batchNo) {
        //   newFormValues[i].errors.batchNo = "Select batch number";
        //   result = true;
        // }
        if (!item.stockCode) {
          newFormValues[i].errors.stockCode = "Select stock";
          result = true;
        }
        if (!item.pcs) {
          newFormValues[i].errors.pcs = "Enter PCS";
          result = true;
        }
        if (
          !item.weight ||
          weightRegex.test(item.weight) === false ||
          item.weight == 0
        ) {
          newFormValues[i].errors.weight = "Enter valid Weight";
          result = true;
        }
        // else {
        //   result = true;
        // }
      }
    });
    if (!result) {
      return true;
    }
    setAddStockData(newFormValues);
    // }
    // else {
    //   dispatch(
    //     Actions.showMessage({
    //       message: "Receive metal",
    //       variant: "error",
    //     })
    //   );
    // }
    // console.log(result);
    // return result;
  }

  function handleSubmitAddStock() {
    const finalArrstock = [];
    addStockData.map((item) => {
      if (item.lotNo) {
        finalArrstock.push({
          stock_name_code_id: item.stockCode.value,
          added_weight: item.weight,
          purity: item.purity,
          pcs: item.pcs,
        });
      }
    });
    const body = {
      department_id: department_id,
      process_id: apiDataArray?.ProcessDetails?.id,
      workstation_id: apiDataArray?.WorkStationDetails?.id,
      lot_id: apiDataArray.id,
      total_gross_wgt: apiDataArray.total_gross_wgt_new,
      loss_weight: apiDataArray.loss_wgt,
      loss_fine: apiDataArray.loss_fine,
      remark: remark,
      MetalArray: finalArrstock,
      fresh_reject: itemFlag,
    };
    Axios.post(Config.getCommonUrl() + `api/production/recieve/worker`, body)
      .then(function (response) {
        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setPrintObj([response.data.data]);
          clearData();
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
          api: `/api/production/recieve/worker`,
          body: body,
        });
      });
  }
  // const handleGrossChange = (e) => {};
  const handleGrossChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    const objDtaa = { ...apiDataArray };
    objDtaa.total_gross_wgt_new = value;
    // if (!isNaN(value)) {
    //   if (name === "total_gross_wgt") {
    //     objDtaa.total_gross_wgt_new = value;
    //     if (value) {
    //       const netWgt =
    //         parseFloat(value) - parseFloat(objDtaa.total_stone_weight);
    //       objDtaa.total_net_wgt = parseFloat(netWgt).toFixed(3);
    //       objDtaa.loss_wgt = (
    //         parseFloat(objDtaa.total_gross_wgt) -
    //         parseFloat(objDtaa.total_gross_wgt_new)
    //       ).toFixed(3);
    //     } else {
    //       objDtaa.total_net_wgt = 0;
    //     }
    //   }
    //   if (objDtaa.loss_wgt) {
    //     objDtaa.loss_fine = parseFloat(
    //       (parseFloat(objDtaa.loss_wgt) * objDtaa.purity) / 100
    //     ).toFixed(3);
    //   } else {
    //     objDtaa.loss_fine = 0;
    //   }
    // }
    console.log(objDtaa);
    setApiDataArray(objDtaa);
    lossCalculation(objDtaa);
    setGrossWgtErr("");
  };

  const handleFlagSelect = (e) => {
    setItemFlag(Number(e.target.value));
  };

  return (
    <>
      {/* <Modal open={openPopup}> */}
      <Box className={classes.model} style={{ overflowY: "auto" }}>
        <Grid container className={classes.modalContainer}>
          <Grid item xs={12} sm={4} md={3} key="1">
            <FuseAnimate delay={300}>
              <Typography className="pl-28 pt-16 text-18 font-700">
                Receive From Workstation
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
          <Box style={{ paddingInline: 16 }}>
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
                      if (event.type === "change")
                        setLotNumberSearch(newInputValue);
                    } else {
                      setLotNumberSearch("");
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
              <Grid item lg={2} className="ml-32">
                <RadioGroup
                  name="itemFlag"
                  className={classes.group}
                  value={itemFlag}
                  onChange={handleFlagSelect}
                  style={{ flexDirection: "row" }}
                >
                  <FormControlLabel
                    value={0}
                    control={<Radio />}
                    label="Fresh"
                  />

                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="Reject"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
            <Box>
              <TableContainer
                // className={classes.scroll}
                style={{
                  marginBottom: 16,
                  overflowX: "auto",
                  overflowY: "hidden",
                }}
              >
                <Table
                  className={`${classes.table}`}
                  // style={{ minWidth: "900px" }}
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
                        Issue Weight
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
                      <TableCell width="120px" className={classes.tableRowPad}>
                        Loss Weight
                      </TableCell>
                      <TableCell width="120px" className={classes.tableRowPad}>
                        Loss Fine
                      </TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {console.log(apiDataArray)}
                    {!apiDataArray ? (
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          colSpan={12}
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
                          <TextField
                            id="gold-variant"
                            variant="outlined"
                            style={{ marginTop: 5 }}
                            value={apiDataArray?.total_gross_wgt_new || ""}
                            onChange={(e) => handleGrossChange(e)}
                            name="total_gross_wgt"
                            error={grossWgtErr ? true : false}
                            helperText={grossWgtErr}
                            // placeholder={apiDataArray?.total_gross_wgt}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.total_stone_weight}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.total_net_wgt}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.loss_wgt || 0.0}
                          {/* <TextField
                          id="gold-variant"
                          variant="outlined"
                          style={{ marginTop: 5 }}
                          value={apiDataArray?.loss_wgt}
                          onChange={(e) => handleGrossChange(e)}
                          name="loss_wgt"
                          // error={item.error?.added_wgt ? true : false}
                          // helperText={item?.error?.added_wgt}
                          // disabled={!item.gold_variant}
                          placeholder="0"
                          fullWidth
                        /> */}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.loss_fine || 0.0}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Grid container spacing={2}>
              <Grid item md={12} lg={7}>
                <Grid container spacing={1} style={{ marginBottom: 16 }}>
                  <Grid item xs={12} sm={6} md={4} lg={4}>
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
                  <Grid item xs={12} sm={6} md={4} lg={4}>
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
                  <Grid item xs={12} sm={6} md={4} lg={4}>
                    <Typography style={{ fontWeight: "600" }}>
                      Remark
                    </Typography>
                    <TextField
                      fullWidth
                      name="lotremark"
                      variant="outlined"
                      style={{ marginTop: 5 }}
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                    />
                  </Grid>
                </Grid>
                <Box
                  style={{
                    // pointerEvents: "auto",
                    // opacity: 1,
                    pointerEvents: isCasted !== 1 ? "none" : "auto",
                    opacity: isCasted !== 1 ? 0.7 : 1,
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
                    Receive Metal
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
                          {/* <TableCell className={classes.tableRowPad}>
                          Design No / Batch No
                        </TableCell> */}
                          <TableCell className={classes.tableRowPad}>
                            Stock Code
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="100px"
                          >
                            Purity
                          </TableCell>
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
                                  onChange={(e) =>
                                    handleLotOptionSelect(e, index)
                                  }
                                  isDisabled={!apiDataArray}
                                />
                              </TableCell>
                              {/* <TableCell className={classes.tablePad}>
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
                                isDisabled={!data.lotNo}
                              />
                              {data.errors !== undefined &&
                                data.errors.batchNo && (
                                  <span
                                    className={classes.errorMessage}
                                    style={{ color: "red" }}
                                  >
                                    {data.errors.batchNo}
                                  </span>
                                )}
                            </TableCell> */}
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
                                    value: data.id,
                                    label: data.stock_code,
                                    data: data,
                                  }))}
                                  // isDisabled={!(data.is_batch === 1)}
                                  value={data.stockCode}
                                  onChange={(e) =>
                                    handleStockCodeSelect(e, index)
                                  }
                                />
                                {data.errors !== undefined &&
                                  data.errors.stockCode && (
                                    <span
                                      className={classes.errorMessage}
                                      style={{ color: "red" }}
                                    >
                                      {data.errors.stockCode}
                                    </span>
                                  )}
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  variant="outlined"
                                  value={data.purity}
                                  name="purity"
                                  disabled
                                  // disabled={data.is_batch === 1}
                                  style={{ width: "100%" }}
                                  onChange={(e) => handleChange(e, index)}
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="pcs"
                                  variant="outlined"
                                  type="number"
                                  className={classes.inputBoxTEST}
                                  // disabled={!(data.is_batch === 1)}
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
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
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
                  onClick={handleSubmitData}
                >
                  Save & Print
                </Button>
              </Grid>
              <Grid item xs={12} xl={5}>
                <Box style={{ marginBottom: 16 }}>
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
                            Pcs
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
                                    {/* <Zoom>
                                    <img
                                      alt="hmm"
                                      src={
                                        data?.LotDesignData?.image_files[0]
                                          ?.image_file
                                      }
                                      style={{ height: "50px" }}
                                    />
                                  </Zoom> */}
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
            from="Receive From Workstation For"
          />
        </div>
        </div>
      </Box>
      {/* </Modal> */}
    </>
  );
};

export default ReceiveFromWorker;

import React, { useEffect, useState } from "react";
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
import { makeStyles } from "@material-ui/styles";
import Axios from "axios";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import { Autocomplete } from "@material-ui/lab";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Config from "app/fuse-configs/Config";
import Select, { createFilter } from "react-select";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { useReactToPrint } from "react-to-print";
import DesignZoomModal from "../../ProductionComp/DesignZoomModal/DesignZoomModal";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
import ReceiveFromCastingPrint from "../../ProductionComp/ReceiveFromCastingPrint/ReceiveFromCastingPrint";
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

const RecieveFromCasting = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [apiDataArray, setApiDataArray] = useState({});
  const [lotApiData, setLotApiData] = useState([]);
  const [lotNumber, setLotNumber] = useState("");
  const [selectedLotNumber, setSelectedLotNumber] = useState("");
  const department_id = window.localStorage.getItem("SelectedDepartment");
  const [itemFlag, setItemFlag] = useState(0);
  const [remark, setRemark] = useState("");
  const [printObj, setPrintObj] = useState([]);
  const [stockCodeList, setStockCodeList] = useState([]);
  const [grossWgtErr, setGrossWgtErr] = useState("");
  const [selectedTreeSearchData, setSelectedTreeSearchData] = useState("");
  const [treeOrderDetails, setTreeOrderDetails] = useState([]);
  const [totalMetalWgt, setTotalMetalWgt] = useState(0);
  const [treePrintObj, setTreePrintObj] = useState([]);

  const [addStockData, setAddStockData] = useState([
    {
      tree_number: "",
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
    if (selectedLotNumber) {
      getAddToLotListing();
    }
  }, [selectedLotNumber]);

  useEffect(() => {
    clearData(false);
  }, [department_id]);

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

  useEffect(() => {
    clearData();
  }, [window.localStorage.getItem("SelectedDepartment")]);

  const handleAfterPrint = () => {
    const componentInstance = (
      <ReceiveFromCastingPrint ref={componentRef} printObj={treePrintObj} />
    );
    const containerDiv = document.createElement("div");
    ReactDOM.render(componentInstance, containerDiv);
    const printedContent = containerDiv.innerHTML;
    console.log("Printed HTML content:", printedContent);
    HtmlPrintAddApi(dispatch, printedContent, treePrintObj);
    ReactDOM.unmountComponentAtNode(containerDiv);
    containerDiv.remove();
    History.goBack();
  };

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Receive_From_Casting" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });

  useEffect(() => {
    if (treePrintObj.length > 0) {
      handlePrint();
    }
  }, [treePrintObj]);

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

  function getProductData(sData) {
    const api = `api/production/treeNumber/search?department_id=${department_id}&tree_number=${sData}&issue_receive=1`;
    Axios.get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success) {
          setLotApiData(response.data.data);
        } else {
          setLotApiData([]);
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
          api: api,
        });
      });
  }

  function getAddToLotListing() {
    const body = {
      tree_number: selectedLotNumber,
      department_id: department_id,
    };
    Axios.post(
      Config.getCommonUrl() + `api/production/tree/listing/casting`,
      body
    )
      .then(function (response) {
        if (response.data.success) {
          console.log(response.data.data);
          const updatedArr = response.data.data;
          const lossFine = parseFloat(
            (parseFloat(updatedArr.weight) * parseFloat(updatedArr.purity)) /
              100
          ).toFixed(2);
          updatedArr.loss_wgt = updatedArr.weight;
          updatedArr.loss_fine = lossFine;
          setApiDataArray(updatedArr);
          getStockCode(response.data.data.purity);
        } else {
          setApiDataArray({});
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
          api: `api/production/tree/listing/casting`,
          body,
        });
      });
  }

  const removeAddedWgt = (metal_wgt) => {
    console.log(metal_wgt);
    const arrData = apiDataArray;
    const issueWgt = arrData.weight;
    const grossWgt = arrData.total_gross_wgt_new
      ? arrData.total_gross_wgt_new
      : 0;
    // const lossWgt = arrData.loss_wgt ? arrData.loss_wgt : 0;
    const metalWgt = metal_wgt ? metal_wgt : 0;
    console.log(grossWgt, "grossWgt");
    const totalWgt = parseFloat(grossWgt) + parseFloat(metalWgt);
    console.log(totalWgt);
    const lossWgt = parseFloat(
      parseFloat(issueWgt) - parseFloat(totalWgt)
    ).toFixed(3);
    const lossFine = parseFloat(
      (parseFloat(lossWgt) * parseFloat(arrData.purity)) / 100
    ).toFixed(2);
    arrData.loss_wgt = lossWgt;
    arrData.loss_fine = lossFine;
    setApiDataArray(arrData);
  };

  const lossCalculation = (data, metal_wgt) => {
    const issueWgt = data.weight;
    const grossWgt = data.total_gross_wgt_new ? data.total_gross_wgt_new : 0;
    // const lossWgt = data.loss_wgt ? data.loss_wgt : 0;
    const metalWgt = metal_wgt ? metal_wgt : 0;
    const totalWgt = parseFloat(grossWgt) + parseFloat(metalWgt);
    const lossWgt = parseFloat(
      parseFloat(issueWgt) - parseFloat(totalWgt)
    ).toFixed(3);
    const lossFine = parseFloat(
      (parseFloat(lossWgt) * parseFloat(data.purity)) / 100
    ).toFixed(2);
    // data.recoverable_loss = recoverableLoss;
    data.loss_wgt = lossWgt;
    data.loss_fine = lossFine;
    setApiDataArray(data);
  };

  function getItemOfLot(data) {
    console.log(data);
    setTreeOrderDetails(data.treeOrderDetails);
  }

  console.log(apiDataArray);
  console.log(addStockData);

  function clearData() {
    setLotNumber("");
    setSelectedLotNumber("");
    setLotApiData([]);
    setApiDataArray({});
    setAddStockData([
      {
        tree_number: "",
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
    setTreeOrderDetails([]);
    setStockCodeList([]);
    setGrossWgtErr("");
  }

  let handleLotSelect = (value) => {
    let filteredArray = lotApiData.filter((item) => item.tree_number === value);
    if (filteredArray.length > 0) {
      setSelectedLotNumber(value);
    }
  };

  const handleGrossChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    const objDtaa = { ...apiDataArray };
    // objDtaa.total_gross_wgt_new = value;
    if (!isNaN(value)) {
      if (name === "total_gross_wgt") {
        objDtaa.total_gross_wgt_new = value;
      } else if (name === "loss_wgt") {
        console.log("asdfsda");
        objDtaa.loss_wgt = value;
      }

      console.log(objDtaa);

      // setApiDataArray(objDtaa);
      lossCalculation(objDtaa, totalMetalWgt);
      setGrossWgtErr("");
    }
  };

  function validateScanlot() {
    if (Object.keys(apiDataArray).length === 0) {
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
    if (!apiDataArray?.workStationName?.name) {
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

  const handleSubmitData = () => {
    if (
      validateScanlot() &&
      validGrossWeight() &&
      validateWorker() &&
      validateMetal()
    ) {
      handleSubmitAddCasting();
    }
  };

  const handleSubmitAddCasting = () => {
    const finalArrstock = [];
    addStockData.map((item) => {
      if (item.tree_number) {
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
      workstation_id: apiDataArray?.workStationName?.id,
      production_tree_id: apiDataArray.id,
      weight: apiDataArray.total_gross_wgt_new,
      loss_weight: apiDataArray.loss_wgt,
      loss_fine: apiDataArray.loss_fine,
      fresh_reject: itemFlag,
      remark: remark,
      // recoverable_loss: apiDataArray.recoverable_loss,
      MetalArray: finalArrstock,
    };
    console.log(body);
    Axios.post(
      Config.getCommonUrl() + `api/production/tree/recieve/casting`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          console.log(response.data.data);
          clearData();
          setTreePrintObj([response.data.data]);
          console.log(response);
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
          api: `/api/production/tree/recieve/casting`,
          body: body,
        });
      });
  };

  const handleFlagSelect = (e) => {
    setItemFlag(Number(e.target.value));
  };

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
    // if (name === "weight") {
    //   let totalWeight = 0;

    //   addStockUpdatedData.forEach((item) => {
    // Convert weight to number and add to totalWeight if it's a valid number
    //   const weight = parseFloat(item.weight);
    //   if (!isNaN(weight)) {
    //     totalWeight += weight;
    //   }
    // });
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

    if (name === "weight") {
      let totalWeight = 0;

      addStockUpdatedData.forEach((item) => {
        // Convert weight to number and add to totalWeight if it's a valid number
        const weight = parseFloat(item.weight);
        if (!isNaN(weight)) {
          totalWeight += weight;
        }
      });
      setTotalMetalWgt(totalWeight);
      lossCalculation(apiDataArray, totalWeight);
    }
    setAddStockData(addStockUpdatedData);
  };
  function deleteLotHandler(index) {
    const arrData = [...addStockData];
    if (!arrData[index + 1]) {
      const newArr = [
        {
          tree_number: "",
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
      ];
      setAddStockData(newArr);
    } else {
      const remainingArr = arrData.filter((item, i) => i !== index);
      setAddStockData(remainingArr);
      const totalWeight = sumOfWeights(remainingArr);
      removeAddedWgt(parseFloat(totalWeight));
    }
  }

  function sumOfWeights(data) {
    return data.reduce(
      (sum, item) => parseFloat(sum) + (parseFloat(item.weight) || 0),
      0
    );
  }

  function handleLotOptionSelect(option, i) {
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData[i].tree_number = option;
    addStockUpdatedData[i].LotDesigns = option.data.LotDesigns;
    addStockUpdatedData[i].is_batch = 0;
    addStockUpdatedData[i].purity = option.data.purity;
    setAddStockData(addStockUpdatedData);

    if (addStockData.length - i === 1) {
      setAddStockData([
        ...addStockData,
        {
          tree_number: "",
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
  const handleSearchTreeData = (event) => {
    const { name, value } = event.target;
    if (name === "searchtree") {
      setSelectedTreeSearchData(value);
    }
  };
  function validGrossWeight() {
    if (
      !apiDataArray.total_gross_wgt_new ||
      apiDataArray.total_gross_wgt_new === ""
    ) {
      setGrossWgtErr("Plz Enter Gross Weight");
      return false;
    } else if (
      parseFloat(apiDataArray.total_gross_wgt_new) <
      parseFloat(apiDataArray.totalStoneWeightSum)
    ) {
      setGrossWgtErr("Enter Valid Gross Weight");
      dispatch(
        Actions.showMessage({
          message:
            "Gross weight must be equal to or greater than the stone weight",
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
      if (item.tree_number) {
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
  return (
    <Box className={classes.model} style={{ overflowY: "auto" }}>
      <Grid container className={classes.modalContainer}>
        <Grid item xs={12} sm={4} md={3} key="1">
          <FuseAnimate delay={300}>
            <Typography className="pl-28 pb-16 pt-16 text-18 font-700">
              Receive Tree
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
                    if (event.type === "change") setLotNumber(newInputValue);
                  } else {
                    setLotNumber("");
                  }
                }}
                value={selectedLotNumber}
                options={lotApiData.map((option) => option.tree_number)}
                fullWidth
                style={{ width: 200 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search Tree Number"
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
                <FormControlLabel value={0} control={<Radio />} label="Fresh" />

                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label="Reject"
                />
              </RadioGroup>
            </Grid>
          </Grid>
          <Box>
            <TableContainer style={{ marginBottom: 16, overflowX: "auto" }}>
              <Table
                className={`${classes.table}`}
                // style={{ minWidth: "900px" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell width="150px" className={classes.tableRowPad}>
                      Tree Number
                    </TableCell>
                    <TableCell width="100px" className={classes.tableRowPad}>
                      Purity
                    </TableCell>
                    <TableCell width="120px" className={classes.tableRowPad}>
                      Issue Weight
                    </TableCell>
                    <TableCell width="130px" className={classes.tableRowPad}>
                      Gross Weigth
                    </TableCell>
                    <TableCell width="120px" className={classes.tableRowPad}>
                      Net Weigth
                    </TableCell>
                    <TableCell width="120px" className={classes.tableRowPad}>
                      Stone Weight
                    </TableCell>
                    <TableCell width="120px" className={classes.tableRowPad}>
                      Loss Weight
                    </TableCell>
                    <TableCell width="120px" className={classes.tableRowPad}>
                      Loss Fine
                    </TableCell>
                    {/* <TableCell width="120px" className={classes.tableRowPad}>
                    Recoveraable Loss WT
                  </TableCell> */}
                    <TableCell className={classes.tableRowPad}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {console.log(apiDataArray)}
                  {Object.keys(apiDataArray).length === 0 ? (
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
                          {apiDataArray.tree_number}
                        </span>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {apiDataArray.purity}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {apiDataArray.weight}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <TextField
                          id="gold-variant"
                          variant="outlined"
                          style={{ marginTop: 5 }}
                          value={apiDataArray?.total_gross_wgt_new}
                          onChange={(e) => handleGrossChange(e)}
                          name="total_gross_wgt"
                          error={grossWgtErr ? true : false}
                          helperText={grossWgtErr}
                          fullWidth
                        />
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {apiDataArray?.total_net_weight}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {apiDataArray?.totalStoneWeightSum}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {/* <TextField
                        id="gold-variant"
                        variant="outlined"
                        style={{ marginTop: 5 }}
                        value={apiDataArray?.loss_wgt}
                        name="loss_wgt"
                        onChange={(e) => handleGrossChange(e)}
                        placeholder="0"
                        fullWidth
                      /> */}
                        {apiDataArray?.loss_wgt}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {apiDataArray?.loss_fine || 0}
                      </TableCell>
                      {/* <TableCell className={classes.tableRowPad}>
                      {apiDataArray?.recoverable_loss || 0}
                    </TableCell> */}
                      <TableCell className={classes.tableRowPad}></TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          {console.log(apiDataArray?.workStationName?.name)}
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
                    value={
                      Object.keys(apiDataArray).length !== 0
                        ? apiDataArray?.workStationName?.name
                        : ""
                    }
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Typography style={{ fontWeight: "600" }}>Process</Typography>
                  <TextField
                    fullWidth
                    id="process"
                    variant="outlined"
                    style={{ marginTop: 5 }}
                    disabled
                    value={
                      Object.keys(apiDataArray).length !== 0
                        ? apiDataArray?.ProcessDetails?.process_name
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Typography style={{ fontWeight: "600" }}>Remark</Typography>
                  <TextField
                    fullWidth
                    name="lotremark"
                    variant="outlined"
                    style={{ marginTop: 5 }}
                    value={Object.keys(apiDataArray).length !== 0 ? remark : ""}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Box
                style={
                  {
                    // pointerEvents: "auto",
                    // opacity: 1,
                    // pointerEvents: isCasted !== 1 ? "none" : "auto",
                    // opacity: isCasted !== 1 ? 0.7 : 1,
                  }
                }
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
                          Tree No.
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
                        console.log(data);
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
                                placeholder="Tree No"
                                options={[
                                  {
                                    value: apiDataArray.tree_number,
                                    label: apiDataArray.tree_number,
                                    data: apiDataArray,
                                  },
                                ]}
                                value={data.tree_number}
                                onChange={(e) =>
                                  handleLotOptionSelect(e, index)
                                }
                                isDisabled={
                                  Object.keys(apiDataArray).length === 0
                                }
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
            <Grid item xs={12} lg={5}>
              <Box style={{ marginBottom: 16 }}>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  style={{ padding: 10, background: "#e3e3e3" }}
                >
                  <Grid item>
                    <Typography style={{ fontWeight: 700 }}>
                      Total Lot(<span>{treeOrderDetails.length}</span>)
                    </Typography>
                  </Grid>
                  <Grid item>
                    {/* {treeNumber && (
                        <b
                          style={{
                            padding: 5,
                            background: "#d3d3d3",
                            borderRadius: 7,
                          }}
                        >
                          {treeNumber}
                        </b>
                      )} */}
                  </Grid>
                  <Grid item>
                    <TextField
                      variant="outlined"
                      name="searchtree"
                      placeholder="Scan / Search"
                      onChange={(e) => handleSearchTreeData(e)}
                    />
                  </Grid>
                </Grid>
                <TableContainer style={{ overflowX: "scroll" }}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          width="110px"
                          className={classes.tableRowPad}
                        >
                          Lot No
                        </TableCell>
                        <TableCell
                          width="110px"
                          className={classes.tableRowPad}
                        >
                          Lot Category
                        </TableCell>
                        <TableCell className={classes.tableRowPad} width="50px">
                          Pcs
                        </TableCell>
                        <TableCell className={classes.tableRowPad} width="60px">
                          No of Stone
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          width="100px"
                        >
                          Gross Weight
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          width="100px"
                        >
                          Stone Weight
                        </TableCell>
                        <TableCell width="80px" className={classes.tableRowPad}>
                          Net Weight
                        </TableCell>
                        <TableCell width="70px" className={classes.tableRowPad}>
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {treeOrderDetails.length === 0 ? (
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                            colSpan={8}
                          >
                            <div style={{ textAlign: "center" }}>No Data</div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        treeOrderDetails
                          .filter((temp) => {
                            if (selectedTreeSearchData) {
                              return (
                                temp.lotDetailsforTree.number !== null &&
                                temp.lotDetailsforTree.number !== "" &&
                                temp.lotDetailsforTree.number
                                  .toLowerCase()
                                  .includes(
                                    selectedTreeSearchData.toLowerCase()
                                  )
                              );
                            } else {
                              return temp;
                            }
                          })
                          .map((data, index) => {
                            console.log(data);
                            return (
                              <TableRow key={index}>
                                <TableCell className={classes.tableRowPad}>
                                  {data.lotDetailsforTree.number}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {
                                    data.lotDetailsforTree.ProductCategory
                                      .category_name
                                  }
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {data.pcs ? data.pcs : 0}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {data.stone_pcs ? data.stone_pcs : 0}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {data.total_gross_wgt}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {data.total_stone_weight}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {data.total_net_wgt}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Casted
                                </TableCell>
                              </TableRow>
                            );
                          })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <div style={{ display: "none" }}>
          <ReceiveFromCastingPrint ref={componentRef} printObj={treePrintObj} />
        </div>
      </div>
    </Box>
  );
};

export default RecieveFromCasting;

import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Box,
  Button,
  Grid,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import { Delete, KeyboardBackspace } from "@material-ui/icons";
import History from "@history";
import { Autocomplete } from "@material-ui/lab";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Select, { createFilter } from "react-select";
import { useReactToPrint } from "react-to-print";
import { BreakATreePrint } from "./BreakATreePrint/BreakATreePrint";
import { HtmlPrintAddApi } from "app/main/apps/Production/ProductionMain/Helper/HtmlPrintAdd";
import ReactDOM from "react-dom";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
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
  customList: {
    listStyleType: "square",
  },
  notavAilableList: {
    paddingBlock: 3,
  },
  scroll: {
    overflowX: "initial",
  },
  table: {
    minWidth: 700,
  },
  addBtn: {
    display: "block",
    borderRadius: "8px",
    background: "#1E65FD",
    minWidth: "40px",
  },
  addTableHead: {
    fontSize: 12,
    lineHeight: 1.5,
    padding: 10,
  },
  setPadding: {
    padding: 8,
  },
  tableRowPad: {
    padding: 7,
  },
  tablePad: {
    padding: 0,
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
}));

// function getModalStyle() {
//   const top = 50; //+ rand();
//   const left = 50; //+ rand();

//   return {
//     top: `${top}%`,
//     left: `${left}%`,
//     transform: `translate(-${top}%, -${left}%)`,
//   };.,,,k
// }

const BreakATree = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [printObj, setPrintObj] = useState("");
  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);

  useEffect(() => {
    if (printObj) {
      isHandlePrint();
    }
  }, [printObj]);

  const validateOrder = () => {
    if (treeOrderDetails.length === 0) {
      dispatch(
        Actions.showMessage({ message: "Please Add Lot", variant: "error" })
      );
      return false;
    } else {
      return true;
    }
  };

  const handleAfterPrint = () => {
    const componentInstance = (
      <BreakATreePrint
        ref={componentRef}
        printObj={printObj}
        referenceNum={referenceNum}
        timeAndDate={timeAndDate}
      />
    );
    const containerDiv = document.createElement("div");
    ReactDOM.render(componentInstance, containerDiv);
    const printedContent = containerDiv.innerHTML;
    console.log("Printed HTML content:", printedContent);
    HtmlPrintAddApi(dispatch, printedContent, [printObj]);
    ReactDOM.unmountComponentAtNode(containerDiv);
    containerDiv.remove();
    History.goBack();
  };

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console
    // setLoading(true);
    // setText("Loading new text...");

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        // setLoading(false);
        // setText("New, Updated Text!");
        resolve();
      }, 10);
    });
  }, []); //setText

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

  const isHandlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Break_A_Tree_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  const [lotApiData, setLotApiData] = useState([]);
  const [lotNumberSearch, setLotNumberSearch] = useState("");
  const [selectedLotNumber, setSelectedLotNumber] = useState("");
  const [treeOrderDetails, setTreeOrderDetails] = useState([]);
  const [stockCodeList, setStockCodeList] = useState([]);
  const [selectedLotSearchData, setSelectedLotSearchData] = useState("");
  const [treeNumber, setTreeNumber] = useState("");
  const [referenceNum, setReferenceNum] = useState("");
  const [timeAndDate, setTimeAndDate] = useState("");
  const [selectedTreeId, setSelectedTreeId] = useState("");
  const [treeWeight, setTreeWeight] = useState("");
  const [totalGrossWeight, setTotalGrossWeight] = useState(0);
  const [treeDetail, setTreeDetail] = useState("");
  const [grossWgtErr, setGrossWgtErr] = useState("");
  const [isCasted, setIsCasted] = useState(0);
  const [addStockData, setAddStockData] = useState([
    {
      stockCode: "",
      purity: "",
      pcs: "",
      weight: "",
      errors: {
        stockCode: "",
        purity: "",
        pcs: "",
        weight: "",
      },
    },
  ]);

  console.log(addStockData);
  useEffect(() => {
    setAddStockData([
      {
        stockCode: "",
        purity: "",
        pcs: "",
        weight: "",
        errors: {
          stockCode: "",
          purity: "",
          pcs: "",
          weight: "",
        },
      },
    ]);
    setTreeOrderDetails([]);
    setSelectedLotNumber("");
    setTreeDetail("");
    setTreeWeight("");
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
  useEffect(() => {
    getProductData();
  }, []);

  function getProductData(sData) {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/treeNumber/search?department_id=${window.localStorage.getItem(
          "SelectedDepartment"
        )}&tree_number=${sData}`
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
          // dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        // handleError(error, dispatch, {
        //   api: "retailerProduct/api/mortage/search/product",
        // });
      });
  }
  useEffect(() => {
    if (selectedLotNumber) {
      getAddToLotListing();
    }
  }, [selectedLotNumber]);
  function getAddToLotListing() {
    const body = {
      tree_number: selectedLotNumber,
      department_id: parseFloat(
        window.localStorage.getItem("SelectedDepartment")
      ),
    };
    Axios.post(Config.getCommonUrl() + `api/production/tree/Details`, body)
      .then(function (response) {
        if (response.data.success === true) {
          if (response.data.data) {
            setTreeNumber(response.data.data.tree_number);
            setTreeOrderDetails(response.data.data.treeOrderDetails);
            setIsCasted(response.data.data.order_info);
            setTreeDetail(response.data.data.weight);
            const updatedTotalGwt = response.data.data.treeOrderDetails.reduce(
              (total, item) => {
                return total + parseFloat(item.total_gross_wgt);
              },
              0
            );
            const updatedTreeWgt = response.data.data.weight;
            const UpdatedWeight = parseFloat(
              parseFloat(updatedTreeWgt) - parseFloat(updatedTotalGwt)
            ).toFixed(3);

            setTreeWeight(UpdatedWeight);
            console.log(response.data.data);
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
        handleError(error, dispatch, {
          api: `api/production/tree/Details`,
        });
      });
  }
  const treeWeightCalculation = (data, addData) => {
    console.log(data);
    const updatedAddStock = addData
      .filter((item) => item.stockCode !== "")
      .reduce((total, item) => {
        const weight = item.weight ? parseFloat(item.weight) : 0;
        return total + weight;
      }, 0);
    const updatedTotalGwt = data.reduce((total, item) => {
      const weight = item.total_gross_wgt
        ? parseFloat(item.total_gross_wgt)
        : 0;
      return total + weight;
    }, 0);
    const updatedTreeWgt = treeDetail;
    const UpdatedWeight = parseFloat(
      parseFloat(updatedTreeWgt) -
        (parseFloat(updatedTotalGwt) + parseFloat(updatedAddStock))
    ).toFixed(3);

    setTreeWeight(UpdatedWeight);
  };

  let handleLotSelect = (value) => {
    let filteredArray = lotApiData.filter((item) => item.tree_number === value);
    if (filteredArray.length > 0) {
      setSelectedLotNumber(value);
    }
  };
  function deleteLotHandler(index) {
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData.splice(index, 1);
    setAddStockData(addStockUpdatedData);
    treeWeightCalculation(treeOrderDetails, addStockUpdatedData);
  }
  function handleStockCodeSelect(option, i) {
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData[i].stockCode = {
      value: option.value,
      label: option.label,
    };
    addStockUpdatedData[i].purity = option.data.stock_name_code.purity;
    setAddStockData(addStockUpdatedData);

    if (addStockData.length - i === 1) {
      setAddStockData([
        ...addStockData,
        {
          stockCode: "",
          purity: "",
          pcs: "",
          weight: "",
          errors: {
            stockCode: "",
            purity: "",
            pcs: "",
            weight: "",
          },
        },
      ]);
    }
  }
  const handleChange = (e, i) => {
    const { name, value } = e.target;
    if (
      ((name === "weight" || name === "purity") &&
        value !== "" &&
        !/^\d*\.?\d*$/.test(value)) ||
      (name === "pcs" && value !== "" && !/^\d+$/.test(value))
    ) {
      return;
    }
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData[i][e.target.name] = e.target.value;
    addStockUpdatedData[i].errors = {
      ...addStockUpdatedData[i].errors,
      [name]: "",
    };
    if (name === "weight") {
      treeWeightCalculation(treeOrderDetails, addStockUpdatedData);
    }
    setAddStockData(addStockUpdatedData);
  };
  useEffect(() => {
    getStockCode();
  }, []);
  function getStockCode() {
    Axios.get(
      Config.getCommonUrl() +
        `api/stockName/metalPurchaseReturn?department_id=${window.localStorage.getItem(
          "SelectedDepartment"
        )}`
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
          api: `api/stockName/metalPurchaseReturn?department_id=${window.localStorage.getItem(
            "SelectedDepartment"
          )}`,
        });
      });
  }

  function handlePostTreeData(isPrint) {
    let treeIdArray = treeOrderDetails.map((data) => data.tree_id);
    console.log(treeIdArray);

    const updatedTreeOrderDetails = treeOrderDetails.map((item, i) => {
      return {
        lot_id: item.lot_id,
        total_gross_wgt: item.total_gross_wgt,
      };
    });

    const body = {
      tree_id: treeIdArray,
      department_id: parseFloat(
        window.localStorage.getItem("SelectedDepartment")
      ),
      tree_number: treeNumber,
      treenumber: updatedTreeOrderDetails,
    };
    Axios.post(
      Config.getCommonUrl() +
        `api/production/break/tree?department_id=${parseFloat(
          window.localStorage.getItem("SelectedDepartment")
        )}`,
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
          setTreeOrderDetails([]);
          setSelectedLotNumber("");
          if (isPrint === 1) {
            handlePostPrintData(
              response.data.tree_id,
              response.data.activityNumber
            );
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
        handleError(error, dispatch, {
          api: `api/production/break/tree?department_id=${parseFloat(
            window.localStorage.getItem("SelectedDepartment")
          )}&tree_id=${selectedTreeId}`,
          body: body,
        });
      });
  }
  console.log(addStockData);
  function handleAddStockData() {
    const updatedAddStockData = addStockData
      .filter((data) => data.stockCode !== "")
      .map((item, i) => {
        return {
          stock_name_code_id: item.stockCode.value,
          weight: item.weight,
          pcs: item.pcs,
        };
      });
    const body = {
      stockArray: updatedAddStockData,
    };
    Axios.post(
      Config.getCommonUrl() +
        `api/production/addStockFromTree?department_id=${window.localStorage.getItem(
          "SelectedDepartment"
        )}`,
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
          setAddStockData([
            {
              stockCode: "",
              purity: "",
              pcs: "",
              weight: "",
              errors: {
                stockCode: "",
                purity: "",
                pcs: "",
                weight: "",
              },
            },
          ]);
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
          api: `api/production/addStockFromTree?department_id=${window.localStorage.getItem(
            "SelectedDepartment"
          )}`,
          body: body,
        });
      });
  }

  function handlePostPrintData(treeList, actNumber) {
    const body = {
      // tree_number: treeNumber,
      tree_id: treeList,
      activityNumber: actNumber,
    };
    Axios.post(
      Config.getCommonUrl() + `api/productionPrintVoucher/break/tree/print`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          console.log(response.data.data.treeOrderDetails);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setTreeOrderDetails([]);
          setPrintObj(response.data.data);
          setReferenceNum(response.data.data.reference_number);
          setTimeAndDate(response.data.data.deleted_at);
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
          api: `api/productionPrintVoucher/break/tree/print`,
          body: body,
        });
      });
  }

  const validateScanlot = () => {
    if (treeOrderDetails.length === 0) {
      dispatch(
        Actions.showMessage({
          message: "Please Scan Tree No.",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  };
  const validGrossWeight = () => {
    const isEmpty = treeOrderDetails.some(
      (orderDetail) =>
        orderDetail.total_gross_wgt === "" ||
        orderDetail.total_gross_wgt === null
    );

    if (isEmpty) {
      dispatch(
        Actions.showMessage({
          message: "Please enter Gross Weight for all tree orders.",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  };
  const addStockValidate = () => {
    let hasErrors = false;

    const updatedAddStockData = addStockData.map((data) => {
      if (data.stockCode) {
        if (data.pcs === "") {
          data.errors = {
            ...data.errors,
            pcs: "Plz Enter Pcs",
          };
          hasErrors = true;
        }
        if (data.weight === "") {
          data.errors = {
            ...data.errors,
            weight: "Plz Enter Weight",
          };
          hasErrors = true;
        }
        if (!hasErrors) {
          data.errors = {
            stockCode: "",
            weight: "",
            pcs: "",
          };
        }
      }
      return data;
    });

    const isValid = updatedAddStockData
      .filter((item) => item.stockCode)
      .every((data) => data.stockCode && data.pcs !== "" && data.weight !== "");

    setAddStockData(updatedAddStockData);
    return isValid;
  };

  function grossWgtValidation() {
    let total = 0;
    treeOrderDetails.forEach((item) => {
      total += parseFloat(item.total_gross_wgt);
    });

    let totalStockWeight = 0;

    addStockData.forEach((item) => {
      if (item.stockCode !== "") {
        totalStockWeight += parseFloat(item.weight);
      }
    });

    const totalWeight = total + totalStockWeight;
    let totalStoneWeight = 0;
    treeOrderDetails.forEach((item) => {
      totalStoneWeight += parseFloat(item.total_stone_weight);
    });

    if (parseFloat(totalWeight) < parseFloat(totalStoneWeight)) {
      dispatch(
        Actions.showMessage({
          message: "Please Enter More Gross Weight than Stone Weight",
          variant: "error",
        })
      );
      return false;
    } else if (parseFloat(totalWeight) > parseFloat(treeDetail)) {
      dispatch(
        Actions.showMessage({
          message: "Please Enter Less Gross Weight than Tree Weight",
          variant: "error",
        })
      );
      return false;
    } else if (parseFloat(totalWeight) !== parseFloat(treeDetail)) {
      dispatch(
        Actions.showMessage({
          message: "Please Enter Exect Same Weight as Tree Weight",
          variant: "error",
        })
      );
      return false;
    } else {
      return true;
    }
  }
  const editWgtValidate = () => {
    const hasErrors = treeOrderDetails.some(
      (item) =>
        item.error &&
        item.error.total_gross_wgt &&
        item.error.total_gross_wgt.length !== 0
    );

    if (hasErrors) {
      dispatch(
        Actions.showMessage({
          message:
            "Gross weight must be equal to or greater than the stone weight",
          variant: "error",
        })
      );
    }

    return !hasErrors;
  };
  function handleSubmitData(isPrint) {
    if (
      validateScanlot() &&
      validGrossWeight() &&
      addStockValidate() &&
      (isCasted === 1
        ? grossWgtValidation() && validateOrder() && editWgtValidate()
        : true)
    ) {
      handlePostTreeData(isPrint);
      handleAddStockData();
      setTreeWeight("");
      setTreeDetail("");
    }
  }

  const handleSearchLotData = (event) => {
    const { name, value } = event.target;
    if (name === "searchlot") {
      setSelectedLotSearchData(value);
    }
  };

  useEffect(() => {
    calculateTotalGrossWeight();
  }, [treeOrderDetails]);

  const calculateTotalGrossWeight = () => {
    let total = 0;
    treeOrderDetails.forEach((item) => {
      total += parseFloat(item.total_gross_wgt);
    });
    setTotalGrossWeight(total);
  };

  const handleChangeLot = (event, i) => {
    const { name, value } = event.target;
    if (name === "weight" && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    // const updateTreeWgt = treeDetail ? treeDetail : 0;

    const updatedGwt = value ? value : 0;
    // const updatedTree = parseFloat(
    //   parseFloat(updateTreeWgt) - parseFloat(updatedGwt)
    // ).toFixed(3);
    const updStoneWgt = treeOrderDetails[i].total_stone_weight
      ? treeOrderDetails[i].total_stone_weight
      : 0;

    const updatedTreeOrderDetails = [...treeOrderDetails];
    updatedTreeOrderDetails[i].total_gross_wgt = value;

    const updatedNetWeight = parseFloat(
      parseFloat(updatedGwt) -
        parseFloat(updatedTreeOrderDetails[i].total_stone_weight)
    ).toFixed(3);
    updatedTreeOrderDetails[i].total_net_wgt = updatedNetWeight;

    if (!updatedTreeOrderDetails[i].error) {
      updatedTreeOrderDetails[i].error = {};
    }
    if (parseFloat(updatedGwt) < parseFloat(updStoneWgt)) {
      updatedTreeOrderDetails[i].error.total_gross_wgt = "Enter Valid Weight";
    } else {
      updatedTreeOrderDetails[i].error.total_gross_wgt = "";
    }

    treeWeightCalculation(updatedTreeOrderDetails, addStockData);
    // setTreeWeight(updatedTree);
    setTreeOrderDetails(updatedTreeOrderDetails);
    // setPrintObj(updatedTreeOrderDetails);
    setGrossWgtErr("");
    console.log(updatedTreeOrderDetails);
  };

  return (
    <Box className={classes.model} style={{ overflowY: "auto" }}>
      <Grid container className={classes.modalContainer}>
        <Grid item xs={12} sm={4} md={3} key="1">
          <FuseAnimate delay={300}>
            <Typography className="pl-28 pb-16 pt-16 text-18 font-700">
              Break A Tree
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
        <Grid container>
          <Grid
            item
            xs={12}
            style={{ marginBottom: 16, display: "inline-block" }}
            className="packing-slip-input"
          >
            {/* <TextField
              id="lot-num"
              variant="outlined"
              value="F23072021002"
              disabled
              style={{ fontWeight: "700", width: "250px" }}
            /> */}
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
              options={lotApiData.map((option) => option.tree_number)}
              fullWidth
              style={{ width: 200, display: "inline-block" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search Tree No."
                  variant="outlined"
                  style={{
                    padding: 0,
                  }}
                />
              )}
            />

            <TextField
              value={treeDetail}
              label="Total Tree Weight"
              variant="outlined"
              style={{
                padding: 0,
                marginLeft: "10px",
              }}
              disabled
            />

            <TextField
              value={treeWeight}
              label="Balance Tree Weight"
              variant="outlined"
              style={{
                padding: 0,
                marginLeft: "10px",
              }}
              disabled
            />
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={2} style={{ marginBlock: 0 }}>
            <Grid item xs={12} lg={6}>
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
                    <TextField
                      variant="outlined"
                      name="searchlot"
                      placeholder="Scan / Search"
                      onChange={(e) => handleSearchLotData(e)}
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
                      {console.log(treeOrderDetails)}
                      {treeOrderDetails.length === 0 ? (
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                            colSpan={8}
                          >
                            <div style={{textAlign: "center"}}>No Data</div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        treeOrderDetails
                          .filter((temp) => {
                            if (selectedLotSearchData) {
                              return (
                                temp.lotDetailsforTree.number !== null &&
                                temp.lotDetailsforTree.number !== "" &&
                                temp.lotDetailsforTree.number
                                  .toLowerCase()
                                  .includes(selectedLotSearchData.toLowerCase())
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
                                  {data.pcs ? data.pcs : ""}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {data.stone_pcs ? data.stone_pcs : ""}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  <TextField
                                    variant="outlined"
                                    name="weight"
                                    value={data.total_gross_wgt}
                                    onChange={(e) => handleChangeLot(e, index)}
                                    // helperText={}
                                    error={
                                      data?.error?.total_gross_wgt?.length > 0
                                        ? true
                                        : false
                                    }
                                    disabled={isCasted === 0}
                                    helperText={data?.error?.total_gross_wgt}
                                  />
                                  {/* {data.total_gross_wgt} */}
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
            <Grid item xs={12} lg={6}>
              <Box
                style={{
                  marginBottom: 16,
                  pointerEvents: isCasted === 0 ? "none" : "auto",
                  opacity: isCasted === 0 ? 0.7 : 1,
                }}
              >
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  style={{ padding: 10, background: "#e3e3e3" }}
                >
                  <Grid item>
                    <Typography style={{ fontWeight: 700 }}>
                      Add Any Stock
                    </Typography>
                  </Grid>
                </Grid>
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
                      {console.log(addStockData)}
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
                                  if (addStockData.length - 1 !== index) {
                                    deleteLotHandler(index);
                                  }
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
                                placeholder="Stock code"
                                options={stockCodeList.map((data) => ({
                                  value: data.stock_name_code.id,
                                  label: data.stock_name_code.stock_code,
                                  data: data,
                                }))}
                                value={data.stockCode}
                                onChange={(e) =>
                                  handleStockCodeSelect(e, index)
                                }
                              />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                              <TextField
                                variant="outlined"
                                value={data.purity}
                                name="purity"
                                disabled
                                style={{ width: "100%" }}
                                onChange={(e) => handleChange(e, index)}
                                error={
                                  data.errors !== undefined
                                    ? data.errors.purity
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  data.errors !== undefined
                                    ? data.errors.purity
                                    : ""
                                }
                              />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                              <TextField
                                name="pcs"
                                variant="outlined"
                                type="number"
                                className={classes.inputBoxTEST}
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
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
            <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  columnGap: 10,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  id="btn-all-production"
                  variant="contained"
                  style={{
                    color: "#FFFFFF",
                    marginTop: 15,
                    display: "block",
                    marginLeft: "auto",
                  }}
                  onClick={handleSubmitData}
                >
                  Save
                </Button>

                <Button
                  id="btn-all-production"
                  variant="contained"
                  style={{
                    color: "#FFFFFF",
                    marginTop: 15,
                    display: "block",
                    // marginLeft: "auto",
                  }}
                  onClick={() => handleSubmitData(1)}
                  // disabled={isEdit}
                >
                  Save & Print
                </Button>
              </Grid>
            <div style={{ display: "none" }}>
              <BreakATreePrint
                ref={componentRef}
                printObj={printObj}
                referenceNum={referenceNum}
                timeAndDate={timeAndDate}
              />
            </div>
          </Grid>
        </Grid>
      </Box>
      </div>
    </Box>
  );
};

export default BreakATree;

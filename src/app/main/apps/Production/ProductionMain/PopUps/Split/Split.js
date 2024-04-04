import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  Modal,
  Radio,
  RadioGroup,
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
import { FuseAnimate } from "@fuse";
import Axios from "axios";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Autocomplete from "@material-ui/lab/Autocomplete";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import History from "@history";
import HelperFunc from "../../../../SalesPurchase/Helper/HelperFunc";
import { useReactToPrint } from "react-to-print";
// import { SplitPrint } from "./SplitPrint/SplitPrint";
import LotSummary from "../../LotPrint/LotSummary";
import LotDesign from "../../LotPrint/LotDesign";
import moment from "moment";
import IssueToWorkerPrint from "../../ProductionComp/IssueToWorkerPrint/IssueToWorkerPrint";
import { HtmlPrintAddApi } from "app/main/apps/Production/ProductionMain/Helper/HtmlPrintAdd";
import ReactDOM from "react-dom";
import { SplitMultiLotPrint } from "./SplitPrint/SplitMultiLotPrint";
import Icones from "assets/fornt-icons/Mainicons";
import { LotSummaryPrint } from "../../ProductionComp/MakeABunchPrint/LotSummaryPrint";
import { DesignWisePrint } from "../../ProductionComp/MakeABunchPrint/DesignWisePrint";

const useStyles = makeStyles((theme) => ({
  bredcrumbTitle: {
    fontWeight: "700",
    fontSize: "18px",
    marginBottom: 12,
    paddingLeft: 16,
  },
  actionBtn: {
    background: "#1fd319",
    color: "#FFFFFF",
    width: "100%",
    borderRadius: "10px",
  },
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    padding: 12,
    background: "#03113b",
    color: "#FFFFFF",
  },
  modalContainer: {
    paddingBlock: "20px",
    background: "rgba(0,0,0,0)",
    justifyContent: "space-between",
  },
  modalBody: {
    padding: 20,
  },
  customList: {
    listStyleType: "square",
  },
  notavAilableList: {
    paddingBlock: 3,
  },
  scroll: {
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
  tablePad: {
    padding: 0,
  },
  tableRowPad: {
    padding: 7,
  },
}));

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const Split = () => {
  const classes = useStyles();

  const [printObj, setPrintObj] = useState([]);

  // const [modalOpen, setModalOpen] = useState(false);
  const [isView, setIsView] = useState(false); //for view Only

  const componentRefDesign = React.useRef(null);
  const componentRefSummary = React.useRef(null);
  const componentRefCreLot = React.useRef(null);
  const componentRefMultiLot = React.useRef(null);

  const dispatch = useDispatch();
  const department_id = window.localStorage.getItem("SelectedDepartment");
  const [lotNumberSearch, setLotNumberSearch] = useState("");
  const [selectedLotNumber, setSelectedLotNumber] = useState("");
  const [selectedLotId, setSelectedLotId] = useState("");
  const [lotApiData, setLotApiData] = useState([]);
  const [apiDataArray, setApiDataArray] = useState({});
  const [designArray, setDesignArray] = useState([]);
  const [selectedDesignArr, setSelectedDesignArr] = useState([]);
  const [transferArray, setTransferArray] = useState([]);
  const [designSearch, setDesignSearch] = useState("");
  const [transferSearch, setTransferSearch] = useState("");
  const [grossWgt, setgrossWgt] = useState("");
  const [grossWgtErr, setgrossWgtErr] = useState("");
  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");
  const [createdLot, setCreatedLot] = useState([]);
  const [splitFlag, setSplitFlag] = useState(0);

  const [voucherPrintType, setVoucherPrintType] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [printObjMultiple, setPrintObjMultiple] = useState([]);
  const [printObjCreLot, setPrintObjCreLot] = useState([]);
  const [printObjMultiLot, setPrintObjMultiLot] = useState([]);
  const [isDesignSplit, setIsDesignSplit] = useState(false);
  const onBeforeGetContentResolve = React.useRef(null);
  // const [selectedCheckedAll, setSelectedCheckedAll] = useState(false);
  // const [filteredData, setFilteredData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [designWiseData, setDesignWiseData] = useState([]);

  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    NavbarSetting("Production", dispatch);
  }, []);
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

  useEffect(() => {
    if (designSearch) {
      checkAndTransfer();
    }
  }, [designSearch]);

  useEffect(() => {
    if (selectedLotId) {
      getAddToLotListing();
    }
  }, [selectedLotId]);

  console.log(Object.keys(printObjMultiLot).length);
  useEffect(() => {
    if (Object.keys(printObjMultiLot).length > 0) {
      console.log("sadfs sadf sssssssss");
      handlePrintMultiLot();
    }
  }, [printObjMultiLot]);

  const handleClose = () => setOpen(false);

  const handleSetPrint = (lot_id) => {
    console.log(lot_id);
    // handlePrintLot(lot_id);
    getSummaryData(lot_id);
    getDesignWiseData(lot_id);
    setOpen(true);
  };

  console.log(isDesignSplit);
  const handleAfterPrintDesign = () => {};

  const handleAfterPrintSummary = () => {
    // Create a new instance of the component
  };
  console.log(printObjMultiLot);
  const handleAfterMultilotPrint = () => {
    const componentInstance = (
      <SplitMultiLotPrint
        ref={componentRefMultiLot}
        printObj={printObjMultiLot}
        from="Split For"
      />
    );
    const containerDiv = document.createElement("div");
    ReactDOM.render(componentInstance, containerDiv);
    const printedContent = containerDiv.innerHTML;
    console.log(printObjMultiLot);
    HtmlPrintAddApi(dispatch, printedContent, [printObjMultiLot]);
    ReactDOM.unmountComponentAtNode(containerDiv);
    containerDiv.remove();
  };
  const handleAfterPrintLot = () => {
    const componentInstance = (
      <IssueToWorkerPrint
        ref={componentRefCreLot}
        printObj={printObjCreLot}
        from="Split For"
      />
    );
    const containerDiv = document.createElement("div");
    ReactDOM.render(componentInstance, containerDiv);
    const printedContent = containerDiv.innerHTML;
    HtmlPrintAddApi(dispatch, printedContent, printObjCreLot);
    ReactDOM.unmountComponentAtNode(containerDiv);
    containerDiv.remove();
    // History.goBack();
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

  const reactToPrintContentSummary = React.useCallback(() => {
    return componentRefSummary.current;
    //eslint-disable-next-line
  }, [componentRefSummary.current]);

  const reactToPrintContentDesign = React.useCallback(() => {
    return componentRefDesign.current;
    //eslint-disable-next-line
  }, [componentRefDesign.current]);

  const reactToPrintContentCreLot = React.useCallback(() => {
    return componentRefCreLot.current;
    //eslint-disable-next-line
  }, [componentRefCreLot.current]);

  const reactToPrintContentMultiLot = React.useCallback(() => {
    return componentRefMultiLot.current;
    //eslint-disable-next-line
  }, [componentRefMultiLot.current]);

  function getDateAndTime() {
    const currentDate = new Date();
    return moment(currentDate).format("DD-MM-YYYY h:mm A");
  }

  const handleLotDesignPrint = useReactToPrint({
    content: reactToPrintContentDesign,
    documentTitle: "Split_Lot_Design_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrintDesign,
    // removeAfterPrint: true
  });

  const handleLotSummaryPrint = useReactToPrint({
    content: reactToPrintContentSummary,
    documentTitle: "Split_Lot_Summary_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrintSummary,
    // removeAfterPrint: true
  });
  const handlePrintMultiLot = useReactToPrint({
    content: reactToPrintContentMultiLot,
    documentTitle: "Split_Multi_Lot_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterMultilotPrint,
    // removeAfterPrint: true
  });

  useEffect(() => {
    if (printObjCreLot.length > 0) {
      handleCreLotPrint();
    }
  }, [printObjCreLot]);

  const handleCreLotPrint = useReactToPrint({
    content: reactToPrintContentCreLot,
    documentTitle: "Split_Lot_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrintLot,
    // removeAfterPrint: true
  });

  function handleChange(e) {
    const isSelected = parseFloat(e.target.value);
    console.log(e.target.value);
    setVoucherPrintType(isSelected);
  }
  function handlePrint() {
    console.log(voucherPrintType);
    if (voucherPrintType === 0) {
      handleLotSummaryPrint();
    } else {
      handleLotDesignPrint();
    }
  }

  const checkAndTransfer = () => {
    if (designArray.length === 1) {
      dispatch(
        Actions.showMessage({
          message: "You can not transfer all design",
          variant: "error",
        })
      );
    } else {
      let transArr = [];
      let filterArr = [];
      designArray.map((item) => {
        if (item.batch_no === designSearch) {
          transArr.push(item);
        } else {
          filterArr.push(item);
        }
      });
      if (transArr.length > 0) {
        setDesignSearch("");
      }
      setDesignArray(filterArr);
      setTransferArray([...transferArray, ...transArr]);
      setSelectedDesignArr([]);
    }
  };

  function getProductData(sData) {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/lot/number/searching?department_id=${department_id}&number=${sData}`
    )
      .then(function (response) {
        if (response.data.success === true && response.data.data.length > 0) {
          setLotApiData(response.data.data);
        } else {
          setLotApiData([]);
          dispatch(Actions.showMessage({ message: "No Lot found" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/production/lot/number/searching?department_id=${department_id}&number=${sData}`,
        });
      });
  }

  function getAddToLotListing() {
    clearData();
    Axios.get(
      Config.getCommonUrl() +
        `api/production/lot/design/group?lot_id=${selectedLotId}&department_id=${department_id}`
    )
      .then(function (response) {
        if (response.data.success) {
          console.log(response.data.data);
          setApiDataArray(response.data.data);
          // const arrData = response.data.data.LotDesigns.map((item) => {
          //   const wgt = parseFloat(
          //     parseFloat(item?.total_stone_pcs) *
          //       parseFloat(item?.total_stone_weight)
          //   ).toFixed(3);
          //   return {
          //     ...item,
          //     grossWgt: wgt,
          //     netWgt: wgt,
          //   };
          // });
          setDesignArray(response.data.data.LotDesigns);
          setSplitFlag(response.data.data.order_info);
        } else {
          setApiDataArray({});
          setDesignArray([]);
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
          api: `api/production/lot/design/group?lot_id=${selectedLotId}&department_id=${department_id}`,
        });
      });
  }

  const handleLotSelect = (value) => {
    clearData();
    const filteredArray = lotApiData.filter((item) => item.number === value);
    console.log(filteredArray);
    if (filteredArray.length > 0) {
      setSelectedLotNumber(value);
      setSelectedLotId(filteredArray[0].id);
    }
  };

  const handleDesignSelect = (e) => {
    console.log(e.target.value);
    const arrData = [...selectedDesignArr];
    const newValue = JSON.parse(e.target.value);
    let newSelectDesign;
    const isObjectInArray = arrData.some(
      (obj) => JSON.stringify(obj) === e.target.value
    );
    if (isObjectInArray) {
      newSelectDesign = arrData.filter((s) => s.id !== newValue.id);
    } else {
      newSelectDesign = [...arrData, newValue];
    }
    setSelectedDesignArr(newSelectDesign);
  };

  const handleTransfer = () => {
    if (selectedDesignArr.length === 0) {
      dispatch(
        Actions.showMessage({
          message: "Please Select Design",
          variant: "error",
        })
      );
    } else if (designArray.length === selectedDesignArr.length) {
      dispatch(
        Actions.showMessage({
          message: "You can not transfer all design",
          variant: "error",
        })
      );
    } else {
      transferClick();
    }
  };

  const transferClick = () => {
    const filteredMainarr = designArray.filter((mainObj) => {
      // Check if the object is not in selectedDesignArr
      return !selectedDesignArr.some(
        (subObj) => JSON.stringify(subObj) === JSON.stringify(mainObj)
      );
    });
    setDesignArray(filteredMainarr);
    setTransferArray([...transferArray, ...selectedDesignArr]);
    setSelectedDesignArr([]);
  };

  const deleteTransfer = (item) => {
    const remaining = transferArray.filter((s) => s.id !== item.id);
    const designArr = [...designArray];
    designArr.push(item);
    setDesignArray(designArr);
    setTransferArray(remaining);
  };

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "grossWgt") {
      setgrossWgt(value);
      if (isNaN(value)) {
        setgrossWgtErr("Enter valid gross wgt");
      } else {
        setgrossWgtErr("");
      }
    } else if (name === "status") {
      setStatus(value);
    } else if (name === "remark") {
      setRemark(value);
    }
  };

  const validateScanlot = () => {
    if (apiDataArray.length === 0) {
      dispatch(
        Actions.showMessage({ message: "Please Scan Lot", variant: "error" })
      );
      return false;
    }
    return true;
  };

  const validateTransfer = () => {
    if (transferArray.length === 0) {
      dispatch(
        Actions.showMessage({
          message: "Please Transfer Design",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  };

  const validateGross = () => {
    if (grossWgt === "") {
      setgrossWgtErr("Enter gross weight");
      return false;
    }
    return true;
  };

  const validateAddedGross = () => {
    if (
      parseFloat(grossWgt) <
      parseFloat(
        HelperFunc.getTotalOfField(transferArray, "total_stone_weight")
      ).toFixed(3)
    ) {
      dispatch(
        Actions.showMessage({
          message: "Added gross weight must be greater than Stone weight",
        })
      );
      return false;
    }
    return true;
  };

  const createSubLot = (isOnlySave) => {
    if (
      validateScanlot() &&
      validateTransfer() &&
      validateGross() &&
      (isDesignSplit || validateAddedGross())
    ) {
      if (!isDesignSplit) {
        createSubLotApi(isOnlySave);
      } else {
        createMultieLotApi(isOnlySave);
      }
    }
  };

  const createMultieLotApi = (isOnlySave) => {
    const designIds = transferArray.map((item) => {
      return {
        design_id: item.design_id,
      };
    });
    const body = {
      lot_id: apiDataArray.id,
      number: apiDataArray.number,
      design_arr: designIds,
      department_id: department_id,
      status: status,
      remark: remark,
    };
    Axios.post(
      Config.getCommonUrl() + "api/production/splitLot/design/wise",
      body
    )
      .then(function (response) {
        dispatch(Actions.showMessage({ message: response.data.message }));
        if (response.data.success) {
          const apiData = response.data.PrintData;
          // setCreatedLot([...createdLot, ...apiData.NewLotData]);
          const newData = apiData.NewLotData;
          console.log(newData);
          setCreatedLot((prevState) => [...prevState, ...newData]);
          if (isOnlySave === 0) {
            console.log("multilotprint");
            setPrintObjMultiLot(apiData);
          }
        }
        setTransferArray([]);
        setgrossWgt("");
        setStatus("");
        setRemark("");
        setIsDesignSplit(false);
        dispatch(
          Actions.showMessage({
            message: response.data.message,
            variant: "success",
          })
        );
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/production/splitLot/design/wise",
          body,
        });
      });
  };
  const createSubLotApi = (isOnlySave) => {
    console.log(isOnlySave);
    const designIds = transferArray.map((item) => {
      return {
        design_id: item.design_id,
      };
    });
    const body = {
      lot_id: apiDataArray.id,
      number: apiDataArray.number,
      design_arr: designIds,
      department_id: department_id,
      category_ids: apiDataArray.product_category_id,
      stock_code_id: apiDataArray.stock_name_code_id,
      gross_weight: grossWgt,
      status: status,
      remark: remark,
    };
    Axios.post(Config.getCommonUrl() + "api/production/splitLot", body)
      .then(function (response) {
        dispatch(Actions.showMessage({ message: response.data.message }));
        if (response.data.success) {
          const apiData = response.data.data;
          setCreatedLot([...createdLot, apiData]);
          if (isOnlySave === 0) {
            handleCreateLotPrint(apiData.lot_id, apiData.activityNumber);
          }
        }
        setTransferArray([]);
        setgrossWgt("");
        setStatus("");
        setRemark("");
        setIsDesignSplit(false);

        dispatch(
          Actions.showMessage({
            message: response.data.message,
            variant: "success",
          })
        );
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/production/splitLot",
          body,
        });
      });
  };
  function clearData() {
    setApiDataArray({});
    setSelectedLotNumber("");
    setSelectedLotId("");
    setDesignArray([]);
    setTransferArray([]);
    setCreatedLot([]);
    setRemark("");
    setStatus("");
    setgrossWgt("");
    setSplitFlag(0);
    setSelectedDesignArr([]);
    setIsDesignSplit(false);
  }

  function handleCreateLotPrint(lotId, actNumber) {
    const body = {
      lot_id: lotId,
      activityNumber: actNumber,
    };
    Axios.post(
      Config.getCommonUrl() + `api/productionPrintVoucher/split/lot/print`,
      body
    )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setModalOpen(false);
          setPrintObjCreLot([response.data.data]);
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
          api: `api/productionPrintVoucher/split/lot/print`,
          body,
        });
      });
  }

  function handlePrintLot(lot_id, actNumber) {
    Axios.get(
      Config.getCommonUrl() +
        `api/productionPrintVoucher/planAndlot/${lot_id}/${actNumber}`
    )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setModalOpen(false);
          setPrintObj(response.data.data);
          setPrintObjMultiple(response.data.MultipleData);
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
          api: `api/productionPrintVoucher/planAndlot/${lot_id}`,
        });
      });
  }
  function getSummaryData(lotId) {
    // setPrintLoading(true);
    setSummaryData([]);
    const body = {
      lot_id: lotId,
    };
    Axios.post(
      Config.getCommonUrl() + `api/productionPrintVoucher/split/lot/summary`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          if (response.data.data) {
            console.log(response.data.data);
            setSummaryData([response.data.data]);
            // handleLotSummaryPrint();
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        // setPrintLoading(false);
      })
      .catch((error) => {
        // setPrintLoading(false);
        handleError(error, dispatch, {
          api: `api/productionPrintVoucher/split/lot/summary`,
          body,
        });
      });
  }

  function getDesignWiseData(lotId) {
    // setPrintLoading(true);
    setDesignWiseData([]);
    const body = {
      lot_id: lotId,
    };
    Axios.post(
      Config.getCommonUrl() + `api/productionPrintVoucher/split/lot/batch/wise`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          if (response.data.data) {
            console.log(response.data.data);
            setDesignWiseData(response.data.data);
            // handleDesignWisePrint();
            // handleDesignWisePrint();
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        // setPrintLoading(false);
      })
      .catch((error) => {
        // setPrintLoading(false);
        handleError(error, dispatch, {
          api: `api/productionPrintVoucher/split/lot/batch/wise`,
          body,
        });
      });
  }

  const handleCheckIsSplit = (e) => {
    console.log(e.target.checked);
    const { checked } = e.target;
    setIsDesignSplit(checked);
    if (checked) {
      setgrossWgt(0);
      setgrossWgtErr("");
    } else {
      setgrossWgt("");
    }
  };

  const handleSelectAll = (e) => {
    console.log(e.target.checked);
    if (e.target.checked === false) {
      setSelectedDesignArr([]);
      // setSelectedCheckedAll(false);
    } else {
      // setSelectedCheckedAll(true);
      setSelectedDesignArr(designArray);
    }
  };

  return (
    <>
      <Box className={classes.model} style={{ overflowY: "auto" }}>
        <Grid container className={classes.modalContainer}>
          <Grid item xs={12} sm={4} md={3} key="1">
            <FuseAnimate delay={300}>
              <Typography className="pl-28 pb-16 pt-16 text-18 font-700">
                Split
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
              <Grid item xs={12} style={{ marginBottom: 16 }}>
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
              </Grid>
              <Grid item xs={12} style={{ marginBottom: 16 }}>
                <TableContainer className={classes.scroll}>
                  <Table
                    className={`${classes.table}`}
                    style={{ minWidth: "900px" }}
                  >
                    <TableHead className={classes.tablehead}>
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          width="130px"
                        >
                          Lot Number
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          width="140px"
                        >
                          Lot Category
                        </TableCell>
                        <TableCell className={classes.tableRowPad} width="70px">
                          Purity
                        </TableCell>
                        <TableCell className={classes.tableRowPad} width="90px">
                          Lot Pcs
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          width="100px"
                        >
                          Stone Pcs
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          width="130px"
                        >
                          Gross Weight
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          width="130px"
                        >
                          Stone Weight
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          width="120px"
                        >
                          Net Weight
                        </TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* {console.log(apiDataArray)} */}
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
                            {apiDataArray?.number}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {apiDataArray?.LotProductCategory?.category_name}
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
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box style={{ marginBottom: 16 }}>
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        style={{ padding: 10, background: "#e3e3e3" }}
                      >
                        <Grid item>
                          <Typography style={{ fontWeight: 700 }}>
                            Item of Lot(
                            <span>
                              {HelperFunc.getTotalOfFieldNoDecimal(
                                designArray,
                                "design_pcs"
                              )}
                              Pcs
                            </span>
                            )
                          </Typography>
                        </Grid>
                        <Grid item>
                          <TextField
                            variant="outlined"
                            placeholder="Scan / Search"
                            value={designSearch}
                            onChange={(e) => setDesignSearch(e.target.value)}
                          />
                        </Grid>
                      </Grid>
                      <TableContainer
                        className={classes.scroll}
                        style={{ maxHeight: 400, overflowY: "auto" }}
                      >
                        <Table className={classes.addStockTableContainer}>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                                width="50px"
                              >
                                <Checkbox
                                  style={{ color: "#415BD4", padding: 0 }}
                                  color="primary"
                                  checked={
                                    designArray.length !== 0 &&
                                    designArray.length ===
                                      selectedDesignArr.length
                                  }
                                  onChange={handleSelectAll}
                                />
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                width="110px"
                              >
                                Design No
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                width="130px"
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
                                className={classes.tableRowPad}
                                width="80px"
                              >
                                Net Weight
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {designArray.length === 0 ? (
                              <TableRow>
                                <TableCell
                                  className={classes.tableRowPad}
                                  align="center"
                                  colSpan={8}
                                >
                                  <div style={{ textAlign: "center" }}>
                                    No Data
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              designArray
                                .filter(
                                  (temp) =>
                                    temp?.LotDesignData?.variant_number
                                      .toString()
                                      .toLowerCase()
                                      .includes(designSearch.toLowerCase()) ||
                                    temp?.batch_no
                                      .toString()
                                      .toLowerCase()
                                      .includes(designSearch.toLowerCase()) ||
                                    temp?.design_pcs
                                      .toString()
                                      .toLowerCase()
                                      .includes(designSearch.toLowerCase()) ||
                                    temp?.total_stone_pcs
                                      .toString()
                                      .toLowerCase()
                                      .includes(designSearch.toLowerCase()) ||
                                    temp?.total_stone_weight
                                      .toString()
                                      .toLowerCase()
                                      .includes(designSearch.toLowerCase()) ||
                                    temp?.total_gross_weight
                                      .toString()
                                      .toLowerCase()
                                      .includes(designSearch.toLowerCase()) ||
                                    temp?.total_net_weight
                                      .toString()
                                      .toLowerCase()
                                      .includes(designSearch.toLowerCase())
                                )
                                .map((item, i) => {
                                  console.log(item);
                                  return (
                                    <TableRow key={i}>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        <Checkbox
                                          style={{
                                            padding: 0,
                                            color: "#415bd4",
                                          }}
                                          color="primary"
                                          checked={
                                            selectedDesignArr.some(
                                              (obj) =>
                                                JSON.stringify(obj) ===
                                                JSON.stringify(item)
                                            )
                                              ? true
                                              : false
                                          }
                                          onChange={handleDesignSelect}
                                          value={JSON.stringify(item)}
                                        />
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item?.LotDesignData?.variant_number}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item?.batch_no}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item?.design_pcs}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item?.total_stone_pcs *
                                          item?.design_pcs}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.total_gross_weight}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item?.total_stone_weight}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.total_net_weight}
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
                                    designArray,
                                    "design_pcs"
                                  )}
                                </b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <b>
                                  {parseInt(
                                    HelperFunc.getTotalOfMultipliedFields(
                                      designArray,
                                      "total_stone_pcs",
                                      "design_pcs"
                                    )
                                  )}
                                </b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <b>
                                  {parseFloat(
                                    HelperFunc.getTotalOfFieldNoDecimal(
                                      designArray,
                                      "total_gross_weight"
                                    )
                                  ).toFixed(3)}
                                </b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <b>
                                  {parseFloat(
                                    HelperFunc.getTotalOfField(
                                      designArray,
                                      "total_stone_weight"
                                    )
                                  ).toFixed(3)}
                                </b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <b>
                                  {parseFloat(
                                    HelperFunc.getTotalOfFieldNoDecimal(
                                      designArray,
                                      "total_net_weight"
                                    )
                                  ).toFixed(3)}
                                </b>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                                colSpan={8}
                                align="right"
                              >
                                <Button
                                  variant="contained"
                                  size="small"
                                  style={{
                                    background: "#DFAD08",
                                    color: "#FFFFFF",
                                    textTransform: "capitalize",
                                  }}
                                  // disabled={
                                  //   selectedDesignArr.length === 0 ? true : false
                                  // }
                                  onClick={handleTransfer}
                                >
                                  Transfer
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </TableContainer>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box style={{ marginBottom: 16 }}>
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        style={{ padding: 10, background: "#e3e3e3" }}
                      >
                        <Grid
                          item
                          style={{
                            display: "flex",
                            columnGap: 10,
                            alignItems: "center",
                          }}
                        >
                          <Typography style={{ fontWeight: 700 }}>
                            Selected Items(
                            <span>
                              {HelperFunc.getTotalOfFieldNoDecimal(
                                transferArray,
                                "design_pcs"
                              )}
                              Pcs
                            </span>
                            )
                          </Typography>
                          {splitFlag === 0 && (
                            <div
                              style={{
                                marginLeft: 10,
                                color: "#306ff1",
                                fontWeight: 600,
                              }}
                            >
                              <FormControlLabel
                                label="Design Wise Splitable"
                                control={
                                  <Checkbox
                                    style={{ color: "#306ff1" }}
                                    name="designwisesplitable"
                                    checked={isDesignSplit}
                                    onChange={(e) => handleCheckIsSplit(e)}
                                    // checked={isAccChecked.trading}
                                  />
                                }
                              />
                            </div>
                          )}
                        </Grid>
                        <Grid item>
                          <TextField
                            variant="outlined"
                            placeholder="Scan / Search"
                            value={transferSearch}
                            onChange={(e) => setTransferSearch(e.target.value)}
                          />
                        </Grid>
                      </Grid>
                      <TableContainer
                        className={classes.scroll}
                        style={{ maxHeight: 400, overflowY: "auto" }}
                      >
                        <Table className={classes.addStockTableContainer}>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                                width="40px"
                              ></TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                width="110px"
                              >
                                Design No
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                width="130px"
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
                                className={classes.tableRowPad}
                                width="80px"
                              >
                                Net Weight
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {console.log(designSearch)}
                            {transferArray.length === 0 ? (
                              <TableRow>
                                <TableCell
                                  className={classes.tableRowPad}
                                  align="center"
                                  colSpan={8}
                                >
                                  <div style={{ textAlign: "center" }}>
                                    No Data
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              transferArray
                                .filter((temp) => {
                                  console.log(temp);
                                  return (
                                    temp.LotDesignData.variant_number
                                      .toLowerCase()
                                      .includes(transferSearch.toLowerCase()) ||
                                    temp.batch_no
                                      .toLowerCase()
                                      .includes(transferSearch.toLowerCase()) ||
                                    temp.design_pcs
                                      .toString()
                                      .toLowerCase()
                                      .includes(transferSearch.toLowerCase()) ||
                                    temp.total_stone_pcs
                                      .toString()
                                      .toLowerCase()
                                      .includes(transferSearch.toLowerCase()) ||
                                    temp.total_stone_weight
                                      .toString()
                                      .toLowerCase()
                                      .includes(transferSearch.toLowerCase()) ||
                                    temp.total_gross_weight
                                      .toString()
                                      .toLowerCase()
                                      .includes(transferSearch.toLowerCase()) ||
                                    temp.total_net_weight
                                      .toString()
                                      .toLowerCase()
                                      .includes(transferSearch.toLowerCase())
                                  );
                                })
                                .map((item, i) => (
                                  <TableRow key={i}>
                                    <TableCell className={classes.tableRowPad}>
                                      <IconButton
                                        style={{ padding: "0" }}
                                        tabIndex="-1"
                                        onClick={() => deleteTransfer(item)}
                                      >
                                        <Icon
                                          className=""
                                          style={{ color: "red" }}
                                        >
                                          delete
                                        </Icon>
                                      </IconButton>
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {item?.LotDesignData?.variant_number}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {item?.batch_no}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {item?.design_pcs}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {item?.total_stone_pcs * item?.design_pcs}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {item?.total_gross_weight}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {item?.total_stone_weight}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {item?.total_net_weight}
                                    </TableCell>
                                  </TableRow>
                                ))
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
                                    transferArray,
                                    "design_pcs"
                                  )}
                                </b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <b>
                                  {parseInt(
                                    HelperFunc.getTotalOfMultipliedFields(
                                      transferArray,
                                      "total_stone_pcs",
                                      "design_pcs"
                                    )
                                  )}
                                </b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <b>
                                  {parseFloat(
                                    HelperFunc.getTotalOfFieldNoDecimal(
                                      transferArray,
                                      "total_gross_weight"
                                    )
                                  ).toFixed(3)}
                                </b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <b>
                                  {parseFloat(
                                    HelperFunc.getTotalOfField(
                                      transferArray,
                                      "total_stone_weight"
                                    )
                                  ).toFixed(3)}
                                </b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <b>
                                  {parseFloat(
                                    HelperFunc.getTotalOfField(
                                      transferArray,
                                      "total_net_weight"
                                    )
                                  ).toFixed(3)}
                                </b>
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </TableContainer>
                    </Box>
                    <Grid container spacing={1} style={{ marginBottom: 16 }}>
                      <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Typography style={{ fontWeight: "600" }}>
                          Gross Weight
                        </Typography>
                        <TextField
                          fullWidth
                          id="gross-weight"
                          name="grossWgt"
                          variant="outlined"
                          placeholder="Add Weight"
                          style={{ marginTop: 5 }}
                          value={grossWgt}
                          onChange={handleInputChange}
                          error={grossWgtErr ? true : false}
                          helperText={grossWgtErr}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Typography style={{ fontWeight: "600" }}>
                          Status
                        </Typography>
                        <TextField
                          fullWidth
                          id="status"
                          name="status"
                          placeholder="Verified"
                          variant="outlined"
                          style={{ marginTop: 5 }}
                          value={status}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Typography style={{ fontWeight: "600" }}>
                          Remark
                        </Typography>
                        <TextField
                          fullWidth
                          id="remark"
                          name="remark"
                          variant="outlined"
                          style={{ marginTop: 5 }}
                          value={remark}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginTop: 16,
                        }}
                      >
                        {/* 
                      <Button
                        variant="contained"
                        style={{
                          color: "#FFFFFF",
                          background: "#1FD319",
                          fontWeight: "700",
                          marginRight: 5,
                        }}
                        onClick={handleSetPrint}
                      >
                        Print
                      </Button> 
                      
                      */}

                        <Button
                          id="btn-all-production"
                          variant="contained"
                          style={{
                            color: "#FFFFFF",
                            marginTop: 15,
                            display: "block",
                            marginRight: 15,
                          }}
                          onClick={() => createSubLot(1)}
                        >
                          Create Sub Lot
                        </Button>
                        <Button
                          id="btn-all-production"
                          variant="contained"
                          style={{
                            color: "#FFFFFF",
                            marginTop: 15,
                            display: "block",
                          }}
                          onClick={() => createSubLot(0)}
                        >
                          Create Sub Lot & Print
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ marginBottom: 16 }}>
                <Typography style={{ paddingBlock: 10, fontSize: 18 }}>
                  Created Lot
                </Typography>
                <TableContainer
                  className={classes.scroll}
                  style={{ maxHeight: 400, overflowY: "auto" }}
                >
                  <Table
                    className={`${classes.table}`}
                    style={{ minWidth: "900px" }}
                  >
                    <TableHead className={classes.tablehead}>
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          width="160px"
                        >
                          Lot Number
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          width="170px"
                        >
                          Lot Category
                        </TableCell>
                        <TableCell className={classes.tableRowPad} width="70px">
                          Purity
                        </TableCell>
                        <TableCell className={classes.tableRowPad} width="90px">
                          Lot Pcs
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          width="100px"
                        >
                          Stone Pcs
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          width="130px"
                        >
                          Gross Weight
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          width="130px"
                        >
                          Stone Weight
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          width="120px"
                        >
                          Net Weight
                        </TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {createdLot.length === 0 ? (
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
                        createdLot.map((item, i) => {
                          console.log(item);
                          return (
                            <TableRow key={i}>
                              <TableCell className={classes.tableRowPad}>
                                {item?.lot_number}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.lot_category}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.purity}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.Lot_pcs}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.stone_pcs}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.gross_weight}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.stone_weight}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.net_weight}
                              </TableCell>

                              <TableCell>
                                <Grid
                                  item
                                  xs={12}
                                  style={{
                                    display: "flex",
                                  }}
                                >
                                  <Button
                                    variant="contained"
                                    style={{
                                      color: "#FFFFFF",
                                      background: "#1FD319",
                                      fontWeight: "700",
                                      marginRight: 5,
                                    }}
                                    onClick={() => handleSetPrint(item.lot_id)}
                                  >
                                    Print
                                  </Button>
                                </Grid>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid
                item
                xs={12}
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                {/* <Button
                onClick={handlePrint}
                style={{
                  fontWeight: "700",
                  color: "#FFFFFF",
                  background: "#1FD319",
                  marginRight: 10,
                }}
              >
                Print
              </Button> */}

                {/* <Button
                style={{
                  fontWeight: "700",
                  color: "#FFFFFF",
                  background: "#1FD319",
                }}
              >
                Save
              </Button> */}
              </Grid>
            </Grid>
          </Box>

          <div>
            <Modal open={open} onClose={handleClose} className={classes.modal}>
              <div style={{ width: 500, background: "#FFFFFF" }}>
                <Typography
                  variant="h6"
                  className={classes.title}
                  style={{ textAlign: "center", position: "relative" }}
                >
                  Voucher Format
                  <IconButton
                    style={{
                      padding: "0",
                      position: "absolute",
                      right: "5px",
                      top: "16px",
                      fontSize: "22px",
                    }}
                    onClick={handleClose}
                  >
                    <Icon className="mr-8" style={{ color: "#ffffff" }}>
                      close
                    </Icon>
                  </IconButton>
                </Typography>
                <Grid container className={classes.modalBody} spacing={2}>
                  <FormControl>
                    <RadioGroup
                      className="packingslip-table-main"
                      // defaultValue={0}
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={voucherPrintType}
                      onChange={(e) => handleChange(e)}
                    >
                      <FormControlLabel
                        value={0}
                        control={<Radio />}
                        label="Lot Summary"
                      />
                      <FormControlLabel
                        value={1}
                        control={<Radio />}
                        label="Lot Design"
                      />
                    </RadioGroup>
                  </FormControl>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      className={classes.actionBtn}
                      onClick={handlePrint}
                    >
                      Print
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Modal>
          </div>
          <div style={{ display: "none" }}>
            <DesignWisePrint
              ref={componentRefDesign}
              designWiseData={designWiseData}
            />
          </div>

          <div style={{ display: "none" }}>
            <LotSummaryPrint
              ref={componentRefSummary}
              summaryData={summaryData}
            />
          </div>

          <div style={{ display: "none" }}>
            <IssueToWorkerPrint
              ref={componentRefCreLot}
              printObj={printObjCreLot}
              from="Split For"
            />
          </div>

          <div style={{ display: "none" }}>
            <SplitMultiLotPrint
              ref={componentRefMultiLot}
              printObj={printObjMultiLot}
              from="Split For"
            />
          </div>
        </div>
      </Box>
    </>
  );
};

export default Split;

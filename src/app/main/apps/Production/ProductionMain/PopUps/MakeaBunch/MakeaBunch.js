import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/styles";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  List,
  ListItem,
  Modal,
  Radio,
  RadioGroup,
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
import { KeyboardBackspace } from "@material-ui/icons";
import History from "@history";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { set } from "lodash";
import { useReactToPrint } from "react-to-print";
import { DesignWisePrint } from "../../ProductionComp/MakeABunchPrint/DesignWisePrint";
import { LotSummaryPrint } from "../../ProductionComp/MakeABunchPrint/LotSummaryPrint";
import moment from "moment";
import Select, { createFilter } from "react-select";
import clsx from "clsx";
import Loader from "app/main/Loader/Loader";
import ReactDOM from "react-dom";
import { HtmlPrintAddApi } from "../../Helper/HtmlPrintAdd";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles(() => ({
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

const MakeaBunch = (props) => {
  console.log(props.history.location.state?.data);
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const [loading, setLoading] = useState(false);
  const [printLoading, setPrintLoading] = useState(false);
  const [apiDataArray, setApiDataArray] = useState([]);
  const [stockCodeList, setStockCodeList] = useState([]);
  const [bunchcategory, setBunchcategory] = useState("");
  const [bunchquantity, setBunchquantity] = useState("");
  const [bunchdesign, setBunchdesign] = useState("");
  const [bunchstone, setBunchstone] = useState("");
  const [notAvlStone, setNotAvlStone] = useState([]);
  const [batchno, setBatchno] = useState("");
  console.log(notAvlStone);

  const [bunchNumber, setBunchNumber] = useState("");
  const [selectedBunchNumber, setSelectedBunchNumber] = useState("");
  const [bunchApiData, setBunchApiData] = useState([]);
  const [isCodeVisible, setCodeVisible] = useState(false);
  const [isValidStockDisable, setIsValidStockDisable] = useState(false);

  const [isView, setIsView] = useState(false); //for view Only
  const [typeOfSettingList, setTypeOfSettingList] = useState([]);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [typeofSetting, setTypeofSetting] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [designWiseData, setDesignWiseData] = useState([]);
  const [ismackeabunch, setIsmackeabunch] = useState(1);
  const [processName, setProcessName] = useState("");
  const [processList, setProcessList] = useState([]);
  const [lotidno, setLotidno] = useState("");
  const [voucherPrintType, setVoucherPrintType] = useState(0);
  const [selectedDesign, setSelectedDesign] = useState([]);
  const [selectedArray, setSelectedArray] = useState([]);
  const [activityNumber, setActivityNumber] = useState("");
  const [toalSelectedStone, setToalSelectedStone] = useState("");
  const [open, setOpen] = useState(false);

  const componentRefDesign = React.useRef(null);
  const componentRefSummary = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);

  const reactToPrintContentSummary = React.useCallback(() => {
    return componentRefSummary.current;
    //eslint-disable-next-line
  }, [componentRefSummary.current]);

  const reactToPrintContentDesign = React.useCallback(() => {
    return componentRefDesign.current;
    //eslint-disable-next-line
  }, [componentRefDesign.current]);

  const handleOnBeforeGetContent = React.useCallback(() => {
    console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        resolve();
      }, 10);
    });
  }, []);

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

  const handleAfterPrint = () => {
    //React.useCallback
    console.log("`onAfterPrint` called", isView); // tslint:disable-line no-console
    //resetting after print
    checkAndReset();
  };

  function checkAndReset() {
    if (isView === false) {
      console.log("cond true", isView);
      // History.goBack();
      // setVoucherDate(moment().format("YYYY-MM-DD"));
    }
  }

  function getDateAndTime() {
    const currentDate = new Date();
    return moment(currentDate).format("DD-MM-YYYY h:mm A");
  }

  const handleDesignWisePrint = useReactToPrint({
    content: reactToPrintContentDesign,
    documentTitle: "Make_A_Bunch_Lot_Design_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  const handleLotSummaryPrint = useReactToPrint({
    content: reactToPrintContentSummary,
    documentTitle: "Make_A_Bunch_Lot_Summary_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  const HandlePrint = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    clearData();
  }, [window.localStorage.getItem("SelectedDepartment")]);

  // useEffect(() => {
  //   if (loading) {
  //     setTimeout(() => setLoading(false), 7000);
  //   }
  // }, [loading]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (bunchNumber) {
        getProductData(bunchNumber);
      } else {
        setBunchApiData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [bunchNumber]);

  useEffect(() => {
    getStockCode();
    getProcessData();
    getProductData();
    getDroupDown(3);
  }, []);

  useEffect(() => {
    if (bunchNumber) {
      getProductData();
    }
  }, []);

  useEffect(() => {
    if (selectedBunchNumber) {
      getAddToLotListing();
    }
  }, [selectedBunchNumber]);

  console.log(selectedDesign);
  console.log(apiDataArray);
  useEffect(() => {
    let totalAllObjectsValue = 0;

    apiDataArray.forEach((item) => {
      if (selectedDesign.includes(item.LotStockCode[0].design_id)) {
        item.LotStockCode.forEach((obj) => {
          totalAllObjectsValue += obj.pcs * obj.design_pcs;
        });
      }
    });
    setToalSelectedStone(totalAllObjectsValue);
  }, [selectedDesign, apiDataArray]);

  // useEffect(() => {
  //   if (summaryData.length > 0) {
  //     handleActivityLog();
  //   }
  // }, [summaryData]);

  // useEffect(() => {
  //   if (designWiseData.length > 0) {
  //     handleActivityLogDesign();
  //   }
  // }, [designWiseData]);
  const handleActivityLog = (data, actNo) => {
    const componentInstance = (
      <LotSummaryPrint
        // refsummary={componentRefSummary}
        summaryData={data}
      />
    );
    console.log(componentInstance);
    const containerDiv = document.createElement("div");
    ReactDOM.render(componentInstance, containerDiv);
    setTimeout(() => {
      const printedContent = containerDiv.innerHTML;
      console.log("Printed HTML content:", printedContent);
      HtmlPrintAddApi(dispatch, printedContent, [{ activityNumber: actNo }]);
      ReactDOM.unmountComponentAtNode(containerDiv);
      containerDiv.remove();
    }, 0);
  };
  const handleActivityLogDesign = (data, actNo) => {
    const componentInstance = (
      <DesignWisePrint
        // refDesign={componentRefDesign}
        designWiseData={data}
      />
    );
    console.log(componentInstance);
    const containerDiv = document.createElement("div");
    ReactDOM.render(componentInstance, containerDiv);
    setTimeout(() => {
      const printedContent = containerDiv.innerHTML;
      console.log("Printed HTML content:", printedContent);
      HtmlPrintAddApi(
        dispatch,
        printedContent,
        [{ activityNumber: actNo }],
        "print_html_two"
      );
      ReactDOM.unmountComponentAtNode(containerDiv);
      containerDiv.remove();
    }, 0);
  };

  const handleFieldChange = (value) => {
    console.log(value);
    setProcessName(value);
    // setSelectedProcessNameErr("");
  };

  const validHandle = () => {
    if (selectedDesign.length === 0) {
      dispatch(
        Actions.showMessage({
          message: "Plz Select Design",
          variant: "error",
        })
      );
    } else {
      getAddToBunchListing(typeofSetting.value);
    }
  };

  const savehandle = (saveFlag) => {
    getAddToBunchListing(typeofSetting.value, saveFlag);
    // clearData();
  };

  function getAddToBunchListing(settingType, saveFlag) {
    console.log(saveFlag);
    setLoading(true);
    const updatedDesign = selectedDesign.map((item) => ({ design_id: item }));
    const body = {
      is_save: saveFlag ? saveFlag : 0,
      lot_id: lotidno,
      department_id: parseFloat(
        window.localStorage.getItem("SelectedDepartment")
      ),
      setting_id: settingType,
      process_id: processName.value,
      design_Array: updatedDesign,
    };
    console.log(processName.value);
    Axios.post(Config.getCommonUrl() + `api/production/make/bunch/lot`, body)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log(response.data);
          setIsmackeabunch(response.data.lotDetails.is_make_bunch);
          setNotAvlStone(response.data.NotValidateStock);
          console.log(response.data.groupedByDesign);
          if (saveFlag !== 1) {
            if (response.data.NotValidateStock.length !== 0) {
              setCodeVisible(true);
            } else {
              setCodeVisible(false);
              setIsValidStockDisable(true);
              dispatch(
                Actions.showMessage({
                  message: "Stock is Validate",
                  variant: "success",
                })
              );
            }
          }
          if (saveFlag === 1) {
            getSummaryData(settingType, false, response.data.activity_number);
            getDesignWiseData(
              settingType,
              false,
              response.data.activity_number
            );
            setActivityNumber(response.data.activity_number);
            // handleActivityLog(response.data.activity_number)
            dispatch(
              Actions.showMessage({
                message: response.data.message,
                variant: "success",
              })
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
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/production/make/bunch/lot`,
          body: body,
        });
      });
  }

  function getBunchListing(settingType) {
    setLoading(true);
    const body = {
      lot_id: lotidno,
      department_id: parseFloat(
        window.localStorage.getItem("SelectedDepartment")
      ),
      setting_id: settingType,
    };
    console.log(processName.value);
    Axios.post(
      Config.getCommonUrl() + `api/production/make/bunch/lot/check/design`,
      body
    )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log(response.data);
          setBunchcategory(response.data.lotDetails.ProductCategory);
          setBunchquantity(response.data.lotDetails.NoOfPcs);
          setBunchdesign(response.data.lotDetails.NoOfDesignPcs);
          setIsmackeabunch(response.data.lotDetails.is_make_bunch);
          setBunchstone(response.data.lotDetails.NoOfStone);
          // setNotAvlStone(response.data.NotValidateStock);
          setApiDataArray(response.data.groupedByDesign);
          console.log(response.data.groupedByDesign);
          // if (saveFlag === 1) {
          //   dispatch(
          //     Actions.showMessage({
          //       message: response.data.message,
          //       variant: "success",
          //     })
          //   );
          // }
        } else {
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
        handleError(error, dispatch, {
          api: `api/production/make/bunch/lot/check/design`,
          body: body,
        });
      });
  }

  function getProductData(sData) {
    console.log(sData);
    Axios.get(
      Config.getCommonUrl() +
        `api/production/lot/number/searching?department_id=${window.localStorage.getItem(
          "SelectedDepartment"
        )}&number=${sData}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let responseData = response.data.data;
          if (responseData.length > 0) {
            console.log(response.data);
            setBunchApiData(responseData);
          } else {
            setBunchApiData([]);
          }
        } else {
          setBunchApiData([]);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "retailerProduct/api/mortage/search/product",
        });
      });
  }
  function getProcessData(id) {
    console.log(id);
    Axios.get(Config.getCommonUrl() + "api/process")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProcessList(response.data.data);
          setProcessName({
            value: response.data.data[0].id,
            label: response.data.data[0].process_name,
          });
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/process" });
      });
  }

  function getStockCode() {
    Axios.get(Config.getCommonUrl() + "api/stockname/metal")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockCodeList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/stockname/metal" });
      });
  }

  function getAddToLotListing() {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/make/bunch/listing?lot_id=${lotidno}&department_id=${parseFloat(
          window.localStorage.getItem("SelectedDepartment")
        )}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          if (response.data.data) {
            console.log(response.data.data);
            const availableTypesOfSettingTypes =
              response.data.data.LotDesigns.map(
                (item) => item.type_of_setting_id
              );
            console.log(availableTypesOfSettingTypes);
            setAvailableTypes(availableTypesOfSettingTypes);
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
          api: `api/production/lot/number`,
        });
      });
  }

  function getDroupDown(flag) {
    Axios.get(Config.getCommonUrl() + `api/designDropDown?flag=${flag}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          console.log(response.data.data);
          const arrData = response.data.data;
          //   if (flag === 1) {
          //       setSettingMehodList(arrData)
          //   } else
          // if (flag === 2) {
          //   setBaggingList(arrData);
          // } else
          if (flag === 3) {
            setTypeOfSettingList(arrData);
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        console.log(error);
        handleError(error, dispatch, {
          api: `api/designDropDown?flag=${flag}`,
        });
      });
  }

  function getSummaryData(settingType, isPrint, actNo) {
    setPrintLoading(true);
    setSummaryData([]);
    const updatedDesign = selectedDesign.map((item) => ({ design_id: item }));
    const body = {
      lot_id: lotidno,
      type_of_setting_id: settingType,
      design_Array: updatedDesign,
    };
    Axios.post(
      Config.getCommonUrl() + `api/productionPrintVoucher/make/bunch/summery`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          if (response.data.data) {
            console.log(response.data.data);
            setSummaryData([response.data.data]);
            if (isPrint) {
              handleLotSummaryPrint();
            } else {
              handleActivityLog([response.data.data], actNo);
            }
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        setPrintLoading(false);
      })
      .catch((error) => {
        setPrintLoading(false);
        handleError(error, dispatch, {
          api: `api/productionPrintVoucher/make/bunch/summery`,
          body,
        });
      });
  }

  function getDesignWiseData(settingType, isPrint, actNo) {
    setPrintLoading(true);
    setDesignWiseData([]);
    const updatedDesign = selectedDesign.map((item) => ({ design_id: item }));
    const body = {
      lot_id: lotidno,
      type_of_setting_id: settingType,
      design_Array: updatedDesign,
    };
    Axios.post(
      Config.getCommonUrl() +
        `api/productionPrintVoucher/make/bunch/summery/batch/number`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          if (response.data.data) {
            console.log(response.data.data);
            setDesignWiseData(response.data.data);
            if (isPrint) {
              handleDesignWisePrint();
            } else {
              handleActivityLogDesign(response.data.data, actNo);
            }
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
        setPrintLoading(false);
      })
      .catch((error) => {
        setPrintLoading(false);
        handleError(error, dispatch, {
          api: `api/productionPrintVoucher/make/bunch/summery/batch/number`,
          body,
        });
      });
  }

  function clearData() {
    setBunchcategory("");
    setBunchquantity("");
    setBunchdesign("");
    setBunchstone("");
    setApiDataArray([]);
    setBunchApiData([]);
    setBunchNumber("");
    setSelectedBunchNumber("");
    setNotAvlStone([]);
    setTypeofSetting([]);
  }

  function clearDatatwo() {
    setBunchcategory("");
    setBunchquantity("");
    setBunchdesign("");
    setBunchstone("");
    setApiDataArray([]);
    // setBunchApiData([]);
    // setBunchNumber("");
    // setSelectedBunchNumber("");
    setNotAvlStone([]);
    setTypeofSetting([]);
  }
  const handleSecoundSelect = (stock) => {
    setSelectedDesign([]);
    setSelectedArray([]);
    console.log(stock);
    const settingType = stock.value;
    setTypeofSetting(stock);
    // getAddToBunchListing(settingType);
    getBunchListing(settingType);
    setCodeVisible(false);
    setIsValidStockDisable(false);
  };

  let handleBunchSelect = (value) => {
    clearDatatwo();
    console.log("innnn", value);
    console.log(bunchApiData);
    let filteredArray = bunchApiData.filter((item) => item.number === value);
    console.log(filteredArray);
    console.log(filteredArray);
    if (filteredArray.length > 0) {
      setLotidno(filteredArray[0].id);
      setBunchApiData(filteredArray);
      setBunchNumber(value);
      setSelectedBunchNumber(value);
      // setCodeVisible(false);
    }
  };

  function handleChange(e) {
    const isSelected = parseFloat(e.target.value);
    console.log(e.target.value);
    setVoucherPrintType(isSelected);
  }
  function voucherprint() {
    const settingType = typeofSetting.value;
    console.log(voucherPrintType);
    if (voucherPrintType === 0) {
      getDesignWiseData(settingType, true);
      // handleDesignWisePrint();
    } else {
      getSummaryData(settingType, true);
      // handleLotSummaryPrint();
    }
  }

  const RemaingStone = (item) => {
    if (item?.available_pcs - item?.pcs < 0) {
      return 0;
    } else {
      return item?.available_pcs - item?.pcs * item.design_pcs;
    }
  };
  const handleSelectedDesign = (obj) => {
    setIsValidStockDisable(false);
    console.log(obj);
    if (selectedDesign.includes(obj.LotStockCode[0].design_id)) {
      const updatedArray = selectedDesign.filter(
        (item) => item !== obj.LotStockCode[0].design_id
      );
      const updatedObj = selectedArray.filter(
        (item) => item.tree_number !== obj.LotStockCode[0].design_id
      );
      // const updateExportTagedData = exportTagedData.filter(
      //   (item) => item.NAME !== obj.NAME
      // );
      setSelectedDesign(updatedArray);
      setSelectedArray(updatedObj);
      // setExportTagedData(updateExportTagedData);
    } else {
      const updateBarcodeData = [
        ...selectedDesign,
        obj.LotStockCode[0].design_id,
      ];
      const updateBarcodeObj = [...selectedArray, obj];
      // const updateExportTagedData = [...exportTagedData, obj];

      setSelectedDesign(updateBarcodeData);
      setSelectedArray(updateBarcodeObj);
      // setExportTagedData(updateExportTagedData);
    }
  };
  console.log(apiDataArray);
  const handleSelectAll = () => {
    if (
      selectedDesign.length ===
      apiDataArray.filter((data) => data.LotStockCode[0].is_make_bunch !== 1)
        .length
    ) {
      // If all rows are selected, unselect all
      setSelectedDesign([]);
      setSelectedArray([]);
      // setExportTagedData([]);
    } else {
      // Otherwise, select all rows
      const allRowNames = apiDataArray
        .filter((data) => data.LotStockCode[0].is_make_bunch !== 1)
        .map((data) => data.LotStockCode[0].design_id);
      setSelectedDesign(allRowNames);
      setSelectedArray(apiDataArray);
      // setExportTagedData(apiData);
    }
  };

  return (
    <>
      {/* <Modal open={openPopup}> */}
      <Box className={classes.model} style={{ overflowY: "auto" }}>
        <Grid container className={classes.modalContainer}>
          <Grid item xs={12} sm={4} md={3} key="1">
            <FuseAnimate delay={300}>
              <Typography className="pl-28 pb-16 pt-16 text-18 font-700">
                Make a Bunch
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
            <Grid
              item
              className="packing-slip-input"
              style={{ marginBottom: 16 }}
            >
              <Autocomplete
                id="free-solo-demos"
                freeSolo
                disableClearable
                onChange={(event, newValue) => {
                  handleBunchSelect(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  console.log(newInputValue);
                  if (event !== null) {
                    if (event.type === "change") setBunchNumber(newInputValue);
                  } else {
                    setBunchNumber("");
                  }
                }}
                value={selectedBunchNumber}
                options={bunchApiData.map((option) => option.number)}
                fullWidth
                style={{ width: 200 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search Lot Number"
                    variant="outlined"
                    autoFocus
                    style={{
                      padding: 0,
                    }}
                  />
                )}
              />
            </Grid>
            {console.log(typeOfSettingList)}
            <Grid style={{ width: "220px", marginLeft: "30px" }}>
              <Select
                filterOption={createFilter({
                  ignoreAccents: false,
                })}
                className={classes.selectBox}
                classes={classes}
                styles={selectStyles}
                options={typeOfSettingList
                  .filter((suggestion) =>
                    availableTypes.includes(suggestion.id)
                  )
                  .map((suggestion) => ({
                    value: suggestion.id,
                    label: suggestion.type,
                  }))}
                value={typeofSetting}
                onChange={(e) => {
                  handleSecoundSelect(e);
                }}
              />
            </Grid>
            <Grid style={{ width: "220px", marginLeft: "30px" }}>
              <Select
                id="heading-select-input"
                classes={clsx(classes, "mb-16")}
                filterOption={createFilter({ ignoreAccents: false })}
                styles={selectStyles}
                value={processName}
                onChange={handleFieldChange}
                optionsProps={{
                  style: {
                    height: "10px",
                    backgroundColor: "red",
                  },
                }}
                options={processList.map((suggestion) => {
                  console.log(suggestion);
                  return {
                    value: suggestion.id,
                    label: suggestion.process_name,
                  };
                })}
                placeholder="Process"
              />
              {/* {selectedProcessNameErr && (
                  <span className={classes.errorMessage}>
                    {selectedProcessNameErr}
                  </span>
                )} */}
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={8}>
                  <Box style={{ display: "flex", paddingBlock: 7, gap: 10 }}>
                    <Typography>
                      Bunch Category :{" "}
                      <span
                        style={{
                          paddingBlock: 2,
                          paddingInline: 5,
                          background: "#e0e0e0",
                          borderRadius: 7,
                          marginLeft: 7,
                        }}
                      >
                        {bunchcategory}
                      </span>
                    </Typography>{" "}
                    <b>|</b>
                    <Typography>
                      QTY :{" "}
                      <span
                        style={{
                          paddingBlock: 2,
                          paddingInline: 5,
                          background: "#e0e0e0",
                          borderRadius: 7,
                          marginLeft: 7,
                        }}
                      >
                        {bunchquantity}
                      </span>
                    </Typography>{" "}
                    <b>|</b>
                    <Typography>
                      No Of Design :{" "}
                      <span
                        style={{
                          paddingBlock: 2,
                          paddingInline: 5,
                          background: "#e0e0e0",
                          borderRadius: 7,
                          marginLeft: 7,
                        }}
                      >
                        {bunchdesign}
                      </span>
                    </Typography>{" "}
                    <b>|</b>
                    {/* <Typography>
                      No of Stone :{" "}
                      <span
                        style={{
                          paddingBlock: 2,
                          paddingInline: 5,
                          background: "#e0e0e0",
                          borderRadius: 7,
                          marginLeft: 7,
                        }}
                      >
                        {bunchstone}
                      </span>
                    </Typography>
                    <b>|</b> */}
                    <Typography>
                      Selected Stone :{" "}
                      <span
                        style={{
                          paddingBlock: 2,
                          paddingInline: 5,
                          background: "#e0e0e0",
                          borderRadius: 7,
                          marginLeft: 7,
                        }}
                      >
                        {toalSelectedStone}
                      </span>
                    </Typography>
                  </Box>
                </Grid>
                <Grid container spacing={2}>
              <Grid item md={12} lg={7}></Grid>
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  columnGap: 10,
                }}
              >
                {console.log(notAvlStone.length)}
                <Button
                  variant="contained"
                  style={{
                    background:
                      ismackeabunch === 1 ||
                      apiDataArray.length === 0 ||
                      isValidStockDisable
                        ? "#ccc"
                        : "#415bd4",
                    color: "#FFFFFF",
                    borderRadius: "7px",
                    fontWeight: "700",
                  }}
                  onClick={validHandle}
                  disabled={
                    ismackeabunch === 1 ||
                    apiDataArray.length === 0 ||
                    isValidStockDisable
                  }
                >
                  Validate Stock
                </Button>
                {console.log(ismackeabunch)}
                <Button
                  variant="contained"
                  style={{
                    background:
                      !isValidStockDisable ||
                      ismackeabunch === 1 ||
                      apiDataArray.length === 0 ||
                      notAvlStone.length !== 0
                        ? "#ccc"
                        : "#415bd4",
                    color: "#FFFFFF",
                    borderRadius: "7px",
                    fontWeight: "700",
                  }}
                  onClick={() => savehandle(1)}
                  disabled={
                    !isValidStockDisable ||
                    ismackeabunch === 1 ||
                    apiDataArray.length === 0 ||
                    notAvlStone.length !== 0
                  }
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  style={{
                    background:
                      ismackeabunch !== 1 ||
                      (apiDataArray.length === 0 && notAvlStone.length === 0)
                        ? "#ccc"
                        : "#415bd4",
                    color: "#FFFFFF",
                  }}
                  onClick={HandlePrint}
                  disabled={
                    ismackeabunch !== 1 ||
                    (apiDataArray.length === 0 && notAvlStone.length === 0)
                  }
                >
                  Print
                </Button>
              </Grid>
            </Grid>
              </Grid>
            </Grid>

            {isCodeVisible && notAvlStone.length !== 0 ? (
              <Grid item xs={12} style={{ marginTop: 16 }}>
                <Box
                  style={{
                    background: "#FF1212",
                    padding: 10,
                    color: "#FFFFFF",
                  }}
                >
                  <Typography style={{ fontWeight: "600", fontSize: "16px" }}>
                    Below stones are not available
                  </Typography>
                  <List className={classes.customList}>
                    {notAvlStone.map((item, index) => {
                      console.log(item);
                      return (
                        <ListItem
                          className={classes.notavAilableList}
                          key={index}
                        >
                          - {item.StockName} - {item.requirePcs}
                        </ListItem>
                      );
                    })}
                  </List>
                </Box>
              </Grid>
            ) : null}
          </Grid>
          <Box style={{ marginBottom: 16 }}>
            {loading && <Loader />}
            <TableContainer className={classes.scroll}>
              <Table className={`${classes.table}`}>
                <TableHead>
                  <TableRow>
                    {ismackeabunch !== 1 && (
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ width: "12px" }}
                      >
                        {apiDataArray.length !== 0 && (
                          <Checkbox
                            style={{ color: "#415BD4", padding: 0 }}
                            color="primary"
                            checked={
                              selectedDesign.length ===
                              apiDataArray.filter(
                                (data) =>
                                  data.LotStockCode[0].is_make_bunch !== 1
                              ).length
                            }
                            onChange={handleSelectAll}
                          />
                        )}
                      </TableCell>
                    )}
                    <TableCell
                      className={classes.tableRowPad}
                      style={{ width: "70px" }}
                    >
                      Design No
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      style={{ width: "50px" }}
                    >
                      Design Pcs
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      style={{ width: "70px" ,textAlign:"center",}}
                    >
                      Stone Details
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      style={{ width: "50px" }}
                    >
                      No of Stone
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      style={{ width: "50px" }}
                    >
                      Stone Weight
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      style={{ width: "70px" }}
                    >
                      Available Stone Qty
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      style={{ width: "70px" }}
                    >
                      Remaing Stone Qty
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      style={{ width: "60px" }}
                    >
                      Setting Type
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {console.log(apiDataArray)}
                  {apiDataArray.length === 0 ? (
                    <TableRow>
                      <TableCell
                        className={classes.tableRowPad}
                        colSpan={8}
                        align="center"
                      >
                        <div style={{textAlign: "center"}}>No Data</div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    apiDataArray.map((data, index) =>
                      data?.LotStockCode.map((item, i) => {
                        return (
                          <TableRow
                            key={i}
                            style={{
                              background:
                                index % 2 === 0 ? "#f4f4f4" : "#ffffff",
                            }}
                          >
                            {i === 0 && (
                              <>
                                {ismackeabunch !== 1 && (
                                  <TableCell
                                    className={classes.tableRowPad}
                                    rowSpan={data.LotStockCode.length}
                                  >
                                    <Checkbox
                                      style={{
                                        color: item.is_make_bunch
                                          ? "#cccccc"
                                          : "#415BD4",
                                        padding: 0,
                                      }}
                                      color="primary"
                                      checked={selectedDesign.includes(
                                        data.LotStockCode[0].design_id
                                      )}
                                      disabled={item.is_make_bunch === 1}
                                      onChange={() =>
                                        handleSelectedDesign(data)
                                      }
                                    />
                                  </TableCell>
                                )}
                                <TableCell
                                  key={index}
                                  className={classes.tableRowPad}
                                  rowSpan={data.LotStockCode.length}
                                >
                                  {data?.variantNumber}
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  rowSpan={data.LotStockCode.length}
                                >
                                  {item?.design_pcs}
                                </TableCell>
                              </>
                            )}
                            <TableCell
                              className={classes.tableRowPad}

                              style={{
                                textAlign:"center",
                                background: i % 2 === 0 ? "#f4f4f4" : "#ffffff",
                              }}
                            >
                              {item?.DesignStockCodes.stock_code}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{
                                background: i % 2 === 0 ? "#f4f4f4" : "#ffffff",
                              }}
                            >
                              {item?.pcs * item.design_pcs}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{
                                background: i % 2 === 0 ? "#f4f4f4" : "#ffffff",
                              }}
                            >
                              {parseFloat(
                                item?.weight * item.design_pcs * item?.pcs
                              ).toFixed(4)}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{
                                background: i % 2 === 0 ? "#f4f4f4" : "#ffffff",
                              }}
                            >
                              {item?.available_pcs}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{
                                background: i % 2 === 0 ? "#f4f4f4" : "#ffffff",
                              }}
                            >
                              {/* {item?.available_pcs - item?.pcs} */}
                              {RemaingStone(item)}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{
                                background: i % 2 === 0 ? "#f4f4f4" : "#ffffff",
                              }}
                            >
                              {item?.TypeOfSettingMaster.type}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>

          {/* </Modal> */}

          <div>
        <Modal open={open} onClose={handleClose} className={classes.modal}>
          <div style={{ width: 500, background: "#FFFFFF" }}>
            {/* {printLoading && <Loader />} */}
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
                  top: "14px",
                }}
                onClick={handleClose}
              >
                <Icon
                  className="mr-8"
                  style={{ color: "#ffffff", fontSize: "32px" }}
                >
                  close
                </Icon>
              </IconButton>
            </Typography>

            <Grid container className={classes.modalBody} spacing={2}>
              <FormControl>
                <RadioGroup
                  className="packingslip-table-main"
                  // defaultValue="design"
                  // defaultValue={1}
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={voucherPrintType}
                  onChange={(e) => handleChange(e)}
                >
                  <FormControlLabel
                    control={<Radio />}
                    label="Design Wise Print"
                    name="voucher"
                    value={0}
                  />
                  <FormControlLabel
                    control={<Radio />}
                    label="Lot Summary Print"
                    name="voucher"
                    value={1}
                  />
                </RadioGroup>
              </FormControl>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  className={classes.actionBtn}
                  onClick={voucherprint}
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
        <LotSummaryPrint ref={componentRefSummary} summaryData={summaryData} />
      </div>
        </div>
      </Box>
    </>
  );
};

export default MakeaBunch;

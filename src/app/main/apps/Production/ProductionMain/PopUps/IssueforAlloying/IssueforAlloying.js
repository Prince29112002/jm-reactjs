import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/styles";
import {
  Box,
  Button,
  Grid,
  Hidden,
  Icon,
  IconButton,
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
import { FuseAnimate } from "@fuse";
// import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import History from "@history";
import { Add, Delete, KeyboardBackspace } from "@material-ui/icons";
import Select, { createFilter } from "react-select";
import Axios from "axios";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Autocomplete from "@material-ui/lab/Autocomplete";
import HelperFunc from "../../../../SalesPurchase/Helper/HelperFunc";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import IssueToWorkerPrint from "../../ProductionComp/IssueToWorkerPrint/IssueToWorkerPrint";
import clsx from "clsx";
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
  setpadding: {
    paddingInline: 8,
    paddingBlock: 4,
    border: "none",
    fontWeight: "700",
  },
  addBtn: {
    display: "block",
    borderRadius: "8px",
    background: "#1E65FD",
    minWidth: "40px",
    maxWidth: "40px",
    display: "grid",
    placeItems: "center",
    marginRight: 0,
    marginBottom: 2,
    marginInline: "auto",
    "&:hover": {
      background: "#1E65FD",
    },
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
  modalBody: {
    padding: 20,
    background: "#F5F5F5",
  },
  actionBtn: {
    background: "#1fd319",
    color: "#FFFFFF",
    width: "100%",
    borderRadius: "10px",
  },
  textfield: {
    width: "100%",
    marginBottom: 15,
  },
  setheight: {},
  placeholder: {
    "&::placeholder": {
      fontWeight: 700,
      color: "#000000",
      opacity: 1,
      fontSize: "16px",
    },
  },
  tablePad: {
    padding: 0,
  },
  tableRowPad: {
    padding: 7,
  },
  issueModal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 999,
    background: "#00000080",
  },
}));

const IssueForAlloying = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const department_id = window.localStorage.getItem("SelectedDepartment");
  const [lotNumberSearch, setLotNumberSearch] = useState("");
  const [selectedLotNumber, setSelectedLotNumber] = useState("");
  const [lotApiData, setLotApiData] = useState([]);
  const [apiDataArray, setApiDataArray] = useState("");

  const [reUseMetalPer, setReUseMetalPer] = useState("");
  const [reUseMetalPerErr, setReUseMetalPerErr] = useState("");
  const [goldVariantList, setGoldVariantList] = useState([]);
  const [availableMetalArr, setAvailableMetalArr] = useState([
    {
      gold_variant: "",
      purity: "",
      available_wgt: "",
      added_wgt: "",
      fine: "",
      error: {},
    },
  ]);
  const [alloyVariantList, setAlloyVariantList] = useState([]);
  const [availableAlloyArr, setAvailableAlloyArr] = useState([
    {
      alloy_variant: "",
      available_wgt: "",
      added_wgt: "",
      is_alloy: 1,
      error: {},
    },
  ]);

  const [oldMetalReq, setOldMetalReq] = useState("");
  const [oldMetalRemaining, setOldMetalRemaining] = useState("");

  const [freshMetalReq, setFreshMetalReq] = useState("");
  const [freshMetalRemaining, setFreshMetalRemaining] = useState("");

  const [goldReqMetal, setGoldReqMetal] = useState("");
  const [fineTotal, setFineTotal] = useState("");

  const [alloyReq, setAlloyReq] = useState("");
  const [alloyReqMetal, setAlloyReqMetal] = useState("");
  const [alloyRemainig, setAlloyRemainig] = useState("");

  const [totalReq, setTotalReq] = useState("");
  const [totalAdded, setTotalAdded] = useState("");
  const [totalRemaining, setTotalRemainig] = useState("");

  const [calculatedPurity, setCalculatedPurity] = useState("");

  const [departmentList, setDepartmentList] = useState([]);
  const [transferDepartmet, setTransferDepartmet] = useState("");
  const [transferDepartmetErr, setTransferDepartmetErr] = useState("");
  const [workstationList, setWorkstationList] = useState([]);
  const [selectedWorkStation, setSelectedWorkStation] = useState("");
  const [selectedWorkStationErr, setSelectedWorkStationErr] = useState("");
  const [processLineList, setProcessLineList] = useState([]);
  const [processList, setProcessList] = useState([]);
  const [processName, setProcessName] = useState("");
  const [processNameErr, setProcessNameErr] = useState("");
  const [remark, setReamark] = useState("");
  const [metalList, setMetallList] = useState([]);
  const [selectedMetal, setSelectedMetal] = useState("");
  const [printObj, setPrintObj] = useState([]);
  const [selectedMetalErr, setSelectedMetalErr] = useState("");
  const [openTransferPopup, setOpenTransferPopup] = useState(false);

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
    // setModalOpen(false);
  };
  function checkAndReset() {
    // if (isView === false) {
    History.goBack();
    // }
  }

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Issue_For_Alloying_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });
  function checkforPrint() {
    handlePrint();
  }

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
    if (selectedLotNumber) {
      getAddToLotListing();
      clearData(true);
    }
  }, [selectedLotNumber]);

  useEffect(() => {
    NavbarSetting("Production", dispatch);
  }, []);

  useEffect(() => {
    getGoldVariantStock();
    getAlloyVariantStock();
    getProcessData();
    departmentData();
    getWorkStation();
  }, []);

  useEffect(() => {
    if (reUseMetalPer && !reUseMetalPerErr) {
      calculateRequiredData();
    }
  }, [reUseMetalPer]);

  useEffect(() => {
    if (availableMetalArr.length > 0 && availableMetalArr[0].added_wgt) {
      let totwgt = 0;
      let oldWgt = 0;
      let freshWgt = 0;
      let fineTot = 0;
      availableMetalArr.map((item) => {
        if (item.added_wgt) {
          totwgt += parseFloat(item.added_wgt);
          fineTot += parseFloat(item.fine);
          if (item.gold_variant.data.stock_name === "Gold Bullion") {
            freshWgt += parseFloat(item.added_wgt);
          } else if (item.gold_variant.data.stock_name === "Gold Metal") {
            oldWgt += parseFloat(item.added_wgt);
          }
        }
      });
      if (oldWgt > 0) {
        const remainingOldMetal = parseFloat(oldWgt) - parseFloat(oldMetalReq);
        setOldMetalRemaining(parseFloat(remainingOldMetal).toFixed(3));
      }
      if (freshWgt > 0) {
        const remainingFreshMetal =
          parseFloat(freshWgt) - parseFloat(freshMetalReq);
        setFreshMetalRemaining(parseFloat(remainingFreshMetal).toFixed(3));
      }
      setGoldReqMetal(totwgt);
      setFineTotal(fineTot);
    }
  }, [availableMetalArr]);

  useEffect(() => {
    if (availableAlloyArr.length > 0 && availableAlloyArr[0].added_wgt) {
      let wgt = 0;
      availableAlloyArr.map((item) => {
        if (item.added_wgt) {
          wgt += parseFloat(item.added_wgt);
        }
      });
      setAlloyReqMetal(wgt);
      setAlloyRemainig(
        parseFloat(parseFloat(alloyReq) - parseFloat(wgt)).toFixed(3)
      );
    }
  }, [availableAlloyArr]);

  useEffect(() => {
    if (oldMetalRemaining || freshMetalRemaining || alloyRemainig) {
      const remOne = oldMetalRemaining ? oldMetalRemaining : 0;
      const remTwo = freshMetalRemaining ? freshMetalRemaining : 0;
      const remThree = alloyRemainig ? alloyRemainig : 0;

      const remainingTotal =
        parseFloat(remOne) + parseFloat(remTwo) + parseFloat(remThree);
      setTotalRemainig(remainingTotal);

      const addOne = alloyReqMetal ? alloyReqMetal : 0;
      const addTwo = goldReqMetal ? goldReqMetal : 0;
      const addedTotal = parseFloat(addOne) + parseFloat(addTwo);
      setTotalAdded(addedTotal);
    }
  }, [oldMetalRemaining, freshMetalRemaining, alloyRemainig]);

  useEffect(() => {
    if (totalAdded && fineTotal) {
      const calPurity = parseFloat(
        (parseFloat(fineTotal) / parseFloat(totalAdded)) * 100
      ).toFixed(2);
      setCalculatedPurity(calPurity);
    }
  }, [totalAdded, fineTotal]);

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  function getLossMetalList(puritys) {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/loose/metalStock?purity=${puritys}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setMetallList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/production/loose/metalStock?purity=${puritys}`,
        });
      });
  }

  function departmentData() {
    Axios.get(Config.getCommonUrl() + "api/department/common/all")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setDepartmentList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/department/common/all" });
      });
  }

  function getWorkStation() {
    Axios.get(Config.getCommonUrl() + "api/workstation")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setWorkstationList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/workstation" });
      });
  }

  function getProcessData() {
    Axios.get(Config.getCommonUrl() + "api/process")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProcessList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/process" });
      });
  }

  function getGoldVariantStock() {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/issue/metalStock?department_id=${department_id}`
    )
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
          api: `api/production/issue/metalStock?department_id=${department_id}`,
        });
      });
  }

  function getAlloyVariantStock() {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/alloy/stock?department_id=${department_id}`
    )
      .then(function (response) {
        if (response.data.success) {
          setAlloyVariantList(response.data.data);
        } else {
          setAlloyVariantList([]);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/production/alloy/stock?department_id=${department_id}`,
        });
      });
  }

  function getProductData(sData) {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/treeNumber/search?department_id=${department_id}&tree_number=${sData}&issue_receive=0`
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
          api: `api/production/treeNumber/search?department_id=${department_id}&tree_number=${sData}&issue_receive=0`,
        });
      });
  }

  useEffect(() => {
    clearData(false);
  }, [department_id]);

  function clearData(isclear) {
    if (!isclear) {
      setLotNumberSearch("");
      setSelectedLotNumber("");
      setLotApiData([]);
      setApiDataArray("");
      setMetallList([]);
      // setGoldVariantList([]);
      // setAlloyVariantList([]);
    }
    setReUseMetalPer("");
    setReUseMetalPerErr("");
    setAvailableMetalArr([
      {
        gold_variant: "",
        purity: "",
        available_wgt: "",
        added_wgt: "",
        fine: "",
        error: {},
      },
    ]);

    setAvailableAlloyArr([
      {
        alloy_variant: "",
        available_wgt: "",
        added_wgt: "",
        is_alloy: 1,
        error: {},
      },
    ]);
    setOldMetalReq("");
    setOldMetalRemaining("");
    setFreshMetalReq("");
    setFreshMetalRemaining("");
    setGoldReqMetal("");
    setFineTotal("");
    setAlloyReq("");
    setAlloyReqMetal("");
    setAlloyRemainig("");
    setTotalReq("");
    setTotalAdded("");
    setTotalRemainig("");
    setCalculatedPurity("");
    setTransferDepartmet("");
    setTransferDepartmetErr("");
    setSelectedWorkStation("");
    setSelectedWorkStationErr("");
    setProcessName("");
    setProcessNameErr("");
    setReamark("");
    setSelectedMetal("");
    setSelectedMetalErr("");
  }

  function getAddToLotListing() {
    const body = {
      tree_number: selectedLotNumber,
      department_id: department_id,
    };
    Axios.post(Config.getCommonUrl() + `api/production/tree/Details`, body)
      .then(function (response) {
        if (response.data.success) {
          console.log(response.data.data);
          const arrData = response.data.data;
          arrData.waxWgt = parseFloat(arrData.WaxWeight).toFixed(3);
          arrData.reqMetalWgt = parseFloat(arrData.requiredMetalWeight).toFixed(
            3
          );
          arrData.reqFine = parseFloat(arrData.requiredMetalFine).toFixed(3);
          getLossMetalList(arrData.purity);
          setApiDataArray(arrData);
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
          api: `api/production/tree/Details`,
        });
      });
  }

  const handleInputPercentage = (e) => {
    const value = e.target.value;
    const percentageRegex = /^([0-9]\d?|100)%?$/;
    setReUseMetalPer(value);
    if (!percentageRegex.test(value)) {
      setReUseMetalPerErr("Enter valid percentage");
    } else {
      setReUseMetalPerErr("");
    }
  };

  const handleLotSelect = (value) => {
    const filteredArray = lotApiData.filter(
      (item) => item.tree_number === value
    );
    if (filteredArray.length > 0) {
      setSelectedLotNumber(value);
    }
  };

  const handleGoldChange = (e, index) => {
    const value = e.data;
    const arrData = [...availableMetalArr];
    arrData[index].gold_variant = e;
    arrData[index].purity = value.stock_name_code.purity;
    arrData[index].available_wgt = value.weight;
    arrData[index].added_wgt = "";
    arrData[index].fine = "";
    arrData[index].error = {};
    setAvailableMetalArr(arrData);
  };

  const handleAlloyChange = (e, index) => {
    const value = e.data;
    const arrData = [...availableAlloyArr];
    arrData[index].alloy_variant = e;
    arrData[index].available_wgt = value.available_stock;
    setAvailableAlloyArr(arrData);
  };

  const validateGoldRow = (index) => {
    if (!availableMetalArr[index].fine) {
      return false;
    }
    return true;
  };

  const validateAlloyRow = (index) => {
    if (!availableMetalArr[index].added_wgt) {
      return false;
    }
    return true;
  };

  const addGoldRow = (index) => {
    if (validateGoldRow(index)) {
      setAvailableMetalArr([
        ...availableMetalArr,
        {
          gold_variant: "",
          purity: "",
          available_wgt: "",
          added_wgt: "",
          fine: "",
          error: {},
        },
      ]);
    }
  };

  const addAlloyRow = (index) => {
    if (validateAlloyRow(index)) {
      setAvailableAlloyArr([
        ...availableAlloyArr,
        {
          alloy_variant: "",
          available_wgt: "",
          added_wgt: "",
          is_alloy: 1,
          error: {},
        },
      ]);
    }
  };

  const deleteGoldRow = (index) => {
    const arrData = [...availableMetalArr];
    if (!arrData[index + 1]) {
      setAvailableMetalArr({
        gold_variant: "",
        purity: "",
        available_wgt: "",
        added_wgt: "",
        fine: "",
        error: {},
      });
    } else {
      const remainingArr = arrData.filter((item, i) => i !== index);
      setAvailableMetalArr(remainingArr);
    }
  };

  const deleteAlloyRow = (index) => {
    const arrData = [...availableAlloyArr];
    if (!arrData[index + 1]) {
      setAvailableAlloyArr({
        alloy_variant: "",
        available_wgt: "",
        added_wgt: "",
        is_alloy: 1,
        error: {},
      });
    } else {
      const remainingArr = arrData.filter((item, i) => i !== index);
      setAvailableAlloyArr(remainingArr);
    }
  };

  const handleInputChangeDepartment = (value) => {
    setTransferDepartmet(value);
    setTransferDepartmetErr("");
  };

  const handleInputChangeStation = (value) => {
    setSelectedWorkStation(value);
    setSelectedWorkStationErr("");
  };

  const handleInputChangeProcess = (value) => {
    setProcessName(value);
    setProcessNameErr("");
  };

  const handleGoldInputChange = (e, index) => {
    const value = e.target.value;
    const arrData = [...availableMetalArr];
    const aWgt = arrData[index].available_wgt
      ? arrData[index].available_wgt
      : 0;
    const numberRegex = /^(?:[0-9]|[1-9][0-9]{0,2})(?:\.[0-9]{1,3})?$/;

    arrData[index].added_wgt = value;
    if (
      isNaN(value) ||
      parseFloat(value) > parseFloat(aWgt) ||
      !value ||
      !numberRegex.test(value)
    ) {
      arrData[index].error.added_wgt = "Enter valid weight";
      arrData[index].fine = 0;
    } else {
      arrData[index].error.added_wgt = "";
      arrData[index].fine = parseFloat(
        (parseFloat(value) * parseFloat(arrData[index].purity)) / 100
      );
    }
    setAvailableMetalArr(arrData);
  };

  const handleAlloyInputChange = (e, index) => {
    const value = e.target.value;
    const arrData = [...availableAlloyArr];

    arrData[index].added_wgt = value;
    if (
      isNaN(value) ||
      parseFloat(value) > parseFloat(arrData[index].available_wgt)
    ) {
      arrData[index].error.added_wgt = "Enter valid weight";
    } else {
      arrData[index].error.added_wgt = "";
    }
    setAvailableAlloyArr(arrData);
  };

  const calculateRequiredData = () => {
    // oldmetalrequired = (Required Metal PG  X  Resuse Metal%) / (Purity / 100)
    const first =
      parseFloat(apiDataArray.reqFine) * parseFloat(reUseMetalPer / 100);
    const second = parseFloat(apiDataArray.purity / 100);
    const oldmetalrequired = parseFloat(
      parseFloat(first) / parseFloat(second)
    ).toFixed(3);
    setOldMetalReq(oldmetalrequired);
    // freshMetalRequired = (Required Metal PG  X ( 100 - Resuse Metal)) / 100
    const freshSecound = parseFloat(100 - parseFloat(reUseMetalPer));
    const freshMetalRequired = parseFloat(
      (parseFloat(apiDataArray.reqFine) * parseFloat(freshSecound)) / 100
    ).toFixed(3);
    setFreshMetalReq(freshMetalRequired);
    // alloyRequired = (Fresh Metal / (Purity / 100)) - Fresh Metal
    const alloyFirst = parseFloat(
      parseFloat(freshMetalRequired) / parseFloat(second)
    );
    const alloyRequired = parseFloat(
      parseFloat(alloyFirst) - parseFloat(freshMetalRequired)
    ).toFixed(3);
    setAlloyReq(alloyRequired);
    // totalRequired = Old Metal + Fresh Metal + Alloy Required
    const totalRequired = parseFloat(
      parseFloat(oldmetalrequired) +
        parseFloat(freshMetalRequired) +
        parseFloat(alloyRequired)
    ).toFixed(3);
    setTotalReq(totalRequired);
  };

  const validatePurity = () => {
    // 0.03%
    const maxPurity = parseFloat(parseFloat(apiDataArray.purity) + 0.02);
    const minPurity = parseFloat(parseFloat(apiDataArray.purity) - 0.02);

    if (
      parseFloat(calculatedPurity) >= parseFloat(minPurity) &&
      parseFloat(calculatedPurity) <= parseFloat(maxPurity)
    ) {
      return true;
    } else {
      dispatch(Actions.showMessage({ message: "Purity ratio does not match" }));
      return false;
    }
  };

  const validateDepartment = () => {
    if (transferDepartmet === "") {
      setTransferDepartmetErr("Select Department");
      return false;
    }
    return true;
  };

  const validateWorkStation = () => {
    if (selectedWorkStation === "") {
      setSelectedWorkStationErr("Select Work station");
      return false;
    }
    return true;
  };

  const validateProcess = () => {
    if (processName === "") {
      setProcessNameErr("Select process name");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validatePurity()) {
      callAddAlloyingApi();
    }
  };

  const handleOpenModal = () => {
    setOpenTransferPopup(true);
  };

  function validateLossMetal() {
    if (!selectedMetal) {
      setSelectedMetalErr("Select Loss metal");
      return false;
    }
    return true;
  }

  function validateTree() {
    if (apiDataArray === "") {
      dispatch(
        Actions.showMessage({ message: "Scan Tree number", variant: "error" })
      );
      return false;
    }
    return true;
  }

  function validateReuseMetal() {
    if (reUseMetalPer === "") {
      setReUseMetalPerErr("Select Loss metal");
      return false;
    }
    return true;
  }

  function validateMetal() {
    const newFormValues = [...availableMetalArr];
    const weightRegex = /^(?:\d{1,4}(?:\.\d{1,4})?|\.\d{1,4}|9999(?:\.9999)?)$/;
    let result = false;
    newFormValues.map((item, i) => {
      if (item.gold_variant) {
        if (!item.gold_variant) {
          newFormValues[i].error.gold_variant = "Select stock";
        } else if (
          !item.added_wgt ||
          weightRegex.test(item.added_wgt) === false ||
          item.added_wgt == 0
        ) {
          newFormValues[i].error.added_wgt = "Enter valid Weight";
        } else {
          result = true;
        }
      }
    });
    setAvailableMetalArr(newFormValues);
    return result;
  }

  function validateAlloyRowAll() {
    const newFormValues = [...availableAlloyArr];
    const weightRegex = /^(?:\d{1,4}(?:\.\d{1,4})?|\.\d{1,4}|9999(?:\.9999)?)$/;
    let results = false;
    newFormValues.map((item, i) => {
      if (item.alloy_variant) {
        if (!item.alloy_variant) {
          newFormValues[i].error.alloy_variant = "Select variant";
        } else if (
          !item.added_wgt ||
          weightRegex.test(item.added_wgt) === false ||
          item.added_wgt == 0
        ) {
          newFormValues[i].error.added_wgt = "Enter valid Weight";
        } else {
          results = true;
        }
      }
    });
    setAvailableAlloyArr(newFormValues);
    return results;
  }

  const handleSaveTransfer = () => {
    if (
      validateTree() &&
      validateLossMetal() &&
      validateReuseMetal() &&
      //  && validateMetal() &&
      // validateAlloyRowAll() &&
      validateWorkStation() &&
      validateDepartment() &&
      validateProcess() &&
      validatePurity()
    ) {
      callAddAlloyingApi();
    }
  };

  const callAddAlloyingApi = () => {
    const arrData = [...availableMetalArr, ...availableAlloyArr];
    console.log(arrData);
    const finalArr = arrData.map((item) => {
      return {
        stock_name_code_id:
          item.is_alloy === 1
            ? item.alloy_variant.value
            : item.gold_variant.value,
        added_weight: item.added_wgt,
        fine: item.fine,
        is_alloy: item.is_alloy === 1 ? 1 : 0,
      };
    });
    const body = {
      production_tree_id: apiDataArray.id,
      to_department_id: department_id,
      department_id: transferDepartmet.value,
      process_id: processName && processName.value,
      workstation_id: selectedWorkStation && selectedWorkStation.value,
      reuse_metal: reUseMetalPer,
      calculated_purity: calculatedPurity,
      loose_stock_code_id: selectedMetal.value,
      total_added_weight: totalAdded,
      remark: remark,
      IssueDetailArray: finalArr,
    };
    Axios.post(Config.getCommonUrl() + `api/production/issue/alloying`, body)
      .then(function (response) {
        dispatch(Actions.showMessage({ message: response.data.message }));
        History.goBack();
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/production/issue/alloying`,
          body,
        });
      });
  };

  const handleMetalSelect = (value) => {
    setSelectedMetal(value);
    setSelectedMetalErr("");
  };
  const handleClose = () => {
    setOpenTransferPopup(false);
  };

  return (
    <Box className={classes.model} style={{ overflowY: "auto" }}>
      <Grid container className={classes.modalContainer}>
        <Grid item xs={12} sm={4} md={3} key="1">
          <FuseAnimate delay={300}>
            <Typography className="pl-28 pb-16 pt-16 text-18 font-700">
              Issue for Alloying
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
          <Hidden lgUp>
            <Button
              variant="contained"
              style={{
                background: "#1fd319",
                width: "150px",
                color: "#FFFFFF",
                fontWeight: "700",
              }}
              onClick={handleOpenModal}
            >
              Transfer
            </Button>
          </Hidden>
        </Grid>
      </Grid>
      <div className="main-div-alll ">
        <Box style={{ paddingInline: 16 }}>
          <Grid container style={{ marginBottom: 16 }} spacing={2}>
            <Grid
              item
              lg={2}
              md={3}
              sm={6}
              xs={12}
              className="packing-slip-input"
            >
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
            <Grid item lg={2} md={3} sm={6} xs={12}>
              <Select
                filterOption={createFilter({
                  ignoreAccents: false,
                })}
                classes={classes}
                styles={selectStyles}
                placeholder="Loose Metal"
                options={metalList.map((data) => ({
                  value: data.id,
                  label: data.stock_code,
                }))}
                value={selectedMetal}
                onChange={(e) => handleMetalSelect(e)}
                isDisabled={selectedLotNumber ? false : true}
              />
              <span style={{ color: "red" }}>
                {selectedMetalErr ? selectedMetalErr : ""}
              </span>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} lg={8}>
              <TableContainer
                className={classes.scroll}
                style={{ marginBottom: 16 }}
              >
                <Table
                  className={`${classes.table}`}
                  style={{ minWidth: "900px" }}
                >
                  <TableHead className={classes.tablehead}>
                    <TableRow>
                      <TableCell className={classes.tableRowPad} width="70px">
                        Purity
                      </TableCell>
                      <TableCell className={classes.tableRowPad} width="100px">
                        Reference No
                      </TableCell>
                      <TableCell className={classes.tableRowPad} width="115px">
                        Tree No
                      </TableCell>
                      <TableCell className={classes.tableRowPad} width="90px">
                        Tree Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad} width="90px">
                        Wax Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad} width="90px">
                        Stone Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad} width="130px">
                        Required Metal Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad} width="90px">
                        Required Fine
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(apiDataArray).length === 0 ? (
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          colSpan={8}
                          align="center"
                        >
                          <div style={{ textAlign: "center" }}>No Data</div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.purity}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.reference_number}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.tree_number}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.weight}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.waxWgt}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.totalStoneWeightSum}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.reqMetalWgt}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {apiDataArray?.reqFine}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box style={{ marginBottom: 16 }}>
                <Typography
                  style={{ fontSize: 18, marginBottom: 10, fontWeight: 700 }}
                >
                  Add / Available Metal
                </Typography>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <Typography
                    style={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Reuse Metal (%)
                  </Typography>
                  <TextField
                    id="reusemetal"
                    variant="outlined"
                    name="reUseMetalPer"
                    style={{ marginLeft: 10 }}
                    value={reUseMetalPer}
                    onChange={handleInputPercentage}
                    error={reUseMetalPerErr ? true : false}
                    helperText={reUseMetalPerErr}
                    disabled={apiDataArray === ""}
                    placeholder="0"
                  />
                </Box>
                <TableContainer style={{ overflowX: "initial" }}>
                  <Table>
                    <TableBody>
                      {availableMetalArr.map((item, index) => (
                        <TableRow
                          key={index}
                          style={{
                            background: "transparent",
                            borderBottom: "none",
                          }}
                        >
                          <TableCell className={classes.tableRowPad}>
                            <span style={{ display: "block", marginBottom: 5 }}>
                              Gold Variant
                            </span>
                            <Select
                              classes={classes}
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              styles={selectStyles}
                              options={goldVariantList.map((suggestion) => ({
                                value: suggestion.id,
                                label: suggestion.stock_name_code.stock_code,
                                data: suggestion,
                              }))}
                              value={item.gold_variant}
                              onChange={(e) => handleGoldChange(e, index)}
                              isDisabled={!reUseMetalPer}
                            />
                            <span style={{ color: "red" }}>
                              {availableMetalArr?.error?.gold_variant}
                            </span>
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Purity
                            <TextField
                              id="gold-variant"
                              variant="outlined"
                              value={item.purity}
                              style={{ marginTop: 5 }}
                              disabled
                              fullWidth
                            />
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Available Weight
                            <TextField
                              id="gold-variant"
                              variant="outlined"
                              value={item.available_wgt}
                              style={{ marginTop: 5 }}
                              disabled
                              fullWidth
                            />
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Added Weight
                            <TextField
                              id="gold-variant"
                              variant="outlined"
                              style={{ marginTop: 5 }}
                              value={item.added_wgt}
                              onChange={(e) => handleGoldInputChange(e, index)}
                              error={item.error?.added_wgt ? true : false}
                              helperText={item?.error?.added_wgt}
                              disabled={!item.gold_variant}
                              placeholder="0"
                              fullWidth
                            />
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Fine
                            <TextField
                              id="gold-variant"
                              variant="outlined"
                              value={
                                item.fine ? parseFloat(item.fine).toFixed(3) : 0
                              }
                              style={{ marginTop: 5 }}
                              disabled
                              fullWidth
                            />
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="70px"
                            align="center"
                            style={{
                              verticalAlign: "bottom",
                              textAlign: "center",
                            }}
                          >
                            {availableMetalArr.length - 1 === index ? (
                              <>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {" "}
                                  {/* Adding a div container */}
                                  <Button
                                    variant="contained"
                                    className={classes.addBtn}
                                    size="small"
                                    onClick={() => addGoldRow(index)}
                                    style={{ marginBlock: 4 }}
                                  >
                                    <Add style={{ color: "#FFFFFF" }} />
                                  </Button>
                                  {/* {
          index !== 0 &&  <IconButton
          fontSize="medium"
          style={{
            color: "red",
            cursor: "pointer",
            padding: 5,
            marginBlock: 4,
          }}
          onClick={() => deleteGoldRow(index)}
        >
          <Icon className="" style={{ color: "red" }}>
            delete
          </Icon>
        </IconButton>
        } */}
                                </div>
                              </>
                            ) : (
                              <IconButton
                                fontSize="medium"
                                style={{
                                  color: "red",
                                  cursor: "pointer",
                                  padding: 5,
                                  marginBlock: 4,
                                }}
                                onClick={() => deleteGoldRow(index)}
                              >
                                <Icon className="" style={{ color: "red" }}>
                                  delete
                                </Icon>
                              </IconButton>
                              // <Delete
                              //   fontSize="medium"
                              //   style={{ color: "red", cursor: "pointer" }}
                              //   onClick={() => deleteGoldRow(index)}
                              // />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <TableContainer
                style={{ marginBottom: 16, overflowX: "initial" }}
              >
                <Typography
                  style={{ fontSize: 18, marginBottom: 10, fontWeight: 700 }}
                >
                  Add / Available Alloye
                </Typography>
                <Table style={{ maxWidth: "600px" }}>
                  <TableBody>
                    {availableAlloyArr.map((item, index) => (
                      <TableRow
                        key={index}
                        style={{
                          background: "transparent",
                          borderBottom: "none",
                        }}
                      >
                        <TableCell className={classes.tableRowPad}>
                          <span style={{ display: "block", marginBottom: 5 }}>
                            Alloye Variant
                          </span>
                          <Select
                            classes={classes}
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            styles={selectStyles}
                            options={alloyVariantList.map((suggestion) => ({
                              value: suggestion.stock_name_code_id,
                              label: suggestion.StockNameCode.stock_code,
                              data: suggestion,
                            }))}
                            value={item.alloy_variant}
                            onChange={(e) => handleAlloyChange(e, index)}
                            isDisabled={!reUseMetalPer}
                          />
                          <span style={{ color: "red" }}>
                            {availableMetalArr?.error?.alloy_variant}
                          </span>
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Available Weight
                          <TextField
                            id="gold-variant"
                            variant="outlined"
                            value={item.available_wgt}
                            style={{ marginTop: 5 }}
                            disabled
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Added Weight
                          <TextField
                            id="gold-variant"
                            variant="outlined"
                            style={{ marginTop: 5 }}
                            value={item.added_wgt}
                            onChange={(e) => handleAlloyInputChange(e, index)}
                            error={item.error?.added_wgt ? true : false}
                            helperText={item?.error?.added_wgt}
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          width="70px"
                          align="center"
                          style={{
                            verticalAlign: "bottom",
                            textAlign: "center",
                          }}
                        >
                          {availableAlloyArr.length - 1 === index ? (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {" "}
                                {/* Adding a div container */}
                                <Button
                                  variant="contained"
                                  className={classes.addBtn}
                                  size="small"
                                  onClick={() => addAlloyRow(index)}
                                  style={{ marginBlock: 4 }}
                                >
                                  <Add style={{ color: "#FFFFFF" }} />
                                </Button>
                                {/* {
          index !== 0 &&  <IconButton
          fontSize="medium"
          style={{
            color: "red",
            cursor: "pointer",
            padding: 5,
            marginBlock: 4,
          }}
          onClick={() => deleteAlloyRow(index)}
        >
          <Icon className="" style={{ color: "red" }}>
            delete
          </Icon>
        </IconButton>
        } */}
                              </div>
                            </>
                          ) : (
                            <IconButton
                              fontSize="medium"
                              style={{
                                color: "red",
                                cursor: "pointer",
                                padding: 5,
                                marginBlock: 4,
                              }}
                              onClick={() => deleteAlloyRow(index)}
                            >
                              <Icon className="" style={{ color: "red" }}>
                                delete
                              </Icon>
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TableContainer>
                <Table style={{ tableLayout: "auto", minWidth: "1500px" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad}>
                        Old Metal
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Fresh Metal
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Alloye
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Total
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Calculated Purity(%)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.tableRowPad}>
                        <Box
                          style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            columnGap: 10,
                          }}
                        >
                          <Box>
                            <Typography style={{ fontWeight: "700" }}>
                              Required
                            </Typography>
                            <TextField
                              id=""
                              variant="outlined"
                              value={
                                oldMetalReq &&
                                parseFloat(oldMetalReq).toFixed(3)
                              }
                              style={{ marginTop: 5, borderRadius: "7px" }}
                            />
                          </Box>
                          <Box>
                            <Typography style={{ fontWeight: "700" }}>
                              Remaining
                            </Typography>
                            <TextField
                              id=""
                              variant="outlined"
                              value={
                                oldMetalRemaining &&
                                parseFloat(oldMetalRemaining).toFixed(3)
                              }
                              style={{ marginTop: 5, borderRadius: "7px" }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <Box
                          style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            columnGap: 10,
                          }}
                        >
                          <Box>
                            <Typography style={{ fontWeight: "700" }}>
                              Required
                            </Typography>
                            <TextField
                              id=""
                              variant="outlined"
                              value={
                                freshMetalReq &&
                                parseFloat(freshMetalReq).toFixed(3)
                              }
                              style={{ marginTop: 5, borderRadius: "7px" }}
                            />
                          </Box>
                          <Box>
                            <Typography style={{ fontWeight: "700" }}>
                              Remaining
                            </Typography>
                            <TextField
                              id=""
                              variant="outlined"
                              value={
                                freshMetalRemaining &&
                                parseFloat(freshMetalRemaining).toFixed(3)
                              }
                              style={{ marginTop: 5, borderRadius: "7px" }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <Box
                          style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            columnGap: 10,
                          }}
                        >
                          <Box>
                            <Typography style={{ fontWeight: "700" }}>
                              Required
                            </Typography>
                            <TextField
                              id=""
                              variant="outlined"
                              value={
                                alloyReq && parseFloat(alloyReq).toFixed(3)
                              }
                              style={{ marginTop: 5, borderRadius: "7px" }}
                            />
                          </Box>
                          <Box>
                            <Typography style={{ fontWeight: "700" }}>
                              Req / Metal
                            </Typography>
                            <TextField
                              id=""
                              variant="outlined"
                              value={
                                alloyReqMetal &&
                                parseFloat(alloyReqMetal).toFixed(3)
                              }
                              style={{ marginTop: 5, borderRadius: "7px" }}
                            />
                          </Box>
                          <Box>
                            <Typography style={{ fontWeight: "700" }}>
                              Remaining
                            </Typography>
                            <TextField
                              id=""
                              variant="outlined"
                              value={
                                alloyRemainig &&
                                parseFloat(alloyRemainig).toFixed(3)
                              }
                              style={{ marginTop: 5, borderRadius: "7px" }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <Box
                          style={{
                            display: "flex",
                            flexWrap: "nowrap",
                            columnGap: 10,
                          }}
                        >
                          <Box>
                            <Typography style={{ fontWeight: "700" }}>
                              Required
                            </Typography>
                            <TextField
                              id=""
                              variant="outlined"
                              value={
                                totalReq && parseFloat(totalReq).toFixed(3)
                              }
                              style={{ marginTop: 5, borderRadius: "7px" }}
                            />
                          </Box>
                          <Box>
                            <Typography style={{ fontWeight: "700" }}>
                              Issue Total
                            </Typography>
                            <TextField
                              id=""
                              variant="outlined"
                              value={
                                totalAdded && parseFloat(totalAdded).toFixed(3)
                              }
                              style={{ marginTop: 5, borderRadius: "7px" }}
                            />
                          </Box>
                          <Box>
                            <Typography style={{ fontWeight: "700" }}>
                              Remaining
                            </Typography>
                            <TextField
                              id=""
                              variant="outlined"
                              value={
                                totalRemaining &&
                                parseFloat(totalRemaining).toFixed(3)
                              }
                              style={{ marginTop: 5, borderRadius: "7px" }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <TextField
                          id=""
                          variant="outlined"
                          value={
                            calculatedPurity &&
                            parseFloat(calculatedPurity).toFixed(2)
                          }
                          className={classes.setheight}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Hidden mdDown={!openTransferPopup}>
              <Grid
                item
                xs={12}
                lg={4}
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                }}
              >
                {/* <Modal open={openTransferPopup} className={classes.modal}> */}
                <Box
                  className={clsx(
                    classes.modal,
                    openTransferPopup && classes.issueModal
                  )}
                >
                  <div
                    style={{
                      maxWidth: 500,
                      background: "#FFFFFF",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      className={classes.title}
                      style={{ position: "relative" }}
                    >
                      Transfer
                      <Hidden lgUp>
                        <IconButton
                          style={{
                            position: "absolute",
                            top: "0",
                            right: "0",
                            margin: 4,
                          }}
                          onClick={handleClose}
                        >
                          <Icon style={{ color: "white" }}>close</Icon>
                        </IconButton>
                      </Hidden>
                    </Typography>
                    <div className={classes.modalBody}>
                      <Select
                        id="departmentname"
                        filterOption={createFilter({ ignoreAccents: false })}
                        options={workstationList
                          .filter(
                            (item) =>
                              item.department_id === parseFloat(department_id)
                          )
                          .map((data) => ({
                            value: data.id,
                            label: data.name,
                            data: data,
                          }))}
                        // options={workstationList.map((item) => ({
                        //   value: item.id,
                        //   label: item.name,
                        //   key: item.name,
                        // }))}
                        styles={selectStyles}
                        value={selectedWorkStation}
                        onChange={handleInputChangeStation}
                        placeholder="Worker / Work Station Name"
                        fullWidth
                        variant="outlined"
                        className={classes.textfield}
                      />
                      {selectedWorkStationErr && (
                        <span style={{ color: "red" }}>
                          {selectedWorkStationErr}
                        </span>
                      )}
                      <Select
                        id="departmentname"
                        filterOption={createFilter({ ignoreAccents: false })}
                        options={departmentList.map((item) => ({
                          value: item.id,
                          label: item.name,
                          key: item.name,
                        }))}
                        styles={selectStyles}
                        value={transferDepartmet}
                        onChange={handleInputChangeDepartment}
                        placeholder="Department Name"
                        fullWidth
                        variant="outlined"
                        className={classes.textfield}
                      />
                      {transferDepartmetErr && (
                        <span style={{ color: "red" }}>
                          {transferDepartmetErr}
                        </span>
                      )}
                      <Select
                        id="departmentname"
                        filterOption={createFilter({ ignoreAccents: false })}
                        options={processList.map((item) => ({
                          value: item.id,
                          label: item.process_name,
                        }))}
                        styles={selectStyles}
                        value={processName}
                        onChange={handleInputChangeProcess}
                        placeholder="Process Name"
                        fullWidth
                        variant="outlined"
                        className={classes.textfield}
                      />
                      {processNameErr && (
                        <span style={{ color: "red" }}>{processNameErr}</span>
                      )}
                      {/* <TextField
                    id="processname"
                    label="Process Name"
                    variant="outlined"
                    className={classes.textfield}
                  /> */}
                      <TextField
                        id="ramrk"
                        label="Remark"
                        variant="outlined"
                        className={classes.textfield}
                        value={remark}
                        onChange={(e) => setReamark(e.target.value)}
                      />
                      <Button
                        id="btn-all-production"
                        variant="contained"
                        style={{
                          color: "#FFFFFF",
                          marginTop: 15,
                          // display: "block",
                        }}
                        onClick={handleSaveTransfer}
                      >
                        Save & Assign to Worker
                      </Button>
                    </div>
                  </div>
                </Box>
                {/* </Modal> */}
              </Grid>
            </Hidden>
          </Grid>
        </Box>
      </div>
    </Box>
  );
};

export default IssueForAlloying;

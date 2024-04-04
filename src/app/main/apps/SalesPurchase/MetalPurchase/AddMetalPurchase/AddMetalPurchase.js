import React, { useState, useEffect, useRef } from "react";
import { Typography, Checkbox } from "@material-ui/core";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import moment from "moment";
import Select, { createFilter } from "react-select";
import { Icon, IconButton } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Loader from "app/main/Loader/Loader";
import History from "@history";
import { useReactToPrint } from "react-to-print";
import { MetalPurPrintComp } from "../PrintComponent/MetalPurPrintComp";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
import HelperFunc from "../../Helper/HelperFunc";
import { UpdateNarration } from "../../Helper/UpdateNarration";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    // minWidth: 650,
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
  tableRowPad: {
    padding: 7,
  },
  form: {
    marginTop: "3%",
    display: "contents",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  selectBox: {
    // marginTop: 8,
    // padding: 8,
    // fontSize: "12pt",
    marginLeft: "0.5rem",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 0,
    width: "10%",
    display: "inline-block",
    // marginLeft: 15,
  },
  tableheader: {
    display: "inline-block",
    textAlign: "center",
  },
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
  },
  rateFixPaper: {
    position: "absolute",
    width: 600,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
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

const AddMetalPurchase = React.memo((props) => {
  var idToBeView;
  if (props.location) {
    idToBeView = props.location.state;
  } else if (props.voucherId) {
    idToBeView = { id: props.voucherId };
  }
  const SelectRef = useRef(null);
  const [isView, setIsView] = useState(false); //for view Only
  const [narrationFlag, setNarrationFlag] = useState(false);

  const [printObj, setPrintObj] = useState({
    stateId: "",
    supplierName: "",
    supAddress: "",
    supplierGstUinNum: "",
    supPanNum: "",
    supState: "",
    supCountry: "",
    supStateCode: "",
    purcVoucherNum: "",
    partyInvNum: "",
    voucherDate: moment().format("DD-MM-YYYY"),
    placeOfSupply: "",
    orderDetails: [],
    taxableAmount: "",
    sGstTot: "",
    cGstTot: "",
    iGstTot: "",
    roundOff: "",
    grossWtTOt: "",
    netWtTOt: "",
    fineWtTot: "",
    totalInvoiceAmt: "",
    TDSTCSVoucherNum: "",
    ledgerName: "",
    taxAmount: "",
    metNarration: "",
    accNarration: "",
    balancePayable: "",
  });

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);

  // const [loading, setLoading] = React.useState(false);
  // const [text, setText] = React.useState("old boring text");

  const handleAfterPrint = () => {
    //React.useCallback
    //resetting after print
    checkAndReset();
  };

  function checkAndReset() {
    // console.log("checkAndReset", isView)

    // console.log("isView", isView)

    if (isView === false) {
      console.log("cond true", isView);
      History.goBack();
    }
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

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
    //eslint-disable-next-line
  }, [componentRef.current]);

  const [timeDate, setTimeDate] = useState("");

  function getDateAndTime() {
    if (isView) {
      return moment
        .utc(timeDate)
        .utcOffset("+05:30")
        .format("DD-MM-YYYY h:mm A");
    } else {
      const currentDate = new Date();
      return (
        // currentDate.getDate() +
        // "-" +
        // (currentDate.getMonth() + 1) +
        // "-" +
        // currentDate.getFullYear() +
        // " " +
        // currentDate.getHours() +
        // ":" +
        // currentDate.getMinutes()
        moment(currentDate).format("DD-MM-YYYY h:mm A")
      );
    }
  }

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Metal_Purchase_Voucher_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  useEffect(() => {
    if (props.reportView === "Report") {
      NavbarSetting("Factory Report", dispatch);
    } else if (props.reportView === "Account") {
      NavbarSetting("Accounts", dispatch);
    } else {
      NavbarSetting("Sales", dispatch);
    }
  }, []);

 
  function checkforPrint() {
    if (
      // handleDateBlur()&&
      voucherNumValidation() &&
      partyNameValidation() &&
      oppositeAcValidation() &&
      partyVoucherNumValidation() &&
      partyVoucherDateValidation() &&
      checkAmount()
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (isView) {
        handlePrint();
      } else {
        if (handleDateBlur() && prevContactIsValid()) {
          addMetalPurchase(false, true);
        } else {
          console.log("prevContactIsValid else");
        }
      }
    } else {
      console.log("else");
    }
  }

  React.useEffect(() => {
    if (
      // text === "New, Updated Text!" &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      onBeforeGetContentResolve.current();
    }
    //eslint-disable-next-line
  }, [onBeforeGetContentResolve.current]); //, text

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [rfModalOpen, setRfModalOpen] = useState(false);

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [vendorData, setVendorData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedVendorErr, setSelectedVendorErr] = useState("");

  const [clientData, setClientData] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedClientErr, setSelectedClientErr] = useState("");

  const [clientFirmData, setClientFirmData] = useState([]);
  const [selectedClientFirm, setSelectedClientFirm] = useState("");
  const [selectedClientFirmErr, setSelectedClientFirmErr] = useState("");

  const [selectedRateFixErr, setSelectedRateFixErr] = useState("");

  const [balanceRfixData, setBalanceRfixData] = useState("");
  const [balRfixViewData, setBalRfixViewData] = useState([]);

  const [canEnterVal, setCanEnterVal] = useState(false);

  const [oppositeAccData, setOppositeAccData] = useState([]);
  const [oppositeAccSelected, setOppositeAccSelected] = useState("");
  const [selectedOppAccErr, setSelectedOppAccErr] = useState("");

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");
  const [partyVoucherDateErr, setpartyVoucherDateErr] = useState("");

  // const [departmentData, setDepartmentData] = useState([]);
  // const [selectedDepartment, setSelectedDepartment] = useState("");
  // const [selectedDeptErr, setSelectedDeptErr] = useState("");

  const [stockCodeData, setStockCodeData] = useState([]);

  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");

  const [vendorStateId, setVendorStateId] = useState("");
  const [address, setAddress] = useState("");
  const [supplierGstUinNumber, setSupplierGstUinNum] = useState("");
  const [supPanNumber, setSupPanNum] = useState("");
  const [supStateName, setSupState] = useState("");
  const [supCountryName, setSupCountry] = useState("");

  //below table total val field
  const [amount, setAmount] = useState("");
  const [cgstVal, setCgstVal] = useState("");
  const [sgstVal, setSgstVal] = useState("");
  const [igstVal, setIgstVal] = useState("");
  const [total, setTotal] = useState("");
  const [fineGoldTotal, setFineGoldTotal] = useState("");
  const [totalGST, setTotalGST] = useState("");
  const [is_tds_tcs, setIs_tds_tcs] = useState("");
  const [totalGrossWeight, setTotalGrossWeight] = useState("");
  const [totalNetWeight, setTotalNetWeight] = useState("");
  const [subTotal, setSubTotal] = useState("");

  const [roundOff, setRoundOff] = useState("");
  const [roundOffErr, SetRoundOffErr] = useState("");

  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState("");

  const [tdsTcsVou, setTdsTcsVou] = useState("");
  // const [tdsTcsVouErr, setTdsTcsVouErr] = useState("");

  const [ledgerData, setLedgerData] = useState([]);
  const [ledgerName, setLedgerName] = useState("");
  const [ledgerNmErr, setLedgerNmErr] = useState("");

  const [rateValue, setRateValue] = useState("");
  const [rateValErr, setRateValErr] = useState("");

  const [ledgerAmount, setLegderAmount] = useState("");
  const [ledgerAmtErr, setLedgerAmtErr] = useState("");

  const [finalAmount, setFinalAmount] = useState("");

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [metalNarration, setMetalNarration] = useState("");
  const [metalNarrationErr, setMetalNarrationErr] = useState("");

  const [modalStyle] = useState(getModalStyle);

  const [shortageRfix, setShortageRfix] = useState("");
  const [shortageRfixErr, setShortageRfixErr] = useState("");

  const [tempRate, setTempRate] = useState("");
  const [tempRateErr, setTempRateErr] = useState("");

  const [avgRate, setAvgeRate] = useState("");
  const [avgRateErr, setAvgeRateErr] = useState("");

  const [tempApiWeight, setTempApiWeight] = useState("");

  const [adjustedRate, setAdjustedRate] = useState(false);

  // const [utiliseErr, setUtiliseErr] = useState("");
  const [utiliseTotal, setUtiliseTotal] = useState("");

  const [popupErr, setPopupErr] = useState("");

  const [newRate, setNewRate] = useState("");

  const theme = useTheme();

  const [selectedVendorClient, setVendorClient] = useState({
    value: 1,
    label: "Vendor",
  });

  const [formValues, setFormValues] = useState([
    {
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      fineGold: "",
      rate: "",
      amount: "",
      CGSTPer: "",
      SGSTPer: "",
      IGSTPer: "",
      CGSTval: "",
      SGSTval: "",
      IGSTVal: "",
      Total: "",
      errors: {
        stockCode: null,
        categoryName: null,
        selectedHsn: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        fineGold: null,
        rate: null,
        amount: null,
        CGSTPer: null,
        SGSTPer: null,
        IGSTPer: null,
        CGSTval: null,
        SGSTval: null,
        IGSTVal: null,
        Total: null,
      },
    },
    {
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      fineGold: "",
      rate: "",
      amount: "",
      CGSTPer: "",
      SGSTPer: "",
      IGSTPer: "",
      CGSTval: "",
      SGSTval: "",
      IGSTVal: "",
      Total: "",
      errors: {
        stockCode: null,
        categoryName: null,
        selectedHsn: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        fineGold: null,
        rate: null,
        amount: null,
        CGSTPer: null,
        SGSTPer: null,
        IGSTPer: null,
        CGSTval: null,
        SGSTval: null,
        IGSTVal: null,
        Total: null,
      },
    },
    {
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      fineGold: "",
      rate: "",
      amount: "",
      CGSTPer: "",
      SGSTPer: "",
      IGSTPer: "",
      CGSTval: "",
      SGSTval: "",
      IGSTVal: "",
      Total: "",
      errors: {
        stockCode: null,
        categoryName: null,
        selectedHsn: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        fineGold: null,
        rate: null,
        amount: null,
        CGSTPer: null,
        SGSTPer: null,
        IGSTPer: null,
        CGSTval: null,
        SGSTval: null,
        IGSTVal: null,
        Total: null,
      },
    },
    {
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      fineGold: "",
      rate: "",
      amount: "",
      CGSTPer: "",
      SGSTPer: "",
      IGSTPer: "",
      CGSTval: "",
      SGSTval: "",
      IGSTVal: "",
      Total: "",
      errors: {
        stockCode: null,
        categoryName: null,
        selectedHsn: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        fineGold: null,
        rate: null,
        amount: null,
        CGSTPer: null,
        SGSTPer: null,
        IGSTPer: null,
        CGSTval: null,
        SGSTval: null,
        IGSTVal: null,
        Total: null,
      },
    },
  ]);

  const vendorClientArr = [
    { id: 1, name: "Vendor" },
    { id: 2, name: "Client" },
  ];

  const handleVendorClientChange = (value) => {
    setVendorClient(value);
    setSelectedVendor("");
    setSelectedVendorErr("");
    setSelectedClient("");
    setSelectedClientErr("");
    setSelectedClientFirm("");
    setSelectedClientFirmErr("");
    setLedgerName("");
    setLedgerNmErr("");
    setLedgerData([]);
    setRateValue("");
    setRateValErr("");
    setLegderAmount(0);
    setLedgerAmtErr("");
    setFinalAmount("");
    setTdsTcsVou("");
    resetForm();
  };

  const inputRef = useRef([]);

  let handleStockGroupChange = (i, e) => {
    console.log(e);
    let newFormValues = [...formValues];
    newFormValues[i].stockCode = {
      value: e.value,
      label: e.label,
    };
    newFormValues[i].errors.stockCode = null;

    let findIndex = stockCodeData.findIndex(
      (item) => item.stock_name_code.id === e.value
    );
    // console.log(findIndex);
    if (findIndex > -1) {
      newFormValues[i].grossWeight = "";
      newFormValues[i].netWeight = "";
      newFormValues[i].rate = "";
      newFormValues[i].amount = "";
      newFormValues[i].CGSTval = "";
      newFormValues[i].SGSTval = "";
      newFormValues[i].IGSTVal = "";
      newFormValues[i].Total = "";

      newFormValues[i].purity = stockCodeData[findIndex].stock_name_code.purity;

      newFormValues[i].categoryName = stockCodeData[findIndex].stock_name;
      newFormValues[i].errors.categoryName = null;

      newFormValues[i].selectedHsn =
        stockCodeData[findIndex].hsn_master.hsn_number;

      if (vendorStateId === 12) {
        newFormValues[i].CGSTPer =
          parseFloat(stockCodeData[findIndex].hsn_master.gst) / 2;
        newFormValues[i].SGSTPer =
          parseFloat(stockCodeData[findIndex].hsn_master.gst) / 2;
      } else {
        newFormValues[i].IGSTPer = parseFloat(
          stockCodeData[findIndex].hsn_master.gst
        );
      }
    }

    // console.log("i", i, "length", formValues.length);
    if (i === formValues.length - 1) {
      // addFormFields();
      changeTotal(newFormValues, true);
    } else {
      changeTotal(newFormValues, false);
      // setFormValues(newFormValues);
    }
    setAdjustedRate(false);

    inputRef.current[i].focus();
  };

  function changeTotal(newFormValues, addFlag) {
    function amount(item) {
      // console.log(item.amount)
      return item.amount;
    }

    // function sum(prev, next) {
    //   console.log("prev", parseFloat(prev).toFixed(3))

    //   console.log("next", parseFloat(next).toFixed(3))
    //   return parseFloat(prev).toFixed(3) + parseFloat(next).toFixed(3);
    // }

    function CGSTval(item) {
      return item.CGSTval;
    }

    function SGSTval(item) {
      return item.SGSTval;
    }

    function IGSTVal(item) {
      return item.IGSTVal;
    }

    function Total(item) {
      return item.Total;
    }

    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.grossWeight);
    }

    function fineGold(item) {
      return parseFloat(item.fineGold);
    }

    let tempFineGold = newFormValues
      .filter((item) => item.fineGold !== "")
      .map(fineGold)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
    // console.log(formValues.map(amount).reduce(sum))

    let tempAmount = newFormValues
      .filter((item) => item.amount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    //.reduce(sum);
    // console.log("tempAmount>>>",tempAmount.toFixed(3))
    setAmount(parseFloat(tempAmount).toFixed(3));
    setSubTotal(parseFloat(tempAmount).toFixed(3));

    let tempCgstVal;
    let tempSgstVal;
    let tempIgstVal;
    if (vendorStateId === 12) {
      tempCgstVal = newFormValues
        .filter((item) => item.CGSTval !== "")
        .map(CGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
      setCgstVal(parseFloat(tempCgstVal).toFixed(3));

      tempSgstVal = newFormValues
        .filter((item) => item.SGSTval !== "")
        .map(SGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setSgstVal(parseFloat(tempSgstVal).toFixed(3));
      setTotalGST(
        parseFloat(parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
      );
    } else {
      tempIgstVal = newFormValues
        .filter((item) => item.IGSTVal !== "")
        .map(IGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setIgstVal(parseFloat(tempIgstVal).toFixed(3));
      setTotalGST(parseFloat(tempIgstVal).toFixed(3));
    }

    let tempTotal = newFormValues
      .filter((item) => item.Total !== "")
      .map(Total)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotal(parseFloat(tempTotal).toFixed(3));

    let tempGrossWtTot = newFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

    function netWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.netWeight);
    }

    let tempNetWtTot = newFormValues
      .filter((data) => data.netWeight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

    let tempLedgerAmount = 0;
    let tempfinalAmount = 0;
    let tempTotalInvoiceAmt = 0;

    if (parseFloat(tempTotal) > 0) {
      // let temptdsTcsAmount =0;

      if (roundOff > 5 || roundOff < -5) {
        //tempTotal is amount + gst
        tempTotalInvoiceAmt = parseFloat(
          parseFloat(tempTotal) + parseFloat(roundOff)
        ).toFixed(3);

        setTotalInvoiceAmount(tempTotalInvoiceAmt);
      } else {
        tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);

        setTotalInvoiceAmount(tempTotalInvoiceAmt);
      }

      if (is_tds_tcs == 1) {
        //1 is tcs, 2 means tds
        // tempLedgerAmount = parseFloat(
        //   (tempTotalInvoiceAmt * rateValue) / 100
        // ).toFixed(3); //with gst on total invoice amount
        // console.log(tempLedgerAmount);
        //if tcs then enter amount manually
        tempLedgerAmount = 0;

        tempfinalAmount = parseFloat(
          parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)
        ).toFixed(3);
      } else if (is_tds_tcs == 2) {
        //tds
        tempLedgerAmount = parseFloat(
          (parseFloat(tempAmount) * rateValue) / 100
        ).toFixed(3); //calculating before gst, on total amount only
        console.log(tempLedgerAmount);
        tempfinalAmount = parseFloat(
          parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount)
        ).toFixed(3);
      } else {
        tempfinalAmount = parseFloat(tempTotalInvoiceAmt).toFixed(3);
      }

      setLegderAmount(tempLedgerAmount);

      setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));
    } else {
      setTotalInvoiceAmount(0);
      setLegderAmount(0);
      setFinalAmount(0);
    }

    // let tempCgstVal;
    // let tempSgstVal;
    // let tempIgstVal;

    setPrintObj({
      ...printObj,
      supplierName: firmName,
      supAddress: address,
      supplierGstUinNum:
        supplierGstUinNumber === null ? "" : supplierGstUinNumber,
      supPanNum: supPanNumber,
      supState: supStateName,
      supCountry: supCountryName,
      supStateCode:
        supplierGstUinNumber === null
          ? "-"
          : supplierGstUinNumber.substring(0, 2),
      purcVoucherNum: voucherNumber,
      stateId: vendorStateId,
      orderDetails: newFormValues,
      is_tds_tcs: is_tds_tcs,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCgstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      roundOff: roundOff,
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      fineWtTot: parseFloat(tempFineGold).toFixed(3),
      totalInvoiceAmt: tempTotalInvoiceAmt,
      taxAmount: tempLedgerAmount,
      balancePayable: parseFloat(tempfinalAmount).toFixed(3),
    });

    if (addFlag === true) {
      setFormValues([
        ...newFormValues,
        {
          stockCode: "",
          // stockCodeData: [],
          categoryName: "",
          // categoryData: [],
          // HSNdata: [],
          selectedHsn: "",
          grossWeight: "",
          netWeight: "",
          purity: "",
          fineGold: "",
          rate: "",
          amount: "",
          CGSTPer: "",
          SGSTPer: "",
          IGSTPer: "",
          CGSTval: "",
          SGSTval: "",
          IGSTVal: "",
          Total: "",
          errors: {
            stockCode: null,
            categoryName: null,
            selectedHsn: null,
            grossWeight: null,
            netWeight: null,
            purity: null,
            fineGold: null,
            rate: null,
            amount: null,
            CGSTPer: null,
            SGSTPer: null,
            IGSTPer: null,
            CGSTval: null,
            SGSTval: null,
            IGSTVal: null,
            Total: null,
          },
        },
      ]);
    } else {
      setFormValues(newFormValues);
    }
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

  const classes = useStyles();

  useEffect(() => {
    // visible true -> false
    if (loading) {
      //setTimeout(() => setLoaded(true), 250); // 0.25초 뒤에 해제
      //debugger;
      setTimeout(() => setLoading(false), 7000); // 10초 뒤에
    }

    //setLoaded(loaded);
  }, [loading]);

  const [documentList, setDocumentList] = useState([]);
  const [docModal, setDocModal] = useState(false);
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);

  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 1)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            const arrData = response.data.data;
            const fileId = [];
            arrData.map((item) => {
              fileId.push(item.id);
            });
            setDocIds(fileId);
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
        })
        .catch((error) => {
          console.log(error);
          handleError(error, dispatch, {
            api: "api/salespurchasedocs/upload",
            body: docFile,
          });
        });
    }
  }, [docFile]);

  useEffect(() => {
    setOppositeAccData(HelperFunc.getOppositeAccountDetails("MetalPurchase"));
    // getProductCategories();
    // getStockCodeMetal();

    console.log("idToBeView", idToBeView);
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true);
      getMetalPurchaseRecordForView(idToBeView.id);
    } else {
      setNarrationFlag(false);
      getStockCodeMetal();
      getVoucherNumber(); //if view only then no need to get new voucher number, we will set data coming from api
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (idToBeView === undefined) {
      if (selectedVendorClient.value === 1) {
        getVendordata();
      } else {
        getClientdata();
      }
    }
  }, [selectedVendorClient]);

  useEffect(() => {
    if (idToBeView === undefined) {
      if (rateValue && is_tds_tcs == 2) {
        calculateWhenLedgerChange();
      }
    }
  }, [rateValue, ledgerName]);

  function calculateWhenLedgerChange() {
    let tempLedgerAmount = 0;
    let tempfinalAmount = 0;
    //1 is tcs, 2 means tds
    if (is_tds_tcs == 1) {
      //if tcs then enter amount manually
      tempLedgerAmount = 0;

      tempfinalAmount = parseFloat(
        parseFloat(totalInvoiceAmount) + parseFloat(tempLedgerAmount)
      ).toFixed(3);
    } else if (is_tds_tcs == 2) {
      //tds
      tempLedgerAmount = parseFloat(
        (parseFloat(subTotal) * rateValue) / 100
      ).toFixed(3); //calculating before gst, on total amount only
      console.log(tempLedgerAmount);
      tempfinalAmount = parseFloat(
        parseFloat(totalInvoiceAmount) - parseFloat(tempLedgerAmount)
      ).toFixed(3);
    } else {
      tempfinalAmount = parseFloat(totalInvoiceAmount).toFixed(3);
    }

    setLegderAmount(tempLedgerAmount);

    setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));

    setPrintObj({
      ...printObj,
      taxableAmount: parseFloat(subTotal).toFixed(3),
      totalInvoiceAmt: totalInvoiceAmount,
      taxAmount: tempLedgerAmount,
      balancePayable: parseFloat(tempfinalAmount).toFixed(3),
      TDSTCSVoucherNum: tdsTcsVou,
      ledgerName: ledgerName.label,
    });
  }

  useEffect(() => {
    if (idToBeView === undefined) {
      if (ledgerAmount && is_tds_tcs == 1) {
        changeRate();
      }
    }
  }, [ledgerAmount]);

  function getMetalPurchaseRecordForView(id) {
    setLoading(true);
    let api = "";
    if (props.forDeletedVoucher) {
      api = `api/metalpurchase/${id}?deleted_at=1`;
    } else {
      api = `api/metalpurchase/${id}`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response.data.data);
      setTimeDate(response.data.data.created_at);

        if (response.data.success === true) {
          setLoading(false);
          if (response.data.data !== null) {
            let finalData = response.data.data;
            console.log(finalData);
            if (finalData.is_vendor_client === 1) {
              setVendorClient({ value: 1, label: "Vendor" });
              setSelectedVendor({
                value: finalData.Vendor.id,
                label: finalData.Vendor.name,
              });
              setFirmName(finalData.Vendor.firm_name);
              setVendorStateId(finalData.Vendor.state);
              setIs_tds_tcs(finalData.Vendor.is_tds_tcs);
              var clientVendorState = finalData.Vendor.state;
              var mainObj = finalData.Vendor;
            } else {
              setVendorClient({ value: 2, label: "Client" });
              setSelectedClient({
                value: finalData.ClientCompany.id,
                label: finalData.ClientCompany.client.name,
              });
              setSelectedClientFirm({
                value: finalData.ClientCompany.id,
                label: finalData.ClientCompany.firm_name,
              });
              setVendorStateId(finalData.ClientCompany.state);
              setIs_tds_tcs(finalData.ClientCompany.is_tds_tcs);
              var clientVendorState = finalData.ClientCompany.state;
              var mainObj = finalData.ClientCompany;
            }

            setDocumentList(finalData.salesPurchaseDocs);

            setVoucherNumber(finalData.voucher_no);
            setPartyVoucherDate(finalData.party_voucher_date);
            setAllowedBackDate(true);
            setVoucherDate(finalData.purchase_voucher_create_date);

            setOppositeAccSelected({
              value: finalData.opposite_account_id,
              label: finalData.OppositeAccount.name,
            });
            setPartyVoucherNum(finalData.party_voucher_no);
            setRoundOff(
              finalData.round_off === null ? "" : finalData.round_off
            );

            if (finalData.TdsTcsVoucher !== null) {
              setLedgerName({
                value: finalData.TdsTcsVoucher.id,
                label: finalData.TdsTcsVoucher.voucher_name,
              });
              setTdsTcsVou(finalData.TdsTcsVoucher.voucher_no);
            }

            setRateValue(finalData.tds_or_tcs_rate);

            setLegderAmount(
              Math.abs(
                parseFloat(
                  parseFloat(finalData.final_invoice_amount) -
                  parseFloat(finalData.total_invoice_amount)
                ).toFixed(3)
              )
            );

            setTotalInvoiceAmount(
              parseFloat(finalData.total_invoice_amount).toFixed(3)
            );
            setFinalAmount(
              parseFloat(finalData.final_invoice_amount).toFixed(3)
            );

            setAccNarration(
              finalData.account_narration !== null
                ? finalData.account_narration
                : ""
            );
            setMetalNarration(
              finalData.metal_narration !== null
                ? finalData.metal_narration
                : ""
            );

            let tempArray = [];
            // console.log(OrdersData);
            for (let item of finalData.MetalPurchaseOrder) {
              // console.log(item);
              tempArray.push({
                stockCode: {
                  value: item.StockNameCode.id,
                  label: item.StockNameCode.stock_code,
                },
                categoryName: item.stock_name,
                selectedHsn: item.hsn_number ? item.hsn_number : "",
                grossWeight: parseFloat(item.gross_weight).toFixed(3),
                netWeight: parseFloat(item.net_weight).toFixed(3),
                purity: item.purity,
                fineGold: parseFloat(item.finegold).toFixed(3),
                rate: parseFloat(item.rate).toFixed(3),
                amount: parseFloat(item.amount).toFixed(3),
                CGSTPer: item.cgst,
                SGSTPer: item.sgst,
                IGSTPer: item.igst,
                CGSTval:
                  item.cgst !== null
                    ? parseFloat(
                      (parseFloat(item.amount) * parseFloat(item.cgst)) / 100
                    ).toFixed(3)
                    : "",
                SGSTval:
                  item.sgst !== null
                    ? parseFloat(
                      (parseFloat(item.amount) * parseFloat(item.sgst)) / 100
                    ).toFixed(3)
                    : "",
                IGSTVal:
                  item.igst !== null
                    ? parseFloat(
                      (parseFloat(item.amount) * parseFloat(item.igst)) / 100
                    ).toFixed(3)
                    : "",
                Total: parseFloat(item.total).toFixed(3),
                errors: {
                  stockCode: null,
                  categoryName: null,
                  selectedHsn: null,
                  grossWeight: null,
                  netWeight: null,
                  purity: null,
                  fineGold: null,
                  rate: null,
                  amount: null,
                  CGSTPer: null,
                  SGSTPer: null,
                  IGSTPer: null,
                  CGSTval: null,
                  SGSTval: null,
                  IGSTVal: null,
                  Total: null,
                },
              });
            }
            setFormValues(tempArray);

            function amount(item) {
              // console.log(item.amount)
              return item.amount;
            }

            function CGSTval(item) {
              return item.CGSTval;
            }

            function SGSTval(item) {
              return item.SGSTval;
            }

            function IGSTVal(item) {
              return item.IGSTVal;
            }

            function Total(item) {
              return item.Total;
            }

            function grossWeight(item) {
              // console.log(parseFloat(item.grossWeight));
              return parseFloat(item.grossWeight);
            }

            function fineGold(item) {
              return parseFloat(item.fineGold);
            }

            let tempFineGold = tempArray
              .filter((item) => item.fineGold !== "")
              .map(fineGold)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);

            setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
            // console.log(formValues.map(amount).reduce(sum))

            let tempAmount = tempArray
              .filter((item) => item.amount !== "")
              .map(amount)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);
            //.reduce(sum);
            // console.log("tempAmount>>>",tempAmount.toFixed(3))
            setAmount(parseFloat(tempAmount).toFixed(3));
            setSubTotal(parseFloat(tempAmount).toFixed(3));

            let tempCgstVal = tempArray
              .filter((item) => item.CGSTval !== "")
              .map(CGSTval)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);
            // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
            setCgstVal(parseFloat(tempCgstVal).toFixed(3));

            let tempSgstVal = tempArray
              .filter((item) => item.SGSTval !== "")
              .map(SGSTval)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);
            setSgstVal(parseFloat(tempSgstVal).toFixed(3));

            let tempIgstVal = tempArray
              .filter((item) => item.IGSTVal !== "")
              .map(IGSTVal)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);
            setIgstVal(parseFloat(tempIgstVal).toFixed(3));

            setTotalGST(
              parseFloat(tempCgstVal) +
              parseFloat(tempSgstVal) +
              parseFloat(tempIgstVal)
            );

            let tempTotal = tempArray
              .filter((item) => item.Total !== "")
              .map(Total)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);
            setTotal(parseFloat(tempTotal).toFixed(3));

            let tempGrossWtTot = parseFloat(
              tempArray
                .filter((data) => data.grossWeight !== "")
                .map(grossWeight)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0)
            ).toFixed(3);

            setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

            function netWeight(item) {
              return parseFloat(item.netWeight);
            }

            let tempNetWtTot = parseFloat(
              tempArray
                .filter((data) => data.netWeight !== "")
                .map(netWeight)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0)
            ).toFixed(3);

            setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

            setPrintObj({
              ...printObj,
              is_tds_tcs: mainObj.is_tds_tcs,
              stateId: clientVendorState,
              supplierName: mainObj.firm_name,
              supAddress: mainObj.address,
              supplierGstUinNum:
                mainObj.gst_number === null ? "-" : mainObj.gst_number,
              supPanNum: mainObj.pan_number,
              supState: mainObj.StateName
                ? mainObj.StateName.name
                : mainObj.state_name.name,
              supCountry: mainObj.country_name
                ? mainObj.country_name.name
                : mainObj.CountryName.name,
              supStateCode:
                mainObj.gst_number === null
                  ? "-"
                  : mainObj.gst_number.substring(0, 2),
              purcVoucherNum: finalData.voucher_no,
              partyInvNum: finalData.party_voucher_no,
              voucherDate: moment(
                finalData.purchase_voucher_create_date
              ).format("DD-MM-YYYY"),
              placeOfSupply: mainObj.StateName
                ? mainObj.StateName.name
                : mainObj.state_name.name,
              orderDetails: tempArray,
              taxableAmount: parseFloat(tempAmount).toFixed(3),
              sGstTot: tempSgstVal ? parseFloat(tempSgstVal).toFixed(3) : "",
              cGstTot: tempCgstVal ? parseFloat(tempCgstVal).toFixed(3) : "",
              iGstTot: tempIgstVal ? parseFloat(tempIgstVal).toFixed(3) : "",
              roundOff:
                finalData.round_off === null ? "0" : finalData.round_off,
              grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
              netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
              fineWtTot: parseFloat(tempFineGold).toFixed(3),
              totalInvoiceAmt: parseFloat(
                finalData.total_invoice_amount
              ).toFixed(3),
              TDSTCSVoucherNum:
                finalData.TdsTcsVoucher !== null
                  ? finalData.TdsTcsVoucher.voucher_no
                  : "",
              ledgerName:
                finalData.TdsTcsVoucher !== null
                  ? finalData.TdsTcsVoucher.voucher_name
                  : "",
              taxAmount: Math.abs(
                parseFloat(
                  parseFloat(finalData.final_invoice_amount) -
                  parseFloat(finalData.total_invoice_amount)
                ).toFixed(3)
              ),
              metNarration:
                finalData.metal_narration !== null
                  ? finalData.metal_narration
                  : "",
              accNarration:
                finalData.account_narration !== null
                  ? finalData.account_narration
                  : "",
              balancePayable: parseFloat(
                finalData.final_invoice_amount
              ).toFixed(3),
              signature: finalData.admin_signature,
            });
            setAdjustedRate(true);
          } else {
            // setApiData([]);
          }
        } else {
          setLoading(false);
          // setApiData([]);
        }
      })
      .catch(function (error) {
        // console.log(error);
        setLoading(false);
        handleError(error, dispatch, { api: api });
      });
  }

  function getStockCodeMetal() {
    axios
      .get(Config.getCommonUrl() + "api/stockname/metal")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockCodeData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/stockname/metal" });
      });
  }

  function getVendordata() {
    axios
      .get(Config.getCommonUrl() + "api/vendor/listing/listing")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setVendorData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/vendor/listing/listing" });
      });
  }

  function getClientdata() {
    axios
      .get(Config.getCommonUrl() + "api/client/listing/listing")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setClientData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/client/listing/listing" });
      });
  }

  function getClientCompanies(clientId) {
    axios
      .get(
        Config.getCommonUrl() + `api/client/company/listing/listing/${clientId}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          setClientFirmData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/client/company/listing/listing/${clientId}`,
        });
      });
  }

  function getVoucherNumber() {
    axios
      .get(Config.getCommonUrl() + "api/metalpurchase/get/voucher")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // setProductCategory(response.data.data);
          setVoucherNumber(response.data.data.voucherNo);
          setPrintObj({
            ...printObj,
            purcVoucherNum: response.data.data.voucherNo,
          });
          if (response.data.data.allowed_back_date_entry === 1) {
            setAllowedBackDate(true);
            setBackEnteyDays(response.data.data.back_entry_days);
          } else {
            setAllowedBackDate(false);
            setBackEnteyDays(0);
          }
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/metalpurchase/get/voucher" });
      });
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    // console.log("name",name,"value",value);

    if (name === "voucherNumber") {
      setVoucherNumber(value);
      setVoucherNumErr("");
    } else if (name === "voucherDate") {
      setVoucherDate(value);
      setVoucherDtErr("");
      setPrintObj({
        ...printObj,
        voucherDate: moment(value).format("DD-MM-YYYY"),
      });
    } else if (name === "partyVoucherNum") {
      setPartyVoucherNum(value);
      setPartyVoucherNumErr("");
      setPrintObj({
        ...printObj,
        partyInvNum: value,
      });
    } else if (name === "partyVoucherDate") {
      setPartyVoucherDate(value);
      setpartyVoucherDateErr("");
    } else if (name === "metalNarration") {
      setMetalNarration(value);
      setMetalNarrationErr("");
      setPrintObj({
        ...printObj,
        metNarration: value,
      });
    } else if (name === "accNarration") {
      setAccNarration(value);
      setAccNarrationErr("");
      setPrintObj({
        ...printObj,
        accNarration: value,
      });
    } else if (name === "ledgerAmount") {
      //only if tcs  is_tds_tcs === "1"
      setLegderAmount(value);
      if (!isNaN(value) && value !== "") {
        setLedgerAmtErr("");

        let tempfinalAmount =
          parseFloat(totalInvoiceAmount) + parseFloat(value);

        setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));
        setPrintObj({
          ...printObj,
          TDSTCSVoucherNum: tdsTcsVou,
          ledgerName: ledgerName.label,
          taxAmount: parseFloat(value).toFixed(3),
          balancePayable: parseFloat(tempfinalAmount).toFixed(3),
        });
      } else {
        setLedgerAmtErr("Please Enter Valid Amount");
        setFinalAmount(parseFloat(totalInvoiceAmount).toFixed(3));
      }
    } else if (name === "roundOff") {
      setRoundOff(value);
      setLegderAmount("");
      setLedgerName("");
      setRateValue("");
      setTdsTcsVou("");
      if (value > 5 || value < -5) {
        SetRoundOffErr("Please Enter value between -5 to 5");
      } else {
        SetRoundOffErr("");
      }
      let tempLedgerAmount = 0;
      let tempfinalAmount = 0;
      let tempTotalInvoiceAmt = 0;

      if (total > 0 && value !== "" && !isNaN(value)) {
        tempTotalInvoiceAmt = parseFloat(
          parseFloat(total) + parseFloat(value)
        ).toFixed(3);

        setTotalInvoiceAmount(tempTotalInvoiceAmt);
      } else {
        tempTotalInvoiceAmt = parseFloat(total).toFixed(3);

        setTotalInvoiceAmount(tempTotalInvoiceAmt);
      }

      if (is_tds_tcs == 1) {
        //1 is tcs, 2 means tds
        // tempLedgerAmount = parseFloat(
        //   (tempTotalInvoiceAmt * rateValue) / 100
        // ).toFixed(3); //with gst on total invoice amount
        // console.log(tempLedgerAmount);
        tempLedgerAmount = parseFloat(ledgerAmount).toFixed(3);

        tempfinalAmount = parseFloat(
          parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)
        ).toFixed(3);
      } else if (is_tds_tcs == 2) {
        //tds
        tempLedgerAmount = parseFloat(
          (parseFloat(amount) * rateValue) / 100
        ).toFixed(3); //calculating before gst, on total amount only
        console.log(tempLedgerAmount);
        tempfinalAmount = parseFloat(
          parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount)
        ).toFixed(3);
      } else {
        tempfinalAmount = parseFloat(tempTotalInvoiceAmt).toFixed(3);
      }

      setLegderAmount(parseFloat(tempLedgerAmount).toFixed(3));

      setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));

      setPrintObj({
        ...printObj,
        roundOff: value,
        totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
        taxAmount: tempLedgerAmount,
        balancePayable: parseFloat(tempfinalAmount).toFixed(3),
      });
    }
  }

  const changeRate = () => {
    const changeRatesVal =
      (parseFloat(ledgerAmount) * 100) / parseFloat(totalInvoiceAmount);
    setRateValue(parseFloat(changeRatesVal).toFixed(3));
  };

  function voucherNumValidation() {
    // var Regex = /^[a-zA-Z\s]*$/;
    // if (!voucherNumber || Regex.test(voucherNumber) === false) {
    if (voucherNumber === "") {
      setVoucherNumErr("Enter Valid Voucher Number");
      return false;
    }
    return true;
  }
  function checkAmount() {
    console.log(typeof finalAmount, "type");
    if (
      ledgerAmtErr ||
      finalAmount == "" ||
      finalAmount == 0 ||
      finalAmount == "NaN"
    ) {
      console.log(typeof finalAmount, "type");
      return false;
    }
    return true;
  }

  function partyNameValidation() {
    if (selectedVendorClient.value === 1) {
      if (selectedVendor === "") {
        setSelectedVendorErr("Please Select Vendor");
        return false;
      }
      return true;
    } else {
      if (selectedClient === "" || selectedClientFirm === "") {
        if (selectedClient === "") {
          setSelectedClientErr("Please Select Client");
        }
        if (selectedClientFirm === "") {
          setSelectedClientFirmErr("Please Select Client Firm");
        }
        return false;
      }
      return true;
    }
  }

  function partyVoucherNumValidation() {
    if (partyVoucherNum === "") {
      setPartyVoucherNumErr("Enter Party Voucher Number");
      return false;
    }
    return true;
  }

  function partyVoucherDateValidation() {
    if (partyVoucherDate === "") {
      setpartyVoucherDateErr("Enter Party Voucher Date");
      return false;
    }
    return true;
  }

  function oppositeAcValidation() {
    if (oppositeAccSelected === "") {
      setSelectedOppAccErr("Please Select Opposite Account");
      return false;
    }
    return true;
  }

  function ledgerNameValidate() {
    if ((is_tds_tcs == 1 || is_tds_tcs == 2) && ledgerName === "") {
      setLedgerNmErr("Select Ledger Name");
      return false;
    }
    return true;
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();

    // console.log(parseInt(gstType));
    console.log("handleFormSubmit", formValues);
    if (
      handleDateBlur() &&
      voucherNumValidation() &&
      partyNameValidation() &&
      oppositeAcValidation() &&
      partyVoucherNumValidation() &&
      partyVoucherDateValidation() &&
      ledgerNameValidate() &&
      checkAmount()
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (prevContactIsValid()) {
        // if(allowedBackDate){
        //   if(voucherDate){
        //     // check if voucherDate is less backEntryDays
        //     //min max date added
        //   }
        // }else{
        addMetalPurchase(true, false);
        // }
      } else {
        console.log("prevContactIsValid else");
      }
    } else {
      console.log("else");
    }
  }

  function addMetalPurchase(resetFlag, toBePrint) {
    console.log("fineGoldTotal", fineGoldTotal);
    console.log("tempApiWeight", tempApiWeight);
    console.log("adjustedRate", adjustedRate);
    // if (fineGoldTotal > tempApiWeight) {
    //   setSelectedRateFixErr("Please Add remaining rate");
    //   console.log("if");
    //   return;
    // }
    if (adjustedRate === false) {
      setSelectedRateFixErr("Please Add remaining rate");
      console.log("if");
      return;
    }

    let Orders = formValues
      .filter((element) => element.grossWeight !== "")
      .map((x) => {
        return {
          // category_name: x.categoryName,
          stock_name_code_id: x.stockCode.value,
          gross_weight: x.grossWeight,
          net_weight: x.netWeight,
          // setStockCodeId: 12,

          // setWeight: 10
        };
      });
    console.log(Orders);

    let rates = balRfixViewData
      .filter((element) => parseFloat(element.usedWeight) > 0)
      .map((item) => {
        return {
          id: item.id,
          weightToBeUtilized: item.usedWeight,
        };
      });

    if (Orders.length === 0) {
      dispatch(Actions.showMessage({ message: "Please Add Purchase Entry" }));
      return;
    }

    setLoading(true);
    const body = {
      // voucher_no: voucherNumber,
      party_voucher_no: partyVoucherNum,
      opposite_account_id: oppositeAccSelected.value,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      vendor_id:
        selectedVendorClient.value === 1
          ? selectedVendor.value
          : selectedClientFirm.value,
      is_vendor_client: selectedVendorClient.value === 1 ? 1 : 2,
      rates: rates,
      tds_tcs_ledger_id: is_tds_tcs != 0 ? ledgerName.value : null,
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      ...(tempRate !== "" && {
        setRate: tempRate,
      }),
      ...(is_tds_tcs == 1 && {
        tcs_rate: ledgerAmount,
      }),
      round_off: roundOff === "" ? 0 : roundOff,
      metal_narration: metalNarration,
      account_narration: accNarration,
      Orders: Orders,
      uploadDocIds: docIds,
      party_voucher_date: partyVoucherDate,
    };
    console.log(body);
    axios
      .post(Config.getCommonUrl() + "api/metalpurchase", body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id

          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.push("/dashboard/masters/clients");
          // History.goBack();
          // window.location.reload(false);
          setLoading(false);
          if (resetFlag === true) {
            checkAndReset();
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record
            handlePrint();
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
        }
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);
        handleError(error, dispatch, { api: "api/metalpurchase", body: body });
      });
  }

  function resetForm() {
    setOppositeAccSelected("");
    setAmount("");
    setSubTotal("");
    setCgstVal("");
    setSgstVal("");
    setIgstVal("");
    setTotalGST("");
    setTotal("");
    setTotalGrossWeight("");
    setTotalNetWeight("");
    setFineGoldTotal("");
    setRoundOff("");
    setTotalInvoiceAmount("");
    setFinalAmount("");
    setRateValue("");
    setLegderAmount(0);

    setPrintObj({
      ...printObj,
      supplierName: "",
      supAddress: "",
      supplierGstUinNum: "",
      supPanNum: "",
      supState: "",
      supCountry: "",
      supStateCode: "",
      // purcVoucherNum: "",
      partyInvNum: "",
      voucherDate: moment().format("DD-MM-YYYY"),
      placeOfSupply: "",
      orderDetails: [],
      taxableAmount: "",
      sGstTot: "",
      cGstTot: "",
      iGstTot: "",
      roundOff: "",
      grossWtTOt: "",
      netWtTOt: "",
      fineWtTot: "",
      totalInvoiceAmt: "",
      TDSTCSVoucherNum: "",
      ledgerName: "",
      taxAmount: "",
      metNarration: "",
      accNarration: "",
      balancePayable: "",
    });

    setFormValues([
      {
        stockCode: "",
        // stockCodeData: [],
        categoryName: "",
        // categoryData: [],
        // HSNdata: [],
        selectedHsn: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        fineGold: "",
        rate: "",
        amount: "",
        CGSTPer: "",
        SGSTPer: "",
        IGSTPer: "",
        CGSTval: "",
        SGSTval: "",
        IGSTVal: "",
        Total: "",
        errors: {
          stockCode: null,
          categoryName: null,
          selectedHsn: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          fineGold: null,
          rate: null,
          amount: null,
          CGSTPer: null,
          SGSTPer: null,
          IGSTPer: null,
          CGSTval: null,
          SGSTval: null,
          IGSTVal: null,
          Total: null,
        },
      },
      {
        stockCode: "",
        // stockCodeData: [],
        categoryName: "",
        // categoryData: [],
        // HSNdata: [],
        selectedHsn: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        fineGold: "",
        rate: "",
        amount: "",
        CGSTPer: "",
        SGSTPer: "",
        IGSTPer: "",
        CGSTval: "",
        SGSTval: "",
        IGSTVal: "",
        Total: "",
        errors: {
          stockCode: null,
          categoryName: null,
          selectedHsn: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          fineGold: null,
          rate: null,
          amount: null,
          CGSTPer: null,
          SGSTPer: null,
          IGSTPer: null,
          CGSTval: null,
          SGSTval: null,
          IGSTVal: null,
          Total: null,
        },
      },
      {
        stockCode: "",
        // stockCodeData: [],
        categoryName: "",
        // categoryData: [],
        // HSNdata: [],
        selectedHsn: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        fineGold: "",
        rate: "",
        amount: "",
        CGSTPer: "",
        SGSTPer: "",
        IGSTPer: "",
        CGSTval: "",
        SGSTval: "",
        IGSTVal: "",
        Total: "",
        errors: {
          stockCode: null,
          categoryName: null,
          selectedHsn: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          fineGold: null,
          rate: null,
          amount: null,
          CGSTPer: null,
          SGSTPer: null,
          IGSTPer: null,
          CGSTval: null,
          SGSTval: null,
          IGSTVal: null,
          Total: null,
        },
      },
      {
        stockCode: "",
        // stockCodeData: [],
        categoryName: "",
        // categoryData: [],
        // HSNdata: [],
        selectedHsn: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        fineGold: "",
        rate: "",
        amount: "",
        CGSTPer: "",
        SGSTPer: "",
        IGSTPer: "",
        CGSTval: "",
        SGSTval: "",
        IGSTVal: "",
        Total: "",
        errors: {
          stockCode: null,
          categoryName: null,
          selectedHsn: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          fineGold: null,
          rate: null,
          amount: null,
          CGSTPer: null,
          SGSTPer: null,
          IGSTPer: null,
          CGSTval: null,
          SGSTval: null,
          IGSTVal: null,
          Total: null,
        },
      },
    ]);
  }

  function findClosestPrevDate(arr, target) {
    // console.log(arr.length);
    let targetDate = new Date(target);
    let previousDates = arr.filter(
      (e) => targetDate - new Date(e.change_date) >= 0
    );
    // console.log(previousDates)

    if (previousDates.length === 1) {
      return previousDates[0];
    }

    //nearest date in rate and date textfield
    let sortedPreviousDates = previousDates.sort(
      (a, b) => Date.parse(b.change_date) - Date.parse(a.change_date)
    );
    // console.log(sortedPreviousDates)

    return sortedPreviousDates[0] || null;
  }

  function handleLedgerChange(value) {
    setLegderAmount(0);
    setLedgerName(value);
    setLedgerNmErr("");

    const index = ledgerData.findIndex((element) => element.id === value.value);
    console.log(index);

    if (index > -1) {
      let r1 = findClosestPrevDate(
        ledgerData[index].LedgerRate,
        moment().format("YYYY-MM-DD")
      );
      setRateValue(r1.rate);
      setRateValErr("");
      getTdsTcsVoucherNum(ledgerData[index].id);
    }
  }

  const handleNarrationClick = () => {
    console.log("handleNarr", narrationFlag);
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        flag: 1,
        id: idToBeView.id,
        metal_narration: metalNarration,
        account_narration: accNarration,
      };
      //call update Api Here
      // console.log("Api Call")
      UpdateNarration(body)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            dispatch(Actions.showMessage({ message: response.data.message }));

            setLoading(false);
          } else {
            setLoading(false);

            dispatch(Actions.showMessage({ message: response.data.message }));
          }
        })
        .catch((error) => {
          setLoading(false);

          console.log(error);
          handleError(error, dispatch, {
            api: "api/admin/voucher",
            body: body,
          });
        });
    }
    setNarrationFlag(!narrationFlag);
  };

  function handlePartyChange(value) {
    resetForm();
    setSelectedVendor(value);
    setSelectedVendorErr("");
    setAdjustedRate(false);
    setLedgerName("");
    setLedgerNmErr("");
    setLedgerData([]);
    setRateValue("");
    setRateValErr("");
    setLegderAmount(0);
    setLedgerAmtErr("");
    setFinalAmount("");
    setTdsTcsVou("");

    const index = vendorData.findIndex((element) => element.id === value.value);
    console.log(index);
    console.log(vendorData);

    if (index > -1) {
      setFirmName(vendorData[index].firm_name);
      setAddress(vendorData[index].address);
      setSupplierGstUinNum(vendorData[index].gst_number);
      setSupPanNum(vendorData[index].pan_number);
      setSupState(vendorData[index].state_name.name);
      setSupCountry(vendorData[index].country_name.name);
      setFirmNameErr("");
      setVendorStateId(vendorData[index].state_name.id);

      setIs_tds_tcs(vendorData[index].is_tds_tcs);
      console.log(vendorData[index].is_tds_tcs);
      if (vendorData[index].is_tds_tcs != 0) {
        getLedger(vendorData[index].is_tds_tcs);
      } else {
        setTdsTcsVou("");
        setLedgerName("");
        setLedgerData([]);
        setRateValue("");
        setPrintObj({
          ...printObj,
          is_tds_tcs: vendorData[index].is_tds_tcs,
          stateId: vendorStateId,
          supplierName: vendorData[index].firm_name,
          supAddress: vendorData[index].address,
          supplierGstUinNum: vendorData[index].gst_number,
          supPanNum: vendorData[index].pan_number,
          supState: vendorData[index].state_name.name,
          supCountry: vendorData[index].country_name.name,
          supStateCode: vendorData[index].gst_number
            ? vendorData[index].gst_number.substring(0, 2)
            : "",
          // purcVoucherNum: "",
          // partyInvNum: "",
          voucherDate: moment().format("DD-MM-YYYY"),
          placeOfSupply: vendorData[index].state_name.name,
          orderDetails: [],
          taxableAmount: "",
          sGstTot: "",
          cGstTot: "",
          iGstTot: "",
          roundOff: "",
          grossWtTOt: "",
          netWtTOt: "",
          fineWtTot: "",
          totalInvoiceAmt: "",
          TDSTCSVoucherNum: "",
          ledgerName: "",
          taxAmount: ledgerAmount,
          metNarration: "",
          accNarration: "",
          balancePayable: totalInvoiceAmount,
        });
      }
      setLegderAmount(0); //everything is goinf to reset so 0
    }
    SelectRef.current.focus();
    // getRateFixVendorWise(value.value);
    getFixedRateofWeight(value.value);
  }

  function handleClientPartyChange(value) {
    setSelectedClient(value);
    setSelectedClientErr("");
    setSelectedClientFirm("");
    setSelectedClientFirmErr("");
    setLedgerName("");
    setLedgerNmErr("");
    setLedgerData([]);
    setRateValue("");
    setRateValErr("");
    setLegderAmount(0);
    setLedgerAmtErr("");
    setFinalAmount("");
    setTdsTcsVou("");
    setAdjustedRate(false);
    resetForm();

    let findIndex = clientData.findIndex((item) => item.id === value.value);
    if (findIndex > -1) {
      getClientCompanies(value.value);
    }
  }

  function handleClientFirmChange(value) {
    resetForm();
    setLedgerName("");
    setLedgerNmErr("");
    setLedgerData([]);
    setRateValue("");
    setRateValErr("");
    setLegderAmount(0);
    setLedgerAmtErr("");
    setFinalAmount("");
    setTdsTcsVou("");
    setSelectedClientFirm(value);
    setSelectedClientFirmErr("");
    getFixedRateofWeightClient(value.value);

    const index = clientFirmData.findIndex(
      (element) => element.id === value.value
    );
    console.log(index);
    console.log(clientFirmData);

    if (index > -1) {
      setFirmName(clientFirmData[index].company_name);
      setAddress(clientFirmData[index].address);
      setSupplierGstUinNum(clientFirmData[index].gst_number);
      setSupPanNum(clientFirmData[index].pan_number);
      setSupState(clientFirmData[index].StateName.name);
      setSupCountry(clientFirmData[index].CountryName.name);
      setVendorStateId(clientFirmData[index].state);
      setIs_tds_tcs(clientFirmData[index].is_tds_tcs);
      console.log(clientFirmData[index].is_tds_tcs);
      if (clientFirmData[index].is_tds_tcs != 0) {
        getLedger(clientFirmData[index].is_tds_tcs);
      } else {
        setTdsTcsVou("");
        setLedgerName("");
        setLedgerData([]);
        setRateValue("");
        setPrintObj({
          ...printObj,
          is_tds_tcs: clientFirmData[index].is_tds_tcs,
          stateId: vendorStateId,
          supplierName: clientFirmData[index].company_name,
          supAddress: clientFirmData[index].address,
          supplierGstUinNum: clientFirmData[index].gst_number,
          supPanNum: clientFirmData[index].pan_number,
          supState: clientFirmData[index].StateName.name,
          supCountry: clientFirmData[index].CountryName.name,
          supStateCode: clientFirmData[index].gst_number
            ? clientFirmData[index].gst_number.substring(0, 2)
            : "",
          // purcVoucherNum: "",
          // partyInvNum: "",
          voucherDate: moment().format("DD-MM-YYYY"),
          placeOfSupply: clientFirmData[index].StateName.name,
          orderDetails: [],
          taxableAmount: "",
          sGstTot: "",
          cGstTot: "",
          iGstTot: "",
          roundOff: "",
          grossWtTOt: "",
          netWtTOt: "",
          fineWtTot: "",
          totalInvoiceAmt: "",
          TDSTCSVoucherNum: "",
          ledgerName: "",
          taxAmount: ledgerAmount,
          metNarration: "",
          accNarration: "",
          balancePayable: totalInvoiceAmount,
        });
      }
      setLegderAmount(0); //everything is goinf to reset so 0
    }
    SelectRef.current.focus();
  }

  function getLedger(tcstds) {
    if (tcstds == 2) {
      var api = `api/ledgerMastar/tds/1`;
    } else if (tcstds == 1) {
      var api = `api/ledgerMastar/tcs/1`;
    }

    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setLedgerData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: api });
      });
  }

  function getTdsTcsVoucherNum(ledgerMasterId) {
    console.log("getTdsTcsVoucherNum", ledgerMasterId);
    axios
      .get(
        Config.getCommonUrl() +
        `api/metalpurchase/get/voucher/${ledgerMasterId}`
      )
      .then((response) => {
        console.log(response);

        if (response.data.success === true) {
          if (selectedVendorClient.value === 1) {
            var index = vendorData.findIndex(
              (element) => element.id === selectedVendor.value
            );
            console.log(index);
            var clientVendor = vendorData[index];
          } else {
            var index = clientFirmData.findIndex(
              (element) => element.id === selectedClientFirm.value
            );
            console.log(index);
            var clientVendor = clientFirmData[index];
          }
          console.log(clientVendor);
          if (Object.keys(response.data.data).length !== 0) {
            setTdsTcsVou(response.data.data.voucherNo);
          } else {
            setTdsTcsVou("");
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: `api/metalpurchase/get/voucher/${ledgerMasterId}`,
        });
      });
  }

  function getFixedRateofWeight(vendorId) {
    axios
      .get(Config.getCommonUrl() + `api/ratefix/vendor/balance/1/${vendorId}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setBalanceRfixData(response.data.data);
          setTempApiWeight(response.data.data.totalWeight);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: `api/ratefix/vendor/balance/1/${vendorId}`,
        });
      });
  }

  function getFixedRateofWeightClient(clientCompId) {
    axios
      .get(
        Config.getCommonUrl() + `api/ratefix/vendor/balance/2/${clientCompId}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setBalanceRfixData(response.data.data);
          setTempApiWeight(response.data.data.totalWeight);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: `api/ratefix/vendor/balance/2/${clientCompId}`,
        });
      });
  }

  function handleRateFixChange() {
    // setRateFixSelected(value);
    setSelectedRateFixErr("");

    if (partyNameValidation()) {
      setRfModalOpen(true);
      // console.log(adjustedRate)
      if (adjustedRate === false) {
        handleRateValChange(false);
      } else {
        displayChangedRate();
      }
    }
  }

  function displayChangedRate() {
    console.log("displayChangedRate", balRfixViewData);
    if (balRfixViewData !== "") {
      console.log(balRfixViewData);
      function sum(prev, next) {
        return prev + next;
      }

      function usedTotWeight(item) {
        return parseFloat(item.usedWeight);
      }

      function fineGold(item) {
        return parseFloat(item.fineGold);
      }
      setAvgeRateErr("");
      // let FinalWeight = 0;//user input total weight
      let FinalWeight = parseFloat(
        formValues
          .filter((data) => data.fineGold !== "")
          .map(fineGold)
          .reduce(sum, 0)
      ).toFixed(3);

      if (FinalWeight === 0) {
        return;
      }
      console.log("FinalWeight", FinalWeight);
      // setTempRate("")
      let finalRate = 0;
      // let totalRateOfWeight = 0;
      // let totalWeight = 0;
      let displayArray = [];

      for (const x of balRfixViewData) {
        // totalRateOfWeight =
        //   totalRateOfWeight + parseFloat(x.rate) * parseFloat(x.weight);
        // totalWeight = totalWeight + parseFloat(x.weight);

        displayArray.push({
          id: x.id,
          date: x.date,
          checked: x.checked,
          rate: parseFloat(x.rate).toFixed(3),
          weight: parseFloat(x.weight).toFixed(3),
          usedWeight: parseFloat(x.usedWeight).toFixed(3),
          balance: parseFloat(x.balance).toFixed(3),
          utiliseErr: "",
        });
      }

      // console.log("totalRateOfWeight", totalRateOfWeight);
      // console.log("totalWeight", totalWeight);

      // let finalRate = 0;
      for (const x of displayArray) {
        finalRate = finalRate + x.usedWeight * x.rate;
      }
      console.log(finalRate);
      console.log(finalRate / fineGoldTotal);
      console.log(fineGoldTotal);
      // let avRate =
      //     (totalRateOfWeight + parseFloat(value) * parseFloat(shortageRfix)) /
      //     parseFloat(fineGoldTotal);
      let totUtilise = displayArray
        .filter((data) => data.usedWeight !== "")
        .map(usedTotWeight)
        .reduce(sum, 0);

      setUtiliseTotal(parseFloat(totUtilise).toFixed(3));

      let tempShortageRfix = parseFloat(
        parseFloat(fineGoldTotal) - parseFloat(totUtilise)
      ).toFixed(3);

      if (!isNaN(tempShortageRfix)) {
        setShortageRfix(parseFloat(tempShortageRfix).toFixed(3));
      } else {
        setShortageRfix("");
      }

      let tTempRate = tempRate;
      if (tempShortageRfix === "0.000") {
        setTempRate("");
        tTempRate = 0;
      }
      setBalRfixViewData(displayArray);

      if (finalRate === 0) {
        console.log("if", tempRate, fineGoldTotal, tempShortageRfix);

        let avRate =
          (finalRate + parseFloat(tempRate) * parseFloat(tempShortageRfix)) /
          parseFloat(fineGoldTotal);

        if (!isNaN(avRate)) {
          setAvgeRate(parseFloat(avRate).toFixed(3));
          setNewRate(parseFloat(avRate).toFixed(3));
        } else {
          setAvgeRate("");
          setNewRate("");
        }
      } else {
        console.log("else");
        if (parseFloat(fineGoldTotal) > tempApiWeight) {
          console.log("if");
          setAvgeRate(
            parseFloat(
              parseFloat(finalRate) +
              parseFloat(tempRate) / parseFloat(fineGoldTotal)
            ).toFixed(3)
          );
          setNewRate(
            parseFloat(
              parseFloat(finalRate) +
              parseFloat(tempRate) / parseFloat(fineGoldTotal)
            ).toFixed(3)
          );
        } else {
          console.log("else");
          let avRate =
            (finalRate + parseFloat(tTempRate) * parseFloat(tempShortageRfix)) /
            parseFloat(fineGoldTotal);

          if (!isNaN(avRate)) {
            setAvgeRate(parseFloat(avRate).toFixed(3));
            setNewRate(parseFloat(avRate).toFixed(3));
          } else {
            setAvgeRate("");
            setNewRate("");
          }
        }
      }
    }
  }

  function handleRateValChange(changeTotals) {
    console.log("handleRateValChange", balanceRfixData);

    if (balanceRfixData !== "") {
      function sum(prev, next) {
        return prev + next;
      }

      function usedTotWeight(item) {
        return parseFloat(item.usedWeight);
      }

      function fineGold(item) {
        return parseFloat(item.fineGold);
      }

      // let FinalWeight = 0;//user input total weight
      let FinalWeight = formValues
        .filter((data) => data.fineGold !== "")
        .map(fineGold)
        .reduce(sum, 0);

      // if (FinalWeight === 0) {
      setNewRate("");
      setTempRate("");
      setAvgeRate("");
      // return;
      // }
      setShortageRfix(parseFloat(FinalWeight).toFixed(3));
      console.log("FinalWeight", FinalWeight);
      // setTempRate("")
      // let finalRate = 0;
      let totalRateOfWeight = 0;
      let totalWeight = 0;
      let displayArray = [];

      for (const x of balanceRfixData.weight) {
        totalRateOfWeight =
          totalRateOfWeight + parseFloat(x.rate) * parseFloat(x.weight);
        totalWeight = totalWeight + parseFloat(x.weight);

        displayArray.push({
          id: x.id,
          date: x.date,
          checked: false,
          rate: parseFloat(x.rate).toFixed(3),
          weight: parseFloat(x.weight).toFixed(3),
          usedWeight: 0,
          balance: parseFloat(x.weight).toFixed(3),
          utiliseErr: "",
        });
      }

      console.log("totalRateOfWeight", totalRateOfWeight);
      console.log("totalWeight", totalWeight);

      let totUtilise = displayArray
        .filter((data) => data.usedWeight !== "")
        .map(usedTotWeight)
        .reduce(sum, 0);

      setUtiliseTotal(parseFloat(totUtilise).toFixed(3));
      //   console.log(totUtilise);
      //   setShortageRfix(0);

      //   console.log(displayArray);
      setBalRfixViewData(displayArray);
    } else {
      console.log("no data db");
      //manually enter, have disabled variable
      // setShortageRfix("");
      setTempRate("");
      // setAvgeRate("");
      if (fineGoldTotal !== "") {
        setShortageRfix(parseFloat(fineGoldTotal).toFixed(3));
      } else {
        setShortageRfix("");
      }
      setCanEnterVal(true);
    }
  }

  function calculateAfterRate() {
    formValues
      .filter((element) => element.stockCode !== "")
      .map((item, i) => {
        let newFormValues = [...formValues];
        // console.log("newFormValues", newFormValues.length)
        // console.log(newFormValues)
        // newFormValues[i][e.target.name] = e.target.value;

        // let nm = e.target.name;
        // let val = e.target.value;

        if (newFormValues[i].stockCode !== "") {
          //if grossWeight or putity change
          // if (nm === "grossWeight") {
          if (
            newFormValues[i].netWeight !== "" &&
            newFormValues[i].purity !== ""
          ) {
            newFormValues[i].fineGold = parseFloat(
              (parseFloat(newFormValues[i].netWeight) *
                parseFloat(newFormValues[i].purity)) /
              100
            ).toFixed(3);

            // let findIndex = stockCodeData.findIndex(
            //   (item) =>
            //     item.stock_name_code.id === newFormValues[i].stockCode.value
            // );
            // // console.log(findIndex);
            // if (findIndex > -1) {
            //   newFormValues[i].categoryName =
            //     stockCodeData[findIndex].stock_name;
            //   newFormValues[i].errors.categoryName = null;

            //   newFormValues[i].selectedHsn =
            //     stockCodeData[findIndex].hsn_master.hsn_number;

            //   if (vendorStateId === 12) {
            //     newFormValues[i].CGSTPer =
            //       parseFloat(stockCodeData[findIndex].hsn_master.gst) / 2;
            //     newFormValues[i].SGSTPer =
            //       parseFloat(stockCodeData[findIndex].hsn_master.gst) / 2;
            //   } else {
            //     newFormValues[i].IGSTPer = parseFloat(
            //       stockCodeData[findIndex].hsn_master.gst
            //     );
            //   }
            // }
          }

          // if (rateFixSelected !== "") {
          newFormValues[i].rate = parseFloat(newRate).toFixed(3);
          // }

          if (
            newFormValues[i].rate !== "" &&
            newFormValues[i].fineGold !== ""
          ) {
            newFormValues[i].amount = parseFloat(
              (parseFloat(newFormValues[i].rate) *
                parseFloat(newFormValues[i].fineGold)) /
              10
            ).toFixed(3);
            // console.log("amount",newFormValues[i].amount)
            // console.log("calculation",parseFloat(newFormValues[i].rate) *
            // parseFloat(newFormValues[i].fineGold))
          }

          if (vendorStateId === 12) {
            // console.log("vendorStateId cond")
            if (
              newFormValues[i].amount !== "" &&
              newFormValues[i].CGSTPer !== ""
            ) {
              // console.log("if COnd")
              newFormValues[i].CGSTval = parseFloat(
                (parseFloat(newFormValues[i].amount) *
                  parseFloat(newFormValues[i].CGSTPer)) /
                100
              ).toFixed(3);
              // console.log("CGSTval ",(newFormValues[i].amount * newFormValues[i].CGSTPer) / 100)

              newFormValues[i].SGSTval = parseFloat(
                (parseFloat(newFormValues[i].amount) *
                  parseFloat(newFormValues[i].SGSTPer)) /
                100
              ).toFixed(3);
              newFormValues[i].Total = parseFloat(
                parseFloat(newFormValues[i].amount) +
                parseFloat(newFormValues[i].SGSTval) +
                parseFloat(newFormValues[i].CGSTval)
              ).toFixed(3);
              // console.log(
              //   parseFloat(newFormValues[i].amount),
              //   parseFloat(newFormValues[i].SGSTval),
              //   parseFloat(newFormValues[i].CGSTval)
              // );
            } else {
              newFormValues[i].CGSTval = "";
              newFormValues[i].SGSTval = "";
              newFormValues[i].Total = "";
            }
          } else {
            if (
              newFormValues[i].amount !== "" &&
              newFormValues[i].IGSTPer !== ""
            ) {
              newFormValues[i].IGSTVal = parseFloat(
                (parseFloat(newFormValues[i].amount) *
                  parseFloat(newFormValues[i].IGSTPer)) /
                100
              ).toFixed(3);
              newFormValues[i].Total = parseFloat(
                parseFloat(newFormValues[i].amount) +
                parseFloat(newFormValues[i].IGSTVal)
              ).toFixed(3);
            } else {
              newFormValues[i].IGSTVal = "";
              newFormValues[i].Total = "";
            }
          }

          function amount(item) {
            // console.log(item.amount)
            return item.amount;
          }

          // function sum(prev, next) {
          //   console.log("prev", parseFloat(prev).toFixed(3))

          //   console.log("next", parseFloat(next).toFixed(3))
          //   return parseFloat(prev).toFixed(3) + parseFloat(next).toFixed(3);
          // }

          function CGSTval(item) {
            return item.CGSTval;
          }

          function SGSTval(item) {
            return item.SGSTval;
          }

          function IGSTVal(item) {
            return item.IGSTVal;
          }

          function Total(item) {
            return item.Total;
          }

          function grossWeight(item) {
            // console.log(parseFloat(item.grossWeight));
            return parseFloat(item.grossWeight);
          }

          function fineGold(item) {
            return parseFloat(item.fineGold);
          }

          let tempFineGold = newFormValues
            .filter((item) => item.fineGold !== "")
            .map(fineGold)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
          // console.log(formValues.map(amount).reduce(sum))

          let tempAmount = newFormValues
            .filter((item) => item.amount !== "")
            .map(amount)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);
          //.reduce(sum);
          // console.log("tempAmount>>>",tempAmount.toFixed(3))
          setAmount(parseFloat(tempAmount).toFixed(3));
          setSubTotal(parseFloat(tempAmount).toFixed(3));

          let tempCgstVal;
          let tempSgstVal;
          let tempIgstVal;
          if (vendorStateId === 12) {
            tempCgstVal = newFormValues
              .filter((item) => item.CGSTval !== "")
              .map(CGSTval)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);
            // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
            setCgstVal(parseFloat(tempCgstVal).toFixed(3));

            tempSgstVal = newFormValues
              .filter((item) => item.SGSTval !== "")
              .map(SGSTval)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);
            setSgstVal(parseFloat(tempSgstVal).toFixed(3));

            setTotalGST(
              parseFloat(
                parseFloat(tempCgstVal) + parseFloat(tempSgstVal)
              ).toFixed(3)
            );
          } else {
            tempIgstVal = newFormValues
              .filter((item) => item.IGSTVal !== "")
              .map(IGSTVal)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);
            setIgstVal(parseFloat(tempIgstVal).toFixed(3));
            setTotalGST(parseFloat(tempIgstVal).toFixed(3));
          }

          let tempTotal = newFormValues
            .filter((item) => item.Total !== "")
            .map(Total)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);
          setTotal(parseFloat(tempTotal).toFixed(3));

          let tempGrossWtTot = newFormValues
            .filter((data) => data.grossWeight !== "")
            .map(grossWeight)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

          function netWeight(item) {
            // console.log(parseFloat(item.grossWeight));
            return parseFloat(item.netWeight);
          }

          let tempNetWtTot = newFormValues
            .filter((data) => data.netWeight !== "")
            .map(netWeight)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

          let tempLedgerAmount = 0;
          let tempfinalAmount = 0;
          let tempTotalInvoiceAmt = 0;

          if (parseFloat(tempTotal) > 0) {
            // let temptdsTcsAmount =0;

            if (roundOff > 5 || roundOff < -5) {
              //tempTotal is amount + gst
              tempTotalInvoiceAmt = parseFloat(
                parseFloat(tempTotal) + parseFloat(roundOff)
              ).toFixed(3);

              setTotalInvoiceAmount(tempTotalInvoiceAmt);
            } else {
              tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);

              setTotalInvoiceAmount(tempTotalInvoiceAmt);
            }

            if (is_tds_tcs == 1) {
              //1 is tcs, 2 means tds
              // tempLedgerAmount = parseFloat(
              //   (tempTotalInvoiceAmt * rateValue) / 100
              // ).toFixed(3); //with gst on total invoice amount
              // console.log(tempLedgerAmount);
              //if tcs then enter amount manually
              tempLedgerAmount = 0;

              tempfinalAmount = parseFloat(
                parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)
              ).toFixed(3);
            } else if (is_tds_tcs == 2) {
              //tds
              tempLedgerAmount = parseFloat(
                (parseFloat(tempAmount) * rateValue) / 100
              ).toFixed(3); //calculating before gst, on total amount only
              console.log(tempLedgerAmount);
              tempfinalAmount = parseFloat(
                parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount)
              ).toFixed(3);
            } else {
              tempfinalAmount = parseFloat(tempTotalInvoiceAmt).toFixed(3);
            }

            setLegderAmount(parseFloat(tempLedgerAmount).toFixed(3));

            setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));
          } else {
            setTotalInvoiceAmount(0);
            setLegderAmount(0);
            setFinalAmount(0);
          }

          // let tempCgstVal;
          // let tempSgstVal;
          // let tempIgstVal;

          setPrintObj({
            ...printObj,
            stateId: vendorStateId,
            orderDetails: newFormValues,
            is_tds_tcs: is_tds_tcs,
            taxableAmount: parseFloat(tempAmount).toFixed(3),
            sGstTot: parseFloat(tempSgstVal).toFixed(3),
            cGstTot: parseFloat(tempCgstVal).toFixed(3),
            iGstTot: parseFloat(tempIgstVal).toFixed(3),
            roundOff: roundOff,
            grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
            netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
            fineWtTot: parseFloat(tempFineGold).toFixed(3),
            totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
            taxAmount: parseFloat(tempLedgerAmount).toFixed(3),
            balancePayable: parseFloat(tempfinalAmount).toFixed(3),
            ledgerName: ledgerName.label,
          });
          setFormValues(newFormValues);
        }
        return true;
      });
  }

  function handleOppAccChange(value) {
    setOppositeAccSelected(value);
    setSelectedOppAccErr("");
  }

  function handleTabChange(e, index) {
    // console.log("handleTabChange", e, index);
    // onKeyDown={handleTabChange}
    var keyCode = 0;
    if (document.selection) {
      keyCode = e.keyCode;
    } else {
      keyCode = e.which;
    }
    // console.log("keyCode", keyCode);
    if (keyCode === 9) {
      if (formValues[index].stockCode === "") {
        const btn = document.getElementById("rFixBtn");
        // console.log(btn);
        setTimeout(() => btn.focus(), 0);
      }
    }
  }

  const prevContactIsValid = () => {
    if (formValues.length === 0) {
      return true;
    }

    const someEmpty = formValues
      .filter((element) => element.stockCode !== "")
      .some((item) => {
        return (
          item.stockCode === "" ||
          item.categoryName === "" ||
          item.grossWeight === "" ||
          item.grossWeight == 0 ||
          item.netWeight === "" ||
          item.netWeight == 0
        );
      });

    console.log(someEmpty.length);
    console.log(someEmpty, "some");

    //   grossWeight: "",
    //   netWeight: "",
    //   purity: "",
    //   fineGold: "",
    //   rate: "",
    //   amount: "",
    //   CGSTPer: "",
    //   SGSTPer: "",
    //   IGSTPer: "",
    //   CGSTval: "",
    //   SGSTval: "",
    //   IGSTVal: "",
    //   Total: "",

    console.log(someEmpty);
    if (someEmpty.length === undefined && someEmpty === false) {
      const allPrev = [...formValues];
      // console.log(item);

      let stockCode = formValues[0].stockCode;
      if (stockCode === "") {
        allPrev[0].errors.stockCode = "Please Select Stock Code";
      } else {
        allPrev[0].errors.stockCode = null;
      }

      let categoryName = formValues[0].categoryName;
      if (categoryName === "") {
        allPrev[0].errors.categoryName = "Please Select Valid Category";
      } else {
        allPrev[0].errors.categoryName = null;
      }

      let weightRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
      let gWeight = formValues[0].grossWeight;
      if (!gWeight || weightRegex.test(gWeight) === false || gWeight == 0) {
        allPrev[0].errors.grossWeight = "Enter Gross Weight!";
      } else {
        allPrev[0].errors.grossWeight = null;
      }

      let netWeight = formValues[0].netWeight;
      if (
        !netWeight ||
        weightRegex.test(netWeight) === false ||
        netWeight == 0
      ) {
        allPrev[0].errors.netWeight = "Enter Net Weight!";
      } else {
        allPrev[0].errors.netWeight = null;
      }

      // console.log(allPrev[index]);
      setFormValues(allPrev);
      // return false;
    }

    if (someEmpty) {
      formValues
        .filter((element) => element.stockCode !== "")
        .map((item, index) => {
          const allPrev = [...formValues];
          // console.log(item);

          let stockCode = formValues[index].stockCode;
          if (stockCode === "") {
            allPrev[index].errors.stockCode = "Please Select Stock Code";
          } else {
            allPrev[index].errors.stockCode = null;
          }

          let categoryName = formValues[index].categoryName;
          if (categoryName === "") {
            allPrev[index].errors.categoryName = "Please Select Valid Category";
          } else {
            allPrev[index].errors.categoryName = null;
          }

          let weightRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
          let gWeight = formValues[index].grossWeight;
          if (!gWeight || weightRegex.test(gWeight) === false || gWeight == 0) {
            allPrev[index].errors.grossWeight = "Enter Gross Weight!";
          } else {
            allPrev[index].errors.grossWeight = null;
          }

          // let netWeight = formValues[index].netWeight;
          // if (!netWeight || weightRegex.test(netWeight) === false) {
          //   allPrev[index].errors.netWeight = "Enter Net Weight!";
          // } else {
          //   allPrev[index].errors.netWeight = null;
          // }

          // console.log(allPrev[index]);
          setFormValues(allPrev);
          return null;
        });
    }

    return !someEmpty;
  };

  let handlerBlur = (i, e) => {
    console.log("handlerBlur");
    let newFormValues = [...formValues];

    let nm = e.target.name;
    let val = e.target.value;
    // console.log("val", val)
    if (isNaN(val) || val === "") {
      return;
    }
    if (nm === "grossWeight") {
      newFormValues[i].grossWeight = parseFloat(val).toFixed(3);
      newFormValues[i].netWeight = parseFloat(val).toFixed(3);
    }
    setFormValues(newFormValues);
  };

  let handleChange = (i, e) => {
    // console.log("handleChange");
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;

    let nm = e.target.name;
    let val = e.target.value;

    //if grossWeight or putity change
    if (nm === "grossWeight") {
      setNewRate("");
      setAdjustedRate(false);
      newFormValues[i].netWeight = val;

      if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
        newFormValues[i].fineGold = parseFloat(
          (parseFloat(newFormValues[i].netWeight) *
            parseFloat(newFormValues[i].purity)) /
          100
        ).toFixed(3);
      }
      newFormValues[i].errors.grossWeight = "";
      newFormValues[i].errors.netWeight = "";
      if (val == 0) {
        newFormValues[i].errors.grossWeight = "Enter valid Gross Weight";
        newFormValues[i].errors.netWeight = "Enter valid Net Weight";
      }
      if (val === "" || val == 0) {
        newFormValues[i].fineGold = "";
        newFormValues[i].amount = "";
        setAmount("");
        setSubTotal("");
        setCgstVal("");
        setSgstVal("");
        setIgstVal("");
        setTotalGST("");
        setTotal("");
        setTotalGrossWeight("");
        setTotalNetWeight("");
        setFineGoldTotal("");
      }

      newFormValues[i].rate = 0;
    }

    if (newRate !== "") {
      newFormValues[i].rate = parseFloat(newRate).toFixed(3);
    }

    if (newFormValues[i].rate !== "" && newFormValues[i].fineGold !== "") {
      newFormValues[i].amount = parseFloat(
        (parseFloat(newFormValues[i].rate) *
          parseFloat(newFormValues[i].fineGold)) /
        10
      ).toFixed(3);
    }

    if (vendorStateId === 12) {
      // console.log("vendorStateId cond")
      if (newFormValues[i].amount !== "" && newFormValues[i].CGSTPer !== "") {
        // console.log("if COnd")
        newFormValues[i].CGSTval = parseFloat(
          (parseFloat(newFormValues[i].amount) *
            parseFloat(newFormValues[i].CGSTPer)) /
          100
        ).toFixed(3);
        // console.log("CGSTval ",(newFormValues[i].amount * newFormValues[i].CGSTPer) / 100)

        newFormValues[i].SGSTval = parseFloat(
          (parseFloat(newFormValues[i].amount) *
            parseFloat(newFormValues[i].SGSTPer)) /
          100
        ).toFixed(3);
        newFormValues[i].Total = parseFloat(
          parseFloat(newFormValues[i].amount) +
          parseFloat(newFormValues[i].SGSTval) +
          parseFloat(newFormValues[i].CGSTval)
        ).toFixed(3);
        // console.log(
        //   parseFloat(newFormValues[i].amount),
        //   parseFloat(newFormValues[i].SGSTval),
        //   parseFloat(newFormValues[i].CGSTval)
        // );
      } else {
        newFormValues[i].CGSTval = "";
        newFormValues[i].SGSTval = "";
        newFormValues[i].Total = "";
      }
    } else {
      if (newFormValues[i].amount !== "" && newFormValues[i].IGSTPer !== "") {
        newFormValues[i].IGSTVal = parseFloat(
          (parseFloat(newFormValues[i].amount) *
            parseFloat(newFormValues[i].IGSTPer)) /
          100
        ).toFixed(3);
        newFormValues[i].Total = parseFloat(
          parseFloat(newFormValues[i].amount) +
          parseFloat(newFormValues[i].IGSTVal)
        ).toFixed(3);
      } else {
        newFormValues[i].IGSTVal = "";
        newFormValues[i].Total = "";
      }
    }

    function amount(item) {
      // console.log(item.amount)
      return item.amount;
    }

    function CGSTval(item) {
      return item.CGSTval;
    }

    function SGSTval(item) {
      return item.SGSTval;
    }

    function IGSTVal(item) {
      return item.IGSTVal;
    }

    function Total(item) {
      return item.Total;
    }

    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.grossWeight);
    }

    function fineGold(item) {
      return parseFloat(item.fineGold);
    }

    let tempFineGold = newFormValues
      .filter((item) => item.fineGold !== "")
      .map(fineGold)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
    // console.log(formValues.map(amount).reduce(sum))

    let tempAmount = newFormValues
      .filter((item) => item.amount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    //.reduce(sum);
    // console.log("tempAmount>>>",tempAmount.toFixed(3))
    setAmount(parseFloat(tempAmount).toFixed(3));
    setSubTotal(parseFloat(tempAmount).toFixed(3));

    let tempCgstVal;
    let tempSgstVal;
    let tempIgstVal;
    if (vendorStateId === 12) {
      tempCgstVal = newFormValues
        .filter((item) => item.CGSTval !== "")
        .map(CGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
      setCgstVal(parseFloat(tempCgstVal).toFixed(3));

      tempSgstVal = newFormValues
        .filter((item) => item.SGSTval !== "")
        .map(SGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setSgstVal(parseFloat(tempSgstVal).toFixed(3));

      setTotalGST(
        parseFloat(parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
      );
    } else {
      tempIgstVal = newFormValues
        .filter((item) => item.IGSTVal !== "")
        .map(IGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setIgstVal(parseFloat(tempIgstVal).toFixed(3));
      setTotalGST(parseFloat(tempIgstVal).toFixed(3));
    }

    let tempTotal = newFormValues
      .filter((item) => item.Total !== "")
      .map(Total)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotal(parseFloat(tempTotal).toFixed(3));

    let tempGrossWtTot = newFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

    function netWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.netWeight);
    }

    let tempNetWtTot = newFormValues
      .filter((data) => data.netWeight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

    let tempLedgerAmount = 0;
    let tempfinalAmount = 0;
    let tempTotalInvoiceAmt = 0;

    if (parseFloat(tempTotal) > 0) {
      // let temptdsTcsAmount =0;

      if (roundOff > 5 || roundOff < -5) {
        //tempTotal is amount + gst
        tempTotalInvoiceAmt = parseFloat(
          parseFloat(tempTotal) + parseFloat(roundOff)
        ).toFixed(3);

        setTotalInvoiceAmount(tempTotalInvoiceAmt);
      } else {
        tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);

        setTotalInvoiceAmount(tempTotalInvoiceAmt);
      }

      if (is_tds_tcs == 1) {
        //1 is tcs, 2 means tds
        // tempLedgerAmount = parseFloat(
        //   (tempTotalInvoiceAmt * rateValue) / 100
        // ).toFixed(3); //with gst on total invoice amount
        // console.log(tempLedgerAmount);
        //if tcs then enter amount manually
        tempLedgerAmount = 0;

        tempfinalAmount = parseFloat(
          parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)
        ).toFixed(3);
      } else if (is_tds_tcs == 2) {
        //tds
        tempLedgerAmount = parseFloat(
          (parseFloat(tempAmount) * rateValue) / 100
        ).toFixed(3); //calculating before gst, on total amount only
        console.log(tempLedgerAmount);
        tempfinalAmount = parseFloat(
          parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount)
        ).toFixed(3);
      } else {
        tempfinalAmount = parseFloat(tempTotalInvoiceAmt).toFixed(3);
      }

      setLegderAmount(parseFloat(tempLedgerAmount).toFixed(3));

      setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));
    } else {
      setTotalInvoiceAmount(0);
      setLegderAmount(0);
      setFinalAmount(0);
    }

    // let tempCgstVal;
    // let tempSgstVal;
    // let tempIgstVal;

    setPrintObj({
      ...printObj,
      stateId: vendorStateId,
      orderDetails: newFormValues,
      is_tds_tcs: is_tds_tcs,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCgstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      roundOff: roundOff,
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      fineWtTot: parseFloat(tempFineGold).toFixed(3),
      totalInvoiceAmt: tempTotalInvoiceAmt,
      taxAmount: tempLedgerAmount,
      balancePayable: parseFloat(tempfinalAmount).toFixed(3),
    });

    setFormValues(newFormValues);

    if (adjustedRate === true) {
      handleRateValChange(true);
    }
  };

  function handleRfModalClose() {
    // console.log("handle close", callApi);
    setRfModalOpen(false);
  }

  // function handleRfModalOpen() {
  //   setRfModalOpen(true);
  // }

  function handleRfixChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    // console.log("name",name,"value",value);

    if (name === "shortageRfix") {
      setShortageRfix(value);
      setShortageRfixErr("");
    } else if (name === "tempRate") {
      setTempRate(value);
      setTempRateErr("");
      setAvgeRateErr("");
      setShortageRfixErr("");
      // totalGrossWeight
      // let totalRateOfWeight = 0;
      // value > 0 &&
      if (
        value !== "" &&
        !isNaN(value) &&
        shortageRfix !== "0.000" &&
        shortageRfix !== ""
      ) {
        let totalWeight = 0;

        function sum(prev, next) {
          return prev + next;
        }

        function usedTotWeight(item) {
          return parseFloat(item.usedWeight);
        }

        let totUtilise = balRfixViewData
          .filter((data) => data.usedWeight !== "")
          .map(usedTotWeight)
          .reduce(sum, 0);

        let tempShortageRfix;
        //if utilise is more than rate fix total from api
        if (parseFloat(totUtilise) > parseFloat(tempApiWeight)) {
          tempShortageRfix = parseFloat(
            parseFloat(tempApiWeight) - parseFloat(totUtilise)
          ).toFixed(3);
          setShortageRfix(parseFloat(tempShortageRfix).toFixed(3));
        } else {
          //utilize is less than rate fix total from api
          tempShortageRfix = parseFloat(
            parseFloat(fineGoldTotal) - parseFloat(totUtilise)
          ).toFixed(3);
          setShortageRfix(parseFloat(tempShortageRfix).toFixed(3));
        }
        //before it was like if canEnterVal then and only then user enter value
        //and user entered wait is greater than api weight so here we are taking all the weight from api

        for (const x of balanceRfixData.weight) {
          // totalRateOfWeight =
          //   totalRateOfWeight + parseFloat(x.rate) * parseFloat(x.weight);
          totalWeight = totalWeight + parseFloat(x.weight);
        }

        let finalRate = 0;
        for (const x of balRfixViewData) {
          finalRate = finalRate + x.usedWeight * x.rate;
        }

        let avRate =
          (finalRate + parseFloat(value) * parseFloat(tempShortageRfix)) /
          parseFloat(fineGoldTotal);
        // console.log(avRate);

        // setAvgeRate(parseFloat(finalRate / fineGoldTotal).toFixed(3));
        // setNewRate(parseFloat(finalRate / fineGoldTotal).toFixed(3));

        // let avRate =
        //   (totalRateOfWeight + parseFloat(value) * parseFloat(shortageRfix)) /
        //   parseFloat(fineGoldTotal);

        setAvgeRate(parseFloat(avRate).toFixed(3));
        setNewRate(parseFloat(avRate).toFixed(3));
        // setTempApiWeight(totalWeight + parseFloat(shortageRfix));
      }
      // else{
      //   setAvgeRate(0);
      //   setNewRate(0);
      // }
    } else if (name === "avgRate") {
      setAvgeRate(value);
      setAvgeRateErr("");
    }
  }

  function shortageRfixValidation() {
    const Regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
    if (!shortageRfix || Regex.test(shortageRfix) === false) {
      setShortageRfixErr("Enter Valid Rate Fix");
      return false;
    }
    return true;
  }

  function tempRateValidation() {
    const Regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
    if (!tempRate || Regex.test(tempRate) === false) {
      setTempRateErr("Enter Valid Rate");
      return false;
    }
    return true;
  }

  function avgRateValidation() {
    const Regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
    if (!avgRate || Regex.test(avgRate) === false) {
      setAvgeRateErr("Enter Valid Average Rate");
      return false;
    }
    return true;
  }

  const adjustRateFix = (evt) => {
    evt.preventDefault();

    let utiliseErr = balRfixViewData.filter(
      (element) => element.utiliseErr !== ""
    );
    // console.log(utiliseErr);

    if (utiliseErr.length > 0 || popupErr !== "") {
      return;
    }
    if (parseFloat(utiliseTotal) > parseFloat(fineGoldTotal)) {
      setPopupErr("Utilize Total can not be Greater than Fine Gold");
      return;
    }
    if (parseFloat(shortageRfix) < 0) {
      setShortageRfixErr("Can Not Be Negative");
      return;
    }
    if (parseFloat(shortageRfix) > 0 && tempRate === "") {
      setTempRateErr("Enter Valid Rate");
      return;
    }
    // if(parseFloat(tempApiWeight) + parseFloat(shortageRfix) !== parseFloat(fineGoldTotal)){
    //   setPopupErr("Please Enter Remaining rate");
    //   return;
    // }

    if (canEnterVal === true) {
      if (
        shortageRfixValidation() &&
        tempRateValidation() &&
        avgRateValidation()
      ) {
        console.log("valid");
        calculateAfterRate();
        setRfModalOpen(false);
        setAdjustedRate(true);
      } else {
        console.log("invalid");
      }
    } else {
      calculateAfterRate();
      setRfModalOpen(false);
      setAdjustedRate(true);
    }
  };

  function handleChecked(event, index) {
    setPopupErr("");
    // console.log(event.target.checked);
    let tempArray = [...balRfixViewData];
    tempArray[index].checked = event.target.checked;

    if (event.target.checked === false) {
      tempArray[index].usedWeight = 0;
      tempArray[index].balance = parseFloat(tempArray[index].weight).toFixed(3);

      // console.log(finalRate / fineGoldTotal);

      if (tempRate !== "") {
        let totalWeight = 0;

        function sum(prev, next) {
          return prev + next;
        }

        function usedTotWeight(item) {
          return parseFloat(item.usedWeight);
        }

        let totUtilise = balRfixViewData
          .filter((data) => data.usedWeight !== "")
          .map(usedTotWeight)
          .reduce(sum, 0);

        let tempShortageRfix;
        //if utilise is more than rate fix total from api
        if (parseFloat(totUtilise) > parseFloat(tempApiWeight)) {
          tempShortageRfix = parseFloat(
            parseFloat(tempApiWeight) - parseFloat(totUtilise)
          ).toFixed(3);
          setShortageRfix(parseFloat(tempShortageRfix).toFixed(3));
        } else {
          //utilize is less than rate fix total from api
          tempShortageRfix = parseFloat(
            parseFloat(fineGoldTotal) - parseFloat(totUtilise)
          ).toFixed(3);
          setShortageRfix(parseFloat(tempShortageRfix).toFixed(3));
        }
        //before it was like if canEnterVal then and only then user enter value
        //and user entered wait is greater than api weight so here we are taking all the weight from api

        for (const x of balanceRfixData.weight) {
          // totalRateOfWeight =
          //   totalRateOfWeight + parseFloat(x.rate) * parseFloat(x.weight);
          totalWeight = totalWeight + parseFloat(x.weight);
        }

        let finalRate = 0;
        for (const x of balRfixViewData) {
          finalRate = finalRate + x.usedWeight * x.rate;
        }

        let avRate =
          (finalRate + parseFloat(tempRate) * parseFloat(tempShortageRfix)) /
          parseFloat(fineGoldTotal);

        setAvgeRate(parseFloat(avRate).toFixed(3));
        setNewRate(parseFloat(avRate).toFixed(3));
        setUtiliseTotal(parseFloat(totUtilise).toFixed(3));
      } else {
        let finalRate = 0;
        for (const x of tempArray) {
          finalRate = finalRate + x.usedWeight * x.rate;
        }

        setAvgeRate(parseFloat(finalRate / fineGoldTotal).toFixed(3));
        setNewRate(parseFloat(finalRate / fineGoldTotal).toFixed(3));

        function sum(prev, next) {
          return prev + next;
        }

        function usedTotWeight(item) {
          return parseFloat(item.usedWeight);
        }

        let totUtilise = tempArray
          .filter((data) => data.usedWeight !== "")
          .map(usedTotWeight)
          .reduce(sum, 0);

        //if utilise is more than rate fix total from api
        if (parseFloat(totUtilise) > parseFloat(tempApiWeight)) {
          setShortageRfix(
            parseFloat(
              parseFloat(tempApiWeight) - parseFloat(totUtilise)
            ).toFixed(3)
          );
        } else {
          //utilize is less than rate fix total from api
          setShortageRfix(
            parseFloat(
              parseFloat(fineGoldTotal) - parseFloat(totUtilise)
            ).toFixed(3)
          );
        }
        setUtiliseTotal(parseFloat(totUtilise).toFixed(3));
      }
    }
    // console.log(tempArray)
    setBalRfixViewData(tempArray);
  }

  function haldleUtilizeChange(event, index) {
    // setUtiliseErr("");
    setPopupErr("");

    let val = event.target.value;
    let tempArray = [...balRfixViewData];
    tempArray[index].usedWeight = val;
    tempArray[index].utiliseErr = "";

    if (isNaN(val)) {
      // setUtiliseErr("please Enter Valid Utilize");
      tempArray[index].utiliseErr = "please Enter Valid Utilize";
      setBalRfixViewData(tempArray);
      return;
    }
    if (parseFloat(val) > parseFloat(tempArray[index].weight)) {
      // setUtiliseErr("Utilize cannot be Greater than Fine");
      tempArray[index].utiliseErr = "Utilize cannot be Greater than Fine";
      setBalRfixViewData(tempArray);
      return;
    }

    if (val === "") {
      tempArray[index].balance = parseFloat(tempArray[index].weight).toFixed(3);
    } else {
      tempArray[index].balance = parseFloat(
        parseFloat(tempArray[index].weight) - parseFloat(val)
      ).toFixed(3);
    }

    if (tempRate !== "") {
      let totalWeight = 0;

      function sum(prev, next) {
        return prev + next;
      }

      function usedTotWeight(item) {
        return parseFloat(item.usedWeight);
      }

      let totUtilise = balRfixViewData
        .filter((data) => data.usedWeight !== "")
        .map(usedTotWeight)
        .reduce(sum, 0);

      let tempShortageRfix;
      //if utilise is more than rate fix total from api
      if (parseFloat(totUtilise) > parseFloat(tempApiWeight)) {
        tempShortageRfix = parseFloat(
          parseFloat(tempApiWeight) - parseFloat(totUtilise)
        ).toFixed(3);
        setShortageRfix(parseFloat(tempShortageRfix).toFixed(3));
      } else {
        //utilize is less than rate fix total from api
        tempShortageRfix = parseFloat(
          parseFloat(fineGoldTotal) - parseFloat(totUtilise)
        ).toFixed(3);
        setShortageRfix(parseFloat(tempShortageRfix).toFixed(3));
      }
      //before it was like if canEnterVal then and only then user enter value
      //and user entered wait is greater than api weight so here we are taking all the weight from api

      for (const x of balanceRfixData.weight) {
        // totalRateOfWeight =
        //   totalRateOfWeight + parseFloat(x.rate) * parseFloat(x.weight);
        totalWeight = totalWeight + parseFloat(x.weight);
      }

      let finalRate = 0;
      for (const x of balRfixViewData) {
        finalRate = finalRate + x.usedWeight * x.rate;
      }

      let avRate =
        (finalRate + parseFloat(tempRate) * parseFloat(tempShortageRfix)) /
        parseFloat(fineGoldTotal);

      setAvgeRate(parseFloat(avRate).toFixed(3));
      setNewRate(parseFloat(avRate).toFixed(3));
      setUtiliseTotal(parseFloat(totUtilise).toFixed(3));
    } else {
      let finalRate = 0;
      for (const x of tempArray) {
        finalRate = finalRate + x.usedWeight * x.rate;
      }

      if (
        fineGoldTotal != 0 &&
        finalRate != 0 &&
        fineGoldTotal !== "NaN" &&
        finalRate !== "NaN"
      ) {
        setAvgeRate(parseFloat(finalRate / fineGoldTotal).toFixed(3));
        setNewRate(parseFloat(finalRate / fineGoldTotal).toFixed(3));
      } else {
        setAvgeRate(0);
        setNewRate(0);
      }

      function sum(prev, next) {
        return prev + next;
      }

      function usedTotWeight(item) {
        return parseFloat(item.usedWeight);
      }

      let totUtilise = tempArray
        .filter((data) => data.usedWeight !== "")
        .map(usedTotWeight)
        .reduce(sum, 0);

      //if utilise is more than rate fix total from api
      if (parseFloat(totUtilise) > parseFloat(tempApiWeight)) {
        setShortageRfix(
          parseFloat(
            parseFloat(tempApiWeight) - parseFloat(totUtilise)
          ).toFixed(3)
        );
      } else {
        //utilize is less than rate fix total from api
        setShortageRfix(
          parseFloat(
            parseFloat(fineGoldTotal) - parseFloat(totUtilise)
          ).toFixed(3)
        );
      }

      setUtiliseTotal(parseFloat(totUtilise).toFixed(3));
    }

    setShortageRfixErr("");
    setTempRateErr("");
    setBalRfixViewData(tempArray);
  }

  function deleteHandler(index) {
    console.log(index);
    setAdjustedRate(false);
    setNewRate("");
    let newFormValues = [...formValues];

    newFormValues[index].stockCode = "";
    newFormValues[index].categoryName = "";
    newFormValues[index].selectedHsn = "";
    newFormValues[index].grossWeight = "";
    newFormValues[index].netWeight = "";
    newFormValues[index].purity = "";
    newFormValues[index].fineGold = "";
    newFormValues[index].rate = "";
    newFormValues[index].amount = "";
    newFormValues[index].CGSTPer = "";
    newFormValues[index].SGSTPer = "";
    newFormValues[index].IGSTPer = "";
    newFormValues[index].CGSTval = "";
    newFormValues[index].SGSTval = "";
    newFormValues[index].IGSTVal = "";
    newFormValues[index].Total = "";

    newFormValues[index].errors.stockCode = null;
    newFormValues[index].errors.categoryName = null;
    newFormValues[index].errors.selectedHsn = null;
    newFormValues[index].errors.grossWeight = null;
    newFormValues[index].errors.netWeight = null;
    newFormValues[index].errors.purity = null;
    newFormValues[index].errors.fineGold = null;
    newFormValues[index].errors.rate = null;
    newFormValues[index].errors.amount = null;
    newFormValues[index].errors.CGSTPer = null;
    newFormValues[index].errors.SGSTPer = null;
    newFormValues[index].errors.IGSTPer = null;
    newFormValues[index].errors.CGSTval = null;
    newFormValues[index].errors.SGSTval = null;
    newFormValues[index].errors.IGSTVal = null;
    newFormValues[index].errors.Total = null;

    // setFormValues(newFormValues);

    changeTotal(newFormValues, false);
  }

  const handleDocModalClose = () => {
    // console.log("handleDocModalClose")
    setDocModal(false);
  };

  const updateDocumentArray = (id) => {
    // console.log("updateDocArray", id)
    let tempDocList = [...documentList];
    const arr = tempDocList.filter((x) => x.id !== id);
    setDocumentList(arr);
  };

  const concateDocument = (newData) => {
    // console.log("concateDocument", newData)
    setDocumentList((documentList) => [...documentList, ...newData]);
  };

  const isDateValid = (inputDate) => {
    const currentDate = moment();
    const minDate = moment()
      .subtract(backEntryDays, "day")
      .format("YYYY-MM-DD");
    const selectedDate = moment(inputDate, "YYYY-MM-DD");

    if (selectedDate.isBefore(minDate) || selectedDate.isAfter(currentDate)) {
      return false;
    }
    return true;
  };

  const handleDateBlur = () => {
    if (!isDateValid(voucherDate)) {
      setVoucherDtErr(
        `Invalid date. Date should be within the last ${backEntryDays} days.`
      );
      return false;
    } else {
      setVoucherDtErr("");
      return true;
    }
  };


  return (
    <div
      className={clsx(classes.root, props.className, "w-full")}
      id="metalpurchase-main"
    >
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            {props.viewPopup !== true ? (
              <Grid
                className="jewellerypreturn-main"
                container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0 }}
              >
                <Grid item xs={7} sm={7} md={7} key="1" style={{ padding: 0 }}>
                  <FuseAnimate delay={300}>
                    <Typography className="pl-28 pt-16 text-18 font-700">
                      {isView ? "View Metal Purchase" : "Add Metal Purchase"}
                    </Typography>
                  </FuseAnimate>

                  {/* {!isView && <BreadcrumbsHelper />} */}
                </Grid>

                <Grid
                  item
                  xs={5}
                  sm={5}
                  md={5}
                  key="2"
                  style={{ textAlign: "right" }}
                >
                  <div className="btn-back mt-2">
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
                             alt=""/>
                      Back
                    </Button>
                  </div>
                </Grid>
              </Grid>
            ) : (
              ""
            )}
            <div className="main-div-alll">
              {loading && <Loader />}

              <div
                className="pb-32 pt-16 "
                style={{ marginBottom: "10%", height: "90%" }}
              >
                {/* {JSON.stringify(contDetails)} */}
                <div>
                  <form
                    name="registerForm"
                    noValidate
                    className="flex flex-col justify-center w-full"
                    onSubmit={handleFormSubmit}
                  >
                    <Grid container spacing={3} className="p-8 pb-0">
                      {allowedBackDate && (
                        <Grid
                          item
                          lg={2}
                          md={4}
                          sm={4}
                          xs={12}
                          style={{ padding: 6 }}
                        >
                          <p style={{ paddingBottom: "3px" }}>Date</p>
                          <TextField
                            // label="Date"
                            type="date"
                            className=""
                            name="voucherDate"
                            value={voucherDate}
                            error={VoucherDtErr.length > 0 ? true : false}
                            helperText={VoucherDtErr}
                            onChange={(e) => handleInputChange(e)}
                            onKeyDown={(e) => e.preventDefault()}
                            variant="outlined"
                            // defaultValue={moment().format("yyyy-mm-dd")}
                            required
                            fullWidth
                            // InputProps={{inputProps: { min: moment(new Date("2022-03-17")).format("YYYY-MM-DD"), max: moment().format("YYYY-MM-DD")} }}
                            inputProps={{
                              min: moment()
                                .subtract(backEntryDays, "day")
                                .format("YYYY-MM-DD"),
                              max: moment().format("YYYY-MM-DD"),
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled={isView}
                          />
                        </Grid>
                      )}

                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p style={{ paddingBottom: "3px" }}>Voucher number</p>
                        <TextField
                          className=""
                          placeholder="Voucher number"
                          autoFocus
                          name="voucherNumber"
                          value={voucherNumber}
                          error={voucherNumErr.length > 0 ? true : false}
                          helperText={voucherNumErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          disabled
                        />
                      </Grid>
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p style={{ paddingBottom: "3px" }}>Vendor / Client</p>
                        <Select
                          className="view_consumablepurchase_dv"
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          options={vendorClientArr.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.name,
                          }))}
                          // components={components}
                          autoFocus
                          blurInputOnSelect
                          tabSelectsValue={false}
                          value={selectedVendorClient}
                          onChange={handleVendorClientChange}
                          placeholder="Vendor / Client"
                          isDisabled={isView}
                        />
                      </Grid>
                      {selectedVendorClient.value === 1 ? (
                        <>
                          <Grid
                            item
                            lg={2}
                            md={4}
                            sm={4}
                            xs={12}
                            style={{ padding: 6 }}
                          >
                            <p style={{ paddingBottom: "3px" }}>Party name</p>
                            <Select
                              className="view_consumablepurchase_dv"
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              classes={classes}
                              styles={selectStyles}
                              options={vendorData.map((suggestion) => ({
                                value: suggestion.id,
                                label: suggestion.name,
                              }))}
                              autoFocus
                              // components={components}
                              blurInputOnSelect
                              tabSelectsValue={false}
                              value={selectedVendor}
                              onChange={handlePartyChange}
                              placeholder="Party name"
                              isDisabled={isView}
                            />

                            <span style={{ color: "red" }}>
                              {selectedVendorErr.length > 0
                                ? selectedVendorErr
                                : ""}
                            </span>
                          </Grid>

                          <Grid
                            item
                            lg={2}
                            md={4}
                            sm={4}
                            xs={12}
                            style={{ padding: 6 }}
                          >
                            <p style={{ paddingBottom: "3px" }}>Firm name</p>
                            <TextField
                              className=""
                              placeholder="Firm name"
                              name="firmName"
                              value={firmName}
                              error={firmNameErr.length > 0 ? true : false}
                              helperText={firmNameErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                              disabled
                            />
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid
                            item
                            lg={2}
                            md={4}
                            sm={4}
                            xs={12}
                            style={{ padding: 6 }}
                          >
                            <p style={{ paddingBottom: "3px" }}>Party name</p>
                            <Select
                              className="view_consumablepurchase_dv"
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              classes={classes}
                              styles={selectStyles}
                              options={clientData.map((suggestion) => ({
                                value: suggestion.id,
                                label: suggestion.name,
                              }))}
                              autoFocus
                              // components={components}
                              blurInputOnSelect
                              tabSelectsValue={false}
                              value={selectedClient}
                              onChange={handleClientPartyChange}
                              placeholder="Party name"
                              isDisabled={isView}
                            />

                            <span style={{ color: "red" }}>
                              {selectedClientErr.length > 0
                                ? selectedClientErr
                                : ""}
                            </span>
                          </Grid>

                          <Grid
                            item
                            lg={2}
                            md={4}
                            sm={4}
                            xs={12}
                            style={{ padding: 6 }}
                          >
                            {/* <TextField
                        className=""
                        label="Firm Name"
                        name="firmName"
                        value={firmName}
                        error={firmNameErr.length > 0 ? true : false}
                        helperText={firmNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled
                      /> */}
                            <p style={{ paddingBottom: "3px" }}>Firm name</p>
                            <Select
                              className="view_consumablepurchase_dv"
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              classes={classes}
                              styles={selectStyles}
                              options={clientFirmData.map((suggestion) => ({
                                value: suggestion.id,
                                label: suggestion.company_name,
                              }))}
                              // components={components}
                              blurInputOnSelect
                              tabSelectsValue={false}
                              value={selectedClientFirm}
                              onChange={handleClientFirmChange}
                              placeholder="Firm name"
                              isDisabled={isView}
                            />
                            <span style={{ color: "red" }}>
                              {selectedClientFirmErr.length > 0
                                ? selectedClientFirmErr
                                : ""}
                            </span>
                          </Grid>
                        </>
                      )}

                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p style={{ paddingBottom: "3px" }}>Opposite account</p>
                        <Select
                          className="view_consumablepurchase_dv"
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          options={oppositeAccData}
                          ref={SelectRef}
                          //   .map((suggestion) => ({
                          //   value: suggestion.id,
                          //   label: suggestion.name,
                          // }))}
                          // components={components}
                          value={oppositeAccSelected}
                          onChange={handleOppAccChange}
                          placeholder="Opposite account"
                          isDisabled={isView}
                        />

                        <span style={{ color: "red" }}>
                          {selectedOppAccErr.length > 0
                            ? selectedOppAccErr
                            : ""}
                        </span>
                      </Grid>

                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p style={{ paddingBottom: "3px" }}>
                          Party voucher number
                        </p>
                        <TextField
                          className="mb-16"
                          placeholder="Party voucher number"
                          name="partyVoucherNum"
                          tabIndex="1"
                          value={partyVoucherNum}
                          error={partyVoucherNumErr.length > 0 ? true : false}
                          helperText={partyVoucherNumErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          disabled={isView}
                        />
                      </Grid>

                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p style={{ paddingBottom: "3px" }}>
                          Party voucher date
                        </p>
                        <TextField
                          placeholder="Party voucher date"
                          type="date"
                          name="partyVoucherDate"
                          value={partyVoucherDate}
                          error={partyVoucherDateErr.length > 0 ? true : false}
                          helperText={partyVoucherDateErr}
                          onChange={(e) => setPartyVoucherDate(e.target.value)}
                          onKeyDown={(e) => e.preventDefault()}
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                          inputProps={{
                            max: moment("01-01-9999").format("YYYY-MM-DD"),
                          }}
                          disabled={isView}
                        />
                      </Grid>

                      {!isView && (
                        <Grid
                          item
                          lg={2}
                          md={4}
                          sm={4}
                          xs={12}
                          style={{ padding: 6 }}
                        >
                          <p style={{ paddingBottom: "3px" }}>
                            Upload document
                          </p>
                          <TextField
                            className="mb-16 uploadDoc"
                            placeholder="Upload document"
                            type="file"
                            inputProps={{
                              multiple: true,
                            }}
                            onChange={(e) => setDocFile(e.target.files)}
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                      )}
                    </Grid>

                    <div className="table_full_width">
                      <div
                        className="mt-16 table-metal-purchase addmetal-purchase-tbl view_metalpurchase_blg view_metalpurchase_blg-dv add_view_metalpurchase_blg-dv"
                        style={{
                          border: "1px solid #D1D8F5",
                          paddingBottom: 5,
                          borderRadius: "7px",
                        }}
                      >
                        {/* <div className="metal-tbl-head" style={{ background: "lightgray", fontWeight: "700" }}>
                      <div 
                        className={classes.tableheader}
                      >
                        Category Variant
                      </div>
                      className="mt-16 table-metal-purchase"
                      style={{
                        border: "1px solid lightgray",
                        paddingBottom: 5,
                      }}
                    > */}
                        <div
                          className="metal-tbl-head"
                          style={{ background: "#EBEEFB", fontWeight: "700" }}
                        >
                          {!isView && (
                            <div
                              className={clsx(
                                classes.tableheader,
                                "delete_icons_dv"
                              )}
                            ></div>
                          )}
                          <div className={classes.tableheader}>
                            Category Variant
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Category Name
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            HSN
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Gross Weight
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Net Weight
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Purity
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Fine Gold
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Rate
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Amount
                          </div>
                          {isView && igstVal != 0 && igstVal !== "" ? (
                            <>
                              <div className={clsx(classes.tableheader, "")}>
                                IGST (%)
                              </div>
                              <div className={clsx(classes.tableheader, "")}>
                                IGST
                              </div>
                            </>
                          ) : (
                            isView && (
                              <>
                                <div className={clsx(classes.tableheader, "")}>
                                  CGST (%)
                                </div>
                                <div className={clsx(classes.tableheader, "")}>
                                  SGST (%)
                                </div>
                                <div className={clsx(classes.tableheader, "")}>
                                  CGST
                                </div>
                                <div className={clsx(classes.tableheader, "")}>
                                  SGST
                                </div>
                              </>
                            )
                          )}

                          {vendorStateId === 12 && !isView && (
                            <>
                              <div className={clsx(classes.tableheader, "")}>
                                CGST (%)
                              </div>
                              <div className={clsx(classes.tableheader, "")}>
                                SGST (%)
                              </div>
                              <div className={clsx(classes.tableheader, "")}>
                                CGST
                              </div>
                              <div className={clsx(classes.tableheader, "")}>
                                SGST
                              </div>
                            </>
                          )}

                          {vendorStateId !== 12 && !isView && (
                            <>
                              <div className={clsx(classes.tableheader, "")}>
                                IGST (%)
                              </div>
                              <div className={clsx(classes.tableheader, "")}>
                                IGST
                              </div>
                            </>
                          )}

                          <div className={clsx(classes.tableheader, "")}>
                            Total
                          </div>
                        </div>

                        {formValues.map((element, index) => (
                          <div
                            key={index}
                            className="castum-row-dv all-purchase-tabs"
                          >
                            {!isView && (
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "delete_icons_dv"
                                )}
                              >
                                <IconButton
                                  style={{ padding: "0" }}
                                  tabIndex="-1"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    deleteHandler(index);
                                  }}
                                >
                                  <Icon className="mr-8 delete-icone">
                                    <img src={Icones.delete_red} alt="" />
                                  </Icon>
                                </IconButton>
                              </div>
                            )}
                            <Select
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              className={clsx(
                                classes.selectBox,
                                "selectdropdown_main-dv"
                              )}
                              classes={classes}
                              styles={selectStyles}
                              options={stockCodeData.map((suggestion) => ({
                                value: suggestion.stock_name_code.id,
                                label: suggestion.stock_name_code.stock_code,
                              }))}
                              // components={components}
                              value={
                                element.stockCode !== ""
                                  ? element.stockCode.value === ""
                                    ? ""
                                    : element.stockCode
                                  : ""
                              }
                              onChange={(e) => {
                                handleStockGroupChange(index, e);
                              }}
                              onKeyDown={(e) => {
                                handleTabChange(e, index);
                              }}
                              placeholder="Stock Code"
                              isDisabled={isView}
                            />
                            <span style={{ color: "red" }}>
                              {element.errors !== undefined
                                ? element.errors.stockCode
                                : ""}
                            </span>

                            <TextField
                              // label="HSN"
                              name="categoryName"
                              className=""
                              value={element.categoryName || ""}
                              disabled
                              // value={departmentNm}
                              error={
                                element.errors !== undefined
                                  ? element.errors.categoryName
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.categoryName
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                            />
                            {/* <span style={{ color: "red" }}>
                            {element.errors !== undefined
                              ? element.errors.categoryName
                              : ""}
                          </span> */}
                            <TextField
                              // label="HSN"
                              name="selectedHsn"
                              className=""
                              value={element.selectedHsn || ""}
                              disabled
                              // value={departmentNm}
                              error={
                                element.errors !== undefined
                                  ? element.errors.selectedHsn
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.selectedHsn
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                            />
                            <TextField
                              // label="Gross Weight"
                              name="grossWeight"
                              className={classes.inputBoxTEST}
                              type={isView ? "text" : "number"}
                              value={element.grossWeight || ""}
                              // value={departmentNm}
                              inputRef={(el) => (inputRef.current[index] = el)}
                              error={
                                element.errors !== undefined
                                  ? element.errors.grossWeight
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.grossWeight
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              onBlur={(e) => handlerBlur(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                            />
                            <TextField
                              // label="Net Weight"
                              name="netWeight"
                              className=""
                              value={element.netWeight || ""}
                              disabled
                              error={
                                element.errors !== undefined
                                  ? element.errors.netWeight
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.netWeight
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                            />

                            <TextField
                              // label="Purity"
                              name="purity"
                              className=""
                              value={element.purity || ""}
                              // value={departmentNm}
                              error={
                                element.errors !== undefined
                                  ? element.errors.purity
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.purity
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled
                            />
                            <TextField
                              // label="Fine Gold"
                              name="fineGold"
                              className=""
                              value={element.fineGold || ""}
                              // value={departmentNm}
                              error={
                                element.errors !== undefined
                                  ? element.errors.fineGold
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.fineGold
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled
                            />
                            <TextField
                              // label="Rate"
                              name="rate"
                              className=""
                              value={
                                isView
                                  ? Config.numWithComma(element?.rate)
                                  : element?.rate || ""
                              }
                              // value={departmentNm}
                              error={
                                element.errors !== undefined
                                  ? element.errors.rate
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.rate
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled
                            />
                            <TextField
                              // label="Amount"
                              name="amount"
                              className=""
                              value={
                                isView
                                  ? Config.numWithComma(element?.amount)
                                  : element?.amount || ""
                              }
                              // value={departmentNm}
                              error={
                                element.errors !== undefined
                                  ? element.errors.amount
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.amount
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled
                            />
                            {element.IGSTPer && isView ? (
                              <>
                                <TextField
                                  // label="IGST (%)"
                                  name="IGSTPer"
                                  className=""
                                  value={element.IGSTPer || ""}
                                  // value={departmentNm}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.IGSTPer
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.IGSTPer
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />

                                <TextField
                                  // label="IGST"
                                  name="IGSTVal"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(element?.IGSTVal)
                                      : element.IGSTVal || ""
                                  }
                                  // value={departmentNm}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.IGSTVal
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.IGSTVal
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </>
                            ) : (
                              isView && (
                                <>
                                  <TextField
                                    // label="CGST (%)"
                                    name="CGSTPer"
                                    className=""
                                    value={element.CGSTPer || ""}
                                    // value={departmentNm}
                                    error={
                                      element.errors !== undefined
                                        ? element.errors.CGSTPer
                                          ? true
                                          : false
                                        : false
                                    }
                                    helperText={
                                      element.errors !== undefined
                                        ? element.errors.CGSTPer
                                        : ""
                                    }
                                    onChange={(e) => handleChange(index, e)}
                                    variant="outlined"
                                    fullWidth
                                    disabled
                                  />
                                  <TextField
                                    // label="SGST (%)"
                                    name="SGSTPer"
                                    className=""
                                    value={element.SGSTPer || ""}
                                    // value={departmentNm}
                                    error={
                                      element.errors !== undefined
                                        ? element.errors.SGSTPer
                                          ? true
                                          : false
                                        : false
                                    }
                                    helperText={
                                      element.errors !== undefined
                                        ? element.errors.SGSTPer
                                        : ""
                                    }
                                    onChange={(e) => handleChange(index, e)}
                                    variant="outlined"
                                    fullWidth
                                    disabled
                                  />
                                  <TextField
                                    // label="CGST"
                                    name="CGSTval"
                                    className=""
                                    value={
                                      isView
                                        ? Config.numWithComma(element?.CGSTval)
                                        : element.CGSTval || ""
                                    }
                                    // value={departmentNm}
                                    error={
                                      element.errors !== undefined
                                        ? element.errors.CGSTval
                                          ? true
                                          : false
                                        : false
                                    }
                                    helperText={
                                      element.errors !== undefined
                                        ? element.errors.CGSTval
                                        : ""
                                    }
                                    onChange={(e) => handleChange(index, e)}
                                    variant="outlined"
                                    fullWidth
                                    disabled
                                  />
                                  <TextField
                                    // label="SGST"
                                    name="SGSTval"
                                    className=""
                                    value={
                                      isView
                                        ? Config.numWithComma(element?.SGSTval)
                                        : element.SGSTval || ""
                                    }
                                    // value={departmentNm}
                                    error={
                                      element.errors !== undefined
                                        ? element.errors.SGSTval
                                          ? true
                                          : false
                                        : false
                                    }
                                    helperText={
                                      element.errors !== undefined
                                        ? element.errors.SGSTval
                                        : ""
                                    }
                                    onChange={(e) => handleChange(index, e)}
                                    variant="outlined"
                                    fullWidth
                                    disabled
                                  />
                                </>
                              )
                            )}
                            {vendorStateId === 12 && !isView && (
                              <>
                                <TextField
                                  // label="CGST (%)"
                                  name="CGSTPer"
                                  className=""
                                  value={element.CGSTPer || ""}
                                  // value={departmentNm}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.CGSTPer
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.CGSTPer
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                                <TextField
                                  // label="SGST (%)"
                                  name="SGSTPer"
                                  className=""
                                  value={element.SGSTPer || ""}
                                  // value={departmentNm}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.SGSTPer
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.SGSTPer
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                                <TextField
                                  // label="CGST"
                                  name="CGSTval"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(element?.CGSTval)
                                      : element.CGSTval || ""
                                  }
                                  // value={departmentNm}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.CGSTval
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.CGSTval
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                                <TextField
                                  // label="SGST"
                                  name="SGSTval"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(element?.SGSTval)
                                      : element.SGSTval || ""
                                  }
                                  // value={departmentNm}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.SGSTval
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.SGSTval
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </>
                            )}

                            {vendorStateId !== 12 && !isView && (
                              <>
                                <TextField
                                  // label="IGST (%)"
                                  name="IGSTPer"
                                  className=""
                                  value={element.IGSTPer || ""}
                                  // value={departmentNm}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.IGSTPer
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.IGSTPer
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />

                                <TextField
                                  // label="IGST"
                                  name="IGSTVal"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(element?.IGSTVal)
                                      : element.IGSTVal || ""
                                  }
                                  // value={departmentNm}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.IGSTVal
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.IGSTVal
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </>
                            )}

                            <TextField
                              // label="Total"
                              name="Total"
                              className=""
                              value={
                                isView
                                  ? Config.numWithComma(element?.Total)
                                  : element.Total || ""
                              }
                              // value={departmentNm}
                              error={
                                element.errors !== undefined
                                  ? element.errors.Total
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.Total
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled
                            />
                          </div>
                        ))}
                        <div
                          className="castum-row-dv"
                          style={{ fontWeight: "700", height: "30px" }}
                        >
                          {!isView && (
                            <div
                              id="castum-width-table"
                              className={clsx(
                                classes.tableheader,
                                "delete_icons_dv"
                              )}
                            ></div>
                          )}
                          <div
                            id="castum-width-table"
                            className={classes.tableheader}
                          ></div>
                          <div
                            className={clsx(
                              classes.tableheader,
                              " castum-width-table"
                            )}
                          ></div>
                          <div
                            className={clsx(
                              classes.tableheader,
                              " castum-width-table"
                            )}
                          ></div>
                          {totalInvoiceAmount === 0 ? (
                            <>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  " castum-width-table"
                                )}
                              ></div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  " castum-width-table"
                                )}
                              ></div>
                            </>
                          ) : (
                            ""
                          )}
                          <div
                            className={clsx(
                              classes.tableheader,
                              " castum-width-table"
                            )}
                          >
                            {totalGrossWeight}
                          </div>
                          <div
                            className={clsx(
                              classes.tableheader,
                              " castum-width-table"
                            )}
                          >
                            {" "}
                            {totalNetWeight}
                          </div>
                          <div
                            className={clsx(
                              classes.tableheader,
                              " castum-width-table"
                            )}
                          ></div>
                          {totalInvoiceAmount === 0 ? (
                            <div
                              className={clsx(
                                classes.tableheader,
                                " castum-width-table"
                              )}
                            ></div>
                          ) : (
                            ""
                          )}
                          <div
                            className={clsx(
                              classes.tableheader,
                              " castum-width-table"
                            )}
                          >
                            {fineGoldTotal}
                          </div>
                          <div
                            className={clsx(
                              classes.tableheader,
                              " castum-width-table"
                            )}
                          ></div>
                          {totalInvoiceAmount === 0 ? (
                            <div
                              className={clsx(
                                classes.tableheader,
                                " castum-width-table"
                              )}
                            ></div>
                          ) : (
                            ""
                          )}
                          <div
                            className={clsx(
                              classes.tableheader,
                              " castum-width-table"
                            )}
                          >
                            {isView ? Config.numWithComma(amount) : amount}
                          </div>

                          {igstVal != 0 && igstVal !== "" ? (
                            <>
                              {totalInvoiceAmount === 0 ? (
                                <div
                                  className={clsx(
                                    classes.tableheader,
                                    " castum-width-table"
                                  )}
                                ></div>
                              ) : (
                                ""
                              )}
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  " castum-width-table"
                                )}
                              ></div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  " castum-width-table"
                                )}
                              >
                                {isView
                                  ? Config.numWithComma(igstVal)
                                  : igstVal}
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  " castum-width-table"
                                )}
                              ></div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  " castum-width-table"
                                )}
                              ></div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  " castum-width-table"
                                )}
                              >
                                {isView
                                  ? Config.numWithComma(cgstVal)
                                  : cgstVal}
                              </div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  " castum-width-table"
                                )}
                              >
                                {isView
                                  ? Config.numWithComma(sgstVal)
                                  : sgstVal}
                              </div>
                            </>
                          )}
                          <div
                            className={clsx(
                              classes.tableheader,
                              " castum-width-table"
                            )}
                          >
                            {isView ? Config.numWithComma(total) : total}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>

                  <Grid item xs={2}>
                    <Button
                      id="btn-save"
                      variant="contained"
                      className="w-224 mx-auto mt-16 mr-16  "
                      aria-label="Register"
                      //   disabled={!isFormValid()}
                      disabled={isView || formValues[0].fineGold === ""}
                      // type="submit"
                      onClick={(e) => {
                        handleRateFixChange(e);
                      }}
                    >
                      Rate Fix
                    </Button>
                    <br></br>
                    <span style={{ color: "red", fontSize: "12pt" }}>
                      {selectedRateFixErr.length > 0 ? selectedRateFixErr : ""}
                    </span>
                  </Grid>

                  <div
                    className="mt-5 sub-total-dv"
                    style={{
                      fontWeight: "700",
                      justifyContent: "end",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "35%",
                      }}
                    >
                      <label className="mr-2">Sub Total : </label>
                      <label className="ml-2">
                        {" "}
                        {isView ? Config.numWithComma(subTotal) : subTotal}
                      </label>
                    </div>
                  </div>

                  <div
                    className="mt-5 sub-total-dv"
                    style={{
                      fontWeight: "700",
                      justifyContent: "end",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "35%",
                      }}
                    >
                      <label className="mr-2">GST : </label>
                      <label className="ml-2">
                        {isView ? Config.numWithComma(totalGST) : totalGST}
                      </label>
                    </div>
                  </div>

                  <div
                    className="mt-5 sub-total-dv"
                    style={{
                      fontWeight: "700",
                      justifyContent: "end",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "35%",
                      }}
                      // className={classes.tableheader}
                    >
                      <label className="mr-3" style={{}}>
                        Round Off
                      </label>
                      <label className="ml-2 input-sub-total">
                        <TextField
                          // label="Round off"
                          className={clsx(
                            classes.inputBoxTEST,
                            "addconsumble-dv"
                          )}
                          type={isView ? "text" : "number"}
                          name="roundOff"
                          // className=" addconsumble-dv"
                          // style={{width:'10%'}}
                          value={roundOff}
                          error={roundOffErr.length > 0 ? true : false}
                          helperText={roundOffErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          fullWidth
                          disabled={isView || subTotal === ""}
                        />
                      </label>
                    </div>
                  </div>

                  <div
                    className="mt-5 sub-total-dv"
                    style={{
                      fontWeight: "700",
                      justifyContent: "end",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "35%",
                      }}
                    >
                      <label className="mr-2">Total Invoice Amount : </label>
                      <label className="ml-2">
                        {" "}
                        {isView
                          ? Config.numWithComma(totalInvoiceAmount)
                          : totalInvoiceAmount}
                      </label>
                    </div>
                  </div>
                  {!props.viewPopup && (
                    <div className="mt-16" style={{ paddingBottom: 5 }}>
                      <div
                        className="metal-tbl-head"
                        style={{
                          background: "#EBEEFB",
                          fontWeight: "700",
                          borderRadius: "7px",
                        }}
                      >
                        <div className={classes.tableheader}>Ledger Name</div>

                        <div className={classes.tableheader}>
                          TDS/TCS Vou. Num
                        </div>

                        <div className={classes.tableheader}>(%)</div>

                        <div className={classes.tableheader}>Amount</div>
                      </div>

                      <div className="mt-5 table-row-source">
                        <Select
                          className="view_consumablepurchase_dv"
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          options={ledgerData.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.Ledger.name,
                          }))}
                          // components={components}
                          blurInputOnSelect
                          tabSelectsValue={false}
                          value={ledgerName}
                          isDisabled={total == 0}
                          onChange={handleLedgerChange}
                          placeholder="Ledger name"
                          // isDisabled={isView ? true : false}
                        />
                        <span style={{ color: "red" }}>
                          {ledgerNmErr.length > 0 ? ledgerNmErr : ""}
                        </span>
                        <TextField
                          // label="TDS/TCS Vou. Num"
                          name="tdsTcsVou"
                          className="ml-2"
                          value={tdsTcsVou}
                          // error={tdsTcsVouErr.length > 0 ? true : false}
                          // helperText={tdsTcsVouErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          fullWidth
                          disabled
                        />

                        {/* <TextField
                      // label="Ledger Name"
                      name="ledgerName"
                      className="ml-2"
                      value={ledgerName}
                      error={ledgerNmErr.length > 0 ? true : false}
                      helperText={ledgerNmErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                      disabled
                    /> */}
                        <TextField
                          // label="(%)"
                          name="rateValue"
                          className="ml-2"
                          value={rateValue}
                          error={rateValErr.length > 0 ? true : false}
                          helperText={rateValErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          fullWidth
                          disabled
                        />
                        <TextField
                          // label="Amount"
                          name="ledgerAmount"
                          className="ml-2"
                          value={
                            isView
                              ? Config.numWithComma(ledgerAmount)
                              : ledgerAmount
                          }
                          error={ledgerAmtErr.length > 0 ? true : false}
                          helperText={ledgerAmtErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          fullWidth
                          disabled={is_tds_tcs != 1 || isView}
                        />
                      </div>
                    </div>
                  )}

                  <div
                    id="jewellery-head"
                    className="mt-16 "
                    style={{
                      background: "#EBEEFB",
                      borderRadius: "7px",
                      fontWeight: "700",
                      justifyContent: "end",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        width: "20%",
                      }}
                      // className={classes.tableheader}
                    >
                      <label>Final Receivable Amount :</label>
                      <label>
                        {" "}
                        {isView
                          ? Config.numWithComma(finalAmount)
                          : finalAmount}{" "}
                      </label>
                    </div>
                  </div>

                  <Grid container className="mt-16">
                    <Grid
                      item
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      style={{ padding: 6 }}
                    >
                      <p style={{ paddingBottom: "3px" }}>Metal Narration</p>
                      <TextField
                        className="mt-1"
                        placeholder="Metal Narration"
                        name="metalNarration"
                        value={metalNarration}
                        error={metalNarrationErr.length > 0 ? true : false}
                        helperText={metalNarrationErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        multiline
                        minRows={4}
                        maxrows={4}
                        disabled={narrationFlag}
                      />
                    </Grid>
                    <Grid
                      item
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      style={{ padding: 6 }}
                    >
                      <p style={{ paddingBottom: "3px" }}>Account narration</p>
                      <TextField
                        className="mt-1"
                        placeholder="Account narration"
                        name="accNarration"
                        value={accNarration}
                        error={accNarrationErr.length > 0 ? true : false}
                        helperText={accNarrationErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        multiline
                        minRows={4}
                        maxrows={4}
                        disabled={narrationFlag}
                      />
                    </Grid>
                  </Grid>

                  {!props.viewPopup && (
                    <div>
                      {!isView && (
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ float: "right" }}
                          className="w-224 mx-auto mt-16 btn-print-save"
                          aria-label="Register"
                          //   disabled={!isFormValid()}
                          disabled={isView || total == 0}
                          // type="submit"
                          onClick={(e) => {
                            handleFormSubmit(e);
                          }}
                        >
                          Save
                        </Button>
                      )}

                      <Button
                        variant="contained"
                        // color="primary"
                        style={{ float: "right" }}
                        className="w-224 mx-auto mt-16 mr-16 btn-print-save"
                        aria-label="Register"
                        //   disabled={!isFormValid()}
                        // type="submit"
                        disabled={total == 0}
                        onClick={checkforPrint}
                      >
                        {isView ? "Print" : "Save & Print"}
                      </Button>

                      {isView && (
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ float: "right" }}
                          className="w-224 mx-auto mt-16 mr-16 btn-print-save"
                          aria-label="Register"
                          onClick={() => handleNarrationClick()}
                        >
                          {!narrationFlag
                            ? "Save Narration"
                            : "Update Narration"}
                        </Button>
                      )}
                      <div style={{ display: "none" }}>
                        <MetalPurPrintComp
                          ref={componentRef}
                          printObj={printObj}
                          isView={isView}
                          getDateAndTime={getDateAndTime()}
                        />
                      </div>
                    </div>
                  )}

                  {isView && (
                    <Button
                      variant="contained"
                      className={clsx(
                        classes.button,
                        "mt-16 mr-16 btn-print-save"
                      )}
                      onClick={() => setDocModal(true)}
                    >
                      View Documents
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <ViewDocModal
              documentList={documentList}
              handleClose={handleDocModalClose}
              open={docModal}
              updateDocument={updateDocumentArray}
              viewPopup={props.viewPopup}
              purchase_flag_id={idToBeView?.id}
              purchase_flag="1"
              concateDocument={concateDocument}

            />
            {/* {console.log(isView)} */}

            <Modal
              // disableBackdropClick rfModalOpen, setRfModalOpen
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={rfModalOpen}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleRfModalClose();
                }
              }}
            >
              <div
                style={modalStyle}
                className={clsx(classes.rateFixPaper, "rounded-8")}
              >
                <h5
                  className="popup-head p-5">
                  Rate Fix
                  <IconButton
                    style={{ position: "absolute", top: "-2px", right: "0" }}
                    onClick={handleRfModalClose}
                  >
                    <Icon style={{ color: "white" }}>close</Icon>
                  </IconButton>
                </h5>

                <div className="p-5 pl-16 pr-16 y">
                  <div className="addmetal-purchase-blg">
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          ></TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          >
                            Date
                          </TableCell>

                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          >
                            Rate
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          >
                            Fine
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          >
                            Utilize
                          </TableCell>

                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          >
                            Balance
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {balRfixViewData !== "" &&
                          balRfixViewData.map((row, index) => (
                            <TableRow key={index}>
                              <TableCell
                                align="center"
                                className={classes.tableRowPad}
                              >
                                <Checkbox
                                  checked={row.checked}
                                  onChange={(e) => handleChecked(e, index)}
                                  value="checked"
                                />
                              </TableCell>
                              <TableCell
                                align="center"
                                className={classes.tableRowPad}
                              >
                                {moment
                                  .utc(row.date)
                                  .local()
                                  .format("DD-MM-YYYY")}
                              </TableCell>
                              <TableCell
                                align="center"
                                className={classes.tableRowPad}
                              >
                                {Config.numWithComma(row.rate)}
                              </TableCell>

                              <TableCell
                                align="center"
                                className={classes.tableRowPad}
                              >
                                {row.weight}
                              </TableCell>
                              <TableCell
                                align="center"
                                className={classes.tableRowPad}
                              >
                                {row.checked === true && (
                                  <TextField
                                    label="Utilize"
                                    name="Utilize"
                                    // className="mt-16"
                                    value={row.usedWeight}
                                    error={
                                      row.utiliseErr.length > 0 ? true : false
                                    }
                                    helperText={row.utiliseErr}
                                    onChange={(e) =>
                                      haldleUtilizeChange(e, index)
                                    }
                                    variant="outlined"
                                    style={{ width: "100%" }}
                                    // disabled
                                  />
                                )}
                                {row.checked === false && row.usedWeight}
                              </TableCell>
                              <TableCell
                                align="center"
                                className={classes.tableRowPad}
                              >
                                {row.balance}
                              </TableCell>
                            </TableRow>
                          ))}

                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          ></TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          ></TableCell>

                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          ></TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          ></TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          >
                            {utiliseTotal}
                          </TableCell>

                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                          ></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-16" style={{ width: "100%" }}>
                    <span style={{ color: "red" }}>
                      {popupErr.length > 0 ? popupErr : ""}
                    </span>
                  </div>
                  {/* {canEnterVal === true && (
                      <> */}
                  <Grid container className="mt-16">
                    <Grid
                      item
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      style={{ padding: 6 }}
                    >
                      <label className="popup-labl p-4 ">
                        Shortage of rate fix
                      </label>
                      <TextField
                        placeholder="Shortage of rate fix"
                        name="shortageRfix"
                        className="mt-1"
                        value={isNaN(shortageRfix) ? 0 : shortageRfix}
                        error={shortageRfixErr.length > 0 ? true : false}
                        helperText={shortageRfixErr}
                        onChange={(e) => handleRfixChange(e)}
                        variant="outlined"
                        style={{ display: "flex" }}
                        disabled
                      />
                    </Grid>
                    <Grid
                      item
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      style={{ padding: 6 }}
                    >
                      <label className="popup-labl p-4 ">temp rate</label>
                      <TextField
                        placeholder="temp rate"
                        name="tempRate"
                        className={classes.inputBoxTEST}
                        type={isView ? "text" : "number"}
                        // className="mt-16 ml-56"
                        value={tempRate}
                        error={tempRateErr.length > 0 ? true : false}
                        helperText={tempRateErr}
                        onChange={(e) => handleRfixChange(e)}
                        variant="outlined"
                        style={{ display: "flex" }}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label className="popup-labl p-4 ">Average rate</label>
                    <TextField
                      placeholder="Average Rate"
                      name="avgRate"
                      className="mt-1"
                      value={isNaN(avgRate) ? 0 : avgRate}
                      error={avgRateErr.length > 0 ? true : false}
                      helperText={avgRateErr}
                      onChange={(e) => handleRfixChange(e)}
                      variant="outlined"
                      fullWidth
                      disabled
                    />
                  </Grid>

                  <div className="flex flex-row justify-around p-5">
                    <Button
                      variant="contained"
                      className="cancle-button-css"
                      onClick={handleRfModalClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      className="save-button-css"
                      onClick={(e) => adjustRateFix(e)}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
});

export default AddMetalPurchase;

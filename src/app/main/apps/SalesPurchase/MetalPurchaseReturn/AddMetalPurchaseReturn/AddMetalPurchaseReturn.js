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
// import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import History from "@history";
import Select, { createFilter } from "react-select";
import { Icon, IconButton } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Loader from "app/main/Loader/Loader";
import moment from "moment";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import { MetalPurReturnPrintComp } from "./PrintComp/MetalPurReturnPrintComp";
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
    borderRadius: 5,
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
  normalSelect: {
    // marginTop: 8,
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    // marginLeft: 15,
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

const AddMetalPurchaseReturn = (props) => {
  const dispatch = useDispatch();
  const [isView, setIsView] = useState(false); //for view Only

  const componentRef = React.useRef(null);
  const [printObj, setPrintObj] = useState({
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
    taxAmount: "",
    metNarration: "",
    accNarration: "",
    balancePayable: "",
  });
  const onBeforeGetContentResolve = React.useRef(null);
  const handleAfterPrint = () => {
    //React.useCallback
    console.log("`onAfterPrint` called", isView); // tslint:disable-line no-console
    //resetting after print
    checkAndReset();
  };

  function checkAndReset() {
    // console.log("checkAndReset", isView)
    // console.log("isView", isView)
    if (isView === false) {
      console.log("cond true", isView);
      History.push("/dashboard/sales/metalpurchasereturn");
    }
  }

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
      return moment(currentDate).format("DD-MM-YYYY h:mm A");
    }
  }

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Metal_Purchase_Return_Voucher_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  function checkforPrint(e) {
    if (
      voucherNumValidation() &&
      partyNameValidation() &&
      oppositeAcValidation() &&
      partyVoucherNumValidation() &&
      partyVoucherDateValidation()
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (isView) {
        handlePrint();
      } else {
        if (prevContactIsValid() && handleDateBlur()) {
          addMetalPurchase(false, true);
        } else {
          console.log("prevContactIsValid else");
        }
      }
    } else {
      console.log("else");
    }
  }

  const [documentList, setDocumentList] = useState([]);
  const [docModal, setDocModal] = useState(false);
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);
  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 17)
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

  const handleDocModalClose = () => {
    console.log("handleDocModalClose");
    setDocModal(false);
  };

  React.useEffect(() => {
    if (
      // text === "New, Updated Text!" &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      onBeforeGetContentResolve.current();
    }
    //eslint-disable-next-line
  }, [onBeforeGetContentResolve.current]); //, text

  const [loading, setLoading] = useState(false);
  // const [modalOpen, setModalOpen] = useState(false);
  const [rfModalOpen, setRfModalOpen] = useState(false);

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [vendorData, setVendorData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedVendorErr, setSelectedVendorErr] = useState("");

  const [clientCompanies, setClientCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompErr, setSelectedCompErr] = useState("");

  const [clientdata, setClientdata] = useState([]);
  const [shippingVendor, setShippingVendor] = useState("");
  const [shipVendErr, setShipVendErr] = useState("");

  const [selectedRateFixErr, setSelectedRateFixErr] = useState("");

  const [clientData, setClientData] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedClientErr, setSelectedClientErr] = useState("");

  const [clientFirmData, setClientFirmData] = useState([]);
  const [selectedClientFirm, setSelectedClientFirm] = useState("");
  const [selectedClientFirmErr, setSelectedClientFirmErr] = useState("");

  const [selectedVendorClient, setVendorClient] = useState({
    value: 1,
    label: "Vendor",
  });

  const [balanceRfixData, setBalanceRfixData] = useState("");
  const [balRfixViewData, setBalRfixViewData] = useState("");

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
  const SelectRef = useRef(null);

  const [shipping, setShipping] = useState("");
  const [shippingErr, setShippingErr] = useState("");

  const [stockCodeData, setStockCodeData] = useState([]);

  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");
  const [address, setAddress] = useState("");
  const [supplierGstUinNum, setSupplierGstUinNum] = useState("");
  const [supPanNum, setSupPanNum] = useState("");
  const [supState, setSupState] = useState("");
  const [SupCountry, setSupCountry] = useState("");

  const [vendorStateId, setVendorStateId] = useState("");

  //below table total val field
  const [amount, setAmount] = useState("");
  const [cgstVal, setCgstVal] = useState("");
  const [sgstVal, setSgstVal] = useState("");
  const [igstVal, setIgstVal] = useState("");
  const [total, setTotal] = useState("");
  const [totalNetWeight, setTotalNetWeight] = useState("");
  const [fineGoldTotal, setFineGoldTotal] = useState("");
  const [totalGrossWeight, setTotalGrossWeight] = useState("");
  const [roundOff, setRoundOff] = useState("");
  const [roundOffErr, SetRoundOffErr] = useState("");

  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState("");
  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [metalNarration, setMetalNarration] = useState("");
  const [metalNarrationErr, setMetalNarrationErr] = useState("");
  const [narrationFlag, setNarrationFlag] = useState(false);

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

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    if (props.reportView === "Report") {
      NavbarSetting("Factory Report", dispatch);
    } else if (props.reportView === "Account") {
      NavbarSetting("Accounts", dispatch);
    } else {
      NavbarSetting("Sales", dispatch);
    }
    //eslint-disable-next-line
  }, []);

  if (props.location) {
    var idToBeView = props.location.state;
  } else if (props.voucherId) {
    var idToBeView = { id: props.voucherId };
  }

  const [formValues, setFormValues] = useState([
    {
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      grossWeight: "",
      netWeight: "",
      availableStock: "",
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
      availableStock: "",
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
      availableStock: "",
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
      availableStock: "",
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
      newFormValues[i].availableStock =
        "Wt: " +
        parseFloat(stockCodeData[findIndex].weight).toFixed(2) +
        (stockCodeData[findIndex].pcs !== null
          ? ", Pcs :" + stockCodeData[findIndex].pcs
          : "");
      if (
        newFormValues[i].grossWeight !== "" &&
        newFormValues[i].purity !== ""
      ) {
        newFormValues[i].fineGold = parseFloat(
          (parseFloat(newFormValues[i].grossWeight) *
            parseFloat(newFormValues[i].purity)) /
            100
        ).toFixed(3);
      } else {
        newFormValues[i].fineGold = "";
      }

      newFormValues[i].categoryName = stockCodeData[findIndex].billing_name;
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

    function netWeight(item) {
      // console.log(parseFloat(item.netWeight));
      return parseFloat(item.netWeight);
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
    } else {
      tempIgstVal = newFormValues
        .filter((item) => item.IGSTVal !== "")
        .map(IGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setIgstVal(parseFloat(tempIgstVal).toFixed(3));
    }

    let tempTotal = newFormValues
      .filter((item) => item.Total !== "")
      .map(Total)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotal(parseFloat(tempTotal).toFixed(3));

    let tempGrossWtTot = parseFloat(
      newFormValues
        .filter((data) => data.grossWeight !== "")
        .map(grossWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

    let tempNetWtTot = parseFloat(
      newFormValues
        .filter((data) => data.netWeight !== "")
        .map(netWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);

    let tempTotalInvoiceAmt = 0;

    if (parseFloat(tempTotal) > 0) {
      if (roundOff > 0) {
        setTotalInvoiceAmount(
          parseFloat(
            parseFloat(tempTotal).toFixed(3) - parseFloat(roundOff).toFixed(3)
          ).toFixed(3)
        );
      } else {
        tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);

        setTotalInvoiceAmount(tempTotalInvoiceAmt);
      }
    } else {
      setTotalInvoiceAmount(0);
      // setLegderAmount(0);
    }

    setPrintObj({
      ...printObj,
      orderDetails: newFormValues,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCgstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      roundOff: roundOff,
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      fineWtTot: parseFloat(tempFineGold).toFixed(3),
      totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
      taxAmount: parseFloat(tempAmount).toFixed(3),
      balancePayable: parseFloat(tempTotalInvoiceAmt).toFixed(3),
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
          availableStock: "",
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
    setOppositeAccData(
      HelperFunc.getOppositeAccountDetails("MetalPurchaseReturn")
    );
    console.log("idToBeView", idToBeView);
    if (idToBeView !== undefined) {
      setNarrationFlag(true);
      setIsView(true);
      getMetalPurchaseReturnRecordForView(idToBeView.id);
    } else {
      setNarrationFlag(false);
      getStockCodeMetal();
      getClientData();
      getVoucherNumber(); //if view only then no need to get new voucher number, we will set data coming from api
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (idToBeView === undefined) {
      if (selectedVendorClient.value === 1) {
        getVendordata();
      } else {
        getClientsdata();
      }
    }
  }, [selectedVendorClient]);

  function getMetalPurchaseReturnRecordForView(id) {
    setLoading(true);
    let api = "";
    if (props.forDeletedVoucher) {
      api = `api/metalpurchasereturn/${id}?deleted_at=1`;
    } else {
      api = `api/metalpurchasereturn/${id}`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              let finalData = response.data.data;
              setDocumentList(finalData.salesPurchaseDocs);
              if (finalData.is_vendor_client === 1) {
                setVendorClient({ value: 1, label: "Vendor" });
                setSelectedVendor({
                  value: finalData.Vendor.id,
                  label: finalData.Vendor.name,
                });
                setFirmName(finalData.Vendor.firm_name);
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
                var clientVendorState = finalData.ClientCompany.state;
                var mainObj = finalData.ClientCompany;
              }

              setVoucherNumber(finalData.voucher_no);
              setTimeDate(finalData.created_at);
              setPartyVoucherDate(finalData.party_voucher_date);
              setAllowedBackDate(true);
              setVoucherDate(finalData.purchase_voucher_create_date);
              setVendorStateId(clientVendorState);

              setOppositeAccSelected({
                value: finalData.opposite_account_id,
                label: finalData.OppositeAccount.name,
              });
              setPartyVoucherNum(finalData.party_voucher_no);
              setRoundOff(
                finalData.round_off === null ? "" : finalData.round_off
              );

              setShipping(finalData.is_shipped.toString());

              if (finalData.is_shipped === 1) {
                setShippingVendor({
                  value: finalData.ShippingClient.id,
                  label: finalData.ShippingClient.name,
                });

                setSelectedCompany({
                  value: finalData.ShippingClientCompany.id,
                  label: finalData.ShippingClientCompany.company_name,
                });
              }

              setTotalInvoiceAmount(
                parseFloat(finalData.total_invoice_amount).toFixed(3)
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
              for (let item of finalData.MetalPurchaseReturnOrder) {
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
                          (parseFloat(item.amount) * parseFloat(item.cgst)) /
                            100
                        ).toFixed(3)
                      : "",
                  SGSTval:
                    item.sgst !== null
                      ? parseFloat(
                          (parseFloat(item.amount) * parseFloat(item.sgst)) /
                            100
                        ).toFixed(3)
                      : "",
                  IGSTVal:
                    item.igst !== null
                      ? parseFloat(
                          (parseFloat(item.amount) * parseFloat(item.igst)) /
                            100
                        ).toFixed(3)
                      : "",
                  Total: parseFloat(item.total).toFixed(3),
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
              console.log(tempSgstVal, "tempSgstVal");

              let tempIgstVal = tempArray
                .filter((item) => item.IGSTVal !== "")
                .map(IGSTVal)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setIgstVal(parseFloat(tempIgstVal).toFixed(3));

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
                sGstTot: tempSgstVal ? parseFloat(tempSgstVal).toFixed(3) : "",
                cGstTot: tempCgstVal ? parseFloat(tempCgstVal).toFixed(3) : "",
                iGstTot: tempIgstVal ? parseFloat(tempIgstVal).toFixed(3) : "",
                grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
                netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                fineWtTot: parseFloat(tempFineGold).toFixed(3),
                orderDetails: tempArray,
                taxableAmount: parseFloat(tempAmount).toFixed(3),
                accNarration:
                  finalData.account_narration !== null
                    ? finalData.account_narration
                    : "",
                metNarration:
                  finalData.metal_narration !== null
                    ? finalData.metal_narration
                    : "",
                roundOff:
                  finalData.round_off === null ? "0" : finalData.round_off,
                totalInvoiceAmt: parseFloat(
                  finalData.total_invoice_amount
                ).toFixed(3),
                balancePayable: parseFloat(
                  finalData.total_invoice_amount
                ).toFixed(3),
                signature: finalData.admin_signature,
              });

              setAdjustedRate(true);
            } else {
              // setApiData([]);
            }
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

  function getClientData() {
    axios
      .get(Config.getCommonUrl() + "api/client/listing/listing")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setClientdata(response.data.data);
          // setData(response.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/client/listing/listing" });
      });
  }

  function getStockCodeMetal() {
    axios
      .get(
        Config.getCommonUrl() +
          "api/stockname/metalPurchaseReturn?department_id=" +
          window.localStorage.getItem("SelectedDepartment")
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockCodeData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api:
            "api/stockname/metalPurchaseReturn?department_id=" +
            window.localStorage.getItem("SelectedDepartment"),
        });
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

  function getClientsdata() {
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

  function getClientsCompanies(clientId) {
    axios
      .get(
        Config.getCommonUrl() + `api/client/company/listing/listing/${clientId}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
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
      .get(Config.getCommonUrl() + "api/metalpurchasereturn/get/voucher")
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
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
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/metalpurchasereturn/get/voucher",
        });
      });
  }

  function handleInputChange(event) {
    // console.log("handleInputChange");

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    // console.log("name",name,"value",value);

    if (name === "voucherNumber") {
      setVoucherNumber(value);
      setVoucherNumErr("");
      setPrintObj({
        ...printObj,
        partyInvNum: value,
      });
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
    } else if (name === "roundOff") {
      setRoundOff(value);
      if (value > 5 || value < -5) {
        SetRoundOffErr("Please Enter value between -5 to 5");
      } else {
        SetRoundOffErr("");
      }
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
      setPrintObj({
        ...printObj,
        roundOff: value,
        totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
        // taxAmount: ,
        balancePayable: parseFloat(tempTotalInvoiceAmt).toFixed(3),
      });
    }
  }

  function voucherNumValidation() {
    // var Regex = /^[a-zA-Z\s]*$/;
    // if (!voucherNumber || Regex.test(voucherNumber) === false) {
    if (voucherNumber === "") {
      setVoucherNumErr("Enter Valid Voucher Number");
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

  function shippingValidation() {
    if (shipping === "") {
      setShippingErr("Please Select Shipping Option");
      return false;
    }
    return true;
  }

  function shippingVendValidation() {
    if (shippingVendor === "") {
      setShipVendErr("Please Select Shipping Party");
      return false;
    }
    return true;
  }

  function clientCompValidation() {
    if (selectedCompany === "") {
      setSelectedCompErr("Please Select client Company");
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
      shippingValidation()
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (prevContactIsValid()) {
        if (shipping === "1") {
          if (shippingVendValidation() && clientCompValidation()) {
            addMetalPurchase(true, false);
          }
        } else {
          addMetalPurchase(true, false);
        }
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
    //   // dispatch(Actions.showMessage({ message: "Please Add remaining rate" }));
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
      party_voucher_no: partyVoucherNum,
      opposite_account_id: oppositeAccSelected.value,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      vendor_id:
        selectedVendorClient.value === 1
          ? selectedVendor.value
          : selectedClientFirm.value,
      is_vendor_client: selectedVendorClient.value === 1 ? 1 : 2,
      ...(rates.length > 0 && {
        rates: rates,
      }),
      ...(tempRate !== "" && {
        setRate: tempRate,
      }),
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      round_off: roundOff === "" ? 0 : roundOff,
      metal_narration: metalNarration,
      account_narration: accNarration,
      is_shipped: parseInt(shipping),
      ...(shipping === "1" && {
        shipping_client_id: shippingVendor.value,
        shipping_client_company_id: selectedCompany.value,
      }),
      Orders: Orders,
      uploadDocIds: docIds,
      party_voucher_date: partyVoucherDate,
    };
    console.log(body);
    axios
      .post(Config.getCommonUrl() + "api/metalpurchasereturn", body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id

          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.push("/dashboard/masters/clients");
          // History.goBack();
          if (resetFlag === true) {
            checkAndReset();
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record
            handlePrint();
          }
          // window.location.reload(false);
          // setSelectedVendor("");
          // setShippingVendor("");
          // setBalanceRfixData("");
          // setBalRfixViewData("");
          // setCanEnterVal(false);
          // setOppositeAccSelected("");
          // setPartyVoucherNum("");
          // // setSelectedDepartment("");
          // setFirmName("");
          // setVendorStateId("");
          // setShipping("");
          // setClientCompanies([]);
          // setSelectedCompany("");
          // setSelectedCompErr("");
          // setAccNarration("");
          // setMetalNarration("");
          // setShortageRfix("");
          // setTempRate("");
          // setAvgeRate("");
          // setTempApiWeight("");
          // setAdjustedRate(false);
          // setVoucherDate(moment().format("YYYY-MM-DD"));
          // resetForm();

          // getVoucherNumber();
          setLoading(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
        }
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);

        handleError(error, dispatch, {
          api: "api/metalpurchasereturn",
          body: body,
        });
      });
  }

  function resetForm() {
    setOppositeAccSelected("");
    setAmount("");
    setCgstVal("");
    setSgstVal("");
    setIgstVal("");
    setTotal("");
    setTotalGrossWeight("");
    setFineGoldTotal("");
    setRoundOff("");
    setTotalInvoiceAmount("");
    // setFinalAmount("");
    // setLegderAmount(0);

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
        availableStock: "",
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

  function handleShipVendorSelect(value) {
    setShippingVendor(value);
    setShipVendErr("");
    let findIndex = clientdata.findIndex((item) => item.id === value.value);
    //   // console.log(findIndex, i);
    if (findIndex > -1) {
      getClientCompanies(value.value);
    }

    setSelectedCompany("");
    setSelectedCompErr("");
  }

  function getClientCompanies(clientId) {
    axios
      .get(
        Config.getCommonUrl() + `api/client/company/listing/listing/${clientId}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          // console.log(JSON.stringify(response.data.data));
          console.log(response.data.data);
          var compData = response.data.data;
          setClientCompanies(compData);
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

  function handleShipCompanyChange(value) {
    setSelectedCompany(value);
    setSelectedCompErr("");
  }

  function handlePartyChange(value) {
    setSelectedVendor(value);
    setSelectedVendorErr("");
    setAdjustedRate(false);
    setShippingVendor("");
    setShipping("");
    setClientCompanies([]);
    setSelectedCompany("");
    setSelectedCompErr("");
    resetForm();

    const index = vendorData.findIndex((element) => element.id === value.value);
    console.log(index);

    if (index > -1) {
      setFirmName(vendorData[index].firm_name);
      setAddress(vendorData[index].address);
      setSupplierGstUinNum(vendorData[index].gst_number);
      setSupPanNum(vendorData[index].pan_number);
      setSupState(vendorData[index].state_name.name);
      setSupCountry(vendorData[index].country_name.name);
      setVendorStateId(vendorData[index].state_name.id);

      setPrintObj({
        ...printObj,
        stateId: vendorStateId,
        supplierName: vendorData[index].firm_name,
        supAddress: vendorData[index].address,
        supplierGstUinNum: vendorData[index].gst_number,
        supPanNum: vendorData[index].pan_number,
        supState: vendorData[index].state_name.name,
        supCountry: vendorData[index].country_name.name,
        // supStateCode: vendorData[index].gst_number.substring(0, 2),
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
        taxAmount: "",
        metNarration: "",
        accNarration: "",
        balancePayable: "",
      });
    }
    SelectRef.current.focus();

    getFixedRateofWeight(value.value);
  }

  function getFixedRateofWeight(vendorId) {
    axios
      .get(Config.getCommonUrl() + "api/ratefix/vendor/balance/1/" + vendorId)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setBalanceRfixData(response.data.data);
          setTempApiWeight(response.data.data.totalWeight);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/ratefix/vendor/balance/1/" + vendorId,
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
            //     stockCodeData[findIndex].billing_name;
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
          } else {
            tempIgstVal = newFormValues
              .filter((item) => item.IGSTVal !== "")
              .map(IGSTVal)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);
            setIgstVal(parseFloat(tempIgstVal).toFixed(3));
          }

          let tempTotal = newFormValues
            .filter((item) => item.Total !== "")
            .map(Total)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);
          setTotal(parseFloat(tempTotal).toFixed(3));

          let tempGrossWtTot = parseFloat(
            newFormValues
              .filter((data) => data.grossWeight !== "")
              .map(grossWeight)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0)
          ).toFixed(3);

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
          let tempTotalInvoiceAmt = 0;
          if (parseFloat(tempTotal) > 0) {
            if (roundOff > 0) {
              tempTotalInvoiceAmt = parseFloat(
                parseFloat(tempTotal) - parseFloat(roundOff)
              ).toFixed(3);

              setTotalInvoiceAmount(tempTotalInvoiceAmt);
            } else {
              tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);

              setTotalInvoiceAmount(tempTotalInvoiceAmt);
            }
          } else {
            setTotalInvoiceAmount(0);
            // setLegderAmount(0);
          }
          setPrintObj({
            ...printObj,
            stateId: vendorStateId,
            orderDetails: newFormValues,
            taxableAmount: parseFloat(tempAmount).toFixed(3),
            sGstTot: parseFloat(tempSgstVal).toFixed(3),
            cGstTot: parseFloat(tempCgstVal).toFixed(3),
            iGstTot: parseFloat(tempIgstVal).toFixed(3),
            roundOff: roundOff,
            grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
            netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
            fineWtTot: parseFloat(tempFineGold).toFixed(3),
            totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
            balancePayable: parseFloat(tempTotalInvoiceAmt).toFixed(3),
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

  function handleShippingChange(event) {
    setShipping(event.target.value);
    setShippingErr("");
    setShippingVendor("");
  }

  const prevContactIsValid = () => {
    if (formValues.length === 0) {
      return true;
    }

    // const Regex =
    //   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const numberRegex = /^[0-9]{10}$/;
    // const nameRegex = /^[a-zA-Z\s]*$/;
    // if (!email || Regex.test(email) === false) {

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

          let netWeight = formValues[index].netWeight;
          if (
            !netWeight ||
            weightRegex.test(netWeight) === false ||
            netWeight == 0
          ) {
            allPrev[index].errors.netWeight = "Enter Net Weight!";
          } else {
            allPrev[index].errors.netWeight = null;
          }

          // console.log(allPrev[index]);
          setFormValues(allPrev);
          return true;
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
        setCgstVal("");
        setSgstVal("");
        setIgstVal("");
        setTotal("");
        setTotalGrossWeight("");
        setFineGoldTotal("");
      }

      //   const index = vendorData.findIndex(
      //     (element) => element.id === selectedVendor.value
      //   );
      // console.log(index);

      //   if (index > -1) {
      // setLedgerName(vendorData[index].ledger_for_sale);
      // setLedgerNmErr("");

      // setRateValue(vendorData[index].rate);
      // setRateValErr("");

      // setLegderAmount(
      //   (totalInvoiceAmount * parseFloat(vendorData[index].rate)) / 100
      // );
      // setLedgerAmtErr("");
      //   }

      // newFormValues[i].rate = 0;
    }

    // console.log(nm,val)
    if (nm === "netWeight") {
      setAdjustedRate(false);
      newFormValues[i].rate = 0;
    }

    // if (rateFixSelected !== "") {
    //   newFormValues[i].rate = rateFixSelected.label;
    // }
    console.log("rate", newFormValues[i].rate);

    if (newFormValues[i].rate !== "" && newFormValues[i].fineGold !== "") {
      newFormValues[i].amount = parseFloat(
        (parseFloat(newFormValues[i].rate) *
          parseFloat(newFormValues[i].fineGold)) /
          10
      ).toFixed(3);
    }

    let findIndex = stockCodeData.findIndex(
      (item) => item.stock_name_code.id === newFormValues[i].stockCode.value
    );
    // console.log(findIndex);
    if (findIndex > -1) {
      newFormValues[i].categoryName = stockCodeData[findIndex].billing_name;
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

    function netWeight(item) {
      // console.log(parseFloat(item.netWeight));
      return parseFloat(item.netWeight);
    }

    // console.log(formValues.map(amount).reduce(sum))

    let tempAmount = formValues
      .filter((item) => item.amount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    //.reduce(sum);
    // console.log("tempAmount",tempAmount)
    setAmount(parseFloat(tempAmount).toFixed(3));
    let tempCgstVal;
    let tempSgstVal;
    let tempIgstVal;
    if (vendorStateId === 12) {
      tempCgstVal = formValues
        .filter((item) => item.CGSTval !== "")
        .map(CGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
      setCgstVal(parseFloat(tempCgstVal).toFixed(3));

      tempSgstVal = formValues
        .filter((item) => item.SGSTval !== "")
        .map(SGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setSgstVal(parseFloat(tempSgstVal).toFixed(3));
    } else {
      tempIgstVal = formValues
        .filter((item) => item.IGSTVal !== "")
        .map(IGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setIgstVal(parseFloat(tempIgstVal).toFixed(3));
    }

    let tempTotal = formValues
      .filter((item) => item.Total !== "")
      .map(Total)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotal(parseFloat(tempTotal).toFixed(3));

    let tempGrossWtTot = parseFloat(
      newFormValues
        .filter((data) => data.grossWeight !== "")
        .map(grossWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

    let tempNetWtTot = parseFloat(
      newFormValues
        .filter((data) => data.netWeight !== "")
        .map(netWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);

    function fineGold(item) {
      return parseFloat(item.fineGold);
    }

    let tempFineGold = formValues
      .filter((item) => item.fineGold !== "")
      .map(fineGold)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
    let tempTotalInvoiceAmt = 0;
    if (parseFloat(tempTotal) > 0) {
      if (roundOff > 0) {
        tempTotalInvoiceAmt = parseFloat(
          parseFloat(tempTotal) - parseFloat(roundOff)
        ).toFixed(3);

        setTotalInvoiceAmount(tempTotalInvoiceAmt);
      } else {
        tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);

        setTotalInvoiceAmount(tempTotalInvoiceAmt);
      }
    } else {
      setTotalInvoiceAmount(0);
      //   setLegderAmount(0);
    }

    setPrintObj({
      ...printObj,
      stateId: vendorStateId,
      orderDetails: newFormValues,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCgstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      roundOff: roundOff,
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      fineWtTot: parseFloat(tempFineGold).toFixed(3),
      totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
      balancePayable: parseFloat(tempTotalInvoiceAmt).toFixed(3),
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
      tempArray[index].balance = (
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
      console.log(finalRate / fineGoldTotal);
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
    let newFormValues = [...formValues];
    setAdjustedRate(false);
    setShortageRfix("");
    newFormValues[index].stockCode = "";
    newFormValues[index].categoryName = "";
    newFormValues[index].selectedHsn = "";
    newFormValues[index].grossWeight = "";
    newFormValues[index].netWeight = "";
    newFormValues[index].availableStock = "";
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
    newFormValues[index].errors = {
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
    };

    // setFormValues(newFormValues)
    changeTotal(newFormValues, false);
  }

  const vendorClientArr = [
    { id: 1, name: "Vendor" },
    { id: 2, name: "Client" },
  ];

  const handleVendorClientChange = (value) => {
    resetForm();
    setVendorClient(value);
    setSelectedVendor("");
    setSelectedVendorErr("");
    setSelectedClient("");
    setSelectedClientErr("");
    setSelectedClientFirm("");
    setSelectedClientFirmErr("");
    setAdjustedRate(false);
    setShippingVendor("");
    setShipping("");
    setClientCompanies([]);
    setSelectedCompany("");
    setSelectedCompErr("");

    setPrintObj({
      ...printObj,
      supplierName: "",
      supAddress: "",
      supplierGstUinNum: "",
      supPanNum: "",
      supState: "",
      supCountry: "",
      supStateCode: "",
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
      taxAmount: "",
      metNarration: "",
      accNarration: "",
      balancePayable: "",
    });
  };

  function handleClientPartyChange(value) {
    resetForm();
    setSelectedClient(value);
    setSelectedClientErr("");
    setSelectedClientFirm("");
    setSelectedClientFirmErr("");
    setAdjustedRate(false);
    setShippingVendor("");
    setShipping("");
    setClientCompanies([]);
    setSelectedCompany("");
    setSelectedCompErr("");

    setPrintObj({
      ...printObj,
      supplierName: "",
      supAddress: "",
      supplierGstUinNum: "",
      supPanNum: "",
      supState: "",
      supCountry: "",
      supStateCode: "",
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
      taxAmount: "",
      metNarration: "",
      accNarration: "",
      balancePayable: "",
    });

    let findIndex = clientData.findIndex((item) => item.id === value.value);
    if (findIndex > -1) {
      getClientsCompanies(value.value);
    }
  }

  function handleClientFirmChange(value) {
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

      setPrintObj({
        ...printObj,
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
        metNarration: "",
        accNarration: "",
        balancePayable: "",
      });
    }
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
        } else {
          setBalanceRfixData([]);
          setTempApiWeight("");
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: `api/ratefix/vendor/balance/2/${clientCompId}`,
        });
      });
  }

  const handleNarrationClick = () => {
    console.log("handleNarr", narrationFlag);
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        flag: 17,
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
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0  makeStyles-root-1 pt-20">
            {!props.viewPopup && (
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
                      {isView
                        ? "View Metal Purchase Return"
                        : "Add Metal Purchase Return"}
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
                  {/* <Button
                    variant="contained"
                    className={classes.button}
                    size="small"
                    //   key={idx}
                    onClick={(event) => {
                      History.goBack();
                    }}
                  >
                    Back
                  </Button> */}
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
            )}

            <div className="main-div-alll">
              {loading && <Loader />}

              <div
                className="pb-32 pt-16"
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
                    <Grid
                      className="metal-purchase-input-ml"
                      container
                      spacing={3}
                    >
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
                            className="mb-16"
                            name="voucherDate"
                            value={voucherDate}
                            error={VoucherDtErr.length > 0 ? true : false}
                            helperText={VoucherDtErr}
                            // onKeyDown={(e => e.preventDefault())}
                            onChange={(e) => handleInputChange(e)}
                            onBlur={handleDateBlur}
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
                          // label="Voucher Number"
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
                              id="view_jewellary_dv"
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              classes={classes}
                              styles={selectStyles}
                              options={vendorData.map((suggestion) => ({
                                value: suggestion.id,
                                label: suggestion.name,
                              }))}
                              // components={components}
                              value={selectedVendor}
                              onChange={handlePartyChange}
                              placeholder="Party Name"
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
                              // label="Firm Name"
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
                              placeholder="Party Name"
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
                              placeholder="Firm Name"
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
                        <p style={{ paddingBottom: "3px" }}>Opposite Account</p>
                        <Select
                          className="matalpurchase_select_secand"
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
                          placeholder="Opposite Account"
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
                        <p style={{ paddingBottom: "3px" }}>Party Voucher Number</p>
                        <TextField
                          className=""
                          // label="Party Voucher Number"
                          name="partyVoucherNum"
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
                        <p style={{ paddingBottom: "3px" }}>Party Voucher Date</p>
                        <TextField
                          // label="Party Voucher Date"
                          type="date"
                          className="mb-16"
                          name="partyVoucherDate"
                          value={partyVoucherDate}
                          error={partyVoucherDateErr.length > 0 ? true : false}
                          helperText={partyVoucherDateErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
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
                          <p style={{ paddingBottom: "3px" }}>Upload Document</p>
                          <TextField
                            className="mb-16 uploadDoc"
                            // label="Upload Document"
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
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p style={{ paddingBottom: "3px" }}>Ship to other party</p>
                        <select
                          className={clsx(classes.normalSelect, "focusClass")}
                          required
                          value={shipping}
                          onChange={(e) => handleShippingChange(e)}
                          disabled={isView}
                        >
                          <option hidden value="">
                            Ship to other party
                          </option>
                          <option value="1">Yes</option>
                          <option value="0">No</option>
                        </select>

                        <span style={{ color: "red" }}>
                          {shippingErr.length > 0 ? shippingErr : ""}
                        </span>
                      </Grid>

                      {shipping === "1" && (
                        <>
                          <Grid
                            item
                            lg={2}
                            md={4}
                            sm={4}
                            xs={12}
                            style={{ padding: 6 }}
                          >
                            <p style={{ paddingBottom: "3px" }}>Shipping Party Name</p>
                            <Select
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              classes={classes}
                              styles={selectStyles}
                              options={clientdata
                                // .filter((item) => item.id !== selectedVendor.value)
                                .map((suggestion) => ({
                                  value: suggestion.id,
                                  label: suggestion.name,
                                }))}
                              // components={components}
                              value={shippingVendor}
                              onChange={handleShipVendorSelect}
                              placeholder="Shipping Party Name"
                              isDisabled={isView}
                            />

                            <span style={{ color: "red" }}>
                              {shipVendErr.length > 0 ? shipVendErr : ""}
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
                            <p style={{ paddingBottom: "3px" }}>Shipping Party Company</p>
                            <Select
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              classes={classes}
                              styles={selectStyles}
                              options={clientCompanies
                                // .filter((item) => item.id !== selectedVendor.value)
                                .map((suggestion) => ({
                                  value: suggestion.id,
                                  label: suggestion.company_name,
                                }))}
                              // components={components}
                              value={selectedCompany}
                              onChange={handleShipCompanyChange}
                              placeholder="Shipping Party Company"
                              isDisabled={isView}
                            />

                            <span style={{ color: "red" }}>
                              {selectedCompErr.length > 0
                                ? selectedCompErr
                                : ""}
                            </span>
                          </Grid>
                        </>
                      )}
                    </Grid>
                    <div className="addmetalpurchaseresturn-tabel addmetalpurchaseresturn-tabel-blg addmetalpurchaseresturn-tabel-dv view_addmetalpurchaseresturn-tabel-dv">
                      <div
                        className="mt-16"
                        style={{
                          border: "1px solid lightgray",
                          paddingBottom: 5,
                        }}
                      >
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
                            >
                              {/* delete action */}
                            </div>
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
                            Available Stock
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
                          <div key={index} className=" castum-row-dv all-purchase-tabs">
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
                              className={classes.selectBox}
                              classes={classes}
                              styles={selectStyles}
                              options={stockCodeData
                                .filter((array) =>
                                  formValues.every(
                                    (item) =>
                                      !(
                                        item.stockCode?.value ===
                                          array.stock_name_code.id &&
                                        item.stockCode.label ===
                                          array.stock_name_code.stock_code
                                      )
                                  )
                                )
                                .map((suggestion) => ({
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
                              name="availableStock"
                              className=""
                              value={element.availableStock || ""}
                              disabled
                              // value={departmentNm}
                              // error={
                              //   element.errors !== undefined
                              //     ? element.errors.categoryName
                              //       ? true
                              //       : false
                              //     : false
                              // }
                              // helperText={
                              //   element.errors !== undefined
                              //     ? element.errors.categoryName
                              //     : ""
                              // }
                              // onChange={(e) => handleChange(index, e)}
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
                              inputRef={(el) => (inputRef.current[index] = el)}
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
                                  ? Config.numWithComma(element.rate)
                                  : element.rate || ""
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
                                  ? Config.numWithComma(element.amount)
                                  : element.amount || ""
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
                                      ? Config.numWithComma(element.CGSTval)
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
                                      ? Config.numWithComma(element.SGSTval)
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
                                      ? Config.numWithComma(element.IGSTVal)
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
                                  ? Config.numWithComma(element.Total)
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
                          className=" castum-row-dv"
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
                          ></div>
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

                  <Grid className="export-metal-mt" item xs={2}>
                    <Button
                      id="btn-save"
                      variant="contained"
                      color="primary"
                      // style={{ float: "right" }}
                      className="w-224 mx-auto  mr-16 mb-16"
                      aria-label="Register"
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
                      // className={classes.tableheader}
                    >
                      <label
                        className="first-label-total"
                        style={{ width: "34.8%" }}
                      >
                        Round Off
                      </label>
                      <label className="ml-2 input-sub-total">
                        <TextField
                          // label="Round off"
                          name="roundOff"
                          className={clsx(
                            classes.inputBoxTEST,
                            "ml-2 addconsumble-dv"
                          )}
                          type={isView ? "text" : "number"}
                          // style={{width:'10%'}}
                          value={roundOff}
                          error={roundOffErr.length > 0 ? true : false}
                          helperText={roundOffErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          fullWidth
                          disabled={isView || formValues[0].stockCode === ""}
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
                      <label className="mr-2">Total Invoice Amount</label>
                      <label className="ml-2">
                        {isView
                          ? Config.numWithComma(totalInvoiceAmount)
                          : totalInvoiceAmount}
                      </label>
                    </div>
                  </div>

                  {/* <div className="textarea-row">
                  <TextField
                    className="mt-16 mr-2"
                    style={{ width: "50%" }}
                    label="Metal Narration"
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
                  <TextField
                    className="mt-16 ml-2"
                    style={{ width: "50%" }}
                    label="Account Narration"
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
                </div> */}
                  <Grid container className="mt-16">
                    <Grid
                      item
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      style={{ padding: 6 }}
                    >
                      <p style={{ paddingBottom: "3px" }}>Metal narration</p>
                      <TextField
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
                        onClick={(e) => {
                          // handleFormSubmit(e);
                          checkforPrint(e);
                        }}
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
                        <MetalPurReturnPrintComp
                          ref={componentRef}
                          printObj={printObj}
                        />
                      </div>
                    </div>
                  )}
                  {isView && (
                    <Button
                      variant="contained"
                      className={clsx(classes.button, "btn-print-save")}
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
              purchase_flag_id={idToBeView?.id}
              purchase_flag="17"
              concateDocument={concateDocument}
              viewPopup={props.viewPopup}
            />

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
                id="modesize-dv"
              >
                <h5
                  className="popup-head p-5"
                  // style={{
                  //   textAlign: "center",
                  //   backgroundColor: "black",
                  //   color: "white",
                  // }}
                >
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
                        // className="mt-16 ml-56"
                        className={clsx(classes.inputBoxTEST, "mt-1")}
                        type={isView ? "text" : "number"}
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
                      placeholder="Average rate"
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
                  {/* <Button
                    variant="contained"
                    color="primary"
                    className="w-full mx-auto mt-16"
                    style={{
                      backgroundColor: "#4caf50",
                      border: "none",
                      color: "white",
                    }}
                    onClick={(e) => adjustRateFix(e)}
                  >
                    Save
                  </Button> */}
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
};

export default AddMetalPurchaseReturn;


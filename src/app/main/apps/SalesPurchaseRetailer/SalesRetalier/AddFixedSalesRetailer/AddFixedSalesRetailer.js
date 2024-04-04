import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Typography,
  TextField,
  Checkbox,
  FormControl,
  FormControlLabel,
  Paper,
  Table,
  TableFooter,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Select, { createFilter } from "react-select";
import AsyncCreatable from "react-select/lib/Creatable";
import History from "@history";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Loader from "app/main/Loader/Loader";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Icon, IconButton, Tooltip } from "@material-ui/core";
import moment from "moment";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import { SalesRetalierPrint } from "../PrintComponent/SalesRetalierPrint";
import Icones from "assets/fornt-icons/Mainicons";
import MaUTable from "@material-ui/core/Table";
import { UpdateRetailerNarration } from "../../Helper/UpdateRetailerNarration";
import { DocumentUploadRetailer } from "app/main/apps/SalesPurchase/Helper/DocumentUploadRetailer";
import ViewDocModelRetailer from "app/main/apps/SalesPurchase/Helper/ViewDocModelRetailer";
import AddClientRetailer from "../../../MasterRetailer/ClientRetailer/AddClientRetailer/AddClientRetailer";
import Modal from "@material-ui/core/Modal";
import AppContext from "app/AppContext";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    // width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  button: {
    // margin: 5,
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
  },
  table: {
    minWidth: 1700,
  },
  tableRowPad: {
    padding: 7,
  },
  tablePad: {
    padding: 0,
  },
  normalSelect: {
    // marginTop: 8,
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    // borderRadius: 5,
    width: "100%",
  },
  rateFixPaper: {
    position: "absolute",
    // width: 600,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
  },
  diffPopup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tableFooter: {
    backgroundColor: "#EBEEFB !important",
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

const AddFixedSalesRetalier = (props) => {
  const appContext = useContext(AppContext);
  const { SateID } = appContext;
  const [viewState, setViewState] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [printObj, setPrintObj] = useState({
    stateId: "",
    supplierName: "",
    supAddress: "",
    gstNo: "",
    supplierGstUinNum: "",
    supPanNum: "",
    supState: "",
    supCountry: "",
    supStateCode: "",
    purcVoucherNum: "",
    Aamount: "",
    udharAmount: "",
    jamount: "",
    Afinegold: "",
    onlineamount: "",
    chequeamount: "",
    cardamount: "",
    casamount: "",
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
    jewelNarration: "",
    accNarration: "",
    balancePayable: "",
  });
  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);
  const handleAfterPrint = () => {
    //React.useCallback
    //resetting after print
    checkAndReset();
  };

  function checkAndReset() {
    if (isView === false) {
      History.goBack();
    }
  }

  const handleBeforePrint = React.useCallback(() => {}, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
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

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Sales Domestic Voucher" + getDateAndTime(),
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

  const [documentList, setDocumentList] = useState([]);
  const [docModal, setDocModal] = useState(false);
  // const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);

  // useEffect(() => {
  //   if (docFile) {
  //     DocumentUploadRetailer(docFile, 22)
  //       .then((response) => {
  //         console.log(response);
  //         if (response.data.success) {
  //           const arrData = response.data.data;
  //           const fileId = [];
  //           arrData.map((item) => {
  //             fileId.push(item.id);
  //           });
  //           setDocIds(fileId);
  //         } else {
  //           dispatch(
  //             Actions.showMessage({
  //               message: response.data.message,
  //               variant: "error",
  //             })
  //           );
  //         }
  //       })
  //       .catch((error) => {
  //         handleError(error, dispatch, {
  //           api: "retailerProduct/api/salespurchasedocs/upload",
  //           body: docFile,
  //         });
  //       });
  //   }
  // }, [docFile]);

  useEffect(() => {
    if (props.reportView) {
      NavbarSetting(props.reportView, dispatch);
    } else {
      NavbarSetting("Sales-Retailer", dispatch);
    }
  }, []);

  function checkforPrint() {
    setPrintObj({
      supplierName: selectedVendor,
      supplierGstUinNum: gstNo,
      purcVoucherNum: voucherNumber,
      orderDetails: packingSlipData,
      gstNo: gstNo,
      voucherDate: moment(voucherDate).format("DD-MM-YYYY"),
      Afinegold: parseFloat(JrfineGold).toFixed(2),
      jamount: parseFloat(JrAmount).toFixed(2),
      casamount: parseFloat(caseamunt).toFixed(2),
      cardamount: parseFloat(cardamount).toFixed(2),
      onlineamount: parseFloat(onlineamount).toFixed(2),
      chequeamount: parseFloat(chequeamount).toFixed(2),
      Aamount: parseFloat(JrAdvanceAmount).toFixed(2),
      udharAmount: udharAmount,
      // purcVoucherNum: voucherNumber,
      taxableAmount: parseFloat(finalAmount).toFixed(2),
      roundOff: roundOff,
      pcsTotal: HelperFunc.getTotalOfField(packingSlipData, "phy_pcs"),
      grossWtTOt: TotaleGrossWight,
      netWtTOt: TotalNetWeight,
      totalInvoiceAmt: parseFloat(totalInvoiceAmount).toFixed(2),
      totalgst: totalGST,
      fixed: true,
    });
    if (isView) {
      handlePrint();
    } else {
      if (
        PartynameValidation() &&
        salesmanValedation() &&
        // oppositeAcValidation() &&
        goldRateValidation() &&
        !silverRateErr &&
        barcodevalidation() &&
        barcodeEntryValidation() &&
        validateEmptyError() &&
        jrgrossValdation() &&
        jrNetValdation() &&
        jrPurityValdation() &&
        finalgettingamountCheck() &&
        goldJrRateValueValidation() &&
        !roundOffErr
      ) {
        if (isButtonDisabled) return;
        setIsButtonDisabled(true);
        createFromPackingSlip(false, true);
      }
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

  const classes = useStyles();
  const theme = useTheme();
  const [modalStyle] = React.useState(getModalStyle);
  const [loading, setLoading] = useState(false);
  const selectedDepartment = window.localStorage.getItem("SelectedDepartment");
  const isSchemeRetailer = window.localStorage.getItem("isSchemeRetailer");
  const [makingCharge, setmakingCharge] = useState("");
  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");
  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);
  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");
  const [vendorData, setVendorData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedVendorErr, setSelectedVendorErr] = useState("");
  const [schemeClientdoc, setSchemeClientdoc] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState("");
  const [schemeAmount, setSchemeAmount] = useState("");
  const [openClientModal, setOpenClientModal] = useState(false);
  const [phoneNumOne, setPhoneNumOne] = useState("");
  const [udharAmount, setUdharAmount] = useState("");
  const [udharAmountErr, setudharAmountErr] = useState("");

  // const [email, setEmail] = useState("");
  // const [companyAddress, setCompanyAddress] = useState("");
  // const [adharcad, setAdharCad] = useState("");
  const [panNo, setPanNo] = useState("");
  const [gstNo, setGstNo] = useState("");

  // const [selectedCountry, setSelectedCountry] = useState("");
  // const [selectedState, setSelectedState] = useState("");
  // const [selectedCity, setSelectedCity] = useState("");
  // const [pincode, setpincode] = useState("");

  const [salesMan, setsalesMan] = useState([{ id: 0, name: "Self" }]);
  const [selectedsalesMan, setSelectedsalesMan] = useState({
    value: 0,
    label: "Self",
  });
  const [selectedsalesManErr, setSelectedsalesManErr] = useState("");

  const [oppositeAccData, setOppositeAccData] = useState([]);
  const [oppositeAccSelected, setOppositeAccSelected] = useState("");
  const [selectedOppAccErr, setSelectedOppAccErr] = useState("");

  const [goldRate, setGoldRate] = useState("");
  const [goldRateErr, setGoldRateErr] = useState("");
  const [actualGoldRate, setActualGoldRate] = useState(false);
  const [goldMaxValue, setGoldMaxValue] = useState(0);
  const [goldMinValue, setGoldMinValue] = useState(0);

  const [silverRate, setSilverRate] = useState("");
  const [silverRateErr, setSilverRateErr] = useState("");
  const [actualSilverrate, setActualSilverrate] = useState(false);
  const [silverMaxValue, setSilverMaxValue] = useState(0);
  const [silverMinValue, setSilverMinValue] = useState(0);

  const [orderData, setOrderData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedOrderErr, setSelectedOrderErr] = useState("");

  const [packingSlipNo, setPackingSlipNo] = useState("");
  const [packingSlipErr, setPackingSlipErr] = useState("");
  const [packingSearch, setPackingSearch] = useState("");
  const [packingSlipApiData, setPackingSlipApiData] = useState([]);

  const [lotArr, setlotArr] = useState([]);
  const [categoryList, setcategoryList] = useState([]);
  const [packingSlipData, setPackingSlipData] = useState([
    {
      rate_consider: { value: 2, label: "Net WT" },
      labor_consider: { value: 1, label: "Gross WT" },
      labor_per: { value: 3, label: "Per Pcs" },
      barcode_id: "",
      lot_detail_id: "",
      barcode: "",
      category: "",
      hsn: "",
      phy_pcs: "",
      gross_wgt: "",
      net_wgt: "",
      purity: "",
      rate: "",
      rateCharge: "",
      total_hallmark_charges: "",
      gst: "",
      gstVal: "",
      laberpergram: "",
      totalLabour: "",
      amount: "",
      viabarcode: false,
      errors: {},
    },
  ]);

  const [TotaleGrossWight, setTotaleGrossWight] = useState(0);
  const [TotalNetWeight, setTotalNetWeight] = useState(0);
  const [TotalHallMasrk, setTotalHallMasrk] = useState(0);
  const [TotalAmount, setTotalAmount] = useState(0);

  const [subTotal, setSubTotal] = useState(0); //amount
  const [totalLabour, setTotalLabor] = useState(0);
  const [totalGST, setTotalGST] = useState(0);
  const [roundOff, setRoundOff] = useState("");
  const [roundOffErr, SetRoundOffErr] = useState("");
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState("");

  const [JrGross, setJrGross] = useState("");
  const [JrGrossErr, setJrGrossErr] = useState("");

  const [JrNetWight, setJrNetWight] = useState("");
  const [JrNetWightErr, setJrNetWightErr] = useState("");

  const [JrPurity, setJrPurity] = useState("");
  const [JrPurityErr, setJrPurityErr] = useState("");

  const [JrfineGold, setJrfineGold] = useState(0);
  const [JrfineGoldErr, setJrfinGoldErr] = useState("");

  const [JrGRate, setGRate] = useState(0);
  const [JrGRateErr, setGRateErr] = useState("");

  const [JrAmount, setJrAmount] = useState(0);
  const [JrAmountErr, setJrAmountErr] = useState("");

  const [JrAdvanceAmount, setJrAdvanceAmount] = useState(0);
  const [JrAdvanceAmountErr, setJrAdvanceAmountErr] = useState("");

  const [isCaseChecked, setIsCaseChecked] = useState(false);
  const [isCardChecked, setIsCardChecked] = useState(false);
  const [isOnlineChecked, setIsOnlineChecked] = useState(false);
  const [ischequeChecked, setIschequeChecked] = useState(false);

  const [caseamunt, setcaseamunt] = useState(0);
  const [caseamuntErr, setcaseamuntErr] = useState("");

  const [cardamount, setcardamount] = useState(0);
  const [cardamountErr, setcardamountErr] = useState("");

  const [onlineamount, setonlineamount] = useState(0);
  const [onlineamountErr, setonlineamountErr] = useState("");

  const [chequeamount, setchequeamount] = useState(0);
  const [chequeamountErr, setchequeamountErr] = useState("");

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [jewelNarration, setJewelNarration] = useState("");
  const [jewelNarrationErr, setJewelNarrationErr] = useState("");

  const [isView, setIsView] = useState(false); //for view Only
  const [narrationFlag, setNarrationFlag] = useState(false);

  const isPasswordTwo = localStorage.getItem("isPasswordTwo");
  const [advanceData, setadvanceData] = useState("");
  const [udharAmountData, setUdharAmountData] = useState([]);

  const rateConsiderArr = [
    { value: 1, label: "Gross WT" },
    { value: 2, label: "Net WT" },
    { value: 3, label: "Fixed per pcs" },
  ];
  const labourConsiderArr = [
    { value: 1, label: "Gross WT" },
    { value: 2, label: "Net WT" },
    { value: 3, label: "PCS" },
  ];
  const laberPerArr = [
    { value: 1, label: "Per Gram" },
    { value: 2, label: "Per (%)" },
    { value: 3, label: "Per Pcs" },
  ];

  const handleCaseCheckboxChange = (event) => {
    setIsCaseChecked(event.target.checked);
  };

  const handleCardCheckboxChange = (event) => {
    setIsCardChecked(event.target.checked);
  };
  const handleOnlineCheckboxChange = (event) => {
    setIsOnlineChecked(event.target.checked);
  };
  const handlechequeCheckboxChange = (event) => {
    setIschequeChecked(event.target.checked);
  };
  useEffect(() => {
    if (isView) {
      setIsCaseChecked(true);
      setIsCardChecked(true);
      setIsOnlineChecked(true);
      setIschequeChecked(true);
    }
  }, [isView]);

  useEffect(() => {
    if (selectedOrder) {
      getAdvanceData();
    }
  }, [selectedOrder]);
  useEffect(() => {
    if (selectedVendor) {
      getUdharAmountData();
    }
  }, [selectedVendor]);

  useEffect(() => {
    if (isSchemeRetailer == 1 && selectedVendor && !idToBeView) {
      getSchemeClientData();
    }
  }, [selectedVendor]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (packingSearch) {
        getPackingSlipData(packingSearch);
      } else {
        setPackingSlipApiData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
    //eslint-disable-next-line
  }, [packingSearch]);

  var idToBeView;
  if (props.location) {
    idToBeView = props.location.state;
  } else if (props.voucherId) {
    idToBeView = { id: props.voucherId };
  }

  useEffect(() => {
    if (0 > parseFloat(finalAmount)) {
      setudharAmountErr("Enter valid amount");
    } else {
      setudharAmountErr("");
    }
    if (0 > parseFloat(finalAmount)) {
      setJrAdvanceAmountErr("Enter valid amount");
    } else {
      setJrAdvanceAmountErr("");
    }
  }, [JrAdvanceAmount, udharAmount, finalAmount]);

  const inputRef = useRef([]);
  const pcsInputRef = useRef([]); //for pcs in table

  const dispatch = useDispatch();

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    if (roundOff && totalInvoiceAmount) {
      const uperAmoutTotal = parseFloat(
        parseFloat(subTotal) +
          parseFloat(totalLabour) +
          parseFloat(totalGST) +
          parseFloat(TotalHallMasrk)
      );
      const tempTotalInvoiceAmtOne = parseFloat(
        parseFloat(uperAmoutTotal) + parseFloat(roundOff)
      );
      setTotalInvoiceAmount(parseFloat(tempTotalInvoiceAmtOne));
    } else {
      const uperAmoutTotal = parseFloat(
        parseFloat(subTotal) +
          parseFloat(totalLabour) +
          parseFloat(totalGST) +
          parseFloat(TotalHallMasrk)
      );
      setTotalInvoiceAmount(parseFloat(uperAmoutTotal));
    }
  }, [roundOff]);

  useEffect(() => {
    const dataOpposite = HelperFunc.getOppositeAccountDetails(
      "SalesDomesticForRetailer"
    );
    setOppositeAccData(dataOpposite);
    setOppositeAccSelected(dataOpposite[0]);
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true);
      getSalesDomesticRecord(idToBeView.id);
    } else {
      setNarrationFlag(false);
      getTodaysGoldRate();
      getTodaysSilverRate();
      getMakingCharges();
      getCategoryList();
      getVoucherNumber(); //if view only then no need to get new voucher number, we will set data coming from api
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (idToBeView === undefined) {
      getVendordata();
      getsalesmanData();
    }
  }, []);

  useEffect(() => {
    const parsedJrPurity = JrPurity ? parseFloat(JrPurity).toFixed(8) : 0;
    const parsedJrNetWeight = JrNetWight
      ? parseFloat(JrNetWight).toFixed(3)
      : 0;
    const parsedJrGRate = JrGRate ? parseFloat(JrGRate) : 0;

    const calculatedJrfineGold = (parsedJrPurity * parsedJrNetWeight) / 100;
    const calculatedJrAmount =
      (parsedJrGRate * parseFloat(calculatedJrfineGold).toFixed(2)) / 10;

    setJrfineGold(parseFloat(calculatedJrfineGold));
    setJrAmount(parseFloat(calculatedJrAmount));
  }, [JrPurity, JrGRate, JrNetWight]);

  useEffect(() => {
    const updatedUdharAmt = udharAmount ? udharAmount : 0;
    const parsedTotalInvoiceAmount = totalInvoiceAmount
      ? parseFloat(totalInvoiceAmount).toFixed(2)
      : 0;
    const parsedJrAmount = JrAmount ? parseFloat(JrAmount).toFixed(2) : 0;
    const parsedJrAdvanceAmount = JrAdvanceAmount
      ? parseFloat(JrAdvanceAmount).toFixed(2)
      : 0;
    const minusAmount =
      parseFloat(parsedJrAmount) +
      parseFloat(parsedJrAdvanceAmount) +
      parseFloat(updatedUdharAmt);

    const calculatedFinalAmount =
      parseFloat(parsedTotalInvoiceAmount) - parseFloat(minusAmount);
    setFinalAmount(parseFloat(calculatedFinalAmount).toFixed(2));
  }, [totalInvoiceAmount, JrAmount, JrAdvanceAmount, udharAmount]);

  function getSchemeClientData() {
    axios
      .get(
        Config.getCommonUrl() +
          `retailerProduct/api/scheme/list/client/${selectedVendor.value}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setSchemeClientdoc(response.data.data.ClientScheme);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: `retailerProduct/api/scheme/list/client/${selectedVendor.value}`,
        });
      });
  }

  function getTodaysGoldRate() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/goldRateToday")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const goldrateval = response.data.data.rate;
          const percentage = response.data.data.percentage;
          const minValue =
            goldrateval - (goldrateval * parseFloat(percentage)) / 100;
          const maxValue =
            goldrateval + (goldrateval * parseFloat(percentage)) / 100;
          console.log(minValue, maxValue, "....");
          setGoldRate(goldrateval);
          setActualGoldRate(true);
          setGoldMaxValue(maxValue);
          setGoldMinValue(minValue);
        } else {
          dispatch(
            Actions.showMessage({
              message: "Today's Gold Rate is not set",
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "retailerProduct/api/goldRateToday",
        });
      });
  }

  function getTodaysSilverRate() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/silverRateToday")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const silverrateval = response.data.data.rate;
          const percentage = response.data.data.percentage;
          const minValue =
            silverrateval - (silverrateval * parseFloat(percentage)) / 100;
          const maxValue =
            silverrateval + (silverrateval * parseFloat(percentage)) / 100;
          console.log(minValue, maxValue, "....");
          setSilverRate(silverrateval);
          setActualSilverrate(true);
          setSilverMaxValue(maxValue);
          setSilverMinValue(minValue);
        } else {
          dispatch(
            Actions.showMessage({
              message: "Today's Silver Rate is not set",
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "retailerProduct/api/goldRateToday",
        });
      });
  }

  function getMakingCharges() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/makingCharge")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setmakingCharge(response.data.data[0]);
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
          api: "retailerProduct/api/goldRateToday",
        });
      });
  }

  function getCategoryList() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/productcategory")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setcategoryList(response.data.data);
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
          api: "retailerProduct/api/goldRateToday",
        });
      });
  }

  function getSalesDomesticRecord(id) {
    setLoading(true);
    let api = "";
    if (props.forDeletedVoucher && isPasswordTwo == 0) {
      api = `retailerProduct/api/salesDomestic/${id}?deleted_at=1`;
    } else if (isPasswordTwo == 0) {
      api = `retailerProduct/api/salesDomestic/${id}`;
    } else if (isPasswordTwo == 1) {
      api = `retailerProduct/api/salesWt/wt/${id}`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response.data.data);

        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              let finalData = response.data.data.data;

              setVoucherNumber(finalData.voucher_no);
              setAllowedBackDate(true);
              setVoucherDate(finalData.purchase_voucher_create_date);
              setmakingCharge({ type: finalData.making_charges_type });
              // setCompanyAddress(finalData.Client.address);
              setPanNo(finalData.Client.pan_number);
              setGstNo(finalData.Client.gst_number);
              setUdharAmount(finalData.udhar_amount);
              setPhoneNumOne(finalData.Client.mobile_number);
              // setEmail(finalData.Client.email);
              // setAdharCad(finalData.Client.adhar_card);
              // setSelectedCountry(finalData.Client.CountryName.name)
              // setSelectedState(finalData.Client.StateName.name)
              // setSelectedCity(finalData.Client.CityName.name)
              // setpincode(finalData.Client.pincode)

              setSelectedsalesMan({
                value: finalData.salesman?.id,
                label: finalData.salesman.name,
              });
              setOppositeAccSelected({
                value: finalData.opposite_account_id,
                label: finalData.OppositeAccount.name,
              });
              if (finalData.orderInfo) {
                setSelectedOrder({
                  value: finalData.orderInfo?.id,
                  label: finalData.orderInfo?.order_number,
                });
              } else {
                setSelectedOrder("");
              }
              let temp = finalData.SalesDomesticOrders;
              setSelectedVendor({
                value: finalData.Client.id,
                label: finalData.Client.client_Name,
                sId: temp[0].sgst ? SateID : 0,
                data: finalData.Client
              });
              const arrData = [];
              temp.map((e) => {
                arrData.push({
                  rate_consider: {
                    value: Number(e.rate_consider),
                    label:
                      e.rate_consider == 1
                        ? "Gross WT"
                        : e.rate_consider == 2
                        ? "Net WT"
                        : "Fixed per pcs",
                  },
                  labor_consider: {
                    value: Number(e.labour_consider),
                    label:
                      e.labour_consider == 1
                        ? "Gross WT"
                        : e.labour_consider == 2
                        ? "Net WT"
                        : "PCS",
                  },
                  labor_per: {
                    value: Number(e.labour_per),
                    label:
                      e.labour_per == 1
                        ? "Per Gram"
                        : e.labour_per == 2
                        ? "Per (%)"
                        : "Per Pcs",
                  },
                  barcode:
                    e.lot_detail_id == 0
                      ? e.heading_name
                      : e.LotDetails?.BarCodeProductSD?.barcode,
                  category: {
                    value: e?.ProductCategory?.id,
                    label: e?.ProductCategory?.category_name,
                  },
                  hsn: e?.hsn_number,
                  phy_pcs: e?.pcs,
                  gross_wgt: e?.gross_wt,
                  net_wgt: e?.net_wt,
                  purity: e?.purity,
                  rate: e?.fine_rate,
                  total_hallmark_charges: e?.hallmark_charges,
                  gst: e?.gst,
                  laberpergram: e?.laberpergram,
                  amount: e?.amount,
                  rateCharge: e?.rate_charge,
                  gstVal: e?.gst_value,
                  totalLabour: e?.total_labour,
                });
              });
              setPackingSlipData(arrData);
              calCulateTotalcall(
                arrData,
                finalData.round_off === null ? "" : finalData.round_off
              );
              setRoundOff(
                finalData.round_off === null ? "" : finalData.round_off
              );
              setFinalAmount(parseFloat(finalData.JR_final_invoice_amount));
              setDocumentList(finalData.salesPurchaseDocs);
              setAccNarration(
                finalData.account_narration !== null
                  ? finalData.account_narration
                  : ""
              );
              setJewelNarration(
                finalData.jewellery_narration !== null
                  ? finalData.jewellery_narration
                  : ""
              );
              setJrGross(finalData.JR_gross_wt);
              setJrNetWight(finalData.JR_net_wt);
              setJrPurity(finalData.JR_purity);
              setJrfinGoldErr(finalData.JR_total_fine);
              setGRate(finalData.JR_fine_rate);
              setJrAmount(finalData.JR_total_amount);
              setJrAdvanceAmount(finalData.advance_amount);
              setcaseamunt(finalData.cash);
              setcardamount(finalData.card);
              setonlineamount(finalData.online);
              setchequeamount(finalData.cheque);
              setGoldRate(finalData.gold_rate);
              setSilverRate(finalData?.silver_rate);
              setSelectedScheme({
                value: finalData?.SalesScheme?.id,
                label: finalData?.SalesScheme?.doc_number,
              });
              setSchemeAmount(finalData?.SalesScheme?.amount);
              if (
                finalData.cash == 0 ||
                finalData.cash == null ||
                finalData.cash == ""
              ) {
                setIsCaseChecked(false);
              }
              if (
                finalData.card == 0 ||
                finalData.card == null ||
                finalData.card == ""
              ) {
                setIsCardChecked(false);
              }
              if (
                finalData.online == 0 ||
                finalData.online == null ||
                finalData.online == ""
              ) {
                setIsOnlineChecked(false);
              }
              if (
                finalData.cheque == 0 ||
                finalData.cheque == null ||
                finalData.cheque == ""
              ) {
                setIschequeChecked(false);
              }
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
        setLoading(false);
        handleError(error, dispatch, { api: api });
      });
  }

  function getVoucherNumber() {
    let api = "";
    if (isPasswordTwo == 1) {
      api = "retailerProduct/api/salesWt/wt/get/voucher";
    } else {
      api = "retailerProduct/api/salesDomestic/get/voucher";
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setVoucherNumber(response.data.data.voucherNo);
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
        handleError(error, dispatch, {
          api: api,
        });
      });
  }

  function getVendordata() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/clientRet")
      .then(function (response) {
        if (response.data.success === true) {
          setVendorData(response.data.data);
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
          api: "retailerProduct/api/clientRet",
        });
      });
  }

  function getsalesmanData() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/salesman")
      .then(function (response) {
        if (response.data.success === true) {
          setsalesMan([...salesMan, ...response.data.data]);
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
          api: "retailerProduct/api/salesman",
        });
      });
  }

  function getclinetlist(id) {
    axios
      .get(Config.getCommonUrl() + `retailerProduct/api/clientRet/${id}`)
      .then((res) => {
        console.log(res);
        const arrData = res.data.data[0];
        setClientdetail(arrData, true);
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `retailerProduct/api/clientRet/${selectedVendor.value}`,
        });
      });
  }

  function setClientdetail(arrData, addedTrue) {
    setOpenClientModal(false);
    if (arrData) {
      if (!addedTrue) {
        getVendordata();
        setSelectedVendor({
          value: arrData.id,
          label: arrData.client_Name,
          sId: arrData.state,
          data: arrData
        });
        setSelectedVendorErr("");
      }
      setPhoneNumOne(arrData.mobile_number);
      // setEmail(arrData.email);
      setGstNo(arrData.gst_number);
      // setCompanyAddress(arrData.address);
      // setAdharCad(arrData.adhar_card);
      // setCompanyAddress(arrData.address);
      setPanNo(arrData.pan_number);
      // setSelectedState(arrData.StateName.name);
      // setSelectedCountry(arrData.CountryName.name);
      // setSelectedCity(arrData.CityName.name);
      // setpincode(arrData.pincode)
      getOrderData(arrData.id);
    } else {
      setSelectedVendor("");
    }
  }

  const addNewRow = () => {
    setPackingSlipData([
      ...packingSlipData,
      {
        rate_consider: { value: 2, label: "Net WT" },
        labor_consider: { value: 1, label: "Gross WT" },
        labor_per: { value: 3, label: "Per Pcs" },
        barcode_id: "",
        lot_detail_id: "",
        barcode: "",
        category: "",
        hsn: "",
        phy_pcs: "",
        gross_wgt: "",
        net_wgt: "",
        purity: "",
        rate: "",
        rateCharge: "",
        total_hallmark_charges: "",
        gst: "",
        gstVal: "",
        laberpergram: "",
        totalLabour: "",
        amount: "",
        viabarcode: false,
        errors: {},
      },
    ]);
  };

  function getOrderData(id) {
    axios
      .get(
        Config.getCommonUrl() + `retailerProduct/api/order/orderdropdown/${id}`
      )
      .then((response) => {
        if (response.data.success === true) {
          console.log(response, "Order");
          setOrderData(response.data.data);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `retailerProduct/api/order/orderdropdown/${selectedVendor.value}`,
        });
        setOrderData([]);
      });
  }

  function getAdvanceData() {
    if (!selectedOrder || !selectedOrder.value) {
      // Handle the case where selectedOrder is not defined or doesn't have a value
      return;
    }
    console.log(selectedOrder.value);
    axios
      .get(
        Config.getCommonUrl() +
          `retailerProduct/api/order/${selectedOrder.value}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          setadvanceData(response.data.data);
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
          api: `retailerProduct/api/order/${selectedOrder.value}`,
        });
      });
  }
  function getUdharAmountData() {
    if (!selectedVendor || !selectedVendor.value) {
      // Handle the case where selectedOrder is not defined or doesn't have a value
      return;
    }
    console.log(selectedVendor.value);
    axios
      .get(
        Config.getCommonUrl() +
          `retailerProduct/api/salesDomestic/clientPendingAmountList/${selectedVendor.value}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          console.log(response.data.data);
          setUdharAmountData(response.data.data);
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
          api: `retailerProduct/api/salesDomestic/clientPendingAmountList/${selectedVendor.value}`,
        });
      });
  }

  const handleChange = (index, event) => {
    const name = event.target.name;
    const value = event.target.value;

    const oldData = [...packingSlipData];
    oldData[index][name] = value;
    oldData[index].errors[name] = "";

    const grossNetRegex = /^(?!0\d)\d{1,9}(?:\.\d+)?$/;
    const pcsRegex = /^[1-9]\d{0,8}$/;

    if (
      name === "phy_pcs" &&
      (pcsRegex.test(value) === false || isNaN(value))
    ) {
      oldData[index].errors[name] = "Enter valid pcs";
    } else if (name === "gross_wgt") {
      if (grossNetRegex.test(value) === false || isNaN(value)) {
        oldData[index].errors[name] = "Enter valid gross weight";
      } else if (
        parseFloat(oldData[index].net_wgt) >
        parseFloat(oldData[index].gross_wgt)
      ) {
        oldData[index].errors["net_wgt"] =
          "Net weight can not be greater than gross weight";
      } else if (
        oldData[index].errors["net_wgt"] &&
        parseFloat(oldData[index].net_wgt) <=
          parseFloat(oldData[index].gross_wgt)
      ) {
        oldData[index].errors["net_wgt"] = "";
      }
    } else if (name === "net_wgt") {
      if (grossNetRegex.test(value) === false || isNaN(value)) {
        oldData[index].errors[name] = "Enter valid net weight";
      } else if (
        parseFloat(oldData[index].net_wgt) >
        parseFloat(oldData[index].gross_wgt)
      ) {
        oldData[index].errors[name] =
          "Net weight can not be greater than gross weight";
      }
    } else if (
      name === "purity" &&
      (grossNetRegex.test(value) === false || isNaN(value))
    ) {
      oldData[index].errors[name] = "Enter valid purity";
    } else if (
      name === "rate" &&
      (grossNetRegex.test(value) === false || isNaN(value))
    ) {
      oldData[index].errors[name] = "Enter valid rate";
    } else if (
      name === "total_hallmark_charges" &&
      (grossNetRegex.test(value) === false || isNaN(value))
    ) {
      oldData[index].errors[name] = "Enter valid hallmark charges";
    } else if (
      name === "laberpergram" &&
      oldData[index].labor_per.value === 1 &&
      (grossNetRegex.test(value) === false || isNaN(value))
    ) {
      oldData[index].errors[name] = "Enter valid labour";
    } else if (
      name === "laberpergram" &&
      oldData[index].labor_per.value === 3 &&
      isNaN(value)
    ) {
      oldData[index].errors[name] = "Enter valid labour";
    } else if (
      name === "laberpergram" &&
      oldData[index].labor_per.value === 2
    ) {
      if (
        grossNetRegex.test(value) === false ||
        isNaN(value) ||
        parseFloat(value) > 100 ||
        parseFloat(value) < 0
      )
        oldData[index].errors[name] =
          "Enter valid labour(it's between 1 t0 100)";
    } else if (
      name === "gst" &&
      (grossNetRegex.test(value) === false || isNaN(value))
    ) {
      oldData[index].errors[name] = "Enter valid gst";
    }
    customCalculation(oldData, index);
  };

  const handleCatChange = (index, value) => {
    const oldData = [...packingSlipData];
    oldData[index]["category"] = value;
    oldData[index]["hsn"] = value.hsn_master.hsn_number;
    oldData[index]["gst"] = value.hsn_master.gst;
    // if(makingCharge.type === "INR" && oldData[index].labor_consider.value !== 3){
    //   oldData[index]['labor_per'] = {value: 1 , label: "Gram"}
    // }else if(makingCharge.type === "PER" && oldData[index].labor_consider.value !== 3){
    //   oldData[index]['labor_per'] =  {value: 2 , label: "Per (%)"}
    // }else if(makingCharge.type === "PCS"){
    //   oldData[index]['labor_per'] = {value: 3 , label: "Pcs"}
    // }

    if (value.is_gold_silver === 1) {
      oldData[index]["rate"] = silverRate ? silverRate : 0;
    } else if (value.is_gold_silver === 0) {
      oldData[index]["rate"] = goldRate ? goldRate : 0;
    }
    oldData[index].errors["category"] = "";
    oldData[index].errors["gst"] = "";
    oldData[index].errors["rate"] = "";
    if (
      oldData[index].rateCharge &&
      oldData[index].totalLabour &&
      oldData[index].gstVal
    ) {
      const tempwithoutPcs = parseFloat(
        parseFloat(oldData[index].rateCharge) +
          parseFloat(oldData[index].totalLabour) +
          parseFloat(oldData[index].gstVal)
      );
      oldData[index].amount = parseFloat(parseFloat(tempwithoutPcs));
      calCulateTotalcall(oldData);
    }
    setPackingSlipData(oldData);
    if (!oldData[index + 1]) {
      addNewRow();
    }
  };

  const handleRateCalChange = (index, value) => {
    const oldData = [...packingSlipData];
    oldData[index]["rate_consider"] = value;
    if (value.value === 3) {
      oldData[index]["labor_consider"] = { value: 3, label: "PCS" };
      oldData[index]["labor_per"] = { value: 3, label: "Per Pcs" };
    }
    customCalculation(oldData, index);
  };

  const handleLabourCalChange = (index, value) => {
    const oldData = [...packingSlipData];
    oldData[index]["labor_consider"] = value;
    if (value.value === 3) {
      oldData[index]["labor_per"] = { value: 3, label: "Per Pcs" };
    } else {
      oldData[index]["labor_per"] = "";
    }
    customCalculation(oldData, index);
  };

  const handleLaborPerChange = (index, value) => {
    const oldData = [...packingSlipData];
    oldData[index]["labor_per"] = value;
    customCalculation(oldData, index);
  };

  const customCalculation = (oldData, index) => {
    //.......new calculation.............
    const addedLabour = oldData[index].laberpergram
      ? oldData[index].laberpergram
      : 0;
    const laborVal = parseFloat(
      parseFloat(oldData[index].phy_pcs) * parseFloat(addedLabour)
    );

    oldData[index].totalLabour = laborVal ? parseFloat(laborVal) : 0;

    const gstdata = oldData[index].gst ? oldData[index].gst : 0;

    if (gstdata) {
      oldData[index].gstVal = parseFloat(
        (parseFloat(laborVal) * parseFloat(gstdata)) / 100
      );
    } else {
      oldData[index].gstVal = 0;
    }

    console.log(oldData[index].gstVal, oldData[index].totalLabour);

    oldData[index].amount = parseFloat(
      parseFloat(oldData[index].gstVal) + parseFloat(oldData[index].totalLabour)
    );

    setPackingSlipData(oldData);
    calCulateTotalcall(oldData);
  };

  const deleteRow = (index, id) => {
    const oldData = [...packingSlipData];

    if (oldData[index + 1]) {
      const newData = oldData.filter((item, i) => {
        if (i !== index) return item;
        return false;
      });
      setPackingSlipData(newData);
      calCulateTotalcall(newData);
      if (id) {
        const newLotArrs = lotArr.filter((temp) => {
          return temp !== id;
        });
        setlotArr(newLotArrs);
      }
    } else {
      oldData[index].rate_consider = { value: 2, label: "Net WT" };
      oldData[index].labor_consider = { value: 1, label: "Gross WT" };
      oldData[index].labor_per = { value: 3, label: "Per Pcs" };
      oldData[index].barcode = "";
      oldData[index].category = "";
      oldData[index].hsn = "";
      oldData[index].phy_pcs = "";
      oldData[index].gross_wgt = "";
      oldData[index].net_wgt = "";
      oldData[index].purity = "";
      oldData[index].rate = "";
      oldData[index].total_hallmark_charges = "";
      oldData[index].laberpergram = "";
      oldData[index].totalLabour = "";
      oldData[index].gst = "";
      oldData[index].gstVal = "";
      oldData[index].amount = "";
      oldData[index].rateCharge = "";
      oldData[index].viabarcode = false;
      oldData[index].barcode_id = "";
      oldData[index].lot_detail_id = "";
      oldData[index].errors = {};
      calCulateTotalcall(oldData);
      setPackingSlipData(oldData);
    }
  };

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "goldRate" && !isNaN(value)) {
      setGoldRate(value);
      if (actualGoldRate) {
        if (
          parseFloat(value) >= goldMinValue &&
          parseFloat(value) <= goldMaxValue
        ) {
          setGoldRateErr("");
        } else {
          setGoldRateErr(
            `Please, enter today's rate between ${goldMinValue} to ${goldMaxValue}`
          );
        }
        reset();
      } else {
        setGoldRateErr("Enter today's gold rate in master");
      }
    } else if (name === "silverRate" && !isNaN(value)) {
      setSilverRate(value);
      if (actualSilverrate) {
        if (
          parseFloat(value) >= silverMinValue &&
          parseFloat(value) <= silverMaxValue
        ) {
          setSilverRateErr("");
        } else {
          setSilverRateErr(
            `Please, enter today's rate between ${silverMinValue} to ${silverMaxValue}`
          );
        }
        reset();
      } else {
        setSilverRateErr("Enter today's silver rate in master");
      }
    } else if (name === "voucherNumber") {
      setVoucherNumber(value);
      setVoucherNumErr("");
    } else if (name === "voucherDate") {
      setVoucherDate(value);
      setVoucherDtErr("");
    } else if (name === "jewelNarration") {
      setJewelNarration(value);
      setJewelNarrationErr("");
    } else if (name === "accNarration") {
      setAccNarration(value);
      setAccNarrationErr("");
    } else if (name === "JRNet") {
      if (value.length < 10 && !isNaN(value)) {
        setJrNetWight(value);
        setJrNetWightErr("");
      }
      // if (parseFloat(TotalNetWeight) < parseFloat(value)) {
      //   setJrNetWightErr("Enter valid net weight");
      // } else {
      //   setJrNetWightErr("");
      // }
    } else if (name === "JRGroos") {
      if (value.length < 10 && !isNaN(value)) {
        setJrGross(value);
        setJrGrossErr("");
      }
      // if (parseFloat(TotaleGrossWight) < parseFloat(value)) {
      //   setJrGrossErr("Enter valid gross weight");
      // } else {
      //   setJrGrossErr("");
      // }
    } else if (name === "JRPurity" && !isNaN(value)) {
      if (value < 0.1 || value > 100) {
        setJrPurityErr("Enter Purity Between  0.1 to 100");
        setJrPurity();
      } else {
        setJrPurity(value);
        setJrPurityErr("");
      }
    } else if (name === "Cash" && !isNaN(value)) {
      setcaseamunt(value);
      setcaseamuntErr("");
    } else if (name === "Card" && !isNaN(value)) {
      setcardamount(value);
      setcardamountErr("");
    } else if (name === "Online" && !isNaN(value)) {
      setonlineamount(value);
      setonlineamountErr("");
    } else if (name === "cheque" && !isNaN(value)) {
      setchequeamount(value);
      setchequeamountErr("");
    } else if (name === "JradvanceAmount" && !isNaN(value)) {
      setJrAdvanceAmount(value);
      // if (parseFloat(value) > parseFloat(totalInvoiceAmount)) {
      //   setJrAdvanceAmountErr("Enter valid amount");
      // } else {
      //   setJrAdvanceAmountErr("");
      // }
    } else if (name === "JRGoldrate" && !isNaN(value)) {
      setGRate(value);
      setGRateErr("");
    } else if (name === "roundOff") {
      setRoundOff(value);
      // if (value > 50 || value < -50) {
      //   SetRoundOffErr("Please Enter value between -50 to 50");
      // } else {
      //   SetRoundOffErr("");
      // }
    } else if (name === "udharAmount" && !isNaN(value)) {
      setUdharAmount(value);
      // if (parseFloat(value) > parseFloat(finalAmount)) {
      //   setudharAmountErr("Enter valid amount");
      // } else {
      //   setudharAmountErr("");
      // }
    }
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();
    if (
      PartynameValidation() &&
      salesmanValedation() &&
      // oppositeAcValidation() &&
      goldRateValidation() &&
      !silverRateErr &&
      barcodevalidation() &&
      barcodeEntryValidation() &&
      validateEmptyError() &&
      jrgrossValdation() &&
      jrNetValdation() &&
      jrPurityValdation() &&
      goldJrRateValueValidation() &&
      finalgettingamountCheck() &&
      !roundOffErr
    ) {
      if (isButtonDisabled) return;
      setIsButtonDisabled(true);
      createFromPackingSlip(true, false);
    }
  }

  function reset(e) {
    if (!e) {
      setVoucherDate(moment().format("YYYY-MM-DD"));
    }
    setPackingSlipErr("");
    setOrderData([]);
    setSelectedOrder("");
    if (document.getElementById("fileinput") !== null) {
      document.getElementById("fileinput").value = "";
    }
    setSubTotal(0);
    setTotalGST(0);
    setRoundOff("");
    setTotalInvoiceAmount(0);
    setFinalAmount(0);
    setAccNarration("");
    setJewelNarration("");
    setSelectedOrder("");
    setPackingSlipNo("");
    setPackingSearch("");
    setlotArr([]);
    setJrAdvanceAmount(0);
    setJrAmount(0);
    setJrfineGold(0);
    setJrPurity("");
    setJrNetWight("");
    setJrGross("");
    setPackingSlipApiData([]);
    setIsCaseChecked(false);
    setIsCardChecked(false);
    setIsOnlineChecked(false);
    setIschequeChecked(false);
    setcaseamunt(0);
    setcardamount(0);
    setonlineamount(0);
    setchequeamount(0);
    calCulateTotalcall(packingSlipData);
    setPackingSlipData([
      {
        rate_consider: { value: 2, label: "Net WT" },
        labor_consider: { value: 1, label: "Gross WT" },
        labor_per: { value: 3, label: "Per Pcs" },
        barcode_id: "",
        lot_detail_id: "",
        barcode: "",
        category: "",
        hsn: "",
        phy_pcs: "",
        gross_wgt: "",
        net_wgt: "",
        purity: "",
        rate: "",
        rateCharge: "",
        total_hallmark_charges: "",
        gst: "",
        gstVal: "",
        laberpergram: "",
        totalLabour: "",
        amount: "",
        viabarcode: false,
        errors: {},
      },
    ]);
  }

  // function handleOppAccChange(value) {
  //   setOppositeAccSelected(value);
  //   setSelectedOppAccErr("");
  // }

  function handleOChange(value) {
    setSelectedOrder(value);
    setSelectedOrderErr("");
    setPackingSlipNo("");
  }

  function PartynameValidation() {
    if (selectedVendor === "") {
      setSelectedVendorErr("Pleas selecte client Name");
      return false;
    }
    return true;
  }

  function salesmanValedation() {
    if (selectedsalesMan === "") {
      setSelectedsalesManErr("Pleas selecte Selesman Name");
      return false;
    }
    return true;
  }

  // function oppositeAcValidation() {
  //   if (oppositeAccSelected === "") {
  //     setSelectedOppAccErr("Please Select Opposite Account");
  //     return false;
  //   }
  //   return true;
  // }

  function goldRateValidation() {
    if ((!actualGoldRate || goldRateErr) && !isView) {
      if (!actualGoldRate) {
        setGoldRateErr("Enter today's gold rate in master");
      }
      return false;
    }
    return true;
  }

  function goldJrRateValueValidation() {
    if (JrGRate === "") {
      setGRateErr("Enter valid rate");
      return false;
    }
    return true;
  }

  const finalgettingamountCheck = () => {
    const cashValue = caseamunt ? caseamunt : 0;
    const cardValue = cardamount ? cardamount : 0;
    const onlineamt = onlineamount ? onlineamount : 0;
    const cheqvalue = chequeamount ? chequeamount : 0;
    const totalgetAmount = parseFloat(
      parseFloat(cashValue) +
        parseFloat(cardValue) +
        parseFloat(onlineamt) +
        parseFloat(cheqvalue)
    );
    console.log(
      finalAmount === totalgetAmount,
      "finalAmount === totalgetAmount"
    );
    console.log(finalAmount);
    console.log(totalgetAmount);
    if (
      parseFloat(finalAmount).toFixed(2) ===
      parseFloat(totalgetAmount).toFixed(2)
    ) {
      return true;
    } else {
      dispatch(
        Actions.showMessage({
          message: "Payment not match with final receivable amount !",
          variant: "error",
        })
      );
    }
  };

  function barcodevalidation() {
    if (packingSlipData.length === 0 || packingSlipData[0].barcode === "") {
      dispatch(
        Actions.showMessage({
          message: "Scan barcode or Enter any data",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  }

  function barcodeEntryValidation() {
    const oldData = [...packingSlipData];

    const grossNetRegex = /^(?!0\d)\d{1,9}(?:\.\d+)?$/;
    const pcsRegex = /^[1-9]\d{0,8}$/;

    oldData.map((item, i) => {
      console.log(isAnyDataInrOW(item));
      if (isAnyDataInrOW(item)) {
        if (item.barcode === "") {
          item.errors.barcode = "Enter text or barcode";
        } else if (item.category === "") {
          item.errors.category = "Select category";
        } else if (
          item.phy_pcs === "" ||
          pcsRegex.test(item.phy_pcs) === false
        ) {
          item.errors.phy_pcs = "Enter valid pcs";
        } else if (
          item.purity === "" ||
          grossNetRegex.test(item.purity) === false
        ) {
          item.errors.purity = "Enter valid purity";
        } else if (
          item.rate === "" ||
          grossNetRegex.test(item.rate) === false
        ) {
          item.errors.rate = "Enter valid rate";
        } else if (item.gst === "" || grossNetRegex.test(item.gst) === false) {
          item.errors.gst = "Enter valid gst";
        } else if (
          item.laberpergram === "" ||
          grossNetRegex.test(item.laberpergram) === false
        ) {
          item.errors.laberpergram = "Enter valid amount";
        }
      }
    });
    setPackingSlipData(oldData);
    return true;
  }

  const validateEmptyError = () => {
    let arrData = [...packingSlipData];
    let flag = true;
    arrData.map((item) => {
      if (!errorCheck(item.errors)) {
        flag = false;
      }
    });
    return flag;
  };

  const errorCheck = (error) => {
    let valid = true;
    Object.values(error).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  const isAnyDataInrOW = (row) => {
    let valid = false;
    Object.values(row).forEach((val) => val.length > 0 && (valid = true));
    return valid;
  };

  function jrgrossValdation() {
    if (JrGross === undefined || JrGrossErr) {
      setJrGrossErr("Not Validate Gross Weight");
      return false;
    }
    return true;
  }

  function jrNetValdation() {
    if (JrNetWight === undefined || JrNetWightErr) {
      setJrNetWightErr("Enter valid Net Weight");
      return false;
    }
    return true;
  }

  function jrPurityValdation() {
    if (
      JrPurityErr &&
      (parseFloat(JrPurity) < 0.1 || parseFloat(JrPurity) > 100)
    ) {
      setJrPurityErr("Not Validate Purity Between  0.1 to 100");
      return false;
    }
    return true;
  }

  let handlePackingSlipSelect = (packingSlipNum) => {
    let filteredArray = packingSlipApiData.filter(
      (item) => item.barcode_name === packingSlipNum
    );
    if (filteredArray.length > 0) {
      setPackingSlipApiData(filteredArray);
      setPackingSlipErr("");
      setPackingSlipNo(packingSlipNum);
      if (!lotArr.includes(filteredArray[0].lot_detail_id)) {
        setlotArr([...lotArr, filteredArray[0].lot_detail_id]);
        getPackingSlipDetails(filteredArray[0].lot_detail_id);
      } else {
        dispatch(
          Actions.showMessage({
            message: "This barcode alredy added",
            variant: "error",
          })
        );
      }
    } else {
      setPackingSlipNo("");
      setPackingSlipErr("Please Select Proper Barcode");
    }
  };

  const handleChangeDocNum = (value) => {
    if (value) {
      setSelectedScheme(value);
      setSchemeAmount(value.amount);
    } else {
      setSelectedScheme("");
      setSchemeAmount("");
    }
  };

  function getPackingSlipDetails(packingSlipNum) {
    if (selectedOrder) {
      var queryPara = `${packingSlipNum}/${window.localStorage.getItem(
        "SelectedDepartment"
      )}?order_id=${selectedOrder.value}&setRate=${goldRate}`;
    } else {
      var queryPara = `${packingSlipNum}/${window.localStorage.getItem(
        "SelectedDepartment"
      )}/?setRate=${goldRate}`;
    }

    let api = "";
    if (isPasswordTwo == 1) {
      api = `retailerProduct/api/salesWt/wt/barcode/${queryPara}`;
    } else {
      api = `retailerProduct/api/salesDomestic/barcode/${queryPara}`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setPackingSlipApiData([]);
          setPackingSlipNo("");
          setPackingSearch("");
          let temp = response.data.data.LotDetail;
          let lotdetail_id = response.data.data.lot_detail_id;
          // const considerRate = temp.ProductCategory.is_gold_silver === 0 ? goldRate : silverRate

          const oldSlipData = [...packingSlipData];
          const oldTotalData = packingSlipData.length - 1;

          const newTempData = oldSlipData[oldTotalData];
          newTempData.barcode = temp.BarCodeProductSD?.barcode;
          newTempData.category = {
            value: temp.ProductCategory?.id,
            label: temp.ProductCategory?.category_name,
          };
          newTempData.hsn = temp.ProductCategory?.hsn_master?.hsn_number;
          newTempData.phy_pcs = temp.phy_pcs;
          newTempData.gross_wgt = temp.gross_wgt;
          newTempData.net_wgt = temp.net_wgt;
          newTempData.purity = temp.purity;
          newTempData.rate = 0;
          newTempData.total_hallmark_charges = temp.total_hallmark_charges ? temp.total_hallmark_charges : 0;
          newTempData.laberpergram = "";
          newTempData.labor_per = { value: 3, label: "Per Pcs" };
          newTempData.totalLabour = "";
          newTempData.gst = temp.ProductCategory?.hsn_master?.gst;
          newTempData.gstVal = "";
          newTempData.amount = "";
          newTempData.rateCharge = "";
          newTempData.viabarcode = true;
          newTempData.barcode_id = temp.BarCodeProductSD?.barcode_id;
          newTempData.lot_detail_id = lotdetail_id;
          newTempData.salesPrice = parseFloat(temp.sales_price);
          setPackingSlipData(oldSlipData);
          addNewRow();
          calCulateTotalcall(oldSlipData);
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
          api: api,
        });
      });
  }

  const calCulateTotalcall = (arr, addedRoundoff) => {
    const tempTotalLabour = HelperFunc.getTotalOfField(arr, "totalLabour");
    const tempTotalGst = HelperFunc.getTotalOfField(arr, "gstVal");
    const tempTotalAmt = HelperFunc.getTotalOfField(arr, "amount");
    const roundOffValue = addedRoundoff
      ? addedRoundoff
      : roundOff
      ? roundOff
      : 0;
    const tempInvoiceAmt = parseFloat(
      parseFloat(tempTotalLabour) +
        parseFloat(tempTotalGst) +
        parseFloat(roundOffValue)
    );
    setTotalLabor(isNaN(tempTotalLabour) ? 0 : parseFloat(tempTotalLabour));
    setTotalGST(isNaN(tempTotalGst) ? 0 : parseFloat(tempTotalGst));
    setTotalAmount(isNaN(tempTotalAmt) ? 0 : parseFloat(tempTotalAmt));
    setTotalInvoiceAmount(
      isNaN(tempInvoiceAmt) ? 0 : parseFloat(tempInvoiceAmt)
    );
  };

  const handleDocModalClose = () => {
    setDocModal(false);
  };

  function getPackingSlipData(sData) {
    if (selectedOrder) {
      var queryPara = `${selectedDepartment}?order_id=${selectedOrder.value}&barcode=${sData}`;
    } else {
      var queryPara = `${selectedDepartment}?barcode=${sData}`;
    }
    let api = "";
    if (isPasswordTwo == 1) {
      api = `retailerProduct/api/salesWt/wt/search/${queryPara}`;
    } else {
      api = `retailerProduct/api/salesDomestic/search/${queryPara}`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          if (response.data.data.length > 0) {
            setPackingSlipApiData(response.data.data);
          } else {
            setPackingSlipApiData([]);
            dispatch(
              Actions.showMessage({
                message: "Please Insert Proper BarCode No",
              })
            );
          }
        } else {
          setPackingSlipApiData([]);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: api,
        });
      });
  }

  function createFromPackingSlip(resetFlag, toBePrint) {
    setLoading(true);

    const Orders = [];
    packingSlipData.map((x) => {
      if (x.barcode) {
        Orders.push({
          barcode: x.barcode,
          category: x.category.value,
          hsn: x.hsn,
          gross_wgt: x.gross_wgt ? parseFloat(x.gross_wgt) : 0,
          net_wgt: x.net_wgt ? parseFloat(x.net_wgt) : 0,
          purity: parseFloat(x.purity),
          rate: parseFloat(x.rate),
          rate_charge: x.rateCharge ? parseFloat(x.rateCharge) : 0,
          phy_pcs: parseInt(x.phy_pcs),
          total_hallmark_charges: x.total_hallmark_charges
            ? parseFloat(x.total_hallmark_charges)
            : 0,
          laberpergram: parseFloat(x.laberpergram),
          total_labour: parseFloat(x.totalLabour),
          gst: parseFloat(x.gst),
          gst_value: parseFloat(x.gstVal),
          amount: parseFloat(x.amount),
          barcode_id: x.barcode_id ? x.barcode_id : 0,
          lot_detail_id: x.lot_detail_id ? x.lot_detail_id : 0,
          rate_consider: x.rate_consider.value,
          labour_consider: x.labor_consider.value,
          labour_per: x.labor_per.value,
        });
      }
    });

    const body = {
      is_gift_item_entry: 1,
      // opposite_account_id: oppositeAccSelected.value,
      department_id: selectedDepartment,
      client_id: selectedVendor.value,
      client_company_id: 1,
      is_vendor_client: 2,
      tds_tcs_ledger_id: 2,
      purchaseCreateDate: voucherDate,
      setRate: goldRate,
      udhar_amount: udharAmount,
      round_off: roundOff ? roundOff : 0,
      jewellery_narration: jewelNarration,
      account_narration: accNarration,
      is_shipped: 0,
      salesman_id: selectedsalesMan.value,
      advance_amount: JrAdvanceAmount,
      cash: caseamunt === 0 || caseamunt === "" ? 0 : parseFloat(caseamunt),
      card: cardamount === 0 || cardamount === "" ? 0 : parseFloat(cardamount),
      online:
        onlineamount === 0 || onlineamount === ""
          ? 0
          : parseFloat(onlineamount),
      cheque:
        chequeamount === 0 || chequeamount === ""
          ? 0
          : parseFloat(chequeamount),
      Orders: Orders,
      jewelleryReturn: {
        JR_gross_wt: JrGross ? parseFloat(JrGross) : 0,
        JR_net_wt: JrNetWight ? parseFloat(JrNetWight) : 0,
        JR_purity: JrPurity ? parseFloat(JrPurity) : 0,
        JR_fine_rate: JrGRate ? parseFloat(JrGRate) : 0,
      },
      uploadDocIds: docIds,
      amount: parseFloat(subTotal),
      total_labour: parseFloat(totalLabour),
      gst: parseFloat(totalGST),
      totalInvoiceAmount: parseFloat(totalInvoiceAmount),
      finalAmount: parseFloat(finalAmount),
      making_charges_type: makingCharge.type,
      silver_rate: silverRate,
      scheme_id: selectedScheme.value,
    };

    if (selectedOrder) {
      body.order_id = selectedOrder.value;
    }
    console.log(body);

    let api = "";
    if (isPasswordTwo == 1) {
      api = "retailerProduct/api/salesWt/wt/createFromPackingSlip";
    } else {
      api = "retailerProduct/api/salesDomestic/createFromPackingSlip/new";
    }
    axios
      .post(Config.getCommonUrl() + api, body)
      .then(function (response) {
        console.log(response);
        setLoading(false);

        if (response.data.success === true) {
          // setIsCsvErr(false);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          // History.goBack();
          if (resetFlag === true) {
            checkAndReset();
          }
          if (toBePrint === true) {
            handlePrint();
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        setTimeout(() => {
          setIsButtonDisabled(false);
        }, 3000); // Re-enable after 3 seconds (adjust as needed)
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: api,
          body: body,
        });
        setTimeout(() => {
          setIsButtonDisabled(false);
        }, 3000); // Re-enable after 3 seconds (adjust as needed)
      });
  }

  function handlePartyChange(value, e) {
    console.log(value);
    if (value) {
      setSelectedVendor(value);
      setSelectedVendorErr("");
      if (value.__isNew__ === true) {
        setOpenClientModal(true);
      } else {
        getclinetlist(value.value);
      }
      reset(e);
    } else {
      setSelectedVendor("");
      setPhoneNumOne("");
      // setEmail("")
      // setCompanyAddress("")
      // setAdharCad("")
      setPanNo("");
      setGstNo("");
      // setSelectedCountry("")
      // setSelectedState("")
      // setSelectedCity("")
      // setpincode("")
      setSelectedScheme("");
      setSchemeAmount("");
      setUdharAmountData([]);
      reset();
    }
  }

  function handlesalesmanChange(value) {
    setSelectedsalesMan(value);
    setSelectedsalesManErr("");
  }
  const handleNarrationClick = () => {
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        flag: 22,
        id: idToBeView.id,
        metal_narration: jewelNarration,
        account_narration: accNarration,
      };
      //call update Api Here
      UpdateRetailerNarration(body)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            dispatch(
              Actions.showMessage({
                message: response.data.message,
                variant: "success",
              })
            );

            setLoading(false);
          } else {
            setLoading(false);

            dispatch(
              Actions.showMessage({
                message: response.data.message,
                variant: "error",
              })
            );
          }
        })
        .catch((error) => {
          setLoading(false);

          handleError(error, dispatch, {
            api: "retailerProduct/api/voucherentry/voucher/narration",
            body: body,
          });
        });
    }
    setNarrationFlag(!narrationFlag);
  };

  const updateDocumentArray = (id) => {
    let tempDocList = [...documentList];
    const arr = tempDocList.filter((x) => x.id !== id);
    setDocumentList(arr);
  };

  const concateDocument = (newData) => {
    setDocumentList((documentList) => [...documentList, ...newData]);
  };

  const handleInputFocus = (event) => {
    const name = event.target.name;

    if (name === "Cash") {
      if (parseFloat(caseamunt) === 0) {
        setcaseamunt("");
      }
    }

    if (name === "Card") {
      if (parseFloat(cardamount) === 0) {
        setcardamount("");
      }
    }
    if (name === "Online") {
      if (parseFloat(onlineamount) === 0) {
        setonlineamount("");
      }
    }
    if (name === "cheque") {
      if (parseFloat(chequeamount) === 0) {
        setchequeamount("");
      }
    }
  };

  const handleInputBlur = (event) => {
    const name = event.target.name;

    if (name === "Cash") {
      if (caseamunt === "") {
        setcaseamunt(0);
      }
    }
    if (name === "Card") {
      if (cardamount === "") {
        setcardamount(0);
      }
    }
    if (name === "Online") {
      if (onlineamount === "") {
        setonlineamount(0);
      }
    }
    if (name === "cheque") {
      if (chequeamount === "") {
        setchequeamount(0);
      }
    }
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            {!props.viewPopup && (
              <Grid
                container
                alignItems="center"
                style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
              >
                <Grid item xs={5} sm={4} md={4} lg={5} key="1">
                  <FuseAnimate delay={300}>
                    <Typography className="text-18 font-700">
                      {isView
                        ? "View Fixed Sales Invoice "
                        : "Add Fixed Sales Invoice "}
                    </Typography>
                  </FuseAnimate>
                </Grid>

                <Grid
                  item
                  xs={7}
                  sm={8}
                  md={8}
                  lg={7}
                  key="2"
                  style={{ textAlign: "right" }}
                >
                  <Button
                    variant="contained"
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
                </Grid>
              </Grid>
            )}

            {loading && <Loader />}
            <div className="main-div-alll">
              <div
                // className="pb-32 pt-32 pl-16 pr-16  salesdomestic-work-pt"
                className="pb-32 salesdomestic-work-pt"
                // style={{ marginBottom: "10%" }}
              >
                <Grid container spacing={3}>
                  {allowedBackDate && (
                    <Grid
                      item
                      lg={2}
                      md={4}
                      sm={6}
                      xs={12}
                      style={{ padding: 5 }}
                    >
                      <p className="popup-labl p-4 ">Date</p>
                      <TextField
                        // label="Date"
                        type="date"
                        className=""
                        name="voucherDate"
                        value={voucherDate}
                        error={VoucherDtErr.length > 0 ? true : false}
                        helperText={VoucherDtErr}
                        onKeyDown={(e) => e.preventDefault()}
                        onChange={(e) => handleInputChange(e)}
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
                    sm={6}
                    xs={12}
                    style={{ padding: 5 }}
                  >
                    <p className="popup-labl p-4 ">Invoice No.</p>
                    <TextField
                      className=""
                      placeholder="Invoice Number"
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
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4 ">Client Name </p>
                    {console.log(vendorData)}
                    <AsyncCreatable
                      id="view_jewellary_dv"
                      // filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      options={vendorData.map((suggestion) => ({
                        value: suggestion.id,
                        label: suggestion.client_Name,
                        sId: suggestion.state,
                      }))}
                      value={selectedVendor}
                      onChange={handlePartyChange}
                      placeholder="Party Name"
                      cacheOptions
                      defaultOptions
                      isDisabled={isView}
                      isClearable
                    />

                    <span style={{ color: "red" }}>
                      {selectedVendorErr.length > 0 ? selectedVendorErr : ""}
                    </span>
                  </Grid>
                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4 ">Client Mobile</p>
                    <TextField
                      className=""
                      placeholder="client Mobile"
                      name="number"
                      value={phoneNumOne}
                      variant="outlined"
                      required
                      fullWidth
                      disabled
                    />
                  </Grid>

                  {/* <Grid
                    item
                    lg={2}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4 ">Client email </p>
                    <TextField
                      className=""
                      placeholder="client Email"
                      name="email"
                      value={email}
                      variant="outlined"
                      required
                      fullWidth
                      disabled
                    />
                  </Grid> */}

                  {/* <Grid
                    item
                    lg={2}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4 ">Client address </p>
                    <TextField
                      className=""
                      placeholder="client Address"
                      name="companyAddress"
                      value={companyAddress}
                      variant="outlined"
                      maxRows={3}
                      multiline
                      required
                      fullWidth
                      disabled
                    />
                  </Grid> */}

                  {/* <Grid
                    item
                    lg={2}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4 "> Addhar no. </p>
                    <TextField
                      className=""
                      placeholder="Addhar Number"
                      name="adharcard"
                      value={adharcad}
                      variant="outlined"
                      required
                      fullWidth
                      disabled
                    />
                  </Grid> */}

                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4 ">Pan No.</p>
                    <TextField
                      // className=""
                      placeholder="Pan Number"
                      name="panNo"
                      value={panNo}
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
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4 ">GST No.</p>
                    <TextField
                      // className="mb-16"
                      placeholder="Enter gst.no"
                      autoFocus
                      name="gstNo"
                      value={gstNo}
                      variant="outlined"
                      required
                      fullWidth
                      disabled
                    />
                  </Grid>

                  {/* <Grid
                    item
                    lg={2}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4 ">Country</p>
                    <TextField
                      // className="mb-16"
                      placeholder="Country"
                      autoFocus
                      name="Country"
                      value={selectedCountry}
                      variant="outlined"
                      required
                      fullWidth
                      disabled
                    />
                  </Grid> */}

                  {/* <Grid
                    item
                    lg={2}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4 ">State</p>
                    <TextField
                      // className="mb-16"
                      placeholder="state"
                      autoFocus
                      name="state"
                      value={selectedState}
                      variant="outlined"
                      required
                      fullWidth
                      disabled
                    />
                  </Grid> */}

                  {/* <Grid
                    item
                    lg={2}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4 ">City</p>
                    <TextField
                      // className="mb-16"
                      placeholder="City"
                      autoFocus
                      name="City"
                      value={selectedCity}
                      variant="outlined"
                      required
                      fullWidth
                      disabled
                    />
                  </Grid> */}

                  {/* <Grid
                    item
                    lg={2}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4 ">Pincode</p>
                    <TextField
                      // className="mb-16"
                      disabled
                      placeholder="enter pincode"
                      autoFocus
                      name="pincod"
                      value={pincode}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </Grid> */}

                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4">Sales Man </p>
                    <Select
                      id="view_jewellary_dv"
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      options={salesMan.map((suggestion) => ({
                        value: suggestion.id,
                        label: suggestion.name,
                      }))}
                      // components={components}
                      value={selectedsalesMan}
                      onChange={handlesalesmanChange}
                      placeholder="Party Name"
                      isDisabled={isView}
                    />

                    <span style={{ color: "red" }}>
                      {selectedsalesManErr.length > 0
                        ? selectedsalesManErr
                        : ""}
                    </span>
                  </Grid>
                  {/* <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ padding: 5 }}
                  >
                    <p className="popup-labl p-4 ">Opposite account</p>
                    <Select
                      id="view_jewellary_dv"
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      options={oppositeAccData}
                      value={oppositeAccSelected}
                      onChange={handleOppAccChange}
                      placeholder="Opposite Account"
                      isDisabled={isView}
                    />

                    <span style={{ color: "red" }}>
                      {selectedOppAccErr.length > 0 ? selectedOppAccErr : ""}
                    </span>
                  </Grid> */}

                  {/* {!isView && (
                    <Grid
                      item
                      lg={2}
                      md={4}
                      sm={6}
                      xs={12}
                      style={{ padding: 6 }}
                    >
                      <p className="popup-labl p-4">Upload document</p>
                      <TextField
                        className="uploadDoc"
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
                  )} */}

                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4">Today's Gold Rate*</p>{" "}
                    <TextField
                      name="goldRate"
                      value={goldRate}
                      error={goldRateErr.length > 0 ? true : false}
                      helperText={goldRateErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      inputRef={inputRef}
                      autoFocus
                      placeholder="Enter Today's Gold Rate*"
                      disabled={isView}
                    />
                  </Grid>
                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4">Today's Silver Rate</p>{" "}
                    <TextField
                      name="silverRate"
                      value={silverRate}
                      error={silverRateErr.length > 0 ? true : false}
                      helperText={silverRateErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      inputRef={inputRef}
                      autoFocus
                      placeholder="Enter Today's silver Rate*"
                      disabled={isView}
                    />
                  </Grid>
                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4 ">Order </p>
                    <Select
                      id="view_jewellary_dv"
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      name="order"
                      styles={selectStyles}
                      options={orderData.map((suggestion) => ({
                        value: suggestion.id,
                        label: suggestion.order_number,
                      }))}
                      value={selectedOrder}
                      onChange={(e) => handleOChange(e)}
                      placeholder="Order"
                      isClearable
                      isDisabled={isView}
                    />

                    <span style={{ color: "red" }}>
                      {selectedOrderErr.length > 0 ? selectedOrderErr : ""}
                    </span>
                  </Grid>
                  <Grid
                    className="packing-slip-input"
                    item
                    lg={2}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4 ">BarCode No.</p>
                    <Autocomplete
                      id="free-solo-demo"
                      freeSolo
                      disableClearable
                      onChange={(event, newValue) => {
                        console.log(newValue);
                        handlePackingSlipSelect(newValue);
                      }}
                      onInputChange={(event, newInputValue) => {
                        if (event !== null) {
                          if (event.type === "change")
                            // not using this condition because all other data is showing in dropdown
                            setPackingSearch(newInputValue);
                        } else {
                          setPackingSearch("");
                        }
                      }}
                      value={packingSlipNo}
                      options={packingSlipApiData.map(
                        (option) => option.barcode_name
                      )}
                      disabled={isView}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          style={{ padding: 0 }}
                          placeholder="Barcode No"
                        />
                      )}
                    />
                    <span style={{ color: "red" }}>
                      {packingSlipErr.length > 0 ? packingSlipErr : ""}
                    </span>
                  </Grid>
                  {isSchemeRetailer == 1 && (
                    <>
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={6}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p className="popup-labl p-4">Scheme Document No</p>{" "}
                        <Select
                          id="view_jewellary_dv"
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          name="Scheme Document No"
                          styles={selectStyles}
                          options={schemeClientdoc.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.doc_number,
                            amount: suggestion.amount,
                          }))}
                          value={selectedScheme}
                          onChange={(e) => handleChangeDocNum(e)}
                          placeholder="Scheme Document No"
                          isClearable
                          isDisabled={isView}
                        />
                      </Grid>
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={6}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p className="popup-labl p-4">Scheme Amount</p>{" "}
                        <TextField
                          name="schemeAmount"
                          value={schemeAmount}
                          variant="outlined"
                          fullWidth
                          placeholder="Scheme Amount"
                          disabled
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                <Grid container style={{ marginTop: 16 }} spacing={2}>
                  {selectedVendor && udharAmountData.length !== 0 && (
                    <Grid item xs={12} md={6} lg={4}>
                      <Paper className={clsx(classes.tabroot)}>
                        <h3 style={{ paddingBlock: 7, paddingLeft: 7 }}>
                          Client's previous udhaar amount
                        </h3>
                        <Table style={{ tableLayout: "auto" }}>
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
                                Date
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Voucher No.
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{ paddingRight: 20 }}
                                align="right"
                              >
                                Remaining Balance
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {udharAmountData.map((item, index) => {
                              console.log(item);
                              return (
                                <TableRow key={index}>
                                  <TableCell className={classes.tableRowPad}>
                                    {moment(item.created_at).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {item.voucher_no}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    style={{ paddingRight: 20 }}
                                  >
                                    {item.remaining_balance}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                          <TableFooter>
                            <TableRow style={{ background: "#EBEEFB" }}>
                              <TableCell
                                className={classes.tableRowPad}
                                colSpan={2}
                              >
                                <b>Total</b>
                              </TableCell>
                              <TableCell
                                className={clsx(
                                  classes.tableRowPad,
                                  "righttext"
                                )}
                                style={{ paddingRight: 20 }}
                              >
                                <b>
                                  {Config.numWithComma(
                                    HelperFunc.getTotalOfField(
                                      udharAmountData,
                                      "remaining_balance"
                                    )
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </Paper>
                    </Grid>
                  )}
                  {selectedOrder && (
                    <Grid item xs={12} md={6} lg={4}>
                      <Paper className={clsx(classes.tabroot)}>
                        <h3 style={{ paddingBlock: 7, paddingLeft: 7 }}>
                          Advance collection on order
                        </h3>
                        <Table style={{ tableLayout: "auto" }}>
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
                                Fine
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <span className="float-right"> Amount </span>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow key={1}>
                              <TableCell className={classes.tableRowPad}>
                                {advanceData.finegold}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <span className="float-right mr-5">
                                  {" "}
                                  {advanceData.amount}{" "}
                                </span>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Paper>
                    </Grid>
                  )}
                </Grid>

                <Paper
                  style={{
                    overflowY: "auto",
                    overflowX: "visible",
                    marginTop: 19,
                  }}
                  id="jewellery-artician-head"
                >
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        {!isView && (
                          <TableCell className={classes.tableRowPad} width={50}>
                            <div
                              className={clsx(
                                classes.tableheader,
                                "delete_icons_dv"
                              )}
                            ></div>
                          </TableCell>
                        )}
                        <TableCell className={classes.tableRowPad}>
                          Barcode
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Billing Category
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          HSN
                        </TableCell>
                        <TableCell className={classes.tableRowPad} width={70}>
                          Pieces
                        </TableCell>
                        <TableCell className={classes.tableRowPad} width={70}>
                          Purity
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad}>
                          Rate /10gm
                        </TableCell> */}
                        <TableCell className={classes.tableRowPad}>
                          Labour Setting{" "}
                          {!isView && (
                            <span className={classes.tableRowPad}>
                              {makingCharge?.type === "PER"
                                ? `${makingCharge.value} (%)`
                                : makingCharge?.type === "INR"
                                ? `(${makingCharge.value}/gram)`
                                : makingCharge?.type === "PCS"
                                ? `(${makingCharge.value}/pcs)`
                                : ""}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Amount
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          GST (%)
                        </TableCell>
                        <TableCell className={classes.tableRowPad} width={180}>
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {packingSlipData.map((element, index) => (
                        <TableRow key={index}>
                          {!isView && (
                            <TableCell className={classes.tablePad}>
                              <IconButton
                                style={{ padding: "0" }}
                                tabIndex="-1"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  deleteRow(index, element.lot_detail_id);
                                }}
                              >
                                <Icon className="mr-8 delete-icone">
                                  <img src={Icones.delete_red} alt="" />
                                </Icon>
                              </IconButton>
                            </TableCell>
                          )}
                          <TableCell className={classes.tablePad}>
                            <TextField
                              name="barcode"
                              value={element.barcode || ""}
                              onChange={(e) => handleChange(index, e)}
                              error={
                                element.errors && element.errors.barcode
                                  ? true
                                  : false
                              }
                              helperText={
                                element.errors && element.errors.barcode
                                  ? element.errors.barcode
                                  : ""
                              }
                              variant="outlined"
                              fullWidth
                              disabled={element.viabarcode || isView}
                            />
                          </TableCell>
                          <TableCell className={classes.tablePad}>
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
                              options={categoryList.map((suggestion) => ({
                                value: suggestion.id,
                                label: suggestion.category_name,
                                hsn_master: suggestion.hsn_master,
                                is_gold_silver: suggestion.is_gold_silver,
                              }))}
                              value={element.category}
                              onChange={(e) => {
                                handleCatChange(index, e);
                              }}
                              placeholder="Category"
                              isDisabled={element.viabarcode || isView}
                            />
                            <span style={{ color: "red" }}>
                              {element.errors && element.errors.category
                                ? element.errors.category
                                : ""}
                            </span>
                          </TableCell>
                          <TableCell className={classes.tablePad}>
                            <TextField
                              name="hsn"
                              value={element.hsn || ""}
                              onChange={(e) => handleChange(index, e)}
                              error={
                                element.errors && element.errors.hsn
                                  ? true
                                  : false
                              }
                              helperText={
                                element.errors && element.errors.hsn
                                  ? element.errors.hsn
                                  : ""
                              }
                              variant="outlined"
                              fullWidth
                              disabled
                            />
                          </TableCell>
                          <TableCell className={classes.tablePad}>
                            <TextField
                              name="phy_pcs"
                              value={element.phy_pcs || ""}
                              onChange={(e) => handleChange(index, e)}
                              className={"addconsumble-dv"}
                              error={
                                element.errors && element.errors.phy_pcs
                                  ? true
                                  : false
                              }
                              helperText={
                                element.errors && element.errors.phy_pcs
                                  ? element.errors.phy_pcs
                                  : ""
                              }
                              variant="outlined"
                              fullWidth
                              disabled={
                                element.viabarcode ||
                                isView ||
                                element.category === ""
                              }
                            />
                          </TableCell>
                          <TableCell className={classes.tablePad}>
                            <TextField
                              name="purity"
                              value={
                                isView ? element.purity : element.purity || ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              className={"addconsumble-dv"}
                              error={
                                element.errors && element.errors.purity
                                  ? true
                                  : false
                              }
                              helperText={
                                element.errors && element.errors.purity
                                  ? element.errors.purity
                                  : ""
                              }
                              variant="outlined"
                              fullWidth
                              disabled={
                                element.viabarcode ||
                                isView ||
                                element.category === ""
                              }
                            />
                          </TableCell>
                          {/* <TableCell className={classes.tablePad}>
                            <TextField
                              name="rate"
                              value={element.rate || ""}
                              onChange={(e) => handleChange(index, e)}
                              className={"addconsumble-dv"}
                              error={
                                element.errors && element.errors.rate
                                  ? true
                                  : false
                              }
                              helperText={
                                element.errors && element.errors.rate
                                  ? element.errors.rate
                                  : ""
                              }
                              variant="outlined"
                              fullWidth
                              disabled={isView || element.category === ""}
                            />
                          </TableCell> */}
                          <TableCell className={classes.tablePad}>
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
                              //   options={laberPerArr.map((suggestion) => ({
                              //     value: suggestion.value,
                              //     label: suggestion.label,
                              //     isDisabled:
                              //       element?.labor_consider?.value === 3 &&
                              //       suggestion.value !==
                              //         element?.labor_consider?.value
                              //         ? true
                              //         : false ||
                              //           (element?.labor_consider?.value !== 3 &&
                              //             suggestion.value === 3)
                              //         ? true
                              //         : false,
                              //   }))}
                              value={element.labor_per}
                              onChange={(e) => {
                                handleLaborPerChange(index, e);
                              }}
                              isDisabled
                            />
                          </TableCell>
                          <TableCell className={classes.tablePad}>
                            <TextField
                              name="laberpergram"
                              value={
                                isView
                                  ? element.laberpergram
                                  : element.laberpergram || ""
                              }
                              className={"addconsumble-dv"}
                              onChange={(e) => handleChange(index, e)}
                              error={
                                element.errors && element.errors.laberpergram
                                  ? true
                                  : false
                              }
                              helperText={
                                element.errors && element.errors.laberpergram
                                  ? element.errors.laberpergram
                                  : ""
                              }
                              variant="outlined"
                              fullWidth
                              disabled={
                                isView ||
                                element.category === "" ||
                                element.labor_per === ""
                              }
                            />
                          </TableCell>
                          <TableCell className={classes.tablePad}>
                            <TextField
                              name="gst"
                              value={isView ? element.gst : element.gst || ""}
                              className={"addconsumble-dv"}
                              onChange={(e) => handleChange(index, e)}
                              error={
                                element.errors && element.errors.gst
                                  ? true
                                  : false
                              }
                              helperText={
                                element.errors && element.errors.gst
                                  ? element.errors.gst
                                  : ""
                              }
                              variant="outlined"
                              fullWidth
                              disabled={isView || element.category === ""}
                            />
                          </TableCell>
                          <TableCell
                            className={classes.tablePad}
                            style={{ position: "relative" }}
                          >
                            <TextField
                              name="amount"
                              value={
                                element.amount
                                  ? parseFloat(element.amount).toFixed(2)
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              error={
                                element.errors && element.errors.amount
                                  ? true
                                  : false
                              }
                              helperText={
                                element.errors && element.errors.amount
                                  ? element.errors.amount
                                  : ""
                              }
                              variant="outlined"
                              fullWidth
                              disabled
                            />{" "}
                            {element.barcode_id && (
                              <Tooltip
                                title={`Sale Price : ${element.salesPrice}`}
                                arrow
                              >
                                <IconButton
                                  style={{
                                    padding: "0",
                                    width: "auto",
                                    position: "absolute",
                                    right: 5,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                  }}
                                >
                                  <Icon
                                    style={{
                                      color:
                                        element.salesPrice > element.amount
                                          ? "red"
                                          : element.salesPrice < element.amount
                                          ? "green"
                                          : "gray",
                                    }}
                                  >
                                    error
                                  </Icon>
                                </IconButton>
                              </Tooltip>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow className={classes.tableFooter}>
                        {!isView && (
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                        )}
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <b>
                            {HelperFunc.getTotalOfFieldNoDecimal(
                              packingSlipData,
                              "phy_pcs"
                            )}
                          </b>
                        </TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        {/* <TableCell className={classes.tableRowPad}></TableCell> */}
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <b>{parseFloat(TotalAmount).toFixed(2)}</b>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </Paper>
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
                    <label className="mr-2">Amount : </label>
                    <label className="ml-2">
                      {isView
                        ? Config.numWithComma(totalLabour)
                        : parseFloat(totalLabour).toFixed(2)}
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
                      {" "}
                      {isView
                        ? Config.numWithComma(totalGST)
                        : parseFloat(totalGST).toFixed(2)}
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
                    <label
                      className="first-label-total"
                      style={{ width: "34.8%" }}
                    >
                      Discount :
                    </label>
                    <label className="ml-2 input-sub-total">
                      <TextField
                        name="roundOff"
                        className={"ml-2  addconsumble-dv"}
                        disabled={
                          isView || totalLabour === "" || totalLabour === 0
                        }
                        value={roundOff}
                        error={roundOffErr.length > 0 ? true : false}
                        helperText={roundOffErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
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
                      {isView
                        ? Config.numWithComma(totalInvoiceAmount)
                        : parseFloat(totalInvoiceAmount).toFixed(2)}
                    </label>
                  </div>
                </div>
                <div
                  id="jewellery-head"
                  className="mt-16 "
                  style={{
                    border: "1px solid #EBEEFB",
                    background: "#EBEEFB",
                    fontWeight: "700",
                    justifyContent: "center",
                    display: "flex",
                    borderRadius: "7px",
                  }}
                >
                  <div
                    style={{
                      width: "20%",
                      textAlign: "center",
                    }}
                  >
                    <label>Jewellery Return</label>
                  </div>
                </div>
                <Paper style={{ overflow: "auto" }}>
                  <div
                    // className="mt-16"
                    // style={{ border: "1px solid #EBEEFB", paddingBottom: 5 }}
                    // className=""
                    style={{ paddingBottom: 5, minWidth: 650 }}
                  >
                    <div
                      className="table-row-source"
                      style={{
                        background: "#EBEEFB",
                        fontWeight: "700",
                      }}
                    >
                      <div
                        className={clsx(
                          classes.tableheader,
                          "flex justify-center"
                        )}
                      >
                        Gross Weight
                      </div>

                      <div
                        className={clsx(
                          classes.tableheader,
                          "flex justify-center"
                        )}
                      >
                        Net weight
                      </div>
                      <div
                        className={clsx(
                          classes.tableheader,
                          "flex justify-center"
                        )}
                      >
                        karat/Purity
                      </div>

                      <div
                        className={clsx(
                          classes.tableheader,
                          "flex justify-center"
                        )}
                      >
                        Fine
                      </div>
                      <div
                        className={clsx(
                          classes.tableheader,
                          "flex justify-center"
                        )}
                      >
                        Rate/10gm
                      </div>

                      <div
                        className={clsx(
                          classes.tableheader,
                          "flex justify-center"
                        )}
                      >
                        Amount
                      </div>
                    </div>

                    <div className="table-row-source">
                      <TextField
                        // label="(%)"
                        name="JRGroos"
                        className={"ml-2 addconsumble-dv"}
                        value={JrGross}
                        error={JrGrossErr.length > 0 ? true : false}
                        helperText={JrGrossErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                        placeholder="0"
                        disabled={
                          isView ||
                          totalInvoiceAmount == 0 ||
                          totalInvoiceAmount === ""
                        }
                      />

                      <TextField
                        name="JRNet"
                        className={"ml-2 addconsumble-dv"}
                        value={JrNetWight}
                        error={JrNetWightErr.length > 0 ? true : false}
                        helperText={JrNetWightErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                        placeholder="0"
                        disabled={
                          isView ||
                          totalInvoiceAmount == 0 ||
                          totalInvoiceAmount === ""
                        }
                      />
                      <TextField
                        name="JRPurity"
                        className={"ml-2 addconsumble-dv"}
                        value={JrPurity}
                        error={JrPurityErr.length > 0 ? true : false}
                        helperText={JrPurityErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                        placeholder="0"
                        disabled={
                          isView ||
                          totalInvoiceAmount == 0 ||
                          totalInvoiceAmount === ""
                        }
                      />
                      <TextField
                        name="JRFine"
                        className={"ml-2 addconsumble-dv"}
                        value={
                          JrfineGold ? parseFloat(JrfineGold).toFixed(2) : ""
                        }
                        variant="outlined"
                        fullWidth
                        placeholder="0"
                        disabled
                      />
                      <TextField
                        name="JRGoldrate"
                        className={"ml-2 addconsumble-dv"}
                        value={JrGRate || ""}
                        error={JrGRateErr.length > 0 ? true : false}
                        helperText={JrGRateErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                        placeholder="rate"
                        disabled={
                          isView ||
                          totalInvoiceAmount == 0 ||
                          totalInvoiceAmount === ""
                        }
                      />
                      <TextField
                        name="JrAmount"
                        className="ml-2"
                        value={JrAmount ? parseFloat(JrAmount).toFixed(2) : ""}
                        error={JrAmountErr.length > 0 ? true : false}
                        helperText={JrAmountErr}
                        variant="outlined"
                        fullWidth
                        placeholder="Amount"
                        disabled
                      />
                    </div>
                  </div>
                </Paper>

                <div>
                  <div
                    className="table-row-source"
                    style={{
                      background: "#EBEEFB",
                      fontWeight: "700",
                    }}
                  >
                    <div
                      className={clsx(
                        classes.tableheader,
                        "flex justify-end mr-24"
                      )}
                    >
                      Advance Amount
                    </div>
                  </div>
                  <div
                    className="table-row-source"
                    style={{ marginLeft: "auto", maxWidth: "200px" }}
                  >
                    <TextField
                      name="JradvanceAmount"
                      value={JrAdvanceAmount}
                      error={JrAdvanceAmountErr.length > 0 ? true : false}
                      helperText={JrAdvanceAmountErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                      className={"netweight_input_dv ml-2"}
                      placeholder="Advance Amount"
                      disabled={
                        isView ||
                        totalInvoiceAmount == 0 ||
                        totalInvoiceAmount === ""
                      }
                    />
                  </div>
                </div>
                <div>
                  <div
                    className="table-row-source"
                    style={{
                      background: "#EBEEFB",
                      fontWeight: "700",
                    }}
                  >
                    <div
                      className={clsx(
                        classes.tableheader,
                        "flex justify-end mr-24"
                      )}
                    >
                      Udhar Amount
                    </div>
                  </div>
                  <div
                    className="table-row-source"
                    style={{
                      marginLeft: "auto",
                      maxWidth: "200px",
                    }}
                  >
                    <TextField
                      name="udharAmount"
                      value={udharAmount}
                      onChange={(e) => handleInputChange(e)}
                      error={udharAmountErr.length > 0 ? true : false}
                      helperText={udharAmountErr}
                      variant="outlined"
                      fullWidth
                      className={"netweight_input_dv ml-2"}
                      placeholder="Udhar Amount"
                    />
                  </div>
                </div>
                {/* <div
                  id="jewellery-head"
                  className="mt-16 "
                  style={{
                    border: "1px solid #EBEEFB",
                    background: "#EBEEFB",
                    fontWeight: "700",
                    justifyContent: "center",
                    display: "flex",
                    borderRadius: "7px",
                  }}
                >
                  <div
                    style={{
                      width: "20%",
                    }}
                  >
                    <label>Jewellery Return Amount</label>
                  </div>
                </div> */}

                {/* <Grid
                  container
                  className="flex flex-row justify-between mr-20 ml-20 "
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    className="flex flex-col mt-16 "
                  >
                    <div className="flex flex-row">
                      <label className="mr-2 font-700">Total GW: </label>
                      <label className="ml-2 w-192 border-b-4">
                        {JrGross === undefined || JrGross === "" || JrGrossErr
                          ? parseFloat(0).toFixed(3)
                          : (parseFloat(TotaleGrossWight) - parseFloat(JrGross)).toFixed(3)}
                      </label>
                    </div>
                    <div className="flex flex-row mt-16">
                      <label className="mr-2 font-700">Total Net Weight:</label>
                      <label className="ml-2 w-192 border-b-4">
                        {JrNetWight === undefined || JrNetWight === "" || JrNetWightErr
                          ? parseFloat(0).toFixed(3)
                          : (parseFloat(TotalNetWeight) - parseFloat(JrNetWight)).toFixed(3)}
                      </label>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    className="flex flex-col mt-16 "
                  >
                    <div className="flex flex-row mt-16">
                      <label className="mr-2 font-700">
                        Labour :{" "}
                      </label>
                      <label className="ml-2 w-192 border-b-4">
                        {parseFloat(totalLabour).toFixed(3)}
                      </label>
                    </div>

                    <div className="flex flex-row mt-16">
                      <label className="mr-2 font-700">
                        Hallmark :{" "}
                      </label>
                      <label className="ml-2 w-192 border-b-4">
                        {parseFloat(TotalHallMasrk).toFixed(3)}
                      </label>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    className="flex flex-col mt-16 "
                  >
                    <div className="flex flex-row mt-16">
                      <label className="mr-2 font-700">
                        Total Stone weight :{" "}
                      </label>
                      <label className="ml-2 w-192 border-b-4">
                        {parseFloat(JrtotalStoneWight).toFixed(3)}
                      </label>
                    </div>

                    <div className="flex flex-row mt-16">
                      <label className="mr-2 font-700">
                        Total Other Weight :{" "}
                      </label>
                      <label className="ml-2 w-192 border-b-4">
                        {parseFloat(JrtotalotherWight).toFixed(3)}{" "}
                      </label>
                    </div>
                  </Grid>
                </Grid> */}

                <div
                  id="jewellery-head"
                  style={{
                    border: "1px solid #EBEEFB",
                    background: "#EBEEFB",
                    fontWeight: "700",
                    justifyContent: "end",
                    display: "flex",
                    borderRadius: "7px",
                  }}
                >
                  <div>
                    <label>Final Receivable Amount :</label>
                    <label>
                      {" "}
                      {isView
                        ? Config.numWithComma(finalAmount)
                        : parseFloat(finalAmount).toFixed(2)}{" "}
                    </label>
                  </div>
                </div>

                <div
                  id="jewellery-head"
                  className="mt-16 "
                  style={{
                    border: "1px solid #EBEEFB",
                    background: "#EBEEFB",
                    borderRadius: "7px",
                  }}
                >
                  <div className="flex flex-row justify-between ">
                    <h4 className="ml-5 text-center align-middle mt-6">
                      <b>Payment:</b>
                    </h4>
                    <FormControl
                      component="fieldset"
                      className={clsx(
                        classes.formControl,
                        "mr-5 flex flex-row"
                      )}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={0}
                            name="Cash"
                            checked={isCaseChecked}
                            onChange={handleCaseCheckboxChange}
                            disabled={
                              isView ||
                              totalInvoiceAmount == 0 ||
                              totalInvoiceAmount === ""
                            }
                          />
                        }
                        label="Cash"
                      />
                      {isCaseChecked && (
                        <TextField
                          name="Cash"
                          className={"netweight_input_dv mr-12"}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          fullWidth
                          placeholder="Cash Amount"
                          value={caseamunt}
                          error={caseamuntErr.length > 0 ? true : false}
                          helperText={caseamuntErr}
                          disabled={
                            isView ||
                            totalInvoiceAmount == 0 ||
                            totalInvoiceAmount === ""
                          }
                          onFocus={(e) => handleInputFocus(e)}
                          onBlur={(e) => handleInputBlur(e)}
                        />
                      )}
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={1}
                            name="Card"
                            checked={isCardChecked}
                            onChange={handleCardCheckboxChange}
                            // onChange={(e) => handleInputChange(e)}
                            // checked={isAccChecked.placc}
                            disabled={
                              isView ||
                              totalInvoiceAmount == 0 ||
                              totalInvoiceAmount === ""
                            }
                          />
                        }
                        label="Card"
                      />
                      {isCardChecked && (
                        <TextField
                          name="Card"
                          className={"netweight_input_dv ml-2 mr-16"}
                          variant="outlined"
                          onChange={(e) => handleInputChange(e)}
                          value={cardamount}
                          error={cardamountErr.length > 0 ? true : false}
                          helperText={cardamountErr}
                          fullWidth
                          placeholder="Card Amount"
                          disabled={
                            isView ||
                            totalInvoiceAmount == 0 ||
                            totalInvoiceAmount === ""
                          }
                          onFocus={(e) => handleInputFocus(e)}
                          onBlur={(e) => handleInputBlur(e)}
                        />
                      )}
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={0}
                            name="Online"
                            checked={isOnlineChecked}
                            onChange={handleOnlineCheckboxChange}
                            // onChange={(e) => handleInputChange(e)}
                            // checked={isAccChecked.trading}
                          />
                        }
                        label="Online"
                        disabled={
                          isView ||
                          totalInvoiceAmount == 0 ||
                          totalInvoiceAmount === ""
                        }
                      />
                      {isOnlineChecked && (
                        <TextField
                          name="Online"
                          className={"netweight_input_dv mr-16"}
                          variant="outlined"
                          fullWidth
                          onChange={(e) => handleInputChange(e)}
                          placeholder="online Amount"
                          value={onlineamount}
                          error={onlineamountErr.length > 0 ? true : false}
                          helperText={onlineamountErr}
                          disabled={
                            isView ||
                            totalInvoiceAmount == 0 ||
                            totalInvoiceAmount === ""
                          }
                          onFocus={(e) => handleInputFocus(e)}
                          onBlur={(e) => handleInputBlur(e)}
                        />
                      )}
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={1}
                            name="cheque"
                            checked={ischequeChecked}
                            onChange={handlechequeCheckboxChange}
                            // onChange={(e) => handleInputChange(e)}
                            // checked={isAccChecked.placc}
                            disabled={
                              isView ||
                              totalInvoiceAmount == 0 ||
                              totalInvoiceAmount === ""
                            }
                          />
                        }
                        label="Cheque"
                      />
                      {ischequeChecked && (
                        <TextField
                          name="cheque"
                          className={"netweight_input_dv ml-2 mr-16"}
                          variant="outlined"
                          onChange={(e) => handleInputChange(e)}
                          value={chequeamount}
                          error={chequeamountErr.length > 0 ? true : false}
                          helperText={chequeamountErr}
                          fullWidth
                          placeholder="Cheque Amount"
                          disabled={
                            isView ||
                            totalInvoiceAmount == 0 ||
                            totalInvoiceAmount === ""
                          }
                          onFocus={(e) => handleInputFocus(e)}
                          onBlur={(e) => handleInputBlur(e)}
                        />
                      )}
                    </FormControl>
                  </div>
                </div>
                <Grid container style={{ marginTop: "11px" }}>
                  <Grid
                    item
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label className="popup-labl p-4 ">
                      Jewellery Narration
                    </label>
                    <TextField
                      className="mt-1"
                      placeholder="Jewellery Narration"
                      name="jewelNarration"
                      value={jewelNarration}
                      error={jewelNarrationErr.length > 0 ? true : false}
                      helperText={jewelNarrationErr}
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
                    <label className="popup-labl p-4 ">Account Narration</label>
                    <TextField
                      className="mt-1"
                      placeholder="Account Narration"
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
                    {/* <Grid lg={12}
                    md={12}
                    sm={12}
                    xs={12} className="mt-10"> */}
                    {!isView && (
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ float: "right" }}
                        className="w-216 mx-auto mt-16 btn-print-save "
                        aria-label="Register"
                        disabled={isView || finalAmount < 0 || isButtonDisabled}
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
                      className="w-216 mx-auto mt-16 mr-16 btn-print-save"
                      aria-label="Register"
                      // type="submit"
                      disabled={finalAmount < 0}
                      // type="submit"
                      onClick={checkforPrint}
                    >
                      {isView ? "Print" : "Save & Print"}
                    </Button>

                    <div style={{ display: "none" }}>
                      <SalesRetalierPrint
                        ref={componentRef}
                        printObj={printObj}
                      />
                    </div>

                    {isView && (
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ float: "right" }}
                        className="w-224 mx-auto mt-16 mr-16 btn-print-save"
                        aria-label="Register"
                        onClick={() => handleNarrationClick()}
                      >
                        {!narrationFlag ? "Save Narration" : "Update Narration"}
                      </Button>
                    )}
                    {/* </Grid> */}
                  </div>
                )}

                {/* {isView && (
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
                )} */}
              </div>

              <div>
                <Modal
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  open={openClientModal}
                  onClose={(_, reason) => {
                    if (reason !== "backdropClick") {
                      setClientdetail();
                    }
                  }}
                >
                  <div
                    style={modalStyle}
                    className={clsx(classes.paper, "rounded-8")}
                    id="metal-modesize-dv"
                  >
                    <h5 className="popup-head p-5">
                      Add New Client
                      <IconButton
                        style={{ position: "absolute", top: "0", right: "0" }}
                        onClick={() => setClientdetail()}
                      >
                        <Icon style={{ color: "white" }}>close</Icon>
                      </IconButton>
                    </h5>
                    <div className="p-5 pl-16 pr-16 inner-metal-modesize-dv">
                      <AddClientRetailer
                        name={selectedVendor.label}
                        callFrom="Sales-Retailer"
                        setClientdetail={setClientdetail}
                      />
                    </div>
                  </div>
                </Modal>
              </div>

              <ViewDocModelRetailer
                documentList={documentList}
                handleClose={handleDocModalClose}
                open={docModal}
                updateDocument={updateDocumentArray}
                purchase_flag_id={idToBeView?.id}
                purchase_flag="22"
                concateDocument={concateDocument}
                viewPopup={props.viewPopup}
              />
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddFixedSalesRetalier;

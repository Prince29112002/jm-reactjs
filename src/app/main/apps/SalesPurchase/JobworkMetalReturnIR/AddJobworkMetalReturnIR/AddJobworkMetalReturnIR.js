import React, { useState, useEffect, useRef } from "react";
import { DialogActions, Typography } from "@material-ui/core";
import { Button, TextField, Checkbox } from "@material-ui/core";
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
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Modal from "@material-ui/core/Modal";
import Loader from "app/main/Loader/Loader";
import moment from "moment";
import { Icon, IconButton } from "@material-ui/core";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import { AddJobworkMetalReturnIRPrint } from "../PrintComponent/AddJobworkMetalReturnIRPrint";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
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
    width: "100%",
    display: "inline-block",
    // marginLeft: 15,
  },
  tableheader: {
    display: "inline-block",
    textAlign: "center",
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
  hoverClass: {
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#999",
      cursor: "pointer",
    },
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
    borderRadius: "7px",
  };
}

const AddJobworkMetalReturnIR = (props) => {
  const dispatch = useDispatch();

  const [isView, setIsView] = useState(false); //for view Only

  const [formValues, setFormValues] = useState([
    {
      stockCode: "",
      stock_group: "",
      categoryName: "",
      selectedHsn: "",
      grossWeight: "",
      netWeight: "",
      pcs: "",
      availableStock: "",
      setWeight: "",
      purity: "",
      fineGold: "",
      rate: "",
      amount: "",
      errors: {
        stockCode: null,
        categoryName: null,
        selectedHsn: null,
        pcs: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        fineGold: null,
        rate: null,
        amount: null,
      },
    },
    {
      stockCode: "",
      stock_group: "",
      categoryName: "",
      selectedHsn: "",
      grossWeight: "",
      netWeight: "",
      pcs: "",
      availableStock: "",
      setWeight: "",
      purity: "",
      fineGold: "",
      rate: "",
      amount: "",
      errors: {
        stockCode: null,
        categoryName: null,
        selectedHsn: null,
        pcs: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        fineGold: null,
        rate: null,
        amount: null,
      },
    },
    {
      stockCode: "",
      stock_group: "",
      categoryName: "",
      selectedHsn: "",
      grossWeight: "",
      netWeight: "",
      pcs: "",
      availableStock: "",
      setWeight: "",
      purity: "",
      fineGold: "",
      rate: "",
      amount: "",
      errors: {
        stockCode: null,
        categoryName: null,
        selectedHsn: null,
        pcs: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        fineGold: null,
        rate: null,
        amount: null,
      },
    },
    {
      stockCode: "",
      stock_group: "",
      categoryName: "",
      selectedHsn: "",
      grossWeight: "",
      netWeight: "",
      pcs: "",
      availableStock: "",
      setWeight: "",
      purity: "",
      fineGold: "",
      rate: "",
      amount: "",
      errors: {
        stockCode: null,
        categoryName: null,
        selectedHsn: null,
        pcs: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        fineGold: null,
        rate: null,
        amount: null,
      },
    },
  ]);


  const [loading, setLoading] = useState(false);

  const SelectRef = useRef(null)

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [clientdata, setClientdata] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectClientErr, setSelectClientErr] = useState("");

  const [clientCompanies, setClientCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompErr, setSelectedCompErr] = useState("");

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");

  const [stockCodeData, setStockCodeData] = useState([]);

  //below table total val field
  const [amount, setAmount] = useState("");

  const [fineGoldTotal, setFineGoldTotal] = useState("");

  const [totalGrossWeight, setTotalGrossWeight] = useState("");

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [metalNarration, setMetalNarration] = useState("");
  const [metalNarrationErr, setMetalNarrationErr] = useState("");

  const [modalStyle] = useState(getModalStyle);

  const [voucherModalOpen, setvoucherModalOpen] = useState(false);
  const [isVoucherSelected, setIsVoucherSelected] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [selectVoucherErr, setSelectVoucherErr] = useState("");
  const [voucherApiData, setVoucherApiData] = useState([]);
  const [totalNetWeight, setTotalNetWeight] = useState("");
  const [narrationFlag, setNarrationFlag] = useState(false);

  const theme = useTheme();

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
    legderName: "",
    taxAmount: "",
    metNarration: "",
    accNarration: "",
    balancePayable: ""
  })
  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);

  const handleAfterPrint = () => { //React.useCallback
    console.log("`onAfterPrint` called", isView); // tslint:disable-line no-console
    //resetting after print 
    checkAndReset()

  };

  function checkAndReset() {
    // console.log("checkAndReset", isView)

    // console.log("isView", isView)

    if (isView === false) {
      console.log("cond true", isView)
      History.goBack();
      // setVoucherDate(moment().format("YYYY-MM-DD"));
      // setSelectedVendor("");
      // setBalanceRfixData("");
      // setBalRfixViewData([]);
      // setCanEnterVal(false);
      // setOppositeAccSelected("");
      // setPartyVoucherNum("");
      // setFirmName("");
      // setVendorStateId("");
      // setTdsTcsVou("");
      // setLedgerName("");
      // setIs_tds_tcs("");
      // setRateValue("");
      // setLegderAmount("");
      // setFinalAmount("");
      // setAccNarration("");
      // setMetalNarration("");
      // setShortageRfix("");
      // setTempRate("");
      // setAvgeRate("");
      // setTempApiWeight("");
      // setAdjustedRate(false);
      // setPrintObj({
      //   supplierName: "",
      //   supAddress: "",
      //   supplierGstUinNum: "",
      //   supPanNum: "",
      //   supState: "",
      //   supCountry: "",
      //   supStateCode: "",
      //   purcVoucherNum: "",
      //   partyInvNum: "",
      //   voucherDate: moment().format("YYYY-MM-DD"),
      //   placeOfSupply: "",
      //   orderDetails: [],
      //   taxableAmount: "",
      //   sGstTot: "",
      //   cGstTot: "",
      //   iGstTot: "",
      //   roundOff: "",
      //   grossWtTOt: "",
      //   netWtTOt: "",
      //   fineWtTot: "",
      //   totalInvoiceAmt: "",
      //   TDSTCSVoucherNum: "",
      //   legderName: "",
      //   taxAmount: "",
      //   metNarration: "",
      //   accNarration: "",
      //   balancePayable: ""
      // })
      // resetForm();

      // getVoucherNumber();
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
  }, []);//setText

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
        moment(currentDate).format("DD-MM-YYYY h:mm A")
      );
    }
  }
  
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Jobwork_Metal_Return_Voucher_" + getDateAndTime(),
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

  const [searchDatas, setSearchDatas] = useState({
    voucher_no: "",
    gross_weight: "",
    net_weight: "",
    finegold: "",
    utilize: "",
    balance: "",
  });

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setSearchDatas((prevState) => ({
        ...prevState, [name]: value
    }));
  }

  const [documentList, setDocumentList] = useState([])
  const [docModal, setDocModal] = useState(false)
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);

  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 26)
        .then((response) => {
          console.log(response)
          if (response.data.success) {
            const arrData = response.data.data;
            const fileId = []
            arrData.map((item) => {
              fileId.push(item.id)
            })
            setDocIds(fileId)
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
        })
        .catch((error) => {
          console.log(error);
          handleError(error, dispatch, { api: "api/salespurchasedocs/upload", body: docFile })
        })
    }
  }, [docFile])

  const handleDocModalClose = () => {
    console.log("handleDocModalClose")
    setDocModal(false)
  }

  function checkforPrint() {
    if (
      partyNameValidation() &&
      // partyVoucherNumValidation() &&
      voucherSelectedValidation()
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (isView) {
        handlePrint();
      } else {
        if (prevContactIsValid()&&handleDateBlur()) {

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
  }, [onBeforeGetContentResolve.current]);//, text

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000); // 10초 뒤에
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
  }, [])

  if (props.location) {
    var idToBeView = props.location.state;
  } else if (props.voucherId) {
    var idToBeView = { id: props.voucherId }
  }
 
  const pcsInputRef = useRef([])//for pcs in table

  let handleStockGroupChange = (i, e) => {
    console.log(e);
    let newFormValues = [...formValues];
    newFormValues[i].stockCode = {
      value: e.value,
      label: e.label,
      pcs_require: e.pcs_require
    };
    newFormValues[i].errors.stockCode = null;

    let findIndex = stockCodeData.findIndex(
      (item) => item.stock_name_code.id === e.value
    );
    // console.log(findIndex);
    if (findIndex > -1) {
      newFormValues[i].stock_group = stockCodeData[findIndex].stock_group.item_id;
      newFormValues[i].grossWeight = "";
      newFormValues[i].netWeight = "";
      newFormValues[i].rate = "";
      newFormValues[i].pcs = "";
      newFormValues[i].availableStock =  "Wt: " +parseFloat(stockCodeData[findIndex].weight).toFixed(2) + (stockCodeData[findIndex].pcs !== null ?", Pcs :" + stockCodeData[findIndex].pcs : "");
      newFormValues[i].amount = "";
      newFormValues[i].CGSTval = "";
      newFormValues[i].SGSTval = "";
      newFormValues[i].IGSTVal = "";
      newFormValues[i].Total = "";

      // 1- gold 2- silver 3 -bronze
      if (stockCodeData[findIndex].stock_group.item_id === 1) {
        newFormValues[i].purity =
          stockCodeData[findIndex].stock_name_code.purity;
      } else {
        newFormValues[i].purity = "0";
      }

      // if (
      //   newFormValues[i].grossWeight !== "" &&
      //   newFormValues[i].purity !== ""
      // ) {
      //   newFormValues[i].fineGold =
      //     (parseFloat(newFormValues[i].grossWeight) *
      //       parseFloat(newFormValues[i].purity)) /
      //     100;
      // } else {
      //   newFormValues[i].fineGold = "0";
      // }

      newFormValues[i].categoryName = stockCodeData[findIndex].stock_name;
      newFormValues[i].errors.categoryName = null;

      newFormValues[i].selectedHsn =
        stockCodeData[findIndex].hsn_master.hsn_number;
    }

    // console.log("i", i, "length", formValues.length);
    if (i === formValues.length - 1) {
      // addFormFields();
      changeTotal(newFormValues, true);
    } else {
      changeTotal(newFormValues, false);

    }
    // setAdjustedRate(false);
    // if (adjustedRate === true) {
    //   handleRateValChange();
    // }
    pcsInputRef.current[i].focus()
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

    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.grossWeight);
    }
    function netWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.netWeight);
    }

    function fineGold(item) {
      return parseFloat(item.fineGold);
    }
    let tempGrossWtTot = newFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));
    let tempNetWtTot = newFormValues
      .filter((data) => data.netWeight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)

    // setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));


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

    setTotalGrossWeight(
      parseFloat(newFormValues
        .filter((data) => data.grossWeight !== "")
        .map(grossWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)).toFixed(3)
    );

    setPrintObj({
      ...printObj,
      // supplierName: selectedCompany,
      // supAddress: address,
      // supplierGstUinNum: supplierGstUinNumber === null ? "" : supplierGstUinNumber,
      // supPanNum: supPanNumber,
      // supState: supStateName,
      // supCountry: supCountryName,
      // supStateCode: supplierGstUinNumber === null ? "-" : supplierGstUinNumber.substring(0, 2),
      // purcVoucherNum: voucherNumber,
      // stateId: vendorStateId,
      // orderDetails: newFormValues,
      // is_tds_tcs: is_tds_tcs,
      // taxableAmount: parseFloat(tempAmount).toFixed(3),
      // sGstTot: parseFloat(tempSgstVal).toFixed(3),
      // cGstTot: parseFloat(tempCgstVal).toFixed(3),
      // iGstTot: parseFloat(tempIgstVal).toFixed(3),
      // roundOff: roundOff,
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      fineWtTot: parseFloat(tempFineGold).toFixed(3),
      // totalInvoiceAmt: tempTotalInvoiceAmt,
      // taxAmount: tempLedgerAmount,
      // balancePayable: parseFloat(tempfinalAmount).toFixed(3)
    })

    if (addFlag === true) {
      setFormValues([
        ...newFormValues,
        {
          stockCode: "",
          stock_group: "",
          categoryName: "",
          selectedHsn: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          availableStock: "",
          setWeight: "",
          purity: "",
          fineGold: "",
          rate: "",
          amount: "",
          errors: {
            stockCode: null,
            categoryName: null,
            selectedHsn: null,
            pcs: null,
            grossWeight: null,
            netWeight: null,
            purity: null,
            fineGold: null,
            rate: null,
            amount: null,
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
    getClientData();
    // getDepartmentData();
    // getProductCategories();
    console.log("idToBeView", idToBeView);
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true);
      getJobWorkMetalReturnRecord(idToBeView.id);
    } else {
      setNarrationFlag(false);
      getVoucherNumber(); //if view only then no need to get new voucher number, we will set data coming from api
    }
    getStockCodeMetal();
    //eslint-disable-next-line
  }, []);

  function getJobWorkMetalReturnRecord(id) {
    setLoading(true);
    let api = ""
    if(props.forDeletedVoucher){
      api = `api/jobworkmetalreturn/${id}?deleted_at=1`
    }else {
      api = `api/jobworkmetalreturn/${id}`
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              // setApiData(response.data.data[0]);
              let finalData = response.data.data;
              setDocumentList(finalData.salesPurchaseDocs)
              setTimeDate(finalData.created_at);
              setVoucherNumber(finalData.voucher_no);
              setPartyVoucherDate(finalData.party_voucher_date)
              setAllowedBackDate(true);
              setVoucherDate(finalData.purchase_voucher_create_date);
              setSelectedClient({
                value: finalData.Client.id,
                label: finalData.Client.name,
              });

              setSelectedCompany({
                value: finalData.ClientCompany.id,
                label: finalData.ClientCompany.firm_name,
              });

              // setFirmName(finalData.JobWorker.firm_name);

              setPartyVoucherNum(finalData.party_voucher_no);

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
              for (let item of finalData.JobWorkMetalReturnOrder) {
                // console.log(item);
                tempArray.push({

                  stockCode: {
                    value: item.StockNameCode.id,
                    label: item.StockNameCode.stock_code,
                  },
                  categoryName: item.stock_name,
                  selectedHsn: item.StockNameCode.stock_name_code.hsn_master.hsn_number,
                  grossWeight: parseFloat(item.gross_weight).toFixed(3),
                  netWeight: parseFloat(item.net_weight).toFixed(3),
                  pcs: item.pcs,
                  purity: item.purity,
                  fineGold: parseFloat(item.finegold).toFixed(3),
                  rate: parseFloat(item.rate_of_fine_gold).toFixed(3),
                  amount: parseFloat(item.amount).toFixed(3)

                });
              }
              setFormValues(tempArray);

              function amount(item) {
                // console.log(item.amount)
                return item.amount;
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
              function CGSTval(item) {
                return item.cgstVal;
              }
              function SGSTval(item) {
                return item.sGstVal;
              }

              function IGSTVal(item) {
                return item.IGSTVal;
              }
              let tempAmount = tempArray
                .filter((item) => item.amount !== "")
                .map(amount)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              //.reduce(sum);
              // console.log("tempAmount",tempAmount)
              setAmount(parseFloat(tempAmount).toFixed(3));

              setTotalGrossWeight(
                parseFloat(tempArray
                  .filter((data) => data.grossWeight !== "")
                  .map(grossWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3)
              );


              function fineGold(item) {
                return parseFloat(item.fineGold);
              }
              let tempGrossWtTot = parseFloat(
                tempArray
                  .filter((data) => data.grossWeight !== "")
                  .map(grossWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)
              ).toFixed(3)
              console.log(tempGrossWtTot)
              let tempNetWtTot = parseFloat(
                tempArray
                  .filter((data) => data.netWeight !== "")
                  .map(netWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)
              ).toFixed(3)

              let tempFineGold = tempArray
                .filter((item) => item.fineGold !== "")
                .map(fineGold)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
              let tempSgstVal;
              let tempCgstVal;
              let tempIgstVal;
              tempCgstVal = tempArray
                .filter((item) => item.cgstVal !== "")
                .map(CGSTval)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              tempSgstVal = tempArray
                .filter((item) => item.sgstVal !== "")
                .map(SGSTval)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              tempIgstVal = tempArray
                .filter((item) => item.igstVal !== "")
                .map(IGSTVal)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setPrintObj({
                ...printObj,
                // is_tds_tcs: mainObj.is_tds_tcs,
                // stateId: clientVendorState,
                supplierName: finalData.ClientCompany.firm_name,
                supAddress: finalData.ClientCompany.address,
                supplierGstUinNum: finalData.ClientCompany.gst_number === null ? "-" : finalData.ClientCompany.gst_number,
                supPanNum: finalData.ClientCompany.pan_number,
                supState: finalData.ClientCompany.StateName ? finalData.ClientCompany.StateName.name : finalData.state_name.name,
                supCountry: finalData.ClientCompany.CountryName.name ? finalData.ClientCompany.CountryName.name : finalData.ClientCompany.CountryName.name,
                supStateCode: finalData.ClientCompany.gst_number === null ? "-" : finalData.ClientCompany.gst_number.substring(0, 2),
                purcVoucherNum: finalData.voucher_no,
                partyInvNum: finalData.party_voucher_no,
                voucherDate: moment(finalData.purchase_voucher_create_date).format("DD-MM-YYYY"),
                placeOfSupply: finalData.ClientCompany.StateName.name ? finalData.ClientCompany.StateName.name : finalData.ClientCompany.StateName.name,
                orderDetails: tempArray,
                taxableAmount: parseFloat(tempAmount).toFixed(3),
                // sGstTot:  parseFloat(tempSgstVal).toFixed(3),
                // cGstTot:  parseFloat(tempCgstVal).toFixed(3),
                // iGstTot:  parseFloat(tempIgstVal).toFixed(3),
                roundOff: finalData.round_off === null ? "0" : finalData.round_off,
                grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
                netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                fineWtTot: parseFloat(tempFineGold).toFixed(3),
                totalInvoiceAmt: parseFloat(finalData.final_invoice_amount).toFixed(3),
                // TDSTCSVoucherNum: finalData.TdsTcsVoucher !== null ? finalData.TdsTcsVoucher.voucher_no : "",
                // legderName: finalData.TdsTcsVoucher !== null ? finalData.TdsTcsVoucher.voucher_name : "",
                // taxAmount: Math.abs(parseFloat(parseFloat(finalData.final_invoice_amount) - parseFloat(finalData.total_invoice_amount)).toFixed(3)),
                metNarration: finalData.metal_narration !== null ? finalData.metal_narration : "",
                accNarration: finalData.account_narration !== null ? finalData.account_narration : "",
                balancePayable: parseFloat(finalData.final_invoice_amount).toFixed(3),
                signature: finalData.admin_signature,
              })

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

        handleError(error, dispatch, { api: api })

      });
  }

  function getStockCodeMetal() {
    axios
      .get(Config.getCommonUrl() + "api/stockname/metalPurchaseReturn?department_id=" +
      window.localStorage.getItem("SelectedDepartment"))
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockCodeData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/stockname/metalPurchaseReturn?department_id=" +
        window.localStorage.getItem("SelectedDepartment")
       })
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
        handleError(error, dispatch, { api: "api/client/listing/listing" })

      });
  }

  function getVoucherNumber() {
    axios
      .get(Config.getCommonUrl() + "api/jobworkmetalreturn/get/voucher")
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // setProductCategory(response.data.data);
          setVoucherNumber(response.data.data.voucherNo);
          setPrintObj({
            ...printObj,
            purcVoucherNum: response.data.data.voucherNo
          })
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
        handleError(error, dispatch, { api: "api/jobworkmetalreturn/get/voucher" })

      });
  }

  function handlePartyChange(value) {
    setSelectedClient(value);
    setSelectClientErr("");
    setSelectedCompany("");
    setSelectedCompErr("");

    let findIndex = clientdata.findIndex((item) => item.id === value.value);
    //   // console.log(findIndex, i);
    if (findIndex > -1) {
      getClientCompanies(value.value, function (response) {
        console.log(response);
        if (response !== null) {
          setClientCompanies(response);
        } else {
          setClientCompanies([]);
        }
      });
    }

    SelectRef.current.focus()

    // getFixedRateofWeight(value.value);
  }

  function getClientCompanies(clientId, callback) {
    // setClientCompanies

    axios
      .get(Config.getCommonUrl() + `api/client/company/listing/listing/${clientId}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(JSON.stringify(response.data.data));
          var compData = response.data.data;
          callback(compData);
          // setClientCompanies(compData);
        } else {
          callback(null);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        callback(null);

        handleError(error, dispatch, { api: `api/client/company/listing/listing/${clientId}` })

      });
  }

  function handleCompanyChange(value) {
    setSelectedCompany(value);
    setSelectedCompErr("");
    getVouchers(value.value);
    const index = clientCompanies.findIndex((element) => element.id === value.value);
    console.log(clientCompanies[index], "Index");
    setPrintObj({
      ...printObj,
      is_tds_tcs: clientCompanies[index].is_tds_tcs,
      stateId: clientCompanies[index].StateName.id,
      supplierName: clientCompanies[index].company_name,
      supAddress: clientCompanies[index].address,
      supplierGstUinNum: clientCompanies[index].gst_number,
      supPanNum: clientCompanies[index].pan_number,
      supState: clientCompanies[index].StateName.name,
      supCountry: clientCompanies[index].CountryName.name,
      supStateCode: (clientCompanies[index].gst_number) ? clientCompanies[index].gst_number.substring(0, 2) : '',
      // purcVoucherNum: "",
      // partyInvNum: "",
      voucherDate: moment().format("DD-MM-YYYY"),
      placeOfSupply: clientCompanies[index].StateName.name,
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
      legderName: "",
      metNarration: "",
      accNarration: "",
      // balancePayable: totalInvoiceAmount
    })

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
    } else if (name === "partyVoucherNum") {
      setPartyVoucherNum(value);
      setPartyVoucherNumErr("");
      setPrintObj({
        ...printObj,
        partyInvNum: value,

      })
    } else if (name === "voucherDate") {
      setVoucherDate(value);
      setVoucherDtErr("");
      setPrintObj({
        ...printObj,
        voucherDate: moment(value).format("DD-MM-YYYY"),

      })
    } else if (name === "metalNarration") {
      setMetalNarration(value);
      setMetalNarrationErr("");
      setPrintObj({
        ...printObj,
        metNarration: value,
      })
    } else if (name === "accNarration") {
      setAccNarration(value);
      setAccNarrationErr("");
      setPrintObj({
        ...printObj,
        accNarration: value
      })
    }

  }

  function partyNameValidation() {
    if (selectedClient === "") {
      setSelectClientErr("Please Select party");
      return false;
    }
    return true;
  }

  function partyVoucherNumValidation() {
    if (partyVoucherNum === "") {
      setPartyVoucherNumErr("Enter Valid Voucher Number");
      return false;
    }
    return true;
  }

  function voucherSelectedValidation() {
    if (selectedVoucher === 0) {
      setSelectVoucherErr("Please Select Voucher");
      return false;
    }
    return true;
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();

    // console.log(parseInt(gstType));
    console.log("handleFormSubmit", formValues);
    if (
      handleDateBlur()&&
      partyNameValidation() &&
      // partyVoucherNumValidation() &&
      voucherSelectedValidation()
    ) {
      console.log("if");
      if (prevContactIsValid()) {
        addMetalPurchase(true, false);
      } else {
        console.log("prevContactIsValid else");
      }
    } else {
      console.log("else");
    }
  }

  function addMetalPurchase(resetFlag, toBePrint) {
    console.log("fineGoldTotal", fineGoldTotal);

    if (isVoucherSelected === false) {
      setSelectVoucherErr("Please Select Voucher");
      // dispatch(Actions.showMessage({ message: "Please Add remaining rate" }));
      console.log("if");
      return;
    }

    let Orders = formValues
      .filter((element) => element.stockCode !== "")
      .map((x) => {
        return {
          // category_name: x.categoryName,
          stock_name_code_id: x.stockCode.value,
          gross_weight: x.grossWeight,
          rate_of_fine_gold: x.rate,
          pcs: x.pcs,
          // setWeight: 10
        };
      });
    console.log(Orders);
    if (Orders.length === 0) {
      dispatch(Actions.showMessage({ message: "Please Add Entry" }));
      return;
    }
    setLoading(true);
    const body = {
      voucher_no: voucherNumber,
      party_voucher_no: partyVoucherNum,
      // opposite_account_id: 1, //oppositeAccSelected.value,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      client_id: selectedClient.value,
      client_company_id: selectedCompany.value,
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      voucherId: selectedVoucher,
      metal_narration: metalNarration,
      account_narration: accNarration,
      Orders: Orders,
      uploadDocIds: docIds,
      party_voucher_date:partyVoucherDate,
    }
    console.log(body)
    axios
      .post(Config.getCommonUrl() + "api/jobworkmetalreturn", body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id

          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.push("/dashboard/masters/clients");
          // History.goBack();
          // setSelectedClient("");
          // setSelectedCompany("");
          // // setBalanceRfixData("");
          // // setBalRfixViewData("");
          // // setCanEnterVal(false);
          // // setOppositeAccSelected("");
          // setPartyVoucherNum("");
          // //   setSelectedDepartment("");
          // setFirmName("");
          // // setVendorStateId("");
          // //   setTdsTcsVou("");
          // //   setLedgerName("");
          // //   setRateValue("");
          // //   setLegderAmount("");
          // //   setFinalAmount("");
          // setAccNarration("");
          // setMetalNarration("");
          // setVoucherDate(moment().format("YYYY-MM-DD"));
          // // setSelectedWeightStock("");
          // // setPieces("");
          // // setWeight("");
          // // setSelectedIndex(0);
          // // setShortageRfix("");
          // // setTempRate("");
          // // setAvgeRate("");
          // // setTempApiRate("");
          // //   setAdjustedRate(false);

          // resetForm();
          setLoading(false);
          if (resetFlag === true) {
            checkAndReset()
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record 
            handlePrint();
          }
          // getVoucherNumber();
        } else {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);
        handleError(error, dispatch, { api: "api/jobworkmetalreturn", body: body })
      });
  }

  // function resetForm() {
  //   setAmount("");
  //   // setCgstVal("");
  //   // setSgstVal("");
  //   // setIgstVal("");
  //   // setTotal("");
  //   setTotalGrossWeight("");
  //   setFineGoldTotal("");
  //   setIsVoucherSelected(false);
  //   setVoucherApiData([]);
  //   setSelectedVoucher("");

  //   // setRoundOff("");
  //   // setTotalInvoiceAmount("");
  //   // setFinalAmount("");
  //   // setLegderAmount(0);

  //   setFormValues([
  //     {
  //       stockCode: "",
  //       stock_group: "",
  //       categoryName: "",
  //       // categoryData: [],
  //       // HSNdata: [],
  //       selectedHsn: "",
  //       grossWeight: "",
  //       netWeight: "",
  //       pcs: "",
  //       setWeight: "",
  //       purity: "",
  //       fineGold: "",
  //       rate: "",
  //       amount: "",
  //       errors: {
  //         stockCode: null,
  //         categoryName: null,
  //         selectedHsn: null,
  //         pcs: null,
  //         grossWeight: null,
  //         netWeight: null,
  //         purity: null,
  //         fineGold: null,
  //         rate: null,
  //         amount: null,
  //       },
  //     },
  //     {
  //       stockCode: "",
  //       stock_group: "",
  //       categoryName: "",
  //       // categoryData: [],
  //       // HSNdata: [],
  //       selectedHsn: "",
  //       grossWeight: "",
  //       netWeight: "",
  //       pcs: "",
  //       setWeight: "",
  //       purity: "",
  //       fineGold: "",
  //       rate: "",
  //       amount: "",
  //       errors: {
  //         stockCode: null,
  //         categoryName: null,
  //         selectedHsn: null,
  //         pcs: null,
  //         grossWeight: null,
  //         netWeight: null,
  //         purity: null,
  //         fineGold: null,
  //         rate: null,
  //         amount: null,
  //       },
  //     },
  //     {
  //       stockCode: "",
  //       stock_group: "",
  //       categoryName: "",
  //       // categoryData: [],
  //       // HSNdata: [],
  //       selectedHsn: "",
  //       grossWeight: "",
  //       netWeight: "",
  //       pcs: "",
  //       setWeight: "",
  //       purity: "",
  //       fineGold: "",
  //       rate: "",
  //       amount: "",
  //       errors: {
  //         stockCode: null,
  //         categoryName: null,
  //         selectedHsn: null,
  //         pcs: null,
  //         grossWeight: null,
  //         netWeight: null,
  //         purity: null,
  //         fineGold: null,
  //         rate: null,
  //         amount: null,
  //       },
  //     },
  //     {
  //       stockCode: "",
  //       stock_group: "",
  //       categoryName: "",
  //       // categoryData: [],
  //       // HSNdata: [],
  //       selectedHsn: "",
  //       grossWeight: "",
  //       netWeight: "",
  //       pcs: "",
  //       setWeight: "",
  //       purity: "",
  //       fineGold: "",
  //       rate: "",
  //       amount: "",
  //       errors: {
  //         stockCode: null,
  //         categoryName: null,
  //         selectedHsn: null,
  //         pcs: null,
  //         grossWeight: null,
  //         netWeight: null,
  //         purity: null,
  //         fineGold: null,
  //         rate: null,
  //         amount: null,
  //       },
  //     },
  //   ]);
  // }

  function getVouchers(compId) {
    setVoucherApiData([])
    let data = {
      "client_id": selectedClient.value,
      "client_company_id": compId,
      "department_id": window.localStorage.getItem("SelectedDepartment")
    }
    axios
      .post(
        Config.getCommonUrl() +
        "api/jobworkmetalreceive/client/voucher",
        data
        // `api/jobworkmetalreceive/client/${selectedClient.value}/${compId}`
      )
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          let Data = response.data.data;
          let tempArray = [];
          for (let item of Data) {
            // console.log(item);
            tempArray.push({
              id: item.id,
              voucher_no: item.voucher_no,
              party_voucher_no: item.party_voucher_no,
              gross_weight: parseFloat(item.gross_weight).toFixed(3),
              net_weight: parseFloat(item.net_weight).toFixed(3),
              utilize: (
                parseFloat(item.gross_weight) - parseFloat(item.balance)
              ).toFixed(3),
              balance: parseFloat(item.balance).toFixed(3),
              rate: item.rate,
              finegold: parseFloat(item.finegold).toFixed(3),
              amount: (
                parseFloat(item.rate) *
                (parseFloat(item.finegold) - parseFloat(item.balance))
              ).toFixed(3),
            });
          }

          setVoucherApiData(tempArray);
        } else {
          setVoucherApiData([]);

          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        setVoucherApiData([]);
        handleError(error, dispatch, {
          api: "api/jobworkmetalreceive/client/voucher",
          body: data
        })

      });
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
    let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

    const someEmpty = formValues
      .filter((element) => element.stockCode !== "")
      .some((item) => {
        return (
          item.stockCode === "" ||
          item.categoryName === "" ||
          item.grossWeight === "" ||
          item.grossWeight ==0 ||
          item.netWeight === "" ||
          item.netWeight == 0 ||
          item.rate === "" ||item.rate==0 ||
          percentRegex.test(item.rate) === false ||
          (item.stockCode.pcs_require === 1 && (item.pcs === "" || isNaN(item.pcs)))
          // item.pcs === "" || percentRegex.test(item.pcs) === false
          // item.stock_group !== 1 && item.pcs === ""
        );
      });

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
          if (!gWeight || weightRegex.test(gWeight) === false || gWeight==0) {
            allPrev[index].errors.grossWeight = "Enter Gross Weight!";
          } else {
            allPrev[index].errors.grossWeight = null;
          }

          let netWeight = formValues[index].netWeight;
          if (!netWeight || weightRegex.test(netWeight) === false ||netWeight==0) {
            allPrev[index].errors.netWeight = "Enter Net Weight!";
          } else {
            allPrev[index].errors.netWeight = null;
          }

          if (netWeight > gWeight) {
            allPrev[index].errors.netWeight =
              "Net Weight Can not be Greater than Gross Weight";
          } else {
            allPrev[index].errors.netWeight = null;
          }

          let Rate = formValues[index].rate;
          if (!Rate || weightRegex.test(Rate) === false || Rate==0) {
            allPrev[index].errors.rate = "Enter Valid Rate!";
          } else {
            allPrev[index].errors.rate = null;
          }

          // let pcs = formValues[index].pcs;
          // if (pcs === "" || weightRegex.test(pcs) === false) {
          //   // if (formValues[index].stock_group !== 1 && formValues[index].pcs === "") {
          //   allPrev[index].errors.pcs = "Enter Valid Pcs"
          // } else {
          //   allPrev[index].errors.pcs = null;
          // }
          let pcsTotal = formValues[index].pcs;
          console.log("stock", stockCode)
          if (stockCode.pcs_require === 1) {
            if (pcsTotal === "" || pcsTotal === null || pcsTotal === undefined || isNaN(pcsTotal)) {
              allPrev[index].errors.pcs = "Enter Pieces";
            } else {
              allPrev[index].errors.pcs = null;
            }
          }

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
      newFormValues[i].grossWeight = parseFloat(val).toFixed(3)
      newFormValues[i].netWeight = parseFloat(val).toFixed(3)

    } else if (nm === "rate") {
      newFormValues[i].rate = parseFloat(val).toFixed(3)

    }
    setFormValues(newFormValues);
  }

  let handleChange = (i, e) => {
    // console.log("handleChange");
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    newFormValues[i].errors[e.target.name] = null;
    let nm = e.target.name;
    let val = e.target.value;

    //if grossWeight or putity change
    if (nm === "grossWeight") {
      if (
        newFormValues[i].grossWeight !== "" &&
        newFormValues[i].purity !== ""
      ) {
        newFormValues[i].fineGold = parseFloat(
          (parseFloat(newFormValues[i].grossWeight) *
            parseFloat(newFormValues[i].purity)) /
          100
        ).toFixed(3);
      }
      newFormValues[i].netWeight = val;
      newFormValues[i].errors.grossWeight = "";
      newFormValues[i].errors.netWeight = ""
      newFormValues[i].amount = "0";
      if(val==0){
        newFormValues[i].errors.grossWeight = "Enter valid Gross Weight";
        newFormValues[i].errors.netWeight = "Enter valid Net Weight"
      }

      if (val === "" || val == 0) {

        newFormValues[i].fineGold = "0";
        newFormValues[i].netWeight = "";
        setAmount("");
        // setCgstVal("");
        // setSgstVal("");
        // setIgstVal("");
        // setTotal("");
        setTotalGrossWeight("");
        setFineGoldTotal("");
      }


      newFormValues[i].errors.netWeight = "";
      //   setAdjustedRate(false);
      newFormValues[i].rate = 0;
    }

    console.log("rate", newFormValues[i].rate);

    if (newFormValues[i].rate === "") {
      newFormValues[i].amount = ""
    }

    if (newFormValues[i].rate !== "" && newFormValues[i].fineGold !== "") {
      // newFormValues[i].amount = parseFloat(
      //   (parseFloat(newFormValues[i].rate) *
      //   parseFloat(newFormValues[i].fineGold))/10
      // ).toFixed(3);
      if (newFormValues[i].stock_group === 1) {
        newFormValues[i].amount = parseFloat(
          (parseFloat(newFormValues[i].rate) *
            parseFloat(newFormValues[i].fineGold)) /
          10
        ).toFixed(3);
      } else {
        newFormValues[i].amount = parseFloat(
          (parseFloat(newFormValues[i].rate) *
            parseFloat(newFormValues[i].netWeight))
        ).toFixed(3);
      }
    }

    function amount(item) {
      // console.log(item.amount)
      return item.amount;
    }

    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.grossWeight);
    }
    function netWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.netWeight);
    }
    // console.log(formValues.map(amount).reduce(sum))

    let tempAmount = newFormValues
      .filter((item) => item.amount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    //.reduce(sum);
    // console.log("tempAmount",tempAmount)
    setAmount(parseFloat(tempAmount).toFixed(3));

    let tempGrossWtTot = newFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

    // let tempNetWtTot = parseFloat(
    //   tempArray
    //     .filter((data) => data.netWeight !== "")
    //     .map(netWeight)
    //     .reduce(function (a, b) {
    //       // sum all resulting numbers
    //       return parseFloat(a) + parseFloat(b);
    //     }, 0)
    // ).toFixed(3)
    let tempNetWtTot = newFormValues
      .filter((data) => data.netWeight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

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

    setFormValues(newFormValues);
    setPrintObj({
      ...printObj,
      // stateId: vendorStateId,
      orderDetails: newFormValues,
      // is_tds_tcs: is_tds_tcs,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      fineWtTot: parseFloat(tempFineGold).toFixed(3),
      totalInvoiceAmt: parseFloat(tempAmount).toFixed(3),
      balancePayable: parseFloat(tempAmount).toFixed(3)
    })

    // if (adjustedRate === true) {
    // handleRateValChange();
    // }
  };

  function deleteHandler(index) {
    console.log(index)
    let newFormValues = [...formValues];

    newFormValues[index].stockCode = ""
    newFormValues[index].stock_group = "";
    newFormValues[index].categoryName = ""
    newFormValues[index].selectedHsn = ""
    newFormValues[index].grossWeight = ""
    newFormValues[index].netWeight = ""
    newFormValues[index].pcs = ""
    newFormValues[index].availableStock = ""
    newFormValues[index].setWeight = ""
    newFormValues[index].purity = ""
    newFormValues[index].fineGold = ""
    newFormValues[index].rate = ""
    newFormValues[index].amount = ""

    setFormValues(newFormValues);

    function amount(item) {
      // console.log(item.amount)
      return item.amount;
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
    let tempNetWtTot = newFormValues
      .filter((data) => data.netWeight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

    let tempGrossWtTot = newFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

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

    setTotalGrossWeight(
      parseFloat(newFormValues
        .filter((data) => data.grossWeight !== "")
        .map(grossWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)).toFixed(3)
    );

    setPrintObj({
      ...printObj,
      orderDetails: newFormValues,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      fineWtTot: parseFloat(tempFineGold).toFixed(3),
      totalInvoiceAmt: parseFloat(tempAmount).toFixed(3),
      balancePayable: parseFloat(tempAmount).toFixed(3)
    })
  }

  function handleSelectVoucher() {
    setvoucherModalOpen(true);
  }

  function handleVoucherModalClose() {
    // console.log("handle close", callApi);
    setvoucherModalOpen(false);
  }

  function handleVoucherSubmit() {
    if(selectedVoucher){
      setvoucherModalOpen(false);
      setIsVoucherSelected(true);
    }
  }

  // function handleVoucherSelect(id) {
  const handleVoucherSelect = (event) => {
    const RowData = JSON.parse(event.target.value);
    console.log("handleVoucherSelect", RowData.id);
    // console.log("RowData", RowData);

    if (event.target.checked) {
      setSelectedVoucher(RowData.id);
      setSelectVoucherErr("");
    } else {
      setIsVoucherSelected(false);
      setSelectedVoucher("");
      setSelectVoucherErr("Please Select Voucher");
    }

    // setvoucherModalOpen(false);
  }

  const handleNarrationClick = () => {
    console.log("handleNarr", narrationFlag);
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        flag: 26,
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
    let tempDocList = [...documentList]
    const arr = tempDocList.filter(x => x.id !== id);
    setDocumentList(arr)
  }

  const concateDocument = (newData) => {
    // console.log("concateDocument", newData)    
    setDocumentList((documentList) => [...documentList, ...newData]);
  }

  const isDateValid = (inputDate) => {
    const currentDate = moment();
    const minDate = moment().subtract(backEntryDays, 'day').format('YYYY-MM-DD');
    const selectedDate = moment(inputDate, 'YYYY-MM-DD');

    if (selectedDate.isBefore(minDate) || selectedDate.isAfter(currentDate)) {
      return false;
    }
    return true;
  };

  const handleDateBlur = () => {
    if (!isDateValid(voucherDate)) {
      setVoucherDtErr(`Invalid date. Date should be within the last ${backEntryDays} days.`);
      return false;
    } else {
      setVoucherDtErr('');
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
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
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
                        ? "View Jobwork Metal Return"
                        : "Add Jobwork Metal Return"}
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
                  style={{ textAlign: "right", paddingRight: "0px" }}
                >
                  <div className="btn-back">
                    <Button
                      id="btn-back"
                      // variant="contained"
                      className={classes.button}
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
            )}

            {loading && <Loader />}
            <div className="main-div-alll ">
              <div
                className="pb-32 pt-16  jobworkmetal-resturn-form"
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
                    <Grid container spacing={3}>
                      {allowedBackDate && (
                        <Grid
                          item
                          lg={2}
                          md={4}
                          sm={4}
                          xs={12}
                          style={{ padding: 6 }}
                        >
                          <p>Voucher date</p>

                          <TextField
                            // label="Date"
                            type="date"
                            className="mb-16"
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
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p>Voucher number</p>
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
                          placeholder="Enter voucher number"
                        />
                      </Grid>

                      <Grid
                        className="party_input_jobworkir_dv "
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p>Select party</p>
                        <Select
                          id="view_jewellary_dv"
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          options={clientdata
                            // .filter((item) => item.id !== selectedVendor.value)
                            .map((suggestion) => ({
                              value: suggestion.id,
                              label: suggestion.name,
                            }))}
                          // components={components}
                          value={selectedClient}
                          onChange={handlePartyChange}
                          placeholder="Select Party"
                          isDisabled={isView}
                          autoFocus
                          blurInputOnSelect
                          tabSelectsValue={false}
                        />
                        <span style={{ color: "red" }}>
                          {selectClientErr.length > 0 ? selectClientErr : ""}
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
                        <p>Select firm</p>
                        <Select
                          id="view_jewellary_dv"
                          filterOption={createFilter({ ignoreAccents: false })}
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
                          onChange={handleCompanyChange}
                          placeholder="Select Firm"
                          isDisabled={isView}
                          ref={SelectRef}
                          blurInputOnSelect
                          tabSelectsValue={false}
                        />
                        <span style={{ color: "red" }}>
                          {selectedCompErr.length > 0 ? selectedCompErr : ""}
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
                        <p> Party voucher number</p>
                        <TextField
                          className="mb-16"
                          name="partyVoucherNum"
                          value={partyVoucherNum}
                          error={partyVoucherNumErr.length > 0 ? true : false}
                          helperText={partyVoucherNumErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          disabled={isView}
                          placeholder="Enter voucher number"
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
                        <p>Party voucher date</p>
                        <TextField
                          placeholder="Party Voucher Date"
                          type="date"
                          className="mb-16"
                          name="partyVoucherDate"
                          value={partyVoucherDate}
                          onKeyDown={(e) => e.preventDefault()}
                          onChange={(e) => setPartyVoucherDate(e.target.value)}
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
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
                          <p>Upload document</p>

                          <TextField
                            className="mb-16 uploadDoc"
                            placeholder="Upload Document"
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
                        style={{ padding: 6, marginTop: "20PX" }}
                      >
                        <Button 
                        style={{width:"100%"}}
                          // id="button-jewellery"
                          variant="contained"
                          color="primary"
                          className="w-224 mx-auto voucher-btn"
                          aria-label="Register"
                          onClick={handleSelectVoucher}
                          disabled={isView}
                        >
                          Select Voucher
                        </Button>

                        <span style={{ color: "red" }}>
                          {selectVoucherErr.length > 0 ? selectVoucherErr : ""}
                        </span>
                      </Grid>
                      {selectedVoucher > 0 && (
                        <div
                          style={{
                            alignItems: "left",
                            marginTop: "15px",
                            marginBottom: "15px",
                          }}
                        >
                          <h3>Selected Vouchers</h3>
                          <div
                            style={{ alignItems: "left", marginTop: "15px" }}
                          >
                            <Table className={classes.table}>
                              <TableHead>
                                <TableRow>
                                  {/* <TableCell
                          className={classes.tableRowPad}
                          align="center"
                        >
                        </TableCell> */}

                                  <TableCell
                                    className={classes.tableRowPad}
                                    align="center"
                                  >
                                    Voucher num
                                  </TableCell>
                                  {/* <TableCell
                              className={classes.tableRowPad}
                              align="center"
                            >
                              Gross Weight
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="center"
                            >
                              Net Weight
                            </TableCell> */}
                                  <TableCell
                                    className={classes.tableRowPad}
                                    align="center"
                                  >
                                    Fine Gold
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
                                  {/* <TableCell
                              className={classes.tableRowPad}
                              align="center"
                            >
                              Rate
                            </TableCell>

                            <TableCell
                              className={classes.tableRowPad}
                              align="center"
                            >
                              Amount
                            </TableCell> */}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {voucherApiData !== "" &&
                                  voucherApiData
                                    .filter(
                                      (voucherData) =>
                                        selectedVoucher === voucherData.id
                                    )
                                    .map((row, index) => (
                                      <TableRow
                                        key={index}
                                        // onClick={(e) =>
                                        //   handleVoucherSelect(row.id, row.voucher_no)
                                        // }
                                        // className={classes.hoverClass}
                                      >
                                        {/* <TableCell align="center" className={classes.tableRowPad}>
                              <Checkbox name="selectVoucher" value={JSON.stringify({ id: row.id, voucherNum: row.voucher_no })} onChange={handleVoucherSelect} checked={selectedVoucher.includes(row.id) ? true : false} />
                            </TableCell> */}
                                        <TableCell
                                          align="center"
                                          className={classes.tableRowPad}
                                        >
                                          {row.voucher_no}
                                        </TableCell>

                                        {/* <TableCell
                                  align="center"
                                  className={classes.tableRowPad}
                                >
                                  {row.gross_weight}
                                </TableCell>

                                <TableCell
                                  align="center"
                                  className={classes.tableRowPad}
                                >
                                  {row.net_weight}
                                </TableCell> */}

                                        <TableCell
                                          align="center"
                                          className={classes.tableRowPad}
                                        >
                                          {row.finegold}
                                        </TableCell>
                                        <TableCell
                                          align="center"
                                          className={classes.tableRowPad}
                                        >
                                          {row.utilize}
                                        </TableCell>
                                        <TableCell
                                          align="center"
                                          className={classes.tableRowPad}
                                        >
                                          {row.balance}
                                        </TableCell>
                                        {/* <TableCell
                                  align="center"
                                  className={classes.tableRowPad}
                                >
                                  {row.rate}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className={classes.tableRowPad}
                                >
                                  {row.amount}
                                </TableCell> */}
                                      </TableRow>
                                    ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </Grid>

                    <div className="table_full_width  ir-metal-purchase">
                      <div
                        className="table-metal-purchase add-jobworkmetal-ir-dv"
                        style={{
                          border: "1px solid #EBEEFB",
                          paddingBottom: 5,
                          borderRadius: "7px",
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
                              {/* Action */}
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
                            Pieces
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
                            Rate Of Fine Gold
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Amount
                          </div>
                        </div>

                        {formValues.map((element, index) => (
                          <div
                            key={index}
                            className=" castum-row-dv all-purchase-tabs"
                          >
                            {!isView && (
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "delete_icons_dv"
                                )}
                              >
                                <IconButton
                                  tabIndex="-1"
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    deleteHandler(index);
                                  }}
                                >
                                  <Icon className="delete-icone">
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
                                  pcs_require:
                                    suggestion.stock_name_code.stock_description
                                      .pcs_require,
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
                              // label="Gross Weight"
                              name="pcs"
                              className={classes.inputBoxTEST}
                              type={isView ? "text" : "number"}
                              // className=""
                              value={element.pcs || ""}
                              // value={departmentNm}
                              error={
                                element.errors !== undefined
                                  ? element.errors.pcs
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.pcs
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              inputRef={(el) =>
                                (pcsInputRef.current[index] = el)
                              }
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                            />
                            <TextField
                              name="availableStock"
                              className=""
                              value={element.availableStock || ""}
                              // disabled
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
                              // className=""
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
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                            />
                            <TextField
                              // label="Net Weight"
                              name="netWeight"
                              className=""
                              value={element.netWeight || ""}
                              // value={departmentNm}
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
                              disabled
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
                              className={classes.inputBoxTEST}
                              type={isView ? "text" : "number"}
                              // className=""
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
                              onBlur={(e) => handlerBlur(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled={isView}
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
                          </div>
                        ))}

                        <div
                          className="castum-row-dv"
                          style={{ fontWeight: "700", height: "30px" }}
                        >
                          {!isView && (    
                            <div id="castum-width-table" className={clsx(classes.tableheader, " delete_icons_dv")}>
                            {/* action */}
                           </div>
                          )}
                        {/* <div id="castum-width-table" className={classes.tableheader}></div> */}
                        <div className={clsx(classes.tableheader, "castum-width-table")}></div>
                        <div className={clsx(classes.tableheader, "castum-width-table")}></div>
                        <div className={clsx(classes.tableheader, "castum-width-table")}></div>
                        <div className={clsx(classes.tableheader, "castum-width-table")}>
                          {/* pcs */}
                        </div>
                        {/* <div className={clsx(classes.tableheader, "castum-width-table")}></div> */}
                        <div className={clsx(classes.tableheader, "castum-width-table")}></div>
                        <div className={clsx(classes.tableheader, "castum-width-table")}>
                          {totalGrossWeight}
                        </div>
                        <div className={clsx(classes.tableheader, "castum-width-table")}></div>
                        <div className={clsx(classes.tableheader, "castum-width-table")}></div>
                        <div className={clsx(classes.tableheader, "castum-width-table")}>
                          {fineGoldTotal}
                        </div>
                        <div className={clsx(classes.tableheader, "castum-width-table")}></div>
                        <div className={clsx(classes.tableheader, "castum-width-table")}>
                          {isView ? Config.numWithComma(amount) : amount}
                        </div>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="textarea-row mt-16">
                    <div style={{ width: " 100%", marginRight: "20px" }}>
                      <p>Jewellery narration*</p>
                      <TextField
                        // className="mt-16 mr-2"
                        // style={{ width: "50%" }}
                        // label="Metal Narration"
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
                        // disabled={isView}
                        disabled={narrationFlag}
                        placeholder="Enter jewellery narration "
                      />
                    </div>
                    <div style={{ width: " 100%" }}>
                      <p>Account narration*</p>
                      <TextField
                        // className="mt-16 ml-2"
                        // style={{ width: "50%" }}
                        // label="Account Narration"
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
                        // disabled={isView}
                        disabled={narrationFlag}
                        placeholder="Enter account narration"
                      />
                    </div>
                  </div>
                  {!props.viewPopup && 
                    <div>
                      {!isView && (
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ float: "right" }}
                          className="w-224 mx-auto mt-16 btn-print-save"
                          aria-label="Register"
                          disabled={isView}
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
                        style={{ float: "right", backgroundColor: "limegreen" }}
                        className="w-224 mx-auto mt-16 mr-16 btn-print-save"
                        aria-label="Register"
                        //   disabled={!isFormValid()}
                        // type="submit"
                        onClick={checkforPrint}
                      >
                        {isView ? "Print" : "Save & Print"}
                      </Button>
            
                  {isView && 
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
                  }
                  <div style={{ display: "none" }}>
                        <AddJobworkMetalReturnIRPrint
                          ref={componentRef}
                          printObj={printObj}
                          isView={isView} 
                          getDateAndTime={getDateAndTime()} 
                        />
                      </div>
                    </div>
                  }
                  {isView && (
                    <Button
                      variant="contained"
                      className={classes.button}
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
              purchase_flag="26"
              concateDocument={concateDocument}
              viewPopup={props.viewPopup}
            />

            <Modal
              // disableBackdropClick rfModalOpen, setRfModalOpen
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={voucherModalOpen}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleVoucherModalClose();
                }
              }}
            >
              <div
                style={modalStyle}
                className={classes.rateFixPaper}
                id="modesize-dv"
              >
                <h5 className="popup-head p-5">
                  Vouchers
                  <IconButton
                    style={{ position: "absolute", top: "-2px", right: "0" }}
                    onClick={handleVoucherModalClose}
                  >
                    <Icon style={{ color: "white" }}>close</Icon>
                  </IconButton>
                </h5>

                <div
                  className="p-1 pl-16 pr-16"
                  style={{ maxHeight: "330px", overflow: "scroll" }}
                >
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
                          Voucher num
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="center"
                        >
                          Fine Gold
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

                      <TableRow>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}>
                            <TextField name="voucher_no" onChange={handleSearchData} value={searchDatas.voucher_no}/>
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad}>
                            <TextField name="gross_weight" onChange={handleSearchData} value={searchDatas.gross_weight}/>
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                            <TextField name="net_weight" onChange={handleSearchData} value={searchDatas.net_weight}/>
                        </TableCell>   */}
                        <TableCell className={classes.tableRowPad}>
                            <TextField name="finegold" onChange={handleSearchData} value={searchDatas.finegold}/>
                        </TableCell>  
                        <TableCell className={classes.tableRowPad}>
                            <TextField name="utilize" onChange={handleSearchData} value={searchDatas.utilize}/>
                        </TableCell>      
                        <TableCell className={classes.tableRowPad}>
                            <TextField name="balance" onChange={handleSearchData} value={searchDatas.balance}/>
                        </TableCell>  
                      </TableRow>

                    </TableHead>


                    <TableBody>
                      {voucherApiData !== "" &&
                        voucherApiData.filter((temp) => {
                          if(searchDatas.voucher_no){
                           return temp.voucher_no
                            .toLowerCase()
                            .includes(searchDatas.voucher_no.toLowerCase())
                          }
                          // else if(searchDatas.gross_weight){
                          //   return temp.gross_weight
                          //   .toLowerCase()
                          //   .includes(searchDatas.gross_weight.toLowerCase())
                          // }else if(searchDatas.net_weight){
                          //   return temp.net_weight
                          //   .toLowerCase()
                          //   .includes(searchDatas.net_weight.toLowerCase())
                          // }
                          else if(searchDatas.finegold){
                            return temp.finegold
                            .toLowerCase()
                            .includes(searchDatas.finegold.toLowerCase())
                          }else if(searchDatas.utilize){
                            return temp.utilize
                            .toLowerCase()
                            .includes(searchDatas.utilize.toLowerCase())
                          }else if(searchDatas.balance){
                            return temp.balance
                            .toLowerCase()
                            .includes(searchDatas.balance.toLowerCase())
                          }else{
                            return temp
                          }
                        })
                        .map((row, index) => (
                          <TableRow key={index} >
                            <TableCell className={classes.tableRowPad}>
                              <Checkbox
                                type="checkbox"
                                value={JSON.stringify(row)}
                                onChange={handleVoucherSelect}
                                checked={
                                  selectedVoucher == row.id ? true : false
                                }
                              />
                            </TableCell>

                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                            >
                              {row.voucher_no}
                            </TableCell>

                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                            >
                              {row.finegold}
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                            >
                              {row.utilize}
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                            >
                              {row.balance}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>

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
                </div>
                <DialogActions>
                  <Button
                    onClick={(e) => handleVoucherModalClose()}
                    className="delete-dialog-box-cancle-button"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={(e) => handleVoucherSubmit(e)}
                    className="save-button-css"
                  >
                    SAVE
                  </Button>
                </DialogActions>
              </div>
            </Modal>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddJobworkMetalReturnIR;

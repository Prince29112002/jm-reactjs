import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@material-ui/core";
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
import Select, { createFilter } from "react-select";
import Loader from "app/main/Loader/Loader";
import History from "@history";
import moment from "moment";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CategoryWiseList from "../Components/CategoryWiseList";
import TagWiseList from "../Components/TagWiseList";
import { Icon, IconButton } from "@material-ui/core";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import { RepairingRecformCustPrintComp } from "./PrintComponent/RepairingRecformCustPrintComp"
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
import sampleFile from "app/main/SampleFiles/RepRecFromCust/load_excel_file.csv"
import { UpdateNarration } from "../../Helper/UpdateNarration";
import HelperFunc from "../../Helper/HelperFunc";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  form: {
    marginTop: "3%",
    display: "contents",
  },
  selectBox: {
    // marginTop: 8,
    // padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    // borderRadius: 5,
    width: "100%",
    // marginLeft: 15,
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
  normalSelect: {
    // marginTop: 8,
    padding: 6,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    // borderRadius: 5,
    width: "100%",
    // marginLeft: 15,
  },
  tableheader: {
    display: "inline-block",
    textAlign: "center",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
  },
}));

const AddRepairingRecfromCust = (props) => {

  const [isView, setIsView] = useState(false); //for view Only

  const [printObj, setPrintObj] = useState({
    loadType: "",
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
    jewelNarration: "",
    accNarration: "",
    balancePayable: ""
  })

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);

  // const [loading, setLoading] = React.useState(false);
  // const [text, setText] = React.useState("old boring text");



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
      return moment(currentDate).format("DD-MM-YYYY h:mm A");
    }
  }

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Repairing received from customer voucher" + getDateAndTime(),
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
    } //eslint-disable-next-line
  }, []);

  const [documentList, setDocumentList] = useState([])
  const [docModal, setDocModal] = useState(false)
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);

  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 9)
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

      loadValidation() &&
      voucherNumValidation() &&
      clientValidation() &&
      clientCompValidation() &&
      partyVoucherNumValidation() &&
      partyVoucherDateValidation()
    ) {
      console.log("if");
      if (isView) {
        handlePrint();
      } else if(handleDateBlur()){
        if (selectedLoad === "0" || selectedLoad === "1") {
          addRepairingReceivedFromCustomerApi(false, true);
        }
        else if (
          selectedLoad === "2" ||
          selectedLoad === "3" ||
          selectedLoad === "4"
        ) {
          if (prevContactIsValid()) {
            callUserInputApi(false, true);
          }
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


  const hiddenFileInput = React.useRef(null);

  const [modalView, setModalView] = useState(0);
  const loadTypeRef = useRef(null)
  const SelectRef = useRef(null)

  const handleClick = (event) => {
    // if (isVoucherSelected) {
    const regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
    if (!fineRate || regex.test(fineRate) === false) {
      setFineRateErr("Enter Valid Fine Rate");
    } else {
      setFineRateErr("");
      hiddenFileInput.current.click();
    }

  };
  const handlefilechange = (event) => {
    handleFile(event);
    console.log("handlefilechange");
    setUploadErr("");
  };

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // "0" Load Excel with Reference
  // "1" Load Excel File without reference
  // "2" Load Metal Variant
  // "3" Load Findings Variant
  // "4" Load Lot directly

  const [selectedLoad, setSelectedLoad] = useState("");
  const [selectedLoadErr, setSelectedLoadErr] = useState("");

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [clientdata, setClientdata] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectClientErr, setSelectClientErr] = useState("");

  const [clientCompanies, setClientCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompErr, setSelectedCompErr] = useState("");

  const [csvData, setCsvData] = useState("");
  const [isCsvErr, setIsCsvErr] = useState(false);

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");
  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");
  const [partyVoucherDateErr, setpartyVoucherDateErr] = useState("");

  const [vendorStateId, setVendorStateId] = useState("");
  const [address, setAddress] = useState("");
  const [supplierGstUinNumber, setSupplierGstUinNum] = useState("");
  const [supPanNumber, setSupPanNum] = useState("");
  const [supStateName, setSupState] = useState("");
  const [supCountryName, setSupCountry] = useState("");
  const [fineRate, setFineRate] = useState("");
  const [fineRateErr, setFineRateErr] = useState("");

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [jewelNarration, setJewelNarration] = useState("");
  const [jewelNarrationErr, setJewelNarrationErr] = useState("");

  const [totalGrossWeight, setTotalGrossWeight] = useState("");
  const [totalNetWeight, setTotalNetWeight] = useState("");
  const [totalJobWorkFine, setTotalJobWorkFine] = useState("");
  // const [totalAmount, setTotalAmount] = useState("");
  // const [total, setTotal] = useState("");
  const [valuationTotal, setValuationTotal] = useState("");
  // const [fineGoldTotal, setFineGoldTotal] = useState("");

  const [fileSelected, setFileSelected] = useState("");
  const [isUploaded, setIsuploaded] = useState(false);
  const [UploadErr, setUploadErr] = useState("");

  const [stockCodeData, setStockCodeData] = useState([]);

  const [stockCodeFindings, setStockCodeFindings] = useState([]);

  const theme = useTheme();

  const [lotdata, setLotData] = useState([]);

  const [productData, setProductData] = useState([]); //category wise Data
  const [tagWiseData, setTagWiseData] = useState([]); //tag wise Data

  if (props.location) {
    var idToBeView = props.location.state;
  } else if (props.voucherId) {
    var idToBeView = { id: props.voucherId }
  }
  const [narrationFlag, setNarrationFlag] = useState(false)
  const [userFormValues, setUserFormValues] = useState([
    {
      lotno: "",
      stockCode: "",
      billingCategory: "",
      HSNNum: "",
      pieces: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      jobWorkFineinPure: "",
      rate: "",
      valuation: "",
      errors: {
        lotno: null,
        stockCode: null,
        billingCategory: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        jobWorkFineinPure: null,
        rate: null,
        valuation: null,
      },
    },
    {
      lotno: "",
      stockCode: "",
      billingCategory: "",
      HSNNum: "",
      pieces: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      jobWorkFineinPure: "",
      rate: "",
      valuation: "",
      errors: {
        lotno: null,
        stockCode: null,
        billingCategory: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        jobWorkFineinPure: null,
        rate: null,
        valuation: null,
      },
    },
    {
      lotno: "",
      stockCode: "",
      billingCategory: "",
      HSNNum: "",
      pieces: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      jobWorkFineinPure: "",
      rate: "",
      valuation: "",
      errors: {
        lotno: null,
        stockCode: null,
        billingCategory: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        jobWorkFineinPure: null,
        rate: null,
        valuation: null,
      },
    },
    {
      lotno: "",
      stockCode: "",
      billingCategory: "",
      pieces: "",
      HSNNum: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      jobWorkFineinPure: "",
      rate: "",
      valuation: "",
      errors: {
        lotno: null,
        stockCode: null,
        billingCategory: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        jobWorkFineinPure: null,
        rate: null,
        valuation: null,
      },
    },
  ]);

  const pcsInputRef = useRef([])//for pcs in table

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const handleChangeTab = (event, value) => {
    setModalView(value);
  };

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  const classes = useStyles();

  useEffect(() => {
    // getDepartmentData();
    console.log("idToBeView", idToBeView);
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true)
      getRepairRecFromCustRecords(idToBeView.id);
    } else {
      setNarrationFlag(false)
      getVoucherNumber(); //if view only then no need to get new voucher number, we will set data coming from api
      getClientData();
      getStockCodeMetal();
      getStockCodeFindingVariant();
    }
    // getClientData();
    // getStockCodeMetal();
    // getStockCodeFindingVariant();
    // getProductCategories();
    setTimeout(() => {
      if (loadTypeRef.current) {
        console.log("if------------")
        loadTypeRef.current.focus()
      }
    }, 800);
    //eslint-disable-next-line
  }, []);

  function getRepairRecFromCustRecords(id) {
    setLoading(true);
    let api = ""
    if(props.forDeletedVoucher){
      api = `api/repairingReceivedFromCustomer/${id}?deleted_at=1`
    }else {
      api = `api/repairingReceivedFromCustomer/${id}`
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response.data.data);
        setTimeDate(response.data.data.data.created_at);

        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              // setApiData(response.data.data[0]);
              let finalData = response.data.data.data;
              let loadType = response.data.data.otherDetails.loadType;
              setDocumentList(finalData.salesPurchaseDocs)

              setSelectedLoad(loadType.toString())

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
              })

              setPartyVoucherNum(finalData.party_voucher_no);

              setAccNarration(
                finalData.account_narration !== null
                  ? finalData.account_narration
                  : ""
              );
              setJewelNarration(
                finalData.metal_narration !== null
                  ? finalData.metal_narration
                  : ""
              );
              let tempArray = [];

              if (loadType === 0 || loadType === 1) {

                setFineRate(finalData.RepairingReceivedFromCustomerOrder[0].rate)

                let tempTagArray = [];
                let tempCatArray = [];

                for (let item of finalData.RepairingReceivedFromCustomerOrder) {
                  // console.log(item);
                  tempTagArray.push({
                    category_id: item.category_id,
                    barcode_no: item.BarcodeDetails.BarCodeProduct.barcode,
                    billing_category_name: item.Category.billing_category_name,
                    hsn_number: item.Category.hsn_master.hsn_number,
                    pcs: item.pcs.toString(),
                    gross_weight: parseFloat(item.gross_weight).toFixed(3),
                    net_weight: parseFloat(item.net_weight).toFixed(3),
                    purity: item.purity,
                    jobWorkFineinPure: parseFloat(item.finegold).toFixed(3),
                    rate: parseFloat(item.rate).toFixed(3),
                    valuation: parseFloat(item.valuation).toFixed(3),
                  });

                  let fIndex = tempCatArray.findIndex((it) => it.category_id === item.category_id)

                  if (fIndex > -1) {
                    //add
                    tempCatArray[fIndex].pcs = parseFloat(tempCatArray[fIndex].pcs) + parseFloat(item.pcs)

                    tempCatArray[fIndex].gross_weight = parseFloat(parseFloat(tempCatArray[fIndex].gross_weight) + parseFloat(item.gross_weight)).toFixed(3)

                    tempCatArray[fIndex].net_weight = parseFloat(parseFloat(tempCatArray[fIndex].net_weight) + parseFloat(item.net_weight)).toFixed(3)

                    tempCatArray[fIndex].jobWorkFineinPure = parseFloat(parseFloat(tempCatArray[fIndex].jobWorkFineinPure) + parseFloat(item.finegold)).toFixed(3)

                    tempCatArray[fIndex].valuation = parseFloat(parseFloat(tempCatArray[fIndex].valuation) + parseFloat(item.valuation)).toFixed(3);

                  } else {

                    tempCatArray.push({

                      category_id: item.category_id,
                      category_name: item.Category.category_name,
                      billing_category_name: item.Category.billing_category_name,
                      hsn_number: item.Category.hsn_master.hsn_number,
                      pcs: item.pcs.toString(),
                      gross_weight: parseFloat(item.gross_weight).toFixed(3),
                      net_weight: parseFloat(item.net_weight).toFixed(3),
                      purity: item.purity,
                      jobWorkFineinPure: parseFloat(item.finegold).toFixed(3),
                      rate: parseFloat(item.rate).toFixed(3),
                      valuation: parseFloat(item.valuation).toFixed(3),
                    })
                  }
                }

                function grossWeight(item) {
                  return parseFloat(item.gross_weight);
                }

                function netWeight(item) {
                  return parseFloat(item.net_weight);
                }

                function jobWorkFineinPure(item) {
                  return parseFloat(item.jobWorkFineinPure);
                }

                const totaltempjobWork = parseFloat(tempCatArray
                  .filter((data) => data.jobWorkFineinPure !== "")
                  .map(jobWorkFineinPure)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3);
                setTotalGrossWeight(totaltempjobWork);

                const totalGrossWeightVal = parseFloat(tempCatArray
                  .filter((data) => data.gross_weight !== "")
                  .map(grossWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3);
                setTotalGrossWeight(totalGrossWeightVal);

                const totalNetWeightVal = parseFloat(tempCatArray
                  .filter((data) => data.net_weight !== "")
                  .map(netWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3);
                setTotalNetWeight(totalNetWeightVal);

                setProductData(tempCatArray); //category wise Data
                setTagWiseData(tempTagArray);

                setPrintObj({
                  ...printObj,
                  supplierName: finalData.ClientCompany.firm_name,
                  supAddress: finalData.ClientCompany.address,
                  supplierGstUinNum: finalData.ClientCompany.gst_number === null ? "-" : finalData.ClientCompany.gst_number,
                  supPanNum: finalData.ClientCompany.pan_number,
                  supState: finalData.ClientCompany.StateName ? finalData.ClientCompany.StateName.name : finalData.ClientCompany.state_name.name,
                  supCountry: finalData.ClientCompany.country_name ? finalData.ClientCompany.country_name.name : finalData.ClientCompany.CountryName.name,
                  supStateCode: finalData.ClientCompany.gst_number === null ? "-" : finalData.ClientCompany.gst_number.substring(0, 2),
                  purcVoucherNum: finalData.voucher_no,
                  partyInvNum: finalData.party_voucher_no,
                  voucherDate: moment(finalData.purchase_voucher_create_date).format("DD-MM-YYYY"),
                  loadType: loadType.toString(),
                  placeOfSupply: finalData.ClientCompany.StateName ? finalData.ClientCompany.StateName.name : finalData.ClientCompany.state_name.name,
                  orderDetails: tempCatArray,
                  roundOff: finalData.round_off === null ? "0" : finalData.round_off,
                  grossWtTOt: totalGrossWeightVal,
                  netWtTOt: totalNetWeightVal,
                  jobWorkFineinPureTot: totaltempjobWork,
                  totalInvoiceAmt: parseFloat(finalData.total_valution).toFixed(3),
                  balancePayable: parseFloat(finalData.total_valution).toFixed(3),
                  jewelNarration: finalData.metNarration !== null ? finalData.metNarration : "",
                  accNarration: finalData.accNarration !== null ? finalData.accNarration : "",
                  signature: finalData.admin_signature,
                })

              } else if (loadType === 2) {

                for (let item of finalData.RepairingReceivedFromCustomerOrder) {
                  // console.log(item);
                  tempArray.push({
                    // lotno: "",
                    stockCode: {
                      value: item.StockNameCode.id,
                      label: item.StockNameCode.stock_code,
                    },
                    billingCategory: item.StockNameCode.stock_name_code.billing_name,
                    HSNNum: item.StockNameCode.stock_name_code.hsn_master.hsn_number,
                    pieces: item.pcs.toString(),
                    grossWeight: parseFloat(item.gross_weight).toFixed(3),
                    netWeight: parseFloat(item.net_weight).toFixed(3),
                    purity: item.purity,
                    jobWorkFineinPure: parseFloat(item.finegold).toFixed(3),
                    rate: parseFloat(item.rate).toFixed(3),
                    valuation: parseFloat(item.valuation).toFixed(3),
                  });
                }
              } else if (loadType === 3) {

                for (let item of finalData.RepairingReceivedFromCustomerOrder) {
                  // console.log(item);
                  tempArray.push({
                    // lotno: "",
                    stockCode: {
                      value: item.StockNameCode.id,
                      label: item.StockNameCode.stock_code,
                    },
                    billingCategory: item.StockNameCode.stock_name_code.billing_name,
                    HSNNum: item.StockNameCode.stock_name_code.hsn_master.hsn_number,
                    pieces: item.pcs.toString(),
                    grossWeight: parseFloat(item.gross_weight).toFixed(3),
                    netWeight: parseFloat(item.net_weight).toFixed(3),
                    purity: item.purity,
                    jobWorkFineinPure: parseFloat(item.finegold).toFixed(3),
                    rate: parseFloat(item.rate).toFixed(3),
                    valuation: parseFloat(item.valuation).toFixed(3),
                  });
                }

              } else if (loadType === 4) {
                for (let item of finalData.RepairingReceivedFromCustomerOrder) {
                  // console.log(item);
                  tempArray.push({

                    lotno: {
                      value: item.Lot.id,
                      label: item.Lot.number
                    },
                    // stockCode: "",
                    billingCategory: item.Category.billing_category_name,
                    HSNNum: item.Category.hsn_master.hsn_number,
                    pieces: item.pcs.toString(),
                    grossWeight: parseFloat(item.gross_weight).toFixed(3),
                    netWeight: parseFloat(item.net_weight).toFixed(3),
                    purity: item.purity,
                    jobWorkFineinPure: parseFloat(item.finegold).toFixed(3),
                    rate: parseFloat(item.rate).toFixed(3),
                    valuation: parseFloat(item.valuation).toFixed(3),

                  });
                }
              }

              if (loadType === 2 || loadType === 3 || loadType === 4) {
                setUserFormValues(tempArray)

                function valuation(item) {
                  return item.valuation;
                }
                let tempTotal = tempArray
                  .filter((item) => item.valuation !== "")
                  .map(valuation)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setValuationTotal(parseFloat(tempTotal).toFixed(3));

                function grossWeight(item) {
                  // console.log(parseFloat(item.grossWeight));
                  return parseFloat(item.grossWeight);
                }

                function netWeight(item) {
                  return parseFloat(item.netWeight);
                }

                let tempNetWeight = tempArray
                  .filter((data) => data.netWeight !== "")
                  .map(netWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setTotalNetWeight(parseFloat(tempNetWeight).toFixed(3));

                function jobWorkFineinPure(item) {
                  return parseFloat(item.jobWorkFineinPure);
                }

                let tempjobWork = tempArray
                  .filter((data) => data.jobWorkFineinPure !== "")
                  .map(jobWorkFineinPure)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setTotalJobWorkFine(parseFloat(tempjobWork).toFixed(3));
                const totaltempjobWork = parseFloat(tempArray
                  .filter((data) => data.jobWorkFineinPure !== "")
                  .map(jobWorkFineinPure)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3);
                setTotalGrossWeight(totaltempjobWork);
                const totalGrossWeightVal = parseFloat(tempArray
                  .filter((data) => data.grossWeight !== "")
                  .map(grossWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3);
                setTotalGrossWeight(totalGrossWeightVal);
                const totalNetWeightVal = parseFloat(tempArray
                  .filter((data) => data.netWeight !== "")
                  .map(netWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3);
                setTotalNetWeight(totalNetWeightVal);
                console.log(finalData, "FINALDATA")
                setPrintObj({
                  ...printObj,
                  supplierName: finalData.ClientCompany.firm_name,
                  supAddress: finalData.ClientCompany.address,
                  supplierGstUinNum: finalData.ClientCompany.gst_number === null ? "-" : finalData.ClientCompany.gst_number,
                  supPanNum: finalData.ClientCompany.pan_number,
                  supState: finalData.ClientCompany.StateName ? finalData.ClientCompany.StateName.name : finalData.ClientCompany.state_name.name,
                  supCountry: finalData.ClientCompany.CountryName.name ? finalData.ClientCompany.CountryName.name : finalData.ClientCompany.CountryName.name,
                  supStateCode: finalData.ClientCompany.gst_number === null ? "-" : finalData.ClientCompany.gst_number.substring(0, 2),
                  purcVoucherNum: finalData.voucher_no,
                  partyInvNum: finalData.party_voucher_no,
                  placeOfSupply: finalData.ClientCompany.StateName ? finalData.ClientCompany.StateName.name : finalData.ClientCompany.state_name.name,
                  orderDetails: tempArray,
                  voucherDate: moment(finalData.purchase_voucher_create_date).format("DD-MM-YYYY"),
                  loadType: loadType.toString(),
                  roundOff: finalData.round_off === null ? "0" : finalData.round_off,
                  grossWtTOt: totalGrossWeightVal,
                  netWtTOt: totalNetWeightVal,
                  jobWorkFineinPureTot: totaltempjobWork,
                  totalInvoiceAmt: parseFloat(finalData.total_valution).toFixed(3),
                  balancePayable: parseFloat(finalData.total_valution).toFixed(3),
                  jewelNarration: finalData.metal_narration !== null ? finalData.metal_narration : "",
                  accNarration: finalData.account_narration !== null ? finalData.account_narration : "",
                  signature: finalData.admin_signature,

                })
                // setAdjustedRate(true)
              }
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

  function getStockCodeFindingVariant() {
    axios
      .get(Config.getCommonUrl() + "api/stockname/findingvariant")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockCodeFindings(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/stockname/findingvariant" })

      });
  }

  function getLotData(compId) {
    let data = {
      "client_company_id": compId,
      "is_vendor_client": 2//client
    }
    axios
      .post(
        Config.getCommonUrl() +
        "api/salesDomestic/lot/list",
        data
        // "api/lot/department/" +
        // window.localStorage.getItem("SelectedDepartment")
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setLotData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/salesDomestic/lot/list", body: data })

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
      .get(
        Config.getCommonUrl() + "api/repairingReceivedFromCustomer/get/voucher"
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
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
        handleError(error, dispatch, { api: "api/repairingReceivedFromCustomer/get/voucher" })

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
        handleError(error, dispatch, { api: "api/stockname/metal" })

      });
  }

  function handleFile(e) {
    e.preventDefault();
    console.log("handleFile");
    var files = e.target.files,
      f = files[0];
    uploadfileapicall(f);
    setFileSelected(f);
    // var reader = new FileReader();
    // reader.onload = function (e) {
    //   var data = e.target.result;
    //   let readedData = XLSX.read(data, { type: "binary" });
    //   const wsname = readedData.SheetNames[0];
    //   const ws = readedData.Sheets[wsname];

    //   //convert to json objects
    //   const dataParse = XLSX.utils.sheet_to_json(ws);
    //   console.log(dataParse);

    //   /* Convert array to json*/
    //   // const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
    //   // console.log(dataParse);

    //   // dataParse.splice(0, 1); //removing headers

    //   uploadfileapicall(f);
    //   setFileSelected(f);

    // };
    // reader.readAsBinaryString(f);
  }

  function uploadfileapicall(f) {
    const formData = new FormData();
    formData.append("file", f);
    formData.append("flag", selectedLoad);
    setLoading(true);
    axios
      .post(
        Config.getCommonUrl() + "api/lotDetail/read/BarocodeDetails",
        formData
      )
      .then(function (response) {
        console.log(response);
        console.log(formData, "formData");


        if (response.data.success === true) {
          // console.log(response);

          setIsCsvErr(false);

          let OrdersData = response.data.data.finalrecord;
          let categoryData = response.data.data.categoryData;

          let tempArray = [];
          let tempCatArray = [];

          for (let item of OrdersData) {
            // console.log(item);
            tempArray.push({
              ...item,
              jobWorkFineinPure: parseFloat(
                (parseFloat(item.net_weight) * parseFloat(item.purity)) / 100
              ).toFixed(3),
              rate: parseFloat(fineRate).toFixed(3),
              valuation: parseFloat(
                (parseFloat(fineRate) * parseFloat(item.net_weight)) / 10
              ).toFixed(3),
            });
          }

          for (let item of categoryData) {
            // console.log(item);
            tempCatArray.push({
              ...item,
              jobWorkFineinPure: parseFloat(
                (parseFloat(item.net_weight) * parseFloat(item.purity)) / 100
              ).toFixed(3),
              rate: parseFloat(fineRate).toFixed(3),
              valuation: parseFloat(
                (parseFloat(fineRate) * parseFloat(item.net_weight)) / 10
              ).toFixed(3),
            });
          }

          setProductData(tempCatArray); //category wise Data
          setTagWiseData(tempArray);

          function grossWeight(item) {
            return parseFloat(item.gross_weight);
          }

          let tempGrossWeight = tempCatArray
            .filter((data) => data.gross_weight !== "")
            .map(grossWeight)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setTotalGrossWeight(parseFloat(tempGrossWeight).toFixed(3));

          function jobWorkFineinPure(item) {
            return parseFloat(item.jobWorkFineinPure);
          }

          let tempjobWork = tempCatArray
            .filter((data) => data.jobWorkFineinPure !== "")
            .map(jobWorkFineinPure)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setTotalJobWorkFine(parseFloat(tempjobWork).toFixed(3));

          function netWeight(item) {
            return parseFloat(item.net_weight);
          }

          let tempNetWeight = tempCatArray
            .filter((data) => data.net_weight !== "")
            .map(netWeight)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setTotalNetWeight(parseFloat(tempNetWeight).toFixed(3));

          function valuation(item) {
            return item.valuation;
          }
          let tempTotal = tempCatArray
            .filter((data) => data.valuation !== "")
            .map(valuation)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setValuationTotal(parseFloat(tempTotal).toFixed(3));

          setIsuploaded(true);
          setLoading(false);
          setPrintObj({
            ...printObj,
            orderDetails: tempCatArray,
            grossWtTOt: parseFloat(tempGrossWeight).toFixed(3),
            netWtTOt: parseFloat(tempNetWeight).toFixed(3),
            jobWorkFineinPureTot: parseFloat(tempjobWork).toFixed(3),
            totalInvoiceAmt: parseFloat(tempTotal).toFixed(3)
          })
        } else {
          if (response.data.csverror === 1) {
            console.log("csverror");
            if (response.data.hasOwnProperty("url")) {
              // console.log("found url", response.data.url);
              let downloadUrl = response.data.url;
              // window.open(downloadUrl);
              setCsvData(downloadUrl)
              // const link = document.createElement("a");
              // link.href = downloadUrl;
              // link.click();
            }
            // setCsvData(response.data.data);
            setIsCsvErr(true);
          }
          document.getElementById('fileinput').value='';
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
        }

      })
      .catch((error) => {
        setLoading(false);
        document.getElementById("fileinput").value = "";
        handleError(error, dispatch, {
          api: "api/lotDetail/read/BarocodeDetails",
          body: JSON.stringify(formData)
        })

      });
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "voucherNumber") {
      setVoucherNumber(value);
      setVoucherNumErr("");
    } else if (name === "voucherDate") {
      setVoucherDate(value);
      setVoucherDtErr("");
      setPrintObj({
        ...printObj,
        voucherDate: moment(value).format("DD-MM-YYYY"),

      })
    } else if (name === "partyVoucherNum") {
      setPartyVoucherNum(value);
      setPartyVoucherNumErr("");
      setPrintObj({
        ...printObj,
        partyInvNum: value,

      })
    } else if (name === "partyVoucherDate") {
      setPartyVoucherDate(value);
      setpartyVoucherDateErr("");
    } else if (name === "jewelNarration") {
      setJewelNarration(value);
      setJewelNarrationErr("");
      setPrintObj({
        ...printObj,
        jewelNarration: value,
      })
    } else if (name === "accNarration") {
      setAccNarration(value);
      setAccNarrationErr("");
      setPrintObj({
        ...printObj,
        accNarration: value
      })
    } else if (name === "fineRate") {
      setFineRate(value);

      const regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
      if (!value || regex.test(value) === false) {
        setFineRateErr("Enter Valid Fine Rate");
        if (selectedLoad === "0" || selectedLoad === "1") {
          changeCalculationPackingSlip(0)
        }
      } else {
        setFineRateErr("");
        if (selectedLoad === "0" || selectedLoad === "1") {
          changeCalculationPackingSlip(value)
        }
      }
    }
  }

  const changeCalculationPackingSlip = (fineRateLoc) => {
    const newTempProductData = productData.map((item) => {
      return {
        ...item,
        rate: parseFloat(fineRateLoc).toFixed(3),
        valuation: parseFloat(
          (parseFloat(fineRateLoc) *
            parseFloat(item.net_weight)) /
          10
        ).toFixed(3)
      };
    });

    setProductData(newTempProductData)

    const tempTagWise = tagWiseData.map((item) => {
      return {
        ...item,
        rate: parseFloat(fineRateLoc).toFixed(3),
        valuation: parseFloat(
          (parseFloat(fineRateLoc) *
            parseFloat(item.net_weight)) /
          10
        ).toFixed(3)
      };
    });

    setTagWiseData(tempTagWise);

    function valuation(item) {
      return item.valuation;
    }
    let tempTotal = newTempProductData
      .filter((item) => item.valuation !== "")
      .map(valuation)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setValuationTotal(parseFloat(tempTotal).toFixed(3));

    function grossWeight(item) {
      return parseFloat(item.gross_weight);
    }
    function netWeight(item) {
      return parseFloat(item.net_weight);
    }
    function jobWorkFineinPure(item) {
      return parseFloat(item.jobWorkFineinPure);
    }

    let tempjobWork = newTempProductData
      .filter((data) => data.jobWorkFineinPure !== "")
      .map(jobWorkFineinPure)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    let totalGrossWeightVal = parseFloat(newTempProductData
      .filter((item) => item.gross_weight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);
    setTotalGrossWeight(totalGrossWeightVal);

    let totalNetWeightVal = parseFloat(newTempProductData
      .filter((item) => item.net_weight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);
    setTotalNetWeight(totalNetWeightVal);

    setPrintObj({
      ...printObj,
      orderDetails: newTempProductData,
      grossWtTOt: totalGrossWeightVal,
      netWtTOt: totalNetWeightVal,
      jobWorkFineinPure: parseFloat(tempjobWork).toFixed(3),
      totalValution: parseFloat(tempTotal).toFixed(3),
      balancePayable: parseFloat(tempTotal).toFixed(3)
    })
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

  function loadValidation() {
    if (selectedLoad === "") {
      setSelectedLoadErr("Please Select Any Option");
      return false;
    }
    return true;
  }

  function clientValidation() {
    if (selectedClient === "") {
      setSelectClientErr("Please Select party");
      return false;
    }
    return true;
  }

  function clientCompValidation() {
    if (selectedCompany === "") {
      setSelectedCompErr("Please Select Firm");
      return false;
    }
    return true;
  }

  const isEnabled =
    selectedLoad !== "" &&
    selectedClient !== "" &&
    selectedCompany !== "" &&
    partyVoucherNum !== "";

  function handleFormSubmit(ev) {
    ev.preventDefault();
    // resetForm();
    // console.log("handleFormSubmit", formValues);
    if (
      loadValidation() &&
      handleDateBlur()&&
      voucherNumValidation() &&
      clientValidation() &&
      clientCompValidation() &&
      partyVoucherNumValidation() &&
      partyVoucherDateValidation()
    ) {
      console.log("if");
      // addJewellaryPuchaseApi();
      if (selectedLoad === "0" || selectedLoad === "1") {
        addRepairingReceivedFromCustomerApi(true, false);
      } else if (
        selectedLoad === "2" ||
        selectedLoad === "3" ||
        selectedLoad === "4"
      ) {
        if (prevContactIsValid()) {
          callUserInputApi(true, false);
        }
      }
    } else {
      console.log("else");
    }
  }

  function addRepairingReceivedFromCustomerApi(resetFlag, toBePrint) {
    if (isUploaded === false) {
      setUploadErr("Please Upload File");
      return;
    }

    let Orders = tagWiseData.map((x) => {
      return {
        lot_detail_id: x.lotdetail_id,
        rate: x.rate,
      };
    });

    if (Orders.length === 0) {
      dispatch(Actions.showMessage({ message: "Please Add Entry" }));
      return;
    }
    setLoading(true);

    const body = {
      party_voucher_no: partyVoucherNum,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      client_id: selectedClient.value,
      client_company_id: selectedCompany.value,
      metal_narration: jewelNarration,
      account_narration: accNarration,
      purchaseCreateDate: voucherDate,
      Orders: Orders,
      uploadDocIds: docIds,
      party_voucher_date:partyVoucherDate,
      flag: selectedLoad
    }
    console.log(body);
    axios
      .post(
        Config.getCommonUrl() +
        "api/repairingReceivedFromCustomer/uploadfromexcel?save=1", body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // console.log(response);
          // setIsCsvErr(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
          // setSelectedLoad("");
          // setSelectedCompany("");
          // setSelectedClient("");
          // setPartyVoucherNum("");
          // setProductData([]); //category wise Data
          // setTagWiseData([]);
          // //   setSelectedDepartment("");
          // setVoucherDate(moment().format("YYYY-MM-DD"));
          // setAccNarration("");
          // setJewelNarration("");

          // reset();

          // getVoucherNumber();
          setLoading(false);
          // History.goBack();
          if (resetFlag === true) {
            checkAndReset()
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record 
            handlePrint();
          }
        } else {
          setLoading(false);

          if (response.data.csvError === 1) {
            console.log("csverror");
            if (response.data.hasOwnProperty("url")) {
              // console.log("found url", response.data.url);
              let downloadUrl = response.data.url;
              // window.open(downloadUrl);
              setCsvData(downloadUrl)
              // const link = document.createElement("a");
              // link.href = downloadUrl;
              // link.click();
            }
            // setCsvData(response.data.data
            setIsCsvErr(true);
          }
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);
        document.getElementById("fileinput").value = "";
        handleError(error, dispatch, {
          api: "api/repairingReceivedFromCustomer/uploadfromexcel?save=1",
          body: body
        })
      });
  }

  const prevContactIsValid = () => {
    if (userFormValues.length === 0) {
      return true;
    }

    let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

    const someEmpty = userFormValues
      .filter((element) =>
        selectedLoad === "4" ? element.lotno !== "" : element.stockCode !== ""
      )
      .some((item) => {
        if (selectedLoad === "4") {
          return (
            item.billingCategory === "" ||
            item.grossWeight === "" ||
            item.grossWeight ==0 ||
            item.netWeight === "" ||
            item.netWeight == 0 ||
            item.rate === "" || item.rate==0 ||
            percentRegex.test(item.rate) === false ||
            item.lotno === "" ||
            item.purity === "" ||
            item.pieces === "" ||
            isNaN(item.pieces) ||
            percentRegex.test(item.purity) === false ||
            item.netWeight === "" ||
            parseFloat(item.netWeight) > parseFloat(item.grossWeight)
          );
        } else {
          return (
            item.stockCode === "" ||
            item.billingCategory === "" ||
            item.grossWeight === "" ||
            item.grossWeight ==0 ||
            item.netWeight === "" ||
            item.netWeight == 0 ||
            item.rate === "" || item.rate==0 ||
            item.pieces === "" ||
            isNaN(item.pieces) ||
            percentRegex.test(item.rate) === false ||
            item.netWeight === "" ||
            parseFloat(item.netWeight) > parseFloat(item.grossWeight)
          );
        }
      });

    if (someEmpty) {
      userFormValues
        .filter((element) =>
          selectedLoad === "4" ? element.lotno !== "" : element.stockCode !== ""
        )
        .map((item, index) => {
          const allPrev = [...userFormValues];
          // console.log(item);
          if (selectedLoad === "4") {
            let lotNo = userFormValues[index].lotno;
            if (lotNo === "") {
              allPrev[index].errors.lotno = "Please Enter Valid Lot No";
            } else {
              allPrev[index].errors.lotno = null;
            }

            let purity = userFormValues[index].purity;
            if (!purity || percentRegex.test(purity) === false) {
              allPrev[index].errors.purity = "Please Insert Valid Purity";
            } else {
              allPrev[index].errors.purity = null;
            }
          } else {
            let stockCode = userFormValues[index].stockCode;
            if (stockCode === "") {
              allPrev[index].errors.stockCode = "Please Select Stock Code";
            } else {
              allPrev[index].errors.stockCode = null;
            }

            let pcsTotal = userFormValues[index].pieces;
            console.log("stock", stockCode)
            if (stockCode.pcs_require === 1) {
              if (pcsTotal === "" || pcsTotal === null || pcsTotal === undefined || isNaN(pcsTotal)) {
                allPrev[index].errors.pieces = "Enter Pieces";
              } else {
                allPrev[index].errors.pieces = null;
              }
            }
          }

          // let pieces = userFormValues[index].pieces;
          // if (pieces === "" || isNaN(pieces)) {
          //   allPrev[index].errors.pieces = "Please Enter Valid Pieces";
          // } else {
          //   allPrev[index].errors.pieces = null;
          // }

          let billingCategory = userFormValues[index].billingCategory;
          if (billingCategory === "") {
            allPrev[index].errors.billingCategory =
              "Please Select Valid Category";
          } else {
            allPrev[index].errors.billingCategory = null;
          }

          let weightRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
          let gWeight = userFormValues[index].grossWeight;
          if (!gWeight || weightRegex.test(gWeight) === false || gWeight==0) {
            allPrev[index].errors.grossWeight = "Enter Gross Weight!";
          } else {
            allPrev[index].errors.grossWeight = null;
          }

          let netWeight = userFormValues[index].netWeight;
          if (!netWeight || weightRegex.test(netWeight) === false || netWeight==0) {
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

          let Rate = userFormValues[index].rate;
          if (!Rate || weightRegex.test(Rate) === false || Rate==0) {
            allPrev[index].errors.rate = "Enter Valid Rate!";
          } else {
            allPrev[index].errors.rate = null;
          }

          // console.log(allPrev[index]);
          setUserFormValues(allPrev);
          return null;
        });
    }

    return !someEmpty;
  };

  function callUserInputApi(resetFlag, toBePrint) {
    // console.log("fineGoldTotal", fineGoldTotal);

    let Orders = userFormValues
      .filter((element) =>
        selectedLoad === "4" ? element.lotno !== "" : element.stockCode !== ""
      )
      .map((x) => {
        if (selectedLoad === "4") {
          return {
            lot_id: x.lotno.value,
            rate: x.rate,
            // gross_weight: x.grossWeight,
            // net_weight: x.netWeight,
            // pcs: x.pieces,
            // rate: x.rate,
            // category_id: x.billingCategory.value,
            // purity: x.purity,
          };
        } else {
          return {
            stock_name_code_id: x.stockCode.value,
            gross_weight: x.grossWeight,
            pcs: x.pieces,
            net_weight: x.netWeight,
            rate: x.rate,
          };
        }
      });
    console.log(Orders);

    if (Orders.length === 0) {
      dispatch(Actions.showMessage({ message: "Please Add Entry" }));
      return;
    }
    setLoading(true);

    const body = {
      // voucher_no: voucherNumber,
      party_voucher_no: partyVoucherNum,
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      department_id: window.localStorage.getItem("SelectedDepartment"),
      client_id: selectedClient.value,
      client_company_id: selectedCompany.value,
      // ...(selectedLoad === "4" && {
      //   is_lot: 1,
      // }),
      is_lot: selectedLoad === "4" ? 1 : 0,
      metal_narration: jewelNarration,
      account_narration: accNarration,
      Orders: Orders,
      uploadDocIds: docIds,
      party_voucher_date:partyVoucherDate,
      flag: selectedLoad
    }

    axios
      .post(Config.getCommonUrl() + "api/repairingReceivedFromCustomer", body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id

          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.push("/dashboard/masters/clients");
          // History.goBack();
          // setSelectedJobWorker("");
          // setSelectedCompany("");
          // setSelectedClient("");
          // // setOppositeAccSelected("");
          // setPartyVoucherNum("");
          // setVoucherDate(moment().format("YYYY-MM-DD"));

          // //   setSelectedDepartment("");
          // // setFirmName("");
          // setAccNarration("");
          // setJewelNarration("");
          // // setSelectedIndex(0);
          // setSelectedLoad("");
          // reset();

          // getVoucherNumber();

          if (resetFlag === true) {
            checkAndReset()
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record 
            handlePrint();
          }
          setLoading(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
        }
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);
        handleError(error, dispatch, { api: "api/repairingReceivedFromCustomer", body: body })
      });
  }

  function reset() {
    setCsvData("");
    setIsCsvErr(false);
    setPartyVoucherNum("");
    // setSelectedDepartment("");
    setAccNarration("");
    setJewelNarration("");
    // setFineGoldTotal("");
    setTotalGrossWeight("");
    setTotalNetWeight("");
    setTotalJobWorkFine("");
    setValuationTotal("");
    setFileSelected("");
    setIsuploaded(false);

    setUserFormValues([
      {
        lotno: "",
        stockCode: "",
        billingCategory: "",
        HSNNum: "",
        pieces: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        jobWorkFineinPure: "",
        rate: "",
        valuation: "",
        errors: {
          lotno: null,
          stockCode: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobWorkFineinPure: null,
          rate: null,
          valuation: null,
        },
      },
      {
        lotno: "",
        stockCode: "",
        billingCategory: "",
        pieces: "",
        HSNNum: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        jobWorkFineinPure: "",
        rate: "",
        valuation: "",
        errors: {
          lotno: null,
          stockCode: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobWorkFineinPure: null,
          rate: null,
          valuation: null,
        },
      },
      {
        lotno: "",
        stockCode: "",
        billingCategory: "",
        pieces: "",
        HSNNum: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        jobWorkFineinPure: "",
        rate: "",
        valuation: "",
        errors: {
          lotno: null,
          stockCode: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobWorkFineinPure: null,
          rate: null,
          valuation: null,
        },
      },
      {
        lotno: "",
        stockCode: "",
        billingCategory: "",
        pieces: "",
        HSNNum: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        jobWorkFineinPure: "",
        rate: "",
        valuation: "",
        errors: {
          lotno: null,
          stockCode: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobWorkFineinPure: null,
          rate: null,
          valuation: null,
        },
      },
    ]);
  }

  function handleLoadChange(event) {
    setSelectedLoad(event.target.value);
    setSelectedLoadErr("");
    setClientCompanies([]);
    setSelectedClient("");
    setSelectedCompany("");
    setProductData([]); //category wise Data
    setTagWiseData([]);
    setPrintObj({
      ...printObj,
      loadType: event.target.value,
      stateId: "",
      supplierName: "",
      supAddress: "",
      supplierGstUinNum: "",
      supPanNum: "",
      supState: "",
      supCountry: "",
      supStateCode: "",
      // purcVoucherNum: "",
      voucherDate: moment().format("DD-MM-YYYY"),
      placeOfSupply: "",
      orderDetails: [],
      grossWtTOt: "",
      netWtTOt: "",
      fineWtTot: "",
      amount: "",
      sGstTot: "",
      cGstTot: "",
      iGstTot: "",
      totalAmount: "",
      jewelNarration: "",
      accNarration: "",
    })
    // setIsVoucherSelected(false);
    // setSelectedVoucher("");
    // setVoucherApiData([]);
    reset();
  }

  function resetFormOnly() {
    // setCsvData("");
    // setIsCsvErr(false);
    // setProductData([]); //category wise Data
    // setTagWiseData([]);

    // setPartyVoucherNum("");
    // setAccNarration("");
    // setJewelNarration("");
    setTotalGrossWeight("");
    setTotalNetWeight("");
    setTotalJobWorkFine("");
    setValuationTotal("");
    // setFileSelected("");
    // setIsuploaded(false);

    setUserFormValues([
      {
        lotno: "",
        stockCode: "",
        billingCategory: "",
        pieces: "",
        HSNNum: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        jobWorkFineinPure: "",
        rate: "",
        valuation: "",
        errors: {
          lotno: null,
          stockCode: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobWorkFineinPure: null,
          rate: null,
          valuation: null,
        },
      },
      {
        lotno: "",
        stockCode: "",
        billingCategory: "",
        pieces: "",
        HSNNum: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        jobWorkFineinPure: "",
        rate: "",
        valuation: "",
        errors: {
          lotno: null,
          stockCode: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobWorkFineinPure: null,
          rate: null,
          valuation: null,
        },
      },
      {
        lotno: "",
        stockCode: "",
        billingCategory: "",
        pieces: "",
        HSNNum: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        jobWorkFineinPure: "",
        rate: "",
        valuation: "",
        errors: {
          lotno: null,
          stockCode: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobWorkFineinPure: null,
          rate: null,
          valuation: null,
        },
      },
      {
        lotno: "",
        stockCode: "",
        billingCategory: "",
        pieces: "",
        HSNNum: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        jobWorkFineinPure: "",
        rate: "",
        valuation: "",
        errors: {
          lotno: null,
          stockCode: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobWorkFineinPure: null,
          rate: null,
          valuation: null,
        },
      },
    ]);
  }

  function handleClientSelect(value) {
    setSelectedClient(value);
    setSelectClientErr("");
    setSelectedCompany("");
    setSelectedCompErr("");
    setProductData([]); //category wise Data
    setTagWiseData([]);
    setLotData([])
    // setIsVoucherSelected(false);
    // setSelectedVoucher("");
    // setVoucherApiData([]);
    if (selectedLoad === "4") {//clearing form because selected client or vendor have different lot
      resetFormOnly();
    }

    let findIndex = clientdata.findIndex((item) => item.id === value.value);
    //   // console.log(findIndex, i);
    if (findIndex > -1) {
      getClientCompanies(value.value);
    }
    SelectRef.current.focus()

  }

  function getClientCompanies(clientId) {
    // setClientCompanies

    axios
      .get(Config.getCommonUrl() + `api/client/company/listing/listing/${clientId}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(JSON.stringify(response.data.data));
          console.log(response);
          var compData = response.data.data;
          setClientCompanies(compData);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/client/company/listing/listing/${clientId}` })
      });
  }

  function handleCompanyChange(value) {
    // const [clientCompanies, setClientCompanies] = useState("")
    setSelectedCompany(value);
    setSelectedCompErr("");
    setProductData([]); //category wise Data
    setTagWiseData([]);
    getLotData(value.value);
    const index = clientCompanies.findIndex((element) => element.id === value.value);
    console.log(index);
    console.log(clientCompanies);

    if (index > -1) {
      setFirmName(clientCompanies[index].company_name);
      setAddress(clientCompanies[index].address);
      setSupplierGstUinNum(clientCompanies[index].gst_number);
      setSupPanNum(clientCompanies[index].pan_number);
      setSupState(clientCompanies[index].StateName.name);
      setSupCountry(clientCompanies[index].CountryName.name)
      setVendorStateId(clientCompanies[index].state);
      // setIs_tds_tcs(clientCompanies[index].is_tds_tcs);
      console.log(clientCompanies[index].is_tds_tcs);

      setPrintObj({
        ...printObj,
        is_tds_tcs: clientCompanies[index].is_tds_tcs,
        stateId: clientCompanies[index].state,
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
        jewelNarration: "",
        accNarration: "",
        // balancePayable: totalInvoiceAmount
      })

      if (
        clientCompanies[index].is_tds_tcs != 0
      ) {
        // getLedger(clientCompanies[index].is_tds_tcs)

      } else {
        // setTdsTcsVou("");
        // setLedgerName("");
        // setLedgerData([])
        // setRateValue("");

      }
      // setLegderAmount(0); //everything is goinf to reset so 0
    }

  }

  let handleLotNumChange = (i, e) => {
    console.log(e);
    let newFormValues = [...userFormValues];
    newFormValues[i].lotno = {
      value: e.value,
      label: e.label,
    };
    newFormValues[i].errors.lotno = null;

    let findIndex = lotdata.findIndex((item) => item.Lot.id === e.value);

    if (findIndex > -1) {
      newFormValues[i].purity = lotdata[findIndex].Lot.LotMetalStockCode.purity;
      newFormValues[i].grossWeight = parseFloat(lotdata[findIndex].Lot.total_gross_wgt).toFixed(3);
      newFormValues[i].billingCategory =
        lotdata[findIndex].Lot.ProductCategory.category_name;
      newFormValues[i].netWeight = parseFloat(lotdata[findIndex].Lot.total_net_wgt).toFixed(3);
      newFormValues[i].pieces = lotdata[findIndex].Lot.pcs;
      newFormValues[i].HSNNum =
        lotdata[findIndex].Lot.ProductCategory.hsn_master.hsn_number;
      newFormValues[i].rate = "";
      newFormValues[i].amount = "";
      newFormValues[i].Total = "";

      if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
        newFormValues[i].jobWorkFineinPure = parseFloat(
          (parseFloat(newFormValues[i].netWeight) *
            parseFloat(newFormValues[i].purity)) /
          100
        ).toFixed(3);
      } else {
        newFormValues[i].jobWorkFineinPure = "";
      }

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
    }
    console.log(newFormValues);
    if (i === userFormValues.length - 1) {
      // addFormFields();
      changeTotal(newFormValues, true);
    } else {
      changeTotal(newFormValues, false);
    }
  };

  let handleStockGroupFindingChange = (i, e) => {
    console.log(e);
    let newFormValues = [...userFormValues];
    newFormValues[i].stockCode = {
      value: e.value,
      label: e.label,
      pcs_require: e.pcs_require
    };
    newFormValues[i].errors.stockCode = null;

    let findIndex = stockCodeFindings.findIndex(
      (item) => item.stock_name_code.id === e.value
    );
    // console.log(findIndex);
    if (findIndex > -1) {
      newFormValues[i].grossWeight = "";
      newFormValues[i].netWeight = "";
      newFormValues[i].rate = "";
      newFormValues[i].pieces = "";
      newFormValues[i].valuation = "";
      newFormValues[i].lotno = "";

      newFormValues[i].purity =
        stockCodeFindings[findIndex].stock_name_code.purity;
      newFormValues[i].HSNNum =
        stockCodeFindings[findIndex].hsn_master.hsn_number;

      // if (
      //   newFormValues[i].netWeight !== "" &&
      //   newFormValues[i].purity !== ""
      // ) {
      //   newFormValues[i].jobWorkFineinPure =
      //     (parseFloat(newFormValues[i].netWeight) *
      //       parseFloat(newFormValues[i].purity)) /
      //     100;
      // } else {
      newFormValues[i].jobWorkFineinPure = "";
      // }

      newFormValues[i].billingCategory =
        stockCodeFindings[findIndex].stock_name;
      newFormValues[i].errors.billingCategory = null;
    }

    // console.log("i", i, "length", userFormValues.length);
    if (i === userFormValues.length - 1) {
      // addFormFields();
      changeTotal(newFormValues, true);
    } else {
      changeTotal(newFormValues, false);
    }

    pcsInputRef.current[i].focus()
  };

  let handleStockGroupChange = (i, e) => {
    console.log(e);
    let newFormValues = [...userFormValues];
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
      newFormValues[i].grossWeight = "";
      newFormValues[i].netWeight = "";
      newFormValues[i].rate = "";
      newFormValues[i].pieces = "";
      newFormValues[i].valuation = "";
      newFormValues[i].lotno = "";

      newFormValues[i].purity = stockCodeData[findIndex].stock_name_code.purity;
      newFormValues[i].HSNNum = stockCodeData[findIndex].hsn_master.hsn_number;

      // if (
      //   newFormValues[i].netWeight !== "" &&
      //   newFormValues[i].purity !== ""
      // ) {
      //   newFormValues[i].jobWorkFineinPure =
      //     (parseFloat(newFormValues[i].netWeight) *
      //       parseFloat(newFormValues[i].purity)) /
      //     100;
      // } else {
      newFormValues[i].jobWorkFineinPure = "";
      // }

      newFormValues[i].billingCategory = stockCodeData[findIndex].stock_name;
      newFormValues[i].errors.billingCategory = null;
    }

    // console.log("i", i, "length", userFormValues.length);
    if (i === userFormValues.length - 1) {
      // addFormFields();
      changeTotal(newFormValues, true);
    } else {
      changeTotal(newFormValues, false);
    }

    pcsInputRef.current[i].focus()
  };

  function changeTotal(newFormValues, addFlag) {
    function valuation(item) {
      return item.valuation;
    }
    let tempTotal = newFormValues
      .filter((item) => item.valuation !== "")
      .map(valuation)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setValuationTotal(parseFloat(tempTotal).toFixed(3));

    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.grossWeight);
    }

    function jobWorkFineinPure(item) {
      return parseFloat(item.jobWorkFineinPure);
    }

    function netWeight(item) {
      return parseFloat(item.netWeight);
    }

    let tempNetWeight = newFormValues
      .filter((data) => data.netWeight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setTotalNetWeight(parseFloat(tempNetWeight).toFixed(3));

    function jobWorkFineinPure(item) {
      return parseFloat(item.jobWorkFineinPure);
    }

    let tempjobWork = newFormValues
      .filter((data) => data.jobWorkFineinPure !== "")
      .map(jobWorkFineinPure)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setTotalJobWorkFine(parseFloat(tempjobWork).toFixed(3));

    // setFineGoldTotal("");

    // let tempFineGold = newFormValues
    //   .filter((item) => item.jobWorkFineinPure !== "")
    //   .map(jobWorkFineinPure)
    //   .reduce(function (a, b) {
    //     // sum all resulting numbers
    //     return parseFloat(a) + parseFloat(b);
    //   }, 0);

    // setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

    // setTotalGrossWeight(
    //   parseFloat(newFormValues
    //     .filter((data) => data.grossWeight !== "")
    //     .map(grossWeight)
    //     .reduce(function (a, b) {
    //       // sum all resulting numbers
    //       return parseFloat(a) + parseFloat(b);
    //     }, 0)).toFixed(3)
    // );
    const totaltempjobWork = parseFloat(newFormValues
      .filter((data) => data.jobWorkFineinPure !== "")
      .map(jobWorkFineinPure)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);
    setTotalJobWorkFine(totaltempjobWork);
    const totalGrossWeightVal = parseFloat(newFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);
    setTotalGrossWeight(totalGrossWeightVal);
    const totalNetWeightVal = parseFloat(newFormValues
      .filter((data) => data.netWeight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);
    setTotalNetWeight(totalNetWeightVal);
    const total_valution = parseFloat(newFormValues
      .filter((data) => data.valuation !== "")
      .map(valuation)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);
    setTotalNetWeight(total_valution);

    setPrintObj({
      ...printObj,
      orderDetails: newFormValues,
      grossWtTOt: parseFloat(totalGrossWeightVal).toFixed(3),
      netWtTOt: parseFloat(totalNetWeightVal).toFixed(3),
      jobWorkFineinPureTot: parseFloat(totaltempjobWork).toFixed(3),
      totalInvoiceAmt: parseFloat(total_valution).toFixed(3),
    })
    if (addFlag === true) {
      setUserFormValues([
        ...newFormValues,
        {
          lotno: "",
          stockCode: "",
          billingCategory: "",
          pieces: "",
          HSNNum: "",
          grossWeight: "",
          netWeight: "",
          purity: "",
          jobWorkFineinPure: "",
          rate: "",
          valuation: "",
          errors: {
            lotno: null,
            stockCode: null,
            billingCategory: null,
            pieces: null,
            grossWeight: null,
            netWeight: null,
            purity: null,
            jobWorkFineinPure: null,
            rate: null,
            valuation: null,
          },
        },
      ]);
    } else {
      setUserFormValues(newFormValues);
    }
  }

  let handlerBlur = (i, e) => {
    console.log("handlerBlur");
    let newFormValues = [...userFormValues];

    let nm = e.target.name;
    let val = e.target.value;
    // console.log("val", val)
    if (isNaN(val) || val === "") {
      return;
    }
    if (nm === "grossWeight") {
      newFormValues[i].grossWeight = parseFloat(val).toFixed(3)
    }
    if (nm === "netWeight") {
      newFormValues[i].netWeight = parseFloat(val).toFixed(3)
    }
    if (nm === "rate") {
      newFormValues[i].rate = parseFloat(val).toFixed(3)
    }

    setUserFormValues(newFormValues);
  }

  let handleChange = (i, e) => {
    // console.log("handleChange");
    let newFormValues = [...userFormValues];
    newFormValues[i][e.target.name] = e.target.value;
    newFormValues[i].errors[e.target.name] = null;

    let nm = e.target.name;
    let val = e.target.value;

    // console.log(nm, val);
    //if grossWeight or putity change
    if (nm === "grossWeight") {
      newFormValues[i].netWeight=e.target.value
      newFormValues[i].errors.netWeight = "";
      newFormValues[i].errors.grossWeight = "";
      if(val==0){
        newFormValues[i].errors.grossWeight = "Enter valid Gross Weight";
        newFormValues[i].errors.netWeight = "Enter valid Net Weight"
      }
      if (val === ""  || val == 0) {
        newFormValues[i].jobWorkFineinPure = "";
        newFormValues[i].valuation = "";
        // newFormValues[i].netWeight = "";
        setTotalGrossWeight("");
        // setFineGoldTotal("");
      }

      // newFormValues[i].errors.netWeight = "";
      //   setAdjustedRate(false);
      if (
        parseFloat(newFormValues[i].grossWeight) <
        parseFloat(newFormValues[i].netWeight)
      ) {
        newFormValues[i].errors.netWeight =
          "Net Weight Can not be Greater than Gross Weight";
      } else {
        newFormValues[i].errors.netWeight = "";
      }
      newFormValues[i].rate = "";
    }

    if (nm === "netWeight") {
      if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
        newFormValues[i].jobWorkFineinPure = parseFloat(
          (parseFloat(newFormValues[i].netWeight) *
            parseFloat(newFormValues[i].purity)) /
          100
        ).toFixed(3);
      }

      newFormValues[i].errors.grossWeight = "";
      if (val === "") {
        newFormValues[i].jobWorkFineinPure = "";
        newFormValues[i].valuation = "";
        // newFormValues[i].netWeight = "";
        setTotalNetWeight("");
        // setFineGoldTotal("");
      }
      if (parseFloat(newFormValues[i].grossWeight) < parseFloat(val)) {
        newFormValues[i].errors.netWeight =
          "Net Weight Can not be Greater than Gross Weight";
      } else {
        newFormValues[i].errors.netWeight = "";
      }

      newFormValues[i].rate = "";
    }

    if (nm === "purity") {
      if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
        newFormValues[i].jobWorkFineinPure = parseFloat(
          (parseFloat(newFormValues[i].netWeight) *
            parseFloat(newFormValues[i].purity)) /
          100
        ).toFixed(3);
      }

      if (val === "") {
        newFormValues[i].jobWorkFineinPure = "";
        newFormValues[i].valuation = "";

        // setAmount("");
        setTotalNetWeight("");
        // setFineGoldTotal("");
      }
    }

    // console.log("rate", newFormValues[i].rate);

    if (newFormValues[i].rate !== "" && newFormValues[i].netWeight !== "") {
      newFormValues[i].valuation = parseFloat(
        (parseFloat(newFormValues[i].rate) *
          parseFloat(newFormValues[i].netWeight)) /
        10
      ).toFixed(3);
    }

    function valuation(item) {
      return item.valuation;
    }
    let tempTotal = userFormValues
      .filter((item) => item.valuation !== "")
      .map(valuation)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setValuationTotal(parseFloat(tempTotal).toFixed(3));

    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.grossWeight);
    }

    function netWeight(item) {
      // console.log(parseFloat(item.netWeight))
      return parseFloat(item.netWeight);
    }

    let tempNetWeight = userFormValues
      .filter((data) => data.netWeight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setTotalNetWeight(parseFloat(tempNetWeight).toFixed(3));
    let tempGrossWeight = userFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setTotalGrossWeight(parseFloat(tempGrossWeight).toFixed(3));

    function jobWorkFineinPure(item) {
      return parseFloat(item.jobWorkFineinPure);
    }


    let tempjobWork = userFormValues
      .filter((data) => data.jobWorkFineinPure !== "")
      .map(jobWorkFineinPure)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotalJobWorkFine(parseFloat(tempjobWork).toFixed(3));
    setPrintObj({
      ...printObj,
      stateId: vendorStateId,
      orderDetails: newFormValues,
      grossWtTOt: parseFloat(tempGrossWeight).toFixed(3),
      netWtTOt: parseFloat(tempNetWeight).toFixed(3),
      jobWorkFineinPureTot: parseFloat(tempjobWork).toFixed(3),
      totalInvoiceAmt: parseFloat(tempTotal).toFixed(3),
    })

    setUserFormValues(newFormValues);

    // setFineGoldTotal("");

    // function jobWorkFineinPure(item) {
    //   return parseFloat(item.jobWorkFineinPure);
    // }

    // let tempFineGold = userFormValues
    //   .filter((item) => item.jobWorkFineinPure !== "")
    //   .map(jobWorkFineinPure)
    //   .reduce(function (a, b) {
    //     // sum all resulting numbers
    //     return parseFloat(a) + parseFloat(b);
    //   }, 0);
    // setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

    // setUserFormValues(newFormValues);

    // if (adjustedRate === true) {
    handleRateValChange();
    // }
  };

  function handleRateValChange() {
    userFormValues
      .filter((element) => element.stockCode !== "")
      .map((item, i) => {
        let newFormValues = [...userFormValues];

        if (newFormValues[i].stockCode !== "") {
          if (
            newFormValues[i].netWeight !== "" &&
            newFormValues[i].purity !== ""
          ) {
            newFormValues[i].jobWorkFineinPure = parseFloat(parseFloat(newFormValues[i].netWeight) * parseFloat(newFormValues[i].purity) / 100).toFixed(3);
          }

          if (
            newFormValues[i].rate !== "" &&
            newFormValues[i].netWeight !== ""
          ) {
            newFormValues[i].valuation = parseFloat((parseFloat(newFormValues[i].rate) * parseFloat(newFormValues[i].netWeight)) / 10).toFixed(3);
          }

          function valuation(item) {
            return item.valuation;
          }
          let tempTotal = newFormValues
            .filter((item) => item.valuation !== "")
            .map(valuation)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setValuationTotal(parseFloat(tempTotal).toFixed(3));

          function grossWeight(item) {
            // console.log(parseFloat(item.grossWeight));
            return parseFloat(item.grossWeight);
          }

          function jobWorkFineinPure(item) {
            return parseFloat(item.jobWorkFineinPure);
          }

          let tempjobWork = newFormValues
            .filter((data) => data.jobWorkFineinPure !== "")
            .map(jobWorkFineinPure)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setTotalJobWorkFine(parseFloat(tempjobWork).toFixed(3));

          let tempGrossWeight = parseFloat(newFormValues
            .filter((data) => data.grossWeight !== "")
            .map(grossWeight)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0)).toFixed(3)

          setTotalGrossWeight(parseFloat(tempGrossWeight).toFixed(3));

          function netWeight(item) {
            return parseFloat(item.netWeight);
          }

          let tempNetWeight = newFormValues
            .filter((data) => data.netWeight !== "")
            .map(netWeight)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setTotalNetWeight(parseFloat(tempNetWeight).toFixed(3));

          setUserFormValues(newFormValues);

          setPrintObj({
            ...printObj,
            stateId: vendorStateId,
            orderDetails: newFormValues,
            grossWtTOt: parseFloat(tempGrossWeight).toFixed(3),
            netWtTOt: parseFloat(tempNetWeight).toFixed(3),
            jobWorkFineinPureTot: parseFloat(tempjobWork).toFixed(3),
            totalInvoiceAmt: parseFloat(tempTotal).toFixed(3),
          })
        }
        return true;
      });
  }

  function deleteRow(index) {
    console.log(index)
    let newFormValues = [...userFormValues];

    newFormValues[index].lotno = ""
    newFormValues[index].stockCode = ""
    newFormValues[index].billingCategory = ""
    newFormValues[index].HSNNum = ""
    newFormValues[index].pieces = ""
    newFormValues[index].grossWeight = ""
    newFormValues[index].netWeight = ""
    newFormValues[index].purity = ""
    newFormValues[index].jobWorkFineinPure = ""
    newFormValues[index].rate = ""
    newFormValues[index].valuation = ""
    newFormValues[index].errors = {
      lotno: null,
      stockCode: null,
      billingCategory: null,
      pieces: null,
      grossWeight: null,
      netWeight: null,
      purity: null,
      jobWorkFineinPure: null,
      rate: null,
      valuation: null,
    }

    // setUserFormValues(newFormValues);
    changeTotal(newFormValues, false)
  }

  const handleNarrationClick = () => {
    console.log("handleNarr", narrationFlag)
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        "flag": 9,
        "id": idToBeView.id,
        "metal_narration": jewelNarration,
        "account_narration": accNarration
      }
      //call update Api Here
      // console.log("Api Call")
      UpdateNarration(body)
        .then((response) => {
          console.log(response)
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
          handleError(error, dispatch, { api: "api/admin/voucher", body: body })
        })

    }
    setNarrationFlag(!narrationFlag)
  }

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
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            {!props.viewPopup && (
              <Grid
                // className="jewellerypreturn-main"
                container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0 }}
              >
                <Grid item xs={7} sm={7} md={7} key="1" style={{ padding: 0 }}>
                  <FuseAnimate delay={300}>
                    <Typography className="pl-28 pt-16 text-18 font-700">
                      {isView
                        ? "View Repairing Received From the Customer"
                        : "Add Repairing Received From the Customer"}
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
                  style={{ textAlign: "right", paddingRight: "50px" }}
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
            <div className="main-div-alll ">
              {loading && <Loader />}

              <div
                className="pb-32 pt-16"
                style={{ marginBottom: "10%", height: "90%" }}
              >
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
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p> Select load type*</p>

                        <select
                          className={clsx(classes.normalSelect, "focusClass")}
                          required
                          value={selectedLoad}
                          onChange={(e) => handleLoadChange(e)}
                          disabled={isView}
                          ref={loadTypeRef}
                        >
                          <option hidden value="">
                            Select Load type
                          </option>
                          <option value="0">Load Excel with Reference</option>
                          <option value="1">
                            Load Excel File without reference
                          </option>
                          {/* <option value="2">Load Metal Varient</option> */}
                          <option value="3">Load Findings Varient</option>
                          <option value="4">Load Lot directly</option>
                        </select>

                        <span style={{ color: "red" }}>
                          {selectedLoadErr.length > 0 ? selectedLoadErr : ""}
                        </span>
                      </Grid>

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
                            // className="mb-16"
                            name="voucherDate"
                            value={voucherDate}
                            onKeyDown={(e) => e.preventDefault()}
                            error={VoucherDtErr.length > 0 ? true : false}
                            helperText={VoucherDtErr}
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
                          // className="mb-16"
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
                          placeholder="Voucher number"
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
                        <p>Select party*</p>
                        <Select
                          className="repaired_jewellery_select-dv"
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
                          onChange={handleClientSelect}
                          placeholder="Select party"
                          isDisabled={isView}
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
                        <p>Select firm*</p>
                        <Select
                          className="repaired_jewellery_select-dv"
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
                          placeholder="Select firm"
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
                        <p> Party voucher number*</p>
                        <TextField
                          // className="mb-16"
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
                          // onKeyDown={handleTabChange}
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
                        <p>Party voucher date*</p>
                        <TextField
                          //  label="Party Voucher Date"
                          type="date"
                          className="mb-16"
                          name="partyVoucherDate"
                          onKeyDown={(e) => e.preventDefault()}
                          value={partyVoucherDate}
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
                            className=" uploadDoc"
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

                      {(selectedLoad === "0" || selectedLoad === "1") && (
                        <>
                          <Grid
                            item
                            lg={2}
                            md={4}
                            sm={4}
                            xs={12}
                            style={{ padding: 6 }}
                          >
                            <p>Fine rate</p>
                            <TextField
                              className=""
                              // label="Fine Rate"
                              name="fineRate"
                              value={fineRate}
                              error={fineRateErr.length > 0 ? true : false}
                              helperText={fineRateErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                              disabled={isView}
                              placeholder="Enter fine rate"
                              // onKeyDown={handleTabChange}
                            />
                          </Grid>
                          <Grid
                            item
                            lg={2}
                            md={4}
                            sm={4}
                            xs={12}
                            style={{ padding: 6, marginTop: "20px" }}
                          >
                            {/* <p>Upload excel file</p> */}
                            <Button
                              // id="button-jewellery"
                              variant="contained"
                              // color="primary"
                              className="w-216 mx-auto uplod-a-file"
                              aria-label="Register"
                              disabled={!isEnabled || isView}
                              onClick={handleClick}
                              style={{ width: "100%" }}
                            >
                              Upload Excel File
                            </Button>

                            <span style={{ color: "red" }}>
                              {UploadErr.length > 0 ? UploadErr : ""}
                            </span>
                            <input
                              type="file"
                              id="fileinput"
                              // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                              accept=".csv"
                              ref={hiddenFileInput}
                              onChange={handlefilechange}
                              style={{ display: "none" }}
                            />
                          </Grid>
                          <Grid
                            item
                            lg={2}
                            md={4}
                            sm={4}
                            xs={12}
                            style={{
                              padding: 6,
                              justifyContent: "center",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {!isView && (
                              <a
                                href={sampleFile}
                                download={
                                  selectedLoad === "0"
                                    ? "load_excel_with_ref.csv"
                                    : "load_excel_without_ref.csv"
                                }
                              >
                                Download Sample{" "}
                              </a>
                            )}
                            {/* here both files have same format so added only one */}
                          </Grid>
                          {isCsvErr === true && (
                            <Grid
                              item
                              xs={4}
                              style={{ padding: 6, color: "red" }}
                            >
                              Your File Has Error Please Correct it, Download
                              from <a href={csvData}>Here</a>
                              {/* <CSVLink
                          data={csvData}
                          filename={
                            "" +
                            new Date().getDate() +
                            "_" +
                            (new Date().getMonth() + 1) +
                            "_" +
                            new Date().getFullYear()
                          }
                        >
                          {" "}
                          Here
                        </CSVLink> */}
                            </Grid>
                          )}
                        </>
                      )}
                    </Grid>
                    <div className="jewellery-artician-main AddRepairingRecfromCust-tle-main">
                      {(selectedLoad === "0" || selectedLoad === "1") && (
                        <Grid className="salesjobwork-table-main AddRepairingRecfromCust-tle-dv  ">
                          <div className="mt-16">
                            <AppBar
                              position="static"
                              className="add-header-purchase"
                            >
                              <Tabs
                                value={modalView}
                                onChange={handleChangeTab}
                              >
                                <Tab label="Category Wise List" />
                                <Tab label="Tag Wise List" />
                              </Tabs>
                            </AppBar>
                            {modalView === 0 && (
                              <CategoryWiseList
                                productData={productData}
                                isView={isView}
                              />
                            )}
                            {modalView === 1 && (
                              <TagWiseList
                                tagWiseData={tagWiseData}
                                isView={isView}
                              />
                            )}
                          </div>
                        </Grid>
                      )}

                      {(selectedLoad === "2" ||
                        selectedLoad === "3" ||
                        selectedLoad === "4") && (
                        <div
                          className="mt-16 jewellery-artician-tbl repaing-add-form repaing-add-form-tbl repaing-add-blg-tbl repaing-add-blg-tbl_dv"
                          style={{
                            border: "1px solid #D1D8F5",
                            paddingBottom: 5,
                            borderRadius: "7px",
                          }}
                        >
                          <div
                            id="jewellery-artician-head "
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
                            {selectedLoad === "4" && (
                              <div className={clsx(classes.tableheader, "")}>
                                Lot Number
                              </div>
                            )}
                            {(selectedLoad === "2" || selectedLoad === "3") && (
                              <div className={classes.tableheader}>
                                Category
                              </div>
                            )}
                            <div className={clsx(classes.tableheader, "")}>
                              Billing Category
                            </div>
                            <div className={clsx(classes.tableheader, "")}>
                              HSN
                            </div>

                            <div className={clsx(classes.tableheader, "")}>
                              Pieces
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
                              Job work Fine in Pure
                            </div>

                            <div className={clsx(classes.tableheader, "")}>
                              Rate
                            </div>
                            <div className={clsx(classes.tableheader, "")}>
                              Valuation
                            </div>
                          </div>
                          {/* if 0 or 1 then show files upload data else input like metal */}

                          {userFormValues.map((element, index) => (
                            <div
                              id="jewellery-artician-head"
                              key={index}
                              className="all-purchase-tabs"
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
                                      deleteRow(index);
                                    }}
                                  >
                                    <Icon className="delete-icone">
                                      <img src={Icones.delete_red} alt="" />
                                    </Icon>
                                  </IconButton>
                                </div>
                              )}
                              {selectedLoad === "4" && (
                                <>
                                  <Select
                                    filterOption={createFilter({
                                      ignoreAccents: false,
                                    })}
                                    className={classes.selectBox}
                                    classes={classes}
                                    styles={selectStyles}
                                    options={lotdata.map((suggestion) => ({
                                      value: suggestion.Lot.id,
                                      label: suggestion.Lot.number,
                                    }))}
                                    // components={components}
                                    value={
                                      element.lotno !== ""
                                        ? element.lotno.value === ""
                                          ? ""
                                          : element.lotno
                                        : ""
                                    }
                                    onChange={(e) => {
                                      handleLotNumChange(index, e);
                                    }}
                                    placeholder="Lot Number"
                                    isDisabled={isView}
                                  />

                                  {element.errors !== undefined &&
                                  element.errors.lotno !== null ? (
                                    <span style={{ color: "red" }}>
                                      {element.errors.lotno}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </>
                              )}

                              {selectedLoad === "2" && (
                                <>
                                  <Select
                                    filterOption={createFilter({
                                      ignoreAccents: false,
                                    })}
                                    className={classes.selectBox}
                                    classes={classes}
                                    styles={selectStyles}
                                    options={stockCodeData.map(
                                      (suggestion) => ({
                                        value: suggestion.stock_name_code.id,
                                        label:
                                          suggestion.stock_name_code.stock_code,
                                        pcs_require:
                                          suggestion.stock_name_code
                                            .stock_description.pcs_require,
                                      })
                                    )}
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

                                  {element.errors !== undefined &&
                                  element.errors.stockCode !== null ? (
                                    <span style={{ color: "red" }}>
                                      {element.errors.stockCode}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </>
                              )}

                              {selectedLoad === "3" && (
                                <>
                                  <Select
                                    filterOption={createFilter({
                                      ignoreAccents: false,
                                    })}
                                    className={classes.selectBox}
                                    classes={classes}
                                    styles={selectStyles}
                                    options={stockCodeFindings.map(
                                      (suggestion) => ({
                                        value: suggestion.stock_name_code.id,
                                        label:
                                          suggestion.stock_name_code.stock_code,
                                        pcs_require:
                                          suggestion.stock_name_code
                                            .stock_description.pcs_require,
                                      })
                                    )}
                                    // components={components}
                                    value={
                                      element.stockCode !== ""
                                        ? element.stockCode.value === ""
                                          ? ""
                                          : element.stockCode
                                        : ""
                                    }
                                    onChange={(e) => {
                                      handleStockGroupFindingChange(index, e);
                                    }}
                                    placeholder="Stock Code"
                                    isDisabled={isView}
                                  />

                                  {element.errors !== undefined &&
                                  element.errors.stockCode !== null ? (
                                    <span style={{ color: "red" }}>
                                      {element.errors.stockCode}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </>
                              )}

                              <TextField
                                name="billingCategory"
                                className=""
                                value={element.billingCategory || ""}
                                disabled
                                // value={departmentNm}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.billingCategory
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.billingCategory
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                              />

                              <TextField
                                // label="HSN"
                                name="HSNNum"
                                className=""
                                value={element.HSNNum || ""}
                                disabled
                                // value={departmentNm}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.HSNNum
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.HSNNum
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                              />

                              <TextField
                                // label="HSN"
                                name="pieces"
                                className={classes.inputBoxTEST}
                                type={isView ? "text" : "number"}
                                value={element.pieces || ""}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.pieces
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.pieces
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                inputRef={(el) =>
                                  (pcsInputRef.current[index] = el)
                                }
                                variant="outlined"
                                fullWidth
                                disabled={isView || selectedLoad == "4"}
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
                                variant="outlined"
                                fullWidth
                                disabled={isView || selectedLoad == "4"}
                              />
                              <TextField
                                // label="Net Weight"
                                name="netWeight"
                                className={classes.inputBoxTEST}
                                type={isView ? "text" : "number"}
                                value={element.netWeight || ""}
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
                                onBlur={(e) => handlerBlur(index, e)}
                                variant="outlined"
                                fullWidth
                                // disabled={isView || selectedLoad=="4"}
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
                                // label="Rate"
                                name="jobWorkFineinPure"
                                className=""
                                value={element.jobWorkFineinPure || ""}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.jobWorkFineinPure
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.jobWorkFineinPure
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
                                value={
                                  isView
                                    ? Config.numWithComma(element.rate)
                                    : element.rate || ""
                                }
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
                                // label="Rate"
                                name="valuation"
                                className=""
                                value={
                                  isView
                                    ? Config.numWithComma(element.valuation)
                                    : element.valuation || ""
                                }
                                error={
                                  element.errors !== undefined
                                    ? element.errors.valuation
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.valuation
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
                            // id="jewellery-artician-head"
                            className="castum-row-dv"
                            style={{
                              fontWeight: "700",
                              height: "30px",
                              // paddingTop: 5,
                              // borderTop: "1px solid lightgray",
                            }}
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
                              className={clsx(
                                classes.tableheader,
                                "castum-width-table"
                              )}
                            ></div>

                            <div
                              className={clsx(
                                classes.tableheader,
                                "castum-width-table"
                              )}
                            ></div>

                            <div
                              className={clsx(
                                classes.tableheader,
                                "castum-width-table"
                              )}
                            ></div>

                            <div
                              className={clsx(
                                classes.tableheader,
                                "castum-width-table"
                              )}
                            >
                              {HelperFunc.getTotalOfFieldNoDecimal(
                                userFormValues,
                                "pieces"
                              )}
                            </div>
                            <div
                              className={clsx(
                                classes.tableheader,
                                "castum-width-table"
                              )}
                            >
                              {totalGrossWeight}
                            </div>
                            <div
                              className={clsx(
                                classes.tableheader,
                                "castum-width-table"
                              )}
                            >
                              {HelperFunc.getTotalOfField(
                                userFormValues,
                                "netWeight"
                              )}
                            </div>
                            <div
                              className={clsx(
                                classes.tableheader,
                                "castum-width-table"
                              )}
                            ></div>

                            <div
                              className={clsx(
                                classes.tableheader,
                                "castum-width-table"
                              )}
                            >
                              {totalJobWorkFine}
                            </div>

                            <div
                              className={clsx(
                                classes.tableheader,
                                "castum-width-table"
                              )}
                            ></div>

                            <div
                              className={clsx(
                                classes.tableheader,
                                "castum-width-table"
                              )}
                            >
                              {isView
                                ? Config.numWithComma(valuationTotal)
                                : valuationTotal}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </form>

                  <div className="textarea-row">
                    <div style={{ width: " 100%", marginRight: "20px" }}>
                      <p>Jewellery narration*</p>
                      <TextField
                        // className="mt-16 mr-2"
                        // style={{ width: "50%" }}
                        // label="Metal Narration"
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
                        placeholder="jewellery narration"
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
                        disabled={narrationFlag}
                        placeholder="Account narration"
                      />
                    </div>
                  </div>
                  {!props.viewPopup && (
                    <div>
                      {!isView && (
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ float: "right" }}
                          className="w-216 mx-auto mt-16 btn-print-save "
                          aria-label="Register"
                          hidden={isView}
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
                        className="w-216 mx-auto mt-16 mr-16 btn-print-save"
                        aria-label="Register"
                        //   disabled={!isFormValid()}
                        // type="submit"
                        onClick={(e) => {
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
                        <RepairingRecformCustPrintComp
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
                      className={classes.button}
                      onClick={() => setDocModal(true)}
                    >
                      View Documents
                    </Button>
                  )}
                  <ViewDocModal
                    documentList={documentList}
                    handleClose={handleDocModalClose}
                    open={docModal}
                    updateDocument={updateDocumentArray}
                    purchase_flag_id={idToBeView?.id}
                    purchase_flag="9"
                    concateDocument={concateDocument}
                    viewPopup={props.viewPopup}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddRepairingRecfromCust;

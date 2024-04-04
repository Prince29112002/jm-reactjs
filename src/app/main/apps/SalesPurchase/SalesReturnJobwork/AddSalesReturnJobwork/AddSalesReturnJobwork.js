import React, { useState, useEffect, useRef } from "react";
import { Typography, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";

import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Select, { createFilter } from "react-select";
import History from "@history";
import Button from "@material-ui/core/Button";
import CategoryWiseList from "../../ComponentsSaleJobWork/CategoryWiseList";
import TagWiseList from "../../ComponentsSaleJobWork/TagWiseList";
import Modal from "@material-ui/core/Modal";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Loader from "app/main/Loader/Loader";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Icon, IconButton } from "@material-ui/core";
import moment from "moment";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import { SalesReturnJobworkPrintComp } from "./PrintComponent/SalesReturnJobWorkPRintComp";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
import HelperFunc from "../../Helper/HelperFunc";
import sampleFile from "app/main/SampleFiles/SalesJobworkReturn/load_excel_SalesJobworkReturn.csv";
import { UpdateNarration } from "../../Helper/UpdateNarration";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
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
  paper: {
    position: "absolute",
    // width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
  },
  table: {
    minWidth: 650,
  },
  normalSelect: {
    // marginTop: 8,
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    // borderRadius: 5,
    width: "100%",
    // marginLeft: 15,
  },
  diffPopup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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

const AddSalesReturnJobwork = (props) => {
 
  const [isView, setIsView] = useState(false); //for view Only
  const dispatch = useDispatch();
  const [viewState, setViewState] = useState(null)
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
      // resetForm();

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
    documentTitle: "Sales Jobwork Return Voucher " + getDateAndTime(),
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

  const [documentList, setDocumentList] = useState([])
  const [docModal, setDocModal] = useState(false)
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);

  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 8)
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

  useEffect(() => {
    if (props.reportView === "Report") {
      NavbarSetting('Factory Report', dispatch)
    }else if (props.reportView === "Account"){
      NavbarSetting('Accounts', dispatch)
    }else {
      NavbarSetting('Sales', dispatch)
    }
    //eslint-disable-next-line
  }, []);

  function checkforPrint() {
    if (
      loadTypeValidation() &&
      voucherNumValidation() &&
      partyNameValidation() &&
      oppositeAcValidation() &&
      partyVoucherNumValidation() &&
      partyVoucherDateValidation() &&
      // shippingValidation() &&
      FineRateValidaion()
      // && voucherValidation()
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (isView) {
        handlePrint();
      } else if(handleDateBlur()){
        if (selectedLoad === "0" || selectedLoad === "1") {
          //0,1
          // if (uploadTypeValidation()) {
          // if (shipping === "1") {
          //   if (shippingClientValidation() && shippingCompValidation()) {
          //     postWithExcel();
          //   }
          // } else {
          if (fileSelected !== '' && fileSelected !== null) {
            postWithExcel(false, true);
          } else {
            dispatch(Actions.showMessage({ message: "Upload file" }));
          }

          // }
          // }
        }
        else {
          //selectedLoad  ,2 , 3,4
          // if (shipping === "1") {
          //   if (shippingClientValidation() && shippingCompValidation()) {
          //     //check prev valid
          //     if (prevIsValid()) {
          //       addUserInputApi();
          //     }
          //   }
          // } else {
          if (prevIsValid()) {
            addUserInputApi(false, true);
          }
          // }
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

  const classes = useStyles();
  const theme = useTheme();
  const [modalStyle] = React.useState(getModalStyle);
  const [modalView, setModalView] = useState(0);
  const loadTypeRef = useRef(null)

  const [loading, setLoading] = useState(false);

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [selectedLoad, setSelectedLoad] = useState("");
  const [selectedLoadErr, setSelectedLoadErr] = useState("");

  const [oppositeAccData, setOppositeAccData] = useState([]);
  const [oppositeAccSelected, setOppositeAccSelected] = useState("");
  const [selectedOppAccErr, setSelectedOppAccErr] = useState("");

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");
  const [partyVoucherDateErr, setpartyVoucherDateErr] = useState("");

  const [clientdata, setClientdata] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectClientErr, setSelectClientErr] = useState("");

  const [clientCompanies, setClientCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompErr, setSelectedCompErr] = useState("");

  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");

  const [vendorData, setVendorData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedVendorErr, setSelectedVendorErr] = useState("");
  const [selectedVendorClient, setVendorClient] = useState({ value: 1, label: "Vendor" });

  const [jobWorkerGst, setJobWorkerGst] = useState("");
  const [jobworkerHSN, setJobWorkerHSN] = useState("");

  const [fineRate, setFineRate] = useState("");
  const [fineRateErr, setFineRateErr] = useState("");

  const [fineGoldTotal, setFineGoldTotal] = useState("");

  const [stateId, setStateId] = useState("");

  const [lotdata, setLotData] = useState([]);

  const [searchData, setSearchData] = useState(""); //for lot search

  const [totalGrossWeight, setTotalGrossWeight] = useState("");
  const [totalNetWeight, setTotalNetWeight] = useState("");
  const [amount, setAmount] = useState("");
  const [cgstVal, setCgstVal] = useState("");
  const [sgstVal, setSgstVal] = useState("");
  const [igstVal, setIgstVal] = useState("");
  const [total, setTotal] = useState(""); //last field with gst
  // const [totalAmount, setTotalAmount] = useState("");

  const [totalGST, setTotalGST] = useState("");

  const [subTotal, setSubTotal] = useState("");

  const [finalAmount, setFinalAmount] = useState("");

  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState("");

  const [roundOff, setRoundOff] = useState("");
  const [roundOffErr, SetRoundOffErr] = useState("");

  const [productCategory, setProductCategory] = useState([]);

  const [stockCodeData, setStockCodeData] = useState([]);
  const [stockCodeFindings, setStockCodeFindings] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [diffStockCode, setDiffStockCode] = useState([]);

  const [DiffrentStock, setDiffrentStock] = useState([
    {
      setStockCodeId: "",
      setPcs: "",
      setWeight: "",
      errors: {
        setStockCodeId: null,
        setPcs: null,
        setWeight: null,
      },
    },
  ]);

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [jewelNarration, setJewelNarration] = useState("");
  const [jewelNarrationErr, setJewelNarrationErr] = useState("");

  const [productData, setProductData] = useState([]); //category wise Data
  const [tagWiseData, setTagWiseData] = useState([]); //tag wise Data

  const [csvData, setCsvData] = useState("");
  const [isCsvErr, setIsCsvErr] = useState(false);

  const [fileSelected, setFileSelected] = useState("");

  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    // if (selectedLoad === "1") {
    //check if selectedLoad is 1 then check bom selected
    if (fineRate === "") {
      dispatch(Actions.showMessage({ message: "Please Set Fine Rate First" }));
    } else {
      hiddenFileInput.current.click();
    }

    // } else {
    // hiddenFileInput.current.click();
    // }
  };
  const handlefilechange = (event) => {
    setIsCsvErr(false);
    console.log("handlefilechange");
    handleFile(event);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchData) {
        getLotData(searchData);
      } else {
        setLotData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
    //eslint-disable-next-line
  }, [searchData]);

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  if (props.location) {
    var idToBeView = props.location.state;
  } else if (props.voucherId) {
    var idToBeView = { id: props.voucherId }
  }
  const [narrationFlag, setNarrationFlag] = useState(false)

  const [formValues, setFormValues] = useState([
    {
      manuallLot: "0",
      lotno: "",
      category: "",
      billingCategory: "",
      HSNNum: "",
      pieces: "",
      grossWeight: "",
      netWeight: "",
      isWeightDiff: "",
      DiffrentStock: [
        {
          setStockCodeId: "",
          setPcs: "",
          setWeight: "",
          errors: {
            setStockCodeId: null,
            setPcs: null,
            setWeight: null,
          },
        },
      ],
      purity: "",
      jobworkFinePure: "",
      wastagePer: "",
      wastageFine: "",
      fineRate: "",
      wastageFineamount: "",
      otherTagAmount: "",
      billingLabourRateperGram: "",
      amount: "",
      cgstPer: "",
      cgstVal: "",
      sGstPer: "",
      sGstVal: "",
      IGSTper: "",
      IGSTVal: "",
      total: "",
      errors: {
        category: null,
        billingCategory: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        jobworkFinePure: null,
        wastagePer: null,
        wastageFine: null,
        wastageFineamount: null,
        otherTagAmount: null,
        billingLabourRateperGram: null,
        amount: null,
        cgstPer: null,
        cgstVal: null,
        sGstPer: null,
        sGstVal: null,
        IGSTper: null,
        IGSTVal: null,
        total: null,
      },
    },
    {
      manuallLot: "0",
      lotno: "",
      category: "",
      billingCategory: "",
      HSNNum: "",
      pieces: "",
      grossWeight: "",
      netWeight: "",
      isWeightDiff: "",
      DiffrentStock: [
        {
          setStockCodeId: "",
          setPcs: "",
          setWeight: "",
          errors: {
            setStockCodeId: null,
            setPcs: null,
            setWeight: null,
          },
        },
      ],
      purity: "",
      jobworkFinePure: "",
      wastagePer: "",
      wastageFine: "",
      wastageFineamount: "",
      fineRate: "",
      otherTagAmount: "",
      billingLabourRateperGram: "",
      amount: "",
      cgstPer: "",
      cgstVal: "",
      sGstPer: "",
      sGstVal: "",
      IGSTper: "",
      IGSTVal: "",
      total: "",
      errors: {
        category: null,
        billingCategory: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        jobworkFinePure: null,
        wastagePer: null,
        wastageFine: null,
        wastageFineamount: null,
        otherTagAmount: null,
        billingLabourRateperGram: null,
        amount: null,
        cgstPer: null,
        cgstVal: null,
        sGstPer: null,
        sGstVal: null,
        IGSTper: null,
        IGSTVal: null,
        total: null,
      },
    },
    {
      manuallLot: "0",
      lotno: "",
      category: "",
      billingCategory: "",
      HSNNum: "",
      pieces: "",
      grossWeight: "",
      netWeight: "",
      isWeightDiff: "",
      DiffrentStock: [
        {
          setStockCodeId: "",
          setPcs: "",
          setWeight: "",
          errors: {
            setStockCodeId: null,
            setPcs: null,
            setWeight: null,
          },
        },
      ],
      purity: "",
      jobworkFinePure: "",
      wastagePer: "",
      wastageFine: "",
      wastageFineamount: "",
      fineRate: "",
      otherTagAmount: "",
      billingLabourRateperGram: "",
      amount: "",
      cgstPer: "",
      cgstVal: "",
      sGstPer: "",
      sGstVal: "",
      IGSTper: "",
      IGSTVal: "",
      total: "",
      errors: {
        category: null,
        billingCategory: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        jobworkFinePure: null,
        wastagePer: null,
        wastageFine: null,
        wastageFineamount: null,
        otherTagAmount: null,
        billingLabourRateperGram: null,
        amount: null,
        cgstPer: null,
        cgstVal: null,
        sGstPer: null,
        sGstVal: null,
        IGSTper: null,
        IGSTVal: null,
        total: null,
      },
    },
    {
      manuallLot: "0",
      lotno: "",
      category: "",
      billingCategory: "",
      HSNNum: "",
      pieces: "",
      grossWeight: "",
      netWeight: "",
      isWeightDiff: "",
      DiffrentStock: [
        {
          setStockCodeId: "",
          setPcs: "",
          setWeight: "",
          errors: {
            setStockCodeId: null,
            setPcs: null,
            setWeight: null,
          },
        },
      ],
      purity: "",
      jobworkFinePure: "",
      wastagePer: "",
      wastageFine: "",
      wastageFineamount: "",
      fineRate: "",
      otherTagAmount: "",
      billingLabourRateperGram: "",
      amount: "",
      cgstPer: "",
      cgstVal: "",
      sGstPer: "",
      sGstVal: "",
      IGSTper: "",
      IGSTVal: "",
      total: "",
      errors: {
        category: null,
        billingCategory: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        jobworkFinePure: null,
        wastagePer: null,
        wastageFine: null,
        wastageFineamount: null,
        otherTagAmount: null,
        billingLabourRateperGram: null,
        amount: null,
        cgstPer: null,
        cgstVal: null,
        sGstPer: null,
        sGstVal: null,
        IGSTper: null,
        IGSTVal: null,
        total: null,
      },
    },
  ]);

  const pcsInputRef = useRef([])//for pcs in table
 
  const handleChangeTab = (event, value) => {
    setModalView(value);
  };

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
    setOppositeAccData(HelperFunc.getOppositeAccountDetails("SalesJobworkReturn"));
    // getVendordata();

    console.log("idToBeView", idToBeView);
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true)
      getSalesJobWorkReturnRecord(idToBeView.id);
    } else {
      setNarrationFlag(false)
      getJobWorkHsnGst()
      getStockCodeMetal();
      getProductCategories();
      getStockCodeStone();
      getStockCodeFindingVariant();
      getVoucherNumber(); //if view only then no need to get new voucher number, we will set data coming from api
    }
    setTimeout(() => {
      if (loadTypeRef.current) {
        console.log("if------------")
        loadTypeRef.current.focus()
      }
    }, 800);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (idToBeView === undefined) {
      if (selectedVendorClient.value === 1) {
        getVendordata();
      } else {
        getClientData();
      }
    }
  }, [selectedVendorClient])

  function getJobWorkHsnGst() {
    axios
      .get(Config.getCommonUrl() + "api/hsnmaster/hsn/readjobworkhsn")
      .then(function (response) {
        console.log(response.data.data);
        if (response.data.success === true) {
          setJobWorkerGst(response.data.data.gst)
          setJobWorkerHSN(response.data.data.hsn_number)
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/hsnmaster/hsn/readjobworkhsn" })
      });
  }

  function getSalesJobWorkReturnRecord(id) {
    setLoading(true);
    let api = ""
    if(props.forDeletedVoucher){
      api = `api/salesJobworkReturn/${id}?deleted_at=1`
    }else {
      api = `api/salesJobworkReturn/${id}`
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
              console.log("finalData", finalData)
              let loadType = response.data.data.otherDetails.loadType
              setSelectedLoad(loadType.toString())

              if (finalData.is_vendor_client === 1) {
                setVendorClient({ value: 1, label: "Vendor" })
                var mainObj = finalData.Vendor
                setSelectedVendor({
                  value: finalData.Vendor.id,
                  label: finalData.Vendor.name,
                });
                setFirmName(finalData.Vendor.firm_name);
              } else {
                setVendorClient({ value: 2, label: "Client" })
                var mainObj = finalData.ClientCompany
                setSelectedClient({
                  value: finalData.Client.id,
                  label: finalData.Client.name,
                });
                setSelectedCompany({
                  value: finalData.ClientCompany.id,
                  label: finalData.ClientCompany.firm_name,
                });
              }
              console.log(mainObj)
              setDocumentList(finalData.salesPurchaseDocs)
              setTimeDate(response.data.data.data.created_at);

              setVoucherNumber(finalData.voucher_no);
              setPartyVoucherDate(finalData.party_voucher_date)
              setAllowedBackDate(true);
              setVoucherDate(finalData.purchase_voucher_create_date);
              setPartyVoucherNum(finalData.party_voucher_no)
              setStateId(mainObj.state);
              let state = mainObj.state;

              setOppositeAccSelected({
                value: finalData.opposite_account_id,
                label: finalData.OppositeAccount.name,
              });
              setRoundOff(
                finalData.round_off === null ? "" : finalData.round_off
              );

              let jbWorkerGst = response.data.data.jobWorkHsn.gst;
              setJobWorkerGst(jbWorkerGst)

              let JWHSN = response.data.data.jobWorkHsn.hsn_number;
              setJobWorkerHSN(JWHSN);
              console.log(jbWorkerGst, JWHSN)

              setTotalInvoiceAmount(
                parseFloat(finalData.total_invoice_amount).toFixed(3)
              );
              setFinalAmount(
                parseFloat(finalData.total_invoice_amount).toFixed(3)
              );

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

              setFineRate(finalData.SalesJobworkReturnOrders[0].fine_rate)
              let tempArray = [];

              if (loadType === 0 || loadType === 1) {
                let igstRes = finalData.SalesJobworkReturnOrders[0].igst
                let TagArr = [];
                let ProdArr = [];

                let cgstPer =
                  igstRes === null
                    ? parseFloat(parseFloat(jbWorkerGst) / 2).toFixed(3)
                    : "";

                let sGstPer =
                  igstRes === null
                    ? parseFloat(parseFloat(jbWorkerGst) / 2).toFixed(3)
                    : "";

                let IGSTper =
                  igstRes !== null
                    ? parseFloat(jbWorkerGst).toFixed(3) : "";

                for (let item of finalData.SalesJobworkReturnOrders) {

                  TagArr.push(
                    {

                      barcode: item.LotDetail.BarCodeProduct.barcode,
                      packet_no: item.LotDetail.LotPacketDetails.LotPackets.PacBarCode.barcode,
                      billing_category_name: item.ProductCategory.billing_category_name,
                      pcs: item.pcs,
                      gross_wgt: parseFloat(item.gross_wt).toFixed(3),
                      net_wgt: parseFloat(item.net_wt).toFixed(3),
                      purity: item.purity,
                      variant_number:item?.LotDetail?.DesignInfo?.variant_number,
                      wastage: parseFloat(item.wastage_per).toFixed(3),
                      wastageFine: parseFloat(item.wastage_fine).toFixed(3),
                      wastageFineAmount: parseFloat(item.wastage_fine_amount).toFixed(3),
                      labourRate: parseFloat(item.billing_labour_rate_per_gram).toFixed(3),
                      other_amt: parseFloat(item.other_tag_amount).toFixed(3),
                      totalFine: item.total_fine,
                      hallmark_charges: parseFloat(item.hallmark_charges).toFixed(3),
                      totalAmount: parseFloat(item.total_amount).toFixed(3),

                    })


                  let fIndex = ProdArr.findIndex((it) => it.category_id === item.category_id)

                  if (fIndex > -1) {

                    ProdArr[fIndex].pcs = parseFloat(ProdArr[fIndex].pcs) + parseFloat(item.pcs);

                    ProdArr[fIndex].gross_wgt = parseFloat(parseFloat(ProdArr[fIndex].gross_wgt) + parseFloat(item.gross_wt)).toFixed(3);

                    ProdArr[fIndex].net_wgt = parseFloat(parseFloat(ProdArr[fIndex].net_wgt) + parseFloat(item.net_wt)).toFixed(3);

                    ProdArr[fIndex].wastageFineAmount = parseFloat(parseFloat(ProdArr[fIndex].wastageFineAmount) + parseFloat(item.wastage_fine_amount)).toFixed(3)

                    ProdArr[fIndex].other_amt = parseFloat(parseFloat(ProdArr[fIndex].other_amt) + parseFloat(item.other_tag_amount)).toFixed(3)

                    ProdArr[fIndex].totalAmount = parseFloat(parseFloat(ProdArr[fIndex].totalAmount) + parseFloat(item.total_amount)).toFixed(3)

                    ProdArr[fIndex].totalFine = parseFloat(parseFloat(ProdArr[fIndex].totalFine) + parseFloat(item.total_fine)).toFixed(3)
                    ProdArr[fIndex].cgstVal =
                      igstRes === null
                        ? parseFloat(parseFloat(ProdArr[fIndex].cgstVal) + parseFloat(parseFloat(item.total_amount) * parseFloat(item.cgst) / 100)).toFixed(3) : ""

                    ProdArr[fIndex].sGstVal =
                      igstRes === null
                        ? parseFloat(parseFloat(ProdArr[fIndex].sGstVal) + parseFloat(parseFloat(item.total_amount) * parseFloat(item.sgst) / 100)).toFixed(3) : ""

                    ProdArr[fIndex].IGSTVal =
                      igstRes !== null
                        ? parseFloat(parseFloat(ProdArr[fIndex].IGSTVal) + parseFloat(parseFloat(item.total_amount) * parseFloat(item.igst) / 100)).toFixed(3) : "";

                  } else {

                    ProdArr.push({
                      category_id: item.category_id,
                      category_name: item.ProductCategory.category_name,
                      billing_category_name: item.ProductCategory.billing_category_name,
                      pcs: item.pcs,
                      gross_wgt: parseFloat(item.gross_wt).toFixed(3),
                      net_wgt: parseFloat(item.net_wt).toFixed(3),
                      purity: item.purity,
                      karat: item.karat,
                      wastage: parseFloat(item.wastage_per).toFixed(3),
                      wastageFine: parseFloat(item.wastage_fine).toFixed(3),
                      wastageFineAmount: parseFloat(item.wastage_fine_amount).toFixed(3),
                      labourRate: parseFloat(item.billing_labour_rate_per_gram).toFixed(3),
                      other_amt: parseFloat(item.other_tag_amount).toFixed(3),
                      totalFine: item.total_fine,
                      totalAmount: parseFloat(item.total_amount).toFixed(3),
                      cgstPer: cgstPer,
                      cgstVal:
                        igstRes === null

                          ? parseFloat(
                            (parseFloat(item.total_amount) * parseFloat(cgstPer)) /
                            100
                          ).toFixed(3)
                          : "",
                      sGstPer: sGstPer,
                      sGstVal:
                        igstRes === null
                          ? parseFloat(
                            (parseFloat(item.total_amount) * parseFloat(sGstPer)) /
                            100
                          ).toFixed(3)
                          : "",
                      IGSTper: IGSTper,
                      IGSTVal:
                        igstRes !== null
                          ? parseFloat(
                            (parseFloat(item.total_amount) * parseFloat(IGSTper)) /
                            100
                          ).toFixed(3)
                          : "",
                    })
                  }
                }
                setProductData(ProdArr);
                setTagWiseData(TagArr);

                function amount(item) {
                  // console.log(item.amount)
                  return item.totalAmount;
                }

                function CGSTval(item) {
                  return item.cgstVal;
                }

                function SGSTval(item) {
                  return item.sGstVal;
                }

                function IGSTVal(item) {
                  return item.IGSTVal;
                }

                let tempAmount = ProdArr
                  .filter((item) => item.totalAmount !== "")
                  .map(amount)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setSubTotal(parseFloat(tempAmount).toFixed(3));

                //tempTotal is amount + gst
                let tempTotal = 0;
                let tempCgstVal = 0;
                let tempSgstVal = 0;
                let tempIgstVal = 0;

                if (igstRes === null) {
                  tempCgstVal = ProdArr
                    .filter((item) => item.cgstVal !== "")
                    .map(CGSTval)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0);

                  tempSgstVal = ProdArr
                    .filter((item) => item.sGstVal !== "")
                    .map(SGSTval)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0);

                  setTotalGST(
                    parseFloat(parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
                  );
                  tempTotal = parseFloat(
                    parseFloat(tempAmount) + parseFloat(tempCgstVal) + parseFloat(tempSgstVal)
                  ).toFixed(3);
                } else {
                  tempIgstVal = ProdArr
                    .filter((item) => item.IGSTVal !== "")
                    .map(IGSTVal)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0);
                  // setIgstVal(parseFloat(tempIgstVal).toFixed(3));
                  setTotalGST(parseFloat(tempIgstVal).toFixed(3));
                  tempTotal = parseFloat(
                    parseFloat(tempAmount) + parseFloat(tempIgstVal)
                  ).toFixed(3);
                }

                setTotal(parseFloat(tempTotal).toFixed(3));
                setAmount(parseFloat(tempAmount).toFixed(3));

                setPrintObj({
                  ...printObj,
                  loadType: loadType.toString(),
                  fine_rate: finalData.SalesJobworkReturnOrders[0].fine_rate,
                  stateId: state,
                  supplierName: mainObj.firm_name,
                  supAddress: mainObj.address,
                  supplierGstUinNum: mainObj.number === null ? "-" : mainObj.gst_number,
                  supPanNum: mainObj.pan_number,
                  supState: mainObj.StateName ? mainObj.StateName.name : mainObj.state_name.name,
                  supCountry: mainObj.country_name ? mainObj.country_name.name : mainObj.CountryName.name,
                  supStateCode: mainObj.gst_number === null ? "-" : mainObj.gst_number.substring(0, 2),
                  purcVoucherNum: finalData.voucher_no,
                  partyInvNum: finalData.party_voucher_no,
                  voucherDate: moment(finalData.purchase_voucher_create_date).format("DD-MM-YYYY"),
                  placeOfSupply: mainObj.StateName ? mainObj.StateName.name : mainObj.state_name.name,
                  orderDetails: ProdArr,
                  taxableAmount: parseFloat(tempAmount).toFixed(3),
                  sGstTot: state === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
                  cGstTot: state === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
                  iGstTot: state !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
                  roundOff: finalData.round_off === null ? "0" : finalData.round_off,
                  grossWtTOt: HelperFunc.getTotalOfField(ProdArr, "gross_wgt"),
                  netWtTOt: HelperFunc.getTotalOfField(ProdArr, "net_wgt"),
                  // fineWtTot: HelperFunc.getTotalOfField(ProdArr, "totalFine"),            
                  totalInvoiceAmt: parseFloat(finalData.total_invoice_amount).toFixed(3),
                  balancePayable: parseFloat(finalData.total_invoice_amount).toFixed(3),
                  jewelNarration: finalData.jewellery_narration !== null ? finalData.jewellery_narration : "",
                  accNarration: finalData.account_narration !== null ? finalData.account_narration : "",
                })
              } else if (loadType === 2 || loadType === 3) {
                setViewState(finalData.SalesJobworkReturnOrders[0].igst)

                for (let item of finalData.SalesJobworkReturnOrders) {
                  // console.log(item);
                  tempArray.push({

                    // manuallLot: "0",
                    // lotno: "",
                    category: {
                      value: item.StockNameCodes.id,
                      label: item.StockNameCodes.stock_code,
                    },
                    billingCategory: item.StockNameCodes.stock_name_code.billing_name,
                    HSNNum: item.hsn_number,
                    pieces: item.pcs,
                    grossWeight: parseFloat(item.gross_wt).toFixed(3),
                    netWeight: parseFloat(item.net_wt).toFixed(3),
                    purity: item.purity,
                    jobworkFinePure: parseFloat(item.jobwork_fine_utilize).toFixed(3),
                    wastagePer: parseFloat(item.wastage_per).toFixed(3),
                    wastageFine: item.wastage_fine,
                    fineRate: parseFloat(item.fine_rate).toFixed(3),
                    wastageFineamount: parseFloat(item.wastage_fine_amount).toFixed(3),
                    otherTagAmount: parseFloat(item.other_tag_amount).toFixed(3),
                    DiffrentStock: item.SalesOrderSetStockCode.map(item => {
                      return {
                        setStockCodeId: {
                          vaule: item.SetStockNameCode.id,
                          label: item.SetStockNameCode.stock_code
                        },
                        setPcs: item.setPcs,
                        setWeight: item.setWeight,
                        errors: {
                          setStockCodeId: null,
                          setPcs: null,
                          setWeight: null,
                        },
                      }
                    }),
                    billingLabourRateperGram: parseFloat(item.billing_labour_rate_per_gram).toFixed(3),
                    amount: parseFloat(item.total_amount).toFixed(3),
                    cgstPer: item.igst === null ? parseFloat(parseFloat(jbWorkerGst) / 2).toFixed(3) : 0,
                    cgstVal: item.igst === null ? parseFloat(parseFloat(item.total_amount) * parseFloat(parseFloat(jbWorkerGst) / 2) / 100).toFixed(3) : 0,
                    sGstPer: item.igst === null ? parseFloat(parseFloat(jbWorkerGst) / 2).toFixed(3) : 0,
                    sGstVal: item.igst === null ? parseFloat(parseFloat(item.total_amount) * parseFloat(parseFloat(jbWorkerGst) / 2) / 100).toFixed(3) : 0,
                    IGSTper: item.igst !== null ? parseFloat(jbWorkerGst).toFixed(3) : 0,
                    IGSTVal: item.igst !== null ? parseFloat(parseFloat(item.total_amount) * parseFloat(jbWorkerGst) / 100).toFixed(3) : 0,
                    total: parseFloat(item.total).toFixed(3),
                    igst: item.igst,
                  });
                }
              } else if (loadType === 4) {
                setViewState(finalData.SalesJobworkReturnOrders[0].igst)
                for (let item of finalData.SalesJobworkReturnOrders) {
                  tempArray.push({
                    lotno: {
                      value: item.Lot.id,
                      label: item.Lot.number
                    },
                    // manuallLot: "0",                  
                    billingCategory: {
                      value: item.ProductCategory.id,
                      label: item.ProductCategory.category_name,
                    },
                    HSNNum: JWHSN,
                    pieces: item.pcs,
                    grossWeight: parseFloat(item.gross_wt).toFixed(3),
                    netWeight: parseFloat(item.net_wt).toFixed(3),
                    purity: item.purity,
                    jobworkFinePure: parseFloat(item.jobwork_fine_utilize).toFixed(3),
                    wastagePer: parseFloat(item.wastage_per).toFixed(3),
                    wastageFine: item.wastage_fine,
                    fineRate: parseFloat(item.fine_rate).toFixed(3),
                    wastageFineamount: parseFloat(item.wastage_fine_amount).toFixed(3),
                    otherTagAmount: parseFloat(item.other_tag_amount).toFixed(3),
                    billingLabourRateperGram: parseFloat(item.billing_labour_rate_per_gram).toFixed(3),
                    amount: parseFloat(item.total_amount).toFixed(3),
                    cgstPer: item.igst === null ? parseFloat(parseFloat(jbWorkerGst) / 2).toFixed(3) : 0,
                    cgstVal: item.igst === null ? parseFloat(parseFloat(item.total_amount) * parseFloat(parseFloat(jbWorkerGst) / 2) / 100).toFixed(3) : 0,
                    sGstPer: item.igst === null ? parseFloat(parseFloat(jbWorkerGst) / 2).toFixed(3) : 0,
                    sGstVal: item.igst === null ? parseFloat(parseFloat(item.total_amount) * parseFloat(parseFloat(jbWorkerGst) / 2) / 100).toFixed(3) : 0,
                    IGSTper: item.igst !== null ? parseFloat(jbWorkerGst).toFixed(3) : 0,
                    IGSTVal: item.igst !== null ? parseFloat(parseFloat(item.total_amount) * parseFloat(jbWorkerGst) / 100).toFixed(3) : 0,
                    total: parseFloat(item.total).toFixed(3),
                    igst: item.igst,
                  });
                }
              }
              if (loadType === 2 || loadType === 3 || loadType === 4) {

                setFormValues(tempArray);

                function amount(item) {
                  // console.log(item.amount)
                  return item.amount;
                }

                function CGSTval(item) {
                  return item.cgstVal;
                }

                function SGSTval(item) {
                  return item.sGstVal;
                }

                function IGSTVal(item) {
                  return item.IGSTVal;
                }

                function Total(item) {
                  return item.total;
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
                // setTotalAmount("");
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
                // setTotalAmount(parseFloat(tempAmount).toFixed(3));
                setSubTotal(parseFloat(tempAmount).toFixed(3));
                let tempCgstVal, tempSgstVal, tempIgstVal;
                tempCgstVal = tempSgstVal = tempIgstVal = 0;
                if (tempArray[0].igst == null) {
                  // setCgstVal("");
                  // setSgstVal("");
                  tempCgstVal = tempArray
                    .filter((item) => item.cgstVal !== "")
                    .map(CGSTval)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0);
                  // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
                  setCgstVal(parseFloat(tempCgstVal).toFixed(3));

                  tempSgstVal = tempArray
                    .filter((item) => item.sGstVal !== "")
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
                  // setIgstVal("");
                  // setTotalGST("")

                  tempIgstVal = tempArray
                    .filter((item) => item.IGSTVal !== "")
                    .map(IGSTVal)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0);
                  setIgstVal(parseFloat(tempIgstVal).toFixed(3));
                  setTotalGST(parseFloat(tempIgstVal).toFixed(3));
                }

                let tempTotal = tempArray
                  .filter((item) => item.total !== "")
                  .map(Total)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setTotal(parseFloat(tempTotal).toFixed(3));
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

                // function fine(item) {
                //   return parseFloat(item.totalFine);
                // }

                // let tempFineGold = tempArray
                //   .filter((item) => item.totalFine !== "")
                //   .map(fine)
                //   .reduce(function (a, b) {
                //     // sum all resulting numbers
                //     return parseFloat(a) + parseFloat(b);
                //   }, 0);
                // setFineGoldTotal(tempFineGold);


                setPrintObj({
                  ...printObj,
                  loadType: loadType.toString(),
                  fine_rate: finalData.SalesJobworkReturnOrders[0].fine_rate,
                  stateId: state,
                  supplierName: mainObj.firm_name,
                  supAddress: mainObj.address,
                  supplierGstUinNum: mainObj.gst_number === null ? "-" : mainObj.gst_number,
                  supPanNum: mainObj.pan_number,
                  supState: mainObj.StateName ? mainObj.StateName.name : mainObj.state_name.name,
                  supCountry: mainObj.country_name ? mainObj.country_name.name : mainObj.CountryName.name,
                  supStateCode: mainObj.gst_number === null ? "-" : mainObj.gst_number.substring(0, 2),
                  purcVoucherNum: finalData.voucher_no,
                  partyInvNum: finalData.party_voucher_no,
                  voucherDate: moment(finalData.purchase_voucher_create_date).format("DD-MM-YYYY"),
                  placeOfSupply: mainObj.StateName ? mainObj.StateName.name : mainObj.state_name.name,
                  orderDetails: tempArray,
                  taxableAmount: parseFloat(tempAmount).toFixed(3),
                  sGstTot: state === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
                  cGstTot: state === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
                  iGstTot: state !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
                  roundOff: finalData.round_off === null ? "0" : finalData.round_off,
                  grossWtTOt: totalGrossWeightVal,
                  netWtTOt: totalNetWeightVal,
                  // fineWtTot: parseFloat(tempFineGold).toFixed(3),
                  totalInvoiceAmt: parseFloat(finalData.total_invoice_amount).toFixed(3),
                  jewelNarration: finalData.jewellery_narration !== null ? finalData.jewellery_narration : "",
                  accNarration: finalData.account_narration !== null ? finalData.account_narration : "",
                  balancePayable: parseFloat(finalData.total_invoice_amount).toFixed(3),
                  signature: finalData.admin_signature,
                })
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

  function getVoucherNumber() {
    axios
      .get(Config.getCommonUrl() + "api/salesJobworkReturn/get/voucher")
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
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/salesJobworkReturn/get/voucher" })
      });
  }

  function getStockCodeStone() {
    axios
      .get(Config.getCommonUrl() + "api/stockname/stone")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setDiffStockCode(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/stockname/stone" })
      });
  }

  function getProductCategories() {
    axios
      .get(Config.getCommonUrl() + "api/productcategory/all/list")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProductCategory(response.data.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/productcategory/all/list" })
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
        handleError(error, dispatch, { api: "api/vendor/listing/listing" })
      });
  }

  function FineRateValidaion() {
    // fineRate
    const regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
    if (!fineRate || regex.test(fineRate) === false) {
      setFineRateErr("Enter Valid Fine Rate");
      return false;
    } else {
      setFineRateErr("");
    }
    return true;
  }

  // function voucherValidation() {
  //   if (selectedVoucher === "") {
  //     setSelectedVouErr("Please Select Voucher");
  //     return false;
  //   }
  //   return true;
  // }

  function handleFormSubmit(ev) {
    ev.preventDefault();
    // resetForm();
    console.log("handleFormSubmit", formValues);
    if (
      loadTypeValidation() &&
      handleDateBlur()&&
      voucherNumValidation() &&
      partyNameValidation() &&
      oppositeAcValidation() &&
      partyVoucherNumValidation() &&
      partyVoucherDateValidation() &&
      // shippingValidation() &&
      FineRateValidaion()
      // && voucherValidation()
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (selectedLoad === "0" || selectedLoad === "1") {
        //0,1
        // if (uploadTypeValidation()) {
        // if (shipping === "1") {
        //   if (shippingClientValidation() && shippingCompValidation()) {
        //     postWithExcel();
        //   }
        // } else {
        if (fileSelected !== '' && fileSelected !== null) {
          postWithExcel(true, false);
        } else {
          dispatch(Actions.showMessage({ message: "Upload file" }));
        }

        // }
        // }
      } else {
        //selectedLoad  ,2 , 3,4
        // if (shipping === "1") {
        //   if (shippingClientValidation() && shippingCompValidation()) {
        //     //check prev valid
        //     if (prevIsValid()) {
        //       addUserInputApi();
        //     }
        //   }
        // } else {
        if (prevIsValid()) {
          addUserInputApi(true, false);
        }
        // }
      }
    } else {
      console.log("else");
    }
  }

  function handleLoadChange(event) {
    setSelectedLoad(event.target.value);
    setSelectedLoadErr("");
    // setClientCompanies([]);
    // setSelectedClient("");
    // setSelectedCompany("");
    setProductData([]); //category wise Data
    setTagWiseData([]); //tag wise Data
    // setIsVoucherSelected(false);
    // setSelectedVoucher("");
    setPrintObj({
      ...printObj,
      loadType: event.target.value,
      partyInvNum: "",
      voucherDate: moment().format("DD-MM-YYYY"),
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
      balancePayable: "",
    })
    reset();
  }

  function reset() {

    // setVoucherApiData([]);
    // setVoucherSearch("");
    // setSelectedVoucher("");
    // setSelectedVouErr("");
    // setSelectedVoucherNm("");
    setVoucherDate(moment().format("YYYY-MM-DD"));
    // setOppositeAccSelected("");
    if (document.getElementById("fileinput") !== null) {
      document.getElementById("fileinput").value = "";
    }
    // setSelectedClient("");
    // setFirmName("");
    setSubTotal("");
    setTotalGST("");
    setFineRate("");
    // setCsvData([]);
    // setIsCsvErr(false);
    setSelectedIndex(-1);
    // setSelectedWeightStock("");
    // setPieces("");
    // setWeight("");
    // setLedgerAmtErr("");
    // setTdsTcsVouErr("");
    // setSelectedRateFixErr("");
    setPartyVoucherNum("");
    setRoundOff("");
    setTotalInvoiceAmount("");
    // setTdsTcsVou("");
    // setLedgerName("");
    // setRateValue("");
    // setLegderAmount("");
    setFinalAmount("");
    setAccNarration("");
    setJewelNarration("");
    // setAdjustedRate(false);
    setStateId("");
    // setBalanceRfixData([]);
    // setBalRfixViewData([]);
    // setCanEnterVal(false);
    // setShortageRfix("");
    // setTempRate("");
    // setAvgeRate("");
    // setTempApiWeight("");
    setTotalGrossWeight("");
    setTotalNetWeight("");
    setFineGoldTotal("");
    // setFineTotal("");
    // setTagAmountAftTot("");
    // setTagAmountBefTot("");
    setAmount("");
    // setHallmarkCharges("");
    // setTotalAmount("");
    setIgstVal("");
    setTotal("");
    // setFileSelected("");
    // setIsuploaded(false);

    setFormValues([
      {
        manuallLot: "0",
        lotno: "",
        category: "",
        billingCategory: "",
        HSNNum: "",
        pieces: "",
        grossWeight: "",
        netWeight: "",
        isWeightDiff: "",
        DiffrentStock: [
          {
            setStockCodeId: "",
            setPcs: "",
            setWeight: "",
            errors: {
              setStockCodeId: null,
              setPcs: null,
              setWeight: null,
            },
          },
        ],
        purity: "",
        jobworkFinePure: "",
        wastagePer: "",
        wastageFine: "",
        wastageFineamount: "",
        fineRate: "",
        otherTagAmount: "",
        billingLabourRateperGram: "",
        amount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        errors: {
          category: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobworkFinePure: null,
          wastagePer: null,
          wastageFine: null,
          wastageFineamount: null,
          otherTagAmount: null,
          billingLabourRateperGram: null,
          amount: null,
          cgstPer: null,
          cgstVal: null,
          sGstPer: null,
          sGstVal: null,
          IGSTper: null,
          IGSTVal: null,
          total: null,
        },
      },
      {
        manuallLot: "0",
        lotno: "",
        category: "",
        billingCategory: "",
        HSNNum: "",
        pieces: "",
        grossWeight: "",
        netWeight: "",
        isWeightDiff: "",
        DiffrentStock: [
          {
            setStockCodeId: "",
            setPcs: "",
            setWeight: "",
            errors: {
              setStockCodeId: null,
              setPcs: null,
              setWeight: null,
            },
          },
        ],
        purity: "",
        jobworkFinePure: "",
        wastagePer: "",
        wastageFine: "",
        wastageFineamount: "",
        fineRate: "",
        otherTagAmount: "",
        billingLabourRateperGram: "",
        amount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        errors: {
          category: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobworkFinePure: null,
          wastagePer: null,
          wastageFine: null,
          wastageFineamount: null,
          otherTagAmount: null,
          billingLabourRateperGram: null,
          amount: null,
          cgstPer: null,
          cgstVal: null,
          sGstPer: null,
          sGstVal: null,
          IGSTper: null,
          IGSTVal: null,
          total: null,
        },
      },
      {
        manuallLot: "0",
        lotno: "",
        category: "",
        billingCategory: "",
        HSNNum: "",
        pieces: "",
        grossWeight: "",
        netWeight: "",
        isWeightDiff: "",
        DiffrentStock: [
          {
            setStockCodeId: "",
            setPcs: "",
            setWeight: "",
            errors: {
              setStockCodeId: null,
              setPcs: null,
              setWeight: null,
            },
          },
        ],
        purity: "",
        jobworkFinePure: "",
        wastagePer: "",
        wastageFine: "",
        wastageFineamount: "",
        fineRate: "",
        otherTagAmount: "",
        billingLabourRateperGram: "",
        amount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        errors: {
          category: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobworkFinePure: null,
          wastagePer: null,
          wastageFine: null,
          wastageFineamount: null,
          otherTagAmount: null,
          billingLabourRateperGram: null,
          amount: null,
          cgstPer: null,
          cgstVal: null,
          sGstPer: null,
          sGstVal: null,
          IGSTper: null,
          IGSTVal: null,
          total: null,
        },
      },
      {
        manuallLot: "0",
        lotno: "",
        category: "",
        billingCategory: "",
        HSNNum: "",
        pieces: "",
        grossWeight: "",
        netWeight: "",
        isWeightDiff: "",
        DiffrentStock: [
          {
            setStockCodeId: "",
            setPcs: "",
            setWeight: "",
            errors: {
              setStockCodeId: null,
              setPcs: null,
              setWeight: null,
            },
          },
        ],
        purity: "",
        jobworkFinePure: "",
        wastagePer: "",
        wastageFine: "",
        wastageFineamount: "",
        fineRate: "",
        otherTagAmount: "",
        billingLabourRateperGram: "",
        amount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        errors: {
          category: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobworkFinePure: null,
          wastagePer: null,
          wastageFine: null,
          wastageFineamount: null,
          otherTagAmount: null,
          billingLabourRateperGram: null,
          amount: null,
          cgstPer: null,
          cgstVal: null,
          sGstPer: null,
          sGstVal: null,
          IGSTper: null,
          IGSTVal: null,
          total: null,
        },
      },
    ]);
  }

  function handleOppAccChange(value) {
    setOppositeAccSelected(value);
    setSelectedOppAccErr("");
  }

  function handleClientPartyChange(value) {
    if (loadTypeValidation()) {
      setSelectedClient(value);
      setSelectClientErr("");
      setSelectedCompany("");
      setSelectedCompErr("");
      setProductData([]); //category wise Data
      setTagWiseData([]); //tag wise Data
      reset();
      setPrintObj({
        ...printObj,
        stateId: "",
        supplierName: "",
        supAddress: "",
        supplierGstUinNum: "",
        supPanNum: "",
        supState: "",
        supCountry: "",
        supStateCode: "",
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
        jewelNarration: "",
        accNarration: "",
        balancePayable: ""
      })

      let findIndex = clientdata.findIndex((item) => item.id === value.value);
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
    }
  }

  function getClientCompanies(clientId, callback) {
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
    setProductData([]); //category wise Data
    setTagWiseData([]); //tag wise Data

    let findIndex = clientCompanies.findIndex(
      (item) => item.id === value.value
    );
    console.log(clientCompanies[findIndex], findIndex);
    if (findIndex > -1) {
      setStateId(clientCompanies[findIndex].state); //setting from selected company

      setPrintObj({
        ...printObj,
        stateId: clientCompanies[findIndex].StateName.id,
        supplierName: clientCompanies[findIndex].company_name,
        supAddress: clientCompanies[findIndex].address,
        supplierGstUinNum: clientCompanies[findIndex].gst_number,
        supPanNum: clientCompanies[findIndex].pan_number,
        supState: clientCompanies[findIndex].StateName.name,
        supCountry: clientCompanies[findIndex].CountryName.name,
        supStateCode: (clientCompanies[findIndex].gst_number) ? clientCompanies[findIndex].gst_number.substring(0, 2) : '',
        voucherDate: moment().format("DD-MM-YYYY"),
        placeOfSupply: clientCompanies[findIndex].StateName.name,
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
        balancePayable: ""
      })
    }
  }

  function oppositeAcValidation() {
    if (oppositeAccSelected === "") {
      setSelectedOppAccErr("Please Select Opposite Account");
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
      if (selectedClient === "" || selectedCompany === "") {
        if (selectedClient === "") {
          setSelectClientErr("Please Select Client");
        }
        if (selectedCompany === "") {
          setSelectedCompErr("Please Select Client Firm");
        }
        return false;
      }
      return true;
    }
  }

  function loadTypeValidation() {
    if (selectedLoad === "") {
      setSelectedLoadErr("Select Load Type");
      return false;
    }
    return true;
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
      setPartyVoucherNumErr("Enter Voucher Number");
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

  function clientCompValidation() {
    if (selectedCompany === "") {
      setSelectedCompErr("Please Select Firm");
      return false;
    }
    return true;
  }

  let handleLotNumChange = (i, e) => {
    console.log(e);
    let newFormValues = [...formValues];

    let findIndex = lotdata.findIndex((item) => item.Lot.number === e);

    if (findIndex > -1) {
      newFormValues[i].manuallLot = "1";
      newFormValues[i].lotno = {
        value: lotdata[findIndex].Lot.id,
        label: lotdata[findIndex].Lot.number,
      };
      newFormValues[i].errors.lotno = null;
      newFormValues[i].purity = lotdata[findIndex].Lot.LotMetalStockCode.purity;
      newFormValues[i].grossWeight = parseFloat(
        lotdata[findIndex].Lot.total_gross_wgt
      ).toFixed(3);
      newFormValues[i].billingCategory = {
        value: lotdata[findIndex].Lot.ProductCategory.id,
        label: lotdata[findIndex].Lot.ProductCategory.category_name,
      };
      newFormValues[i].pieces = lotdata[findIndex].Lot.pcs;
      newFormValues[i].HSNNum = jobworkerHSN;
      // lotdata[findIndex].ProductCategory.hsn_master.hsn_number;
      newFormValues[i].netWeight = parseFloat(
        lotdata[findIndex].Lot.total_net_wgt
      ).toFixed(3);
      newFormValues[i].rate = "";
      newFormValues[i].amount = "";
      newFormValues[i].total = "";

      if (stateId === 12) {
        newFormValues[i].cgstPer =
          parseFloat(jobWorkerGst) / 2;
        newFormValues[i].sGstPer =
          parseFloat(jobWorkerGst) / 2;
      } else {
        newFormValues[i].IGSTper = parseFloat(
          jobWorkerGst
        );
      }

      if (
        parseFloat(newFormValues[i].grossWeight) ===
        parseFloat(newFormValues[i].netWeight)
      ) {
        newFormValues[i].isWeightDiff = 1;
      } else {
        newFormValues[i].isWeightDiff = 0;
      }

      if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
        newFormValues[i].jobworkFinePure = parseFloat(
          (parseFloat(newFormValues[i].netWeight) *
            parseFloat(newFormValues[i].purity)) /
          100
        ).toFixed(3);
      }
    }
    console.log(newFormValues);
    if (i === formValues.length - 1) {
      // addFormFields();
      changeTotal(newFormValues, true);
    } else {
      changeTotal(newFormValues, false);
      // setFormValues(newFormValues);
    }
  };

  function changeTotal(newFormValues, addFlag) {
    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.grossWeight);
    }
    function netWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.netWeight);
    }

    let tempGrossWtTot = parseFloat(newFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3)

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

    let tempNetWtTot = parseFloat(newFormValues
      .filter((data) => data.netWeight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3)

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

    function totalAmount(item) {
      return item.amount;
    }

    let tempTotAmount = newFormValues
      .filter((item) => item.amount !== "")
      .map(totalAmount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setAmount(parseFloat(tempTotAmount).toFixed(3));
    // setTotalAmount(parseFloat(tempTotAmount).toFixed(3));
    setSubTotal(parseFloat(tempTotAmount).toFixed(3));

    let tempIgstVal = 0;
    let tempCgstVal = 0;
    let tempSgstVal = 0;

    if (stateId === 12) {
      function CGSTVal(item) {
        return item.cgstVal;
      }

      tempCgstVal = newFormValues
        .filter((item) => item.cgstVal !== "")
        .map(CGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);

      setCgstVal(parseFloat(tempCgstVal).toFixed(3));

      function SGSTval(item) {
        return item.sGstVal;
      }

      tempSgstVal = newFormValues
        .filter((item) => item.sGstVal !== "")
        .map(SGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);

      setSgstVal(parseFloat(tempSgstVal).toFixed(3));

      // console.log(
      //   parseFloat(parseFloat(tempCGstVal) + parseFloat(tempSgstVal)).toFixed(3)
      // );
      setTotalGST(
        parseFloat(parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
      );
    } else {
      function IGSTVal(item) {
        return item.IGSTVal;
      }

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

    function total(item) {
      return item.total;
    }
    let tempTotal = newFormValues
      .filter((item) => item.total !== "")
      .map(total)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setTotal(parseFloat(tempTotal).toFixed(3));


    let tempfinalAmount = 0;
    let tempTotalInvoiceAmt = 0;
    // let temptdsTcsAmount =0;

    tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);

    setTotalInvoiceAmount(tempTotalInvoiceAmt);

    tempfinalAmount = parseFloat(tempTotalInvoiceAmt).toFixed(3);

    setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));

    setPrintObj({
      ...printObj,
      orderDetails: newFormValues,
      fine_rate: fineRate,
      taxableAmount: parseFloat(tempTotAmount).toFixed(3),
      sGstTot: stateId === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
      cGstTot: stateId === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
      iGstTot: stateId !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      // fineWtTot: HelperFunc.getTotalOfField(newTempProductData, "totalFine"),
      totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
      balancePayable: parseFloat(tempfinalAmount).toFixed(3),
    });

    if (addFlag === true) {
      setFormValues([
        ...newFormValues,
        {
          manuallLot: "0",
          lotno: "",
          category: "",
          billingCategory: "",
          HSNNum: "",
          pieces: "",
          grossWeight: "",
          netWeight: "",
          isWeightDiff: "",
          DiffrentStock: [
            {
              setStockCodeId: "",
              setPcs: "",
              setWeight: "",
              errors: {
                setStockCodeId: null,
                setPcs: null,
                setWeight: null,
              },
            },
          ],
          purity: "",
          jobworkFinePure: "",
          wastagePer: "",
          wastageFine: "",
          wastageFineamount: "",
          fineRate: "",
          otherTagAmount: "",
          billingLabourRateperGram: "",
          amount: "",
          cgstPer: "",
          cgstVal: "",
          sGstPer: "",
          sGstVal: "",
          IGSTper: "",
          IGSTVal: "",
          total: "",
          errors: {
            category: null,
            billingCategory: null,
            pieces: null,
            grossWeight: null,
            netWeight: null,
            purity: null,
            jobworkFinePure: null,
            wastagePer: null,
            wastageFine: null,
            wastageFineamount: null,
            otherTagAmount: null,
            billingLabourRateperGram: null,
            amount: null,
            cgstPer: null,
            cgstVal: null,
            sGstPer: null,
            sGstVal: null,
            IGSTper: null,
            IGSTVal: null,
            total: null,
          },
        },
      ]);
    } else {
      setFormValues(newFormValues);
    }
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

  let handleStockGroupFindingChange = (i, e) => {

    console.log(e);
    let newFormValues = [...formValues];
    newFormValues[i].category = {
      value: e.value,
      label: e.label,
      pcs_require: e.pcs_require
    };
    newFormValues[i].errors.category = null;

    let findIndex = stockCodeFindings.findIndex(
      (item) => item.stock_name_code.id === e.value
    );
    // console.log(findIndex);
    if (findIndex > -1) {
      newFormValues[i].grossWeight = "";
      newFormValues[i].netWeight = "";
      newFormValues[i].rate = "";
      newFormValues[i].pieces = "0";
      newFormValues[i].wastagePer = "";
      newFormValues[i].totalFine = "";

      newFormValues[i].purity = stockCodeFindings[findIndex].stock_name_code.purity;
      newFormValues[i].HSNNum = jobworkerHSN; //stockCodeFindings[findIndex].hsn_master.hsn_number;

      newFormValues[i].billingCategory = stockCodeFindings[findIndex].billing_name;
      newFormValues[i].errors.billingCategory = null;

      if (stateId === 12) {
        newFormValues[i].cgstPer =
          parseFloat(jobWorkerGst) / 2;
        newFormValues[i].sGstPer =
          parseFloat(jobWorkerGst) / 2;
      } else {
        newFormValues[i].IGSTper = parseFloat(
          jobWorkerGst
        );
      }
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
  }


  let handleStockGroupChange = (i, e) => {
    console.log(e);
    let newFormValues = [...formValues];
    newFormValues[i].category = {
      value: e.value,
      label: e.label,
      pcs_require: e.pcs_require
    };
    newFormValues[i].errors.category = null;

    let findIndex = stockCodeData.findIndex(
      (item) => item.stock_name_code.id === e.value
    );
    // console.log(findIndex);
    if (findIndex > -1) {
      newFormValues[i].grossWeight = "";
      newFormValues[i].netWeight = "";
      newFormValues[i].rate = "";
      newFormValues[i].pieces = "0";
      newFormValues[i].wastagePer = "";
      newFormValues[i].totalFine = "";

      newFormValues[i].purity = stockCodeData[findIndex].stock_name_code.purity;
      newFormValues[i].HSNNum = jobworkerHSN; //stockCodeData[findIndex].hsn_master.hsn_number;

      newFormValues[i].billingCategory = stockCodeData[findIndex].billing_name;
      newFormValues[i].errors.billingCategory = null;

      if (stateId === 12) {
        newFormValues[i].cgstPer =
          parseFloat(jobWorkerGst) / 2;
        newFormValues[i].sGstPer =
          parseFloat(jobWorkerGst) / 2;
      } else {
        newFormValues[i].IGSTper = parseFloat(
          jobWorkerGst
        );
      }
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

  function getLotData(sData) {
    let data = {
      search: sData,
      client_company_id:
        selectedVendorClient.value === 1
          ? selectedVendor.value
          : selectedCompany.value,
      is_vendor_client: selectedVendorClient.value === 1 ? 1 : 2,
    };
    axios
      .post(
        Config.getCommonUrl() + "api/salesDomestic/lot/list",
        data
        // `api/lot/department/salesjobwork/${window.localStorage.getItem(
        //   "SelectedDepartment"
        // )}/${sData}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          if (response.data.data.length > 0) {
            setLotData(response.data.data);
          } else {
            dispatch(
              Actions.showMessage({
                message: "No Data",
              })
            );
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/salesDomestic/lot/list",
          body: data
        })

      });
  }

  let handleCategoryChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i].billingCategory = {
      value: e.value,
      label: e.label,
    };
    newFormValues[i].errors.billingCategory = null;

    newFormValues[i].grossWeight = "";
    newFormValues[i].netWeight = "";
    newFormValues[i].pieces = "";

    let findIndex = productCategory.findIndex((item) => item.id === e.value);
    console.log(findIndex);
    if (findIndex > -1) {
      newFormValues[i].HSNNum = jobworkerHSN;
      // productCategory[findIndex].hsn_master.hsn_number;
    }

    changeTotal(newFormValues, false);
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
    }
    if (nm === "netWeight") {
      newFormValues[i].netWeight = parseFloat(val).toFixed(3)
    }
    if (nm === "otherTagAmount") {
      newFormValues[i].otherTagAmount = parseFloat(val).toFixed(3)
    }

    setFormValues(newFormValues);
  }

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    newFormValues[i].errors[e.target.name] = null;

    let nm = e.target.name;
    let val = e.target.value;

    //if grossWeight or putity change
    if (nm === "grossWeight") {
      newFormValues[i].errors.grossWeight = "";
      if(val == 0){
        newFormValues[i].errors.grossWeight = "Enter valid gross weight";
      }
      if (val === "" || val == 0) {
        newFormValues[i].fine = "";
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

      if (parseFloat(newFormValues[i].netWeight) === parseFloat(val)) {
        newFormValues[i].isWeightDiff = 1;
      } else {
        newFormValues[i].isWeightDiff = 0;
      }
      // newFormValues[i].errors.netWeight = "";
      if(newFormValues[i].netWeight == 0){
        newFormValues[i].errors.netWeight = "Enter valid net weight";
      }else{
        if (
          parseFloat(newFormValues[i].grossWeight) <
          parseFloat(newFormValues[i].netWeight)
        ) {
          newFormValues[i].errors.netWeight =
            "Net Weight Can not be Greater than Gross Weight";
        } else {
          newFormValues[i].errors.netWeight = "";
        }
      }
      // setAdjustedRate(false);
      newFormValues[i].fineRate = 0;
    }

    // console.log(nm,val)
    if (nm === "netWeight") {
      if(val == 0){
        newFormValues[i].errors.netWeight = "Enter valid net weight";
      }
      if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
        newFormValues[i].jobworkFinePure = parseFloat(
          (parseFloat(newFormValues[i].netWeight) *
            parseFloat(newFormValues[i].purity)) /
          100
        ).toFixed(3);
      }

      if (parseFloat(newFormValues[i].grossWeight) === parseFloat(val)) {
        newFormValues[i].isWeightDiff = 1;
      } else {
        newFormValues[i].isWeightDiff = 0;
      }
      if(val == 0){
        newFormValues[i].errors.netWeight = "Enter valid net weight";
      }else{
        if (parseFloat(newFormValues[i].grossWeight) < parseFloat(val)) {
          newFormValues[i].errors.netWeight =
            "Net Weight Can not be Greater than Gross Weight";
        } else {
          newFormValues[i].errors.netWeight = "";
        }
      }
      // setAdjustedRate(false);
      newFormValues[i].fineRate = 0;
    }

    if (nm === "wastagePer") {
      newFormValues[i].errors.wastagePer = null;

      if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
        if (newFormValues[i].wastagePer !== "") {
          newFormValues[i].wastageFine = parseFloat(
            (parseFloat(newFormValues[i].netWeight) *
              parseFloat(newFormValues[i].wastagePer)) /
            100
          ).toFixed(3);
        }
      }
    }

    //from here
    if (fineRate !== "") {
      newFormValues[i].fineRate = parseFloat(fineRate).toFixed(3);
    }

    if (
      newFormValues[i].wastageFine !== "" &&
      newFormValues[i].fineRate !== ""
    ) {
      newFormValues[i].wastageFineamount = parseFloat(
        (parseFloat(newFormValues[i].wastageFine) *
          parseFloat(newFormValues[i].fineRate)) /
        10
      ).toFixed(3);
    }

    if (
      newFormValues[i].wastageFineamount !== "" &&newFormValues[i].otherTagAmount != 0 &&
      newFormValues[i].otherTagAmount !== ""
    ) {
      newFormValues[i].amount = parseFloat(
        parseFloat(newFormValues[i].wastageFineamount) +
        parseFloat(newFormValues[i].otherTagAmount)
      ).toFixed(3);
    }

    if (newFormValues[i].amount !== "" && newFormValues[i].amount != 0 && newFormValues[i].netWeight !=0  && newFormValues[i].netWeight !== "") {
      newFormValues[i].billingLabourRateperGram = parseFloat(
        parseFloat(newFormValues[i].amount) /
        parseFloat(newFormValues[i].netWeight)
      ).toFixed(3);
    }

    if (stateId === 12) {
      // console.log("vendorStateId cond")
      if (newFormValues[i].amount !== "" && newFormValues[i].cgstPer !== "") {
        // console.log("if COnd")
        newFormValues[i].cgstVal = parseFloat(
          (parseFloat(newFormValues[i].amount) * parseFloat(jobWorkerGst / 2)) /
          100
        ).toFixed(3);
        // console.log("CGSTval ",(newFormValues[i].amount * newFormValues[i].CGSTPer) / 100)

        newFormValues[i].sGstVal = parseFloat(
          (parseFloat(newFormValues[i].amount) * parseFloat(jobWorkerGst / 2)) /
          100
        ).toFixed(3);
        newFormValues[i].total = parseFloat(
          parseFloat(newFormValues[i].amount) +
          parseFloat(newFormValues[i].sGstVal) +
          parseFloat(newFormValues[i].cgstVal)
        ).toFixed(3);
        // console.log(
        //   parseFloat(newFormValues[i].amount),
        //   parseFloat(newFormValues[i].SGSTval),
        //   parseFloat(newFormValues[i].CGSTval)
        // );
      } else {
        newFormValues[i].cgstVal = "";
        newFormValues[i].sGstVal = "";
        newFormValues[i].total = "";
      }
    } else {
      if (newFormValues[i].amount !== "" && newFormValues[i].IGSTper !== "") {
        newFormValues[i].IGSTVal = parseFloat(
          (parseFloat(newFormValues[i].amount) * parseFloat(jobWorkerGst)) / 100
        ).toFixed(3);
        newFormValues[i].total = parseFloat(
          parseFloat(newFormValues[i].amount) +
          parseFloat(newFormValues[i].IGSTVal)
        ).toFixed(3);
      } else {
        newFormValues[i].IGSTVal = "";
        newFormValues[i].total = "";
      }
    }

    function amount(item) {
      // console.log(item.amount)
      return item.amount;
    }

    function CGSTval(item) {
      return item.cgstVal;
    }

    function SGSTval(item) {
      return item.sGstVal;
    }

    function IGSTVal(item) {
      return item.IGSTVal;
    }

    function Total(item) {
      return item.total;
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
    // setTotalAmount("");
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
    // setTotalAmount(parseFloat(tempAmount).toFixed(3));
    setSubTotal(parseFloat(tempAmount).toFixed(3));

    let tempCgstVal = 0;
    let tempSgstVal = 0;
    let tempIgstVal = 0;

    if (stateId === 12) {
      // setCgstVal("");
      // setSgstVal("");
      tempCgstVal = newFormValues
        .filter((item) => item.cgstVal !== "")
        .map(CGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
      setCgstVal(parseFloat(tempCgstVal).toFixed(3));

      tempSgstVal = newFormValues
        .filter((item) => item.sGstVal !== "")
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
      // setIgstVal("");
      // setTotalGST("")

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
      .filter((item) => item.total !== "")
      .map(Total)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotal(parseFloat(tempTotal).toFixed(3));

    let tempGrossWtTot = parseFloat(newFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3)

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

    let tempNetWtTot = parseFloat(newFormValues
      .filter((data) => data.netWeight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3)

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

    function fine(item) {
      return parseFloat(item.totalFine);
    }

    let tempFineGold = newFormValues
      .filter((item) => item.totalFine !== "")
      .map(fine)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

    // setShortageRfix(tempFineGold);
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

      tempfinalAmount = parseFloat(tempTotalInvoiceAmt).toFixed(3);

      setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));
    } else {
      setTotalInvoiceAmount(0);
      // setLegderAmount(0);
    }

    setFormValues(newFormValues);

    setPrintObj({
      ...printObj,
      orderDetails: newFormValues,
      fine_rate: fineRate,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      sGstTot: stateId === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
      cGstTot: stateId === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
      iGstTot: stateId !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      // fineWtTot: HelperFunc.getTotalOfField(newTempProductData, "totalFine"),
      totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
      balancePayable: parseFloat(tempfinalAmount).toFixed(3),
    });
  };

  function handleModalClose() {
    // console.log("handle close", callApi);
    setModalOpen(false);
  }

  function handleModalOpen(index) {
    setSelectedIndex(index);
    setModalOpen(true);

    if (formValues[index].DiffrentStock.length > 0) {
      console.log("if");
      setDiffrentStock(formValues[index].DiffrentStock);
    }
  }

  function AddNewRow() {
    let newDiffrentStock = [...DiffrentStock];
    newDiffrentStock.push({
      setStockCodeId: "",
      setPcs: "",
      setWeight: "",
      errors: {
        setStockCodeId: null,
        setPcs: null,
        setWeight: null,
      },
    });

    setDiffrentStock(newDiffrentStock);
  }

  function handleWeightStockChange(index, e) {
    console.log(e);
    let newDiffrentStock = [...DiffrentStock];
    newDiffrentStock[index].setStockCodeId = {
      value: e.value,
      label: e.label,
    };
    newDiffrentStock[index].errors.setStockCodeId = null;
    console.log(newDiffrentStock);

    setDiffrentStock(newDiffrentStock);

    let newFormValues = [...formValues];
    newFormValues[selectedIndex].DiffrentStock = newDiffrentStock;
    newFormValues[selectedIndex].errors.netWeight = null;
    setFormValues(newFormValues);

    console.log(newFormValues);
  }

  function handleStockInputChange(i, e) {
    // console.log("handleStockInputChange");

    let newDiffrentStock = [...DiffrentStock];

    // let nm = e.target.name;
    let val = e.target.value;
    // console.log(nm,val)

    newDiffrentStock[i][e.target.name] = val;
    newDiffrentStock[i].errors[e.target.name] = null;
    setDiffrentStock(newDiffrentStock);
    // console.log(newDiffrentStock);

    let newFormValues = [...formValues];
    newFormValues[selectedIndex].DiffrentStock = newDiffrentStock;
    setFormValues(newFormValues);
  }

  function deleteDiffrentStock(index) {

    let newDiffrentStock = [...DiffrentStock];

    let newFormValues = [...formValues];

    //if only one then reset else remove
    if (newDiffrentStock.length === 1) {
      newDiffrentStock[index] = {
        setStockCodeId: "",
        setPcs: "",
        setWeight: "",
        errors: {
          setStockCodeId: null,
          setPcs: null,
          setWeight: null,
        }
      }
    } else {
      newDiffrentStock.splice(index, 1);

    }
    // console.log(newDiffrentStock);
    setDiffrentStock(newDiffrentStock);

    newFormValues[selectedIndex].DiffrentStock = newDiffrentStock;
    setFormValues(newFormValues);
  }

  const modalValidation = () => {
    let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

    const someEmpty = DiffrentStock.filter(
      (element) => element.setStockCodeId !== ""
    ).some((item) => {
      return (
        item.setPcs === "" ||
        item.setWeight === "" ||
        percentRegex.test(item.setPcs) === false ||
        percentRegex.test(item.setWeight) === false
      );
    });

    console.log(someEmpty);

    if (someEmpty) {
      DiffrentStock.filter((element) => element.setStockCodeId !== "").map(
        (item, index) => {
          const allPrev = [...DiffrentStock];
          // console.log(item);

          let setPcs = DiffrentStock[index].setPcs;
          if (!setPcs || percentRegex.test(setPcs) === false) {
            allPrev[index].errors.setPcs = "Enter Pieces";
          } else {
            allPrev[index].errors.setPcs = null;
          }

          let setWeight = DiffrentStock[index].setWeight;
          if (!setWeight || percentRegex.test(setWeight) === false) {
            allPrev[index].errors.setWeight = "Enter Weight";
          } else {
            allPrev[index].errors.setWeight = null;
          }

          // console.log(allPrev[index]);
          setDiffrentStock(allPrev);
          return true;
        }
      );
    }

    return !someEmpty;
  };

  const checkforUpdate = (evt) => {
    evt.preventDefault();

    if (modalValidation()) {
      formValues
        .filter((element) => element.category !== "")
        .map((item, index) => {
          // const allPrev = [...formValues];
          // allPrev[index].errors.netWeight = null;

          // setUserFormValues(allPrev);
          return (item.errors.netWeight = null);
        });
      console.log("if");
      formValues[selectedIndex].isWeightDiff = 1
      setFormValues(formValues)
      setModalOpen(false);
    } else {
      console.log("else");
    }
  };

  function resetFromOnly() {

    setProductData([]);

    setTagWiseData([]);

    setSubTotal("");

    setTotalGST("");

    setTotal("");
    setAmount("");

    setTotalInvoiceAmount("");

    setFinalAmount("");

    setFileSelected("")
    if (document.getElementById("fileinput") !== null) {
      document.getElementById("fileinput").value = "";
    }

    setPrintObj({
      ...printObj,
      orderDetails: [],
      fine_rate: "",
      taxableAmount: "",
      sGstTot: "",
      cGstTot: "",
      iGstTot: "",
      grossWtTOt: "",
      netWtTOt: "",
      fineWtTot: "",
      totalInvoiceAmt: "",
      balancePayable: "",
    });

    setFormValues([
      {
        manuallLot: "0",
        lotno: "",
        category: "",
        billingCategory: "",
        HSNNum: "",
        pieces: "",
        grossWeight: "",
        netWeight: "",
        isWeightDiff: "",
        DiffrentStock: [
          {
            setStockCodeId: "",
            setPcs: "",
            setWeight: "",
            errors: {
              setStockCodeId: null,
              setPcs: null,
              setWeight: null,
            },
          },
        ],
        purity: "",
        jobworkFinePure: "",
        wastagePer: "",
        wastageFine: "",
        fineRate: "",
        wastageFineamount: "",
        otherTagAmount: "",
        billingLabourRateperGram: "",
        amount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        errors: {
          category: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobworkFinePure: null,
          wastagePer: null,
          wastageFine: null,
          wastageFineamount: null,
          otherTagAmount: null,
          billingLabourRateperGram: null,
          amount: null,
          cgstPer: null,
          cgstVal: null,
          sGstPer: null,
          sGstVal: null,
          IGSTper: null,
          IGSTVal: null,
          total: null,
        },
      },
      {
        manuallLot: "0",
        lotno: "",
        category: "",
        billingCategory: "",
        HSNNum: "",
        pieces: "",
        grossWeight: "",
        netWeight: "",
        isWeightDiff: "",
        DiffrentStock: [
          {
            setStockCodeId: "",
            setPcs: "",
            setWeight: "",
            errors: {
              setStockCodeId: null,
              setPcs: null,
              setWeight: null,
            },
          },
        ],
        purity: "",
        jobworkFinePure: "",
        wastagePer: "",
        wastageFine: "",
        wastageFineamount: "",
        fineRate: "",
        otherTagAmount: "",
        billingLabourRateperGram: "",
        amount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        errors: {
          category: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobworkFinePure: null,
          wastagePer: null,
          wastageFine: null,
          wastageFineamount: null,
          otherTagAmount: null,
          billingLabourRateperGram: null,
          amount: null,
          cgstPer: null,
          cgstVal: null,
          sGstPer: null,
          sGstVal: null,
          IGSTper: null,
          IGSTVal: null,
          total: null,
        },
      },
      {
        manuallLot: "0",
        lotno: "",
        category: "",
        billingCategory: "",
        HSNNum: "",
        pieces: "",
        grossWeight: "",
        netWeight: "",
        isWeightDiff: "",
        DiffrentStock: [
          {
            setStockCodeId: "",
            setPcs: "",
            setWeight: "",
            errors: {
              setStockCodeId: null,
              setPcs: null,
              setWeight: null,
            },
          },
        ],
        purity: "",
        jobworkFinePure: "",
        wastagePer: "",
        wastageFine: "",
        wastageFineamount: "",
        fineRate: "",
        otherTagAmount: "",
        billingLabourRateperGram: "",
        amount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        errors: {
          category: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobworkFinePure: null,
          wastagePer: null,
          wastageFine: null,
          wastageFineamount: null,
          otherTagAmount: null,
          billingLabourRateperGram: null,
          amount: null,
          cgstPer: null,
          cgstVal: null,
          sGstPer: null,
          sGstVal: null,
          IGSTper: null,
          IGSTVal: null,
          total: null,
        },
      },
      {
        manuallLot: "0",
        lotno: "",
        category: "",
        billingCategory: "",
        HSNNum: "",
        pieces: "",
        grossWeight: "",
        netWeight: "",
        isWeightDiff: "",
        DiffrentStock: [
          {
            setStockCodeId: "",
            setPcs: "",
            setWeight: "",
            errors: {
              setStockCodeId: null,
              setPcs: null,
              setWeight: null,
            },
          },
        ],
        purity: "",
        jobworkFinePure: "",
        wastagePer: "",
        wastageFine: "",
        wastageFineamount: "",
        fineRate: "",
        otherTagAmount: "",
        billingLabourRateperGram: "",
        amount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        errors: {
          category: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobworkFinePure: null,
          wastagePer: null,
          wastageFine: null,
          wastageFineamount: null,
          otherTagAmount: null,
          billingLabourRateperGram: null,
          amount: null,
          cgstPer: null,
          cgstVal: null,
          sGstPer: null,
          sGstVal: null,
          IGSTper: null,
          IGSTVal: null,
          total: null,
        },
      },
    ]);
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
    }
    
    else if (name === "fineRate") {
      setFineRate(value);

      const regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
      if (!value || regex.test(value) === false) {
        setFineRateErr("Enter Valid Fine Rate");
        if (selectedLoad === "2" || selectedLoad === "3" || selectedLoad === "4") {
          changeOtherLoadCalculation(0)
        } else {
          resetFromOnly();
        }
      } else {
        setFineRateErr("");
        if (selectedLoad === "2" || selectedLoad === "3" || selectedLoad === "4") {
          changeOtherLoadCalculation(value)
        } else {
          resetFromOnly();
        }
      }
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
    } else if (name === "roundOff") {
      setRoundOff(value);
      if (value > 5 || value < -5) {
        SetRoundOffErr("Please Enter value between -5 to 5");
      } else {
        SetRoundOffErr("");
      }

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

      tempfinalAmount = parseFloat(tempTotalInvoiceAmt).toFixed(3);

      setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));

      setPrintObj({
        ...printObj,
        roundOff: value,
        totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
        balancePayable: parseFloat(tempfinalAmount).toFixed(3),
      })
    }
  }

  const changeOtherLoadCalculation = (fineRateLoc) => {

    let tempFormval = formValues
      // .filter((element) =>
      //   selectedLoad === "3" ? element.lotno !== "" : element.category !== ""
      // )
      .map((item, i) => {

        item.fineRate = parseFloat(fineRateLoc).toFixed(3);

        if (
          item.wastageFine !== "" &&
          item.fineRate !== ""
        ) {
          item.wastageFineamount = parseFloat(
            (parseFloat(item.wastageFine) *
              parseFloat(item.fineRate)) /
            10
          ).toFixed(3);
        }

        if (
          item.wastageFineamount !== "" &&
          item.otherTagAmount !== ""
        ) {
          item.amount = parseFloat(
            parseFloat(item.wastageFineamount) +
            parseFloat(item.otherTagAmount)
          ).toFixed(3);
        }

        if (item.amount !== "" && item.netWeight !== "") {
          item.billingLabourRateperGram = parseFloat(
            parseFloat(item.amount) /
            parseFloat(item.netWeight)
          ).toFixed(3);
        }

        if (stateId === 12) {
          // console.log("vendorStateId cond")
          if (item.amount !== "" && item.cgstPer !== "") {
            // console.log("if COnd")
            item.cgstVal = parseFloat(
              (parseFloat(item.amount) * parseFloat(jobWorkerGst / 2)) /
              100
            ).toFixed(3);


            item.sGstVal = parseFloat(
              (parseFloat(item.amount) * parseFloat(jobWorkerGst / 2)) /
              100
            ).toFixed(3);
            item.total = parseFloat(
              parseFloat(item.amount) +
              parseFloat(item.sGstVal) +
              parseFloat(item.cgstVal)
            ).toFixed(3);

          } else {
            item.cgstVal = "";
            item.sGstVal = "";
            item.total = "";
          }
        } else {
          if (item.amount !== "" && item.IGSTper !== "") {
            item.IGSTVal = parseFloat(
              (parseFloat(item.amount) * parseFloat(jobWorkerGst)) / 100
            ).toFixed(3);
            item.total = parseFloat(
              parseFloat(item.amount) +
              parseFloat(item.IGSTVal)
            ).toFixed(3);
          } else {
            item.IGSTVal = "";
            item.total = "";
          }
        }
        return item;
      })


    function amount(item) {
      // console.log(item.amount)
      return item.amount;
    }

    function CGSTval(item) {
      return item.cgstVal;
    }

    function SGSTval(item) {
      return item.sGstVal;
    }

    function IGSTVal(item) {
      return item.IGSTVal;
    }

    function Total(item) {
      return item.total;
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
    // setTotalAmount("");
    let tempAmount = tempFormval
      .filter((item) => item.amount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    //.reduce(sum);
    // console.log("tempAmount",tempAmount)
    setAmount(parseFloat(tempAmount).toFixed(3));
    // setTotalAmount(parseFloat(tempAmount).toFixed(3));
    setSubTotal(parseFloat(tempAmount).toFixed(3));

    let tempCgstVal = 0;
    let tempSgstVal = 0;
    let tempIgstVal = 0;

    if (stateId === 12) {
      // setCgstVal("");
      // setSgstVal("");
      tempCgstVal = tempFormval
        .filter((item) => item.cgstVal !== "")
        .map(CGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
      setCgstVal(parseFloat(tempCgstVal).toFixed(3));

      tempSgstVal = tempFormval
        .filter((item) => item.sGstVal !== "")
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
      // setIgstVal("");
      // setTotalGST("")

      tempIgstVal = tempFormval
        .filter((item) => item.IGSTVal !== "")
        .map(IGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setIgstVal(parseFloat(tempIgstVal).toFixed(3));
      setTotalGST(parseFloat(tempIgstVal).toFixed(3));
    }

    let tempTotal = tempFormval
      .filter((item) => item.total !== "")
      .map(Total)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotal(parseFloat(tempTotal).toFixed(3));

    let tempGrossWtTot = parseFloat(tempFormval
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3)

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

    let tempNetWtTot = parseFloat(tempFormval
      .filter((data) => data.netWeight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3)

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

    function fine(item) {
      return parseFloat(item.totalFine);
    }

    let tempFineGold = tempFormval
      .filter((item) => item.totalFine !== "")
      .map(fine)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

    // setShortageRfix(tempFineGold);
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

      tempfinalAmount = parseFloat(tempTotalInvoiceAmt).toFixed(3);

      setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));
    } else {
      setTotalInvoiceAmount(0);
      // setLegderAmount(0);
    }

    setFormValues(tempFormval);

    setPrintObj({
      ...printObj,
      orderDetails: tempFormval,
      fine_rate: fineRate,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      sGstTot: stateId === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
      cGstTot: stateId === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
      iGstTot: stateId !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      // fineWtTot: HelperFunc.getTotalOfField(newTempProductData, "totalFine"),
      totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
      balancePayable: parseFloat(tempfinalAmount).toFixed(3),
    });
  }

  const prevIsValid = () => {
    if (formValues.length === 0) {
      return true;
    }

    let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

    function setWeight(row) {
      return parseFloat(row.setWeight);
    }

    const someEmpty = formValues
      .filter((element) =>
        selectedLoad === "4" ? element.lotno !== "" : element.category !== ""
      )
      .some((item) => {
        if (selectedLoad === "4") {
          if (
            parseFloat(item.grossWeight) !== parseFloat(item.netWeight) &&
            item.isWeightDiff === 0
          ) {
            //not same
            return (
              item.billingCategory === "" ||
              item.grossWeight === "" || item.grossWeight == 0 ||
              item.lotno === "" ||
              item.purity === "" ||
              item.pieces === "" ||
              isNaN(item.pieces) ||
              item.wastagePer === "" ||
              item.otherTagAmount === "" ||
              percentRegex.test(item.wastagePer) === false ||
              percentRegex.test(item.purity) === false ||
              item.netWeight === "" || item.netWeight == 0 
              //  ||
              // parseFloat(item.grossWeight).toFixed(3) !==
              // parseFloat(parseFloat(item.netWeight) +
              //   parseFloat(item.DiffrentStock.filter((data) => data.setWeight !== "")
              //     .map(setWeight)
              //     .reduce(function (a, b) {
              //       // sum all resulting numbers
              //       return parseFloat(a) + parseFloat(b);
              //     }, 0))).toFixed(3)
            );
          } else {
            return (
              item.billingCategory === "" ||
              item.grossWeight === "" || item.grossWeight == 0 ||
              item.lotno === "" ||
              item.purity === "" ||
              item.pieces === "" ||
              isNaN(item.pieces) ||
              percentRegex.test(item.purity) === false ||
              item.netWeight === "" || item.netWeight == 0 ||
              parseFloat(item.netWeight) > parseFloat(item.grossWeight)
            );
          }
        } else {
          if (
            parseFloat(item.grossWeight) !== parseFloat(item.netWeight) &&
            item.isWeightDiff === 0
          ) {
            //not same
            return (
              item.category === "" ||
              item.grossWeight === "" || item.grossWeight == 0 ||
              item.netWeight === "" || item.netWeight == 0 ||
              item.wastagePer === "" ||
              item.otherTagAmount === "" ||
              (item.category.pcs_require === 1 && (item.pieces === "" || isNaN(item.pieces))) ||
              percentRegex.test(item.wastagePer) === false ||
              parseFloat(item.grossWeight).toFixed(3) !==
              parseFloat(parseFloat(item.netWeight) +
                parseFloat(item.DiffrentStock.filter((data) => data.setWeight !== "")
                  .map(setWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0))).toFixed(3)
            );
          } else {
            return (
              item.category === "" ||
              item.grossWeight === "" || item.grossWeight == 0 ||
              item.netWeight === "" || item.netWeight == 0 ||
              item.wastagePer === "" ||
              (item.category.pcs_require === 1 && (item.pieces === "" || isNaN(item.pieces))) ||
              item.otherTagAmount === "" ||
              percentRegex.test(item.wastagePer) === false
            );
          }
        }
      });

    console.log(someEmpty);

    if (someEmpty) {
      formValues
        .filter((element) =>
          selectedLoad === "4" ? element.lotno !== "" : element.category !== ""
        )
        .map((item, index) => {
          const allPrev = [...formValues];
          // console.log(item);

          if (selectedLoad === "4") {
            let lotNo = formValues[index].lotno;
            if (lotNo === "") {
              allPrev[index].errors.lotno = "Please Enter Valid Lot No";
            } else {
              allPrev[index].errors.lotno = null;
            }

            let purity = formValues[index].purity;
            if (!purity || percentRegex.test(purity) === false) {
              allPrev[index].errors.purity = "Please Insert Valid Purity";
            } else {
              allPrev[index].errors.purity = null;
            }
          } else {
            let category = formValues[index].category;
            if (category === "") {
              allPrev[index].errors.category = "Please Select Stock Code";
            } else {
              allPrev[index].errors.category = null;
            }

            let pcsTotal = formValues[index].pieces;
            console.log("stock", category)
            if (category.pcs_require === 1) {
              if (pcsTotal === "" || pcsTotal === null || pcsTotal === undefined || isNaN(pcsTotal)) {
                allPrev[index].errors.pieces = "Enter Pieces";
              } else {
                allPrev[index].errors.pieces = null;
              }
            }
          }

          let billingCategory = formValues[index].billingCategory;
          if (billingCategory === "") {
            allPrev[index].errors.billingCategory =
              "Please Select Valid Category";
          } else {
            allPrev[index].errors.billingCategory = null;
          }

          let weightRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
          let gWeight = formValues[index].grossWeight;
          if (!gWeight || weightRegex.test(gWeight) === false || gWeight == 0) {
            allPrev[index].errors.grossWeight = "Enter Gross Weight!";
          } else {
            allPrev[index].errors.grossWeight = null;
          }

          let netWeight = formValues[index].netWeight;
          if (!netWeight || weightRegex.test(netWeight) === false || netWeight == 0) {
            allPrev[index].errors.netWeight = "Enter Net Weight!";
          } else {
            allPrev[index].errors.netWeight = null;
          }

          if(netWeight == 0){
            allPrev[index].errors.netWeight = "Enter Net Weight!";
          }else{
            if (parseFloat(netWeight) > parseFloat(gWeight)) {
              allPrev[index].errors.netWeight =
                "Net Weight Can not be Greater than Gross Weight";
            } else {
              allPrev[index].errors.netWeight = null;
            }
          }

          let otherTagAmount = formValues[index].otherTagAmount;
          if (!otherTagAmount || weightRegex.test(otherTagAmount) === false) {
            allPrev[index].errors.otherTagAmount =
              "Please Enter Other Tag Amount";
          } else {
            allPrev[index].errors.otherTagAmount = null;
          }

          if (netWeight !== "") {
            if (
              parseFloat(gWeight) !== parseFloat(netWeight) &&
              formValues[index].setStockCodeId === ""
            ) {
              allPrev[index].errors.netWeight = "Please Add remainning weight";
            } else {
              allPrev[index].errors.netWeight = null;
            }
          }

          if (item.isWeightDiff === 0) {
            let tempSetWeight = item.DiffrentStock.filter(
              (data) => data.setWeight !== ""
            )
              .map(setWeight)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);

            console.log("grossWeight", item.grossWeight);
            console.log("netWeight", item.netWeight);
            console.log("tempSetWeight", tempSetWeight);
            // console.log(parseFloat(item.grossWeight).toFixed(3))
            // console.log(parseFloat(parseFloat(item.netWeight) + parseFloat(tempSetWeight)).toFixed(3))

            if (selectedLoad !== 4) {
              if (
                parseFloat(item.grossWeight).toFixed(3) !==
                parseFloat(parseFloat(item.netWeight) + parseFloat(tempSetWeight)).toFixed(3)
              ) {
                console.log("err");
                allPrev[index].errors.netWeight = "Weight Doesn't match";
              } else {
                console.log("else");

                allPrev[index].errors.netWeight = null;
              }
            }


          }

          // item.wastagePer === "" ||
          //   percentRegex.test(item.wastagePer) === false ||
          let wastagePer = formValues[index].wastagePer;
          if (!wastagePer || percentRegex.test(wastagePer) === false) {
            allPrev[index].errors.wastagePer = "Enter Wastage!";
          } else {
            allPrev[index].errors.wastagePer = null;
          }

          console.log(allPrev[index]);
          setFormValues(allPrev);
          return null;
        });
    }

    return !someEmpty;
  };

  function addUserInputApi(resetFlag, toBePrint) {
    let Orders = formValues
      .filter((element) =>
        selectedLoad === "4" ? element.lotno !== "" : element.category !== ""
      )
      .map((x) => {
        if (selectedLoad === "4") {
          if (parseFloat(x.grossWeight) !== parseFloat(x.netWeight)) {
            return {
              lot_id: x.lotno.value,
              other_tag_amount: x.otherTagAmount,
              // setStockCodeArray: x.DiffrentStock.map((y) => {
              //   return {
              //     setStockCodeId: y.setStockCodeId.value,
              //     setPcs: y.setPcs,
              //     setWeight: y.setWeight,
              //   };
              // }),
              // hallmark_charges: x.hallmarkCharges,
              Wastage_percentage: x.wastagePer,
            };
          } else {
            return {
              lot_id: x.lotno.value,
              other_tag_amount: x.otherTagAmount,
              // hallmark_charges: x.hallmarkCharges,
              Wastage_percentage: x.wastagePer,
            };
          }
        } else {
          if (parseFloat(x.grossWeight) !== parseFloat(x.netWeight)) {
            return {
              // category_name: x.categoryName,
              stock_name_code_id: x.category.value,
              gross_weight: x.grossWeight,
              net_weight: x.netWeight,
              // setStockCodeId: x.setStockCodeId.value,
              ...(x.pieces !== "" && {
                pcs: x.pieces, //user input
              }),
              setStockCodeArray: x.DiffrentStock.map((y) => {
                return {
                  setStockCodeId: y.setStockCodeId.value,
                  setPcs: y.setPcs,
                  setWeight: y.setWeight,
                };
              }),
              // hallmark_charges: x.hallmarkCharges,
              other_tag_amount: x.otherTagAmount,
              // setPcs: x.setPcs, //if Diffrent net weight is less than gross
              // setWeight: x.setWeight,
              Wastage_percentage: x.wastagePer,
            };
          } else {
            return {
              stock_name_code_id: x.category.value,
              gross_weight: x.grossWeight,
              net_weight: x.netWeight,
              Wastage_percentage: x.wastagePer,
              // hallmark_charges: x.hallmarkCharges,
              other_tag_amount: x.otherTagAmount,
              ...(x.pieces !== "" && {
                pcs: x.pieces, //user input
              }),
            };
          }
        }
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
      client_id: selectedVendorClient.value === 1 ? null : selectedClient.value,
      client_company_id: selectedVendorClient.value === 1 ? selectedVendor.value : selectedCompany.value,
      is_vendor_client: selectedVendorClient.value === 1 ? 1 : 2,
      fine_rate: fineRate,
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      round_off: roundOff === "" ? 0 : roundOff,
      jewellery_narration: jewelNarration,
      account_narration: accNarration,
      is_lot: selectedLoad === "4" ? 1 : 0,
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      Orders: Orders,
      uploadDocIds: docIds,
      party_voucher_date:partyVoucherDate,
      flag: selectedLoad
    }
    console.log(body);
    axios
      .post(Config.getCommonUrl() + "api/salesJobworkReturn", body)
      .then(function (response) {
        console.log(response);
        setLoading(false);

        if (response.data.success === true) {
          // console.log(response);
          // setIsCsvErr(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.goBack();
          // setSelectedLoad("");
          // setSelectedClient("");
          // setSelectedCompany("");
          // // setShipping("");
          // reset();

          if (resetFlag === true) {
            checkAndReset()
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record 
            handlePrint();
          }

        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);

        handleError(error, dispatch, { api: "api/salesJobworkReturn", body: body })

      });
  }

  function handleFile(e) {
    e.preventDefault();
    console.log("handleFile");
    var files = e.target.files,
      f = files[0];
    uploadfileapicall(f);
    setFileSelected(f);
  }

  function uploadfileapicall(f) {
    const formData = new FormData();
    formData.append("file", f);
    formData.append("voucher_no", voucherNumber);
    formData.append("party_voucher_no", partyVoucherNum);
    formData.append("opposite_account_id", oppositeAccSelected.value);
    formData.append("flag", selectedLoad);
    formData.append(
      "department_id",
      window.localStorage.getItem("SelectedDepartment")
    );
    formData.append("client_id", selectedVendorClient.value === 1 ? null : selectedClient.value);
    formData.append("client_company_id", selectedVendorClient.value === 1 ? selectedVendor.value : selectedCompany.value);
    formData.append("is_vendor_client", selectedVendorClient.value === 1 ? 1 : 2);
    formData.append("fine_rate", fineRate);

    formData.append("round_off", roundOff === "" ? 0 : roundOff);
    formData.append("jewellery_narration", jewelNarration);
    formData.append("account_narration", accNarration);
    formData.append("uploadDocIds", JSON.stringify(docIds))
    formData.append("party_voucher_date", partyVoucherDate)
    

    // formData.append("is_shipped", parseInt(shipping));

    // if (shipping === "1") {
    //   formData.append("shipping_client_id", shippingClient.value);
    //   formData.append("shipping_client_company_id", shipClientComp.value);
    // }
    // console.log(JSON.stringify(rates))
    if (allowedBackDate) {
      formData.append("purchaseCreateDate", voucherDate);
    }

    console.log(...formData);
    setLoading(true);
    axios
      .post(
        Config.getCommonUrl() + "api/salesJobworkReturn/createfromexcel",
        formData
      )
      .then(function (response) {
        console.log(response);
        setLoading(false);
        if (response.data.success === true) {
          console.log(response);
          setIsCsvErr(false);
          var data = response.data.data;

          const newTempProductData = data.map((item) => {
            let cgstPer =
              stateId === 12
                ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
                : "";

            let sGstPer =
              stateId === 12
                ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
                : "";

            let IGSTper =
              stateId !== 12 ? parseFloat(jobWorkerGst).toFixed(3) : "";

            return {
              // ...item, diffrent keys from api so not coping
              category_name: item.category_name,
              billing_category_name: item.billing_category_name,
              pcs: item.pcs,
              gross_wgt: parseFloat(item.gross_wt).toFixed(3),
              net_wgt: parseFloat(item.net_wt).toFixed(3),
              purity: item.purity,
              karat: item.karat,
              wastage: parseFloat(item.wastage_per).toFixed(3),
              wastageFine: parseFloat(item.wastage_fine).toFixed(3),
              wastageFineAmount: parseFloat(item.wastage_fine_amount).toFixed(3),
              labourRate: parseFloat(item.billing_labour_rate_per_gram).toFixed(3),
              other_amt: parseFloat(item.other_tag_amount).toFixed(3),
              totalFine: item.total_fine,
              totalAmount: parseFloat(item.total_amount).toFixed(3),
              cgstPer: cgstPer,
              cgstVal:
                stateId === 12
                  ? parseFloat(
                    (parseFloat(item.total_amount) * parseFloat(cgstPer)) /
                    100
                  ).toFixed(3)
                  : "",
              sGstPer: sGstPer,
              sGstVal:
                stateId === 12
                  ? parseFloat(
                    (parseFloat(item.total_amount) * parseFloat(sGstPer)) /
                    100
                  ).toFixed(3)
                  : "",
              IGSTper: IGSTper,
              IGSTVal:
                stateId !== 12
                  ? parseFloat(
                    (parseFloat(item.total_amount) * parseFloat(IGSTper)) /
                    100
                  ).toFixed(3)
                  : "",
            };
          });

          let temp = [...productData, ...newTempProductData];
          // console.log(temp)

          // let tempFineGold = temp
          //   .filter((item) => item.totalFine !== "")
          //   .map(fineGold)
          //   .reduce(function (a, b) {
          //     // sum all resulting numbers
          //     return parseFloat(a) + parseFloat(b);
          //   }, 0);

          // setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
          // console.log("tempFineGold", tempFineGold);

          setProductData((productData) => [
            ...productData,
            ...newTempProductData,
          ]);

          const tempTagWise = data.map((item) => {
            return {
              // ...item,
              barcode: item.barcode,
              packet_no: item.packetNo,
              billing_category_name: item.billing_category_name,
              pcs: item.pcs,
              gross_wgt: parseFloat(item.gross_wt).toFixed(3),
              net_wgt: parseFloat(item.net_wt).toFixed(3),
              purity: item.purity,
              variant_number:item.design_variant_number,
              wastage: parseFloat(item.wastage_per).toFixed(3),
              wastageFine: parseFloat(item.wastage_fine).toFixed(3),
              wastageFineAmount: parseFloat(item.wastage_fine_amount).toFixed(3),
              labourRate: parseFloat(item.billing_labour_rate_per_gram).toFixed(3),
              other_amt: parseFloat(item.other_tag_amount).toFixed(3),
              totalFine: parseFloat(item.total_fine).toFixed(3),
              hallmark_charges: parseFloat(item.hallmark_charges).toFixed(3),
              totalAmount: parseFloat(item.total_amount).toFixed(3),
            };
          });

          setTagWiseData((tagWiseData) => [...tagWiseData, ...tempTagWise]);

          function amount(item) {
            // console.log(item.amount)
            return item.totalAmount;
          }

          function CGSTval(item) {
            return item.cgstVal;
          }

          function SGSTval(item) {
            return item.sGstVal;
          }

          function IGSTVal(item) {
            return item.IGSTVal;
          }

          let tempAmount = newTempProductData
            .filter((item) => item.totalAmount !== "")
            .map(amount)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setSubTotal(parseFloat(tempAmount).toFixed(3));

          //tempTotal is amount + gst
          let tempTotal = 0;
          let tempCgstVal = 0;
          let tempSgstVal = 0;
          let tempIgstVal = 0;

          if (stateId === 12) {
            tempCgstVal = newTempProductData
              .filter((item) => item.cgstVal !== "")
              .map(CGSTval)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);

            tempSgstVal = newTempProductData
              .filter((item) => item.sGstVal !== "")
              .map(SGSTval)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);

            setTotalGST(
              parseFloat(parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
            );
            tempTotal = parseFloat(
              parseFloat(tempAmount) + parseFloat(tempCgstVal) + parseFloat(tempSgstVal)
            ).toFixed(3);
          } else {
            tempIgstVal = newTempProductData
              .filter((item) => item.IGSTVal !== "")
              .map(IGSTVal)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);
            // setIgstVal(parseFloat(tempIgstVal).toFixed(3));
            setTotalGST(parseFloat(tempIgstVal).toFixed(3));
            tempTotal = parseFloat(
              parseFloat(tempAmount) + parseFloat(tempIgstVal)
            ).toFixed(3);
          }

          setTotal(parseFloat(tempTotal).toFixed(3));
          setAmount(parseFloat(tempAmount).toFixed(3));

          if (parseFloat(tempTotal) > 0) {

            let tempfinalAmount = 0;
            let tempTotalInvoiceAmt = 0;
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

            tempfinalAmount = parseFloat(tempTotalInvoiceAmt).toFixed(3);

            setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));

            setPrintObj({
              ...printObj,
              orderDetails: temp,
              fine_rate: fineRate,
              taxableAmount: parseFloat(tempAmount).toFixed(3),
              sGstTot: stateId === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
              cGstTot: stateId === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
              iGstTot: stateId !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
              grossWtTOt: HelperFunc.getTotalOfField(newTempProductData, "gross_wgt"),
              netWtTOt: HelperFunc.getTotalOfField(newTempProductData, "net_wgt"),
              fineWtTot: HelperFunc.getTotalOfField(newTempProductData, "totalFine"),
              totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
              balancePayable: parseFloat(tempfinalAmount).toFixed(3),
            });
          } else {
            setTotalInvoiceAmount(0);

          }
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
            document.getElementById("fileinput").value = "";
            setIsCsvErr(true);
          }
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);
        document.getElementById("fileinput").value = "";
        handleError(error, dispatch, {
          api: Config.getCommonUrl() + "api/salesJobworkReturn/createfromexcel",
          body: JSON.stringify(formData)
        })

      });
  }

  function postWithExcel(resetFlag, toBePrint) {
    // let rates = balRfixViewData
    //   .filter((element) => parseFloat(element.usedWeight) > 0)
    //   .map((item) => {
    //     return {
    //       id: item.id,
    //       weightToBeUtilized: item.usedWeight,
    //     };
    //   });

    const formData = new FormData();
    formData.append("file", fileSelected);
    formData.append("voucher_no", voucherNumber);
    formData.append("party_voucher_no", partyVoucherNum);
    formData.append("opposite_account_id", oppositeAccSelected.value);
    formData.append("flag", selectedLoad);
    formData.append(
      "department_id",
      window.localStorage.getItem("SelectedDepartment")
    );
    formData.append("client_id", selectedVendorClient.value === 1 ? null : selectedClient.value);
    formData.append("client_company_id", selectedVendorClient.value === 1 ? selectedVendor.value : selectedCompany.value);
    formData.append("is_vendor_client", selectedVendorClient.value === 1 ? 1 : 2);
    // formData.append("setRate", tempRate);

    formData.append("round_off", roundOff === "" ? 0 : roundOff);
    formData.append("jewellery_narration", jewelNarration);
    formData.append("account_narration", accNarration);

    // let temp = JSON.stringify(rates);
    // if (rates.length > 0) {
    //   formData.append("rates", temp);
    // }

    // if (tempRate !== "") {
    formData.append("fine_rate", fineRate);
    // }

    formData.append("uploadDocIds", JSON.stringify(docIds))
    formData.append("party_voucher_date", partyVoucherDate)
    // formData.append("is_shipped", parseInt(shipping));

    // if (shipping === "1") {
    //   formData.append("shipping_client_id", shippingClient.value);
    //   formData.append("shipping_client_company_id", shipClientComp.value);
    // }
    // console.log(JSON.stringify(rates))
    if (allowedBackDate) {
      formData.append("purchaseCreateDate", voucherDate);
    }

    console.log(...formData);
    setLoading(true);
    axios
      .post(
        Config.getCommonUrl() + "api/salesJobworkReturn/createfromexcel?save=1",
        formData
      )
      .then(function (response) {
        console.log(response);
        setLoading(false);
        if (response.data.success === true) {
          // console.log(response);
          setIsCsvErr(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.goBack();

          // setSelectedLoad("");
          // setSelectedClient("");
          // setSelectedCompany("");
          // // setShipping("");
          // // setPackingSlipData([]); //packing slip wise
          // // setPacketData([]); //packet wise Data
          // setProductData([]); //category wise Data
          // // setBillmaterialData([]); //bill of material Data
          // setTagWiseData([]);
          // reset();

          if (resetFlag === true) {
            checkAndReset()
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record 
            handlePrint();
          }
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
            document.getElementById("fileinput").value = "";
            setIsCsvErr(true);
          }
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);
        document.getElementById("fileinput").value = "";
        handleError(error, dispatch, {
          api: "api/salesJobworkReturn/createfromexcel?save=1",
          body: JSON.stringify(formData)
        })

      });
  }

  function deleteRow(index) {
    console.log(index)
    let newFormValues = [...formValues];

    newFormValues[index].manuallLot = ""
    newFormValues[index].lotno = ""
    newFormValues[index].category = ""
    newFormValues[index].billingCategory = ""
    newFormValues[index].HSNNum = ""
    newFormValues[index].pieces = ""
    newFormValues[index].grossWeight = ""
    newFormValues[index].netWeight = ""
    newFormValues[index].isWeightDiff = ""
    newFormValues[index].DiffrentStock = [
      {
        setStockCodeId: "",
        setPcs: "",
        setWeight: "",
        errors: {
          setStockCodeId: null,
          setPcs: null,
          setWeight: null,
        },
      },
    ];
    newFormValues[index].purity = ""
    newFormValues[index].jobworkFinePure = ""
    newFormValues[index].wastagePer = ""
    newFormValues[index].wastageFine = ""
    newFormValues[index].fineRate = ""
    newFormValues[index].wastageFineamount = ""
    newFormValues[index].otherTagAmount = ""
    newFormValues[index].billingLabourRateperGram = ""
    newFormValues[index].amount = ""
    newFormValues[index].cgstPer = ""
    newFormValues[index].cgstVal = ""
    newFormValues[index].sGstPer = ""
    newFormValues[index].sGstVal = ""
    newFormValues[index].IGSTper = ""
    newFormValues[index].IGSTVal = ""
    newFormValues[index].total = ""
    newFormValues[index].errors = {
      category: null,
      billingCategory: null,
      pieces: null,
      grossWeight: null,
      netWeight: null,
      purity: null,
      jobworkFinePure: null,
      wastagePer: null,
      wastageFine: null,
      wastageFineamount: null,
      otherTagAmount: null,
      billingLabourRateperGram: null,
      amount: null,
      cgstPer: null,
      cgstVal: null,
      sGstPer: null,
      sGstVal: null,
      IGSTper: null,
      IGSTVal: null,
      total: null,
    }
    changeTotal(newFormValues, false)
  }

  const vendorClientArr = [
    { id: 1, name: "Vendor" },
    { id: 2, name: "Client" }
  ];

  const handleVendorClientChange = (value) => {
    if (loadTypeValidation()) {
      reset()
      setVendorClient(value)
      setSelectedVendor("");
      setSelectedVendorErr("");
      setSelectedClient("");
      setSelectClientErr("");
      setSelectedCompany("");
      setSelectedCompErr("");
      setPrintObj({
        ...printObj,
        stateId: "",
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
        jewelNarration: "",
        accNarration: "",
        balancePayable: "",
      })
    }
  }

  function handlePartyChange(value) {
    if (loadTypeValidation()) {
      setTotalInvoiceAmount(0);
      setSelectedVendor(value);
      setSelectedVendorErr("")
      setSelectedClient("");
      setSelectClientErr("");
      setSelectedCompany("");
      setTagWiseData([]);
      setProductData([]); //category wise Data
      reset();

      const index = vendorData.findIndex((element) => element.id === value.value);
      console.log(index);

      if (index > -1) {
        console.log(vendorData[index])
        setFirmName(vendorData[index].firm_name);
        setFirmNameErr("")
        setStateId(vendorData[index].state_name.id);

        setPrintObj({
          ...printObj,
          stateId: vendorData[index].state_name.id,
          supplierName: vendorData[index].firm_name,
          supAddress: vendorData[index].address,
          supplierGstUinNum: vendorData[index].gst_number,
          supPanNum: vendorData[index].pan_number,
          supState: vendorData[index].state_name.name,
          supCountry: vendorData[index].country_name.name,
          supStateCode: (vendorData[index].gst_number) ? vendorData[index].gst_number.substring(0, 2) : '',
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
          jewelNarration: "",
          accNarration: "",
          balancePayable: ""
        })
      }
    }
  }

  const handleDocModalClose = () => {
    // console.log("handleDocModalClose")
    setDocModal(false)
  }
  // console.log(viewState, 'viewState')
  const handleNarrationClick = () => {
    console.log("handleNarr", narrationFlag)
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        "flag": 8,
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
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            {!props.viewPopup && (
              <Grid
                className="department-main-dv"
                container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0 }}
              >
                <Grid item xs={7} sm={7} md={7} key="1" style={{ padding: 0 }}>
                  <FuseAnimate delay={300}>
                    {/* <Typography className="p-16 pb-8 text-18 font-700"> */}
                    <Typography className="pl-28 pt-16 text-18 font-700">
                      {isView
                        ? "View Sales Return Voucher (Jobwork)"
                        : "Add Sales Return Voucher (Jobwork)"}
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
                    {" "}
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
            {loading && <Loader />}
            <div className="main-div-alll ">
              <div
                // className="pb-32 pt-32 pl-16 pr-16  salesdomestic-work-pt"
                className="pb-32 pt-16 salesdomestic-work-pt"
                style={{ marginBottom: "10%" }}
              >
                <Grid container spacing={3}>
                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4 ">Select Load type</p>
                    <select
                      className={clsx(classes.normalSelect, "focusClass")}
                      required
                      value={selectedLoad}
                      onChange={(e) => handleLoadChange(e)}
                      disabled={isView}
                      ref={loadTypeRef}
                    >
                      <option hidden value="">
                        Select Load type*
                      </option>
                      <option value="0">Load Excel with Reference</option>
                      <option value="1">
                        Load Excel File without reference
                      </option>
                      <option value="2">Load Metal Varient</option>
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
                      <p className="popup-labl p-4 ">Date</p>
                      <TextField
                        // label="Date"
                        type="date"
                        className=""
                        name="voucherDate"
                        value={voucherDate}
                        error={VoucherDtErr.length > 0 ? true : false}
                        helperText={VoucherDtErr}
                        onChange={(e) => handleInputChange(e)}
                        onKeyDown={(e => e.preventDefault())}
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
                        onBlur={handleDateBlur}
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
                    <p className="popup-labl p-4 ">Invoice Number</p>
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
                    sm={4}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4 ">Vendor / Client</p>
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
                        <p className="popup-labl p-4 ">Party Name</p>
                        <Select
                          id="view_jewellary_dv"
                          filterOption={createFilter({ ignoreAccents: false })}
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
                        <p className="popup-labl p-4 ">Firm Name</p>
                        <TextField
                          className=""
                          placeholder="Firm Name"
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
                        <p className="popup-labl p-4 ">Select Party</p>
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
                          onChange={handleClientPartyChange}
                          placeholder="Select Party"
                          isDisabled={isView}
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
                        <p className="popup-labl p-4 ">Select Firm</p>
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
                        />

                        <span style={{ color: "red" }}>
                          {selectedCompErr.length > 0 ? selectedCompErr : ""}
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
                    <p className="popup-labl p-4 ">Opposite Account</p>
                    <Select
                      id="view_jewellary_dv"
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      options={oppositeAccData}
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
                      {selectedOppAccErr.length > 0 ? selectedOppAccErr : ""}
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
                    <p className="popup-labl p-4 ">Party Voucher Number</p>
                    <TextField
                      className=""
                      placeholder="Party Voucher Number"
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
                    <p className="popup-labl p-4 ">Party voucher date</p>
                    <TextField
                     placeholder="Party voucher date"
                      type="date"
                      className="mb-16"
                      name="partyVoucherDate"
                      value={partyVoucherDate}
                      onChange={(e) => setPartyVoucherDate(e.target.value)}
                      onKeyDown={(e => e.preventDefault())}
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
                      <p className="popup-labl p-4 ">Upload Document</p>
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

                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p className="popup-labl p-4 ">Fine Rate</p>
                    <TextField
                      className=""
                      placeholder="Fine Rate"
                      name="fineRate"
                      value={fineRate}
                      error={fineRateErr.length > 0 ? true : false}
                      helperText={fineRateErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled={isView}
                      // onKeyDown={handleTabChange}
                    />
                  </Grid>

                  {/* <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 6 }}>
                  <select
                    className={classes.normalSelect}
                    required
                    value={shipping}
                    onChange={(e) => handleShippingChange(e)}
                  >
                    <option hidden value="">
                      Shipping
                    </option>
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>

                  <span style={{ color: "red" }}>
                    {shippingErr.length > 0 ? shippingErr : ""}
                  </span>
                </Grid> */}

                  {/* {shipping === "1" && (
                  <>
                    <Grid
                      item
                      lg={2}
                      md={4}
                      sm={4}
                      xs={12}
                      style={{ padding: 6 }}
                    >
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
                        value={shippingClient}
                        onChange={handleShipClientSelect}
                        placeholder="Shipping Party Name"
                      />

                      <span style={{ color: "red" }}>
                        {shipClientErr.length > 0 ? shipClientErr : ""}
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
                      <Select
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        classes={classes}
                        styles={selectStyles}
                        options={shipclientCompData
                          // .filter((item) => item.id !== selectedVendor.value)
                          .map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.company_name,
                          }))}
                        // components={components}
                        value={shipClientComp}
                        onChange={handleShipCompanyChange}
                        placeholder="Shipping Party Company"
                      />

                      <span style={{ color: "red" }}>
                        {shipCompErr.length > 0 ? shipCompErr : ""}
                      </span>
                    </Grid>
                  </>
                )} */}

                  {(selectedLoad === "0" || selectedLoad === "1") && (
                    <>
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6, marginTop: 26 }}
                      >
                        <Button
                          // id="upload-btn-jewellery"
                          variant="contained"
                          // color="primary"
                          className="w-224 mx-auto uplod-a-file"
                          aria-label="Register"
                          disabled={isView}
                          onClick={handleClick}
                          style={{ width: "100%" }}
                        >
                          Upload Excel File
                        </Button>

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
                    </>
                  )}

                  {isCsvErr === true && (
                    <Grid item xs={4} style={{ padding: 6, color: "red" }}>
                      Your File Has Error Please Correct it, Download from{" "}
                      <a href={csvData}>Here</a>
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
                </Grid>

                {(selectedLoad === "2" ||
                  selectedLoad === "3" ||
                  selectedLoad === "4") && (
                  <div className="addsalestable-blg-dv">
                    <div className="inner-addsalestabel-blg">
                      <div
                        className="mt-16 jewellery-artician-tbl sales_return_voucherjobwork_dv addsalesjobpurchase-tabel-main  addsalesjob-tabel-main addsales-domestic-dv"
                        style={{
                          border: "1px solid #D1D8F5",
                          borderRadius: "7px",
                          paddingBottom: 5,
                        }}
                      >
                        <div
                          id="jewellery-artician-head"
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
                            Category (Packet)
                          </div>
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
                            Wastage (%)
                          </div>

                          <div className={clsx(classes.tableheader, "")}>
                            Wastage Fine
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Wastage Fine Amount
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Other Tag Amount
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Billing Labour Rate per Gram
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Total Amount
                          </div>
                          {!isView && stateId === 12 && (
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

                          {!isView && stateId !== 12 && (
                            <>
                              <div className={clsx(classes.tableheader, "")}>
                                IGST (%)
                              </div>
                              <div className={clsx(classes.tableheader, "")}>
                                IGST
                              </div>
                            </>
                          )}

                          {isView && viewState === null && (
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

                          {isView && viewState !== null && (
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
                            total
                          </div>
                        </div>

                        {formValues.map((element, index) => (
                          <div
                            id="jewellery-artician-head"
                            key={index}
                            className="all-purchase-tabs"
                            // className=""
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
                                  {/* <Icon className="" style={{ color: "red" }}>
                                    delete
                                  </Icon> */}
                                  <Icon className="mr-8 delete-icone">
                                    <img src={Icones.delete_red} alt="" />
                                  </Icon>
                                </IconButton>
                              </div>
                            )}
                            {selectedLoad === "4" && (
                              <Autocomplete
                                id="free-solo-demo"
                                freeSolo
                                disableClearable
                                onChange={(event, newValue) => {
                                  // setValue(newValue);
                                  if (!isView)
                                    handleLotNumChange(index, newValue);
                                }}
                                onInputChange={(event, newInputValue) => {
                                  if (!isView && newInputValue !== "")
                                    setSearchData(newInputValue);
                                  // handleManualLotNoChange(index, newInputValue);
                                  // setInputValue(newInputValue);
                                }}
                                disabled={isView}
                                value={
                                  // element.manuallLot === "0"
                                  //   ? element.lotno.label
                                  //   : element.lotno
                                  element.lotno !== ""
                                    ? element.lotno.label
                                    : ""
                                  // element.lotno !== ""
                                  //   ? element.lotno.value === ""
                                  //     ? element.lotno
                                  //     : element.lotno.label
                                  //   : ""
                                }
                                options={lotdata.map(
                                  (option) => option.Lot.number
                                )}
                                renderInput={(params) => (
                                  <TextField
                                    className="cate-input-blg"
                                    {...params}
                                    variant="outlined"
                                    style={{ padding: 0 }}
                                  />
                                )}
                              />
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
                                  options={stockCodeData.map((suggestion) => ({
                                    value: suggestion.stock_name_code.id,
                                    label:
                                      suggestion.stock_name_code.stock_code,
                                    pcs_require:
                                      suggestion.stock_name_code
                                        .stock_description.pcs_require,
                                  }))}
                                  // components={components}
                                  value={
                                    element.category !== ""
                                      ? element.category.value === ""
                                        ? ""
                                        : element.category
                                      : ""
                                  }
                                  onChange={(e) => {
                                    handleStockGroupChange(index, e);
                                  }}
                                  placeholder="Stock Code"
                                  isDisabled={isView}
                                />

                                {element.errors !== undefined &&
                                element.errors.category !== null ? (
                                  <span style={{ color: "red" }}>
                                    {element.errors.category}
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
                                    element.category !== ""
                                      ? element.category.value === ""
                                        ? ""
                                        : element.category
                                      : ""
                                  }
                                  onChange={(e) => {
                                    handleStockGroupFindingChange(index, e);
                                  }}
                                  placeholder="Stock Code"
                                  isDisabled={isView}
                                />

                                {element.errors !== undefined &&
                                element.errors.category !== null ? (
                                  <span style={{ color: "red" }}>
                                    {element.errors.category}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </>
                            )}

                            {selectedLoad === "4" && (
                              <>
                                <Select
                                  className={clsx(
                                    classes.selectBox,
                                    "",
                                    "purchase-select-dv"
                                  )}
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  // className={clsx(classes.selectBox, "")}
                                  // classes={classes}
                                  // className=""
                                  styles={selectStyles}
                                  options={productCategory.map(
                                    (suggestion) => ({
                                      value: suggestion.id,
                                      label: suggestion.category_name,
                                    })
                                  )}
                                  // components={components}
                                  value={
                                    element.billingCategory !== ""
                                      ? element.billingCategory.value === ""
                                        ? ""
                                        : element.billingCategory
                                      : ""
                                  }
                                  onChange={(e) => {
                                    handleCategoryChange(index, e);
                                  }}
                                  placeholder="Category Name"
                                  // isDisabled={isView}
                                  isDisabled={true}
                                />

                                {element.errors !== undefined &&
                                element.errors.billingCategory !== null ? (
                                  <span style={{ color: "red" }}>
                                    {" "}
                                    {element.errors.billingCategory}{" "}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </>
                            )}

                            {(selectedLoad === "2" || selectedLoad === "3") && (
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
                            )}

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
                              className={clsx(classes.inputBoxTEST)}
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
                              className={clsx(classes.inputBoxTEST)}
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
                              className={clsx(classes.inputBoxTEST)}
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
                              disabled={isView || selectedLoad == "4"}
                            />

                            {/* {(element.isWeightDiff === 0 && selectedLoad !== "4") && ( */}
                            {element.grossWeight !== "" &&
                              element.netWeight !== "" &&
                              parseFloat(element.grossWeight).toFixed(3) !==
                                parseFloat(element.netWeight).toFixed(3) &&
                              selectedLoad !== "4" && (
                                <IconButton
                                  style={{ padding: "0", width: "auto" }}
                                  onClick={() => {
                                    handleModalOpen(index);
                                  }}
                                >
                                  <Icon
                                    style={{
                                      color:
                                        element.isWeightDiff === 0
                                          ? "red"
                                          : "gray",
                                    }}
                                  >
                                    error
                                  </Icon>
                                </IconButton>
                              )}
                            <TextField
                              // label="Purity"
                              name="purity"
                              className={clsx(classes.inputBoxTEST)}
                              type={isView ? "text" : "number"}
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
                              // label="jobworkFinePure"
                              name="jobworkFinePure"
                              className=""
                              value={element.jobworkFinePure || ""}
                              error={
                                element.errors !== undefined
                                  ? element.errors.jobworkFinePure
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.jobworkFinePure
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled
                            />

                            <TextField
                              // label="wastagePer"
                              name="wastagePer"
                              className={clsx(classes.inputBoxTEST)}
                              type={isView ? "text" : "number"}
                              value={element.wastagePer || ""}
                              error={
                                element.errors !== undefined
                                  ? element.errors.wastagePer
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.wastagePer
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                            />

                            <TextField
                              // label="wastageFine"
                              name="wastageFine"
                              className=""
                              value={element.wastageFine || ""}
                              error={
                                element.errors !== undefined
                                  ? element.errors.wastageFine
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.wastageFine
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled
                            />

                            <TextField
                              // label="wastageFineamount"
                              name="wastageFineamount"
                              value={
                                isView
                                  ? Config.numWithComma(
                                      element?.wastageFineamount
                                    )
                                  : element.wastageFineamount || ""
                              }
                              error={
                                element.errors !== undefined
                                  ? element.errors.wastageFineamount
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.wastageFineamount
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled
                            />

                            <TextField
                              // label="otherTagAmount"
                              name="otherTagAmount"
                              className={clsx(classes.inputBoxTEST)}
                              type={isView ? "text" : "number"}
                              value={
                                isView
                                  ? Config.numWithComma(element?.otherTagAmount)
                                  : element.otherTagAmount || ""
                              }
                              error={
                                element.errors !== undefined
                                  ? element.errors.otherTagAmount
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.otherTagAmount
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              onBlur={(e) => handlerBlur(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                            />

                            <TextField
                              // label="billingLabourRateperGram"
                              name="billingLabourRateperGram"
                              className=""
                              value={
                                isView
                                  ? Config.numWithComma(
                                      element?.billingLabourRateperGram
                                    )
                                  : isNaN(element.billingLabourRateperGram)
                                  ? ""
                                  : element.billingLabourRateperGram || ""
                              }
                              error={
                                element.errors !== undefined
                                  ? element.errors.billingLabourRateperGram
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.billingLabourRateperGram
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled
                            />

                            <TextField
                              // label="amount"
                              name="amount"
                              className=""
                              value={
                                isView
                                  ? Config.numWithComma(element?.amount)
                                  : element.amount || ""
                              }
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

                            {!isView && stateId === 12 && (
                              <>
                                <TextField
                                  // label="cgstPer"
                                  name="cgstPer"
                                  className=""
                                  value={element.cgstPer || ""}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.cgstPer
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.cgstPer
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />

                                <TextField
                                  // label="sGstPer"
                                  name="sGstPer"
                                  className=""
                                  value={element.sGstPer || ""}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.sGstPer
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.sGstPer
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />

                                <TextField
                                  // label="cgstVal"
                                  name="cgstVal"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(element?.cgstVal)
                                      : element.cgstVal || ""
                                  }
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.cgstVal
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.cgstVal
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />

                                <TextField
                                  // label="sGstVal"
                                  name="sGstVal"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(element?.sGstVal)
                                      : element.sGstVal || ""
                                  }
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.sGstVal
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.sGstVal
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </>
                            )}

                            {!isView && stateId !== 12 && (
                              <>
                                <TextField
                                  // label="IGSTper"
                                  name="IGSTper"
                                  className=""
                                  value={element.IGSTper || ""}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.IGSTper
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.IGSTper
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />

                                <TextField
                                  // label="IGSTVal"
                                  name="IGSTVal"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(element?.IGSTVal)
                                      : element.IGSTVal || ""
                                  }
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
                            {isView && viewState === null && (
                              <>
                                <TextField
                                  // label="cgstPer"
                                  name="cgstPer"
                                  className=""
                                  value={element.cgstPer || ""}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.cgstPer
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.cgstPer
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />

                                <TextField
                                  // label="sGstPer"
                                  name="sGstPer"
                                  className=""
                                  value={element.sGstPer || ""}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.sGstPer
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.sGstPer
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />

                                <TextField
                                  // label="cgstVal"
                                  name="cgstVal"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(element?.cgstVal)
                                      : element.cgstVal || ""
                                  }
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.cgstVal
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.cgstVal
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />

                                <TextField
                                  // label="sGstVal"
                                  name="sGstVal"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(element?.sGstVal)
                                      : element.sGstVal || ""
                                  }
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.sGstVal
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.sGstVal
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </>
                            )}

                            {isView && viewState !== null && (
                              <>
                                <TextField
                                  // label="IGSTper"
                                  name="IGSTper"
                                  className=""
                                  value={element.IGSTper || ""}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.IGSTper
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.IGSTper
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />

                                <TextField
                                  // label="IGSTVal"
                                  name="IGSTVal"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(element?.IGSTVal)
                                      : element.IGSTVal || ""
                                  }
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
                              // label="total"
                              name="total"
                              className=""
                              value={
                                isView
                                  ? Config.numWithComma(element?.total)
                                  : element.total || ""
                              }
                              error={
                                element.errors !== undefined
                                  ? element.errors.total
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.total
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
                            height: "30px"
                            // paddingTop: 5,
                            // borderTop: "1px solid lightgray",
                          }}
                        >
                          {!isView &&

                            <div id="castum-width-table" className={clsx(classes.tableheader, "delete_icons_dv")}>
                              {/* delete action */}
                            </div>
                          }
                          <div id="castum-width-table" className={classes.tableheader}>
                            {/* Category (Packet) */}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                            {/* Billing Category */}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                            {/* HSN */}
                          </div>

                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                          {HelperFunc.getTotalOfFieldNoDecimal(formValues, "pieces")}
                            {/* Pieces */}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                            {/* Gross Weight */}
                            {totalGrossWeight}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                            {/* Net Weight */}
                            {totalNetWeight}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                            {/* Purity */}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                            {/* Job work Fine Utilize */}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                            {/* Wastage (%) */}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                          {HelperFunc.getTotalOfField(formValues, "wastageFine")}
                            {/* Wastage Fine */}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                          {HelperFunc.getTotalOfField(formValues, "wastageFineamount")}
                            {/* Wastage Fine Amount */}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                          {HelperFunc.getTotalOfField(formValues, "otherTagAmount")}
                            {/* Other Tag Amount */}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                          {HelperFunc.getTotalOfField(formValues, "billingLabourRateperGram")}
                            {/* Billing Labour Rate per Gram */}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                            {/* Amount */}
                            {isView ? Config.numWithComma(amount) : amount}
                          </div>
                          {stateId === 12 && (
                            <>
                              <div className={clsx(classes.tableheader, "castum-width-table")}>
                                {/* CGST (%) */}
                              </div>
                              <div className={clsx(classes.tableheader, "castum-width-table")}>
                                {/* SGST (%) */}
                              </div>
                              <div className={clsx(classes.tableheader, "castum-width-table")}>
                                {/* CGST */}
                                {isView ? Config.numWithComma(cgstVal) : cgstVal}
                              </div>
                              <div className={clsx(classes.tableheader, "castum-width-table")}>
                                {/* SGST */}
                                {isView ? Config.numWithComma(sgstVal) : sgstVal}
                              </div>
                            </>
                          )}

                          {stateId !== 12 && (
                            <>
                              <div className={clsx(classes.tableheader, "castum-width-table")}>
                                {/* IGST (%) */}
                              </div>
                              <div className={clsx(classes.tableheader, "castum-width-table")}>
                                {/* IGST */}
                                {isView ? Config.numWithComma(igstVal) : igstVal}
                              </div>
                            </>
                          )}
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                            {/* total */}
                            {isView ? Config.numWithComma(total) : total}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(selectedLoad === "0" || selectedLoad === "1") && (
                  <Grid className="salesjobwork-table-main addsales-jobreturn-dv addsales-jobreturnvoucher-dv">
                    <div className="mt-16">
                      <AppBar position="static" className="add-header-purchase">
                        <Tabs value={modalView} onChange={handleChangeTab}>
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
                      {" "}
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
                          "ml-2  addconsumble-dv"
                        )}
                        type={isView ? "text" : "number"}
                        disabled={isView || subTotal === ""}
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
                      {" "}
                      {isView
                        ? Config.numWithComma(totalInvoiceAmount)
                        : totalInvoiceAmount}
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
                    justifyContent: "end",
                    display: "flex",
                    borderRadius: "7px",
                  }}
                >
                  <div
                    style={{
                      width: "20%",
                    }}
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
                    <p style={{ paddingBottom: "3px" }}>jewellery narration</p>
                    <TextField
                      // className="mt-16 mr-2"
                      // style={{ width: "50%" }}
                      placeholder="jewellery narration"
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
                    <p style={{ paddingBottom: "3px" }}>Account narration</p>
                    <TextField
                      // className="mt-16 ml-2"
                      // style={{ width: "50%" }}
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
                        className="w-216 mx-auto mt-16 btn-print-save "
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
                      style={{ float: "right", backgroundColor: "limegreen" }}
                      className="w-216 mx-auto mt-16 mr-16 btn-print-save"
                      aria-label="Register"
                      disabled={total == 0}
                      //   disabled={!isFormValid()}
                      // type="submit"
                      onClick={checkforPrint}
                    >
                      {isView ? "Print" : "Save & Print"}
                    </Button>
                    <div style={{ display: "none" }}>
                      <SalesReturnJobworkPrintComp
                        ref={componentRef}
                        printObj={printObj}
                        isView={isView} 
                        getDateAndTime={getDateAndTime()}
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

            <ViewDocModal
              documentList={documentList}
              handleClose={handleDocModalClose}
              open={docModal}
              updateDocument={updateDocumentArray}
              purchase_flag_id={idToBeView?.id}
              purchase_flag="8"
              concateDocument={concateDocument}
              viewPopup={props.viewPopup}
            />

            <Modal
              // disableBackdropClick
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={modalOpen}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleModalClose();
                }
              }}
            >
              <div
                style={modalStyle}
                className={clsx(classes.paper, "rounded-8")}
              >
                <h5 className="popup-head p-5">
                {isView ? "View Weight" : "Add Weight"}
                  <IconButton
                    style={{ position: "absolute", top: "-2px", right: "0" }}
                    onClick={handleModalClose}
                  >
                    <Icon style={{ color: "white" }}>close</Icon>
                  </IconButton>
                </h5>

                {DiffrentStock.map((row, index) => (
                  // <div
                  //   key={index}
                  //   className={clsx(classes.diffPopup, "p-5 pl-16 pr-16")}
                  // >
                  <Grid container className="p-5">
                    <Grid item xs={3} className="p-2">
                      <label>Stock code</label>
                      <Select
                        className="mt-1"
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={diffStockCode.map((suggestion) => ({
                          value: suggestion.stock_name_code.id,
                          label: suggestion.stock_name_code.stock_code,
                        }))}
                        // value={selectedWeightStock}
                        value={
                          row.setStockCodeId.value === ""
                            ? ""
                            : row.setStockCodeId
                        }
                        onChange={(e) => {
                          handleWeightStockChange(index, e);
                        }}
                        placeholder="Stock code"
                      />
                    </Grid>
                    <span style={{ color: "red" }}>
                      {row.errors !== undefined
                        ? row.errors.setStockCodeId
                        : ""}
                    </span>
                    <Grid item xs={4} className="p-2">
                      <label>Pieces</label>
                      <TextField
                        className="mt-1"
                        placeholder="Pieces"
                        name="setPcs"
                        // className="mx-16"
                        value={row.setPcs || ""}
                        error={
                          row.errors !== undefined
                            ? row.errors.setPcs
                              ? true
                              : false
                            : false
                        }
                        helperText={
                          row.errors !== undefined ? row.errors.setPcs : ""
                        }
                        // error={piecesErr.length > 0 ? true : false}
                        // helperText={piecesErr}
                        onChange={(e) => handleStockInputChange(index, e)}
                        variant="outlined"
                        fullWidth
                        disabled={isView}
                      />
                    </Grid>
                    <Grid item xs={4} className="p-2">
                      <label>Weight</label>
                      <TextField
                        className="mt-1"
                        placeholder="Weight"
                        name="setWeight"
                        // className="mt-16"
                        value={row.setWeight || ""}
                        error={
                          row.errors !== undefined
                            ? row.errors.setWeight
                              ? true
                              : false
                            : false
                        }
                        helperText={
                          row.errors !== undefined ? row.errors.setWeight : ""
                        }
                        // error={weightErr.length > 0 ? true : false}
                        // helperText={weightErr}
                        onChange={(e) => handleStockInputChange(index, e)}
                        variant="outlined"
                        fullWidth
                        disabled={isView}
                      />
                    </Grid>
                    {!isView && (
                      <Grid item xs={1} className="p-2">
                        <IconButton
                          style={{ padding: "0", paddingTop: "27px" }}
                          className="ml-8"
                          onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            deleteDiffrentStock(index);
                            // deleteHandler(row.id);
                          }}
                        >
                          <Icon className="delete-icone">
                            <img src={Icones.delete_red} alt="" />
                          </Icon>
                        </IconButton>
                      </Grid>
                    )}
                    {/* </div> */}
                  </Grid>
                ))}
                {!isView && (
                  <IconButton className="p-16" onClick={AddNewRow}>
                    <Icon
                      style={{
                        color: "dodgerblue",
                      }}
                    >
                      add_circle_outline
                    </Icon>
                  </IconButton>
                )}
                {!isView && (
                  <div className="flex flex-row justify-around p-5 pb-20">
                    <Button
                      variant="contained"
                      className="cancle-button-css"
                      onClick={handleModalClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      className="save-button-css"
                      onClick={(e) => checkforUpdate(e)}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </Modal>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddSalesReturnJobwork;

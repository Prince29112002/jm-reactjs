import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@material-ui/core";
import { Checkbox, Button, TextField } from "@material-ui/core";
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
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Modal from "@material-ui/core/Modal";
import * as XLSX from "xlsx";
import moment from "moment";
import Loader from "app/main/Loader/Loader";
import History from "@history";
import { Icon, IconButton } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CategoryWiseList from "../Components/CategoryWiseList";
import TagWiseList from "../Components/TagWiseList";
import LotDetails from "../Components/LotDetails";
import BomDetails from "../Components/BomDetails";
import { useReactToPrint } from "react-to-print";
import { JewelArticianPrintComp } from "../Components/JewelArticianPrintComp";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
import HelperFunc from "../../Helper/HelperFunc";
// import lotFile from "app/main/SampleFiles/JewelPurchaseStockJV/stock_jv_lot.csv";
// import barcodedFile from "app/main/SampleFiles/JewelPurchaseStockJV/stock_jv_barcode.csv";
import { UpdateNarration } from "../../Helper/UpdateNarration";

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
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    // marginLeft: 15,
  },
  tableheader: {
    display: "inline-block",
    textAlign: "center",
  },
  paper: {
    position: "absolute",
    // width: 400,
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
  rateFixPaper: {
    position: "absolute",
    // width: 600,
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
    textTransform: "none",
    backgroundColor: "#415BD4",
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

const AddStockJewelPurchaseArtician = (props) => {
  const hiddenFileInput = React.useRef(null);

  const [modalView, setModalView] = useState(0);

  const [lotModalView, setLotModalView] = useState(0);

  const handleClick = (event) => {
    if (isVoucherSelected) {
      if (selectedLoad === "2" && bomTypeValidation()) {
        hiddenFileInput.current.click();
      } else {
        hiddenFileInput.current.click();
      }
    } else {
      setSelectVoucherErr("Please Select Voucher");
    }
  };
  const handlefilechange = (event) => {
    handleFile(event);
    console.log("handlefilechange");
  };
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [modalStyle] = useState(getModalStyle);

  // "0" = Load Lot directly (from Excel)
  // "1" = Load Barcoded Stock form excel

  const [selectedLoad, setSelectedLoad] = useState("");
  const [selectedLoadErr, setSelectedLoadErr] = useState("");

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [bomType, setBomType] = useState("");
  const [bomTypeErr, setBomTypeErr] = useState("");

  const [jobworkerData, setJobworkerData] = useState([]);
  const [selectedJobWorker, setSelectedJobWorker] = useState("");
  const [selectedJobWorkerErr, setSelectedJobWorkerErr] = useState("");

  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");

  const [csvData, setCsvData] = useState("");
  const [isCsvErr, setIsCsvErr] = useState(false);

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");

  // const [departmentData, setDepartmentData] = useState([]);
  // const [selectedDepartment, setSelectedDepartment] = useState("");
  // const [selectedDeptErr, setSelectedDeptErr] = useState("");
  // const [amount, setAmount] = useState("");
  // const [newRate, setNewRate] = useState("");
  const loadTypeRef = useRef(null)


  const [fineRate, setFineRate] = useState("");
  const [fineRateErr, setFineRateErr] = useState("");

  const [roundOff, setRoundOff] = useState("");
  const [roundOffErr, SetRoundOffErr] = useState("");

  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState("");

  const [tdsTcsVou, setTdsTcsVou] = useState("");
  const [tdsTcsVouErr, setTdsTcsVouErr] = useState("");

  const [ledgerName, setLedgerName] = useState("");
  const [ledgerNmErr, setLedgerNmErr] = useState("");

  const [rateValue, setRateValue] = useState("");
  const [rateValErr, setRateValErr] = useState("");

  const [ledgerAmount, setLegderAmount] = useState("");
  const [ledgerAmtErr, setLedgerAmtErr] = useState("");

  const [finalAmount, setFinalAmount] = useState("");

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [jewelNarration, setJewelNarration] = useState("");
  const [jewelNarrationErr, setJewelNarrationErr] = useState("");

  // const [adjustedRate, setAdjustedRate] = useState(false);

  const [vendorStateId, setVendorStateId] = useState("");

  const [totalGrossWeight, setTotalGrossWeight] = useState("");
  const [totalNetWeight, setTotalNetWeight] = useState("");
  const [pscTotal, setPcsTotal] = useState("");

  const [voucherModalOpen, setvoucherModalOpen] = useState(false);
  const [isVoucherSelected, setIsVoucherSelected] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState([]);
  const [selectVoucherErr, setSelectVoucherErr] = useState("");

  const [voucherApiData, setVoucherApiData] = useState([]);

  const [jobWorkerGst, setJobWorkerGst] = useState("");
  const [jobworkerHSN, setJobWorkerHSN] = useState("");
  // const [OtherTagAmount, setOtherTagAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [cgstVal, setCgstVal] = useState("");
  const [sgstVal, setSgstVal] = useState("");
  const [igstVal, setIgstVal] = useState("");
  const [total, setTotal] = useState("");
  const [fineGoldTotal, setFineGoldTotal] = useState("");

  const pcsInputRef = useRef([])//for pcs in table

  const [totalGST, setTotalGST] = useState("");
  const [is_tds_tcs, setIs_tds_tcs] = useState("");

  const [subTotal, setSubTotal] = useState("");

  const [fileSelected, setFileSelected] = useState("");
  const [isUploaded, setIsuploaded] = useState(false);

  const [oppositeAccData, setOppositeAccData] = useState([]);
  const [oppositeAccSelected, setOppositeAccSelected] = useState("");
  const [selectedOppAccErr, setSelectedOppAccErr] = useState("");

  const [stockCodeData, setStockCodeData] = useState([]);

  const [diffStockCode, setDiffStockCode] = useState([]);

  const [fineTotal, setFineTotal] = useState("");

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);

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

  const theme = useTheme();

  const [documentList, setDocumentList] = useState([])
  const [docModal, setDocModal] = useState(false)
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);

  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 41)
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
    // visible true -> false
    if (loading) {
      //setTimeout(() => setLoaded(true), 250); // 0.25초 뒤에 해제
      //debugger;
      setTimeout(() => setLoading(false), 7000); // 10초 뒤에
    }

    //setLoaded(loaded);
  }, [loading]);

  useEffect(() => {
    if (props.reportView === "Report") {
      NavbarSetting('Report', dispatch)
    }else if (props.reportView === "Account"){
      NavbarSetting('Accounts', dispatch)
    }else {
      NavbarSetting('Sales', dispatch)
    }
    //eslint-disable-next-line
  }, [])

  const [productData, setProductData] = useState([]); //category wise Data
  const [tagWiseData, setTagWiseData] = useState([]);

  const [lotList, setLotList] = useState([]);
  const [bomList, setBomList] = useState([]);
  var idToBeView;
  if (props.location) {
    idToBeView = props.location.state;
  } else if (props.voucherId) {
    idToBeView = { id: props.voucherId }
  }
  const [isView, setIsView] = useState(false); //for view Only
  const [narrationFlag, setNarrationFlag] = useState(false)

  const [rateProfiles, setRateProfiles] = useState([]);

  const handleChangeTab = (event, value) => {
    setModalView(value);
  };

  const handleLotTabChange = (event, value) => {
    setLotModalView(value);
  };

  const [userFormValues, setUserFormValues] = useState([
    {
      stockCode: "",
      stockName: "",
      HSNNum: "",
      billingCategory: "",
      purity: "",
      color: "",
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
      wastagePer: "",
      wastageFine: "",
      jobworkFineUtilize: "",
      labourFineAmount: "",
      catRatePerGram: "",
      rate: "",
      tag_amount_after_discount: "",
      tag_amount_before_discount: "",
      totalAmount: "",
      cgstPer: "",
      cgstVal: "",
      sGstPer: "",
      sGstVal: "",
      IGSTper: "",
      IGSTVal: "",
      total: "",
      errors: {
        stockCode: null,
        stockName: null,
        HSNNum: null,
        billingCategory: null,
        purity: null,
        color: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        wastagePer: null,
        wastageFine: null,
        jobworkFineUtilize: null,
        labourFineAmount: null,
        catRatePerGram: null,
        tag_amount_after_discount: null,
        tag_amount_before_discount: null,
        rate: null,
        totalAmount: null,
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
      stockCode: "",
      stockName: "",
      HSNNum: "",
      billingCategory: "",
      purity: "",
      color: "",
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
      wastagePer: "",
      wastageFine: "",
      jobworkFineUtilize: "",
      labourFineAmount: "",
      catRatePerGram: "",
      rate: "",
      tag_amount_after_discount: "",
      tag_amount_before_discount: "",
      totalAmount: "",
      cgstPer: "",
      cgstVal: "",
      sGstPer: "",
      sGstVal: "",
      IGSTper: "",
      IGSTVal: "",
      total: "",
      errors: {
        stockCode: null,
        stockName: null,
        HSNNum: null,
        billingCategory: null,
        purity: null,
        color: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        wastagePer: null,
        wastageFine: null,
        jobworkFineUtilize: null,
        labourFineAmount: null,
        catRatePerGram: null,
        rate: null,
        tag_amount_after_discount: null,
        tag_amount_before_discount: null,
        totalAmount: null,
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
      stockCode: "",
      stockName: "",
      HSNNum: "",
      billingCategory: "",
      purity: "",
      color: "",
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
      wastagePer: "",
      wastageFine: "",
      jobworkFineUtilize: "",
      labourFineAmount: "",
      catRatePerGram: "",
      rate: "",
      tag_amount_after_discount: "",
      tag_amount_before_discount: "",
      totalAmount: "",
      cgstPer: "",
      cgstVal: "",
      sGstPer: "",
      sGstVal: "",
      IGSTper: "",
      IGSTVal: "",
      total: "",
      errors: {
        stockCode: null,
        stockName: null,
        HSNNum: null,
        billingCategory: null,
        purity: null,
        color: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        wastagePer: null,
        wastageFine: null,
        jobworkFineUtilize: null,
        labourFineAmount: null,
        catRatePerGram: null,
        rate: null,
        tag_amount_after_discount: null,
        tag_amount_before_discount: null,
        totalAmount: null,
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
      stockCode: "",
      stockName: "",
      HSNNum: "",
      billingCategory: "",
      purity: "",
      color: "",
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
      wastagePer: "",
      wastageFine: "",
      jobworkFineUtilize: "",
      labourFineAmount: "",
      catRatePerGram: "",
      rate: "",
      tag_amount_after_discount: "",
      tag_amount_before_discount: "",
      totalAmount: "",
      cgstPer: "",
      cgstVal: "",
      sGstPer: "",
      sGstVal: "",
      IGSTper: "",
      IGSTVal: "",
      total: "",
      errors: {
        stockCode: null,
        stockName: null,
        HSNNum: null,
        billingCategory: null,
        purity: null,
        color: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        wastagePer: null,
        wastageFine: null,
        jobworkFineUtilize: null,
        labourFineAmount: null,
        catRatePerGram: null,
        rate: null,
        tag_amount_after_discount: null,
        tag_amount_before_discount: null,
        totalAmount: null,
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

  const [printObj, setPrintObj] = useState({
    stateId: "",
    is_tds_tcs: "",
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
    pcsTot: "",
    totalInvoiceAmt: "",
    TDSTCSVoucherNum: "",
    ledgerName: "",
    taxAmount: "",
    metNarration: "",
    accNarration: "",
    balancePayable: ""
  })

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);

  const handleAfterPrint = () => { //React.useCallback
    console.log("`onAfterPrint` called", isView); // tslint:disable-line no-console
    checkAndReset()

  };

  function checkAndReset() {
    // console.log("checkAndReset", isView)

    // console.log("isView", isView)

    if (isView === false) {

      console.log("cond true", isView)
      History.goBack();
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

  function getDateAndTime() {
    return new Date().getDate() + "_" + (new Date().getMonth() + 1) + "_" + new Date().getFullYear() + "_" + new Date().getHours() + ":" + new Date().getMinutes()
  }

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Jewellery Purchase (Artician Receive) Voucher" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  function checkforPrint() {
    if (
      voucherNumValidation() &&
      partyNameValidation() &&
      oppositeAcValidation() &&
      partyVoucherNumValidation() &&
      checkAmount()
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (isView) {
        handlePrint();
      } else {

        console.log("else ");
        if (selectedLoad === "0") {
          //check prev valid
          if (prevIsValid()) {
            addUserInputApi(false, true);
          }
        } else {
          addJewellaryPuchaseApi(false, true);
        }
      }
    } else {
      console.log("else");
    }
  }

  useEffect(() => {

    setOppositeAccData(HelperFunc.getOppositeAccountDetails("JewelleryPurchaseArtician"));

    getJobworkerdata();
    getJobWorkHsnGst()
    console.log("idToBeView", idToBeView);
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true)
      getJewelPurchaseRecordForView(idToBeView.id);
    } else {
      setNarrationFlag(false)
      getStockCodeFindingVariant();
      getStockCodeStone();
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

  function getJewelPurchaseRecordForView(id) {
    setLoading(true);
    let api = ""
    if(props.forDeletedVoucher){
      api = `api/stockJVJewelleryPurchaseArtician/${id}?deleted_at=1`
    }else {
      api = `api/stockJVJewelleryPurchaseArtician/${id}`
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
              let finalData = response.data.data.data;
              let otherDetail = response.data.data.otherDetails;

              setSelectedLoad(otherDetail.loadType.toString());

              if (otherDetail.loadType === 2) {
                // setUploadType(otherDetail.uploadType);
                setBomType(otherDetail.selectBom.toString());
              }

              setDocumentList(finalData.salesPurchaseDocs)

              setVoucherNumber(finalData.voucher_no);
            setPartyVoucherDate(finalData.party_voucher_date)
              setAllowedBackDate(true);
              setVoucherDate(finalData.purchase_voucher_create_date);
              setSelectedJobWorker({
                value: finalData.jobworker.id,
                label: finalData.jobworker.name,
              });
              setFirmName(finalData.jobworker.firm_name);
              setVendorStateId(finalData.jobworker.state);

              setIs_tds_tcs(finalData.jobworker.is_tds_tcs);

              setOppositeAccSelected({
                value: finalData.opposite_account_id,
                label: finalData.OppositeAccount.name,
              });
              setPartyVoucherNum(finalData.party_voucher_no);
              setRoundOff(
                finalData.round_off === null ? "" : finalData.round_off
              );

              if (finalData.TdsTcsVoucher !== null) {
                setTdsTcsVou(finalData.TdsTcsVoucher.voucher_no);
                setLedgerName(finalData.TdsTcsVoucher.voucher_name);
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
              setJewelNarration(
                finalData.jewellery_narration !== null
                  ? finalData.jewellery_narration
                  : ""
              );

              setFineRate(
                finalData.StockJVJewelleryPurchaseArticianOrders[0].fine_rate
              );

              let tempjobWorkerGst = response.data.data.jobWorkHsn.gst;
              setJobWorkerGst(tempjobWorkerGst)

              let JWHSN = response.data.data.jobWorkHsn.hsn_number;
              setJobWorkerHSN(JWHSN);
              console.log(tempjobWorkerGst, JWHSN)

              if (otherDetail.loadType === 0) {
                //finding variant
                let tempArray = [];
                // console.log(OrdersData);
                for (let item of finalData.StockJVJewelleryPurchaseArticianOrders) {
                  // console.log(item);
                  tempArray.push({
                    stockCode: {
                      value: item.StockNameCode.id,
                      label: item.StockNameCode.stock_code,
                    },
                    stockName: item.stock_name,
                    HSNNum: item.hsn_number ? item.hsn_number : '', // item.StockNameCode.stock_name_code.hsn_master.hsn_number,
                    billingCategory:
                      item.StockNameCode.stock_name_code.billing_name,
                    purity: item.purity,
                    color: item.StockNameCode.gold_color.name,
                    pieces: item.pcs,
                    grossWeight: parseFloat(item.gross_wt).toFixed(3),
                    netWeight: parseFloat(item.net_wt).toFixed(3),
                    isWeightDiff: "",
                    DiffrentStock: item.JewelleryPurchaseOrderSetStockCode.map(item => {
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
                    wastagePer: parseFloat(item.wastage_per).toFixed(3),
                    wastageFine: item.wastage_fine,
                    jobworkFineUtilize: parseFloat(
                      item.jobwork_fine_utilize
                    ).toFixed(3),
                    labourFineAmount: parseFloat(item.labour_fine_amount).toFixed(3),
                    catRatePerGram: parseFloat(item.category_rate).toFixed(3),
                    rate: parseFloat(item.fine_rate).toFixed(3),
                    tag_amount_after_discount: parseFloat(item.tag_amount_after_discount).toFixed(3),
                    tag_amount_before_discount: parseFloat(item.tag_amount_before_discount).toFixed(3),
                    totalAmount: parseFloat(item.total_amount).toFixed(3),
                    cgstPer: parseFloat(tempjobWorkerGst) / 2,
                    cgstVal:
                      item.cgst !== null
                        ? parseFloat((parseFloat(item.total_amount) * (parseFloat(tempjobWorkerGst) / 2)) / 100).toFixed(3)
                        : "",
                    sGstPer: parseFloat(tempjobWorkerGst) / 2,
                    sGstVal:
                      item.sgst !== null
                        ? parseFloat((parseFloat(item.total_amount) * (parseFloat(tempjobWorkerGst) / 2)) / 100).toFixed(3)
                        : "",
                    IGSTper: tempjobWorkerGst,
                    IGSTVal:
                      item.igst !== null
                        ? parseFloat((parseFloat(item.total_amount) * parseFloat(tempjobWorkerGst)) / 100).toFixed(3)
                        : "",
                    total: parseFloat(item.total).toFixed(3),
                  });
                }
                setUserFormValues(tempArray);

                function amount(item) {
                  // console.log(item.amount)
                  return item.totalAmount;
                }

                function jobworkFineUtilize(item) {
                  return parseFloat(item.jobworkFineUtilize);
                }

                let tempFineTot = tempArray
                  .filter((item) => item.jobworkFineUtilize !== "")
                  .map(jobworkFineUtilize)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setFineTotal(parseFloat(tempFineTot).toFixed(3));

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

                let tempNetWtTot = tempArray
                  .filter((data) => data.netWeight !== "")
                  .map(netWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)

                setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

                function pscTotal(item) {
                  return item.pieces;
                }
                let tempPcsTotal = tempArray
                  .filter((item) => item.pieces !== "")
                  .map(pscTotal)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setPcsTotal(tempPcsTotal)
                // console.log(formValues.map(amount).reduce(sum))

                let tempAmount = tempArray
                  .filter((item) => item.totalAmount !== "")
                  .map(amount)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                //.reduce(sum);
                // console.log("tempAmount",tempAmount)
                setTotalAmount(parseFloat(tempAmount).toFixed(3));
                setSubTotal(parseFloat(tempAmount).toFixed(3));

                let tempCgstVal = tempArray
                  .filter((item) => item.cgstVal !== "")
                  .map(CGSTval)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
                setCgstVal(parseFloat(tempCgstVal).toFixed(3));

                let tempSgstVal = tempArray
                  .filter((item) => item.sGstVal !== "")
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
                setTotalGST(parseFloat(tempCgstVal) + parseFloat(tempSgstVal) + parseFloat(tempIgstVal));

                let tempTotal = tempArray
                  .filter((item) => item.total !== "")
                  .map(Total)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setTotal(parseFloat(tempTotal).toFixed(3));

                let tempGrossWtTot = tempArray
                  .filter((data) => data.grossWeight !== "")
                  .map(grossWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)

                setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

                function fine(item) {
                  return parseFloat(item.fine);
                }

                let tempFineGold = tempArray
                  .filter((item) => item.fine !== "")
                  .map(fine)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

                setPrintObj({
                  stateId: finalData.jobworker.state,
                  is_tds_tcs: finalData.jobworker.is_tds_tcs,
                  supplierName: finalData.jobworker.firm_name,
                  supAddress: finalData.jobworker.address,
                  supplierGstUinNum: finalData.jobworker.gst_number,
                  supPanNum: finalData.jobworker.pan_number,
                  supState: finalData.jobworker.state_name.name,
                  supCountry: finalData.jobworker.country_name.name,
                  // supStateCode: finalData.jobworker.gst_number.substring(0, 2),
                  supStateCode: (finalData.jobworker.gst_number) ? finalData.jobworker.gst_number.substring(0, 2) : '',
                  purcVoucherNum: finalData.voucher_no,
                  partyInvNum: finalData.party_voucher_no,
                  voucherDate: moment(finalData.purchase_voucher_create_date).format("DD-MM-YYYY"),
                  placeOfSupply: finalData.jobworker.state_name.name,
                  orderDetails: tempArray,
                  taxableAmount: parseFloat(tempAmount).toFixed(3),
                  sGstTot: tempSgstVal ? tempSgstVal : "",
                  cGstTot: tempCgstVal ? tempCgstVal : "",
                  iGstTot: tempIgstVal ? tempIgstVal : "",
                  roundOff: finalData.round_off === null ? "" : finalData.round_off,
                  grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
                  netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                  pcsTot: tempPcsTotal,
                  totalInvoiceAmt: parseFloat(finalData.total_invoice_amount).toFixed(3),
                  TDSTCSVoucherNum: finalData.TdsTcsVoucher !== null ? finalData.TdsTcsVoucher.voucher_no : "",
                  ledgerName: finalData.TdsTcsVoucher !== null ? finalData.TdsTcsVoucher.voucher_name : "",
                  taxAmount: Math.abs(parseFloat(parseFloat(finalData.final_invoice_amount) - parseFloat(finalData.total_invoice_amount)).toFixed(3)),
                  metNarration: finalData.jewellery_narration !== null ? finalData.jewellery_narration : "",
                  accNarration: finalData.account_narration !== null ? finalData.account_narration : "",
                  balancePayable: parseFloat(finalData.final_invoice_amount).toFixed(3)
                })
                // setAdjustedRate(true)

                // ======================================================================================================
              } else if (otherDetail.loadType === 1) {

                let formArr = [];
                let bomArr = []
                for (let item of finalData.StockJVJewelleryPurchaseArticianOrders) {
                  // console.log(item);
                  formArr.push({
                    loadType: selectedLoad,
                    category: item.ProductCategory.category_name,
                    billingCategory: item.ProductCategory.billing_category_name,
                    HSNNum: item.hsn_number ? item.hsn_number : '',//item.ProductCategory.hsn_master.hsn_number,
                    lotNumber: item.Lot.number,
                    pieces: item.pcs,
                    grossWeight: parseFloat(item.gross_wt).toFixed(3),
                    netWeight: parseFloat(item.net_wt).toFixed(3),
                    purity: item.purity,
                    jobworkFineUtilize: parseFloat(
                      item.jobwork_fine_utilize
                    ).toFixed(3),
                    wastagePer: parseFloat(item.wastage_per).toFixed(3),
                    wastageFine: parseFloat(item.wastage_fine).toFixed(3),
                    fineRate: parseFloat(item.fine_rate).toFixed(3),
                    labourFineAmount: parseFloat(
                      item.labour_fine_amount
                    ).toFixed(3),
                    tag_amount_after_discount: parseFloat(
                      item.tag_amount_after_discount
                    ).toFixed(3),
                    tag_amount_before_discount: parseFloat(
                      item.tag_amount_before_discount
                    ).toFixed(3),
                    catRatePerGram: parseFloat(item.category_rate).toFixed(3),
                    totalAmount: parseFloat(item.total_amount).toFixed(3),
                    ...(item.igst === null && {
                      cgstPer: (parseFloat(tempjobWorkerGst) / 2),
                      cgstVal: parseFloat(
                        (parseFloat(item.total_amount) *
                          (parseFloat(tempjobWorkerGst) / 2)) /
                        100
                      ).toFixed(3),
                      sGstPer: (parseFloat(tempjobWorkerGst) / 2),
                      sGstVal: parseFloat(
                        (parseFloat(item.total_amount) *
                          (parseFloat(tempjobWorkerGst) / 2)) /
                        100
                      ).toFixed(3),
                    }),
                    ...(item.igst !== null && {
                      IGSTper: (tempjobWorkerGst),
                      IGSTVal: parseFloat(
                        (parseFloat(item.total_amount) *
                          parseFloat(tempjobWorkerGst)) /
                        100
                      ).toFixed(3),
                    }),
                    total: parseFloat(item.total).toFixed(3),
                  });

                  for (let bom of item.Lot.LotDesigns) {
                    bomArr.push({
                      lotNumber: item.Lot.number,
                      stock_name_code: bom.DesignStockCodes.stock_code,
                      design_no: bom.LotDesignData.variant_number,
                      design_pcs: bom.design_pcs,
                      batch_no: bom.batch_no,
                      pcs: bom.pcs,
                      weight: parseFloat(bom.weight).toFixed(3),
                    })
                  }
                  // bomArr.push(...item.Lot.LotDesigns)
                }

                setLotList(formArr);
                setBomList(bomArr)

                function totalFine(item) {
                  return parseFloat(item.totalFine);
                }

                let tempFineGold = formArr
                  .filter((item) => item.totalFine !== "")
                  .map(totalFine)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  });

                setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

                function grossWeight(item) {
                  // console.log(parseFloat(item.grossWeight));
                  return parseFloat(item.grossWeight);
                }

                let tempGrossWtTot = formArr
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

                let tempNetWtTot = formArr
                  .filter((data) => data.netWeight !== "")
                  .map(netWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)

                setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

                function pscTotal(item) {
                  return item.pieces;
                }
                let tempPcsTotal = formArr
                  .filter((item) => item.pieces !== "")
                  .map(pscTotal)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setPcsTotal(tempPcsTotal)

                function totalAmount(item) {
                  return item.totalAmount;
                }

                let tempTotAmount = formArr
                  .filter((item) => item.totalAmount !== "")
                  .map(totalAmount)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setTotalAmount(parseFloat(tempTotAmount).toFixed(3));

                setSubTotal(parseFloat(tempTotAmount).toFixed(3));

                function CGSTVal(item) {
                  return item.cgstVal;
                }

                let tempCgstVal = formArr
                  .filter((item) => item.cgstVal !== "" && item.cgstPer)
                  .map(CGSTVal)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setCgstVal(parseFloat(tempCgstVal).toFixed(3));

                function SGSTval(item) {
                  return item.sGstVal;
                }

                let tempSgstVal = formArr
                  .filter((item) => item.sGstVal !== "" && item.sGstPer)
                  .map(SGSTval)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setSgstVal(parseFloat(tempSgstVal).toFixed(3));
                function IGSTVal(item) {
                  return item.IGSTVal;
                }

                let tempIgstVal = formArr
                  .filter((item) => item.IGSTVal !== "" && item.IGSTper)
                  .map(IGSTVal)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setIgstVal(parseFloat(tempIgstVal).toFixed(3));
                setTotalGST(parseFloat(tempCgstVal) + parseFloat(tempSgstVal) + parseFloat(tempIgstVal));

                function total(item) {
                  return item.total;
                }
                let tempTotal = formArr
                  .filter((item) => item.total !== "")
                  .map(total)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setTotal(parseFloat(tempTotal).toFixed(3));

                setPrintObj({
                  stateId: finalData.jobworker.state,
                  is_tds_tcs: finalData.jobworker.is_tds_tcs,
                  supplierName: finalData.jobworker.firm_name,
                  supAddress: finalData.jobworker.address,
                  supplierGstUinNum: finalData.jobworker.gst_number,
                  supPanNum: finalData.jobworker.pan_number,
                  supState: finalData.jobworker.state_name.name,
                  supCountry: finalData.jobworker.country_name.name,
                  // supStateCode: finalData.jobworker.gst_number.substring(0, 2),
                  supStateCode: (finalData.jobworker.gst_number) ? finalData.jobworker.gst_number.substring(0, 2) : '',
                  purcVoucherNum: finalData.voucher_no,
                  partyInvNum: finalData.party_voucher_no,
                  voucherDate: moment(finalData.purchase_voucher_create_date).format("DD-MM-YYYY"),
                  placeOfSupply: finalData.jobworker.state_name.name,
                  orderDetails: formArr,
                  taxableAmount: parseFloat(tempTotAmount).toFixed(3),
                  sGstTot: tempSgstVal ? parseFloat(tempSgstVal).toFixed(3) : "",
                  cGstTot: tempCgstVal ? parseFloat(tempCgstVal).toFixed(3) : "",
                  iGstTot: tempIgstVal ? parseFloat(tempIgstVal).toFixed(3) : "",
                  roundOff: finalData.round_off === null ? "" : finalData.round_off,
                  grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
                  netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                  pcsTot: tempPcsTotal,
                  totalInvoiceAmt: parseFloat(finalData.total_invoice_amount).toFixed(3),
                  TDSTCSVoucherNum: finalData.TdsTcsVoucher !== null ? finalData.TdsTcsVoucher.voucher_no : "",
                  ledgerName: finalData.TdsTcsVoucher !== null ? finalData.TdsTcsVoucher.voucher_name : "",
                  taxAmount: Math.abs(parseFloat(parseFloat(finalData.final_invoice_amount) - parseFloat(finalData.total_invoice_amount)).toFixed(3)),
                  metNarration: finalData.jewellery_narration !== null ? finalData.jewellery_narration : "",
                  accNarration: finalData.account_narration !== null ? finalData.account_narration : "",
                  balancePayable: parseFloat(finalData.final_invoice_amount).toFixed(3)
                })

              } else if (otherDetail.loadType === 2) {
                let catArray = [];
                let formArr = [];

                for (let item of finalData.StockJVJewelleryPurchaseArticianOrders) {
                  // console.log(item);
                  formArr.push({
                    loadType: selectedLoad,
                    category: item.ProductCategory.category_name,
                    billingCategory: item.ProductCategory.billing_category_name,
                    HSNNum: item.hsn_number ? item.hsn_number : '',//item.ProductCategory.hsn_master.hsn_number,
                    // lotNumber: item.Lot.number,
                    pieces: item.pcs,
                    variant_number:item.design_no,
                    grossWeight: parseFloat(item.gross_wt).toFixed(3),
                    netWeight: parseFloat(item.net_wt).toFixed(3),
                    purity: item.purity,
                    jobworkFineUtilize: parseFloat(
                      item.jobwork_fine_utilize
                    ).toFixed(3),
                    wastagePer: parseFloat(item.wastage_per).toFixed(3),
                    wastageFine: parseFloat(item.wastage_fine).toFixed(3),
                    fineRate: parseFloat(item.fine_rate).toFixed(3),
                    labourFineAmount: parseFloat(
                      item.labour_fine_amount
                    ).toFixed(3),
                    tag_amount_after_discount: parseFloat(
                      item.tag_amount_after_discount
                    ).toFixed(3),
                    tag_amount_before_discount: parseFloat(
                      item.tag_amount_before_discount
                    ).toFixed(3),
                    catRatePerGram: parseFloat(item.category_rate).toFixed(3),
                    totalAmount: parseFloat(item.total_amount).toFixed(3),
                    ...(item.igst === null && {
                      cgstPer: (parseFloat(tempjobWorkerGst) / 2), //show gst % of product and calculate with jobworker's gst
                      cgstVal: parseFloat(
                        (parseFloat(item.total_amount) *
                          (parseFloat(tempjobWorkerGst) / 2)) /
                        100
                      ).toFixed(3),
                      sGstPer: (parseFloat(tempjobWorkerGst) / 2),
                      sGstVal: parseFloat(
                        (parseFloat(item.total_amount) *
                          (parseFloat(tempjobWorkerGst) / 2)) /
                        100
                      ).toFixed(3),
                    }),
                    ...(item.igst !== null && {
                      IGSTper: (tempjobWorkerGst),
                      IGSTVal: parseFloat(
                        (parseFloat(item.total_amount) *
                          parseFloat(tempjobWorkerGst)) /
                        100
                      ).toFixed(3),
                    }),
                    total: parseFloat(item.total).toFixed(3),
                  });

                  let findIndex = catArray.findIndex(
                    (data) => data.category_id === item.category_id
                  );

                  if (findIndex > -1) {

                    catArray[findIndex].pieces = parseFloat(catArray[findIndex].pieces) + parseFloat(item.pcs);

                    catArray[findIndex].grossWeight = parseFloat(parseFloat(catArray[findIndex].grossWeight) + parseFloat(item.gross_wt)).toFixed(3);

                    catArray[findIndex].netWeight = parseFloat(parseFloat(catArray[findIndex].netWeight) + parseFloat(item.net_wt)).toFixed(3);

                    catArray[findIndex].fine = parseFloat(parseFloat(catArray[findIndex].fine) + parseFloat(item.fine)).toFixed(3);

                    catArray[findIndex].tag_amount_after_discount = parseFloat(
                      parseFloat(catArray[findIndex].tag_amount_after_discount) + parseFloat(item.tag_amount_after_discount)
                    ).toFixed(3);

                    catArray[findIndex].tag_amount_before_discount = parseFloat(
                      parseFloat(catArray[findIndex].tag_amount_before_discount) + parseFloat(item.tag_amount_before_discount)
                    ).toFixed(3);

                    catArray[findIndex].wastageFine = parseFloat(
                      parseFloat(catArray[findIndex].wastageFine) + parseFloat(item.wastage_fine)
                    ).toFixed(3);

                    catArray[findIndex].totalFine = parseFloat(
                      parseFloat(catArray[findIndex].totalFine) + parseFloat(item.total_fine)
                    ).toFixed(3);

                    catArray[findIndex].amount = parseFloat(
                      parseFloat(catArray[findIndex].amount) + parseFloat(item.amount)
                    ).toFixed(3);

                    catArray[findIndex].categoryRate = parseFloat(
                      parseFloat(catArray[findIndex].categoryRate) + parseFloat(item.category_rate)
                    ).toFixed(3);

                    catArray[findIndex].totalAmount = parseFloat(
                      parseFloat(catArray[findIndex].totalAmount) + parseFloat(item.total_amount)
                    ).toFixed(3);

                    catArray[findIndex].total = parseFloat(parseFloat(catArray[findIndex].total) + parseFloat(item.total)).toFixed(3);

                    catArray[findIndex].cgstVal = parseFloat(
                      (parseFloat(catArray[findIndex].total) - parseFloat(catArray[findIndex].totalAmount)) / 2
                    ).toFixed(3);

                    catArray[findIndex].sGstVal = parseFloat(
                      (parseFloat(catArray[findIndex].total) - parseFloat(catArray[findIndex].totalAmount)) / 2
                    ).toFixed(3);

                    catArray[findIndex].IGSTVal = parseFloat(
                      parseFloat(catArray[findIndex].total) - parseFloat(catArray[findIndex].totalAmount)
                    ).toFixed(3);

                    // catArray[findIndex].hallmarkCharges = parseFloat(
                    //   parseFloat(catArray[findIndex].hallmarkCharges) +
                    //     parseFloat(item.hallmark_charges) * parseFloat(item.pcs)
                    // ).toFixed(3);

                  } else {

                    catArray.push({
                      category_id: item.category_id,
                      loadType: selectedLoad,
                      category: item.ProductCategory.category_name,
                      billingCategory: item.ProductCategory.billing_category_name,
                      HSNNum: item.hsn_number ? item.hsn_number : '',//item.ProductCategory.hsn_master.hsn_number,
                      // lotNumber: item.,
                      pieces: item.pcs,
                      grossWeight: parseFloat(item.gross_wt).toFixed(3),
                      netWeight: parseFloat(item.net_wt).toFixed(3),
                      purity: item.purity,
                      jobworkFineUtilize: parseFloat(
                        item.jobwork_fine_utilize
                      ).toFixed(3),
                      wastagePer: parseFloat(item.wastage_per).toFixed(3),
                      wastageFine: parseFloat(item.wastage_fine).toFixed(3),
                      fineRate: parseFloat(item.fine_rate).toFixed(3),
                      labourFineAmount: parseFloat(item.labour_fine_amount).toFixed(3),
                      tag_amount_after_discount: parseFloat(item.tag_amount_after_discount).toFixed(3),
                      tag_amount_before_discount: parseFloat(item.tag_amount_before_discount).toFixed(3),
                      catRatePerGram: parseFloat(item.category_rate).toFixed(3),
                      totalAmount: parseFloat(item.total_amount).toFixed(3),
                      ...(item.igst === null && {
                        cgstPer: (parseFloat(tempjobWorkerGst) / 2),
                        cgstVal: parseFloat(
                          (parseFloat(item.total_amount) * (parseFloat(tempjobWorkerGst) / 2)) / 100
                        ).toFixed(3),
                        sGstPer: (parseFloat(tempjobWorkerGst) / 2),
                        sGstVal: parseFloat(
                          (parseFloat(item.total_amount) * (parseFloat(tempjobWorkerGst) / 2)) / 100
                        ).toFixed(3),
                      }),
                      ...(item.igst !== 12 && {
                        IGSTper: (tempjobWorkerGst),
                        IGSTVal: parseFloat(
                          (parseFloat(item.total_amount) * parseFloat(tempjobWorkerGst)) / 100
                        ).toFixed(3),
                      }),
                      total: parseFloat(item.total).toFixed(3),
                    });
                  }
                }

                setProductData(catArray); //category wise Data
                setTagWiseData(formArr);

                function totalFine(item) {
                  return parseFloat(item.totalFine);
                }

                let tempFineGold = formArr
                  .filter((item) => item.totalFine !== "")
                  .map(totalFine)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  });

                setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

                function grossWeight(item) {
                  // console.log(parseFloat(item.grossWeight));
                  return parseFloat(item.grossWeight);
                }

                let tempGrossWtTot = formArr
                  // .filter((data) => data.grossWeight !== "")
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

                let tempNetWtTot = formArr
                  .filter((data) => data.netWeight !== "")
                  .map(netWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)

                setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

                function pscTotal(item) {
                  return item.pieces;
                }
                let tempPcsTotal = formArr
                  .filter((item) => item.pieces !== "")
                  .map(pscTotal)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setPcsTotal(tempPcsTotal)

                function totalAmount(item) {
                  return item.totalAmount;
                }

                let tempTotAmount = formArr
                  // .filter((item) => item.amount !== "")
                  .map(totalAmount)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setTotalAmount(parseFloat(tempTotAmount).toFixed(3));

                setSubTotal(parseFloat(tempTotAmount).toFixed(3));

                let tempSgstVal = 0;
                let tempCgstVal = 0;
                let tempIgstVal = 0;

                if(formArr[0].IGSTper){
                  function IGSTVal(item) {
                    return item.IGSTVal;
                  }
  
                  tempIgstVal = formArr
                    // .filter((item) => item.amount !== "")
                    .map(IGSTVal)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0);
                    setIgstVal(parseFloat(tempIgstVal).toFixed(3));
                }else{

                  function CGSTVal(item) {
                    return item.cgstVal;
                  }

                  tempCgstVal = formArr
                  // .filter((item) => item.amount !== "")
                  .map(CGSTVal)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setCgstVal(parseFloat(tempCgstVal).toFixed(3));

                function SGSTval(item) {
                  return item.sGstVal;
                }

                tempSgstVal = formArr
                  // .filter((item) => item.amount !== "")
                  .map(SGSTval)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setSgstVal(parseFloat(tempSgstVal).toFixed(3));
                }

                setTotalGST(parseFloat(tempCgstVal) + parseFloat(tempSgstVal) + parseFloat(tempIgstVal));

                function total(item) {
                  return item.total;
                }
                let tempTotal = formArr
                  // .filter((item) => item.amount !== "")
                  .map(total)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setTotal(parseFloat(tempTotal).toFixed(3));

                setPrintObj({
                  stateId: finalData.jobworker.state,
                  is_tds_tcs: finalData.jobworker.is_tds_tcs,
                  supplierName: finalData.jobworker.firm_name,
                  supAddress: finalData.jobworker.address,
                  supplierGstUinNum: finalData.jobworker.gst_number,
                  supPanNum: finalData.jobworker.pan_number,
                  supState: finalData.jobworker.state_name.name,
                  supCountry: finalData.jobworker.country_name.name,
                  // supStateCode: finalData.jobworker.gst_number.substring(0, 2),
                  supStateCode: (finalData.jobworker.gst_number) ? finalData.jobworker.gst_number.substring(0, 2) : '',
                  purcVoucherNum: finalData.voucher_no,
                  partyInvNum: finalData.party_voucher_no,
                  voucherDate: moment(finalData.purchase_voucher_create_date).format("DD-MM-YYYY"),
                  placeOfSupply: finalData.jobworker.state_name.name,
                  orderDetails: catArray,
                  taxableAmount: parseFloat(tempTotAmount).toFixed(3),
                  sGstTot: tempSgstVal ? parseFloat(tempSgstVal).toFixed(3) : "",
                  cGstTot: tempCgstVal ? parseFloat(tempCgstVal).toFixed(3) : "",
                  iGstTot: tempIgstVal ? parseFloat(tempIgstVal).toFixed(3) : "",
                  roundOff: finalData.round_off === null ? "" : finalData.round_off,
                  grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
                  netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                  pcsTot: tempPcsTotal,
                  totalInvoiceAmt: parseFloat(finalData.total_invoice_amount).toFixed(3),
                  TDSTCSVoucherNum: finalData.TdsTcsVoucher !== null ? finalData.TdsTcsVoucher.voucher_no : "",
                  ledgerName: finalData.TdsTcsVoucher !== null ? finalData.TdsTcsVoucher.voucher_name : "",
                  taxAmount: Math.abs(parseFloat(parseFloat(finalData.final_invoice_amount) - parseFloat(finalData.total_invoice_amount)).toFixed(3)),
                  metNarration: finalData.jewellery_narration !== null ? finalData.jewellery_narration : "",
                  accNarration: finalData.account_narration !== null ? finalData.account_narration : "",
                  balancePayable: parseFloat(finalData.final_invoice_amount).toFixed(3)
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

  function getVoucherNumber() {
    axios
      .get(Config.getCommonUrl() + "api/stockJVJewelleryPurchaseArtician/get/voucher")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);

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
        handleError(error, dispatch, { api: "api/stockJVJewelleryPurchaseArtician/get/voucher" })
      });
  }

  function getStockCodeFindingVariant() {
    axios
      .get(Config.getCommonUrl() + "api/stockname/findingvariant")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockCodeData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/stockname/findingvariant" })
      });
  }

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
    console.log(stockCodeData[findIndex]);
    if (findIndex > -1) {
      newFormValues[i].grossWeight = "";
      newFormValues[i].netWeight = "";
      newFormValues[i].rate = "";
      newFormValues[i].pieces = "";
      // newFormValues[i].valuation = "";
      // newFormValues[i].lotno = "";

      newFormValues[i].color =
        stockCodeData[findIndex].stock_name_code.gold_color.name;
      newFormValues[i].purity = stockCodeData[findIndex].stock_name_code.purity;
      newFormValues[i].HSNNum = jobworkerHSN//stockCodeData[findIndex].hsn_master.hsn_number;
      newFormValues[i].stockName = stockCodeData[findIndex].stock_name;
      newFormValues[i].billingCategory = stockCodeData[findIndex].billing_name;
      newFormValues[i].errors.billingCategory = null;

      if (vendorStateId === 12) {
        newFormValues[i].cgstPer =
          parseFloat(jobWorkerGst) / 2;
        newFormValues[i].sGstPer =
          parseFloat(jobWorkerGst) / 2;
      } else {
        newFormValues[i].IGSTper = parseFloat(jobWorkerGst);
      }
    }

    let wastageIndex = rateProfiles.findIndex(
      (item) => item.stock_name_code_id === e.value
    );
    console.log("wastageIndex", wastageIndex)
    if (wastageIndex > -1) {
      newFormValues[i].wastagePer = parseFloat(rateProfiles[wastageIndex].wastage_per).toFixed(3);
      newFormValues[i].errors.wastagePer = "";
    } else {
      newFormValues[i].errors.wastagePer = "Wastage is not added in rate profile";
    }
    // console.log("wastageIndex",wastageIndex)

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
    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.grossWeight);
    }

    let tempGrossWtTot = newFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

    function jobworkFineUtilize(item) {
      return parseFloat(item.jobworkFineUtilize);
    }

    let tempFineTot = newFormValues
      .filter((item) => item.jobworkFineUtilize !== "")
      .map(jobworkFineUtilize)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setFineTotal(parseFloat(tempFineTot).toFixed(3));

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
      }, 0)

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

    function totalAmount(item) {
      return item.totalAmount;
    }

    function pscTotal(item) {
      return item.pieces;
    }
    let tempPcsTotal = newFormValues
      .filter((item) => item.pieces !== "")
      .map(pscTotal)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setPcsTotal(tempPcsTotal)

    let tempTotAmount = newFormValues
      .filter((item) => item.totalAmount !== "")
      .map(totalAmount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setTotalAmount(parseFloat(tempTotAmount).toFixed(3));
    setSubTotal(parseFloat(tempTotAmount).toFixed(3));

    let tempCgstVal;
    let tempSgstVal;
    let tempIgstVal;

    if (vendorStateId === 12) {
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
      //   parseFloat(parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
      // );
      setTotalGST(parseFloat(parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3));

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

    // setTotalInvoiceAmount(parseFloat(tempTotal).toFixed(3));

    // setLegderAmount(((tempTotal * rateValue) / 100).toFixed(3));
    // setFinalAmount(
    //   (
    //     parseFloat(tempTotal) + parseFloat((tempTotal * rateValue) / 100)
    //   ).toFixed(3)
    // );

    let tempLedgerAmount = 0;
    let tempfinalAmount = 0;
    let tempTotalInvoiceAmt = 0;
    // let temptdsTcsAmount =0;

    tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);

    setTotalInvoiceAmount(tempTotalInvoiceAmt);

    if (is_tds_tcs === "1") {
      //1 is tcs, 2 means tds
      // tempLedgerAmount = parseFloat(
      //   (tempTotalInvoiceAmt * rateValue) / 100
      // ).toFixed(3); //with gst on total invoice amount
      // console.log(tempLedgerAmount);
      //if tcs then enter amount manually
      tempLedgerAmount = 0;
      tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)).toFixed(3);
    } else if (is_tds_tcs === "2") {
      //tds
      tempLedgerAmount = parseFloat(
        (parseFloat(tempTotAmount) * rateValue) / 100
      ).toFixed(3); //calculating before gst, on total amount only
      console.log(tempLedgerAmount);
      tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount)).toFixed(3);
    } else {
      tempfinalAmount = parseFloat(tempTotalInvoiceAmt).toFixed(3);
    }

    setLegderAmount(tempLedgerAmount);

    setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));

    setPrintObj({
      ...printObj,
      stateId: vendorStateId,
      orderDetails: newFormValues,
      is_tds_tcs: is_tds_tcs,
      taxableAmount: parseFloat(tempTotAmount).toFixed(3),
      sGstTot: tempSgstVal,
      cGstTot: tempCgstVal,
      iGstTot: tempIgstVal,
      roundOff: roundOff,
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      pcsTot: tempPcsTotal,
      totalInvoiceAmt: tempTotalInvoiceAmt,
      taxAmount: tempLedgerAmount,
      balancePayable: parseFloat(tempfinalAmount).toFixed(3)
    })

    if (addFlag === true) {
      setUserFormValues([
        ...newFormValues,
        {
          stockCode: "",
          stockName: "",
          HSNNum: "",
          billingCategory: "",
          purity: "",
          color: "",
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
          wastagePer: "",
          wastageFine: "",
          jobworkFineUtilize: "",
          labourFineAmount: "",
          catRatePerGram: "",
          rate: "",
          tag_amount_after_discount: "",
          tag_amount_before_discount: "",
          totalAmount: "",
          cgstPer: "",
          cgstVal: "",
          sGstPer: "",
          sGstVal: "",
          IGSTper: "",
          IGSTVal: "",
          total: "",
          errors: {
            stockCode: null,
            stockName: null,
            HSNNum: null,
            billingCategory: null,
            purity: null,
            color: null,
            pieces: null,
            grossWeight: null,
            netWeight: null,
            wastagePer: null,
            wastageFine: null,
            jobworkFineUtilize: null,
            labourFineAmount: null,
            catRatePerGram: null,
            rate: null,
            tag_amount_after_discount: null,
            tag_amount_before_discount: null,
            totalAmount: null,
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

    } else if (nm === "netWeight") {
      newFormValues[i].netWeight = parseFloat(val).toFixed(3)

    } else if (nm === "tag_amount_after_discount") {
      newFormValues[i].tag_amount_after_discount = parseFloat(val).toFixed(3)

    } else if (nm === "tag_amount_before_discount") {
      newFormValues[i].tag_amount_before_discount = parseFloat(val).toFixed(3)

    }
    setUserFormValues(newFormValues);
  }

  let handleChange = (i, e) => {
    let newFormValues = [...userFormValues];
    newFormValues[i][e.target.name] = e.target.value;
    newFormValues[i].errors[e.target.name] = null;

    let nm = e.target.name;
    let val = e.target.value;

    //if grossWeight or putity change
    if (nm === "grossWeight") {
      newFormValues[i].errors.grossWeight = "";
      if (val === "") {
        newFormValues[i].jobworkFineUtilize = "";
        newFormValues[i].totalAmount = "";
        // setAmount("");
        setSubTotal("");
        setCgstVal("");
        setSgstVal("");
        setIgstVal("");
        setTotalGST("");
        setTotal("");
        setTotalGrossWeight("");
        setTotalNetWeight("")
        setFineGoldTotal("");
      }

      if (parseFloat(newFormValues[i].netWeight) === parseFloat(val)) {
        newFormValues[i].isWeightDiff = 1;
      } else {
        newFormValues[i].isWeightDiff = 0;
      }
      // newFormValues[i].errors.netWeight = "";
      if (
        parseFloat(newFormValues[i].grossWeight) <
        parseFloat(newFormValues[i].netWeight)
      ) {
        newFormValues[i].errors.netWeight =
          "Net Weight Can not be Greater than Gross Weight";
      } else {
        newFormValues[i].errors.netWeight = "";
      }
      // setAdjustedRate(false);
      newFormValues[i].rate = 0;
    }

    // console.log(nm,val)
    if (nm === "netWeight") {
      if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
        // if (newFormValues[i].wastagePer !== "") {
        //   newFormValues[i].fine = (
        //     (parseFloat(newFormValues[i].netWeight) *
        //       parseFloat(newFormValues[i].purity)) /
        //       100 +
        //     (parseFloat(newFormValues[i].netWeight) *
        //       parseFloat(newFormValues[i].wastagePer)) /
        //       100
        //   ).toFixed(3);
        // } else {
        newFormValues[i].jobworkFineUtilize = parseFloat(
          (parseFloat(newFormValues[i].netWeight) *
            parseFloat(newFormValues[i].purity)) /
          100
        ).toFixed(3);
        // }
      }

      if (parseFloat(newFormValues[i].grossWeight) === parseFloat(val)) {
        newFormValues[i].isWeightDiff = 1;
      } else {
        newFormValues[i].isWeightDiff = 0;
      }
      if (parseFloat(newFormValues[i].grossWeight) < parseFloat(val)) {
        newFormValues[i].errors.netWeight =
          "Net Weight Can not be Greater than Gross Weight";
      } else {
        newFormValues[i].errors.netWeight = "";
      }
      // setAdjustedRate(false);
      newFormValues[i].rate = 0;
    }

    if (
      newFormValues[i].wastagePer !== "" &&
      newFormValues[i].netWeight !== ""
    ) {
      newFormValues[i].wastageFine = parseFloat(
        (parseFloat(newFormValues[i].netWeight) *
          parseFloat(newFormValues[i].wastagePer)) /
        100
      ).toFixed(3);
    }

    if (fineRate !== "") {
      newFormValues[i].rate = parseFloat(fineRate).toFixed(3);
    }
    // if (rateFixSelected !== "") {
    //   newFormValues[i].rate = rateFixSelected.label;
    // }
    // console.log("rate", newFormValues[i].rate);

    if (newFormValues[i].wastageFine !== "" && newFormValues[i].rate !== "") {
      newFormValues[i].labourFineAmount = parseFloat(
        (parseFloat(newFormValues[i].wastageFine) *
          parseFloat(newFormValues[i].rate)) /
        10
      ).toFixed(3);
    }

    if (
      newFormValues[i].labourFineAmount !== "" &&
      newFormValues[i].tag_amount_after_discount !== ""
    ) {
      newFormValues[i].totalAmount = parseFloat(
        parseFloat(newFormValues[i].labourFineAmount) +
        parseFloat(newFormValues[i].tag_amount_after_discount)
      ).toFixed(3);
    } else {
      newFormValues[i].totalAmount = newFormValues[i].labourFineAmount;
    }

    if (
      newFormValues[i].totalAmount !== "" && newFormValues[i].totalAmount != 0 &&
      newFormValues[i].netWeight !== "" && newFormValues[i].netWeight != 0
    ) {
      newFormValues[i].catRatePerGram = parseFloat(
        (parseFloat(newFormValues[i].totalAmount) /
          parseFloat(newFormValues[i].netWeight)) *
        10
      ).toFixed(3);
    }

    if (vendorStateId === 12) {
      // console.log("vendorStateId cond")
      if (
        newFormValues[i].totalAmount !== "" &&
        newFormValues[i].cgstPer !== ""
      ) {
        // console.log("if COnd")
        newFormValues[i].cgstVal = parseFloat(
          (parseFloat(newFormValues[i].totalAmount) *
            (parseFloat(jobWorkerGst) / 2)) /
          100
        ).toFixed(3);

        newFormValues[i].sGstVal = parseFloat(
          (parseFloat(newFormValues[i].totalAmount) *
            (parseFloat(jobWorkerGst) / 2)) /
          100
        ).toFixed(3);
        newFormValues[i].total = parseFloat(
          parseFloat(newFormValues[i].totalAmount) +
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
      if (
        newFormValues[i].totalAmount !== "" &&
        newFormValues[i].IGSTper !== ""
      ) {
        newFormValues[i].IGSTVal = parseFloat(
          (parseFloat(newFormValues[i].totalAmount) *
            parseFloat(jobWorkerGst)) /
          100
        ).toFixed(3);
        newFormValues[i].total = parseFloat(
          parseFloat(newFormValues[i].totalAmount) +
          parseFloat(newFormValues[i].IGSTVal)
        ).toFixed(3);
      } else {
        newFormValues[i].IGSTVal = "";
        newFormValues[i].total = "";
      }
    }

    function amount(item) {
      // console.log(item.amount)
      return item.totalAmount;
    }

    function jobworkFineUtilize(item) {
      return parseFloat(item.jobworkFineUtilize);
    }

    let tempFineTot = newFormValues
      .filter((item) => item.jobworkFineUtilize !== "")
      .map(jobworkFineUtilize)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setFineTotal(parseFloat(tempFineTot).toFixed(3));

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
    // console.log(formValues.map(amount).reduce(sum))

    let tempAmount = newFormValues
      .filter((item) => item.totalAmount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    //.reduce(sum);
    // console.log("tempAmount",tempAmount)
    setTotalAmount(parseFloat(tempAmount).toFixed(3));
    setSubTotal(parseFloat(tempAmount).toFixed(3));

    function pscTotal(item) {
      return item.pieces;
    }
    let tempPcsTotal = newFormValues
      .filter((item) => item.pieces !== "")
      .map(pscTotal)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setPcsTotal(tempPcsTotal)

    let tempCgstVal;
    let tempSgstVal;
    let tempIgstVal;
    if (vendorStateId === 12) {
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
      setTotalGST((parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3));

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

    let tempGrossWtTot = newFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)

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
      }, 0)

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

    function fine(item) {
      return parseFloat(item.fine);
    }

    let tempFineGold = newFormValues
      .filter((item) => item.fine !== "")
      .map(fine)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setFineGoldTotal(tempFineGold);

    let tempLedgerAmount = 0;
    let tempfinalAmount = 0;
    let tempTotalInvoiceAmt = 0;
    // setShortageRfix(tempFineGold);
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

      if (is_tds_tcs === "1") {
        //1 is tcs, 2 means tds
        tempLedgerAmount = parseFloat(
          (tempTotalInvoiceAmt * rateValue) / 100
        ).toFixed(3); //with gst on total invoice amount
        // console.log(tempLedgerAmount);
        //if tcs then enter amount manually
        // tempLedgerAmount = 0;
        tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)).toFixed(3);

      } else if (is_tds_tcs === "2") {
        //tds
        tempLedgerAmount = parseFloat(
          (parseFloat(tempAmount) * rateValue) / 100
        ).toFixed(3); //calculating before gst, on total amount only
        console.log(tempLedgerAmount);
        tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount)).toFixed(3);

      } else {
        tempfinalAmount = parseFloat(tempTotalInvoiceAmt).toFixed(3);
      }

      setLegderAmount(tempLedgerAmount);

      setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));
    } else {
      setTotalInvoiceAmount(0);
      setLegderAmount(0);
    }

    setPrintObj({
      ...printObj,
      stateId: vendorStateId,
      orderDetails: newFormValues,
      is_tds_tcs: is_tds_tcs,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      sGstTot: tempSgstVal,
      cGstTot: tempCgstVal,
      iGstTot: tempIgstVal,
      roundOff: roundOff,
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      pcsTot: tempPcsTotal,
      totalInvoiceAmt: tempTotalInvoiceAmt,
      taxAmount: tempLedgerAmount,
      balancePayable: parseFloat(tempfinalAmount).toFixed(3)
    })

    setUserFormValues(newFormValues);
  };

  function handleModalOpen(index) {
    setSelectedIndex(index);
    setModalOpen(true);

    if (userFormValues[index].DiffrentStock.length > 0) {
      console.log("if");
      setDiffrentStock(userFormValues[index].DiffrentStock);
      // setSelectedWeightStock(userFormValues[index].setStockCodeId);
      // setWeight(userFormValues[index].setWeight);
      // setPieces(userFormValues[index].setPcs);
    }
  }

  function handleModalClose() {
    // console.log("handle close", callApi);
    setModalOpen(false);
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

    let newFormValues = [...userFormValues];
    newFormValues[selectedIndex].DiffrentStock = newDiffrentStock;
    setUserFormValues(newFormValues);

    console.log(newFormValues);
    // setSelectedWeightStock(value);
    // setWeightStockErr("");
    // console.log(value);
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

    let newFormValues = [...userFormValues];
    newFormValues[selectedIndex].DiffrentStock = newDiffrentStock;
    setUserFormValues(newFormValues);
  }

  function deleteDiffrentStock(index) {

    let newDiffrentStock = [...DiffrentStock];

    let newFormValues = [...userFormValues];

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
    setUserFormValues(newFormValues);
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

  const checkTotal = () => {
    const grossTotal = Number(userFormValues[selectedIndex].grossWeight);
    const netTotal = Number(userFormValues[selectedIndex].netWeight);
    let weightTotal = 0;

    DiffrentStock.map((item) => {
      weightTotal += Number(item.setWeight);
      return null;
    })

    if (netTotal + weightTotal === grossTotal) {
      return false
    } else {
      return true
    }
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
        percentRegex.test(item.setWeight) === false ||
        checkTotal()
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
          } else if (checkTotal()) {
            dispatch(
              Actions.showMessage({ message: "Enter valid weight" })
            );
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
    const trueFalse = modalValidation();
    if (trueFalse) {
      userFormValues
        .filter((element) => element.stockCode !== "")
        .map((item, index) => {
          return (item.errors.netWeight = null);
        });
      console.log("if");
      // userFormValues[selectedIndex].netWeight = userFormValues[selectedIndex].grossWeight;
      userFormValues[selectedIndex].isWeightDiff = 1
      setUserFormValues(userFormValues)
      setModalOpen(false);
    } else {
      console.log("else");
    }
  };

  const prevIsValid = () => {
    if (userFormValues.length === 0) {
      return true;
    }

    let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

    function setWeight(row) {
      return parseFloat(row.setWeight);
    }

    const someEmpty = userFormValues
      .filter((element) => element.stockCode !== "")
      .some((item) => {
        if (
          parseFloat(item.grossWeight) !== parseFloat(item.netWeight) &&
          item.isWeightDiff === 0
        ) {
          //not same
          return (
            item.stockCode === "" ||
            item.grossWeight === "" ||item.grossWeight == 0 ||
            item.netWeight === "" ||item.netWeight == 0 ||
            item.wastagePer === "" ||
            percentRegex.test(item.wastagePer) === false ||
            parseFloat(item.grossWeight) !==
            parseFloat(item.netWeight) +
            item.DiffrentStock.filter((data) => data.setWeight !== "")
              .map(setWeight)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0)
          );
        } else {
          return (
            item.stockCode === "" ||
            item.grossWeight === "" || item.grossWeight == 0 ||
            item.netWeight === "" || item.netWeight == 0 ||
            item.wastagePer === "" ||
            percentRegex.test(item.wastagePer) === false
          );
        }
      });

    console.log(someEmpty);

    if (someEmpty) {
      userFormValues
        .filter((element) => element.stockCode !== "")
        .map((item, index) => {
          const allPrev = [...userFormValues];
          // console.log(item);

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

          let weightRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
          let gWeight = userFormValues[index].grossWeight;
          if (!gWeight || weightRegex.test(gWeight) === false ||gWeight ==0) {
            allPrev[index].errors.grossWeight = "Enter Gross Weight!";
          } else {
            allPrev[index].errors.grossWeight = null;
          }

          let netWeight = userFormValues[index].netWeight;
          if (!netWeight || weightRegex.test(netWeight) === false || netWeight== 0 ){
            allPrev[index].errors.netWeight = "Enter Net Weight!";
          } else {
            allPrev[index].errors.netWeight = null;
          }

          if (parseFloat(netWeight) > parseFloat(gWeight)) {
            allPrev[index].errors.netWeight =
              "Net Weight Can not be Greater than Gross Weight";
          } else {
            allPrev[index].errors.netWeight = null;
          }

          if (netWeight !== "") {
            if (
              parseFloat(gWeight) !== parseFloat(netWeight) &&
              userFormValues[index].setStockCodeId === ""
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

            if (
              parseFloat(item.grossWeight) !==
              parseFloat(item.netWeight) + parseFloat(tempSetWeight)
            ) {
              console.log("err");
              allPrev[index].errors.netWeight = "Weight Doesn't match";
            } else {
              console.log("else");

              allPrev[index].errors.netWeight = null;
            }
          }
          // item.wastagePer === "" ||
          //   percentRegex.test(item.wastagePer) === false ||
          let wastagePer = userFormValues[index].wastagePer;
          if (!wastagePer || percentRegex.test(wastagePer) === false) {
            allPrev[index].errors.wastagePer = "Enter Wastage!";
          } else {
            allPrev[index].errors.wastagePer = null;
          }
          let tag_amount_after_discount =
            userFormValues[index].tag_amount_after_discount;
          if (
            !tag_amount_after_discount ||
            percentRegex.test(tag_amount_after_discount) === false
          ) {
            allPrev[index].errors.tag_amount_after_discount =
              "Enter Tag Amount After Discount";
          } else {
            allPrev[index].errors.tag_amount_after_discount = null;
          }
          let tag_amount_before_discount =
            userFormValues[index].tag_amount_before_discount;
          if (
            !tag_amount_before_discount ||
            percentRegex.test(tag_amount_before_discount) === false
          ) {
            allPrev[index].errors.tag_amount_before_discount =
              "Enter Tag Amount Before Discount";
          } else {
            allPrev[index].errors.tag_amount_before_discount = null;
          }
          console.log(allPrev[index]);
          setUserFormValues(allPrev);
          return null;
        });
    }

    return !someEmpty;
  };

  function addUserInputApi(resetFlag, toBePrint) {
    let Orders = userFormValues
      .filter((element) => element.grossWeight !== "")
      .map((x) => {
        if (parseFloat(x.grossWeight) !== parseFloat(x.netWeight)) {
          return {
            stock_name_code_id: x.stockCode.value,
            gross_weight: x.grossWeight,
            net_weight: x.netWeight,
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
            Wastage_percentage: x.wastagePer,
            tag_amount_after_discount: x.tag_amount_after_discount,
            tag_amount_before_discount: x.tag_amount_before_discount,
          };
        } else {
          return {
            stock_name_code_id: x.stockCode.value,
            gross_weight: x.grossWeight,
            net_weight: x.netWeight,
            Wastage_percentage: x.wastagePer,
            tag_amount_after_discount: x.tag_amount_after_discount,
            tag_amount_before_discount: x.tag_amount_before_discount,
            ...(x.pieces !== "" && {
              pcs: x.pieces, //user input
            }),
          };
        }
      });
    console.log(Orders);

    if (Orders.length === 0) {
      dispatch(Actions.showMessage({ message: "Please Add Purchase Entry" }));
      return;
    }
    setLoading(true);
    const body = {
      voucher_no: voucherNumber,
      party_voucher_no: partyVoucherNum,
      voucherId: selectedVoucher,
      opposite_account_id: oppositeAccSelected.value,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      jobworker_id: selectedJobWorker.value,
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      fine_rate: fineRate,
      round_off: roundOff === "" ? 0 : roundOff,
      jewellery_narration: jewelNarration,
      account_narration: accNarration,
      Orders: Orders,
      ...(is_tds_tcs === "1" && {
        tcs_rate: ledgerAmount,
      }),
      uploadDocIds: docIds,
      party_voucher_date:partyVoucherDate,
    }
    console.log("bodyyy", body)
    axios
      .post(Config.getCommonUrl() + "api/stockJVJewelleryPurchaseArtician", body)
      .then(function (response) {
        console.log(response);
        setLoading(false);

        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.goBack();
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
        handleError(error, dispatch, { api: "api/stockJVJewelleryPurchaseArtician", body: body })
      });
  }

  function handleFile(e) {
    e.preventDefault();
    console.log("handleFile");
    var files = e.target.files,
      f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      let readedData = XLSX.read(data, { type: "binary" });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];

      //convert to json objects
      const dataParse = XLSX.utils.sheet_to_json(ws);
      console.log(dataParse);

      /* Convert array to json*/
      // const dataParse = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // console.log(dataParse);

      // dataParse.splice(0, 1); //removing headers

      function totalFine(item) {
        let Net_Wt = undefined;

        if (selectedLoad === "2") {
          // req.body.is_barcoded == globalVariable.superAdmin.IsMain        )
          if (item.Stone_Wt) {
            Net_Wt = parseFloat(item.Gross_Wt) - parseFloat(item.Stone_Wt);
            // console.log("Stone_Wt",parseFloat(item.Stone_Wt),"Net_Wt", Net_Wt,1)
          }
        } else {
          Net_Wt =
            parseFloat(item.Gross_Wt) -
            parseFloat(item.Stone_Wt) * parseFloat(item.Stone_Pcs);
        }

        if (item.Beads_Wt) {
          if (Net_Wt) {
            Net_Wt = parseFloat(Net_Wt) - parseFloat(item.Beads_Wt);
            // console.log(Net_Wt,11)
          } else {
            Net_Wt = parseFloat(Net_Wt) - parseFloat(item.Beads_Wt);
            // console.log(Net_Wt,12)
          }
        }

        if (item.Solitaire_Wt) {
          if (Net_Wt) {
            Net_Wt = parseFloat(Net_Wt) - parseFloat(item.Solitaire_Wt);
            // console.log(Net_Wt,21)
          } else {
            Net_Wt = parseFloat(item.Gross_Wt) - parseFloat(item.Solitaire_Wt);
            // console.log(Net_Wt,22)
          }
        }

        if (item.Oth_wt) {
          if (Net_Wt) {
            Net_Wt = parseFloat(Net_Wt) - parseFloat(item.Oth_wt);
          } else {
            Net_Wt = parseFloat(data.Gross_Wt) - parseFloat(item.Oth_wt);
          }
        }
        if (Net_Wt === undefined) {
          Net_Wt = parseFloat(item.Gross_Wt);
        }
        // console.log("Net_Wt", Net_Wt)

        // console.log("fineGold",(parseFloat(Net_Wt).toFixed(3) * parseFloat(item.Purity))/100)
        let finegold = (parseFloat(Net_Wt) * parseFloat(item.Purity)) / 100;
        let wastage = (Net_Wt * parseFloat(item.Wastage_percentage)) / 100;
        // console.log("finegold",finegold)
        // console.log("total ",finegold + wastage)
        return finegold + wastage;
      }
      // console.log(formValues)
      let fileWeight = 0; //user input total weight

      function sum(prev, next) {
        return prev + next;
      }

      //fine gold
      fileWeight = dataParse.map(totalFine).reduce(sum, 0);

      console.log(fileWeight);

      // console.log(fileWeight);
      // if (parseFloat(fileWeight) <= parseFloat(tempApiWeight)) {
      //if file gross weight is less or equal then upload it and then after set rate
      uploadfileapicall(f);
      setFileSelected(f);
      // setTotalGrossWeight(fileWeight);
      setFineGoldTotal(parseFloat(fileWeight).toFixed(3));
      // } else if (parseFloat(fileWeight) > parseFloat(tempApiWeight)) {
      //   //file weight is greater than api weight then fix rate from user then upload file
      //   dispatch(Actions.showMessage({ message: "Please Fix the Rate" }));
      //   setFineGoldTotal(fileWeight);
      //   // setCanEnterVal(true);
      //   // setShortageRfix(parseFloat(fileWeight) - parseFloat(tempApiWeight));
      //   setFileSelected(f);
      //   setIsuploaded(true);
      // }
      // setFileRfixData(fileWeight)
    };
    reader.readAsBinaryString(f);
  }

  function uploadfileapicall(f) {
    const formData = new FormData();
    formData.append("file", f);
    formData.append("voucher_no", voucherNumber);
    formData.append("voucherId", JSON.stringify(selectedVoucher));
    formData.append("party_voucher_no", partyVoucherNum);
    formData.append("opposite_account_id", oppositeAccSelected.value);
    formData.append(
      "department_id", window.localStorage.getItem("SelectedDepartment")
    );
    formData.append("jobworker_id", selectedJobWorker.value);
    formData.append("round_off", roundOff === "" ? 0 : roundOff);
    formData.append("jewellery_narration", jewelNarration);
    formData.append("account_narration", accNarration);
    formData.append("fine_rate", fineRate);

    // "0" = Load Lot directly (from Excel)
    // "1" = Load Barcoded Stock form excel
    if (selectedLoad === "2") {
      // is_barcoded
      formData.append("is_barcoded", 1);
      formData.append("with_bom", bomType);
    }
    if (allowedBackDate) {
      formData.append("purchaseCreateDate", voucherDate);
    }
    if (is_tds_tcs === "1") {
      formData.append("tcs_rate", ledgerAmount);
    }
    // ...(allowedBackDate && {
    //   purchaseCreateDate: voucherDate,
    // }),
    let Url =
      selectedLoad === "2"
        ? "api/stockJVJewelleryPurchaseArtician/createfromexcel/barcode"
        : "api/stockJVJewelleryPurchaseArtician/createfromexcel";

    setLoading(true);
    axios
      .post(Config.getCommonUrl() + Url, formData)
      .then(function (response) {
        console.log(response);
        setLoading(false);
        if (response.data.success === true) {
          // console.log(response);

          setIsCsvErr(false);
          let productData = [];
          let OrdersData = response.data.data.finalrecord;
          if (selectedLoad === "2") {
            productData = response.data.data.categoryData;
          }
          let tempArray = [];
          let bomArr = [];
          // console.log(OrdersData);
          for (let item of OrdersData) {
            // console.log(item);
            tempArray.push({
              loadType: selectedLoad,
              category: item.Category,
              billingCategory: item.billingCategoryName,
              HSNNum: jobworkerHSN,//item.hsnNumber,
              lotNumber: item.lotNumber,
              pieces: item.pcs,
              grossWeight: item.gross_wt,
              netWeight: item.net_wt,
              purity: item.purity,
              variant_number:item.design_no,
              jobworkFineUtilize: parseFloat(item.jobwork_fine_utilize).toFixed(
                3
              ),
              wastagePer: parseFloat(item.wastage_per).toFixed(3),
              wastageFine: parseFloat(item.wastage_fine).toFixed(3),
              fineRate: parseFloat(item.fine_rate).toFixed(3),
              labourFineAmount: parseFloat(item.labour_fine_amount).toFixed(3),
              tag_amount_after_discount: parseFloat(
                item.tag_amount_after_discount
              ).toFixed(3),
              tag_amount_before_discount: parseFloat(
                item.tag_amount_before_discount
              ).toFixed(3),
              catRatePerGram: parseFloat(item.category_rate).toFixed(3),
              totalAmount: parseFloat(item.total_amount).toFixed(3),
              ...(vendorStateId === 12 && {
                cgstPer: (parseFloat(jobWorkerGst) / 2), //show gst % of product and calculate with jobworker's gst
                cgstVal: parseFloat(
                  (parseFloat(item.total_amount) *
                    (parseFloat(jobWorkerGst) / 2)) /
                  100
                ).toFixed(3),
                sGstPer: (parseFloat(jobWorkerGst) / 2),
                sGstVal: parseFloat(
                  (parseFloat(item.total_amount) *
                    (parseFloat(jobWorkerGst) / 2)) /
                  100
                ).toFixed(3),
              }),
              ...(vendorStateId !== 12 && {
                IGSTper: jobWorkerGst,
                IGSTVal: parseFloat(
                  (parseFloat(item.total_amount) * parseFloat(jobWorkerGst)) /
                  100
                ).toFixed(3),
              }),
              total: parseFloat(item.total).toFixed(3),
            });
          }
          if (selectedLoad === "1") {
            // setFormValues(tempArray);
            setLotList(tempArray)

            for (let bom of response.data.data.lotDetail) {
              bomArr.push({
                lotNumber: bom.number,
                stock_name_code: bom.DesignStockCodes.stock_name_code,
                design_no: bom.LotDesignData.variant_number,
                design_pcs: bom.design_pcs,
                batch_no: bom.batch_no,
                pcs: bom.pcs,
                weight: bom.weight,
              })
            }

            setBomList(bomArr)
          }

          let tempcatArr = [];
          if (selectedLoad === "2") {


            for (let item of productData) {
              tempcatArr.push({
                loadType: selectedLoad,
                category: item.Category,
                billingCategory: item.billingCategoryName,
                HSNNum: jobworkerHSN,//item.hsnNumber,
                lotNumber: item.lotNumber,
                pieces: item.pcs,
                grossWeight: item.gross_wt,
                netWeight: item.net_wt,
                purity: item.purity,
                jobworkFineUtilize: parseFloat(
                  item.jobwork_fine_utilize
                ).toFixed(3),
                wastagePer: parseFloat(item.wastage_per).toFixed(3),
                wastageFine: parseFloat(item.wastage_fine).toFixed(3),
                fineRate: parseFloat(item.fine_rate).toFixed(3),
                labourFineAmount: parseFloat(item.labour_fine_amount).toFixed(
                  3
                ),
                tag_amount_after_discount: parseFloat(
                  item.tag_amount_after_discount
                ).toFixed(3),
                tag_amount_before_discount: parseFloat(
                  item.tag_amount_before_discount
                ).toFixed(3),
                catRatePerGram: parseFloat(item.category_rate).toFixed(3),
                totalAmount: parseFloat(item.total_amount).toFixed(3),
                ...(vendorStateId === 12 && {
                  cgstPer: (parseFloat(jobWorkerGst) / 2), //show gst % of product and calculate with jobworker's gst
                  cgstVal: parseFloat(
                    (parseFloat(item.total_amount) *
                      (parseFloat(jobWorkerGst) / 2)) /
                    100
                  ).toFixed(3),
                  sGstPer: (parseFloat(jobWorkerGst) / 2),
                  sGstVal: parseFloat(
                    (parseFloat(item.total_amount) *
                      (parseFloat(jobWorkerGst) / 2)) /
                    100
                  ).toFixed(3),
                }),
                ...(vendorStateId !== 12 && {
                  IGSTper: jobWorkerGst,
                  IGSTVal: parseFloat(
                    (parseFloat(item.total_amount) * parseFloat(jobWorkerGst)) /
                    100
                  ).toFixed(3),
                }),
                total: parseFloat(item.total).toFixed(3),
              });
            }
            setProductData(tempcatArr); //category wise Data
            setTagWiseData(tempArray);
          }

          function totalFine(item) {
            return parseFloat(item.totalFine);
          }

          let tempFineGold = tempArray
            .filter((item) => item.totalFine !== "")
            .map(totalFine)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            });

          setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

          function grossWeight(item) {
            // console.log(parseFloat(item.grossWeight));
            return parseFloat(item.grossWeight);
          }

          let tempGrossWtTot = tempArray
            // .filter((data) => data.grossWeight !== "")
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

          let tempNetWtTot = tempArray
            .filter((data) => data.netWeight !== "")
            .map(netWeight)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0)

          setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

          function pscTotal(item) {
            return item.pieces;
          }
          let tempPcsTotal = tempArray
            .filter((item) => item.pieces !== "")
            .map(pscTotal)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);
          setPcsTotal(tempPcsTotal)
          // function otherTagAmount(item) {
          //   return item.otherTagAmount;
          // }

          // let tempOthTagAmount = tempArray
          //   // .filter((item) => item.amount !== "")
          //   .map(otherTagAmount)
          //   .reduce(function (a, b) {
          //     // sum all resulting numbers
          //     return parseFloat(a) + parseFloat(b);
          //   }, 0);
          // setOtherTagAmount(parseFloat(tempOthTagAmount).toFixed(3));

          function totalAmount(item) {
            return item.totalAmount;
          }

          let tempTotAmount = tempArray
            // .filter((item) => item.amount !== "")
            .map(totalAmount)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setTotalAmount(parseFloat(tempTotAmount).toFixed(3));

          setSubTotal(parseFloat(tempTotAmount).toFixed(3));

          let tempCGstVal = 0;
          let tempSgstVal = 0;
          let tempIgstVal = 0;

          if (vendorStateId === 12) {
            function CGSTVal(item) {
              return item.cgstVal;
            }

            tempCGstVal = tempArray
              // .filter((item) => item.amount !== "")
              .map(CGSTVal)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);

            setCgstVal(parseFloat(tempCGstVal).toFixed(3));

            function SGSTval(item) {
              return item.sGstVal;
            }

            tempSgstVal = tempArray
              // .filter((item) => item.amount !== "")
              .map(SGSTval)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);

            setSgstVal(parseFloat(tempSgstVal).toFixed(3));

            console.log(
              parseFloat(
                parseFloat(tempCGstVal) + parseFloat(tempSgstVal)
              ).toFixed(3)
            );
            setTotalGST(
              parseFloat(
                parseFloat(tempCGstVal) + parseFloat(tempSgstVal)
              ).toFixed(3)
            );
          } else {
            function IGSTVal(item) {
              return item.IGSTVal;
            }

            tempIgstVal = tempArray
              // .filter((item) => item.amount !== "")
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
          let tempTotal = tempArray
            // .filter((item) => item.amount !== "")
            .map(total)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setTotal(parseFloat(tempTotal).toFixed(3));

          // setTotalInvoiceAmount(parseFloat(tempTotal).toFixed(3));
          // setLegderAmount(((tempTotal * rateValue) / 100).toFixed(3));
          // setFinalAmount(
          //   (
          //     parseFloat(tempTotal) + parseFloat((tempTotal * rateValue) / 100)
          //   ).toFixed(3)
          // );

          let tempLedgerAmount = 0;
          let tempfinalAmount = 0;
          let tempTotalInvoiceAmt = 0;
          // let temptdsTcsAmount =0;

          tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);

          setTotalInvoiceAmount(tempTotalInvoiceAmt);

          if (is_tds_tcs === "1") {
            console.log("if 1");

            //1 is tcs, 2 means tds
            // tempLedgerAmount = parseFloat(
            //   (tempTotalInvoiceAmt * rateValue) / 100
            // ).toFixed(3); //with gst on total invoice amount
            // console.log(tempLedgerAmount);
            //if tcs then enter amount manually
            tempLedgerAmount = 0;
            tempfinalAmount =
              parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount);
          } else if (is_tds_tcs === "2") {
            //tds
            console.log("if 2");

            tempLedgerAmount = parseFloat(
              (parseFloat(tempTotAmount) * rateValue) / 100
            ).toFixed(3); //calculating before gst, on total amount only
            console.log(tempLedgerAmount);
            tempfinalAmount =
              parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount);
          } else {
            console.log("else");

            tempfinalAmount = parseFloat(tempTotalInvoiceAmt);
          }

          setLegderAmount(tempLedgerAmount);

          setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));

          setPrintObj({
            ...printObj,
            // stateId: finalData.jobworker.state,
            // is_tds_tcs: "",
            // supplierName: "",
            // supAddress: "",
            // supplierGstUinNum: "",
            // supPanNum: "",
            // supState: "",
            // supCountry: "",
            // supStateCode: "",
            // purcVoucherNum: "",
            // partyInvNum: "",
            // voucherDate: moment().format("YYYY-MM-DD"),
            // placeOfSupply: "",
            orderDetails: selectedLoad === "2" ? tempcatArr : tempArray,
            taxableAmount: parseFloat(tempTotAmount).toFixed(3),
            sGstTot: vendorStateId === 12 ? tempSgstVal : "",
            cGstTot: vendorStateId === 12 ? tempCGstVal : "",
            iGstTot: vendorStateId !== 12 ? tempIgstVal : "",
            // roundOff: "",
            grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
            netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
            pcsTot: tempPcsTotal,
            totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
            // TDSTCSVoucherNum: "",
            // ledgerName: "",
            taxAmount: parseFloat(tempLedgerAmount).toFixed(3),
            // metNarration: "",
            // accNarration: "",
            balancePayable: parseFloat(tempfinalAmount).toFixed(3)
          })


        } else {
          if (response.data.hasOwnProperty("csverror")) {
            if (response.data.csverror === 1) {
              // console.log("csverror");
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
          }
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);
        // console.log(error);
        document.getElementById("fileinput").value = "";
        handleError(error, dispatch, { api: Url, body: JSON.stringify(formData) })

      });
  }

  function getJobworkerdata() {
    axios
      .get(Config.getCommonUrl() + "api/jobworker/listing/listing")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setJobworkerData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/jobworker/listing/listing" })
      });
  }

  function handleOppAccChange(value) {
    setOppositeAccSelected(value);
    setSelectedOppAccErr("");
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
    } else if (name === "firmName") {
      setFirmName(value);
      setFirmNameErr("");
    } else if (name === "partyVoucherNum") {
      setPartyVoucherNum(value);
      setPartyVoucherNumErr("");
      setPrintObj({
        ...printObj,
        partyInvNum: value,

      })
    } else if (name === "fineRate") {
      setFineRate(value);

      const regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
      if (!value || regex.test(value) === false) {
        setFineRateErr("Enter Valid Fine Rate");
        if (selectedLoad === "1" || selectedLoad === "2") {
          resetFileData()
        } else if (selectedLoad === "0") {
          calculateChangeRate(0)
        }
      } else {
        setFineRateErr("");
        if (selectedLoad === "1" || selectedLoad === "2") {
          resetFileData()
        } else if (selectedLoad === "0") {
          calculateChangeRate(value)
        }
      }

    } else if (name === "tdsTcsVou") {
      setTdsTcsVou(value);
      setTdsTcsVouErr("");
    } else if (name === "jewelNarration") {
      setJewelNarration(value);
      setJewelNarrationErr("");
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
          taxAmount: value,
          TDSTCSVoucherNum: tdsTcsVou,
          ledgerName: ledgerName.label,
          balancePayable: parseFloat(tempfinalAmount).toFixed(3)
        })
      } else {
        setLedgerAmtErr("Please Enter Valid Amount");
        setFinalAmount(parseFloat(totalInvoiceAmount).toFixed(3));
      }
    } else if (name === "roundOff") {
      setRoundOff(value);
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

      if (is_tds_tcs === "1") {
        //1 is tcs, 2 means tds
        // tempLedgerAmount = parseFloat(
        //   (tempTotalInvoiceAmt * rateValue) / 100
        // ).toFixed(3); //with gst on total invoice amount
        // console.log(tempLedgerAmount);
        //if tcs then enter amount manually
        tempLedgerAmount = ledgerAmount;
        tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)).toFixed(3);
      } else if (is_tds_tcs === "2") {
        //tds
        tempLedgerAmount = parseFloat(
          (parseFloat(totalAmount) * rateValue) / 100
        ).toFixed(3); //calculating before gst, on total amount only
        console.log(tempLedgerAmount);
        tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount)).toFixed(3);

      } else {
        tempfinalAmount = parseFloat(tempTotalInvoiceAmt).toFixed(3);
      }

      setLegderAmount(parseFloat(tempLedgerAmount).toFixed(3));
      setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));
      setPrintObj({
        ...printObj,
        roundOff: value,
        totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
        taxAmount: parseFloat(tempLedgerAmount).toFixed(3),
        balancePayable: parseFloat(tempfinalAmount).toFixed(3)
      })
    }
  }

  const resetFileData = () => {

    setProductData([])
    setTagWiseData([])
    setBomList([])
    setLotList([])
    setFileSelected("")
    setIsuploaded(false)

    setFileSelected("")
    if (document.getElementById("fileinput") !== null) {
      document.getElementById("fileinput").value = "";
    }

    setFineGoldTotal("");
    setTotalGrossWeight("");
    setTotalNetWeight("");
    setPcsTotal("")
    setTotalAmount("");
    setSubTotal("");
    setCgstVal("");
    setSgstVal("");
    setTotalGST("");
    setIgstVal("");
    setTotal("");
    setTotalInvoiceAmount("");
    setLegderAmount("");
    setFinalAmount("");

    setPrintObj({
      ...printObj,
      orderDetails: [],
      taxableAmount: "",
      sGstTot: "",
      cGstTot: "",
      iGstTot: "",
      grossWtTOt: "",
      netWtTOt: "",
      pcsTot: "",
      totalInvoiceAmt: "",
      taxAmount: "",
      balancePayable: ""
    })
  }

  const calculateChangeRate = (locFineRate) => {
    let newFormValues = [...userFormValues];

    newFormValues.map((item) => {
      if (item.stockCode) {
        item.rate = parseFloat(locFineRate).toFixed(3)
      }

      if (item.wastageFine !== "" && item.rate !== "") {
        item.labourFineAmount = parseFloat(
          (parseFloat(item.wastageFine) *
            parseFloat(item.rate)) /
          10
        ).toFixed(3);
      }

      if (
        item.labourFineAmount !== "" &&
        item.tag_amount_after_discount !== ""
      ) {
        item.totalAmount = parseFloat(
          parseFloat(item.labourFineAmount) +
          parseFloat(item.tag_amount_after_discount)
        ).toFixed(3);
      } else {
        item.totalAmount = item.labourFineAmount;
      }

      if (
        item.totalAmount !== "" &&
        item.netWeight !== ""
      ) {
        item.catRatePerGram = parseFloat(
          (parseFloat(item.totalAmount) /
            parseFloat(item.netWeight)) *
          10
        ).toFixed(3);
      }

      if (vendorStateId === 12) {
        // console.log("vendorStateId cond")
        if (
          item.totalAmount !== "" &&
          item.cgstPer !== ""
        ) {
          // console.log("if COnd")
          item.cgstVal = parseFloat(
            (parseFloat(item.totalAmount) *
              (parseFloat(jobWorkerGst) / 2)) /
            100
          ).toFixed(3);

          item.sGstVal = parseFloat(
            (parseFloat(item.totalAmount) *
              (parseFloat(jobWorkerGst) / 2)) /
            100
          ).toFixed(3);
          item.total = parseFloat(
            parseFloat(item.totalAmount) +
            parseFloat(item.sGstVal) +
            parseFloat(item.cgstVal)
          ).toFixed(3);
        } else {
          item.cgstVal = "";
          item.sGstVal = "";
          item.total = "";
        }
      } else {
        if (
          item.totalAmount !== "" &&
          item.IGSTper !== ""
        ) {
          item.IGSTVal = parseFloat(
            (parseFloat(item.totalAmount) *
              parseFloat(jobWorkerGst)) /
            100
          ).toFixed(3);
          item.total = parseFloat(
            parseFloat(item.totalAmount) +
            parseFloat(item.IGSTVal)
          ).toFixed(3);
        } else {
          item.IGSTVal = "";
          item.total = "";
        }
      }
    })

    function amount(item) {
      // console.log(item.amount)
      return item.totalAmount;
    }

    function jobworkFineUtilize(item) {
      return parseFloat(item.jobworkFineUtilize);
    }

    let tempFineTot = newFormValues
      .filter((item) => item.jobworkFineUtilize !== "")
      .map(jobworkFineUtilize)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setFineTotal(parseFloat(tempFineTot).toFixed(3));

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
    // console.log(formValues.map(amount).reduce(sum))

    let tempAmount = newFormValues
      .filter((item) => item.totalAmount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    //.reduce(sum);
    // console.log("tempAmount",tempAmount)
    setTotalAmount(parseFloat(tempAmount).toFixed(3));
    setSubTotal(parseFloat(tempAmount).toFixed(3));

    function pscTotal(item) {
      return item.pieces;
    }
    let tempPcsTotal = newFormValues
      .filter((item) => item.pieces !== "")
      .map(pscTotal)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setPcsTotal(tempPcsTotal)

    let tempCgstVal;
    let tempSgstVal;
    let tempIgstVal;
    if (vendorStateId === 12) {
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
      setTotalGST((parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3));

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

    let tempGrossWtTot = newFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)

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
      }, 0)

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

    function fine(item) {
      return parseFloat(item.fine);
    }

    let tempFineGold = newFormValues
      .filter((item) => item.fine !== "")
      .map(fine)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setFineGoldTotal(tempFineGold);

    let tempLedgerAmount = 0;
    let tempfinalAmount = 0;
    let tempTotalInvoiceAmt = 0;
    // setShortageRfix(tempFineGold);
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

      if (is_tds_tcs === "1") {
        //1 is tcs, 2 means tds
        // tempLedgerAmount = parseFloat(
        //   (tempTotalInvoiceAmt * rateValue) / 100
        // ).toFixed(3); //with gst on total invoice amount
        // console.log(tempLedgerAmount);
        //if tcs then enter amount manually
        tempLedgerAmount = 0;
        tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)).toFixed(3);

      } else if (is_tds_tcs === "2") {
        //tds
        tempLedgerAmount = parseFloat(
          (parseFloat(tempAmount) * rateValue) / 100
        ).toFixed(3); //calculating before gst, on total amount only
        console.log(tempLedgerAmount);
        tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount)).toFixed(3);

      } else {
        tempfinalAmount = parseFloat(tempTotalInvoiceAmt).toFixed(3);
      }

      setLegderAmount(tempLedgerAmount);

      setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));
    } else {
      setTotalInvoiceAmount(0);
      setLegderAmount(0);
    }

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
      pcsTot: tempPcsTotal,
      totalInvoiceAmt: tempTotalInvoiceAmt,
      taxAmount: tempLedgerAmount,
      balancePayable: parseFloat(tempfinalAmount).toFixed(3)
    })
    setUserFormValues(newFormValues);
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

  function bomTypeValidation() {
    if (bomType === "") {
      setBomTypeErr("Please Select Bom Type");
      return false;
    }
    return true;
  }

  function partyNameValidation() {
    if (selectedJobWorker === "") {
      setSelectedJobWorkerErr("Please Select Job worker");
      return false;
    }
    return true;
  }

  function partyVoucherNumValidation() {
    // const Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (partyVoucherNum === "") {
      setPartyVoucherNumErr("Enter Valid Voucher Number");
      return false;
    }
    return true;
  }
  function checkAmount() {
    console.log(typeof(finalAmount),"type")
    if ( ledgerAmtErr || finalAmount === "" || finalAmount== 0 || finalAmount== "NaN") {
      console.log(typeof(finalAmount),"type")
      return false;
    }
    return true;
  }

  // function FineRateValidaion() {
  //   // fineRate
  //   const regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
  //   if (!fineRate || regex.test(fineRate) === false) {
  //     setFineRateErr("Enter Valid Fine Rate");
  //     return false;
  //   }
  //   return true;
  // }

  function oppositeAcValidation() {
    if (oppositeAccSelected === "") {
      setSelectedOppAccErr("Please Select Opposite Account");
      return false;
    }
    return true;
  }

  const regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
  const isEnabled =
    selectedLoad !== "" &&
    firmName !== "" &&
    oppositeAccSelected !== "" &&
    selectedJobWorker !== "" &&
    // fineRate !== "" &&
    regex.test(fineRate) &&
    partyVoucherNum !== "";

  function handleFormSubmit(ev) {
    ev.preventDefault();
    // resetForm();
    console.log("handleFormSubmit");
    if (
      voucherNumValidation() &&
      partyNameValidation() &&
      oppositeAcValidation() &&
      partyVoucherNumValidation() &&
      checkAmount()
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (selectedLoad === "0") {
        //check prev valid
        if (prevIsValid()) {
          addUserInputApi(true, false);
        }
      } else {
        addJewellaryPuchaseApi(true, false);
      }
    } else {
      console.log("else");
    }
  }

  function addJewellaryPuchaseApi(resetFlag, toBePrint) {
    if (isVoucherSelected === false) {
      setSelectVoucherErr("Please Select Voucher");
      // dispatch(Actions.showMessage({ message: "Please Add remaining rate" }));
      console.log("if");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileSelected);
    formData.append("voucherId", JSON.stringify(selectedVoucher));
    formData.append("voucher_no", voucherNumber);
    formData.append("party_voucher_no", partyVoucherNum);
    formData.append("opposite_account_id", oppositeAccSelected.value);
    formData.append(
      "department_id",
      window.localStorage.getItem("SelectedDepartment")
    );
    formData.append("jobworker_id", selectedJobWorker.value);
    formData.append("round_off", roundOff === "" ? 0 : roundOff);
    formData.append("jewellery_narration", jewelNarration);
    formData.append("account_narration", accNarration);
    formData.append("fine_rate", fineRate);

    formData.append("uploadDocIds", JSON.stringify(docIds))
    formData.append("party_voucher_date", partyVoucherDate)
    // "0" = Load Lot directly (from Excel)
    // "1" = Load Barcoded Stock form excel
    if (selectedLoad === "2") {
      // is_barcoded
      formData.append("is_barcoded", 1);
      formData.append("with_bom", bomType);
    }
    if (allowedBackDate) {
      formData.append("purchaseCreateDate", voucherDate);
    }
    if (is_tds_tcs === "1") {
      formData.append("tcs_rate", ledgerAmount);
    }
    // ...(allowedBackDate && {
    //   purchaseCreateDate: voucherDate,
    // }),
    let Url =
      selectedLoad === "2"
        ? "api/stockJVJewelleryPurchaseArtician/createfromexcel/barcode?save=1"
        : "api/stockJVJewelleryPurchaseArtician/createfromexcel?save=1";
    setLoading(true);
    axios
      .post(Config.getCommonUrl() + Url, formData)
      .then(function (response) {
        console.log(response);
        setLoading(false);
        if (response.data.success === true) {
          // console.log(response);
          // setIsCsvErr(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.goBack();
          if (resetFlag === true) {
            checkAndReset()
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record 
            handlePrint();
          }

          // setSelectedLoad("");
          // setUploadType("");
          // reset();
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
        handleError(error, dispatch, { api: Url, body: JSON.stringify(formData) })

      });
  }

  function reset() {
    setOppositeAccSelected("");
    setVoucherDate(moment().format("YYYY-MM-DD"));
    if (document.getElementById("fileinput") !== null) {
      document.getElementById("fileinput").value = "";
    }
    setSelectedJobWorker("");
    setFirmName("");
    setCsvData("");
    setIsCsvErr(false);
    setSubTotal("");
    setTotalGST("");
    // setSelectedRateFixErr("");
    setPartyVoucherNum("");
    // setSelectedDepartment("");
    setRoundOff("");
    setTotalInvoiceAmount("");
    setFineRate("");
    setTdsTcsVou("");
    setLedgerName("");
    setRateValue("");
    setLegderAmount("");
    setFinalAmount("");
    setAccNarration("");
    setJewelNarration("");
    setFineGoldTotal("");
    setIsVoucherSelected(false);
    setSelectedVoucher([]);
    setVoucherApiData([]);
    setVendorStateId("");
    // setTempApiRate("");
    setIs_tds_tcs("");
    setTotalGrossWeight("");
    setTotalNetWeight("")
    // setOtherTagAmount("");
    // setAmount("");
    // setHallmarkCharges("");
    setTotalAmount("");
    setIgstVal("");
    setTotal("");
    setFileSelected("");
    setIsuploaded(false);
    setProductData([]); //category wise Data
    setTagWiseData([]);
    setLotList([]);
    setBomList([]);

    setUserFormValues([
      {
        stockCode: "",
        stockName: "",
        HSNNum: "",
        billingCategory: "",
        purity: "",
        color: "",
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
        wastagePer: "",
        wastageFine: "",
        jobworkFineUtilize: "",
        labourFineAmount: "",
        catRatePerGram: "",
        rate: "",
        tag_amount_after_discount: "",
        tag_amount_before_discount: "",
        totalAmount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        errors: {
          stockCode: null,
          stockName: null,
          HSNNum: null,
          billingCategory: null,
          purity: null,
          color: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          wastagePer: null,
          wastageFine: null,
          jobworkFineUtilize: null,
          labourFineAmount: null,
          catRatePerGram: null,
          tag_amount_after_discount: null,
          tag_amount_before_discount: null,
          rate: null,
          totalAmount: null,
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
        stockCode: "",
        stockName: "",
        HSNNum: "",
        billingCategory: "",
        purity: "",
        color: "",
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
        wastagePer: "",
        wastageFine: "",
        jobworkFineUtilize: "",
        labourFineAmount: "",
        catRatePerGram: "",
        rate: "",
        tag_amount_after_discount: "",
        tag_amount_before_discount: "",
        totalAmount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        errors: {
          stockCode: null,
          stockName: null,
          HSNNum: null,
          billingCategory: null,
          purity: null,
          color: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          wastagePer: null,
          wastageFine: null,
          jobworkFineUtilize: null,
          labourFineAmount: null,
          catRatePerGram: null,
          rate: null,
          tag_amount_after_discount: null,
          tag_amount_before_discount: null,
          totalAmount: null,
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
        stockCode: "",
        stockName: "",
        HSNNum: "",
        billingCategory: "",
        purity: "",
        color: "",
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
        wastagePer: "",
        wastageFine: "",
        jobworkFineUtilize: "",
        labourFineAmount: "",
        catRatePerGram: "",
        rate: "",
        tag_amount_after_discount: "",
        tag_amount_before_discount: "",
        totalAmount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        errors: {
          stockCode: null,
          stockName: null,
          HSNNum: null,
          billingCategory: null,
          purity: null,
          color: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          wastagePer: null,
          wastageFine: null,
          jobworkFineUtilize: null,
          labourFineAmount: null,
          catRatePerGram: null,
          rate: null,
          tag_amount_after_discount: null,
          tag_amount_before_discount: null,
          totalAmount: null,
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
        stockCode: "",
        stockName: "",
        HSNNum: "",
        billingCategory: "",
        purity: "",
        color: "",
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
        wastagePer: "",
        wastageFine: "",
        jobworkFineUtilize: "",
        labourFineAmount: "",
        catRatePerGram: "",
        rate: "",
        tag_amount_after_discount: "",
        tag_amount_before_discount: "",
        totalAmount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        errors: {
          stockCode: null,
          stockName: null,
          HSNNum: null,
          billingCategory: null,
          purity: null,
          color: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          wastagePer: null,
          wastageFine: null,
          jobworkFineUtilize: null,
          labourFineAmount: null,
          catRatePerGram: null,
          rate: null,
          tag_amount_after_discount: null,
          tag_amount_before_discount: null,
          totalAmount: null,
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

  function handleLoadChange(event) {
    setSelectedLoad(event.target.value);
    setSelectedLoadErr("");
    reset();
  }

  function handleBomTypeChange(event) {
    setBomType(event.target.value);
    setBomTypeErr("");
  }

  function resetFormOnly() {
    if (document.getElementById("fileinput") !== null) {
      document.getElementById("fileinput").value = "";
    }

    setCsvData("");
    setIsCsvErr(false);
    setSubTotal("");
    setTotalGST("");
    // setIs_tds_tcs("")
    // setSelectedRateFixErr("");
    setPartyVoucherNum("");
    // setSelectedDepartment("");
    setRoundOff("");
    setTotalInvoiceAmount("");
    setFineRate("");
    setTdsTcsVou("");
    setLedgerName("");
    setRateValue("");
    setLegderAmount("");
    setFinalAmount("");
    setAccNarration("");
    setJewelNarration("");
    setIsVoucherSelected(false);
    setSelectedVoucher([]);
    setVoucherApiData([]);
    setVendorStateId("");
    // setTempApiRate("");
    setTotalGrossWeight("");
    setTotalNetWeight("")
    // setOtherTagAmount("");
    // setAmount("");
    // setHallmarkCharges("");
    setTotalAmount("");
    setIgstVal("");
    setTotal("");
    setFileSelected("");
    setIsuploaded(false);
    setProductData([]); //category wise Data
    setTagWiseData([]);
    setLotList([]);
    setBomList([]);
    setFineTotal("")
    setPcsTotal("")
    setUserFormValues([
      {
        stockCode: "",
        stockName: "",
        HSNNum: "",
        billingCategory: "",
        purity: "",
        color: "",
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
        wastagePer: "",
        wastageFine: "",
        jobworkFineUtilize: "",
        labourFineAmount: "",
        catRatePerGram: "",
        rate: "",
        tag_amount_after_discount: "",
        tag_amount_before_discount: "",
        totalAmount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        errors: {
          stockCode: null,
          stockName: null,
          HSNNum: null,
          billingCategory: null,
          purity: null,
          color: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          wastagePer: null,
          wastageFine: null,
          jobworkFineUtilize: null,
          labourFineAmount: null,
          catRatePerGram: null,
          tag_amount_after_discount: null,
          tag_amount_before_discount: null,
          rate: null,
          totalAmount: null,
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
        stockCode: "",
        stockName: "",
        HSNNum: "",
        billingCategory: "",
        purity: "",
        color: "",
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
        wastagePer: "",
        wastageFine: "",
        jobworkFineUtilize: "",
        labourFineAmount: "",
        catRatePerGram: "",
        rate: "",
        tag_amount_after_discount: "",
        tag_amount_before_discount: "",
        totalAmount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        errors: {
          stockCode: null,
          stockName: null,
          HSNNum: null,
          billingCategory: null,
          purity: null,
          color: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          wastagePer: null,
          wastageFine: null,
          jobworkFineUtilize: null,
          labourFineAmount: null,
          catRatePerGram: null,
          rate: null,
          tag_amount_after_discount: null,
          tag_amount_before_discount: null,
          totalAmount: null,
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
        stockCode: "",
        stockName: "",
        HSNNum: "",
        billingCategory: "",
        purity: "",
        color: "",
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
        wastagePer: "",
        wastageFine: "",
        jobworkFineUtilize: "",
        labourFineAmount: "",
        catRatePerGram: "",
        rate: "",
        tag_amount_after_discount: "",
        tag_amount_before_discount: "",
        totalAmount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        errors: {
          stockCode: null,
          stockName: null,
          HSNNum: null,
          billingCategory: null,
          purity: null,
          color: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          wastagePer: null,
          wastageFine: null,
          jobworkFineUtilize: null,
          labourFineAmount: null,
          catRatePerGram: null,
          rate: null,
          tag_amount_after_discount: null,
          tag_amount_before_discount: null,
          totalAmount: null,
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
        stockCode: "",
        stockName: "",
        HSNNum: "",
        billingCategory: "",
        purity: "",
        color: "",
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
        wastagePer: "",
        wastageFine: "",
        jobworkFineUtilize: "",
        labourFineAmount: "",
        catRatePerGram: "",
        rate: "",
        tag_amount_after_discount: "",
        tag_amount_before_discount: "",
        totalAmount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        errors: {
          stockCode: null,
          stockName: null,
          HSNNum: null,
          billingCategory: null,
          purity: null,
          color: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          wastagePer: null,
          wastageFine: null,
          jobworkFineUtilize: null,
          labourFineAmount: null,
          catRatePerGram: null,
          rate: null,
          tag_amount_after_discount: null,
          tag_amount_before_discount: null,
          totalAmount: null,
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

  function handlePartyChange(value) {
    setSelectedJobWorker(value);
    setSelectedJobWorkerErr("");
    setIsVoucherSelected(false);
    setSelectedVoucher([]);
    setVoucherApiData([]);
    resetFormOnly();

    const index = jobworkerData.findIndex(
      (element) => element.id === value.value
    );
    console.log(index);

    if (index > -1) {
      console.log(jobworkerData[index]);
      setFirmName(jobworkerData[index].firm_name);
      setVendorStateId(jobworkerData[index].state_name.id);
      // console.log(jobworkerData[index].state_name.id);
      setIs_tds_tcs(jobworkerData[index].is_tds_tcs.toString());
      // console.log(jobworkerData[index].is_tds_tcs);
      // console.log(jobworkerData[index]);
      // console.log(findClosestPrevDate(jobworkerData[index].LedgerMaster.LedgerRate,moment().format("YYYY-MM-DD")))
      if (
        jobworkerData[index].is_tds_tcs !== "0" &&
        jobworkerData[index].LedgerMaster !== null
      ) {
        let r1 = findClosestPrevDate(
          jobworkerData[index].LedgerMaster.LedgerRate,
          moment().format("YYYY-MM-DD")
        );
        setLedgerName(jobworkerData[index].LedgerMaster.Ledger.name);
        setLedgerNmErr("");

        setRateValue(r1.rate);
        setRateValErr("");

        getTdsTcsVoucherNum(jobworkerData[index].LedgerMaster.id, jobworkerData[index]);
      } else {
        setTdsTcsVou("");
        setLedgerName("");
        setRateValue("");
        setPrintObj({
          ...printObj,
          is_tds_tcs: jobworkerData[index].is_tds_tcs,
          stateId: jobworkerData[index].state_name.id,
          supplierName: jobworkerData[index].firm_name,
          supAddress: jobworkerData[index].address,
          supplierGstUinNum: jobworkerData[index].gst_number,
          supPanNum: jobworkerData[index].pan_number,
          supState: jobworkerData[index].state_name.name,
          supCountry: jobworkerData[index].country_name.name,
          supStateCode: (jobworkerData[index].gst_number) ? jobworkerData[index].gst_number.substring(0, 2) : '',
          // purcVoucherNum: "",
          // partyInvNum: "",
          voucherDate: moment().format("DD-MM-YYYY"),
          placeOfSupply: jobworkerData[index].state_name.name,
          orderDetails: [],
          taxableAmount: "",
          sGstTot: "",
          cGstTot: "",
          iGstTot: "",
          roundOff: "",
          grossWtTOt: "",
          netWtTOt: "",
          pcsTot: "",
          totalInvoiceAmt: "",
          TDSTCSVoucherNum: "",
          ledgerName: "",
          taxAmount: "",
          metNarration: "",
          accNarration: "",
          balancePayable: ""
        })
      }
      setLegderAmount(0); //everything is goinf to reset so 0
      if (selectedLoad === "0") {//if 1 then no need to call api, wastage % will come from api
        getVendorRateProfile(value.value);
      }
    }
    getVouchers(value.value);
  }

  // jobworker - 0
  // vendor - 1
  function getVendorRateProfile(jobworkerID) {
    axios
      .get(Config.getCommonUrl() + `api/jobWorkerRateProfile/readAllRate/0/${jobworkerID}`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setRateProfiles(
            response.data.data.JobWorkerRateProfile.jobWorkerRateProfileRates
          );
          // console.log(
          //   response.data.data.JobWorkerRateProfile.jobWorkerRateProfileRates
          // );
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/jobWorkerRateProfile/readAllRate/0/${jobworkerID}` })
      });
  }

  function getTdsTcsVoucherNum(ledgerMasterId, selectedJw) {
    axios
      .get(
        Config.getCommonUrl() +
        `api/stockJVJewelleryPurchaseArtician/get/voucher/${ledgerMasterId}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          if (Object.keys(response.data.data).length !== 0) {
            setTdsTcsVou(response.data.data.voucherNo);
            setPrintObj({
              ...printObj,
              stateId: selectedJw.state_name.id,
              is_tds_tcs: selectedJw.is_tds_tcs,
              supplierName: selectedJw.firm_name,
              supAddress: selectedJw.address,
              supplierGstUinNum: selectedJw.gst_number,
              supPanNum: selectedJw.pan_number,
              supState: selectedJw.state_name.name,
              supCountry: selectedJw.country_name.name,
              // supStateCode: selectedJw.gst_number.substring(0, 2),
              supStateCode: (selectedJw.gst_number) ? selectedJw.gst_number.substring(0, 2) : "",
              // purcVoucherNum: "",
              // partyInvNum: "",
              voucherDate: moment().format("DD-MM-YYYY"),
              placeOfSupply: selectedJw.state_name.name,
              orderDetails: [],
              taxableAmount: "",
              sGstTot: "",
              cGstTot: "",
              iGstTot: "",
              roundOff: "",
              grossWtTOt: "",
              netWtTOt: "",
              pcsTot: "",
              totalInvoiceAmt: "",
              TDSTCSVoucherNum: response.data.data.voucherNo,
              ledgerName: selectedJw.LedgerMaster.Ledger.name,
              taxAmount: "",
              metNarration: "",
              accNarration: "",
              balancePayable: ""
            })
          } else {
            setTdsTcsVou("");
            setPrintObj({
              ...printObj,
              stateId: selectedJw.state_name.id,
              is_tds_tcs: selectedJw.is_tds_tcs,
              supplierName: selectedJw.firm_name,
              supAddress: selectedJw.address,
              supplierGstUinNum: selectedJw.gst_number,
              supPanNum: selectedJw.pan_number,
              supState: selectedJw.state_name.name,
              supCountry: selectedJw.country_name.name,
              supStateCode: (selectedJw.gst_number) ? selectedJw.gst_number.substring(0, 2) : "",
              // supStateCode: (finalData.jobworker.gst_number) ? finalData.jobworker.gst_number.substring(0, 2) : '',
              // purcVoucherNum: "",
              // partyInvNum: "",
              voucherDate: moment().format("DD-MM-YYYY"),
              placeOfSupply: selectedJw.state_name.name,
              orderDetails: [],
              taxableAmount: "",
              sGstTot: "",
              cGstTot: "",
              iGstTot: "",
              roundOff: "",
              grossWtTOt: "",
              netWtTOt: "",
              pcsTot: "",
              totalInvoiceAmt: "",
              TDSTCSVoucherNum: "",
              //ledgerName: selectedJw.LedgerMaster.Ledger.name,
              taxAmount: "",
              metNarration: "",
              accNarration: "",
              balancePayable: ""
            })
          }
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: `api/stockJVJewelleryPurchaseArtician/get/voucher/${ledgerMasterId}` })
      });
  }

  //url change
  function getVouchers(jobworkerId) {
    setVoucherApiData([])
    let data = {
      "jobworker_id": jobworkerId,
      "department_id": window.localStorage.getItem("SelectedDepartment"),
      "flag": 0
    }
    axios
      .post(
        Config.getCommonUrl() +
        // `api/jobworkarticianissue/jobworker/${jobworkerId}`
        "api/stockJVjobWorkArticianIssue/jv/jobworker/jobworker",
        data
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
              amount: (parseFloat(item.rate) * parseFloat(item.finegold)).toFixed(3),
            });
          }
          setVoucherApiData(tempArray);
        } else {
          setVoucherApiData([]);
          dispatch(Actions.showMessage({ message: response.data.error.message }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/stockJVjobWorkArticianIssue/jv/jobworker/jobworker",
          body: data
        })
      });
  }

  function handleVoucherModalClose() {
    setvoucherModalOpen(false);
  }

  function handleVoucherSubmit() {
    setvoucherModalOpen(false);
  }

  const handleVoucherSelect = (e) => {
    console.log("handleVoucherSelect", JSON.parse(e.target.value));
    const newSelection = JSON.parse(e.target.value);
    setIsVoucherSelected(true);
    let newSelectedVoucher;

    if (selectedVoucher.indexOf(newSelection.id) > -1) {
      newSelectedVoucher = selectedVoucher.filter((s) => s !== newSelection.id);
    } else {
      newSelectedVoucher = [...selectedVoucher, newSelection.id]
    }

    setSelectedVoucher(newSelectedVoucher);
    setSelectVoucherErr("");
    // setvoucherModalOpen(false);
    // setVoucherNm(voucher_no);

    if (isUploaded === true) {
      // fileSelected //file weight is greater than api weight then fix rate from user then upload file
      uploadfileapicall(fileSelected);
    }
  }
  // console.log(selectedVoucher);
  function handleSelectVoucher() {
    setvoucherModalOpen(true);
  }

  function deleteHandler(index) {
    console.log(index)
    let newFormValues = [...userFormValues];

    newFormValues[index].stockCode = ""
    newFormValues[index].stockName = ""
    newFormValues[index].HSNNum = ""
    newFormValues[index].billingCategory = ""
    newFormValues[index].purity = ""
    newFormValues[index].color = ""
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
    ]
    newFormValues[index].wastagePer = ""
    newFormValues[index].wastageFine = ""
    newFormValues[index].jobworkFineUtilize = ""
    newFormValues[index].labourFineAmount = ""
    newFormValues[index].catRatePerGram = ""
    newFormValues[index].rate = ""
    newFormValues[index].tag_amount_after_discount = ""
    newFormValues[index].tag_amount_before_discount = ""
    newFormValues[index].totalAmount = ""
    newFormValues[index].cgstPer = ""
    newFormValues[index].cgstVal = ""
    newFormValues[index].sGstPer = ""
    newFormValues[index].sGstVal = ""
    newFormValues[index].IGSTper = ""
    newFormValues[index].IGSTVal = ""
    newFormValues[index].total = ""
    newFormValues[index].errors = {
      stockCode: null,
      stockName: null,
      HSNNum: null,
      billingCategory: null,
      purity: null,
      color: null,
      pieces: null,
      grossWeight: null,
      netWeight: null,
      wastagePer: null,
      wastageFine: null,
      jobworkFineUtilize: null,
      labourFineAmount: null,
      catRatePerGram: null,
      tag_amount_after_discount: null,
      tag_amount_before_discount: null,
      rate: null,
      totalAmount: null,
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


  const handleDocModalClose = () => {
    // console.log("handleDocModalClose")
    setDocModal(false)
  }

  const handleNarrationClick = () => {
    console.log("handleNarr", narrationFlag)
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        "flag": 41,
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
  console.log(finalAmount,"finalAmount")

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0" style={{ marginTop: "30px" }}>
            {!props.viewPopup && <Grid
              container
              alignItems="center"
              style={{ paddingInline: "30px" }}
            >
              <Grid item xs={7} sm={7} md={7} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    {isView ? "View Jewellery Purchase (Artician Receive Stock Journal Voucher)" : "Add Jewellery Purchase (Artician Receive Stock Journal Voucher)"}
                  </Typography>
                </FuseAnimate>
              </Grid>
              <Grid
                item
                xs={5}
                sm={5}
                md={5}
                key="2"
                style={{ textAlign: "right", justifyContent: "flex-end"}}
                className="btn-back"
              >
                <Button
                  variant="contained"
                  id="btn-back"
                  size="small"
                  onClick={(event) => {
                    History.goBack();
                  }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>}

            {loading && <Loader />}
            <div className="main-div-alll" style={{ marginTop: "20px" }}>
            <div
              // style={{ marginBottom: "10%", height: "90%" }}
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
                    spacing={2}
                    style={{marginBottom: 16}}
                    alignItems="flex-end"
                  >
                    <Grid
                      item
                      lg={2}
                      md={4}
                      sm={4}
                      xs={12}
                    >
                      <p>Select Load Type</p>
                      <select
                        className={clsx(classes.selectBox, "focusClass")}
                        required
                        value={selectedLoad}
                        onChange={(e) => handleLoadChange(e)}
                        disabled={isView}
                        ref={loadTypeRef}
                      >
                        <option hidden value="">
                          Select Load type
                        </option>

                        <option value="0">Load Finding Variant</option>
                        <option value="1">
                          Load Lot directly (from Excel)
                        </option>
                        <option value="2">
                          Load Barcoded Stock form excel
                        </option>
                      </select>

                      <span style={{ color: "red" }}>
                        {selectedLoadErr.length > 0 ? selectedLoadErr : ""}
                      </span>
                    </Grid>

                    {selectedLoad === "2" && (
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                      >
                        <select
                          className={clsx(classes.selectBox, "focusClass")}
                          required
                          value={bomType}
                          onChange={(e) => handleBomTypeChange(e)}
                          disabled={isView}
                        >
                          <option hidden value="">
                            Select Bom
                          </option>
                          <option value="0">Without Bom </option>
                          <option value="1">With Bom</option>
                        </select>

                        <span style={{ color: "red" }}>
                          {bomTypeErr.length > 0 ? bomTypeErr : ""}
                        </span>
                      </Grid>
                    )}
                    {allowedBackDate && (
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                      >
                        <p>Voucher Date</p>
                        <TextField
                          // label="Date"
                          type="date"
                          className=""
                          name="voucherDate"
                          // onKeyDown={(e => e.preventDefault())}
                          value={moment(voucherDate).format("YYYY-MM-DD")}
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
                    >
                      <p>Voucher Number</p>
                      <TextField
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
                    >
                      <p>Party Name</p>
                      <Select
                        id="view_jewellary_dv"
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={jobworkerData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        value={selectedJobWorker}
                        onChange={handlePartyChange}
                        placeholder="Party Name"
                        isDisabled={isView}
                      />
                      <span style={{ color: "red" }}>
                        {selectedJobWorkerErr.length > 0
                          ? selectedJobWorkerErr
                          : ""}
                      </span>
                    </Grid>

                    <Grid
                      item
                      lg={2}
                      md={4}
                      sm={4}
                      xs={12}
                    >
                      <p>Firm Name</p>
                      <TextField
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

                    <Grid
                      item
                      lg={2}
                      md={4}
                      sm={4}
                      xs={12}
                    >
                      <p>Opposite Account</p>
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
                    >
                      <p>Party Voucher Number</p>
                      <TextField
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
                      // onKeyDown={handleTabChange}
                      />
                    </Grid>
                    <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                  >
                    <p>Party Voucher Date</p>
                    <TextField
                      placeholder="Party Voucher Date"
                      type="date"
                      name="partyVoucherDate"
                      // onKeyDown={(e => e.preventDefault())}
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

                    {
                      !isView && <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                      >
                        <p>Upload Document</p>
                        <TextField
                          className="uploadDoc"
                          type="file"
                          inputProps={{
                            multiple: true
                          }}
                          onChange={(e) => setDocFile(e.target.files)}
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    }


                    <Grid
                      item
                      lg={2}
                      md={4}
                      sm={4}
                      xs={12}
                    >
                      <p>Fine Rate</p>
                      <TextField
                        // className="mb-16"
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

                    <Grid
                      item
                      lg={2}
                      md={4}
                      sm={4}
                      xs={12}
                    >
                      <Button
                        // id="button-jewellery"
                        variant="contained"
                        color="primary"
                        className="w-224 mx-auto voucher-btn"
                        aria-label="Register"
                        onClick={handleSelectVoucher}
                        disabled={isView}
                        style={{ width: '100%' }}
                      >
                        Select Voucher
                      </Button>
                      <span style={{ color: "red" }}>
                        {selectVoucherErr.length > 0 ? selectVoucherErr : ""}
                      </span>
                    </Grid>

                    {(selectedLoad === "1" || selectedLoad === "2") && (
                      <>
                        <Grid
                          item
                          lg={2}
                          md={4}
                          sm={4}
                          xs={12}
                        >
                          {/* <Button onClick={handleClick} disabled={!isEnabled}>
                      Upload a file
                    </Button> */}
                          <Button
                            // id="button-jewellery"
                            variant="contained"
                            color="primary"
                            // style={{ float: "right" }}
                            className="w-224 mx-auto"
                            aria-label="Register"
                            //   disabled={!isFormValid()}
                            // type="submit"
                            disabled={!isEnabled || isView}
                            onClick={handleClick}
                            style={{ width: '100%' }}
                          >
                            Upload a file
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
                        <Grid item lg={2} md={4} sm={4} xs={12} style={{ justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
                          {!isView &&
                            <a 
                            href=""
                            // href={selectedLoad === "1" ? lotFile : barcodedFile} 
                            // download={selectedLoad === "1" ? "stock_jv_lot.csv" : "stock_jv_barcode.csv"} 
                            >
                              Download Sample </a>
                          }

                        </Grid>
                      </>
                    )}

                    {isCsvErr === true && (
                      <Grid item xs={4} style={{ color: "red" }}>
                        Your File Has Error Please Correct it, Download from {" "}
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

                    {selectedVoucher?.length > 0 &&
                      <div style={{ alignItems: "left", marginTop: "15px", marginBottom: "15px" }}>
                        <h3>Selected Vouchers</h3>
                        <div style={{ alignItems: "left", marginTop: "15px" }}>
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
                                <TableCell
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
                                voucherApiData.filter((voucherData) => selectedVoucher.includes(voucherData.id)).map((row, index) => (
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

                                    <TableCell
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
                    }
                  </Grid>

                  {selectedLoad === "0" && (
                    <div
                      className="mt-2 jewellerey-tb-main addjewellery-purchasearticean-table add-jewellery-artician-main"
                      style={{
                        paddingBottom: 5,
                      }}
                    >
                      <div className="inner-addsalestabel-blg">
                        <div
                          className="add-jewellery-main-tbl-dv jewellery-artician-tbl jewellery-purchase-table  addjewellery-purchase-table"
                          style={{
                            border: "1px solid lightgray",
                            paddingBottom: 5,
                          }}
                        >
                          <div
                            className=" jewellery-th-dv"
                            id="jewellery-head-dv"
                            style={{
                              background: "lightgray",
                              fontWeight: "700",
                            }}
                          >
                            {!isView && <div
                              className={clsx(classes.tableheader, "delete_icons_dv")}
                              style={{ fontWeight: "700" }}
                            >
                              {/* delete action */}
                            </div>}
                            <div
                              className={classes.tableheader}
                              style={{ fontWeight: "700" }}
                            >
                              Stock Code
                            </div>
                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Stock Name
                            </div>
                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              HSN
                            </div>
                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Billing Category
                            </div>
                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Purity
                            </div>
                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Color
                            </div>

                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Pieces
                            </div>
                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Gross Weight
                            </div>
                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Net Weight
                            </div>
                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Jobwork Fine Utilize
                            </div>
                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Wastage (%)
                            </div>
                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Wastage (Fine)
                            </div>
                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Labour Fine Amount
                            </div>

                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Tag Amount Before Discount
                            </div>

                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Tag Amount After Discount
                            </div>

                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Gold Rate
                            </div>

                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Category Rate
                            </div>

                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Total Amount
                            </div>

                            {!isView && vendorStateId === 12 && (
                              <>
                                <div
                                  className={clsx(classes.tableheader, "")}
                                  style={{ fontWeight: "700" }}
                                >
                                  CGST (%)
                                </div>
                                <div
                                  className={clsx(classes.tableheader, "")}
                                  style={{ fontWeight: "700" }}
                                >
                                  SGST (%)
                                </div>
                                <div
                                  className={clsx(classes.tableheader, "")}
                                  style={{ fontWeight: "700" }}
                                >
                                  CGST
                                </div>
                                <div
                                  className={clsx(classes.tableheader, "")}
                                  style={{ fontWeight: "700" }}
                                >
                                  SGST
                                </div>
                              </>
                            )}

                            {
                              isView && igstVal != 0 && igstVal !== "" && !isNaN(igstVal) ?
                                <>
                                  <div className={clsx(classes.tableheader, "")}>
                                    IGST (%)
                                  </div>
                                  <div className={clsx(classes.tableheader, "")}>
                                    IGST
                                  </div>
                                </>
                                : isView && <>
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
                            }

                            {!isView && vendorStateId !== 12 && (
                              <>
                                <div
                                  className={clsx(classes.tableheader, "")}
                                  style={{ fontWeight: "700" }}
                                >
                                  IGST (%)
                                </div>
                                <div
                                  className={clsx(classes.tableheader, "")}
                                  style={{ fontWeight: "700" }}
                                >
                                  IGST
                                </div>
                              </>
                            )}
                            <div
                              className={clsx(classes.tableheader, "")}
                              style={{ fontWeight: "700" }}
                            >
                              Total
                            </div>
                          </div>

                          {userFormValues.map((element, index) => (
                            <div
                              id="jewellery-artician-head"
                              key={index}
                              className=""
                            >
                              {!isView &&

                                <div className={clsx(classes.tableheader, "delete_icons_dv")}>
                                  <IconButton
                                    style={{ padding: "0" }}
                                    tabIndex="-1"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      deleteHandler(index);
                                    }}
                                  >
                                    <Icon className="" style={{ color: "red" }}>
                                      delete
                                    </Icon>
                                  </IconButton>
                                </div>
                              }
                              <Select
                                filterOption={createFilter({
                                  ignoreAccents: false,
                                })}
                                // className={classes.selectBox}
                                classes={classes}
                                styles={selectStyles}
                                options={stockCodeData.map((suggestion) => ({
                                  value: suggestion.stock_name_code.id,
                                  label: suggestion.stock_name_code.stock_code,
                                  pcs_require: suggestion.stock_name_code.stock_description.pcs_require
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
                              {element.errors !== undefined &&
                                element.errors.stockCode !== null ? (
                                <span style={{ color: "red" }}>
                                  {element.errors.stockCode}
                                </span>
                              ) : (
                                ""
                              )}

                              <TextField
                                name="stockName"
                                className=""
                                value={element.stockName || ""}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.stockName
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.stockName
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled
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
                                // label="color"
                                name="color"
                                className=""
                                value={element.color || ""}
                                // value={departmentNm}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.color
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.color
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled
                              />

                              <TextField
                                // label="HSN"
                                name="pieces"
                                className={classes.inputBoxTEST}
                                type={isView ? "text" : "number"}
                                // className=""
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
                                inputRef={(el) => (pcsInputRef.current[index] = el)}
                                variant="outlined"
                                fullWidth
                                disabled={isView}
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
                                onBlur={e => handlerBlur(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled={isView}
                              />
                              <TextField
                                // label="Net Weight"
                                name="netWeight"
                                className={classes.inputBoxTEST}
                                type={isView ? "text" : "number"}
                                // className=""
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
                                onBlur={e => handlerBlur(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled={isView}
                              />
                              {/* {element.isWeightDiff === 0 && ( */}
                              {(element.grossWeight !== "" && element.netWeight !== "" && (parseFloat(element.grossWeight).toFixed(3) !== parseFloat(element.netWeight).toFixed(3))) && (
                                <IconButton
                                  style={{ padding: "0", width: "auto" }}
                                  onClick={() => {
                                    handleModalOpen(index);
                                  }}
                                >
                                  <Icon style={{ color: element.isWeightDiff === 0 ? "red" : 'gray' }}>error</Icon>
                                </IconButton>
                              )}

                              <TextField
                                // label="Net Weight"
                                name="jobworkFineUtilize"
                                className=""
                                value={element.jobworkFineUtilize || ""}
                                disabled
                                error={
                                  element.errors !== undefined
                                    ? element.errors.jobworkFineUtilize
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.jobworkFineUtilize
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                              />

                              <TextField
                                // label="Net Weight"
                                name="wastagePer"
                                className=""
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
                                disabled
                              />

                              <TextField
                                // label="Net Weight"
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
                                // label="Net Weight"
                                name="labourFineAmount"
                                className=""
                                value={isView ? Config.numWithComma(element.labourFineAmount) : element.labourFineAmount || ""}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.labourFineAmount
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.labourFineAmount
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled
                              />

                              <TextField
                                // label="Net Weight"
                                name="tag_amount_before_discount"
                                className={classes.inputBoxTEST}
                                type={isView ? "text" : "number"}
                                // className=""
                                value={isView ? Config.numWithComma(element.tag_amount_before_discount) : element.tag_amount_before_discount || ""}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.tag_amount_before_discount
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.tag_amount_before_discount
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                onBlur={e => handlerBlur(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled={isView}
                              />

                              <TextField
                                // label="Net Weight"
                                name="tag_amount_after_discount"
                                className={classes.inputBoxTEST}
                                type={isView ? "text" : "number"}
                                // className=""
                                value={isView ? Config.numWithComma(element.tag_amount_after_discount) : element.tag_amount_after_discount || ""}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.tag_amount_after_discount
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.tag_amount_after_discount
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                onBlur={e => handlerBlur(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled={isView}
                              />

                              <TextField
                                // label="Rate"
                                name="rate"
                                className=""
                                disabled
                                value={isView ? Config.numWithComma(element.rate) : element.rate || ""}
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
                              />

                              <TextField
                                // label="catRatePerGram"
                                name="catRatePerGram"
                                className=""
                                disabled
                                value={isView ? Config.numWithComma(element.catRatePerGram) : element.catRatePerGram || ""}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.catRatePerGram
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.catRatePerGram
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                              />

                              <TextField
                                // label="totalAmount"
                                name="totalAmount"
                                className=""
                                disabled
                                value={isView ? Config.numWithComma(element.totalAmount) : element.totalAmount || ""}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.totalAmount
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.totalAmount
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                              />

                              {isView && element.IGSTVal ?
                                <>
                                  <TextField
                                    // label="IGST (%)"
                                    name="IGSTper"
                                    className=""
                                    value={element.IGSTper || ""}
                                    // value={departmentNm}
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
                                    // label="IGST"
                                    name="IGSTVal"
                                    className=""
                                    value={isView ? Config.numWithComma(element.IGSTVal) : element.IGSTVal || ""}
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
                                </> : isView &&
                                <>
                                  <TextField
                                    // label="CGST (%)"
                                    name="cgstPer"
                                    className=""
                                    value={element.cgstPer || ""}
                                    // value={departmentNm}
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
                                    // label="SGST (%)"
                                    name="sGstPer"
                                    className=""
                                    value={element.sGstPer || ""}
                                    // value={departmentNm}
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
                                    // label="CGST"
                                    name="cgstVal"
                                    className=""
                                    value={isView ? Config.numWithComma(element.cgstVal) : element.cgstVal || ""}
                                    // value={departmentNm}
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
                                    // label="SGST"
                                    name="sGstVal"
                                    className=""
                                    value={isView ? Config.numWithComma(element.sGstVal) : element.sGstVal || ""}
                                    // value={departmentNm}
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
                              }

                              {!isView && vendorStateId === 12 && (
                                <>
                                  <TextField
                                    // label="CGST (%)"
                                    name="cgstPer"
                                    className=""
                                    value={element.cgstPer || ""}
                                    // value={departmentNm}
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
                                    // label="SGST (%)"
                                    name="sGstPer"
                                    className=""
                                    value={element.sGstPer || ""}
                                    // value={departmentNm}
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
                                    // label="CGST"
                                    name="cgstVal"
                                    className=""
                                    value={isView ? Config.numWithComma(element.cgstVal) : element.cgstVal || ""}
                                    // value={departmentNm}
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
                                    // label="SGST"
                                    name="sGstVal"
                                    className=""
                                    value={isView ? Config.numWithComma(element.sGstVal) : element.sGstVal || ""}
                                    // value={departmentNm}
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

                              {!isView && vendorStateId !== 12 && (
                                <>
                                  <TextField
                                    // label="IGST (%)"
                                    name="IGSTper"
                                    className=""
                                    value={element.IGSTper || ""}
                                    // value={departmentNm}
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
                                    // label="IGST"
                                    name="IGSTVal"
                                    className=""
                                    value={isView ? Config.numWithComma(element.IGSTVal) : element.IGSTVal || ""}
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
                                name="total"
                                className=""
                                value={isView ? Config.numWithComma(element.total) : element.total || ""}
                                // value={departmentNm}
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
                            // id="jewellery-head-dv"
                            className="castum-row-dv"
                            style={{ fontWeight: "700", height: '30px' }}
                          >
                            {!isView && <div id="castum-width-table" className={clsx(classes.tableheader, "delete_icons_dv")}></div>}
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div
                              className={clsx(classes.tableheader, "castum-width-table")}
                            ></div>
                            <div
                              className={clsx(classes.tableheader, "castum-width-table")}
                            ></div>
                            <div
                              className={clsx(classes.tableheader, "castum-width-table")}
                            ></div>
                            <div
                              className={clsx(classes.tableheader, "castum-width-table")}
                            ></div>
                            <div
                              className={clsx(classes.tableheader, "castum-width-table")}
                            ></div>

                            <div
                              className={clsx(classes.tableheader, "castum-width-table")}
                            >
                              {pscTotal}
                            </div>
                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                              {totalGrossWeight}
                            </div>
                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                              {totalNetWeight}
                            </div>
                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                              {fineTotal}
                            </div>
                            <div
                              className={clsx(classes.tableheader, "castum-width-table")}
                            ></div>
                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                              {/* wastageFine */}
                            </div>
                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                              {/* labourFineAmount */}
                            </div>
                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                              {/* Tag Amount Before Discount */}
                            </div>
                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                              {/* Tag Amount After Discount */}
                            </div>

                            <div
                              className={clsx(classes.tableheader, "castum-width-table")}
                            ></div>
                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                              {/* catRatePerGram */}
                            </div>
                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                              {isView ? Config.numWithComma(totalAmount) : totalAmount}
                            </div>
                            {igstVal != 0 && igstVal !== "" && !isNaN(igstVal) ?
                              <>
                                <div
                                  className={clsx(classes.tableheader, "castum-width-table")}
                                ></div>
                                <div
                                  className={clsx(classes.tableheader, "castum-width-table")}
                                >
                                  {isView ? Config.numWithComma(igstVal) : igstVal}
                                </div>
                              </> :
                              <>
                                <div
                                  className={clsx(classes.tableheader, "castum-width-table")}
                                ></div>
                                <div
                                  className={clsx(classes.tableheader, "castum-width-table")}
                                ></div>
                                <div
                                  className={clsx(classes.tableheader, "castum-width-table")}
                                >
                                  {isView ? Config.numWithComma(cgstVal) : cgstVal}
                                </div>
                                <div
                                  className={clsx(classes.tableheader, "castum-width-table")}
                                >
                                  {isView ? Config.numWithComma(sgstVal) : sgstVal}
                                </div>
                              </>}
                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                              {isView ? Config.numWithComma(total) : total}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedLoad === "1" && (
                    <Grid className="salesjobwork-table-main artician_cate_jewellry_tbl add-jewellary-tab-tbl artician_cate_jewellry_blg addsales-jobreturn-domestic-dv">
                      <div className="mt-16">
                        <AppBar position="static">
                          <Tabs value={lotModalView} onChange={handleLotTabChange}>
                            <Tab label="Lot Details" />
                            <Tab label="Bom Details" />
                          </Tabs>
                        </AppBar>
                        {lotModalView === 0 && (
                          <LotDetails
                            lotList={lotList}
                            stateId={vendorStateId}
                            isView={isView}
                          />
                        )}
                        {lotModalView === 1 && (
                          <BomDetails
                            bomList={bomList}
                            stateId={vendorStateId}
                            isView={isView}
                          />
                        )}
                      </div>
                    </Grid>
                  )}

                  {selectedLoad === "2" && (
                    <Grid className="salesjobwork-table-main artician_cate_jewellry_tbl add-jewellary-tab-tbl artician_cate_jewellry_blg addsales-jobreturn-domestic-dv ">
                      <div className="mt-16">
                        <AppBar position="static">
                          <Tabs value={modalView} onChange={handleChangeTab}>
                            <Tab label="Category Wise List" />
                            <Tab label="Tag Wise List" />
                          </Tabs>
                        </AppBar>
                        {modalView === 0 && (
                          <CategoryWiseList
                            productData={productData}
                            stateId={vendorStateId}
                            isView={isView}
                          // selectedLoad={selectedLoad}
                          />
                        )}
                        {modalView === 1 && (
                          <TagWiseList
                            tagWiseData={tagWiseData}
                            stateId={vendorStateId}
                            isView={isView}
                          // selectedLoad={selectedLoad}
                          />
                        )}
                      </div>
                    </Grid>
                  )}
                </form>
                <div
                  className="mt-5 sub-total-dv"
                  style={{
                    fontWeight: "700",
                    justifyContent: "end",
                    display: "flex",
                  }}
                >

                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="mr-2">Sub Total : </label>
                    <label className="ml-2">{isView ? Config.numWithComma(subTotal) : subTotal}</label>
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
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="mr-2">GST : </label>
                    <label className="ml-2">{isView ? Config.numWithComma(totalGST) : totalGST}</label>
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
                    style={{ display: "flex", alignItems: "center" }}
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
                        className={clsx(classes.inputBoxTEST, "ml-2 addconsumble-dv")}
                        type={isView ? "text" : "number"}
                        // className="ml-2 addconsumble-dv"
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
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label className="mr-2">Total Invoice Amount : </label>
                    <label className="ml-2">{isView ? Config.numWithComma(totalInvoiceAmount) : totalInvoiceAmount}</label>
                  </div>
                </div>
                {!props.viewPopup && <div
                  className="mt-16"
                  style={{ border: "1px solid #ebeefb", paddingBottom: 5 }}
                >
                  <div
                    className="metal-tbl-head"
                    style={{ background: "#ebeefb", fontWeight: "700" }}
                  >
                    <div className={classes.tableheader}>TDS/TCS Vou. Num</div>

                    <div className={classes.tableheader}>Ledger Name</div>

                    <div className={classes.tableheader}>(%)</div>

                    <div className={classes.tableheader}>Amount</div>
                  </div>

                  <div className="mt-5 table-row-source">
                    <TextField
                      // label="TDS/TCS Vou. Num"
                      name="tdsTcsVou"
                      className="ml-2"
                      value={tdsTcsVou}
                      error={tdsTcsVouErr.length > 0 ? true : false}
                      helperText={tdsTcsVouErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                      disabled
                    />
                    <TextField
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
                    />
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
                      value={isView ? Config.numWithComma(ledgerAmount) : !isNaN(ledgerAmount)?ledgerAmount:""}
                      error={ledgerAmtErr.length > 0 ? true : false}
                      helperText={ledgerAmtErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                      disabled={is_tds_tcs !== "1" || isView}
                    />
                  </div>
                </div>
                }

                <div
                  className="mt-16"
                  id="jewellery-head"
                  style={{
                    border: "1px solid #ebeefb",

                    background: "#ebeefb",
                    fontWeight: "700",
                    justifyContent: "end",
                    display: "flex",
                  }}
                >
                  <div
                    style={
                      {
                        // width: "20%",
                      }
                    }
                  // className={classes.tableheader}
                  >
                    <label>Final Receivable Amount :</label>
                    <label> {isView ? Config.numWithComma(finalAmount) : !isNaN(finalAmount)?finalAmount:""} </label>
                  </div>
                </div>

                <div className="textarea-row">
                  <div className="mt-16 mr-2" style={{ width: "50%" }}>
                    <p>Jewellery Narration</p>
                    <TextField
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
                  </div>
                  <div className="mt-16 ml-2" style={{ width: "50%" }}>
                    <p>Account Narration</p>
                    <TextField
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
                  </div>
                </div>
                {!props.viewPopup && <div>
                  {!isView &&
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ float: "right" }}
                      className="w-224 mx-auto mt-16"
                      aria-label="Register"
                      disabled={isView || total==0}
                      // type="submit"
                      onClick={(e) => {
                        handleFormSubmit(e);
                      }}
                    >
                      Save
                    </Button>
                  }

                  <Button
                    variant="contained"
                    // color="primary"
                    style={{ float: "right", backgroundColor: "limegreen" }}
                    className="w-224 mx-auto mt-16 mr-16"
                    aria-label="Register"
                    //   disabled={!isFormValid()}
                    // type="submit"
                    disabled={total==0}
                    onClick={checkforPrint}
                  >
                    {isView ? "Print" : "Save & Print"}
                  </Button>

                  {isView &&
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ float: "right" }}
                      className="w-224 mx-auto mt-16 mr-16"
                      aria-label="Register"
                      onClick={() => handleNarrationClick()}
                    >
                      {!narrationFlag ? "Save Narration" : "Update Narration"}
                    </Button>
                  }
                  <div style={{ display: "none" }}>
                    <JewelArticianPrintComp ref={componentRef} printObj={printObj} />
                  </div>
                </div>}

                {isView &&
                  <Button
                    variant="contained"
                    className={clsx(classes.button, "mt-16 mr-16")} onClick={() => setDocModal(true)}>
                    View Documents
                  </Button>

                }

              </div>
            </div>

            <ViewDocModal documentList={documentList} handleClose={handleDocModalClose} open={docModal} updateDocument={updateDocumentArray}
              purchase_flag_id={idToBeView?.id} purchase_flag="41" concateDocument={concateDocument} viewPopup={props.viewPopup} />

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
              <div style={modalStyle} className={classes.paper}>
                <h5
                  className="p-5"
                  style={{
                    textAlign: "center",
                    backgroundColor: "black",
                    color: "white",
                  }}
                >
                  {isView ? "View Weight" : "Add Weight"}
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={handleModalClose}
                  ><Icon style={{ color: "white" }}>
                      close
                    </Icon></IconButton>
                </h5>

                {DiffrentStock.map((row, index) => (
                  <div
                    key={index}
                    className={clsx(classes.diffPopup, "p-5 pl-16 pr-16")}
                  >
                    <Select
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
                      placeholder="Stock Code"
                    />

                    <span style={{ color: "red" }}>
                      {row.errors !== undefined
                        ? row.errors.setStockCodeId
                        : ""}
                    </span>

                    <TextField
                      label="Pieces"
                      name="setPcs"
                      className="mx-16"
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

                    <TextField
                      label="Weight"
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
                    {!isView &&
                      <IconButton
                        style={{ padding: "0" }}
                        className="ml-8"
                        onClick={(ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          deleteDiffrentStock(index)
                          // deleteHandler(row.id);
                        }}
                      >
                        <Icon style={{ color: "red" }}>
                          delete
                        </Icon>
                      </IconButton>
                    }
                  </div>
                ))}

                {!isView &&
                  <IconButton className="p-16" onClick={AddNewRow}>
                    <Icon
                      style={{
                        color: "dodgerblue",
                      }}
                    >
                      add_circle_outline
                    </Icon>
                  </IconButton>
                }
                {!isView &&
                  <div className="p-5 pl-16 pr-16">
                    <Button
                      variant="contained"
                      color="primary"
                      className="w-full mx-auto mt-16"
                      style={{
                        backgroundColor: "#4caf50",
                        border: "none",
                        color: "white",
                      }}
                      onClick={(e) => checkforUpdate(e)}
                    >
                      Save
                    </Button>
                  </div>
                }
              </div>
            </Modal>

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
              <div style={modalStyle} className={classes.rateFixPaper}>
                <h5
                  className="p-5"
                  style={{
                    textAlign: "center",
                    backgroundColor: "black",
                    color: "white",
                  }}
                >
                  Vouchers
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={handleVoucherModalClose}
                  ><Icon style={{ color: "white" }}>
                      close
                    </Icon></IconButton>
                </h5>

                <div className="p-1 pl-16 pr-16" style={{maxHeight: "330px", overflow: "scroll"}}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          align="center"
                        >
                        </TableCell>

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
                          Gross Weight
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="center"
                        >
                          Net Weight
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
                        voucherApiData.map((row, index) => (
                          <TableRow
                            key={index}
                          // onClick={(e) =>
                          //   handleVoucherSelect(row.id, row.voucher_no)
                          // }
                          // className={classes.hoverClass}
                          >
                            <TableCell align="center" className={classes.tableRowPad}>
                              <Checkbox name="selectVoucher" value={JSON.stringify({ id: row.id, voucherNum: row.voucher_no })} onChange={handleVoucherSelect} checked={selectedVoucher.includes(row.id) ? true : false} />
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
                              {row.gross_weight}
                            </TableCell>

                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                            >
                              {row.net_weight}
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
                <Button
                  variant="contained"
                  color="primary"
                  className="w-full mx-auto mt-16"
                  style={{
                    backgroundColor: "#4caf50",
                    border: "none",
                    color: "white",
                  }}
                  onClick={(e) => handleVoucherSubmit(e)}
                >
                  SAVE
                </Button>
              </div>
            </Modal>
            </div>
          </div>
        </div>
      </FuseAnimate>  
    </div>
  );
};

export default AddStockJewelPurchaseArtician; 

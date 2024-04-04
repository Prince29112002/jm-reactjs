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
import Select, { createFilter } from "react-select";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Modal from "@material-ui/core/Modal";
import * as XLSX from "xlsx";
import moment from "moment";
import { Icon, IconButton } from "@material-ui/core";
import Loader from "app/main/Loader/Loader";
import History from "@history";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CategoryWiseList from "../Components/CategoryWiseList";
import TagWiseList from "../Components/TagWiseList";
import PackingSlipWiseList from "../Components/PackingSlipWiseList";
import { JewelPurcPrintComp } from "../Components/JewelPurcPrintComp";
import { JewelPurcHmPrintComp } from "../Components/JewelPurcHmPrintComp";
import { useReactToPrint } from "react-to-print";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import PacketWiseList from "../Components/PacketWiseList";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
import HelperFunc from "../../Helper/HelperFunc";
import barcodedFile from "app/main/SampleFiles/JewelleryPurchase/Load_Barcode_wise.csv";
import packetWiseFile from "app/main/SampleFiles/JewelleryPurchase/Load_Packet_wise.csv";
import packingSlipFile from "app/main/SampleFiles/JewelleryPurchase/Load_Packing_Slip_wise.csv";
import { UpdateNarration } from "../../Helper/UpdateNarration";
import Icones from 'assets/fornt-icons/Mainicons';

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
  rateFixPaper: {
    position: "absolute",
    width: 600,
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


const AddJewellaryPurchase = (props) => {
  const [isView, setIsView] = useState(false); //for view Only

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
    pcsTotal: "",
    grossWtTOt: "",
    netWtTOt: "",
    totalInvoiceAmt: "",
    stateId: "",
    is_tds_tcs: "",
    TDSTCSVoucherNum: "",
    ledgerName: "",
    taxAmount: "",
    jewelNarration: "",
    accNarration: "",
    balancePayable: "",
  });

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);

  const loadTypeRef = useRef(null);

  useEffect(() => {
    if (props.reportView === "Report") {
      NavbarSetting('Report', dispatch)
    } else if (props.reportView === "Account") {
      NavbarSetting('Accounts', dispatch)
    } else {
      NavbarSetting('Sales Purchase', dispatch)
    }
    //eslint-disable-next-line
  }, [])

  const [documentList, setDocumentList] = useState([]);
  const [docModal, setDocModal] = useState(false);
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);

  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 2)
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

  // const [loading, setLoading] = React.useState(false);
  // const [text, setText] = React.useState("old boring text");

  const handleAfterPrint = () => {
    //React.useCallback
    console.log("`onAfterPrint` called", isView); // tslint:disable-line no-console
    //resetting after print
    checkAndReset();
  };

  function checkAndReset() {
    // console.log("checkAndReset", isView)
    if (isView === false) {
      console.log("cond true", isView);
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
        moment(currentDate).format("DD-MM-YYYY h:mm A")
      );
    }
  }

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Jewellery_Purchase_Voucher_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  function checkforPrint() {
    if (
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
        if (selectedLoad === "0") {
          //check prev valid
          if (prevIsValid()) {
            addUserInputApi(false, true);
          }
        } else {
          if (uploadTypeValidation() && bomTypeValidation()) {
            if (isUploaded) {
              addJewellaryPuchaseApi(false, true);
            } else {
              setUploadErr("Please Upload File");
            }
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
  }, [onBeforeGetContentResolve.current]); //, text

  const hiddenFileInput = React.useRef(null);

  const [modalView, setModalView] = useState(0);

  const handleClick = (event) => {
    // if (selectedLoad === "1") {
    //check if selectedLoad is 1 then check bom selected
    setUploadErr("");
    if (uploadTypeValidation() && bomTypeValidation())
      hiddenFileInput.current.click();
    // }
    // else {
    //   hiddenFileInput.current.click();
    // }
  };
  const handlefilechange = (event) => {
    setIsCsvErr(false);
    handleFile(event)
  };

  const [loading, setLoading] = useState(false);

  // const [apiData, setApiData] = useState([]);
  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);
  // "0" = Load Finding Variant
  // "1" = Load Barcoded Stock form excel

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");
  const [address, setAddress] = useState("");
  const [supplierGstUinNum, setSupplierGstUinNum] = useState("");
  const [supPanNum, setSupPanNum] = useState("");
  const [supState, setSupState] = useState("");
  const [supCountry, setSupCountry] = useState("");
  const [supStateCode, setSupStateCode] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [selectedLoad, setSelectedLoad] = useState("");
  const [selectedLoadErr, setSelectedLoadErr] = useState("");

  const [uploadType, setUploadType] = useState("");
  const [uploadTypeErr, setUploadTypeErr] = useState("");

  const [bomType, setBomType] = useState("");
  const [bomTypeErr, setBomTypeErr] = useState("");

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

  const [ledgerData, setLedgerData] = useState([]);
  const [selectedVendorClient, setVendorClient] = useState({
    value: 1,
    label: "Vendor",
  });

  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");

  const [csvData, setCsvData] = useState([]);
  const [isCsvErr, setIsCsvErr] = useState(false);

  const [selectedRateFixErr, setSelectedRateFixErr] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [rfModalOpen, setRfModalOpen] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [oppositeAccData, setOppositeAccData] = useState([]);
  const [oppositeAccSelected, setOppositeAccSelected] = useState("");
  const [selectedOppAccErr, setSelectedOppAccErr] = useState("");

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");
  const [partyVoucherDateErr, setpartyVoucherDateErr] = useState("");

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

  const [adjustedRate, setAdjustedRate] = useState(false);

  const [vendorStateId, setVendorStateId] = useState("");

  const [balanceRfixData, setBalanceRfixData] = useState("");
  const [balRfixViewData, setBalRfixViewData] = useState([]);

  const [shortageRfix, setShortageRfix] = useState("");
  const [shortageRfixErr, setShortageRfixErr] = useState("");

  const [tempRate, setTempRate] = useState("");
  const [tempRateErr, setTempRateErr] = useState("");

  const [avgRate, setAvgeRate] = useState("");
  const [avgRateErr, setAvgeRateErr] = useState("");

  const [tempApiWeight, setTempApiWeight] = useState("");

  const [totalGST, setTotalGST] = useState("");
  const [is_tds_tcs, setIs_tds_tcs] = useState("");

  const [subTotal, setSubTotal] = useState("");

  const [piecesTot, setPiecesTot] = useState("");
  const [totalGrossWeight, setTotalGrossWeight] = useState("");
  const [totalNetWeight, setTotalNetWeight] = useState("");

  // const [tagAmountAftTot, setTagAmountAftTot] = useState("");
  // const [tagAmountBefTot, setTagAmountBefTot] = useState("");
  // const [amount, setAmount] = useState("");
  const [FirstRow, setFirstdRow] = useState([]);
  const [totalAmount, setTotalAmount] = useState("");
  const [cgstVal, setCgstVal] = useState("");
  const [sgstVal, setSgstVal] = useState("");
  const [igstVal, setIgstVal] = useState("");
  const [total, setTotal] = useState("");
  const [fineGoldTotal, setFineGoldTotal] = useState("");
  const [fineTotal, setFineTotal] = useState("");

  const [fileSelected, setFileSelected] = useState("");
  const [isUploaded, setIsuploaded] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  // const [utiliseErr, setUtiliseErr] = useState("");
  const [utiliseTotal, setUtiliseTotal] = useState("");

  const [popupErr, setPopupErr] = useState("");

  const [newRate, setNewRate] = useState("");

  const theme = useTheme();

  const [stockCodeData, setStockCodeData] = useState([]);

  const [diffStockCode, setDiffStockCode] = useState([]);

  const [rateProfiles, setRateProfiles] = useState([]);

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

  var idToBeView;
  if (props.location) {
    idToBeView = props.location.state;
  } else if (props.voucherId) {
    idToBeView = { id: props.voucherId };
  }

  const [narrationFlag, setNarrationFlag] = useState(false);

  const [productData, setProductData] = useState([]); //category wise Data
  const [tagWiseData, setTagWiseData] = useState([]); //tag wise Data
  const [packingSlipData, setPackingSlipData] = useState([]); //packing slip wise data
  const [packetData, setPacketData] = useState([]);

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
      fine: "",
      labourCharges: "",
      unitOfPurchase: "",
      rate: "",
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
        fine: null,
        labourCharges: null,
        unitOfPurchase: null,
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
      fine: "",
      labourCharges: "",
      unitOfPurchase: "",
      rate: "",
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
        fine: null,
        labourCharges: null,
        unitOfPurchase: null,
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
      fine: "",
      labourCharges: "",
      unitOfPurchase: "",
      rate: "",
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
        fine: null,
        labourCharges: null,
        unitOfPurchase: null,
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
      fine: "",
      labourCharges: "",
      unitOfPurchase: "",
      rate: "",
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
        fine: null,
        labourCharges: null,
        unitOfPurchase: null,
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
  ]);
  const vendorClientArr = [
    { id: 1, name: "Vendor" },
    { id: 2, name: "Client" },
  ];
  const pcsInputRef = useRef([]); //for pcs in table

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

  const classes = useStyles();

  useEffect(() => {
    // visible true -> false
    if (loading) {
      //setTimeout(() => setLoaded(true), 250);
      //debugger;
      setTimeout(() => setLoading(false), 7000);
    }
    //setLoaded(loaded);
  }, [loading]);

  useEffect(() => {
    setOppositeAccData(
      HelperFunc.getOppositeAccountDetails("JewelleryPurchase")
    );

    console.log("idToBeView", idToBeView);
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true);
      getJewelPurchaseRecordForView(idToBeView.id);
    } else {
      setNarrationFlag(false);
      getStockCodeFindingVariant();
      getStockCodeStone();
      getVoucherNumber(); //if view only then no need to get new voucher number, we will set data coming from api
    }
    setTimeout(() => {
      if (loadTypeRef.current) {
        console.log("if------------");
        loadTypeRef.current.focus();
      }
    }, 800);
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
      if (
        rateValue &&
        totalInvoiceAmount &&
        totalAmount && ledgerName
      ) {
        calculateFileRate();
      }
    }
  }, [ledgerName]);

  useEffect(() => {
    if (idToBeView === undefined) {
      if (ledgerAmount && is_tds_tcs == 1 && ledgerName) {
        changeRate();
      }
    }
  }, [ledgerAmount]);

  const changeRate = () => {
    const changeRatesVal =
      (parseFloat(ledgerAmount) * 100) / parseFloat(totalInvoiceAmount);
    setRateValue(parseFloat(changeRatesVal).toFixed(3));
  };

  const calculateFileRate = () => {
    console.log("innnnnnnnnnnnn")
    let tempLedgerAmount = 0;
    let tempfinalAmount = 0;
    let tempTotalInvoiceAmt = totalInvoiceAmount;
    let tempTotAmount = subTotal;
    if (is_tds_tcs == 1) {
      tempLedgerAmount = parseFloat(
        (tempTotalInvoiceAmt * rateValue) / 100
      ).toFixed(3);
      tempfinalAmount = parseFloat(
        parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)
      ).toFixed(3);
    } else if (is_tds_tcs == 2) {
      //tds
      tempLedgerAmount = parseFloat(
        (parseFloat(tempTotAmount) * rateValue) / 100
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
      taxableAmount: parseFloat(tempTotAmount).toFixed(3),
      totalInvoiceAmt: tempTotalInvoiceAmt,
      taxAmount: tempLedgerAmount,
      balancePayable: parseFloat(tempfinalAmount).toFixed(3),
      TDSTCSVoucherNum: tdsTcsVou,
      ledgerName: ledgerName.label,
    });
  };

  function getJewelPurchaseRecordForView(id) {
    setLoading(true);
    let api = ""
    if (props.forDeletedVoucher) {
      api = `api/jewellerypurchase/${id}?deleted_at=1`
    } else {
      api = `api/jewellerypurchase/${id}`
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response);
        setTimeDate(response.data.data.data.created_at);

        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              let finalData = response.data.data.data;
              let otherDetail = response.data.data.otherDetails;

              if (finalData.is_vendor_client === 1) {
                setVendorClient({ value: 1, label: "Vendor" });
                var mainObj = finalData.Vendor;
                console.log(mainObj, "mainObj");
                setSelectedVendor({
                  value: finalData.Vendor.id,
                  label: finalData.Vendor.name,
                });
                setFirmName(finalData.Vendor.firm_name);
              } else {
                setVendorClient({ value: 2, label: "Client" });
                var mainObj = finalData.ClientCompany;
                setSelectedClient({
                  value: finalData.ClientCompany.id,
                  label: finalData.ClientCompany.client.name,
                });
                setSelectedClientFirm({
                  value: finalData.ClientCompany.id,
                  label: finalData.ClientCompany.firm_name,
                });
              }
              console.log(mainObj);
              setDocumentList(finalData.salesPurchaseDocs);
              setSelectedLoad(otherDetail.loadType.toString());

              if (otherDetail.loadType === 1) {
                setUploadType(otherDetail.uploadType.toString());
                setBomType(otherDetail.selectBom);
              }

              setVoucherNumber(finalData.voucher_no);
              setPartyVoucherDate(finalData.party_voucher_date)
              setAllowedBackDate(true);
              setVoucherDate(finalData.purchase_voucher_create_date);
              setVendorStateId(mainObj.state);

              setIs_tds_tcs(mainObj.is_tds_tcs);

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
                setLedgerName({
                  value: finalData.TdsTcsVoucher.id,
                  label: finalData.TdsTcsVoucher.voucher_name,
                });
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

              if (otherDetail.loadType === 0) {
                //finding variant
                let tempArray = [];
                // console.log(OrdersData);
                for (let item of finalData.JewelleryPurchaseOrders) {
                  console.log(item);
                  tempArray.push({
                    stockCode: {
                      value: item.StockNameCode.id,
                      label: item.StockNameCode.stock_code,
                    },
                    stockName: item.stock_name,
                    HSNNum: item.hsn_number ? item.hsn_number : "",
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
                    fine: parseFloat(item.total_fine).toFixed(3),
                    labourCharges: parseFloat(item.labour_amount).toFixed(3),
                    unitOfPurchase: item.pcs_or_gram.toString(),
                    rate: parseFloat(item.fine_rate).toFixed(3),
                    totalAmount: parseFloat(item.total_amount).toFixed(3),
                    cgstPer: item.cgst,
                    cgstVal:
                      item.cgst !== null
                        ? parseFloat(
                          (parseFloat(item.total_amount) *
                            parseFloat(item.cgst)) /
                          100
                        ).toFixed(3)
                        : "",
                    sGstPer: item.sgst,
                    sGstVal:
                      item.sgst !== null
                        ? parseFloat(
                          (parseFloat(item.total_amount) *
                            parseFloat(item.sgst)) /
                          100
                        ).toFixed(3)
                        : "",
                    IGSTper: item.igst,
                    IGSTVal:
                      item.igst !== null
                        ? parseFloat(
                          (parseFloat(item.total_amount) *
                            parseFloat(item.igst)) /
                          100
                        ).toFixed(3)
                        : "",
                    total: parseFloat(item.total_amount).toFixed(3),
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
                      fine: null,
                      labourCharges: null,
                      unitOfPurchase: null,
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
                  });
                }
                setUserFormValues(tempArray);

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

                function Total(item) {
                  return item.total;
                }

                function grossWeight(item) {
                  // console.log(parseFloat(item.grossWeight));
                  return parseFloat(item.grossWeight);
                }

                function fineGold(item) {
                  return parseFloat(item.fine);
                }

                let tempFineGold = tempArray
                  .filter((item) => item.fine !== "")
                  .map(fineGold)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

                function fine(item) {
                  return parseFloat(item.fine);
                }

                let tempFineTot = tempArray
                  .filter((item) => item.fine !== "")
                  .map(fine)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setFineTotal(parseFloat(tempFineTot).toFixed(3));

                function getPcs(item) {
                  return parseFloat(item.pieces);
                }

                let tempPcsTot = parseFloat(
                  tempArray
                    .filter((data) => data.pieces !== "")
                    .map(getPcs)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0)
                );

                setPiecesTot(tempPcsTot);

                let tempAmount = tempArray
                  .filter((item) => item.totalAmount !== "")
                  .map(amount)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

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
                setTotalGST(
                  parseFloat(tempCgstVal) +
                  parseFloat(tempSgstVal) +
                  parseFloat(tempIgstVal)
                );

                let tempTotal = tempArray
                  .filter((item) => item.total !== "")
                  .map(Total)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setTotal(parseFloat(tempTotal).toFixed(3));
                console.log(tempTotal);

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
                  supplierName: mainObj.firm_name,
                  supAddress: mainObj.address,
                  supplierGstUinNum: mainObj.gst_number,
                  supPanNum: mainObj.pan_number,
                  supState: mainObj.StateName
                    ? mainObj.StateName.name
                    : mainObj.state_name.name,
                  supCountry: mainObj.country_name
                    ? mainObj.country_name.name
                    : mainObj.CountryName.name,
                  supStateCode: mainObj.gst_number
                    ? mainObj.gst_number.substring(0, 2)
                    : "",
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
                  sGstTot: tempSgstVal
                    ? parseFloat(tempSgstVal).toFixed(3)
                    : "",
                  cGstTot: tempCgstVal
                    ? parseFloat(tempCgstVal).toFixed(3)
                    : "",
                  iGstTot: tempIgstVal
                    ? parseFloat(tempIgstVal).toFixed(3)
                    : "",
                  roundOff:
                    finalData.round_off === null ? "" : finalData.round_off,
                  pcsTotal: tempPcsTot,
                  grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
                  netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                  totalInvoiceAmt: parseFloat(
                    finalData.total_invoice_amount
                  ).toFixed(3),
                  stateId: mainObj.state,
                  is_tds_tcs: mainObj.is_tds_tcs,
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
                  jewelNarration:
                    finalData.jewellery_narration !== null
                      ? finalData.jewellery_narration
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
              } else if (otherDetail.loadType === 1) {
                let hallmarkChargesFrontEnd = finalData.hallmarkChargesFrontEnd;
                // console.log("hallmarkChargesFrontEnd -----------------", hallmarkChargesFrontEnd)

                let tagwiseArr = [];
                let catArray = [];
                let packingslipArray = [];
                let packetArr = [];
                for (let item of finalData.JewelleryPurchaseOrders) {
                  // console.log(item);

                  tagwiseArr.push({
                    loadType: otherDetail.loadType.toString(),
                    barcode: item.barcode,
                    packet_no: item.packet_no,
                    // Category: item.Category,
                    billingCategory: item.ProductCategory.billing_category_name,
                    HSNNum: item.ProductCategory.hsn_master.hsn_number,
                    // LotNumber: item.lot_no,
                    Pieces: item.pcs,
                    grossWeight: parseFloat(item.gross_wt).toFixed(3),
                    netWeight: parseFloat(item.net_wt).toFixed(3),
                    purity: item.purity,
                    variant_number: item?.DesignNumber?.variant_number,
                    fine: parseFloat(item.fine).toFixed(3),
                    wastagePer: parseFloat(item.wastage_per).toFixed(3),
                    wastageFine: parseFloat(item.wastage_fine).toFixed(3),
                    tag_amount_after_discount: parseFloat(
                      item.tag_amount_after_discount
                    ).toFixed(3),
                    tag_amount_before_discount: parseFloat(
                      item.tag_amount_before_discount
                    ).toFixed(3),
                    totalFine: parseFloat(item.total_fine).toFixed(3),
                    fineRate: parseFloat(item.fine_rate).toFixed(3),
                    categoryRate: parseFloat(item.category_rate).toFixed(3),
                    amount: parseFloat(item.amount).toFixed(3),
                    hallmarkCharges: parseFloat(
                      parseFloat(hallmarkChargesFrontEnd) * parseFloat(item.pcs)
                    ).toFixed(3),
                    totalAmount: parseFloat(item.total_amount).toFixed(3),
                    cgstPer: item.cgst,
                    cgstVal:
                      item.cgst !== null
                        ? parseFloat(
                          (parseFloat(item.total_amount) *
                            parseFloat(item.cgst)) /
                          100
                        ).toFixed(3)
                        : "",
                    sGstPer: item.sgst,
                    sGstVal:
                      item.sgst !== null
                        ? parseFloat(
                          (parseFloat(item.total_amount) *
                            parseFloat(item.sgst)) /
                          100
                        ).toFixed(3)
                        : "",
                    IGSTper: item.igst,
                    IGSTVal:
                      item.igst !== null
                        ? parseFloat(
                          (parseFloat(item.total_amount) *
                            parseFloat(item.igst)) /
                          100
                        ).toFixed(3)
                        : "",
                    total: parseFloat(item.total).toFixed(3),
                  });

                  let findIndex = catArray.findIndex(
                    (data) => data.category_id === item.category_id
                  );
                  if (findIndex > -1) {
                    catArray[findIndex].Pieces =
                      parseFloat(catArray[findIndex].Pieces) +
                      parseFloat(item.pcs);

                    catArray[findIndex].grossWeight = parseFloat(
                      parseFloat(catArray[findIndex].grossWeight) +
                      parseFloat(item.gross_wt)
                    ).toFixed(3);

                    catArray[findIndex].netWeight = parseFloat(
                      parseFloat(catArray[findIndex].netWeight) +
                      parseFloat(item.net_wt)
                    ).toFixed(3);

                    catArray[findIndex].fine = parseFloat(
                      parseFloat(catArray[findIndex].fine) +
                      parseFloat(item.fine)
                    ).toFixed(3);

                    catArray[findIndex].tag_amount_after_discount = parseFloat(
                      parseFloat(
                        catArray[findIndex].tag_amount_after_discount
                      ) + parseFloat(item.tag_amount_after_discount)
                    ).toFixed(3);

                    catArray[findIndex].tag_amount_before_discount = parseFloat(
                      parseFloat(
                        catArray[findIndex].tag_amount_before_discount
                      ) + parseFloat(item.tag_amount_before_discount)
                    ).toFixed(3);

                    catArray[findIndex].wastageFine = parseFloat(
                      parseFloat(catArray[findIndex].wastageFine) +
                      parseFloat(item.wastage_fine)
                    ).toFixed(3);

                    catArray[findIndex].totalFine = parseFloat(
                      parseFloat(catArray[findIndex].totalFine) +
                      parseFloat(item.total_fine)
                    ).toFixed(3);

                    catArray[findIndex].amount = parseFloat(
                      parseFloat(catArray[findIndex].amount) +
                      parseFloat(item.amount)
                    ).toFixed(3);

                    catArray[findIndex].categoryRate = parseFloat(
                      catArray[findIndex].amount / catArray[findIndex].netWeight * 10
                    ).toFixed(3);

                    // parseFloat(
                    //   parseFloat(catArray[findIndex].categoryRate) + parseFloat(item.category_rate)
                    // ).toFixed(3);

                    catArray[findIndex].totalAmount = parseFloat(
                      parseFloat(catArray[findIndex].totalAmount) +
                      parseFloat(item.total_amount)
                    ).toFixed(3);

                    catArray[findIndex].total = parseFloat(
                      parseFloat(catArray[findIndex].total) +
                      parseFloat(item.total)
                    ).toFixed(3);

                    catArray[findIndex].cgstVal = parseFloat(
                      (parseFloat(catArray[findIndex].total) -
                        parseFloat(catArray[findIndex].totalAmount)) /
                      2
                    ).toFixed(3);

                    catArray[findIndex].sGstVal = parseFloat(
                      (parseFloat(catArray[findIndex].total) -
                        parseFloat(catArray[findIndex].totalAmount)) /
                      2
                    ).toFixed(3);

                    catArray[findIndex].IGSTVal = parseFloat(
                      parseFloat(catArray[findIndex].total) -
                      parseFloat(catArray[findIndex].totalAmount)
                    ).toFixed(3);

                    catArray[findIndex].hallmarkCharges = parseFloat(
                      parseFloat(catArray[findIndex].hallmarkCharges) +
                      parseFloat(hallmarkChargesFrontEnd) *
                      parseFloat(item.pcs)
                    ).toFixed(3);
                  } else {
                    catArray.push({
                      category_id: item.category_id,
                      loadType: otherDetail.loadType.toString(),
                      barcode: item.barcode,
                      packet_no: item.packet_no,
                      Category: item.ProductCategory.category_name,
                      billingCategory:
                        item.ProductCategory.billing_category_name,
                      HSNNum: item.ProductCategory.hsn_master.hsn_number,
                      // LotNumber: item.lot_no,
                      Pieces: item.pcs,
                      grossWeight: parseFloat(item.gross_wt).toFixed(3),
                      netWeight: parseFloat(item.net_wt).toFixed(3),
                      purity: item.purity,
                      fine: parseFloat(item.fine).toFixed(3),
                      wastagePer: parseFloat(item.wastage_per).toFixed(3),
                      wastageFine: parseFloat(item.wastage_fine).toFixed(3),
                      tag_amount_after_discount: parseFloat(
                        item.tag_amount_after_discount
                      ).toFixed(3),
                      tag_amount_before_discount: parseFloat(
                        item.tag_amount_before_discount
                      ).toFixed(3),
                      totalFine: parseFloat(item.total_fine).toFixed(3),
                      fineRate: parseFloat(item.fine_rate).toFixed(3),
                      categoryRate: parseFloat(item.category_rate).toFixed(3),
                      amount: parseFloat(item.amount).toFixed(3),
                      hallmarkCharges: parseFloat(
                        parseFloat(hallmarkChargesFrontEnd) *
                        parseFloat(item.pcs)
                      ).toFixed(3),
                      totalAmount: parseFloat(item.total_amount).toFixed(3),
                      cgstPer: item.cgst,
                      cgstVal:
                        mainObj.cgst !== null
                          ? parseFloat(
                            (parseFloat(item.total_amount) *
                              parseFloat(item.cgst)) /
                            100
                          ).toFixed(3)
                          : "",
                      sGstPer: item.sgst,
                      sGstVal:
                        mainObj.sgst !== null
                          ? parseFloat(
                            (parseFloat(item.total_amount) *
                              parseFloat(item.sgst)) /
                            100
                          ).toFixed(3)
                          : "",
                      IGSTper: item.igst,
                      IGSTVal:
                        mainObj.igst !== null
                          ? parseFloat(
                            (parseFloat(item.total_amount) *
                              parseFloat(item.igst)) /
                            100
                          ).toFixed(3)
                          : "",
                      total: parseFloat(item.total).toFixed(3),
                    });
                  }

                  if (otherDetail.uploadType.toString() === "0") {
                    let findIndexSlip = packingslipArray.findIndex(
                      (data) => data.packing_slip_no === item.packing_slip_no
                    );
                    // console.log("find", findIndexSlip)
                    if (findIndexSlip > -1) {
                      packingslipArray[findIndexSlip].Pieces =
                        parseFloat(packingslipArray[findIndexSlip].Pieces) +
                        parseFloat(item.pcs);

                      packingslipArray[findIndexSlip].grossWeight = parseFloat(
                        parseFloat(
                          packingslipArray[findIndexSlip].grossWeight
                        ) + parseFloat(item.gross_wt)
                      ).toFixed(3);

                      packingslipArray[findIndexSlip].netWeight = parseFloat(
                        parseFloat(packingslipArray[findIndexSlip].netWeight) +
                        parseFloat(item.net_wt)
                      ).toFixed(3);

                      packingslipArray[findIndexSlip].fine = parseFloat(
                        parseFloat(packingslipArray[findIndexSlip].fine) +
                        parseFloat(item.fine)
                      ).toFixed(3);

                      packingslipArray[findIndexSlip].wastageFine = parseFloat(
                        parseFloat(
                          packingslipArray[findIndexSlip].wastageFine
                        ) + parseFloat(item.wastage_fine)
                      ).toFixed(3);

                      packingslipArray[
                        findIndexSlip
                      ].tag_amount_after_discount = parseFloat(
                        parseFloat(
                          packingslipArray[findIndexSlip]
                            .tag_amount_after_discount
                        ) + parseFloat(item.tag_amount_after_discount)
                      ).toFixed(3);

                      packingslipArray[
                        findIndexSlip
                      ].tag_amount_before_discount = parseFloat(
                        parseFloat(
                          packingslipArray[findIndexSlip]
                            .tag_amount_before_discount
                        ) + parseFloat(item.tag_amount_before_discount)
                      ).toFixed(3);

                      packingslipArray[findIndexSlip].totalFine = parseFloat(
                        parseFloat(packingslipArray[findIndexSlip].totalFine) +
                        parseFloat(item.total_fine).toFixed(3)
                      ).toFixed(3);

                      packingslipArray[findIndexSlip].amount = parseFloat(
                        parseFloat(packingslipArray[findIndexSlip].amount) +
                        parseFloat(item.amount)
                      ).toFixed(3);

                      packingslipArray[findIndexSlip].categoryRate = parseFloat(
                        packingslipArray[findIndexSlip].amount /
                        packingslipArray[findIndexSlip].netWeight
                      ).toFixed(3);

                      packingslipArray[findIndexSlip].hallmarkCharges =
                        parseFloat(
                          parseFloat(
                            packingslipArray[findIndexSlip].hallmarkCharges
                          ) +
                          parseFloat(hallmarkChargesFrontEnd) *
                          parseFloat(item.pcs)
                        ).toFixed(3);

                      packingslipArray[findIndexSlip].totalAmount = parseFloat(
                        parseFloat(
                          packingslipArray[findIndexSlip].totalAmount
                        ) + parseFloat(item.total_amount)
                      ).toFixed(3);

                      packingslipArray[findIndexSlip].total = parseFloat(
                        parseFloat(packingslipArray[findIndexSlip].total) +
                        parseFloat(item.total)
                      ).toFixed(3);

                      packingslipArray[findIndexSlip].cgstVal = parseFloat(
                        (parseFloat(packingslipArray[findIndexSlip].total) -
                          parseFloat(
                            packingslipArray[findIndexSlip].totalAmount
                          )) /
                        2
                      ).toFixed(3);

                      packingslipArray[findIndexSlip].sGstVal = parseFloat(
                        (parseFloat(packingslipArray[findIndexSlip].total) -
                          parseFloat(
                            packingslipArray[findIndexSlip].totalAmount
                          )) /
                        2
                      ).toFixed(3);

                      packingslipArray[findIndexSlip].IGSTVal = parseFloat(
                        parseFloat(packingslipArray[findIndexSlip].total) -
                        parseFloat(
                          packingslipArray[findIndexSlip].totalAmount
                        )
                      ).toFixed(3);
                    } else {
                      packingslipArray.push({
                        packing_slip_no: item.packing_slip_no,
                        loadType: otherDetail.loadType.toString(),
                        barcode: item.barcode,
                        packet_no: item.packet_no,
                        Category: item.ProductCategory.category_name,
                        billingCategory:
                          item.ProductCategory.billing_category_name,
                        HSNNum: item.ProductCategory.hsn_master.hsn_number,
                        // LotNumber: item.lot_no,
                        Pieces: item.pcs,
                        grossWeight: parseFloat(item.gross_wt).toFixed(3),
                        netWeight: parseFloat(item.net_wt).toFixed(3),
                        purity: item.purity,
                        fine: parseFloat(item.fine).toFixed(3),
                        wastagePer: parseFloat(item.wastage_per).toFixed(3),
                        wastageFine: parseFloat(item.wastage_fine).toFixed(3),
                        tag_amount_after_discount: parseFloat(
                          item.tag_amount_after_discount
                        ).toFixed(3),
                        tag_amount_before_discount: parseFloat(
                          item.tag_amount_before_discount
                        ).toFixed(3),
                        totalFine: parseFloat(item.total_fine).toFixed(3),
                        fineRate: parseFloat(item.fine_rate).toFixed(3),
                        categoryRate: parseFloat(item.category_rate).toFixed(3),
                        amount: parseFloat(item.amount).toFixed(3),
                        hallmarkCharges: parseFloat(
                          parseFloat(hallmarkChargesFrontEnd) *
                          parseFloat(item.pcs)
                        ).toFixed(3),
                        totalAmount: parseFloat(item.total_amount).toFixed(3),
                        cgstPer: item.cgst,
                        cgstVal:
                          mainObj.cgst !== null
                            ? parseFloat(
                              (parseFloat(item.total_amount) *
                                parseFloat(item.cgst)) /
                              100
                            ).toFixed(3)
                            : "",
                        sGstPer: item.sgst,
                        sGstVal:
                          mainObj.sgst !== null
                            ? parseFloat(
                              (parseFloat(item.total_amount) *
                                parseFloat(item.sgst)) /
                              100
                            ).toFixed(3)
                            : "",
                        IGSTper: item.igst,
                        IGSTVal:
                          mainObj.igst !== null
                            ? parseFloat(
                              (parseFloat(item.total_amount) *
                                parseFloat(item.igst)) /
                              100
                            ).toFixed(3)
                            : "",
                        total: parseFloat(item.total).toFixed(3),
                      });
                    }
                  }

                  if (
                    otherDetail.uploadType.toString() === "0" ||
                    otherDetail.uploadType.toString() === "1"
                  ) {
                    let packIndex = packetArr.findIndex(
                      (data) => data.packet_no === item.packet_no
                    );
                    console.log("packIndex", packetArr[packIndex]);
                    console.log(item, "fgbf")

                    if (packIndex > -1) {
                      packetArr[packIndex].Pieces =
                        parseFloat(packetArr[packIndex].Pieces) +
                        parseFloat(item.pcs);

                      packetArr[packIndex].grossWeight = parseFloat(
                        parseFloat(packetArr[packIndex].grossWeight) +
                        parseFloat(item.gross_wt)
                      ).toFixed(3);

                      packetArr[packIndex].netWeight = parseFloat(
                        parseFloat(packetArr[packIndex].netWeight) +
                        parseFloat(item.net_wt)
                      ).toFixed(3);

                      packetArr[packIndex].fine = parseFloat(
                        parseFloat(packetArr[packIndex].fine) +
                        parseFloat(item.fine)
                      ).toFixed(3);

                      packetArr[packIndex].wastageFine = parseFloat(
                        parseFloat(packetArr[packIndex].wastageFine) +
                        parseFloat(item.wastage_fine)
                      ).toFixed(3);

                      packetArr[packIndex].tag_amount_after_discount =
                        parseFloat(
                          parseFloat(
                            packetArr[packIndex].tag_amount_after_discount
                          ) + parseFloat(item.tag_amount_after_discount)
                        ).toFixed(3);

                      packetArr[packIndex].tag_amount_before_discount =
                        parseFloat(
                          parseFloat(
                            packetArr[packIndex].tag_amount_before_discount
                          ) + parseFloat(item.tag_amount_before_discount)
                        ).toFixed(3);

                      packetArr[packIndex].totalFine = parseFloat(
                        parseFloat(packetArr[packIndex].totalFine) +
                        parseFloat(item.total_fine).toFixed(3)
                      ).toFixed(3);

                      packetArr[packIndex].amount = parseFloat(
                        parseFloat(packetArr[packIndex].amount) +
                        parseFloat(item.amount)
                      ).toFixed(3);

                      packetArr[packIndex].categoryRate = parseFloat(
                        packetArr[packIndex].amount /
                        packetArr[packIndex].netWeight
                      ).toFixed(3);

                      packetArr[packIndex].hallmarkCharges = parseFloat(
                        parseFloat(packetArr[packIndex].hallmarkCharges) +
                        parseFloat(hallmarkChargesFrontEnd) *
                        parseFloat(item.pcs)
                      ).toFixed(3);

                      packetArr[packIndex].totalAmount = parseFloat(
                        parseFloat(packetArr[packIndex].totalAmount) +
                        parseFloat(item.total_amount)
                      ).toFixed(3);

                      packetArr[packIndex].total = parseFloat(
                        parseFloat(packetArr[packIndex].total) +
                        parseFloat(item.total)
                      ).toFixed(3);

                      packetArr[packIndex].cgstVal = parseFloat(
                        (parseFloat(packetArr[packIndex].total) -
                          parseFloat(packetArr[packIndex].totalAmount)) /
                        2
                      ).toFixed(3);

                      packetArr[packIndex].sGstVal = parseFloat(
                        (parseFloat(packetArr[packIndex].total) -
                          parseFloat(packetArr[packIndex].totalAmount)) /
                        2
                      ).toFixed(3);

                      packetArr[packIndex].IGSTVal = parseFloat(
                        parseFloat(packetArr[packIndex].total) -
                        parseFloat(packetArr[packIndex].totalAmount)
                      ).toFixed(3);
                    } else {
                      packetArr.push({
                        packet_no: item.packet_no,
                        billingCategory:
                          item.ProductCategory.billing_category_name,
                        HSNNum: item.ProductCategory.hsn_master.hsn_number,
                        Pieces: item.pcs,
                        grossWeight: parseFloat(item.gross_wt).toFixed(3),
                        netWeight: parseFloat(item.net_wt).toFixed(3),
                        purity: item.purity,
                        fine: parseFloat(item.fine).toFixed(3),
                        wastagePer: parseFloat(item.wastage_per).toFixed(3),
                        wastageFine: parseFloat(item.wastage_fine).toFixed(3),
                        totalFine: parseFloat(item.total_fine).toFixed(3),
                        tag_amount_before_discount: parseFloat(
                          item.tag_amount_before_discount
                        ).toFixed(3),
                        tag_amount_after_discount: parseFloat(
                          item.tag_amount_after_discount
                        ).toFixed(3),
                        fineRate: parseFloat(item.fine_rate).toFixed(3),
                        categoryRate: parseFloat(item.category_rate).toFixed(3),
                        amount: parseFloat(item.amount).toFixed(3),
                        hallmarkCharges: parseFloat(
                          parseFloat(hallmarkChargesFrontEnd) *
                          parseFloat(item.pcs)
                        ).toFixed(3),
                        totalAmount: parseFloat(item.total_amount).toFixed(3),
                        cgstPer: item.cgst,
                        cgstVal:
                          mainObj.cgst !== null
                            ? parseFloat(
                              (parseFloat(item.total_amount) *
                                parseFloat(item.cgst)) /
                              100
                            ).toFixed(3)
                            : "",
                        sGstPer: item.sgst,
                        sGstVal:
                          mainObj.sgst !== null
                            ? parseFloat(
                              (parseFloat(item.total_amount) *
                                parseFloat(item.sgst)) /
                              100
                            ).toFixed(3)
                            : "",
                        IGSTper: item.igst,
                        IGSTVal:
                          mainObj.igst !== null
                            ? parseFloat(
                              (parseFloat(item.total_amount) *
                                parseFloat(item.igst)) /
                              100
                            ).toFixed(3)
                            : "",
                        total: parseFloat(item.total).toFixed(3),
                      });
                    }
                  }
                }
                setProductData(catArray);
                setTagWiseData(tagwiseArr);
                setPackingSlipData(packingslipArray);
                setPacketData(packetArr);

                function grossWeight(item) {
                  // console.log(parseFloat(item.grossWeight));
                  return parseFloat(item.grossWeight);
                }

                let tempGrossWeight = tagwiseArr
                  // .filter((data) => data.grossWeight !== "")
                  .map(grossWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setTotalGrossWeight(parseFloat(tempGrossWeight).toFixed(3));

                function netWeight(item) {
                  return parseFloat(item.netWeight);
                }

                let tempNetWtTot = parseFloat(
                  tagwiseArr
                    .filter((data) => data.netWeight !== "")
                    .map(netWeight)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0)
                ).toFixed(3);

                setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

                function totalFine(item) {
                  return parseFloat(item.totalFine);
                }

                function getPcs(item) {
                  return parseFloat(item.Pieces);
                }

                let tempPcsTot = parseFloat(
                  tagwiseArr
                    .filter((data) => data.Pieces !== "")
                    .map(getPcs)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0)
                );

                setPiecesTot(tempPcsTot);

                let tempFineGold = tagwiseArr
                  .filter((item) => item.totalFine !== "")
                  .map(totalFine)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                console.log(tempFineGold);
                setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

                function fine(item) {
                  return parseFloat(item.fine);
                }

                let tempFineTot = tagwiseArr
                  .filter((item) => item.fine !== "")
                  .map(fine)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setFineTotal(parseFloat(tempFineTot).toFixed(3));

                function totalAmount(item) {
                  return item.totalAmount;
                }

                let tempTotAmount = tagwiseArr
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

                let tempCGstVal = tagwiseArr
                  .filter((item) => item.cgstVal !== "")
                  .map(CGSTVal)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setCgstVal(parseFloat(tempCGstVal).toFixed(3));

                function SGSTval(item) {
                  return item.sGstVal;
                }

                let tempSgstVal = tagwiseArr
                  .filter((item) => item.sGstVal !== "")
                  .map(SGSTval)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setSgstVal(parseFloat(tempSgstVal).toFixed(3));

                function IGSTVal(item) {
                  return item.IGSTVal;
                }

                let tempIgstVal = tagwiseArr
                  .filter((item) => item.IGSTVal !== "")
                  .map(IGSTVal)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setIgstVal(parseFloat(tempIgstVal).toFixed(3));
                setTotalGST(
                  parseFloat(tempCGstVal) +
                  parseFloat(tempSgstVal) +
                  parseFloat(tempIgstVal)
                );

                function total(item) {
                  return item.total;
                }
                let tempTotal = tagwiseArr
                  .filter((item) => item.total !== "")
                  .map(total)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setTotal(parseFloat(tempTotal).toFixed(3));
                setLegderAmount(
                  Math.abs(
                    parseFloat(
                      parseFloat(finalData.final_invoice_amount) -
                      parseFloat(finalData.total_invoice_amount)
                    ).toFixed(3)
                  )
                );

                setPrintObj({
                  supplierName: mainObj.firm_name,
                  supAddress: mainObj.address,
                  supplierGstUinNum: mainObj.gst_number,
                  supPanNum: mainObj.pan_number,
                  supState: mainObj.StateName
                    ? mainObj.StateName.name
                    : mainObj.state_name.name,
                  supCountry: mainObj.country_name
                    ? mainObj.country_name.name
                    : mainObj.CountryName.name,
                  supStateCode: mainObj.gst_number
                    ? mainObj.gst_number.substring(0, 2)
                    : "",
                  purcVoucherNum: finalData.voucher_no,
                  partyInvNum: finalData.party_voucher_no,
                  voucherDate: moment(
                    finalData.purchase_voucher_create_date
                  ).format("DD-MM-YYYY"),
                  supState: mainObj.StateName
                    ? mainObj.StateName.name
                    : mainObj.state_name.name,
                  orderDetails: catArray,
                  taxableAmount: parseFloat(tempTotAmount).toFixed(3),
                  sGstTot: tempSgstVal
                    ? parseFloat(tempSgstVal).toFixed(3)
                    : "",
                  cGstTot: tempCGstVal
                    ? parseFloat(tempCGstVal).toFixed(3)
                    : "",
                  iGstTot: tempIgstVal
                    ? parseFloat(tempIgstVal).toFixed(3)
                    : "",
                  roundOff:
                    finalData.round_off === null ? "" : finalData.round_off,
                  pcsTotal: tempPcsTot,
                  grossWtTOt: parseFloat(tempGrossWeight).toFixed(3),
                  netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                  totalInvoiceAmt: parseFloat(
                    finalData.total_invoice_amount
                  ).toFixed(3),
                  stateId: mainObj.state,
                  is_tds_tcs: mainObj.is_tds_tcs,
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
                  jewelNarration:
                    finalData.jewellery_narration !== null
                      ? finalData.jewellery_narration
                      : "",
                  accNarration:
                    finalData.account_narration !== null
                      ? finalData.account_narration
                      : "",
                  balancePayable: parseFloat(
                    finalData.final_invoice_amount
                  ).toFixed(3),
                });
                setAdjustedRate(true);
                setIsuploaded(true);
              }
            } else {
              // setApiData([]);
            }
          } else {
            // setApiData([]);
          }
        } else {
          setLoading(false);
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: api });
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
        handleError(error, dispatch, { api: "api/stockname/stone" });
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
        handleError(error, dispatch, { api: "api/stockname/findingvariant" });
      });
  }

  function getVoucherNumber() {
    axios
      .get(Config.getCommonUrl() + "api/jewellerypurchase/get/voucher")
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
        handleError(error, dispatch, {
          api: "api/jewellerypurchase/get/voucher",
        });
      });
  }

  const checkFileHeader = (firstRow) => {
    var actualArr = []
    if (uploadType === "0") {
      actualArr = ["Packing_Slip_number", "Packet_No", "Design_Num", "Category", "Barcode", "Purity", "Pcs", "Size", "Gross_Wt", "Net_Wt", "Wastage_percentage", "Stone_Wt", "Beads_Wt", "Solitaire_Wt", "Oth_wt", "Hallmark_Charges", "Tag_amount_before_discount", "Tag_amount_after_discount", "HUID"];
    } else if (uploadType === "1") {
      actualArr = ["Packet_No", "Design_Num", "Category", "Barcode", "Purity", "Pcs", "Size", "Gross_Wt", "Net_Wt", "Wastage_percentage", "Stone_Wt", "Beads_Wt", "Solitaire_Wt", "Oth_wt", "Hallmark_Charges", "Tag_amount_before_discount", "Tag_amount_after_discount", "HUID"];
    } else if (uploadType === "2") {
      actualArr = ["Design_Num", "Category", "Barcode", "Purity", "Pcs", "Size", "Gross_Wt", "Net_Wt", "Wastage_percentage", "Stone_Wt", "Beads_Wt", "Solitaire_Wt", "Oth_wt", "Hallmark_Charges", "Tag_amount_before_discount", "Tag_amount_after_discount", "HUID"];
    }

    if (firstRow.length === actualArr.length) {
      var ress = true;
      actualArr.map((i, index) => {
        if (i !== firstRow[index]) {
          ress = false
        }
      })
      return ress
    } else {
      return false
    }
  }

  const handleFile = (e) => {
    e.preventDefault();
    setShortageRfix("");
    var files = e.target.files,
      f = files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var data = e.target.result;
      let readedData = XLSX.read(data, { type: "binary" });
      const wsname = readedData.SheetNames[0];
      const ws = readedData.Sheets[wsname];
      const firstRow = XLSX.utils.sheet_to_json(ws, { range: 0, header: 1 })[0];
      if (checkFileHeader(firstRow)) {
        //convert to json objects
        const dataParse = XLSX.utils.sheet_to_json(ws);
        function totalFine(item) {
          let Net_Wt = undefined;
          if (item.Stone_Wt) {
            Net_Wt = parseFloat(item.Gross_Wt) - parseFloat(item.Stone_Wt);
            // console.log("Stone_Wt",parseFloat(item.Stone_Wt),"Net_Wt", Net_Wt,1)
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
              // console.log(Net_Wt,31)
            } else {
              Net_Wt = parseFloat(data.Gross_Wt) - parseFloat(item.Oth_wt);
              // console.log(Net_Wt,32)
            }
          }
          if (Net_Wt === undefined) {
            // console.log("zero")
            Net_Wt = parseFloat(item.Gross_Wt);
            // console.log(Net_Wt,4)
          }
          // console.log("Net_Wt", Net_Wt)

          // console.log("fineGold",(parseFloat(Net_Wt).toFixed(3) * parseFloat(item.Purity))/100)
          let finegold = (parseFloat(Net_Wt) * parseFloat(item.Purity)) / 100;
          let wastage = (Net_Wt * parseFloat(item.Wastage_percentage)) / 100;
          // console.log("finegold",finegold)
          // console.log("total ",finegold + wastage)
          return finegold;
        }

        let tempArray = [];
        let catArray = [];
        let packingslipArray = [];
        for (let item of dataParse) {
          // console.log(item);
          tempArray.push({
            loadType: selectedLoad,
            Category: item.Category,
            billingCategory: "",
            HSNNum: "",
            LotNumber: "",
            Pieces: item.Pcs,
            grossWeight: parseFloat(item.Gross_Wt).toFixed(3),
            netWeight: parseFloat(item.Net_Wt).toFixed(3),
            purity: item.Purity,
            variant_number: item.Design_Num,
            fine: "",
            labourCharges: "",
            unitOfPurchase: "",
            wastagePer: item.Wastage_percentage ? parseFloat(item.Wastage_percentage).toFixed(3) : "",
            wastageFine: "",
            totalFine: "",
            fineRate: "",
            categoryRate: "",
            totalAmount: "",
            cgstPer: "",
            cgstVal: "",
            sGstPer: "",
            sGstVal: "",
            IGSTper: "",
            IGSTVal: "",
            total: "",
          });

          let findIndex = catArray.findIndex(
            (data) => data.Category === item.Category
          );
          if (findIndex > -1) {
            catArray[findIndex].Pieces =
              parseFloat(catArray[findIndex].Pieces) + parseFloat(item.Pcs);

            catArray[findIndex].grossWeight = parseFloat(
              parseFloat(catArray[findIndex].grossWeight) +
              parseFloat(item.Gross_Wt)
            ).toFixed(3);

            catArray[findIndex].netWeight = parseFloat(
              parseFloat(catArray[findIndex].netWeight) + parseFloat(item.Net_Wt)
            ).toFixed(3);

            // catArray[findIndex].fine = parseFloat(
            //   parseFloat(catArray[findIndex].fine) + parseFloat(totalFine(item))
            // ).toFixed(3);
          } else {
            catArray.push({
              loadType: selectedLoad,
              Category: item.Category,
              billingCategory: "",
              HSNNum: "",
              LotNumber: "",
              Pieces: item.Pcs,
              grossWeight: parseFloat(item.Gross_Wt).toFixed(3),
              netWeight: parseFloat(item.Net_Wt).toFixed(3),
              purity: item.Purity,
              fine: "",
              labourCharges: "",
              unitOfPurchase: "",
              wastagePer: item.Wastage_percentage ? parseFloat(item.Wastage_percentage).toFixed(3) : "",
              wastageFine: "",
              totalFine: "",
              fineRate: "",
              categoryRate: "",
              totalAmount: "",
              cgstPer: "",
              cgstVal: "",
              sGstPer: "",
              sGstVal: "",
              IGSTper: "",
              IGSTVal: "",
              total: "",
            });
          }
        }
        console.log(tempArray);

        //

        // setFormValues(tempArray);
        setProductData(catArray); //category wise Data
        setTagWiseData(tempArray);

        function fine(item) {
          return parseFloat(item.fine);
        }

        let tempFineTot = tempArray
          .filter((item) => item.fine !== "")
          .map(fine)
          .reduce(function (a, b) {
            // sum all resulting numbers
            return parseFloat(a) + parseFloat(b);
          }, 0);

        setFineTotal(parseFloat(tempFineTot).toFixed(3));

        function grossWeight(item) {
          // console.log(parseFloat(item.grossWeight));
          return parseFloat(item.grossWeight);
        }

        let tempGrossWeight = tempArray
          // .filter((data) => data.grossWeight !== "")
          .map(grossWeight)
          .reduce(function (a, b) {
            // sum all resulting numbers
            return parseFloat(a) + parseFloat(b);
          }, 0);

        setTotalGrossWeight(parseFloat(tempGrossWeight).toFixed(3));

        function netWeight(item) {
          return parseFloat(item.netWeight);
        }

        setTotalNetWeight(
          parseFloat(
            tempArray
              .filter((data) => data.netWeight !== "")
              .map(netWeight)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0)
          ).toFixed(3)
        );

        // console.log(formValues)
        let fileWeight = 0; //user input total weight

        function sum(prev, next) {
          return prev + next;
        }

        //fine gold
        fileWeight = parseFloat(dataParse.map(totalFine).reduce(sum, 0)).toFixed(
          3
        );

        console.log(fileWeight);

        console.log("fileWeight", fileWeight, "tempApiWeight", tempApiWeight);

        dispatch(Actions.showMessage({ message: "Please Fix the Rate" }));

        setFineGoldTotal(parseFloat(fileWeight).toFixed(3));
        // setFineTotal(fileWeight)
        // setCanEnterVal(true);
        setShortageRfix(parseFloat(fileWeight).toFixed(3));
        setFileSelected(f);
        setIsuploaded(true);
        // }
        setFileRfixData(fileWeight);
      } else {
        dispatch(Actions.showMessage({ message: "File format not matched" }));
      }
    };
    reader.readAsBinaryString(f);
  }

  function setFileRfixData(fileWeight) {
    //file data
    console.log(balanceRfixData);
    if (balanceRfixData !== "") {
      function sum(prev, next) {
        return prev + next;
      }

      function usedTotWeight(item) {
        return parseFloat(item.usedWeight);
      }

      // let FinalWeight = 0;//user input total weight
      let FinalWeight = fileWeight;

      // if (FinalWeight === 0) {
      setNewRate("");
      setTempRate("");
      setAvgeRate("");
      // return;
      // }

      setShortageRfix(FinalWeight);
      console.log("FinalWeight", FinalWeight);
      console.log("balanceRfixData", balanceRfixData);

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

      setShortageRfix(fileWeight);
      // setCanEnterVal(true);
    }
  }
  //verifying file here then on save upload again
  function uploadfileapicall(f) {
    let rates = balRfixViewData
      .filter((element) => parseFloat(element.usedWeight) > 0)
      .map((item) => {
        return {
          id: item.id,
          weightToBeUtilized: item.usedWeight,
        };
      });
    const formData = new FormData();
    formData.append("file", f);
    formData.append("voucher_no", voucherNumber);
    formData.append("party_voucher_no", partyVoucherNum);
    formData.append("opposite_account_id", oppositeAccSelected.value);
    formData.append(
      "department_id",
      window.localStorage.getItem("SelectedDepartment")
    );
    formData.append(
      "vendor_id",
      selectedVendorClient.value === 1
        ? selectedVendor.value
        : selectedClientFirm.value
    );
    formData.append("round_off", roundOff === "" ? 0 : roundOff);
    formData.append("jewellery_narration", jewelNarration);
    formData.append("account_narration", accNarration);
    // formData.append("tds_tcs_ledger_id", is_tds_tcs != 0 ? ledgerName.value : null);
    formData.append(
      "is_vendor_client",
      selectedVendorClient.value === 1 ? 1 : 2
    );

    if (tempRate !== "") {
      formData.append("setRate", tempRate);
    }

    let temp = JSON.stringify(rates);
    if (rates.length > 0) {
      formData.append("rates", temp);
    }
    // console.log(...fd)
    // console.log(JSON.stringify(rates))
    if (allowedBackDate) {
      formData.append("purchaseCreateDate", voucherDate);
    }
    // ...(allowedBackDate && {
    //   purchaseCreateDate: voucherDate,
    // }),

    if (selectedLoad === "1") {
      if (uploadType === "0") {
        formData.append("is_packingSlip", 1);
        formData.append("is_barcoded", 1);
        formData.append("is_packetNo", 1);
      } else if (uploadType === "1") {
        formData.append("is_barcoded", 1);
        formData.append("is_packetNo", 1);
      } else if (uploadType === "2") {
        formData.append("is_barcoded", 1);
      }
      formData.append("with_bom", bomType);
      // <option value="0">Upload Packing Slip Wise </option>
      // <option value="1">Upload Packet Wise </option>
      // <option value="2">Upload Barcode Wise </option>
    }
    if (is_tds_tcs == 1) {
      formData.append("tcs_rate", ledgerAmount);
    }
    // ...(is_tds_tcs==="1" && {
    //   tcs_rate : ledgerAmount
    // }),
    console.log(...formData);
    setLoading(true);
    axios
      .post(
        Config.getCommonUrl() + "api/jewellerypurchase/createfromexcel",
        formData
      )
      .then(function (response) {
        console.log(response);
        setLoading(false);
        if (response.data.success === true) {
          console.log(response);
          setIsCsvErr(false);

          let OrdersData = response.data.data.OrdersData;
          let categoryData = response.data.data.categoryData;

          let tempArray = [];
          let tempCatArray = [];
          let temSlipArray = [];
          for (let item of OrdersData) {
            console.log(item);
            let tCgstPer =
              vendorStateId === 12
                ? parseFloat(parseFloat(item.gst) / 2).toFixed(3)
                : 0;
            let tSgstper =
              vendorStateId === 12
                ? parseFloat(parseFloat(item.gst) / 2).toFixed(3)
                : 0;
            let tIgstPer =
              vendorStateId !== 12 ? parseFloat(item.gst).toFixed(3) : 0;

            tempArray.push({
              loadType: selectedLoad,
              barcode: item.barcode,
              packet_no: item.packet_no,
              Category: item.Category,
              billingCategory: item.billingCategoryName,
              HSNNum: item.hsnNumber,
              LotNumber: item.lot_no,
              Pieces: item.pcs,
              grossWeight: parseFloat(item.gross_wt).toFixed(3),
              netWeight: parseFloat(item.net_wt).toFixed(3),
              purity: item.purity,
              variant_number: item.design_no,
              fine: item.fine,
              wastagePer: parseFloat(item.wastage_per).toFixed(3),
              wastageFine: parseFloat(item.wastage_fine).toFixed(3),
              tag_amount_after_discount: parseFloat(
                item.tag_amount_after_discount
              ).toFixed(3),
              tag_amount_before_discount: parseFloat(
                item.tag_amount_before_discount
              ).toFixed(3),
              totalFine: parseFloat(item.total_fine).toFixed(3),
              fineRate: parseFloat(item.fine_rate).toFixed(3),
              categoryRate: parseFloat(item.category_rate).toFixed(3),
              amount: parseFloat(item.amount).toFixed(3),
              hallmarkCharges: parseFloat(item.hallmarkChargesFrontEnd).toFixed(
                3
              ),
              // hallmarkCharges: parseFloat(
              //   parseFloat(item.onePcsHallmarkCharges) * parseFloat(item.pcs)
              // ).toFixed(3),
              totalAmount: parseFloat(item.total_amount).toFixed(3),
              cgstPer: tCgstPer,
              cgstVal: parseFloat(
                (parseFloat(item.total_amount) * parseFloat(tCgstPer)) / 100
              ).toFixed(3),
              sGstPer: tSgstper,
              sGstVal: parseFloat(
                (parseFloat(item.total_amount) * parseFloat(tSgstper)) / 100
              ).toFixed(3),
              IGSTper: tIgstPer,
              IGSTVal: parseFloat(
                (parseFloat(item.total_amount) * parseFloat(tIgstPer)) / 100
              ).toFixed(3),
              total: parseFloat(item.total).toFixed(3),
            });
          }

          for (let item of categoryData) {
            // console.log(item);
            let tCgstPer =
              vendorStateId === 12
                ? parseFloat(parseFloat(item.gst) / 2).toFixed(3)
                : 0;
            let tSgstper =
              vendorStateId === 12
                ? parseFloat(parseFloat(item.gst) / 2).toFixed(3)
                : 0;
            let tIgstPer =
              vendorStateId !== 12 ? parseFloat(item.gst).toFixed(3) : 0;

            tempCatArray.push({
              loadType: selectedLoad,
              barcode: item.barcode,
              packet_no: item.packet_no,
              Category: item.Category,
              billingCategory: item.billingCategoryName,
              HSNNum: item.hsnNumber,
              LotNumber: item.lot_no,
              Pieces: item.pcs,
              grossWeight: parseFloat(item.gross_wt).toFixed(3),
              netWeight: parseFloat(item.net_wt).toFixed(3),
              purity: item.purity,
              fine: parseFloat(item.fine).toFixed(3),
              wastagePer: parseFloat(item.wastage_per).toFixed(3),
              wastageFine: parseFloat(item.wastage_fine).toFixed(3),
              tag_amount_after_discount: parseFloat(
                item.tag_amount_after_discount
              ).toFixed(3),
              tag_amount_before_discount: parseFloat(
                item.tag_amount_before_discount
              ).toFixed(3),
              totalFine: parseFloat(item.total_fine).toFixed(3),
              fineRate: parseFloat(item.fine_rate).toFixed(3),
              categoryRate: parseFloat(item.category_rate).toFixed(3),
              amount: parseFloat(item.amount).toFixed(3),
              hallmarkCharges: parseFloat(item.hallmarkChargesFrontEnd).toFixed(
                3
              ),
              // hallmarkCharges: parseFloat(
              //   parseFloat(item.onePcsHallmarkCharges) * parseFloat(item.pcs)
              // ).toFixed(3),
              totalAmount: parseFloat(item.total_amount).toFixed(3),
              cgstPer: tCgstPer,
              cgstVal: parseFloat(
                (parseFloat(item.total_amount) * parseFloat(tCgstPer)) / 100
              ).toFixed(3),
              sGstPer: tSgstper,
              sGstVal: parseFloat(
                (parseFloat(item.total_amount) * parseFloat(tSgstper)) / 100
              ).toFixed(3),
              IGSTper: tIgstPer,
              IGSTVal: parseFloat(
                (parseFloat(item.total_amount) * parseFloat(tIgstPer)) / 100
              ).toFixed(3),
              total: parseFloat(item.total).toFixed(3),
            });
          }
          // setFormValues(tempArray);
          setProductData(tempCatArray); //category wise Data
          setTagWiseData(tempArray);

          if (uploadType === "0") {
            let packingSlipData = response.data.data.packingSlipData;
            for (let item of packingSlipData) {
              // console.log(item);
              let tCgstPer =
                vendorStateId === 12
                  ? parseFloat(parseFloat(item.gst) / 2).toFixed(3)
                  : 0;
              let tSgstper =
                vendorStateId === 12
                  ? parseFloat(parseFloat(item.gst) / 2).toFixed(3)
                  : 0;
              let tIgstPer =
                vendorStateId !== 12 ? parseFloat(item.gst).toFixed(3) : 0;

              temSlipArray.push({
                packing_slip_no: item.packing_slip_no,
                billingCategory: item.billingCategoryName,
                HSNNum: item.hsnNumber,
                Pieces: item.pcs,
                grossWeight: parseFloat(item.gross_wt).toFixed(3),
                netWeight: parseFloat(item.net_wt).toFixed(3),
                purity: item.purity,
                fine: parseFloat(item.fine).toFixed(3),
                wastagePer: parseFloat(item.wastage_per).toFixed(3),
                wastageFine: parseFloat(item.wastage_fine).toFixed(3),
                totalFine: parseFloat(item.total_fine).toFixed(3),
                tag_amount_before_discount: parseFloat(
                  item.tag_amount_before_discount
                ).toFixed(3),
                tag_amount_after_discount: parseFloat(
                  item.tag_amount_after_discount
                ).toFixed(3),
                fineRate: parseFloat(item.fine_rate).toFixed(3),
                categoryRate: parseFloat(item.category_rate).toFixed(3),
                amount: parseFloat(item.amount).toFixed(3),
                hallmarkCharges: parseFloat(
                  item.hallmarkChargesFrontEnd
                ).toFixed(3),
                totalAmount: parseFloat(item.total_amount).toFixed(3),
                cgstPer: tCgstPer,
                cgstVal: parseFloat(
                  (parseFloat(item.total_amount) * parseFloat(tCgstPer)) / 100
                ).toFixed(3),
                sGstPer: tSgstper,
                sGstVal: parseFloat(
                  (parseFloat(item.total_amount) * parseFloat(tSgstper)) / 100
                ).toFixed(3),
                IGSTper: tIgstPer,
                IGSTVal: parseFloat(
                  (parseFloat(item.total_amount) * parseFloat(tIgstPer)) / 100
                ).toFixed(3),
                total: parseFloat(item.total).toFixed(3),
              });
            }

            setPackingSlipData(temSlipArray);
          }

          if (uploadType === "0" || uploadType === "1") {
            let tempPacketArr = [];

            let packetData = response.data.data.packetData;
            for (let item of packetData) {
              // console.log(item);
              let tCgstPer =
                vendorStateId === 12
                  ? parseFloat(parseFloat(item.gst) / 2).toFixed(3)
                  : 0;
              let tSgstper =
                vendorStateId === 12
                  ? parseFloat(parseFloat(item.gst) / 2).toFixed(3)
                  : 0;
              let tIgstPer =
                vendorStateId !== 12 ? parseFloat(item.gst).toFixed(3) : 0;

              tempPacketArr.push({
                packet_no: item.packet_no,
                billingCategory: item.billingCategoryName,
                HSNNum: item.hsnNumber,
                Pieces: item.pcs,
                grossWeight: parseFloat(item.gross_wt).toFixed(3),
                netWeight: parseFloat(item.net_wt).toFixed(3),
                purity: item.purity,
                fine: parseFloat(item.fine).toFixed(3),
                wastagePer: parseFloat(item.wastage_per).toFixed(3),
                wastageFine: parseFloat(item.wastage_fine).toFixed(3),
                totalFine: parseFloat(item.total_fine).toFixed(3),
                tag_amount_before_discount: parseFloat(
                  item.tag_amount_before_discount
                ).toFixed(3),
                tag_amount_after_discount: parseFloat(
                  item.tag_amount_after_discount
                ).toFixed(3),
                fineRate: parseFloat(item.fine_rate).toFixed(3),
                categoryRate: parseFloat(item.category_rate).toFixed(3),
                amount: parseFloat(item.amount).toFixed(3),
                hallmarkCharges: parseFloat(
                  item.hallmarkChargesFrontEnd
                ).toFixed(3),
                totalAmount: parseFloat(item.total_amount).toFixed(3),
                cgstPer: tCgstPer,
                cgstVal: parseFloat(
                  (parseFloat(item.total_amount) * parseFloat(tCgstPer)) / 100
                ).toFixed(3),
                sGstPer: tSgstper,
                sGstVal: parseFloat(
                  (parseFloat(item.total_amount) * parseFloat(tSgstper)) / 100
                ).toFixed(3),
                IGSTper: tIgstPer,
                IGSTVal: parseFloat(
                  (parseFloat(item.total_amount) * parseFloat(tIgstPer)) / 100
                ).toFixed(3),
                total: parseFloat(item.total).toFixed(3),
              });
            }

            setPacketData(tempPacketArr);
          }

          function grossWeight(item) {
            // console.log(parseFloat(item.grossWeight));
            return parseFloat(item.grossWeight);
          }

          let tempGrossWeight = tempArray
            // .filter((data) => data.grossWeight !== "")
            .map(grossWeight)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setTotalGrossWeight(parseFloat(tempGrossWeight).toFixed(3));

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

          function getPcs(item) {
            return parseFloat(item.Pieces);
          }

          let tempPcsTot = parseFloat(
            tempArray
              .filter((data) => data.Pieces !== "")
              .map(getPcs)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0)
          );

          setPiecesTot(tempPcsTot);

          function totalFine(item) {
            return parseFloat(item.totalFine);
          }

          let tempFineGold = tempArray
            .filter((item) => item.totalFine !== "")
            .map(totalFine)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          console.log(tempFineGold);
          setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

          function fine(item) {
            return parseFloat(item.fine);
          }

          let tempFineTot = tempArray
            .filter((item) => item.fine !== "")
            .map(fine)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setFineTotal(parseFloat(tempFineTot).toFixed(3));

          function totalAmount(item) {
            return item.totalAmount;
          }

          let tempTotAmount = tempArray
            .filter((item) => item.totalAmount !== "")
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
              .filter((item) => item.cgstVal !== "")
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
              .filter((item) => item.sGstVal !== "")
              .map(SGSTval)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);

            setSgstVal(parseFloat(tempSgstVal).toFixed(3));

            // console.log(
            //   parseFloat(
            //     parseFloat(tempCGstVal) + parseFloat(tempSgstVal)
            //   ).toFixed(3)
            // );
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
          let tempTotal = tempArray
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

          if (is_tds_tcs == 1) {
            //1 is tcs, 2 means tds
            tempLedgerAmount = parseFloat(
              (tempTotalInvoiceAmt * rateValue) / 100
            ).toFixed(3); //with gst on total invoice amount
            // console.log(tempLedgerAmount);
            //if tcs then enter amount manually
            // tempLedgerAmount = 0;
            tempfinalAmount = parseFloat(
              parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)
            ).toFixed(3);
          } else if (is_tds_tcs == 2) {
            //tds
            tempLedgerAmount = parseFloat(
              (parseFloat(tempTotAmount) * rateValue) / 100
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

          //all totals are done with tempArray, should be done with tempCatArray
          setPrintObj({
            ...printObj,
            orderDetails: tempCatArray,
            taxableAmount: parseFloat(tempTotAmount).toFixed(3),
            sGstTot:
              vendorStateId === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
            cGstTot:
              vendorStateId === 12 ? parseFloat(tempCGstVal).toFixed(3) : "",
            iGstTot:
              vendorStateId !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
            // roundOff: finalData.round_off === null ? "" : finalData.round_off,
            pcsTotal: tempPcsTot,
            grossWtTOt: parseFloat(tempGrossWeight).toFixed(3),
            netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
            totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
            stateId: vendorStateId,
            is_tds_tcs: is_tds_tcs,
            taxAmount: parseFloat(tempLedgerAmount).toFixed(3),
            // jewelNarration: finalData.jewellery_narration !== null ? finalData.jewellery_narration : "",
            // accNarration: finalData.account_narration !== null ? finalData.account_narration : "",
            balancePayable: parseFloat(tempfinalAmount).toFixed(3),
          });
        } else {
          if (response.data.csverror === 1) {
            console.log("csverror");
            if (response.data.hasOwnProperty("url")) {
              // console.log("found url", response.data.url);
              let downloadUrl = response.data.url;
              // window.open(downloadUrl);
              setCsvData(downloadUrl);
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
          api: "api/jewellerypurchase/createfromexcel",
          body: JSON.stringify(formData),
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
      });
    } else if (name === "firmName") {
      setFirmName(value);
      setFirmNameErr("");
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
    }
    else if (name === "tdsTcsVou") {
      setTdsTcsVou(value);
      setTdsTcsVouErr("");
    } else if (name === "jewelNarration") {
      setJewelNarration(value);
      setJewelNarrationErr("");
      setPrintObj({
        ...printObj,
        jewelNarration: value,
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
    } else if (name === "accNarration") {
      setAccNarration(value);
      setAccNarrationErr("");
      setPrintObj({
        ...printObj,
        accNarration: value,
      });
    } else if (name === "roundOff") {
      setRoundOff(value);
      setLegderAmount("");
      setLedgerName("");
      setRateValue("")
      setTdsTcsVou('')
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
        tempLedgerAmount = parseFloat(
          (tempTotalInvoiceAmt * rateValue) / 100
        ).toFixed(3); //with gst on total invoice amount
        // console.log(tempLedgerAmount);
        //if tcs then enter amount manually
        // tempLedgerAmount = ledgerAmount;
        tempfinalAmount = parseFloat(
          parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)
        ).toFixed(3);
      } else if (is_tds_tcs == 2) {
        //tds
        tempLedgerAmount = parseFloat(
          (parseFloat(totalAmount) * rateValue) / 100
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
        totalInvoiceAmt: tempTotalInvoiceAmt,
        taxAmount: tempLedgerAmount,
        balancePayable: parseFloat(tempfinalAmount).toFixed(3),
      });
    }
  }

  function bomTypeValidation() {
    if (bomType === "") {
      setBomTypeErr("Please Select Bom Type");
      return false;
    }
    return true;
  }

  function uploadTypeValidation() {
    if (uploadType === "") {
      setUploadTypeErr("Please Select Upload Type");
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
  function checkAmount() {
    console.log(typeof (finalAmount), "type")
    if (ledgerAmtErr || finalAmount === "" || finalAmount == 0 || finalAmount == "NaN") {
      console.log(typeof (finalAmount), "type")
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

  function loadTypeValidation() {
    if (selectedLoad === "") {
      setSelectedLoadErr("Select Load Type");
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

  const isEnabled =
    selectedLoad !== "" &&
    oppositeAccSelected !== "" &&
    voucherNumber !== "" &&
    selectedVendorClient !== "" &&
    partyVoucherNum !== "";

  function handleFormSubmit(ev) {
    ev.preventDefault();

    // console.log("handleFormSubmit", formValues);
    if (
      voucherNumValidation() &&
      loadTypeValidation() &&
      partyNameValidation() &&
      oppositeAcValidation() &&
      partyVoucherNumValidation() &&
      partyVoucherDateValidation() &&
      ledgerNameValidate() &&
      checkAmount()
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (selectedLoad === "0") {
        console.log("if1");
        //check prev valid
        if (prevIsValid()) {
          console.log("if2");
          addUserInputApi(true, false);
        }
      } else {
        if (uploadTypeValidation() && bomTypeValidation()) {
          console.log("if3");

          if (isUploaded) {
            console.log("if4");

            addJewellaryPuchaseApi(true, false);
          } else {
            console.log("if5");
            setUploadErr("Please Upload File");
          }
        }
      }
    } else {
      console.log("else");
    }
  }

  function addUserInputApi(resetFlag, toBePrint) {
    if (adjustedRate === false) {
      setSelectedRateFixErr("Please Add remaining rate");
      console.log("if");
      return;
    }

    let Orders = userFormValues
      .filter((element) => element.grossWeight !== "")
      .map((x) => {
        if (parseFloat(x.grossWeight) !== parseFloat(x.netWeight)) {
          return {
            // category_name: x.categoryName,
            stock_name_code_id: x.stockCode.value,
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
            labour_amount: x.labourCharges,
            pcs_or_gram: x.unitOfPurchase,
            Wastage_percentage: x.wastagePer,
          };
        } else {
          return {
            stock_name_code_id: x.stockCode.value,
            gross_weight: x.grossWeight,
            net_weight: x.netWeight,
            labour_amount: x.labourCharges,
            pcs_or_gram: x.unitOfPurchase,
            Wastage_percentage: x.wastagePer,
            ...(x.pieces !== "" && {
              pcs: x.pieces, //user input
            }),
          };
        }
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
      is_vendor_client: selectedVendorClient.value === 1 ? 1 : 2,
      vendor_id:
        selectedVendorClient.value === 1
          ? selectedVendor.value
          : selectedClientFirm.value,
      tds_tcs_ledger_id: is_tds_tcs != 0 ? ledgerName.value : null,
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      ...(rates.length !== 0 && {
        rates: rates,
      }),
      ...(tempRate !== "" && {
        setRate: tempRate,
      }),
      round_off: roundOff === "" ? 0 : roundOff,
      jewellery_narration: jewelNarration,
      account_narration: accNarration,
      Orders: Orders,
      ...(is_tds_tcs == 1 && {
        tcs_rate: ledgerAmount,
      }),
      uploadDocIds: docIds,
      party_voucher_date: partyVoucherDate,
    };
    console.log(body);
    axios
      .post(Config.getCommonUrl() + "api/jewellerypurchase", body)
      .then(function (response) {
        console.log(response);
        setLoading(false);

        if (response.data.success === true) {
          // console.log(response);
          // setIsCsvErr(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.goBack();
          setLoading(false);
          if (resetFlag === true) {
            checkAndReset();
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record
            handlePrint();
          }

          // setPrintObj({
          //   supplierName: "",
          //   supAddress: "",
          //   supplierGstUinNum: "",
          //   supPanNum: "",
          //   supState: "",
          //   supCountry: "",
          //   supStateCode: "",
          //   // purcVoucherNum: "",
          //   partyInvNum: "",
          //   voucherDate: moment().format("YYYY-MM-DD"),
          //   placeOfSupply: "",
          //   orderDetails: [],
          //   taxableAmount: "",
          //   sGstTot: "",
          //   cGstTot: "",
          //   iGstTot: "",
          //   roundOff: "",
          //   pcsTotal: "",
          //   grossWtTOt: "",
          //   netWtTOt: "",
          //   totalInvoiceAmt: "",
          //   stateId: "",
          //   is_tds_tcs: "",
          //   TDSTCSVoucherNum: "",
          //   ledgerName: "",
          //   taxAmount: "",
          //   jewelNarration: "",
          //   accNarration: "",
          //   balancePayable: ""
          // })
          // resetEveryThing();
          // setTempRate("");
          // setNewRate("");
          // getVoucherNumber();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);

        handleError(error, dispatch, {
          api: "api/jewellerypurchase",
          body: body,
        });
      });
  }

  function addJewellaryPuchaseApi(resetFlag, toBePrint) {
    console.log("fineGoldTotal", fineGoldTotal);
    // if (fineGoldTotal > tempApiWeight) {
    //   setSelectedRateFixErr("Please Add remaining rate");
    //   // dispatch(Actions.showMessage({message: "Please Add remaining rate" }));
    //   console.log("if");
    //   return;
    // }
    if (adjustedRate === false) {
      setSelectedRateFixErr("Please Add remaining rate");
      // dispatch(Actions.showMessage({message: "Please Add remaining rate" }));
      console.log("if");
      return;
    }
    let rates = balRfixViewData
      .filter((element) => parseFloat(element.usedWeight) > 0)
      .map((item) => {
        return {
          id: item.id,
          weightToBeUtilized: item.usedWeight,
        };
      });

    const formData = new FormData();
    formData.append("file", fileSelected);
    formData.append("voucher_no", voucherNumber);
    formData.append("party_voucher_no", partyVoucherNum);
    formData.append("opposite_account_id", oppositeAccSelected.value);
    formData.append(
      "department_id",
      window.localStorage.getItem("SelectedDepartment")
    );
    formData.append(
      "vendor_id",
      selectedVendorClient.value === 1
        ? selectedVendor.value
        : selectedClientFirm.value
    );
    formData.append("round_off", roundOff === "" ? 0 : roundOff);
    formData.append("jewellery_narration", jewelNarration);
    formData.append("account_narration", accNarration);
    formData.append(
      "tds_tcs_ledger_id",
      is_tds_tcs != 0 ? ledgerName.value : null
    );
    formData.append(
      "is_vendor_client",
      selectedVendorClient.value === 1 ? 1 : 2
    );

    if (tempRate !== "") {
      formData.append("setRate", tempRate);
    }

    let temp = JSON.stringify(rates);
    if (rates.length > 0) {
      formData.append("rates", temp);
    }
    if (allowedBackDate) {
      formData.append("purchaseCreateDate", voucherDate);
    }

    // for(let i=0; i<=docIds.length; i++) {
    formData.append("uploadDocIds", JSON.stringify(docIds));
    // }
    formData.append("party_voucher_date", partyVoucherDate)
    if (selectedLoad === "1") {
      if (uploadType === "0") {
        formData.append("is_packingSlip", 1);
        formData.append("is_barcoded", 1);
        formData.append("is_packetNo", 1);
      } else if (uploadType === "1") {
        formData.append("is_barcoded", 1);
        formData.append("is_packetNo", 1);
      } else if (uploadType === "2") {
        formData.append("is_barcoded", 1);
      }
      formData.append("with_bom", bomType);
      // <option value="0">Upload Packing Slip Wise </option>
      // <option value="1">Upload Packet Wise </option>
      // <option value="2">Upload Barcode Wise </option>
    }

    if (is_tds_tcs == 1) {
      formData.append("tcs_rate", ledgerAmount);
    }
    console.log(...formData);
    setLoading(true);

    axios
      .post(
        Config.getCommonUrl() + "api/jewellerypurchase/createfromexcel?save=1",
        formData
      )
      .then(function (response) {
        console.log(response);
        setLoading(false);

        if (response.data.success === true) {
          console.log(response);
          // setIsCsvErr(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.goBack();
          setLoading(false);
          if (resetFlag === true) {
            checkAndReset();
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record
            handlePrint();
          }

          // resetEveryThing();
          // getVoucherNumber();
          // setPrintObj({
          //   supplierName: "",
          //   supAddress: "",
          //   supplierGstUinNum: "",
          //   supPanNum: "",
          //   supState: "",
          //   supCountry: "",
          //   supStateCode: "",
          //   // purcVoucherNum: "",
          //   partyInvNum: "",
          //   voucherDate: moment().format("YYYY-MM-DD"),
          //   placeOfSupply: "",
          //   orderDetails: [],
          //   taxableAmount: "",
          //   sGstTot: "",
          //   cGstTot: "",
          //   iGstTot: "",
          //   roundOff: "",
          //   pcsTotal: "",
          //   grossWtTOt: "",
          //   netWtTOt: "",
          //   totalInvoiceAmt: "",
          //   stateId: "",
          //   is_tds_tcs: "",
          //   TDSTCSVoucherNum: "",
          //   ledgerName: "",
          //   taxAmount: "",
          //   jewelNarration: "",
          //   accNarration: "",
          //   balancePayable: ""
          // })
        } else {
          if (response.data.hasOwnProperty("csverror")) {
            if (response.data.csverror === 1) {
              // console.log("csverror");
              if (response.data.hasOwnProperty("url")) {
                // console.log("found url", response.data.url);
                let downloadUrl = response.data.url;
                // window.open(downloadUrl);
                setCsvData(downloadUrl);
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

        document.getElementById("fileinput").value = "";
        handleError(error, dispatch, {
          api: "api/jewellerypurchase/createfromexcel?save=1",
          body: JSON.stringify(formData),
        });
      });
  }

  // function resetEveryThing() {
  //   setSelectedLoad("");
  //   setUploadType("");
  //   reset();
  // }

  function reset() {
    // console.log("reset called")
    setVoucherDate(moment().format("YYYY-MM-DD"));
    setOppositeAccSelected("");
    if (document.getElementById("fileinput") !== null) {
      document.getElementById("fileinput").value = "";
    }
    setUploadErr("");
    setNewRate("");
    setSelectedVendor("");
    setFirmName("");
    setSubTotal("");
    setTotalGST("");
    setCsvData([]);
    setIsCsvErr(false);
    setSelectedIndex(0);
    // setSelectedWeightStock("");
    // setPieces("");
    // setWeight("");
    setSelectedRateFixErr("");
    setPartyVoucherNum("");
    setRoundOff("");
    setTotalInvoiceAmount("");
    setTdsTcsVou("");
    setLedgerName("");
    setRateValue("");
    setLegderAmount(0);
    setFinalAmount("");
    setAccNarration("");
    setJewelNarration("");
    setAdjustedRate(false);
    setVendorStateId("");
    setBalanceRfixData("");
    setBalRfixViewData([]);
    // setCanEnterVal(false);
    setShortageRfix("");
    setTempRate("");
    setAvgeRate("");
    setTempApiWeight("");
    setTotalGrossWeight("");
    setPiecesTot("");
    setTotalNetWeight("");
    setFineGoldTotal("");
    setFineTotal("");
    // setTagAmountAftTot("");
    // setTagAmountBefTot("");
    // setAmount("");

    setTotalAmount("");
    setIgstVal("");
    setTotal("");
    setFileSelected("");
    setIsuploaded(false);

    setProductData([]); //category wise Data
    setTagWiseData([]); //tag wise Data
    setPackingSlipData([]);
    setPacketData([]);
    setPrintObj({
      supplierName: "",
      supAddress: "",
      supplierGstUinNum: "",
      supPanNum: "",
      supState: "",
      supCountry: "",
      supStateCode: "",
      purcVoucherNum: voucherNumber,
      partyInvNum: "",
      voucherDate: moment().format("DD-MM-YYYY"),
      placeOfSupply: "",
      orderDetails: [],
      taxableAmount: "",
      sGstTot: "",
      cGstTot: "",
      iGstTot: "",
      roundOff: "",
      pcsTotal: "",
      grossWtTOt: "",
      netWtTOt: "",
      totalInvoiceAmt: "",
      stateId: "",
      is_tds_tcs: "",
      TDSTCSVoucherNum: "",
      ledgerName: "",
      taxAmount: "",
      jewelNarration: "",
      accNarration: "",
      balancePayable: "",
    });

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
        fine: "",
        labourCharges: "",
        unitOfPurchase: "",
        rate: "",
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
          fine: null,
          labourCharges: null,
          unitOfPurchase: null,
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
        fine: "",
        labourCharges: "",
        unitOfPurchase: "",
        rate: "",
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
          fine: null,
          labourCharges: null,
          unitOfPurchase: null,
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
        fine: "",
        labourCharges: "",
        unitOfPurchase: "",
        rate: "",
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
          fine: null,
          labourCharges: null,
          unitOfPurchase: null,
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
        fine: "",
        labourCharges: "",
        unitOfPurchase: "",
        rate: "",
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
          fine: null,
          labourCharges: null,
          unitOfPurchase: null,
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
    ]);
  }

  function handleLoadChange(event) {
    setSelectedLoad(event.target.value);
    setSelectedLoadErr("");

    //reset every thing here
    setUploadType("");
    reset();
  }

  function handleUploadtype(event) {
    setUploadType(event.target.value);
    setUploadTypeErr("");
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
    setTotalInvoiceAmount(0);
    // setFineGoldTotal("");
    // setTdsTcsVou("");
    setSubTotal("");
    setTotalGST("");
    // setTdsTcsVouErr("");
    setLedgerName("");
    setRateValue("");
    setLegderAmount(0);
    setFinalAmount("");
    // setTempApiWeight("");
    // setTotalGrossWeight("");
    // setPiecesTot("")
    // setTotalNetWeight("")
    // setTagAmountAftTot("");
    // setTagAmountBefTot("");

    setTotalAmount("");
    setCgstVal("");
    setSgstVal("");
    setIgstVal("");
    setTotal("");

    setNewRate("");
    setTempRate("");
    setAvgeRate("");

    setProductData([]); //category wise Data
    setTagWiseData([]); //tag wise Data
    setPackingSlipData([]);
    setPacketData([]);
    let newFormValues = userFormValues.map((x) => {
      return {
        ...x,
        labourCharges: "",
        rate: "",
        totalAmount: 0,
        cgstVal: "",
        sGstVal: "",
        IGSTVal: "",
        total: "",
      };
    });

    setUserFormValues(newFormValues);

    // setUserFormValues([
    //   {
    //     stockCode: "",
    //     stockName: "",
    //     HSNNum: "",
    //     billingCategory: "",
    //     purity: "",
    //     color: "",
    //     pieces: "",
    //     grossWeight: "",
    //     netWeight: "",
    //     isWeightDiff: "",
    //     DiffrentStock: [
    //       {
    //         setStockCodeId: "",
    //         setPcs: "",
    //         setWeight: "",
    //         errors: {
    //           setStockCodeId: null,
    //           setPcs: null,
    //           setWeight: null,
    //         },
    //       },
    //     ],
    //     wastagePer: "",
    //     fine: "",
    //     labourCharges: "",
    //     unitOfPurchase: "",
    //     rate: "",
    //     totalAmount: "",
    //     cgstPer: "",
    //     cgstVal: "",
    //     sGstPer: "",
    //     sGstVal: "",
    //     IGSTper: "",
    //     IGSTVal: "",
    //     total: "",
    //     errors: {
    //       stockCode: null,
    //       stockName: null,
    //       HSNNum: null,
    //       billingCategory: null,
    //       purity: null,
    //       color: null,
    //       pieces: null,
    //       grossWeight: null,
    //       netWeight: null,
    //       wastagePer: null,
    //       fine: null,
    //       labourCharges: null,
    //       unitOfPurchase: null,
    //       rate: null,
    //       totalAmount: null,
    //       cgstPer: null,
    //       cgstVal: null,
    //       sGstPer: null,
    //       sGstVal: null,
    //       IGSTper: null,
    //       IGSTVal: null,
    //       total: null,
    //     },
    //   },
    //   {
    //     stockCode: "",
    //     stockName: "",
    //     HSNNum: "",
    //     billingCategory: "",
    //     purity: "",
    //     color: "",
    //     pieces: "",
    //     grossWeight: "",
    //     netWeight: "",
    //     isWeightDiff: "",
    //     DiffrentStock: [
    //       {
    //         setStockCodeId: "",
    //         setPcs: "",
    //         setWeight: "",
    //         errors: {
    //           setStockCodeId: null,
    //           setPcs: null,
    //           setWeight: null,
    //         },
    //       },
    //     ],
    //     wastagePer: "",
    //     fine: "",
    //     labourCharges: "",
    //     unitOfPurchase: "",
    //     rate: "",
    //     totalAmount: "",
    //     cgstPer: "",
    //     cgstVal: "",
    //     sGstPer: "",
    //     sGstVal: "",
    //     IGSTper: "",
    //     IGSTVal: "",
    //     total: "",
    //     errors: {
    //       stockCode: null,
    //       stockName: null,
    //       HSNNum: null,
    //       billingCategory: null,
    //       purity: null,
    //       color: null,
    //       pieces: null,
    //       grossWeight: null,
    //       netWeight: null,
    //       wastagePer: null,
    //       fine: null,
    //       labourCharges: null,
    //       unitOfPurchase: null,
    //       rate: null,
    //       totalAmount: null,
    //       cgstPer: null,
    //       cgstVal: null,
    //       sGstPer: null,
    //       sGstVal: null,
    //       IGSTper: null,
    //       IGSTVal: null,
    //       total: null,
    //     },
    //   },
    //   {
    //     stockCode: "",
    //     stockName: "",
    //     HSNNum: "",
    //     billingCategory: "",
    //     purity: "",
    //     color: "",
    //     pieces: "",
    //     grossWeight: "",
    //     netWeight: "",
    //     isWeightDiff: "",
    //     DiffrentStock: [
    //       {
    //         setStockCodeId: "",
    //         setPcs: "",
    //         setWeight: "",
    //         errors: {
    //           setStockCodeId: null,
    //           setPcs: null,
    //           setWeight: null,
    //         },
    //       },
    //     ],
    //     wastagePer: "",
    //     fine: "",
    //     labourCharges: "",
    //     unitOfPurchase: "",
    //     rate: "",
    //     totalAmount: "",
    //     cgstPer: "",
    //     cgstVal: "",
    //     sGstPer: "",
    //     sGstVal: "",
    //     IGSTper: "",
    //     IGSTVal: "",
    //     total: "",
    //     errors: {
    //       stockCode: null,
    //       stockName: null,
    //       HSNNum: null,
    //       billingCategory: null,
    //       purity: null,
    //       color: null,
    //       pieces: null,
    //       grossWeight: null,
    //       netWeight: null,
    //       wastagePer: null,
    //       fine: null,
    //       labourCharges: null,
    //       unitOfPurchase: null,
    //       rate: null,
    //       totalAmount: null,
    //       cgstPer: null,
    //       cgstVal: null,
    //       sGstPer: null,
    //       sGstVal: null,
    //       IGSTper: null,
    //       IGSTVal: null,
    //       total: null,
    //     },
    //   },
    //   {
    //     stockCode: "",
    //     stockName: "",
    //     HSNNum: "",
    //     billingCategory: "",
    //     purity: "",
    //     color: "",
    //     pieces: "",
    //     grossWeight: "",
    //     netWeight: "",
    //     isWeightDiff: "",
    //     DiffrentStock: [
    //       {
    //         setStockCodeId: "",
    //         setPcs: "",
    //         setWeight: "",
    //         errors: {
    //           setStockCodeId: null,
    //           setPcs: null,
    //           setWeight: null,
    //         },
    //       },
    //     ],
    //     wastagePer: "",
    //     fine: "",
    //     labourCharges: "",
    //     unitOfPurchase: "",
    //     rate: "",
    //     totalAmount: "",
    //     cgstPer: "",
    //     cgstVal: "",
    //     sGstPer: "",
    //     sGstVal: "",
    //     IGSTper: "",
    //     IGSTVal: "",
    //     total: "",
    //     errors: {
    //       stockCode: null,
    //       stockName: null,
    //       HSNNum: null,
    //       billingCategory: null,
    //       purity: null,
    //       color: null,
    //       pieces: null,
    //       grossWeight: null,
    //       netWeight: null,
    //       wastagePer: null,
    //       fine: null,
    //       labourCharges: null,
    //       unitOfPurchase: null,
    //       rate: null,
    //       totalAmount: null,
    //       cgstPer: null,
    //       cgstVal: null,
    //       sGstPer: null,
    //       sGstVal: null,
    //       IGSTper: null,
    //       IGSTVal: null,
    //       total: null,
    //     },
    //   },
    // ]);
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
    if (loadTypeValidation()) {
      // console.log("validate ----")
      reset();
      setTotalInvoiceAmount(0);
      setSelectedVendor(value);
      setSelectedVendorErr("");
      setAdjustedRate(false);
      // resetFormOnly();
      setLedgerName("");
      setLedgerNmErr("");
      setLedgerData([]);
      setRateValue("");
      setRateValErr("");
      setLegderAmount(0);
      setLedgerAmtErr("");
      setFinalAmount("");
      setTdsTcsVou("");

      const index = vendorData.findIndex(
        (element) => element.id === value.value
      );
      console.log(index);

      if (index > -1) {
        setFirmName(vendorData[index].firm_name);
        setFirmNameErr("");
        setVendorStateId(vendorData[index].state_name.id);
        setAddress(vendorData[index].address);
        setSupplierGstUinNum(vendorData[index].gst_number);
        setIs_tds_tcs(vendorData[index].is_tds_tcs);
        setSupPanNum(vendorData[index].pan_number);
        setSupState(vendorData[index].state_name.name);
        setSupCountry(vendorData[index].country_name.name);
        setSupStateCode(vendorData[index].gst_number);
        console.log(vendorData[index].is_tds_tcs);

        setPrintObj({
          ...printObj,
          supplierName: vendorData[index].firm_name,
          supAddress: vendorData[index].address,
          supplierGstUinNum: vendorData[index].gst_number,
          supPanNum: vendorData[index].pan_number,
          supState: vendorData[index].state_name.name,
          supCountry: vendorData[index].country_name.name,
          supStateCode: vendorData[index].gst_number
            ? vendorData[index].gst_number.substring(0, 2)
            : "",
          voucherDate: moment().format("DD-MM-YYYY"),
          placeOfSupply: vendorData[index].state_name.name,
        });
        if (vendorData[index].is_tds_tcs != 0) {
          getLedger(vendorData[index].is_tds_tcs);
        } else {
          setTdsTcsVou("");
          setLedgerName("");
          setLedgerData([]);
          setRateValue("");
          setPrintObj({
            ...printObj,
            supplierName: vendorData[index].firm_name,
            supAddress: vendorData[index].address,
            supplierGstUinNum: vendorData[index].gst_number,
            supPanNum: vendorData[index].pan_number,
            supState: vendorData[index].state_name.name,
            supCountry: vendorData[index].country_name.name,
            supStateCode: vendorData[index].gst_number
              ? vendorData[index].gst_number.substring(0, 2)
              : "",
            voucherDate: moment().format("DD-MM-YYYY"),
            placeOfSupply: vendorData[index].state_name.name,
            orderDetails: [],
            taxableAmount: "",
            sGstTot: "",
            cGstTot: "",
            iGstTot: "",
            roundOff: "",
            pcsTotal: "",
            grossWtTOt: "",
            netWtTOt: "",
            totalInvoiceAmt: "",
            stateId: vendorData[index].state_name.id,
            is_tds_tcs: vendorData[index].is_tds_tcs,
            TDSTCSVoucherNum: "",
            ledgerName: "",
            taxAmount: "",
            jewelNarration: "",
            accNarration: "",
            balancePayable: "",
          });
          setTdsTcsVou("");
          setLedgerName("");
          setRateValue("");
        }
        setLegderAmount(0); //everything is goinf to reset so 0
        if (selectedLoad === "0") {
          //if 1 then no need to call api, wastage % will come from api
          getVendorRateProfile(value.value);
        }
      }
      getFixedRateofWeight(value.value);
    }
  }

  // jobworker - 0
  // vendor - 1
  function getVendorRateProfile(vendorID) {
    axios
      .get(
        Config.getCommonUrl() +
        `api/jobWorkerRateProfile/readAllRate/1/${vendorID}`
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setRateProfiles(
            response.data.data.JobWorkerRateProfile.jobWorkerRateProfileRates
          );
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/jobWorkerRateProfile/readAllRate/1/${vendorID}`,
        });
      });
  }

  function getClientRateProfile(clientID) {
    axios
      .get(
        Config.getCommonUrl() +
        `api/salesRateProfile/client/rateprofile/${clientID}`
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setRateProfiles(
            response.data.data.SalesRateProfile.SalesRateProfileRates
          );
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/salesRateProfile/client/rateprofile/${clientID}`,
        });
      });
  }

  function getTdsTcsVoucherNum(ledgerMasterId) {
    axios
      .get(
        Config.getCommonUrl() +
        `api/jewellerypurchase/get/voucher/${ledgerMasterId}`
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
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: `api/jewellerypurchase/get/voucher/${ledgerMasterId}`,
        });
      });
  }

  function getFixedRateofWeight(vendorId) {
    axios
      .get(Config.getCommonUrl() + "api/ratefix/vendor/balance/1/" + vendorId)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setBalanceRfixData(response.data.data);
          setTempApiWeight(response.data.data.totalWeight);
          // setData(response.data);
        } else {
          setBalanceRfixData([]);
          setTempApiWeight("");
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/ratefix/vendor/balance/1/" + vendorId,
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
          // setData(response.data);
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

  function handleRateFixChange() {
    // setRateFixSelected(value);
    setSelectedRateFixErr("");

    //prev valid check
    if (loadTypeValidation() && partyNameValidation()) {
      setRfModalOpen(true);

      if (adjustedRate === false) {
        if (selectedLoad === "1") {
          setFileRfixData(fineGoldTotal);
        } else {
          //without file
          setFileRfixData(fineGoldTotal);
        }
      } else {
        displayChangedRate();
      }
    }
  }

  function handleRfModalClose() {
    // console.log("handle close", callApi);
    setRfModalOpen(false);
  }

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

  // function shortageRfixValidation() {
  //   // const Regex = /^[0-9]{1, 11}(?:\.[0-9]{1, 3})?$/; // || Regex.test(shortageRfix) === false
  //   if (shortageRfix === "") {
  //     setShortageRfixErr("Enter Valid Rate Fix");
  //     return false;
  //   }
  //   return true;
  // }

  // function tempRateValidation() {
  //   const Regex = /^[0-9]{1, 11}(?:\.[0-9]{1, 3})?$/;
  //   if (!tempRate || Regex.test(tempRate) === false) {
  //     setTempRateErr("Enter Valid Rate");
  //     return false;
  //   }
  //   return true;
  // }

  // function avgRateValidation() {
  //   const Regex = /^[0-9]{1, 11}(?:\.[0-9]{1, 3})?$/;
  //   if (!avgRate || Regex.test(avgRate) === false) {
  //     setAvgeRateErr("Enter Valid Average Rate");
  //     return false;
  //   }
  //   return true;
  // }

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

    // if (canEnterVal === true) {
    // if (
    //   shortageRfixValidation() &&
    //   tempRateValidation() &&
    //   avgRateValidation()
    // ) {
    // console.log("valid");
    if (isUploaded === true) {
      // fileSelected //file weight is greater than api weight then fix rate from user then upload file
      // if(ledgerNameValidate()){
      uploadfileapicall(fileSelected);
      // }
    } else {
      calculateAfterRate();
    }
    setRfModalOpen(false);
    setAdjustedRate(true);
    // } else {
    //   console.log("invalid");
    // }
  };

  function calculateAfterRate() {
    userFormValues
      .filter((element) => element.stockCode !== "")
      .map((item, i) => {
        let newFormValues = [...userFormValues];
        // console.log("newFormValues", newFormValues.length)
        console.log(i);
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
            if (newFormValues[i].wastagePer !== "") {
              newFormValues[i].fine = parseFloat(
                (parseFloat(newFormValues[i].netWeight) *
                  parseFloat(newFormValues[i].purity)) /
                100 +
                (parseFloat(newFormValues[i].netWeight) *
                  parseFloat(newFormValues[i].wastagePer)) /
                100
              ).toFixed(3);
            } else {
              newFormValues[i].fine = parseFloat(
                (parseFloat(newFormValues[i].netWeight) *
                  parseFloat(newFormValues[i].purity)) /
                100
              ).toFixed(3);
            }
          }

          // if (nm === "netWeight") {
          function setWeight(row) {
            return parseFloat(row.setWeight);
          }

          let tempSetWeight = newFormValues[i].DiffrentStock.filter(
            (data) => data.setWeight !== ""
          )
            .map(setWeight)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          // console.log("grossWeight", newFormValues[i].grossWeight);
          // console.log("netWeight", newFormValues[i].netWeight);
          // console.log("tempSetWeight", tempSetWeight);

          if (
            parseFloat(newFormValues[i].grossWeight) !==
            parseFloat(newFormValues[i].netWeight) + parseFloat(tempSetWeight)
          ) {
            newFormValues[i].isWeightDiff = 0;
          } else {
            newFormValues[i].isWeightDiff = 1;
          }
          // if (
          //   parseFloat(newFormValues[i].grossWeight) ===
          //   parseFloat(newFormValues[i].netWeight)
          // ) {
          //   newFormValues[i].isWeightDiff = 1;
          // } else {
          //   newFormValues[i].isWeightDiff = 0;
          // }
          // newFormValues[i].errors.netWeight = "";
          // }

          if (newRate !== "") {
            newFormValues[i].rate = parseFloat(newRate).toFixed(3);
          }

          if (newFormValues[i].rate !== "" && newFormValues[i].fine !== "") {
            newFormValues[i].totalAmount = parseFloat(
              (parseFloat(newFormValues[i].rate) *
                parseFloat(newFormValues[i].fine)) /
              10
            ).toFixed(3);
          }

          // <option value="1">Gram </option>
          // <option value="2">Pieces </option>
          if (
            newFormValues[i].labourCharges !== "" &&
            newFormValues[i].unitOfPurchase !== ""
          ) {
            if (newFormValues[i].unitOfPurchase === "1") {
              newFormValues[i].totalAmount = parseFloat(
                parseFloat(newFormValues[i].totalAmount) +
                parseFloat(newFormValues[i].labourCharges) *
                parseFloat(newFormValues[i].netWeight)
              ).toFixed(3);
            } else if (newFormValues[i].unitOfPurchase === "2") {
              newFormValues[i].totalAmount = parseFloat(
                parseFloat(newFormValues[i].totalAmount) +
                parseFloat(newFormValues[i].labourCharges) *
                parseFloat(newFormValues[i].pieces)
              ).toFixed(3);
            }
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
                  parseFloat(newFormValues[i].cgstPer)) /
                100
              ).toFixed(3);

              newFormValues[i].sGstVal = parseFloat(
                (parseFloat(newFormValues[i].totalAmount) *
                  parseFloat(newFormValues[i].sGstPer)) /
                100
              ).toFixed(3);
              newFormValues[i].total = parseFloat(
                parseFloat(newFormValues[i].totalAmount) +
                parseFloat(newFormValues[i].sGstVal) +
                parseFloat(newFormValues[i].cgstVal)
              ).toFixed(3);
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
                  parseFloat(newFormValues[i].IGSTper)) /
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

          function grossWeight(item) {
            // console.log(parseFloat(item.grossWeight));
            return parseFloat(item.grossWeight);
          }

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
            return parseFloat(item.netWeight);
          }

          let tempNetWtTot = parseFloat(
            newFormValues
              .filter((data) => data.netWeight !== "")
              .map(netWeight)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0)
          ).toFixed(3);

          setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

          function getPcs(item) {
            return parseFloat(item.pieces);
          }

          let tempPcsTot = parseFloat(
            newFormValues
              .filter((data) => data.pieces !== "")
              .map(getPcs)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0)
          );

          setPiecesTot(tempPcsTot);

          function fineGold(item) {
            return parseFloat(item.fine);
          }

          let tempFineGold = newFormValues
            .filter((item) => item.fine !== "")
            .map(fineGold)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

          function fine(item) {
            return parseFloat(item.fine);
          }

          let tempFineTot = newFormValues
            .filter((item) => item.fine !== "")
            .map(fine)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setFineTotal(parseFloat(tempFineTot).toFixed(3));

          function totalAmount(item) {
            return item.totalAmount;
          }

          let tempTotAmount = newFormValues
            .filter((item) => item.totalAmount !== "")
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

            tempCGstVal = newFormValues
              .filter((item) => item.cgstVal !== "")
              .map(CGSTVal)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);

            setCgstVal(parseFloat(tempCGstVal).toFixed(3));

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
              parseFloat(
                parseFloat(tempCGstVal) + parseFloat(tempSgstVal)
              ).toFixed(3)
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

          if (is_tds_tcs == 1) {
            //1 is tcs, 2 means tds
            tempLedgerAmount = parseFloat(
              (tempTotalInvoiceAmt * rateValue) / 100
            ).toFixed(3); //with gst on total invoice amount
            // console.log(tempLedgerAmount);
            //if tcs then enter amount manually
            // tempLedgerAmount = 0;
            tempfinalAmount = parseFloat(
              parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)
            ).toFixed(3);
          } else if (is_tds_tcs == 2) {
            //tds
            tempLedgerAmount = parseFloat(
              (parseFloat(tempTotAmount) * rateValue) / 100
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
            stateId: vendorStateId,
            orderDetails: newFormValues,
            is_tds_tcs: is_tds_tcs,
            taxableAmount: parseFloat(tempTotAmount).toFixed(3),
            sGstTot: parseFloat(tempSgstVal).toFixed(3),
            cGstTot: parseFloat(tempCGstVal).toFixed(3),
            iGstTot: parseFloat(tempIgstVal).toFixed(3),
            roundOff: roundOff,
            grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
            netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
            pcsTotal: tempPcsTot,
            totalInvoiceAmt: tempTotalInvoiceAmt,
            taxAmount: tempLedgerAmount,
            balancePayable: parseFloat(tempfinalAmount).toFixed(3),
            TDSTCSVoucherNum: tdsTcsVou,
            ledgerName: ledgerName.label,
          });

          setUserFormValues(newFormValues);
        }
        return true;
      });
  }

  function displayChangedRate() {
    if (balRfixViewData !== "") {
      console.log(balRfixViewData);
      function sum(prev, next) {
        return prev + next;
      }

      function usedTotWeight(item) {
        return parseFloat(item.usedWeight);
      }
      setAvgeRateErr("");

      // let FinalWeight = 0;//user input total weight
      let FinalWeight = fineGoldTotal;

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
        if (fineGoldTotal != 0 && finalRate != 0 && fineGoldTotal !== "NaN" && finalRate !== "NaN") {

          setAvgeRate(parseFloat(finalRate / fineGoldTotal).toFixed(3));
          setNewRate(parseFloat(finalRate / fineGoldTotal).toFixed(3));
        } else {
          setAvgeRate(0)
          setNewRate(0)
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

  let handleStockGroupChange = (i, e) => {
    console.log(e);
    let newFormValues = [...userFormValues];
    newFormValues[i].stockCode = {
      value: e.value,
      label: e.label,
      pcs_require: e.pcs_require,
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
      // newFormValues[i].valuation = "";
      // newFormValues[i].lotno = "";

      newFormValues[i].color =
        stockCodeData[findIndex].stock_name_code.gold_color.name;
      newFormValues[i].purity = stockCodeData[findIndex].stock_name_code.purity;
      newFormValues[i].HSNNum = stockCodeData[findIndex].hsn_master.hsn_number;
      newFormValues[i].stockName = stockCodeData[findIndex].stock_name;
      newFormValues[i].billingCategory = stockCodeData[findIndex].billing_name;
      newFormValues[i].errors.billingCategory = null;

      // if (vendorStateId === 12) {
      newFormValues[i].cgstPer =
        parseFloat(stockCodeData[findIndex].hsn_master.gst) / 2;
      newFormValues[i].sGstPer =
        parseFloat(stockCodeData[findIndex].hsn_master.gst) / 2;
      // } else {
      newFormValues[i].IGSTper = parseFloat(
        stockCodeData[findIndex].hsn_master.gst
      );
      // }
    }

    let wastageIndex = rateProfiles.findIndex(
      (item) => item.stock_name_code_id === e.value
    );
    console.log("wastageIndex", wastageIndex);
    if (wastageIndex > -1) {
      newFormValues[i].wastagePer = parseFloat(
        rateProfiles[wastageIndex].wastage_per
      ).toFixed(3);
      newFormValues[i].errors.wastagePer = "";
    } else {
      newFormValues[i].errors.wastagePer =
        "Wastage is not added in rate profile";
    }
    // console.log("wastageIndex",wastageIndex)
    // console.log("i", i, "length", userFormValues.length);
    if (i === userFormValues.length - 1) {
      // addFormFields();
      changeTotal(newFormValues, true);
    } else {
      changeTotal(newFormValues, false);
    }

    pcsInputRef.current[i].focus();
  };

  function changeTotal(newFormValues, addFlag) {
    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.grossWeight);
    }

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
      return parseFloat(item.netWeight);
    }

    let tempNetWtTot = parseFloat(
      newFormValues
        .filter((data) => data.netWeight !== "")
        .map(netWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

    function getPcs(item) {
      return parseFloat(item.pieces);
    }

    let tempPcsTot = parseFloat(
      newFormValues
        .filter((data) => data.pieces !== "")
        .map(getPcs)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    );

    setPiecesTot(tempPcsTot);

    function fineGold(item) {
      return parseFloat(item.fine);
    }

    let tempFineGold = newFormValues
      .filter((item) => item.fine !== "")
      .map(fineGold)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

    function fine(item) {
      return parseFloat(item.fine);
    }

    let tempFineTot = newFormValues
      .filter((item) => item.fine !== "")
      .map(fine)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setFineTotal(parseFloat(tempFineTot).toFixed(3));

    function totalAmount(item) {
      return item.totalAmount;
    }

    let tempTotAmount = newFormValues
      .filter((item) => item.totalAmount !== "")
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

      tempCGstVal = newFormValues
        .filter((item) => item.cgstVal !== "")
        .map(CGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);

      setCgstVal(parseFloat(tempCGstVal).toFixed(3));

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

      setTotalGST(
        parseFloat(parseFloat(tempCGstVal) + parseFloat(tempSgstVal)).toFixed(3)
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

    if (is_tds_tcs == 1) {
      //1 is tcs, 2 means tds
      tempLedgerAmount = parseFloat(
        (tempTotalInvoiceAmt * rateValue) / 100
      ).toFixed(3); //with gst on total invoice amount
      // console.log(tempLedgerAmount);
      //if tcs then enter amount manually
      // tempLedgerAmount = 0;
      tempfinalAmount = parseFloat(
        parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)
      ).toFixed(3);
    } else if (is_tds_tcs == 2) {
      //tds
      tempLedgerAmount = parseFloat(
        (parseFloat(tempTotAmount) * rateValue) / 100
      ).toFixed(3); //calculating before gst, on total amount only
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
      stateId: vendorStateId,
      orderDetails: newFormValues,
      is_tds_tcs: is_tds_tcs,
      taxableAmount: parseFloat(tempTotAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCGstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      roundOff: roundOff,
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      pcsTotal: tempPcsTot,
      totalInvoiceAmt: tempTotalInvoiceAmt,
      taxAmount: tempLedgerAmount,
      balancePayable: parseFloat(tempfinalAmount).toFixed(3),
    });

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
          fine: "",
          labourCharges: "",
          unitOfPurchase: "",
          rate: "",
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
            fine: null,
            labourCharges: null,
            unitOfPurchase: null,
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
      ]);
    } else {
      setUserFormValues(newFormValues);
    }
  }

  function handleUnitChange(i, e) {
    // console.log(e);
    let newFormValues = [...userFormValues];
    newFormValues[i].unitOfPurchase = e.target.value;
    newFormValues[i].errors.unitOfPurchase = null;

    if (newFormValues[i].stockCode !== "") {
      if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
        if (newFormValues[i].wastagePer !== "") {
          newFormValues[i].fine = parseFloat(
            (parseFloat(newFormValues[i].netWeight) *
              parseFloat(newFormValues[i].purity)) /
            100 +
            (parseFloat(newFormValues[i].netWeight) *
              parseFloat(newFormValues[i].wastagePer)) /
            100
          ).toFixed(3);
        } else {
          newFormValues[i].fine = parseFloat(
            (parseFloat(newFormValues[i].netWeight) *
              parseFloat(newFormValues[i].purity)) /
            100
          ).toFixed(3);
        }
      }

      function setWeight(row) {
        return parseFloat(row.setWeight);
      }

      let tempSetWeight = newFormValues[i].DiffrentStock.filter(
        (data) => data.setWeight !== ""
      )
        .map(setWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);

      // console.log("grossWeight", newFormValues[i].grossWeight);
      // console.log("netWeight", newFormValues[i].netWeight);
      // console.log("tempSetWeight", tempSetWeight);

      if (
        parseFloat(newFormValues[i].grossWeight) !==
        parseFloat(newFormValues[i].netWeight) + parseFloat(tempSetWeight)
      ) {
        newFormValues[i].isWeightDiff = 0;
      } else {
        newFormValues[i].isWeightDiff = 1;
      }

      if (newRate !== "") {
        newFormValues[i].rate = parseFloat(newRate).toFixed(3);
      }

      if (newFormValues[i].rate !== "" && newFormValues[i].fine !== "") {
        newFormValues[i].totalAmount = parseFloat(
          (parseFloat(newFormValues[i].rate) *
            parseFloat(newFormValues[i].fine)) /
          10
        ).toFixed(3);
      }

      // <option value="1">Gram </option>
      // <option value="2">Pieces </option>
      if (
        newFormValues[i].labourCharges !== "" &&
        newFormValues[i].unitOfPurchase !== ""
      ) {
        if (newFormValues[i].unitOfPurchase === "1") {
          newFormValues[i].totalAmount = parseFloat(
            parseFloat(newFormValues[i].totalAmount) +
            parseFloat(newFormValues[i].labourCharges) *
            parseFloat(newFormValues[i].netWeight)
          ).toFixed(3);
        } else if (newFormValues[i].unitOfPurchase === "2") {
          newFormValues[i].totalAmount = parseFloat(
            parseFloat(newFormValues[i].totalAmount) +
            parseFloat(newFormValues[i].labourCharges) *
            parseFloat(newFormValues[i].pieces)
          ).toFixed(3);
        }
      }

      if (vendorStateId === 12) {
        if (
          newFormValues[i].totalAmount !== "" &&
          newFormValues[i].cgstPer !== ""
        ) {
          newFormValues[i].cgstVal = parseFloat(
            (parseFloat(newFormValues[i].totalAmount) *
              parseFloat(newFormValues[i].cgstPer)) /
            100
          ).toFixed(3);

          newFormValues[i].sGstVal = parseFloat(
            (parseFloat(newFormValues[i].totalAmount) *
              parseFloat(newFormValues[i].sGstPer)) /
            100
          ).toFixed(3);
          newFormValues[i].total = parseFloat(
            parseFloat(newFormValues[i].totalAmount) +
            parseFloat(newFormValues[i].sGstVal) +
            parseFloat(newFormValues[i].cgstVal)
          ).toFixed(3);
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
              parseFloat(newFormValues[i].IGSTper)) /
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

      function grossWeight(item) {
        return parseFloat(item.grossWeight);
      }

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
        return parseFloat(item.netWeight);
      }

      let tempNetWtTot = parseFloat(
        newFormValues
          .filter((data) => data.netWeight !== "")
          .map(netWeight)
          .reduce(function (a, b) {
            // sum all resulting numbers
            return parseFloat(a) + parseFloat(b);
          }, 0)
      ).toFixed(3);

      setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

      function getPcs(item) {
        return parseFloat(item.pieces);
      }

      let tempPcsTot = parseFloat(
        newFormValues
          .filter((data) => data.pieces !== "")
          .map(getPcs)
          .reduce(function (a, b) {
            // sum all resulting numbers
            return parseFloat(a) + parseFloat(b);
          }, 0)
      );

      setPiecesTot(tempPcsTot);

      function fineGold(item) {
        return parseFloat(item.fine);
      }

      let tempFineGold = newFormValues
        .filter((item) => item.fine !== "")
        .map(fineGold)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);

      setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

      function fine(item) {
        return parseFloat(item.fine);
      }

      let tempFineTot = newFormValues
        .filter((item) => item.fine !== "")
        .map(fine)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);

      setFineTotal(parseFloat(tempFineTot).toFixed(3));

      function totalAmount(item) {
        return item.totalAmount;
      }

      let tempTotAmount = newFormValues
        .filter((item) => item.totalAmount !== "")
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

        tempCGstVal = newFormValues
          .filter((item) => item.cgstVal !== "")
          .map(CGSTVal)
          .reduce(function (a, b) {
            // sum all resulting numbers
            return parseFloat(a) + parseFloat(b);
          }, 0);

        setCgstVal(parseFloat(tempCGstVal).toFixed(3));

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

        setTotalGST(
          parseFloat(parseFloat(tempCGstVal) + parseFloat(tempSgstVal)).toFixed(
            3
          )
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

      let tempLedgerAmount = 0;
      let tempfinalAmount = 0;
      let tempTotalInvoiceAmt = 0;
      // let temptdsTcsAmount =0;

      tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);

      setTotalInvoiceAmount(tempTotalInvoiceAmt);

      if (is_tds_tcs == 1) {
        //1 is tcs, 2 means tds
        tempLedgerAmount = parseFloat(
          (tempTotalInvoiceAmt * rateValue) / 100
        ).toFixed(3); //with gst on total invoice amount
        // console.log(tempLedgerAmount);
        //if tcs then enter amount manually
        // tempLedgerAmount = 0;
        tempfinalAmount = parseFloat(
          parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)
        ).toFixed(3);
      } else if (is_tds_tcs == 2) {
        //tds
        tempLedgerAmount = parseFloat(
          (parseFloat(tempTotAmount) * rateValue) / 100
        ).toFixed(3); //calculating before gst, on total amount only
        // console.log(tempLedgerAmount);
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
        stateId: vendorStateId,
        orderDetails: newFormValues,
        is_tds_tcs: is_tds_tcs,
        taxableAmount: parseFloat(tempTotAmount).toFixed(3),
        sGstTot: parseFloat(tempSgstVal).toFixed(3),
        cGstTot: parseFloat(tempCGstVal).toFixed(3),
        iGstTot: parseFloat(tempIgstVal).toFixed(3),
        roundOff: roundOff,
        grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
        netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
        pcsTotal: tempPcsTot,
        totalInvoiceAmt: tempTotalInvoiceAmt,
        taxAmount: tempLedgerAmount,
        balancePayable: parseFloat(tempfinalAmount).toFixed(3),
      });

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
      newFormValues[i].grossWeight = parseFloat(val).toFixed(3);
    }

    if (nm === "labourCharges") {
      newFormValues[i].labourCharges = parseFloat(val).toFixed(3);
    }
    if (nm === "netWeight") {
      newFormValues[i].netWeight = parseFloat(val).toFixed(3);
    }

    setUserFormValues(newFormValues);
  };

  let handleChange = (i, e) => {
    let newFormValues = [...userFormValues];
    newFormValues[i][e.target.name] = e.target.value;
    newFormValues[i].errors[e.target.name] = null;

    let nm = e.target.name;
    let val = e.target.value;

    //if grossWeight or putity change
    if (nm === "grossWeight") {
      setNewRate("");
      setAdjustedRate(false);
      newFormValues[i].errors.grossWeight = "";
      newFormValues[i].errors.netWeight = ""
      if (val == 0) {
        newFormValues[i].errors.grossWeight = "Enter valid Gross Weight";
        newFormValues[i].errors.netWeight = "Enter valid Net Weight"
      }
      if (val === "" || val == 0) {
        newFormValues[i].fine = "";
        newFormValues[i].totalAmount = "";
        // setAmount("");
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

      // rate value will be set on party change so no need to set here and ledger amount is already been set below
      // const index = vendorData.findIndex(
      //   (element) => element.id === value.value
      // );
      // console.log(index);

      // if (index > -1) {
      //   setFirmName(vendorData[index].firm_name);
      //   setVendorStateId(vendorData[index].state_name.id);

      //   setIs_tds_tcs(vendorData[index].is_tds_tcs);
      //   // console.log(vendorData[index].LedgerMaster.LedgerRate)
      //   // console.log(findClosestPrevDate(vendorData[index].LedgerMaster.LedgerRate,moment().format("YYYY-MM-DD")))
      //   let r1 = findClosestPrevDate(
      //     vendorData[index].LedgerMaster.LedgerRate,
      //     moment().format("YYYY-MM-DD")
      //   );
      //   setLedgerName(vendorData[index].LedgerMaster.Ledger.name);
      //   setLedgerNmErr("");

      //   setRateValue(r1.rate);
      //   setRateValErr("");

      //   // setLegderAmount(0); //everything is goinf to reset so 0
      // }

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
      setNewRate("");
      setAdjustedRate(false);
      if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
        if (newFormValues[i].wastagePer !== "") {
          newFormValues[i].fine = parseFloat(
            (parseFloat(newFormValues[i].netWeight) *
              parseFloat(newFormValues[i].purity)) /
            100 +
            (parseFloat(newFormValues[i].netWeight) *
              parseFloat(newFormValues[i].wastagePer)) /
            100
          ).toFixed(3);
        } else {
          newFormValues[i].fine = parseFloat(
            (parseFloat(newFormValues[i].netWeight) *
              parseFloat(newFormValues[i].purity)) /
            100
          ).toFixed(3);
        }
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

    // if (nm === "wastagePer") {
    //   newFormValues[i].errors.wastagePer = null;

    //   if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
    //     if (newFormValues[i].wastagePer !== "") {
    //       newFormValues[i].fine = (
    //         (parseFloat(newFormValues[i].netWeight) *
    //           parseFloat(newFormValues[i].purity)) /
    //           100 +
    //         (parseFloat(newFormValues[i].netWeight) *
    //           parseFloat(newFormValues[i].wastagePer)) /
    //           100
    //       ).toFixed(3);
    //     } else {
    //       newFormValues[i].fine = (
    //         (parseFloat(newFormValues[i].netWeight) *
    //           parseFloat(newFormValues[i].purity)) /
    //         100
    //       ).toFixed(3);
    //     }
    //   }
    // }

    if (newRate !== "") {
      newFormValues[i].rate = parseFloat(newRate).toFixed(3);
    }
    // if (rateFixSelected !== "") {
    //   newFormValues[i].rate = rateFixSelected.label;
    // }
    // console.log("rate", newFormValues[i].rate);

    if (newFormValues[i].rate !== "" && newFormValues[i].fine !== "") {
      newFormValues[i].totalAmount = parseFloat(
        (parseFloat(newFormValues[i].rate) *
          parseFloat(newFormValues[i].fine)) /
        10
      ).toFixed(3);
    }

    // <option value="1">Gram </option>
    // <option value="2">Pieces </option>
    if (
      newFormValues[i].labourCharges !== "" &&
      newFormValues[i].unitOfPurchase !== ""
    ) {
      if (newFormValues[i].unitOfPurchase === "1") {
        newFormValues[i].totalAmount = parseFloat(
          parseFloat(newFormValues[i].totalAmount) +
          parseFloat(newFormValues[i].labourCharges) *
          parseFloat(newFormValues[i].netWeight)
        ).toFixed(3);
      } else if (newFormValues[i].unitOfPurchase === "2") {
        newFormValues[i].totalAmount = parseFloat(
          parseFloat(newFormValues[i].totalAmount) +
          parseFloat(newFormValues[i].labourCharges) *
          parseFloat(newFormValues[i].pieces)
        ).toFixed(3);
      }
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
            parseFloat(newFormValues[i].cgstPer)) /
          100
        ).toFixed(3);

        newFormValues[i].sGstVal = parseFloat(
          (parseFloat(newFormValues[i].totalAmount) *
            parseFloat(newFormValues[i].sGstPer)) /
          100
        ).toFixed(3);
        newFormValues[i].total = parseFloat(
          parseFloat(newFormValues[i].totalAmount) +
          parseFloat(newFormValues[i].sGstVal) +
          parseFloat(newFormValues[i].cgstVal)
        ).toFixed(3);
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
            parseFloat(newFormValues[i].IGSTper)) /
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

    function fine(item) {
      return parseFloat(item.fine);
    }

    let tempFineTot = newFormValues
      .filter((item) => item.fine !== "")
      .map(fine)
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

    // function tempamtFun(item) {
    //   return item.amount;
    // }
    // let tempAmt = newFormValues
    //   .filter((item) => item.amount !== "")
    //   .map(tempamtFun)
    //   .reduce(function (a, b) {
    //     // sum all resulting numbers
    //     return parseFloat(a) + parseFloat(b);
    //   }, 0);
    // setAmount(parseFloat(tempAmt).toFixed(3));

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

    let tempCgstVal = 0;
    let tempSgstVal = 0;
    let tempIgstVal = 0;
    if (vendorStateId === 12) {
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
        (parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
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
      .filter((item) => item.total !== "")
      .map(Total)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotal(parseFloat(tempTotal).toFixed(3));

    function getPcs(item) {
      return parseFloat(item.pieces);
    }

    let tempPcsTot = parseFloat(
      newFormValues
        .filter((data) => data.pieces !== "")
        .map(getPcs)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    );

    setPiecesTot(tempPcsTot);

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
      return parseFloat(item.netWeight);
    }

    let tempNetWtTot = parseFloat(
      newFormValues
        .filter((data) => data.netWeight !== "")
        .map(netWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

    // function fine(item) {
    //   return parseFloat(item.fine);
    // }

    let tempFineGold = newFormValues
      .filter((item) => item.fine !== "")
      .map(fine)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

    setShortageRfix(parseFloat(tempFineGold).toFixed(3));

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
        tempLedgerAmount = parseFloat(
          (tempTotalInvoiceAmt * rateValue) / 100
        ).toFixed(3); //with gst on total invoice amount
        // console.log(tempLedgerAmount);
        //if tcs then enter amount manually
        // tempLedgerAmount = 0;
        tempfinalAmount = parseFloat(
          parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)
        ).toFixed(3);
      } else if (is_tds_tcs == 2) {
        //tds
        tempLedgerAmount = parseFloat(
          (parseFloat(tempAmount) * rateValue) / 100
        ).toFixed(3); //calculating before gst, on total amount only
        // console.log(tempLedgerAmount);
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
    }

    setPrintObj({
      ...printObj,
      orderDetails: newFormValues,
      is_tds_tcs: is_tds_tcs,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCgstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      roundOff: roundOff,
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      pcsTotal: tempPcsTot,
      totalInvoiceAmt: tempTotalInvoiceAmt,
      taxAmount: tempLedgerAmount,
      balancePayable: parseFloat(tempfinalAmount).toFixed(3),
    });
    setUserFormValues(newFormValues);
  };

  function handleModalClose() {
    // console.log("handle close", callApi);
    setModalOpen(false);
  }

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
    let newFormValues = [...userFormValues];

    // let nm = e.target.name;
    let val = e.target.value;
    // console.log(nm,val)

    newDiffrentStock[i][e.target.name] = val;
    newDiffrentStock[i].errors[e.target.name] = null;

    setDiffrentStock(newDiffrentStock);
    // console.log(newDiffrentStock);
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
        },
      };
    } else {
      newDiffrentStock.splice(index, 1);
    }
    // console.log(newDiffrentStock);
    setDiffrentStock(newDiffrentStock);

    newFormValues[selectedIndex].DiffrentStock = newDiffrentStock;
    setUserFormValues(newFormValues);
  }

  // modalValidation(){
  //   const Regex = /^[0-9]{1, 11}(?:\.[0-9]{1, 3})?$/;
  // if (!weight || Regex.test(weight) === false) {
  // }

  const checkTotal = () => {
    const grossTotal = Number(userFormValues[selectedIndex].grossWeight);
    const netTotal = Number(userFormValues[selectedIndex].netWeight);
    let weightTotal = 0;

    DiffrentStock.map((item) => {
      weightTotal += Number(item.setWeight);
      return null;
    });

    if (netTotal + weightTotal === grossTotal) {
      return false;
    } else {
      return true;
    }
  };

  const modalValidation = () => {
    let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

    const someEmpty = DiffrentStock.filter(
      (element) => element.setStockCodeId !== ""
    ).some((item) => {
      console.log(userFormValues);
      console.log(selectedIndex);
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
            allPrev[index].errors.setWeight = "Enter valid Weight";
          } else if (checkTotal()) {
            dispatch(Actions.showMessage({ message: "Enter valid weight" }));
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
          // const allPrev = [...userFormValues];
          // allPrev[index].errors.netWeight = null;

          // setUserFormValues(allPrev);
          return (item.errors.netWeight = null);
        });
      console.log("if");
      userFormValues[selectedIndex].isWeightDiff = 1;
      setUserFormValues(userFormValues);
      setModalOpen(false);
    } else {
      console.log("else");
    }
  };

  const prevIsValid = () => {
    if (userFormValues.length === 0) {
      console.log("innnnnnnnn");
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
            item.grossWeight === "" ||
            item.grossWeight == 0 ||
            item.netWeight === "" ||
            item.netWeight == 0 ||
            item.wastagePer === "" ||
            item.unitOfPurchase === "" ||
            item.labourCharges === "" ||
            item.labourCharges == 0 ||
            // percentRegex.test(item.wastagePer) === false ||
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
            item.grossWeight === "" ||
            item.grossWeight == 0 ||
            item.netWeight === "" ||
            item.netWeight == 0 ||
            item.wastagePer === "" ||
            item.unitOfPurchase === "" ||
            item.labourCharges === "" ||
            item.labourCharges == 0

            // percentRegex.test(item.wastagePer) === false
          );
        }
      });

    console.log(someEmpty, "dfhthtgghhjg");
    console.log(someEmpty.length, "fbhgghhjmhj")
    if (someEmpty.length === undefined && someEmpty === false) {
      const allPrev = [...userFormValues];
      // console.log(item);

      let stockCode = userFormValues[0].stockCode;
      if (stockCode === "") {
        allPrev[0].errors.stockCode = "Please Select Stock Code";
      } else {
        allPrev[0].errors.stockCode = null;
      }

      let categoryName = userFormValues[0].categoryName;
      if (categoryName === "") {
        allPrev[0].errors.categoryName = "Please Select Valid Category";
      } else {
        allPrev[0].errors.categoryName = null;
      }

      let weightRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
      let gWeight = userFormValues[0].grossWeight;
      if (!gWeight || weightRegex.test(gWeight) === false) {
        allPrev[0].errors.grossWeight = "Enter Gross Weight!";
      } else {
        allPrev[0].errors.grossWeight = null;
      }

      let netWeight = userFormValues[0].netWeight;
      if (!netWeight || weightRegex.test(netWeight) === false) {
        allPrev[0].errors.netWeight = "Enter Net Weight!";
      } else {
        allPrev[0].errors.netWeight = null;
      }

      // console.log(allPrev[index]);
      setUserFormValues(allPrev);
      // return false;
    }


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
          console.log("stock", stockCode);
          if (stockCode.pcs_require === 1) {
            if (
              pcsTotal === "" ||
              pcsTotal === null ||
              pcsTotal === undefined ||
              isNaN(pcsTotal)
            ) {
              allPrev[index].errors.pieces = "Enter Pieces";
            } else {
              allPrev[index].errors.pieces = null;
            }
          }

          let weightRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
          let gWeight = userFormValues[index].grossWeight;
          if (!gWeight || weightRegex.test(gWeight) === false || gWeight == 0) {
            allPrev[index].errors.grossWeight = "Enter Gross Weight!";
          } else {
            allPrev[index].errors.grossWeight = null;
          }

          let netWeight = userFormValues[index].netWeight;
          if (!netWeight || weightRegex.test(netWeight) === false || netWeight == 0) {
            allPrev[index].errors.netWeight = "Enter Net Weight!";
          } else {
            allPrev[index].errors.netWeight = null;
          }

          // item.unitOfPurchase === "" ||
          //   item.labourCharges === "" ||
          let unitOfPurchase = userFormValues[index].unitOfPurchase;
          if (unitOfPurchase === "") {
            allPrev[index].errors.unitOfPurchase = "Select Price";
          } else {
            allPrev[index].errors.unitOfPurchase = null;
          }

          let labourCharges = userFormValues[index].labourCharges;
          if (!labourCharges || weightRegex.test(labourCharges) === false || labourCharges == 0) {
            allPrev[index].errors.labourCharges = "Enter Labour charges";
          } else {
            allPrev[index].errors.labourCharges = null;
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

            console.log("grossWeight", item.grossWeight);
            console.log("netWeight", item.netWeight);
            console.log("tempSetWeight", tempSetWeight);

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
          // if (!wastagePer || percentRegex.test(wastagePer) === false) {
          if (!wastagePer) {
            allPrev[index].errors.wastagePer = "Enter Wastage!";
          } else {
            allPrev[index].errors.wastagePer = null;
          }

          console.log(allPrev[index]);
          setUserFormValues(allPrev);
          return null;
        });
    }

    return !someEmpty;
  };

  function deleteHandler(index) {
    console.log(index);
    let newFormValues = [...userFormValues];
    setAdjustedRate(false);
    setShortageRfix("");
    newFormValues[index].stockCode = "";
    newFormValues[index].stockName = "";
    newFormValues[index].HSNNum = "";
    newFormValues[index].billingCategory = "";
    newFormValues[index].purity = "";
    newFormValues[index].color = "";
    newFormValues[index].pieces = "";
    newFormValues[index].grossWeight = "";
    newFormValues[index].netWeight = "";
    newFormValues[index].isWeightDiff = "";
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
    newFormValues[index].wastagePer = "";
    newFormValues[index].fine = "";
    newFormValues[index].labourCharges = "";
    newFormValues[index].unitOfPurchase = "";
    newFormValues[index].rate = "";
    newFormValues[index].totalAmount = "";
    newFormValues[index].cgstPer = "";
    newFormValues[index].cgstVal = "";
    newFormValues[index].sGstPer = "";
    newFormValues[index].sGstVal = "";
    newFormValues[index].IGSTper = "";
    newFormValues[index].IGSTVal = "";
    newFormValues[index].total = "";
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
      fine: null,
      labourCharges: null,
      unitOfPurchase: null,
      rate: null,
      totalAmount: null,
      cgstPer: null,
      cgstVal: null,
      sGstPer: null,
      sGstVal: null,
      IGSTper: null,
      IGSTVal: null,
      total: null,
    };

    // setUserFormValues(newFormValues)
    changeTotal(newFormValues, false);
  }
  //......new code
  const handleVendorClientChange = (value) => {
    if (loadTypeValidation()) {
      reset();
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
    }
  };

  function handleClientPartyChange(value) {
    if (loadTypeValidation()) {
      reset();
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

      let findIndex = clientData.findIndex((item) => item.id === value.value);
      if (findIndex > -1) {
        getClientCompanies(value.value);
      }
      if (selectedLoad === "0") {
        //if 1 then no need to call api, wastage % will come from api
        getClientRateProfile(value.value);
      }
    }
  }

  function handleClientFirmChange(value) {
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
    resetFormOnly();
    getFixedRateofWeightClient(value.value);

    const index = clientFirmData.findIndex(
      (element) => element.id === value.value
    );
    console.log(index);

    if (index > -1) {
      setFirmName(clientFirmData[index].company_name);
      setFirmNameErr("");
      setAddress(clientFirmData[index].address);
      setSupplierGstUinNum(clientFirmData[index].gst_number);
      setSupPanNum(clientFirmData[index].pan_number);
      setSupState(clientFirmData[index].StateName.name);
      setSupCountry(clientFirmData[index].CountryName.name);
      setSupStateCode(clientFirmData[index].gst_number);
      setVendorStateId(clientFirmData[index].state);
      setIs_tds_tcs(clientFirmData[index].is_tds_tcs);
      console.log(clientFirmData[index].is_tds_tcs);

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
        voucherDate: moment().format("DD-MM-YYYY"),
        placeOfSupply: clientFirmData[index].StateName.name,
      });
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
          taxAmount: "",
          metNarration: "",
          accNarration: "",
          balancePayable: "",
        });
      }
      setLegderAmount(0); //everything is goinf to reset so 0
    }
  }

  function getLedger(tcstds) {
    if (tcstds == 2) {
      var api = `api/ledgerMastar/tds/2`;
    } else if (tcstds == 1) {
      var api = `api/ledgerMastar/tcs/2`;
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

  const handleDocModalClose = () => {
    // console.log("handleDocModalClose")
    setDocModal(false);
  };

  const getFileUrl = () => {
    if (uploadType === "") {
      return "";
    } else if (uploadType === "0") {
      return packingSlipFile;
    } else if (uploadType === "1") {
      return packetWiseFile;
    } else if (uploadType === "2") {
      return barcodedFile;
    }
  };

  const getFileName = () => {
    if (uploadType === "") {
      return "";
    } else if (uploadType === "0") {
      return "Load_Packing_Slip_wise.csv";
    } else if (uploadType === "1") {
      return "Load_Packet_wise.csv";
    } else if (uploadType === "2") {
      return "Load_Barcode_wise.csv";
    }
  };

  const handleNarrationClick = () => {
    console.log("handleNarr", narrationFlag);
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        flag: 2,
        id: idToBeView.id,
        metal_narration: jewelNarration,
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


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 jewellery-full-width jewellery-purchase-main-dv">
            {!props.viewPopup && (
              <Grid
                container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0 }}
              >
                <Grid item xs={7} sm={7} md={7} key="1" style={{ padding: 0 }}>
                  <FuseAnimate delay={300}>
                    <Typography className="pl-28 pt-16 text-18 font-700">
                      {isView
                        ? "View Jewellery Purchase"
                        : "Add Jewellery Purchase"}
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
            )}
            <div className="main-div-alll">
              {loading && <Loader />}
              <div
                className="pt-16"
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
                    <Grid id="jewellery-input" container spacing={3}>
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p style={{ paddingBottom: "3px" }}>Select load type*</p>
                        <select
                          className={clsx(classes.selectBox, "focusClass")}
                          required
                          value={selectedLoad}
                          onChange={(e) => handleLoadChange(e)}
                          disabled={isView}
                          ref={loadTypeRef}
                        >
                          <option hidden value="">
                            Select load type
                          </option>
                          <option value="0">Load Finding Varient </option>
                          <option value="1">
                            Load Barcoded Stock form excel
                          </option>
                        </select>

                        <span style={{ color: "red" }}>
                          {selectedLoadErr.length > 0 ? selectedLoadErr : ""}
                        </span>
                      </Grid>
                      {selectedLoad === "1" && (
                        <>
                          <Grid
                            item
                            lg={2}
                            md={4}
                            sm={4}
                            xs={12}
                            style={{ padding: 6 }}
                          >
                            <p style={{ paddingBottom: "3px" }}>
                              Select upload type
                            </p>
                            <select
                              className={clsx(classes.selectBox, "focusClass")}
                              required
                              value={uploadType}
                              onChange={(e) => handleUploadtype(e)}
                              disabled={isView}
                            >
                              <option hidden value="">
                                Select upload type
                              </option>
                              <option value="0">Upload Packing Slip Wise</option>
                              <option value="1">Upload Packet Wise </option>
                              <option value="2">Upload Barcode Wise </option>
                            </select>

                            <span style={{ color: "red" }}>
                              {uploadTypeErr.length > 0 ? uploadTypeErr : ""}
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
                            <p style={{ paddingBottom: "3px" }}>Select Bom</p>
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
                        </>
                      )}
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
                            <p style={{ paddingBottom: "3px" }}>Party name*</p>
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
                        <p style={{ paddingBottom: "3px" }}>Opposite account*</p>
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
                          Party voucher number*
                        </p>
                        <TextField
                          // className="mb-16"
                          placeholder="Party voucher number"
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
                        style={{ padding: 6 }}
                      >
                        <p style={{ paddingBottom: "3px" }}>
                          Party voucher date*
                        </p>
                        <TextField
                          placeholder="Party voucher date"
                          type="date"
                          name="partyVoucherDate"
                          value={partyVoucherDate}
                          onChange={(e) => setPartyVoucherDate(e.target.value)}
                          onKeyDown={(e) => e.preventDefault()}
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
                          <p style={{ paddingBottom: "3px" }}>
                            Upload document
                          </p>
                          <TextField
                            className=" uploadDoc"
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

                      {selectedLoad === "1" && (
                        <>
                          <Grid
                            item
                            lg={2}
                            md={4}
                            sm={4}
                            xs={12}
                            style={{ padding: 6, marginTop: "20px" }}
                          >
                            <Button
                              id="upload-btn-jewellery"
                              variant="contained"
                              color="primary"
                              // style={{ float: "right" }}
                              className="w-224 mx-auto "
                              aria-label="Register"
                              //   disabled={!isFormValid()}
                              // type="submit"
                              disabled={!isEnabled || isView}
                              onClick={handleClick}
                            >
                              Upload a file
                            </Button>
                            {uploadErr !== "" && (
                              <span style={{ color: "red" }}>{uploadErr}</span>
                            )}
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
                            {uploadType !== "" && !isView && (
                              <a href={getFileUrl()} download={getFileName()}>
                                Download Sample{" "}
                              </a>
                            )}
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

                    {selectedLoad === "0" && (
                      <div
                        className="mt-16 jewellerey-tb-main  jewellereyPurchase-tb-main"
                        style={{
                          paddingBottom: 5,
                        }}
                      >
                        <div className="inner-addsalestabel-blg ">
                          <div
                            className="jewellery-artician-tbl jewellery-purchase-table addjewellery-purchase-table addjewellery-purchase-table viewaddjewellery-purchase-table"
                            style={{
                              border: "1px solid #D1D8F5",
                              paddingBottom: 5,
                              borderRadius: "7px",
                            }}
                          >
                            <div
                              className=" jewellery-th-dv"
                              id="jewellery-head-dv"
                              style={{
                                background: "#EBEEFB",
                                fontWeight: "700",
                              }}
                            >
                              {!isView && (
                                <div
                                  className={clsx(
                                    classes.tableheader,
                                    "delete_icons_dv"
                                  )}
                                  style={{ fontWeight: "700" }}
                                >
                                  {/* delete action */}
                                </div>
                              )}
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
                                color
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
                                Wastage (%)
                              </div>

                              <div
                                className={clsx(classes.tableheader, "")}
                                style={{ fontWeight: "700" }}
                              >
                                fine
                              </div>

                              <div
                                className={clsx(classes.tableheader, "")}
                                style={{ fontWeight: "700" }}
                              >
                                Price per Piece / Gram
                              </div>

                              <div
                                className={clsx(classes.tableheader, "")}
                                style={{ fontWeight: "700" }}
                              >
                                Labour Charges
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
                                Total Amount
                              </div>

                              {isView && igstVal != 0 && igstVal !== "" ? (
                                <>
                                  <div
                                    className={clsx(classes.tableheader, "")}>
                                    IGST (%)
                                  </div>
                                  <div
                                    className={clsx(classes.tableheader, "")}
                                  >
                                    IGST
                                  </div>
                                </>
                              ) : (
                                isView && (
                                  <>
                                    <div
                                      className={clsx(classes.tableheader, "")}
                                    >
                                      CGST (%)
                                    </div>
                                    <div
                                      className={clsx(classes.tableheader, "")}
                                    >
                                      SGST (%)
                                    </div>
                                    <div
                                      className={clsx(classes.tableheader, "")}
                                    >
                                      CGST
                                    </div>
                                    <div
                                      className={clsx(classes.tableheader, "")}
                                    >
                                      SGST
                                    </div>
                                  </>
                                )
                              )}

                              {vendorStateId === 12 && !isView && (
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

                              {vendorStateId !== 12 && !isView && (
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
                                  // className={classes.selectBox}
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
                                  name="pieces"
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
                                  disabled={isView}
                                />

                                <TextField
                                  name="grossWeight"
                                  type={isView ? "text" : "number"}
                                  value={element.grossWeight || ""}
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
                                  name="netWeight"
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
                                  disabled={isView}
                                />
                                {/* {element.isWeightDiff === 0 && ( icon is not showing if flag becomes 1 */}
                                {element.grossWeight !== "" &&
                                  element.netWeight !== "" &&
                                  parseFloat(element.grossWeight).toFixed(3) !==
                                    parseFloat(element.netWeight).toFixed(
                                      3
                                    ) && (
                                    <IconButton
                                      className="notification-icon_dv"
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
                                  name="fine"
                                  className=""
                                  value={element.fine || ""}
                                  disabled
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.fine
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.fine
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                />

                                {/* <Grid className="purchase-select-dv"> */}
                                <select
                                  id="purchase-select-dv"
                                  className={clsx(
                                    classes.normalSelect,
                                    "focusClass"
                                  )}
                                  required
                                  value={element.unitOfPurchase || ""}
                                  onChange={(e) => handleUnitChange(index, e)}
                                  disabled={isView}
                                >
                                  <option hidden value="">
                                    Price per Gram / Piece
                                  </option>
                                  <option value="1">Gram </option>
                                  <option value="2">Pieces </option>
                                </select>

                                {element.errors !== undefined &&
                                element.errors.unitOfPurchase !== null ? (
                                  <span style={{ color: "red" }}>
                                    {element.errors.unitOfPurchase}
                                  </span>
                                ) : (
                                  ""
                                )}

                                <TextField
                                  name="labourCharges"
                                  type={isView ? "text" : "number"}
                                  value={
                                    isView
                                      ? Config.numWithComma(
                                          element.labourCharges
                                        )
                                      : element.labourCharges || ""
                                  }
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.labourCharges
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.labourCharges
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
                                  name="rate"
                                  className=""
                                  disabled
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
                                  variant="outlined"
                                  fullWidth
                                />

                                <TextField
                                  // label="totalAmount"
                                  name="totalAmount"
                                  className=""
                                  disabled
                                  value={
                                    isView
                                      ? Config.numWithComma(element.totalAmount)
                                      : element.totalAmount || ""
                                  }
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

                                {isView && element.IGSTper ? (
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
                                ) : (
                                  isView && (
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
                                        value={
                                          isView
                                            ? Config.numWithComma(
                                                element.cgstVal
                                              )
                                            : element.cgstVal || ""
                                        }
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
                                        value={
                                          isView
                                            ? Config.numWithComma(
                                                element.sGstVal
                                              )
                                            : element.sGstVal || ""
                                        }
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
                                  )
                                )}

                                {vendorStateId === 12 && !isView && (
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
                                      value={
                                        isView
                                          ? Config.numWithComma(element.cgstVal)
                                          : element.cgstVal || ""
                                      }
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
                                      value={
                                        isView
                                          ? Config.numWithComma(element.sGstVal)
                                          : element.sGstVal || ""
                                      }
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

                                {vendorStateId !== 12 && !isView && (
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
                                  name="total"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(element.total)
                                      : element.total || ""
                                  }
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
                                >
                                  {/* Action */}
                                </div>
                              )}
                              <div
                                id="castum-width-table"
                                className={classes.tableheader}
                              >
                                {/* Stock Code */}
                              </div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {/* Stock Name */}
                              </div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {/* HSN */}
                              </div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {/* Billing Category */}
                              </div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {/* Purity */}
                              </div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {/* color */}
                              </div>

                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {/* Pcs */}
                                {piecesTot}
                              </div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {totalGrossWeight}
                                {/* Gross Weight */}
                              </div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {/* Net Weight */}
                                {totalNetWeight}
                              </div>

                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {/* Wastage (%) */}
                              </div>

                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {fineTotal}
                                {/* fine */}
                              </div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {/* price per piece/gram */}
                              </div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {/* labour charges */}
                              </div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {/* Gold Rate */}
                              </div>

                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {isView
                                  ? Config.numWithComma(totalAmount)
                                  : totalAmount}
                                {/* Total Amount */}
                              </div>

                              {igstVal != 0 && igstVal !== "" ? (
                                <>
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
                                      ? Config.numWithComma(igstVal)
                                      : igstVal}
                                  </div>
                                </>
                              ) : (
                                <>
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
                                    {isView
                                      ? Config.numWithComma(cgstVal)
                                      : cgstVal}
                                  </div>
                                  <div
                                    className={clsx(
                                      classes.tableheader,
                                      "castum-width-table"
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
                                  "castum-width-table"
                                )}
                              >
                                {isView ? Config.numWithComma(total) : total}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedLoad === "1" && (
                      <Grid className="salesjobwork-table-main cate_jewellry_tbl add-jewellary-tab-tbl viewadd-jewellary-tab-tbl addsales-jobreturn-domestic-dv">
                        <div className="mt-16">
                          <AppBar
                            position="static"
                            className="add-header-purchase"
                          >
                            <Tabs value={modalView} onChange={handleChangeTab}>
                              <Tab label="Category Wise List" />
                              <Tab label="Tag Wise List" />
                              {(uploadType === "0" || uploadType === "1") && (
                                <Tab label="Packet Wise List" />
                              )}
                              {uploadType === "0" && (
                                <Tab label="Packing Slip Wise List" />
                              )}
                            </Tabs>
                          </AppBar>
                          {modalView === 0 && (
                            <CategoryWiseList
                              productData={productData}
                              stateId={vendorStateId}
                              isView={isView}
                            />
                          )}
                          {modalView === 1 && (
                            <TagWiseList
                              tagWiseData={tagWiseData}
                              stateId={vendorStateId}
                              uploadType={uploadType}
                              isView={isView}
                            />
                          )}

                          {(uploadType === "0" || uploadType === "1") &&
                            modalView === 2 && (
                              <PacketWiseList
                                packetData={packetData}
                                stateId={vendorStateId}
                                isView={isView}
                              />
                            )}

                          {uploadType === "0" && modalView === 3 && (
                            <PackingSlipWiseList
                              packingSlipData={packingSlipData}
                              stateId={vendorStateId}
                              isView={isView}
                            />
                          )}
                        </div>
                      </Grid>
                    )}
                  </form>

                  <Grid item xs={2}>
                    <Button
                      id="btn-save"
                      variant="contained"
                      // style={{ float: "right" }} jewellery-ratefix-btn
                      className="w-224 mx-auto mr-16 mt-16 "
                      aria-label="Register"
                      disabled={
                        isView ||
                        (selectedLoad == "0" && userFormValues[0].fine === "")
                      }
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
                          name="roundOff"
                          className="ml-2  addconsumble-dv"
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
                  {!props.viewPopup && (
                    <div className="mt-16" style={{ paddingBottom: 5 }}>
                      <div
                        className="table-row-source"
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

                      <div className=" table-row-source">
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
                          onChange={handleLedgerChange}
                          placeholder="Ledger Name"
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
                          error={tdsTcsVouErr.length > 0 ? true : false}
                          helperText={tdsTcsVouErr}
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
                          disabled={is_tds_tcs !== 1 || isView}
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
                      <p style={{ paddingBottom: "3px" }}>
                        jewellery narration
                      </p>
                      <TextField
                        className="mt-1"
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
                        style={{ float: "right" }}
                        className="w-224 mx-auto mt-16 mr-16 btn-print-save"
                        aria-label="Register"
                        //   disabled={!isFormValid()}
                        // type="submit"
                        onClick={checkforPrint}
                      >
                        {isView ? "Print" : "Save & Print"}
                      </Button>

                      {isView && (
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ float: "right" }}
                          className="w-224 mx-auto mt-16 mr-16"
                          aria-label="Register"
                          onClick={() => handleNarrationClick()}
                        >
                          {!narrationFlag
                            ? "Save Narration"
                            : "Update Narration"}
                        </Button>
                      )}

                      <div style={{ display: "none" }}>
                        {selectedLoad === "0" ? (
                          <JewelPurcPrintComp
                            ref={componentRef}
                            printObj={printObj}
                            isView={isView}
                            getDateAndTime={getDateAndTime()}
                          />
                        ) : (
                          <JewelPurcHmPrintComp
                            ref={componentRef}
                            printObj={printObj}
                            getDateAndTime={getDateAndTime()}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {isView && (
                    <Button
                      variant="contained"
                      className={clsx(classes.button, "mt-16 mr-16")}
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
              purchase_flag="2"
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
                        disabled={isView}
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
                  // <div className="p-5 pl-16 pr-16">
                  //   <Button
                  //     variant="contained"
                  //     color="primary"
                  //     className="w-full mx-auto mt-16"
                  //     style={{
                  //       backgroundColor: "#4caf50",
                  //       border: "none",
                  //       color: "white",
                  //     }}
                  //     onClick={(e) => checkforUpdate(e)}
                  //   >
                  //     Save
                  //   </Button>
                  // </div>

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

                <div className="p-5 pl-16 pr-16">
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
                                  style={{ width: "50%" }}
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
                        type={isView ? "text" : "number"}
                        className="mt-1"
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
                  {/* </>
                  )} */}
                 
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

export default AddJewellaryPurchase;

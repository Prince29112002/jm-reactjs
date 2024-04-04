import React, { useState, useEffect, useRef,useContext } from "react";
import { Typography, TextField, Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Select, { createFilter } from "react-select";
import History from "@history";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import CategoryWiseList from "../../ComponentsSaleDomestic/CategoryWiseList";
import TagWiseList from "../../ComponentsSaleDomestic/TagWiseList";
import PacketWiseList from "../../ComponentsSaleDomestic/PacketWiseList";
import PackingSlipWiseList from "../../ComponentsSaleDomestic/PackingSlipWise";
import BillOfMaterial from "../../ComponentsSaleDomestic/BillOfMaterial";
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
import HelperFunc from "../../Helper/HelperFunc";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import { SalesDomesticPrint } from "../PrintComponent/SalesDomesticPrint";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
import { UpdateNarration } from "../../Helper/UpdateNarration";
import AppContext from "app/AppContext";
import EInvoice from "./EInvoice";
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
  tableRowPad: {
    padding: 7,
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


const AddSalesDomestic = (props) => {
 
  const [mainView, setMainView] = useState(false); //for
  const [viewState, setViewState] = useState(null);
  
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
    jewelNarration: "",
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
    if (mainView === false) {
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

  const [timeDate, setTimeDate] = useState("");
  function getDateAndTime() {
    if (mainView) {
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
    documentTitle: "Sales Domestic Voucher_" + getDateAndTime(),
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
      callFileUploadApi(docFile, 22)
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
  }, [])

  function checkforPrint() {
    setInvoiceOpensave(false);
      if (mainView) {
        handlePrint();
      } else {
        if (
          checkInfoVoucherSelected()&&
          loadTypeValidation() &&
          voucherNumValidation() &&
          partyNameValidation() &&
          oppositeAcValidation() &&
          shippingValidation() &&
          ledgerNameValidate() && 
          handleDateBlur()
          //  && rateFixValidation()
        ){
          if (selectedLoad === "0") {
            // if (uploadTypeValidation()) {
            if (shipping === "1") {
              if (shippingClientValidation() && shippingCompValidation()) {
                // addJewellaryPuchaseApi();
                createFromPackingSlip(false, true);
                // handlePrint();
              }
            } else {
              // addJewellaryPuchaseApi();
              createFromPackingSlip(false, true);
              // handlePrint();
            }
            // }
          } else {
            //selectedLoad 1 ,2 , 3
            if (shipping === "1") {
              if (shippingClientValidation() && shippingCompValidation()) {
                //check prev valid
                if (prevIsValid()) {
                  addUserInputApi(false, true);
                  // handlePrint();
                }
              }
              if (prevIsValid()) {
                addUserInputApi(false, true);
                // handlePrint();
              }
            }
          }
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
  }, [onBeforeGetContentResolve.current]);//, text

  const [invoiceModal, setInvoiceModal] = useState(false)
  const classes = useStyles();
  const theme = useTheme();
  const [modalStyle] = React.useState(getModalStyle);
  const [modalView, setModalView] = useState(0);
  // const [open, setOpen] = useState(false);
  const [InvoiceIRN, setInvoiceIRN] = useState("");
  const [InvoiceDate, setInvoiceDate] = useState(moment().format("DD-MM-YYYY"));
  const [invoiceflag, setinvoiceflag] = useState("");
  const [isgenerate, setisgenerate] = useState("");

  const [loading, setLoading] = useState(false);

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");
  const [totalNetWeight, setTotalNetWeight] = useState("");
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

  const [clientdata, setClientdata] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectClientErr, setSelectClientErr] = useState("");

  const [clientCompanies, setClientCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompErr, setSelectedCompErr] = useState("");

  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");
  const [vendorStateId, setVendorStateId] = useState("");
  const [address, setAddress] = useState("");
  const [supplierGstUinNumber, setSupplierGstUinNum] = useState("");
  const [supPanNumber, setSupPanNum] = useState("");
  const [supStateName, setSupState] = useState("");
  const [supCountryName, setSupCountry] = useState("");

  const [vendorData, setVendorData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedVendorErr, setSelectedVendorErr] = useState("");

  const [ledgerData, setLedgerData] = useState([]);
  const [selectedVendorClient, setVendorClient] = useState({ value: 1, label: "Vendor" });

  const [is_tds_tcs, setIs_tds_tcs] = useState("");

  const [tdsTcsVou, setTdsTcsVou] = useState("");
  const [tdsTcsVouErr, setTdsTcsVouErr] = useState("");

  const [ledgerName, setLedgerName] = useState("");
  const [ledgerNmErr, setLedgerNmErr] = useState("");

  const [rateValue, setRateValue] = useState("");
  const [rateValErr, setRateValErr] = useState("");

  const [ledgerAmount, setLegderAmount] = useState("");
  const [ledgerAmtErr, setLedgerAmtErr] = useState("");

  const [shipping, setShipping] = useState("");
  const [shippingErr, setShippingErr] = useState("");

  const [shippingClient, setShippingClient] = useState("");
  const [shipClientErr, setShipClientErr] = useState("");

  const [shipClientComp, setShipClientComp] = useState("");
  const [shipCompErr, setShipCompErr] = useState("");

  const [shipclientCompData, setShipclientCompData] = useState([]);

  const [packingSlipNo, setPackingSlipNo] = useState("");
  const [packingSlipErr, setPackingSlipErr] = useState("");

  const [packingSearch, setPackingSearch] = useState("");

  const [packingSlipApiData, setPackingSlipApiData] = useState([]);

  const [balanceRfixData, setBalanceRfixData] = useState("");
  const [balRfixViewData, setBalRfixViewData] = useState([]);

  const [tempApiWeight, setTempApiWeight] = useState("");

  const [rfModalOpen, setRfModalOpen] = useState(false);
  const [popupErr, setPopupErr] = useState("");
  // const [utiliseErr, setUtiliseErr] = useState("");
  const [utiliseTotal, setUtiliseTotal] = useState("");
  const [selectedRateFixErr, setSelectedRateFixErr] = useState("");

  const [shortageRfix, setShortageRfix] = useState("");
  const [shortageRfixErr, setShortageRfixErr] = useState("");

  const [tempRate, setTempRate] = useState("");
  const [tempRateErr, setTempRateErr] = useState("");

  const [avgRate, setAvgeRate] = useState("");
  const [avgRateErr, setAvgeRateErr] = useState("");

  const [adjustedRate, setAdjustedRate] = useState(false);
  const [InvoiceOpen, setInvoiceOpen] = useState(false);
  const [InvoiceOpensave, setInvoiceOpensave] = useState(false);

  const [newRate, setNewRate] = useState("");

  const [fineGoldTotal, setFineGoldTotal] = useState("");

  const [stateId, setStateId] = useState("");

  const [lotdata, setLotData] = useState([]);

  const [searchData, setSearchData] = useState(""); //for lot search

  const [totalGrossWeight, setTotalGrossWeight] = useState("");
  // const [totalNetWeight, setTotalNetWeight] = useState("");
  const [amount, setAmount] = useState("");
  const [cgstVal, setCgstVal] = useState("");
  const [sgstVal, setSgstVal] = useState("");
  const [igstVal, setIgstVal] = useState("");
  const [total, setTotal] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

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

  const loadTypeRef = useRef(null)

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [jewelNarration, setJewelNarration] = useState("");
  const [jewelNarrationErr, setJewelNarrationErr] = useState("");

  const [packingSlipData, setPackingSlipData] = useState([]); //packing slip wise
  const [packetData, setPacketData] = useState([]); //packet wise Data
  const [productData, setProductData] = useState([]); //category wise Data
  const [billMaterialData, setBillmaterialData] = useState([]); //bill of material Data
  const [tagWiseData, setTagWiseData] = useState([]); //tag wise Data

  const [HMCharges, setHMCharges] = useState("") // hall mark charges for rows
  // const [rateProfiles, setRateProfiles] = useState([]);

  var idToBeView;
  if (props.location) {
    idToBeView = props.location.state;
  } else if (props.voucherId) {
    idToBeView = { id: props.voucherId }
  }

  const [isView, setIsView] = useState(true); //for view Only
  const [narrationFlag, setNarrationFlag] = useState(false)
  const [voucherinfolist, setVoucherinfolist] = useState([]);
  const [selectedVoucherinfo, setSelectedVoucherinfo] = useState("");
  const [selectedVoucherinfoErr, setSelectedVoucherinfoErr] = useState("");

  const appContext = useContext(AppContext);
  const { selectedDepartment } = appContext;

  useEffect(() => {
    if(selectedDepartment && !mainView){
    getVoucherInfo()
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if(selectedVoucherinfo &&  idToBeView === undefined){
      getSalesDomesticRecord()
    }
  }, [selectedVoucherinfo]);

  function getVoucherInfo(){
    axios
    .get(Config.getCommonUrl() + "api/tempSalesDomestic/dropDown?department_id=" + selectedDepartment.value.split("-")[1])
    .then(function (response) {
      console.log(response.data.data);
      if (response.data.success === true) {
        setVoucherinfolist(response.data.data)
      } else {
        dispatch(Actions.showMessage({ message: response.data.message }));
      }
    })
    .catch(function (error) {
      handleError(error, dispatch, { api: "api/tempSalesDomestic/dropDown?department_id=" + selectedDepartment.value.split("-")[1]})
    });
  }

  // wastagePer will be entered manualy in sales and sales return, confirmed with hirenbhai on 25/04/22
  const [formValues, setFormValues] = useState([
    {
      manuallLot: "0",
      lotno: "",
      category: "",
      billingCategory: "",
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
      wastagePer: "",
      wastageFine: "",
      otherTagAmount: "",
      totalFine: "",
      fineRate: "",
      catRatePerGram: "",
      amount: "",
      hallmarkCharges: "",
      totalAmount: "",
      cgstPer: "",
      cgstVal: "",
      sGstPer: "",
      sGstVal: "",
      IGSTper: "",
      IGSTVal: "",
      total: "",
      HSNNum: "",
      errors: {
        category: null,
        billingCategory: null,
        HSNNum: null,
        lotNumber: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        jobworkFineUtilize: null,
        wastagePer: null,
        wastageFine: null,
        fineRate: null,
        labourFineAmount: null,
        otherTagAmount: null,
        catRatePerGram: null,
        amount: null,
        hallmarkCharges: null,
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
      manuallLot: "0",
      lotno: "",
      category: "",
      billingCategory: "",
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
      wastagePer: "",
      wastageFine: "",
      otherTagAmount: "",
      totalFine: "",
      fineRate: "",
      catRatePerGram: "",
      amount: "",
      hallmarkCharges: "",
      totalAmount: "",
      cgstPer: "",
      cgstVal: "",
      sGstPer: "",
      sGstVal: "",
      IGSTper: "",
      IGSTVal: "",
      total: "",
      HSNNum: "",
      errors: {
        category: null,
        billingCategory: null,
        HSNNum: null,
        lotNumber: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        jobworkFineUtilize: null,
        wastagePer: null,
        wastageFine: null,
        fineRate: null,
        labourFineAmount: null,
        otherTagAmount: null,
        catRatePerGram: null,
        amount: null,
        hallmarkCharges: null,
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
      manuallLot: "0",
      lotno: "",
      category: "",
      billingCategory: "",
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
      wastagePer: "",
      wastageFine: "",
      otherTagAmount: "",
      totalFine: "",
      fineRate: "",
      catRatePerGram: "",
      amount: "",
      hallmarkCharges: "",
      totalAmount: "",
      cgstPer: "",
      cgstVal: "",
      sGstPer: "",
      sGstVal: "",
      IGSTper: "",
      IGSTVal: "",
      total: "",
      HSNNum: "",
      errors: {
        category: null,
        billingCategory: null,
        HSNNum: null,
        lotNumber: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        jobworkFineUtilize: null,
        wastagePer: null,
        wastageFine: null,
        fineRate: null,
        labourFineAmount: null,
        otherTagAmount: null,
        catRatePerGram: null,
        amount: null,
        hallmarkCharges: null,
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
      manuallLot: "0",
      lotno: "",
      category: "",
      billingCategory: "",
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
      wastagePer: "",
      wastageFine: "",
      otherTagAmount: "",
      totalFine: "",
      fineRate: "",
      catRatePerGram: "",
      amount: "",
      hallmarkCharges: "",
      totalAmount: "",
      cgstPer: "",
      cgstVal: "",
      sGstPer: "",
      sGstVal: "",
      IGSTper: "",
      IGSTVal: "",
      total: "",
      HSNNum: "",
      errors: {
        category: null,
        billingCategory: null,
        HSNNum: null,
        lotNumber: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        jobworkFineUtilize: null,
        wastagePer: null,
        wastageFine: null,
        fineRate: null,
        labourFineAmount: null,
        otherTagAmount: null,
        catRatePerGram: null,
        amount: null,
        hallmarkCharges: null,
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

  const pcsInputRef = useRef([])//for pcs in table

  const dispatch = useDispatch();

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

    setOppositeAccData(HelperFunc.getOppositeAccountDetails("SalesDomestic"));

    console.log("idToBeView", idToBeView);
    if (idToBeView !== undefined) {
      setMainView(true);
      setNarrationFlag(true)
      getSalesDomesticRecordView(idToBeView.id);
    } else {
      setNarrationFlag(false)
      getVoucherNumber()
    }
  }, []);

  function getSalesDomesticRecord() {
    setLoading(true);
    let api = `api/tempSalesDomestic/${selectedVoucherinfo.value}`
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response.data.data);

        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              let finalData = response.data.data.data;
              let loadType = response.data.data.otherDetails.loadType
              setSelectedLoad(loadType.toString())
              var clientVendorState;

              if (finalData.is_vendor_client === 1) {

                setVendorClient({ value: 1, label: "Vendor" })
                var mainObj = finalData.Vendor
                setSelectedVendor({
                  value: finalData.Vendor.id,
                  label: finalData.Vendor.name,
                });
                setFirmName(finalData.Vendor.firm_name);
                setVendorStateId(finalData.Vendor.state);
                setIs_tds_tcs(finalData.Vendor.is_tds_tcs);
                if(finalData.Vendor.is_tds_tcs == 1 || finalData.Vendor.is_tds_tcs == 2){
                  getLedger(finalData.Vendor.is_tds_tcs)
                }
                clientVendorState = finalData.Vendor.state

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
                setVendorStateId(finalData.ClientCompany.state);
                setIs_tds_tcs(finalData.ClientCompany.is_tds_tcs);
                if(finalData.ClientCompany.is_tds_tcs == 1 || finalData.ClientCompany.is_tds_tcs == 2){
                  getLedger(finalData.ClientCompany.is_tds_tcs)
                }
                clientVendorState = finalData.ClientCompany.state
              }
              console.log(mainObj)
              setDocumentList(finalData.salesPurchaseDocs)
             
              setAllowedBackDate(true);
              setPartyVoucherNum(finalData.party_voucher_no)
              setPartyVoucherDate(finalData.party_voucher_date)
              setStateId(clientVendorState);
              let state = clientVendorState;

              // setIs_tds_tcs(mainObj.is_tds_tcs);
              setRoundOff(
                finalData.round_off === null ? "" : finalData.round_off
              );

              setShipping((finalData.is_shipped).toString())

              if (finalData.is_shipped === 1) {
                setShippingClient({
                  value: finalData.shippingClient.id,
                  label: finalData.shippingClient.name
                })

                setShipClientComp({
                  value: finalData.shippingClientCompany.id,
                  label: finalData.shippingClientCompany.company_name
                })
              }

              if(finalData.salesPurchaseDocs.length > 0){
                const docIdsArr = finalData.salesPurchaseDocs.map((item, index)=>{
                  return item.id
                })
                setDocIds(docIdsArr)
              }

              if (finalData.TdsTcsVoucher !== null) {
                setTdsTcsVou(finalData.TdsTcsVoucher.voucher_no);
                // setLedgerName({
                //   value: finalData.TdsTcsVoucher.id,
                //   label: finalData.TdsTcsVoucher.voucher_name,
                // });
              }
              setRateValue(finalData.tds_or_tcs_rate !== null ? finalData.tds_or_tcs_rate : "");

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

              if(finalData.rate_fix_modal){
                setTempRate(finalData.rate_fix_modal?.setRate)
                setBalRfixViewData(finalData.rate_fix_modal?.rates)
              }

              let tempArray = [];


              if (loadType === 0) {

                let tempPackingSlipData = response.data.data.packingSlipData;
                // console.log(tempPackingSlipData)
                let data = HelperFunc.packingSlipViewDataSalesDomestic(tempPackingSlipData, finalData.TempSalesDomesticOrders[0].fine_rate, state)
                console.log(">>>>>>>>>>>>>>>>>", data)

                setPackingSlipData(data.packingSlipArr);
                setPacketData(data.packetDataArr)
                setProductData(data.ProductDataArr);
                setTagWiseData(data.tagWiseDataArr);
                setBillmaterialData(data.bomDataArr);

                let temp = data.ProductDataArr;

                function amount(item) {
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

                function grossWeight(item) {
                  return parseFloat(item.gross_wgt);
                }
                function netWeight(item) {
                  return parseFloat(item.net_wgt);
                }

                let totalGrossWeightVal = parseFloat(temp
                  .filter((item) => item.gross_wgt !== "")
                  .map(grossWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3);
                setTotalGrossWeight(totalGrossWeightVal);

                let totalNetWeightVal = parseFloat(temp
                  .filter((item) => item.net_wgt !== "")
                  .map(netWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3);
                setTotalNetWeight(totalNetWeightVal);

                let tempAmount = temp
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

                if (state === 12) {
                  tempCgstVal = temp
                    .filter((item) => item.cgstVal !== "")
                    .map(CGSTval)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0);

                  tempSgstVal = temp
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
                    parseFloat(tempAmount) +
                    parseFloat(tempCgstVal) +
                    parseFloat(tempSgstVal)
                  ).toFixed(3);
                } else {

                  tempIgstVal = temp
                    .filter((item) => item.IGSTVal !== "")
                    .map(IGSTVal)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0);

                  setTotalGST(parseFloat(tempIgstVal).toFixed(3));
                  tempTotal = parseFloat(
                    parseFloat(tempAmount) + parseFloat(tempIgstVal)
                  ).toFixed(3);
                }
                console.log(temp)
                setTotal(parseFloat(tempTotal).toFixed(3))
                setTotalAmount(parseFloat(tempAmount).toFixed(3))
                setPrintObj({
                  ...printObj,
                  loadType: loadType.toString(),
                  is_tds_tcs: mainObj.is_tds_tcs,
                  stateId: clientVendorState,
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
                  orderDetails: temp,
                  taxableAmount: parseFloat(tempAmount).toFixed(3),
                  sGstTot: clientVendorState === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
                  cGstTot: clientVendorState === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
                  iGstTot: clientVendorState !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
                  roundOff: finalData.round_off === null ? "0" : finalData.round_off,
                  grossWtTOt: totalGrossWeightVal,
                  netWtTOt: totalNetWeightVal,
                  // fineWtTot: parseFloat(tempFineGold).toFixed(3),
                  totalInvoiceAmt: parseFloat(finalData.total_invoice_amount).toFixed(3),
                  TDSTCSVoucherNum: finalData.TdsTcsVoucher !== null ? finalData.TdsTcsVoucher.voucher_no : "",
                  ledgerName: finalData.TdsTcsVoucher !== null ? finalData.TdsTcsVoucher.voucher_name : "",
                  taxAmount: Math.abs(parseFloat(parseFloat(finalData.final_invoice_amount) - parseFloat(finalData.total_invoice_amount)).toFixed(3)),
                  jewelNarration: finalData.jewellery_narration !== null ? finalData.jewellery_narration : "",
                  accNarration: finalData.account_narration !== null ? finalData.account_narration : "",
                  balancePayable: parseFloat(finalData.final_invoice_amount).toFixed(3)
                })

              } else if (loadType === 1 || loadType === 2) {

                setViewState(finalData.TempSalesDomesticOrders[0].igst)

                for (let item of finalData.TempSalesDomesticOrders) {
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
                    wastagePer: parseFloat(item.wastage_per).toFixed(3),
                    wastageFine: item.wastage_fine,
                    otherTagAmount: parseFloat(item.other_tag_amount).toFixed(3),
                    totalFine: parseFloat(item.total_fine).toFixed(3),
                    fineRate: parseFloat(item.fine_rate).toFixed(3),
                    catRatePerGram: parseFloat(item.category_rate).toFixed(3),
                    amount: parseFloat(item.amount).toFixed(3),
                    hallmarkCharges: parseFloat(item.hallmark_charges).toFixed(3),
                    totalAmount: parseFloat(item.total_amount).toFixed(3),
                    cgstPer: item.cgst,
                    cgstVal: item.igst === null ? parseFloat(parseFloat(item.total_amount) * parseFloat(item.cgst) / 100).toFixed(3) : 0,
                    sGstPer: item.sgst,
                    sGstVal: item.igst === null ? parseFloat(parseFloat(item.total_amount) * parseFloat(item.sgst) / 100).toFixed(3) : 0,
                    IGSTper: item.igst,
                    IGSTVal: item.igst !== null ? parseFloat(parseFloat(item.total_amount) * parseFloat(item.igst) / 100).toFixed(3) : 0,
                    igst: item.igst,
                    total: parseFloat(item.total).toFixed(3),
                    errors: {
                      category: null,
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


              } else if (loadType === 3) {
                setViewState(finalData.TempSalesDomesticOrders[0].igst)

                for (let item of finalData.TempSalesDomesticOrders) {

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
                    HSNNum: item.ProductCategory.hsn_master.hsn_number,
                    pieces: item.pcs,
                    grossWeight: parseFloat(item.gross_wt).toFixed(3),
                    netWeight: parseFloat(item.net_wt).toFixed(3),
                    purity: item.purity,
                    wastagePer: parseFloat(item.wastage_per).toFixed(3),
                    wastageFine: item.wastage_fine,
                    otherTagAmount: parseFloat(item.other_tag_amount).toFixed(3),
                    totalFine: parseFloat(item.total_fine).toFixed(3),
                    fineRate: parseFloat(item.fine_rate).toFixed(3),
                    catRatePerGram: parseFloat(item.category_rate).toFixed(3),
                    amount: parseFloat(item.amount).toFixed(3),
                    hallmarkCharges: parseFloat(item.hallmark_charges).toFixed(3),
                    totalAmount: parseFloat(item.total_amount).toFixed(3),
                    cgstPer: item.cgst,
                    cgstVal: item.igst === null ? parseFloat(parseFloat(item.total_amount) * parseFloat(item.cgst) / 100).toFixed(3) : 0,
                    sGstPer: item.sgst,
                    sGstVal: item.igst === null ? parseFloat(parseFloat(item.total_amount) * parseFloat(item.sgst) / 100).toFixed(3) : 0,
                    IGSTper: item.igst,
                    IGSTVal: item.igst !== null ? parseFloat(parseFloat(item.total_amount) * parseFloat(item.igst) / 100).toFixed(3) : 0,
                    igst: item.igst,
                    total: parseFloat(item.total).toFixed(3),
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
              }

              if (loadType === 1 || loadType === 2 || loadType === 3) {
                setFormValues(tempArray);

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

                function netWeight(item) {
                  // console.log(parseFloat(item.netWeight));
                  return parseFloat(item.netWeight);
                }

                function fineGold(item) {
                  return parseFloat(item.totalFine);
                }

                let tempFineGold = tempArray
                  .filter((item) => item.totalFine !== "")
                  .map(fineGold)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

                // function fine(item) {
                //   return parseFloat(item.fine);
                // }

                // let tempFineTot = tempArray
                //   .filter((item) => item.fine !== "")
                //   .map(fine)
                //   .reduce(function (a, b) {
                //     // sum all resulting numbers
                //     return parseFloat(a) + parseFloat(b);
                //   }, 0);

                // setFineTotal(parseFloat(tempFineTot).toFixed(3));

                // setAmount("");
                let tempAmount = tempArray
                  .filter((item) => item.totalAmount !== "")
                  .map(amount)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                //.reduce(sum);
                // console.log("tempAmount>>>", tempAmount.toFixed(3));
                setTotalAmount(parseFloat(tempAmount).toFixed(3));
                setSubTotal(parseFloat(tempAmount).toFixed(3));
                let tempCgstVal = 0;
                let tempSgstVal = 0;
                let tempIgstVal = 0;
                let tempTotal = 0;
                if (tempArray[0].igst == null) {

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

                tempTotal = tempArray
                  .filter((item) => item.total !== "")
                  .map(Total)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setTotal(parseFloat(tempTotal).toFixed(3));
                console.log(tempTotal);

                let tempGrossWtTot = parseFloat(tempArray
                  .filter((data) => data.grossWeight !== "")
                  .map(grossWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3);

                let tempNetWtTot = parseFloat(tempArray
                  .filter((data) => data.netWeight !== "")
                  .map(netWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3);

                setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));
                // setTotalGrossWeight(parseFloat(tempGrossWeight).toFixed(3));

                setPrintObj({
                  ...printObj,
                  loadType: loadType.toString(),
                  is_tds_tcs: mainObj.is_tds_tcs,
                  stateId: clientVendorState,
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
                  sGstTot: clientVendorState === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
                  cGstTot: clientVendorState === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
                  iGstTot: clientVendorState !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
                  roundOff: finalData.round_off === null ? "0" : finalData.round_off,
                  grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
                  netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                  fineWtTot: parseFloat(tempFineGold).toFixed(3),
                  totalInvoiceAmt: parseFloat(finalData.total_invoice_amount).toFixed(3),
                  TDSTCSVoucherNum: finalData.TdsTcsVoucher !== null ? finalData.TdsTcsVoucher.voucher_no : "",
                  ledgerName: finalData.TdsTcsVoucher !== null ? finalData.TdsTcsVoucher.voucher_name : "",
                  taxAmount: Math.abs(parseFloat(parseFloat(finalData.final_invoice_amount) - parseFloat(finalData.total_invoice_amount)).toFixed(3)),
                  jewelNarration: finalData.jewellery_narration !== null ? finalData.jewellery_narration : "",
                  accNarration: finalData.account_narration !== null ? finalData.account_narration : "",
                  balancePayable: parseFloat(finalData.final_invoice_amount).toFixed(3)
                })
                setAdjustedRate(true)

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
  function getSalesDomesticRecordView(id) {
    console.log("inn11")
    setLoading(true);
    let api = ""
    if(props.forDeletedVoucher){
      api = `api/salesDomestic/${id}?deleted_at=1`
    }else {
      api = `api/salesDomestic/${id}`
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
              let finalData = response.data.data.data;
              let loadType = response.data.data.otherDetails.loadType
              setSelectedLoad(loadType.toString())
              var clientVendorState;

              if (finalData.is_vendor_client === 1) {

                setVendorClient({ value: 1, label: "Vendor" })
                var mainObj = finalData.Vendor
                setSelectedVendor({
                  value: finalData.Vendor.id,
                  label: finalData.Vendor.name,
                });
              setPartyVoucherDate(finalData.party_voucher_date)

                setFirmName(finalData.Vendor.firm_name);
                setVendorStateId(finalData.Vendor.state);
                setIs_tds_tcs(finalData.Vendor.is_tds_tcs);
                clientVendorState = finalData.Vendor.state

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
                setVendorStateId(finalData.ClientCompany.state);
                setIs_tds_tcs(finalData.ClientCompany.is_tds_tcs);
                clientVendorState = finalData.ClientCompany.state
              }
              if(finalData.einvoice==1 ) {
              setInvoiceIRN(finalData.GstHeros[0].irn_number)
              setInvoiceDate(finalData.GstHeros[0].ack_date)
              setisgenerate(finalData.GstHeros[0].is_generate)
            }
            setinvoiceflag(finalData.einvoice)
              // console.log(finalData.einvoice == 1 ,"////12032155555");
              console.log(mainObj)
              setDocumentList(finalData.salesPurchaseDocs)
              setSelectedVoucherinfo({
                value: finalData.TempSalesDomestic.id,
                label: finalData.TempSalesDomestic.voucher_no
              })
              setVoucherNumber(finalData.voucher_no);
              setPartyVoucherDate(finalData.party_voucher_date)
              setAllowedBackDate(true);
              setVoucherDate(moment(finalData.purchase_voucher_create_date).format("YYYY-MM-DD"));
              setPartyVoucherNum(finalData.party_voucher_no)
              setStateId(clientVendorState);
              let state = clientVendorState;

              // setIs_tds_tcs(mainObj.is_tds_tcs);

              setOppositeAccSelected({
                value: finalData.opposite_account_id,
                label: finalData.OppositeAccount.name,
              });

              setRoundOff(
                finalData.round_off === null ? "" : finalData.round_off
              );

              setShipping((finalData.is_shipped).toString())

              if (finalData.is_shipped === 1) {
                setShippingClient({
                  value: finalData.shippingClient.id,
                  label: finalData.shippingClient.name
                })

                setShipClientComp({
                  value: finalData.shippingClientCompany.id,
                  label: finalData.shippingClientCompany.company_name
                })
              }

              if (finalData.TdsTcsVoucher !== null) {
                setTdsTcsVou(finalData.TdsTcsVoucher.voucher_no);
                setLedgerName({
                  value: finalData.TdsTcsVoucher.id,
                  label: finalData.TdsTcsVoucher.voucher_name,
                });
              }
              setRateValue(finalData.tds_or_tcs_rate !== null ? finalData.tds_or_tcs_rate : "");

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

              let tempArray = [];


              if (loadType === 0) {

                let tempPackingSlipData = response.data.data.packingSlipData;
                // console.log(tempPackingSlipData)
                let data = HelperFunc.packingSlipViewDataSalesDomestic(tempPackingSlipData, finalData.SalesDomesticOrders[0].fine_rate, state)
                console.log(">>>>>>>>>>>>>>>>>", data)

                setPackingSlipData(data.packingSlipArr);
                setPacketData(data.packetDataArr)
                setProductData(data.ProductDataArr);
                setTagWiseData(data.tagWiseDataArr);
                setBillmaterialData(data.bomDataArr);

                let temp = data.ProductDataArr;

                function amount(item) {
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

                function grossWeight(item) {
                  return parseFloat(item.gross_wgt);
                }
                function netWeight(item) {
                  return parseFloat(item.net_wgt);
                }

                let totalGrossWeightVal = parseFloat(temp
                  .filter((item) => item.gross_wgt !== "")
                  .map(grossWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3);
                setTotalGrossWeight(totalGrossWeightVal);

                let totalNetWeightVal = parseFloat(temp
                  .filter((item) => item.net_wgt !== "")
                  .map(netWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3);
                setTotalNetWeight(totalNetWeightVal);

                let tempAmount = temp
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

                if (state === 12) {
                  tempCgstVal = temp
                    .filter((item) => item.cgstVal !== "")
                    .map(CGSTval)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0);

                  tempSgstVal = temp
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
                    parseFloat(tempAmount) +
                    parseFloat(tempCgstVal) +
                    parseFloat(tempSgstVal)
                  ).toFixed(3);
                } else {

                  tempIgstVal = temp
                    .filter((item) => item.IGSTVal !== "")
                    .map(IGSTVal)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0);

                  setTotalGST(parseFloat(tempIgstVal).toFixed(3));
                  tempTotal = parseFloat(
                    parseFloat(tempAmount) + parseFloat(tempIgstVal)
                  ).toFixed(3);
                }
                console.log(temp)
                setTotal(parseFloat(tempTotal).toFixed(3))
                setTotalAmount(parseFloat(tempAmount).toFixed(3))
                setPrintObj({
                  ...printObj,
                  loadType: loadType.toString(),
                  is_tds_tcs: mainObj.is_tds_tcs,
                  stateId: clientVendorState,
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
                  orderDetails: temp,
                  taxableAmount: parseFloat(tempAmount).toFixed(3),
                  sGstTot: clientVendorState === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
                  cGstTot: clientVendorState === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
                  iGstTot: clientVendorState !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
                  roundOff: finalData.round_off === null ? "0" : finalData.round_off,
                  grossWtTOt: totalGrossWeightVal,
                  netWtTOt: totalNetWeightVal,
                  // fineWtTot: parseFloat(tempFineGold).toFixed(3),
                  totalInvoiceAmt: parseFloat(finalData.total_invoice_amount).toFixed(3),
                  TDSTCSVoucherNum: finalData.TdsTcsVoucher !== null ? finalData.TdsTcsVoucher.voucher_no : "",
                  ledgerName: finalData.TdsTcsVoucher !== null ? finalData.TdsTcsVoucher.voucher_name : "",
                  taxAmount: Math.abs(parseFloat(parseFloat(finalData.final_invoice_amount) - parseFloat(finalData.total_invoice_amount)).toFixed(3)),
                  jewelNarration: finalData.jewellery_narration !== null ? finalData.jewellery_narration : "",
                  accNarration: finalData.account_narration !== null ? finalData.account_narration : "",
                  balancePayable: parseFloat(finalData.final_invoice_amount).toFixed(3)
                })

              } else if (loadType === 1 || loadType === 2) {

                setViewState(finalData.SalesDomesticOrders[0].igst)

                for (let item of finalData.SalesDomesticOrders) {
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
                    grossWeight: parseFloat(item.gross_wt).toFixed(3),
                    netWeight: parseFloat(item.net_wt).toFixed(3),
                    purity: item.purity,
                    wastagePer: parseFloat(item.wastage_per).toFixed(3),
                    wastageFine: item.wastage_fine,
                    otherTagAmount: parseFloat(item.other_tag_amount).toFixed(3),
                    totalFine: parseFloat(item.total_fine).toFixed(3),
                    fineRate: parseFloat(item.fine_rate).toFixed(3),
                    catRatePerGram: parseFloat(item.category_rate).toFixed(3),
                    amount: parseFloat(item.amount).toFixed(3),
                    hallmarkCharges: parseFloat(item.hallmark_charges).toFixed(3),
                    totalAmount: parseFloat(item.total_amount).toFixed(3),
                    cgstPer: item.cgst,
                    cgstVal: item.igst === null ? parseFloat(parseFloat(item.total_amount) * parseFloat(item.cgst) / 100).toFixed(3) : 0,
                    sGstPer: item.sgst,
                    sGstVal: item.igst === null ? parseFloat(parseFloat(item.total_amount) * parseFloat(item.sgst) / 100).toFixed(3) : 0,
                    IGSTper: item.igst,
                    IGSTVal: item.igst !== null ? parseFloat(parseFloat(item.total_amount) * parseFloat(item.igst) / 100).toFixed(3) : 0,
                    igst: item.igst,
                    total: parseFloat(item.total).toFixed(3),
                    errors: {
                      category: null,
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


              } else if (loadType === 3) {
                setViewState(finalData.SalesDomesticOrders[0].igst)

                for (let item of finalData.SalesDomesticOrders) {

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
                    HSNNum: item.ProductCategory.hsn_master.hsn_number,
                    pieces: item.pcs,
                    grossWeight: parseFloat(item.gross_wt).toFixed(3),
                    netWeight: parseFloat(item.net_wt).toFixed(3),
                    purity: item.purity,
                    wastagePer: parseFloat(item.wastage_per).toFixed(3),
                    wastageFine: item.wastage_fine,
                    otherTagAmount: parseFloat(item.other_tag_amount).toFixed(3),
                    totalFine: parseFloat(item.total_fine).toFixed(3),
                    fineRate: parseFloat(item.fine_rate).toFixed(3),
                    catRatePerGram: parseFloat(item.category_rate).toFixed(3),
                    amount: parseFloat(item.amount).toFixed(3),
                    hallmarkCharges: parseFloat(item.hallmark_charges).toFixed(3),
                    totalAmount: parseFloat(item.total_amount).toFixed(3),
                    cgstPer: item.cgst,
                    cgstVal: item.igst === null ? parseFloat(parseFloat(item.total_amount) * parseFloat(item.cgst) / 100).toFixed(3) : 0,
                    sGstPer: item.sgst,
                    sGstVal: item.igst === null ? parseFloat(parseFloat(item.total_amount) * parseFloat(item.sgst) / 100).toFixed(3) : 0,
                    IGSTper: item.igst,
                    IGSTVal: item.igst !== null ? parseFloat(parseFloat(item.total_amount) * parseFloat(item.igst) / 100).toFixed(3) : 0,
                    igst: item.igst,
                    total: parseFloat(item.total).toFixed(3),
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
              }

              if (loadType === 1 || loadType === 2 || loadType === 3) {
                setFormValues(tempArray);

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

                function netWeight(item) {
                  // console.log(parseFloat(item.netWeight));
                  return parseFloat(item.netWeight);
                }

                function fineGold(item) {
                  return parseFloat(item.totalFine);
                }

                let tempFineGold = tempArray
                  .filter((item) => item.totalFine !== "")
                  .map(fineGold)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

                // function fine(item) {
                //   return parseFloat(item.fine);
                // }

                // let tempFineTot = tempArray
                //   .filter((item) => item.fine !== "")
                //   .map(fine)
                //   .reduce(function (a, b) {
                //     // sum all resulting numbers
                //     return parseFloat(a) + parseFloat(b);
                //   }, 0);

                // setFineTotal(parseFloat(tempFineTot).toFixed(3));

                // setAmount("");
                let tempAmount = tempArray
                  .filter((item) => item.totalAmount !== "")
                  .map(amount)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                //.reduce(sum);
                // console.log("tempAmount>>>", tempAmount.toFixed(3));
                setTotalAmount(parseFloat(tempAmount).toFixed(3));
                setSubTotal(parseFloat(tempAmount).toFixed(3));
                let tempCgstVal = 0;
                let tempSgstVal = 0;
                let tempIgstVal = 0;
                let tempTotal = 0;
                if (tempArray[0].igst == null) {

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

                tempTotal = tempArray
                  .filter((item) => item.total !== "")
                  .map(Total)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setTotal(parseFloat(tempTotal).toFixed(3));
                console.log(tempTotal);

                let tempGrossWtTot = parseFloat(tempArray
                  .filter((data) => data.grossWeight !== "")
                  .map(grossWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3);

                let tempNetWtTot = parseFloat(tempArray
                  .filter((data) => data.netWeight !== "")
                  .map(netWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3);

                setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));
                // setTotalGrossWeight(parseFloat(tempGrossWeight).toFixed(3));

                setPrintObj({
                  ...printObj,
                  loadType: loadType.toString(),
                  is_tds_tcs: mainObj.is_tds_tcs,
                  stateId: clientVendorState,
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
                  sGstTot: clientVendorState === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
                  cGstTot: clientVendorState === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
                  iGstTot: clientVendorState !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
                  roundOff: finalData.round_off === null ? "0" : finalData.round_off,
                  grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
                  netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                  fineWtTot: parseFloat(tempFineGold).toFixed(3),
                  totalInvoiceAmt: parseFloat(finalData.total_invoice_amount).toFixed(3),
                  TDSTCSVoucherNum: finalData.TdsTcsVoucher !== null ? finalData.TdsTcsVoucher.voucher_no : "",
                  ledgerName: finalData.TdsTcsVoucher !== null ? finalData.TdsTcsVoucher.voucher_name : "",
                  taxAmount: Math.abs(parseFloat(parseFloat(finalData.final_invoice_amount) - parseFloat(finalData.total_invoice_amount)).toFixed(3)),
                  jewelNarration: finalData.jewellery_narration !== null ? finalData.jewellery_narration : "",
                  accNarration: finalData.account_narration !== null ? finalData.account_narration : "",
                  balancePayable: parseFloat(finalData.final_invoice_amount).toFixed(3)
                })
                setAdjustedRate(true)

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

  function getHallmarkCharges() {
    axios
      .get(Config.getCommonUrl() + "api/goldRateToday/hallmarkcharges")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // setLedgerMainData(response.data.data);
          setHMCharges(response.data.data.per_piece_charges);

        } else {
          dispatch(
            Actions.showMessage({
              message: "Today's Gold Rate is not set",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/goldRateToday/hallmarkcharges" })
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
      .get(Config.getCommonUrl() + "api/salesDomestic/get/voucher")
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
        handleError(error, dispatch, { api: "api/salesDomestic/get/voucher" })
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

  function handleFormSubmit(ev) {
    ev.preventDefault();
    setInvoiceOpen(false);
    // resetForm();
    console.log("handleFormSubmit", formValues);
    if (
      checkInfoVoucherSelected() &&
      loadTypeValidation() &&
      handleDateBlur()&&
      voucherNumValidation() &&
      partyNameValidation() &&
      oppositeAcValidation() &&
      shippingValidation() &&
      ledgerNameValidate()
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (selectedLoad === "0") {
        // if (uploadTypeValidation()) {
        if (shipping === "1") {
          if (shippingClientValidation() && shippingCompValidation()) {
            // addJewellaryPuchaseApi();
            createFromPackingSlip(true, false);
          }
        } else {
          // addJewellaryPuchaseApi();
          createFromPackingSlip(true, false);
        }
        // }
      } else {
        //selectedLoad 1 ,2 , 3
        if (shipping === "1") {
          if (shippingClientValidation() && shippingCompValidation()) {
            //check prev valid
            if (prevIsValid()) {
              addUserInputApi(true, false);
            }
          }
        } else {
          if (prevIsValid()) {
            addUserInputApi(true, false);
          }
        }
      }
    } else {
      console.log("else");
    }
  }

  function handleLoadChange(event) {
    setSelectedLoad(event.target.value);
    setSelectedLoadErr("");
    setPackingSlipData([]); //packing slip wise
    setPacketData([]); //packet wise Data
    setProductData([]); //category wise Data
    setBillmaterialData([]); //bill of material Data
    setTagWiseData([]);
    setSelectedClient("")
    setSelectedCompany("")
    setSelectedVendor("")
    // setClientCompanies([]);
    // setSelectedClient("");
    // setSelectedCompany("");
    // setIsVoucherSelected(false);
    // setSelectedVoucher("");
    // setVoucherApiData([]);
    setPrintObj({
      ...printObj,
      loadType: event.target.value,
      voucherDate: moment().format("DD-MM-YYYY"),
      stateId: "",
      supplierName: "",
      supAddress: "",
      supplierGstUinNum: "",
      supPanNum: "",
      supState: "",
      supCountry: "",
      supStateCode: "",
      partyInvNum: "",
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
      is_tds_tcs: ""
    })

    reset();
  }

  function reset() {
    setPackingSlipErr("");
    setVoucherDate(moment().format("YYYY-MM-DD"));
    setOppositeAccSelected("");
    if (document.getElementById("fileinput") !== null) {
      document.getElementById("fileinput").value = "";
    }
    // setSelectedClient("");
    setFirmName("");
    setSubTotal("");
    setTotalGST("");
    setSgstVal("");
    // setCsvData([]);
    // setIsCsvErr(false);
    setSelectedIndex(-1);
    // setSelectedWeightStock("");
    // setPieces("");
    // setWeight("");
    setLedgerAmtErr("");
    setTdsTcsVouErr("");
    setSelectedRateFixErr("");
    setPartyVoucherNum("");
    setRoundOff("");
    setTotalInvoiceAmount("");
    setTdsTcsVou("");
    setLedgerName("");
    setRateValue(0);
    setLegderAmount(0);
    setFinalAmount("");
    setAccNarration("");
    setJewelNarration("");
    setAdjustedRate(false);
    setStateId("");
    setBalanceRfixData("");
    setBalRfixViewData([]);
    // setCanEnterVal(false);
    setShortageRfix("");
    setTempRate("");
    setAvgeRate("");
    setTempApiWeight("");
    setTotalGrossWeight("");
    setFineGoldTotal("");
    // setFineTotal("");
    // setTagAmountAftTot("");
    // setTagAmountBefTot("");
    setAmount("");
    // setHallmarkCharges("");
    setTotalAmount("");
    setIgstVal("");
    setTotal("");
    // setFileSelected("");
    // setIsuploaded(false);

    setFormValues([
      {
        manuallLot: "0",
        HSNNum: "",
        lotno: "",
        category: "",
        billingCategory: "",
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
        wastagePer: "",
        wastageFine: "",
        otherTagAmount: "",
        totalFine: "",
        fineRate: "",
        catRatePerGram: "",
        amount: "",
        hallmarkCharges: "",
        totalAmount: "",
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
          HSNNum: null,
          lotNumber: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobworkFineUtilize: null,
          wastagePer: null,
          wastageFine: null,
          fineRate: null,
          labourFineAmount: null,
          otherTagAmount: null,
          catRatePerGram: null,
          amount: null,
          hallmarkCharges: null,
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
        manuallLot: "0",
        lotno: "",
        category: "",
        billingCategory: "",
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
        wastagePer: "",
        wastageFine: "",
        otherTagAmount: "",
        totalFine: "",
        fineRate: "",
        catRatePerGram: "",
        amount: "",
        hallmarkCharges: "",
        totalAmount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        HSNNum: "",
        errors: {

          category: null,
          billingCategory: null,
          HSNNum: null,
          lotNumber: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobworkFineUtilize: null,
          wastagePer: null,
          wastageFine: null,
          fineRate: null,
          labourFineAmount: null,
          otherTagAmount: null,
          catRatePerGram: null,
          amount: null,
          hallmarkCharges: null,
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
        manuallLot: "0",
        lotno: "",
        category: "",
        billingCategory: "",
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
        wastagePer: "",
        wastageFine: "",
        otherTagAmount: "",
        totalFine: "",
        fineRate: "",
        catRatePerGram: "",
        amount: "",
        hallmarkCharges: "",
        totalAmount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        HSNNum: "",
        errors: {
          category: null,
          billingCategory: null,
          HSNNum: null,
          lotNumber: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobworkFineUtilize: null,
          wastagePer: null,
          wastageFine: null,
          fineRate: null,
          labourFineAmount: null,
          otherTagAmount: null,
          catRatePerGram: null,
          amount: null,
          hallmarkCharges: null,
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
        manuallLot: "0",
        lotno: "",
        category: "",
        billingCategory: "",
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
        wastagePer: "",
        wastageFine: "",
        otherTagAmount: "",
        totalFine: "",
        fineRate: "",
        catRatePerGram: "",
        amount: "",
        hallmarkCharges: "",
        totalAmount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        HSNNum: "",
        errors: {
          category: null,
          billingCategory: null,
          HSNNum: null,
          lotNumber: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobworkFineUtilize: null,
          wastagePer: null,
          wastageFine: null,
          fineRate: null,
          labourFineAmount: null,
          otherTagAmount: null,
          catRatePerGram: null,
          amount: null,
          hallmarkCharges: null,
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

  function handleOppAccChange(value) {
    setOppositeAccSelected(value);
    setSelectedOppAccErr("");
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
  function handleClose() {
    // setSelectedIdForDelete("");
    setInvoiceOpen(false);
    setInvoiceOpensave(false);
  }
  function handleClientPartyChange(value) {
    if (loadTypeValidation()) {
      setSelectedVendorErr("")
      setSelectedClient(value);
      setSelectClientErr("");
      setSelectedCompany("");
      setSelectedCompErr("");
      setPackingSlipData([]); //packing slip wise
      setPacketData([]); //packet wise Data
      setProductData([]); //category wise Data
      setBillmaterialData([]); //bill of material Data
      setTagWiseData([]);
      setTagWiseData([]);
      setPackingSlipNo("");
      setTotalInvoiceAmount(0);
      setLedgerName("");
      setLedgerNmErr("");
      setLedgerData([]);
      setRateValue(0);
      setRateValErr("");
      setLegderAmount(0);
      setLedgerAmtErr("");
      setFinalAmount("");
      setTdsTcsVou("");
      reset();

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

  function getTdsTcsVoucherNum(ledgerMasterId) {
    axios
      .get(
        Config.getCommonUrl() +
        `api/salesDomestic/get/voucher/${ledgerMasterId}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          if (selectedVendorClient.value === 1) {
            var index = vendorData.findIndex((element) => element.id === selectedVendor.value);
            console.log(index);
            var clientVendor = vendorData[index]
          }
          // } else {
          //   var index = clientFirmData.findIndex((element) => element.id === selectedClientFirm.value);
          //   console.log(index);
          //   var clientVendor = clientFirmData[index]
          // }
          console.log(clientVendor)
          console.log(response);
          if (Object.keys(response.data.data).length !== 0) {
            setTdsTcsVou(response.data.data.voucherNo);

          } else {
            setTdsTcsVou("");

          }
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: `api/salesDomestic/get/voucher/${ledgerMasterId}` })

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
        handleError(error, dispatch, { api: `api/ratefix/vendor/balance/1/${vendorId}` })
      });
  }

  function getFixedRateofWeightClient(clientCompId) {
    axios
      .get(Config.getCommonUrl() + `api/ratefix/vendor/balance/2/${clientCompId}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setBalanceRfixData(response.data.data);
          setTempApiWeight(response.data.data.totalWeight);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: `api/ratefix/vendor/balance/2/${clientCompId}` })
      });
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
    setPackingSlipData([]); //packing slip wise
    setPacketData([]); //packet wise Data
    setProductData([]); //category wise Data
    setBillmaterialData([]); //bill of material Data
    setTagWiseData([]);
    setTagWiseData([]);
    setPackingSlipNo("");
    setTotalInvoiceAmount(0);
    setLedgerName("");
    setLedgerNmErr("");
    setLedgerData([]);
    setRateValue(0);
    setRateValErr("");
    setLegderAmount(0);
    setLedgerAmtErr("");
    setFinalAmount("");
    setTdsTcsVou("");
    reset();
    // getVouchers(selectedClient.value, value.value);
    getFixedRateofWeightClient(value.value);

    let findIndex = clientCompanies.findIndex(
      (item) => item.id === value.value
    );

    if (findIndex > -1) {
      setFirmName(clientCompanies[findIndex].company_name);
      setAddress(clientCompanies[findIndex].address);
      setSupplierGstUinNum(clientCompanies[findIndex].gst_number);
      setSupPanNum(clientCompanies[findIndex].pan_number);
      setSupState(clientCompanies[findIndex].StateName.name);
      setSupCountry(clientCompanies[findIndex].CountryName.name)
      setStateId(clientCompanies[findIndex].state); //setting from selected company
      setIs_tds_tcs(clientCompanies[findIndex].is_tds_tcs);

      setPrintObj({
        ...printObj,
        is_tds_tcs: clientCompanies[findIndex].is_tds_tcs,
        stateId: clientCompanies[findIndex].state,
        supplierName: clientCompanies[findIndex].company_name,
        supAddress: clientCompanies[findIndex].address,
        supplierGstUinNum: clientCompanies[findIndex].gst_number,
        supPanNum: clientCompanies[findIndex].pan_number,
        supState: clientCompanies[findIndex].StateName.name,
        supCountry: clientCompanies[findIndex].CountryName.name,
        supStateCode: (clientCompanies[findIndex].gst_number) ? clientCompanies[findIndex].gst_number.substring(0, 2) : '',
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
        TDSTCSVoucherNum: "",
        ledgerName: "",
        taxAmount: "",
        metNarration: "",
        accNarration: "",
        balancePayable: ""
      })

      if (
        clientCompanies[findIndex].is_tds_tcs != 0
      ) {
        getLedger(clientCompanies[findIndex].is_tds_tcs)
      } else {
        setTdsTcsVou("");
        setLedgerName("");
        setLedgerData([])
        setRateValue(0);

      }
      setLegderAmount(0); //everything is goinf to reset so 0
    }
  }

  function handleRfModalClose() {
    setRfModalOpen(false);
  }

  function handleShippingChange(event) {
    setShipping(event.target.value);
    setShippingErr("");
    setShippingClient("");
    setShipClientErr("");
  }

  function handleShipClientSelect(value) {
    setShippingClient(value);
    setShipClientErr("");

    let findIndex = clientdata.findIndex((item) => item.id === value.value);
    if (findIndex > -1) {
      getClientCompanies(value.value, function (response) {
        console.log(response);
        if (response !== null) {
          setShipclientCompData(response);
        } else {
          setShipclientCompData([]);
        }
      });
    }

    setShipClientComp("");
    setShipCompErr("");
  }

  function handleShipCompanyChange(value) {
    setShipClientComp(value);
    setShipCompErr("");
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

  function checkInfoVoucherSelected() {
    if (selectedVoucherinfo === "") {
      setSelectedVoucherinfoErr("Select Voucher");
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

  function voucherNumValidation() {
    // var Regex = /^[a-zA-Z\s]*$/;
    // if (!voucherNumber || Regex.test(voucherNumber) === false) {
    if (voucherNumber === "") {
      setVoucherNumErr("Enter Valid Voucher Number");
      return false;
    }
    return true;
  }

  // function partyVoucherNumValidation() {
  //   // const Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
  //   if (partyVoucherNum === "") {
  //     setPartyVoucherNumErr("Enter Valid Voucher Number");
  //     return false;
  //   }
  //   return true;
  // }

  function clientCompValidation() {
    if (selectedCompany === "") {
      setSelectedCompErr("Please Select Firm");
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

  function shippingClientValidation() {
    if (shipping === "1") {
      if (shippingClient === "") {
        setShipClientErr("Please Select Shipping Party");
        return false;
      }
    }
    return true;
  }

  function shippingCompValidation() {

    if (shipping === "1") {
      if (shipClientComp === "") {
        setShipCompErr("Please Select Valid Client Company");
        return false;
      }
    }
    return true;
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
          (finalRate + (parseFloat(tempRate) * parseFloat(tempShortageRfix))) /
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
            parseFloat(parseFloat(tempApiWeight) - parseFloat(totUtilise)).toFixed(3)
          );
        } else {
          //utilize is less than rate fix total from api
          setShortageRfix(
            parseFloat(parseFloat(fineGoldTotal) - parseFloat(totUtilise)).toFixed(3)
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
    tempArray[index].utiliseErr = ""

    if (isNaN(val)) {
      // setUtiliseErr("please Enter Valid Utilize");
      tempArray[index].utiliseErr = "please Enter Valid Utilize"
      setBalRfixViewData(tempArray);
      return;
    }
    if (parseFloat(val) > parseFloat(tempArray[index].weight)) {
      // setUtiliseErr("Utilize cannot be Greater than Fine");
      tempArray[index].utiliseErr = "Utilize cannot be Greater than Fine"
      setBalRfixViewData(tempArray);
      return;
    }

    if (val === "") {
      tempArray[index].balance = parseFloat(tempArray[index].weight).toFixed(3);
    } else {
      tempArray[index].balance = parseFloat(parseFloat(tempArray[index].weight) - parseFloat(val)).toFixed(3);
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
        (finalRate + (parseFloat(tempRate) * parseFloat(tempShortageRfix))) /
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
      
      if(fineGoldTotal != 0 && finalRate !=0 && fineGoldTotal!=="NaN" && finalRate !=="NaN" ){

        setAvgeRate(parseFloat(finalRate / fineGoldTotal).toFixed(3));
        setNewRate(parseFloat(finalRate / fineGoldTotal).toFixed(3));
        }else{
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
          parseFloat(parseFloat(tempApiWeight) - parseFloat(totUtilise)).toFixed(3)
        );
      } else {
        //utilize is less than rate fix total from api
        setShortageRfix(
          parseFloat(parseFloat(fineGoldTotal) - parseFloat(totUtilise)).toFixed(3)
        );
      }

      setUtiliseTotal(parseFloat(totUtilise).toFixed(3));
    }

    setShortageRfixErr("");
    setTempRateErr("");
    setBalRfixViewData(tempArray);
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
      setAvgeRateErr("")
      setShortageRfixErr("")
      // totalGrossWeight
      // let totalRateOfWeight = 0;
      // value > 0 && 
      if (value !== "" && !isNaN(value) && shortageRfix !== "0.000" && shortageRfix !== "") {

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
          (finalRate + (parseFloat(value) * parseFloat(tempShortageRfix))) /
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

  const adjustRateFix = (evt) => {
    evt.preventDefault();

    let utiliseErr = balRfixViewData
      .filter((element) => element.utiliseErr !== "")
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

    console.log("valid");

    setRfModalOpen(false);
    setAdjustedRate(true);

    if (selectedLoad === "0") {
      setFineRateForPackingSlip();
    } else {
      if (
        selectedLoad === "1" ||
        selectedLoad === "2" ||
        selectedLoad === "3"
      ) {
        calculateAfterRate();
      }
    }

  };

  function setFineRateForPackingSlip() {

    let newTemp = packingSlipData.map((item) => {
      return {
        ...item,
        fineRate: parseFloat(newRate).toFixed(3),
        amount: parseFloat(
          (parseFloat(newRate) * parseFloat(item.totalFine)) / 10 +
          parseFloat(item.other_amt)
        ).toFixed(3),
        totalAmount: parseFloat(
          (parseFloat(newRate) * parseFloat(item.totalFine)) / 10 +
          parseFloat(item.other_amt) +
          parseFloat(item.hallmark_charges_pcs)
        ).toFixed(3),
      };
    });

    setPackingSlipData(newTemp); //packing slip wise
    // console.log(newTemp);

    const newTempPacketData = packetData.map((item) => {
      return {
        ...item,
        fineRate: parseFloat(newRate).toFixed(3),
        amount: parseFloat(
          (parseFloat(newRate) * parseFloat(item.totalFine)) / 10 +
          parseFloat(item.other_amt)
        ).toFixed(3),
        totalAmount: parseFloat(
          (parseFloat(newRate) * parseFloat(item.totalFine)) / 10 +
          parseFloat(item.other_amt) +
          parseFloat(item.hallmark_charges)
        ).toFixed(3),
      };
    });

    setPacketData(newTempPacketData);

    const newTempProductData = productData.map((item) => {
      let amount = parseFloat(
        (parseFloat(newRate) * parseFloat(item.totalFine)) / 10 +
        parseFloat(item.other_amt)
      ).toFixed(3);

      let totalAmount = parseFloat(
        parseFloat(amount) + parseFloat(item.hallmark_charges)
      ).toFixed(3);

      return {
        ...item,
        fineRate: parseFloat(newRate).toFixed(3),
        catRate: parseFloat(
          (((parseFloat(newRate) * parseFloat(item.totalFine)) / 10 +
            parseFloat(item.other_amt)) /
            parseFloat(item.net_wgt)) *
          10
        ).toFixed(3),
        amount: parseFloat(amount).toFixed(3),
        totalAmount: parseFloat(totalAmount).toFixed(3),
        IGSTVal:
          stateId !== 12
            ? parseFloat(
              (parseFloat(totalAmount) * parseFloat(item.IGSTper)) / 100
            ).toFixed(3)
            : "",
        cgstVal:
          stateId === 12
            ? parseFloat(
              (parseFloat(totalAmount) * parseFloat(item.cgstPer)) / 100
            ).toFixed(3)
            : "",
        sGstVal:
          stateId === 12
            ? parseFloat(
              (parseFloat(totalAmount) * parseFloat(item.sGstPer)) / 100
            ).toFixed(3)
            : "",
      };
    });
    // catRate = amount / netWeight *10
    setProductData(newTempProductData);

    const tempTagWise = tagWiseData.map((item) => {
      return {
        ...item,
        fineRate: parseFloat(newRate).toFixed(3),
        amount: parseFloat(
          (parseFloat(newRate) * parseFloat(item.totalFine)) / 10 +
          parseFloat(item.other_amt)
        ).toFixed(3),
        totalAmount: parseFloat(
          (parseFloat(newRate) * parseFloat(item.totalFine)) / 10 +
          parseFloat(item.other_amt) +
          parseFloat(item.hallmark_charges)
        ).toFixed(3),
      };
    });

    setTagWiseData(tempTagWise);
    // // console.log(tempTagWise)

    const tempBillMaterial = billMaterialData.map((item) => {
      return {
        ...item,
        // metal_wgt:
        //   parseFloat(item.gross_wgt) -
        //   (parseFloat(item.stone_wgt) +
        //     parseFloat(item.beads_wgt) +
        //     parseFloat(item.silver_wgt) +
        //     parseFloat(item.sol_wgt) +
        //     parseFloat(item.other_wgt)),
        metal_amt: parseFloat(
          ((parseFloat(item.metal_wgt) * parseFloat(item.purity)) / 100 +
            parseFloat(item.wastageFine)) *
          (parseFloat(newRate) / 10)
        ).toFixed(3),
        // fineRate: parseFloat(newRate).toFixed(3),
        // amount: "",
        // hallmark_charges: newTemp.hallmark_charges,
        totalAmount: parseFloat(
          ((parseFloat(item.metal_wgt) * parseFloat(item.purity)) / 100 +
            parseFloat(item.wastageFine)) *
          (parseFloat(newRate) / 10) +
          (parseFloat(item.stone_amt) +
            parseFloat(item.beads_amt) +
            parseFloat(item.silver_amt) +
            parseFloat(item.sol_amt) +
            parseFloat(item.other_amt) +
            parseFloat(item.hallmark_charges))
        ).toFixed(3),
      };
    });

    setBillmaterialData(tempBillMaterial);

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

    // function Total(item) {
    //   return item.total;
    // }

    // cgstPer:
    //             stateId === 12
    //               ? parseFloat(parseFloat(item.hsn_number.gst) / 2).toFixed(3)
    //               : "",
    //           cgstVal: "",
    //           sGstPer:
    //             stateId === 12
    //               ? parseFloat(parseFloat(item.hsn_number.gst) / 2).toFixed(3)
    //               : "",
    //           sGstVal: "",
    //           IGSTper:
    //             stateId === 12
    //               ? parseFloat(item.hsn_number.gst).toFixed(3)
    //               : "",
    //           IGSTVal: "",

    let tempAmount = newTempProductData
      .filter((item) => item.totalAmount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setSubTotal(parseFloat(tempAmount).toFixed(3));

    function grossWeight(item) {
      return parseFloat(item.gross_wgt);
    }
    function netWeight(item) {
      return parseFloat(item.net_wgt);
    }

    let tempGrossWtTot = parseFloat(newTempProductData
      .filter((item) => item.gross_wgt !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);
    setTotalGrossWeight(tempGrossWtTot);

    let tempNetWtTot = parseFloat(newTempProductData
      .filter((item) => item.net_wgt !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);
    setTotalNetWeight(tempNetWtTot);

    //tempTotal is amount + gst
    let tempTotal = 0;
    let tempIgstVal = 0;
    let tempCgstVal = 0;
    let tempSgstVal = 0;

    if (stateId === 12) {
      tempCgstVal = newTempProductData
        .filter((item) => item.cgstVal !== "")
        .map(CGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
      // setCgstVal(parseFloat(tempCgstVal).toFixed(3));

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
        parseFloat(tempAmount) +
        parseFloat(tempCgstVal) +
        parseFloat(tempSgstVal)
      ).toFixed(3);
    } else {

      tempIgstVal = newTempProductData
        .filter((item) => item.IGSTVal !== "")
        .map(IGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);

      setTotalGST(parseFloat(tempIgstVal).toFixed(3));
      tempTotal = parseFloat(
        parseFloat(tempAmount) + parseFloat(tempIgstVal)
      ).toFixed(3);
    }

    setTotal(parseFloat(tempTotal).toFixed(3))
    setTotalAmount(parseFloat(tempAmount).toFixed(3))

    let tempLedgerAmount = 0;
    let tempfinalAmount = 0;
    let tempTotalInvoiceAmt = 0;

    if (parseFloat(tempTotal) > 0) {
      // let temptdsTcsAmount =0;

      if (parseFloat(roundOff) <= 5 && parseFloat(roundOff) >= -5) {
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
        console.log(tempLedgerAmount);

        tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)).toFixed(3);
        console.log(tempfinalAmount);
      } else if (is_tds_tcs == 2) {
        //tds
        console.log("2");
        tempLedgerAmount = parseFloat(
          (parseFloat(tempAmount) * rateValue) / 100
        ).toFixed(3); //calculating before gst, on total amount only
        console.log(tempLedgerAmount);
        tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount)).toFixed(3);
      } else {
        console.log("else");
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
      orderDetails: newTempProductData,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCgstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      // fineWtTot: parseFloat(tempFineGold).toFixed(3),
      totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
      taxAmount: parseFloat(tempLedgerAmount).toFixed(3),
      balancePayable: parseFloat(tempfinalAmount).toFixed(3),
      TDSTCSVoucherNum: tdsTcsVou,
      ledgerName: ledgerName.label,
    })
  }

  function calculateAfterRate() {
    formValues
      .filter((element) =>
        selectedLoad === "3" ? element.lotno !== "" : element.category !== ""
      )
      .map((item, i) => {
        let newFormValues = [...formValues];

        // let nm = e.target.name;
        // let val = e.target.value;

        if (
          selectedLoad === "3"
            ? newFormValues[i].lotno !== ""
            : newFormValues[i].category !== ""
        ) {
          //if grossWeight or putity change
          // if (nm === "grossWeight") {
          if (
            newFormValues[i].netWeight !== "" &&
            newFormValues[i].purity !== ""
          ) {
            if (newFormValues[i].wastagePer !== "") {
              newFormValues[i].wastageFine = parseFloat(
                (parseFloat(newFormValues[i].netWeight) *
                  parseFloat(newFormValues[i].wastagePer)) /
                100
              ).toFixed(3);

              // newFormValues[i].fine = (
              //   (parseFloat(newFormValues[i].netWeight) *
              //     parseFloat(newFormValues[i].purity)) /
              //     100 +
              //   (parseFloat(newFormValues[i].netWeight) *
              //     parseFloat(newFormValues[i].wastagePer)) /
              //     100
              // ).toFixed(3);

              newFormValues[i].totalFine = parseFloat(
                (parseFloat(newFormValues[i].netWeight) *
                  parseFloat(newFormValues[i].purity)) /
                100 +
                parseFloat(newFormValues[i].wastageFine)
              ).toFixed(3);

              // newFormValues[i].fine = (
              //   (parseFloat(newFormValues[i].netWeight) *
              //     parseFloat(newFormValues[i].purity)) /
              //     100 +
              //   (parseFloat(newFormValues[i].netWeight) *
              //     parseFloat(newFormValues[i].wastagePer)) /
              //     100
              // ).toFixed(3);
            } else {
              newFormValues[i].totalFine = parseFloat(
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
            parseFloat(newFormValues[i].grossWeight) !== parseFloat(newFormValues[i].netWeight) + parseFloat(tempSetWeight)
          ) {
            newFormValues[i].isWeightDiff = 0;
          } else {
            newFormValues[i].isWeightDiff = 1;
          }
          // }
          // console.log("newRate",newRate)
          if (newRate !== "" && !isNaN(newRate)) {
            newFormValues[i].fineRate = parseFloat(newRate).toFixed(3);
          }

          if (HMCharges !== "" && newFormValues[i].pieces !== "") {
            newFormValues[i].hallmarkCharges = parseFloat(parseFloat(HMCharges) * parseFloat(newFormValues[i].pieces)).toFixed(3);
          }

          if (
            newFormValues[i].totalFine !== "" &&
            newFormValues[i].fineRate !== ""
          ) {
            // console.log("totalFine", newFormValues[i].totalFine, "fineRate", newFormValues[i].fineRate);

            if (newFormValues[i].otherTagAmount !== "") {
              newFormValues[i].amount = parseFloat(
                (parseFloat(newFormValues[i].totalFine) *
                  parseFloat(newFormValues[i].fineRate)) /
                10 +
                parseFloat(newFormValues[i].otherTagAmount)
              ).toFixed(3);
              newFormValues[i].totalAmount = newFormValues[i].amount; //without hallmark charges
            } else {
              newFormValues[i].amount = parseFloat(
                (parseFloat(newFormValues[i].totalFine) *
                  parseFloat(newFormValues[i].fineRate)) /
                10
              ).toFixed(3);
              newFormValues[i].totalAmount = newFormValues[i].amount; //without hallmark charges
            }
          }
          // console.log("amount", newFormValues[i].amount);

          if (
            newFormValues[i].amount !== "" &&
            newFormValues[i].netWeight !== ""
          ) {
            newFormValues[i].catRatePerGram = parseFloat(
              (parseFloat(newFormValues[i].amount) /
                parseFloat(newFormValues[i].netWeight)) *
              10
            ).toFixed(3);
          }

          if (
            newFormValues[i].amount !== "" &&
            newFormValues[i].hallmarkCharges !== ""
          ) {
            //with hallmark charges
            newFormValues[i].totalAmount = parseFloat(
              parseFloat(newFormValues[i].amount) +
              parseFloat(newFormValues[i].hallmarkCharges)
            ).toFixed(3);
          }

          if (stateId === 12) {
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
              // console.log("CGSTval ",(newFormValues[i].amount * newFormValues[i].CGSTPer) / 100)

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

          function fineGold(item) {
            return parseFloat(item.totalFine);
          }

          let tempFineGold = newFormValues
            .filter((item) => item.totalFine !== "")
            .map(fineGold)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);
          setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
          // function fine(item) {
          //   return parseFloat(item.fine);
          // }

          // let tempFineTot = formValues
          //   .filter((item) => item.fine !== "")
          //   .map(fine)
          //   .reduce(function (a, b) {
          //     // sum all resulting numbers
          //     return parseFloat(a) + parseFloat(b);
          //   }, 0);

          // setFineTotal(parseFloat(tempFineTot).toFixed(3));
          // console.log(formValues.map(amount).reduce(sum))
          // setAmount("");
          let tempAmount = newFormValues
            .filter((item) => item.totalAmount !== "")
            .map(amount)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);
          //.reduce(sum);
          console.log("tempAmount>>>", tempAmount.toFixed(3));
          setTotalAmount(parseFloat(tempAmount).toFixed(3));
          setSubTotal(parseFloat(tempAmount).toFixed(3));

          let tempCgstVal = 0;
          let tempSgstVal = 0;
          let tempIgstVal = 0;

          if (stateId === 12) {

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
          console.log(tempTotal);

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

          let tempLedgerAmount = 0;
          let tempfinalAmount = 0;
          let tempTotalInvoiceAmt = 0;

          if (parseFloat(tempTotal) > 0) {
            // let temptdsTcsAmount =0;

            if (parseFloat(roundOff) <= 5 && parseFloat(roundOff) >= -5) {
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
              console.log(tempLedgerAmount);

              tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)).toFixed(3);
              console.log(tempfinalAmount);
            } else if (is_tds_tcs == 2) {
              //tds
              console.log("2");
              tempLedgerAmount = parseFloat(
                (parseFloat(tempAmount) * rateValue) / 100
              ).toFixed(3); //calculating before gst, on total amount only
              console.log(tempLedgerAmount);
              tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount)).toFixed(3);
            } else {
              console.log("else");
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
            taxableAmount: parseFloat(tempAmount).toFixed(3),
            sGstTot: parseFloat(tempSgstVal).toFixed(3),
            cGstTot: parseFloat(tempCgstVal).toFixed(3),
            iGstTot: parseFloat(tempIgstVal).toFixed(3),
            grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
            netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
            fineWtTot: parseFloat(tempFineGold).toFixed(3),
            totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
            taxAmount: parseFloat(tempLedgerAmount).toFixed(3),
            balancePayable: parseFloat(tempfinalAmount).toFixed(3),
            TDSTCSVoucherNum: tdsTcsVou,
            ledgerName: ledgerName.label,
          })

          setFormValues(newFormValues);
        }
        return true;
      });
  }
  

  function handleRateFixChange() {
    // setRateFixSelected(value);
    if (partyNameValidation() && prevIsValid()) {
      setSelectedRateFixErr("");

      setRfModalOpen(true);

      if (adjustedRate === false) {
        if (selectedLoad === "0") {
          console.log("if", fineGoldTotal);
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

  function setFileRfixData(fileWeight) {
    //file data
    if (balanceRfixData !== "") {
      function sum(prev, next) {
        return prev + next;
      }

      function usedTotWeight(item) {
        return parseFloat(item.usedWeight);
      }

      // function fineGold(item) {
      //   return parseFloat(item.fineGold);
      // }
      console.log(fileWeight);
      // let FinalWeight = 0;//user input total weight
      let FinalWeight = fileWeight;
      setNewRate("")
      setTempRate("");
      setAvgeRate("");
      // if (FinalWeight === 0) {
      //   return;
      // }

      setShortageRfix(FinalWeight);
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
          utiliseErr: ""
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
        setShortageRfix("")
      }
      // setCanEnterVal(true);
    }
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

      // function fineGold(item) {
      //   return parseFloat(item.fineGold);
      // }
      setAvgeRateErr("")
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
          utiliseErr: ""
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

      let tempShortageRfix = parseFloat(parseFloat(fineGoldTotal) - parseFloat(totUtilise)).toFixed(3);

      if (!isNaN(tempShortageRfix)) {
        setShortageRfix(parseFloat(tempShortageRfix).toFixed(3));

      } else {
        setShortageRfix("");
      }

      let tTempRate = tempRate;
      if (tempShortageRfix === "0.000") {
        setTempRate("")
        tTempRate = 0;
      }
      setBalRfixViewData(displayArray);


      if (finalRate === 0) {
        console.log("if", tempRate, fineGoldTotal, tempShortageRfix)

        let avRate =
          (finalRate + (parseFloat(tempRate) * parseFloat(tempShortageRfix))) /
          parseFloat(fineGoldTotal)

        if (!isNaN(avRate)) {
          setAvgeRate(
            parseFloat(avRate).toFixed(3)
          );
          setNewRate(
            parseFloat(avRate).toFixed(3)
          );
        } else {
          setAvgeRate("");
          setNewRate("");
        }

      } else {
        console.log("else")
        if (parseFloat(fineGoldTotal) > tempApiWeight) {
          console.log("if")
          setAvgeRate(
            parseFloat(parseFloat(finalRate) + parseFloat(tempRate) / parseFloat(fineGoldTotal)).toFixed(3)
          );
          setNewRate(
            parseFloat(parseFloat(finalRate) + parseFloat(tempRate) / parseFloat(fineGoldTotal)).toFixed(3)
          );
        } else {
          console.log("else")
          let avRate =
            (finalRate + (parseFloat(tTempRate) * parseFloat(tempShortageRfix))) /
            parseFloat(fineGoldTotal);
          if (!isNaN(avRate)) {
            setAvgeRate(
              parseFloat(avRate).toFixed(3)
            );
            setNewRate(
              parseFloat(avRate).toFixed(3)
            );
          } else {
            setAvgeRate("");
            setNewRate("");
          }
        }
      }
    }
  }

  let handleLotNumChange = (i, e) => {
    console.log(e);
    let newFormValues = [...formValues];

    let findIndex = lotdata.findIndex((item) => item.number === e);

    if (findIndex > -1) {
      console.log(lotdata[findIndex])
      newFormValues[i].manuallLot = "1";
      newFormValues[i].lotno = {
        value: lotdata[findIndex].id,
        label: lotdata[findIndex].number,
      };
      newFormValues[i].errors.lotno = null;
      newFormValues[i].purity = lotdata[findIndex].purity;
      newFormValues[i].grossWeight = parseFloat(lotdata[findIndex].total_gross_wgt).toFixed(3);
      newFormValues[i].billingCategory = {
        value: lotdata[findIndex].LotProductCategory.id,
        label: lotdata[findIndex].LotProductCategory.category_name,
      };
      newFormValues[i].pieces = lotdata[findIndex].pcs;
      newFormValues[i].HSNNum =
        lotdata[findIndex].LotProductCategory.hsn_master.hsn_number;
      newFormValues[i].netWeight = parseFloat(lotdata[findIndex].total_net_wgt).toFixed(3);
      newFormValues[i].rate = "";
      newFormValues[i].amount = "";
      newFormValues[i].total = "";

      if (stateId === 12) {
        newFormValues[i].cgstPer =
          parseFloat(lotdata[findIndex].LotProductCategory.hsn_master.gst) / 2;
        newFormValues[i].sGstPer =
          parseFloat(lotdata[findIndex].LotProductCategory.hsn_master.gst) / 2;
      } else {
        newFormValues[i].IGSTper = parseFloat(
          lotdata[findIndex].LotProductCategory.hsn_master.gst
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

      // will enter manualy
      // let wastageIndex = rateProfiles.findIndex(
      //   (item) =>
      //     item.product_categorie_id === lotdata[findIndex].ProductCategory.id
      // );
      // console.log("lotdata", lotdata[findIndex])
      // console.log("wastageIndex", rateProfiles[wastageIndex])
      // if (wastageIndex > -1) {
      //   newFormValues[i].wastagePer = rateProfiles[wastageIndex].wastage_per;
      //   newFormValues[i].errors.wastagePer = "";
      //   newFormValues[i].wastageFine = parseFloat(parseFloat(newFormValues[i].netWeight) * parseFloat(newFormValues[i].wastagePer) / 100).toFixed(3)
      //   newFormValues[i].totalFine = parseFloat((parseFloat(newFormValues[i].netWeight) * parseFloat(newFormValues[i].purity)) / 100 + parseFloat(newFormValues[i].wastageFine)).toFixed(3);
      // }
    }
    // console.log(newFormValues);
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
      // console.log(parseFloat(item.netWeight));
      return parseFloat(item.netWeight);
    }

    function fineGold(item) {
      return parseFloat(item.totalFine);
    }

    let tempFineGold = newFormValues
      .filter((item) => item.totalFine !== "")
      .map(fineGold)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

    let tempNetWtTot = parseFloat(newFormValues
      .filter((data) => data.netWeight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3)

    let tempGrossWtTot = parseFloat(newFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3)

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

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

    let tempCgstVal = 0;
    let tempSgstVal = 0;
    let tempIgstVal = 0;

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
      //   parseFloat(parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
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

    let tempLedgerAmount = 0;
    let tempfinalAmount = 0;
    let tempTotalInvoiceAmt = 0;
    // let temptdsTcsAmount =0;
    console.log("roundOff", roundOff)
    // if (value > 5 || value < -5) { error
    // }
    if (parseFloat(roundOff) <= 5 && parseFloat(roundOff) >= -5) {
      //tempTotal is amount + gst
      tempTotalInvoiceAmt = parseFloat(
        parseFloat(tempTotal) + parseFloat(roundOff)
      ).toFixed(3);
      console.log("===if")
      // setTotalInvoiceAmount(tempTotalInvoiceAmt);
    } else {
      tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);
      console.log("else")
      // setTotalInvoiceAmount(tempTotalInvoiceAmt);
    }

    console.log("tempTotalInvoiceAmt", tempTotalInvoiceAmt)

    setTotalInvoiceAmount(tempTotalInvoiceAmt);

    if (is_tds_tcs == 1) {
      //1 is tcs, 2 means tds
      tempLedgerAmount = parseFloat(
        (tempTotalInvoiceAmt * rateValue) / 100
      ).toFixed(3); //with gst on total invoice amount
      console.log(tempLedgerAmount);

      tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)).toFixed(3);
    } else if (is_tds_tcs == 2) {
      //tds
      tempLedgerAmount = parseFloat(
        (parseFloat(tempTotAmount) * rateValue) / 100
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
      orderDetails: newFormValues,
      taxableAmount: parseFloat(tempTotAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCgstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      fineWtTot: parseFloat(tempFineGold).toFixed(3),
      totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
      taxAmount: parseFloat(tempLedgerAmount).toFixed(3),
      balancePayable: parseFloat(tempfinalAmount).toFixed(3),
      TDSTCSVoucherNum: tdsTcsVou,
      ledgerName: ledgerName.label,
    })

    if (addFlag === true) {
      setFormValues([
        ...newFormValues,
        {
          manuallLot: "0",
          lotno: "",
          category: "",
          billingCategory: "",
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
          wastagePer: "",
          wastageFine: "",
          otherTagAmount: "",
          totalFine: "",
          fineRate: "",
          catRatePerGram: "",
          amount: "",
          hallmarkCharges: "",
          totalAmount: "",
          cgstPer: "",
          cgstVal: "",
          sGstPer: "",
          sGstVal: "",
          IGSTper: "",
          IGSTVal: "",
          total: "",
          HSNNum: "",
          errors: {
            category: null,
            billingCategory: null,
            HSNNum: null,
            lotNumber: null,
            pieces: null,
            grossWeight: null,
            netWeight: null,
            purity: null,
            jobworkFineUtilize: null,
            wastagePer: null,
            wastageFine: null,
            fineRate: null,
            labourFineAmount: null,
            otherTagAmount: null,
            catRatePerGram: null,
            amount: null,
            hallmarkCharges: null,
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
      setFormValues(newFormValues);
    }
  }

  let handlePackingSlipSelect = (packingSlipNum) => {
    console.log("handlePackingSlipSelect", packingSlipNum);

    let filteredArray = packingSlipApiData.filter(
      (item) => item.barcode === packingSlipNum
    );

    console.log(filteredArray);
    if (filteredArray.length > 0) {
      setPackingSlipApiData(filteredArray);
      // setSelectedVoucher(filteredArray[0].id);
      // setJobWorkerGst(filteredArray[0].JobWorker.hsn_master.gst);
      // setJobWorkerHSN(filteredArray[0].JobWorker.hsn_master.hsn_number);
      setPackingSlipErr("");
      setPackingSlipNo(packingSlipNum);
      getPackingSlipDetails(filteredArray[0].PackingSlip.id);
    } else {
      // setSelectedVoucher("");
      setPackingSlipNo("");
      setPackingSlipErr("Please Select Proper Voucher");
    }
  };

  function getPackingSlipDetails(packingSlipNum) {
    axios
      .get(
        Config.getCommonUrl() + `api/packingslip/packingSlip/${packingSlipNum}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          let tempPackingSlip = response.data.data.PackingSlip;
          let tempPacketData = response.data.data.packetData;
          let tempProductData = response.data.data.productData;
          let temCategoryData = response.data.data.categoryData;

          let newTemp = {
            ...tempPackingSlip,
            hallmark_charges_pcs: parseFloat(tempPackingSlip.hallmarkChargesFrontEnd).toFixed(3),
            NoOfPacket: tempPacketData.length,
            billingCategory: tempProductData[0].billing_category_name,
            wastageFine: parseFloat(
              (parseFloat(tempPackingSlip.net_wgt) *
                parseFloat(tempPackingSlip.wastage)) /
              100
            ).toFixed(3),
            totalFine: parseFloat(
              (parseFloat(tempPackingSlip.net_wgt) *
                parseFloat(tempPackingSlip.purity)) /
              100 +
              (parseFloat(tempPackingSlip.net_wgt) *
                parseFloat(tempPackingSlip.wastage)) /
              100
            ).toFixed(3),
            fineRate: "",
            amount: "",
            totalAmount: "",
          };

          setPackingSlipData([...packingSlipData.map((item) => {
            return {
              ...item,
              fineRate: "",
              amount: "",
              totalAmount: ""
            }
          }), newTemp]); //packing slip wise
          // console.log(newTemp);

          const newTempPacketData = tempPacketData.map((item) => {
            return {
              ...item,
              billingCategory: tempProductData[0].billing_category_name,
              wastage: tempPackingSlip.wastage,
              wastageFine: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
              ).toFixed(3),
              totalFine: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
                (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
              ).toFixed(3),
              fineRate: "",
              amount: "",
              hallmark_charges: parseFloat(item.hallmarkChargesFrontEnd).toFixed(3), // newTemp.hallmark_charges,
              totalAmount: "",
            };
          });

          setPacketData((packetData) => [...packetData.map((item) => {
            return {
              ...item,
              fineRate: "",
              amount: "",
              totalAmount: ""
            }
          }), ...newTempPacketData]);
          // [...packetData,newTempPacketData]
          // console.log(newTempPacketData);

          const newTempProductData = temCategoryData.map((item) => {
            return {
              ...item,
              wastage: tempPackingSlip.wastage,
              wastageFine: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
              ).toFixed(3),
              totalFine: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
                (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
              ).toFixed(3),
              fineRate: "",
              catRate: "",
              amount: "",
              //newTemp.hallmark_charges,
              hallmark_charges: parseFloat(item.hallmarkChargesFrontEnd).toFixed(3),
              totalAmount: "",
              cgstPer:
                stateId === 12
                  ? parseFloat(parseFloat(tempPacketData[0].gst) / 2).toFixed(3)
                  : "",
              cgstVal: "",
              sGstPer:
                stateId === 12
                  ? parseFloat(parseFloat(tempPacketData[0].gst) / 2).toFixed(3)
                  : "",
              sGstVal: "",
              IGSTper:
                stateId !== 12
                  ? parseFloat(tempPacketData[0].gst).toFixed(3)
                  : "",
              IGSTVal: "",
            };
          });

          function fineGold(item) {
            return parseFloat(item.totalFine);
          }

          let temp = [...productData, ...newTempProductData];
          // console.log(temp)

          let tempFineGold = temp
            .filter((item) => item.totalFine !== "")
            .map(fineGold)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
          console.log("tempFineGold", tempFineGold);

          setProductData((productData) => [
            ...productData.map((item) => {
              return {
                ...item,
                fineRate: "",
                amount: "",
                totalAmount: "",
                catRate: "",
                cgstVal: "",
                sGstVal: "",
                IGSTVal: "",
              }
            }),
            ...newTempProductData,
          ]);

          const tempTagWise = tempProductData.map((item) => {
            return {
              ...item,
              wastage: tempPackingSlip.wastage,
              wastageFine: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
              ).toFixed(3),
              totalFine: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
                (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
              ).toFixed(3),
              fineRate: "",
              amount: "",
              hallmark_charges: parseFloat(item.hallmarkChargesFrontEnd).toFixed(3),
              totalAmount: "",
            };
          });

          setTagWiseData((tagWiseData) => [...tagWiseData.map((item) => {
            return {
              ...item,
              fineRate: "",
              amount: "",
              totalAmount: ""
            }
          }), ...tempTagWise]);
          // console.log(tempTagWise)

          const tempBillMaterial = tempProductData.map((item) => {
            return {
              ...item,
              metal_wgt:
                parseFloat(parseFloat(item.gross_wgt) -
                  (parseFloat(item.stone_wgt) +
                    parseFloat(item.beads_wgt) +
                    parseFloat(item.silver_wgt) +
                    parseFloat(item.sol_wgt) +
                    parseFloat(item.other_wgt))).toFixed(3),
              metal_amt: "",
              stone_wgt: parseFloat(item.stone_wgt).toFixed(3),
              wastage: tempPackingSlip.wastage,
              wastageFine: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
              ).toFixed(3),
              totalFine: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
                (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
              ).toFixed(3),
              // fineRate: "",
              // amount: "",
              hallmark_charges: parseFloat(item.hallmarkChargesFrontEnd).toFixed(3),
              totalAmount: "",
            };
          });

          setBillmaterialData((billMaterialData) => [
            ...billMaterialData.map((item) => {
              return {
                ...item,
                totalAmount: ""
              }
            }),
            ...tempBillMaterial,
          ]);

          if (newRate !== "") {
            // setAdjustedRate(false);
            setSubTotal(0)
            setTotalGST(0)
            setTotal(0);
            setTotalAmount(0);
            setTotalInvoiceAmount(0)
            setLegderAmount(0);
            setFinalAmount(0);
          }

        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/packingslip/packingSlip/${packingSlipNum}` })

      });
  }
  // let handleManualLotNoChange = (i, e) => {
  //   console.log(e);
  //   let newFormValues = [...formValues];
  //   newFormValues[i].manuallLot = "0";
  //   newFormValues[i].lotno = {
  //     value: "",
  //     label: e,
  //   };
  //   newFormValues[i].errors.lotno = null;

  //   newFormValues[i].purity = "";
  //   newFormValues[i].grossWeight = "";
  //   newFormValues[i].categoryName = "";
  //   newFormValues[i].netWeight = "";
  //   newFormValues[i].rate = "";
  //   newFormValues[i].amount = "";
  //   newFormValues[i].total = "";

  //   setFormValues(newFormValues);
  // };

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
      newFormValues[i].HSNNum = stockCodeFindings[findIndex].hsn_master.hsn_number;

      newFormValues[i].billingCategory = stockCodeFindings[findIndex].billing_name;
      newFormValues[i].errors.billingCategory = null;

      if (stateId === 12) {
        newFormValues[i].cgstPer =
          parseFloat(stockCodeFindings[findIndex].hsn_master.gst) / 2;
        newFormValues[i].sGstPer =
          parseFloat(stockCodeFindings[findIndex].hsn_master.gst) / 2;
      } else {
        newFormValues[i].IGSTper = parseFloat(
          stockCodeFindings[findIndex].hsn_master.gst
        );
      }
    }

    // let wastageIndex = rateProfiles.findIndex(
    //   (item) => item.stock_name_code_id === e.value
    // );
    // if (wastageIndex > -1) {
    //   newFormValues[i].wastagePer = rateProfiles[wastageIndex].wastage_per;
    //   newFormValues[i].errors.wastagePer = "";
    // }

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
      newFormValues[i].HSNNum = stockCodeData[findIndex].hsn_master.hsn_number;

      newFormValues[i].billingCategory = stockCodeData[findIndex].billing_name;
      newFormValues[i].errors.billingCategory = null;

      if (stateId === 12) {
        newFormValues[i].cgstPer =
          parseFloat(stockCodeData[findIndex].hsn_master.gst) / 2;
        newFormValues[i].sGstPer =
          parseFloat(stockCodeData[findIndex].hsn_master.gst) / 2;
      } else {
        newFormValues[i].IGSTper = parseFloat(
          stockCodeData[findIndex].hsn_master.gst
        );
      }
    }

    // will enter manualy
    // let wastageIndex = rateProfiles.findIndex(
    //   (item) => item.stock_name_code_id === e.value
    // );
    // console.log("wastageIndex", wastageIndex)
    // if (wastageIndex > -1) {
    //   newFormValues[i].wastagePer = rateProfiles[wastageIndex].wastage_per;
    //   newFormValues[i].errors.wastagePer = "";
    // }

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
    axios
      .get(
        Config.getCommonUrl() +
        `api/lot/department/${window.localStorage.getItem(
          "SelectedDepartment"
        )}/${sData}` //"api/jobWorkArticianIssue/lot/" +selectedVoucher
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
          api: `api/lot/department/${window.localStorage.getItem(
            "SelectedDepartment"
          )}/${sData}`
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
    // newFormValues[i].rate = "";
    // newFormValues[i].valuation = "";

    // if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
    //   newFormValues[i].jobWorkFineinPure =
    //     (parseFloat(newFormValues[i].netWeight) *
    //       parseFloat(newFormValues[i].purity)) /
    //     100;
    // } else {
    // newFormValues[i].jobWorkFineinPure = "";
    // }
    let findIndex = productCategory.findIndex((item) => item.id === e.value);
    console.log(findIndex);
    if (findIndex > -1) {
      newFormValues[i].HSNNum =
        productCategory[findIndex].hsn_master.hsn_number;
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
      setNewRate("")
      // setAdjustedRate(false);
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
      setNewRate("")
      // setAdjustedRate(false);
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

          // newFormValues[i].fine = (
          //   (parseFloat(newFormValues[i].netWeight) *
          //     parseFloat(newFormValues[i].purity)) /
          //     100 +
          //   (parseFloat(newFormValues[i].netWeight) *
          //     parseFloat(newFormValues[i].wastagePer)) /
          //     100
          // ).toFixed(3);

          newFormValues[i].totalFine = parseFloat(
            (parseFloat(newFormValues[i].netWeight) *
              parseFloat(newFormValues[i].purity)) /
            100 +
            parseFloat(newFormValues[i].wastageFine)
          ).toFixed(3);
        } else {
          // newFormValues[i].fine = (
          //   (parseFloat(newFormValues[i].netWeight) *
          //     parseFloat(newFormValues[i].purity)) /
          //   100
          // ).toFixed(3);

          newFormValues[i].totalFine = parseFloat(
            (parseFloat(newFormValues[i].netWeight) *
              parseFloat(newFormValues[i].purity)) /
            100
          ).toFixed(3);
        }
      }
    }

    //from here
    if (newRate !== "" && !isNaN(newRate)) {
      newFormValues[i].fineRate = parseFloat(newRate).toFixed(3);
    }

    if (HMCharges !== "" && newFormValues[i].pieces !== "") {
      newFormValues[i].hallmarkCharges = parseFloat(parseFloat(HMCharges) * parseFloat(newFormValues[i].pieces)).toFixed(3);
    }

    if (newFormValues[i].totalFine !== "" && newFormValues[i].fineRate !== "") {
      if (newFormValues[i].otherTagAmount !== "" && newFormValues[i].otherTagAmount !=0) {
        newFormValues[i].amount = parseFloat(
          (parseFloat(newFormValues[i].totalFine) *
            parseFloat(newFormValues[i].fineRate)) /
          10 +
          parseFloat(newFormValues[i].otherTagAmount)
        ).toFixed(3);
        newFormValues[i].totalAmount = newFormValues[i].amount; //without hallmark charges
      }
       else {
        newFormValues[i].amount = parseFloat(
          (parseFloat(newFormValues[i].totalFine) *
            parseFloat(newFormValues[i].fineRate)) /
          10
        ).toFixed(3);
        newFormValues[i].totalAmount = newFormValues[i].amount; //without hallmark charges
      }
    }

    console.log(
      "amount",
      newFormValues[i].amount,
      "netWeight",
      newFormValues[i].netWeight
    );
    if (newFormValues[i].amount !== ""&& newFormValues[i].amount !=0 &&newFormValues[i].netWeight != 0 && newFormValues[i].netWeight !== "") {
      console.log(newFormValues[i].amount,"amount")
      console.log(newFormValues[i].netWeight,"amfdgount")
      newFormValues[i].catRatePerGram = parseFloat(
        (parseFloat(newFormValues[i].amount) /
          parseFloat(newFormValues[i].netWeight)) *
        10
      ).toFixed(3);

    }else{
      newFormValues[i].catRatePerGram = 0
    }

    if (
      newFormValues[i].amount !== "" &&
      newFormValues[i].hallmarkCharges !== ""
    ) {
      //with hallmark charges
      newFormValues[i].totalAmount = parseFloat(
        parseFloat(newFormValues[i].amount) +
        parseFloat(newFormValues[i].hallmarkCharges)
      ).toFixed(3);
    }

    if (stateId === 12) {
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
        // console.log("CGSTval ",(newFormValues[i].amount * newFormValues[i].CGSTPer) / 100)

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

    // function fine(item) {
    //   return parseFloat(item.fine);
    // }

    // let tempFineTot = newFormValues
    //   .filter((item) => item.fine !== "")
    //   .map(fine)
    //   .reduce(function (a, b) {
    //     // sum all resulting numbers
    //     return parseFloat(a) + parseFloat(b);
    //   }, 0);

    // setFineTotal(parseFloat(tempFineTot).toFixed(3));

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

    if (stateId === 12) {

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

    setShortageRfix(parseFloat(tempFineGold).toFixed(3));

    let tempLedgerAmount = 0;
    let tempfinalAmount = 0;
    let tempTotalInvoiceAmt = 0;

    if (parseFloat(tempTotal) > 0) {
      // let temptdsTcsAmount =0;

      if (parseFloat(roundOff) <= 5 && parseFloat(roundOff) >= -5) {
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
        console.log(tempLedgerAmount);

        tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)).toFixed(3);

      } else if (is_tds_tcs == 2) {
        //tds
        tempLedgerAmount = parseFloat(
          (parseFloat(tempAmount) * rateValue) / 100
        ).toFixed(3); //calculating before gst, on total amount only
        console.log(tempLedgerAmount);
        tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount)).toFixed(3);
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
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCgstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      fineWtTot: parseFloat(tempFineGold).toFixed(3),
      totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
      taxAmount: parseFloat(tempLedgerAmount).toFixed(3),
      balancePayable: parseFloat(tempfinalAmount).toFixed(3)
    })

    setFormValues(newFormValues);
  };

  function handleModalClose() {
    // console.log("handle close", callApi);
    setModalOpen(false);
    // setInvoiceModal(false)
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
          balancePayable: parseFloat(tempfinalAmount).toFixed(3)
        })
      } else {
        setLedgerAmtErr("Please Enter Valid Amount");
        setFinalAmount(parseFloat(totalInvoiceAmount).toFixed(3));
      }
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
        console.log(tempLedgerAmount);

        tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)).toFixed(3);
      } else if (is_tds_tcs == 2) {
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
        taxAmount: tempLedgerAmount,
        balancePayable: parseFloat(tempfinalAmount).toFixed(3)

      })
    }
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
        selectedLoad === "3" ? element.lotno !== "" : element.category !== ""
      )
      .some((item) => {
        if (selectedLoad === "3") {
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
              item.hallmarkCharges === "" ||
              percentRegex.test(item.wastagePer) === false ||
              percentRegex.test(item.purity) === false ||
              item.netWeight === "" || item.netWeight == 0 
              //  ||
              // parseFloat(item.grossWeight) !==
              // parseFloat(item.netWeight) +
              // item.DiffrentStock.filter((data) => data.setWeight !== "")
              //   .map(setWeight)
              //   .reduce(function (a, b) {
              //     // sum all resulting numbers
              //     return parseFloat(a) + parseFloat(b);
              //   }, 0)
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
              item.otherTagAmt === "" ||
              item.hallmarkCharges === "" ||
              (item.category.pcs_require === 1 && (item.pieces === "" || isNaN(item.pieces))) ||
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
              item.category === "" ||
              item.grossWeight === "" || item.grossWeight == 0 ||
              item.netWeight === "" || item.netWeight == 0 ||
              (item.category.pcs_require === 1 && (item.pieces === "" || isNaN(item.pieces))) ||
              item.wastagePer === "" ||
              item.otherTagAmt === "" ||
              item.hallmarkCharges === "" ||
              percentRegex.test(item.wastagePer) === false
            );
          }
        }
      });

    console.log(someEmpty);

    if (someEmpty) {
      formValues
        .filter((element) =>
          selectedLoad === "3" ? element.lotno !== "" : element.category !== ""
        )
        .map((item, index) => {
          const allPrev = [...formValues];
          // console.log(item);

          if (selectedLoad === "3") {
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

          let otherTagAmt = formValues[index].otherTagAmt;
          if (!otherTagAmt || weightRegex.test(otherTagAmt) === false) {
            allPrev[index].errors.otherTagAmt = "Please Enter Other Tag Amount";
          } else {
            allPrev[index].errors.otherTagAmt = null;
          }

          let hallmarkCharges = formValues[index].hallmarkCharges;
          if (!hallmarkCharges || weightRegex.test(hallmarkCharges) === false) {
            allPrev[index].errors.hallmarkCharges =
              "Please Enter Hallmark Charges";
          } else {
            allPrev[index].errors.hallmarkCharges = null;
          }
          // item.hallmarkCharges === "" ||

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

            if (selectedLoad !== "3") {
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

//   function getheroID(id) {
//     console.log(id);
//     const body= {id:id}
//     axios
//  .post(Config.getCommonUrl() + "api/gstHero/invoice", body)
//       .then(function (response) {
//         console.log(response);
       
//         if (response.data.success === true) {
        

//           dispatch(Actions.showMessage({ message: response.data.message }));
        
        
//         } else {
//           dispatch(Actions.showMessage({ message: response.data.message }));
//         }
//       })
//       .catch((error) => {
//         handleError(error, dispatch, {api: "api/gstHero/invoice",body: body})

//       });
//   }

  function addUserInputApi(resetFlag, toBePrint) {
    // if (adjustedRate === false) {
    //   setSelectedRateFixErr("Please Add remaining rate");
    //   console.log("if");
    //   return;
    // }

    let Orders = formValues
      .filter((element) =>
        selectedLoad === "3" ? element.lotno !== "" : element.category !== ""
      )
      .map((x) => {
        if (selectedLoad === "3") {
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
              hallmark_charges: x.hallmarkCharges,
              Wastage_percentage: x.wastagePer,
            };
          } else {
            return {
              lot_id: x.lotno.value,
              other_tag_amount: x.otherTagAmount,
              hallmark_charges: x.hallmarkCharges,
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
                  setStockCodeId: y.setStockCodeId.vaule,
                  setPcs: y.setPcs,
                  setWeight: y.setWeight,
                };
              }),
              hallmark_charges: x.hallmarkCharges,
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
              hallmark_charges: x.hallmarkCharges,
              other_tag_amount: x.otherTagAmount,
              ...(x.pieces !== "" && {
                pcs: x.pieces, //user input
              }),
            };
          }
        }
      });
    let rates = balRfixViewData
    
    if (Orders.length === 0) {
      dispatch(Actions.showMessage({ message: "Please Add Sales Entry" }));
      return;
    }
    setLoading(true);
    console.log(tempRate,"temp")

    const body = {
      temp_sales_domestic_id:selectedVoucherinfo.value,
      party_voucher_no: partyVoucherNum,
      opposite_account_id: oppositeAccSelected.value,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      client_id: selectedVendorClient.value === 1 ? null : selectedClient.value,
      client_company_id: selectedVendorClient.value === 1 ? selectedVendor.value : selectedCompany.value,
      is_vendor_client: selectedVendorClient.value === 1 ? 1 : 2,
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
      is_shipped: parseInt(shipping),
      ...(shipping === "1" && {
        shipping_client_id: shippingClient.value,
        shipping_client_company_id: shipClientComp.value,
      }),
      is_lot: selectedLoad === "3" ? 1 : 0,
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      Orders: Orders,
      uploadDocIds: docIds,
      party_voucher_date:partyVoucherDate,
    }
    console.log(body);
    axios
      .post(Config.getCommonUrl() + "api/salesDomestic", body)
      .then(function (response) {
        console.log(response);
        setLoading(false);

        if (response.data.success === true) {
          // console.log(response);
          // setIsCsvErr(false);
          console.log(response.data.data.id,"response.data.id");
          // getheroID(response.data.data.id)
          dispatch(Actions.showMessage({ message: response.data.message }));

          // History.goBack();
          // setSelectedLoad("");
          // setSelectedClient("");
          // setSelectedCompany("");
          // setShipping("");
          // reset();
          // getVoucherNumber();
          setLoading(false);
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

        handleError(error, dispatch, { api: "api/salesDomestic", body: body })

      });
  }

  function getPackingSlipData(sData) {
    axios
      .get(Config.getCommonUrl() + `api/packingslip/search/${sData}/${window.localStorage.getItem("SelectedDepartment")}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          if (response.data.data.length > 0) {
            setPackingSlipApiData(response.data.data);
          } else {
            setPackingSlipApiData([]);
            dispatch(
              Actions.showMessage({
                message: "Please Insert Proper Packing Slip No",
              })
            );
          }
        } else {
          setPackingSlipApiData([]);
          dispatch(Actions.showMessage({ message: response.data.error.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/packingslip/search/${sData}/${window.localStorage.getItem("SelectedDepartment")}` })

      });
  }

  function deleteHandler(slipNo) {
    console.log("domestic", slipNo);

    let tempPackingslip = packingSlipData.filter((item) => item.packing_slip_no !== slipNo)
    setPackingSlipData(tempPackingslip);

    let tempPacket = packetData.filter((item) => item.packing_slip_no !== slipNo)
    setPacketData(tempPacket);

    let tempProduct = productData.filter((item) => item.packing_slip_no !== slipNo)
    setProductData(tempProduct);

    let tempBom = billMaterialData.filter((item) => item.packing_slip_no !== slipNo)
    setBillmaterialData(tempBom);

    let tempTag = tagWiseData.filter((item) => item.packing_slip_no !== slipNo)
    setTagWiseData(tempTag);
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

    // function Total(item) {
    //   return item.total;
    // }

    // cgstPer:
    //             stateId === 12
    //               ? parseFloat(parseFloat(item.hsn_number.gst) / 2).toFixed(3)
    //               : "",
    //           cgstVal: "",
    //           sGstPer:
    //             stateId === 12
    //               ? parseFloat(parseFloat(item.hsn_number.gst) / 2).toFixed(3)
    //               : "",
    //           sGstVal: "",
    //           IGSTper:
    //             stateId === 12
    //               ? parseFloat(item.hsn_number.gst).toFixed(3)
    //               : "",
    //           IGSTVal: "",

    let tempAmount = tempProduct
      .filter((item) => item.totalAmount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setSubTotal(parseFloat(tempAmount).toFixed(3));

    function grossWeight(item) {
      return parseFloat(item.gross_wgt);
    }
    function netWeight(item) {
      return parseFloat(item.net_wgt);
    }

    let tempGrossWtTot = parseFloat(tempProduct
      .filter((item) => item.gross_wgt !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);
    setTotalGrossWeight(tempGrossWtTot);

    let tempNetWtTot = parseFloat(tempProduct
      .filter((item) => item.net_wgt !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);
    setTotalNetWeight(tempNetWtTot);

    //tempTotal is amount + gst
    let tempTotal = 0;
    let tempIgstVal = 0;
    let tempCgstVal = 0;
    let tempSgstVal = 0;

    if (stateId === 12) {
      tempCgstVal = tempProduct
        .filter((item) => item.cgstVal !== "")
        .map(CGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
      // setCgstVal(parseFloat(tempCgstVal).toFixed(3));

      tempSgstVal = tempProduct
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
        parseFloat(tempAmount) +
        parseFloat(tempCgstVal) +
        parseFloat(tempSgstVal)
      ).toFixed(3);
    } else {

      tempIgstVal = tempProduct
        .filter((item) => item.IGSTVal !== "")
        .map(IGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);

      setTotalGST(parseFloat(tempIgstVal).toFixed(3));
      tempTotal = parseFloat(
        parseFloat(tempAmount) + parseFloat(tempIgstVal)
      ).toFixed(3);
    }

    setTotal(parseFloat(tempTotal).toFixed(3))
    setTotalAmount(parseFloat(tempAmount).toFixed(3))

    let tempLedgerAmount = 0;
    let tempfinalAmount = 0;
    let tempTotalInvoiceAmt = 0;

    if (parseFloat(tempTotal) > 0) {
      // let temptdsTcsAmount =0;

      if (parseFloat(roundOff) <= 5 && parseFloat(roundOff) >= -5) {
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
        console.log(tempLedgerAmount);

        tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)).toFixed(3);
        console.log(tempfinalAmount);
      } else if (is_tds_tcs == 2) {
        //tds
        console.log("2");
        tempLedgerAmount = parseFloat(
          (parseFloat(tempAmount) * rateValue) / 100
        ).toFixed(3); //calculating before gst, on total amount only
        console.log(tempLedgerAmount);
        tempfinalAmount = parseFloat(parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount)).toFixed(3);
      } else {
        console.log("else");
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
      orderDetails: tempProduct,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCgstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      // fineWtTot: parseFloat(tempFineGold).toFixed(3),
      totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
      taxAmount: parseFloat(tempLedgerAmount).toFixed(3),
      balancePayable: parseFloat(tempfinalAmount).toFixed(3),
      TDSTCSVoucherNum: tdsTcsVou,
      ledgerName: ledgerName.label,
    })
  }

  function createFromPackingSlip(resetFlag, toBePrint) {
    // if (adjustedRate === false) {
    //   setSelectedRateFixErr("Please Add remaining rate");
    //   console.log("if");
    //   return;
    // }

    let Orders = packingSlipData
      // .filter((element) =>
      //   selectedLoad === "3" ? element.lotno !== "" : element.category !== ""
      // )
      .map((x) => {
        // if (parseFloat(x.grossWeight) !== parseFloat(x.netWeight)) {
        return {
          packing_slip_id: x.packing_slip_id,
        };
        // }
      });
    console.log(Orders);
    let rates = balRfixViewData

    if (Orders.length === 0) {
      dispatch(Actions.showMessage({ message: "Please Add Sales Entry" }));
      return;
    }
    setLoading(true);

    const body = {
      temp_sales_domestic_id:selectedVoucherinfo.value,
      party_voucher_no: partyVoucherNum,
      opposite_account_id: oppositeAccSelected.value,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      client_id: selectedVendorClient.value === 1 ? null : selectedClient.value,
      client_company_id: selectedVendorClient.value === 1 ? selectedVendor.value : selectedCompany.value,
      is_vendor_client: selectedVendorClient.value === 1 ? 1 : 2,
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
      is_shipped: parseInt(shipping),
      ...(shipping === "1" && {
        shipping_client_id: shippingClient.value,
        shipping_client_company_id: shipClientComp.value,
      }),
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      Orders: Orders,
      uploadDocIds: docIds,
      party_voucher_date:partyVoucherDate,
    }
    console.log(body)
    axios
      .post(Config.getCommonUrl() + "api/salesDomestic/createFromPackingSlip", body)
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
          // setSelectedClient("");
          // setSelectedCompany("");
          // setShipping("");
          // setPackingSlipNo("");
          // setPackingSlipData([]); //packing slip wise
          // setPacketData([]); //packet wise Data
          // setProductData([]); //category wise Data
          // setBillmaterialData([]); //bill of material Data
          // setTagWiseData([]);
          // reset();
          // getVoucherNumber();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);

        handleError(error, dispatch, { api: "api/salesDomestic/createFromPackingSlip", body: body })

      });
  }

  function deleteRow(index) {
    console.log(index)
    let newFormValues = [...formValues];
    // setAdjustedRate(false);
    setShortageRfix("")
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
    ]
    newFormValues[index].purity = ""
    newFormValues[index].wastagePer = ""
    newFormValues[index].wastageFine = ""
    newFormValues[index].otherTagAmount = ""
    newFormValues[index].totalFine = ""
    newFormValues[index].fineRate = ""
    newFormValues[index].catRatePerGram = ""
    newFormValues[index].amount = ""
    newFormValues[index].hallmarkCharges = ""
    newFormValues[index].totalAmount = ""
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
      HSNNum: null,
      lotNumber: null,
      pieces: null,
      grossWeight: null,
      netWeight: null,
      purity: null,
      jobworkFineUtilize: null,
      wastagePer: null,
      wastageFine: null,
      fineRate: null,
      labourFineAmount: null,
      otherTagAmount: null,
      catRatePerGram: null,
      amount: null,
      hallmarkCharges: null,
      totalAmount: null,
      cgstPer: null,
      cgstVal: null,
      sGstPer: null,
      sGstVal: null,
      IGSTper: null,
      IGSTVal: null,
      total: null,
    }

    changeTotal(newFormValues, false);
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
      setLedgerName("");
      setLedgerNmErr("");
      setLedgerData([]);
      setRateValue(0);
      setRateValErr("");
      setLegderAmount(0);
      setLedgerAmtErr("");
      setFinalAmount("");
      setTdsTcsVou("");

      setPrintObj({
        ...printObj,
        voucherDate: moment().format("DD-MM-YYYY"),
        stateId: "",
        supplierName: "",
        supAddress: "",
        supplierGstUinNum: "",
        supPanNum: "",
        supState: "",
        supCountry: "",
        supStateCode: "",
        partyInvNum: "",
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
        balancePayable: ""
      })
    }
  }
  function handleVoucherinfoChange(value){
    setSelectedVoucherinfo(value)
  }

  function handlePartyChange(value) {
    if (loadTypeValidation()) {
      setSelectedVendorErr("")
      setTotalInvoiceAmount(0);
      setSelectedVendor(value);
      setSelectedClient("");
      setSelectClientErr("");
      setSelectedCompany("");
      setSelectedCompErr("");
      setPackingSlipData([]); //packing slip wise
      setPacketData([]); //packet wise Data
      setProductData([]); //category wise Data
      setBillmaterialData([]); //bill of material Data
      setTagWiseData([]);
      setPackingSlipNo("");
      setTotalInvoiceAmount(0);
      setLedgerName("");
      setLedgerNmErr("");
      setLedgerData([]);
      setRateValue(0);
      setRateValErr("");
      setLegderAmount(0);
      setLedgerAmtErr("");
      setFinalAmount("");
      setTdsTcsVou("");
      reset();
      // getFixedRateofWeight(value.value);

      const index = vendorData.findIndex((element) => element.id === value.value);
      console.log(index);

      if (index > -1) {
        setFirmName(vendorData[index].firm_name);
        setFirmNameErr("")
        setAddress(vendorData[index].address);
        setSupplierGstUinNum(vendorData[index].gst_number);
        setSupPanNum(vendorData[index].pan_number);
        setSupState(vendorData[index].state_name.name);
        setStateId(vendorData[index].state_name.id);

        setIs_tds_tcs(vendorData[index].is_tds_tcs);
        getFixedRateofWeight(value.value);
        console.log(vendorData[index].is_tds_tcs);

        setPrintObj({
          ...printObj,
          is_tds_tcs: vendorData[index].is_tds_tcs,
          stateId: vendorData[index].state_name.id,
          supplierName: vendorData[index].firm_name,
          supAddress: vendorData[index].address,
          supplierGstUinNum: vendorData[index].gst_number,
          supPanNum: vendorData[index].pan_number,
          supState: vendorData[index].state_name.name,
          supCountry: vendorData[index].country_name.name,
          supStateCode: (vendorData[index].gst_number) ? vendorData[index].gst_number.substring(0, 2) : '',
          supStateCode: (vendorData[index].gst_number) ? vendorData[index].gst_number.substring(0, 2) : '',
          supStateCode: (vendorData[index].gst_number) ? vendorData[index].gst_number.substring(0, 2) : '',
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
          taxAmount: "",
          metNarration: "",
          accNarration: "",
          balancePayable: ""
        })

        if (
          vendorData[index].is_tds_tcs != 0
        ) {

          getLedger(vendorData[index].is_tds_tcs)

        } else {
          setTdsTcsVou("");
          setLedgerName("");
          setLedgerData([])
          setRateValue(0);

        }
        setLegderAmount(0); //everything is goinf to reset so 
      }
    }
  }

  function getLedger(tcstds) {
    if (tcstds == 2) {
      var api = `api/ledgerMastar/tds/18`
    } else if (tcstds == 1) {
      var api = `api/ledgerMastar/tcs/18`
    }

    axios.get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setLedgerData(response.data.data)
          const arrData = response.data.data[0]
          setLedgerName({
            value: arrData.id,
            label: arrData.Ledger.name,
          });
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: api })
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
    setDocModal(false)
    setInvoiceModal(false)
    getSalesDomesticRecordView(idToBeView.id);

  }

  const handleNarrationClick = () => {
    console.log("handleNarr", narrationFlag)
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        "flag": 22,
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
                      {mainView
                        ? "View Sales Invoice (Domestic)"
                        : "Add Sales Invoice (Domestic)"}
                    </Typography>
                  </FuseAnimate>
                {/* {isView && !mainView ? <BreadcrumbsHelper /> : ''} */}
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
            )}

            {loading && <Loader />}
            <div className="main-div-alll">
              <div
              className="pb-32 pt-32 pl-16 pr-16  salesdomestic-work-pt"
              style={{ marginBottom: "10%" }}
            >
              <Grid container spacing={3}>
                
              {allowedBackDate && (
                  <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                    <TextField
                      // label="Date"
                      type="date"
                      className=""
                      name="voucherDate"
                      value={voucherDate}
                      error={VoucherDtErr.length > 0 ? true : false}
                      helperText={VoucherDtErr}
                      // onKeyDown={(e => e.preventDefault())}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      onBlur={handleDateBlur}
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

                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <TextField
                    className=""
                    label="Invoice Number"
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
                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 6 }}>
              <Select
                        id="voucher_info"
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={voucherinfolist?voucherinfolist.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.voucher_no,
                        })):[]}
                        // components={components}
                        value={selectedVoucherinfo}
                        onChange={handleVoucherinfoChange}
                        placeholder="Select Voucher"
                        autoFocus
                        isDisabled={mainView}
                      />
                   <span style={{ color: "red" }}>
                    {selectedVoucherinfoErr.length > 0 ? selectedVoucherinfoErr : ""}
                  </span>
                </Grid>

                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
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
                    <option value="0">Load Packing Slip</option>
                    <option value="1">Load Metal Varient</option>
                    <option value="2">Load Findings Varient</option>
                    <option value="3">Load Lot directly</option>
                  </select>

                  <span style={{ color: "red" }}>
                    {selectedLoadErr.length > 0 ? selectedLoadErr : ""}
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
                {
                  selectedVendorClient.value === 1 ? <>
                    <Grid
                      item
                      lg={2}
                      md={4}
                      sm={4}
                      xs={12}
                      style={{ padding: 6 }}
                    >
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
                        {selectedVendorErr.length > 0 ? selectedVendorErr : ""}
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
                      <TextField
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
                      />
                    </Grid>
                  </> : <>
                    <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 6 }}>
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

                    <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 6 }}>
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
                }


                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <Select
                    id="view_jewellary_dv"
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={oppositeAccData}
                    value={oppositeAccSelected}
                    onChange={handleOppAccChange}
                    placeholder="Opposite Account"
                    isDisabled={mainView}
                  />

                  <span style={{ color: "red" }}>
                    {selectedOppAccErr.length > 0 ? selectedOppAccErr : ""}
                  </span>
                </Grid>

                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <TextField
                    className=""
                    label="Party Voucher Number"
                    name="partyVoucherNum"
                    value={partyVoucherNum}
                    error={partyVoucherNumErr.length > 0 ? true : false}
                    helperText={partyVoucherNumErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
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
                    <TextField
                     label="Party Voucher Date"
                      type="date"
                      className="mb-16"
                      name="partyVoucherDate"
                      value={partyVoucherDate}
                      onChange={(e) => setPartyVoucherDate(e.target.value)}
                      variant="outlined"
                      // onKeyDown={(e => e.preventDefault())}
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

                {!isView &&

                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <TextField
                      className="mb-16 uploadDoc"
                      label="Upload Document"
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

                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
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
                    <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
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
                        isDisabled={isView}
                      />

                      <span style={{ color: "red" }}>
                        {shipClientErr.length > 0 ? shipClientErr : ""}
                      </span>
                    </Grid>

                    <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
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
                        isDisabled={isView}
                      />

                      <span style={{ color: "red" }}>
                        {shipCompErr.length > 0 ? shipCompErr : ""}
                      </span>
                    </Grid>
                  </>
                )}

                {(selectedLoad === "0" && !isView) && (
                  <Grid
                    className="packing-slip-input"
                    item
                    lg={2} md={4} sm={4} xs={12}
                    style={{ padding: 6 }}
                  >
                    <Autocomplete
                      id="free-solo-demo"
                      freeSolo
                      disableClearable
                      onChange={(event, newValue) => {
                        // console.log("onChange", newValue);
                        handlePackingSlipSelect(newValue);
                      }}
                      onInputChange={(event, newInputValue) => {
                        // console.log("onInputChange", newInputValue);
                        // console.log("onInputChange", newInputValue,event.type);
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
                        (option) => option.barcode
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          style={{ padding: 0 }}
                          label="Packing Slip No"
                        />
                      )}
                    />
                    <span style={{ color: "red" }}>
                      {packingSlipErr.length > 0 ? packingSlipErr : ""}
                    </span>
                  </Grid>
                )}

                {/* {selectedLoad === "0" && ( */}
                <Grid item lg={2} md={4} sm={4} xs={12} >
                  {/* <Button
                    variant="contained"
                    color="primary"
                    className="mx-auto"
                    aria-label="Register"
                    style={{ width: "100%" }}
                    disabled={isView}
                  // onClick={(e) => handleFormSubmit(e)}
                  >
                    Load Packing Slip
                  </Button> */}
                </Grid>
                {/* )} */}
              </Grid>

              {(selectedLoad === "1" ||
                selectedLoad === "2" ||
                selectedLoad === "3") && (
                  <div className="addsalestable-blg-dv addsalesdomastic_tabel_blg">
                    <div className=" inner-addsalesdomastic_tabel_blg">
                      <div
                        className="mt-16 jewellery-artician-tbl addsalesjob-tabel-main addsales-domestic-dv addsalesjob-tabel-blg-dv"
                        style={{
                          border: "1px solid lightgray",
                          paddingBottom: 5,
                        }}
                      >
                        <div
                          id="jewellery-artician-head"
                          style={{ background: "lightgray", fontWeight: "700" }}
                        >
                          {!isView &&
                            <div className={clsx(classes.tableheader, "delete_icons_dv")}>
                              {/* delete action */}
                            </div>
                          }
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
                            Wastage (%)
                          </div>

                          <div className={clsx(classes.tableheader, "")}>
                            Wastage Fine
                          </div>

                          <div className={clsx(classes.tableheader, "")}>
                            Other Tag Amount
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Total Fine
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Fine Rate
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Category Rate
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Amount
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Hallmark Charges
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
                            Total
                          </div>
                        </div>
                        {/* if 0 or 1 then show files upload data else input like metal */}

                        {formValues.map((element, index) => (
                          <div
                            id="jewellery-artician-head"
                            key={index}
                            className="mt-5"
                          >
                            {!isView &&

                              <div className={clsx(classes.tableheader, "delete_icons_dv")}>
                                <IconButton
                                  style={{ padding: "0" }}
                                  tabIndex="-1"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    deleteRow(index);
                                  }}
                                >
                                  <Icon className="mr-8" style={{ color: "red" }}>
                                    delete
                                  </Icon>
                                </IconButton>
                              </div>
                            }
                            {selectedLoad === "3" && (
                              <Autocomplete
                                id="view_jewellary_dv"
                                freeSolo
                                disableClearable
                                disabled={isView}
                                onChange={(event, newValue) => {
                                  console.log("onChange", newValue);
                                  // setValue(newValue);
                                  handleLotNumChange(index, newValue);
                                }}
                                onInputChange={(event, newInputValue) => {
                                  console.log("onInputChange", newInputValue);
                                  if (!isView && newInputValue !== "") {
                                    setSearchData(newInputValue);
                                  }
                                  // handleManualLotNoChange(index, newInputValue);
                                  // setInputValue(newInputValue);
                                }}
                                value={
                                  // element.manuallLot === "0"
                                  //   ? element.lotno.label
                                  //   : element.lotno
                                  element.lotno !== "" ? element.lotno.label : ""
                                  // element.lotno !== ""
                                  //   ? element.lotno.value === ""
                                  //     ? element.lotno
                                  //     : element.lotno.label
                                  //   : ""
                                }
                                options={lotdata.map((option) => option.number)}
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

                            {selectedLoad === "1" && (
                              <>
                                <Select
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  className={classes.selectBox}
                                  classes={classes}
                                  styles={selectStyles}
                                  options={stockCodeData
                                    .filter(array => formValues.every(item => (!(item.category?.value === array.stock_name_code.id && item.category.label === array.stock_name_code.stock_code))))
                                    .map((suggestion) => ({
                                      value: suggestion.stock_name_code.id,
                                      label: suggestion.stock_name_code.stock_code,
                                      pcs_require: suggestion.stock_name_code.stock_description.pcs_require
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

                            {selectedLoad === "2" && (
                              <>
                                <Select
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  className={classes.selectBox}
                                  classes={classes}
                                  styles={selectStyles}
                                  options={stockCodeFindings
                                    .filter(array => formValues.every(item => (!(item.category?.value === array.stock_name_code.id && item.category.label === array.stock_name_code.stock_code))))
                                    .map((suggestion) => ({
                                      value: suggestion.stock_name_code.id,
                                      label: suggestion.stock_name_code.stock_code,
                                      pcs_require: suggestion.stock_name_code.stock_description.pcs_require
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

                            {selectedLoad === "3" && (
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
                                  options={productCategory.map((suggestion) => ({
                                    value: suggestion.id,
                                    label: suggestion.category_name,
                                  }))}
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

                            {(selectedLoad === "1" || selectedLoad === "2") && (
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
                              inputRef={(el) => (pcsInputRef.current[index] = el)}
                              variant="outlined"
                              fullWidth
                              disabled={selectedLoad === "3" || isView}
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
                              onBlur={e => handlerBlur(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled={selectedLoad === "3" || isView}
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
                              onBlur={e => handlerBlur(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled={selectedLoad === "3" || isView}
                            />

                            {/* {(element.isWeightDiff === 0 && selectedLoad !== "3") && ( */}
                            {(element.grossWeight !== "" && element.netWeight !== "" && (parseFloat(element.grossWeight).toFixed(3) !== parseFloat(element.netWeight).toFixed(3)) && selectedLoad !== "3") && (
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
                              // label="otherTagAmount"
                              name="otherTagAmount"
                              className={clsx(classes.inputBoxTEST)}
                              type={isView ? "text" : "number"}
                              value={isView ? Config.numWithComma(element?.otherTagAmount) : element.otherTagAmount || ""}
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
                              onBlur={e => handlerBlur(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                            />

                            <TextField
                              // label="totalFine"
                              name="totalFine"
                              className=""
                              value={element.totalFine || ""}
                              error={
                                element.errors !== undefined
                                  ? element.errors.totalFine
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.totalFine
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled
                            />

                            <TextField
                              // label="fineRate"
                              name="fineRate"
                              className=""
                              value={isView ? Config.numWithComma(element?.fineRate) : element.fineRate || ""}
                              error={
                                element.errors !== undefined
                                  ? element.errors.fineRate
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.fineRate
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled
                            />

                            <TextField
                              // label="catRatePerGram"
                              name="catRatePerGram"
                              className=""
                              value={isView ? Config.numWithComma(element?.catRatePerGram) : element.catRatePerGram || ""}
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
                              disabled
                            />

                            <TextField
                              // label="amount"
                              name="amount"
                              className=""
                              value={isView ? Config.numWithComma(element?.amount) : element.amount || ""}
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

                            <TextField
                              // label="hallmarkCharges"
                              name="hallmarkCharges"
                              className=""
                              value={isView ? Config.numWithComma(element?.hallmarkCharges) : element.hallmarkCharges || ""}
                              error={
                                element.errors !== undefined
                                  ? element.errors.hallmarkCharges
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.hallmarkCharges
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled
                            />

                            <TextField
                              // label="totalAmount"
                              name="totalAmount"
                              className=""
                              value={isView ? Config.numWithComma(element?.totalAmount) : element.totalAmount || ""}
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
                                  value={isView ? Config.numWithComma(element?.cgstVal) : element.cgstVal || ""}
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
                                  value={isView ? Config.numWithComma(element?.sGstVal) : element.sGstVal || ""}
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
                                  value={isView ? Config.numWithComma(element?.IGSTVal) : element.IGSTVal || ""}
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
                                  value={isView ? Config.numWithComma(element?.cgstVal) : element.cgstVal || ""}
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
                                  value={isView ? Config.numWithComma(element?.sGstVal) : element.sGstVal || ""}
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
                                  value={isView ? Config.numWithComma(element?.IGSTVal) : element.IGSTVal || ""}
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
                              value={isView ? Config.numWithComma(element?.total) : element.total || ""}
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
                              {/* delete */}
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
                          {HelperFunc.getTotalOfField(formValues, "netWeight")}
                            {/* Net Weight */}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                            {/* Purity */}
                          </div>

                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                            {/* Wastage (%) */}
                          </div>

                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                          {HelperFunc.getTotalOfField(formValues, "wastageFine")}
                            {/* Wastage Fine */}
                          </div>

                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                          {HelperFunc.getTotalOfField(formValues, "otherTagAmount")}
                            {/* Other Tag Amount */}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                          {HelperFunc.getTotalOfField(formValues, "totalFine")}
                            {/* Total Fine */}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                          {HelperFunc.getTotalOfField(formValues, "fineRate")}
                            {/* Fine Rate */}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                            {/* Category Rate */}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                            {/* Amount */}
                            {isView ? Config.numWithComma(amount) : amount}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                          {HelperFunc.getTotalOfField(formValues, "hallmarkCharges")}   
                            {/* Hallmark Charges */}
                          </div>
                          <div className={clsx(classes.tableheader, "castum-width-table")}>
                            {/* Total Amount */}
                            {isView ? Config.numWithComma(totalAmount) : totalAmount}
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

              {selectedLoad === "0" && (
                <Grid className="mt-16 salesjobwork-table-main tab-add-sales-domesic addsalesdomestic_dv">
                  <div className={classes.root}>
                    <AppBar position="static">
                      <Tabs value={modalView} onChange={handleChangeTab}>
                        <Tab label="Category Wise List" />
                        <Tab label="Tag Wise List" />
                        <Tab label="Packet Wise List" />
                        <Tab label="Packing Slip Wise List" />
                        <Tab label="Bill Of Material" />
                      </Tabs>
                    </AppBar>
                    {modalView === 0 && (
                      <CategoryWiseList productData={productData} isView={isView} />
                    )}
                    {modalView === 1 && (
                      <TagWiseList tagWiseData={tagWiseData} isView={isView} />
                    )}
                    {modalView === 2 && (
                      <PacketWiseList packetData={packetData} isView={isView} />
                    )}
                    {modalView === 3 && (
                      <PackingSlipWiseList
                        packingSlipData={packingSlipData}
                        deleteHandler={deleteHandler}
                        isView={isView}
                      />
                    )}
                    {modalView === 4 && (
                      <BillOfMaterial billMaterialData={billMaterialData} isView={isView} />
                    )}
                  </div>
                </Grid>
              )}

              <Grid className="export-metal-mt pt-export-metal-dv" item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  // style={{ float: "right" }}
                  className="w-224 mx-auto mt-16 mb-16"
                  aria-label="Register"
                  disabled={isView ||selectedLoad === "1" && formValues[0].otherTagAmount===""|| selectedLoad === "1" &&formValues[0].otherTagAmount == 0  ||selectedLoad === "2" && formValues[0].otherTagAmount===""|| selectedLoad === "2" &&formValues[0].otherTagAmount == 0 || selectedLoad === "3" && formValues[0].otherTagAmount===""|| selectedLoad === "3" &&formValues[0].otherTagAmount == 0}        
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
                  <label className="ml-2"> {isView ? Config.numWithComma(totalGST) : totalGST}</label>
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
                      className={clsx(classes.inputBoxTEST, "ml-2  addconsumble-dv")}
                      type={isView ? "text" : "number"}
                      disabled={isView || subTotal === "" }
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
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label className="mr-2">Total Invoice Amount : </label>
                  <label className="ml-2"> {isView ? Config.numWithComma(totalInvoiceAmount) : totalInvoiceAmount}</label>
                </div>
              </div>

              {!props.viewPopup && <div
                className="mt-16"
                style={{ border: "1px solid lightgray", paddingBottom: 5 }}
              >
                <div
                  className="table-row-source"
                  style={{ background: "lightgray", fontWeight: "700" }}
                >
                  <div className={classes.tableheader}>Ledger Name</div>

                  <div className={classes.tableheader}>TDS/TCS Vou. Num</div>

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
                    style={{ width: "100%" }}
                    // components={components}
                    blurInputOnSelect
                    tabSelectsValue={false}
                    value={ledgerName}
                    isDisabled={total==0 || isView}
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
                    disabled
                  />
                </div>
              </div>
              }

              <div
                id="jewellery-head"
                className="mt-16 "
                style={{
                  border: "1px solid lightgray",
                  background: "lightgray",
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
                <TextField
                  className="mt-16 mr-2"
                  style={{ width: "50%" }}
                  label="jewellery Narration"
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
              </div>
              {!props.viewPopup && <div>
                {!mainView  &&
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ float: "right" }}
                    className="w-224 mx-auto mt-16"
                    aria-label="Register"
                    disabled={total == 0}
                    // type="submit"
                    onClick={(e) => {
                      handleFormSubmit(e);
                      // setInvoiceOpen(true)
                    }}
                  >
                    Save
                  </Button>
                }
                  {/* {mainView && <Button
                  variant="contained"
                  // color="primary"
                  style={{ float: "right", backgroundColor: "limegreen" }}
                  className="w-224 mx-auto mt-16 mr-16"
                  aria-label="Register"
                    // disabled={total==0}
                  // type="submit"
                  onClick={() => setInvoiceModal(true)}
                >
                  E-INVOICE
                </Button>} */}

                <Button
                  variant="contained"
                  // color="primary"
                  style={{ float: "right", backgroundColor: "#415bd4" }}
                  className="w-224 mx-auto mt-16 mr-16"
                  aria-label="Register"
                    disabled={total == 0}
                    onClick={(e) => {
                      // handleFormSubmit(e);
                      checkforPrint()
                      // setInvoiceOpensave(true)
                    }}
                >
                  {mainView ? "Print" : "Save & Print"}
                </Button>

                <div style={{ display: "none" }}>
                  <SalesDomesticPrint 
                  ref={componentRef} 
                  printObj={printObj} 
                   getDateAndTime={getDateAndTime()}

                  />
                </div>

                {/* {mainView &&
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
                } */}

              </div>
              }
              {isView &&
                <Button
                  variant="contained"
                  className={clsx(classes.button, "mt-16 mr-16")} onClick={() => setDocModal(true)}>
                  View Documents
                </Button>
              }
              </div>

            
              <ViewDocModal 
                    documentList={documentList} 
                    handleClose={handleDocModalClose} 
                    open={docModal} 
                    updateDocument={updateDocumentArray}
                    purchase_flag_id={idToBeView?.id} 
                    purchase_flag="22" 
                    concateDocument={concateDocument} 
                    viewPopup={props.viewPopup} 
                />

             {/* <EInvoice  
                  handleClose={handleDocModalClose} 
                  open={invoiceModal} 
                  id={idToBeView} 
                  flag={invoiceflag} 
                  InvoiceDate={InvoiceDate} 
                  InvoiceIRN={InvoiceIRN} 
                  isgenerate={isgenerate}
               /> */}

               {/* {console.log(InvoiceIRN)} */}

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
                      className={clsx(classes.inputBoxTEST, "mx-16")}
                      type={isView ? "text" : "number"}
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
              open={rfModalOpen}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleRfModalClose();
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
                  Rate Fix
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={handleRfModalClose}
                  ><Icon style={{ color: "white" }}>
                      close
                    </Icon></IconButton>
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
                                {/* {console.log(row.checked)} */}
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
                                {moment.utc(row.date).local().format("DD-MM-YYYY")}
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
                                    error={row.utiliseErr.length > 0 ? true : false}
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
                  <TextField
                    label="Shortage of Rate fix"
                    name="shortageRfix"
                    className="mt-16"
                    value={isNaN(shortageRfix) ? 0 : shortageRfix}
                    error={shortageRfixErr.length > 0 ? true : false}
                    helperText={shortageRfixErr}
                    onChange={(e) => handleRfixChange(e)}
                    variant="outlined"
                    style={{ width: "45%" }}
                    disabled
                  />

                  <TextField
                    label="temp Rate"
                    name="tempRate"
                    className={clsx(classes.inputBoxTEST, "mt-16 ml-56")}
                    type={isView ? "text" : "number"}
                    value={tempRate}
                    error={tempRateErr.length > 0 ? true : false}
                    helperText={tempRateErr}
                    onChange={(e) => handleRfixChange(e)}
                    variant="outlined"
                    style={{ width: "45%" }}
                  />

                  <TextField
                    label="Average Rate"
                    name="avgRate"
                    className="mt-16"
                    value={isNaN(avgRate) ? 0 : avgRate}
                    error={avgRateErr.length > 0 ? true : false}
                    helperText={avgRateErr}
                    onChange={(e) => handleRfixChange(e)}
                    variant="outlined"
                    fullWidth
                    disabled
                  />

                  <Button
                    variant="contained"
                    color="primary"
                    className="w-full mx-auto mt-16"
                    style={{
                      backgroundColor: "#415bd4",
                      border: "none",
                      color: "white",
                    }}
                    onClick={(e) => adjustRateFix(e)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </Modal>

          <Dialog
                 open={InvoiceOpen || InvoiceOpensave}
                 onClose={handleClose}
                 aria-labelledby="alert-dialog-title"
                 aria-describedby="alert-dialog-description"
                >
                <DialogTitle id="alert-dialog-title">{"Generate E-Invoice"}</DialogTitle>
                  <DialogContent>
                     <DialogContentText id="alert-dialog-description">
                        Are you sure you want to generate e-invoice numbe ?
                      </DialogContentText>
                  </DialogContent>
             <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
          {InvoiceOpen === true && 
           <Button
            onClick={(e) => {
              handleFormSubmit(e);
             // setInvoiceOpen(true)
              }}
              color="primary"
              autoFocus
          >
            Yes
          </Button>  }
          {InvoiceOpensave === true && 

           <Button
               onClick={(e) => {
               checkforPrint()
                // setInvoiceOpen(true)
                }}
                color="primary"
                autoFocus
           >
            Yes
            </Button>}
          </DialogActions>
        </Dialog>

       </div>
      </div>
     </div>
    </FuseAnimate>
    </div>
  );
};

export default AddSalesDomestic;

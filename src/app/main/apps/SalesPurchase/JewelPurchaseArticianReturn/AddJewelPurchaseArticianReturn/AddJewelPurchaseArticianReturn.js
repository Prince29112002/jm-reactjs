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

import Select, { createFilter } from "react-select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Modal from "@material-ui/core/Modal";
import History from "@history";
import Loader from "app/main/Loader/Loader";
import moment from "moment";
import { Icon, IconButton } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CategoryWiseList from "../Components/CategoryWiseList";
import TagWiseList from "../Components/TagWiseList";
import PacketWiseList from "../Components/PacketWiseList";
import PackingSlipWiseList from "../Components/PackingSlipWise";
import BillOfMaterial from "../Components/BillOfMaterial";
import HelperFunc from "../../Helper/HelperFunc";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import { JewelPurArticianReturnPrintComp } from "../Components/JewelPurArticianReturnPrintComp";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
import { UpdateNarration } from "../../Helper/UpdateNarration";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
  },
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
  rateFixPaper: {
    position: "absolute",
    width: 600,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
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
  hoverClass: {
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#999",
      cursor: "pointer",
    },
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

const AddJewelPurchaseArticianReturn = (props) => {
  const [isView, setIsView] = useState(false); //for view Only
  const dispatch = useDispatch();
  const componentRef = React.useRef(null);
  const [printObj, setPrintObj] = useState({
    loadType: "",
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
    fineRate: "",
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
    documentTitle: " Jewellery Purchase Return (Artician Return) Voucher " + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  function checkforPrint(e) {
    if (
      voucherNumValidation() &&
      partyNameValidation() &&
      oppositeAcValidation()
      // partyVoucherNumValidation()
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (isView) {
        handlePrint();
      } else if(handleDateBlur()){
        if (shippingVendValidation() && shippingCompValidation()) {
          checkAndCallApi(false, true)
        } else {
          checkAndCallApi(false, true)
        }
      }
    } else {
      console.log("else");
    }
  }
  const [documentList, setDocumentList] = useState([])
  const [docModal, setDocModal] = useState(false)
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);
  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 19)
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

  React.useEffect(() => {
    if (
      // text === "New, Updated Text!" &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      onBeforeGetContentResolve.current();
    }
    //eslint-disable-next-line
  }, [onBeforeGetContentResolve.current]);//, text
  const [modalView, setModalView] = useState(0);
  const loadTypeRef = useRef(null)

  // const handleClick = (event) => {
  //   if (validateShipping()) {
  //     setIsCsvErr(false);

  //     // if (isVoucherSelected) {
  //     hiddenFileInput.current.click();
  //     // } else {
  //     // setSelectVoucherErr("Please Select Voucher");
  //     // }
  //   }
  // };
  // const handlefilechange = (event) => {
  //   handleFile(event);
  //   console.log("handlefilechange");
  // };

  const [modalStyle] = useState(getModalStyle);

  // <option value="0"> Load Packing Slip </option>
  // <option value="1"> Load Finding Variant </option>
  // <option value="2"> Load Lot directly </option>

  const [selectedLoad, setSelectedLoad] = useState("");
  const [selectedLoadErr, setSelectedLoadErr] = useState("");

  const [loading, setLoading] = useState(false);

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [jobworkerData, setJobworkerData] = useState([]);
  const [selectedJobWorker, setSelectedJobWorker] = useState("");
  const [selectedJobWorkerErr, setSelectedJobWorkerErr] = useState("");

  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");
  const [address, setAddress] = useState("");
  const [supplierGstUinNumber, setSupplierGstUinNum] = useState("");
  const [supPanNumber, setSupPanNum] = useState("");
  const [supStateName, setSupState] = useState("");
  const [supCountryName, setSupCountry] = useState("");
  // const [csvData, setCsvData] = useState([]);
  // const [isCsvErr, setIsCsvErr] = useState(false);

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");

  const [shipping, setShipping] = useState("");
  const [shippingErr, setShippingErr] = useState("");

  const [shippingVendor, setShippingVendor] = useState("");
  const [shipVendErr, setShipVendErr] = useState("");

  const [clientCompanies, setClientCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompErr, setSelectedCompErr] = useState("");

  const [clientdata, setClientdata] = useState([]);

  const [roundOff, setRoundOff] = useState("");
  const [roundOffErr, SetRoundOffErr] = useState("");

  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState("");

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [jewelNarration, setJewelNarration] = useState("");
  const [jewelNarrationErr, setJewelNarrationErr] = useState("");

  const [vendorStateId, setVendorStateId] = useState("");

  const [totalGrossWeight, setTotalGrossWeight] = useState("");
  const [fineTotal, setFineTotal] = useState("");
  const [totalNetWeight, setTotalNetWeight] = useState("");
  const [pcsTotal, setPcsTotal] = useState("");
  const [subTotal, setSubTotal] = useState("");
  const [totalGST, setTotalGST] = useState("");

  // const [voucherModalOpen, setvoucherModalOpen] = useState(false);
  // const [isVoucherSelected, setIsVoucherSelected] = useState(false);
  // const [selectedVoucher, setSelectedVoucher] = useState("");
  // const [selectVoucherErr, setSelectVoucherErr] = useState("");

  // const [voucherApiData, setVoucherApiData] = useState([]);
  const [jobWorkerGst, setJobWorkerGst] = useState("");
  const [jobworkerHSN, setJobWorkerHSN] = useState("");

  const [OtherTagAmount, setOtherTagAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [cgstVal, setCgstVal] = useState("");
  const [sgstVal, setSgstVal] = useState("");
  const [igstVal, setIgstVal] = useState("");
  const [total, setTotal] = useState("");
  const [fineGoldTotal, setFineGoldTotal] = useState("");

  const [fileSelected, setFileSelected] = useState("");
  const [isUploaded, setIsuploaded] = useState(false);

  const [oppositeAccData, setOppositeAccData] = useState([]);
  const [oppositeAccSelected, setOppositeAccSelected] = useState("");
  const [selectedOppAccErr, setSelectedOppAccErr] = useState("");

  const [stockCodeData, setStockCodeData] = useState([]);

  const [lotdata, setLotData] = useState([]);

  const [fineRate, setFineRate] = useState("");
  const [fineRateErr, setFineRateErr] = useState("");

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

  const theme = useTheme();

  const pcsInputRef = useRef([])//for pcs in table

  const [packingSlipNo, setPackingSlipNo] = useState("");
  const [packingSlipErr, setPackingSlipErr] = useState("");

  const [packingSearch, setPackingSearch] = useState("");

  const [packingSlipApiData, setPackingSlipApiData] = useState([]);

  const [packingSlipIdArr, setPackingSlipIdArr] = useState([]);

  const [packingSlipData, setPackingSlipData] = useState([]); //packing slip wise
  const [packetData, setPacketData] = useState([]); //packet wise Data
  const [productData, setProductData] = useState([]); //category wise Data
  const [billMaterialData, setBillmaterialData] = useState([]); //bill of material Data
  const [tagWiseData, setTagWiseData] = useState([]); //tag wise Data
  const [isIgst, setIsIgst] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (packingSearch) {
        if (fineRate === "") {
          dispatch(
            Actions.showMessage({ message: "Please Set Fine Rate First" })
          );
        } else {
          getPackingSlipData(packingSearch);
        }
      } else {
        setPackingSlipApiData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
    //eslint-disable-next-line
  }, [packingSearch]);

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

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  const handleChangeTab = (event, value) => {
    setModalView(value);
  };

  const [rateProfiles, setRateProfiles] = useState([]);

  const [todayGoldRate, setTodayGoldRate] = useState('')

  useEffect(()=>{
    getTodaysGoldRate()
  },[])

  function getTodaysGoldRate() {
    axios
      .get(Config.getCommonUrl() + "api/goldRateToday")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setFineRate(response.data.data.rate);
          setTodayGoldRate(response.data.data.rate);
        } 
        else {
          dispatch(
            Actions.showMessage({
              message: "Today's Gold Rate is not set",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {api : "api/goldRateToday"})
      });
  }

  if (props.location) {
    var idToBeView = props.location.state;
  } else if (props.voucherId) {
    var idToBeView = { id: props.voucherId }
  }
  const [narrationFlag, setNarrationFlag] = useState(false)
  const [userFormValues, setUserFormValues] = useState([
    {
      loadType: "",
      category: "",
      billingCategory: "",
      HSNNum: "",
      lotNumber: "",
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
      jobworkFineUtilize: "",
      wastagePer: "",
      wastageFine: "",
      fineRate: "",
      labourFineAmount: "",
      otherTagAmount: "",
      catRatePerGram: "",
      // amount: "",
      // hallmarkCharges: "",
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
        // amount: null,
        // hallmarkCharges: null,
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
      loadType: "",
      category: "",
      billingCategory: "",
      HSNNum: "",
      lotNumber: "",
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
      jobworkFineUtilize: "",
      wastagePer: "",
      wastageFine: "",
      fineRate: "",
      labourFineAmount: "",
      otherTagAmount: "",
      catRatePerGram: "",
      // amount: "",
      // hallmarkCharges: "",
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
        // amount: null,
        // hallmarkCharges: null,
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
      loadType: "",
      category: "",
      billingCategory: "",
      HSNNum: "",
      lotNumber: "",
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
      jobworkFineUtilize: "",
      wastagePer: "",
      wastageFine: "",
      fineRate: "",
      labourFineAmount: "",
      otherTagAmount: "",
      catRatePerGram: "",
      // amount: "",
      // hallmarkCharges: "",
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
        // amount: null,
        // hallmarkCharges: null,
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
      loadType: "",
      category: "",
      billingCategory: "",
      HSNNum: "",
      lotNumber: "",
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
      jobworkFineUtilize: "",
      wastagePer: "",
      wastageFine: "",
      fineRate: "",
      labourFineAmount: "",
      otherTagAmount: "",
      catRatePerGram: "",
      // amount: "",
      // hallmarkCharges: "",
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
        // amount: null,
        // hallmarkCharges: null,
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

  useEffect(() => {
    setOppositeAccData(HelperFunc.getOppositeAccountDetails("JewelleryPurchaseArticianReturn"));

    console.log("idToBeView", idToBeView);
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true)
      getJewelPurchArtReturnRecordForView(idToBeView.id);
    } else {
      setNarrationFlag(false)
      getJobworkerdata();
      getClientData(); //for shipping
      getStockCodeFindingVariant();
      getStockCodeStone();
      getLotData();
      getJobWorkHsnGst()
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
          dispatch(Actions.showMessage({ message: response.data.error.message }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/hsnmaster/hsn/readjobworkhsn" })

      });
  }

  function getJewelPurchArtReturnRecordForView(id) {
    setLoading(true);
    let api = ""
    if(props.forDeletedVoucher){
      api = `api/jewelleryPurchaseArticianReturn/${id}?deleted_at=1`
    }else {
      api = `api/jewelleryPurchaseArticianReturn/${id}`
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
              console.log("finalData ==", finalData)
              let otherDetail = response.data.data.otherDetails;
              setDocumentList(finalData.salesPurchaseDocs)

              setSelectedLoad(otherDetail.loadType.toString());

              // if (otherDetail.loadType === 1) {
              //   // setUploadType(otherDetail.uploadType);
              //   // setBomType(otherDetail.selectBom);
              // }
              setTimeDate(response.data.data.data.created_at);
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

              // setIs_tds_tcs(finalData.jobworker.is_tds_tcs);

              setOppositeAccSelected({
                value: finalData.opposite_account_id,
                label: finalData.OppositeAccount.name,
              });
              setPartyVoucherNum(finalData.party_voucher_no);
              setRoundOff(
                finalData.round_off === null ? "" : finalData.round_off
              );

              // if (finalData.TdsTcsVoucher !== null) {
              //   setTdsTcsVou(finalData.TdsTcsVoucher.voucher_no);
              //   setLedgerName(finalData.TdsTcsVoucher.voucher_name);
              // }

              // setRateValue(finalData.tds_or_tcs_rate);

              // setLegderAmount(
              //   Math.abs(
              //     parseFloat(
              //       parseFloat(finalData.final_invoice_amount) -
              //         parseFloat(finalData.total_invoice_amount)
              //     ).toFixed(3)
              //   )
              // );
              setShipping((finalData.is_shipped).toString())

              if (finalData.is_shipped === 1) {
                setShippingVendor({
                  value: finalData.ShippingClient.id,
                  label: finalData.ShippingClient.name
                })

                setSelectedCompany({
                  value: finalData.ShippingClientCompany.id,
                  label: finalData.ShippingClientCompany.company_name
                })
              }

              setTotalInvoiceAmount(
                parseFloat(finalData.total_invoice_amount).toFixed(3)
              );
              // setFinalAmount(
              //   parseFloat(finalData.final_invoice_amount).toFixed(3)
              // );

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

              setFineRate(finalData.JewelleryPurchaseArticianReturnOrder[0].fine_rate)

              let tempjobWorkerGst = response.data.data.jobWorkHsn.gst;
              setJobWorkerGst(tempjobWorkerGst)

              let JWHSN = response.data.data.jobWorkHsn.hsn_number;
              setJobWorkerHSN(JWHSN);
              console.log(tempjobWorkerGst, JWHSN)
              let igstValue = finalData.JewelleryPurchaseArticianReturnOrder[0].igst;
              let tempArray = [];

              if (otherDetail.loadType === 0) {
                let tempPackingSlipData = response.data.data.packingSlipData;
                // console.log(tempPackingSlipData)
                let data = HelperFunc.packingSlipViewDataJewelPurcArticianReturn(tempPackingSlipData, finalData.JewelleryPurchaseArticianReturnOrder[0].fine_rate,
                  finalData.jobworker.state, tempjobWorkerGst, JWHSN, igstValue)
                console.log(">>>>>>>>>>>>>>>>>", data)
                setIsIgst(igstValue === null ? false : true)
                setPackingSlipData(data.packingSlipArr);
                setPacketData(data.packetDataArr)
                setProductData(data.ProductDataArr);
                setTagWiseData(data.tagWiseDataArr);
                setBillmaterialData(data.bomDataArr);

                function amount(item) {
                  // console.log(item.amount)
                  return item.totalAmount;
                }
                function IGSTVal(item) {
                  return item.IGSTVal;
                }

                function sGstVal(item) {
                  return parseFloat(item.sGstVal)
                }

                function cgstVal(item) {
                  return parseFloat(item.cgstVal)
                }

                function grossWeight(item) {
                  // console.log(parseFloat(item.grossWeight));
                  return parseFloat(item.gross_wgt);
                }
                function netWeight(item) {
                  return parseFloat(item.net_wgt);
                }

                let tempAmount = data.ProductDataArr
                  .filter((item) => item.totalAmount !== "")
                  .map(amount)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setTotalAmount(parseFloat(tempAmount).toFixed(3));

                let tempIgstVal = data.ProductDataArr
                  .filter((item) => item.IGSTVal !== "")
                  .map(IGSTVal)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setIgstVal(parseFloat(tempIgstVal).toFixed(3));

                let tempGrossWtTot = parseFloat(data.ProductDataArr
                  .filter((data) => data.gross_wgt !== "")
                  .map(grossWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3)
                setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3))

                let tempNetWtTot = parseFloat(
                  data.ProductDataArr
                    .filter((data) => data.net_wgt !== "")
                    .map(netWeight)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0)
                ).toFixed(3)
                setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

                let tempSgstVal = parseFloat(
                  data.ProductDataArr
                    .filter((data) => data.sGstVal !== "")
                    .map(sGstVal)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0)
                ).toFixed(3)

                let tempCgstVal = parseFloat(
                  data.ProductDataArr
                    .filter((data) => data.cgstVal !== "")
                    .map(cgstVal)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0)
                ).toFixed(3)

                setPrintObj({
                  stateId: finalData.jobworker.state,
                  supplierName: finalData.jobworker.firm_name,
                  supAddress: finalData.jobworker.address,
                  supplierGstUinNum: finalData.jobworker.gst_number,
                  supPanNum: finalData.jobworker.pan_number,
                  supState: finalData.jobworker.state_name.name,
                  supCountry: finalData.jobworker.country_name.name,
                  supStateCode: (finalData.jobworker.gst_number) ? finalData.jobworker.gst_number.substring(0, 2) : '',
                  purcVoucherNum: finalData.voucher_no,
                  partyInvNum: finalData.party_voucher_no,
                  voucherDate: moment(finalData.purchase_voucher_create_date).format("DD-MM-YYYY"),
                  placeOfSupply: finalData.jobworker.state_name.name,
                  loadType: otherDetail.loadType.toString(),
                  orderDetails: data.ProductDataArr,
                  taxableAmount: parseFloat(tempAmount).toFixed(3),
                  sGstTot: tempSgstVal ? parseFloat(tempSgstVal).toFixed(3) : "",
                  cGstTot: tempCgstVal ? parseFloat(tempCgstVal).toFixed(3) : "",
                  iGstTot: tempIgstVal ? parseFloat(tempIgstVal).toFixed(3) : "",
                  roundOff: finalData.round_off === null ? "" : finalData.round_off,
                  grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
                  netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                  totalInvoiceAmt: parseFloat(finalData.total_invoice_amount).toFixed(3),
                  metNarration: finalData.jewellery_narration !== null ? finalData.jewellery_narration : "",
                  accNarration: finalData.account_narration !== null ? finalData.account_narration : "",
                  balancePayable: parseFloat(finalData.total_invoice_amount).toFixed(3),
                  signature: finalData.admin_signature,

                })
              } else if (otherDetail.loadType === 1) {
                //finding variant
                // console.log(OrdersData);
                for (let item of finalData.JewelleryPurchaseArticianReturnOrder) {
                  // console.log(item);
                  tempArray.push({
                    loadType: otherDetail.loadType.toString(),
                    category: {
                      value: item.StockNameCode.id,
                      label: item.StockNameCode.stock_code,
                    },
                    billingCategory: item.StockNameCode.stock_name_code.billing_name,
                    HSNNum: item.hsn_number ? item.hsn_number : '',//item.StockNameCode.stock_name_code.hsn_master.hsn_number,
                    // lotNumber: "",
                    pieces: item.pcs,
                    grossWeight: parseFloat(item.gross_wt).toFixed(3),
                    netWeight: parseFloat(item.net_wt).toFixed(3),
                    // isWeightDiff: "",
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
                    purity: item.purity,
                    jobworkFineUtilize: parseFloat(item.jobwork_fine_utilize).toFixed(3),
                    wastagePer: parseFloat(item.wastage_per).toFixed(3),
                    wastageFine: item.wastage_fine,
                    fineRate: parseFloat(item.fine_rate).toFixed(3),
                    labourFineAmount: parseFloat(item.labour_fine_amount).toFixed(3),
                    otherTagAmount: parseFloat(item.other_tag_amount).toFixed(3),
                    catRatePerGram: parseFloat(item.category_rate).toFixed(3),
                    // amount: "",
                    // hallmarkCharges: "",
                    totalAmount: parseFloat(item.total_amount).toFixed(3),
                    cgstPer: parseFloat(parseFloat(tempjobWorkerGst) / 2).toFixed(3),
                    cgstVal:
                      item.cgst !== null
                        ? parseFloat((parseFloat(item.total_amount) * (parseFloat(tempjobWorkerGst) / 2)) / 100).toFixed(3)
                        : "",
                    sGstPer: parseFloat(parseFloat(tempjobWorkerGst) / 2).toFixed(3),
                    sGstVal:
                      item.sgst !== null
                        ? parseFloat((parseFloat(item.total_amount) * (parseFloat(tempjobWorkerGst) / 2)) / 100).toFixed(3)
                        : "",
                    IGSTper: parseFloat(tempjobWorkerGst).toFixed(3),
                    IGSTVal:
                      item.igst !== null
                        ? parseFloat((parseFloat(item.total_amount) * parseFloat(tempjobWorkerGst)) / 100).toFixed(3)
                        : "",
                    total: parseFloat(item.total).toFixed(3),
                  });
                }
                setUserFormValues(tempArray);


              } else if (otherDetail.loadType === 2) {
                // load lot directly

                for (let item of finalData.JewelleryPurchaseArticianReturnOrder) {
                  // console.log(item);
                  tempArray.push({
                    loadType: otherDetail.loadType.toString(),
                    // category: {
                    //   value: item.StockNameCode.id,
                    //   label: item.StockNameCode.stock_code,
                    // },
                    billingCategory: item.ProductCategory.billing_category_name,
                    HSNNum: item.hsn_number ? item.hsn_number : '',// item.ProductCategory.hsn_master.hsn_number,
                    lotNumber: {
                      value: item.Lot.id,
                      label: item.Lot.number,
                    },
                    pieces: item.pcs,
                    grossWeight: parseFloat(item.gross_wt).toFixed(3),
                    netWeight: parseFloat(item.net_wt).toFixed(3),
                    // isWeightDiff: "",
                    // DiffrentStock: [
                    //   {
                    //     setStockCodeId: "",
                    //     setPcs: "",
                    //     setWeight: "",
                    //     errors: {
                    //       setStockCodeId: null,
                    //       setPcs: null,
                    //       setWeight: null,
                    //     },
                    //   },
                    // ],
                    purity: item.purity,
                    jobworkFineUtilize: parseFloat(item.jobwork_fine_utilize).toFixed(3),
                    wastagePer: parseFloat(item.wastage_per).toFixed(3),
                    wastageFine: item.wastage_fine,
                    fineRate: parseFloat(item.fine_rate).toFixed(3),
                    labourFineAmount: parseFloat(item.labour_fine_amount).toFixed(3),
                    otherTagAmount: parseFloat(item.other_tag_amount).toFixed(3),
                    catRatePerGram: parseFloat(item.category_rate).toFixed(3),
                    // amount: "",
                    // hallmarkCharges: "",
                    totalAmount: parseFloat(item.total_amount).toFixed(3),
                    cgstPer: parseFloat(parseFloat(tempjobWorkerGst) / 2).toFixed(3),
                    cgstVal:
                      item.cgst !== null
                        ? parseFloat((parseFloat(item.total_amount) * (parseFloat(tempjobWorkerGst) / 2)) / 100).toFixed(3)
                        : "",
                    sGstPer: parseFloat(parseFloat(tempjobWorkerGst) / 2).toFixed(3),
                    sGstVal:
                      item.sgst !== null
                        ? parseFloat((parseFloat(item.total_amount) * (parseFloat(tempjobWorkerGst) / 2)) / 100).toFixed(3)
                        : "",
                    IGSTper: parseFloat(tempjobWorkerGst).toFixed(3),
                    IGSTVal:
                      item.igst !== null
                        ? parseFloat((parseFloat(item.total_amount) * parseFloat(tempjobWorkerGst)) / 100).toFixed(3)
                        : "",
                    total: parseFloat(item.total).toFixed(3),
                  });
                }
                setUserFormValues(tempArray);
              }

              if (otherDetail.loadType === 1 || otherDetail.loadType === 2) {

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
                // setSubTotal(parseFloat(tempAmount).toFixed(3));

                // setCgstVal("");
                // setSgstVal("");
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
                // setTotalGST(
                //   (parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
                // );

                // setIgstVal("");
                // setTotalGST("")

                let tempIgstVal = tempArray
                  .filter((item) => item.IGSTVal !== "")
                  .map(IGSTVal)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setIgstVal(parseFloat(tempIgstVal).toFixed(3));
                // setTotalGST(parseFloat(tempIgstVal).toFixed(3));

                let tempTotal = tempArray
                  .filter((item) => item.total !== "")
                  .map(Total)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setTotal(parseFloat(tempTotal).toFixed(3));


                function fine(item) {
                  return parseFloat(item.totalFine);
                }

                let tempFineGold = tempArray
                  .filter((item) => item.totalFine !== "")
                  .map(fine)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

                function grossWeight(item) {
                  // console.log(parseFloat(item.grossWeight));
                  return parseFloat(item.grossWeight);
                }

                let tempGrossWtTot = parseFloat(tempArray
                  .filter((data) => data.grossWeight !== "")
                  .map(grossWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3)
                setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3))

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
                ).toFixed(3)
                setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

                setPrintObj({
                  stateId: finalData.jobworker.state,
                  supplierName: finalData.jobworker.firm_name,
                  supAddress: finalData.jobworker.address,
                  supplierGstUinNum: finalData.jobworker.gst_number,
                  supPanNum: finalData.jobworker.pan_number,
                  supState: finalData.jobworker.state_name.name,
                  supCountry: finalData.jobworker.country_name.name,
                  supStateCode: (finalData.jobworker.gst_number) ? finalData.jobworker.gst_number.substring(0, 2) : '',
                  purcVoucherNum: finalData.voucher_no,
                  partyInvNum: finalData.party_voucher_no,
                  voucherDate: moment(finalData.purchase_voucher_create_date).format("DD-MM-YYYY"),
                  placeOfSupply: finalData.jobworker.state_name.name,
                  loadType: otherDetail.loadType.toString(),
                  orderDetails: tempArray,
                  taxableAmount: parseFloat(tempAmount).toFixed(3),
                  sGstTot: tempSgstVal ? parseFloat(tempSgstVal).toFixed(3) : "",
                  cGstTot: tempCgstVal ? parseFloat(tempCgstVal).toFixed(3) : "",
                  iGstTot: tempIgstVal ? parseFloat(tempIgstVal).toFixed(3) : "",
                  roundOff: finalData.round_off === null ? "" : finalData.round_off,
                  grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
                  netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                  totalInvoiceAmt: parseFloat(finalData.total_invoice_amount).toFixed(3),
                  metNarration: finalData.jewellery_narration !== null ? finalData.jewellery_narration : "",
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

  function getLotData() {
    axios
      .get(
        Config.getCommonUrl() +
        "api/lot/department/" +
        window.localStorage.getItem("SelectedDepartment")
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
        handleError(error, dispatch, {
          api: "api/lot/department/" +
            window.localStorage.getItem("SelectedDepartment")
        })

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
        Config.getCommonUrl() +
        "api/jewelleryPurchaseArticianReturn/get/voucher"
      )
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
        handleError(error, dispatch, { api: "api/jewelleryPurchaseArticianReturn/get/voucher" })

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
      setPrintObj({
        ...printObj,
        voucherNumber: value,
      })
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
    } else if (name === "fineRate") {
      setFineRate(value);

      const regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
      if (!value || regex.test(value) === false) {
        setFineRateErr("Enter Valid Fine Rate");
        if (selectedLoad === "0") {
          changeCalculationPackingSlip("0")
        } else if (selectedLoad === "1" || selectedLoad === "2") {
          calculateChangeRate("0")
        }
        setPrintObj({
          ...printObj,
          fineRate: "0"
        })
      } else {
        setFineRateErr("");
        if (selectedLoad === "0") {
          changeCalculationPackingSlip(value)
        } else if (selectedLoad === "1" || selectedLoad === "2") {
          calculateChangeRate(value)
        }
        setPrintObj({
          ...printObj,
          fineRate: value
        })
      }

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
        metNarration: value,
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
      let tempTotalInvoiceAmt = 0;
      let tempfinalAmount = 0;
      if (total > 0 && value !== "" && !isNaN(value)) {
        // console.log(parseFloat(total) + parseFloat(value))
        tempfinalAmount = parseFloat(total) + parseFloat(value);
        setTotalInvoiceAmount(parseFloat(tempfinalAmount).toFixed(3));
        // setLegderAmount(
        //   (((parseFloat(total) + parseFloat(value)) * rateValue) / 100).toFixed(
        //     2
        //   )
        // );
        // setFinalAmount(
        //   (
        //     parseFloat(total) +
        //     parseFloat(value) +
        //     parseFloat(
        //       ((parseFloat(total) + parseFloat(value)) * rateValue) / 100
        //     )
        //   ).toFixed(3)
        // );
      } else {
        tempTotalInvoiceAmt = parseFloat(total).toFixed(3);
        setTotalInvoiceAmount(tempTotalInvoiceAmt);
        // setLegderAmount((total * rateValue) / 100);
        // setFinalAmount(
        //   parseFloat(total) + parseFloat((total * rateValue) / 100)
        // );
      }
      setPrintObj({
        ...printObj,
        taxAmount: value,
        roundOff: value,
        totalInvoiceAmt: parseFloat(tempfinalAmount).toFixed(3),
        balancePayable: parseFloat(tempfinalAmount).toFixed(3)
      })
    }
  }

  const calculateChangeRate = (locFineRate) => {
    let newFormValues = userFormValues.map((item) => {

      if (selectedLoad === "1" ? item.category : item.lotNumber) {
        item.fineRate = parseFloat(locFineRate).toFixed(3)
      }

      if (
        item.wastageFine !== "" &&
        item.fineRate !== ""
      ) {
        item.labourFineAmount = parseFloat(
          (parseFloat(item.wastageFine) *
            parseFloat(item.fineRate)) /
          10
        ).toFixed(3);
      }

      if (item.labourFineAmount !== "") {
        if (item.otherTagAmount !== "") {
          item.totalAmount = parseFloat(
            parseFloat(item.labourFineAmount) +
            parseFloat(item.otherTagAmount)
          ).toFixed(3);
        } else {
          item.totalAmount = parseFloat(
            item.labourFineAmount
          ).toFixed(3);
        }
      }

      if (
        item.totalAmount !== "" &&
        item.netWeight !== ""
      ) {
        item.catRatePerGram = parseFloat(
          parseFloat(item.totalAmount) /
          parseFloat(item.netWeight)
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
              parseFloat(item.cgstPer)) /
            100
          ).toFixed(3);
          // console.log("CGSTval ",(item.amount * item.CGSTPer) / 100)

          item.sGstVal = parseFloat(
            (parseFloat(item.totalAmount) *
              parseFloat(item.sGstPer)) /
            100
          ).toFixed(3);
          item.total = parseFloat(
            parseFloat(item.totalAmount) +
            parseFloat(item.sGstVal) +
            parseFloat(item.cgstVal)
          ).toFixed(3);
          // console.log(
          //   parseFloat(item.amount),
          //   parseFloat(item.SGSTval),
          //   parseFloat(item.CGSTval)
          // );
        }
        // else {
        //   item.cgstVal = "";
        //   item.sGstVal = "";
        //   item.total = "";
        // }
      } else {
        if (
          item.totalAmount !== "" &&
          item.IGSTper !== ""
        ) {
          item.IGSTVal = parseFloat(
            (parseFloat(item.totalAmount) *
              parseFloat(item.IGSTper)) /
            100
          ).toFixed(3);
          item.total = parseFloat(
            parseFloat(item.totalAmount) +
            parseFloat(item.IGSTVal)
          ).toFixed(3);
        }
        // else {
        //   item.IGSTper = "";
        //   item.total = "";
        // }
      }

      return item;

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
    // setSubTotal(parseFloat(tempAmount).toFixed(3));

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
      // setTotalGST(
      //   (parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
      // );
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
      // setTotalGST(parseFloat(tempIgstVal).toFixed(3));
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
    let tempTotalInvoiceAmt = 0;
    // setShortageRfix(tempFineGold);
    if (parseFloat(tempTotal) > 0) {
      // let tempLedgerAmount = 0;
      // let tempfinalAmount = 0;
      // let tempTotalInvoiceAmt = 0;
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
      pcsTot: tempPcsTotal,
      totalInvoiceAmt: tempTotalInvoiceAmt,
      balancePayable: parseFloat(tempTotalInvoiceAmt).toFixed(3)
    })
    setUserFormValues(newFormValues);
  }

  const changeCalculationPackingSlip = (fineRateLoc) => {
    // console.log("changeCalculationPackingSlip", fineRateLoc)
    // console.log(packingSlipData)

    let tempPackSlip = packingSlipData.map((item) => {

      let labFineAmt = parseFloat(
        (parseFloat(item.wastageFine) * parseFloat(fineRateLoc)) / 10
      ).toFixed(3);
      let totAmt = parseFloat(
        parseFloat(labFineAmt) + parseFloat(item.other_amt)
      ).toFixed(3);

      let cgstPer =
        vendorStateId === 12
          ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
          : 0;

      let cgstVal =
        vendorStateId === 12
          ? parseFloat(
            (parseFloat(totAmt) * parseFloat(cgstPer)) / 100
          ).toFixed(3)
          : 0;

      let sGstPer =
        vendorStateId === 12
          ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
          : 0;

      let sgstVal =
        vendorStateId === 12
          ? parseFloat(
            (parseFloat(totAmt) * parseFloat(sGstPer)) / 100
          ).toFixed(3)
          : 0;

      let IGSTper =
        vendorStateId !== 12 ? parseFloat(jobWorkerGst).toFixed(3) : 0;

      let igstVal =
        vendorStateId !== 12
          ? parseFloat(
            (parseFloat(totAmt) * parseFloat(IGSTper)) / 100
          ).toFixed(3)
          : 0;

      let tot =
        vendorStateId === 12
          ? parseFloat(
            parseFloat(totAmt) + parseFloat(cgstVal) + parseFloat(sgstVal)
          ).toFixed(3)
          : parseFloat(parseFloat(totAmt) + parseFloat(igstVal)).toFixed(3);

      return {
        ...item,
        fineRate: parseFloat(fineRateLoc).toFixed(3),
        catRate: parseFloat(
          parseFloat(totAmt) / parseFloat(item.net_wgt)
        ).toFixed(3),
        labourFineAmount: parseFloat(labFineAmt).toFixed(3),
        totalAmount: totAmt,
        cgstPer: cgstPer,
        cgstVal: cgstVal,
        sGstPer: sGstPer,
        sGstVal: sgstVal,
        IGSTper: IGSTper,
        IGSTVal: igstVal,
        total: tot,
      };
    });

    // console.log(tempPackSlip)
    setPackingSlipData(tempPackSlip);

    // console.log(packetData)
    const newTempPacketData = packetData.map((item) => {

      let labFineAmt = parseFloat(
        (parseFloat(item.wastageFine) * parseFloat(fineRateLoc)) / 10
      ).toFixed(3);

      let totAmt = parseFloat(
        parseFloat(labFineAmt) + parseFloat(item.other_amt)
      ).toFixed(3);

      let cgstPer =
        vendorStateId === 12
          ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
          : 0;

      let cgstVal =
        vendorStateId === 12
          ? parseFloat(
            (parseFloat(totAmt) * parseFloat(cgstPer)) / 100
          ).toFixed(3)
          : 0;

      let sGstPer =
        vendorStateId === 12
          ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
          : 0;

      let sgstVal =
        vendorStateId === 12
          ? parseFloat(
            (parseFloat(totAmt) * parseFloat(sGstPer)) / 100
          ).toFixed(3)
          : 0;

      let IGSTper =
        vendorStateId !== 12 ? parseFloat(jobWorkerGst).toFixed(3) : 0;

      let igstVal =
        vendorStateId !== 12
          ? parseFloat(
            (parseFloat(totAmt) * parseFloat(IGSTper)) / 100
          ).toFixed(3)
          : 0;

      let tot =
        vendorStateId === 12
          ? parseFloat(
            parseFloat(totAmt) +
            parseFloat(cgstVal) +
            parseFloat(sgstVal)
          ).toFixed(3)
          : parseFloat(parseFloat(totAmt) + parseFloat(igstVal)).toFixed(3);

      return {
        ...item,
        fineRate: parseFloat(fineRateLoc).toFixed(3),
        catRate: parseFloat(
          parseFloat(totAmt) / parseFloat(item.net_wgt)
        ).toFixed(3),
        labourFineAmount: labFineAmt,
        totalAmount: totAmt,
        cgstPer: cgstPer,
        cgstVal: cgstVal,
        sGstPer: sGstPer,
        sGstVal: sgstVal,
        IGSTper: IGSTper,
        IGSTVal: igstVal,
        total: tot,
      };
    });

    // console.log(newTempPacketData)
    setPacketData(newTempPacketData);

    // console.log(productData)

    const newTempProductData = productData.map((item) => {

      let labFineAmt = parseFloat(
        (parseFloat(item.wastageFine) * parseFloat(fineRateLoc)) / 10
      ).toFixed(3);

      let totAmt = parseFloat(
        parseFloat(labFineAmt) + parseFloat(item.other_amt)
      ).toFixed(3);

      let cgstPer =
        vendorStateId === 12
          ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
          : 0;

      let cgstVal =
        vendorStateId === 12
          ? parseFloat(
            (parseFloat(totAmt) * parseFloat(cgstPer)) / 100
          ).toFixed(3)
          : 0;

      let sGstPer =
        vendorStateId === 12
          ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
          : 0;

      let sgstVal =
        vendorStateId === 12
          ? parseFloat(
            (parseFloat(totAmt) * parseFloat(sGstPer)) / 100
          ).toFixed(3)
          : 0;

      let IGSTper =
        vendorStateId !== 12 ? parseFloat(jobWorkerGst).toFixed(3) : 0;

      let igstVal =
        vendorStateId !== 12
          ? parseFloat(
            (parseFloat(totAmt) * parseFloat(IGSTper)) / 100
          ).toFixed(3)
          : 0;

      let tot =
        vendorStateId === 12
          ? parseFloat(
            parseFloat(totAmt) +
            parseFloat(cgstVal) +
            parseFloat(sgstVal)
          ).toFixed(3)
          : parseFloat(parseFloat(totAmt) + parseFloat(igstVal)).toFixed(
            3
          );

      return {
        ...item,
        fineRate: parseFloat(fineRateLoc).toFixed(3),
        catRate: parseFloat(
          parseFloat(totAmt) / parseFloat(item.net_wgt)
        ).toFixed(3),
        labourFineAmount: labFineAmt,
        totalAmount: totAmt,
        cgstPer: cgstPer,
        cgstVal: cgstVal,
        sGstPer: sGstPer,
        sGstVal: sgstVal,
        IGSTper: IGSTper,
        IGSTVal: igstVal,
        total: tot,
      };
    });

    // console.log(newTempProductData)

    setProductData(newTempProductData)

    // console.log(tagWiseData)

    const tempTagWise = tagWiseData.map((item) => {

      let labFineAmt = parseFloat(
        (parseFloat(item.wastageFine) * parseFloat(fineRateLoc)) / 10
      ).toFixed(3);

      let totAmt = parseFloat(
        parseFloat(labFineAmt) + parseFloat(item.other_amt)
      ).toFixed(3);

      let cgstPer =
        vendorStateId === 12
          ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
          : 0;

      let cgstVal =
        vendorStateId === 12
          ? parseFloat(
            (parseFloat(totAmt) * parseFloat(cgstPer)) / 100
          ).toFixed(3)
          : 0;

      let sGstPer =
        vendorStateId === 12
          ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
          : 0;

      let sgstVal =
        vendorStateId === 12
          ? parseFloat(
            (parseFloat(totAmt) * parseFloat(sGstPer)) / 100
          ).toFixed(3)
          : 0;

      let IGSTper =
        vendorStateId !== 12 ? parseFloat(jobWorkerGst).toFixed(3) : 0;

      let igstVal =
        vendorStateId !== 12
          ? parseFloat(
            (parseFloat(totAmt) * parseFloat(IGSTper)) / 100
          ).toFixed(3)
          : 0;

      let tot =
        vendorStateId === 12
          ? parseFloat(
            parseFloat(totAmt) +
            parseFloat(cgstVal) +
            parseFloat(sgstVal)
          ).toFixed(3)
          : parseFloat(parseFloat(totAmt) + parseFloat(igstVal)).toFixed(
            3
          );

      return {
        ...item,
        fineRate: parseFloat(fineRateLoc).toFixed(3),
        catRate: parseFloat(
          parseFloat(totAmt) / parseFloat(item.net_wgt)
        ).toFixed(3),
        labourFineAmount: labFineAmt,
        totalAmount: totAmt,
        cgstPer: cgstPer,
        cgstVal: cgstVal,
        sGstPer: sGstPer,
        sGstVal: sgstVal,
        IGSTper: IGSTper,
        IGSTVal: igstVal,
        total: tot,
      };
    });

    // console.log(tempTagWise)
    setTagWiseData(tempTagWise);

    // console.log(billMaterialData)

    const tempBillMaterial = billMaterialData.map((item) => {

      let labFineAmt = parseFloat(
        (parseFloat(item.wastageFine) * parseFloat(fineRateLoc)) / 10
      ).toFixed(3);

      let totAmt = parseFloat(
        parseFloat(labFineAmt) + parseFloat(item.other_amt)
      ).toFixed(3);

      let cgstPer =
        vendorStateId === 12
          ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
          : 0;

      let cgstVal =
        vendorStateId === 12
          ? parseFloat(
            (parseFloat(totAmt) * parseFloat(cgstPer)) / 100
          ).toFixed(3)
          : 0;

      let sGstPer =
        vendorStateId === 12
          ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
          : 0;

      let sgstVal =
        vendorStateId === 12
          ? parseFloat(
            (parseFloat(totAmt) * parseFloat(sGstPer)) / 100
          ).toFixed(3)
          : 0;

      let IGSTper =
        vendorStateId !== 12 ? parseFloat(jobWorkerGst).toFixed(3) : 0;

      let igstVal =
        vendorStateId !== 12
          ? parseFloat(
            (parseFloat(totAmt) * parseFloat(IGSTper)) / 100
          ).toFixed(3)
          : 0;

      let tot =
        vendorStateId === 12
          ? parseFloat(
            parseFloat(totAmt) +
            parseFloat(cgstVal) +
            parseFloat(sgstVal)
          ).toFixed(3)
          : parseFloat(parseFloat(totAmt) + parseFloat(igstVal)).toFixed(3);

      return {
        ...item,
        totalAmount: totAmt,
        cgstPer: cgstPer,
        cgstVal: cgstVal,
        sGstPer: sGstPer,
        sGstVal: sgstVal,
        IGSTper: IGSTper,
        IGSTVal: igstVal,
        total: tot,
      };
    });

    setBillmaterialData(tempBillMaterial);

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

    console.log(newTempProductData)

    let tempAmount = newTempProductData
      .filter((item) => item.totalAmount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    let tempTotal = 0;
    let tempCgstVal = 0;
    let tempSgstVal = 0;
    let tempIgstVal = 0;

    if (vendorStateId === 12) {
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

      // setTotalGST(
      //   (parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
      // );
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
      // setIgstVal(parseFloat(tempIgstVal).toFixed(3));
      // setTotalGST(parseFloat(tempIgstVal).toFixed(3));
      tempTotal = parseFloat(
        parseFloat(tempAmount) + parseFloat(tempIgstVal)
      ).toFixed(3);
    }

    setTotal(parseFloat(tempTotal).toFixed(3));
    // setAmount(parseFloat(tempAmount).toFixed(3));
    let tempTotalInvoiceAmt = 0;
    if (parseFloat(tempTotal) > 0) {
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
    } else {
      setTotalInvoiceAmount(0);
      // setLegderAmount(0);
    }

    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.gross_wgt);
    }
    function netWeight(item) {
      return parseFloat(item.net_wgt);
    }

    let tempGrossWtTot = parseFloat(newTempProductData
      .filter((data) => data.gross_wgt !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3)
    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3))

    let tempNetWtTot = parseFloat(
      newTempProductData
        .filter((data) => data.net_wgt !== "")
        .map(netWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3)
    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

    setTimeout(() => {
      setPrintObj({
        ...printObj,
        orderDetails: newTempProductData,
        taxableAmount: parseFloat(tempAmount).toFixed(3),
        iGstTot: vendorStateId !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
        sGstTot: vendorStateId === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
        cGstTot: vendorStateId === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
        totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
        balancePayable: parseFloat(tempTotalInvoiceAmt).toFixed(3),
        grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
        netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      })
    }, 800);

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
    if (selectedJobWorker === "") {
      setSelectedJobWorkerErr("Please Select jobworker");
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

  function loadValidation() {
    if (selectedLoad === "") {
      setSelectedLoadErr("Please Select Load Type");
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

  function shippingCompValidation() {
    if (selectedCompany === "") {
      setSelectedCompErr("Please Select Valid Client Company");
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

  // const isEnabled =
  //   selectedDepartment !== "" &&
  //   selectedLoad !== "" &&
  //   firmName !== "" &&
  //   selectedJobWorker !== "" &&
  //   // voucherNumber !== "" &&
  //   partyVoucherNum !== "";

  function FineRateValidaion() {
    // fineRate
    const regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
    if (!fineRate || regex.test(fineRate) === false) {
      setFineRateErr("Enter Valid Fine Rate");
      return false;
    }
    return true;
  }

  // function validateShipping() {
  //   if (
  //     loadValidation() &&
  //     voucherNumValidation() &&
  //     partyNameValidation() &&
  //     oppositeAcValidation() &&
  //     partyVoucherNumValidation() &&
  //     FineRateValidaion() &&
  //     shippingValidation()
  //   ) {
  //     if (shipping === "1") {
  //       if (shippingVendValidation() && shippingCompValidation()) {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     } else if (shipping === "0") {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   } else {
  //     return false;
  //   }
  // }

  function handleFormSubmit(ev) {
    ev.preventDefault();
    // resetForm();
    // console.log("handleFormSubmit", formValues);
    if (
      loadValidation() &&
      handleDateBlur()&&
      voucherNumValidation() &&
      partyNameValidation() &&
      oppositeAcValidation() &&
      // partyVoucherNumValidation() &&
      FineRateValidaion() &&
      shippingValidation()
    ) {
      console.log("if");

      if (shipping === "1") {
        if (shippingVendValidation() && shippingCompValidation()) {
          checkAndCallApi(true, false);
        }
      } else {
        checkAndCallApi(true, false);
      }
    } else {
      console.log("else");
    }
  }

  function checkAndCallApi(resetFlag, toBePrint) {
    if (selectedLoad === "0") {
      //Load Packing Slip
      createFromPackingSlip(resetFlag, toBePrint);
    } else if (selectedLoad === "1") {
      //Load Finding Variant
      if(prevIsValid()){
        callLoadFindingApi(resetFlag, toBePrint);
      }
    } else if (selectedLoad === "2") {
      //Load Lot directly
      callLotApi(resetFlag, toBePrint);
    }
  }

  const prevIsValid = () => {
    if (userFormValues.length === 0) {
      return true;
    }

    let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

    function setWeight(row) {
      return parseFloat(row.setWeight);
    }

    const someEmpty = userFormValues
      .filter((element) => element.category !== "")
      .some((item) => {
        if (
          parseFloat(item.grossWeight) !== parseFloat(item.netWeight) 
          // &&
          // item.isWeightDiff === 0
        ) {
          //not same
          return (
            item.grossWeight === "" ||
            item.grossWeight == 0 ||
            item.netWeight === "" ||
            item.netWeight == 0 ||
            item.wastagePer === "" ||
            item.total==0||
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
            item.grossWeight === "" ||
            item.netWeight === "" ||
            item.wastagePer === "" ||
            item.total == 0||
            percentRegex.test(item.wastagePer) === false
          );
        }
      });

    console.log(someEmpty,111111111111111111);

    if (someEmpty) {
      userFormValues
        .filter((element) => element.category !== "")
        .map((item, index) => {
          const allPrev = [...userFormValues];
          console.log(item);

          let category = userFormValues[index].category;
          if (category === "") {
            allPrev[index].errors.category = "Please Select Category";
          } else {
            allPrev[index].errors.category = null;
          }

          let pcsTotal = userFormValues[index].pieces;
          if (pcsTotal === "" || pcsTotal === null || pcsTotal === undefined || isNaN(pcsTotal)) {
            allPrev[index].errors.pieces = "Enter Pieces";
          } else {
            allPrev[index].errors.pieces = null;
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
        
          let wastagePer = userFormValues[index].wastagePer;
          if (!wastagePer || percentRegex.test(wastagePer) === false) {
            allPrev[index].errors.wastagePer = "Enter Wastage!";
          } else {
            allPrev[index].errors.wastagePer = null;
          }
          let total1 = userFormValues[index].total;
          if (!total1 || total1==0) {
            allPrev[index].errors.total = "Enter correct value!";
          } else {
            allPrev[index].errors.total = null;
          }
  
          console.log(allPrev[index]);
          setUserFormValues(allPrev);
          return null;
        });
    }

    return !someEmpty;
  };

  function callLotApi(resetFlag, toBePrint) {
    let Orders = userFormValues
      .filter((element) => element.lotNumber !== "")
      .map((x) => {
        return {
          lot_id: x.lotNumber.value,
          other_tag_amount: x.otherTagAmount,
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
      opposite_account_id: oppositeAccSelected.value,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      jobworker_id: selectedJobWorker.value,
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      // ...(rates.length !== 0 && {
      //   rates: rates,
      // }),
      finalRate: fineRate,
      // ...(tempRate !== "" && {
      //   setRate: tempRate,
      // }),
      is_lot: 1, //1 for lot
      round_off: roundOff === "" ? 0 : roundOff,
      jewellery_narration: jewelNarration,
      account_narration: accNarration,
      Orders: Orders,
      is_shipped: parseInt(shipping),
      ...(shipping === "1" && {
        shipping_client_id: shippingVendor.value,
        shipping_client_company_id: selectedCompany.value,
      }),
      uploadDocIds: docIds,
      party_voucher_date:partyVoucherDate,
    }

    axios
      .post(Config.getCommonUrl() + "api/jewelleryPurchaseArticianReturn", body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id
          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.goBack();
          if (resetFlag === true) {
            checkAndReset()
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record 
            handlePrint();
          }

          // reset();
          // getVoucherNumber();
          // setSelectedLoad("");

          // setVoucherDate(moment().format("YYYY-MM-DD"));

          setLoading(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
        }
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);
        handleError(error, dispatch, { api: "api/jewelleryPurchaseArticianReturn", body: body })
      });
  }

  function callLoadFindingApi(resetFlag, toBePrint) {
    let Orders = userFormValues
      .filter((element) => element.grossWeight !== "")
      .map((x) => {
        if (parseFloat(x.grossWeight) !== parseFloat(x.netWeight)) {
          return {
            stock_name_code_id: x.category.value,
            gross_weight: x.grossWeight,
            net_weight: x.netWeight,
            ...(x.pieces !== "" && {
              pcs: x.pieces, //user input
            }),
            // hallmark_charges: x.hallmarkCharges,
            other_tag_amount: x.otherTagAmount,
            setStockCodeArray: x.DiffrentStock.map((y) => {
              return {
                setStockCodeId: y.setStockCodeId.value,
                setPcs: y.setPcs,
                setWeight: y.setWeight,
              };
            }),
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
      });
    console.log(Orders);
    if (Orders.length === 0) {
      dispatch(Actions.showMessage({ message: "Please Add Purchase Entry" }));
      return;
    }
    setLoading(true);

    axios
      .post(Config.getCommonUrl() + "api/jewelleryPurchaseArticianReturn", {
        voucher_no: voucherNumber,
        party_voucher_no: partyVoucherNum,
        opposite_account_id: oppositeAccSelected.value,
        department_id: window.localStorage.getItem("SelectedDepartment"),
        jobworker_id: selectedJobWorker.value,
        ...(allowedBackDate && {
          purchaseCreateDate: voucherDate,
        }),
        // ...(rates.length !== 0 && {
        //   rates: rates,
        // }),
        finalRate: fineRate,
        // ...(tempRate !== "" && {
        //   setRate: tempRate,
        // }),
        is_lot: 0, //1 for lot
        round_off: roundOff === "" ? 0 : roundOff,
        jewellery_narration: jewelNarration,
        account_narration: accNarration,
        Orders: Orders,
        uploadDocIds: docIds,
        party_voucher_date:partyVoucherDate,
        is_shipped: parseInt(shipping),
        ...(shipping === "1" && {
          shipping_client_id: shippingVendor.value,
          shipping_client_company_id: selectedCompany.value,
        }),
      })
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

          // setSelectedLoad("");
          // reset();
          // getVoucherNumber();

          // setVoucherDate(moment().format("YYYY-MM-DD"));

          // setLoading(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);

        handleError(error, dispatch, {
          api: "api/jewelleryPurchaseArticianReturn", body: {
            voucher_no: voucherNumber,
            party_voucher_no: partyVoucherNum,
            opposite_account_id: oppositeAccSelected.value,
            department_id: window.localStorage.getItem("SelectedDepartment"),
            jobworker_id: selectedJobWorker.value,
            ...(allowedBackDate && {
              purchaseCreateDate: voucherDate,
            }),
            // ...(rates.length !== 0 && {
            //   rates: rates,
            // }),
            finalRate: fineRate,
            // ...(tempRate !== "" && {
            //   setRate: tempRate,
            // }),
            is_lot: 0, //1 for lot
            round_off: roundOff === "" ? 0 : roundOff,
            jewellery_narration: jewelNarration,
            account_narration: accNarration,
            Orders: Orders,
            is_shipped: parseInt(shipping),
            ...(shipping === "1" && {
              shipping_client_id: shippingVendor.value,
              shipping_client_company_id: selectedCompany.value,
            }),
          }
        })

      });
  }

  function reset() {
    setFineRate(todayGoldRate);
    setOppositeAccSelected("");
    setSelectedJobWorker("");
    setFirmName("");
    // setCsvData([]);
    // setIsCsvErr(false);
    // setSelectedRateFixErr("");
    setPartyVoucherNum("");
    // setSelectedDepartment("");
    setRoundOff("");
    setTotalInvoiceAmount("");
    // setTdsTcsVou("");
    // setLedgerName("");
    // setRateValue("");
    // setLegderAmount("");
    // setFinalAmount("");
    setAccNarration("");
    setJewelNarration("");
    setFineGoldTotal("");
    // setIsVoucherSelected(false);
    // setSelectedVoucher("");
    // setVoucherApiData([]);
    setVendorStateId("");
    // setTempApiRate("");
    setTotalGrossWeight("");
    setOtherTagAmount("");
    // setAmount("");
    // setHallmarkCharges("");
    setTotalAmount("");
    setIgstVal("");
    setTotal("");
    setFileSelected("");
    setIsuploaded(false);

    setUserFormValues([
      {
        loadType: "",
        category: "",
        billingCategory: "",
        HSNNum: "",
        lotNumber: "",
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
        jobworkFineUtilize: "",
        wastagePer: "",
        wastageFine: "",
        fineRate: "",
        labourFineAmount: "",
        otherTagAmount: "",
        catRatePerGram: "",
        // amount: "",
        // hallmarkCharges: "",
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
          // amount: null,
          // hallmarkCharges: null,
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
        loadType: "",
        category: "",
        billingCategory: "",
        HSNNum: "",
        lotNumber: "",
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
        jobworkFineUtilize: "",
        wastagePer: "",
        wastageFine: "",
        fineRate: "",
        labourFineAmount: "",
        otherTagAmount: "",
        catRatePerGram: "",
        // amount: "",
        // hallmarkCharges: "",
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
          // amount: null,
          // hallmarkCharges: null,
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
        loadType: "",
        category: "",
        billingCategory: "",
        HSNNum: "",
        lotNumber: "",
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
        jobworkFineUtilize: "",
        wastagePer: "",
        wastageFine: "",
        fineRate: "",
        labourFineAmount: "",
        otherTagAmount: "",
        catRatePerGram: "",
        // amount: "",
        // hallmarkCharges: "",
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
          // amount: null,
          // hallmarkCharges: null,
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
        loadType: "",
        category: "",
        billingCategory: "",
        HSNNum: "",
        lotNumber: "",
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
        jobworkFineUtilize: "",
        wastagePer: "",
        wastageFine: "",
        fineRate: "",
        labourFineAmount: "",
        otherTagAmount: "",
        catRatePerGram: "",
        // amount: "",
        // hallmarkCharges: "",
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
          // amount: null,
          // hallmarkCharges: null,
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
    setPrintObj({
      ...printObj,
      loadType: event.target.value,
      orderDetails: [],
      fineRate: "",
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
      balancePayable: ""
    })
    setSelectedLoadErr("");
    // setIsVoucherSelected(false);
    // setSelectedVoucher("");
    // setVoucherApiData([]);
    setPackingSlipIdArr([]);
    setPackingSlipData([]); //packing slip wise
    setPacketData([]); //packet wise Data
    setProductData([]); //category wise Data
    setBillmaterialData([]); //bill of material Data
    setTagWiseData([]);
    reset();
  }

  function resetFormOnly() {
    // setCsvData([]);
    // setIsCsvErr(false);
    // setSelectedRateFixErr("");
    setPartyVoucherNum("");
    // setSelectedDepartment("");
    setRoundOff("");
    setTotalInvoiceAmount("");
    // setTdsTcsVou("");
    // setLedgerName("");
    // setRateValue("");
    // setLegderAmount("");
    // setFinalAmount("");
    setAccNarration("");
    setJewelNarration("");
    // setIsVoucherSelected(false);
    // setSelectedVoucher("");
    // setVoucherApiData([]);
    setVendorStateId("");
    // setTempApiRate("");
    setTotalGrossWeight("");
    setOtherTagAmount("");
    // setAmount("");
    // setHallmarkCharges("");
    setTotalAmount("");
    setIgstVal("");
    setTotal("");
    setFileSelected("");
    setIsuploaded(false);

    setUserFormValues([
      {
        loadType: "",
        category: "",
        billingCategory: "",
        HSNNum: "",
        lotNumber: "",
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
        jobworkFineUtilize: "",
        wastagePer: "",
        wastageFine: "",
        fineRate: "",
        labourFineAmount: "",
        otherTagAmount: "",
        catRatePerGram: "",
        // amount: "",
        // hallmarkCharges: "",
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
          // amount: null,
          // hallmarkCharges: null,
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
        loadType: "",
        category: "",
        billingCategory: "",
        HSNNum: "",
        lotNumber: "",
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
        jobworkFineUtilize: "",
        wastagePer: "",
        wastageFine: "",
        fineRate: "",
        labourFineAmount: "",
        otherTagAmount: "",
        catRatePerGram: "",
        // amount: "",
        // hallmarkCharges: "",
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
          // amount: null,
          // hallmarkCharges: null,
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
        loadType: "",
        category: "",
        billingCategory: "",
        HSNNum: "",
        lotNumber: "",
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
        jobworkFineUtilize: "",
        wastagePer: "",
        wastageFine: "",
        fineRate: "",
        labourFineAmount: "",
        otherTagAmount: "",
        catRatePerGram: "",
        // amount: "",
        // hallmarkCharges: "",
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
          // amount: null,
          // hallmarkCharges: null,
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
        loadType: "",
        category: "",
        billingCategory: "",
        HSNNum: "",
        lotNumber: "",
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
        jobworkFineUtilize: "",
        wastagePer: "",
        wastageFine: "",
        fineRate: "",
        labourFineAmount: "",
        otherTagAmount: "",
        catRatePerGram: "",
        // amount: "",
        // hallmarkCharges: "",
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
          // amount: null,
          // hallmarkCharges: null,
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

  function handlePartyChange(value) {
    setSelectedJobWorker(value);
    setSelectedJobWorkerErr("");
    setPackingSlipIdArr([]);
    setPackingSlipData([]); //packing slip wise
    setPacketData([]); //packet wise Data
    setProductData([]); //category wise Data
    setBillmaterialData([]); //bill of material Data
    setTagWiseData([]);
    // setIsVoucherSelected(false);
    // setSelectedVoucher("");
    // setVoucherApiData([]);
    resetFormOnly();

    const index = jobworkerData.findIndex(
      (element) => element.id === value.value
    );
    console.log(index);

    if (index > -1) {
      setFirmName(jobworkerData[index].firm_name);
      setVendorStateId(jobworkerData[index].state_name.id);
      setAddress(jobworkerData[index].address);
      setSupplierGstUinNum(jobworkerData[index].gst_number);
      setSupPanNum(jobworkerData[index].pan_number);
      setSupState(jobworkerData[index].state_name.name);
      setSupCountry(jobworkerData[index].country_name.name)

      if (selectedLoad === "1" || selectedLoad === "2") {
        //if 0 then no need to call api, wastage % will come from api
        getVendorRateProfile(value.value);
      }
      // console.log(jobworkerData[index].state_name.id);
      //   setLedgerName(jobworkerData[index].ledger_for_sale);
      //   setLedgerNmErr("");

      //   setRateValue(jobworkerData[index].tds_tcs_rate);
      //   setRateValErr("");

      // setLegderAmount(
      //   (totalInvoiceAmount * parseFloat(jobworkerData[index].tds_tcs_rate)) /
      //     100
      // );
      //   setLedgerAmtErr("");
      setPrintObj({
        ...printObj,
        stateId: vendorStateId,
        supplierName: jobworkerData[index].firm_name,
        supAddress: jobworkerData[index].address,
        supplierGstUinNum: jobworkerData[index].gst_number,
        supPanNum: jobworkerData[index].pan_number,
        supState: jobworkerData[index].state_name.name,
        supCountry: jobworkerData[index].country_name.name,
        supStateCode: (jobworkerData[index].gst_number) ? jobworkerData[index].gst_number.substring(0, 2) : '',
        voucherDate: moment().format("DD-MM-YYYY"),
        placeOfSupply: jobworkerData[index].state_name.name,
        orderDetails: [],
        balancePayable: ""
      })
    }

    // getVouchers(value.value);
  }

  // jobworker - 0
  // vendor - 1
  function getVendorRateProfile(jobworkerID) {
    axios
      .get(
        Config.getCommonUrl() +
        `api/jobWorkerRateProfile/readAllRate/0/${jobworkerID}`
      )
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

  // url change
  // function getVouchers(jobworkerId) {
  //   axios
  //     .get(
  //       Config.getCommonUrl() +
  //         `api/jobworkarticianissue/jobworker/${jobworkerId}`
  //     )
  //     .then(function (response) {
  //       console.log(response);

  //       if (response.data.success === true) {
  //         let Data = response.data.data;
  //         let tempArray = [];
  //         for (let item of Data) {
  //           // console.log(item);
  //           tempArray.push({
  //             id: item.id,
  //             voucher_no: item.voucher_no,
  //             party_voucher_no: item.party_voucher_no,
  //             utilize: (
  //               parseFloat(item.finegold) - parseFloat(item.balance)
  //             ).toFixed(3),
  //             balance: item.balance,
  //             rate: item.rate,
  //             finegold: item.finegold,
  //             amount: (
  //               parseFloat(item.rate) *
  //               (parseFloat(item.finegold) - parseFloat(item.balance))
  //             ).toFixed(3),
  //           });
  //         }

  //         setVoucherApiData(tempArray);
  //       } else {
  //         setVoucherApiData([]);

  //         dispatch(Actions.showMessage({ message: response.data.message }));
  //       }
  //     })
  //     .catch(function (error) {
  //               handleError(error, dispatch)
  //     });
  // }

  function handleShippingChange(event) {
    setShipping(event.target.value);
    setShippingErr("");
    setShippingVendor("");
    setShipVendErr("");
    //reset every thing here

    // reset();
  }

  function handleShipCompanyChange(value) {
    // const [clientCompanies, setClientCompanies] = useState("")
    setSelectedCompany(value);
    setSelectedCompErr("");
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
    // setClientCompanies

    axios
      .get(Config.getCommonUrl() + `api/client/company/listing/listing/${clientId}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(JSON.stringify(response.data.data));
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

  // function handleVoucherModalClose() {
  //   // console.log("handle close", callApi);
  //   setvoucherModalOpen(false);
  // }

  // function handleVoucherSelect(id) {
  //   console.log("handleVoucherSelect", id);
  //   setIsVoucherSelected(true);
  //   setSelectedVoucher(id);
  //   setSelectVoucherErr("");
  //   setvoucherModalOpen(false);

  //   if (isUploaded === true) {
  //     // fileSelected //file weight is greater than api weight then fix rate from user then upload file
  //     uploadfileapicall(fileSelected);
  //   }
  // }

  // function handleSelectVoucher() {
  //   setvoucherModalOpen(true);
  //   // isVoucherSelected
  // }

  // const adjustRateFix = (evt) => {
  //   evt.preventDefault();

  //   // if (canEnterVal === true) {
  //   // if (
  //   //   shortageRfixValidation() &&
  //   //   tempRateValidation() &&
  //   //   avgRateValidation()
  //   // ) {
  //   console.log("valid");
  //   // handleRateValChange();
  //   setvoucherModalOpen(false);
  //   // setAdjustedRate(true);
  //   setIsVoucherSelected(true);

  //   if (isUploaded === true) {
  //     // fileSelected //file weight is greater than api weight then fix rate from user then upload file
  //     uploadfileapicall(fileSelected);
  //   }
  //   // } else {
  //   //   console.log("invalid");
  //   // }
  //   // } else {
  //   //   // handleRateValChange();
  //   //   setRfModalOpen(false);
  //   //   setAdjustedRate(true);
  //   // setIsVoucherSelected(true);

  //   // }
  // };

  let handleStockGroupChange = (i, e) => {
    console.log(e);
    let newFormValues = [...userFormValues];
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
      newFormValues[i].pieces = "";

      newFormValues[i].purity = stockCodeData[findIndex].stock_name_code.purity;
      newFormValues[i].HSNNum = jobworkerHSN//stockCodeData[findIndex].hsn_master.hsn_number;

      newFormValues[i].billingCategory = stockCodeData[findIndex].stock_name;
      newFormValues[i].errors.billingCategory = null;

      console.log(stockCodeData[findIndex]);
      if (vendorStateId === 12) {
        newFormValues[i].cgstPer = parseFloat(jobWorkerGst) / 2;
        newFormValues[i].sGstPer = parseFloat(jobWorkerGst) / 2;
      } else {
        newFormValues[i].IGSTper = parseFloat(jobWorkerGst);
        console.log(newFormValues[i].IGSTper);
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
    // setAdjustedRate(false);
    // if (adjustedRate === true) {
    //   handleRateValChange();
    // }
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

    let tempCGstVal
    let tempSgstVal
    let tempIgstVal
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
      // setTotalGST(
      //   parseFloat(parseFloat(tempCGstVal) + parseFloat(tempSgstVal)).toFixed(3)
      // );
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
      // setTotalGST(parseFloat(tempIgstVal).toFixed(3));
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

    let tempfinalAmount = 0;
    let tempTotalInvoiceAmt = 0;
    // let temptdsTcsAmount =0;

    tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);

    setTotalInvoiceAmount(tempTotalInvoiceAmt);

    // if (is_tds_tcs === "1") {
    //   //1 is tcs, 2 means tds
    //   tempLedgerAmount = parseFloat(
    //     (tempTotalInvoiceAmt * rateValue) / 100
    //   ).toFixed(3); //with gst on total invoice amount
    //   console.log(tempLedgerAmount);

    //   tempfinalAmount =
    //     parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount);
    // } else if (is_tds_tcs === "2") {
    //   //tds
    //   tempLedgerAmount = parseFloat(
    //     (parseFloat(tempTotAmount) * rateValue) / 100
    //   ).toFixed(3); //calculating before gst, on total amount only
    //   console.log(tempLedgerAmount);
    //   tempfinalAmount =
    //     parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount);
    // } else {
    //   tempfinalAmount = parseFloat(tempTotalInvoiceAmt);
    // }

    // setLegderAmount(tempLedgerAmount);

    // setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));
    setPrintObj({
      ...printObj,
      stateId: vendorStateId,
      orderDetails: newFormValues,
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCGstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      pcsTot: tempPcsTotal,
      totalInvoiceAmt: tempTotalInvoiceAmt,
      balancePayable: parseFloat(tempfinalAmount).toFixed(3)
    })

    if (addFlag === true) {
      setUserFormValues([
        ...newFormValues,
        {
          loadType: "",
          category: "",
          billingCategory: "",
          HSNNum: "",
          lotNumber: "",
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
          jobworkFineUtilize: "",
          wastagePer: "",
          wastageFine: "",
          fineRate: "",
          labourFineAmount: "",
          otherTagAmount: "",
          catRatePerGram: "",
          // amount: "",
          // hallmarkCharges: "",
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
            // amount: null,
            // hallmarkCharges: null,
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

  let handleLotNumChange = (i, e) => {
    console.log(e);
    let newFormValues = [...userFormValues];
    newFormValues[i].lotNumber = {
      value: e.value,
      label: e.label,
    };
    newFormValues[i].errors.lotNumber = null;

    let findIndex = lotdata.findIndex((item) => item.id === e.value);
    // console.log(lotdata[findIndex])
    if (findIndex > -1) {
      newFormValues[i].purity = lotdata[findIndex].LotMetalStockCode.purity;
      newFormValues[i].grossWeight = parseFloat(lotdata[findIndex].total_gross_wgt).toFixed(3);
      newFormValues[i].billingCategory =
        lotdata[findIndex].ProductCategory.category_name;
      newFormValues[i].netWeight = parseFloat(lotdata[findIndex].total_net_wgt).toFixed(3);
      newFormValues[i].pieces = lotdata[findIndex].pcs;
      newFormValues[i].HSNNum = jobworkerHSN// lotdata[findIndex].ProductCategory.hsn_master.hsn_number;
      newFormValues[i].rate = "";
      newFormValues[i].amount = "";
      newFormValues[i].total = "";

      // console.log("lotdata ProductCategory.id", lotdata[findIndex].ProductCategory.id)
      let wastageIndex = rateProfiles.findIndex(
        (item) =>
          item.product_categorie_id === lotdata[findIndex].ProductCategory.id
      );
      console.log("wastageIndex", wastageIndex)
      if (wastageIndex > -1) {
        newFormValues[i].wastagePer = parseFloat(rateProfiles[wastageIndex].wastage_per).toFixed(3);
        newFormValues[i].errors.wastagePer = "";
      } else {
        newFormValues[i].errors.wastagePer = "Wastage is not added in rate profile";
      }

      if (vendorStateId === 12) {
        newFormValues[i].cgstPer = parseFloat(jobWorkerGst) / 2;
        newFormValues[i].sGstPer = parseFloat(jobWorkerGst) / 2;
      } else {
        newFormValues[i].IGSTper = parseFloat(jobWorkerGst);
        // console.log(newFormValues[i].IGSTper)
      }

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

      if (parseFloat(newFormValues[i].grossWeight) === parseFloat(newFormValues[i].netWeight)) {
        newFormValues[i].isWeightDiff = 1;
      } else {
        newFormValues[i].isWeightDiff = 0;
      }
      if (parseFloat(newFormValues[i].grossWeight) < parseFloat(newFormValues[i].netWeight)) {
        newFormValues[i].errors.netWeight =
          "Net Weight Can not be Greater than Gross Weight";
      } else {
        newFormValues[i].errors.netWeight = "";
      }

      // setAdjustedRate(false);
      newFormValues[i].fineRate = 0;

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

      if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
        newFormValues[i].jobworkFineUtilize = parseFloat(
          (parseFloat(newFormValues[i].netWeight) *
            parseFloat(newFormValues[i].purity)) /
          100
        ).toFixed(3);
      } else {
        newFormValues[i].jobworkFineUtilize = "";
      }

      if (fineRate !== "") {
        newFormValues[i].fineRate = parseFloat(fineRate).toFixed(3);
      }

      if (
        newFormValues[i].wastageFine !== "" &&
        newFormValues[i].fineRate !== ""
      ) {
        newFormValues[i].labourFineAmount = parseFloat(
          (parseFloat(newFormValues[i].wastageFine) *
            parseFloat(newFormValues[i].fineRate)) /
          10
        ).toFixed(3);
      }

      if (newFormValues[i].labourFineAmount !== "") {
        if (newFormValues[i].otherTagAmount !== "") {
          newFormValues[i].totalAmount = parseFloat(
            parseFloat(newFormValues[i].labourFineAmount) +
            parseFloat(newFormValues[i].otherTagAmount)
          ).toFixed(3);
        } else {
          newFormValues[i].totalAmount = parseFloat(
            newFormValues[i].labourFineAmount
          ).toFixed(3);
        }
      }

      if (
        newFormValues[i].totalAmount !== "" &&
        newFormValues[i].netWeight !== ""
      ) {
        newFormValues[i].catRatePerGram = parseFloat(
          parseFloat(newFormValues[i].totalAmount) /
          parseFloat(newFormValues[i].netWeight)
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
        }
        // else {
        //   newFormValues[i].cgstVal = "";
        //   newFormValues[i].sGstVal = "";
        //   newFormValues[i].total = "";
        // }
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
        }
        // else {
        //   newFormValues[i].IGSTper = "";
        //   newFormValues[i].total = "";
        // }
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
      // setSubTotal(parseFloat(tempAmount).toFixed(3));

      if (vendorStateId === 12) {
        // setCgstVal("");
        // setSgstVal("");
        let tempCgstVal = newFormValues
          .filter((item) => item.cgstVal !== "")
          .map(CGSTval)
          .reduce(function (a, b) {
            // sum all resulting numbers
            return parseFloat(a) + parseFloat(b);
          }, 0);
        // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
        setCgstVal(parseFloat(tempCgstVal).toFixed(3));

        let tempSgstVal = newFormValues
          .filter((item) => item.sGstVal !== "")
          .map(SGSTval)
          .reduce(function (a, b) {
            // sum all resulting numbers
            return parseFloat(a) + parseFloat(b);
          }, 0);
        setSgstVal(parseFloat(tempSgstVal).toFixed(3));
        // setTotalGST(
        //   (parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
        // );
      } else {
        // setIgstVal("");
        // setTotalGST("")

        let tempIgstVal = newFormValues
          .filter((item) => item.IGSTVal !== "")
          .map(IGSTVal)
          .reduce(function (a, b) {
            // sum all resulting numbers
            return parseFloat(a) + parseFloat(b);
          }, 0);
        setIgstVal(parseFloat(tempIgstVal).toFixed(3));
        // setTotalGST(parseFloat(tempIgstVal).toFixed(3));
      }

      let tempTotal = newFormValues
        .filter((item) => item.total !== "")
        .map(Total)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setTotal(parseFloat(tempTotal).toFixed(3));

      setTotalGrossWeight(
        parseFloat(newFormValues
          .filter((data) => data.grossWeight !== "")
          .map(grossWeight)
          .reduce(function (a, b) {
            // sum all resulting numbers
            return parseFloat(a) + parseFloat(b);
          }, 0)).toFixed(3)
      );

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
      if (parseFloat(tempTotal) > 0) {
        // let tempLedgerAmount = 0;
        // let tempfinalAmount = 0;
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
      } else {
        setTotalInvoiceAmount(0);
        // setLegderAmount(0);
      }
    }

    // console.log(newFormValues);
    if (i === userFormValues.length - 1) {
      // addFormFields();
      changeTotal(newFormValues, true);
    } else {
      changeTotal(newFormValues, false);

    }
  };

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

    } else if (nm === "otherTagAmount") {
      newFormValues[i].otherTagAmount = parseFloat(val).toFixed(3)

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
      if (val == 0){
      newFormValues[i].errors.grossWeight = "Enter gross Weight";
      }
      if (val === "" || val == 0) {
        newFormValues[i].fine = "";
        newFormValues[i].amount = "";
        // setAmount("");
        // setSubTotal("");
        setCgstVal("");
        setSgstVal("");
        setIgstVal("");
        // setTotalGST("");
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
      newFormValues[i].fineRate = 0;
    }

    // console.log(nm,val)
    if (nm === "netWeight") {
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
      newFormValues[i].fineRate = 0;
    }

    // if (nm === "wastagePer") {
    //   newFormValues[i].errors.wastagePer = null;

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
    // }

    //from here

    if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
      newFormValues[i].jobworkFineUtilize = parseFloat(
        (parseFloat(newFormValues[i].netWeight) *
          parseFloat(newFormValues[i].purity)) /
        100
      ).toFixed(3);
    } else {
      newFormValues[i].jobworkFineUtilize = "";
    }

    if (fineRate !== "") {
      newFormValues[i].fineRate = parseFloat(fineRate).toFixed(3);
    }

    if (
      newFormValues[i].wastageFine !== "" &&
      newFormValues[i].fineRate !== ""
    ) {
      newFormValues[i].labourFineAmount = parseFloat(
        (parseFloat(newFormValues[i].wastageFine) *
          parseFloat(newFormValues[i].fineRate)) /
        10
      ).toFixed(3);
    }

    if (newFormValues[i].labourFineAmount !== "") {
      if (newFormValues[i].otherTagAmount !== "") {
        newFormValues[i].totalAmount = parseFloat(
          parseFloat(newFormValues[i].labourFineAmount) +
          parseFloat(newFormValues[i].otherTagAmount)
        ).toFixed(3);
      } else {
        newFormValues[i].totalAmount = parseFloat(
          newFormValues[i].labourFineAmount
        ).toFixed(3);
      }
    }

    if (
      newFormValues[i].totalAmount !== "" && newFormValues[i].totalAmount !=0 && 
      newFormValues[i].netWeight !== "" &&  newFormValues[i].netWeight != 0
    ) {
      newFormValues[i].catRatePerGram = parseFloat(
        parseFloat(newFormValues[i].totalAmount) /
        parseFloat(newFormValues[i].netWeight)
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
      }
      // else {
      //   newFormValues[i].cgstVal = "";
      //   newFormValues[i].sGstVal = "";
      //   newFormValues[i].total = "";
      // }
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
      }
      // else {
      //   newFormValues[i].IGSTper = "";
      //   newFormValues[i].total = "";
      // }
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
    // setSubTotal(parseFloat(tempAmount).toFixed(3));

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
      // setTotalGST(
      //   (parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
      // );
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
      // setTotalGST(parseFloat(tempIgstVal).toFixed(3));
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
    let tempTotalInvoiceAmt = 0;
    // setShortageRfix(tempFineGold);
    if (parseFloat(tempTotal) > 0) {
      // let tempLedgerAmount = 0;
      // let tempfinalAmount = 0;
      // let tempTotalInvoiceAmt = 0;
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
      pcsTot: tempPcsTotal,
      totalInvoiceAmt: tempTotalInvoiceAmt,
      balancePayable: parseFloat(tempTotalInvoiceAmt).toFixed(3)
    })
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

  const checkTotal = () => {
    const grossTotal = Number(userFormValues[selectedIndex].grossWeight);
    const netTotal = Number(userFormValues[selectedIndex].netWeight);
    let weightTotal = 0;

    DiffrentStock.map((item) => {
      weightTotal += Number(item.setWeight);
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
        .filter((element) => element.Category !== "")
        .map((item, index) => {
          // const allPrev = [...userFormValues];
          // allPrev[index].errors.netWeight = null;

          // setUserFormValues(allPrev);
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
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/packingslip/search/${sData}/${window.localStorage.getItem("SelectedDepartment")}` })

      });
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

          setPackingSlipIdArr((packingSlipIdArr) => [
            ...packingSlipIdArr,
            ...[{ packing_slip_id: tempPackingSlip.packing_slip_id }],
          ]);

          let wastFine = parseFloat(
            (parseFloat(tempPackingSlip.net_wgt) *
              parseFloat(tempPackingSlip.wastage)) /
            100
          ).toFixed(3);

          let totFine = parseFloat(
            (parseFloat(tempPackingSlip.net_wgt) *
              parseFloat(tempPackingSlip.purity)) /
            100 +
            parseFloat(wastFine)
          ).toFixed(3);

          let labFineAmt = parseFloat(
            (parseFloat(wastFine) * parseFloat(fineRate)) / 10
          ).toFixed(3);
          let totAmt = parseFloat(
            parseFloat(labFineAmt) + parseFloat(tempPacketData[0].other_amt)
          ).toFixed(3);

          let cgstPer =
            vendorStateId === 12
              ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
              : 0;

          let cgstVal =
            vendorStateId === 12
              ? parseFloat(
                (parseFloat(totAmt) * parseFloat(cgstPer)) / 100
              ).toFixed(3)
              : 0;

          let sGstPer =
            vendorStateId === 12
              ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
              : 0;

          let sgstVal =
            vendorStateId === 12
              ? parseFloat(
                (parseFloat(totAmt) * parseFloat(sGstPer)) / 100
              ).toFixed(3)
              : 0;

          let IGSTper =
            vendorStateId !== 12 ? parseFloat(jobWorkerGst).toFixed(3) : 0;

          let igstVal =
            vendorStateId !== 12
              ? parseFloat(
                (parseFloat(totAmt) * parseFloat(IGSTper)) / 100
              ).toFixed(3)
              : 0;

          let tot =
            vendorStateId === 12
              ? parseFloat(
                parseFloat(totAmt) + parseFloat(cgstVal) + parseFloat(sgstVal)
              ).toFixed(3)
              : parseFloat(parseFloat(totAmt) + parseFloat(igstVal)).toFixed(3);

          let newTemp = {
            ...tempPackingSlip,
            hallmark_charges_pcs: parseFloat(
              parseFloat(tempPackingSlip.hallmark_charges) *
              parseFloat(tempPackingSlip.phy_pcs)
            ).toFixed(3),
            NoOfPacket: tempPacketData.length,
            billingCategory: tempProductData[0].billing_category_name,
            wastageFine: wastFine,
            totalFine: totFine,

            fineRate: parseFloat(fineRate).toFixed(3),
            catRate: parseFloat(
              parseFloat(totAmt) / parseFloat(tempPackingSlip.net_wgt)
            ).toFixed(3),
            // amount: parseFloat(parseFloat(labFineAmt) + parseFloat(item.other_amt)).toFixed(3),
            jobworkFineUtilize: parseFloat(
              (parseFloat(tempPackingSlip.net_wgt) *
                parseFloat(tempPackingSlip.purity)) /
              100
            ).toFixed(3),
            labourFineAmount: parseFloat(labFineAmt).toFixed(3),
            // hallmark_charges: parseFloat(
            //   parseFloat(tempPackingSlip.hallmark_charges) *
            //     parseFloat(item.pcs)
            // ).toFixed(3),
            totalAmount: totAmt,
            cgstPer: cgstPer,
            cgstVal: cgstVal,
            sGstPer: sGstPer,
            sGstVal: sgstVal,
            IGSTper: IGSTper,
            IGSTVal: igstVal,
            total: tot,
          };

          setPackingSlipData([...packingSlipData, newTemp]); //packing slip wise
          // console.log(newTemp);

          const newTempPacketData = tempPacketData.map((item) => {
            let wastageFine = parseFloat(
              (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
            ).toFixed(3);

            let totFine = parseFloat(
              (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
              parseFloat(wastageFine)
            ).toFixed(3);

            let labFineAmt = parseFloat(
              (parseFloat(wastageFine) * parseFloat(fineRate)) / 10
            ).toFixed(3);
            let totAmt = parseFloat(
              parseFloat(labFineAmt) + parseFloat(item.other_amt)
            ).toFixed(3);

            let cgstPer =
              vendorStateId === 12
                ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
                : 0;

            let cgstVal =
              vendorStateId === 12
                ? parseFloat(
                  (parseFloat(totAmt) * parseFloat(cgstPer)) / 100
                ).toFixed(3)
                : 0;

            let sGstPer =
              vendorStateId === 12
                ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
                : 0;

            let sgstVal =
              vendorStateId === 12
                ? parseFloat(
                  (parseFloat(totAmt) * parseFloat(sGstPer)) / 100
                ).toFixed(3)
                : 0;

            let IGSTper =
              vendorStateId !== 12 ? parseFloat(jobWorkerGst).toFixed(3) : 0;

            let igstVal =
              vendorStateId !== 12
                ? parseFloat(
                  (parseFloat(totAmt) * parseFloat(IGSTper)) / 100
                ).toFixed(3)
                : 0;

            let tot =
              vendorStateId === 12
                ? parseFloat(
                  parseFloat(totAmt) +
                  parseFloat(cgstVal) +
                  parseFloat(sgstVal)
                ).toFixed(3)
                : parseFloat(parseFloat(totAmt) + parseFloat(igstVal)).toFixed(3);

            return {
              ...item,
              hsn_number: jobworkerHSN,
              billingCategory: tempProductData[0].billing_category_name,
              wastage: tempPackingSlip.wastage,
              wastageFine: wastageFine,
              totalFine: totFine,
              fineRate: parseFloat(fineRate).toFixed(3),
              catRate: parseFloat(
                parseFloat(totAmt) / parseFloat(item.net_wgt)
              ).toFixed(3),
              // amount: parseFloat(parseFloat(labFineAmt) + parseFloat(item.other_amt)).toFixed(3),
              jobworkFineUtilize: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100
              ).toFixed(3),
              labourFineAmount: labFineAmt,
              hallmark_charges: parseFloat(
                parseFloat(tempPackingSlip.hallmark_charges) *
                parseFloat(item.pcs)
              ).toFixed(3),
              totalAmount: totAmt,
              cgstPer: cgstPer,
              cgstVal: cgstVal,
              sGstPer: sGstPer,
              sGstVal: sgstVal,
              IGSTper: IGSTper,
              IGSTVal: igstVal,
              total: tot,
              // wastageFine: parseFloat(
              //   (parseFloat(item.net_wgt) * parseFloat(newTemp.wastage)) / 100
              // ).toFixed(3),
              // totalFine: parseFloat(
              //   (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
              //     (parseFloat(item.net_wgt) * parseFloat(newTemp.wastage)) / 100
              // ).toFixed(3),
              // fineRate: "",
              // amount: "",
              // hallmark_charges: parseFloat(
              //   parseFloat(tempPackingSlip.hallmark_charges) *
              //     parseFloat(item.pcs)
              // ).toFixed(3), // newTemp.hallmark_charges,
              // totalAmount: "",
            };
          });

          setPacketData((packetData) => [...packetData, ...newTempPacketData]);

          const newTempProductData = temCategoryData.map((item) => {
            let wastageFine = parseFloat(
              (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
            ).toFixed(3);

            let totFine = parseFloat(
              (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
              parseFloat(wastageFine)
            ).toFixed(3);

            let labFineAmt = parseFloat(
              (parseFloat(wastageFine) * parseFloat(fineRate)) / 10
            ).toFixed(3);
            let totAmt = parseFloat(
              parseFloat(labFineAmt) + parseFloat(item.other_amt)
            ).toFixed(3);

            let cgstPer =
              vendorStateId === 12
                ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
                : 0;

            let cgstVal =
              vendorStateId === 12
                ? parseFloat(
                  (parseFloat(totAmt) * parseFloat(cgstPer)) / 100
                ).toFixed(3)
                : 0;

            let sGstPer =
              vendorStateId === 12
                ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
                : 0;

            let sgstVal =
              vendorStateId === 12
                ? parseFloat(
                  (parseFloat(totAmt) * parseFloat(sGstPer)) / 100
                ).toFixed(3)
                : 0;

            let IGSTper =
              vendorStateId !== 12 ? parseFloat(jobWorkerGst).toFixed(3) : 0;

            let igstVal =
              vendorStateId !== 12
                ? parseFloat(
                  (parseFloat(totAmt) * parseFloat(IGSTper)) / 100
                ).toFixed(3)
                : 0;

            let tot =
              vendorStateId === 12
                ? parseFloat(
                  parseFloat(totAmt) +
                  parseFloat(cgstVal) +
                  parseFloat(sgstVal)
                ).toFixed(3)
                : parseFloat(parseFloat(totAmt) + parseFloat(igstVal)).toFixed(
                  3
                );

            return {
              ...item,
              hsn_number: jobworkerHSN,
              wastage: tempPackingSlip.wastage,
              wastageFine: wastageFine,
              totalFine: totFine,
              fineRate: parseFloat(fineRate).toFixed(3),
              catRate: parseFloat(
                parseFloat(totAmt) / parseFloat(item.net_wgt)
              ).toFixed(3),
              // amount: parseFloat(parseFloat(labFineAmt) + parseFloat(item.other_amt)).toFixed(3),
              jobworkFineUtilize: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100
              ).toFixed(3),
              labourFineAmount: labFineAmt,
              hallmark_charges: parseFloat(
                parseFloat(tempPackingSlip.hallmark_charges) *
                parseFloat(item.pcs)
              ).toFixed(3),
              totalAmount: totAmt,
              cgstPer: cgstPer,
              cgstVal: cgstVal,
              sGstPer: sGstPer,
              sGstVal: sgstVal,
              IGSTper: IGSTper,
              IGSTVal: igstVal,
              total: tot,
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
            ...productData,
            ...newTempProductData,
          ]);

          const tempTagWise = tempProductData.map((item) => {
            let wastageFine = parseFloat(
              (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
            ).toFixed(3);

            let totFine = parseFloat(
              (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
              parseFloat(wastageFine)
            ).toFixed(3);

            let labFineAmt = parseFloat(
              (parseFloat(wastageFine) * parseFloat(fineRate)) / 10
            ).toFixed(3);

            let totAmt = parseFloat(
              parseFloat(labFineAmt) + parseFloat(item.other_amt)
            ).toFixed(3);

            let cgstPer =
              vendorStateId === 12
                ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
                : 0;

            let cgstVal =
              vendorStateId === 12
                ? parseFloat(
                  (parseFloat(totAmt) * parseFloat(cgstPer)) / 100
                ).toFixed(3)
                : 0;

            let sGstPer =
              vendorStateId === 12
                ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
                : 0;

            let sgstVal =
              vendorStateId === 12
                ? parseFloat(
                  (parseFloat(totAmt) * parseFloat(sGstPer)) / 100
                ).toFixed(3)
                : 0;

            let IGSTper =
              vendorStateId !== 12 ? parseFloat(jobWorkerGst).toFixed(3) : 0;

            let igstVal =
              vendorStateId !== 12
                ? parseFloat(
                  (parseFloat(totAmt) * parseFloat(IGSTper)) / 100
                ).toFixed(3)
                : 0;

            let tot =
              vendorStateId === 12
                ? parseFloat(
                  parseFloat(totAmt) +
                  parseFloat(cgstVal) +
                  parseFloat(sgstVal)
                ).toFixed(3)
                : parseFloat(parseFloat(totAmt) + parseFloat(igstVal)).toFixed(
                  3
                );

            return {
              ...item,
              hsn_number: jobworkerHSN,
              wastage: tempPackingSlip.wastage,
              wastageFine: wastageFine,
              totalFine: totFine,
              fineRate: parseFloat(fineRate).toFixed(3),
              catRate: parseFloat(
                parseFloat(totAmt) / parseFloat(item.net_wgt)
              ).toFixed(3),
              // amount: parseFloat(parseFloat(labFineAmt) + parseFloat(item.other_amt)).toFixed(3),
              jobworkFineUtilize: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100
              ).toFixed(3),
              labourFineAmount: labFineAmt,
              hallmark_charges: parseFloat(
                parseFloat(tempPackingSlip.hallmark_charges) *
                parseFloat(item.pcs)
              ).toFixed(3),
              totalAmount: totAmt,
              cgstPer: cgstPer,
              cgstVal: cgstVal,
              sGstPer: sGstPer,
              sGstVal: sgstVal,
              IGSTper: IGSTper,
              IGSTVal: igstVal,
              total: tot,
            };
          });

          setTagWiseData((tagWiseData) => [...tagWiseData, ...tempTagWise]);
          // console.log(tempTagWise)

          const tempBillMaterial = tempProductData.map((item) => {
            let wastageFine = parseFloat(
              (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
            ).toFixed(3);

            let totFine = parseFloat(
              (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
              parseFloat(wastageFine)
            ).toFixed(3);

            let labFineAmt = parseFloat(
              (parseFloat(wastageFine) * parseFloat(fineRate)) / 10
            ).toFixed(3);
            let totAmt = parseFloat(
              parseFloat(labFineAmt) + parseFloat(item.other_amt)
            ).toFixed(3);

            let cgstPer =
              vendorStateId === 12
                ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
                : 0;

            let cgstVal =
              vendorStateId === 12
                ? parseFloat(
                  (parseFloat(totAmt) * parseFloat(cgstPer)) / 100
                ).toFixed(3)
                : 0;

            let sGstPer =
              vendorStateId === 12
                ? parseFloat(parseFloat(jobWorkerGst) / 2).toFixed(3)
                : 0;

            let sgstVal =
              vendorStateId === 12
                ? parseFloat(
                  (parseFloat(totAmt) * parseFloat(sGstPer)) / 100
                ).toFixed(3)
                : 0;

            let IGSTper =
              vendorStateId !== 12 ? parseFloat(jobWorkerGst).toFixed(3) : 0;

            let igstVal =
              vendorStateId !== 12
                ? parseFloat(
                  (parseFloat(totAmt) * parseFloat(IGSTper)) / 100
                ).toFixed(3)
                : 0;

            let tot =
              vendorStateId === 12
                ? parseFloat(
                  parseFloat(totAmt) +
                  parseFloat(cgstVal) +
                  parseFloat(sgstVal)
                ).toFixed(3)
                : parseFloat(parseFloat(totAmt) + parseFloat(igstVal)).toFixed(3);

            return {
              ...item,
              metal_wgt:
                parseFloat(parseFloat(item.gross_wgt) -
                  (parseFloat(item.stone_wgt) +
                    parseFloat(item.beads_wgt) +
                    parseFloat(item.silver_wgt) +
                    parseFloat(item.sol_wgt) +
                    parseFloat(item.other_wgt))).toFixed(3),
              // metal_amt: "",
              stone_wgt: parseFloat(item.stone_wgt).toFixed(3),
              wastage: tempPackingSlip.wastage,
              wastageFine: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
              ).toFixed(3),
              totalFine: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
                (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
              ).toFixed(3),
              totalAmount: totAmt,
              cgstPer: cgstPer,
              cgstVal: cgstVal,
              sGstPer: sGstPer,
              sGstVal: sgstVal,
              IGSTper: IGSTper,
              IGSTVal: igstVal,
              total: tot,
            };
          });

          setBillmaterialData((billMaterialData) => [
            ...billMaterialData,
            ...tempBillMaterial,
          ]);

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
          function grossWeight(item) {
            // console.log(parseFloat(item.grossWeight));
            return parseFloat(item.gross_wgt);
          }
          function netWeight(item) {
            return parseFloat(item.net_wgt);
          }

          let tempGrossWtTot = parseFloat(temp
            .filter((data) => data.gross_wgt !== "")
            .map(grossWeight)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0)).toFixed(3)
          setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3))

          let tempNetWtTot = parseFloat(
            temp
              .filter((data) => data.net_wgt !== "")
              .map(netWeight)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0)
          ).toFixed(3)
          setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));


          let tempAmount = temp
            .filter((item) => item.totalAmount !== "")
            .map(amount)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          // setSubTotal(parseFloat(tempAmount).toFixed(3));

          //tempTotal is amount + gst
          let tempTotal = 0;
          let tempCgstVal = 0;
          let tempSgstVal = 0;
          let tempIgstVal = 0;

          if (vendorStateId === 12) {
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

            // setTotalGST(
            //   (parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
            // );
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
            // setIgstVal(parseFloat(tempIgstVal).toFixed(3));
            // setTotalGST(parseFloat(tempIgstVal).toFixed(3));
            tempTotal = parseFloat(
              parseFloat(tempAmount) + parseFloat(tempIgstVal)
            ).toFixed(3);
          }

          setTotal(parseFloat(tempTotal).toFixed(3));
          // setAmount(parseFloat(tempAmount).toFixed(3));

          if (parseFloat(tempTotal) > 0) {
            // let tempLedgerAmount = 0;
            // let tempfinalAmount = 0;
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


            setPrintObj({
              ...printObj,
              orderDetails: temp,
              taxableAmount: parseFloat(tempAmount).toFixed(3),
              iGstTot: vendorStateId !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
              sGstTot: vendorStateId === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
              cGstTot: vendorStateId === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
              roundOff: roundOff,
              grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
              netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
              totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
              balancePayable: parseFloat(tempTotalInvoiceAmt).toFixed(3),

            })
          } else {
            setTotalInvoiceAmount(0);
            // setLegderAmount(0);
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/packingslip/packingSlip/${packingSlipNum}` })

      });
  }

  function createFromPackingSlip(resetFlag, toBePrint) {
    let Orders = packingSlipIdArr.map((x) => {
      return {
        packing_slip_id: x.packing_slip_id,
      };
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
      opposite_account_id: oppositeAccSelected.value,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      jobworker_id: selectedJobWorker.value,
      finalRate: fineRate,
      round_off: roundOff === "" ? 0 : roundOff,
      jewellery_narration: jewelNarration,
      account_narration: accNarration,
      is_shipped: parseInt(shipping),
      ...(shipping === "1" && {
        shipping_client_id: shippingVendor.value,
        shipping_client_company_id: selectedCompany.value,
      }),
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      Orders: Orders,
      uploadDocIds: docIds,
      party_voucher_date:partyVoucherDate,
    }
    axios
      .post(
        Config.getCommonUrl() +
        "api/jewelleryPurchaseArticianReturn/create/createFromPackingSlip", body)
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
          // setSelectedJobWorker("");
          // setSelectedCompany("");
          // setShipping("");
          // setPackingSlipNo("");
          // setPackingSlipIdArr([]);
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
        handleError(error, dispatch, {
          api: "api/jewelleryPurchaseArticianReturn/create/createFromPackingSlip",
          body: body
        })
      });
  }

  function deleteHandler(slipNo) {
    console.log("domestic", slipNo);
    //handle packing slip id array, remove from array too
    // packingSlipIdArr
    // setPackingSlipIdArr(
    //   packingSlipIdArr.filter((item) => item.packing_slip_no !== slipNo)
    // );
    // setPackingSlipData(
    //   packingSlipData.filter((item) => item.packing_slip_no !== slipNo)
    // );
    // setPacketData(packetData.filter((item) => item.packing_slip_no !== slipNo));
    // setProductData(
    //   productData.filter((item) => item.packing_slip_no !== slipNo)
    // );
    // setBillmaterialData(
    //   billMaterialData.filter((item) => item.packing_slip_no !== slipNo)
    // );
    // setTagWiseData(
    //   tagWiseData.filter((item) => item.packing_slip_no !== slipNo)
    // );
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

    console.log(tempProduct)

    let tempAmount = tempProduct
      .filter((item) => item.totalAmount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    let tempTotal = 0;
    let tempCgstVal = 0;
    let tempSgstVal = 0;
    let tempIgstVal = 0;

    if (vendorStateId === 12) {
      tempCgstVal = tempProduct
        .filter((item) => item.cgstVal !== "")
        .map(CGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);

      tempSgstVal = tempProduct
        .filter((item) => item.sGstVal !== "")
        .map(SGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);

      // setTotalGST(
      //   (parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
      // );
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
      // setIgstVal(parseFloat(tempIgstVal).toFixed(3));
      // setTotalGST(parseFloat(tempIgstVal).toFixed(3));
      tempTotal = parseFloat(
        parseFloat(tempAmount) + parseFloat(tempIgstVal)
      ).toFixed(3);
    }

    setTotal(parseFloat(tempTotal).toFixed(3));
    // setAmount(parseFloat(tempAmount).toFixed(3));
    let tempTotalInvoiceAmt = 0;
    if (parseFloat(tempTotal) > 0) {
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
    } else {
      setTotalInvoiceAmount(0);
      // setLegderAmount(0);
    }

    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.gross_wgt);
    }
    function netWeight(item) {
      return parseFloat(item.net_wgt);
    }

    let tempGrossWtTot = parseFloat(tempProduct
      .filter((data) => data.gross_wgt !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3)
    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3))

    let tempNetWtTot = parseFloat(
      tempProduct
        .filter((data) => data.net_wgt !== "")
        .map(netWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3)
    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

    setTimeout(() => {
      setPrintObj({
        ...printObj,
        orderDetails: tempProduct,
        taxableAmount: parseFloat(tempAmount).toFixed(3),
        iGstTot: vendorStateId !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
        sGstTot: vendorStateId === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
        cGstTot: vendorStateId === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
        totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
        balancePayable: parseFloat(tempTotalInvoiceAmt).toFixed(3),
        grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
        netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      })
    }, 800);
  }

  function deleteRow(index) {
    console.log(index)
    let newFormValues = [...userFormValues];

    newFormValues[index].loadType = ""
    newFormValues[index].category = ""
    newFormValues[index].billingCategory = ""
    newFormValues[index].HSNNum = ""
    newFormValues[index].lotNumber = ""
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
    newFormValues[index].jobworkFineUtilize = ""
    newFormValues[index].wastagePer = ""
    newFormValues[index].wastageFine = ""
    newFormValues[index].fineRate = ""
    newFormValues[index].labourFineAmount = ""
    newFormValues[index].otherTagAmount = ""
    newFormValues[index].catRatePerGram = ""
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
      // amount: null,
      // hallmarkCharges: null,
      totalAmount: null,
      cgstPer: null,
      cgstVal: null,
      sGstPer: null,
      sGstVal: null,
      IGSTper: null,
      IGSTVal: null,
      total: null,
    }

    // setUserFormValues(newFormValues)

    changeTotal(newFormValues, false);
  }
  const handleNarrationClick = () => {
    console.log("handleNarr", narrationFlag)
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        "flag": 19,
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
                        ? "View Jewellery Purchase Return (Artician Return)"
                        : "Add Jewellery Purchase Return (Artician Return)"}
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
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p style={{ paddingBottom: "3px" }}>Select load type</p>
                        <select
                          className={clsx(classes.selectBox, "focusClass")}
                          name="selectedLoad"
                          required
                          value={selectedLoad}
                          onChange={(e) => handleLoadChange(e)}
                          disabled={isView}
                          ref={loadTypeRef}
                        >
                          <option hidden value="">
                            Select load type
                          </option>
                          <option value="0">Load Packing Slip</option>
                          <option value="1">Load Finding Varient</option>
                          <option value="2">Load Lot directly</option>
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
                        <p style={{ paddingBottom: "3px" }}>Party name</p>
                        <Select
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
                          placeholder="Party name"
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
                          Party voucher number
                        </p>
                        <TextField
                          className=""
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
                          Party voucher date
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

                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p style={{ paddingBottom: "3px" }}>Fine rate</p>
                        <TextField
                          className=""
                          placeholder="Fine rate"
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
                        style={{ padding: 6 }}
                      >
                        <p style={{ paddingBottom: "3px" }}>
                          Ship to other party
                        </p>
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
                            <p style={{ paddingBottom: "3px" }}>
                              Shipping party name
                            </p>
                            <Select
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              id="select-input-blg"
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
                              placeholder="Shipping party name"
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
                            <p style={{ paddingBottom: "3px" }}>
                              Shipping party company
                            </p>
                            <Select
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              id="select-input-blg"
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
                              placeholder="Shipping party company"
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

                      {/* <Grid item xs={2} style={{ padding: 6 }}>
                      <Button
                        id="button-jewellery"
                        variant="contained"
                        color="primary"
                        className="w-224 mx-auto"
                        aria-label="Register"
                        onClick={handleSelectVoucher}
                      >
                        Select Voucher
                      </Button>
                      <span style={{ color: "red" }}>
                        {selectVoucherErr.length > 0 ? selectVoucherErr : ""}
                      </span>
                    </Grid> */}

                      {selectedLoad === "0" && !isView && (
                        <Grid
                          className="packing-slip-input"
                          item
                          lg={2}
                          md={4}
                          sm={4}
                          xs={12}
                          style={{ padding: 6 }}
                        >
                          <p style={{ paddingBottom: "3px" }}>
                            Packing slip no
                          </p>
                          <Autocomplete
                            id="free-solo-demo"
                            freeSolo
                            disableClearable
                            onChange={(event, newValue) => {
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
                              (option) => option.barcode
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                style={{ padding: 0 }}
                                label="Packing slip no"
                              />
                            )}
                          />
                          <span style={{ color: "red" }}>
                            {packingSlipErr.length > 0 ? packingSlipErr : ""}
                          </span>
                        </Grid>
                      )}
                    </Grid>

                    {selectedLoad === "0" && (
                      <Grid className="salesjobwork-table-main mt-16 add-jewelpurchasereturn-artician-dv addsales-jobreturn-domestic-dv">
                        <div className={classes.root}>
                          <AppBar
                            position="static"
                            className="add-header-purchase"
                          >
                            <Tabs value={modalView} onChange={handleChangeTab}>
                              <Tab label="Category Wise List" />
                              <Tab label="Tag Wise List" />
                              <Tab label="Packet Wise List" />
                              <Tab label="Packing Slip Wise List" />
                              <Tab label="Bill Of Material" />
                            </Tabs>
                          </AppBar>
                          {modalView === 0 && (
                            <CategoryWiseList
                              productData={productData}
                              isView={isView}
                              isIgst={isIgst}
                              stateId={vendorStateId}
                            />
                          )}
                          {modalView === 1 && (
                            <TagWiseList
                              tagWiseData={tagWiseData}
                              isView={isView}
                              isIgst={isIgst}
                              stateId={vendorStateId}
                            />
                          )}
                          {modalView === 2 && (
                            <PacketWiseList
                              packetData={packetData}
                              stateId={vendorStateId}
                              isIgst={isIgst}
                              isView={isView}
                            />
                          )}
                          {modalView === 3 && (
                            <PackingSlipWiseList
                              packingSlipData={packingSlipData}
                              deleteHandler={deleteHandler}
                              isIgst={isIgst}
                              stateId={vendorStateId}
                              isView={isView}
                            />
                          )}
                          {modalView === 4 && (
                            <BillOfMaterial
                              billMaterialData={billMaterialData}
                              stateId={vendorStateId}
                              isIgst={isIgst}
                              isView={isView}
                            />
                          )}
                        </div>
                      </Grid>
                    )}

                    {(selectedLoad === "1" || selectedLoad === "2") && (
                      <div className="jewellery-artician-full-width addjewepurchase-tabel-main addjewepurchase-artician-tabel">
                        <div className="inner-addsalestabel-blg ">
                          <div
                            className="mt-16 artician-jewellery-tbl"
                            style={{
                              border: "1px solid #D1D8F5",
                              paddingBottom: 5,
                              borderRadius: "7px",
                            }}
                          >
                            <div
                              id="jewellery-artician-head"
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
                                >
                                  {/* delete action */}
                                </div>
                              )}
                              <div className={classes.tableheader}>
                                {selectedLoad === "1"
                                  ? "Category"
                                  : "Lot Number"}
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
                                Jobwork Fine Utilize
                              </div>

                              <div className={clsx(classes.tableheader, "")}>
                                Wastage (%)
                              </div>
                              <div className={clsx(classes.tableheader, "")}>
                                Wastage (Fine)
                              </div>
                              <div className={clsx(classes.tableheader, "")}>
                                Fine Rate
                              </div>
                              <div className={clsx(classes.tableheader, "")}>
                                Labour Fine Amount
                              </div>
                              <div className={clsx(classes.tableheader, "")}>
                                Other tag Amount
                              </div>
                              <div className={clsx(classes.tableheader, "")}>
                                Category Rate per gram
                              </div>
                              <div className={clsx(classes.tableheader, "")}>
                                Total Amount
                              </div>

                              {isView &&
                              igstVal != 0 &&
                              igstVal !== "" &&
                              !isNaN(igstVal) ? (
                                <>
                                  <div
                                    className={clsx(classes.tableheader, "")}
                                  >
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

                              {!isView && vendorStateId === 12 && (
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
                              )}

                              {!isView && vendorStateId !== 12 && (
                                <>
                                  <div
                                    className={clsx(classes.tableheader, "")}
                                  >
                                    IGST (%)
                                  </div>
                                  <div
                                    className={clsx(classes.tableheader, "")}
                                  >
                                    IGST
                                  </div>
                                </>
                              )}

                              <div className={clsx(classes.tableheader, "")}>
                                Total
                              </div>
                            </div>

                            {userFormValues.map((element, index) => (
                              <div
                                key={index}
                                id="artician-jewellery-head"
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
                                      <Icon className="mr-8 delete-icone">
                                        <img src={Icones.delete_red} alt="" />
                                      </Icon>
                                    </IconButton>
                                  </div>
                                )}
                                {selectedLoad === "1" && (
                                  <>
                                    <Select
                                      id="add-jewelpurchase-dropdown"
                                      filterOption={createFilter({
                                        ignoreAccents: false,
                                      })}
                                      className={classes.selectBox}
                                      classes={classes}
                                      styles={selectStyles}
                                      options={stockCodeData
                                        .filter((array) =>
                                          userFormValues.every(
                                            (item) =>
                                              !(
                                                item.category?.value ===
                                                  array.stock_name_code.id &&
                                                item.category.label ===
                                                  array.stock_name_code
                                                    .stock_code
                                              )
                                          )
                                        )
                                        .map((suggestion) => ({
                                          value: suggestion.stock_name_code.id,
                                          label:
                                            suggestion.stock_name_code
                                              .stock_code,
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

                                {selectedLoad === "2" && (
                                  <>
                                    <Select
                                      id="add-jewelpurchase-dropdown"
                                      filterOption={createFilter({
                                        ignoreAccents: false,
                                      })}
                                      className={classes.selectBox}
                                      classes={classes}
                                      styles={selectStyles}
                                      options={lotdata
                                        // .filter(array => userFormValues.every(item => (!(item.lotNumber?.value === array.id && item.lotNumber.label === array.number)) ))
                                        .map((suggestion) => ({
                                          value: suggestion.id,
                                          label: suggestion.number,
                                        }))}
                                      // components={components}
                                      value={
                                        element.lotNumber !== ""
                                          ? element.lotNumber.value === ""
                                            ? ""
                                            : element.lotNumber
                                          : ""
                                      }
                                      onChange={(e) => {
                                        handleLotNumChange(index, e);
                                      }}
                                      placeholder="Lot Number"
                                      isDisabled={isView}
                                    />

                                    {element.errors !== undefined &&
                                    element.errors.lotNumber !== null ? (
                                      <span style={{ color: "red" }}>
                                        {element.errors.lotNumber}
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
                                  // label="pieces"
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
                                  disabled={isView || selectedLoad == "2"}
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
                                  disabled={isView || selectedLoad == "2"}
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
                                  disabled={isView || selectedLoad == "2"}
                                />

                                {/* {(element.isWeightDiff === 0 && selectedLoad === "1") && ( */}
                                {element.grossWeight !== "" &&
                                  element.netWeight !== "" &&
                                  parseFloat(element.grossWeight).toFixed(3) !==
                                    parseFloat(element.netWeight).toFixed(3) &&
                                  selectedLoad === "1" && (
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
                                          position: "absolute",
                                          left: "-30px",
                                        }}
                                      >
                                        error
                                      </Icon>
                                    </IconButton>
                                  )}

                                <TextField
                                  // label="purity"
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
                                  // label="jobworkFineUtilize"
                                  name="jobworkFineUtilize"
                                  className=""
                                  value={element.jobworkFineUtilize || ""}
                                  // value={departmentNm}
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
                                  disabled
                                />

                                <TextField
                                  // label="wastagePer"
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
                                  // label="fineRate"
                                  name="fineRate"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(element.fineRate)
                                      : element.fineRate || ""
                                  }
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
                                  // label="labourFineAmount"
                                  name="labourFineAmount"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(
                                          element.labourFineAmount
                                        )
                                      : element.labourFineAmount || ""
                                  }
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
                                  // label="otherTagAmount"
                                  name="otherTagAmount"
                                  className={classes.inputBoxTEST}
                                  type={isView ? "text" : "number"}
                                  value={
                                    isView
                                      ? Config.numWithComma(
                                          element.otherTagAmount
                                        )
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
                                  // label="catRatePerGram"
                                  name="catRatePerGram"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(
                                          element.catRatePerGram
                                        )
                                      : isNaN(element.catRatePerGram)
                                      ? ""
                                      : element.catRatePerGram || ""
                                  }
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
                                  // label="totalAmount"
                                  name="totalAmount"
                                  className=""
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
                                  disabled
                                />

                                {isView &&
                                element.IGSTper &&
                                element.IGSTVal ? (
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

                                {!isView && vendorStateId === 12 && (
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
                                          ? Config.numWithComma(element.cgstVal)
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
                                          ? Config.numWithComma(element.sGstVal)
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

                                {!isView && vendorStateId !== 12 && (
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
                                          ? Config.numWithComma(element.IGSTVal)
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
                                      ? Config.numWithComma(element.total)
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
                              className="castum-row-dv"
                              // id="artician-jewellery-head"
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
                                  // className={clsx(
                                  //   classes.tableheader,
                                  //   " artician-jewellery-row"
                                  // )}
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
                                {HelperFunc.getTotalOfField(
                                  userFormValues,
                                  "wastageFine"
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
                                {HelperFunc.getTotalOfField(
                                  userFormValues,
                                  "labourFineAmount"
                                )}
                              </div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {/* {HelperFunc.getTotalOfField(userFormValues, "otherTagAmount")} */}
                                {isView
                                  ? Config.numWithComma(
                                      HelperFunc.getTotalOfField(
                                        userFormValues,
                                        "otherTagAmount"
                                      )
                                    )
                                  : HelperFunc.getTotalOfField(
                                      userFormValues,
                                      "otherTagAmount"
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
                                {isView
                                  ? Config.numWithComma(totalAmount)
                                  : totalAmount}
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
                  </form>

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
                        Round Off{" "}
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
                          disabled={isView}
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
                        {" "}
                        {isView
                          ? Config.numWithComma(totalInvoiceAmount)
                          : totalInvoiceAmount}
                      </label>
                    </div>
                  </div>

                  {/* <div className="textarea-row">
                  <TextField
                    className="mt-16 textarea-inpt-dv mr-2"
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
                      <p style={{ paddingBottom: "3px" }}>
                        jewellery narration
                      </p>
                      <TextField
                        className="mt-1 textarea-inpt-dv"
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
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ float: "right" }}
                        className="w-224 mx-auto mt-16 btn-print-save"
                        aria-label="Register"
                        hidden={isView}
                        disabled={totalInvoiceAmount == 0}
                        // type="submit"
                        onClick={(e) => {
                          handleFormSubmit(e);
                        }}
                      >
                        Save
                      </Button>

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
                        <JewelPurArticianReturnPrintComp
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
                      className={clsx(classes.button, "btn-print-save")}
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
                    purchase_flag="19"
                    concateDocument={concateDocument}
                    viewPopup={props.viewPopup}
                  />
                </div>
              </div>
            </div>
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
                          disabled={isView}
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

            {/* <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={voucherModalOpen}
              onClose={handleVoucherModalClose}
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
                </h5>

                <div className="p-5 pl-16 pr-16">
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}></TableCell>

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
                          Amount
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {voucherApiData !== "" &&
                        voucherApiData.map((row, index) => (
                          <TableRow
                            key={index}
                            onClick={(e) => handleVoucherSelect(row.id)}
                            className={classes.hoverClass}
                          >
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ width: "10%" }}
                            >
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
                            <TableCell
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
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>

                </div>
              </div>
            </Modal> */}
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddJewelPurchaseArticianReturn;

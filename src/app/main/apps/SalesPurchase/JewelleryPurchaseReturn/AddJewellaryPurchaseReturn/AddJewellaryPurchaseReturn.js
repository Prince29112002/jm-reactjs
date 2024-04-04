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

import Select, { createFilter } from "react-select";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Modal from "@material-ui/core/Modal";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment";
import History from "@history";
import Loader from "app/main/Loader/Loader";
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
import { JewellaryPurReturnPrintComp } from "../Components/JewellaryPurReturnPrintComp";
import { JewellaryPurcReturnHmPrintComp } from "../Components/JewellaryPurcReturnHmPrintComp";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
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

const AddJewellaryPurchaseReturn = (props) => {
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
    purity: "",
    Pieces: "",
    fine: "",
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
    documentTitle: "Jewellery_Purchase_Return_Voucher_" + getDateAndTime(),
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
        if (handleDateBlur() && selectedLoad === "1") {
          // if (uploadTypeValidation()) {
          if (shipping === "1") {
            if (shippingVendValidation() && shippingCompValidation()) {
              createFromPackingSlip(false, true);
            }
          } else {
            createFromPackingSlip(false, true);
          }
          // }
        } else {
          if (handleDateBlur() && shipping === "1") {
            if (shippingVendValidation() && shippingCompValidation()) {
              // if (selectedLoad === "0") {
              //check prev valid
              if (prevIsValid()) {
                addUserInputApi(false, true);
              }
            }
          } else {
            if (prevIsValid()) {
              addUserInputApi(false, true);
            }
          }
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
      callFileUploadApi(docFile, 18)
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

  const [loading, setLoading] = useState(false);
  // const [apiData, setApiData] = useState([]);
  
  const [modalStyle] = useState(getModalStyle);
  // "0" = Load Finding Variant
  // "1" = Load Barcoded Stock form excel
  const loadTypeRef = useRef(null)

  const [selectedLoad, setSelectedLoad] = useState("");
  const [selectedLoadErr, setSelectedLoadErr] = useState("");

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

  const [selectedVendorClient, setVendorClient] = useState({ value: 1, label: "Vendor" });

  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");
  const [address, setAddress] = useState("");
  const [supplierGstUinNum, setSupplierGstUinNum] = useState("");
  const [supPanNum, setSupPanNum] = useState("");
  const [supState, setSupState] = useState("");
  const [supCountry, setSupCountry] = useState("");
  const [supStateCode, setSupStateCode] = useState("");


  const [selectedRateFixErr, setSelectedRateFixErr] = useState("");

  const [rfModalOpen, setRfModalOpen] = useState(false);

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
  const [narrationFlag, setNarrationFlag] = useState(false)


  const [jewelNarration, setJewelNarration] = useState("");
  const [jewelNarrationErr, setJewelNarrationErr] = useState("");

  const [adjustedRate, setAdjustedRate] = useState(false);

  const [vendorStateId, setVendorStateId] = useState("");

  const [balanceRfixData, setBalanceRfixData] = useState("");
  const [balRfixViewData, setBalRfixViewData] = useState([]);

  // const [canEnterVal, setCanEnterVal] = useState(false);

  const [shortageRfix, setShortageRfix] = useState("");
  const [shortageRfixErr, setShortageRfixErr] = useState("");

  const [tempRate, setTempRate] = useState("");
  const [tempRateErr, setTempRateErr] = useState("");

  const [avgRate, setAvgeRate] = useState("");
  const [avgRateErr, setAvgeRateErr] = useState("");

  const [tempApiWeight, setTempApiWeight] = useState("");

  const [totalGrossWeight, setTotalGrossWeight] = useState("");
  const [totalNetWeight, setTotalNetWeight] = useState("");

  const [OtherTagAmount, setOtherTagAmount] = useState("");
  const [amount, setAmount] = useState("");
  const [hallmarkCharges, setHallmarkCharges] = useState("");//total
  const [totalAmount, setTotalAmount] = useState("");
  const [cgstVal, setCgstVal] = useState("");
  const [sgstVal, setSgstVal] = useState("");
  const [igstVal, setIgstVal] = useState("");
  const [total, setTotal] = useState("");
  const [fineGoldTotal, setFineGoldTotal] = useState("");

  // const [fileSelected, setFileSelected] = useState("");
  // const [isUploaded, setIsuploaded] = useState(false);

  // const [utiliseErr, setUtiliseErr] = useState("");
  const [utiliseTotal, setUtiliseTotal] = useState("");

  const [popupErr, setPopupErr] = useState("");

  const [newRate, setNewRate] = useState("");

  const theme = useTheme();

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

  const [HMCharges, setHMCharges] = useState("") // hall mark charges for rows

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
  var idToBeView;
  if (props.location) {
    idToBeView = props.location.state;
  } else if (props.voucherId) {
    idToBeView = { id: props.voucherId }
  }

  const [stockCodeData, setStockCodeData] = useState([]);

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

  const [userFormValues, setUserFormValues] = useState([
    {
      loadType: "",
      Category: "",
      billingCategory: "",
      HSNNum: "",
      LotNumber: "",
      Pieces: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      fine: "",
      wastagePer: "",
      wastageFine: "",
      otherTagAmt: "",
      totalFine: "",
      fineRate: "",
      categoryRate: "",
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
      errors: {
        Category: null,
        billingCategory: null,
        HSNNum: null,
        LotNumber: null,
        Pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        fine: null,
        wastagePer: null,
        wastageFine: null,
        otherTagAmt: null,
        totalFine: null,
        fineRate: null,
        categoryRate: null,
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
      loadType: "",
      Category: "",
      billingCategory: "",
      HSNNum: "",
      LotNumber: "",
      Pieces: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      fine: "",
      wastagePer: "",
      wastageFine: "",
      otherTagAmt: "",
      totalFine: "",
      fineRate: "",
      categoryRate: "",
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
      errors: {
        Category: null,
        billingCategory: null,
        HSNNum: null,
        LotNumber: null,
        Pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        fine: null,
        wastagePer: null,
        wastageFine: null,
        otherTagAmt: null,
        totalFine: null,
        fineRate: null,
        categoryRate: null,
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
      loadType: "",
      Category: "",
      billingCategory: "",
      HSNNum: "",
      LotNumber: "",
      Pieces: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      fine: "",
      wastagePer: "",
      wastageFine: "",
      otherTagAmt: "",
      totalFine: "",
      fineRate: "",
      categoryRate: "",
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
      errors: {
        Category: null,
        billingCategory: null,
        HSNNum: null,
        LotNumber: null,
        Pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        fine: null,
        wastagePer: null,
        wastageFine: null,
        otherTagAmt: null,
        totalFine: null,
        fineRate: null,
        categoryRate: null,
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
      loadType: "",
      Category: "",
      billingCategory: "",
      HSNNum: "",
      LotNumber: "",
      Pieces: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      fine: "",
      wastagePer: "",
      wastageFine: "",
      otherTagAmt: "",
      totalFine: "",
      fineRate: "",
      categoryRate: "",
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
      errors: {
        Category: null,
        billingCategory: null,
        HSNNum: null,
        LotNumber: null,
        Pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        fine: null,
        wastagePer: null,
        wastageFine: null,
        otherTagAmt: null,
        totalFine: null,
        fineRate: null,
        categoryRate: null,
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
  const vendorClientArr = [
    { id: 1, name: "Vendor" },
    { id: 2, name: "Client" }
  ];
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
    setOppositeAccData(HelperFunc.getOppositeAccountDetails("JewelleryPurchaseReturn"));
    console.log("idToBeView", idToBeView);
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true)
      getJewelPurchReturnRecordForView(idToBeView.id);
    } else {
      getVoucherNumber(); //if view only then no need to get new voucher number, we will set data coming from api
      getStockCodeFindingVariant();
      getStockCodeStone();
      getClientData(); //for shipping
      setNarrationFlag(false)
      getHallmarkCharges()
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
        getClientdata();
      }
    }
  }, [selectedVendorClient])

  function getJewelPurchReturnRecordForView(id) {
    setLoading(true);
    let api = ""
    if(props.forDeletedVoucher){
      api = `api/jewellerypurchasereturn/${id}?deleted_at=1`
    }else {
      api = `api/jewellerypurchasereturn/${id}`
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
              let otherDetail = response.data.data.otherDetails;
              setDocumentList(finalData.salesPurchaseDocs)

              setSelectedLoad(otherDetail.loadType.toString());

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
                  value: finalData.ClientCompany.id,
                  label: finalData.ClientCompany.client.name,
                });
                setSelectedClientFirm({
                  value: finalData.ClientCompany.id,
                  label: finalData.ClientCompany.firm_name,
                });
              }
              console.log(mainObj)
              setTimeDate(response.data.data.data.created_at);
              setVoucherNumber(finalData.voucher_no);
              setPartyVoucherDate(finalData.party_voucher_date)
              setAllowedBackDate(true);
              setVoucherDate(finalData.purchase_voucher_create_date);
              setVendorStateId(mainObj.state);

              setOppositeAccSelected({
                value: finalData.opposite_account_id,
                label: finalData.OppositeAccount.name,
              });
              setPartyVoucherNum(finalData.party_voucher_no);
              setRoundOff(
                finalData.round_off === null ? "" : finalData.round_off
              );

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

              setNewRate(finalData.JewelleryPurchaseReturnOrders[0].fine_rate)

              if (otherDetail.loadType === 0) {
                //finding variant
                let tempArray = [];
                // console.log(OrdersData);
                for (let item of finalData.JewelleryPurchaseReturnOrders) {
                  // console.log(item);
                  tempArray.push({
                    loadType: otherDetail.loadType.toString(),
                    Category: {
                      value: item.StockNameCode.id,
                      label: item.StockNameCode.stock_code,
                    },
                    billingCategory: item.StockNameCode.stock_name_code.billing_name,
                    HSNNum: item.hsn_number ? item.hsn_number : '',
                    // LotNumber: "",
                    Pieces: item.pcs,
                    grossWeight: parseFloat(item.gross_wt).toFixed(3),
                    netWeight: parseFloat(item.net_wt).toFixed(3),
                    purity: item.purity,
                    fine: parseFloat(item.fine).toFixed(3),
                    wastagePer: parseFloat(item.wastage_per).toFixed(3),
                    wastageFine: item.wastage_fine,
                    otherTagAmt: parseFloat(item.other_tag_amount).toFixed(3),
                    totalFine: item.total_fine,
                    fineRate: parseFloat(item.fine_rate).toFixed(3),
                    categoryRate: parseFloat(item.category_rate).toFixed(3),
                    amount: parseFloat(item.amount).toFixed(3),
                    hallmarkCharges: parseFloat(item.hallmark_charges).toFixed(3),
                    totalAmount: parseFloat(item.total_amount).toFixed(3),
                    cgstPer: item.cgst,
                    cgstVal: item.cgst !== null ? parseFloat(parseFloat(item.total_amount) * parseFloat(item.cgst) / 100).toFixed(3) : "",
                    sGstPer: item.sgst,
                    sGstVal: item.sgst !== null ? parseFloat(parseFloat(item.total_amount) * parseFloat(item.sgst) / 100).toFixed(3) : "",
                    IGSTper: item.igst,
                    IGSTVal: item.igst !== null ? parseFloat(parseFloat(item.total_amount) * parseFloat(item.igst) / 100).toFixed(3) : "",
                    total: item.total,
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
                    })
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

                function netWeight(item) {
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
                // setTotalGST(parseFloat(tempIgstVal).toFixed(3));


                let tempTotal = tempArray
                  .filter((item) => item.total !== "")
                  .map(Total)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setTotal(parseFloat(tempTotal).toFixed(3));
                // console.log(tempTotal);

                let tempGrossWtTot = parseFloat(tempArray
                  .filter((data) => data.grossWeight !== "")
                  .map(grossWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3)

                setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

                let tempNetWtTot = parseFloat(tempArray
                  .filter((data) => data.netWeight !== "")
                  .map(netWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)).toFixed(3);

                setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3))


                // setTotalGrossWeight(
                //   parseFloat(tempArray
                //     .filter((data) => data.grossWeight !== "")
                //     .map(grossWeight)
                //     .reduce(function (a, b) {
                //       // sum all resulting numbers
                //       return parseFloat(a) + parseFloat(b);
                //     }, 0)).toFixed(3)
                // );
                console.log(finalData, "finalData")
                //  console.log(mainObj,"mainObj")
                setPrintObj({
                  ...printObj,
                  is_tds_tcs: mainObj.is_tds_tcs,
                  stateId: mainObj.state,
                  supplierName: mainObj.firm_name,
                  supAddress: mainObj.address,
                  supplierGstUinNum: mainObj.gst_number === null ? "" : mainObj.gst_number,
                  supPanNum: mainObj.pan_number,
                  supState: mainObj.StateName ? mainObj.StateName.name : mainObj.state_name.name,
                  supCountry: mainObj.country_name ? mainObj.country_name.name : mainObj.CountryName.name,
                  supStateCode: mainObj.gst_number === null ? "" : mainObj.gst_number.substring(0, 2),
                  purcVoucherNum: finalData.voucher_no,
                  partyInvNum: finalData.party_voucher_no,
                  voucherDate: moment(finalData.purchase_voucher_create_date).format("DD-MM-YYYY"),
                  placeOfSupply: mainObj.StateName ? mainObj.StateName.name : mainObj.state_name.name,
                  sGstTot: tempSgstVal ? parseFloat(tempSgstVal).toFixed(3) : "",
                  cGstTot: tempCgstVal ? parseFloat(tempCgstVal).toFixed(3) : "",
                  iGstTot: tempIgstVal ? parseFloat(tempIgstVal).toFixed(3) : "",
                  grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
                  netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                  fineWtTot: parseFloat(tempFineGold).toFixed(3),
                  orderDetails: tempArray,
                  taxableAmount: parseFloat(tempAmount).toFixed(3),
                  roundOff: finalData.round_off === null ? "0" : finalData.round_off,
                  totalInvoiceAmt: parseFloat(finalData.total_invoice_amount).toFixed(3),
                  jewelNarration: finalData.jewellery_narration !== null ? finalData.jewellery_narration : "",
                  accNarration: finalData.account_narration !== null ? finalData.account_narration : "",
                  balancePayable: parseFloat(finalData.total_invoice_amount).toFixed(3),
                  signature: finalData.admin_signature,
                })

                setAdjustedRate(true)
              } else if (otherDetail.loadType === 1) {

                let tempPackingSlipData = response.data.data.packingSlipData;
                // console.log(tempPackingSlipData)
                let data = HelperFunc.packingSlipViewDataJewelPurcReturn(tempPackingSlipData, finalData.JewelleryPurchaseReturnOrders[0].fine_rate, mainObj.state, finalData.JewelleryPurchaseReturnOrders[0].igst,
                  finalData.JewelleryPurchaseReturnOrders[0].cgst, finalData.JewelleryPurchaseReturnOrders[0].sgst)
                console.log(">>>>>>>>>>>>>>>>>", data)

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
                function CGSTval(item) {
                  return item.cgstVal;
                }
                function SGSTval(item) {
                  return item.sGstVal;
                }
                function grossWeight(item) {
                  // console.log(parseFloat(item.grossWeight));
                  return parseFloat(item.gross_wgt);
                }
                function netWeight(item) {
                  return parseFloat(item.net_wgt);
                }

                let tempCgstVal = data.ProductDataArr
                  .filter((item) => item.cgstVal !== "")
                  .map(CGSTval)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
                setCgstVal(parseFloat(tempCgstVal).toFixed(3));

                let tempSgstVal = data.ProductDataArr
                  .filter((item) => item.sGstVal !== "")
                  .map(SGSTval)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setSgstVal(parseFloat(tempSgstVal).toFixed(3));

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

                let total = 0;
                if (mainObj.state === 12) {
                  total = tempAmount + tempCgstVal + tempSgstVal
                  setTotalInvoiceAmount(total)
                } else {
                  total = tempAmount + tempIgstVal
                  setTotalInvoiceAmount(total)
                }


                setPrintObj({
                  ...printObj,
                  is_tds_tcs: mainObj.is_tds_tcs,
                  stateId: mainObj.state,
                  supplierName: mainObj.firm_name,
                  supAddress: mainObj.address,
                  supplierGstUinNum: mainObj.gst_number === null ? "" : mainObj.gst_number,
                  supPanNum: mainObj.pan_number,
                  supState: mainObj.StateName ? mainObj.StateName.name : mainObj.state_name.name,
                  supCountry: mainObj.country_name ? mainObj.country_name.name : mainObj.CountryName.name,
                  supStateCode: mainObj.gst_number === null ? "" : mainObj.gst_number.substring(0, 2),
                  purcVoucherNum: finalData.voucher_no,
                  partyInvNum: finalData.party_voucher_no,
                  voucherDate: finalData.purchase_voucher_create_date,
                  placeOfSupply: mainObj.StateName ? mainObj.StateName.name : mainObj.state_name.name,
                  grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
                  netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                  sGstTot: tempSgstVal ? parseFloat(tempSgstVal).toFixed(3) : "",
                  cGstTot: tempCgstVal ? parseFloat(tempCgstVal).toFixed(3) : "",
                  iGstTot: tempIgstVal ? parseFloat(tempIgstVal).toFixed(3) : "",
                  orderDetails: data.ProductDataArr,
                  taxableAmount: parseFloat(tempAmount).toFixed(3),
                  roundOff: finalData.round_off === null ? "0" : finalData.round_off,
                  totalInvoiceAmt: parseFloat(total).toFixed(3),
                  balancePayable: parseFloat(total).toFixed(3)
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
      .get(Config.getCommonUrl() + "api/jewellerypurchasereturn/get/voucher")
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
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
        handleError(error, dispatch, { api: "api/jewellerypurchasereturn/get/voucher" })
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
        handleError(error, dispatch, { api: "api/client/listing/listing" })
      });
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

      // let FinalWeight = 0;//user input total weight
      let FinalWeight = parseFloat(fileWeight).toFixed(3);

      // if (FinalWeight === 0) {
      setNewRate("")
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

      setShortageRfix(fileWeight);
      // setCanEnterVal(true);
    }
  }

  // function setForm(data) {
  //   console.log(data);
  //   if (selectedLoad == 0) {
  //     console.log("if");
  //   } else if (selectedLoad == 1) {
  //     console.log("wif");
  //   }
  //   // if (data.length > 1) {
  //   //   let values = data.slice(1).map((element, i) => {
  //   //     return {
  //   //       category: element[2],
  //   //       billing_category: element[3],
  //   //       hsn: "",
  //   //       lotno: element[4],
  //   //       pcs: element[7],
  //   //       grosswt: element[9],
  //   //       netwt: element[10],
  //   //       purity: element[6],
  //   //       wastage: element[11],
  //   //       othertagamount: element[17],
  //   //       hallmarkcharge: element[16],
  //   //     };
  //   //   });
  //   //   console.log(values);
  //   //   setFormValues(values);
  //   // }
  // }
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
    }
    //  else if (name === "uploadRateValue") {
    //   setUploadRateValue(value);
    //   setUploadRateErr("");
    // }
    else if (name === "accNarration") {
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
        totalInvoiceAmt: isNaN(tempTotalInvoiceAmt) ? 0 : parseFloat(tempTotalInvoiceAmt).toFixed(3),
      })
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

  function loadValidation() {
    if (selectedLoad === "") {
      setSelectedLoadErr("Please Select Load Type");
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

  //disabled={!isEnabled}
  // const isEnabled =
  //   selectedDepartment !== "" &&
  //   selectedLoad !== "" &&
  //   firmName !== "" &&
  //   selectedVendor !== "" &&
  //   voucherNumber !== "" &&
  //   partyVoucherNum !== "" &&
  //   shipping !== "";

  // const shippingValid = shipping === "1" ? shippingVendor !== "" && selectedCompany!=="" : shipping === "0" ? false : true;

  // function validateShipping() {
  //   if (
  //     loadValidation() &&
  //     voucherNumValidation() &&
  //     oppositeAcValidation() &&
  //     partyNameValidation() &&
  //     partyVoucherNumValidation() &&
  //     shippingValidation()
  //   ) {
  //     if (selectedLoad === "1") {
  //       // if (uploadTypeValidation()) {
  //       if (shipping === "1") {
  //         if (shippingVendValidation() && shippingCompValidation()) {
  //           return true;
  //         } else {
  //           return false;
  //         }

  //         // return shippingVendor !== "" && selectedCompany!=="";
  //       } else if (shipping === "0") {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //       // } else {
  //       // return false;
  //       // }
  //     } else {
  //       if (shipping === "1") {
  //         if (shippingVendValidation() && shippingCompValidation()) {
  //           return true;
  //         } else {
  //           return false;
  //         }

  //         // return shippingVendor !== "" && selectedCompany!=="";
  //       } else if (shipping === "0") {
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     }
  //   } else {
  //     return false;
  //   }
  // }

  function handleFormSubmit(ev) {
    ev.preventDefault();
    // resetForm();
    console.log("handleFormSubmit", userFormValues);
    if (
      handleDateBlur()&&
      voucherNumValidation() &&
      partyNameValidation() &&
      oppositeAcValidation() &&
      partyVoucherNumValidation() &&
      partyVoucherDateValidation() &&
      shippingValidation()
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (selectedLoad === "1") {
        // if (uploadTypeValidation()) {
        if (shipping === "1") {
          if (shippingVendValidation() && shippingCompValidation()) {
            createFromPackingSlip(true, false);
          }
        } else {
          createFromPackingSlip(true, false);
        }
        // }
      } else {
        if (shipping === "1") {
          if (shippingVendValidation() && shippingCompValidation()) {
            // if (selectedLoad === "0") {
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
            stock_name_code_id: x.Category.value,
            gross_weight: x.grossWeight,
            net_weight: x.netWeight,
            ...(x.Pieces !== "" && {
              pcs: x.Pieces, //user input
            }),
            hallmark_charges: x.hallmarkCharges,
            other_tag_amount: x.otherTagAmt,
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
            stock_name_code_id: x.Category.value,
            gross_weight: x.grossWeight,
            net_weight: x.netWeight,
            Wastage_percentage: x.wastagePer,
            hallmark_charges: x.hallmarkCharges,
            other_tag_amount: x.otherTagAmt,
            ...(x.Pieces !== "" && {
              pcs: x.Pieces, //user input
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
      voucher_no: voucherNumber,
      party_voucher_no: partyVoucherNum,
      opposite_account_id: oppositeAccSelected.value,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      vendor_id: selectedVendorClient.value === 1 ? selectedVendor.value : selectedClientFirm.value,
      is_vendor_client: selectedVendorClient.value === 1 ? 1 : 2,
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
      is_shipped: parseInt(shipping),
      ...(shipping === "1" && {
        shipping_client_id: shippingVendor.value,
        shipping_client_company_id: selectedCompany.value,
      }),
      uploadDocIds: docIds,
      party_voucher_date:partyVoucherDate,
    }
    console.log(body);
    axios
      .post(Config.getCommonUrl() + "api/jewellerypurchasereturn", body)
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
          // resetEveryThing();
          // getVoucherNumber();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: "api/jewellerypurchasereturn", body: body })
      });
  }

  // function resetEveryThing() {
  //   setShipping("");
  //   setShippingVendor("");

  //   setClientCompanies([]);
  //   setSelectedCompany("");

  //   setSelectedLoad("");
  //   // setUploadType("");
  //   reset();
  // }

  function reset() {
    setOppositeAccSelected("");
    setSelectedVendor("");
    setFirmName("");
    setPackingSlipNo("");
    setPackingSlipErr("");
    setPackingSearch("")
    // setCsvData([]);
    // setIsCsvErr(false);
    setSelectedRateFixErr("");
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
    setAdjustedRate(false);
    setVendorStateId("");
    setBalanceRfixData("");
    setBalRfixViewData([]);
    // setCanEnterVal(false);
    setShortageRfix("");
    setTempRate("");
    setAvgeRate("");
    setTempApiWeight("");
    setFineGoldTotal("");
    setTotalGrossWeight("");
    setOtherTagAmount("");
    setAmount("");
    setHallmarkCharges("");
    setTotalAmount("");
    setIgstVal("");
    setTotal("");
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
      purity: "",
      Pieces: "",
      fine: "",
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
    // setFileSelected("");
    // setIsuploaded(false);

  }

  function handleLoadChange(event) {
    setSelectedLoad(event.target.value);
    setSelectedLoadErr("");
    //reset every thing here
    // setUploadType("");
    setShipping("");
    setShippingVendor("");
    setPackingSlipData([]); //packing slip wise
    setPacketData([]); //packet wise Data
    setProductData([]); //category wise Data
    setBillmaterialData([]); //bill of material Data
    setTagWiseData([]);
    reset();
  }

  function resetFormOnly() {
    setTotalInvoiceAmount(0);
    // setTdsTcsVou("");
    // setTdsTcsVouErr("");
    // setLedgerName("");
    // setRateValue("");
    // setLegderAmount("");
    // setFinalAmount("");
    setTempApiWeight("");
    setTotalGrossWeight("");
    setOtherTagAmount("");
    setAmount("");
    setHallmarkCharges("");
    setTotalAmount("");
    setCgstVal("");
    setSgstVal("");
    setIgstVal("");
    setTotal("");
    setRoundOff("");
    SetRoundOffErr("");

    setUserFormValues([
      {
        loadType: "",
        Category: "",
        billingCategory: "",
        HSNNum: "",
        LotNumber: "",
        Pieces: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        fine: "",
        wastagePer: "",
        wastageFine: "",
        otherTagAmt: "",
        totalFine: "",
        fineRate: "",
        categoryRate: "",
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
        errors: {
          Category: null,
          billingCategory: null,
          HSNNum: null,
          LotNumber: null,
          Pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          fine: null,
          wastagePer: null,
          wastageFine: null,
          otherTagAmt: null,
          totalFine: null,
          fineRate: null,
          categoryRate: null,
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
        loadType: "",
        Category: "",
        billingCategory: "",
        HSNNum: "",
        LotNumber: "",
        Pieces: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        fine: "",
        wastagePer: "",
        wastageFine: "",
        otherTagAmt: "",
        totalFine: "",
        fineRate: "",
        categoryRate: "",
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
        errors: {
          Category: null,
          billingCategory: null,
          HSNNum: null,
          LotNumber: null,
          Pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          fine: null,
          wastagePer: null,
          wastageFine: null,
          otherTagAmt: null,
          totalFine: null,
          fineRate: null,
          categoryRate: null,
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
        loadType: "",
        Category: "",
        billingCategory: "",
        HSNNum: "",
        LotNumber: "",
        Pieces: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        fine: "",
        wastagePer: "",
        wastageFine: "",
        otherTagAmt: "",
        totalFine: "",
        fineRate: "",
        categoryRate: "",
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
        errors: {
          Category: null,
          billingCategory: null,
          HSNNum: null,
          LotNumber: null,
          Pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          fine: null,
          wastagePer: null,
          wastageFine: null,
          otherTagAmt: null,
          totalFine: null,
          fineRate: null,
          categoryRate: null,
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
        loadType: "",
        Category: "",
        billingCategory: "",
        HSNNum: "",
        LotNumber: "",
        Pieces: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        fine: "",
        wastagePer: "",
        wastageFine: "",
        otherTagAmt: "",
        totalFine: "",
        fineRate: "",
        categoryRate: "",
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
        errors: {
          Category: null,
          billingCategory: null,
          HSNNum: null,
          LotNumber: null,
          Pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          fine: null,
          wastagePer: null,
          wastageFine: null,
          otherTagAmt: null,
          totalFine: null,
          fineRate: null,
          categoryRate: null,
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

  const handleVendorClientChange = (value) => {
    if (loadTypeValidation()) {
      resetFormOnly()
      reset()
      setVendorClient(value)
      setSelectedVendor("");
      setSelectedVendorErr("");
      setSelectedClient("");
      setSelectedClientErr("");
      setSelectedClientFirm("");
      setSelectedClientFirmErr("");
      setFineGoldTotal("");
      setAdjustedRate(false);
      setPackingSlipData([]); //packing slip wise
      setPacketData([]); //packet wise Data
      setProductData([]); //category wise Data
      setBillmaterialData([]); //bill of material Data
      setTagWiseData([]);
      setShipping("");
      setRateProfiles([])
      setShippingVendor("");
    }
  }

  function handlePartyChange(value) {
    if (loadTypeValidation()) {
      setTotalInvoiceAmount(0);
      setSelectedVendor(value);
      setSelectedVendorErr("");
      setFineGoldTotal("");
      setAdjustedRate(false);
      setPackingSlipData([]); //packing slip wise
      setPacketData([]); //packet wise Data
      setProductData([]); //category wise Data
      setBillmaterialData([]); //bill of material Data
      setTagWiseData([]);
      resetFormOnly();

      const index = vendorData.findIndex((element) => element.id === value.value);
      console.log(index);

      if (index > -1) {
        setFirmName(vendorData[index].firm_name);
        setVendorStateId(vendorData[index].state_name.id);
        setAddress(vendorData[index].address);
        setSupplierGstUinNum(vendorData[index].gst_number);
        setSupPanNum(vendorData[index].pan_number);
        setSupState(vendorData[index].state_name.name);
        setSupCountry(vendorData[index].country_name.name);
        setSupStateCode(vendorData[index].gst_number);

        setPrintObj({
          ...printObj,
          supplierName: vendorData[index].firm_name,
          supAddress: vendorData[index].address,
          supplierGstUinNum: vendorData[index].gst_number,
          supPanNum: vendorData[index].pan_number,
          supState: vendorData[index].state_name.name,
          supCountry: vendorData[index].country_name.name,
          // supStateCode: vendorData[index].gst_number.substring(0, 2),
          supStateCode: (vendorData[index].gst_number) ? vendorData[index].gst_number.substring(0, 2) : '',
          purcVoucherNum: voucherNumber,
          // partyInvNum: "",
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
          legderName: "",
          taxAmount: "",
          jewelNarration: "",
          accNarration: "",
          balancePayable: ""
        })
        if (selectedLoad === "0") {//if 1 then no need to call api, wastage % will come from api
          getVendorRateProfile(value.value);
        }
      }
      getFixedRateofWeight(value.value);
    }
  }

  function handleClientFirmChange(value) {
    setSelectedClientFirm(value);
    setSelectedClientFirmErr("");
    getFixedRateofWeightClient(value.value);

    const index = clientFirmData.findIndex((element) => element.id === value.value);
    console.log(index);

    if (index > -1) {
      setFirmName(clientFirmData[index].company_name);
      setFirmNameErr("")
      setAddress(clientFirmData[index].address);
      setSupplierGstUinNum(clientFirmData[index].gst_number);
      setSupPanNum(clientFirmData[index].pan_number);
      setSupState(clientFirmData[index].StateName.name);
      setSupCountry(clientFirmData[index].CountryName.name);
      setSupStateCode(clientFirmData[index].gst_number);
      setVendorStateId(clientFirmData[index].state);

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
        supStateCode: (clientFirmData[index].gst_number) ? clientFirmData[index].gst_number.substring(0, 2) : '',
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
        legderName: "",
        taxAmount: "",
        metNarration: "",
        accNarration: "",
        balancePayable: ""
      })

    }
  }

  function handleClientPartyChange(value) {
    if (loadTypeValidation()) {
      reset();
      setSelectedClient(value)
      setSelectedClientErr("")
      setSelectedClientFirm("")
      setSelectedClientFirmErr("");
      setFineGoldTotal("");
      setAdjustedRate(false);
      setPackingSlipData([]); //packing slip wise
      setPacketData([]); //packet wise Data
      setProductData([]); //category wise Data
      setBillmaterialData([]); //bill of material Data
      setTagWiseData([]);
      resetFormOnly();


      let findIndex = clientData.findIndex((item) => item.id === value.value);
      if (findIndex > -1) {
        getClientCompany(value.value);
      }
      if (selectedLoad === "0") {//if 1 then no need to call api, wastage % will come from api
        getClientRateProfile(value.value);
      }
    }
  }

  function getClientCompany(clientId) {
    axios
      .get(Config.getCommonUrl() + `api/client/company/listing/listing/${clientId}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setClientFirmData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/client/company/listing/listing/${clientId}` })
      });
  }

  // jobworker - 0
  // vendor - 1
  function getVendorRateProfile(vendorID) {
    axios
      .get(Config.getCommonUrl() + `api/jobWorkerRateProfile/readAllRate/1/${vendorID}`)
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
        handleError(error, dispatch, { api: `api/jobWorkerRateProfile/readAllRate/1/${vendorID}` })
      });
  }

  function getClientRateProfile(clientID) {
    axios
      .get(Config.getCommonUrl() + `api/salesRateProfile/client/rateprofile/${clientID}`)
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
        handleError(error, dispatch, { api: `api/salesRateProfile/client/rateprofile/${clientID}` })
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
        } else {
          setBalanceRfixData([]);
          setTempApiWeight("");
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: `api/ratefix/vendor/balance/2/${clientCompId}` })
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
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/ratefix/vendor/balance/1/" + vendorId })
      });
  }

  function handleShippingChange(event) {
    setShipping(event.target.value);
    setShippingErr("");
    setShippingVendor("");
    setShipVendErr("");
    //reset every thing here

    // reset();
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

  function handleShipCompanyChange(value) {
    // const [clientCompanies, setClientCompanies] = useState("")
    setSelectedCompany(value);
    setSelectedCompErr("");
  }

  function handleRateFixChange() {
    // setRateFixSelected(value);
    if (partyNameValidation()) {
      setSelectedRateFixErr("");

      setRfModalOpen(true);

      if (adjustedRate === false) {
        // handleRateValChange(false);
        // setFileRfixData(fineGoldTotal);
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

  // function shortageRfixValidation() {
  //   // const Regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/; // || Regex.test(shortageRfix) === false
  //   if (shortageRfix === "") {
  //     setShortageRfixErr("Enter Valid Rate Fix");
  //     return false;
  //   }
  //   return true;
  // }

  // function tempRateValidation() {
  //   const Regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
  //   if (!tempRate || Regex.test(tempRate) === false) {
  //     setTempRateErr("Enter Valid Rate");
  //     return false;
  //   }
  //   return true;
  // }

  // function avgRateValidation() {
  //   const Regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
  //   if (!avgRate || Regex.test(avgRate) === false) {
  //     setAvgeRateErr("Enter Valid Average Rate");
  //     return false;
  //   }
  //   return true;
  // }

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
    // if(parseFloat(tempApiWeight) + parseFloat(shortageRfix) !== parseFloat(fineGoldTotal)){
    //   setPopupErr("Please Enter Remaining rate");
    //   return;
    // }
    // if (canEnterVal === true) {
    // if (
    //   shortageRfixValidation() &&
    //   tempRateValidation() &&
    //   avgRateValidation()
    // ) {
    console.log("valid");
    // handleRateValChange(true);
    // calculateAfterRate();
    setRfModalOpen(false);
    setAdjustedRate(true);

    // if (isUploaded === true) {

    // } else {
    if (selectedLoad === "1") setFineRateForPackingSlip();

    if (selectedLoad === "0") calculateAfterRate();
    // }
    // } else {
    //   console.log("invalid");
    // }
    // } else {
    //   // handleRateValChange(true);
    //   calculateAfterRate();
    //   setRfModalOpen(false);
    //   setAdjustedRate(true);
    // }
  };

  function displayChangedRate() {
    if (balRfixViewData !== "") {
      console.log(balRfixViewData);
      function sum(prev, next) {
        return prev + next;
      }

      function usedTotWeight(item) {
        return parseFloat(item.usedWeight);
      }
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
          setShortageRfix(parseFloat(parseFloat(tempApiWeight) - parseFloat(totUtilise)).toFixed(3));
        } else {
          //utilize is less than rate fix total from api
          setShortageRfix(parseFloat(parseFloat(fineGoldTotal) - parseFloat(totUtilise)).toFixed(3));
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
      tempArray[index].balance =
        parseFloat(tempArray[index].weight).toFixed(3);
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
          parseFloat(parseFloat(tempApiWeight) - parseFloat(totUtilise)).toFixed(
            3
          )
        );
      } else {
        //utilize is less than rate fix total from api
        setShortageRfix(
          parseFloat(parseFloat(fineGoldTotal) - parseFloat(totUtilise)).toFixed(
            3
          )
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
    newFormValues[i].Category = {
      value: e.value,
      label: e.label,
      pcs_require: e.pcs_require
    };
    newFormValues[i].errors.Category = null;

    let findIndex = stockCodeData.findIndex(
      (item) => item.stock_name_code.id === e.value
    );
    console.log(stockCodeData[findIndex]);

    if (findIndex > -1) {
      newFormValues[i].grossWeight = "";
      newFormValues[i].netWeight = "";
      newFormValues[i].rate = "";
      newFormValues[i].Pieces = "";
      newFormValues[i].wastagePer = "";
      newFormValues[i].totalFine = "";

      newFormValues[i].purity = stockCodeData[findIndex].stock_name_code.purity;
      newFormValues[i].HSNNum = stockCodeData[findIndex].hsn_master.hsn_number;

      newFormValues[i].billingCategory = stockCodeData[findIndex].billing_name;
      newFormValues[i].errors.billingCategory = null;

      if (vendorStateId === 12) {
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

    let wastageIndex = rateProfiles.findIndex(
      (item) => item.stock_name_code_id === e.value
    );
    console.log("wastageIndex", wastageIndex)
    if (wastageIndex > -1) {
      newFormValues[i].wastagePer = parseFloat(rateProfiles[wastageIndex].wastage_per).toFixed(3)
      newFormValues[i].errors.wastagePer = ""
    } else {
      newFormValues[i].errors.wastagePer = "Wastage is not added in rate profile";
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
    console.log("changeTotal", newFormValues, addFlag);
    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.grossWeight);
    }

    setTotalGrossWeight(
      parseFloat(newFormValues
        .filter((data) => data.grossWeight !== "")
        .map(grossWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)).toFixed(3)
    );

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
    // setSubTotal(parseFloat(tempTotAmount).toFixed(3));

    if (vendorStateId === 12) {
      function CGSTVal(item) {
        return item.cgstVal;
      }

      let tempCGstVal = newFormValues
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

      let tempSgstVal = newFormValues
        .filter((item) => item.sGstVal !== "")
        .map(SGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);

      setSgstVal(parseFloat(tempSgstVal).toFixed(3));
    } else {
      function IGSTVal(item) {
        return item.IGSTVal;
      }

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

    let tempTotalInvoiceAmt = 0;

    tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);
    console.log('amount...', tempTotalInvoiceAmt)

    setTotalInvoiceAmount(tempTotalInvoiceAmt);

    if (addFlag === true) {
      console.log(111111111111111111111111)
      setUserFormValues([
        ...newFormValues,
        {
          loadType: "",
          Category: "",
          billingCategory: "",
          HSNNum: "",
          LotNumber: "",
          Pieces: "",
          grossWeight: "",
          netWeight: "",
          purity: "",
          fine: "",
          wastagePer: "",
          wastageFine: "",
          otherTagAmt: "",
          totalFine: "",
          fineRate: "",
          categoryRate: "",
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
          errors: {
            Category: null,
            billingCategory: null,
            HSNNum: null,
            LotNumber: null,
            Pieces: null,
            grossWeight: null,
            netWeight: null,
            purity: null,
            fine: null,
            wastagePer: null,
            wastageFine: null,
            otherTagAmt: null,
            totalFine: null,
            fineRate: null,
            categoryRate: null,
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
      console.log(newFormValues)
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
    if (nm === "otherTagAmt") {
      newFormValues[i].otherTagAmt = parseFloat(val).toFixed(3)
    }
    console.log(33333333333333333333333)
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
      setNewRate("")
      setAdjustedRate(false);
      newFormValues[i].errors.grossWeight = " ";
      if (val == 0){
        newFormValues[i].errors.grossWeight = "Enter valid gross Weight";
      }
      if (val === "" || val == 0) {
        newFormValues[i].fine = "";
        newFormValues[i].amount = "";
        setAmount("");
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

      newFormValues[i].fineRate = 0;
    }

    // console.log(nm,val)
    if (nm === "netWeight") {
      setNewRate("")
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
      newFormValues[i].fineRate = 0;
    }

    if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
      if (newFormValues[i].wastagePer !== "") {
        newFormValues[i].wastageFine = parseFloat(
          (parseFloat(newFormValues[i].netWeight) *
            parseFloat(newFormValues[i].wastagePer)) /
          100
        ).toFixed(3);

        newFormValues[i].totalFine = parseFloat(
          (parseFloat(newFormValues[i].netWeight) *
            parseFloat(newFormValues[i].purity)) /
          100 +
          parseFloat(newFormValues[i].wastageFine)
        ).toFixed(3);
      } else {
        newFormValues[i].totalFine = parseFloat(
          (parseFloat(newFormValues[i].netWeight) *
            parseFloat(newFormValues[i].purity)) /
          100
        ).toFixed(3);
      }
    }

    //from here
    if (newRate !== "") {
      newFormValues[i].fineRate = parseFloat(newRate).toFixed(3);
    }

    if (newFormValues[i].Pieces === "") {
      newFormValues[i].hallmarkCharges = ""
    }

    if (HMCharges !== "" && newFormValues[i].Pieces !== "") {
      newFormValues[i].hallmarkCharges = parseFloat(parseFloat(HMCharges) * parseFloat(newFormValues[i].Pieces)).toFixed(3);
    }

    if (newFormValues[i].totalFine !== "" && newFormValues[i].fineRate !== "") {
      if (newFormValues[i].otherTagAmt !== "") {
        newFormValues[i].amount = parseFloat(
          (parseFloat(newFormValues[i].totalFine) *
            parseFloat(newFormValues[i].fineRate)) /
          10 +
          parseFloat(newFormValues[i].otherTagAmt)
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

    if (newFormValues[i].amount !== ""&& newFormValues[i].amount != 0 && newFormValues[i].netWeight !== "" && newFormValues[i].netWeight !=0) {
      newFormValues[i].categoryRate = parseFloat(
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

    if (vendorStateId === 12) {
      console.log(newFormValues[i].cgstPer)
      console.log(newFormValues[i].totalAmount)
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
      console.log(newFormValues[i].IGSTper)
      console.log(newFormValues[i].totalAmount)
      if (
        newFormValues[i].totalAmount !== "" &&
        newFormValues[i].IGSTper !== ""
      ) {
        console.log(newFormValues)
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

    } else {

      let tempIgstVal = newFormValues
        .filter((item) => item.IGSTVal !== "")
        .map(IGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setIgstVal(parseFloat(tempIgstVal).toFixed(3));

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

    setShortageRfix(parseFloat(tempFineGold).toFixed(3));
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
    setUserFormValues(newFormValues);
  };

  function calculateAfterRate() {
    userFormValues
      .filter((element) => element.Category !== "")
      .map((item, i) => {
        let newFormValues = [...userFormValues];

        // let nm = e.target.name;
        // let val = e.target.value;

        if (newFormValues[i].Category !== "") {
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

              newFormValues[i].totalFine = parseFloat(
                (parseFloat(newFormValues[i].netWeight) *
                  parseFloat(newFormValues[i].purity)) /
                100 +
                parseFloat(newFormValues[i].wastageFine)
              ).toFixed(3);

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
            newFormValues[i].fineRate = parseFloat(newRate).toFixed(3);
          }

          if (HMCharges !== "" && newFormValues[i].Pieces !== "") {
            newFormValues[i].hallmarkCharges = parseFloat(parseFloat(HMCharges) * parseFloat(newFormValues[i].Pieces)).toFixed(3);
          }

          if (
            newFormValues[i].totalFine !== "" &&
            newFormValues[i].fineRate !== ""
          ) {
            if (newFormValues[i].otherTagAmt !== "") {
              newFormValues[i].amount = parseFloat(
                (parseFloat(newFormValues[i].totalFine) *
                  parseFloat(newFormValues[i].fineRate)) /
                10 +
                parseFloat(newFormValues[i].otherTagAmt)
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

          if (
            newFormValues[i].amount !== "" &&
            newFormValues[i].netWeight !== ""&&newFormValues[i].netWeight !=0
          ) {
            newFormValues[i].categoryRate = parseFloat(
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
              newFormValues[i].IGSTper = "";
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
            return parseFloat(item.netWeight);
          }

          function fineGold(item) {
            return parseFloat(item.totalFine);
          }
          let tempFineGold = userFormValues
            .filter((item) => item.totalFine !== "")
            .map(fineGold)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);
          setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

          let tempGrossWtTot = userFormValues
            .filter((item) => item.grossWeight !== "")
            .map(grossWeight)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          let tempNetWtTot = parseFloat(
            userFormValues
              .filter((item) => item.netWeight !== "")
              .map(netWeight)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0)
          ).toFixed(3)
          setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

          // function fine(item) {
          //   return parseFloat(item.fine);
          // }

          // let tempFineTot = userFormValues
          //   .filter((item) => item.fine !== "")
          //   .map(fine)
          //   .reduce(function (a, b) {
          //     // sum all resulting numbers
          //     return parseFloat(a) + parseFloat(b);
          //   }, 0);

          // setFineTotal(parseFloat(tempFineTot).toFixed(3));
          // console.log(formValues.map(amount).reduce(sum))
          // setAmount("");
          let tempAmount = userFormValues
            .filter((item) => item.totalAmount !== "")
            .map(amount)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);
          //.reduce(sum);
          console.log("tempAmount>>>", tempAmount.toFixed(3));
          setTotalAmount(parseFloat(tempAmount).toFixed(3));
          // setSubTotal(parseFloat(tempAmount).toFixed(3));
          let tempCgstVal = 0;
          let tempSgstVal = 0;
          let tempIgstVal = 0;
          if (vendorStateId === 12) {

            tempCgstVal = userFormValues
              .filter((item) => item.cgstVal !== "")
              .map(CGSTval)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);
            // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
            setCgstVal(parseFloat(tempCgstVal).toFixed(3));

            tempSgstVal = userFormValues
              .filter((item) => item.sGstVal !== "")
              .map(SGSTval)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);
            setSgstVal(parseFloat(tempSgstVal).toFixed(3));

          } else {

            tempIgstVal = userFormValues
              .filter((item) => item.IGSTVal !== "")
              .map(IGSTVal)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0);
            setIgstVal(parseFloat(tempIgstVal).toFixed(3));

          }

          let tempTotal = userFormValues
            .filter((item) => item.total !== "")
            .map(Total)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);
          setTotal(parseFloat(tempTotal).toFixed(3));
          // console.log(tempTotal);

          setTotalGrossWeight(
            parseFloat(userFormValues
              .filter((data) => data.grossWeight !== "")
              .map(grossWeight)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0)).toFixed(3)
          );
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
          }
          setPrintObj({
            ...printObj,
            stateId: vendorStateId,
            orderDetails: newFormValues,
            sGstTot: vendorStateId === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
            cGstTot: vendorStateId === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
            iGstTot: vendorStateId !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
            taxableAmount: parseFloat(tempAmount).toFixed(3),
            roundOff: roundOff,
            grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
            netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
            fineWtTot: parseFloat(tempFineGold).toFixed(3),
            totalInvoiceAmt: isNaN(tempTotalInvoiceAmt) ? 0 : parseFloat(tempTotalInvoiceAmt).toFixed(3),
          })
          setUserFormValues(newFormValues);
        }
        return true;
      });
  }

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
    setDiffrentStock(newDiffrentStock);

    let newFormValues = [...userFormValues];
    newFormValues[selectedIndex].DiffrentStock = newDiffrentStock;
    setUserFormValues(newFormValues);
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

  const prevIsValid = () => {
    if (userFormValues.length === 0) {
      return true;
    }

    let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

    function setWeight(row) {
      return parseFloat(row.setWeight);
    }

    const someEmpty = userFormValues
      .filter((element) => element.Category !== "")
      .some((item) => {
        if (
          parseFloat(item.grossWeight) !== parseFloat(item.netWeight) &&
          item.isWeightDiff === 0
        ) {
          //not same
          return (
            item.Category === "" ||
            item.grossWeight === "" ||
            item.grossWeight == 0 ||
            item.netWeight === "" ||
            item.wastagePer === "" ||
            item.otherTagAmt === "" ||
            item.hallmarkCharges === "" ||
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
            item.Category === "" ||
            item.grossWeight === "" ||
            item.grossWeight == 0 ||
            item.netWeight === "" ||
            item.wastagePer === "" ||
            item.otherTagAmt === "" ||
            item.hallmarkCharges === "" ||
            percentRegex.test(item.wastagePer) === false
          );
        }
      });

    console.log(someEmpty);

    if (someEmpty) {
      userFormValues
        .filter((element) => element.Category !== "")
        .map((item, index) => {
          const allPrev = [...userFormValues];
          // console.log(item);

          let Category = userFormValues[index].Category;
          if (Category === "") {
            allPrev[index].errors.Category = "Please Select Stock Code";
          } else {
            allPrev[index].errors.Category = null;
          }

          let pcsTotal = userFormValues[index].Pieces;
          // if(Category.pcs_require === 1){
          if (pcsTotal === "" || pcsTotal === null || pcsTotal === undefined || isNaN(pcsTotal) || pcsTotal == 0) {
            allPrev[index].errors.Pieces = "Enter Pieces";
          } else {
            allPrev[index].errors.Pieces = null;
          }
          // }

          let weightRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
          let gWeight = userFormValues[index].grossWeight;
          if (!gWeight || weightRegex.test(gWeight) === false || gWeight == 0) {
            allPrev[index].errors.grossWeight = "Enter Gross Weight!";
          } else {
            allPrev[index].errors.grossWeight = null;
          }

          let netWeight = userFormValues[index].netWeight;
          if (!netWeight || weightRegex.test(netWeight) === false) {
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

          let otherTagAmt = userFormValues[index].otherTagAmt;
          if (!otherTagAmt || weightRegex.test(otherTagAmt) === false) {
            allPrev[index].errors.otherTagAmt = "Please Enter Other Tag Amount";
          } else {
            allPrev[index].errors.otherTagAmt = null;
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
          if (!wastagePer || percentRegex.test(wastagePer) === false) {
            allPrev[index].errors.wastagePer = "Enter Wastage!";
          } else {
            allPrev[index].errors.wastagePer = null;
          }
          setUserFormValues(allPrev);
          return null;
        });
    }

    return !someEmpty;
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

    console.log(packingSlipApiData)

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
        console.log(response.data.data);

        if (response.data.success === true) {
          let tempPackingSlip = response.data.data.PackingSlip;
          let tempPacketData = response.data.data.packetData;
          let tempProductData = response.data.data.productData;
          let temCategoryData = response.data.data.categoryData;

          setPackingSlipIdArr((packingSlipIdArr) => [
            ...packingSlipIdArr,
            ...[
              {
                packing_slip_id: tempPackingSlip.packing_slip_id,
                packing_slip_no: tempPackingSlip.packing_slip_no,
              },
            ],
          ]);

          let wastFine = parseFloat(
            (parseFloat(tempPackingSlip.net_wgt) *
              parseFloat(tempPackingSlip.wastage)) /
            100
          ).toFixed(3);

          let totFine = parseFloat(
            ((parseFloat(tempPackingSlip.net_wgt) *
              parseFloat(tempPackingSlip.purity)) /
              100) + parseFloat(wastFine)
          ).toFixed(3);

          let newTemp = {
            ...tempPackingSlip,
            hallmark_charges_pcs: parseFloat(tempPackingSlip.hallmarkChargesFrontEnd).toFixed(3),
            NoOfPacket: tempPacketData.length,
            billingCategory: tempProductData[0].billing_category_name,
            wastageFine: wastFine,
            totalFine: totFine,
            fineRate: "",
            amount: "",
            totalAmount: "",
            cgstPer:
              vendorStateId === 12
                ? parseFloat(parseFloat(tempPacketData[0].gst) / 2).toFixed(3)//getting gst from packet data for packing slip
                : "",
            cgstVal: "",
            sGstPer:
              vendorStateId === 12
                ? parseFloat(parseFloat(tempPacketData[0].gst) / 2).toFixed(3)
                : "",
            sGstVal: "",
            IGSTper:
              vendorStateId !== 12
                ? parseFloat(tempPacketData[0].gst).toFixed(3)
                : "",
            IGSTVal: "",
            total: "",
          };

          setPackingSlipData([
            ...packingSlipData.map((item) => {
              return {
                ...item,
                fineRate: "",
                amount: "",
                totalAmount: "",
                cgstVal: "",
                sGstVal: "",
                IGSTVal: "",
                total: "",
              };
            }),
            newTemp,
          ]); //packing slip wise
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
              hallmark_charges: parseFloat(item.hallmarkChargesFrontEnd).toFixed(3),
              totalAmount: "",
              cgstPer:
                vendorStateId === 12
                  ? parseFloat(parseFloat(item.gst) / 2).toFixed(3)
                  : "",
              cgstVal: "",
              sGstPer:
                vendorStateId === 12
                  ? parseFloat(parseFloat(item.gst) / 2).toFixed(3)
                  : "",
              sGstVal: "",
              IGSTper:
                vendorStateId !== 12
                  ? parseFloat(item.gst).toFixed(3)
                  : "",
              IGSTVal: "",
              total: "",
            };
          });

          setPacketData((packetData) => [
            ...packetData.map((item) => {
              return {
                ...item,
                fineRate: "",
                amount: "",
                totalAmount: "",
                cgstVal: "",
                sGstVal: "",
                IGSTVal: "",
                total: "",
              };
            }),
            ...newTempPacketData,
          ]);
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
              hallmark_charges: parseFloat(item.hallmarkChargesFrontEnd).toFixed(3),
              totalAmount: "",
              cgstPer:
                vendorStateId === 12
                  ? parseFloat(parseFloat(item.gst) / 2).toFixed(3)
                  : "",
              cgstVal: "",
              sGstPer:
                vendorStateId === 12
                  ? parseFloat(parseFloat(item.gst) / 2).toFixed(3)
                  : "",
              sGstVal: "",
              IGSTper:
                vendorStateId !== 12
                  ? parseFloat(item.gst).toFixed(3)
                  : "",
              IGSTVal: "",
              total: "",
            };
          });

          function fineGold(item) {
            return parseFloat(item.totalFine);
          }

          let temp = [...productData, ...newTempProductData];
          console.log(temp, "temp")

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
                total: "",
              };
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
              catRate: "",
              amount: "",
              hallmark_charges: parseFloat(item.hallmarkChargesFrontEnd).toFixed(3),
              totalAmount: "",
              cgstPer:
                vendorStateId === 12
                  ? parseFloat(parseFloat(item.gst) / 2).toFixed(3)
                  : "",
              cgstVal: "",
              sGstPer:
                vendorStateId === 12
                  ? parseFloat(parseFloat(item.gst) / 2).toFixed(3)
                  : "",
              sGstVal: "",
              IGSTper:
                vendorStateId !== 12
                  ? parseFloat(item.gst).toFixed(3)
                  : "",
              IGSTVal: "",
              total: "",
            };
          });

          setTagWiseData((tagWiseData) => [
            ...tagWiseData.map((item) => {
              return {
                ...item,
                fineRate: "",
                amount: "",
                totalAmount: "",
                cgstVal: "",
                sGstVal: "",
                IGSTVal: "",
                total: "",
              };
            }),
            ...tempTagWise,
          ]);
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
              cgstPer:
                vendorStateId === 12
                  ? parseFloat(parseFloat(item.gst) / 2).toFixed(3)
                  : "",
              cgstVal: "",
              sGstPer:
                vendorStateId === 12
                  ? parseFloat(parseFloat(item.gst) / 2).toFixed(3)
                  : "",
              sGstVal: "",
              IGSTper:
                vendorStateId !== 12
                  ? parseFloat(item.gst).toFixed(3)
                  : "",
              IGSTVal: "",
              total: "",
            };
          });

          setBillmaterialData((billMaterialData) => [
            ...billMaterialData.map((item) => {
              return {
                ...item,
                totalAmount: "",
              };
            }),
            ...tempBillMaterial,
          ]);

          function amount(item) {
            // console.log(item.amount)
            return item.totalAmount;
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

          // let tempTotal = 0;
          // if (vendorStateId === 12) {
          //    tempCgstVal = temp
          //     .filter((item) => item.cgstVal !== "")
          //     .map(CGSTval)
          //     .reduce(function (a, b) {
          //       // sum all resulting numbers
          //       return parseFloat(a) + parseFloat(b);
          //     }, 0);

          //    tempSgstVal = temp
          //     .filter((item) => item.sGstVal !== "")
          //     .map(SGSTval)
          //     .reduce(function (a, b) {
          //       // sum all resulting numbers
          //       return parseFloat(a) + parseFloat(b);
          //     }, 0);

          //   // setTotalGST(
          //   //   (parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
          //   // );
          //   tempTotal = parseFloat(
          //     parseFloat(tempAmount) +
          //     parseFloat(tempCgstVal) +
          //     parseFloat(tempSgstVal)
          //   ).toFixed(3);
          // } else {
          //    tempIgstVal = temp
          //     .filter((item) => item.IGSTVal !== "")
          //     .map(IGSTVal)
          //     .reduce(function (a, b) {
          //       // sum all resulting numbers
          //       return parseFloat(a) + parseFloat(b);
          //     }, 0);
          //   // setIgstVal(parseFloat(tempIgstVal).toFixed(3));
          //   // setTotalGST(parseFloat(tempIgstVal).toFixed(3));
          // }

          setPrintObj({
            ...printObj,
            orderDetails: temp,
            roundOff: roundOff,
            grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
            netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
          })
          if (newRate !== "") {
            setAdjustedRate(false);
            // setSubTotal(0);
            // setTotalGST(0);
            setTotal(0);
            setTotalAmount(0);
            setTotalInvoiceAmount(0);
            // setLegderAmount(0);
            // setFinalAmount(0);
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/packingslip/packingSlip/${packingSlipNum}` })

      });
  }

  function setFineRateForPackingSlip() {
    let newTemp = packingSlipData.map((item) => {

      let totAmtps = parseFloat(
        (parseFloat(newRate) * parseFloat(item.totalFine)) / 10 +
        parseFloat(item.other_amt) +
        parseFloat(item.hallmark_charges_pcs)
      ).toFixed(3);

      let tempIgstVal =
        vendorStateId !== 12
          ? parseFloat((parseFloat(totAmtps) * parseFloat(item.IGSTper)) / 100).toFixed(3)
          : 0;

      let tempCgstVal =
        vendorStateId === 12
          ? parseFloat((parseFloat(totAmtps) * parseFloat(item.cgstPer)) / 100).toFixed(3)
          : 0;

      let tempSgstVal =
        vendorStateId === 12
          ? parseFloat((parseFloat(totAmtps) * parseFloat(item.sGstPer)) / 100).toFixed(3)
          : 0;

      let totAmt =
        vendorStateId === 12
          ? parseFloat(parseFloat(totAmtps) + parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
          : parseFloat(parseFloat(totAmtps) + parseFloat(tempIgstVal)).toFixed(3);


      return {
        ...item,
        fineRate: parseFloat(newRate).toFixed(3),
        amount: parseFloat(
          (parseFloat(newRate) * parseFloat(item.totalFine)) / 10 +
          parseFloat(item.other_amt)
        ).toFixed(3),
        totalAmount: totAmtps,
        cgstVal: tempCgstVal,
        sGstVal: tempSgstVal,
        IGSTVal: tempIgstVal,
        total: totAmt,
      };
    });

    setPackingSlipData(newTemp); //packing slip wise
    // console.log(newTemp);

    const newTempPacketData = packetData.map((item) => {
      let totAmtPack = parseFloat(
        (parseFloat(newRate) * parseFloat(item.totalFine)) / 10 +
        parseFloat(item.other_amt) +
        parseFloat(item.hallmark_charges)
      ).toFixed(3);

      let tempIgstVal =
        vendorStateId !== 12
          ? parseFloat((parseFloat(totAmtPack) * parseFloat(item.IGSTper)) / 100).toFixed(3)
          : 0;

      let tempCgstVal =
        vendorStateId === 12
          ? parseFloat((parseFloat(totAmtPack) * parseFloat(item.cgstPer)) / 100).toFixed(3)
          : 0;

      let tempSgstVal =
        vendorStateId === 12
          ? parseFloat((parseFloat(totAmtPack) * parseFloat(item.sGstPer)) / 100).toFixed(3)
          : 0;

      let totAmt =
        vendorStateId === 12
          ? parseFloat(parseFloat(totAmtPack) + parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
          : parseFloat(parseFloat(totAmtPack) + parseFloat(tempIgstVal)).toFixed(3);

      return {
        ...item,
        fineRate: parseFloat(newRate).toFixed(3),
        amount: parseFloat(
          (parseFloat(newRate) * parseFloat(item.totalFine)) / 10 +
          parseFloat(item.other_amt)
        ).toFixed(3),
        totalAmount: totAmtPack,
        cgstVal: tempCgstVal,
        sGstVal: tempSgstVal,
        IGSTVal: tempIgstVal,
        total: totAmt,
      };
    });

    setPacketData(newTempPacketData);

    const newTempProductData = productData.map((item) => {
      let amount = parseFloat(
        (parseFloat(newRate) * parseFloat(item.totalFine)) / 10 +
        parseFloat(item.other_amt)
      ).toFixed(3);

      let totalAmount = parseFloat(parseFloat(amount) + parseFloat(item.hallmark_charges)).toFixed(3);

      let tempIgstVal =
        vendorStateId !== 12
          ? parseFloat((parseFloat(totalAmount) * parseFloat(item.IGSTper)) / 100).toFixed(3)
          : 0;

      let tempCgstVal =
        vendorStateId === 12
          ? parseFloat((parseFloat(totalAmount) * parseFloat(item.cgstPer)) / 100).toFixed(3)
          : 0;

      let tempSgstVal =
        vendorStateId === 12
          ? parseFloat((parseFloat(totalAmount) * parseFloat(item.sGstPer)) / 100).toFixed(3)
          : 0;

      let totAmt =
        vendorStateId === 12
          ? parseFloat(parseFloat(totalAmount) + parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
          : parseFloat(parseFloat(totalAmount) + parseFloat(tempIgstVal)).toFixed(3);

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
        IGSTVal: tempIgstVal,
        cgstVal: tempCgstVal,
        sGstVal: tempSgstVal,
        total: totAmt,
      };
    });
    // catRate = amount / netWeight *10
    setProductData(newTempProductData);

    const tempTagWise = tagWiseData.map((item) => {

      let totalAmount = parseFloat(
        (parseFloat(newRate) * parseFloat(item.totalFine)) / 10 +
        parseFloat(item.other_amt) +
        parseFloat(item.hallmark_charges)
      ).toFixed(3)

      let tempIgstVal =
        vendorStateId !== 12
          ? parseFloat((parseFloat(totalAmount) * parseFloat(item.IGSTper)) / 100).toFixed(3)
          : 0;

      let tempCgstVal =
        vendorStateId === 12
          ? parseFloat((parseFloat(totalAmount) * parseFloat(item.cgstPer)) / 100).toFixed(3)
          : 0;

      let tempSgstVal =
        vendorStateId === 12
          ? parseFloat((parseFloat(totalAmount) * parseFloat(item.sGstPer)) / 100).toFixed(3)
          : 0;

      let totAmt =
        vendorStateId === 12
          ? parseFloat(parseFloat(totalAmount) + parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
          : parseFloat(parseFloat(totalAmount) + parseFloat(tempIgstVal)).toFixed(3);


      return {
        ...item,
        fineRate: parseFloat(newRate).toFixed(3),
        amount: parseFloat(
          (parseFloat(newRate) * parseFloat(item.totalFine)) / 10 +
          parseFloat(item.other_amt)
        ).toFixed(3),
        totalAmount: parseFloat(totalAmount).toFixed(3),
        catRate: parseFloat(
          (((parseFloat(newRate) * parseFloat(item.totalFine)) / 10 +
            parseFloat(item.other_amt)) /
            parseFloat(item.net_wgt)) *
          10
        ).toFixed(3),
        IGSTVal: tempIgstVal,
        cgstVal: tempCgstVal,
        sGstVal: tempSgstVal,
        total: totAmt,
      };
    });

    setTagWiseData(tempTagWise);
    // // console.log(tempTagWise)

    const tempBillMaterial = billMaterialData.map((item) => {

      let totAmtBillMat = parseFloat(
        ((parseFloat(item.metal_wgt) * parseFloat(item.purity)) / 100 +
          parseFloat(item.wastageFine)) *
        (parseFloat(newRate) / 10) +
        (parseFloat(item.stone_amt) +
          parseFloat(item.beads_amt) +
          parseFloat(item.silver_amt) +
          parseFloat(item.sol_amt) +
          parseFloat(item.other_amt) +
          parseFloat(item.hallmark_charges))
      ).toFixed(3);

      let tempIgstVal =
        vendorStateId !== 12
          ? parseFloat((parseFloat(totAmtBillMat) * parseFloat(item.IGSTper)) / 100).toFixed(3)
          : 0;

      let tempCgstVal =
        vendorStateId === 12
          ? parseFloat((parseFloat(totAmtBillMat) * parseFloat(item.cgstPer)) / 100).toFixed(3)
          : 0;

      let tempSgstVal =
        vendorStateId === 12
          ? parseFloat((parseFloat(totAmtBillMat) * parseFloat(item.sGstPer)) / 100).toFixed(3)
          : 0;

      let totAmt =
        vendorStateId === 12
          ? parseFloat(parseFloat(totAmtBillMat) + parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3)
          : parseFloat(parseFloat(totAmtBillMat) + parseFloat(tempIgstVal)).toFixed(3);

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
        totalAmount: totAmtBillMat,
        IGSTVal: tempIgstVal,
        cgstVal: tempCgstVal,
        sGstVal: tempSgstVal,
        total: totAmt,
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

    let tempAmount = newTempProductData
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
      // setSgstVal(parseFloat(tempSgstVal).toFixed(3));

      tempTotal = parseFloat(parseFloat(tempAmount) + parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3);
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
      tempTotal = parseFloat(parseFloat(tempAmount) + parseFloat(tempIgstVal)).toFixed(3);
    }

    setTotal(parseFloat(tempTotal).toFixed(3));
    setTotalAmount(parseFloat(tempAmount).toFixed(3));
    setTotalInvoiceAmount(parseFloat(tempTotal).toFixed(3));
    setPrintObj({
      ...printObj,
      orderDetails: newTempProductData,
      sGstTot: vendorStateId === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
      cGstTot: vendorStateId === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
      iGstTot: vendorStateId !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      totalInvoiceAmt: parseFloat(tempTotal).toFixed(3),
      balancePayable: parseFloat(tempTotal).toFixed(3)
    })
  }

  function createFromPackingSlip(resetFlag, toBePrint) {
    if (adjustedRate === false) {
      setSelectedRateFixErr("Please Add remaining rate");
      console.log("if");
      return;
    }

    let Orders = packingSlipIdArr.map((x) => {
      return {
        packing_slip_id: x.packing_slip_id,
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
      is_vendor_client: selectedVendorClient.value === 1 ? 1 : 2,
      vendor_id: selectedVendorClient.value === 1 ? selectedVendor.value : selectedClientFirm.value,
      ...(tempRate !== "" && {
        setRate: tempRate,
      }),
      round_off: roundOff === "" ? 0 : roundOff,
      jewellery_narration: jewelNarration,
      account_narration: accNarration,
      is_shipped: parseInt(shipping),
      ...(shipping === "1" && {
        shipping_client_id: shippingVendor.value,
        shipping_client_company_id: selectedCompany.value,
      }),
      ...(rates.length !== 0 && {
        rates: rates,
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
      .post(
        Config.getCommonUrl() +
        "api/jewellerypurchasereturn/createFromPackingSlip", body)
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
          // setSelectedVendor("");
          // setSelectedCompany("");
          // setShipping("");
          // setPackingSlipNo("");
          // setPackingSlipIdArr([]);
          // // setPackingSlipData([]); //packing slip wise
          // // setPacketData([]); //packet wise Data
          // // setProductData([]); //category wise Data
          // // setBillmaterialData([]); //bill of material Data
          // // setTagWiseData([]);
          // reset();
          // getVoucherNumber();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);

        handleError(error, dispatch, { api: "api/jewellerypurchasereturn/createFromPackingSlip", body: body })

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

    let tempAmount = tempProduct
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
      // setSgstVal(parseFloat(tempSgstVal).toFixed(3));

      tempTotal = parseFloat(parseFloat(tempAmount) + parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3);
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
      tempTotal = parseFloat(parseFloat(tempAmount) + parseFloat(tempIgstVal)).toFixed(3);
    }

    setTotal(parseFloat(tempTotal).toFixed(3));
    setTotalAmount(parseFloat(tempAmount).toFixed(3));
    setTotalInvoiceAmount(parseFloat(tempTotal).toFixed(3));
    setPrintObj({
      ...printObj,
      orderDetails: tempProduct,
      sGstTot: vendorStateId === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
      cGstTot: vendorStateId === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
      iGstTot: vendorStateId !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      totalInvoiceAmt: parseFloat(tempTotal).toFixed(3),
      balancePayable: parseFloat(tempTotal).toFixed(3)
    })
  }

  function deleteRow(index) {
    console.log(index)
    let newFormValues = [...userFormValues];
    setAdjustedRate(false);
    setShortageRfix("")
    newFormValues[index].loadType = ""
    newFormValues[index].Category = ""
    newFormValues[index].billingCategory = ""
    newFormValues[index].HSNNum = ""
    newFormValues[index].LotNumber = ""
    newFormValues[index].Pieces = ""
    newFormValues[index].grossWeight = ""
    newFormValues[index].netWeight = ""
    newFormValues[index].purity = ""
    newFormValues[index].fine = ""
    newFormValues[index].wastagePer = ""
    newFormValues[index].wastageFine = ""
    newFormValues[index].otherTagAmt = ""
    newFormValues[index].totalFine = ""
    newFormValues[index].fineRate = ""
    newFormValues[index].categoryRate = ""
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
    newFormValues[index].errors = {
      Category: null,
      billingCategory: null,
      HSNNum: null,
      LotNumber: null,
      Pieces: null,
      grossWeight: null,
      netWeight: null,
      purity: null,
      fine: null,
      wastagePer: null,
      wastageFine: null,
      otherTagAmt: null,
      totalFine: null,
      fineRate: null,
      categoryRate: null,
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
    console.log(11, 11, 11)
    setUserFormValues(newFormValues)

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

    let tempAmount = newFormValues
      .filter((item) => item.totalAmount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setTotalAmount(parseFloat(tempAmount).toFixed(3));

    if (vendorStateId === 12) {

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

    } else {

      let tempIgstVal = newFormValues
        .filter((item) => item.IGSTVal !== "")
        .map(IGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setIgstVal(parseFloat(tempIgstVal).toFixed(3));

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

    setShortageRfix(parseFloat(tempFineGold).toFixed(3));
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

  const handleNarrationClick = () => {
    console.log("handleNarr", narrationFlag)
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        "flag": 18,
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
    let tempDocList = [...documentList];
    const arr = tempDocList.filter((x) => x.id !== id);
    setDocumentList(arr);
  };

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
                        ? "View Jewellery Purchase Return"
                        : "Add Jewellery Purchase Return"}
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
                className="pt-16 jewellery-mt-dv"
                style={{ marginBottom: "10%", height: "90%" }}
              >
                {/* {JSON.stringify(contDetails)} */}
                <div>
                  <form
                    name="registerForm"
                    noValidate
                    className="flex flex-col justify-center w-full jewellerypreturn-main"
                    onSubmit={handleFormSubmit}
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
                        <p style={{ paddingBottom: "3px" }}>Select load type</p>
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
                          <option value="1">Load Packing Slip</option>
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
                            disabled={isView}
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
                        <p style={{ paddingBottom: "3px" }}>Opposite account</p>
                        <Select
                          className="addjewellary_selectreturn_secand"
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
                          placeholder="Party Voucher Number"
                          name="partyVoucherNum"
                          value={partyVoucherNum}
                          error={partyVoucherNumErr.length > 0 ? true : false}
                          helperText={partyVoucherNumErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          // onKeyDown={handleTabChange}
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
                        <p style={{ paddingBottom: "3px" }}>Shipping</p>
                        <select
                          className={clsx(classes.normalSelect, "focusClass")}
                          required
                          value={shipping}
                          onChange={(e) => handleShippingChange(e)}
                          disabled={isView}
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

                      {selectedLoad === "1" && (
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
                                  setPackingSearch(newInputValue);
                              } else {
                                setPackingSearch("");
                              }
                            }}
                            value={packingSlipNo}
                            options={packingSlipApiData.map(
                              (option) => option.barcode
                            )}
                            disabled={isView}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                style={{ padding: 0 }}
                                placeholder="Packing slip no"
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
                      <div className="jewellery-artician-main return_jewellry_tbl add-return_jewellry_tbl viewadd-return_jewellry_tbl mt-20">
                        <div className="inner-addsalestabel-blg ">
                          <div
                            className="jewellery-artician-tbl"
                            style={{
                              border: "1px solid #D1D8F5",
                              borderRadius: "7px",
                              paddingBottom: 5,
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
                                Category
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
                                Wastage
                              </div>
                              <div className={clsx(classes.tableheader, "")}>
                                Other tag Amount
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
                                className="all-purchase-tabs"
                                id="jewellery-artician-head"
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
                                <Select
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  // className={classes.selectBox}
                                  classes={classes}
                                  styles={selectStyles}
                                  options={stockCodeData
                                    .filter((array) =>
                                      userFormValues.every(
                                        (item) =>
                                          !(
                                            item.Category?.value ===
                                              array.stock_name_code.id &&
                                            item.Category.label ===
                                              array.stock_name_code.stock_code
                                          )
                                      )
                                    )
                                    .map((suggestion) => ({
                                      value: suggestion.stock_name_code.id,
                                      label:
                                        suggestion.stock_name_code.stock_code,
                                      pcs_require:
                                        suggestion.stock_name_code
                                          .stock_description.pcs_require,
                                    }))}
                                  // components={components}
                                  value={
                                    // element.Category
                                    element.Category !== ""
                                      ? element.Category.value === ""
                                        ? ""
                                        : element.Category
                                      : ""
                                  }
                                  onChange={(e) => {
                                    handleStockGroupChange(index, e);
                                  }}
                                  placeholder="Stock Code"
                                  isDisabled={isView}
                                />
                                {element.errors !== undefined &&
                                element.errors.Category !== null ? (
                                  <span style={{ color: "red" }}>
                                    {element.errors.Category}
                                  </span>
                                ) : (
                                  ""
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
                                  name="Pieces"
                                  value={element.Pieces || ""}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.Pieces
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.Pieces
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
                                  className="netweight_input_dv"
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

                                {/* {element.isWeightDiff === 0 && ( */}
                                {element.grossWeight !== "" &&
                                  element.netWeight !== "" &&
                                  parseFloat(element.grossWeight).toFixed(3) !==
                                    parseFloat(element.netWeight).toFixed(
                                      3
                                    ) && (
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
                                  name="otherTagAmt"
                                  value={
                                    isView
                                      ? Config.numWithComma(element.otherTagAmt)
                                      : element.otherTagAmt || ""
                                  }
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.otherTagAmt
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.otherTagAmt
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  onBlur={(e) => handlerBlur(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled={isView}
                                />

                                <TextField
                                  name="totalFine"
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
                                  name="fineRate"
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
                                  // label="categoryRate"
                                  name="categoryRate"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(
                                          element.categoryRate
                                        )
                                      : element.categoryRate || ""
                                  }
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.categoryRate
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.categoryRate
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
                                      ? Config.numWithComma(element.amount)
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

                                <TextField
                                  // label="hallmarkCharges"
                                  name="hallmarkCharges"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(
                                          element.hallmarkCharges
                                        )
                                      : element.hallmarkCharges || ""
                                  }
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
                              style={{
                                fontWeight: "700",
                                height: "30px",
                                // paddingTop: 5,
                                // borderTop: "1px solid lightgray",
                              }}
                              // id="jewellery-artician-head"
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
                                {totalGrossWeight}
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
                              ></div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {isView
                                  ? Config.numWithComma(OtherTagAmount)
                                  : OtherTagAmount}
                              </div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {fineGoldTotal}
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
                              >
                                {isView ? Config.numWithComma(amount) : amount}
                              </div>

                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {isView
                                  ? Config.numWithComma(hallmarkCharges)
                                  : hallmarkCharges}
                              </div>

                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table"
                                )}
                              >
                                {/* Total Amount */}
                                {isView
                                  ? Config.numWithComma(totalAmount)
                                  : totalAmount}
                              </div>
                              {igstVal != 0 &&
                              igstVal !== "" &&
                              !isNaN(igstVal) ? (
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
                      <Grid className="salesjobwork-table-main add-jewelpurchasereturn-dv addjewelpurchasereturn-blg addsales-jobreturn-domestic-dv">
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
                              stateId={vendorStateId}
                              isView={isView}
                            />
                          )}
                          {modalView === 1 && (
                            <TagWiseList
                              tagWiseData={tagWiseData}
                              stateId={vendorStateId}
                              isView={isView}
                            />
                          )}
                          {modalView === 2 && (
                            <PacketWiseList
                              packetData={packetData}
                              stateId={vendorStateId}
                              isView={isView}
                            />
                          )}
                          {modalView === 3 && (
                            <PackingSlipWiseList
                              packingSlipData={packingSlipData}
                              deleteHandler={deleteHandler}
                              stateId={vendorStateId}
                              isView={isView}
                            />
                          )}
                          {modalView === 4 && (
                            <BillOfMaterial
                              billMaterialData={billMaterialData}
                              stateId={vendorStateId}
                              isView={isView}
                            />
                          )}
                        </div>
                      </Grid>
                    )}
                  </form>

                  <Grid
                    className="export-metal-mt pt-export-metal-dv"
                    item
                    xs={2}
                  >
                    <Button
                      id="btn-save"
                      variant="contained"
                      color="primary"
                      // style={{ float: "right" }}
                      className="w-224 mx-auto  mb-16"
                      aria-label="Register"
                      // disabled={isView || userFormValues[0].fine==="" }
                      disabled={
                        isView ||
                        (selectedLoad === "0" &&
                          userFormValues[0].otherTagAmt === "") ||
                        (selectedLoad === "0" &&
                          userFormValues[0].otherTagAmt == 0) ||
                        (selectedLoad === "1" &&
                          packingSlipIdArr.length === 0) ||
                        selectedLoad === ""
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
                    className="mt-5 roundoff-input sub-total-dv"
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
                          className="ml-2 addconsumble-dv"
                          value={roundOff}
                          error={roundOffErr.length > 0 ? true : false}
                          helperText={roundOffErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          fullWidth
                          disabled={
                            isView ||
                            (selectedLoad === "0" &&
                              userFormValues[0].billingCategory === "") ||
                            (selectedLoad === "1" &&
                              packingSlipIdArr.length === 0) ||
                            selectedLoad === ""
                          }
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
                    className="mt-16 mr-2 textarea-inpt-dv"
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
                        {selectedLoad === "0" && (
                          <JewellaryPurReturnPrintComp
                            ref={componentRef}
                            printObj={printObj}
                            isView={isView} 
                            getDateAndTime={getDateAndTime()}
                          />
                        )}
                        {selectedLoad === "1" && (
                          <JewellaryPurcReturnHmPrintComp
                            ref={componentRef}
                            printObj={printObj}
                            isView={isView} 
                            getDateAndTime={getDateAndTime()}
                          />
                        )}
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
              purchase_flag="18"
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
                  Add Weight
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
                <h5 className="popup-head p-5">
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

export default AddJewellaryPurchaseReturn;

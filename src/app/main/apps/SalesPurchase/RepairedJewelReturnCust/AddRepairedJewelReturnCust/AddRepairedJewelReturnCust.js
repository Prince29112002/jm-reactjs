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
import Select, { createFilter } from "react-select";
import { Icon, IconButton } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Modal from "@material-ui/core/Modal";
import moment from "moment";
import Loader from "app/main/Loader/Loader";
import History from "@history";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CategoryWiseList from "../Components/CategoryWiseList";
import TagWiseList from "../Components/TagWiseList";
import PacketWiseList from "../Components/PacketWiseList";
import PackingSlipWiseList from "../Components/PackingSlipWise";
import BillOfMaterial from "../Components/BillOfMaterial";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import { RepairedJewelReturnCustPrintComp } from "../Components/RepairedJewelReturnCustPrintComp";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
import { UpdateNarration } from "../../Helper/UpdateNarration";
import HelperFunc from "../../Helper/HelperFunc";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
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
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    // borderRadius: 5,
    width: "100%",
    // marginLeft: 15,
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

const AddRepairedJewelReturnCust = (props) => {

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
    roundOff: "",
    grossWtTOt: "",
    netWtTOt: "",
    fineWtTot: "",
    jewelNarration: "",
    accNarration: "",
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
      return moment(currentDate).format("DD-MM-YYYY h:mm A");
    }
  }

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: " Repaired jewellery return to customer voucher" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  function checkforPrint(e) {
    if (
      loadValidation() &&
      clientValidation() &&
      voucherNumValidation() &&
      clientCompValidation() &&
      // partyVoucherNumValidation() &&
      shippingValidation() &&
      shippingClientValidation() &&
      shippingCompValidation()  
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (isView) {
        handlePrint();
      } else {
        if (prevContactIsValid()&& handleDateBlur()) {
          if(selectedLoad === "0"){
            createFromPackingSlip(false, true)
          }else{
            callUserInputApi(false, true);
          }
        } else {
          console.log("prevContactIsValid else");
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
      callFileUploadApi(docFile, 24)
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
  // const hiddenFileInput = React.useRef(null);
  const [modalView, setModalView] = useState(0);
  // const handleClick = (event) => {
  //   if (validateShipping()) {
  //     if (isVoucherSelected) {
  //       setIsCsvErr(false);
  //       hiddenFileInput.current.click();
  //     } else {
  //       setSelectVoucherErr("Please Select Voucher");
  //     }
  //   }
  // };
  // const handlefilechange = (event) => {
  //   handleFile(event);
  //   console.log("handlefilechange");
  //   setUploadErr("");
  // };
  const loadTypeRef = useRef(null)
  const SelectRef = useRef(null)

  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);
  // value="0" Load Packing Slip
  // value="1" Load Metal Variant
  // value="2" Load Findings Variant
  // value="3" Load Lot directly

  const [selectedLoad, setSelectedLoad] = useState("");
  const [selectedLoadErr, setSelectedLoadErr] = useState("");

  const [loading, setLoading] = useState(false);

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

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [jewelNarration, setJewelNarration] = useState("");
  const [jewelNarrationErr, setJewelNarrationErr] = useState("");

  const [totalGrossWeight, setTotalGrossWeight] = useState("");
  const [totalNetWeight, setTotalNetWeight] = useState("");
  const [totalJobWorkFine, setTotalJobWorkFine] = useState("");
  const [fineGoldTotal, setFineGoldTotal] = useState("");

  const [stockCodeData, setStockCodeData] = useState([]);

  const [stockCodeFindings, setStockCodeFindings] = useState([]);

  const [productCategory, setProductCategory] = useState([]);

  const [voucherModalOpen, setvoucherModalOpen] = useState(false);
  const [isVoucherSelected, setIsVoucherSelected] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [selectVoucherErr, setSelectVoucherErr] = useState("");
  const [voucherApiData, setVoucherApiData] = useState([]);

  const [shipping, setShipping] = useState("");
  const [shippingErr, setShippingErr] = useState("");

  const [shippingClient, setShippingClient] = useState("");
  const [shipClientErr, setShipClientErr] = useState("");

  const [shipClientComp, setShipClientComp] = useState("");
  const [shipCompErr, setShipCompErr] = useState("");

  const [shipclientCompData, setShipclientCompData] = useState([]);

  const [lotdata, setLotData] = useState([]);

  const [searchData, setSearchData] = useState("");

  const theme = useTheme();
  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");

  const [vendorStateId, setVendorStateId] = useState("");
  const [address, setAddress] = useState("");
  const [supplierGstUinNumber, setSupplierGstUinNum] = useState("");
  const [supPanNumber, setSupPanNum] = useState("");
  const [supStateName, setSupState] = useState("");
  const [supCountryName, setSupCountry] = useState("");

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

  const handleChangeTab = (event, value) => {
    setModalView(value);
  };

  if (props.location) {
    var idToBeView = props.location.state;
  } else if (props.voucherId) {
    var idToBeView = { id: props.voucherId }
  }
  const [narrationFlag, setNarrationFlag] = useState(false)
  const [userFormValues, setUserFormValues] = useState([
    {
      lotno: "",
      manuallLot: "0",
      stockCode: "",
      billingCategory: "",
      pieces: "",
      HSNNum: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      jobWorkFineinPure: "",
      errors: {
        lotno: null,
        stockCode: null,
        billingCategory: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        jobWorkFineinPure: null,
      },
    },
    {
      lotno: "",
      manuallLot: "0",
      stockCode: "",
      billingCategory: "",
      pieces: "",
      HSNNum: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      jobWorkFineinPure: "",
      errors: {
        lotno: null,
        stockCode: null,
        billingCategory: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        jobWorkFineinPure: null,
      },
    },
    {
      lotno: "",
      manuallLot: "0",
      stockCode: "",
      billingCategory: "",
      pieces: "",
      HSNNum: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      jobWorkFineinPure: "",
      errors: {
        lotno: null,
        stockCode: null,
        billingCategory: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        jobWorkFineinPure: null,
      },
    },
    {
      lotno: "",
      manuallLot: "0",
      stockCode: "",
      billingCategory: "",
      pieces: "",
      HSNNum: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      jobWorkFineinPure: "",
      errors: {
        lotno: null,
        stockCode: null,
        billingCategory: null,
        pieces: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        jobWorkFineinPure: null,
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

  const classes = useStyles();

  useEffect(() => {
    // getDepartmentData();
    console.log("idToBeView", idToBeView);
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true)
      getRepairRetToCustRecords(idToBeView.id);
    } else {
      setNarrationFlag(false)
      getClientData();
      getStockCodeMetal();
      getStockCodeFindingVariant();
      getProductCategories();
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

  function getRepairRetToCustRecords(id) {
    setLoading(true);
    let api = ""
    if(props.forDeletedVoucher){
      api = `api/repairingreturnedtoCustomer/${id}?deleted_at=1`
    }else {
      api = `api/repairingreturnedtoCustomer/${id}`
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

              setSelectedLoad(loadType.toString())
              setDocumentList(finalData.salesPurchaseDocs)

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

              setShipping((finalData.is_shipped).toString())

              if (finalData.is_shipped === 1) {
                setShippingClient({
                  value: finalData.ShippingClient.id,
                  label: finalData.ShippingClient.name
                })

                setShipClientComp({
                  value: finalData.ShippingClientCompany.id,
                  label: finalData.ShippingClientCompany.company_name
                })
              }

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

              if (loadType === 0) {

                for (let item of finalData.RepairingReturnedToCustomerOrder) {
                  // console.log(item);
                  getPackingSlipDetails(item.packing_slip_id,finalData)
                }

              } else if (loadType === 1) {

                for (let item of finalData.RepairingReturnedToCustomerOrder) {
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
                    // rate: item.rate,
                    // valuation: item.valuation,
                  });
                }
              } else if (loadType === 2) {

                for (let item of finalData.RepairingReturnedToCustomerOrder) {
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
                    // rate: item.rate,
                    // valuation: item.valuation,
                  });
                }

              } else if (loadType === 3) {
                for (let item of finalData.RepairingReturnedToCustomerOrder) {
                  // console.log(item);
                  tempArray.push({

                    lotno: {
                      value: item.Lot.id,
                      label: item.Lot.number
                    },
                    // stockCode: "",
                    billingCategory: {
                      value: item.Category.id,
                      label: item.Category.billing_category_name
                    },
                    HSNNum: item.Category.hsn_master.hsn_number,
                    pieces: item.pcs.toString(),
                    grossWeight: parseFloat(item.gross_weight).toFixed(3),
                    netWeight: parseFloat(item.net_weight).toFixed(3),
                    purity: item.purity,
                    jobWorkFineinPure: parseFloat(item.finegold).toFixed(3),
                    // rate: item.rate,
                    // valuation: item.valuation,

                  });
                }
              }

              if (loadType === 1 || loadType === 2 || loadType === 3) {

                setUserFormValues(tempArray)


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

                function grossWeight(item) {
                  // console.log(parseFloat(item.grossWeight));
                  return parseFloat(item.grossWeight);
                }
  
  
                function netWeight(item) {
                  return parseFloat(item.netWeight);
                }
               
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
  
                console.log(finalData, "finalData")
                console.log(tempArray, "tempArray")
                setPrintObj({
                  ...printObj,
                  loadType:loadType.toString(),
                  is_tds_tcs: finalData.is_tds_tcs,
                  supplierName: finalData.ClientCompany.firm_name,
                  supAddress: finalData.ClientCompany.address,
                  supplierGstUinNum: finalData.ClientCompany.gst_number === null ? "-" : finalData.ClientCompany.gst_number,
                  supPanNum: finalData.ClientCompany.pan_number,
                  supState: finalData.ClientCompany.StateName.name ? finalData.ClientCompany.StateName.name : finalData.ClientCompany.StateName.name,
                  supCountry: finalData.ClientCompany.CountryName.name ? finalData.ClientCompany.CountryName.name : finalData.ClientCompany.CountryName.name,
                  supStateCode: finalData.ClientCompany.gst_number === null ? "-" : finalData.ClientCompany.gst_number.substring(0, 2),
                  purcVoucherNum: finalData.voucher_no,
                  partyInvNum: finalData.party_voucher_no,
                  voucherDate: moment(finalData.purchase_voucher_create_date).format("DD-MM-YYYY"),
                  supState: finalData.ClientCompany.StateName.name ? finalData.ClientCompany.StateName.name : finalData.ClientCompany.StateName.name,
                  orderDetails: tempArray,
                  grossWtTOt: parseFloat(totalGrossWeightVal).toFixed(3),
                  netWtTOt: parseFloat(totalNetWeightVal).toFixed(3),
                  jobWorkFineinPure: parseFloat(tempjobWork).toFixed(3),
                  signature: finalData.admin_signature,
                  accNarration: finalData.account_narration,
                  jewelNarration: finalData.metal_narration
                  
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

  function getLotData(sData) {
    let data = {
      "search": sData,
      "voucher_id": selectedVoucher
    }
    axios
      .post(
        Config.getCommonUrl() +
        "api/repairingreturnedtoCustomer/lot/list",
        data
        // `api/lot/department/${window.localStorage.getItem(
        //   "SelectedDepartment"
        // )}/${sData}` //"api/jobWorkArticianIssue/lot/" +selectedVoucher
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          if (response.data.data.length > 0) {
            setLotData(response.data.data);
          } else {
            dispatch(
              Actions.showMessage({
                message: "Please Select Proper Voucher to get Lot Details",
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

  function getVoucherNumber() {
    axios
      .get(
        Config.getCommonUrl() + "api/repairingreturnedtoCustomer/get/voucher"
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
        handleError(error, dispatch, { api: "api/repairingreturnedtoCustomer/get/voucher" })

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
        accNarration: value,
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

  // function partyVoucherNumValidation() {
  //   // const Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
  //   if (partyVoucherNum === "") {
  //     setPartyVoucherNumErr("Enter Valid Voucher Number");
  //     return false;
  //   }
  //   return true;
  // }

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
    //   const [shippingClient, setShippingClient] = useState("");
    // const [shipClientErr, setShipClientErr] = useState("");

    // const [shipClientComp, setShipClientComp] = useState("");
    // const [shipCompErr, setShipCompErr] = useState("")
    if (shipping === "1") {
      if (shipClientComp === "") {
        setShipCompErr("Please Select Valid Client Company");
        return false;
      }
    }
    return true;
  }

  // const isEnabled =
  //   selectedDepartment !== "" &&
  //   selectedLoad !== "" &&
  //   selectedClient !== "" &&
  //   selectedCompany !== "" &&
  //   partyVoucherNum !== "" &&
  //   selectedVoucher !== "";

  // function validateShipping() {
  //   if (
  //     loadValidation() &&
  //     clientValidation() &&
  //     voucherNumValidation() &&
  //     clientCompValidation() &&
  //     partyVoucherNumValidation() &&
  //     shippingValidation() &&
  //     shippingClientValidation() &&
  //     shippingCompValidation()
  //   ) {
  //     // if (selectedLoad === "1") {

  //     return true;
  //     // if (shipping === "1") {
  //     //   if (shippingClientValidation() && shippingCompValidation()) {
  //     //     return true;
  //     //   } else {
  //     //     return false;
  //     //   }

  //     //   // return shippingVendor !== "" && selectedCompany!=="";
  //     // } else if (shipping === "0") {
  //     //   return true;
  //     // } else {
  //     //   return false;
  //     // }
  //     // }else{

  //     // }
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
      clientValidation() &&
      voucherNumValidation() &&
      clientCompValidation() &&
      // partyVoucherNumValidation() &&
      shippingValidation() &&
      shippingClientValidation() &&
      shippingCompValidation()
    ) {
      console.log("if");

      // if (shipping === "1") {
      // if (shippingClientValidation() && shippingCompValidation()) {
      if (isVoucherSelected) {
        checkLoadAndCallApi();
      } else {
        setSelectVoucherErr("Please Select Voucher");
      }
      // }
      // } else if (shipping === "0") {
      // checkLoadAndCallApi();
      // }
    } else {
      console.log("else");
    }
  }

  function checkLoadAndCallApi() {
    if (selectedLoad === "0") {
      createFromPackingSlip(true,false);
    } else if (
      selectedLoad === "1" ||
      selectedLoad === "2" ||
      selectedLoad === "3"
    ) {
      if (prevContactIsValid()) {
        callUserInputApi(true,false);
      }
    }
  }

  const prevContactIsValid = () => {
    if (userFormValues.length === 0) {
      return true;
    }

    let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

    const someEmpty = userFormValues
      .filter((element) =>
        selectedLoad === "3" ? element.lotno !== "" : element.stockCode !== ""
      )
      .some((item) => {
        if (selectedLoad === "3") {
          return (
            item.billingCategory === "" ||
            item.grossWeight === "" ||
            item.grossWeight ==0 ||
            item.netWeight === "" ||
            item.netWeight == 0 ||
            // item.rate === "" || item.rate==0 ||
            // percentRegex.test(item.rate) === false ||
            item.lotno === "" ||
            item.purity === "" ||
            item.pieces === "" ||
            isNaN(item.pieces) ||
            percentRegex.test(item.purity) === false ||
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
            // item.rate === "" || item.rate==0 ||
            item.pieces === "" ||
            isNaN(item.pieces) ||
            item.netWeight === "" ||
            parseFloat(item.netWeight) > parseFloat(item.grossWeight)
            // ||
            // percentRegex.test(item.rate) === false
          );
        }
      });

    if (someEmpty) {
      userFormValues
        .filter((element) =>
          selectedLoad === "3" ? element.lotno !== "" : element.stockCode !== ""
        )
        .map((item, index) => {
          const allPrev = [...userFormValues];
          // console.log(item);
          if (selectedLoad === "3") {
            console.log("fgghthrrgtf")
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
            console.log("TEST@1")
          }
          if(netWeight==0){
            allPrev[index].errors.netWeight = "Enter Net Weight!";
          }else{    
             if (netWeight > gWeight) {
            allPrev[index].errors.netWeight =
              "Net Weight Can not be Greater than Gross Weight";
          } else {
            allPrev[index].errors.netWeight = null;
          }}

     

          //   let Rate = userFormValues[index].rate;
          //   if (!Rate || weightRegex.test(Rate) === false) {
          //     allPrev[index].errors.rate = "Enter Valid Rate!";
          //   } else {
          //     allPrev[index].errors.rate = null;
          //   }

          // console.log(allPrev[index]);
          console.log(allPrev,"allPrev")
          setUserFormValues(allPrev);
          return null;
        });
    }
    console.log(someEmpty,"some")
    return !someEmpty;
   
  };

  function callUserInputApi(resetFlag, toBePrint) {
    console.log("fineGoldTotal", fineGoldTotal);

    let Orders = userFormValues
      .filter((element) =>
        selectedLoad === "3" ? element.lotno !== "" : element.stockCode !== ""
      )
      .map((x) => {
        if (selectedLoad === "3") {
          if (x.manuallLot === "0") {
            return {
              lot_no: x.lotno.label,
              category_id: x.billingCategory.value,
              purity: x.purity,
              gross_weight: x.grossWeight,
              pcs: x.pieces,
              // lot_no: x.lotno.label,
              // category_id: x.categoryName.value,
              // purity: x.purity,
              // rate_of_fine_gold: x.rate,
              // gross_weight: x.grossWeight,
            };
          } else {
            return {
              lot_id: x.lotno.value,
              // rate_of_fine_gold: x.rate,
            };
          }
          // return {
          //   gross_weight: x.grossWeight,
          //   net_weight: x.netWeight,
          //   pcs: x.pieces,
          //   // rate: x.rate,
          //   category_id: x.billingCategory.value,
          //   purity: x.purity,
          // };
        } else {
          return {
            stock_name_code_id: x.stockCode.value,
            gross_weight: x.grossWeight,
            pcs: x.pieces,
            net_weight: x.netWeight,
            // rate: x.rate,
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
      // opposite_account_id: 1,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      client_id: selectedClient.value,
      client_company_id: selectedCompany.value,
      // ...(selectedLoad === "3" && {
      is_lot: selectedLoad === "3" ? 1 : 0,
      // }),
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      is_shipped: parseInt(shipping),
      ...(shipping === "1" && {
        shipping_client_id: shippingClient.value,
        shipping_client_company_id: selectedCompany.value,
      }),
      voucherId: selectedVoucher,
      metal_narration: jewelNarration,
      account_narration: accNarration,
      Orders: Orders,
      uploadDocIds: docIds,
      party_voucher_date:partyVoucherDate,
    }
    axios
      .post(Config.getCommonUrl() + "api/repairingreturnedtoCustomer", body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id

          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.push("/dashboard/masters/clients");
          // History.goBack();
          if (resetFlag === true) {
            checkAndReset()
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record 
            handlePrint();
          }
          // // setSelectedJobWorker("");
          // setSelectedCompany("");
          // setSelectedClient("");
          // // setOppositeAccSelected("");
          // setPartyVoucherNum("");
          // // setSelectedDepartment("");
          // setVoucherDate(moment().format("YYYY-MM-DD"));
          // // setFirmName("");
          // setAccNarration("");
          // setJewelNarration("");
          // // setSelectedIndex(0);
          // setSelectedLoad("");
          // reset();
          setLoading(false);

          // getVoucherNumber();
        } else {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);
        handleError(error, dispatch, { api: "api/repairingreturnedtoCustomer", body: body })
      });
  }

  function getVouchers(client_id, client_company_id) {
    setVoucherApiData([])
    let data = {
      "client_id": client_id,
      "client_company_id": client_company_id,
      "flag": selectedLoad === "3" ? 1 : 0
    }
    console.log(data)
    axios
      .post(
        Config.getCommonUrl() +
        // `api/repairingReceivedFromCustomer/client/${client_id}/${client_company_id}`
        "api/repairingReceivedFromCustomer/client/voucher",
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
              utilize: (
                parseFloat(item.finegold).toFixed(3) -
                parseFloat(item.balance).toFixed(3)
              ).toFixed(3),
              balance: parseFloat(item.balance).toFixed(3),
              rate: item.rate,
              finegold: parseFloat(item.finegold).toFixed(3),
              amount: (
                parseFloat(item.rate) *
                (parseFloat(item.finegold).toFixed(3) -
                  parseFloat(item.balance).toFixed(3))
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
        handleError(error, dispatch, {
          api: "api/repairingReceivedFromCustomer/client/voucher",
          body: data
        })

      });
  }

  function reset() {
    // setCsvData([]);
    if (document.getElementById("fileinput") !== null) {
      document.getElementById("fileinput").value = "";
    }
    // setIsCsvErr(false);
    setPartyVoucherNum("");
    // setSelectedDepartment("");
    setVoucherDate(moment().format("YYYY-MM-DD"));

    setAccNarration("");
    setJewelNarration("");
    setFineGoldTotal("");
    setTotalGrossWeight("");
    setTotalNetWeight("");
    setTotalJobWorkFine("");
    // setValuationTotal("");
    // setFileSelected("");
    // setIsuploaded(false);

    setShipping("");
    setShippingErr("");

    setShippingClient("");
    setShipClientErr("");

    setShipClientComp("");
    setShipCompErr("");

    setUserFormValues([
      {
        lotno: "",
        manuallLot: "0",
        stockCode: "",
        billingCategory: "",
        pieces: "",
        HSNNum: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        jobWorkFineinPure: "",
        errors: {
          lotno: null,
          stockCode: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobWorkFineinPure: null,
        },
      },
      {
        lotno: "",
        manuallLot: "0",

        stockCode: "",
        billingCategory: "",
        pieces: "",
        HSNNum: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        jobWorkFineinPure: "",
        errors: {
          lotno: null,
          stockCode: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobWorkFineinPure: null,
        },
      },
      {
        lotno: "",
        manuallLot: "0",

        stockCode: "",
        billingCategory: "",
        pieces: "",
        HSNNum: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        jobWorkFineinPure: "",
        errors: {
          lotno: null,
          stockCode: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobWorkFineinPure: null,
        },
      },
      {
        lotno: "",
        manuallLot: "0",

        stockCode: "",
        billingCategory: "",
        pieces: "",
        HSNNum: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        jobWorkFineinPure: "",
        errors: {
          lotno: null,
          stockCode: null,
          billingCategory: null,
          pieces: null,
          grossWeight: null,
          netWeight: null,
          purity: null,
          jobWorkFineinPure: null,
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
    setIsVoucherSelected(false);
    setSelectedVoucher("");
    setVoucherApiData([]);
    reset();
    setPrintObj({
      ...printObj,
      loadType : event.target.value,
      supplierName: "",
    supAddress: "",
    supplierGstUinNum: "",
    supPanNum: "",
    supState: "",
    supCountry: "",
    supStateCode: "",
    // purcVoucherNum: "",
    partyInvNum: "",
    // voucherDate: moment().format("DD-MM-YYYY"),
    placeOfSupply: "",
    orderDetails: [],
    roundOff: "",
    grossWtTOt: "",
    netWtTOt: "",
    fineWtTot: "",
    jewelNarration: "",
    accNarration: "",
    })
  }

  // function resetFormOnly() {
  //   // setCsvData([]);
  //   // setIsCsvErr(false);
  //   if (document.getElementById("fileinput") !== null) {
  //     document.getElementById("fileinput").value = "";
  //   }
  //   // setSelectedRateFixErr("");
  //   setPartyVoucherNum("");
  //   setVoucherDate(moment().format("YYYY-MM-DD"));
  //   setAccNarration("");
  //   setJewelNarration("");
  //   setTotalGrossWeight("");
  //   setTotalNetWeight("");
  //   setTotalJobWorkFine("");

  //   setUserFormValues([
  //     {
  //       lotno: "",
  //       manuallLot: "0",

  //       stockCode: "",
  //       billingCategory: "",
  //       pieces: "",
  //       HSNNum: "",
  //       grossWeight: "",
  //       netWeight: "",
  //       purity: "",
  //       jobWorkFineinPure: "",
  //       errors: {
  //         lotno: null,
  //         stockCode: null,
  //         billingCategory: null,
  //         pieces: null,
  //         grossWeight: null,
  //         netWeight: null,
  //         purity: null,
  //         jobWorkFineinPure: null,
  //       },
  //     },
  //     {
  //       lotno: "",
  //       manuallLot: "0",

  //       stockCode: "",
  //       billingCategory: "",
  //       pieces: "",
  //       HSNNum: "",
  //       grossWeight: "",
  //       netWeight: "",
  //       purity: "",
  //       jobWorkFineinPure: "",
  //       errors: {
  //         lotno: null,
  //         stockCode: null,
  //         billingCategory: null,
  //         pieces: null,
  //         grossWeight: null,
  //         netWeight: null,
  //         purity: null,
  //         jobWorkFineinPure: null,
  //       },
  //     },
  //     {
  //       lotno: "",
  //       manuallLot: "0",

  //       stockCode: "",
  //       billingCategory: "",
  //       pieces: "",
  //       HSNNum: "",
  //       grossWeight: "",
  //       netWeight: "",
  //       purity: "",
  //       jobWorkFineinPure: "",
  //       errors: {
  //         lotno: null,
  //         stockCode: null,
  //         billingCategory: null,
  //         pieces: null,
  //         grossWeight: null,
  //         netWeight: null,
  //         purity: null,
  //         jobWorkFineinPure: null,
  //       },
  //     },
  //     {
  //       lotno: "",
  //       manuallLot: "0",

  //       stockCode: "",
  //       billingCategory: "",
  //       pieces: "",
  //       HSNNum: "",
  //       grossWeight: "",
  //       netWeight: "",
  //       purity: "",
  //       jobWorkFineinPure: "",
  //       errors: {
  //         lotno: null,
  //         stockCode: null,
  //         billingCategory: null,
  //         pieces: null,
  //         grossWeight: null,
  //         netWeight: null,
  //         purity: null,
  //         jobWorkFineinPure: null,
  //       },
  //     },
  //   ]);
  // }

  function handleClientSelect(value) {
    setSelectedClient(value);
    setSelectClientErr("");
    setSelectedCompany("");
    setSelectedCompErr("");
    // setIsVoucherSelected(false);
    // setSelectedVoucher("");
    // setVoucherApiData([]);
    // resetFormOnly();

    let findIndex = clientdata.findIndex((item) => item.id === value.value);
    //   // console.log(findIndex, i);
    if (findIndex > -1) {
      getClientCompanies(value.value, function (response) {
        console.log(response);
        setClientCompanies(response);
      });
    }
    SelectRef.current.focus()
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
          console.log(compData)
          // setClientCompanies(compData);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/client/company/listing/listing/${clientId}` })

      });
  }

  function handleCompanyChange(value) {
    setSelectedCompany(value);
    setSelectedCompErr("");
    getVouchers(selectedClient.value, value.value);
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
        TDSTCSVoucherNum: "",
        legderName: "",
        // taxAmount: ledgerAmount,
        jewelNarration: "",
        accNarration: "",
        // balancePayable: totalInvoiceAmount
      })
      // setLegderAmount(0); //everything is goinf to reset so 0
    }
  }

  let handleCategoryChange = (i, e) => {
    let newFormValues = [...userFormValues];
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
    newFormValues[i].jobWorkFineinPure = "";
    // }
    let findIndex = productCategory.findIndex((item) => item.id === e.value);
    console.log(findIndex);
    if (findIndex > -1) {
      newFormValues[i].HSNNum =
        productCategory[findIndex].hsn_master.hsn_number;
    }

    changeTotal(newFormValues, false);
  };

  let handleManualLotNoChange = (i, e) => {
    console.log(e);
    let newFormValues = [...userFormValues];
    newFormValues[i].manuallLot = "0";
    newFormValues[i].lotno = {
      value: "",
      label: e,
    };
    newFormValues[i].errors.lotno = null;

    newFormValues[i].purity = "";
    newFormValues[i].grossWeight = "";
    newFormValues[i].categoryName = "";
    newFormValues[i].netWeight = "";
    newFormValues[i].rate = "";
    newFormValues[i].amount = "";
    newFormValues[i].Total = "";

    setUserFormValues(newFormValues);
  };

  let handleLotNumChange = (i, e) => {
    console.log(e);
    let newFormValues = [...userFormValues];

    let findIndex = lotdata.findIndex((item) => item.number === e);

    if (findIndex > -1) {
      console.log(lotdata[findIndex])
      newFormValues[i].manuallLot = "1";
      newFormValues[i].lotno = {
        value: lotdata[findIndex].id,
        label: lotdata[findIndex].number,
      };
      newFormValues[i].errors.lotno = null;
      newFormValues[i].purity = lotdata[findIndex].LotMetalStockCode.purity;
      newFormValues[i].grossWeight = parseFloat(lotdata[findIndex].total_gross_wgt).toFixed(3);
      newFormValues[i].billingCategory = {
        value: lotdata[findIndex].ProductCategory.id,
        label: lotdata[findIndex].ProductCategory.category_name,
      };
      newFormValues[i].pieces = lotdata[findIndex].pcs;
      newFormValues[i].HSNNum =
        lotdata[findIndex].ProductCategory.hsn_master.hsn_number;
      newFormValues[i].netWeight = parseFloat(lotdata[findIndex].total_net_wgt).toFixed(3);
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
      //   newFormValues[i].rate = "";
      newFormValues[i].pieces = "";
      //   newFormValues[i].valuation = "";
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
    // setAdjustedRate(false);
    // if (adjustedRate === true) {
    //   handleRateValChange();
    // }
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
      //   newFormValues[i].rate = "";
      newFormValues[i].pieces = "";
      //   newFormValues[i].valuation = "";
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
    // setAdjustedRate(false);
    // if (adjustedRate === true) {
    //   handleRateValChange();
    // }
    pcsInputRef.current[i].focus()
  };
  function changeTotal(newFormValues, addFlag) {
    // function valuation(item) {
    //   return item.valuation;
    // }
    // let tempTotal = newFormValues
    //   .filter((item) => item.valuation !== "")
    //   .map(valuation)
    //   .reduce(function (a, b) {
    //     // sum all resulting numbers
    //     return parseFloat(a) + parseFloat(b);
    //   }, 0);

    // setValuationTotal(parseFloat(tempTotal).toFixed(3));

    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.grossWeight);
    }

    // function jobWorkFineinPure(item) {
    //   return parseFloat(item.jobWorkFineinPure);
    // }

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

    let tempFineGold = newFormValues
      .filter((item) => item.jobWorkFineinPure !== "")
      .map(jobWorkFineinPure)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

    let totalGrossWeightVal = parseFloat(newFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);
    setTotalGrossWeight(totalGrossWeightVal);

    let totalNetWeightVal = parseFloat(newFormValues
      .filter((data) => data.netWeight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);
    setTotalNetWeight(totalNetWeightVal);

    let totalFineinpure = parseFloat(newFormValues
      .filter((data) => data.jobWorkFineinPure !== "")
      .map(jobWorkFineinPure)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);
    setTotalNetWeight(totalFineinpure);
 
    setPrintObj({
      ...printObj,
      orderDetails: newFormValues,
      grossWtTOt: parseFloat(totalGrossWeightVal).toFixed(3),
      netWtTOt: parseFloat(totalNetWeightVal).toFixed(3),
      jobWorkFineinPure: parseFloat(totalFineinpure).toFixed(3),
    })

    if (addFlag === true) {
      setUserFormValues([
        ...newFormValues,
        {
          lotno: "",
          manuallLot: "0",

          stockCode: "",
          billingCategory: "",
          pieces: "",
          HSNNum: "",
          grossWeight: "",
          netWeight: "",
          purity: "",
          jobWorkFineinPure: "",
          errors: {
            lotno: null,
            stockCode: null,
            billingCategory: null,
            pieces: null,
            grossWeight: null,
            netWeight: null,
            purity: null,
            jobWorkFineinPure: null,
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
      }
      if (val === "" || val == 0) {
        newFormValues[i].jobWorkFineinPure = "";
        // newFormValues[i].valuation = "";
        // newFormValues[i].netWeight = "";
        setTotalGrossWeight("");
        setFineGoldTotal("");
      }
      // if(newFormValues[i].netWeight==0){
      //   newFormValues[i].errors.netWeight = "Enter Valid Net Weight"

      // }else{
      if (
        parseFloat(newFormValues[i].grossWeight) <
        parseFloat(newFormValues[i].netWeight)
      ) {
        newFormValues[i].errors.netWeight =
          "Net Weight Can not be Greater than Gross Weight";
      } else {
        newFormValues[i].errors.netWeight = "";
      }}

      // newFormValues[i].errors.netWeight = "";
      //   setAdjustedRate(false);
      //   newFormValues[i].rate = "";
    // }

    if (nm === "netWeight") {
      if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
        newFormValues[i].jobWorkFineinPure = parseFloat(
          (parseFloat(newFormValues[i].netWeight) *
            parseFloat(newFormValues[i].purity)) /
          100
        ).toFixed(3);
      }

      newFormValues[i].errors.netWeight = "";
    
      if (val === "" || val==0) {
        newFormValues[i].jobWorkFineinPure = "";
        // newFormValues[i].valuation = "";
        // newFormValues[i].netWeight = "";
        setTotalNetWeight("");
        setFineGoldTotal("");
      }
      if(val==0){
        console.log("TEST")
        newFormValues[i].errors.netWeight = "Enter valid Net Weight"
      }else{
      if (parseFloat(newFormValues[i].grossWeight) < parseFloat(val)) {
        newFormValues[i].errors.netWeight =
          "Net Weight Can not be Greater than Gross Weight";
      } else {
        newFormValues[i].errors.netWeight = "";
      }}

      //   newFormValues[i].rate = "";
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
        // newFormValues[i].valuation = "";

        // setAmount("");
        setTotalNetWeight("");
        setFineGoldTotal("");
      }
    }

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

    let tempGrossWtTot = parseFloat(userFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3)
    setTotalGrossWeight(tempGrossWtTot);

    // function jobWorkFineinPure(item) {
    //   return parseFloat(item.jobWorkFineinPure);
    // }

    let tempFineGold = userFormValues
      .filter((item) => item.jobWorkFineinPure !== "")
      .map(jobWorkFineinPure)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
    console.log(tempFineGold, "tempFineGold")
    setPrintObj({
      ...printObj,
      orderDetails: newFormValues,
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWeight).toFixed(3),
      jobWorkFineinPure: parseFloat(tempFineGold).toFixed(3),
    })

    setUserFormValues(newFormValues);

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

          function grossWeight(item) {
            // console.log(parseFloat(item.grossWeight));
            return parseFloat(item.grossWeight);
          }

          function jobWorkFineinPure(item) {
            return parseFloat(item.jobWorkFineinPure);
          }

          let tempFineGold = userFormValues
            .filter((item) => item.jobWorkFineinPure !== "")
            .map(jobWorkFineinPure)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);

          setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

          setTotalGrossWeight(
            parseFloat(userFormValues
              .filter((data) => data.grossWeight !== "")
              .map(grossWeight)
              .reduce(function (a, b) {
                // sum all resulting numbers
                return parseFloat(a) + parseFloat(b);
              }, 0)).toFixed(3)
          );

          function netWeight(item) {
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

          setUserFormValues(newFormValues);
        }
        return true;
      });
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
  //   console.log("handleVoucherSelect", id);
  //   setIsVoucherSelected(true);
  //   setSelectedVoucher(id);
  //   setSelectVoucherErr("");
  //   setvoucherModalOpen(false);
  //   // if (isUploaded === true) {
  //   //   // fileSelected //file weight is greater than api weight then fix rate from user then upload file
  //   //   uploadfileapicall(fileSelected);
  //   // }
  // }
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
    //   // console.log(findIndex, i);
    if (findIndex > -1) {
      getClientCompanies(value.value, function (response) {
        console.log(response);
        setShipclientCompData(response);
      });
    }

    setShipClientComp("");
    setShipCompErr("");
  }

  function handleShipCompanyChange(value) {
    setShipClientComp(value);
    setShipCompErr("");
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

  function getPackingSlipDetails(packingSlipNum,finalData) {
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
            ...[
              {
                packing_slip_id: tempPackingSlip.packing_slip_id,
                packing_slip_no: tempPackingSlip.packing_slip_no,
              },
            ],
          ]);

          const newTempProductData = temCategoryData.map((item) => {
            return {
              ...item,
              jobWorkFineinPure: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100
              ).toFixed(3),
            };
          });

          let temp = [...productData, ...newTempProductData];

          setProductData((productData) => [
            ...productData,
            ...newTempProductData,
          ]);

          const tempTagWise = tempProductData.map((item) => {
            return {
              ...item,
              jobWorkFineinPure: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100
              ).toFixed(3),
            };
          });

          setTagWiseData((tagWiseData) => [...tagWiseData, ...tempTagWise]);

          const newTempPacketData = tempPacketData.map((item) => {
            return {
              ...item,
              jobWorkFineinPure: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100
              ).toFixed(3),
            };
          });

          setPacketData((packetData) => [...packetData, ...newTempPacketData]);

          let newTemp = {
            ...tempPackingSlip,
            NoOfPacket: tempPacketData.length,
            billingCategory: tempProductData[0].billing_category_name,
            jobWorkFineinPure: parseFloat(
              (parseFloat(tempPackingSlip.net_wgt) *
                parseFloat(tempPackingSlip.purity)) /
              100
            ).toFixed(3),
          };

          setPackingSlipData([...packingSlipData, newTemp]); //packing slip wise

          const tempBillMaterial = tempProductData.map((item) => {
            return {
              ...item,
              metal_wgt: parseFloat(parseFloat(item.gross_wgt) -
                (parseFloat(item.stone_wgt) +
                  parseFloat(item.beads_wgt) +
                  parseFloat(item.silver_wgt) +
                  parseFloat(item.sol_wgt) +
                  parseFloat(item.other_wgt))).toFixed(3),
              jobWorkFineinPure: parseFloat(
                (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100
              ).toFixed(3),
            };
          });

          setBillmaterialData((billMaterialData) => [
            ...billMaterialData,
            ...tempBillMaterial,
          ]);

          function grossWeight(item) {
            return parseFloat(item.gross_wgt);
          }

          function netWeight(item) {
            return parseFloat(item.net_wgt);
          }

          function jobworkFine(item) {
            return parseFloat(item.jobWorkFineinPure);
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

          let tempJobWorkFine = parseFloat(temp
            .filter((item) => item.jobWorkFineinPure !== "")
            .map(jobworkFine)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0)).toFixed(3);

            if(finalData){
              setPrintObj({
                ...printObj,
                is_tds_tcs: finalData.is_tds_tcs,
                supplierName: finalData.ClientCompany.firm_name,
                supAddress: finalData.ClientCompany.address,
                supplierGstUinNum: finalData.ClientCompany.gst_number === null ? "-" : finalData.ClientCompany.gst_number,
                supPanNum: finalData.ClientCompany.pan_number,
                supState: finalData.ClientCompany.StateName.name ? finalData.ClientCompany.StateName.name : finalData.ClientCompany.StateName.name,
                supCountry: finalData.ClientCompany.CountryName.name ? finalData.ClientCompany.CountryName.name : finalData.ClientCompany.CountryName.name,
                supStateCode: finalData.ClientCompany.gst_number === null ? "-" : finalData.ClientCompany.gst_number.substring(0, 2),
                purcVoucherNum: finalData.voucher_no,
                partyInvNum: finalData.party_voucher_no,
                voucherDate: moment(finalData.purchase_voucher_create_date).format("DD-MM-YYYY"),
                supState: finalData.ClientCompany.StateName.name ? finalData.ClientCompany.StateName.name : finalData.ClientCompany.StateName.name,
                grossWtTOt: parseFloat(totalGrossWeightVal).toFixed(3),
                orderDetails: temp,
                loadType : "0",
                netWtTOt: parseFloat(totalNetWeightVal).toFixed(3),
                jobWorkFineinPure: parseFloat(tempJobWorkFine).toFixed(3),
                accNarration: finalData.account_narration,
                jewelNarration: finalData.metal_narration,
                signature: finalData.admin_signature,
              })
            }else{
              setPrintObj({
                ...printObj,
                orderDetails: temp,
                grossWtTOt: parseFloat(totalGrossWeightVal).toFixed(3),
                netWtTOt: parseFloat(totalNetWeightVal).toFixed(3),
                jobWorkFineinPure: parseFloat(tempJobWorkFine).toFixed(3),
                signature: finalData.admin_signature,
              })
            }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/packingslip/packingSlip/${packingSlipNum}` })
      });
  }

  function deleteHandler(slipNo) {
    console.log("domestic", slipNo);

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
    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.grossWeight);
    }

    // function jobWorkFineinPure(item) {
    //   return parseFloat(item.jobWorkFineinPure);
    // }

    function netWeight(item) {
      return parseFloat(item.netWeight);
    }

    let tempNetWeight = tempProduct
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

    let tempjobWork = tempProduct
      .filter((data) => data.jobWorkFineinPure !== "")
      .map(jobWorkFineinPure)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setTotalJobWorkFine(parseFloat(tempjobWork).toFixed(3));

    let tempFineGold = tempProduct
      .filter((item) => item.jobWorkFineinPure !== "")
      .map(jobWorkFineinPure)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

    let totalGrossWeightVal = parseFloat(tempProduct
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);
    setTotalGrossWeight(totalGrossWeightVal);

    let totalNetWeightVal = parseFloat(tempProduct
      .filter((data) => data.netWeight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);
    setTotalNetWeight(totalNetWeightVal);

    let totalFineinpure = parseFloat(tempProduct
      .filter((data) => data.jobWorkFineinPure !== "")
      .map(jobWorkFineinPure)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);
    setTotalNetWeight(totalFineinpure);
 
    setPrintObj({
      ...printObj,
      orderDetails: tempProduct,
      grossWtTOt: parseFloat(totalGrossWeightVal).toFixed(3),
      netWtTOt: parseFloat(totalNetWeightVal).toFixed(3),
      jobWorkFineinPure: parseFloat(totalFineinpure).toFixed(3),
    })

  }

  function createFromPackingSlip(resetFlag, toBePrint) {
    let Orders = packingSlipIdArr.map((x) => {
      return {
        packing_slip_id: parseInt(x.packing_slip_id),
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
      department_id: window.localStorage.getItem("SelectedDepartment"),
      client_id: selectedClient.value,
      client_company_id: selectedCompany.value,
      voucherId: selectedVoucher,
      is_shipped: parseInt(shipping),
      ...(shipping === "1" && {
        shipping_client_id: shippingClient.value,
        shipping_client_company_id: shipClientComp.value,
      }),
      metal_narration: jewelNarration,
      account_narration: accNarration,
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
        "api/repairingreturnedtoCustomer/createFromPackingSlip", body)
      .then(function (response) {
        console.log(response);
        setLoading(false);

        if (response.data.success === true) {
          // console.log(response);
          // setIsCsvErr(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
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
          // setPackingSlipIdArr([]);
          // reset();
          // getVoucherNumber();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/repairingreturnedtoCustomer/createFromPackingSlip",
          body: body
        })
      });
  }

  function deleteRow(index) {
    console.log(index)
    let newFormValues = [...userFormValues];

    newFormValues[index].lotno = ""
    newFormValues[index].manuallLot = ""
    newFormValues[index].stockCode = ""
    newFormValues[index].billingCategory = ""
    newFormValues[index].pieces = ""
    newFormValues[index].HSNNum = ""
    newFormValues[index].grossWeight = ""
    newFormValues[index].netWeight = ""
    newFormValues[index].purity = ""
    newFormValues[index].jobWorkFineinPure = ""
    newFormValues[index].errors = {
      lotno: null,
      stockCode: null,
      billingCategory: null,
      pieces: null,
      grossWeight: null,
      netWeight: null,
      purity: null,
      jobWorkFineinPure: null,
    }

    // setUserFormValues(newFormValues)
    changeTotal(newFormValues, false)
  }

  const handleNarrationClick = () => {
    console.log("handleNarr", narrationFlag)
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        "flag": 24,
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
  const updateDocumentArray =  (id ) => {
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
                        ? "View Repaired Jewellery return to the customer"
                        : "Add Repaired Jewellery return to the customer"}
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
                        <p> Select load type</p>
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
                            onChange={(e) => handleInputChange(e)}
                            onKeyDown={(e) => e.preventDefault()}
                            variant="outlined"
                            // defaultValue={moment().format("yyyy-mm-dd")}
                            required
                            fullWidth
                            disabled={isView}
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
                        <p>Voucher number*</p>
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
                          className="view_consumablepurchase_dv"
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          options={clientdata.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.name,
                          }))}
                          // components={components}
                          value={selectedClient}
                          onChange={handleClientSelect}
                          placeholder="Select Party"
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
                          className="view_consumablepurchase_dv"
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
                        <p>Select ship to other party*</p>
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
                            <p>Select</p>
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
                              isDisabled={isView}
                            />

                            <span style={{ color: "red" }}>
                              {shipCompErr.length > 0 ? shipCompErr : ""}
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
                        style={{ padding: 6, marginTop: "20px" }}
                      >
                        <Button
                          id="button-jewellery"
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

                      {selectedLoad === "0" && !isView && (
                        <Grid
                          className="packing-slip-input"
                          item
                          lg={2}
                          md={4}
                          sm={4}
                          xs={12}
                          style={{ padding: 6, marginTop: "20px" }}
                        >
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
                            disabled={isView}
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
                    <div className=" mt-16 jewellery-artician-main add-repaired-table">
                      {selectedLoad === "0" && (
                        <Grid className="salesjobwork-table-main repaired_jewelleryPreturn-table AddRepairingRecfromCust-tle-dv">
                          <div className={classes.root}>
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
                                <Tab label="Packet Wise List" />
                                <Tab label="Packing Slip Wise List" />
                                <Tab label="Bill Of Material" />
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
                            {modalView === 2 && (
                              <PacketWiseList
                                packetData={packetData}
                                isView={isView}
                              />
                            )}
                            {modalView === 3 && (
                              <PackingSlipWiseList
                                packingSlipData={packingSlipData}
                                deleteHandler={deleteHandler}
                                isView={isView}
                              />
                            )}
                            {modalView === 4 && (
                              <BillOfMaterial
                                billMaterialData={billMaterialData}
                                isView={isView}
                              />
                            )}
                          </div>
                        </Grid>
                      )}

                      {(selectedLoad === "1" ||
                        selectedLoad === "2" ||
                        selectedLoad === "3") && (
                        <div
                          className="mt-16 jewellery-artician-tbl secand-add-repairing-tabel secand-add-repairing-dv view_repaired_jewellery_customer"
                          style={{
                            border: "1px solid #D1D8F5",
                            paddingBottom: 5,
                            borderRadius: "7px",
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
                            {selectedLoad === "3" && (
                              <div className={classes.tableheader}>
                                Lot Number
                              </div>
                            )}
                            {(selectedLoad === "1" || selectedLoad === "2") && (
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
                          </div>

                          {userFormValues.map((element, index) => (
                            <div
                              id="jewellery-artician-head "
                              key={index}
                              className=" repaired-select-input-row all-purchase-tabs"
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
                              {selectedLoad === "3" && (
                                <Autocomplete
                                  id="free-solo-demo"
                                  freeSolo
                                  className="all-purchase-tabs"
                                  onChange={(event, newValue) => {
                                    // setValue(newValue);
                                    handleLotNumChange(index, newValue);
                                  }}
                                  onInputChange={(event, newInputValue) => {

                                    if (!isView && newInputValue !== "") {
                                      setSearchData(newInputValue);
                                      handleManualLotNoChange(
                                        index,
                                        newInputValue
                                      );
                                    }
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
                                    (option) => option.number
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
                                      .filter((array) =>
                                        userFormValues.every(
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
                                      .filter((array) =>
                                        userFormValues.every(
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
                                    classes={classes}
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

                              {(selectedLoad === "1" ||
                                selectedLoad === "2") && (
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
                                disabled={isView || selectedLoad == "3"}
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
                                disabled={isView || selectedLoad == "3"}
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
                                // disabled={isView || selectedLoad=="3"}
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
                            </div>
                          ))}

                          <div
                            className="castum-row-dv"
                            style={{
                              fontWeight: "700",
                              height: "30px",
                            }}
                          >
                            {!isView && (
                              <div
                                id="castum-width-table"
                                className={clsx(
                                  classes.tableheader,
                                  " delete_icons_dv"
                                )}
                              ></div>
                            )}
                            <div
                              id="castum-width-table"
                              className={clsx(classes.tableheader)}
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
                              {/* {totalNetWeight} */}
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
                                "jobWorkFineinPure"
                              )}
                              {/* {totalJobWorkFine} */}
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
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ float: "right" }}
                        className="w-216 mx-auto mt-16 btn-print-save"
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
                        <RepairedJewelReturnCustPrintComp
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
                </div>
              </div>
            </div>
            <ViewDocModal
              documentList={documentList}
              handleClose={handleDocModalClose}
              open={docModal}
              updateDocument={updateDocumentArray}
              purchase_flag_id={idToBeView?.id}
              purchase_flag="24"
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
                            // onClick={(e) => handleVoucherSelect(row.id)}
                            // className={classes.hoverClass}
                          >
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

export default AddRepairedJewelReturnCust;

import React, { useState, useEffect, useRef, useContext } from "react";
import { Typography, Checkbox ,Paper,Table,TableFooter } from "@material-ui/core";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import Select, { createFilter } from "react-select";
import { Icon, IconButton } from "@material-ui/core";
import Loader from "app/main/Loader/Loader";
import History from "@history";
import { useReactToPrint } from "react-to-print";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { DocumentUploadRetailer } from "app/main/apps/SalesPurchase/Helper/DocumentUploadRetailer";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
import { UpdateRetailerNarration } from "../../Helper/UpdateRetailerNarration";
import Icones from "assets/fornt-icons/Mainicons";
import { MetalPurRetailerPrintComp } from "../PrintComponentRetailer/MetalPurRetailerPrintComp";
import AppContext from "app/AppContext";
import ViewDocModelRetailer from "app/main/apps/SalesPurchase/Helper/ViewDocModelRetailer";

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
  tabroot: {
    // overflowX: "auto",
    // overflowY: "auto",
    height: "100%",
  },
  table: {
    minWidth: 900,
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
  Icon: {
    fontSize: "20px !important"
  }
}));

const AddMetalPurchaseRetailer = (props) => {

  const classes = useStyles();
  const SelectRef = useRef(null);
  const appContext = useContext(AppContext);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { SateID } = appContext;
  const isPasswordTwo = localStorage.getItem("isPasswordTwo");
  const theme = useTheme();

  var idToBeView;
  if (props.location) {
    idToBeView = props.location.state;
  } else if (props.voucherId) {
    idToBeView = { id: props.voucherId };
  }

  const [isView, setIsView] = useState(false); //for view Only
  const [narrationFlag, setNarrationFlag] = useState(false);

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [goldRate, setoldGoldRate] = useState("");
  const [goldRateErr, setGoldRateErr] = useState("");
  const [actualGoldRate, setActualGoldRate] = useState(false);
  const [goldMaxValue, setGoldMaxValue] = useState(0);
  const [goldMinValue, setGoldMinValue] = useState(0);

  const [silverRate, setSilverRate] = useState("");
  const [silverRateErr, setSilverRateErr] = useState("");
  const [actualSilverrate, setActualSilverrate] = useState(false);
  const [silverMaxValue, setSilverMaxValue] = useState(0);
  const [silverMinValue, setSilverMinValue] = useState(0);

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [vendorData, setVendorData] = useState([]);
  const [vendorSate, setVendorSate] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedVendorErr, setSelectedVendorErr] = useState("");

  const [firmName, setFirmName] = useState([]);
  const [selectedFirmName, setSelectedFirmName] = useState("")
  const [selectedFirmNameErr, setSelectedFirmNameErr] = useState("")

  const [oppositeAccData, setOppositeAccData] = useState([]);
  const [oppositeAccSelected, setOppositeAccSelected] = useState("");
  const [selectedOppAccErr, setSelectedOppAccErr] = useState("");

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");
  const [stockCodeData, setStockCodeData] = useState([]);
  const [formValues, setFormValues] = useState([
    {
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      fineGold: "",
      rate: "",
      amount: "",
      CGSTPer: "",
      SGSTPer: "",
      IGSTPer: "",
      CGSTval: "",
      SGSTval: "",
      IGSTVal: "",
      Total: "",
      errors: {},
    },
  ]);

  const [grossTotal, setGrossTotal] = useState(0)
  const [netWgtTotal, setNetWgtTotal] = useState(0)
  const [fineTotal, setFineTotal] = useState(0)
  const [sgstTotal, setSgstTotal] = useState(0)
  const [igstTotal, setIgstTotal] = useState(0)
  const [cgstTotal, setCgstTotal] = useState(0)
  const [TotalAmount, setTotalAmount] = useState(0)
  const [totalGst, setTotalGst] = useState(0)
  const [subTotal, setSubTotal] = useState(0)
  const [roundOff, setRoundOff] = useState("");
  const [roundOffErr, SetRoundOffErr] = useState("");
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [metalNarration, setMetalNarration] = useState("");
  const [metalNarrationErr, setMetalNarrationErr] = useState("");

  const [documentList, setDocumentList] = useState([]);
  const [docModal, setDocModal] = useState(false);
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);

  const [printObj, setPrintObj] = useState({
    stateId: "",
    supplierName: "",
    supplierGstUinNum: "",
    purcVoucherNum: "",
    voucherDate: moment().format("DD-MM-YYYY"),
    orderDetails: [],
    sGstTot: "",
    cGstTot: "",
    iGstTot: "",
    roundOff: "",
    grossWtTOt: "",
    netWtTOt: "",
    fineWtTot: "",
    balancePayable: "",
    isIgst : true,
  });

  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);
  const handleAfterPrint = () => {
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
    documentTitle: "Metal_Purchase_Voucher_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  useEffect(() => {
    if (docFile) {
      DocumentUploadRetailer(docFile, 1)
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
            api: "retailerProduct/api/salespurchasedocs/upload",
            body: docFile,
          });
        });
    }
  }, [docFile]);

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
    if (props.reportView) {
      NavbarSetting(props.reportView, dispatch);
    } else {
      NavbarSetting("Sales-Retailer", dispatch);
    }
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000); // 10초 뒤에
    }
  }, [loading]);

  useEffect(() => {
    const accArr = HelperFunc.getOppositeAccountDetails("MetalPurchase");
    setOppositeAccData(accArr);
    setOppositeAccSelected(accArr[0])
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true);
      getMetalPurchaseRecordForView(idToBeView.id);
    } else {
      getVendordata()
      setNarrationFlag(false);
      getStockCodeMetal();
      getTodaysGoldRate();
      getTodaysSilverRate();
      getVoucherNumber(); //if view only then no need to get new voucher number, we will set data coming from api
    }
    //eslint-disable-next-line
  }, []);

  useEffect(()=>{
    if(selectedVendor && !isView){
      getFirmList()
    }
  },[selectedVendor])

  useEffect(()=>{
    if(!isView){
      const sub = subTotal ? subTotal : 0
      const gst = totalGst ? totalGst : 0
      const round = roundOff ? roundOff : 0
  
      const finalAmt = parseFloat(sub) + parseFloat(gst) + parseFloat(round)
      setTotalInvoiceAmount(parseFloat(finalAmt))
    }
  },[subTotal,totalGst,roundOff])

  function getMetalPurchaseRecordForView(id) {
    setLoading(true);
    let api = "";
    if (props.forDeletedVoucher && isPasswordTwo == 0) {
      api = `retailerProduct/api/metalpurchase/${id}?deleted_at=1`;
    } else if (isPasswordTwo == 0) {
      api = `retailerProduct/api/metalpurchase/${id}`;
    } else if (isPasswordTwo == 1) {
      api = `retailerProduct/api/metalPurchaseWt/wt/${id}`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          setLoading(false);
          if (response.data.data !== null) {
            let finalData = response.data.data;
           
            setVoucherNumber(finalData.voucher_no);
            setSelectedVendor({
              value: finalData?.VendorCompany?.vendor?.id,
              label: finalData?.VendorCompany?.vendor?.name,
            });
            setSelectedFirmName({
              value: finalData?.VendorCompany?.id,
              label: finalData.VendorCompany?.firm_name,
            });
            setOppositeAccSelected({
              value: finalData.opposite_account_id,
              label: finalData.OppositeAccount.name,
            });
            setPartyVoucherNum(finalData.party_voucher_no);
            setDocumentList(finalData.salesPurchaseDocs);
            setAllowedBackDate(true);
            setVoucherDate(finalData.purchase_voucher_create_date);
            setRoundOff(finalData.round_off === null ? "" : finalData.round_off);
            setTotalInvoiceAmount(parseFloat(finalData.total_invoice_amount).toFixed(2));
            setAccNarration(finalData.account_narration !== null? finalData.account_narration: "");
            setMetalNarration(finalData.metal_narration !== null? finalData.metal_narration: "");
            setoldGoldRate(finalData.MetalPurchaseOrders[0].rate);
            setSilverRate(finalData?.silver_rate)
            setVendorSate(finalData.MetalPurchaseOrders[0].igst ? 0 : SateID)
            let tempArray = [];
            for (let item of finalData.MetalPurchaseOrders) {
              tempArray.push({
                stockCode: {
                  value: item?.StockNameCode?.id,
                  label: item?.StockNameCode.stock_code,
                },
                categoryName: item.stock_name,
                selectedHsn: item.hsn_number ? item.hsn_number : "",
                grossWeight: parseFloat(item.gross_weight).toFixed(3),
                netWeight: parseFloat(item.net_weight).toFixed(3),
                purity: item.purity,
                fineGold: parseFloat(item.finegold).toFixed(3),
                rate: item.rate,
                amount: parseFloat(item.amount).toFixed(3),
                CGSTPer: item.cgst,
                SGSTPer: item.sgst,
                IGSTPer: item.igst,
                CGSTval:
                  item.cgst !== null
                    ? parseFloat(
                        (parseFloat(item.amount) * parseFloat(item.cgst)) / 100
                      ).toFixed(3)
                    : "",
                SGSTval:
                  item.sgst !== null
                    ? parseFloat(
                        (parseFloat(item.amount) * parseFloat(item.sgst)) / 100
                      ).toFixed(3)
                    : "",
                IGSTVal:
                  item.igst !== null
                    ? parseFloat(
                        (parseFloat(item.amount) * parseFloat(item.igst)) / 100
                      ).toFixed(3)
                    : "",
                Total: parseFloat(item.total).toFixed(3),
                errors: {},
              });
            }
            setFormValues(tempArray);
            totalCalculation(tempArray)
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

  function getVendordata() {
    axios.get(Config.getCommonUrl() + "retailerProduct/api/vendor/both/vendorandclient")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setVendorData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "retailerProduct/api/vendor/both/vendorandclient",
        });
      });
  }

  function getStockCodeMetal() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/stockname/metal")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockCodeData(response.data.data);
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
          api: "retailerProduct/api/stockname/metal",
        });
      });
  }

  function getVoucherNumber() {
    let api = "";
    if (isPasswordTwo == 1) {
      api = "retailerProduct/api/metalPurchaseWt/wt/get/voucher";
    } else {
      api = "retailerProduct/api/metalpurchase/get/voucher";
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
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
          setoldGoldRate(goldrateval);
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

  function getFirmList(){
    axios.get(Config.getCommonUrl() + `retailerProduct/api/vendor/all/company/${selectedVendor.value}`)
    .then(function (response) {
      if (response.data.success === true) {
        console.log(response.data.data, "frimeData");
        setFirmName(response.data.data);
      } else {
        dispatch(Actions.showMessage({ message: response.data.message }));
      }
    })
    .catch((error) => {
      handleError(error, dispatch, {
        api: `retailerProduct/api/vendor/all/company/${selectedVendor.value}`,
      });
    });
  }

  const handleStockGroupChange = (value,i) => {
    const newData = [...formValues];
    console.log(value);
    newData[i].stockCode = value
    if(value.data.stock_group.item_id === 1){
      newData[i].rate = goldRate
    }else if(value.data.stock_group.item_id === 2){
      newData[i].rate = silverRate
    }else if(value.data.stock_group.item_id === 3){
      newData[i].rate = ""
    }
    newData[i].categoryName = value.data.stock_name
    newData[i].purity = value.data?.stock_name_code?.purity
    newData[i].selectedHsn = value.data?.hsn_master?.hsn_number
    newData[i].grossWeight = ""
    newData[i].netWeight = ""
    newData[i].fineGold = ""
    newData[i].amount = ""
    newData[i].CGSTval = ""
    newData[i].SGSTval = ""
    newData[i].IGSTVal = ""
    newData[i].Total = ""
    newData[i].errors = {}

    if(SateID === vendorSate){
      const valGst = parseFloat(value.data.hsn_master.gst) / 2
      newData[i].CGSTPer = valGst
      newData[i].SGSTPer = valGst
    }else{
      newData[i].IGSTPer = parseFloat(value.data.hsn_master.gst)
    }
    setFormValues(newData)
    if(!newData[i + 1]){
      addNewRowAdd()
    }
  }

  const addNewRowAdd = () => {
    setFormValues([
      ...formValues, {
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      fineGold: "",
      rate: "",
      amount: "",
      CGSTPer: "",
      SGSTPer: "",
      IGSTPer: "",
      CGSTval: "",
      SGSTval: "",
      IGSTVal: "",
      Total: "",
      errors: {},
      }
    ])
  }

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "goldRate" && !isNaN(value)) {
      setoldGoldRate(value);
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
        reset()
      }
      else {
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
        reset()
      }
      else {
        setSilverRateErr("Enter today's silver rate in master");
      }
    }else if (name === "voucherDate") {
      setVoucherDate(value);
      setVoucherDtErr("");
    } else if (name === "partyVoucherNum") {
      setPartyVoucherNum(value);
      setPartyVoucherNumErr("");
    } else if (name === "metalNarration") {
      setMetalNarration(value);
      setMetalNarrationErr("");
    } else if (name === "accNarration") {
      setAccNarration(value);
      setAccNarrationErr("");
    } else if (name === "roundOff" && !isNaN(value)) {
      setRoundOff(value);
      // if (value > 50 || value < -50) {
      //   SetRoundOffErr("Please Enter value between -50 to 50");
      // } else {
      //   SetRoundOffErr("");
      // }
    }
  }

  const handleChange = (i,e) => {
    const name = e.target.name;
    const value = e.target.value;

    const newData = [...formValues];
    newData[i][name] = value;
    newData[i].errors[name] = "";

      if(name === "grossWeight"){
        if(value === "" || value === 0 || isNaN(value)){
          newData[i].errors.grossWeight = "Enter valid Gross Weight";
          newData[i].errors.netWeight = "Enter valid Net Weight";
          newData[i].fineGold = "";
          newData[i].amount = "";
        }else{
          newData[i].netWeight = value;
          newData[i].errors.netWeight = ""
        }
      }else if(name === "rate" && isNaN(value)){
        newData[i].errors.rate = "Enter valid rate";
      }
        const nwgt = newData[i].netWeight ? newData[i].netWeight : 0
        const purityVal = newData[i].purity ? newData[i].purity : 0
        const perGramRate = newData[i].rate ? parseInt(newData[i].rate) / 10 : 0
        let fineGData = 0
        if(newData[i].stockCode?.data?.stock_name_code?.purity){
           fineGData = parseFloat((parseFloat(nwgt) * parseFloat(purityVal)) / 100).toFixed(2);
           newData[i].fineGold = parseFloat(fineGData).toFixed(2)
        }else{
           fineGData = parseFloat(nwgt);
        }
        newData[i].amount = parseFloat(parseFloat(fineGData) * parseFloat(perGramRate))
        if(newData[i].CGSTPer && newData[i].SGSTPer && newData[i].amount){
          const tempAmt = parseFloat(newData[i].amount) 
          const cgstamt = (tempAmt * newData[i].CGSTPer) / 100 ;
          const sgstamt = (tempAmt * newData[i].SGSTPer) / 100 ;
          newData[i].CGSTval = parseFloat(cgstamt);
          newData[i].SGSTval = parseFloat(sgstamt);
          newData[i].Total = parseFloat(cgstamt) + parseFloat(sgstamt) + parseFloat(tempAmt)
        }else if(newData[i].amount && newData[i].IGSTPer){
          const igstamt = (parseFloat(newData[i].amount) * newData[i].IGSTPer) / 100 ;
          newData[i].IGSTVal = parseFloat(igstamt)
          newData[i].Total = parseFloat(igstamt) + parseFloat(newData[i].amount)
        }
      totalCalculation(newData)
      setFormValues(newData)
  }

  const totalCalculation = (arrData) => {
    const gwgt = HelperFunc.getTotalOfField(arrData, "grossWeight")
    const nwgt = HelperFunc.getTotalOfField(arrData, "netWeight")
    const fgold = HelperFunc.getTotalOfField(arrData, "fineGold")
    const amt = HelperFunc.getTotalOfField(arrData, "amount")
    const sgstval = HelperFunc.getTotalOfField(arrData, "SGSTval")
    const igstval = HelperFunc.getTotalOfField(arrData, "IGSTVal")
    const cgstval = HelperFunc.getTotalOfField(arrData, "CGSTval")
    const amtTotal = HelperFunc.getTotalOfField(arrData, "Total")

    setGrossTotal(parseFloat(gwgt))
    setNetWgtTotal(parseFloat(nwgt))
    setFineTotal(parseFloat(fgold))
    setSgstTotal(parseFloat(sgstval))
    setIgstTotal(parseFloat(igstval))
    setCgstTotal(parseFloat(cgstval))
    setSubTotal(parseFloat(amt))
    setTotalAmount(parseFloat(amtTotal))
    setTotalGst(parseFloat(sgstval) + parseFloat(igstval) + parseFloat(cgstval))
  }

  const handlePartyChange = (value) => {
    setSelectedVendor(value)
    setSelectedVendorErr("");
    setSelectedFirmName("");
    setSelectedFirmNameErr("")
    setVendorSate(value.state);
    getorderreset()
  }

  const handleFirmChange = (value) => {
    setSelectedFirmName(value)
    setSelectedFirmNameErr("")
  }

  const handleOppAccChange = (value) => {
    setOppositeAccSelected(value);
    setSelectedOppAccErr("");
  }

  const deleteRow = (i) => {
    const dataArray = [...formValues]
    if(dataArray[i+1]){
      const newArr = dataArray.filter((temp,index)=>{
        if(i !== index) return temp;
      });
      totalCalculation(newArr)
      setFormValues(newArr)
    }else{
      dataArray[i].stockCode = ""
      dataArray[i].categoryName = ""
      dataArray[i].selectedHsn = ""
      dataArray[i].grossWeight = ""
      dataArray[i].netWeight = ""
      dataArray[i].purity = ""
      dataArray[i].fineGold = ""
      dataArray[i].rate = ""
      dataArray[i].amount = ""
      dataArray[i].CGSTPer = ""
      dataArray[i].SGSTPer = ""
      dataArray[i].IGSTPer = ""
      dataArray[i].CGSTval = ""
      dataArray[i].SGSTval = ""
      dataArray[i].IGSTVal = ""
      dataArray[i].Total = ""
      dataArray[i].error = {}
      totalCalculation(dataArray)
      setFormValues(dataArray)
    }
  }

  const handleNarrationClick = () => {
    if (narrationFlag === false) {
      setLoading(true);
      const body = {
        flag: 1,
        id: idToBeView.id,
        metal_narration: metalNarration,
        account_narration: accNarration,
      };
      UpdateRetailerNarration(body)
        .then((response) => {
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

  const reset = () => {
    setVendorSate("")
    setSelectedVendor("")
    setSelectedVendorErr("")
    setSelectedFirmName("")
    setSelectedFirmNameErr("")
    setOppositeAccSelected(oppositeAccData[0])
    setSelectedOppAccErr("")
    setPartyVoucherNum("")
    setPartyVoucherNumErr("")
    getorderreset()
  }

  const getorderreset = () => {
    setFormValues([
      {
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      fineGold: "",
      rate: "",
      amount: "",
      CGSTPer: "",
      SGSTPer: "",
      IGSTPer: "",
      CGSTval: "",
      SGSTval: "",
      IGSTVal: "",
      Total: "",
      errors: {},
      }
    ])
    setGrossTotal(0)
    setNetWgtTotal(0)
    setFineTotal(0)
    setSgstTotal(0)
    setIgstTotal(0)
    setCgstTotal(0)
    setTotalAmount(0)
    setTotalGst(0)
    setSubTotal(0)
    setRoundOff("")
    SetRoundOffErr("")
    setTotalInvoiceAmount(0)
    setAccNarration("")
    setAccNarrationErr("")
    setMetalNarration("")
    setMetalNarrationErr("")
  }

  const getprintObj = () => {
    setPrintObj({
      voucherDate: moment(voucherDate).format("DD-MM-YYYY"),
      stateId: vendorSate,
      supplierName: selectedVendor.label,
      supplierGstUinNum: selectedFirmName.data?.gst_number,
      purcVoucherNum: voucherNumber,
      orderDetails: formValues,
      sGstTot: sgstTotal,
      cGstTot: cgstTotal,
      iGstTot: igstTotal,
      roundOff: roundOff,
      grossWtTOt: parseFloat(grossTotal).toFixed(3),
      netWtTOt: parseFloat(netWgtTotal).toFixed(3),
      fineWtTot: parseFloat(fineTotal).toFixed(3),
      balancePayable: totalInvoiceAmount,
      isIgst : vendorSate === SateID ? false : true,
    }) 
    if(isView){
      handlePrint();
    }
  }

  const goldRateValueValidation = () => {
    if ((!actualGoldRate || goldRateErr) && !isView) {
      if(!actualGoldRate){
        setGoldRateErr("Enter today's gold rate in master");
      }
      return false;
    } 
    return true  
  }

  const silverRateValidation = () => {
    if ((!actualSilverrate || silverRateErr) && !isView) {
      if(!actualSilverrate){
        setSilverRateErr("Enter today's silver rate in master");
      }
      return false;
    } 
    return true  
  }

  const partyNameValidation = () => {
    if (selectedVendor === "") {
      setSelectedVendorErr("Please select party name");
      return false;
    }
    return true;
  }

  const FrimeNameValidation = () => {
    if (selectedFirmName === "") {
      setSelectedFirmNameErr("Please select firmname");
      return false;
    }
    return true;
  }

  const voucherNumValidation = () => {
    if (partyVoucherNum === "") {
      setPartyVoucherNumErr("Enter valid party voucher number");
      return false;
    }
    return true;
  }

  const oppositeAcValidation = () => {
    if (oppositeAccSelected === "") {
      setSelectedOppAccErr("Please Select Opposite Account");
      return false;
    }
    return true;
  }

  function hasStockEntry() {
    if ( formValues[0].stockCode === "") {
      dispatch(
        Actions.showMessage({
          message: "Please Add Purchase Entry",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  }

  function validateStockEntry() {
    const oldData = [...formValues];
    const grossNetRegex = /^(?!0\d)\d{1,9}(?:\.\d+)?$/;
    oldData.map((item, i) => {
      if (item.stockCode) {
       if (
          item.grossWeight === "" ||
          item.grossWeight == 0 ||
          grossNetRegex.test(item.grossWeight) === false
        ) {
          item.errors.grossWeight = "Enter valid gross weight";
        }else if(item.rate === "" || grossNetRegex.test(item.rate) === false || item.rate == 0 ) {
          item.errors.rate = "Enter valid rate";
        }
      }
    });
    setFormValues(oldData);
    return true;
  }

  const validateEmpty = () => {
    let arrData = [...formValues];
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


  const handleFormSubmit = (e,isPrint) => {
    e.preventDefault();
    if( goldRateValueValidation() &&
      silverRateValidation() &&
      partyNameValidation() &&
      FrimeNameValidation() &&
      oppositeAcValidation() &&
      voucherNumValidation() &&
      hasStockEntry() &&
      validateStockEntry() &&
      validateEmpty() &&
      !roundOffErr){
        if(isPrint){
          getprintObj()
          if(!isView){
            addMetalPurchase(false, true);
          }
        }else{
          addMetalPurchase(true, false);
        } 
     }
  }

  const addMetalPurchase = (resetFlag,toBePrint) => {
    setLoading(true);
    const orders = []
    formValues.map((x) => {
      if(x.stockCode && x.grossWeight){
        orders.push({
          stock_name_code_id: x.stockCode.value,
          gross_weight: x.grossWeight,
          net_weight: x.netWeight,
          rate : x.rate
        })
      }
    })
    const body = {
      party_voucher_no: partyVoucherNum,
      opposite_account_id: oppositeAccSelected.value,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      vendor_id: selectedFirmName.value,
      is_vendor_client: 1,
      setRate: goldRate,
      silver_rate : silverRate,
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),

      round_off: roundOff === "" ? 0 : roundOff,
      metal_narration: metalNarration,
      account_narration: accNarration,
      Orders: orders,
      uploadDocIds: docIds,
    }
    let api = "";
    if (isPasswordTwo == 1) {
      api = "retailerProduct/api/metalPurchaseWt/wt";
    } else {
      api = "retailerProduct/api/metalpurchase";
    }
    axios
    .post(Config.getCommonUrl() + api, body)
    .then(function (response) {
      if (response.data.success === true) {
        dispatch(Actions.showMessage({
          message: response.data.message,
          variant: "success",
          }));
        setLoading(false);
        if (resetFlag === true) {
          checkAndReset();
        }
        if (toBePrint === true) {
          //printing after save, so print popup will be displayed after successfully saving record
          handlePrint();
        }
      } else {
        dispatch(
          Actions.showMessage({
            message: response.data.message,
            variant: "error",
          })
        );
        setLoading(false);
      }
    })
    .catch((error) => {
      setLoading(false);
      handleError(error, dispatch, {
        api: api,
        body: body,
      });
    });
  }

  return(
    <div className={clsx(classes.root, props.className, "w-full")} id="metalpurchase-main">
    <FuseAnimate animation="transition.slideUpIn" delay={200}>
      <div className="flex flex-col md:flex-row container">
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
          {props.viewPopup !== true ? (
            <Grid
            container
            alignItems="center"
            style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
            >
              <Grid item xs={8} sm={8} md={4} lg={5} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    {isView ? "View Metal Purchase" : "Add Metal Purchase"}
                  </Typography>
                </FuseAnimate>
              </Grid>

              <Grid
                item
                xs={4}
                sm={4}
                md={8}
                lg={7}
                key="2"
              >
                <div className="btn-back">
                  {" "}
                  <Button
                    id="btn-back"
                    size="small"
                    onClick={(event) => {
                      History.goBack();
                    }}
                  >
                    <img className="back_arrow" src={Icones.arrow_left_pagination} alt="" />
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>
          ) : (
            ""
          )}
          <div className="main-div-alll">
            {loading && <Loader />}
            <div style={{ height: "90%" }}>
              <div>
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  onSubmit={handleFormSubmit}
                >
                  <Grid container spacing={3} className="p-8 pb-0">
                    <Grid
                      item
                      lg={2}
                      md={4}
                      sm={4}
                      xs={12}
                      style={{ padding: 6 }}
                    >
                      <p style={{ paddingBottom: "3px" }}>Today's Gold Rate</p>{" "}
                      <TextField
                        name="goldRate"
                        value={goldRate ? parseFloat(goldRate) : ""}
                        onChange={(e) => handleInputChange(e)}
                        error={goldRateErr.length > 0 ? true : false}
                        helperText={goldRateErr}
                        variant="outlined"
                        required
                        fullWidth
                        autoFocus
                        placeholder="Today's Gold Rate"
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
                      <p style={{ paddingBottom: "3px" }}>Today's silver rate</p>{" "}
                      <TextField
                        name="silverRate"
                        value={silverRate}
                        error={silverRateErr.length > 0 ? true : false}
                        helperText={silverRateErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        autoFocus
                        placeholder="Today's silver Rate"
                        disabled={isView}
                      />
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
                        <p className="mb-4">Voucher Date</p>{" "}
                        <TextField
                          type="date"
                          className=""
                          name="voucherDate"
                          value={voucherDate}
                          error={VoucherDtErr.length > 0 ? true : false}
                          helperText={VoucherDtErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
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
                        className="view_consumablepurchase_dv"
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        classes={classes}
                        styles={selectStyles}
                        options={vendorData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                          state: suggestion.state,
                        }))}
                        autoFocus
                        blurInputOnSelect
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
                      <Select
                        className="view_consumablepurchase_dv"
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        classes={classes}
                        styles={selectStyles}
                        options={firmName.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.firm_name,
                          data : suggestion
                        }))}
                        blurInputOnSelect
                        tabSelectsValue={false}
                        value={selectedFirmName}
                        onChange={handleFirmChange}
                        placeholder="Firm Name"
                        isDisabled={isView}
                      />
                      <span style={{ color: "red" }}>
                        {selectedFirmNameErr.length > 0
                          ? selectedFirmNameErr
                          : ""}
                      </span>
                    </Grid>

                    <Grid
                      item
                      lg={2}
                      md={4}
                      sm={4}
                      xs={12}
                      style={{ padding: 6 , marginTop: "5px"}}
                    >
                      <p style={{ paddingBottom: "3px" }}>Opposite account</p>
                      <Select
                        className="view_consumablepurchase_dv"
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        classes={classes}
                        styles={selectStyles}
                        options={oppositeAccData}
                        ref={SelectRef}
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
                      style={{ padding: 6 ,marginTop: "5px"}}
                    >
                      <p style={{ paddingBottom: "3px" }}>
                        Party voucher number
                      </p>
                      <TextField
                        className="mb-16"
                        placeholder="Party voucher number"
                        name="partyVoucherNum"
                        tabIndex="1"
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
                  </Grid>
                  {console.log(formValues,"innn")}
                  <Paper className={classes.tabroot} style={{marginTop:"12px"}}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        {!isView && (
                          <TableCell
                            className={classes.tableRowPad}
                            style={{ width: "50px" }}
                          >
                            <div
                              className={clsx(
                                classes.tableheader,
                                "delete_icons_dv"
                              )}
                            ></div>
                          </TableCell>
                        )}
                        <TableCell className={classes.tableRowPad}>Stock code</TableCell>
                        <TableCell className={classes.tableRowPad}>Category Name</TableCell>
                        <TableCell className={classes.tableRowPad}>HSN</TableCell>
                        <TableCell className={classes.tableRowPad}>Gross Weight</TableCell>
                        <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
                        <TableCell className={classes.tableRowPad}>Purity</TableCell>
                        <TableCell className={classes.tableRowPad}>Fine</TableCell>
                        <TableCell className={classes.tableRowPad}>Rate /10gm</TableCell>
                        <TableCell className={classes.tableRowPad}>Amount</TableCell>
                        {
                          SateID === vendorSate ? 
                          <>
                            <TableCell className={classes.tableRowPad}>CGST (%)</TableCell>
                            <TableCell className={classes.tableRowPad}>SGST (%)</TableCell>
                            <TableCell className={classes.tableRowPad}>CGST</TableCell>
                            <TableCell className={classes.tableRowPad}>SGST</TableCell>
                          </> : 
                           <>
                            <TableCell className={classes.tableRowPad}>IGST (%)</TableCell>
                            <TableCell className={classes.tableRowPad}>IGST</TableCell>
                         </>
                        }
                        <TableCell className={classes.tableRowPad}>Total</TableCell>
                      </TableRow>
                    </TableHead>
                      <TableBody>
                        {formValues.map((element, index) => (
                          <TableRow key={index}>
                            {!isView && (
                              <TableCell
                                className={classes.tablePad}
                                align="center"
                                style={{ paddingLeft: 0, textAlign: "center" }}
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
                              </TableCell>
                            )}
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
                                options={stockCodeData.map((suggestion) => ({
                                  value: suggestion.stock_name_code.id,
                                  label: suggestion.stock_name_code.stock_code,
                                  data : suggestion
                                }))}
                                value={element?.stockCode}
                                onChange={(value) => {
                                  handleStockGroupChange(value,index);
                                }}
                                placeholder="Stock Code"
                                isDisabled={isView || selectedVendor === ""}
                              />
                              
                              <span style={{ color: "red" }}>
                                {element.errors && element.errors.stockCode
                                  ? element.errors.stockCode
                                  : ""}
                              </span>
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                              <TextField
                                name="categoryName"
                                variant="outlined"
                                value={element.categoryName || ""}
                                fullWidth
                                disabled={isView || element.stockCode === ""}
                              />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                              <TextField
                                name="selectedHsn"
                                value={element.selectedHsn || ""}
                                variant="outlined"
                                fullWidth
                                disabled
                              />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                              <TextField
                                name="grossWeight"
                                value={element.grossWeight || ""}
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                                error={element.errors && element.errors.grossWeight ? true : false}
                                helperText={element.errors && element.errors.grossWeight ? element.errors.grossWeight : ""}
                                disabled={isView || element.stockCode === ""}
                              />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                              <TextField
                                name="netWeight"
                                value={element.netWeight || ""}
                                variant="outlined"
                                fullWidth
                                disabled={isView || element.stockCode === ""}
                              />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                              <TextField
                                name="purity"
                                value={element.purity || ""}
                                variant="outlined"
                                fullWidth
                                disabled
                              />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                              <TextField
                                name="fineGold"
                                value={element.fineGold ? parseFloat(element.fineGold).toFixed(2) : ""}
                                variant="outlined"
                                fullWidth
                                disabled
                              />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                              <TextField
                                name="rate"
                                value={parseFloat(element.rate) || ""}
                                onChange={(e) => handleChange(index, e)}
                                className="addconsumble-dv"
                                error={element.errors && element.errors.rate ? true : false}
                                helperText={element.errors && element.errors.rate ? element.errors.rate : ""}
                                variant="outlined"
                                fullWidth
                                disabled={isView || element.stockCode === "" || element.netWeight === ""}
                              />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                              <TextField
                                name="amount"
                                value={element.amount ? parseFloat(element.amount).toFixed(2) : ""}
                                variant="outlined"
                                fullWidth
                                disabled
                              />
                            </TableCell>
                            {
                               SateID === vendorSate ? 
                               <>
                                <TableCell className={classes.tablePad}>
                                 <TextField
                                name="CGSTPer"
                                value={element.CGSTPer || ""}
                                // onChange={(e) => handleChange(index, e)}
                                // className="addconsumble-dv"
                                // error={element.errors && element.errors.CGSTPer ? true : false}
                                // helperText={element.errors && element.errors.CGSTPer ? element.errors.CGSTPer : ""}
                                variant="outlined"
                                fullWidth
                                disabled
                              /></TableCell>
                               <TableCell className={classes.tablePad}>
                                <TextField
                                name="SGSTPer"
                                value={element.SGSTPer || ""}
                                // onChange={(e) => handleChange(index, e)}
                                // className="addconsumble-dv"
                                // error={element.errors && element.errors.SGSTPer ? true : false}
                                // helperText={element.errors && element.errors.SGSTPer ? element.errors.SGSTPer : ""}
                                variant="outlined"
                                fullWidth
                                disabled
                              /></TableCell>
                               <TableCell className={classes.tablePad}>
                                <TextField
                                name="CGSTval"
                                value={element.CGSTval ? parseFloat(element.CGSTval).toFixed(2) : ""}
                                // onChange={(e) => handleChange(index, e)}
                                // className="addconsumble-dv"
                                // error={element.errors && element.errors.CGSTval ? true : false}
                                // helperText={element.errors && element.errors.CGSTval ? element.errors.CGSTval : ""}
                                variant="outlined"
                                fullWidth
                                disabled
                              /></TableCell>
                               <TableCell className={classes.tablePad}>
                                <TextField
                                name="SGSTval"
                                value={element.SGSTval ? parseFloat(element.SGSTval).toFixed(2) : ""}
                                // onChange={(e) => handleChange(index, e)}
                                // className="addconsumble-dv"
                                // error={element.errors && element.errors.SGSTval ? true : false}
                                // helperText={element.errors && element.errors.SGSTval ? element.errors.SGSTval : ""}
                                variant="outlined"
                                fullWidth
                                disabled
                              /></TableCell>
                               </>
                               :
                               <>
                                <TableCell className={classes.tablePad}>
                                 <TextField
                                name="IGSTPer"
                                value={element.IGSTPer || ""}
                                // onChange={(e) => handleChange(index, e)}
                                // className="addconsumble-dv"
                                // error={element.errors && element.errors.IGSTPer ? true : false}
                                // helperText={element.errors && element.errors.IGSTPer ? element.errors.IGSTPer : ""}
                                variant="outlined"
                                fullWidth
                                disabled={isView || element.stockCode === ""}
                              /></TableCell>
                               <TableCell className={classes.tablePad}>
                                <TextField
                                name="IGSTVal"
                                value={element.IGSTVal ? parseFloat(element.IGSTVal).toFixed(2) : ""}
                                // onChange={(e) => handleChange(index, e)}
                                // className="addconsumble-dv"
                                // error={element.errors && element.errors.IGSTVal ? true : false}
                                // helperText={element.errors && element.errors.IGSTVal ? element.errors.IGSTVal : ""}
                                variant="outlined"
                                fullWidth
                                disabled={isView || element.stockCode === ""}
                              />
                              </TableCell>
                               </>
                            }
                            <TableCell className={classes.tablePad}>
                              <TextField
                                name="Total"
                                value={element.Total ? parseFloat(element.Total).toFixed(2) : ""}
                                variant="outlined"
                                fullWidth
                                disabled
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow style={{ backgroundColor: "#ebeefb" }}>
                          {!isView && (
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                          )}
                          <TableCell className={classes.tableRowPad}></TableCell>
                          <TableCell className={classes.tableRowPad}></TableCell>
                          <TableCell className={classes.tableRowPad}></TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <b>{parseFloat(grossTotal).toFixed(3)}</b>
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                          <b>{parseFloat(netWgtTotal).toFixed(3)}</b>
                          </TableCell>
                           <TableCell className={classes.tableRowPad}></TableCell>
                           <TableCell className={classes.tableRowPad}>
                           <b>{parseFloat(fineTotal).toFixed(2)}</b>
                           </TableCell>
                           <TableCell className={classes.tableRowPad}></TableCell>
                           <TableCell className={classes.tableRowPad}>
                           <b>{parseFloat(subTotal).toFixed(2)}</b>
                           </TableCell>
                          {
                            SateID === vendorSate ? <>
                             <TableCell className={classes.tableRowPad}></TableCell>
                              <TableCell className={classes.tableRowPad}></TableCell>
                              <TableCell className={classes.tableRowPad}>
                              <b>{parseFloat(cgstTotal).toFixed(2)}</b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                              <b>{parseFloat(sgstTotal).toFixed(2)}</b>
                              </TableCell>
                            </> : <>
                            <TableCell className={classes.tableRowPad}></TableCell>
                            <TableCell className={classes.tableRowPad}>
                            <b>{parseFloat(igstTotal).toFixed(2)}</b>
                            </TableCell>
                            </>
                          }
                          <TableCell
                            className={classes.tableRowPad}
                            style={{ paddingRight: 28 }}
                          >
                            <b>{parseFloat(TotalAmount).toFixed(2)}</b>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                  </Table>
                </Paper>
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
                  >
                    <label className="mr-2">Sub Total : </label>
                    <label className="ml-2">
                      {" "}
                      {isView ? Config.numWithComma(subTotal) : parseFloat(subTotal).toFixed(2)}
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
                      {isView ? Config.numWithComma(totalGst) : parseFloat(totalGst).toFixed(2)}
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
                    <label className="mr-3" style={{}}>
                    Discount :
                    </label>
                    <label className="ml-2 input-sub-total font-bold">
                      <TextField
                        className="addconsumble-dv"
                        name="roundOff"
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
                        : parseFloat(totalInvoiceAmount).toFixed(2)}
                    </label>
                  </div>
                </div>

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
                  <div>
                    <label>Final Receivable Amount :</label>
                    <label>
                      {" "}
                      {isView
                        ? Config.numWithComma(totalInvoiceAmount)
                        : parseFloat(totalInvoiceAmount).toFixed(2)}{" "}
                    </label>
                  </div>
                </div>

                <Grid container style={{marginTop:"12px"}}>
                  <Grid
                    item
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <p style={{ paddingBottom: "3px" }}>Metal Narration</p>
                    <TextField
                      className="mt-1"
                      placeholder="Metal Narration"
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
                        onClick={(e) => {
                          handleFormSubmit(e,false);
                        }}
                      >
                        Save
                      </Button>
                    )}

                    <Button
                      variant="contained"
                      style={{ float: "right" }}
                      className="w-224 mx-auto mt-16 mr-16 btn-print-save"
                      aria-label="Register"
                      type="submit"
                      onClick={(e) => {
                        handleFormSubmit(e,true);
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
                    <div 
                    style={{ display: "none" }}
                    >
                      <MetalPurRetailerPrintComp
                        ref={componentRef}
                        printObj={printObj}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FuseAnimate>
  </div>
  )
}

export default AddMetalPurchaseRetailer
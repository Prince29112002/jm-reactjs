import React, { useState, useEffect, useRef, useContext } from "react";
import { Typography, TextField, Checkbox, Paper, Table, TableHead, TableRow, TableCell, TableFooter, TableBody } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Select, { createFilter } from "react-select";
import History from "@history";
import Button from "@material-ui/core/Button";
import Loader from "app/main/Loader/Loader";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import moment from "moment";
import HelperFunc from "../../Helper/HelperFunc";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
import { UpdateNarration } from "../../Helper/UpdateNarration";
import { SalesB2CPrint } from "../SalesB2CPrint/SalesB2CPrint"
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
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    width: "100%",
    minWidth: 2200,
    tableLayout: "auto"
  },
  tableRowPad: {
    padding: 7,
  },
  tablePad: {
    padding: 0,
  },
  textBold: {
    padding: 7,
    textAlign: "center",
    fontWeight: 700,
    fontSize: 14,
    backgroundColor: "#D1D8F5"
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

const AddSalesB2C = (props) => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [isView, setIsView] = useState(false)

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);
  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");
  const [b2cVoucherList, setB2cVoucherList] = useState([])
  const [selectedB2cVoucher, setSelectedB2cVoucher] = useState("")
  const [selectedB2cVoucherErr, setSelectedB2cVoucherErr] = useState("")
  const [voucherNumber, setVoucherNumber] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [stateId, setStateId] = useState("")
  const [oppositeAccData, setOppositeAccData] = useState([]);
  const [oppositeAccSelected, setOppositeAccSelected] = useState("");
  const [selectedOppAccErr, setSelectedOppAccErr] = useState("");
  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");
  const [goldRate, setgoldRate] = useState("")

  const [formValues, setFormValues] = useState([{
    barcode: "",
    categoryName: "",
    hsn: "",
    huid: "",
    pcs: "",
    gross_wgt: "",
    net_wgt: "",
    purity: "",
    rate: "",
    rateCharge: "",
    labourpergm: "",
    totallabour: "",
    hallmark: "",
    other_charge: "",
    stone_charge: "",
    rohdium_charge: "",
    amount: "",
    csgt_per: "",
    sgst_per: "",
    igst_per: "",
    csgt_val: "",
    sgst_val: "",
    igst_val: "",
    total_amount: "",
    lotdetail_id: "",
    barcode_id: "",
    category_id: "",
    gst: "",
    errors: {}
  }])

  const [subtotal, setSubtotal] = useState(0)
  const [lastTotal, setLastTotal] = useState(0)
  const [igstVal, setIGSTVal] = useState(0)
  const [cgstVal, setCgSTVal] = useState(0)
  const [sgstVal, setSGSTVal] = useState(0)
  const [totalGst, setTotalGst] = useState(0)
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);

  const [roundOff, setRoundOff] = useState("");
  const [finalAmount, setFinalAmount] = useState(0);
  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");
  const [metalNarration, setMetalNarration] = useState("");
  const [metalNarrationErr, setMetalNarrationErr] = useState("");
  const [narrationFlag, setNarrationFlag] = useState(false)
  const departmentId = localStorage.getItem('SelectedDepartment')

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

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const [documentList, setDocumentList] = useState([])
  const [docModal, setDocModal] = useState(false)
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);

  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 37)
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

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);

  const handleAfterPrint = () => { //React.useCallback// tslint:disable-line no-console
    //resetting after print 
    checkAndReset()
  };
  function checkAndReset() {
    if (isView === false) {
      History.goBack();
    }
  }

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console
    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
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
    documentTitle: "Consumable_Purchase_Voucher_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  function checkforPrint() {
    setPrintObj({
      stateId: stateId,
      supplierName: selectedClient.label,
      supAddress: selectedClient.data?.address,
      supplierGstUinNum: selectedClient.data?.government_proof,
      supPanNum: selectedClient.data?.government_proof_id,
      supState: selectedClient.data?.state_name?.name,
      supCountry: selectedClient.data?.country_name?.name,
      supStateCode: selectedClient.data?.state_name?.gst_code,
      purcVoucherNum: voucherNumber,
      partyInvNum: partyVoucherNum,
      voucherDate: moment(voucherDate).format("DD-MM-YYYY"),
      placeOfSupply: selectedClient.data?.state_name?.name,
      orderDetails: formValues,
      taxableAmount: subtotal,
      sGstTot: sgstVal,
      cGstTot: cgstVal,
      iGstTot: igstVal,
      roundOff: roundOff,
      grossWtTOt: HelperFunc.getTotalOfField(formValues, "gross_wgt"),
      netWtTOt: HelperFunc.getTotalOfField(formValues, "net_wgt"),
      totalInvoiceAmt: totalInvoiceAmount,
      jewelNarration: metalNarration,
      accNarration: accNarration,
      balancePayable: finalAmount
    });
    if (isView) {
      handlePrint();
    } else {
      if (!VoucherDtErr && B2cvoucherselectvalidate() && oppositeAcValidation()) {
        addB2CSales(false, true);
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

  useEffect(() => {
    if (props.reportView === "Report") {
      NavbarSetting('Factory Report', dispatch)
    } else if (props.reportView === "Account") {
      NavbarSetting('Accounts', dispatch)
    } else {
      NavbarSetting('Sales', dispatch)
    }
    //eslint-disable-next-line
  }, [])

  if (props.location) {
    var idToBeView = props.location.state;
  } else if (props.voucherId) {
    var idToBeView = { id: props.voucherId }
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  useEffect(() => {
    setOppositeAccData(HelperFunc.getOppositeAccountDetails("SalesB2C"));
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true)
      getSalesB2cRecordForView(idToBeView.id);
    } else {
      setNarrationFlag(false)
      getB2cVoucherInfoList()
      getVoucherNumber();//if view only then no need to get new voucher number, we will set data coming from api
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedB2cVoucher && idToBeView === undefined) {
      getB2cVoucherInfoData()
    }
  }, [selectedB2cVoucher])

  function getB2cVoucherInfoData() {
    const api = `api/tempSalesB2C/${selectedB2cVoucher.value}`
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              let finalData = response.data.data.data;
              console.log(finalData)
              setSelectedClient({
                value: finalData?.B2CClient?.id,
                label: finalData?.B2CClient?.name,
                data: finalData?.B2CClient
              })
              setgoldRate(finalData?.gold_rate)
              setDocumentList(finalData.salesPurchaseDocs)
              setPartyVoucherDate(finalData.party_voucher_date)
              setAllowedBackDate(true);
              setPartyVoucherNum(finalData.party_voucher_no)
              setRoundOff(finalData.round_off !== null ? finalData.round_off : "")
              setAccNarration(finalData.account_narration !== null ? finalData.account_narration : "")
              setMetalNarration(finalData.jewellery_narration !== null ? finalData.jewellery_narration : "")
              console.log(finalData.TempSalesB2COrders)
              var state = ""
              if (finalData.TempSalesB2COrders[0].igst) {
                state = 0
                setStateId(0)
              } else {
                state = 12
                setStateId(12)
              }
              let tempArray = [];

              for (let item of finalData.TempSalesB2COrders) {
                tempArray.push({
                  barcode: item?.barcode,
                  categoryName: item.ProductCategory.billing_category_name,
                  hsn: item?.ProductCategory?.hsn_master?.hsn_number,
                  huid: item?.huid,
                  pcs: item?.pcs,
                  gross_wgt: item?.gross_wt,
                  net_wgt: item?.net_wt,
                  purity: item?.purity,
                  rate: item?.gold_rate,
                  rateCharge: item?.gold_amount,
                  labourpergm: item?.labour_charges,
                  totallabour: item?.labour_amount,
                  hallmark: item?.hallmark_charges,
                  other_charge: item?.other_charges,
                  stone_charge: item?.stone_charges,
                  rohdium_charge: item?.rhodium_charges,
                  amount: item?.total_amount,
                  csgt_per: item?.cgst,
                  sgst_per: item?.sgst,
                  igst_per: item?.igst,
                  csgt_val: item?.cgstAmount,
                  sgst_val: item?.sgstAmount,
                  igst_val: item?.igstAmount,
                  total_amount: item?.total,
                  lotdetail_id: item?.lot_detail_id,
                  barcode_id: item?.barcode_id,
                  category_id: item?.category_id,
                  gst: item?.gst,
                  errors: {}
                });
              }
              setFormValues(tempArray)
              calCulateTotalcall(tempArray, finalData.round_off !== null ? finalData.round_off : 0)
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

  function getSalesB2cRecordForView(id) {
    setLoading(true);
    let api = ""
    if (props.forDeletedVoucher) {
      api = `api/salesB2C/${id}?deleted_at=1`
    } else {
      api = `api/salesB2C/${id}`
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              let finalData = response.data.data.data;
              console.log(finalData)
              setSelectedB2cVoucher({
                value: finalData.TempSalesB2C?.id,
                label: finalData.TempSalesB2C?.voucher_no
              })
              setSelectedClient({
                value: finalData?.B2CClient?.id,
                label: finalData?.B2CClient?.name,
                data: finalData?.B2CClient
              })
              setgoldRate(finalData?.gold_rate)
              setDocumentList(finalData.salesPurchaseDocs)
              setVoucherNumber(finalData.voucher_no);
              setPartyVoucherDate(finalData.party_voucher_date)
              setAllowedBackDate(true);
              setVoucherDate(moment(finalData.purchase_voucher_create_date).format("YYYY-MM-DD"))
              setOppositeAccSelected({
                value: finalData.opposite_account_id,
                label: finalData.OppositeAccount?.name
              })
              setPartyVoucherNum(finalData.party_voucher_no)
              setRoundOff(finalData.round_off !== null ? finalData.round_off : "")
              setAccNarration(finalData.account_narration !== null ? finalData.account_narration : "")
              setMetalNarration(finalData.jewellery_narration !== null ? finalData.jewellery_narration : "")

              var state = ""
              if (finalData.SalesB2COrders[0].igst) {
                state = 0
                setStateId(0)
              } else {
                state = 12
                setStateId(12)
              }
              let tempArray = [];

              for (let item of finalData.SalesB2COrders) {
                tempArray.push({
                  barcode: item?.barcode,
                  categoryName: item.ProductCategory.billing_category_name,
                  hsn: item?.ProductCategory?.hsn_master?.hsn_number,
                  huid: item?.huid,
                  pcs: item?.pcs,
                  gross_wgt: item?.gross_wt,
                  net_wgt: item?.net_wt,
                  purity: item?.purity,
                  rate: item?.gold_rate,
                  rateCharge: item?.gold_amount,
                  labourpergm: item?.labour_charges,
                  totallabour: item?.labour_amount,
                  hallmark: item?.hallmark_charges,
                  other_charge: item?.other_charges,
                  stone_charge: item?.stone_charges,
                  rohdium_charge: item?.rhodium_charges,
                  amount: item?.total_amount,
                  csgt_per: item?.cgst,
                  sgst_per: item?.sgst,
                  igst_per: item?.igst,
                  csgt_val: item?.cgstAmount,
                  sgst_val: item?.sgstAmount,
                  igst_val: item?.igstAmount,
                  total_amount: item?.total,
                  lotdetail_id: item?.lot_detail_id,
                  barcode_id: item?.barcode_id,
                  category_id: item?.category_id,
                  gst: item?.gst,
                  errors: {}
                });
              }
              setFormValues(tempArray)
              calCulateTotalcall(tempArray, finalData.round_off !== null ? finalData.round_off : 0)
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

  function getB2cVoucherInfoList() {
    axios
      .get(Config.getCommonUrl() + `api/tempSalesB2C/dropDown?department_id=${departmentId}`)
      .then(function (response) {
        console.log(response.data.data);
        if (response.data.success === true) {
          setB2cVoucherList(response.data.data)
        } else {
          setB2cVoucherList([])
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        setB2cVoucherList([])
        handleError(error, dispatch, { api: `api/tempSalesB2C/dropDown?department_id=${departmentId}` })
      });
  }

  function getVoucherNumber() {
    axios
      .get(Config.getCommonUrl() + "api/salesB2C/get/voucher")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);;
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
        handleError(error, dispatch, { api: "api/salesB2C/get/voucher" })
      });
  }

  const calCulateTotalcall = (arr, addedroundOff) => {

    const sgstamt = HelperFunc.getTotalOfField(arr, "sgst_val")
    const cgstamt = HelperFunc.getTotalOfField(arr, "csgt_val")
    const igstamt = HelperFunc.getTotalOfField(arr, "igst_val")
    const tempSubTotal = HelperFunc.getTotalOfField(arr, "amount");
    const tempTotalAmt = HelperFunc.getTotalOfField(arr, "total_amount")
    const roundOffValue = addedroundOff ? addedroundOff : roundOff ? roundOff : 0
    const totalgstamt = parseFloat(isNaN(sgstamt) ? 0 : parseFloat(sgstamt)) + (isNaN(cgstamt) ? 0 : parseFloat(cgstamt))
      + (isNaN(igstamt) ? 0 : parseFloat(igstamt)).toFixed(3)
    const tempInvoiceAmt = parseFloat(parseFloat(tempTotalAmt) + parseFloat(roundOffValue)).toFixed(3)

    setSubtotal(isNaN(tempSubTotal) ? 0 : parseFloat(tempSubTotal).toFixed(3))
    setLastTotal(isNaN(tempTotalAmt) ? 0 : parseFloat(tempTotalAmt).toFixed(3))
    setIGSTVal(isNaN(igstamt) ? 0 : parseFloat(igstamt).toFixed(3))
    setCgSTVal(isNaN(cgstamt) ? 0 : parseFloat(cgstamt).toFixed(3))
    setSGSTVal(isNaN(sgstamt) ? 0 : parseFloat(sgstamt).toFixed(3))
    setTotalGst(parseFloat(totalgstamt).toFixed(3))
    setTotalInvoiceAmount(isNaN(tempInvoiceAmt) ? 0 : parseFloat(tempInvoiceAmt).toFixed(3))
    setFinalAmount(isNaN(tempInvoiceAmt) ? 0 : parseFloat(tempInvoiceAmt).toFixed(3))
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "accNarration") {
      setAccNarration(value);
      setAccNarrationErr("");
    } else if (name === "voucherDate") {
      setVoucherDate(value);
      setVoucherDtErr("");
    } else if (name === "metalNarration") {
      setMetalNarration(value);
      setMetalNarrationErr("");
    }
  }

  function B2cvoucherselectvalidate() {
    if (selectedB2cVoucher === "") {
      setSelectedB2cVoucherErr("Select B2C Voucher");
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
  function handleFormSubmit(ev) {
    ev.preventDefault();
    if (!VoucherDtErr && B2cvoucherselectvalidate() && oppositeAcValidation()) {
      addB2CSales(true, false);
    }
  }

  const concateDocument = (newData) => {
    setDocumentList((documentList) => [...documentList, ...newData]);
  }

  const handleDocModalClose = () => {
    setDocModal(false)
  }

  const handleNarrationClick = () => {
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        "flag": 37,
        "id": idToBeView.id,
        "jewellery_narration": metalNarration,
        "account_narration": accNarration
      }
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

  function addB2CSales(resetFlag, toBePrint) {
    setLoading(true);
    const Orders = []
    formValues.map((x) => {
      if (x.barcode) {
        Orders.push({
          barcode: x.barcode,
          categoryName: x.categoryName,
          hsn: x.hsn,
          huid: x.huid,
          pcs: x.pcs,
          gross_wgt: x.gross_wgt,
          net_wgt: x.net_wgt,
          purity: x.purity,
          rate: x.rate,
          rateCharge: x.rateCharge,
          labourpergm: x.labourpergm,
          totallabour: x.totallabour,
          hallmark: x.hallmark,
          other_charge: x.other_charge,
          stone_charge: x.stone_charge,
          rohdium_charge: x.rohdium_charge,
          amount: x.amount,
          csgt_per: x.csgt_per,
          sgst_per: x.sgst_per,
          igst_per: x.igst_per,
          csgt_val: x.csgt_val,
          sgst_val: x.sgst_val,
          igst_val: x.igst_val,
          total_amount: x.total_amount,
          lot_detail_id: x.lotdetail_id,
          barcode_id: x.barcode_id,
          category_id: x.category_id,
          gst: x.gst,
        })
      }
    });
    const body = {
      temp_sales_b2c_id: selectedB2cVoucher.value,
      is_vendor_client: 4,
      is_shipped: 0,
      party_voucher_no: partyVoucherNum,
      opposite_account_id: oppositeAccSelected.value,
      department_id: departmentId,
      client_company_id: selectedClient.value,
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      round_off: roundOff === "" ? 0 : roundOff,
      jewellery_narration: metalNarration,
      account_narration: accNarration,
      Orders: Orders,
      uploadDocIds: docIds,
      party_voucher_date: partyVoucherDate,
      setRate: goldRate
    }
    console.log(body);
    axios
      .post(Config.getCommonUrl() + "api/salesB2C/createFromPackingSlip", body)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
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
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: "api/salesB2C/createFromPackingSlip", body: body })
      });
  }

  const updateDocumentArray = (id) => {
    let tempDocList = [...documentList]
    const arr = tempDocList.filter(x => x.id !== id);
    setDocumentList(arr)
  }

  function handleOppAccChange(value) {
    setOppositeAccSelected(value);
    setSelectedOppAccErr("");
  }

  const handleVoucherSelect = (value) => {
    setSelectedB2cVoucher(value);
    setSelectedB2cVoucherErr("")
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
            {
              !props.viewPopup && <Grid
              className="jewellerypreturn-main"
                spacing={4}
                container
                alignItems="stretch"
                style={{ margin: 0 }}
              >
                <Grid item xs={7} sm={7} md={7} key="1" style={{ padding: 0 }}>
                  <FuseAnimate delay={300}>
                    <Typography className="pl-28 pt-16 text-18 font-700">

                      {isView ? "View Sales B2C" : "Add Sales B2C"}
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
                      <img className="back_arrow" src={Icones.arrow_left_pagination} alt="" />
                      Back
                    </Button>
                  </div>
                </Grid>
              </Grid>
            }
            <div className="main-div-alll">

              {loading && <Loader />}
              <div
                className="pb-32 pt-32 "
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
                            type="date"
                            className="mb-16"
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
                            onBlur={handleDateBlur}
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
                        <p style={{ paddingBottom: "3px" }}>Voucher Number</p>

                        <TextField
                          className="mb-16"
                          // label="Voucher Number"
                          autoFocus
                          name="voucherNumber"
                          value={voucherNumber}
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
                        <p style={{ paddingBottom: "3px" }}>Select B to C Voucher*</p>

                        <Select
                          className="view_consumablepurchase_dv"
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          options={b2cVoucherList.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.voucher_no,
                          }))}
                          autoFocus
                          value={selectedB2cVoucher}
                          onChange={handleVoucherSelect}
                          placeholder="Select B to C Voucher"
                          isDisabled={isView}
                        />
                        <span style={{ color: "red" }}>
                          {selectedB2cVoucherErr.length > 0 ? selectedB2cVoucherErr : ""}
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
                        <p style={{ paddingBottom: "3px" }}>Opposite Account*</p>

                        <Select
                          className="view_consumablepurchase_dv"
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          options={oppositeAccData}
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
                        <p style={{ paddingBottom: "3px" }}>Party Name*</p>

                        <Select
                          className="view_consumablepurchase_dv"
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          value={selectedClient}
                          placeholder="Party Name"
                          isDisabled
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
                        <p style={{ paddingBottom: "3px" }}>Party Voucher Number</p>

                        <TextField
                          className="mb-16"
                          name="partyVoucherNum"
                          value={partyVoucherNum}
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
                        <p style={{ paddingBottom: "3px" }}>Party Voucher Date</p>

                        <TextField
                          type="date"
                          className="mb-16"
                          name="partyVoucherDate"
                          value={partyVoucherDate}
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
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
                        <p style={{ paddingBottom: "3px" }}>Today's Gold Rate*</p>

                        <TextField
                          className="mb-16"
                          name="goldRate"
                          value={goldRate}
                          variant="outlined"
                          required
                          fullWidth
                          disabled
                        />
                      </Grid>
                    </Grid>
                    <Paper className={classes.tabroot} style={{
                      marginBottom: 16, border: "1px solid #D1D8F5",
                      paddingBottom: 5,
                      borderRadius: "7px",
                    }}>
                      <Table className={classes.table}  >
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad} style={{ width: "107px" }}>
                              Barcode
                            </TableCell>
                            <TableCell className={classes.tableRowPad} style={{ minWidth: "110px" }}>
                              Category
                            </TableCell>
                            <TableCell className={classes.tableRowPad} style={{ minWidth: "100px" }}>
                              HSN
                            </TableCell>
                            <TableCell className={classes.tableRowPad} style={{ minWidth: "80px" }}>
                              HUID
                            </TableCell>
                            <TableCell className={classes.tableRowPad} style={{ minWidth: "50px" }}>
                              Pieces
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Gross Weight
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Net Weight
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Purity
                            </TableCell>
                            <TableCell className={classes.tableRowPad} style={{ minWidth: "80px" }}>
                              Rate
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Labour /gm
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Total Labour
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Hallmark
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Other Charge
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Stone Charge
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Rhodium Charge
                            </TableCell>
                            <TableCell className={classes.tableRowPad} style={{ minWidth: "130px" }}>
                              Amount
                            </TableCell>
                            {stateId === 12 ? (
                              <>
                                <TableCell className={classes.tableRowPad}>
                                  CGST (%)
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  SGST (%)
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  CGST
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  SGST
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell className={classes.tableRowPad}>
                                  IGST (%)
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  IGST
                                </TableCell>
                              </>
                            )}
                            <TableCell className={classes.tableRowPad} style={{ minWidth: "130px" }}>
                              Total
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody className="all-purchase-tabs">
                          {formValues.map((element, index) => (
                            <TableRow key={index}>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="barcode"
                                  value={element.barcode || ""}
                                  disabled
                                  variant="outlined"
                                  fullWidth
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="categoryName"
                                  value={element.categoryName || ""}
                                  disabled
                                  variant="outlined"
                                  fullWidth
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="hsn"
                                  value={element.hsn || ""}
                                  disabled
                                  variant="outlined"
                                  fullWidth
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="huid"
                                  className=""
                                  value={element.huid}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="pcs"
                                  className=""
                                  value={element.pcs}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="gross_wgt"
                                  className=""
                                  value={element.gross_wgt}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="net_wgt"
                                  className=""
                                  value={element.net_wgt}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="purity"
                                  className=""
                                  value={element.purity}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="rate"
                                  className={classes.inputBoxTEST}
                                  type={isView ? "text" : "number"}
                                  value={isView ? Config.numWithComma(element.rate) : element.rate || ""}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="labourpergm"
                                  className={classes.inputBoxTEST}
                                  type={isView ? "text" : "number"}
                                  value={isView ? Config.numWithComma(element.labourpergm) : element.labourpergm || ""}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="totallabour"
                                  className=""
                                  value={element.totallabour}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="hallmark"
                                  className={classes.inputBoxTEST}
                                  type={isView ? "text" : "number"}
                                  value={isView ? Config.numWithComma(element.hallmark) : element.hallmark || ""}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="other_charge"
                                  className={classes.inputBoxTEST}
                                  type={isView ? "text" : "number"}
                                  value={isView ? Config.numWithComma(element.other_charge) : element.other_charge || ""}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="stone_charge"
                                  className={classes.inputBoxTEST}
                                  type={isView ? "text" : "number"}
                                  value={isView ? Config.numWithComma(element.stone_charge) : element.stone_charge || ""}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="rohdium_charge"
                                  className={classes.inputBoxTEST}
                                  type={isView ? "text" : "number"}
                                  value={isView ? Config.numWithComma(element.rohdium_charge) : element.rohdium_charge || ""}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="amount"
                                  className={classes.inputBoxTEST}
                                  type={isView ? "text" : "number"}
                                  value={isView ? Config.numWithComma(element.amount) : element.amount || ""}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </TableCell>
                              {stateId === 12 ? (
                                <>
                                  <TableCell className={classes.tablePad}>
                                    <TextField
                                      name="csgt_per"
                                      className=""
                                      value={element.csgt_per || ""}
                                      variant="outlined"
                                      fullWidth
                                      disabled
                                    />
                                  </TableCell>
                                  <TableCell className={classes.tablePad}>
                                    <TextField
                                      name="sgst_per"
                                      className=""
                                      value={element.sgst_per || ""}
                                      variant="outlined"
                                      fullWidth
                                      disabled
                                    />
                                  </TableCell>
                                  <TableCell className={classes.tablePad}>
                                    <TextField
                                      name="csgt_val"
                                      className=""
                                      value={
                                        isView
                                          ? Config.numWithComma(element?.csgt_val)
                                          : element.csgt_val || ""
                                      }
                                      variant="outlined"
                                      fullWidth
                                      disabled
                                    />
                                  </TableCell>
                                  <TableCell className={classes.tablePad}>
                                    <TextField
                                      name="sgst_val"
                                      className=""
                                      value={
                                        isView
                                          ? Config.numWithComma(element?.sgst_val)
                                          : element.sgst_val || ""
                                      }
                                      variant="outlined"
                                      fullWidth
                                      disabled
                                    />
                                  </TableCell>
                                </>
                              ) : (
                                <>
                                  <TableCell className={classes.tablePad}>
                                    <TextField
                                      name="igst_per"
                                      className=""
                                      value={element.igst_per || ""}
                                      variant="outlined"
                                      fullWidth
                                      disabled
                                    />
                                  </TableCell>
                                  <TableCell className={classes.tablePad}>
                                    <TextField
                                      name="igst_val"
                                      className=""
                                      value={
                                        isView
                                          ? Config.numWithComma(element?.igst_val)
                                          : element.igst_val || ""
                                      }
                                      variant="outlined"
                                      fullWidth
                                      disabled
                                    />
                                  </TableCell>
                                </>
                              )}
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="total_amount"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(element.total_amount)
                                      : element.total_amount || ""
                                  }
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell
                              className={classes.textBold}
                            ></TableCell>
                            <TableCell
                              className={classes.textBold}
                            ></TableCell>
                            <TableCell
                              className={classes.textBold}
                            ></TableCell>
                            <TableCell
                              className={classes.textBold}
                            ></TableCell>
                            <TableCell
                              className={classes.textBold}
                            ></TableCell>

                            <TableCell className={classes.textBold}>
                              {HelperFunc.getTotalOfField(
                                formValues,
                                "gross_wgt"
                              )}
                            </TableCell>
                            <TableCell className={classes.textBold}>
                              {HelperFunc.getTotalOfField(formValues, "net_wgt")}
                            </TableCell>
                            <TableCell
                              className={classes.textBold}
                            ></TableCell>
                            <TableCell
                              className={classes.textBold}
                            ></TableCell>
                            <TableCell
                              className={classes.textBold}
                            ></TableCell>
                            <TableCell className={classes.textBold}>
                              {HelperFunc.getTotalOfField(
                                formValues,
                                "totallabour"
                              )}
                            </TableCell>
                            <TableCell className={classes.textBold}>
                              {HelperFunc.getTotalOfField(formValues, "hallmark")}
                            </TableCell>
                            <TableCell className={classes.textBold}>
                              {HelperFunc.getTotalOfField(
                                formValues,
                                "other_charge"
                              )}
                            </TableCell>
                            <TableCell className={classes.textBold}>
                              {HelperFunc.getTotalOfField(
                                formValues,
                                "stone_charge"
                              )}
                            </TableCell>
                            <TableCell className={classes.textBold}>
                              {HelperFunc.getTotalOfField(
                                formValues,
                                "rohdium_charge"
                              )}
                            </TableCell>
                            <TableCell className={classes.textBold}>
                              {isView ? Config.numWithComma(subtotal) : subtotal}
                            </TableCell>
                            {stateId === 12 ? (
                              <>
                                <TableCell
                                  className={classes.textBold}
                                ></TableCell>
                                <TableCell
                                  className={classes.textBold}
                                ></TableCell>
                                <TableCell className={classes.textBold}>
                                  {isView
                                    ? Config.numWithComma(cgstVal)
                                    : cgstVal}
                                </TableCell>
                                <TableCell className={classes.textBold}>
                                  {isView
                                    ? Config.numWithComma(sgstVal)
                                    : sgstVal}
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell
                                  className={classes.textBold}
                                ></TableCell>
                                <TableCell className={classes.textBold}>
                                  {isView
                                    ? Config.numWithComma(igstVal)
                                    : igstVal}
                                </TableCell>
                              </>
                            )}
                            <TableCell className={classes.textBold}>
                              {isView
                                ? Config.numWithComma(lastTotal)
                                : lastTotal}
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
                    <div style={{ display: "flex", alignItems: "center", width: "35%" }}>
                      <label className="mr-2">Sub Total : </label>
                      <label className="ml-2">{isView ? Config.numWithComma(subtotal) : parseFloat(subtotal).toFixed(3)}</label>
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
                    <div style={{ display: "flex", alignItems: "center", width: "35%", }}>
                      <label className="mr-2">GST : </label>
                      <label className="ml-2">{isView ? Config.numWithComma(totalGst) : parseFloat(totalGst).toFixed(3)}</label>
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
                      style={{ display: "flex", alignItems: "center", width: "35%", }}
                    >
                      <label className="mr-5" style={{}}>
                        Round Off
                      </label>
                      <label className="ml-2 input-sub-total">
                        <TextField
                          name="roundOff"
                          className={clsx(classes.inputBoxTEST, "addconsumble-dv")}
                          type={isView ? "text" : "number"}
                          value={roundOff}
                          variant="outlined"
                          fullWidth
                          disabled
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
                    <div style={{ display: "flex", alignItems: "center", width: "35%", }}>
                      <label className="mr-2">Total Invoice Amount : </label>
                      <label className="ml-2"> {isView ? Config.numWithComma(totalInvoiceAmount) : parseFloat(totalInvoiceAmount).toFixed(3)}</label>
                    </div>
                  </div>
                  <div
                    id="jewellery-head"
                    className="mt-16"
                    style={{
                      borderRadius: "7px",
                      background: "#EBEEFB",
                      fontWeight: "700",
                      justifyContent: "end",
                      display: "flex",
                    }}
                  >
                    <div style={{
                      width: "20%",
                    }}>
                      <label>Final Receivable Amount :</label>
                      <label> {isView ? Config.numWithComma(finalAmount) : !isNaN(finalAmount) ? parseFloat(finalAmount).toFixed(3) : ""} </label>
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
                  {!props.viewPopup && <div>
                    {!isView && <Button
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
                    }
                    <Button
                      variant="contained"
                      style={{ float: "right" }}

                      className="w-224 mx-auto mt-16 mr-16 btn-print-save"
                      aria-label="Register"
                      onClick={checkforPrint}
                    >
                      {isView ? "Print" : "Save & Print"}
                    </Button>
                    < div style={{ display: "none" }}>
                      <SalesB2CPrint ref={componentRef} printObj={printObj} />
                    </div>
                  </div>
                  }
                  <Button
                    variant="contained"
                    className={clsx(classes.button, "mt-16 mr-16 btn-print-save")} onClick={() => setDocModal(true)}>
                    View Documents
                  </Button>
                </div>
              </div>
            </div>
            <ViewDocModal documentList={documentList} handleClose={handleDocModalClose} open={docModal} updateDocument={updateDocumentArray}
              purchase_flag_id={idToBeView?.id} purchase_flag="37" concateDocument={concateDocument} viewPopup={props.viewPopup} />
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
}

export default AddSalesB2C
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Typography,
  TextField,
  Checkbox,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
} from "@material-ui/core";
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
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Icon, IconButton } from "@material-ui/core";
import moment, { defaultFormat } from "moment";
import HelperFunc from "../../Helper/HelperFunc";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import { AddSalesB2CInfoPrintComponent } from "../SalesB2CInfoPrintComponent/SalesB2CInfoPrintComponent";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
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
  textBold: {
    padding: 7,
    textAlign: "center",
    fontWeight: 700,
    fontSize: 14,
    backgroundColor: "#D1D8F5"

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
}));

const AddSalesB2CInfo = (props) => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [isView, setIsView] = useState(false);

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [clientData, setClientData] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedClientErr, setSelectedClientErr] = useState("");
  const [stateId, setStateId] = useState("");

  const [oppositeAccData, setOppositeAccData] = useState([]);
  const [oppositeAccSelected, setOppositeAccSelected] = useState("");
  const [selectedOppAccErr, setSelectedOppAccErr] = useState("");

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");

  const [goldRate, setgoldRate] = useState("");
  const [goldRateErr, setgoldRateErr] = useState("");
  const [actualgoldrate, setActualgoldrate] = useState(false);
  const [goldMaxValue, setgoldMaxValue] = useState(0);
  const [goldMinValue, setgoldMinValue] = useState(0);

  const [packingSlipNo, setPackingSlipNo] = useState("");
  const [packingSlipErr, setPackingSlipErr] = useState("");
  const [packingSearch, setPackingSearch] = useState("");
  const [packingSlipApiData, setPackingSlipApiData] = useState([]);
  const [lotArr, setlotArr] = useState([]);
  const [signature, setSignature] = useState("");

  const [formValues, setFormValues] = useState([
    {
      barcode: "",
      categoryName: "",
      billing_category_name: "",
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
      errors: {},
    },
  ]);

  const [subtotal, setSubtotal] = useState(0);
  const [lastTotal, setLastTotal] = useState(0);
  const [igstVal, setIGSTVal] = useState(0);
  const [cgstVal, setCgSTVal] = useState(0);
  const [sgstVal, setSGSTVal] = useState(0);
  const [totalGst, setTotalGst] = useState(0);
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);

  const [roundOff, setRoundOff] = useState("");
  const [roundOffErr, SetRoundOffErr] = useState("");

  const [finalAmount, setFinalAmount] = useState(0);

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [metalNarration, setMetalNarration] = useState("");
  const [metalNarrationErr, setMetalNarrationErr] = useState("");
  const [narrationFlag, setNarrationFlag] = useState(false);

  const departmentId = localStorage.getItem("SelectedDepartment");

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
    voucherDate: voucherDate,
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
  });

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const [documentList, setDocumentList] = useState([]);
  const [docModal, setDocModal] = useState(false);
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);

  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 38)
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
            dispatch(Actions.showMessage({ message: response.data.message ,variant: "error"}));
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

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);

  const handleAfterPrint = () => {
    //React.useCallback// tslint:disable-line no-console
    //resetting after print
    checkAndReset();
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
      balancePayable: finalAmount,
      signature: signature,
    });
    if (isView) {
      handlePrint();
    } else {
      if (
        !VoucherDtErr &&
        voucherNumValidation() &&
        partyNameValidation() &&
        oppositeAcValidation() &&
        partyVoucherNumValidation() &&
        goldratevalidation() &&
        !goldRateErr &&
        isAnyentryadded() &&
        entryValidation() &&
        validateEmptyError() &&
        !roundOffErr
      ) {
        console.log("innnnnnn");
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
  }, [onBeforeGetContentResolve.current]); //, text

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

  if (props.location) {
    var idToBeView = props.location.state;
  } else if (props.voucherId) {
    var idToBeView = { id: props.voucherId };
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

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
    return () => {
      console.log("cleaned up");
    };
  }, []);

  useEffect(() => {
    setOppositeAccData(HelperFunc.getOppositeAccountDetails("TempSalesB2C"));
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true);
      getConsumePurchaseRecordForView(idToBeView.id);
    } else {
      setNarrationFlag(false);
      getClientdata();
      getTodaysgoldRate();
      getVoucherNumber(); //if view only then no need to get new voucher number, we will set data coming from api
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const roundOffval = roundOff ? roundOff : 0;
    const tempInvoioce = parseFloat(
      parseFloat(subtotal) + parseFloat(totalGst) + parseFloat(roundOffval)
    );
    setTotalInvoiceAmount(parseFloat(tempInvoioce).toFixed(3));
    setFinalAmount(parseFloat(tempInvoioce).toFixed(3));
  }, [roundOff]);

  function getConsumePurchaseRecordForView(id) {
    setLoading(true);
    let api = "";
    if (props.forDeletedVoucher) {
      api = `api/tempSalesB2C/${id}?deleted_at=1`;
    } else {
      api = `api/tempSalesB2C/${id}`;
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
              console.log(finalData);
              setSelectedClient({
                value: finalData?.B2CClient?.id,
                label: finalData?.B2CClient?.name,
                data: finalData?.B2CClient,
              });
              setgoldRate(finalData?.gold_rate);
              setTimeDate(response.data.data.data.created_at);
              setDocumentList(finalData.salesPurchaseDocs);
              setVoucherNumber(finalData.voucher_no);
              setPartyVoucherDate(finalData.party_voucher_date);
              setSignature(finalData.admin_signature);
              setAllowedBackDate(true);
              setVoucherDate(
                moment(finalData.purchase_voucher_create_date).format(
                  "YYYY-MM-DD"
                )
              );
              setOppositeAccSelected({
                value: finalData.opposite_account_id,
                label: finalData.OppositeAccount?.name,
              });
              setPartyVoucherNum(finalData.party_voucher_no);
              setRoundOff(
                finalData.round_off !== null ? finalData.round_off : ""
              );
              setAccNarration(
                finalData.account_narration !== null
                  ? finalData.account_narration
                  : ""
              );
              setMetalNarration(
                finalData.jewellery_narration !== null
                  ? finalData.jewellery_narration
                  : ""
              );
              console.log(finalData.TempSalesB2COrders);
              var state = "";
              if (finalData.TempSalesB2COrders[0].igst) {
                state = 0;
                setStateId(0);
              } else {
                state = 12;
                setStateId(12);
              }
              let tempArray = [];

              for (let item of finalData.TempSalesB2COrders) {
                tempArray.push({
                  barcode: item?.barcode,
                  categoryName: item.ProductCategory.billing_category_name,
                  billing_category_name: item.ProductCategory.billing_category_name,
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
                  errors: {},
                });
              }
              setFormValues(tempArray);
              calCulateTotalcall(
                tempArray,
                finalData.round_off !== null ? finalData.round_off : 0
              );
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
        handleError(error, dispatch, { api: api });
      });
  }

  function getTodaysgoldRate() {
    axios
      .get(Config.getCommonUrl() + "api/goldRateToday")
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
          setgoldRate(goldrateval);
          setActualgoldrate(true);
          setgoldMaxValue(maxValue);
          setgoldMinValue(minValue);
        } else {
          dispatch(
            Actions.showMessage({ message: "Today's Gold Rate is not set" ,variant: "error"})
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/goldRateToday",
        });
      });
  }

  function getVoucherNumber() {
    axios
      .get(Config.getCommonUrl() + "api/tempSalesB2C/get/voucher")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
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
        handleError(error, dispatch, { api: "api/tempSalesB2C/get/voucher" });
      });
  }

  function getPackingSlipData(sData) {
    let api = `api/tempSalesB2C/search/${departmentId}?barcode=${sData}`;
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          if (response.data.data.length > 0) {
            setPackingSlipApiData(response.data.data);
          } else {
            setPackingSlipApiData([]);
            dispatch(
              Actions.showMessage({
                message: "Please Insert Proper BarCode No",variant: "error"
              })
            );
          }
        } else {
          setPackingSlipApiData([]);
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: api,
        });
      });
  }

  const handlePackingSlipSelect = (packingSlipNum) => {
    console.log("innnn", packingSlipNum);
    let filteredArray = packingSlipApiData.filter(
      (item) => item.barcode_name === packingSlipNum
    );
    if (filteredArray.length > 0) {
      setPackingSlipApiData(filteredArray);
      setPackingSlipErr("");
      setPackingSlipNo(packingSlipNum);
      if (!lotArr.includes(filteredArray[0].lot_detail_id)) {
        setlotArr([...lotArr, filteredArray[0].lot_detail_id]);
        getPackingSlipDetails(filteredArray[0].lot_detail_id);
      } else {
        dispatch(
          Actions.showMessage({
            message: "This barcode alredy added",variant: "error"
          })
        );
      }
    } else {
      setPackingSlipNo("");
      setPackingSlipErr("Please Select Proper Barcode");
    }
  };

  function getPackingSlipDetails(packingSlipNum) {
    let api = `api/tempSalesB2C/barcode/${packingSlipNum}/${departmentId}`;
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setPackingSlipApiData([]);
          setPackingSlipNo("");
          setPackingSearch("");
          let temp = response.data.data;
          let gst = temp.ProductCategory.hsn_master.gst;
 
          const oldSlipData = [...formValues];
          const oldTotalData = formValues.length - 1;

          const newTempData = oldSlipData[oldTotalData];
          newTempData.barcode = temp.BarCodeProduct?.barcode;
          newTempData.categoryName = temp.ProductCategory?.category_name;
          newTempData.billing_category_name = temp.ProductCategory?.billing_category_name;    
          newTempData.hsn = temp.ProductCategory?.hsn_master?.hsn_number;
          newTempData.huid = temp?.huid_json;
          newTempData.pcs = temp?.phy_pcs;
          newTempData.gross_wgt = temp?.gross_wgt;
          newTempData.net_wgt = temp?.net_wgt;
          newTempData.purity = temp?.purity;
          newTempData.rate = goldRate;
          newTempData.rateCharge = parseFloat(
            (parseFloat(temp.net_wgt) * parseFloat(goldRate)) / 10
          ).toFixed(3);
          newTempData.hallmark = temp?.total_hallmark_charges;
          newTempData.csgt_per =
            stateId === 12 ? (parseFloat(gst) / 2).toFixed(3) : "";
          newTempData.sgst_per =
            stateId === 12 ? (parseFloat(gst) / 2).toFixed(3) : "";
          newTempData.igst_per =
            stateId !== 12 ? parseFloat(gst).toFixed(3) : "";
          newTempData.lotdetail_id = temp?.id;
          newTempData.barcode_id = temp?.barcode_id;
          newTempData.category_id = temp?.product_category_id;
          newTempData.gst = gst;

          setFormValues(oldSlipData);
          addNewRow();
          calCulateTotalcall(oldSlipData);
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
          api: api,
        });
      });
  }

  const calCulateTotalcall = (arr, addedroundOff) => {
    const sgstamt = HelperFunc.getTotalOfField(arr, "sgst_val");
    const cgstamt = HelperFunc.getTotalOfField(arr, "csgt_val");
    const igstamt = HelperFunc.getTotalOfField(arr, "igst_val");
    const tempSubTotal = HelperFunc.getTotalOfField(arr, "amount");
    const tempTotalAmt = HelperFunc.getTotalOfField(arr, "total_amount");
    const roundOffValue = addedroundOff
      ? addedroundOff
      : roundOff
      ? roundOff
      : 0;
    const totalgstamt =
      parseFloat(isNaN(sgstamt) ? 0 : parseFloat(sgstamt)) +
      (isNaN(cgstamt) ? 0 : parseFloat(cgstamt)) +
      (isNaN(igstamt) ? 0 : parseFloat(igstamt)).toFixed(3);
    const tempInvoiceAmt = parseFloat(
      parseFloat(tempTotalAmt) + parseFloat(roundOffValue)
    ).toFixed(3);

    setSubtotal(isNaN(tempSubTotal) ? 0 : parseFloat(tempSubTotal).toFixed(3));
    setLastTotal(isNaN(tempTotalAmt) ? 0 : parseFloat(tempTotalAmt).toFixed(3));
    setIGSTVal(isNaN(igstamt) ? 0 : parseFloat(igstamt).toFixed(3));
    setCgSTVal(isNaN(cgstamt) ? 0 : parseFloat(cgstamt).toFixed(3));
    setSGSTVal(isNaN(sgstamt) ? 0 : parseFloat(sgstamt).toFixed(3));
    setTotalGst(parseFloat(totalgstamt).toFixed(3));
    setTotalInvoiceAmount(
      isNaN(tempInvoiceAmt) ? 0 : parseFloat(tempInvoiceAmt).toFixed(3)
    );
    setFinalAmount(
      isNaN(tempInvoiceAmt) ? 0 : parseFloat(tempInvoiceAmt).toFixed(3)
    );
  };

  function getClientdata() {
    axios
      .get(Config.getCommonUrl() + "api/btocclient")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setClientData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message ,variant: "error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/btocclient" });
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
    } else if (name === "partyVoucherNum") {
      setPartyVoucherNum(value);
      setPartyVoucherNumErr("");
    } else if (name === "metalNarration") {
      setMetalNarration(value);
      setMetalNarrationErr("");
    }else if (name === "accNarration") {
      setAccNarration(value);
      setAccNarrationErr("");
    }else if (name === "roundOff") {
      setRoundOff(value);
      if (value > 5 || value < -5) {
        SetRoundOffErr("Please Enter value between -5 to 5");
      } else {
        SetRoundOffErr("");
      }
    }  else if (name === "goldRate") {
      setgoldRate(value);
      if(formValues[0].barcode){
        resetForm(true)
      }
      if (actualgoldrate) {
        if (
          parseFloat(value) >= goldMinValue &&
          parseFloat(value) <= goldMaxValue
        ) {
          setgoldRateErr("");
        } else {
          setgoldRateErr(
            `Please, enter today's rate between ${goldMinValue} to ${goldMaxValue}`
          );
        }
      } else {
        setgoldRateErr("Enter Today's gold rate");
      }
    return true;
    }
  }

    function oppositeAcValidation() {
        if (oppositeAccSelected === "") {
            setSelectedOppAccErr("Please Select Opposite Account");
            return false;
        }
        return true;
    }

    function partyVoucherNumValidation() {
        if (partyVoucherNum === "") {
            setPartyVoucherNumErr("Enter Valid Voucher Number");
            return false;
        }
        return true;
    }

    function isAnyentryadded() {
        if (formValues.length === 0 || formValues[0].barcode === "") {
          dispatch(Actions.showMessage({message: "Scan barcode",variant: "error"}));
          return false;
        }
        return true;
    }

    function entryValidation(){
        const oldData = [...formValues];

        oldData.map((item) =>{
        if (item.barcode) {
          if(item.huid === ""){
            item.errors.huid = "Enter HUID"
          }else if(item.rate === ""){
            item.errors.rate = "Enter valid rate"
          }else if(item.labourpergm === ""){
            item.errors.labourpergm = "Enter Labour"
          }else if(item.hallmark === ""){
            item.errors.hallmark = "Enter hallmark"
          }else if(item.other_charge === ""){
            item.errors.other_charge = "Enter other charge"
          }else if(item.stone_charge === ""){
            item.errors.stone_charge = "Enter stone charge"
          }else if(item.rohdium_charge === ""){
            item.errors.rohdium_charge = "Enter rohdium charge"
          }
        }
    })
    setFormValues(oldData)
    return true
  }

  const handleChange = (index, e) => {
    const newFormValues = [...formValues];
    const name = e.target.name;
    const val = e.target.value;
    newFormValues[index][name] = val;
    newFormValues[index].errors[name] = "";

    if (name === "net_wgt" || name === "rate") {
      const tempnetwgt = newFormValues[index].net_wgt;
      const temprate = newFormValues[index].rate;
      const rateErr = newFormValues[index].errors.rate ? true : false;
      const netwgtErr = newFormValues[index].errors.net_wgt ? true : false;

      if (tempnetwgt && !netwgtErr && temprate && !rateErr) {
        newFormValues[index].rateCharge = parseFloat(
          (parseFloat(tempnetwgt) * parseFloat(temprate)) / 10
        ).toFixed(3);
      } else {
        newFormValues[index].rateCharge = "";
      }
    }
    if (name === "labourpergm" || name === "net_wgt") {
      const netwgtt = newFormValues[index].net_wgt;
      const labour = newFormValues[index].labourpergm;
      const neterrData = newFormValues[index].errors.net_wgt ? true : false;
      const labourErr = newFormValues[index].errors.labourpergm ? true : false;

      if (netwgtt && labour && !neterrData && !labourErr) {
        newFormValues[index].totallabour = parseFloat(
          parseFloat(netwgtt) * parseFloat(labour)
        ).toFixed(3);
      } else {
        newFormValues[index].totallabour = "";
      }
    }
    if (
      name === "net_wgt" ||
      name === "labourpergm" ||
      name === "hallmark" ||
      name === "rate" ||
      name === "other_charge" ||
      name === "stone_charge" ||
      name === "rohdium_charge"
    ) {
      const temprate = newFormValues[index].rateCharge
        ? newFormValues[index].rateCharge
        : 0;
      const labour = newFormValues[index].totallabour
        ? newFormValues[index].totallabour
        : 0;
      const hallmark = newFormValues[index].hallmark
        ? newFormValues[index].hallmark
        : 0;
      const other_charge = newFormValues[index].other_charge
        ? newFormValues[index].other_charge
        : 0;
      const stone_charge = newFormValues[index].stone_charge
        ? newFormValues[index].stone_charge
        : 0;
      const rohdium_charge = newFormValues[index].rohdium_charge
        ? newFormValues[index].rohdium_charge
        : 0;
      const hallmarkErr = newFormValues[index].errors.hallmark ? true : false;
      const other_chargeErr = newFormValues[index].errors.other_charge
        ? true
        : false;
      const stone_chargeErr = newFormValues[index].errors.stone_charge
        ? true
        : false;
      const rohdium_chargeErr = newFormValues[index].errors.rohdium_charge
        ? true
        : false;

      if (
        !hallmarkErr &&
        !other_chargeErr &&
        !stone_chargeErr &&
        !rohdium_chargeErr &&
        labour &&
        temprate
      ) {
        newFormValues[index].amount = parseFloat(
          parseFloat(temprate) +
          parseFloat(labour) +
          parseFloat(hallmark) +
          parseFloat(other_charge) +
          parseFloat(stone_charge) +
          parseFloat(rohdium_charge)).toFixed(3);

        if (
          stateId === 12 &&
          newFormValues[index].amount &&
          newFormValues[index].csgt_per &&
          newFormValues[index].sgst_per
        ) {
          const tempAmt = newFormValues[index].amount;
          const csgt_per = newFormValues[index].csgt_per;
          const sgst_per = newFormValues[index].sgst_per;
          const cgstamt = parseFloat(
            (parseFloat(tempAmt) * parseFloat(csgt_per)) / 100
          ).toFixed(3);
          const sgstamt = parseFloat(
            (parseFloat(tempAmt) * parseFloat(sgst_per)) / 100
          ).toFixed(3);
          newFormValues[index].csgt_val = parseFloat(cgstamt).toFixed(3);
          newFormValues[index].sgst_val = parseFloat(sgstamt).toFixed(3);
          newFormValues[index].total_amount = parseFloat(
            parseFloat(tempAmt) + parseFloat(cgstamt) + parseFloat(sgstamt)
          ).toFixed(3);
        } else if (
          stateId !== 12 &&
          newFormValues[index].amount &&
          newFormValues[index].igst_per
        ) {
          console.log("innnnnn");
          const tempAmt = newFormValues[index].amount;
          const igst_per = newFormValues[index].igst_per;
          const igstamt = parseFloat(
            (parseFloat(tempAmt) * parseFloat(igst_per)) / 100
          ).toFixed(3);
          newFormValues[index].igst_val = parseFloat(igstamt).toFixed(3);
          newFormValues[index].total_amount = parseFloat(
            parseFloat(tempAmt) + parseFloat(igstamt)
          ).toFixed(3);
        }
      } else {
        newFormValues[index].amount = "";
        newFormValues[index].csgt_val = "";
        newFormValues[index].sgst_val = "";
        newFormValues[index].igst_val = "";
        newFormValues[index].total_amount = "";
      }
    }
    calCulateTotalcall(newFormValues);
    setFormValues(newFormValues);
  };

  function voucherNumValidation() {
    if (voucherNumber === "") {
      setVoucherNumErr("Enter Valid Voucher Number");
      return false;
    }
    return true;
  }

  function partyNameValidation() {
    if (selectedClient === "") {
      setSelectedClientErr("Please Select Client");
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

  function partyVoucherNumValidation() {
    if (partyVoucherNum === "") {
      setPartyVoucherNumErr("Enter Valid Voucher Number");
      return false;
    }
    return true;
  }

  function isAnyentryadded() {
    if (formValues.length === 0 || formValues[0].barcode === "") {
      dispatch(Actions.showMessage({ message: "Scan barcode",variant: "error" }));
      return false;
    }
    return true;
  }

  function entryValidation() {
    const oldData = [...formValues];

    oldData.map((item) => {
      if (item.barcode) {
        if (item.huid === "") {
          item.errors.huid = "Enter HUID";
        }else if (item.rate === "") {
          item.errors.rate = "Enter valid rate";
        } else if (item.labourpergm === "") {
          item.errors.labourpergm = "Enter Labour";
        } else if (item.hallmark === "") {
          item.errors.hallmark = "Enter hallmark";
        } else if (item.other_charge === "") {
          item.errors.other_charge = "Enter other charge";
        } else if (item.stone_charge === "") {
          item.errors.stone_charge = "Enter stone charge";
        } else if (item.rohdium_charge === "") {
          item.errors.rohdium_charge = "Enter rohdium charge";
        }
      }
    });
    setFormValues(oldData);
    return true;
  }

  const validateEmptyError = () => {
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

  const goldratevalidation = () => {
    if (!actualgoldrate) {
      dispatch(Actions.showMessage({ message: "Enter Today's gold rate",variant: "error" }));
      return false;
    }
    return true;
  };

  function handleFormSubmit(ev) {
    ev.preventDefault();
    if (
      !VoucherDtErr &&
      voucherNumValidation() &&
      partyNameValidation() &&
      oppositeAcValidation() &&
      partyVoucherNumValidation() &&
      goldratevalidation() &&
      !goldRateErr &&
      isAnyentryadded() &&
      entryValidation() &&
      validateEmptyError() &&
      !roundOffErr
    ) {
      addB2CSales(true, false);
    }
  }

  const concateDocument = (newData) => {
    setDocumentList((documentList) => [...documentList, ...newData]);
  };

  const handleDocModalClose = () => {
    setDocModal(false);
  };

  const handleNarrationClick = () => {
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        flag: 38,
        id: idToBeView.id,
        jewellery_narration: metalNarration,
        account_narration: accNarration,
      };
      UpdateNarration(body)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            dispatch(Actions.showMessage({ message: response.data.message,variant: "success" }));
            setLoading(false);
          } else {
            setLoading(false);
            dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
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

  function addB2CSales(resetFlag, toBePrint) {
    setLoading(true);
    const Orders = [];
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
        });
      }
    });
    const body = {
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
      setRate: goldRate,
    };
    console.log(body);
    axios
      .post(
        Config.getCommonUrl() + "api/tempSalesB2C/createFromPackingSlip",
        body
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "success" }));
          setLoading(false);
          if (resetFlag === true) {
            checkAndReset();
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record
            handlePrint();
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/tempSalesB2C/createFromPackingSlip",
          body: body,
        });
      });
  }

  const updateDocumentArray = (id) => {
    let tempDocList = [...documentList];
    const arr = tempDocList.filter((x) => x.id !== id);
    setDocumentList(arr);
  };

  function resetForm(rateOnly) {
    if(!rateOnly){
      setSelectedClient("");
      setSelectedClientErr("");
      setStateId("");
      setOppositeAccSelected("");
      setSelectedOppAccErr("");
      setPartyVoucherNum("");
      setPartyVoucherNumErr("");
      setPartyVoucherDate("");
    }
    setSubtotal(0);
    setLastTotal(0);
    setIGSTVal(0);
    setCgSTVal(0);
    setSGSTVal(0);
    setTotalGst(0);
    setTotalInvoiceAmount(0);
    setRoundOff("");
    SetRoundOffErr("");
    setFinalAmount(0);
    setAccNarration("");
    setAccNarrationErr("");
    setMetalNarration("");
    setMetalNarrationErr("");
    setNarrationFlag(false);
    setlotArr([])
    setFormValues([
      {
        barcode: "",
        categoryName: "",
        billing_category_name: "",
        hsn: "",
        huid: "",
        pcs: "",
        gross_wgt: "",
        net_wgt: "",
        purity: "",
        rate: "",
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
        errors: {},
      },
    ]);
  }

  function handleClientPartyChange(value) {
    resetForm(false);
    setSelectedClient(value);
    setSelectedClientErr("");
    setStateId(value.data.state);
  }

  function handleOppAccChange(value) {
    setOppositeAccSelected(value);
    setSelectedOppAccErr("");
  }

  const addNewRow = () => {
    setFormValues([
      ...formValues,
      {
        barcode: "",
        categoryName: "",
        billing_category_name: "",
        hsn: "",
        huid: "",
        pcs: "",
        gross_wgt: "",
        net_wgt: "",
        purity: "",
        rate: "",
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
        errors: {},
      },
    ]);
  };

  const deleteHandler = (index, id) => {
    const oldData = [...formValues];

    if (oldData[index + 1]) {
      const newData = oldData.filter((item, i) => {
        if (i !== index) return item;
        return false;
      });
      setFormValues(newData);
      calCulateTotalcall(newData);
    } else {
      oldData[index].barcode = "";
      oldData[index].categoryName = "";
      oldData[index].billing_category_name = "";
      oldData[index].hsn = "";
      oldData[index].huid = "";
      oldData[index].pcs = "";
      oldData[index].gross_wgt = "";
      oldData[index].net_wgt = "";
      oldData[index].purity = "";
      oldData[index].rate = "";
      oldData[index].rateCharge = "";
      oldData[index].labourpergm = "";
      oldData[index].totallabour = "";
      oldData[index].hallmark = "";
      oldData[index].other_charge = "";
      oldData[index].stone_charge = "";
      oldData[index].rohdium_charge = "";
      oldData[index].amount = "";
      oldData[index].csgt_per = "";
      oldData[index].sgst_per = "";
      oldData[index].igst_per = "";
      oldData[index].csgt_val = "";
      oldData[index].sgst_val = "";
      oldData[index].igst_val = "";
      oldData[index].total_amount = "";
      oldData[index].lotdetail_id = "";
      oldData[index].barcode_id = "";
      oldData[index].category_id = "";
      oldData[index].gst = "";
      oldData[index].errors = {};
      calCulateTotalcall(oldData);
      setlotArr([]);
      setFormValues(oldData);
    }
    const newLotArrs = lotArr.filter((temp) => {
      return temp !== id;
    });
    setlotArr(newLotArrs);
  };

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
                alignItems="center"
                style={{ margin: 0 }}

              >
                <Grid item xs={7} sm={7} md={7} key="1" style={{ padding: 0 }}>
                  <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                      {isView ? "View Sales B2C Info" : "Add Sales B2C Info"}
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
                  style={{ textAlign: "right"}}
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
            )}
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
                      <p style={{ paddingBottom: "3px" }}>Party Name</p>
                      <Select
                        className="view_consumablepurchase_dv"
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={clientData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                          data: suggestion,
                        }))}
                        autoFocus
                        value={selectedClient}
                        onChange={handleClientPartyChange}
                        placeholder="Party Name"
                        isDisabled={isView}
                      />

                      <span style={{ color: "red" }}>
                        {selectedClientErr.length > 0 ? selectedClientErr : ""}
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
                      <p style={{ paddingBottom: "3px" }}>Opposite Account</p>
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
                        <p style={{ paddingBottom: "3px" }}>Party Voucher Number</p>
                      <TextField
                        className="mb-16"
                        name="partyVoucherNum"
                        value={partyVoucherNum}
                        error={partyVoucherNumErr ? true : false}
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
                      <p style={{ paddingBottom: "3px" }}>Party Voucher Date</p>
                      <TextField
                        type="date"
                        className="mb-16"
                        name="partyVoucherDate"
                        value={partyVoucherDate}
                        onChange={(e) => setPartyVoucherDate(e.target.value)}
                        variant="outlined"
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

                    {!isView && (
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p style={{ paddingBottom: "3px" }}>Upload Documents</p>
                        <TextField
                          className="mb-16 uploadDoc"
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
                      <p style={{ paddingBottom: "3px" }}>Today's Gold Rate</p>
                      <TextField
                        className="mb-16"
                        name="goldRate"
                        value={goldRate}
                        error={goldRateErr.length > 0 ? true : false}
                        helperText={goldRateErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </Grid>

                    <Grid
                      className="packing-slip-input"
                      item
                      lg={2}
                      md={4}
                      sm={4}
                      xs={12}
                      style={{ padding: 6 }}
                    >
                      <p style={{ paddingBottom: "3px" }}>Barcode No</p>
                      <Autocomplete
                        id="free-solo-demo"
                        freeSolo
                        disableClearable
                        onChange={(event, newValue) => {
                          console.log(newValue);
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
                          (option) => option.barcode_name
                        )}
                        disabled={isView || selectedClient === ""}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            style={{ padding: 0 }}
                            placeholder="Barcode No"
                          />
                        )}
                      />
                      <span style={{ color: "red" }}>
                        {packingSlipErr.length > 0 ? packingSlipErr : ""}
                      </span>
                    </Grid>
                  </Grid>

                  <Paper className={classes.tabroot} style={{marginBottom: 16,border: "1px solid #D1D8F5",borderRadius: "7px",}}>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          {
                            !isView &&   <TableCell
                            className={classes.tableRowPad}
                            width="40px"
                            align="center"
                          ></TableCell>
                          }
                          <TableCell className={classes.tableRowPad} style={{width: "107px"}}>
                            Barcode
                          </TableCell>
                          <TableCell className={classes.tableRowPad} style={{minWidth: "110px"}}>
                            Category
                          </TableCell> 
                          <TableCell className={classes.tableRowPad} style={{minWidth: "110px"}}>
                            Billing Category
                          </TableCell>
                          <TableCell className={classes.tableRowPad} style={{minWidth: "100px"}}>
                            HSN
                          </TableCell>
                          <TableCell className={classes.tableRowPad} style={{minWidth: "80px"}}>
                            HUID
                          </TableCell>
                          <TableCell className={classes.tableRowPad} style={{minWidth: "50px"}}>
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
                          <TableCell className={classes.tableRowPad} style={{minWidth: "80px"}}>
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
                          <TableCell className={classes.tableRowPad} style={{minWidth: "130px"}}>
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
                          <TableCell className={classes.tableRowPad} style={{minWidth: "130px"}}>
                            Total
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formValues.map((element, index) => (
                          <TableRow key={index}>
                            {
                              !isView && <TableCell
                              className={classes.tablePad}
                              width="40px"
                              style={{textAlign: "center", border: "1px solid #e6e6e6"}}
                            >
                                <IconButton
                                  tabIndex="-1"
                                  style={{ padding: "0" }}
                                  disabled={element.barcode === ""}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    deleteHandler(index, element.lotdetail_id);
                                  }}
                                >
                                  <Icon className="" style={{ color: "red" }}>
                                    delete
                                  </Icon>
                                </IconButton>
                            </TableCell>
                            }
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
                                name="billing_category_name"
                                value={element.billing_category_name || ""}
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
                                className={classes.inputBoxTEST}
                                value={element.huid || ""}
                                error={element.errors.huid ? true : false}
                                helperText={
                                  element.errors.huid
                                    ? element.errors.huid
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled={isView || element.barcode === ""}
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
                                value={
                                  isView
                                    ? Config.numWithComma(element.rate)
                                    : element.rate || ""
                                }
                                error={element.errors.rate ? true : false}
                                helperText={
                                  element.errors.rate ? element.errors.rate : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled={isView || element.barcode === ""}
                              />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                              <TextField
                                name="labourpergm"
                                className={classes.inputBoxTEST}
                                type={isView ? "text" : "number"}
                                value={
                                  isView
                                    ? Config.numWithComma(element.labourpergm)
                                    : element.labourpergm || ""
                                }
                                error={
                                  element.errors.labourpergm ? true : false
                                }
                                helperText={
                                  element.errors.labourpergm
                                    ? element.errors.labourpergm
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled={isView || element.barcode === ""}
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
                                value={
                                  isView
                                    ? Config.numWithComma(element.hallmark)
                                    : element.hallmark || ""
                                }
                                error={element.errors.hallmark ? true : false}
                                helperText={
                                  element.errors.hallmark
                                    ? element.errors.hallmark
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled={isView || element.barcode === ""}
                              />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                              <TextField
                                name="other_charge"
                                className={classes.inputBoxTEST}
                                type={isView ? "text" : "number"}
                                value={
                                  isView
                                    ? Config.numWithComma(element.other_charge)
                                    : element.other_charge || ""
                                }
                                error={
                                  element.errors.other_charge ? true : false
                                }
                                helperText={
                                  element.errors.other_charge
                                    ? element.errors.other_charge
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled={isView || element.barcode === ""}
                              />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                              <TextField
                                name="stone_charge"
                                className={classes.inputBoxTEST}
                                type={isView ? "text" : "number"}
                                value={
                                  isView
                                    ? Config.numWithComma(element.stone_charge)
                                    : element.stone_charge || ""
                                }
                                error={
                                  element.errors.stone_charge ? true : false
                                }
                                helperText={
                                  element.errors.stone_charge
                                    ? element.errors.stone_charge
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled={isView || element.barcode === ""}
                              />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                              <TextField
                                name="rohdium_charge"
                                className={classes.inputBoxTEST}
                                type={isView ? "text" : "number"}
                                value={
                                  isView
                                    ? Config.numWithComma(
                                        element.rohdium_charge
                                      )
                                    : element.rohdium_charge || ""
                                }
                                error={
                                  element.errors.rohdium_charge ? true : false
                                }
                                helperText={
                                  element.errors.rohdium_charge
                                    ? element.errors.rohdium_charge
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled={isView || element.barcode === ""}
                              />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                              <TextField
                                name="amount"
                                className={classes.inputBoxTEST}
                                type={isView ? "text" : "number"}
                                value={
                                  isView
                                    ? Config.numWithComma(element.amount)
                                    : element.amount || ""
                                }
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
                          {
                            !isView &&  <TableCell className={classes.textBold}>
                            <div
                              id="castum-width-table"
                              className={clsx(
                                classes.tableheader,
                                "delete_icons_dv"
                              )}
                            ></div>
                        </TableCell>
                          }
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
                  <div style={{ display: "flex", alignItems: "center" ,width: "35%"}}>
                    <label className="mr-2">Sub Total : </label>
                    <label className="ml-2">
                      {isView
                        ? Config.numWithComma(subtotal)
                        : parseFloat(subtotal).toFixed(3)}
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
                  <div style={{ display: "flex", alignItems: "center",width: "35%", }}>
                    <label className="mr-2">GST : </label>
                    <label className="ml-2">
                      {isView
                        ? Config.numWithComma(totalGst)
                        : parseFloat(totalGst).toFixed(3)}
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
                  <div style={{ display: "flex", alignItems: "center",width: "35%" }}>
                    <label className="mr-5" style={{}}>
                      Round Off
                    </label>
                    <label className="ml-2 input-sub-total">
                      <TextField
                        name="roundOff"
                        className={clsx(
                          classes.inputBoxTEST,
                          "addconsumble-dv"
                        )}
                        type={isView ? "text" : "number"}
                        value={roundOff}
                        error={roundOffErr ? true : false}
                        helperText={roundOffErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                        disabled={isView || subtotal === 0}
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
                  <div style={{ display: "flex", alignItems: "center" ,width: "35%",}}>
                    <label className="mr-2">Total Invoice Amount : </label>
                    <label className="ml-2">
                      {" "}
                      {isView
                        ? Config.numWithComma(totalInvoiceAmount)
                        : parseFloat(totalInvoiceAmount).toFixed(3)}
                    </label>
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
                    <label>
                      {" "}
                      {isView
                        ? Config.numWithComma(finalAmount)
                        : !isNaN(finalAmount)
                        ? parseFloat(finalAmount).toFixed(3)
                        : ""}{" "}
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
                      <p style={{ paddingBottom: "3px" }}>Jewellery Narration</p>
                      <TextField
                        className="mt-1"
                        placeholder="Jewellery Narration"
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
                      style={{ float: "right", }}
                      className="w-224 mx-auto mt-16 mr-16 btn-print-save"
                      aria-label="Register"
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
                        {!narrationFlag ? "Save Narration" : "Update Narration"}
                      </Button>
                    )}
                    <div style={{ display: "none" }}>
                      <AddSalesB2CInfoPrintComponent
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
              purchase_flag="38"
              concateDocument={concateDocument}
              viewPopup={props.viewPopup}
            />
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddSalesB2CInfo;

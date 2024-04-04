import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@material-ui/core";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Icon, IconButton } from "@material-ui/core";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import Select, { createFilter } from "react-select";
import Loader from "app/main/Loader/Loader";
import History from "@history";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import { RawMaterialPurPrintComp } from "./PrintComponent/RawMaterialPurPrintComp";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
import { UpdateNarration } from "../../Helper/UpdateNarration";
import HelperFunc from "../../Helper/HelperFunc";
import Icones from "assets/fornt-icons/Mainicons";

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
  form: {
    marginTop: "3%",
    display: "contents",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
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
  selectBox: {
    // marginTop: 8,
    // padding: 8,
    // fontSize: "12pt",
    marginLeft: "0.5rem",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "10%",
    display: "inline-block",
    // marginLeft: 15,
  },
  tableheader: {
    display: "inline-block",
    textAlign: "center",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
  },
}));

const AddRawMaterialPurchase = (props) => {
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
    quantity: "",
    orderDetails: [],
    taxableAmount: "",
    sGstTot: "",
    cGstTot: "",
    iGstTot: "",
    roundOff: "",
    totalInvoiceAmt: "",
    TDSTCSVoucherNum: "",
    ledgerName: "",
    taxAmount: "",
    metNarration: "",
    accNarration: "",
    balancePayable: "",
  });
  const onBeforeGetContentResolve = React.useRef(null);

  const handleAfterPrint = () => {
    //React.useCallback
    //resetting after print
    checkAndReset();
  };

  function checkAndReset() {
    if (isView === false) {
      History.goBack();
    }
  }

  const handleBeforePrint = React.useCallback(() => {
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
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
    documentTitle: "Raw_Material_Purchase_Voucher_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });

  function checkforPrint() {
    if (
      voucherNumValidation() &&
      partyNameValidation() &&
      oppositeAcValidation() &&
      partyVoucherNumValidation() &&
      partyVoucherDateValidation() &&
      checkAmount()
    ) {
      console.log("if");
      if (isView) {
        handlePrint();
      } else {
        if (prevContactIsValid() && handleDateBlur()) {
          addConsumablePurchase(false, true);
        } else {
          console.log("prevContactIsValid else");
        }
      }
    } else {
      console.log("else");
    }
  }

  const [documentList, setDocumentList] = useState([]);
  const [docModal, setDocModal] = useState(false);
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);

  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 6)
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

  React.useEffect(() => {
    if (
      // text === "New, Updated Text!" &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      onBeforeGetContentResolve.current();
    }
    //eslint-disable-next-line
  }, [onBeforeGetContentResolve.current]); //, text

  const dispatch = useDispatch();
  const SelectRef = useRef(null);

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [loading, setLoading] = useState(false);

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

  const [oppositeAccData, setOppositeAccData] = useState([]);
  const [oppositeAccSelected, setOppositeAccSelected] = useState("");
  const [selectedOppAccErr, setSelectedOppAccErr] = useState("");

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");
  const [partyVoucherDateErr, setpartyVoucherDateErr] = useState("");

  const [unitData, setUnitData] = useState([]);

  const [selectedLoad, setSelectedLoad] = useState("");
  const [selectedLoadErr, setSelectedLoadErr] = useState("");

  const [stockCodeStone, setStockCodeStone] = useState([]);
  const [stockCodeSilver, setStockCodeSilver] = useState([]);

  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");
  const [address, setAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [supstateName, setSupState] = useState("");
  const [supCountryName, setSupCountry] = useState("");
  const [vendorStateId, setVendorStateId] = useState("");

  //below table total val field
  const [amount, setAmount] = useState("");
  const [cgstVal, setCgstVal] = useState("");
  const [sgstVal, setSgstVal] = useState("");
  const [igstVal, setIgstVal] = useState("");
  const [total, setTotal] = useState("");

  const [totalGST, setTotalGST] = useState("");
  const [is_tds_tcs, setIs_tds_tcs] = useState("");
  // const [totalGrossWeight, setTotalGrossWeight] = useState("");
  const [subTotal, setSubTotal] = useState("");

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

  const [metalNarration, setMetalNarration] = useState("");
  const [metalNarrationErr, setMetalNarrationErr] = useState("");
  const [narrationFlag, setNarrationFlag] = useState(false);

  const theme = useTheme();
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

  const [formValues, setFormValues] = useState([
    {
      loadType: "",
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      unitOfPurchaseId: "",
      unitOfPurchase: "",
      unitOfPurchaseWQ: "",
      lastRate: "",
      quantity: "",
      weight: "",
      ratePerUnit: "",
      Amount: "",
      CGSTPer: "",
      SGSTPer: "",
      IGSTPer: "",
      CGSTval: "",
      SGSTval: "",
      IGSTVal: "",
      Total: "",
      errors: {
        stockCode: null,
        categoryName: null,
        selectedHsn: null,
        // grossWeight: null,
        unitOfPurchaseId: null,
        unitOfPurchase: null,
        unitOfPurchaseWQ: null,
        lastRate: null,
        quantity: null,
        weight: null,
        ratePerUnit: null,
        Amount: null,
        CGSTPer: null,
        SGSTPer: null,
        IGSTPer: null,
        CGSTval: null,
        SGSTval: null,
        IGSTVal: null,
        Total: null,
      },
    },
    {
      loadType: "",
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      unitOfPurchaseId: "",
      unitOfPurchase: "",
      unitOfPurchaseWQ: "",
      lastRate: "",
      quantity: "",
      weight: "",
      ratePerUnit: "",
      Amount: "",
      CGSTPer: "",
      SGSTPer: "",
      IGSTPer: "",
      CGSTval: "",
      SGSTval: "",
      IGSTVal: "",
      Total: "",
      errors: {
        stockCode: null,
        categoryName: null,
        selectedHsn: null,
        unitOfPurchaseId: null,
        unitOfPurchase: null,
        unitOfPurchaseWQ: null,
        lastRate: null,
        quantity: null,
        weight: null,
        ratePerUnit: null,
        Amount: null,
        CGSTPer: null,
        SGSTPer: null,
        IGSTPer: null,
        CGSTval: null,
        SGSTval: null,
        IGSTVal: null,
        Total: null,
      },
    },
    {
      loadType: "",
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      unitOfPurchaseId: "",
      unitOfPurchase: "",
      unitOfPurchaseWQ: "",
      lastRate: "",
      quantity: "",
      weight: "",
      ratePerUnit: "",
      Amount: "",
      CGSTPer: "",
      SGSTPer: "",
      IGSTPer: "",
      CGSTval: "",
      SGSTval: "",
      IGSTVal: "",
      Total: "",
      errors: {
        stockCode: null,
        categoryName: null,
        selectedHsn: null,
        unitOfPurchaseId: null,
        unitOfPurchase: null,
        unitOfPurchaseWQ: null,
        lastRate: null,
        quantity: null,
        weight: null,
        ratePerUnit: null,
        Amount: null,
        CGSTPer: null,
        SGSTPer: null,
        IGSTPer: null,
        CGSTval: null,
        SGSTval: null,
        IGSTVal: null,
        Total: null,
      },
    },
    {
      loadType: "",
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      unitOfPurchaseId: "",
      unitOfPurchase: "",
      unitOfPurchaseWQ: "",
      lastRate: "",
      quantity: "",
      weight: "",
      ratePerUnit: "",
      Amount: "",
      CGSTPer: "",
      SGSTPer: "",
      IGSTPer: "",
      CGSTval: "",
      SGSTval: "",
      IGSTVal: "",
      Total: "",
      errors: {
        stockCode: null,
        categoryName: null,
        selectedHsn: null,
        unitOfPurchaseId: null,
        unitOfPurchase: null,
        unitOfPurchaseWQ: null,
        lastRate: null,
        quantity: null,
        weight: null,
        ratePerUnit: null,
        Amount: null,
        CGSTPer: null,
        SGSTPer: null,
        IGSTPer: null,
        CGSTval: null,
        SGSTval: null,
        IGSTVal: null,
        Total: null,
      },
    },
  ]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  const inputRef = useRef([]);

  let handleSilverStockChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i].stockCode = {
      value: e.value,
      label: e.label,
    };
    newFormValues[i].errors.stockCode = null;

    let findIndex = stockCodeSilver.findIndex(
      (item) => item.stock_name_code.id === e.value
    );
    // console.log(findIndex, vendorStateId);
    if (findIndex > -1) {
      newFormValues[i].categoryName = stockCodeSilver[findIndex].billing_name;
      newFormValues[i].errors.categoryName = null;

      newFormValues[i].selectedHsn =
        stockCodeSilver[findIndex].hsn_master.hsn_number;

      if (vendorStateId === 12) {
        newFormValues[i].CGSTPer =
          parseFloat(stockCodeSilver[findIndex].hsn_master.gst) / 2;
        newFormValues[i].SGSTPer =
          parseFloat(stockCodeSilver[findIndex].hsn_master.gst) / 2;
      } else {
        // console.log("else", stockCodeSilver[findIndex].hsn_master.gst);
        newFormValues[i].IGSTPer = parseFloat(
          stockCodeSilver[findIndex].hsn_master.gst
        );
      }

      getLastPrice(selectedVendor.value, e.value, newFormValues, i);
    }

    if (selectedLoad === "1") {
      unitRef.current[i].focus();
    } else {
      inputRef.current[i].focus();
    }
  };

  let handleStockGroupChange = (i, e) => {
    console.log(e);
    let newFormValues = [...formValues];
    newFormValues[i].stockCode = {
      value: e.value,
      label: e.label,
    };
    newFormValues[i].stockWeight = e.element.stock_name_code?.weight;
    newFormValues[i].errors.stockCode = null;

    let findIndex = stockCodeStone.findIndex(
      (item) => item.stock_name_code.id === e.value
    );
    console.log(stockCodeStone[findIndex], vendorStateId);
    if (findIndex > -1) {
      newFormValues[i].unitOfPurchase =
        stockCodeStone[findIndex].stock_name_code?.unitName?.unit_name;
      newFormValues[i].unitOfPurchaseId =
        stockCodeStone[findIndex].stock_name_code?.unitName?.id;
      newFormValues[i].unitOfPurchaseWQ =
        stockCodeStone[findIndex].stock_name_code?.unitName
          ?.weight_or_quantity === 1
          ? "Weight"
          : stockCodeStone[findIndex].stock_name_code?.unitName
              ?.weight_or_quantity === 2 && "Quantity";
      newFormValues[i].categoryName = stockCodeStone[findIndex].billing_name;
      newFormValues[i].errors.categoryName = null;

      newFormValues[i].selectedHsn =
        stockCodeStone[findIndex].hsn_master.hsn_number;

      if (vendorStateId === 12) {
        newFormValues[i].CGSTPer =
          parseFloat(stockCodeStone[findIndex].hsn_master.gst) / 2;
        newFormValues[i].SGSTPer =
          parseFloat(stockCodeStone[findIndex].hsn_master.gst) / 2;
      } else {
        // console.log("else", stockCodeStone[findIndex].hsn_master.gst);
        newFormValues[i].IGSTPer = parseFloat(
          stockCodeStone[findIndex].hsn_master.gst
        );
      }

      getLastPrice(selectedVendor.value, e.value, newFormValues, i);
    }

    if (selectedLoad === "1") {
      unitRef.current[i].focus();
    } else {
      inputRef.current[i].focus();
    }
  };
  const vendorClientArr = [
    { id: 1, name: "Vendor" },
    { id: 2, name: "Client" },
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

  const unitRef = useRef([]);

  useEffect(() => {
    getUnitData();
    setOppositeAccData(
      HelperFunc.getOppositeAccountDetails("RawMaterialPurchase")
    );

    // getDepartmentData();
    // getProductCategories();

    console.log("idToBeView", idToBeView);
    if (idToBeView !== undefined) {
      setNarrationFlag(true);
      setIsView(true);
      getRawMatPurchRecordForView(idToBeView.id);
    } else {
      setNarrationFlag(false);
      getStockCodeStone();
      getStockCodeSilver();
      getVoucherNumber(); //if view only then no need to get new voucher number, we will set data coming from api
    }
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
      if (rateValue && is_tds_tcs == 2) {
        calculateWhenLedgerChange();
      }
    }
  }, [rateValue, ledgerName]);

  function calculateWhenLedgerChange() {
    let tempLedgerAmount = 0;
    let tempfinalAmount = 0;
    //1 is tcs, 2 means tds
    if (is_tds_tcs == 1) {
      //if tcs then enter amount manually
      tempLedgerAmount = 0;

      tempfinalAmount = parseFloat(
        parseFloat(totalInvoiceAmount) + parseFloat(tempLedgerAmount)
      ).toFixed(3);
    } else if (is_tds_tcs == 2) {
      //tds
      tempLedgerAmount = parseFloat(
        (parseFloat(subTotal) * rateValue) / 100
      ).toFixed(3); //calculating before gst, on total amount only
      console.log(tempLedgerAmount);
      tempfinalAmount = parseFloat(
        parseFloat(totalInvoiceAmount) - parseFloat(tempLedgerAmount)
      ).toFixed(3);
    } else {
      tempfinalAmount = parseFloat(totalInvoiceAmount).toFixed(3);
    }

    setLegderAmount(tempLedgerAmount);

    setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));

    setPrintObj({
      ...printObj,
      taxableAmount: parseFloat(subTotal).toFixed(3),
      totalInvoiceAmt: totalInvoiceAmount,
      taxAmount: tempLedgerAmount,
      balancePayable: parseFloat(tempfinalAmount).toFixed(3),
      TDSTCSVoucherNum: tdsTcsVou,
      ledgerName: ledgerName.label,
    });
  }

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

  function getRawMatPurchRecordForView(id) {
    setLoading(true);
    let api = "";
    if (props.forDeletedVoucher) {
      api = `api/rawMaterialPurchase/${id}?deleted_at=1`;
    } else {
      api = `api/rawMaterialPurchase/${id}`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response);
        setTimeDate(response.data.data.created_at);

        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              let finalData = response.data.data;
              // let finalData = response.data.data[0];

              if (finalData.is_vendor_client === 1) {
                setVendorClient({ value: 1, label: "Vendor" });
                var mainObj = finalData.Vendor;
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

              setVoucherNumber(finalData.voucher_no);
              setPartyVoucherDate(finalData.party_voucher_date);
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
              setMetalNarration(
                finalData.rawmaterial_narration !== null
                  ? finalData.rawmaterial_narration
                  : ""
              );

              if (
                finalData.RawMaterialPurchaseOrder[0].raw_material_type ===
                "Alloy Silver and Brass"
              ) {
                setSelectedLoad("2");
              } else {
                setSelectedLoad("1");
              }
              let tempArray = [];
              // console.log(OrdersData);
              for (let item of finalData.RawMaterialPurchaseOrder) {
                // console.log(item);
                tempArray.push({
                  loadType: "",
                  stockCode: {
                    value: item.StockNameCode.id,
                    label: item.StockNameCode.stock_code,
                  },
                  categoryName: item.stock_name,
                  selectedHsn: item.hsn_number ? item.hsn_number : "",
                  unitOfPurchase: item.unit_of_purchase,
                  lastRate:
                    item.last_rate === null
                      ? ""
                      : parseFloat(item.last_rate).toFixed(3),
                  quantity: item.quantity,
                  weight: parseFloat(item.weight).toFixed(3),
                  ratePerUnit: parseFloat(item.rate).toFixed(3),
                  Amount: parseFloat(item.amount).toFixed(3),
                  CGSTPer: item.cgst,
                  SGSTPer: item.sgst,
                  IGSTPer: item.igst,
                  CGSTval:
                    item.cgst !== null
                      ? parseFloat(
                          (parseFloat(item.amount) * parseFloat(item.cgst)) /
                            100
                        ).toFixed(3)
                      : "",
                  SGSTval:
                    item.sgst !== null
                      ? parseFloat(
                          (parseFloat(item.amount) * parseFloat(item.sgst)) /
                            100
                        ).toFixed(3)
                      : "",
                  IGSTVal:
                    item.igst !== null
                      ? parseFloat(
                          (parseFloat(item.amount) * parseFloat(item.igst)) /
                            100
                        ).toFixed(3)
                      : "",
                  Total: parseFloat(item.total).toFixed(3),
                  errors: {
                    stockCode: null,
                    categoryName: null,
                    selectedHsn: null,
                    unitOfPurchase: null,
                    lastRate: null,
                    quantity: null,
                    weight: null,
                    ratePerUnit: null,
                    Amount: null,
                    CGSTPer: null,
                    SGSTPer: null,
                    IGSTPer: null,
                    CGSTval: null,
                    SGSTval: null,
                    IGSTVal: null,
                    Total: null,
                  },
                });
              }
              setFormValues(tempArray);

              function amount(item) {
                // console.log(item.amount)
                return item.Amount;
              }

              function CGSTval(item) {
                return item.CGSTval;
              }

              function SGSTval(item) {
                return item.SGSTval;
              }

              function IGSTVal(item) {
                return item.IGSTVal;
              }

              function Total(item) {
                return item.Total;
              }

              let tempAmount = tempArray
                .filter((item) => item.Amount !== "")
                .map(amount)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);

              setAmount(parseFloat(tempAmount).toFixed(3));
              setSubTotal(parseFloat(tempAmount).toFixed(3));

              let tempCgstVal = tempArray
                .filter((item) => item.CGSTval !== "")
                .map(CGSTval)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
              setCgstVal(parseFloat(tempCgstVal).toFixed(3));

              let tempSgstVal = tempArray
                .filter((item) => item.SGSTval !== "")
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
                .filter((item) => item.Total !== "")
                .map(Total)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setTotal(parseFloat(tempTotal).toFixed(3));

              //   let tempNetWtTot = tempArray
              //   .filter((data) => data.netWeight !== "")
              //   .map(netWeight)
              //   .reduce(function (a, b) {
              //     // sum all resulting numbers
              //     return parseFloat(a) + parseFloat(b);
              //   }, 0)

              // setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));
              setPrintObj({
                ...printObj,
                is_tds_tcs: mainObj.is_tds_tcs,
                stateId: mainObj.state,
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
                Total: total,
                sGstTot: tempSgstVal ? parseFloat(tempSgstVal).toFixed(3) : "",
                cGstTot: tempCgstVal ? parseFloat(tempCgstVal).toFixed(3) : "",
                iGstTot: tempIgstVal ? parseFloat(tempIgstVal).toFixed(3) : "",
                roundOff:
                  finalData.round_off === null ? "0" : finalData.round_off,
                totalInvoiceAmt: parseFloat(
                  finalData.total_invoice_amount
                ).toFixed(3),
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
                metNarration:
                  finalData.rawmaterial_narration !== null
                    ? finalData.rawmaterial_narration
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

  function getStockCodeSilver() {
    axios
      .get(Config.getCommonUrl() + "api/stockname/silver")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempStockData = response.data.data;
          let tempdata = tempStockData.filter(
            (element) => element.stock_name_code !== null
          );
          // .map((x) => {
          //   return {
          //     stock_name_code_id: x.stockCode.value,
          //     unit_of_purchase: x.unitOfPurchase,
          //     quantity: x.quantity,
          //     rate: x.ratePerUnit,
          //   };
          // });
          // console.log(tempdata)
          setStockCodeSilver(tempdata);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/stockname/silver" });
      });
  }

  function getStockCodeStone() {
    axios
      .get(Config.getCommonUrl() + "api/stockname/stone")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempStockData = response.data.data;
          let tempdata = tempStockData.filter(
            (element) => element.stock_name_code !== null
          );
          // .map((x) => {
          //   return {
          //     stock_name_code_id: x.stockCode.value,
          //     unit_of_purchase: x.unitOfPurchase,
          //     quantity: x.quantity,
          //     rate: x.ratePerUnit,
          //   };
          // });
          // console.log(tempdata)
          setStockCodeStone(tempdata);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/stockname/stone" });
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

  function getVoucherNumber() {
    axios
      .get(Config.getCommonUrl() + "api/rawMaterialPurchase/get/voucher")
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
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/rawMaterialPurchase/get/voucher",
        });
      });
  }

  function handleLoadChange(event) {
    setSelectedLoad(event.target.value);
    setSelectedLoadErr("");
    setFormValues([
      {
        loadType: "",
        stockCode: "",
        categoryName: "",
        selectedHsn: "",
        unitOfPurchaseId: "",
        unitOfPurchase: "",
        unitOfPurchaseWQ: "",
        lastRate: "",
        quantity: "",
        weight: "",
        ratePerUnit: "",
        Amount: "",
        CGSTPer: "",
        SGSTPer: "",
        IGSTPer: "",
        CGSTval: "",
        SGSTval: "",
        IGSTVal: "",
        Total: "",
        errors: {
          stockCode: null,
          categoryName: null,
          selectedHsn: null,
          unitOfPurchaseId: null,
          unitOfPurchase: null,
          unitOfPurchaseWQ: null,
          lastRate: null,
          quantity: null,
          weight: null,
          ratePerUnit: null,
          Amount: null,
          CGSTPer: null,
          SGSTPer: null,
          IGSTPer: null,
          CGSTval: null,
          SGSTval: null,
          IGSTVal: null,
          Total: null,
        },
      },
      {
        loadType: "",
        stockCode: "",
        categoryName: "",
        selectedHsn: "",
        unitOfPurchaseId: "",
        unitOfPurchase: "",
        unitOfPurchaseWQ: "",
        lastRate: "",
        quantity: "",
        weight: "",
        ratePerUnit: "",
        Amount: "",
        CGSTPer: "",
        SGSTPer: "",
        IGSTPer: "",
        CGSTval: "",
        SGSTval: "",
        IGSTVal: "",
        Total: "",
        errors: {
          stockCode: null,
          categoryName: null,
          selectedHsn: null,
          unitOfPurchaseId: null,
          unitOfPurchase: null,
          unitOfPurchaseWQ: null,
          lastRate: null,
          quantity: null,
          weight: null,
          ratePerUnit: null,
          Amount: null,
          CGSTPer: null,
          SGSTPer: null,
          IGSTPer: null,
          CGSTval: null,
          SGSTval: null,
          IGSTVal: null,
          Total: null,
        },
      },
      {
        loadType: "",
        stockCode: "",
        categoryName: "",
        selectedHsn: "",
        unitOfPurchaseId: "",
        unitOfPurchase: "",
        unitOfPurchaseWQ: "",
        lastRate: "",
        quantity: "",
        weight: "",
        ratePerUnit: "",
        Amount: "",
        CGSTPer: "",
        SGSTPer: "",
        IGSTPer: "",
        CGSTval: "",
        SGSTval: "",
        IGSTVal: "",
        Total: "",
        errors: {
          stockCode: null,
          categoryName: null,
          selectedHsn: null,
          unitOfPurchaseId: null,
          unitOfPurchase: null,
          unitOfPurchaseWQ: null,
          lastRate: null,
          quantity: null,
          weight: null,
          ratePerUnit: null,
          Amount: null,
          CGSTPer: null,
          SGSTPer: null,
          IGSTPer: null,
          CGSTval: null,
          SGSTval: null,
          IGSTVal: null,
          Total: null,
        },
      },
      {
        loadType: "",
        stockCode: "",
        categoryName: "",
        selectedHsn: "",
        unitOfPurchaseId: "",
        unitOfPurchase: "",
        unitOfPurchaseWQ: "",
        lastRate: "",
        quantity: "",
        weight: "",
        ratePerUnit: "",
        Amount: "",
        CGSTPer: "",
        SGSTPer: "",
        IGSTPer: "",
        CGSTval: "",
        SGSTval: "",
        IGSTVal: "",
        Total: "",
        errors: {
          stockCode: null,
          categoryName: null,
          selectedHsn: null,
          unitOfPurchaseId: null,
          unitOfPurchase: null,
          unitOfPurchaseWQ: null,
          lastRate: null,
          quantity: null,
          weight: null,
          ratePerUnit: null,
          Amount: null,
          CGSTPer: null,
          SGSTPer: null,
          IGSTPer: null,
          CGSTval: null,
          SGSTval: null,
          IGSTVal: null,
          Total: null,
        },
      },
    ]);
    //reset every thing here
    // reset();
  }

  function handleInputChange(event) {
    // console.log("handleInputChange");

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    // console.log("name",name,"value",value);

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
    } else if (name === "metalNarration") {
      setMetalNarration(value);
      setMetalNarrationErr("");
      setPrintObj({
        ...printObj,
        metNarration: value,
      });
    } else if (name === "accNarration") {
      setAccNarration(value);
      setAccNarrationErr("");
      setPrintObj({
        ...printObj,
        accNarration: value,
      });
    } else if (name === "ledgerAmount") {
      //only if tcs  is_tds_tcs === "1"
      setLegderAmount(value);
      if (!isNaN(value) && value !== "") {
        setLedgerAmtErr("");

        let tempfinalAmount = parseFloat(
          parseFloat(totalInvoiceAmount) + parseFloat(value)
        ).toFixed(3);

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
    } else if (name === "roundOff") {
      setRoundOff(value);
      setLegderAmount("");
      setLedgerName("");
      setRateValue("");
      setTdsTcsVou("");
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
        // tempLedgerAmount = parseFloat(
        //   (tempTotalInvoiceAmt * rateValue) / 100
        // ).toFixed(3); //with gst on total invoice amount
        // console.log(tempLedgerAmount);
        //if tcs then enter amount manually
        tempLedgerAmount = ledgerAmount;
        tempfinalAmount = parseFloat(
          parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)
        ).toFixed(3);
      } else if (is_tds_tcs == 2) {
        //tds
        tempLedgerAmount = parseFloat(
          (parseFloat(amount) * rateValue) / 100
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
        totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
        taxAmount: tempLedgerAmount,
        TDSTCSVoucherNum: tdsTcsVou,
        ledgerName: ledgerName.label,
        balancePayable: parseFloat(tempfinalAmount).toFixed(3),
      });
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
  function checkAmount() {
    console.log(typeof finalAmount, "type");
    if (
      ledgerAmtErr ||
      finalAmount === "" ||
      finalAmount == 0 ||
      finalAmount == "NaN"
    ) {
      console.log(typeof finalAmount, "type");
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

  function selectedLoadValidation() {
    if (selectedLoad === "") {
      setSelectedLoadErr("Please Select Load Type");
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

  function handleFormSubmit(ev) {
    ev.preventDefault();

    // console.log(parseInt(gstType));
    console.log("handleFormSubmit", formValues);
    if (
      selectedLoadValidation() &&
      handleDateBlur() &&
      voucherNumValidation() &&
      oppositeAcValidation() &&
      partyNameValidation() &&
      partyVoucherNumValidation() &&
      partyVoucherDateValidation() &&
      ledgerNameValidate() &&
      checkAmount()
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (prevContactIsValid()) {
        addConsumablePurchase(true, false);
      } else {
        console.log("prevContactIsValid else");
      }
    } else {
      console.log("else");
    }
  }

  function addConsumablePurchase(resetFlag, toBePrint) {
    let Orders = formValues
      .filter((element) => element.stockCode !== "")
      .map((x) => {
        if (selectedLoad === "1") {
          return {
            stock_name_code_id: x.stockCode.value,
            unit_of_purchase: x.unitOfPurchase,
            stone_unit: Number(x.unitOfPurchaseId),
            quantity: x.quantity,
            weight: x.weight,
            rate: x.ratePerUnit,
          };
        } else {
          return {
            stock_name_code_id: x.stockCode.value,
            // stone_unit: x.unitOfPurchase,
            quantity: x.quantity,
            weight: x.weight,
            rate: x.ratePerUnit,
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
      // voucher_no: voucherNumber,
      party_voucher_no: partyVoucherNum,
      raw_material_type: selectedLoad,
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
      round_off: roundOff === "" ? 0 : roundOff,
      rawmaterial_narration: metalNarration,
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
      .post(Config.getCommonUrl() + "api/rawMaterialPurchase", body)
      .then(function (response) {
        console.log(response);
        // setLoading(false);
        if (response.data.success === true) {
          // response.data.data.id

          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.push("/dashboard/masters/clients");
          // window.location.reload(false);
          // History.goBack();
          if (resetFlag === true) {
            checkAndReset();
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record
            handlePrint();
          }
          // setSelectedVendor("");
          // setOppositeAccSelected("");
          // setPartyVoucherNum("");
          // // setSelectedDepartment("");
          // setSelectedLoad("");
          // setFirmName("");
          // setVendorStateId("");
          // setTdsTcsVou("");
          // setLedgerName("");
          // setRateValue("");
          // setLegderAmount("");
          // setFinalAmount("");
          // setVoucherDate(moment().format("YYYY-MM-DD"));
          // setAccNarration("");
          // setMetalNarration("");

          // resetForm();
          // getVoucherNumber();
          // setLoading(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          // setLoading(false);
        }
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/rawMaterialPurchase",
          body: body,
        });
      });
  }

  function resetForm() {
    setOppositeAccSelected("");
    setAmount("");
    setCgstVal("");
    setSubTotal("");
    setTotalGST("");
    setSgstVal("");
    setIgstVal("");
    setTotal("");
    setRoundOff("");
    setTotalInvoiceAmount("");
    setFinalAmount("");
    // setTotalGrossWeight("");

    setFormValues([
      {
        loadType: "",
        stockCode: "",
        categoryName: "",
        selectedHsn: "",
        unitOfPurchaseId: "",
        unitOfPurchase: "",
        unitOfPurchaseWQ: "",
        lastRate: "",
        quantity: "",
        weight: "",
        ratePerUnit: "",
        Amount: "",
        CGSTPer: "",
        SGSTPer: "",
        IGSTPer: "",
        CGSTval: "",
        SGSTval: "",
        IGSTVal: "",
        Total: "",
        errors: {
          stockCode: null,
          categoryName: null,
          selectedHsn: null,
          unitOfPurchaseId: null,
          unitOfPurchase: null,
          unitOfPurchaseWQ: null,
          lastRate: null,
          quantity: null,
          weight: null,
          ratePerUnit: null,
          Amount: null,
          CGSTPer: null,
          SGSTPer: null,
          IGSTPer: null,
          CGSTval: null,
          SGSTval: null,
          IGSTVal: null,
          Total: null,
        },
      },
      {
        loadType: "",
        stockCode: "",
        categoryName: "",
        selectedHsn: "",
        unitOfPurchaseId: "",
        unitOfPurchase: "",
        unitOfPurchaseWQ: "",
        lastRate: "",
        quantity: "",
        weight: "",
        ratePerUnit: "",
        Amount: "",
        CGSTPer: "",
        SGSTPer: "",
        IGSTPer: "",
        CGSTval: "",
        SGSTval: "",
        IGSTVal: "",
        Total: "",
        errors: {
          stockCode: null,
          categoryName: null,
          selectedHsn: null,
          unitOfPurchaseId: null,
          unitOfPurchase: null,
          unitOfPurchaseWQ: null,
          lastRate: null,
          quantity: null,
          weight: null,
          ratePerUnit: null,
          Amount: null,
          CGSTPer: null,
          SGSTPer: null,
          IGSTPer: null,
          CGSTval: null,
          SGSTval: null,
          IGSTVal: null,
          Total: null,
        },
      },
      {
        loadType: "",
        stockCode: "",
        categoryName: "",
        selectedHsn: "",
        unitOfPurchaseId: "",
        unitOfPurchase: "",
        unitOfPurchaseWQ: "",
        lastRate: "",
        quantity: "",
        weight: "",
        ratePerUnit: "",
        Amount: "",
        CGSTPer: "",
        SGSTPer: "",
        IGSTPer: "",
        CGSTval: "",
        SGSTval: "",
        IGSTVal: "",
        Total: "",
        errors: {
          stockCode: null,
          categoryName: null,
          selectedHsn: null,
          unitOfPurchaseId: null,
          unitOfPurchase: null,
          unitOfPurchaseWQ: null,
          lastRate: null,
          quantity: null,
          weight: null,
          ratePerUnit: null,
          Amount: null,
          CGSTPer: null,
          SGSTPer: null,
          IGSTPer: null,
          CGSTval: null,
          SGSTval: null,
          IGSTVal: null,
          Total: null,
        },
      },
      {
        loadType: "",
        stockCode: "",
        categoryName: "",
        selectedHsn: "",
        unitOfPurchaseId: "",
        unitOfPurchase: "",
        unitOfPurchaseWQ: "",
        lastRate: "",
        quantity: "",
        weight: "",
        ratePerUnit: "",
        Amount: "",
        CGSTPer: "",
        SGSTPer: "",
        IGSTPer: "",
        CGSTval: "",
        SGSTval: "",
        IGSTVal: "",
        Total: "",
        errors: {
          stockCode: null,
          categoryName: null,
          selectedHsn: null,
          unitOfPurchaseId: null,
          unitOfPurchase: null,
          unitOfPurchaseWQ: null,
          lastRate: null,
          quantity: null,
          weight: null,
          ratePerUnit: null,
          Amount: null,
          CGSTPer: null,
          SGSTPer: null,
          IGSTPer: null,
          CGSTval: null,
          SGSTval: null,
          IGSTVal: null,
          Total: null,
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
    // resetForm();
    setSelectedVendor(value);
    setSelectedVendorErr("");
    // setLedgerName("");
    // setLedgerNmErr("");
    // setLedgerData([]);
    setRateValue("");
    setRateValErr("");
    setLegderAmount(0);
    // setLedgerAmtErr("");
    // setFinalAmount("");
    // setTdsTcsVou("");

    const index = vendorData.findIndex((element) => element.id === value.value);
    console.log(index);
    console.log(vendorData);
    if (index > -1) {
      setFirmName(vendorData[index].firm_name);
      setAddress(vendorData[index].address);
      setGstNumber(vendorData[index].gst_number);
      setPanNumber(vendorData[index].pan_number);
      setSupState(vendorData[index].state_name.name);
      setSupCountry(vendorData[index].country_name.name);
      setVendorStateId(vendorData[index].state_name.id);

      setIs_tds_tcs(vendorData[index].is_tds_tcs);
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
        supStateCode: vendorData[index].gst_number
          ? vendorData[index].gst_number.substring(0, 2)
          : "",
        // purcVoucherNum: "",
        // partyInvNum: "",
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
        TDSTCSVoucherNum: "",
        ledgerName: "",
        taxAmount: "",
        metNarration: "",
        accNarration: "",
        balancePayable: "",
      });

      if (vendorData[index].is_tds_tcs != 0) {
        getLedger(vendorData[index].is_tds_tcs);
      } else {
        setTdsTcsVou("");
        setTdsTcsVouErr("");
        setLedgerName("");
        setRateValue("");
        setLedgerData([]);
      }
      // setLegderAmount(0); //everything is goinf to reset so 0
    }
    SelectRef.current.focus();
  }

  function getTdsTcsVoucherNum(ledgerMasterId) {
    axios
      .get(
        Config.getCommonUrl() +
          `api/rawMaterialPurchase/get/voucher/${ledgerMasterId}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
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
          api: `api/rawMaterialPurchase/get/voucher/${ledgerMasterId}`,
        });
      });
  }

  function getLastPrice(vendorId, stockCodeId, newFormValues, index) {
    axios
      .get(
        Config.getCommonUrl() +
          "api/rawMaterialPurchase/lastprice/" +
          vendorId +
          "/" +
          stockCodeId
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          // let newFormValues = [...formValues];

          if (response.data.data !== null && response.data.data.length !== 0) {
            newFormValues[index].lastRate = response.data.data;
          } else {
            newFormValues[index].lastRate = "0";
          }
          console.log(newFormValues);
          if (index === formValues.length - 1) {
            // addFormFields();
            setFormValues([
              ...newFormValues,
              {
                loadType: "",
                stockCode: "",
                categoryName: "",
                selectedHsn: "",
                unitOfPurchaseId: "",
                unitOfPurchase: "",
                unitOfPurchaseWQ: "",
                lastRate: "",
                quantity: "",
                weight: "",
                ratePerUnit: "",
                Amount: "",
                CGSTPer: "",
                SGSTPer: "",
                IGSTPer: "",
                CGSTval: "",
                SGSTval: "",
                IGSTVal: "",
                Total: "",
                errors: {
                  stockCode: null,
                  categoryName: null,
                  selectedHsn: null,
                  unitOfPurchaseId: null,
                  unitOfPurchase: null,
                  unitOfPurchaseWQ: null,
                  lastRate: null,
                  quantity: null,
                  weight: null,
                  ratePerUnit: null,
                  Amount: null,
                  CGSTPer: null,
                  SGSTPer: null,
                  IGSTPer: null,
                  CGSTval: null,
                  SGSTval: null,
                  IGSTVal: null,
                  Total: null,
                },
              },
            ]);
          } else {
            setFormValues(newFormValues);
          }

          setPrintObj({
            ...printObj,
            orderDetails: newFormValues,
          });
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api:
            "api/rawMaterialPurchase/lastprice/" + vendorId + "/" + stockCodeId,
        });
      });
  }

  function handleOppAccChange(value) {
    setOppositeAccSelected(value);
    setSelectedOppAccErr("");
  }

  const prevContactIsValid = () => {
    if (formValues.length === 0) {
      return true;
    }

    // const nameRegex = /^[a-zA-Z\s]*$/;
    const numRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
    const weightRegex = /^[0-9]{1,11}(?:\.[0-9]{1,7})?$/;

    const someEmpty = formValues
      .filter((element) => element.stockCode !== "")
      .some((item) => {
        //not same
        if (selectedLoad === "1") {
          return (
            item.stockCode === "" ||
            item.unitOfPurchase === "" ||
            item.quantity === "" ||
            item.weight === "" ||
            item.weight == 0 ||
            item.ratePerUnit === "" ||
            item.ratePerUnit == 0 ||
            numRegex.test(item.quantity) === false ||
            weightRegex.test(item.weight) === false ||
            numRegex.test(item.ratePerUnit) === false
          );
        } else {
          return (
            item.stockCode === "" ||
            item.quantity === "" ||
            item.weight === "" ||
            item.weight == 0 ||
            item.ratePerUnit === "" ||
            item.ratePerUnit == 0 ||
            numRegex.test(item.quantity) === false ||
            weightRegex.test(item.weight) === false ||
            numRegex.test(item.ratePerUnit) === false
          );
        }
      });

    console.log(someEmpty.length);

    console.log(someEmpty);
    if (someEmpty.length === undefined && someEmpty === false) {
      const allPrev = [...formValues];
      // console.log(item);

      let stockCode = formValues[0].stockCode;
      if (stockCode === "") {
        allPrev[0].errors.stockCode = "Please Select Stock Code";
      } else {
        allPrev[0].errors.stockCode = null;
      }

      setFormValues(allPrev);
    }

    if (someEmpty) {
      formValues
        .filter((element) => element.stockCode !== "")
        .map((item, index) => {
          const allPrev = [...formValues];
          // console.log(item);

          let stockCode = formValues[index].stockCode;
          if (stockCode === "") {
            allPrev[index].errors.stockCode = "Please Select Stock Code";
          } else {
            allPrev[index].errors.stockCode = null;
          }

          if (selectedLoad === "1") {
            let unitOfPurchase = formValues[index].unitOfPurchase;
            if (unitOfPurchase === "") {
              allPrev[index].errors.unitOfPurchase =
                "Please Enter Valid Unit Of Purchase";
            } else {
              allPrev[index].errors.unitOfPurchase = null;
            }
          }

          let quantity = formValues[index].quantity;
          if (!quantity || numRegex.test(quantity) === false) {
            allPrev[index].errors.quantity = "Please Enter Valid Quantity";
          } else {
            allPrev[index].errors.quantity = null;
          }

          let weight = formValues[index].weight;
          if (!weight || weightRegex.test(weight) === false || weight == 0) {
            allPrev[index].errors.weight = "Enter Valid Weight";
          } else {
            allPrev[index].errors.weight = null;
          }

          let ratePerUnit = formValues[index].ratePerUnit;
          if (
            !ratePerUnit ||
            numRegex.test(ratePerUnit) === false ||
            ratePerUnit == 0
          ) {
            allPrev[index].errors.ratePerUnit =
              "Please Enter Valid Rate Per Unit";
          } else {
            allPrev[index].errors.ratePerUnit = null;
          }

          console.log(allPrev[index]);
          setFormValues(allPrev);
          return null;
        });
    }

    return !someEmpty;
  };

  function calculateAfterRate() {
    formValues
      .filter((element) => element.stockCode !== "")
      .map((item, i) => {
        let newFormValues = [...formValues];
        // console.log("newFormValues", newFormValues.length)
        console.log(i);
        // newFormValues[i][e.target.name] = e.target.value;

        // let nm = e.target.name;
        // let val = e.target.value;

        if (selectedLoad === "2") {
          //in gram only so calculate with weight

          if (
            newFormValues[i].weight !== "" &&
            newFormValues[i].ratePerUnit !== ""
          ) {
            // let tempAmount = parseFloat(parseFloat(newFormValues[i].quantity) * parseFloat(newFormValues[i].ratePerUnit)).toFixed(3);
            // newFormValues[i].Amount = tempAmount;
            newFormValues[i].Amount = parseFloat(
              parseFloat(newFormValues[i].ratePerUnit) *
                parseFloat(newFormValues[i].weight)
            ).toFixed(3);
          } else {
            newFormValues[i].Amount = 0;
          }
        } else if (selectedLoad === "1") {
          if (
            newFormValues[i].quantity !== "" &&
            newFormValues[i].ratePerUnit !== "" &&
            newFormValues[i].weight !== "" &&
            newFormValues[i].unitOfPurchase !== ""
          ) {
            if (newFormValues[i].unitOfPurchaseId === "1") {
              //here will enter rate per gram so rate * weight
              newFormValues[i].Amount = parseFloat(
                parseFloat(newFormValues[i].ratePerUnit) *
                  parseFloat(newFormValues[i].weight)
              ).toFixed(3);
            } else if (newFormValues[i].unitOfPurchaseId === "2") {
              newFormValues[i].Amount = parseFloat(
                parseFloat(newFormValues[i].ratePerUnit) *
                  parseFloat(newFormValues[i].quantity)
              ).toFixed(3);
            }
            // let tempAmount = parseFloat(parseFloat(newFormValues[i].quantity) * parseFloat(newFormValues[i].ratePerUnit)).toFixed(3);
            // newFormValues[i].Amount = tempAmount;
          } else {
            newFormValues[i].Amount = 0;
          }
        }

        // }

        if (vendorStateId === 12) {
          // console.log("vendorStateId cond")
          if (
            newFormValues[i].Amount !== "" &&
            newFormValues[i].CGSTPer !== ""
          ) {
            // console.log("if COnd")
            newFormValues[i].CGSTval = parseFloat(
              (parseFloat(newFormValues[i].Amount) *
                parseFloat(newFormValues[i].CGSTPer)) /
                100
            ).toFixed(3);
            // console.log("CGSTval ",(newFormValues[i].amount * newFormValues[i].CGSTPer) / 100)

            newFormValues[i].SGSTval = parseFloat(
              (parseFloat(newFormValues[i].Amount) *
                parseFloat(newFormValues[i].SGSTPer)) /
                100
            ).toFixed(3);
            newFormValues[i].Total = parseFloat(
              parseFloat(newFormValues[i].Amount) +
                parseFloat(newFormValues[i].SGSTval) +
                parseFloat(newFormValues[i].CGSTval)
            ).toFixed(3);
          } else {
            newFormValues[i].CGSTval = "";
            newFormValues[i].SGSTval = "";
            newFormValues[i].Total = "";
          }
        } else {
          if (
            newFormValues[i].Amount !== "" &&
            newFormValues[i].IGSTPer !== ""
          ) {
            newFormValues[i].IGSTVal = parseFloat(
              (parseFloat(newFormValues[i].Amount) *
                parseFloat(newFormValues[i].IGSTPer)) /
                100
            ).toFixed(3);
            newFormValues[i].Total = parseFloat(
              parseFloat(newFormValues[i].Amount) +
                parseFloat(newFormValues[i].IGSTVal)
            ).toFixed(3);
          } else {
            newFormValues[i].IGSTVal = "";
            newFormValues[i].Total = "";
          }
        }

        function amount(item) {
          // console.log(item.amount)
          return item.Amount;
        }

        function CGSTval(item) {
          return item.CGSTval;
        }

        function SGSTval(item) {
          return item.SGSTval;
        }

        function IGSTVal(item) {
          return item.IGSTVal;
        }

        function Total(item) {
          return item.Total;
        }

        // console.log(formValues.map(amount).reduce(sum))

        let tempAmount = newFormValues
          .filter((item) => item.Amount !== "")
          .map(amount)
          .reduce(function (a, b) {
            // sum all resulting numbers
            return parseFloat(a) + parseFloat(b);
          }, 0);
        //.reduce(sum);
        // console.log("tempAmount",tempAmount)
        setAmount(parseFloat(tempAmount).toFixed(3));
        setSubTotal(parseFloat(tempAmount).toFixed(3));

        let tempSgstVal = 0;
        let tempCgstVal = 0;
        let tempIgstVal = 0;
        if (vendorStateId === 12) {
          tempCgstVal = newFormValues
            .filter((item) => item.CGSTval !== "")
            .map(CGSTval)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);
          // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
          setCgstVal(parseFloat(tempCgstVal).toFixed(3));

          tempSgstVal = newFormValues
            .filter((item) => item.SGSTval !== "")
            .map(SGSTval)
            .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
            }, 0);
          setSgstVal(parseFloat(tempSgstVal).toFixed(3));
          setTotalGST(
            parseFloat(
              parseFloat(tempCgstVal) + parseFloat(tempSgstVal)
            ).toFixed(3)
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
          .filter((item) => item.Total !== "")
          .map(Total)
          .reduce(function (a, b) {
            // sum all resulting numbers
            return parseFloat(a) + parseFloat(b);
          }, 0);
        setTotal(parseFloat(tempTotal).toFixed(3));

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
            // tempLedgerAmount = parseFloat(
            //   (tempTotalInvoiceAmt * rateValue) / 100
            // ).toFixed(3); //with gst on total invoice amount
            // console.log(tempLedgerAmount);
            //if tcs then enter amount manually
            tempLedgerAmount = 0;
            tempfinalAmount = parseFloat(
              parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)
            ).toFixed(3);
            console.log(tempfinalAmount);
          } else if (is_tds_tcs == 2) {
            //tds
            console.log("2");
            tempLedgerAmount = parseFloat(
              (parseFloat(tempAmount) * rateValue) / 100
            ).toFixed(3); //calculating before gst, on total amount only
            console.log(tempLedgerAmount);
            tempfinalAmount = parseFloat(
              parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount)
            ).toFixed(3);
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
          stateId: vendorStateId,
          orderDetails: newFormValues,
          is_tds_tcs: is_tds_tcs,
          taxableAmount: parseFloat(tempAmount).toFixed(3),
          sGstTot: parseFloat(tempSgstVal).toFixed(3),
          cGstTot: parseFloat(tempCgstVal).toFixed(3),
          iGstTot: parseFloat(tempIgstVal).toFixed(3),
          roundOff: roundOff,
          totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
          taxAmount: parseFloat(tempLedgerAmount).toFixed(3),
          balancePayable: parseFloat(tempfinalAmount).toFixed(3),
          TDSTCSVoucherNum: tdsTcsVou,
          ledgerName: ledgerName.label,
        });

        setFormValues(newFormValues);
      });
  }

  let handleChange = (i, e) => {
    // console.log("handleChange");
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    // newFormValues[i].errors[nm] = null

    let nm = e.target.name;
    // console.log(newFormValues[i].errors[nm])
    newFormValues[i].errors[nm] = null;
    newFormValues[i].loadType = selectedLoad;
    // let val = e.target.value;
    // console.log(nm);

    // if (nm === "quantity" || nm === "ratePerUnit") {

    if (selectedLoad === "2") {
      //in gram only so calculate with weight

      if (
        newFormValues[i].weight !== "" &&
        newFormValues[i].ratePerUnit !== ""
      ) {
        // let tempAmount = parseFloat(parseFloat(newFormValues[i].quantity) * parseFloat(newFormValues[i].ratePerUnit)).toFixed(3);
        // newFormValues[i].Amount = tempAmount;
        newFormValues[i].Amount = parseFloat(
          parseFloat(newFormValues[i].ratePerUnit) *
            parseFloat(newFormValues[i].weight)
        ).toFixed(3);
      } else {
        newFormValues[i].Amount = 0;
      }
    } else if (selectedLoad === "1") {
      if (nm === "quantity") {
        const stocoWgt = newFormValues[i].stockWeight
          ? newFormValues[i].stockWeight
          : 0;
        const pcs = e.target.value ? e.target.value : 0;
        newFormValues[i].weight = parseFloat(
          parseFloat(stocoWgt) * parseFloat(pcs)
        ).toFixed(5);
      }
      if (
        newFormValues[i].quantity !== "" &&
        newFormValues[i].ratePerUnit !== "" &&
        newFormValues[i].weight !== "" &&
        newFormValues[i].unitOfPurchase !== ""
      ) {
        if (newFormValues[i].unitOfPurchaseWQ == "Weight") {
          //here will enter rate per gram so rate * weight
          newFormValues[i].Amount = parseFloat(
            parseFloat(newFormValues[i].ratePerUnit) *
              parseFloat(newFormValues[i].weight)
          ).toFixed(3);
        } else if (newFormValues[i].unitOfPurchaseWQ == "Quantity") {
          newFormValues[i].Amount = parseFloat(
            parseFloat(newFormValues[i].ratePerUnit) *
              parseFloat(newFormValues[i].quantity)
          ).toFixed(3);
        }
        // let tempAmount = parseFloat(parseFloat(newFormValues[i].quantity) * parseFloat(newFormValues[i].ratePerUnit)).toFixed(3);
        // newFormValues[i].Amount = tempAmount;
      } else {
        newFormValues[i].Amount = 0;
      }
    }

    if (vendorStateId === 12) {
      // console.log("vendorStateId cond")
      if (newFormValues[i].Amount !== "" && newFormValues[i].CGSTPer !== "") {
        // console.log("if COnd")
        newFormValues[i].CGSTval = parseFloat(
          (parseFloat(newFormValues[i].Amount) *
            parseFloat(newFormValues[i].CGSTPer)) /
            100
        ).toFixed(3);
        // console.log("CGSTval ",(newFormValues[i].amount * newFormValues[i].CGSTPer) / 100)

        newFormValues[i].SGSTval = parseFloat(
          (parseFloat(newFormValues[i].Amount) *
            parseFloat(newFormValues[i].SGSTPer)) /
            100
        ).toFixed(3);
        newFormValues[i].Total = parseFloat(
          parseFloat(newFormValues[i].Amount) +
            parseFloat(newFormValues[i].SGSTval) +
            parseFloat(newFormValues[i].CGSTval)
        ).toFixed(3);
      } else {
        newFormValues[i].CGSTval = "";
        newFormValues[i].SGSTval = "";
        newFormValues[i].Total = "";
      }
    } else {
      if (newFormValues[i].Amount !== "" && newFormValues[i].IGSTPer !== "") {
        newFormValues[i].IGSTVal = parseFloat(
          (parseFloat(newFormValues[i].Amount) *
            parseFloat(newFormValues[i].IGSTPer)) /
            100
        ).toFixed(3);
        newFormValues[i].Total = parseFloat(
          parseFloat(newFormValues[i].Amount) +
            parseFloat(newFormValues[i].IGSTVal)
        ).toFixed(3);
      } else {
        newFormValues[i].IGSTVal = "";
        newFormValues[i].Total = "";
      }
    }

    function amount(item) {
      // console.log(item.amount)
      return item.Amount;
    }

    function CGSTval(item) {
      return item.CGSTval;
    }

    function SGSTval(item) {
      return item.SGSTval;
    }

    function IGSTVal(item) {
      return item.IGSTVal;
    }

    function Total(item) {
      return item.Total;
    }

    // console.log(formValues.map(amount).reduce(sum))

    let tempAmount = newFormValues
      .filter((item) => item.Amount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    //.reduce(sum);
    // console.log("tempAmount",tempAmount)
    setAmount(parseFloat(tempAmount).toFixed(3));
    setSubTotal(parseFloat(tempAmount).toFixed(3));

    let tempCgstVal = 0;
    let tempSgstVal = 0;
    let tempIgstVal = 0;

    if (vendorStateId === 12) {
      tempCgstVal = newFormValues
        .filter((item) => item.CGSTval !== "")
        .map(CGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
      setCgstVal(parseFloat(tempCgstVal).toFixed(3));

      tempSgstVal = newFormValues
        .filter((item) => item.SGSTval !== "")
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
      .filter((item) => item.Total !== "")
      .map(Total)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotal(parseFloat(tempTotal).toFixed(3));

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
        // tempLedgerAmount = parseFloat(
        //   (tempTotalInvoiceAmt * rateValue) / 100
        // ).toFixed(3); //with gst on total invoice amount
        // console.log(tempLedgerAmount);
        //if tcs then enter amount manually
        tempLedgerAmount = 0;
        tempfinalAmount = parseFloat(
          parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)
        ).toFixed(3);
        console.log(tempfinalAmount);
      } else if (is_tds_tcs == 2) {
        //tds
        console.log("2");
        tempLedgerAmount = parseFloat(
          (parseFloat(tempAmount) * rateValue) / 100
        ).toFixed(3); //calculating before gst, on total amount only
        console.log(tempLedgerAmount);
        tempfinalAmount = parseFloat(
          parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount)
        ).toFixed(3);
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
      stateId: vendorStateId,
      orderDetails: newFormValues,
      is_tds_tcs: is_tds_tcs,
      TDSTCSVoucherNum: tdsTcsVou,
      ledgerName: ledgerName.label,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCgstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      roundOff: roundOff,
      totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
      taxAmount: parseFloat(tempLedgerAmount).toFixed(3),
      balancePayable: parseFloat(tempfinalAmount).toFixed(3),
    });
    setFormValues(newFormValues);
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
    if (nm === "weight") {
      newFormValues[i].weight = parseFloat(val).toFixed(3);
    }
    if (nm === "ratePerUnit") {
      newFormValues[i].ratePerUnit = parseFloat(val).toFixed(3);
    }

    setFormValues(newFormValues);
  };

  function handleUnitChange(i, e) {
    let newFormValues = [...formValues];
    newFormValues[i].unitOfPurchase = e.target.value;
    newFormValues[i].errors.unitOfPurchase = null;
    newFormValues[i].unitOfPurchaseWQ =
      e.target.selectedOptions[0].getAttribute("name");
    newFormValues[i].unitOfPurchaseId =
      e.target.selectedOptions[0].getAttribute("id");

    if (
      newFormValues[i].quantity !== "" &&
      newFormValues[i].ratePerUnit !== "" &&
      newFormValues[i].weight !== "" &&
      newFormValues[i].unitOfPurchase !== ""
    ) {
      if (newFormValues[i].unitOfPurchaseWQ == "Weight") {
        //here will enter rate per gram so rate * weight
        newFormValues[i].Amount = parseFloat(
          parseFloat(newFormValues[i].ratePerUnit) *
            parseFloat(newFormValues[i].weight)
        ).toFixed(3);
      } else if (newFormValues[i].unitOfPurchaseWQ == "Quantity") {
        newFormValues[i].Amount = parseFloat(
          parseFloat(newFormValues[i].ratePerUnit) *
            parseFloat(newFormValues[i].quantity)
        ).toFixed(3);
      }
      // let tempAmount = parseFloat(parseFloat(newFormValues[i].quantity) * parseFloat(newFormValues[i].ratePerUnit)).toFixed(3);
      // newFormValues[i].Amount = tempAmount;
    } else {
      newFormValues[i].Amount = 0;
    }
    // }

    if (vendorStateId === 12) {
      // console.log("vendorStateId cond")
      if (newFormValues[i].Amount !== "" && newFormValues[i].CGSTPer !== "") {
        // console.log("if COnd")
        newFormValues[i].CGSTval = parseFloat(
          (parseFloat(newFormValues[i].Amount) *
            parseFloat(newFormValues[i].CGSTPer)) /
            100
        ).toFixed(3);
        // console.log("CGSTval ",(newFormValues[i].amount * newFormValues[i].CGSTPer) / 100)

        newFormValues[i].SGSTval = parseFloat(
          (parseFloat(newFormValues[i].Amount) *
            parseFloat(newFormValues[i].SGSTPer)) /
            100
        ).toFixed(3);
        newFormValues[i].Total = parseFloat(
          parseFloat(newFormValues[i].Amount) +
            parseFloat(newFormValues[i].SGSTval) +
            parseFloat(newFormValues[i].CGSTval)
        ).toFixed(3);
      } else {
        newFormValues[i].CGSTval = "";
        newFormValues[i].SGSTval = "";
        newFormValues[i].Total = "";
      }
    } else {
      if (newFormValues[i].Amount !== "" && newFormValues[i].IGSTPer !== "") {
        newFormValues[i].IGSTVal = parseFloat(
          (parseFloat(newFormValues[i].Amount) *
            parseFloat(newFormValues[i].IGSTPer)) /
            100
        ).toFixed(3);
        newFormValues[i].Total = parseFloat(
          parseFloat(newFormValues[i].Amount) +
            parseFloat(newFormValues[i].IGSTVal)
        ).toFixed(3);
      } else {
        newFormValues[i].IGSTVal = "";
        newFormValues[i].Total = "";
      }
    }

    function amount(item) {
      // console.log(item.amount)
      return item.Amount;
    }

    function CGSTval(item) {
      return item.CGSTval;
    }

    function SGSTval(item) {
      return item.SGSTval;
    }

    function IGSTVal(item) {
      return item.IGSTVal;
    }

    function Total(item) {
      return item.Total;
    }

    // console.log(formValues.map(amount).reduce(sum))

    let tempAmount = newFormValues
      .filter((item) => item.Amount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    //.reduce(sum);
    // console.log("tempAmount",tempAmount)
    setAmount(parseFloat(tempAmount).toFixed(3));
    setSubTotal(parseFloat(tempAmount).toFixed(3));

    let tempSgstVal = 0;
    let tempCgstVal = 0;
    let tempIgstVal = 0;

    if (vendorStateId === 12) {
      tempCgstVal = newFormValues
        .filter((item) => item.CGSTval !== "")
        .map(CGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
      setCgstVal(parseFloat(tempCgstVal).toFixed(3));

      tempSgstVal = newFormValues
        .filter((item) => item.SGSTval !== "")
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
      .filter((item) => item.Total !== "")
      .map(Total)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotal(parseFloat(tempTotal).toFixed(3));

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
        // tempLedgerAmount = parseFloat(
        //   (tempTotalInvoiceAmt * rateValue) / 100
        // ).toFixed(3); //with gst on total invoice amount
        // console.log(tempLedgerAmount);
        //if tcs then enter amount manually
        tempLedgerAmount = 0;
        tempfinalAmount = parseFloat(
          parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)
        ).toFixed(3);
        console.log(tempfinalAmount);
      } else if (is_tds_tcs == 2) {
        //tds
        console.log("2");
        tempLedgerAmount = parseFloat(
          (parseFloat(tempAmount) * rateValue) / 100
        ).toFixed(3); //calculating before gst, on total amount only
        console.log(tempLedgerAmount);
        tempfinalAmount = parseFloat(
          parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount)
        ).toFixed(3);
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
    setFormValues(newFormValues);
    setPrintObj({
      ...printObj,
      stateId: vendorStateId,
      orderDetails: newFormValues,
      is_tds_tcs: is_tds_tcs,
      TDSTCSVoucherNum: tdsTcsVou,
      ledgerName: ledgerName.label,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCgstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      roundOff: roundOff,
      // grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      // netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
      taxAmount: parseFloat(tempLedgerAmount).toFixed(3),
      balancePayable: parseFloat(tempfinalAmount).toFixed(3),
    });

    inputRef.current[i].focus();
  }

  function deleteHandler(index) {
    console.log(index);
    let newFormValues = [...formValues];

    newFormValues[index].loadType = "";
    newFormValues[index].stockCode = "";
    newFormValues[index].categoryName = "";
    newFormValues[index].selectedHsn = "";
    newFormValues[index].unitOfPurchase = "";
    newFormValues[index].unitOfPurchaseId = "";
    newFormValues[index].lastRate = "";
    newFormValues[index].quantity = "";
    newFormValues[index].weight = "";
    newFormValues[index].ratePerUnit = "";
    newFormValues[index].Amount = "";
    newFormValues[index].CGSTPer = "";
    newFormValues[index].SGSTPer = "";
    newFormValues[index].IGSTPer = "";
    newFormValues[index].CGSTval = "";
    newFormValues[index].SGSTval = "";
    newFormValues[index].IGSTVal = "";
    newFormValues[index].Total = "";
    newFormValues[index].errors = {
      stockCode: null,
      categoryName: null,
      selectedHsn: null,
      unitOfPurchaseId: null,
      unitOfPurchase: null,
      lastRate: null,
      quantity: null,
      weight: null,
      ratePerUnit: null,
      Amount: null,
      CGSTPer: null,
      SGSTPer: null,
      IGSTPer: null,
      CGSTval: null,
      SGSTval: null,
      IGSTVal: null,
      Total: null,
    };

    setFormValues(newFormValues);

    function amount(item) {
      // console.log(item.amount)
      return item.Amount;
    }

    function CGSTval(item) {
      return item.CGSTval;
    }

    function SGSTval(item) {
      return item.SGSTval;
    }

    function IGSTVal(item) {
      return item.IGSTVal;
    }

    function Total(item) {
      return item.Total;
    }

    let tempAmount = newFormValues
      .filter((item) => item.Amount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setAmount(parseFloat(tempAmount).toFixed(3));
    setSubTotal(parseFloat(tempAmount).toFixed(3));

    let tempCgstVal = 0;
    let tempSgstVal = 0;
    let tempIgstVal = 0;

    if (vendorStateId === 12) {
      tempCgstVal = newFormValues
        .filter((item) => item.CGSTval !== "")
        .map(CGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
      setCgstVal(parseFloat(tempCgstVal).toFixed(3));

      tempSgstVal = newFormValues
        .filter((item) => item.SGSTval !== "")
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
      .filter((item) => item.Total !== "")
      .map(Total)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotal(parseFloat(tempTotal).toFixed(3));

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
        // tempLedgerAmount = parseFloat(
        //   (tempTotalInvoiceAmt * rateValue) / 100
        // ).toFixed(3); //with gst on total invoice amount
        // console.log(tempLedgerAmount);
        //if tcs then enter amount manually
        tempLedgerAmount = 0;
        tempfinalAmount = parseFloat(
          parseFloat(tempTotalInvoiceAmt) + parseFloat(tempLedgerAmount)
        ).toFixed(3);
        console.log(tempfinalAmount);
      } else if (is_tds_tcs == 2) {
        //tds
        console.log("2");
        tempLedgerAmount = parseFloat(
          (parseFloat(tempAmount) * rateValue) / 100
        ).toFixed(3); //calculating before gst, on total amount only
        console.log(tempLedgerAmount);
        tempfinalAmount = parseFloat(
          parseFloat(tempTotalInvoiceAmt) - parseFloat(tempLedgerAmount)
        ).toFixed(3);
      } else {
        console.log("else");
        tempfinalAmount = parseFloat(tempTotalInvoiceAmt).toFixed(3);
      }

      setLegderAmount(parseFloat(tempLedgerAmount).toFixed(3));

      setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));
    } else {
      setTotalInvoiceAmount(0);
      setLegderAmount(0);
      setFinalAmount(0);
    }

    setPrintObj({
      ...printObj,
      stateId: vendorStateId,
      orderDetails: newFormValues,
      is_tds_tcs: is_tds_tcs,
      TDSTCSVoucherNum: tdsTcsVou,
      ledgerName: ledgerName.label,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCgstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      roundOff: roundOff,
      // grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      // netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
      taxAmount: parseFloat(tempLedgerAmount).toFixed(3),
      balancePayable: parseFloat(tempfinalAmount).toFixed(3),
    });
  }
  const handleVendorClientChange = (value) => {
    resetForm();
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

    setPrintObj({
      ...printObj,
      supplierName: "",
      supAddress: "",
      supplierGstUinNum: "",
      supPanNum: "",
      supState: "",
      supCountry: "",
      supStateCode: "",
      // partyInvNum: "",
      voucherDate: moment().format("DD-MM-YYYY"),
      placeOfSupply: "",
      quantity: "",
      orderDetails: [],
      taxableAmount: "",
      sGstTot: "",
      cGstTot: "",
      iGstTot: "",
      roundOff: "",
      totalInvoiceAmt: "",
      TDSTCSVoucherNum: "",
      ledgerName: "",
      taxAmount: "",
      metNarration: "",
      accNarration: "",
      balancePayable: "",
    });
  };

  function handleClientPartyChange(value) {
    resetForm();
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

    setPrintObj({
      ...printObj,
      supplierName: "",
      supAddress: "",
      supplierGstUinNum: "",
      supPanNum: "",
      supState: "",
      supCountry: "",
      supStateCode: "",
      // partyInvNum: "",
      voucherDate: moment().format("DD-MM-YYYY"),
      placeOfSupply: "",
      quantity: "",
      orderDetails: [],
      taxableAmount: "",
      sGstTot: "",
      cGstTot: "",
      iGstTot: "",
      roundOff: "",
      totalInvoiceAmt: "",
      TDSTCSVoucherNum: "",
      ledgerName: "",
      taxAmount: "",
      metNarration: "",
      accNarration: "",
      balancePayable: "",
    });

    let findIndex = clientData.findIndex((item) => item.id === value.value);
    if (findIndex > -1) {
      getClientCompanies(value.value);
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

    const index = clientFirmData.findIndex(
      (element) => element.id === value.value
    );
    console.log(index);

    if (index > -1) {
      setFirmName(clientFirmData[index].company_name);
      setAddress(clientFirmData[index].address);
      setGstNumber(clientFirmData[index].gst_number);
      setPanNumber(clientFirmData[index].pan_number);
      setSupState(clientFirmData[index].StateName.name);
      setSupCountry(clientFirmData[index].CountryName.name);
      setVendorStateId(clientFirmData[index].state);
      setIs_tds_tcs(clientFirmData[index].is_tds_tcs);
      console.log(clientFirmData[index].is_tds_tcs);

      setPrintObj({
        ...printObj,
        is_tds_tcs: clientFirmData[index].is_tds_tcs,
        stateId: clientFirmData[index].state,
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
        taxableAmount: amount,
        sGstTot: sgstVal,
        cGstTot: cgstVal,
        iGstTot: igstVal,
        roundOff: roundOff,
        totalInvoiceAmt: totalInvoiceAmount,
        TDSTCSVoucherNum: "",
        ledgerName: "",
        taxAmount: "",
        metNarration: "",
        accNarration: "",
        balancePayable: finalAmount,
      });

      if (clientFirmData[index].is_tds_tcs != 0) {
        getLedger(clientFirmData[index].is_tds_tcs);
      } else {
        setTdsTcsVou("");
        setLedgerName("");
        setLedgerData([]);
        setRateValue("");
      }
      setLegderAmount(0); //everything is goinf to reset so 0
    }
  }

  function getLedger(tcstds) {
    if (tcstds == 2) {
      var api = `api/ledgerMastar/tds/6`;
    } else if (tcstds == 1) {
      var api = `api/ledgerMastar/tcs/6`;
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

  const handleNarrationClick = () => {
    console.log("handleNarr", narrationFlag);
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        flag: 6,
        id: idToBeView.id,
        metal_narration: metalNarration,
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

  const isDateValid = (inputDate) => {
    const currentDate = moment();
    const minDate = moment()
      .subtract(backEntryDays, "day")
      .format("YYYY-MM-DD");
    const selectedDate = moment(inputDate, "YYYY-MM-DD");

    if (selectedDate.isBefore(minDate) || selectedDate.isAfter(currentDate)) {
      return false;
    }
    return true;
  };

  const handleDateBlur = () => {
    if (!isDateValid(voucherDate)) {
      setVoucherDtErr(
        `Invalid date. Date should be within the last ${backEntryDays} days.`
      );
      return false;
    } else {
      setVoucherDtErr("");
      return true;
    }
  };
  function getUnitData() {
    axios
      .get(Config.getCommonUrl() + "api/unitofmeasurement")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setUnitData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/unitofmeasurement" });
      });
  }


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
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
                        ? "View Raw Material Purchase"
                        : "Add Raw Material Purchase"}
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
                  style={{ textAlign: "right", paddingRight: "3%" }}
                >
                  {/* <Button
                    variant="contained"
                    className={classes.button}
                    size="small"
                    onClick={(event) => {
                      History.goBack();
                    }}
                  >
                    Back
                  </Button> */}
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
                <div className="rowmatrialpurchase-main">
                  <form
                    name="registerForm"
                    noValidate
                    className="flex flex-col justify-center w-full"
                    onSubmit={handleFormSubmit}
                  >
                    <Grid container spacing={3}>
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
                            className="mb-16"
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
                        <p style={{ paddingBottom: "3px" }}>Vendor / Client*</p>
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
                            <p style={{ paddingBottom: "3px" }}>Party name*</p>
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
                          id="oppAcc"
                          ref={SelectRef}
                          className="view_consumablepurchase_dv"
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          options={oppositeAccData}
                          // tabIndex={"2"}
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
                        <p style={{ paddingBottom: "3px" }}>Party voucher date*</p>
                        <TextField
                          placeholder="Party voucher date"
                          type="date"
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
                        <p style={{ paddingBottom: "3px" }}>
                          Select load type*
                        </p>
                        <select
                          className={clsx(classes.normalSelect, "focusClass")}
                          required
                          value={selectedLoad}
                          onChange={(e) => handleLoadChange(e)}
                          disabled={isView}
                        >
                          <option hidden value="">
                            Select load type
                          </option>
                          <option value="2">Alloy Silver and Brass </option>
                          <option value="1">Stone like materials</option>
                        </select>

                        <span style={{ color: "red" }}>
                          {selectedLoadErr.length > 0 ? selectedLoadErr : ""}
                        </span>
                      </Grid>
                    </Grid>

                    <div
                      className="mt-16 rowmatrialpurchase-table  rowmatrialpurchase-table-main rowmatrialpurchase-table-main-dv view_rowmatrialpurchase-table "
                      style={{
                        border: "1px solid #EBEEFB",
                        borderRadius: "7px",
                        paddingBottom: 5,
                      }}
                    >
                      <div
                        className="metal-tbl-head new_view_rowmatrialpurchase-table"
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
                        {(selectedLoad === "1" || selectedLoad === "2") && (
                          <div className={clsx(classes.tableheader, "")}>
                            Variant Name
                          </div>
                        )}
                        <div className={clsx(classes.tableheader, "")}>
                          Variant Code
                        </div>
                        <div className={clsx(classes.tableheader, "")}>HSN</div>
                        {selectedLoad === "1" && (
                          <div
                            className={clsx(
                              classes.tableheader,
                              "unit_purchase_castum"
                            )}
                          >
                            Unit of purchase
                          </div>
                        )}
                        <div className={clsx(classes.tableheader, "")}>
                          Last rate
                        </div>
                        <div className={clsx(classes.tableheader, "")}>
                          Quantity
                        </div>
                        <div className={clsx(classes.tableheader, "")}>
                          Weight
                        </div>
                        <div className={clsx(classes.tableheader, "")}>
                          Rate per unit
                        </div>
                        <div className={clsx(classes.tableheader, "")}>
                          Amount
                        </div>

                        {isView && igstVal != 0 && igstVal !== "" ? (
                          <>
                            <div className={clsx(classes.tableheader, "")}>
                              IGST (%)
                            </div>
                            <div className={clsx(classes.tableheader, "")}>
                              IGST
                            </div>
                          </>
                        ) : (
                          isView && (
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
                          )
                        )}

                        {vendorStateId === 12 && !isView && (
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

                        {vendorStateId !== 12 && !isView && (
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

                      {formValues.map((element, index) => (
                        <div
                          key={index}
                          className=" table-row-source unit_purchase_row all-purchase-tabs"
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

                          {selectedLoad === "1" && (
                            <Select
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              className={classes.selectBox}
                              classes={classes}
                              styles={selectStyles}
                              options={stockCodeStone.map((suggestion) => ({
                                value: suggestion.stock_name_code.id,
                                label: suggestion.stock_name_code.stock_code,
                                element: suggestion,
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
                          )}
                          {selectedLoad === "2" && (
                            <Select
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              className={classes.selectBox}
                              classes={classes}
                              styles={selectStyles}
                              options={stockCodeSilver.map((suggestion) => ({
                                value: suggestion.stock_name_code.id,
                                label: suggestion.stock_name_code.stock_code,
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
                                handleSilverStockChange(index, e);
                              }}
                              placeholder="Stock Code"
                              isDisabled={isView}
                            />
                          )}

                          <span style={{ color: "red" }}>
                            {element.errors !== undefined
                              ? element.errors.stockCode
                              : ""}
                          </span>

                          <TextField
                            // label="HSN"
                            name="categoryName"
                            className=""
                            value={element.categoryName || ""}
                            disabled
                            // value={departmentNm}
                            error={
                              element.errors !== undefined
                                ? element.errors.categoryName
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              element.errors !== undefined
                                ? element.errors.categoryName
                                : ""
                            }
                            onChange={(e) => handleChange(index, e)}
                            variant="outlined"
                            fullWidth
                          />
                          {/* <span style={{ color: "red" }}>
                          {element.errors !== undefined
                            ? element.errors.categoryName
                            : ""}
                        </span> */}
                          <TextField
                            // label="HSN"
                            name="selectedHsn"
                            className=""
                            value={element.selectedHsn || ""}
                            disabled
                            // value={departmentNm}
                            error={
                              element.errors !== undefined
                                ? element.errors.selectedHsn
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              element.errors !== undefined
                                ? element.errors.selectedHsn
                                : ""
                            }
                            onChange={(e) => handleChange(index, e)}
                            variant="outlined"
                            fullWidth
                          />

                          {selectedLoad === "1" && (
                            <>
                              <select
                                className={clsx(
                                  classes.normalSelect,
                                  "unit_purchase_castum",
                                  "focusClass",
                                  "AddConsumablePurchase_table_border"
                                )}
                                required
                                value={element.unitOfPurchase || ""}
                                onChange={(e) => handleUnitChange(index, e)}
                                ref={(el) => (unitRef.current[index] = el)}
                                disabled={isView}
                              >
                                <option hidden value="">
                                  Select Unit type
                                </option>
                                {unitData.map((suggestion) => (
                                <option
                                  name={suggestion.weight_or_quantity}
                                  value={suggestion.unit_name}
                                  id={suggestion.id}
                                >
                                  {suggestion.unit_name}{" "}
                                </option>
                              ))}
                              </select>

                              <span style={{ color: "red" }}>
                                {element.errors !== undefined
                                  ? element.errors.unitOfPurchase
                                  : ""}
                              </span>
                            </>
                          )}

                          <TextField
                            name="lastRate"
                            className=""
                            value={
                              isView
                                ? Config.numWithComma(element.lastRate)
                                : element.lastRate
                            }
                            // value={departmentNm}
                            error={
                              element.errors !== undefined
                                ? element.errors.lastRate
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              element.errors !== undefined
                                ? element.errors.lastRate
                                : ""
                            }
                            onChange={(e) => handleChange(index, e)}
                            variant="outlined"
                            fullWidth
                            disabled
                          />

                          <TextField
                            name="quantity"
                            className={classes.inputBoxTEST}
                            type={isView ? "text" : "number"}
                            // className=""
                            value={element.quantity}
                            // value={departmentNm}
                            error={
                              element.errors !== undefined
                                ? element.errors.quantity
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              element.errors !== undefined
                                ? element.errors.quantity
                                : ""
                            }
                            onChange={(e) => handleChange(index, e)}
                            inputRef={(el) => (inputRef.current[index] = el)}
                            variant="outlined"
                            fullWidth
                            disabled={isView}
                          />

                          <TextField
                            name="weight"
                            className={classes.inputBoxTEST}
                            type={isView ? "text" : "number"}
                            // className=""
                            value={element.weight}
                            // value={departmentNm}
                            error={
                              element.errors !== undefined
                                ? element.errors.weight
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              element.errors !== undefined
                                ? element.errors.weight
                                : ""
                            }
                            onChange={(e) => handleChange(index, e)}
                            onBlur={(e) => handlerBlur(index, e)}
                            variant="outlined"
                            fullWidth
                            disabled={isView}
                          />

                          <TextField
                            // label="Purity"
                            name="ratePerUnit"
                            className={classes.inputBoxTEST}
                            type={isView ? "text" : "number"}
                            // className=""
                            value={
                              isView
                                ? Config.numWithComma(element.ratePerUnit)
                                : element.ratePerUnit || ""
                            }
                            // value={departmentNm}
                            error={
                              element.errors !== undefined
                                ? element.errors.ratePerUnit
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              element.errors !== undefined
                                ? element.errors.ratePerUnit
                                : ""
                            }
                            onChange={(e) => handleChange(index, e)}
                            onBlur={(e) => handlerBlur(index, e)}
                            variant="outlined"
                            fullWidth
                            disabled={isView}
                          />
                          <TextField
                            // label="Fine Gold"
                            name="Amount"
                            className={classes.inputBoxTEST}
                            type={isView ? "text" : "number"}
                            // className=""
                            value={
                              isView
                                ? Config.numWithComma(element.Amount)
                                : element.Amount || ""
                            }
                            // value={departmentNm}
                            error={
                              element.errors !== undefined
                                ? element.errors.Amount
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              element.errors !== undefined
                                ? element.errors.Amount
                                : ""
                            }
                            onChange={(e) => handleChange(index, e)}
                            variant="outlined"
                            fullWidth
                            disabled
                          />

                          {element.IGSTPer && isView ? (
                            <>
                              <TextField
                                // label="IGST (%)"
                                name="IGSTPer"
                                className=""
                                value={element.IGSTPer || ""}
                                // value={departmentNm}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.IGSTPer
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.IGSTPer
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
                                    ? Config.numWithComma(element?.IGSTVal)
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
                                  name="CGSTPer"
                                  className=""
                                  value={element.CGSTPer || ""}
                                  // value={departmentNm}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.CGSTPer
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.CGSTPer
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                                <TextField
                                  // label="SGST (%)"
                                  name="SGSTPer"
                                  className=""
                                  value={element.SGSTPer || ""}
                                  // value={departmentNm}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.SGSTPer
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.SGSTPer
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                                <TextField
                                  // label="CGST"
                                  name="CGSTval"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(element?.CGSTval)
                                      : element.CGSTval || ""
                                  }
                                  // value={departmentNm}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.CGSTval
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.CGSTval
                                      : ""
                                  }
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                                <TextField
                                  // label="SGST"
                                  name="SGSTval"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(element?.SGSTval)
                                      : element.SGSTval || ""
                                  }
                                  // value={departmentNm}
                                  error={
                                    element.errors !== undefined
                                      ? element.errors.SGSTval
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    element.errors !== undefined
                                      ? element.errors.SGSTval
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
                                name="CGSTPer"
                                className=""
                                value={element.CGSTPer || ""}
                                // value={departmentNm}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.CGSTPer
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.CGSTPer
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled
                              />
                              <TextField
                                // label="SGST (%)"
                                name="SGSTPer"
                                className=""
                                value={element.SGSTPer || ""}
                                // value={departmentNm}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.SGSTPer
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.SGSTPer
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled
                              />
                              <TextField
                                // label="CGST"
                                name="CGSTval"
                                className=""
                                value={
                                  isView
                                    ? Config.numWithComma(element.CGSTval)
                                    : element.CGSTval || ""
                                }
                                // value={departmentNm}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.CGSTval
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.CGSTval
                                    : ""
                                }
                                onChange={(e) => handleChange(index, e)}
                                variant="outlined"
                                fullWidth
                                disabled
                              />
                              <TextField
                                // label="SGST"
                                name="SGSTval"
                                className=""
                                value={
                                  isView
                                    ? Config.numWithComma(element.SGSTval)
                                    : element.SGSTval || ""
                                }
                                // value={departmentNm}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.SGSTval
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.SGSTval
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
                                name="IGSTPer"
                                className=""
                                value={element.IGSTPer || ""}
                                // value={departmentNm}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.IGSTPer
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.IGSTPer
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
                            name="Total"
                            className=""
                            value={
                              isView
                                ? Config.numWithComma(element.Total)
                                : element.Total || ""
                            }
                            // value={departmentNm}
                            error={
                              element.errors !== undefined
                                ? element.errors.Total
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              element.errors !== undefined
                                ? element.errors.Total
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
                        className=" castum-row-dv"
                        style={{ fontWeight: "700", height: "30px" }}
                      >
                        {!isView && (
                          <div
                            id="castum-width-table"
                            style={{}}
                            className={classes.tableheader}
                          ></div>
                        )}
                        {(selectedLoad === "1" || selectedLoad === "2") && (
                          <div
                            id="castum-width-table"
                            style={{}}
                            className={classes.tableheader}
                          ></div>
                        )}
                        <div
                          id="castum-width-table"
                          className={clsx(classes.tableheader)}
                          style={{}}
                        ></div>
                        <div
                          className={clsx(
                            classes.tableheader,
                            "castum-width-table"
                          )}
                          style={{}}
                        ></div>
                        {selectedLoad === "1" && (
                          <div
                            className={clsx(
                              classes.tableheader,
                              "castum-width-table"
                            )}
                            style={{}}
                          >
                            {/* Unit of purchase */}
                          </div>
                        )}
                        <div
                          className={clsx(
                            classes.tableheader,
                            "castum-width-table"
                          )}
                          style={{}}
                        >
                          {/* Last rate */}
                        </div>
                        <div
                          className={clsx(
                            classes.tableheader,
                            "castum-width-table"
                          )}
                          style={{}}
                        >
                          {/* Quantity */}
                        </div>
                        <div
                          className={clsx(
                            classes.tableheader,
                            "castum-width-table"
                          )}
                          style={{}}
                        >
                          {/* Weight */}
                        </div>
                        <div
                          className={clsx(
                            classes.tableheader,
                            "castum-width-table"
                          )}
                          style={{}}
                        >
                          {/* Rate per unit */}
                        </div>
                        <div
                          className={clsx(
                            classes.tableheader,
                            "castum-width-table"
                          )}
                          style={{}}
                        >
                          {isView ? Config.numWithComma(amount) : amount}
                        </div>

                        {igstVal != 0 && igstVal !== "" ? (
                          <>
                            <div
                              className={clsx(
                                classes.tableheader,
                                "castum-width-table "
                              )}
                            ></div>
                            <div
                              className={clsx(
                                classes.tableheader,
                                "castum-width-table"
                              )}
                            >
                              {isView ? Config.numWithComma(igstVal) : igstVal}
                            </div>
                          </>
                        ) : (
                          isView && (
                            <>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table "
                                )}
                              ></div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table "
                                )}
                              ></div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table "
                                )}
                              >
                                {isView
                                  ? Config.numWithComma(cgstVal)
                                  : cgstVal}
                              </div>
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "castum-width-table "
                                )}
                              >
                                {isView
                                  ? Config.numWithComma(sgstVal)
                                  : sgstVal}
                              </div>
                            </>
                          )
                        )}
                        <div
                          className={clsx(
                            classes.tableheader,
                            "castum-width-table"
                          )}
                          style={{ width: "6%" }}
                        >
                          {isView ? Config.numWithComma(total) : total}
                        </div>
                      </div>
                    </div>
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
                        {isView ? Config.numWithComma(subTotal) : subTotal}{" "}
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
                        {isView ? Config.numWithComma(totalGST) : totalGST}{" "}
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
                      <label className="mr-3" style={{}}>
                        Round Off
                      </label>
                      <label className="ml-2 input-sub-total">
                        <TextField
                          // label="Round off"
                          name="roundOff"
                          className={clsx(
                            classes.inputBoxTEST,
                            "addconsumble-dv"
                          )}
                          type={isView ? "text" : "number"}
                          // className=""
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
                        className="metal-tbl-head"
                        style={{
                          background: "#EBEEFB",
                          fontWeight: "700",
                          borderRadius: "7px",
                        }}
                      >
                        <div className={classes.tableheader}>Ledger Name*</div>

                        <div className={classes.tableheader}>
                          TDS/TCS Vou. Num
                        </div>

                        <div className={classes.tableheader}>(%)</div>

                        <div className={classes.tableheader}>Amount</div>
                      </div>

                      <div className="mt-5 table-row-source">
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
                          disabled={is_tds_tcs != 1 || isView}
                        />
                      </div>
                    </div>
                  )}

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
                    <div
                      style={{
                        width: "20%",
                      }}
                      // className={classes.tableheader}
                    >
                      <label>Final Receivable Amount :</label>
                      <label className="mr-32">
                        {" "}
                        {isView
                          ? Config.numWithComma(finalAmount)
                          : finalAmount}{" "}
                      </label>
                    </div>
                  </div>

                  {/* <div className="textarea-row">
                  <TextField
                    className="mt-16 mr-2"
                    style={{ width: "50%" }}
                    label="Raw Material Narration"
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
                        Raw material narration
                      </p>
                      <TextField
                        placeholder="Raw naterial narration"
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
                        style={{ float: "right" }}
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
                        <RawMaterialPurPrintComp
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
            </div>
            <ViewDocModal
              documentList={documentList}
              handleClose={handleDocModalClose}
              open={docModal}
              updateDocument={updateDocumentArray}
              purchase_flag_id={idToBeView?.id}
              purchase_flag="6"
              concateDocument={concateDocument}
              viewPopup={props.viewPopup}
            />
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddRawMaterialPurchase;

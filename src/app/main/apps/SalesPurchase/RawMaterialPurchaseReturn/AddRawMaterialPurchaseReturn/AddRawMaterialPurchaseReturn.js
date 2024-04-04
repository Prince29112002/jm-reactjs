import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@material-ui/core";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import moment from "moment";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import Loader from "app/main/Loader/Loader";

import History from "@history";
import Select, { createFilter } from "react-select";
import { Icon, IconButton } from "@material-ui/core";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import { RawMaterialPurReturnPrintComp } from "./PrintComp/RawMaterialPurReturnPrintComp";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
import HelperFunc from "../../Helper/HelperFunc";
import { UpdateNarration } from "../../Helper/UpdateNarration";
import Icones from "assets/fornt-icons/Mainicons";
const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    // minWidth: 650,
  },
  form: {
    marginTop: "3%",
    display: "contents",
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


const AddRawMaterialPurchaseReturn = (props) => {
  const [isView, setIsView] = useState(false); //for view Only
  const dispatch = useDispatch();
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
    taxableAmount: "",
    sGstTot: "",
    cGstTot: "",
    iGstTot: "",
    roundOff: "",
    totalInvoiceAmt: "",
    rawMNarration: "",
    accNarration: "",
    balancePayable: "",
  });
  const onBeforeGetContentResolve = React.useRef(null);
  const handleAfterPrint = () => {
    //React.useCallback
    console.log("`onAfterPrint` called", isView); // tslint:disable-line no-console
    //resetting after print
    checkAndReset();
  };

  function checkAndReset() {
    // console.log("checkAndReset", isView)
    // console.log("isView", isView)
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
    documentTitle: "Raw Material Purchase Return Voucher" + getDateAndTime(),
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
      callFileUploadApi(docFile, 21)
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
  const handleDocModalClose = () => {
    console.log("handleDocModalClose");
    setDocModal(false);
  };

  React.useEffect(() => {
    if (
      // text === "New, Updated Text!" &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      onBeforeGetContentResolve.current();
    }
    //eslint-disable-next-line
  }, [onBeforeGetContentResolve.current]); //, text

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");
  const SelectRef = useRef(null);
  const [unitData, setUnitData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [vendorData, setVendorData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedVendorErr, setSelectedVendorErr] = useState("");

  const [clientData, setClientData] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedClientErr, setSelectedClientErr] = useState("");

  const [clientFirmData, setClientFirmData] = useState([]);
  const [selectedClientFirm, setSelectedClientFirm] = useState("");
  const [selectedClientFirmErr, setSelectedClientFirmErr] = useState("");

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

  const [roundOff, setRoundOff] = useState("");
  const [roundOffErr, SetRoundOffErr] = useState("");

  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState("");

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [metalNarration, setMetalNarration] = useState("");
  const [metalNarrationErr, setMetalNarrationErr] = useState("");

  const theme = useTheme();

  const unitRef = useRef([]);
  const qtyRef = useRef([]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000); // 10초 뒤에
    }
  }, [loading]);

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

  var idToBeView;
  if (props.location) {
    idToBeView = props.location.state;
  } else if (props.voucherId) {
    idToBeView = { id: props.voucherId };
  }
  const [narrationFlag, setNarrationFlag] = useState(false);
  const [formValues, setFormValues] = useState([
    {
      loadType: "",
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
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
        newFormValues[i].IGSTPer = parseFloat(
          stockCodeSilver[findIndex].hsn_master.gst
        );
      }

      getLastPrice(selectedVendor.value, e.value, newFormValues, i);
    }

    if (selectedLoad === "1") {
      unitRef.current[i].focus();
    } else {
      qtyRef.current[i].focus();
    }
  };

  let handleStockGroupChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i].stockCode = {
      value: e.value,
      label: e.label,
    };
    newFormValues[i].stockWeight = e.element.stock_name_code.weight;
    newFormValues[i].errors.stockCode = null;

    let findIndex = stockCodeStone.findIndex(
      (item) => item.stock_name_code.id === e.value
    );
    // console.log(findIndex, vendorStateId);
    if (findIndex > -1) {
      newFormValues[i].unitOfPurchase =
        stockCodeStone[findIndex].stock_name_code.unitName?.id;
      newFormValues[i].categoryName = stockCodeStone[findIndex].billing_name;
      newFormValues[i].errors.categoryName = null;
      newFormValues[i].unitOfPurchaseWQ =
      stockCodeStone[findIndex].stock_name_code?.unitName
        ?.weight_or_quantity === 1
        ? "Weight"
        : stockCodeStone[findIndex].stock_name_code?.unitName
            ?.weight_or_quantity === 2 && "Quantity";
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
      qtyRef.current[i].focus();
    }
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

  const classes = useStyles();

  useEffect(() => {
    getUnitData();
    setOppositeAccData(
      HelperFunc.getOppositeAccountDetails("RawMaterialPurchaseReturn")
    );
    console.log("idToBeView", idToBeView);
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true);

      getRawMatPurchReturnRecordForView(idToBeView.id);
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

  function getRawMatPurchReturnRecordForView(id) {
    setLoading(true);
    let api = "";
    if (props.forDeletedVoucher) {
      api = `api/rawMaterialPurchasereturn/${id}?deleted_at=1`;
    } else {
      api = `api/rawMaterialPurchasereturn/${id}`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              let finalData = response.data.data[0];
              setDocumentList(finalData.salesPurchaseDocs);

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
              setTimeDate(finalData.created_at);
              setVoucherNumber(finalData.voucher_no);
              setPartyVoucherDate(finalData.party_voucher_date);
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

              setTotalInvoiceAmount(
                parseFloat(finalData.total_invoice_amount).toFixed(3)
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
                finalData.RawMaterialPurchaseReturnOrder[0]
                  .raw_material_type === "Alloy Silver and Brass"
              ) {
                setSelectedLoad("2");
              } else {
                setSelectedLoad("1");
              }
              let tempArray = [];
              // console.log(OrdersData);
              for (let item of finalData.RawMaterialPurchaseReturnOrder) {
                // console.log(item);
                tempArray.push({
                  loadType: "",
                  stockCode: {
                    value: item.StockNameCode.id,
                    label: item.StockNameCode.stock_code,
                  },
                  categoryName: item.stock_name,
                  selectedHsn: item.hsn_number ? item.hsn_number : "",
                  unitOfPurchase: item.unit_of_purchase === "gram" ? "1" : "2",
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

              let tempTotal = tempArray
                .filter((item) => item.Total !== "")
                .map(Total)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setTotal(parseFloat(tempTotal).toFixed(3));
              setPrintObj({
                ...printObj,
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
                orderDetails: tempArray,
                taxableAmount: parseFloat(tempAmount).toFixed(3),
                sGstTot: tempSgstVal ? parseFloat(tempSgstVal).toFixed(3) : "",
                cGstTot: tempCgstVal ? parseFloat(tempCgstVal).toFixed(3) : "",
                iGstTot: tempIgstVal ? parseFloat(tempIgstVal).toFixed(3) : "",
                roundOff:
                  finalData.round_off === null ? "0" : finalData.round_off,
                totalInvoiceAmt: parseFloat(
                  finalData.total_invoice_amount
                ).toFixed(3),
                taxAmount: Math.abs(
                  parseFloat(
                    parseFloat(finalData.final_invoice_amount) -
                      parseFloat(finalData.total_invoice_amount)
                  ).toFixed(3)
                ),
                rawMNarration:
                  finalData.rawmaterial_narration !== null
                    ? finalData.rawmaterial_narration
                    : "",
                accNarration:
                  finalData.account_narration !== null
                    ? finalData.account_narration
                    : "",
                balancePayable: parseFloat(
                  finalData.total_invoice_amount
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
          // setApiData([]);
        }
      })
      .catch(function (error) {
        // console.log(error);
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
      .get(Config.getCommonUrl() + "api/rawMaterialPurchasereturn/read/voucher")
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
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
          api: "api/rawMaterialPurchasereturn/read/voucher",
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
        rawMNarration: value,
      });
    } else if (name === "accNarration") {
      setAccNarration(value);
      setAccNarrationErr("");
      setPrintObj({
        ...printObj,
        accNarration: value,
      });
    } else if (name === "roundOff") {
      setRoundOff(value);
      if (value > 5 || value < -5) {
        SetRoundOffErr("Please Enter value between -5 to 5");
      } else {
        SetRoundOffErr("");
      }
      // let tempfinalAmount = 0;
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
        totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
        balancePayable: parseFloat(tempTotalInvoiceAmt).toFixed(3),
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

  function partyVoucherDateValidation() {
    if (partyVoucherDate === "") {
      setpartyVoucherDateErr("Enter Party Voucher Date");
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
      partyVoucherDateValidation()
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
            stone_unit: Number(x.unitOfPurchase),
            quantity: x.quantity,
            rate: x.ratePerUnit,
            weight: x.weight,
          };
        } else {
          return {
            stock_name_code_id: x.stockCode.value,
            // stone_unit: x.unitOfPurchase,
            quantity: x.quantity,
            rate: x.ratePerUnit,
            weight: x.weight,
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
      party_voucher_no: partyVoucherNum,
      raw_material_type: selectedLoad,
      opposite_account_id: oppositeAccSelected.value,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      is_vendor_client: selectedVendorClient.value === 1 ? 1 : 2,
      vendor_id:
        selectedVendorClient.value === 1
          ? selectedVendor.value
          : selectedClientFirm.value,
      round_off: roundOff === "" ? 0 : roundOff,
      rawmaterial_narration: metalNarration,
      account_narration: accNarration,
      Orders: Orders,
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      uploadDocIds: docIds,
      party_voucher_date: partyVoucherDate,
    };
    axios
      .post(Config.getCommonUrl() + "api/rawMaterialPurchasereturn", body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id

          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.push("/dashboard/masters/clients");
          // History.goBack();
          if (resetFlag === true) {
            checkAndReset();
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record
            handlePrint();
          }
          // window.location.reload(false);
          // setSelectedVendor("");
          // setOppositeAccSelected("");
          // setPartyVoucherNum("");
          // // setSelectedDepartment("");
          // setSelectedLoad("");
          // setFirmName("");
          // setFirmNameErr("");
          // setVendorStateId("");
          // //   setTdsTcsVou("");
          // //   setLedgerName("");
          // //   setRateValue("");
          // //   setLegderAmount("");
          // //   setFinalAmount("");

          // setAccNarration("");
          // setMetalNarration("");
          // setVoucherDate(moment().format("YYYY-MM-DD"));
          // resetForm();
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
        handleError(error, dispatch, {
          api: "api/rawMaterialPurchasereturn",
          body: body,
        });
      });
  }

  function resetForm() {
    // setOppositeAccSelected("");
    setAmount("");
    setCgstVal("");
    setSgstVal("");
    setIgstVal("");
    setTotal("");
    setRoundOff("");
    setTotalInvoiceAmount("");
    // setFinalAmount("");
    // setTotalGrossWeight("");

    setFormValues([
      {
        loadType: "",
        stockCode: "",
        categoryName: "",
        selectedHsn: "",
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

  function handlePartyChange(value) {
    setSelectedVendor(value);
    setSelectedVendorErr("");
    resetForm();

    const index = vendorData.findIndex((element) => element.id === value.value);
    console.log(index);

    if (index > -1) {
      setFirmName(vendorData[index].firm_name);
      setFirmNameErr("");
      setAddress(vendorData[index].address);
      setGstNumber(vendorData[index].gst_number);
      setPanNumber(vendorData[index].pan_number);
      setSupState(vendorData[index].state_name.name);
      setSupCountry(vendorData[index].country_name.name);
      setVendorStateId(vendorData[index].state_name.id);

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
        // voucherDate: moment().format("DD-MM-YYYY"),
        placeOfSupply: vendorData[index].state_name.name,
        orderDetails: [],
        taxableAmount: "",
        sGstTot: "",
        cGstTot: "",
        iGstTot: "",
        roundOff: "",
        totalInvoiceAmt: "",
        rawMNarration: "",
        accNarration: "",
        balancePayable: "",
      });
    }
    SelectRef.current.focus();
  }

  function getLastPrice(vendorId, stockCodeId, newFormValues, index) {
    axios
      .get(
        Config.getCommonUrl() +
          "api/rawMaterialPurchasereturn/lastprice/" +
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
          // setFormValues(newFormValues);
          if (index === formValues.length - 1) {
            // addFormFields();
            setFormValues([
              ...newFormValues,
              {
                loadType: "",
                stockCode: "",
                categoryName: "",
                selectedHsn: "",
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
            "api/rawMaterialPurchasereturn/lastprice/" +
            vendorId +
            "/" +
            stockCodeId,
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

    // stockCode: "",
    // unitOfPurchase: "",
    // quantity:"",
    // ratePerUnit: "",

    // errors: {
    //   stockCode: null,
    //   unitOfPurchase: null,
    // quantity:"",
    //   ratePerUnit: null,
    // },

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
            console.log("selectedLoad === 1");
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

    // }

    if (vendorStateId === 12) {
      if (newFormValues[i].Amount !== "" && newFormValues[i].CGSTPer !== "") {
        newFormValues[i].CGSTval = parseFloat(
          (parseFloat(newFormValues[i].Amount) *
            parseFloat(newFormValues[i].CGSTPer)) /
            100
        ).toFixed(3);
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

    setAmount(parseFloat(tempAmount).toFixed(3));
    let tempCgstVal;
    let tempSgstVal;
    let tempIgstVal;
    if (vendorStateId === 12) {
      tempCgstVal = newFormValues
        .filter((item) => item.CGSTval !== "")
        .map(CGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);

      setCgstVal(parseFloat(tempCgstVal).toFixed(3));

      tempSgstVal = newFormValues
        .filter((item) => item.SGSTval !== "")
        .map(SGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setSgstVal(parseFloat(tempSgstVal).toFixed(3));
    } else {
      tempIgstVal = newFormValues
        .filter((item) => item.IGSTVal !== "")
        .map(IGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setIgstVal(parseFloat(tempIgstVal).toFixed(3));
    }

    let tempTotal = newFormValues
      .filter((item) => item.Total !== "")
      .map(Total)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotal(parseFloat(tempTotal).toFixed(3));

    let tempTotalInvoiceAmt = 0;
    if (parseFloat(tempTotal) > 0) {
      // let tempfinalAmount = 0;
      if (roundOff > 0) {
        tempTotalInvoiceAmt = parseFloat(
          parseFloat(tempTotal).toFixed(3) + parseFloat(roundOff).toFixed(3)
        ).toFixed(3);
        setTotalInvoiceAmount(tempTotalInvoiceAmt);
      } else {
        tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);
        setTotalInvoiceAmount(tempTotalInvoiceAmt);
      }
    } else {
      setTotalInvoiceAmount(0);
      //   setLegderAmount(0);
    }

    setFormValues(newFormValues);
    setPrintObj({
      ...printObj,
      stateId: vendorStateId,
      orderDetails: newFormValues,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCgstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      roundOff: roundOff,
      totalInvoiceAmt: tempTotalInvoiceAmt,
      balancePayable: parseFloat(tempTotalInvoiceAmt).toFixed(3),
    });
  };

  function handleUnitChange(i, e) {
    // console.log(e);
    let newFormValues = [...formValues];
    newFormValues[i].unitOfPurchase = e.target.value;
    newFormValues[i].errors.unitOfPurchase = null;
    newFormValues[i].unitOfPurchaseWQ =
      e.target.selectedOptions[0].getAttribute("name");

    // if (selectedLoad === "2") {//in gram only so calculate with weight

    // if (
    //   newFormValues[i].weight !== "" &&
    //   newFormValues[i].ratePerUnit !== ""
    // ) {
    //   // let tempAmount = parseFloat(parseFloat(newFormValues[i].quantity) * parseFloat(newFormValues[i].ratePerUnit)).toFixed(3);
    //   // newFormValues[i].Amount = tempAmount;
    //   newFormValues[i].Amount = parseFloat(
    //     parseFloat(newFormValues[i].ratePerUnit) *
    //     parseFloat(newFormValues[i].weight)
    //   ).toFixed(3);
    // } else {
    //   newFormValues[i].Amount = 0;
    // }

    // } else if (selectedLoad === "1") {
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
      if (newFormValues[i].Amount !== "" && newFormValues[i].CGSTPer !== "") {
        newFormValues[i].CGSTval = parseFloat(
          (parseFloat(newFormValues[i].Amount) *
            parseFloat(newFormValues[i].CGSTPer)) /
            100
        ).toFixed(3);
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

    setAmount(parseFloat(tempAmount).toFixed(3));

    if (vendorStateId === 12) {
      let tempCgstVal = newFormValues
        .filter((item) => item.CGSTval !== "")
        .map(CGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);

      setCgstVal(parseFloat(tempCgstVal).toFixed(3));

      let tempSgstVal = newFormValues
        .filter((item) => item.SGSTval !== "")
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
      .filter((item) => item.Total !== "")
      .map(Total)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotal(parseFloat(tempTotal).toFixed(3));

    if (parseFloat(tempTotal) > 0) {
      if (roundOff > 0) {
        setTotalInvoiceAmount(
          parseFloat(
            parseFloat(tempTotal).toFixed(3) + parseFloat(roundOff).toFixed(3)
          ).toFixed(3)
        );
      } else {
        setTotalInvoiceAmount(parseFloat(tempTotal).toFixed(3));
      }
    } else {
      setTotalInvoiceAmount(0);
      //   setLegderAmount(0);
    }
    setFormValues(newFormValues);

    qtyRef.current[i].focus();
  }

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

  function deleteRow(index) {
    console.log(index);
    let newFormValues = [...formValues];

    newFormValues[index].loadType = "";
    newFormValues[index].stockCode = "";
    newFormValues[index].categoryName = "";
    newFormValues[index].selectedHsn = "";
    newFormValues[index].unitOfPurchase = "";
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

    // console.log(formValues.map(amount).reduce(sum))

    let tempAmount = newFormValues
      .filter((item) => item.Amount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setAmount(parseFloat(tempAmount).toFixed(3));

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

      setCgstVal(parseFloat(tempCgstVal).toFixed(3));

      tempSgstVal = newFormValues
        .filter((item) => item.SGSTval !== "")
        .map(SGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setSgstVal(parseFloat(tempSgstVal).toFixed(3));
    } else {
      tempIgstVal = newFormValues
        .filter((item) => item.IGSTVal !== "")
        .map(IGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setIgstVal(parseFloat(tempIgstVal).toFixed(3));
    }

    let tempTotal = newFormValues
      .filter((item) => item.Total !== "")
      .map(Total)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotal(parseFloat(tempTotal).toFixed(3));

    let tempTotalInvoiceAmt = 0;

    if (parseFloat(tempTotal) > 0) {
      if (roundOff > 0) {
        tempTotalInvoiceAmt = parseFloat(
          parseFloat(tempTotal).toFixed(3) + parseFloat(roundOff).toFixed(3)
        ).toFixed(3);
        setTotalInvoiceAmount(tempTotalInvoiceAmt);
      } else {
        tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);
        setTotalInvoiceAmount(tempTotalInvoiceAmt);
      }
    } else {
      setTotalInvoiceAmount(0);
      //   setLegderAmount(0);
    }

    setPrintObj({
      ...printObj,
      orderDetails: newFormValues,
      taxableAmount: parseFloat(tempAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCgstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      roundOff: roundOff,
      totalInvoiceAmt: parseFloat(tempTotalInvoiceAmt).toFixed(3),
      balancePayable: parseFloat(tempTotalInvoiceAmt).toFixed(3),
    });
  }

  const handleVendorClientChange = (value) => {
    resetForm();
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
      taxableAmount: "",
      sGstTot: "",
      cGstTot: "",
      iGstTot: "",
      roundOff: "",
      totalInvoiceAmt: "",
      rawMNarration: "",
      accNarration: "",
      balancePayable: "",
    });
    setVendorClient(value);
    setSelectedVendor("");
    setSelectedVendorErr("");
    setSelectedClient("");
    setSelectedClientErr("");
    setSelectedClientFirm("");
    setSelectedClientFirmErr("");
  };

  function handleClientPartyChange(value) {
    resetForm();
    setSelectedClient(value);
    setSelectedClientErr("");
    setSelectedClientFirm("");
    setSelectedClientFirmErr("");
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
      taxableAmount: "",
      sGstTot: "",
      cGstTot: "",
      iGstTot: "",
      roundOff: "",
      totalInvoiceAmt: "",
      rawMNarration: "",
      accNarration: "",
      balancePayable: "",
    });
    let findIndex = clientData.findIndex((item) => item.id === value.value);
    if (findIndex > -1) {
      getClientCompanies(value.value);
    }
  }

  function handleClientFirmChange(value) {
    setSelectedClientFirm(value);
    setSelectedClientFirmErr("");

    const index = clientFirmData.findIndex(
      (element) => element.id === value.value
    );
    console.log(index);
    console.log(clientFirmData, "clientFirmData");

    if (index > -1) {
      setFirmName(clientFirmData[index].company_name);
      setAddress(clientFirmData[index].address);
      setGstNumber(clientFirmData[index].gst_number);
      setPanNumber(clientFirmData[index].pan_number);
      setSupState(clientFirmData[index].StateName.name);
      setSupCountry(clientFirmData[index].CountryName.name);
      setVendorStateId(clientFirmData[index].state);

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
        orderDetails: [],
        taxableAmount: "",
        sGstTot: "",
        cGstTot: "",
        iGstTot: "",
        roundOff: "",
        totalInvoiceAmt: "",
        rawMNarration: "",
        accNarration: "",
        balancePayable: "",
      });
    }
  }
  const vendorClientArr = [
    { id: 1, name: "Vendor" },
    { id: 2, name: "Client" },
  ];

  const handleNarrationClick = () => {
    console.log("handleNarr", narrationFlag);
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        flag: 21,
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
                        ? "View Raw Material Purchase Return"
                        : "Add Raw Material Purchase Return"}
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
                          onKeyDown={(e => e.preventDefault())}
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
                          className="view_consumablepurchase_dv"
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          options={oppositeAccData}
                          ref={SelectRef}
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
                    <p>Party voucher date</p>
                    <TextField
                    //  label="Party Voucher Date"
                    placeholder="Party voucher date"
                      type="date"
                      className="mb-16"
                      name="partyVoucherDate"
                      value={partyVoucherDate}
                      onKeyDown={(e => e.preventDefault())}
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
                          {" "}
                          Select load type
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
                    <div className="AddRawMaterialPurchaseReturn-tabel-dv view_rawMaterialPurchaseReturn_tabel">
                      <div
                        className="mt-16"
                        style={{
                          border: "1px solid #EBEEFB",
                          borderRadius: "7px",
                          paddingBottom: 5,
                        }}
                      >
                        <div
                          className="metal-tbl-head"
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
                            <div className={classes.tableheader}>
                              Variant Name
                            </div>
                          )}
                          <div className={clsx(classes.tableheader, "")}>
                            Variant Code
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            HSN
                          </div>
                          {selectedLoad === "1" && (
                            <div className={clsx(classes.tableheader, "")}>
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
                            className=" castum-row-dv addrow-select-input-row all-purchase-tabs"
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
                              <Select
                                filterOption={createFilter({
                                  ignoreAccents: false,
                                })}
                                className={classes.selectBox}
                                classes={classes}
                                styles={selectStyles}
                                options={stockCodeStone
                                  .filter((array) =>
                                    formValues.every(
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
                                options={stockCodeSilver
                                  .filter((array) =>
                                    formValues.every(
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
                                <Grid className="purchase-select-dv">
                                  <select
                                    id="purchase-select-dv"
                                    className={clsx(
                                      classes.normalSelect,
                                      "focusClass",
                                      "AddConsumablePurchase_table_border"
                                    )}
                                    required
                                    value={element.unitOfPurchase || ""}
                                    onChange={(e) => handleUnitChange(index, e)}
                                    disabled={isView}
                                    ref={(el) => (unitRef.current[index] = el)}
                                  >
                                    <option hidden value="">
                                      Select Unit type
                                    </option>
                                    {unitData.map((suggestion) => (
                                    <option
                                      name={suggestion.weight_or_quantity}
                                      value={suggestion.id}
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
                                </Grid>
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
                              inputRef={(el) => (qtyRef.current[index] = el)}
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                            />

                            <TextField
                              name="weight"
                              className={classes.inputBoxTEST}
                              type={isView ? "text" : "number"}
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
                              className=""
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
                          className="castum-row-dv"
                          style={{ fontWeight: "700", height: "30px" }}
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
                          {(selectedLoad === "1" || selectedLoad === "2") && (
                            <div
                              id="castum-width-table"
                              style={{}}
                              className={classes.tableheader}
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
                          {selectedLoad === "1" && (
                            <div
                              className={clsx(
                                classes.tableheader,
                                "castum-width-table"
                              )}
                            >
                              {/* Unit of purchase */}
                            </div>
                          )}
                          <div
                            className={clsx(
                              classes.tableheader,
                              "castum-width-table"
                            )}
                          >
                            {/* Last rate */}
                          </div>
                          <div
                            className={clsx(
                              classes.tableheader,
                              "castum-width-table"
                            )}
                          >
                            {/* Quantity */}
                          </div>
                          <div
                            className={clsx(
                              classes.tableheader,
                              "castum-width-table"
                            )}
                          >
                            {/* weight */}
                          </div>
                          <div
                            className={clsx(
                              classes.tableheader,
                              "castum-width-table"
                            )}
                          >
                            {/* Rate per unit */}
                          </div>
                          <div
                            className={clsx(
                              classes.tableheader,
                              "castum-width-table"
                            )}
                          >
                            {isView ? Config.numWithComma(amount) : amount}
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
                                  " castum-width-table"
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
                          disabled={isView || formValues[0].quantity === ""}
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
                        {isView
                          ? Config.numWithComma(totalInvoiceAmount)
                          : totalInvoiceAmount}
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
                        Raw material narration
                      </p>
                      <TextField
                        className="mt-1"
                        placeholder="Raw material marration"
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
                          className="w-224 mx-auto mt-16 mr-16 btn-print-save"
                          aria-label="Register"
                          hidden={isView}
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
                        <RawMaterialPurReturnPrintComp
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
                    purchase_flag="21"
                    concateDocument={concateDocument}
                    viewPopup={props.viewPopup}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddRawMaterialPurchaseReturn;

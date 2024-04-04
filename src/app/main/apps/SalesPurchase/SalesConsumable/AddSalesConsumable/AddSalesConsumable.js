import React, { useState, useEffect, useRef,useContext } from "react";
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
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import moment from "moment";
import Select, { createFilter } from "react-select";
import Loader from "app/main/Loader/Loader";
import History from "@history";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import { SalesConsumablePrint } from "../PrintComponent/SalesConsumablePrint";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
import HelperFunc from "../../Helper/HelperFunc";
import { UpdateNarration } from "../../Helper/UpdateNarration";
import { values } from "lodash";
import AppContext from "app/AppContext";
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
    normalSelect: {
        // marginTop: 8,
        padding: 8,
        fontSize: "12pt",
        borderColor: "darkgray",
        borderWidth: 1,
        borderRadius: 5,
        // width: "100%",
        // marginLeft: 15,
    },
    button: {
        margin: 5,
        textTransform: "none",
        backgroundColor: "gray",
        color: "white",
    },
}));

const AddSalesConsumable = (props) => {
  const appContext = useContext(AppContext);
  const { selectedDepartment } = appContext;
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [isView, setIsView] = useState(false);
  const SelectRef = useRef(null);
  const inputRef = useRef([]);

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");
  const [unitData, setUnitData] = useState([]);

  const vendorClientArr = [
    { id: 1, name: "Vendor" },
    { id: 2, name: "Client" },
  ];
  const [selectedVendorClient, setVendorClient] = useState({
    value: 1,
    label: "Vendor",
  });

  const [vendorData, setVendorData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedVendorErr, setSelectedVendorErr] = useState("");

  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");

  const [clientData, setClientData] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedClientErr, setSelectedClientErr] = useState("");

  const [clientFirmData, setClientFirmData] = useState([]);
  const [selectedClientFirm, setSelectedClientFirm] = useState("");
  const [selectedClientFirmErr, setSelectedClientFirmErr] = useState("");
  const [stateId, setStateId] = useState("");

  const [oppositeAccData, setOppositeAccData] = useState([]);
  const [oppositeAccSelected, setOppositeAccSelected] = useState("");
  const [selectedOppAccErr, setSelectedOppAccErr] = useState("");

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");

  const [formValues, setFormValues] = useState([
    {
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      unitOfPurchase: "",
      lastRate: "",
      quantity: "",
      ratePerUnit: "",
      Amount: "",
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
  const [stockCodeData, setStockCodeData] = useState([]);
  const [is_tds_tcs, setIs_tds_tcs] = useState("");

  const [subtotal, setSubtotal] = useState(0);
  const [lastTotal, setLastTotal] = useState(0);
  const [igstVal, setIGSTVal] = useState(0);
  const [cgstVal, setCgSTVal] = useState(0);
  const [sgstVal, setSGSTVal] = useState(0);
  const [totalGst, setTotalGst] = useState(0);
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);

  const [roundOff, setRoundOff] = useState("");
  const [roundOffErr, SetRoundOffErr] = useState("");

  const [tdsTcsVou, setTdsTcsVou] = useState("");
  const [ledgerName, setLedgerName] = useState("");
  const [rateValue, setRateValue] = useState("");
  const [ledgerAmount, setLegderAmount] = useState(0);
  const [ledgerAmtErr, setLedgerAmtErr] = useState("");

  const [finalAmount, setFinalAmount] = useState(0);

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [metalNarration, setMetalNarration] = useState("");
  const [metalNarrationErr, setMetalNarrationErr] = useState("");
  const [narrationFlag, setNarrationFlag] = useState(false);

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
    console.log(">>>>>>>>", selectedDepartment);
    //eslint-disable-next-line
    if (selectedDepartment !== "") {
      getStockCodeAll();
    }
  }, [selectedDepartment]);
  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 36)
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
    documentTitle: "Consumable_Purchase_Voucher_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  function checkforPrint() {
    var basicData = "";
    if (selectedVendorClient.value === 1 && selectedVendor) {
      basicData = selectedVendor.data;
    } else if (selectedVendorClient.value === 2 && selectedClientFirm) {
      basicData = selectedClientFirm.data;
    }

    setPrintObj({
      stateId: stateId,
      supplierName: basicData?.firm_name,
      supAddress: basicData?.address,
      supplierGstUinNum: basicData?.gst_number,
      supPanNum: basicData?.pan_number,
      supState: basicData?.StateName?.name || basicData?.state_name?.name,
      supCountry: basicData?.CountryName?.name || basicData?.country_name?.name,
      supStateCode:
        basicData?.StateName?.gst_code || basicData?.state_name?.gst_code,
      purcVoucherNum: voucherNumber,
      partyInvNum: partyVoucherNum,
      voucherDate: moment(voucherDate).format("DD-MM-YYYY"),
      placeOfSupply: basicData?.StateName?.name || basicData?.state_name?.name,
      quantity: "",
      orderDetails: formValues,
      taxableAmount: subtotal,
      sGstTot: sgstVal,
      cGstTot: cgstVal,
      iGstTot: igstVal,
      roundOff: roundOff,
      totalInvoiceAmt: totalInvoiceAmount,
      TDSTCSVoucherNum: tdsTcsVou,
      ledgerName: ledgerName,
      taxAmount: ledgerAmount,
      metNarration: metalNarration,
      accNarration: accNarration,
      balancePayable: finalAmount,
    });
    if (isView) {
      handlePrint();
    } else {
      if (
        !VoucherDtErr &&
        voucherNumValidation() &&
        partyNameValidation() &&
        oppositeAcValidation() &&
        // partyVoucherNumValidation() &&
        isAnyentryadded() &&
        entryValidation() &&
        validateEmptyError() &&
        !roundOffErr
      ) {
        addConsumablePurchase(false, true);
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
    return () => {
      console.log("cleaned up");
    };
  }, []);

  useEffect(() => {
    getUnitData();
    setOppositeAccData(
      HelperFunc.getOppositeAccountDetails("SalesOfConsumable")
    );
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true);
      getConsumePurchaseRecordForView(idToBeView.id);
    } else {
      setNarrationFlag(false);
      getStockCodeAll();
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
    if (selectedClient) {
      getClientCompanies(selectedClient.value);
    }
  }, [selectedClient]);

  useEffect(() => {
    if (idToBeView === undefined) {
      if (ledgerAmount && is_tds_tcs == 1 && ledgerName) {
        const changeRatesVal =
          (parseFloat(ledgerAmount) * 100) / parseFloat(totalInvoiceAmount);
        setRateValue(parseFloat(changeRatesVal).toFixed(3));
      }
    }
  }, [ledgerAmount]);

  useEffect(() => {
    if (totalGst && subtotal) {
      const roundOffval = roundOff ? roundOff : 0;
      const tempInvoioce = parseFloat(
        parseFloat(subtotal) + parseFloat(totalGst) + parseFloat(roundOffval)
      );
      setTotalInvoiceAmount(parseFloat(tempInvoioce).toFixed(3));
    }
  }, [totalGst, subtotal, roundOff]);

  useEffect(() => {
    if (is_tds_tcs == 1 && totalInvoiceAmount && rateValue) {
      const ledgeramt = parseFloat(
        (parseFloat(totalInvoiceAmount) * rateValue) / 100
      );
      const finalAmt = parseFloat(
        parseFloat(totalInvoiceAmount) + parseFloat(ledgeramt)
      ).toFixed(3);
      setLegderAmount(parseFloat(ledgeramt).toFixed(3));
      setFinalAmount(parseFloat(finalAmt).toFixed(3));
    } else if (is_tds_tcs == 2 && totalInvoiceAmount && subtotal && rateValue) {
      const ledgeramt = parseFloat((parseFloat(subtotal) * rateValue) / 100);
      const finalAmt = parseFloat(
        parseFloat(totalInvoiceAmount) - parseFloat(ledgeramt)
      ).toFixed(3);
      setLegderAmount(parseFloat(ledgeramt).toFixed(3));
      setFinalAmount(parseFloat(finalAmt).toFixed(3));
    } else {
      setFinalAmount(parseFloat(totalInvoiceAmount).toFixed(3));
    }
  }, [totalInvoiceAmount]);

  function getConsumePurchaseRecordForView(id) {
    setLoading(true);
    let api = "";
    if (props.forDeletedVoucher) {
      api = `api/salesofconsumable/${id}?deleted_at=1`;
    } else {
      api = `api/salesofconsumable/${id}`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              let finalData = response.data.data;
              console.log(finalData);
              if (finalData.is_vendor_client === 1) {
                setVendorClient({ value: 1, label: "Vendor" });
                var mainObj = finalData.Vendor;
                setSelectedVendor({
                  value: finalData.Vendor.id,
                  label: finalData.Vendor.name,
                  data: finalData.Vendor,
                });
                setFirmName(finalData.Vendor.firm_name);
                setIs_tds_tcs(finalData.Vendor.is_tds_tcs);
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
                  data: finalData.ClientCompany,
                });
                setIs_tds_tcs(finalData.ClientCompany.is_tds_tcs);
              }
              console.log(mainObj);
              setDocumentList(finalData.salesPurchaseDocs);
              setVoucherNumber(finalData.voucher_no);
              setPartyVoucherDate(finalData.party_voucher_date);
              setAllowedBackDate(true);
              setVoucherDate(
                moment(finalData.purchase_voucher_create_date).format(
                  "YYYY-MM-DD"
                )
              );
              setIs_tds_tcs(mainObj.is_tds_tcs);

              setOppositeAccSelected({
                value: finalData.opposite_account_id,
                label: finalData.SalesOfConsumableOppositeAccount.name,
              });
              setPartyVoucherNum(finalData.party_voucher_no);
              setRoundOff(
                finalData.round_off !== null ? finalData.round_off : ""
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
              setLastTotal(finalData.total);
              setAccNarration(
                finalData.account_narration !== null
                  ? finalData.account_narration
                  : ""
              );
              setMetalNarration(
                finalData.consumable_narration !== null
                  ? finalData.consumable_narration
                  : ""
              );
              var state = "";
              if (finalData.SalesOfConsumablePurchaseOrder[0].igst) {
                state = 0;
                setStateId(0);
              } else {
                state = 12;
                setStateId(12);
              }
              let tempArray = [];

              for (let item of finalData.SalesOfConsumablePurchaseOrder) {
                tempArray.push({
                  stockCode: {
                    value: item.StockNameCode.id,
                    label: item.StockNameCode.stock_code,
                  },
                  categoryName: item.stock_name,
                  selectedHsn: item.hsn_number ? item.hsn_number : "",
                  unitOfPurchase: item.unit_of_purchase,
                  lastRate:
                    item.last_rate === null
                      ? 0
                      : parseFloat(item.last_rate).toFixed(3),
                  quantity: item.quantity
                    ? item.quantity
                    : parseFloat(item.weight).toFixed(3),
                  ratePerUnit: parseFloat(item.rate).toFixed(3),
                  Amount: parseFloat(item.amount).toFixed(3),
                  CGSTPer: item?.cgst,
                  SGSTPer: item?.sgst,
                  IGSTPer: item?.igst,
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
                  errors: {},
                });
              }
              setFormValues(tempArray);
              const subTotalval = HelperFunc.getTotalOfField(
                tempArray,
                "Amount"
              );
              setSubtotal(parseFloat(subTotalval).toFixed(3));

              if (state === 12) {
                const sgstAddition = HelperFunc.getTotalOfField(
                  tempArray,
                  "SGSTval"
                );
                const cgstAddition = HelperFunc.getTotalOfField(
                  tempArray,
                  "CGSTval"
                );
                const totalgstVal = parseFloat(
                  parseFloat(sgstAddition) + parseFloat(cgstAddition)
                ).toFixed(3);
                setCgSTVal(parseFloat(cgstAddition).toFixed(3));
                setSGSTVal(parseFloat(sgstAddition).toFixed(3));
                setTotalGst(parseFloat(totalgstVal).toFixed(3));
              } else {
                const igstAddition = HelperFunc.getTotalOfField(
                  tempArray,
                  "IGSTVal"
                );
                setIGSTVal(parseFloat(igstAddition).toFixed(3));
                setTotalGst(parseFloat(igstAddition).toFixed(3));
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
        handleError(error, dispatch, { api: api });
      });
  }

  function getStockCodeAll() {
    if (selectedDepartment && selectedDepartment.value) {
      axios
        .get(
          Config.getCommonUrl() +
            `api/salesofconsumable/stockcode/listing?department_id=${
              selectedDepartment.value.split("-")[1]
            }`
        )
        .then(function (response) {
          if (response.data.success === true) {
            console.log(response);
            let tempStockData = response.data.data;
            setStockCodeData(tempStockData);
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
        })
        .catch((error) => {
          handleError(error, dispatch, {
            api: `api/salesofconsumable/stockcode/listing?department_id=${
              selectedDepartment.value.split("-")[1]
            }`,
          });
        });
    } else {
      console.error("selectedDepartment is undefined or does not have a value");
    }
  }

  function getVoucherNumber() {
    axios
      .get(Config.getCommonUrl() + "api/salesofconsumable/get/voucher")
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
        handleError(error, dispatch, {
          api: "api/salesofconsumable/get/voucher",
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
    } else if (name === "accNarration") {
      setAccNarration(value);
      setAccNarrationErr("");
    } else if (name === "ledgerAmount") {
      setLegderAmount(value);
      if (!isNaN(value) && value !== "") {
        setLedgerAmtErr("");
        const tempfinalAmount =
          parseFloat(totalInvoiceAmount) + parseFloat(value);
        setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));
      } else {
        setLedgerAmtErr("Please Enter Valid Amount");
        setFinalAmount(parseFloat(totalInvoiceAmount).toFixed(3));
      }
    } else if (name === "roundOff") {
      setRoundOff(value);
      if (value > 5 || value < -5) {
        SetRoundOffErr("Please Enter value between -5 to 5");
      } else {
        SetRoundOffErr("");
      }
    }
  }

  const handleChange = (i, e) => {
    const newFormValues = [...formValues];
    const nm = e.target.name;
    const val = e.target.value;
    newFormValues[i][nm] = val;
    newFormValues[i].errors[nm] = "";

    if (
      newFormValues[i].quantity &&
      newFormValues[i].ratePerUnit &&
      newFormValues[i].unitOfPurchase
    ) {
      newFormValues[i].Amount = parseFloat(
        parseFloat(newFormValues[i].ratePerUnit) *
          parseFloat(newFormValues[i].quantity)
      ).toFixed(3);
    }
    if (newFormValues[i].Amount) {
      if (
        stateId === 12 &&
        newFormValues[i].CGSTPer &&
        newFormValues[i].SGSTPer
      ) {
        const cgstVal = parseFloat(
          (parseFloat(newFormValues[i].Amount) *
            parseFloat(newFormValues[i].CGSTPer)) /
            100
        ).toFixed(3);
        const sgstVal = parseFloat(
          (parseFloat(newFormValues[i].Amount) *
            parseFloat(newFormValues[i].SGSTPer)) /
            100
        ).toFixed(3);
        newFormValues[i].CGSTval = parseFloat(cgstVal).toFixed(3);
        newFormValues[i].SGSTval = parseFloat(sgstVal).toFixed(3);
        newFormValues[i].Total = parseFloat(
          parseFloat(cgstVal) +
            parseFloat(sgstVal) +
            parseFloat(newFormValues[i].Amount)
        ).toFixed(3);
      } else if (stateId !== 12 && newFormValues[i].IGSTPer) {
        const igstVal = parseFloat(
          (parseFloat(newFormValues[i].Amount) *
            parseFloat(newFormValues[i].IGSTPer)) /
            100
        ).toFixed(3);
        newFormValues[i].IGSTVal = parseFloat(igstVal).toFixed(3);
        newFormValues[i].Total = parseFloat(
          parseFloat(igstVal) + parseFloat(newFormValues[i].Amount)
        ).toFixed(3);
      }
      calculateTotal(newFormValues);
    }
    setFormValues(newFormValues);
  };

  const calculateTotal = (arrData) => {
    const amountAddition = HelperFunc.getTotalOfField(arrData, "Amount");
    const totalAddition = HelperFunc.getTotalOfField(arrData, "Total");

    if (stateId === 12) {
      const sgstAddition = HelperFunc.getTotalOfField(arrData, "SGSTval");
      const cgstAddition = HelperFunc.getTotalOfField(arrData, "CGSTval");
      const totalgstVal = parseFloat(
        parseFloat(sgstAddition) + parseFloat(cgstAddition)
      ).toFixed(3);
      setCgSTVal(parseFloat(cgstAddition).toFixed(3));
      setSGSTVal(parseFloat(sgstAddition).toFixed(3));
      setTotalGst(parseFloat(totalgstVal).toFixed(3));
    } else {
      const igstAddition = HelperFunc.getTotalOfField(arrData, "IGSTVal");
      setIGSTVal(parseFloat(igstAddition).toFixed(3));
      setTotalGst(parseFloat(igstAddition).toFixed(3));
    }
    setSubtotal(parseFloat(amountAddition).toFixed(3));
    setLastTotal(parseFloat(totalAddition).toFixed(3));
  };

  function voucherNumValidation() {
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

  function oppositeAcValidation() {
    if (oppositeAccSelected === "") {
      setSelectedOppAccErr("Please Select Opposite Account");
      return false;
    }
    return true;
  }

  // function partyVoucherNumValidation() {
  //     if (partyVoucherNum === "") {
  //         setPartyVoucherNumErr("Enter Valid Voucher Number");
  //         return false;
  //     }
  //     return true;
  // }

  function isAnyentryadded() {
    if (formValues.length === 0 || formValues[0].stockCode === "") {
      dispatch(Actions.showMessage({ message: "Please Add Purchase Entry" }));
      return false;
    }
    return true;
  }

  const isAnyDataInrOW = (row) => {
    let valid = false;
    Object.values(row).forEach((val) => val.length > 0 && (valid = true));
    return valid;
  };

  function entryValidation() {
    const oldData = [...formValues];

    oldData.map((item) => {
      if (isAnyDataInrOW(item)) {
        if (item.stockCode === "") {
          item.errors.stockCode = "Select stock code";
        } else if (item.quantity === "") {
          item.errors.quantity = "Enter quantity";
        } else if (item.unitOfPurchase === "") {
          item.errors.unitOfPurchase = "Select unit of purchase";
        } else if (item.ratePerUnit === "") {
          item.errors.ratePerUnit = "Enter rate per unit";
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

  function handleFormSubmit(ev) {
    ev.preventDefault();
    if (
      !VoucherDtErr &&
      voucherNumValidation() &&
      partyNameValidation() &&
      oppositeAcValidation() &&
      // partyVoucherNumValidation() &&
      isAnyentryadded() &&
      entryValidation() &&
      validateEmptyError() &&
      !roundOffErr
    ) {
      addConsumablePurchase(true, false);
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
        flag: 36,
        id: idToBeView.id,
        consumable_narration: metalNarration,
        account_narration: accNarration,
      };
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

  function addConsumablePurchase(resetFlag, toBePrint) {
    setLoading(true);
    const Orders = [];
    formValues.map((x) => {
      if (x.stockCode) {
        Orders.push({
          stock_name_code_id: x.stockCode.value,
          unit_of_purchase: x.unitOfPurchase,
          quantity: x.quantity,
          weight: x.quantity,
          rate: x.ratePerUnit,
        });
      }
    });
    const body = {
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
      round_off: roundOff === "" ? 0 : roundOff,
      consumable_narration: metalNarration,
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
      .post(Config.getCommonUrl() + "api/salesofconsumable", body)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
          if (resetFlag === true) {
            checkAndReset();
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
        handleError(error, dispatch, {
          api: "api/salesofconsumable",
          body: body,
        });
      });
  }

  const updateDocumentArray = (id) => {
    let tempDocList = [...documentList];
    const arr = tempDocList.filter((x) => x.id !== id);
    setDocumentList(arr);
  };

  function resetForm() {
    setSelectedVendor("");
    setSelectedVendorErr("");
    setFirmName("");
    setFirmNameErr("");
    setSelectedClient("");
    setSelectedClientErr("");
    setSelectedClientFirm("");
    setSelectedClientFirmErr("");
    setStateId("");
    setOppositeAccSelected("");
    setSelectedOppAccErr("");
    setPartyVoucherNum("");
    setPartyVoucherNumErr("");
    setPartyVoucherDate("");
    setIs_tds_tcs("");
    setSubtotal(0);
    setLastTotal(0);
    setIGSTVal(0);
    setCgSTVal(0);
    setSGSTVal(0);
    setTotalGst(0);
    setTotalInvoiceAmount(0);
    setRoundOff("");
    SetRoundOffErr("");
    setTdsTcsVou("");
    setLedgerName("");
    setRateValue("");
    setLegderAmount(0);
    setLedgerAmtErr("");
    setFinalAmount(0);
    setAccNarration("");
    setAccNarrationErr("");
    setMetalNarration("");
    setMetalNarrationErr("");
    setNarrationFlag(false);
    setFormValues([
      {
        stockCode: "",
        categoryName: "",
        selectedHsn: "",
        unitOfPurchase: "",
        lastRate: "",
        quantity: "",
        ratePerUnit: "",
        Amount: "",
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
  }

  function findClosestPrevDate(arr, target) {
    console.log(arr);
    let targetDate = new Date(target);
    let previousDates = arr.filter(
      (e) => targetDate - new Date(e.change_date) >= 0
    );

    if (previousDates.length === 1) {
      return previousDates[0];
    }

    //nearest date in rate and date textfield
    let sortedPreviousDates = previousDates.sort(
      (a, b) => Date.parse(b.change_date) - Date.parse(a.change_date)
    );
    return sortedPreviousDates[0] || null;
  }

  const handleVendorClientChange = (value) => {
    resetForm();
    setVendorClient(value);
  };

  function getLedger(tcstds) {
    if (tcstds == 2) {
      var api = `api/ledgerMastar/tds/36`;
    } else if (tcstds == 1) {
      var api = `api/ledgerMastar/tcs/36`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const data = response.data.data[0];
          setLedgerName({
            value: data.id,
            label: data.Ledger.name,
          });
          let r1 = findClosestPrevDate(
            data.LedgerRate,
            moment().format("YYYY-MM-DD")
          );
          setRateValue(r1.rate);
          getTdsTcsVoucherNum(data.id);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: api });
      });
  }

  const callTdsdataset = (data) => {
    setStateId(data.state);
    setIs_tds_tcs(data.is_tds_tcs);
    if (data.is_tds_tcs != 0) {
      getLedger(data.is_tds_tcs);
    } else {
      setTdsTcsVou("");
      setRateValue("");
    }
    setLegderAmount(0); //everything is goinf to reset so 0
    SelectRef.current.focus();
  };

  function handlePartyChange(value) {
    resetForm();
    setSelectedVendor(value);
    setSelectedVendorErr("");
    callTdsdataset(value.data);
    const data = value.data;
    setFirmName(data.firm_name);
    setFirmNameErr("");
  }

  function handleClientPartyChange(value) {
    resetForm();
    setSelectedClient(value);
    setSelectedClientErr("");
    setSelectedClientFirm("");
    setSelectedClientFirmErr("");
  }

  function handleClientFirmChange(value) {
    setSelectedClientFirm(value);
    setSelectedClientFirmErr("");
    callTdsdataset(value.data);
  }

  function getTdsTcsVoucherNum(ledgerMasterId) {
    axios
      .get(
        Config.getCommonUrl() +
          `api/salesofconsumable/get/voucher/${ledgerMasterId}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          setTdsTcsVou(response.data.data.voucherNo);
        } else {
          setTdsTcsVou("");
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: `api/salesofconsumable/get/voucher/${ledgerMasterId}`,
        });
      });
  }

  function handleOppAccChange(value) {
    setOppositeAccSelected(value);
    setSelectedOppAccErr("");
  }

  const handleStockGroupChange = (i, e) => {
    if (partyNameValidation()) {
      let newFormValues = [...formValues];
      const arrData = e.data;
      newFormValues[i].stockCode = { value: e.value, label: e.label };
      newFormValues[i].errors.stockCode = "";
      newFormValues[i].categoryName = arrData.billing_name;
      newFormValues[i].selectedHsn = arrData.hsn_master.hsn_number;
      newFormValues[i].unitOfPurchase = arrData.stock_name_code.unitName?.id;

      if (stateId === 12) {
        const gstPerData = parseFloat(arrData.hsn_master.gst) / 2;
        newFormValues[i].CGSTPer = parseFloat(gstPerData);
        newFormValues[i].SGSTPer = parseFloat(gstPerData);
      } else {
        newFormValues[i].IGSTPer = parseFloat(arrData.hsn_master.gst);
      }
      getLastPrice(newFormValues, e.value, i);
      inputRef.current[i].focus();
    }
  };

  function getLastPrice(newFormValues, stockCodeId, index) {
    const idVendorClient = selectedVendor?.value || selectedClient?.value;
    const api = `api/salesofconsumable/lastprice/${idVendorClient}/${stockCodeId}`;
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);

          if (response.data.data !== null && response.data.data.length !== 0) {
            newFormValues[index].lastRate = response.data.data;
          } else {
            newFormValues[index].lastRate = 0;
          }
          setFormValues(newFormValues);
          newRowAdded();
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: api,
        });
      });
  }

  const newRowAdded = () => {
    setFormValues([
      ...formValues,
      {
        stockCode: "",
        categoryName: "",
        selectedHsn: "",
        unitOfPurchase: "",
        lastRate: "",
        quantity: "",
        ratePerUnit: "",
        Amount: "",
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
  };

  const deleteHandler = (index) => {
    const oldData = [...formValues];

    if (oldData[index + 1]) {
      const newData = oldData.filter((item, i) => {
        if (i !== index) return item;
        return false;
      });
      setFormValues(newData);
      calculateTotal(newData);
    } else {
      oldData[index].stockCode = "";
      oldData[index].categoryName = "";
      oldData[index].selectedHsn = "";
      oldData[index].unitOfPurchase = "";
      oldData[index].lastRate = "";
      oldData[index].quantity = "";
      oldData[index].ratePerUnit = "";
      oldData[index].Amount = "";
      oldData[index].CGSTPer = "";
      oldData[index].SGSTPer = "";
      oldData[index].IGSTPer = "";
      oldData[index].CGSTval = "";
      oldData[index].SGSTval = "";
      oldData[index].IGSTVal = "";
      oldData[index].Total = "";
      oldData[index].errors = {};
      calculateTotal(oldData);
      deleteHandler(oldData);
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


    return (
        <div className={clsx(classes.root, props.className, "w-full")}>
            <FuseAnimate animation="transition.slideUpIn" delay={200}>
                <div className="flex flex-col md:flex-row container">
                <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
                        {
                            !props.viewPopup && <Grid
                                container
                                spacing={4}
                                alignItems="stretch"
                                style={{ margin: 0 }}
                            >
                                <Grid item xs={7} sm={7} md={7} key="1" style={{ padding: 0 }}>
                                    <FuseAnimate delay={300}>
                                    <Typography className="pl-28 pt-16 text-18 font-700">
                                            {isView 
                                            ? "View Sales Consumable" 
                                            : "Add Sales Consumable"}
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
                                    style={{ textAlign: "right", paddingRight: "60px" }}
                                >
                                   <div className="btn-back mt-2">
                    <Button
                      id="btn-back"
                      size="small"
                      onClick={(event) => {
                        History.goBack();
                      }}
                    >
                      <img className="back_arrow" 
                      src={Icones.arrow_left_pagination} 
                      alt="" />

                      Back
                    </Button>
                  </div>
                                </Grid>
                            </Grid>
                        }
            <div className="main-div-alll">

                        {loading && <Loader />}
                        <div
                            className="pb-32 pt-32 pl-16 pr-16"
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
                                                placeholder="Voucher Number"
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
                      <p style={{ paddingBottom: "3px" }}>Party Name</p>

                                                    <Select
                                                        id="view_jewellary_dv"
                                                        filterOption={createFilter({ ignoreAccents: false })}
                                                        classes={classes}
                                                        styles={selectStyles}
                                                        options={vendorData.map((suggestion) => ({
                                                            value: suggestion.id,
                                                            label: suggestion.name,
                                                            data : suggestion
                                                        }))}
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
                      <p style={{ paddingBottom: "3px" }}>Firm Name</p>

                                                    <TextField
                                                        className=""
                                                        placeholder="Firm Name"
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
                                                            data : suggestion
                                                        }))}
                                                        autoFocus
                                                        blurInputOnSelect
                                                        tabSelectsValue={false}
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
                      <p style={{ paddingBottom: "3px" }}>Firm Name</p>
                                                  
                                                    <Select
                                                        className="view_consumablepurchase_dv"
                                                        filterOption={createFilter({ ignoreAccents: false })}
                                                        classes={classes}
                                                        styles={selectStyles}
                                                        options={clientFirmData.map((suggestion) => ({
                                                            value: suggestion.id,
                                                            label: suggestion.company_name,
                                                            data : suggestion
                                                        }))}
                                                        blurInputOnSelect
                                                        tabSelectsValue={false}
                                                        value={selectedClientFirm}
                                                        onChange={handleClientFirmChange}
                                                        placeholder="Firm Name"
                                                        isDisabled={isView}
                                                    />
                                                    <span style={{ color: "red" }}>
                                                        {selectedClientFirmErr.length > 0 ? selectedClientFirmErr : ""}
                                                    </span>
                                                </Grid></>
                                        }
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
                                                ref={SelectRef}
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
                                                placeholder="Party Voucher Number"
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
                      <p style={{ paddingBottom: "3px" }}>Party Voucher Date</p>

                                            <TextField
                                                placeholder="Party Voucher Date"
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
                                        {!isView &&
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
                                                    placeholder="Upload Document"
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
                                    </Grid>

                                    <div
                                        className="AddConsumablePurchase-tabel AddConsumablePurchase-tabel-blg "
                                        style={{ border: "1px solid #D1D8F5", paddingBottom: 5,borderRadius: "7px", }}
                                    >
                                        <div
                                            className="metal-tbl-head"
                                            style={{ background: "#EBEEFB", fontWeight: "700" }}
                                        >
                                            {!isView &&
                                                <div id="castum-width-table" className={clsx(classes.tableheader, "delete_icons_dv")}>
                                                    {/* delete action */}
                                                </div>
                                            }
                                            <div id="castum-width-table" className={classes.tableheader}>
                                                Category Variant
                                            </div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                Category Name
                                            </div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                HSN
                                            </div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                Last rate
                                            </div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                Quantity
                                            </div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                Unit of purchase
                                            </div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                Rate per unit
                                            </div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                Amount
                                            </div>

                                            {
                                            stateId === 12 ?
                                            <> <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                CGST (%)
                                            </div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                SGST (%)
                                            </div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                CGST
                                            </div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                SGST
                                            </div></> 
                                            : <>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                IGST (%)
                                            </div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                IGST
                                            </div>
                                            </>}
                                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                Total
                                            </div>
                                        </div>

                                        {formValues.map((element, index) => (
                                            <div key={index} className=" castum-row-dv">
                                                {!isView &&

                                                    <div className={clsx(classes.tableheader, "delete_icons_dv")}>
                                                        <IconButton
                                                            tabIndex="-1"
                                                            style={{ padding: "0" }}
                                                            disabled={element.stockCode === ""}
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
                                                }
                                                <Select
                                                    className={classes.selectBox}
                                                    filterOption={createFilter({ ignoreAccents: false })}
                                                    classes={classes}
                                                    styles={selectStyles}
                                                    options={stockCodeData
                                                        .filter(
                                                            (element) => element.stock_name_code !== null
                                                        )
                                                        .map((suggestion) => ({
                                                            value: suggestion.stock_name_code.id,
                                                            label: suggestion.stock_name_code.stock_code,
                                                            data : suggestion
                                                        }))}
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

                                                <span style={{ color: "red" }}>
                                                    {element.errors?.stockCode ? element.errors.stockCode : ""}
                                                </span>

                                                <TextField
                                                    name="categoryName"
                                                    value={element.categoryName || ""}
                                                    disabled
                                                    variant="outlined"
                                                    fullWidth
                                                />
                                                <TextField
                                                    name="selectedHsn"
                                                    value={element.selectedHsn || ""}
                                                    disabled
                                                    variant="outlined"
                                                    fullWidth
                                                />
                                                <TextField
                                                    name="lastRate"
                                                    className=""
                                                    value={isView ? Config.numWithComma(element.lastRate) : element.lastRate}
                                                    variant="outlined"
                                                    fullWidth
                                                    disabled
                                                />
                                                <TextField
                                                    name="quantity"
                                                    className={classes.inputBoxTEST}
                                                    type={isView ? "text" : "number"}
                                                    value={element.quantity}
                                                    error={element.errors.quantity ? true : false}
                                                    helperText={element.errors.quantity ? element.errors.quantity : ""}
                                                    onChange={(e) => handleChange(index, e)}
                                                    inputRef={(el) => (inputRef.current[index] = el)}
                                                    variant="outlined"
                                                    fullWidth
                                                    disabled={isView || element.stockCode === ""}
                                                />
                                                <select
                                                    className={clsx(classes.normalSelect, "unit_purchase_castum", "focusClass")}
                                                    required
                                                    name="unitOfPurchase"
                                                    value={element.unitOfPurchase || ""}
                                                    onChange={(e) => handleChange(index, e)}
                                                    disabled={isView ||  element.stockCode === ""}
                                                >
                                                    <option hidden value="">
                                                        Select Unit type
                                                    </option>
                                                    {  unitData.map((suggestion) =>(
                                                    <option value={suggestion.id}>{suggestion.unit_name} </option>
                                                   ))}
                                                </select>
                                                <span style={{ color: "red" }}>
                                                    {element.errors.unitOfPurchase ? element.errors.unitOfPurchase : ""}
                                                </span>
                                                <TextField
                                                    name="ratePerUnit"
                                                    className={classes.inputBoxTEST}
                                                    type={isView ? "text" : "number"}
                                                    value={isView ? Config.numWithComma(element.ratePerUnit) : element.ratePerUnit || ""}
                                                    error={element.errors.ratePerUnit ? true : false}
                                                    helperText={element.errors.ratePerUnit ? element.errors.ratePerUnit : ""}
                                                    onChange={(e) => handleChange(index, e)}
                                                    variant="outlined"
                                                    fullWidth
                                                    disabled={isView ||  element.stockCode === ""}
                                                />
                                                <TextField
                                                    name="Amount"
                                                    className={classes.inputBoxTEST}
                                                    type={isView ? "text" : "number"}
                                                    value={isView ? Config.numWithComma(element.Amount) : element.Amount || ""}
                                                    variant="outlined"
                                                    fullWidth
                                                    disabled
                                                />
                                                {
                                                    stateId === 12 ? <> <TextField
                                                    name="CGSTPer"
                                                    className=""
                                                    value={element.CGSTPer || ""}
                                                    variant="outlined"
                                                    fullWidth
                                                    disabled
                                                />
                                                <TextField
                                                    name="SGSTPer"
                                                    className=""
                                                    value={element.SGSTPer || ""}
                                                    variant="outlined"
                                                    fullWidth
                                                    disabled
                                                />
                                                <TextField
                                                    name="CGSTval"
                                                    className=""
                                                    value={isView ? Config.numWithComma(element?.CGSTval) : element.CGSTval || ""}
                                                    variant="outlined"
                                                    fullWidth
                                                    disabled
                                                />
                                                <TextField
                                                    name="SGSTval"
                                                    className=""
                                                    value={isView ? Config.numWithComma(element?.SGSTval) : element.SGSTval || ""}
                                                    variant="outlined"
                                                    fullWidth
                                                    disabled
                                                /></> :<> <TextField
                                                    name="IGSTPer"
                                                    className=""
                                                    value={element.IGSTPer || ""}
                                                    variant="outlined"
                                                    fullWidth
                                                    disabled
                                                />
                                                <TextField
                                                    name="IGSTVal"
                                                    className=""
                                                    value={isView ? Config.numWithComma(element?.IGSTVal) : element.IGSTVal || ""}
                                                    variant="outlined"
                                                    fullWidth
                                                    disabled
                                                />
                                                </>}
                                                <TextField
                                                    name="Total"
                                                    className=""
                                                    value={isView ? Config.numWithComma(element.Total) : element.Total || ""}
                                                    variant="outlined"
                                                    fullWidth
                                                    disabled
                                                />
                                            </div>
                                        ))}

                                        <div className="mt-5 castum-row-dv" style={{ fontWeight: "700", height: "30px" }}>
                                            {!isView &&
                                                <div 
                                                    className={clsx(classes.tableheader, "delete_icons_dv castum-width-table")}
                                                ></div>
                                            }
                                            <div className={clsx(classes.tableheader, "castum-width-table")} ></div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}></div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}></div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}></div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}></div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}></div>
                                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                {isView ? Config.numWithComma(subtotal) : subtotal}
                                            </div>
                                            {
                                                stateId === 12 ? <> 
                                                <div className={clsx(classes.tableheader, "castum-width-table")}></div>
                                                <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                    {isView ? Config.numWithComma(cgstVal) : cgstVal}
                                                </div>
                                                <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                    {isView ? Config.numWithComma(sgstVal) : sgstVal}
                                                </div>
                                                </> : <>
                                                <div className={clsx(classes.tableheader, "castum-width-table")}></div>
                                                <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                    {isView ? Config.numWithComma(igstVal) : igstVal}
                                                </div>
                                                </>
                                            }
                                            <div className={clsx(classes.tableheader, "castum-width-table")}>
                                                {isView ? Config.numWithComma(lastTotal) : lastTotal}
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
                                    <div style={{ display: "flex", alignItems: "center",width: "35%", }}>
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
                                    <div style={{ display: "flex", alignItems: "center",width: "35%", }}>
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
                                        style={{ display: "flex", alignItems: "center",width: "35%", }}
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
                                                error={roundOffErr.length > 0 ? true : false}
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
                                        <label className="ml-2"> {isView ? Config.numWithComma(totalInvoiceAmount) : parseFloat(totalInvoiceAmount).toFixed(3)}</label>
                                    </div>
                                </div>
                                {!props.viewPopup && <div
                                    className="mt-16"
                                    style={{  paddingBottom: 5 }}
                                >
                                    <div
                                        className="metal-tbl-head"
                                        style={{ background: "#EBEEFB", fontWeight: "700",borderRadius: "7px" }}
                                    >
                                        <div className={classes.tableheader}>Ledger Name</div>

                                        <div className={classes.tableheader}>TDS/TCS Vou. Num</div>

                                        <div className={classes.tableheader}>(%)</div>

                                        <div className={classes.tableheader}>Amount</div>
                                    </div>

                                    <div className="mt-5 table-row-source">
                                        <TextField
                                            placeholder="Ledger Name"
                                            className="ml-2"
                                            value={ledgerName?ledgerName.label:""}
                                            variant="outlined"
                                            fullWidth
                                            disabled
                                        />
                                        <TextField
                                            name="tdsTcsVou"
                                            className="ml-2"
                                            value={tdsTcsVou}
                                            variant="outlined"
                                            fullWidth
                                            disabled
                                        />
                                        <TextField
                                            name="rateValue"
                                            className="ml-2"
                                            value={!isNaN(rateValue) ? rateValue : ""}
                                            variant="outlined"
                                            fullWidth
                                            disabled
                                        />
                                        <TextField
                                            name="ledgerAmount"
                                            className="ml-2"
                                            value={isView ? Config.numWithComma(ledgerAmount) : !isNaN(ledgerAmount) ? ledgerAmount : ""}
                                            error={ledgerAmtErr.length > 0 ? true : false}
                                            helperText={ledgerAmtErr}
                                            onChange={(e) => handleInputChange(e)}
                                            variant="outlined"
                                            fullWidth
                                            disabled={is_tds_tcs != 1 || isView}
                                        />
                                    </div>
                                </div>
                                }

                                <div
                                    id="jewellery-head"
                                    className="mt-16"
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
                                        style={{ float: "right", backgroundColor: "limegreen" }}
                                        className="w-224 mx-auto mt-16 mr-16 btn-print-save"
                                        aria-label="Register"
                                        onClick={checkforPrint}
                                    >
                                        {isView ? "Print" : "Save & Print"}
                                    </Button>
                                    {isView &&
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
                                    }
                                    < div style={{ display: "none" }}>
                                        <SalesConsumablePrint ref={componentRef} printObj={printObj} />
                                    </div>
                                </div>
                                }
                                {isView &&
                                    <Button
                                        variant="contained"
                                        className={clsx(classes.button, "mt-16 mr-16 btn-print-save")} onClick={() => setDocModal(true)}>
                                        View Documents
                                    </Button>
                                }
                            </div>
                        </div>
                        </div>
                        <ViewDocModal documentList={documentList} handleClose={handleDocModalClose} open={docModal} updateDocument={updateDocumentArray}
                            purchase_flag_id={idToBeView?.id} purchase_flag="36" concateDocument={concateDocument} viewPopup={props.viewPopup} />
                    </div>
                </div>
            </FuseAnimate>
        </div>
    );
}

export default AddSalesConsumable
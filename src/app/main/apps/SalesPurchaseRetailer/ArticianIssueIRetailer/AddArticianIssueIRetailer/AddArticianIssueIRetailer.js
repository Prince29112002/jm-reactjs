import React, { useState, useEffect, useRef } from "react";
import { Paper, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography } from "@material-ui/core";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { useDispatch } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import History from "@history";
import Select, { createFilter } from "react-select";
import Loader from "app/main/Loader/Loader";
import moment from "moment";
import { Icon, IconButton } from "@material-ui/core";
import { ArticianIssueRetailerPrintComp } from "../PrintComponentRetailer/ArticianIssueRetailerPrintComp";
import { useReactToPrint } from "react-to-print";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "app/main/apps/SalesPurchase/Helper/ViewDocModal";
import { UpdateNarration } from "app/main/apps/SalesPurchase/Helper/UpdateNarration";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
import { UpdateRetailerNarration } from "../../Helper/UpdateRetailerNarration";
import ViewDocModelRetailer from "app/main/apps/SalesPurchase/Helper/ViewDocModelRetailer";
import { DocumentUploadRetailer } from "app/main/apps/SalesPurchase/Helper/DocumentUploadRetailer";

import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  form: {
    marginTop: "3%",
    display: "contents",
  },
  table: {
    minWidth: 1000
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  tableRowPad: {
    padding: "7px !important"
  },
  tablePad: {
    padding: "0px !important"
  },
  selectBox: {
    // marginTop: 8,
    // padding: 8,
    // fontSize: "12pt",
    marginLeft: "0.5rem",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 0,
    width: "100%",
    display: "inline-block",
    // marginLeft: 15,
  },
  normalSelect: {
    // marginTop: 8,
    padding: 6,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 0,
    width: "100%",
    // marginLeft: 15,
  },
  tableheader: {
    display: "inline-block",
    textAlign: "center",
  },
  button: {
    // margin: 5,
    textTransform: "none",
    // backgroundColor: "gray",
    color: "white",
  },
  tableFooter: {
    height: 35,
    backgroundColor: "#EBEEFB !important",
  },
}));

const AddArticianIssueIRetailer = (props) => {
  const [printObj, setPrintObj] = useState({
    loadType: "",
    stateId: "",
    supplierName: "",
    supAddress: "",
    supplierGstUinNum: "",
    purcVoucherNum: "",
    voucherDate: "",
    supPanNum: "",
    supState: "",
    supCountry: "",
    supStateCode: "",
    purcVoucherNum: "",
    voucherDate: moment().format("DD-MM-YYYY"),
    placeOfSupply: "",
    orderDetails: [],
    grossWtTOt: "",
    netWtTOt: "",
    fineWtTot: "",
    amount: "",
    sGstTot: "",
    cGstTot: "",
    iGstTot: "",
    totalAmount: "",
    metalNarration: "",
    accNarration: "",
  });

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);
  const loadTypeRef = useRef(null);

  const handleAfterPrint = () => {
    //React.useCallback

    checkAndReset();
  };
  const inputRef = useRef([]);

  function checkAndReset() {
    if (isView === false) {
      History.goBack();
    }
  }
  const [documentList, setDocumentList] = useState([]);
  const [docModal, setDocModal] = useState(false);
  const [docFile, setDocFile] = useState("");
  const [narrationFlag, setNarrationFlag] = useState(false);
  const [docIds, setDocIds] = useState([]);
  useEffect(() => {
    if (docFile) {
      DocumentUploadRetailer(docFile, 27)
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

  const handleDocModalClose = () => {
    setDocModal(false);
  };

  const handleBeforePrint = React.useCallback(() => {}, []);

  useEffect(() => {
    // if (props.reportView === "Report") {
    //   NavbarSetting("Factory Report", dispatch);
    // } else if (props.reportView === "Account") {
    //   NavbarSetting("Accounts", dispatch);
    // } else {
    //    NavbarSetting("Sales-Retailer", dispatch);
    // }
    //eslint-disable-next-line
    NavbarSetting("Sales-Retailer", dispatch);
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
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
    documentTitle: "Artisan_Issue_Cum_Delivery_Challan_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  useEffect(() => {
    return () => {};
  }, []);

  function checkforPrint() {
    if (
      goldRateValueValidation() &&
      voucherNumValidation() &&
      partyNameValidation()
      // && partyVoucherNumValidation()
    ) {
      if (isView) {
        handlePrint();
      } else {
        if (prevContactIsValid()) {
          addArticianIssueApi(false, true);
        }
      }
    }
  }

  const dispatch = useDispatch();

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [loading, setLoading] = useState(false);

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [jobworkerData, setJobworkerData] = useState([]);
  const [selectedJobWorker, setSelectedJobWorker] = useState("");
  const [selectedJobWorkerErr, setSelectedJobWorkerErr] = useState("");

  // const [partyVoucherNum, setPartyVoucherNum] = useState("");
  // const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");

  const [stockCodeData, setStockCodeData] = useState([]);
  // const [stockCodeFindings, setStockCodeFindings] = useState([]);

  const [lotdata, setLotData] = useState([]);
  const [searchData, setSearchData] = useState("");

  const [stateId, setStateId] = useState("");

  const [partyVoucherDate, setPartyVoucherDate] = useState("");

  //below table total val field
  const [amount, setAmount] = useState("");

  const [fineGoldTotal, setFineGoldTotal] = useState("");

  const [totalGrossWeight, setTotalGrossWeight] = useState("");
  const [totalNetWeight, setTotalNetWeight] = useState("");

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [metalNarration, setMetalNarration] = useState("");
  const [metalNarrationErr, setMetalNarrationErr] = useState("");

  const [goldrateValue, setGoldRateValue] = useState("");
  const [goldratPercentage, setGoldratPercentage] = useState("");
  const [silverRate, setSilverRate] = useState("");
  const [silverRateErr, setSilverRateErr] = useState("");
  const [actualSilverrate, setActualSilverrate] = useState(false);
  const [silverMaxValue, setSilverMaxValue] = useState(0);
  const [silverMinValue, setSilverMinValue] = useState(0);
  const [oldGoldRate, setoldGoldRate] = useState("");
  const [goldrateValueErr, setGoldRateValueErr] = useState("");
  const [Party, setParty] = useState("");
  const theme = useTheme();

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000); // 10초 뒤에
    }
  }, [loading]);

  if (props.location) {
    var idToBeView = props.location.state;
  } else if (props.voucherId) {
    var idToBeView = { id: props.voucherId };
  }
  const [isView, setIsView] = useState(false); //for view Only

  const pcsInputRef = useRef([]); //for pcs in table
  const wtInputRef = useRef([]); //for weight in table
  //stock_group {gold:1,silver:2,Bronze:3,Consumable:4,Stone:5,Other raw Material:6,"puregold:7}
  const [formValues, setFormValues] = useState([
    {
      lotno: "",
      stockCode: "",
      stock_group: "", // 1- gold 2- silver 3 -bronze
      categoryName: "",
      HSNnum: "",
      grossWeight: "",
      netWeight: "",
      goldrateValue: "",
      pcs: "",
      availWeight: "",
      availPcs: "",
      availableStock: "",
      purity: "",
      fineGold: "",
      amount: "",
      cgstPer: "",
      sgstPer: "",
      igstPer: "",
      cgstVal: "",
      sgstVal: "",
      igstVal: "",
      totalAmount: "",
      isGoldSilver: "",
      errors: {
        lotno: null,
        stockCode: null,
        categoryName: null,
        grossWeight: null,
        netWeight: null,
        pcs: null,
        purity: null,
        fineGold: null,
        amount: null,
      },
    },
    {
      lotno: "",
      stockCode: "",
      stock_group: "", // 1- gold 2- silver 3 -bronze
      categoryName: "",
      HSNnum: "",
      grossWeight: "",
      netWeight: "",
      pcs: "",
      availWeight: "",
      availPcs: "",
      availableStock: "",
      purity: "",
      fineGold: "",
      amount: "",
      cgstPer: "",
      sgstPer: "",
      igstPer: "",
      cgstVal: "",
      sgstVal: "",
      igstVal: "",
      totalAmount: "",
      errors: {
        lotno: null,
        stockCode: null,
        categoryName: null,
        grossWeight: null,
        netWeight: null,
        pcs: null,
        purity: null,
        fineGold: null,
        amount: null,
      },
    },
    {
      lotno: "",
      stockCode: "",
      stock_group: "", // 1- gold 2- silver 3 -bronze
      categoryName: "",
      HSNnum: "",
      grossWeight: "",
      netWeight: "",
      pcs: "",
      availWeight: "",
      availPcs: "",
      availableStock: "",
      purity: "",
      fineGold: "",
      amount: "",
      cgstPer: "",
      sgstPer: "",
      igstPer: "",
      cgstVal: "",
      sgstVal: "",
      igstVal: "",
      totalAmount: "",
      errors: {
        lotno: null,
        stockCode: null,
        categoryName: null,
        grossWeight: null,
        netWeight: null,
        pcs: null,
        purity: null,
        fineGold: null,
        amount: null,
      },
    },
    {
      lotno: "",
      stockCode: "",
      stock_group: "", // 1- gold 2- silver 3 -bronze
      categoryName: "",
      HSNnum: "",
      grossWeight: "",
      netWeight: "",
      pcs: "",
      availWeight: "",
      availPcs: "",
      availableStock: "",
      purity: "",
      fineGold: "",
      amount: "",
      cgstPer: "",
      sgstPer: "",
      igstPer: "",
      cgstVal: "",
      sgstVal: "",
      igstVal: "",
      totalAmount: "",
      errors: {
        lotno: null,
        stockCode: null,
        categoryName: null,
        grossWeight: null,
        netWeight: null,
        pcs: null,
        purity: null,
        fineGold: null,
        amount: null,
      },
    },
  ]);

  let handleStockGroupChange = (i, e) => {
    console.log(e);
    let newFormValues = [...formValues];
    newFormValues[i].stockCode = {
      value: e.value,
      label: e.label,
      pcs_require: e.pcs_require,
    };
    newFormValues[i].errors.stockCode = null;

    let findIndex = stockCodeData.findIndex(
      (item) => item.stock_name_code.id === e.value
    );
    if (findIndex > -1) {
      newFormValues[i].stock_group =
        stockCodeData[findIndex].stock_group.item_id;
      newFormValues[i].grossWeight = "";
      newFormValues[i].netWeight = "";
      newFormValues[i].amount = "";
      newFormValues[i].lotno = "";
      newFormValues[i].pcs = "";
      newFormValues[i].availPcs = stockCodeData[findIndex].pcs;
      newFormValues[i].availWeight = stockCodeData[findIndex].weight;
      newFormValues[i].availableStock =
        stockCodeData[findIndex].stock_group.item_id === 1
          ? "Wt: " + parseFloat(stockCodeData[findIndex].weight).toFixed(3)
          : "Wt: " + parseFloat(stockCodeData[findIndex].weight).toFixed(3);
      parseFloat(stockCodeData[findIndex].weight).toFixed(3);
      //  "Wt: " + parseFloat(stockCodeData[findIndex].weight).toFixed(3) + ", Pcs :" + stockCodeData[findIndex].pcs;

      newFormValues[i].HSNnum = stockCodeData[findIndex].hsn_master.hsn_number;

      newFormValues[i].cgstPer =
        stateId === 12
          ? parseFloat(
              parseFloat(stockCodeData[findIndex].hsn_master.gst) / 2
            ).toFixed(3)
          : "0";
      newFormValues[i].sgstPer =
        stateId === 12
          ? parseFloat(
              parseFloat(stockCodeData[findIndex].hsn_master.gst) / 2
            ).toFixed(3)
          : "0";
      newFormValues[i].igstPer =
        stateId !== 12
          ? parseFloat(stockCodeData[findIndex].hsn_master.gst).toFixed(3)
          : "0";
      newFormValues[i].cgstVal = "";
      newFormValues[i].sgstVal = "";
      newFormValues[i].igstVal = "";
      newFormValues[i].totalAmount = "";
      // 1- gold 2- silver 3 -bronze
      // if (stockCodeData[findIndex].stock_group.item_id === 1) {
      newFormValues[i].purity =
        stockCodeData[findIndex]?.stock_name_code?.purity;
      // }
      // else {
      //   newFormValues[i].purity = "0";
      // }

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
        newFormValues[i].fineGold = "0";
      }

      newFormValues[i].categoryName = stockCodeData[findIndex].stock_name;
      newFormValues[i].errors.categoryName = null;
      newFormValues[i].isGoldSilver = stockCodeData[findIndex].stock_group.group_name;
    }

    if (i === formValues.length - 1) {
      // addFormFields();
      changeTotal(newFormValues, true);
    } else {
      changeTotal(newFormValues, false);
    }

    if (newFormValues[i].stock_group !== 5) {
      wtInputRef.current[i].focus();
    } else {
      setTimeout(() => {
        pcsInputRef.current[i].focus();
      }, 200);
    }
  };

  function changeTotal(newFormValues, addFlag) {
    function amount(item) {
      return item.amount;
    }

    function grossWeight(item) {
      return parseFloat(item.grossWeight);
    }

    function fineGold(item) {
      return parseFloat(item.fineGold);
    }

    let tempFineGold = newFormValues
      .filter((item) => item.fineGold !== "")
      .map(fineGold)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

    let tempAmount = newFormValues
      .filter((item) => item.amount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    //.reduce(sum);
    setAmount(parseFloat(tempAmount).toFixed(3));

    let tempGrossWtTot = parseFloat(
      newFormValues
        .filter((data) => data.grossWeight !== "")
        .map(grossWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

    function netWeight(item) {
      return parseFloat(item.netWeight);
    }

    let tempNetWtTot = parseFloat(
      newFormValues
        .filter((data) => data.netWeight !== "")
        .map(netWeight)
        .reduce(function (a, b) {
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

    function CGSTval(item) {
      return item.cgstVal;
    }

    function SGSTval(item) {
      return item.sgstVal;
    }

    function IGSTVal(item) {
      return item.igstVal;
    }

    let tempCgstVal = 0;
    let tempSgstVal = 0;
    let tempIgstVal = 0;

    if (stateId === 12) {
      tempCgstVal = newFormValues
        .filter((item) => item.cgstVal !== "")
        .map(CGSTval)
        .reduce(function (a, b) {
          return parseFloat(a) + parseFloat(b);
        }, 0);

      tempSgstVal = newFormValues
        .filter((item) => item.sgstVal !== "")
        .map(SGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
    } else {
      tempIgstVal = newFormValues
        .filter((item) => item.igstVal !== "")
        .map(IGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
    }

    function totalAmount(item) {
      return parseFloat(item.totalAmount);
    }

    let tempTotal = newFormValues
      .filter((item) => item.totalAmount !== "")
      .map(totalAmount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setPrintObj({
      ...printObj,
      orderDetails: newFormValues,
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      fineWtTot: parseFloat(tempFineGold).toFixed(3),
      amount: parseFloat(tempAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCgstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      totalAmount: parseFloat(tempTotal).toFixed(3),
    });

    if (addFlag === true) {
      setFormValues([
        ...newFormValues,
        {
          lotno: "",
          stockCode: "",
          stock_group: "", // 1- gold 2- silver 3 -bronze
          categoryName: "",
          HSNnum: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          availWeight: "",
          availPcs: "",
          availableStock: "",
          purity: "",
          fineGold: "",
          amount: "",
          cgstPer: "",
          sgstPer: "",
          igstPer: "",
          cgstVal: "",
          sgstVal: "",
          igstVal: "",
          totalAmount: "",
          errors: {
            lotno: null,
            stockCode: null,
            categoryName: null,
            grossWeight: null,
            netWeight: null,
            pcs: null,
            purity: null,
            fineGold: null,
            amount: null,
          },
        },
      ]);
    } else {
      setFormValues(newFormValues);
    }
  }

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
    getJobworkerdata();
    // getDepartmentData();
    // getStockCodeFindingVariant();
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true);
      getArticianIssueRecord(idToBeView.id);
    } else {
      setNarrationFlag(false);
      getStockCodeAll();
      getTodaysGoldRate();
      getTodaysSilverRate();
      getVoucherNumber(); //if view only then no need to get new voucher number, we will set data coming from api
    }
    setTimeout(() => {
      if (loadTypeRef.current) {
        loadTypeRef.current.focus();
      }
    }, 800);
    //eslint-disable-next-line
  }, []);

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

  function getArticianIssueRecord(id) {
    setLoading(true);
    let api = "";
    if (props.forDeletedVoucher) {
      api = `retailerProduct/api/jobworkarticianissue/${id}?deleted_at=1`;
    } else {
      api = `retailerProduct/api/jobworkarticianissue/${id}`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response.data.data);

        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              let finalData = response.data.data;
              let loadType = 0;
              setGoldRateValue(
                finalData.JobWorkArticiaIssueOrder[0].rate_of_fine_gold
              );
              setDocumentList(finalData.salesPurchaseDocs);
              // setPartyVoucherDate(finalData.purchase_voucher_create_date);
              setVoucherNumber(finalData.voucher_no);
              setAllowedBackDate(true);
              setVoucherDate(finalData.purchase_voucher_create_date);
              setSelectedJobWorker({
                value: finalData?.JobWorker?.id,
                label: finalData?.JobWorker?.name,
              });

              setAccNarration(
                finalData.account_narration !== null
                  ? finalData.account_narration
                  : ""
              );
              setMetalNarration(
                finalData.metal_narration !== null
                  ? finalData.metal_narration
                  : ""
              );
              const rets =
                finalData.JobWorkArticiaIssueOrder[0].rate_of_fine_gold;
              setGoldRateValue(rets);
              const retsSilver =
                finalData.JobWorkArticiaIssueOrder[0].rate_of_fine_silver;
                setSilverRate(retsSilver);
              let tempStateId = finalData?.JobWorker?.state_name?.id;
              let tempArray = [];
              for (let item of finalData.JobWorkArticiaIssueOrder) {
                let tCgstPer =
                  tempStateId === 12
                    ? parseFloat(
                        parseFloat(
                          item.StockNameCode?.stock_name_code?.hsn_master.gst
                        ) / 2
                      ).toFixed(3)
                    : "";
                let tSgstper =
                  tempStateId === 12
                    ? parseFloat(
                        parseFloat(
                          item.StockNameCode?.stock_name_code?.hsn_master.gst
                        ) / 2
                      ).toFixed(3)
                    : "";
                let tIgstPer =
                  tempStateId !== 12
                    ? parseFloat(
                        item.StockNameCode?.stock_name_code?.hsn_master.gst
                      ).toFixed(3)
                    : "";

                let tCgstVal =
                  tempStateId === 12
                    ? parseFloat(
                        (parseFloat(item.amount) * parseFloat(tCgstPer)) / 100
                      ).toFixed(3)
                    : "";
                let tSgstVal =
                  tempStateId === 12
                    ? parseFloat(
                        (parseFloat(item.amount) * parseFloat(tSgstper)) / 100
                      ).toFixed(3)
                    : "";
                let tIgstVal =
                  tempStateId !== 12
                    ? parseFloat(
                        (parseFloat(item.amount) * parseFloat(tIgstPer)) / 100
                      ).toFixed(3)
                    : "";

                let tTotal =
                  tempStateId === 12
                    ? parseFloat(
                        parseFloat(item.amount) +
                          parseFloat(tCgstVal) +
                          parseFloat(tSgstVal)
                      ).toFixed(3)
                    : parseFloat(
                        parseFloat(item.amount) + parseFloat(tIgstVal)
                      ).toFixed(3);
                tempArray.push({
                  stockCode: {
                    value: item?.StockNameCode?.id,
                    label: item?.StockNameCode?.stock_code,
                  },
                  categoryName: item?.stock_name,
                  HSNnum:
                    item.StockNameCode?.stock_name_code?.hsn_master?.hsn_number,
                  // selectedHsn: item.StockNameCode.stock_name_code.hsn_master.hsn_number,
                  pcs: item.pcs,
                  grossWeight: parseFloat(item.gross_weight).toFixed(3),
                  netWeight: parseFloat(item.net_weight).toFixed(3),
                  purity: item.purity.toString(),
                  fineGold: parseFloat(item.finegold).toFixed(3),
                  amount: parseFloat(item.amount).toFixed(3),
                  cgstPer: tCgstPer,
                  sgstPer: tSgstper,
                  igstPer: tIgstPer,
                  cgstVal: tCgstVal,
                  sgstVal: tSgstVal,
                  igstVal: tIgstVal,
                  totalAmount: tTotal,
                });

                setFormValues(tempArray);
              }
              // else if (loadType === 1) {
              //   for (let item of finalData.JobWorkArticianIssueOrder) {
              //     let tCgstPer =
              //       tempStateId === 12
              //         ? parseFloat(
              //           parseFloat(item.Category.hsn_master.gst) / 2
              //         ).toFixed(3)
              //         : "";
              //     let tSgstper =
              //       tempStateId === 12
              //         ? parseFloat(
              //           parseFloat(item.Category.hsn_master.gst) / 2
              //         ).toFixed(3)
              //         : "";
              //     let tIgstPer =
              //       tempStateId !== 12
              //         ? parseFloat(item.Category.hsn_master.gst).toFixed(3)
              //         : "";

              //     let tCgstVal =
              //       tempStateId === 12
              //         ? parseFloat(
              //           (parseFloat(item.amount) * parseFloat(tCgstPer)) / 100
              //         ).toFixed(3)
              //         : "";
              //     let tSgstVal =
              //       tempStateId === 12
              //         ? parseFloat(
              //           (parseFloat(item.amount) * parseFloat(tSgstper)) / 100
              //         ).toFixed(3)
              //         : "";
              //     let tIgstVal =
              //       tempStateId !== 12
              //         ? parseFloat(
              //           (parseFloat(item.amount) * parseFloat(tIgstPer)) / 100
              //         ).toFixed(3)
              //         : "";

              //     let tTotal =
              //       tempStateId === 12
              //         ? parseFloat(
              //           parseFloat(item.amount) +
              //           parseFloat(tCgstVal) +
              //           parseFloat(tSgstVal)
              //         ).toFixed(3)
              //         : parseFloat(
              //           parseFloat(item.amount) + parseFloat(tIgstVal)
              //         ).toFixed(3);

              //     tempArray.push({
              //       lotno: {
              //         value: item.Lot.id,
              //         label: item.Lot.number,
              //       },
              //       categoryName: item.Category.category_name,
              //       grossWeight: parseFloat(item.gross_weight).toFixed(3),
              //       netWeight: parseFloat(item.net_weight).toFixed(3),
              //       pcs: item.pcs,
              //       HSNnum: item.Category.hsn_master.hsn_number,
              //       purity: item.purity.toString(),
              //       fineGold: parseFloat(item.finegold).toFixed(3),
              //       amount: parseFloat(item.amount).toFixed(3),
              //       cgstPer: tCgstPer,
              //       sgstPer: tSgstper,
              //       igstPer: tIgstPer,
              //       cgstVal: tCgstVal,
              //       sgstVal: tSgstVal,
              //       igstVal: tIgstVal,
              //       totalAmount: tTotal,
              //     });
              //   }
              //   setFormValues(tempArray);
              // }

              function amount(item) {
                return item.amount;
              }

              function grossWeight(item) {
                return parseFloat(item.grossWeight);
              }

              let tempAmount = tempArray
                .filter((item) => item.amount !== "")
                .map(amount)
                .reduce(function (a, b) {
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setAmount(parseFloat(tempAmount).toFixed(3));

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
              ).toFixed(3);

              setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

              let tempGrossWtTot = parseFloat(
                tempArray
                  .filter((data) => data.grossWeight !== "")
                  .map(grossWeight)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0)
              ).toFixed(3);

              setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

              function fineGold(item) {
                return parseFloat(item.fineGold);
              }

              let tempFineGold = tempArray
                .filter((item) => item.fineGold !== "")
                .map(fineGold)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

              function CGSTval(item) {
                return item.cgstVal;
              }

              function SGSTval(item) {
                return item.sgstVal;
              }

              function IGSTVal(item) {
                return item.igstVal;
              }

              let tempCgstVal = 0;
              let tempSgstVal = 0;
              let tempIgstVal = 0;

              if (tempStateId === 12) {
                tempCgstVal = tempArray
                  .filter((item) => item.cgstVal !== "")
                  .map(CGSTval)
                  .reduce(function (a, b) {
                    return parseFloat(a) + parseFloat(b);
                  }, 0);

                tempSgstVal = tempArray
                  .filter((item) => item.sgstVal !== "")
                  .map(SGSTval)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
              } else {
                tempIgstVal = tempArray
                  .filter((item) => item.igstVal !== "")
                  .map(IGSTVal)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
              }

              function totalAmount(item) {
                return parseFloat(item.totalAmount);
              }

              let tempTotal = tempArray
                .filter((item) => item.totalAmount !== "")
                .map(totalAmount)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);

              setPrintObj({
                stateId: tempStateId,
                supplierName: finalData.JobWorker.name,
                purcVoucherNum: finalData.voucher_no,
                voucherDate: moment(
                  finalData.purchase_voucher_create_date
                ).format("DD-MM-YYYY"),
                supAddress: finalData.JobWorker.address,
                orderDetails: tempArray,
                grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
                netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                fineWtTot: parseFloat(tempFineGold).toFixed(3),
                amount: parseFloat(tempAmount).toFixed(3),
                sGstTot: parseFloat(tempSgstVal).toFixed(3),
                cGstTot: parseFloat(tempCgstVal).toFixed(3),
                iGstTot: parseFloat(tempIgstVal).toFixed(3),
                totalAmount: parseFloat(tempTotal).toFixed(3),
                metalNarration:
                  finalData.metal_narration !== null
                    ? finalData.metal_narration
                    : "",
                accNarration:
                  finalData.account_narration !== null
                    ? finalData.account_narration
                    : "",
              });
            } else {
            }
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

  function getLotData() {
    axios
      .get(
        Config.getCommonUrl() +
          "retailerProduct/api/lot/department/" +
          window.localStorage.getItem("SelectedDepartment")
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setLotData(response.data.data);
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
          api:
            "retailerProduct/api/lot/department/" +
            window.localStorage.getItem("SelectedDepartment"),
        });
      });
  }

  function getTodaysGoldRate() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/goldRateToday")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setGoldRateValue(response.data.data.rate);
          setGoldratPercentage(response.data.data.percentage);
          setoldGoldRate(response.data.data.rate);
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
  //add context if needed to change on change
  //called available stock only
  function getStockCodeAll() {
    axios
      .get(
        Config.getCommonUrl() +
          "retailerProduct/api/stock/getstockcodes?department_id=" +
          window.localStorage.getItem("SelectedDepartment")
      )
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
          api:
            "retailerProduct/api/stock/getstockcodes?department_id=" +
            window.localStorage.getItem("SelectedDepartment"),
        });
      });
  }

  function getJobworkerdata() {
    axios
      .get(
        Config.getCommonUrl() +
          "retailerProduct/api/jobworkerRet/listing/listing"
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setJobworkerData(response.data.data);
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
          api: "retailerProduct/api/jobworkerRet/listing/listing",
        });
      });
  }

  function getVoucherNumber() {
    axios
      .get(
        Config.getCommonUrl() +
          "retailerProduct/api/jobworkarticianissue/get/voucher"
      )
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
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "retailerProduct/api/jobWorkArticianIssue/get/voucher",
        });
      });
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "goldrateValue" && !isNaN(value)) {
      const goldrateValuee = parseFloat(oldGoldRate);
      var targetValue = parseFloat(value);
      // setGoldRateValue(value);
  if (oldGoldRate === "") {
        setGoldRateValueErr("Please enter today's rate on master");
      } else {
        const goldrateValuee = parseFloat(oldGoldRate);
        setGoldRateValue(value);
      const minValue =
        goldrateValuee - (goldrateValuee * parseFloat(goldratPercentage)) / 100;
      const maxValue =
        goldrateValuee + (goldrateValuee * parseFloat(goldratPercentage)) / 100;
      console.log(minValue, maxValue);

      if (targetValue >= minValue && targetValue <= maxValue) {
        setGoldRateValue(targetValue);
        setGoldRateValueErr("");
        resetForm();
      } else {
        setGoldRateValueErr(`Please, Enter today's rate between ${minValue} to ${maxValue}`);
        resetForm();

      }
    }
    } else if (name === "voucherNumber") {
      setVoucherNumber(value);
      setVoucherNumErr("");
    } else if (name === "voucherDate") {
      setVoucherDate(value);
      setVoucherDtErr("");
      setPrintObj({
        ...printObj,
        voucherDate: moment(value).format("DD-MM-YYYY"),
      });
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
        resetForm()
      }
      else {
        setSilverRateErr("Enter today's silver rate in master");
      }
    }
    // else if (name === "partyVoucherNum") {
    //   setPartyVoucherNum(value);
    //   setPartyVoucherNumErr("");
    // }
    else if (name === "metalNarration") {
      setMetalNarration(value);
      setMetalNarrationErr("");
      setPrintObj({
        ...printObj,
        metalNarration: value,
      });
    } else if (name === "accNarration") {
      setAccNarration(value);
      setAccNarrationErr("");
      setPrintObj({
        ...printObj,
        accNarration: value,
      });
    }
  }

  // function partyVoucherNumValidation() {
  //   const Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
  //   if (!partyVoucherNum || Regex.test(partyVoucherNum) === false) {
  //     if(partyVoucherNum === ""){
  //     setPartyVoucherNumErr("Enter voucher number");
  //     }else{
  //       setPartyVoucherNumErr("Enter valid voucher number");
  //     }
  //     return false;
  //   }
  //   return true;
  // }

  function goldRateValueValidation() {
    if (!isView) {
      const goldrateValuee = oldGoldRate;
      const minValue =
        goldrateValuee - (goldrateValuee * parseFloat(goldratPercentage)) / 100;
      const maxValue =
        goldrateValuee + (goldrateValuee * parseFloat(goldratPercentage)) / 100;
      console.log(minValue, maxValue);
      if (
        parseFloat(goldrateValue) >= minValue &&
        parseFloat(goldrateValue) <= maxValue
      ) {
        setGoldRateValueErr("");
        return true;
      } else {
        if (oldGoldRate === "") {
          setGoldRateValueErr("Please enter today's rate on master");
          return false;
        } else {
          setGoldRateValueErr(
            `Please, Enter today's rate between ${minValue} to ${maxValue}`
          );
          return false;
        }
      }
    } else {
      return true;
    }
  }

  function voucherNumValidation() {
    // var Regex = /^[a-zA-Z\s]*$/;
    // if (!voucherNumber || Regex.test(voucherNumber) === false) {
    if (voucherNumber === "") {
      setVoucherNumErr("Enter valid voucher number");
      return false;
    }
    return true;
  }

  function partyNameValidation() {
    if (selectedJobWorker === "") {
      setSelectedJobWorkerErr("Please select job worker");
      return false;
    }
    return true;
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();

    if (
      goldRateValueValidation() &&
      voucherNumValidation() &&
      partyNameValidation()
    ) {
      if (prevContactIsValid()) {
        addArticianIssueApi(true, false);
      }
    }
  }

  function addArticianIssueApi(resetFlag, toBePrint) {
    let Orders = formValues
      .filter((element) => element.grossWeight !== "")
      .map((x) => {
        return {
          stock_name_code_id: x.stockCode.value,
          gross_weight: x.grossWeight,
          rate_of_fine_gold: goldrateValue,
          rate_of_fine_silver: silverRate,
          amount: x.amount,
          finegold: x.fineGold
        };
      });

    if (Orders.length === 0) {
      dispatch(
        Actions.showMessage({ message: "Please Add Entry", variant: "error" })
      );
      return;
    }
    setLoading(true);
    const body = {
      // voucher_no: voucherNumber,
      // party_voucher_no: partyVoucherNum,
      // opposite_account_id: 1, //oppositeAccSelected.value,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      jobworker_id: selectedJobWorker.value,
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      is_lot: 0,
      metal_narration: metalNarration,
      account_narration: accNarration,
      Orders: Orders,
      uploadDocIds: docIds,
      party_voucher_date: partyVoucherDate,
    };
    axios
      .post(
        Config.getCommonUrl() + "retailerProduct/api/jobworkarticianissue",
        body
      )
      .then(function (response) {
        if (response.data.success === true) {
          // response.data.data.id

          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          // History.push("/dashboard/masters/clients");
          // History.goBack();

          if (resetFlag === true) {
            checkAndReset();
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record
            handlePrint();
          }

          // setSelectedJobWorker("");
          // // setOppositeAccSelected("");
          // // setPartyVoucherNum("");
          // //   setSelectedDepartment("");
          // setFirmName("");
          // setFirmNameErr("");
          // setAccNarration("");
          // setMetalNarration("");
          // // setSelectedIndex(0);
          // setSelectedLoad("");
          // setVoucherDate(moment().format("YYYY-MM-DD"));
          // setPrintObj({
          //   loadType: "",
          //   stateId: "",
          //   supplierName: "",
          //   supAddress: "",
          //   supplierGstUinNum: "",
          //   supPanNum: "",
          //   supState: "",
          //   supCountry: "",
          //   supStateCode: "",
          //   purcVoucherNum: "",
          //   voucherDate: moment().format("YYYY-MM-DD"),
          //   placeOfSupply: "",
          //   orderDetails: [],
          //   grossWtTOt: "",
          //   netWtTOt: "",
          //   fineWtTot: "",
          //   amount: "",
          //   sGstTot: "",
          //   cGstTot: "",
          //   iGstTot: "",
          //   totalAmount: "",
          //   metalNarration: "",
          //   accNarration: "",
          // })
          // resetForm();

          // getVoucherNumber();
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
          api: "retailerProduct/api/jobworkarticianissue",
          body: body,
        });
      });
  }

  function resetForm(flag) {
    setAmount("");
    setTotalGrossWeight("");
    setTotalNetWeight("");
    setFineGoldTotal("");
    setTotalGrossWeight("");
    setTotalNetWeight("");
    setFineGoldTotal("");

    if (flag === false) {
      //reset whole as load changes and stockgroup or lot no field will change so..
      setFormValues([
        {
          stockCode: "",
          stock_group: "", // 1- gold 2- silver 3 -bronze
          categoryName: "",
          HSNnum: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          availWeight: "",
          availPcs: "",
          availableStock: "",
          purity: "",
          fineGold: "",
          amount: "",
          cgstPer: "",
          sgstPer: "",
          igstPer: "",
          cgstVal: "",
          sgstVal: "",
          igstVal: "",
          totalAmount: "",
          errors: {
            lotno: null,
            stockCode: null,
            categoryName: null,
            grossWeight: null,
            netWeight: null,
            pcs: null,
            purity: null,
            fineGold: null,
            amount: null,
          },
        },
        {
          lotno: "",
          stockCode: "",
          stock_group: "", // 1- gold 2- silver 3 -bronze
          categoryName: "",
          HSNnum: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          availWeight: "",
          availPcs: "",
          availableStock: "",
          purity: "",
          fineGold: "",
          amount: "",
          cgstPer: "",
          sgstPer: "",
          igstPer: "",
          cgstVal: "",
          sgstVal: "",
          igstVal: "",
          totalAmount: "",
          errors: {
            lotno: null,
            stockCode: null,
            categoryName: null,
            grossWeight: null,
            netWeight: null,
            pcs: null,
            purity: null,
            fineGold: null,
            amount: null,
          },
        },
        {
          lotno: "",
          stockCode: "",
          stock_group: "", // 1- gold 2- silver 3 -bronze
          categoryName: "",
          HSNnum: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          availWeight: "",
          availPcs: "",
          availableStock: "",
          purity: "",
          fineGold: "",
          amount: "",
          cgstPer: "",
          sgstPer: "",
          igstPer: "",
          cgstVal: "",
          sgstVal: "",
          igstVal: "",
          totalAmount: "",
          errors: {
            lotno: null,
            stockCode: null,
            categoryName: null,
            grossWeight: null,
            netWeight: null,
            pcs: null,
            purity: null,
            fineGold: null,
            amount: null,
          },
        },
        {
          lotno: "",
          stockCode: "",
          stock_group: "", // 1- gold 2- silver 3 -bronze
          categoryName: "",
          HSNnum: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          availWeight: "",
          availPcs: "",
          availableStock: "",
          purity: "",
          fineGold: "",
          amount: "",
          cgstPer: "",
          sgstPer: "",
          igstPer: "",
          cgstVal: "",
          sgstVal: "",
          igstVal: "",
          totalAmount: "",
          errors: {
            lotno: null,
            stockCode: null,
            categoryName: null,
            grossWeight: null,
            netWeight: null,
            pcs: null,
            purity: null,
            fineGold: null,
            amount: null,
          },
        },
        {
          lotno: "",
          stockCode: "",
          stock_group: "", // 1- gold 2- silver 3 -bronze
          categoryName: "",
          HSNnum: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          availWeight: "",
          availPcs: "",
          availableStock: "",
          purity: "",
          fineGold: "",
          amount: "",
          cgstPer: "",
          sgstPer: "",
          igstPer: "",
          cgstVal: "",
          sgstVal: "",
          igstVal: "",
          totalAmount: "",
          errors: {
            lotno: null,
            stockCode: null,
            categoryName: null,
            grossWeight: null,
            netWeight: null,
            pcs: null,
            purity: null,
            fineGold: null,
            amount: null,
          },
        },
      ]);
    } else {
      let newFormValues = formValues.map((x) => {
        return {
          ...x,
          amount: "",
          grossWeight: "",
          fineGold: "",
          purity: "",
          netWeight: "",
          availableStock: "",
          categoryName: "",
          cgstVal: "",
          sgstVal: "",
          igstVal: "",
          totalAmount: "",
          stockCode: "",
        };
      });
      changeTotal(newFormValues, false);
    }
  }

  function handlePartyChange(value) {
    setSelectedJobWorker(value);
    setParty(value.label);

    setSelectedJobWorkerErr("");
    console.log(value.label);
    setStateId("");
    // setPartyVoucherNum("");

    resetForm(true);

    const index = jobworkerData.findIndex(
      (element) => element.id === value.value
    );

    // if (index > -1) {
    //   setStateId(jobworkerData[index].state_name.id);

    //   setPrintObj({
    //     ...printObj,
    //     stateId: jobworkerData[index].state_name.id,
    //     loadType: 0,
    //     supplierName: jobworkerData[index].firm_name,
    //     supAddress: jobworkerData[index].address,
    //     supplierGstUinNum:
    //       jobworkerData[index].gst_number === null
    //         ? jobworkerData[index].gst_type
    //         : jobworkerData[index].gst_number,
    //     supPanNum: jobworkerData[index].pan_number,
    //     supState: jobworkerData[index].state_name.name,
    //     supCountry: jobworkerData[index].country_name.name,
    //     supStateCode:
    //       jobworkerData[index].gst_number === null
    //         ? "-"
    //         : jobworkerData[index].gst_number.substring(0, 2),
    //     // purcVoucherNum: "",
    //     // voucherDate: moment().format("YYYY-MM-DD"),
    //     placeOfSupply: jobworkerData[index].state_name.name,
    //     orderDetails: [],
    //     grossWtTOt: "",
    //     netWtTOt: "",
    //     fineWtTot: "",
    //     amount: "",
    //     sGstTot: "",
    //     cGstTot: "",
    //     iGstTot: "",
    //     totalAmount: "",
    //     metalNarration: "",
    //     accNarration: "",
    //   });
    // }
  }

  const prevContactIsValid = () => {
    if (formValues.length === 0) {
      return true;
    }

    let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

    const someEmpty = formValues
      .filter((element) => element.stockCode)
      .some((item) => {
        item.stockCode === "" ||
          item.categoryName === "" ||
          item.grossWeight === "" ||
          item.grossWeight == 0 ||
          item.netWeight === "" ||
          item.netWeight == 0 ||
          (item.stock_group === 5 && item.pcs === "") ||
          (item.stock_group === 5 &&
            +parseFloat(item.availPcs).toFixed(3) <
              +parseFloat(item.pcs).toFixed(3)) ||
          +parseFloat(item.availWeight).toFixed(3) <
            +parseFloat(item.grossWeight).toFixed(3) ||
          (item.stockCode.pcs_require === 1 &&
            item.stock_group !== 5 &&
            (item.pcs === "" || isNaN(item.pcs)));
      });

    if (someEmpty) {
      formValues
        .filter((element) => element.stockCode)
        .map((item, index) => {
          const allPrev = [...formValues];

          let stockCode = formValues[index].stockCode;
          if (stockCode === "") {
            allPrev[index].errors.stockCode = "Please Select Stock Code";
          } else {
            allPrev[index].errors.stockCode = null;
          }

          let categoryName = formValues[index].categoryName;
          if (categoryName === "") {
            allPrev[index].errors.categoryName = "Please Select Valid Category";
          } else {
            allPrev[index].errors.categoryName = null;
          }

          let weightRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
          let gWeight = formValues[index].grossWeight;
          if (!gWeight || weightRegex.test(gWeight) === false || gWeight == 0) {
            allPrev[index].errors.grossWeight = "Enter Gross Weight!";
          } else {
            allPrev[index].errors.grossWeight = null;
          }

          if (
            +parseFloat(formValues[index].availWeight).toFixed(3) <
            +parseFloat(formValues[index].grossWeight).toFixed(3)
          ) {
            allPrev[index].errors.grossWeight =
              "Enter Less or Eqaul to Available Weight";
          } else {
            if (
              !gWeight ||
              weightRegex.test(gWeight) === false ||
              gWeight == 0
            ) {
              allPrev[index].errors.grossWeight = "Enter Gross Weight!";
            } else {
              allPrev[index].errors.grossWeight = null;
            }
          }

          let netWeight = formValues[index].netWeight;
          if (
            !netWeight ||
            weightRegex.test(netWeight) === false ||
            netWeight == 0
          ) {
            allPrev[index].errors.netWeight = "Enter Net Weight!";
          } else {
            allPrev[index].errors.netWeight = null;
          }

          // if (netWeight > gWeight) {
          //   allPrev[index].errors.netWeight =
          //     "Net Weight Can not be Greater than Gross Weight";
          // } else {
          //   allPrev[index].errors.netWeight = null;
          // }

          if (
            formValues[index].stock_group === 5 &&
            formValues[index].pcs === ""
          ) {
            allPrev[index].errors.pcs = "Enter Valid Pieces";
          } else {
            allPrev[index].errors.pcs = null;
          }

          if (
            formValues[index].stock_group === 5 &&
            !isNaN(formValues[index].pcs) &&
            formValues[index].pcs !== "" &&
            +parseFloat(formValues[index].availPcs).toFixed(3) <
              +parseFloat(formValues[index].pcs).toFixed(3)
          ) {
            allPrev[index].errors.pcs =
              "Enter Less or Eqaul to Available Pieces";
          } else {
            // allPrev[index].errors.pcs = null;
            if (
              formValues[index].stock_group === 5 &&
              formValues[index].pcs === ""
            ) {
              allPrev[index].errors.pcs = "Enter Valid Pieces";
            } else if (formValues[index].stock_group !== 5) {
              let stockCode = formValues[index].stockCode;
              let pcsTotal = formValues[index].pcs;
              if (stockCode.pcs_require === 1) {
                if (
                  pcsTotal === "" ||
                  pcsTotal === null ||
                  pcsTotal === undefined ||
                  isNaN(pcsTotal)
                ) {
                  allPrev[index].errors.pcs = "Enter Pieces";
                } else {
                  allPrev[index].errors.pcs = null;
                }
              }
            } else {
              allPrev[index].errors.pcs = null;
            }
          }

          setFormValues(allPrev);
          return null;
        });
    }

    return !someEmpty;
  };

  let handlerBlur = (i, e) => {
    let newFormValues = [...formValues];

    let nm = e.target.name;
    let val = e.target.value;
    if (isNaN(val) || val === "") {
      return;
    }
    if (nm === "grossWeight") {
      newFormValues[i].grossWeight = parseFloat(val).toFixed(3);
      newFormValues[i].netWeight = parseFloat(val).toFixed(3);
    }
    setFormValues(newFormValues);
  };

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    newFormValues[i].errors[e.target.name] = null;

    let nm = e.target.name;
    let val = e.target.value;
    console.log(newFormValues[i]);
    if (nm === "grossWeight") {
      if (
        newFormValues[i].grossWeight !== "" &&
        newFormValues[i].purity !== "" && newFormValues[i].purity !== null
      ) {
        newFormValues[i].fineGold = parseFloat(
          (parseFloat(newFormValues[i].grossWeight) *
            parseFloat(newFormValues[i].purity)) /
            100
        ).toFixed(3);
      }
      newFormValues[i].netWeight = val;
      newFormValues[i].errors.grossWeight = "";
      newFormValues[i].errors.netWeight = "";
      newFormValues[i].amount = "0";
      if (val == 0) {
        newFormValues[i].errors.grossWeight = "Enter Valid Gross Weight";
        newFormValues[i].errors.netWeight = "Enter Valid Net Weight";
      }

      if (val === "" || val == 0) {
        newFormValues[i].fineGold = "0";
        newFormValues[i].netWeight = "";
        setAmount("");
        setTotalGrossWeight("");
        setTotalNetWeight("");
        setFineGoldTotal("");
      }

      newFormValues[i].errors.netWeight = "";
      //   setAdjustedRate(false);
    }

    if (nm === "purity") {
      if (
        newFormValues[i].grossWeight !== "" &&
        newFormValues[i].purity !== ""
      ) {
        newFormValues[i].fineGold = parseFloat(
          (parseFloat(newFormValues[i].grossWeight) *
            parseFloat(newFormValues[i].purity)) /
            100
        ).toFixed(3);
      }

      if (val === "") {
        newFormValues[i].fineGold = "0";
        newFormValues[i].amount = "0";

        setAmount("");
        setTotalGrossWeight("");
        setTotalNetWeight("");
        setFineGoldTotal("");
      }
    }

    if (goldrateValue !== "") {
      if (newFormValues[i].isGoldSilver === "Gold") {
        const goldrateVal = goldrateValue / 10;
        newFormValues[i].amount = parseFloat(
          parseFloat(goldrateVal) * parseFloat(newFormValues[i].fineGold)
        ).toFixed(3);
      } else if(newFormValues[i].isGoldSilver === "Silver") {
        const silverrateVal = silverRate / 10;
        newFormValues[i].amount = parseFloat(
          parseFloat(silverrateVal) * parseFloat(newFormValues[i].fineGold)
        ).toFixed(3);
      }
    }

    if (stateId === 12) {
      if (newFormValues[i].amount !== "" && newFormValues[i].cgstPer !== "") {
        newFormValues[i].cgstVal = parseFloat(
          (parseFloat(newFormValues[i].amount) *
            parseFloat(newFormValues[i].cgstPer)) /
            100
        ).toFixed(3);

        newFormValues[i].sgstVal = parseFloat(
          (parseFloat(newFormValues[i].amount) *
            parseFloat(newFormValues[i].sgstPer)) /
            100
        ).toFixed(3);

        newFormValues[i].totalAmount = parseFloat(
          parseFloat(newFormValues[i].amount) +
            parseFloat(newFormValues[i].cgstVal) +
            parseFloat(newFormValues[i].sgstVal)
        ).toFixed(3);
      } else {
        newFormValues[i].cgstVal = "";
        newFormValues[i].sgstVal = "";
        newFormValues[i].totalAmount = "";
      }
    } else {
      if (newFormValues[i].amount !== "" && newFormValues[i].igstPer !== "") {
        newFormValues[i].igstVal = parseFloat(
          (parseFloat(newFormValues[i].amount) *
            parseFloat(newFormValues[i].igstPer)) /
            100
        ).toFixed(3);
        newFormValues[i].totalAmount = parseFloat(
          parseFloat(newFormValues[i].amount) +
            parseFloat(newFormValues[i].igstVal)
        ).toFixed(3);
      } else {
        newFormValues[i].igstVal = "";
        newFormValues[i].totalAmount = "";
      }
    }

    function amount(item) {
      return item.amount;
    }

    function grossWeight(item) {
      return parseFloat(item.grossWeight);
    }

    let tempAmount = newFormValues
      .filter((item) => item.amount !== "")
      .map(amount)
      .reduce(function (a, b) {
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setAmount(parseFloat(tempAmount).toFixed(3));

    function netWeight(item) {
      return parseFloat(item.netWeight);
    }

    let tempNetWtTot = parseFloat(
      newFormValues
        .filter((data) => data.netWeight !== "")
        .map(netWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));

    let tempGrossWtTot = parseFloat(
      newFormValues
        .filter((data) => data.grossWeight !== "")
        .map(grossWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

    function fineGold(item) {
      return parseFloat(item.fineGold);
    }

    let tempFineGold = newFormValues
      .filter((item) => item.fineGold !== "")
      .map(fineGold)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

    function CGSTval(item) {
      return item.cgstVal;
    }

    function SGSTval(item) {
      return item.sgstVal;
    }

    function IGSTVal(item) {
      return item.igstVal;
    }

    let tempCgstVal = 0;
    let tempSgstVal = 0;
    let tempIgstVal = 0;

    if (stateId === 12) {
      tempCgstVal = newFormValues
        .filter((item) => item.cgstVal !== "")
        .map(CGSTval)
        .reduce(function (a, b) {
          return parseFloat(a) + parseFloat(b);
        }, 0);

      tempSgstVal = newFormValues
        .filter((item) => item.sgstVal !== "")
        .map(SGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
    } else {
      tempIgstVal = newFormValues
        .filter((item) => item.igstVal !== "")
        .map(IGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
    }

    function totalAmount(item) {
      return parseFloat(item.totalAmount);
    }

    let tempTotal = newFormValues
      .filter((item) => item.totalAmount !== "")
      .map(totalAmount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setFormValues(newFormValues);

    setPrintObj({
      ...printObj,
      supplierName: Party,
      orderDetails: newFormValues,
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      fineWtTot: parseFloat(tempFineGold).toFixed(3),
      amount: parseFloat(tempAmount).toFixed(3),
      sGstTot: parseFloat(tempSgstVal).toFixed(3),
      cGstTot: parseFloat(tempCgstVal).toFixed(3),
      iGstTot: parseFloat(tempIgstVal).toFixed(3),
      totalAmount: parseFloat(tempTotal).toFixed(3),
    });
  };

  function deleteHandler(index) {
    let newFormValues = [...formValues];

    newFormValues[index].lotno = "";
    newFormValues[index].stockCode = "";
    newFormValues[index].stock_group = "";
    newFormValues[index].categoryName = "";
    newFormValues[index].grossWeight = "";
    newFormValues[index].netWeight = "";
    newFormValues[index].availWeight = "";
    newFormValues[index].availPcs = "";
    newFormValues[index].availableStock = "";
    newFormValues[index].purity = "";
    newFormValues[index].fineGold = "";
    newFormValues[index].amount = "";
    newFormValues[index].HSNnum = "";
    newFormValues[index].cgstPer = "";
    newFormValues[index].sgstPer = "";
    newFormValues[index].igstPer = "";
    newFormValues[index].cgstVal = "";
    newFormValues[index].sgstVal = "";
    newFormValues[index].igstVal = "";
    newFormValues[index].totalAmount = "";
    newFormValues[index].goldrateValue = "";

    changeTotal(newFormValues, false);
  }

  const handleNarrationClick = () => {
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        flag: 27,
        id: idToBeView.id,
        metal_narration: metalNarration,
        account_narration: accNarration,
      };

      UpdateRetailerNarration(body)
        .then((response) => {
          console.log(response);
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
  const updateDocumentArray = (id) => {
    let tempDocList = [...documentList];
    const arr = tempDocList.filter((x) => x.id !== id);
    setDocumentList(arr);
  };
  const concateDocument = (newData) => {
    setDocumentList((documentList) => [...documentList, ...newData]);
  };

  return (
    <div
      className={clsx(classes.root, props.className, "w-full")}
      id="metalpurchase-main"
    >
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            {!props.viewPopup && (
              <Grid
              container
              alignItems="center"
              style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
              >
                <Grid item xs={6} sm={6} md={6} key="1">
                  <FuseAnimate delay={300}>
                    <Typography className="text-18 font-700">
                      {isView
                        ? "View Artician Issue Metal"
                        : "Add Artician Issue Metal"}
                    </Typography>
                  </FuseAnimate>

                  {/* {!isView && <BreadcrumbsHelper />} */}
                </Grid>

                <Grid
                  item
                  xs={6}
                  sm={6}
                  md={6}
                  key="2"
                  style={{ textAlign: "right"}}
                >
                  <div className="btn-back">
                    
                    <Button
                      id="btn-back"
                      variant="contained"
                      className={classes.button}
                      size="small"
                      onClick={(event) => {
                        History.goBack();
                      }}
                    >
                      <img className="back_arrow" src={Icones.arrow_left_pagination} alt="back" />
                      Back
                    </Button>
                  </div>
                </Grid>
              </Grid>
            )}
            <div className="main-div-alll ">
              {loading && <Loader />}
              <div className="articianissue-resturn-form" style={{ height: "90%" }}>
                <div>
                  <form
                    name="registerForm"
                    noValidate
                    className="flex flex-col justify-center w-full"
                    onSubmit={handleFormSubmit}
                  >
                    <Grid container spacing={2}>
                      {allowedBackDate && (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                        >
                          <p>Voucher Date</p>

                          <TextField
                            type="date"
                            name="voucherDate"
                            value={voucherDate}
                            error={VoucherDtErr.length > 0 ? true : false}
                            helperText={VoucherDtErr}
                            onChange={(e) => handleInputChange(e)}
                            variant="outlined"
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
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                      >
                        <p >Today's Gold Rate (Per 10gm)</p>
                        <TextField
                          name="goldrateValue"
                          value={goldrateValue}
                          error={goldrateValueErr.length > 0 ? true : false}
                          helperText={goldrateValueErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          inputRef={inputRef}
                          autoFocus
                          placeholder="Enter Today's Rate*"
                          disabled={isView}
                          FormHelperTextProps={{
                          }}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                      >
                        <p className="popup-labl">
                          Today's Silver Rate (Per 10gm)
                        </p>{" "}
                        <TextField
                          name="silverRate"
                          value={silverRate}
                          error={silverRateErr.length > 0 ? true : false}
                          helperText={silverRateErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          inputRef={inputRef}
                          autoFocus
                          placeholder="Enter Today's Silver Rate*"
                          disabled={isView}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                      >
                        <p>Voucher Number</p>
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
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                      >
                        <p>Artician Name</p>
                        <Select
                          className="view_consumablepurchase_dv"
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
                          placeholder="Artician Name"
                          isDisabled={isView}
                          blurInputOnSelect
                          tabSelectsValue={false}
                        />

                        <span style={{ color: "red" }}>
                          {selectedJobWorkerErr.length > 0
                            ? selectedJobWorkerErr
                            : ""}
                        </span>
                      </Grid>
                    </Grid>
                    <Paper className={classes.tabroot} style={{marginTop: 20}}>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                              {!isView && (
                            <TableCell className={classes.tableRowPad} width={50} align="center">
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "delete_icons_dv"
                                )}
                              >
                                {/* Action */}
                              </div>
                            </TableCell>
                            )}
                            <TableCell className={classes.tableRowPad}>
                              Stock Code
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Category Name
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Available Stock
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
                            <TableCell className={classes.tableRowPad}>
                              Fine
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Amount
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                        {formValues.map((element, index) => {
                          console.log(element); 
                        return(
                          <TableRow key={index}>
                            {!isView && (
                            <TableCell className={classes.tableRowPad} align="center">
                                  <IconButton
                                    style={{ padding: "0px" }}
                                    tabIndex="-1"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      deleteHandler(index);
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
                              // className={classes.selectBox}
                              classes={classes}
                              styles={selectStyles}
                              options={stockCodeData
                                .filter((array) =>
                                  formValues.every(
                                    (item) =>
                                      !(
                                        item.stockCode?.value ===
                                          array?.stock_name_code?.id &&
                                        item.stockCode.label ===
                                          array?.stock_name_code?.stock_code
                                      )
                                  )
                                )
                                .map((suggestion) => ({
                                  value: suggestion?.stock_name_code?.id,
                                  label:
                                    suggestion?.stock_name_code?.stock_code,
                                  pcs_require:
                                    suggestion?.stock_name_code
                                      ?.stock_description.pcs_require,
                                  stockGroup: suggestion.stock_group.group_name
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
                              {element.errors !== undefined
                                ? element.errors.stockCode
                                : ""}
                            </span>
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                            <TextField
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
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                            <TextField
                              name="availableStock"
                              className=""
                              value={element.availableStock || ""}
                              disabled
                              // value={departmentNm}
                              // error={
                              //   element.errors !== undefined
                              //     ? element.errors.categoryName
                              //       ? true
                              //       : false
                              //     : false
                              // }
                              // helperText={
                              //   element.errors !== undefined
                              //     ? element.errors.categoryName
                              //     : ""
                              // }
                              // onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                            />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
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
                              inputRef={(el) =>
                                (wtInputRef.current[index] = el)
                              }
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                            />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                            <TextField
                              // label="Net Weight"
                              name="netWeight"
                              className=""
                              value={element.netWeight || ""}
                              // value={departmentNm}
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
                              variant="outlined"
                              fullWidth
                              disabled
                            />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
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
                              // disabled={selectedLoad !== "2"}
                              disabled
                            />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                            <TextField
                              // label="Fine Gold"
                              name="fineGold"
                              className=""
                              value={element.fineGold || ""}
                              // value={departmentNm}
                              error={
                                element.errors !== undefined
                                  ? element.errors.fineGold
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.fineGold
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled
                            />
                            </TableCell>
                            <TableCell className={classes.tablePad}>
                            <TextField
                              // label="Amount"
                              name="amount"
                              className=""
                              value={
                                isView
                                  ? Config.numWithComma(element.amount)
                                  : element.amount || ""
                              }
                              // value={departmentNm}
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
                              disabled = {element.isGoldSilver === "Gold" || element.isGoldSilver === "Silver" }
                            />
                            </TableCell>
                          </TableRow>
                        )})}
                        </TableBody>
                        <TableFooter>
                          <TableRow className={classes.tableFooter}>
                            {!isView && (
                            <TableCell className={classes.tableRowPad}>
                            </TableCell>
                          )}
                            <TableCell className={classes.tableRowPad}>

                            </TableCell>
                            <TableCell className={classes.tableRowPad}>

                            </TableCell>
                            <TableCell className={classes.tableRowPad}>

                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                              {totalGrossWeight}
                              </b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                              {totalNetWeight}
                              </b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>

                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                              {fineGoldTotal}
                              </b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                              {isView ? Config.numWithComma(amount) : amount}
                              </b>
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </Paper>
                  </form>

                  <div className="textarea-row" style={{marginTop:"17px"}}>
                    <div style={{ width: " 100%", marginRight: "20px" }}>
                      <p>Metal Narration*</p>
                      <TextField
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
                        placeholder="Metal Narration"
                      />
                    </div>
                    <div style={{ width: " 100%" }}>
                      <p>Account Narration*</p>
                      <TextField
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
                        // disabled={isView}
                        disabled={narrationFlag}
                        placeholder="Account Narration"
                      />
                    </div>
                  </div>
                  {!props.viewPopup && (
                    <div style={{marginTop:"22px"}}>
                      {!isView && (
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ float: "right" }}
                          className="w-224 mx-auto btn-print-save"
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
                        style={{ float: "right", backgroundColor: "limegreen" }}
                        className="w-224 mx-auto mr-16 btn-print-save"
                        aria-label="Register"
                        //   disabled={!isFormValid()}
                        // type="submit"
                        onClick={checkforPrint}
                      >
                        {isView ? "Print" : "Save & Print"}
                      </Button>

                      {isView && (
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ float: "right" }}
                          className="w-224 mx-auto mr-16 btn-print-save"
                          aria-label="Register"
                          onClick={() => handleNarrationClick()}
                        >
                          {!narrationFlag
                            ? "Save Narration"
                            : "Update Narration"}
                        </Button>
                      )}
                      <div style={{ display: "none" }}>
                        <ArticianIssueRetailerPrintComp
                          ref={componentRef}
                          printObj={printObj}
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

                  <ViewDocModelRetailer
                    documentList={documentList}
                    handleClose={handleDocModalClose}
                    open={docModal}
                    updateDocument={updateDocumentArray}
                    purchase_flag_id={idToBeView?.id}
                    purchase_flag="27"
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

export default AddArticianIssueIRetailer;

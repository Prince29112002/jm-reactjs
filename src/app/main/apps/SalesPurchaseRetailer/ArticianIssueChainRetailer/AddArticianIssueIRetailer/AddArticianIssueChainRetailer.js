import React, { useState, useEffect, useRef } from "react";
import { Typography } from "@material-ui/core";
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
import ViewDocModelRetailer from "app/main/apps/SalesPurchase/Helper/ViewDocModelRetailer";
import { DocumentUploadRetailer } from "app/main/apps/SalesPurchase/Helper/DocumentUploadRetailer";

import Icones from "assets/fornt-icons/Mainicons";
import { UpdateRetailerNarration } from "../../Helper/UpdateRetailerNarration";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    // minWidth: 650,
  },
  form: {
    marginTop: "3%",
    display: "contents",
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
    margin: 5,
    textTransform: "none",
    // backgroundColor: "gray",
    color: "white",
  },
}));

const AddArticianIssueChainRetailer = (props) => {
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
  const [goldRatePerGram, setGoldRatePerGram] = useState("");
  const [isChainZamZam, setIsChainZamZam] = useState(0);

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
    console.log(window.localStorage.getItem("isChainZamZam"));
    setIsChainZamZam(parseFloat(window.localStorage.getItem("isChainZamZam")));
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
      // goldRateValueValidation() &&
      voucherDateValidation() &&
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

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");

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
      description: "",
      wastage: "",
      goldFine: "",
      wastageFine: "",
      errors: {
        lotno: "",
        stockCode: "",
        categoryName: "",
        grossWeight: "",
        netWeight: "",
        pcs: "",
        purity: "",
        fineGold: "",
        amount: "",
        description: "",
        wastage: "",
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
      description: "",
      wastage: "",
      goldFine: "",
      wastageFine: "",
      errors: {
        lotno: "",
        stockCode: "",
        categoryName: "",
        grossWeight: "",
        netWeight: "",
        pcs: "",
        purity: "",
        fineGold: "",
        amount: "",
        description: "",
        wastage: "",
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
      description: "",
      wastage: "",
      goldFine: "",
      wastageFine: "",
      errors: {
        lotno: "",
        stockCode: "",
        categoryName: "",
        grossWeight: "",
        netWeight: "",
        pcs: "",
        purity: "",
        fineGold: "",
        amount: "",
        description: "",
        wastage: "",
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
      description: "",
      wastage: "",
      goldFine: "",
      wastageFine: "",
      errors: {
        lotno: "",
        stockCode: "",
        categoryName: "",
        grossWeight: "",
        netWeight: "",
        pcs: "",
        purity: "",
        fineGold: "",
        amount: "",
        description: "",
        wastage: "",
      },
    },
  ]);

  let handleStockGroupChange = (i, e) => {
    if (selectedJobWorker === "") {
      partyNameValidation();
    } else {
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

        newFormValues[i].HSNnum =
          stockCodeData[findIndex].hsn_master.hsn_number;

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
          description: "",
          wastage: "",
          goldFine: "",
          wastageFine: "",
          errors: {
            lotno: "",
            stockCode: "",
            categoryName: "",
            grossWeight: "",
            netWeight: "",
            pcs: "",
            purity: "",
            fineGold: "",
            amount: "",
            description: "",
            wastage: "",
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
      // getTodaysGoldRate();
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
      api = `retailerProduct/api/chainJobWorkArticianIssue/${id}?deleted_at=1`;
    } else {
      api = `retailerProduct/api/chainJobWorkArticianIssue/${id}`;
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
              // setGoldRateValue(
              //   finalData.JobWorkArticiaIssueOrder[0].rate_of_fine_gold
              // );
              setDocumentList(finalData.salesPurchaseDocs);
              setPartyVoucherDate(finalData.purchase_voucher_create_date);
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
                finalData.ChainJobWorkArticiaIssueOrder[0].rate_of_fine_gold;
              setGoldRateValue(rets);
              setGoldRatePerGram(finalData?.fine_rate);
              let tempStateId = finalData?.JobWorker?.state_name?.id;
              let tempArray = [];
              for (let item of finalData.ChainJobWorkArticiaIssueOrder) {
                // let tCgstPer =
                //   tempStateId === 12
                //     ? parseFloat(
                //         parseFloat(
                //           item.StockNameCode?.stock_name_code?.hsn_master.gst
                //         ) / 2
                //       ).toFixed(3)
                //     : "";
                // let tSgstper =
                //   tempStateId === 12
                //     ? parseFloat(
                //         parseFloat(
                //           item.StockNameCode?.stock_name_code?.hsn_master.gst
                //         ) / 2
                //       ).toFixed(3)
                //     : "";
                // let tIgstPer =
                //   tempStateId !== 12
                //     ? parseFloat(
                //         item.StockNameCode?.stock_name_code?.hsn_master.gst
                //       ).toFixed(3)
                //     : "";

                // let tCgstVal =
                //   tempStateId === 12
                //     ? parseFloat(
                //         (parseFloat(item.amount) * parseFloat(tCgstPer)) / 100
                //       ).toFixed(3)
                //     : "";
                // let tSgstVal =
                //   tempStateId === 12
                //     ? parseFloat(
                //         (parseFloat(item.amount) * parseFloat(tSgstper)) / 100
                //       ).toFixed(3)
                //     : "";
                // let tIgstVal =
                //   tempStateId !== 12
                //     ? parseFloat(
                //         (parseFloat(item.amount) * parseFloat(tIgstPer)) / 100
                //       ).toFixed(3)
                //     : "";

                // let tTotal =
                //   tempStateId === 12
                //     ? parseFloat(
                //         parseFloat(item.amount) +
                //           parseFloat(tCgstVal) +
                //           parseFloat(tSgstVal)
                //       ).toFixed(3)
                //     : parseFloat(
                //         parseFloat(item.amount) + parseFloat(tIgstVal)
                //       ).toFixed(3);
                tempArray.push({
                  // stockCode: {
                  //   value: item?.StockNameCode?.id,
                  //   label: item?.StockNameCode?.stock_code,
                  // },
                  // categoryName: item?.stock_name,
                  // HSNnum:
                  //   item.StockNameCode?.stock_name_code?.hsn_master?.hsn_number,
                  // selectedHsn: item.StockNameCode.stock_name_code.hsn_master.hsn_number,
                  // pcs: item.pcs,
                  description: item.description,
                  grossWeight: parseFloat(item.gross_weight).toFixed(3),
                  netWeight: parseFloat(item.net_weight).toFixed(3),
                  purity: item.purity.toString(),
                  wastage: item.wastage,
                  fineGold: parseFloat(item.finegold).toFixed(3),
                  amount: parseFloat(item.amount).toFixed(3),
                  // cgstPer: tCgstPer,
                  // sgstPer: tSgstper,
                  // igstPer: tIgstPer,
                  // cgstVal: tCgstVal,
                  // sgstVal: tSgstVal,
                  // igstVal: tIgstVal,
                  // totalAmount: tTotal,
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

  // function getTodaysGoldRate() {
  //   axios
  //     .get(Config.getCommonUrl() + "retailerProduct/api/goldRateToday")
  //     .then(function (response) {
  //       if (response.data.success === true) {
  //         console.log(response);
  //         setGoldRateValue(response.data.data.rate);
  //         setGoldratPercentage(response.data.data.percentage);
  //         setoldGoldRate(response.data.data.rate);
  //       } else {
  //         dispatch(
  //           Actions.showMessage({
  //             message: "Today's Gold Rate is not set",
  //             variant: "error",
  //           })
  //         );
  //       }
  //     })
  //     .catch(function (error) {
  //       handleError(error, dispatch, {
  //         api: "retailerProduct/api/goldRateToday",
  //       });
  //     });
  // }
  //add context if needed to change on change
  //called available stock only
  function getStockCodeAll() {
    axios
      .get(
        Config.getCommonUrl() +
          "retailerProduct/api/stockname/metal?department_id=23"
        // window.localStorage.getItem("SelectedDepartment")
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
          api: "retailerProduct/api/stockname/metal?department_id=23",
          // window.localStorage.getItem("SelectedDepartment"),
        });
      });
  }

  function getJobworkerdata() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/clientRet/listing")
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
          api: "retailerProduct/api/clientRet/listing",
        });
      });
  }

  function getVoucherNumber() {
    axios
      .get(
        Config.getCommonUrl() +
          "retailerProduct/api/chainJobWorkArticianIssue/get/voucher"
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
          api: "retailerProduct/api/chainJobWorkArticianIssue/get/voucher",
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
          goldrateValuee -
          (goldrateValuee * parseFloat(goldratPercentage)) / 100;
        const maxValue =
          goldrateValuee +
          (goldrateValuee * parseFloat(goldratPercentage)) / 100;
        console.log(minValue, maxValue);

        if (targetValue >= minValue && targetValue <= maxValue) {
          setGoldRateValue(targetValue);
          setGoldRateValueErr("");
          resetForm();
        } else {
          setGoldRateValueErr(
            `Please, Enter today's rate between ${minValue} to ${maxValue}`
          );
          resetForm();
        }
      }
    } else if (name === "voucherNumber") {
      setVoucherNumber(value);
      setVoucherNumErr("");
    } else if (name === "voucherDate") {
      const enteredDate = value;
      const currentDate = moment().format("YYYY-MM-DD");
      // const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      // const isValidDate = (dateString) => {
      //   return dateRegex.test(dateString);
      // };
      console.log(currentDate, enteredDate);
      setVoucherDate(value);
      if (enteredDate > currentDate) {
        setVoucherDtErr("Please enter valid date");
      } else {
        setVoucherDtErr("");
        setPrintObj({
          ...printObj,
          voucherDate: moment(value).format("DD-MM-YYYY"),
        });
      }
    } else if (name === "goldratepergram" && !isNaN(value)) {
      setGoldRatePerGram(value);
      resetForm(false);
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
  function voucherDateValidation() {
    if (voucherDate === "" || VoucherDtErr) {
      setVoucherDtErr("Please enter valid date");
      return false;
    }
    return true;
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();
    console.log(prevContactIsValid());
    if (
      // goldRateValueValidation() &&
      voucherDateValidation() &&
      voucherNumValidation() &&
      partyNameValidation() &&
      validateEmptyError()
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
          description: x.description,
          wastage: x.wastage,
          wastage_fine: x.wastageFine,
          // stock_name_code_id: x.stockCode.value,
          gross_weight: x.grossWeight,
          finegold: x.fineGold,
          net_weight: x.netWeight,
          gold_fine: x.goldFine,
          rate_of_fine_gold: "0",
          purity: x.purity,
          amount: x.amount === "" ? 0 : x.amount,
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
      party_voucher_no: voucherNumber,
      opposite_account_id: 1, //oppositeAccSelected.value,
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
      party_voucher_date: voucherDate,
      round_off: "0",
      fine_rate: goldRatePerGram,
    };
    axios
      .post(
        Config.getCommonUrl() + "retailerProduct/api/chainJobWorkArticianIssue",
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
          api: "retailerProduct/api/chainJobWorkArticianIssue",
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
          description: "",
          wastage: "",
          goldFine: "",
          wastageFine: "",
          errors: {
            lotno: "",
            stockCode: "",
            categoryName: "",
            grossWeight: "",
            netWeight: "",
            pcs: "",
            purity: "",
            fineGold: "",
            amount: "",
            description: "",
            wastage: "",
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
          description: "",
          wastage: "",
          goldFine: "",
          wastageFine: "",
          errors: {
            lotno: "",
            stockCode: "",
            categoryName: "",
            grossWeight: "",
            netWeight: "",
            pcs: "",
            purity: "",
            fineGold: "",
            amount: "",
            description: "",
            wastage: "",
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
          description: "",
          wastage: "",
          goldFine: "",
          wastageFine: "",
          errors: {
            lotno: "",
            stockCode: "",
            categoryName: "",
            grossWeight: "",
            netWeight: "",
            pcs: "",
            purity: "",
            fineGold: "",
            amount: "",
            description: "",
            wastage: "",
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
          description: "",
          wastage: "",
          goldFine: "",
          wastageFine: "",
          errors: {
            lotno: "",
            stockCode: "",
            categoryName: "",
            grossWeight: "",
            netWeight: "",
            pcs: "",
            purity: "",
            fineGold: "",
            amount: "",
            description: "",
            wastage: "",
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
          description: "",
          wastage: "",
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
    setPartyVoucherNum("");

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

    const someEmpty = formValues
      .filter((element) => element.description !== "")
      .some((item) => {
        return (
          item.description === "" ||
          item.purity === "" ||
          item.grossWeight === "" ||
          item.netWeight === ""
        );
      });

    console.log(someEmpty.length);
    console.log(someEmpty, "some");

    console.log(someEmpty);
    if (someEmpty.length === undefined && someEmpty === false) {
      const allPrev = [...formValues];
      // console.log(item);

      let descriptions = formValues[0].description;
      if (descriptions === "") {
        allPrev[0].errors.description = "Please Enter Description";
      }

      let purity = formValues[0].purity;
      if (purity === "") {
        allPrev[0].errors.purity = `Please Enter Purity ${
          isChainZamZam === 1 ? "Or 0" : ""
        }`;
      }

      let GrossWt = formValues[0].grossWeight;
      if (GrossWt === "") {
        allPrev[0].errors.grossWeight = `Please Enter GrossWt ${
          isChainZamZam === 1 ? "Or 0" : ""
        }`;
      }
      let NetWt = formValues[0].netWeight;
      if (NetWt === "") {
        allPrev[0].errors.netWeight = `Please Enter NetWt ${
          isChainZamZam === 1 ? "Or 0" : ""
        }`;
      }
      // console.log(allPrev[index]);
      setFormValues(allPrev);
      // return false;
    }

    if (someEmpty) {
      formValues
        .filter((element) => element.description !== "")
        .map((item, index) => {
          const allPrev = [...formValues];
          // console.log(item);

          let descriptions = formValues[index].description;
          if (descriptions === "") {
            allPrev[0].errors.description = "Please Enter Description";
          }
          let purity = formValues[index].purity;
          if (purity === "") {
            allPrev[index].errors.purity = `Please Enter purity ${
              isChainZamZam === 1 ? "Or 0" : ""
            }`;
          }
          let GrossWt = formValues[index].grossWeight;
          if (GrossWt === "") {
            allPrev[index].errors.grossWeight = `Please Enter GrossWt ${
              isChainZamZam === 1 ? "Or 0" : ""
            }`;
          }
          let NetWt = formValues[index].netWeight;
          if (NetWt === "") {
            allPrev[index].errors.netWeight = `Please Enter NetWt ${
              isChainZamZam === 1 ? "Or 0" : ""
            }`;
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
    newFormValues[i].errors[e.target.name] = "";

    let nm = e.target.name;
    let val = e.target.value;

    if (nm === "description") {
      newFormValues[i].description = val;
      newFormValues[i].errors.description = "";
    }

    if (nm === "grossWeight") {
      if (isNaN(val)) {
        newFormValues[i].errors.grossWeight = "Enter valid gross weight";
      } else {
        newFormValues[i].errors.grossWeight = "";
        newFormValues[i].netWeight = val;
        newFormValues[i].errors.netWeight = "";
      }
    }
    if (nm === "netWeight") {
      if (isNaN(val)) {
        newFormValues[i].errors.netWeight = "Enter valid net weight";
      }
      if (val > parseFloat(newFormValues[i].grossWeight)) {
        newFormValues[i].errors.netWeight =
          "Net Weight Can not be Greater than Gross Weight";
      }
    }
    if (nm === "purity") {
      if (val < 0 || val > 100 || isNaN(val)) {
        newFormValues[i].errors.purity = "Enter valid Purity";
      } else {
        newFormValues[i].errors.purity = "";
      }
    }
    if (nm === "description") {
      newFormValues[i].errors.description = "";
      if (val == "") {
        newFormValues[i].errors.description = "Enter description";
      }
    }
    if (nm === "wastage") {
      if (val < 0 || val > 100 || isNaN(val)) {
        newFormValues[i].errors.wastage = "Enter valid Wastage";
      } else {
        newFormValues[i].errors.wastage = "";
      }
    }
    if (nm === "amount") {
      if (isNaN(val)) {
        newFormValues[i].errors.amount = "Enter valid amount";
      } else {
        newFormValues[i].errors.amount = "";
      }
    }
    // if (nm === "grossWeight") {
    //   newFormValues[i].errors.grossWeight = "";
    //   newFormValues[i].errors.netWeight = "";
    //   newFormValues[i].fineGold = "";
    //   newFormValues[i].wastage = "";
    //   newFormValues[i].purity = "";

    //   if (isChainZamZam === 1) {
    //     if (
    //       newFormValues[i].grossWeight !== "" &&
    //       newFormValues[i].purity !== ""
    //     ) {
    //       let addtotal =
    //         parseFloat(newFormValues[i].amount) / parseFloat(goldRatePerGram);
    //       if (isNaN(addtotal)) {
    //         addtotal = 0;
    //       }
    //       newFormValues[i].fineGold = parseFloat(
    //         (parseFloat(newFormValues[i].grossWeight) *
    //           parseFloat(newFormValues[i].purity)) /
    //           100 +
    //           addtotal
    //       ).toFixed(3);
    //     }
    //   }
    //   newFormValues[i].errors.netWeight = "";
    // }
    // if (nm === "netWeight") {
    //   if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
    //     let wastagePr =
    //       (parseFloat(val) * parseFloat(newFormValues[i].wastage)) / 100;
    //     if (isNaN(wastagePr)) {
    //       wastagePr = 0;
    //     }
    //     console.log(wastagePr);
    //     newFormValues[i].fineGold =
    //       (parseFloat(newFormValues[i].netWeight) *
    //         parseFloat(newFormValues[i].purity)) /
    //         100 +
    //       wastagePr;
    //     newFormValues[i].goldFine = parseFloat(
    //       (parseFloat(newFormValues[i].netWeight) *
    //         parseFloat(newFormValues[i].purity)) /
    //         100
    //     ).toFixed(3);
    //   }

    //   if (val === "" || val == 0) {
    //     newFormValues[i].fineGold = "0";
    //     newFormValues[i].netWeight = "";
    //     setAmount("");
    //     setTotalGrossWeight("");
    //     setTotalNetWeight("");
    //     setFineGoldTotal("");
    //   }

    //   if (
    //     parseFloat(newFormValues[i].netWeight) >
    //     parseFloat(newFormValues[i].grossWeight)
    //   || isNaN(val)) {
    //     newFormValues[i].errors.netWeight = "Enter valid Neteight";
    //   } else {
    //     newFormValues[i].netWeight = val;
    //     newFormValues[i].errors.netWeight = "";
    //   }
    // }

    // if (nm === "purity") {
    //   newFormValues[i].purity = val;
    //   if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
    //     let wastagePr =
    //       (parseFloat(newFormValues[i].netWeight) * parseFloat(newFormValues[i].wastage)) / 100;
    //     if (isNaN(wastagePr)) {
    //       wastagePr = 0;
    //     }
    //     console.log(wastagePr);
    //     newFormValues[i].fineGold =
    //       (parseFloat(newFormValues[i].netWeight) *
    //         parseFloat(newFormValues[i].purity)) /
    //         100 +
    //       wastagePr;

    //     newFormValues[i].goldFine = parseFloat(
    //       (parseFloat(newFormValues[i].netWeight) *
    //         parseFloat(newFormValues[i].purity)) /
    //         100
    //     ).toFixed(3);
    //   }

    //   if (val === "") {
    //     newFormValues[i].fineGold = "0";
    //     newFormValues[i].amount = "0";

    //     setAmount("");
    //     setTotalGrossWeight("");
    //     setTotalNetWeight("");
    //     setFineGoldTotal("");
    //   }

    //   if (val < 0.1 || val > 100 || isNaN(val)) {
    //     newFormValues[i].errors.purity = "Enter valid Purity";
    //   } else {
    //     newFormValues[i].purity = val;
    //     newFormValues[i].errors.purity = "";
    //   }
    // }

    // Only for Chain Retailer Zam Zam Chain
    // if (isChainZamZam === 1 && nm === "purity") {
    //   if (newFormValues[i].grossWeight !== "" && newFormValues[i].purity !== "") {
    //     let addtotal =
    //       parseFloat(newFormValues[i].amount) / parseFloat(goldRatePerGram);
    //     if (isNaN(addtotal)) {
    //       addtotal = 0;
    //     }
    //     newFormValues[i].fineGold = parseFloat(
    //       (parseFloat(newFormValues[i].grossWeight) *
    //         parseFloat(newFormValues[i].purity)) /
    //         100 +
    //         addtotal
    //     ).toFixed(3);
    //   }
    //   if (val < 0 || val > 100 || isNaN(val)) {
    //     newFormValues[i].errors.purity = "Enter valid Purity";
    //   } else {
    //     newFormValues[i].purity = val;
    //     newFormValues[i].errors.purity = "";
    //   }

    //   if (val === "") {
    //     newFormValues[i].fineGold = "0";
    //     newFormValues[i].amount = "0";

    //     setAmount("");
    //     setTotalGrossWeight("");
    //     setTotalNetWeight("");
    //     setFineGoldTotal("");
    //   }
    // }

    // if (nm === "wastage") {
    //   if (newFormValues[i].netWeight !== "") {
    //     console.log(newFormValues[i].fineGold);
    //     console.log(newFormValues[i].netWeight);
    //     console.log(val);
    //     if (val !== "") {
    //       newFormValues[i].wastage = val;
    //       let totalfine = (parseFloat(newFormValues[i].netWeight) * val) / 100;
    //       newFormValues[i].fineGold =
    //         (parseFloat(newFormValues[i].netWeight) *
    //           parseFloat(newFormValues[i].purity)) /
    //           100 +
    //         parseFloat(totalfine);
    //       newFormValues[i].wastageFine =
    //         (parseFloat(newFormValues[i].netWeight) * val) / 100;

    //       if (val < 0 || val > 100 || isNaN(val)) {
    //         newFormValues[i].errors.wastage = "Enter valid Wastage";
    //       } else {
    //         newFormValues[i].wastage = val;
    //         newFormValues[i].errors.wastage = "";
    //       }
    //     } else {
    //       newFormValues[i].fineGold =
    //         (parseFloat(newFormValues[i].netWeight) *
    //           parseFloat(newFormValues[i].purity)) /
    //         100;
    //     }
    //   }
    // }

    // if (nm === "amount") {
    //   newFormValues[i].amount = val;
    //   if(isNaN(val)){
    //     newFormValues[i].errors.amount = "Enter valid amount"
    //   }
    //   if (val === "") {
    //     if (
    //       newFormValues[i].grossWeight !== "" &&
    //       newFormValues[i].purity !== ""
    //     ) {
    //       newFormValues[i].fineGold = parseFloat(
    //         (parseFloat(newFormValues[i].grossWeight) *
    //           parseFloat(newFormValues[i].purity)) /
    //           100
    //       ).toFixed(3);
    //     }
    //   }
    //   if (
    //     newFormValues[i].amount !== "" &&
    //     newFormValues[i].fineGold !== "" &&
    //     goldRatePerGram !== ""
    //   ) {
    //     let addtotal =
    //       parseFloat(newFormValues[i].amount) / parseFloat(goldRatePerGram);
    //     newFormValues[i].fineGold = parseFloat(
    //       (parseFloat(newFormValues[i].grossWeight) *
    //         parseFloat(newFormValues[i].purity)) /
    //         100 +
    //         addtotal
    //     ).toFixed(3);
    //   }
    // }

    if (
      nm === "grossWeight" ||
      nm === "netWeight" ||
      nm === "purity" ||
      nm === "wastage" ||
      nm === "amount"
    ) {
      const grossWeight = newFormValues[i].grossWeight
        ? newFormValues[i].grossWeight
        : 0;
      const netWeight = newFormValues[i].netWeight
        ? newFormValues[i].netWeight
        : 0;
      const purity = newFormValues[i].purity ? newFormValues[i].purity : 0;
      const amount = newFormValues[i].amount ? newFormValues[i].amount : 0;
      const wastage = newFormValues[i].wastage ? newFormValues[i].wastage : 0;
      const goldRates = goldRatePerGram ? goldRatePerGram : 0;

      // Calculate the purity weight
      const purityWeight = netWeight ? (netWeight * purity) / 100 : 0;

      // Calculate the total wastage
      const totalWstg = (netWeight * wastage) / 100;

      // Calculate the addtotal
      const addtotal =
        goldRates && amount ? parseFloat(amount) / parseFloat(goldRates) : 0;

      // Calculate the fine gold weight
      const fineGold = purityWeight + totalWstg + addtotal;

      // Update the form values
      newFormValues[i].wastageFine = totalWstg;
      newFormValues[i].fineGold = fineGold.toFixed(3);
    }

    if (goldrateValue !== "") {
      const goldrateVal = goldrateValue / 10;
      newFormValues[i].amount = parseFloat(
        parseFloat(goldrateVal) * parseFloat(newFormValues[i].fineGold)
      ).toFixed(3);
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

    // setFormValues(newFormValues);
    if (!formValues[i + 1]) {
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
          description: "",
          wastage: "",
          goldFine: "",
          wastageFine: "",
          errors: {
            lotno: "",
            stockCode: "",
            categoryName: "",
            grossWeight: "",
            netWeight: "",
            pcs: "",
            purity: "",
            fineGold: "",
            amount: "",
            description: "",
            wastage: "",
          },
        },
      ]);
    }

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
    newFormValues[index].description = "";
    newFormValues[index].wastage = "";

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

  const validateEmptyError = () => {
    let arrData = [...formValues];
    let flag = true;
    arrData.map((item) => {
      console.log(!errorCheck(item.errors));
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

  return (
    <div
      className={clsx(classes.root, props.className, "w-full")}
      id="metalpurchase-main"
    >
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            {!props.viewPopup && (
              <Grid
                // className="jewellerypreturn-main"
                container
                alignItems="center"
                style={{ paddingLeft: 30, paddingRight: 21, paddingBlock: 10 }}
              >
                <Grid item xs={7} sm={7} md={7} key="1">
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
                  xs={5}
                  sm={5}
                  md={5}
                  key="2"
                  style={{ textAlign: "right" }}
                >
                  <div className="btn-back">
                    <img src={Icones.arrow_left_pagination} alt="" />
                    <Button
                      id="btn-back"
                      variant="contained"
                      className={classes.button}
                      size="small"
                      onClick={(event) => {
                        History.goBack();
                      }}
                    >
                      Back
                    </Button>
                  </div>
                </Grid>
              </Grid>
            )}
            <div className="main-div-alll ">
              {loading && <Loader />}
              <div
                className="pb-32 pt-20  articianissue-resturn-form"
                style={{ marginBottom: "10%", height: "90%" }}
              >
                <div>
                  <form
                    name="registerForm"
                    noValidate
                    className="flex flex-col justify-center w-full"
                    onSubmit={handleFormSubmit}
                  >
                    <Grid container spacing={3} className="p-8">
                      {allowedBackDate && (
                        <Grid
                          item
                          lg={2}
                          md={4}
                          sm={4}
                          xs={12}
                          style={{ padding: 6 }}
                        >
                          <p>Voucher Date</p>

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
                              max: moment().format("YYYY-MM-DD"),
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            disabled={isView}
                          />
                        </Grid>
                      )}
                      {/* <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p>Today's Rate*</p>{" "}
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
                            style: { lineHeight: "11px" },
                          }}
                        />
                      </Grid> */}
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
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
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p>Client Name</p>
                        <Select
                          className="view_consumablepurchase_dv"
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          options={jobworkerData.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.client_Name,
                          }))}
                          // components={components}
                          value={selectedJobWorker}
                          onChange={handlePartyChange}
                          placeholder="Client Name"
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

                      {/* <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p>Party voucher date</p>
                        <TextField
                          placeholder="Party voucher date"
                          type="date"
                          className="mb-16"
                          name="partyVoucherDate"
                          value={partyVoucherDate}
                          onChange={(e) => setPartyVoucherDate(e.target.value)}
                          // onKeyDown={(e) => e.preventDefault()}
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                          disabled={isView}
                        />
                      </Grid> */}

                      {/* <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p>Party voucher number</p>
                        <TextField
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
                      </Grid> */}

                      {!isView && (
                        <Grid
                          item
                          lg={2}
                          md={4}
                          sm={4}
                          xs={12}
                          style={{ padding: 6 }}
                        >
                          <p>Upload Document</p>
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
                      {isChainZamZam === 1 && (
                        <Grid
                          item
                          lg={2}
                          md={4}
                          sm={4}
                          xs={12}
                          style={{ padding: 6 }}
                        >
                          <p>Gold Rate/Per Gram</p>
                          <TextField
                            name="goldratepergram"
                            value={goldRatePerGram}
                            onChange={(e) => handleInputChange(e)}
                            variant="outlined"
                            required
                            fullWidth
                            disabled={isView}
                            placeholder="Gold Rate/Per Gram"
                          />
                        </Grid>
                      )}
                    </Grid>

                    <div className="table_full_width add-articianissue-tbl">
                      <div
                        className="mt-16 table-metal-purchase inner-add-articianissue-tbl view_artician_issue_dv "
                        style={{
                          border: "1px solid #EBEEFB",
                          paddingBottom: 5,
                          borderRadius: "7px",
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
                              {/* Action */}
                            </div>
                          )}
                          {/* <div className={clsx(classes.tableheader, "")}>
                            Available Stock
                          </div> */}

                          {/* <div className={clsx(classes.tableheader, "")}>
                            Pieces
                          </div> */}
                          <div className={clsx(classes.tableheader, "")}>
                            Description
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
                          {/* {isChainZamZam === 0 && ( */}
                          <div className={clsx(classes.tableheader, "")}>
                            Wastage(%)
                          </div>
                          {/* )} */}
                          {isChainZamZam === 1 && (
                            <div className={clsx(classes.tableheader, "")}>
                              Amount
                            </div>
                          )}
                          <div className={clsx(classes.tableheader, "")}>
                            Fine Gold
                          </div>
                          {/* <div className={clsx(classes.tableheader, "")}>
                            Rate Of Fine Gold
                          </div> */}
                          {/* <div className={clsx(classes.tableheader, "")}>
                            Amount
                          </div> */}
                        </div>

                        {formValues.map((element, index) => (
                          <div
                            key={index}
                            className="castum-row-dv all-purchase-tabs"
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
                                  <Icon className="delete-icone">
                                    <img src={Icones.delete_red} alt="" />
                                  </Icon>
                                </IconButton>
                              </div>
                            )}
                            {/* <TextField
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
                            /> */}

                            {/* <TextField
                              // label="Gross Weight"
                              name="pcs"
                              // className=""
                              value={element.pcs || ""}
                              // value={departmentNm}
                              error={
                                element.errors !== undefined
                                  ? element.errors.pcs
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.pcs
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              disabled={isView} //|| element.stock_group !== 5
                              inputRef={(el) =>
                                (pcsInputRef.current[index] = el)
                              }
                              variant="outlined"
                              fullWidth
                            /> */}
                            <TextField
                              name="description"
                              className={classes.inputBoxTEST}
                              type="text"
                              variant="outlined"
                              fullWidth
                              value={element.description || ""}
                              error={
                                element.errors !== undefined
                                  ? element.errors.description
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.description
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              onBlur={(e) => handlerBlur(index, e)}
                              inputRef={(el) =>
                                (wtInputRef.current[index] = el)
                              }
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
                              inputRef={(el) =>
                                (wtInputRef.current[index] = el)
                              }
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                            />
                            <TextField
                              name="netWeight"
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
                              variant="outlined"
                              fullWidth
                              disabled={isView || isChainZamZam === 1}
                            />

                            <TextField
                              name="purity"
                              value={element.purity || ""}
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
                              disabled={isView}
                            />
                            {/* {isChainZamZam === 0 && ( */}
                            <TextField
                              name="wastage"
                              variant="outlined"
                              fullWidth
                              value={element.wastage || ""}
                              error={
                                element.errors !== undefined
                                  ? element.errors.wastage
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.wastage
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              onBlur={(e) => handlerBlur(index, e)}
                              inputRef={(el) =>
                                (wtInputRef.current[index] = el)
                              }
                              disabled={isView}
                            />
                            {/* )} */}
                            {isChainZamZam === 1 && (
                              <TextField
                                name="amount"
                                value={
                                  isView
                                    ? Config.numWithComma(element.amount)
                                    : element.amount
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
                                disabled={isView}
                              />
                            )}
                            {console.log(element)}
                            <TextField
                              // label="Fine Gold"
                              name="fineGold"
                              value={
                                element.fineGold
                                  ? parseFloat(element.fineGold).toFixed(3)
                                  : ""
                              }
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
                            {/* <TextField
                              // label="Rate"
                              name="rate"
                              // className=""
                              value={
                                isView
                                  ? Config.numWithComma(element.rate)
                                  : element.rate || ""
                              }
                              // value={departmentNm}
                              error={
                                element.errors !== undefined
                                  ? element.errors.rate
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.rate
                                  : ""
                              }
                              onChange={(e) => handleChange(index, e)}
                              onBlur={(e) => handlerBlur(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                            /> */}
                            {/* <TextField
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
                              disabled
                            /> */}
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
                                " delete_icons_dv"
                              )}
                              style={{ backgroundColor: "#ebeefb" }}
                            >
                              {/* action */}
                            </div>
                          )}
                          <div
                            className={clsx(
                              classes.tableheader,
                              "castum-width-table"
                            )}
                          >
                            {/* Category Name */}
                          </div>
                          {/* {
                            <div
                              className={clsx(
                                classes.tableheader,
                                "castum-width-table"
                              )}
                            >
                              Available Stock
                            </div>
                          } */}
                          {/* <div
                            className={clsx(
                              classes.tableheader,
                              "castum-width-table"
                            )}
                          >
                            {HelperFunc.getTotalOfFieldNoDecimal(
                              formValues,
                              "pcs"
                            )}
                          </div> */}
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
                            {totalNetWeight}
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
                          {/* <div
                            className={clsx(
                              classes.tableheader,
                              "castum-width-table"
                            )}
                          >
                            {" "}
                            {fineGoldTotal}
                          </div> */}
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
                            style={{
                              textAlign: "right",
                              justifyContent: "flex-end",
                            }}
                          >
                            {fineGoldTotal}
                          </div>
                          {/* <div
                            className={clsx(
                              classes.tableheader,
                              "castum-width-table"
                            )}
                          >
                            {isView ? Config.numWithComma(amount) : amount}
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </form>

                  <div className="textarea-row mt-16">
                    <div style={{ width: " 100%", marginRight: "20px" }}>
                      <p>Metal Narration</p>
                      <TextField
                        // className="mt-16 mr-2"
                        // style={{ width: "50%" }}
                        // label="Metal Narration"
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
                        // disabled={isView}
                        disabled={narrationFlag}
                        placeholder="Metal Narration"
                      />
                    </div>
                    <div style={{ width: " 100%" }}>
                      <p>Account Narration</p>
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
                        // disabled={isView}
                        disabled={narrationFlag}
                        placeholder="Account Narration"
                      />
                    </div>
                  </div>
                  {!props.viewPopup && (
                    <div>
                      {!isView && (
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
                      )}

                      <Button
                        variant="contained"
                        // color="primary"
                        style={{ float: "right", backgroundColor: "limegreen" }}
                        className="w-224 mx-auto mt-16 mr-16 btn-print-save"
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

export default AddArticianIssueChainRetailer;

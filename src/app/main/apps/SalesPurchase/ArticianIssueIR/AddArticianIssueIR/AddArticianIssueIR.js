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
// import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import History from "@history";
import Select, { createFilter } from "react-select";
import Loader from "app/main/Loader/Loader";
import moment from "moment";
import { Icon, IconButton } from "@material-ui/core";
import { ArticianIssuePrintComp } from "../PrintComponent/ArticianIssuePrintComp";
import { useReactToPrint } from "react-to-print";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";
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
    backgroundColor: "gray",
    color: "white",
  },
}));

const AddArticianIssueIR = (props) => {

  const dispatch = useDispatch();
 
  const [isView, setIsView] = useState(false); //for view Only

  const pcsInputRef = useRef([])//for pcs in table
  const wtInputRef = useRef([])//for weight in table
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
      pcs: "",
      availWeight: "",
      availPcs: "",
      availableStock: "",
      purity: "",
      fineGold: "",
      rate: "",
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
        rate: null,
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
      rate: "",
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
        rate: null,
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
      rate: "",
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
        rate: null,
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
      rate: "",
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
        rate: null,
        amount: null,
      },
    },
  ]);

  const [printObj, setPrintObj] = useState({
    loadType: "",
    stateId: "",
    supplierName: "",
    supAddress: "",
    supplierGstUinNum: "",
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
  })

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);
  const loadTypeRef = useRef(null)

  // const [loading, setLoading] = React.useState(false);
  // const [text, setText] = React.useState("old boring text");

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

  const [documentList, setDocumentList] = useState([])
  const [docModal, setDocModal] = useState(false)
  const [docFile, setDocFile] = useState("");
  const [narrationFlag, setNarrationFlag] = useState(false);
  const [docIds, setDocIds] = useState([]);

  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 27)
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

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

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
    documentTitle: "Artisan_Issue_IR_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true
  });

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  function checkforPrint() {
    // console.log("????????????????????????")
    console.log("checkforPrint", formValues);
    if (
      loadValidation() &&
      voucherNumValidation() &&
      partyNameValidation()
      // && partyVoucherNumValidation()
    ) {
      console.log("if");
      if (isView) {
        handlePrint();
      } else {
        if (handleDateBlur()&&prevContactIsValid()) {

          addArticianIssueApi(false, true)
        } else {
          console.log("prevContactIsValid else");
        }
      }

    } else {
      console.log("else");
    }
  }

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [loading, setLoading] = useState(false);
  // value="0" Load  Metal Variant, lot number input and category data popup, insert purity
  // value="1" Load Finding Variant, same as above
  // value="2" Load Lot directly, as before stockcode data and category name from selection

  const [selectedLoad, setSelectedLoad] = useState("");
  const [selectedLoadErr, setSelectedLoadErr] = useState("");

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [jobworkerData, setJobworkerData] = useState([]);
  const [selectedJobWorker, setSelectedJobWorker] = useState("");
  const [selectedJobWorkerErr, setSelectedJobWorkerErr] = useState("");

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");

  const [stockCodeData, setStockCodeData] = useState([]);

  // const [stockCodeFindings, setStockCodeFindings] = useState([]);

  const [lotdata, setLotData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");

  const [stateId, setStateId] = useState("");
  const [cgstVal, setCgstVal] = useState("");
  const [sgstVal, setSgstVal] = useState("");
  const [igstVal, setIgstVal] = useState("")
  const [totalAmount, setTotalAmount] = useState("")

  //below table total val field
  const [amount, setAmount] = useState("");

  const [fineGoldTotal, setFineGoldTotal] = useState("");

  const [totalGrossWeight, setTotalGrossWeight] = useState("");
  const [totalNetWeight, setTotalNetWeight] = useState("")

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [metalNarration, setMetalNarration] = useState("");
  const [metalNarrationErr, setMetalNarrationErr] = useState("");

  const theme = useTheme();

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000); // 10초 뒤에
    }
  }, [loading]);

  if (props.location) {
    var idToBeView = props.location.state;
  } else if (props.voucherId) {
    var idToBeView = { id: props.voucherId }
  }
 
  let handleManualLotNoChange = (i, e) => {
    console.log(e);
    let newFormValues = [...formValues];
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
    newFormValues[i].pcs = "";
    newFormValues[i].HSNnum = "";
    newFormValues[i].amount = "";
    newFormValues[i].cgstVal = "";
    newFormValues[i].sgstVal = "";
    newFormValues[i].igstVal = "";
    newFormValues[i].totalAmount = "";
    newFormValues[i].fineGold = "";
    setFormValues(newFormValues);
  };

  let handleLotNumChange = (i, e) => {
    console.log(e);
    let newFormValues = [...formValues];
    // newFormValues[i].lotno = {
    //   value: e.value,
    //   label: e.label,
    // };
    // newFormValues[i].errors.lotno = null;

    let findIndex = lotdata.findIndex((item) => item.number === e);

    if (findIndex > -1) {
      console.log(lotdata[findIndex],"fghttty")
      newFormValues[i].purity = lotdata[findIndex].LotMetalStockCode.purity;
      newFormValues[i].lotno = {
        value: lotdata[findIndex].id,
        label: lotdata[findIndex].number,
      };
      newFormValues[i].grossWeight = parseFloat(lotdata[findIndex].total_gross_wgt).toFixed(3);
      newFormValues[i].categoryName =
        lotdata[findIndex].ProductCategory.category_name;
      newFormValues[i].netWeight = parseFloat(lotdata[findIndex].total_net_wgt).toFixed(3);
      newFormValues[i].pcs = lotdata[findIndex].pcs
      newFormValues[i].rate = "";
      newFormValues[i].amount = "";
      newFormValues[i].HSNnum = lotdata[findIndex].ProductCategory.hsn_master.hsn_number;//stockCodeData[findIndex].hsn_master.hsn_number;

      newFormValues[i].cgstPer = stateId === 12 ? parseFloat(parseFloat(lotdata[findIndex].ProductCategory.hsn_master.gst) / 2).toFixed(3) : "0"
      newFormValues[i].sgstPer = stateId === 12 ? parseFloat(parseFloat(lotdata[findIndex].ProductCategory.hsn_master.gst) / 2).toFixed(3) : "0"
      newFormValues[i].igstPer = stateId !== 12 ? parseFloat(lotdata[findIndex].ProductCategory.hsn_master.gst).toFixed(3) : "0"
      newFormValues[i].cgstVal = "";
      newFormValues[i].sgstVal = "";
      newFormValues[i].igstVal = "";
      newFormValues[i].totalAmount = "";

      if (
        newFormValues[i].netWeight !== "" &&
        newFormValues[i].purity !== ""
      ) {
        newFormValues[i].fineGold = parseFloat(
          (parseFloat(newFormValues[i].netWeight) *
            parseFloat(newFormValues[i].purity)) /
          100
        ).toFixed(3);
      } else {
        newFormValues[i].fineGold = "0";
      }
    }
    console.log(newFormValues);
    if (i === formValues.length - 1) {
      // addFormFields();
      changeTotal(newFormValues, true);
    } else {
      changeTotal(newFormValues, false);

    }
  };

  let handleStockGroupChange = (i, e) => {
    // console.log(e);
    let newFormValues = [...formValues];
    newFormValues[i].stockCode = {
      value: e.value,
      label: e.label,
      pcs_require: e.pcs_require
    };
    newFormValues[i].errors.stockCode = null;

    let findIndex = stockCodeData.findIndex(
      (item) => item.stock_name_code.id === e.value
    );
    if (findIndex > -1) {
      console.log(stockCodeData[findIndex]);
      newFormValues[i].stock_group = stockCodeData[findIndex].stock_group.item_id;
      newFormValues[i].grossWeight = "";
      newFormValues[i].netWeight = "";
      newFormValues[i].rate = "";
      newFormValues[i].amount = "";
      newFormValues[i].lotno = "";
      newFormValues[i].pcs = "";
      newFormValues[i].availPcs = stockCodeData[findIndex].pcs;
      newFormValues[i].availWeight = stockCodeData[findIndex].weight;
      newFormValues[i].availableStock = stockCodeData[findIndex].stock_group.item_id === 1 ? "Wt: " + parseFloat(stockCodeData[findIndex].weight).toFixed(3) : "Wt: " + parseFloat(stockCodeData[findIndex].weight).toFixed(3) + ", Pcs :" + stockCodeData[findIndex].pcs;
      //  "Wt: " + parseFloat(stockCodeData[findIndex].weight).toFixed(3) + ", Pcs :" + stockCodeData[findIndex].pcs;

      newFormValues[i].HSNnum = stockCodeData[findIndex].hsn_master.hsn_number;

      newFormValues[i].cgstPer = stateId === 12 ? parseFloat(parseFloat(stockCodeData[findIndex].hsn_master.gst) / 2).toFixed(3) : "0"
      newFormValues[i].sgstPer = stateId === 12 ? parseFloat(parseFloat(stockCodeData[findIndex].hsn_master.gst) / 2).toFixed(3) : "0"
      newFormValues[i].igstPer = stateId !== 12 ? parseFloat(stockCodeData[findIndex].hsn_master.gst).toFixed(3) : "0"
      newFormValues[i].cgstVal = "";
      newFormValues[i].sgstVal = "";
      newFormValues[i].igstVal = "";
      newFormValues[i].totalAmount = "";
      // 1- gold 2- silver 3 -bronze
      if (stockCodeData[findIndex].stock_group.item_id === 1) {
        // console.log("if")
        newFormValues[i].purity =
          stockCodeData[findIndex].stock_name_code.purity;
      } else {
        // console.log("else")
        newFormValues[i].purity = "0";
      }

      if (
        newFormValues[i].grossWeight !== "" &&
        newFormValues[i].purity !== ""
      ) {
        newFormValues[i].fineGold =
          parseFloat((parseFloat(newFormValues[i].grossWeight) *
            parseFloat(newFormValues[i].purity)) /
            100).toFixed(3);
      } else {
        newFormValues[i].fineGold = "0";
      }

      newFormValues[i].categoryName = stockCodeData[findIndex].stock_name;
      newFormValues[i].errors.categoryName = null;
    }

    console.log(newFormValues);
    if (i === formValues.length - 1) {
      // addFormFields();
      changeTotal(newFormValues, true);
    } else {
      changeTotal(newFormValues, false);

    }

    if (newFormValues[i].stock_group !== 5) {

      wtInputRef.current[i].focus()
    } else {
      setTimeout(() => {//disabled text condition here so timeout
        pcsInputRef.current[i].focus()
        // pcsInputRef.current[i].click();
        // pcsInputRef.current[i].value = "myname";
        // console.log("else--------")
      }, 200);
    }

    // setAdjustedRate(false);
    // if (adjustedRate === true) {
    //   handleRateValChange();
    // }
  };

  function changeTotal(newFormValues, addFlag) {
    function amount(item) {
      // console.log(item.amount)
      return item.amount;
    }

    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
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
    // console.log(formValues.map(amount).reduce(sum))

    let tempAmount = newFormValues
      .filter((item) => item.amount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    //.reduce(sum);
    // console.log("tempAmount>>>",tempAmount.toFixed(3))
    setAmount(parseFloat(tempAmount).toFixed(3));

    let tempGrossWtTot = parseFloat(newFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

    function netWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.netWeight);
    }

    let tempNetWtTot = parseFloat(newFormValues
      .filter((data) => data.netWeight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3))

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
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
      setCgstVal(parseFloat(tempCgstVal).toFixed(3));

      tempSgstVal = newFormValues
        .filter((item) => item.sgstVal !== "")
        .map(SGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setSgstVal(parseFloat(tempSgstVal).toFixed(3));

    } else {
      tempIgstVal = newFormValues
        .filter((item) => item.igstVal !== "")
        .map(IGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setIgstVal(parseFloat(tempIgstVal).toFixed(3));
    }

    function totalAmount(item) {
      return parseFloat(item.totalAmount)
    }

    let tempTotal = newFormValues
      .filter((item) => item.totalAmount !== "")
      .map(totalAmount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotalAmount(parseFloat(tempTotal).toFixed(3));

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
    })

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
          rate: "",
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
            rate: null,
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
    console.log("idToBeView", idToBeView);
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true);
      getArticianIssueRecord(idToBeView.id);
    } else {
      setNarrationFlag(false);
      getStockCodeAll();
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
    let api = ""
    if(props.forDeletedVoucher){
      api = `api/jobworkarticianissue/${id}?deleted_at=1`
    }else {
      api = `api/jobworkarticianissue/${id}`
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response.data.data);

        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              // setApiData(response.data.data[0]);
              let finalData = response.data.data.data;
              let loadType = response.data.data.otherDetails.loadType
              setSelectedLoad(loadType.toString())
              setDocumentList(finalData.salesPurchaseDocs)
              setTimeDate(response.data.data.data.created_at);
              setVoucherNumber(finalData.voucher_no);
              setPartyVoucherDate(finalData.party_voucher_date)
              setAllowedBackDate(true);
              setVoucherDate(finalData.purchase_voucher_create_date);
              setSelectedJobWorker({
                value: finalData.JobWorker.id,
                label: finalData.JobWorker.name,
              });
              setFirmName(finalData.JobWorker.firm_name);

              setPartyVoucherNum(finalData.party_voucher_no);


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

              let tempStateId = finalData.JobWorker.state_name.id;

              let tempArray = [];

              if (loadType === 0) {

                // console.log(OrdersData);
                for (let item of finalData.JobWorkArticianIssueOrder) {
                  // console.log(item);
                  let tCgstPer = tempStateId === 12 ? parseFloat(parseFloat(item.StockNameCode.stock_name_code.hsn_master.gst) / 2).toFixed(3) : ""
                  let tSgstper = tempStateId === 12 ? parseFloat(parseFloat(item.StockNameCode.stock_name_code.hsn_master.gst) / 2).toFixed(3) : ""
                  let tIgstPer = tempStateId !== 12 ? parseFloat(item.StockNameCode.stock_name_code.hsn_master.gst).toFixed(3) : "";

                  let tCgstVal = tempStateId === 12 ? parseFloat(parseFloat(item.amount) * parseFloat(tCgstPer) / 100).toFixed(3) : ""
                  let tSgstVal = tempStateId === 12 ? parseFloat(parseFloat(item.amount) * parseFloat(tSgstper) / 100).toFixed(3) : ""
                  let tIgstVal = tempStateId !== 12 ? parseFloat(parseFloat(item.amount) * parseFloat(tIgstPer) / 100).toFixed(3) : ""

                  let tTotal = tempStateId === 12 ?
                    parseFloat(parseFloat(item.amount) + parseFloat(tCgstVal) + parseFloat(tSgstVal)).toFixed(3)
                    :
                    parseFloat(parseFloat(item.amount) + parseFloat(tIgstVal)).toFixed(3)

                  tempArray.push({

                    stockCode: {
                      value: item.StockNameCode.id,
                      label: item.StockNameCode.stock_code,
                    },
                    categoryName: item.stock_name,
                    HSNnum: item.StockNameCode.stock_name_code.hsn_master.hsn_number,
                    // selectedHsn: item.StockNameCode.stock_name_code.hsn_master.hsn_number,
                    pcs: item.pcs,
                    grossWeight: parseFloat(item.gross_weight).toFixed(3),
                    netWeight: parseFloat(item.net_weight).toFixed(3),
                    purity: item.purity.toString(),
                    fineGold: parseFloat(item.finegold).toFixed(3),
                    rate: parseFloat(item.rate_of_fine_gold).toFixed(3),
                    amount: parseFloat(item.amount).toFixed(3),
                    cgstPer: tCgstPer,
                    sgstPer: tSgstper,
                    igstPer: tIgstPer,
                    cgstVal: tCgstVal,
                    sgstVal: tSgstVal,
                    igstVal: tIgstVal,
                    totalAmount: tTotal,

                  });
                }
                setFormValues(tempArray);

              } else if (loadType === 1) {
                for (let item of finalData.JobWorkArticianIssueOrder) {
                  // console.log(item);
                  let tCgstPer = tempStateId === 12 ? parseFloat(parseFloat(item.Category.hsn_master.gst) / 2).toFixed(3) : ""
                  let tSgstper = tempStateId === 12 ? parseFloat(parseFloat(item.Category.hsn_master.gst) / 2).toFixed(3) : ""
                  let tIgstPer = tempStateId !== 12 ? parseFloat(item.Category.hsn_master.gst).toFixed(3) : "";

                  let tCgstVal = tempStateId === 12 ? parseFloat(parseFloat(item.amount) * parseFloat(tCgstPer) / 100).toFixed(3) : ""
                  let tSgstVal = tempStateId === 12 ? parseFloat(parseFloat(item.amount) * parseFloat(tSgstper) / 100).toFixed(3) : ""
                  let tIgstVal = tempStateId !== 12 ? parseFloat(parseFloat(item.amount) * parseFloat(tIgstPer) / 100).toFixed(3) : ""

                  let tTotal = tempStateId === 12 ?
                    parseFloat(parseFloat(item.amount) + parseFloat(tCgstVal) + parseFloat(tSgstVal)).toFixed(3)
                    :
                    parseFloat(parseFloat(item.amount) + parseFloat(tIgstVal)).toFixed(3)

                  tempArray.push({

                    lotno: {
                      value: item.Lot.id,
                      label: item.Lot.number
                    },
                    categoryName: item.Category.category_name,
                    grossWeight: parseFloat(item.gross_weight).toFixed(3),
                    netWeight: parseFloat(item.net_weight).toFixed(3),
                    pcs: item.pcs,
                    HSNnum: item.Category.hsn_master.hsn_number,
                    purity: item.purity.toString(),
                    fineGold: parseFloat(item.finegold).toFixed(3),
                    rate: parseFloat(item.rate_of_fine_gold).toFixed(3),
                    amount: parseFloat(item.amount).toFixed(3),
                    cgstPer: tCgstPer,
                    sgstPer: tSgstper,
                    igstPer: tIgstPer,
                    cgstVal: tCgstVal,
                    sgstVal: tSgstVal,
                    igstVal: tIgstVal,
                    totalAmount: tTotal,

                  });
                }
                setFormValues(tempArray);
              }


              function amount(item) {
                // console.log(item.amount)
                return item.amount;
              }

              function grossWeight(item) {
                // console.log(parseFloat(item.grossWeight));
                return parseFloat(item.grossWeight);
              }
              // console.log(formValues.map(amount).reduce(sum))

              let tempAmount = tempArray
                .filter((item) => item.amount !== "")
                .map(amount)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              //.reduce(sum);
              // console.log("tempAmount",tempAmount)
              setAmount(parseFloat(tempAmount).toFixed(3));

              function netWeight(item) {
                // console.log(parseFloat(item.grossWeight));
                return parseFloat(item.netWeight);
              }

              let tempNetWtTot = parseFloat(tempArray
                .filter((data) => data.netWeight !== "")
                .map(netWeight)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0)).toFixed(3);

              setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3))

              let tempGrossWtTot = parseFloat(tempArray
                .filter((data) => data.grossWeight !== "")
                .map(grossWeight)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0)).toFixed(3)

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
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
                setCgstVal(parseFloat(tempCgstVal).toFixed(3));

                tempSgstVal = tempArray
                  .filter((item) => item.sgstVal !== "")
                  .map(SGSTval)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setSgstVal(parseFloat(tempSgstVal).toFixed(3));

              } else {
                tempIgstVal = tempArray
                  .filter((item) => item.igstVal !== "")
                  .map(IGSTVal)
                  .reduce(function (a, b) {
                    // sum all resulting numbers
                    return parseFloat(a) + parseFloat(b);
                  }, 0);
                setIgstVal(parseFloat(tempIgstVal).toFixed(3));
              }

              function totalAmount(item) {
                return parseFloat(item.totalAmount)
              }

              let tempTotal = tempArray
                .filter((item) => item.totalAmount !== "")
                .map(totalAmount)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setTotalAmount(parseFloat(tempTotal).toFixed(3));


              setPrintObj({
                loadType: loadType.toString(),
                stateId: tempStateId,
                supplierName: finalData.JobWorker.firm_name,
                supAddress: finalData.JobWorker.address,
                supplierGstUinNum: finalData.JobWorker.gst_number === null ? "" : finalData.JobWorker.gst_number,
                supPanNum: finalData.JobWorker.pan_number,
                supState: finalData.JobWorker.state_name.name,
                supCountry: finalData.JobWorker.country_name.name,
                supStateCode: finalData.JobWorker.gst_number === null ? "-" : finalData.JobWorker.gst_number.substring(0, 2),
                purcVoucherNum: finalData.voucher_no,
                voucherDate: moment(finalData.purchase_voucher_create_date).format("DD-MM-YYYY"),
                placeOfSupply: finalData.JobWorker.state_name.name,
                orderDetails: tempArray,
                grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
                netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                fineWtTot: parseFloat(tempFineGold).toFixed(3),
                amount: parseFloat(tempAmount).toFixed(3),
                sGstTot: parseFloat(tempSgstVal).toFixed(3),
                cGstTot: parseFloat(tempCgstVal).toFixed(3),
                iGstTot: parseFloat(tempIgstVal).toFixed(3),
                totalAmount: parseFloat(tempTotal).toFixed(3),
                metalNarration: finalData.metal_narration !== null ? finalData.metal_narration : "",
                accNarration: finalData.account_narration !== null ? finalData.account_narration : "",
                signature: finalData.admin_signature,
                
              })

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

  function getLotData() {
    axios
      .get(
        Config.getCommonUrl() +
        "api/lot/department/" +
        window.localStorage.getItem("SelectedDepartment")
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setLotData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/lot/department/" +
            window.localStorage.getItem("SelectedDepartment")
        })
      });
  }

  //add context if needed to change on change
  //called available stock only

  function getStockCodeAll() {
    axios
      .get(Config.getCommonUrl() + "api/stock/getstockcodes?department_id=" +
        window.localStorage.getItem("SelectedDepartment")
        // "api/stockname"
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockCodeData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/stock/getstockcodes?department_id=" +
            window.localStorage.getItem("SelectedDepartment")
        })
      });
  }

  function getJobworkerdata() {
    axios
      .get(Config.getCommonUrl() + "api/jobworker/listing/listing")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setJobworkerData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/jobworker/listing/listing" })
      });
  }

  function getVoucherNumber() {
    axios
      .get(Config.getCommonUrl() + "api/jobworkarticianissue/get/voucher")
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
        handleError(error, dispatch, { api: "api/jobworkarticianissue/get/voucher" })
      });
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
      })
    }
    else if (name === "partyVoucherNum") {
      setPartyVoucherNum(value);
      setPartyVoucherNumErr("");
    }
    else if (name === "metalNarration") {
      setMetalNarration(value);
      setMetalNarrationErr("");
      setPrintObj({
        ...printObj,
        metalNarration: value,
      })
    } else if (name === "accNarration") {
      setAccNarration(value);
      setAccNarrationErr("");
      setPrintObj({
        ...printObj,
        accNarration: value
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
    if (selectedJobWorker === "") {
      setSelectedJobWorkerErr("Please Select Job Worker");
      return false;
    }
    return true;
  }

  // function partyVoucherNumValidation() {
  //   const Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
  //   if (!partyVoucherNum || Regex.test(partyVoucherNum) === false) {
  //     setPartyVoucherNumErr("Enter Valid Voucher Number");
  //     return false;
  //   }
  //   return true;
  // }

  function loadValidation() {
    if (selectedLoad === "") {
      setSelectedLoadErr("Please Select Valid Option");
      return false;
    }
    return true;
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();

    // console.log(parseInt(gstType));
    console.log("handleFormSubmit", formValues);
    if (
      loadValidation() &&
      handleDateBlur()&&
      voucherNumValidation() &&
      partyNameValidation()
      // && partyVoucherNumValidation()
    ) {
      console.log("if");
      if (prevContactIsValid()) {
        addArticianIssueApi(true, false);
      } else {
        console.log("prevContactIsValid else");
      }
    } else {
      console.log("else");
    }
  }

  function addArticianIssueApi(resetFlag, toBePrint) {
    console.log("fineGoldTotal", fineGoldTotal);

    let Orders = formValues
      .filter((element) => element.grossWeight !== "")
      .map((x) => {
        if (selectedLoad === "1") {
          return {
            // gross_weight: x.grossWeight,
            // rate_of_fine_gold: x.rate,
            // category_id: x.categoryName.value,
            // lot_no: x.lotno,
            // purity: x.purity,
            lot_id: x.lotno.value,
            rate_of_fine_gold: x.rate,
          };
        } else {
          return {
            stock_name_code_id: x.stockCode.value,
            gross_weight: x.grossWeight,
            rate_of_fine_gold: x.rate,
            pcs: x.pcs
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
      // opposite_account_id: 1, //oppositeAccSelected.value,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      jobworker_id: selectedJobWorker.value,
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      is_lot: selectedLoad === "1" ? 1 : 0,
      metal_narration: metalNarration,
      account_narration: accNarration,
      Orders: Orders,
      uploadDocIds: docIds,
      party_voucher_date:partyVoucherDate,
    }
    console.log(body)
    axios
      .post(Config.getCommonUrl() + "api/jobworkarticianissue", body)
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
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);
        handleError(error, dispatch, { api: "api/jobworkarticianissue", body: body })
      })
  }

  function resetForm(flag) {
    setAmount("");
    setTotalGrossWeight("");
    setTotalNetWeight("")
    setFineGoldTotal("");
    setCgstVal("");
    setSgstVal("");
    setIgstVal("")
    setTotalAmount("")

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
          pcs: "",
          availWeight: "",
          availPcs: "",
          availableStock: "",
          purity: "",
          fineGold: "",
          rate: "",
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
            rate: null,
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
          rate: "",
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
            rate: null,
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
          rate: "",
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
            rate: null,
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
          rate: "",
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
            rate: null,
            amount: null,
          },
        },
      ]);
    } else {
      // only value change amount rate etc
      let newFormValues = formValues
        .map((x) => {
          return {
            ...x,
            rate: "",
            amount: "",
            cgstVal: "",
            sgstVal: "",
            igstVal: "",
            totalAmount: "",
          };
        });
      // console.log(newFormValues)
      changeTotal(newFormValues, false)
    }
  }

  function handlePartyChange(value) {
    console.log(value);
    setSelectedJobWorker(value);
    setSelectedJobWorkerErr("");
    setStateId("")
    setPartyVoucherNum("");
    setFirmName("");

    resetForm(true);

    const index = jobworkerData.findIndex(
      (element) => element.id === value.value
    );
    // console.log(index);

    if (index > -1) {
      console.log(jobworkerData[index])
      setStateId(jobworkerData[index].state_name.id)
      setFirmName(jobworkerData[index].firm_name);

      setPrintObj({
        ...printObj,
        stateId: jobworkerData[index].state_name.id,
        loadType: selectedLoad,
        supplierName: jobworkerData[index].firm_name,
        supAddress: jobworkerData[index].address,
        supplierGstUinNum: jobworkerData[index].gst_number === null ? jobworkerData[index].gst_type : jobworkerData[index].gst_number,
        supPanNum: jobworkerData[index].pan_number,
        supState: jobworkerData[index].state_name.name,
        supCountry: jobworkerData[index].country_name.name,
        supStateCode: jobworkerData[index].gst_number === null ? "-" : jobworkerData[index].gst_number.substring(0, 2),
        // purcVoucherNum: "",
        // voucherDate: moment().format("YYYY-MM-DD"),
        placeOfSupply: jobworkerData[index].state_name.name,
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
      })
    }
  }

  const prevContactIsValid = () => {
    if (formValues.length === 0) {
      return true;
    }

    let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

    const someEmpty = formValues
      .filter((element) =>
        selectedLoad === "1" ? element.lotno !== "" : element.stockCode !== ""
      )
      .some((item) => {
        if (selectedLoad === "1") {//lot
          return (
            item.categoryName === "" ||
            item.grossWeight === "" ||
            item.grossWeight ==0 ||
            item.netWeight === "" ||
            item.netWeight == 0 ||
            item.rate === "" ||item.rate==0 ||
            percentRegex.test(item.rate) === false ||
            item.lotno === "" ||
            item.purity === "" ||
            percentRegex.test(item.purity) === false
            // ||
            // +parseFloat(item.availWeight).toFixed(3) < +parseFloat(item.grossWeight).toFixed(3)
          );
        } else {//0 means metal
          return (
            item.stockCode === "" ||
            item.categoryName === "" ||
            item.grossWeight === "" ||
            item.grossWeight ==0 ||
            item.netWeight === "" ||
            item.netWeight == 0 ||
            item.rate === "" || item.rate==0 ||
            percentRegex.test(item.rate) === false ||
            item.stock_group === 5 && item.pcs === "" ||
            item.stock_group === 5 && (+parseFloat(item.availPcs).toFixed(3) < +parseFloat(item.pcs).toFixed(3)) ||
            +parseFloat(item.availWeight).toFixed(3) < +parseFloat(item.grossWeight).toFixed(3) ||
            (item.stockCode.pcs_require === 1 && item.stock_group !== 5 && (item.pcs === "" || isNaN(item.pcs)))
          );
        }
      });

    console.log("someEmpty", someEmpty)

    if (someEmpty) {
      formValues
        .filter((element) =>
          selectedLoad === "1" ? element.lotno !== "" : element.stockCode !== ""
        )
        .map((item, index) => {
          const allPrev = [...formValues];
          // console.log(item);
          if (selectedLoad === "1") {
            let lotNo = formValues[index].lotno;
            if (lotNo === "") {
              allPrev[index].errors.lotno = "Please Enter Valid Lot No";
            } else {
              allPrev[index].errors.lotno = null;
            }

            let purity = formValues[index].purity;
            if (!purity || percentRegex.test(purity) === false) {
              allPrev[index].errors.purity = "Please Insert Valid Purity";
            } else {
              allPrev[index].errors.purity = null;
            }

          } else {

            let stockCode = formValues[index].stockCode;
            if (stockCode === "") {
              allPrev[index].errors.stockCode = "Please Select Stock Code";
            } else {
              allPrev[index].errors.stockCode = null;
            }
          }

          let categoryName = formValues[index].categoryName;
          if (categoryName === "") {
            allPrev[index].errors.categoryName = "Please Select Valid Category";
          } else {
            allPrev[index].errors.categoryName = null;
          }

          let weightRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
          let gWeight = formValues[index].grossWeight;
          if (!gWeight || weightRegex.test(gWeight) === false || gWeight==0) {
            allPrev[index].errors.grossWeight = "Enter Gross Weight!";
          } else {
            allPrev[index].errors.grossWeight = null;
          }

          // console.log(+parseFloat(formValues[index].availWeight).toFixed(3) < +parseFloat(formValues[index].grossWeight).toFixed(3))
          // console.log("availwt",parseFloat(formValues[index].availWeight).toFixed(3))
          // console.log("gWeight",parseFloat(formValues[index].grossWeight).toFixed(3))

          //parseFloat converts to string with toFixed, having issue with less than condition so added + to convert to number
          if (+parseFloat(formValues[index].availWeight).toFixed(3) < +parseFloat(formValues[index].grossWeight).toFixed(3)) {
            allPrev[index].errors.grossWeight = "Enter Less or Eqaul to Available Weight"
          } else {
            if (!gWeight || weightRegex.test(gWeight) === false || gWeight==0) {
              allPrev[index].errors.grossWeight = "Enter Gross Weight!";
            } else {
              allPrev[index].errors.grossWeight = null;
            }
          }

          let netWeight = formValues[index].netWeight;
          if (!netWeight || weightRegex.test(netWeight) === false ||netWeight==0) {
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

          let Rate = formValues[index].rate;
          if (!Rate || weightRegex.test(Rate) === false || Rate==0) {
            allPrev[index].errors.rate = "Enter Valid Rate!";
          } else {
            allPrev[index].errors.rate = null;
          }

          if (formValues[index].stock_group === 5 && formValues[index].pcs === "") {
            allPrev[index].errors.pcs = "Enter Valid Pieces"
          } else {
            allPrev[index].errors.pcs = null;
          }

          // console.log(parseFloat(formValues[index].availPcs).toFixed(3) < parseFloat(formValues[index].pcs).toFixed(3))
          // console.log("avial", parseFloat(formValues[index].availPcs).toFixed(3))
          // console.log("entered", parseFloat(formValues[index].pcs).toFixed(3))

          if (formValues[index].stock_group === 5 && !isNaN(formValues[index].pcs) && formValues[index].pcs !== "" && (+parseFloat(formValues[index].availPcs).toFixed(3) < +parseFloat(formValues[index].pcs).toFixed(3))) {
            allPrev[index].errors.pcs = "Enter Less or Eqaul to Available Pieces"
          } else {
            // allPrev[index].errors.pcs = null;
            if (formValues[index].stock_group === 5 && formValues[index].pcs === "") {
              allPrev[index].errors.pcs = "Enter Valid Pieces"

            } else if (formValues[index].stock_group !== 5) {
              let stockCode = formValues[index].stockCode;
              let pcsTotal = formValues[index].pcs;
              console.log("stock", stockCode)
              if (stockCode.pcs_require === 1) {
                if (pcsTotal === "" || pcsTotal === null || pcsTotal === undefined || isNaN(pcsTotal)) {
                  allPrev[index].errors.pcs = "Enter Pieces";
                } else {
                  allPrev[index].errors.pcs = null;
                }
              }
            } else {
              allPrev[index].errors.pcs = null;
            }
          }

          console.log(allPrev[index]);
          setFormValues(allPrev);
          return null;
        });
    }

    return !someEmpty;
  };

  let handlerBlur = (i, e) => {
    console.log("handlerBlur");
    let newFormValues = [...formValues];
    // newFormValues[i][e.target.name] = e.target.value;
    // newFormValues[i].errors[e.target.name] = null;

    let nm = e.target.name;
    let val = e.target.value;
    // console.log("val", val)
    if (isNaN(val) || val === "") {
      return;
    }
    if (nm === "grossWeight" && selectedLoad === "0") {
      newFormValues[i].grossWeight = parseFloat(val).toFixed(3)
      newFormValues[i].netWeight = parseFloat(val).toFixed(3)
    }

    if (nm === "rate") {
      newFormValues[i].rate = parseFloat(val).toFixed(3)
    }
    setFormValues(newFormValues);
  }

  let handleChange = (i, e) => {
    // console.log("handleChange");
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    newFormValues[i].errors[e.target.name] = null;

    let nm = e.target.name;
    let val = e.target.value;

    // console.log(nm, val);
    //if grossWeight or putity change
    if (nm === "grossWeight") {
      if (
        newFormValues[i].grossWeight !== "" &&
        newFormValues[i].purity !== ""
      ) {
        newFormValues[i].fineGold = parseFloat(
          (parseFloat(newFormValues[i].grossWeight) *
            parseFloat(newFormValues[i].purity)) /
          100
        ).toFixed(3);
        console.log(newFormValues[i].fineGold);
      }
      newFormValues[i].netWeight = val;
      newFormValues[i].errors.grossWeight = "";
      newFormValues[i].errors.netWeight = ""
      newFormValues[i].amount = "0";
      if(val==0){
        newFormValues[i].errors.grossWeight = "Enter valid Gross Weight";
        newFormValues[i].errors.netWeight = "Enter valid Net Weight"
      }

      if (val === "" || val == 0) {
        newFormValues[i].fineGold = "0";
        newFormValues[i].netWeight = "";
        setAmount("");
        setTotalGrossWeight("");
        setTotalNetWeight("")
        setFineGoldTotal("");
      }

      newFormValues[i].errors.netWeight = "";
      //   setAdjustedRate(false);
      newFormValues[i].rate = "";
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
        setTotalNetWeight("")
        setFineGoldTotal("");
      }
    }

    console.log("rate", newFormValues[i].rate);
    if (newFormValues[i].rate === "") {
      newFormValues[i].amount = ""
    }

    if (newFormValues[i].rate !== "" && newFormValues[i].fineGold !== "") {
      // newFormValues[i].amount = parseFloat(
      //   (parseFloat(newFormValues[i].rate) *
      //     parseFloat(newFormValues[i].fineGold)) /
      //     10
      // ).toFixed(3);
      if (newFormValues[i].stock_group === 1 || selectedLoad === "1") {
        newFormValues[i].amount = parseFloat(
          (parseFloat(newFormValues[i].rate) *
            parseFloat(newFormValues[i].fineGold)) /
          10
        ).toFixed(3);
      } else {
        newFormValues[i].amount = parseFloat(
          (parseFloat(newFormValues[i].rate) *
            parseFloat(newFormValues[i].netWeight))
        ).toFixed(3);
      }
    }

    if (stateId === 12) {
      if (newFormValues[i].amount !== "" && newFormValues[i].cgstPer !== "") {
        newFormValues[i].cgstVal = parseFloat(parseFloat(newFormValues[i].amount) * parseFloat(newFormValues[i].cgstPer) / 100).toFixed(3);

        newFormValues[i].sgstVal = parseFloat(parseFloat(newFormValues[i].amount) * parseFloat(newFormValues[i].sgstPer) / 100).toFixed(3);

        newFormValues[i].totalAmount = parseFloat(parseFloat(newFormValues[i].amount) + parseFloat(newFormValues[i].cgstVal) + parseFloat(newFormValues[i].sgstVal)).toFixed(3)
      } else {
        newFormValues[i].cgstVal = ""
        newFormValues[i].sgstVal = ""
        newFormValues[i].totalAmount = "";
      }

    } else {

      if (newFormValues[i].amount !== "" && newFormValues[i].igstPer !== "") {
        newFormValues[i].igstVal = parseFloat(parseFloat(newFormValues[i].amount) * parseFloat(newFormValues[i].igstPer) / 100).toFixed(3)
        newFormValues[i].totalAmount = parseFloat(parseFloat(newFormValues[i].amount) + parseFloat(newFormValues[i].igstVal)).toFixed(3)
      } else {
        newFormValues[i].igstVal = ""
        newFormValues[i].totalAmount = "";
      }

    }

    function amount(item) {
      // console.log(item.amount)
      return item.amount;
    }

    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.grossWeight);
    }
    // console.log(formValues.map(amount).reduce(sum))

    let tempAmount = newFormValues
      .filter((item) => item.amount !== "")
      .map(amount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    //.reduce(sum);
    // console.log("tempAmount",tempAmount)
    setAmount(parseFloat(tempAmount).toFixed(3));

    function netWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.netWeight);
    }

    let tempNetWtTot = parseFloat(newFormValues
      .filter((data) => data.netWeight !== "")
      .map(netWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3))

    let tempGrossWtTot = parseFloat(newFormValues
      .filter((data) => data.grossWeight !== "")
      .map(grossWeight)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0)).toFixed(3);

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
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      // console.log("tempCgstVal",parseFloat(tempCgstVal).toFixed(3))
      setCgstVal(parseFloat(tempCgstVal).toFixed(3));

      tempSgstVal = newFormValues
        .filter((item) => item.sgstVal !== "")
        .map(SGSTval)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setSgstVal(parseFloat(tempSgstVal).toFixed(3));

    } else {
      tempIgstVal = newFormValues
        .filter((item) => item.igstVal !== "")
        .map(IGSTVal)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0);
      setIgstVal(parseFloat(tempIgstVal).toFixed(3));
    }

    function totalAmount(item) {
      return parseFloat(item.totalAmount)
    }

    let tempTotal = newFormValues
      .filter((item) => item.totalAmount !== "")
      .map(totalAmount)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotalAmount(parseFloat(tempTotal).toFixed(3));

    setFormValues(newFormValues);

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
    })

  };

  function deleteHandler(index) {
    console.log(index)
    let newFormValues = [...formValues];

    newFormValues[index].lotno = ""
    newFormValues[index].stockCode = ""
    newFormValues[index].stock_group = "";
    newFormValues[index].categoryName = ""
    newFormValues[index].grossWeight = ""
    newFormValues[index].netWeight = ""
    newFormValues[index].pcs = ""
    newFormValues[index].availWeight = ""
    newFormValues[index].availPcs = ""
    newFormValues[index].availableStock = ""
    newFormValues[index].purity = ""
    newFormValues[index].fineGold = ""
    newFormValues[index].rate = ""
    newFormValues[index].amount = ""
    newFormValues[index].HSNnum = ""
    newFormValues[index].cgstPer = ""
    newFormValues[index].sgstPer = ""
    newFormValues[index].igstPer = ""
    newFormValues[index].cgstVal = ""
    newFormValues[index].sgstVal = ""
    newFormValues[index].igstVal = ""
    newFormValues[index].totalAmount = ""

    changeTotal(newFormValues, false)
  }

  function handleLoadChange(event) {
    setSelectedLoad(event.target.value);
    setSelectedLoadErr("");
    setPrintObj({
      ...printObj,
      loadType: event.target.value,
      stateId: "",
      supplierName: "",
      supAddress: "",
      supplierGstUinNum: "",
      supPanNum: "",
      supState: "",
      supCountry: "",
      supStateCode: "",
      // purcVoucherNum: "",
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
    })

    setSelectedJobWorker("");
    setPartyVoucherNum("");
    setFirmName("");
    setAccNarration("");
    setMetalNarration("");
    resetForm(false);
  }

  const handleNarrationClick = () => {
    console.log("handleNarr", narrationFlag);
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        flag: 27,
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
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0 }}
              >
                <Grid item xs={7} sm={7} md={7} key="1" style={{ padding: 0 }}>
                  <FuseAnimate delay={300}>
                    <Typography className="pl-28 pt-16 text-18 font-700">
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
                  style={{ textAlign: "right", paddingRight: "50px" }}
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
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p> Select load type*</p>
                        <select
                          className={clsx(classes.normalSelect, "focusClass")}
                          required
                          value={selectedLoad}
                          onChange={(e) => handleLoadChange(e)}
                          disabled={isView}
                          ref={loadTypeRef}
                        >
                          <option hidden value="">Select Load type</option>

                          <option value="0">Load Metal Varient </option>
                          {/* <option value="1">Load Finding Varient</option> */}
                          <option value="1">Load Lot directly</option>
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
                            onKeyDown={(e) => e.preventDefault()}
                            error={VoucherDtErr.length > 0 ? true : false}
                            helperText={VoucherDtErr}
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
                        <p>Voucher number</p>
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
                        <p>Party name*</p>
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
                          placeholder="Party name"
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

                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p>Firm name</p>
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
                          placeholder="Party Voucher Date"
                          type="date"
                          className="mb-16"
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

                      {!isView && 
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
                      }

                      <Grid
                      item
                      lg={2}
                      md={4}
                      sm={4}
                      xs={12}
                      style={{ padding: 6 }}
                    >
                          <p>Party Voucher Number</p>
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
                        disabled={isView}
                      />
                    </Grid>

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
                          {selectedLoad === "1" && (
                            <div className={classes.tableheader}>
                              Lot Number
                            </div>
                          )}
                          {selectedLoad === "0" && (
                            <div className={classes.tableheader}>
                              Category Variant
                            </div>
                          )}

                          <div className={clsx(classes.tableheader, "")}>
                            Category Name
                          </div>
                          {selectedLoad === "0" && (
                            <div className={clsx(classes.tableheader, "")}>
                              Available Stock
                            </div>
                          )}
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
                            Fine Gold
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Rate Of Fine Gold
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Amount
                          </div>
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
                            {selectedLoad === "1" && (
                              // <>
                              //   <Select
                              //     filterOption={createFilter({
                              //       ignoreAccents: false,
                              //     })}
                              //     className={classes.selectBox}
                              //     classes={classes}
                              //     styles={selectStyles}
                              //     options={lotdata
                              //        // .filter(array => formValues.every(item => (!(item.lotno?.value === array.id && item.lotno.label === array.number)) ))
                              //       .map((suggestion) => ({
                              //       value: suggestion.id,
                              //       label: suggestion.number,
                              //     }))}
                              //     // components={components}
                              //     value={
                              //       element.lotno !== ""
                              //         ? element.lotno.value === ""
                              //           ? ""
                              //           : element.lotno
                              //         : ""
                              //     }
                              //     onChange={(e) => {
                              //       handleLotNumChange(index, e);
                              //     }}
                              //     placeholder="Lot Number"
                              //     isDisabled={isView}
                              //   />
                              //   <span style={{ color: "red" }}>
                              //     {element.errors !== undefined
                              //       ? element.errors.lotno
                              //       : ""}
                              //   </span>
                              // </>

                              <Autocomplete
                                id="free-solo-demo"
                                freeSolo
                                className="all-purchase-tabs"
                                onChange={(event, newValue) => {
                                  // setValue(newValue);
                                  if (!isView) {
                                    handleLotNumChange(index, newValue);
                                  }
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
                                options={lotdata.map((option) => option.number)}
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

                            {selectedLoad === "0" && (
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
                                      pcs_require:
                                        suggestion.stock_name_code
                                          .stock_description.pcs_require,
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
                              </>
                            )}

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

                            {selectedLoad === "0" && (
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
                            )}

                            <TextField
                              name="pcs"
                              className={classes.inputBoxTEST}
                              value={element.pcs || ""}
                              type={isView ? "text" : "number"}
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
                              disabled={isView || selectedLoad === "1"} //|| element.stock_group !== 5
                              inputRef={(el) =>
                                (pcsInputRef.current[index] = el)
                              }
                              variant="outlined"
                              fullWidth
                            />

                            <TextField
                              name="grossWeight"
                              className={classes.inputBoxTEST}
                              type={isView ? "text" : "number"}
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
                              disabled={isView || selectedLoad == "1"}
                            />

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

                            <TextField
                              name="fineGold"
                              className=""
                              value={element.fineGold || ""}
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

                            <TextField
                              name="rate"
                              className={classes.inputBoxTEST}
                              type={isView ? "text" : "number"}
                              value={
                                isView
                                  ? Config.numWithComma(element.rate)
                                  : element.rate || ""
                              }
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
                            />

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
                                " delete_icons_dv"
                              )}
                            >
                              {/* action */}
                            </div>
                          )}
                          {selectedLoad === "1" && (
                            <div
                              id="castum-width-table"
                              className={classes.tableheader}
                            >
                              {/* Lot Number */}
                            </div>
                          )}
                          {selectedLoad === "0" && (
                            <div
                              id="castum-width-table"
                              className={classes.tableheader}
                            >
                              {/* Category Variant */}
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
                          {selectedLoad === "0" && (
                            <div
                              className={clsx(
                                classes.tableheader,
                                "castum-width-table"
                              )}
                            >
                              {/* Available Stock */}
                            </div>
                          )}
                          <div
                            className={clsx(
                              classes.tableheader,
                              "castum-width-table"
                            )}
                          >
                            {HelperFunc.getTotalOfFieldNoDecimal(
                              formValues,
                              "pcs"
                            )}
                            {/* pcs */}
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
                          >
                            {" "}
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
                          >
                            {isView ? Config.numWithComma(amount) : amount}
                          </div>

                        </div>
                      </div>
                    </div>
                  </form>

                  <div className="textarea-row mt-16">
                    <div style={{ width: " 100%", marginRight: "20px" }}>
                      <p>Metal narration*</p>
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
                        placeholder="Metal narration"
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
                        // disabled={isView}
                        disabled={narrationFlag}
                        placeholder="Account narration"
                      />
                    </div>
                  </div>
                  {!props.viewPopup && 
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
                     
                  {isView && 
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ float: "right" }}
                      className="w-224 mx-auto mt-16 mr-16 btn-print-save"
                      aria-label="Register"
                      onClick={() => handleNarrationClick()}
                    >
                      {!narrationFlag ? "Save Narration" : "Update Narration"}
                    </Button>
                  }
                  <div style={{ display: "none" }}>
                        <ArticianIssuePrintComp
                          ref={componentRef}
                          printObj={printObj}
                          isView={isView} 
                          getDateAndTime={getDateAndTime()}
                        />
                      </div>
                    </div>
                  }

                  {isView && (
                    <Button
                      variant="contained"
                      className={classes.button}
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

export default AddArticianIssueIR;

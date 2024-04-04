import React, { useState, useEffect, useRef } from "react";
import { DialogActions, Typography } from "@material-ui/core";
import { Button, TextField, Checkbox } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import History from "@history";
import Select, { createFilter } from "react-select";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Modal from "@material-ui/core/Modal";
import Loader from "app/main/Loader/Loader";
import moment from "moment";
import { Icon, IconButton } from "@material-ui/core";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import { ArticianReturnRetailerPrintComp } from "../PrintComponentRetailer/ArticianReturnRetailerPrintComp";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
import Icones from "assets/fornt-icons/Mainicons";
import ViewDocModelRetailer from "app/main/apps/SalesPurchase/Helper/ViewDocModelRetailer";
import { UpdateRetailerNarration } from "../../Helper/UpdateRetailerNarration";
import { DocumentUploadRetailer } from "app/main/apps/SalesPurchase/Helper/DocumentUploadRetailer";
import { TextFields } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    // minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
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
    borderRadius: 0,
    width: "100%",
    display: "inline-block",
    lineHeight: 2
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
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
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
  hoverClass: {
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#999",
      cursor: "pointer",
    },
  },
  button: {
    // margin: 5,
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
  },
  errorMessage: {
    color: "#f44336",
    bottom: "-3px",
    display: "block",
    position: "absolute",
    fontSize: "11px",
    marginTop: "3px",
    fontFamily: 'Muli,Roboto,"Helvetica",Arial,sans-serif',
    lineHeight: "11px",
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

const AddArticianReturnRetailer = (props) => {
  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);

  const [loading, setLoading] = useState(false);

  const [searchData, setSearchData] = useState("");
  const loadTypeRef = useRef(null);

  const pcsInputRef = useRef([]); //for pcs in table
  const pcsInputRefTwo = useRef([]); //for pcs in table

  const [voucherModalOpen, setvoucherModalOpen] = useState(false);
  const [isVoucherSelected, setIsVoucherSelected] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [selectVoucherErr, setSelectVoucherErr] = useState("");
  const [voucherApiData, setVoucherApiData] = useState([]);
  const [partyVoucherDate, setPartyVoucherDate] = useState("");

  const [jobworkerData, setJobworkerData] = useState([]);
  const [selectedJobWorker, setSelectedJobWorker] = useState("");
  const [selectedJobWorkerErr, setSelectedJobWorkerErr] = useState("");

  const [productCategory, setProductCategory] = useState([]);

  const [lotdata, setLotData] = useState([]);

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");

  //   const [departmentData, setDepartmentData] = useState([]);
  //   const [selectedDepartment, setSelectedDepartment] = useState("");
  //   const [selectedDeptErr, setSelectedDeptErr] = useState("");

  const [stockCodeData, setStockCodeData] = useState([]);
  const [cateGoryCodeData, setCateGoryCodeData] = useState([]);

  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");

  const [goldrateValue, setGoldRateValue] = useState("");
  const [goldratPercentage, setGoldratPercentage] = useState("");
  const [oldGoldRate, setoldGoldRate] = useState("");
  const [goldrateValueErr, setGoldRateValueErr] = useState("");

  const [silverRate, setSilverRate] = useState("");
  const [silverRateErr, setSilverRateErr] = useState("");
  const [actualSilverrate, setActualSilverrate] = useState(false);
  const [silverMaxValue, setSilverMaxValue] = useState(0);
  const [silverMinValue, setSilverMinValue] = useState(0);

  //below table total val field
  const [amount, setAmount] = useState("");
  const [fineGoldTotal, setFineGoldTotal] = useState("");
  const [totalGrossWeight, setTotalGrossWeight] = useState("");

  const [cataamount, setCataAmount] = useState("");
  const [catafineGoldTotal, setCataFineGoldTotal] = useState("");
  const [catatotalGrossWeight, setCataTotalGrossWeight] = useState("");

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [metalNarration, setMetalNarration] = useState("");
  const [metalNarrationErr, setMetalNarrationErr] = useState("");
  const [narrationFlag, setNarrationFlag] = useState(false);
  const [totalamt, settotalamt] = useState("");
  const [totalgwt, settotalgwt] = useState("");
  const [totalfinew, settotalfinew] = useState("");

  const [totalpcs, settotalpcs] = useState("");

  // const [selectedIndex, setSelectedIndex] = useState(0);

  const theme = useTheme();

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000); // 10초 뒤에
    }
  }, [loading]);

  useEffect(() => {
    if (props.reportView) {
      NavbarSetting(props.reportView, dispatch);
    } else {
      NavbarSetting("Sales-Retailer", dispatch);
    }
  }, []);

  const [documentList, setDocumentList] = useState([]);
  const [docModal, setDocModal] = useState(false);
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);

  useEffect(() => {
    if (docFile) {
      DocumentUploadRetailer(docFile, 12)
        .then((response) => {
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

  var idToBeView;
  if (props.location) {
    idToBeView = props.location.state;
  } else if (props.voucherId) {
    idToBeView = { id: props.voucherId };
  }
  const [isView, setIsView] = useState(false); //for view Only

  const [formValues, setFormValues] = useState([
    {
      lotno: "",
      manuallLot: "0",
      stockCode: "",
      stock_group: "",
      categoryName: "",
      grossWeight: "",
      netWeight: "",
      pcs: "",
      setWeight: "",
      purity: "",
      fineGold: "",
      rate: "",
      amount: "",
      isGoldSilver: "",
      errors: {
        lotno: null,
        stockCode: null,
        categoryName: null,
        pcs: null,
        grossWeight: null,
        netWeight: null,
        purity: null,
        fineGold: null,
        rate: null,
        amount: null,
      },
    },
  ]);
  const [CategoryformValues, setCategoryformValues] = useState([
    {
      lotno: "",
      manuallLot: "0",
      stockCode: "",
      stock_group: "",
      categoryName: "",
      grossWeight: "",
      netWeight: "",
      pcs: "",
      setWeight: "",
      purity: "",
      fineGold: "",
      rate: "",
      amount: "",
      isGoldSilver: "",
      errors: {
        lotno: null,
        stockCode: null,
        categoryName: null,
        grossWeight: null,
        pcs: null,
        netWeight: null,
        purity: null,
        fineGold: null,
        rate: null,
        amount: null,
      },
    },
  ]);

  const componentRef = React.useRef(null);

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
  const handleBeforePrint = React.useCallback(() => {}, []);

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
    documentTitle: "Artician_Return_Cum_Delivery_Voucher_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  React.useEffect(() => {
    if (
      // text === "New, Updated Text!" &&
      typeof onBeforeGetContentResolve.current === "function"
    ) {
      onBeforeGetContentResolve.current();
    }
    //eslint-disable-next-line
  }, [onBeforeGetContentResolve.current]); //, text

  function checkforPrint() {
    setPrintObj({
      supplierName: selectedJobWorker.label,
      purcVoucherNum: voucherNumber,
      orderDetails: formValues,
      orderDetailsjewelry: CategoryformValues,
      // taxableAmount: totalGST,
      voucherDate: moment(voucherDate).format("DD-MM-YYYY"),

      finegoldTot: HelperFunc.getTotalOfField(formValues, "fineGold"),
      finegoldTots: HelperFunc.getTotalOfField(CategoryformValues, "fineGold"),
      pcsTot: HelperFunc.getTotalOfField(formValues, "pcs"),
      pcsTots: HelperFunc.getTotalOfField(CategoryformValues, "pcs"),
      // iGstTot: HelperFunc.getTotalOfField(packingSlipData, "igstV"),
      // roundOff: roundOff,
      amountTot: HelperFunc.getTotalOfField(formValues, "amount"),
      amountTots: HelperFunc.getTotalOfField(CategoryformValues, "amount"),
      grossWtTOt: HelperFunc.getTotalOfField(formValues, "grossWeight"),
      grossWtTOts: HelperFunc.getTotalOfField(
        CategoryformValues,
        "grossWeight"
      ),
      netWtTOt: HelperFunc.getTotalOfField(formValues, "netWeight"),
      netWtTOts: HelperFunc.getTotalOfField(CategoryformValues, "netWeight"),
    });
    if (
      goldRateValueValidation() &&
      silverRateValidation() &&
      partyNameValidation()
      // partyVoucherNumValidation()
    ) {
      if (isView) {
        handlePrint();
      } else {
        if (prevContactIsValid() && CataprevContactIsValid()) {
          addMetalPurchase(false, true);
        }
      }
    }
  }

  const [printObj, setPrintObj] = useState({
    loadType: "",
    stateId: "",
    supplierName: "",
    supAddress: "",
    supplierGstUinNum: "",
    allTotalfine: "",
    allTotalGrossw: "",
    allTotalPieces: "",
    supPanNum: "",
    supState: "",
    supCountry: "",
    supStateCode: "",
    purcVoucherNum: "",
    voucherDate: moment().format("DD-MM-YYYY"),
    placeOfSupply: "",
    orderDetails: [],
    orderDetailsjewelry: [],
    grossWtTOt: "",
    netWtTOt: "",
    finegoldTot: "",
    amount: "",
    sGstTot: "",
    cGstTot: "",
    iGstTot: "",
    totalAmount: "",
    metalNarration: "",
    accNarration: "",
    finegoldcataTot: "",
    grossWtcataTOt: "",
    cataAmount: "",
    pcs: "",
    cataPcs: "",
  });

  let  handleStockGroupChange = (i, e) => {
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
      newFormValues[i].rate = "";
      newFormValues[i].pcs = "";
      newFormValues[i].amount = "";
      newFormValues[i].Total = "";
      newFormValues[i].lotno = "";

      // 1- gold 2- silver 3 -bronze
      if (stockCodeData[findIndex].stock_group.item_id === 1 || stockCodeData[findIndex].stock_group.item_id === 2) {
        newFormValues[i].purity =
          stockCodeData[findIndex].stock_name_code.purity;
      } else {
        newFormValues[i].purity = "0";
      }

      newFormValues[i].categoryName = stockCodeData[findIndex].stock_name;
      newFormValues[i].errors.categoryName = null;
      newFormValues[i].isGoldSilver = stockCodeData[findIndex].stock_group.id;
    }

    if (i === formValues.length - 1) {
      changeTotal(newFormValues, true);
    } else {
      changeTotal(newFormValues, false);
    }
    pcsInputRef.current[i].focus();
  };

  let handleStockCategoryChange = (i, e) => {
    console.log(e);
    let newFormValues = [...CategoryformValues];
    newFormValues[i].stockCode = {
      value: e.value,
      label: e.label,
    };
    newFormValues[i].errors.stockCode = null;

    let findIndex = cateGoryCodeData.findIndex((item) => item.id === e.value);
    if (findIndex > -1) {
      newFormValues[i].stock_group = cateGoryCodeData[findIndex].id;
      newFormValues[i].grossWeight = "";
      newFormValues[i].netWeight = "";
      newFormValues[i].rate = "";
      newFormValues[i].pcs = "";
      newFormValues[i].amount = "";
      newFormValues[i].Total = "";
      newFormValues[i].lotno = "";
      newFormValues[i].purity = "";
      newFormValues[i].categoryName = cateGoryCodeData[findIndex].billing_category_name;
      newFormValues[i].isGoldSilver = cateGoryCodeData[findIndex].is_gold_silver;
      newFormValues[i].errors.categoryName = null;
    }

    if (i === CategoryformValues.length - 1) {
      changeTotalCata(newFormValues, true);
    } else {
      changeTotalCata(newFormValues, false);
    }
    pcsInputRefTwo.current[i].focus();
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
        return parseFloat(a) + parseFloat(b);
      }, 0);
    //.reduce(sum);

    setAmount(parseFloat(tempAmount).toFixed(3));

    setTotalGrossWeight(
      parseFloat(
        newFormValues
          .filter((data) => data.grossWeight !== "")
          .map(grossWeight)
          .reduce(function (a, b) {
            // sum all resulting numbers
            return parseFloat(a) + parseFloat(b);
          }, 0)
      ).toFixed(3)
    );
    if (addFlag === true) {
      setFormValues([
        ...newFormValues,
        {
          lotno: "",
          manuallLot: "0",
          stockCode: "",
          stock_group: "",
          categoryName: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          setWeight: "",
          purity: "",
          fineGold: "",
          rate: "",
          amount: "",
          errors: {
            lotno: null,
            stockCode: null,
            categoryName: null,
            grossWeight: null,
            pcs: null,
            netWeight: null,
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

  function changeTotalCata(newFormValues, addFlag) {
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
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
    let tempAmount = newFormValues
      .filter((item) => item.amount !== "")
      .map(amount)
      .reduce(function (a, b) {
        return parseFloat(a) + parseFloat(b);
      }, 0);
    //.reduce(sum);

    setCataAmount(parseFloat(tempAmount).toFixed(3));

    setTotalGrossWeight(
      parseFloat(
        newFormValues
          .filter((data) => data.grossWeight !== "")
          .map(grossWeight)
          .reduce(function (a, b) {
            // sum all resulting numbers
            return parseFloat(a) + parseFloat(b);
          }, 0)
      ).toFixed(3)
    );
    if (addFlag === true) {
      setCategoryformValues([
        ...newFormValues,
        {
          lotno: "",
          manuallLot: "0",
          stockCode: "",
          stock_group: "",
          categoryName: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          setWeight: "",
          purity: "",
          fineGold: "",
          rate: "",
          amount: "",
          errors: {
            lotno: null,
            stockCode: null,
            categoryName: null,
            grossWeight: null,
            pcs: null,
            netWeight: null,
            purity: null,
            fineGold: null,
            rate: null,
            amount: null,
          },
        },
      ]);
    } else {
      setCategoryformValues(newFormValues);
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
  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "#d1d8f5",
      borderWidth: 1,
      width: "100%",
      display: "inline-block",
      height: 36,
      lineHeight: '2',
      vertical: "middle" 
    }),
    singleValue: (provided) => ({
      ...provided,
      marginTop: 5,
    }),
    placeholder: (provided) => ({
      ...provided,
      top: '50%', 
      transform: 'translateY(-50%)',
      vertical: "middle"
    }),
  };
  

  const classes = useStyles();

  useEffect(() => {
    getJobworkerdata();
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true);
      getArticianReturnRecord(idToBeView.id);
    } else {
      setNarrationFlag(false);
      getStockCodeMetal();
      getCateGoryCodeMetal();
      getTodaysGoldRate();
      getTodaysSilverRate();
      getVoucherNumber(); //if view only then no need to get new voucher number, we will set data coming from api
    }

    setTimeout(() => {
      if (loadTypeRef.current) {
        loadTypeRef.current.focus();
      }
    }, 800);
  }, []);

  function getArticianReturnRecord(id) {
    setLoading(true);
    let api = "";
    if (props.forDeletedVoucher) {
      api = `retailerProduct/api/jobworkarticianreturn/${id}?deleted_at=1`;
    } else {
      api = `retailerProduct/api/jobworkarticianreturn/${id}`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              console.log(response.data.data);
              // setApiData(response.data.data[0]);

              let finalData = response.data.data.data;
              let loadType = response.data.data.otherDetails.loadType;
              setDocumentList(finalData?.salesPurchaseDocs);
              setPartyVoucherDate(finalData.party_voucher_date);

              setVoucherNumber(finalData.voucher_no);
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
              const rets =
                finalData.JobWorkArticianReturnOrder[0].rate_of_fine_gold;
              setGoldRateValue(rets);
              const retsSilvere =
                finalData.JobWorkArticianReturnOrder[0].rate_of_fine_silver;
                setSilverRate(retsSilvere);
              let tempArray = [];
              const filteredData = finalData.JobWorkArticianReturnOrder.filter(
                (item) => item.category_id === null
              );
              for (let item of filteredData) {
                tempArray.push({
                  stockCode: {
                    value: item.StockNameCode.id,
                    label: item.StockNameCode.stock_code,
                  },
                  categoryName: item.stock_name,
                  // selectedHsn: item.StockNameCode.stock_name_code.hsn_master.hsn_number,
                  grossWeight: parseFloat(item.gross_weight).toFixed(3),
                  pcs: item.pcs === null ? 0 : item.pcs,
                  netWeight: parseFloat(item.net_weight).toFixed(3),
                  purity: item.purity,
                  fineGold: parseFloat(item.finegold).toFixed(3),
                  rate: parseFloat(goldrateValue),
                  amount: parseFloat(item.amount).toFixed(3),
                });
              }
              setFormValues(tempArray);

              function amount(item) {
                return item.amount;
              }
              function pcs(item) {
                return item.pcs;
              }
              function grossWeight(item) {
                return parseFloat(item.grossWeight);
              }
              function netWeight(item) {
                return parseFloat(item.netWeight);
              }
              let temppcs = tempArray
                .filter((item) => item.pcs !== "")
                .map(pcs)
                .reduce(function (a, b) {
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              // setAmount(parseFloat(temppcs).toFixed(3));
              let tempAmount = tempArray
                .filter((item) => item.amount !== "")
                .map(amount)
                .reduce(function (a, b) {
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setAmount(parseFloat(tempAmount).toFixed(3));
              // setCataAmount
              setTotalGrossWeight(
                parseFloat(
                  tempArray
                    .filter((data) => data.grossWeight !== "")
                    .map(grossWeight)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0)
                ).toFixed(3)
              );

              function fineGold(item) {
                return parseFloat(item.fineGold);
              }

              let tempGrossWtTot = tempArray
                .filter((item) => item.grossWeight !== "")
                .map(grossWeight)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);

              let tempNetWtTot = tempArray
                .filter((item) => item.netWeight !== "")
                .map(netWeight)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);

              let tempFineGold = tempArray
                .filter((item) => item.fineGold !== "")
                .map(fineGold)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
              setIsVoucherSelected(true);

              let CatatempArray = [];
              const CatafilteredData =
                finalData.JobWorkArticianReturnOrder.filter(
                  (item) => item.category_id !== null
                );

              for (let item of CatafilteredData) {
                CatatempArray.push({
                  stockCode: {
                    value: item.Category.id,
                    label: item.Category.category_name,
                  },
                  categoryName: item.Category.billing_category_name,
                  // selectedHsn: item.StockNameCode.stock_name_code.hsn_master.hsn_number,
                  grossWeight: parseFloat(item.gross_weight).toFixed(3),
                  pcs: item.pcs === null ? 0 : item.pcs,
                  netWeight: parseFloat(item.net_weight).toFixed(3),
                  purity: item.purity,
                  fineGold: parseFloat(item.finegold).toFixed(3),
                  rate: parseFloat(goldrateValue),
                  amount: parseFloat(item.amount).toFixed(3),
                });
              }
              setCategoryformValues(CatatempArray);

              function cataamount(item) {
                return item.amount;
              }
              function catapcs(item) {
                return item.pcs;
              }
              function CatagrossWeight(item) {
                return parseFloat(item.grossWeight);
              }
              function CatanetWeight(item) {
                return parseFloat(item.netWeight);
              }
              let Catapcs = CatatempArray.filter((item) => item.pcs !== "")
                .map(catapcs)
                .reduce(function (a, b) {
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              let CatatempAmount = CatatempArray.filter(
                (item) => item.amount !== ""
              )
                .map(amount)
                .reduce(function (a, b) {
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setCataAmount(CatatempAmount);
              setCataTotalGrossWeight(
                parseFloat(
                  CatatempArray.filter((data) => data.grossWeight !== "")
                    .map(grossWeight)
                    .reduce(function (a, b) {
                      // sum all resulting numbers
                      return parseFloat(a) + parseFloat(b);
                    }, 0)
                ).toFixed(3)
              );
              function catafineGold(item) {
                return parseFloat(item.fineGold);
              }
              let catatempGrossWtTot = CatatempArray.filter(
                (item) => item.grossWeight !== ""
              )
                .map(grossWeight)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setCataFineGoldTotal(parseFloat(catatempGrossWtTot).toFixed(3));

              let catatempNetWtTot = CatatempArray.filter(
                (item) => item.netWeight !== ""
              )
                .map(netWeight)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);

              let catatempFineGold = CatatempArray.filter(
                (item) => item.fineGold !== ""
              )
                .map(fineGold)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setCataFineGoldTotal(parseFloat(catatempFineGold).toFixed(3));
              var Totalamount = parseFloat(tempAmount + CatatempAmount).toFixed(
                3
              );
              var TotalFineGold = parseFloat(
                tempFineGold + catatempFineGold
              ).toFixed(3);
              var TotalGroew = parseFloat(
                tempGrossWtTot + catatempGrossWtTot
              ).toFixed(3);
              var Totalpcs = parseFloat(temppcs + Catapcs).toFixed(3);

              // setPrintObj({
              //   ...printObj,
              //   orderDetailsjewelry: CatatempArray,
              //   supplierName: finalData.JobWorker.name,
              //   purcVoucherNum: finalData.voucher_no,
              //   pcs: temppcs,
              //   cataPcs: Catapcs,
              //   voucherDate: moment(
              //     finalData.purchase_voucher_create_date
              //   ).format("DD-MM-YYYY"),
              //   orderDetails: tempArray,
              //   grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
              //   grossWtcataTOt: parseFloat(catatempGrossWtTot).toFixed(3),
              //   amount: parseFloat(tempAmount).toFixed(3),
              //   cataAmount: parseFloat(CatatempAmount).toFixed(3),
              //   finegoldTot: parseFloat(tempFineGold).toFixed(3),
              //   finegoldcataTot: parseFloat(catatempFineGold).toFixed(3),
              //   allTotal: parseFloat(Totalamount).toFixed(3),
              //   allTotalfine: parseFloat(TotalFineGold).toFixed(3),
              //   allTotalGrossw: parseFloat(TotalGroew).toFixed(3),
              //   allTotalPieces: parseFloat(Totalpcs).toFixed(3),

              // });
            }
          } else {
          }
        } else {
          setLoading(false);
        }
      })
      .catch(function (error) {
        setLoading(false);

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchData) {
        // if (isVoucherSelected) {
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

  function getLotData(sData) {
    let data = {
      search: sData,
      voucher_id: selectedVoucher,
    };
    axios
      .post(
        Config.getCommonUrl() +
          "retailerProduct/api/jobWorkArticianIssue/lot/list",
        data
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
                variant: "error",
              })
            );
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
      .catch((error) => {
        handleError(error, dispatch, {
          api: "retailerProduct/api/jobWorkArticianIssue/lot/list",
          body: data,
        });
      });
  }

  function getVoucherNumber() {
    axios
      .get(
        Config.getCommonUrl() +
          "retailerProduct/api/jobworkarticianreturn/get/voucher"
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
          api: "retailerProduct/api/jobworkarticianreturn/get/voucher",
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

  function getCateGoryCodeMetal() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/productcategory")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setCateGoryCodeData(response.data.data);
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
          api: "retailerProduct/api/productcategory",
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
          setJobworkerData(response?.data?.data);
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

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "goldrateValue" && !isNaN(value)) {
      const goldrateValuee = parseFloat(oldGoldRate);
      // setGoldRateValue(value);
      var targetValue = parseFloat(value);
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
    }else if (name === "silverRate" && !isNaN(value)) {
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
    } else if (name === "voucherNumber") {
      setVoucherNumber(value);
      setVoucherNumErr("");
    } else if (name === "partyVoucherNum") {
      setPartyVoucherNum(value);
      setPartyVoucherNumErr("");
      // setPrintObj({
      //   ...printObj,
      //   partyInvNum: value,
      // });
    } else if (name === "voucherDate") {
      setVoucherDate(value);
      setVoucherDtErr("");
      // setPrintObj({
      //   ...printObj,
      //   voucherDate: moment(value).format("DD-MM-YYYY"),
      // });
    } else if (name === "metalNarration") {
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

  function partyNameValidation() {
    if (selectedJobWorker.value == undefined) {
      setSelectedJobWorkerErr("Please Select Job Worker");
      return false;
    }
    return true;
  }

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
      } else if (oldGoldRate === "") {
        setGoldRateValueErr("Please enter today's rate on master");
        return false;
      } else {
        setGoldRateValueErr(
          `Please, Enter today's rate between ${minValue} to ${maxValue}`
        );
        return false;
      }
    } else {
      return true;
    }
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
  // function partyVoucherNumValidation() {
  //   // const Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
  //   if (partyVoucherNum === "") {
  //     setPartyVoucherNumErr("Enter Valid Voucher Number");
  //     return false;
  //   }
  //   return true;
  // }
  function voucherSelectedValidation() {
    if (selectedVoucher === "") {
      setSelectVoucherErr("Please Select Voucher");
      return false;
    }
    return true;
  }

  function handleFormSubmit(ev) {
    if (
      goldRateValueValidation() &&
      silverRateValidation() &&
      partyNameValidation() &&
      // partyVoucherNumValidation() &&
      voucherSelectedValidation()
    ) {
      if (prevContactIsValid() && CataprevContactIsValid) {
        addMetalPurchase(true, false);
      }
    }
  }
  function addMetalPurchase(resetFlag, toBePrint) {
    let Orders = formValues
      .filter((element) => element.grossWeight !== "")
      .map((x) => {
        return {
          lot_no: x.lotno.label,
          category_id: x.categoryName.value,
          purity: x.purity,
          gross_weight: x.grossWeight,
          pcs: x.pcs,
          net_weight: x.netWeight,
          stock_name_code_id: x.stockCode.value,
          rate_of_fine_gold: goldrateValue,
          rate_of_fine_silver: silverRate,
          finegold: x.fineGold,
          is_silver_gold: x.isGoldSilver,
          amount: x.amount
        };
      });
    if (Orders.length === 0) {
      dispatch(
        Actions.showMessage({ message: "Please Add Entry", variant: "error" })
      );
      return;
    }

    let CataOrders = CategoryformValues.filter(
      (element) => element.grossWeight !== ""
    ).map((x) => {
      return {
        lot_no: x.lotno.label,
        category_id: x.categoryName.value,
        purity: x.purity,
        gross_weight: x.grossWeight,
        pcs: x.pcs,
        net_weight: x.netWeight,
        stock_name_code_id: x.stockCode.value,
        rate_of_fine_gold: goldrateValue,
        rate_of_fine_silver: silverRate,
        finegold: x.fineGold,
        amount: x.amount,
      };
    });
    // if (CataOrders.length === 0) {
    //   dispatch(
    //     Actions.showMessage({ message: "Please Add Entry", variant: "error" })
    //   );
    //   return;
    // }

    setLoading(true);
    const body = {
      voucher_no: voucherNumber,
      party_voucher_no: partyVoucherNum,
      opposite_account_id: 1, //oppositeAccSelected
      department_id: parseFloat(
        window.localStorage.getItem("SelectedDepartment")
      ),
      jobworker_id: selectedJobWorker.value,

      purchaseCreateDate: voucherDate,

      is_lot: 0,
      voucherId: selectedVoucher,
      metal_narration: metalNarration,
      account_narration: accNarration,
      Orders: Orders,
      CataOrder: CataOrders,
      uploadDocIds: docIds,
      party_voucher_date: partyVoucherDate,
    };
    axios
      .post(
        Config.getCommonUrl() + "retailerProduct/api/jobworkarticianreturn",
        body
      )
      .then(function (response) {
        console.log(response);

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
          // setSelectedJobWorker("");
          // // setOppositeAccSelected("");
          // setPartyVoucherNum("");
          // //   setSelectedDepartment("");
          // setFirmName("");
          // setFirmNameErr("");
          // setAccNarration("");
          // setMetalNarration("");
          // // setSelectedIndex(0);
          // setSelectedLoad("");
          // setVoucherDate(moment().format("YYYY-MM-DD"));
          // resetForm();
          // getVoucherNumber();
          // setLoading(false);
          if (resetFlag === true) {
            checkAndReset();
          }
          if (toBePrint === true) {
            handlePrint();
          }
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
          api: "retailerProduct/api/jobworkarticianreturn",
          body: body,
        });
      });
  }

  function resetForm(flag) {
    setCataAmount("");
    setAmount("");
    setTotalGrossWeight("");
    setFineGoldTotal("");
    setIsVoucherSelected(false);
    setVoucherApiData([]);
    setSelectedVoucher("");
    // setCataTotalGrossWeight("0.000")
    // setCataFineGoldTotal("0.000")
    if (flag === false) {
      setFormValues([
        {
          lotno: "",
          manuallLot: "0",
          stockCode: "",
          stock_group: "",
          categoryName: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          setWeight: "",
          purity: "",
          fineGold: "",
          rate: "",
          amount: "",
          errors: {
            lotno: null,
            stockCode: null,
            categoryName: null,
            grossWeight: null,
            pcs: null,
            netWeight: null,
            purity: null,
            fineGold: null,
            rate: null,
            amount: null,
          },
        },
        {
          lotno: "",
          manuallLot: "0",
          stockCode: "",
          stock_group: "",
          categoryName: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          setWeight: "",
          purity: "",
          fineGold: "",
          rate: "",
          amount: "",
          errors: {
            lotno: null,
            stockCode: null,
            categoryName: null,
            grossWeight: null,
            pcs: null,
            netWeight: null,
            purity: null,
            fineGold: null,
            rate: null,
            amount: null,
          },
        },
        {
          lotno: "",
          manuallLot: "0",
          stockCode: "",
          stock_group: "",
          categoryName: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          setWeight: "",
          purity: "",
          fineGold: "",
          rate: "",
          amount: "",
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
          manuallLot: "0",
          stockCode: "",
          stock_group: "",
          categoryName: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          setWeight: "",
          purity: "",
          fineGold: "",
          rate: "",
          amount: "",
          errors: {
            lotno: null,
            stockCode: null,
            pcs: null,
            categoryName: null,
            grossWeight: null,
            netWeight: null,
            purity: null,
            fineGold: null,
            rate: null,
            amount: null,
          },
        },
      ]);
      setCategoryformValues([
        {
          lotno: "",
          manuallLot: "0",
          stockCode: "",
          stock_group: "",
          categoryName: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          setWeight: "",
          purity: "",
          fineGold: "",
          rate: "",
          amount: "",
          errors: {
            lotno: null,
            stockCode: null,
            categoryName: null,
            grossWeight: null,
            pcs: null,
            netWeight: null,
            purity: null,
            fineGold: null,
            rate: null,
            amount: null,
          },
        },
        {
          lotno: "",
          manuallLot: "0",
          stockCode: "",
          stock_group: "",
          categoryName: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          setWeight: "",
          purity: "",
          fineGold: "",
          rate: "",
          amount: "",
          errors: {
            lotno: null,
            stockCode: null,
            categoryName: null,
            grossWeight: null,
            pcs: null,
            netWeight: null,
            purity: null,
            fineGold: null,
            rate: null,
            amount: null,
          },
        },
        {
          lotno: "",
          manuallLot: "0",
          stockCode: "",
          stock_group: "",
          categoryName: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          setWeight: "",
          purity: "",
          fineGold: "",
          rate: "",
          amount: "",
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
          manuallLot: "0",
          stockCode: "",
          stock_group: "",
          categoryName: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          setWeight: "",
          purity: "",
          fineGold: "",
          rate: "",
          amount: "",
          errors: {
            lotno: null,
            stockCode: null,
            pcs: null,
            categoryName: null,
            grossWeight: null,
            netWeight: null,
            purity: null,
            fineGold: null,
            rate: null,
            amount: null,
          },
        },
      ]);
    } else {
      let newFormValues = formValues.map((x) => {
        return {
          ...x,
          lotno: "",
          manuallLot: "0",
          stockCode: "",
          stock_group: "",
          categoryName: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          setWeight: "",
          purity: "",
          fineGold: "",
          rate: "",
          amount: "",
        };
      });

      changeTotal(newFormValues, false);
      let newFormValuess = CategoryformValues.map((x) => {
        return {
          ...x,
          lotno: "",
          manuallLot: "0",
          stockCode: "",
          stock_group: "",
          categoryName: "",
          grossWeight: "",
          netWeight: "",
          pcs: "",
          setWeight: "",
          purity: "",
          fineGold: "",
          rate: "",
          amount: "",
        };
      });
      changeTotalCata(newFormValuess, false);
    }
  }

  function handlePartyChange(value) {
    setSelectedJobWorker(value);
    setSelectedJobWorkerErr("");
    // setPrintObj({ ...printObj, supplierName: value.label });
    console.log(value.label, "////");
    setIsVoucherSelected(false);
    setVoucherApiData([]);
    setSelectedVoucher("");

    // setOppositeAccSelected("");
    setPartyVoucherNum("");
    // setSelectedDepartment("");
    setFirmName("");

    resetForm(false);

    const index = jobworkerData.findIndex(
      (element) => element.id === value.value
    );
    console.log(index, "/./././");
    if (index > -1) {
      setFirmName(jobworkerData[index].firm_name);
      // setAddress(jobworkerData[index].address);
      // setSupplierGstUinNum(jobworkerData[index].gst_number);
      // setSupPanNum(jobworkerData[index].pan_number);
      // setSupState(jobworkerData[index].state_name.name);
      // setSupCountry(jobworkerData[index].country_name.name)
      // setFirmNameErr("")
      // setVendorStateId(jobworkerData[index].state_name.id);
      // setIs_tds_tcs(jobworkerData[index].is_tds_tcs);

      //   setPrintObj({
      //     ...printObj,
      //     // supplierName: jobworkerData[index].firm_name,
      //     // loadType: selectedLoad,
      //     // supplierName: jobworkerData[index].firm_name,
      //     // supAddress: jobworkerData[index].address,
      //     // supplierGstUinNum:
      //     //   jobworkerData[index].gst_number === null
      //     //     ? jobworkerData[index].gst_type
      //     //     : jobworkerData[index].gst_number,
      //     // supPanNum: jobworkerData[index].pan_number,
      //     // supState: jobworkerData[index].state_name.name,
      //     // supCountry: jobworkerData[index].country_name.name,
      //     // supStateCode:
      //     //   jobworkerData[index].gst_number === null
      //     //     ? "-"
      //     //     : jobworkerData[index].gst_number.substring(0, 2),
      //     // // purcVoucherNum: "",
      //     // // voucherDate: moment().format("YYYY-MM-DD"),
      //     // placeOfSupply: jobworkerData[index].state_name.name,
      // orderDetailsjewelry: [],
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
    }

    getVouchers(value.value);
  }

  //url change
  function getVouchers(jobworkerId) {
    setVoucherApiData([]);

    let data = {
      jobworker_id: jobworkerId,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      flag: 0,
    };
    axios
      .post(
        Config.getCommonUrl() +
          "retailerProduct/api/jobWorkArticianIssue/jobworker/jobworker",
        data
      )
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          let Data = response.data.data;
          let tempArray = [];
          for (let item of Data) {
            tempArray.push({
              id: item.id,
              voucher_no: item.voucher_no,
              party_voucher_no: item.party_voucher_no,
              utilize: (
                parseFloat(item.finegold).toFixed(3) -
                parseFloat(item.balance).toFixed(3)
              ).toFixed(3),
              balance: parseFloat(item.balance).toFixed(3),
              rate: goldrateValue,
              finegold: parseFloat(item.finegold).toFixed(3),
              amount: (
                parseFloat(goldrateValue) *
                (parseFloat(item.finegold).toFixed(3) -
                  parseFloat(item.balance).toFixed(3))
              ).toFixed(3),
            });
          }

          setVoucherApiData(tempArray);
        } else {
          setVoucherApiData([]);
          dispatch(
            Actions.showMessage({ message: response.data.error.message })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "retailerProduct/api/jobWorkArticianIssue/jobworker/jobworker",
          body: data,
        });
      });
  }

  const prevContactIsValid = () => {
    if (formValues.length === 0) {
      return true;
    }

    const someEmpty = formValues
      .filter((element) => element.stockCode !== "")
      .some((item) => {
        return (
          item.stockCode === "" ||
          item.categoryName === "" ||
          item.grossWeight === "" ||
          item.grossWeight == 0 ||
          item.netWeight === "" ||
          item.netWeight == 0 ||
          (item.stockCode.pcs_require === 1 &&
            (item.pcs === "" || isNaN(item.pcs)))
          // (item.stock_group !== 1 && item.pcs === "")
        );
      });

    if (someEmpty) {
      formValues
        .filter((element) => element.stockCode !== "")
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

          if (netWeight > gWeight) {
            allPrev[index].errors.netWeight =
              "Net Weight Can not be Greater than Gross Weight";
          } else {
            allPrev[index].errors.netWeight = null;
          }

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
          setFormValues(allPrev);
          return null;
        });
    }

    return !someEmpty;
  };

  const CataprevContactIsValid = () => {
    if (CategoryformValues.length === 0) {
      return true;
    }

    let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

    const someEmpty = CategoryformValues.filter(
      (element) => element.stockCode !== ""
    ).some((item) => {
      return (
        item.stockCode === "" ||
        item.categoryName === "" ||
        item.grossWeight === "" ||
        item.grossWeight == 0 ||
        item.netWeight === "" ||
        item.netWeight == 0 ||
        (item.stockCode.pcs_require === 1 &&
          (item.pcs === "" || isNaN(item.pcs)))
        // (item.stock_group !== 1 && item.pcs === "")
      );
    });

    if (someEmpty) {
      CategoryformValues.filter((element) => element.stockCode !== "").map(
        (item, index) => {
          const allPrev = [...CategoryformValues];

          let stockCode = CategoryformValues[index].stockCode;
          if (stockCode === "") {
            allPrev[index].errors.stockCode = "Please Select Stock Code";
          } else {
            allPrev[index].errors.stockCode = null;
          }

          let categoryName = CategoryformValues[index].categoryName;
          if (categoryName === "") {
            allPrev[index].errors.categoryName = "Please Select Valid Category";
          } else {
            allPrev[index].errors.categoryName = null;
          }

          let weightRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
          let gWeight = CategoryformValues[index].grossWeight;
          if (!gWeight || weightRegex.test(gWeight) === false || gWeight == 0) {
            allPrev[index].errors.grossWeight = "Enter Gross Weight!";
          } else {
            allPrev[index].errors.grossWeight = null;
          }

          let netWeight = CategoryformValues[index].netWeight;
          if (
            !netWeight ||
            weightRegex.test(netWeight) === false ||
            netWeight == 0
          ) {
            allPrev[index].errors.netWeight = "Enter Net Weight!";
          } else {
            allPrev[index].errors.netWeight = null;
          }

          if (netWeight > gWeight) {
            allPrev[index].errors.netWeight =
              "Net Weight Can not be Greater than Gross Weight";
          } else {
            allPrev[index].errors.netWeight = null;
          }

          let pcsTotal = CategoryformValues[index].pcs;

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
          setCategoryformValues(allPrev);
          return null;
        }
      );
    }

    return !someEmpty;
  };

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    newFormValues[i].errors[e.target.name] = null;

    let nm = e.target.name;
    let val = e.target.value;

    if(nm === "pcs" || isNaN(val)) {
      newFormValues[i].errors.pcs = "Enter valid pcs"
    }

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
      }
      newFormValues[i].netWeight = val;

      newFormValues[i].errors.grossWeight = "";
      if (val == 0 || isNaN(val)) {
        newFormValues[i].errors.grossWeight = "Enter valid Gross Weight";
        newFormValues[i].errors.netWeight = "Enter valid Net Weight";
      }

      if (val === "" || val == 0) {
        newFormValues[i].fineGold = "0";
        newFormValues[i].amount = "0";
        newFormValues[i].netWeight = "";
        setAmount("");
        setTotalGrossWeight("");
        setFineGoldTotal("");
      }

      newFormValues[i].errors.netWeight = "";
      //   setAdjustedRate(false);
      newFormValues[i].rate = "";
    }

    if (nm === "purity") {
      if(isNaN(val)) {
        newFormValues[i].errors.purity = "Enter valid purity"
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
      }

      if (val === "") {
        newFormValues[i].fineGold = "0";
        newFormValues[i].amount = "0";

        setAmount("");
        setTotalGrossWeight("");
        setFineGoldTotal("");
      }
    }

    if ((goldrateValue !== "" || silverRate !== "") && newFormValues[i].fineGold !== "") {
      console.log(newFormValues[i].isGoldSilver);
      if (newFormValues[i].isGoldSilver === 1 || newFormValues[i].isGoldSilver === 2) {
        newFormValues[i].amount = parseFloat(
          (parseFloat(newFormValues[i].isGoldSilver === 1 ? goldrateValue : silverRate) * parseFloat(newFormValues[i].fineGold)) /
            10
        ).toFixed(3);
      } else {
        newFormValues[i].amount = parseFloat(
          parseFloat(newFormValues[i].isGoldSilver === 1 ? goldrateValue : silverRate) * parseFloat(newFormValues[i].fineGold)
        ).toFixed(3);
      }
    }
    if (nm === "amount") {
      newFormValues[i].amount = val
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

    setTotalGrossWeight(
      parseFloat(
        newFormValues
          .filter((data) => data.grossWeight !== "")
          .map(grossWeight)
          .reduce(function (a, b) {
            // sum all resulting numbers
            return parseFloat(a) + parseFloat(b);
          }, 0)
      ).toFixed(3)
    );

    function fineGold(item) {
      return parseFloat(item.fineGold);
    }
    function netWeight(item) {
      return parseFloat(item.netWeight);
    }

    let tempGrossWtTot = HelperFunc.getTotalOfField(
      newFormValues,
      "grossWeight"
    );

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

    let tempNetWtTot = parseFloat(
      newFormValues
        .filter((data) => data.netWeight !== "")
        .map(netWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);

    let tempFineGold = newFormValues
      .filter((item) => item.fineGold !== "")
      .map(fineGold)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

    function amount(item) {
      return item.amount;
    }

    setFormValues(newFormValues);
    settotalamt(tempAmount);
    settotalgwt(tempGrossWtTot);
    settotalfinew(tempFineGold);
    // settotalpcs()
    // setPrintObj({
    //   ...printObj,
    //   orderDetails: newFormValues,
    //   grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
    //   netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
    //   fineWtTot: parseFloat(tempFineGold).toFixed(3),

    //   totalInvoiceAmt: parseFloat(tempAmount).toFixed(3),
    //   amount: parseFloat(tempAmount).toFixed(3),
    //   allTotalGrossw: (parseFloat(tempGrossWtTot) + parseFloat(catatotalGrossWeight)).toFixed(3),
    // });
  };

  let handleCateChange = (i, e) => {
    let newFormValues = [...CategoryformValues];
    newFormValues[i][e.target.name] = e.target.value;
    newFormValues[i].errors[e.target.name] = null;

    let nm = e.target.name;
    let val = e.target.value;

    if(nm === "pcs" || isNaN(val)){
      newFormValues[i].errors.pcs = "Enter valid pcs"
    }

    //if grossWeight or putity change
    if (nm === "grossWeight") {
      newFormValues[i].netWeight = val;
      if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
        newFormValues[i].fineGold = parseFloat(
          (parseFloat(newFormValues[i].netWeight) *
            parseFloat(newFormValues[i].purity)) /
            100
        ).toFixed(3);
      }
      newFormValues[i].errors.grossWeight = "";
      if (val == 0 || isNaN(val)) {
        newFormValues[i].errors.grossWeight = "Enter valid Gross Weight";
        newFormValues[i].errors.netWeight = "Enter valid Net Weight";
      }

      if (val === "" || val == 0) {
        newFormValues[i].fineGold = "0";
        newFormValues[i].amount = "0";
        newFormValues[i].netWeight = "";
        setCataAmount("");
        setCataFineGoldTotal("");
        setCataFineGoldTotal("");
      }

      newFormValues[i].errors.netWeight = "";
      newFormValues[i].rate = "";
    }
    if (nm === "CnetWeight") {
      // newFormValues[i].netWeight = val;
      newFormValues[i].netWeight = val;
      if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
        newFormValues[i].fineGold = parseFloat(
          (parseFloat(newFormValues[i].netWeight) *
            parseFloat(newFormValues[i].purity)) /
            100
        ).toFixed(3);
      }
      if (
        parseFloat(newFormValues[i].grossWeight) >=
        parseFloat(newFormValues[i].netWeight)
      ) {
        newFormValues[i].netWeight = val;

        newFormValues[i].errors.netWeight = "";
      } else {
        newFormValues[i].errors.netWeight = "Enter valid Net Weight";
      }
      // console.log(val);
    }
    if (nm === "purity") {
      if (val < 0.1 || val > 100 || isNaN(val)) {
        newFormValues[i].errors.purity = "Enter valid Purity";
      }

      if (
        newFormValues[i].grossWeight !== "" &&
        newFormValues[i].purity !== ""
      ) {
        newFormValues[i].fineGold = parseFloat(
          (parseFloat(newFormValues[i].netWeight) *
            parseFloat(newFormValues[i].purity)) /
            100
        ).toFixed(3);
      }

      if (val === "") {
        newFormValues[i].fineGold = "0";
        newFormValues[i].amount = "0";

        setCataAmount("");
        setCataTotalGrossWeight("");
        setCataFineGoldTotal("");
      }
    }

    if ((goldrateValue !== "" || silverRate !== "") && newFormValues[i].fineGold !== "") {
      if (newFormValues[i].stock_group === 1) {
        newFormValues[i].amount = parseFloat(
          (parseFloat(newFormValues[i].isGoldSilver === 0 ? goldrateValue : silverRate) * parseFloat(newFormValues[i].fineGold)) /
            10
        ).toFixed(3);
      } else {
        newFormValues[i].amount = parseFloat(
          (parseFloat(newFormValues[i].isGoldSilver === 0 ? goldrateValue : silverRate) * parseFloat(newFormValues[i].fineGold)) /
            10
        ).toFixed(3);
      }
    }

    function amount(item) {
      return item.amount;
    }

    function grossWeight(item) {
      return parseFloat(item.grossWeight);
    }

    let tempAmounts = newFormValues
      .filter((item) => item.amount !== "")
      .map(amount)
      .reduce(function (a, b) {
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setCataAmount(parseFloat(tempAmounts).toFixed(3));
    setCataTotalGrossWeight(
      parseFloat(
        newFormValues
          .filter((data) => data.grossWeight !== "")
          .map(grossWeight)
          .reduce(function (a, b) {
            return parseFloat(a) + parseFloat(b);
          }, 0)
      ).toFixed(3)
    );

    function fineGold(item) {
      return parseFloat(item.fineGold);
    }
    function netWeight(item) {
      return parseFloat(item.netWeight);
    }

    let tempGrossWtTot = HelperFunc.getTotalOfField(
      newFormValues,
      "grossWeight"
    );

    setCataTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

    let tempNetWtTot = parseFloat(
      newFormValues
        .filter((data) => data.netWeight !== "")
        .map(netWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);

    let tempFineGold = newFormValues
      .filter((item) => item.fineGold !== "")
      .map(fineGold)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setCataFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

    function amount(item) {
      return item.amount;
    }
    var Totalamount = parseFloat(tempAmounts + totalamt).toFixed(3);
    var TotalFineGold = parseFloat(tempFineGold + totalfinew).toFixed(3);
    // var TotalGroew = parseFloat(tempGrossWtTot + totalgwt).toFixed(3)
    //  var Totalpcs = parseFloat(temppcs + Catapcs).toFixed(3)
    // console.log(parseFloat(tempGrossWtTot + totalgwt).toFixed(3)   ,"///////////////////////////////////cccccccccccccccc");
    setCategoryformValues(newFormValues);
    // setPrintObj({
    //   ...printObj,
    //   orderDetailsjewelry: newFormValues,
    //   grossWtcataTOt: parseFloat(tempGrossWtTot).toFixed(3),
    //   netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
    //   finegoldcataTot: parseFloat(tempFineGold).toFixed(3),

    //   totalInvoiceAmt: parseFloat(tempAmounts).toFixed(3),
    //   cataAmount: parseFloat(tempAmounts).toFixed(3),
    //   allTotal: parseFloat(Totalamount).toFixed(3),
    //    allTotalfine: parseFloat(TotalFineGold).toFixed(3),
    //   allTotalGrossw: (parseFloat(tempGrossWtTot) + parseFloat(totalGrossWeight)).toFixed(3),
    //   //  allTotalPieces: parseFloat(Totalpcs).toFixed(3),
    // });
  };

  function deleteHandler(index) {
    let newFormValues = [...formValues];

    newFormValues[index].lotno = "";
    newFormValues[index].stockCode = "";
    newFormValues[index].stock_group = "";
    newFormValues[index].categoryName = "";
    newFormValues[index].grossWeight = "";
    newFormValues[index].netWeight = "";
    newFormValues[index].pcs = "";
    newFormValues[index].setWeight = "";
    newFormValues[index].purity = "";
    newFormValues[index].fineGold = "";
    newFormValues[index].rate = "";
    newFormValues[index].amount = "";
    newFormValues[index].manuallLot = "0";

    setFormValues(newFormValues);

    function amount(item) {
      return item.amount;
    }

    function grossWeight(item) {
      return parseFloat(item.grossWeight);
    }
    function netWeight(item) {
      return parseFloat(item.netWeight);
    }

    function fineGold(item) {
      return parseFloat(item.fineGold);
    }
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

    let tempNetWtTot = parseFloat(
      newFormValues
        .filter((data) => data.netWeight !== "")
        .map(netWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);

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
        return parseFloat(a) + parseFloat(b);
      }, 0);
    //.reduce(sum);
    setAmount(parseFloat(tempAmount).toFixed(3));

    setTotalGrossWeight(
      parseFloat(
        newFormValues
          .filter((data) => data.grossWeight !== "")
          .map(grossWeight)
          .reduce(function (a, b) {
            return parseFloat(a) + parseFloat(b);
          }, 0)
      ).toFixed(3)
    );
    // setPrintObj({
    //   ...printObj,
    //   orderDetails: newFormValues,
    //   grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
    //   netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
    //   fineWtTot: parseFloat(tempFineGold).toFixed(3),
    //   // amount: parseFloat(tempAmount).toFixed(3),
    //   totalInvoiceAmt: parseFloat(tempAmount).toFixed(3),
    //   totalAmount: parseFloat(tempAmount).toFixed(3),
    // });
  }

  function CatadeleteHandlerJewl(index) {
    let newFormValues = [...CategoryformValues];

    newFormValues[index].lotno = "";
    newFormValues[index].stockCode = "";
    newFormValues[index].stock_group = "";
    newFormValues[index].categoryName = "";
    newFormValues[index].grossWeight = "";
    newFormValues[index].netWeight = "";
    newFormValues[index].pcs = "";
    newFormValues[index].setWeight = "";
    newFormValues[index].purity = "";
    newFormValues[index].fineGold = "";
    newFormValues[index].rate = "";
    newFormValues[index].amount = "";
    newFormValues[index].manuallLot = "0";

    setCategoryformValues(newFormValues);

    function amount(item) {
      return item.amount;
    }

    function grossWeight(item) {
      return parseFloat(item.grossWeight);
    }
    function netWeight(item) {
      return parseFloat(item.netWeight);
    }

    function fineGold(item) {
      return parseFloat(item.fineGold);
    }
    let tempGrossWtTot = parseFloat(
      newFormValues
        .filter((data) => data.grossWeight !== "")
        .map(grossWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);

    setCataTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));

    let tempNetWtTot = parseFloat(
      newFormValues
        .filter((data) => data.netWeight !== "")
        .map(netWeight)
        .reduce(function (a, b) {
          // sum all resulting numbers
          return parseFloat(a) + parseFloat(b);
        }, 0)
    ).toFixed(3);

    let tempFineGold = newFormValues
      .filter((item) => item.fineGold !== "")
      .map(fineGold)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);

    setCataFineGoldTotal(parseFloat(tempFineGold).toFixed(3));

    let tempAmount = newFormValues
      .filter((item) => item.amount !== "")
      .map(amount)
      .reduce(function (a, b) {
        return parseFloat(a) + parseFloat(b);
      }, 0);
    //.reduce(sum);
    setCataAmount(parseFloat(tempAmount).toFixed(3));

    setCataTotalGrossWeight(
      parseFloat(
        newFormValues
          .filter((data) => data.grossWeight !== "")
          .map(grossWeight)
          .reduce(function (a, b) {
            return parseFloat(a) + parseFloat(b);
          }, 0)
      ).toFixed(3)
    );
    // setPrintObj({
    //   ...printObj,
    //   orderDetails: newFormValues,
    //   grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
    //   netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
    //   fineWtTot: parseFloat(tempFineGold).toFixed(3),
    //   // amount: parseFloat(tempAmount).toFixed(3),
    //   totalInvoiceAmt: parseFloat(tempAmount).toFixed(3),
    //   totalAmount: parseFloat(tempAmount).toFixed(3),
    // });
  }

  function handleSelectVoucher() {
    setvoucherModalOpen(true);
  }

  function handleVoucherModalClose() {
    setvoucherModalOpen(false);
  }

  function handleVoucherSubmit() {
    setvoucherModalOpen(false);
  }

  const handleVoucherSelect = (event) => {
    const RowData = JSON.parse(event.target.value);

    if (event.target.checked) {
      setIsVoucherSelected(true);
      setSelectedVoucher(RowData.id);
      setSelectVoucherErr("");
    } else {
      setIsVoucherSelected(false);
      setSelectedVoucher("");
      setSelectVoucherErr("Please Select Voucher");
    }

    // setvoucherModalOpen(false);
  };

  let handlerBlur = (i, e) => {
    let newFormValues = [...formValues];

    let nm = e.target.name;
    let val = e.target.value;
    if (isNaN(val) || val === "") {
      return;
    }

    if (nm === "netWeight") {
      newFormValues[i].netWeight = parseFloat(val).toFixed(3);
    }

    if (nm === "rate") {
      newFormValues[i].rate = parseFloat(val).toFixed(3);
    }
    setFormValues(newFormValues);
  };
  const handleNarrationClick = () => {
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        flag: 12,
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
              <Grid container
              alignItems="center"
              style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
              >
                <Grid item xs={6} sm={6} md={6} key="1">
                  <FuseAnimate delay={300}>
                    <Typography className="text-18 font-700">
                      {isView
                        ? "View Artician Return Metal"
                        : "Add Artician Return Metal "}
                    </Typography>
                  </FuseAnimate>

                  {/* {!isView && <BreadcrumbsHelper />} */}
                </Grid>

                <Grid item xs={6} sm={6} md={6} key="2" style={{textAlign:"right"}}>
                  <Button
                    id="btn-back"
                    variant="contained"
                    size="small"
                    className={classes.button}
                    style={{marginRight: 0}}
                    onClick={(event) => {
                      History.goBack();
                    }}
                  >
                    <img className="back_arrow" src={Icones.arrow_left_pagination} alt="back" />
                    Back
                  </Button>
                </Grid>
              </Grid>
            )}

            {loading && <Loader />}
            <div className="main-div-alll ">
              <div style={{ height: "90%" }}>
                <div>
                  <form
                    name="registerForm"
                    noValidate
                    className="flex flex-col justify-center w-full"
                    onSubmit={handleFormSubmit}
                  >
                    <Grid container spacing={2}>
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                      >
                        <p style={{lineHeight: 0.9, marginBottom: 5}}>Voucher Date</p>
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
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ position: "relative" }}
                      >
                        <p style={{lineHeight: 0.9, marginBottom: 5}}>Today's Gold Rate (Per 10gm)*</p>{" "}
                        <TextField
                          name="goldrateValue"
                          value={goldrateValue}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          autoFocus
                          placeholder="Today's Gold Rate*"
                          disabled={isView}
                        />
                        <span className={classes.errorMessage}>
                          {goldrateValueErr.length > 0 ? goldrateValueErr : ""}
                        </span>
                      </Grid>
                      <Grid
                      item
                      lg={2}
                      md={4}
                      sm={4}
                      xs={12}
                    >
                      <p style={{lineHeight: 0.9, marginBottom: 5}}>Today's Silver Rate (Per 10gm)*</p>
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
                        placeholder="Today's Silver Rate"
                        disabled={isView}
                      />
                    </Grid>
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                      >
                        <p style={{lineHeight: 0.9, marginBottom: 5}}>Voucher Number</p>
                        <TextField
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
                      >
                        <p style={{lineHeight: 0.9, marginBottom: 5}}>Artician Name</p>
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

                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                      >
                        <p style={{lineHeight: 0.9, marginBottom: 5}}>Party Voucher Number</p>
                        <TextField
                          className=""
                          // label="Party Voucher Number"
                          name="partyVoucherNum"
                          value={partyVoucherNum}
                          // error={partyVoucherNumErr.length > 0 ? true : false}
                          // helperText={partyVoucherNumErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          disabled={isView}
                          placeholder="Enter Party Voucher Number"
                        />
                      </Grid>
                      {/* <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p>Paert voucher date</p>
                        <TextField
                          label="Party Voucher Date"
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
                      </Grid> */}

                      {/* {!isView && (
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
                      )} */}
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                      >
                        <Button
                          // id="button-jewellery"
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
                    </Grid>

                    {selectedVoucher > 0 && (
                      <div
                        style={{
                          alignItems: "left",
                          marginTop: "15px",
                          marginBottom: "15px",
                        }}
                      >
                        <h3>Selected Vouchers</h3>
                        <div style={{ alignItems: "left", marginTop: "15px" }}>
                          <Table className={clsx(classes.table, "Table_UI")}>
                            <TableHead>
                              <TableRow>
                                {/* <TableCell
                          className={classes.tableRowPad}
                          align="center"
                        >
                        </TableCell> */}

                                <TableCell className={classes.tableRowPad}>
                                  Voucher Number
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Fine
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Utilize
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
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
                                    <TableRow key={index}>
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

                    <div className="table_full_width addarticianresturn_tabel-blg tbel_addartician_return_tbel" style={{paddingTop:"14px"}}>
                      <div
                        className="view_artician_return_tbel  "
                        style={{
                          border: "1px solid #EBEEFB",
                          // paddingBottom: 5,
                          borderRadius: "7px",
                        }}
                      >
                        <div
                          className="metal-tbl-head-title justify-center flex "
                          style={{ background: "#EBEEFB", fontWeight: "700" }}
                        >
                          Jewelry Return{" "}
                        </div>
                        <div
                          className="metal-tbl-head "
                          style={{ background: "#EBEEFB", fontWeight: "700" }}
                        >
                          {!isView && (
                            <div
                              className={clsx(
                                classes.tableheader,
                                "delete_icons_dv"
                              )}
                            ></div>
                          )}

                          <div className={classes.tableheader}>Category Code</div>

                          <div className={clsx(classes.tableheader, "")}>
                            Category Name
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
                            Fine
                          </div>

                          <div className={clsx(classes.tableheader, "")}>
                            Amount
                          </div>
                        </div>

                        {CategoryformValues.map((element, index) => (
                          <div
                            key={index}
                            className=" castum-row-dv artician-select-input-main all-purchase-tabs"
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
                                    CatadeleteHandlerJewl(index);
                                  }}
                                >
                                  <Icon className="delete-icone">
                                    <img src={Icones.delete_red} alt="" />
                                  </Icon>
                                </IconButton>
                              </div>
                            )}

                            <Select
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              // className={classes.selectBox}
                              className="articianreturnselect"
                              classes={classes}
                              styles={selectStyles}
                              options={cateGoryCodeData.map((suggestion) => ({
                                value: suggestion.id,
                                label: suggestion.billing_category_name,
                                category: suggestion.is_gold_silver
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
                                handleStockCategoryChange(index, e);
                              }}
                              placeholder="Stock Code"
                              isDisabled={isView}
                            />
                            <span style={{ color: "red" }}>
                              {element.errors !== undefined
                                ? element.errors.stockCode
                                : ""}
                            </span>
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
                              // onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                            />
                            <TextField
                              name="pcs"
                              value={element.pcs || ""}
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
                              onChange={(e) => handleCateChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                              inputRef={(el) =>
                                (pcsInputRefTwo.current[index] = el)
                              }
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
                              onChange={(e) => handleCateChange(index, e)}
                              onBlur={(e) => handlerBlur(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                              // disabled={selectedLoad === "2"}
                            />
                            <TextField
                              name="CnetWeight"
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
                              onChange={(e) => handleCateChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                              onBlur={(e) => handlerBlur(index, e)}
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
                              onChange={(e) => handleCateChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                              // disabled
                            />
                            <TextField
                              name="fineGold"
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
                              onChange={(e) => handleCateChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled
                            />

                            <TextField
                              name="amount"
                              value={
                                isView
                                  ? Config.numWithComma(element.amount)
                                  : element.amount || ""
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
                              onChange={(e) => handleCateChange(index, e)}
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
                              CategoryformValues,
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
                            {catatotalGrossWeight}
                          </div>
                          <div
                            className={clsx(
                              classes.tableheader,
                              "castum-width-table"
                            )}
                          >
                            {HelperFunc.getTotalOfFieldNoDecimal(
                              CategoryformValues,
                              "netWeight"
                            ).toFixed(3)}
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
                            {catafineGoldTotal}
                          </div>

                          <div
                            className={clsx(
                              classes.tableheader,
                              "castum-width-table"
                            )}
                          >
                            {isView
                              ? Config.numWithComma(cataamount)
                              : cataamount}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="table_full_width addarticianresturn_tabel-blg tbel_addartician_return_tbel" style={{paddingTop:"22px"}}>
                      <div
                        className="view_artician_return_tbel  "
                        style={{
                          border: "1px solid #EBEEFB",
                          // paddingBottom: 5,
                          borderRadius: "7px",
                        }}
                      >
                        <div
                          className="metal-tbl-head-title justify-center flex "
                          style={{ background: "#EBEEFB", fontWeight: "700" }}
                        >
                          Metal Return{" "}
                        </div>
                        <div
                          className="metal-tbl-head "
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

                          <div className={classes.tableheader}>Stock Code</div>

                          <div className={clsx(classes.tableheader, "")}>
                            Category Name
                          </div>

                          <div className={clsx(classes.tableheader, "")}>
                            Pieces{" "}
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
                            Fine
                          </div>

                          <div className={clsx(classes.tableheader, "")}>
                            Amount
                          </div>
                        </div>

                        {formValues.map((element, index) => {
                          console.log(element)
                        return (
                          <div
                            key={index}
                            className=" castum-row-dv artician-select-input-main all-purchase-tabs"
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

                            <Select
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              // className={classes.selectBox}
                              className="articianreturnselect"
                              classes={classes}
                              styles={selectStyles}
                              options={stockCodeData.map((suggestion) => ({
                                value: suggestion.stock_name_code.id,
                                label: suggestion.stock_name_code.stock_code,
                                pcs_require:
                                  suggestion.stock_name_code.stock_description
                                    .pcs_require,
                                stockGroup: suggestion.stock_group.item_id
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
                            <span style={{ color: "red" }}>
                              {element.errors !== undefined
                                ? element.errors.stockCode
                                : ""}
                            </span>

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

                            <TextField
                              name="pcs"
                              value={element.pcs || ""}
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
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                              inputRef={(el) =>
                                (pcsInputRef.current[index] = el)
                              }
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
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                              // disabled={selectedLoad === "2"}
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
                              disabled
                              onBlur={(e) => handlerBlur(index, e)}
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
                              disabled
                              // disabled
                            />
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
                              disabled={element.isGoldSilver === 1 || element.isGoldSilver === 2}
                            />
                          </div>
                        )})}
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
                            {/* {totalGrossWeight} */}
                            {HelperFunc.getTotalOfField(
                              formValues,
                              "grossWeight"
                            )}
                          </div>
                          <div
                            className={clsx(
                              classes.tableheader,
                              "castum-width-table"
                            )}
                          >
                            {HelperFunc.getTotalOfField(
                              formValues,
                              "netWeight"
                            )}
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
                            {HelperFunc.getTotalOfField(formValues, "fineGold")}
                            {/* {fineGoldTotal} */}
                          </div>

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
                        // disabled={isView}
                        disabled={narrationFlag}
                        placeholder="Metal Narration"
                      />
                    </div>
                    <div style={{ width: " 100%" }}>
                      <p>Account Narration*</p>
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
                        placeholder="Account Narration"
                        // disabled={isView}
                        disabled={narrationFlag}
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
                          className="w-224 mx-auto btn-print-save "
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
                        // disabled={!isFormValid()}
                        // type="submit"
                        onClick={checkforPrint}
                      >
                        {isView ? "Print" : "Save & Print"}
                      </Button>
                      <div 
                      style={{ display: "none" }}
                      >
                        <ArticianReturnRetailerPrintComp
                          ref={componentRef}
                          printObj={printObj}
                        />
                      </div>
                    </div>
                  )}
                  {isView && (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ float: "right" }}
                      className="w-224 mx-auto mr-16 btn-print-save"
                      aria-label="Register"
                      onClick={() => handleNarrationClick()}
                    >
                      {!narrationFlag ? "Save Narration" : "Update Narration"}
                    </Button>
                  )}
                  {/* {isView && (
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
                  )} */}
                </div>
              </div>

              <ViewDocModelRetailer
                documentList={documentList}
                handleClose={handleDocModalClose}
                open={docModal}
                updateDocument={updateDocumentArray}
                purchase_flag_id={idToBeView?.id}
                purchase_flag="12"
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
                    className="p-16"
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
                            Fine
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
                  <DialogActions style={{justifyContent: "center", columnGap: 20}}>
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
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddArticianReturnRetailer;

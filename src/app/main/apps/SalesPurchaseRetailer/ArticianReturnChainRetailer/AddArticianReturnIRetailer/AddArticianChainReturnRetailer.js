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
    marginLeft: "0.5rem",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 0,
    width: "100%",
    display: "inline-block",
  },
  normalSelect: {
    padding: 6,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 0,
    width: "100%",
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
    width: 600,
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
    margin: 5,
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
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

const AddArticianChainReturnRetailer = (props) => {
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
  const [goldRatePerGram, setGoldRatePerGram] = useState("");
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

  const [isChainZamZam, setIsChainZamZam] = useState(0);

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
    setIsChainZamZam(parseFloat(window.localStorage.getItem("isChainZamZam")));
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
      description: "",
      wastage: "",
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
        description: null,
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
      // orderDetailsjewelry: CategoryformValues,
      // taxableAmount: totalGST,
      voucherDate: moment(voucherDate).format("DD-MM-YYYY"),
      finegoldTot: HelperFunc.getTotalOfField(formValues, "fineGold"),
      // finegoldTots: HelperFunc.getTotalOfField(CategoryformValues, "fineGold"),
      // pcsTot: HelperFunc.getTotalOfField(formValues, "pcs"),
      // pcsTots: HelperFunc.getTotalOfField(CategoryformValues, "pcs"),
      // iGstTot: HelperFunc.getTotalOfField(packingSlipData, "igstV"),
      // roundOff: roundOff,
      amountTot: HelperFunc.getTotalOfField(formValues, "amount"),
      // amountTots: HelperFunc.getTotalOfField(CategoryformValues, "amount"),
      grossWtTOt: HelperFunc.getTotalOfField(formValues, "grossWeight"),
      // grossWtTOts: HelperFunc.getTotalOfField(CategoryformValues,"grossWeight"),
      netWtTOt: HelperFunc.getTotalOfField(formValues, "netWeight"),
      goldRatePerGram: goldRatePerGram,
      // netWtTOts: HelperFunc.getTotalOfField(CategoryformValues, "netWeight"),
    });
    if (
      // goldRateValueValidation() &&
      voucherDateValidation() &&
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
    goldRatePerGram: "",
  });

  let handleStockGroupChange = (i, e) => {
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
      if (stockCodeData[findIndex].stock_group.item_id === 1) {
        newFormValues[i].purity =
          stockCodeData[findIndex].stock_name_code.purity;
      } else {
        newFormValues[i].purity = "0";
      }

      newFormValues[i].categoryName = stockCodeData[findIndex].stock_name;
      newFormValues[i].errors.categoryName = null;
    }

    if (i === formValues.length - 1) {
      changeTotal(newFormValues, true);
    } else {
      changeTotal(newFormValues, false);
    }
    pcsInputRef.current[i].focus();
  };

  let handleStockCategoryChange = (i, e) => {
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
      newFormValues[i].categoryName = cateGoryCodeData[findIndex].category_name;
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
          description: "",
          wastage: "",
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
            description: null,
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
      // getTodaysGoldRate();
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
      api = `retailerProduct/api/chainjobworkarticianreturn/${id}?deleted_at=1`;
    } else {
      api = `retailerProduct/api/chainjobworkarticianreturn/${id}`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              console.log(response.data.data, "🍕🍕🍕");
              // setApiData(response.data.data[0]);
              let finalData = response.data.data.data;
              // let loadType = response.data.data.otherDetails.loadType;
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
              setGoldRatePerGram(finalData?.fine_rate);

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
                finalData.ChainJobWorkArticianIssueOrder[0].rate_of_fine_gold;
              setGoldRateValue(rets);
              let tempArray = [];
              const filteredData =
                finalData.ChainJobWorkArticianIssueOrder.filter(
                  (item) => item.category_id === null
                );
              for (let item of filteredData) {
                tempArray.push({
                  description: item.description,
                  // stockCode: {
                  //   value: item.StockNameCode.id,
                  //   label: item.StockNameCode.stock_code,
                  // },
                  // categoryName: item.stock_name,
                  // selectedHsn: item.StockNameCode.stock_name_code.hsn_master.hsn_number,
                  grossWeight: parseFloat(item.gross_weight).toFixed(3),
                  // pcs: item.pcs === null ? 0 : item.pcs,
                  netWeight: parseFloat(item.net_weight).toFixed(3),
                  purity: item.purity,
                  fineGold: parseFloat(item.finegold).toFixed(3),
                  // rate: parseFloat(goldrateValue),
                  amount: parseFloat(item.amount).toFixed(3),
                  wastage: item.wastage,
                });
              }
              setFormValues(tempArray);

              function amount(item) {
                return item.amount;
              }
              // function pcs(item) {
              //   return item.pcs;
              // }
              function grossWeight(item) {
                return parseFloat(item.grossWeight);
              }
              function netWeight(item) {
                return parseFloat(item.netWeight);
              }

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
              console.log(tempGrossWtTot);
              let tempNetWtTot = tempArray
                .filter((item) => item.netWeight !== "")
                .map(netWeight)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              console.log(tempNetWtTot);

              console.log(goldRatePerGram, "/////./.");
              let tempFineGold = tempArray
                .filter((item) => item.fineGold !== "")
                .map(fineGold)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
              setIsVoucherSelected(true);

              // let CatatempArray = [];
              // const CatafilteredData =
              //   finalData.JobWorkArticianReturnOrder.filter(
              //     (item) => item.category_id !== null
              //   );

              // for (let item of CatafilteredData) {
              //   CatatempArray.push({
              //     stockCode: {
              //       value: item.Category.id,
              //       label: item.Category.category_name,
              //     },
              //     categoryName: item.Category.billing_category_name,
              //     // selectedHsn: item.StockNameCode.stock_name_code.hsn_master.hsn_number,
              //     grossWeight: parseFloat(item.gross_weight).toFixed(3),
              //     pcs: item.pcs === null ? 0 : item.pcs,
              //     netWeight: parseFloat(item.net_weight).toFixed(3),
              //     purity: item.purity,
              //     fineGold: parseFloat(item.finegold).toFixed(3),
              //     rate: parseFloat(goldrateValue),
              //     amount: parseFloat(item.amount).toFixed(3),
              //   });
              // }
              // setCategoryformValues(CatatempArray);

              // function cataamount(item) {
              //   return item.amount;
              // }
              // function catapcs(item) {
              //   return item.pcs;
              // }
              // function CatagrossWeight(item) {
              //   return parseFloat(item.grossWeight);
              // }
              // function CatanetWeight(item) {
              //   return parseFloat(item.netWeight);
              // }
              // let Catapcs = CatatempArray.filter((item) => item.pcs !== "")
              //   .map(catapcs)
              //   .reduce(function (a, b) {
              //     return parseFloat(a) + parseFloat(b);
              //   }, 0);
              // let CatatempAmount = CatatempArray.filter(
              //   (item) => item.amount !== ""
              // )
              //   .map(amount)
              //   .reduce(function (a, b) {
              //     return parseFloat(a) + parseFloat(b);
              //   }, 0);
              // setCataAmount(CatatempAmount);
              // setCataTotalGrossWeight(
              //   parseFloat(
              //     CatatempArray.filter((data) => data.grossWeight !== "")
              //       .map(grossWeight)
              //       .reduce(function (a, b) {
              //         // sum all resulting numbers
              //         return parseFloat(a) + parseFloat(b);
              //       }, 0)
              //   ).toFixed(3)
              // );
              // function catafineGold(item) {
              //   return parseFloat(item.fineGold);
              // }
              // let catatempGrossWtTot = CatatempArray.filter(
              //   (item) => item.grossWeight !== ""
              // )
              //   .map(grossWeight)
              //   .reduce(function (a, b) {
              //     // sum all resulting numbers
              //     return parseFloat(a) + parseFloat(b);
              //   }, 0);
              // setCataFineGoldTotal(parseFloat(catatempGrossWtTot).toFixed(3));

              // let catatempNetWtTot = CatatempArray.filter(
              //   (item) => item.netWeight !== ""
              // )
              //   .map(netWeight)
              //   .reduce(function (a, b) {
              //     // sum all resulting numbers
              //     return parseFloat(a) + parseFloat(b);
              //   }, 0);

              // let catatempFineGold = CatatempArray.filter(
              //   (item) => item.fineGold !== ""
              // )
              //   .map(fineGold)
              //   .reduce(function (a, b) {
              //     // sum all resulting numbers
              //     return parseFloat(a) + parseFloat(b);
              //   }, 0);
              // setCataFineGoldTotal(parseFloat(catatempFineGold).toFixed(3));
              // var Totalamount = parseFloat(tempAmount + CatatempAmount).toFixed(
              //   3
              // );
              // var TotalFineGold = parseFloat(
              //   tempFineGold + catatempFineGold
              // ).toFixed(3);
              // var TotalGroew = parseFloat(
              //   tempGrossWtTot + catatempGrossWtTot
              // ).toFixed(3);
              // var Totalpcs = parseFloat(temppcs + Catapcs).toFixed(3);

              setPrintObj({
                ...printObj,
                supplierName: finalData.JobWorker.name,
                purcVoucherNum: finalData.voucher_no,
                voucherDate: moment(
                  finalData.purchase_voucher_create_date
                ).format("DD-MM-YYYY"),
                orderDetails: tempArray,
                grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
                NetWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                amount: parseFloat(tempAmount).toFixed(3),
                finegoldTot: parseFloat(tempFineGold).toFixed(3),
                goldRatePerGram: finalData?.fine_rate,
                // allTotal: parseFloat(Totalamount).toFixed(3),
                // allTotalfine: parseFloat(TotalFineGold).toFixed(3),
                // allTotalGrossw: parseFloat(TotalGroew).toFixed(3),
              });
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
      .get(Config.getCommonUrl() + "retailerProduct/api/clientRet/listing")
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
          api: "retailerProduct/api/clientRet/listing",
        });
      });
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    // if (name === "goldrateValue") {
    //   const goldrateValuee = parseFloat(oldGoldRate);
    //   // setGoldRateValue(value);
    //   var targetValue = parseFloat(value);
    //   if (oldGoldRate === "") {
    //     setGoldRateValueErr("Please enter today's rate on master");
    //   } else {
    //     const goldrateValuee = parseFloat(oldGoldRate);
    //     setGoldRateValue(value);
    //   const minValue =
    //     goldrateValuee - (goldrateValuee * parseFloat(goldratPercentage)) / 100;
    //   const maxValue =
    //     goldrateValuee + (goldrateValuee * parseFloat(goldratPercentage)) / 100;
    //   console.log(minValue, maxValue);

    //   if (targetValue >= minValue && targetValue <= maxValue) {
    //     setGoldRateValue(targetValue);
    //     setGoldRateValueErr("");
    //     resetForm();
    //   } else {
    //     setGoldRateValueErr(
    //       `Please, Enter today's rate between ${minValue} to ${maxValue}`
    //     );
    //     resetForm();
    //   }
    // }
    // } else
    if (name === "voucherNumber") {
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
      const enteredDate = value;
      const currentDate = moment().format("YYYY-MM-DD");

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
      // setPrintObj({
      //   ...printObj,
      //   voucherDate: moment(value).format("DD-MM-YYYY"),
      // });
    } else if (name === "goldratepergram" && !isNaN(value)) {
      setGoldRatePerGram(value);
      resetForm(false);
      // setVoucherDtErr("");
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

  function voucherDateValidation() {
    if (voucherDate === "" || VoucherDtErr) {
      setVoucherDtErr("Please enter valid date");
      return false;
    }
    return true;
  }

  // function goldRateValueValidation() {
  //   if (!isView) {
  //     const goldrateValuee = oldGoldRate;
  //     const minValue =
  //       goldrateValuee - (goldrateValuee * parseFloat(goldratPercentage)) / 100;
  //     const maxValue =
  //       goldrateValuee + (goldrateValuee * parseFloat(goldratPercentage)) / 100;
  //     console.log(minValue, maxValue);
  //     if (
  //       parseFloat(goldrateValue) >= minValue &&
  //       parseFloat(goldrateValue) <= maxValue
  //     ) {
  //       setGoldRateValueErr("");

  //       return true;
  //     } else if (oldGoldRate === "") {
  //       setGoldRateValueErr("Please enter today's rate on master");
  //       return false;
  //     } else {
  //       setGoldRateValueErr(
  //         `Please, Enter today's rate between ${minValue} to ${maxValue}`
  //       );
  //       return false;
  //     }
  //   } else {
  //     return true;
  //   }
  // }
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
    console.log(voucherDateValidation());
    if (
      // goldRateValueValidation() &&
      voucherDateValidation() &&
      partyNameValidation()
    ) {
      if (handleCheckFineGold()) {
        addMetalPurchase(true, false);
      }
    }
  }
  function addMetalPurchase(resetFlag, toBePrint) {
    let Orders = [];

    formValues
      // .filter((element) => element.description !== "")
      .map((x) => {
        if (x.description) {
          // return {
          Orders.push({
            description: x.description,
            purity: x.purity,
            lot_no: x.lotno.label,
            gross_weight: x.grossWeight,
            net_weight: x.netWeight,
            rate_of_fine_gold:
              x.rate_of_fine_gold !== undefined ? x.rate_of_fine_gold : 0,
            finegold: x.fineGold !== undefined ? x.fineGold : 0,
            amount: x.amount == "" ? 0 : x.amount,
            wastage: x.wastage,
            wastage_fine: x.wastageFine,
          });
          // };
        }
      });
    if (Orders.length === 0) {
      dispatch(
        Actions.showMessage({ message: "Please Add Entry", variant: "error" })
      );
      return;
    }

    // let CataOrders = CategoryformValues.filter(
    //   (element) => element.grossWeight !== ""
    // ).map((x) => {
    //   return {
    //     lot_no: x.lotno.label,
    //     category_id: x.categoryName.value,
    //     purity: x.purity,
    //     gross_weight: x.grossWeight,
    //     pcs: x.pcs,
    //     net_weight: x.netWeight,
    //     stock_name_code_id: x.stockCode.value,
    //     rate_of_fine_gold: goldrateValue,
    //     finegold: x.fineGold,
    //     amount: x.amount,
    //   };
    // });
    // if (CataOrders.length === 0) {
    //   dispatch(
    //     Actions.showMessage({ message: "Please Add Entry", variant: "error" })
    //   );
    //   return;
    // }

    setLoading(true);
    const body = {
      is_lot: 0,
      party_voucher_no: partyVoucherNum,
      voucher_no: voucherNumber,
      opposite_account_id: 1, //oppositeAccSelected
      department_id: parseFloat(
        window.localStorage.getItem("SelectedDepartment")
      ),
      jobworker_id: selectedJobWorker.value,
      voucherId: selectedVoucher,
      metal_narration: metalNarration,
      account_narration: accNarration,
      purchaseCreateDate: voucherDate,
      party_voucher_date: partyVoucherDate,
      uploadDocIds: docIds,
      fine_rate: goldRatePerGram,
      Orders: Orders,
      // CataOrder: CataOrders,
    };
    axios
      .post(
        Config.getCommonUrl() +
          "retailerProduct/api/chainjobworkarticianreturn ",
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
          api: "retailerProduct/api/chainjobworkarticianreturn ",
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
          description: "",
          wastage: "",
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
            description: null,
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
          description: "",
          wastage: "",
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
            description: null,
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
          description: "",
          wastage: "",
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
            description: null,
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
          description: "",
          wastage: "",
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
            description: null,
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

    // getVouchers(value.value);
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

  const handleCheckFineGold = () => {
    const formArray = [...formValues];
    const filteredData = formArray.filter((item) => {
      return (
        item.description !== "" && (item.fineGold === "" || item.fineGold <= 0)
      );
    });
    if (filteredData.length > 0) {
      dispatch(
        Actions.showMessage({ message: "Add valid Entry", variant: "error" })
      );
      return false;
    } else {
      return true;
    }
  };

  const prevContactIsValid = () => {
    if (formValues.length === 0) {
      return true;
    }

    const someEmpty = formValues
      .filter((element) => element.stockCode !== "")
      .some((item) => {
        return (
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
    //if grossWeight or putity change
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
    if (nm === "amount" && isNaN(val)) {
      // if (val) {
      newFormValues[i].errors.amount = "Enter valid amount";
      // } else {
      //   newFormValues[i].errors.amount = ""
      // }
    }
    if (
      nm === "grossWeight" ||
      nm === "purity" ||
      nm === "wastage" ||
      nm === "amount"
    ) {
      const grossWeight = newFormValues[i].grossWeight
        ? newFormValues[i].grossWeight
        : 0;
      const purity = newFormValues[i].purity ? newFormValues[i].purity : 0;
      const amount = newFormValues[i].amount ? newFormValues[i].amount : 0;
      const wastage = newFormValues[i].wastage ? newFormValues[i].wastage : 0;
      const goldRates = goldRatePerGram ? goldRatePerGram : 0;

      // Calculate the purity weight
      const purityWeight = grossWeight ? (grossWeight * purity) / 100 : 0;

      // Calculate the total wastage
      const totalWstg = (grossWeight * wastage) / 100;

      // Calculate the addtotal
      const addtotal =
        goldRates && amount ? parseFloat(amount) / parseFloat(goldRates) : 0;

      // Calculate the fine gold weight
      const fineGold = purityWeight + totalWstg + addtotal;

      // Update the form values
      newFormValues[i].wastageFine = totalWstg;
      newFormValues[i].fineGold = fineGold.toFixed(3);
    }

    setFormValues(newFormValues);
    if (!formValues[i + 1]) {
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
          description: "",
          wastage: "",
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
            description: null,
          },
        },
      ]);
    }
    totalCalc(newFormValues);
  };
  function totalCalc(arrData) {
    const tempGrossWtTot = HelperFunc.getTotalOfField(arrData, "grossWeight");
    const tempFineTot = HelperFunc.getTotalOfField(arrData, "fineGold");
    const tempAmount = HelperFunc.getTotalOfField(arrData, "amount");

    setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));
    setFineGoldTotal(parseFloat(tempFineTot).toFixed(3));
    settotalamt(parseFloat(tempAmount).toFixed(3));
  }

  function deleteHandler(index) {
    let newFormValues = [...formValues];

    newFormValues[index].description = "";
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

    totalCalc(newFormValues);
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

  // let handlerBlur = (i, e) => {
  //   let newFormValues = [...formValues];

  //   let nm = e.target.name;
  //   let val = e.target.value;
  //   if (isNaN(val) || val === "") {
  //     return;
  //   }

  //   if (nm === "netWeight") {
  //     newFormValues[i].netWeight = parseFloat(val).toFixed(3);
  //   }

  //   if (nm === "rate") {
  //     newFormValues[i].rate = parseFloat(val).toFixed(3);
  //   }
  //   setFormValues(newFormValues);
  // };
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
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            {!props.viewPopup && (
              <Grid
                // className="jewellerypreturn-main"
                container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0, width: "100%" }}
              >
                <Grid item xs={7} sm={7} md={7} key="1" style={{ padding: 0 }}>
                  <FuseAnimate delay={300}>
                    <Typography className="pl-28 pt-16 text-18 font-700">
                      {isView
                        ? "View Artician Return Metal"
                        : "Add Artician Return Metal "}
                    </Typography>
                  </FuseAnimate>
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

            {loading && <Loader />}
            <div className="main-div-alll ">
              <div
                className="pb-32 pt-32"
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
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          // inputRef={inputRef}
                          autoFocus
                          placeholder="Enter Today's Rate*"
                          disabled={isView}
                        />
                        <span style={{ color: "red" }}>
                          {goldrateValueErr.length > 0 ? goldrateValueErr : ""}
                        </span>
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
                                  Voucher num
                                </TableCell>

                                <TableCell className={classes.tableRowPad}>
                                  Fine Gold
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

                    <div className="table_full_width addarticianresturn_tabel-blg tbel_addartician_return_tbel">
                      <div
                        className="mt-16 table-metal-purchase view_artician_return_tbel  "
                        style={{
                          border: "1px solid #EBEEFB",
                          paddingBottom: 5,
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
                          {console.log(isChainZamZam)}
                          {isChainZamZam === 1 && (
                            <div className={clsx(classes.tableheader, "")}>
                              Wastage(%)
                            </div>
                          )}
                          <div className={clsx(classes.tableheader, "")}>
                            Amount
                          </div>
                          <div className={clsx(classes.tableheader, "")}>
                            Fine Gold
                          </div>
                        </div>

                        {formValues.map((element, index) => (
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

                            <TextField
                              name="description"
                              type="text"
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
                              variant="outlined"
                              fullWidth
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
                              // onBlur={(e) => handlerBlur(index, e)}
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
                              // onBlur={(e) => handlerBlur(index, e)}
                              disabled
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
                            {console.log(element.wastage, "element.amount ")}
                            {isChainZamZam === 1 && (
                              <TextField
                                name="wastage"
                                variant="outlined"
                                fullWidth
                                value={element.wastage}
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
                                // onBlur={(e) => handlerBlur(index, e)}
                                // inputRef={(el) =>
                                //   (wtInputRef.current[index] = el)
                                // }
                                disabled={isView}
                              />
                            )}
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
                          {isChainZamZam === 1 && (
                            <div
                              className={clsx(
                                classes.tableheader,
                                "castum-width-table"
                              )}
                            ></div>
                          )}
                          <div
                            className={clsx(
                              classes.tableheader,
                              "castum-width-table"
                            )}
                          >
                            {isView ? Config.numWithComma(amount) : amount}
                          </div>
                          <div
                            className={clsx(
                              classes.tableheader,
                              "castum-width-table"
                            )}
                          >
                            {HelperFunc.getTotalOfField(formValues, "fineGold")}
                            {/* {fineGoldTotal} */}
                          </div>
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
                        placeholder="Account Narration"
                        // disabled={isView}
                        disabled={narrationFlag}
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
                          className="w-224 mx-auto mt-16 btn-print-save "
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
                        // disabled={!isFormValid()}
                        // type="submit"
                        onClick={checkforPrint}
                      >
                        {isView ? "Print" : "Save & Print"}
                      </Button>
                      <div style={{ display: "none" }}>
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
                      className="w-224 mx-auto mt-16 mr-16 btn-print-save"
                      aria-label="Register"
                      onClick={() => handleNarrationClick()}
                    >
                      {!narrationFlag ? "Save Narration" : "Update Narration"}
                    </Button>
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
                    className="p-1 pl-16 pr-16"
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
                            Fine Gold
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
                  <DialogActions>
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

export default AddArticianChainReturnRetailer;

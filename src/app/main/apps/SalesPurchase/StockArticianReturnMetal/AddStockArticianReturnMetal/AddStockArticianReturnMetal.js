import React, { useState, useEffect, useRef } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
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
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
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
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Icon, IconButton } from "@material-ui/core";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
import { useReactToPrint } from "react-to-print";
import { ArticianReturnPrintComp } from "../PrintComponent/ArticianReturnPrintComp";
import { UpdateNarration } from "../../Helper/UpdateNarration";
import HelperFunc from "../../Helper/HelperFunc";

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
    // marginLeft: 15,
  },
  normalSelect: {
    // marginTop: 8,
    padding: 8,
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
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
  },
  formControl: {
    display: "flex",
    alignItems: "center",
  },
  group: {
    display: "block",
  },
}));

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const AddStockArticianReturnMetal = (props) => {
  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);

  const [loading, setLoading] = useState(false);

  const [searchData, setSearchData] = useState("");
  const loadTypeRef = useRef(null);

  const pcsInputRef = useRef([]); //for pcs in table

  // value="0" Load  Metal Variant, lot number input and category data popup, insert purity
  // value="1" Load Finding Variant, same as above
  // value="2" Load Lot directly, as before stockcode data and category name from selection
  const [selectedLoad, setSelectedLoad] = useState("");
  const [selectedLoadErr, setSelectedLoadErr] = useState("");

  const [voucherModalOpen, setvoucherModalOpen] = useState(false);
  const [isVoucherSelected, setIsVoucherSelected] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [selectVoucherErr, setSelectVoucherErr] = useState("");
  const [voucherApiData, setVoucherApiData] = useState([]);

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
  const [partyVoucherDate, setPartyVoucherDate] = useState("");
  const [lossEntry, setLossEntry] = useState("");
  const [lossEntryErr, setLossEntryErr] = useState("");

  //   const [departmentData, setDepartmentData] = useState([]);
  //   const [selectedDepartment, setSelectedDepartment] = useState("");
  //   const [selectedDeptErr, setSelectedDeptErr] = useState("");

  const [stockCodeData, setStockCodeData] = useState([]);
  const [stockCodeFindings, setStockCodeFindings] = useState([]);

  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");
  const [selecetInsit, setselecetInsit] = useState("1");

  // const [vendorStateId, setVendorStateId] = useState("");

  //below table total val field
  const [amount, setAmount] = useState("");

  const [fineGoldTotal, setFineGoldTotal] = useState("");
  const [grossWeightTotal, setGrossWeightTotal] = useState("");
  const [netWeightTotal, setNetWeightTotal] = useState("");

  const [totalGrossWeight, setTotalGrossWeight] = useState("");
  const [totalNetWeight, setTotalNetWeight] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [metalNarration, setMetalNarration] = useState("");
  const [metalNarrationErr, setMetalNarrationErr] = useState("");
  const [narrationFlag, setNarrationFlag] = useState(false);

  // const [selectedIndex, setSelectedIndex] = useState(0);

  const theme = useTheme();

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000); // 10초 뒤에
    }
  }, [loading]);

  useEffect(() => {
    if (props.reportView === "Report") {
      NavbarSetting("Report", dispatch);
    } else if (props.reportView === "Account") {
      NavbarSetting("Accounts", dispatch);
    } else {
      NavbarSetting("Sales", dispatch);
    }
    //eslint-disable-next-line
  }, []);

  const [documentList, setDocumentList] = useState([]);
  const [docModal, setDocModal] = useState(false);
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);
  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 40)
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
      // setVoucherDate(moment().format("YYYY-MM-DD"));
      // setSelectedVendor("");
      // setBalanceRfixData("");
      // setBalRfixViewData([]);
      // setCanEnterVal(false);
      // setOppositeAccSelected("");
      // setPartyVoucherNum("");
      // setFirmName("");
      // setVendorStateId("");
      // setTdsTcsVou("");
      // setLedgerName("");
      // setIs_tds_tcs("");
      // setRateValue("");
      // setLegderAmount("");
      // setFinalAmount("");
      // setAccNarration("");
      // setMetalNarration("");
      // setShortageRfix("");
      // setTempRate("");
      // setAvgeRate("");
      // setTempApiWeight("");
      // setAdjustedRate(false);
      // setPrintObj({
      //   supplierName: "",
      //   supAddress: "",
      //   supplierGstUinNum: "",
      //   supPanNum: "",
      //   supState: "",
      //   supCountry: "",
      //   supStateCode: "",
      //   purcVoucherNum: "",
      //   partyInvNum: "",
      //   voucherDate: moment().format("YYYY-MM-DD"),
      //   placeOfSupply: "",
      //   orderDetails: [],
      //   taxableAmount: "",
      //   sGstTot: "",
      //   cGstTot: "",
      //   iGstTot: "",
      //   roundOff: "",
      //   grossWtTOt: "",
      //   netWtTOt: "",
      //   fineWtTot: "",
      //   totalInvoiceAmt: "",
      //   TDSTCSVoucherNum: "",
      //   legderName: "",
      //   taxAmount: "",
      //   metNarration: "",
      //   accNarration: "",
      //   balancePayable: ""
      // })
      // resetForm();

      // getVoucherNumber();
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
    // console.log("????????????????????????")
    if (
      loadValidation() &&
      partyNameValidation() &&
      partyVoucherNumValidation()
      //  &&voucherSelectedValidation()
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (isView) {
        handlePrint();
      } else {
        if (prevContactIsValid()) {
          addMetalPurchase(false, true);
        } else {
          console.log("prevContactIsValid else");
        }
      }
    } else {
      console.log("else");
    }
  }

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
  });

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
    newFormValues[i].pcs = "";
    newFormValues[i].netWeight = "";
    newFormValues[i].rate = "";
    newFormValues[i].amount = "";
    newFormValues[i].Total = "";

    setFormValues(newFormValues);
  };

  let handleLotNumChange = (i, e) => {
    console.log(e);
    let newFormValues = [...formValues];

    let findIndex = lotdata.findIndex((item) => item.number === e);

    if (findIndex > -1) {
      console.log("===", lotdata[findIndex]);
      newFormValues[i].manuallLot = "1";
      newFormValues[i].lotno = {
        value: lotdata[findIndex].id,
        label: lotdata[findIndex].number,
      };
      newFormValues[i].errors.lotno = null;
      newFormValues[i].purity = lotdata[findIndex].LotMetalStockCode.purity;
      newFormValues[i].grossWeight = parseFloat(
        lotdata[findIndex].total_gross_wgt
      ).toFixed(3);
      newFormValues[i].categoryName = {
        value: lotdata[findIndex].ProductCategory.id,
        label: lotdata[findIndex].ProductCategory.category_name,
      };
      newFormValues[i].pcs = lotdata[findIndex].pcs;
      newFormValues[i].netWeight = parseFloat(
        lotdata[findIndex].total_net_wgt
      ).toFixed(3);
      newFormValues[i].rate = "";
      newFormValues[i].amount = "";
      newFormValues[i].Total = "";

      if (newFormValues[i].netWeight !== "" && newFormValues[i].purity !== "") {
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
      // setFormValues(newFormValues);
    }
  };

  let handleStockGroupFindingChange = (i, e) => {
    console.log(e);
    let newFormValues = [...formValues];
    newFormValues[i].stockCode = {
      value: e.value,
      label: e.label,
      pcs_require: e.pcs_require,
    };
    newFormValues[i].errors.stockCode = null;

    let findIndex = stockCodeFindings.findIndex(
      (item) => item.stock_name_code.id === e.value
    );
    // console.log(findIndex);
    if (findIndex > -1) {
      newFormValues[i].stock_group =
        stockCodeFindings[findIndex].stock_group.item_id;
      newFormValues[i].grossWeight = "";
      newFormValues[i].netWeight = "";
      newFormValues[i].rate = "";
      newFormValues[i].pcs = "";
      newFormValues[i].amount = "";
      newFormValues[i].Total = "";
      newFormValues[i].lotno = "";

      if (stockCodeFindings[findIndex].stock_group.item_id === 1) {
        newFormValues[i].purity =
          stockCodeFindings[findIndex].stock_name_code.purity;
      } else {
        newFormValues[i].purity = "0";
      }

      // if (
      //   newFormValues[i].grossWeight !== "" &&
      //   newFormValues[i].purity !== ""
      // ) {
      //   newFormValues[i].fineGold = parseFloat(
      //     (parseFloat(newFormValues[i].grossWeight) *
      //       parseFloat(newFormValues[i].purity)) /
      //     100
      //   ).toFixed(3);
      // } else {
      //   newFormValues[i].fineGold = "0";
      // }

      newFormValues[i].categoryName = stockCodeFindings[findIndex].stock_name;
      newFormValues[i].errors.categoryName = null;
    }

    // console.log("i", i, "length", formValues.length);
    if (i === formValues.length - 1) {
      // addFormFields();
      changeTotal(newFormValues, true);
    } else {
      changeTotal(newFormValues, false);
      // setFormValues(newFormValues);
    }
    // setAdjustedRate(false);
    // if (adjustedRate === true) {
    //   handleRateValChange();
    // }

    // setTimeout(() => {//disabled text condition here so timeout
    pcsInputRef.current[i].focus();
    // }, 200);
  };

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
    // console.log(findIndex);
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

      // if (
      //   newFormValues[i].grossWeight !== "" &&
      //   newFormValues[i].purity !== ""
      // ) {
      //   newFormValues[i].fineGold = parseFloat(
      //     (parseFloat(newFormValues[i].grossWeight) *
      //       parseFloat(newFormValues[i].purity)) /
      //     100
      //   ).toFixed(3);
      // } else {
      //   newFormValues[i].fineGold = "0";
      // }

      newFormValues[i].categoryName = stockCodeData[findIndex].stock_name;
      newFormValues[i].errors.categoryName = null;
    }

    // console.log("i", i, "length", formValues.length);
    if (i === formValues.length - 1) {
      // addFormFields();
      changeTotal(newFormValues, true);
    } else {
      changeTotal(newFormValues, false);
      // setFormValues(newFormValues);
    }
    // setAdjustedRate(false);
    // if (adjustedRate === true) {
    //   handleRateValChange();
    // }
    // setTimeout(() => {//disabled text condition here so timeout
    pcsInputRef.current[i].focus();
    // }, 200);
  };

  function changeTotal(newFormValues, addFlag) {
    console.log(newFormValues);
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
    console.log("idToBeView", idToBeView);
    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true);
      getArticianReturnRecord(idToBeView.id);
    } else {
      setNarrationFlag(false);
      getVoucherNumber(); //if view only then no need to get new voucher number, we will set data coming from api
    }
    getProductCategories();
    getStockCodeMetal();
    getStockCodeFindingVariant();
    setTimeout(() => {
      if (loadTypeRef.current) {
        console.log("if------------");
        loadTypeRef.current.focus();
      }
    }, 800);
    //eslint-disable-next-line
  }, []);

  function getArticianReturnRecord(id) {
    setLoading(true);
    let api = "";
    if (props.forDeletedVoucher) {
      api = `api/stockJVjobworkarticianreturn/jv/${id}?deleted_at=1`;
    } else {
      api = `api/stockJVjobworkarticianreturn/jv/${id}`;
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
              let loadType = response.data.data.otherDetails.loadType;
              setSelectedLoad(loadType.toString());
              setDocumentList(finalData.salesPurchaseDocs);

              setVoucherNumber(finalData.voucher_no);
              setPartyVoucherDate(finalData.party_voucher_date);
              setAllowedBackDate(true);
              setVoucherDate(finalData.purchase_voucher_create_date);
              setSelectedJobWorker({
                value: finalData.stockJVJobWorker.id,
                label: finalData.stockJVJobWorker.name,
              });
              setFirmName(finalData.stockJVJobWorker.firm_name);

              setPartyVoucherNum(finalData.party_voucher_no);
              setselecetInsit(finalData.loss_entry !== null ? "2" : "1");
              setLossEntry(finalData.loss_entry)
              
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

              let tempArray = [];

              if (loadType == 0 || loadType == 1) {
                // console.log(OrdersData);
                for (let item of finalData.stockJVJobWorkArticianReturnOrder) {
                  // console.log(item);
                  tempArray.push({
                    stockCode: {
                      value: item.stockJVStockNameCode.id,
                      label: item.stockJVStockNameCode.stock_code,
                    },
                    categoryName: item.stock_name,
                    // selectedHsn: item.StockNameCode.stock_name_code.hsn_master.hsn_number,
                    grossWeight: parseFloat(item.gross_weight).toFixed(3),
                    pcs: item.pcs,
                    netWeight: parseFloat(item.net_weight).toFixed(3),
                    purity: item.purity,
                    fineGold: parseFloat(item.finegold).toFixed(3),
                    rate: parseFloat(item.rate_of_fine_gold).toFixed(3),
                    amount: parseFloat(item.amount).toFixed(3),
                  });
                }
                setFormValues(tempArray);
              } else if (loadType == 2) {
                for (let item of finalData.stockJVJobWorkArticianReturnOrder) {
                  // console.log(item);
                  tempArray.push({
                    lotno: {
                      value: item.Lot.id, 
                      label: item.Lot.number,
                    },
                    categoryName: {
                      value: item.Category.id,
                      label: item.Category.category_name,
                    },
                    grossWeight: parseFloat(item.gross_weight).toFixed(3),
                    netWeight: parseFloat(item.net_weight).toFixed(3),
                    pcs: item.pcs,
                    purity: item.purity,
                    fineGold: parseFloat(item.finegold).toFixed(3),
                    rate: parseFloat(item.rate_of_fine_gold).toFixed(3),
                    amount: parseFloat(item.amount).toFixed(3),
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
              function netWeight(item) {
                // console.log(parseFloat(item.netWeight));
                return parseFloat(item.netWeight);
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
              setGrossWeightTotal(parseFloat(tempGrossWtTot).toFixed(3));

              let tempNetWtTot = tempArray
                .filter((item) => item.netWeight !== "")
                .map(netWeight)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setNetWeightTotal(parseFloat(tempNetWtTot).toFixed(3));

              let tempFineGold = tempArray
                .filter((item) => item.fineGold !== "")
                .map(fineGold)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
              setIsVoucherSelected(true);
              console.log(finalData, "finalData33333");
              setPrintObj({
                ...printObj,
                // is_tds_tcs: finalData.is_tds_tcs,
                // stateId: clientVendorState,
                loadType: loadType.toString(),
                supplierName: finalData.stockJVJobWorker.firm_name,
                supAddress: finalData.stockJVJobWorker.address,
                supplierGstUinNum:
                  finalData.stockJVJobWorker.gst_number === null
                    ? "-"
                    : finalData.stockJVJobWorker.gst_number,
                supPanNum: finalData.stockJVJobWorker.pan_number,
                supState: finalData.stockJVJobWorker.state_name.name
                  ? finalData.stockJVJobWorker.state_name.name
                  : finalData.stockJVJobWorker.state_name.name,
                supCountry: finalData.stockJVJobWorker.country_name.name
                  ? finalData.stockJVJobWorker.country_name.name
                  : finalData.stockJVJobWorker.country_name.name,
                supStateCode:
                  finalData.stockJVJobWorker.gst_number === null
                    ? "-"
                    : finalData.stockJVJobWorker.gst_number.substring(0, 2),
                purcVoucherNum: finalData.voucher_no,
                partyInvNum: finalData.party_voucher_no,
                voucherDate: moment(
                  finalData.purchase_voucher_create_date
                ).format("DD-MM-YYYY"),
                placeOfSupply: finalData.stockJVJobWorker.state_name.name
                  ? finalData.stockJVJobWorker.state_name.name
                  : finalData.stockJVJobWorker.state_name.name,
                orderDetails: tempArray,
                taxableAmount: parseFloat(tempAmount).toFixed(3),
                roundOff:
                  finalData.round_off === null ? "0" : finalData.round_off,
                grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
                netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
                fineWtTot: parseFloat(tempFineGold).toFixed(3),
                totalInvoiceAmt: parseFloat(
                  finalData.final_invoice_amount
                ).toFixed(3),
                // taxAmount: Math.abs(parseFloat(parseFloat(finalData.final_invoice_amount) - parseFloat(finalData.total_invoice_amount)).toFixed(3)),
                metalNarration:
                  finalData.metal_narration !== null
                    ? finalData.metal_narration
                    : "",
                accNarration:
                  finalData.account_narration !== null
                    ? finalData.account_narration
                    : "",
                totalAmount: parseFloat(finalData.final_invoice_amount).toFixed(
                  3
                ),
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

        handleError(error, dispatch, {
          api: api,
        });
      });
  }

  function getStockCodeFindingVariant() {
    axios
      .get(Config.getCommonUrl() + "api/stockname/findingvariant")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockCodeFindings(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/stockname/findingvariant" });
      });
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchData) {
        // if (isVoucherSelected) {
        getLotData(searchData);
        // } else {
        // setLotData([]);
        // dispatch(
        //   Actions.showMessage({
        //     message: "Please Select Proper Voucher to get Lot Details",
        //   })
        // );
        // }
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
      .post(Config.getCommonUrl() + "api/jobWorkArticianIssue/lot/list", data)
      // axios
      //   .post(
      //     Config.getCommonUrl() +
      //     "api/jobWorkArticianIssue/lot/list",
      //     data
      //     // `api/lot/department/artician/${window.localStorage.getItem(
      //     //   "SelectedDepartment"
      //     // )}/${sData}` //"api/jobWorkArticianIssue/lot/" +selectedVoucher
      //   )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          if (response.data.data.length > 0) {
            setLotData(response.data.data);
          } else {
            dispatch(
              Actions.showMessage({
                message: "Please Select Proper Voucher to get Lot Details",
              })
            );
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/jobWorkArticianIssue/lot/list",
          body: data,
        });
      });
  }

  function getProductCategories() {
    axios
      .get(Config.getCommonUrl() + "api/productcategory/all/list")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProductCategory(response.data.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/productcategory/all/list" });
      });
  }

  function getVoucherNumber() {
    axios
      .get(Config.getCommonUrl() + "api/stockJVjobworkarticianreturn/jv/get/voucher")
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
          api: "api/stockJVjobworkarticianreturn/jv/get/voucher",
        });
      });
  }

  function getStockCodeMetal() {
    axios
      .get(Config.getCommonUrl() + "api/stockname/metal")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockCodeData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/stockname/metal" });
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
        handleError(error, dispatch, { api: "api/jobworker/listing/listing" });
      });
  }

  let handleCategoryChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i].categoryName = {
      value: e.value,
      label: e.label,
    };
    newFormValues[i].errors.categoryName = null;

    // newFormValues[i].grossWeight = "";
    // newFormValues[i].netWeight = "";
    // newFormValues[i].rate = "";
    // newFormValues[i].amount = "";
    // newFormValues[i].Total = "";

    // if (newFormValues[i].grossWeight !== "" && newFormValues[i].purity !== "") {
    //   newFormValues[i].fineGold =
    //     (parseFloat(newFormValues[i].grossWeight) *
    //       parseFloat(newFormValues[i].purity)) /
    //     100;
    // } else {
    //   newFormValues[i].fineGold = "";
    // }
    setFormValues(newFormValues);
    // changeTotal(newFormValues, false);
  };

  function handleInputChange(event) {
    // console.log("handleInputChange");

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    // console.log("name",name,"value",value);

    if (name === "voucherNumber") {
      setVoucherNumber(value);
      setVoucherNumErr("");
    } else if (name === "partyVoucherNum") {
      setPartyVoucherNum(value);
      setPartyVoucherNumErr("");
      setPrintObj({
        ...printObj,
        partyInvNum: value,
      });
    } else if (name === "voucherDate") {
      setVoucherDate(value);
      setVoucherDtErr("");
      setPrintObj({
        ...printObj,
        voucherDate: moment(value).format("DD-MM-YYYY"),
      });
    } else if (name === "lossInsert" && !isNaN(value)) {
      setLossEntry(value);
      setLossEntryErr("");
    }else if (name === "metalNarration") {
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
    if (selectedJobWorker === "") {
      setSelectedJobWorkerErr("Please Select Job Worker");
      return false;
    }
    return true;
  }

  function partyVoucherNumValidation() {
    // const Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (partyVoucherNum === "") {
      setPartyVoucherNumErr("Enter Valid Voucher Number");
      return false;
    }
    return true;
  }

  // function rateFixValidation() {
  //   if (rateFixSelected === "") {
  //     setSelectedRateFixErr("Please select Rate Fix Entry");
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

  function voucherSelectedValidation() {
    if (selectedVoucher === "") {
      setSelectVoucherErr("Please Select Voucher");
      return false;
    }
    return true;
  }
  function lossEntryValidation() {
    if (lossEntry === "") {
      setLossEntryErr("Please Enter Loos Entry");
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
      partyNameValidation() &&
      partyVoucherNumValidation() &&
      voucherSelectedValidation() &&
      (selecetInsit == 2 ? lossEntryValidation() : true)
      //   && tcsTdsVoucValidation()
      //  && rateFixValidation()
    ) {
      console.log("if");
      if (prevContactIsValid()) {
        addMetalPurchase(true, false);
      } else {
        console.log("prevContactIsValid else");
      }
    } else {
      console.log("else");
    }
  }

  function addMetalPurchase(resetFlag, toBePrint) {
    console.log("fineGoldTotal", fineGoldTotal);

    const path = selecetInsit == 2 ? "api/stockJVjobworkarticianreturn/jv/lossentry/create" : "api/stockJVjobworkarticianreturn/jv";

    if (isVoucherSelected === false) {
      setSelectVoucherErr("Please Select Voucher");
      // dispatch(Actions.showMessage({ message: "Please Add remaining rate" }));
      console.log("if");
      return;
    }
    
    let Orders = formValues
      .filter((element) => element.grossWeight !== "")
      .map((x) => {
        if (selectedLoad === "2") {
          if (x.manuallLot === "0") {
            return {
              lot_no: x.lotno.label,
              category_id: x.categoryName.value,
              purity: x.purity,
              rate_of_fine_gold: x.rate,
              gross_weight: x.grossWeight,
              pcs: x.pcs,
              net_weight: x.netWeight,
            };
          } else {
            return {
              lot_id: x.lotno.value,
              rate_of_fine_gold: x.rate,
            };
          }
          // return {
          //   gross_weight: x.grossWeight,
          //   rate_of_fine_gold: x.rate,
          //   category_id: x.categoryName.value,
          //   // lot_no: x.lotno,
          //   purity: x.purity,
          //   ...(x.manuallLot === "0" && {
          //     //userAdded value not from search
          //     lot_no: voucherDate,
          //   }),
          //   lot_id: x.lotno.hasOwnProperty("value") ? x.lotno.value : x.lotno,
          // };
        } else {
          return {
            stock_name_code_id: x.stockCode.value,
            gross_weight: x.grossWeight,
            rate_of_fine_gold: x.rate,
            pcs: x.pcs,
          };
        }
      });
    console.log(Orders);
    if (selecetInsit == 1) {
      if (Orders.length === 0) {
        dispatch(Actions.showMessage({ message: "Please Add Entry" }));
        return;
      }
    }
    // return;
    setLoading(true);

    const body = {
      party_voucher_no: partyVoucherNum,
      // opposite_account_id: 1, //oppositeAccSelected.value,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      jobworker_id: selectedJobWorker.value,
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      // ...(selectedLoad === "2" && {
      is_lot: selectedLoad === "2" ? 1 : 0,
      // }),
      voucherId: selectedVoucher,
      metal_narration: metalNarration,
      account_narration: accNarration,
      ...(selecetInsit == 1
        ? {
          voucher_no: voucherNumber,
          Orders: Orders,
          uploadDocIds: docIds,
          }
        : {}),
      party_voucher_date: partyVoucherDate,
      ...(selecetInsit == 2
        ? {
            loss_entry: parseFloat(lossEntry),
            // opposite_account_id: 1,
            // round_off: 5,
          }
        : {})
      
    };
    console.log(body);
    axios
      .post(Config.getCommonUrl() + path, body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id

          dispatch(Actions.showMessage({ message: response.data.message }));
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
            //printing after save, so print popup will be displayed after successfully saving record
            handlePrint();
          }
        } else {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);
        handleError(error, dispatch, {
          api: path,
          body: body,
        });
      });
  }

  function resetForm(flag) {
    setAmount("");
    setTotalGrossWeight("");
    setFineGoldTotal("");
    setIsVoucherSelected(false);
    setVoucherApiData([]);
    setSelectedVoucher("");

    if (flag === true) {
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
    } else {
      let newFormValues = formValues.map((x) => {
        return {
          ...x,
          rate: "",
          amount: "",
        };
      });
      // console.log(newFormValues)
      changeTotal(newFormValues, false);
    }
  }

  function handlePartyChange(value) {
    console.log(value);
    setSelectedJobWorker(value);
    setSelectedJobWorkerErr("");

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
    console.log(index);

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

      setPrintObj({
        ...printObj,
        stateId: jobworkerData[index].state_name.id,
        loadType: selectedLoad,
        supplierName: jobworkerData[index].firm_name,
        supAddress: jobworkerData[index].address,
        supplierGstUinNum:
          jobworkerData[index].gst_number === null
            ? jobworkerData[index].gst_type
            : jobworkerData[index].gst_number,
        supPanNum: jobworkerData[index].pan_number,
        supState: jobworkerData[index].state_name.name,
        supCountry: jobworkerData[index].country_name.name,
        supStateCode:
          jobworkerData[index].gst_number === null
            ? "-"
            : jobworkerData[index].gst_number.substring(0, 2),
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
      });
    }

    getVouchers(value.value);
  }

  //url change
  function getVouchers(jobworkerId) {
    setVoucherApiData([]);
    let data = {
      jobworker_id: jobworkerId,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      flag: selectedLoad === "2" ? 1 : 0,
    };
    axios
      .post(
        Config.getCommonUrl() +
          // `api/jobworkarticianissue/jobworker/${jobworkerId}`
          "api/stockJVjobWorkArticianIssue/jv/jobworker/jobworker",
        data
      )
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          let Data = response.data.data;
          let tempArray = [];
          for (let item of Data) {
            // console.log(item);
            tempArray.push({
              id: item.id,
              voucher_no: item.voucher_no,
              party_voucher_no: item.party_voucher_no,
              utilize: (
                parseFloat(item.finegold).toFixed(3) -
                parseFloat(item.balance).toFixed(3)
              ).toFixed(3),
              balance: parseFloat(item.balance).toFixed(3),
              rate: parseFloat(item.rate).toFixed(3),
              finegold: parseFloat(item.finegold).toFixed(3),
              amount: (
                parseFloat(item.rate) *
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
        console.log("handle error=====");
        handleError(error, dispatch, {
          api: "api/stockJVjobWorkArticianIssue/jv/jobworker/jobworker",
          body: data,
        });
      });
  }

  // function handleRateValChange() {
  //   formValues
  //     .filter((element) => element.stockCode !== "")
  //     .map((item, i) => {
  //       let newFormValues = [...formValues];

  //       if (newFormValues[i].stockCode !== "") {
  //         if (
  //           newFormValues[i].grossWeight !== "" &&
  //           newFormValues[i].purity !== ""
  //         ) {
  //           newFormValues[i].fineGold = parseFloat(
  //             (parseFloat(newFormValues[i].grossWeight) *
  //               parseFloat(newFormValues[i].purity)) /
  //             100
  //           ).toFixed(3);
  //         }

  //         if (
  //           newFormValues[i].rate !== "" &&
  //           newFormValues[i].fineGold !== ""
  //         ) {
  //           // newFormValues[i].amount = parseFloat(
  //           //   (parseFloat(newFormValues[i].rate) *
  //           //   parseFloat(newFormValues[i].fineGold))/10
  //           // ).toFixed(3);
  //           if (newFormValues[i].stock_group === 1) {
  //             newFormValues[i].amount = parseFloat(
  //               (parseFloat(newFormValues[i].rate) *
  //                 parseFloat(newFormValues[i].fineGold)) /
  //               10
  //             ).toFixed(3);
  //           } else {
  //             newFormValues[i].amount = parseFloat(
  //               (parseFloat(newFormValues[i].rate) *
  //                 parseFloat(newFormValues[i].netWeight))
  //             ).toFixed(3);
  //           }
  //         }

  //         function amount(item) {
  //           // console.log(item.amount)
  //           return item.amount;
  //         }

  //         function grossWeight(item) {
  //           // console.log(parseFloat(item.grossWeight));
  //           return parseFloat(item.grossWeight);
  //         }

  //         function fineGold(item) {
  //           return parseFloat(item.fineGold);
  //         }

  //         let tempFineGold = formValues
  //           .filter((item) => item.fineGold !== "")
  //           .map(fineGold)
  //           .reduce(function (a, b) {
  //             // sum all resulting numbers
  //             return parseFloat(a) + parseFloat(b);
  //           }, 0);

  //         setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
  //         // console.log(formValues.map(amount).reduce(sum))

  //         let tempAmount = formValues
  //           .filter((item) => item.amount !== "")
  //           .map(amount)
  //           .reduce(function (a, b) {
  //             // sum all resulting numbers
  //             return parseFloat(a) + parseFloat(b);
  //           }, 0);
  //         //.reduce(sum);
  //         // console.log("tempAmount>>>",tempAmount.toFixed(3))
  //         setAmount(parseFloat(tempAmount).toFixed(3));

  //         setTotalGrossWeight(
  //           parseFloat(formValues
  //             .filter((data) => data.grossWeight !== "")
  //             .map(grossWeight)
  //             .reduce(function (a, b) {
  //               // sum all resulting numbers
  //               return parseFloat(a) + parseFloat(b);
  //             }, 0)).toFixed(3)
  //         );

  //         setFormValues(newFormValues);
  //       }
  //       return true;
  //     });
  // }

  // function handleOppAccChange(value) {
  //   setOppositeAccSelected(value);
  //   setSelectedOppAccErr("");
  // }

  const prevContactIsValid = () => {
    if (formValues.length === 0) {
      return true;
    }

    let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

    const someEmpty = formValues
      .filter((element) =>
        selectedLoad === "2" ? element.lotno !== "" : element.stockCode !== ""
      )
      .some((item) => {
        if (selectedLoad === "2") {
          return (
            item.categoryName === "" ||
            item.grossWeight === "" ||
            item.grossWeight == 0 ||
            item.netWeight === "" ||
            item.netWeight == 0 ||
            item.rate === "" ||
            item.rate == 0 ||
            percentRegex.test(item.rate) === false ||
            item.lotno === "" ||
            item.purity === "" ||
            percentRegex.test(item.purity) === false
          );
        } else {
          return (
            item.stockCode === "" ||
            item.categoryName === "" ||
            item.grossWeight === "" ||
            item.grossWeight == 0 ||
            item.netWeight === "" ||
            item.netWeight == 0 ||
            item.rate === "" ||
            item.rate == 0 ||
            percentRegex.test(item.rate) === false ||
            (item.stockCode.pcs_require === 1 &&
              (item.pcs === "" || isNaN(item.pcs)))
            // (item.stock_group !== 1 && item.pcs === "")
          );
        }
      });

    if (someEmpty) {
      formValues
        .filter((element) =>
          selectedLoad === "2" ? element.lotno !== "" : element.stockCode !== ""
        )
        .map((item, index) => {
          const allPrev = [...formValues];
          // console.log(item);
          if (selectedLoad === "2") {
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

          let Rate = formValues[index].rate;
          if (!Rate || weightRegex.test(Rate) === false || Rate == 0) {
            allPrev[index].errors.rate = "Enter Valid Rate!";
          } else {
            allPrev[index].errors.rate = null;
          }

          // if (
          //   formValues[index].stock_group !== 1 &&
          //   formValues[index].pcs === ""
          // ) {
          //   allPrev[index].errors.pcs = "Enter Valid Pcs";
          // } else {
          //   allPrev[index].errors.pcs = null;
          // }
          let pcsTotal = formValues[index].pcs;
          let stockCode = formValues[index].stockCode;
          console.log("stock", stockCode);
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
          // console.log(allPrev[index]);
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
    newFormValues[i].errors[e.target.name] = null;

    let nm = e.target.name;
    let val = e.target.value;

    if(nm === "pcs" && isNaN(val)) {
      newFormValues[i].errors.pcs = "Enter valid pcs"
    }

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
      }
      // newFormValues[i].netWeight = val;
      if (selectedLoad !== "2") {
        newFormValues[i].netWeight = parseFloat(val).toFixed(3);
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

    // console.log("rate", newFormValues[i].rate);
    if (newFormValues[i].rate === "") {
      newFormValues[i].amount = "";
    }

    if (newFormValues[i].rate !== "" && newFormValues[i].fineGold !== "") {
      // newFormValues[i].amount = parseFloat(
      //   (parseFloat(newFormValues[i].rate) *
      //   parseFloat(newFormValues[i].fineGold))/10
      // ).toFixed(3);
      if (newFormValues[i].stock_group === 1) {
        newFormValues[i].amount = parseFloat(
          (parseFloat(newFormValues[i].rate) *
            parseFloat(newFormValues[i].fineGold)) /
            10
        ).toFixed(3);
      } else {
        newFormValues[i].amount = parseFloat(
          parseFloat(newFormValues[i].rate) *
            parseFloat(newFormValues[i].netWeight)
        ).toFixed(3);
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
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.netWeight);
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

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));
    let tempFineGold = newFormValues
      .filter((item) => item.fineGold !== "")
      .map(fineGold)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
    function totalAmount(item) {
      return parseFloat(item.final_invoice_amount);
    }
    function amount(item) {
      // console.log(item.amount)
      return item.amount;
    }
    // let tempAmount = newFormValues
    //   .filter((item) => item.amount !== "")
    //   .map(amount)
    //   .reduce(function (a, b) {
    //     // sum all resulting numbers
    //     return parseFloat(a) + parseFloat(b);
    //   }, 0);
    //.reduce(sum);
    // console.log("tempAmount",tempAmount)
    // setAmount(parseFloat(tempAmount).toFixed(3));

    setFormValues(newFormValues);

    // if (adjustedRate === true) {
    // handleRateValChange();
    // }

    setPrintObj({
      ...printObj,
      orderDetails: newFormValues,
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      fineWtTot: parseFloat(tempFineGold).toFixed(3),
      // amount: parseFloat(tempAmount).toFixed(3),
      // sGstTot: parseFloat(tempSgstVal).toFixed(3),
      // cGstTot: parseFloat(tempCgstVal).toFixed(3),
      // iGstTot: parseFloat(tempIgstVal).toFixed(3),
      totalInvoiceAmt: parseFloat(tempAmount).toFixed(3),
      totalAmount: parseFloat(tempAmount).toFixed(3),
    });
  };

  function deleteHandler(index) {
    console.log(index);
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
      // console.log(item.amount)
      return item.amount;
    }

    function grossWeight(item) {
      // console.log(parseFloat(item.grossWeight));
      return parseFloat(item.grossWeight);
    }
    function netWeight(item) {
      // console.log(parseFloat(item.grossWeight));
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

    setTotalNetWeight(parseFloat(tempNetWtTot).toFixed(3));
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
    setPrintObj({
      ...printObj,
      orderDetails: newFormValues,
      grossWtTOt: parseFloat(tempGrossWtTot).toFixed(3),
      netWtTOt: parseFloat(tempNetWtTot).toFixed(3),
      fineWtTot: parseFloat(tempFineGold).toFixed(3),
      // amount: parseFloat(tempAmount).toFixed(3),
      totalInvoiceAmt: parseFloat(tempAmount).toFixed(3),
      totalAmount: parseFloat(tempAmount).toFixed(3),
    });
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
    });

    setSelectedJobWorker("");
    // setOppositeAccSelected("");
    setPartyVoucherNum("");
    // setSelectedDepartment("");
    setFirmName("");
    setFirmNameErr("");
    setAccNarration("");
    setMetalNarration("");
    // setSelectedIndex(0);
    resetForm(true);
  }

  function handleSelectVoucher() {
    setvoucherModalOpen(true);
  }

  function handleVoucherModalClose() {
    // console.log("handle close", callApi);
    setvoucherModalOpen(false);
  }

  function handleVoucherSubmit() {
    setvoucherModalOpen(false);
  }

  // function handleVoucherSelect(id) {
  //   console.log("handleVoucherSelect", id);
  //   setIsVoucherSelected(true);
  //   setSelectedVoucher(id);
  //   setSelectVoucherErr("");
  //   // setvoucherModalOpen(false);
  // }
  const handleVoucherSelect = (event) => {
    const RowData = JSON.parse(event.target.value);
    console.log("handleVoucherSelect", RowData.id);
    // console.log("RowData", RowData);

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
    if (nm === "grossWeight" && selectedLoad !== "2") {
      newFormValues[i].grossWeight = parseFloat(val).toFixed(3);
      newFormValues[i].netWeight = parseFloat(val).toFixed(3);
    }
    if (nm === "netWeight") {
      newFormValues[i].netWeight = parseFloat(val).toFixed(3);
    }
    if (nm === "grossWeight" && selectedLoad === "2") {
      newFormValues[i].grossWeight = parseFloat(val).toFixed(3);
      // newFormValues[i].netWeight = parseFloat(val).toFixed(3)
    }
    if (nm === "rate") {
      newFormValues[i].rate = parseFloat(val).toFixed(3);
    }
    setFormValues(newFormValues);
  };
  const handleNarrationClick = () => {
    console.log("handleNarr", narrationFlag);
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        flag: 40,
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
  const handleChangeRadio = (e) => {
    setselecetInsit(e.target.value);
  };

  return (
    <div
      className={clsx(classes.root, props.className, "w-full")}
      id="metalpurchase-main"
    >
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0"  style={{ marginTop: "30px" }}>
            {!props.viewPopup && (
              <Grid
                container
                alignItems="center"
                style={{ paddingInline: "30px" }}
              >
                <Grid item xs={7} sm={7} md={7} key="1">
                  <FuseAnimate delay={300}>
                    <Typography className="text-18 font-700">
                      {isView
                        ? "View Artician Return Metal (Stock Journal Voucher)"
                        : "Add Artician Return Metal (Stock Journal Voucher)"}
                    </Typography>
                  </FuseAnimate>
                </Grid>
                <Grid
                  item
                  xs={5}
                  sm={5}
                  md={5}
                  key="2"
                  className="btn-back"
                  style={{ textAlign: "right", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="contained"
                    id="btn-back"
                    size="small"
                    onClick={(event) => {
                      History.goBack();
                    }}
                  >
                    Back
                  </Button>
                </Grid>
              </Grid>
            )}

            {loading && <Loader />}
            <div className="main-div-alll" style={{ marginTop: "20px" }}>
            <div
              // className="pt-16"
              // style={{ marginBottom: "10%", height: "90%" }}
            >
              <div>
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  onSubmit={handleFormSubmit}
                >
                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid
                      item
                      lg={2}
                      md={4}
                      sm={4}
                      xs={12}
                    >
                      <p>Select Load type</p>
                      <select
                        className={clsx(classes.normalSelect, "focusClass")}
                        required
                        value={selectedLoad}
                        onChange={(e) => handleLoadChange(e)}
                        disabled={isView}
                        ref={loadTypeRef}
                      >
                        <option hidden value="">
                          Select Load type
                        </option>
                        <option value="0">Load Metal Variant </option>
                        <option value="1">Load Finding Variant</option>
                        <option value="2">Load Lot directly</option>
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
                      >
                        <p>Voucher Date</p>
                        <TextField
                          // label="Date"
                          type="date"
                          name="voucherDate"
                          // onKeyDown={(e => e.preventDefault())}
                          value={moment(voucherDate).format("YYYY-MM-DD")}
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
                    >
                      <p>Voucher Number</p>
                      <TextField
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
                    >
                      <p>Party Name</p>
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
                        placeholder="Party Name"
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
                      <p>Firm Name</p>
                      <TextField
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
                    >
                      <p>Party Voucher Number</p>
                      <TextField
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
                    >
                      <p>Party Voucher Date</p>
                      <TextField
                        placeholder="Party Voucher Date"
                        type="date"
                        // onKeyDown={(e => e.preventDefault())}
                        name="partyVoucherDate"
                        value={partyVoucherDate}
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
                      >
                        <p>Upload Document</p>
                        <TextField
                          className="uploadDoc"
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
                      style={{ position: "relative" }}
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
                      <span style={{ color: "red", position: "absolute", bottom: "12px", left: 6, fontSize: 9 }}>
                        {selectVoucherErr.length > 0 ? selectVoucherErr : ""}
                      </span>
                    </Grid>
                    <Grid
                      item
                    >
                      <FormControl
                        component="fieldset"
                        className={classes.formControl}
                        disabled={isView}
                      >
                        {/* <FormLabel component="legend">Country :</FormLabel> */}
                        <RadioGroup
                          aria-label="country"
                          name="is_indian"
                          className={classes.group}
                          value={selecetInsit}
                          onChange={(e) => handleChangeRadio(e)}
                        >
                          <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="Grid Insert"
                          />
                          <FormControlLabel
                            value="2"
                            control={<Radio />}
                            label="Loss Insert"
                          />
                        </RadioGroup>
                        {/* <span style={{ color: "red" }}>
                            {element.errors !== undefined
                              ? element.errors.is_indian
                              : ""}
                          </span> */}
                      </FormControl>
                    </Grid>
                    {
                      selecetInsit == "2" ? (<Grid
                      item
                      lg={2}
                      md={4}
                      sm={4}
                      xs={12}
                      style={{ position: "relative" }}
                    >
                      <p>Loss Insert</p>
                      <TextField
                        placeholder="Loss Insert"
                        name="lossInsert"
                        value={lossEntry}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                        disabled={isView}
                        error={lossEntryErr.length > 0 ? true : false}
                        helperText={lossEntryErr}
                      />
                    </Grid>) : null
                    }
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
                          <Table className={classes.table}>
                            <TableHead>
                              <TableRow>
                                {/* <TableCell
                          className={classes.tableRowPad}
                          align="center"
                        >
                        </TableCell> */}

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
                                voucherApiData
                                  .filter(
                                    (voucherData) =>
                                      selectedVoucher === voucherData.id
                                  )
                                  .map((row, index) => (
                                    <TableRow
                                      key={index}
                                      // onClick={(e) =>
                                      //   handleVoucherSelect(row.id, row.voucher_no)
                                      // }
                                      // className={classes.hoverClass}
                                    >
                                      {/* <TableCell align="center" className={classes.tableRowPad}>
                              <Checkbox name="selectVoucher" value={JSON.stringify({ id: row.id, voucherNum: row.voucher_no })} onChange={handleVoucherSelect} checked={selectedVoucher.includes(row.id) ? true : false} />
                            </TableCell> */}
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
                  </Grid>
                  {selecetInsit === "1" ? (
                    <div className="table_full_width addarticianresturn_tabel-blg tbel_addartician_return_tbel">
                      <div
                        className="mt-16 table-metal-purchase view_artician_return_tbel  "
                        style={{
                          border: "1px solid #ebeefb",
                          paddingBottom: 5,
                        }}
                      >
                        <div
                          className="metal-tbl-head "
                          style={{ background: "#ebeefb", fontWeight: "700" }}
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
                          {selectedLoad === "2" && (
                            <div className={classes.tableheader}>
                              Lot Number
                            </div>
                          )}
                          {(selectedLoad === "0" || selectedLoad === "1") && (
                            <div className={classes.tableheader}>
                              Category Variant
                            </div>
                          )}
                          {(selectedLoad === "0" ||
                            selectedLoad === "1" ||
                            selectedLoad === "2") && (
                            <div className={clsx(classes.tableheader, "")}>
                              Category Name
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
                            className=" castum-row-dv artician-select-input-main"
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
                                  <Icon className="" style={{ color: "red" }}>
                                    delete
                                  </Icon>
                                </IconButton>
                              </div>
                            )}
                            {selectedLoad === "2" && (
                              // <IntegrationAutosuggest lotdata={lotdata}/>
                              <>
                              <Autocomplete
                                id="free-solo-demo"
                                freeSolo
                                onChange={(event, newValue) => {
                                  console.log("onChange", newValue);
                                  // setValue(newValue);
                                  if (!isView)
                                    handleLotNumChange(index, newValue);
                                }}
                                onInputChange={(event, newInputValue) => {
                                  console.log("onInputChange", newInputValue);

                                  if (!isView && newInputValue !== "") {
                                    //causing problem when view its on change and other api is being called, no need to call
                                    setSearchData(newInputValue);
                                    handleManualLotNoChange(
                                      index,
                                      newInputValue
                                    );
                                  }
                                  // setInputValue(newInputValue);
                                }}
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
                                disabled={isView}
                                options={lotdata.map((option) => option.number)}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
                                    style={{ padding: 0 }}
                                  />
                                )}
                              />
                              {/* <span style={{ color: "red" }}>
                                {element.errors !== undefined
                                  ? element.errors.lotno
                                  : ""}
                              </span> */}
                              </>
                              // <>
                              //   <Select
                              //     filterOption={createFilter({
                              //       ignoreAccents: false,
                              //     })}
                              //     className={classes.selectBox}
                              //     classes={classes}
                              //     styles={selectStyles}
                              //     options={lotdata.map((suggestion) => ({
                              //       value: suggestion.Lot.id,
                              //       label: suggestion.Lot.number,
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
                              //   />
                              //   <span style={{ color: "red" }}>
                              //     {element.errors !== undefined
                              //       ? element.errors.lotno
                              //       : ""}
                              //   </span>
                              // </>
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
                                  options={stockCodeData.map((suggestion) => ({
                                    value: suggestion.stock_name_code.id,
                                    label:
                                      suggestion.stock_name_code.stock_code,
                                    pcs_require:
                                      suggestion.stock_name_code
                                        .stock_description.pcs_require,
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
                              </>
                            )}

                            {selectedLoad === "1" && (
                              <>
                                <Select
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  className={classes.selectBox}
                                  classes={classes}
                                  styles={selectStyles}
                                  options={stockCodeFindings.map(
                                    (suggestion) => ({
                                      value: suggestion.stock_name_code.id,
                                      label:
                                        suggestion.stock_name_code.stock_code,
                                      pcs_require:
                                        suggestion.stock_name_code
                                          .stock_description.pcs_require,
                                    })
                                  )}
                                  // components={components}
                                  value={
                                    element.stockCode !== ""
                                      ? element.stockCode.value === ""
                                        ? ""
                                        : element.stockCode
                                      : ""
                                  }
                                  onChange={(e) => {
                                    handleStockGroupFindingChange(index, e);
                                  }}
                                  placeholder="Stock Code"
                                  isDisabled={isView}
                                />

                                {element.errors !== undefined &&
                                element.errors.stockCode !== null ? (
                                  <span style={{ color: "red" }}>
                                    {element.errors.stockCode}
                                  </span>
                                ) : (
                                  ""
                                )}
                              </>
                            )}

                            {selectedLoad === "2" && (
                              <>
                                <Select
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  className={classes.selectBox}
                                  classes={classes}
                                  styles={selectStyles}
                                  options={productCategory.map(
                                    (suggestion) => ({
                                      value: suggestion.id,
                                      label: suggestion.category_name,
                                    })
                                  )}
                                  // components={components}
                                  value={
                                    element.categoryName !== ""
                                      ? element.categoryName.value === ""
                                        ? ""
                                        : element.categoryName
                                      : ""
                                  }
                                  onChange={(e) => {
                                    handleCategoryChange(index, e);
                                  }}
                                  placeholder="Category Name"
                                  isDisabled={isView}
                                />
                                <span style={{ color: "red" }}>
                                  {element.errors !== undefined
                                    ? element.errors.categoryName
                                    : ""}
                                </span>
                              </>
                            )}

                            {(selectedLoad === "0" || selectedLoad === "1") && (
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
                            )}

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
                              disabled={isView || selectedLoad == "2"}
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
                              disabled={isView || selectedLoad == "2"}
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
                              onChange={(e) => handleChange(index, e)}
                              variant="outlined"
                              fullWidth
                              disabled
                            />
                            <TextField
                              name="rate"
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
                            />
                            <TextField
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
                              style={{background: "#ebeefb"}}
                            >
                              {/* action */}
                            </div>
                          )}
                          {(selectedLoad === "0" || selectedLoad === "1" || selectedLoad === "2") && (
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
                            </>
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
                  ) : (
                    ""
                  )}
                </form>

                <div className="textarea-row">
                  <div style={{ width: "50%" }} className="mt-16 mr-2">
                    <p>Metal Narration</p>
                    <TextField
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
                      // disabled={isView}
                      disabled={narrationFlag}
                    />
                  </div>
                  <div style={{ width: "50%" }} className="mt-16 ml-2">
                    <p>Account Narration</p>
                    <TextField
                      placeholder="Account Narration"
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
                        className="w-224 mx-auto mt-16 "
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
                      className="w-224 mx-auto mt-16 mr-16"
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
                        className="w-224 mx-auto mt-16 mr-16"
                        aria-label="Register"
                        onClick={() => handleNarrationClick()}
                      >
                        {!narrationFlag ? "Save Narration" : "Update Narration"}
                      </Button>
                    )}
                    <div style={{ display: "none" }}>
                      <ArticianReturnPrintComp
                        ref={componentRef}
                        printObj={printObj}
                      />
                    </div>
                  </div>
                )}
                {isView && (
                  <Button
                    variant="contained"
                    className={classes.button}
                    onClick={() => setDocModal(true)}
                    style={{marginTop: 16, marginLeft: 0}}
                  >
                    View Documents
                  </Button>
                )}
              </div>
            </div>

            <ViewDocModal
              documentList={documentList}
              handleClose={handleDocModalClose}
              open={docModal}
              updateDocument={updateDocumentArray}
              purchase_flag_id={idToBeView?.id}
              purchase_flag="40"
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
                <h5
                  className="p-5"
                  style={{
                    textAlign: "center",
                    backgroundColor: "black",
                    color: "white",
                  }}
                >
                  Vouchers
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
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
                <Button
                  variant="contained"
                  color="primary"
                  className="w-full mx-auto mt-16"
                  style={{
                    backgroundColor: "#4caf50",
                    border: "none",
                    color: "white",
                  }}
                  onClick={(e) => handleVoucherSubmit(e)}
                >
                  SAVE
                </Button>
              </div>
            </Modal>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddStockArticianReturnMetal;

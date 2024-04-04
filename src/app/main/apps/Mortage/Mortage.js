import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import History from "@history";
import { FuseAnimate } from "@fuse";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  InputBase,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Icones from "assets/fornt-icons/Mainicons";
import moment from "moment";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as Actions from "app/store/actions";
import Loader from "app/main/Loader/Loader";
import { useReactToPrint } from "react-to-print";
import { MortagePrint } from "./MortagePrintComponent/MortagePrint";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import DisplayImage from "./AddMortage/DisplayImage";
import Select, { createFilter } from "react-select";
import AsyncCreatable from "react-select/lib/Creatable";
import AddNewMortgageUser from "./AddMortage/AddNewMortgageUser";
import { Add } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import HelperFunc from "../SalesPurchase/Helper/HelperFunc";

// Modify the isValidNewOption function to always allow creating a new option
const customIsValidNewOption = (inputValue, selectValue, selectOptions) => {
  return true; // Always allow creating a new option
};

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
  table: {
    minWidth: 1000,
    tableLayout: "auto",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  search: {
    display: "flex",
    border: "1px solid #cccccc",
    height: "38px",
    width: "100%",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
    marginLeft: "auto",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "100%",
    height: "37px",
    color: "#CCCCCC",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter",
  },
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
  },
  tableRowPad: {
    padding: 7,
  },
  tablePad: {
    padding: 0,
  },
  paper: {
    position: "absolute",
    maxWidth: 950,
    width: "calc(100% - 30px)",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
  },
  label: {
    marginBottom: 7,
    paddingLeft: 7,
  },
  uibuttion: {
    marginBottom: "0px !important",
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    borderRadius: "50%",
    background: "#c1c1c1",
    opacity: "0.4",
    transition: "0.4s",
    "&:hover": {
      background: "#415bd4",
      opacity: 1,
      color: "#FFFFFF",
    },
  },
  errorMessage: {
    color: "#f44336",
    position: "absolute",
    bottom: "-3px",
    fontSize: "11px",
    lineHeight: "7px",
    marginTop: 3,
    fontFamily: 'Muli,Roboto,"Helvetica",Arial,sans-serif',
  },
  tab: {
    padding: 0,
    minWidth: "auto",
    marginInline: 10,
    textTransform: "uppercase",
    zIndex: 9,
    minHeight: "40px",
    // lineHeight: "initial",
    color: "#415BD4",
  },
  customIndicator: {
    backgroundColor: "#415BD4 !important",
    zIndex: 1,
    minHeight: "40px",
    top: 0,
    bottom: 0,
    borderRadius: 7,
  },
  selectVarient: {
    maxHeight: 40,
    minHeight: 40,
  },
  addBtn: {
    display: "flex",
    borderRadius: "8px",
    background: "#1E65FD",
    minWidth: "40px",
    maxWidth: "40px",
    alignItems: "center",
    justifyContent: "center",
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

const Mortage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState("");
  const [dateFilter, setDateFilter] = useState(false)

  useEffect(() => {
    NavbarSetting("Mortage-Retailer", dispatch);
  }, []);

  useEffect(() => {
    getTodaysGoldRate();
    getTodaysSilverRate();
  }, []);

  useEffect(() =>{
    const timeout = setTimeout(() => {
      setPage(0)
      setCount(0)
      setMortageGetData([])
      setFilters()
    }, 800);
    return () => {
        clearTimeout(timeout);
    };
  },[searchData,dateFilter])

  const [isView, setIsView] = useState(false); //for view Only
  const profileData =  localStorage.getItem('myprofile') && JSON.parse(localStorage.getItem('myprofile'))
  const [modalStyle] = useState(getModalStyle);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isClose, setIsClose] = useState(false);
  const [isPartial, setIsPartial] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdd, setIsAdd] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  // const [selectedClient, setSelectClient] = useState("");
  const [openClientModal, setOpenClientModal] = useState(false);

  // const [readOneData, setReadOneData] = useState({});

  const [imgFileArr, setImageFileArr] = useState([]);
  const [imgFiles, setImgFile] = useState([]);
  const [modalView, setModalView] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState("");
  // const [addUserModalOpen, setAddUserModalOpen] = useState(false);

  const [mortageGetData, setMortageGetData] = useState([]);
  const [mortagePartialEntry, setMortagePartialEntry] = useState([]);
  const [mortgagePayments, setMortgagePayments] = useState([]);
  const [mortageUserData, setMortageUserData] = useState([]);

  const [mortageDoc, setmortageDoc] = useState("");
  const [mortageName, setMortageName] = useState([]);
  const [mortageNameErr, setMortageNameErr] = useState("");
  const [mortageMobile, setMortageMobile] = useState("");
  const [mortageMobileErr, setMortageMobileErr] = useState("");
  const [mortageWeight, setMortageWeight] = useState("");
  const [mortageWeightErr, setMortageWeightErr] = useState("");
  const [mortageAmount, setMortageAmount] = useState("");
  const [mortageIssueAmountErr, setMortageIssueAmountErr] = useState("");
  const [mortagePercentage, setMortagePercentage] = useState("3");
  const [mortagePerDtErr, setMortagePerDtErr] = useState("");
  const [mortageDate, setMortageDate] = useState("");
  const [mortageDtErr, setMortageDtErr] = useState("");
  const [mortageNotes, setMortageNotes] = useState("");
  const [mortageNotesErr, setMortageNotesErr] = useState("");
  const [mortageId, setMortageId] = useState("");
  const [mortageCloseDate, setMortageCloseDate] = useState("");
  const [mortageEndDateErr, setMortageEndDateErr] = useState("");
  const [mortageReminderDate, setMortageReminderDate] = useState("");
  const [mortageReminderDateErr, setMortageReminderDateErr] = useState("");
  const [customerReview, setCustomerReview] = useState("");
  const [mortageCloseAmount, setMortageCloseAmount] = useState("");
  const [mortagepartialAmount, setMortagePartialAmount] = useState("");
  const [partialAmountErr, setPartialAmountErr] = useState("");
  const [totalInterest, setTotalInterest] = useState("");
  const [parEndDateVal, setParEndDateVal] = useState("");
  const [productName, setProductName] = useState("");
  const [productWeight, setProductWeight] = useState("");
  const [grossWeight, setgrossWeight] = useState("");
  const [productPurity, setProductPurity] = useState("");
  const [productFine, setProductFine] = useState("");
  const [productRate, setProductRate] = useState("");
  const [pcs, setPcs] = useState("");
  // const [amount, setAmount] = useState("");
  const [todaysGoldRate, setTodaysGoldRate] = useState("");
  const [todaySilverRate, setTodaySilverRate] = useState("");
  const [mortageAddAmount, setMortageAddAmount] = useState("");
  const [mortgageNamePass, setMortgageNamePass] = useState("");
  const [simpleOrCompound, setSimpleOrCompound] = useState(null);
  const [simpleOrCompoundErr, setSimpleOrCompoundErr] = useState("");
  const [deletedProduct, setDeletedProduct] = useState([]);
  const [productData, setProductData] = useState([]);
  const [address, setAddress] = useState("");

  const [totalSilverWeight, setTotalSilverWeight] = useState("");
  const [totalGoldWeight, setTotalGoldWeight] = useState("");

  const [packingSlipApiData, setPackingSlipApiData] = useState([]);
  const [productApiData, setProductApiData] = useState([]);

  const [productCategory, setProductCategory] = useState([]);
  const [selectedDeleteId, setSelectedDeleteId] = useState("");

  const [startDate, setStartDate] = useState("");
  const [startDateErr, setStartDateErr] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endDateErr, setEndDateErr] = useState("");

  // const [selectedCompType, setSelectedCompType] = useState([
  //   {
  //     value: 0,
  //     label: "Monthly",
  //   },
  // ]);

  const [indexOfId, setIndexOfId] = useState("");
  const categoryOption = [
    { name: "Gold", id: 1 },
    { name: "Silver", id: 2 },
  ];

  // for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);

  // const [showGoldSilverVarient, setShowGoldSilverVarient] = useState(1);
  const [selectshowGoldSilverVarient, setSelectGoldSilverVarient] = useState(1);
  const [interestType, setInterestType] = useState(0);

  const customFormatCreateLabel = (inputValue) => {
    return `Create User Name "${inputValue}"`;
  };

  const handelUserList = (data) => {
    console.log(data, ">>>>>>>>>>>>>>>>>>>>>>>>>");
    getMortageUserData();
    if (data) {
      setMortageName({ value: data.id, label: data.name, data: data });
    } else {
      setMortageName([]);
    }
    // setMortageName({value:mortageGetData[index].MortgageUser?.id,label:mortageGetData[index].MortgageUser?.name});
  };
  // useEffect(() => {
  //   console.log("================", mortageName);
  //   if (reloadFlag) {
  //     getMortageUserData();
  //   }
  // },[])

  // const [printObj, setPrintObj] = useState([]);

  const [printObj, setPrintObj] = useState({
    name: "",
    address : "",
    mobile_number: "",
    partialAmount: [],
    issueDate: "",
    weight: "",
    issueAmount: "",
    percentage: "",
    productDetail: [],
    addAmountDetail: [],
    doc_number: "",
    is_print : "",
    note : "",
  });

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const setToday = `${year}-${month}-${day}`;
    setMortageCloseDate(setToday);
    setMortageDate(setToday);
  }, []);

  useEffect(() => {
    if (
      indexOfId !== "" &&
      isValidDate(mortageCloseDate) &&
      mortageDate <= mortageCloseDate
    ) {
      GetIntrestApi(indexOfId, simpleOrCompound);
    }
  }, [mortageCloseDate]);

  function handleModalClose() {
    const today = new Date();
    const formateDate = moment(today).format("YYYY-MM-DD");
    setModalOpen(false);
    setMortageName([]);
    setmortageDoc("");
    setMortageMobile("");
    setMortageWeight("");
    setMortageAmount("");
    setSimpleOrCompound(null);
    setMortagePercentage("");
    setMortageDate("");
    setMortageNotes("");
    setMortageId("");
    setMortageCloseDate(formateDate);
    setMortageCloseAmount("");
    setMortageReminderDate("");
    setMortagePartialAmount("");
    setTotalInterest("");
    setMortagePartialEntry([]);

    setMortageNameErr("");
    setMortageMobileErr("");
    setMortageWeightErr("");
    setMortageIssueAmountErr("");
    setMortagePerDtErr("");
    setMortagePerDtErr("");
    setMortageDtErr("");
    setMortageNotesErr("");
    setPartialAmountErr("");
    setMortageEndDateErr("");
    setIndexOfId("");
    setImgFile([]);
    setProductData([]);
    setCustomerReview("");
    setMortageAddAmount("");
    setMortgagePayments([]);
    setSelectGoldSilverVarient(1);
    setInterestType("");
    setTotalGoldWeight("");
    setTotalSilverWeight("");
    setMortageEndDateErr("");
    setImageFileArr([]);
    setProductName("");
    setProductWeight("");
    setgrossWeight("");
    setProductPurity("");
    setProductFine("");
    setProductRate("");
    setPcs("");
  }
  function getMortgageDetail(mortgageId, i) {
    console.log(mortgageId);
    axios
      .get(Config.getCommonUrl() + `retailerProduct/api/mortage/${mortgageId}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          // setReadOneData(response.data.data);
          const data = response.data.data;
          setPrintObj({
            name: data.MortgageUser?.name,
            address : data.MortgageUser?.address,
            mobile_number : data.MortgageUser?.mobile_number,
            partialAmount: data.MortagePartialEntry,
            issueDate: data.issue_date,
            weight: parseFloat(data.weight),
            issueAmount: parseFloat(data.principal_amount),
            percentage: parseFloat(data.percentage),
            productDetail: data.MortgageProducts,
            addAmountDetail: data.MortgagePayments,
            doc_number: data.doc_number,
            note : data.notes,
            is_print : profileData?.is_mortgage_print ?  profileData.is_mortgage_print : 0
          });
          checkforPrint();
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/client/company/listing/listing/${mortgageId}`,
        });
      });
  }
  function addNewHandler() {
    setMortageName([]);
    setmortageDoc("");

    setMortageMobile("");
    setMortageWeight("");
    setMortageAmount("");
    setSimpleOrCompound(null);
    setMortagePercentage("");
    setMortageDate("");
    setMortageNotes("");
    setMortageId("");
    // setMortageCloseDate("");
    setMortageCloseAmount("");
    setMortageReminderDate("");
    setMortagePartialAmount("");
    setTotalInterest("");
    setMortagePartialEntry([]);
    setImgFile([]);
    setPage(0);
    setProductData([]);
    setCustomerReview("");
    setMortageAddAmount("");
    setDeletedProduct([]);
    setMortgagePayments([]);
    setCustomerReview("");
    setSelectGoldSilverVarient(1);
    setInterestType("");
    setTotalGoldWeight("");
    setTotalSilverWeight("");
    setMortageEndDateErr("");
    setImageFileArr([]);

    setIsAdd(true);
    setIsEdit(false);
    setIsClose(false);
    setIsPartial(false);
    setModalOpen(true);
    getMortageUserData();

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const setToday = `${year}-${month}-${day}`;
    setMortageDate(setToday);
    setMortagePercentage("3");

    const reminderDate = new Date(today);
    reminderDate.setMonth(reminderDate.getMonth() + 6);
    const reminderYear = reminderDate.getFullYear();
    const reminderMonth = String(reminderDate.getMonth() + 1).padStart(2, "0");
    const reminderDay = String(reminderDate.getDate()).padStart(2, "0");
    const setReminderDate = `${reminderYear}-${reminderMonth}-${reminderDay}`;
    setMortageReminderDate(setReminderDate);
    console.log(setToday);
    console.log(setReminderDate);
  }
  function editHandler(index, arrId) {
    setIsAdd(false);
    setIsEdit(true);
    setIsClose(false);
    setIsPartial(false);
    setModalOpen(true);
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const setToday = `${year}-${month}-${day}`;
    setMortageCloseDate(setToday);
    const actualArrs = mortageGetData.filter((item) => item.id === arrId);
    const actualArr = actualArrs[0];
    console.log(actualArr, "arrrr");
    if (index > -1) {
      setMortageId(actualArr.id);
      setmortageDoc(actualArr.doc_number);
      setMortageName({
        value: actualArr.MortgageUser?.id,
        label: actualArr.MortgageUser?.name,
      });
      setMortageMobile(actualArr.MortgageUser?.mobile_number);
      setMortageWeight(parseFloat(actualArr.weight));
      setMortageAmount(parseFloat(actualArr.principal_amount));
      setMortagePercentage(parseFloat(actualArr.percentage));
      setMortageDate(actualArr.issue_date);
      setMortageNotes(actualArr.notes);
      setImgFile(actualArr.MortgageDoc);
      // let productUpdate = actualArr.MortgageProducts.map((data) => {
      //   return {
      //     product_name: data.product_name,
      //     weight: data.weight
      //   }
      // })
      if (actualArr.MortagePartialEntry.length !== 0) {
        console.log(actualArr.MortagePartialEntry);
        setMortagePartialEntry(actualArr.MortagePartialEntry);
        console.log(actualArr.MortagePartialEntry[0].payment_date);
        // setMortageCloseDate(actualArr.MortagePartialEntry[0].payment_date)
        setParEndDateVal(actualArr.MortagePartialEntry[0].payment_date);
        const paymentDate = actualArr.MortagePartialEntry[0].payment_date;
        console.log(moment(paymentDate).isAfter(today));
        if (moment(paymentDate).isAfter(today)) {
          setMortageCloseDate(paymentDate);
        }
      } else {
        setParEndDateVal(actualArr?.issue_date);
      }
      setProductData(actualArr.MortgageProducts);
      setCustomerReview(actualArr?.review);
      setSimpleOrCompound(actualArr.is_simple_compound);
      setSelectGoldSilverVarient(actualArr.is_gold_silver);
      setInterestType(actualArr.int_option);
      if (actualArr.is_gold_silver === 3) {
        const silverProducts = actualArr.MortgageProducts.filter(
          (product) => product.is_gold_silver === 2
        );
        const goldProducts = actualArr.MortgageProducts.filter(
          (product) => product.is_gold_silver === 1
        );

        const totalSilverWeights = silverProducts.reduce(
          (total, product) => total + parseFloat(product.weight),
          0
        );
        const totalGoldWeights = goldProducts.reduce(
          (total, product) => total + parseFloat(product.weight),
          0
        );

        setTotalGoldWeight(totalGoldWeights);
        setTotalSilverWeight(totalSilverWeights);
      }
      setAddress(actualArr.MortgageUser?.address);
      console.log(actualArr.MortgageProducts);
    }
  }
  function closeHandler(index, arrId) {
    setIsAdd(false);
    setIsEdit(false);
    setIsClose(true);
    setIsPartial(false);
    setModalOpen(true);
    setIndexOfId(mortageGetData[index].id);
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const setToday = `${year}-${month}-${day}`;
    setMortageCloseDate(setToday);
    const actualArrs = mortageGetData.filter((item) => item.id === arrId);
    const actualArr = actualArrs[0];
    GetIntrestApi(actualArr.id, actualArr.is_simple_compound);
    console.log(actualArr, "arrrr");
    if (index > -1) {
      setMortageId(actualArr.id);
      setmortageDoc(actualArr.doc_number);
      setMortageName({
        value: actualArr.MortgageUser?.id,
        label: actualArr.MortgageUser?.name,
      });
      setMortageMobile(actualArr.MortgageUser?.mobile_number);
      setMortageWeight(parseFloat(actualArr.weight));
      setMortageAmount(parseFloat(actualArr.principal_amount));
      setMortagePercentage(parseFloat(actualArr.percentage));
      setMortageDate(actualArr.issue_date);
      setMortageNotes(actualArr.notes);

      setParEndDateVal(actualArr.issue_date);
      // if (actualArr.MortagePartialEntry.length !== 0) {
      //   console.log(actualArr.MortagePartialEntry);
      //   setMortagePartialEntry(actualArr.MortagePartialEntry);
      //   setParEndDateVal(actualArr.MortagePartialEntry[0].payment_date);
      //   const paymentDate = actualArr.MortagePartialEntry[0].payment_date
      //   console.log((moment(paymentDate).isAfter(today)));
      //   if ((moment(paymentDate).isAfter(today))) {
      //     setMortageCloseDate(paymentDate)
      //   }
      // } else {
      //   setParEndDateVal(actualArr?.issue_date);
      // }
      setSimpleOrCompound(actualArr.is_simple_compound);
      setProductData(actualArr.MortgageProducts);
      setCustomerReview(actualArr?.review);
      setMortgagePayments(actualArr.MortgagePayments);
      setSelectGoldSilverVarient(actualArr.is_gold_silver);
      setInterestType(actualArr.int_option);
      if (actualArr.is_gold_silver === 3) {
        const silverProducts = actualArr.MortgageProducts.filter(
          (product) => product.is_gold_silver === 2
        );
        const goldProducts = actualArr.MortgageProducts.filter(
          (product) => product.is_gold_silver === 1
        );

        const totalSilverWeights = silverProducts.reduce(
          (total, product) => total + parseFloat(product.weight),
          0
        );
        const totalGoldWeights = goldProducts.reduce(
          (total, product) => total + parseFloat(product.weight),
          0
        );

        setTotalGoldWeight(totalGoldWeights);
        setTotalSilverWeight(totalSilverWeights);
      }
      setAddress(actualArr.MortgageUser?.address);
    }
  }
  function partialHandler(index, arrId) {
    console.log(mortageGetData[index]);
    setIsAdd(false);
    setIsEdit(false);
    setIsClose(false);
    setIsPartial(true);
    setModalOpen(true);
    setIndexOfId(mortageGetData[index].id);
    const actualArrs = mortageGetData.filter((item) => item.id === arrId);
    const actualArr = actualArrs[0];
    console.log(actualArr, "arrrr");
    GetIntrestApi(actualArr.id, actualArr.is_simple_compound);
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const setToday = `${year}-${month}-${day}`;

    console.log(setToday);
    // if (index > -1) {
    // const endDate = actualArr.
    setMortageId(actualArr.id);
    setmortageDoc(actualArr.doc_number);
    setMortageName({
      value: actualArr.MortgageUser?.id,
      label: actualArr.MortgageUser?.name,
    });
    setMortageMobile(actualArr.MortgageUser?.mobile_number);
    setMortageWeight(parseFloat(actualArr.weight));
    setMortageAmount(parseFloat(actualArr.principal_amount));
    setMortagePercentage(parseFloat(actualArr.percentage));
    setMortageDate(actualArr.issue_date);
    setMortageNotes(actualArr.notes);

    setAddress(actualArr.MortgageUser?.address);
    setParEndDateVal(actualArr.issue_date);
    if (actualArr.MortagePartialEntry.length !== 0) {
      console.log(actualArr.MortagePartialEntry);
      setMortagePartialEntry(actualArr.MortagePartialEntry);
      // setMortageCloseDate(actualArr.MortagePartialEntry[0].payment_date);
      setParEndDateVal(actualArr.MortagePartialEntry[0].payment_date);
      const paymentDate = actualArr.MortagePartialEntry[0].payment_date;
      console.log(moment(paymentDate).isAfter(today));
      if (moment(paymentDate).isAfter(today)) {
        setMortageCloseDate(paymentDate);
      }
    } else {
      setMortageCloseDate(setToday);
    }
  
    setPrintObj({
      name: actualArr.MortgageUser?.name,
      address : actualArr.MortgageUser?.address,
      mobile_number : actualArr.MortgageUser?.mobile_number,
      partialAmount: actualArr.MortagePartialEntry,
      issueDate: actualArr.issue_date,
      weight: parseFloat(actualArr.weight),
      issueAmount: parseFloat(actualArr.principal_amount),
      percentage: parseFloat(actualArr.percentage),
      productDetail: actualArr.MortgageProducts,
      addAmountDetail: actualArr.MortgagePayments,
      doc_number: actualArr.doc_number,
      note : actualArr.notes,
      is_print : profileData?.is_mortgage_print ?  profileData.is_mortgage_print : 0
    });
    setProductData(actualArr.MortgageProducts);
    setCustomerReview(actualArr?.review);
    setSimpleOrCompound(actualArr.is_simple_compound);
    setMortgagePayments(actualArr.MortgagePayments);
    setSelectGoldSilverVarient(actualArr.is_gold_silver);
    setInterestType(actualArr.int_option);
    if (actualArr.is_gold_silver === 3) {
      const silverProducts = actualArr.MortgageProducts.filter(
        (product) => product.is_gold_silver === 2
      );
      const goldProducts = actualArr.MortgageProducts.filter(
        (product) => product.is_gold_silver === 1
      );

      const totalSilverWeights = silverProducts.reduce(
        (total, product) => total + parseFloat(product.weight),
        0
      );
      const totalGoldWeights = goldProducts.reduce(
        (total, product) => total + parseFloat(product.weight),
        0
      );

      setTotalGoldWeight(totalGoldWeights);
      setTotalSilverWeight(totalSilverWeights);
    }
    // }
  }
  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  function callAddOrderApi(isPrint) {
    console.log(productData);
    setLoading(true);
    // const payload = {
    //   // name: mortageName,
    //   gold_weight: mortageWeight,
    //   principal_amount: mortageAmount,
    //   percentage: mortagePercentage,
    //   issue_date: mortageDate,
    //   notes: mortageNotes,
    //   reminder_date: "2023-10-10",
    //   user_id:2,
    // };
    const formData = new FormData();
    formData.append("weight", mortageWeight);
    formData.append("principal_amount", mortageAmount);
    formData.append("percentage", mortagePercentage);
    formData.append("issue_date", mortageDate);
    formData.append("notes", mortageNotes);
    formData.append("is_gold_silver", selectshowGoldSilverVarient);
    formData.append("is_simple_compound", parseFloat(simpleOrCompound));
    formData.append("review", customerReview);
    formData.append("products", JSON.stringify(productData));
    formData.append(
      "reminder_date",
      moment(mortageReminderDate).format("YYYY-MM-DD")
    );
    formData.append("user_id", parseFloat(mortageName.value));
    // formData.append("files", JSON.stringify(imgarr));

    for (let i = 0; i < imgFileArr.length; i++) {
      formData.append("files", imgFileArr[i]);
    }

    // imgFiles.map((item, i) => {
    //   imgarr.push({
    //     orderImageID: item.id,
    //     image: item.image,
    //     reference_name: item.reference_name,
    //   });
    // });

    axios
      .post(Config.getCommonUrl() + "retailerProduct/api/mortage", formData)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          clearAll();
          setFilters();
          if (isAdd && isPrint === 1) {
            getMortgageDetail(response.data.data.id);
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
          api: "retailerProduct/api/mortage",
          formData,
        });
      });
  }

  function getMortageData(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          const data = response.data.data;
          setCount(response.data.totalRecord);
          if (mortageGetData.length === 0) {
            setMortageGetData(data);
          } else {
            setMortageGetData((mortageGetData) => [...mortageGetData, ...data]);
          }
          setLoading(false);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setMortageGetData([]);
        setLoading(false);
        handleError(error, dispatch, { api: url });
      });
  }
  function setFilters(tempPageNo) {
    let url = `retailerProduct/api/mortage?close=0&search=${searchData}&`;
    if (page !== "") {
      if (!tempPageNo) {
        url = url + "page=" + 1;
      } else {
        url = url + "page=" + tempPageNo;
      }
    } if(startDate){
      url = url + "&from_date=" + startDate;
    }if (endDate){
      url = url + "&to_date=" + endDate;
    }

    if (!tempPageNo) {
      getMortageData(url);
    } else {
      if (count > mortageGetData.length) {
        getMortageData(url);
      }
    }
  }
  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 10 > mortageGetData.length) {
      setFilters(Number(newPage + 1));
    }
  }

  function getMortageUserData() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/mortage/user")
      .then(function (response) {
        if (response.data.success === true) {
          console.log("setMortageGetData", response.data.data);
          // setApiData(response.data.data);
          setMortageUserData(response.data.data);
          setLoading(false);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: "retailerProduct/api/mortage/user",
        });
      });
  }

  function callEditMortagerApi() {
    // setLoading(true);
    console.log(JSON.stringify(productData));
    const formData = new FormData();
    formData.append("weight", mortageWeight);
    // formData.append("principal_amount", mortageAmount);
    // formData.append("percentage", mortagePercentage);
    formData.append("issue_date", mortageDate);
    formData.append("notes", mortageNotes);
    // formData.append("reminder_date", moment(mortageReminderDate).format("YYYY-MM-DD"));
    // formData.append("user_id", mortageName.value);
    formData.append("addNewPayment", mortageAddAmount);
    formData.append("added_date", mortageCloseDate);
    formData.append("customer_review", customerReview);
    // formData.append("is_gold_silver", showGoldSilverVarient);
    formData.append("productUpdate", JSON.stringify(deletedProduct));
    let productUpdatePost = productData
      .filter((data) => !data.hasOwnProperty("id"))
      .map((data) => {
        return {
          product_name: data.product_name,
          weight: data.weight,
          is_gold_silver: data.is_gold_silver,
          gross_weight: data.gross_weight,
          purity: data.purity,
          fine: data.fine,
          current_rate: data.current_rate,
          product_amount: (data.current_rate * data.fine) / 10,
          pcs : data.pcs
        };
      });
    formData.append("products", JSON.stringify(productUpdatePost));

    for (let i = 0; i < imgFileArr.length; i++) {
      formData.append("files", imgFileArr[i]);
    }
    // const formData = {
    //   name: mortageName,
    //   gold_weight: mortageWeight,
    //   principal_amount: mortageAmount,
    //   percentage: mortagePercentage,
    //   issue_date: mortageDate,
    //   notes: mortageNotes,
    // };
    axios
      .put(
        Config.getCommonUrl() + `retailerProduct/api/mortage/${mortageId}`,
        formData
      )
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setFilters();
          clearAll();
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
          api: `retailerProduct/api/mortage/${mortageId}`,
          body: formData,
        });
      });
  }

  function callCloseMortagerApi(isPrint) {
    // setLoading(true);
    const closeData = {
      percentage: mortagePercentage,
      close_date: mortageCloseDate,
      notes: mortageNotes,
      close_amount: mortageCloseAmount,
    };
    axios
      .put(
        Config.getCommonUrl() +
          `retailerProduct/api/mortage/close/${mortageId}`,
        closeData
      )
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          clearAll();
          setFilters();
          if (isPrint === 1) {
            getMortgageDetail(mortageId);
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
          api: `retailerProduct/api/mortage/close/${mortageId}`,
          body: closeData,
        });
      });
  }

  function GetIntrestApi(id, interest) {
    console.log(interest);
    let url = "";
    if (parseFloat(interest) === 1) {
      url = "retailerProduct/api/mortage/interest/";
    } else if (parseFloat(interest) === 2) {
      url = "retailerProduct/api/mortage/compound/";
    } else if (parseFloat(interest) === 3) {
      url = "retailerProduct/api/mortage/compound/yearly/";
    }
    console.log(mortageCloseDate);
    setLoading(true);
    const payload = {
      close_date: mortageCloseDate,
    };

    axios
      .post(Config.getCommonUrl() + url + id, payload)
      .then(function (response) {
        console.log("intrest", response);

        if (response.data.success === true) {
          setMortageCloseAmount(response.data.data.FinalAmount);
          setTotalInterest(
            response.data.data.TotalInterest
              ? response.data.data.TotalInterest
              : response.data.data.TotalCompoundInterest
          );
          // dispatch(
          //   Actions.showMessage({
          //     message: response.data.message,
          //     variant: "success",
          //   })
          // );
          // setFilters();
          setLoading(false);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: url + id,
          payload,
        });
      });
  }

  function partialPaymentApi(isPrint) {
    setLoading(true);
    const payload = {
      close_date: mortageCloseDate,
      payment_amount: parseFloat(mortagepartialAmount),
      note: mortageNotes,
      interest: parseFloat(totalInterest),
    };

    axios
      .post(
        Config.getCommonUrl() +
          `retailerProduct/api/mortage/partial/intrest/${mortageId}`,
        payload
      )
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          clearAll();
          setFilters();
          if (isPrint === 1) {
            getMortgageDetail(mortageId);
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
          api: `retailerProduct/api/mortage/partial/intrest/${mortageId}`,
          payload,
        });
      });
  }

  function getTodaysGoldRate() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/goldRateToday")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setTodaysGoldRate(response.data.data.rate);
          // const goldrateval = response.data.data.rate;
          // const percentage = response.data.data.percentage;
          // const minValue =
          //   goldrateval - (goldrateval * parseFloat(percentage)) / 100;
          // const maxValue =
          //   goldrateval + (goldrateval * parseFloat(percentage)) / 100;
          // console.log(minValue, maxValue, "....");
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
          setTodaySilverRate(response.data.data.rate);
          // const silverrateval = response.data.data.rate;
          // const percentage = response.data.data.percentage;
          // const minValue =
          //   silverrateval - (silverrateval * parseFloat(percentage)) / 100;
          // const maxValue =
          //   silverrateval + (silverrateval * parseFloat(percentage)) / 100;
          // console.log(minValue, maxValue, "....");
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

  function nameValidation(value) {
    if (value.length === 0) {
      setMortageNameErr("Please Select Name");
      return false;
    } else {
      setMortageNameErr("");
      return true;
    }
  }
  function mobileNumberValidation(value) {
    const Regex = /^[0-9]{10}$/;
    if (value === "") {
      setMortageMobileErr("Please Enter Mobile Number");
      return false;
    } else if (Regex.test(value) === false) {
      setMortageMobileErr("Please Enter Valid Mobile Number");
      return false;
    } else {
      setMortageMobileErr("");
      return true;
    }
  }
  function issueDateValidation(value) {
    let today = moment().format("YYYY-MM-DD");
    let dateVal = moment(value).format("YYYY-MM-DD");
    // let minDateVal = moment(new Date("")).format("YYYY-MM-DD");
    console.log("value", value, today);
    if (dateVal <= today) {
      setMortageDtErr("");
      return true;
    } else {
      setMortageDtErr("Enter Valid Date");
      return false;
    }
  }
  function issueGoldWeightValidation(value) {
    console.log("issueGoldWeightValidation value", value);
    if (isNaN(value)) {
      setMortageWeightErr("Enter Weight");
      return false;
    }
    // else if (value > 150) {
    //   setMortageWeightErr("Enter Valid Weight");
    //   return false;
    // }
    else {
      setMortageWeightErr("");
      return true;
    }
  }
  function simpleOrCompoundValidation(value) {
    console.log("simpleOrCompoundValidation value", value);
    if (value === null) {
      setSimpleOrCompoundErr("Select Interest Type");
      return false;
    }
    // else if (value > 150) {
    //   setMortageWeightErr("Enter Valid Weight");
    //   return false;
    // }
    else {
      setSimpleOrCompoundErr("");
      return true;
    }
  }
  function issueAmountValidation(value) {
    if (isNaN(value)) {
      setMortageIssueAmountErr("Enter Amount");
      return false;
    } else {
      setMortageIssueAmountErr("");
      return true;
    }
  }
  function percentageValidation(value) {
    console.log("percentageValidation value", value);
    if (isNaN(value) || value === "") {
      setMortagePerDtErr("Enter Percentage");
      return false;
    } else if (value < 0 || value > 99) {
      setMortagePerDtErr("Enter Valid Percentage Between 0 to 99");
      return false;
    } else {
      setMortagePerDtErr("");
      return true;
    }
  }

  function notesValidation(value) {
    console.log(value, "note>>>>>>");
    if (value === "") {
      setMortageNotesErr("Enter Note");
      return false;
    } else {
      setMortageNotesErr("");
      return true;
    }
  }

  function partialAmountValidation(value) {
    console.log("percentageValidation value", value, mortageCloseAmount);
    if (isNaN(value) || value === "") {
      setPartialAmountErr("Enter Amount");
      return false;
    } else if (parseFloat(value).toFixed(2) > parseFloat(mortageCloseAmount)) {
      setPartialAmountErr("Amount must be less than or equal to Total Amount");
      return false;
    } else {
      setPartialAmountErr("");
      return true;
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(value);

    if (name === "mobilenumber" && !isNaN(value)) {
      if (/^\d{0,10}$/.test(value)) {
        setMortageMobile(value);
        mobileNumberValidation(value);
      }
    }
    if (
      (name === "productweight" ||
        name === "grossweight" ||
        name === "productpurity" ||
        name === "productfine" || name === "pcs" ||
        name === "productrate") &&
      !/^\d*\.?\d*$/.test(value)
    ) {
      return;
    }
    if (name === "issue_date") {
      console.log(value);
      setMortageDate(value);
      const issueDate = moment(value);
      const reminderDate = issueDate.clone().add(6, "months").toDate();
      setMortageReminderDate(moment(reminderDate).format("YYYY-MM-DD"));
      issueDateValidation(value);
    }
    if (name === "gold_weight" && !isNaN(value)) {
      setMortageWeight(parseFloat(value));
      issueGoldWeightValidation(value);
    }
    if (name === "issue_amount" && !isNaN(value)) {
      setMortageAmount(value);
      issueAmountValidation(value);
    }
    if (name === "notes") {
      setMortageNotes(value);
      notesValidation(value);
    }
    if (name === "remindardate") {
      setMortageReminderDate(value);
      handleChangeReminderDateValidation(value);
    }
    if (name === "cutomerreview") {
      setCustomerReview(value);
    }
    if (name === "percentage" && !isNaN(value)) {
      setMortagePercentage(value);
      percentageValidation(value);
    }
    if (name === "partialAmount" && !isNaN(value)) {
      setMortagePartialAmount(value);
      partialAmountValidation(value);
    }
    if (name === "productname") {
      setProductName(value);
    }
    if (name === "grossweight") {
      setgrossWeight(value);
    }
    if (name === "pcs") {
      setPcs(value);
    }
    if (name === "productweight") {
      if (parseFloat(value) > parseFloat(grossWeight)) {
        dispatch(
          Actions.showMessage({
            message: "You can't enter NWT greter then GWT",
            variant: "error",
          })
        );
        return; // don't allow update
      }
      setProductWeight(value);
      const weight = value ? value : 0;
      const purity = productPurity ? productPurity : 0;
      const totalFine = (parseFloat(weight) * parseFloat(purity)) / 100;
      setProductFine(totalFine);
      if (selectshowGoldSilverVarient === 1) {
        setProductRate(todaysGoldRate);
      } else if (selectshowGoldSilverVarient === 2) {
        setProductRate(todaySilverRate);
      } else {
        if (productCategory.value === 1) {
          setProductRate(todaysGoldRate);
        } else {
          setProductRate(todaySilverRate);
        }
      }
    }
    if (name === "productpurity") {
      if (parseFloat(value) > 100) {
        return; // don't allow update
      }
      setProductPurity(value);
      const purity = value ? value : 0;
      const weight = productWeight ? productWeight : 0;
      const totalFine = (parseFloat(weight) * parseFloat(purity)) / 100;
      setProductFine(totalFine);
    }
    // if (name === "productfine") {
    //   setProductFine(value);
    // }
    if (name === "productrate") {
      setProductRate(value);
    }
    if (name === "addAmount" && !isNaN(value)) {
      setMortageAddAmount(value);
    }
    if (name === "simpleorcompound") {
      // const valueOfCompound = value ? 2 : 1
      setSimpleOrCompound(parseFloat(value));
      simpleOrCompoundValidation(value);
      // setMortageAddAmount(value);
    }
    // if (name === "productweight" || name === "productpurity") {
    //   const weight = productWeight ? productWeight : 0;
    //   const purity = productPurity ? productPurity : 0;
    //   console.log(weight, purity);
    //   const totalFine = (parseFloat(weight) * parseFloat(purity)) / 100;
    //   console.log(totalFine);
    // }
  };
  function handleselececlient(value) {
    console.log(value.value);
    // setSelectClient(value);
    setMortageName(value);
    // setMortagePostId();
    nameValidation(value);
    setMortgageNamePass(value);
    // console.log(value.__isNew__);
    if (value.__isNew__ === true) {
      setOpenClientModal(true);
      setMortageName([]);
    }
  }
  function handleFormSubmit(isPrint) {
    const name = mortageName;
    const issueDate = mortageDate;
    const goldWeight = parseFloat(mortageWeight);
    const issueAmount = parseFloat(mortageAmount);
    const percentage = mortagePercentage;
    const note = mortageNotes;
    const remiderDate = mortageReminderDate;
    const partialAmounts = mortagepartialAmount;
    console.log(mortageNotes);

    if (
      nameValidation(name) &&
      // mobileNumberValidation(mobileNumber) &&
      issueDateValidation(issueDate) &&
      issueGoldWeightValidation(goldWeight) &&
      issueAmountValidation(issueAmount) &&
      percentageValidation(percentage) &&
      // notesValidation(note) &&
      !mortageEndDateErr &&
      (isAdd
        ? handleChangeReminderDateValidation(remiderDate) &&
          simpleOrCompoundValidation(simpleOrCompound)
        : true) &&
      (isPartial ? partialAmountValidation(partialAmounts) : true)
    ) {
      console.log(isAdd);
      if (isAdd) {
        // setMortageGetData([]);
        callAddOrderApi(isPrint);
      }
      if (isEdit) {
        // setMortageGetData([]);
        callEditMortagerApi();
      }
      if (isClose) {
        // setMortageGetData([]);
        callCloseMortagerApi(isPrint);
      }
      if (isPartial) {
        // setMortageGetData([]);
        partialPaymentApi(isPrint);
      }
    }
  }
  function clearAll() {
    setMortageGetData([]);
    setModalOpen(false);
    setOpenAlert(false);
    setMortageName([]);
    setmortageDoc("");

    setMortageMobile("");
    setMortageWeight("");
    setMortageAmount("");
    setSimpleOrCompound(null);
    setMortagePercentage("");
    setMortageDate("");
    setMortageNotes("");
    setMortageId("");
    // setMortageCloseDate("");
    setMortageCloseAmount("");
    setMortageReminderDate("");
    setMortagePartialAmount("");
    setTotalInterest("");
    setMortagePartialEntry([]);
    setImgFile([]);
    setPage(0);
    setProductData([]);
    setCustomerReview("");
    setMortageAddAmount("");
    setDeletedProduct([]);
    setMortgagePayments([]);
    setCustomerReview("");
    setSelectGoldSilverVarient(1);
    setTotalGoldWeight("");
    setTotalSilverWeight("");
    setMortageEndDateErr("");
    setImageFileArr([]);
    setProductName("");
    setProductWeight("");
    setgrossWeight("");
    setProductPurity("");
    setProductFine("");
    setProductRate("");
    setPcs("");
    setInterestType("");
  }
  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);

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

  const handleBeforePrint = React.useCallback(() => {}, []);

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

  const handleAfterPrint = () => {
    //React.useCallback
    //resetting after print
    // checkAndReset();
    setModalOpen(false);
    setPrintObj({
      name: "",
      address: "",
      mobile_number: "",
      partialAmount: [],
      issueDate: "",
      weight: "",
      issueAmount: "",
      percentage: "",
      productDetail: [],
      addAmountDetail: [],
      doc_number: "",
      is_print:"",
      note : "",
    });
  };
  // function checkAndReset() {
  //   if (isView === false) {
  //     History.goBack();
  //   }
  // }

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "mortgage" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });
  function checkforPrint() {
    handlePrint();
  }

  function handleChangeEndDate(e) {
    let name = e.target.name;
    let value = e.target.value;
    setMortageCloseDate(value);
    const addIssueAmountDate = mortagePartialEntry[0]?.payment_date;
    if (isPartial) {
      if (name === "endDate") {
        console.log(value, value < mortageCloseDate, parEndDateVal);
        if (value < parEndDateVal) {
          setMortageEndDateErr("Enter Valid Date");
        } else {
          setMortageEndDateErr("");
        }
      }
    } else if (isClose) {
      if (name === "endDate") {
        if (value < parEndDateVal) {
          setMortageEndDateErr("Enter Valid Date");
        } else {
          setMortageEndDateErr("");
        }
      }
    } else if (isEdit) {
      if (name === "endDate") {
        if (value < parEndDateVal) {
          setMortageEndDateErr("Enter Valid Date");
        } else {
          setMortageEndDateErr("");
        }
      }
    }
    if (isEdit && addIssueAmountDate) {
      if (name === "endDate") {
        if (value < addIssueAmountDate) {
          setMortageEndDateErr("Enter Valid Date");
        } else {
          setMortageEndDateErr("");
          console.log(value);
        }
      }
    }
  }
  function handleChangeReminderDateValidation(value) {
    if (value === "") {
      setMortageReminderDateErr("Enter Reminder Date");
      return false;
    } else {
      setMortageReminderDateErr("");
      return true;
    }
  }
  function isValidDate(dateString) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateString.match(dateRegex) !== null;
  }
  function handleCloseAlert() {
    setOpenAlert(false);
  }
  function handleOpenAlert() {
    setOpenAlert(true);
  }
  function handleDeleteCloseAlert() {
    setOpenDeleteAlert(false);
  }
  function handleDeleteOpenAlert(dataId) {
    setSelectedDeleteId(dataId);
    setOpenDeleteAlert(true);
  }

  const setImages = (event) => {
    const files = event.target.files;
    const imageUrls = [...imgFiles];
    if (Config.checkFile(files, "image")) {
      setImageFileArr(files);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        imageUrls.push({
          upload_file_name: file.name,
          image_file: URL.createObjectURL(file),
          fielType: file.type,
        });
      }
      setImgFile(imageUrls);
      console.log("imageUrls", imageUrls);
      console.log("imgFiles", imgFiles);

      // setPrintObj({ ...printObj, image: imageUrls });
    } else {
      document.getElementById("files").value = "";
      dispatch(
        Actions.showMessage({
          message: "Accept only .jpg, .png, or .jpeg files.",
        })
      );
    }
    // console.log(imageUrls, "imgFiles----------");
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const hiddenFileInput = React.useRef(null);
  const handleCloseImage = () => {
    setModalView("");
  };

  const handleRemoveRow = (index) => {
    const arr = [...imgFiles];
    arr.splice(index, 1);
    // const updatedData = arr.filter(row => row.index !== index);
    console.log(arr);
    setImgFile(arr);
    // setPrintObj({ ...printObj, image: arr });
  };

  // function handleChangeVarient(event, newValue) {
  //   setMortageGetData([])
  //   setShowGoldSilverVarient(newValue);
  // }
  function handleSelectVarient(event, newValue) {
    setSelectGoldSilverVarient(newValue);
    setProductData([]);
    console.log(newValue);
    // if(parseFloat(selectshowGoldSilverVarient) !== 3) {
    //   const newProduct = {
    //     value: newValue,
    //     label: newValue === 1 ? "Gold" : "Silver"
    //   }
    //   setProductCategory(newProduct)
    // }
  }

  function addProduct() {
    console.log(productCategory);
    if (productWeight !== "" && productName !== "") {
      const newProduct = {
        product_name: productName,
        gross_weight: grossWeight,
        weight: productWeight,
        is_gold_silver:
          selectshowGoldSilverVarient === 1
            ? 1
            : selectshowGoldSilverVarient === 2
            ? 2
            : productCategory.value,
        purity: productPurity,
        fine: productFine,
        current_rate: productRate,
        product_amount: (productRate * productFine) / 10,
        pcs : pcs
      };
      setProductData((prevProductData) => [...prevProductData, newProduct]);
      const totalWeight = [...productData, newProduct].reduce(
        (total, product) => total + parseFloat(product.weight),
        0
      );
      const totalGoldWeight = [...productData, newProduct]
        .filter((product) => product.is_gold_silver === 1)
        .reduce((total, product) => total + parseFloat(product.weight), 0);
      const totalSilverWeight = [...productData, newProduct]
        .filter((product) => product.is_gold_silver === 2)
        .reduce((total, product) => total + parseFloat(product.weight), 0);
      console.log(totalGoldWeight);
      setTotalGoldWeight(totalGoldWeight);
      setTotalSilverWeight(totalSilverWeight);
      setMortageWeight(totalWeight);
      setProductName("");
      setProductWeight("");
      setgrossWeight("");
      setProductPurity("");
      setProductFine("");
      setProductRate("");
      setPcs("")
      console.log(productData);
    }
  }
  function deleteProduct(data, index) {
    console.log(index);
    console.log(data);
    if (isAdd) {
      productData.splice(index, 1);
      setProductData([...productData]);
      const totalWeightAdd = productData.reduce(
        (total, product) => total + parseFloat(product.weight),
        0
      );
      setMortageWeight(totalWeightAdd);
    } else {
      const updatedProducts = [...productData];
      const dletedProductUpdate = {
        id: data.id,
        weight: data.weight,
      };
      const filteredArr = updatedProducts.filter((item) => item.id !== data.id);
      const totalWeight = filteredArr.reduce(
        (total, product) => total + parseFloat(product.weight),
        0
      );
      setDeletedProduct([...deletedProduct, dletedProductUpdate]);
      setProductData(filteredArr);
      setMortageWeight(totalWeight);
    }
  }
  {
    console.log(selectedDeleteId);
  }
  function deleteMortgage() {
    axios
      .delete(
        Config.getCommonUrl() +
          `retailerProduct/api/mortage/${selectedDeleteId}`
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          clearAll();
          setFilters();
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        handleDeleteCloseAlert();
        setSelectedDeleteId("");
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `retailerProduct/api/mortage/${selectedDeleteId}`,
        });
        handleDeleteCloseAlert();
      });
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mortageNotes) {
        getPackingSlipData(mortageNotes);
      } else {
        setPackingSlipApiData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [mortageNotes]);

  function getPackingSlipData(sData) {
    console.log(sData);
    axios
      .get(
        Config.getCommonUrl() +
          `retailerProduct/api/mortage/search/notes?is_gold_silver=${selectshowGoldSilverVarient}&notes=${sData}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let responseData = response.data.data;
          if (responseData.length > 0) {
            console.log(response.data);
            setPackingSlipApiData(responseData);
          } else {
            setPackingSlipApiData([]);
          }
        } else {
          setPackingSlipApiData([]);
          // dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        // handleError(error, dispatch, {
        //   api: "retailerProduct/api/mortage/search/notes",
        // });
      });
  }

  let handlePackingSlipSelect = (value) => {
    let filteredArray = packingSlipApiData.filter(
      (item) => item.notes === value
    );
    if (filteredArray.length > 0) {
      setPackingSlipApiData(filteredArray);
      setMortageNotesErr("");
      setMortageNotes(value);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (productName) {
        getProductData(productName);
      } else {
        setProductApiData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [productName]);

  function getProductData(sData) {
    console.log(sData);
    axios
      .get(
        Config.getCommonUrl() +
          `retailerProduct/api/mortage/search/product?is_gold_silver=${selectshowGoldSilverVarient}&name=${sData}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let responseData = response.data.data;
          if (responseData.length > 0) {
            console.log(response.data);
            setProductApiData(responseData);
          } else {
            setProductApiData([]);
          }
        } else {
          setProductApiData([]);
          // dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        // handleError(error, dispatch, {
        //   api: "retailerProduct/api/mortage/search/product",
        // });
      });
  }
  let handleProductSelect = (value) => {
    console.log("innnn", value);
    let filteredArray = productApiData.filter(
      (item) => item.product_name === value
    );
    if (filteredArray.length > 0) {
      setProductApiData(filteredArray);
      setMortageNotesErr("");
      setProductName(value);
    }
  };
  function handleProductCategory(value) {
    console.log(value);
    setProductCategory(value);
  }

  const resetDatasearch = () => {
    setDateFilter(false);
    setStartDate("")
    setStartDateErr("")
    setEndDate("")
    setEndDateErr("")
  }

  // function handleSelectCompType(value) {
  //   setSelectedCompType(value);
  //   console.log(value);
  // }
  return (
    <>
      {!modalOpen && loading && <Loader />}
      <div className={clsx(classes.root, "w-full ")}>
        <FuseAnimate animation="transition.slideUpIn" delay={200}>
          {/* <div className="flex flex-col md:flex-row container"> */}
          <Box>
            <Grid
              container
              alignItems="center"
              style={{
                paddingInline: "28px",
                marginTop: "30px",
                marginBottom: "16px",
                justifyContent: "space-between",
              }}
            >
              <Grid item xs={6} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">Mortgage</Typography>
                </FuseAnimate>
              </Grid>
             
              <Grid
                item
                xs={3}
                style={{ textAlign: "right" }}
                // key="2"
              >
                 <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={() => History.push(`/dashboard/userlists`)}
                >
                  User List
                </Button>
                <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={() => addNewHandler()}
                >
                  Add New
                </Button>
              </Grid>
            </Grid>
            <div className="main-div-alll">
              <Grid spacing={2}
                container 
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                }}
              >
                {/* <Grid item>
                <Tabs
                    value={showGoldSilverVarient}
                    onChange={handleChangeVarient}
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab label="Gold" className={classes.tab} value={1} />
                    <Tab label="Silver" className={classes.tab} value={2} />
                  </Tabs>
                </Grid> */}
                <Grid item xs={12} sm={6} md={3} lg={2}>
                 
                  <div
                    style={{ borderRadius: "7px !important" }}
                    component="form"
                    className={classes.search}
                  >
                    <InputBase
                      className={classes.input}
                      placeholder="Search"
                      inputProps={{ "aria-label": "search" }}
                      value={searchData}
                      onChange={(event) => setSearchData(event.target.value)}
                    />
                    <IconButton
                      type="submit"
                      className={classes.iconButton}
                      aria-label="search"
                    >
                      <SearchIcon />
                    </IconButton>
                  </div>
                </Grid>
                <Grid item  xs={12} sm={6} md={3} lg={2}>
                <p>From date</p>

                  <TextField
                  // label="From Date"
                  name="startDate"
                  value={startDate}
                  error={startDateErr.length > 0 ? true : false}
                  helperText={startDateErr}
                  type="date"
                  onChange={(e) => setStartDate(e.target.value)}
                  // onKeyDown={(e => e.preventDefault())}
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    max: moment().format("YYYY-MM-DD")
                  }}
                  format="yyyy/MM/dd"
                  InputLabelProps={{
                      shrink: true,
                  }} />
                </Grid>
                <Grid item  xs={12} sm={6} md={3} lg={2}>
                <p>To date</p>
                <TextField
                // className="pl-5"
                // label="To Date"
                name="endDate"
                value={endDate}
                error={endDateErr.length > 0 ? true : false}
                helperText={endDateErr}
                type="date"
                onChange={(e) => setEndDate(e.target.value)}
                // onKeyDown={(e => e.preventDefault())}
                variant="outlined"
                fullWidth
                format="yyyy/MM/dd"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                  // max: moment().format("YYYY-MM-DD"),
                   min: startDate && moment(startDate).format("YYYY-MM-DD")
                }}
                />
                </Grid>
                <Grid item  xs={12} sm={6} md={3} lg={2}>
                <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={()=>setDateFilter(true)}
                >
                  Search
                </Button>
                <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={() => resetDatasearch()}
                >
                  Reset
                </Button>
                </Grid>
              </Grid>

              <Paper style={{ marginTop: "16px", overflowY: "auto" }}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      {/* <TableCell className={classes.tableRowPad}>Sr No.</TableCell> */}
                      <TableCell className={classes.tableRowPad}>
                        Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Document Id
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Address
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Metal Type
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {/* {showGoldSilverVarient === 1 ? "Gold" : "Silver"} */}
                        Net WT(Gram)
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Amount
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Interest(%)
                      </TableCell>
                      <TableCell className={classes.tableRowPad} width="335px">
                        Actions
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        width={40}
                        align="center"
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mortageGetData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className={classes.tableRowPad}
                          style={{
                            textAlign: "center",
                            borderBottom: "1px solid #a9a9a98c",
                          }}
                        >
                          No Data Found
                        </TableCell>
                      </TableRow>
                    ) : (
                      mortageGetData
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        // .filter((temp) =>
                        //   temp.MortgageUser?.name
                        //     .toLowerCase()
                        //     .includes(searchData.toLowerCase())
                        // && temp.is_gold_silver === showGoldSilverVarient
                        // )
                        .map((data, i) => (
                          <TableRow key={i}>
                            {/* <TableCell className={classes.tableRowPad}>
                              {page * rowsPerPage + i + 1}
                            </TableCell> */}
                            <TableCell className={classes.tableRowPad}>
                              {/* {data.issue_date} */}
                              {moment(data.issue_date).format("DD-MM-YYYY")}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.doc_number}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.MortgageUser?.name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.MortgageUser?.address}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.is_gold_silver === 1
                                ? "Gold"
                                : data.is_gold_silver === 2
                                ? "Silver"
                                : "Mix"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.weight}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {Config.numWithComma(data.principal_amount)}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.percentage}%
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              // width="400px"
                            >
                              <Button
                                variant="contained"
                                className={classes.button}
                                size="small"
                                onClick={() => editHandler(i, data.id)}
                              >
                                Edit
                              </Button>
                              {/* {console.log(data.MortagePartialEntry.length === 0 ? true : false)} */}
                              <Button
                                variant="contained"
                                className={classes.button}
                                size="small"
                                onClick={() => closeHandler(i, data.id)}
                                disabled={
                                  data.MortagePartialEntry.length !== 0
                                    ? true
                                    : false
                                }
                              >
                                loan closure
                              </Button>
                              {/* {console.log(data.is_simple_compound)} */}
                              <Button
                                variant="contained"
                                className={classes.button}
                                size="small"
                                onClick={() => {
                                  setSimpleOrCompound(data.is_simple_compound);
                                  partialHandler(i, data.id);
                                }}
                                // onClick={() => getMortgageDetail(data.id, i)}
                              >
                                partial payment
                              </Button>
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ paddingRight: 20 }}
                            >
                              <Icon
                                className="delete-icone"
                                style={{
                                  verticalAlign: "middle",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleDeleteOpenAlert(data.id)}
                              >
                                <img src={Icones.delete_red} alt="delete" />
                              </Icon>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </Paper>
              <TablePagination
                labelRowsPerPage=""
                component="div"
                // count={apiData.length}
                count={count}
                rowsPerPage={10}
                page={page}
                backIconButtonProps={{
                  "aria-label": "Previous Page",
                }}
                nextIconButtonProps={{
                  "aria-label": "Next Page",
                }}
                onPageChange={handleChangePage}
                // onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </div>
          </Box>
          {/* </div> */}
        </FuseAnimate>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={modalOpen}
          // onClose={(_, reason) => {
          //   if (reason !== "backdropClick") {
          //     handleModalClose(false);
          //   }
          // }}
        >
          {/* {modalOpen && loading ? <Loader /> : ""} */}
          <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
            <>
              <h5 className="popup-head p-20">
                {/* {isEdit === true
              ? "Edit Category"
              : isView
              ? "View Category"
              : "Add New Category"} */}

                {isEdit === true
                  ? "Edit"
                  : isClose
                  ? "Close Payment"
                  : isPartial
                  ? "Partial Payment"
                  : "Add New"}
                <IconButton
                  style={{ position: "absolute", top: "3px", right: "6px" }}
                  onClick={handleModalClose}
                >
                  <Icon>
                    <img src={Icones.cross} alt="" />
                  </Icon>
                </IconButton>
              </h5>
              <Box
                style={{ overflowX: "auto", maxHeight: "calc(100vh - 200px)" }}
              >
                <div style={{ padding: "30px" }}>
                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid item xs={12} sm={6}>
                      {/* <div style={{padding: 7, background: "#ccc", display: "inline-block", borderRadius: 10}}> */}
                      <Tabs
                        value={selectshowGoldSilverVarient}
                        onChange={handleSelectVarient}
                        variant="scrollable"
                        scrollButtons="auto"
                        // textColor="primary"
                        // classes={{ indicator: classes.customIndicator }}
                        // className={classes.selectVarient}
                      >
                        <Tab
                          label="Gold"
                          disabled={!isAdd}
                          className={classes.tab}
                          value={1}
                        />
                        <Tab
                          label="Silver"
                          disabled={!isAdd}
                          className={classes.tab}
                          value={2}
                        />
                        <Tab
                          label="Mix"
                          disabled={!isAdd}
                          className={classes.tab}
                          value={3}
                        />
                      </Tabs>
                      {/* </div> */}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      {!isAdd && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            color: "#555555",
                          }}
                        >
                          <h3>Interest Type :</h3>
                          {console.log(interestType)}
                          <h3>
                            {interestType === 0
                              ? "Default"
                              : interestType === 1
                              ? "0-15 Days"
                              : interestType === 2
                              ? "1 Month"
                              : ""}
                          </h3>
                        </div>
                      )}
                    </Grid>
                    {!isAdd ? (
                      <Grid
                        item
                        xs={12}
                        md={6}
                        style={{ marginTop: "15px", position: "relative" }}
                      >
                        <label className={classes.label}>Document No</label>
                        <TextField
                          name="documentnumb"
                          variant="outlined"
                          fullWidth
                          onChange={(e) => handleInputChange(e)}
                          value={mortageDoc}
                          disabled
                        />
                      </Grid>
                    ) : null}
                    <Grid
                      item
                      xs={12}
                      md={6}
                      style={{ marginTop: "15px", position: "relative" }}
                    >
                      <label className={classes.label}>Name</label>
                      {}
                      {console.log(mortageName)}
                      <>
                        <AsyncCreatable
                          filterOption={createFilter({
                            ignoreAccents: false,
                          })}
                          // classes={classes}
                          // styles={selectStyles}
                          isValidNewOption={customIsValidNewOption}
                          formatCreateLabel={customFormatCreateLabel}
                          createOptionPosition="first"
                          options={
                            mortageUserData
                              ? mortageUserData.map((suggestion) => ({
                                  value: suggestion.id,
                                  label: suggestion.name,
                                  data: suggestion,
                                }))
                              : []
                          }
                          // components={components}
                          value={mortageName}
                          onChange={(e) => handleselececlient(e)}
                          // isClearable={isClearable}
                          //   defaultOptions
                          isDisabled={
                            isEdit || isClose || isPartial ? true : false
                          }
                          placeholder="Select Client Name"
                        />
                        <span className={classes.errorMessage}>
                          {mortageNameErr.length > 0 ? mortageNameErr : ""}
                        </span>
                      </>
                      {/* <TextField
                          name="name"
                          variant="outlined"
                          error={mortageNameErr.length > 0 ? true : false}
                          helperText={mortageNameErr}
                          fullWidth
                          onChange={(e) => handleInputChange(e)}
                          value={mortageName}
                          required
                          disabled={isClose || isPartial ? true : false}
                        /> */}
                    </Grid>
                    {!isAdd ? (
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>Mobile Number</label>
                        <TextField
                          name="mobilenumber"
                          variant="outlined"
                          error={mortageMobileErr.length > 0 ? true : false}
                          helperText={mortageMobileErr}
                          fullWidth
                          onChange={(e) => handleInputChange(e)}
                          value={mortageMobile}
                          required
                          disabled={
                            isEdit || isClose || isPartial ? true : false
                          }
                        />
                      </Grid>
                    ) : null}
                    {/* {isClose || isPartial ? ( */}
                    <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                      <label className={classes.label}>Issue Date</label>
                      <TextField
                        name="issue_date"
                        error={mortageDtErr.length > 0 ? true : false}
                        helperText={mortageDtErr}
                        onChange={(e) => handleInputChange(e)}
                        value={mortageDate}
                        type="date"
                        variant="outlined"
                        fullWidth
                        inputProps={{
                          max: moment().format("YYYY-MM-DD"),
                        }}
                        // InputLabelProps={{
                        //   shrink: true,
                        // }}
                        // required
                        disabled={
                          mortagePartialEntry.length !== 0 ||
                          isClose ||
                          isPartial
                            ? true
                            : false
                        }
                      />
                    </Grid>
                    {isAdd && mortageName.length !== 0 ? (
                      <Grid item xs={12} style={{ marginBottom: "-16px" }}>
                        <p
                          className={classes.label}
                          style={{ marginBlock: 5, display: "flex" }}
                        >
                          <span style={{ display: "block", width: 115 }}>
                            Mobile Number:
                          </span>{" "}
                          {mortageName.data?.mobile_number
                            ? mortageName.data.mobile_number
                            : "-"}
                        </p>
                        <p
                          className={classes.label}
                          style={{ marginBlock: 5, display: "flex" }}
                        >
                          <span style={{ display: "block", width: 115 }}>
                            Address :
                          </span>{" "}
                          {mortageName.data?.address
                            ? mortageName.data.address
                            : "-"}
                        </p>
                      </Grid>
                    ) : null}
                    {/* {(isAdd || isEdit) && */}
                    <Grid item xs={12} style={{ marginTop: "15px" }}>
                      {(isAdd || isEdit) && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            columnGap: 5,
                          }}
                        >
                          {selectshowGoldSilverVarient === 3 && (
                            <div style={{ minWidth: 90 }}>
                              <label className={classes.label}>
                                Metal Type
                              </label>
                              <Select
                                // className="mt-16"
                                // styles={selectStyles}
                                options={categoryOption.map((group) => ({
                                  value: group.id,
                                  label: group.name,
                                }))}
                                filterOption={createFilter({
                                  ignoreAccents: false,
                                })}
                                value={productCategory}
                                onChange={(e) => handleProductCategory(e)}
                                placeholder="Select"
                              />
                            </div>
                          )}
                          <div
                            className="packing-slip-input height"
                            style={{ flexBasis: "100%" }}
                          >
                            <label className={classes.label}>
                              Product Name
                            </label>
                            {/* <TextField 
                                variant="outlined"
                                fullWidth
                                name="productname"
                                value={productName} 
                                onChange={(e) => handleInputChange(e)}
                              /> */}

                            <Autocomplete
                              id="free-solo-demos"
                              freeSolo
                              disableClearable
                              onChange={(event, newValue) => {
                                console.log(newValue);
                                handleProductSelect(newValue);
                              }}
                              onInputChange={(event, newInputValue) => {
                                console.log(newInputValue);
                                if (event !== null) {
                                  if (event.type === "change")
                                    setProductName(newInputValue);
                                } else {
                                  isAdd && setProductName("");
                                }
                              }}
                              value={productName}
                              options={productApiData.map(
                                (option) => option.product_name
                              )}
                              fullWidth
                              disabled={isView}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  style={{ padding: 0 }}
                                />
                              )}
                            />
                          </div>
                          <div style={{ minWidth: 85 }}>
                            <label className={classes.label}>GWT(G)</label>
                            <TextField
                              variant="outlined"
                              name="grossweight"
                              type="text"
                              className={classes.inputBoxTEST}
                              value={grossWeight}
                              onChange={(e) => handleInputChange(e)}
                            />
                          </div>
                          <div style={{ minWidth: 85 }}>
                            <label className={classes.label}>NWT(G)</label>
                            <TextField
                              variant="outlined"
                              name="productweight"
                              type="text"
                              className={classes.inputBoxTEST}
                              value={productWeight}
                              onChange={(e) => handleInputChange(e)}
                            />
                          </div>
                          <div style={{ minWidth: 85 }}>
                            <label className={classes.label}>Purity</label>
                            <TextField
                              variant="outlined"
                              name="productpurity"
                              type="text"
                              className={classes.inputBoxTEST}
                              value={productPurity}
                              onChange={(e) => handleInputChange(e)}
                            />
                          </div>
                          <div style={{ minWidth: 85 }}>
                            <label className={classes.label}>Fine</label>
                            <TextField
                              variant="outlined"
                              name="productfine"
                              type="text"
                              className={classes.inputBoxTEST}
                              value={productFine}
                              disabled
                              onChange={(e) => handleInputChange(e)}
                            />
                          </div>
                          <div style={{ minWidth: 100 }}>
                            <label className={classes.label}>C Rate</label>
                            <TextField
                              variant="outlined"
                              name="productrate"
                              type="text"
                              className={classes.inputBoxTEST}
                              value={productRate}
                              onChange={(e) => handleInputChange(e)}
                            />
                          </div>
                          <div style={{ minWidth: 85 }}>
                            <label className={classes.label}>PCS</label>
                            <TextField
                              variant="outlined"
                              name="pcs"
                              type="text"
                              className={classes.inputBoxTEST}
                              value={pcs}
                              onChange={(e) => handleInputChange(e)}
                            />
                          </div>
                          {/* <div style={{ minWidth: 100 }}>
                            <label className={classes.label}>Amount</label>
                            <TextField
                              variant="outlined"
                              name="amount"
                              type="text"
                              className={classes.inputBoxTEST}
                              value={amount}
                              onChange={(e) => handleInputChange(e)}
                            />
                          </div> */}
                          <Button
                            variant="contained"
                            className={classes.addBtn}
                            size="small"
                            style={{ marginBottom: 3 }}
                            onClick={addProduct}
                          >
                            <Add
                              style={{
                                color: "#FFFFFF",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            />
                          </Button>
                        </div>
                      )}
                      {productData.length !== 0 ? (
                        <Table style={{ marginTop: 10 }}>
                          <TableHead style={{ position: "static" }}>
                            <TableRow>
                              {(isAdd || isEdit) && (
                                <TableCell
                                  className={classes.tableRowPad}
                                  width={50}
                                ></TableCell>
                              )}
                              {selectshowGoldSilverVarient === 3 && (
                                <TableCell className={classes.tableRowPad}>
                                  Category
                                </TableCell>
                              )}
                              <TableCell className={classes.tableRowPad}>
                                Product Name
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
                                Current Rate
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                PCS
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{ paddingRight: 20 }}
                              >
                                Amount
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {productData.map((data, index) => (
                              <TableRow key={index}>
                                {(isAdd || isEdit) && (
                                  <TableCell className={classes.tablePad}>
                                    <Icon
                                      className="delete-icone"
                                      style={{ verticalAlign: "middle" }}
                                      onClick={() => deleteProduct(data, index)}
                                    >
                                      <img
                                        src={Icones.delete_red}
                                        alt="delete"
                                      />
                                    </Icon>
                                  </TableCell>
                                )}
                                {selectshowGoldSilverVarient === 3 && (
                                  <TableCell className={classes.tableRowPad}>
                                    {data.is_gold_silver === 1
                                      ? "Gold"
                                      : "Silver"}
                                  </TableCell>
                                )}
                                <TableCell className={classes.tableRowPad}>
                                  {data.product_name}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {parseFloat(data.gross_weight).toFixed(3)}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {parseFloat(data.weight).toFixed(3)}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {data.purity !== "" ? data.purity : "-"}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {data.fine ? data.fine : "-"}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {data.current_rate
                                    ? Config.numWithComma(data.current_rate)
                                    : "-"}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {data.pcs ? data.pcs : "-"}
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  style={{ paddingRight: 20 }}
                                >
                                  {data.product_amount
                                    ? Config.numWithComma(data.product_amount)
                                    : "-"}
                                </TableCell>

                              </TableRow>
                            ))}
                          </TableBody>
                          <TableFooter>
                            <TableRow style={{ background: "#ebeefb" }}>
                              {(isAdd || isEdit) && (
                                <TableCell
                                  className={classes.tableRowPad}
                                ></TableCell>
                              )}
                              <TableCell className={classes.tableRowPad}>
                                <b>Total</b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <b>
                                  {Config.numWithComma(
                                    HelperFunc.getTotalOfField(
                                      productData,
                                      "gross_weight"
                                    )
                                  )}
                                </b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <b>
                                  {Config.numWithComma(
                                    HelperFunc.getTotalOfField(
                                      productData,
                                      "weight"
                                    )
                                  )}
                                </b>
                              </TableCell>
                              <TableCell
                                colSpan={4}
                                className={classes.tableRowPad}
                              ></TableCell>
                              
                              <TableCell
                                className={classes.tableRowPad}
                                style={{ paddingRight: 20 }}
                              >
                                <b>
                                  {Config.numWithComma(
                                    HelperFunc.getTotalOfField(
                                      productData,
                                      "product_amount"
                                    )
                                  )}
                                </b>
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      ) : null}
                    </Grid>
                    {/* } */}
                    {selectshowGoldSilverVarient === 3 && (
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <label className={classes.label}>
                              {/* {selectshowGoldSilverVarient === 1 ? "Gold" : "Silver"} */}
                              Total Gold Weight(G)
                            </label>
                            <TextField
                              name="gold_weight"
                              variant="outlined"
                              fullWidth
                              value={
                                totalGoldWeight
                                  ? parseFloat(totalGoldWeight).toFixed(3)
                                  : 0
                              }
                              disabled
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <label className={classes.label}>
                              {/* {selectshowGoldSilverVarient === 1 ? "Gold" : "Silver"} */}
                              Total Silver Weight(G)
                            </label>
                            <TextField
                              name="gold_weight"
                              variant="outlined"
                              fullWidth
                              value={
                                totalSilverWeight
                                  ? parseFloat(totalSilverWeight).toFixed(3)
                                  : 0
                              }
                              disabled
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                    {/* ) : null} */}
                    {selectshowGoldSilverVarient !== 3 && (
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>
                          {/* {selectshowGoldSilverVarient === 1 ? "Gold" : "Silver"} */}
                          Total Net Weight(G)
                        </label>
                        <TextField
                          name="gold_weight"
                          variant="outlined"
                          error={mortageWeightErr.length > 0 ? true : false}
                          helperText={mortageWeightErr}
                          fullWidth
                          onChange={(e) => handleInputChange(e)}
                          value={
                            mortageWeight
                              ? parseFloat(mortageWeight).toFixed(3)
                              : ""
                          }
                          required
                          disabled
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                      <div>
                        <label className={classes.label}>Issue Amount</label>
                        <TextField
                          name="issue_amount"
                          variant="outlined"
                          fullWidth
                          error={
                            mortageIssueAmountErr.length > 0 ? true : false
                          }
                          helperText={mortageIssueAmountErr}
                          onChange={(e) => handleInputChange(e)}
                          value={mortageAmount}
                          required
                          disabled={
                            isEdit || isClose || isPartial ? true : false
                          }
                        />
                      </div>
                    </Grid>
                    {!isAdd ? (
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>Address</label>
                        <TextField
                          name="address"
                          variant="outlined"
                          type="text"
                          // error={mortageMobileErr.length > 0 ? true : false}
                          // helperText={mortageMobileErr}
                          fullWidth
                          // onChange={(e) => handleInputChange(e)}
                          value={address}
                          required
                          disabled={
                            isEdit || isClose || isPartial ? true : false
                          }
                        />
                      </Grid>
                    ) : null}
                    <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                      <div>
                        <label className={classes.label}>Customer Review</label>
                        <TextField
                          name="cutomerreview"
                          variant="outlined"
                          fullWidth
                          error={mortageNotesErr.length > 0 ? true : false}
                          helperText={mortageNotesErr}
                          onChange={(e) => handleInputChange(e)}
                          value={customerReview}
                          required
                          // disabled={!isAdd ? true : false}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                      <label className={classes.label}>
                        Interest Percentage (%)
                      </label>
                      <TextField
                        name="percentage"
                        variant="outlined"
                        error={mortagePerDtErr.length > 0 ? true : false}
                        helperText={mortagePerDtErr}
                        fullWidth
                        onChange={(e) => handleInputChange(e)}
                        value={mortagePercentage}
                        required
                        disabled={isEdit || isClose || isPartial ? true : false}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      style={{ marginTop: "15px", position: "relative" }}
                    >
                      <div className="packing-slip-input notes">
                        <label className={classes.label}>Note</label>
                        <Autocomplete
                          id="free-solo-demo"
                          freeSolo
                          disableClearable
                          onChange={(event, newValue) => {
                            console.log(newValue);
                            handlePackingSlipSelect(newValue);
                          }}
                          onInputChange={(event, newInputValue) => {
                            console.log(newInputValue);
                            if (event !== null) {
                              if (event.type === "change")
                                setMortageNotes(newInputValue);
                            } else {
                              isAdd && setMortageNotes("");
                            }
                          }}
                          value={mortageNotes}
                          options={packingSlipApiData.map(
                            (option) => option.notes
                          )}
                          disabled={isView}
                          renderInput={(params) => (
                            <TextField
                            {...params}
                            multiline
                            rows={3} // Adjust the number of rows here
                            variant="outlined"
                            style={{ padding: 0 }}
                        />
                          )}
                        />
                        <span className={classes.errorMessage}>
                          {mortageNotesErr.length > 0 ? mortageNotesErr : ""}
                        </span>
                        {/* <TextField
                          name="notes"
                          variant="outlined"
                          fullWidth
                          error={mortageNotesErr.length > 0 ? true : false}
                          helperText={mortageNotesErr}
                          onChange={(e) => handleInputChange(e)}
                          value={mortageNotes}
                          required
                          disabled={isClose || isPartial ? true : false}
                        /> */}
                      </div>
                    </Grid>
                    {console.log(parEndDateVal)}
                    {isEdit || isClose || isPartial ? (
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>
                          {isClose
                            ? "Close Date"
                            : isPartial
                            ? "Partial Payment Date"
                            : "New Issue Amount Date"}
                        </label>
                        <TextField
                          name="endDate"
                          type="date"
                          variant="outlined"
                          fullWidth
                          error={mortageEndDateErr.length > 0 ? true : false}
                          helperText={mortageEndDateErr}
                          inputProps={{
                            min:
                              parEndDateVal &&
                              moment(parEndDateVal).format("YYYY-MM-DD"),
                            max: moment("9999-12-31").format("YYYY-MM-DD"),
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(e) => handleChangeEndDate(e)}
                          value={mortageCloseDate}
                        />
                      </Grid>
                    ) : null}
                    {isAdd ? (
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>Reminder Date</label>
                        <TextField
                          name="remindardate"
                          type="date"
                          variant="outlined"
                          fullWidth
                          error={
                            mortageReminderDateErr.length > 0 ? true : false
                          }
                          helperText={mortageReminderDateErr}
                          inputProps={{
                            max: moment().format("DD-MM-YYYY"),
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(e) => handleInputChange(e)}
                          value={mortageReminderDate}
                        />
                      </Grid>
                    ) : null}
                    {isClose || isPartial ? (
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>Interest Amount</label>
                        <TextField
                          name="interestAmount"
                          variant="outlined"
                          fullWidth
                          disabled
                          value={totalInterest}
                        />
                      </Grid>
                    ) : null}
                    {isClose || isPartial ? (
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>Total Amount</label>
                        <TextField
                          name="totalAmount"
                          variant="outlined"
                          fullWidth
                          disabled
                          value={parseFloat(mortageCloseAmount).toFixed(2)}
                        />
                      </Grid>
                    ) : null}
                    {isPartial ? (
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>Partial Amount</label>
                        <TextField
                          name="partialAmount"
                          variant="outlined"
                          fullWidth
                          error={partialAmountErr.length > 0 ? true : false}
                          helperText={partialAmountErr}
                          onChange={(e) => handleInputChange(e)}
                          value={mortagepartialAmount}
                        />
                      </Grid>
                    ) : null}
                    {isEdit ? (
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>Add Amount</label>
                        <TextField
                          name="addAmount"
                          variant="outlined"
                          fullWidth
                          // error={partialAmountErr.length > 0 ? true : false}
                          // helperText={partialAmountErr}
                          onChange={(e) => handleInputChange(e)}
                          value={mortageAddAmount}
                        />
                      </Grid>
                    ) : null}
                    {isAdd || isEdit ? (
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <Button
                          className={clsx(classes.uibuttion)}
                          id="upload-btn-jewellery"
                          variant="contained"
                          color="primary"
                          onClick={handleClick}
                          fullWidth
                        >
                          upload documents
                        </Button>

                        <input
                          id="files"
                          type="file"
                          ref={hiddenFileInput}
                          onChange={(event) => {
                            // handleImageSelect
                            setImages(event);
                          }}
                          multiple
                          style={{ display: "none" }}
                          // disabled={isView}
                        />
                      </Grid>
                    ) : null}
                    <Grid
                      item
                      xs={12}
                      style={{ marginTop: "15px", position: "relative" }}
                    >
                      {/* <FormControlLabel control={<Checkbox />} label="Check for Compound Interest" disabled={!isAdd} name="simpleorcompound" onChange={(e) => handleInputChange(e)} /> */}
                      <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        value={simpleOrCompound}
                        name="simpleorcompound"
                        onChange={(e) => handleInputChange(e)}
                      >
                        <FormControlLabel
                          value={1}
                          disabled={!isAdd}
                          control={<Radio />}
                          label="Simple Interest"
                        />
                        <FormControlLabel
                          value={2}
                          disabled={!isAdd}
                          control={<Radio />}
                          label="Compound Interest (Monthly)"
                        />
                        {/* <div style={{ width: 110 }}>
                          <Select
                            options={CompIntType.map((group) => ({
                              value: group.id,
                              label: group.name,
                            }))}
                            fullWidth
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            value={selectedCompType}
                            onChange={(e) => handleSelectCompType(e)}
                            placeholder="Select"
                          />
                        </div> */}
                        <FormControlLabel
                          value={3}
                          disabled={!isAdd}
                          control={<Radio />}
                          label="Compound Interest (Yearly)"
                        />
                      </RadioGroup>
                      <span className={classes.errorMessage}>
                        {simpleOrCompoundErr.length > 0
                          ? simpleOrCompoundErr
                          : ""}
                      </span>
                      {/* {simpleOrCompoundErr && (
                        <div style={{ color: "red" }}>
                          {simpleOrCompoundErr}
                        </div>
                      )} */}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{ marginTop: "30px", textAlign: "center" }}
                    >
                      <Button
                        variant="contained"
                        className="w-128 mx-auto popup-cancel"
                        aria-label="Register"
                        onClick={handleModalClose}
                      >
                        Cancel
                      </Button>
                      {isPartial ? (
                        <Button
                          variant="contained"
                          className="w-160 mx-auto popup-save"
                          style={{ marginLeft: "20px" }}
                          onClick={checkforPrint}
                        >
                          Print
                        </Button>
                      ) : (
                        ""
                      )}
                      {isAdd || isPartial ? (
                        <Button
                          variant="contained"
                          className="w-160 mx-auto popup-save"
                          style={{ marginLeft: "20px" }}
                          onClick={() => handleFormSubmit(1)}
                        >
                          Save & Print
                        </Button>
                      ) : (
                        ""
                      )}
                      <Button
                        variant="contained"
                        className="w-160 mx-auto popup-save"
                        style={{ marginLeft: "20px" }}
                        onClick={isClose ? handleOpenAlert : handleFormSubmit}
                      >
                        {/* Save */}
                        {isClose ? "Paid & Close" : "Save"}
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    justifyContent="flex-start"
                    style={{ marginTop: 16 }}
                  >
                    {console.log("imgFiles", imgFiles, isAdd)}
                    {isAdd || isEdit ? (
                      <>
                        {imgFiles
                          // .filter((row) =>
                          //   /\.(gif|jpe?g|png|webp|bmp|svg)$/i.test(row.upload_file_name)
                          // )
                          .map((row, index) => {
                            console.log(row.image_file);
                            return (
                              <Grid item key={index}>
                                <div
                                  style={{
                                    padding: 10,
                                    border: "1px dashed black",
                                    borderRadius: "25px",
                                    cursor: "pointer",
                                    position: "relative",
                                  }}
                                >
                                  {console.log(row)}
                                  {isAdd ? (
                                    <Icon
                                      onClick={() => handleRemoveRow(index)}
                                      className={classes.closeIcon}
                                    >
                                      close
                                    </Icon>
                                  ) : null}
                                  <img
                                    src={row.image_file}
                                    style={{
                                      width: "auto",
                                      height: "100px",
                                      marginInline: "auto",
                                      display: "block",
                                    }}
                                    alt="img"
                                    onClick={() => {
                                      setModalView(3);
                                      setImageUrl(row.image_file);
                                      setImage(row.upload_file_name);
                                    }}
                                  />
                                </div>
                              </Grid>
                            );
                          })}
                      </>
                    ) : null}
                    {console.log("imgFileArr", imgFileArr)}
                    {/* {isEdit &&
                      imgFiles
                        .filter((row) =>
                          /\.(gif|jpe?g|png|webp|bmp|svg)$/i.test(
                            row.upload_file_name
                          )
                        )
                        .map((row, index) => (
                          <Grid item key={index}>
                            <div
                              style={{
                                padding: 10,
                                border: "1px dashed black",
                                borderRadius: "25px",
                                cursor: "pointer",
                                position: "relative",
                              }}
                            >
                              <img
                                src={row.image_file}
                                style={{
                                  width: "auto",
                                  height: "100px",
                                  marginInline: "auto",
                                  display: "block",
                                }}
                                alt=""
                                onClick={() => {
                                  setModalView(3);
                                  setImageUrl(row.image_file);
                                  setImage(row.upload_file_name);
                                }}
                              />
                            </div>
                          </Grid>
                        ))} */}
                    {/* <Grid item xs={12}>
                      <List>
                        {imgFiles
                          .filter(
                            (row) =>
                              !/\.(gif|jpe?g|png|webp|bmp|svg)$/i.test(
                                row.image
                              )
                          )
                          .map((row, index) => (
                            <ListItem key={index}>{row.image}</ListItem>
                          ))}
                      </List>
                    </Grid> */}
                  </Grid>
                </div>
                {isAdd || isClose || isPartial ? (
                  <>
                    {mortgagePayments.length > 1 ? (
                      <Paper
                        style={{
                          padding: "30px",
                          boxShadow: "none",
                          paddingTop: 0,
                        }}
                      >
                        <h3 style={{ marginBottom: "10px" }}>
                          New Issue Amount
                        </h3>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
                                Date
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Amount
                              </TableCell>
                              {/* <TableCell
                                className={classes.tableRowPad}
                                style={{ textAlign: "left" }}
                              >
                                Interest
                              </TableCell> */}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {mortgagePayments
                              .filter((data) => data.is_added !== 0)
                              .map((data, i) => (
                                <TableRow key={i}>
                                  <TableCell className={classes.tableRowPad}>
                                    {moment(data.issue_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.amount}
                                  </TableCell>
                                  {/* <TableCell
                                  className={classes.tableRowPad}
                                  style={{ textAlign: "left" }}
                                >
                                  {data.interest}
                                </TableCell> */}
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    ) : null}
                  </>
                ) : null}
                {isClose || isPartial ? (
                  <>
                    {mortagePartialEntry.length > 0 ? (
                      <Paper
                        style={{
                          padding: "30px",
                          boxShadow: "none",
                          paddingTop: 0,
                        }}
                      >
                        <h3 style={{ marginBottom: "10px" }}>
                          Partial Payments
                        </h3>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
                                Date
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Principal Amount
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Refinance Amount
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Interest
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Paid Amount
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Balance
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{ textAlign: "left" }}
                              >
                                Type
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {mortagePartialEntry
                              // .filter(data => data.is_added !== 1)
                              .map((data, i) => (
                                <TableRow key={i}>
                                  <TableCell className={classes.tableRowPad}>
                                    {moment(data.payment_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.principal_amount}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data?.added_amount
                                      ? parseFloat(data.added_amount).toFixed(2)
                                      : `-`}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.interest}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.part_pay_amount}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.remaining_balance}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    style={{ textAlign: "left" }}
                                  >
                                    <span
                                      style={{
                                        padding: 3,
                                        borderRadius: 7,
                                        background: "#ebeefb",
                                        color:
                                          data.is_added === 1 ? "green" : "red",
                                      }}
                                    >
                                      {data.is_added === 1 ? "Added" : "Paid"}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    ) : null}
                  </>
                ) : null}
              </Box>
            </>
          </div>
        </Modal>
        {/* <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={openClientModal}
          // onClose={(_, reason) => {
          //   if (reason !== "backdropClick") {
          //     setClientdetail();
          //   }
          // }}
        >
          <div
            style={modalStyle}
            className={clsx(classes.paper, "rounded-8")}
          >
            <div className="p-5 pl-16 pr-16 inner-metal-modesize-dv"> */}
        <AddNewMortgageUser
          newUserName={mortgageNamePass}
          openClientModal={openClientModal}
          setOpenClientModal={setOpenClientModal}
          onFormSubmit={handelUserList}
        />
        {/* </div>
          </div>
        </Modal> */}
        <Dialog
          open={openAlert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            className="alertbox popup-delete"
          >
            {"Alert!!!"}
            <IconButton
              style={{
                position: "absolute",
                marginTop: "-5px",
                right: "15px",
              }}
              onClick={handleCloseAlert}
            >
              <img
                src={Icones.cross}
                className="delete-dialog-box-image-size"
                alt=""
              />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure to close this gold mortgage? <br />
              Make sure all payments are completed.
            </DialogContentText>
          </DialogContent>
          <DialogActions className="alertbox">
            <Button
              onClick={handleCloseAlert}
              className="delete-dialog-box-cancle-button"
            >
              No
            </Button>
            <Button
              className="delete-dialog-box-delete-button"
              autoFocus
              onClick={()=>handleFormSubmit(1)}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openDeleteAlert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            className="alertbox popup-delete"
          >
            {"Alert!!!"}
            <IconButton
              style={{
                position: "absolute",
                marginTop: "-5px",
                right: "15px",
              }}
              onClick={handleDeleteCloseAlert}
            >
              <img
                src={Icones.cross}
                className="delete-dialog-box-image-size"
                alt=""
              />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this Mortgage?
            </DialogContentText>
          </DialogContent>
          <DialogActions className="alertbox">
            <Button
              onClick={handleDeleteCloseAlert}
              className="delete-dialog-box-cancle-button"
            >
              No
            </Button>
            <Button
              className="delete-dialog-box-delete-button"
              autoFocus
              onClick={deleteMortgage}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        {modalView === 3 && (
          <DisplayImage
            modalColsed={handleCloseImage}
            imageUrl={imageUrl}
            image={image}
          />
        )}
      </div>
      <div style={{ display: "none" }}>
        <MortagePrint ref={componentRef} printObj={printObj} />
      </div>
    </>
  );
};

export default Mortage;

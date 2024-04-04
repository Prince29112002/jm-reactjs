import React, { useState, useEffect, useRef ,useContext} from "react";
import { Typography } from "@material-ui/core";
import { Button, TextField,Paper,Table,TableFooter,Icon, IconButton  } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import Select, { createFilter } from "react-select";
import moment from "moment";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Loader from "app/main/Loader/Loader";
import History from "@history";
import { JewelPurcRetailerPrintComp } from "../ComponentsRetailer/JewelPurcRetailerPrintComp";
import { useReactToPrint } from "react-to-print";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
import barcodedFile from "app/main/SampleFiles/JewelleryPurchaseRetailor/Load_Barcode_wise.csv"
import { UpdateRetailerNarration } from "../../Helper/UpdateRetailerNarration";
import Icones from "assets/fornt-icons/Mainicons";
import TagWiseListRetailer from "../ComponentsRetailer/TagWiseListRetailer";
import { DocumentUploadRetailer } from "app/main/apps/SalesPurchase/Helper/DocumentUploadRetailer";
import ViewDocModelRetailer from "app/main/apps/SalesPurchase/Helper/ViewDocModelRetailer";
import AppContext from "app/AppContext";

const useStyles = makeStyles((theme) => ({
  root: {},
  tableRowPad: {
    padding: 7,
  },
  tablePad: {
    padding: 0,
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
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    // marginLeft: 15,
  },
  tabroot: {
    // overflowX: "auto",
    // overflowY: "auto",
    height: "100%",
  },
  tableheader: {
    display: "inline-block",
    textAlign: "center",
  },
  paper: {
    position: "absolute",
    // width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
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
  table: {
    minWidth: 900,
  },
  diffPopup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
  button: {
    // margin: 5,
    textTransform: "none",
    // backgroundColor: "gray",
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
  };
}

const AddJewellaryPurchaseRetailer = (props) => {

  const appContext = useContext(AppContext);
  const { SateID } = appContext;

  const [printObj, setPrintObj] = useState({
    orderDetails: [],
    taxableAmount: "",
    sGstTot: "",
    cGstTot: "",
    iGstTot: "",
    roundOff: "",
    pcsTotal: "",
    grossWtTOt: "",
    netWtTOt: "",
    totalInvoiceAmt: "",
    stateId: "",
    taxAmount: "",
    jewelNarration: "",
    accNarration: "",
    balancePayable: "",
    Finetotal: "",
    HmChargesTotal: "",
  });

  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);
  const loadTypeRef = useRef(null);

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
  const inputRef = useRef([]);

  useEffect(() => {
    if (docFile) {
      DocumentUploadRetailer(docFile, 2)
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

  const handleAfterPrint = () => {
    checkAndReset();
  };
  function checkAndReset() {
    if (isView === false) {
      History.goBack();
    }
  }
  const handleBeforePrint = React.useCallback(() => {}, []);
  const handleOnBeforeGetContent = React.useCallback(() => {
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
    documentTitle: "Jewellery_Purchase_Voucher_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
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

  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    setUploadErr("");
    hiddenFileInput.current.click();
  };

  const handlefilechange = (event) => {
    setIsCsvErr(false);
    handleFile(event);
  };

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);

  const [goldRate, setGoldRate] = useState("");
  const [goldRateErr, setGoldRateErr] = useState("");
  const [actualGoldRate, setActualGoldRate] = useState(false);
  const [goldMaxValue, setGoldMaxValue] = useState(0);
  const [goldMinValue, setGoldMinValue] = useState(0);

  const [silverRate, setSilverRate] = useState("");
  const [silverRateErr, setSilverRateErr] = useState("");
  const [actualSilverrate, setActualSilverrate] = useState(false);
  const [silverMaxValue, setSilverMaxValue] = useState(0);
  const [silverMinValue, setSilverMinValue] = useState(0);

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");
  const [vStateId, setvStateId] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [selectedLoad, setSelectedLoad] = useState({value: 0,label : "Load Manulally"});
  const [selectedLoadErr, setSelectedLoadErr] = useState("");
  const [uploadType, setUploadType] = useState("2");
  const [bomType, setBomType] = useState(0);

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [vendorData, setVendorData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedVendorErr, setSelectedVendorErr] = useState("");

  const [frimeName, setFrimeName] = useState([]);
  const [selectedFrimeName, setSelectedFrimeName] = useState("");
  const [selectedFrimeNameErr, setSelectedFrimeNameErr] = useState("");

  const [csvData, setCsvData] = useState([]);
  const [isCsvErr, setIsCsvErr] = useState(false);

  const [oppositeAccData, setOppositeAccData] = useState([]);
  const [oppositeAccSelected, setOppositeAccSelected] = useState("");
  const [selectedOppAccErr, setSelectedOppAccErr] = useState("");

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");
  const [categoryList, setcategoryList] = useState([])
  const [formValues, setFormValues] = useState([
    {
      Barcode: "",
      Category: "",
      HSNNum: "",
      Pieces:"",
      grossWeight: "",
      netWeight: "",
      purity: "",
      fine :"",
      rate: "",
      wastagePer : "",
      wastageFine : "",
      hallmarkCharges : "",
      totalAmount: "",
      cgstPer: "",
      cgstVal: "",
      sGstPer: "",
      sGstVal: "",
      IGSTper: "",
      IGSTVal: "",
      labour:"",
      total: "",
      sales_price:"",
      isSilver : true,
      errors: {},
    },
  ]);

  const [roundOff, setRoundOff] = useState("");
  const [roundOffErr, SetRoundOffErr] = useState("");
  const [vendorGST, setvenderGST] =useState("")
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState("");

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [jewelNarration, setJewelNarration] = useState("");
  const [jewelNarrationErr, setJewelNarrationErr] = useState("");

  const [vendorStateId, setVendorStateId] = useState("");
  const [totalGST, setTotalGST] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [grossTotal, setGrossTotal] = useState(0)
  const [netWgtTotal, setNetWgtTotal] = useState(0)
  const [fineTotal, setFineTotal] = useState(0)
  const [wastTotal, setWastTotal] = useState(0)
  const [hallmarkTotal, setHallmarkTotal] = useState(0)
  const [sgstTotal, setSgstTotal] = useState(0)
  const [igstTotal, setIgstTotal] = useState(0)
  const [cgstTotal, setCgstTotal] = useState(0)
  const [TotalAmount, setTotalAmount] = useState(0)

  const [fileSelected, setFileSelected] = useState("");
  const [isUploaded, setIsuploaded] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [tagWiseData, setTagWiseData] = useState([]);
  const theme = useTheme();
  const isPasswordTwo = localStorage.getItem("isPasswordTwo");

  var idToBeView;
  if (props.location) {
    idToBeView = props.location.state;
  } else if (props.voucherId) {
    idToBeView = { id: props.voucherId };
  }

  const [isView, setIsView] = useState(false); //for view Only
  const [narrationFlag, setNarrationFlag] = useState(false);
  const pcsInputRef = useRef([]); //for pcs in table

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
    // visible true -> false
    if (loading) {
      //setTimeout(() => setLoaded(true), 250);
      //debugger;
      setTimeout(() => setLoading(false), 7000);
    }
    //setLoaded(loaded);
  }, [loading]);

  useEffect(() => {
    const accArr = HelperFunc.getOppositeAccountDetails("JewelleryPurchase")
    setOppositeAccData(accArr);
    setOppositeAccSelected(accArr[0])

    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true);
      getJewelPurchaseRecordForView(idToBeView.id);
    } else {
      setNarrationFlag(false);
      getVendordata();
      getTodaysGoldRate();
      getTodaysSilverRate();
      getCategoryList()
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
    if (selectedVendor) {
      getFrimeName(selectedVendor.value);
    }
  }, [selectedVendor]);

  useEffect(() => {
    if (isUploaded && fileSelected) {
      uploadfileapicall(fileSelected);
    }
  }, [isUploaded]);

  useEffect(() => {
    if(!isView){
      const sub = subTotal ? subTotal : 0
      const gst = totalGST ? totalGST : 0
      const round = roundOff ? roundOff : 0
  
      const finalAmt = parseFloat(sub) + parseFloat(gst) + parseFloat(round)
      setTotalInvoiceAmount(parseFloat(finalAmt))
    }
  }, [subTotal,totalGST,roundOff]);

  function getCategoryList() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/productcategory")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setcategoryList(response.data.data);
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
          api: "retailerProduct/api/goldRateToday",
        });
      });
  }


  function getTodaysGoldRate() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/goldRateToday")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const goldrateval = response.data.data.rate;
          const percentage = response.data.data.percentage;
          const minValue =
            goldrateval - (goldrateval * parseFloat(percentage)) / 100;
          const maxValue =
            goldrateval + (goldrateval * parseFloat(percentage)) / 100;
          console.log(minValue, maxValue, "....");
          setGoldRate(goldrateval);
          setActualGoldRate(true);
          setGoldMaxValue(maxValue);
          setGoldMinValue(minValue);
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

  function getFrimeName(vendorId) {
    axios
      .get(
        Config.getCommonUrl() +
          `retailerProduct/api/vendor/all/company/${vendorId}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data, "frimeData");
          setFrimeName(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `retailerProduct/api/vendor/all/company/${vendorId}`,
        });
      });
  }

  function getJewelPurchaseRecordForView(id) {
    setLoading(true);
    let api = "";
    if (props.forDeletedVoucher && isPasswordTwo == 0) {
      api = `retailerProduct/api/jewellerypurchase/${id}?deleted_at=1`;
    } else if (isPasswordTwo == 0) {
      api = `retailerProduct/api/jewellerypurchase/${id}`;
    } else if (isPasswordTwo == 1) {
      api = `retailerProduct/api/jewelleryPurchaseWt/wt/${id}`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              let finalData = response.data.data.data;
              let otherDetail = response.data.data.otherDetails;

              setSelectedVendor({
                value: finalData.VendorCompany.vendorDetailJP.id,
                label: finalData.VendorCompany.vendorDetailJP.name,
              });

              setSelectedFrimeName({
                value: finalData.VendorCompany.id,
                label: finalData.VendorCompany.firm_name,
              });
              setDocumentList(finalData.salesPurchaseDocs);
              if (otherDetail.loadType === 1) {
                setUploadType(otherDetail.uploadType.toString());
              }
              setVoucherNumber(finalData.voucher_no);
              setAllowedBackDate(true);
              setVoucherDate(finalData.purchase_voucher_create_date);
              var mainObj = finalData.VendorCompany.vendorDetailJP;
              setOppositeAccSelected({
                value: finalData.opposite_account_id,
                label: finalData.OppositeAccount.name,
              });
              setPartyVoucherNum(finalData.party_voucher_no);
              setPartyVoucherDate(finalData.party_voucher_date);
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
              setJewelNarration(
                finalData.jewellery_narration !== null
                  ? finalData.jewellery_narration
                  : ""
              );
              setGoldRate(finalData?.gold_rate);
              setSilverRate(finalData?.silver_rate);
              setSelectedLoad(finalData?.entry_type === 1 ? {value : 1 , label : "Load Barcoded Stock form excel"} : {value : 0 , label : "Load Manulally"});
              setVendorStateId(finalData.JewelleryPurchaseOrders[0].igst !== null ? 0 : SateID);
                let tagwiseArr = [];
                for (let item of finalData.JewelleryPurchaseOrders) {
                  tagwiseArr.push({
                    Barcode: item.barcode,
                    Category: finalData?.entry_type === 1 ? item.ProductCategory.category_name : {value : item.ProductCategory.id, label: item.ProductCategory.category_name},
                    HSNNum: item.ProductCategory.hsn_master.hsn_number,
                    Pieces: item.pcs,
                    grossWeight: item.gross_wt,
                    netWeight: item.net_wt,
                    purity: item.purity,
                    fine:item.fine,
                    rate: item.fine_rate,
                    wastagePer: item.wastage_per,
                    wastageFine: item.wastage_fine,
                    hallmarkCharges: item.hallmark_charges,
                    totalAmount: item.total_amount,
                    cgstPer: item.cgst,
                    sales_price:item.sales_price,
                    cgstVal:
                      item.cgst !== null
                        ? parseFloat(
                            (parseFloat(item.total_amount) *
                              parseFloat(item.cgst)) /
                              100
                          )
                        : "",
                    sGstPer: item.sgst,
                    sGstVal:
                      item.sgst !== null
                        ? parseFloat(
                            (parseFloat(item.total_amount) *
                              parseFloat(item.sgst)) /
                              100
                          )
                        : "",
                    IGSTper: item.igst,
                    IGSTVal:
                      item.igst !== null
                        ? parseFloat(
                            (parseFloat(item.total_amount) *
                              parseFloat(item.igst)) /
                              100
                          )
                        : "",
                    total: parseFloat(item.total),
                    labour:item.labour_amount
                  });
                }
                if(finalData?.entry_type === 1){
                  setTagWiseData(tagwiseArr);
                  setFormValues(tagwiseArr)
                  setIsuploaded(true);
                }else{
                  setFormValues(tagwiseArr)
                }
                totalCalculation(tagwiseArr)
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

  function getVoucherNumber() {
    let api = "";
    if (isPasswordTwo == 1) {
      api = "retailerProduct/api/jewelleryPurchaseWt/wt/get/voucher";
    } else {
      api = "retailerProduct/api/jewellerypurchase/get/voucher";
    }
    axios
      .get(Config.getCommonUrl() + api)
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
          api: api,
        });
      });
  }

  function handleFile(e) {
    e.preventDefault();
    var files = e.target.files,
      f = files[0];
    setFileSelected(f);
    setIsuploaded(true);
  }

  //verifying file here then on save upload again
  function uploadfileapicall(f) {
    const formData = new FormData();
    formData.append("file", f);
    formData.append("voucher_no", voucherNumber);
    formData.append("party_voucher_no", partyVoucherNum);
    formData.append("opposite_account_id", oppositeAccSelected.value);
    formData.append(
      "department_id",
      window.localStorage.getItem("SelectedDepartment")
    );
    formData.append("vendor_id", selectedFrimeName.value);
    formData.append("round_off", roundOff === "" ? 0 : roundOff);
    formData.append("jewellery_narration", jewelNarration);
    formData.append("account_narration", accNarration);
    formData.append("is_vendor_client", 1);
    formData.append("is_barcoded", 1);
    formData.append("is_packingSlip", 0);
    formData.append("is_packetNo", 0);
    formData.append("with_bom", bomType);
    formData.append("setRate", goldRate);
    formData.append("silver_rate", silverRate);

    if (allowedBackDate) {
      formData.append("purchaseCreateDate", voucherDate);
    }
    setLoading(true);
    let api = "";
    if (isPasswordTwo == 1) {
      api = "retailerProduct/api/jewelleryPurchaseWt/wt/createfromexcel";
    } else {
      api = "retailerProduct/api/jewellerypurchase/createfromexcel";
    }
    axios
      .post(Config.getCommonUrl() + api, formData)
      .then(function (response) {
        console.log(response);
        setLoading(false);
        if (response.data.success === true) {
          console.log(response);
          setIsCsvErr(false);
          let OrdersData = response.data.data.OrdersData;
          let tempArray = [];

          for (let item of OrdersData) {
            tempArray.push({
              Barcode: item.barcode,
              sales_price:item.sales_price,
              Category: item.Category,
              HSNNum: item.hsnNumber,
              Pieces: item.pcs,
              grossWeight: item.gross_wt,
              netWeight: item.net_wt,
              purity: item.purity,
              fine: item.fine,
              rate : item.rate,
              wastagePer: item.wastage_per,
              wastageFine: item.wastage_fine,
              hallmarkCharges: item.hallmarkChargesFrontEnd,
              totalAmount: item.total_amount,
              cgstPer: item?.cgst,
              cgstVal: item.cgstAmount ? item.cgstAmount : 0,
              sGstPer: item?.sgst,
              sGstVal: item.sgstAmount ? item.sgstAmount : 0,
              IGSTper: item?.igst,
              IGSTVal: item.igstAmount ? item.igstAmount : 0,
              total: item.total,
              labour_amount : item.labour_amount
            });
          }
          totalCalculation(tempArray)
          setTagWiseData(tempArray);
        } else {
          if (response.data.csverror === 1) {
            if (response.data.hasOwnProperty("url")) {
              let downloadUrl = response.data.url;
              setCsvData(downloadUrl);
            }
            setIsCsvErr(true);
          }
          setFileSelected("");
          setIsuploaded(false);
          console.log(document.getElementById("fileinput").value, "myfileeeee");
          document.getElementById("fileinput").value = "";
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
        setFileSelected("");
        setIsuploaded(false);
        document.getElementById("fileinput").value = "";
        handleError(error, dispatch, {
          api: api,
          body: JSON.stringify(formData),
        });
      });
  }

  const handleChange = (index,e) => {
    const name = e.target.name;
    const value = e.target.value;

    const newData = [...formValues];
    newData[index][name] = value;
    newData[index].errors[name] = "";

    const grossNetRegex = /^(?!0\d)\d{1,9}(?:\.\d+)?$/
    const pcsRegex = /^[1-9]\d{0,8}$/
    
    if (name === "Pieces" && (pcsRegex.test(value) === false || isNaN(value))) {
      newData[index].errors[name] = "Enter valid pcs"
    }    
    else if (name === "grossWeight") {
      if(grossNetRegex.test(value) === false || isNaN(value)){
        newData[index].errors[name] = "Enter valid gross weight"
      } else if (parseFloat(newData[index].netWeight) >  parseFloat(newData[index].grossWeight)){
        newData[index].errors['netWeight'] = "Net weight can not be greater than gross weight"
      }else if (newData[index].errors['netWeight'] && parseFloat(newData[index].netWeight) <=  parseFloat(newData[index].grossWeight)){
        newData[index].errors['netWeight'] = ""
      }
    }
    else if (name === "netWeight") {
      if(grossNetRegex.test(value) === false || isNaN(value)){
        newData[index].errors[name] = "Enter valid net weight"
      } else if (parseFloat(newData[index].netWeight) >  parseFloat(newData[index].grossWeight)){
        newData[index].errors[name] = "Net weight can not be greater than gross weight"
      }
    }
    else if (name === "purity" && (grossNetRegex.test(value) === false || isNaN(value))) {
      newData[index].errors[name] = "Enter valid purity"
    }
    else if (name === "hallmarkCharges" && (grossNetRegex.test(value) === false || isNaN(value))) {
      newData[index].errors[name] = "Enter valid hallmark charges"
    } else if (name === "wastagePer" && (grossNetRegex.test(value) === false || isNaN(value))) {
      newData[index].errors[name] = "Enter valid wastage percentage"
    }

    if(name === "netWeight" || name === "purity") {
     if(newData[index].netWeight && newData[index].purity){
      newData[index].fine = parseFloat(parseFloat(newData[index].netWeight) * parseFloat(newData[index].purity) / 100)
     }else{
      newData[index].fine = ""
     }
    }

     if(name === "wastagePer" || name === "netWeight"){
      if(newData[index].netWeight && newData[index].wastagePer){
        newData[index].wastageFine = parseFloat(parseFloat(newData[index].netWeight) * parseFloat(newData[index].wastagePer) / 100)
      }else{
        newData[index].wastageFine = ""
      }
     }

     const fineVal = newData[index].fine ? parseFloat(newData[index].fine).toFixed(2) : 0;
     const wastfines = newData[index].wastageFine ? parseFloat(newData[index].wastageFine).toFixed(2) : 0;
     const hallmark = newData[index].hallmarkCharges ? parseFloat(newData[index].hallmarkCharges).toFixed(2) : 0;
     const labourAmt = newData[index].labour ? newData[index].labour : 0 

     const totalFines = parseFloat(fineVal) + parseFloat(wastfines)
     const rateCharge = parseFloat(parseFloat(totalFines) * parseFloat(newData[index].rate) / 10)
     const amt = parseFloat(parseFloat(rateCharge) + parseFloat(hallmark))

     newData[index].totalAmount = amt ? parseFloat(amt).toFixed(2) : 0

     if(newData[index].cgstPer && newData[index].sGstPer && newData[index].totalAmount){
      const tempAmt = parseFloat(newData[index].totalAmount).toFixed(2) 
      const cgstamt = (tempAmt * newData[index].cgstPer) / 100 ;
      const sgstamt = (tempAmt * newData[index].sGstPer) / 100 ;
      newData[index].cgstVal = parseFloat(cgstamt);
      newData[index].sGstVal = parseFloat(sgstamt);
      newData[index].total = parseFloat(cgstamt) + parseFloat(sgstamt) + parseFloat(tempAmt) + parseFloat(labourAmt)
    }
    else if(newData[index].IGSTper && newData[index].totalAmount){
      const igstamt = (parseFloat(newData[index].totalAmount) * newData[index].IGSTper) / 100 ;
      newData[index].IGSTVal = parseFloat(igstamt)
      newData[index].total = parseFloat(igstamt) + parseFloat(newData[index].totalAmount) + parseFloat(labourAmt)
    }else {
      newData[index].total =  parseFloat(newData[index].totalAmount) + parseFloat(labourAmt)
    }
    if(newData[index].Barcode && newData[index].Category){
      totalCalculation(newData)
    }
    setFormValues(newData)
  }

  const handleCatChange = (value,i) => {
    const newData = [...formValues];

    newData[i].Category =  value   
    newData[i].errors.Category =  ""   
    newData[i].HSNNum = value.hsn_master.hsn_number
    if(value.is_gold_silver === 0){
      newData[i].rate = goldRate
      newData[i].isSilver = false
    }else if(value.is_gold_silver === 1){
      newData[i].rate = silverRate
      newData[i].isSilver = true
      newData[i].hallmarkCharges = 0
    }

    if(SateID === vendorStateId){
      const valGst = parseFloat(value.hsn_master.gst) / 2
      newData[i].cgstPer = valGst
      newData[i].sGstPer = valGst
    }else{
      newData[i].IGSTper = parseFloat(value.hsn_master.gst)
    }
    setFormValues(newData)
    if(!newData[i + 1]){
      addNewRowAdd()
    }
  }

  const addNewRowAdd = () => {
    setFormValues([
      ...formValues, {
        Barcode: "",
        sales_price:"",
        Category: "",
        HSNNum: "",
        Pieces:"",
        grossWeight: "",
        netWeight: "",
        purity: "",
        fine :"",
        rate: "",
        wastagePer : "",
        wastageFine : "",
        hallmarkCharges : "",
        totalAmount: "",
        cgstPer: "",
        cgstVal: "",
        sGstPer: "",
        sGstVal: "",
        IGSTper: "",
        IGSTVal: "",
        total: "",
        labour:"",
        isSilver : true,
        errors: {},
      }
    ])
  }

  const totalCalculation = (arrData) => {
    const gwgt = HelperFunc.getTotalOfField(arrData, "grossWeight")
    const nwgt = HelperFunc.getTotalOfField(arrData, "netWeight")
    const fgold = HelperFunc.getTotalOfField(arrData, "fine")
    const waste = HelperFunc.getTotalOfField(arrData, "wastageFine")
    const hallmark = HelperFunc.getTotalOfField(arrData, "hallmarkCharges")
    const amt = HelperFunc.getTotalOfField(arrData, "totalAmount")
    const sgstval = HelperFunc.getTotalOfField(arrData, "sGstVal")
    const igstval = HelperFunc.getTotalOfField(arrData, "IGSTVal")
    const cgstval = HelperFunc.getTotalOfField(arrData, "cgstVal")
    const amtTotal = HelperFunc.getTotalOfField(arrData, "total")

    setGrossTotal(parseFloat(gwgt))
    setNetWgtTotal(parseFloat(nwgt))
    setFineTotal(parseFloat(fgold))
    setSgstTotal(parseFloat(sgstval))
    setIgstTotal(parseFloat(igstval))
    setCgstTotal(parseFloat(cgstval))
    setSubTotal(parseFloat(amt))
    setWastTotal(parseFloat(waste))
    setHallmarkTotal(parseFloat(hallmark))
    setTotalAmount(parseFloat(amtTotal))
    setTotalGST(parseFloat(sgstval) + parseFloat(igstval) + parseFloat(cgstval))
  }

  function getVendordata() {
    axios
      .get(
        Config.getCommonUrl() +
          "retailerProduct/api/vendor/both/vendorandclient"
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setVendorData(response.data.data);
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
          api: "retailerProduct/api/vendor/both/vendorandclient",
        });
      });
  }

  function handleOppAccChange(value) {
    setOppositeAccSelected(value);
    setSelectedOppAccErr("");
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "goldRate" && !isNaN(value)) {
      setGoldRate(value);
      if (actualGoldRate) {
        if (
          parseFloat(value) >= goldMinValue &&
          parseFloat(value) <= goldMaxValue
        ) {
          setGoldRateErr("");
        } else {
          setGoldRateErr(
            `Please, enter today's rate between ${goldMinValue} to ${goldMaxValue}`
          );
        }
        reset()
      }
      else {
        setGoldRateErr("Enter today's gold rate in master");
      }
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
        reset()
      }
      else {
        setSilverRateErr("Enter today's silver rate in master");
      }
    }else if (name === "voucherNumber") {
      setVoucherNumber(value);
      setVoucherNumErr("");
    } else if (name === "voucherDate") {
      setVoucherDate(value);
      setVoucherDtErr("");
    } else if (name === "partyVoucherNum") {
      setPartyVoucherNum(value);
      setPartyVoucherNumErr("");
    } else if (name === "jewelNarration") {
      setJewelNarration(value);
      setJewelNarrationErr("");
    } else if (name === "accNarration") {
      setAccNarration(value);
      setAccNarrationErr("");
    } else if (name === "roundOff" && !isNaN(value)) {
      setRoundOff(value);
      // if (value > 50 || value < -50) {
      //   SetRoundOffErr("Please Enter value between -50 to 50");
      // } else {
      //   SetRoundOffErr("");
      // }
    }
  }

  const voucherNumValidation = () => {
    if (partyVoucherNum === "") {
      setPartyVoucherNumErr("Enter valid party voucher number");
      return false;
    }
    return true;
  }

  const partyNameValidation = () => {
    if (selectedVendor === "") {
      setSelectedVendorErr("Please select party name");
      return false;
    }
    return true;
  }

  const FrimeNameValidation = () => {
    if (selectedFrimeName === "") {
      setSelectedFrimeNameErr("Please select firm name");
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

  const goldRateValueValidation = () => {
    if ((!actualGoldRate || goldRateErr) && !isView) {
      if(!actualGoldRate){
        setGoldRateErr("Enter today's gold rate in master");
      }
      return false;
    } 
    return true  
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

  function hasStockEntry() {
    if(selectedLoad.value === 0){
      if (formValues[0].Barcode === "") {
        dispatch(
          Actions.showMessage({
            message: "Please Add Purchase Entry",
            variant: "error",
          })
        );
        return false;
      }
      return true;
    }else{
      if (tagWiseData.length === 0) {
        setUploadErr("Please Upload File");
        return false;
      }
      return true;
    }
  }

  function barcodeEntryValidation() {
    const oldData = [...formValues];

    const grossNetRegex = /^(?!0\d)\d{1,9}(?:\.\d+)?$/
    const pcsRegex = /^[1-9]\d{0,8}$/

    oldData.map((item, i) => {
      if (item.Barcode || item.Category) {
        if (item.Barcode === "") {
          item.errors.Barcode = "Enter text or barcode"
        } else if (item.Category === "") {
          item.errors.Category = "Select category"
        } else if (item.Pieces === "" || pcsRegex.test(item.Pieces) === false) {
          item.errors.Pieces = "Enter valid pcs"
        } else if (item.grossWeight === "" || item.grossWeight == 0 || grossNetRegex.test(item.grossWeight) === false) {
          item.errors.grossWeight = "Enter valid gross weight"
        } else if (item.netWeight === "" || item.netWeight == 0 || grossNetRegex.test(item.netWeight) === false) {
          item.errors.netWeight = "Enter valid net weight"
        } else if (item.purity === "" || item.purity == 0 || grossNetRegex.test(item.purity) === false) {
          item.errors.purity = "Enter valid purity"
        } else if (item.rate === "" || item.rate == 0 || grossNetRegex.test(item.rate) === false) {
          item.errors.rate = "Enter valid rate"
        } else if (item.wastagePer === "" || grossNetRegex.test(item.wastagePer) === false) {
          item.errors.wastagePer = "Enter valid wastage"
        } else if (item.hallmarkCharges === "" || grossNetRegex.test(item.hallmarkCharges) === false) {
          item.errors.hallmarkCharges = "Enter valid hallmarkCharges"
        }
      }
    })
    setFormValues(oldData)
    return true
  }

  const validateEmpty = () => {
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

  const manuallEntry = () => {
    if(selectedLoad.value === 0){
      if(!isUploaded && barcodeEntryValidation() &&  validateEmpty()){
        return true;
      }else {
        return false;
      }
    }else{
      return true;
    }
  }

  const getprintObj = () => {
    setPrintObj({
      supplierName: selectedVendor.label,
      supplierGstUinNum:vendorGST,
      orderDetails: selectedLoad.value === 0 ? formValues : tagWiseData,
      taxableAmount: totalGST,
      voucherDate: moment(voucherDate).format("DD-MM-YYYY"),
      purcVoucherNum: voucherNumber,
      sGstTot: sgstTotal,
      cGstTot: cgstTotal,
      iGstTot: igstTotal,
      roundOff: roundOff,
      pcsTotal: HelperFunc.getTotalOfFieldNoDecimal(selectedLoad.value === 0 ? formValues : tagWiseData, "Pieces"),
      grossWtTOt: grossTotal,
      netWtTOt: netWgtTotal,
      totalInvoiceAmt: totalInvoiceAmount,
      stateId: vendorStateId,
      taxAmount: totalGST,
      jewelNarration: jewelNarration,
      accNarration: accNarration,
      balancePayable: subTotal,
      Finetotal: fineTotal,
      HmChargesTotal: hallmarkTotal,
    });
    if(isView){
      handlePrint();
    }
  }

  function handleFormSubmit(ev,isPrint) {
    ev.preventDefault();
    if (!isView &&
      goldRateValueValidation() &&
      silverRateValidation() &&
      partyNameValidation() &&
      FrimeNameValidation() &&
      oppositeAcValidation() &&
      voucherNumValidation() &&
      hasStockEntry() &&
      manuallEntry() &&
      !roundOffErr
    ) {
      if (isPrint) {
        getprintObj()
        if(!isView && isUploaded){
          addJewellaryPuchaseApi(false, isPrint);
        }else if(!isView && !isUploaded){
          addjewellaryManuallyPuchaseApi(false, isPrint)
        }
      } else {
        if(!isView && isUploaded){
          addJewellaryPuchaseApi(true, isPrint);
        }else if(!isView && !isUploaded){
          addjewellaryManuallyPuchaseApi(true, isPrint)
        }
      }
    }
    else if(isView){
      getprintObj()
    }
  }

  function addjewellaryManuallyPuchaseApi(resetFlag, toBePrint){
    setLoading(true);
    const orders = []
    formValues.map((x) => {
      if(x.Barcode && x.Category){
        orders.push({
          "barcode": x.Barcode,
          "sales_price": x.sales_price,
          "gross_wt": x.grossWeight,
          "net_wt": x.netWeight,
          "purity": x.purity,
          "pcs": x.Pieces,
          "stone_wt": 0,
          "beads_wt": 0,
          "other_wt": 0,
          "wastage_per": x.wastagePer,
          "huid_json": null,
          "category": x.Category.label,
          "hallmark_charges": x.hallmarkCharges,
          "labour_amount" : x.labour,
        })
      }
    })
    const body = {
      "party_voucher_no": partyVoucherNum,
      "opposite_account_id": oppositeAccSelected.value,
      "department_id": window.localStorage.getItem("SelectedDepartment"),
      "vendor_id": selectedFrimeName.value,
      "round_off": roundOff === "" ? 0 : roundOff,
      "is_packingSlip": 0,
      "is_packetNo": 0,
      "setRate": goldRate,
      "silver_rate":silverRate,
      "purchaseCreateDate": voucherDate,
      "with_bom": bomType,
      "jewellery_narration": jewelNarration,
      "account_narration": accNarration,
      "is_vendor_client": 1,
      "party_voucher_date" : partyVoucherDate,
      "OrdersData" : orders
    }
    console.log(body)
    setLoading(true);
    let api = "";
    if (isPasswordTwo == 1) {
      api = "retailerProduct/api/jewelleryPurchaseWt/wt/createfromexcel?save=1";
    } else {
      api = "retailerProduct/api/jewellerypurchase/manually?save=1";
    }
    axios
      .post(Config.getCommonUrl() + api, body)
      .then(function (response) {
        setLoading(false);
        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setLoading(false);
          if (resetFlag === true) {
            checkAndReset();
          }
          if (toBePrint === true) {
            handlePrint();
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
        setLoading(false);
        handleError(error, dispatch, {
          api: api,
          body
        });
      });
  }

  function addJewellaryPuchaseApi(resetFlag, toBePrint) {
    const formData = new FormData();
    formData.append("file", fileSelected);
    formData.append("voucher_no", voucherNumber);
    formData.append("party_voucher_no", partyVoucherNum);
    formData.append("opposite_account_id", oppositeAccSelected.value);
    formData.append(
      "department_id",
      window.localStorage.getItem("SelectedDepartment")
    );
    formData.append("vendor_id", selectedFrimeName.value);
    formData.append("round_off", roundOff === "" ? 0 : roundOff);
    formData.append("jewellery_narration", jewelNarration);
    formData.append("account_narration", accNarration);
    formData.append("is_vendor_client", 1);
    formData.append("setRate", goldRate);
    formData.append("silver_rate", silverRate);
    formData.append("with_bom", bomType);
    formData.append("is_barcoded", 1);
    formData.append("is_packingSlip", 0);
    formData.append("is_packetNo", 0);
    if (allowedBackDate) {
      formData.append("purchaseCreateDate", voucherDate);
    }
    formData.append("uploadDocIds", JSON.stringify(docIds));
    formData.append("party_voucher_date", partyVoucherDate);

    setLoading(true);
    let api = "";
    if (isPasswordTwo == 1) {
      api = "retailerProduct/api/jewelleryPurchaseWt/wt/createfromexcel?save=1";
    } else {
      api = "retailerProduct/api/jewellerypurchase/createfromexcel?save=1";
    }
    axios
      .post(Config.getCommonUrl() + api, formData)
      .then(function (response) {
        setLoading(false);
        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setLoading(false);
          if (resetFlag === true) {
            checkAndReset();
          }
          if (toBePrint === true) {
            handlePrint();
          }
        } else {
          if (response.data.hasOwnProperty("csverror")) {
            if (response.data.csverror === 1) {
              if (response.data.hasOwnProperty("url")) {
                let downloadUrl = response.data.url;
                setCsvData(downloadUrl);
              }
              document.getElementById("fileinput").value = "";
              setIsCsvErr(true);
            }
          }
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
        document.getElementById("fileinput").value = "";
        handleError(error, dispatch, {
          api: api,
          body: JSON.stringify(formData),
        });
      });
  }

  const deleteRow = (i) => {
    const dataArray = [...formValues]
    if(dataArray[i+1]){
      const newArr = dataArray.filter((temp,index)=>{
        if(i !== index) return temp;
      });
      totalCalculation(newArr)
      setFormValues(newArr)
    }else{
      dataArray[i].Barcode = ""
      dataArray[i].sales_price = ""
      dataArray[i].Category = ""
      dataArray[i].HSNNum = ""
      dataArray[i].Pieces = ""
      dataArray[i].grossWeight = ""
      dataArray[i].netWeight = ""
      dataArray[i].purity = ""
      dataArray[i].fine = ""
      dataArray[i].rate = ""
      dataArray[i].wastagePer = ""
      dataArray[i].wastageFine = ""
      dataArray[i].hallmarkCharges = ""
      dataArray[i].totalAmount = ""
      dataArray[i].cgstPer = ""
      dataArray[i].cgstVal = ""
      dataArray[i].sGstPer = ""
      dataArray[i].sGstVal = ""
      dataArray[i].IGSTper = ""
      dataArray[i].IGSTVal = ""
      dataArray[i].total = ""
      dataArray[i].cgstVal = ""
      dataArray[i].labour = ""
      dataArray[i].isSilver = true
      dataArray[i].errors = {}
      totalCalculation(dataArray)
      setFormValues(dataArray)
    }
  }

  function reset(e) {
    if (!e) {
      setVoucherDate(moment().format("YYYY-MM-DD"));
    }
    setOppositeAccSelected(oppositeAccData[0]);
    if (selectedLoad.value === 1 ) {
      if(document.getElementById("fileinput") !== null ||
      document.getElementById("fileinput") !== ""){
        document.getElementById("fileinput").value = "";
      }
    }
    setUploadErr("");
    setSelectedVendor("");
    setSelectedVendorErr("");
    setSelectedFrimeName("");
    setSelectedFrimeNameErr("");
    setCsvData([]);
    setIsCsvErr(false);
    setPartyVoucherNum("");
    setPartyVoucherNumErr("");
    setPartyVoucherDate("");
    setRoundOff("");
    SetRoundOffErr("");
    setTotalInvoiceAmount(0);
    setAccNarration("");
    setJewelNarration("");
    setVendorStateId("");
    setTotalGST(0);
    setSubTotal(0);
    setGrossTotal(0)
    setNetWgtTotal(0)
    setFineTotal(0)
    setSgstTotal(0)
    setWastTotal(0)
    setHallmarkTotal(0)
    setIgstTotal(0)
    setCgstTotal(0)
    setTotalAmount(0)
    setFileSelected("");
    setTagWiseData([]);
    setIsuploaded(false);
  }

  const isEnabled =
    voucherNumber !== "" &&
    selectedVendor !== "" &&
    selectedFrimeName !== "" &&
    oppositeAccSelected !== "" 
    // partyVoucherNum !== "";

  function handlePartyChange(value,e) {
    reset(e);
    setTotalInvoiceAmount(0);
    setSelectedVendor(value);
    setSelectedVendorErr("");
    setSelectedFrimeName("");
    setSelectedFrimeNameErr("");
    setVendorStateId(value.venstateId);
  }

  function handleFrimeChangeChange(value) {
    setSelectedFrimeName(value);
    setSelectedFrimeNameErr("");
    setvenderGST(value.GST)
  }

  const handleDocModalClose = () => {
    setDocModal(false);
  };

  const handleNarrationClick = () => {
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        flag: 2,
        id: idToBeView.id,
        metal_narration: jewelNarration,
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

  function handleLoadChange(value) {
    setSelectedLoad(value);
    reset();
  }

  const entryTypeArr = [
    {value : 0 , label : "Load Manulally"},
    {value : 1 , label : "Load Barcoded Stock form excel"}
  ]

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            {!props.viewPopup && (
              <Grid
              container
              alignItems="center"
              style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
              >
                <Grid item xs={8} sm={8} md={4} lg={5} key="1">
                  <FuseAnimate delay={300}>
                    <Typography className="text-18 font-700">
                      {isView
                        ? "View Jewellery Purchase "
                        : "Add Jewellery Purchase "}
                    </Typography>
                  </FuseAnimate>
                </Grid>

                <Grid
                item
                xs={4}
                sm={4}
                md={8}
                lg={7}
                key="2"
              >
                <div className="btn-back">
                  {" "}
                  <Button
                    id="btn-back"
                    size="small"  
                    onClick={(event) => {
                      History.goBack();
                    }}
                  >
                    <img className="back_arrow" src={Icones.arrow_left_pagination} alt="" />
                    Back
                  </Button>
                </div>
              </Grid>
              </Grid>
            )}
            <div className="main-div-alll">
              {loading && <Loader />}
              <div style={{ height: "90%" }}>
                <div>
                  <form
                    name="registerForm"
                    noValidate
                    className="flex flex-col justify-center w-full"
                    onSubmit={handleFormSubmit}
                  >
                    <Grid id="jewellery-input" container spacing={3}>
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6, marginTop: "5px" }}
                      >
                        <p style={{ paddingBottom: "3px" }}>Select Load Type</p>
                        <Select
                          id="view_jewellary_dv"
                          filterOption={createFilter({
                            ignoreAccents: false,
                          })}
                          classes={classes}
                          styles={selectStyles}
                          options={entryTypeArr}
                          value={selectedLoad}
                          onChange={handleLoadChange}
                          placeholder="Load Type"
                          isDisabled={isView}
                        />
                        {/* <select
                          className={clsx(classes.selectBox, "focusClass")}
                          required
                          value={selectedLoad}
                          onChange={(e) => handleLoadChange(e)}
                          disabled={isView}
                          ref={loadTypeRef}
                        >
                          <option hidden value="">
                            Select Load Type
                          </option>
                          <option value={0}>Load Manulally </option>
                          <option value={1}>
                            Load Barcoded Stock form excel
                          </option>
                        </select> */}

                        <span style={{ color: "red" }}>
                          {selectedLoadErr.length > 0 ? selectedLoadErr : ""}
                        </span>
                      </Grid>

                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6, marginTop: "5px" }}
                      >
                        <p className="mb-4">Today's Gold Rate</p>{" "}
                        <TextField
                          name="goldRate"
                          value={goldRate}
                          error={goldRateErr.length > 0 ? true : false}
                          helperText={goldRateErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          inputRef={inputRef}
                          autoFocus
                          placeholder="Today's Gold Rate"
                          FormHelperTextProps={{
                            style: { lineHeight: "11px" },
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
                      style={{ padding: 6,marginTop: "5px" }}
                    >
                      <p className="mb-4">Today's silver rate</p>{" "}
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
                        FormHelperTextProps={{
                          style: { lineHeight: "11px" },
                        }}
                        placeholder="Today's silver Rate"
                        disabled={isView}
                      />
                    </Grid>

                      {allowedBackDate && (
                        <Grid
                          item
                          lg={2}
                          md={4}
                          sm={4}
                          xs={12}
                          style={{ padding: 6, marginTop: "5px" }}
                        >
                          <p style={{ paddingBottom: "3px" }}>Date</p>
                          <TextField
                            type="date"
                            className=""
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
                      )}
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6, marginTop: "5px" }}
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
                        style={{ padding: 6, marginTop: "5px" }}
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
                            venstateId: suggestion.state,
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
                        style={{ padding: 6, marginTop: "5px" }}
                      >
                        <p style={{ paddingBottom: "3px" }}>Firm name</p>
                        <Select
                          className="view_consumablepurchase_dv"
                          filterOption={createFilter({
                            ignoreAccents: false,
                          })}
                          classes={classes}
                          styles={selectStyles}
                          options={frimeName.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.firm_name,
                            GST:suggestion.gst_number

                          }))}
                          // components={components}
                          blurInputOnSelect
                          tabSelectsValue={false}
                          value={selectedFrimeName}
                          onChange={handleFrimeChangeChange}
                          placeholder="Firm Name"
                          isDisabled={isView}
                        />

                        <span style={{ color: "red" }}>
                          {selectedFrimeNameErr.length > 0
                            ? selectedFrimeNameErr
                            : ""}
                        </span>
                      </Grid>

                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6, marginTop: "5px" }}
                      >
                        <p style={{ paddingBottom: "3px" }}>Opposite account</p>
                        <Select
                          id="view_jewellary_dv"
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          options={oppositeAccData}
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
                        style={{ padding: 6, marginTop: "5px" }}
                      >
                        <p style={{ paddingBottom: "3px" }}>
                          Party voucher number
                        </p>
                        <TextField
                          // className="mb-16"
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
                          // onKeyDown={handleTabChange}
                        />
                      </Grid>

                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6, marginTop: "5px" }}
                      >
                        <p style={{ paddingBottom: "3px" }}>
                          Party voucher date
                        </p>
                        <TextField
                          placeholder="Party voucher date"
                          type="date"
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
{/* 
                      {!isView && (
                        <Grid
                          item
                          lg={2}
                          md={4}
                          sm={4}
                          xs={12}
                          style={{ padding: 6, marginTop: "15px" }}
                        >
                          <p style={{ paddingBottom: "3px" }}>
                            Upload document
                          </p>
                          <TextField
                            className=" uploadDoc"
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
                      )} */}
                      {
                        selectedLoad.value === 1 && !isView ? <><Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6, marginTop: "26px" }}
                      >
                        <Button
                          id="upload-btn-jewellery"
                          variant="contained"
                          color="primary"
                          className="w-224 mx-auto "
                          aria-label="Register"
                          disabled={!isEnabled || isView}
                          onClick={handleClick}
                        >
                          Upload a file
                        </Button>
                        {uploadErr !== "" && (
                          <span style={{ color: "red" }}>{uploadErr}</span>
                        )}
                        <input
                          type="file"
                          id="fileinput"
                          // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          accept=".csv"
                          ref={hiddenFileInput}
                          onChange={handlefilechange}
                          style={{ display: "none" }}
                        />
                      </Grid>
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{
                          padding: 6,
                          justifyContent: "center",
                          display: "flex",
                          alignItems: "center",
                          marginTop: "15px",
                        }}
                      >
                        {uploadType !== "" && !isView && (
                          <a
                            href={barcodedFile}
                            download="Load_Barcode_wise.csv"
                          >
                            Download Sample{" "}
                          </a>
                        )}
                      </Grid>
                      </> : ''
                      }
                      {isCsvErr === true && (
                        <Grid item xs={4} style={{ padding: 6, color: "red" }}>
                          Your File Has Error Please Correct it, Download from{" "}
                          <a href={csvData}>Here</a>
                        </Grid>
                      )}
                    </Grid>
                    {
                      selectedLoad.value  === 1 && !isView ?   <Grid className="salesjobwork-table-main cate_jewellry_tbl  ">
                      <div className="mt-16">
                        <TagWiseListRetailer
                          tagWiseData={tagWiseData}
                          stateId={vendorStateId}
                          uploadType={uploadType}
                          isView={isView}
                        />
                      </div>
                    </Grid> : 
                     <Paper
                     style={{ marginTop: "16px" }}
                     className={classes.tabroot}
                   >
                     <Table className={classes.table}>
                       <TableHead>
                         <TableRow>
                           {!isView && (
                             <TableCell
                               className={classes.tableRowPad}
                               style={{ width: "50px" }}
                             >
                               <div
                                 className={clsx(
                                   classes.tableheader,
                                   "delete_icons_dv"
                                 )}
                               ></div>
                             </TableCell>
                           )}
                           <TableCell className={classes.tableRowPad}>Barcode</TableCell>
                           <TableCell className={classes.tableRowPad}>Category</TableCell>
                           <TableCell className={classes.tableRowPad}>HSN</TableCell>
                           <TableCell className={classes.tableRowPad}>Pieces</TableCell>
                           <TableCell className={classes.tableRowPad}>Gross Weight</TableCell>
                           <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
                           <TableCell className={classes.tableRowPad}>Purity</TableCell>
                           <TableCell className={classes.tableRowPad}>Fine</TableCell>
                           <TableCell className={classes.tableRowPad}>Rate /10gm</TableCell>
                           <TableCell className={classes.tableRowPad}>wastage (%)</TableCell>
                           <TableCell className={classes.tableRowPad}>wastage</TableCell>
                           <TableCell className={classes.tableRowPad}>Labour</TableCell>
                           <TableCell className={classes.tableRowPad}>Hallmark Charges</TableCell>
                           <TableCell className={classes.tableRowPad}>Amount</TableCell>
                           {
                             SateID === vendorStateId ? 
                             <>
                               <TableCell className={classes.tableRowPad}>CGST (%)</TableCell>
                               <TableCell className={classes.tableRowPad}>SGST (%)</TableCell>
                               <TableCell className={classes.tableRowPad}>CGST</TableCell>
                               <TableCell className={classes.tableRowPad}>SGST</TableCell>
                             </> : 
                              <>
                               <TableCell className={classes.tableRowPad}>IGST (%)</TableCell>
                               <TableCell className={classes.tableRowPad}>IGST</TableCell>
                            </>
                           }
                           <TableCell className={classes.tableRowPad}>Total</TableCell>
                           <TableCell className={classes.tableRowPad}>Sales price</TableCell>
                         </TableRow>
                       </TableHead>
                         <TableBody>
                           {formValues.map((element, index) => (
                             <TableRow key={index}>
                               {!isView && (
                                 <TableCell
                                   className={classes.tablePad}
                                   align="center"
                                   style={{ paddingLeft: 0, textAlign: "center" }}
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
                                     <Icon className="delete-icone">
                                       <img src={Icones.delete_red} alt="" />
                                     </Icon>
                                   </IconButton>
                                 </TableCell>
                               )}
                               <TableCell className={classes.tablePad}>
                               <TextField
                                  name="Barcode"
                                  value={element.Barcode || ""}
                                  onChange={(e) => handleChange(index, e)}
                                  error={element.errors && element.errors.Barcode ? true : false}
                                  helperText={element.errors && element.errors.Barcode ? element.errors.Barcode : ''}
                                  variant="outlined"
                                  fullWidth
                                  disabled={isView || selectedVendor === ""}
                                />
                               </TableCell>
                               <TableCell className={classes.tablePad}>
                               <Select
                                  // filterOption={createFilter({ ignoreAccents: false })}
                                  className="view_consumablepurchase_dv"
                                  classes={classes}
                                  styles={selectStyles}
                                  options={categoryList.map((suggestion) => ({
                                    value: suggestion.id,
                                    label: suggestion.category_name,
                                    hsn_master: suggestion.hsn_master,
                                    is_gold_silver : suggestion.is_gold_silver
                                  }))}
                                  value={element.Category}
                                  onChange={(value) => { handleCatChange(value, index) }}
                                  placeholder="Category"
                                  isDisabled={isView || element.Barcode === ""}
                                />
                                <span style={{ color: "red" }}>
                                  {element.errors && element.errors.Category ? element.errors.Category : ''}
                                </span>
                               </TableCell>
                               <TableCell className={classes.tablePad}>
                                 <TextField
                                   name="HSNNum"
                                   value={element.HSNNum || ""}
                                   variant="outlined"
                                   fullWidth
                                   disabled
                                 />
                               </TableCell>
                               <TableCell className={classes.tablePad}>
                               <TextField
                                   name="Pieces"
                                   value={element.Pieces || ""}
                                   onChange={(e) => handleChange(index, e)}
                                   variant="outlined"
                                   fullWidth
                                   error={element.errors && element.errors.Pieces ? true : false}
                                   helperText={element.errors && element.errors.Pieces ? element.errors.Pieces : ""}
                                   disabled={isView || element.Barcode === "" || element.Category === ""}
                                 />
                               </TableCell>
                               <TableCell className={classes.tablePad}>
                                 <TextField
                                   name="grossWeight"
                                   value={element.grossWeight || ""}
                                   onChange={(e) => handleChange(index, e)}
                                   variant="outlined"
                                   fullWidth
                                   error={element.errors && element.errors.grossWeight ? true : false}
                                   helperText={element.errors && element.errors.grossWeight ? element.errors.grossWeight : ""}
                                   disabled={isView || element.Barcode === "" || element.Category === ""}
                                 />
                               </TableCell>
                               <TableCell className={classes.tablePad}>
                                 <TextField
                                   name="netWeight"
                                   value={element.netWeight || ""}
                                   onChange={(e) => handleChange(index, e)}
                                   variant="outlined"
                                   fullWidth
                                   error={element.errors && element.errors.netWeight ? true : false}
                                   helperText={element.errors && element.errors.netWeight ? element.errors.netWeight : ""}
                                   disabled={isView || element.Barcode === "" || element.Category === ""}
                                 />
                               </TableCell>
                               <TableCell className={classes.tablePad}>
                               <TextField
                                   name="purity"
                                   value={element.purity || ""}
                                   onChange={(e) => handleChange(index, e)}
                                   variant="outlined"
                                   fullWidth
                                   error={element.errors && element.errors.purity ? true : false}
                                   helperText={element.errors && element.errors.purity ? element.errors.purity : ""}
                                   disabled={isView || element.Barcode === "" || element.Category === ""}
                                 />
                               </TableCell>
                               <TableCell className={classes.tablePad}>
                                 <TextField
                                   name="fine"
                                   value={element.fine ? parseFloat(element.fine).toFixed(2) : ""}
                                   variant="outlined"
                                   fullWidth
                                   disabled
                                 />
                               </TableCell>
                               <TableCell className={classes.tablePad}>
                                 <TextField
                                   name="rate"
                                   value={element.rate ? parseFloat(element.rate).toFixed(2) : ""}
                                   variant="outlined"
                                   fullWidth
                                   disabled
                                 />
                               </TableCell>
                               <TableCell className={classes.tablePad}>
                                 <TextField
                                   name="wastagePer"
                                   value={element.wastagePer || ""}
                                   onChange={(e) => handleChange(index, e)}
                                   variant="outlined"
                                   fullWidth
                                   error={element.errors && element.errors.wastagePer ? true : false}
                                   helperText={element.errors && element.errors.wastagePer ? element.errors.wastagePer : ""}
                                   disabled={isView || element.Barcode === "" || element.Category === ""}
                                 />
                               </TableCell>
                               <TableCell className={classes.tablePad}>
                                 <TextField
                                   name="wastageFine"
                                   value={element.wastageFine ? parseFloat(element.wastageFine).toFixed(2) : ""}
                                   onChange={(e) => handleChange(index, e)}
                                   variant="outlined"
                                   fullWidth
                                   error={element.errors && element.errors.wastageFine ? true : false}
                                   helperText={element.errors && element.errors.wastageFine ? element.errors.wastageFine : ""}
                                   disabled
                                 />
                               </TableCell>
                               <TableCell className={classes.tablePad}>
                                 <TextField
                                   name="labour"
                                   value={element.labour}
                                   onChange={(e) => handleChange(index, e)}
                                   variant="outlined"
                                   fullWidth
                                   error={element.errors && element.errors.labour ? true : false}
                                   helperText={element.errors && element.errors.labour ? element.errors.labour : ""}
                                   disabled={isView || element.Barcode === "" || element.Category === "" }
                                 />
                               </TableCell>
                               <TableCell className={classes.tablePad}>
                                 <TextField
                                   name="hallmarkCharges"
                                   value={element.hallmarkCharges}
                                   onChange={(e) => handleChange(index, e)}
                                   variant="outlined"
                                   fullWidth
                                   error={element.errors && element.errors.hallmarkCharges ? true : false}
                                   helperText={element.errors && element.errors.hallmarkCharges ? element.errors.hallmarkCharges : ""}
                                   disabled={isView || element.Barcode === "" || element.Category === "" }
                                 />
                               </TableCell>
                               <TableCell className={classes.tablePad}>
                                 <TextField
                                   name="totalAmount"
                                   value={element.totalAmount ? parseFloat(element.totalAmount).toFixed(2) : ""}
                                   variant="outlined"
                                   fullWidth
                                   disabled
                                 />
                               </TableCell>
                               {
                                  SateID === vendorStateId ? 
                                  <>
                                   <TableCell className={classes.tablePad}>
                                    <TextField
                                   name="cgstPer"
                                   value={element.cgstPer || ""}
                                   onChange={(e) => handleChange(index, e)}
                                   className="addconsumble-dv"
                                   error={element.errors && element.errors.cgstPer ? true : false}
                                   helperText={element.errors && element.errors.cgstPer ? element.errors.cgstPer : ""}
                                   variant="outlined"
                                   fullWidth
                                   disabled
                                 /></TableCell>
                                  <TableCell className={classes.tablePad}>
                                   <TextField
                                   name="sGstPer"
                                   value={element.sGstPer || ""}
                                   onChange={(e) => handleChange(index, e)}
                                   className="addconsumble-dv"
                                   error={element.errors && element.errors.sGstPer ? true : false}
                                   helperText={element.errors && element.errors.sGstPer ? element.errors.sGstPer : ""}
                                   variant="outlined"
                                   fullWidth
                                   disabled
                                 /></TableCell>
                                  <TableCell className={classes.tablePad}>
                                   <TextField
                                   name="cgstVal"
                                   value={element.cgstVal ? parseFloat(element.cgstVal).toFixed(2) : ""}
                                   onChange={(e) => handleChange(index, e)}
                                   className="addconsumble-dv"
                                   error={element.errors && element.errors.cgstVal ? true : false}
                                   helperText={element.errors && element.errors.cgstVal ? element.errors.cgstVal : ""}
                                   variant="outlined"
                                   fullWidth
                                   disabled
                                 /></TableCell>
                                  <TableCell className={classes.tablePad}>
                                   <TextField
                                   name="sGstVal"
                                   value={element.sGstVal ? parseFloat(element.sGstVal).toFixed(2) : ""}
                                   onChange={(e) => handleChange(index, e)}
                                   className="addconsumble-dv"
                                   error={element.errors && element.errors.sGstVal ? true : false}
                                   helperText={element.errors && element.errors.sGstVal ? element.errors.sGstVal : ""}
                                   variant="outlined"
                                   fullWidth
                                   disabled
                                 /></TableCell>
                                  </>
                                  :
                                  <>
                                   <TableCell className={classes.tablePad}>
                                    <TextField
                                   name="IGSTper"
                                   value={element.IGSTper || ""}
                                   onChange={(e) => handleChange(index, e)}
                                   className="addconsumble-dv"
                                   error={element.errors && element.errors.IGSTper ? true : false}
                                   helperText={element.errors && element.errors.IGSTper ? element.errors.IGSTper : ""}
                                   variant="outlined"
                                   fullWidth
                                   disabled
                                 /></TableCell>
                                  <TableCell className={classes.tablePad}>
                                   <TextField
                                   name="IGSTVal"
                                   value={element.IGSTVal ? parseFloat(element.IGSTVal).toFixed(2) : ""}
                                   onChange={(e) => handleChange(index, e)}
                                   className="addconsumble-dv"
                                   error={element.errors && element.errors.IGSTVal ? true : false}
                                   helperText={element.errors && element.errors.IGSTVal ? element.errors.IGSTVal : ""}
                                   variant="outlined"
                                   fullWidth
                                   disabled
                                 />
                                 </TableCell>
                                  </>
                               }
                               <TableCell className={classes.tablePad}>
                                 <TextField
                                   name="total"
                                   value={element.total ? parseFloat(element.total).toFixed(2) : ""}
                                   variant="outlined"
                                   fullWidth
                                   disabled
                                 />
                               </TableCell>
                               <TableCell className={classes.tablePad}>
                               <TextField
                               
                                   name="sales_price"
                                   value={element.sales_price || ""}
                                   onChange={(e) => handleChange(index, e)}
                                   variant="outlined"
                                   fullWidth
                                  //  error={element.errors && element.errors.Pieces ? true : false}
                                  //  helperText={element.errors && element.errors.sales_price ? element.errors.sales_price : ""}
                                   disabled={isView || element.Barcode === "" || element.Category === ""}
                                 />
                               </TableCell>
                             </TableRow>
                           ))}
                         </TableBody>
                         <TableFooter>
                           <TableRow style={{ backgroundColor: "#ebeefb" }}>
                             {!isView && (
                               <TableCell
                                 className={classes.tableRowPad}
                               ></TableCell>
                             )}
                             <TableCell className={classes.tableRowPad}></TableCell>
                             <TableCell className={classes.tableRowPad}></TableCell>
                             <TableCell className={classes.tableRowPad}></TableCell>
                             <TableCell className={classes.tableRowPad}></TableCell>
                             <TableCell className={classes.tableRowPad}>
                               <b>{parseFloat(grossTotal).toFixed(3)}</b>
                             </TableCell>
                             <TableCell className={classes.tableRowPad}>
                             <b>{parseFloat(netWgtTotal).toFixed(3)}</b>
                             </TableCell>
                              <TableCell className={classes.tableRowPad}></TableCell>
                              <TableCell className={classes.tableRowPad}>
                              <b>{parseFloat(fineTotal).toFixed(2)}</b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}></TableCell>
                              <TableCell className={classes.tableRowPad}></TableCell>
                              <TableCell className={classes.tableRowPad}>
                              <b>{parseFloat(wastTotal).toFixed(2)}</b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}></TableCell>
                              <TableCell className={classes.tableRowPad}>
                              <b>{parseFloat(hallmarkTotal).toFixed(2)}</b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                              <b>{parseFloat(subTotal).toFixed(2)}</b>
                              </TableCell>
                             {
                               SateID === vendorStateId ? <>
                                <TableCell className={classes.tableRowPad}></TableCell>
                                 <TableCell className={classes.tableRowPad}></TableCell>
                                 <TableCell className={classes.tableRowPad}>
                                 <b>{parseFloat(cgstTotal).toFixed(2)}</b>
                                 </TableCell>
                                 <TableCell className={classes.tableRowPad}>
                                 <b>{parseFloat(sgstTotal).toFixed(2)}</b>
                                 </TableCell>
                               </> : <>
                               <TableCell className={classes.tableRowPad}></TableCell>
                               <TableCell className={classes.tableRowPad}>
                               <b>{parseFloat(igstTotal).toFixed(2)}</b>
                               </TableCell>
                               </>
                             }
                             <TableCell
                               className={classes.tableRowPad}
                               style={{ paddingRight: 28 }}
                             >
                               <b>{parseFloat(TotalAmount).toFixed(2)}</b>
                             </TableCell>
                             <TableCell
                               className={classes.tableRowPad}
                               style={{ paddingRight: 28 }}
                             >
                             </TableCell>
                           </TableRow>
                         </TableFooter>
                     </Table>
                   </Paper>
                    }
                  
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
                        {isView ? Config.numWithComma(subTotal) : parseFloat(subTotal).toFixed(2)}
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
                        {isView ? Config.numWithComma(totalGST) : parseFloat(totalGST).toFixed(2)}
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
                      <label
                        className="first-label-total"
                        style={{ width: "34.8%" }}
                      >
                      Discount :
                      </label>
                      <label className="ml-2 input-sub-total">
                        <TextField
                          name="roundOff"
                          className="ml-2  addconsumble-dv"
                          disabled={isView || subTotal === ""}
                          value={roundOff}
                          error={roundOffErr.length > 0 ? true : false}
                          helperText={roundOffErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          fullWidth
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
                          : parseFloat(totalInvoiceAmount).toFixed(2)}
                      </label>
                    </div>
                  </div>

                  <div
                    id="jewellery-head"
                    className="mt-16 "
                    style={{
                      background: "#EBEEFB",
                      borderRadius: "7px",
                      fontWeight: "700",
                      justifyContent: "end",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        // width: "20%",
                      }}
                      // className={classes.tableheader}
                    >
                      <label>Final Receivable Amount :</label>
                      <label>
                        {" "}
                        {isView
                          ? Config.numWithComma(totalInvoiceAmount)
                          : parseFloat(totalInvoiceAmount).toFixed(2)}{" "}
                      </label>
                    </div>
                  </div>

                  <Grid container style={{marginTop:"11px"}}>
                    <Grid
                      item
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      style={{ padding: 6 }}
                    >
                      <p style={{ paddingBottom: "3px" }}>
                        jewellery narration
                      </p>
                      <TextField
                        className="mt-1"
                        placeholder="jewellery narration"
                        name="jewelNarration"
                        value={jewelNarration}
                        error={jewelNarrationErr.length > 0 ? true : false}
                        helperText={jewelNarrationErr}
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
                    <div style={{marginTop:"11px"}}>
                      {!isView && (
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ float: "right" }}
                          className="w-224 mx-auto btn-print-save"
                          aria-label="Register"
                          disabled={isView}
                          onClick={(e) => {
                            handleFormSubmit(e,false);
                          }}
                        >
                          Save
                        </Button>
                      )}

                      <Button
                        variant="contained"
                        style={{ float: "right" }}
                        className="w-224 mx-auto mr-16 btn-print-save"
                        aria-label="Register"
                        onClick={(e) => {
                          handleFormSubmit(e,true);
                        }}
                      >
                        {isView ? "Print" : "Save & Print"}
                      </Button>

                      {isView && (
                        <Button
                          variant="contained"
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
                        <JewelPurcRetailerPrintComp
                          ref={componentRef}
                          printObj={printObj}
                        />
                      </div>
                    </div>
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
            </div>
            <ViewDocModelRetailer
              documentList={documentList}
              handleClose={handleDocModalClose}
              open={docModal}
              updateDocument={updateDocumentArray}
              purchase_flag_id={idToBeView?.id}
              purchase_flag="2"
              concateDocument={concateDocument}
              viewPopup={props.viewPopup}
            />
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddJewellaryPurchaseRetailer;

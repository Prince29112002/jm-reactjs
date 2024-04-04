import React, { useState, useEffect, useRef , useLayoutEffect} from "react";
import { Typography,Checkbox, Button, TextField , Grid, Table, TableBody,TableCell,
  TableHead,TableRow, Modal, Icon, IconButton , AppBar,Tabs,Tab
} from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import Paper from "@material-ui/core/Paper";
import MaUTable from "@material-ui/core/Table";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Select, { createFilter } from "react-select";
import * as XLSX from "xlsx";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment";
import Loader from "app/main/Loader/Loader";
import History from "@history";
import CategoryWiseList from "../Components/CategoryWiseList";
import TagWiseList from "../Components/TagWiseList";
import LotDetails from "../Components/LotDetails";
import BomDetails from "../Components/BomDetails";
import { useReactToPrint } from "react-to-print";
import { JewelArticianPrintComp } from "../Components/JewelArticianPrintComp";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
import HelperFunc from "../../Helper/HelperFunc";
import lotFile from "app/main/SampleFiles/JewelleryPurchaseArtician/load_lot_directly.csv";
import barcodedFile from "app/main/SampleFiles/JewelleryPurchaseArtician/load_barcode_wise.csv";
import { UpdateNarration } from "../../Helper/UpdateNarration";
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
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    // marginLeft: 15,
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
    // padding: theme.spacing(4),
    outline: "none",
  },
  diffPopup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
  };
}

const AddJewelPurchaseArtician = (props) => {
  const [isView, setIsView] = useState(false);

  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const maxDate = new Date('01/01/9999')
  const [modalStyle] = useState(getModalStyle);
  const [loading, setLoading] = useState(false);
  const [idToBeView, setIdToBeView] = useState("");

  const loadTypeRef = useRef(null);
  const hiddenFileInput = React.useRef(null);
  const pcsInputRef = useRef([]);
  const [selectedLoad, setSelectedLoad] = useState("");
  const [selectedLoadErr, setSelectedLoadErr] = useState("");

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [oppositeAccData, setOppositeAccData] = useState([]);
  const [oppositeAccSelected, setOppositeAccSelected] = useState("");
  const [selectedOppAccErr, setSelectedOppAccErr] = useState("");

  const [bomType, setBomType] = useState("");
  const [bomTypeErr, setBomTypeErr] = useState("");

  const [jobworkerData, setJobworkerData] = useState([]);
  const [selectedJobWorker, setSelectedJobWorker] = useState("");
  const [selectedJobWorkerErr, setSelectedJobWorkerErr] = useState("");

  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");

  const [csvData, setCsvData] = useState("");
  const [isCsvErr, setIsCsvErr] = useState(false);

  const [partyVoucherNum, setPartyVoucherNum] = useState("");
  const [partyVoucherNumErr, setPartyVoucherNumErr] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");

  const [fileSelected, setFileSelected] = useState("");
  const [isUploaded, setIsuploaded] = useState(false);

  const [jobWorkerGst, setJobWorkerGst] = useState("");
  const [jobworkerHSN, setJobWorkerHSN] = useState("");
  const [stockCodeData, setStockCodeData] = useState([]);
  const [diffStockCode, setDiffStockCode] = useState([]);

  const [voucherModalOpen, setvoucherModalOpen] = useState(false);
  const [isVoucherSelected, setIsVoucherSelected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState([]);
  const [selectVoucherErr, setSelectVoucherErr] = useState("");
  const [voucherApiData, setVoucherApiData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState("");
  const [lotListModalView, setLotListModalView] = useState(false);
  const [modallotList, setModallotList] = useState([]);
  const [metalLotList, setMetalLotList] = useState([]);

  const [searchData, setSearchData] = useState({
    voucher_no: "",
    gross_weight: "",
    net_weight: "",
    finegold: "",
    utilize: "",
    balance: "",
    type:"",
  });

  const [DiffrentStock, setDiffrentStock] = useState([
    {
      setStockCodeId: "",
      setPcs: "",
      setWeight: "",
      errors: {
        setStockCodeId: null,
        setPcs: null,
        setWeight: null,
      },
    },
  ]);

  const [userFormValues, setUserFormValues] = useState([{
    stockCode: "",
    stockName: "",
    HSNNum: "",
    billingCategory: "",
    purity: "",
    color: "",
    pieces: "",
    grossWeight: "",
    netWeight: "",
    isWeightDiff: "",
    DiffrentStock: [
      {
        setStockCodeId: "",
        setPcs: "",
        setWeight: "",
        errors: {
          setStockCodeId: null,
          setPcs: null,
          setWeight: null,
        },
      },
    ],
    wastagePer: "",
    wastageFine: "",
    goldlossper:"",
    goldlossFine: "",
    jobworkFineUtilize: "",
    labourFineAmount: "",
    catRatePerGram: "",
    rate: "",
    tag_amount_after_discount: "",
    tag_amount_before_discount: "",
    totalAmount: "",
    cgstPer: "",
    cgstVal: "",
    sGstPer: "",
    sGstVal: "",
    IGSTper: "",
    IGSTVal: "",
    total: "",
    errors : {}
  }])
  const [printObj, setPrintObj] = useState({
    stateId: "",
    is_tds_tcs: "",
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
    grossWtTOt: "",
    netWtTOt: "",
    pcsTot: "",
    totalInvoiceAmt: "",
    TDSTCSVoucherNum: "",
    ledgerName: "",
    taxAmount: "",
    metNarration: "",
    accNarration: "",
    balancePayable: "",
  });
  const [vendorStateId, setVendorStateId] = useState("");
  const [is_tds_tcs, setIs_tds_tcs] = useState("");

  const [tdsTcsVou, setTdsTcsVou] = useState("");
  const [tdsTcsVouErr, setTdsTcsVouErr] = useState("");

  const [ledgerName, setLedgerName] = useState("");
  const [ledgerNmErr, setLedgerNmErr] = useState("");
  const [rateValue, setRateValue] = useState("");
  const [rateValErr, setRateValErr] = useState("");

  const [ledgerAmount, setLegderAmount] = useState("");
  const [ledgerAmtErr, setLedgerAmtErr] = useState("");

  const [fineRate, setFineRate] = useState("");
  const [fineRateErr, setFineRateErr] = useState("");
  const [rateProfiles, setRateProfiles] = useState([]);

  const [narrationFlag, setNarrationFlag] = useState(false);

  const [modalView, setModalView] = useState(0);
  const [lotModalView, setLotModalView] = useState(0);
  const [lotList, setLotList] = useState([]);
  const [bomList, setBomList] = useState([]);
  const [lotListLotwise, setLotListLotwise] = useState([]);
  const [bomListLotwise, setBomListLotwise] = useState([]);
  const [productData, setProductData] = useState([]); //category wise Data
  const [tagWiseData, setTagWiseData] = useState([]);

  const [pcsTotal, setPcsTotal] = useState(0)
  const [grossTotal, setGrossTotal] = useState(0)
  const [netTotal, setNetTotal] = useState(0)
  const [utilizeTotal, setUtilizeTotal] = useState(0)
  const [subTotal, setSubTotal] = useState(0);
  const [totalAmt, setTotalAmt] = useState(0)
  const [totalGST, setTotalGST] = useState(0);
  const [roundOff, setRoundOff] = useState("");
  const [roundOffErr, SetRoundOffErr] = useState("");
  const [igstTot, setIGSTot] = useState(0);
  const [cgstTot, setCgstTot] = useState(0);
  const [sgstTot, setSGSTot] = useState(0);
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [jewelNarration, setJewelNarration] = useState("");
  const [signature,setSignature] = useState("")
  const [jewelNarrationErr, setJewelNarrationErr] = useState("");

  const [lotSearch, setLotSearch] = useState("");
  const [lotListApiData, setLotListApiData] = useState([]);
  const [displayLotNumber, setDisplayLotNumber] = useState("")
  const [addedLotList, setAddedLotList] = useState([])

  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);
  const handleAfterPrint = () => {
    //React.useCallback
    console.log("`onAfterPrint` called", isView); // tslint:disable-line no-console
    checkAndReset();
  };

  function checkAndReset() {
    if (isView === false) {
      console.log("cond true", isView);
      History.goBack();
    }
  }

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

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
    documentTitle:
      "Jewellery Purchase (Artician Receive) Voucher" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  const [documentList, setDocumentList] = useState([]);
  const [docModal, setDocModal] = useState(false);
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);

  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 3)
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

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

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
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (lotSearch) {
        getLotDetailsData(lotSearch);
      } else {
        setLotListApiData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
    //eslint-disable-next-line
  }, [lotSearch]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000); // 10초 뒤에
    }
  }, [loading]);

  useEffect(() => {
    setOppositeAccData(
      HelperFunc.getOppositeAccountDetails("JewelleryPurchaseArtician")
    );

    let idView = ""
    if (props.location) {
      idView = props.location.state
      setIdToBeView(props.location.state)
    } else if (props.voucherId) {
      idView = props.voucherId
      setIdToBeView({id: props.voucherId})
    }
      
    if (idView) {
      setIsView(true);
      setNarrationFlag(true);
      getJewelPurchaseRecordForView(idView.id);
    } else {
      getJobworkerdata();
      getJobWorkHsnGst();
      setNarrationFlag(false);
      getStockCodeFindingVariant();
      getStockCodeStone();
      getVoucherNumber(); //if view only then no need to get new voucher number, we will set data coming from api
    }

    setTimeout(() => {
      if (loadTypeRef.current) {
        loadTypeRef.current.focus();
      }
    }, 800);
    //eslint-disable-next-line
  }, []);

  useEffect(()=>{
    let tempLedgerAmount = ledgerAmount ? ledgerAmount : 0;
    let tempfinalAmount = 0; 
    if(is_tds_tcs === 1){
      tempLedgerAmount = 0;
      tempfinalAmount = totalInvoiceAmount
    }else if(is_tds_tcs === 2){
      tempLedgerAmount = parseFloat((parseFloat(subTotal) * rateValue) / 100).toFixed(3);
      tempfinalAmount = parseFloat(totalInvoiceAmount) - parseFloat(tempLedgerAmount)
    }
    setLegderAmount(tempLedgerAmount);
    setFinalAmount(parseFloat(tempfinalAmount).toFixed(3));
    if(roundOff){
      const lastAmt = parseFloat(parseFloat(totalAmt) - parseFloat(roundOff)).toFixed(3)
      setTotalInvoiceAmount(parseFloat(lastAmt).toFixed(3))
    }else{
      setTotalInvoiceAmount(parseFloat(totalAmt).toFixed(3))
    }
  },[totalInvoiceAmount , ledgerAmount , roundOff])

  const getLotDetailsData = (lData) => {
    const data = {
      "jobworker_id": selectedJobWorker.value,
      "voucher_id": selectedVoucher,
      "lot_number": lData
    }
    const api = `api/jewellerypurchaseartician/lotScan/jobworkers`;
    axios
      .post(Config.getCommonUrl() + api,data)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          if (response.data.data.length > 0) {
            setLotListApiData(response.data.data);
          } else {
            setLotListApiData([]);
            dispatch(
              Actions.showMessage({
                message: "Please Insert Proper Lot No",
              })
            );
          }
        } else {
          setLotListApiData([]);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {handleError(error, dispatch, {api: api ,data});
      });
  }

  function getJewelPurchaseRecordForView(id) {
    setLoading(true);
    let api = "";
    if (props.forDeletedVoucher) {
      api = `api/jewellerypurchaseartician/${id}?deleted_at=1`;
    } else {
      api = `api/jewellerypurchaseartician/${id}`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response);
        setTimeDate(response.data.data.data.created_at);

        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              let finalData = response.data.data.data;
              let otherDetail = response.data.data.otherDetails;

              setSelectedLoad(otherDetail.loadType.toString());
              if (otherDetail.loadType === 2) {
                setBomType(otherDetail.selectBom.toString());
              }
              setDocumentList(finalData.salesPurchaseDocs);
              setVoucherNumber(finalData.voucher_no);
              setPartyVoucherDate(finalData.party_voucher_date);
              setAllowedBackDate(true);
              setVoucherDate(finalData.purchase_voucher_create_date);
              setSelectedJobWorker({
                value: finalData.jobworker.id,
                label: finalData.jobworker.name,
                data : finalData.jobworker
              });
              setFirmName(finalData?.jobworker?.firm_name);
              setIs_tds_tcs(finalData.jobworker.is_tds_tcs);
              setOppositeAccSelected({
                value: finalData.opposite_account_id,
                label: finalData.OppositeAccount.name,
              });
              setPartyVoucherNum(finalData.party_voucher_no);
              setRoundOff(finalData.round_off === null ? "" : finalData.round_off);
              if (finalData.TdsTcsVoucher !== null) {
                setTdsTcsVou(finalData.TdsTcsVoucher.voucher_no);
                setLedgerName(finalData.TdsTcsVoucher.voucher_name);
              }
              setRateValue(finalData.tds_or_tcs_rate);
              setAccNarration(finalData?.account_narration);
              setJewelNarration(finalData?.jewellery_narration);
              setFineRate(finalData.JewelleryPurchaseArticianOrders[0].fine_rate);
              setVendorStateId(finalData.JewelleryPurchaseArticianOrders[0].igst === null ? 12 : 0);

              let tempjobWorkerGst = response.data.data.jobWorkHsn.gst;
              setJobWorkerGst(tempjobWorkerGst);

              setSignature(finalData.admin_signature);              
              let JWHSN = response.data.data.jobWorkHsn.hsn_number;
              setJobWorkerHSN(JWHSN);
              console.log(tempjobWorkerGst, JWHSN);

              if (otherDetail.loadType === 0) { //finding variant
                let tempArray = [];
                for (let item of finalData.JewelleryPurchaseArticianOrders) {
                  tempArray.push({
                    stockCode: {
                      value: item.StockNameCode.id,
                      label: item.StockNameCode.stock_code,
                    },
                    stockName: item.stock_name,
                    HSNNum: item.hsn_number ? item.hsn_number : "", // item.StockNameCode.stock_name_code.hsn_master.hsn_number,
                    billingCategory:
                      item.StockNameCode.stock_name_code.billing_name,
                    purity: item.purity,
                    color: item.StockNameCode.gold_color.name,
                    pieces: item.pcs,
                    grossWeight: parseFloat(item.gross_wt).toFixed(3),
                    netWeight: parseFloat(item.net_wt).toFixed(3),
                    isWeightDiff: "",
                    DiffrentStock: item.JewelleryPurchaseOrderSetStockCode.map(
                      (item) => {
                        return {
                          setStockCodeId: {
                            vaule: item.SetStockNameCode.id,
                            label: item.SetStockNameCode.stock_code,
                          },
                          setPcs: item.setPcs,
                          setWeight: item.setWeight,
                          errors: {
                            setStockCodeId: null,
                            setPcs: null,
                            setWeight: null,
                          },
                        };
                      }
                    ),
                    wastagePer: item.wastage_per,
                    wastageFine: item.wastage_fine,
                    goldlossper: item?.gold_loss_per,
                    goldlossFine: item?.gold_loss_fine,
                    jobworkFineUtilize: parseFloat(item.jobwork_fine_utilize).toFixed(3),
                    labourFineAmount: parseFloat(item.labour_fine_amount).toFixed(3),
                    catRatePerGram: parseFloat(item.category_rate).toFixed(3),
                    rate: parseFloat(item.fine_rate).toFixed(3),
                    tag_amount_after_discount: parseFloat(item.tag_amount_after_discount).toFixed(3),
                    tag_amount_before_discount: parseFloat(item.tag_amount_before_discount).toFixed(3),
                    totalAmount: parseFloat(item.total_amount).toFixed(3),
                    cgstPer: item.cgst,
                    cgstVal: item.cgst ? parseFloat((parseFloat(item.total_amount) * (parseFloat(item.cgst)))/100).toFixed(3): "",
                    sGstPer: item.sgst,
                    sGstVal: item.sgst ? parseFloat((parseFloat(item.total_amount) * (parseFloat(item.sgst)))/100).toFixed(3): "",
                    IGSTper: item.igst,
                    IGSTVal: item.igst ? parseFloat((parseFloat(item.total_amount) * (parseFloat(item.igst)))/100).toFixed(3): "",
                    total: parseFloat(item.total).toFixed(3),
                  });
                }
                setUserFormValues(tempArray);
                calculateAllData(tempArray)
              } else if (otherDetail.loadType === 1 || otherDetail.loadType === 2 || otherDetail.loadType === 3) {
                let formArr = [];
                let bomArr = [];
                for (let item of finalData.JewelleryPurchaseArticianOrders) {
                  formArr.push({
                    loadType: selectedLoad,
                    design_no : item?.design_no,
                    category: item.ProductCategory.category_name,
                    billingCategory: item.ProductCategory.billing_category_name,
                    HSNNum: item.hsn_number ? item.hsn_number : "", //item.ProductCategory.hsn_master.hsn_number,
                    lotNumber: item?.Lot?.number,
                    variant_number: item?.design_no,
                    pieces: item.pcs,
                    grossWeight: parseFloat(item.gross_wt).toFixed(3),
                    netWeight: parseFloat(item.net_wt).toFixed(3),
                    purity: item.purity,
                    jobworkFineUtilize: parseFloat(
                      item.jobwork_fine_utilize
                    ).toFixed(3),
                    wastagePer: item.wastage_per,
                    wastageFine: item.wastage_fine,
                    fineRate: parseFloat(item.fine_rate).toFixed(3),
                    goldlossper: item?.gold_loss_per,
                    goldlossFine: item?.gold_loss_fine,
                    jobworkFineUtilize: parseFloat(item.jobwork_fine_utilize).toFixed(3),
                    labourFineAmount: parseFloat(item.labour_fine_amount).toFixed(3),
                    catRatePerGram: parseFloat(item.category_rate).toFixed(3),
                    rate: parseFloat(item.fine_rate).toFixed(3),
                    tag_amount_after_discount: parseFloat(item.tag_amount_after_discount).toFixed(3),
                    tag_amount_before_discount: parseFloat(item.tag_amount_before_discount).toFixed(3),
                    totalAmount: parseFloat(item.total_amount).toFixed(3),
                    cgstPer: item.cgst,
                    cgstVal: item.cgst ? parseFloat((parseFloat(item.total_amount) * (parseFloat(item.cgst)))/100).toFixed(3): "",
                    sGstPer: item.sgst,
                    sGstVal: item.sgst ? parseFloat((parseFloat(item.total_amount) * (parseFloat(item.sgst)))/100).toFixed(3): "",
                    IGSTper: item.igst,
                    IGSTVal: item.igst ? parseFloat((parseFloat(item.total_amount) * (parseFloat(item.igst)))/100).toFixed(3): "",
                    total: parseFloat(item.total).toFixed(3),
                  });
                  if(otherDetail.loadType === 1 || otherDetail.loadType === 3){
                    for (let bom of item.Lot.LotDesigns) {
                      bomArr.push({
                        lotNumber: item.Lot.number,
                        stock_name_code: bom.DesignStockCodes.stock_code,
                        design_no: bom.LotDesignData.variant_number,
                        design_pcs: bom.design_pcs,
                        batch_no: bom.batch_no,
                        pcs: bom.pcs,
                        weight: parseFloat(bom.weight).toFixed(3),
                      });
                    }
                  }
                  if(otherDetail.loadType === 1){
                    setLotList(formArr);
                    setBomList(bomArr);
                  }if(otherDetail.loadType === 3){
                    setLotListLotwise(formArr);
                    setBomListLotwise(bomArr);
                  }
                }
                if(otherDetail.loadType === 2){
                  setProductData(formArr); //category wise Data
                  setTagWiseData(formArr);
                }
                calculateAllData(formArr)
              }
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
        // console.log(error);
        setLoading(false);
        handleError(error, dispatch, { api: api });
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

  function getJobWorkHsnGst() {
    axios
      .get(Config.getCommonUrl() + "api/hsnmaster/hsn/readjobworkhsn")
      .then(function (response) {
        console.log(response.data.data);
        if (response.data.success === true) {
          setJobWorkerGst(response.data.data.gst);
          setJobWorkerHSN(response.data.data.hsn_number);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/hsnmaster/hsn/readjobworkhsn",
        });
      });
  }

  function getStockCodeFindingVariant() {
    axios
      .get(Config.getCommonUrl() + "api/stockname/findingvariant")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockCodeData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/stockname/findingvariant" });
      });
  }

  function getStockCodeStone() {
    axios
      .get(Config.getCommonUrl() + "api/stockname/stone")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setDiffStockCode(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/stockname/stone" });
      });
  }

  function getVoucherNumber() {
    axios
      .get(Config.getCommonUrl() + "api/jewellerypurchaseartician/get/voucher")
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
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/jewellerypurchaseartician/get/voucher",
        });
      });
  }

  function handleLoadChange(event) {
    setSelectedLoad(event.target.value);
    setSelectedLoadErr("");
    reset();
  }

  function handleBomTypeChange(event) {
    setBomType(event.target.value);
    setBomTypeErr("");
  }

  function handleOppAccChange(value) {
    setOppositeAccSelected(value);
    setSelectedOppAccErr("");
  }

  const reset = () => {
    setOppositeAccSelected("");
    setSelectedOppAccErr("");
    setBomType("");
    setBomTypeErr("");
    setFirmName("");
    setFirmNameErr("")
    setSelectedJobWorker("")
    setSelectedJobWorkerErr("")
    resetFormOnly();
  }

  const resetFormOnly = () => {
    if (document.getElementById("fileinput") !== null) {
      document.getElementById("fileinput").value = "";
    }
    setCsvData("");
    setIsCsvErr(false);
    setPartyVoucherNum("");
    setPartyVoucherNumErr("")
    setPartyVoucherDate("")
    setFileSelected("");
    setIsuploaded(false)
    setSelectedVoucher([])
    setSelectVoucherErr("")
    setVoucherApiData([])
    setSelectedIndex("")
    setModallotList([])
    setMetalLotList([])
    setVendorStateId("");
    setIs_tds_tcs("");
    setTdsTcsVou("")
    setLedgerName("")
    setLedgerNmErr("")
    setRateValue("")
    setRateValErr("")
    setLegderAmount("")
    setFineRate("");
    setFineRateErr("")
    setRateProfiles([])
    setProductData([]); //category wise Data
    setTagWiseData([]);
    setLotList([]);
    setBomList([]);
    setLotListLotwise([])
    setBomListLotwise([]);
    setPcsTotal(0)
    setGrossTotal(0)
    setNetTotal(0)
    setUtilizeTotal(0)
    setSubTotal(0)
    setTotalAmt(0)
    setTotalGST(0)
    setRoundOff("")
    SetRoundOffErr("")
    setIGSTot(0)
    setCgstTot(0)
    setSGSTot(0)
    setTotalInvoiceAmount(0);
    setFinalAmount(0);
    setAccNarration("");
    setAccNarrationErr("")
    setJewelNarration("");
    setJewelNarrationErr("")
    setLotSearch("")
    setLotListApiData([])
    setDisplayLotNumber("")
    setAddedLotList([])
    setUserFormValues([{
      stockCode: "",
      stockName: "",
      HSNNum: "",
      billingCategory: "",
      purity: "",
      color: "",
      pieces: "",
      grossWeight: "",
      netWeight: "",
      isWeightDiff: "",
      DiffrentStock: [
        {
          setStockCodeId: "",
          setPcs: "",
          setWeight: "",
          errors: {
            setStockCodeId: null,
            setPcs: null,
            setWeight: null,
          },
        },
      ],
      wastagePer: "",
      wastageFine: "",
      goldlossper:"",
      goldlossFine: "",
      jobworkFineUtilize: "",
      labourFineAmount: "",
      catRatePerGram: "",
      rate: "",
      tag_amount_after_discount: "",
      tag_amount_before_discount: "",
      totalAmount: "",
      cgstPer: "",
      cgstVal: "",
      sGstPer: "",
      sGstVal: "",
      IGSTper: "",
      IGSTVal: "",
      total: "",
      errors : {}
    }])
  }

  const handlePartyChange = (value) => {
    setSelectedJobWorker(value);
    setSelectedJobWorkerErr("");
    setIsVoucherSelected(false);
    setSelectedVoucher([]);
    setVoucherApiData([]);
    resetFormOnly();
    console.log(patyData);
    const patyData = value.data
    setFirmName(patyData?.firm_name);
    setVendorStateId(patyData?.state_name.id);
    setIs_tds_tcs(parseInt(patyData?.is_tds_tcs));

    if(patyData?.is_tds_tcs !== 0 && patyData?.LedgerMaster){
      setLedgerName(patyData?.LedgerMaster?.Ledger?.name);
      setLedgerNmErr("");
      setRateValue(patyData?.LedgerMaster?.LedgerRate[0]?.rate);
      setRateValErr("");
      getTdsTcsVoucherNum(patyData?.LedgerMaster?.id);
    }else{
      setTdsTcsVou("");
      setLedgerName("");
      setRateValue("");
    }
    setLegderAmount(0); //everything is goinf to reset so 0
    getVouchers(value.value);
    if (selectedLoad === "0") {
      //if 1 then no need to call api, wastage % will come from api
      getVendorRateProfile(value.value);
    }
  }

  function getVouchers(jobworkerId) {
    setVoucherApiData([]);
    let data = {
      jobworker_id: jobworkerId,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      flag: 0,
    };
    axios
      .post(
        Config.getCommonUrl() + "api/jobWorkArticianIssue/jobworker/jobworker",data)
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
              gross_weight: parseFloat(item.gross_weight).toFixed(3),
              net_weight: parseFloat(item.net_weight).toFixed(3),
              utilize: (
                parseFloat(item.gross_weight) - parseFloat(item.balance)
              ).toFixed(3),
              balance: parseFloat(item.balance).toFixed(3),
              rate: item.rate,
              finegold: parseFloat(item.finegold).toFixed(3),
              amount: (
                parseFloat(item.rate) * parseFloat(item.finegold)
              ).toFixed(3),
              is_metal_or_lot  : item.is_metal_or_lot , 
              type : item.is_metal_or_lot === 1 ? "Lot" : "Metal",
              lotNumber : item.is_metal_or_lot === 1 ? 
                <LotNumbers id={item.id} /> : '-'
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
          api: "api/jobWorkArticianIssue/jobworker/jobworker",
          body: data,
        });
      });
  }

  function getVendorRateProfile(jobworkerID) {
    axios
      .get(Config.getCommonUrl() + `api/jobWorkerRateProfile/readAllRate/0/${jobworkerID}`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setRateProfiles(response.data.data.JobWorkerRateProfile.jobWorkerRateProfileRates);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/jobWorkerRateProfile/readAllRate/0/${jobworkerID}`,
        });
      });
  }

  const getTdsTcsVoucherNum = (ledgerMasterId) => {
    axios
    .get(
      Config.getCommonUrl() +
        `api/jewellerypurchaseartician/get/voucher/${ledgerMasterId}`)
    .then(function (response) {
      if (response.data.success === true) {
        console.log(response);
        if (Object.keys(response.data.data).length !== 0) {
          setTdsTcsVou(response.data.data.voucherNo);
        } else {
          setTdsTcsVou("");
        }}
      })
    .catch(function (error) {
      handleError(error, dispatch, {
        api: `api/jewellerypurchaseartician/get/voucher/${ledgerMasterId}`,
      });
    });
  }

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setSearchData((prevState) => ({
        ...prevState, [name]: value
    }));
  }

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "voucherNumber") {
      setVoucherNumber(value);
      setVoucherNumErr("");
    } else if (name === "voucherDate") {
      setVoucherDate(value);
      setVoucherDtErr("");
    } else if (name === "firmName") {
      setFirmName(value);
      setFirmNameErr("");
    } else if (name === "partyVoucherNum") {
      setPartyVoucherNum(value);
      setPartyVoucherNumErr("");
    }else if (name === "fineRate") {
      const regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
      setFineRate(value);
      if(regex.test(value) === false){
        setFineRateErr("Enter Valid Fine Rate");
      }else{
        setFineRateErr("")
      }
    }else if (name === "roundOff") {
      setRoundOff(value);
      if (value > 5 || value < -5) {
        SetRoundOffErr("Please Enter value between -5 to 5");
      } else {
        SetRoundOffErr("");
      }
    }else if (name === "jewelNarration") {
      setJewelNarration(value);
      setJewelNarrationErr("");
    } else if (name === "accNarration") {
      setAccNarration(value);
      setAccNarrationErr("");
    } 
  }

  const handleStockGroupChange = (i,e) => {
    const newFormValues = [...userFormValues];
    newFormValues[i].stockCode = {
      value: e.value,
      label: e.label,
      pcs_require: e.pcs_require,
    };
    const dataArr = e.data
    newFormValues[i].color = dataArr.stock_name_code.gold_color.name;
    newFormValues[i].purity = dataArr.stock_name_code.purity;
    newFormValues[i].HSNNum = jobworkerHSN; //stockCodeData[findIndex].hsn_master.hsn_number;
    newFormValues[i].stockName = dataArr.stock_name;
    newFormValues[i].billingCategory = dataArr.billing_name;
    const wastageIndex = rateProfiles.findIndex(
      (item) => item.stock_name_code_id === e.value
    );
    if (wastageIndex > -1) {
      newFormValues[i].wastagePer = parseFloat(
        rateProfiles[wastageIndex].wastage_per
      ).toFixed(3);
      newFormValues[i].errors.wastagePer = "";
    } else {
      newFormValues[i].errors.wastagePer =
        "Wastage is not added in rate profile";
    }
  
    if (vendorStateId === 12) {
      newFormValues[i].cgstPer = parseFloat(jobWorkerGst) / 2;
      newFormValues[i].sGstPer = parseFloat(jobWorkerGst) / 2;
    } else {
      newFormValues[i].IGSTper = parseFloat(jobWorkerGst);
    }
    setUserFormValues(newFormValues)
    calculateAllData(newFormValues)
    pcsInputRef.current[i].focus();
    if(!newFormValues[i+1]){
      AddNewStockRow()
    }
  }

  const calculateAllData = (arrData) => {
    const pcsTot = HelperFunc.getTotalOfFieldNoDecimal(arrData,'pieces')
    const gTot = HelperFunc.getTotalOfField(arrData,"grossWeight")
    const nTot = HelperFunc.getTotalOfField(arrData,"netWeight")
    const utilizTot = HelperFunc.getTotalOfField(arrData,"jobworkFineUtilize")
    const subTot = HelperFunc.getTotalOfField(arrData,"totalAmount")
    const mTot = HelperFunc.getTotalOfField(arrData,"total")
    let gstTot = 0
    if(vendorStateId === 12 || !arrData.IGSTVal){
      const cgstTot = HelperFunc.getTotalOfField(arrData,"cgstVal")
      const sGstTot = HelperFunc.getTotalOfField(arrData,"sGstVal")
      setCgstTot(parseFloat(cgstTot))
      setSGSTot(parseFloat(sGstTot))
      gstTot = parseFloat(cgstTot) + parseFloat(sGstTot)
    }else{
      const igstTot = HelperFunc.getTotalOfField(arrData,"IGSTVal")
      setIGSTot(parseFloat(igstTot))
      gstTot = parseFloat(igstTot)
    }
    setPcsTotal(parseFloat(pcsTot))
    setGrossTotal(parseFloat(gTot))
    setNetTotal(parseFloat(nTot))
    setUtilizeTotal(parseFloat(utilizTot))
    setSubTotal(parseFloat(subTot))
    setTotalAmt(parseFloat(mTot))
    setTotalGST(parseFloat(gstTot))
    setTotalInvoiceAmount(parseFloat(mTot))
  }

  const AddNewStockRow = () =>{
    setUserFormValues([...userFormValues,{
      stockCode: "",
      stockName: "",
      HSNNum: "",
      billingCategory: "",
      purity: "",
      color: "",
      pieces: "",
      grossWeight: "",
      netWeight: "",
      isWeightDiff: "",
      DiffrentStock: [
        {
          setStockCodeId: "",
          setPcs: "",
          setWeight: "",
          errors: {
            setStockCodeId: null,
            setPcs: null,
            setWeight: null,
          },
        },
      ],
      wastagePer: "",
      wastageFine: "",
      goldlossper:"",
      goldlossFine: "",
      jobworkFineUtilize: "",
      labourFineAmount: "",
      catRatePerGram: "",
      rate: "",
      tag_amount_after_discount: "",
      tag_amount_before_discount: "",
      totalAmount: "",
      cgstPer: "",
      cgstVal: "",
      sGstPer: "",
      sGstVal: "",
      IGSTper: "",
      IGSTVal: "",
      total: "",
      errors : {}
    }])
  }

  const deleteHandler = (index) => {
    const newFormValues = [...userFormValues];
    if(newFormValues(index + 1)){
      const newData = newFormValues.filter((item, i) => {
        if (i !== index) return item;
        return false;
      });
      setUserFormValues(newData);
      calculateAllData(newFormValues)
      (newData);
    }else{
      newFormValues[index].stockCode = "";
      newFormValues[index].stockName = "";
      newFormValues[index].HSNNum = "";
      newFormValues[index].billingCategory = "";
      newFormValues[index].purity = "";
      newFormValues[index].color = "";
      newFormValues[index].pieces = "";
      newFormValues[index].grossWeight = "";
      newFormValues[index].netWeight = "";
      newFormValues[index].isWeightDiff = "";
      newFormValues[index].DiffrentStock = [
        {
          setStockCodeId: "",
          setPcs: "",
          setWeight: "",
          errors: {
            setStockCodeId: null,
            setPcs: null,
            setWeight: null,
          },
        },
      ];
      newFormValues[index].wastagePer = "";
      newFormValues[index].wastageFine = "";
      newFormValues[index].jobworkFineUtilize = "";
      newFormValues[index].labourFineAmount = "";
      newFormValues[index].catRatePerGram = "";
      newFormValues[index].rate = "";
      newFormValues[index].tag_amount_after_discount = "";
      newFormValues[index].tag_amount_before_discount = "";
      newFormValues[index].totalAmount = "";
      newFormValues[index].cgstPer = "";
      newFormValues[index].cgstVal = "";
      newFormValues[index].sGstPer = "";
      newFormValues[index].sGstVal = "";
      newFormValues[index].IGSTper = "";
      newFormValues[index].IGSTVal = "";
      newFormValues[index].total = "";
      newFormValues[index].errors = {}
      calculateAllData(newFormValues)
      setUserFormValues(newFormValues);
    }
  }

  const deleteHandlerLot = (index,lNumber) => {
    console.log(lNumber)
    const newFormValues = [...lotListLotwise];
    const bomNewFormValues = [...bomListLotwise]
    const lotData = [...addedLotList]
      const newData = newFormValues.filter((item, i) => {
        if (i !== index) return item;
        return false;
      });
      const newBomData = bomNewFormValues.filter((item, i) => {
        if (item.lotNumber !== lNumber) return item;
        return false;
      });
      const newLotIds = lotData.filter((item, i) => {
        if (item !== lNumber) return item;
        return false;
      });
      setLotListLotwise(newData);
      setBomListLotwise(newBomData);
      setAddedLotList(newLotIds)
      calculateAllData(newData)
  }
  console.log(addedLotList)

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

  const handleClick = (event) => {
    if (validateBomOrNot() && 
      handleDateBlur() &&
      voucherNumValidation() &&
      partyNameValidation() &&
      oppositeAcValidation() &&
      fineRateValidation() && 
      voucherValidate()) {
      hiddenFileInput.current.click();
    } 
  };

  const handleVoucherSelect = (e) =>{
    const newSelection = JSON.parse(e.target.value);
    let newSelectedVoucher;
    let ismetalLotlist;
    if (selectedVoucher.indexOf(newSelection.id) > -1 ) {
      newSelectedVoucher = selectedVoucher.filter((s) => s !== newSelection.id);
      ismetalLotlist = metalLotList.filter((s) => s.id !== newSelection.id);
    } else {
      if(metalLotList.length === 0){
        newSelectedVoucher = [...selectedVoucher, newSelection.id];
        ismetalLotlist = [...metalLotList, newSelection];
      }else if(metalLotList.length > 0 && metalLotList[0].is_metal_or_lot ===  newSelection.is_metal_or_lot){
        newSelectedVoucher = [...selectedVoucher, newSelection.id];
        ismetalLotlist = [...metalLotList, newSelection];
      }else{
        newSelectedVoucher = [...selectedVoucher];
        ismetalLotlist = [...metalLotList];
        dispatch(Actions.showMessage({ message: "Select same type voucher" }));
      }
    }
    setMetalLotList(ismetalLotlist)
    setSelectedVoucher(newSelectedVoucher);
    setSelectVoucherErr("");
  }

  const handleChangeLot = (i, e) => {
    const newFormValues = [...lotListLotwise];
    const name = e.target.name;
    const value = e.target.value;

    newFormValues[i][name] = value;
    newFormValues[i].errors[name] = "";

    if(name === "grossWeight" && isNaN(value)){
      newFormValues[i].errors[name] = "Enter valid gross wgt"
    }else if(name === "goldlossper" && isNaN(value)){
      newFormValues[i].errors[name] = "Enter valid percentage"
    }

    const gWgt = newFormValues[i].grossWeight ? newFormValues[i].grossWeight : 0;
    const nWgt = newFormValues[i].netWeight ? newFormValues[i].netWeight : 0;
    const purityVal = newFormValues[i].purity ? newFormValues[i].purity : 0;
    const gPercentage = newFormValues[i].goldlossper ? newFormValues[i].goldlossper : 0;
    const perRate = newFormValues[i].fineRate ? newFormValues[i].fineRate : 0
    const totalStonewgt = newFormValues[i].total_stone_wt ? newFormValues[i].total_stone_wt : 0
    const wastePerVal = newFormValues[i].wastagePer ? newFormValues[i].wastagePer : 0;

    if(name === "grossWeight"){
      if(parseFloat(gWgt) === parseFloat(nWgt)){
        newFormValues[i].isWeightDiff = 1;
      }else{
        newFormValues[i].isWeightDiff = 0;
      }
      if(parseFloat(gWgt) < parseFloat(nWgt)){
        newFormValues[i].errors.grossWeight =
        "Net Weight Can not be Greater than Gross Weight";
      }else{
        newFormValues[i].errors.grossWeight = ""
      }
    }

    newFormValues[i].netWeight = parseFloat(parseFloat(gWgt) - parseFloat(totalStonewgt))
    newFormValues[i].jobworkFineUtilize = parseFloat((parseFloat(newFormValues[i].netWeight) * parseFloat(purityVal)) / 100).toFixed(3)
    const wasteFineVal = parseFloat((parseFloat(parseFloat(newFormValues[i].netWeight)) * parseFloat(wastePerVal)) / 100).toFixed(3);
    newFormValues[i].wastageFine = wasteFineVal ? wasteFineVal : 0
    const goldLossVal = parseFloat((parseFloat(newFormValues[i].netWeight) * parseFloat(gPercentage)) / 100).toFixed(3)
    newFormValues[i].goldlossFine = goldLossVal ? goldLossVal : 0
    const gFine = newFormValues[i].goldlossFine ? newFormValues[i].goldlossFine : 0
    const wFine = newFormValues[i].wastageFine ? newFormValues[i].wastageFine : 0
    const diffFine = parseFloat(parseFloat(wFine) - parseFloat(gFine))
    const labourAmts = parseFloat((parseFloat(diffFine) * parseFloat(perRate)) /10).toFixed(3);
    newFormValues[i].labourFineAmount = labourAmts ? labourAmts : 0
    const totalAmts = parseFloat(parseFloat(newFormValues[i].labourFineAmount)).toFixed(3);
    newFormValues[i].totalAmount = totalAmts ? totalAmts : 0
    const perGramAmt = parseFloat((parseFloat(newFormValues[i].totalAmount) / parseFloat(newFormValues[i].netWeight))).toFixed(3);
    newFormValues[i].catRatePerGram = perGramAmt && !isNaN(perGramAmt) ? perGramAmt : 0
    if(vendorStateId === 12){
      const totalAmtVal = newFormValues[i].totalAmount ? newFormValues[i].totalAmount : 0
      const cgstperVal = newFormValues[i].cgstPer ? newFormValues[i].cgstPer : 0
      const sgstPerVal = newFormValues[i].sGstPer ? newFormValues[i].sGstPer : 0

      const cgstValAmt = parseFloat((parseFloat(totalAmtVal)) * (parseFloat(cgstperVal)) / 100).toFixed(3);
      const sgstValAmt = parseFloat((parseFloat(totalAmtVal)) * (parseFloat(sgstPerVal)) / 100).toFixed(3);

      newFormValues[i].cgstVal = cgstValAmt ? cgstValAmt : 0
      newFormValues[i].sGstVal = sgstValAmt ? sgstValAmt : 0
      newFormValues[i].total = parseFloat(parseFloat(totalAmtVal) + parseFloat(cgstValAmt) + parseFloat(sgstValAmt)).toFixed(3);
    }else{
      const totalAmtVal = newFormValues[i].totalAmount ? newFormValues[i].totalAmount : 0
      const igstperVal = newFormValues[i].cgstPer ? newFormValues[i].cgstPer : 0

      const igstValAmt = parseFloat((parseFloat(totalAmtVal)) * (parseFloat(igstperVal)) / 100).toFixed(3);
      newFormValues[i].IGSTVal = igstValAmt ? igstValAmt : 0
      newFormValues[i].total = parseFloat(parseFloat(totalAmtVal) + parseFloat(igstValAmt)).toFixed(3);
    }
    setLotListLotwise(newFormValues);
    calculateAllData(newFormValues)
  }

  const handleChange = (i,e) => {
    const newFormValues = [...userFormValues];
    const name = e.target.name;
    const value = e.target.value;

    newFormValues[i][name] = value;
    newFormValues[i].errors[name] = "";

    if(name === "pieces" && isNaN(value)){
      newFormValues[i].errors[name] = "Enter valid pieces"
    }else if(name === "grossWeight" && isNaN(value)){
      newFormValues[i].errors[name] = "Enter valid gross wgt"
    }else if(name === "netWeight" && isNaN(value)){
      newFormValues[i].errors[name] = "Enter valid net wgt"
    }else if(name === "tag_amount_before_discount" && isNaN(value)){
      newFormValues[i].errors[name] = "Enter valid amount"
    }else if(name === "tag_amount_after_discount" && isNaN(value)){
      newFormValues[i].errors[name] = "Enter valid amount"
    }else if(name === "goldlossper" && isNaN(value)){
      newFormValues[i].errors[name] = "Enter valid percentage"
    }

    if(name === "grossWeight" || name === "netWeight" || name === "tag_amount_before_discount" 
    || name === "tag_amount_after_discount" || name === "goldlossper"){
      const gWgt = newFormValues[i].grossWeight ? newFormValues[i].grossWeight : 0;
      const nWgt = newFormValues[i].netWeight ? newFormValues[i].netWeight : 0;
      const purityVal = newFormValues[i].purity ? newFormValues[i].purity : 0;
      const wastePerVal = newFormValues[i].wastagePer ? newFormValues[i].wastagePer : 0;
      const tagAftDis = newFormValues[i].tag_amount_after_discount ? newFormValues[i].tag_amount_after_discount : 0
      const gPercentage = newFormValues[i].goldlossper ? newFormValues[i].goldlossper : 0;

      if(name === "netWeight" || name === "grossWeight"){
        if(parseFloat(gWgt) === parseFloat(nWgt)){
          newFormValues[i].isWeightDiff = 1;
        }else{
          newFormValues[i].isWeightDiff = 0;
        }
        if(parseFloat(gWgt) < parseFloat(nWgt)){
          newFormValues[i].errors.netWeight =
          "Net Weight Can not be Greater than Gross Weight";
        }else{
          newFormValues[i].errors.grossWeight = ""
          newFormValues[i].errors.netWeight = ""
        }
      }
      newFormValues[i].jobworkFineUtilize = parseFloat((parseFloat(nWgt) * parseFloat(purityVal)) / 100).toFixed(3)
      const goldLossVal = parseFloat((parseFloat(nWgt) * parseFloat(gPercentage)) / 100).toFixed(3)
      newFormValues[i].goldlossFine = goldLossVal ? goldLossVal : 0
      const wasteFineVal = parseFloat((parseFloat(nWgt) * parseFloat(wastePerVal)) / 100).toFixed(3);
      newFormValues[i].wastageFine = wasteFineVal ? wasteFineVal : 0
      const perRate = fineRate ? parseFloat(fineRate).toFixed(3) : 0
      newFormValues[i].rate = parseFloat(perRate).toFixed(3);
      const wFine = newFormValues[i].wastageFine ? newFormValues[i].wastageFine : 0
      const gFine = newFormValues[i].goldlossFine ? newFormValues[i].goldlossFine : 0
      const diffFine = parseFloat(parseFloat(wFine) - parseFloat(gFine))
      const labourAmts = parseFloat((parseFloat(diffFine) * parseFloat(perRate)) /10).toFixed(3);
      newFormValues[i].labourFineAmount = labourAmts ? labourAmts : 0
      const totalAmts = parseFloat(parseFloat(newFormValues[i].labourFineAmount) + parseFloat(tagAftDis)).toFixed(3);
      newFormValues[i].totalAmount = totalAmts ? totalAmts : 0
      const perGramAmt = parseFloat((parseFloat(newFormValues[i].totalAmount) / parseFloat(nWgt))).toFixed(3);
      newFormValues[i].catRatePerGram = perGramAmt && !isNaN(perGramAmt) ? perGramAmt : 0

      if(vendorStateId === 12){
        const totalAmtVal = newFormValues[i].totalAmount ? newFormValues[i].totalAmount : 0
        const cgstperVal = newFormValues[i].cgstPer ? newFormValues[i].cgstPer : 0
        const sgstPerVal = newFormValues[i].sGstPer ? newFormValues[i].sGstPer : 0

        const cgstValAmt = parseFloat((parseFloat(totalAmtVal)) * (parseFloat(cgstperVal)) / 100).toFixed(3);
        const sgstValAmt = parseFloat((parseFloat(totalAmtVal)) * (parseFloat(sgstPerVal)) / 100).toFixed(3);

        newFormValues[i].cgstVal = cgstValAmt ? cgstValAmt : 0
        newFormValues[i].sGstVal = sgstValAmt ? sgstValAmt : 0
        newFormValues[i].total = parseFloat(parseFloat(totalAmtVal) + parseFloat(cgstValAmt) + parseFloat(sgstValAmt)).toFixed(3);
      }else{
        const totalAmtVal = newFormValues[i].totalAmount ? newFormValues[i].totalAmount : 0
        const igstperVal = newFormValues[i].cgstPer ? newFormValues[i].cgstPer : 0

        const igstValAmt = parseFloat((parseFloat(totalAmtVal)) * (parseFloat(igstperVal)) / 100).toFixed(3);
        newFormValues[i].IGSTVal = igstValAmt ? igstValAmt : 0
        newFormValues[i].total = parseFloat(parseFloat(totalAmtVal) + parseFloat(igstValAmt)).toFixed(3);
      }
    }
    setUserFormValues(newFormValues)
    calculateAllData(newFormValues)
  }

  const handlefilechange = (e) => {
    const file = e.target.files[0]
    setFileSelected(file)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("voucher_no", voucherNumber);
    formData.append("voucherId", JSON.stringify(selectedVoucher));
    formData.append("party_voucher_no", partyVoucherNum);
    formData.append("opposite_account_id", oppositeAccSelected.value);
    formData.append(
      "department_id",
      window.localStorage.getItem("SelectedDepartment")
    );
    formData.append("jobworker_id", selectedJobWorker.value);
    formData.append("round_off", roundOff === "" ? 0 : roundOff);
    formData.append("jewellery_narration", jewelNarration);
    formData.append("account_narration", accNarration);
    formData.append("fine_rate", fineRate);
    if (selectedLoad === "2") {
      // is_barcoded
      formData.append("is_barcoded", 1);
      formData.append("with_bom", bomType);
    }
    if (allowedBackDate) {
      formData.append("purchaseCreateDate", voucherDate);
    }
    if (is_tds_tcs === "1") {
      formData.append("tcs_rate", ledgerAmount);
    }
    let Url =
      selectedLoad === "2"
        ? "api/jewellerypurchaseartician/createfromexcel/barcode"
        : "api/jewellerypurchaseartician/createfromexcel";

        setLoading(true);
        axios
          .post(Config.getCommonUrl() + Url, formData)
          .then(function (response) {
            console.log(response);
            setLoading(false);
            if (response.data.success === true) {
              // console.log(response);
              const dataArr = response.data.data
              const orderData = dataArr.finalrecord
              const lotsArr = [];
              const bomArr = [];
             
              orderData.map((item, i) => {
                lotsArr.push({
                  loadType: selectedLoad,
                  category: item.Category,
                  billingCategory: item.billingCategoryName,
                  HSNNum: item.hsnNumber, //item.hsnNumber,
                  lotNumber: item.lotNumber,
                  pieces: item.pcs,
                  grossWeight: item.gross_wt,
                  netWeight: item.net_wt,
                  purity: item.purity,
                  variant_number: item?.design_no,
                  jobworkFineUtilize: parseFloat(item.jobwork_fine_utilize).toFixed(3),
                  wastagePer: item.wastage_per,
                  wastageFine: parseFloat(item.wastage_fine).toFixed(3),
                  goldlossper: item.gold_loss_per,
                  goldlossFine: parseFloat(item.gold_loss_fine).toFixed(3),
                  fineRate: parseFloat(item.fine_rate).toFixed(3),
                  labourFineAmount: parseFloat(item.labour_fine_amount).toFixed(3),
                  tag_amount_after_discount: parseFloat(
                    item.tag_amount_after_discount
                  ).toFixed(3),
                  tag_amount_before_discount: parseFloat(
                    item.tag_amount_before_discount
                  ).toFixed(3),
                  catRatePerGram: parseFloat(item.category_rate).toFixed(3),
                  totalAmount: parseFloat(item.total_amount).toFixed(3),
                  ...(vendorStateId === 12 && {
                    cgstPer: item.cgst, //show gst % of product and calculate with jobworker's gst
                    cgstVal: parseFloat(item.cgstAmount).toFixed(3),
                    sGstPer: item.sgst,
                    sGstVal: parseFloat(item.sgstAmount).toFixed(3),}),
                  ...(vendorStateId !== 12 && {
                    IGSTper: item.igst,
                    IGSTVal: parseFloat(item.igstAmount).toFixed(3),
                  }),
                  total: parseFloat(item.total).toFixed(3)
                })
              })
              if(selectedLoad === "1"){
                const dataArr = response.data.data.lotDetail
                dataArr.map((bom)=>{
                  bomArr.push({
                    lotNumber: bom.number,
                    stock_name_code: bom.DesignStockCodes.stock_name_code,
                    design_no: bom.LotDesignData.variant_number,
                    design_pcs: bom.design_pcs,
                    batch_no: bom.batch_no,
                    pcs: bom.pcs,
                    weight: bom.weight,
                  })
                })
                setBomList(bomArr);
                setLotList(lotsArr);
              }
              if(selectedLoad === "2"){
                const dataArr = response.data.data.categoryData
                const tempcatArr = []
                dataArr.map((item)=>{
                  tempcatArr.push({
                      loadType: selectedLoad,
                      category: item.Category,
                      billingCategory: item.billingCategoryName,
                      HSNNum: jobworkerHSN, //item.hsnNumber,
                      lotNumber: item.lotNumber,
                      pieces: item.pcs,
                      grossWeight: item.gross_wt,
                      netWeight: item.net_wt,
                      purity: item.purity,
                      jobworkFineUtilize: parseFloat(
                        item.jobwork_fine_utilize
                      ).toFixed(3),
                      wastagePer: item.wastage_per,
                      wastageFine: parseFloat(item.wastage_fine).toFixed(3),
                      goldlossper: item.gold_loss_per,
                      goldlossFine: parseFloat(item.gold_loss_fine).toFixed(3),
                      fineRate: parseFloat(item.fine_rate).toFixed(3),
                      labourFineAmount: parseFloat(item.labour_fine_amount).toFixed(3),
                      tag_amount_after_discount: parseFloat(
                        item.tag_amount_after_discount
                      ).toFixed(3),
                      tag_amount_before_discount: parseFloat(
                        item.tag_amount_before_discount
                      ).toFixed(3),
                      catRatePerGram: parseFloat(item.category_rate).toFixed(3),
                      totalAmount: parseFloat(item.total_amount).toFixed(3),
                      ...(vendorStateId === 12 && {
                        cgstPer: item.cgst, //show gst % of product and calculate with jobworker's gst
                        cgstVal: parseFloat(parseFloat(item.cgst) * parseFloat(item.total_amount) / 100) .toFixed(3),
                        sGstPer: item.sgst,
                        sGstVal: parseFloat(parseFloat(item.sgst) * parseFloat(item.total_amount) / 100) .toFixed(3)}),
                      ...(vendorStateId !== 12 && {
                        IGSTper: item.igst,
                        IGSTVal: parseFloat(parseFloat(item.igst) * parseFloat(item.total_amount) / 100) .toFixed(3),
                      }),
                      total: parseFloat(item.total).toFixed(3)
                    })
                  })
                setProductData(tempcatArr)
                setTagWiseData(lotsArr);
              }
              calculateAllData(lotsArr)
              setIsCsvErr(false);
            } else {
              if (response.data.hasOwnProperty("csverror")) {
                if (response.data.csverror === 1) {
                  if (response.data.hasOwnProperty("url")) {
                    let downloadUrl = response.data.url
                    setCsvData(downloadUrl);
                  }
                  document.getElementById("fileinput").value = "";
                  setIsCsvErr(true);
                }
              }
              dispatch(Actions.showMessage({ message: response.data.message }));
            }
          })
          .catch((error) => {
            setLoading(false);
            document.getElementById("fileinput").value = "";
            handleError(error, dispatch, {
              api: Url,
              body: JSON.stringify(formData),
            });
          });
  }
  const handleChangeTab = (event, value) => {
    setModalView(value);
  };

  const handleLotTabChange = (event, value) => {
    setLotModalView(value);
  };

  const handleDocModalClose = () => {
    setDocModal(false);
  };

  function handleWeightStockChange(index, e) {
    let newDiffrentStock = [...DiffrentStock];
    newDiffrentStock[index].setStockCodeId = {
      value: e.value,
      label: e.label,
    };
    newDiffrentStock[index].errors.setStockCodeId = null;
    setDiffrentStock(newDiffrentStock);

    let newFormValues = [...userFormValues];
    newFormValues[selectedIndex].DiffrentStock = newDiffrentStock;
    setUserFormValues(newFormValues);
  }

  const validateEntry = () => {
    const allPrev = [...DiffrentStock]
    const checkRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
    let res = false
    allPrev.map((item, index) =>{
      if(item.setStockCodeId){
        if(!item.setPcs || checkRegex.test(item.setPcs) === false){
          allPrev[index].errors.setPcs = "Enter Pieces";
        }else if(!item.setWeight || checkRegex.test(item.setWeight) === false){
          allPrev[index].errors.setWeight = "Enter Weight";
        }else{
          res = true;
        }
      }
    })
    setDiffrentStock(allPrev);
    return res;
  }

  const checkTotal = () => {
    const grossTotal = Number(userFormValues[selectedIndex].grossWeight);
    const netTotal = Number(userFormValues[selectedIndex].netWeight);
    let weightTotal = 0;

    DiffrentStock.map((item) => {
      weightTotal += Number(item.setWeight);
      return null;
    });

    if (netTotal + weightTotal === grossTotal) {
      return true;
    } else {
      dispatch(Actions.showMessage({ message: "Enter valid weight" }));
      return false;
    }
  };

  const checkforUpdate = (evt) => {
    evt.preventDefault();
      if(validateEntry() && checkTotal()){
        userFormValues[selectedIndex].isWeightDiff = 1;
        userFormValues[selectedIndex].errors.netWeight = "";
        setUserFormValues(userFormValues);
        setModalOpen(false)
      };
  };

  function AddNewRow() {
    let newDiffrentStock = [...DiffrentStock];
    newDiffrentStock.push({
      setStockCodeId: "",
      setPcs: "",
      setWeight: "",
      errors: {
        setStockCodeId: null,
        setPcs: null,
        setWeight: null,
      },
    });
    setDiffrentStock(newDiffrentStock);
  }

  const handleNarrationClick = () => {
    if (narrationFlag === false) {
      setLoading(true);
      const body = {
        flag: 3,
        id: idToBeView.id,
        metal_narration: jewelNarration,
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
          handleError(error, dispatch, {
            api: "api/admin/voucher",
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

  function handleStockInputChange(i, e) {
    const newDiffrentStock = [...DiffrentStock];
    const val = e.target.value;

    newDiffrentStock[i][e.target.name] = val;
    newDiffrentStock[i].errors[e.target.name] = null;
    setDiffrentStock(newDiffrentStock);

    const newFormValues = [...userFormValues];
    newFormValues[selectedIndex].DiffrentStock = newDiffrentStock;
    setUserFormValues(newFormValues);
  }

  function deleteDiffrentStock(index) {
    let newDiffrentStock = [...DiffrentStock];
    let newFormValues = [...userFormValues];
    if (newDiffrentStock.length === 1) {
      newDiffrentStock[index] = {
        setStockCodeId: "",
        setPcs: "",
        setWeight: "",
        errors: {
          setStockCodeId: null,
          setPcs: null,
          setWeight: null,
        },
      };
    } else {
      newDiffrentStock.splice(index, 1);
    }
    setDiffrentStock(newDiffrentStock);
    newFormValues[selectedIndex].DiffrentStock = newDiffrentStock;
    setUserFormValues(newFormValues);
  }

  function handleModalOpen(index) {
    setSelectedIndex(index);
    setModalOpen(true);

    if (userFormValues[index].DiffrentStock.length > 0) {
      console.log("if");
      setDiffrentStock(userFormValues[index].DiffrentStock);
    }
  }

  const handleListLotModal = (id) => {
    setLotListModalView(true);
    axios
    .get(Config.getCommonUrl() + `api/jobWorkArticianIssue/lot/voucher/${id}`)
    .then(function (response) {
      if (response.data.success === true) {
        console.log(response);
        setModallotList(response.data.data.JobWorkArticianIssueOrder);
      } else {
        dispatch(Actions.showMessage({ message: response.data.message }));
      }
    })
    .catch((error) => {
      handleError(error, dispatch, { api: `api/jobWorkArticianIssue/lot/voucher/${id}` });
    });
  }

  const handleLotSelect = (lotNum) => {
    console.log(lotNum)
    const filteredArray = lotListApiData.filter(
      (item) => item.Lot.number === lotNum
    );
    if (filteredArray.length > 0) {
      setDisplayLotNumber(lotNum);
      if (!addedLotList.includes(lotNum)) {
        setAddedLotList([...addedLotList, lotNum]);
        setArrayForBothTab(filteredArray)
      } else {
        dispatch(
          Actions.showMessage({
            message: "This barcode alredy added",
          })
        );
      }
    } else {
      setDisplayLotNumber("");
    }
  }

  const setArrayForBothTab = (arrays) => {
    const arrData = arrays
    const lotsArr = [...lotListLotwise];
    const bomArr = [...bomListLotwise];
    arrData.map((item) => {
      lotsArr.push({
        loadType: selectedLoad,
        category: item?.Lot?.LotProductCategory?.category_name,
        categoryId: item?.Lot?.LotProductCategory?.id,
        billingCategory: item?.Lot?.LotProductCategory?.billing_category_name,
        HSNNum: item?.hsn_number, //item.hsnNumber,
        lotNumber: item?.Lot?.number,
        pieces: item?.pcs,
        grossWeight: item?.gross_weight,
        netWeight: item?.net_weight,
        purity: item?.purity,
        fineRate: parseFloat(item?.rate_of_fine_gold).toFixed(3),
        variant_number: item?.design_no,
        jobworkFineUtilize: parseFloat(item.jobwork_fine_utilize).toFixed(3),
        wastagePer: item.wastage_per,
        wastageFine: parseFloat(item.wastage_fine).toFixed(3),
        labourFineAmount: parseFloat(item.labour_fine_amount).toFixed(3),
        tag_amount_after_discount: parseFloat(
          item.tag_amount_after_discount
        ).toFixed(3),
        tag_amount_before_discount: parseFloat(
          item.tag_amount_before_discount
        ).toFixed(3),
        catRatePerGram: parseFloat(item.category_rate).toFixed(3),
        totalAmount: parseFloat(item.total_amount).toFixed(3),
        ...(vendorStateId === 12 && {
          cgstPer: item.cgst, //show gst % of product and calculate with jobworker's gst
          cgstVal: parseFloat(item.cgstAmount).toFixed(3),
          sGstPer: item.sgst,
          sGstVal: parseFloat(item.sgstAmount).toFixed(3),}),
        ...(vendorStateId !== 12 && {
          IGSTper: item.igst,
          IGSTVal: parseFloat(item.igstAmount).toFixed(3),
        }),
        total: parseFloat(item.total).toFixed(3),
        total_stone_wt : parseFloat(item.total_stone_weight),
        goldlossper : '',
        goldlossFine : '',
        errors : {}
      })

      item.Lot.LotDesigns.map((temp)=>{
        bomArr.push({
          lotNumber: item?.Lot?.number,
          stock_name_code: temp?.DesignStockCodes?.stock_code,
          design_no: temp?.LotDesignData?.variant_number,
          design_pcs: temp?.design_pcs,
          batch_no: temp?.batch_no,
          pcs: temp?.pcs,
          weight: temp?.weight,
        })
      })
     
    })
    setDisplayLotNumber("")
    setBomListLotwise(bomArr);
    setLotListLotwise(lotsArr);
    calculateAllData(lotsArr)
  }

  const handleModalCloseVoucher = () => {
    if(selectedVoucher.length > 0){
      setvoucherModalOpen(false);
      setIsVoucherSelected(true);
    }
  }

  const handleModalCloseCross = () => {
    if(selectedVoucher.length === 0){
      setIsVoucherSelected(false);
    }
    setvoucherModalOpen(false)
  }

  const validateLoadType = () => {
    if(selectedLoad === ""){
      setSelectedLoadErr("Select load type");
      return false
    }
    return true;
  }

  function voucherNumValidation() {
    if (voucherNumber === "") {
      setVoucherNumErr("Enter Valid Voucher Number");
      return false;
    }
    return true;
  }

  function partyNameValidation() {
    if (selectedJobWorker === "") {
      setSelectedJobWorkerErr("Please Select Job worker");
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

  function fineRateValidation() {
    const regex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
    if (!fineRate || regex.test(fineRate) === false) {
      setFineRateErr("Enter Valid Fine Rate");
      return false;
    }
    return true;
  }

  function validateArticianEntry(){
    if(selectedLoad === "0" && userFormValues[0].stockCode === ""){
      dispatch(Actions.showMessage({ message: "Select stock code" }));
      return false;
    }else if(selectedLoad === "1" && lotList.length === 0){
      dispatch(Actions.showMessage({ message: "Please Upload file" }));
      return false;
    }else if(selectedLoad === "2" && productData.length === 0){
      dispatch(Actions.showMessage({ message: "Please Upload file" }));
      return false;
    }else if(selectedLoad === "3" && lotListLotwise.length === 0){
      dispatch(Actions.showMessage({ message: "Please Scan a lot" }));
      return false;
    }else{
      return true;
    }
  }

  function validateRowEntry(){
    const newFormValues = [...userFormValues];
    const weightRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
    let result = false
    newFormValues.map((item, i) => {
      if(item.stockCode){
        if(item.stockCode.pcs_require === 1 && item.pieces === ""){
          newFormValues[i].errors.pieces = "Enter Pieces"
        }else if(!item.grossWeight || weightRegex.test(item.grossWeight) === false || item.grossWeight == 0){
          newFormValues[i].errors.grossWeight = "Enter Gross Weight"
        }else if(!item.netWeight || weightRegex.test(item.netWeight) === false || item.netWeight == 0){
          newFormValues[i].errors.netWeight = "Enter Net Weight"
        }else if(item.netWeight && parseFloat(item.netWeight) > parseFloat(item.grossWeight)){
          newFormValues[i].errors.netWeight = "Net Weight Can not be Greater than Gross Weight"
        }else if(item.isWeightDiff === 0){
          newFormValues[i].errors.netWeight = "Weight Doesn't match"
        }else if(item.goldlossper === ""){
          newFormValues[i].errors.goldlossper = "Enter goldloss percentage"
        }else if(item.tag_amount_after_discount === ""){
          newFormValues[i].errors.tag_amount_after_discount = "Enter Tag Amount After Discount"
        }else if(item.tag_amount_before_discount === ""){
          newFormValues[i].errors.tag_amount_before_discount = "Enter Tag Amount Before Discount"
        }else{
          result = true;
        }
      }
    })
    setUserFormValues(newFormValues);
    return result;
  }

  function validateLotRowEntry(){
    const newFormValues = [...lotListLotwise];
    const weightRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
    let result = false
    newFormValues.map((item, i) => {
      if(item.category){
        if(!item.grossWeight || weightRegex.test(item.grossWeight) === false || item.grossWeight == 0){
          newFormValues[i].errors.grossWeight = "Enter Gross Weight"
        }else if(item.goldlossper === ""){
          newFormValues[i].errors.goldlossper = "Enter goldloss percentage"
        }else{
          result = true;
        }
      }
    })
    setLotListLotwise(newFormValues);
    return result;
  }

  const validateEmptyError = () => {
    let arrData = selectedLoad === "0" ? userFormValues : lotListLotwise;
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

  const validateBomOrNot = () => {
    if(selectedLoad === "2" && bomType === ""){
      setBomTypeErr("Please Select Bom Type");
      return false;
    }
    return true;
  }

  const voucherValidate = () => {
    if(!isVoucherSelected || selectedVoucher.length === 0){
      setSelectVoucherErr("Please Select Voucher");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if(validateLoadType() && 
      validateBomOrNot() &&
      handleDateBlur() &&
      voucherNumValidation() &&
      partyNameValidation() &&
      oppositeAcValidation() &&
      fineRateValidation() && 
      voucherValidate () &&
      validateArticianEntry() 
    ){
      if(selectedLoad === "0"){
        if(validateRowEntry() && validateEmptyError()){
          addApiNormalEntry(true, false)
        }
      }else if(selectedLoad === "3"){
        if(validateLotRowEntry() && validateEmptyError()){
          addScanLotapi(true, false)
        }
      }else if(selectedLoad === "1" || selectedLoad === "2"){
        addArticianReceiveApi(true, false)
      }
    }
  }

  const addArticianReceiveApi = (resetFlag, toBePrint) => {
    const formData = new FormData();
    formData.append("file", fileSelected);
    formData.append("voucherId", JSON.stringify(selectedVoucher));
    formData.append("voucher_no", voucherNumber);
    formData.append("party_voucher_no", partyVoucherNum);
    formData.append("opposite_account_id", oppositeAccSelected.value);
    formData.append(
      "department_id",
      window.localStorage.getItem("SelectedDepartment")
    );
    formData.append("jobworker_id", selectedJobWorker.value);
    formData.append("round_off", roundOff === "" ? 0 : roundOff);
    formData.append("jewellery_narration", jewelNarration);
    formData.append("account_narration", accNarration);
    formData.append("fine_rate", fineRate);

    formData.append("uploadDocIds", JSON.stringify(docIds));
    formData.append("party_voucher_date", partyVoucherDate);
    // "0" = Load Lot directly (from Excel)
    // "1" = Load Barcoded Stock form excel
    if (selectedLoad === "2") {
      // is_barcoded
      formData.append("is_barcoded", 1);
      formData.append("with_bom", bomType);
    }
    if (allowedBackDate) {
      formData.append("purchaseCreateDate", voucherDate);
    }
    if (is_tds_tcs === "1") {
      formData.append("tcs_rate", ledgerAmount);
    }
    
    let Url =
      selectedLoad === "2"
        ? "api/jewellerypurchaseartician/createfromexcel/barcode?save=1"
        : "api/jewellerypurchaseartician/createfromexcel?save=1";
    setLoading(true);
    axios
      .post(Config.getCommonUrl() + Url, formData)
      .then(function (response) {
        console.log(response);
        setLoading(false);
        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          if (resetFlag === true) {
            checkAndReset();
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record
            handlePrint();
          }
        } else {
          if (response.data.csverror === 1) {
            console.log("csverror");
            if (response.data.hasOwnProperty("url")) {
              let downloadUrl = response.data.url;
              setCsvData(downloadUrl);
            }
            document.getElementById("fileinput").value = "";
            setIsCsvErr(true);
          }
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);
        document.getElementById("fileinput").value = "";
        handleError(error, dispatch, {
          api: Url,
          body: JSON.stringify(formData),
        });
      });
  }

  const addApiNormalEntry = (resetFlag, toBePrint) => {
    setLoading(true);
    const Orders = userFormValues
    .filter((element) => element.grossWeight !== "")
    .map((x) => {
      if (parseFloat(x.grossWeight) !== parseFloat(x.netWeight)) {
        return {
          stock_name_code_id: x.stockCode.value,
          gross_weight: x.grossWeight,
          net_weight: x.netWeight,
          ...(x.pieces !== "" && {
            pcs: x.pieces, //user input
          }),
          setStockCodeArray: x.DiffrentStock.map((y) => {
            return {
              setStockCodeId: y.setStockCodeId.value,
              setPcs: y.setPcs,
              setWeight: y.setWeight,
            };
          }),
          gols_loss_per : x.goldlossper,
          gold_loss_fine : x.goldlossFine,
          Wastage_percentage: x.wastagePer,
          tag_amount_after_discount: x.tag_amount_after_discount,
          tag_amount_before_discount: x.tag_amount_before_discount,
        };
      } else {
        return {
          stock_name_code_id: x.stockCode.value,
          gross_weight: x.grossWeight,
          net_weight: x.netWeight,
          Wastage_percentage: x.wastagePer,
          gols_loss_per : x.goldlossper,
          gold_loss_fine : x.goldlossFine,
          tag_amount_after_discount: x.tag_amount_after_discount,
          tag_amount_before_discount: x.tag_amount_before_discount,
          ...(x.pieces !== "" && {
            pcs: x.pieces, //user input
          }),
        };
      }
    });
  console.log(Orders);
    const body = {
      voucher_no: voucherNumber,
      party_voucher_no: partyVoucherNum,
      voucherId: selectedVoucher,
      opposite_account_id: oppositeAccSelected.value,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      jobworker_id: selectedJobWorker.value,
      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),
      fine_rate: fineRate,
      round_off: roundOff === "" ? 0 : roundOff,
      jewellery_narration: jewelNarration,
      account_narration: accNarration,
      Orders: Orders,
      ...(is_tds_tcs === "1" && {
        tcs_rate: ledgerAmount,
      }),
      uploadDocIds: docIds,
      party_voucher_date: partyVoucherDate,
    }
    console.log(body,"bodyyyy")
    axios
      .post(Config.getCommonUrl() + "api/jewellerypurchaseartician", body)
      .then(function (response) {
        console.log(response);
        setLoading(false);

        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.goBack();
          if (resetFlag === true) {
             checkAndReset();
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record
             handlePrint();
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/jewellerypurchaseartician",
          body: body,
        });
      });
  }

  const checkforPrint = () => {
    console.log(selectedJobWorker)
    setPrintObj({
      stateId: vendorStateId,
      is_tds_tcs: is_tds_tcs,
      supplierName: selectedJobWorker?.label,
      supAddress: selectedJobWorker?.data?.address,
      supplierGstUinNum: selectedJobWorker?.data?.gst_number,
      supPanNum: selectedJobWorker?.data?.pan_number,
      supState: selectedJobWorker?.data?.state_name.name,
      supCountry: selectedJobWorker?.data?.country_name.name,
      supStateCode: selectedJobWorker?.data?.gst_number
        ? selectedJobWorker?.data?.gst_number.substring(0, 2)
        : "",
      purcVoucherNum: partyVoucherNum,
      partyInvNum: voucherNumber,
      voucherDate: moment(voucherDate).format("DD-MM-YYYY"),
      placeOfSupply: selectedJobWorker?.data?.state_name.name,
      orderDetails: selectedLoad === "0" ? userFormValues : selectedLoad === "1" ? lotList : 
      selectedLoad === "2" ? productData : selectedLoad === "3" ? lotListLotwise : [],
      taxableAmount: parseFloat(subTotal).toFixed(3),
      sGstTot: sgstTot,
      cGstTot: cgstTot,
      iGstTot: igstTot,
      roundOff:roundOff ? roundOff : '',
      grossWtTOt: parseFloat(grossTotal).toFixed(3),
      netWtTOt: parseFloat(netTotal).toFixed(3),
      pcsTot: pcsTotal,
      totalInvoiceAmt: parseFloat(totalAmt).toFixed(3),
      TDSTCSVoucherNum:tdsTcsVou,
      ledgerName:ledgerName,
      taxAmount : ledgerAmount,
      metNarration:jewelNarration,
      accNarration:accNarration,
      balancePayable: parseFloat(finalAmount).toFixed(3),
      signature: signature
    });
    if (isView) {
      handlePrint();
    } else {
      if (
        validateLoadType() && 
        validateBomOrNot() &&
        handleDateBlur() &&
        voucherNumValidation() &&
        partyNameValidation() &&
        oppositeAcValidation() &&
        fineRateValidation() && 
        voucherValidate () &&
        validateArticianEntry() 
      ) {
        if(selectedLoad === "0"){
          if(validateRowEntry() && validateEmptyError()){
          addApiNormalEntry(false, true)
        }
        }else if(selectedLoad === "3"){
          if(validateLotRowEntry() && validateEmptyError()){
            addScanLotapi(false, true)
          }
        }else if(selectedLoad === "1" || selectedLoad === "2"){
          addArticianReceiveApi(false, true)
        }
      }
    }
  }

  const addScanLotapi = (resetFlag, toBePrint) => {
    setLoading(true);
    const lotArr = lotListLotwise
    .filter((element) => element.category !== "")
    .map((x) =>{
      return {
        lotNumber: x.lotNumber,
        category_id : x.categoryId,
        category_name: x.category,
        total_gross_wgt: x.grossWeight,
        total_net_wgt:  x.netWeight,
        purity: x.purity,
        pcs : x.pieces,
        wastage_per:  x.wastagePer,
        fine_rate:  x.fineRate,
        hsn_number:  x.HSNNum,
        gold_loss_per:  x.goldlossper,
        gold_loss_fine:  x.goldlossFine
      }
    })

    const body = {
      jobworker_id: selectedJobWorker.value,
      department_id: window.localStorage.getItem("SelectedDepartment"),
      party_voucher_date: partyVoucherDate,
      party_voucher_no: partyVoucherNum,
      opposite_account_id: oppositeAccSelected.value,
      round_off: roundOff === "" ? 0 : roundOff,
      fine_rate: fineRate,
      purchaseCreateDate: voucherDate,
      voucherId: selectedVoucher,
      jewellery_narration: jewelNarration,
      account_narration: accNarration,
      uploadDocIds: docIds,
      lotArray : lotArr
    }
    console.log(body,"bodyyyy")
    axios
      .post(Config.getCommonUrl() + "api/jewellerypurchaseartician/create/lotFromIssue?save=1", body)
      .then(function (response) {
        console.log(response);
        setLoading(false);
        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.goBack();
          if (resetFlag === true) {
             checkAndReset();
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record
             handlePrint();
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: "api/jewellerypurchaseartician/create/lotFromIssue?save=1", body: body, });
      });
  }

  const vocherSelectModal = () => {
    if( validateLoadType() && 
    validateBomOrNot() &&
    handleDateBlur() &&
    voucherNumValidation() &&
    partyNameValidation() &&
    oppositeAcValidation() &&
    fineRateValidation()){
      setvoucherModalOpen(true)
    }
  }


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            {!props.viewPopup && (
              <Grid
                container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0 }}
              >
                <Grid item xs={7} sm={7} md={7} key="1" style={{ padding: 0 }}>
                  <FuseAnimate delay={300}>
                    <Typography className="pl-28 pt-16 text-18 font-700">
                      {isView
                        ? "View Jewellery Purchase (Artician Receive)"
                        : "Add Jewellery Purchase (Artician Receive)"}
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
                  {/* <Button
                    variant="contained"
                    className={classes.button}
                    size="small"
                    onClick={(event) => {
                      History.goBack();
                    }}
                  >
                    Back
                  </Button> */}
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
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p style={{ paddingBottom: "3px" }}>Select load type*</p>
                        <select
                          className={clsx(classes.selectBox, "focusClass")}
                          required
                          value={selectedLoad}
                          onChange={(e) => handleLoadChange(e)}
                          disabled={isView}
                          ref={loadTypeRef}
                        >
                          <option hidden value="">
                            Select load type
                          </option>

                        <option value="0">Load Finding Variant</option>
                        <option value="3">Load Lot directly </option>
                        <option value="1">Load Lot directly (from Excel)</option>
                        <option value="2">Load Barcoded Stock form excel</option>
                        </select>
                        <span style={{ color: "red" }}>
                          {selectedLoadErr.length > 0 ? selectedLoadErr : ""}
                        </span>
                      </Grid>

                      {selectedLoad === "2" && (
                        <Grid
                          item
                          lg={2}
                          md={4}
                          sm={4}
                          xs={12}
                          style={{ padding: 6 }}
                        >
                          <p style={{ paddingBottom: "3px" }}>Select bom</p>
                          <select
                            className={clsx(classes.selectBox, "focusClass")}
                            required
                            value={bomType}
                            onChange={(e) => handleBomTypeChange(e)}
                            disabled={isView}
                          >
                            <option hidden value="">
                              Select bom
                            </option>
                            <option value="0">Without Bom </option>
                            <option value="1">With Bom</option>
                          </select>
                          <span style={{ color: "red" }}>
                            {bomTypeErr.length > 0 ? bomTypeErr : ""}
                          </span>
                        </Grid>
                      )}

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
                            className=""
                            name="voucherDate"
                            value={voucherDate}
                            error={VoucherDtErr.length > 0 ? true : false}
                            helperText={VoucherDtErr}
                            onChange={(e) => handleInputChange(e)}
                            onKeyDown={(e) => e.preventDefault()}
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
                        <p style={{ paddingBottom: "3px" }}>Party name*</p>
                        <Select
                         id="view_jewellary_dv"
                         filterOption={createFilter({ ignoreAccents: false })}
                         classes={classes}
                         styles={selectStyles}
                         options={jobworkerData.map((suggestion) => ({
                           value: suggestion.id,
                           label: suggestion.name,
                           data : suggestion
                         }))}
                         value={selectedJobWorker}
                         onChange={handlePartyChange}
                         placeholder="Party Name"
                         isDisabled={isView}
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
                        <p style={{ paddingBottom: "3px" }}>Firm name</p>
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
                        <p style={{ paddingBottom: "3px" }}>Opposite account*</p>
                        <Select
                          id="view_jewellary_dv"
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          options={oppositeAccData}
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
                        style={{ padding: 6 }}
                      >
                        <p style={{ paddingBottom: "3px" }}>
                          Party voucher number*
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
                        <p style={{ paddingBottom: "3px" }}>
                          Party voucher date*
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
                      )}

                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <p style={{ paddingBottom: "3px" }}>Fine rate*</p>
                        <TextField
                          placeholder="Fine rate"
                          name="fineRate"
                          value={fineRate}
                          error={fineRateErr.length > 0 ? true : false}
                          helperText={fineRateErr}
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
                        <Button
                          variant="contained"
                          color="primary"
                          className="w-224 mx-auto mt-20 voucher-btn "
                          aria-label="Register"
                          onClick={vocherSelectModal}
                          disabled={isView}
                          style={{ width: "100%" }}
                        >
                          Select Voucher
                        </Button>
                        <span style={{ color: "red" }}>
                          {selectVoucherErr.length > 0 ? selectVoucherErr : ""}
                        </span>
                      </Grid>

                      {(selectedLoad === "1" || selectedLoad === "2") && (
                        <>
                          <Grid
                            item
                            lg={2}
                            md={4}
                            sm={4}
                            xs={12}
                            style={{ padding: 6 }}
                          >
                            <Button
                              variant="contained"
                              color="primary"
                              className="w-224 mx-auto uplod-a-file mt-20"
                              aria-label="Register"
                              disabled={!fineRate || isView}
                              onClick={handleClick}
                              style={{ width: "100%" }}
                            >
                              Upload a file
                            </Button>
                            <input
                              type="file"
                              id="fileinput"
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
                            }}
                            className="mt-20"
                          >
                            {!isView && (
                              <a
                                href={
                                  selectedLoad === "1" ? lotFile : barcodedFile
                                }
                                download={
                                  selectedLoad === "1"
                                    ? "load_lot_directly.csv"
                                    : "load_barcode_wise.csv"
                                }
                              >
                                Download Sample{" "}
                              </a>
                            )}
                          </Grid>
                        </>
                      )}

                  {
                      selectedLoad === "3" && 
                      <Grid
                      className="packing-slip-input"
                      item
                      lg={2}
                      md={4}
                      sm={4}
                      xs={12}
                      style={{ padding: 6 }}
                    >
                      <Autocomplete
                        id="free-solo-demo"
                        freeSolo
                        disableClearable
                        onChange={(event, newValue) => {
                          console.log(newValue);
                          handleLotSelect(newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                          if (event !== null) {
                            if (event.type === "change")
                              setLotSearch(newInputValue);
                          } else {
                            setLotSearch("");
                          }
                        }}
                        value={displayLotNumber}
                        options={lotListApiData.map(
                          (option) => option.Lot.number
                        )}
                        disabled={isView || !isVoucherSelected}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            style={{ padding: 0 }}
                            placeholder="Lot No"
                          />
                        )}
                      />
                    </Grid>
                    }

                      {isCsvErr === true && (
                        <Grid item xs={4} style={{ padding: 6, color: "red" }}>
                          Your File Has Error Please Correct it, Download from{" "}
                          <a href={csvData}>Here</a>
                        </Grid>
                      )}

                      {isVoucherSelected && (
                        <div
                          style={{
                            alignItems: "left",
                            marginTop: "15px",
                            marginBottom: "15px",
                          }}
                        >
                          <h3>Selected Vouchers</h3>
                          <div
                            style={{ alignItems: "left", marginTop: "15px" }}
                          >
                            <Table className={classes.table}>
                              <TableHead>
                              <TableRow>
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
                                  Gross Weight
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  align="center"
                                >
                                  Net Weight
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
                                <TableCell
                                  className={classes.tableRowPad}
                                  align="center"
                                >
                                  Lot Number
                                </TableCell>
                              </TableRow>
                              </TableHead>
                              <TableBody>
                                {voucherApiData !== "" &&
                                  voucherApiData
                                    .filter((voucherData) =>
                                      selectedVoucher.includes(voucherData.id)
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
                                        {row.gross_weight}
                                      </TableCell>

                                      <TableCell
                                        align="center"
                                        className={classes.tableRowPad}
                                      >
                                        {row.net_weight}
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
                                      <TableCell
                                        align="center"
                                        className={classes.tableRowPad}
                                      >
                                        {row.lotNumber}
                                      </TableCell>
                                    </TableRow>
                                    ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </Grid>

                    {selectedLoad === "0" && (
                      <div
                        className="mt-2 jewellerey-tb-main addjewellery-purchasearticean-table add-jewellery-artician-main"
                        style={{
                          paddingBottom: 5,
                        }}
                      >
                        <div className="inner-addsalestabel-blg">
                        <div
                          className="add-jewellery-main-tbl-dv jewellery-artician-tbl jewellery-purchase-table  addjewellery-purchase-table"
                          style={{
                            border: "1px solid lightgray",
                            paddingBottom: 5,
                          }}
                        >
                          <div
                            className=" jewellery-th-dv"
                            id="jewellery-head-dv"
                            style={{
                              background: "lightgray",
                              fontWeight: "700",
                            }}
                          >
                            {!isView && (
                              <div
                                className={clsx(
                                  classes.tableheader,
                                  "delete_icons_dv"
                                )}
                                style={{ fontWeight: "700" }}
                              >
                                {/* delete action */}
                              </div>
                            )}
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Stock Code</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Stock Name</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>HSN</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Billing Category</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Purity</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>color</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Pieces</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Gross Weight</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Net Weight</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Jobwork Fine Utilize</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Wastage (%)</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Wastage (Fine)</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Gold Loss (%)</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Gold Loss (Fine)</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Labour Fine Amount</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Tag Amount Before Discount</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Tag Amount After Discount</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Gold Rate</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Category Rate</div>
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>Total Amount</div>
                            {
                              vendorStateId === 12 ? 
                              <>
                              <div className={classes.tableheader} style={{ fontWeight: "700" }}>CGST (%)</div>
                              <div className={classes.tableheader} style={{ fontWeight: "700" }}>SGST (%)</div>
                              <div className={classes.tableheader} style={{ fontWeight: "700" }}>CGST</div>
                              <div className={classes.tableheader} style={{ fontWeight: "700" }}>SGST</div>
                              </>
                              :<>
                              <div className={classes.tableheader} style={{ fontWeight: "700" }}>IGST (%)</div>
                              <div className={classes.tableheader} style={{ fontWeight: "700" }}>IGST</div>
                              </>
                            }
                            <div className={classes.tableheader} style={{ fontWeight: "700" }}>total</div>
                            </div>

                            {userFormValues.map((element, index) => (
                              <div
                                id="jewellery-artician-head"
                                key={index}
                                className=""
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
                              <Select
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  classes={classes}
                                  styles={selectStyles}
                                  options={stockCodeData.map((suggestion) => ({
                                    value: suggestion.stock_name_code.id,
                                    label: suggestion.stock_name_code.stock_code,
                                    pcs_require:
                                      suggestion.stock_name_code.stock_description.pcs_require,
                                    data : suggestion
                                  }))}
                                  value={element?.stockCode}
                                  onChange={(e) => {
                                    handleStockGroupChange(index, e);
                                  }}
                                  placeholder="Stock Code"
                                  isDisabled={isView || !fineRate}
                                />
                          
                                <TextField
                                  name="stockName"
                                  className=""
                                  value={element.stockName || ""}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />

                                <TextField
                                  name="HSNNum"
                                  className=""
                                  value={element.HSNNum || ""}
                                  disabled
                                  variant="outlined"
                                  fullWidth
                                />
                                <TextField
                                  name="billingCategory"
                                  className=""
                                  value={element.billingCategory || ""}
                                  disabled
                                  variant="outlined"
                                  fullWidth
                                />
                                <TextField
                                  name="purity"
                                  className=""
                                  value={element.purity || ""}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                                <TextField
                                  name="color"
                                  className=""
                                  value={element.color || ""}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />
                                <TextField
                                  name="pieces"
                                  className=""
                                  value={element.pieces || ""}
                                  error={element?.errors?.pieces ? true : false}
                                  helperText={element?.errors?.pieces}
                                  onChange={(e) => handleChange(index, e)}
                                  inputRef={(el) =>(pcsInputRef.current[index] = el)}
                                  variant="outlined"
                                  fullWidth
                                  disabled={isView || element?.stockCode === ""}
                                />
                                <TextField
                                  name="grossWeight"
                                  className=""
                                  value={element.grossWeight || ""}
                                  error={element?.errors?.grossWeight ? true : false}
                                  helperText={element?.errors?.grossWeight}
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled={isView || element?.stockCode === ""}
                                />
                                <TextField
                                  name="netWeight"
                                  className=""
                                  value={element.netWeight || ""}
                                  error={element?.errors?.netWeight ? true : false}
                                  helperText={element?.errors?.netWeight}
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled={isView || element?.stockCode === ""}
                                />
                               
                                {element.grossWeight !== "" &&
                                  element.netWeight !== "" &&
                                  parseFloat(element.grossWeight).toFixed(3) !==
                                    parseFloat(element.netWeight).toFixed(3) && (
                                    <IconButton
                                      style={{ padding: "0", width: "auto" }}
                                      onClick={() => {
                                        handleModalOpen(index);
                                      }}
                                    >
                                      <Icon
                                        style={{
                                          color:
                                            element.isWeightDiff === 0
                                              ? "red"
                                              : "gray",
                                        }}
                                      >
                                        error
                                      </Icon>
                                    </IconButton>
                                  )}

                                <TextField
                                  name="jobworkFineUtilize"
                                  className=""
                                  value={element.jobworkFineUtilize || ""}
                                  disabled
                                  variant="outlined"
                                  fullWidth
                                />

                                <TextField
                                  name="wastagePer"
                                  className=""
                                  value={element.wastagePer || ""}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />

                                <TextField
                                  name="wastageFine"
                                  className=""
                                  value={element.wastageFine || ""}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />

                                <TextField
                                  name="goldlossper"
                                  className=""
                                  value={element.goldlossper || ""}
                                  error={element?.errors?.goldlossper ? true : false}
                                  helperText={element?.errors?.goldlossper}
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled={isView || element?.stockCode === ""}
                                />

                                <TextField
                                  name="goldlossFine"
                                  className=""
                                  value={element.goldlossFine || ""}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />

                                <TextField
                                  name="labourFineAmount"
                                  className=""
                                  value={isView? Config.numWithComma(element.labourFineAmount): element.labourFineAmount || ""}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                />

                                <TextField
                                  name="tag_amount_before_discount"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(
                                          element.tag_amount_before_discount
                                        )
                                      : element.tag_amount_before_discount || ""
                                  }
                                  error={element?.errors?.tag_amount_before_discount ? true : false}
                                  helperText={element?.errors?.tag_amount_before_discount}
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled={isView || element?.stockCode === ""}
                                />

                                <TextField
                                  name="tag_amount_after_discount"
                                  className=""
                                  value={
                                    isView
                                      ? Config.numWithComma(
                                          element.tag_amount_after_discount
                                        )
                                      : element.tag_amount_after_discount || ""
                                  }
                                  error={element?.errors?.tag_amount_after_discount ? true : false}
                                  helperText={element?.errors?.tag_amount_after_discount}
                                  onChange={(e) => handleChange(index, e)}
                                  variant="outlined"
                                  fullWidth
                                  disabled={isView || element?.stockCode === ""}
                                />

                                <TextField
                                  name="rate"
                                  className=""
                                  disabled
                                  value={isView ? Config.numWithComma(element.rate): element.rate || ""}
                                  variant="outlined"
                                  fullWidth
                                />

                                <TextField
                                  name="catRatePerGram"
                                  className=""
                                  disabled
                                  value={isView ? Config.numWithComma(element.catRatePerGram): element.catRatePerGram || ""}
                                  variant="outlined"
                                  fullWidth
                                />

                                <TextField
                                  name="totalAmount"
                                  className=""
                                  disabled
                                  value={isView ? Config.numWithComma(element.totalAmount): element.totalAmount || ""}
                                  variant="outlined"
                                  fullWidth
                                />

                                {vendorStateId === 12 ? (
                                   <>
                                   <TextField
                                     name="cgstPer"
                                     className=""
                                     value={element.cgstPer || ""}
                                     variant="outlined"
                                     fullWidth
                                     disabled
                                   />
                                   <TextField
                                     name="sGstPer"
                                     className=""
                                     value={element.sGstPer || ""}
                                     variant="outlined"
                                     fullWidth
                                     disabled
                                   />
                                   <TextField
                                     name="cgstVal"
                                     className=""
                                     value={isView ? Config.numWithComma(element.cgstVal) : element.cgstVal || ""}
                                     variant="outlined"
                                     fullWidth
                                     disabled
                                   />
                                   <TextField
                                     name="sGstVal"
                                     className=""
                                     value={isView ? Config.numWithComma(element.sGstVal) : element.sGstVal || "" }
                                     variant="outlined"
                                     fullWidth
                                     disabled
                                   />
                                 </>
                                ) : (
                                  <>
                                  <TextField
                                    name="IGSTper"
                                    className=""
                                    value={element.IGSTper || ""}
                                    variant="outlined"
                                    fullWidth
                                    disabled
                                  />

                                  <TextField
                                    name="IGSTVal"
                                    className=""
                                    variant="outlined"
                                    fullWidth
                                    disabled
                                  />
                                </>
                                )}
                                <TextField
                                  name="total"
                                  className=""
                                  value={ isView ? Config.numWithComma(element.total) : element.total || "" }
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
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}>{parseFloat(pcsTotal)}</div>
                            <div id="castum-width-table" className={classes.tableheader}>{parseFloat(grossTotal).toFixed(3)}</div>
                            <div id="castum-width-table" className={classes.tableheader}>{parseFloat(netTotal).toFixed(3)}</div>
                            <div id="castum-width-table" className={classes.tableheader}>{parseFloat(utilizeTotal).toFixed(3)}</div>
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}></div>
                            <div id="castum-width-table" className={classes.tableheader}> {isView ? Config.numWithComma(subTotal) : parseFloat(subTotal).toFixed(3)}</div>
                            {
                              vendorStateId === 12 ? <>
                                <div id="castum-width-table" className={classes.tableheader}></div>
                                <div id="castum-width-table" className={classes.tableheader}></div>
                                <div id="castum-width-table" className={classes.tableheader}></div>
                                <div id="castum-width-table" className={classes.tableheader}></div>
                              </> : <>
                                <div id="castum-width-table" className={classes.tableheader}></div>
                                <div id="castum-width-table" className={classes.tableheader}></div>
                              </>
                            }
                            <div id="castum-width-table" className={classes.tableheader}>{parseFloat(totalAmt).toFixed(3)}</div>
                          </div>
                        </div>
                    </div>
                      </div>
                    )}

                    {selectedLoad === "1" && (
                      <Grid className="salesjobwork-table-main artician_cate_jewellry_tbl add-jewellary-tab-tbl artician_cate_jewellry_blg addsales-jobreturn-domestic-dv">
                        <div className="mt-16">
                          <AppBar
                            position="static"
                            className="add-header-purchase"
                          >
                            <Tabs
                              value={lotModalView}
                              onChange={handleLotTabChange}
                            >
                              <Tab label="Lot Details" />
                              <Tab label="Bom Details" />
                            </Tabs>
                          </AppBar>
                          {lotModalView === 0 && (
                            <LotDetails
                              lotList={lotList}
                              stateId={vendorStateId}
                              isView={isView}
                            />
                          )}
                          {lotModalView === 1 && (
                            <BomDetails
                              bomList={bomList}
                              stateId={vendorStateId}
                              isView={isView}
                            />
                          )}
                        </div>
                      </Grid>
                    )}

                    {selectedLoad === "2" && (
                      <Grid className="salesjobwork-table-main artician_cate_jewellry_tbl add-jewellary-tab-tbl artician_cate_jewellry_blg addsales-jobreturn-domestic-dv ">
                        <div className="mt-16">
                          <AppBar
                            position="static"
                            className="add-header-purchase"
                          >
                            <Tabs value={modalView} onChange={handleChangeTab}>
                              <Tab label="Category Wise List" />
                              <Tab label="Tag Wise List" />
                            </Tabs>
                          </AppBar>
                          {modalView === 0 && (
                            <CategoryWiseList
                              productData={productData}
                              stateId={vendorStateId}
                              isView={isView}
                              // selectedLoad={selectedLoad}
                            />
                          )}
                          {modalView === 1 && (
                            <TagWiseList
                              tagWiseData={tagWiseData}
                              stateId={vendorStateId}
                              isView={isView}
                              // selectedLoad={selectedLoad}
                            />
                          )}
                        </div>
                      </Grid>
                    )}

             {selectedLoad === "3" && (
                      <Grid className="salesjobwork-table-main artician_cate_jewellry_tbl add-jewellary-tab-tbl artician_cate_jewellry_blg addsales-jobreturn-domestic-dv">
                      <div className="mt-16">
                        <AppBar position="static">
                          <Tabs
                            value={lotModalView}
                            onChange={handleLotTabChange}
                          >
                            <Tab label="Lot Details" />
                            <Tab label="Bom Details" />
                          </Tabs>
                        </AppBar>
                        {lotModalView === 0 && (
                           <Paper className={clsx(classes.tabroot, "m-16 table-responsive")}>
                           <MaUTable className={classes.table}>
                             <TableHead>
                               <TableRow>
                                {!isView && <TableCell className={clsx(classes.tableRowPad,"delete_icons_dv")}></TableCell>}
                                 <TableCell className={classes.tableRowPad}>Category</TableCell>
                                 <TableCell className={classes.tableRowPad}>
                                   Billing Category
                                 </TableCell>
                                 <TableCell className={classes.tableRowPad}>HSN</TableCell>
                                 <TableCell className={classes.tableRowPad}>Lot No</TableCell>
                                 <TableCell className={classes.tableRowPad}>Pieces</TableCell>
                                 <TableCell className={classes.tableRowPad}>Gross Weight</TableCell>
                                 <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
                                 <TableCell className={classes.tableRowPad}>Purity</TableCell>
                                 <TableCell className={classes.tableRowPad}>
                                   Jobwork Fine Utilize
                                 </TableCell>
                                 <TableCell className={classes.tableRowPad}>Wastage (%)</TableCell>
                                 <TableCell className={classes.tableRowPad}>
                                   Wastage (Fine)
                                 </TableCell>
                                 <TableCell className={classes.tableRowPad}>Gold loss (%)</TableCell>
                                 <TableCell className={classes.tableRowPad}>
                                   Gold Loss (Fine)
                                 </TableCell>
                                 <TableCell className={classes.tableRowPad}>Fine Rate</TableCell>
                                 <TableCell className={classes.tableRowPad}>
                                   Labour Fine Amount
                                 </TableCell>
                                 <TableCell className={classes.tableRowPad}>
                                   Category Rate per gram
                                 </TableCell>
                                 <TableCell className={classes.tableRowPad}>Total Amount</TableCell>
                                 {vendorStateId === 12 && (
                                   <>
                                     <TableCell className={classes.tableRowPad}>CGST (%)</TableCell>
                                     <TableCell className={classes.tableRowPad}>SGST (%)</TableCell>
                                     <TableCell className={classes.tableRowPad}>CGST</TableCell>
                                     <TableCell className={classes.tableRowPad}>SGST</TableCell>
                                   </>
                                 )}
                                 {vendorStateId !== 12 && (
                                   <>
                                     <TableCell className={classes.tableRowPad}>IGST (%)</TableCell>
                                     <TableCell className={classes.tableRowPad}>IGST</TableCell>
                                   </>
                                 )}
                                 <TableCell className={classes.tableRowPad}>Total</TableCell>
                               </TableRow>
                             </TableHead>
                             <TableBody>
                               {lotListLotwise.map((element, index) => (
                                 <TableRow key={index}>
                                  {
                                    !isView &&  <TableCell className={clsx(classes.tableRowPad,"delete_icons_dv")}>
                                    <IconButton
                                        style={{ padding: "0" }}
                                        tabIndex="-1"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          ev.stopPropagation();
                                          deleteHandlerLot(index,element.lotNumber);
                                        }}
                                      >
                                        <Icon className="" style={{ color: "red" }}>
                                          delete
                                        </Icon>
                                      </IconButton>
                                     </TableCell>
                                  }
                                   <TableCell className={classes.tableRowPad}>
                                     {element.category}
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                     {element.billingCategory}
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                     {element.HSNNum}
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                     {element.lotNumber}
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                     {element.pieces}
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                    {
                                      isView ? parseFloat(element.grossWeight).toFixed(3) :  <TextField
                                      name="grossWeight"
                                      className=""
                                      value={element.grossWeight || ""}
                                      error={element?.errors?.grossWeight ? true : false}
                                      helperText={element?.errors?.grossWeight}
                                      onChange={(e) => handleChangeLot(index, e)}
                                      variant="outlined"
                                      fullWidth
                                      disabled={isView || element?.stockCode === ""}
                                    />
                                    }
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                     {parseFloat(element.netWeight).toFixed(3)}
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                     {element.purity}
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                     {element.jobworkFineUtilize}
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                     {element.wastagePer}
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                     {element.wastageFine}
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                    {
                                      isView ? element?.goldlossper :  <TextField
                                      name="goldlossper"
                                      className=""
                                      value={element.goldlossper || ""}
                                      error={element?.errors?.goldlossper ? true : false}
                                      helperText={element?.errors?.goldlossper}
                                      onChange={(e) => handleChangeLot(index, e)}
                                      variant="outlined"
                                      fullWidth
                                      disabled={isView || element?.stockCode === ""}
                                    />
                                    }
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                     {element.goldlossFine}
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                     {isView
                                       ? Config.numWithComma(element.fineRate)
                                       : parseFloat(element.fineRate).toFixed(3)}
                                   </TableCell>
                     
                                   <TableCell className={classes.tableRowPad}>
                                     {isView
                                       ? Config.numWithComma(element.labourFineAmount)
                                       : parseFloat(element.labourFineAmount).toFixed(3)}
                                   </TableCell>
                                   <TableCell className={classes.tableRowPad}>
                                     {isView
                                       ? Config.numWithComma(element.catRatePerGram)
                                       : parseFloat(element.catRatePerGram).toFixed(3)}
                                   </TableCell>
                     
                                   <TableCell className={classes.tableRowPad}>
                                     {isView
                                       ? Config.numWithComma(element.totalAmount)
                                       : parseFloat(element.totalAmount).toFixed(3)}
                                   </TableCell>
                     
                                   {vendorStateId === 12 && (
                                     <>
                                       <TableCell className={classes.tableRowPad}>
                                         {element.cgstPer}
                                       </TableCell>
                                       <TableCell className={classes.tableRowPad}>
                                         {element.sGstPer}
                                       </TableCell>
                                       <TableCell className={classes.tableRowPad}>
                                         {isView
                                           ? Config.numWithComma(element.cgstVal)
                                           : parseFloat(element.cgstVal).toFixed(3)}
                                       </TableCell>
                                       <TableCell className={classes.tableRowPad}>
                                         {isView
                                           ? Config.numWithComma(element.sGstVal)
                                           : parseFloat(element.sGstVal).toFixed(3)}
                                       </TableCell>
                                     </>
                                   )}
                     
                                   {vendorStateId !== 12 && (
                                     <>
                                       <TableCell className={classes.tableRowPad}>
                                         {element.IGSTper}
                                       </TableCell>
                     
                                       <TableCell className={classes.tableRowPad}>
                                         {isView
                                           ? Config.numWithComma(element.IGSTVal)
                                           : parseFloat(element.IGSTVal).toFixed(3)}
                                       </TableCell>
                                     </>
                                   )}
                                   <TableCell className={classes.tableRowPad}>
                                     {isView
                                       ? Config.numWithComma(element.total)
                                       : parseFloat(element.total).toFixed(3)}
                                   </TableCell>
                                 </TableRow>
                               ))}
                               <TableRow style={{backgroundColor:"#D3D3D3"}} >
                                { !isView &&  <TableCell className={clsx(classes.tableRowPad,"delete_icons_dv")}></TableCell>}
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>{parseFloat(pcsTotal)}</TableCell>
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>{parseFloat(grossTotal).toFixed(3)}</TableCell>
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>{parseFloat(netTotal).toFixed(3)}</TableCell>
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>{parseFloat(utilizeTotal).toFixed(3)}</TableCell>
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                                 {isView ? Config.numWithComma(subTotal) : parseFloat(subTotal).toFixed(3)}
                                 </TableCell>
                                 {vendorStateId === 12 ? (
                                   <>
                                     <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                     <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                     <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                     <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                   </>
                                 ) : (
                                  <>
                                  <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}></TableCell>
                                  <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>
                                  
                                  </TableCell>
                                </>
                                 )}
                                 <TableCell className={classes.tableRowPad} style={{fontWeight:"700"}}>{parseFloat(totalAmt).toFixed(3)}</TableCell>
                               </TableRow>
                             </TableBody>
                           </MaUTable>
                         </Paper>
                        )}
                        {lotModalView === 1 && (
                          <BomDetails
                            bomList={bomListLotwise}
                            stateId={vendorStateId}
                            isView={isView}
                          />
                        )}
                      </div>
                    </Grid>
                  )}

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
                        {isView ? Config.numWithComma(subTotal) : subTotal}
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
                        {isView ? Config.numWithComma(totalGST) : totalGST}
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
                        Round Off
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
                          // className="ml-2 addconsumble-dv"
                          // style={{width:'10%'}}
                          value={roundOff}
                          error={roundOffErr.length > 0 ? true : false}
                          helperText={roundOffErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          fullWidth
                          disabled={isView || subTotal === ""}
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
                        {isView
                          ? Config.numWithComma(totalInvoiceAmount)
                          : totalInvoiceAmount}
                      </label>
                    </div>
                  </div>
                  {!props.viewPopup && (
                    <div className="mt-16" style={{ paddingBottom: 5 }}>
                      <div
                        className="metal-tbl-head"
                        style={{
                          background: "#EBEEFB",
                          fontWeight: "700",
                          borderRadius: "7px",
                        }}
                      >
                        <div className={classes.tableheader}>
                          TDS/TCS Vou. Num
                        </div>

                        <div className={classes.tableheader}>Ledger Name</div>

                        <div className={classes.tableheader}>(%)</div>

                        <div className={classes.tableheader}>Amount</div>
                      </div>

                      <div className="mt-5 table-row-source">
                        <TextField
                          // label="TDS/TCS Vou. Num"
                          name="tdsTcsVou"
                          className="ml-2"
                          value={tdsTcsVou}
                          error={tdsTcsVouErr.length > 0 ? true : false}
                          helperText={tdsTcsVouErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          fullWidth
                          disabled
                        />
                        <TextField
                          // label="Ledger Name"
                          name="ledgerName"
                          className="ml-2"
                          value={ledgerName}
                          error={ledgerNmErr.length > 0 ? true : false}
                          helperText={ledgerNmErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          fullWidth
                          disabled
                        />
                        <TextField
                          // label="(%)"
                          name="rateValue"
                          className="ml-2"
                          value={rateValue}
                          error={rateValErr.length > 0 ? true : false}
                          helperText={rateValErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          fullWidth
                          disabled
                        />
                        <TextField
                          // label="Amount"
                          name="ledgerAmount"
                          className="ml-2"
                          value={
                            isView
                              ? Config.numWithComma(ledgerAmount)
                              : ledgerAmount
                          }
                          error={ledgerAmtErr.length > 0 ? true : false}
                          helperText={ledgerAmtErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          fullWidth
                          disabled={is_tds_tcs !== "1" || isView}
                        />
                      </div>
                    </div>
                  )}

                  <div
                    className="mt-16"
                    id="jewellery-head"
                    style={{
                      borderRadius: "7px",
                      background: "#EBEEFB",
                      fontWeight: "700",
                      justifyContent: "end",
                      display: "flex",
                    }}
                  >
                    <div
                      style={{
                        width: "20%",
                      }}
                      // className={classes.tableheader}
                    >
                      <label>Final Receivable Amount :</label>
                      <label>
                        {" "}
                        {isView
                          ? Config.numWithComma(finalAmount)
                          : finalAmount}{" "}
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
                    <div>
                      {!isView && (
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ float: "right" }}
                          className="w-224 mx-auto mt-16 btn-print-save"
                          aria-label="Register"
                          disabled={isView}
                          onClick={(e) => {
                            handleFormSubmit(e);
                          }}
                        >
                          Save
                        </Button>
                      )}

                      <Button
                        variant="contained"
                        style={{ float: "right" }}
                        className="w-224 mx-auto mt-16 mr-16 btn-print-save"
                        aria-label="Register"
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
                        <JewelArticianPrintComp
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
            </div>
            <ViewDocModal
              documentList={documentList}
              handleClose={handleDocModalClose}
              open={docModal}
              updateDocument={updateDocumentArray}
              purchase_flag_id={idToBeView?.id}
              purchase_flag="3"
              concateDocument={concateDocument}
              viewPopup={props.viewPopup}
            />

            <Modal
              // disableBackdropClick
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={modalOpen}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  setModalOpen(false);
                }
              }}
            >
              <div
                style={modalStyle}
                className={clsx(classes.paper, "rounded-8")}
              >
                <h5 className="popup-head p-5">
                  {isView ? "View Weight" : "Add Weight"}
                  <IconButton
                    style={{ position: "absolute", top: "-2px", right: "0" }}
                    onClick={()=>setModalOpen(false)}
                  >
                    <Icon style={{ color: "white" }}>close</Icon>
                  </IconButton>
                </h5>

                {DiffrentStock.map((row, index) => (
                  // <div
                  //   key={index}
                  //   className={clsx(classes.diffPopup, "p-5 pl-16 pr-16")}
                  // >
                  <Grid container className="p-5">
                    <Grid item xs={3} className="p-2">
                      <label>Stock code</label>
                      <Select
                        className="mt-1"
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={diffStockCode.map((suggestion) => ({
                          value: suggestion.stock_name_code.id,
                          label: suggestion.stock_name_code.stock_code,
                        }))}
                        value={
                          row.setStockCodeId.value === ""
                            ? ""
                            : row.setStockCodeId
                        }
                        onChange={(e) => {
                          handleWeightStockChange(index, e);
                        }}
                        placeholder="Stock code"
                      />
                    </Grid>

                    <span style={{ color: "red" }}>
                      {row.errors !== undefined
                        ? row.errors.setStockCodeId
                        : ""}
                    </span>

                    <Grid item xs={4} className="p-2">
                      <label>Pieces</label>
                      <TextField
                        className="mt-1"
                        placeholder="Pieces"
                        name="setPcs"
                        // className="mx-16"
                        value={row.setPcs || ""}
                        error={
                          row.errors !== undefined
                            ? row.errors.setPcs
                              ? true
                              : false
                            : false
                        }
                        helperText={
                          row.errors !== undefined ? row.errors.setPcs : ""
                        }
                        onChange={(e) => handleStockInputChange(index, e)}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={4} className="p-2">
                      <label>Weight</label>
                      <TextField
                        placeholder="Weight"
                        name="setWeight"
                        // className="mt-16"
                        value={row.setWeight || ""}
                        error={
                          row.errors !== undefined
                            ? row.errors.setWeight
                              ? true
                              : false
                            : false
                        }
                        helperText={
                          row.errors !== undefined ? row.errors.setWeight : ""
                        }
                        // error={weightErr.length > 0 ? true : false}
                        // helperText={weightErr}
                        onChange={(e) => handleStockInputChange(index, e)}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>

                    {!isView && (
                      <Grid item xs={1} className="p-2">
                        <IconButton
                          style={{ padding: "0", paddingTop: "27px" }}
                          className="ml-8"
                          onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            deleteDiffrentStock(index);
                          }}
                        >
                          <Icon className="delete-icone">
                            <img src={Icones.delete_red} alt="" />
                          </Icon>
                        </IconButton>
                      </Grid>
                    )}
                    {/* </div> */}
                  </Grid>
                ))}

                {!isView && (
                  <IconButton className="p-16" onClick={AddNewRow}>
                    <Icon
                      style={{
                        color: "dodgerblue",
                      }}
                    >
                      add_circle_outline
                    </Icon>
                  </IconButton>
                )}
                {!isView && (
                  <div className="flex flex-row justify-around p-5 pb-20">
                    <Button
                      variant="contained"
                      className="cancle-button-css"
                      onClick={()=>setModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      className="save-button-css"
                      onClick={(e) => checkforUpdate(e)}
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </Modal>

            <Modal
              // disableBackdropClick rfModalOpen, setRfModalOpen
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={voucherModalOpen}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleModalCloseCross()
                }
              }}
            >
              <div
                style={modalStyle}
                className={clsx(classes.rateFixPaper, "rounded-8")}
              >
                <h5
                  className="popup-head p-5"
                >
                  Vouchers
                  <IconButton
                    style={{ position: "absolute", top: "-2px", right: "0" }}
                    onClick={handleModalCloseCross}
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
                        <TableCell className={classes.tableRowPad} align="center" ></TableCell>
                        <TableCell className={classes.tableRowPad} align="center" >Voucher num</TableCell>
                        <TableCell className={classes.tableRowPad} align="center" >Gross Weight</TableCell>
                        <TableCell className={classes.tableRowPad} align="center" >Net Weight</TableCell>
                        <TableCell className={classes.tableRowPad} align="center" >Fine Gold</TableCell>
                        <TableCell className={classes.tableRowPad} align="center" >Utilize</TableCell>
                        <TableCell className={classes.tableRowPad} align="center" >Balance</TableCell>
                        <TableCell className={classes.tableRowPad} align="center" >Type</TableCell>
                        <TableCell className={classes.tableRowPad} align="center" >Action</TableCell>
                        <TableCell className={classes.tableRowPad} align="center" >Lot Number</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}>
                            <TextField name="voucher_no" onChange={handleSearchData} value={searchData.voucher_no}/>
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                            <TextField name="gross_weight" onChange={handleSearchData} value={searchData.gross_weight}/>
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                            <TextField name="net_weight" onChange={handleSearchData} value={searchData.net_weight}/>
                        </TableCell>  
                        <TableCell className={classes.tableRowPad}>
                            <TextField name="finegold" onChange={handleSearchData} value={searchData.finegold}/>
                        </TableCell>  
                        <TableCell className={classes.tableRowPad}>
                            <TextField name="utilize" onChange={handleSearchData} value={searchData.utilize}/>
                        </TableCell>      
                        <TableCell className={classes.tableRowPad}>
                            <TextField name="balance" onChange={handleSearchData} value={searchData.balance}/>
                        </TableCell>  
                        <TableCell className={classes.tableRowPad}>
                            <TextField name="type" onChange={handleSearchData} value={searchData.type}/>
                        </TableCell>  
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                      </TableRow>

                    </TableHead>
                    <TableBody>
                      {voucherApiData !== "" &&
                        voucherApiData.filter((temp) => {
                          if(searchData.voucher_no){
                           return temp.voucher_no
                            .toLowerCase()
                            .includes(searchData.voucher_no.toLowerCase())
                          }else if(searchData.gross_weight){
                            return temp.gross_weight
                            .toLowerCase()
                            .includes(searchData.gross_weight.toLowerCase())
                          }else if(searchData.net_weight){
                            return temp.net_weight
                            .toLowerCase()
                            .includes(searchData.net_weight.toLowerCase())
                          }else if(searchData.finegold){
                            return temp.finegold
                            .toLowerCase()
                            .includes(searchData.finegold.toLowerCase())
                          }else if(searchData.utilize){
                            return temp.utilize
                            .toLowerCase()
                            .includes(searchData.utilize.toLowerCase())
                          }else if(searchData.balance){
                            return temp.balance
                            .toLowerCase()
                            .includes(searchData.balance.toLowerCase())
                          }else if(searchData.type){
                            return temp.type
                            .toLowerCase()
                            .includes(searchData.type.toLowerCase())
                          }else{
                            return temp
                          }
                        }).map((row, index) => (
                          <TableRow key={index}>
                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                            >
                              <Checkbox
                                name="selectVoucher"
                                value={JSON.stringify({
                                  id: row.id,
                                  voucherNum: row.voucher_no,
                                  is_metal_or_lot : row.is_metal_or_lot
                                })}
                                onChange={handleVoucherSelect}
                                checked={selectedVoucher.includes(row.id) ? true : false}
                              />
                            </TableCell>
                            <TableCell align="center" className={classes.tableRowPad}>{row.voucher_no}</TableCell>
                            <TableCell align="center" className={classes.tableRowPad}>{row.gross_weight}</TableCell>
                            <TableCell align="center" className={classes.tableRowPad}>{row.net_weight}</TableCell>
                            <TableCell align="center" className={classes.tableRowPad}>{row.finegold}</TableCell>
                            <TableCell align="center" className={classes.tableRowPad}>{row.utilize}</TableCell>
                            <TableCell align="center" className={classes.tableRowPad}>{row.balance}</TableCell>
                            <TableCell align="center" className={classes.tableRowPad}>{row.type}</TableCell>
                            <TableCell align="center" className={classes.tableRowPad}>{row.is_metal_or_lot === 1 ? <IconButton
                              style={{ padding: "0" }}
                              onClick={(ev) => {
                                ev.preventDefault();
                                ev.stopPropagation();
                                handleListLotModal(row.id)
                              }}
                            >
                              <Icon
                                className="mr-8"
                                style={{ color: "dodgerblue" }}
                              >
                                visibility
                              </Icon>
                            </IconButton> : "-"}</TableCell>
                            <TableCell align="center" className={classes.tableRowPad}>
                              {row.lotNumber}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex flex-row justify-around p-5">
                  <Button
                    variant="contained"
                    className="cancle-button-css"
                    onClick={() =>  setvoucherModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    className="save-button-css"
                    onClick={(e) => handleModalCloseVoucher()}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </Modal>

            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={lotListModalView}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  setLotListModalView(false)
                  setModallotList([])
                }
              }}
            >
              <div style={modalStyle} className={classes.rateFixPaper}>
                <h5
                  className="p-5"
                  style={{
                    textAlign: "center",
                    backgroundColor: "black",
                    color: "white",
                  }}
                >
                  Lots
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={()=>{setLotListModalView(false);setModallotList([])}}
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
                        <TableCell className={classes.tableRowPad} align="center" >Lot Number</TableCell>
                        <TableCell className={classes.tableRowPad} align="center" >Gross Weight</TableCell>
                        <TableCell className={classes.tableRowPad} align="center" >Net Weight</TableCell>
                        <TableCell className={classes.tableRowPad} align="center" >Fine Gold Rate</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {modallotList.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell align="center" className={classes.tableRowPad}>{row?.Lot?.number}</TableCell>
                            <TableCell align="center" className={classes.tableRowPad}>{row.gross_weight}</TableCell>
                            <TableCell align="center" className={classes.tableRowPad}>{row.net_weight}</TableCell>
                            <TableCell align="center" className={classes.tableRowPad}>{row.rate_of_fine_gold}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Modal>

          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

const LotNumbers = ({ id }) => {
  const [lotNumbers, setLotNumbers] = useState([]);

  useEffect(() => {
    const fetchLotNumbers = async () => {
      try {
        const response = await axios.get(Config.getCommonUrl() + `api/jobWorkArticianIssue/lot/voucher/${id}`);
        if (response.data.success === true) {
          const dataArr = response.data?.data?.JobWorkArticianIssueOrder;
          const arrData = dataArr.map((item) => item?.Lot?.number);
          setLotNumbers(arrData);
        }
      } catch (error) {
        handleError(error, null, { api: `api/jobWorkArticianIssue/lot/voucher/${id}` });
      }
    };

    fetchLotNumbers();

    return () => {
      // Cleanup if necessary
    };
  }, [id]);

  return (
    <>
      {lotNumbers.map((number, index) => (
        <div key={index}>{number}</div>
      ))}
    </>
  );
};

export default AddJewelPurchaseArtician;

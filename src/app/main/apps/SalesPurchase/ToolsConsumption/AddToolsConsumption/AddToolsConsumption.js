import React, { useState, useEffect, useRef } from "react";
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
import moment from "moment";
import Select, { createFilter } from "react-select";
import Loader from "app/main/Loader/Loader";
import History from "@history";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
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

const AddToolsConsumption = React.memo((props) => {
  const dispatch = useDispatch();
  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");
  const [partyVoucherDateErr, setpartyVoucherDateErr] = useState("");

  const inputRef = useRef([]);

  const [voucherDate, setVoucherDate] =  useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [backEntryDays, setBackEnteyDays] = useState(0);

  const [loading, setLoading] = useState(false);

  const [departmentData, setDepartmentData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDeptErr, setSelectedDeptErr] = useState("");

  const [stockCodeData, setStockCodeData] = useState([]);

  //below table total val field
  const [unitData, setUnitData] = useState([]);

  const [total, setTotal] = useState(""); //total column total

  const [workerName, setWorkerName] = useState("");
  const [workerNmErr, setWorkerNmErr] = useState("");

  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState("");

  const [accNarration, setAccNarration] = useState("");
  const [accNarrationErr, setAccNarrationErr] = useState("");

  const [metalNarration, setMetalNarration] = useState("");
  const [metalNarrationErr, setMetalNarrationErr] = useState("");
  const [narrationFlag, setNarrationFlag] = useState(false);
  const [avgRatee, setavgRatee] = useState("");

  const theme = useTheme();

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  if (props.location) {
    var idToBeView = props.location.state;
  } else if (props.voucherId) {
    var idToBeView = { id: props.voucherId };
  }
  const [isView, setIsView] = useState(false); //for view Only

  const [documentList, setDocumentList] = useState([]);
  const [docModal, setDocModal] = useState(false);
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);

  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 28)
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
                variant: "error"
              })
            );
          }
        })
        .catch((error) => {
          handleError(error, dispatch, {
            api: "api/salespurchasedocs/upload",
            body: docFile,
          });
        });
    }
  }, [docFile]);

  useEffect(() => {
    if (selectedDepartment) {
      getStockCodeAll();
    }
  }, [selectedDepartment]);

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  useEffect(() => {
    if (props.reportView) {
      NavbarSetting("Factory Report", dispatch);
    } else {
      NavbarSetting("Sales", dispatch);
    }
    //eslint-disable-next-line
  }, []);

  const [formValues, setFormValues] = useState([
    {
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      unitOfPurchase: "",
      quantity: "",
      avgRate: "",
      Amount: "",
      Total: "",
      availableStock: "",
      errors: {
        stockCode: null,
        categoryName: null,
        selectedHsn: null,
        unitOfPurchase: null,
        quantity: null,
        avgRate: null,
        Amount: null,
        Total: null,
      },
    },
    {
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      unitOfPurchase: "",
      quantity: "",
      avgRate: "",
      Amount: "",
      Total: "",
      availableStock: "",
      errors: {
        stockCode: null,
        categoryName: null,
        selectedHsn: null,
        unitOfPurchase: null,
        quantity: null,
        avgRate: null,
        Amount: null,
        Total: null,
      },
    },
    {
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      unitOfPurchase: "",
      quantity: "",
      avgRate: "",
      Amount: "",
      Total: "",
      availableStock: "",
      errors: {
        stockCode: null,
        categoryName: null,
        selectedHsn: null,
        unitOfPurchase: null,
        quantity: null,
        avgRate: null,
        Amount: null,
        Total: null,
      },
    },
    {
      stockCode: "",
      categoryName: "",
      selectedHsn: "",
      unitOfPurchase: "",
      quantity: "",
      avgRate: "",
      Amount: "",
      Total: "",
      availableStock: "",
      errors: {
        stockCode: null,
        categoryName: null,
        selectedHsn: null,
        unitOfPurchase: null,
        quantity: null,
        avgRate: null,
        Amount: null,
        Total: null,
      },
    },
  ]);

  let handleStockGroupChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i].stockCode = {
      value: e.value,
      label: e.label,
    };
    newFormValues[i].errors.stockCode = null;

    let findIndex = stockCodeData.findIndex(
      (item) => item.stock_name_code.id === e.value
    );

    if (findIndex > -1) {
      newFormValues[i].Amount = "";
      newFormValues[i].Total = "";
      newFormValues[i].quantity = "";
      newFormValues[i].unitOfPurchase = stockCodeData[findIndex].stock_name_code.unitName?.id;;
      setTotal("");
      setTotalInvoiceAmount("");

      newFormValues[i].categoryName = stockCodeData[findIndex].billing_name;
      newFormValues[i].errors.categoryName = null;
      newFormValues[i].availableStock =
        "Wt: " + parseFloat(stockCodeData[findIndex].weight).toFixed(3);
      newFormValues[i].selectedHsn =
        stockCodeData[findIndex].hsn_master.hsn_number;
        
      getAvgRate(e.value,function (err, val){
        newFormValues[i].avgRate = val
        console.log(val)
        if (i === formValues.length - 1) {
          setFormValues([
            ...newFormValues,
            {
              stockCode: "",
              categoryName: "",
              selectedHsn: "",
              unitOfPurchase: "",
              quantity: "",
              avgRate: "",
              Amount: "",
              Total: "",
              availableStock: "",
              errors: {
                stockCode: null,
                categoryName: null,
                selectedHsn: null,
                unitOfPurchase: null,
                quantity: null,
                avgRate: null,
                Amount: null,
                Total: null,
              },
            },
          ]);
        } else {
          setFormValues(newFormValues);
        }
      })
    }
    inputRef.current[i].focus();
  };

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
    getUnitData();

    if (idToBeView !== undefined) {
      setIsView(true);
      setNarrationFlag(true);
      getConsumePurchaseRecordForView(idToBeView.id);
    } else {
      setNarrationFlag(false);
      getStockCodeAll();
      getVoucherNumber(); //if view only then no need to get new voucher number, we will set data coming from api
    }
    getDepartmentData();
  }, []);

  function getDepartmentData() {
    axios
      .get(Config.getCommonUrl() + "api/admin/getdepartmentlist")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data, "getDepartmentData");

          let data = response.data.data.filter((s) => s.is_location !== 1);
          setDepartmentData(data);
        } else {
          setDepartmentData([]);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error"
            })
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/admin/getdepartmentlist" });
      });
  }

  function getConsumePurchaseRecordForView(id) {
    setLoading(true);
    let api = ""
    if(props.forDeletedVoucher){
      api = `api/ToolsConsumption/${id}?deleted_at=1`
    }else{
      api = `api/ToolsConsumption/${id}`
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              let finalData = response.data.data;
              setDocumentList(finalData.salesPurchaseDocs);
              setVoucherNumber(finalData.voucher_no);
              setPartyVoucherDate(finalData.party_voucher_date)
              setAllowedBackDate(true);
              setVoucherDate(finalData.purchase_voucher_create_date);
              setTotalInvoiceAmount(
                parseFloat(finalData.total_invoice_amount).toFixed(3)
              );
              setAccNarration(
                finalData.account_narration !== null
                  ? finalData.account_narration
                  : ""
              );
              setMetalNarration(
                finalData.tools_narration !== null
                  ? finalData.tools_narration
                  : ""
              );
              setWorkerName(
                finalData.worker_name
              );    
              
              setSelectedDepartment(({
                value:finalData.Department.id,
                label:finalData.Department.name
              }))  
       
              let tempArray = [];

              for (let item of finalData.ToolsConsumptionOrder) {
                tempArray.push({
                  stockCode: {
                    value: item.StockNameCode.id,
                    label: item.StockNameCode.stock_code,
                  },
                  categoryName: item?.StockNameCode?.stock_name_code
                    ? item?.StockNameCode?.stock_name_code?.stock_name 
                    : "",
                  selectedHsn: item.StockNameCode?.stock_name_code?.hsn_master
                    ? item.StockNameCode?.stock_name_code.hsn_master?.hsn_number
                    : "",
                  unitOfPurchase: item.unit_of_purchase,
                  lastRate:
                    item.last_rate === null
                      ? ""
                      : parseFloat(item.last_rate).toFixed(3),
                  quantity: item.quantity,
                  availableStock: parseFloat(item.weight).toFixed(3),
                  avgRate: parseFloat(item.avg_rate).toFixed(3),

                  Amount: parseFloat(item.total).toFixed(3),

                  errors: {
                    stockCode: null,
                    categoryName: null,
                    selectedHsn: null,
                    unitOfPurchase: null,
                    lastRate: null,
                    quantity: null,
                    weight: null,
                    avgRate: null,
                    Amount: null,
                    CGSTPer: null,
                    SGSTPer: null,
                    IGSTPer: null,
                    CGSTval: null,
                    SGSTval: null,
                    IGSTVal: null,
                    Total: null,
                  },
                });
              }
              setFormValues(tempArray);
              function Total(item) {
                return item.Total;
              }
              let tempTotal = tempArray
                .filter((item) => item.Total !== "")
                .map(Total)
                .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
                }, 0);
              setTotal(parseFloat(tempTotal).toFixed(3));
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
    axios
      .get(
        Config.getCommonUrl() +
          `api/ToolsConsumption/stockcode/?department_id=${selectedDepartment.value}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          // console.log(response, "getStockCodeAll");
          let tempStockData = response.data.data;

          setStockCodeData(tempStockData);
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
        handleError(error, dispatch, { api: "api/stockname" });
      });
  }

  function getVoucherNumber() {
    axios
      .get(Config.getCommonUrl() + "api/ToolsConsumption/get/voucher")
      .then(function (response) {
        if (response.data.success === true) {
          // console.log(response, "getVoucherNumber");
          // setProductCategory(response.data.data);
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
          api: "api/consumablepurchase/get/voucher",
        });
      });
  }

  const getAvgRate = async (id , cb) =>{
    return await axios
      .get(
        Config.getCommonUrl() +
          `api/ToolsConsumption/stockcode/avg/${id}/?department_id=${selectedDepartment.value}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response, "getAvgRate");
          const rateData = response.data.data.avg_rate
         cb('',rateData);
        }
      })
      .catch(function (error) {
        cb(error)
      });
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "voucherNumber") {
      setVoucherNumber(value);
      setVoucherNumErr("");
    } else if (name === "partyVoucherDate") {
      setPartyVoucherDate(value);
      setpartyVoucherDateErr("");
    } else if (name === "voucherDate") {
      setVoucherDate(value);
      setVoucherDtErr("");
    } else if (name === "workerName") {
      setWorkerName(value);
      setWorkerNmErr("");
    } else if (name === "metalNarration") {
      setMetalNarration(value);
      setMetalNarrationErr("");
    } else if (name === "accNarration") {
      setAccNarration(value);
      setAccNarrationErr("");
    }
  }

  function voucherNumValidation() {
    if (voucherNumber === "") {
      setVoucherNumErr("Enter Valid Voucher Number");
      return false;
    }
    return true;
  }
  function workerNameValidation() {
    if (workerName === "") {
      setWorkerNmErr("Enter Worker Name ");
      return false;
    }
    return true;
  }
  function selectedDepNameValidation() {
    if (departmentData === "") {
      selectedDeptErr("Please Select Department ");
      return false;
    }
    return true;
  }

  function partyVoucherDateValidation() {
    if (partyVoucherDate === "") {
      setpartyVoucherDateErr("Enter Party Voucher Date");
      return false;
    }
    return true;
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();
    console.log("handleFormSubmit", formValues);
    if (
      (handleDateBlur(),
        voucherNumValidation(),
        partyVoucherDateValidation(),
      workerNameValidation(),
      selectedDepNameValidation())
    ) {
      console.log("if");
      if (prevContactIsValid()) {
        addConsumablePurchase(true, false);
      } else {
        console.log("prevContactIsValid else");
      }
    } else {
      console.log("else");
    }
  }

  function addConsumablePurchase(resetFlag, toBePrint) {
    let Orders = formValues
    // console.log(Orders)
      .filter((element) => element.stockCode !== "")
      .map((x) => {
        return {
          stock_name_code_id: x.stockCode.value,
          unit_of_purchase: x.unitOfPurchase,
          quantity: x.quantity,
          weight: x.availableStock,
          avg_rate: x.avgRate,
        };
      });

    if (Orders.length === 0) {
      dispatch(
        Actions.showMessage({
          message: "Please Add Purchase Entry",
          variant: "error",
        })
      );
      return;
    }
    setLoading(true);

    const body = {
      department_id: selectedDepartment.value,

      ...(allowedBackDate && {
        purchaseCreateDate: voucherDate,
      }),

      tools_narration: metalNarration,
      account_narration: accNarration,
      Orders: Orders,
      party_voucher_date:partyVoucherDate,
      uploadDocIds: docIds,
      worker_name: workerName,
    };
    console.log(body);
    axios
      .post(Config.getCommonUrl() + "api/ToolsConsumption", body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );

          setLoading(false);
          if (resetFlag === true) {
            // checkAndReset()
            History.goBack();
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error"
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);

        handleError(error, dispatch, {
          api: "api/consumablepurchase",
          body: body,
        });
      });
  }

  function resetForm() {
    setTotal("");

    setTotalInvoiceAmount("");

    setFormValues([
      {
        stockCode: "",
        categoryName: "",
        selectedHsn: "",
        unitOfPurchase: "",
        quantity: "",
        avgRate: "",
        Amount: "",
        Total: "",
        errors: {
          stockCode: null,
          categoryName: null,
          selectedHsn: null,
          unitOfPurchase: null,
          quantity: null,
          avgRate: null,
          Amount: null,
          Total: null,
        },
      },
      {
        stockCode: "",
        categoryName: "",
        selectedHsn: "",
        unitOfPurchase: "",
        quantity: "",
        avgRate: "",
        Amount: "",
        Total: "",
        errors: {
          stockCode: null,
          categoryName: null,
          selectedHsn: null,
          unitOfPurchase: null,
          quantity: null,
          avgRate: null,
          Amount: null,
          Total: null,
        },
      },
      {
        stockCode: "",
        categoryName: "",
        selectedHsn: "",
        unitOfPurchase: "",
        quantity: "",
        avgRate: "",
        Amount: "",
        Total: "",
        errors: {
          stockCode: null,
          categoryName: null,
          selectedHsn: null,
          unitOfPurchase: null,
          quantity: null,
          avgRate: null,
          Amount: null,
          Total: null,
        },
      },
      {
        stockCode: "",
        categoryName: "",
        selectedHsn: "",
        unitOfPurchase: "",
        quantity: "",
        avgRate: "",
        Amount: "",
        Total: "",
        errors: {
          stockCode: null,
          categoryName: null,
          selectedHsn: null,
          unitOfPurchase: null,
          quantity: null,
          avgRate: null,
          Amount: null,
          Total: null,
        },
      },
    ]);
  }

  const prevContactIsValid = () => {
    if (formValues.length === 0) {
      return true;
    }

    // const nameRegex = /^[a-zA-Z\s]*$/;
    const numRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;
    const weightRegex = /^[0-9]{1,11}(?:\.[0-9]{1,7})?$/;

    const someEmpty = formValues
      .filter((element) => element.stockCode !== "")
      .some((item) => {
        //not same
        return (
          item.stockCode === "" ||
          item.unitOfPurchase === "" ||
          item.quantity === "" ||item.quantity==0||
          // item.weight === "" ||
          item.avgRate === "" ||
          numRegex.test(item.quantity) === false ||
          // weightRegex.test(item.weight) === false ||
          numRegex.test(item.avgRate) === false
        );
      });

    console.log(someEmpty.length);

    if (someEmpty.length === undefined && someEmpty === false) {
      const allPrev = [...formValues];
      // console.log(item);

      let stockCode = formValues[0].stockCode;
      if (stockCode === "") {
        allPrev[0].errors.stockCode = "Please Select Stock Code";
      } else {
        allPrev[0].errors.stockCode = null;
      }
      let unitOfPurchase = formValues[0].unitOfPurchase;
      if (unitOfPurchase === "") {
        allPrev[0].errors.unitOfPurchase = "Please Select unitOfPurchase";
      } else {
        allPrev[0].errors.unitOfPurchase = null;
      }
      let qty = formValues[0].quantity;
      if(qty=='' || qty==0 ){
        allPrev[0].errors.quantity = "Please Enter valid Quantity";

      }else {
        allPrev[0].errors.quantity = null;
      }

      setFormValues(allPrev);
    }

    if (someEmpty) {
      formValues
        .filter((element) => element.stockCode !== "")
        .map((item, index) => {
          const allPrev = [...formValues];
          // console.log(item);

          let stockCode = formValues[index].stockCode;
          if (stockCode === "") {
            allPrev[index].errors.stockCode = "Please Select Stock Code";
          } else {
            allPrev[index].errors.stockCode = null;
          }

          let unitOfPurchase = formValues[index].unitOfPurchase;
          if (unitOfPurchase === "") {
            allPrev[index].errors.unitOfPurchase =
              "Please Enter Valid Unit Of Purchase";
          } else {
            allPrev[index].errors.unitOfPurchase = null;
          }

          let quantity = formValues[index].quantity;
          if (!quantity || numRegex.test(quantity) === false || quantity==0) {
            allPrev[index].errors.quantity = "Enter Valid Quantity";
          } else {
            allPrev[index].errors.quantity = null;
          }

          let avgRate = formValues[index].avgRate;
          if (!avgRate || numRegex.test(avgRate) === false) {
            allPrev[index].errors.avgRate = "Please Enter Valid Avg. Rate";
          } else {
            allPrev[index].errors.avgRate = null;
          }

          // console.log(allPrev[index]);
          setFormValues(allPrev);
          return true;
        });
    }

    return !someEmpty;
  };

  let handlerBlur = (i, e) => {
    console.log("handlerBlur");
    let newFormValues = [...formValues];

    let nm = e.target.name;
    let val = e.target.value;
    // console.log("val", val)
    if (isNaN(val) || val === "") {
      return;
    }

    if (nm === "avgRate") {
      newFormValues[i].avgRate = parseFloat(val).toFixed(3);
    }
    setFormValues(newFormValues);
  };

  let handleChange = (i, e) => {
    console.log("handleChange");
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    if(e.target.value==0){
      newFormValues[i].errors[e.target.name]="Enter valid quantity"
    }else{
      newFormValues[i].errors[e.target.name]=""
    }
    newFormValues[i].unitOfPurchase = ""

    if (
      newFormValues[i].quantity !== "" &&
      newFormValues[i].avgRate !== "" &&
      newFormValues[i].unitOfPurchase !== ""
    ) {
      //here will enter rate per gram so rate * weight
      newFormValues[i].Amount = parseFloat(
        parseFloat(newFormValues[i].avgRate) *
          parseFloat(newFormValues[i].quantity)
      ).toFixed(3);
    } else {
      newFormValues[i].Amount = 0;
    }

    function Total(item) {
      return item.Amount;
    }

    let tempTotal = newFormValues
      .filter((item) => item.Amount !== "")
      .map(Total)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotal(parseFloat(tempTotal).toFixed(3));

    let tempTotalInvoiceAmt = 0;
    if (parseFloat(tempTotal) > 0) {
      tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);
      setTotalInvoiceAmount(tempTotalInvoiceAmt);
    } else {
      setTotalInvoiceAmount(0);
    }
    setFormValues(newFormValues);
  };

  function deleteHandler(index) {
    console.log(index);
    let newFormValues = [...formValues];

    newFormValues[index].stockCode = "";
    newFormValues[index].categoryName = "";
    newFormValues[index].selectedHsn = "";
    newFormValues[index].unitOfPurchase = "";
    newFormValues[index].quantity = "";
    newFormValues[index].avgRate = "";
    newFormValues[index].Amount = "";
    newFormValues[index].availableStock = "";

    newFormValues[index].Total = "";
    newFormValues[index].errors = {
      stockCode: null,
      categoryName: null,
      selectedHsn: null,
      unitOfPurchase: null,
      quantity: null,
      avgRate: null,
      Amount: null,

      Total: null,
    };
    
    function Total(item) {
      return item.Total;
    }
    
    
    setFormValues(newFormValues);
  }

  function handleUnitChange(i, e) {
    console.log("index", i, "val", e.target.value);
    let newFormValues = [...formValues];
    newFormValues[i].unitOfPurchase = e.target.value;
    newFormValues[i].errors.unitOfPurchase = null;
    
    if (
      newFormValues[i].quantity !== "" &&
      newFormValues[i].avgRate !== "" &&
      newFormValues[i].unitOfPurchase !== ""
    ) {
      //here will enter rate per gram so rate * weight
      newFormValues[i].Amount = parseFloat(
        parseFloat(newFormValues[i].avgRate) *
          parseFloat(newFormValues[i].quantity)
      ).toFixed(3);
    } else {
      newFormValues[i].Amount = 0;
    }

    function Total(item) {
      return item.Amount;
    }

    let tempTotal = newFormValues
      .filter((item) => item.Amount !== "")
      .map(Total)
      .reduce(function (a, b) {
        // sum all resulting numbers
        return parseFloat(a) + parseFloat(b);
      }, 0);
    setTotal(parseFloat(tempTotal).toFixed(3));

    if (parseFloat(tempTotal) > 0) {
      let tempTotalInvoiceAmt = 0;
      tempTotalInvoiceAmt = parseFloat(tempTotal).toFixed(3);
      setTotalInvoiceAmount(tempTotalInvoiceAmt);
    } else {
      setTotalInvoiceAmount(0);
    }
    setFormValues(newFormValues);
  }

  const handleDocModalClose = () => {
    // console.log("handleDocModalClose")
    setDocModal(false);
  };
  const handleNarrationClick = () => {
    if (narrationFlag === false) {
      setLoading(true);

      const body = {
        flag: 28,
        id: idToBeView.id,
        tools_narration: metalNarration,
        account_narration: accNarration,
      };
      //call update Api Here
      // console.log("Api Call")
      UpdateNarration(body)
        .then((response) => {
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

  function handleDepartmentChange(value) {
    setSelectedDepartment(value);
    setSelectedDeptErr("");
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
                <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                  <FuseAnimate delay={300}>
                    <Typography className="pl-28 pt-16 text-18 font-700">
                      {isView
                        ? "View Consumable Consumption"
                        : "Add Consumable Consumption"}
                    </Typography>
                  </FuseAnimate>

                  {/* {!isView && <BreadcrumbsHelper />} */}
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  key="2"
                  style={{ textAlign: "right", paddingRight: "50px" }}
                >
        
                  <div  className="btn-back mt-2">
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

            {loading && <Loader />}
            <div className="main-div-alll">
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
                      {allowedBackDate && (
                        <Grid
                          item
                          lg={2}
                          md={4}
                          sm={4}
                          xs={12}
                          style={{ padding: 6 }}
                        >
                        <label>Date</label>
                          <TextField
                            // label="Date"
                            type="date"
                            className="mb-16"
                            name="voucherDate"
                            value={moment(voucherDate).format("YYYY-MM-DD")}
                            error={VoucherDtErr.length > 0 ? true : false}
                            helperText={VoucherDtErr}
                            onChange={(e) => handleInputChange(e)}
                            variant="outlined"
                            // defaultValue={moment().format("yyyy-mm-dd")}
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
                        <label>Voucher number</label>
                        <TextField
                          className="mb-16 mt-1"
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
                        <label>Party Voucher Date</label>
                        <TextField
                           placeholder="Party Voucher Date"
                            type="date"
                            className="mb-16"
                            name="partyVoucherDate"
                            value={partyVoucherDate}
                            error={partyVoucherDateErr.length > 0 ? true : false}
                            helperText={partyVoucherDateErr}
                            onChange={(e) => handleInputChange(e)}
                            required
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

                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ padding: 6 }}
                      >
                        <label>Worker name</label>
                        <TextField
                          className="mb-16 mt-1"
                          placeholder="Worker name"
                          name="workerName"
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          value={workerName}
                          disabled={isView}
                        />
                        <span style={{ color: "red" }}>
                          {workerNmErr.length > 0 ? workerNmErr : ""}
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
                        <label>Select department</label>
                        <Select
                          className="mt-1"
                          // id="nav-dropdown-dv"
                          // tabIndex="1"
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          style={{ alignSelf: "center" }}
                          options={departmentData.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.name,
                            isDisabled:
                              suggestion.is_location === 1 ? true : false,
                          }))}
                          // components={components}
                          value={selectedDepartment}
                          onChange={handleDepartmentChange}
                          placeholder="Select department"
                          isDisabled={isView}
                        />
                        <span style={{ color: "red" }}>
                          {selectedDeptErr.length > 0 ? selectedDeptErr : ""}
                        </span>
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
                          <label>Upload document</label>
                          <TextField
                            className="mb-16 uploadDoc mt-1"
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
                    </Grid>

                    <div
                      className="AddConsumablePurchase-tabel AddConsumablePurchase-tabel-blg mt-16"
                      style={{
                        paddingBottom: 5,
                        border: "1px solid #D1D8F5",
                        borderRadius: "7px",

                      }}
                    >
                      <div
                        className="metal-tbl-head tool-tbl-head"
                        style={{
                          fontWeight: "700",
                          background: "rgb(235, 238, 251)",
                        }}
                      >
                        {!isView && (
                          <div
                            className={clsx(
                              classes.tableheader,
                              "delete_icons_dv"
                            )}
                          >
                            {/* delete action */}
                          </div>
                        )}
                        <div
                          className={classes.tableheader}
                        >
                          Category Variant
                        </div>
                        <div
                          className={clsx(
                            classes.tableheader,
                          )}
                        >
                          Category Name
                        </div>
                        <div
                          className={clsx(
                            classes.tableheader,
                          )}
                        >
                          HSN
                        </div>

                        <div
                          className={clsx(
                            classes.tableheader,
                          )}
                        >
                          Quantity
                        </div>

                        <div
                          className={clsx(
                            classes.tableheader,
                          )}
                        >
                          Unit of purchase
                        </div>
                        <div
                          className={clsx(
                            classes.tableheader,
                          )}
                        >
                          Available Stock
                        </div>
                        <div
                          className={clsx(
                            classes.tableheader,
                          )}
                        >
                          Average Rate
                        </div>

                        <div
                          className={clsx(
                            classes.tableheader,
                          )}
                        >
                          Total
                        </div>
                      </div>

                      {formValues.map((element, index) => (
                        <div key={index} className=" castum-row-dv all-purchase-tabs">
                          {!isView && (
                            <div
                              className={clsx(
                                classes.tableheader,
                                "delete_icons_dv all-purchase-tabs"
                              )}
                            >
                              <IconButton
                                tabIndex="-1"
                                style={{ padding: "0" }}
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
                            className={classes.selectBox}
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            classes={classes}
                            styles={selectStyles}
                            options={stockCodeData
                              .filter(
                                (element) => 
                                formValues.every(
                                  (item) =>
                                    !(
                                      item.stockCode?.value === 
                                      element.stock_name_code.id &&
                                      item.stockCode?.label ===
                                      element.stock_name_code.stock_code
                                    )
                                )
  
                              )
                              .map((suggestion) => ({
                                value: suggestion.stock_name_code.id,
                                label: suggestion.stock_name_code.stock_code,
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
                            // label="HSN"
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
                            // label="HSN"
                            name="selectedHsn"
                            className=""
                            value={element.selectedHsn || ""}
                            disabled
                            // value={departmentNm}
                            error={
                              element.errors !== undefined
                                ? element.errors.selectedHsn
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              element.errors !== undefined
                                ? element.errors.selectedHsn
                                : ""
                            }
                            // onChange={(e) => handleChange(index, e)}
                            variant="outlined"
                            fullWidth
                          />

                          <TextField
                            name="quantity"
                            value={element.quantity}
                            error={
                              element.errors !== undefined
                                ? element.errors.quantity
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              element.errors !== undefined
                                ? element.errors.quantity
                                : ""
                            }
                            onChange={(e) => handleChange(index, e)}
                            inputRef={(el) => (inputRef.current[index] = el)}
                            variant="outlined"
                            fullWidth
                            disabled={isView}
                          />

                          <select
                            className={clsx(
                              classes.normalSelect,
                              "unit_purchase_castum AddConsumablePurchase_table_border",
                              "focusClass"
                            )}
                            required
                            value={element.unitOfPurchase || ""}
                            onChange={(e) => handleUnitChange(index, e)}
                            disabled={isView}
                          >
                            <option hidden value="">
                              Select Unit type
                            </option>
                            {  unitData.map((suggestion) =>(
                          <option value={suggestion.id}>{suggestion.unit_name} </option>
                        ))}
                          </select>

                          <span style={{ color: "red" }}>
                            {element.errors !== undefined
                              ? element.errors.unitOfPurchase
                              : ""}
                          </span>

                          <TextField
                            name="availableStock"
                            className=""
                            value={element.availableStock || ""}
                            disabled
                            variant="outlined"
                            fullWidth
                          />

                          <TextField
                            name="avgRate"
                            value={
                              isView
                                ? Config.numWithComma(element.avgRate)
                                : element.avgRate || ""
                            }
                            // value={avgRatee}
                            error={
                              element.errors !== undefined
                                ? element.errors.avgRate
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              element.errors !== undefined
                                ? element.errors.avgRate
                                : ""
                            }
                            // onChange={(e) => handleChange(index, e)}
                            onBlur={(e) => handlerBlur(index, e)}
                            variant="outlined"
                            fullWidth
                            disabled={isView}
                          />
                          <TextField
                            // label="Total"
                            name="Amount"
                            className=""
                            value={
                              isView
                                ? Config.numWithComma(element.Amount)
                                : element.Amount || ""
                            }
                            // value={departmentNm}
                            error={
                              element.errors !== undefined
                                ? element.errors.Amount
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              element.errors !== undefined
                                ? element.errors.Amount
                                : ""
                            }
                            // onChange={(e) => handleChange(index, e)}
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
                            id="castum-width-table_new"
                            style={{}}
                            className={clsx(
                              classes.tableheader,
                              "delete_icons_dv"
                            )}
                          ></div>
                        )}
                        <div
                          id="castum-width-table_new"
                          className={classes.tableheader}
                        ></div>
                        <div
                          id="castum-width-table_new"
                          className={classes.tableheader}
                          style={{}}
                        ></div>
                        <div
                          id="castum-width-table_new"
                          className={classes.tableheader}
                          style={{}}
                        ></div>

                        <div
                          id="castum-width-table_new"
                          className={classes.tableheader}
                          style={{}}
                        >
                          {/* Quantity */}
                        </div>

                        <div
                          id="castum-width-table_new"
                          className={classes.tableheader}
                          style={{}}
                        >
                          {/* Unit of purchase */}
                        </div>
                        <div
                          id="castum-width-table_new"
                          className={classes.tableheader}
                          style={{}}
                        >
                          {/* Rate per unit */}
                        </div>

                        <div
                          id="castum-width-table_new"
                          className={classes.tableheader}
                          style={{}}
                        >
                          {isView ? Config.numWithComma(total) : total}
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
                    <div style={{ display: "flex", alignItems: "center", width: "35%" }}>
                      <label className="mr-2">Total Invoice Amount : </label>
                      <label className="ml-2">
                        {" "}
                        {/* {isView
                          ? Config.numWithComma(totalInvoiceAmount)
                          : totalInvoiceAmount} */}
                            {  isView ? Config.numWithComma
                       (HelperFunc.getTotalOfField(formValues, "Amount")) : 
                       Config.numWithComma
                       (HelperFunc.getTotalOfField(formValues, "Amount"))}
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
                      <label className="popup-labl ml-1">
                        jewellery Narration
                      </label>
                      <TextField
                        className="mt-1 mr-2"
                        placeholder="Consumable narration"
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
                      <label className="popup-labl ml-2">
                        Account Narration
                      </label>
                      <TextField
                        className="mt-1 ml-2"
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
                          style={{ float: "right" }}
                          className="w-224 mx-auto mt-16 btn-print-save"
                          aria-label="Register"
                          disabled={isView || formValues[0].Amount == 0}
                          // type="submit"
                          onClick={(e) => {
                            handleFormSubmit(e);
                          }}
                        >
                          Save
                        </Button>
                      )}

                      {isView && (
                        <Button
                          variant="contained"
                          // color="primary"
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
                    </div>
                  )}

                  {isView && (
                    <Button
                      variant="contained"
                      className={clsx(classes.button, "mt-16 mr-16 btn-print-save")}
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
              purchase_flag="5"
              concateDocument={concateDocument}
              viewPopup={props.viewPopup}
            />
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
});

export default AddToolsConsumption;

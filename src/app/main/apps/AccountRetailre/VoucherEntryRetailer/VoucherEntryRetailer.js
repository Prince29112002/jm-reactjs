import React, { useState, useEffect } from "react";
import { Typography, TextField, Icon, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Select, { createFilter } from "react-select";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import History from "@history";
import moment from "moment";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Loader from "../../../Loader/Loader";
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  tableheader: {
    display: "inline-block",
    textAlign: "center",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
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

const VoucherEntryRetailer = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState(true);
  const [voucherList, setVoucherList] = useState([]);
  const [creditLedger, setCreditLedger] = useState([]);
  const [debitLedger, setDebitLedger] = useState([]);
  const [rows, setRows] = useState([
    {
      CrOrDr: "",
      Ledger: "",
      MainLed: "",
      Amount: "",
      HSN: "",
      CGSTPer: "",
      SGSTPer: "",
      IGSTPer: "",
      CGST: "",
      SGST: "",
      IGST: "",
      Total: "",
      errors: {},
    },
  ]);
  const [selectedVoucherList, setSelectedVoucherList] = useState("");
  const [voucherName, setVoucherName] = useState("");
  const [voucherId, setVoucherId] = useState("");
  const [mainVoucherName, setMainVoucherName] = useState("");
  const [selectCrDr, setSelectCrDr] = useState("");
  const [selectCrDrErr, setSelectCrDrErr] = useState("");
  const [selectLed, setSelectLed] = useState("");
  const [selectLedErr, setSelectLedErr] = useState("");
  const [backdateReq, setBackdateReq] = useState("");
  const [backdateDays, setBackDays] = useState("");
  const [isFormatVertical, setIsFormatVertical] = useState("");
  const [objArr, setObjArr] = useState("");
  const [taxInclude, setTaxInclude] = useState(false);
  const [taxTcsTds, setTaxTcsTds] = useState("");
  const [selectedLedTax, setSelectedLedTax] = useState([]);
  const [ledgerSelectedTax, setLedgerSelectedTax] = useState("");
  const [ledgerSelectedTaxErr, setLedgerSelectedTaxErr] = useState("");
  const [selectedTaxLedRate, setSelectedTaxLedRate] = useState("");
  const [ledgerAmtErr, setLedgerAmtErr] = useState("");
  const [calculatedLedAmount, setCalculatedLedAmount] = useState(0);
  const [finalAmoutTotal, setFinalAmoutTotal] = useState(0);
  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [hsnNum, setHsnVoucherNum] = useState("");
  const [hsnNumberList, setHsnNumList] = useState([]);
  const [narrationReq, setNarrationReq] = useState("");
  const [narration, setNarration] = useState("");
  const [narrationErr, setNarrationErr] = useState("");
  const [otherVoucherNum, setOtherVoucherNum] = useState("");
  const [otherVoucherNumber, setOtherVoucherNumber] = useState("");
  const [otherVoucherNumberErr, setOtherVoucherNumberErr] = useState("");
  const [supplyVoucherNum, setSupplyVoucherNum] = useState("");
  const [supplyVoucherNumber, setSupplyVoucherNumber] = useState("");
  const [supplyVoucherNumberErr, setSupplyVoucherNumberErr] = useState("");
  const [partyVoucherdt, setPartyVoucherdt] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");
  const [partyVoucherDateErr, setPartyVoucherDateErr] = useState("");
  const [gst, setGst] = useState("");
  const [mainAmount, setMainAmount] = useState(0);
  const [otherAmount, setOtherAmount] = useState(0);
  // const [documentUploadFile, setDocumentUploadFile] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllVoucherList();
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Accounts-Retailer", dispatch);
  }, []);

  function getAllVoucherList() {
    axios
      .get(
        Config.getCommonUrl() + "retailerProduct/api/vouchersettingdetail/other"
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setVoucherList(res.data.data);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "retailerProduct/api/vouchersettingdetail/other",
        });
      });
  }

  function getLedgerList(api, selectOption) {
    axios
      .get(Config.getCommonUrl() + api)
      .then((res) => {
        console.log(res);
        if (selectOption === "toDebit") {
          setDebitLedger(res.data.data);
        } else {
          setCreditLedger(res.data.data);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: api });
      });
  }

  function getAllHsnNumberApi() {
    axios
      .get(Config.getCommonUrl() + `retailerProduct/api/hsnmaster`)
      .then((res) => {
        console.log(res);
        setHsnNumList(res.data.data);
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `retailerProduct/api/hsnmaster` });
      });
  }

  const handleClose = () => {
    History.push("/dashboard/accountretailer/createaccountretailer");
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

  const ButtonArr = [
    { id: 2, text: "Change Voucher" },
    { id: 1, text: "Back" },
    // { id: 3, text: "Upload Excel File" },
  ];

  const creditDebitArr = [
    { value: 0, label: "Dr" },
    { value: 1, label: "Cr" },
  ];

  const handleButtonClick = (btnId) => {
    if (btnId === 1) {
      History.push("/dashboard/accountretailer/createaccountretailer");
    } else if (btnId === 2) {
      setCreditLedger([]);
      setDebitLedger([]);
      setSelectedVoucherList("");
      setVoucherName("");
      setMainVoucherName("");
      setVoucherId("");
      setSelectCrDr("");
      setSelectCrDrErr("");
      setSelectLed("");
      setSelectLedErr("");
      setBackdateReq("");
      setBackDays("");
      setIsFormatVertical("");
      setTaxInclude(false);
      setTaxTcsTds("");
      setSelectedLedTax([]);
      setHsnVoucherNum("");
      setNarrationReq("");
      setNarration("");
      setNarrationErr("");
      setOtherVoucherNum("");
      setOtherVoucherNumber("");
      setOtherVoucherNumberErr("");
      setSupplyVoucherNum("");
      setSupplyVoucherNumber("");
      setSupplyVoucherNumberErr("");
      setGst("");
      setMainAmount(0);
      setLedgerSelectedTax("");
      setSelectedTaxLedRate("");
      setCalculatedLedAmount(0);
      setFinalAmoutTotal(0);
      // setDocumentUploadFile("");
      setRows([
        {
          CrOrDr: "",
          Ledger: "",
          MainLed: "",
          Amount: "",
          HSN: "",
          CGSTPer: "",
          SGSTPer: "",
          IGSTPer: "",
          CGST: "",
          SGST: "",
          IGST: "",
          Total: "",
          errors: {},
        },
      ]);
      setOpen(true);
    }
  };

  const getLedgerRate = () => {
    axios
      .get(
        Config.getCommonUrl() +
          `retailerProduct/api/ledger/tds-tcs/ledger/rate/${ledgerSelectedTax.value}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setSelectedTaxLedRate(response.data.data.rate);
        } else {
          setSelectedTaxLedRate("");
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
          api: `retailerProduct/api/ledger/tds-tcs/ledger/rate/${ledgerSelectedTax.value}`,
        });
      });
  };

  const handleSelectedVoucher = (value) => {
    setSelectedVoucherList(value);
    selectedVoucherApiCall(value);
  };

  const selectedVoucherApiCall = (value) => {
    setLoading(true);
    setMainVoucherName(value.label);
    const v_id = value.value;
    axios
      .get(
        Config.getCommonUrl() +
          `retailerProduct/api/vouchersettingdetail/${v_id}`
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const arrdata = res.data.data[0];
          setVoucherId(value.value);
          getVoucherNumberOne(v_id);
          if (arrdata.VoucherSettingDetails.length > 0) {
            const data = arrdata.VoucherSettingDetails[0];
            // var temp = data.map(d => Math.abs(new Date() - new Date(d.start_date).getTime()));
            // var idx = temp.indexOf(Math.min(...temp));
            setObjArr(data);
            // setVoucherName(data.voucher_number);
            setIsFormatVertical(data.format_type);
            getLedgerList(
              `retailerProduct/api/vouchersettingdetail/toDebit/${data.id}`,
              "toDebit"
            );
            getLedgerList(
              `retailerProduct/api/vouchersettingdetail/toCredit/${data.id}`,
              "toCredit"
            );

            if (data.vertical_formats_on_top === 1) {
              const rowData = [...rows];
              rowData[0].CrOrDr = { value: 0, label: "Dr" };
              setRows(rowData);
              setSelectCrDr({ value: 1, label: "Cr" });
            } else if (data.vertical_formats_on_top === 0) {
              const rowData = [...rows];
              rowData[0].CrOrDr = { value: 1, label: "Cr" };
              setRows(rowData);
              setSelectCrDr({ value: 0, label: "Dr" });
            }
            setSupplyVoucherNum(data.require_supplier_voucher_no);
            setOtherVoucherNum(data.required_other_voucher_no);
            setPartyVoucherdt(data.require_party_voucher_date);
            setHsnVoucherNum(data.require_hsn_no);
            if (data.require_hsn_no == 1) {
              getAllHsnNumberApi();
            }
            setBackdateReq(data.back_date_entry);
            setBackDays(data.back_entry_days);
            setGst(data.gst);
            setNarrationReq(data.require_narration);
            if (data.taxation_ledger_include === 1) {
              setTaxInclude(true);
              setTaxTcsTds(data.taxation_ledger);
              let ledArr = [];
              data.VoucherLedger.map((item) => {
                ledArr.push({
                  value: item.ledger_id,
                  label: item.TexationLedgerDetails.name,
                });
              });
              setSelectedLedTax(data.VoucherLedger);
            }
          }
          setLoading(false);
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
          setOpen(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `retailerProduct/api/vouchersettingdetail/${v_id}`,
        });
      });
    setOpen(false);
  };

  function handleRowAdd() {
    if (isFormatVertical === 0) {
      if (rows[0].CrOrDr.value === 1) {
        var data = { value: 0, label: "Dr" };
      } else {
        var data = { value: 1, label: "Cr" };
      }
    } else {
      if (objArr.vertical_formats_on_top === 1) {
        var data = { value: 0, label: "Dr" };
      } else {
        var data = { value: 1, label: "Cr" };
      }
    }
    setRows([
      ...rows,
      {
        CrOrDr: data,
        Ledger: "",
        MainLed: selectLed ? selectLed : null,
        Amount: "",
        HSN: "",
        CGSTPer: "",
        SGSTPer: "",
        IGSTPer: "",
        CGST: "",
        SGST: "",
        IGST: "",
        Total: "",
        errors: {},
      },
    ]);
  }

  const handleLedgerName = (value, i) => {
    if (validateFirstCrDr(i)) {
      if (isFormatVertical === 1 && selectLed === "") {
        setSelectLedErr("Please Select Ledger Name");
      } else {
        const newRowData = [...rows];
        newRowData[i].Ledger = value;
        newRowData[i].errors["Ledger"] = "";
        setRows(newRowData);
      }
    }
  };

  const handleHSN = (value, i) => {
    if (validateMainLed() && validateLed(i)) {
      const newRowData = [...rows];
      newRowData[i].HSN = value;
      newRowData[i].Amount = "";
      newRowData[i].errors["HSN"] = "";
      if (isFormatVertical === 1 && hsnNum === 1) {
        if (selectLed.state === 12) {
          const percentage = parseFloat(value.percentage) / 2;
          newRowData[i].CGSTPer = percentage;
          newRowData[i].SGSTPer = percentage;
        } else {
          newRowData[i].IGSTPer = parseFloat(value.percentage);
        }
      }
      setRows(newRowData);
    }
  };

  const handleCreditDebit = (value, i) => {
    const newRowData = [...rows];
    if (isFormatVertical === 0) {
      const objLen = newRowData.length;
      if (i === 0) {
        newRowData[i].CrOrDr = value;
        if (objLen > 1) {
          if (value.value === 0) {
            var putObj = { value: 1, label: "Cr" };
          } else {
            var putObj = { value: 0, label: "Dr" };
          }
          newRowData.map((item, i) => {
            if (i !== 0) {
              item.CrOrDr = putObj;
              item.Ledger = "";
            }
          });
        }
      }
    } else {
      newRowData[i].CrOrDr = value;
    }
    newRowData[i].errors["CrOrDr"] = "";
    if (newRowData[i].Ledger !== "") {
      newRowData[i].Ledger = "";
    }
    setRows(newRowData);
    if (isFormatVertical === 1 && selectCrDr.value === value.value) {
      if (value.value === 0) {
        var changeObj = { value: 1, label: "Cr" };
      } else {
        var changeObj = { value: 0, label: "Dr" };
      }
      setSelectCrDr(changeObj);
      setSelectCrDrErr("");
      setSelectLed("");
    }
  };

  const handleMainCreditDebit = (value) => {
    setSelectCrDr(value);
    setSelectCrDrErr("");
    setSelectLed("");
    const rowData = [...rows];
    const rowLength = rowData.length;
    if (value.value === 0) {
      rowData[rowLength - 1].CrOrDr = {
        value: 1,
        label: "Cr",
      };
    } else {
      rowData[rowLength - 1].CrOrDr = {
        value: 0,
        label: "Dr",
      };
    }
    setRows(rowData);
  };

  const handleMainLedgerName = (value) => {
    setSelectLed(value);
    setSelectLedErr("");
    const rowData = [...rows];
    rowData[0].MainLed = value;
    setRows(rowData);
  };

  const handleInputDataChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "narration") {
      setNarration(value);
      setNarrationErr("");
    } else if (name === "otherVoucherNumber") {
      setOtherVoucherNumber(value);
      setOtherVoucherNumberErr("");
    } else if (name === "VoucherNum") {
      setSupplyVoucherNumber(value);
      setSupplyVoucherNumberErr("");
    } else if (name === "partyVoucherDate") {
      setPartyVoucherDate(value);
      setPartyVoucherDateErr("");
    }
  };

  function validateMainLed() {
    if (isFormatVertical === 1 && selectLed === "") {
      setSelectLedErr("Please Select Ledger Name");
      return false;
    }
    return true;
  }

  function validateFirstCrDr(i) {
    const newRowData = [...rows];
    if (newRowData[i].CrOrDr === "") {
      newRowData[i].errors["CrOrDr"] = "Select Cr/Dr";
      setRows(newRowData);
      return false;
    }
    return true;
  }

  function validateLed(i) {
    const newRowData = [...rows];
    if (newRowData[i].Ledger === "") {
      newRowData[i].errors["Ledger"] = "Select Ledger Name";
      setRows(newRowData);
      return false;
    }
    return true;
  }

  function validateHSN(i) {
    if (hsnNum === 1) {
      const newRowData = [...rows];
      if (newRowData[i].HSN === "") {
        newRowData[i].errors["HSN"] = "Select HSN";
        setRows(newRowData);
        return false;
      }
      return true;
    }
    return true;
  }

  const handleLedTaxChange = (value) => {
    setLedgerSelectedTax(value);
    setLedgerSelectedTaxErr("");
    setSelectedTaxLedRate("");
    setCalculatedLedAmount(0);
  };

  function handleInputChange(e, i) {
    const name = e.target.name;
    const value = e.target.value;
    const newRowData = [...rows];

    if (isFormatVertical === 1) {
      if (validateMainLed() && validateLed(i) && validateHSN(i)) {
        if (value.length < 20 && !isNaN(Number(value))) {
          newRowData[i][name] = value;

          if (selectLed.state === 12) {
            const cgstVal = (parseFloat(value) * newRowData[i].CGSTPer) / 100;
            newRowData[i].CGST = parseFloat(cgstVal).toFixed(3);
            const sgstVal = (parseFloat(value) * newRowData[i].SGSTPer) / 100;
            newRowData[i].SGST = parseFloat(sgstVal).toFixed(3);
            const gstTotal =
              parseFloat(newRowData[i].CGST) + parseFloat(newRowData[i].SGST);
            newRowData[i].Total = (
              parseFloat(gstTotal) + parseFloat(value)
            ).toFixed(3);
          } else {
            const igstVal = (parseFloat(value) * newRowData[i].IGSTPer) / 100;
            newRowData[i].IGST = parseFloat(igstVal).toFixed(3);
            newRowData[i].Total = (
              parseFloat(newRowData[i].IGST) + parseFloat(value)
            ).toFixed(3);
          }
        }
        if (value === "" || isNaN(Number(value)) || value <= 0) {
          newRowData[i].errors[name] = "Enter Valid amount";
          newRowData[i].CGST = 0;
          newRowData[i].SGST = 0;
          newRowData[i].IGST = 0;
          newRowData[i].Total = 0;
        } else {
          newRowData[i].errors[name] = "";
        }
        setRows(newRowData);
        if (!newRowData[i + 1] && name === "Amount") {
          handleRowAdd();
        }
      }
    } else {
      if (validateFirstCrDr(i) && validateLed(i)) {
        if (value.length < 20) {
          newRowData[i][name] = value;
        }
        if (i === 0) {
          setMainAmount(value);
        } else {
          var otherAmt =
            HelperFunc.getTotalOfField(rows, "Amount") - mainAmount;
          setOtherAmount(otherAmt);
        }
        if (value === "" || isNaN(Number(value)) || value <= 0) {
          newRowData[i].errors[name] = "Enter Valid amount";
        } else if (i !== 0 && otherAmt > mainAmount) {
          newRowData[i].errors[name] = "Enter Valid amount";
        } else {
          newRowData[i].errors[name] = "";
        }
        setRows(newRowData);

        if (
          !newRowData[i + 1] &&
          name === "Amount" &&
          value !== "" &&
          value > 0
        ) {
          if (i !== 0 && otherAmt < mainAmount) {
            handleRowAdd();
          } else if (i === 0) {
            handleRowAdd();
          }
        }
      }
    }
  }

  const validateEmptyError = () => {
    let arrData = rows;
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

  // const validateField = () => {
  //   const finalRow = [...rows];
  //   const arrLen = finalRow.length;
  //   finalRow.map((arrData, i) => {
  //     if (i === 0 || arrLen - 1 > i) {
  //       if (arrData.Amount === "") {
  //         finalRow[i].errors['Amount'] = "Enter a valid amount"
  //       }
  //       if (isFormatVertical === 0 && arrData.CrOrDr === "") {
  //         finalRow[i].errors['CrOrDr'] = "Select Cr/Dr"
  //       }
  //       if (arrData.Ledger === "") {
  //         finalRow[i].errors['Ledger'] = "Select Ledger Name"
  //       }
  //     }
  //     setRows(finalRow)
  //   })
  // };

  const validateField = () => {
    if (rows[0].Amount === "") {
      dispatch(Actions.showMessage({ message: "Enter Voucher Entry" }));
      return false;
    }
    return true;
  };

  function validateNarration() {
    if (narrationReq === 1 && narration === "") {
      setNarrationErr("Please Enter Narration");
      return false;
    }
    return true;
  }

  // function validateotherVoucherNum() {
  //   if (otherVoucherNum === 1 && otherVoucherNumber === "") {
  //     setOtherVoucherNumberErr("Please Enter Other Voucher Number");
  //     return false;
  //   }
  //   return true;
  // }

  // function validateSupplyVocherNum() {
  //   if (supplyVoucherNum === 1 && supplyVoucherNumber === "") {
  //     setSupplyVoucherNumberErr("Please Enter Supply voucher Number");
  //     return false;
  //   }
  //   return true;
  // }

  // function validatePartyVoucherDate() {
  //   if (partyVoucherdt === 1 && partyVoucherDate === "") {
  //     setPartyVoucherDateErr("Select party voucher date");
  //     return false;
  //   }
  //   return true;
  // }

  function validateTaxLedger() {
    if (taxInclude) {
      if (ledgerSelectedTax === "") {
        setLedgerSelectedTaxErr("Select Ledger");
        return false;
      }
      return true;
    } else {
      return true;
    }
  }

  function validateLastRow() {
    const len = rows.length;
    if (rows[len - 1].Amount === "") {
      rows.pop();
      return true;
    }
    return true;
  }

  function validateAmountAddition() {
    if (isFormatVertical === 0) {
      if (otherAmount != mainAmount) {
        dispatch(
          Actions.showMessage({ message: "Your Cr/Dr Amount not matched !" })
        );
        return false;
      }
      return true;
    }
    return true;
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (
      validateMainLed() &&
      // validateotherVoucherNum() &&
      // validatePartyVoucherDate() &&
      // validateSupplyVocherNum() &&
      validateField() &&
      validateNarration() &&
      // validateTaxLedger() &&
      validateEmptyError() &&
      validateAmountAddition() &&
      validateLastRow()
    ) {
      callAddVoucherEntryApi();
    }
  }

  function callAddVoucherEntryApi() {
    const voucher_entry_details = rows.map((item) => {
      return {
        credit_debit: item.CrOrDr.value,
        hsn_id: item.HSN.value,
        igst: item.IGST,
        cgst: item.CGST,
        sgst: item.SGST,
        igst_per: item.IGSTPer,
        cgst_per: item.CGSTPer,
        sgst_per: item.SGSTPer,
        ledger_id: item.Ledger.value,
        total_amt: item.Total === "" ? item.Amount : item.Total,
        amount: item.Amount,
      };
    });

    if (isFormatVertical === 1) {
      rows.map((item) => {
        voucher_entry_details.push({
          credit_debit: selectCrDr.value,
          hsn_id: item.HSN.value,
          igst: item.IGST,
          cgst: item.CGST,
          sgst: item.SGST,
          igst_per: item.IGSTPer,
          cgst_per: item.CGSTPer,
          sgst_per: item.SGSTPer,
          ledger_id: item.MainLed.value,
          total_amt: item.Total === "" ? item.Amount : item.Total,
          amount: item.Amount,
        });
      });
    }
    const formData = new FormData();
    // if (documentUploadFile !== null && documentUploadFile !== "") {
    //   for (let i = 0; i < documentUploadFile.length; i++) {
    //     formData.append("files", documentUploadFile[i]);
    //   }
    // }
    formData.append("voucher_id", voucherId);
    formData.append("refrence_voucher", supplyVoucherNumber);
    formData.append("note", narration);
    formData.append("other_voucher_no", otherVoucherNumber);
    formData.append("party_voucher_date", partyVoucherDate);
    formData.append("create_date", voucherDate);
    formData.append(
      "voucher_entry_details",
      JSON.stringify(voucher_entry_details)
    );
    // formData.append("taxation_ledger_id", ledgerSelectedTax.value ? ledgerSelectedTax.value : null);
    // formData.append("taxation_ledger_per", selectedTaxLedRate);
    // formData.append("taxable_amount", calculatedLedAmount);
    // formData.append("final_amount", finalAmoutTotal);

    axios
      .post(
        Config.getCommonUrl() + "retailerProduct/api/voucherentry/entry",
        formData
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          History.push("/dashboard/accountretailer/voucherhistoryretailer");
          dispatch(
            Actions.showMessage({
              message: "Voucher Entry Added Successfully",
              variant: "success",
            })
          );
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
          api: "retailerProduct/api/voucherentry/entry",
          body: JSON.stringify(formData),
        });
      });
  }

  function ModalView() {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
      >
        <div
          id="voucher-model-popup"
          style={modalStyle}
          //  className={classes.paper}
          className={clsx(classes.paper, "rounded-8")}
        >
          <h5
            // className="p-5"
            className="popup-head p-5"
            style={{
              textAlign: "center",
              // backgroundColor: "black",
              // color: "white",
            }}
          >
            Select Voucher
            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={handleClose}
            >
              <Icon style={{ color: "white" }}>close</Icon>
            </IconButton>
          </h5>
          <div className="p-5 pl-16 pr-16">
            <div>
              <Select
                classes={classes}
                styles={selectStyles}
                autoFocus
                options={voucherList.map((optn) => ({
                  value: optn.id,
                  label: optn.name,
                }))}
                filterOption={createFilter({ ignoreAccents: false })}
                value={selectedVoucherList}
                onChange={handleSelectedVoucher}
                placeholder="Select Voucher"
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  function getVoucherNumberOne(id) {
    const body = {
      voucher_id: id,
    };
    axios
      .post(
        Config.getCommonUrl() + "retailerProduct/api/voucherentry/next/voucher",
        body
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setVoucherName(response.data.data);
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
          api: "retailerProduct/api/voucherentry/next/voucher",
          body,
        });
      });
  }

  const deleteHandler = (delId) => {
    let rowData = [...rows];
    if (rowData[delId + 1]) {
      const newData = rowData.filter((item, i) => {
        if (i !== delId) return item;
        return false;
      });
      setRows(newData);
    } else {
      rowData[delId].Ledger = "";
      rowData[delId].MainLed = "";
      rowData[delId].Amount = "";
      rowData[delId].HSN = "";
      rowData[delId].CGSTPer = "";
      rowData[delId].SGSTPer = "";
      rowData[delId].IGSTPer = "";
      rowData[delId].CGST = "";
      rowData[delId].SGST = "";
      rowData[delId].IGST = "";
      rowData[delId].Total = "";
      setRows(rowData);
    }
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container voucherentry-table">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              container
              alignItems="center"
              style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
            >
              <Grid item xs={5} sm={4} md={4} lg={5} key="1">
                <FuseAnimate delay={300}>
                  {/* <Typography className="p-16 pb-8 text-18 font-700"> */}
                  <Typography className="text-18 font-700">
                    Voucher Entry
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
              <Grid
                item
                xs={7}
                sm={8}
                md={8}
                lg={7}
                key="2"
                style={{ textAlign: "right" }}
              >
                <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  // key={idx}
                  onClick={() => handleButtonClick(2)}
                >
                  Change Voucher
                </Button>
                <Button
                  variant="contained"
                  id="btn-back"
                  size="small"
                  onClick={() => handleButtonClick(1)}
                >
                  <img
                    className="back_arrow"
                    src={Icones.arrow_left_pagination}
                    alt=""
                  />
                  Back
                </Button>

                {/* {ButtonArr.map((btndata, idx) => (
                  <Button
                    variant="contained"
                    className={classes.button}
                    size="small"
                    key={idx}
                    onClick={() => handleButtonClick(btndata.id)}
                  >
                    {btndata.text}
                  </Button>
                ))} */}
              </Grid>
            </Grid>

            {open && ModalView()}
            <div className="main-div-alll" style={{ padding: 0 }}>
              {!open && (
                <div
                  style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20 }}
                >
                  <Grid container>
                    <Grid item xs={2} style={{ paddingRight: "12px" }}>
                      <p className="popup-labl pb-1">Date</p>
                      <TextField
                        autoFocus
                        name="backDate"
                        type="date"
                        value={voucherDate}
                        onChange={(e) => {
                          setVoucherDate(e.target.value);
                        }}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={backdateReq ? false : true}
                        inputProps={{
                          min: moment()
                            .subtract(backdateDays, "day")
                            .format("YYYY-MM-DD"),
                          max: moment().format("YYYY-MM-DD"),
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                    <Grid item xs={2} style={{ paddingRight: "12px" }}>
                      <p className="popup-labl pb-1">Voucher Number</p>
                      <TextField
                        className="mb-16"
                        autoFocus
                        placeholder="Voucher Number"
                        value={voucherName}
                        disabled
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={2} style={{ paddingRight: "12px" }}>
                      <p className="popup-labl pb-1">Voucher Name (type)</p>
                      <TextField
                        className="mb-16"
                        autoFocus
                        placeholder="Voucher Name (type)"
                        value={mainVoucherName}
                        disabled
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>

                    {isFormatVertical === 1 && (
                      <>
                        <Grid item xs={2} style={{ paddingRight: "12px" }}>
                          <p className="popup-labl pb-1">Cr/Dr</p>
                          <Select
                            classes={classes}
                            autoFocus
                            styles={selectStyles}
                            value={selectCrDr}
                            isDisabled
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            //  onChange={(e) => handleMainCreditDebit(e)}
                            placeholder="Cr/Dr"
                          />
                          <span style={{ color: "red" }}>
                            {selectCrDrErr.length > 0 ? selectCrDrErr : ""}
                          </span>
                        </Grid>
                        <Grid item xs={2} style={{ paddingRight: "12px" }}>
                          <p className="popup-labl pb-1">Ledger Name</p>
                          <Select
                            classes={classes}
                            autoFocus
                            styles={selectStyles}
                            options={
                              objArr.vertical_formats_on_top === 1
                                ? creditLedger.map((optn) => ({
                                    value: optn.id,
                                    label: optn.name,
                                    state: optn.state,
                                  }))
                                : debitLedger.map((optn) => ({
                                    value: optn.id,
                                    label: optn.name,
                                    state: optn.state,
                                  }))
                            }
                            value={selectLed}
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            onChange={(e) => handleMainLedgerName(e)}
                            placeholder="Ledger Name"
                          />
                          <span style={{ color: "red" }}>
                            {selectLedErr.length > 0 ? selectLedErr : ""}
                          </span>
                        </Grid>
                      </>
                    )}

                    {otherVoucherNum === 1 && (
                      <Grid item xs={2} style={{ paddingRight: "12px" }}>
                        <p className="popup-labl pb-1">Other Voucher Num</p>
                        <TextField
                          placeholder="Other Voucher Num"
                          name="otherVoucherNumber"
                          value={otherVoucherNumber}
                          error={otherVoucherNumberErr ? true : false}
                          helperText={otherVoucherNumberErr}
                          onChange={handleInputDataChange}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      </Grid>
                    )}

                    {supplyVoucherNum === 1 && (
                      <Grid item xs={2} style={{ paddingRight: "12px", paddingBottom:"16px"}}>
                        <p className="popup-labl pb-1">
                          Party Voucher Number
                        </p>
                        <TextField
                          placeholder="Party Voucher Number"
                          name="VoucherNum"
                          value={supplyVoucherNumber}
                          error={supplyVoucherNumberErr ? true : false}
                          helperText={supplyVoucherNumberErr}
                          onChange={handleInputDataChange}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      </Grid>
                    )}

                    {partyVoucherdt === 1 && (
                      <Grid item xs={2} style={{ paddingRight: "12px", paddingBottom:"16px" }}>
                        <p className="popup-labl pb-1">Party Voucher Date</p>
                        <TextField
                          type="date"
                          placeholder="Party Voucher Date"
                          name="partyVoucherDate"
                          value={partyVoucherDate}
                          error={partyVoucherDateErr ? true : false}
                          helperText={partyVoucherDateErr}
                          // onKeyDown={(e => e.preventDefault())}
                          onChange={handleInputDataChange}
                          variant="outlined"
                          required
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    )}
                    {/* <Grid item xs={2} style={{ paddingRight: "12px" }}>
                      <p className="popup-labl pb-1">Upload Document</p>
                      <TextField
                        className={classes.input}
                        // label="Upload Document"
                        id="contained-button-file"
                        type="file"
                        inputProps={{
                          multiple: true,
                          // accept=image
                        }}
                        onChange={(event) => {
                          setDocumentUploadFile(event.target.files);
                        }}
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid> */}
                  </Grid>
                </div>
              )}
              {loading && <Loader />}
              <div className="table_full_width voucherentry-tabel-fix">
                <div
                  className="voucherentry-blog-main"
                  style={{
                    // border: "1px solid #D1D8F5",
                    paddingBottom: 5,
                    paddingInline: 20,
                  }}
                >
                  <div
                    // className="metal-tbl-head"
                    className="addsalestable-row-Voucher"
                    style={{
                      background: "#EBEEFB",
                      fontWeight: "700",
                      justifyContent: "unset",
                    }}
                  >
                    <div
                      className={clsx(classes.tableheader, "delete_icons_dv")}
                    ></div>
                    <div className={clsx(classes.tableheader)}>Cr/Dr</div>
                    <div className={clsx(classes.tableheader, "")}>Ledger</div>
                    {isFormatVertical === 1 && hsnNum === 1 && (
                      <div className={clsx(classes.tableheader, "")}>
                        HSN Number
                      </div>
                    )}
                    {/* {hsnNum === 1 && <div className={clsx(classes.tableheader, "")}>
                    (%)
                  </div>} */}
                    <div className={clsx(classes.tableheader, "")}>Amount</div>
                    {isFormatVertical === 1 &&
                      hsnNum === 1 &&
                      selectLed.state === 12 && (
                        <div className={clsx(classes.tableheader, "")}>
                          CGST(%)
                        </div>
                      )}
                    {isFormatVertical === 1 &&
                      hsnNum === 1 &&
                      selectLed.state === 12 && (
                        <div className={clsx(classes.tableheader, "")}>
                          CGST
                        </div>
                      )}
                    {isFormatVertical === 1 &&
                      hsnNum === 1 &&
                      selectLed.state === 12 && (
                        <div className={clsx(classes.tableheader, "")}>
                          SGST(%)
                        </div>
                      )}
                    {isFormatVertical === 1 &&
                      hsnNum === 1 &&
                      selectLed.state === 12 && (
                        <div className={clsx(classes.tableheader, "")}>
                          SGST
                        </div>
                      )}
                    {isFormatVertical === 1 &&
                      hsnNum === 1 &&
                      selectLed.state !== 12 && (
                        <div className={clsx(classes.tableheader, "")}>
                          IGST(%)
                        </div>
                      )}
                    {isFormatVertical === 1 &&
                      hsnNum === 1 &&
                      selectLed.state !== 12 && (
                        <div className={clsx(classes.tableheader, "")}>
                          IGST
                        </div>
                      )}
                    {isFormatVertical === 1 && hsnNum === 1 && (
                      <div className={clsx(classes.tableheader, "")}>Total</div>
                    )}
                  </div>
                  {rows.map((element, index) => (
                    <div
                      key={index}
                      className="mt-5 castum-row-dv voucher-row-dv"
                      // className="all-purchase-tabs mt-5 castum-row-dv"
                      style={{ margin: "0px", border: "1px solid #D1D8F5" }}
                    >
                      <div
                        className={clsx(classes.tableheader, "delete_icons_dv")}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isFormatVertical !== 1 && index === 0 ? (
                          ""
                        ) : (
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
                            {/* <Icon style={{ color: "red", marginTop: "8px" }}>
                            delete
                          </Icon> */}
                          </IconButton>
                        )}
                      </div>
                      <div style={{ margin: "0px" }}>
                        <Select
                          classes={classes}
                          autoFocus={index === 0 ? true : false}
                          styles={selectStyles}
                          options={creditDebitArr.map((optn) => ({
                            value: optn.value,
                            label: optn.label,
                          }))}
                          value={element.CrOrDr}
                          filterOption={createFilter({
                            ignoreAccents: false,
                          })}
                          isDisabled={objArr.format_type === 1 ? true : false}
                          onChange={(e) => handleCreditDebit(e, index)}
                          placeholder="Cr/Dr"
                        />
                        <p style={{ color: "red" }}>
                          {element.errors.CrOrDr ? element.errors.CrOrDr : ""}
                        </p>
                      </div>

                      <div>
                        <Select
                          id="ledger-select-input"
                          classes={classes}
                          styles={selectStyles}
                          options={
                            element.CrOrDr.value === 1
                              ? creditLedger.map((optn) => ({
                                  value: optn.id,
                                  label: optn.name,
                                  state: optn.state,
                                }))
                              : debitLedger.map((optn) => ({
                                  value: optn.id,
                                  label: optn.name,
                                  state: optn.state,
                                }))
                          }
                          value={element.Ledger}
                          filterOption={createFilter({
                            ignoreAccents: false,
                          })}
                          onChange={(e) => handleLedgerName(e, index)}
                          placeholder="Ledger Name"
                        />
                        <p style={{ color: "red" }}>
                          {element.errors.Ledger ? element.errors.Ledger : ""}
                        </p>
                      </div>
                      {isFormatVertical === 1 && hsnNum === 1 && (
                        <div>
                          <Select
                            classes={classes}
                            styles={selectStyles}
                            options={hsnNumberList.map((optn) => ({
                              value: optn.id,
                              label: optn.hsn_number,
                              percentage: optn.gst,
                            }))}
                            value={element.HSN}
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            onChange={(e) => handleHSN(e, index)}
                            placeholder="HSN Number"
                          />
                          <p style={{ color: "red" }}>
                            {element.errors.HSN ? element.errors.HSN : ""}
                          </p>
                        </div>
                      )}
                      {/* {hsnNum === 1 &&
                       <div>
                    <TextField
                      placeholder="(%)"
                      name="percentage"
                      value={element.HSN.percentage}
                      disabled
                      variant="outlined"
                      required
                      fullWidth
                    />
                     </div>
                  } */}
                      <TextField
                        placeholder="Amount"
                        name="Amount"
                        value={element.Amount}
                        error={element.errors.Amount ? true : false}
                        helperText={element.errors.Amount}
                        onChange={(e) => handleInputChange(e, index)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                      {isFormatVertical === 1 &&
                        hsnNum === 1 &&
                        selectLed.state === 12 && (
                          <TextField
                            placeholder="CGST(%)"
                            name="CGSTPer"
                            value={element.CGSTPer}
                            disabled
                            variant="outlined"
                            required
                            fullWidth
                          />
                        )}
                      {isFormatVertical === 1 &&
                        hsnNum === 1 &&
                        selectLed.state === 12 && (
                          <TextField
                            placeholder="CGST"
                            name="CGST"
                            value={element.CGST}
                            disabled
                            variant="outlined"
                            required
                            fullWidth
                          />
                        )}
                      {isFormatVertical === 1 &&
                        hsnNum === 1 &&
                        selectLed.state === 12 && (
                          <TextField
                            placeholder="SGST(%)"
                            name="SGST"
                            value={element.SGSTPer}
                            disabled
                            variant="outlined"
                            required
                            fullWidth
                          />
                        )}
                      {isFormatVertical === 1 &&
                        hsnNum === 1 &&
                        selectLed.state === 12 && (
                          <TextField
                            placeholder="SGST"
                            name="SGST"
                            value={element.SGST}
                            disabled
                            variant="outlined"
                            required
                            fullWidth
                          />
                        )}
                      {isFormatVertical === 1 &&
                        hsnNum === 1 &&
                        selectLed.state !== 12 && (
                          <TextField
                            placeholder="IGST(%)"
                            name="IGST"
                            value={element.IGSTPer}
                            variant="outlined"
                            required
                            disabled
                            fullWidth
                          />
                        )}
                      {isFormatVertical === 1 &&
                        hsnNum === 1 &&
                        selectLed.state !== 12 && (
                          <TextField
                            placeholder="IGST"
                            name="IGST"
                            value={element.IGST}
                            variant="outlined"
                            required
                            disabled
                            fullWidth
                          />
                        )}
                      {isFormatVertical === 1 && hsnNum === 1 && (
                        <TextField
                          placeholder="0.000"
                          name="Total"
                          disabled
                          value={element.Total}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                    </div>
                  ))}
                  {isFormatVertical === 1 && (
                    <div
                      className="metal-tbl-head"
                      style={{ background: "#D1D8F5", fontWeight: "700" }}
                    >
                      <div
                        className={clsx(classes.tableheader, "delete_icons_dv")}
                      ></div>
                      <div className={clsx(classes.tableheader)}></div>
                      <div className={clsx(classes.tableheader, "")}></div>
                      {isFormatVertical === 1 && hsnNum === 1 && (
                        <div className={clsx(classes.tableheader, "")}></div>
                      )}
                      {/* {hsnNum === 1 && <div className={clsx(classes.tableheader, "")}>
                    
                  </div>} */}
                      <div className={clsx(classes.tableheader, "")}>
                        {HelperFunc.getTotalOfField(rows, "Amount")}
                      </div>
                      {isFormatVertical === 1 &&
                        hsnNum === 1 &&
                        selectLed.state === 12 && (
                          <div className={clsx(classes.tableheader, "")}></div>
                        )}
                      {isFormatVertical === 1 &&
                        hsnNum === 1 &&
                        selectLed.state === 12 && (
                          <div className={clsx(classes.tableheader, "")}>
                            {HelperFunc.getTotalOfField(rows, "CGST")}
                          </div>
                        )}
                      {isFormatVertical === 1 &&
                        hsnNum === 1 &&
                        selectLed.state === 12 && (
                          <div className={clsx(classes.tableheader, "")}></div>
                        )}
                      {isFormatVertical === 1 &&
                        hsnNum === 1 &&
                        selectLed.state === 12 && (
                          <div className={clsx(classes.tableheader, "")}>
                            {HelperFunc.getTotalOfField(rows, "SGST")}
                          </div>
                        )}
                      {isFormatVertical === 1 &&
                        hsnNum === 1 &&
                        selectLed.state !== 12 && (
                          <div className={clsx(classes.tableheader, "")}></div>
                        )}
                      {isFormatVertical === 1 &&
                        hsnNum === 1 &&
                        selectLed.state !== 12 && (
                          <div className={clsx(classes.tableheader, "")}>
                            {HelperFunc.getTotalOfField(rows, "IGST")}
                          </div>
                        )}
                      {isFormatVertical === 1 && hsnNum === 1 && (
                        <div className={clsx(classes.tableheader, "")}>
                          {HelperFunc.getTotalOfField(rows, "Total")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* {narrationReq === 1 && (
                <Grid
                  item
                  xs={6}
                  sm={4}
                  md={3}
                  key="1"
                  style={{ paddingLeft: 20 }}
                >
                  <p className="popup-labl pb-1">Narration</p>
                  <TextField
                    // className="mt-16"
                    placeholder="Narration"
                    name="narration"
                    value={narration}
                    error={narrationErr ? true : false}
                    helperText={narrationErr}
                    onChange={handleInputDataChange}
                    variant="outlined"
                    required
                    multiline
                    fullWidth
                    maxRows="3"
                  />
                </Grid>
              )}
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                style={{ textAlign: "right", paddingRight: 20 }}
              >
                <Button
                  variant="contained"
                  // color="primary"
                  className={classes.button}
                  style={{ float: "right", marginBottom: 20}}
                  size="small"
                  // className="w-224 mx-auto btn-print-save"
                  // aria-label="Register"
                  onClick={(e) => {
                    handleFormSubmit(e);
                  }}
                >
                  Save
                </Button>
              </Grid> */}

              <Grid container style={{paddingTop: 7, marginBottom: 20}}>
                {narrationReq === 1 && (
                  <Grid
                    item
                    xs={4}
                    style={{ paddingLeft: 20}}
                  >
                    <p className="popup-label pb-1">Narration</p>
                    <TextField
                    style={{marginBottom: 20}}
                      placeholder="Narration"
                      name="narration"
                      value={narration}
                      error={narrationErr ? true : false}
                      helperText={narrationErr}
                      onChange={handleInputDataChange}
                      variant="outlined"
                      required
                      multiline
                      fullWidth
                      maxRows={3}
                    />
                  </Grid>
                )}
                <Grid
                  item
                  xs={12}
                  style={{ paddingRight: 20, display:"flex", alignItems:"center", justifyContent:"flex-end"}}
                >
                  <Button
                     variant="contained"
                     style={{marginBlock: 0}}
                     className={classes.button}
                     size="small"
                     onClick={(e) => {
                       handleFormSubmit(e);
                     }}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>

              {/* {taxInclude &&
                <>
                  <div
                    className="mt-16 ml-16"
                    style={{ border: "1px solid #D1D8F5", paddingBottom: 5, marginRight: "18px" }}
                  >
                    <div
                      className="addsalestable-row"
                      // className="metal-tbl-head"
                      style={{ background: "#EBEEFB", fontWeight: "700" }}
                    >
                      <div className={classes.tableheader}>Voucher Number</div>

                      <div className={classes.tableheader}>Taxation Ledger</div>

                      <div className={classes.tableheader}>Ledger Name</div>

                      <div className={classes.tableheader}>(%)</div>

                      <div className={classes.tableheader}>Amount</div>
                    </div>

                    <div className="mt-5 table-row-source">

                      <TextField
                        className="ml-2"
                        value={voucherName}
                        variant="outlined"
                        fullWidth
                        disabled
                      />

                      <TextField
                        className="ml-2"
                        value={taxTcsTds === 1 ? "TCS" : "TDS"}
                        variant="outlined"
                        fullWidth
                        disabled
                      />

                      <Select
                        classes={classes}
                        styles={selectStyles}
                        options={selectedLedTax.map((optn) => ({
                          value: optn.ledger_id,
                          label: optn.TexationLedgerDetails.name,
                        }))}
                        value={ledgerSelectedTax}
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        onChange={(e) => handleLedTaxChange(e)}
                        placeholder="Ledger Name"
                        isDisabled={rows[0].Amount === ""}
                      />
                      <span style={{ color: "red" }}>
                        {ledgerSelectedTaxErr.length > 0 ? ledgerSelectedTaxErr : ""}
                      </span>

                      <TextField
                        className="ml-2"
                        value={selectedTaxLedRate}
                        variant="outlined"
                        fullWidth
                        disabled
                      />

                      <TextField
                        name="ledgerAmount"
                        className="ml-2"
                        value={calculatedLedAmount}
                        error={ledgerAmtErr.length > 0 ? true : false}
                        helperText={ledgerAmtErr}
                        onChange={(e) => handleInputDataChange(e)}
                        variant="outlined"
                        fullWidth
                        disabled={ledgerSelectedTax === "" ? true : false}
                      />
                    </div>
                  </div>
                  <div
                    className="mt-16 ml-16 p-head meta-final-amoount meta-final-amoount-dv"
                    style={{
                      border: "1px solid #D1D8F5",
                      background: "#EBEEFB",
                      fontWeight: "700",
                      justifyContent: "end",
                      display: "flex",
                      marginRight: "18px",
                      // float: "right"
                    }}
                  >
                    <div className="metal-tbl-head addmetal-head">
                      <label>Final Amount :</label>
                      <label style={{borderRadius:7}}> {finalAmoutTotal} </label>
                    </div>
                  </div>
                </>
              } */}
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default VoucherEntryRetailer;

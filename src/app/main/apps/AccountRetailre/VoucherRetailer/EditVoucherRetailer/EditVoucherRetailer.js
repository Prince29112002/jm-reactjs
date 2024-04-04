import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { TextField,  Icon, IconButton, Tabs, Tab, AppBar } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Select, { createFilter } from "react-select";
import History from "@history";
import { Typography, Checkbox, FormControl, FormControlLabel } from "@material-ui/core";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Loader from '../../../../Loader/Loader';
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import moment from "moment";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
  },
}));

const EditVoucherRetailer = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [voucherNum, setVoucherNum] = useState("");
  const [nameOfVoucher, setNameOfVoucher] = useState("");
  const [nameOfVoucherErr, setNameOfVoucherErr] = useState("");

  const [startDate, setStartDate] = useState("");
  const [startDateErr, setStartDateErr] = useState("");

  const [startingVoucherNum, setStartingVoucherNum] = useState("");
  const [startingVoucherNumErr, setStartingVoucherNumErr] = useState("");

  const [prefix, setPrefix] = useState("");
  const [prefixErr, setPrefixErr] = useState("");

  const [month, setMonth] = useState("");
  const [monthErr, setMonthErr] = useState("");

  const [year, setYear] = useState("");
  const [yearErr, setYearErr] = useState("");

  const [numDigit, setNumDigit] = useState("");
  const [numDigitErr, setNumDigitErr] = useState("");

  const [format, setFormat] = useState("");
  const [formatErr, setFormatErr] = useState("");

  const [verticalFormatTop, setVerticalFormatTop] = useState("");
  const [verticalFormatTopErr, setVerticalFormatTopErr] = useState("");

  const [taxLedInclude, setTaxLedInclude] = useState(0);

  const [taxLedger, setTaxLedger] = useState("");
  const [taxLedgerName, setTaxLedgerName] = useState("");
  const [taxLedgerNameErr, setTaxLedgerNameErr] = useState("");
  const [gst, setGst] = useState("");
  const [gstLedgerList, setGstLedgerList] = useState([]);
  const [gstLedger, setGstLedger] = useState("");
  const [gstLedgerErr, setGstLedgerErr] = useState("");

  const [suppVoucher, setSuppVoucher] = useState(0);
  const [otherVoucher, setOtherVoucher] = useState(0);
  const [hsnNumber, setHsnNumber] = useState(0);
  const [narration, setNarration] = useState(0);
  const [backDate, setBackDate] = useState(0);
  const [deleteAllow, setDeleteAllowed] = useState(0);
  const [GSTRequired, setGSTRequired] = useState(0);
  const [partyVoucherDate, setPartyVoucherDate] = useState(0);

  const [backDateDays, setBackDateDays] = useState("");
  const [backDtDaysErr, setBackDtDaysErr] = useState("");

  const [voucherDelDays, setVoucherDelDays] = useState("");
  const [voucherDelDaysErr, setVoucherDelDaysErr] = useState("");

  const [selectedSubCredit, setSelectedSubCredit] = useState([]);
  const [voucherToCreditErr, setVoucherToCreditErr] = useState("");

  const [voucherToDebitErr, setVoucherToDebitErr] = useState("");
  const [selectedSubDebit, setSelectedSubDebit] = useState([]);

  const debitValue = [];
  const creditValue = [];

  const [ledgerList, setLedgerList] = useState([]);
  const [voucherSettingDetails, setVoucherSettingDetails] = useState([]);
  const [modalView, setModalView] = useState(false);
  const [preDefined, setPreDefined] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [view, setView] = useState(false)
  const [updateId, setUpdateId] = useState("");
  const [groupTree, setGroupTree] = useState([]);
  const [mainEdit, setMainEdit] = useState(false);
  const [financialStartDate, setFinancialStartDate] = useState("")
  const [financialEndDate, setFinancialEndDate] = useState("")

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    NavbarSetting('Accounts-Retailer',dispatch)
  }, [])

  useEffect(() => {
    if (props.location.state) {
      getVoucherData();
      calculateFinancialYear();
      setView(props.location.state.isView)
      setMainEdit(props.location.state.isEdit)
    }
  }, [dispatch]);

  function getVoucherData() {
    setLoading(true);
    const v_id = props.location.state.id;
    axios
      .get(Config.getCommonUrl() + `retailerProduct/api/vouchersettingdetail/${v_id}`)
      .then((res) => {
        console.log(res);
        const arrData = res.data.data[0];
        const generalArr = arrData.VoucherSettingDetails;       
        setNameOfVoucher(arrData.name);
        setVoucherNum(arrData.id);
        setStartDateErr("")
        setVoucherSettingDetails(arrData.VoucherSettingDetails);
        setPreDefined(arrData.pre_defined)
        if (arrData.pre_defined == 0) {
          getGroupTree()
        }
        if (generalArr.length > 0) {
          const data = generalArr[0];
          setStartDate(data.start_date)
          setUpdateId(data.id)
          setEdit(true)
          setStartingVoucherNum(data.start_voucher_from)
          setPrefix(data.prefix)
          setNumDigit(data.numb_digit)
          setYear({
            value: data.is_year,
            label: data.is_year === 1 ? 'Yes' : 'No'
          })
          setMonth({
            value: data.is_month,
            label: data.is_month === 1 ? 'Yes' : 'No'
          })
          setFormat({
            value: data.format_type,
            label: data.format_type === 1 ? "Vertical voucher format" : "Journal Entries"
          })
          setVerticalFormatTop({
            value: data.vertical_formats_on_top,
            label: data.vertical_formats_on_top === 1 ? "Credit" : "Debit"
          })
          setTaxLedInclude(data.taxation_ledger_include)
          if (data.taxation_ledger_include === 1) {
            getLedgerGroup(data.taxation_ledger)
            setTaxLedger({
              value: data.taxation_ledger,
              label: data.taxation_ledger === 1 ? "TCS" : "TDS"
            })
            const ledArr = []
            data.VoucherLedger.map((item)=>{
              ledArr.push({
                value: item.ledger_id,
                label: item.TexationLedgerDetails.name
              })
            })
            setTaxLedgerName(ledArr)
          }
          setGst(data.gst)
          if (data.gst === 1) {
            getLedgerGroup(3)
            setGstLedger({
              value: data.gst_ledger_id,
              label: data.GstLedgerDetails.name
            })
          }
          setSuppVoucher(data.require_supplier_voucher_no)
          setPartyVoucherDate(data.require_party_voucher_date)
          setOtherVoucher(data.required_other_voucher_no)
          setHsnNumber(data.require_hsn_no)
          setNarration(data.require_narration)
          setBackDate(data.back_date_entry)
          setDeleteAllowed(data.allowed_delete)
          setGSTRequired(data.req_gst_credit_date)
          setBackDateDays(data.back_entry_days)
          setVoucherDelDays(data.delete_allowed_days)
          // const crArr = data.VoucherToCreditGroup.map((item) => {
          //   return {
          //     value: item.voucher_to_creadit,
          //     label: item.LedgerDetails.name,
          //     ledger: true
          //   }
          // })
          if (data.credit_json !== null) {
            const crArr = JSON.parse(data.credit_json)
            setSelectedSubCredit(crArr)
          }
          if (data.debit_json !== null) {
            const drArr = JSON.parse(data.debit_json)
            setSelectedSubDebit(drArr)
          }
          // const drArr = data.VoucherToDebitGroup.map((item) => {
          //   return {
          //     value: item.voucher_to_debit,
          //     label: item.LedgerDetails.name,
          //     ledger: true
          //   }
          // })

        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: `retailerProduct/api/vouchersettingdetail/${v_id}` })
      });
  }

  function calculateFinancialYear(){
      var curMonth = moment().month();
      var curYear = moment().year();
      var  start =  "";
      var  end = "";
      
      if (curMonth > 2) { 
          start = (curYear) + "-04-01";
          end = (curYear + 1) + "-03-31";
      } else {
          start = (curYear - 1) + "-04-01";
          end = (curYear) + "-03-31";
      }
    setFinancialStartDate(start)
    setFinancialEndDate(end)
  }

  function getLedgerGroup(id) {
    axios
      .get(Config.getCommonUrl() + `retailerProduct/api/ledger/tds/${id}`)
      .then((res) => {
        console.log(res);
        if (id === 3) {
          setGstLedgerList(res.data.data)
        } else {
          setLedgerList(res.data.data);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `retailerProduct/api/ledger/tds/${id}` })
      });
  }

  function getGroupTree() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/group/group/tree")
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const data = res.data.data;
          const nodes = []
          data.map(i => {
            i.GroupLedger = i.GroupLedger == null ? [] : i.GroupLedger
            i.GroupLedger = i.GroupLedger.map(i => {
              return {
                value: i.id,
                label: i.name,
                ledger: i.GroupLedger == null ? true : false,
                parent_id : i.parent_id
              }
            })
            if (i.parent_id === null) {
              nodes.push({
                value: i.id,
                label: i.name,
                ledger: i.GroupLedger == null ? true : false,
                children: i.GroupLedger == null ? [] : i.GroupLedger,
                parent_id : i.parent_id
              })
            } else {
              if (i[i.id].parent_id === null) {
                const index = nodes.findIndex(item => item.value === i.parent_id);
                if (index > -1) {
                  nodes[index].children.push({
                    value: i.id,
                    label: i.name,
                    ledger: i.GroupLedger == null ? true : false,
                    children: i.GroupLedger == null ? [] : i.GroupLedger,
                    parent_id : i.parent_id
                  })
                }

              } else {
                const index = nodes.findIndex(item => item.value === i[i.id].parent_id);
                if (index > -1) {
                  const innerindex = nodes[index].children.findIndex(item => item.value === i.parent_id);
                  nodes[index].children[innerindex].children.push({
                    value: i.id,
                    label: i.name,
                    ledger: i.GroupLedger == null ? true : false,
                    children: i.GroupLedger == null ? [] : i.GroupLedger,
                    parent_id : i.parent_id
                  })
                }
              }
            }
          })
          setGroupTree(nodes)
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "retailerProduct/api/group/group/tree" })

      });
  }

  function getChildById(node, value) {
    let array = [];

    function getAllChild(nodes) {
      if (nodes === null) return [];
      array.push(nodes);
      if (Array.isArray(nodes.children)) {
        nodes.children.forEach((node) => {
          array = [...array, ...getAllChild(node)];
          array = array.filter((v, i) => array.indexOf(v) === i);
        });
      }
      return array;
    }

    function getNodeById(nodes, value) {
      if (nodes.value === value) {
        return nodes;
      } else if (Array.isArray(nodes.children)) {
        let result = null;
        nodes.children.forEach((node) => {
          if (!!getNodeById(node, value)) {
            result = getNodeById(node, value);
          }
        });
        return result;
      }

      return null;
    }

    return getAllChild(getNodeById(node, value));
  }

  function getOnChange(checked, nodes) {
    const allNode = getChildById(nodes, nodes.value);

    let array = checked
      ? [...selectedSubDebit, ...allNode]
      // : selectedSubDebit.filter((value) => !allNode.includes(value));
      : selectedSubDebit.filter(array => allNode.every(filter => (!(filter.value === array.value && filter.label === array.label))))

   

    array = array.filter((v, i) => array.indexOf(v) === i);
     setVoucherToDebitErr("")
    setSelectedSubDebit(array);
  }

  function renderTree(nodes) {
    return (
      nodes.map((x, i) => (
        <TreeItem
          key={`rtree-${i}`}
          nodeId={`Node-${i}-${x.value.toString()}`}
          // nodeId={x.value.toString()}
          label={
            <FormControlLabel
              control={
                <Checkbox
                  disabled={view}
                  checked={selectedSubDebit.some((item) => item.value === x.value && item.label === x.label)}
                  onChange={(event) =>
                    getOnChange(event.currentTarget.checked, x)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
              }
              label={<>{x.label}</>}
              key={x.value}
            />
          }
        >
          {Array.isArray(x.children) ? renderTree(x.children) : null}
        </TreeItem>
      ))
    )
  }

  function getChildByCreditId(node, value) {
    let array = [];

    function getAllCreditChild(nodes) {
      if (nodes === null) return [];
      array.push(nodes);
      if (Array.isArray(nodes.children)) {
        nodes.children.forEach((node) => {
          array = [...array, ...getAllCreditChild(node)];
          array = array.filter((v, i) => array.indexOf(v) === i);
        });
      }
      return array;
    }

    function getNodeByCreditId(nodes, value) {
      if (nodes.value === value) {
        return nodes;
      } else if (Array.isArray(nodes.children)) {
        let result = null;
        nodes.children.forEach((node) => {
          if (!!getNodeByCreditId(node, value)) {
            result = getNodeByCreditId(node, value);
          }
        });
        return result;
      }

      return null;
    }

    return getAllCreditChild(getNodeByCreditId(node, value));
  }

  function getOnCreditChange(checked, nodes) {
    const allNode = getChildByCreditId(nodes, nodes.value);
    let array = checked
      ? [...selectedSubCredit, ...allNode]
      // : selectedSubCredit.filter((value) => !allNode.includes(value));
      : selectedSubCredit.filter(array => allNode.every(filter => (!(filter.value === array.value && filter.label === array.label))))

    array = array.filter((v, i) => array.indexOf(v) === i);
    setVoucherToCreditErr("")
    setSelectedSubCredit(array);
  }

  function renderCreditTree(nodes) {
    return nodes.map((x, i) => (
      <TreeItem
        key={`rtree-${i}`}
        nodeId={`Node-${i}-${x.value.toString()}`}
        // nodeId={x.value.toString()}
        label={
          <FormControlLabel
            control={
              <Checkbox
                disabled={view}
                checked={selectedSubCredit.some((item) => item.value === x.value && item.label === x.label)}
                onChange={(event) =>
                  getOnCreditChange(event.currentTarget.checked, x)
                }
                onClick={(e) => e.stopPropagation()}
              />
            }
            label={<>{x.label}</>}
            key={x.value}
          />
        }
      >
        {Array.isArray(x.children) ? renderCreditTree(x.children) : null}
      </TreeItem>
    ))
  }

  const handleNewAdd = () => {
    setEdit(false)
    setUpdateId("")
    setStartDate("");
    setStartingVoucherNum("");
    setPrefix("");
    setMonth("");
    setYear("");
    setNumDigit("");
  }

  const editHandler = (id,i) => {
    if (id) {
      setLoading(true);
      setUpdateId(id)
      const v_id = props.location.state.id;
      axios.get(Config.getCommonUrl() + `retailerProduct/api/vouchersettingdetail/${v_id}/${id}`)
        .then((response) => {
          console.log(response);
          setModalView(false);
          if(i==0 && mainEdit){
            setView(false);
            setEdit(true);
          }else{
            setView(true);
            setEdit(true);
          }
          setStartDateErr("");
          const data = response.data.data;
          setStartDate(data.start_date);
          setPrefix(data.prefix);
          setYear({
            value: data.is_year,
            label: data.is_year === 1 ? 'Yes' : 'No'
          })
          setMonth({
            value: data.is_month,
            label: data.is_month === 1 ? 'Yes' : 'No'
          })
          setNumDigit(data.numb_digit)
          setStartingVoucherNum(data.start_voucher_from);
          setFormat({
            value: data.format_type,
            label: data.format_type === 1 ? "Vertical voucher format" : "Journal Entries"
          })
          setVerticalFormatTop({
            value: data.vertical_formats_on_top,
            label: data.vertical_formats_on_top === 1 ? "Credit" : "Debit"
          })
          setTaxLedInclude(data.taxation_ledger_include)
          if (data.taxation_ledger_include === 1) {
            setTaxLedger({
              value: data.taxation_ledger,
              label: data.taxation_ledger === 1 ? "TCS" : "TDS"
            })
            const ledArr = []
            data.VoucherLedger.map((item)=>{
              ledArr.push({
                value: item.ledger_id,
                label: item.TexationLedgerDetails.name
              })
            })
            setTaxLedgerName(ledArr)
          }
          setGst(data.gst)
          if (data.gst === 1) {
            setGstLedger({
              value: data.gst_ledger_id,
              label: data.GstLedgerDetails.name
            })
          }
          setSuppVoucher(data.require_supplier_voucher_no)
          setPartyVoucherDate(data.require_party_voucher_date)
          setOtherVoucher(data.required_other_voucher_no)
          setHsnNumber(data.require_hsn_no)
          setNarration(data.require_narration)
          setBackDate(data.back_date_entry)
          setDeleteAllowed(data.allowed_delete)
          setGSTRequired(data.req_gst_credit_date)
          setBackDateDays(data.back_entry_days)
          setVoucherDelDays(data.delete_allowed_days)
          // const crArr = data.VoucherToCreditGroup.map((item) => {
          //   return {
          //     value: item.voucher_to_creadit,
          //     label: item.LedgerDetails?.name,
          //     ledger: true
          //   }
          // })
          if (data.credit_json !== null) {
            const crArr = JSON.parse(data.credit_json)
            setSelectedSubCredit(crArr)
          }
          if (data.debit_json !== null) {
            const drArr = JSON.parse(data.debit_json)
            setSelectedSubDebit(drArr)
          }
          // const drArr = data.VoucherToDebitGroup.map((item) => {
          //   return {
          //     value: item.voucher_to_debit,
          //     label: item.LedgerDetails?.name,
          //     ledger: true
          //   }
          // })
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          handleError(error, dispatch, { api: `retailerProduct/api/vouchersettingdetail/${v_id}/${id}` })
        })
    }
  }

  const monthOpt = [
    { value: 0, label: "No" },
    { value: 1, label: "Yes" },
  ];

  const handleMonth = (value) => {
    setMonth(value);
    setMonthErr("");
  };

  const handleYear = (value) => {
    setYear(value);
    setYearErr("");
  };

  const voucherOption = [
    { value: 0, label: "Journal Entries" },
    { value: 1, label: "Vertical voucher format" },
  ];

  const handleFormat = (value) => {
    setFormat(value);
    setFormatErr("");
    setVerticalFormatTop("");
  };

  const whatOnTop = [
    { value: 0, label: "Debit" },
    { value: 1, label: "Credit" },
  ];

  const handleWhatOnTop = (value) => {
    setVerticalFormatTop(value);
    setVerticalFormatTopErr("");
  };

  const taxLedgerArr = [
    { value: 1, label: "TCS" },
    { value: 2, label: "TDS" },
  ];

  const handleTaxLedger = (value) => {
    setLedgerList([]);
    setTaxLedger(value);
    setTaxLedgerNameErr("");
    getLedgerGroup(value.value);
  };

  const handleLedName = (value) => {
    setTaxLedgerName(value);
    setTaxLedgerNameErr("");
  };

  const handlegstLedName = (value) => {
    setGstLedger(value);
    setGstLedgerErr("");
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

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("YYYY-MM-DD");

    if (name === "nameOfVoucher") {
      setNameOfVoucherErr("");
      setNameOfVoucher(value);
    } else if (name === "startDate") {
      setStartDate(value);
      // today.setHours(0,0,0,0);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      if (dateVal <= today && minDateVal < dateVal) {
        setStartDateErr("");
      } else {
        setStartDateErr("Enter Valid Date");
      }
    } else if (name === "startingVoucherNum") {
      setStartingVoucherNumErr("");
      setStartingVoucherNum(value);
    } else if (name === "prefix") {
      setPrefix(value);
      setPrefixErr("");
    } else if (name === "numDigit") {
      setNumDigit(value);
      if (value != 0 && !isNaN(value) && value !== "" && value.length < 3) {
        setNumDigitErr("");
      } else {
        setNumDigitErr("Enter valid number digit");
      }
    } else if (name === "taxLedInclude") {
      value === true ? setTaxLedInclude(1) : setTaxLedInclude(0);
    } else if (name === "suppVoucher") {
      value === true ? setSuppVoucher(1) : setSuppVoucher(0);
    }  else if (name === "partyVoucherDate") {
      value === true ? setPartyVoucherDate(1) : setPartyVoucherDate(0);
    }else if (name === "otherVoucher") {
      value === true ? setOtherVoucher(1) : setOtherVoucher(0);
    } else if (name === "hsnNumber") {
      value === true ? setHsnNumber(1) : setHsnNumber(0);
    } else if (name === "narration") {
      value === true ? setNarration(1) : setNarration(0);
    } else if (name === "backDate") {
      value === true ? setBackDate(1) : setBackDate(0);
      if (value === false) {
        setBackDateDays("")
      }
    } else if (name === "backDateDays") {
      if(!isNaN(Number(value))) {
        setBackDateDays(value);
        setBackDtDaysErr("");
      }
    } else if (name === "deleteAllow") {
      value === true ? setDeleteAllowed(1) : setDeleteAllowed(0);
      if (value === false) {
        setVoucherDelDays("")
      }
    } else if (name === "voucherDelDays") {
      if(!isNaN(Number(value))) {
        setVoucherDelDays(value);
        setVoucherDelDaysErr("");
      }
    } else if (name === "GSTRequired") {
      value === true ? setGSTRequired(1) : setGSTRequired(0);
    } else if (name === "gst") {
      value === true ? setGst(1) : setGst(0);
      if (value) {
        getLedgerGroup(3)
      }
    }
  };

  function validateNameofVoucher() {
    if (nameOfVoucher === "") {
      // setTabView(0)
      setNameOfVoucherErr("Please enter a voucher name");
      return false;
    }
    return true;
  }

  function validateStartDate() {
    if (startDate === "") {
      // setTabView(0)
      setStartDateErr("Enter valid start date");
      return false;
    }
    return true;
  }

  function validateStartingVnum() {
    if (startingVoucherNum === "") {
      // setTabView(0)
      setStartingVoucherNumErr("Please enter starting Voucher Number");
      return false;
    }
    return true;
  }

  function validatePrefix() {
    if (prefix === "") {
      // setTabView(0)
      setPrefixErr("Please enter prefix");
      return false;
    }
    return true;
  }

  function validateMonth() {
    if (month === "") {
      // setTabView(0)
      setMonthErr("Please select yes to month");
      return false;
    }
    return true;
  }

  function validateYear() {
    if (year === "") {
      // setTabView(0)
      setYearErr("Please select yes to year");
      return false;
    }
    return true;
  }

  function validateNumDigit() {
    if (numDigit === "") {
      // setTabView(0)
      setNumDigitErr("Please enter valid number of digit");
      return false;
    }
    return true;
  }

  function validateVoucherFormat() {
    if (format === "") {
      // setTabView(1)
      setFormatErr("Please select voucher format");
      return false;
    } else {
      if (format.value === 1 && verticalFormatTop === "") {
        // setTabView(1)
        setVerticalFormatTopErr("Please select what on top");
        return false;
      }
      return true;
    }
  }

  function validatePreDefine() {
    if (preDefined === null || preDefined !== 1) {
      if (validateVoucherFormat() &&
        validTaxInclude() &&
        validateGstLed() &&
        debitValidation() &&
        creditvalidation()
      ) {
        return true;
      } else {
        // if (tabView === 0) {
        //   // setTabView(1);
        // }
      }
    } else {
      return true;
    }
  }

  function validateTaxLed() {
    if (taxLedger === "" || taxLedgerName === "") {
      setTaxLedgerNameErr("Please select tax type and Ledger name");
      return false;
    }
    return true;
  }

  function validTaxInclude() {
    if (taxLedInclude === 1) {
      if (validateTaxLed()) {
        return true;
      }
    } else {
      return true;
    }
  }

  function validateGstLed() {
    if (gst === 1) {
      if (validateGSTLed()) {
        return true;
      }
    } else {
      return true;
    }
  }

  function validateGSTLed() {
    if (gstLedger === "") {
      setGstLedgerErr("Please select GST Ledger");
      return false;
    }
    return true;
  }

  function validatebackdate() {
    if (backDate === 1) {
      if (backDateValidation()) {
        return true;
      }
    } else {
      return true;
    }
  }

  function validateVoucherdeletedate() {
    if (deleteAllow === 1) {
      if (deleteDaysValidate()) {
        return true;
      }
    } else {
      return true;
    }
  }

  function debitValidation() {
    if (selectedSubDebit.length === 0) {
      setVoucherToDebitErr("Please slect what to debit");
      return false;
    }
    return true;
  }

  function creditvalidation() {
    if (selectedSubCredit.length === 0) {
      setVoucherToCreditErr("Please slect what to credit");
      return false;
    }
    return true;
  }

  function callthismonth() {
    const thismonth = new Date().getMonth() + 1;
    if (thismonth === 10 || thismonth === 11 || thismonth === 12) {
      var ans = thismonth;
    } else {
      var ans = `0${thismonth}`
    }
    return `${ans}/`;
  }

  function callthisyear() {
    var curMonth = moment().month();
    const currentYear = (moment().year() + "").slice(-2);
    const nextYear = ((moment().year() + 1) + "").slice(-2);
    const prevYear = ((moment().year() - 1) + "").slice(-2);
    var thisyear = ""

    if(curMonth > 2){
      thisyear = `${currentYear}-${nextYear}`;
    }else{
      thisyear = `${prevYear}-${currentYear}`;
    }
    return `${thisyear}/`;
  }

  function callTotalnum() {
    var counter = "";
    var digit = 0;
    for (let i = 1; i < numDigit; i++) {
      counter += digit;
    }
    var startingVoucherN = `${startingVoucherNum}`
    startingVoucherN = (startingVoucherN * 1).toString();
    return `${counter}${startingVoucherN}`;
  }

  function backDateValidation() {
    let regex = /^[1-5]{1}$/;
    if (!backDateDays || regex.test(backDateDays) === false) {
      setBackDtDaysErr("Enter Valid Days(max 5 days)");
      return false;
    }
    return true;
  }

  function deleteDaysValidate() {
    let regex = /^[1-5]{1}$/;
    if (!voucherDelDays || regex.test(voucherDelDays) === false) {
      setVoucherDelDaysErr("Enter Valid Days(max 5 days)");
      return false;
    }
    return true;
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (
      validateStartDate() &&
      validatePrefix() &&
      validateMonth() &&
      validateYear() &&
      validateNumDigit() &&
      validateStartingVnum() && 
      validatePreDefine() &&
      validatebackdate() &&
      validateVoucherdeletedate() 
    ) {
      callAddVoucherApi();
    }
  }

  function callAddVoucherApi() {
    selectedSubDebit.map((curVal) => {
      if (curVal.ledger && !debitValue.includes(curVal.value)) {
        debitValue.push(curVal.value);
      }
    });
    selectedSubCredit.map((curVal) => {
      if (curVal.ledger && !creditValue.includes(curVal.value)) {
        creditValue.push(curVal.value);
      }
    });
    const ledArr = [];
    taxLedgerName.length > 0 && taxLedgerName.map((item)=>{
      ledArr.push(item.value)
    })
    if (edit) {
      var body = {
        format_type: format.value,
        vertical_formats_on_top: verticalFormatTop.value,
        taxation_ledger_include: taxLedInclude,
        taxation_ledger: taxLedger.value,
        ledger_id: ledArr,
        require_supplier_voucher_no: suppVoucher,
        require_hsn_no: hsnNumber,
        gst: gst,
        gst_ledger_id: gstLedger.value,
        required_other_voucher_no: otherVoucher,
        require_narration: narration,
        back_date_entry: backDate,
        back_entry_days: backDateDays,
        allowed_delete: deleteAllow,
        delete_allowed_days: voucherDelDays,
        req_gst_credit_date: GSTRequired,
        VoucherToCreditGroup: creditValue,
        VoucherToDebitGroup: debitValue,
        debit_json: selectedSubDebit,
        credit_json: selectedSubCredit,
        require_party_voucher_date: partyVoucherDate
      }
      var api = `retailerProduct/api/vouchersettingdetail/update/${voucherNum}/${updateId}`;
    } else {
      var body = {
        start_date: startDate,
        name: nameOfVoucher,
        prefix: prefix,
        is_month: month.value,
        is_year: year.value,
        numb_digit: numDigit,
        start_voucher_from: startingVoucherNum,
        format_type: format.value,
        vertical_formats_on_top: verticalFormatTop.value,
        taxation_ledger_include: taxLedInclude,
        taxation_ledger: taxLedger.value,
        ledger_id: ledArr,
        gst: gst,
        gst_ledger_id: gstLedger.value,
        require_supplier_voucher_no: suppVoucher,
        require_hsn_no: hsnNumber,
        required_other_voucher_no: otherVoucher,
        require_narration: narration,
        back_date_entry: backDate,
        back_entry_days: backDateDays,
        allowed_delete: deleteAllow,
        delete_allowed_days: voucherDelDays,
        req_gst_credit_date: GSTRequired,
        VoucherToCreditGroup: creditValue,
        VoucherToDebitGroup: debitValue,
        debit_json: selectedSubDebit,
        credit_json: selectedSubCredit,
        require_party_voucher_date: partyVoucherDate
      };
      var api = `retailerProduct/api/vouchersettingdetail/${voucherNum}`
    }
    axios
      .put(
        Config.getCommonUrl() + api,
        body
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          if (edit) {
            dispatch(
              Actions.showMessage({ message: "Voucher Updated Successfully", variant: "success"})
            );
          } else {
            dispatch(
              Actions.showMessage({ message: "Voucher Added Successfully", variant: "success"})
            );
          }
          // getVoucherData();
          setStartDate("");
          setStartingVoucherNum("");
          setPrefix("");
          setMonth("");
          setYear("");
          setNumDigit("");
          setFormat("");
          setVerticalFormatTop("");
          setTaxLedInclude(0);
          setTaxLedger("");
          setTaxLedgerName("");
          setSuppVoucher(0);
          setOtherVoucher(0);
          setHsnNumber(0);
          setNarration(0);
          setLedgerList([]);
          setVoucherSettingDetails([]);
          setModalView(false);
          setBackDateDays("");
          setVoucherDelDays("");
          setSelectedSubCredit([]);
          setSelectedSubDebit([]);
          setGst("");
          setGstLedger("")
          setGstLedgerList([]);
          setBackDate(0);
          setDeleteAllowed(0);
          setGSTRequired(0);
          setPartyVoucherDate(0);
          History.goBack();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: api, body: body })
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            <Grid
             container
             alignItems="center"
             style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
            >
              <Grid item xs={6} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    {mainEdit ? "Edit Voucher" : view ? "View Voucher" : "Create Voucher"}
                  </Typography>
                </FuseAnimate>
              </Grid>
            
            <Grid item xs={6} key="2">
                <div className="btn-back">
                  {" "}
                  <Button
                    id="btn-back"
                    className=""
                    size="small"
                    onClick={(event) => {
                      History.goBack();
                    }}
                  >
                    <img
                      src={Icones.arrow_left_pagination}
                      className="back_arrow"
                      alt=""
                    />
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll ">
            <div className="pb-32 editvoucher_blg_dv">
            {/* <Card> */}
                {/* <CardContent> */}
                  <Grid container>
                    <Grid container item xs={12} style={{flexDirection:"row-reverse", justifyContent:"space-between", alignItems:"center"}}>
      
                    {
                      voucherSettingDetails.length > 0 && !view ? <Grid item xs={6}>
                         <Button
                          className={classes.button}
                          variant="contained"
                          style={{float : 'right'}}
                          aria-label="Register"
                          onClick={handleNewAdd}
                        >
                          Add New
                        </Button>
                      </Grid> : ''
                    }  
                                <Grid item xs={2}>
                    <label style={{display:"block"}}>Name of voucher</label>
                      <TextField
                      // style={{maxWidth:"300px"}}
                      className="mt-1"
                        placeholder="Name of voucher"
                        name="nameOfVoucher"
                        value={nameOfVoucher}
                        error={nameOfVoucherErr.length > 0 ? true : false}
                        helperText={nameOfVoucherErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        disabled
                        required
                        fullWidth
                      />
                    </Grid>
                    </Grid> 
                    <Grid item xs={12} sm={12} md={12} key="2">
                     
                        <Grid className="mt-16">Voucher Number Format </Grid>
                      </Grid>
                        <Grid className="mt-16" item xs={2} style={{ padding: 5}}>
                          <label>Start Date</label>
                          <TextField
                          className="mt-1"
                            placeholder="Start Date"
                            autoFocus
                            name="startDate"
                            type="date"
                            value={startDate}
                            error={startDateErr.length > 0 ? true : false}
                            helperText={startDateErr}
                            // onKeyDown={(e => e.preventDefault())}
                            onChange={(e) => handleInputChange(e)}
                            variant="outlined"
                            required
                            disabled={edit || view ? true : false}
                            fullWidth
                            inputProps={{
                              min: financialStartDate ? financialStartDate : moment().format("YYYY-MM-DD"),
                              max: financialEndDate ? financialEndDate : moment().format("YYYY-MM-DD")
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>

                        <Grid className="mt-16" item xs={2} style={{ padding: 5 }}>
                          <label>Prefix</label>
                          <TextField
                          className="mt-1"
                            placeholder="Prefix"
                            name="prefix"
                            value={prefix}
                            error={prefixErr.length > 0 ? true : false}
                            helperText={prefixErr}
                            disabled={edit || view ? true : false}
                            onChange={(e) => handleInputChange(e)}
                            variant="outlined"
                            required
                            fullWidth
                          />
                        </Grid>

                        <Grid className="mt-16" item xs={2} style={{ padding: 5 }}>
                          <label>Month</label>
                          <Select
                          className="mt-1"
                            classes={classes}
                            styles={selectStyles}
                            options={monthOpt.map((optn) => ({
                              value: optn.value,
                              label: optn.label,
                            }))}
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            value={month}
                            onChange={handleMonth}
                            placeholder="Month"
                            isDisabled={edit || view ? true : false}
                          />
                          <span style={{ color: "red" }}>
                            {monthErr.length > 0 ? monthErr : ""}
                          </span>
                        </Grid>

                        <Grid className="mt-16" item xs={2} style={{ padding: 5 }}>
                          <label>Year</label>
                          <Select
                          className="mt-1"
                            classes={classes}
                            styles={selectStyles}
                            options={monthOpt.map((optn) => ({
                              value: optn.value,
                              label: optn.label,
                            }))}
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            value={year}
                            onChange={handleYear}
                            placeholder="Year"
                            isDisabled={edit || view ? true : false}
                          />
                          <span style={{ color: "red" }}>
                            {yearErr.length > 0 ? yearErr : ""}
                          </span>
                        </Grid>

                        <Grid className="mt-20" item xs={2} style={{ padding: 5 }}>
                          <label>No of digit</label>
                          <TextField
                            placeholder="No of digit"
                            name="numDigit"
                            value={numDigit}
                            error={numDigitErr.length > 0 ? true : false}
                            helperText={numDigitErr}
                            onChange={(e) => handleInputChange(e)}
                            variant="outlined"
                            required
                            fullWidth
                            disabled={edit || view ? true : false}
                          />
                        </Grid>

                        <Grid className="mt-20" item xs={2} style={{ padding: 5 }}>
                        <label>Starting voucher number</label>
                          <TextField
                            placeholder="Starting voucher number"
                            name="startingVoucherNum"
                            value={startingVoucherNum}
                            error={
                              startingVoucherNumErr.length > 0 ? true : false
                            }
                            helperText={startingVoucherNumErr}
                            onChange={(e) => handleInputChange(e)}
                            variant="outlined"
                            disabled={edit || view ? true : false}
                            required
                            fullWidth
                          />
                        </Grid>

                        <Grid
                          className="mt-5 input-details-dv label-d-flex-main"
                          item
                          xs={12}
                          style={{ padding: 5}}
                        >
                          <span className="label-d-flex-dv">
                            Final voucher number be like :{" "}
                            {prefix ? `${prefix}/` : null}
                            {month.value === 1 ? callthismonth() : null}
                            {year.value === 1 ? callthisyear() : null}
                            {numDigit && !numDigitErr ? callTotalnum() : null}
                          </span>
                        </Grid>
                     
                  </Grid>
                {/* </CardContent> */}
            {/* </Card> */}
            {
              voucherSettingDetails.length > 0 &&  <div className="mt-16">
              <Paper className={classes.tabroot}>
                <div className="table-responsive edit-voucher-tbl">
                  <MaUTable className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          ID
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Voucher Number
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Start Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Ledger Include
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Party Voucher Number
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Other Voucher Number
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          HSN
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Narration
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Print Format
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {voucherSettingDetails.map((row, i) => (
                        <TableRow key={row.id}>
                          <TableCell className={classes.tableRowPad}>
                            {i + 1}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {row.voucher_number}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {moment(row.start_date).format("DD-MM-YYYY")}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {row.taxation_ledger_include === 1 ? "YES" : "NO"}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {row.require_supplier_voucher_no === 1
                              ? "YES"
                              : "NO"}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {row.required_other_voucher_no === 1 ? "YES" : "NO"}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {row.require_hsn_no === 1 ? "YES" : "NO"}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {row.require_narration === 1 ? "YES" : "NO"}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {row.print_require === 1 ? "YES" : "NO"}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {
                              <IconButton
                              style={{ padding: "0" }}
                              onClick={(ev) => {
                                ev.preventDefault();
                                ev.stopPropagation();
                                editHandler(row.id,i);
                              }}
                            >
                              {/* <Icon
                                className="mr-8"
                              >
                                {i === 0 ? "edit" : "visibility" }
                              </Icon> */}
                              {i === 0 && mainEdit ?    <Icon className="mr-8 edit-icone">
                                    <img src={Icones.edit} alt="" />
                                  </Icon> :    <Icon className="mr-8 view-icone">
                                        <img src={Icones.view} alt="" />
                                      </Icon>}
                            </IconButton>
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </MaUTable>
                </div>
              </Paper>
                </div>
            }  
             <div className="pt-16 editvoucher_blg_dv" style={{ height: "90%"}}>
                <AppBar position="static" className="add-header-purchase">
                  <Tabs value={0}>
                      <Tab label="General Settings" />
                    </Tabs>
                  </AppBar>
                      {
                        preDefined !== 1 &&
                        <>
                          <Grid className="checkbox-input-flex" container spacing={3}>
                            <Grid
                              className="flex-blog-dv"
                              item
                              xs={12}
                              style={{ padding: "5px" }}
                            >
                              <Grid
                                // className="mt-15"
                                item
                                xs={12}
                                style={{ padding: "10px 0px", marginTop:"37px"}}
                              >
                                <label>Voucher Look Format Like </label>
                                <Select
                                  classes={classes}
                                  className="mt-1"
                                  styles={selectStyles}
                                  options={voucherOption.map((optn) => ({
                                    value: optn.value,
                                    label: optn.label,
                                  }))}
                                  // options={groupTree}
                                  value={format}
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  onChange={handleFormat}
                                  placeholder="Voucher Look Format Like"
                                  isDisabled={view}
                                />
                                <span style={{ color: "red" }}>
                                  {formatErr.length > 0 ? formatErr : ""}
                                </span>
                                {format.value === 1 && (
                                  <Grid
                                    item
                                    xs={12}
                                    style={{ padding: "10px 0px" }}
                                  >
                                    <label>If vertical formats then what on top</label>
                                    <Select
                                      classes={classes}
                                      styles={selectStyles}
                                      className="mt-1"
                                      options={whatOnTop.map((optn) => ({
                                        value: optn.value,
                                        label: optn.label,
                                      }))}
                                      value={verticalFormatTop}
                                      filterOption={createFilter({
                                        ignoreAccents: false,
                                      })}
                                      onChange={handleWhatOnTop}
                                      placeholder="If vertical formats then what on top"
                                      isDisabled={view}
                                    />
                                    <span style={{ color: "red" }}>
                                      {verticalFormatTopErr.length > 0
                                        ? verticalFormatTopErr
                                        : ""}
                                    </span>
                                  </Grid>
                                )}
                              </Grid>
                              <Grid
                                container
                                className="checkbox-inpu-dv pl-1"
                              >
                                <Grid item xs={12} style={{ padding: 10 }}>
                                  <FormControl className="items-center">
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          name="taxLedInclude"
                                          onChange={(e) => handleInputChange(e)}
                                          checked={taxLedInclude === 1 ? true : false}
                                          disabled={view}
                                        />
                                      }
                                      label="Taxation ledger to include"
                                    />
                                  </FormControl>
                                  {taxLedInclude === 1 && (
                                    <div>
                                      <Grid container spacing={3}>
                                        <Grid item xs={6} style={{ padding: 10 }}>
                                          <span>TDS/TCS</span>

                                          <Select
                                          className="mt-1"
                                            classes={classes}
                                            styles={selectStyles}
                                            options={taxLedgerArr.map((optn) => ({
                                              value: optn.value,
                                              label: optn.label,
                                            }))}
                                            value={taxLedger}
                                            onChange={handleTaxLedger}
                                            placeholder="TDS/TCS"
                                            isDisabled={view}

                                          />
                                        </Grid>
                                        <Grid item xs={6} style={{ padding: 10 }}>
                                          <span>Ledger Name</span>
                                          <Select
                                          className="mt-1"
                                            classes={classes}
                                            styles={selectStyles}
                                            options={ledgerList.map((optn) => ({
                                              value: optn.id,
                                              label: optn.name,
                                            }))}
                                            value={taxLedgerName}
                                            onChange={handleLedName}
                                            placeholder="Ledger Name"
                                            isMulti
                                            isDisabled={view}
                                          />
                                        </Grid>
                                      </Grid>
                                      <span style={{ color: "red" }}>
                                        {taxLedgerNameErr.length > 0
                                          ? taxLedgerNameErr
                                          : ""}
                                      </span>
                                      <Grid container spacing={3}>
                                        <Grid item xs={6} style={{ padding: 10 }}>
                                          <FormControl className="items-center">
                                            <FormControlLabel
                                              control={
                                                <Checkbox
                                                  name="gst"
                                                  onChange={(e) => handleInputChange(e)}
                                                  checked={gst === 1 ? true : false}
                                                  disabled={view}
                                                />
                                              }
                                              label="GST"
                                            />
                                          </FormControl>
                                        </Grid>
                                        {gst === 1 &&
                                          <Grid item xs={6} style={{ padding: 10 }}>
                                            <span>Gst ledger name</span>
                                            <Select
                                            className="mt-1"
                                              classes={classes}
                                              styles={selectStyles}
                                              options={gstLedgerList.map((optn) => ({
                                                value: optn.id,
                                                label: optn.name,
                                              }))}
                                              value={gstLedger}
                                              onChange={handlegstLedName}
                                              placeholder="Gst ledger name"
                                              isDisabled={view}
                                            />
                                            <span style={{ color: "red" }}>
                                              {gstLedgerErr.length > 0
                                                ? gstLedgerErr
                                                : ""}
                                            </span>
                                          </Grid>
                                        }
                                      </Grid>
                                    </div>
                                  )}
                                </Grid>
                              </Grid>
                            </Grid>

                          </Grid>
                          <Grid
                            container
                            spacing={3}
                            className="checkbox-inpu-dv mt-16 mb-12"
                          >
                            <Grid
                              item
                              xs={12}
                              style={{ padding: 5 }}
                            >

                              <Accordion defaultExpanded={true}>
                                <AccordionSummary
                                  className="accordion-main-blg-dv"
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls="panel1a-content"
                                  id="panel1a-header"

                                >
                                  <Typography>What to Debit</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  {/* <Typography> */}
                                  <TreeView
                                    defaultCollapseIcon={<ExpandMoreIcon />}
                                    defaultExpandIcon={<ChevronRightIcon />}
                                  >
                                    {renderTree(groupTree)}
                                  </TreeView>
                                  {/* </Typography> */}
                                </AccordionDetails>
                              </Accordion>
                              <span style={{ color: "red" }}>
                                {voucherToDebitErr.length > 0
                                  ? voucherToDebitErr
                                  : ""}
                              </span>
                            </Grid>

                            <Grid
                              className=""
                              item
                              xs={12}
                              style={{ padding: 5 }}
                            >

                              <Accordion defaultExpanded={ true }>
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                 
                                  aria-controls="panel1a-content"
                                  id="panel1a-header"
                                >
                                  <Typography>What to Credit</Typography>
                                </AccordionSummary  >
                                <AccordionDetails  >
                                  {/* <Typography> */}
                                  
                                  <TreeView  
                                    defaultCollapseIcon={<ExpandMoreIcon />}
                                    defaultExpandIcon={<ChevronRightIcon />}
                                  >
                                    {renderCreditTree(groupTree)}

                                  </TreeView>
                                  {/* </Typography> */}
                                </AccordionDetails>
                              </Accordion>
                              <span style={{ color: "red" }}>
                                {voucherToCreditErr.length > 0
                                  ? voucherToCreditErr
                                  : ""}
                              </span>
                            </Grid>
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl className="items-center">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    name="suppVoucher"
                                    onChange={(e) => handleInputChange(e)}
                                    checked={suppVoucher === 1 ? true : false}
                                    disabled={view}
                                  />
                                }
                                label="Require Party Voucher Number"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl className="items-center">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    name="partyVoucherDate"
                                    onChange={(e) => handleInputChange(e)}
                                    checked={partyVoucherDate === 1 ? true : false}
                                    disabled={view}
                                  />
                                }
                                label="Require Party Voucher Date"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl className="items-center">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    name="otherVoucher"
                                    onChange={(e) => handleInputChange(e)}
                                    checked={otherVoucher === 1 ? true : false}
                                    disabled={view}
                                  />
                                }
                                label="Require Other Voucher Number"
                              />
                            </FormControl>
                          </Grid>
                          {
                            format.value === 1 && <Grid item xs={6}>
                            <FormControl className="items-center">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    name="hsnNumber"
                                    onChange={(e) => handleInputChange(e)}
                                    checked={hsnNumber === 1 ? true : false}
                                    disabled={view}
                                  />
                                }
                                label="Require HSN to enter"
                              />
                            </FormControl>
                          </Grid>
                          }
                          <Grid item xs={6}>
                            <FormControl className="items-center">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    name="narration"
                                    onChange={(e) => handleInputChange(e)}
                                    checked={narration === 1 ? true : false}
                                    disabled={view}
                                  />
                                }
                                label="Require Narration to enter"
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl className="items-center">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    name="GSTRequired"
                                    onChange={(e) => handleInputChange(e)}
                                    checked={GSTRequired === 1 ? true : false}
                                    disabled={view}
                                  />
                                }
                                label="GST Credit Date Required"
                              />
                            </FormControl>
                          </Grid>
                        </>
                      }
                      <Grid item xs={6} className=" checkbox-main-blog">
                        <Grid item xs={12} style={{display:"flex", columnGap:"16px"}}>
                        <Grid>
                        <Grid item>
                          <FormControl className="items-center">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="backDate"
                                  onChange={(e) => handleInputChange(e)}
                                  checked={backDate === 1 ? true : false}
                                  disabled={view}
                                />
                              }
                              label="Back Date Entry Allowed"
                            />
                          </FormControl>
                        </Grid>

                        {backDate === 1 && (
                          <>
                            <div className="mb-5">
                              Day to allow back date entry :
                            </div>
                            <Grid item>
                            <label>No of day</label>
                              <TextField
                                className="mb-16"
                                placeholder="No of day"
                                name="backDateDays"
                                value={backDateDays}
                                error={backDtDaysErr.length > 0 ? true : false}
                                helperText={backDtDaysErr}
                                onChange={(e) => handleInputChange(e)}
                                variant="outlined"
                                required
                                fullWidth
                                disabled={view}
                              />
                            </Grid>
                          </>
                        )}
                        </Grid>
                        <Grid>
                        <Grid item >
                          <FormControl className="items-center">
                            <FormControlLabel
                              control={
                                <Checkbox
                                  name="deleteAllow"
                                  onChange={(e) => handleInputChange(e)}
                                  checked={deleteAllow === 1 ? true : false}
                                  disabled={view}
                                />
                              }
                              label="Voucher Delete Allowed"
                            />
                          </FormControl>
                        </Grid>

                        {deleteAllow === 1 && (
                          <>
                            <div className="mb-5">
                              Day to allow Voucher Delete :
                            </div>
                            <Grid item >
                              <label>No of day</label>
                              <TextField
                                className="mb-16"
                                placeholder="No of day"
                                name="voucherDelDays"
                                value={voucherDelDays}
                                error={
                                  voucherDelDaysErr.length > 0 ? true : false
                                }
                                helperText={voucherDelDaysErr}
                                onChange={(e) => handleInputChange(e)}
                                variant="outlined"
                                required
                                fullWidth
                                isDisabled={view}
                              />
                            </Grid>

                          </>
                        )}
                        </Grid>
                        </Grid>
                        {/* <Grid item xs={12}>
                        <FormControl className="items-center">
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="GSTRequired"
                                onChange={(e) => handleInputChange(e)}
                                checked={GSTRequired === 1 ? true : false}
                              />
                            }
                            label="GST Credit Date Required"
                          />
                        </FormControl>
                        </Grid> */}

                      </Grid>
                      <Grid className="float-right">
                        <Button
                        id="btn-save"
                          hidden={view}
                          variant="contained"
                          className="w-224"
                          aria-label="Register"
                          onClick={(e) => handleFormSubmit(e)}
                        >
                          {edit ? "Update" : "save"}
                        </Button>
                      </Grid>
            </div>
            </div>
           </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default EditVoucherRetailer;

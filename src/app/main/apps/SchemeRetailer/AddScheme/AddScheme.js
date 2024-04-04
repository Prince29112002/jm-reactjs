import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FuseAnimate } from "@fuse";
import MaUTable from "@material-ui/core/Table";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Icon,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextareaAutosize,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import History from "@history";
import AsyncCreatable from 'react-select/lib/Creatable';
import clsx from "clsx";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as Actions from "app/store/actions";
import Select, { createFilter } from "react-select";
import Icones from "assets/fornt-icons/Mainicons";
import moment from "moment";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Loader from "app/main/Loader/Loader";
import AddClientRetailer from "../../MasterRetailer/ClientRetailer/AddClientRetailer/AddClientRetailer"
import Modal from "@material-ui/core/Modal";

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
  table: {
    minWidth: 800,
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
  uibuttion: {
    border: "1px dashed #415BD4",
    backgroundColor: " #EDF0FD !important",
    color: "#415BD4 !important",
  },
  selectBox: {
    padding: 6,
    fontSize: "12pt",
    width: "100%",
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

const AddScheme = (props) => {

    const dispatch = useDispatch();
    const classes = useStyles();
    const theme = useTheme();
    const [modalStyle] = React.useState(getModalStyle);
    const [loading, setLoading] = useState(false);
    const [isView, setIsView] = useState(false)
    const [apiData, setApiData] = useState([])
    const [docNumber, setDocNumber] = useState("")

    const [isGoldSilver, setIsGoldSilver] = useState({value : 0, label : "Gold"})
    const [isGoldSilverErr, setIsGoldSilverErr] = useState("")

    const [openClientModal, setOpenClientModal] = useState(false)
    const [clientList, setClientList] = useState([])
    const [payerName, setPayerName] = useState("")
    const [payerNameErr, setPayerNameErr] = useState("")
    const [phoneNumOne, setPhoneNumOne] = useState("")
    const [pincode, setpincode] = useState("");

    const [date, setDate] = useState("")
    const [dateErr, setDateErr] = useState("")

    const [amount, setAmount] = useState("")
    const [amountErr, setAmountErr] = useState("")

    const [totalTenureList, setTotalTenureList] = useState([])
    const [selectedTenure, setSelectedTenure] = useState("")
    const [selectedTenureErr, setSelectedTenureErr] = useState("")

    const [customerTenureList, setCustomerTenureList] = useState([])
    const [selectedCustemerTenure, setSelectedCustemerTenure] = useState("")
    const [selectedCustemerTenureErr, setSelectedCustemerTenureErr] = useState("")

    const [adminTenure, setAdminTenure] = useState("")
    const [note, setNote] = useState("")
    const [documents, setDocuments] = useState("")
    const [docArr,setDocArr] = useState([])
    const [docModal,setDocModal] = useState(false)
    const propsData = props.location.state;

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
        NavbarSetting("Scheme-Retailer", dispatch);
      },[]);

      useEffect(() => {
        if(propsData){
          setIsView(propsData.isView);
          getOneSchemeData(propsData.id)
        }else{
          getClientList();
          getTotalTenureList()
        }
      },[]);

      useEffect(() => {
        if(selectedTenure && !isView){
          createCustomerMonth()
        }
      },[selectedTenure]);

      useEffect(() => {
        if(apiData.length > 0 && !isView){
          setApiData([])
        }
      },[date,amount,selectedTenure,selectedCustemerTenure]);

      useEffect(() => {
        if(selectedTenure && selectedCustemerTenure && !isView){
          const diff = selectedTenure.value - selectedCustemerTenure.value
          setAdminTenure(diff !== 1 ? diff + " months" : diff + " month") 
        }
      },[selectedCustemerTenure]);

      const getOneSchemeData = (id) => {
        axios
        .get(Config.getCommonUrl() + `retailerProduct/api/scheme/${id}`)
        .then(function (response) {
          if (response.data.success === true) {
            const arrData = response.data.data
            setDocNumber(arrData?.doc_number)
            setIsGoldSilver({
              value : arrData.is_gold_silver,
              label : arrData.is_gold_silver === 0 ? 'Gold' : 'Silver'
            })
            setPayerName({
              value : arrData?.ClientDetails?.id,
              label : arrData?.ClientDetails?.client_Name
            })
            setPhoneNumOne(arrData?.ClientDetails?.mobile_number)
            setpincode(arrData?.ClientDetails?.pincode)
            setDate(arrData.issue_date)
            setAmount(arrData.amount)
            setSelectedTenure({
              value : arrData.tenure,
              label : arrData.tenure + ' months'
            })
            setSelectedCustemerTenure({
              value : arrData.customer_tenure,
              label : arrData.customer_tenure + ' months'
            })
            setAdminTenure(arrData.admin_tenure + ' months')
            setNote(arrData.notes)
            setDocArr(arrData.SchemeDoc)
            setApiData(arrData.SchemePayment)
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
            api: `retailerProduct/api/scheme/${id}`,
          });
        });
      }

      const callEmiData = () => {
        if(validateclient() && validateDate() && 
        validateAmt() && validateTotal() && validateCustTenure()){
          const body = {
            "tenure":selectedTenure.value,
            "amount":amount,
            "issue_date":date,
            "customer_tenure":selectedCustemerTenure.value
          }
          axios
          .post(Config.getCommonUrl() + "retailerProduct/api/scheme/table" , body)
          .then(function (response) {
            if (response.data.success === true) {
              setApiData(response.data.data);
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
              api: "retailerProduct/api/scheme/table", body
            });
          });
        }
      }

      function getClientList() {
        axios
          .get(Config.getCommonUrl() + "retailerProduct/api/clientRet")
          .then(function (response) {
            if (response.data.success === true) {
                setClientList(response.data.data);
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
              api: "retailerProduct/api/clientRet",
            });
          });
      }

      function getTotalTenureList() {
        axios
          .get(Config.getCommonUrl() + "retailerProduct/api/scheme/tenure/list")
          .then(function (response) {
            if (response.data.success === true) {
              setTotalTenureList(response.data.data);
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
              api: "retailerProduct/api/scheme/tenure/list",
            });
          });
      }

      function getclinetDetails(id) {
        axios
          .get(
            Config.getCommonUrl() +
            `retailerProduct/api/clientRet/${id}`
          )
          .then((res) => {
            console.log(res);
            const arrData = res.data.data[0];
            setClientdetail(arrData, true);
          })
          .catch((error) => {
            handleError(error, dispatch, {
              api: `retailerProduct/api/clientRet/${id}`,
            });
          });
      }

      function setClientdetail(arrData, addedTrue) {
        setOpenClientModal(false)
        if (arrData) {
          if (!addedTrue) {
            getClientList()
            setPayerName({
              value: arrData.id,
              label: arrData.client_Name,
            });
            setPayerNameErr("")
          }
          setPhoneNumOne(arrData.mobile_number);
          setpincode(arrData.pincode)
        } else {
          setPayerName("")
        }
      }

      function handlePayername(value,e) {
        console.log(value);
        if (value) {
          setPayerName(value);
          setPayerNameErr("");
          if (value.__isNew__ === true) {
            setOpenClientModal(true);
          } else {
            getclinetDetails(value.value)
          }
        } else {
          setPayerName("");
          setPayerNameErr("")
          setPhoneNumOne("")
          setpincode("")
        }
      }
  
  // const reset = () => {
  //   setDate("")
  //   setDateErr("")
  //   setAmount("")
  //   setSelectedTenure("")
  //   setSelectedTenureErr("")
  //   setCustomerTenureList([])
  //   setSelectedCustemerTenure("")
  //   setSelectedCustemerTenureErr("")
  //   setAdminTenure("")
  //   setNote("")
  //   setDocuments("")
  //   setApiData([])
  // }

  const handletotalTenureChange = (value) => {
    setSelectedCustemerTenure("")
    setAdminTenure("")
    setSelectedCustemerTenureErr("")
    setSelectedTenure(value)
    setSelectedTenureErr("")
  }

  const createCustomerMonth = () => {
    const maxVal = selectedTenure.value
    const custArr = []
    for(let i = 1 ; i <= maxVal ; i++) {
      custArr.push({ value: i , label: i !== 1 ? i + " months" : i + " month"})
    }
    setCustomerTenureList(custArr)
  }

  const handlecustTenure = (value) => {
    setSelectedCustemerTenure(value)
    setSelectedCustemerTenureErr("")
  }

  const goldSilverArr = [
    {value: 0 , label: "Gold"},
    {value: 1 , label: "Silver"},
  ]

  const handlegoldSilver = (value) => {
    setIsGoldSilver(value)
    setIsGoldSilverErr("")
  }

  const handleInputChange = (e) =>{
    const value = e.target.value
    const name = e.target.name

    if(name === "date"){
      setDate(value)
      setDateErr("")
    }else if(name === "amount"){
      setAmount(value)
      setAmountErr("")
    }else if(name === "note"){
      setNote(value)
    }
  }

  const validateclient = () => {
    if(!payerName || payerNameErr){
      setPayerNameErr("Select or add payer");
      return false;
    }
    return true;
  }

  const validateDate = () => {
    if(!date || dateErr){
      setDateErr("Select date");
      return false;
    }
    return true;
  }

  const validateAmt = () => {
    if(!amount || amountErr){
      setAmountErr("Enter valid amount");
      return false;
    }
    return true;
  }

  const validateTotal = () => {
    if(!selectedTenure || selectedTenureErr){
      setSelectedTenureErr("Select total tenure");
      return false;
    }
    return true;
  }

  const validateCustTenure = () => {
    if(!selectedCustemerTenure || selectedCustemerTenureErr){
      setSelectedCustemerTenureErr("Select customer tenure");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if(validateclient() && validateDate() && 
     validateAmt() && validateTotal() && validateCustTenure()){
      callAddNewSchemeApi()
    }
  }

  const callAddNewSchemeApi = () => {
    setLoading(true)
    const formData = new FormData();
    if (documents) {
      for (let i = 0; i < documents.length; i++) {
        formData.append("files", documents[i]);
      }
    }
    formData.append("is_gold_silver", isGoldSilver.value);
    formData.append("client_id", payerName.value);
    formData.append("issue_date", date);
    formData.append("amount", amount);
    formData.append("tenure", selectedTenure.value);
    formData.append("customer_tenure", selectedCustemerTenure.value);
    formData.append("notes", note);

    axios.post(Config.getCommonUrl() + `retailerProduct/api/scheme`, formData)
    .then((response) => {
      console.log(response);
      if (response.data.success) {
        dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        History.push(`/dashboard/scheme`)
      } else {
        dispatch(Actions.showMessage({ message: response.data.message,variant:"error" }));
      }
      setLoading(false)
    })
    .catch((error) => {
      setLoading(false)
      handleError(error, dispatch, { api: `retailerProduct/api/scheme`, body: JSON.stringify(formData) })
    })
  }

  function checkCheckScheduleStatus(dueDate, reciveDate) {
    if (dueDate && reciveDate) {
      const dueDateFormate = moment(dueDate).format("YYYY-MM-DD")
      const reciveDateFormate = moment(reciveDate).format("YYYY-MM-DD")
      if (dueDateFormate === reciveDateFormate) {
        return "Ontime";
      } else if (moment(reciveDateFormate).isBefore(dueDateFormate)) {
        return "Advance";
      } else {
        return "Delay";
      }
    }
    return "-";
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
                <Grid item xs={6} sm={5} md={5} key="1">
                  <FuseAnimate delay={300}>
                    <Typography className="text-18 font-700">
                       {isView ? "View Client Scheme" : " Add New Client Scheme" }
                    </Typography>
                  </FuseAnimate>
                </Grid>
                <Grid item xs={6} sm={7} md={7} key="2">
                  <div className="btn-back">
                    {" "}
                    <Button
                      id="btn-back"
                      className=""
                      size="small"
                      onClick={(event) => { History.goBack()}}
                    >
                    <img src={Icones.arrow_left_pagination} className="back_arrow" alt="" />
                      Back
                    </Button>
                  </div>
                </Grid>
              </Grid>
              {loading && <Loader />}
              <div className="main-div-alll">
                <div>
                    <Grid container spacing={2}>
                    {
                      isView &&  <Grid item xs={12} sm={6} md={4} lg={3}>
                      <p className="popup-labl p-4 ">Document No</p>
                        <TextField
                        name="docNumber"
                        value={docNumber}
                        variant="outlined"
                        required
                        fullWidth
                        disabled
                        />
                      </Grid>
                      }
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p className="popup-labl p-4 ">Gold / Silver</p>
                    <Select
                      // id="view_jewellary_dv"
                      classes={classes}
                      styles={selectStyles}
                      options={goldSilverArr.map((suggestion) => ({
                        value: suggestion.value,
                        label: suggestion.label,
                      }))}
                      value={isGoldSilver}
                      onChange={handlegoldSilver}
                      placeholder="Gold or Silver"
                      isDisabled={isView}
                    />
                     <span style={{ color: "red" }}>
                      {isGoldSilverErr ? isGoldSilverErr : ""}
                    </span>
                    </Grid>
                 
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <p className="popup-labl p-4 ">Payer Name</p>
                        <AsyncCreatable
                            filterOption={createFilter({ ignoreAccents: false })}
                            styles={selectStyles}
                            options={clientList.map((suggestion) => ({
                                    value: suggestion.id,
                                    label: suggestion.client_Name,
                                    }))}
                            value={payerName}
                            onChange={handlePayername}
                            placeholder="Select Payer Name"
                            cacheOptions
                            autoFocus
                            defaultOptions
                            isDisabled={isView}
                            isClearable
                        />
                    <span style={{ color: "red" }}>
                        {payerNameErr.length > 0 ? payerNameErr : ""}
                    </span>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                      <p className="popup-labl p-4 ">Payer mobile</p>
                        <TextField
                        className=""
                        placeholder="Payer Mobile"
                        name="number"
                        value={phoneNumOne}
                        variant="outlined"
                        required
                        fullWidth
                        disabled
                        />
                      </Grid>
                    {/* <Grid item xs={12} sm={6} md={4} lg={3} style={{ paddingRight: "0px" }}>
                      <p className="popup-labl p-4 ">Pincode</p>
                    <TextField
                      className=""
                      disabled
                      placeholder="Pincode"
                      name="pincod"
                      value={pincode}
                      variant="outlined"
                      required
                      fullWidth
                    />
                    </Grid> */}
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <p className="popup-labl p-4 ">Issue Date</p>
                      <TextField
                        className=""
                        placeholder="Date"
                        name="date"
                        value={date}
                        error={dateErr.length > 0 ? true : false}
                        helperText={dateErr}
                        type="date"
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        inputProps={{min: moment().format("YYYY-MM-DD")}}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <p className="popup-labl p-4 ">Amount</p>
                      <TextField
                        className={classes.inputBoxTEST}
                        placeholder="Enter amount"
                        type={isView ? "text" : "number"}
                        name="amount"
                        value={amount}
                        error={amountErr.length > 0 ? true : false}
                        helperText={amountErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </Grid>
                 
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p className="popup-labl p-4 ">Total Scheme Tenure </p>
                    <Select
                      // id="view_jewellary_dv"
                      classes={classes}
                      styles={selectStyles}
                      options={totalTenureList.map((suggestion) => ({
                        value: suggestion.id,
                        label: suggestion.word,
                      }))}
                      value={selectedTenure}
                      onChange={handletotalTenureChange}
                      placeholder="Total Scheme Tenure"
                      isDisabled={isView}
                    />
                     <span style={{ color: "red" }}>
                      {selectedTenureErr? selectedTenureErr: ""}
                    </span>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p className="popup-labl p-4 ">Customer Tenure </p>
                    <Select
                      // id="view_jewellary_dv"
                      classes={classes}
                      styles={selectStyles}
                      options={customerTenureList.map((suggestion) => ({
                        value: suggestion.value,
                        label: suggestion.label,
                      }))}
                      value={selectedCustemerTenure}
                      onChange={handlecustTenure}
                      placeholder="Customer Tenure"
                      isDisabled={isView}
                    />
                     <span style={{ color: "red" }}>
                      {selectedCustemerTenureErr ? selectedCustemerTenureErr : ""}
                    </span>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <p className="popup-labl p-4 ">Admin Tenure</p>
                      <TextField
                        className=""
                        placeholder="0 month"
                        name="adminTenure"
                        value={adminTenure}
                        variant="outlined"
                        required
                        fullWidth
                        disabled
                      />
                    </Grid>
                    {
                      !isView &&  <Grid item xs={12} sm={6} md={4} lg={3}>
                      <p className="popup-labl p-4 ">Upload Document</p>
                      <TextField
                        className="uploadDoc"
                        placeholder="Upload document"
                        type="file"
                        inputProps={{
                          multiple: true,
                        }}
                        onChange={(e) => setDocuments(e.target.files)}
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    }
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <p className="popup-labl p-4 ">Note</p>
                      <TextField
                        className=""
                        placeholder="Enter note"
                        name="note"
                        value={note}
                        // multiline
                        onChange={(e) => handleInputChange(e)}
                        maxRows={3}
                        minRows={3}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </Grid>

                    {isView &&  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Button
                      id="btn-save"
                      variant="contained"
                      className="w-224 mx-auto mt-10 "
                      onClick={() => setDocModal(true)}
                    >
                      View Documents
                    </Button>
                    </Grid> }
                    </Grid>
                   
                    {!isView && (
                    <>
                      <Button
                        id="btn-save"
                        variant="contained"
                        color="primary"
                        className="w-224 mx-auto mt-16 float-right"
                        aria-label="Register"
                        onClick={callEmiData}
                      >
                        Calculate EMI
                      </Button>
                    </>
                  )}
                    {
                      apiData.length > 0 &&  <Paper className="mt-56" style={{overflow: "auto",width:"100%",maxHeight: "calc(100vh - 300px)"}}>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad} width="12%">No</TableCell>
                            <TableCell className={classes.tableRowPad} width="13%">Due Date</TableCell>
                            <TableCell className={classes.tableRowPad} align="right" maxWidth="180px">Installment Amount (in ₹)</TableCell>
                            <TableCell className={classes.tableRowPad} width="12%"></TableCell>
                            <TableCell className={classes.tableRowPad} width="15%">Paid By</TableCell>
                            <TableCell className={classes.tableRowPad} width="16%">Received Date</TableCell>
                            <TableCell className={clsx(classes.tableRowPad, "textLeft")} width="12%" >Status</TableCell>
                            {isView ? 
                              <TableCell className={clsx(classes.tableRowPad, "textLeft")} width="12%">Schedule Status</TableCell> : null
                            }
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {apiData
                            .map((row, i) => (
                              <TableRow key={i}>
                                <TableCell className={classes.tableRowPad}>
                                {i+1}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {moment(row.due_date).format("DD-MM-YYYY")}  
                                </TableCell>
                                <TableCell className={classes.tableRowPad} style={{textAlign:"right"}}>
                                  {parseFloat(row?.amount).toFixed(2)}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}></TableCell>
                                <TableCell className={classes.tableRowPad}>
                                {row.paid_by === 0 ? "Customer" : "Admin"}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                {row.payment_date ? moment(row.payment_date).format("DD-MM-YYYY") : 
                                row.paid_by === 0 ? "NA" : "-"}
                                </TableCell>
                                <TableCell className={clsx(classes.tableRowPad, "textLeft")}>
                                {row.is_paid === 0 && row.paid_by === 0 ? "Pending" : row.paid_by === 0 ? "Paid" : "-"}
                                </TableCell>
                                {isView ? 
                                <TableCell className={clsx(classes.tableRowPad, "textLeft")}>
                                  {checkCheckScheduleStatus(row.due_date, row.payment_date)}
                                </TableCell> : null
                                }
                              </TableRow>
                             ))}
                        </TableBody>
                      </Table>
                      </Paper>
                    }
                   
                  {apiData.length > 0 && (
                    <>
                      <Button
                        id="btn-save"
                        variant="contained"
                        color="primary"
                        className="w-224 mx-auto mt-16 float-right"
                        aria-label="Register"
                        hidden={isView}
                        onClick={(e) => {
                         handleFormSubmit(e);
                        }}
                      >
                        Save
                      </Button>
                    </>
                  )}
                </div>
                <div>
                <Modal
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  open={openClientModal}
                  onClose={(_, reason) => {
                    if (reason !== "backdropClick") {
                      setClientdetail();
                    }
                  }}
                >
                  <div style={modalStyle} className={clsx(classes.paper, "rounded-8")} id="metal-modesize-dv">
                    <h5 className="popup-head p-5">
                      Add New Client
                      <IconButton
                        style={{ position: "absolute", top: "0", right: "0" }}
                        onClick={() => setClientdetail()}
                      ><Icon style={{ color: "white" }}>
                          close
                        </Icon></IconButton>
                    </h5>
                    <div className="p-5 pl-16 pr-16 inner-metal-modesize-dv">

                      <AddClientRetailer name={payerName.label} callFrom="Sales-Retailer" setClientdetail={setClientdetail} />
                    </div>
                  </div>
                </Modal>
                <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={docModal}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  setDocModal(false);
                }
              }}
            >
        <div id="modesize-dv" style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
          <h5
            className="popup-head p-5">
            Document list
            <IconButton
              style={{ position: "absolute", top: -2, right: 0 }}
              onClick={()=> setDocModal(false)}
            >
                 <Icon> <img src={Icones.cross} alt="" /> </Icon>
            </IconButton>
          </h5>
          <div className="pb-5 pl-16 pr-16 my-16" style={{ maxHeight: "500px", overflow: 'scroll' }}>
            <MaUTable className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableRowPad}>No</TableCell>
                  <TableCell className={classes.tableRowPad}>File Name</TableCell>
                  <TableCell className={classes.tableRowPad}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {docArr?.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className={classes.tableRowPad}>{i + 1}</TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.image_file_name}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      <IconButton
                        style={{ padding: "0" }}
                        onClick={(ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          window.open(row.image_file, '_blank');
                        }}
                      >
                       <Icon className="mr-8 download-icone" style={{ color: "dodgerblue" }}>
                          <img src={Icones.download_green} alt="" />
                        </Icon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </MaUTable>
          </div>
        </div>
      </Modal>
              </div>
              </div>
            </div>
          </div>
        </FuseAnimate>
      </div>
    )
}

export default AddScheme
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FuseAnimate } from "@fuse";
import {
  Button,
  Divider,
  Grid,
  Icon,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import History from "@history";
import { useReactToPrint } from "react-to-print";
import clsx from "clsx";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as Actions from "app/store/actions";
import Icones from "assets/fornt-icons/Mainicons";
import moment from "moment";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Loader from "app/main/Loader/Loader";
import { ReceiptPrint } from "./ReceiptPrint";
import Modal from "@material-ui/core/Modal";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    minWidth: 800,
    // tableLayout: "auto",
    // maxHeight:"350px",
    // display:"block"
  },
  tableRowPad: {
    padding: 7,
  },
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
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
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
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

const EmiPayScheme = (props) => {

    const dispatch = useDispatch();
    const classes = useStyles();
    const theme = useTheme();
    const [modalStyle] = React.useState(getModalStyle);
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState([])
    const [docNumber, setDocNumber] = useState("")
    const [isGoldSilver, setIsGoldSilver] = useState("")
    const [payerName, setPayerName] = useState("")
    const [phoneNumOne, setPhoneNumOne] = useState("")
    const [pincode, setpincode] = useState("");
    const [date, setDate] = useState("")
    const [amount, setAmount] = useState("")
    const [selectedTenure, setSelectedTenure] = useState("")
    const [selectedCustemerTenure, setSelectedCustemerTenure] = useState("")
    const [adminTenure, setAdminTenure] = useState("")
    const [note, setNote] = useState("")
    const [documents, setDocuments] = useState("")
    const [totalInstallment, setTotalInstallment] = useState("")
    const [index, setIndex] = useState("")
    const [totalamount, setTotalAmt] = useState("")
    const [nextDue, setNextDue] = useState("")
    const [payNow, setPayNow] = useState(false);
    const [payId, setPayId] = useState("")
    const [installmentAmt, setInstallmentAmt] = useState("")
    const [installmentNo, setInstallmentNo] = useState("")
    const [receivedAmt, setReceivedAmt] = useState("")
    const [onlyPrint, setOnlyPrint] = useState(false)
    const [printObj, setPrintObj] = useState({
      docNumber :"",
      isGoldSilver:"",
      payerName:"",
      phoneNumOne:"",
      pincode:"",
      date:"",
      installmentNo:"",
      received_Date:"",
      receivedAmt:"",
    })
    const propsData = props.location.state;
    const componentRef = React.useRef(null);
    const onBeforeGetContentResolve = React.useRef(null);
    const handleAfterPrint = () => {
      checkAndReset();
    };
    function checkAndReset() {
      // History.goBack();
      setInstallmentAmt("")
      setInstallmentNo("")
      setReceivedAmt("")
      getOneSchemeData(propsData.id)
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
      documentTitle: "Scheme_Receipt" + getDateAndTime(),
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

    useEffect(() => {
    NavbarSetting("Scheme-Retailer", dispatch);
    },[]);

    useEffect(() => {
    if(propsData){
        getOneSchemeData(propsData.id)
    }
    },[]);

    const getOneSchemeData = (id) => {
    axios
    .get(Config.getCommonUrl() + `retailerProduct/api/scheme/${id}`)
    .then(function (response) {
        if (response.data.success === true) {
        const arrData = response.data.data
        setDocNumber(arrData.doc_number)
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
        setDocuments(arrData.SchemeDoc)
        const dataArr = arrData.SchemePayment
        let totalAmt = 0
        let totalPay = 0
        for(let i = 0; i < dataArr.length; i++){
            if(dataArr[i].is_paid === 1){
                totalAmt = parseFloat(totalAmt) + parseFloat(dataArr[i].amount)
                totalPay += 1
            }else{
                setIndex(i)
                break;
            }
        }
        setTotalAmt(totalAmt)
        setTotalInstallment(totalPay)
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

  const validatReceivedAmt = () => {
    if(parseFloat(installmentAmt) === parseFloat(receivedAmt)){
        return true;
    }else{
        dispatch(Actions.showMessage({ message:"Received amount not match with installment amount !",variant:"error" }));
        return false;
    }
  }

  const checkforPrint = () => {
    setPrintObj({ 
      docNumber : docNumber,
      isGoldSilver: isGoldSilver.label,
      payerName: payerName.label,
      phoneNumOne: phoneNumOne,
      pincode: pincode,
      date: moment(date).format("DD-MM-YYYY"),
      installmentNo: installmentNo,
      received_Date: moment().format("DD-MM-YYYY"),
      receivedAmt: receivedAmt,
    })
    handleAmoutAdd(true)
  }

  const printReceipt = (data , iNum) => {
    setPrintObj({ 
      docNumber : docNumber,
      isGoldSilver: isGoldSilver.label,
      payerName: payerName.label,
      phoneNumOne: phoneNumOne,
      pincode: pincode,
      date: moment(date).format("DD-MM-YYYY"),
      installmentNo: iNum,
      received_Date: moment(data.payment_date).format("DD-MM-YYYY"),
      receivedAmt: data.amount,
    })
    handlePrint();
  }

  const handleAmoutAdd = (isPrint) => {
    // if(validatReceivedAmt()){
      callAddInstallmentApi(isPrint)
    // }
  }
  const callAddInstallmentApi = (isPrint) => {
    const body = {payment_amount : receivedAmt}
    setLoading(true)
    axios.put(Config.getCommonUrl() + `retailerProduct/api/scheme/emipay/${propsData.id}`,body)
    .then((response) => {
      console.log(response);
      if (response.data.success) {
        setPayNow(false);
        if(isPrint){
          handlePrint();
        }else{
          // History.push(`/dashboard/scheme`)
          setInstallmentAmt("")
          setInstallmentNo("")
          setReceivedAmt("")
          getOneSchemeData(propsData.id)
        }
        dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
      } else {
        dispatch(Actions.showMessage({ message: response.data.message,variant:"error" }));
      }
      setLoading(false)
    })
    .catch((error) => {
      setLoading(false)
      handleError(error, dispatch, { api: `retailerProduct/api/scheme/emipay/${propsData.id}`,body })
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
            <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
              <Grid
                className=" department-main-dv"
                container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0 }}
              >
                <Grid item xs={6} sm={5} md={5} key="1" style={{ padding: 0 }}>
                  <FuseAnimate delay={300}>
                    <Typography className="pl-28 pt-16 text-18 font-700">
                      Pay EMI
                    </Typography>
                  </FuseAnimate>
                </Grid>
                <Grid item xs={6} sm={7} md={7} key="2">
                  <div className="btn-back">
                    <Button
                      id="btn-back"
                      className=""
                      size="small"
                      onClick={(event) => { History.goBack()}}
                    >
                      <img className="back_arrow" src={Icones.arrow_left_pagination} alt="back" />
                      Back
                    </Button>
                  </div>
                </Grid>
              </Grid>
              {loading && <Loader />}
              <div className="main-div-alll">
                <div className="" >
                <h4 className="mt-1 mb-16">Account Details:</h4>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
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
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                        <p className="popup-labl p-4 ">Gold / Silver</p>
                            <TextField
                                name="isGoldSilver"
                                value={isGoldSilver.label}
                                variant="outlined"
                                required
                                fullWidth
                                disabled
                            />
                        </Grid>
                 
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <p className="popup-labl p-4 ">Payer Name</p>
                        <TextField
                            name="payerName"
                            value={payerName.label}
                            variant="outlined"
                            required
                            fullWidth
                            disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                      <p className="popup-labl p-4 ">Payer mobile</p>
                        <TextField
                        name="number"
                        value={phoneNumOne}
                        variant="outlined"
                        required
                        fullWidth
                        disabled
                        />
                      </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <p className="popup-labl p-4 ">Pincode</p>
                    <TextField
                      disabled
                      placeholder="Pincode"
                      name="pincod"
                      value={pincode}
                      variant="outlined"
                      required
                      fullWidth
                    />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <p className="popup-labl p-4 ">Issue Date</p>
                      <TextField
                        className=""
                        placeholder="Date"
                        name="date"
                        value={date}
                        type="date"
                        variant="outlined"
                        inputProps={{min: moment().format("YYYY-MM-DD")}}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        required
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <p className="popup-labl p-4 ">Amount</p>
                      <TextField
                        className={classes.inputBoxTEST}
                        placeholder="Enter amount"
                        name="amount"
                        value={amount}
                        variant="outlined"
                        required
                        fullWidth
                        disabled
                      />
                    </Grid>
                 
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p className="popup-labl p-4 ">Total Scheme Tenure </p>
                    <TextField
                            name="selectedTenure"
                            value={selectedTenure.label}
                            variant="outlined"
                            required
                            fullWidth
                            disabled
                        />
                   
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                    <p className="popup-labl p-4 ">Customer Tenure </p>
                    <TextField
                            name="selectedTenure"
                            value={selectedCustemerTenure.label}
                            variant="outlined"
                            required
                            fullWidth
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <p className="popup-labl p-4 ">Admin Tenure</p>
                      <TextField
                        name="adminTenure"
                        value={adminTenure}
                        variant="outlined"
                        required
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <p className="popup-labl p-4 ">Note</p>
                      <TextField
                        placeholder="Note"
                        name="note"
                        value={note}
                        variant="outlined"
                        required
                        fullWidth
                        disabled
                      />
                    </Grid>
                    </Grid>
                    <Divider style={{marginTop: 20, marginBottom: 15}} />
                    <h4 className="mb-16">Payment Details:</h4>
                    <Grid container spacing={2}>
                       <Grid item xs={12} sm={6} md={4} lg={3}>
                        <p className="popup-labl p-4 ">No Of Installments Paid </p>
                            <TextField
                            placeholder="No Of Installments Paid"
                            name="totalInstallment"
                            value={totalInstallment}
                            variant="outlined"
                            required
                            fullWidth
                            disabled
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                        <p className="popup-labl p-4 ">Total Amount Received</p>
                            <TextField
                            placeholder="Total Amount Received"
                            name="totalamount"
                            value={totalamount}
                            variant="outlined"
                            required
                            fullWidth
                            disabled
                            />
                        </Grid>
                        {/* <Grid item xs={3} style={{ paddingRight: "0px" }}>
                        <p className="popup-labl p-4 ">Next Payment Due</p>
                        <TextField
                        disabled
                        placeholder="Next Payment Due"
                        name="nextDue"
                        value={nextDue}
                        variant="outlined"
                        required
                        fullWidth
                        />
                        </Grid> */}
                    </Grid>
                    {/* <Paper style={{overflowY: "auto"}}> */}
                    {
                      apiData.length > 0 &&  <Paper style={{height: 500, overflow: "auto", marginTop: 20}}>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad} width="70px">No.</TableCell>
                            <TableCell className={classes.tableRowPad}>Due Date</TableCell>
                            <TableCell className={classes.tableRowPad} align="right">Installment Amount (in ₹)</TableCell>
                            <TableCell className={classes.tableRowPad} width="12%"></TableCell>
                            <TableCell className={classes.tableRowPad} width="15%">Paid By</TableCell>
                            <TableCell className={classes.tableRowPad}width="15%">Received Date</TableCell>
                            <TableCell className={classes.tableRowPad} width="12%">Status</TableCell>
                            <TableCell className={classes.tableRowPad} width="12%">Schedule Status</TableCell>
                            <TableCell className={classes.tableRowPad}>Action</TableCell>
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
                                  {row.payment_date ? moment(row.payment_date).format("DD-MM-YYYY") : row.paid_by === 0 ? 
                                  "NA" : "-"}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                {row.is_paid === 1 ?  "Paid" :
                                 i === index && row.paid_by === 0 ? <Button
                                 variant="contained"
                                 className={classes.button}
                                 style={{margin:"auto"}}
                                 size="small"
                                onClick={()=>{setPayNow(true); 
                                    setPayId(row.id);
                                    setInstallmentAmt(row?.amount);
                                    setInstallmentNo(i+1)}}
                               >
                                 Pay Now
                               </Button> : row.paid_by === 0 ? 
                                  "Pending" : "-"}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {checkCheckScheduleStatus(row.due_date, row.payment_date)}
                                {/* {row.paid_by === 0 ? "Customer" : "Admin"} */}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.is_paid === 1 ? <Button
                                  variant="contained"
                                  className={classes.button}
                                  size="small"
                                  onClick={() => {printReceipt(row , i+1)}}>
                                    Print
                                  </Button>
                                   : null}
                                </TableCell>
                              </TableRow>
                             ))}
                        </TableBody>
                      </Table>
                      </Paper>
                    }
                    {/* </Paper> */}
                </div>
                <div 
                style={{ display: "none" }}
                >
                        <ReceiptPrint
                          ref={componentRef}
                          printObj={printObj}
                        />
                      </div>
                <div>
                    <Modal
                    // disableBackdropClick
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={payNow}
                    onClose={(_, reason) => {
                    if (reason !== "backdropClick") {
                        setPayNow(false);
                    }
                    }}
                >
                <div style={modalStyle} className={clsx(classes.paper,"rounded-8")}>
                <h5
                    className="popup-head p-20"
                >
                Pay Now
                    <IconButton
                    style={{ position: "absolute", top:5, right:8}}
                    onClick={()=>{setPayNow(false)}}
                    ><Icon>
                        <img src={Icones.cross} alt="" />
                    </Icon></IconButton>
                </h5>
                <div className="pl-32 pr-32 pb-10 pt-10">
                <p className="popup-labl">Installment No</p>
                    <TextField
                    className="mt-4 input-select-bdr-dv mb-8"
                    value={installmentNo}
                    variant="outlined"
                    fullWidth
                    disabled
                    />
                <p className="popup-labl">Installment Amount</p>
                    <TextField
                    className="mt-4 input-select-bdr-dv mb-8"
                    value={installmentAmt}
                    variant="outlined"
                    fullWidth
                    disabled
                    />
                    <p className="popup-labl mt-16">Received Amount</p>
                    <TextField
                    className="mt-4 input-select-bdr-dv"
                    placeholder="0.00"
                    name="receivedAmt"
                    value={receivedAmt}
                    onChange={(e) => setReceivedAmt(e.target.value)}
                    variant="outlined"
                    fullWidth
                    />
                    
                    <div className="popup-button-div">
                    <Button
                        variant="contained"
                        className="cancle-button-css"
                        onClick={checkforPrint}
                        >
                        Save & Print
                        </Button>
                        <Button
                        variant="contained"
                        className="save-button-css"
                        onClick={() => handleAmoutAdd(false)}
                        >
                        Save
                        </Button>
                    </div>
                    
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

export default EmiPayScheme
import React, { useContext, useState, useEffect, useRef } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Icon, IconButton } from "@material-ui/core";
import Select, { createFilter } from "react-select";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "app/main/Loader/Loader";

import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";
import History from "@history";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
  },
  button: {
    // margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
  },
  filterBtn: {
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
  },
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    // height: "100%",
    height: "100%",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  searchBox: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
}));

const SalesRetalier = (props) => {

  const [apiData, setApiData] = useState([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);

  
  const [clientName, setClientName] = useState([]);
//   const [selectedClientName, setselectedClientName] = useState([]);
  const [clientNameErr, setClientNameErr] = useState("");
   
//   const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumberErr, setVoucherNumberErr] = useState("");

  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [dateErr, setDateErr] = useState("");

//   const [amount, setAmount] = useState("");
  const [amountErr, setAmountErr] = useState("");

  const [oldUdharData, setOldUdharData] = useState({
    client_id : "",
    transaction_number : "",
    date : "",
    udhaar_amount : "",
  });
  console.log(oldUdharData);
 

  useEffect(() => {
    NavbarSetting("Reports-Retailer", dispatch);
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 6000); // 10초 뒤에
    }
    //setLoaded(loaded);
  }, [loading]);

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const handleClientChange = (value) => {
    // setselectedClientName(value);
    setOldUdharData((prevData) => ({
        ...prevData,
        client_id: value,
        
      }));

  };

  function handleFormSubmit() {
    if (
      oldClientValidation(oldUdharData.client_id) &&
      oldVoucherNumValidation(oldUdharData.transaction_number) &&  
      oldDateValidation(oldUdharData.date) &&
      oldAmountValidation(oldUdharData.udhaar_amount) 
    ) {
        getAddOldUdhharAmount();
        History.goBack()
    }
  }

  function handleInputChange(e) {
    const { value, name } = e.target;
    console.log(value);
    console.log(name);

    setOldUdharData((prevData) => ({
      ...prevData,
      [name]: value,
      
    }));
    if (name === "client_id") {
        oldClientValidation(value);
    } 
    else if (name === "transaction_number" && !isNaN(value)) {
        oldVoucherNumValidation(value);
    }
    else if (name === "date") {
        oldDateValidation(value);
    }
    else if (name === "udhaar_amount" && !isNaN(value)) {
        oldAmountValidation(value);
    }
  }


  function oldClientValidation(value) {
        if (value === "" || value === null) {
        setClientNameErr("Select Client");
        return false;
      } else {
          setClientNameErr("");
        return true;
      }
  } 
  
  function oldVoucherNumValidation(value) {
    // if (!voucherNumber && value < voucherNumber) {
        if (value === "" || value === null || value === 0) {
        setVoucherNumberErr("Enter Voucher Number");
        return false;
      } else {
        setVoucherNumberErr("");
        return true;
      }
  }

  function oldDateValidation(value) {
        if (value === "" || value === null || value === 0) {
      setDateErr("Enter Date");
      return false;
    } else {
        setDateErr("");
      return true;
    }
  }

  function oldAmountValidation(value) {
    if (value === "" || value === null || value === 0) {
        setAmountErr("Enter Amount");
      return false;
    } else {
      setAmountErr("");
      return true;
    }
  }
  
  useEffect(() => {
    getClientName();
  }, [])
 
  function getClientName() {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() + "retailerProduct/api/clientRet")

      .then(function (response) {
        if (response.data.success === true) {
        //   setApiData(response.data.data);
          console.log(response.data.data);
          setClientName(response.data.data);
          setLoading(false);
        } else {
          dispatch(
            Actions.showMessage({ message: response.data.message,variant: "success",}));
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch + "retailerProduct/api/clientRet" );
      });
  }

  function getAddOldUdhharAmount() {
    setLoading(true); 
    const body = {
      client_id : oldUdharData.client_id.value ,
      transaction_number : oldUdharData.transaction_number ,
      date : oldUdharData.date,
      udhaar_amount : oldUdharData.udhaar_amount ,
    }
    console.log(body);

   
    axios
      .post(
        Config.getCommonUrl() + "retailerProduct/api/salesDomestic/oldUdhaarAmount/voucher", 
        body
        )

      .then(function (response) {
        if (response.data.success === true) {
        //   setApiData(response.data.data);
          console.log(response.data.data);
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message, variant: "success",}));
        } else {
          dispatch(
            Actions.showMessage({ message: response.data.message, variant: "success",}));
          // setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch + "retailerProduct/api/salesDomestic/oldUdhaarAmount/voucher" , 
        body,);
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
              <Grid item xs={6} sm={6} md={6} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                        Add Old Udhaar Amount
                  </Typography>
                </FuseAnimate>
              </Grid>

              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              >
                 <Button
                    id="btn-back"
                    size="small"
                    onClick={(event) => {
                      History.goBack();
                    }}
                    style={{ margin: "0" }}
                  >
                      <img
                           className="back_arrow"
                           src={Icones.arrow_left_pagination}
                           alt=""/>
                    Back
                  </Button>
              </Grid>

            </Grid>


            {loading && <Loader />}
            <div className="main-div-alll ">
              <Grid
                className="department-main-dv"
                container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0 }}
              >

                <Grid
                  item lg={3} md={5} sm={5} xs={13}
                  style={{ padding: 6, paddingLeft: 0 }}
                >
                  <p style={{ paddingBottom: "3px" }}>Select Client</p>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={clientName
                      .map((row) => ({
                        value: row.id,
                        label: row.client_Name,   
                      }))}
                    autoFocus
                    blurInputOnSelect
                    tabSelectsValue={false}
                    value={oldUdharData.client_id}
                    onChange={handleClientChange}
                    placeholder="Select Client"
                  />
                  <span style={{ color: "red" }}>
                    {clientNameErr.length > 0 ? clientNameErr : ""}
                  </span>
                </Grid>


                  <Grid
                    item lg={3} md={5} sm={5} xs={13}
                    style={{ padding: 6 }}
                  >
                    <p style={{ paddingBottom: "3px" }}>Voucher Number</p>
                    <TextField
                    placeholder="Voucher Number"
                    name="transaction_number"
                    value={oldUdharData.transaction_number}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                  />
                     <span style={{ color: "red" }}>
                    {voucherNumberErr.length > 0 ? voucherNumberErr : ""}
                  </span>
                  </Grid>

                <Grid item lg={3} md={5} sm={5} xs={13} style={{ padding: 6 }}>
                  <p style={{ paddingBottom: "3px" }}>Date</p>
                  <TextField
                    name="date"
                    value={oldUdharData.date}
                    type="date"
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      max: moment().format("YYYY-MM-DD"),
                    }}
                    onChange={handleInputChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                     <span style={{ color: "red" }}>
                    {dateErr.length > 0 ? dateErr : ""}
                  </span>
                </Grid>

                <Grid
                    item lg={3} md={5} sm={5} xs={13}
                    style={{ padding: 6 }}
                  >
                    <p style={{ paddingBottom: "3px" }}>Udhaar amount</p>
                    <TextField
                     name="udhaar_amount"
                     value={oldUdharData.udhaar_amount}
                     onChange={(e) => handleInputChange(e)}
                     placeholder="Udhaar amount"
                     variant="outlined"
                     fullWidth
                  />
                    <span style={{ color: "red" }}>
                    {amountErr.length > 0 ? amountErr : ""}
                  </span>
                  </Grid>
               
              </Grid>    

    
             <Grid
              container
              alignItems="center"
              style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
            >
              <Grid
                item xs={12} sm={12} md={12} style={{ textAlign: "right" }}
              >
                <Button
                  style={{marginLeft:8}}
                  variant="contained"
                  size="small"
                  onClick={handleFormSubmit}
                  className={classes.button}
                >
                    Save
                </Button>
              </Grid>
            </Grid>

            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default SalesRetalier;

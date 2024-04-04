import { FuseAnimate } from '@fuse';
import { Button, Grid, Icon, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import NavbarSetting from 'app/main/NavbarSetting/NavbarSetting';
import React, { useEffect, useState } from 'react'
import {useDispatch} from 'react-redux';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Select, { createFilter } from "react-select";
import Icones from "assets/fornt-icons/Mainicons";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
import { values } from 'lodash';



const useStyles = makeStyles((theme) => ({
    root: {},
    paper: {
      position: "absolute",
      // width: 400,
      zIndex: 1,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      outline: "none",
    },
    table: {
      tableLayout: "auto"
    },
    button: {
      // margin: 5,
      textTransform: "none",
      backgroundColor: "gray",
      color: "white",
    },
    tablePad: {
      padding:"0px"
    },
    tableRowPad:{
      padding:"7px"
    }
}))

const AddOldJewelleryPurchase = (props) => {

  useEffect(() => {
    NavbarSetting("Sales-Retailer", dispatch); 
  }, []);
  
  // const [isView, setIsView] = useState(false); //for view Only

  const dispatch = useDispatch();
  const classes = useStyles();

  // const [packingSlipData, setPackingSlipData] = useState([
  //   {},
  // ]);

   
  const [packingSlipData, setPackingSlipData] = useState([
    {
      stock_code:"",      
      gross_wgt: "",
      other_material:"",
      net_wgt: "",
      purity:"",
      fine_gold:"",
      gold_rate:"",     
      errors: {},
    },
  ]);

  console.log(packingSlipData);

  const handleChange = (index, event) => {
  }

  const addNewRow = () => {
    setPackingSlipData([
      ...packingSlipData,
      { 
      stock_code:"",      
      gross_wgt: "",
      other_material:"",
      net_wgt: "",
      purity:"",
      fine_gold:"",
      gold_rate:"",     
      errors: {},
    },
    ]);
  };

  const handleCatChange = (index, e) => {
    const {value, name} = e.target
    const oldData = [...packingSlipData];
    oldData[index][name] = value
    console.log(oldData);
    setPackingSlipData(oldData);
    if (!oldData[index + 1]) {
      addNewRow();
    }
  }
    
  const deleteRow = (index) => {
    console.log(packingSlipData);
    const oldData = [...packingSlipData];
     if (oldData[index + 1]) {
      oldData.splice(index, 1);
      setPackingSlipData(oldData);
      console.log(oldData)
     }
    
  };


  const [CustomerName, setCustomerName] = useState("");
  const [CustomerNameErr, setCustomerNameErr] = useState("");
  
  const[mobileNum ,setMobileNum] = useState("");
  const[mobileNumErr ,setMobileNumErr] = useState("");

  const[CustomerEmail ,setCustomerEmail] = useState("");
  const[CustomerEmailErr ,setCustomerEmailErr] = useState("");

  const [pincode, setPincode] = useState("");
  const [pincodeErr, setPincodeErr] = useState("");

  const [CustomerAddress, setCustomerAddress] = useState("");
  const [CustomerAddressErr, setCustomerAddressErr] = useState("");

  const [stateData, setStateData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateErr, setSelectedStateErr] = useState("");

  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryErr, setSelectedCountryErr] = useState("");

  const [cityData, setCityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCityErr, setSelectedCityErr] = useState("");

  const [panNumber, setpanNumber] = useState("");
  const [panNumberErr, setpanNumberErr] = useState("");

  const[StreetName, setStreetName] = useState("");
  const[StreetNameErr,setStreetNameErr] = useState("");

  const theme = useTheme();
  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "CustomerName") {
      setCustomerName(value);
      setCustomerNameErr("");
    } 
      else if (name === "phoneNo") {
      setMobileNum(value);
      setMobileNumErr("");
    } 
      else if (name === "SalesManEmail") {
      setCustomerEmail(value);
      setCustomerEmailErr("");
    } 
      else if (name === "pincode") {
      setPincode(value);
      setPincodeErr("");
    } 
      else if (name === "address") {
      setCustomerAddress(value);
      setCustomerAddressErr("");
    } 
    else if (name === "panNumber") {
      setpanNumber(value);
      setpanNumberErr("");
    }
    else if (name === "StreetName") {
      setStreetName(value);
      setStreetNameErr("");
    }
  }

  function CustomerNameValidation() {
    var Regex = /^[a-zA-Z\s]*$/;
    if (!CustomerName || Regex.test(CustomerName) === false) {
      setCustomerNameErr("Enter Valid Customer Name");
      return false;
    }
    return true;
  }
  
  function mobileNumberValidation() {
    var Regex = /^[0-9]{10}$/;
    if (!mobileNum || Regex.test(mobileNum) === false) {
      setMobileNumErr("Enter Valid Mobile Number");
      return false;
    }
    return true;
  }
 
  function emailValidation() {
    // const Regex = /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g;
     const Regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!CustomerEmail || Regex.test(CustomerEmail) === false) {
      setCustomerEmailErr("Enter Valid Email Id");
      return false;
    }
    return true;
  }

 function pincodeValidation() {
    const Regex = /^(\d{4}|\d{6})$/;
    if (!pincode || Regex.test(pincode) === false) {
      setPincodeErr("Enter Valid pincode");
      return false;
    }
    return true;
  }
  
  function addressValidation() {
    // const Regex = ""; Regex.test(SalesManAddress) === false
    if (!CustomerAddress || CustomerAddress === "") {
      CustomerAddressErr("Enter Valid Address");
      return false;
    }
    return true;
  }

  function countryValidation() {
    if (selectedCountry === "") {
      setSelectedCountryErr("Please Select Country");
      return false;
    }
    return true;
  }

  function stateValidation() {
    if (selectedState === "") {
      setSelectedStateErr("Please Select State");
      return false;
    }
    return true;
  }

  function cityValidation() {
    if (selectedCity === "") {
      setSelectedCityErr("Please Select City");
      return false;
    }
    return true;
  }

  // function validatePAN() {
  //   var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
  //   if (panNumber && regpan.test(panNumber)) {
  //     return true;
  //   } else {
  //     setpanNumberErr("Enter valid pan number");
  //     return false;
  //   }
  // }

  function StreetNameValidation() {
    var Regex = /^[a-zA-Z\s]*$/;
    if (!StreetName || Regex.test(StreetName) === false) {
      setStreetNameErr("Enter Valid Street / Building Name");
      return false;
    }
    return true;
  }
  
  function handleFormSubmit(ev) {
    ev.preventDefault();
    // resetForm();

    if (
      CustomerNameValidation() &&
      mobileNumberValidation() &&
      emailValidation() && 
      pincodeValidation() &&
      addressValidation() &&
      countryValidation() &&
      stateValidation() &&
      cityValidation() &&
      // validatePAN() &&
      StreetNameValidation()
    ) {
      callAddCustomerApi();
    } else {
    }
  }

  function callAddCustomerApi() {
    let data;
    if ( CustomerName !== "") {
      data = {
        name: CustomerName,
        number: mobileNum,
        email : CustomerEmail,
        pincode :pincode,
        address: CustomerAddress,
        city: selectedCity.value,
        country: selectedCountry.value,
        state: selectedState.value,
        pan_number: panNumber,
        street_name: StreetName,
      };
    } else {
      data = {
        name: CustomerName,
        number: mobileNum,
        email : CustomerEmail,
        pincode :pincode,
        address: CustomerAddress,
        city: selectedCity.value,
        country: selectedCountry.value,
        state: selectedState.value,
        pan_number: panNumber,
        street_name: StreetName,    
      };
    }

    axios
    .post(Config.getCommonUrl() + "api/oldjewellerypurchase", data)
    .then(function (response) {

      if (response.data.success === true) {
        History.goBack(); //.push("/dashboard/masters/vendors");

        dispatch(
          Actions.showMessage({
            message: response.data.message,
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
      handleError(error, dispatch, { api: "api/oldjewellerypurchase", body: data });
    });
}

useEffect(() => {
  // getStatedata();
  getCountrydata();
  //eslint-disable-next-line
}, []);

function getCountrydata() {
  axios
    .get(Config.getCommonUrl() + "api/country")
    .then(function (response) {
      if (response.data.success === true) {
        console.log(response);
        setCountryData(response.data.data);
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
      handleError(error, dispatch, { api: "api/country" });
    });
}

function getStatedata(countryID) {
  axios
    .get(Config.getCommonUrl() + "api/country/state/" + countryID)
    .then(function (response) {
      if (response.data.success === true) {
        console.log(response);
        setStateData(response.data.data);
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
      handleError(error, dispatch, { api: "api/country/state/" + countryID });
    });
}

function handleCountryChange(value) {
  setSelectedCountry(value);
  setSelectedCountryErr("");

  setStateData([]);
  setSelectedState("");
  setSelectedStateErr("");

  setCityData([]);
  setSelectedCity("");
  // getCityData(value.value);
  getStatedata(value.value);
}

function handleChangeState(value) {
  setSelectedState(value);
  setSelectedStateErr("");
  setCityData([]);
  setSelectedCity("");
  getCityData(value.value);
}

function getCityData(stateID) {
  axios
    .get(Config.getCommonUrl() + "api/country/city/" + stateID)
    .then(function (response) {
      if (response.data.success === true) {
        console.log(response);
        setCityData(response.data.data);
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
      handleError(error, dispatch, { api: "api/country/city/" + stateID });
    });
}

function handleChangeCity(value) {
  setSelectedCity(value);
  setSelectedCityErr("");
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
                  Add Old jewellery purchase
                  </Typography>
                </FuseAnimate>
              </Grid>
              </Grid>
              <div className="main-div-alll">
           <Grid container spacing={2}
           >
           <Grid item xs={12} sm={6} md={4} lg={3}>
           <p>Voucher No</p>
                      <TextField
                        className=""
                        name=""
                        // value={}
                        // error={Err.length > 0 ? true : false}
                        // helperText={Err}
                        disabled
                        onChange={(e) => handleInputChange(e)}
                         variant="outlined"
                        // required
                        fullWidth
                      />
            </Grid> 
          
           <Grid item xs={12} sm={6} md={4} lg={3}>
           <p>Customer name*</p>
                      <TextField
                        className=""
                        placeholder="Enter customer name"
                        autoFocus
                        name="CustomerName"
                        value={CustomerName}
                        error={CustomerNameErr.length > 0 ? true : false}
                        helperText={CustomerNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
            </Grid> 

           <Grid item xs={12} sm={6} md={4} lg={3}>
           <p>Mobile number*</p>
                      <TextField
                        className=""
                        placeholder="Enter mobile number"
                        name="phoneNo"
                        value={mobileNum}
                        error={mobileNumErr.length > 0 ? true : false}
                        helperText={mobileNumErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
            </Grid> 

           <Grid item xs={12} sm={6} md={4} lg={3}>
           <p>Email id*</p>
                      <TextField
                        className=""
                        placeholder="Enter email id"
                        name="SalesManEmail"
                        value={CustomerEmail}
                        error={CustomerEmailErr.length > 0 ? true : false}
                        helperText={CustomerEmailErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
            </Grid> 

           <Grid item xs={12} sm={6} md={4} lg={3}>
           <p>Pincode*</p>
                      <TextField
                        className=""
                        placeholder="Enter pincode"
                        name="pincode"
                        value={pincode}
                        error={pincodeErr.length > 0 ? true : false}
                        helperText={pincodeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
            </Grid> 

           <Grid item xs={12} sm={6} md={4} lg={3}>
           <p>Address*</p>
                      <TextField
                        className="textarea-input-dv "
                        style={{ background: "white" }}
                        placeholder="Enter address"
                        name="address"
                        value={CustomerAddress}
                        error={CustomerAddressErr.length > 0 ? true : false}
                        helperText={CustomerAddressErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
            </Grid> 

           <Grid item xs={12} sm={6} md={4} lg={3}>
           <p>Country</p>
                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={countryData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        placeholder="Select country"
                      />
                      <span style={{ color: "red" }}>
                        {selectedCountryErr.length > 0
                          ? selectedCountryErr
                          : ""}
                      </span>
            </Grid> 

           <Grid item xs={12} sm={6} md={4} lg={3}>
           <p>State</p>
                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={stateData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        value={selectedState}
                        onChange={handleChangeState}
                        placeholder="Select state"
                      />
                      <span style={{ color: "red" }}>
                        {selectedStateErr.length > 0 ? selectedStateErr : ""}
                      </span>
            </Grid> 

           <Grid item xs={12} sm={6} md={4} lg={3}>
           <p>City</p>
                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={cityData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        value={selectedCity}
                        onChange={handleChangeCity}
                        placeholder="Select city"
                      />
                      <span style={{ color: "red" }}>
                        {selectedCityErr.length > 0 ? selectedCityErr : ""}
                      </span>
            </Grid> 

           <Grid item xs={12} sm={6} md={4} lg={3}>
           <p>Street / Building Name*</p>
                      <TextField
                        className=""
                        placeholder="Enter Street / Building Name"
                        autoFocus
                        name="StreetName"
                        value={StreetName}
                        error={StreetNameErr.length > 0 ? true : false}
                        helperText={StreetNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
            </Grid> 

           <Grid item xs={12} sm={6} md={4} lg={3}>
           <p>Pancard / AdharCard</p>
                      <TextField
                        className=""
                        placeholder="Enter PanCard or Adharcard No"
                        name="panNumber"
                        value={panNumber}
                        error={panNumberErr.length > 0 ? true : false}
                        helperText={panNumberErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                      />
            </Grid> 

          
           </Grid>

                <Paper style={{ overflowY: "auto", marginTop: 18 }}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow style={{ borderBottom:"1px solid rgba(224,224,224,1)"}} >
                        <TableCell colSpan={8} style={{padding:"7px"}}>
                        <div
                  id="jewellery-head"
                  // className="mt-16 "4
                  className=''
                  style={{ 
                    padding:"0px",
                    border: "1px solid #EBEEFB",
                    background: "#EBEEFB",
                    fontWeight: "700",
                    justifyContent: "center",
                    display: "flex",
                    borderRadius: "7px",
                   
                  }}
                >
                    <label style={{textAlign:"center", width:"30%"}}>
                    Jewellery calculation</label>

                     </div>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell style={{Width:"50px"}} align='center'>
                            
                        </TableCell>

                        <TableCell  className={classes.tableRowPad} >
                        Stock Code
                        </TableCell>

                        <TableCell  className={classes.tableRowPad} >
                        Gross Weight
                        </TableCell>

                        <TableCell className={classes.tableRowPad} >
                        Other material
                        </TableCell>   
                        
                        <TableCell className={classes.tableRowPad} >
                        Net weight
                        </TableCell>

                        <TableCell className={classes.tableRowPad} >
                        karat/Purity
                        </TableCell>   
                        
                        <TableCell className={classes.tableRowPad} >
                        Fine Gold
                        </TableCell>

                        <TableCell className={classes.tableRowPad} >
                        Gold Rate per 10 gram
                        </TableCell>
                      
                      </TableRow>
                    </TableHead>
                   
                   <TableBody>
                   {packingSlipData.map((element, index) => (
                    <TableRow key={index}>
                       
                            <TableCell className={classes.tablePad} style={{paddingLeft: 0, textAlign:"center" }}>
                              <IconButton
                                style={{ padding: "0" }}
                                tabIndex="-1"
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  deleteRow(index);
                                }}
                              >
                                <Icon className="delete-icone" >
                                  <img src={Icones.delete_red} alt="delete" />
                                </Icon>
                              </IconButton>
                            </TableCell>
                          
                          <TableCell className={classes.tablePad}>
                            <TextField
                             name='stock_code'
                            value={element.stock_code}
                              variant="outlined"
                              fullWidth
                              placeholder='Stock Code'
                              onChange={(e) => {
                                handleCatChange(index, e);
                              }}

                              // className={clsx(
                              //   classes.selectBox,
                              //   "selectdropdown_main-dv"
                              // )}
                              
                            />
                          </TableCell>

                        <TableCell className={classes.tablePad}>
                            <TextField
                              onChange={(e) => handleCatChange(index, e)}
                              name='gross_wgt'
                              value={element.gross_wgt}
                              variant="outlined"
                              fullWidth
                              placeholder='Gross Weight'
                              // className={clsx(
                              //   classes.selectBox,
                              //   "selectdropdown_main-dv"
                              // )}
                            />
                          </TableCell>

                          <TableCell className={classes.tablePad}>
                            <TextField
                              onChange={(e) => handleCatChange(index, e)}
                              name='other_material'
                              value={element.other_material}
                              variant="outlined"
                              fullWidth
                              placeholder='Other Material'
                            />
                          </TableCell>

                          <TableCell className={classes.tablePad}>
                            <TextField
                              onChange={(e) => handleCatChange(index, e)}
                              name='net_wgt'
                              value={element.net_wgt}
                              variant="outlined"
                              fullWidth
                              placeholder='Net Weight'
                            />
                          </TableCell>

                          <TableCell className={classes.tablePad}>
                            <TextField
                              onChange={(e) => handleCatChange(index, e)}
                              name='purity'
                              value={element.purity}
                              variant="outlined"
                              fullWidth
                              placeholder='Karat / Purity'
                            />
                          </TableCell>

                          <TableCell className={classes.tablePad}>
                            <TextField
                              onChange={(e) => handleCatChange(index, e)}
                              name='fine_gold'
                              value={element.fine_gold}
                              variant="outlined"
                              fullWidth
                              placeholder='Fine Gold'
                            />
                          </TableCell>

                          <TableCell className={classes.tablePad}>
                            <TextField
                              onChange={(e) => handleChange(index, e)}
                              name='gold_rate'
                              value={element.gold_rate}
                              variant="outlined"
                              fullWidth
                              placeholder='Gold Rate'
                            />
                          </TableCell>


                        
                    </TableRow>
                   ))}
                     
                   </TableBody>
              
                  </Table>
                </Paper>
         
                <div style={{ paddingBottom: "15px", marginTop:"15px" }}>
                  <div
                    className="table-row-source"
                    style={{
                      background: "#EBEEFB",
                      fontWeight: "700",
                      padding:"5px",
                    }}
                  >  
                    <div
                      className={clsx(
                        classes.tableheader,
                        "flex justify-end " ,
                        "float-right "
                      )}
                      style={{ alignItems:"center"}}
                    >
                      Total
                      <TextField style={{maxWidth:"180px" , borderRadius:"7px"}}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      // fullWidth
                      disabled
                      className={"netweight_input_dv ml-16"}
                    />
                    </div>
                  </div>
                </div>

                <div style={{ paddingBottom: "15px" }}>
                  <div
                    className="table-row-source"
                    style={{
                      background: "#EBEEFB",
                      fontWeight: "700",
                      padding:"5px",
                    }}
                  >  
                    <div
                      className={clsx(
                        classes.tableheader,
                        "flex justify-end " ,
                        " float-right "
                      )}
                      style={{ alignItems:"center"}}
                    >
                      Discount / Roundoff
                      <TextField style={{maxWidth:"180px" , borderRadius:"7px"}}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      // fullWidth
                      className={"netweight_input_dv ml-16"}
                      placeholder="Discount / Roundoff "
                    />
                    </div>
                  </div>
                </div>

                <div style={{ paddingBottom: "15px" }}>
                  <div
                    className="table-row-source"
                    style={{
                      background: "#EBEEFB",
                      fontWeight: "700",
                      padding:"5px",
                    }}
                  >  
                    <div
                      className={clsx(
                        classes.tableheader,
                        "flex justify-end " ,
                        " float-right "
                      )}
                      style={{ alignItems:"center"}}
                    >
                      Final Amount 
                      <TextField style={{maxWidth:"180px" , borderRadius:"7px"}}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      // fullWidth
                      className={"netweight_input_dv ml-16"}
                      disabled
                    />
                    </div>
                  </div>
                </div>

           

                <Grid item xs={12}>
                <Button
                  variant="contained"
                  id="btn-save"
                  className="w-128 mx-auto mt-16 float-right"
                  aria-placeholder="Register"
                  //   disabled={!isFormValid()}
                  type="submit"
                  onClick={(e) => {
                    handleFormSubmit(e);
                  }}
                >
                  Save
                </Button>
            </Grid>
        
           </div>    
          </div>
        </div>
      </FuseAnimate>
    </div>

  )
}

export default AddOldJewelleryPurchase

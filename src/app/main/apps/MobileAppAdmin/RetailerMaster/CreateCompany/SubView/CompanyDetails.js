import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {  Box, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Select, { createFilter } from "react-select";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  form: {
    marginTop: "3%",
    display: "contents",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

// const CompanyDetails = (props) => {
  const CompanyDetails = forwardRef((props, ref) => {
    // The component instance will be extended
    // with whatever you return from the callback passed
    // as the second argument
    useImperativeHandle(ref, () => ({
      checkValidation() {
        // alert("getAlert from Child");
        console.log("getAlert from Child");
        return (
          compNmValidation() &&
          countryValidation() &&
          stateValidation() &&
          cityValidation() &&
          // pincodeValidation() &&
          // phoneNumberValidation() &&
          contryCodeValidation() &&
          MobileNoValidation() &&
          emailValidation() &&
          gstNumberValidation() &&
          panNumberValidation() &&
          partyTypeValidation() &&
          orderPcsValidation()
        );
      },
      getData() {
        // const clientArr = []
        // partyType.map((item) => clientArr.push(item.value))
        return {
          company_name: companyName,
          country_name: selectedCountry,
          state_name: selectedState,
          city_name: selectedCity,
          pincode: pincode,
          address: address,
          company_mob: mobileNo,
          company_tel: companyTel,
          company_email_for_orders: companyEmail,
          gst_in: GstNumber,
          pan_number: panNumber,
          // "under_distributor_name": partyType.label,
          client_id: partyType, //clientArr,//client id in array might be multiple so
          order_pieces: orderPcs,
          first_country_id: mobileNoContry.value,
        };
      },
    }));
    const dispatch = useDispatch();
  
    const [companyName, setCompanyName] = useState("");
    const [compNmErr, setCompNmErr] = useState("");
  
    const [GstNumber, setGstNumber] = useState("");
    const [gstNumErr, setGstNumErr] = useState("");
  
    const [panNumber, setPanNumber] = useState("");
    const [panNumErr, setPanNumErr] = useState("");
  
    const [companyTel, setCompanyTel] = useState("");
    const [compTelErr, setCompTelErr] = useState("");
  
    const [mobileNo, setMobileNo] = useState("");
    const [mobileNoContry, setMobileNoContry] = useState("");
    const [mobileNoContryErr, setMobileNoContryErr] = useState("");
    const [SecltedmobileNoContry, setSelectedMobileNoContry] = useState("");
    const [mobNumErr, setMobNumErr] = useState("");
  
    const [companyEmail, setCompanyEmail] = useState("");
    const [compEmailErr, setCompEmailErr] = useState("");
  
    const [address, setAddress] = useState("");
    const [addressErr, setAddressErr] = useState("");
  
    const [partyTypeData, setPartyTypeData] = useState([]);
    const [partyType, setPartyType] = useState("");
    const [partyTypeErr, setPartyTypeErr] = useState("");
  
    const [countryData, setCountryData] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCountryErr, setSelectedCountryErr] = useState("");
  
    const [stateData, setStateData] = useState([]);
    const [selectedState, setSelectedState] = useState("");
    const [selectedStateErr, setSelectedStateErr] = useState("");
  
    const [cityData, setCityData] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCityErr, setSelectedCityErr] = useState("");
  
    const [pincode, setPincode] = useState("");
    const [pincodeErr, setPincodeErr] = useState("");
  
    const theme = useTheme();
  
    const [isEdit, setIsEdit] = useState(false);
  
    const [isView, setIsView] = useState(false);
  
    const [orderPcs, setOrderPcs] = useState("2");
    const [orderPcsErr, setOrderPcsErr] = useState("");
  
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
      console.log("CompanyDetails", props);
      setIsView(props.isViewOnly);
      setIsEdit(props.isEdit);
      // if (props.isViewOnly === true) {
      let oneData = props.oneData;
      console.log(oneData);
      if (oneData !== "") {
        setCompanyName(oneData.company_name);
        if(oneData.country_name !== null){
        setSelectedCountry({
          value: oneData.country_name?.id,
          label: oneData.country_name?.name,
        });
      }else{
        setSelectedCountry("")
      }
        if(oneData.state_name !== null){
          setSelectedState({
            value: oneData.state_name?.id,
            label: oneData.state_name?.name,
          });
        }else{
          setSelectedState("")
        }
        if(oneData.state_name !== null || oneData.city_name !== null){
        setSelectedCity({
          value: oneData.city_name?.id,
          label: oneData.city_name?.name,
        });
      } else{
        setSelectedCity("")
      }
        setPincode(oneData.pincode);
        setAddress(oneData.address);
        setCompanyTel(oneData.company_tel);
        setMobileNoContry({
          value: oneData.first_country_id,
          label: `${oneData.first_country_name} (${oneData.first_country_code})
          `,
          Ccode: oneData.first_country_code
        })
        setMobileNo(oneData.company_mob);
        setCompanyEmail(oneData.company_email_for_orders);
        setGstNumber(oneData.gst_in);
        setPanNumber(oneData.pan_number);
        setOrderPcs(oneData.order_pieces);
        // under_distributor_name
        getPartyType();
        getStatedata(oneData.country_name.id);
        if(oneData.state_name !== null){
        getCityData(oneData.state_name.id);
        }
      }
  
      // }
      //eslint-disable-next-line
    }, [props]);
  
    useEffect(() => {
      getCountrydata();
      getPartyType();
      //eslint-disable-next-line
    }, []);
  
    const classes = useStyles();
  
    function handleChangefirstcode(value) {
      setMobileNoContry(value);
      setSelectedMobileNoContry(value.Ccode)
      setMobileNoContryErr("");
    }
  
    function handleInputChange(event) {
      // console.log("handleInputChange");
  
      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      const name = target.name;
      if (name === "companyName") {
        setCompanyName(value);
        setCompNmErr("");
      } else if (name === "pincode") {
        setPincode(value);
        setPincodeErr("");
      } else if (name === "address") {
        setAddress(value);
        setAddressErr("");
      } else if (name === "companyTel") {
        setCompanyTel(value);
        setCompTelErr("");
      } else if (name === "mobileNo") {
        setMobileNo(value);
        setMobNumErr("");
      } else if (name === "GstNumber") {
        setGstNumber(value);
        setGstNumErr("");
      } else if (name === "companyEmail") {
        setCompanyEmail(value);
        setCompEmailErr("");
      } else if (name === "panNumber") {
        setPanNumber(value);
        setPanNumErr("");
      } else if (name === "orderPcs") {
        setOrderPcs(value);
        setOrderPcsErr("");
      }
    }
  
    function compNmValidation() {
      // var Regex = /^[a-zA-Z\s]*$/;
      if (companyName === "") {
        setCompNmErr("Enter Company Name");
        return false;
      }
      return true;
    }
    function contryCodeValidation() {
      if (mobileNoContry.value === undefined) {
        setMobileNoContryErr("Please select Country");
        return false;
      }
      return true;
    }
  
    function MobileNoValidation() {
      var Regex = /^[0-9]{3,}$/;
      if (!mobileNo) {
        setMobNumErr("Please Enter Mobile No");
        return false;
      } else if (Regex.test(mobileNo) === false) {
        setMobNumErr("Please Enter Valid Mobile No");
        return false;
      }
      return true;
    }
  
    // function phoneNumberValidation() {
    //   // var Regex = /^[0-9]{10}$/;
    //   // var Regex = /^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/;
    //   if (companyTel === "") {
    //     setCompTelErr("Enter Valid Phone Number");
    //     return false;
    //   }
    //   return true;
    // }
  
    function emailValidation() {
      //const Regex = /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g;
      const Regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!companyEmail || Regex.test(companyEmail) === false) {
        setCompEmailErr("Enter Valid Email Id");
        return false;
      }
      return true;
    }
  
    function gstNumberValidation() {
      if (GstNumber) {
        const Regex =
          /^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;
        if (!GstNumber || Regex.test(GstNumber) === false) {
          setGstNumErr(
            "Gst number must be contain state-code, pan number and 14th character z."
          );
          return false;
        }
        return true;
      } else {
        return true;
      }
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
  
    // function pincodeValidation() {
    //   const Regex = /^(\d{4}|\d{6})$/;
    //   if (!pincode || Regex.test(pincode) === false) {
    //     setPincodeErr("Enter Valid pincode");
    //     return false;
    //   }
    //   return true;
    // }
  
    function addressValidation() {
      // const Regex = ""; Regex.test(address) === false
      if (!address || address === "") {
        setAddressErr("Enter Valid Address");
        return false;
      }
      return true;
    }
  
    function panNumberValidation() {
      if (panNumber) {
        const Regex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
        if (!panNumber || Regex.test(panNumber) === false) {
          setPanNumErr("Enter Valid Pan Number");
          return false;
        }
        return true;
      } else {
        return true;
      }
    }
  
    function partyTypeValidation() {
      // console.log(partyType)
      if (partyType === "") {
        setPartyTypeErr("Please select party type");
        return false;
      }
      return true;
    }
  
    function orderPcsValidation() {
      const numberRegex = /^[0-9]*$/;
  
      if (!orderPcs || numberRegex.test(orderPcs) === false) {
        setOrderPcsErr("Enter Valid Pieces for Order");
        return false;
      }
      return true;
    }
  
    // function handleFormSubmit(ev) {
    //     ev.preventDefault();
    //     // resetForm();
    //     // console.log(parseInt(gstType));
    //     console.log("handleFormSubmit");
    //     if (
    //         compNmValidation() &&
    //         countryValidation() &&
    //         stateValidation() &&
    //         cityValidation() &&
    //         pincodeValidation() &&
    //         addressValidation() &&
    //         phoneNumberValidation() &&
    //         MobileNoValidation() &&
    //         emailValidation() &&
    //         gstNumberValidation() &&
    //         panNumberValidation() &&
    //         partyTypeValidation() &&
    //         orderPcsValidation()
    //     ) {
    //         console.log("if");
    //         if (isEdit === true) {
    //             updateCompany()
    //         } else {
    //             createCompany()
    //         }
    //     } else {
    //         console.log("else");
    //     }
    // }
  
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
  
    function getPartyType() {
      axios
        .get(Config.getCommonUrl() + "api/client")
        .then(function (response) {
          if (response.data.success === true) {
            console.log(response);
  
            // const key = Object.values(response.data.data);
            // const values = Object.keys(response.data.data);
            // // console.log(key);
            // // console.log(values);
  
            // let temp = [];
            // // .map((suggestion) => ({
            // //   value: suggestion.label,
            // //   label: suggestion.stockGroup,
            // // }));
            // for (let i = 0; i < values.length; i++) {
            //     temp.push({
            //         value: values[i],
            //         label: key[i],
            //     });
            // }
            // console.log(values);
            setPartyTypeData(response.data.data);
  
            if (props.oneData !== "") {
              // && props.isViewOnly === true
              console.log(props.oneData);
              if (props.oneData.retailer.length > 0) {
                let data = response.data.data;
                const selectClientArr = [];
                props.oneData.retailer.map((optn) => {
                  selectClientArr.push(optn.Distributor.id);
                });
                const selectClient = [];
                data.map((item) => {
                  if (selectClientArr.includes(item.id)) {
                    selectClient.push({
                      value: item.id,
                      label: item.name,
                    });
                  }
                });
                setPartyType(selectClient);
              }
            }
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
        })
        .catch((error) => {
          handleError(error, dispatch, { api: "api/client" });
        });
    }
  
    function getCountrydata() {
      axios
        .get(Config.getCommonUrl() + "api/country")
        .then(function (response) {
          if (response.data.success === true) {
            console.log(response);
            setCountryData(response.data.data);
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
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
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
        })
        .catch((error) => {
          handleError(error, dispatch, { api: "api/country/state/" + countryID });
        });
    }
  
    function handleChangeState(value) {
      // console.log(value);
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
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
        })
        .catch((error) => {
          handleError(error, dispatch, { api: "api/country/city/" + stateID });
        });
    }
  
    function handleChangeCity(value) {
      // console.log(value);
      setSelectedCity(value);
      setSelectedCityErr("");
    }
  
    function handleChangePartyType(value) {
      setPartyType(value);
      setPartyTypeErr("");
    }

    
  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            <div className="main-div-alll ">
              <div>
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  // onSubmit={handleFormSubmit}
                >
                  <div className="w-full flex flex-row flex-wrap">

                    <div className="add-textfiled">
                      <p>Company Name</p>
                      <TextField
                        className=""
                        placeholder="Company Name"
                        autoFocus
                        name="companyName"
                        value={companyName}
                        error={compNmErr.length > 0 ? true : false}
                        helperText={compNmErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </div>

                    <div className="add-textfiled">
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
                        placeholder="Country"
                        isDisabled={isView}
                      />
                      <span style={{ color: "red" }}>
                        {selectedCountryErr.length > 0
                          ? selectedCountryErr
                          : ""}
                      </span>
                    </div>

                    <div className="add-textfiled">
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
                        placeholder="State"
                        isDisabled={isView}
                      />
                      <span style={{ color: "red" }}>
                        {selectedStateErr.length > 0 ? selectedStateErr : ""}
                      </span>
                    </div>

                    <div className="add-textfiled">
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
                        placeholder="City"
                        isDisabled={isView}
                      />
                      <span style={{ color: "red" }}>
                        {selectedCityErr.length > 0 ? selectedCityErr : ""}
                      </span>
                    </div>

                    <div className="add-textfiled">
                      <p>Pincode</p>
                      <TextField
                        className=""
                        placeholder="Pincode"
                        name="pincode"
                        value={pincode}
                        error={pincodeErr.length > 0 ? true : false}
                        helperText={pincodeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </div>

                    <div className="add-textfiled addmobile-textara">
                      <p>Address</p>
                      <TextField
                        placeholder="Address"
                        name="address"
                        value={address}
                        error={addressErr.length > 0 ? true : false}
                        helperText={addressErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </div>

                    <div className="add-textfiled">
                      <p>Company Tel</p>
                      <TextField
                        className=""
                        placeholder="Company Tel"
                        name="companyTel"
                        value={companyTel}
                        error={compTelErr.length > 0 ? true : false}
                        helperText={compTelErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </div>

                    <div className="add-textfiled">
                      <p>Company Mobile</p>
                      <div style={{display:"flex", }}>                      
                      <Box style={{flexBasis:"50%"}}>
                        <Select
                          className="input-select-bdr-dv"
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          placeholder={<div>Country Code</div>}
                          options={countryData.map((suggestion) => ({
                            value: suggestion.id,
                            label: `${suggestion.name} (${suggestion.phonecode})
                            `,
                            Ccode: suggestion.phonecode
                            // index: index,
                          }))}
                          value={mobileNoContry}
                          onChange={handleChangefirstcode}
                          isDisabled={isView}
                        />
                              <span className={classes.errorMessage}>
                        {mobileNoContryErr.length > 0 ? mobileNoContryErr : ""}
                      </span>
                      </Box>
                      <Box style={{flexBasis:"50%"}}>
                      <TextField
                        placeholder="Company Mobile"
                        name="mobileNo"
                        value={mobileNo}
                        error={mobNumErr.length > 0 ? true : false}
                        helperText={mobNumErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                      </Box>
                      </div>
                    </div>

                    <div className="add-textfiled">
                      <p>Company Email For Orders</p>
                      <TextField
                        className=""
                        placeholder="Company Email For Orders"
                        name="companyEmail"
                        value={companyEmail}
                        error={compEmailErr.length > 0 ? true : false}
                        helperText={compEmailErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </div>

                    <div className="add-textfiled">
                      <p>PAN Number</p>
                      <TextField
                        className=""
                        placeholder="PAN Number"
                        name="panNumber"
                        value={panNumber}
                        error={panNumErr.length > 0 ? true : false}
                        helperText={panNumErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </div>

                    <div className="add-textfiled">
                      <p>GSTin*</p>
                      <TextField
                        className=""
                        placeholder="GSTin "
                        name="GstNumber"
                        value={GstNumber}
                        error={gstNumErr.length > 0 ? true : false}
                        helperText={gstNumErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </div>
     
                    <div className="add-textfiled">
                      <p>Under Distribution Name</p>
                      <Select
                        // className="mb-16"
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        // options={partyTypeData
                        options={partyTypeData.map((item) => ({
                          value: item.id,
                          label: item.name,
                        }))}
                        // components={components}
                        value={partyType}
                        onChange={handleChangePartyType}
                        isMulti
                        placeholder="Under Distribution Name"
                        isDisabled={isView}
                      />
                      <span style={{ color: "red" }}>
                        {partyTypeErr.length > 0 ? partyTypeErr : ""}
                      </span>
                    </div>

                    <div className="add-textfiled">
                      <p>Default Order Pieces</p>
                      <TextField
                        className=""
                        placeholder="Default Order Pieces"
                        name="orderPcs"
                        value={orderPcs}
                        error={orderPcsErr.length > 0 ? true : false}
                        helperText={orderPcsErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </div>

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
});

export default CompanyDetails;

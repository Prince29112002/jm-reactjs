import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Select, { createFilter } from "react-select";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { TextField, Icon, IconButton, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

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
    backgroundColor: "cornflowerblue",
    color: "white",
  },
}));

const CreateLedger = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [ledgerName, setledgerName] = useState("");
  const [ledgerNameErrTxt, setLedgerNameErrTxt] = useState("");

  const [underGroupList, setUnderGroupList] = useState([]);
  const [mainHeadList, setMainHeadList] = useState([]);
  const [selectedMainHead, setSelectedMain] = useState("");
  const [underGroupErrTxt, setUnderGroupErrTxt] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const [selectedTcsTds, setSelectedTcsTds] = useState("");
  const [selectedTcsTdsErr, setSelectedTcsTdsErr] = useState("");
  const [pincode, setPincode] = useState("");
  const [pincodeErr, setPincodeErr] = useState("");

  const [IFSCcode, setIFSCcode] = useState("");
  const [IFSCcodeErr, setIFSCcodeErr] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");
  const [vendorAddressErr, setVendorAddressErr] = useState("");
  const [accType, setAccType] = useState("");
  const [accTypeErr, setAccTypeErr] = useState("");

  const [accNumber, setAccNumber] = useState("");
  const [accNumberErr, setAccNumberErr] = useState("");
  const [cityData, setCityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCityErr, setSelectedCityErr] = useState("");
  const [accHolderName, setAccHolderName] = useState("");
  const [accHolderNameErr, setAccHolderNameErr] = useState("");
  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryErr, setSelectedCountryErr] = useState("");

  const [stateData, setStateData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateErr, setSelectedStateErr] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankNameErr, setBankNameErr] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [panNumErr, setPanNumErr] = useState("");
  const [GstNumber, setGstNumber] = useState("");
  const [gstNumErr, setGstNumErr] = useState("");
  const [gstType, setGstType] = useState("1");
  const [gstTypeErr, setGstTypeErr] = useState("");
  const [moreDetails, setMoreDetails] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [ledgerId, setLedgerId] = useState("");

  useEffect(() => {
    if (props.ledgerId) {
      setIsView(props.isView);
      setIsEdit(!props.isView);
      setLedgerId(props.ledgerId);
      getDataForEdit(props.ledgerId);
    } else {
      getGroupList();
      getMainHeadList();
    }
  }, [dispatch]);

  useEffect(() => {
    if (
      selectedGroup &&
      (selectedGroup.label === "Sundry Debtors" ||
        selectedGroup.label === "Sundry Creditors")
    ) {
      setMoreDetails(true);
      getCountrydata();
    } else {
      setMoreDetails(false);
    }
  }, [selectedGroup]);

  function getGroupList() {
    axios
      .get(Config.getCommonUrl() + "api/group")
      .then((res) => {
        console.log(res);
        setUnderGroupList(res.data.data);
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/group" });
      });
  }

  function getMainHeadList() {
    axios
      .get(Config.getCommonUrl() + "api/mainhead")
      .then((res) => {
        console.log(res);
        setMainHeadList(res.data.data);
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/mainhead" });
      });
  }

  function getDataForEdit(id) {
    axios
      .get(Config.getCommonUrl() + `api/ledger/view/${id}`)
      .then((res) => {
        if (res.data.success) {
          console.log(res);
          const ledData = res.data.data;

          setledgerName(ledData.name);

          setSelectedTcsTds({
            value: ledData.is_tds_tcs,
            label:
              ledData.is_tds_tcs === 0
                ? "No"
                : ledData.is_tds_tcs === 1
                ? "TDS"
                : "TCS",
          });
          setSelectedMain({
            value: ledData?.Mainhead?.id,
            label: ledData?.Mainhead?.name,
          });

          setSelectedGroup({
            value: ledData?.Group?.id,
            label: ledData?.Group?.name,
          });
          if (ledData.Group) {
            if (
              ledData.Group.name === "Sundry Creditors" ||
              ledData.Group.name === "Sundry Debtors"
            ) {
              setGstType(ledData.gst_type.toString());
              setGstNumber(ledData.gst_number);
              setPanNumber(ledData.pan_number);
              setSelectedCountry({
                value: ledData?.CountryName?.id,
                label: ledData?.CountryName?.name,
              });
              setBankName(ledData.bank_name);
              setSelectedState({
                value: ledData?.StateName?.id,
                label: ledData?.StateName?.name,
                statecode: ledData?.StateName?.gst_code,
              });
              setAccHolderName(ledData.bank_account_holder_name);
              setSelectedCity({
                value: ledData?.CityName?.id,
                label: ledData?.CityName?.name,
              });
              getStatedata(ledData?.CountryName?.id);
              getCityData(ledData?.StateName?.id);
              setAccNumber(ledData.bank_account_number);
              setPincode(ledData.pincode);
              setAccType(ledData.bank_account_type);
              setIFSCcode(ledData.ifsc_code);
              setVendorAddress(ledData.address);
            }
          }
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/ledger/view/${id}` });
      });
  }

  const handleClose = () => {
    setOpen(false);
    props.modalColsed();
  };

  const handleModalClose = () => {
    setOpen(false);
    props.headerClose();
  };

  const handleChangeGroup = (value) => {
    if (value) {
      setSelectedGroup(value);
    } else {
      setSelectedGroup("");
    }
    setUnderGroupErrTxt("");
  };

  const handleMainHead = (value) => {
    if (value) {
      setSelectedMain(value);
    } else {
      setSelectedMain("");
    }
    setUnderGroupErrTxt("");
  };

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "ledgerName") {
      setLedgerNameErrTxt("");
      setledgerName(value);
    } else if (name === "IfseCode") {
      setIFSCcode(value);
      setIFSCcodeErr("");
    } else if (name === "address") {
      setVendorAddress(value);
      setVendorAddressErr("");
    } else if (name === "panNumber") {
      setPanNumber(value);
      setPanNumErr("");
    } else if (name === "pincode") {
      setPincode(value);
      setPincodeErr("");
    } else if (name === "accType") {
      setAccType(value);
      setAccTypeErr("");
    } else if (name === "accNumber") {
      setAccNumber(value);
      setAccNumberErr("");
    } else if (name === "accHoldNm") {
      setAccHolderName(value);
      setAccHolderNameErr("");
    } else if (name === "bankName") {
      setBankName(value);
      setBankNameErr("");
    } else if (name === "GstNumber") {
      setGstNumber(value);
      setGstNumErr("");
    }
  };

  const handleChangeTcsTds = (value) => {
    setSelectedTcsTds(value);
    setSelectedTcsTdsErr("");
  };

  const taxLedgerArr = [
    { value: 0, label: "NA" },
    { value: 1, label: "TCS" },
    { value: 2, label: "TDS" },
  ];

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  function ledgerNameValidate() {
    if (ledgerName === "") {
      setLedgerNameErrTxt("Please Enter Ledger Name");
      return false;
    }
    return true;
  }

  function groupSelectValidate() {
    if (
      selectedGroup !== "" &&
      selectedGroup !== null &&
      selectedMainHead !== "" &&
      selectedMainHead !== null
    ) {
      setUnderGroupErrTxt("Select only one (Main Head OR Group)");
      return false;
    }
    if (selectedGroup === "" && selectedMainHead === "") {
      setUnderGroupErrTxt("Please Select Main Head OR Group");
      return false;
    }
    if (selectedGroup === null && selectedMainHead === null) {
      setUnderGroupErrTxt("Please Select Main Head OR Group");
      return false;
    }
    return true;
  }

  function validateTcsTds() {
    if (selectedTcsTds === "" || selectedTcsTds === null) {
      setSelectedTcsTdsErr("Please Select TCS/TDS");
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
  function accHolderNameVAlidation() {
    const Regex = /^[a-zA-Z\s.'-]{2,20}$/;
    if (!accHolderName || Regex.test(accHolderName) === false) {
      setAccHolderNameErr("Enter Valid Account Holder Name");
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
  function bankNameVAlidation() {
    const Regex = /^[a-zA-Z\s&.'-]{2,15}$/;
    if (!bankName || Regex.test(bankName) === false) {
      setBankNameErr("Enter Valid Bank Name");
      return false;
    }
    return true;
  }
  function accNumberValidation() {
    const Regex = /^[0-9]{9,18}$/;
    if (!accNumber || Regex.test(accNumber) === false) {
      setAccNumberErr("Enter Valid Account Number");
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
  function accTypeValidation() {
    const Regex = /^[a-zA-Z\s.'-]{2,10}$/;
    if (!accType || Regex.test(accType) === false) {
      setAccTypeErr("Enter Valid Account Type");
      return false;
    }
    return true;
  }

  function addressValidation() {
    // const Regex = ""; Regex.test(vendorAddress) === false
    if (!vendorAddress || vendorAddress === "") {
      setVendorAddressErr("Enter Valid Address");
      return false;
    }
    return true;
  }

  function IFSCcodeValidation() {
    const Regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!IFSCcode || Regex.test(IFSCcode) === false) {
      setIFSCcodeErr("Enter Valid IFSC Code");
      return false;
    }
    return true;
  }
  function gstTypeValidation() {
    if (gstType === "") {
      setGstTypeErr("Please select Type");
      return false;
    } else {
      if (gstType === "1") {
        if (gstNumberValidation()) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }
  }

  function gstNumberValidation() {
    const Regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    // /^([0][1-9]|[1-2][0-9]|[3][0-7])([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/;
    if (!GstNumber || Regex.test(String(GstNumber)) === false) {
      setGstNumErr(
        "Gst number must be contain state-code, pan number and 14th character z."
      );
      return false;
    }
    return true;
  }
  function panNumberValidation() {
    const Regex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    if (!panNumber || Regex.test(panNumber) === false) {
      setPanNumErr("Enter Valid Pan Number");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!isEdit) {
      if (ledgerNameValidate() && groupSelectValidate() && validateTcsTds()) {
        callAddLedgerApi();
      }
    }
  };
  const handleSecondFormSubmit = (event) => {
    event.preventDefault();
    if (isEdit) {
      if (
        gstTypeValidation() &&
        panNumberValidation() &&
        countryValidation() &&
        bankNameVAlidation() &&
        stateValidation() &&
        accHolderNameVAlidation() &&
        cityValidation() &&
        accNumberValidation() &&
        pincodeValidation() &&
        accTypeValidation() &&
        addressValidation() &&
        IFSCcodeValidation()
      ) {
        callUpdateLedgerApi();
      }
    } else {
      if (
        ledgerNameValidate() &&
        groupSelectValidate() &&
        validateTcsTds() &&
        gstTypeValidation() &&
        panNumberValidation() &&
        countryValidation() &&
        bankNameVAlidation() &&
        stateValidation() &&
        accHolderNameVAlidation() &&
        cityValidation() &&
        accNumberValidation() &&
        pincodeValidation() &&
        accTypeValidation() &&
        addressValidation() &&
        IFSCcodeValidation()
      ) {
        callAddLedgerApi();
      }
    }
  };

  function callAddLedgerApi() {
    const body = {
      name: ledgerName,
      groups_id: selectedGroup === null ? "" : selectedGroup.value,
      main_head_id: selectedMainHead === null ? "" : selectedMainHead.value,
      is_tds_tcs: selectedTcsTds.value,
    };
    if (moreDetails) {
      body.other_details = {
        gst_type: gstType,
        gst_number: GstNumber,
        pan_number: panNumber,
        country: selectedCountry.value,
        state: selectedState.value,
        city: selectedCity.value,
        pincode: pincode,
        address: vendorAddress,
        bank_name: bankName,
        ifsc_code: IFSCcode,
        bank_account_holder_name: accHolderName,
        bank_account_number: accNumber,
        bank_account_type: accType,
      };
    }
    axios
      .post(Config.getCommonUrl() + "api/ledger", body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setledgerName("");
          setSelectedGroup("");
          setUnderGroupList([]);
          setMainHeadList([]);
          setSelectedMain("");
          setSelectedTcsTds("");
          setPincode("");
          setIFSCcode("");
          setVendorAddress("");
          setAccType("");
          setAccNumber("");
          setCityData([]);
          setSelectedCity("");
          setAccHolderName("");
          setCountryData([]);
          setSelectedCountry("");
          setStateData([]);
          setSelectedState("");
          setBankName("");
          setPanNumber("");
          setGstNumber("");
          setGstType("1");
          setMoreDetails(false);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          handleClose();
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
        handleError(error, dispatch, { api: "api/ledger", body: body });
      });
  }

  function callUpdateLedgerApi() {
    const body = {
      gst_type: gstType,
      gst_number: GstNumber,
      pan_number: panNumber,
      country: selectedCountry.value,
      state: selectedState.value,
      city: selectedCity.value,
      pincode: pincode,
      address: vendorAddress,
      bank_name: bankName,
      ifsc_code: IFSCcode,
      bank_account_holder_name: accHolderName,
      bank_account_number: accNumber,
      bank_account_type: accType,
    };
    axios
      .put(Config.getCommonUrl() + `api/ledger/${ledgerId}`, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setledgerName("");
          setSelectedGroup("");
          setUnderGroupList([]);
          setMainHeadList([]);
          setSelectedMain("");
          setSelectedTcsTds("");
          setPincode("");
          setIFSCcode("");
          setVendorAddress("");
          setAccType("");
          setAccNumber("");
          setCityData([]);
          setSelectedCity("");
          setAccHolderName("");
          setCountryData([]);
          setSelectedCountry("");
          setStateData([]);
          setSelectedState("");
          setBankName("");
          setPanNumber("");
          setGstNumber("");
          setGstType("1");
          setMoreDetails(false);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          handleClose();
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
          api: `api/ledger/${ledgerId}`,
          body: body,
        });
      });
  }

  function handleChangeCity(value) {
    setSelectedCity(value);
    setSelectedCityErr("");
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
  function handleChangeState(value) {
    setSelectedState(value);
    setSelectedStateErr("");
    setCityData([]);
    setSelectedCity("");
    getCityData(value.value);
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
    getStatedata(value.value);
  }

  function handleChange(event) {
    setGstType(event.target.value);
    setGstTypeErr("");
  }

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

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleModalClose();
          }
        }}
      >
        <div
          style={modalStyle}
          //  className={classes.paper}
          className={clsx(classes.paper, "rounded-8")}
          id="modesize-dv"
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
            {isView && "View Ledger"}
            {isEdit && "Update Ledger"}
            {!isView && !isEdit && "Create Ledger"}

            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={handleModalClose}
            >
              <Icon style={{ color: "white" }}>close</Icon>
            </IconButton>
          </h5>
          <div style={{ overflow: "auto", padding: "30px", maxHeight: "calc(100vh - 100px)" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <p
                  className="popup-labl"
                  style={{
                    paddingLeft: "15px",
                    marginBottom: "10px"
                  }}
                >
                  Ledger Name
                </p>
                <TextField
                  className=""
                  // label="Ledger Name"
                  name="ledgerName"
                  value={ledgerName}
                  error={ledgerNameErrTxt.length > 0 ? true : false}
                  helperText={ledgerNameErrTxt}
                  onChange={(e) => handleInputChange(e)}
                  autoFocus
                  variant="outlined"
                  fullWidth
                  disabled={isView || isEdit}
                />
              </Grid>

              <Grid item xs={5}>
                <Typography
                  style={{ paddingLeft: "15px", marginBottom: "10px" }}
                >
                  Select Main Head
                </Typography>
                <Select
                  classes={classes}
                  styles={selectStyles}
                  options={mainHeadList.map((group) => ({
                    value: group.id,
                    label: group.name,
                  }))}
                  isClearable
                  filterOption={createFilter({ ignoreAccents: false })}
                  value={selectedMainHead}
                  onChange={handleMainHead}
                  placeholder="Select Main Head"
                  isDisabled={isView || isEdit}
                />
                <span style={{ color: "red" }}>
                  {underGroupErrTxt.length > 0 ? underGroupErrTxt : ""}
                </span>
              </Grid>
              <Grid
                item
                xs={2}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                }}
              >
                <b style={{ marginBottom: "10px" }}>OR</b>
              </Grid>
              <Grid item xs={5}>
                <Typography
                  style={{ paddingLeft: "15px", marginBottom: "10px" }}
                >
                  Select Group
                </Typography>
                <Select
                  classes={classes}
                  styles={selectStyles}
                  options={underGroupList.map((group) => ({
                    value: group.id,
                    label: group.name,
                  }))}
                  isClearable
                  filterOption={createFilter({ ignoreAccents: false })}
                  value={selectedGroup}
                  onChange={handleChangeGroup}
                  placeholder="Select Group"
                  isDisabled={isView || isEdit}
                />
                <span style={{ color: "red" }}>
                  {underGroupErrTxt.length > 0 ? underGroupErrTxt : ""}
                </span>
              </Grid>
              <Grid item xs={12}>
                <Select
                  // classes={classes}
                  // styles={selectStyles}
                  style={{ marginTop: "15px", display: "block" }}
                  options={taxLedgerArr.map((group) => ({
                    value: group.value,
                    label: group.label,
                  }))}
                  isClearable
                  filterOption={createFilter({ ignoreAccents: false })}
                  value={selectedTcsTds}
                  onChange={handleChangeTcsTds}
                  placeholder="Select TCS/TDS"
                  isDisabled={isView || isEdit}
                />
                <span style={{ color: "red" }}>
                  {selectedTcsTdsErr.length > 0 ? selectedTcsTdsErr : ""}
                </span>
              </Grid>
            </Grid>

            {moreDetails && (
              <>
                <Grid container spacing={2} style={{ paddingTop: 15 }}>
                  <Grid item xs={6}>
                    <FormControl
                      component="fieldset"
                      className={classes.formControl}
                    >
                      <FormLabel component="legend">GST Type :</FormLabel>
                      <RadioGroup
                        aria-label="GST Type "
                        name="GSTType"
                        className={classes.group}
                        value={gstType}
                        onChange={handleChange}
                        style={{ flexDirection: "row" }}
                        disabled={true}
                      >
                        {isView ? (
                          <>
                            <FormControlLabel
                              value="1"
                              control={<Radio />}
                              label="Registered"
                              disabled
                            />

                            <FormControlLabel
                              value="0"
                              control={<Radio />}
                              label="UnRegistered"
                              disabled
                            />
                          </>
                        ) : (
                          <>
                            <FormControlLabel
                              value="1"
                              control={<Radio />}
                              label="Registered"
                            />

                            <FormControlLabel
                              value="0"
                              control={<Radio />}
                              label="UnRegistered"
                            />
                          </>
                        )}
                      </RadioGroup>
                      <span style={{ color: "red" }}>
                        {gstTypeErr.length > 0 ? gstTypeErr : ""}
                      </span>
                    </FormControl>
                  </Grid>

                  {gstType === "1" && (
                    <Grid item xs={3}>
                      <p className="popup-labl pb-1">GST Number</p>
                      <TextField
                        className="All-Error-show"
                        placeholder="GST Number"
                        name="GstNumber"
                        value={GstNumber}
                        error={gstNumErr.length > 0 ? true : false}
                        helperText={gstNumErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView ? true : false}
                      />
                    </Grid>
                  )}

                  <Grid item xs={3}>
                    <p className="popup-labl pb-1">PAN Number</p>
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
                      disabled={isView ? true : false}
                    />
                  </Grid>

                  {/* <Grid item xs={3} style={{ padding: 5 }}>
                    <Select
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      options={ledgerMainData.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      // components={components}
                      value={selectMainLedger}
                      onChange={handleLedgerChange}
                      placeholder="Ledger for Sales"
                    />

                    <span style={{ color: "red" }}>
                      {selMainLedgerErr.length > 0 ? selMainLedgerErr : ""}
                    </span>
                  </Grid> */}
                  {/* 
                  <Grid item xs={3} style={{ padding: 5 }}>
                    <TextField
                      id="date"
                      label="Date"
                      type="date"
                      className={classes.inputBox}
                      name="datevalue"
                      value={dateValue}
                      error={dateValueErr.length > 0 ? true : false}
                      helperText={dateValueErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid
                    className="alignment-text-dv"
                    item
                    xs={3}
                    style={{ padding: 5 }}
                  >
                    <TextField
                      // className="mb-16"
                      label="Rate (%)"
                      name="rateValue"
                      value={rateValue}
                      error={rateValueErr.length > 0 ? true : false}
                      helperText={rateValueErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled
                    />
                    <button
                      type="button"
                      className={classes.linkButton}
                      style={{ float: "right" }}
                      onClick={(e) => checkRate(e)}
                    >
                      Show All Rates
                    </button>
                  </Grid> */}

                  <Grid item xs={6}>
                    <p className="popup-labl pb-1">Country</p>
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
                      isDisabled={isView ? true : false}
                    />

                    <span style={{ color: "red" }}>
                      {selectedCountryErr.length > 0 ? selectedCountryErr : ""}
                    </span>
                  </Grid>

                  <Grid item xs={6}>
                    <p className="popup-labl pb-1">Bank Name</p>
                    <TextField
                      className=""
                      placeholder="Bank Name"
                      name="bankName"
                      value={bankName}
                      error={bankNameErr.length > 0 ? true : false}
                      helperText={bankNameErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled={isView ? true : false}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <p className="popup-labl pb-1">State</p>
                    <Select
                      className="mt-2"
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
                      isDisabled={isView ? true : false}
                    />

                    <span style={{ color: "red" }}>
                      {selectedStateErr.length > 0 ? selectedStateErr : ""}
                    </span>
                  </Grid>

                  <Grid item xs={6}>
                    <p className="popup-labl pb-1">Account Holder Name</p>
                    <TextField
                      className="mt-2"
                      placeholder="Account Holder Name"
                      name="accHoldNm"
                      value={accHolderName}
                      error={accHolderNameErr.length > 0 ? true : false}
                      helperText={accHolderNameErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled={isView ? true : false}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <p className="popup-labl pb-1">City</p>
                    <Select
                      className="mt-2"
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
                      isDisabled={isView ? true : false}
                    />

                    <span style={{ color: "red" }}>
                      {selectedCityErr.length > 0 ? selectedCityErr : ""}
                    </span>
                  </Grid>

                  <Grid item xs={6}>
                    <p className="popup-labl pb-1">Account Number</p>
                    <TextField
                      className="mt-2"
                      placeholder="Account Number"
                      name="accNumber"
                      value={accNumber}
                      error={accNumberErr.length > 0 ? true : false}
                      helperText={accNumberErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled={isView ? true : false}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <p className="popup-labl pb-1">Pincode</p>
                    <TextField
                      className="mt-2"
                      placeholder="Pincode"
                      name="pincode"
                      value={pincode}
                      error={pincodeErr.length > 0 ? true : false}
                      helperText={pincodeErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled={isView ? true : false}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <p className="popup-labl pb-1">Account Type</p>
                    <TextField
                      className="mt-2"
                      placeholder="Account Type"
                      name="accType"
                      value={accType}
                      error={accTypeErr.length > 0 ? true : false}
                      helperText={accTypeErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled={isView ? true : false}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <p className="popup-labl pb-1">Address</p>
                    <TextField
                      className="mt-2"
                      placeholder="Address"
                      name="address"
                      value={vendorAddress}
                      error={vendorAddressErr.length > 0 ? true : false}
                      helperText={vendorAddressErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      multiline
                      minRows={6}
                      maxrows={6}
                      disabled={isView ? true : false}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <p className="popup-labl pb-1">IFSC code</p>
                    <TextField
                      className="mb-16 mt-2"
                      placeholder="IFSC code"
                      name="IfseCode"
                      value={IFSCcode}
                      error={IFSCcodeErr.length > 0 ? true : false}
                      helperText={IFSCcodeErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled={isView ? true : false}
                    />
                  </Grid>
                </Grid>
              </>
            )}
            <div
              className="flex flex-row justify-center"
              style={{ columnGap: "20px", paddingTop: "30px" }}
            >
              <Button
                variant="contained"
                className="cancle-button-css"
                hidden={isView ? true : false}
                onClick={(_, reason) => {
                  if (reason !== "backdropClick") {
                    handleModalClose();
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                hidden={isView ? true : false}
                variant="contained"
                className="save-button-css"
                // color="primary"
                // className="w-full mx-auto mt-16"
                // style={{
                //   backgroundColor: "#4caf50",
                //   border: "none",
                //   color: "white",
                // }}

                onClick={(e) =>
                  selectedGroup.label === "Sundry Debtors" ||
                  selectedGroup.label === "Sundry Creditors"
                    ? handleSecondFormSubmit(e)
                    : handleFormSubmit(e)
                }
              >
                {isEdit ? "Update" : "Save"}
              </Button>
            </div>

            {/* <Button
              hidden={isView ? true : false}
              variant="contained"
              color="primary"
              className="w-full mx-auto mt-16"
              style={{
                backgroundColor: "#4caf50",
                border: "none",
                color: "white",
              }}

              onClick={(e) => selectedGroup.label === "Sundry Debtors" || selectedGroup.label === "Sundry Creditors" ? handleSecondFormSubmit(e) : handleFormSubmit(e)}
            >
              {isEdit ? "Update" : "Save"}
            </Button> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateLedger;

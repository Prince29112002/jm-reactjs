import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import { FuseAnimate } from "@fuse";
import {
  Button,
  Grid,
  Icon,
  IconButton,
  makeStyles,
  TextareaAutosize,
  TextField,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as Actions from "app/store/actions";
import Modal from "@material-ui/core/Modal";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Icones from "assets/fornt-icons/Mainicons";
import Loader from "../../../Loader/Loader";
import Select, { createFilter } from "react-select";

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
    marginTop: 15,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  tableheader: {
    display: "inline-block",
    textAlign: "center",
  },
  radioTab:{
    width: "10%",
    padding: 7,
    textAlign: "center",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
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

const SiteSettings = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [company, setCompany] = useState("");
  const [modalStyle] = useState(getModalStyle);
  const [companyNameErr, setCompanyNameErr] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyAddressErr, setCompanyAddressErr] = useState("");
  const [city, setCity] = useState("");
  const [cityErr, setCityErr] = useState("");
  const [state, setState] = useState("");
  const [stateErr, setStateErr] = useState("");
  const [pin, setPin] = useState("");
  const [pinErr, setPinErr] = useState("");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [website, setWebsite] = useState("");
  const [websiteErr, setWebsiteErr] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [gstNoErr, setGstNoErr] = useState("");
  const [panNo, setPanNo] = useState("");
  const [panNoErr, setPanNoErr] = useState("");
  const [cinNo, setCinNo] = useState("");
  const [cinNoErr, setCinNoErr] = useState("");
  const [showBankName, setShowBankName] = useState("");
  const [showBranches, setShowBranches] = useState("");
  const [showAccountNumber, setShowAccountNumber] = useState("");
  const [showIFC, setShowIFC] = useState("")
  const [bankName, setBankName] = useState("");
  const [bankNameErr, setBankNameErr] = useState("");
  const [branch, setBranch] = useState("");
  const [branchErr, setBranchErr] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [accountNoErr, setAccountNoErr] = useState("");
  const [androidLatestVersion, setAndroidLatestVersion] = useState("");
  const [androidLatestVersionName, setAndroidLatestVersionName] = useState("");
  const [androidLatestVersionNameErr, setAndroidLatestVersionNameErr] =
    useState("");
  const [androidLatestVersionErr, setAndroidLatestVersionErr] = useState("");
  const [iosLatestVersion, setIosLatestVersion] = useState("");
  const [iosLatestVersionName, setIosLatestVersionName] = useState("");
  const [iosLatestVersionNameErr, setIosLatestVersionNameErr] = useState("");
  const [iosLatestVersionErr, setIosLatestVersionErr] = useState("");
  const [title, setTitle] = useState("");
  const [whatsappnumber, setWhatsappnumber] = useState("");
  const [whatsappnumberErr, setWhatsappnumberErr] = useState("");
  const [description, setDescription] = useState("");
  const [ifsccode, setIfsccode] = useState("");
  const [ifsccodeErr, setIfsccodeErr] = useState("");
  const [siteId, setSiteId] = useState("");
  const [forceUpdate, setForceUpdate] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [contactNumberErr, setContactNumberErr] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imgFile, setImgFile] = useState("");
  const [signatureimageUrl, setSignatureImageUrl] = useState("");
  const [signatureimgFile, setSignatureImgFile] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState("")
  const [loading, setLoading] = useState(false);
  const [licenseAndroid, setLicenseAndroid] = useState("");
  const [licenseIOS, setLicenseIOS] = useState("");
  const [isView, setIsView] = useState(false);
  const [mobileNoContry, setMobileNoContry] = useState("");
  const [SecltedmobileNoContry, setSelectedMobileNoContry] = useState("");
  const [mobileNoContryErr, setMobileNoContryErr] = useState("");
  const [countryData, setCountryData] = useState([]);

  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    getBankList()
    getSiteSetting()
    getCountrydata();

    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000); // 10초 뒤에
    }
  }, [loading]);
  // function handleFormSubmit(event) {
  //   event.preventDefault();
  //   if (
  //     companyNamevalidation() &&
  //     Addressvalidation() &&
  //     cityValidation() &&
  //     stateValidation() &&
  //     pincodeValidation() &&
  //     emailValidation() &&
  //     websiteValidation() &&
  //     accountNoValidation() &&
  //     branchValidation() &&
  //     bankNameValidation() &&
  //     cinNoValidation() &&
  //     panNoValidation() &&
  //     gstNoValidation() &&
  //     ifsccodeValidation() &&
  //     androidversioncodeValidation() &&
  //     androidversionName() &&
  //     iosVersoinCode() &&
  //     iosVersoinName()
  //   ) {
  //     callAddSiteSettingApi();
  //   }
  // }

  function getSiteSetting() {

    axios
      .get(Config.getCommonUrl() + "api/siteSetting")
      .then(function (response) {
        if (response.data.success === true) {
          const data = response.data.data;
          setSiteId(data.id);
          setCompany(data.company_name);
          setCompanyAddress(data.company_address);
          setCity(data.city);
          setState(data.state);
          setPin(data.pin);
          setEmail(data.email);
          setWebsite(data.website);
          setGstNo(data.gst_number);
          setPanNo(data.pan_number);
          setCinNo(data.cin_number);
          setShowBankName(data.bank_name)
          setShowBranches(data.branch)
          setShowAccountNumber(data.bank_account_number)
          setShowIFC(data.ifsc_code)
          setAndroidLatestVersion(data.android_version_code);
          setAndroidLatestVersionName(data.android_version_name);
          setIosLatestVersion(data.ios_version_code);
          setIosLatestVersionName(data.ios_version_name);
          setTitle(data.title);
          setDescription(data.description);
          setLicenseIOS(data.tray_license_key_ios);
          setLicenseAndroid(data.tray_license_key_android);
          setWhatsappnumber(data.mobile_whatsapp_contact);
          setMobileNoContry({
            value: data.first_country_id,
            label: `${data.first_country_name} (${data.first_country_code})`,
            Ccode: data.first_country_code,
          });
          setContactNumber(data.contact_number);
          setForceUpdate(data.is_force_update);
          setImageUrl(
            Config.getS3Url() + "vkjdev/siteSetting/image/" + data.image_file
          );
          setSignatureImageUrl(data.stamp);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message ,variant: "error",}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/siteSetting" });
      });
  }

  function addBankDetails(event){
    event.preventDefault();
    if(bankNameValidation() &&
    branchValidation() &&
    accountNoValidation() &&
    ifsccodeValidation() ){
      const body = {
        bank_name : bankName,
        branch_name : branch,
        account_number : accountNo,
        ifsc_code : ifsccode,
        first_country_id: mobileNoContry.value,
      }
      if(isEdit){
        updateBankApi(body)
      }else{
        callAddBankApi(body)
      }
    }
  }

  function updateBankApi(body){
    axios.put(Config.getCommonUrl() + `api/bankdetails/${editId}`,body)
    .then((response)=>{
      console.log(response)
      if(response.data.success){
        dispatch(Actions.showMessage({ message: response.data.message ,variant: "success",}));
        getBankList()
        setEditId("")
        getSiteSetting()
        setModalOpen(false)
      }else{
        dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
      }
    })
    .catch((error)=>{
      handleError(error, dispatch, { api: `api/bankdetails/${editId}`, body: body})
    })
  }

  function callAddBankApi(body){
    axios.post(Config.getCommonUrl() + `api/bankdetails`,body)
    .then((response)=>{
      console.log(response)
      if(response.data.success){
        dispatch(Actions.showMessage({ message: response.data.message,variant: "success", }));
        if(apiData.length === 0){
          getSiteSetting()
        }
        getBankList()
        setModalOpen(false)
      }else{
        dispatch(Actions.showMessage({ message: response.data.message,variant: "error"}));
      }
    })
    .catch((error)=>{
      handleError(error, dispatch, { api: `api/bankdetails`, body: body})
    })
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    if (companyNamevalidation() &&
        Addressvalidation() &&
        cityValidation() &&
        stateValidation() &&
        pincodeValidation() &&
        emailValidation() &&
        websiteValidation() &&
        cinNoValidation() &&
        panNoValidation() &&
        gstNoValidation() &&
        androidversioncodeValidation() &&
        androidversionName() &&
        iosVersoinCode() &&
        iosVersoinName()&&
        whatsAppNumberValidation()&&
        phoneNumberValidation()
    ) {
        callAddSiteSettingApi()

    }
}


  function callAddSiteSettingApi() {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", imgFile);
    formData.append("stamp", signatureimgFile);
    formData.append("company_name", company);
    formData.append("company_address", companyAddress);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("pin", pin);
    formData.append("email", email);
    formData.append("website", website);
    formData.append("gst_number", gstNo);
    formData.append("pan_number", panNo);
    formData.append("cin_number", cinNo);
    formData.append('bank_name', showBankName);
    formData.append('branch', showBranches);
    formData.append('bank_account_number', showAccountNumber);
    formData.append("android_version_code", androidLatestVersion);
    formData.append("android_version_name", androidLatestVersionName);
    formData.append("ios_version_name", iosLatestVersion);
    formData.append("ios_version_code", iosLatestVersionName);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tray_license_key_android", licenseAndroid);
    formData.append("tray_license_key_ios", licenseIOS);
    formData.append('ifsc_code', showIFC);
    formData.append("mobile_whatsapp_contact", whatsappnumber);
    formData.append("is_force_update", forceUpdate);
    formData.append("contact_number", contactNumber);
    formData.append("first_country_id", mobileNoContry.value);

    axios
      .put(Config.getCommonUrl() + `api/siteSetting/update/${siteId}`, formData)

      .then(function (response) {
        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "success",
        }));
          getAllStiteSettingData()
          setLoading(false);

        } else {
          dispatch(Actions.showMessage({ message: response.data.message ,variant: "error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/siteSetting/update/${siteId}`,
          body: JSON.stringify(formData),
        });
      });
  }

  
  function getBankList(){
    axios
    .get(Config.getCommonUrl() + "api/bankdetails")
    .then(function (response) {
      if (response.data.success === true) {
        console.log(response);
        setApiData(response.data.data)
      }else{
        dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        setApiData([]);
      }
    })
    .catch(function (error) {
      setApiData([]);
      handleError(error, dispatch, {api : "api/bankdetails"})
    });
  }

  function getAllStiteSettingData() {
    axios
      .get(Config.getCommonUrl() + "api/siteSetting/")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          var apiRes = JSON.stringify(response.data.data);
          localStorage.setItem("siteSetting", apiRes);
        }else{
          localStorage.setItem("siteSetting", []);
        }
      })
      .catch(function (error) {
        localStorage.setItem("siteSetting", []);
        handleError(error, dispatch, {api : "api/siteSetting/"})
      });
  }

  function setImages(imgFile) {
    setImageUrl(URL.createObjectURL(imgFile));
    setImgFile(imgFile);
  }

  function setSignature(signatureimgFile) {
    console.log(signatureimgFile);
    setSignatureImageUrl(URL.createObjectURL(signatureimgFile));
    setSignatureImgFile(signatureimgFile);
  }

  function handleInputChange(event) {

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForceUpdate(event.target.value);

    const name = target.name;
    if (name === "companyName") {
      setCompany(value);
      setCompanyNameErr("");
    } else if (name === "companyAddress") {
      setCompanyAddress(value);
      setCompanyAddressErr("");
    } else if (name === "city") {
      setCity(value);
      setCityErr("");
    } else if (name === "state") {
      setState(value);
      setStateErr("");
    } else if (name === "pin") {
      setPin(value);
      setPinErr("");
    } else if (name === "email") {
      setEmail(value);
      setEmailErr("");
    } else if (name === "website") {
      setWebsite(value);
      setWebsiteErr("");
    } else if (name === "gstNo") {
      setGstNo(value);
      setGstNoErr("");
    } else if (name === "panNo") {
      setPanNo(value);
      setPanNoErr("");
    } else if (name === "cinNo") {
      setCinNo(value);
      setCinNoErr("");
    } else if (name === "bankName") {
      setBankName(value);
      setBankNameErr("");
    } else if (name === "branch") {
      setBranch(value);
      setBranchErr("");
    } else if (name === "accountNo") {
      setAccountNo(value);
      setAccountNoErr("");
    } else if (name === "ifsccode") {
      setIfsccode(value);
      setIfsccodeErr("");
    } else if (name === "iosversion") {
      setIosLatestVersion(value);
      setBankNameErr("");
    } else if (name === "iosname") {
      setIosLatestVersionName(value);
      setIosLatestVersionNameErr("");
    } else if (name === "androidversion") {
      setAndroidLatestVersion(value);
      setAndroidLatestVersionErr("");
    } else if (name === "androidname") {
      setAndroidLatestVersionName(value);
      setAndroidLatestVersionNameErr("");
    } else if (name === "title") {
      setTitle(value);
    } else if (name === "description") {
      setDescription(value);
    } else if (name === "licenseandroid") {
      setLicenseAndroid(value);
    } else if (name === "licenseios") {
      setLicenseIOS(value);
    } else if (name === "wpnumber") {
      setWhatsappnumber(value);
      setWhatsappnumberErr("")
    } else if (name === "contactNumber") {
      if (!isNaN(Number(value))) {
        setContactNumber(value);
        setContactNumberErr("")
      }
    }
  }
  function companyNamevalidation() {
    if (company === "") {
      setCompanyNameErr("Enter company Name");
      return false;
    }
    return true;
  }
  function Addressvalidation() {
    if (companyAddress === "") {
      setCompanyAddressErr("Enter Company Address");
      return false;
    }
    return true;
  }
  function cityValidation() {
    if (city === "") {
      setCityErr("Enter City Name");
      return false;
    }
    return true;
  }
  function stateValidation() {
    if (state === "") {
      setStateErr("Enter State Name");
      return false;
    }
    return true;
  }
  function pincodeValidation() {
    if (pin === "") {
      setPinErr("Enter Pin Code");
      return false;
    }
    return true;
  }  
  function pincodeValidation() {
    const Regex = /^(\d{4}|\d{6})$/;
    if (!pin || Regex.test(pin) === false) {
      if(pin === ""){
        setPinErr("Enter pincode")
      }else{
        setPinErr("Enter valid pincode");
      }
      return false;
    }
    return true;
  }
  function emailValidation() {
    if (email === "") {
      setEmailErr("Enter Email Address");
      return false;
    }
    return true;
  }
  function websiteValidation() {
    if (website === "") {
      setWebsiteErr("Enter Website Name");
      return false;
    }
    return true;
  }

  function accountNoValidation() {
    const acccNumRegex = /^[0-9]{9,18}$/;
 if (!accountNo || acccNumRegex.test(accountNo) === false) {
      if(accountNo === ""){
        setAccountNoErr("Enter account number");
      }else{
        setAccountNoErr("Enter valid account number");
      }
      return false;
    }
    return true;
  }
  function branchValidation() {
    if (branch === "") {
      setBranchErr("Enter Branch Name");
      return false;
    }
    return true;
  }

  function bankNameValidation() {
    if (bankName === "") {
      setBankNameErr("Enter Bank Name");
      return false;
    }
    return true;
  }

  function cinNoValidation() {
    if (cinNo === "") {
      setCinNoErr("Enter cin Number");
      return false;
    }
    return true;
  }

  function panNoValidation() {
    if (panNo === "") {
      setPanNoErr("Enter pan Number");
      return false;
    }
    return true;
  }

  function gstNoValidation() {
    if (gstNo === "") {
      setGstNoErr("Enter Valid gst Number");
      return false;
    }
    return true;
  }

  function ifsccodeValidation() {
    if (ifsccode === "") {
      setIfsccodeErr("Enter Valid ifsc Code");
      return false;
    }
    return true;
  }
  function androidversioncodeValidation() {
    if (androidLatestVersion === "") {
      setAndroidLatestVersionErr("Enter Valid Android Version");
      return false;
    }
    return true;
  }
  function androidversionName() {
    if (androidLatestVersionName === "") {
      setAndroidLatestVersionNameErr("Enter Valid Android Version Name");
      return false;
    }
    return true;
  }
  function iosVersoinCode() {
    if (iosLatestVersion === "") {
      setIosLatestVersionErr("Enter Valid IOS Version  Code ");
      return false;
    }
    return true;
  }
  function iosVersoinName() {
    if (iosLatestVersionName === "") {
      setIosLatestVersionNameErr("Enter Valid Ios Version Name");
      return false;
    }
    return true;
  }
  
  function whatsAppNumberValidation() {
    var Regex = /^[0-9]{10}$/;
    if (!whatsappnumber || Regex.test(whatsappnumber) === false) {
      if(whatsappnumber == ""){
       setWhatsappnumberErr("Enter WhatsApp mobile number");
      }else{
        setWhatsappnumberErr("Enter valid WhatsApp mobile number");
      }
      return false;
    }
    return true;
  }

  function phoneNumberValidation() {
    var Regex = /^[0-9]{10}$/;
    if (!contactNumber || Regex.test(contactNumber) === false) {
      if(contactNumber == ""){
        setContactNumberErr("Enter mobile number");
      }else{
        setContactNumberErr("Enter valid mobile number");
      }
      return false;
    }
    return true;
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


  function handleChangefirstcode(value) {
    setMobileNoContry(value);
    setSelectedMobileNoContry(value.Ccode);
    setMobileNoContryErr("");
  }

  const handleRadioChange = (e) => {
    if(e.target.value){
      axios.put(Config.getCommonUrl() + `api/bankdetails/selectbank/${e.target.value}`)
      .then((response)=>{
        console.log(response)
        if(response.data.success){
          dispatch(Actions.showMessage({ message: response.data.message, variant: "success",}));
          getBankList()
          getSiteSetting()
        }else{
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error",}));
        }
      })
      .catch((error)=>{
        handleError(error, dispatch, { api: `api/bankdetails/selectbank/${e.target.value}`})
      })
    }
  }

  const editHandler = (row) => {
    setModalOpen(true)
    setEditId(row.id)
    setBankName(row.bank_name)
    setBranch(row.branch_name)
    setAccountNo(row.account_number)
    setIfsccode(row.ifsc_code)
  }

  const callDeleteApi = () => {
    axios.delete(Config.getCommonUrl() + `api/bankdetails/delete/${deleteId}`)
    .then((response)=>{
      console.log(response)
      if(response.data.success){
        dispatch(Actions.showMessage({ message: response.data.message,variant:"success"}));
        setDeleteModal(false)
        getBankList()
        setDeleteId("")
      }else{
        dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
      }
    })
    .catch((error)=>{
      handleError(error, dispatch, { api: `api/bankdetails/delete/${deleteId}`})
    })
  }



  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const hiddenFileInput = React.useRef(null);

  const handleSignatureClick = (event) => {
    hiddenSignatureFileInput.current.click();
  };
  const hiddenSignatureFileInput = React.useRef(null);


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={6} sm={5} md={5} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Site Settings
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid item xs={6} sm={7} md={7} key="2">
                {/* <div className="btn-back">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    className=""
                    size="small"
                    onClick={(event) => {
                      History.goBack();
                    }}
                  >
                    Back
                  </Button>
                </div> */}
              </Grid>
            </Grid>
            {loading && <Loader />}

            <div className="main-div-alll ">
              <form
                name="registerForm"
                noValidate
                className="flex flex-col justify-center w-full"
              >
                <h4 className="mb-5"> Company Profile Setting:</h4>
                <div className="add-client-row flex flex-row flex-wrap">
                  <div className="add-textfiled">
                    <p>Company Name*</p>
                    <TextField
                      placeholder="Company Name "
                      autoFocus
                      name="companyName"
                      value={company}
                      error={companyNameErr.length > 0 ? true : false}
                      helperText={companyNameErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
                  <div className="add-textfiled">
                    <p>Company Address*</p>
                    <TextareaAutosize
                      autoFocus
                      name="companyAddress"
                      value={companyAddress}
                      error={companyAddressErr.length > 0 ? true : false}
                      helperText={companyAddressErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      style={{
                        height: "60%",
                        width: "100%",
                        marginTop: "1%",
                        border: "1px solid #e6e6e6",
                      }}
                    />
                  </div>
                  <div className="add-textfiled">
                    <p>City*</p>
                    <TextField
                      placeholder="City"
                      autoFocus
                      name="city"
                      value={city}
                      error={cityErr.length > 0 ? true : false}
                      helperText={cityErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
                  <div className="add-textfiled">
                    <p>State*</p>
                    <TextField
                      placeholder="State"
                      autoFocus
                      name="state"
                      value={state}
                      error={stateErr.length > 0 ? true : false}
                      helperText={stateErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
                  <div className="add-textfiled">
                    <p>PinCode*</p>
                    <TextField
                      placeholder="PinCode"
                      autoFocus
                      name="pin"
                      value={pin}
                      error={pinErr.length > 0 ? true : false}
                      helperText={pinErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
                  <div className="add-textfiled">
                    <p>Email*</p>
                    <TextField
                      placeholder="Email"
                      autoFocus
                      name="email"
                      value={email}
                      error={emailErr.length > 0 ? true : false}
                      helperText={emailErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
                  <div className="add-textfiled">
                    <p>Website*</p>
                    <TextField
                      placeholder="Website"
                      autoFocus
                      name="website"
                      value={website}
                      error={websiteErr.length > 0 ? true : false}
                      helperText={websiteErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
                  <div className="add-textfiled">
                    <p>PAN No*</p>
                    <TextField
                      placeholder="PAN No"
                      autoFocus
                      name="panNo"
                      value={panNo}
                      error={panNoErr.length > 0 ? true : false}
                      helperText={panNoErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
                  <div className="add-textfiled">
                    <p>GST No*</p>
                    <TextField
                      placeholder="GST No"
                      autoFocus
                      name="gstNo"
                      value={gstNo}
                      error={gstNoErr.length > 0 ? true : false}
                      helperText={gstNoErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
                  <div className="add-textfiled">
                    <p>CIN*</p>
                    <TextField
                      placeholder="CIN"
                      autoFocus
                      name="cinNo"
                      value={cinNo}
                      error={cinNoErr.length > 0 ? true : false}
                      helperText={cinNoErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
                  <div className="add-textfiled">
                    <p>Tray License Key Android :</p>
                    <TextareaAutosize
                      // placeholder="license android"
                      autoFocus 
                      name="licenseandroid"
                      value={licenseAndroid}
                      onChange={(e) => handleInputChange(e)}
                      disabled={isView}
                      variant="outlined"
                      style={{
                        height: "60%",
                        width: "100%",
                        marginTop: "1%",
                        border: "1px solid #e6e6e6",
                      }}
                      required
                      fullWidth
                    />
                  </div>
                  <div className="add-textfiled">
                    <p>Tray License Key IOS :</p>
                    <TextareaAutosize
                      // placeholder="license ios"
                      autoFocus 
                      name="licenseios"
                      value={licenseIOS}
                      onChange={(e) => handleInputChange(e)}
                      disabled={isView}
                      variant="outlined"
                      style={{
                        height: "60%",
                        width: "100%",
                        marginTop: "1%",
                        border: "1px solid #e6e6e6",
                      }}
                      required
                      fullWidth
                    />
                  </div>

                </div>
                <h4 className="mb-20 mt-20"> Mobile Setting:</h4>
                <div className="add-client-row flex flex-row flex-wrap">
                  <div className="add-textfiled">
                    <p>Ios Latest Version*</p>
                    <TextField
                      placeholder="Ios Latest Version"
                      autoFocus
                      name="iosversion"
                      value={iosLatestVersion}
                      error={iosLatestVersionErr.length > 0 ? true : false}
                      helperText={iosLatestVersionErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
                  <div className="add-textfiled">
                    <p>Ios Latest Version Name*</p>
                    <TextField
                      placeholder="Ios Latest Version Name"
                      autoFocus
                      name="iosname"
                      value={iosLatestVersionName}
                      error={iosLatestVersionNameErr.length > 0 ? true : false}
                      helperText={iosLatestVersionNameErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>

                  <div className="add-textfiled">
                    <p>Android Version*</p>
                    <TextField
                      placeholder="Android Version"
                      autoFocus
                      name="androidversion"
                      value={androidLatestVersion}
                      error={androidLatestVersionErr.length > 0 ? true : false}
                      helperText={androidLatestVersionErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>

                  <div className="add-textfiled">
                    <p>Android Version Name*</p>
                    <TextField
                      placeholder="Android Version Name"
                      autoFocus
                      name="androidname"
                      value={androidLatestVersionName}
                      error={
                        androidLatestVersionNameErr.length > 0 ? true : false
                      }
                      helperText={androidLatestVersionNameErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>

                  <div className="add-textfiled">
                    <p>Title</p>
                    <TextField
                      placeholder="Title"
                      autoFocus
                      name="title"
                      value={title}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>

                  <div className="add-textfiled">
                    <p>Whatsapp Number*</p>
                    <TextField
                      autoFocus
                      name="wpnumber"
                      value={whatsappnumber}
                      error={
                        whatsappnumberErr.length > 0 ? true : false
                      }
                      helperText={whatsappnumberErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
                  <div className="add-textfiled" style={{display:"flex"}}>

                    <div style={{width:"40%"}}>
                    <p>Contact Number*</p>
                    <Select
                      options={countryData.map((suggestion) => ({
                        value: suggestion.id,
                        label: `${suggestion.name} (${suggestion.phonecode})`,
                        Ccode: suggestion.phonecode,
                      }))}
                      value={mobileNoContry}
                      onChange={handleChangefirstcode}
                      variant="outlined"
                      required
                      fullWidth
                      isDisabled={isView}
                    />
                     <span className={classes.errorMessage}>
                          {mobileNoContryErr.length > 0
                            ? mobileNoContryErr
                            : ""}
                        </span>
                    </div>

                    <div style={{marginTop:"25px", width:"40%"}}>  
                    <TextField
                      placeholder="Contact Number"
                      autoFocus
                      name="contactNumber"
                      value={contactNumber}
                      error={
                        contactNumberErr.length > 0 ? true : false
                      }
                      helperText={contactNumberErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                    </div>
                  </div>

                  <div className="add-textfiled">
                    <p>Force Update:*</p>
                    <select
                      required
                      value={forceUpdate}
                      onChange={(e) => handleInputChange(e)}
                      style={{ width: "100%", height: "3.5rem" }}
                    >
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </div>

                  <div className="add-textfiled">
                    <p>Description*</p>
                    <TextareaAutosize
                      autoFocus
                      name="description"
                      value={description}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      style={{
                        height: "60%",
                        width: "100%",
                        marginTop: "1%",
                        border: "1px solid #e6e6e6",
                      }}
                    />
                  </div>
                </div>
                {/* <div className="add-client-row flex flex-row flex-wrap">
                  <div className="add-textfiled">
                    {imageUrl !== "" && (
                      <img
                        src={imageUrl}
                        style={{ width: "300px", height: "100px" }}
                        className="mt-16"
                        alt=""
                      />
                    )}
                  </div>
                  <div className="add-textfiled">
                    <p></p>
                    <Button
                      id="upload-btn-jewellery"
                      variant="contained"
                      color="primary"
                      style={{
                        backgroundColor: "#283428",
                        color: "white",
                        width: "60%",
                        marginTop: "15%",
                      }}
                      onClick={handleClick}
                    >
                      Browse Image
                    </Button>

                    <input
                      type="file"
                      ref={hiddenFileInput}
                      onChange={(event) => {
                        setImages(event.target.files[0]);
                      }}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </div>

                  <div className="add-textfiled">
                    {/* {signatureimageUrl !== "" && (
                      <img
                        src={signatureimageUrl}
                        style={{ width: "300px", height: "100px" }}
                        className="mt-16"
                        alt=""
                      /> */}
                    {/* )} */}
                  {/* </div>
                  <div className="add-textfiled">
                    <p></p>
                    <Button
                      id="upload-btn-jewellery"
                      variant="contained"
                      color="primary"
                      style={{
                        backgroundColor: "#283428",
                        color: "white",
                        width: "60%",
                        marginTop: "15%",
                      }}
                      // onClick={handleSignatureClick}
                    >
                      Upload Stamp
                    </Button>

                    <input
                      type="file"
                      ref={hiddenFileInput}
                      onChange={(event) => {
                        setImages(event.target.files[0]);
                      }}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </div>


                </div> */} 



                <Grid
                      container
                      item
                      xs={6}
                      sm={6}
                      md={6}
                      spacing={2}
                      alignItems="flex-end"
                    >
                      <Grid item xs={12} sm={12} md={6}>
                        {imageUrl !== "" && (
                          <img
                            src={imageUrl}
                            style={{
                              width: "auto",
                              height: "200px",
                              marginInline: "auto",
                              display: "block",
                            }}
                            className="mt-16"
                            alt=""
                          />
                        )}
                        <Button
                          id="upload-btn-jewellery"
                          variant="contained"
                          color="primary"
                          style={{
                            backgroundColor: "#283428",
                            color: "white",
                            width: "100%",
                          }}
                          onClick={handleClick}
                        >
                          Browse Image
                        </Button>

                        <input
                          type="file"
                          ref={hiddenFileInput}
                          onChange={(event) => {
                            setImages(event.target.files[0]);
                          }}
                          accept="image/*"
                          style={{ display: "none" }}
                        />
                      </Grid>


                      <Grid item xs={12} sm={12} md={6}>
                        {signatureimageUrl !== "" && (
                          <img
                            src={signatureimageUrl}
                            style={{
                              width: "auto",
                              height: "200px",
                              marginInline: "auto",
                              display: "block",
                            }}
                            className="mt-16"
                            alt=""
                          />
                        )}
                        <Button
                          id="upload-btn-jewellery"
                          variant="contained"
                          color="primary"
                          style={{
                            backgroundColor: "#283428",
                            color: "white",
                            width: "100%",
                          }}
                          onClick={handleSignatureClick}
                        >
                          Upload Stamp
                        </Button>

                        <input
                          type="file"
                          ref={hiddenSignatureFileInput}
                          onChange={(event) => {
                            setSignature(event.target.files[0]);
                          }}
                          accept="image/png"
                          style={{ display: "none" }}
                        />
                      </Grid>


                    </Grid>



                <div className="float-right mt-4">
                  <Button
                    variant="contained"
                    className="w-224 float-right"
                    id="btn-save"
                    aria-placeholder="Register"
                    onClick={(e) => {
                      handleFormSubmit(e);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </form>
              <Grid
              // className="department-main-dv"
              container
              // spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={6} sm={5} md={5} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pt-16 text-18 font-700 mb-8">
                  Bank Details:
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid item xs={6} sm={7} md={7} key="2" className="text-right">
              <Button
                          variant="contained"
                          className={classes.button}
                          size="small"
                          onClick={() => {setModalOpen(true); }}
                        >
                          Add New Bank
                        </Button>
              </Grid>
            </Grid>
              <div className="flex flex-row flex-wrap">
                 <div className="add-textfiled">
                    <p>Bank Name*</p>
                    <TextField
                      placeholder="Bank Name"
                      autoFocus
                      // name="bankName"
                      value={showBankName}
                      // error={bankNameErr.length > 0 ? true : false}
                      // helperText={bankNameErr}
                      // onChange={(e) => handleInputChange(e)}
                      disabled
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>

                  <div className="add-textfiled">
                    <p>Branch*</p>
                    <TextField
                      placeholder="Branch"
                      autoFocus
                      // name="branch"
                      value={showBranches}
                      // error={branchErr.length > 0 ? true : false}
                      // helperText={branchErr}
                      // onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      disabled
                      required
                      fullWidth
                    />
                  </div>
                  <div className="add-textfiled">
                    <p>A/C No*</p>
                    <TextField
                      placeholder="A/C No"
                      autoFocus
                      // name="accountNo"
                      value={showAccountNumber}
                      // error={accountNoErr.length > 0 ? true : false}
                      // helperText={accountNoErr}
                      // onChange={(e) => handleInputChange(e)}
                      disabled
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
                  <div className="add-textfiled">
                    <p>IFSC Code*</p>
                    <TextField
                      placeholder="IFSC Code"
                      autoFocus
                      // name="ifsccode"
                      value={showIFC}
                      // error={ifsccodeErr.length > 0 ? true : false}
                      // helperText={ifsccodeErr}
                      // onChange={(e) => handleInputChange(e)}
                      disabled
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
              </div>
              <Typography className="mb-10 text-20 font-700">
                      Bank List :
                    </Typography>

                    <Table className={classes.table}>
               <TableHead>
                 <TableRow>
                 <TableCell className={classes.radioTab}>
                    
                   </TableCell>
                   <TableCell className={classes.radioTab}>
                     ID
                   </TableCell>
                   <TableCell className={classes.tableRowPad} align="left">
                     Bank Name
                   </TableCell>
                   <TableCell className={classes.tableRowPad} align="left">
                     Account Number
                   </TableCell>
                   <TableCell className={classes.tableRowPad} align="left">
                     Branch Name
                   </TableCell>
                   <TableCell className={classes.tableRowPad} align="left">
                     IFC code
                   </TableCell>
                   <TableCell className={classes.tableRowPad} align="left">
                     Action
                   </TableCell>
                 </TableRow>
               </TableHead>
               <TableBody>
                  {apiData.map((row,i) => ( 
                     <TableRow key={row.id}>
                       <TableCell className={classes.radioTab}>
                       <RadioGroup   id="radio-row-dv" onChange={handleRadioChange}>
                          <Radio value={row.id}  checked={row.is_selected === 1 ? true : false}></Radio>
                       </RadioGroup>
                       </TableCell>
                       <TableCell className={classes.radioTab}>
                        {i+1}
                       </TableCell>
                       <TableCell className={classes.tableRowPad}>
                       {row.bank_name}
                       </TableCell>
                       <TableCell
                         align="left"
                         className={classes.tableRowPad}
                       >
                         {row.account_number}
                       </TableCell>

                       <TableCell
                         align="left"
                         className={classes.tableRowPad}
                       >
                       {row.branch_name}
                       </TableCell>
                       <TableCell
                         align="left"
                         className={classes.tableRowPad}
                       >
                        {row.ifsc_code}
                       </TableCell>
                       <TableCell className={classes.tableRowPad}>
                         <IconButton
                           style={{ padding: "0" }}
                           onClick={(ev) => {
                             ev.preventDefault();
                             ev.stopPropagation();
                             setIsEdit(true);
                             editHandler(row);
                           }}
                         >
                      <Icon className="mr-8 edit-icone">
                                  <img src={Icones.edit} alt="" />
                                </Icon>
                         </IconButton>

                         <IconButton
                           style={{ padding: "0" }}
                           hidden={row.is_selected === 1 ? true : false}
                           onClick={(ev) => {
                             ev.preventDefault();
                             ev.stopPropagation();
                             setDeleteId(row.id);
                             setDeleteModal(true);
                           }}
                         >
                          <Icon className="mr-8 delete-icone">
                                  <img src={Icones.delete_red} alt="" />
                                </Icon>
                         </IconButton>
                       </TableCell>
                     </TableRow>
                    ))} 
               </TableBody>
                  </Table>
                  <Dialog
                open={deleteModal}
                onClose={()=>{setDeleteModal(false);setDeleteId("")}}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" className="popup-delete">{"Alert!!!"}
                <IconButton
                  style={{
                    position: "absolute",
                    marginTop: "-5px",
                    right: "15px",
                  }}
                  onClick={()=>{setDeleteModal(false);setDeleteId("")}}
                >
                  <img
                    src={Icones.cross}
                    className="delete-dialog-box-image-size"
                    alt=""
                  />
                </IconButton></DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this record?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>{setDeleteModal(false);setDeleteId("")}} className="delete-dialog-box-cancle-button">
                        Cancel
                    </Button>
                    <Button onClick={callDeleteApi} className="delete-dialog-box-delete-button" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
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
              <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
                <h5
                 className="popup-head p-5"
                  // style={{
                  //   textAlign: "center",
                  //   backgroundColor: "black",
                  //   color: "white",
                  // }}
                >
                  {isEdit ? "Edit Bank" : "Add Bank"}  
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={()=>setModalOpen(false)}
                  ><Icon style={{ color: "white" }}>
                      close
                    </Icon></IconButton>
                </h5>
                <div className="p-5 pl-16 pr-16">
                <Grid
              container
              spacing={3}
              style={{ paddingTop: 15 }}
            > 
              <Grid item xs={12}>
              <p className="popup-labl pb-1">Bank name</p>
              <TextField
                  // className="mb-16"
                  placeholder="Bank name"
                  autoFocus
                  name="bankName"
                  value={bankName}
                  error={bankNameErr.length > 0 ? true : false}
                  helperText={bankNameErr}
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
              <p className="popup-labl pb-1">Branch</p>
              <TextField
                    // className="mb-16"
                    placeholder="Branch"
                    name="branch"
                    value={branch}
                    error={branchErr.length > 0 ? true : false}
                    helperText={branchErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                  />
              </Grid>
              <Grid item xs={12}>
              <p className="popup-labl pb-1">A/C no</p>
              <TextField
                    // className="mb-16"
                    placeholder="A/C no"
                    name="accountNo"
                    value={accountNo}
                    error={accountNoErr.length > 0 ? true : false}
                    helperText={accountNoErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                  />
              </Grid>
              <Grid item xs={12}>
              <p className="popup-labl pb-1">IFSC code</p>
              <TextField
                    // className="mb-16"
                    placeholder="IFSC code"
                    name="ifsccode"
                    value={ifsccode}
                    error={ifsccodeErr.length > 0 ? true : false}
                    helperText={ifsccodeErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                  />
              </Grid>
            </Grid>
            <div className="flex flex-row justify-around  pt-20">
              <Button
                variant="contained"
                className="cancle-button-css"
                onClick={(e) => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="save-button-css"
                onClick={(e) => addBankDetails(e)}
              >
                {isEdit ? "Update" : "Save"}
              </Button>
            </div>
                    {/* <Button
                      variant="contained"
                      color="primary"
                      className="w-full mx-auto mt-16"
                      style={{
                        backgroundColor: "#4caf50",
                        border: "none",
                        color: "white",
                      }}
                      onClick={(e) => addBankDetails(e)}
                    >
                      {isEdit ? "UPDATE" : "SAVE"}
                    </Button> */}
                </div>
              </div>
            </Modal>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default SiteSettings;

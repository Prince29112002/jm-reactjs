import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FuseAnimate } from "@fuse";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Icon,
  IconButton,
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
import AsyncCreatable from "react-select/lib/Creatable";
import clsx from "clsx";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as Actions from "app/store/actions";
import Select, { createFilter } from "react-select";
import Icones from "assets/fornt-icons/Mainicons";
import { values } from "lodash";
import { Orderprint } from "../PrintComponent/Orderprint";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Loader from "app/main/Loader/Loader";
import DisplayImage from "./DisplayImage";
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

const AddOrderRetailer = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [id, setId] = useState("");
  const [amount, setamount] = useState("");
  const [amountErr, setamountErr] = useState("");
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [selectedClient, setSelectClient] = useState("");
  const [selectedClientErr, setSelectedClientErr] = useState("");
  const [clientData, setClientData] = useState("");
  const [phoneNumOne, setPhoneNumOne] = useState("");
  const [phoneNumOneErr, setPhoneNumOneErr] = useState("");
  const [finegold, setFineGold] = useState("");
  const [finegoldErr, setFineGoldErr] = useState("");
  const [adharcad, setAdharCad] = useState("");
  const [adharCadErr, setAdharCadErr] = useState("");
  const [firmName, setFirmName] = useState("");
  const [firmNameErr, setFirmNameErr] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyAddressErr, setCompanyAddressErr] = useState("");
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [gstNoErr, setGstNoErr] = useState("");
  const [panNo, setPanNo] = useState("");
  const [panNoErr, setPanNoErr] = useState("");
  const [pincode, setpincode] = useState("");
  const [pincodeErr, setpincodeErr] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imgFiles, setImgFile] = useState([]);
  const [siteId, setSiteId] = useState("");
  const [forceUpdate, setForceUpdate] = useState("");
  const [status, setStatus] = useState("");
  const [statusErr, setStatusErr] = useState("");
  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryErr, setSelectedCountryErr] = useState("");
  const [referenceErr, setReferenceErr] = useState("");

  const [stateData, setStateData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateErr, setSelectedStateErr] = useState("");

  const [cityData, setcityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCityErr, setSelectedCityErr] = useState("");
  //   const [selectedValue, setSelectedValue] = useState(''); // Default selected value
  const [goldtypeData, setgoldtype] = useState([]);
  const [selectedGold, setSelectedGold] = useState("");
  const [selectedGoldErr, setSelectedGoldErr] = useState("");

  const [purityData, setPurity] = useState([]);
  const [selectedpurity, setSelectedpurity] = useState("");
  const [selectedPurityErr, setSelectedPurityErr] = useState("");
  const [imgFileArr, setImageFileArr] = useState("");
  const [orderId, setOrderId] = useState("");
  const [isView, setView] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isselect, setSelece] = useState(false);
  const [states, setstates] = useState([]);
  const [selectedstates, setSelectedstates] = useState("");
  const [isClearable, setIsClearable] = useState(true);
  const [orderNumber, setorderNumber] = useState("");
  const [orderNm, setorderNm] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalView, setModalView] = useState("");

  // print component
  const [printObj, setPrintObj] = useState({
    goldtype: "",
    purity: "",
    finegold: "",
    amount: "",
    image: [],
    referencename: "",
    customername: "",
    GSTno: "",
    ordernumber: "",
    createddate: "",
  });

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);

  const handleAfterPrint = () => {
    //React.useCallback
    console.log("`onAfterPrint` called"); // tslint:disable-line no-console
    //resetting after print
    // checkAndReset()
    History.goBack();
  };

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        resolve();
      }, 10);
    });
  }, []); //setText

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
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
    documentTitle: "CAD_Repair_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  function checkforPrint() {
    if (
      PartynameValidation() &&
      emailValidation() &&
      numberValidation() &&
      // Addressvalidation() &&
      panNoValidation() &&
      AadhaarCardValidation() &&
      countryValidation() &&
      stateValidation() &&
      cityValidation() &&
      gstNoValidation() &&
      pincodeValidation() &&
      goldtypeValidation() &&
      purityValidation() &&
      FineGoldReceivedValidation() &&
      amountValidation() &&
      validateimgarr() &&
      referencenameValidation() &&
      errorrefchek()
    ) {
      if (isView) {
        handlePrint();
      } else if (isEdit) {
        callEditorderApi(true);
      } else {
        callAddOrderApi(true);
      }
    }
  }
  var today = moment().format("YYYY-MM-DD"); //new Date();
  const goldtypes = [
    { id: 0, name: "White Gold" },
    { id: 1, name: "Rose Gold" },
    { id: 2, name: "Yellow" },
  ];

  const purity = [
    { id: 14, name: "14 KT" },
    { id: 18, name: "18 KT" },
    { id: 20, name: "20 KT" },
    { id: 22, name: "22 KT" },
    { id: 24, name: "24 KT" },
  ];
  const OrderRetStatus = [
    { id: 1, name: "New Order" },
    { id: 2, name: "Running" },
    { id: 3, name: "Completed" },
    { id: 4, name: "Customer Cancelled" },
    { id: 5, name: "Declined" },
  ];

  useEffect(() => {
    NavbarSetting("Orders-Retailer", dispatch);
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    clientlist();
    getCountrydata();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (props.location.state) {
      setView(props.location.state.isViewOnly);
      setEdit(props.location.state.isEditOnly);
      setOrderId(props.location.state.id);
      getOrderData(props.location.state.id);
      setorderNm(props.location.state.orderNumber);
    }
    //eslint-disable-next-line
  }, []);

  function getOrderData(id) {
    axios
      .get(Config.getCommonUrl() + `retailerProduct/api/order/${id}`)
      .then((res) => {
        const arrData = res.data.data;
        setName(arrData.customername.client_Name);
        setSelectClient({
          value: clientData.id,
          label: arrData.customername.client_Name,
        });
        setEmail(arrData.customername.email);
        setPhoneNumOne(arrData.customername.mobile_number);
        setCompanyAddress(arrData.customername.address);
        setPanNo(arrData.customername.pan_number);
        setAdharCad(arrData.customername.adhar_card);
        var gold = {
          value: arrData.gold_type,
          label: goldtypes[arrData.gold_type].name,
        };
        setSelectedGold({
          value: arrData.gold_type,
          label: goldtypes[arrData.gold_type].name,
        });

        var selectedName = undefined;
        for (let i = 0; i < purity.length; i++) {
          if (purity[i].id === arrData.purity) {
            selectedName = purity[i].name;
            break;
          }
        }
        setSelectedpurity({
          value: arrData.purity,
          label: selectedName,
        });

        let selectestates = undefined;
        for (let i = 0; i < OrderRetStatus.length; i++) {
          if (OrderRetStatus[i].id === arrData.order_status) {
            selectestates = OrderRetStatus[i].name;
            break;
          }
        }
        setSelectedstates({
          value: arrData.order_status,
          label: selectestates,
        });
        setFineGold(arrData.finegold);
        setamount(arrData.amount);
        setSelectedState({
          value: arrData.customername.StateName.id,
          label: arrData.customername.StateName.name,
        });
        setSelectedCountry({
          value: arrData.customername.CountryName.id,
          label: arrData.customername.CountryName.name,
        });
        setSelectedCity({
          value: arrData.customername.CityName.id,
          label: arrData.customername.CityName.name,
        });
        setGstNo(arrData.customername.gst_number);
        setpincode(arrData.customername.pincode);
        let data = arrData.orderimages.map((item) => {
          return {
            error: null,
            id: item.id,
            imageURL: item.imageURL,
            reference_name: item.reference_name,
            image: item.image,
          };
        });
        setImgFile(data);
        setPrintObj({
          ...printObj,
          GSTno: arrData.customername.gst_number,
          customername: arrData.customername.client_Name,
          goldtype: gold.label,
          purity: selectedName,
          finegold: arrData.finegold,
          amount: arrData.amount,
          image: data,
          createddate: moment(arrData.created_at).format("DD-MM-YYYY"),
          ordernumber: arrData.order_number,
        });
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `retailerProduct/api/order/${id}`,
        });
      });
  }

  useEffect(() => {
    if (!isView && !isEdit) {
      if (selectedClient) {
        if (selectedClient.__isNew__ === true) {
          setSelece(false);
          setPhoneNumOne("");
          setEmail("");
          setCompanyAddress("");
          setAdharCad("");
          setCompanyAddress("");
          setPanNo("");
          setGstNo("");
          setSelectedCity("");
          setSelectedCountry("");
          setSelectedState("");
          setpincode("");
          setPrintObj({ ...printObj, GSTno: "" });
        } else {
          getclinetlist();
        }
      }
    }
  }, [selectedClient]);

  function getclinetlist() {
    axios
      .get(
        Config.getCommonUrl() +
          `retailerProduct/api/clientRet/${selectedClient.value}`
      )
      .then((res) => {
        const arrData = res.data.data[0];
        setId(arrData.id);
        setName(arrData.client_Name);
        setPhoneNumOne(arrData.mobile_number);
        setEmail(arrData.email);
        setCompanyAddress(arrData.address);
        setAdharCad(arrData.adhar_card);
        setCompanyAddress(arrData.address);
        setPanNo(arrData.pan_number);
        setSelectedState({
          value: arrData.StateName.id,
          label: arrData.StateName.name,
        });
        //  getStatedata(data.CountryName.id, true, data);

        setSelectedCountry({
          value: arrData.CountryName.id,
          label: arrData.CountryName.name,
        });
        getStatedata(arrData.CountryName.id, true, arrData);

        setSelectedCity({
          value: arrData.CityName.id,
          label: arrData.CityName.name,
        });
        getCitydata(arrData.StateName.id);
        setGstNo(arrData.gst_number);
        setpincode(arrData.pincode);
        setStatus(arrData.status.toString());
        setPrintObj({
          ...printObj,
          GSTno: arrData.gst_number,
          customername: arrData.client_Name,
        });
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `retailerProduct/api/clientRet/${selectedClient.value}`,
        });
      });
  }

  function callEditorderApi(isPrint) {
    setLoading(true);
    const imgarr = [];

    const formData = new FormData();

    for (let i = 0; i < imgFileArr.length; i++) {
      formData.append("files", imgFileArr[i]);
    }

    imgFiles.map((item, i) => {
      imgarr.push({
        orderImageID: item.id,
        image: item.image,
        reference_name: item.reference_name,
      });
    });
    // formData.append("client_Name", name);
    formData.append("client_id", id);
    formData.append("order_status", selectedstates.value);
    formData.append("id", orderId);
    formData.append("gold_type", selectedGold.value);
    formData.append("purity", selectedpurity.label);
    formData.append("finegold", finegold);
    formData.append("amount", amount);
    formData.append("orderImagesData", JSON.stringify(imgarr));
    axios
      .put(
        Config.getCommonUrl() + `retailerProduct/api/order/${orderId}`,
        formData
      )
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          if (isPrint) {
            handlePrint();
          } else {
            setLoading(false);
            setTimeout(() => {
              History.goBack(); //.push("/dashboard/masters/vendors");
            }, 1500);
          }
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
          api: `retailerProduct/api/order/${orderId}`,
          body: formData,
        });
      });
  }

  function clientlist() {
    axios
      .get(Config.getCommonUrl() + `retailerProduct/api/clientRet/`)
      .then((res) => {
        console.log(res, "//list");
        const arrData = res.data.data;
        setClientData(arrData);
        //    setEmail(arrData.customername.email)
        //    setPhoneNumOne(arrData.customername.mobile_number)
        //    setCompanyAddress(arrData.customername.address)
        //    setPanNo(arrData.customername.pan_number)
        //    setAdharCad(arrData.customername.adhar_card)
        //    setSelectedGold(arrData.gold_type)
        //    setSelectedpurity(arrData.purity)
        //    setFineGold(arrData.finegold)
        //    setamount(arrData.amount)
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `retailerProduct/api/clientRet/` });
      });
  }
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

  // function validateAllInputs() {
  //   const isPartyNameValid = nameValidation();
  //   const isCompanyNameValid = companyNamevalidation();
  //   const isEmailValid = emailValidation();
  //   const isPhoneNumOneValid = numberValidation();
  //   const isGstNoValid = gstNoValidation();
  //   const ispanNumOneValid = panNoValidation();
  //   const isAddressValid =  panNoValidation();
  //  const isStatevalid = stateValidation();
  // const isCityvalid = cityValidation();
  //   return (
  //     isPartyNameValid &&
  //     isCompanyNameValid &&
  //     isEmailValid &&
  //     isPhoneNumOneValid &&
  //     isGstNoValid &&
  //     ispanNumOneValid &&
  //     isAddressValid &&
  //     isStatevalid&&
  //     isCityvalid
  //   );
  // }

  function handleFormSubmit(event) {
    event.preventDefault();
    // callAddOrderApi()
    if (
      PartynameValidation() &&
      //  firmNamevalidation()&&
      emailValidation() &&
      numberValidation() &&
      // Addressvalidation() &&
      panNoValidation() &&
      AadhaarCardValidation() &&
      countryValidation() &&
      stateValidation() &&
      cityValidation() &&
      gstNoValidation() &&
      pincodeValidation() &&
      goldtypeValidation() &&
      purityValidation() &&
      FineGoldReceivedValidation() &&
      amountValidation() &&
      validateimgarr() &&
      referencenameValidation() &&
      errorrefchek()
      // panNoValidation() &&
      //   StatusValidation()
    ) {
      if (isEdit) {
        callEditorderApi(false);
      } else {
        callAddOrderApi(false);
      }
      //   callAddClientApi()
      // callAddProfileApi()
    }
  }

  function handleselececlient(value) {
    if (value === null) {
      // setClientData("")
      console.log("/////////////");
      setId("");
      setName("");
      setEmail("");
      setPhoneNumOne("");
      setCompanyAddress("");
      setAdharCad("");
      setSelectedCountry("");
      setSelectedState("");
      setSelectedCity("");
      setPanNo("");
      setGstNo("");
      setpincode("");
      setStatus("");
      setPrintObj({ ...printObj, customername: "" });
      setPrintObj({ ...printObj, GSTno: "" });
    }
    setSelectClient(value);
    setPrintObj({ ...printObj, customername: value?.label });
    // console.log(value.label);
    setSelectedClientErr("");
    setSelece(value);
  }

  function handleCountryChange(value) {
    setSelectedCountry(value);
    setSelectedCountryErr("");

    setStateData([]);
    setSelectedState("");
    setSelectedStateErr("");

    setcityData([]);
    setSelectedCity("");
    // getCityData(value.value);
    getStatedata(value.value);
  }

  function handleChangeState(value) {
    setSelectedState(value);
    setSelectedStateErr("");

    // setSelectedCountryErr("");
    setcityData([]);
    setSelectedCity("");
    getCitydata(value.value);
  }

  function getCountrydata() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/country")
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
        handleError(error, dispatch, { api: "retailerProduct/api/country" });
      });
  }

  function getStatedata(countyId, i) {
    axios
      .get(
        Config.getCommonUrl() + "retailerProduct/api/country/state/" + countyId
      )
      .then(function (response) {
        if (response.data.success === true) {
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
        handleError(error, dispatch, {
          api: "retailerProduct/api/partyDetails/state/all" + countyId,
        });
      });
  }

  function handleChangeCity(value) {
    setSelectedCity(value);
    setSelectedCityErr("");
  }

  function getCitydata(stateID) {
    axios
      .get(
        Config.getCommonUrl() + "retailerProduct/api/country/city/" + stateID
      )
      .then(function (response) {
        if (response.data.success === true) {
          setcityData(response.data.data);
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
          api: "retailerProduct/api/country/city/" + stateID,
        });
      });
  }

  function callAddOrderApi(isPrint) {
    setLoading(true);
    const imgarr = [];

    const formData = new FormData();

    for (let i = 0; i < imgFileArr.length; i++) {
      formData.append("files", imgFileArr[i]);
    }

    imgFiles.map((item, i) => {
      imgarr.push({
        image: item.image,
        reference_name: item.reference_name,
      });
    });
    formData.append("client_Name", selectedClient.label);
    formData.append("client_id", id);
    formData.append("email", email);
    formData.append("mobile_number", phoneNumOne);
    formData.append("address", companyAddress);
    formData.append("country", selectedCountry.value);
    formData.append("state", selectedState.value);
    formData.append("city", selectedCity.value);
    formData.append("gst_number", gstNo);
    formData.append("pincode", pincode);
    formData.append("status", status);
    formData.append("pan_number", panNo);
    formData.append("adhar_card", adharcad);
    formData.append("gold_type", selectedGold.value);
    formData.append("purity", selectedpurity.label);
    formData.append("finegold", finegold);
    formData.append("amount", amount);
    formData.append("orderImages", JSON.stringify(imgarr));

    axios
      .post(Config.getCommonUrl() + "retailerProduct/api/order/", formData)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setorderNumber(response.data.data.order_number);
          setPrintObj({
            ...printObj,
            ordernumber: response.data.data.order_number,
            createddate: moment(today).format("DD-MM-YYYY"),
          });
          if (isPrint) {
            handlePrint();
          } else {
            setLoading(false);
            setTimeout(() => {
              History.goBack(); //.push("/dashboard/masters/vendors");
            }, 1500);
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: "retailerProduct/api/order/",
          formData: JSON.stringify(formData),
        });
      });
  }

  function onclickto() {
    setClientData("");
    // setStatusErr("");
  }
  function handleSelectstatus(value) {
    setSelectedstates(value);
  }
  const handleSelectChanges = (value) => {
    setSelectedGold(value);
    setSelectedGoldErr("");
    setPrintObj({ ...printObj, goldtype: value.label });

    // setSelectedpurity(event.target.value);
  };
  const handleSelectChange = (value) => {
    // setSelectedGold(event.target.value);
    setSelectedPurityErr("");
    setSelectedpurity(value);
    setPrintObj({ ...printObj, purity: value.label });
  };
  const handleInputChangenum = (e, i) => {
    const arr = [...imgFiles];
    arr[i].reference_name = e.target.value;
    arr[i].error = null;
    setImgFile(arr);

    setPrintObj({ ...printObj, image: arr });
  };
  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    setForceUpdate(event.target.value);

    const name = target.name;
    if (name === "name") {
      setName(value);
      setNameErr("");
      setPrintObj({ ...printObj, customername: value });
    }
    // else if (name === "firmName") {
    //   setFirmName(value);
    //   setFirmNameErr("");

    // }
    else if (name === "number") {
      setPhoneNumOne(value);
      setPhoneNumOneErr("");
    } else if (name === "companyAddress") {
      setCompanyAddress(value);
      setCompanyAddressErr("");
    } else if (name === "email") {
      setEmail(value);
      setEmailErr("");
    } else if (name === "gstNo") {
      setGstNo(value);
      setGstNoErr("");
      setPrintObj({ ...printObj, GSTno: value });

      // return true;
    } else if (name === "panNo") {
      setPanNo(value);
      setPanNoErr("");
    } else if (name === "pincod") {
      setpincode(value);
      setpincodeErr("");
    } else if (name === "adharcard") {
      setAdharCad(value);
      setAdharCadErr("");
    } else if (name === "finegold") {
      setFineGold(value);
      setFineGoldErr("");
      setPrintObj({ ...printObj, finegold: value });
    } else if (name === "amount") {
      setamount(value);
      setamountErr("");
      setPrintObj({ ...printObj, amount: value });
    }
  }

  function referencenameValidation() {
    // const Regex = /^[a-zA-Z\s]*$/;
    const refnum = [...imgFiles];
    var ref = true;
    refnum.map((item) => {
      if (item.reference_name === "") {
        item.error = "Enter reference name";
        //  ref = false
      }
    });
    setImgFile(refnum);
    return true;
  }
  function errorrefchek() {
    let arrData = [...imgFiles];
    let flag = true;
    arrData.map((item) => {
      if (item.error !== null) {
        flag = false;
      }
    });
    return flag;
  }

  function validateimgarr() {
    if (imgFiles.length > 0) {
      return true;
    } else {
      dispatch(
        Actions.showMessage({
          message: "Please upload image",
          variant: "error",
        })
      );
      return false;
    }
  }
  function FineGoldReceivedValidation() {
    var Regex =
      /^(?:0*(?:\d{0,4}(?:\.\d{1,3})?|9999(?:\.[0]{1,3})?)|[1-9]\d{0,3}(?:\.\d{1,3})?)$/;
    if (finegold !== "" && Regex.test(finegold) === false) {
      setFineGoldErr("Please enter a number between 0.001 and 9999.999");

      return false;
    }
    return true;
  }
  function amountValidation() {
    var Regex = /^(?:\d{1,7}(?:\.\d{1,3})?|9999999\.999)$/;
    if (amount !== "" && Regex.test(amount) === false) {
      setamountErr("Please enter a number between 0.001 and 99,99,999.999");

      return false;
    }
    return true;
  }

  function AadhaarCardValidation() {
    const aadhaarPattern = /^\d{12}$/;
    if (adharcad !== "" && aadhaarPattern.test(adharcad) === false) {
      setAdharCadErr("Enter valid aadhar number");
      return false;
    }
    return true;
  }

  function pincodeValidation() {
    const Regex = /^(\d{4}|\d{6})$/;
    if (!pincode || Regex.test(pincode) === false) {
      if (pincode == "") {
        setpincodeErr("Enter pincode");
      } else {
        setpincodeErr("Enter valid pincode");
      }
      return false;
    }
    return true;
  }
  function nameValidation() {
    const Regex = /^[a-zA-Z\s]*$/;
    // let name = event.target.value;
    if (!name || Regex.test(name) === false) {
      if (name == "") {
        setNameErr("Enter name");
      } else {
        setNameErr("Enter valid name");
      }
      return false;
    }

    return true;
  }
  function StatusValidation() {
    if (status === "") {
      setStatusErr("Please Select Status");
      return false;
    }
    return true;
  }
  function numberValidation() {
    const Regex = /^[0-9]{10}$/;
    // let number = event.target.value;
    if (phoneNumOne !== "" && Regex.test(phoneNumOne) === false) {
      setPhoneNumOneErr("Enter valid mobile number");
      return false;
    }
    return true;
  }

  function firmNamevalidation() {
    const Regex = /^[a-zA-Z\s]*$/;
    // let companyName = event.target.value;
    if (!firmName || Regex.test(firmName) === false) {
      setFirmNameErr("Enter firm name");
      return false;
    }

    return true;
  }
  function stateValidation() {
    if (selectedState === "") {
      setSelectedStateErr("Please select state");
      return false;
    }
    return true;
  }
  function cityValidation() {
    if (selectedCity === "") {
      setSelectedCityErr("Please select city");
      return false;
    }
    return true;
  }
  function Addressvalidation() {
    if (companyAddress === "") {
      if (companyAddress == "") {
        setCompanyAddressErr("Enter address");
      } else {
        setCompanyAddressErr("Enter valid address");
      }
      return false;
    }
    return true;
  }

  function countryValidation() {
    if (selectedCountry === "") {
      setSelectedCountryErr("Please select country");
      return false;
    }
    return true;
  }
  function emailValidation() {
    const Regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email !== "" && Regex.test(email) === false) {
      setEmailErr("Enter valid email id");
      return false;
    }
    return true;
  }
  function PartynameValidation() {
    if (selectedClient === "") {
      setSelectedClientErr("Pleas selecte client Name");
      return false;
    }
    return true;
  }
  function panNoValidation() {
    const panNumRegex = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    if (panNo !== "" && panNumRegex.test(panNo) === false) {
      setPanNoErr("Enter valid pan number");
      return false;
    }
    return true;
  }

  function gstNoValidation() {
    const GstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (gstNo !== "" && GstRegex.test(gstNo) === false) {
      setGstNoErr("Enter valid gst number");
      return false;
    }
    return true;
  }
  function purityValidation() {
    if (selectedpurity === "") {
      setSelectedPurityErr("Please select karat/purity");
      return false;
    }
    return true;
  }
  function goldtypeValidation() {
    if (selectedGold === "") {
      setSelectedGoldErr("Please select gold type");
      return false;
    }
    return true;
  }

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const setImages = (event) => {
    const files = event.target.files;
    const imageUrls = [...imgFiles];
    if (Config.checkFile(files, "image")) {
      setImageFileArr(files);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        imageUrls.push({
          image: file.name,
          imageURL: URL.createObjectURL(file),
          reference_name: "",
        });
      }
      setImgFile(imageUrls);
      setPrintObj({ ...printObj, image: imageUrls });
    } else {
      document.getElementById("files").value = "";
      dispatch(
        Actions.showMessage({
          message: "Accept only .jpg, .png, or .jpeg files.",
        })
      );
    }
  };

  const handleRemoveRow = (index) => {
    const arr = [...imgFiles];
    arr.splice(index, 1);
    // const updatedData = arr.filter(row => row.index !== index);
    setImgFile(arr);
    setPrintObj({ ...printObj, image: arr });
  };

  const hiddenFileInput = React.useRef(null);
  const handleCloseImage = () => {
    setModalView("");
  };

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
              <Grid item xs={5} sm={4} md={4} lg={5} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    {isEdit
                      ? "Edit Order"
                      : isView
                      ? "View Order"
                      : "Add New Order"}{" "}
                    {orderNm ? `/ ${orderNm}` : ""}
                  </Typography>
                </FuseAnimate>
              </Grid>

              <Grid item xs={7} sm={8} md={8} lg={7} key="2">
                <div className="btn-back">
                  {" "}
                  <Button
                    id="btn-back"
                    className=""
                    size="small"
                    onClick={(event) => {
                      // History.push("/dashboard/masters/clients");

                      History.goBack();
                      //   setDefaultView(btndata.id);
                      //   setIsEdit(false);
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
            <div>
              {modalView === 3 && (
                <DisplayImage modalColsed={handleCloseImage} image={image} />
              )}
            </div>
            <div className="main-div-alll ">
              <div className="" style={{height: "90%" }}>
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                >
                  <h4 className="mb-12">Client Details:</h4>
                  <Grid container spacing={2} className="add-client-row">
                    <Grid item xs={3} >
                      <p>Select Client</p>

                      <AsyncCreatable
                        filterOption={createFilter({ ignoreAccents: false })}
                        // classes={classes}
                        styles={selectStyles}
                        options={
                          clientData
                            ? clientData.map((suggestion) => ({
                                value: suggestion.id,
                                label: suggestion.client_Name,
                              }))
                            : []
                        }
                        // components={components}
                        value={selectedClient}
                        onChange={handleselececlient}
                        isClearable={isClearable}
                        //   defaultOptions
                        isDisabled={isView || isEdit}
                        placeholder="Select Client Name"
                      />
                      <span style={{ color: "red" }}>
                        {selectedClientErr.length > 0 ? selectedClientErr : ""}
                      </span>
                    </Grid>
                    {/* <Grid item xs={3} style={{ paddingRight: "0px" }}>
                      <p>Customer name*</p>

                      <TextField
                        className="mb-16"
                        //   label="Name "
                        autoFocus
                        name="name"
                        value={name}
                        error={nameErr.length > 0 ? true : false}
                        helperText={nameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        placeholder="Enter name"
                        disabled={isView || isEdit || isselect}
                      />
                    </Grid>{" "} */}
                    {/* <span style={{ color: "red" }}>
                        {selectedCountryErr.length > 0
                          ? selectedCountryErr
                          : ""}
                      </span> */}
                    {/* <Grid item xs={3} style={{ paddingRight: "0px" }}>
                      <p>Firm name*</p>

                        <TextField
                          className="mb-16"
                        //   label="Company Name "
                        placeholder="Enter firm name"
                          autoFocus
                          name="firmName"
                          value={firmName}
                          error={firmNameErr.length > 0 ? true : false}
                          helperText={firmNameErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      </Grid>{" "} */}
                    <Grid item xs={3} >
                      <p>Email Id</p>

                      <TextField
                        autoFocus
                        name="email"
                        value={email}
                        error={emailErr.length > 0 ? true : false}
                        helperText={emailErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        placeholder="Enter Email Id"
                        disabled={isView || isEdit || isselect}
                      />
                    </Grid>{" "}
                    <Grid item xs={3} >
                      <p>Mobile No.</p>

                      <TextField
                        placeholder="Enter Number"
                        name="number"
                        value={phoneNumOne}
                        error={phoneNumOneErr.length > 0 ? true : false}
                        helperText={phoneNumOneErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView || isEdit || isselect}
                      />
                    </Grid>{" "}
                    {/* <Grid item xs={3} style={{ paddingRight: "0px" }}>
                      <p>Phone No.*</p>

                        <TextField
                          className="mb-16"
                        //   label="Mo.Number "
                        placeholder="Enter number"
                          // autoFocus
                          name="Phone"
                          value={phoneNumTwo}
                          error={phoneNumTwoErr.length > 0 ? true : false}
                          helperText={phoneNumTwoErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                        //   required
                          fullWidth
                        />
                      </Grid>{" "} */}
                    <Grid item xs={3} >
                      {/* <label><b>Company Address:</b> </label> */}
                      <p>Address</p>

                      <TextField
                        placeholder="Enter Address "
                        autoFocus
                        name="companyAddress"
                        value={companyAddress}
                        error={companyAddressErr.length > 0 ? true : false}
                        helperText={companyAddressErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        maxRows={3}
                        multiline
                        disabled={isView || isEdit || isselect}

                        //   style={{height:"60%",width:"100%",marginTop:"1%",border:"1px solid #e6e6e6"}}
                      />
                    </Grid>{" "}
                    <Grid item xs={3} >
                      <p>Aadhaar Number</p>

                      <TextField
                        placeholder="Enter Aadhaar Number"
                        autoFocus
                        name="adharcard"
                        value={adharcad}
                        error={adharCadErr.length > 0 ? true : false}
                        helperText={adharCadErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView || isEdit || isselect}
                      />
                    </Grid>{" "}
                    <Grid item xs={3} >
                      <p>Country*</p>
                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        // classes={classes}
                        styles={selectStyles}
                        options={countryData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        placeholder="Select Country"
                        isDisabled={isView || isEdit || isselect}
                      />

                      <span style={{ color: "red" }}>
                        {selectedCountryErr.length > 0
                          ? selectedCountryErr
                          : ""}
                      </span>
                    </Grid>
                    <Grid item xs={3} >
                      {/* <label><b>Company Address:</b> </label> */}
                      <p>State*</p>

                      <Select
                        // className={classes.selectBox}
                        name="state"
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        styles={selectStyles}
                        options={stateData.map((suggestion) => ({
                          // key: suggestion.id,
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        // value={itemType}
                        onChange={handleChangeState}
                        value={selectedState}
                        placeholder="Select State"
                        isDisabled={isView || isEdit || isselect}
                      />
                      <span style={{ color: "red" }}>
                        {selectedStateErr.length > 0 ? selectedStateErr : ""}
                      </span>
                    </Grid>{" "}
                    <Grid item xs={3} >
                      {/* <label><b>Company Address:</b> </label> */}
                      <p>City*</p>

                      <Select
                        // className={classes.selectBox}
                        name="state"
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        styles={selectStyles}
                        options={cityData.map((suggestion) => ({
                          // key: suggestion.id,
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        // value={itemType}
                        onChange={handleChangeCity}
                        value={selectedCity}
                        placeholder="Select City"
                        isDisabled={isView || isEdit || isselect}
                      />
                      <span style={{ color: "red" }}>
                        {selectedCityErr.length > 0 ? selectedCityErr : ""}
                      </span>
                    </Grid>{" "}
                    <Grid item xs={3} >
                      <p>Pan No.</p>
                      <TextField
                        className="mb-16"
                        placeholder="Enter Pan No"
                        name="panNo"
                        value={panNo}
                        error={panNoErr.length > 0 ? true : false}
                        helperText={panNoErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView || isEdit || isselect}
                      />
                    </Grid>{" "}
                    <Grid item xs={3} >
                      <p>GST No.</p>

                      <TextField
                        className="mb-16"
                        placeholder="Enter Gst.No"
                        autoFocus
                        name="gstNo"
                        value={gstNo}
                        error={gstNoErr.length > 0 ? true : false}
                        helperText={gstNoErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView || isEdit || isselect}
                      />
                    </Grid>{" "}
                    <Grid item xs={3} >
                      <p>Pincode*</p>

                      <TextField
                        className="mb-16"
                        placeholder="Enter Pincode"
                        autoFocus
                        name="pincod"
                        value={pincode}
                        error={pincodeErr.length > 0 ? true : false}
                        helperText={pincodeErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView || isEdit || isselect}
                      />
                    </Grid>{" "}
                    {/* 
                    <Grid item xs={3} style={{ paddingRight: "0px" }}>
                    <FormControl
                      component="fieldset"
                    //   className={classes.formControl}
                    >
                      <FormLabel component="legend">Status :</FormLabel>
                      <RadioGroup
                        aria-label="Status"
                        name="status"
                        style={{display:"block"}}
                        className={classes.group}
                        value={status}
                        onChange={handleChangeStatus}
                      >
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="Active"
                        />
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Deactive"
                        />
                      </RadioGroup>
                      <span style={{ color: "red" }}>
                        {statusErr.length > 0 ? statusErr : ""}
                      </span>
                    </FormControl>
                  </Grid> */}
                  </Grid>
                  <h4 className="mt-24 mb-12">Description Making:</h4>

                  <Grid container spacing={3} className="add-client-row" style={{paddingBottom:"12px"}}>
                    {isView || isEdit ? (
                      <Grid item xs={3}>
                        <p>Status</p>

                        <Select
                          // className={classes.selectBox}
                          name="karat purity"
                          filterOption={createFilter({
                            ignoreAccents: false,
                          })}
                          styles={selectStyles}
                          options={OrderRetStatus.map((suggestion) => ({
                            // key: suggestion.id,
                            value: suggestion.id,
                            label: suggestion.name,
                          }))}
                          seleced
                          // components={components}
                          // value={itemType}
                          onChange={handleSelectstatus}
                          value={selectedstates}
                          isDisabled={isView}
                          placeholder="Select states"
                        />

                        {/* <span className="fornt-Err-Select">
                     {selectedPurityErr.length > 0 ? selectedPurityErr : ""}
                                            </span> */}
                      </Grid>
                    ) : (
                      ""
                    )}
                    {/* <p>Description Making</p> */}
                    <Grid item xs={3}>
                      <p>Gold Type:</p>

                      <Select
                        // className={classes.selectBox}
                        name="gold type"
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        styles={selectStyles}
                        options={goldtypes.map((suggestion) => ({
                          // key: suggestion.id,
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        onChange={handleSelectChanges}
                        value={selectedGold}
                        isDisabled={isView}
                        placeholder="Select Gold Type"
                      />
                      <span className="fornt-Err-Select">
                        {selectedGoldErr.length > 0 ? selectedGoldErr : ""}
                      </span>
                    </Grid>{" "}
                    <Grid item xs={3}>
                      <p>Karat /Purity</p>

                      <Select
                        // className={classes.selectBox}
                        name="karat purity"
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        styles={selectStyles}
                        options={purity.map((suggestion) => ({
                          // key: suggestion.id,
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        // value={itemType}
                        onChange={handleSelectChange}
                        value={selectedpurity}
                        isDisabled={isView}
                        placeholder="Select karat/purity"
                      />

                      <span className="fornt-Err-Select">
                        {selectedPurityErr.length > 0 ? selectedPurityErr : ""}
                      </span>
                    </Grid>{" "}
                  </Grid>
                  <h4 className="mt-24 mb-12">Advance Collection On Order:</h4>
                  <Grid container spacing={3} style={{paddingBottom:"12px"}}>
                    <Grid item xs={3}>
                      <p>Fine Gold Received In Grams</p>
                      <TextField
                        placeholder="Enter Fine Gold In Gram"
                        name="finegold"
                        value={finegold}
                        error={finegoldErr.length > 0 ? true : false}
                        helperText={finegoldErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </Grid>{" "}
                    <Grid item xs={3}>
                      <p>Amount Received</p>
                      <TextField
                        placeholder="Enter Amount"
                        autoFocus
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
                    </Grid>{" "}
                  </Grid>
                </form>

                <Grid container>
                  <Grid item xs={12} sm={12} md={12}>
                    <Grid
                      item
                      xs={12}
                    >
                      {!isView && (
                        <>
                          <Button
                            className={clsx(
                              classes.uibuttion,
                              "uplod-btn float-right"
                            )}
                            style={{marginBottom:20}}
                            id="upload-btn-jewellery"
                            variant="contained"
                            color="primary"
                            onClick={handleClick}
                            fullWidth
                          >
                            Browse Image Multiple Select
                          </Button>

                          <input
                            id="files"
                            type="file"
                            ref={hiddenFileInput}
                            onChange={(event) => {
                              // handleImageSelect
                              setImages(event);
                            }}
                            accept="image/*"
                            multiple
                            style={{ display: "none" }}
                            disabled={isView}
                          />
                        </>
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      style={{ padding: 0 }}
                    >
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              ID
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Image
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Reference Name
                            </TableCell>

                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {imgFiles.map((row, index) => (
                            <TableRow key={index}>
                              {/* component="th" scope="row" */}
                              <TableCell className={classes.tableRowPad}>
                                {index + 1}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                <>
                                  <img
                                    src={row.imageURL}
                                    style={{ width: "100px", height: "50px" }}
                                    className="mt-16"
                                    alt=""
                                    onClick={() => {
                                      setModalView(3);
                                      setImage(row.imageURL);
                                    }}
                                  />
                                </>
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                <TextField
                                  className=""
                                  placeholder="Reference Name"
                                  name="referencename"
                                  value={row.reference_name}
                                  error={row.error ? true : false}
                                  helperText={row.error ? row.error : ""}
                                  onChange={(e) =>
                                    handleInputChangenum(e, index)
                                  }
                                  variant="outlined"
                                  required
                                  fullWidth
                                  disabled={isView}
                                />
                              </TableCell>

                              <TableCell className={classes.tableRowPad}>
                                {row.id ? (
                                  ""
                                ) : (
                                  <IconButton
                                    style={{ padding: "0" }}
                                    onClick={() => handleRemoveRow(index)}
                                    disabled={isView}
                                  >
                                    <Icon className="mr-8 delete-icone">
                                      <img src={Icones.delete_red} alt="" />
                                    </Icon>
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid
              container
              style={{ marginTop: 20, columnGap: 20, display:"flex", justifyContent:"flex-end"}}
            >
              <Grid item  key="1">
              {!isView && (
                  <>
                    <Button
                      id="btn-save"
                      variant="contained"
                      color="primary"
                      className="w-224 mx-auto"
                      aria-label="Register"
                      onClick={(e) => {
                        handleFormSubmit(e);
                      }}
                    >
                      Save
                    </Button>
                  </>
                )}
              </Grid>

              <Grid item key="2">
              <Button
                  variant="contained"
                  className="w-224 mx-auto btn-print-save"
                  aria-label="Register"
                  onClick={checkforPrint}
                >
                  {isView ? "Print" : "Save & Print"}
                </Button>
              </Grid>
            </Grid>

                
              

                <div style={{ display: "none" }}>
                  <Orderprint ref={componentRef} printObj={printObj} />
                </div>

              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddOrderRetailer;

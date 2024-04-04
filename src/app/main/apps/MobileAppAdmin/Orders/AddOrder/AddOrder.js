import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import clsx from "clsx";
import { FuseAnimate } from "@fuse";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField, Icon, IconButton, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Loader from "app/main/Loader/Loader";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Select, { createFilter } from "react-select";
import History from "@history";
import UploadFile from "../Components/UploadFile";
import Icones from "assets/fornt-icons/Mainicons";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    // height: "100%",
  },
  tableRowPad: {
    padding: 7,
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
    borderRadius: 7,
  },
  normalSelect: {
    // marginTop: 8,
    padding: 6,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 0,
    width: "100%",
    // marginLeft: 15,
  },
  textOverFlow: {
    display: "block",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  errorMessage : {
    color: "#f44336",
    bottom: 0,
    display: "block",
    position: "relative",
    fontSize: "11px",
    lineHeight: "8px",
    marginTop: 3,
  },
}));

const AddOrder = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();

  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [retailerList, setRetailerList] = useState([]);
  const [retailer, setRetailer] = useState("");
  const [retailerErr, setRetailerErr] = useState("");

  const [distributerArr, setDistributerArr] = useState([]);
  const [distributer, setDistributer] = useState("");
  const [distributerErr, setDistributerErr] = useState("");

  const [rhodiumOnStone, setRhodiumOnStone] = useState("");
  const [rhodiumOnStoneErr, setRhodiumOnStoneErr] = useState("");

  const [rhodiumOnPlainPart, setRhodiumOnPlainPart] = useState("");
  const [rhodiumOnPlainPartErr, setRhodiumOnPlainPartErr] = useState("");

  const [rhodiumRemark, setRhodiumRemark] = useState("");

  const [SandblastingDull, setSundblastingDull] = useState("");
  const [SandblastingDullErr, setSundblastingDullErr] = useState("");

  const [satinDull, setSatinDull] = useState("");
  const [satinDullErr, setSatinDullErr] = useState("");

  const [dullTexureRemark, setDullTexureRemark] = useState("");

  const [enamel, setEnamel] = useState("");
  const [enamelErr, setEnamelErr] = useState("");

  const [enamelRemark, setEnamelRemark] = useState("");

  const [additionStoneColor, setAdditionalStoneColor] = useState("");
  const [additionStoneColorErr, setAdditionalStoneColorErr] = useState("");

  const [additionalColorRemark, setAdditionalColorRemark] = useState("");

  const [finalOrderRemark, setFinalOrderRemark] = useState("");

  const [screwType, setScrewType] = useState("");
  const [screwTypeErr, setScrewTypeErr] = useState("");

  const [apiData, setApiData] = useState([]);
  const [variantNoArr, setVariantNoArr] = useState([]);
  const [addFlag, setAddFlag] = useState(false);

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [karatMain, setKaratMain] = useState("");
  const [karatMainErr, setKaratMainErr] = useState("");

  const [orderType, setOrderType] = useState("");
  const [orderTypeErr, setOrderTypeErr] = useState("");

  const karatArr = [{ value: 14 }, { value: 18 }, { value: 20 }, { value: 22 }];

  const screwTypeArr = [
    { id: 1, label: "Bombay Post with Screw" },
    { id: 2, label: "Bombay Post without Screw" },
    { id: 3, label: "South Screw" },
    { id: 4, label: "Push Butterfly Screw" },
  ];
  const orderArr = [
    { id: 2, label: "Cart Order" },
    { id: 3, label: "Exhibition Order" },
    { id: 4, label: "Link Order" },
    { id: 5, label: "Customer Order" },
  ];

  const [exhibitionNameList, setExhibitionNameList] = useState([]);
  const [selectedExhibition, setSelectedExhibition] = useState("");
  const [selectedExhibitionErr, setSelectedExhibitionErr] = useState("");

  const [updtRecord, setUpdtRecord] = useState({
    design_id: "",
    variant_no: "",
    category_id: "",
    comment: "",
    karat: "",
    gross_weight: "",
    net_weight: "",
    stone_weight: "",
    stone_difference: "",
    pieces: "",
    errors: {
      design_id: null,
      variant_no: null,
      category_id: null,
      comment: null,
      karat: null,
      gross_weight: null,
      net_weight: null,
      stone_weight: null,
      stone_difference: null,
      pieces: null,
    },
  });

  const [designApiData, setDesignApiData] = useState([]);
  const [designSearch, setDesignSearch] = useState("");

  const [deliveryDueDate, setDeliveryDueDate] = useState("");
  const [dateErr, setDateErr] = useState("");

  const [subject, setSubject] = useState("");
  const [subjectErr, setSubjectErr] = useState("");
  const [remarks, setRemarks] = useState("");

  const [referenceNo, setReferenceNo] = useState("");
  const [adminnotes, setAdminnotes] = useState("");
  const [imgFileArr, setImageFileArr] = useState([]);
  const [allImageFiles, setallImageFiles] = useState([]);

  const [quantity, setQuantity] = useState("");
  const [customername, setcustomername] = useState("");
  const [salesman, setsalesman] = useState("");

  const unitArr = [{ value: "Pieces" }, { value: "Pair" }, { value: "Set" }];

  const initialFormValues = [
    {
      Referenceno: "",
      Quantity: "",
      FromWeight: "",
      ToWeight: "",
      unit: "",
      file: [],
      errors: {
        Referenceno: null,
        Quantity: null,
        FromWeight: null,
        ToWeight: null,
        unit: null,
      },
    },
  ];

  const [customerOrderFormValues, setCustomerOrderFormValues] =
  useState(initialFormValues);

  const validateForm = () => {
    const updatedFormValues = [...customerOrderFormValues];

    let isValid = true;

    updatedFormValues.forEach((formValue, index) => {
      const errors = {};

      if (!formValue.Referenceno) {
        errors.Referenceno = "Reference number is required.";
        isValid = false;
      }

      if (!formValue.Quantity) {
        errors.Quantity = "Quantity is required.";
        isValid = false;
      }

      if (!formValue.FromWeight) {
        errors.FromWeight = "From weight is required.";
        isValid = false;
      }

      if (!formValue.ToWeight) {
        errors.ToWeight = "To weight is required.";
        isValid = false;
      }

      if (!formValue.unit || undefined || null || "") {
        errors.unit = "Select unit is required.";
        isValid = false;
      }

      updatedFormValues[index] = {
        ...formValue,
        errors,
      };
    });

    setCustomerOrderFormValues(updatedFormValues);

    return isValid;
  };

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (designSearch) {
        getDesignData(designSearch);
      } else {
        setDesignApiData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
    //eslint-disable-next-line
  }, [designSearch]);

  useEffect(() => {
    if (orderType && orderType.value === 3) {
      getExhibitionList();
    }
  }, [orderType]);

  function getExhibitionList() {
    axios
      .get(Config.getCommonUrl() + `api/exhibitionMaster/new-exhibitions/list`)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setExhibitionNameList(response.data.data);
        } else {
          setExhibitionNameList([]);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/exhibitionMaster/new-exhibitions/list",
        });
      });
  }

  useEffect(() => {
    const timeouttwo = setTimeout(() => {
      let tempRecord = { ...updtRecord };

      let pass = true;
      if (tempRecord.variant_no === "") {
        pass = false;
      }

      if (tempRecord.karat === "") {
        pass = false;
      }
      let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

      if (
        tempRecord.pieces === "" ||
        percentRegex.test(tempRecord.pieces) === false
      ) {
        pass = false;
      }

      if (addFlag && pass) {
        getWeightsForDesign();
      }
    }, 800);
    return () => {
      clearTimeout(timeouttwo);
    };
    //eslint-disable-next-line
  }, [updtRecord.variant_no, updtRecord.karat, updtRecord.pieces]);

  function getWeightsForDesign() {
    setLoading(true);
    axios
      .post(Config.getCommonUrl() + "api/order/designWeightCalculation", {
        variant_number: updtRecord.variant_no,
        karat: Number(updtRecord.karat),
        pcs: updtRecord.pieces,
      })
      .then(function (response) {
        console.log(response);

        setLoading(false);
        if (response.data.success === true) {
          let tempRecord = { ...updtRecord };
          tempRecord.gross_weight = response.data.data.total_gross_weight;
          tempRecord.net_weight = response.data.data.total_net_weight;
          tempRecord.stone_weight = response.data.data.total_stone_weight;
          tempRecord.stone_difference =
            response.data.data.total_stone_difference;
          tempRecord.errors.gross_weight = null;
          tempRecord.errors.net_weight = null;
          setUpdtRecord(tempRecord);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/order/designWeightCalculation",
          body: {
            variant_number: updtRecord.variant_no,
            karat: Number(updtRecord.karat),
            pcs: updtRecord.pieces,
          },
        });
      });
  }

  function getDesignData(designNo) {
    axios
      .get(Config.getCommonUrl() + `api/design/search/variant/${designNo}`)
      .then(function (response) {
        if (response.data.success === true) {
          if (response.data.data.length > 0) {
            setDesignApiData(response.data.data);
          } else {
            setDesignApiData([]);
            dispatch(
              Actions.showMessage({
                message: "Please insert proper design number",
              })
            );
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/design/search/variant/${designNo}`,
        });
      });
  }

  useEffect(() => {
    getDistributerList();
  }, []);

  useEffect(() => {
    if (distributer) {
      getRetailerList();
    }
  }, [distributer]);

  useEffect(() => {
    if (addFlag) {
      updateCurrentRow();
    }
  }, [karatMain]);

  function updateCurrentRow() {
    const objData = { ...updtRecord };
    objData.karat = karatMain.value;
    setUpdtRecord(objData);
  }

  function getRetailerList() {
    axios
      .get(
        Config.getCommonUrl() +
          `api/distributormaster/distributor-retailer/${distributer.value}`
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log(response.data.data);
          setRetailerList(response.data.data);
        } else {
          setRetailerList([]);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/distributormaster/distributor-retailer/${distributer.value}`,
        });
      });
  }

  function getDistributerList() {
    axios
      .get(Config.getCommonUrl() + `api/client/all/client`)
      .then(function (response) {
        if (response.data.success === true) {
          setDistributerArr(response.data.data);
        } else {
          setDistributerArr([]);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/client/all/client`,
        });
      });
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

  function validateOrderType() {
    if (orderType === "") {
      setOrderTypeErr("Select order type");
      return false;
    }
    return true;
  }

  const handleChangeDistributer = (value) => {
    if (validateOrderType()) {
      setDistributer(value);
      setDistributerErr("");
      setRetailer("");
      setRetailerErr("");
    }
  };

  const handleChangeScrew = (value) => {
    setScrewType(value);
    setScrewTypeErr("");
  };

  const handleChangeOrder = (value) => {
    setApiData([]);
    setOrderType(value);
    setOrderTypeErr("");
  };

  const handleChangeRetailer = (value) => {
    setRetailer(value);
    setRetailerErr("");
  };

  const handleChangeKarat = (value) => {
    setKaratMain(value);
    setKaratMainErr("");
  };

  const handleChangeDueDate = (e) => {
    setDeliveryDueDate(e.target.value);
    setDateErr("");
    validateDueDate(e.target.value);
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "rhodiumOnStone") {
      setRhodiumOnStone(value);
      setRhodiumOnStoneErr("");
    } else if (name === "rhodiumOnPlainPart") {
      setRhodiumOnPlainPart(value);
      setRhodiumOnPlainPartErr("");
    } else if (name === "rhodiumRemark") {
      setRhodiumRemark(value);
    } else if (name === "SandblastingDull") {
      setSundblastingDull(value);
      setSundblastingDullErr("");
    } else if (name === "satinDull") {
      setSatinDull(value);
      setSatinDullErr("");
    } else if (name === "dullTexureRemark") {
      setDullTexureRemark(value);
    } else if (name === "enamel") {
      setEnamel(value);
      setEnamelErr("");
    } else if (name === "enamelRemark") {
      setEnamelRemark(value);
    } else if (name === "additionStoneColor") {
      setAdditionalStoneColor(value);
      setAdditionalStoneColorErr("");
    } else if (name === "additionalColorRemark") {
      setAdditionalColorRemark(value);
    } else if (name === "finalOrderRemark") {
      setFinalOrderRemark(value);
    } 
    else if (name === "CustomerName") {
      setcustomername(value);
    } else if (name === "SalesMan") {
      setsalesman(value);
    } else if (name === "Quantity") {
      setQuantity(value);
    }
    else if (name === "Subject") {
      setSubject(value);
      setSubjectErr("");
    } else if (name === "Remarks") {
      setRemarks(value);
    }
    else if (name === "Referenceno") {
      setReferenceNo(value);
    } else if (name === "AdminNotes") {
      setAdminnotes(value)
    }

  };

  let handleDesignNoSelect = (designNo) => {
    let filteredArray = designApiData.filter(
      (item) => item.variant_number === designNo
    );

    if (filteredArray.length > 0) {
      setDesignApiData(filteredArray);

      let tempRecord = { ...updtRecord };
      tempRecord.variant_no = designNo;
      tempRecord.design_id = filteredArray[0].id;
      tempRecord.category_id = filteredArray[0].category_id;
      tempRecord.errors.variant_no = null;
      setUpdtRecord(tempRecord);
    } else {
      let tempRecord = { ...updtRecord };
      tempRecord.variant_no = "";
      tempRecord.errors.variant_no = "Please Select Proper Design No";
      setUpdtRecord(tempRecord);
    }
  };

  const handleDesignsInputChange = (e, index) => {
    console.log(e);
    let newFormValues = [...customerOrderFormValues];
    newFormValues[index]["unit"] = e;

    if (!e) {
      newFormValues[index].errors.unit = "Select Unit";
    } else {
      newFormValues[index].errors.unit = null;
    }
    setCustomerOrderFormValues(newFormValues);
  };

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    let tempRecord = { ...updtRecord };
    tempRecord[name] = value;
    tempRecord.errors[name] = null;

    setUpdtRecord(tempRecord);
  };

  function cancelAdd() {
    setAddFlag(false);
    setUpdtRecord({
      design_id: "",
      variant_no: "",
      category_id: "",
      comment: "",
      karat: "",
      gross_weight: "",
      net_weight: "",
      stone_weight: "",
      stone_difference: "",
      pieces: "",
      errors: {
        design_id: null,
        variant_no: null,
        category_id: null,
        comment: null,
        karat: null,
        gross_weight: null,
        net_weight: null,
        stone_weight: null,
        stone_difference: null,
        pieces: null,
      },
    });
    setDesignApiData([]);
    setDesignSearch("");
  }

  function deleteHandler(row) {
    setSelectedIdForDelete(row.variant_no);
    setOpen(true);
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function callDeleteData() {
    const arrData = [...apiData];
    const idArrData = [...variantNoArr];

    const finalData = arrData.filter(
      (item) => item.variant_no !== selectedIdForDelete
    );
    const finalArr = idArrData.filter((item) => item !== selectedIdForDelete);

    setApiData(finalData);
    setVariantNoArr(finalArr);
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function validateKarat() {
    if (karatMain === "") {
      setKaratMainErr("Enter valid karat");
      return false;
    }
    return true;
  }

  function handleAddDesign(fileUpload) {
    if (validateAdditionalData()) {
      if (fileUpload) {
        setOpenModal(true);
      } else {
        const objData = { ...updtRecord };
        objData.karat = karatMain.value;
        setUpdtRecord(objData);
        setAddFlag(true);
      }
    }
  }

  function validateIsAdded() {
    const tempRecord = { ...updtRecord };
    const mainArr = [...apiData];
    let result = true;

    mainArr.map((item) => {
      if (
        item.variant_no === tempRecord.variant_no &&
        item.karat == tempRecord.karat
      ) {
        result = false;
        dispatch(Actions.showMessage({ message: "This Entry already exist" }));
      }
    });
    return result;
  }

  function addRecord() {
    // validate , call add api then do this
    if (validateIsAdded() && validateRecord()) {
      let tempsRecord = { ...updtRecord };
      setApiData([...apiData, tempsRecord]);
      setVariantNoArr([...variantNoArr, tempsRecord.variant_no]);
      setAddFlag(false);
      setUpdtRecord({
        design_id: "",
        variant_no: "",
        category_id: "",
        comment: "",
        karat: "",
        gross_weight: "",
        net_weight: "",
        stone_weight: "",
        stone_difference: "",
        pieces: "",
        errors: {
          design_id: null,
          variant_no: null,
          category_id: null,
          comment: null,
          karat: null,
          gross_weight: null,
          net_weight: null,
          stone_weight: null,
          stone_difference: null,
          pieces: null,
        },
      });
      setDesignApiData([]);
      setDesignSearch("");
    }
  }

  function validateRecord() {
    let tempRecord = { ...updtRecord };

    let pass = true;
    if (tempRecord.variant_no === "") {
      tempRecord.errors.variant_no = "Please Select Proper Design No";
      pass = false;
    }

    let percentRegex = /^[0-9]{1,6}$/;
    if (
      tempRecord.pieces === "" ||
      percentRegex.test(tempRecord.pieces) === false ||
      tempRecord.pieces == 0
    ) {
      tempRecord.errors.pieces = "Please Enter Valid Pieces";
      pass = false;
    }

    if (tempRecord.gross_weight === "") {
      tempRecord.errors.gross_weight = "Please Select Proper Data";
      pass = false;
    }

    if (tempRecord.net_weight === "") {
      tempRecord.errors.net_weight = "Please Select Proper Data";
      pass = false;
    }

    console.log(tempRecord);
    setUpdtRecord(tempRecord);
    return pass;
  }

  function validateDistribute() {
    if (distributer === "") {
      setDistributerErr("Select Distributer");
      return false;
    }
    return true;
  }

  function validateDueDate(selectedDate) {
    const currentDate = moment();
    const minimumDate = currentDate.clone().add(10, "days");

    if (moment(selectedDate).isBefore(minimumDate, "day")) {
      const errorMessage =
        "Please enter a due date at least 10 days from today";
      setDateErr(errorMessage);
      return false;
    }
    setDateErr("");
    return true;
  }

  function validateEnamel() {
    if (enamel === "" || regex.test(enamel) === false) {
      setEnamelErr("Enter valid rate");
      return false;
    }
    return true;
  }

  function validateStoneColor() {
    if (additionStoneColor === "" || regex.test(additionStoneColor) === false) {
      setAdditionalStoneColorErr("Enter valid rate");
      return false;
    }
    return true;
  }

  function validateScrewType() {
    if (screwType === "") {
      setScrewTypeErr("Select screwType");
      return false;
    }
    return true;
  }
  let regex = /^[0-9]$|^[1-9][0-9]$|^(100)$/; // no decimal number 0-100

  function validateOnStone() {
    if (rhodiumOnStone === "" || regex.test(rhodiumOnStone) === false) {
      setRhodiumOnStoneErr("Enter valid rate");
      return false;
    }
    return true;
  }

  function validatePlainPart() {
    if (rhodiumOnPlainPart === "" || regex.test(rhodiumOnPlainPart) === false) {
      setRhodiumOnPlainPartErr("Enter valid rate");
      return false;
    }
    return true;
  }

  function validateStainDull() {
    if (satinDull === "" || regex.test(satinDull) === false) {
      setSatinDullErr("Enter valid rate");
      return false;
    }
    return true;
  }

  function validateSunblastingDull() {
    if (SandblastingDull === "" || regex.test(SandblastingDull) === false) {
      setSundblastingDullErr("Enter valid rate");
      return false;
    }
    return true;
  }

  function validateRetailer() {
    if (retailer === "") {
      setRetailerErr("Select a retailer");
      return false;
    }
    return true;
  }

  function validatedate() {
    if (!deliveryDueDate) {
      setDateErr("Select Date");
      return false;
    }
    setDateErr("");
    return true;
  }

  function subjectValidation() {
    if (subject === "") {
      setSubjectErr("Enter Subject");
      return false;
    }
    return true;
  }

  function validateExhibition() {
    if (orderType.value === 3 && selectedExhibition === "") {
      setSelectedExhibitionErr("Select a exhibition name");
      return false;
    }
    return true;
  }

  function validateAdditionalData() {
    if (
      validateOrderType() &&
      validateExhibition() &&
      validateDistribute() &&
      validateRetailer() &&
      validateOnStone() &&
      validatePlainPart() &&
      validateSunblastingDull() &&
      validateStainDull() &&
      validateEnamel() &&
      validateStoneColor() &&
      validateScrewType() &&
      validateKarat()
    ) {
      return true;
    }
  }

  function allvalidateAddition() {
    if (
      validateOrderType() &&
      validateDistribute() &&
      validateDueDate(deliveryDueDate) &&
      validateRetailer() &&
      validateScrewType() &&
      validateKarat() &&
      validatedate() &&
      subjectValidation()
    ) {
      return true;
    }
  }

  function validateAddedDesign() {
    if (apiData.length === 0) {
      dispatch(
        Actions.showMessage({ message: "Please add or upload new design" })
      );
      return false;
    }
    return true;
  }

  const addFinalData = () => {
    if (orderType.value === 5) {
      const isValid = validateForm();
      if (allvalidateAddition() && isValid) {
        callCustomerOrderApi();
      }
    } else {
      const isAdditionalDataValid = validateAdditionalData();
      const isAddedDesignValid = validateAddedDesign();

      if (isAdditionalDataValid && isAddedDesignValid) {
        callAddOrderApi();
      } else {
        console.log("else");
      }
    }
  };

  function callAddOrderApi() {
    const body = {
      order_type: orderType.value,
      distributer_id: distributer.value,
      retailer_id: retailer.value,
      rhodium_on_stone_percentage: rhodiumOnStone,
      rhodium_on_plain_part_percentage: rhodiumOnPlainPart,
      rhodium_remarks: rhodiumRemark,
      sandblasting_dull_percentage: SandblastingDull,
      satin_dull_percentage: satinDull,
      dull_texture_remark: dullTexureRemark,
      enamel_percentage: enamel,
      enamel_remark: enamelRemark,
      additional_color_stone: additionStoneColor,
      additional_color_remark: additionalColorRemark,
      screw_type: screwType.value,
      karat: karatMain.value,
      final_order_remark: finalOrderRemark,
      designArray: apiData,
    };
    axios
      .post(Config.getCommonUrl() + `api/order/order-by-csv`, body)
      .then((response) => {
        if (response.data.success) {
          History.push(`/dashboard/mobappadmin/orders`);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success"}));
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/order/order-by-csv`, body });
      });
  }
  
  function callCustomerOrderApi() {
    const formData = new FormData();
    formData.append("distributer_id", distributer.value);
    formData.append("retailer_id", retailer.value);
    formData.append("due_date", deliveryDueDate);
    formData.append("karat", karatMain.value);
    formData.append("subject", subject);
    formData.append("customer_remark", remarks);
    formData.append("screw_type", screwType.value);
    formData.append("admin_notes", adminnotes);

    for (let i = 0; i < allImageFiles.length; i++) {
      const file = allImageFiles[i];
      formData.append("image_files", file);
    }

    const designDetails = customerOrderFormValues.map((formValue, index) => {
      for (let i = 0; i < formValue.file.length; i++) {
        formData.append(
          `design_details[${index}][image${i + 1}]`,
          formValue.file[i].upload_file_name
        );
      }

      const designDetail = {
        reference_no: formValue.Referenceno,
        quantity: formValue.Quantity,
        from_weight: formValue.FromWeight,
        to_weight: formValue.ToWeight,
        unit: formValue.unit.value,
      };

      return designDetail;
    });

    designDetails.forEach((designDetail, index) => {
      Object.keys(designDetail).forEach((key) => {
        formData.append(`design_details[${index}][${key}]`, designDetail[key]);
      });
    });

    axios
      .post(Config.getCommonUrl() + `api/order/customer-order`, formData)
      .then((response) => {
        if (response.data.success) {
          History.push(`/dashboard/mobappadmin/orders`);
          dispatch(Actions.showMessage({ message: response.data.message }));
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/order/customer-order`,
          body: JSON.stringify(formData),
        });
      });
  }

  function validateDuplicate(data) {
    let result = true;
    data.map((item) => {
      if (variantNoArr.includes(item.variant_no)) {
        result = false;
      }
    });
    return result;
  }

  const handleModalClose = (add, data) => {
    setOpenModal(false);
    if (add) {
      if (validateDuplicate(data)) {
        setApiData([...apiData, ...data]);
        const newData = data.map((item) => item.variant_no);
        setVariantNoArr([...variantNoArr, ...newData]);
        dispatch(
          Actions.showMessage({ message: "New Design uploded successfully" })
        );
      } else {
        dispatch(
          Actions.showMessage({ message: "Some Designs are already exist" })
        );
      }
    }
  };

  const handleChangeExhibition = (value) => {
    setSelectedExhibition(value);
    setSelectedExhibitionErr("");
  };

  let addCustomerOrderFormFields = () => {
    if (prevContactIsValid()) {
      setCustomerOrderFormValues([
        ...customerOrderFormValues,
        {
          Referenceno: "",
          Quantity: "",
          FromWeight: "",
          ToWeight: "",
          unit: "",
          file: [],
          errors: {
            Referenceno: null,
            Quantity: null,
            FromWeight: null,
            ToWeight: null,
            unit: null,
          },
        },
      ]);
    } else {
      console.log("else");
    }
  };

  const prevContactIsValid = () => {
    if (customerOrderFormValues.length === 0) {
      return true;
    }

    const someEmpty = customerOrderFormValues.some((item) => {
      return (
        item.Referenceno === "" ||
        // item.imageFiles === "" ||
        item.Quantity === "" ||
        item.FromWeight === "" ||
        item.ToWeight === "" ||
        item.unit === ""
      );
    });

    if (someEmpty) {
      customerOrderFormValues.map((item, index) => {
        const allPrev = [...customerOrderFormValues];

        let ReferenceNo = customerOrderFormValues[index].Referenceno;
        if (!ReferenceNo) {
          allPrev[index].errors.Referenceno = "Enter Reference Number";
        } else {
          allPrev[index].errors.Referenceno = null;
        }

        let Quantity = customerOrderFormValues[index].Quantity;
        if (!Quantity) {
          allPrev[index].errors.Quantity = "Enter Quantity";
        } else {
          allPrev[index].errors.Quantity = null;
        }

        let FromWeight = customerOrderFormValues[index].FromWeight;
        if (!FromWeight) {
          allPrev[index].errors.FromWeight = "Enter Weight";
        } else {
          allPrev[index].errors.FromWeight = null;
        }

        let ToWeight = customerOrderFormValues[index].ToWeight;
        if (!ToWeight) {
          allPrev[index].errors.ToWeight = "Enter Weight";
        } else {
          allPrev[index].errors.ToWeight = null;
        }

        let unit = customerOrderFormValues[index].unit;
        if (!unit) {
          allPrev[index].errors.unit = "Select Unit";
        } else {
          allPrev[index].errors.unit = null;
        }

        setCustomerOrderFormValues(allPrev);
        return true;
      });
    }

    return !someEmpty;
  };

  let handleContactChange = (i, e) => {
    console.log(e);
    let newFormValues = [...customerOrderFormValues];
    newFormValues[i][e.target.name] = e.target.value;

    let nm = e.target.name;
    if (nm === "cReferenceno") {
      let Referenceno = e.target.value;
      if (!Referenceno) {
        newFormValues[i].errors.Referenceno = "Enter Reference Number";
      } else {
        newFormValues[i].errors.Referenceno = null;
      }
    } else if (nm === "Quantity") {
      let Quantity = e.target.value;
      if (!Quantity) {
        newFormValues[i].errors.Quantity = "Enter Quantity";
      } else {
        newFormValues[i].errors.Quantity = null;
      }
    } else if (nm === "FromWeight") {
      let FromWeight = e.target.value;
      if (!FromWeight) {
        newFormValues[i].errors.FromWeight = "Enter Weight";
      } else {
        newFormValues[i].errors.FromWeight = null;
      }
    } else if (nm === "ToWeight") {
      let ToWeight = e.target.value;
      if (!ToWeight) {
        newFormValues[i].errors.ToWeight = "Enter Weight";
      } else {
        newFormValues[i].errors.ToWeight = null;
      }
    } else if (nm === "unit") {
      let unit = e;
      if (!unit) {
        newFormValues[i].errors.unit = "Select Unit";
      } else {
        newFormValues[i].errors.unit = null;
      }
    }
    setCustomerOrderFormValues(newFormValues);
  };

  let removeContactFormFields = (i) => {
    let newFormValues = [...customerOrderFormValues];
    newFormValues.splice(i, 1);
    setCustomerOrderFormValues(newFormValues);
  };

  const setImages = (event, index) => {
    const files = event.target.files;
    const newFormValues = [...customerOrderFormValues];
    const allImageFilesArr = [...allImageFiles];
    setallImageFiles(allImageFilesArr);
    // Check if exactly 2 images were selected
    if (files.length > 2) {
      dispatch(
        Actions.showMessage({
          message: "Please select Only 2 images",
        })
      );
      event.target.value = ""; // Reset the input
      return;
    }

    if (Config.checkFile(files, "image")) {
      setImageFileArr(files);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        newFormValues[index].file.push({
          upload_file_name: file.name,
          image_file: URL.createObjectURL(file),
          fielType: file.type,
        });
        allImageFilesArr.push(file);
      }
      setCustomerOrderFormValues(newFormValues);
    } else {
      document.getElementById("files").value = "";
      dispatch(
        Actions.showMessage({
          message: "Accept only .jpg, .png, or .jpeg files.",
        })
      );
    }
  };

  const hiddenFileInput = React.useRef(null);
  const handleRemoveRow = (i, index) => {
    console.log(i, index);
    const arr = [...customerOrderFormValues];
    console.log(arr);
    const Allimagarr = [...allImageFiles];
    console.log(Allimagarr);
    Allimagarr.splice(i, 1);
    arr[index].file.splice(i, 1);
    // const updatedData = arr.filter(row => row.index !== index);
    console.log(arr);
    setCustomerOrderFormValues(arr);
    setallImageFiles(Allimagarr);
  };

  return (
    <div
      className={clsx(classes.root, props.className, "w-full")}
      style={{ height: "calc(100vh - 100px)", overflowX: "hidden" }}
    >
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
              <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Add New Order
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              >
                <div className="btn-back">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
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
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>
            <div className="main-div-alll ">
              {openModal && (
                <UploadFile
                  handleModalClose={handleModalClose}
                  karat={karatMain.value}
                  orderType={orderType.value}
                  exhibitionId={selectedExhibition.value}
                />
              )}

              {loading && <Loader />}

              <div className=" mt-16 mb-76">
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span className="font-700"> Order Type </span>
                    <Select
                      styles={{ selectStyles }}
                      options={orderArr.map((group) => ({
                        value: group.id,
                        label: group.label,
                      }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={orderType}
                      onChange={handleChangeOrder}
                    />
                    <span className={classes.errorMessage} >
                      {orderTypeErr.length > 0 ? orderTypeErr : ""}
                    </span>
                  </Grid>
                  {orderType.value === 3 && (
                    <>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <span className="font-700"> Exhibition Name </span>
                        <Select
                          styles={{ selectStyles }}
                          options={exhibitionNameList.map((group) => ({
                            value: group.id,
                            label: group.name,
                          }))}
                          filterOption={createFilter({ ignoreAccents: false })}
                          value={selectedExhibition}
                          onChange={handleChangeExhibition}
                        />
                        <span className={classes.errorMessage}>
                          {selectedExhibitionErr.length > 0
                            ? selectedExhibitionErr
                            : ""}
                        </span>
                      </Grid>{" "}
                    </>
                  )}
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span className="font-700"> Distributor </span>

                    <Select
                      styles={{ selectStyles }}
                      options={distributerArr.map((group) => ({
                        value: group.id,
                        label: group.name,
                      }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={distributer}
                      onChange={handleChangeDistributer}
                    />
                    <span className={classes.errorMessage}>
                      {distributerErr.length > 0 ? distributerErr : ""}
                    </span>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span className="font-700"> Retailer </span>

                    <Select
                      styles={{ selectStyles }}
                      options={retailerList.map((group) => ({
                        value: group.id,
                        label: group.company_name,
                      }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={retailer}
                      onChange={handleChangeRetailer}
                    />
                    <span className={classes.errorMessage}>
                      {retailerErr.length > 0 ? retailerErr : ""}
                    </span>
                  </Grid>

                  {orderType.value !== 5 && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span className="font-700"> Rhodium on stone % </span>
                    <TextField
                      placeholder="Enter rhodium on stone %"
                      // className="mt-16"
                      // label="Rhodium on stone %"
                      name="rhodiumOnStone"
                      value={rhodiumOnStone}
                      error={rhodiumOnStoneErr.length > 0 ? true : false}
                      helperText={rhodiumOnStoneErr}
                      onChange={(e) => handleChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </Grid>
                )}

                {orderType.value !== 5 && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span className="font-700">Rhodium on Plain part %</span>
                    <TextField
                      placeholder="Enter rhodium on plain part %"
                      name="rhodiumOnPlainPart"
                      value={rhodiumOnPlainPart}
                      error={rhodiumOnPlainPartErr.length > 0 ? true : false}
                      helperText={rhodiumOnPlainPartErr}
                      onChange={(e) => handleChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </Grid>
                  )}

                {orderType.value !== 5 && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span className="font-700">Rhodium Remarks</span>
                    <TextField
                      placeholder="Enter rhodium remarks"
                      // label="Rhodium Remarks"
                      name="rhodiumRemark"
                      value={rhodiumRemark}
                      onChange={(e) => handleChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </Grid>
                )}

                  {orderType.value !== 5 && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span className="font-700">Sandblasting dull %</span>
                    <TextField
                      placeholder="Enter sandblasting dull %"
                      // label="Sandblasting dull %"
                      name="SandblastingDull"
                      value={SandblastingDull}
                      error={SandblastingDullErr.length > 0 ? true : false}
                      helperText={SandblastingDullErr}
                      onChange={(e) => handleChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </Grid>
                )}

                 {orderType.value !== 5 && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span className="font-700">Satin dull %</span>
                    <TextField
                      placeholder="Enter satin dull %"
                      name="satinDull"
                      value={satinDull}
                      error={satinDullErr.length > 0 ? true : false}
                      helperText={satinDullErr}
                      onChange={(e) => handleChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </Grid>
                )}

                 {orderType.value !== 5 && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span className="font-700">Dull Texture Remark</span>
                    <TextField
                      placeholder="Enter dull texture remark"
                      // label="Dull Texture Remark"
                      name="dullTexureRemark"
                      value={dullTexureRemark}
                      onChange={(e) => handleChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </Grid>
                )}

                {orderType.value !== 5 && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span className="font-700">Enamel %</span>
                    <TextField
                      placeholder="Enter enamel %"
                      // label="Enamel %"
                      name="enamel"
                      value={enamel}
                      error={enamelErr.length > 0 ? true : false}
                      helperText={enamelErr}
                      onChange={(e) => handleChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </Grid>
                )}

                  {orderType.value !== 5 && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span className="font-700">Enamel Remark</span>
                    <TextField
                      placeholder="Enter enamel remark"
                      // label="Enamel Remark"
                      name="enamelRemark"
                      value={enamelRemark}
                      onChange={(e) => handleChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </Grid>
                )}

               {orderType.value !== 5 && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span className="font-700">Additional Color Stone %</span>
                    <TextField
                      placeholder="Enter additional color stone % "
                      // label="Additional Color Stone %"
                      name="additionStoneColor"
                      value={additionStoneColor}
                      error={additionStoneColorErr.length > 0 ? true : false}
                      helperText={additionStoneColorErr}
                      onChange={(e) => handleChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </Grid>
                )}

                {orderType.value !== 5 && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span className="font-700">Additional Color Remark</span>
                    <TextField
                      placeholder="Enter additional color remark"
                      // label="Additional Color Remark"
                      name="additionalColorRemark"
                      value={additionalColorRemark}
                      onChange={(e) => handleChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </Grid>
                )}

                {orderType.value !== 5 && (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span className="font-700">Final Order Remark</span>
                    <TextField
                      placeholder="Enter final order remark"
                      // className="mt-16"
                      // label="Final Order Remark"
                      name="finalOrderRemark"
                      value={finalOrderRemark}
                      onChange={(e) => handleChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </Grid>
                )}

                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span className="font-700"> Screw Type </span>
                    <Select
                      styles={selectStyles}
                      options={screwTypeArr.map((group) => ({
                        value: group.id,
                        label: group.label,
                      }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={screwType}
                      onChange={handleChangeScrew}
                    />
                    <span className={classes.errorMessage}>
                      {screwTypeErr.length > 0 ? screwTypeErr : ""}
                    </span>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <span className="font-700"> Karat </span>
                    <Select
                      styles={selectStyles}
                      options={karatArr.map((group) => ({
                        value: group.value,
                        label: group.value,
                      }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={karatMain}
                      onChange={handleChangeKarat}
                      isDisabled={apiData.length > 0 ? true : false}
                    />
                    <span className={classes.errorMessage}>
                      {karatMainErr.length > 0 ? karatMainErr : ""}
                    </span>
                  </Grid>
                  {orderType.value === 5 && ( 
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <TextField
                      label="Delivery Due Date"
                      type="date"
                      className="mt-20"
                      name="deliveryDueDate"
                      value={deliveryDueDate}
                      error={dateErr.length > 0 ? true : false}
                      helperText={dateErr}
                      onChange={(e) => {
                        // const selectedDate = e.target.value;
                        // if (isDateValid(selec0tedDate)) {
                        handleChangeDueDate(e);
                        // setDeliveryDueDate(selectedDate);
                        // } else {
                        // console.log("else");
                        // }
                      }}
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: moment().add(10, "days").format("YYYY-MM-DD"),
                        max: moment().format("9999-12-31"),
                      }}
                    />
                  </Grid>
                  )}

          {orderType.value === 5 && (
            <Grid item xs={12} sm={6} md={4} lg={3}>
                  <span className="font-700"> Subject </span>
                  <TextField
                    placeholder="Enter subject"
                    name="Subject"
                    value={subject}
                    onChange={(e) => handleChange(e)}
                    variant="outlined"
                    fullWidth
                  />
                   <span className={classes.errorMessage}>
                      {subjectErr.length > 0 ? subjectErr : ""}
                    </span>
                </Grid>
                )}

            {orderType.value === 5 && (
            <Grid item xs={12} sm={6} md={4} lg={3}>
                  <span className="font-700"> Remarks </span>
                  <TextField
                    placeholder="Enter your remarks"
                    name="Remarks"
                    value={remarks}
                    onChange={(e) => handleChange(e)}
                    variant="outlined"
                    fullWidth
                    required
                  />
                </Grid>
                )}

                {orderType.value === 3 && (
                  <>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                  <span className="font-700"> Customer Name </span>
                      <TextField
                        label="Customer Name"
                        name="CustomerName"
                        value={customername}
                        onChange={(e) => handleChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                  <span className="font-700"> SalesMan </span>
                      <TextField
                        label="Sales Man"
                        name="SalesMan"
                        value={salesman}
                        onChange={(e) => handleChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                  </>
                )}

              <Grid item xs={12} sm={6} md={4} lg={3}>
                  <span className="font-700"> Admin Notes </span>
                  <TextField
                    // className="mt-16"
                    placeholder="Admin Notes"
                    name="AdminNotes"
                    value={adminnotes}
                    onChange={(e) => handleChange(e)}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

            </Grid>

            {orderType.value === 5 &&
                customerOrderFormValues.map((element, index) => (
                  <div className="form-inline mt-0" key={`Cont_${index}`}>
                    <Grid
                      container
                      spacing={2}
                      style={{
                        rowGap: "10px",
                        marginBlock: "10px",
                        border: "1px solid #ececec",
                        paddingBottom: "6px",
                      }}
                    >
                      <Grid item xs={4}>
                       <span className="font-700"> Reference No</span>
                        <TextField
                          // className="mt-20"
                          placeholder="Reference No"
                          name="Referenceno"
                          value={element.Referenceno || ""}
                          error={
                            element.errors !== undefined
                              ? element.errors.Referenceno
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.Referenceno
                              : ""
                          }
                          onChange={(e) => handleContactChange(index, e)}
                          variant="outlined"
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <TextField
                          className="mt-20 uploadDoc"
                          label="Upload image"
                          type="file"
                          name="file"
                          inputProps={{
                            multiple: true,
                            disabled: element.file.length > 1,
                            accept: ".png, .jpg, .jpeg",
                          }}
                          ref={hiddenFileInput}
                          onChange={(event) => {
                            setImages(event, index);
                          }}
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <span className="font-700"> Unit </span>
                        <Select
                          styles={selectStyles}
                          label="unit"
                          name="unit"
                          value={element.unit || ""}
                          options={unitArr.map((group) => ({
                            value: group.value,
                            label: group.value,
                          }))}
                          filterOption={createFilter({ ignoreAccents: false })}
                          error={
                            element.errors !== undefined
                              ? element.errors.unit
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.unit
                              : ""
                          }
                          onChange={(e) => handleDesignsInputChange(e, index)}
                          // required
                          variant="outlined"
                          fullWidth
                        />
                        <span className={classes.errorMessage}>
                          {element.errors !== undefined || null
                            ? element.errors.unit
                            : ""}
                        </span>
                      </Grid>

                      <Grid item xs={4}>
                      <span className="font-700"> Quantity </span>
                        <TextField
                          // className="mt-20"
                          placeholder="Quantity"
                          name="Quantity"
                          value={element.Quantity || ""}
                          error={
                            element.errors !== undefined
                              ? element.errors.Quantity
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.Quantity
                              : ""
                          }
                          onChange={(e) => handleContactChange(index, e)}
                          variant="outlined"
                          fullWidth
                        />
                      </Grid>

                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Grid
                          container
                          spacing={2}
                          style={{ alignItems: "flex-end" }}
                        >
                          <Grid item xs={6}>
                            <span className="font-700"> Weight </span>
                            <TextField
                              placeholder="From"
                              name="FromWeight"
                              // className="errorposition"
                              value={element.FromWeight || ""}
                              error={
                                element.errors !== undefined
                                  ? element.errors.FromWeight
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.FromWeight
                                  : ""
                              }
                              onChange={(e) => handleContactChange(index, e)}
                              required
                              fullWidth
                              variant="outlined"
                            />
                          </Grid>

                          <Grid item xs={12} sm={6} md={4} lg={3}>
                            <TextField
                              placeholder="To"
                              name="ToWeight"
                              // className="errorposition"
                              value={element.ToWeight || ""}
                              error={
                                element.errors !== undefined
                                  ? element.errors.ToWeight
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                element.errors !== undefined
                                  ? element.errors.ToWeight
                                  : ""
                              }
                              onChange={(e) => handleContactChange(index, e)}
                              required
                              fullWidth
                              variant="outlined"
                            />
                          </Grid>

                        </Grid>
                      </Grid>
                      {element.file.map((row, i) => {
                        return (
                          <Grid item key={i}>
                            <div
                              style={{
                                padding: 10,
                                border: "1px dashed black",
                                borderRadius: "25px",
                                cursor: "pointer",
                                position: "relative",
                                width: "250px",
                                height: "150px",
                              }}
                            >
                              <Icon
                                onClick={() => handleRemoveRow(i, index)}
                                className={classes.closeIcon}
                              >
                                close
                              </Icon>
                              <img
                                src={row.image_file}
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "100%",
                                  marginInline: "auto",
                                  display: "block",
                                }}
                                alt="img"
                                onClick={() => {
                                  // setModalView(3);
                                  // setImageUrl(row.image_file);
                                  // setImage(row.upload_file_name);
                                }}
                              />
                            </div>
                          </Grid>
                        );
                      })}

                      {customerOrderFormValues.length !== 1 && (
                        <Grid item xs={3}>
                          <IconButton
                            className="mt-20"
                            style={{ padding: "0" }}
                            onClick={() => removeContactFormFields(index)}
                          >
                            <Icon 
                              className={clsx(classes.errorMessage, "mr-8")}
                              style={{fontSize:"30px", paddingTop:"10px"}}
                            >
                              delete
                            </Icon>
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                  </div>
                ))}
            </div>

            {orderType.value === 5 &&
              (customerOrderFormValues.length < 5 ? (
                <Grid
                  item
                  xs={12}
                  style={{ paddingInline: 16, marginBottom: 16, marginTop: 16 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    className="w-224 mx-auto mt-32"
                    type="button"
                    onClick={() => addCustomerOrderFormFields()}
                  >
                    Add More
                  </Button>
                </Grid>
              ) : (
                ""
              ))}
       
             {orderType.value !== 5 && (
              <Paper
                className={clsx(classes.tabroot, "table-responsive", "mt-16")}
              >
                <Grid item xs={12} style={{ padding: 5, textAlign: "right"}}>
                  <>
                    <Button
                      variant="contained"
                      className={classes.button}
                      size="small"
                      onClick={() => handleAddDesign(false)}
                      hidden={orderType.value === 3 ? true : false}
                    >
                      Add New Design
                    </Button>
                    <Button
                      variant="contained"
                      className={classes.button}
                      size="small"
                      onClick={() => handleAddDesign(true)}
                    >
                      Upload New Design
                    </Button>
                  </>
                </Grid>
                <div className="table-responsive new-add_stock_group_tbel custom_stocklist_dv" style={{overflowY: "auto", paddingInline: "10px"}}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          align="left"
                          style={{ width: "5%" }}
                        ></TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Design No
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Karat
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Pieces
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Gross Weight
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Net Weight
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Remarks
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {addFlag && (
                        <TableRow>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                            style={{ width: "5%" }}
                          ></TableCell>
                          <TableCell
                            align="left"
                            className={clsx(
                              classes.tableRowPad,
                              "packing-slip-input"
                            )}
                            style={{ overflowWrap: "anywhere" }}
                          >
                            <Autocomplete
                              id="free-solo-demo"
                              freeSolo
                              // className="mt-16"
                              disableClearable
                              onChange={(event, newValue) => {
                                handleDesignNoSelect(newValue);
                              }}
                              onInputChange={(event, newInputValue) => {
                                if (event !== null) {
                                  if (event.type === "change")
                                    setDesignSearch(newInputValue);
                                } else {
                                  setDesignSearch("");
                                }
                              }}
                              value={updtRecord.variant_no}
                              options={designApiData.map(
                                (option) => option.variant_number
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  style={{ padding: 0 }}
                                  label="Design Number"
                                />
                              )}
                            />
                            <span className={classes.errorMessage}>
                              {updtRecord.errors !== undefined
                                ? updtRecord.errors.variant_no
                                : ""}
                            </span>
                          </TableCell>

                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            <TextField
                              className=""
                              label="Karat"
                              name="karat"
                              value={updtRecord.karat}
                              variant="outlined"
                              required
                              disabled
                              fullWidth
                            />
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                            style={{ overflowWrap: "anywhere" }}
                          >
                            <TextField
                              className=""
                              label="Pieces"
                              name="pieces"
                              value={updtRecord.pieces}
                              error={
                                updtRecord.errors !== undefined
                                  ? updtRecord.errors.pieces
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                updtRecord.errors !== undefined
                                  ? updtRecord.errors.pieces
                                  : ""
                              }
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                            />
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            <TextField
                              className=""
                              label="Gross Weight"
                              name="gross_weight"
                              value={updtRecord.gross_weight}
                              error={
                                updtRecord.errors !== undefined
                                  ? updtRecord.errors.gross_weight
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                updtRecord.errors !== undefined
                                  ? updtRecord.errors.gross_weight
                                  : ""
                              }
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                              disabled
                            />
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            <TextField
                              className=""
                              label="Net Weight"
                              name="net_weight"
                              value={updtRecord.net_weight}
                              error={
                                updtRecord.errors !== undefined
                                  ? updtRecord.errors.net_weight
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                updtRecord.errors !== undefined
                                  ? updtRecord.errors.net_weight
                                  : ""
                              }
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                              disabled
                            />
                          </TableCell>

                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                            style={{ overflowWrap: "anywhere" }}
                          >
                            {/* remarks */}

                            <TextField
                              className=""
                              label="Remarks"
                              name="comment"
                              value={updtRecord.comment}
                              error={
                                updtRecord.errors !== undefined
                                  ? updtRecord.errors.comment
                                    ? true
                                    : false
                                  : false
                              }
                              helperText={
                                updtRecord.errors !== undefined
                                  ? updtRecord.errors.comment
                                  : ""
                              }
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              required
                              fullWidth
                            />
                          </TableCell>

                          <TableCell className={classes.tableRowPad}>
                            <Button
                              className={classes.button}
                              color="primary"
                              // className="w-224"
                              aria-label="Register"
                              //   disabled={!isFormValid()}
                              // type="submit"
                              onClick={(e) => cancelAdd()}
                            >
                              Cancel
                            </Button>
                            <Button
                              className={classes.button}
                              color="primary"
                              // className="ml-2"
                              aria-label="Register"
                              onClick={(e) => addRecord()}
                            >
                              Save
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                      {apiData.map((row) => (
                        <Row
                          key={row.variant_no}
                          row={row}
                          classes={classes}
                          handleDesignNoSelect={handleDesignNoSelect}
                          setDesignSearch={setDesignSearch}
                          updtRecord={updtRecord}
                          designApiData={designApiData}
                          handleInputChange={handleInputChange}
                          deleteHandler={deleteHandler}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Paper>
              )}
              
              <Grid style={{textAlign: "right"}}>
                <Button
                  id="btn-save"
                  className={classes.button}
                  // variant="contained"
                  color="primary"
                  size="large"
                  aria-label="Register"
                  style={{ marginBlock: "10px", marginInline: 0 }}
                  onClick={(e) => addFinalData()}
                >
                  Save
                </Button>
              </Grid>
            </div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" className="popup-delete">
                {"Alert!!!"}
                <IconButton
                  style={{
                    position: "absolute",
                    marginTop: "-5px",
                    right: "15px",
                  }}
                  onClick={handleClose}
                >
                  <img
                    src={Icones.cross}
                    className="delete-dialog-box-image-size"
                    alt=""
                  />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this record?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  className="delete-dialog-box-cancle-button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteData}
                  className="delete-dialog-box-delete-button"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

function Row(props) {
  const { row, classes } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }} key={row.id}>
        <TableCell style={{ width: "5%" }}>
          {!row.isEdit && row.design?.MainVariantCombination?.length > 0 && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </IconButton>
          )}
        </TableCell>

        <>
          <TableCell
            align="left"
            className={classes.tableRowPad}
            style={{ overflowWrap: "anywhere" }}
          >
            {/* Design No */}
            {row.variant_no}
          </TableCell>
          <TableCell align="left" className={classes.tableRowPad}>
            {/* karat */}
            {row.karat}
          </TableCell>
          <TableCell
            align="left"
            className={classes.tableRowPad}
            style={{ overflowWrap: "anywhere" }}
          >
            {/* pieces */}
            {row.pieces}
          </TableCell>
          <TableCell align="left" className={classes.tableRowPad}>
            {/* Gross */}
            {row.gross_weight}
          </TableCell>
          <TableCell align="left" className={classes.tableRowPad}>
            {/* Net */}
            {row.net_weight}
          </TableCell>

          <TableCell
            align="left"
            className={classes.tableRowPad}
            style={{ overflowWrap: "anywhere" }}
          >
            {/* remarks */}
            {row.comment}
          </TableCell>
          <TableCell>
            <IconButton
              style={{ padding: "0" }}
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                props.deleteHandler(row);
              }}
            >
              <Icon className="mr-8 delete-icone">
                <img src={Icones.delete_red} alt="" />
              </Icon>
            </IconButton>
          </TableCell>
        </>
      </TableRow>
    </React.Fragment>
  );
}

export default AddOrder;

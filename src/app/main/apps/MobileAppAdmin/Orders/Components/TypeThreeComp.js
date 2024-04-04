import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField, Icon, IconButton, Box, Collapse } from "@material-ui/core";
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
import UploadFile from "./UploadFile";
import Icones from "assets/fornt-icons/Mainicons";
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
    // backgroundColor: "cornflowerblue",
    backgroundColor: "#415BD4",
    color: "white",
  },
  normalSelect: {
    // marginTop: 8,
    padding: 8,
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
}));

const TypeThreeComp = (props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [selectedIdForEdt, setSelectedIdForEdt] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [isView, setIsView] = useState(false);

  const [orderData, setOrderData] = useState("");

  const [retailer, setRetailer] = useState("");
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

  const [addFlag, setAddFlag] = useState(false);
  const [editFlag, setEditFlag] = useState(false);

  const [open, setOpen] = useState(false);

  const [showAddBtn, setShowAddBtn] = useState(true);
  const [adminnotes, setAdminnotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [karatMain, setKaratMain] = useState("");

  const [customername, setcustomername] = useState("");
  const [salesman, setsalesman] = useState("");

  const [orderType, setOrderType] = useState("");
  const screwTypeArr = [
    { id: 1, label: "Bombay Post with Screw" },
    { id: 2, label: "Bombay Post without Screw" },
    { id: 3, label: "South Screw" },
    { id: 4, label: "Push Butterfly Screw" },
  ];
  const [updtRecord, setUpdtRecord] = useState({
    designNo: "",
    karat: "",
    pcs: "",
    grossWt: "",
    netWt: "",
    remarks: "",
    imageUrl: "",
    errors: {
      designNo: null,
      karat: null,
      pcs: null,
      grossWt: null,
      netWt: null,
      remarks: null,
      imageUrl: null,
    },
  });

  const [designApiData, setDesignApiData] = useState([]);

  const [designSearch, setDesignSearch] = useState("");

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  const [firstTime, setFirstTime] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (designSearch) {
        getDesignData(designSearch);
      } else {
        setDesignApiData([]);
      }
    }, 800);
    return () => {
      console.log("clearTimeout");

      clearTimeout(timeout);
    };
    //eslint-disable-next-line
  }, [designSearch]);

  function getDesignData(designNo) {
    axios
      .get(Config.getCommonUrl() + `api/design/search/variant/${designNo}`)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          console.log(response.data.data);

          if (response.data.data.length > 0) {
            setDesignApiData(response.data.data);
          } else {
            setDesignApiData([]);
            dispatch(
              Actions.showMessage({
                message: "Please Insert Proper Job No",
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
    setIsView(props.isView);
    setIsEdit(props.isEdit);
    if (props.isEdit) {
      getDistributerList();
    }
    if (props.apiData?.id) setApiData(props.apiData.ExhibitionOrderDesigns);
    const arrData = props.apiData;
    if (!Array.isArray(arrData)) {
      setOrderData(arrData);
      setRetailer(arrData.retailer?.company_name);
      setOrderType(arrData.order_type);
      if (arrData.distributor !== null) {
        setDistributer({
          value: arrData.distributor.client.id,
          label: arrData.distributor.client.name,
        });
      }
      setRhodiumOnStone(arrData.rhodium_on_stone_percentage);
      setRhodiumOnPlainPart(arrData.rhodium_on_plain_part_percentage);
      setRhodiumRemark(arrData.rhodium_remarks);
      setSundblastingDull(arrData.sandblasting_dull_percentage);
      setSatinDull(arrData.satin_dull_percentage);
      setDullTexureRemark(arrData.dull_texture_remark);
      setEnamel(arrData.enamel_percentage);
      setEnamelRemark(arrData.enamel_remark);
      setAdditionalStoneColor(arrData.additional_color_stone);
      setAdditionalColorRemark(arrData.additional_color_remark);
      setFinalOrderRemark(arrData.final_order_remark);
      {  if (arrData.order_type ===3) {
        setcustomername(arrData.ipad_customer_name)
        setsalesman(arrData.ipad_salesmen_name)}
      }
      setKaratMain(arrData.karat);
      setAdminnotes(arrData.admin_notes)
      updtRecord.karat = arrData.karat;
      setUpdtRecord(updtRecord);
      screwTypeArr.map((item) => {
        if (item.label === arrData.screw_type) {
          setScrewType({
            value: item.id,
            label: item.label,
          });
        }
      });
    }
  }, [props]);

  function getDistributerList() {
    axios
      .get(Config.getCommonUrl() + `api/client/all/client`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log(response.data.data);
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

  function editHandler(id) {
    let index = apiData.findIndex((item) => item.id === id);
    if (index > -1) {
      setFirstTime(true);

      setUpdtRecord({
        designNo: apiData[index].design.variant_number,
        design_id: apiData[index].design_id,
        karat: apiData[index].karat,
        pcs: apiData[index].pieces,
        grossWt: apiData[index].gross_weight,
        netWt: apiData[index].net_weight,
        remarks: apiData[index].comment,
        imageUrl:
          apiData[index].design.image_files.length > 0
            ? apiData[index].design.image_files[0].image_file
            : Config.getjvmLogo(),
        errors: {
          designNo: null,
          karat: null,
          pcs: null,
          grossWt: null,
          netWt: null,
          remarks: null,
          imageUrl: null,
        },
      });
      // setDesignSearch(apiData[index].design.variant_number)

      let tempApi = [...apiData];
      tempApi[index].isEdit = true;
      setSelectedIdForEdt(id);
      setApiData(tempApi);
      setShowAddBtn(false);
      setEditFlag(true);
    }
  }

  const handleChangeScrew = (value) => {
    setScrewType(value);
    setScrewTypeErr("");
  };

  const handleChangeDistributer = (value) => {
    setDistributer(value);
    setDistributerErr("");
  };

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function callDeleteApi() {
    const body = {
      id: selectedIdForDelete,
      order_id: orderData.id,
    };

    axios
      .post(Config.getCommonUrl() + "api/order/remove-order-design/", body)
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          // selectedIdForDelete
          props.callApi(orderData.id);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success"}));
          setSelectedIdForDelete("");
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
        }
      })
      .catch((error) => {
        setOpen(false);
        handleError(error, dispatch, {
          api: "api/order/remove-order-design/",
          body: body,
        });
      });
  }

  const classes = useStyles();

  function cancelAdd() {
    setAddFlag(false);
    setEditFlag(false);
    setFirstTime(false);
    setUpdtRecord({
      designNo: "",
      karat: "",
      pcs: "",
      grossWt: "",
      netWt: "",
      remarks: "",
      imageUrl: "",
      errors: {
        designNo: null,
        karat: null,
        pcs: null,
        grossWt: null,
        netWt: null,
        remarks: null,
        imageUrl: null,
      },
    });
    setDesignApiData([]);
    setShowAddBtn(true);
    setDesignSearch("");
  }

  function validateIsAdded(temp) {
    const tempRecord = { ...updtRecord };
    const mainArr = temp ? temp : [...apiData];
    let result = true;

    mainArr.map((item) => {
      if (
        item.design.variant_number === tempRecord.designNo &&
        item.karat == tempRecord.karat
      ) {
        result = false;
        dispatch(Actions.showMessage({ message: "This Entry already exist" }));
      }
    });
    return result;
  }

  function addRecord() {
    //validate , call add api then do this
    if (validateIsAdded() && validateRecord()) {
      AddNewOrderApi();
    }
  }

  function AddNewOrderApi() {
    const body = {
      order_id: orderData.id,
      design_id: designApiData[0].id,
      variant_no: updtRecord.designNo,
      karat: updtRecord.karat,
      pieces: updtRecord.pcs,
      comment: updtRecord.remarks,
    };

    axios
      .post(Config.getCommonUrl() + "api/order/add-order-design-info", body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          setAddFlag(false);
          setEditFlag(false);
          setShowAddBtn(true);

          setUpdtRecord({
            designNo: "",
            karat: "",
            pcs: "",
            grossWt: "",
            netWt: "",
            remarks: "",
            imageUrl: "",
            errors: {
              designNo: null,
              karat: null,
              pcs: null,
              grossWt: null,
              netWt: null,
              remarks: null,
              imageUrl: null,
            },
          });
          setDesignApiData([]);
          setDesignSearch("");

          props.callApi(orderData.id);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success"}));
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/order/add-order-design-info",
          body: body,
        });
      });
  }

  useEffect(() => {
    const timeouttwo = setTimeout(() => {
      let tempRecord = { ...updtRecord };

      let pass = true;
      if (tempRecord.designNo === "") {
        pass = false;
      }

      if (tempRecord.karat === "") {
        pass = false;
      }
      let percentRegex = /^[0-9]{1,11}(?:\.[0-9]{1,3})?$/;

      if (
        tempRecord.pcs === "" ||
        percentRegex.test(tempRecord.pcs) === false
      ) {
        pass = false;
      }

      if (editFlag && pass) {
        if (firstTime === false) {
          getWeightsForDesign();
        } else {
          setFirstTime(false);
        }
      } else if (addFlag && pass) {
        getWeightsForDesign();
      }
    }, 800);
    return () => {
      clearTimeout(timeouttwo);
    };
    //eslint-disable-next-line
  }, [updtRecord.designNo, updtRecord.karat, updtRecord.pcs]);

  function getWeightsForDesign() {
    setLoading(true);
    axios
      .post(Config.getCommonUrl() + "api/order/designWeightCalculation", {
        variant_number: updtRecord.designNo,
        karat: Number(updtRecord.karat),
        pcs: updtRecord.pcs,
      })
      .then(function (response) {
        console.log(response);

        setLoading(false);
        if (response.data.success === true) {
          let tempRecord = { ...updtRecord };
          tempRecord.grossWt = response.data.data.total_gross_weight;
          tempRecord.netWt = response.data.data.total_net_weight;
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
            variant_number: updtRecord.designNo,
            karat: Number(updtRecord.karat),
            pcs: updtRecord.pcs,
          },
        });
      });
  }

  function updateRecord(id) {
    let temp = apiData.filter((x) => x.id !== selectedIdForEdt);

    if (validateIsAdded(temp) && validateRecord()) {
      updateOrderApi(id);
    }
  }

  function cancelUpdtRecord(id) {
    let index = apiData.findIndex((item) => item.id === id);
    if (index > -1) {
      let tempApi = [...apiData];
      tempApi[index].isEdit = false;
      setEditFlag(false);
      setApiData(tempApi);
      setSelectedIdForEdt("");
      setUpdtRecord({
        designNo: "",
        karat: "",
        pcs: "",
        grossWt: "",
        netWt: "",
        remarks: "",
        imageUrl: "",
        errors: {
          designNo: null,
          karat: null,
          pcs: null,
          grossWt: null,
          netWt: null,
          remarks: null,
          imageUrl: null,
        },
      });
      setDesignApiData([]);
      setDesignSearch("");
      setShowAddBtn(true);
    }
  }

  const handleModalClose = (callApi) => {
    setOpenModal(false);
    if (callApi) {
      props.callApi(orderData.id);
    }
  };

  function updateOrderApi(id) {
    //remove selected and add new
    const body = {
      order_type: orderType,
      id: selectedIdForEdt,
      design_id: updtRecord.design_id,
      variant_no: updtRecord.designNo,
      karat: updtRecord.karat,
      order_id: orderData.id,
      pieces: updtRecord.pcs,
      comment: updtRecord.remarks,
    };
    axios
      .put(Config.getCommonUrl() + "api/order/change-order-design-info", body)
      .then(function (response) {
        if (response.data.success === true) {
          let index = apiData.findIndex((item) => item.id === id);

          if (index > -1) {
            let tempApi = [...apiData];
            tempApi[index].isEdit = false;
            setSelectedIdForEdt("");
            setEditFlag(false);
            setApiData(tempApi);

            setUpdtRecord({
              designNo: "",
              karat: "",
              pcs: "",
              grossWt: "",
              netWt: "",
              remarks: "",
              imageUrl: "",
              errors: {
                designNo: null,
                karat: null,
                pcs: null,
                grossWt: null,
                netWt: null,
                remarks: null,
                imageUrl: null,
              },
            });
            setDesignApiData([]);
            setDesignSearch("");
            setShowAddBtn(true);
          }

          props.callApi(orderData.id);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success"}));
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/order/change-order-design-info",
          body: body,
        });
      });
  }

  function validateRecord() {
    let tempRecord = { ...updtRecord };
    // tempRecord[name] = value;
    // tempRecord.errors[name] = null;
    let pass = true;
    if (tempRecord.designNo === "") {
      // setDesignNoErr("Please Select Design No")
      tempRecord.errors.designNo = "Please Select Proper Design No";
      pass = false;
    }

    if (tempRecord.karat === "") {
      tempRecord.errors.karat = "Please Select Karat";
      pass = false;
    }
    let percentRegex = /^[0-9]{1,6}$/;

    if (
      tempRecord.pcs === "" ||
      percentRegex.test(tempRecord.pcs) === false ||
      tempRecord.pcs == 0
    ) {
      tempRecord.errors.pcs = "Please Enter Valid Pieces";
      pass = false;
    }

    if (tempRecord.grossWt === "") {
      tempRecord.errors.grossWt = "Please Select Proper Data";
      pass = false;
    }

    if (tempRecord.netWt === "") {
      tempRecord.errors.netWt = "Please Select Proper Data";
      pass = false;
    }

    setUpdtRecord(tempRecord);
    return pass;
  }

  let handleDesignNoSelect = (designNo) => {
    let filteredArray = designApiData.filter(
      (item) => item.variant_number === designNo
    );

    if (filteredArray.length > 0) {
      setDesignApiData(filteredArray);

      // setDesignNoErr("");
      let tempRecord = { ...updtRecord };
      tempRecord.designNo = designNo;
      tempRecord.design_id = filteredArray[0].id;
      tempRecord.errors.designNo = null;
      setUpdtRecord(tempRecord);

      // setUpdtRecord((prevState) => ({
      //     ...prevState, [designNo]: designNo
      // })
      // );
    } else {
      let tempRecord = { ...updtRecord };
      tempRecord.designNo = "";
      tempRecord.errors.designNo = "Please Select Proper Design No";
      setUpdtRecord(tempRecord);
    }
  };

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    let tempRecord = { ...updtRecord };
    tempRecord[name] = value;
    tempRecord.errors[name] = null;

    setUpdtRecord(tempRecord);
  };

  function handleKaratChange(e) {
    let value = e.target.value;
    let tempRecord = { ...updtRecord };
    tempRecord.karat = value;
    tempRecord.errors.karat = null;

    setUpdtRecord(tempRecord);
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
     else if (name === "SalesMan") {
        setsalesman(value);
      }
      else if (name === "CustomerName") {
        setcustomername(value);
      } else if (name === "AdminNotes") {
        setAdminnotes(value)
      }

    
  };

  function validateDistribute() {
    if (distributer === "") {
      setDistributerErr("Select Distributer");
      return false;
    }
    return true;
  }
  let regex = /^[0-9]$|^[1-9][0-9]$|^(100)$/; // no decimal number 0-100
  // let regex =  /^([0-9]{1,2}){1}(\.[0-9]{1,2})?$/  // with decimal 0-100
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

  function validateSunblastingDull() {
    if (SandblastingDull === "" || regex.test(SandblastingDull) === false) {
      setSundblastingDullErr("Enter valid rate");
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

  const handleUpdateData = (e) => {
    e.preventDefault();
    if (
      validateDistribute() &&
      validateOnStone() &&
      validatePlainPart() &&
      validateSunblastingDull() &&
      validateStainDull() &&
      validateEnamel() &&
      validateStoneColor() &&
      validateScrewType()
    )
      callApiForUpdateData();
  };

  function callApiForUpdateData() {
    const body = {
      client_id: distributer.value,
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
      final_order_remark: finalOrderRemark,
      screw_type: screwType.value,
      ... (orderType === 3 ? {
        ipad_salesmen_name : salesman,
        ipad_customer_name : customername, } : ""),
        admin_notes : adminnotes,
    };
    axios
      .put(
        Config.getCommonUrl() + `api/order/details/update/${orderData.id}`,
        body
      )
      .then((response) => {
        if (response.data.success) {
          props.callApi(orderData.id);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success"}));
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/order/details/update/${orderData.id}`,
          body,
        });
      });
  }

  return (
    <>
      {openModal && (
        <UploadFile handleModalClose={handleModalClose} id={orderData.id} />
      )}
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <p> Retailer :</p>

          <TextField
            name="retailer"
            value={retailer}
            variant="outlined"
            required
            disabled
            fullWidth
          />
        </Grid>

        <Grid item xs={3}>
          <span className="font-700"> Distributor : </span>
          <Select
            styles={{ selectStyles }}
            options={distributerArr.map((group) => ({
              value: group.id,
              label: group.name,
            }))}
            filterOption={createFilter({ ignoreAccents: false })}
            value={distributer}
            onChange={handleChangeDistributer}
            isDisabled={isView}
          />
          <span style={{ color: "red" }}>
            {distributerErr.length > 0 ? distributerErr : ""}
          </span>
        </Grid>

        <Grid item xs={3}>
          <p> Rhodium on stone %</p>
          <TextField
            // className="mt-16"
            placeholder="Rhodium on stone %"
            name="rhodiumOnStone"
            value={rhodiumOnStone}
            error={rhodiumOnStoneErr.length > 0 ? true : false}
            helperText={rhodiumOnStoneErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={3}>
          <p>Rhodium on Plain part %</p>
          <TextField
            placeholder="Rhodium on Plain part %"
            name="rhodiumOnPlainPart"
            value={rhodiumOnPlainPart}
            error={rhodiumOnPlainPartErr.length > 0 ? true : false}
            helperText={rhodiumOnPlainPartErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            fullWidth
            disabled={isView}
          />
        </Grid>

        <Grid item xs={3}>
          <p>Rhodium Remarks</p>
          <TextField
            placeholder="Rhodium Remarks"
            name="rhodiumRemark"
            value={rhodiumRemark}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={3}>
          <p>Sandblasting dull %</p>
          <TextField
            placeholder="Sandblasting dull %"
            name="SandblastingDull"
            value={SandblastingDull}
            error={SandblastingDullErr.length > 0 ? true : false}
            helperText={SandblastingDullErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={3}>
          <p>Satin dull %</p>
          <TextField
            placeholder="Satin dull %"
            name="satinDull"
            value={satinDull}
            error={satinDullErr.length > 0 ? true : false}
            helperText={satinDullErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={3}>
          <p>Dull Texture Remark</p>
          <TextField
            placeholder="Dull Texture Remark"
            name="dullTexureRemark"
            value={dullTexureRemark}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={3}>
          <p>Enamel %</p>
          <TextField
            placeholder="Enamel %"
            name="enamel"
            value={enamel}
            error={enamelErr.length > 0 ? true : false}
            helperText={enamelErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={3}>
          <p>Enamel Remark</p>
          <TextField
            placeholder="Enamel Remark"
            name="enamelRemark"
            value={enamelRemark}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={3}>
          <p>Additional Color Stone %</p>
          <TextField
            placeholder="Additional Color Stone %"
            name="additionStoneColor"
            value={additionStoneColor}
            error={additionStoneColorErr.length > 0 ? true : false}
            helperText={additionStoneColorErr}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={3}>
          <p>Additional Color Remark</p>
          <TextField
            placeholder="Additional Color Remark"
            name="additionalColorRemark"
            value={additionalColorRemark}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={3}>
          <p>Final Order Remark</p>
          <TextField
            // className="mt-16"
            placeholder="Final Order Remark"
            name="finalOrderRemark"
            value={finalOrderRemark}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            disabled={isView}
            fullWidth
          />
        </Grid>

        <Grid item xs={3}>
          <span className="font-700"> Screw Type : </span>
          <Select
            styles={selectStyles}
            options={screwTypeArr.map((group) => ({
              value: group.id,
              label: group.label,
            }))}
            filterOption={createFilter({ ignoreAccents: false })}
            value={screwType}
            onChange={handleChangeScrew}
            isDisabled={isView}
          />
          <span style={{ color: "red" }}>
            {screwTypeErr.length > 0 ? screwTypeErr : ""}
          </span>
        </Grid>

        <Grid item xs={3}>
          <p>Karat</p>
          <TextField
            // className="mt-16"
            placeholder="Karat"
            name="karat"
            variant="outlined"
            value={karatMain}
            required
            disabled
            fullWidth
          />
        </Grid>
         
        {
            orderType === 3 && 
            <> 
            <Grid item xs={4} >
            <TextField
      className="mt-16"
      label="Customer Name"
            name="CustomerName"
            value={customername}
            onChange={(e) => handleChange(e)}
            variant="outlined"
            required
            fullWidth
          />
            </Grid>

           <Grid item xs={4} >
        <TextField
            className="mt-16"
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
        }

          <Grid item xs={4}>
            {/* <span className="font-700"> Admin Notes : </span> */}
            <TextField
              className="mt-16"
              label="Admin Notes"
              name="AdminNotes"
              disabled={isView}
              value={adminnotes}
              onChange={(e) => handleChange(e)}
              variant="outlined"
              fullWidth
            />
          </Grid>


      </Grid>
      <Button
        variant="contained"
        // color="primary"
        // aria-label="Register"
        hidden={!isEdit}
        onClick={handleUpdateData}
        style={{
          float: "right",
          margin: "0.5%",
          backgroundColor: "#415BD4",
          color: "#FFFFFF",
        }}
      >
        Update
      </Button>
      {loading && <Loader />}
      <Paper
        className={clsx(classes.tabroot, "table-responsive", "mt-16")}
        style={{ marginBottom: "10%" }}
      >
        <Grid item xs={12} style={{ padding: 5 }}>
          {showAddBtn && isEdit && (
            <>
              <Button
                variant="contained"
                className={classes.button}
                size="small"
                onClick={(event) => {
                  setAddFlag(true);
                  setEditFlag(true);
                  setShowAddBtn(false);
                }}
              >
                Add New Design
              </Button>
              <Button
                variant="contained"
                className={classes.button}
                size="small"
                onClick={() => setOpenModal(true)}
              >
                Upload New Design
              </Button>
            </>
          )}
        </Grid>
        <div className="table-responsive new-add_stock_group_tbel custom_stocklist_dv">
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
                  Image
                </TableCell>
                {isEdit && (
                  <TableCell className={classes.tableRowPad} align="left">
                    Actions
                  </TableCell>
                )}
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
                    className={clsx(classes.tableRowPad, "packing-slip-input")}
                    style={{ overflowWrap: "anywhere" }}
                  >
                    <Autocomplete
                      id="free-solo-demo"
                      freeSolo
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
                      value={updtRecord.designNo}
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
                    <span style={{ color: "red" }}>
                      {updtRecord.errors !== undefined
                        ? updtRecord.errors.designNo
                        : ""}
                    </span>
                  </TableCell>
                  {/* <TableCell align="left" className={classes.tableRowPad}>
                    <select
                      className={classes.normalSelect}
                      required
                      value={updtRecord.karat}
                      onChange={(e) => handleKaratChange(e)}
                     disabled
                    >
                      <option hidden value="">
                       {karatMain}
                      </option>
                      <option value="14">14 </option>
                      <option value="18">18 </option>
                      <option value="20">20 </option>
                      <option value="22">22 </option>
                    </select>
                    <span style={{ color: "red" }}>
                      {updtRecord.errors !== undefined
                        ? updtRecord.errors.karat
                        : ""}
                    </span>
                  </TableCell> */}
                  <TableCell align="left" className={classes.tableRowPad}>
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
                      name="pcs"
                      value={updtRecord.pcs}
                      error={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.pcs
                            ? true
                            : false
                          : false
                      }
                      helperText={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.pcs
                          : ""
                      }
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </TableCell>
                  <TableCell align="left" className={classes.tableRowPad}>
                    <TextField
                      className=""
                      label="Gross Weight"
                      name="grossWt"
                      value={updtRecord.grossWt}
                      error={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.grossWt
                            ? true
                            : false
                          : false
                      }
                      helperText={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.grossWt
                          : ""
                      }
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled
                    />
                  </TableCell>
                  <TableCell align="left" className={classes.tableRowPad}>
                    <TextField
                      className=""
                      label="Net Weight"
                      name="netWt"
                      value={updtRecord.netWt}
                      error={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.netWt
                            ? true
                            : false
                          : false
                      }
                      helperText={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.netWt
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
                      name="remarks"
                      value={updtRecord.remarks}
                      error={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.remarks
                            ? true
                            : false
                          : false
                      }
                      helperText={
                        updtRecord.errors !== undefined
                          ? updtRecord.errors.remarks
                          : ""
                      }
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </TableCell>
                  <TableCell align="left" className={classes.tableRowPad}>
                    {/* iamge */}
                    {/* <img src={row.design.image_files[0].image_file} height={50} width={50} /> */}
                  </TableCell>

                  <TableCell className={classes.tableRowPad}>
                    <Button
                      variant="contained"
                      // color="primary"
                      // className="w-224"
                      aria-label="Register"
                      //   disabled={!isFormValid()}
                      // type="submit"
                      style={{ backgroundColor: "#415BD4", color: "#FFFFFF" }}
                      onClick={(e) => cancelAdd()}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      // color="primary"
                      style={{ backgroundColor: "#415BD4", color: "#FFFFFF" }}
                      className="ml-2"
                      aria-label="Register"
                      //   disabled={!isFormValid()}
                      // type="submit"
                      onClick={(e) => addRecord()}
                    >
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
              )}
              {apiData.map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  classes={classes}
                  handleDesignNoSelect={handleDesignNoSelect}
                  setDesignSearch={setDesignSearch}
                  updtRecord={updtRecord}
                  designApiData={designApiData}
                  handleKaratChange={handleKaratChange}
                  handleInputChange={handleInputChange}
                  cancelUpdtRecord={cancelUpdtRecord}
                  updateRecord={updateRecord}
                  isEdit={isEdit}
                  editFlag={editFlag}
                  editHandler={editHandler}
                  deleteHandler={deleteHandler}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </Paper>
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
            color="primary"
            className="delete-dialog-box-cancle-button"
          >
            Cancel
          </Button>
          <Button
            onClick={callDeleteApi}
            color="primary"
            autoFocus
            className="delete-dialog-box-delete-button"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
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
        {row.isEdit ? (
          <>
            <TableCell
              align="left"
              className={clsx(classes.tableRowPad, "packing-slip-input")}
              style={{ overflowWrap: "anywhere" }}
            >
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                disableClearable
                onChange={(event, newValue) => {
                  props.handleDesignNoSelect(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  if (event !== null) {
                    if (event.type === "change")
                      props.setDesignSearch(newInputValue);
                  } else {
                    props.setDesignSearch("");
                  }
                }}
                value={props.updtRecord.designNo}
                options={props.designApiData.map(
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
              <span style={{ color: "red" }}>
                {props.updtRecord.errors !== undefined
                  ? props.updtRecord.errors.designNo
                  : ""}
              </span>
            </TableCell>
            {/* <TableCell align="left" className={classes.tableRowPad}>
             
              <select
                className={classes.normalSelect}
                required
                value={props.updtRecord.karat}
                onChange={(e) => props.handleKaratChange(e)}
              
              >
                <option hidden value="">
                  Select Karat
                </option>
                <option value="14">14 </option>
                <option value="18">18 </option>
                <option value="20">20 </option>
                <option value="22">22 </option>
              </select>
              <span style={{ color: "red" }}>
                {props.updtRecord.errors !== undefined
                  ? props.updtRecord.errors.karat
                  : ""}
              </span>
            </TableCell> */}
            <TableCell align="left" className={classes.tableRowPad}>
              <TextField
                className=""
                label="Karat"
                name="karat"
                value={props.updtRecord.karat}
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
              {/* pieces */}
              {/* {row.pieces} */}
              <TextField
                className=""
                label="Pieces"
                name="pcs"
                value={props.updtRecord.pcs}
                error={
                  props.updtRecord.errors !== undefined
                    ? props.updtRecord.errors.pcs
                      ? true
                      : false
                    : false
                }
                helperText={
                  props.updtRecord.errors !== undefined
                    ? props.updtRecord.errors.pcs
                    : ""
                }
                onChange={(e) => props.handleInputChange(e)}
                variant="outlined"
                required
                fullWidth
                // disabled={isView}
              />
            </TableCell>

            <TableCell align="left" className={classes.tableRowPad}>
              {/* Gross */}
              {/* {row.gross_weight} */}
              <TextField
                className=""
                label="Gross Weight"
                name="grossWt"
                value={props.updtRecord.grossWt}
                error={
                  props.updtRecord.errors !== undefined
                    ? props.updtRecord.errors.grossWt
                      ? true
                      : false
                    : false
                }
                helperText={
                  props.updtRecord.errors !== undefined
                    ? props.updtRecord.errors.grossWt
                    : ""
                }
                onChange={(e) => props.handleInputChange(e)}
                variant="outlined"
                required
                fullWidth
                disabled
              />
            </TableCell>
            <TableCell align="left" className={classes.tableRowPad}>
              {/* Net */}

              <TextField
                className=""
                label="Net Weight"
                name="netWt"
                value={props.updtRecord.netWt}
                error={
                  props.updtRecord.errors !== undefined
                    ? props.updtRecord.errors.netWt
                      ? true
                      : false
                    : false
                }
                helperText={
                  props.updtRecord.errors !== undefined
                    ? props.updtRecord.errors.netWt
                    : ""
                }
                onChange={(e) => props.handleInputChange(e)}
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
                name="remarks"
                value={props.updtRecord.remarks}
                error={
                  props.updtRecord.errors !== undefined
                    ? props.updtRecord.errors.remarks
                      ? true
                      : false
                    : false
                }
                helperText={
                  props.updtRecord.errors !== undefined
                    ? props.updtRecord.errors.remarks
                    : ""
                }
                onChange={(e) => props.handleInputChange(e)}
                variant="outlined"
                required
                fullWidth
              />
            </TableCell>
            <TableCell align="left" className={classes.tableRowPad}>
              {/* iamge */}
              {/* <img src={row.design.image_files[0].image_file} height={50} width={50} /> */}
            </TableCell>

            <TableCell className={classes.tableRowPad}>
              <Button
                variant="contained"
                color="primary"
                // className="w-224"
                aria-label="Register"
                //   disabled={!isFormValid()}
                // type="submit"
                onClick={(e) => props.cancelUpdtRecord(row.id)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                className="ml-2"
                aria-label="Register"
                //   disabled={!isFormValid()}
                // type="submit"
                onClick={(e) => props.updateRecord(row.id)}
              >
                Save
              </Button>
            </TableCell>
          </>
        ) : (
          <>
            <TableCell
              align="left"
              className={classes.tableRowPad}
              style={{ overflowWrap: "anywhere" }}
            >
              {/* Design No */}
              {row.design?.variant_number}
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
            <TableCell align="left" className={classes.tableRowPad}>
              {/* iamge */}
              <img
                src={
                  row.design.image_files.length > 0
                    ? row.design.image_files[0].image_file
                    : Config.getjvmLogo()
                }
                height={50}
                width={50}
              />
            </TableCell>

            {props.isEdit && (
              <TableCell className={classes.tableRowPad}>
                {!props.editFlag && (
                  <>
                    <IconButton
                      style={{ padding: "0" }}
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        props.editHandler(row.id);
                        setOpen(false);
                      }}
                    >
                      <Icon className="mr-8 edit-icone">
                        <img src={Icones.edit} alt="" />
                      </Icon>
                      {/* <Icon
                        className="mr-8"
                        style={{ color: "dodgerblue" }}
                      >
                        create
                      </Icon> */}
                    </IconButton>

                    <IconButton
                      style={{ padding: "0" }}
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        props.deleteHandler(row.id);
                      }}
                    >
                      <Icon className="mr-8 delete-icone">
                        <img src={Icones.delete_red} alt="" />
                      </Icon>
                      {/* <Icon
                        className="mr-8"
                        style={{ color: "red" }}
                      >
                        delete
                      </Icon> */}
                    </IconButton>
                  </>
                )}

                {/*<IconButton
                                                            style={{ padding: "0" }}
                                                            onClick={(ev) => {
                                                                ev.preventDefault();
                                                                ev.stopPropagation();
                                                                viewHandler(row);
                                                            }}
                                                        >
                                                            <Icon
                                                                className="mr-8"
                                                                style={{ color: "dodgerblue" }}
                                                            >
                                                                visibility
                                                            </Icon>
                                                        </IconButton> */}
              </TableCell>
            )}
          </>
        )}
      </TableRow>
      {row.design?.MainVariantCombination?.length > 0 && (
        <TableRow style={{ padding: 0 }}>
          <TableCell
            style={{ padding: 0, border: 0 }}
            colSpan={props.isEdit ? 9 : 8}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box>
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    {row.design?.MainVariantCombination?.map(
                      (combRow, index) => (
                        <TableRow key={index}>
                          <TableCell
                            className={classes.tableRowPad}
                            style={{ width: "5%" }}
                          ></TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {combRow.ParentVariant?.variant_number}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {combRow.ParentVariant?.design_weights[0]?.karat}
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {
                              combRow.ParentVariant?.design_weights[0]
                                ?.gross_weight
                            }
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {
                              combRow.ParentVariant?.design_weights[0]
                                ?.net_weight
                            }
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <img
                              src={
                                combRow.ParentVariant?.image_files.length > 0
                                  ? combRow.ParentVariant?.image_files[0]
                                      .image_file
                                  : Config.getjvmLogo()
                              }
                              height={50}
                              width={50}
                            />
                          </TableCell>
                          {props.isEdit && (
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                          )}
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

export default TypeThreeComp;

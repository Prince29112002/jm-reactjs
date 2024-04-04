import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Icon, IconButton } from "@material-ui/core";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import moment from "moment";
import Loader from "app/main/Loader/Loader";
import History from "@history";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import ViewDocModal from "../../Helper/ViewDocModal";
import { UpdateNarration } from "../../Helper/UpdateNarration";
import HelperFunc from "../../Helper/HelperFunc";
import { Autocomplete } from "@material-ui/lab";
import Select, { createFilter } from "react-select";
import sendOfReproduction from "app/main/SampleFiles/SendOfReproduction/sendOfReproductionLot.csv";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    // minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  tablePad: {
    padding: 0,
  },
  form: {
    marginTop: "3%",
    display: "contents",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  selectBox: {
    marginLeft: "0.5rem",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "10%",
    display: "inline-block",
  },
  tableheader: {
    display: "inline-block",
    textAlign: "center",
  },
  normalSelect: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
  },
  modalStyle: {
    background: "#FFFFFF",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#000000",
    position: "absolute",
  },
  errorMessage: {
    color: "#f44336",
    position: "absolute",
    bottom: "-3px",
    fontSize: "9px",
    lineHeight: "8px",
    marginTop: 3,
  },
}));

const AddSendOfReproduction = React.memo((props) => {
  const dispatch = useDispatch();
  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const classes = useStyles();
  // const inputRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const [isView, setIsView] = useState(false);
  const selectLoadType = [
    { value: 0, label: "Upload CSV" },
    { value: 1, label: "Upload Manual" },
  ];
  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));
  const [VoucherDtErr, setVoucherDtErr] = useState("");

  const [metalNarration, setMetalNarration] = useState("");
  const [metalNarrationErr, setMetalNarrationErr] = useState("");

  const [packingSlipNo, setPackingSlipNo] = useState("");
  const [packingSlipErr, setPackingSlipErr] = useState("");
  const [packingSearch, setPackingSearch] = useState("");
  const [packingSlipApiData, setPackingSlipApiData] = useState([]);
  const [lotArr, setlotArr] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [stockCodeErr, setStockCodeErr] = useState("");
  const [stockCodeFile, setStockCodeFile] = useState(null);

  const departmentId = localStorage.getItem("SelectedDepartment");
  const departmentName = localStorage.getItem("selDeptNm");
  const [lotData, setLotData] = useState([]);
  const [selectedLoadType, setSelectedLoadType] = useState([
    { value: 1, label: "Upload Manual" },
  ]);

  const [manualLotData, setManualLotData] = useState([]);

  const [lotNumber, setLotNumber] = useState("");
  const [lotNumberErr, setLotNumberErr] = useState("");

  const [categoryName, setCategoryName] = useState([]);
  const [categoryNameErr, setCategoryNameErr] = useState("");

  const [purity, setPurity] = useState([]);
  const [purityErr, setPurityErr] = useState("");

  const [stockCodeData, setStockCodeData] = useState([]);
  const [selectedStockCode, setSelectedStockCode] = useState([]);

  const [productCategory, setProductCategory] = useState([]);

  // console.log(departmentId);
  // console.log(departmentName);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [loading]);

  // useEffect(() => {
  //   if (selectedDepartment) {
  //     getStockCodeAll();
  //   }
  // }, [selectedDepartment]);

  useEffect(() => {
    if (props.reportView === "Report") {
      NavbarSetting("Factory Report", dispatch);
    } else if (props.reportView === "Account") {
      NavbarSetting("Accounts", dispatch);
    } else {
      NavbarSetting("Sales", dispatch);
    }
  }, []);

  const [formValues, setFormValues] = useState([
    {
      barcode: "",
      batchNumber: "",
      variantNumber: "",
      grossWeight: "",
      netWeight: "",
      purity: "",
      errors: {
        barcode: "",
        batchNumber: "",
        variantNumber: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
      },
    },
    // {
    //   stockCode: "",
    //   categoryName: "",
    //   selectedHsn: "",
    //   unitOfPurchase: "",
    //   quantity: "",
    //   avgRate: "",
    //   Amount: "",
    //   Total: "",
    //   availableStock: "",
    //   errors: {
    //     stockCode: null,
    //     categoryName: null,
    //     selectedHsn: null,
    //     unitOfPurchase: null,
    //     quantity: null,
    //     avgRate: null,
    //     Amount: null,
    //     Total: null,
    //   },
    // },
    // {
    //   stockCode: "",
    //   categoryName: "",
    //   selectedHsn: "",
    //   unitOfPurchase: "",
    //   quantity: "",
    //   avgRate: "",
    //   Amount: "",
    //   Total: "",
    //   availableStock: "",
    //   errors: {
    //     stockCode: null,
    //     categoryName: null,
    //     selectedHsn: null,
    //     unitOfPurchase: null,
    //     quantity: null,
    //     avgRate: null,
    //     Amount: null,
    //     Total: null,
    //   },
    // },
    // {
    //   stockCode: "",
    //   categoryName: "",
    //   selectedHsn: "",
    //   unitOfPurchase: "",
    //   quantity: "",
    //   avgRate: "",
    //   Amount: "",
    //   Total: "",
    //   availableStock: "",
    //   errors: {
    //     stockCode: null,
    //     categoryName: null,
    //     selectedHsn: null,
    //     unitOfPurchase: null,
    //     quantity: null,
    //     avgRate: null,
    //     Amount: null,
    //     Total: null,
    //   },
    // },
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (packingSearch) {
        getPackingSlipData(packingSearch);
      } else {
        setPackingSlipApiData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
    //eslint-disable-next-line
  }, [packingSearch]);

  function getPackingSlipData(sData) {
    let api = `api/tempSalesB2C/search/${departmentId}?barcode=${sData}`;
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          if (response.data.data.length > 0) {
            setPackingSlipApiData(response.data.data);
          } else {
            setPackingSlipApiData([]);
            dispatch(
              Actions.showMessage({
                message: "Please Insert Proper BarCode No",
              })
            );
          }
        } else {
          setPackingSlipApiData([]);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: api,
        });
      });
  }

  function getPackingSlipDetails(packingSlipNum) {
    console.log(packingSlipNum);
    let api = `api/lotfrombarcode/details/${packingSlipNum}`;
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setPackingSlipApiData([]);
          setPackingSlipNo("");
          setPackingSearch("");
          let temp = response.data.data;
          console.log(temp);
          const oldSlipData = [...formValues];
          const oldTotalData = formValues.length - 1;
          const newTempData = oldSlipData[oldTotalData];
          newTempData.barcode = temp.barcode;
          newTempData.batchNumber = temp.LotDetail.batch_number;
          newTempData.variantNumber = temp.LotDetail.DesignInfo.variant_number;
          newTempData.grossWeight = temp.LotDetail.gross_wgt;
          newTempData.netWeight = temp.LotDetail.net_wgt;
          newTempData.purity = temp.LotDetail.purity;
          setFormValues(oldSlipData);
          addNewRow();
          console.log(oldSlipData);
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
          api: api,
        });
      });
  }
  function addNewRow() {
    setFormValues([
      ...formValues,
      {
        barcode: "",
        batchNumber: "",
        variantNumber: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        errors: {
          barcode: "",
          batchNumber: "",
          variantNumber: "",
          grossWeight: "",
          netWeight: "",
          purity: "",
        },
      },
    ]);
  }

  useEffect(() => {
    getProductCategories();
  }, []);

  function getProductCategories() {
    axios
      .get(Config.getCommonUrl() + "api/productcategory/all/list/new")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProductCategory(response.data.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/productcategory/all/list/new",
        });
      });
  }

  function handleStockGroupChange(e) {
    setPurity(e);
    setPurityErr("");
  }
  
  function handleCategoryNameChange(e) {
    console.log(e);
    setCategoryName(e);
    setCategoryNameErr("");
  }
  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "voucherDate") {
      setVoucherDate(moment(value).format("YYYY-MM-DD"));
    }
    if (name === "voucherNumber") {
      setVoucherNumber(value);
      setVoucherNumErr("");
    }
    if (name === "lotnumber") {
      setLotNumber(value);
      setLotNumberErr("");
    }
    if (name === "categoryname") {
      setCategoryName(value);
      setCategoryNameErr("");
    }
    // if (name === "purity") {
    //   setPurity(value);
    //   if (value === "") {
    //     setPurityErr("please Enter Purity");
    //     return false;
    //   }
    //   else if(parseFloat(value) > 100 || parseFloat(value) < 0) {
    //     setPurityErr("please Enter Valid Purity");
    //     return false;
    //   }

    //   setPurityErr("");
    // }
    if (name === "metalNarration") {
      setMetalNarration(value);
      setMetalNarrationErr("");
    }
  }

  const [docFile, setDocFile] = useState("");

  const handlePackingSlipSelect = (packingSlipNum) => {
    console.log("innnn", packingSlipNum);
    console.log(packingSlipApiData);
    console.log(lotArr, "lotArr");
    let filteredArray = packingSlipApiData.filter(
      (item) => item.barcode_name === packingSlipNum
    );
    if (filteredArray.length > 0) {
      console.log(filteredArray);
      setPackingSlipApiData(filteredArray);
      setPackingSlipErr("");
      setPackingSlipNo(packingSlipNum);
      console.log(lotArr);
      console.log(filteredArray[0].barcode_name);
      console.log(lotArr.includes(filteredArray[0].barcode_name));
      if (!lotArr.includes(filteredArray[0].barcode_name)) {
        setlotArr([...lotArr, filteredArray[0].barcode_name]);
        getPackingSlipDetails(packingSlipNum);
      } else {
        dispatch(
          Actions.showMessage({
            message: "This barcode alredy added",
          })
        );
      }
    } else {
      setPackingSlipNo("");
      setPackingSlipErr("Please Select Proper Barcode");
    }
  };

  function handleChangeLoadType(e) {
    console.log(e.value);
    setSelectedLoadType(e);
    setLotData([]);
    setFormValues([
      {
        barcode: "",
        batchNumber: "",
        variantNumber: "",
        grossWeight: "",
        netWeight: "",
        purity: "",
        errors: {
          barcode: "",
          batchNumber: "",
          variantNumber: "",
          grossWeight: "",
          netWeight: "",
          purity: "",
        },
      },
    ]);
  }
  function callStockCodeFileUploadApi(formData) {
    setLoading(true);
    const body = formData;
    var api = "api/lotfrombarcode/createfromexcel";
    axios
      .post(Config.getCommonUrl() + api, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setStockCodeFile("");
          handleClose();
          // dispatch(
          //   Actions.showMessage({
          //     message: "File Uploaded Successfully",
          //   })
          // );
          setLotData(response.data.data);
          // setStockCodeData(response.data.data);
        } else {
          let downloadUrl = response.data.url;
          window.open(downloadUrl);

          setStockCodeErr("");
          handleClose();
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        handleError(error, dispatch, { api: api, body: body });
      });
  }

  function addSendOfReproductionManual(resetFlag, toBePrint) {
    setLoading(true);
    console.log(lotData);
    const Orders = [];
    // formValues.map((x) => {
    //   if (x.barcode) {
    Orders.push({
      lot_number: lotNumber,
      Category: categoryName.label,
      Purity: purity.label,
      Barcodes: lotArr,
      //   });
      // }
    });
    const body = {
      // is_vendor_client: 4,
      // is_shipped: 0,
      party_voucher_no: voucherNumber,
      // opposite_account_id: oppositeAccSelected.value,
      department_id: parseFloat(departmentId),
      note: metalNarration,
      // account_narration: accNarration,
      // uploadDocIds: docIds,
      party_voucher_date: voucherDate,
      // setRate: goldRate,
      data: selectedLoadType.value === 0 ? lotData : Orders,
    };
    console.log(body);
    axios
      .post(Config.getCommonUrl() + "api/lotfrombarcode/manually/entry", body)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          History.goBack();
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
          if (resetFlag === true) {
            // checkAndReset();
          }
          if (toBePrint === true) {
            //printing after save, so print popup will be displayed after successfully saving record
            // handlePrint();
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/lotfrombarcode/manually/entry",
          body: body,
        });
      });
  }
  useEffect(() => {
    getStockCode();
  }, []);
  function getStockCode() {
    axios
      .get(Config.getCommonUrl() + "api/stockname/metal")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockCodeData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/stockname/metal" });
      });
  }

  function handleInputCSVChangea(e) {
    setStockCodeFile(e.target.files);
    setStockCodeErr("");
  }
  const handleStockeCodeFileUpload = (e) => {
    e.preventDefault();
    if (stockCodeFile === null) {
      setStockCodeErr("Please choose file");
    } else if (departmentId === undefined) {
      dispatch(Actions.showMessage({ message: "Please Select Department " }));
    } else {
      const formData = new FormData();
      for (let i = 0; i < stockCodeFile.length; i++) {
        formData.append("file", stockCodeFile[i]);
        formData.append("department_id", departmentId);
      }
      callStockCodeFileUploadApi(formData);
    }
  };
  const validateEmptyError = () => {
    let arrData = [...formValues];
    let flag = true;
    arrData.map((item) => {
      if (!errorCheck(item.errors)) {
        flag = false;
      }
    });
    return flag;
  };
  const errorCheck = (error) => {
    console.log(error);
    let valid = true;
    if (error) {
      Object.values(error).forEach((val) => val.length > 0 && (valid = false));
    } else {
    }
    return valid;
  };

  function checkDataIsEmpty() {
    if (lotData.length !== 0 || lotArr.length !== 0) {
      return true;
    } else {
      dispatch(
        Actions.showMessage({
          message: "Please Enter Barcode",
        })
      );
      return false;
    }
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();
    console.log(lotData.length);
    if (
      (selectedLoadType.value !== 0
        ? lotNumberValid() && categoryNameValid() && purityValid()
        : true) &&
      noteValid() &&
      checkDataIsEmpty() &&
      validateEmptyError()
    ) {
      addSendOfReproductionManual(true, false);
    }
  }
  const deleteHandler = (index, id) => {
    console.log(index);
    console.log(id);
    const oldData = [...formValues];
    console.log(oldData);

    if (oldData[index + 1]) {
      const newData = oldData.filter((item, i) => {
        if (i !== index) return item;
        return false;
      });
      console.log(newData, "newData");
      setFormValues(newData);
    } else {
      oldData[index].barcode = "";
      oldData[index].batchNumber = "";
      oldData[index].variantNumber = "";
      oldData[index].grossWeight = "";
      oldData[index].netWeight = "";
      oldData[index].purity = "";
      oldData[index].errors = {};
      setFormValues(oldData);
    }
    const newLotArrs = lotArr.filter((temp) => {
      return temp !== id;
    });
    console.log(newLotArrs);
    setlotArr(newLotArrs);
  };

  function patryVoucherNumberValid() {
    if (voucherNumber === "") {
      setVoucherNumErr("Please Enter Voucher Number");
      return false;
    }
    return true;
  }
  function lotNumberValid() {
    if (lotNumber === "") {
      setLotNumberErr("Please Enter Lot Number");
      return false;
    }
    return true;
  }
  function categoryNameValid() {
    if (categoryName.length === 0) {
      setCategoryNameErr("Please Select Category Name");
      return false;
    }
    return true;
  }
  function purityValid() {
    if (purity.length === 0) {
      setPurityErr("Please Select Purity");
      return false;
    }
    return true;
  }
  function noteValid() {
    if (metalNarration === "") {
      setMetalNarrationErr("Please Enter Note");
      return false;
    }
    return true;
  }

  function handleClose() {
    setModalOpen(false);
  }
  function handleModalOpen() {
    setModalOpen(true);
  }


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            {!props.viewPopup && (
              <Grid container alignItems="center" spacing={4} className="jewellerypreturn-main" style={{ margin: 0 }} >
                <Grid item xs={7} sm={7} md={7} key="1" style={{ padding: 0 }}>
                  <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                      {isView
                        ? "View Send Of Reproduction"
                        : "Add Send Of Reproduction"}
                    </Typography>
                  </FuseAnimate>

                  {/* {!isView && <BreadcrumbsHelper />} */}
                </Grid>

                <Grid
                  item
                  xs={5}
                  sm={5}
                  md={5}
                  key="2"
                  style={{ textAlign: "right",}}
                >
                   <div className="btn-back mt-2">
                    {" "}
                    <img src={Icones.arrow_left_pagination} alt="" />
                    <Button
                      id="btn-back"
                      size="small"
                      onClick={(event) => {
                        History.goBack();
                      }}
                    >
                      Back
                    </Button>
                  </div>
                </Grid>
              </Grid>
            )}
            <div className="main-div-alll">

            {/* {loading && <Loader />} */}
            <div
              className="pb-32 pt-32"
              style={{ marginBottom: "10%", height: "90%" }}
            >
              <div>
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  // onSubmit={handleFormSubmit}
                >
                  <Grid container spacing={2}>
                    {/* {allowedBackDate && ( */}
                    <Grid item lg={2} md={4} sm={4} xs={12}>
                    <p style={{ paddingBottom: "3px" }}>Select Load Type</p>

                      <Select
                        filterOption={createFilter({ ignoreAccents: false })}
                        options={selectLoadType.map((item, i) => ({
                          value: item.value,
                          label: item.label,
                          key: i,
                        }))}
                        name="selectloadtype"
                        value={selectedLoadType}
                        onChange={(e) => handleChangeLoadType(e)}
                        placeholder={selectedLoadType.label}
                        fullWidth
                        variant="outlined"
                        style={{ height: "37.6px", background: "#ffffff" }}
                      />
                    </Grid>
                    <Grid item lg={2} md={4} sm={4} xs={12}>
                    <p style={{ paddingBottom: "3px" }}>Party Voucher Date</p>

                      <TextField
                        type="date"
                        name="voucherDate"
                        value={moment(voucherDate).format("YYYY-MM-DD")}
                        error={VoucherDtErr.length > 0 ? true : false}
                        helperText={VoucherDtErr}
                        placeholder="Party Voucher Date"
                        onChange={(e) => handleInputChange(e)}
                        // onBlur={handleDateBlur}
                        variant="outlined"
                        required
                        fullWidth
                        // InputProps={{inputProps: { min: moment(new Date("2022-03-17")).format("YYYY-MM-DD"), max: moment().format("YYYY-MM-DD")} }}
                        //   inputProps={{
                        //     min: moment()
                        //       .subtract(backEntryDays, "day")
                        //       .format("YYYY-MM-DD"),
                        //     max: moment().format("YYYY-MM-DD"),
                        //   }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={isView}
                      />
                    </Grid>

                    {/* )} */}
                    <Grid item lg={2} md={4} sm={4} xs={12}>
                    <p style={{ paddingBottom: "3px" }}>Party Voucher Number</p>

                      <TextField
                        placeholder="Party Voucher Number"
                        autoFocus
                        className={classes.inputBoxTEST}
                        name="voucherNumber"
                        value={voucherNumber}
                        error={voucherNumErr.length > 0 ? true : false}
                        helperText={voucherNumErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    {/* {!isView && (
                      <Grid item lg={2} md={4} sm={4} xs={12}>
                        <TextField
                          className="uploadDoc"
                          label="Upload Document"
                          type="file"
                          inputProps={{
                            multiple: true,
                          }}
                          onChange={(e) => setDocFile(e.target.files)}
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    )} */}
                    {selectedLoadType.value !== 0 ? (
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        className="packing-slip-input"
                      >
                        <p style={{ paddingBottom: "3px" }}>Barcode No</p>

                        <Autocomplete
                          // id="free-solo-demo"
                          freeSolo
                          style={{ padding: 0 }}
                          disableClearable
                          onChange={(event, newValue) => {
                            console.log(newValue);
                            handlePackingSlipSelect(newValue);
                          }}
                          onInputChange={(event, newInputValue) => {
                            if (event !== null) {
                              if (event.type === "change")
                                // not using this condition because all other data is showing in dropdown
                                setPackingSearch(newInputValue);
                            } else {
                              setPackingSearch("");
                            }
                          }}
                          value={packingSlipNo}
                          options={packingSlipApiData.map(
                            (option) => option.barcode_name
                          )}
                          disabled={isView}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              style={{ padding: 0 }}
                              placeholder="Barcode No"
                            />
                          )}
                        />
                        <span style={{ color: "red" }}>
                          {/* {packingSlipErr.length > 0 ? packingSlipErr : ""} */}
                        </span>
                      </Grid>
                    ) : null}
                    {selectedLoadType.value === 0 ? (
                      <Grid
                        item
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          style={{
                            backgroundColor: "#4caf50",
                            border: "none",
                            color: "white",
                          }}
                          onClick={() => {
                            handleModalOpen();
                          }}
                        >
                          Upload CSV
                        </Button>
                      </Grid>
                    ) : null}
                  </Grid>
                  {selectedLoadType.value !== 0 ? (
                    <Grid container spacing={2} style={{ marginTop: 15 }}>
                      <Grid item lg={2} md={4} sm={4} xs={12}>
                      <p style={{ paddingBottom: "3px" }}>Lot Number</p>

                        <TextField
                          placeholder="Lot Number"
                          autoFocus
                          name="lotnumber"
                          value={lotNumber}
                          error={lotNumberErr.length > 0 ? true : false}
                          helperText={lotNumberErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      </Grid>
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ position: "relative" }}
                      >
                        {/* <TextField
                        label="Category Name"
                        autoFocus
                        name="categoryname"
                        type="text"
                        value={categoryName}
                        error={categoryNameErr.length > 0 ? true : false}
                        helperText={categoryNameErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      /> */}
                      <p style={{ paddingBottom: "3px" }}>Category Name</p>

                        <Select
                          filterOption={createFilter({
                            ignoreAccents: false,
                          })}
                          // className={classes.selectBox}
                          options={productCategory.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.category_name,
                          }))}
                          onChange={(e) => {
                            handleCategoryNameChange(e);
                          }}
                          placeholder="Category Name"
                        />
                        <span className={classes.errorMessage}>
                          {categoryNameErr}
                        </span>
                      </Grid>
                      <Grid
                        item
                        lg={2}
                        md={4}
                        sm={4}
                        xs={12}
                        style={{ position: "relative" }}
                      >
                      <p style={{ paddingBottom: "3px" }}>Stock Code</p>

                        <Select
                          filterOption={createFilter({
                            ignoreAccents: false,
                          })}
                          // className={classes.selectBox}
                          options={stockCodeData.map((suggestion) => ({
                            value: suggestion.stock_name_code.id,
                            label: suggestion.stock_name_code.stock_code,
                          }))}
                          onChange={(e) => {
                            handleStockGroupChange(e);
                          }}
                          placeholder="Stock Code"
                        />
                        <span className={classes.errorMessage}>
                          {purityErr}
                        </span>
                      </Grid>

                    </Grid>
                    
                  ) : null}
                  <Paper style={{ marginTop: 30,border: "1px solid #D1D8F5", }}>
                    {selectedLoadType.value === 0 ? (
                      <Table>
                        <TableHead>
                          <TableRow>
                            {/* {!isView && (
                              <TableCell
                                className={classes.tableRowPad}
                                width="40px"
                                align="center"
                              ></TableCell>
                            )} */}
                            <TableCell className={classes.tableRowPad}>
                              Lot No.
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Category Name
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Barcode
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Puritry
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {lotData.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                style={{ textAlign: "center" }}
                              >
                                No data available
                              </TableCell>
                            </TableRow>
                          ) : (
                            lotData.map((data, i) => {
                              const { lot_number, Category, Barcodes, Purity } =
                                data;
                              console.log(data);
                              return (
                                <React.Fragment key={lot_number}>
                                  <TableRow key={lot_number}>
                                    {/* {!isView && (
                                      <TableCell
                                        className={classes.tablePad}
                                        width="40px"
                                        style={{
                                          textAlign: "center",
                                          border: "1px solid #e6e6e6",
                                        }}
                                      >
                                        <IconButton
                                          tabIndex="-1"
                                          style={{ padding: "0" }}
                                          // disabled={element.barcode === ""}
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                            ev.stopPropagation();
                                            // deleteHandler(index, element.lotdetail_id);
                                          }}
                                        >
                                          <Icon
                                            className=""
                                            style={{ color: "red" }}
                                          >
                                            delete
                                          </Icon>
                                        </IconButton>
                                      </TableCell>
                                    )} */}
                                    <TableCell className={classes.tableRowPad}>
                                      {lot_number}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {Category}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {Barcodes[0]}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {Purity}
                                    </TableCell>
                                  </TableRow>
                                  {Barcodes.slice(1).map((barcode, index) => (
                                    <TableRow key={`${lot_number}-${index}`}>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        <IconButton
                                          tabIndex="-1"
                                          style={{ padding: "0" }}
                                          // disabled={element.barcode === ""}
                                          onClick={(ev) => {
                                            ev.preventDefault();
                                            ev.stopPropagation();
                                            // deleteHandler(index, element.lotdetail_id);
                                          }}
                                        >
                                          <Icon
                                            className=""
                                            style={{ color: "red" }}
                                          >
                                            delete
                                          </Icon>
                                        </IconButton>
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {lot_number}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {Category}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {barcode}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {Purity}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </React.Fragment>
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    ) : (
                      <>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                                width="50px"
                                style={{ textAlign: "center" }}
                              ></TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Barcode
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Batch Number
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Variant Number
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Gross Weight
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Net Weight
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Purity
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {formValues.length === 0 ? (
                              <TableRow>
                                <TableCell
                                  colSpan={7}
                                  style={{ textAlign: "center" }}
                                >
                                  No data available
                                </TableCell>
                              </TableRow>
                            ) : (
                              formValues.map((data, index) => {
                                console.log(data);
                                return (
                                  <TableRow key={`form-row-${index}`}>
                                    <TableCell
                                      className={classes.tableRowPad}
                                      style={{ textAlign: "center" }}
                                    >
                                      <IconButton
                                        tabIndex="-1"
                                        style={{ padding: "0" }}
                                        disabled={data.barcode === ""}
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          ev.stopPropagation();
                                          deleteHandler(index, data.barcode);
                                        }}
                                      >
                                        <Icon
                                          className=""
                                          style={{ color: "red" }}
                                        >
                                          delete
                                        </Icon>
                                      </IconButton>
                                    </TableCell>
                                    <TableCell className={classes.tablePad}>
                                      <TextField
                                        name="barcode"
                                        value={data.barcode}
                                        variant="outlined"
                                        fullWidth
                                        disabled
                                      />
                                      {/* {data.barcode} */}
                                    </TableCell>
                                    <TableCell className={classes.tablePad}>
                                      <TextField
                                        name="batchnumber"
                                        value={data.batchNumber}
                                        variant="outlined"
                                        fullWidth
                                        disabled
                                      />
                                      {/* {data.batchNumber} */}
                                    </TableCell>
                                    <TableCell className={classes.tablePad}>
                                      <TextField
                                        name="variantnumber"
                                        value={data.variantNumber}
                                        variant="outlined"
                                        fullWidth
                                        disabled
                                      />
                                      {/* {data.variantNumber} */}
                                    </TableCell>
                                    <TableCell className={classes.tablePad}>
                                      <TextField
                                        name="grossweight"
                                        value={data.grossWeight}
                                        variant="outlined"
                                        fullWidth
                                        disabled
                                      />
                                      {/* {data.grossWeight} */}
                                    </TableCell>
                                    <TableCell className={classes.tablePad}>
                                      <TextField
                                        name="netweight"
                                        value={data.netWeight}
                                        variant="outlined"
                                        fullWidth
                                        disabled
                                      />
                                      {/* {data.netWeight} */}
                                    </TableCell>
                                    <TableCell className={classes.tablePad}>
                                      <TextField
                                        name="purity"
                                        value={data.purity}
                                        variant="outlined"
                                        fullWidth
                                        disabled
                                      />
                                      {/* {data.purity} */}
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            )}
                          </TableBody>
                        </Table>
                      </>
                    )}
                  </Paper>
                  {/* <div
                    className="AddConsumablePurchase-tabel AddConsumablePurchase-tabel-blg "
                    style={{ border: "1px solid lightgray", paddingBottom: 5 }}
                  >
                    <div
                      className="metal-tbl-head tool-tbl-head"
                      style={{ background: "lightgray", fontWeight: "700" }}
                    >
                      {!isView && (
                        <div
                          id="castum-width-table"
                          className={clsx(
                            classes.tableheader,
                            "delete_icons_dv"
                          )}
                        ></div>
                      )}
                      <div
                        id="castum-width-table"
                        className={classes.tableheader}
                      >
                        Category Variant
                      </div>
                      <div
                        className={clsx(
                          classes.tableheader,
                          " castum-width-table"
                        )}
                      >
                        Category Name
                      </div>
                      <div
                        className={clsx(
                          classes.tableheader,
                          " castum-width-table"
                        )}
                      >
                        HSN
                      </div>

                      <div
                        className={clsx(
                          classes.tableheader,
                          " castum-width-table"
                        )}
                      >
                        Quantity
                      </div>

                      <div
                        className={clsx(
                          classes.tableheader,
                          " castum-width-table"
                        )}
                      >
                        Unit of purchase
                      </div>
                      <div
                        className={clsx(
                          classes.tableheader,
                          " castum-width-table"
                        )}
                      >
                        Available Stock
                      </div>
                      <div
                        className={clsx(
                          classes.tableheader,
                          " castum-width-table"
                        )}
                      >
                        Average Rate
                      </div>

                      <div
                        className={clsx(
                          classes.tableheader,
                          " castum-width-table"
                        )}
                      >
                        Total
                      </div>
                    </div>

                    {formValues.map((element, index) => (
                      <div key={index} className=" castum-row-dv">
                        {!isView && (
                          <div
                            className={clsx(
                              classes.tableheader,
                              "delete_icons_dv"
                            )}
                          >
                            <IconButton
                              tabIndex="-1"
                              style={{ padding: "0" }}
                              onClick={(ev) => {
                                ev.preventDefault();
                                ev.stopPropagation();
                                deleteHandler(index);
                              }}
                            >
                              <Icon className="" style={{ color: "red" }}>
                                delete
                              </Icon>
                            </IconButton>
                          </div>
                        )}
                        <Select
                          className={classes.selectBox}
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          options={stockCodeData
                            .filter((element) =>
                              formValues.every(
                                (item) =>
                                  !(
                                    item.stockCode?.value ===
                                      element.stock_name_code.id &&
                                    item.stockCode?.label ===
                                      element.stock_name_code.stock_code
                                  )
                              )
                            )
                            .map((suggestion) => ({
                              value: suggestion.stock_name_code.id,
                              label: suggestion.stock_name_code.stock_code,
                            }))}
                          value={
                            element.stockCode !== ""
                              ? element.stockCode.value === ""
                                ? ""
                                : element.stockCode
                              : ""
                          }
                          onChange={(e) => {
                            handleStockGroupChange(index, e);
                          }}
                          placeholder="Stock Code"
                          isDisabled={isView}
                        />

                        <span style={{ color: "red" }}>
                          {element.errors !== undefined
                            ? element.errors.stockCode
                            : ""}
                        </span>

                        <TextField
                          name="categoryName"
                          className=""
                          value={element.categoryName || ""}
                          disabled
                          error={
                            element.errors !== undefined
                              ? element.errors.categoryName
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.categoryName
                              : ""
                          }
                          variant="outlined"
                          fullWidth
                        />

                        <TextField
                          name="selectedHsn"
                          className=""
                          value={element.selectedHsn || ""}
                          disabled
                          error={
                            element.errors !== undefined
                              ? element.errors.selectedHsn
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.selectedHsn
                              : ""
                          }
                          variant="outlined"
                          fullWidth
                        />

                        <TextField
                          name="quantity"
                          className={classes.inputBoxTEST}
                          type={isView ? "text" : "number"}
                          value={element.quantity}
                          error={
                            element.errors !== undefined
                              ? element.errors.quantity
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.quantity
                              : ""
                          }
                          onChange={(e) => handleChange(index, e)}
                          inputRef={(el) => (inputRef.current[index] = el)}
                          variant="outlined"
                          fullWidth
                          disabled={isView}
                        />

                        <select
                          className={clsx(
                            classes.normalSelect,
                            "unit_purchase_castum",
                            "focusClass"
                          )}
                          required
                          value={element.unitOfPurchase || ""}
                          onChange={(e) => handleUnitChange(index, e)}
                          disabled={isView}
                        >
                          <option hidden value="">
                            Select Unit type
                          </option>
                          {unitData.map((suggestion) => (
                            <option value={suggestion.id}>
                              {suggestion.unit_name}{" "}
                            </option>
                          ))}
                        </select>

                        <span style={{ color: "red" }}>
                          {element.errors !== undefined
                            ? element.errors.unitOfPurchase
                            : ""}
                        </span>

                        <TextField
                          name="availableStock"
                          className=""
                          value={element.availableStock || ""}
                          disabled
                          variant="outlined"
                          fullWidth
                        />

                        <TextField
                          name="avgRate"
                          className={classes.inputBoxTEST}
                          type={isView ? "text" : "number"}
                          value={
                            isView
                              ? Config.numWithComma(element.avgRate)
                              : element.avgRate || ""
                          }
                          error={
                            element.errors !== undefined
                              ? element.errors.avgRate
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.avgRate
                              : ""
                          }
                          onBlur={(e) => handlerBlur(index, e)}
                          variant="outlined"
                          fullWidth
                          disabled={isView}
                        />
                        <TextField
                          name="Amount"
                          className=""
                          value={
                            isView
                              ? Config.numWithComma(element.Amount)
                              : element.Amount || ""
                          }
                          error={
                            element.errors !== undefined
                              ? element.errors.Amount
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            element.errors !== undefined
                              ? element.errors.Amount
                              : ""
                          }
                          variant="outlined"
                          fullWidth
                          disabled
                        />
                      </div>
                    ))}
                    <div
                      className="mt-5 castum-row-dv"
                      style={{ fontWeight: "700", height: "30px" }}
                    >
                      {!isView && (
                        <div
                          id="castum-width-table"
                          style={{}}
                          className={clsx(
                            classes.tableheader,
                            "delete_icons_dv"
                          )}
                        ></div>
                      )}
                      <div
                        id="castum-width-table"
                        className={classes.tableheader}
                      ></div>
                      <div
                        className={clsx(
                          classes.tableheader,
                          "castum-width-table"
                        )}
                        style={{}}
                      ></div>
                      <div
                        className={clsx(
                          classes.tableheader,
                          "castum-width-table"
                        )}
                        style={{}}
                      ></div>

                      <div
                        className={clsx(
                          classes.tableheader,
                          "castum-width-table"
                        )}
                        style={{}}
                      >
                      </div>

                      <div
                        className={clsx(
                          classes.tableheader,
                          "castum-width-table"
                        )}
                        style={{}}
                      >
                      </div>
                      <div
                        className={clsx(
                          classes.tableheader,
                          "castum-width-table"
                        )}
                        style={{}}
                      >
                      </div>

                      <div
                        className={clsx(
                          classes.tableheader,
                          "castum-width-table"
                        )}
                        style={{}}
                      >
                        {isView
                          ? Config.numWithComma(
                              HelperFunc.getTotalOfField(formValues, "Amount")
                            )
                          : Config.numWithComma(
                              HelperFunc.getTotalOfField(formValues, "Amount")
                            )}
                      </div>
                    </div>
                  </div> */}
                </form>

                <Grid
                      item
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      style={{ padding: 6 }}
                    >
                      <p style={{ paddingBottom: "3px" }}>Note</p>
                      <TextField
                        className="mt-1"
                        placeholder="Note"
                        name="metalNarration"
                        value={metalNarration}
                        error={metalNarrationErr.length > 0 ? true : false}
                        helperText={metalNarrationErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        multiline
                        minRows={4}
                        maxrows={4}
                        // disabled={narrationFlag}
                      />
                    </Grid>
                {!props.viewPopup && (
                  <div>
                    {!isView && (
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ float: "right" }}
                        className="w-224 mx-auto mt-16 btn-print-save"
                        aria-label="Register"
                        disabled={isView || formValues[0].Amount == 0}
                        // type="submit"
                        onClick={(e) => {
                          handleFormSubmit(e);
                        }}
                      >
                        Save
                      </Button>
                    )}

                    {isView && (
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ float: "right" }}
                        className="w-224 mx-auto mt-16 mr-16"
                        aria-label="Register"
                        // onClick={() => handleNarrationClick()}
                      >
                        {/* {!narrationFlag ? "Save Narration" : "Update Narration"} */}
                      </Button>
                    )}
                  </div>
                )}

                {/* {isView && (
                  <Button
                    variant="contained"
                    className={clsx(classes.button, "mt-16 mr-16")}
                    onClick={() => setDocModal(true)}
                  >
                    View Documents
                  </Button>
                )} */}
              </div>
            </div>
</div>
            {/* <ViewDocModal
              documentList={documentList}
              handleClose={handleDocModalClose}
              open={docModal}
              updateDocument={updateDocumentArray}
              purchase_flag_id={idToBeView?.id}
              purchase_flag="5"
              concateDocument={concateDocument}
              viewPopup={props.viewPopup}
            /> */}
          </div>
        </div>
      </FuseAnimate>
      <Modal open={modalOpen} onClose={handleClose}>
        <Box className={classes.modalStyle}>
          <h5
            className="p-5"
            style={{
              textAlign: "center",
              backgroundColor: "black",
              color: "white",
              position: "relative",
            }}
          >
            Upload Stock File
            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={handleClose}
            >
              <Icon style={{ color: "white" }}>close</Icon>
            </IconButton>
          </h5>

          <div className="p-5 pl-16 pr-16">
            <TextField
              id="fileinputstock"
              className="mt-16 mb-16"
              label="Upload CSV Excel File"
              name="stockcode"
              type="file"
              error={stockCodeErr.length > 0 ? true : false}
              helperText={stockCodeErr}
              onChange={(e) => handleInputCSVChangea(e)}
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Grid
              item
              lg={6}
              md={6}
              sm={6}
              xs={12}
              style={{ padding: 2 }}
              className=""
            >
              <a href={sendOfReproduction} download="SendOfReproduction.csv">
                Download Sample{" "}
              </a>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              className="w-full mx-auto mt-16"
              style={{
                backgroundColor: "#4caf50",
                border: "none",
                color: "white",
              }}
              onClick={(e) => handleStockeCodeFileUpload(e)}
            >
              Upload
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
});

export default AddSendOfReproduction;

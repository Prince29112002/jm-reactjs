import React, { useState, useEffect, useContext } from "react";
import { Paper, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Select, { createFilter } from "react-select";
import History from "@history";
import Modal from "@material-ui/core/Modal";
import Loader from "../../../Loader/Loader";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Icon,
  IconButton,
} from "@material-ui/core";
import AppContext from "app/AppContext";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

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
  tableFooter: {
    padding: 7,
    backgroundColor: "#E3E3E3",
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

const GenerateBarcode = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(true);
  const [loading, setLoading] = useState(false);

  const [purity, setpurity] = useState("");

  const [grossWeight, setGrossWeight] = useState(0.0);
  const [grossWeightErr, setGrossWeightErr] = useState("");

  const [netWeight, setNetWeight] = useState(0.0);
  const [netWeightErr, setNetWeightErr] = useState("");

  const [stoneWeight, setStoneWeight] = useState(0.0);
  const [stoneWeightErr, setStoneWeightErr] = useState("");

  const [stoneAmt, setStoneAmt] = useState(0.0);
  const [stoneAmtErr, setStoneAmtErr] = useState("");

  const [beadsWeight, setBeadsWeight] = useState(0.0);
  const [beadsWeightErr, setBeadsWeightErr] = useState("");

  const [beadsAmt, setBeadsAmt] = useState(0.0);
  const [beadsAmtErr, setBeadsAmtErr] = useState("");

  const [silverWeight, setSilverWeight] = useState(0.0);
  const [silverWeightErr, setSilverWeightErr] = useState("");

  const [silverAmt, setSilverAmt] = useState(0.0);
  const [silverAmtErr, setSilverAmtErr] = useState("");

  const [otherWeight, setOtherWeight] = useState(0.0);
  const [otherWeightErr, setOtherWeightErr] = useState("");

  const [otherAmt, setOtherAmt] = useState(0.0);
  const [otherAmtErr, setOtherAmtErr] = useState("");

  const [solWeight, setSolWeight] = useState(0.0);
  const [solWeightErr, setSolWeightErr] = useState("");

  const [solAmt, setSolAmt] = useState(0.0);
  const [solAmtErr, setSolAmtErr] = useState("");

  const [brassWeight, setBrassWeight] = useState(0.0);
  const [brassWeightErr, setBrassWeightErr] = useState("");

  const [brassAmt, setBrassAmt] = useState(0.0);
  const [brassAmtErr, setBrassAmtErr] = useState("");

  const [tagChargesRs, setTagChargesRs] = useState(0.0);
  const [tagChargesRsErr, setTagChargesRsErr] = useState("");

  const [orderList, setOrderList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedOrderErr, setSelectedOrderErr] = useState("");

  const [referenceList, setReferenceList] = useState([]);
  const [selectedReference, setSelectedReference] = useState("");
  const [selectedRefErr, setSelectedRefErr] = useState("");

  const [phyQty, setPhyQty] = useState(0);
  const [phyQtyErr, setPhyQtyErr] = useState("");

  const [perPcsHallmark, setPerPcsHallmark] = useState("");

  const [productList, setProductList] = useState([""]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selctedroductErr, setSelctedroductErr] = useState("");

  const [image, setImage] = useState("");

  const [formatList, setFormatList] = useState([]);
  const [printerList, setPrinterList] = useState([]);
  const [systemList, setSystemList] = useState([]);

  const [addedBarcodeList, setAddedBarcodeList] = useState([]);

  const [selectedFormat, setSelectedFormat] = useState([]);

  const appContext = useContext(AppContext);
  const { selectedDepartment } = appContext;

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 5000);
    }
  }, [loading]);

  useEffect(() => {
    getFormatList();
    getPrinterList();
    getSystemList();
    getProductCatList();
    getOrderNumberList();
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Tagging-Retailer", dispatch);
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      getHallmarkCharges();
      getReferenceList(selectedOrder.value);
      getAddedBarcode(selectedOrder.value);
    }
  }, [selectedOrder]);

  useEffect(() => {
    updateFormatListArr();
  }, [selectedFormat]);

  function updateFormatListArr() {
    const arrData = [...formatList];

    arrData.map((item) => {
      if (selectedFormat.includes(item.id)) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
    setFormatList(arrData);
  }

  function getOrderNumberList() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/order/number/list")
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setOrderList(response.data.data);
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
          api: "retailerProduct/api/order/number/list",
        });
      });
  }

  function getReferenceList(oId) {
    axios
      .get(Config.getCommonUrl() + `retailerProduct/api/order/image/${oId}`)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setReferenceList(response.data.data);
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
          api: `retailerProduct/api/order/image/${oId}`,
        });
      });
  }

  function getAddedBarcode(oId) {
    axios
      .get(
        Config.getCommonUrl() +
          `retailerProduct/api/lotdetail/regenerate/barcode/read/${oId}`
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setAddedBarcodeList(response.data.data);
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
          api: `retailerProduct/api/lotdetail/regenerate/barcode/read/${oId}`,
        });
      });
  }
  function getHallmarkCharges() {
    axios
      .get(
        Config.getCommonUrl() +
          "retailerProduct/api/goldratetoday/hallmarkcharges"
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setPerPcsHallmark(response.data.data.per_piece_charges);
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
          api: "retailerProduct/api/goldratetoday/hallmarkcharges",
        });
      });
  }

  function getProductCatList() {
    axios
      .get(
        Config.getCommonUrl() + "retailerProduct/api/productcategory/list/all"
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setProductList(response.data.data);
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
          api: "retailerProduct/api/productcategory/list/all",
        });
      });
  }

  function getFormatList() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/tagformat")
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setFormatList(response.data.data);
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
        handleError(error, dispatch, { api: "retailerProduct/api/tagformat" });
      });
  }

  function getPrinterList() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/tagprinter")
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setPrinterList(response.data.data);
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
        handleError(error, dispatch, { api: "retailerProduct/api/tagprinter" });
      });
  }

  function getSystemList() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/tagsystem")
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setSystemList(response.data.data);
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
        handleError(error, dispatch, { api: "retailerProduct/api/tagsystem" });
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

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (selectedFormat.length > 0) {
      if (validateFormatArr()) {
        setOpen(false);
      }
    }
  };

  const handleProductChange = (value) => {
    setSelectedProduct(value);
    setSelctedroductErr("");
  };

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    const numRegex = /\b\d{1,4}(?:\.\d{1,3})?\b/;
    var isError = false;
    if (numRegex.test(value) === false) {
      isError = true;
    }

    if (name === "phyQty") {
      setPhyQty(value);
      setPhyQtyErr(isError ? "enter valid qty" : "");
    } else if (name === "grossWeight") {
      setGrossWeight(value);
      if(value <= 0 || numRegex.test(value) === false){
        setGrossWeightErr("Enter valid gross weight");
      }else{
        setGrossWeightErr("")
        if(netWeight && parseFloat(value) >= parseFloat(netWeight)){
          setNetWeightErr("")
        }else if(netWeight && (parseFloat(value) < parseFloat(netWeight))){
          setNetWeightErr("Enter valid net weight (it must be less or equal to gross weight)");
        }
      }
    } else if (name === "netWeight") {
      setNetWeight(value);
      if(parseFloat(value) > parseFloat(grossWeight) || numRegex.test(value) === false || value <= 0){
        setNetWeightErr("Enter valid net weight (it must be less or equal to gross weight)");
      }else{
        setNetWeightErr("")
      }
    } else if (name === "stoneWeight") {
      setStoneWeight(value);
      setStoneWeightErr(isError ? "enter valid weight" : "");
    } else if (name === "stoneAmt") {
      setStoneAmt(value);
      setStoneAmtErr(isError ? "enter valid amount" : "");
    } else if (name === "beadsWeight") {
      setBeadsWeight(value);
      setBeadsWeightErr(isError ? "enter valid weight" : "");
    } else if (name === "beadsAmt") {
      setBeadsAmt(value);
      setBeadsAmtErr(isError ? "enter valid amount" : "");
    } else if (name === "silverWeight") {
      setSilverWeight(value);
      setSilverWeightErr(isError ? "enter valid weight" : "");
    } else if (name === "silverAmt") {
      setSilverAmt(value);
      setSilverAmtErr(isError ? "enter valid amount" : "");
    } else if (name === "otherWeight") {
      setOtherWeight(value);
      setOtherWeightErr(isError ? "enter valid weight" : "");
    } else if (name === "otherAmt") {
      setOtherAmt(value);
      setOtherAmtErr(isError ? "enter valid amount" : "");
    } else if (name === "solWeight") {
      setSolWeight(value);
      setSolWeightErr(isError ? "enter valid weight" : "");
    } else if (name === "solAmt") {
      setSolAmt(value);
      setSolAmtErr(isError ? "enter valid amount" : "");
    } else if (name === "brassWeight") {
      setBrassWeight(value);
      setBrassWeightErr(isError ? "enter valid weight" : "");
    } else if (name === "brassAmt") {
      setBrassAmt(value);
      setBrassAmtErr(isError ? "enter valid amount" : "");
    } else if (name === "tagChargesRs") {
      setTagChargesRs(value);
      setTagChargesRsErr(isError ? "enter valid amount" : "");
    }
  };

  const validateFormatArr = () => {
    const res = formatList.map((item) => {
      if (item.selected) {
        if (!item.printer_id || !item.system_id) {
          dispatch(
            Actions.showMessage({
              message: "Select Printer and System for selected format",
              variant: "error",
            })
          );
          return false;
        }
      }
    });
    if (res.includes(false)) {
      return false;
    } else {
      return true;
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (!selectedOrder) {
      History.push("/dashboard/stocktaggingretailer");
    }
  };

  const handleInputFormatChange = (event) => {
    const newValue = Number(event.target.value);
    let newFormat;

    if (selectedFormat.indexOf(newValue) > -1) {
      newFormat = selectedFormat.filter((s) => s !== newValue);
    } else {
      newFormat = [...selectedFormat, newValue];
    }
    setSelectedFormat(newFormat);
  };

  const handleChangePrinter = (value) => {
    const newPrinter = [...formatList];
    newPrinter.map((item) => {
      if (item.id === value.formatId) {
        item.printer_id = value.value;
        item.printer = value;
      }
    });
    setFormatList(newPrinter);
  };

  const handleChangeSystem = (value) => {
    const newSystem = [...formatList];
    newSystem.map((item) => {
      if (item.id === value.formatId) {
        item.system_id = value.value;
        item.system = value;
      }
    });
    setFormatList(newSystem);
  };

  const handleChangeOrder = (value) => {
    setSelectedOrder(value);
    setSelectedOrderErr("");
    setSelectedReference("");
    setSelectedRefErr("");
    setImage("");
    setpurity(value.purity);
  };

  const handleRefChange = (value) => {
    console.log(value, "myyyyy");
    setSelectedReference(value);
    setSelectedRefErr("");
    setImage(value.imageURL);
  };

  const validateOrdernum = () => {
    if (selectedOrder === "") {
      setSelectedOrderErr("Select Order");
      return false;
    }
    return true;
  };

  const validateRefnum = () => {
    if (selectedReference === "") {
      setSelectedRefErr("Select Reference Number");
      return false;
    }
    return true;
  };

  const validateCategory = () => {
    if (selectedProduct === "") {
      setSelctedroductErr("Select product category");
      return false;
    }
    return true;
  };

  const validateIsError = () => {
    if (
      grossWeightErr ||
      netWeightErr ||
      stoneWeightErr ||
      stoneAmtErr ||
      beadsWeightErr ||
      beadsAmtErr ||
      silverWeightErr ||
      silverAmtErr ||
      otherWeightErr ||
      otherAmtErr ||
      solWeightErr ||
      solAmtErr ||
      brassWeightErr ||
      brassAmtErr ||
      tagChargesRsErr
    ) {
      return false;
    }
    return true;
  };

  const validatePCS = () => {
    const numregex = /^\d{1,20}$/;
    if (phyQty === "" || numregex.test(phyQty) === false || phyQty <= 0) {
      setPhyQtyErr("Enter valid Pcs");
      return false;
    }
    return true;
  };

  const validategrossWgt = () => {
    const numRegex = /\b\d{1,4}(?:\.\d{1,3})?\b/;
    if (grossWeight === "" || numRegex.test(grossWeight) === false || grossWeight <= 0) {
      setGrossWeightErr("Enter valid gross weight");
      return false;
    }
    return true;
  };

  const validatenetwgt = () => {
    const numRegex = /\b\d{1,4}(?:\.\d{1,3})?\b/;
    if (netWeight === "" || numRegex.test(netWeight) === false || netWeight <= 0 || parseFloat(netWeight) > parseFloat(grossWeight) ) {
      setNetWeightErr("Enter valid net weight (it must be less or equal to gross weight)");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      validateOrdernum() &&
      validateRefnum() &&
      validateCategory() &&
      validatePCS() &&
      validategrossWgt()&&
      validatenetwgt() &&
      validateIsError()
    ) {
      callCreateBarcodeApi();
    }
  };

  function callCreateBarcodeApi() {
    setLoading(true);
    let printerArr = [];
    formatList.map((item) => {
      if (item.selected) {
        printerArr.push({
          format_id: item.id,
          printer_id: item.printer_id,
          system_id: item.system_id,
        });
      }
    });
    const body = {
      gross_wgt: parseFloat(grossWeight).toFixed(3),
      net_wgt: parseFloat(netWeight).toFixed(3),
      purity: purity,
      stone_wgt: parseFloat(stoneWeight).toFixed(3),
      stone_amt: parseFloat(stoneAmt).toFixed(2),
      beads_wgt: parseFloat(beadsWeight).toFixed(3),
      beads_amt: parseFloat(beadsAmt).toFixed(2),
      silver_wgt: parseFloat(silverWeight).toFixed(3),
      silver_amt: parseFloat(silverAmt).toFixed(2),
      other_wgt: parseFloat(otherWeight).toFixed(3),
      other_amt: parseFloat(otherAmt).toFixed(2),
      sol_wgt: parseFloat(solWeight).toFixed(3),
      sol_amt: parseFloat(solAmt).toFixed(2),
      brass_wgt: parseFloat(brassWeight).toFixed(3),
      brass_amt: parseFloat(brassAmt).toFixed(2),
      tag_charges: parseFloat(tagChargesRs).toFixed(2),
      department_id: selectedDepartment.value.split("-")[1],
      system_print_format: printerArr,
      order_id: selectedOrder.value,
      order_image_id: selectedReference.value,
      phy_pcs: phyQty,
      product_category_id: selectedProduct.value,
    };
    console.log(body);
    axios
      .post(
        Config.getCommonUrl() +
          "retailerProduct/api/lotdetail/generate/order/barcode",
        body
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          History.push("/dashboard/stocktaggingretailer");
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
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: "retailerProduct/api/lotdetail/generate/order/barcode",
          body: body,
        });
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 lot-tabel-mainpt-20">
            {loading && <Loader />}

            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={open}
              style={{ overflow: "scroll" }}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleClose();
                }
              }}
            >
              <div
                style={modalStyle}
                className={clsx(classes.paper, "rounded-8")}
                id="modesize-dv"
              >
                <h5
                  className="popup-head mb-10"
                  style={{
                    padding: "14px",
                  }}
                >
                  Select Printer
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={handleClose}
                  >
                    <Icon style={{ color: "white" }}>close</Icon>
                  </IconButton>
                </h5>
                <div
                  className="pl-16 pr-16"
                  style={{ overflow: "auto", height: "400px" }}
                >
                  <MaUTable>
                    <TableHead>
                      <TableRow>
                        <TableCell className="tagmakinglot-th">
                          Tag Format
                        </TableCell>
                        <TableCell className="tagmakinglot-th">
                          Printer
                        </TableCell>
                        <TableCell className="tagmakinglot-th text-left padding">
                          System
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formatList &&
                        formatList.map((temp, i) => (
                          <TableRow key={i}>
                            <TableCell className="tagmakinglot-td">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    name="print"
                                    onChange={(e) => handleInputFormatChange(e)}
                                    value={temp.id}
                                    checked={
                                      temp.selected
                                        ? temp.selected
                                          ? true
                                          : false
                                        : false
                                    }
                                  />
                                }
                                label={temp.name}
                              />
                            </TableCell>
                            <TableCell className="tagmakinglot-td">
                              <label>Select printer</label>
                              <Select
                                classes={classes}
                                styles={selectStyles}
                                options={printerList.map((group) => ({
                                  value: group.id,
                                  label: group.name,
                                  formatId: temp.id,
                                }))}
                                filterOption={createFilter({
                                  ignoreAccents: false,
                                })}
                                value={temp.printer ? temp.printer : ""}
                                onChange={handleChangePrinter}
                                placeholder="select printer"
                              />
                            </TableCell>
                            <TableCell className="tagmakinglot-td text-left padding">
                              <label>Select system</label>
                              <Select
                                classes={classes}
                                styles={selectStyles}
                                options={systemList.map((group) => ({
                                  value: group.id,
                                  label: group.name,
                                  formatId: temp.id,
                                }))}
                                filterOption={createFilter({
                                  ignoreAccents: false,
                                })}
                                value={temp.system ? temp.system : ""}
                                onChange={handleChangeSystem}
                                placeholder="select system"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </MaUTable>
                </div>
                <div style={{ textAlign: "center" }} className="p-20">
                  <Button
                    variant="contained"
                    className="w-128 mx-auto popup-cancel"
                    aria-label="Register"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="contained"
                    className="w-160 mx-auto popup-save"
                    style={{ marginLeft: "20px" }}
                    aria-label="Register"
                    onClick={(e) => handleFormSubmit(e)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </Modal>

            <>
              <Grid
               container
               alignItems="center"
               style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
              >
                <Grid item xs={5} sm={4} md={4} lg={5} key="1">
                  <FuseAnimate delay={300}>
                    <Typography className="text-18 font-700">
                      Generate New Barcode
                    </Typography>
                  </FuseAnimate>
                  {/* <BreadcrumbsHelper /> */}
                </Grid>
                <Grid
                 item xs={7} sm={8} md={8} lg={7} key="2" style={{ textAlign: "right" }}
                >
                  <div className="btn-back pt-2">
                    {" "}
                    <Button
                      id="btn-back"
                      size="small"
                      onClick={() => {
                        History.push("/dashboard/stocktaggingretailer");
                      }}
                    >
                      <img className="back_arrow" src={Icones.arrow_left_pagination} alt="" />
                      Back
                    </Button>
                  </div>
                  <Button
                    variant="contained"
                    className={classes.button}
                    size="small"
                    style={{
                      backgroundColor: "#415BD4",
                      border: "none",
                      color: "white",
                      marginRight:"10px"
                    }}
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    Change Tag style
                  </Button>
                </Grid>
              </Grid>

              <div className="main-div-alll">
                <div className="m-16 tagmarking-fullwidth">
                  <Grid container spacing={3}>
                    <Grid
                      item
                      xs={3}
                      style={{ padding: 10, paddingInline: "12px" }}
                    >
                      <label>Select Order Number</label>
                      <Select
                        className="mt-1"
                        classes={classes}
                        styles={selectStyles}
                        options={orderList.map((optn) => ({
                          value: optn.id,
                          label: optn.order_number,
                          purity: optn.purity,
                        }))}
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        value={selectedOrder}
                        onChange={handleChangeOrder}
                        placeholder="Select Order no"
                      />
                      <span style={{ color: "red" }}>
                        {selectedOrderErr.length > 0 ? selectedOrderErr : ""}
                      </span>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ padding: 10, paddingInline: "12px" }}
                    >
                      <label>Select Reference Number</label>
                      <Select
                        className="mt-1"
                        classes={classes}
                        styles={selectStyles}
                        options={referenceList.map((optn) => ({
                          value: optn.id,
                          label: optn.reference_name,
                          imageURL: optn.imageURL,
                        }))}
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        value={selectedReference}
                        onChange={handleRefChange}
                        placeholder="Select reference no"
                      />
                      <span style={{ color: "red" }}>
                        {selectedRefErr.length > 0 ? selectedRefErr : ""}
                      </span>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ padding: 10, paddingInline: "12px" }}
                    >
                      <label>Purity / Karat</label>
                      <TextField
                        className="mt-1"
                        placeholder="Purity"
                        name="purity"
                        value={purity}
                        disabled
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ padding: 10, paddingInline: "12px" }}
                    >
                      <label>Select Product Category</label>
                      <Select
                        className="mt-1"
                        classes={classes}
                        styles={selectStyles}
                        options={productList.map((optn) => ({
                          value: optn.id,
                          label: optn.category_name,
                        }))}
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        value={selectedProduct}
                        onChange={handleProductChange}
                        placeholder="Select product category"
                      />
                      <span style={{ color: "red" }}>
                        {selctedroductErr.length > 0 ? selctedroductErr : ""}
                      </span>
                    </Grid>
                  </Grid>
                </div>

                <Grid container spacing={3}>
                  <Grid className="tabel-left-width-dv" style={{ padding: 10 }}>
                    <Grid item xs={12} style={{ padding: 0 }}>
                      <div className="m-16 tagmarking-fullwidth">
                        <Grid container spacing={3}>
                          <Grid
                            item
                            xs={4}
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Per piece hallmark charge</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter phy qty"
                              name="perPcsHallmark"
                              value={perPcsHallmark}
                              disabled
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Phy qty</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter phy qty"
                              name="phyQty"
                              value={phyQty}
                              error={phyQtyErr.length > 0 ? true : false}
                              helperText={phyQtyErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Total hallmark charges</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter phy qty"
                              name="total"
                              value={parseFloat(
                                perPcsHallmark * phyQty
                              ).toFixed(3)}
                              disabled
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            className="mt-6"
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Gross weight</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter gross weight"
                              name="grossWeight"
                              value={grossWeight}
                              error={grossWeightErr.length > 0 ? true : false}
                              helperText={grossWeightErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            className="mt-6"
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Net weight</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter net weight"
                              name="netWeight"
                              value={netWeight}
                              error={netWeightErr.length > 0 ? true : false}
                              helperText={netWeightErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            className="mt-6"
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Stone weight</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter stone wgt"
                              name="stoneWeight"
                              value={stoneWeight}
                              error={stoneWeightErr.length > 0 ? true : false}
                              helperText={stoneWeightErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            className="mt-6"
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Stone Amount</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter stone amount"
                              name="stoneAmt"
                              value={stoneAmt}
                              error={stoneAmtErr.length > 0 ? true : false}
                              helperText={stoneAmtErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            className="mt-6"
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Beads weight</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter beads wgt"
                              name="beadsWeight"
                              value={beadsWeight}
                              error={beadsWeightErr.length > 0 ? true : false}
                              helperText={beadsWeightErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            className="mt-6"
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Beads Amount</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter beads amount"
                              name="beadsAmt"
                              value={beadsAmt}
                              error={beadsAmtErr.length > 0 ? true : false}
                              helperText={beadsAmtErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            className="mt-6"
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Silver weight</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter silver wgt"
                              name="silverWeight"
                              value={silverWeight}
                              error={silverWeightErr.length > 0 ? true : false}
                              helperText={silverWeightErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            className="mt-6"
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Silver Amount</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter silver amount"
                              name="silverAmt"
                              value={silverAmt}
                              error={silverAmtErr.length > 0 ? true : false}
                              helperText={silverAmtErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            className="mt-6"
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Other weight</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter other wgt"
                              name="otherWeight"
                              value={otherWeight}
                              error={otherWeightErr.length > 0 ? true : false}
                              helperText={otherWeightErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            className="mt-6"
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Other Amount</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter other amount"
                              name="otherAmt"
                              value={otherAmt}
                              error={otherAmtErr.length > 0 ? true : false}
                              helperText={otherAmtErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            className="mt-6"
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Sol weight</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter sol wgt"
                              name="solWeight"
                              value={solWeight}
                              error={solWeightErr.length > 0 ? true : false}
                              helperText={solWeightErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            className="mt-6"
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>sol Amount</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter sol amount"
                              name="solAmt"
                              value={solAmt}
                              error={solAmtErr.length > 0 ? true : false}
                              helperText={solAmtErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            className="mt-6"
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Brass weight</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter brass wgt"
                              name="brassWeight"
                              value={brassWeight}
                              error={brassWeightErr.length > 0 ? true : false}
                              helperText={brassWeightErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            className="mt-6"
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Brass Amount</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter brass amount"
                              name="brassAmt"
                              value={brassAmt}
                              error={brassAmtErr.length > 0 ? true : false}
                              helperText={brassAmtErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            className="mt-6"
                            style={{ padding: 10, paddingInline: "12px" }}
                          >
                            <label>Tag charges RS</label>
                            <TextField
                              className="mt-1"
                              placeholder="Enter tag charges"
                              name="tagChargesRs"
                              value={tagChargesRs}
                              error={tagChargesRsErr.length > 0 ? true : false}
                              helperText={tagChargesRsErr}
                              onChange={(e) => handleInputChange(e)}
                              variant="outlined"
                              fullWidth
                            />
                          </Grid>
                        </Grid>
                      </div>
                    </Grid>
                  </Grid>
                  <Grid className="image_div">
                    <img src={image} />
                  </Grid>
                  <Grid className="mix-savebtn-mr">
                    <Button
                      id="savebtn-mr"
                      variant="contained"
                      className={classes.button}
                      size="small"
                      style={{
                        backgroundColor: "#415BD4",
                        border: "none",
                        color: "white",
                      }}
                      onClick={(e) => handleSubmit(e)}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
                {
                  addedBarcodeList.length > 0 &&   <div className="ReGenBarcode-tbl-dv mt-16">
                  <Paper className={classes.tabroot}>
                    <div className="table-responsive inner-ReGenBarcode-tbl-dv">
                      <MaUTable className={classes.table}>
                        <TableHead>
                          <TableRow>
                          <TableCell className={classes.tableRowPad}>
                              Order No
                            </TableCell>
                          <TableCell className={classes.tableRowPad}>
                              Barcode No
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Reference Name
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Category
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Purity
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Phy Pcs
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Gross weight
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Net weight
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            addedBarcodeList.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className={classes.tableRowPad}>
                                {item?.OrderImage?.OrderData?.order_number}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.BarCodeProduct?.barcode}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.OrderImage?.reference_name}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.ProductCategories?.category_name}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.OrderImage?.OrderData?.purity}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.phy_pcs}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.gross_wgt}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.net_wgt}
                              </TableCell>
                            </TableRow>
                              
                            ))
                          }
                        </TableBody>
                      </MaUTable>
                    </div>
                  </Paper>
                </div>
                }
              </div>
            </>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default GenerateBarcode;

import React, { useState, useEffect, useContext } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  Checkbox,
  TextField,
  Icon,
  IconButton,
  FormControlLabel,
} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Select, { createFilter } from "react-select";
import History from "@history";
import axios from "axios";
import * as Actions from "app/store/actions";
import Config from "app/fuse-configs/Config";
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
    // margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
    width: "30% !important",
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

const RegenerateBarcode = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [barcodeNum, setBarcodeNum] = useState("");
  const [barcodeNumErr, setBarcodeNumErr] = useState("");

  const [lotArray, setLotArr] = useState([]);
  const [lotId, setLotId] = useState("");
  const [grossWeight, setGrossWeight] = useState("");
  const [grossWeightErr, setGrossWeightErr] = useState("");

  const [netWeight, setNetWeight] = useState("");
  const [netWeightErr, setNetWeightErr] = useState("");

  const [salesPrice, setsalesPrice] = useState("");
  const [salesPriceErr, setsalesPriceErr] = useState("");

  const [variantNum, setVariantNum] = useState("");
  const [image, setImage] = useState([]);
  const [variantData, setVariantData] = useState("");
  const [modalView, setModalView] = useState(false);
  const [variantTotalWeight, setVariantTotalWeight] = useState(0);
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const [jsonErr, setJsonErr] = useState("");
  const appContext = useContext(AppContext);
  const [formatList, setFormatList] = useState([]);
  const [printerList, setPrinterList] = useState([]);
  const [systemList, setSystemList] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState([]);

  const [productList, setProductList] = useState([""]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selctedroductErr, setSelctedroductErr] = useState("");

  const { selectedDepartment } = appContext;

  useEffect(() => {
    NavbarSetting("Tagging-Retailer", dispatch);
  }, []);

  useEffect(() => {
    updateFormatListArr();
  }, [selectedFormat]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (validateBarcodeNum()) {
      callBarcodeDetailsApi(barcodeNum);
      getProductCatList()
    }
  };

  function callBarcodeDetailsApi(barcodeInput) {
    const barcodeId = barcodeInput.toString().replace(/ /g, "");
    axios
      .get(
        Config.getCommonUrl() +
          `retailerProduct/api/lotdetail/scan/product/${barcodeId}/${selectedDepartment.value.split("-")[1]}`
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setOpen(false);
            const arrData = res.data.data.mydata.LotDetails;
            console.log(arrData);
            setLotId(arrData.id);
            setGrossWeight(arrData.gross_wgt);
            setNetWeight(arrData.net_wgt);
          setsalesPrice(arrData.sales_price);
            setLotArr(arrData);
            setImage(arrData?.OrderImage?.imageURL)
            const resData = JSON.parse(arrData.details_json);
            setVariantData({
              "Stone Weight" : resData['Stone Weight'] ? resData['Stone Weight'] : 0.000,
              "Stone Amount"  : resData['Stone Amt'] ? resData['Stone Amt'] : 0.00,
              "Beads Weight" : resData['Beads Weight'] ? resData['Beads Weight'] : 0.000,
              "Beads Amount" : resData['Beads Amt'] ? resData['Beads Amt'] : 0.00,
              "Silver Weight" : resData['Silver Weight'] ? resData['Silver Weight'] : 0.000,
              "Silver Amount"  : resData['Silver Amt'] ? resData['Silver Amt'] : 0.00,
              "Others Weight" : resData['Others Weight'] ? resData['Others Weight'] : 0.000,
              "Others Amount" : resData['Others Amt'] ? resData['Others Amt'] : 0.00,
              "Sol Weight" : resData['Sol Weight'] ? resData['Sol Weight'] : 0.000,
              "Sol Amount" : resData['Sol Amt'] ? resData['Sol Amt'] : 0.00,
              "Brass Weight" : resData['Brass Weight'] ? resData['Brass Weight'] : 0.000,
              "Brass Amount" : resData['Brass Amt'] ? resData['Brass Amt'] : 0.00,
              "Tag charges RS" : resData['Tag charges RS'] ? resData['Tag charges RS'] : 0.00
            });
            setVariantNum(res.data.data.mydata.barcode);
            setSelectedProduct({
              value : arrData?.ProductCategories?.id,
              label : arrData?.ProductCategories?.category_name
            })
        } else {
          setOpen(true);
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `retailerProduct/api/lotdetail/scan/product/${barcodeId}/${selectedDepartment.value.split("-")[1]}`
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

  function validateBarcodeNum() {
    if (barcodeNum === "") {
      setBarcodeNumErr("Please scan barcode");
      return false;
    }
    return true;
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

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "grossWeight") {
      if (!isNaN(Number(value)) && value.length < 9) {
        setGrossWeight(value);
        setGrossWeightErr("");
      }
    } else if (name === "netWeight") {
      if (!isNaN(Number(value)) && value.length < 9) {
        setNetWeight(value);
        if(parseFloat(value) > parseFloat(grossWeight)){
          setNetWeightErr("Enter valid weight (it must be less or equal to gross weight)");
        }else {
          setNetWeightErr("");
        }
      }
    }
    if (name === "salesPrice") {
      if (!isNaN(Number(value)) && value.length < 9) {
        setsalesPrice(value);
        setsalesPriceErr("");
      }
    }
  };

  function validateGrossWeight() {
    if (grossWeight === "" || grossWeight == 0) {
      setGrossWeightErr("Enter Valid Gross Weight");
      return false;
    }
    return true;
  }

  function validateSalesPrice() {
    if (salesPrice === "" || salesPrice == 0) {
      setsalesPriceErr("Enter Valid Gross Weight");
      return false;
    }
    return true;
  }

  function validateNetWgt() {
    if (netWeight === "" || netWeight == 0 || parseFloat(netWeight) > parseFloat(grossWeight)) {
      setNetWeightErr("Enter valid weight (it must be less or equal to gross weight)");
      return false;
    }
    return true;
  }

  function validateJsonObject() {
    let res = true;
    console.log(variantData,"aaraaaayyyyy")
    Object.entries(variantData).map(([key, value]) => {
      if (value === "") {
        setJsonErr(`${key} should not be empty`);
        res = false;
      }
    });
    return res;
  }

  const handleDataSubmit = (print) => {
    if (validateCategory() && validateGrossWeight() && validateNetWgt() && validateJsonObject() && validateSalesPrice()) {
      if (print) {
        getFormatList();
        getPrinterList();
        getSystemList();
        setOpenPrintModal(true);
      } else {
        callUpdateRegenrateApi();
      }
    }
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

  function getFormatList() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/tagformat")
      .then((response) => {
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

  function getPrinterList() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/tagprinter")
      .then((response) => {
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

  function ValidateCheckObj() {
    let resData = false;
    formatList.map((temp) => {
      if (temp.selected) {
        resData = true;
      }
    });
    if (!resData) {
      dispatch(
        Actions.showMessage({
          message: "Select any Format for print",
          variant: "error",
        })
      );
    }
    return resData;
  }

  function ValidatePrintObj() {
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
  }

  const validateCategory = () => {
    if (selectedProduct === "") {
      setSelctedroductErr("Select product category");
      return false;
    }
    return true;
  };

  function handlePrintSaveSubmit() {
    if (ValidateCheckObj() && ValidatePrintObj()) {
      callUpdateRegenrateApi();
    }
  }

  function callUpdateRegenrateApi() {
    let printerArr = [];

    if (openPrintModal) {
      formatList.map((item) => {
        if (item.selected) {
          printerArr.push({
            format_id: item.id,
            printer_id: item.printer_id,
            system_id: item.system_id,
          });
        }
      });    }
    const body = {
      stone_wgt : variantData['Stone Weight'],
      stone_amt  : variantData['Stone Amount'],
      beads_wgt : variantData['Beads Weight'],
      beads_amt : variantData['Beads Amount'],
      silver_wgt : variantData['Silver Weight'],
      silver_amt  : variantData['Silver Amount'],
      other_wgt : variantData['Others Weight'],
      other_amt : variantData['Others Amount'],
      sol_wgt : variantData['Sol Weight'],
      sol_amt : variantData['Sol Amount'],
      brass_wgt : variantData['Brass Weight'],
      brass_amt : variantData['Brass Amount'],
      tag_charges : variantData['Tag charges RS'],
      net_wgt : netWeight,
      gross_wgt : grossWeight,
      sales_price: salesPrice,
      system_print_format : printerArr,
      product_category_id: selectedProduct.value,
    };
    console.log(body)
    axios
      .put(
        Config.getCommonUrl() +
          `retailerProduct/api/lotdetail/regenerate/update/${lotId}/${barcodeNum}`,
        body
      )
      .then(function (response) {
        console.log(response);
        if(response.data.success) {
          console.log("innnnnnn")
        dispatch(
          Actions.showMessage({
            message: response.data.message,
            variant: "success",
          })
        );
        History.push("/dashboard/stocktaggingretailer");

        // if (openPrintModal) {
        //   setOpenPrintModal(false);
        //   dispatch(
        //     Actions.showMessage({
        //       message: response.data.message,
        //       variant: "success",
        //     })
        //   );
        // } 
        }
        else {
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
          api: `retailerProduct/api/lotdetail/regenerate/update/${lotId}/${barcodeNum}`,
          body: body,
        });
      });
  }
  const handleClose = () => {
    setOpen(false);
    History.push("/dashboard/stocktaggingretailer");
  };

  const handleChangeJson = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const variantArr = { ...variantData };

    if (value.length < 9 && !isNaN(Number(value))) {
      variantArr[name] = value;
    }
    setVariantData(variantArr);
    setJsonErr("");
  };

  const handleProductChange = (value) => {
    setSelectedProduct(value);
    setSelctedroductErr("");
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
              <Grid item xs={9} sm={4} md={4} lg={5} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Re- Generate Barcode
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
              <Grid
               item xs={3} sm={8} md={8} lg={7} key="2"
                style={{ textAlign: "right" }}
              >
                <div className="btn-back">
                  {" "}
                  <Button
                    id="btn-back"
                    className=""
                    size="small"
                    onClick={() => {
                      History.push("/dashboard/stocktaggingretailer");
                    }}
                  >
                    <img className="back_arrow" src={Icones.arrow_left_pagination} alt="" />
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>

            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={open}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleClose();
                }
              }}
            >
              <div
                style={modalStyle}
                className={clsx(classes.paper, "rounded-8 w-512")}
              >
                <h5
                  className="popup-head mb-10"
                  style={{
                    padding: "14px",
                  }}
                >
                  Barcode
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={handleClose}
                  >
                    <Icon style={{ color: "white" }}>close</Icon>
                  </IconButton>
                </h5>
                <div className="p-5 pl-24 pr-24">
                  <label>Add Scan / Barcode</label>
                  <TextField
                    className=""
                    placeholder="Enter scan / barcode"
                    name="barcodeNum"
                    autoFocus
                    value={barcodeNum}
                    error={barcodeNumErr.length > 0 ? true : false}
                    helperText={barcodeNumErr}
                    onChange={(e) => {
                      setBarcodeNum(e.target.value);
                      setBarcodeNumErr("");
                    }}
                    variant="outlined"
                    fullWidth
                  />
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
            <div className="main-div-alll">
              <div className="ReGenBarcode-tbl-dv">
                <Paper className={classes.tabroot}>
                  <div className="table-responsive inner-ReGenBarcode-tbl-dv">
                    <MaUTable className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>
                            BarCode No
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Order No
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Reference Name
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Purity
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Phy Pcs
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Gross Weight
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Net Weight
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Sales Price
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {lotArray.length !== 0 && (
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                            {variantNum}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray?.OrderImage?.OrderData?.order_number}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray?.OrderImage?.reference_name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray.purity ? lotArray.purity : ""}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray.phy_pcs ? lotArray.phy_pcs : ""}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray.gross_wgt ? lotArray.gross_wgt : ""}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray.net_wgt ? lotArray.net_wgt : ""}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray.sales_price ? lotArray.sales_price : ""}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </MaUTable>
                  </div>
                </Paper>
              </div>

              <div className="mt-52">
                <Grid container spacing={3}>
                  <Grid
                    className="regenbarcode-main-image_dv"
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                  >
                    <Grid className="img-box-blg-main_left regenbarcode-main-image_left">
                      <Grid
                        className="img-box-blg-dv"
                        style={{ backgroundColor: "gray", padding: 20 }}
                      >
                        {image && (
                          <img
                            src={image}
                          />
                        )}
                      </Grid>
                    </Grid>
                    <Grid className="img-box-blg-main_right regenbarcode-input-dv">
                      <Grid>
                    <label>Select Product Category</label>
                      <Select
                        className="mb-5"
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
                    <Grid className="mb-5">
                      <label>Gross weight</label>
                      <TextField
                        className="mb-5"
                        name="grossWeight"
                        placeholder="Enter gross weight"
                        value={grossWeight}
                        error={grossWeightErr.length > 0 ? true : false}
                        helperText={grossWeightErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                      />
                      </Grid>
                      <Grid className="mb-5">
                      <label>Net weight</label>
                      <TextField
                        className="mb-5"
                        name="netWeight"
                        placeholder="Enter net weight"
                        value={netWeight}
                        error={netWeightErr.length > 0 ? true : false}
                        helperText={netWeightErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                      />
                      </Grid>
                      <Grid className="mb-5">
                        <label>Sales Price</label>
                        <TextField
                          className="mb-5"
                          name="salesPrice"
                          placeholder="Enter sales price"
                          value={salesPrice}
                          error={salesPriceErr.length > 0 ? true : false}
                          helperText={salesPriceErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          fullWidth
                        />
                      </Grid>
                      <Button
                        variant="contained"
                        size="small"
                        className={clsx(classes.button)}
                        onClick={(e) => {
                          setModalView(true);
                        }}
                      >
                       Edit Details
                      </Button>
                      <span style={{ color: "red" }}>
                        {jsonErr.length > 0 ? jsonErr : ""}
                      </span>
                      <Button
                        variant="contained"
                        className={clsx(classes.button, "Button responsive")}
                        size="small"
                        onClick={() => handleDataSubmit(false)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="contained"
                        className={clsx(
                          classes.button,
                          "Button responsive SavePrint_btn"
                        )}
                        size="small"
                        onClick={() => handleDataSubmit(true)}
                      >
                        Save & Print
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </div>
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={modalView}
              style={{ overflow: "scroll" }}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  setModalView(false);
                }
              }}
            >
              <div
                style={modalStyle}
                className={clsx(classes.paper, "rounded-8")}
              >
                <h5
                  className="popup-head mb-10"
                  style={{
                    padding: "14px",
                  }}
                >
                  Details
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={() => setModalView(false)}
                  >
                    <Icon style={{ color: "white" }}>close</Icon>
                  </IconButton>
                </h5>
                <div className="p-5 pl-16 pr-16 regenbarcode-model-popup-dv">
                  <div className="inner-regenbarcode-model-popup">
                    <MaUTable className={classes.table}>
                      <TableBody>
                        {Object.entries(variantData).map(
                          ([key, value], index) => (
                            <TableRow key={index}>
                              <TableCell className={classes.tableRowPad}>
                                {key}
                              </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  <TextField
                                    name={key}
                                    value={value}
                                    onChange={(e) => handleChangeJson(e)}
                                  />
                                </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </MaUTable>
                  </div>
                </div>
              </div>
            </Modal>
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={openPrintModal}
              style={{ overflow: "scroll" }}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  setOpenPrintModal(false);
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
                    onClick={() => setOpenPrintModal(false)}
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
                    onClick={(e) => setOpenPrintModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    className="w-160 mx-auto popup-save"
                    style={{ marginLeft: "20px" }}
                    aria-label="Register"
                    onClick={(e) => handlePrintSaveSubmit(e)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default RegenerateBarcode;

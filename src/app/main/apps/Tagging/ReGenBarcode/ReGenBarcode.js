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

const ReGenBarcode = (props) => {
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

  const [variantNum, setVariantNum] = useState("");
  const [image, setImage] = useState([]);
  const [variantData, setVariantData] = useState("");
  const [jsonObj, setJsonObj] = useState("");
  const [modalView, setModalView] = useState(false);
  const [variantTotalWeight, setVariantTotalWeight] = useState(0);
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const [jsonErr, setJsonErr] = useState("");
  const appContext = useContext(AppContext);
  const [formatList, setFormatList] = useState([]);
  const [printerList, setPrinterList] = useState([]);
  const [systemList, setSystemList] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState([]);
  const [fromExcel, setFromExcel] = useState(false);

  const { selectedDepartment } = appContext;

  useEffect(() => {
    if (grossWeight > 0 && !fromExcel) {
      callNetWeightcalculation();
    }
  }, [grossWeight]);

  useEffect(() => {
    NavbarSetting("Tagging", dispatch);
  }, []);

  useEffect(() => {
    updateFormatListArr();
  }, [selectedFormat]);

  function callNetWeightcalculation() {
    if (grossWeight !== "" && variantTotalWeight !== "" && grossWeight >= 0) {
      var qtyWiseWeight = grossWeight - variantTotalWeight;
      if (qtyWiseWeight <= 0) {
        setGrossWeightErr(
          "Net Weight should not be negative , so enter valid Gross Weight or phy qty"
        );
      } else {
        setNetWeight(parseFloat(qtyWiseWeight).toFixed(3));
      }
    } else {
      setNetWeight(0);
      setGrossWeightErr("Enter valid gross weight");
    }
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (validateBarcodeNum()) {
      callBarcodeDetailsApi(barcodeNum);
    }
  };

  function callBarcodeDetailsApi(barcodeInput) {
    const barcodeId = barcodeInput.toString().replace(/ /g, "");
    axios
      .get(
        Config.getCommonUrl() +
          `api/lotdetail/scan/product/${barcodeId}/${
            selectedDepartment.value.split("-")[1]
          }`
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setOpen(false);
          if (res.data.data[0].length > 0) {
            const arrData = res.data.data[0][0];
            setLotId(arrData.id);
            setGrossWeight(arrData.gross_wgt);
            setNetWeight(arrData.net_wgt);
            setLotArr(arrData);
            setFromExcel(arrData.batch_number === "" ? true : false);
            setJsonObj(arrData.details_json);
            const resData = JSON.parse(arrData.details_json);
            setVariantData(resData);
            setVariantTotalWeight(resData["Total Weight"]);
            setVariantNum(resData["Variant"]);
            setImage(res.data.DesignImagesGet);
          } else {
            setOpen(true);
            dispatch(
              Actions.showMessage({
                message: "This lot is from different Department",
                variant: "error",
              })
            );
          }
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/lotdetail/scan/product/${barcodeId}/${
            selectedDepartment.value.split("-")[1]
          }`,
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
        setNetWeightErr("");
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

  function validateNetWgt() {
    if (fromExcel) {
      if (netWeight === "" || netWeight == 0) {
        setNetWeightErr("Enter Valid Net Weight");
        return false;
      }
      return true;
    } else {
      return true;
    }
  }

  function validateJsonObject() {
    let res = true;
    Object.entries(variantData).map(([key, value]) => {
      if (value === "") {
        setJsonErr(`${key} should not be empty`);
        res = false;
      }
    });
    return res;
  }

  const handleDataSubmit = (print) => {
    if (validateGrossWeight() && validateNetWgt() && validateJsonObject()) {
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
      .get(Config.getCommonUrl() + "api/tagformat")
      .then((response) => {
        dispatch(
          Actions.showMessage({
            message: response.data.message,
            variant: "success",
          })
        );
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
        handleError(error, dispatch, { api: "api/tagformat" });
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
      .get(Config.getCommonUrl() + "api/tagprinter")
      .then((response) => {
        dispatch(
          Actions.showMessage({
            message: response.data.message,
            variant: "success",
          })
        );
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
        handleError(error, dispatch, { api: "api/tagprinter" });
      });
  }

  function getSystemList() {
    axios
      .get(Config.getCommonUrl() + "api/tagsystem")
      .then((response) => {
        dispatch(
          Actions.showMessage({
            message: response.data.message,
            variant: "success",
          })
        );
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
        handleError(error, dispatch, { api: "api/tagsystem" });
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

  function handlePrintSaveSubmit() {
    if (ValidateCheckObj() && ValidatePrintObj()) {
      callUpdateRegenrateApi();
    }
  }

  function callUpdateRegenrateApi() {
    const body = {
      variantData,
    };
    body.variantData["net_wgt"] = netWeight;
    body.variantData["gross_wgt"] = grossWeight;
    if (openPrintModal) {
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
      body.variantData["system_print_format"] = printerArr;
    }

    axios
      .put(
        Config.getCommonUrl() +
          `api/lotdetail/regenerate/update/${lotId}/${barcodeNum}`,
        body.variantData
      )
      .then(function (response) {
        console.log(response);
        dispatch(
          Actions.showMessage({
            message: response.data.message,
            variant: "success",
          })
        );
        if (openPrintModal) {
          setOpenPrintModal(false);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          History.push("/dashboard/stock");
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
          api: `api/lotdetail/regenerate/update/${lotId}/${barcodeNum}`,
          body: body.variantData,
        });
      });
  }
  const handleClose = () => {
    setOpen(false);
    History.push("/dashboard/stock");
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

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="department-tbl-mt-dv pb-12"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Re- Generate Barcode
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                md={9}
                key="2"
                style={{ textAlign: "right" }}
              >
                {/* <Button
                  variant="contained"
                  className={classes.button}
                  style={{
                    backgroundColor: "gray",
                    border: "none",
                    color: "white",
                  }}
                  size="small"
                  onClick={() => { History.push('/dashboard/stock') }}
                >
                  Back
                </Button> */}

                <div className="btn-back">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    className=""
                    size="small"
                    onClick={() => {
                      History.push("/dashboard/stock");
                    }}
                  >
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
                            Design No
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Batch No
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Lot No
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
                          {/* <TableCell className={classes.tableRowPad}>Other Weight</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {lotArray.length !== 0 ? (
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray.barcode}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {variantNum}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray.batch_number
                                ? lotArray.batch_number
                                : ""}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray.lot_no ? lotArray.lot_no : ""}
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
                            {/* <TableCell className={classes.tableRowPad}>
                              {lotArray.other_wgt ? lotArray.other_wgt : 0}
                            </TableCell> */}
                          </TableRow>
                        ) : (
                          ""
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
                    {/* {image.map((imgs)=>( */}
                    <Grid className="img-box-blg-main_left regenbarcode-main-image_left">
                      <Grid
                        className="img-box-blg-dv"
                        style={{ backgroundColor: "gray", padding: 20 }}
                      >
                        {image.length > 0 && (
                          <img
                            src={`${Config.getS3Url()}vkjdev/design/image/${
                              image[0].image_file
                            }`}
                          />
                        )}
                      </Grid>
                    </Grid>
                    {/* ))} */}

                    <Grid className="img-box-blg-main_right regenbarcode-input-dv">
                      <label>Gross weight</label>
                      <TextField
                        className=" mb-5"
                        name="grossWeight"
                        placeholder="Enter gross weight"
                        value={grossWeight}
                        error={grossWeightErr.length > 0 ? true : false}
                        helperText={grossWeightErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                      />
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
                        disabled={!fromExcel}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        className={clsx(classes.button)}
                        onClick={(e) => {
                          setModalView(true);
                        }}
                      >
                        Details
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
                              {index === 0 || index === 1 ? (
                                <TableCell className={classes.tableRowPad}>
                                  {" "}
                                  {value}
                                </TableCell>
                              ) : (
                                <TableCell className={classes.tableRowPad}>
                                  <TextField
                                    name={key}
                                    value={value}
                                    onChange={(e) => handleChangeJson(e)}
                                  />
                                </TableCell>
                              )}
                            </TableRow>
                          )
                        )}
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
                  className="p-5 pl-16 pr-16 regenbarcode-model-popup-dv"
                  style={{ overflow: "auto", height: "500px" }}
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
                        <TableCell className="tagmakinglot-th">
                          <span className="float-left"> System </span>
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

                              {/* <span style={{ color: "red" }}>
                                  {underGroupErrTxt.length > 0 ? underGroupErrTxt : ""}
                                  </span> */}
                            </TableCell>
                            <TableCell className="tagmakinglot-td text-left padding">
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

                              {/* <span style={{ color: "red" }}>
                                  {underGroupErrTxt.length > 0 ? underGroupErrTxt : ""}
                                  </span> */}
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

export default ReGenBarcode;

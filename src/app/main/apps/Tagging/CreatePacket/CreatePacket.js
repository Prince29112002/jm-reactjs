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
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
import {
  Checkbox,
  TextField,
  Icon,
  IconButton,
  FormControlLabel,
} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import History from "@history";
import axios from "axios";
import * as Actions from "app/store/actions";
import Config from "app/fuse-configs/Config";
import AppContext from "app/AppContext";
import Select, { createFilter } from "react-select";
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
    tableLayout: "auto",
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

const CreatePacket = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [groupCat, setGroupCat] = useState("");
  const [groupCatErr, setGroupCatErr] = useState("");

  const [subCatVariant, setSubCatVariant] = useState("");
  const [subCatVariantErr, setSubCatVariantErr] = useState("");

  const [groupCatList, setGroupCatList] = useState([]);
  const [subVariantCatList, setSubVariantList] = useState([]);

  const [viewGroup, setViewGroup] = useState("");
  const [viewSubGroup, setViewSubGroup] = useState("");
  const [selectedFormat, setSelectedFormat] = useState([]);

  const [totalLot, setTotalLot] = useState([]);

  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodeDetails, setBarcodeDetails] = useState([]);
  const [totalPcs, setTotalPcs] = useState(0);
  const [totalGross, setTotalGross] = useState(0.0);
  const [totalNet, setTotalNet] = useState(0.0);
  const [totalStone, setTotalStone] = useState(0.0);
  const [totalOtherWgt, setTotalOtherWgt] = useState(0.0);
  const [hallMarkCharge, setHallMarkCharge] = useState("");
  const [openPrintModal, setOpenPrintModal] = useState(false);

  const [formatList, setFormatList] = useState([]);
  const [printerList, setPrinterList] = useState([]);
  const [systemList, setSystemList] = useState([]);

  const appContext = useContext(AppContext);

  const { selectedDepartment } = appContext;

  useEffect(() => {
    getGroupCatList();
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Tagging", dispatch);
  }, []);

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
  function getGroupCatList() {
    axios
      .get(Config.getCommonUrl() + "api/productcategory/common/sub/category")
      .then((res) => {
        console.log(res);
        setGroupCatList(res.data.data);
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/productcategory/common/sub/category",
        });
      });
  }

  function getSubCatVariantList(id) {
    axios
      .get(
        Config.getCommonUrl() + `api/productcategory/sub/parent/category/${id}`
      )
      .then((res) => {
        console.log(res);
        setSubVariantList(res.data.data);
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/productcategory/sub/parent/category/${id}`,
        });
      });
  }

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "barcodeInput") {
      setBarcodeInput(value);
      if (value !== "") {
        callScanBarcodeDetails(value);
      }
    }
  };

  function callScanBarcodeDetails(barcodeInput) {
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
          const temp = [...barcodeDetails];
          const lotId = [...totalLot];
          if (res.data.data.length > 0 && res.data.data[0].length > 0) {
            const data = res.data.data[0];
            if (!lotId.includes(data[0].id) && data[0].is_scan === 0) {
              data.map((arr) => {
                temp.push(arr);
                lotId.push(arr.id);
              });
              setBarcodeDetails(temp);
              setBarcodeInput("");
              callAddition(temp);
              setTotalLot(lotId);
            } else {
              dispatch(
                Actions.showMessage({
                  message: "This barcode is already added",
                  variant: "error",
                })
              );
            }
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
  const callAddition = (temp) => {
    if (temp.length > 0) {
      var pcsTotal = 0;
      // var stoneWgt = 0;
      var netWgt = 0;
      var grossWgt = 0;
      // var otherWgt = 0;
      temp.map((item) => {
        pcsTotal += parseFloat(item.phy_pcs, 2);
        netWgt += parseFloat(item.net_wgt, 2);
        grossWgt += parseFloat(item.gross_wgt, 2);
        // stoneWgt += parseFloat(item.stone_wgt,2)
        // otherWgt += parseFloat(item.other_wgt,2)
      });
      setTotalPcs(isNaN(pcsTotal) ? 0 : pcsTotal);
      setTotalNet(netWgt);
      setTotalGross(grossWgt);
      // setTotalStone(stoneWgt);
      // setTotalOtherWgt(otherWgt);
    } else {
      setTotalPcs(0);
      setTotalNet(0);
      setTotalGross(0);
      // setTotalStone(0);
      // setTotalOtherWgt(0);
    }
  };

  const handleSubCatVariant = (value) => {
    setSubCatVariant(value);
    setSubCatVariantErr("");
  };

  const handleGroupCat = (value) => {
    setGroupCat(value);
    setGroupCatErr("");
    if (value === null) {
      setSubCatVariant("");
      setSubVariantList([]);
    } else {
      getSubCatVariantList(value.value);
    }
  };

  function validatecat() {
    if (groupCat === "" || groupCat === null) {
      setGroupCatErr("Select Group Category");
      return false;
    }
    return true;
  }

  function validateVariatnt() {
    if (subCatVariant === "" || subCatVariant === null) {
      setSubCatVariantErr("Select Category variant");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (validatecat() && validateVariatnt()) {
      setOpen(false);
      setViewGroup(groupCat.label);
      setViewSubGroup(subCatVariant.label);
    }
  };

  const handleClose = () => {
    setOpen(false);
    History.push("/dashboard/stock");
  };
  function getFormatList() {
    axios
      .get(Config.getCommonUrl() + "api/tagformat")
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setFormatList(response.data.data);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
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

  function getPrinterList() {
    axios
      .get(Config.getCommonUrl() + "api/tagprinter")
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setPrinterList(response.data.data);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
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
  function getSystemList() {
    axios
      .get(Config.getCommonUrl() + "api/tagsystem")
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setSystemList(response.data.data);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
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
  const formDataSubmit = (print) => {
    if (barcodeDetails.length > 0 && print) {
      getFormatList();
      getPrinterList();
      getSystemList();
      setOpenPrintModal(true);
    } else if (barcodeDetails.length > 0 && !print) {
      callHallMarkChages();
    }
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
      callHallMarkChages();
      setOpenPrintModal(false);
    }
  }

  function callHallMarkChages() {
    axios
      .get(Config.getCommonUrl() + `api/goldRateToday/hallmarkcharges`)
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const resData = res.data.data;
          setHallMarkCharge(resData.per_piece_charges);
          const MulData = totalPcs * resData.per_piece_charges;
          callCreatePacketApi(MulData);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/goldRateToday/hallmarkcharges`,
        });
      });
  }

  function callCreatePacketApi(charges) {
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
      product_category_id: barcodeDetails[0].product_category_id,
      category_id: groupCat.value,
      variant_id: subCatVariant.value,
      purity: barcodeDetails[0].purity,
      pcs: totalPcs,
      gross_wgt: totalGross.toFixed(3),
      net_wgt: totalNet.toFixed(3),
      remark: "cmcvxvnv",
      department_id: selectedDepartment.value.split("-")[1],
      hallmark_charges: charges,
      lot_details_id: totalLot,
      system_print_format: printerArr,
    };

    axios
      .post(Config.getCommonUrl() + "api/packet/packet", body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setOpen(false);
          History.push("/dashboard/stock");
          dispatch(
            Actions.showMessage({
              message: "Packet set Added Successfully",
              variant: "success",
            })
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/packet/packet", body: body });
      });
  }

  const deleteHandler = (data) => {
    let newArr = barcodeDetails.filter((s) => {
      if (s.barcode_id !== data.barcode_id) return s;
      return false;
    });
    let newLot = totalLot.filter((p) => {
      if (p !== data.id) return p;
      return false;
    });
    setBarcodeDetails(newArr);
    setTotalLot(newLot);
    callAddition(newArr);
  };

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="tagmarking-btn-fullwidth pb-12"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Create Packet
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
                  Make a Set
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={handleClose}
                  >
                    <Icon style={{ color: "white" }}>close</Icon>
                  </IconButton>
                </h5>
                <div className="p-5 pt-0 pl-16 pr-16">
                  <label>Group Category</label>
                  <Select
                    className="mt-1 mb-10"
                    classes={classes}
                    styles={selectStyles}
                    autoFocus
                    options={groupCatList.map((group) => ({
                      value: group.id,
                      label: group.category_name,
                    }))}
                    isClearable
                    value={groupCat}
                    onChange={handleGroupCat}
                    placeholder="Group Category"
                  />

                  <span style={{ color: "red" }}>
                    {groupCatErr.length > 0 ? groupCatErr : ""}
                  </span>
                  <label>Sub Category Variant</label>
                  <Select
                    className="mt-1"
                    classes={classes}
                    styles={selectStyles}
                    options={subVariantCatList.map((group) => ({
                      value: group.id,
                      label: group.category_name,
                    }))}
                    isClearable
                    value={subCatVariant}
                    onChange={handleSubCatVariant}
                    placeholder="Sub Category Variant"
                  />

                  <span style={{ color: "red" }}>
                    {subCatVariantErr.length > 0 ? subCatVariantErr : ""}
                  </span>
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
              </div>
            </Modal>
            <div className="main-div-alll">
              {!open && (
                <div className="">
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <label style={{display: "block", marginBottom: 5}}>Group category</label>
                      <TextField
                        className="mb-16"
                        variant="outlined"
                        value={viewGroup}
                        placeholder="Group Category"
                        disabled
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <label style={{display: "block", marginBottom: 5}}>Sub category variant</label>
                      <TextField
                        className="mb-16"
                        value={viewSubGroup}
                        disabled
                        variant="outlined"
                        fullWidth
                        placeholder="Sub Category Variant"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <label style={{display: "block", marginBottom: 5}}>Scan barcode</label>
                      <TextField
                        className="mb-16"
                        placeholder="Enter barcode"
                        autoFocus
                        name="barcodeInput"
                        value={barcodeInput}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </div>
              )}

              <div className="createpacket-tbl-main">
                <Paper
                  className={clsx(
                    classes.tabroot,
                    "table-responsive createpacket-table"
                  )}
                >
                  <MaUTable className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          Barcode
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad}>Variant</TableCell> */}
                        <TableCell className={classes.tableRowPad}>
                          Purity
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Phy Pieces
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Gross Weight
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad}>Stone Weight</TableCell> */}
                        <TableCell className={classes.tableRowPad}>
                          Net Weight
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad}>Other Weight</TableCell> */}
                        <TableCell className={classes.tableRowPad}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {barcodeDetails.map((rows, i) => (
                        <TableRow key={i}>
                          <TableCell className={classes.tableRowPad}>
                            {rows.barcode}
                          </TableCell>
                          {/* <TableCell className={classes.tableRowPad}>
                            {JSON.parse(rows.details_json).Variant}   
                            </TableCell> */}
                          <TableCell className={classes.tableRowPad}>
                            {rows.purity}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {rows.phy_pcs}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {rows.gross_wgt}
                          </TableCell>
                          {/* <TableCell className={classes.tableRowPad}>
                              {rows.stone_wgt}
                            </TableCell> */}
                          <TableCell className={classes.tableRowPad}>
                            {rows.net_wgt}
                          </TableCell>
                          {/* <TableCell className={classes.tableRowPad}>
                              {rows.other_wgt}
                            </TableCell> */}
                          <TableCell className={classes.tableRowPad}>
                            <IconButton
                              style={{ padding: "0" }}
                              onClick={(ev) => {
                                ev.preventDefault();
                                ev.stopPropagation();
                                deleteHandler(rows);
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
                    <TableFooter>
                      <TableRow>
                        <TableCell className={classes.tableFooter}>
                          {/* <b>{barcodeDetails.length}</b> */}
                        </TableCell>
                        {/* <TableCell className={classes.tableFooter}></TableCell> */}
                        <TableCell className={classes.tableFooter}></TableCell>
                        <TableCell className={classes.tableFooter}>
                          <b>{totalPcs}</b>
                        </TableCell>
                        <TableCell className={classes.tableFooter}>
                          <b>{totalGross.toFixed(3)}</b>
                        </TableCell>
                        {/* <TableCell className={classes.tableFooter}><b>{totalStone}</b></TableCell> */}
                        <TableCell className={classes.tableFooter}>
                          <b>{totalNet.toFixed(3)}</b>
                        </TableCell>
                        {/* <TableCell className={classes.tableFooter}><b>{totalOtherWgt}</b></TableCell> */}
                        <TableCell className={classes.tableFooter}></TableCell>
                      </TableRow>
                    </TableFooter>
                  </MaUTable>
                </Paper>
                <Button
                  variant="contained"
                  className={clsx(classes.button, "popup-save")}
                  size="small"
                  style={{
                    float: "right",
                  }}
                  onClick={() => formDataSubmit(true)}
                >
                  Save & Print
                </Button>
                <Button
                  variant="contained"
                  className={clsx(classes.button, "popup-cancel")}
                  size="small"
                  style={{
                    float: "right",
                  }}
                  onClick={() => formDataSubmit(false)}
                >
                  Save
                </Button>
              </div>
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
                  className={classes.paper}
                  id="modesize-dv"
                >
                  <h5
                    className="p-5"
                    style={{
                      textAlign: "center",
                      backgroundColor: "black",
                      color: "white",
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
                                      onChange={(e) =>
                                        handleInputFormatChange(e)
                                      }
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
                              <TableCell className="tagmakinglot-td">
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
                  <Button
                    variant="contained"
                    color="primary"
                    className="w-full mx-auto mt-16"
                    style={{
                      backgroundColor: "#4caf50",
                      border: "none",
                      color: "white",
                    }}
                    onClick={(e) => handlePrintSaveSubmit(e)}
                  >
                    Save
                  </Button>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default CreatePacket;

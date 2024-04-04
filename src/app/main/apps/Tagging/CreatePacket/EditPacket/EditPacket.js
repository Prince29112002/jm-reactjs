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
import Modal from "@material-ui/core/Modal";
import {
  Checkbox,
  TextField,
  Icon,
  IconButton,
  FormControlLabel,
} from "@material-ui/core";
import History from "@history";
import axios from "axios";
import Select, { createFilter } from "react-select";
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
const EditPacket = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [modalStyle] = React.useState(getModalStyle);
  const [packetSetData, setPacketsetData] = useState([]);
  const [deleteEntry, setDeleteEntry] = useState(false);
  const [totalLot, setTotalLot] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [totalPcs, setTotalPcs] = useState(0);
  const [totalGross, setTotalGross] = useState(0.0);
  const [totalNet, setTotalNet] = useState(0.0);
  const [totalStone, setTotalStone] = useState(0.0);
  const [hallMarkCharge, setHallMarkCharge] = useState("");
  const appContext = useContext(AppContext);
  const [openPrintModal, setOpenPrintModal] = useState(false);
  const [formatList, setFormatList] = useState([]);
  const [printerList, setPrinterList] = useState([]);
  const [systemList, setSystemList] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState([]);
  const [deleteId, setDeleteId] = useState("");

  const { selectedDepartment } = appContext;

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };
  useEffect(() => {
    getPacketSetList();
    getFormatList();
    getPrinterList();
    getSystemList();
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Tagging", dispatch);
  }, []);

  useEffect(() => {
    updateFormatListArr();
  }, [selectedFormat]);

  useEffect(() => {
    if (deleteEntry) {
      formDataSubmit(false);
    }
  }, [deleteEntry]);

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

  function handlePrintSaveSubmit() {
    if (ValidateCheckObj() && ValidatePrintObj()) {
      callHallMarkChages();
      setOpenPrintModal(false);
    }
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

  function getPrinterList() {
    axios
      .get(Config.getCommonUrl() + "api/tagprinter")
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
        handleError(error, dispatch, { api: "api/tagprinter" });
      });
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

  function getFormatList() {
    axios
      .get(Config.getCommonUrl() + "api/tagformat")
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
        handleError(error, dispatch, { api: "api/tagformat" });
      });
  }

  function getSystemList() {
    axios
      .get(Config.getCommonUrl() + "api/tagsystem")
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
        handleError(error, dispatch, { api: "api/tagsystem" });
      });
  }
  function getPacketSetList() {
    const id = props.location.state.id;
    axios
      .get(Config.getCommonUrl() + `api/packet/set/${id}`)
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const temp = [...packetSetData];
          const lotId = [...totalLot];
          const data = res.data.data;
          if (data.length > 0) {
            data.map((item) => {
              temp.push(item.LotDetails);
              lotId.push(item.lot_details_id);
            });
          }
          setPacketsetData(temp);
          setTotalLot(lotId);
          callAddition(temp);
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/packet/set/${id}` });
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
          const temp = [...packetSetData];
          const lotId = [...totalLot];
          if (res.data.data[0].length > 0) {
            const data = res.data.data[0];
            if (!lotId.includes(data[0].id) && data[0].is_scan === 0) {
              data.map((item) => {
                temp.push(item);
                lotId.push(item.id);
              });
              setPacketsetData(temp);
              setBarcodeInput("");
              setTotalLot(lotId);
              callAddition(temp);
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
      temp.map((item) => {
        pcsTotal += parseFloat(item.phy_pcs, 2);
        netWgt += parseFloat(item.net_wgt, 2);
        grossWgt += parseFloat(item.gross_wgt, 2);
        // stoneWgt += parseFloat(item.stone_wgt,2)
      });
      setTotalPcs(isNaN(pcsTotal) ? 0 : pcsTotal);
      setTotalNet(netWgt);
      setTotalGross(grossWgt);
      // setTotalStone(stoneWgt);
    } else {
      setTotalPcs(0);
      setTotalNet(0);
      setTotalGross(0);
      // setTotalStone(0);
    }
  };

  const formDataSubmit = (print) => {
    if (print) {
      setOpenPrintModal(true);
    } else if (!print) {
      callHallMarkChages();
    }
  };

  function callHallMarkChages() {
    axios
      .get(Config.getCommonUrl() + `api/goldRateToday/hallmarkcharges`)
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const resData = res.data.data;
          setHallMarkCharge(resData.per_piece_charges);
          const MulData = totalPcs * resData.per_piece_charges;
          callUpdatePacketApi(MulData);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/goldRateToday/hallmarkcharges`,
        });
      });
  }

  function callUpdatePacketApi(charges) {
    const id = props.location.state.id;
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
      product_category_id:
        packetSetData.length > 0 ? packetSetData[0].product_category_id : null,
      purity: packetSetData.length > 0 ? packetSetData[0].purity : null,
      pcs: totalPcs,
      gross_wgt: totalGross.toFixed(3),
      net_wgt: totalNet.toFixed(3),
      hallmark_charges: charges,
      department_id: selectedDepartment.value.split("-")[1],
      remark: "cmcvxvnv",
      lot_details_id: totalLot,
      system_print_format: printerArr,
    };
    axios
      .put(Config.getCommonUrl() + `api/packet/update/${id}/${deleteId}`, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          if (deleteEntry) {
            setDeleteEntry(false);
            setDeleteId("");
            dispatch(
              Actions.showMessage({
                message: "Barcode deleted Successfully",
                variant: "success",
              })
            );
          } else {
            History.goBack();
            dispatch(
              Actions.showMessage({
                message: "Packet set updated Successfully",
                variant: "success",
              })
            );
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
          api: `api/packet/update/${id}/${deleteId}`,
          body: body,
        });
      });
  }

  const deleteHandler = (data) => {
    let newArr = packetSetData.filter((s) => {
      if (s.barcode_id !== data.barcode_id) return s;
      return false;
    });
    let newLot = totalLot.filter((p) => {
      if (p !== data.id) return p;
      return false;
    });
    setPacketsetData(newArr);
    setTotalLot(newLot);
    callAddition(newArr);
    setDeleteEntry(true);
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 edit_packet_width_dv makeStyles-root-1 pt-20">
            <Grid
              className="edit_packet_header pb-8"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Edit Packet
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper />  <span className="text-15 font-700"> / {props.location.state.packetNum}</span>  */}
              </Grid>
              <Grid
                item
                xs={12}
                sm={8}
                md={9}
                key="2"
                style={{ textAlign: "right", paddingRight: "45px" }}
              >
                <div className="btn-back mt-4">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    variant="contained"
                    id="btn-back"
                    size="small"
                    onClick={() => {
                      History.goBack();
                    }}
                  >
                    Back
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
              </Grid>
            </Grid>

            <div className="main-div-alll ">
              <div className="pb-0 pt-32 pl-16 pr-16">
                <Grid container spacing={3}>
                  <Grid item xs={4} style={{ paddingLeft: "6px" }}>
                    <label>Scan barcode*</label>
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
              <div className="m-12 mt-0 pl-0">
                <Paper className={clsx(classes.tabroot, "mb-20")}>
                  <div className="table-responsive editpacket_main_tabel">
                    <MaUTable className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>
                            BarCode
                          </TableCell>
                          {/* <TableCell className={classes.tableRowPad}>Variant</TableCell> */}
                          <TableCell className={classes.tableRowPad}>
                            Purity
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Pieces
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Gross Weight
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Net Weight
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {packetSetData.map((rows, i) => (
                          <TableRow key={i}>
                            <TableCell className={classes.tableRowPad}>
                              {rows.BarCodeProduct
                                ? rows.BarCodeProduct.barcode
                                : rows.barcode}
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
                            <TableCell className={classes.tableRowPad}>
                              {rows.net_wgt}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  deleteHandler(rows);
                                  setDeleteId(rows.id);
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
                          <TableCell></TableCell>
                          {/* <TableCell></TableCell> */}
                          <TableCell></TableCell>
                          <TableCell>
                            <b>{totalPcs}</b>
                          </TableCell>
                          <TableCell>
                            <b>{totalGross.toFixed(3)}</b>
                          </TableCell>
                          <TableCell>
                            <b>{totalNet.toFixed(3)}</b>
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableFooter>
                    </MaUTable>
                  </div>
                </Paper>
                <Button
                  id="btn-save"
                  variant="contained"
                  size="small"
                  onClick={() => formDataSubmit(true)}
                  className="float-right margin_left"
                >
                  Print & Update
                </Button>
                <Button
                  id="btn-save"
                  variant="contained"
                  className="float-right"
                  size="small"
                  onClick={() => formDataSubmit(false)}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default EditPacket;

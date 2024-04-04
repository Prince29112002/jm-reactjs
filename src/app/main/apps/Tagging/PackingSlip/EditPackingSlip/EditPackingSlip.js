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
import { TextField, Icon, IconButton } from "@material-ui/core";
import History from "@history";
import axios from "axios";
import Select, { createFilter } from "react-select";
import * as Actions from "app/store/actions";
import Config from "app/fuse-configs/Config";
import AppContext from "app/AppContext";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
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

const EditPackingSlip = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [packingSlipData, setPackingSlipData] = useState([]);
  const [totalPacket, setTotalPacket] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [totalPcs, setTotalPcs] = useState(0);
  const [totalGross, setTotalGross] = useState(0.0);
  const [totalNet, setTotalNet] = useState(0.0);
  const [totalStone, setTotalStone] = useState(0.0);
  const [totalOtherAmt, setTotalOtherAmt] = useState(0.0);
  const [totalOtherWgt, setTotalOtherWgt] = useState(0.0);
  const [totalHallMarkCharges, setTotalHallMarkCharges] = useState(0.0);
  const [remark, setRemark] = useState("");
  const [huid, setHuid] = useState("");
  const [clientList, setClientList] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedClientErr, setSelectedClientErr] = useState("");
  const [entryDelete, setEntryDelete] = useState(false);
  const [packetList, setPacketList] = useState([]);
  const [modalView, setModalView] = useState(0);
  const appContext = useContext(AppContext);
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
    NavbarSetting("Tagging", dispatch);
  }, []);

  useEffect(() => {
    if (entryDelete) {
      formDataSubmit();
    }
  }, [entryDelete]);

  useEffect(() => {
    getPackingSlipList();
    getClientList();
  }, [dispatch]);

  useEffect(() => {
    if (totalPacket.length > 0) {
      let idArr = [];
      totalPacket.map((item) => {
        idArr.push(item.id);
      });
      getAllPacketDetailApi(idArr);
    } else {
      setPacketList([]);
    }
  }, [totalPacket]);

  function getClientList() {
    axios
      .get(Config.getCommonUrl() + "api/client/listing/listing")
      .then((res) => {
        console.log(res);
        setClientList(res.data.data);
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/client/listing/listing" });
      });
  }

  function getAllPacketDetailApi(idArr) {
    const body = { id: idArr };
    axios
      .post(
        Config.getCommonUrl() + `api/packingslip/packet/barcode/details`,
        body
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const dataArr = res.data.data;
          let temp = [];
          dataArr.map((item) => (temp = [...temp, ...item.LotPacket]));
          setPacketList(temp);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/packingslip/packet/barcode/details`,
          body: body,
        });
      });
  }

  function getPackingSlipList() {
    const id = props.location.state.id;
    axios
      .get(Config.getCommonUrl() + `api/packingslip/list/${id}`)
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const temp = [...packingSlipData];
          const pId = [...totalPacket];

          const apidata = res.data.data;

          setSelectedClient({
            value: apidata.clients_id,
            label: apidata.ClientName ? apidata.ClientName.name : "",
          });
          setHuid(apidata.huid ? apidata.huid : "");
          setRemark(apidata.remark ? apidata.remark : "");

          if (res.data.mydata.length > 0) {
            const data = res.data.mydata;

            data.map((item) => {
              const arrWat = {};
              temp.push(item.Packet);
              arrWat.id = item.packet_id;
              arrWat.wastage_per = item.Packet.wastage;
              pId.push(arrWat);
            });
            setPackingSlipData(temp);
            setTotalPacket(pId);
            callAddition(temp);
          }
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/packingslip/list/${id}` });
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

  function valueAvilable(value, arr) {
    return arr.some((el) => {
      return el.id === value;
    });
  }

  function callScanBarcodeDetails(barcodeInput) {
    const barcodeId = barcodeInput.toString().replace(/ /g, "");
    axios
      .get(
        Config.getCommonUrl() +
          `api/packet/scan/packet/${barcodeId}/${
            selectedDepartment.value.split("-")[1]
          }`
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const temp = [...packingSlipData];
          const packetId = [...totalPacket];

          if (res.data.data[0].length > 0) {
            const data = res.data.data[0];
            const arrWat = { id: "", wastage_per: "" };
            if (!valueAvilable(data[0].id, packetId) && data[0].is_scan === 0) {
              data.map((arr) => {
                temp.push(arr);
                arrWat.id = arr.id;
                if (arr.wastage) {
                  arrWat.wastage_per = arr.wastage;
                }
                packetId.push(arrWat);
              });
              setPackingSlipData(temp);
              setBarcodeInput("");
              callAddition(temp);
              setTotalPacket(packetId);
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
          api: `api/packet/scan/packet/${barcodeId}/${
            selectedDepartment.value.split("-")[1]
          }`,
        });
      });
  }

  const callAddition = (temp) => {
    if (temp.length > 0) {
      var pcsTotal = 0;
      var stoneWgt = 0;
      var netWgt = 0;
      var grossWgt = 0;
      var otherAmt = 0;
      var otherWgt = 0;
      var hallChargeTotal = 0;
      temp.map((item) => {
        pcsTotal += parseFloat(item.pcs, 2);
        netWgt += parseFloat(item.net_wgt, 2);
        grossWgt += parseFloat(item.gross_wgt, 2);
        stoneWgt += parseFloat(item.stone_wgt, 2);
        otherAmt += parseFloat(item.other_amount, 2);
        otherWgt += parseFloat(item.other_wgt, 2);
        hallChargeTotal += parseFloat(item.hallmark_charges, 2);
      });
      setTotalPcs(isNaN(pcsTotal) ? 0 : pcsTotal);
      setTotalNet(netWgt);
      setTotalGross(grossWgt);
      setTotalStone(stoneWgt);
      setTotalOtherAmt(otherAmt);
      setTotalOtherWgt(otherWgt);
      setTotalHallMarkCharges(hallChargeTotal);
    } else {
      setTotalPcs(0);
      setTotalNet(0);
      setTotalGross(0);
      setTotalStone(0);
      setTotalOtherAmt(0);
      setTotalOtherWgt(0);
      setTotalHallMarkCharges(0);
    }
  };

  function validateclient() {
    if (selectedClient === "") {
      setSelectedClientErr("Select Client");
      return false;
    }
    return true;
  }

  const formDataSubmit = () => {
    // if (selectedClientid === "" || clientName === "" || huid === "") {
    //   dispatch(
    //     Actions.showMessage({ message: "Not Editable !! This Packing slip buy from vendor",variant:"error" })
    //   );
    // }
    //  else {
    if (validateclient() && validateWastage()) {
      callUpdatePackingSlipApi();
    }
    // }
  };

  function validateWastage() {
    const arrData = [...packingSlipData];

    const res = arrData.map((item) => {
      if (item.wastage === null || item.wastage === "" || item.wastage == 0) {
        item.wastageErr = "Enter Wastage (not 0)";
        return false;
      }
    });
    setPackingSlipData(arrData);
    if (res.includes(false)) {
      return false;
    } else {
      return true;
    }
  }

  function callUpdatePackingSlipApi() {
    const id = props.location.state.id;
    const body = {
      clients_id: selectedClient.value,
      remark: remark,
      hallmark_charges: totalHallMarkCharges.toFixed(3),
      // other_amt : totalOtherAmt.toFixed(3),
      other_wgt: totalOtherWgt.toFixed(3),
      net_wgt: totalNet.toFixed(3),
      gross_wgt: totalGross.toFixed(3),
      phy_pcs: totalPcs,
      purity: packingSlipData.length > 0 ? packingSlipData[0].purity : null,
      huid: huid,
      department_id: selectedDepartment.value.split("-")[1],
      stone_wgt: totalStone,
      packet_id: totalPacket,
    };
    axios
      .put(
        Config.getCommonUrl() + `api/packingslip/slip/${id}/${deleteId}`,
        body
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          if (entryDelete) {
            setEntryDelete(false);
            setDeleteId("");
            dispatch(
              Actions.showMessage({
                message: "Packet deleted Successfully",
                variant: "success",
              })
            );
          } else {
            History.push("/dashboard/stock");
            dispatch(
              Actions.showMessage({
                message: "Packing slip updated Successfully",
                variant: "success",
              })
            );
          }
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
          api: `api/packingslip/slip/${id}/${deleteId}`,
          body: body,
        });
      });
  }

  const handleWastage = (e, id) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "wastage") {
      if (!isNaN(Number(value))) {
        const totalp = [...totalPacket];
        const detail = [...packingSlipData];
        totalp.map((p) => {
          if (p.id === id) {
            p.wastage_per = value;
          }
        });
        setTotalPacket(totalp);
        detail.map((p) => {
          if (p.id === id) {
            p.wastage = value;
            if (p.wastageErr) {
              p.wastageErr = "";
            }
          }
        });
        setPackingSlipData(detail);
      }
    }
  };

  const deleteHandler = (data) => {
    let newArr = packingSlipData.filter((s) => {
      if (s.barcode_id !== data.barcode_id) return s;
      return false;
    });
    let newPacket = totalPacket.filter((p) => {
      if (p.id !== data.id) return p;
      return false;
    });
    setPackingSlipData(newArr);
    setTotalPacket(newPacket);
    callAddition(newArr);
    setEntryDelete(true);
  };

  const handleChangeClient = (value) => {
    setSelectedClient(value);
    setSelectedClientErr("");
  };

  const handleChangeTab = (event, value) => {
    setModalView(value);
  };

  const callTabel = () => {
    return (
      <div className=" mr-16 packingslip-table-main">
        <Paper className={classes.tabroot}>
          <div className="table-responsive packingslip-table view-packingslip-table">
            <MaUTable className={classes.table}>
              <TableHead>
                <TableRow>
                  {/* <TableCell className={classes.tableRowPad}>Stock Type</TableCell> */}
                  <TableCell className={classes.tableRowPad}>
                    Stock Code
                  </TableCell>
                  {/* <TableCell className={classes.tableRowPad}>Category</TableCell> */}
                  <TableCell className={classes.tableRowPad}>Purity</TableCell>
                  <TableCell className={classes.tableRowPad}>Pieces</TableCell>
                  <TableCell className={classes.tableRowPad}>
                    Gross Weight
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    Stone Weight
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    Net Weight
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    Other Weight
                  </TableCell>
                  {/* <TableCell className={classes.tableRowPad}>Other Amt</TableCell> */}
                  <TableCell className={classes.tableRowPad}>
                    Hallmark Charges
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    Wastage(%)
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {packingSlipData &&
                  packingSlipData.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className={classes.tableRowPad}>
                        {row.PacBarCode ? row.PacBarCode.barcode : row.barcode}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {row.purity}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {row.pcs}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {row.gross_wgt}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {row.stone_wgt}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {row.net_wgt}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {row.other_wgt}
                      </TableCell>
                      {/* <TableCell className={classes.tableRowPad}>
                      {row.other_amount}
                      </TableCell> */}
                      <TableCell className={classes.tableRowPad}>
                        {row.hallmark_charges ? row.hallmark_charges : ""}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <TextField
                          name="wastage"
                          value={row.wastage ? row.wastage : ""}
                          error={row.wastageErr ? true : false}
                          helperText={row.wastageErr}
                          onChange={(e) => handleWastage(e, row.id)}
                        />
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <IconButton
                          style={{ padding: "0" }}
                          onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            deleteHandler(row);
                            setDeleteId(row.id);
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
                  <TableCell className={classes.tableFooter}></TableCell>
                  <TableCell className={classes.tableFooter}></TableCell>
                  <TableCell className={classes.tableFooter}>
                    <b>{totalPcs}</b>
                  </TableCell>
                  <TableCell className={classes.tableFooter}>
                    <b>{totalGross.toFixed(3)}</b>
                  </TableCell>
                  <TableCell className={classes.tableFooter}>
                    <b>{totalStone.toFixed(3)}</b>
                  </TableCell>
                  <TableCell className={classes.tableFooter}>
                    <b>{totalNet.toFixed(3)}</b>
                  </TableCell>
                  <TableCell className={classes.tableFooter}>
                    <b>{totalOtherWgt.toFixed(3)}</b>
                  </TableCell>
                  <TableCell className={classes.tableFooter}>
                    <b>{totalHallMarkCharges.toFixed(3)}</b>
                  </TableCell>
                  {/* <TableCell className={classes.tableFooter}><b>{totalOtherAmt.toFixed(3)}</b></TableCell> */}
                  <TableCell className={classes.tableFooter}></TableCell>
                  <TableCell className={classes.tableFooter}></TableCell>
                </TableRow>
              </TableFooter>
            </MaUTable>
          </div>
        </Paper>
      </div>
    );
  };

  const callPacketTabel = () => {
    return (
      <div className=" mr-16 packingslip-table-main">
        <Paper
          className={clsx(
            classes.tabroot,
            "table-responsive packingslip-table view-packingslip-table"
          )}
        >
          <MaUTable className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableRowPad}>Barcode</TableCell>
                <TableCell className={classes.tableRowPad}>Purity</TableCell>
                <TableCell className={classes.tableRowPad}>Pieces</TableCell>
                <TableCell className={classes.tableRowPad}>
                  Gross Weight
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  Net Weight
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packetList.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className={classes.tableRowPad}>
                    {row.LotDetails.BarCodeProduct.barcode}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {row.LotDetails.purity}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {row.LotDetails.phy_pcs}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {row.LotDetails.gross_wgt}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {row.LotDetails.net_wgt}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </MaUTable>
        </Paper>
      </div>
    );
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container table-width-mt">
          <div className="flex flex-1 flex-col min-w-0 edit_packet_width_dv makeStyles-root-1 pt-20">
            <Grid
              className="edit_packet_header pb-8"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={4} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Edit Packing Slip
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /><span className="text-15 font-700"> / {props.location.state.slipNum}</span> */}
              </Grid>
              <Grid
                item
                xs={12}
                sm={8}
                md={8}
                key="2"
                style={{ textAlign: "right", paddingRight: "38px" }}
              >
                {/* <Button
                  variant="contained"
                  size="small"
                  onClick={() => { History.push('/dashboard/stock') }}
                >
                  Back
                </Button> */}
                <div className="btn-back pt-2 pr-8">
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    variant="contained"
                    size="small"
                    onClick={() => {
                      History.push("/dashboard/stock");
                    }}
                  >
                    Back
                  </Button>
                </div>

                <Button
                  id="btn-save"
                  variant="contained"
                  className="mr-10"
                  size="small"
                  onClick={formDataSubmit}
                >
                  Update
                </Button>
              </Grid>
            </Grid>
            <div className="main-div-alll">
              <div className="pb-16  pl-16 pr-16 packing-full-width-input">
                <Grid container spacing={3}>
                  <Grid item xs={3} style={{ padding: 5 }}>
                    <label>Customer</label>
                    <Select
                      autoFocus
                      classes={classes}
                      styles={selectStyles}
                      options={clientList.map((opt) => ({
                        value: opt.id,
                        label: opt.name,
                      }))}
                      value={selectedClient}
                      filterOption={createFilter({ ignoreAccents: false })}
                      onChange={handleChangeClient}
                      placeholder="Enter customer"
                    />
                    <span style={{ color: "red" }}>
                      {selectedClientErr.length > 0 ? selectedClientErr : ""}
                    </span>
                  </Grid>

                  <Grid item xs={3} style={{ padding: 5 }}>
                    <label>HUID</label>
                    <TextField
                      placeholder="Enter huid"
                      name="huid"
                      value={huid}
                      disabled
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={3} style={{ padding: 5 }}>
                    <label>Remark</label>
                    <TextField
                      placeholder="Enter remark"
                      name="remark"
                      value={remark}
                      disabled
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={3} style={{ padding: 5 }}>
                    <label>Scan Set / Barcode</label>
                    <TextField
                      placeholder="Enter barcode"
                      name="barcodeInput"
                      value={barcodeInput}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </div>
              <Grid style={{ padding: 15 }}>
                <div className={classes.root}>
                  <Tabs value={modalView} onChange={handleChangeTab}>
                    <Tab label="Item" />
                    <Tab label="Sets" />
                  </Tabs>
                </div>
              </Grid>
              {modalView === 0 ? callTabel() : callPacketTabel()}
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default EditPackingSlip;

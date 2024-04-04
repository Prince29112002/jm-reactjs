import React, { useState, useEffect, useContext } from "react";
import { Typography, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Select, { createFilter } from "react-select";
import History from "@history";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ItemTabView from "./SubViews/ItemTabView";
import PackingSlipTabView from "./SubViews/PackingSlipTabView";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import AppContext from "app/AppContext";
import TableFooter from "@material-ui/core/TableFooter";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";

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
    backgroundColor: "gray",
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
  tab: {
    padding: 0,
    minWidth: "auto",
    marginRight: 30,
    textTransform: "capitalize",
  },
}));

const IssueToHallmark = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [modalView, setModalView] = useState(0);

  const [clientdata, setClientdata] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectClientErr, setSelectClientErr] = useState("");

  const [clientCompanies, setClientCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompErr, setSelectedCompErr] = useState("");

  const [hmStationList, setHMStationList] = useState([]);
  const [selectedHmStation, setSelectedHmStation] = useState("");
  const [selectedHmStatErr, setSelectedHmStatErr] = useState("");

  const [reqNumber, setReqNumber] = useState("");
  const [reqNumberErr, setReqNumberErr] = useState("");

  const [packingSearch, setPackingSearch] = useState("");
  const [packingSlipApiData, setPackingSlipApiData] = useState([]);

  const [packingSlipNo, setPackingSlipNo] = useState("");
  const [packingSlipErr, setPackingSlipErr] = useState("");

  const [itemData, setItemData] = useState([]);
  const [packingSlipData, setPackingSlipData] = useState([]);
  const [slipIdArr, setSlipIdArr] = useState([]);
  const [issuehallmarkList, setIssueHallmarkList] = useState([]);
  const [hallmarkStockList, setIssueHallmarkStockList] = useState([]);

  const [totalStocksum, setTotalStock] = useState(0);
  const [netWgtisueeTotal, setNetWgtisueeTotal] = useState(0);
  const [netWgtRecTotal, setNetWgtRecTotal] = useState(0);
  const [finalRecFine, setFinalRecFine] = useState(0);
  const [finalTotalFine, setFinalTotalFine] = useState(0);

  const [slipTotalFine, setSlipTotalFine] = useState(0);

  const [balSuf, setBalSuf] = useState(false);

  const dispatch = useDispatch();
  const appContext = useContext(AppContext);

  const { selectedDepartment } = appContext;
  const handleChangeTab = (event, value) => {
    setModalView(value);
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

  useEffect(() => {
    NavbarSetting("Hallmark", dispatch);
    //eslint-disable-next-line
  }, []);

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
  }, [packingSearch]);

  useEffect(() => {
    if (selectedClient) {
      getClientCompanies(selectedClient.value);
    }
  }, [selectedClient]);

  useEffect(() => {
    if (selectedClient && selectedCompany) {
      getHallMarkIssueList();
      getHallmarkStockList();
      getTotalPartyStock();
    }
  }, [selectedClient, selectedCompany]);

  useEffect(() => {
    getClientData();
    getHallmarkStationList();
  }, []);

  function getClientData() {
    axios
      .get(Config.getCommonUrl() + "api/client/listing/listing")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setClientdata(response.data.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/client/listing/listing" });
      });
  }

  function getClientCompanies(clientId) {
    axios
      .get(
        Config.getCommonUrl() + `api/client/company/listing/listing/${clientId}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          var compData = response.data.data;
          setClientCompanies(compData);
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
          api: `api/client/company/listing/listing/${clientId}`,
        });
      });
  }

  function getHallmarkStationList() {
    axios
      .get(Config.getCommonUrl() + "api/hallmarkissue/station")
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setHMStationList(response.data.Stations);
        } else {
          setHMStationList([]);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/hallmarkissue/station" });
      });
  }

  const slipTotal = (totalfine) => {
    setSlipTotalFine(totalfine);
  };

  function handlePartyChange(value) {
    if (validateReq()) {
      setSelectedClient(value);
      setSelectedCompany("");
      setSelectClientErr("");
      setPackingSlipNo("");
      setPackingSearch("");
    }
  }

  function handleCompanyChange(value) {
    setSelectedCompany(value);
    setSelectedCompErr("");
    setPackingSlipNo("");
    setPackingSearch("");
  }

  function handleHmStationChange(value) {
    setSelectedHmStation(value);
    setSelectedHmStatErr("");
    setPackingSlipNo("");
    setPackingSearch("");
  }

  function getHallMarkIssueList() {
    axios
      .get(
        Config.getCommonUrl() +
          `api/hallmarkissue/hallmark/list/${selectedClient.value}/${
            selectedCompany.value
          }/${selectedDepartment.value.split("-")[1]}`
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          let netWgtTotal = 0;
          let totalFinalFine = 0;
          console.log(response.data.data);
          if (response.data.data.length > 0) {
            const slipDataArr = [];
            response.data.data.map((temp) => {
              temp.PackingSlipData.map((item) => {
                const data = item.net_wgt;
                let fine = (item.net_wgt * item.purity) / 100;
                netWgtTotal += parseFloat(data);
                totalFinalFine += parseFloat(fine);
                slipDataArr.push({
                  ...item,
                  netWgtTotal,
                  totalFinalFine,
                });
              });
            });
            // slipDataArr.map((item) => {
            //   const data = item.net_wgt
            //   let fine = (item.net_wgt * item.purity) / 100;
            //   netWgtTotal += parseFloat(data)
            //   totalFinalFine += parseFloat(fine)
            // })
            setIssueHallmarkList(slipDataArr);
            setNetWgtisueeTotal(netWgtTotal + netWgtRecTotal);
            setFinalTotalFine(totalFinalFine + finalRecFine);
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
          api: `api/hallmarkissue/hallmark/list/${selectedClient.value}/${
            selectedCompany.value
          }/${selectedDepartment.value.split("-")[1]}`,
        });
      });
  }

  function getHallmarkStockList() {
    axios
      .get(
        Config.getCommonUrl() +
          `api/hallmarkissue/party/receive/list/${selectedClient.value}/${
            selectedCompany.value
          }/${selectedDepartment.value.split("-")[1]}`
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setIssueHallmarkStockList(response.data.data);
          let netWgtRecTotal = 0;
          let recTotalFine = 0;
          response.data.data.map((item) => {
            netWgtRecTotal += parseFloat(item.net_wgt);
            let fine = (item.net_wgt * item.purity) / 100;
            recTotalFine += parseFloat(fine);
          });
          setNetWgtRecTotal(netWgtRecTotal);
          setFinalRecFine(recTotalFine);
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
          api: `api/hallmarkissue/party/receive/list/${selectedClient.value}/${
            selectedCompany.value
          }/${selectedDepartment.value.split("-")[1]}`,
        });
      });
  }

  function getTotalPartyStock() {
    axios
      .get(
        Config.getCommonUrl() +
          `api/metalledger/hallmark/clientOrVendor?vendor=${selectedCompany.value}&is_vendor_client=2`
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          const data = response.data.data;
          setTotalStock(data);
          if (data === 0) {
            setBalSuf(false);
            dispatch(
              Actions.showMessage({
                message:
                  "Party has insufficient Balance , Please Check Party Stock",
                variant: "error",
              })
            );
          } else {
            setBalSuf(true);
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
          api: `api/ratefix/party/compny/${selectedClient.value}/${selectedCompany.value}`,
        });
      });
  }

  function getPackingSlipData(sData) {
    axios
      .get(
        Config.getCommonUrl() +
          `api/packingslip/search/${sData}/${window.localStorage.getItem(
            "SelectedDepartment"
          )}?hallmark=1`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          if (response.data.data.length > 0) {
            setPackingSlipApiData(response.data.data);
          } else {
            setPackingSlipApiData([]);
            dispatch(
              Actions.showMessage({
                message: "Please Insert Proper Packing Slip No",
                variant: "error",
              })
            );
          }
        } else {
          setPackingSlipApiData([]);
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
          api: `api/packingslip/search/${sData}/${window.localStorage.getItem(
            "SelectedDepartment"
          )}?hallmark=1`,
        });
      });
  }

  function validateparty() {
    if (selectedClient === "" || selectedClient === null) {
      setSelectClientErr("Select Party Name");
      return false;
    }
    return true;
  }

  function validateFirm() {
    if (selectedCompany === "" || selectedCompany === null) {
      setSelectedCompErr("Select Firm Name");
      return false;
    }
    return true;
  }

  function validateStation() {
    if (selectedHmStation === "" || selectedHmStation === null) {
      setSelectedHmStatErr("Select Hallmark Station");
      return false;
    }
    return true;
  }

  function validateSlip() {
    if (packingSlipData.length === 0) {
      dispatch(
        Actions.showMessage({
          message: "Scan or Add Packing Slip",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  }

  function validateReq() {
    if (reqNumber === "") {
      setReqNumberErr("Enter Request Number");
      return false;
    }
    return true;
  }

  function validatebalance() {
    const balance = (
      parseFloat(totalStocksum) - parseFloat(finalTotalFine)
    ).toFixed(3);

    if (balance >= slipTotalFine) {
      return true;
    } else {
      dispatch(
        Actions.showMessage({
          message:
            "Fine total of packingslip Sholud be less than Balance total",
          variant: "error",
        })
      );
      return false;
    }
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if(!event.detail || event.detail == 1){
    if (
      validateReq() &&
      validateparty() &&
      validateFirm() &&
      validateStation() &&
      validateSlip() &&
      validatebalance()
    ) {
      callCreateHallmark();
    }}
  };

  function callCreateHallmark() {
    const body = {
      request_number: reqNumber,
      department_id: selectedDepartment.value.split("-")[1],
      client_id: selectedClient.value,
      firm_id: selectedCompany.value,
      station_id: selectedHmStation.value,
      issue_status: 1,
      slip_id: slipIdArr,
    };
    axios
      .post(Config.getCommonUrl() + "api/hallmarkissue/2", body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          History.push("/dashboard/hallmark/issuetohallmarklist");
          dispatch(
            Actions.showMessage({
              message: "Added Successfully",
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
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/hallmarkissue/2",
          body: body,
        });
      });
  }

  let handlePackingSlipSelect = (packingSlipNum) => {
    if (
      validateReq() &&
      validateparty() &&
      validateFirm() &&
      validateStation()
    ) {
      let filteredArray = packingSlipApiData.filter(
        (item) => item.barcode === packingSlipNum
      );

      if (
        filteredArray.length > 0 &&
        filteredArray[0].PackingSlip.hallmark_issue_id === null
      ) {
        setPackingSlipApiData(filteredArray);
        setPackingSlipErr("");
        setPackingSlipNo(packingSlipNum);
        getPackingSlipDetails(filteredArray[0].PackingSlip.id);
      } else {
        setPackingSlipNo("");
        setPackingSlipErr(
          "Please Select Proper Voucher , this voucher has been used"
        );
      }
    } else {
      setPackingSlipNo("");
    }
  };

  function getPackingSlipDetails(packingSlipNum) {
    axios
      .get(
        Config.getCommonUrl() + `api/packingslip/packingSlip/${packingSlipNum}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          let tempPackingSlip = response.data.data.PackingSlip;
          let tempPacketData = response.data.data.packetData;
          let tempProductData = response.data.data.productData;
          let temCategoryData = response.data.data.categoryData;

          if (slipIdArr.includes(packingSlipNum)) {
            dispatch(
              Actions.showMessage({
                message: "This PackingSlip is already scan",
                variant: "error",
              })
            );
          } else {
            const temp = [...itemData];
            tempProductData.map((item) => {
              item.pFine = (item.purity * item.net_wgt) / 100;
              temp.push(item);
            });
            setItemData(temp);
            const slipData = [...packingSlipData, tempPackingSlip];
            setPackingSlipData(slipData);
            setSlipIdArr([...slipIdArr, packingSlipNum]);
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
          api: `api/packingslip/packingSlip/${packingSlipNum}`,
        });
      });
  }

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "reqNumber") {
      setReqNumber(value);
      setReqNumberErr("");
    }
  };

  const deletePackingSlip = (slip) => {
    const slipArr = [...packingSlipData];
    const productArr = [...itemData];
    const idArr = [...slipIdArr];

    const newSlip = slipArr.filter(
      (item) => item.packing_slip_no !== slip.packing_slip_no
    );
    const newProduct = productArr.filter(
      (item) => item.packing_slip_no !== slip.packing_slip_no
    );
    const newSlipIdArr = idArr.filter((item) => item != slip.packing_slip_id);

    setPackingSlipData(newSlip);
    setItemData(newProduct);
    setSlipIdArr(newSlipIdArr);
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container table-width-mt">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="pb-8"
              container
              alignItems="center"
              style={{paddingInline: "30px", marginBottom: "20px"}}
            >
              <Grid item xs={12} sm={4} md={3} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Issue For Hallmarking
                  </Typography>
                </FuseAnimate>
              </Grid>
            </Grid>

            <div
              className="main-div-alll"
              style={{ marginBottom: "10%", height: "90%" }}
            >
              <Grid container spacing={2} style={{justifyContent: "flex-start"}}>
                <Grid
                  className="request_input-blg flex-one-dv"
                  item
                  lg={2}
                  md={4}
                  xs={4}
                  
                >
                  <label style={{display: "block", marginBottom: 5}}>Request no</label>
                  <TextField
                    className=""
                    placeholder="Request no"
                    name="reqNumber"
                    value={reqNumber}
                    error={reqNumberErr.length > 0 ? true : false}
                    helperText={reqNumberErr}
                    onChange={(e) => handleInputChange(e)}
                    autoFocus
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid
                  className="flex-one-dv"
                  item
                  lg={2}
                  md={4}
                  xs={4}
                  
                >
                  <label style={{display: "block", marginBottom: 5}}>Party Name</label>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={clientdata.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.name,
                    }))}
                    value={selectedClient}
                    onChange={handlePartyChange}
                    placeholder="Party name"
                  />

                  <span style={{ color: "red" }}>
                    {selectClientErr.length > 0 ? selectClientErr : ""}
                  </span>
                </Grid>

                <Grid
                  className="flex-one-dv"
                  item
                  lg={3}
                  md={4}
                  xs={4}
                  
                >
                  <label style={{display: "block", marginBottom: 5}}>Firm name</label>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={clientCompanies.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.company_name,
                    }))}
                    value={selectedCompany}
                    onChange={handleCompanyChange}
                    placeholder="Firm Name"
                  />

                  <span style={{ color: "red" }}>
                    {selectedCompErr.length > 0 ? selectedCompErr : ""}
                  </span>
                </Grid>

                <Grid
                  className="flex-one-dv"
                  item
                  lg={3}
                  md={4}
                  xs={4}
                  
                >
                  <label style={{display: "block", marginBottom: 5}}>Hallmark station</label>
                  <Select
                    classes={classes}
                    styles={selectStyles}
                    filterOption={createFilter({ ignoreAccents: false })}
                    options={hmStationList.map((optn) => ({
                      value: optn.id,
                      label: optn.name,
                    }))}
                    value={selectedHmStation}
                    onChange={handleHmStationChange}
                    placeholder="Hallmark Station"
                  />
                  <span style={{ color: "red" }}>
                    {selectedHmStatErr.length > 0 ? selectedHmStatErr : ""}
                  </span>
                </Grid>
                <Grid
                  item
                  lg={2}
                  md={4}
                  sm={4}
                  xs={12}
                  className="packing-slip-input flex-one-dv"
                >
                  <label style={{display: "block", marginBottom: 5}}>Scan or Add Packing Slip</label>
                  <Autocomplete
                    id="free-solo-demo"
                    freeSolo
                    disableClearable
                    onChange={(event, newValue) => {
                      handlePackingSlipSelect(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {

                      if (event !== null) {
                        if (
                          event.type === "change" &&
                          validateReq() &&
                          validateparty() &&
                          validateFirm() &&
                          validateStation()
                        )
                          // not using this condition because all other data is showing in dropdown
                          setPackingSearch(newInputValue);
                      } else {
                        setPackingSearch("");
                        setPackingSlipNo("");
                      }
                    }}
                    value={packingSlipNo}
                    options={packingSlipApiData.map((option) => option.barcode)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        style={{ padding: 0 }}
                        placeholder="Scan or Add Packing Slip"
                      />
                    )}
                  />
                  <span style={{ color: "red" }}>
                    {packingSlipErr.length > 0 ? packingSlipErr : ""}
                  </span>
                </Grid>
              </Grid>

              <Grid container spacing={3} className="mt-16">
                <Grid item lg={7} md={7} sm={12} xs={12}>
                  <Tabs value={modalView} onChange={handleChangeTab} style={{width: "100%"}}>
                    <Tab className={classes.tab} label="Item" />
                    <Tab className={classes.tab} label="Packing Slip" />
                  </Tabs>
                  <div id="issuehallmark-table" className={classes.root}>
                    {modalView === 0 && <ItemTabView data={itemData} />}
                    {modalView === 1 && (
                      <PackingSlipTabView
                        data={packingSlipData}
                        total={slipTotal}
                        deleteEntry={deletePackingSlip}
                      />
                    )}

                    <Grid
                      container
                      spacing={4}
                      alignItems="stretch"
                      style={{ margin: 0 }}
                    >
                      <Grid
                        className="hallmark-btn-pt"
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        key="2"
                        style={{ textAlign: "right" }}
                      >
                        <Button
                          id="btn-save"
                          variant="contained"
                          // className={classes.button}
                          size="small"
                          // onClick={() => {History.push('/dashboard/tagging')}}
                        >
                          Print
                        </Button>

                        <Button
                          id="btn-save"
                          variant="contained"
                          className="ml-8"
                          size="small"
                          // style={{
                          //   backgroundColor: "#4caf50",
                          //   border: "none",
                          //   color: "white",
                          // }}
                          onClick={handleFormSubmit}
                        >
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>

                <Grid item lg={5} md={5} sm={12} xs={12}>
                  <div className={classes.root}>
                    <div
                      className="party-label-dv"
                      style={{ background: "darkgray" }}
                    >
                      Party Stock : {totalStocksum.toFixed(3)}
                    </div>

                    <label>Hallmarked Stock</label>

                    <div className="mt-16 mb-16">
                      <Paper className={classes.tabroot}>
                        <div className="table-responsive rightsecandissue_tabel_dv">
                          <MaUTable className={classes.table}>
                            <TableHead>
                              <TableRow>
                                <TableCell className={classes.tableRowPad}>
                                  Packing Slip No
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  purity
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Net Weight
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Fine
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {hallmarkStockList.map((row, i) => (
                                <TableRow key={i}>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.BarCodePackingSlip
                                      ? row.BarCodePackingSlip.barcode
                                      : ""}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.purity}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.net_wgt}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {((row.net_wgt * row.purity) / 100).toFixed(
                                      3
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell
                                  className={classes.tableFooter}
                                ></TableCell>
                                <TableCell
                                  className={classes.tableFooter}
                                ></TableCell>
                                <TableCell className={classes.tableFooter}>
                                  <b>{parseFloat(netWgtRecTotal).toFixed(3)}</b>
                                </TableCell>
                                <TableCell className={classes.tableFooter}>
                                  <b>{parseFloat(finalRecFine).toFixed(3)}</b>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </MaUTable>
                        </div>
                      </Paper>
                    </div>

                    <label>Issue For Hallmark</label>

                    <div className="mt-16 mb-5">
                      <Paper className={classes.tabroot}>
                        <div className="table-responsive rightsecandissue_tabel_dv">
                          <MaUTable className={classes.table}>
                            <TableHead>
                              <TableRow>
                                <TableCell className={classes.tableRowPad}>
                                  Packing Slip No
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  purity
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Net Weight
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Fine
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {issuehallmarkList.map((row, i) => (
                                <TableRow key={i}>
                                  <TableCell className={classes.tableRowPad}>
                                    {" "}
                                    {row.BarCodePackingSlip
                                      ? row.BarCodePackingSlip.barcode
                                      : ""}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.purity}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.net_wgt}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {((row.net_wgt * row.purity) / 100).toFixed(
                                      3
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell
                                  className={classes.tableFooter}
                                ></TableCell>
                                <TableCell
                                  className={classes.tableFooter}
                                ></TableCell>
                                <TableCell className={classes.tableFooter}>
                                  <b>
                                    {parseFloat(netWgtisueeTotal).toFixed(3)}
                                  </b>
                                </TableCell>
                                <TableCell className={classes.tableFooter}>
                                  <b>{parseFloat(finalTotalFine).toFixed(3)}</b>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </MaUTable>
                        </div>
                      </Paper>
                    </div>
                    <b>
                      Balance :{" "}
                      {(
                        parseFloat(totalStocksum) -
                        (parseFloat(finalTotalFine) + parseFloat(finalRecFine))
                      ).toFixed(3)}
                    </b>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default IssueToHallmark;

import React, { useState, useEffect } from "react";
import { FuseAnimate } from "@fuse";
import BreadcrumbsHelper from "../../../BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Box,
  Button,
  Grid,
  Icon,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import Loader from "app/main/Loader/Loader";
import moment from "moment";

import { callFileUploadApi } from "app/main/apps/SalesPurchase/Helper/DocumentUpload";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import Select, { createFilter } from "react-select";
import stoneAssortDataFile from "app/main/SampleFiles/StoneAssortment/Stone_Assortment.csv";


const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    tableLayout: "auto",
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  modalStyle: {
    background: "#FFFFFF",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#000000",
    position: "absolute",
  },
  noArrows: {
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  button: {
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
  },
 
}));


const StoneAssortment = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [fromDtErr, setFromDtErr] = useState("");
  const [fromDate, setFromDate] = useState(
    moment().subtract(1, "months").format("YYYY-MM-DD")
  );

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);

  const [stockCodeFile, setStockCodeFile] = useState(null);
  const [StockCodeData, setStockCodeData] = useState([]);
  const [stockCodeErr, setStockCodeErr] = useState("");

  const [departmentData, setDepartmentData] = useState([]);
  const [selectedDepartmentData, setSelectedDepartmentData] = useState("");
  const [depatmentDataErr, setDepatmentDataErr] = useState("");

  const [stoneAssortData, setStoneAssortData] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [stonetData, setStonetData] = useState();
  const [oldStockNameCodeId, setOldStockNameCodeId] = useState([]);

  useEffect(() => {
    NavbarSetting('Sales', dispatch)
  }, []);

  useEffect(() => {
    getDepartment();
  }, []);

  // Get Department
  function getDepartment() {
    Axios.get(Config.getCommonUrl() + "api/admin/getdepartmentlist")
      .then(function (response) {
        let resDepartmentData = response.data.data.filter(
          (s) => s.is_location !== 1
        );
        setDepartmentData(resDepartmentData);
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/admin/getdepartmentlist" });
      });
  }

  // Post data
  function postStoneAssortData() {
    const body = {
      old_stock_name_code_id: oldStockNameCodeId, 
      AddData: stonetData.map((data) => ({
        stock_name_code_id: data.stock_name_code_id,
        variant_code: data.variant_code,
        variant_name: data.variant_name,
        hsn_number: data.hsn_number,
        department_id: selectedDepartmentData.value,
        weight: data.weight,
        pcs: data.pcs,
        available_stock: data.weight,
        available_pcs: data.pcs,
        
      }))
    };
    Axios.post(Config.getCommonUrl() + "api/stockJournal/add", body)
      .then(function (response) {
        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setStonetData([]);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        console.log(error);
        handleError(error, dispatch, {
          api: "api/stockJournal/add",
          body: body,
        });
      });
    // setPcs("");
    // setWeight("");
  }
  useEffect(() => {
    getVoucherNumber();
  }, []);

  function getVoucherNumber() {
    Axios.get(Config.getCommonUrl() + "api/stockJournal/get/voucher/stone")
      .then(function (response) {
        if (response.data.success === true) {
          let responseData = response.data.data;
          console.log(responseData);
          setVoucherNumber(responseData.voucherNo);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/stockJournal/get/voucher/stone",
        });
      });
  }

  useEffect(() => {
    if (selectedDepartmentData) {
      getStoneAssortData();
    }
  }, [selectedDepartmentData]);
  // Get API data
  function getStoneAssortData() {
    const body = {
      department_id: selectedDepartmentData.value,
    };
    Axios.post(Config.getCommonUrl() + `api/stockJournal`, body)
      .then(function (response) {
        if (response.data.success === true) {
          let respStoneAssortData = response.data;
          setStoneAssortData(respStoneAssortData.data);
          setOldStockNameCodeId(respStoneAssortData.data[0].stock_name_code.id)
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: `api/stockJournal`, body });
      });
  }

  useEffect(() => {
    if (docFile) {
      callFileUploadApi(docFile, 19)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            const arrData = response.data.data;
            const fileId = [];
            arrData.map((item) => {
              fileId.push(item.id);
            });
            setDocIds(fileId);
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
        })
        .catch((error) => {
          console.log(error);
          handleError(error, dispatch, {
            api: "api/salespurchasedocs/upload",
            body: docFile,
          });
        });
    }
  }, [docFile]);

  const theme = useTheme();
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
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("YYYY-MM-DD");

    if (name === "Date") {
      setFromDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD");
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal) {
        setFromDtErr("");
      } else {
        setFromDtErr("Enter Valid Date");
      }
    } else if (name === "voucherNumber") {
      setVoucherNumber(value);
      setVoucherNumErr("");
    }
  }
  function handleInputChangeDepartment(value) {
    setSelectedDepartmentData(value);
    setDepatmentDataErr("");
  }
  function handleInputstockecodeChangea(e) {
    setStockCodeFile(e.target.files);
    setStockCodeErr("");
  }

  const handleStockeCodeFileUpload = (e) => {
    e.preventDefault();
    if (stockCodeFile === null) {
      setStockCodeErr("Please choose file");
    } else if (selectedDepartmentData.value === undefined) {
      dispatch(Actions.showMessage({ message: "Please Select Department " }));
    } else {
      const formData = new FormData();
      for (let i = 0; i < stockCodeFile.length; i++) {
        formData.append("file", stockCodeFile[i]);
        formData.append("department_id", selectedDepartmentData.value);
      }
      callStockCodeFileUploadApi(formData);
    }
  };

  function callStockCodeFileUploadApi(formData) {
    setLoading(true);
    const body = formData;
    var api = "api/stockJournal/upload/csv";
    Axios.post(Config.getCommonUrl() + api, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setStockCodeFile("");
          handleClose();
          dispatch(
            Actions.showMessage({
              message: "File Uploaded Successfully",
            })
          );
          setStonetData(response.data.data);
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

  function handleClose() {
    setModalOpen(false);
  }
  function handleModalOpen() {
    setModalOpen(true);
  }

  return (
    <div>
      <div className={clsx(classes.root, "w-full")}>
        <FuseAnimate animation="transition.slideUpIn" delay={200}>
          <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
              <Grid
                className="department-main-dv"
                container
                spacing={4}
                alignItems="stretch"
                style={{paddingInline: "30px" }}
                >
                <Grid item xs={6} sm={6} md={6} key="1" style={{ padding: 0 }}>
                  <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                      Stone Assortment
                    </Typography>
                  </FuseAnimate>

                  {/* <BreadcrumbsHelper /> */}
                </Grid>
              </Grid>
              <div className="main-div-alll" style={{marginTop: "20px"}}>

              {loading && <Loader />}
              <Box >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6} md={3} lg={2}>
                  <p style={{ paddingBottom: "3px" }}>Date</p>

                    <TextField
                      // label="Date"
                      name="Date"
                      value={fromDate}
                      error={fromDtErr.length > 0 ? true : false}
                      helperText={fromDtErr}
                      type="date"
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                      format="yyyy/MM/dd"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={2}>
                  <p style={{ paddingBottom: "3px" }}>Voucher Number</p>

                    <TextField
                      className=""
                      // label="Voucher Number"
                      autoFocus
                      name="voucherNumber"
                      value={voucherNumber}
                      error={voucherNumErr.length > 0 ? true : false}
                      helperText={voucherNumErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={2}>
                  <p style={{ paddingBottom: "3px" }}>Upload Document</p>

                    <TextField
                      // label="Upload Document"
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

                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={2}
                    style={{ position: "relative" }}
                  >
                  <p style={{ paddingBottom: "3px" }}>Department Name</p>

                    <Select
                      filterOption={createFilter({ ignoreAccents: false })}
                      options={departmentData.map((item) => ({
                        value: item.id,
                        label: item.name,
                        key: item.name,
                      }))}
                      name="departmentName"
                      classes={classes}
                      styles={selectStyles}
                      value={selectedDepartmentData}
                      onChange={handleInputChangeDepartment}
                      placeholder="Department Name"
                      fullWidth
                      variant="outlined"
                      style={{ height: "37.6px", background: "#ffffff" }}
                    />
                    <span
                      style={{
                        color: "red",
                        position: "absolute",
                        bottom: "-6px",
                        fontSize: "9px",
                      }}
                    >
                      {depatmentDataErr.length > 0 ? depatmentDataErr : ""}
                    </span>
                  </Grid>
                </Grid>
                <Paper
                  className={classes.tabroot}
                  style={{ marginTop: "20px", height: "auto" }}
                >
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          ID
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Variant Code
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Variant Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          HSN
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Available Stock(Qty)
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Weight
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stoneAssortData?.length > 0 ? (
                        stoneAssortData?.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell className={classes.tableRowPad}>
                              {data.id}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.stock_name_code.stock_code}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.stock_name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.hsn_master.hsn_number}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.stock_name_code.StockData.pcs}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.stock_name_code.StockData.weight}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} style={{textAlign:"center"}}>
                            No data available.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Paper>
              </Box>
              {/* {selectedDepartmentData && ( */}
              <Box style={{paddingTop:"16px"}} >
                <Grid container>
                  <Grid item xs={12} style={{ textAlign: "right" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}

                      onClick={() => {
                        if (selectedDepartmentData) {
                          handleModalOpen();
                        } else {
                          setDepatmentDataErr("Select Department Name!");
                        }
                      }}
                      // onClick={(e) => handleStockeCodeFileUpload(e)}
                    >
                      Excel Upload
                    </Button>
                  </Grid>
                </Grid>
                <Paper
                  className={classes.tabroot}
                  style={{ marginTop: "20px", height: "auto" }}
                >
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          Variant Code
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Variant Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          HSN
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Quantity
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Weight
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stonetData?.length > 0 ? (
                        stonetData?.map((data, index) => (
                          <TableRow key={index}>
                            <TableCell className={classes.tableRowPad}>
                              {data.variant_code}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.variant_name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.hsn_number}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <TextField
                                variant="outlined"
                                type="number"
                                fullWidth
                                className={classes.noArrows}
                                // onChange={(e) => setPcs(e.target.value)}
                                onChange={(e) => {
                                  const updatedData = [...stonetData];
                                  updatedData[index].pcs = e.target.value;
                                  setStonetData(updatedData);
                                }}
                              />
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <TextField
                                variant="outlined"
                                type="number"
                                fullWidth
                                className={classes.noArrows}
                                // onChange={(e) => setWeight(e.target.value)}
                                onChange={(e) => {
                                  const updatedData = [...stonetData];
                                  updatedData[index].weight = e.target.value;
                                  setStonetData(updatedData);
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            No data available
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Paper>
                <Grid container>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      style={{
                        // backgroundColor: "#4caf50",
                        border: "none",
                        color: "white",
                        marginLeft: "auto",
                        display: "block",
                        marginTop:"16px"
                      }}
                      onClick={() => postStoneAssortData()}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              {/* )} */}
            </div>
            </div>
          </div>
        </FuseAnimate>
      </div>
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
              onChange={(e) => handleInputstockecodeChangea(e)}
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
              <a
                href={stoneAssortDataFile}
                download="Stone_Assortment.csv"
              >
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
};

export default StoneAssortment;

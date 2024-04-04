import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
// import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import "jspdf-autotable";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import moment from "moment";
import * as XLSX from "xlsx";
import Loader from "app/main/Loader/Loader";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Select, { createFilter } from "react-select";
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";

const useStyles = makeStyles((theme) => ({
  root: {},
  tableRowPad: {
    padding: 7,
    fontSize: "1.2rem",
  },
  table: {
    minWidth: 650,
  },
}));

const RejectionReport = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    NavbarSetting("Factory Report", dispatch);
  }, []);

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");

  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");

  const [rejectionReportData, setRejectionReportData] = useState([]);

  const [orderNo, setOrderNo] = useState([]);
  const [selectedOrderNo, setSelectedOrderNo] = useState([]);

  const [treeNo, setTreeNo] = useState([]);
  const [selectedTreeNo, setSelectedTreeNo] = useState([]);

  const [designNo, setDesignNo] = useState([]);
  const [selectedDesignNo, setSelectedDesignNo] = useState([]);

  const [metalType, setMetalType] = useState([]);
  const [selectedMetalType, setselectedMetalType] = useState([]);

  const [lotNo, setLotNo] = useState([]);
  const [selectedLotNo, setSelectedLotNo] = useState([]);

  const [processList, setProcessList] = useState([]);
  const [processNameArr, setProcessNameArr] = useState([]);

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("YYYY-MM-DD"); //new Date();

    if (name === "fromDate") {
      setFromDate(value);
      // fromDtValidation()
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal) {
        setFromDtErr("");
      } else {
        setFromDtErr("Enter Valid Date");
      }
    } else if (name === "toDate") {
      setToDate(value);
      // toDtValidation()
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal) {
        setToDtErr("");
      } else {
        setToDtErr("Enter Valid Date");
      }
    }
  }

  function fromDtValidation() {
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    if (!fromDate || dateRegex.test(fromDate) === false) {
      var today = moment().format("YYYY-MM-DD"); //new Date();
      let dateVal = moment(fromDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal) {
        return true;
      } else {
        setFromDtErr("Enter Valid Date!");
        return false;
      }
    }
    return true;
  }

  function toDtValidation() {
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    if (!toDate || dateRegex.test(toDate) === false) {
      var today = moment().format("YYYY-MM-DD"); //new Date();
      let dateVal = moment(toDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      if (dateVal <= today && minDateVal < dateVal) {
        return true;
      } else {
        setToDtErr("Enter Valid Date!");
        return false;
      }
    }
    return true;
  }

  const exportToExcel = (type, fn, dl) => {
    if (rejectionReportData.length > 0) {
      const wb = XLSX.utils.book_new();

      const tbl1 = document.getElementById("tbl_exporttable_to_xls");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(wb, fn || `Rejection_Report.${type || "xlsx"}`);
    } else {
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data" }));
    }
  };

  const downloadPDF = () => {
    if (rejectionReportData.length > 0) {
      const doc = new jsPDF("p", "pt", "a4");
      doc.autoTableSetDefaults({
        startY: 50,
        margin: { top: 70, right: 10, left: 10 },
        tableWidth: "auto",
        showHead: "firstPage",
        tableLineWidth: 0.5,
        headStyles: {
          fillColor: [211, 211, 211],
          textColor: [0, 0, 0],
        },
        footStyles: {
          fillColor: [211, 211, 211],
          textColor: [0, 0, 0],
        },
      });
      const table = document.getElementById("tbl_exporttable_to_xls");
      doc.autoTable({
        html: table,
      });
      doc.save("Rejection_Report.pdf");
    } else {
      dispatch(Actions.showMessage({ message: "Can not Download Empty PDF" }));
    }
  };

  useEffect(() => {
    getOrderNumber();
    getTreeNumber();
    getDesignNumber();
    getMetalNumber();
    getLotNumber();
    getProcessData();
  }, []);

  function getOrderNumber() {
    axios
      .get(Config.getCommonUrl() + `api/productionreport/order/number`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setOrderNo(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/productionreport/order/number`,
        });
      });
  }

  function getTreeNumber() {
    axios
      .get(Config.getCommonUrl() + `api/productionreport/tree/number`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setTreeNo(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/productionreport/tree/number`,
        });
      });
  }

  function getDesignNumber() {
    axios
      .get(Config.getCommonUrl() + `api/productionreport/design/number`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setDesignNo(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/productionreport/design/number`,
        });
      });
  }

  function getMetalNumber() {
    axios
      .get(Config.getCommonUrl() + `api/productionreport/stockGroup/number`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setMetalType(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/productionreport/stockGroup/number`,
        });
      });
  }

  function getLotNumber() {
    axios
      .get(Config.getCommonUrl() + `api/productionreport/lot/number`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setLotNo(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/productionreport/lot/number`,
        });
      });
  }

  function getProcessData() {
    axios
      .get(Config.getCommonUrl() + "api/process")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProcessList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/process" });
      });
  }

  const loadData = () => {
    postRejectionReport();
  };

  useEffect(() => {
    postRejectionReport();
  }, []);

  function postRejectionReport() {
    const orderNumberArray = selectedOrderNo.map((item) => item.label);
    const treeNumberArray = selectedTreeNo.map((item) => item.label);
    const designNumberArray = selectedDesignNo.map((item) => item.label);
    const lotNumberArray = selectedLotNo.map((item) => item.label);
    const processNameArray = processNameArr.map((item) => item.label);
    const MetaltypeArray = selectedMetalType.map((item) => item.label);

    const body = {
      from_date: fromDate,
      to_date: toDate,
      order_number: orderNumberArray,
      design_number: designNumberArray,
      lot_number: lotNumberArray,
      process_name: processNameArray,
      tree_number: treeNumberArray,
      metal_type: MetaltypeArray,
    };
    axios
      .post(
        Config.getCommonUrl() + `api/productionreport/workstation/reject`,
        body
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log(response.data.data);
          setRejectionReportData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/productionreport/workstation/reject`,
          body: body,
        });
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container table-width-mt">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="MetalLedStatement-main pb-16"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Rejection Report
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>

            <div className="main-div-alll">
              <Box style={{ paddingInline: 16, marginTop: 16 }}>
                <Grid
                  className="metalled-statement-pr"
                  container
                  spacing={3}
                  style={{ padding: 20 }}
                >
                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ padding: 5 }}
                  >
                    <label>Start Date</label>
                    <TextField
                      //   label="Start Date"
                      name="fromDate"
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

                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ padding: 5 }}
                  >
                    <label>End Date</label>
                    <TextField
                      //   label="End Date"
                      name="toDate"
                      value={toDate}
                      error={toDtErr.length > 0 ? true : false}
                      helperText={toDtErr}
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

                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ padding: 5 }}
                  >
                    <label>Select Order No</label>
                    <Select
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      value={selectedOrderNo}
                      onChange={(e) => setSelectedOrderNo(e)}
                      options={orderNo.map((item) => ({
                        value: item.id,
                        label: item.order_number,
                      }))}
                      placeholder="Select Order No"
                      isMulti
                    />
                  </Grid>

                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ padding: 5 }}
                  >
                    <label>Select Tree No</label>
                    <Select
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      value={selectedTreeNo}
                      onChange={(e) => setSelectedTreeNo(e)}
                      options={treeNo.map((item) => ({
                        value: item.id,
                        label: item.tree_number,
                      }))}
                      placeholder="Select Tree No"
                      isMulti
                    />
                  </Grid>

                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ padding: 5 }}
                  >
                    <label>Select Design No</label>
                    <Select
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      value={selectedDesignNo}
                      onChange={(e) => setSelectedDesignNo(e)}
                      options={designNo.map((item) => ({
                        value: item.id,
                        label: item.LotDesignData.variant_number,
                      }))}
                      placeholder="Select Design No"
                      isMulti
                    />
                  </Grid>

                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ padding: 5 }}
                  >
                    <label>Select Metal</label>
                    <Select
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      value={selectedMetalType}
                      onChange={(e) => setselectedMetalType(e)}
                      options={metalType.map((item) => ({
                        value: item.id,
                        label: item.group_name,
                      }))}
                      placeholder="Select Metal"
                      isMulti
                    />
                  </Grid>

                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ padding: 5 }}
                  >
                    <label>Select Lot No</label>
                    <Select
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      value={selectedLotNo}
                      onChange={(e) => setSelectedLotNo(e)}
                      options={lotNo.map((item) => ({
                        value: item.id,
                        label: item.number,
                      }))}
                      placeholder="Select Lot No"
                      isMulti
                    />
                  </Grid>

                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ padding: 5 }}
                  >
                    <label>Select Process</label>
                    <Select
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      options={processList.map((optn) => ({
                        value: optn.id,
                        label: optn.process_name,
                      }))}
                      value={processNameArr}
                      onChange={(e) => setProcessNameArr(e)}
                      placeholder="Select Process"
                      isMulti
                    />
                  </Grid>

                  <Grid style={{ marginTop: "25px" }}>
                    <Button
                      className="load_Data-btn ml-8"
                      variant="contained"
                      aria-label="Register"
                      onClick={loadData}
                    >
                      Load Data
                    </Button>
                  </Grid>

                  <Grid style={{ marginTop: "25px" }}>
                    <Button
                      className="export_btn"
                      variant="contained"
                      aria-label="Register"
                      onClick={(event) => {
                        exportToExcel("xlsx");
                      }}
                    >
                      Export
                    </Button>
                  </Grid>

                  <Grid style={{ marginTop: "25px" }}>
                    <Button
                      style={{ width: "100%" }}
                      className="export_btn"
                      variant="contained"
                      aria-label="Register"
                      onClick={downloadPDF}
                    >
                      Download pdf
                    </Button>
                  </Grid>
                </Grid>

                <div
                  className="mt-16 design_list_blg view_design_list_blg"
                  style={{
                    height: "calc(60vh)",
                    overflowX: "auto",
                    overflowY: "auto",
                  }}
                >
                  <Table className={classes.table} id="tbl_exporttable_to_xls">
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          Transaction Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Process
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Order No
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Lot No
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Cat.
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Karat
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Reject Qty
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Reject Gross Weight
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Reject Net Weight
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rejectionReportData.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className={classes.tableRowPad}
                            style={{ textAlign: "center" }}
                          >
                            No Data
                          </TableCell>
                        </TableRow>
                      ) : (
                        rejectionReportData.map((item, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell className={classes.tableRowPad}>
                                {item?.receive_created_at
                                  ? moment(
                                      item?.receive_created_at,
                                      "YYYY-MM-DD"
                                    ).format("DD-MM-YYYY")
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.ProcessDetails?.process_name
                                  ? item?.ProcessDetails?.process_name
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.LotDetails?.Production_lot?.order_number
                                  ? item?.LotDetails?.Production_lot
                                      ?.order_number
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.LotDetails?.number
                                  ? item?.LotDetails?.number
                                  : item?.TreeDetails?.tree_number}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.LotDetails?.LotProductCategory
                                  ?.category_name
                                  ? item?.LotDetails?.LotProductCategory
                                      ?.category_name
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.LotDetails?.purity
                                  ? item?.LotDetails?.purity
                                  : item?.TreeDetails?.purity}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.pcs !== null ? item?.pcs : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.gross_weight ? item?.gross_weight : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.net_weight ? item?.net_weight : "-"}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className={classes.tableRowPad}
                          style={{ border: "1px solid #ddd" }}
                        >
                          <b>Total</b>
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ border: "1px solid #ddd" }}
                        >
                          {parseFloat(
                            Config.numWithComma(
                              HelperFunc.getTotalOfField(
                                rejectionReportData,
                                "pcs"
                              )
                            )
                          ).toFixed(0)}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ border: "1px solid #ddd" }}
                        >
                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(
                              rejectionReportData,
                              "gross_weight"
                            )
                          )}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ border: "1px solid #ddd" }}
                        >
                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(
                              rejectionReportData,
                              "net_weight"
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </Box>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default RejectionReport;

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TableFooter,
  TextField,
  Typography,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
// import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Select, { createFilter } from "react-select";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import moment from "moment";
import * as XLSX from "xlsx";
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";
import Loader from "app/main/Loader/Loader";
import MaUTable from "@material-ui/core/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {},
  tableRowPad: {
    padding: 7,
    fontSize: "1.2rem",
  },
  leftBorder: {
    borderLeft: "1px solid darkgray",
  },
  hoverClass: {
    // backgroundColor: "#fff",
    color: "#1e90ff",
    "&:hover": {
      // backgroundColor: "#999",
      cursor: "pointer",
    },
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    tableLayout: "auto",
    minWidth: 1000,
  },
  tableFooter: {
    padding: 7,
    backgroundColor: "#E3E3E3",
  },
}));
const FilingWIPReport = (props) => {
  const classes = useStyles();
  const theme = useTheme();
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

  const [loading, setLoading] = useState(false);
  const [apiData, SetApiData] = useState([]);

  const [workStationList, setWorkStationList] = useState([]);
  const [processList, setProcessList] = useState([]);
  const ktArr = [
    { value: 91.8 },
    { value: 83.5 },
    { value: 75.1 },
    { value: 58.5 },
  ];
  const [productCategory, setProductCategory] = useState([]);
  const orderInfoList = [
    {
      id: 0,
      name: "Not Casted",
    },
    {
      id: 1,
      name: "Casted",
    },
  ];
  const [departmentList, setDepartmentList] = useState([]);

  const [searchData, setSearchData] = useState({
    from_date: moment().startOf("month").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    sp_from_date: "",
    sp_to_date: "",
    work_station: [],
    process_name: [],
    purity: [],
    category: [],
    order_info: { value: 1, label: "Casted" },
    department_name: [],
    days: "",
    errors: {},
  });
  const [resetFlag, setResetFlag] = useState(false);
  
useEffect(() => {
    NavbarSetting("Factory Report", dispatch);
  }, []);

  useEffect(() => {
    getWorkStationList();
    getProcessData();
    getProductCategories();
    departmentData();
    getFilingData();
  }, []);

  useEffect(() => {
    console.log(resetFlag);
    if (resetFlag) {
      console.log("asfsd");
      getFilingData();
    }
  }, [resetFlag]);

  function getWorkStationList() {
    Axios.get(Config.getCommonUrl() + "api/workstation")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setWorkStationList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/workstation",
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
  function departmentData() {
    Axios.get(Config.getCommonUrl() + "api/admin/getdepartmentlist")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setDepartmentList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/admin/getdepartmentlist" });
      });
  }
  console.log(searchData);
 
  const getFilingData = () => {
    SetApiData([]);
    const body = {
      order_info: searchData.order_info.value,
      process_name: searchData.process_name.map((item) => item.label),
      purity: searchData.purity.map((item) => item.value),
      category: searchData.category.map((item) => item.label),
      department_name: searchData.department_name.map((item) => item.label),
      work_station: searchData.work_station.map((item) => item.label),
      days: searchData.days ? [parseFloat(searchData.days)] : [],
      from_date: searchData.from_date,
      to_date: searchData.to_date,
      sp_from_date: searchData.sp_from_date,
      sp_to_date: searchData.sp_to_date,
    };
    axios
      .post(Config.getCommonUrl() + "api/productionreport/casted/process", body)
      .then((response) => {
        if (response.data.data.length !== 0) {
          console.log(response);
          SetApiData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: "No Data" }));
        }
        setLoading(false);
        setResetFlag(false);
      })
      .catch((error) => {
        setLoading(false);
        setResetFlag(false);
        handleError(error, dispatch, {
          api: "api/productionreport/casted/process",
          body,
        });
      });
  };
  const HandleLoadData = () => {
    if (validateDates()) {
      getFilingData();
    }
  };
  const resetFuncCall = () => {
    setSearchData({
      from_date: moment().startOf("month").format("YYYY-MM-DD"),
      to_date: moment().format("YYYY-MM-DD"),
      sp_from_date: "",
      sp_to_date: "",
      work_station: [],
      process_name: [],
      purity: [],
      category: [],
      order_info: { value: 1, label: "Casted" },
      department_name: [],
      days: "",
      errors: {},
    });
    setResetFlag(true);
  };

  console.log(searchData);
  const validateDates = () => {
    const fromDate = searchData.from_date
      ? moment(searchData.from_date, "YYYY-MM-DD")
      : "";
    const toDate = searchData.to_date
      ? moment(searchData.to_date, "YYYY-MM-DD")
      : "";
    const spFromDate = searchData.sp_from_date;
    const spToDate = searchData.sp_to_date;
    const updatedArr = { ...searchData };
    let isValid = true;

    if (!fromDate) {
      console.log("safdsa asdf");
      updatedArr.errors.from_date = "Enter Valid From Date";
      isValid = false;
    } else {
      updatedArr.errors.from_date = "";
    }

    if (!toDate) {
      updatedArr.errors.to_date = "Enter Valid To Date";
      isValid = false;
    } else {
      updatedArr.errors.to_date = "";
    }
    if (fromDate && toDate && fromDate.isAfter(toDate)) {
      updatedArr.errors.from_date = "From Date cannot be after To Date";
      isValid = false;
    }

    if (spToDate || spFromDate) {
      if (spToDate && !spFromDate) {
        updatedArr.errors.sp_from_date = "Enter Valid Shipment From Date";
        isValid = false;
      }
      if (spFromDate && !spToDate) {
        updatedArr.errors.sp_to_date = "Enter Valid Shipment To Date";
        isValid = false;
      }
    } else {
      updatedArr.errors.sp_from_date = "";
      updatedArr.errors.sp_to_date = "";
    }

    if (spFromDate && spToDate) {
      console.log("spFromDate:", spFromDate);
      console.log("spToDate:", spToDate);
      if (moment(spFromDate).isAfter(moment(spToDate))) {
        updatedArr.errors.sp_from_date =
          "Shipment From Date cannot be after Shipment To Date";
        isValid = false;
      } else {
        updatedArr.errors.sp_from_date = "";
      }
    }

    setSearchData(updatedArr);
    return isValid;
  };

  const exportToExcel = (type, fn, dl) => {
    if (apiData.length > 0) {
      const wb = XLSX.utils.book_new();

      const tbl1 = document.getElementById("tbl_exporttable_to_xls2");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(wb, fn || `Filing_Report.${type || "xlsx"}`);
    } else {
      dispatch(
        Actions.showMessage({
          message: "Can not Export Empty Data",
          variant: "error",
        })
      );
    }
  };

  const downloadPDF = () => {
    if (apiData.length > 0) {
      const doc = new jsPDF("l", "pt", "a4");
      doc.autoTableSetDefaults({
        startY: 50,
        margin: { top: 70, right: 10, left: 10 },
        tableWidth: "auto",
        showHead: "firstPage",
        showFoot: "lastPage",
        tableLineWidth: 0.5,
        headStyles: {
          fillColor: [211, 211, 211], // Background color as RGB
          textColor: [0, 0, 0], // Text color as RGB
        },
        footStyles: {
          fillColor: [211, 211, 211], // Background color as RGB
          textColor: [0, 0, 0], // Text color as RGB
        },
      });

      const table = document.getElementById("tbl_exporttable_to_xls");
      doc.autoTable({
        html: table,
      });
      doc.save("Filing_Report.pdf");
    } else {
      dispatch(
        Actions.showMessage({
          message: "Can not Download Empty PDF",
          variant: "error",
        })
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    if (name === "days" && !/^\d*$/.test(value)) {
      return;
    }
    const updatedArr = { ...searchData };

    updatedArr[name] = value;
    updatedArr.errors = {
      ...updatedArr.errors,
      [name]: "",
    };
    console.log(updatedArr);
    setSearchData(updatedArr);
  };
  const handleSelect = (selectedOpt, name) => {
    console.log(selectedOpt);
    setSearchData({
      ...searchData,
      [name]: selectedOpt,
    });
  };

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
                    Filing WIP Report
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>
            <div className="main-div-alll">
            <Box style={{ paddingInline: 16, marginTop: 16 }}>
              {loading && <Loader />}
              <Grid
                className="metalled-statement-pr"
                container
                spacing={3}
                style={{ padding: 20 }}
              >
              <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>From Date</label>
                  <TextField
                    // label="From Date"
                    name="from_date"
                    value={searchData.from_date}
                    error={Boolean(searchData.errors.from_date)}
                    helperText={searchData.errors?.from_date}
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
                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>To Date</label>
                  <TextField
                    // label="To Date"
                    name="to_date"
                    value={searchData.to_date}
                    error={Boolean(searchData.errors.to_date)}
                    helperText={searchData.errors?.to_date}
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
                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Shipment From Date</label>
                  <TextField
                    // label="Shipment From Date"
                    name="sp_from_date"
                    value={searchData.sp_from_date}
                    error={Boolean(searchData.errors.sp_from_date)}
                    helperText={searchData.errors?.sp_from_date}
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
                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Shipment To Date</label>
                  <TextField
                    // label="Shipment To Date"
                    name="sp_to_date"
                    value={searchData.sp_to_date}
                    error={Boolean(searchData.errors.sp_to_date)}
                    helperText={searchData.errors?.sp_to_date}
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
                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Worker / Work Station Name</label>
                  <Select
                    filterOption={createFilter({
                      ignoreAccents: false,
                    })}
                    placeholder="Worker / Work Station Name"
                    options={workStationList.map((data) => ({
                      value: data.id,
                      label: data.name,
                    }))}
                    value={searchData.work_station}
                    onChange={(e) => handleSelect(e, "work_station")}
                    isMulti
                  />
                </Grid>
                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Select Process</label>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={processList.map((optn) => ({
                      value: optn.id,
                      label: optn.process_name,
                    }))}
                    value={searchData.process_name}
                    onChange={(e) => handleSelect(e, "process_name")}
                    placeholder="Select Process"
                    isMulti
                  />
                </Grid>
                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Select KT</label>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={ktArr.map((item) => ({
                      value: item.value,
                      label: item.value,
                    }))}
                    value={searchData.purity}
                    onChange={(e) => handleSelect(e, "purity")}
                    placeholder="Select KT"
                    isMulti
                  />
                </Grid>
                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Category Name</label>
                  <Select
                    className={clsx(
                      classes.selectBox,
                      "purchase-select-dv selectsales-dv"
                    )}
                    filterOption={createFilter({
                      ignoreAccents: false,
                    })}
                    styles={selectStyles}
                    options={productCategory.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.category_name,
                    }))}
                    isMulti
                    value={searchData.category}
                    onChange={(e) => handleSelect(e, "category")}
                    placeholder="Category Name"
                  />
                </Grid>
                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Order Info</label>
                  <Select
                    placeholder="Order Info"
                    styles={{ selectStyles }}
                    options={orderInfoList.map((group) => ({
                      value: group.id,
                      label: group.name,
                    }))}
                    value={searchData.order_info}
                    onChange={(e) => handleSelect(e, "order_info")}
                    filterOption={createFilter({ ignoreAccents: false })}
                  />
                </Grid>
                {searchData.order_info.value === 1 && (
                  <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Day</label>
                    <TextField
                    //   label="Day"
                      name="days"
                      value={searchData.days}
                      type="text"
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                )}
                <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Department Name</label>
                  <Select
                    id="heading-select-input"
                    classes={clsx(classes, "mb-16")}
                    filterOption={createFilter({ ignoreAccents: false })}
                    styles={selectStyles}
                    value={searchData.department_name}
                    onChange={(e) => handleSelect(e, "department_name")}
                    optionsProps={{
                      style: {
                        height: "10px",
                        backgroundColor: "red",
                      },
                    }}
                    isMulti
                    options={departmentList.map((suggestion) => {
                      return {
                        value: suggestion.id,
                        label: suggestion.name,
                      };
                    })}
                    placeholder="Department Name"
                  />
                </Grid>
                <Grid style={{ marginTop: "25px" }}>
                <Button
                   className="load_Data-btn ml-8"
                   variant="contained"
                   aria-label="Register"
                    onClick={HandleLoadData}
                  >
                    Load Data
                  </Button>
                </Grid>
                <Grid style={{ marginTop: "25px" }}>
                <Button
                   className="load_Data-btn ml-8"
                   variant="contained"
                   aria-label="Register"
                    onClick={() => resetFuncCall()}
                  >
                    Reset
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
                style={{width: "100%"}}
                  className="export_btn"
                  variant="contained"
                  aria-label="Register"
                    onClick={downloadPDF}
                  >
                    Download pdf
                  </Button>
                </Grid>
              </Grid>
              <Paper>
                <Table className={classes.table} id="tbl_exporttable_to_xls">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ paddingLeft: 20 }}
                      >
                        Issue
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Casting Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Shipment
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Days
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Worker
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Operation Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Lot No
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>KT</TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Lot Categoty
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        Pieces
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="right"
                        style={{ paddingRight: 20 }}
                      >
                        GWT
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={11}
                          className={classes.tableRowPad}
                          align="center"
                        >
                          <div style={{textAlign: "center"}}>No Data</div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      apiData.map((item, i) => {
                        console.log(item);
                        return (
                          <TableRow key={i}>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ paddingLeft: 20 }}
                            >
                              {item.issue_created_at &&
                                moment(item.issue_created_at).format(
                                  "DD-MM-YYYY"
                                )}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item.LotDetails.casted_date &&
                                moment(item.LotDetails.casted_date).format(
                                  "DD-MM-YYYY"
                                )}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item.LotDetails.shipping_date &&
                                moment(item.LotDetails.shipping_date).format(
                                  "DD-MM-YYYY"
                                )}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item.LotDetails.days
                                ? item.LotDetails.days
                                : "-"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item.WorkStationDetails.name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item.ProcessDetails.process_name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item.LotDetails.number}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item.LotDetails.purity}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item.LotDetails.LotProductCategory
                                ? item.LotDetails.LotProductCategory
                                    .category_name
                                : "-"}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="right"
                            >
                              {item.pcs ? item.pcs : "-"}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="right"
                              style={{ paddingRight: 20 }}
                            >
                              {item.gross_weight ? item.gross_weight : "-"}
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
                        style={{ paddingLeft: 20 }}
                      >
                        <b>Total</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        <b>
                          {Config.numWithoutDecimal(
                            HelperFunc.getTotalOfField(apiData, "pcs")
                          )}
                        </b>
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="right"
                        style={{ paddingRight: 20 }}
                      >
                        <b>
                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(apiData, "gross_weight")
                          )}
                        </b>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
                <Table
                  className={classes.table}
                  id="tbl_exporttable_to_xls2"
                  style={{ display: "none" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad}>
                        Issue
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Casting Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Shipment
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Days
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Worker
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Operation Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Lot No
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>KT</TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Lot Categoty
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Pieces
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>GWT</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={11}
                          className={classes.tableRowPad}
                          align="center"
                        >
                          No Data
                        </TableCell>
                      </TableRow>
                    ) : (
                      apiData.map((item, i) => {
                        console.log(item);
                        return (
                          <TableRow key={i}>
                            <TableCell className={classes.tableRowPad}>
                              {moment(
                                item.issue_created_at,
                                "YYYY-MM-DD"
                              ).format("YYYY-MM-DD")}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {moment(
                                item.LotDetails.casted_date,
                                "YYYY-MM-DD"
                              ).format("YYYY-MM-DD")}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {moment(
                                item.LotDetails.shipping_date,
                                "YYYY-MM-DD"
                              ).format("YYYY-MM-DD")}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item.LotDetails.days
                                ? item.LotDetails.days
                                : "-"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item.WorkStationDetails.name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item.ProcessDetails.process_name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item.LotDetails.number}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item.LotDetails.purity}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item.LotDetails.LotProductCategory
                                ? item.LotDetails.LotProductCategory
                                    .category_name
                                : "-"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item.pcs ? item.pcs : "-"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item.gross_weight ? item.gross_weight : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={6} className={classes.tableRowPad}>
                        <b>Total</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b>
                          {Config.numWithoutDecimal(
                            HelperFunc.getTotalOfField(apiData, "pcs")
                          )}
                        </b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b>
                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(apiData, "gross_weight")
                          )}
                        </b>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </Paper>
            </Box>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default FilingWIPReport;

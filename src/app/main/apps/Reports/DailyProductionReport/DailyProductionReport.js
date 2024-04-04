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
const DailyProductionReport = (props) => {
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
  const [apiData, setApiData] = useState([]);

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
    getDailyProductionData();
  }, []);

  useEffect(() => {
    console.log(resetFlag);
    if (resetFlag) {
      console.log("asfsd");
      getDailyProductionData();
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
  const getDailyProductionData = () => {
    setApiData([]);
    const body = {
      // order_info: searchData.order_info.value,
      // process_name: searchData.process_name.map((item) => item.label),
      purity: searchData.purity.map((item) => item.value),
      // category: searchData.category.map((item) => item.label),
      department_id: searchData.department_name.map((item) => item.value),
      // wotk_station: searchData.work_station.map((item) => item.label),
      // days: searchData.days ? [parseFloat(searchData.days)] : [],
      from_date: searchData.from_date,
      to_date: searchData.to_date,
      // sp_from_date: searchData.sp_from_date,
      // sp_to_date: searchData.sp_to_date,
    };
    axios
      .post(
        Config.getCommonUrl() +
          "api/productionReport/daily/producion/formate-1",
        body
      )
      .then((response) => {
        console.log(response);
        if (response.data.Data.length !== 0) {
          setApiData(response.data.Data);
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
          api: "api/productionReport/daily/producion/formate-1",
          body,
        });
      });
  };
  const HandleLoadData = () => {
    if (validateDates()) {
      getDailyProductionData();
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
    const updatedArr = { ...searchData };
    let isValid = true;
    console.log(fromDate);
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

    console.log(updatedArr);

    setSearchData(updatedArr);
    return isValid;
  };

  const exportToExcel = (type, fn, dl) => {
    if (apiData.length > 0) {
      const wb = XLSX.utils.book_new();

      const tbl1 = document.getElementById("tbl_exporttable_to_xls");
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
      const doc = new jsPDF("p", "pt", "a4");
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
                    Daily Production Report Format - 1
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>

            <div className="main-div-alll">
            <Box style={{ paddingInline: 16, marginTop: 16 }}>
              {loading && <Loader />}
              {console.log(searchData)}
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
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        colSpan={2}
                        align="center"
                      >
                        Today
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        colSpan={2}
                        align="center"
                      >
                        All
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ paddingLeft: 20 }}
                      >
                        Dep. Name / Worker Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Categoty
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        Fress Net
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        Stone Pcs
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        Fress Net
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="center"
                        style={{ paddingRight: 20 }}
                      >
                        Stone Pcs
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className={classes.tableRowPad}
                          align="center"
                        >
                          <div style={{textAlign: "center"}}> No Data </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      apiData.map((data, i) => {
                        console.log(data);
                        return data.category_details.map((item, index) => {
                          console.log(item);
                          return (
                            <TableRow key={index}>
                              {index === 0 && (
                                <TableCell
                                  className={classes.tableRowPad}
                                  style={{ paddingLeft: 20 }}
                                  rowSpan={data.category_details.length}
                                >
                                  {data.department_name}
                                </TableCell>
                              )}
                              <TableCell className={classes.tableRowPad}>
                                {item.category_name}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="center"
                              >
                                {item.current_total_net_weight}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="center"
                              >
                                {item.current_total_stone_pcs}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="center"
                              >
                                {item.total_net_weight}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="center"
                                style={{ paddingRight: 20 }}
                              >
                                {item.total_stone_pcs}
                              </TableCell>
                            </TableRow>
                          );
                        });
                      })
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className={classes.tableRowPad}
                        style={{ paddingLeft: 20 }}
                      >
                        <b>Total</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        <b>
                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(
                              apiData.flatMap((obj) => obj.category_details),
                              "current_total_net_weight"
                            )
                          )}
                        </b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        <b>
                          {Config.numWithoutDecimal(
                            HelperFunc.getTotalOfFieldNoDecimal(
                              apiData.flatMap((obj) => obj.category_details),
                              "current_total_stone_pcs"
                            )
                          )}
                        </b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        <b>
                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(
                              apiData.flatMap((obj) => obj.category_details),
                              "total_net_weight"
                            )
                          )}
                        </b>
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="center"
                        style={{ paddingRight: 20 }}
                      >
                        <b>
                          {Config.numWithoutDecimal(
                            HelperFunc.getTotalOfFieldNoDecimal(
                              apiData.flatMap((obj) => obj.category_details),
                              "total_stone_pcs"
                            )
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

export default DailyProductionReport;

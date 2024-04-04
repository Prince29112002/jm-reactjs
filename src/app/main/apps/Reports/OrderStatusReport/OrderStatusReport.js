import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  TableFooter,
  TablePagination,
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
  },
  table: {
    tableLayout: "auto",
    minWidth: "max-content",
  },
  tableFooter: {
    padding: 7,
    backgroundColor: "#E3E3E3",
  },
}));
const OrderStatusReport = (props) => {
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

  const [page, setPage] = React.useState(0);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [orderNo, setOrderNo] = useState([]);
  const [salesmanArr, setSalesmanArr] = useState([]);
  const [partyNameArr, setPartyNameArr] = useState([]);
  const [distributerArr, setDistributerArr] = useState([]);
  const [retailerList, setRetailerList] = useState([]);
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
  const orderTypeArr = [
    { id: 0, name: "Customer" },
    { id: 2, name: "Cart" },
    { id: 3, name: "Exhibition" },
    { id: 4, name: "Link" },
  ];
  const [departmentList, setDepartmentList] = useState([]);

  const [searchData, setSearchData] = useState({
    from_date: moment().startOf("month").format("YYYY-MM-DD"),
    to_date: moment().format("YYYY-MM-DD"),
    purity: {},
    order_number: {},
    order_type: {},
    retailer_name: {},
    distributer_name: {},
    salesman_name: {},
    order_status: {},
    errors: {},
  });
  const [resetFlag, setResetFlag] = useState(false);

  useEffect(() => {
    NavbarSetting("Factory Report", dispatch);
  }, []);

  useEffect(() => {
    getWorkStationList();
    // getPartyName();
    getProcessData();
    getProductCategories();
    departmentData();
    getOrderNumber();
    getDistributerList();
    getSalesmanList();
  }, []);

  useEffect(() => {
    console.log(resetFlag);
    if (resetFlag) {
      console.log("asfsd");
      setPage(0);
      setFilters();
    }
  }, [resetFlag]);

  useEffect(() => {
    // setSearching(false);
    const timeout = setTimeout(() => {
      setApiData([]);
      setCount(0);
      setPage(0);
      setFilters();
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (apiData.length > 0 && page && count) {
      setFilters(Number(page + 1));
    }
  }, [page]);
  console.log(searchData);
  function setFilters(tempPageNo) {
    console.log(tempPageNo);
    console.log("asdfdadsf sdgf");
    let url = "api/productionreport/productionorders/datewiseReport?";

    if (page !== "") {
      if (!tempPageNo) {
        url = url + "page=" + 1;
      } else {
        url = url + "page=" + tempPageNo;
      }
    }
    if (searchData.from_date !== "") {
      url = url + "&from_date=" + searchData.from_date;
    }
    if (searchData.to_date !== "") {
      url = url + "&to_date=" + searchData.to_date;
    }
    if (Object.keys(searchData.purity).length !== 0) {
      url = url + "&purity=" + searchData.purity.label;
    }
    if (Object.keys(searchData.order_number).length !== 0) {
      url = url + "&order_number=" + searchData.order_number.label;
    }
    if (Object.keys(searchData.order_type).length !== 0) {
      url = url + "&order_type=" + searchData.order_type.value;
    }
    if (Object.keys(searchData.retailer_name).length !== 0) {
      url = url + "&retailer_name=" + searchData.retailer_name.label;
    }
    if (Object.keys(searchData.distributer_name).length !== 0) {
      url = url + "&party_name=" + searchData.distributer_name.label;
    }
    if (Object.keys(searchData.salesman_name).length !== 0) {
      url = url + "&salesman_name=" + searchData.salesman_name.label;
    }
    if (Object.keys(searchData.order_status).length !== 0) {
      url = url + "&order_status=" + searchData.order_status.label;
    }

    console.log(url, "---------", tempPageNo);
    if (!tempPageNo) {
      console.log(11111111111111);
      orderListData(url);
    } else {
      if (count > apiData.length) {
        orderListData(url);
      }
    }
  }

  function getSalesmanList() {
    axios
      .get(Config.getCommonUrl() + `api/salesManMaster/salesMan/dropDown`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setSalesmanArr(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/salesManMaster/salesMan/dropDown`,
        });
      });
  }

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
  // function getPartyName() {
  //   axios
  //     .get(Config.getCommonUrl() + `api/client/all/client`)
  //     .then(function (response) {
  //       console.log(response);
  //       if (response.data.success === true) {
  //         console.log(response.data.data);
  //         setPartyNameArr(response.data.data);
  //       } else {
  //         dispatch(Actions.showMessage({ message: response.data.message }));
  //       }
  //     })
  //     .catch((error) => {
  //       handleError(error, dispatch, {
  //         api: `api/client/all/client`,
  //       });
  //     });
  // }
  function getDistributerList() {
    axios
      .get(Config.getCommonUrl() + `api/client/all/client`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log(response.data.data);
          setDistributerArr(response.data.data);
        } else {
          setDistributerArr([]);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/client/all/client`,
        });
      });
  }
  function getRetailerList(id) {
    axios
      .get(
        Config.getCommonUrl() +
          `api/distributormaster/distributor-retailer/${id}`
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log(response.data.data);
          setRetailerList(response.data.data);
        } else {
          setRetailerList([]);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/distributormaster/distributor-retailer/${id}`,
        });
      });
  }
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
  const orderListData = (url) => {
    console.log(url);
    setApiData([]);
    axios
      .get(Config.getCommonUrl() + url)
      .then((response) => {
        if (response.data.success === true) {
          console.log(response);
          let rows = response.data.data;
          setCount(Number(response.data.count));
          if (apiData.length === 0) {
            setApiData(rows);
          } else {
            console.log("else", apiData);
            setApiData((apiData) => [...apiData, ...rows]);
          }
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
          api: url,
        });
      });
  };
  const HandleLoadData = () => {
    if (validateDates()) {
      setFilters();
    }
  };
  const resetFuncCall = () => {
    setSearchData({
      from_date: moment().startOf("month").format("YYYY-MM-DD"),
      to_date: moment().format("YYYY-MM-DD"),
      purity: {},
      order_number: {},
      order_type: {},
      retailer_name: {},
      distributer_name: {},
      salesman_name: {},
      order_status: {},
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
        : XLSX.writeFile(wb, fn || `Order_List_Report.${type || "xlsx"}`);
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
      doc.save("Order_List_Report.pdf");
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
    if (name === "distributer_name") {
      getRetailerList(selectedOpt.value);
    }
  };

  function handleChangePage(event, newPage) {
    console.log(newPage);
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 10 > apiData.length) {
      setFilters(Number(newPage + 1));
    }
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
                    Order Status Report
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
                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ padding: 5 }}
                  >
                    <label>Order From Date</label>
                    <TextField
                      // label="Order From Date"
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
                  <Grid
                    item
                    lg={2}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ padding: 5 }}
                  >
                    <label>Order To Date</label>
                    <TextField
                      // label="Order To Date"
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
                  {console.log(searchData.order_number)}
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
                      value={
                        Object.keys(searchData.order_number).length !== 0
                          ? searchData.order_number
                          : ""
                      }
                      onChange={(e) => handleSelect(e, "order_number")}
                      options={orderNo.map((item) => ({
                        value: item.id,
                        label: item.order_number,
                      }))}
                      placeholder="Select Order No"
                      // isClearable
                      // isMulti
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
                    <label>Select Order Type</label>
                    <Select
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      value={
                        Object.keys(searchData.order_type).length !== 0
                          ? searchData.order_type
                          : ""
                      }
                      onChange={(e) => handleSelect(e, "order_type")}
                      options={orderTypeArr.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      placeholder="Select Order Type"
                      // isClearable
                      // isMulti
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
                    <label>Select Salesman</label>
                    {console.log(salesmanArr)}
                    <Select
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      value={
                        Object.keys(searchData.salesman_name).length !== 0
                          ? searchData.salesman_name
                          : ""
                      }
                      onChange={(e) => handleSelect(e, "salesman_name")}
                      options={salesmanArr.map((item) => ({
                        value: item.id,
                        label: item.full_name,
                      }))}
                      placeholder="Select Salesman"
                      // isClearable
                      // isMulti
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
                    <label>Select Distributer Name</label>
                    <Select
                      styles={{ selectStyles }}
                      options={distributerArr.map((group) => ({
                        value: group.id,
                        label: group.name,
                      }))}
                      placeholder="Select Distributer Name"
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={
                        Object.keys(searchData.distributer_name).length !== 0
                          ? searchData.distributer_name
                          : ""
                      }
                      onChange={(e) => handleSelect(e, "distributer_name")}
                      // isClearable
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
                    <label>Select Retailer Name</label>
                    <Select
                      styles={{ selectStyles }}
                      options={retailerList.map((group) => ({
                        value: group.id,
                        label: group.company_name,
                      }))}
                      placeholder="Select Retailer Name"
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={
                        Object.keys(searchData.retailer_name).length !== 0
                          ? searchData.retailer_name
                          : ""
                      }
                      onChange={(e) => handleSelect(e, "retailer_name")}
                      // isClearable
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
                    <label>Select KT</label>
                    <Select
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      options={ktArr.map((item) => ({
                        value: item.value,
                        label: item.value,
                      }))}
                      value={
                        Object.keys(searchData.purity).length !== 0
                          ? searchData.purity
                          : ""
                      }
                      onChange={(e) => handleSelect(e, "purity")}
                      placeholder="Select KT"
                      // isClearable
                      // isMulti
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
                    <label>Order Info</label>
                    <Select
                      placeholder="Order Info"
                      styles={{ selectStyles }}
                      options={orderInfoList.map((group) => ({
                        value: group.id,
                        label: group.name,
                      }))}
                      value={
                        Object.keys(searchData.order_status).length !== 0
                          ? searchData.order_status
                          : ""
                      }
                      onChange={(e) => handleSelect(e, "order_status")}
                      filterOption={createFilter({ ignoreAccents: false })}
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
                <TablePagination
                  labelRowsPerPage=""
                  component="div"
                  count={count}
                  rowsPerPage={10}
                  page={page}
                  backIconButtonProps={{
                    "aria-label": "Previous Page",
                  }}
                  nextIconButtonProps={{
                    "aria-label": "Next Page",
                  }}
                  onPageChange={handleChangePage}
                />
                <Paper className={classes.tabroot}>
                  <Table className={classes.table} id="tbl_exporttable_to_xls">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ paddingLeft: 20 }}
                        >
                          Order Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Salesman
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Distributor
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Touch
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Order Summary Net Wgt
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Order Type
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Order Num
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Net Wgt Approx
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Wax Issue Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Wax Rec. Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Wax Setting Issue Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Wax Setting Rec. Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Received Metal Again Order
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Received Metal Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          No. OF Tree
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Casting Done Net Weight
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Used (Order Net Weight)
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Used in witch Order No
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          First Casting Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Last Casting Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Fast Dispatch Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          last Dispatch Date
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ paddingRight: 20 }}
                        >
                          Order Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {console.log(apiData)}
                      {apiData.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={23}
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
                              <TableCell
                                className={classes.tableRowPad}
                                style={{ paddingLeft: 20 }}
                              >
                                {item.exhibitionOrder?.order_date}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.exhibitionOrder?.salesman_name
                                  ? item.exhibitionOrder?.salesman_name
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.exhibitionOrder.distributor_name}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.exhibitionOrder.touch}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.exhibitionOrder.order_summary_net_weight.map(
                                  (item, i) => (
                                    <span key={i}>
                                      {i !== 0 && (
                                        <b style={{ paddingInline: 3 }}>|</b>
                                      )}
                                      {item.category_name}-
                                      {item.total_net_weight}
                                    </span>
                                  )
                                )}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.exhibitionOrder.order_type}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.exhibitionOrder.order_number}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.exhibitionOrder.total_net_weight}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.waxIssueDate?.wax_issue_date
                                  ? item.waxIssueDate?.wax_issue_date
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.waxReceivedDate?.wax_received_date
                                  ? item.waxReceivedDate?.wax_received_date
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.waxSettingIssueDate?.waxSetting_issue_date
                                  ? item.waxSettingIssueDate
                                      ?.waxSetting_issue_date
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.waxSettingReceiveDate
                                  ?.waxSetting_receive_date
                                  ? item.waxSettingReceiveDate
                                      ?.waxSetting_receive_date
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* Received Metal Again Order */}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* Received Metal Date */}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.numberOfTrees?.number_of_trees
                                  ? item.numberOfTrees?.number_of_trees
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.castingNetWeight?.net_weight
                                  ? item.castingNetWeight?.net_weight
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* {item.waxSettingReceiveDate
                                ? item.waxSettingReceiveDate
                                : "-"} */}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* {item.waxSettingReceiveDate
                                ? item.waxSettingReceiveDate
                                : "-"} */}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* {item.waxSettingReceiveDate
                                ? item.waxSettingReceiveDate
                                : "-"} */}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* {item.waxSettingReceiveDate
                                ? item.waxSettingReceiveDate
                                : "-"} */}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.firstCastingDate?.first_casted_date}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.lastCastedDate?.last_casted_date}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{ paddingRight: 20 }}
                              >
                                {/* {item.order_status} */}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className={classes.tableRowPad}
                          style={{ paddingLeft: 20 }}
                        >
                          <b>Total</b>
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <b>
                            {Config.numWithComma(
                              HelperFunc.getTotalOfField(
                                apiData.map((order) => order.exhibitionOrder),
                                "total_net_weight"
                              )
                            )}
                          </b>
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          colSpan={6}
                        ></TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <b>
                            {Config.numWithoutDecimal(
                              HelperFunc.getTotalOfField(
                                apiData
                                  .map((order) => order?.numberOfTrees ?? null)
                                  .filter(
                                    (numberOfTrees) => numberOfTrees !== null
                                  ),
                                "number_of_trees"
                              )
                            )}
                          </b>
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <b>
                            {Config.numWithComma(
                              HelperFunc.getTotalOfField(
                                apiData
                                  .map(
                                    (order) => order?.castingNetWeight ?? null
                                  )
                                  .filter(
                                    (castingNetWeight) =>
                                      castingNetWeight !== null
                                  ),
                                "net_weight"
                              )
                            )}
                          </b>
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          colSpan={6}
                        ></TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ paddingRight: 20 }}
                        ></TableCell>
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
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ paddingLeft: 20 }}
                        >
                          Sr. No.
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Order Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Order Conf. Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Order No.
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Party Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Retailer Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Purity
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Region (Screw Type)
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Total Order Net Weight
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ paddingRight: 20 }}
                        >
                          Order Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiData.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={10}
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
                              <TableCell
                                className={classes.tableRowPad}
                                style={{ paddingLeft: 20 }}
                              >
                                {i + 1}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {moment(item.order_date, "DD-MM-YYYY").format(
                                  "YYYY-MM-DD"
                                )}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {moment(
                                  item.order_confirmed_date,
                                  "DD-MM-YYYY"
                                ).format("YYYY-MM-DD")}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.order_number}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.party_name}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.retailer_name}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.karat}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.screw_type}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.order_net_weight}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{ paddingRight: 20 }}
                              >
                                {item.order_status}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className={classes.tableRowPad}
                          style={{ paddingLeft: 20 }}
                        >
                          <b>Total</b>
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <b>
                            {Config.numWithComma(
                              HelperFunc.getTotalOfField(
                                apiData,
                                "order_net_weight"
                              )
                            )}
                          </b>
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ paddingRight: 20 }}
                        ></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </Paper>
                <TablePagination
                  labelRowsPerPage=""
                  component="div"
                  count={count}
                  rowsPerPage={10}
                  page={page}
                  backIconButtonProps={{
                    "aria-label": "Previous Page",
                  }}
                  nextIconButtonProps={{
                    "aria-label": "Next Page",
                  }}
                  onPageChange={handleChangePage}
                />
              </Box>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default OrderStatusReport;

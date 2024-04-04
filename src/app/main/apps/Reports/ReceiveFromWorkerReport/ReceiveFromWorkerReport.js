import React, { useState, useEffect } from "react";
import { Box, TableFooter, TextField, Typography } from "@material-ui/core";
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
    minWidth: 650,
  },
  tableFooter: {
    padding: 7,
    backgroundColor: "#E3E3E3",
  },
}));
const ReceiveFromWorkerReport = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [partyType, setpartyType] = useState("");
  const [parttyErr, setPartTypeErr] = useState("");

  const [partyName, setPartyName] = useState([]);
  const [selectedPartyName, setSelectedPartyName] = useState("");
  const [partNameErr, setPartyNameErr] = useState("");

  const [apiData, setApiData] = useState([]);

  const [processList, setProcessList] = useState([]);

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");

  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");

  const [orderNo, setOrderNo] = useState([]);
  const [selectedOrderNo, setSelectedOrderNo] = useState([]);

  const [partyNameArr, setPartyNameArr] = useState([]);
  const [selectedPartyNameArr, setSelectedPartyNameArr] = useState([]);

  const [selectedKtArr, setsSelectedKtArr] = useState([]);

  const [processNameArr, setProcessNameArr] = useState([]);

  const [castingFromDate, setCastingFromDate] = useState("");
  const [castingFromDtErr, setCastingFromDtErr] = useState("");

  const [castingToDate, setCastingToDate] = useState("");
  const [castingToDtErr, setCastingToDtErr] = useState("");

  const [shipmentFromDate, setShipmentFromDate] = useState("");
  const [shipmentFromDateErr, setShipmentFromDateErr] = useState("");

  const [shipmentToDate, setShipmentToDate] = useState("");
  const [shipmentToDateErr, setShipmentToDateErr] = useState("");

  const [receiveFromWorkerData, setReceiveFromWorkerData] = useState([]);

  const roleOfUser = localStorage.getItem("permission")
    ? JSON.parse(localStorage.getItem("permission"))
    : null;
  const [authAccessArr, setAuthAccessArr] = useState([]);

  useEffect(() => {
    if (
      roleOfUser &&
      roleOfUser["Report"] &&
      roleOfUser["Report"]["Party Wise Metal Account Balance"]
    ) {
      const arr = roleOfUser["Report"]["Party Wise Metal Account Balance"];
      const arrData = arr.map((item) => item.name);
      setAuthAccessArr(arrData);
    } else {
      setAuthAccessArr([]);
    }
  }, []);

  useEffect(() => {
    NavbarSetting("Factory Report", dispatch);
  }, []);

  useEffect(() => {
    getProcessData();
  }, []);

  const ktArr = [
    { value: 91.8 },
    { value: 83.5 },
    { value: 75.1 },
    { value: 58.5 },
  ];

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  function handelPartyType(value) {
    setpartyType(value);
    setPartTypeErr("");
    setPartyName([]);
    setSelectedPartyName("");
    setPartyNameErr("");
    getpackingData();
    setApiData([]);
  }

  function handleChangeState(value) {
    setSelectedPartyName(value);
    setPartyNameErr("");
  }

  function countryValidation() {
    if (partyType === "") {
      setPartTypeErr("Please Select Party Type");
      return false;
    }
    return true;
  }

  function getpackingData() {
    axios
      .get(Config.getCommonUrl() + "api/vendor/clientOrvendorOrjwr/dropdown")
      .then(function (response) {
        if (response.data.success === true) {
          setPartyName(response.data.data);
          let data = response.data.data;
          const selectClientArr = [];
          data.map((optn) => {
            selectClientArr.push(optn.value);
          });
          const selectClient = [];
          data.map((item) => {
            if (selectClientArr.includes(item.id)) {
              selectClient.push({
                value: item.id,
                label: item.name,
              });
            }
          });
          setSelectedPartyName(selectClient);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/vendor/both/client",
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

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("YYYY-MM-DD"); //new Date();

    if (name === "fromDate") {
      setFromDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal) {
        setFromDtErr("");
      } else {
        setFromDtErr("Enter Valid Date");
      }
    } else if (name === "toDate") {
      setToDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal) {
        setToDtErr("");
      } else {
        setToDtErr("Enter Valid Date");
      }
    } else if (name === "casting_from_date") {
      setCastingFromDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (
        (dateVal <= today && minDateVal < dateVal) ||
        (castingToDate === "" && value === "")
      ) {
        setCastingFromDtErr("");
        setCastingToDtErr("");
      } else {
        setCastingFromDtErr("Enter casting Valid From Date");
      }
    } else if (name === "casting_to_date") {
      setCastingToDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (
        (dateVal <= today && minDateVal < dateVal) ||
        (castingFromDate === "" && value === "")
      ) {
        setCastingToDtErr("");
        setCastingFromDtErr("");
      } else {
        setCastingToDtErr("Enter casting Valid To Date");
      }
    } else if (name === "sp_from_date") {
      setShipmentFromDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (
        (dateVal <= today && minDateVal < dateVal) ||
        (shipmentToDate === "" && value === "")
      ) {
        setShipmentFromDateErr("");
        setShipmentToDateErr("");
      } else {
        setShipmentFromDateErr("Enter Shipment Valid From Date");
      }
    } else if (name === "sp_to_date") {
      setShipmentToDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (
        (dateVal <= today && minDateVal < dateVal) ||
        (shipmentFromDate === "" && value === "")
      ) {
        setShipmentToDateErr("");
        setShipmentFromDateErr("");
      } else {
        setShipmentToDateErr("Enter Shipment Valid To Date");
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

  function castingFromDtValidation() {
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    if (!castingFromDate || dateRegex.test(castingFromDate) === false) {
      var today = moment().format("YYYY-MM-DD"); //new Date();
      let dateVal = moment(castingFromDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal) {
        return true;
      } else if (castingToDate === "" && castingFromDate === "") {
        setCastingFromDtErr("");
        setCastingToDtErr("");
      } else {
        setCastingFromDtErr("Enter Valid Casting Date!");
        return false;
      }
    }
    return true;
  }

  function castingToDtValidation() {
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    if (!castingToDate || dateRegex.test(castingToDate) === false) {
      var today = moment().format("YYYY-MM-DD"); //new Date();
      let dateVal = moment(castingToDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      if (dateVal <= today && minDateVal < dateVal) {
        return true;
      } else if (castingToDate === "" && castingFromDate === "") {
        setCastingToDtErr("");
        setCastingFromDtErr("");
      } else {
        setCastingToDtErr("Enter Valid Casting Date!");
        return false;
      }
    }
    return true;
  }

  function shipmentFromDtValidation() {
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    if (!shipmentFromDate || dateRegex.test(shipmentFromDate) === false) {
      var today = moment().format("YYYY-MM-DD"); //new Date();
      let dateVal = moment(shipmentFromDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal) {
        return true;
      } else if (shipmentToDate === "" && shipmentFromDate === "") {
        setCastingFromDtErr("");
        setCastingToDtErr("");
      } else {
        setCastingFromDtErr("Enter Valid Shipment Date!");
        return false;
      }
    }
    return true;
  }

  function shipmentToDtValidation() {
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    if (!shipmentToDate || dateRegex.test(shipmentToDate) === false) {
      var today = moment().format("YYYY-MM-DD"); //new Date();
      let dateVal = moment(shipmentToDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      if (dateVal <= today && minDateVal < dateVal) {
        return true;
      } else if (shipmentFromDate === "" && shipmentToDate === "") {
        setCastingFromDtErr("");
        setCastingToDtErr("");
      } else {
        setCastingToDtErr("Enter Valid Shipment Date!");
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    postRecievefromWorkStation();
  }, []);

  const loadData = () => {
    postRecievefromWorkStation();
    setFilters();
  };

  function setFilters() {
    if (castingFromDate) {
      if (castingToDate === "") {
        setCastingToDtErr("Enter Casting End Date!");
      }
    }

    if (castingToDate) {
      if (castingFromDate === "") {
        setCastingFromDtErr("Enter Casting Start Date!");
      }
    }

    if (shipmentFromDate) {
      if (shipmentToDate === "") {
        setShipmentToDateErr("Enter Shipment End Date!");
      }
    }

    if (shipmentToDate) {
      if (shipmentFromDate === "") {
        setShipmentFromDateErr("Enter Shipment Start Date!");
      }
    }

    if (fromDate === "" && toDate === "") {
      console.log("return");
      return;
    }

    let url = `api/metalledger/partywise/balance/metal-acc/report`;
    if (fromDate === "") {
      setFromDtErr("Enter Valid Date!");
      return;
    }

    if (toDate === "") {
      setToDtErr("Enter Valid Date!");
      return;
    }

    if (
      moment(new Date(fromDate)).format("YYYY-MM-DD") >
      moment(new Date(toDate)).format("YYYY-MM-DD") >
      moment(new Date(castingFromDate)).format("YYYY-MM-DD") >
      moment(new Date(castingToDate)).format("YYYY-MM-DD") >
      moment(new Date(shipmentFromDate)).format("YYYY-MM-DD") >
      moment(new Date(shipmentToDate)).format("YYYY-MM-DD")
    ) {
      setToDtErr("Enter Valid Date!");
      return;
    }

    if (fromDate !== "" || toDate !== "") {
      if (
        fromDtValidation() &&
        toDtValidation() &&
        countryValidation() &&
        castingFromDtValidation() &&
        castingToDtValidation() &&
        shipmentFromDtValidation() &&
        shipmentToDtValidation()
      ) {
        url =
          url +
          "?start=" +
          fromDate +
          "&end=" +
          toDate +
          "&is_vendor_client=" +
          partyType.value +
          "?start=" +
          castingFromDate +
          "&end=" +
          shipmentToDate +
          "?start=" +
          shipmentFromDate +
          "&end=" +
          castingToDate;
      } else {
        console.log("Date return");
        return;
      }
    }

    getbarcodedata(url);
  }

  function getbarcodedata(url) {
    setLoading(true);
    const selectedPackings = selectedPartyName.map((x) => {
      console.log(selectedPartyName.length === 0);
      return x.value;
    });

    const packingdataalll = partyName.map((opt) =>
      opt.type === partyType.value ? opt.id : []
    );
    const body = {
      client_vendor_jobworker_id:
        selectedPartyName.length === 0 ? packingdataalll : selectedPackings,
    };
    axios
      .post(Config.getCommonUrl() + url, body)
      .then((response) => {
        if (response.data.data.length !== 0) {
          console.log(response);
          setApiData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: "No Data" }));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: url, body });
      });
  }

  const exportToExcel = (type, fn, dl) => {
    if (receiveFromWorkerData.length > 0) {
      const wb = XLSX.utils.book_new();

      const tbl1 = document.getElementById("tbl_exporttable_to_xls2");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(wb, fn || `Receive_From_Worker.${type || "xlsx"}`);
    } else {
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data" }));
    }
  };

  const partyTypeData = [
    { value: 2, label: "Customer" },
    { value: 1, label: "Vendor" },
    { value: 3, label: "Jobworker" },
  ];

  const downloadPDF = () => {
    if (apiData.length > 0) {
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
      doc.save("Receeive_From_Worker.pdf");
    } else {
      dispatch(Actions.showMessage({ message: "Can not Download Empty PDF" }));
    }
  };

  useEffect(() => {
    getOrderNumber();
    getPartyName();
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

  function getPartyName() {
    axios
      .get(Config.getCommonUrl() + `api/client/all/client`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log(response.data.data);
          setPartyNameArr(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/client/all/client`,
        });
      });
  }

  function postRecievefromWorkStation() {
    const orderNumberArray = selectedOrderNo.map((item) => item.label);
    const processNameArray = processNameArr.map((item) => item.label);
    const partyNameArray = selectedPartyNameArr.map((item) => item.label);
    const purityArray = selectedKtArr.map((item) => item.label);

    const body = {
      order_number: orderNumberArray,
      process_name: processNameArray,
      client_name: partyNameArray,
      purity: purityArray,

      from_date: fromDate,
      to_date: toDate,

      casting_from_date: castingFromDate,
      casting_to_date: castingToDate,

      sp_from_date: shipmentFromDate,
      sp_to_date: shipmentToDate,
    };
    axios
      .post(
        Config.getCommonUrl() + `api/productionreport/receive/workstation`,
        body
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log(response.data.data);
          setReceiveFromWorkerData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/productionreport/receive/workstation`,
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
                    Receive From Worker Report
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
                      // label="Start Date"
                      name="fromDate"
                      value={fromDate}
                      error={fromDtErr.length > 0 ? true : false}
                      helperText={fromDtErr}
                      type="date"
                      // onKeyDown={(e) => e.preventDefault()}
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
                      // label="End Date"
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
                    <label>Select Party Name</label>
                    <Select
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      options={partyNameArr.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      value={selectedPartyNameArr}
                      onChange={(e) => setSelectedPartyNameArr(e)}
                      placeholder="Select Party Name"
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
                    <label>Select KT</label>
                    <Select
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      options={ktArr.map((item) => ({
                        value: item.value,
                        label: item.value,
                      }))}
                      value={selectedKtArr}
                      onChange={(e) => setsSelectedKtArr(e)}
                      placeholder="Select KT"
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
                    <label>Casting Start Date</label>
                    <TextField
                      // label="Casting Start Date"
                      name="casting_from_date"
                      value={castingFromDate}
                      error={castingFromDtErr.length > 0 ? true : false}
                      helperText={castingFromDtErr}
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
                    <label>Casting End Date</label>
                    <TextField
                      // label="Casting End Date"
                      name="casting_to_date"
                      value={castingToDate}
                      error={castingToDtErr.length > 0 ? true : false}
                      helperText={castingToDtErr}
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
                    <label>Shipment Start Date</label>
                    <TextField
                      // label="Shipment Start Date"
                      name="sp_from_date"
                      value={shipmentFromDate}
                      error={shipmentFromDateErr.length > 0 ? true : false}
                      helperText={shipmentFromDateErr}
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
                    <label>Shipment End Date</label>
                    <TextField
                      // label="Shipment End Date"
                      name="sp_to_date"
                      value={shipmentToDate}
                      error={shipmentToDateErr.length > 0 ? true : false}
                      helperText={shipmentToDateErr}
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

                  {/* {authAccessArr.includes(
                  "Export Party Wise Metal Account Balance"
                ) && ( */}
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
                  {/* )} */}

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
                {loading && <Loader />}

                <div
                  className="mt-16 design_list_blg view_design_list_blg"
                  style={{
                    height: "calc(60vh)",
                    // width: "calc(82vw)",
                    overflowX: "auto",
                    overflowY: "auto",
                    // margin: "10px 10px 30px 10px",
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
                          KT
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Cat.
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Receive Pcs
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Gross Weight
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Net Weight
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {receiveFromWorkerData.length === 0 ? (
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
                        receiveFromWorkerData.map((item, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell className={classes.tableRowPad}>
                                {item.LotDetails.shipping_date
                                  ? moment(
                                      item.LotDetails.shipping_date,
                                      "YYYY-MM-DD"
                                    ).format("DD-MM-YYYY")
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.ProcessDetails.process_name
                                  ? item.ProcessDetails.process_name
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.LotDetails.Production_lot.order_number
                                  ? item.LotDetails.Production_lot.order_number
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.LotDetails.number
                                  ? item.LotDetails.number
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.LotDetails.purity !== null
                                  ? item.LotDetails.purity
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.LotDetails.LotProductCategory
                                  .category_name
                                  ? item.LotDetails.LotProductCategory
                                      .category_name
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.pcs !== null ? item.pcs : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.gross_weight !== null
                                  ? item.gross_weight
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.net_weight !== null
                                  ? item.net_weight
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item?.LotDetails.fresh_reject === 0
                                  ? "Fresh"
                                  : item?.LotDetails.fresh_reject === 1
                                  ? "Reject"
                                  : "-"}
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
                                receiveFromWorkerData,
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
                              receiveFromWorkerData,
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
                              receiveFromWorkerData,
                              "net_weight"
                            )
                          )}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ border: "1px solid #ddd" }}
                        >
                          {" "}
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
                          KT
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Cat.
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Receive Pcs
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Gross Weight
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Net Weight
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {receiveFromWorkerData.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className={classes.tableRowPad}
                          >
                            No Data
                          </TableCell>
                        </TableRow>
                      ) : (
                        receiveFromWorkerData.map((item, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell className={classes.tableRowPad}>
                                {item.LotDetails.shipping_date
                                  ? item.LotDetails.shipping_date
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.ProcessDetails.process_name
                                  ? item.ProcessDetails.process_name
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.LotDetails.Production_lot.order_number
                                  ? item.LotDetails.Production_lot.order_number
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.LotDetails.number
                                  ? item.LotDetails.number
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.LotDetails.purity !== null
                                  ? item.LotDetails.purity
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.LotDetails.LotProductCategory
                                  .category_name
                                  ? item.LotDetails.LotProductCategory
                                      .category_name
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.pcs !== null ? item.pcs : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.gross_weight !== null
                                  ? item.gross_weight
                                  : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {item.net_weight !== null
                                  ? item.net_weight
                                  : "-"}
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
                                receiveFromWorkerData,
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
                              receiveFromWorkerData,
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
                              receiveFromWorkerData,
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

export default ReceiveFromWorkerReport;

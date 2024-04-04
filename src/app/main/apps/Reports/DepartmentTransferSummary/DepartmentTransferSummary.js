import React, { useState, useEffect, useRef } from "react";
import { Typography, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
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
import moment from "moment";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as XLSX from "xlsx";
import Loader from "app/main/Loader/Loader";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    // minWidth: 650,
  },
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
}));

const DepartmentTransferSummary = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    NavbarSetting("Factory Report", dispatch);
  }, []);

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

  const [fromeDepartment, setfromeDepartment] = useState([]);
  const [fromeDepartmentData, setfromeDepartmentData] = useState("");
  const [fromeDepartmentErr, setFromeDepartmentErr] = useState("");

  const [toDepartment, setToDepartment] = useState([]);
  const [toDepartmentData, setToDepartmentData] = useState("");
  const [toDepartmentErr, setToDepartmentErr] = useState("");

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");

  const [apiData, setApiData] = useState([]);
  const [apiDataSecond, setApiDataSecond] = useState([]);

  const [fromDate, setFromDate] = useState(
    moment().startOf("report").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");

  const [report, setReportType] = useState("");
  const [reportErr, setReportTypeErr] = useState("");
  const [meterialType, setmeterialType] = useState("");
  const [meterialTypeErr, setmeterialTypeErr] = useState("");

  const [gtPices, setgtPices] = useState("");
  const [gtgrossWT, setgtgrossWT] = useState("");
  const [gtNetWT, setgtNetWT] = useState("");
  const [gtstoneWT, setgtstoneWT] = useState("");
  const [gtotherWT, setgtotherWT] = useState("");

  const [gtSecPices, setGtSectPices] = useState("");
  const [gtSecgrossWT, setGtSectgrossWT] = useState("");
  const [gtSecNetWT, setGtSectNetWT] = useState("");
  const [gtSecstoneWT, setGtSectstoneWT] = useState("");
  const [gtSecotherWT, setGtSectotherWT] = useState("");


  function handleChangeFromePartyType(value) {
    setfromeDepartmentData(value);
    setFromeDepartmentErr("");
    setToDepartmentErr("");
    setToDepartmentData("");
    setReportTypeErr("");
    setmeterialTypeErr("");
    setApiData([]);
    setApiDataSecond([]);
  }
  function handleChangeToPartyType(value) {
    setToDepartmentData(value);
    setReportTypeErr("");
    setFromeDepartmentErr("");
    setToDepartmentErr("");
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
    }
  }

  function handlereport(value) {
    setReportType(value);
    setReportTypeErr("");
    setApiData([]);
    setApiDataSecond([]);
  }

  function handelmeterialType(value) {
    setmeterialType(value);
    setmeterialTypeErr("");
    setApiData([]);
    setApiDataSecond([]);
    setgtPices("");
    setgtgrossWT("");
    setgtNetWT("");
    setgtstoneWT("");
    setgtotherWT("");
    setGtSectPices("");
    setGtSectgrossWT("");
    setGtSectNetWT("");
    setGtSectstoneWT("");
    setGtSectotherWT("");
  }
  useEffect(() => {
    getFromeDepartment();
    geTotDepartment();
  }, []);

  function getFromeDepartment() {
    axios
      .get(Config.getCommonUrl() + "api/admin/getdepartmentlist")
      .then(function (response) {
        if (response.data.success === true) {
          let data = response.data.data.filter((s) => s.is_location !== 1);
          setfromeDepartment(data);
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
          setfromeDepartmentData(selectClient);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant:"error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/admin/getdepartmentlist" });
      });
  }

  function geTotDepartment() {
    axios
      .get(Config.getCommonUrl() + "api/admin/getdepartmentlist")
      .then(function (response) {
        if (response.data.success === true) {
          let data = response.data.data.filter((s) => s.is_location !== 1);
          setToDepartment(data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant:"error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/admin/getdepartmentlist" });
      });
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

  function fromdepartmentValidation() {
    if (fromeDepartmentData.length === 0) {
      setFromeDepartmentErr("select frome Department");
      return false;
    }
    return true;
  }
  function todeparValidation() {
    if (toDepartmentData.length === 0) {
      setToDepartmentErr("select To Department");
      return false;
    }
    setToDepartmentErr("");
    return true;
  }

  function reportTypeValidation() {
    if (report.value === undefined) {
      setReportTypeErr("select Report Type");
      return false;
    }
    return true;
  }
  function meterialTypeValidation() {
    if (meterialType.value === undefined) {
      setmeterialTypeErr("select Meterial Type");
      return false;
    }
    return true;
  }

  function setFilters() {
    if (report.value === 1) {
      let url = `api/stock/departmentTransferReportTypeOne`;

      if (
        fromDtValidation() &&
        toDtValidation() &&
        fromdepartmentValidation() &&
        todeparValidation() &&
        reportTypeValidation() &&
        meterialTypeValidation()
      ) {
        url = url + "?startDate=" + fromDate + "&endDate=" + toDate;
      } else {
        console.log("Date return");
        return;
      }

      getbarcodedata(url);
    } else {
      let urls = `api/stock/departmentTransferReportTypeTwo`;

      if (
        fromDtValidation() &&
        toDtValidation() &&
        fromdepartmentValidation() &&
        todeparValidation() &&
        reportTypeValidation() &&
        meterialTypeValidation()
      ) {
        urls = urls + "?startDate=" + fromDate + "&endDate=" + toDate;
      } else {
        console.log("Date return");
        return;
      }

      getbarcodedatasec(urls);
    }
  }

  function getbarcodedata(url) {
    setLoading(true);
    const departmentID = fromeDepartmentData.map((x) => {
      return x.value;
    });
    const body = {
      from_department_id: departmentID,
      to_department_id: toDepartmentData.value,
    };
    axios
      .post(Config.getCommonUrl() + url, body)
      .then((response) => {
        if (response.data !== null) {
          const apiData = response.data.data;
          const dynamicKeys = Object.keys(apiData);

          const allData = [];
          let Picessome = 0;
          let grossWeightSum = 0;
          let netWightSum = 0;
          let stonewightSum = 0;
          let otherwightSum = 0;

          dynamicKeys.forEach((key) => {
            apiData[key].items.forEach((e, index) => {
              if (e.flag === meterialType.value) {
                allData.push({
                  karat: key,
                  count: index === 0 ? null : apiData[key].items.length,
                  ...e,
                });
                Picessome += e?.pcs;
                grossWeightSum += parseFloat(e?.gross_weight);
                netWightSum += parseFloat(e?.net_weight);
                if (!isNaN(parseFloat(e?.stone_weight))) {
                  stonewightSum += parseFloat(e?.stone_weight);
                }
                otherwightSum += parseFloat(e?.other_weight);
              }
            });
          });
          if (allData.length === 0) {
            dispatch(Actions.showMessage({ message: "No Data", variant:"error"}));
          } else {
            dispatch(
              Actions.showMessage({ message: "Data Fetched Successfully", variant:"success"})
            );
            setgtPices(Picessome);
            setgtgrossWT(grossWeightSum.toFixed(3));
            setgtNetWT(netWightSum.toFixed(3));
            setgtstoneWT(stonewightSum.toFixed(3));
            setgtotherWT(otherwightSum.toFixed(3));
            setApiData(allData);
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant:"error"}));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: url, body });
      });
  }

  function getbarcodedatasec(urls) {
    setLoading(true);
    const departmentID = fromeDepartmentData.map((x) => {
      return x.value;
    });
    const body = {
      from_department_id: departmentID,
      to_department_id: toDepartmentData.value,
    };
    axios
      .post(Config.getCommonUrl() + urls, body)
      .then((response) => {
        if (response.data !== null) {
          const apiDataSecond = response.data.data;
          const dynamicKeysseccond = Object.keys(apiDataSecond);

          const allDataSecond = [];
          let secPicessome = 0;
          let secgrossWeightSum = 0;
          let secnetWightSum = 0;
          let secstonewightSum = 0;
          let secotherwightSum = 0;

          dynamicKeysseccond.map((key, value) => {
            apiDataSecond[key].items.map((e, index) => {
              if (e.flag === meterialType.value) {
                allDataSecond.push({
                  karatsecond: key,
                  countsecond:
                    index == 0 ? null : apiDataSecond[key].items.length,
                  ...e,
                });
                secPicessome += e?.pcs;
                secgrossWeightSum += parseFloat(e?.gross_weight);
                secnetWightSum += parseFloat(e?.net_weight);
                if (!isNaN(parseFloat(e?.stone_weight))) {
                  secstonewightSum += parseFloat(e?.stone_weight);
                }
                secotherwightSum += parseFloat(e?.other_weight);
              }
            });
          });
          if (allDataSecond.length === 0) {
            dispatch(Actions.showMessage({ message: "No Data", variant:"error"}));
          } else {
            dispatch(
              Actions.showMessage({ message: "Data Fetched Successfully",variant:"success"})
            );
            setGtSectPices(secPicessome);
            setGtSectgrossWT(secgrossWeightSum.toFixed(3));
            setGtSectNetWT(secnetWightSum.toFixed(3));
            setGtSectstoneWT(secstonewightSum.toFixed(3));
            setGtSectotherWT(secotherwightSum.toFixed(3));
            setApiDataSecond(allDataSecond);
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant:"error"}));
          setLoading(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: urls, body });
      });
  }

  function handelExele() {
    const tble1 = document.getElementById("tbl_exporttable_to_xls");
    {
      tble1 && exportToExcel("xlsx");
    }
    const tble2 = document.getElementById("tbl_exporttable_to_xls2");
    {
      tble2 && exportToExce2("xlsx");
    }
  }

  const exportToExcel = (type, fn, dl) => {
    const tble1 = document.getElementById("tbl_exporttable_to_xls");

    if (tble1 && apiData.length !== 0) {
      const wb = XLSX.utils.book_new();
      const tbl1 = document.getElementById("tbl_exporttable_to_xls");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);

      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(
            wb,
            fn || `Barcode_Generatoration_Report.${type || "xlsx"}`
          );
    } else {
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data",variant:"error"}));
    }
  };  

  const exportToExce2 = (type, fn, dl) => {
    const tble2 = document.getElementById("tbl_exporttable_to_xls2");

    if (tble2 && apiDataSecond.length !== 0) {
      const wb = XLSX.utils.book_new();
      const tbl1 = document.getElementById("tbl_exporttable_to_xls2");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);

      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(
            wb,
            fn || `Barcode_Generatoration_Report.${type || "xlsx"}`
          );
    } else {
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data",variant:"error"}));
    }
  };

  const reportyType = [
    { value: 1, label: "Report Type 1" },
    { value: 2, label: "Report Type 2" },
  ];

  const meterialTypeData = [
    { value: 1, label: "Loose Metal" },
    { value: 2, label: "Other Material " },
    { value: 3, label: "Lot List" },
    { value: 4, label: "Barcode list" },
    { value: 5, label: "Packet list" },
    { value: 6, label: "Packing slip" },
    { value: 7, label: "Findings" },
    { value: 8, label: "Consumable" },
  ];

  const calculateTotalGrossWeight = (purity) => {
    let total = 0;
    apiData.forEach((element) => {
      if (element.purity === purity) {
        total += element.gross_weight;
      }
    });
    return total;
  };

  const calculateTotalNetWeight = (purity) => {
    let total = 0;
    apiData.forEach((element) => {
      if (element.purity === purity) {
        total += element.net_weight;
      }
    });
    return total;
  };

  const calculateTotalStoneWeight = (purity) => {
    let total = 0;
    apiData.forEach((element) => {
      if (element.purity === purity) {
        total += element.stone_weight == null ? 0 : element.stone_weight;
      }
    });
    return total;
  };

  const calculateTotalOtherWeight = (purity) => {
    let total = 0;
    apiData.forEach((element) => {
      if (element.purity === purity) {
        total += element.other_wgt;
      }
    });
    return total;
  };
  const calculateTotalPcs = (purity) => {
    let total = 0;
    apiData.forEach((element) => {
      if (element.purity === purity) {
        total += element.pcs;
      }
    });
    return total;
  };

  const secondCalculateTotalGrossWeight = (purity) => {
    let total = 0;
    apiDataSecond.forEach((element) => {
      if (element.purity === purity) {
        total += element.gross_weight;
      }
    });
    return total;
  };

  const secondCalculateTotalNetWeight = (purity) => {
    let total = 0;
    apiDataSecond.forEach((element) => {
      if (element.purity === purity) {
        total += element.net_weight;
      }
    });
    return total;
  };

  const secondCalculateTotalStoneWeight = (purity) => {
    let total = 0;
    apiDataSecond.forEach((element) => {
      if (element.purity === purity) {
        total += element.stone_weight == null ? 0 : element.stone_weight;
      }
    });
    return total;
  };

  const secondCalculateTotalOtherWeight = (purity) => {
    let total = 0;
    apiDataSecond.forEach((element) => {
      if (element.purity === purity) {
        total += element.other_weight;
      }
    });
    return total;
  };
  const secondCalculateTotalPcs = (purity) => {
    let total = 0;
    apiDataSecond.forEach((element) => {
      if (element.purity === purity) {
        total += element.pcs;
      }
    });
    return total;
  };


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="jewellerypreturn-main pb-16"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                key="1"
                style={{ padding: 0 }}
                // className="metal-purchase-input-ml"
              >
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Department Transfer Summary
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll">

            <Grid
              // className="metalled-statement-pr"
              container
              spacing={12}
              // style={{ padding: 20 }}
            >
              <Grid item lg={3} md={4} sm={6} xs={12} style={{ padding: 5 }}>
                <p style={{ paddingBottom: "3px" }}>Select from deparment</p>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  classes={classes}
                  styles={selectStyles}
                  // options={partyTypeData
                  options={fromeDepartment.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  value={fromeDepartmentData}
                  onChange={handleChangeFromePartyType}
                  isMulti
                  placeholder="Select from deparment
"
                />
                <span style={{ color: "red" }}>
                  {fromeDepartmentErr.length > 0 ? fromeDepartmentErr : ""}
                </span>
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12} style={{ padding: 5 }}>
                <p style={{ paddingBottom: "3px" }}>Select To Deparment</p>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  classes={classes}
                  styles={selectStyles}
                  options={toDepartment.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  value={toDepartmentData}
                  onChange={handleChangeToPartyType}
                  placeholder="Select to deparment"
                />
                <span style={{ color: "red" }}>
                  {toDepartmentErr.length > 0 ? toDepartmentErr : ""}
                </span>
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12} style={{ padding: 5 }}>
              <p style={{ paddingBottom: "3px" }}>Select report type</p>
              <Select
                  classes={classes}
                  styles={selectStyles}
                  options={reportyType.map((optn) => ({
                    value: optn.value,
                    label: optn.label,
                  }))}
                  filterOption={createFilter({
                    ignoreAccents: false,
                  })}
                  onChange={handlereport}
                  placeholder="Select report type "
                />
                <span style={{ color: "red" }}>
                  {meterialTypeErr.length > 0 ? meterialTypeErr : ""}
                </span>
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12} style={{ padding: 5 }}>
                <p style={{ paddingBottom: "3px" }}>Select Material type</p>
                <Select
                  classes={classes}
                  styles={selectStyles}
                  options={meterialTypeData.map((optn) => ({
                    value: optn.value,
                    label: optn.label,
                  }))}
                  filterOption={createFilter({
                    ignoreAccents: false,
                  })}
                  onChange={handelmeterialType}
                  placeholder="Select material type "
                />
                <span style={{ color: "red" }}>
                {meterialTypeErr.length > 0 ? meterialTypeErr : ""}
                </span>
              </Grid>
    
              <Grid item lg={3} md={4} sm={6} xs={12} style={{ padding: 5 }}>
              <p style={{ paddingBottom: "3px" }}>Start Date</p>
                <TextField
                  name="fromDate"
                  value={fromDate}
                  error={fromDtErr.length > 0 ? true : false}
                  helperText={fromDtErr}
                  type="date"
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    max: moment().format("YYYY-MM-DD"),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item lg={3} md={4} sm={6} xs={12} style={{ padding: 5 }}>
              <p style={{ paddingBottom: "3px" }}>End Date</p>
                <TextField
                  name="toDate"
                  value={toDate}
                  error={toDtErr.length > 0 ? true : false}
                  helperText={toDtErr}
                  type="date"
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  fullWidth
                  inputProps={{
                    max: moment().format("YYYY-MM-DD"),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

               <Grid className="mt-28" item lg={6} md={12} sm={12} xs={12} style={{display:"flex", justifyContent:"end"}}>
                <Button
                 className="report-btn ml-5"
                  variant="contained"
                  color="primary"
                  aria-label="Register"
                  onClick={(event) => {
                    setFilters();
                  }}
                >
                  Load Data
                </Button>
                <Button
                 className="report-btn ml-5"
                  variant="contained"
                  color="primary"
                  aria-label="Register"
                  onClick={(event) => {
                    handelExele();
                  }}
                >
                  Export
                </Button>
              </Grid>

              {/* <Grid
                item
                lg={2}
                md={4}
                sm={4}
                xs={12}
                style={{ padding: 5, color: "red" }}
              >
                
              </Grid> */}
            </Grid>
            {report.value === undefined || report.value === 1 ? (
              <div className="mt-16 mb-16 metalled_statements_blg metalled_statements_table">
                <Table aria-label="simple table" id="tbl_exporttable_to_xls">
                  <TableHead>
                    <TableRow>
                    <TableCell
                      >
                      </TableCell> 
                      <TableCell
                        className={classes.tableRowPad}
                        style={{paddingLeft:"39%"}}
                        colSpan={9}
                      >
                        Report No:1
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.tableRowPad} align="left">
                        Karat Code
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Lot No
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Lot Category
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Source Wcgroup
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Dest Wcgroup
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Pieces
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Gross Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        NET WT
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Stone Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Other Weight
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {apiData.map((element, index) => (
                      <>
                        <TableRow key={index + 1}>
                          {console.log(element, "element")}
                          {element.count === null || element.count === 2 ? (
                            <TableCell className={classes.tableRowPad}>
                              {element.karat}
                            </TableCell>
                          ) : (
                            element.count && (
                              <TableCell
                                rowSpan={element.count}
                                className={classes.tableRowPad}
                              >
                                {element.karat}
                              </TableCell>
                            )
                          )}

                          <TableCell className={classes.tableRowPad}>
                            {element.stock_name_code}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.category_name}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.from_department}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.to_department}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.pcs}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.gross_weight.toFixed(3)}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.net_weight.toFixed(3)}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.stone_weight == null
                              ? "0.000"
                              : element.stone_weight.toFixed(3)}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.other_weight.toFixed(3)}
                          </TableCell>
                        </TableRow>
                        {(index === apiData.length - 1 ||
                          element.karat !== apiData[index + 1].karat) && (
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              align="left"
                              className={classes.tableRowPad}
                            >
                              <b>Total:</b>
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b> {calculateTotalPcs(element.purity)}</b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                                {calculateTotalGrossWeight(
                                  element.purity
                                ).toFixed(3)}
                              </b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                                {" "}
                                {calculateTotalNetWeight(
                                  element.purity
                                ).toFixed(3)}
                              </b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                                {" "}
                                {calculateTotalStoneWeight(
                                  element.purity
                                ).toFixed(3)}
                              </b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                                {" "}
                                {calculateTotalOtherWeight(
                                  element.purity
                                ).toFixed(3)}
                              </b>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}

                    <TableRow>
                      <TableCell className={classes.tableRowPad} align="left">
                        <b>Grand Total:</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b></b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b></b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b></b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b></b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b>{gtPices}</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b>{gtgrossWT}</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b>{gtNetWT}</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b>{gtstoneWT}</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b>{gtotherWT}</b>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className=" mb-16 mt-16 metalled_statements_blg metalled_statements_table">
                <Table aria-label="simple table" id="tbl_exporttable_to_xls">
                  <TableHead>
                    <TableRow>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                        colSpan={8}
                      >
                        Report No:2
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.tableRowPad} align="left">
                        Source Wcgroup
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Dest Wcgroup
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Karat Code
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Pieces
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Gross Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        NET WT
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Stone Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Other Weight
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {apiDataSecond.map((element, index) => (
                      <>
                        <TableRow key={index + 2}>
                          {element.countsecond === null ||
                          element.countsecond === 2 ? (
                            <TableCell className={classes.tableRowPad}>
                              {element.from_department}
                            </TableCell>
                          ) : (
                            element.countsecond && (
                              <TableCell
                                rowSpan={element.countsecond}
                                className={classes.tableRowPad}
                              >
                                {element.from_department}
                              </TableCell>
                            )
                          )}
                          {element.countsecond === null ||
                          element.countsecond === 2 ? (
                            <TableCell className={classes.tableRowPad}>
                              {element.to_department}
                            </TableCell>
                          ) : (
                            element.countsecond && (
                              <TableCell
                                rowSpan={element.countsecond}
                                className={classes.tableRowPad}
                              >
                                {element.to_department}
                              </TableCell>
                            )
                          )}
                          <TableCell className={classes.tableRowPad}>
                            {element.purity}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.pcs}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.gross_weight.toFixed(3)}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.net_weight.toFixed(3)}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.stone_weight == null
                              ? "0.00"
                              : element.stone_weight.toFixed(3)}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.other_weight.toFixed(3)}
                          </TableCell>
                        </TableRow>

                        {(index === apiDataSecond.length - 1 ||
                          element.karatsecond !==
                            apiDataSecond[index + 1].karatsecond) && (
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              align="left"
                              className={classes.tableRowPad}
                            >
                              <b>Total:</b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b> {secondCalculateTotalPcs(element.purity)}</b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                                {secondCalculateTotalGrossWeight(
                                  element.purity
                                ).toFixed(3)}
                              </b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                                {" "}
                                {secondCalculateTotalNetWeight(
                                  element.purity
                                ).toFixed(3)}
                              </b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                                {" "}
                                {secondCalculateTotalStoneWeight(
                                  element.purity
                                ).toFixed(3)}
                              </b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                                {" "}
                                {secondCalculateTotalOtherWeight(
                                  element.purity
                                ).toFixed(3)}
                              </b>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}

                          <TableRow>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                        colSpan={3}
                      >
                        <b>Grand Total:</b>
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        <b>{gtSecPices}</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b>{gtSecgrossWT}</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b>{gtSecNetWT}</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b>{gtSecstoneWT}</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b>{gtSecotherWT}</b>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default DepartmentTransferSummary;

import React, { useState, useEffect } from "react";
import { Typography, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import Table from "@material-ui/core/Table";
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

const HallmarkwiseInnAndOut = (props) => {
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

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");

  const [apiData, setApiData] = useState([]);
  const [apiDataSecond, setApiDataSecond] = useState([]);
  const [grandTotal, setGrandTotal] = useState("");

  const [fromDate, setFromDate] = useState(
    moment().startOf("report").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");

  const [report, setReportType] = useState("");
  const [reportErr, setReportTypeErr] = useState("");

  function handleChangeFromePartyType(value) {
    setfromeDepartmentData(value);
    setReportType("");
    setFromeDepartmentErr("");
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
  }

  useEffect(() => {
    getFromeDepartment();
  }, []);

  function getFromeDepartment() {
    axios
      .get(Config.getCommonUrl() + "api/admin/getdepartmentlist")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setfromeDepartment(response.data.data);

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
          setfromeDepartmentData(selectClient);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error"}));
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

  function setFilters() {
    if (fromDate === "" && toDate === "") {
      console.log("return");
      return;
    }

    let url = `api/stock/departmentTransferReport`;
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
      moment(new Date(toDate)).format("YYYY-MM-DD")
    ) {
      setToDtErr("Enter Valid Date!");
      return;
    }

    if (fromDate !== "" || toDate !== "") {
      if (fromDtValidation() && toDtValidation()) {
        url = url + "?startDate=" + fromDate + "&endDate=" + toDate;
      } else {
        console.log("Date return");
        return;
      }
    }
    getbarcodedata(url);
  }

  function getbarcodedata(url) {
    setLoading(true);
    const departmentID = fromeDepartmentData.map((x) => {
      return x.value;
    });
    const body = {
      from_department_id: departmentID,
    };
    axios
      .post(Config.getCommonUrl() + url, body)
      .then((response) => {
        if (response.data !== null) {
          const apiData = response.data.data.findLot;
          const dynamicKeys = Object.keys(apiData);
          const allData = [];
          dynamicKeys.map((key, value) => {
            apiData[key].lots.map((e, index) => {
              allData.push({
                karat: key,
                count: index == 0 ? apiData[key].lots.length : null,
                ...e,
              });
            });
          });
          setApiData(allData);
          setGrandTotal(response.data.data.LotTotal);

          const apiDataSecond = response.data.data.findStock;
          const dynamicKeysseccond = Object.keys(apiDataSecond);
          const allDataSecond = [];
          dynamicKeysseccond.map((key, value) => {
            apiDataSecond[key].stock.map((e, index) => {
              allDataSecond.push({
                karatsecond: apiDataSecond[key].departmentName,
                countsecond:
                  index == 0 ? apiDataSecond[key].stock.length : null,
                ...e,
              });
            });
          });
          setApiDataSecond(allDataSecond);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error"}));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: url, body });
      });
  }

  function hanselExele() {
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
    // if (apiData.length > 0) {
      const wb = XLSX.utils.book_new();

      // Export the first table
      const tbl1 = document.getElementById("tbl_exporttable_to_xls");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

      // Export the second table
      const tbl2 = document.getElementById("tbl_exporttable_to_xls1");
      const ws2 = XLSX.utils.table_to_sheet(tbl2);
      XLSX.utils.book_append_sheet(wb, ws2, "Table 2");

      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(
            wb,
            fn || `Barcode_Generatoration_Report.${type || "xlsx"}`
          );
    // } else {
      // dispatch(Actions.showMessage({ message: "Can not Export Empty Data" }));
    // }
  };

  const exportToExce2 = (type, fn, dl) => {
    const tble2 = document.getElementById("tbl_exporttable_to_xls2");

    if (tble2.length > 0) {
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
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data", variant: "error"}));
    }
  };

  const reportyType = [
    { value: 1, label: "Hallmark wise In and Out and Loss    " },
    { value: 2, label: "Party wise Issue Pending Huid List " },
  ];

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
                    Hallmark wise In and Out and Loss
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
              // spacing={3}
              // style={{ padding: 20 }}
            >
              <Grid item lg={3} md={4} sm={6} xs={12} style={{ padding: 5 }}>
              <p style={{ paddingBottom: "3px" }}>Select From deparment</p>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  classes={classes}
                  styles={selectStyles}
                  options={fromeDepartment.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  value={fromeDepartmentData}
                  onChange={handleChangeFromePartyType}
                  isMulti
                  placeholder="Select From Deparment
"
                />
                <span style={{ color: "red" }}>
                  {fromeDepartmentErr.length > 0 ? fromeDepartmentErr : ""}
                </span>
              </Grid>

              <Grid item lg={3} md={4} sm={6} xs={12} style={{ padding: 5 }}>
               <p style={{ paddingBottom: "3px" }}>Report Type</p>
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
                  placeholder="Report Type "
                />
                <span style={{ color: "red" }}>
                  {reportErr.length > 0 ? reportErr : ""}
                </span>
              </Grid>

              <Grid item lg={3} md={4} sm={6} xs={12} style={{ padding: 5 }}>
               <p style={{ paddingBottom: "3px" }}>Start Date</p>
                <TextField
                  placeholder="Start Date"
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
                  placeholder="End Date"
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
              <Grid className="mt-28" item lg={12} md={8} sm={12} xs={12} style={{display:"flex", justifyContent:"end"}}>
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
                    hanselExele();
                  }}
                >
                  Export
                </Button>
              </Grid>
            </Grid>
            {report.value === 1 ? (
              <div className="mt-20 mb-16  metalled_statements_table">
                <Table aria-label="simple table" id="tbl_exporttable_to_xls">
                  <TableHead>
                    <TableRow>
                           <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      >
                      </TableCell>
                           <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      >
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="right"
                        colSpan={7}
                      >
                        Hallmark wise In and Out and Loss (Issue)
                      </TableCell>
                
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.tableRowPad} align="left">
                        Issue Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Center Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Request{" "}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Party Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Packing List No
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Karat
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Pieces
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Gross Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Net Weight
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>

                <div className="mt-20 mb-16  metalled_statements_table">
                  <Table id="tbl_exporttable_to_xls1" className="mt-60 ">
                    <TableHead>
                      <TableRow>
                           <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      >
                      </TableCell>     <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      >
                      </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="left"
                          colSpan={7}
                        >
                          Hallmark wise In and Out and Loss (Receive )
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.tableRowPad} align="left">
                          Receive Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Job No
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Fress Pcs
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Fress Gross Weight
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Fress Net Weight
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Scarp Pcs
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Scarp Gross
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Scarp Net
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Loss
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                </div>
              </div>
            ) : report.value === 2 ? (
              <div className="mt-20 mb-16  metalled_statements_table">
                <Table aria-label="simple table" id="tbl_exporttable_to_xls2">
                  <TableHead>
                    <TableRow>
                         <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      >
                      </TableCell>     <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      >
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                        colSpan={6}
                      >
                        Party wise Issue Pending Huid List
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
                </Table>
              </div>
            ) : (
              <h5 className="font-bold align-middle justify-center text-center mt-5">
                Select Report Type
              </h5>
            )}
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default HallmarkwiseInnAndOut;

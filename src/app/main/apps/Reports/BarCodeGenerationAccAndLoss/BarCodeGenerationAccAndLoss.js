import React, { useState, useEffect } from "react";
import { Typography, TextField } from "@material-ui/core";
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

const BarCodeGenerationAccAndLoss = (props) => {
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

  const [partyTypeData, setPartyTypeData] = useState([]);
  const [partyType, setPartyType] = useState("");
  const [partyTypeErr, setPartyTypeErr] = useState("");

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");

  const [apiData, setApiData] = useState([]);

  const [summaryData, setSummaryData] = useState([]);

  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");

  function handleChangePartyType(value) {
    setPartyType(value);
    setPartyTypeErr("");
  }

  useEffect(() => {
    getDepartment();
  }, []);

  function getDepartment() {
    axios
      .get(Config.getCommonUrl() + "api/admin/getdepartmentlist")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setPartyTypeData(response.data.data);

          setPartyType(response.data.dat);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant:"error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/admin/getdepartmentlist" });
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

  function toPartyValdation() {
    if (partyType.value === undefined) {
      setPartyTypeErr("Select Department Name!");
      return false;
    }
    return true;
  }

  function setFilters() {
    let url = "api/stock/barcodeGenerationAccandLoss";

    if (fromDtValidation() && toDtValidation() && toPartyValdation()) {
      url =
        url +
        "?startDate=" +
        fromDate +
        "&endDate=" +
        toDate +
        "&department_id=" +
        partyType.value;
    } else {
      console.log("Date return");
      return;
    }

    getPackingList(url);
  }
  function getPackingList(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setLoading(false);

          const apiData = response.data.data;
          const dynamicKeys = Object.keys(apiData);
          const allData = [];
          dynamicKeys.map((key, value) => {
            apiData[key].map((e, index) => {
              allData.push({
                karat: key,
                count: index == 0 ? apiData[key].length : null,
                ...e,
              });
            });
          });
          setApiData(allData);
          setSummaryData(response.data.grandTotal);
        } else {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message, variant:"error"}));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: url });
      });
  }

  const exportToExcel = (type, fn, dl) => {
    if (apiData.length > 0) {
      const wb = XLSX.utils.book_new();

      const tbl1 = document.getElementById("tbl_exporttable_to_xls");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(
            wb,
            fn || `Barcode_Generation_Acc_And_Loss.${type || "xlsx"}`
          );
    } else {
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data", variant: "error"}));
    }
  };

  const calculateBeforePcs = () => {
    let total = 0;
    apiData.forEach((element) => {
      total += element.pcs;
    });
    return total;
  };

  const calculateBeforeGWT = () => {
    let total = 0;
    apiData.forEach((element) => {
      total += parseFloat(element.total_gross_wgt);
    });
    return total;
  };

  const calculateBeforeNWT = () => {
    let total = 0;
    apiData.forEach((element) => {
      total += parseFloat(element.total_net_wgt);
    });
    return total;
  };

  const calculateAfterPcs = () => {
    let total = 0;
    apiData.forEach((element) => {
      total += parseFloat(element.after_pcs);
    });
    return total;
  };

  const calculateAfterGWt = () => {
    let total = 0;
    apiData.forEach((element) => {
      total += parseFloat(element.after_gross_wgt);
    });
    return total;
  };

  const calculateAfterNWT = () => {
    let total = 0;
    apiData.forEach((element) => {
      total += parseFloat(element.after_net_wgt);
    });
    return total;
  };

  const calculateDiff = () => {
    let total = 0;
    apiData.forEach((element) => {
      total += parseFloat(element.net_wgt_difference);
    });
    return total;
  };

  const calculateDiffPCs = () => {
    let total = 0;
    apiData.forEach((element) => {
      total += parseFloat(element.pcs_difference);
    });
    return total;
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  {/* <Typography className="p-16 pb-8 text-18 font-700"> */}
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Barcode Generation Acc And Loss{" "}
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll">
                  <Grid
                container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0, width: "100%" }}
              >
                <Grid item lg={3} md={3} sm={6} xs={12} style={{ padding: 6 }}>
                  <p style={{ paddingBottom: "3px" }}>Department name</p>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    // options={partyTypeData
                    options={partyTypeData.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    // components={components}
                    value={partyType}
                    onChange={handleChangePartyType}
                    placeholder="Department name"
                  />
                  <span style={{ color: "red" }}>
                    {partyTypeErr.length > 0 ? partyTypeErr : ""}
                  </span>
                </Grid>

                <Grid item lg={3} md={3} sm={6} xs={12} style={{ padding: 6 }}>
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
                <Grid item lg={3} md={3} sm={6} xs={12} style={{ padding: 6 }}>
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
                <Grid className="ledger-pt-btn" item lg={3} md={3} sm={6} xs={12} style={{ padding: 6, alignItems: "end", display: "flex" }}>
                  <Button
                    className="report-btn"
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
                    className="report-btn ml-16"
                    variant="contained"
                    color="primary"
                    aria-label="Register"
                    onClick={(event) => {
                      exportToExcel("xlsx");
                    }}
                  >
                    Export
                  </Button>
                </Grid>
              </Grid>

              <div className="mt-20 mb-16 metalled_statements_blg metalled_statements_table">
                <Table aria-label="simple table" id="tbl_exporttable_to_xls">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad} align="left">
                        Trans Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Department
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        User Name/admin
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                      Stock code
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                        Karat{" "}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Line Remark
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Before Pcs
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Before GWt
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Before NWT
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        After Pcs
                      </TableCell>
                  
                      <TableCell className={classes.tableRowPad} align="left">
                        After GWt
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        After NWT
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                      Diff Pcs
                    </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Diff Wt (Before NWT-After NWT)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {apiData.map((element, index) => (
                    <>
                      <TableRow key={index}>
                        {element.count && (
                          <TableCell
                            rowSpan={element.count}
                            className={classes.tableRowPad}
                          >
                          {moment(element.karat).format("DD-MM-YYYY")} 
                          </TableCell>
                        )}
                        {element.count && (
                          <TableCell
                            rowSpan={element.count}
                            className={classes.tableRowPad}
                          >
                            {element.LotdepartmentName.name}
                          </TableCell>
                        )}
                        <TableCell className={classes.tableRowPad}>
                        {element?.username}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                        {element.number}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.purity}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>-</TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.pcs}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.total_gross_wgt}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.total_net_wgt}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.after_pcs}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.after_gross_wgt}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.after_net_wgt}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                        {element.pcs_difference}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.net_wgt_difference}
                        </TableCell>
                      </TableRow>
                      {(index === apiData.length - 1 ||
                        element.karat !== apiData[index + 1].karat) && (
                        <TableRow style={{ backgroundColor: "#D1D8F5" }}>
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
                          {" "}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <b> {calculateBeforePcs(element.pcs)}</b>
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <b>
                              {calculateBeforeGWT(
                                element.total_gross_wgt
                              ).toFixed(3)}
                            </b>
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <b>
                              {calculateBeforeNWT(
                                element.total_net_wgt
                              ).toFixed(3)}
                            </b>
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <b>{calculateAfterPcs(element.after_pcs)}</b>
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <b>
                              {calculateAfterGWt(
                                element.after_gross_wgt
                              ).toFixed(3)}
                            </b>
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <b>
                              {calculateAfterNWT(element.after_net_wgt).toFixed(
                                3
                              )}
                            </b>
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <b>{calculateDiffPCs(element.pcs_difference)}</b>{" "}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {" "}
                            <b>
                              {calculateDiff(
                                element.net_wgt_difference
                              ).toFixed(3)}
                            </b>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                  <TableRow style={{ backgroundColor: "#D1D8F5" }}>
                    <TableCell
                      className={classes.tableRowPad}
                      align="left"
                      colSpan={5}
                    >
                      <b>Grand Total</b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                    <b></b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      <b>{summaryData.pcs}</b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      <b>{summaryData.total_gross_wgt}</b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}></TableCell>
                    <TableCell className={classes.tableRowPad}>
                      <b>{summaryData.phy_pcs}</b>
                    </TableCell>

                    <TableCell className={classes.tableRowPad}>
                      <b>{summaryData.after_gross_wgt}</b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}></TableCell>
                    <TableCell className={classes.tableRowPad}>
                    <b>{summaryData.pcs_difference}</b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      <b>{summaryData.net_wgt_difference}</b>
                    </TableCell>
                  </TableRow>
                </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default BarCodeGenerationAccAndLoss;

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
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
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

const StockTypeWiseDepartmentwiseStoR = (props) => {
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

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");

  const [apiData, setApiData] = useState([]);
  const [totalGWT, setTotalGWT] = useState("");
  const [totalNWT, setTotalNWT] = useState("");
  const [totalfineGold, settotalfineGold] = useState();

  const [sumsByNWT, setSumsByNWT] = useState([]);
  const [sumsByGWT, setSumsByGWT] = useState([]);
  const [sumsByFineGold, setSumsByFineGold] = useState([]);

  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");

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

  function setFilters() {
    if (fromDate === "" && toDate === "") {
      console.log("return");
      return;
    }

    let url = `api/stock/typewise/report`;
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
    axios
      .get(Config.getCommonUrl() + url)
      .then((response) => {
        if (response.data !== null) {
          console.log(response);

          const apiData = response.data.data;
          const dynamicKeys = Object.keys(apiData);
          console.log(dynamicKeys);
          const allData = [];
          dynamicKeys.map((key, value) => {
            apiData[key].map((e, index) => {
              allData.push({
                karat: e.department_name,
                count: index == 0 ? apiData[key].length : null,
                ...e,
              });
              const calculateSumsByNWT = () => {
                const sums = {};

                allData.forEach((element) => {
                  const { karat, net_weight } = element;
                  if (!sums.hasOwnProperty(karat)) {
                    sums[karat] = 0;
                  }
                  sums[karat] += net_weight;
                });

                return sums;
              };
              const sumsByNWT = calculateSumsByNWT();
              setSumsByNWT(sumsByNWT);

              const calculateSumsByGWT = () => {
                const sums = {};

                allData.forEach((element) => {
                  const { karat, gross_weight } = element;
                  if (!sums.hasOwnProperty(karat)) {
                    sums[karat] = 0;
                  }
                  sums[karat] += gross_weight;
                });

                return sums;
              };
              const sumsByGWT = calculateSumsByGWT();
              setSumsByGWT(sumsByGWT);

              const calculateFineGold = () => {
                let sum = 0;

                allData.forEach((element) => {
                  const { fine_gold } = element;

                  if (fine_gold !== "-" && !isNaN(parseFloat(fine_gold))) {
                    sum += parseFloat(fine_gold);
                  }
                });

                return sum;
              };

              const sumOfFineGold = calculateFineGold();
              setSumsByFineGold(sumOfFineGold);
            });
          });
          setApiData(allData);
          setTotalGWT(response.data.totalGrossWeight);
          setTotalNWT(response.data.totalNetWeight);
          settotalfineGold(response.data.totalfineGold);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
        setLoading(false);
      })
      .catch((error) => {
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
          fn || `Barcode_Generatoration_Report.${type || "xlsx"}`
        );
    } else {
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data", variant: "error" }));
    }
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
                    Stock TypeWise Departmentwise Stock Report
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
                <Grid className="mt-28" item lg={3} md={4} sm={12} xs={12}>
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
                        Department
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Dept / with work.
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Stock Type
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Purity{" "}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Grs. Wt
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Net Wt
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Fine Gold
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
                              {element.karat}
                            </TableCell>
                          )}

                          <TableCell className={classes.tableRowPad}>
                            {element.process}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.stockType}
                          </TableCell>

                          <TableCell className={classes.tableRowPad}>
                            {element.purity}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.gross_weight}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.net_weight}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {element.fine_gold}
                          </TableCell>
                        </TableRow>
                        {(index === apiData.length - 1 ||
                          element.karat !== apiData[index + 1].karat) && (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                align="left"
                                className={classes.tableRowPad}
                              >
                                <b>Total:</b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                              {" "}
                              <b>{sumsByGWT[element.karat].toFixed(3)}</b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                              <b>{sumsByNWT[element.karat].toFixed(3)}</b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                              {" "}
                            <b>
                              <b>{sumsByFineGold.toFixed(3)}</b>
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
                        colSpan={4}
                      >
                        <b>Grand Total</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                      <b>{totalGWT}</b>{" "}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                      <b>{totalNWT}</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                      <b>{totalfineGold}</b>
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

export default StockTypeWiseDepartmentwiseStoR;

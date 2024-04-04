import React, { useState, useEffect} from "react";
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

const BarcodeGeneratorReport = (props) => {
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
          let data = response.data.data.filter((s) => s.is_location !== 1);
          setPartyTypeData(data);
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
          setPartyType(selectClient);
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

  function setFilters() {
    if (fromDate === "" && toDate === "") {
      console.log("return");
      return;
    }

    let url = `api/stock/barcodegenerationreport`;
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
    setApiData([]);
    setSummaryData([]);
    getbarcodedata(url);
  }

  function getbarcodedata(url) {
    setLoading(true);
    const departmentID = partyType.map((x) => {
      return x.value;
    });
    const body = {
      department_id: departmentID,
    };
    axios
      .post(Config.getCommonUrl() + url, body)
      .then((response) => {
        if (response.data !== null) {
          let tempData = response.data.data.findStock;
          let calculationByPurity =
            response.data.data.weightTotalsByDepartmentAndPurity;
          let data = tempData.map((item) => {
            return item;
          });
          setApiData(data);
          setSummaryData(calculationByPurity);
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

  const exportToExcel = (type, fn, dl) => {
    if (apiData.length > 0) {
      const wb = XLSX.utils.book_new();

      // Export the first table
      const tbl1 = document.getElementById("tbl_exporttable_to_xls");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

      // Export the second table
      const tbl2 = document.getElementById("tbl_exporttable_to_xls2");
      const ws2 = XLSX.utils.table_to_sheet(tbl2);
      XLSX.utils.book_append_sheet(wb, ws2, "Table 2");

      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(
          wb,
          fn || `Barcode_Generatoration_Report.${type || "xlsx"}`
        );
    } else {
      // console.log("else")
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data", variant: "error"}));
    }
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
                    Barcode Generation Report{" "}
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
                    isMulti
                    placeholder="Department name"
                  />
                  <span style={{ color: "red" }}>
                    {partyTypeErr.length > 0 ? partyTypeErr : ""}
                  </span>
                </Grid>

                <Grid item lg={3} md={3} sm={6} xs={12} style={{ padding: 6 }}>
                  <p style={{ paddingBottom: "3px" }}>Start Date</p>
                  <TextField
                    type="date"
                  defaultValue={fromDate}
                  inputProps={{ min: "2019-01-24", max: "2020-05-31" }}
                  placeholder="Start Date"
                  name="fromDate"
                  error={fromDtErr.length > 0 ? true : false}
                  helperText={fromDtErr}
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  fullWidth
                  format="yyyy/MM/dd"
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

                <Grid item lg={3} md={3} sm={6} xs={12} style={{ padding: 6, alignItems: "end", display: "flex" }}>
                  <Button
                    className="report-btn"
                    color="primary"
                    variant="contained"
                    aria-label="Register"
                    onClick={(event) => {
                      setFilters();
                    }}
                  >
                    Load Data
                  </Button>

                  <Button
                    className="report-btn ml-16"
                    color="primary"
                    variant="contained"
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
                      <TableCell className={classes.tableRowPad}>
                        Doc Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Department
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Barcode
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Lot Category
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Karat Code
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Lot No
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Stock Code
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Batch No
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Variant Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Pieces
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Gross Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Net Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Stone Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Other Weight
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiData.map((element, index) => (
                      <TableRow key={index}>
                        <TableCell className={classes.tableRowPad} align="left">
                          {moment
                            .utc(element.created_at)
                            .local()
                            .format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                        {element?.departmentName?.name}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {element?.LotDetail?.BarCodeProduct?.barcode}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {
                          element?.LotDetail?.Lot?.LotProductCategory
                            ?.category_name
                        }
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {element?.purity}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {element?.LotDetail?.Lot?.number}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {element?.LotDetail?.Lot?.LotMetalStockCode?.stock_code}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {element?.LotDetail?.batch_number}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {element?.LotDetail?.DesignInfo?.variant_number}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {element?.pcs}
                      </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {element.hasOwnProperty("LotDetail")
                            ? parseFloat(element.LotDetail?.gross_wgt).toFixed(3)
                            : ""}
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {element.hasOwnProperty("LotDetail")
                            ? parseFloat(element.LotDetail?.net_wgt).toFixed(3)
                            : ""}
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {element.hasOwnProperty("LotDetail")
                            ? Config.numWithComma(element.LotDetail?.stone_wgt)
                            : ""}
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {element.hasOwnProperty("LotDetail")
                            ? Config.numWithComma(element.LotDetail?.other_wgt)
                            : ""}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow style={{ backgroundColor: "#D1D8F5" }}>
                      <TableCell className={classes.tableRowPad} align="left">
                        <b>Total</b>
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      ></TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      ></TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      ></TableCell>
                      <TableCell
                        className={classes.tableRowPadtableRowPadnew}
                        align="left"
                      ></TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      ></TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      ></TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      ></TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      ></TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        <b>{summaryData?.totalPcs}</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        <b>
                          {isNaN(
                            parseFloat(
                              parseFloat(summaryData.totalGrossWeight).toFixed(3)
                            )
                          )
                            ? ""
                            : parseFloat(
                              parseFloat(summaryData.totalGrossWeight).toFixed(
                                3
                              )
                            )}
                        </b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        <b>
                          {" "}
                          {isNaN(
                            parseFloat(
                              parseFloat(summaryData.totalNetWeight).toFixed(3)
                            )
                          )
                            ? ""
                            : parseFloat(
                              parseFloat(summaryData.totalNetWeight).toFixed(3)
                            )}
                        </b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        <b>
                          {isNaN(
                            parseFloat(
                              parseFloat(summaryData.totalStoneWeight).toFixed(3)
                            )
                          )
                            ? ""
                            : parseFloat(
                              parseFloat(summaryData.totalStoneWeight).toFixed(
                                3
                              )
                            )}
                        </b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        <b>
                          {isNaN(
                            parseFloat(
                              parseFloat(summaryData.OtherWeight).toFixed(3)
                            )
                          )
                            ? ""
                            : parseFloat(
                              parseFloat(summaryData.OtherWeight).toFixed(3)
                            )}
                        </b>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Table id="tbl_exporttable_to_xls2" className="mt-60">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell colSpan={6} style={{ paddingLeft: "33%" }}>Barcode Summary</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.tableRowPad} align="left" style={{ paddingLeft: "20px" }}>
                        Doc Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Department
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Karat Code
                      </TableCell>
                      <TableCell>Pieces</TableCell>
                      <TableCell>Gross Weight</TableCell>
                      <TableCell>Net Weight</TableCell>
                      <TableCell>Stone And Other Wt</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(summaryData).map((department) =>
                      Object.keys(summaryData[department]).map((purity,index) => (
                        <TableRow key={index}>
                          <TableCell className={classes.tableRowPad} align="left">
                            {moment
                              .utc(summaryData[department][purity].date)
                              .local()
                              .format("MM-DD-YYYY")}
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                            {department}
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                            {purity}
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                            {summaryData[department][purity].pieces}
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                            {summaryData[department][purity].grossWeight.toFixed(
                              3
                            )}
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                            {summaryData[department][purity].netWeight.toFixed(3)}
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                            {summaryData[department][purity].stone_wgt.toFixed(3)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    <TableRow style={{ backgroundColor: "#D1D8F5" }} >
                      <TableCell className={classes.tableRowPad} align="left">
                        <b>Total</b>
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      ></TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      ></TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {summaryData.totalPcs}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        <b>
                          {isNaN(
                            parseFloat(
                              parseFloat(summaryData.totalGrossWeight).toFixed(3)
                            )
                          )
                            ? ""
                            : parseFloat(
                              parseFloat(summaryData.totalGrossWeight).toFixed(
                                3
                              )
                            )}
                        </b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        <b>
                          {isNaN(
                            parseFloat(
                              parseFloat(summaryData.totalNetWeight).toFixed(3)
                            )
                          )
                            ? ""
                            : parseFloat(
                              parseFloat(summaryData.totalNetWeight).toFixed(3)
                            )}
                        </b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        <b>
                          {isNaN(
                            parseFloat(
                              parseFloat(
                                summaryData.totalStoneAndOtherWeigth
                              ).toFixed(3)
                            )
                          )
                            ? ""
                            : parseFloat(
                              parseFloat(
                                summaryData.totalStoneAndOtherWeigth
                              ).toFixed(3)
                            )}
                        </b>
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

export default BarcodeGeneratorReport;

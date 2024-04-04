import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  TableFooter,
  Table,
  Paper,
  Box,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import moment from "moment";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as XLSX from "xlsx";
import Loader from "app/main/Loader/Loader";
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
    fontSize: "1.2rem",
  },
  tableFooter: {
    backgroundColor: "#ebeefb !important",
  },
}));

const FineGoldReport = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    NavbarSetting("Factory Report", dispatch);
  }, []);

  const [loading, setLoading] = useState(false);

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");
  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");

  const [apiData, setApiData] = useState([]);

  const roleOfUser = localStorage.getItem("permission")
    ? JSON.parse(localStorage.getItem("permission"))
    : null;
  // const [authAccessArr, setAuthAccessArr] = useState([]);

    // useEffect(() => {
    //   let arr = roleOfUser
    //       ? roleOfUser["Report"]["Mis Factory Stock Report"]
    //         ? roleOfUser["Report"]["Mis Factory Stock Report"]
    //         : []
    //       : [];
    //   const arrData = [];
    //   if (arr.length > 0) {
    //     arr.map((item) => {
    //       arrData.push(item.name);
    //     });
    //   }
    //   setAuthAccessArr(arrData);
    // }, []);

    useEffect(()=>{
      getReportData()
    },[])

    const getReportData = () =>{
      if (fromDtValidation() && toDtValidation()){
        const api = `api/metalledger/finegold/report/?start=${fromDate}&end=${toDate}`;

        axios.get(Config.getCommonUrl() + api)
        .then((response) =>{
          console.log(response);
          const jsonData = response.data.data
          // Convert the JSON data into an array of objects
          const dataArray = Object.entries(jsonData).map(([name, values]) => ({ name, ...values }));
          setApiData(dataArray);
        })
        .catch((error) =>{
          handleError(error, dispatch, { api: api })
        })
      }
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
      let endDate = moment(toDate).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal && dateVal <= endDate) {
        setFromDtErr("");
        setToDtErr("");
      } else {
        setFromDtErr("Enter Valid Date");
      }
    } else if (name === "toDate") {
      setToDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      let startDate = moment(fromDate).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal && startDate <= dateVal ) {
        setToDtErr("");
        setFromDtErr("")
      } else {
        setToDtErr("Enter Valid Date");
      }
    }
  }
  function fromDtValidation() {
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    if (!fromDate || dateRegex.test(fromDate) === false || fromDtErr) {
      var today = moment().format("YYYY-MM-DD"); //new Date();
      let dateVal = moment(fromDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal && !fromDtErr) {
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
    if (!toDate || dateRegex.test(toDate) === false || toDtErr) {
      var today = moment().format("YYYY-MM-DD"); //new Date();
      let dateVal = moment(toDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      if (dateVal <= today && minDateVal < dateVal && !toDtErr) {
        return true;
      } else {
        setToDtErr("Enter Valid Date!");
        return false;
      }
    }
    return true;
  }

  const exportToExcel = (type, fn, dl) => {
    console.log(type, fn, dl);
    if (apiData.length > 0) {
      const wb = XLSX.utils.book_new();
      const tbl1 = document.getElementById("tbl_exporttable_to_xls");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(wb, fn || `Fine_Gold_Report.${type || "xlsx"}`);
    } else {
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data" }));
    }
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 pt-20">
            <Grid container alignItems="center" style={{ padding: 0, paddingBottom: 16 }}>
              <Grid item xs={12} sm={12} md={12} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Fine Gold Report
                  </Typography>
                </FuseAnimate>
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll">
            <Grid
              container
              justifyContent="center"
              style={{ textAlign: "center", marginTop: 20, padding: 16 }}
            >
              <Grid item xs={12}>
                <h4>VK Jewels Pvt Ltd.</h4>
                <p style={{ maxWidth: "50%", marginInline: "auto" }}>
                  "SHRI", Madhuvan Park Main Road, Behind D Mart Mall, Kuvadva
                  Road, Rajkot.
                </p>
              </Grid>
              <Grid item xs={12} style={{ marginBlock: 20 }}>
                <h4>Fine Gold</h4>
                <p>Stock Group Summary</p>
                {/* <p
                  style={{
                    display: "flex",
                    columnGap: 10,
                    justifyContent: "center",
                  }}
                >
                  <span>1-Apr-23</span>to<span>23-Aug-23</span>
                </p> */}
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              style={{ marginBlock: 0 }}
              alignItems="flex-end"
            >
              <Grid item lg={2} md={4} sm={4} xs={12}>
              <p style={{ paddingBottom: "3px" }}>Start Date</p>
                <TextField
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
                  inputProps={{
                    max: moment().format("YYYY-MM-DD"),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item lg={2} md={4} sm={4} xs={12}>
              <p style={{ paddingBottom: "3px" }}>End Date</p>
                <TextField
                  name="toDate"
                  value={toDate}
                  error={toDtErr.length > 0 ? true : false}
                  helperText={toDtErr}
                  type="date"
                  // onKeyDown={(e) => e.preventDefault()}
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  fullWidth
                  format="yyyy/MM/dd"
                  inputProps={{
                    max: moment().format("YYYY-MM-DD"),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  className="report-btn"
                  variant="contained"
                  color="primary"
                  aria-label="Register"
                  onClick={(event) => {
                    getReportData();
                  }}
                >
                  Load Data
                </Button>
              </Grid>
              <Grid
                  item
                >
                  <Button
                  className="report-btn"
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
            <Box style={{ marginTop: 16 }}>
              <Paper
                style={{
                  // height: "calc(80vh)",
                  // width: "calc(83vw)",
                  overflowX: "auto",
                  overflowY: "auto",
                  // margin: "10px 10px 30px 10px",
                }}
                className="createaccount-tbel-dv"
              >
                <Table className={classes.table} id="tbl_exporttable_to_xls">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad} rowSpan={3}>
                        Particular
                      </TableCell>
                      <TableCell
                        className={clsx(classes.tableRowPad, "textcenter")}
                        colSpan={3}
                        style={{ textAlign: "center" }}
                      >
                        <h4 style={{ textAlign: "center" }}>Fine Gold</h4>
                        <h3 style={{ textAlign: "center" }}>VK Jewels Pvt Ltd. Rajkot (23-24)</h3>
                        <h5 style={{ textAlign: "center" }}>Stock details for : Our stock with us</h5>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        className={classes.tableRowPad}
                        colSpan={3}
                        style={{ textAlign: "center" }}
                      >
                        <h3>Closing Balance</h3>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ textAlign: "center" }}
                      >
                        Quantity
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ textAlign: "center" }}
                      >
                        Rate
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ textAlign: "center" }}
                      >
                        Value
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {apiData.length === 0 ?(
                    <TableRow>
                      <TableCell className={clsx(classes.tableRowPad, "centertext")} colSpan={4} align="center">
                        No Data
                      </TableCell>
                    </TableRow>
                  ) : (
                    apiData.map((row,i)=>(
                      <TableRow key={i}>
                      <TableCell className={classes.tableRowPad}>
                        {row.name === "finegold" && "Fine Gold 995"}
                        {row.name === "jobworkerfinegold" && "Jobwork Fine Gold 995"}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                       {row.quantity}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                      {row.rate}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                      {row.value}
                      </TableCell>
                    </TableRow>
                    )))
                  }
                  </TableBody>
                  <TableFooter>
                    <TableRow className={classes.tableFooter}>
                      <TableCell className={classes.tableRowPad}>
                        <b>Grand Total</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                      <b>{
                          Config.numWithComma(
                            HelperFunc.getTotalOfField(apiData, "quantity")
                          )
                        }</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}>
                      <b>{
                          Config.numWithComma(
                            HelperFunc.getTotalOfField(apiData, "value")
                          )
                        }</b>
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

export default FineGoldReport;

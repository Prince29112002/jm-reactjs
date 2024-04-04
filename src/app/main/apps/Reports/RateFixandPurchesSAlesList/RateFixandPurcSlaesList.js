import React, { useState, useEffect } from "react";
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
import moment from "moment";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as XLSX from "xlsx";
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";
import Loader from "app/main/Loader/Loader";
import MaUTable from "@material-ui/core/Table";

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
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  tableFooter: {
    padding: 7,
    backgroundColor: "#E3E3E3",
  },
}));

const RateFixandPurcSlaesList = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    NavbarSetting('Factory Report', dispatch);
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
  const [clientFinweight, SetClientFinweight] = useState("");
  const [clientAmount, SetClientAmount] = useState("");

  const [secondApiData, setSecondApiData] = useState([]);
  const [vendoreFinweight, SetVendoreFinweight] = useState("");
  const [vendoreAmount, SetVendoreAmount] = useState("");

  const [gTFineWight, setGTFineWight] = useState("");
  const [gtAmount, setGtAmount] = useState("");

  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");

  const roleOfUser = localStorage.getItem("permission")
  ? JSON.parse(localStorage.getItem("permission"))
  : null;
  // const [authAccessArr, setAuthAccessArr] = useState([]);

  // useEffect(() => {
  //   let arr = roleOfUser
  //       ? roleOfUser["Report"]["Rate Fix and Purchase Sales List"]
  //         ? roleOfUser["Report"]["Rate Fix and Purchase Sales List"]
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
    setGtAmount("");
    setGTFineWight("");
    SetVendoreAmount("");
    SetVendoreFinweight("");
    setSecondApiData([]);
    SetClientAmount("");
    SetClientFinweight("");
    setApiData([]);
    if (fromDate === "" && toDate === "") {
      console.log("return");
      return;
    }

    let url = `api/ratefix/rateFixReport`;
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
          console.log(response.data.findClientRate, "response");

          setApiData(response?.data?.findClientRate);
          SetClientFinweight(response?.data?.ClienttotalWeight);
          SetClientAmount(response?.data?.ClienttotalAmount);

          setSecondApiData(response?.data?.findVendorRate);
          SetVendoreFinweight(response?.data?.VendortotalWeight);
          SetVendoreAmount(response?.data?.VendortotalAmount);

          setGTFineWight(response?.data?.grandTotalWeight);
          setGtAmount(response?.data?.grandTotalAmount);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
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
            fn || `Rate_ Fix_and_Purchase_Sales_List.${type || "xlsx"}`
          );
    } else {
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data" }));
    }
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 pt-20">
            <Grid
              container
              alignItems="center"
              style={{ padding: 0, paddingBottom: 16 }}
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                key="1"
              >
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Rate Fix and Purchase Sales List
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
              spacing={2}
              alignItems="flex-end"
              // style={{ padding: 15 }}
            >
              <Grid item lg={2} md={4} sm={4} xs={12} >
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
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid  item>
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
            <div
              className="mt-16 design_list_blg view_design_list_blg"
              style={{
                height: "calc(80vh)",
                overflowX: "auto",
                overflowY: "auto",
              }}
            >
              <Table className={classes.table} id="tbl_exporttable_to_xls">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableRowPad} align="left">
                      Trans Type
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Trans Category
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Trans Date
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Doc No
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Party Name
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Fine Wt
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableHead>
                  <TableRow>
                    <TableCell
                      className={classes.tableRowPad}
                      colSpan={7}
                      align="left"
                    >
                      <span className="flex justify-center">
                        {" "}
                        Conversion of amount to gold (Vendor)
                      </span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {secondApiData.map((e, index) => (
                    <TableRow key={index}>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e.transType}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e.transCategory}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e.date}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e.voucher_no}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e?.Vendorname?.name}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e.weight}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {Config.numWithComma(e.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      className={classes.tableRowPad}
                      colSpan={5}
                      align="left"
                    >
                      Conversion of amount to gold Total:
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      <b> {vendoreFinweight}</b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      <b> {Config.numWithComma(vendoreAmount)}</b>
                    </TableCell>
                  </TableRow>
                </TableBody>

                <TableHead>
                  <TableRow>
                    <TableCell
                      className={classes.tableRowPad}
                      colSpan={7}
                      align="left"
                    >
                      <span className="flex justify-center">
                        {" "}
                        Conversion of gold to amount (Client)
                      </span>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiData.map((e, index) => (
                    <TableRow key={index}>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e.transType}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e.transCategory}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e.date}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e.voucher_no}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e.clientName}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {e.weight}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {Config.numWithComma(e.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell
                      className={classes.tableRowPad}
                      colSpan={5}
                      align="left"
                    >
                      Conversion of gold to amount Total:
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      <b> {clientFinweight} </b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      <b> {Config.numWithComma(clientAmount)}</b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className={classes.tableRowPad}
                      colSpan={5}
                      align="left"
                    >
                      Grand Total:
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                     
                      <b>  {gTFineWight}</b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      <b> {Config.numWithComma(gtAmount)}</b>
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

export default RateFixandPurcSlaesList;

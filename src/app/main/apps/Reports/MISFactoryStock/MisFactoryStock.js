import React, { useState, useEffect } from "react";
import { Typography, TextField } from "@material-ui/core";
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
import MaUTable from "@material-ui/core/Table";
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

  tableFooter: {
    padding: 7,
    backgroundColor: "#E3E3E3",
  },
}));

const MisFactoryStock = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  useEffect(() => {
    NavbarSetting('Report', dispatch);
  }, []);

  const [loading, setLoading] = useState(false);

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");

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

  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");
  const [selesReturn, setSelesReturn] = useState("");
  const [jobworkMetalReceive, setJobworkMetalReceive] = useState("");
  const [purchase, setPurchase] = useState("");
  const [lossRecovery	, setlossRecovery] = useState("");
  const [articianIssue, setArticianIssue] = useState("");
  const [articianRecive, setArticianRecive] = useState("");
  const [purchaseReturn, setpurchaseReturn] = useState("");
  const [selesInvoice, setselesInvoice] = useState("");
  // const [fromDtErr, setFromDtErr] = useState("");

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
    setApiData([]);
    if (fromDate === "" && toDate === "") {
      console.log("return");
      return;
    }

    let url = `api/voucherentry/misFactoryReport`;
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
          // console.log(response.data.totalSalesDomesticAndJobworkReturn, "response");
          const arrData = response.data
          setSelesReturn(arrData.salesReturnQuantity)
          setJobworkMetalReceive(arrData.jobWorkMetalReceiveQuantity)
          setPurchase(arrData.purchaseQuantity)
          // setlossRecovery(arrData.)
          setArticianIssue(arrData.articianIssueQuantity)
          setArticianRecive(arrData.articianRecieveQuantity)
          setpurchaseReturn(arrData.purchaseReturnQuantity)
          setselesInvoice(arrData.salesInvoiceQuantity)
          setApiData(response?.data.departmentWeightTotals);  
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
                    Mis Factory Stock Report{" "}
                  </Typography>
                </FuseAnimate>
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll">
            <Grid
              container
              spacing={2}
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
              <Grid className="ledger-pt-btn" item>
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
                // height: "calc(80vh)",
                // width: "calc(83vw)",
                overflowX: "auto",
                overflowY: "auto",
                // margin: "10px 10px 30px 10px",
              }}
            >
              <MaUTable className={classes.table} id="tbl_exporttable_to_xls">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableRowPad} align="left">
                      Particulars
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Quantity
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableHead>
                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad, "text-center")}
                      align="left"
                      colSpan={2}
                    >
                      IN-OUT
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      <b> 01-OPENING</b>
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      <b> 01-OPENING</b>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      OPENING
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    ></TableCell>
                  </TableRow>
                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      <b> 01-OPENING</b>
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    ><b> 01-OPENING</b></TableCell>
                  </TableRow>
                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      <b> 02-ADD</b>
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    ><b> 02-ADD</b></TableCell>
                  </TableRow>
                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      BARCODE GENERATION (Auto Reconsilation)
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    ></TableCell>
                  </TableRow>

                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      Sales Return
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    > {selesReturn}</TableCell>
                  </TableRow>

                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      Jobwork Metal Receive
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >{jobworkMetalReceive}</TableCell>
                  </TableRow>

                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      Purchase
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >{purchase}</TableCell>
                  </TableRow>

                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      LOSS RECOVERY
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    ></TableCell>
                  </TableRow>
                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      Artician Receive
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      {articianRecive}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      <b> 02-ADD</b>
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    ><b> 02-ADD</b></TableCell>
                  </TableRow>

                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      <b> 03-LESS</b>
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    ><b> 03-LESS</b></TableCell>
                  </TableRow>

                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      LOSS
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    ></TableCell>
                  </TableRow>

                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      Artician Issue
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >{articianIssue}</TableCell>
                  </TableRow>

                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      PURCHASE RETURN
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >{purchaseReturn}</TableCell>
                  </TableRow>
                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      SALES INVOICE
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >{selesInvoice}</TableCell>
                  </TableRow>
                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      <b> 03-LESS</b>
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    ><b> 03-LESS</b></TableCell>
                  </TableRow>
                </TableBody>

                <TableHead>
                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad, "text-center")}
                      align="left"
                      colSpan={2}
                    >
                      IN-OUT
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      <b> 04-CLOSING Figure Department wise</b>
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    ><b> 04-CLOSING Figure Department wise</b></TableCell>
                  </TableRow>
                    {apiData.map((element,index) =>(
                  <TableRow key={index}>
                    {" "}
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                    {element.departmentName}
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >{element.totalWeight}</TableCell>
                  </TableRow>))}
                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      <b> 04-CLOSING Figure Department wise</b>
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    ><b>
                        {" "}
                        {HelperFunc.getTotalOfFieldNoDecimal(
                          apiData,
                          "totalWeight"
                        ).toFixed(3)}
                      </b></TableCell>
                  </TableRow>
                </TableBody>
               
                <TableBody>
                  
                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    ></TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    ></TableCell>
                  </TableRow>
                  <TableRow>
                    
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    >
                      <b>DIFFERENCE</b>
                    </TableCell>
                    <TableCell
                      className={clsx(classes.tableRowPad)}
                      align="left"
                    ></TableCell>
                  </TableRow>
                </TableBody>
              </MaUTable>
            </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default MisFactoryStock;

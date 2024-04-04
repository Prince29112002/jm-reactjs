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
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";

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

const PackingListReport = (props) => {
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

  const [apiData, setApiData] = useState([]);

  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");

  function handleChangePartyType(value) {
    setPartyType(value);
    setPartyTypeErr("");
  }

  useEffect(() => {
    getDepartment();
  }, []);

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);
  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("YYYY-MM-DD"); //new Date();

    if (name === "fromDate") {
      setFromDate(value);
      // today.setHours(0,0,0,0);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      if (dateVal <= today && minDateVal < dateVal) {
        setFromDtErr("");
      } else {
        setFromDtErr("Enter Valid Date");
      }
    } else if (name === "toDate") {
      setToDate(value);
      // today.setHours(0,0,0,0);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
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
      // today.setHours(0,0,0,0);
      let dateVal = moment(fromDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
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
      // today.setHours(0,0,0,0);
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
    if (partyType === "") {
      setPartyTypeErr("Select Party Type!");
      return false;
    }
    return true;
  }

  function getDepartment() {
    axios
      .get(Config.getCommonUrl() + "api/client")
      .then(function (response) {
        if (response.data.success === true) {
          setPartyTypeData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant:"error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/client" });
      });
  }

  function setFilters() {
    let url = "api/metalledger/packingSlipReport";

    if (fromDtValidation() && toDtValidation() && toPartyValdation()) {
      url =
        url +
        "?start=" +
        fromDate +
        "&end=" +
        toDate +
        "&clients_id=" +
        partyType.value;
    } else {
      console.log("Date return");
      return;
    }
    setApiData([]);
    getPackingList(url);
  }
  function getPackingList(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        console.log(response,);
        if (response.data.success === true) {
          setLoading(false);
          setApiData(response.data.data);
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
        : XLSX.writeFile(wb, fn || `Packing_List_Report.${type || "xlsx"}`);
    } else {
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
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Packing List Report{" "}
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
                <Grid item lg={3} md={3} sm={6} xs={12} style={{ padding: 5 }}>
                  <p style={{ paddingBottom: "3px" }}>Party name</p>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={partyTypeData.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    value={partyType}
                    onChange={handleChangePartyType}
                    placeholder="Party name"
                  />
                  <span style={{ color: "red" }}>
                    {partyTypeErr.length > 0 ? partyTypeErr : ""}
                  </span>
                </Grid>

                <Grid item lg={3} md={3} sm={6} xs={12} style={{ padding: 5 }}>
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
                <Grid item lg={3} md={3} sm={6} xs={12} style={{ padding: 5 }}>
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
                      <TableCell className={classes.tableRowPad} align="left">
                        Party Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Doc No
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        KT
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        GR_Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        NT_Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Header Remarks
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiData.map((element, index) => (
                      <TableRow key={index}>
                        <TableCell className={classes.tableRowPad} align="left">
                          {element.ClientName.name}
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {moment
                            .utc(element.created_at)
                            .local()
                            .format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {element.SlipBarCode.barcode}
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {element.purity}
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {element.gross_wgt}
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {element.net_wgt}
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {element.remark}
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
                      <TableCell className={classes.tableRowPad} align="left">
                        {" "}
                        {HelperFunc.getTotalOfFieldNoDecimal(
                          apiData,
                          "gross_wgt"
                          ).toFixed(3)}
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        {" "}
                        {HelperFunc.getTotalOfFieldNoDecimal(apiData, "net_wgt").toFixed(3)}
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="left"
                      ></TableCell>
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

export default PackingListReport;

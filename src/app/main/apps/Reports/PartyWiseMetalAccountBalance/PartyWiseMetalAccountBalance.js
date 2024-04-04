import React, { useState, useEffect } from "react";
import { TextField, Typography } from "@material-ui/core";
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

const PartyWiseMetalAccountBalance = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [partyType, setpartyType] = useState("");
  const [parttyErr, setPartTypeErr] = useState("");

  const [partyName, setPartyName] = useState([]);
  const [selectedPartyName, setSelectedPartyName] = useState("");
  const [partNameErr, setPartyNameErr] = useState("");

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");

  const [apiData, setApiData] = useState([]);

  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [fromDtErr, setFromDtErr] = useState("");

  useEffect(() => {
    NavbarSetting("Factory Report", dispatch);
  }, []);

  console.log(partyType.value);
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
      .get(Config.getCommonUrl() + "api/vendor/both/client")
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
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/vendor/both/client",
        });
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
      moment(new Date(toDate)).format("YYYY-MM-DD")
    ) {
      setToDtErr("Enter Valid Date!");
      return;
    }

    if (fromDate !== "" || toDate !== "") {
      if (fromDtValidation() && toDtValidation() && countryValidation()) {
        url =
          url +
          "?start=" +
          fromDate +
          "&end=" +
          toDate +
          "&is_vendor_client=" +
          partyType.value;
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
    if (apiData.length > 0) {
      const wb = XLSX.utils.book_new();

      // Export the first table
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
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data", variant: "error"}));
    }
  };
  const partyTypeData = [
    { value: 0, label: "Customer" },
    { value: 1, label: "Vendor" },
    { value: 2, label: "Jobworker" },
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
                    Party Wise Metal Account Balance{" "}
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>
            <div className="main-div-alll">
              <Grid
                // className="metalled-statement-pr"
                container
              // spacing={3}
              // style={{ padding: 20 }}
              >
                <Grid item lg={3} md={4} sm={6} xs={12} style={{ padding: 5 }}>
                  <p style={{ paddingBottom: "3px" }}>Select party type</p>
                  <Select
                    classes={classes}
                    styles={selectStyles}
                    options={partyTypeData.map((optn) => ({
                      value: optn.value,
                      label: optn.label,
                    }))}
                    filterOption={createFilter({
                      ignoreAccents: false,
                    })}
                    onChange={handelPartyType}
                    placeholder="Select Party type "
                  />
                  <span style={{ color: "red" }}>
                    {parttyErr.length > 0 ? parttyErr : ""}
                  </span>
                </Grid>

                <Grid item lg={3} md={4} sm={6} xs={12} style={{ padding: 5 }}>
                  <p style={{ paddingBottom: "3px" }}>Select party name</p>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={partyName
                      .filter((item) => item.type === partyType.value)
                      .map((optn) => ({
                        value: optn.id,
                        label: optn.name,
                      }))}
                    value={selectedPartyName}
                    onChange={handleChangeState}
                    placeholder="Select Party name"
                    isMulti
                  />

                  <span style={{ color: "red" }}>
                    {partNameErr.length > 0 ? partNameErr : ""}
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
                      exportToExcel("xlsx");
                    }}
                  >
                    Export
                  </Button>
                </Grid>
              </Grid>

            {loading && <Loader />}
              <div className="mt-20 mb-16 metalled_statements_blg metalled_statements_table">
                <Table aria-label="simple table" id="tbl_exporttable_to_xls">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad} align="left">
                        Party Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Total Pg
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Total Amt
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.balanceFine.toFixed(3)}</TableCell>
                        <TableCell>{item.balanceAmount.toFixed(3)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className={classes.tableRowPad}>
                        <b>Total:</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b>{" "}
                          {HelperFunc.getTotalOfFieldNoDecimal(
                            apiData,
                            "balanceFine"
                          ).toFixed(3)}</b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <b>{" "}
                          {HelperFunc.getTotalOfFieldNoDecimal(
                            apiData,
                            "balanceAmount"
                          ).toFixed(3)}</b>
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

export default PartyWiseMetalAccountBalance;

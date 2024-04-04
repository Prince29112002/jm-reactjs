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
import MaUTable from "@material-ui/core/Table";
import jsPDF from "jspdf";
import "jspdf-autotable";

const useStyles = makeStyles((theme) => ({
  root: {},
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
  tableFooter: {
    padding: 7,
    backgroundColor: "#E3E3E3",
  },
}));
const CustomerSummariseBalance = (props) => {
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
      .get(Config.getCommonUrl() + "api/vendor/clientOrvendorOrjwr/dropdown")
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
          dispatch(Actions.showMessage({ message: response.data.message }));
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
            fn || `Party_Wise_Metal_Account_Balance.${type || "xlsx"}`
          );
    } else {
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data" }));
    }
  };

  const partyTypeData = [
    { value: 2, label: "Customer" },
    { value: 1, label: "Vendor" },
    { value: 3, label: "Jobworker" },
  ];

  const downloadPDF = () => {
    if (apiData.length > 0) {
      const doc = new jsPDF("p", "pt", "a4");
      doc.autoTableSetDefaults({
        startY: 50,
        margin: { top: 70, right: 10, left: 10 },
        tableWidth: "auto",
        showHead: "firstPage",
        tableLineWidth: 0.5,
        headStyles: {
          fillColor: [211, 211, 211], // Background color as RGB
          textColor: [0, 0, 0], // Text color as RGB
        },
        footStyles: {
          fillColor: [211, 211, 211], // Background color as RGB
          textColor: [0, 0, 0], // Text color as RGB
        },
      });
  
      const table = document.getElementById("tbl_exporttable_to_xls");
  
      doc.autoTable({
        html: table,
      });
  
      doc.save("Partywise Balance Metal + Account Summary.pdf");
    } else {
      dispatch(Actions.showMessage({ message: "Can not Download Empty PDF" }));
    }
  };
  

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container table-width-mt">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="MetalLedStatement-main pb-16"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Customer Summaries Balance
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>

            <div className="main-div-alll">
              <Grid
                className="metalled-statement-pr"
                container
                spacing={3}
                style={{ padding: 20 }}
              >
              <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Party Type</label>
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
                  placeholder="Party Type "
                />
                <span style={{ color: "red" }}>
                  {parttyErr.length > 0 ? parttyErr : ""}
                </span>
              </Grid>

              <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Select Party Name</label>
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
                  placeholder="Select Party Name"
                  isMulti
                />

                <span style={{ color: "red" }}>
                  {partNameErr.length > 0 ? partNameErr : ""}
                </span>
              </Grid>
              <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Start Date</label>
                <TextField
                //   label="Start Date"
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
              <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>End Date</label>
                <TextField
                //   label="End Date"
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
              <Grid style={{ marginTop: "25px" }}>
                <Button
                   className="load_Data-btn ml-8"
                   variant="contained"
                   aria-label="Register"
                   onClick={(event) => {
                    setFilters();
                  }}
                >
                  Load Data
                </Button>
              </Grid>
           
              <Grid style={{ marginTop: "25px" }}>
                  <Button
                    className="export_btn"
                    variant="contained"
                    aria-label="Register"
                    onClick={(event) => {
                      exportToExcel("xlsx");
                    }}
                  >
                    Export
                  </Button>
                </Grid>
    
                <Grid style={{ marginTop: "25px" }}>
                <Button
                style={{width: "100%"}}
                  className="export_btn"
                  variant="contained"
                  aria-label="Register"
                  onClick={downloadPDF}
                >
                  Download pdf
                </Button>
              </Grid>
            </Grid>
            {loading && <Loader />}

            <div
              className="m-16 design_list_blg view_design_list_blg"
              style={{
                height: "calc(60vh)",
                // width: "calc(82vw)",
                overflowX: "auto",
                overflowY: "auto",
                // margin: "10px 10px 30px 10px",
              }}
            >
              {" "}
              <Table className={classes.table} id="tbl_exporttable_to_xls">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableRowPad} align="left">
                      Party Name
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Total Fine
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
                      <TableCell>{item.balanceFine?.toFixed(3)}</TableCell>
                      <TableCell>
                        {Config.numWithComma(item.balanceAmount?.toFixed(3))}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className={classes.tableRowPad}>
                      <b>Total:</b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      <b>
                        {" "}
                        {HelperFunc.getTotalOfFieldNoDecimal(
                          apiData,
                          "balanceFine"
                        ).toFixed(3)}
                      </b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      <b>
                        {" "}
                        {Config.numWithComma(
                          HelperFunc.getTotalOfFieldNoDecimal(
                            apiData,
                            "balanceAmount"
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

export default CustomerSummariseBalance;

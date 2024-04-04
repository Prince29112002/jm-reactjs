import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, InputBase } from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import PackingSlipList from "./SubView/PackingSlipList";
import HallmarkList from "./SubView/HallmarkList";
import moment from "moment";
import { CSVLink } from "react-csv";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  inputBox: {
    // marginTop: 8,
    // padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "15%",
  },
  search: {
    display: "flex",
    border: "1px solid #cccccc",
    height: "38px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
    width: "100%",
    // maxWidth: "calc(100% - 16px)",
    marginInline: "auto"
  },
  tab: {
    padding: 0,
    minWidth: "auto",
    marginRight: 30,
    textTransform: "capitalize",
  },
  input: {
    flex: 1,
    width: "100%",
    height: "37px",
    color: "#CCCCCC",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter",
  },
  filterbtn: {
    display: 'flex',
    justifyContent: 'flex-start',

    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-end',
    },
  },
}));

const Hallmark = (props) => {
  const [startDate, setStartDate] = useState("");
  const [startDateErr, setStartDateErr] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endDateErr, setEndDateErr] = useState("");
  const [modalView, setModalView] = useState(0);
  const [searchData, setSearchData] = useState("");
  const [filter, setFilter] = useState(false);
  const [downLoadHallmark, setDownLoadHallmark] = useState([]);
  const [downLoadPackingSlip, setDownLoadPackingSlip] = useState([]);
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleChangeTab = (event, value) => {
    setModalView(value);
  };

  useEffect(() => {
    NavbarSetting("Hallmark", dispatch);
  }, []);

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("YYYY-MM-DD"); //new Date();
    if (name === "startDatee") {
      setStartDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      if (dateVal <= today && minDateVal < dateVal) {
        setStartDateErr("");
      } else {
        setStartDateErr("Enter Valid Date");
      }
    } else if (name === "endDatee") {
      setEndDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      if (dateVal <= today && minDateVal < dateVal) {
        setEndDateErr("");
      } else {
        setEndDateErr("Enter Valid Date");
      }
    }
  }

  function validateStartDate() {
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    if (!startDate || dateRegex.test(startDate) === false) {
      var today = moment().format("YYYY-MM-DD"); //new Date();
      let dateVal = moment(startDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal) {
        return true;
      } else {
        setStartDateErr("Enter Valid Date!");
        return false;
      }
    }
    return true;
  }

  function validateEndDate() {
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    if (!endDate || dateRegex.test(endDate) === false) {
      var today = moment().format("YYYY-MM-DD"); //new Date();
      let dateVal = moment(endDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      if (dateVal <= today && minDateVal < dateVal) {
        return true;
      } else {
        setEndDateErr("Enter Valid Date!");
        return false;
      }
    }
    return true;
  }
  function validateBothDate() {
    let startVal = moment(startDate).format("YYYY-MM-DD"); //new Date(value);
    let endVal = moment(endDate).format("YYYY-MM-DD"); //new Date(value);
    if (startVal > endVal) {
      setStartDateErr("Please Enter valid Date");
      setEndDateErr("Please Enter valid Date");
      return false;
    }
    return true;
  }

  function callFilterApi() {
    if (validateStartDate() && validateEndDate() && validateBothDate()) {
      setFilter(true);
    }
  }

  function ResetData() {
    setFilter(false);
    setSearchData("");
    setStartDate("");
    setStartDateErr("");
    setEndDate("");
    setEndDateErr("");
  }

  const setHallmarkListData = (objData) => {
    if (objData.length > 0) {
      const csvData = objData.map((item, i) => {
        return {
          No: i + 1,
          Client: item.Client,
          Company: item.Company,
          HallmarkIssueStation: item.HallmarkIssueStation,
          created_Date: moment(new Date(item.created_at)).format("DD-MM-YYYY"),
        };
      });
      setDownLoadHallmark(csvData);
    } else {
      setDownLoadHallmark("No Data Avilable");
    }
  };

  const setPackingSlipListData = (objData) => {
    if (objData.length > 0) {
      const csvData = objData.map((item, i) => {
        return {
          No: i + 1,
          SlipBarCode: item.SlipBarCode,
          Purity: item.purity,
          "Phy Pieces": item.phy_pcs,
          "Gross Weight": item.gross_wgt,
          "Other Weight": item.other_wgt,
          "Net Weight": item.net_wgt,
        };
      });
      setDownLoadPackingSlip(csvData);
    } else {
      setDownLoadPackingSlip("No Data Avilable");
    }
  };

  const resetAllData = () => {
    setStartDate("");
    setStartDateErr("");
    setEndDate("");
    setEndDateErr("");
    setSearchData("");
    setFilter(false);
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container table-width-mt">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            <Grid
              container
              alignItems="center"
              style={{ marginBottom: 20, marginTop: 30, paddingInline: 30 }}
            >
              <Grid item xs={12} sm={6} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">Hallmark</Typography>
                </FuseAnimate>
              </Grid>

              <Grid item xs={12} sm={6} md={9} key="2">
                <Button className="csvbutton">
                  <CSVLink
                    className="csvbuttontext"
                    data={
                      modalView === 0 ? downLoadHallmark : downLoadPackingSlip
                    }
                    filename={
                      modalView === 0
                        ? "Hallmark_Slip_list.csv"
                        : "Packing_Slip_list.csv"
                    }
                  >
                    Download
                  </CSVLink>
                </Button>
              </Grid>
            </Grid>

            {/* <div
              style={{ textAlign: "right", float: "right" }}
              className="mr-16"
            >
              <label style={{ display: "contents" }}> Search : </label>
              <input id="voucherlist-input" type="search"   />
            </div> */}

            <div className="main-div-alll">
              <Grid container style={{alignItems: "flex-end"}}>
                <Grid
                  item
                  lg={10}
                  md={8}
                  sm={12}
                  xs={12}
                >
                  <Grid container style={{alignItems: "flex-end"}} spacing={2}>
                    <Grid item lg={3} md={4} sm={4} xs={12}>
                      <label style={{display: "block", marginBottom: 5}}>Start Date*</label>
                      <TextField
                        placeholder="Start Date"
                        name="startDatee"
                        value={startDate}
                        error={startDateErr.length > 0 ? true : false}
                        helperText={startDateErr}
                        type="date"
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                        inputProps={{
                          max: moment().format("YYYY-MM-DD")
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item lg={3} md={4} sm={4} xs={12}>
                      <label style={{display: "block", marginBottom: 5}}>End Date*</label>
                      <TextField
                        placeholder="End Date"
                        name="endDatee"
                        value={endDate}
                        error={endDateErr.length > 0 ? true : false}
                        helperText={endDateErr}
                        type="date"
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                        inputProps={{
                          max: moment().format("YYYY-MM-DD")
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item lg={3} md={4} sm={4} xs={12} className={classes.filterbtn}>
                      <Button
                        variant="contained"
                        className="filter_reset_button"
                        size="small"
                        onClick={callFilterApi}
                      >
                        Filter
                      </Button>

                      <Button
                        variant="contained"
                        className="filter_reset_button ml-16"
                        size="small"
                        onClick={ResetData}
                      >
                        Reset
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  lg={2}
                  md={4}
                  sm={12}
                  xs={12}
                  style={{ borderRadius: "7px !important", marginTop: "16px", md: {marginTop: 0} }}
                  component="form"
                  className={classes.search}
                >
                  <InputBase
                    className={classes.input}
                    placeholder="Search"
                    inputProps={{ "aria-label": "search" }}
                    value={searchData}
                    onChange={(e) => {
                      setSearchData(e.target.value);
                    }}
                  />
                  <IconButton
                    type="submit"
                    className={classes.iconButton}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </Grid>
              </Grid>
              {/* <Grid className="department-tab-pt department-tab-blg-dv hallmark-main-tbl-dv"> */}
              <div className="pt-20 pb-20">
                <Tabs value={modalView} onChange={handleChangeTab}>
                  <Tab className={classes.tab} label="Hallmark Slip List" />
                  <Tab className={classes.tab} label="Packing Slip List" />
                </Tabs>
              </div>
              {modalView === 1 && (
                <PackingSlipList
                  props={props}
                  search={searchData}
                  filterDate={filter}
                  sDate={startDate}
                  eDate={endDate}
                  func={setPackingSlipListData}
                  reset={resetAllData}
                />
              )}
              {modalView === 0 && (
                <HallmarkList
                  props={props}
                  search={searchData}
                  filterDate={filter}
                  sDate={startDate}
                  eDate={endDate}
                  func={setHallmarkListData}
                  reset={resetAllData}
                />
              )}

              {/* </Grid> */}
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default Hallmark;

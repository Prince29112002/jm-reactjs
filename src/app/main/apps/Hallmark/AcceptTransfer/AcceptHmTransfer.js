import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, InputBase } from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import History from "@history";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PackingSlipTransfer from '../AcceptTransfer/Subview/PackingSlipTransfer';
import HallmarkTransfer from '../AcceptTransfer/Subview/HallmarkTransfer';
import moment from "moment";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import Icones from "assets/fornt-icons/Mainicons";
import SearchIcon from "@material-ui/icons/Search";
import { CSVLink } from "react-csv";

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
  searchBox: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
  search: {
    display: "flex",
    border: "1px solid #cccccc",
    height: "38px",
    width: "340px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "340px",
    height: "37px",
    color: "#CCCCCC",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter",
  },
}));

const AcceptHmTransfer = (props) => {

  const [modalView, setModalView] = useState(0);
  const [acceptAll, setAccept] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startDateErr, setStartDateErr] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endDateErr, setEndDateErr] = useState("");
  const [searchData, setSearchData] = useState("");
  const [filter, setFilter] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    NavbarSetting('Hallmark', dispatch);
  }, []);

  const handleChangeTab = (event, value) => {
    setModalView(value);
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "startDate") {
      setStartDate(value);
      setStartDateErr("");
    } else if (name === "endDate") {
      setEndDate(value);
      setEndDateErr("");
    }
  }

  function validateStartDate() {
    if (startDate === "") {
      setStartDateErr("Please Enter Start Date");
      return false;
    }
    return true;
  }

  function validateEndDate() {
    if (endDate === "") {
      setEndDateErr("Please Enter End Date");
      return false;
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
      setFilter(true)
    }
  }

  function ResetData() {
    setFilter(false)
    setStartDate("")
    setStartDateErr("")
    setEndDate("")
    setEndDateErr("")
  }


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container table-width-mt">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="department-main-dv pb-8"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={8} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Accept Transfer
                  </Typography>
                </FuseAnimate>
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
                md={9}
                key="2"
                style={{ textAlign: "right" }}
              >
                {/* <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={(event) => { History.push('/dashboard/hallmark') }}
                >
                  Back
                </Button> */}
                <div className="btn-back mt-6">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    className=""
                    size="small"
                    onClick={(event) => { History.push('/dashboard/hallmark') }}
                  >
                    Back
                  </Button>
                </div>

                <IconButton
                style={{ padding: "0", height: "100%" }}
                className="ml-0"
                onClick={(ev) => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  // editHandler(row.id);
                }}
              >
                 <Icon className="mr-8 download-icone" style={{ color: "dodgerblue" }}>
                        <img src={Icones.download_green} alt="" />
                        </Icon>
              </IconButton> 
                {/* <Button className="csvbutton"
                >
                  <CSVLink
                    className="csvbuttontext"
                  >
                    Download
                  </CSVLink>
                </Button> */}

                <Button
                  id="btn-save"
                  variant="contained"
                  className={clsx(classes.button, "mr-5")}
                  size="small"
                  onClick={(event) => { setAccept(modalView) }}
                >
                  Accept All
                </Button>

              </Grid>
            </Grid>

            <div className="main-div-alll ">
              <Grid
                className="metalled-statement-pr"
                container
                spacing={3}
              >
                <Grid item lg={10} md={8} sm={4} xs={12} style={{ display: "flex" }}>
                  <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 6 }} className="ml-8">
                    <label>Start Date*</label>
                    <TextField
                      placeholder="From Date"
                      name="startDate"
                      value={startDate}
                      error={startDateErr.length > 0 ? true : false}
                      helperText={startDateErr}
                      type="date"
                      onKeyDown={(e => e.preventDefault())}
                      variant="outlined"
                      fullWidth
                      format="yyyy/MM/dd"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 6 }} className="ml-8">
                    <label>End Date*</label>
                    <TextField
                      placeholder="To Date"
                      name="endDate"
                      value={endDate}
                      error={endDateErr.length > 0 ? true : false}
                      helperText={endDateErr}
                      type="date"
                      onKeyDown={(e => e.preventDefault())}
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
                      className="filter_reset_button ml-10"
                      variant="contained"
                      size="small"
                      onClick={callFilterApi}
                    >
                      Filter
                    </Button>
                    <Button
                      className="filter_reset_button ml-10"
                      variant="contained"
                      size="small"
                      onClick={ResetData}
                    >
                      Reset
                    </Button>
                  </Grid>
                </Grid>
                <Grid item lg={2} md={4} sm={4} xs={12} style={{ marginTop: "36px", borderRadius: "7px !important" }}
                  component="form"
                  className={classes.search}
                >
                  <InputBase
                    className={classes.input}
                    placeholder="Search"
                    inputProps={{ "aria-label": "search" }}
                    value={searchData}
                    onChange={(e) => { setSearchData(e.target.value) }}
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
            
            {/* <Grid className="department-tab-pt department-tab-blg-dv accepttransfer-_main-tbl"> */}
              <div className="pt-20 pb-20">
                  <Tabs value={modalView} onChange={handleChangeTab}>
                    <Tab label="Accept Hallmark Slip" />
                    <Tab label="Accept Packing Slip" />
                  </Tabs>
                </div>
                {modalView === 1 && <PackingSlipTransfer accept={acceptAll} search={searchData} filterDate={filter} sDate={startDate} eDate={endDate} />}
                {modalView === 0 && <HallmarkTransfer accept={acceptAll} search={searchData} filterDate={filter} sDate={startDate} eDate={endDate} />}
            {/* </Grid> */}
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AcceptHmTransfer;

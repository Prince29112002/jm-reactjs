import { FuseAnimate } from "@fuse";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import Loader from "app/main/Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import AppContext from "app/AppContext";
import clsx from "clsx";
import Select, { createFilter } from "react-select";


const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    // height: "100%",
    minHeight: "250px",
  },
  table: {
    // tableLayout: "auto",
    minWidth: 650,
  },
  tableCellPad: {
    padding: 7,
    // border: "1px solid #d3d3d3",
  },
  tableInput: {
    padding: 0,
  },
  tableHeadPad: {
    padding: "7px",
    // border: "1px solid #d3d3d3",
  },
  tableRowPad: {
    padding: 0,
    // border: "1px solid #d3d3d3",
  },
  filterBtn: {
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
    marginBlock: "3px",
  },
}));

const MeltingReceive = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [fromDate, setFromDate] = useState(
    moment().subtract(1, "months").format("YYYY-MM-DD")
  );
  const [selectDepartment, setSelectDepartment] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [fromDtErr, setFromDtErr] = useState("");
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");
  const appContext = useContext(AppContext);
  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };
  const { selectedDepartment } = appContext;
  useEffect(() => {
    //eslint-disable-next-line
    if (selectedDepartment !== "") {
      setFilters();
    }
  }, [selectedDepartment]);

  useEffect(() => {
    NavbarSetting("Sales", dispatch);
  }, []);

  useEffect(() => {
    getDepartmentListdata();
  }, []);

  function getMetaltingIssue(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          setLoading(false);
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              setApiData(response.data.data);
            } else {
              setApiData([]);
            }
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
            setApiData([]);
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
          setApiData([]);
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: url });
      });
  }

  function getDepartmentListdata() {
    // setLoading(true)
    axios
      .get(Config.getCommonUrl() + "api/admin/getdepartmentlist")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setDepartmentList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          // setLoading(false)
        }
      })
      .catch((error) => {
        // setLoading(false)
        handleError(error, dispatch, { api: "api/admin/getdepartmentlist" });
      });
  }
  
  const handleDepartmentChange = (value) => {
    setSelectDepartment(value);
  };

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
      // console.log(today,dateVal,dateVal <= today, minDateVal < dateVal)
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
      // console.log(today,dateVal,dateVal <= today, minDateVal < dateVal)
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
      // console.log(today,dateVal,dateVal <= today, minDateVal < dateVal)
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
      // console.log(today,dateVal,dateVal <= today, minDateVal < dateVal)
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
    let url = `api/meltingIssueReturn?department_id=${selectDepartment?.value}&start=
      ${fromDate}
      &end=
      ${toDate}`;

    // if (
    //   moment(new Date(fromDate)).format("YYYY-MM-DD") >=
    //   moment(new Date(toDate)).format("YYYY-MM-DD")
    // ) {
    //   setFromDtErr("Enter Valid Date!");
    //   setToDtErr("Enter Valid Date!");
    //   return;
    // }
    console.log(url);
    getMetaltingIssue(url);
  }

  function resetFilters() {
    setFromDate("");
    setFromDtErr("");
    setSelectDepartment([]);
    setToDate("");
    setToDtErr("");
    // call api without filter
    getMetaltingIssue("api/meltingIssueReturn?");
  }


  return (
    <div>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0" style={{ marginTop: "30px" }}>
            <Grid
              container
              alignItems="center"
              style={{ paddingInline: "30px" }}
            >
              <Grid item xs={6} sm={6} md={6} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Melting Receive
                  </Typography>
                </FuseAnimate>
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              >
                <Link
                  to="/dashboard/sales/meltingreceive/addmeltingreceive"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button
                    variant="contained"
                    className={classes.button}
                    size="small"
                    onClick={(event) => {
                      //   setDefaultView(btndata.id);
                      //   setIsEdit(false);
                    }}
                  >
                    Add New
                  </Button>
                </Link>
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll" style={{ marginTop: "20px" }}>
            <Box>
              <Grid
                container
                spacing={2}
                style={{ marginBottom: "20px", display: "flex", alignItems: "flex-end" }}
              >
                  
              <Grid item lg={2} md={4} sm={4} xs={12}>
                  <p style={{ paddingBottom: "3px" }}>Department Name</p>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={departmentList.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.name,
                    }))}
                    value={selectDepartment}
                    onChange={handleDepartmentChange}
                    autoFocus
                    blurInputOnSelect
                    tabSelectsValue={false}
                    placeholder="Department Name"
                  />
                </Grid>
                <Grid item lg={2} md={4} sm={4} xs={12}>
                  <p style={{ paddingBottom: "3px" }}>From date</p>
                  <TextField
                    name="fromDate"
                    value={fromDate}
                    error={fromDtErr.length > 0 ? true : false}
                    helperText={fromDtErr}
                    type="date"
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    //   format="yyyy/MM/dd"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: moment().format("YYYY-MM-DD"),
                    }}
                  />
                </Grid>

                <Grid item lg={2} md={4} sm={4} xs={12}>
                  <p style={{ paddingBottom: "5px" }}>To date</p>
                  <TextField
                    name="toDate"
                    value={toDate}
                    error={toDtErr.length > 0 ? true : false}
                    helperText={toDtErr}
                    type="date"
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    //   format="yyyy/MM/dd"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: moment().format("YYYY-MM-DD"),
                    }}
                  />
                </Grid>
                <Grid
                  item
                  lg={2}
                  md={4}
                  sm={4}
                  xs={12}
                  style={{
                    display: "flex",
                    columnGap: "10px",
                    alignItems: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    className={classes.filterBtn}
                    size="small"
                    onClick={(event) => {
                      setFilters();
                    }}
                  >
                    filter
                  </Button>

                  <Button
                    variant="contained"
                    className={clsx(classes.filterBtn)}
                    size="small"
                    onClick={(event) => {
                      resetFilters();
                    }}
                  >
                    reset
                  </Button>
                </Grid>
              </Grid>

              <Paper
                className={clsx(classes.tabroot, "table-responsive new-add_stock_group_tbel")}
                style={{ minHeight: "auto", marginBottom: "20px" }}
              >
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableHeadPad}>
                        Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Department Name
                      </TableCell>
                      <TableCell className={classes.tableHeadPad}>
                        Voucher No
                      </TableCell>
                      <TableCell className={classes.tableHeadPad}>
                        Avg Purity
                      </TableCell>
                      <TableCell className={classes.tableHeadPad}>
                        Jobworker Name
                      </TableCell>
                      <TableCell className={classes.tableHeadPad}>
                        Weight
                      </TableCell>
                      <TableCell className={classes.tableHeadPad}>
                        Fine Gold
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiData.length === 0 ? (
                      <>
                        <TableRow>
                          <TableCell
                            className={classes.tableCellPad}
                            colSpan={7}
                            style={{textAlign:"center"}}
                          >
                            No Data
                          </TableCell>
                        </TableRow>
                      </>
                    ) : (
                      apiData.map((row, i) => (
                    <TableRow key={i}>
                    <TableCell className={classes.tableCellPad}>
                      {moment
                        .utc(row.created_at)
                        .local()
                        .format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.department.name}
                    </TableCell>
                    <TableCell className={classes.tableCellPad}>
                      {row.voucher_no ? row.voucher_no : ""}
                    </TableCell>
                    <TableCell className={classes.tableCellPad}>
                      {row.avg_purity ? row.avg_purity : ""}
                    </TableCell>
                    <TableCell className={classes.tableCellPad}>
                      {row.jobworker.name ? row.jobworker.name : ""}
                    </TableCell>
                    <TableCell className={classes.tableCellPad}>
                      {row.total_issue_weight
                        ? row.total_issue_weight
                        : ""}
                    </TableCell>
                    <TableCell className={classes.tableCellPad}>
                      {row.total_fine_gold ? row.total_fine_gold : ""}
                    </TableCell>
                  </TableRow>
                     ))
                     )}
                  </TableBody>
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

export default MeltingReceive;

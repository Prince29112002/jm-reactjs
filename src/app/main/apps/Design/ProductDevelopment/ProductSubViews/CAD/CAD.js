import React, { useState, useEffect } from "react";
import { Icon, IconButton, TextField, InputBase } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import moment from "moment";
import History from "@history";
import Loader from "../../../../../Loader/Loader";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Modal from "@material-ui/core/Modal";
import { CSVLink } from "react-csv";
import SearchIcon from "@material-ui/icons/Search";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#FE8E0B",
    color: "white",
  },
  button1: {
    // margin: 5,
    textTransform: "none",
    backgroundColor: "#707070",
    color: "white",
  },

  button2: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#306FF1",
    color: "white",
  },
  button3: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#707070",
    color: "white",
    float: "right",
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

  search: {
    display: "flex",
    border: "1px solid #cccccc",
    height: "38px",
    float: "right",
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
  Transfer: {
    paddingRight: " 0px !important",
  },
}));

const CAD = ({ props }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [modalView, setModalView] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cadList, setCadList] = useState([]);
  const [cadRepairlist, setCadRepairlist] = useState([]);
  const [completedCadList, setCompletedCadList] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [readioValue, setReadioValue] = useState("1");
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [cadJobId, setcadJobId] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endDateErr, setEndDateErr] = useState("");
  const loginId = localStorage.getItem("userId");
  const [exportData, setExportData] = useState([]);
  const [authAccessArr, setAuthAccessArr] = useState([]);
  const roleOfUser = localStorage.getItem("permission")
    ? JSON.parse(localStorage.getItem("permission"))
    : [];

  useEffect(() => {
    const arr = roleOfUser["Product Development"]?.["Cad Job"];
    const arrData = [];
    if (arr.length > 0) {
      arr.map((item) => {
        arrData.push(item.name);
      });
    }
    setAuthAccessArr(arrData);
  }, []);

  useEffect(() => {
    if (searchData === "") {
      if (modalView === 5) {
        completedList();
      } else if (modalView === 1) {
        cadRepairList();
        getCADList();
      }
    } else {
      const timeout = setTimeout(() => {
        if (searchData) {
          callSearchFilterApi();
        }
      }, 800);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [searchData]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        Config.getCommonUrl() + `api/cadjob/transfer/${cadJobId}/${readioValue}`
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setcadJobId("");
          setOpen(false);
          completedList();
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/cadjob/transfer/${cadJobId}/${readioValue}`,
        });
      });
  };
  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    const target = e.target;
    const endDateValue = target.type === "checkbox" ? target.checked : target.value;
    var today = moment().format("YYYY-MM-DD"); 

    if (name === "endDate") {
      setEndDate(endDateValue);
      let dateVal = moment(endDateValue).format("YYYY-MM-DD"); //new Date(value);
      if (dateVal >= today ) {
        setEndDateErr("");
      } else {
        setEndDateErr("Enter Valid Date");
      }
    }
    setReadioValue(value);
  };

  useEffect(() => {
    if (modalView === 5) {
      if (searchData || endDate) {
        setSearchData("");
        setEndDate("");
        setEndDateErr("");
      }
      completedList();
    } else if (modalView === 1) {
      if (searchData || endDate) {
        setSearchData("");
        setEndDate("");
        setEndDateErr("");
      }
      getCADList();
      cadRepairList();
    } else if (modalView === 2) {
      History.push(`/dashboard/design/createcad`);
    } else if (modalView === 3) {
      History.push(`/dashboard/design/cadrepairing`);
    } else if (modalView === 4) {
      History.push(`/dashboard/design/cadrejectionreceived`);
    }
  }, [modalView]);

  useEffect(() => {
    NavbarSetting("Design", dispatch);
  }, []);

  function getModalStyle() {
    const top = 50; //+ rand();
    const left = 50; //+ rand();
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  function completedList() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/cadJobReceiveDesign/completed/all")
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const temp = res.data.data;
          callCompletedData(temp);
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
          setExportData([]);
          setCadList([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setExportData([]);

        handleError(error, dispatch, {
          api: "api/cadJobReceiveDesign/completed/all",
        });
      });
  }

  function callCompletedData(temp) {
    const arrData = temp.map((item) => {
      return {
        cadJobNum:
          item.CadJobNumber !== null ? item.CadJobNumber.cad_number : "",
        designerName:
          item.CadDesigner !== null
            ? item.CadDesigner !== null
              ? item.CadDesigner.username
              : ""
            : "",
        cadReceive: item !== null ? item.receive_design : "",
        no_of_design: item.no_of_design !== null ? item.no_of_design : "",
        endDate:
          item !== null
            ? moment.utc(item.updated_at).local().format("DD-MM-YYYY")
            : "",
        // status: "pendding",
        id: item.id,
      };
    });
    setCompletedCadList(arrData);
    let tempDlData = temp.map((item) => {
      return {
        "CAD job Number":
          item.CadJobNumber !== null ? item.CadJobNumber.cad_number : "",
        "Designer Name":
          item.CadDesigner !== null
            ? item.CadDesigner !== null
              ? item.CadDesigner.username
              : ""
            : "",
        "No Of CAD Receive":
          item.no_of_design !== null ? item.no_of_design : "",
        "No of CAD": item !== null ? item.receive_design : "",

        "End Date":
          item !== null
            ? moment.utc(item.updated_at).local().format("DD-MM-YYYY")
            : "",
      };
    });
    setExportData(tempDlData);
  }

  function getCADList() {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() +
          `api/cadjob?close_job=1&user_id=${loginId}&is_transfer=1`
      )
      .then((res) => {
        if (res.data.success) {
          const temp = res.data.data;
          callSetAllData(temp);
        } else {
          setExportData([]);
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
        setLoading(false);
      })
      .catch((error) => {
        setExportData([]);
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/cadjob?close_job=1&user_id=${loginId}`,
        });
      });
  }

  function callSetAllData(temp) {
    const arrData = temp.map((item) => {
      return {
        cadJobNum:
          item.CadJobData !== null
            ? item.CadJobData.CadJobNumber.cad_number
            : "",
        designerName:
          item.CadJobData !== null
            ? item.CadJobData.CadDesigner !== null
              ? item.CadJobData.CadDesigner.username
              : ""
            : "",
        noOfDesign:
          item.CadJobData !== null ? item.CadJobData.no_of_design : "",
        cadReceive:
          item.CadJobData !== null ? item.CadJobData.receive_design : "",
        process:
          item.CadJobData !== null
            ? item.CadJobData.process === 1
              ? "New CAD"
              : "CAD Repairing"
            : "",
        assignDate:
          item.CadJobData !== null
            ? moment
                .utc(item.CadJobData.created_at)
                .local()
                .format("DD-MM-YYYY")
            : moment.utc(item.updated_at).local().format("DD-MM-YYYY"),
        endDate:
          item.CadJobData !== null
            ? moment.utc(item.CadJobData.end_date).local().format("DD-MM-YYYY")
            : "",
        // status: "pendding",
        id: item.CadJobData !== null ? item.CadJobData.id : null,
      };
    });

    let tempDlData = temp.map((item) => {
      return {
        "CAD Job Number":
          item.CadJobData !== null
            ? item.CadJobData.CadJobNumber.cad_number
            : "",
        " Designer Name":
          item.CadJobData !== null
            ? item.CadJobData.CadDesigner !== null
              ? item.CadJobData.CadDesigner.username
              : ""
            : "",
        "No of Design":
          item.CadJobData !== null ? item.CadJobData.no_of_design : "",
        "No Of CAD Receive":
          item.CadJobData !== null ? item.CadJobData.receive_design : "",
        Process:
          item.CadJobData !== null
            ? item.CadJobData.process === 1
              ? "New CAD"
              : "CAD Repairing"
            : "",
        "Assign Date":
          item.CadJobData !== null
            ? moment
                .utc(item.CadJobData.created_at)
                .local()
                .format("DD-MM-YYYY")
            : moment.utc(item.updated_at).local().format("DD-MM-YYYY"),
        "End Date":
          item.CadJobData !== null
            ? moment.utc(item.CadJobData.end_date).local().format("DD-MM-YYYY")
            : "",
      };
    });

    setExportData(tempDlData);

    setCadList(arrData);
  }

  const ButtonArr = [
    { id: 2, text: "Create New Cad" },
    { id: 3, text: "Cad Repairing Issue" },
    { id: 4, text: "Cad Repairing Receive" },
    { id: 5, text: "Cad Completed" },
  ];

  const editHandler = (id, viewPage) => {
    if (id !== null) {
      History.push("/dashboard/design/editcad", { id: id, viewPage: viewPage });
    }
  };

  const checkStatus = (rowData) => {
    // const assDate = moment(rowData.created_at).format("DD-MM-YYYY");
    const enddate = moment(rowData.endDate, "DD-MM-YYYY").format("YYYY-MM-DD");
    const today = moment().format("YYYY-MM-DD");

    if (today > enddate && rowData.cadReceive === 0) {
      return "#FFDBDB";
    } else if (today > enddate && rowData.cadReceive !== 0) {
      return "#FFDBDB";
    } else if (enddate >= today && rowData.cadReceive === 0) {
      // return "FEB560"
    } else if (enddate >= today && rowData.cadReceive !== 0) {
      // return "FEB560"
    } else {
      return null;
    }
  };

  const displayStatus = (rowData) => {
    const enddate = moment(rowData.endDate, "DD-MM-YYYY").format("YYYY-MM-DD");
    const today = moment().format("YYYY-MM-DD");
    // const nextThreeDays = moment(assDate, "DD-MM-YYYY").add(3, 'days').format("DD-MM-YYYY");
    // const assDate = moment(rowData.created_at).format("YYYY-MM-DD");

    if (today > enddate && rowData.cadReceive === 0) {
      return <span style={{ color: "#FF4C4C" }}>Delay</span>;
    } else if (today > enddate && rowData.cadReceive !== 0) {
      return <span style={{ color: "#FF4C4C" }}>Delay</span>;
    } else if (enddate >= today && rowData.cadReceive === 0) {
      return <span style={{ color: "#FEB560" }}>Pending</span>;
    } else if (enddate >= today && rowData.cadReceive !== 0) {
      return <span style={{ color: "#6898FE" }}>In Process</span>;
    } else {
      return null;
    }
  };

  function ResetData() {
    setSearchData("");
    setEndDate("");
    setEndDateErr("");
    if (modalView === 5) {
      completedList();
    } else if (modalView === 1) {
      getCADList();
    }
  }

  function validateEndDate() {
    if (endDate === "") {
      setEndDateErr("Please Enter End Date");
      return false;
    }
    return true;
  }

  function callFilterApi() {
    if (validateEndDate()) {
      callSearchFilterApi();
    }
  }

  function callSearchFilterApi() {
    setLoading(true);
    if (modalView === 5) {
      var api = `api/cadjob/completed/search?endDate=${endDate}&search=${searchData}&user_id=${loginId}`;
    } else {
      var api = `api/cadjob/search/?endDate=${endDate}&search=${searchData}&user_id=${loginId}`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          const temp = response.data.data;
          if (modalView === 5) {
            callCompletedData(temp);
          } else {
            callSetAllData(temp);
          }
        } else {
          setExportData([]);
          setCadList([]);
          setCompletedCadList([]);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: api });
      });
  }

  function cadRepairList() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/cadjob/repair/list")
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const temp = res.data.data;
          const arrData = temp.map((item) => {
            return {
              CadNum:
                item.CadJobDetails.CadJobNumber !== null
                  ? item.CadJobDetails.CadJobNumber.cad_number
                  : "",
              designerName:
                item.CadJobDetails.CadDesigner !== null
                  ? item.CadJobDetails.CadDesigner.username
                  : "",
              tempCadNum: item !== null ? item.temp_cad_no : "",
              noOfDesign:
                item.CadJobDetails !== null
                  ? item.CadJobDetails.no_of_design
                  : "",
              cadReceive:
                item.CadJobDetails !== null
                  ? item.CadJobDetails.receive_design
                  : "",
              process:
                item !== null
                  ? item.process === 3
                    ? "Reparing issue"
                    : item.process === 6
                    ? "Transfer For Reparing"
                    : ""
                  : "",
              assignDate:
                item.CadJobDetails !== null
                  ? moment
                      .utc(item.CadJobDetails.created_at)
                      .local()
                      .format("DD-MM-YYYY")
                  : "",
              endDate:
                item !== null
                  ? moment
                      .utc(item.CadJobDetails.end_date)
                      .local()
                      .format("DD-MM-YYYY")
                  : "",
            };
          });
          setCadRepairlist(arrData);
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/cadjob/repair/list",
        });
      });
  }
  return (
    <>
      {" "}
      <div className={clsx(classes.root, props.className, "w-full")}>
        <FuseAnimate animation="transition.slideUpIn" delay={200}>
          <div className="flex flex-col md:flex-row container">
            <div className="flex flex-1 flex-col min-w-0">
              <div className="main-div-alll">
                <Grid
                  className="w-full create-account-main-dv "
                  container
                  spacing={4}
                  alignItems="stretch"
                  style={{ margin: 0 }}
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    key="1"
                    style={{ padding: 0 }}
                  >
                    <Button
                      // variant="contained"
                      className={
                        modalView === 1
                          ? "btn-design-list m-5"
                          : "btn-design-list-hover m-5"
                      }
                      size="small"
                      key={1}
                      onClick={(event) => setModalView(1)}
                    >
                      Cad List
                    </Button>
                    {ButtonArr.map((btndata, idx) => {
                      if (authAccessArr.includes(btndata.text)) {
                        return (
                          <Button
                            // variant="contained"
                            className={
                              btndata.id === modalView
                                ? "btn-design-list m-5"
                                : "btn-design-list-hover m-5"
                            }
                            size="small"
                            key={idx}
                            onClick={(event) => setModalView(btndata.id)}
                          >
                            {btndata.text}
                          </Button>
                        );
                      }
                    })}
                    {modalView === 5 ? (
                      <div
                        className={clsx(classes.search, "mt-28 float-right")}
                      >
                        <InputBase
                          className={classes.input}
                          placeholder="Search"
                          inputProps={{ "aria-label": "search" }}
                          value={searchData}
                          onChange={(event) =>
                            setSearchData(event.target.value)
                          }
                        />
                        <IconButton
                          type="submit"
                          className={classes.iconButton}
                          aria-label="search"
                        >
                          <SearchIcon />
                        </IconButton>
                      </div>
                    ) : (
                      ""
                    )}
                  </Grid>

                  {modalView === 1 && cadRepairlist.length > 0 ? (
                    <div
                      style={{
                        height: "calc(20vh)",
                        overflowX: "hidden",
                        overflowY: "auto",
                        margin: "10px 0px 10px 0px",
                      }}
                    >
                      <MaUTable className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              Temp Cad Number
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              CAD Job Number
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Designer Name
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              No of Design
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              No Of CAD Receive
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Process
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Assign Date
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              End Date
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Status
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {cadRepairlist.map((row, index) => (
                            <TableRow
                              key={index}
                              style={{ backgroundColor: checkStatus(row) }}
                            >
                              <TableCell className={classes.tableRowPad}>
                                {row.tempCadNum}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.CadNum}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.designerName}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.noOfDesign}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.cadReceive}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.process}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.assignDate}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.endDate}
                              </TableCell>
                              <TableCell
                                className={clsx(classes.tableRowPad, "pr-28")}
                              >
                                {row.endDate !== "" ? displayStatus(row) : ""}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </MaUTable>
                    </div>
                  ) : (
                    ""
                  )}
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    style={{
                      display: "flex",
                      padding: "0px",
                      marginTop: "10px",
                      alignItems: "flex-end",
                    }}
                  >
                    <Grid item lg={3} md={2} sm={2} xs={6}>
                      <p>End Date</p>
                      <TextField
                        placeholder="End Date"
                        name="endDate"
                        variant="outlined"
                        fullWidth
                        value={endDate}
                        error={endDateErr.length > 0 ? true : false}
                        helperText={endDateErr}
                        type="date"
                        // onChange={(e) => {
                        //   setEndDate(e.target.value);
                        //   setEndDateErr("");
                        // }}
                        onChange={(e) => handleInputChange(e)}
                        inputProps={{
                          max: moment().format("YYYY-MM-DD"),
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                    <Grid
                      style={{
                        paddingLeft: 8,
                        marginTop: "2px",
                        display: "flex",
                        alignItems: "flex-end",
                      }}
                      // className="pt-10"
                    >
                      <Button
                        id="btn-save"
                        variant="contained"
                        className={clsx(classes.button1, "mr-8")}
                        size="small"
                        onClick={callFilterApi}
                        style={{ height: "35px", width: "45px" }}
                      >
                        Filter
                      </Button>

                      <Button
                        id="btn-save"
                        variant="contained"
                        className={clsx(classes.button1, "mr-16")}
                        size="small"
                        onClick={ResetData}
                        style={{ height: "35px", width: "45px" }}
                      >
                        Reset
                      </Button>
                      {modalView === 1 ? (
                        <Button
                          style={{
                            padding: "0",
                            height: "35px",
                            marginTop: "20px",
                          }}
                          className="csvbutton  ml-0"
                          disabled={exportData.length === 0}
                        >
                          <CSVLink
                            className="csvbuttontext"
                            data={exportData}
                            filename={
                              modalView === 1
                                ? "cad_List.csv"
                                : "Completed_cad_list.csv"
                            }
                          >
                            Download
                          </CSVLink>
                        </Button>
                      ) : (
                        ""
                      )}
                    </Grid>
                    {modalView === 1 ? (
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <div
                          className={clsx(classes.search, "mt-28 float-right")}
                        >
                          <InputBase
                            className={classes.input}
                            placeholder="Search"
                            inputProps={{ "aria-label": "search" }}
                            value={searchData}
                            onChange={(event) =>
                              setSearchData(event.target.value)
                            }
                          />
                          <IconButton
                            type="submit"
                            className={classes.iconButton}
                            aria-label="search"
                          >
                            <SearchIcon />
                          </IconButton>
                        </div>
                      </Grid>
                    ) : (
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Button
                          style={{
                            padding: "0",
                            height: "35px",
                            marginTop: "20px",
                          }}
                          className="csvbutton ml-0"
                          disabled={exportData.length === 0}
                        >
                          <CSVLink
                            // data={modalView === 1 ? cadList : completedCadList}
                            className="csvbuttontext"
                            data={exportData}
                            filename={
                              modalView === 1
                                ? "master.csv"
                                : "Completed_master_list.csv"
                            }
                          >
                            Download
                          </CSVLink>
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Grid>

                {loading && <Loader />}
                <div className="mt-16 design_list_tbl">
                  <Paper
                    className={clsx(
                      classes.tabroot,
                      "table-responsive design_list_blg view_design_list_blg"
                    )}
                  >
                    {modalView === 5 ? (
                      <>
                        <MaUTable className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
                                CAD job Number
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Designer Name
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                No of CAD
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                No Of CAD Receive
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                End Date
                              </TableCell>
                              {!Config.idDesigner() && (
                                <TableCell className={classes.tableRowPad}>
                                  Action
                                </TableCell>
                              )}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {completedCadList.map((row, index) => (
                              <TableRow key={index}>
                                <TableCell className={classes.tableRowPad}>
                                  {row.cadJobNum}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.designerName}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.no_of_design}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.cadReceive}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.endDate}
                                </TableCell>
                                {!Config.idDesigner() && (
                                  <TableCell
                                    className={
                                      (classes.tableRowPad, classes.Transfer)
                                    }
                                  >
                                    <Button
                                      className="w-155 popup-save"
                                      variant="contained"
                                      aria-label="Register"
                                      onClick={() => {
                                        setOpen(true);
                                        setcadJobId(row.id);
                                      }}
                                    >
                                      TRANSFER TO
                                    </Button>
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </MaUTable>
                      </>
                    ) : (
                      modalView === 1 && (
                        <>
                          <MaUTable className={classes.table}>
                            <TableHead>
                              <TableRow>
                                <TableCell className={classes.tableRowPad}>
                                  CAD Job Number
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Designer Name
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  No of Design
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  No Of CAD Receive
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Process
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Assign Date
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  End Date
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Status
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Action
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {cadList.map((row, index) => (
                                <TableRow
                                  key={index}
                                  style={{ backgroundColor: checkStatus(row) }}
                                >
                                  <TableCell className={classes.tableRowPad}>
                                    {row.cadJobNum}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.designerName}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.noOfDesign}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.cadReceive}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.process}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.assignDate}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.endDate}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.endDate !== ""
                                      ? displayStatus(row)
                                      : ""}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {authAccessArr.includes("Edit Cad Job") && (
                                      <IconButton
                                        style={{ padding: "0" }}
                                        disabled={
                                          row.id === null ? true : false
                                        }
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          ev.stopPropagation();
                                          editHandler(row.id, false);
                                        }}
                                      >
                                        {/* <Icon
                                      className="mr-8"
                                      style={
                                        row.id === null
                                          ? { color: "gray" }
                                          : { color: "dodgerblue" }
                                      }
                                    >
                                      edit
                                    </Icon> */}
                                        <Icon className="mr-8 edit-icone">
                                          <img src={Icones.edit} alt="" />
                                        </Icon>
                                      </IconButton>
                                    )}
                                    {authAccessArr.includes("View Cad Job") && (
                                      <IconButton
                                        style={{ padding: "0" }}
                                        disabled={
                                          row.id === null ? true : false
                                        }
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          ev.stopPropagation();
                                          editHandler(row.id, true);
                                        }}
                                      >
                                        {/* <Icon
                                      className="mr-8"
                                      style={
                                        row.id === null
                                          ? { color: "gray" }
                                          : { color: "dodgerblue" }
                                      }
                                    >
                                      visibility
                                    </Icon> */}
                                        <Icon className="mr-8 view-icone">
                                          <img src={Icones.view} alt="" />
                                        </Icon>
                                      </IconButton>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </MaUTable>
                        </>
                      )
                    )}
                  </Paper>
                </div>
              </div>
            </div>
          </div>
        </FuseAnimate>
      </div>
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={open}
          onClose={(_, reason) => {
            if (reason !== "backdropClick") {
              setOpen(false);
            }
          }}
        >
          <div
            style={modalStyle}
            className={clsx(classes.paper, "rounded-8")}
            id="modesize-dv"
          >
            <h5 className="popup-head p-20">
              Transfer To
              <IconButton
                style={{ position: "absolute", top: "4px", right: "5px" }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Icon>
                  <img src={Icones.cross} alt="" />
                </Icon>
              </IconButton>
            </h5>
            <div className="p-5 pl-16 pr-16 model-row-blg-dv">
              <Grid>
                <Grid item lg={6} md={4} sm={4} xs={12} style={{ padding: 6 }}>
                  <FormControl
                    id="redio-input-dv"
                    component="fieldset"
                    className={classes.formControl}
                  >
                    <RadioGroup
                      aria-label="Gender"
                      id="radio-row-dv"
                      name="designAll"
                      className={classes.group}
                      // value={designAll}
                      onChange={handleInputChange}
                    >
                      <Grid item xs={12} style={{ padding: 0 }}>
                        <FormControlLabel
                          value={"1"}
                          control={<Radio />}
                          label="Direct Casting"
                          checked={readioValue === "1"}
                        />
                        <FormControlLabel
                          value={"2"}
                          control={<Radio />}
                          label="CAM Master"
                          checked={readioValue === "2"}
                        />
                      </Grid>
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  style={{ padding: 10 }}
                >
                  <h4>
                    If Direct casting selected then it will redirect to
                    'Engineered Images and Data' no other process need to do.
                  </h4>
                </Grid>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: 6 }}>
                {/* <Button
                  variant="contained"
                  color="primary"
                  className="w-full mx-auto"
                  style={{
                    backgroundColor: "#4caf50",
                    border: "none",
                    color: "white",
                  }}
                  onClick={(e) => handleFormSubmit(e)}
                >
                  SAVE
                </Button> */}
                <div className="comments_popup_button_div">
                  <Button
                    variant="contained"
                    className="cancle-button-css"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    className="save-button-css"
                    onClick={(e) => handleFormSubmit(e)}
                  >
                    SAVE
                  </Button>
                </div>
              </Grid>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default CAD;

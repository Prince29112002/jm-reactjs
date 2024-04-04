import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, TextField, InputBase } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as authActions from "app/auth/store/actions";
import * as Actions from "app/store/actions";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import Modal from "@material-ui/core/Modal";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import History from "@history";
import Loader from "../../../../../Loader/Loader";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import moment from "moment";
import Select, { createFilter } from "react-select";
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
  searchBox: {
    display: "flex",
    border: "1px solid #cccccc",
    float: "right",
    height: "38px",
    width: "340px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
  },
}));
function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const Master = ({ props }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [modalView, setModalView] = useState(1);
  const [modalStyle] = useState(getModalStyle);
  const [loading, setLoading] = useState(false);
  const [cadList, setCadList] = useState([]);
  const [apiList, setApiList] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [open, setOpen] = React.useState(false);
  const [cadJobId, setcadJobId] = useState("");
  const [addModal, setAddModal] = useState("")
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransferOpts, setSelectedTransferOpts] = useState("")
  const [transferOpts, setTransferOpts] = useState([])
  const [transferOptsErrTxt, setTransferOptsErrTxt] = useState("")
  const [mainId, setMainId] = useState("")
  const [endDate, setEndDate] = useState("");
  const [endDateErr, setEndDateErr] = useState("");
  const [exportData, setExportData] = useState([])
  const [authAccessArr, setAuthAccessArr] = useState([])
  const roleOfUser = localStorage.getItem('permission') ? JSON.parse(localStorage.getItem('permission')) : [];

  const theme = useTheme();

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  useEffect(()=>{
    const arr = roleOfUser['Product Development']?.['Master Finish'] 
    const arrData = []
    if(arr.length > 0) {
      arr.map((item)=>{
        arrData.push(item.name)
      })
    }
    setAuthAccessArr(arrData)
  },[])

  useEffect(() => {
    if (modalView === 6) {
      if(searchData || endDate){
       setSearchData("")
       setEndDate("")
       setEndDateErr("")
      }
       completedList()
      transferOptions()
   } else if (modalView === 1) {
     if(searchData || endDate){
       setSearchData("")
       setEndDate("")
       setEndDateErr("")
      }
       getAllDataList();
      
    } else if (modalView === 2) {
      History.push(`/dashboard/design/issuemasterfinishing`);
    } else if (modalView === 3) {
      History.push(`/dashboard/design/receivefromworkermaster`);
    } else if (modalView === 4) {
      History.push(`/dashboard/design/masterrepairing`);
    } else if (modalView === 5) {
      History.push(`/dashboard/design/masterrejectionreceived`);
    }
  }, [modalView]);

  useEffect(() => {
    NavbarSetting("Design", dispatch);
  }, []);
  useEffect(() => {
    if (searchData === "") {
      if (modalView === 6) {
        completedList();
      } else if (modalView === 1) {
        getAllDataList();
      }
    } else {
      const timeout = setTimeout(() => {
        if (searchData) {
          callSearchFilterApi();
        }
      }, 800);
      return () => {
        clearTimeout(timeout);
      }
    }
  }, [searchData])




  function handleModalClose() {
    setModalOpen(false);
  }

  function transferOptions() {
    axios
      .get(Config.getCommonUrl() + "api/cadjob/next/process")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);

          const key = Object.values(response.data.data);
          const values = Object.keys(response.data.data);
    

          let temp = [];
          // .map((suggestion) => ({
          //   value: suggestion.label,
          //   label: suggestion.stockGroup,
          // }));
          for (let i = 0; i < values.length; i++) {
            temp.push({
              value: key[i],
              label: values[i],
            });
          }
          setTransferOpts(temp);

        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {

        handleError(error, dispatch, { api: "api/cadjob/next/process" })

      });
  }

  function handleTransOptChange(value) {
    setSelectedTransferOpts(value);
    setTransferOptsErrTxt("");
  }

  function processValidation() {
    if (selectedTransferOpts === "") {
      setTransferOptsErrTxt("Please select proper process to transfer");
      return false;
    }
    return true;
  }

  function transferProcess() {
    if (processValidation()) {
      axios
        .put(Config.getCommonUrl() + `api/cadjob/process/transfer/${cadJobId}/3/${selectedTransferOpts.value}/${mainId}`)
        .then(function (response) {
          console.log(response);

          if (response.data.success === true) {
            dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
            //   setGSTPercent("");
            //   setDepartmentNm("");
            // setModalOpen(false);
            handleModalClose(true);
            setCadList([])
            completedList()
          } else {
            dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          }
        })
        .catch((error) => {

          handleError(error, dispatch, {
            api: `api/cadjob/process/transfer/${cadJobId}/3/${selectedTransferOpts.value}/${mainId}`
          })

        });
    }
  }

  function getAllDataList() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/cammasterfinish")
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const temp = res.data.data;
          callSetAllData(temp);
        } else {
          setExportData([])
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setExportData([])
        handleError(error, dispatch, { api: "api/cammasterfinish" });
      });
  }


  function callSetAllData(temp) {
    const arrData = temp.map((item) => {
      return {
        cad_number:
          item.CadNumberChrome !== null
            ? item.CadNumberChrome.temp_cad_no
            : "",
        voucher_no: item.voucher_no !== null ? item.voucher_no : "",
        cadJobNum:
          item.CadNumberChrome?.CadJobDetails?.CadJobNumber?.cad_number,
        designerName: item.Worker !== null ? item.Worker.username : "",
        weight: item.CadNumberChrome.cam_weight !== null ? item.CadNumberChrome.cam_weight : "",
        size: item.CadNumberChrome.size  !== null ? item.CadNumberChrome.size:"",
        process:
          item.process !== null
            ? item.process === 1
              ? "Issue to worker"
              : item.process === 2
                ? "Receive from worker"
                : "Issue to Repairing"
            : "",
        assignDate:
          item.created_at !== null
            ? moment.utc(item.created_at).local().format("DD-MM-YYYY")
            : moment.utc(item.updated_at).local().format("DD-MM-YYYY"),
        endDate:
          item.end_date !== null
            ? moment.utc(item.end_date).local().format("DD-MM-YYYY")
            : "",
        // status: "pendding",
        id: item.id !== null ? item.id : null,
      };
    });
    let tempDlData = temp.map((item) => {
      return {
        "CAD Number":
          item.CadNumberChrome !== null
            ? item.CadNumberChrome.temp_cad_no
            : "",
        "Voucher Number": item.voucher_no !== null ? item.voucher_no : "",
        "CAD Job Number":
          item.CadNumberChrome?.CadJobDetails?.CadJobNumber?.cad_number,
        " Worker Name": item.Worker !== null ? item.Worker.username : "",
        "Weight": item.CadNumberChrome.cam_weight !== null ? item.CadNumberChrome.cam_weight : "",
        "Size": item.CadNumberChrome.size  !== null ? item.CadNumberChrome.size:"",
        "Process":
          item.process !== null
            ? item.process === 1
              ? "Issue to worker"
              : item.process === 2
                ? "Receive from worker"
                : "Issue to Repairing"
            : "",
        " Assign Date":
          item.created_at !== null
            ? moment.utc(item.created_at).local().format("DD-MM-YYYY")
            : moment.utc(item.updated_at).local().format("DD-MM-YYYY"),
        " End Date":
          item.end_date !== null
            ? moment.utc(item.end_date).local().format("DD-MM-YYYY")
            : "",
      };
    });
    setExportData(tempDlData)
    setApiList(arrData);
  }

  function completedList() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/camMasterFinish/completed/all")
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const temp = res.data.data;
          callCompletedData(temp)
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
          setExportData([]);
          setCadList([])
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setExportData([])

        handleError(error, dispatch, {
          api: "api/camMasterFinish/completed/all",
        });
      });
  }

  function callCompletedData(temp){
          const arrData = temp.map((item) => {
            return {
              jobNum:
                item.CadNumberChrome?.CadJobDetails?.CadJobNumber?.cad_number,
              final_cad_number:
                item.CadNumberChrome !== null
                  ? item.CadNumberChrome.temp_cad_no
                  : "",
              cam_weight: item.cam_weight !== null ? item.cam_weight : "",
              name: item.Worker !== null ? item.Worker.username : "",
              // process: item.process !== null ? item.process : "",
              // created_at: item.created_at !== null ? item.created_at : "",
              endDate:
                item !== null
                  ? moment.utc(item.end_date).local().format("DD-MM-YYYY")
                  : "",
              // status: "pendding",
              id:
                item.CadNumberChrome !== null ? item.CadNumberChrome.id : null,
              mainId: item.id !== null ? item.id : null,
              size:item.size !== null ? item.size :""
            };
          });
          let tempDlData = temp.map((item) => {
            return {
              "CAD Job Number":
                item.CadNumberChrome?.CadJobDetails?.CadJobNumber?.cad_number,
              "CAD Number":
                item.CadNumberChrome !== null
                  ? item.CadNumberChrome.temp_cad_no
                  : "",
              "Designer Name": item.Worker !== null ? item.Worker.username : "",
              "Weight": item.cam_weight !== null ? item.cam_weight : "",
              "Size":item.size !== null ? item.size :"",
              // process: item.process !== null ? item.process : "",
              // created_at: item.created_at !== null ? item.created_at : "",
              "End Date":
                item !== null
                  ? moment.utc(item.end_date).local().format("DD-MM-YYYY")
                  : "",
            };
          });

          setExportData(tempDlData);
          setCadList(arrData)
  }

    const ButtonArr = [
      { id: 2, text: "Issue to Worker" },
      { id: 3, text: "Receive From Worker" },
      { id: 4, text: "Master Finish Repairing Issue" },
      { id: 5, text: "Master Finish Repairing Receive" },
      { id: 6, text: "Master Finish Completed" },
    ];


    const checkStatus = (rowData) => {
      // const assDate = moment(rowData.created_at).format("DD-MM-YYYY");
      const enddate = moment(rowData.endDate, "DD-MM-YYYY").format("YYYY-MM-DD");
      const today = moment().format("YYYY-MM-DD");
  
      if (today > enddate) {
        return "#FFDBDB";
      } 
    };
  
  const displayStatus = (rowData) => {
    const enddate = moment(rowData.endDate, "DD-MM-YYYY").format("YYYY-MM-DD");
    const today = moment().format("YYYY-MM-DD");
    
    if (today > enddate) {
      return <span style={{ color: "#FF4C4C" }}>Delay</span>;
    } else if (enddate >= today) {
      return <span style={{ color: "#6898FE" }}>In Process</span>;
    } else {
      return null;
    }
  };


  function ResetData() {
    setSearchData("")
    setEndDate("")
    setEndDateErr("")
    if (modalView === 6) {
      completedList();
    } else if (modalView === 1) {
      getAllDataList();
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
      callSearchFilterApi()
    }
  }
  function callSearchFilterApi() {
    setLoading(true);
    if(modalView === 6){
      var api = `api/cammasterfinish/completed/search?endDate=${endDate}&search=${searchData}`
    }else{
      var api = `api/cammasterfinish/search/?endDate=${endDate}&search=${searchData}`
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          const temp = response.data.data;
          if(modalView === 6){
            callCompletedData(temp)
          }else{
            callSetAllData(temp)
          }
        } else {
          setExportData([]);
          setCadList([])
          setApiList([])
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        }
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        setExportData([]);
        handleError(error, dispatch, { api: api })
      });
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("YYYY-MM-DD"); 
    if (name === "endDate") {
      setEndDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      if (dateVal >= today ) {
        setEndDateErr("");
      } else {
        setEndDateErr("Enter Valid Date");
      }
    }
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
          <div className="main-div-alll">
            <Grid
              className="create-account-main-dv"
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
                        ?"btn-design-list m-5": "btn-design-list-hover m-5"
                      }
                      size="small"
                      key={1}
                      onClick={(event) => setModalView(1)}
                    >
                      Master Finish List
                    </Button>
                  {ButtonArr.map((btndata, idx) => {
                    if(authAccessArr.includes(btndata.text)){
                      return <Button
                      // variant="contained"
                      className={
                        btndata.id === modalView
                        ?"btn-design-list m-5": "btn-design-list-hover m-5"
                      }
                      size="small"
                      key={idx}
                      onClick={(event) => setModalView(btndata.id)}
                    >
                      {btndata.text}
                    </Button>
                    }
                  })}
                  <div  className={classes.searchBox}>        
                    <InputBase
                  className={classes.input}
                  placeholder="Search"
                  inputProps={{ "aria-label": "search" }}
                  value={searchData}
                  onChange={(event) => setSearchData(event.target.value)}
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

              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ display: "flex",padding:"0px" ,marginTop:"16px" }}
              >
              
                <Grid
                  item
                  lg={3}
                  md={2}
                  sm={2}
                  xs={6}
                >
                  <p>End Date</p>
                  <TextField
                    // label="End Date"
                    name="endDate"
                    variant="outlined"
                    fullWidth
                    value={endDate}
                    error={endDateErr.length > 0 ? true : false}
                    helperText={endDateErr}
                    type="date"
                    // onKeyDown={(e => e.preventDefault())}
                    onChange={(e) => handleInputChange(e)}
                    // onChange={(e) => { setEndDate(e.target.value); setEndDateErr("") }}
                    inputProps={{
                      max: moment().format("YYYY-MM-DD"),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>

                <Grid style={{ paddingLeft: 8, marginTop: "2px", display: "flex",alignItems:"flex-end" }}>
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
                    className={clsx(classes.button1, "mr-8")}
                    size="small"
                    onClick={ResetData}
                    style={{ height: "35px", width: "45px" }}
                  >
                    Reset
                  </Button>
                </Grid>
                <Grid
                  item
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                >
                  <Button
                    style={{ padding: "0", height: "35px" ,marginTop:"20px"}}
                    className="csvbutton ml-0"
                    disabled={exportData.length === 0}
                  >
                    <CSVLink
                      // data={modalView === 1 ? cadList : completedCadList}
                      className="csvbuttontext"
                      data={exportData}
                      filename={modalView === 1 ? "master.csv" : "Completed_master_list.csv"}
                    >
                    Download
                    </CSVLink>
                  </Button>
                  {/* <Icon
                      style={{
                        color: "dodgerblue",
                        fontWeight: 500,
                        fontSize: "30px",
                      }}
                    >
                      get_app{" "}
                    </Icon> */}
                </Grid>
              </Grid>

              {/* <Grid
                  className="title-search-input"
                  item
                  xs={12}
                  sm={4}
                  md={6}
                  key="2"
                  style={{ textAlign: "right" }}
                >
                  { !Config.idDesigner() && modalView !== 4 && (
                    <Button
                      variant="contained"
                      className={classes.button2}
                      size="small"
                      onClick={() => setAddModal(modalView)}
                    >
                      {modalView === 1 && "Create New CAD"}
                      {modalView === 2 && "CAD Repairing"}
                      {modalView === 3 && "CAD Repairing Receive"}
                    </Button>
                  )}
                  <label style={{ display: "contents" }}> Search : </label>
                  <input
                    id="input-ml"
                    type="search"
                    className={classes.searchBox}
                    onChange={(event) => setSearchData(event.target.value)}
                  />
                </Grid>      
                <Grid item lg={1} md={1} sm={1} xs={3}  style={{ padding: "10px ",marginTop:"15px"}}>
                <TextField
                    className=""
                    type="date"
                    label="End Date"
                    name="endDate"
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    inputProps={{
                      min: moment().format("YYYY-MM-DD"),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  </Grid> 
                </Grid> */}
            </Grid>
            {loading && <Loader />}

            <div className="mt-16 design_list_tbl">
              <Paper
                className={clsx(
                  classes.tabroot,
                  "table-responsive design_list_blg view_design_list_blg"
                )}
              >
                {modalView === 6 ? (
                  <>
                    <MaUTable className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>
                            CAD Job Number
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            CAD Number
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Designer Name
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Weight
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Size
                          </TableCell>
                          {/* <TableCell className={classes.tableRowPad}>
                            Assign Date
                          </TableCell> */}
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
                        {cadList
                          // .filter(
                          //   (temp) =>
                          //     temp.final_cad_number.includes(searchData) ||
                          //     temp.cam_weight
                          //       .includes(searchData) ||
                          //     temp.name
                          //       .toLowerCase()
                          //       .includes(searchData.toLowerCase()) ||
                          //     temp.process
                          //       .includes(searchData) ||
                          //     temp.created_at
                          //       .includes(searchData) ||
                          //     temp.end_date
                          //       .includes(searchData) ||
                          //     temp.status
                          //       .toLowerCase()
                          //       .includes(searchData.toLowerCase())
                          // )
                          .map((row, index) => (
                            <TableRow key={index}>
                              <TableCell className={classes.tableRowPad}>
                                {row.jobNum}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.final_cad_number}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.name}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {parseFloat(row.cam_weight).toFixed(3)}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.size}
                              </TableCell>
                              {/* <TableCell className={classes.tableRowPad}>
                                {row.created_at}
                              </TableCell> */}
                              <TableCell className={classes.tableRowPad}>
                                {row.endDate}
                              </TableCell>
                              {!Config.idDesigner() && (
                                <TableCell className={(classes.tableRowPad,classes.Transfer)}>
                                  <Button
                                    className="w-155 popup-save"
                                    variant="contained"
                                    aria-label="Register"
                                    onClick={() => {
                                      setModalOpen(true);
                                      setcadJobId(row.id);
                                      setMainId(row.mainId);
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
                    <MaUTable className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>
                            CAD Number
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Voucher Number
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            CAD Job Number
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Worker Name
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Weight
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Size
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
                          {/* {!Config.idDesigner() && (
                            <TableCell className={classes.tableRowPad}>
                              Action
                            </TableCell>
                          )} */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {apiList
                          // .filter(
                          //   (temp) =>
                          //     temp.voucher_no
                          //       .toLowerCase()
                          //       .includes(searchData.toLowerCase()) ||
                          //     temp.cadJobNum
                          //       .toLowerCase()
                          //       .includes(searchData.toLowerCase()) ||
                          //     temp.designerName
                          //       .toLowerCase()
                          //       .includes(searchData.toLowerCase()) ||
                          //     temp.process
                          //       .toLowerCase()
                          //       .includes(searchData.toLowerCase()) ||
                          //     temp.assignDate
                          //       .toLowerCase()
                          //       .includes(searchData.toLowerCase()) ||
                          //     temp.endDate
                          //       .toLowerCase()
                          //       .includes(searchData.toLowerCase()) ||
                          //     temp.weight
                          //       .toLowerCase()
                          //       .includes(searchData.toLowerCase()) ||
                          //     temp.status
                          //       .toLowerCase()
                          //       .includes(searchData.toLowerCase())
                          // )
                          .map((row, index) => (
                            <TableRow
                                key={index}
                                style={{ backgroundColor: checkStatus(row) }}
                              >
                              <TableCell className={classes.tableRowPad}>
                                {row.cad_number}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.voucher_no}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.cadJobNum}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.designerName}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.weight}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.size}
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
                                {/* {row.status} */}
                                {row.endDate !== "" ? displayStatus(row) : ""}
                              </TableCell>
                              {/* {!Config.idDesigner() && (
                                <TableCell className={classes.tableRowPad}>
                                  <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    // editHandler(row.id,false);
                                  }}
                                >
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "dodgerblue" }}
                                  >
                                    edit
                                  </Icon>
                                </IconButton>
                                <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    // editHandler(row.id,true);
                                  }}
                                >
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "dodgerblue" }}
                                  >
                                    visibility
                                  </Icon>
                                </IconButton>
                                </TableCell>
                              )} */}
                            </TableRow>
                          ))}
                      </TableBody>
                    </MaUTable>
                  )
                )}
              </Paper>
            </div>
            </div>
            <Modal
              // disableBackdropClick
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={modalOpen}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleModalClose();
                }
              }}
              style={{ overflow: "scroll" }}
            >
              <div style={modalStyle} className={clsx(classes.paper,"rounded-8")}>
                <h5
                  className="popup-head p-20"
                >
                  {/* Edit Department */}
                  TRANSFER TO
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={handleModalClose}
                  >
                    <Icon style={{ color: "white" }}>
                      <img src={Icones.cross} alt="" />
                    </Icon>
                  </IconButton>
                </h5>
                <div className="p-5 pl-16 pr-16">
                  <label>Select process</label>
                  <Select
                    className="mt-1"
                    classes={classes}
                    filterOption={createFilter({ ignoreAccents: false })}
                    styles={selectStyles}
                    options={transferOpts
                      .filter((x) => x.label !== "Master Finish")
                      .map((suggestion) => ({
                        value: suggestion.value,
                        label: suggestion.label,
                      }))}
                    // components={components}
                    value={selectedTransferOpts}
                    onChange={handleTransOptChange}
                    placeholder="Select process"
                  />

                  <span style={{ color: "red" }}>
                    {transferOptsErrTxt.length > 0 ? transferOptsErrTxt : ""}
                  </span>

                  {/* <Button
                    variant="contained"
                    color="primary"
                    className="w-full mx-auto department-btn-dv"
                    style={{
                      backgroundColor: "#4caf50",
                      border: "none",
                      color: "white",
                    }}
                    onClick={(e) => transferProcess(e)}
                  >
                    Save
                  </Button> */}

                  <div className="popup-button-div">
                    <Button
                      variant="contained"
                      className="cancle-button-css"
                      onClick={handleModalClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      className="save-button-css"
                      onClick={(e) => transferProcess(e)}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default Master;

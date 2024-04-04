import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, InputBase, FormControlLabel, Radio, FormLabel, RadioGroup, FormControl } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import { TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Search from "../SearchHelper/SearchHelper";
import Select, { createFilter } from "react-select";
import Loader from "../../../Loader/Loader";
import LoaderPopup from "app/main/Loader/LoaderPopup";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";
import SearchIcon from "@material-ui/icons/Search";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    height: "80%",
  },
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    // minWidth:200,
    textOverflow: "ellipsis",

    // min-width: 200px;
    // text-overflow: ellipsis;
    // max-width: 250px;
    overflow: "hidden",
    padding: 7,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "340px",
    height: "37px",
    color: "#CCCCCC",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter"

  },
  search: {
    display: 'flex',
    border: "1px solid #cccccc",
    float: "right",
    height: "38px",
    width: "340px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: '2px 4px',
    alignItems: "center",
  },
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC"
  }
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

const Process = (props) => {
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
  const [apiData, setApiData] = useState([]); // display list
  const [searchData, setSearchData] = useState("");

  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);

  const [processNm, setProcessNm] = useState(""); //first textbox creating new department
  const [processNmErr, setProcessNmErr] = useState("");

  const [selectedMainDepart, setSelectedMainDepart] = useState(""); //selected main department
  const [mainDepartErrTxt, setMainDepartErrTxt] = useState("");

  const [aliasCode, setAliasCode] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [open, setOpen] = useState(false); //confirm delete Dialog
  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [loading, setLoading] = useState(false);
  const [normalLoading, setNormalLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [goldMetal, setGoldMetal] = useState(0)
  const [studding, setStudding] = useState(0)
  const [mIssue, setMIssue] = useState(0)

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    if (normalLoading) {
      setTimeout(() => setNormalLoading(false), 7000); // 10초 뒤에
    }
  }, [normalLoading]);

  useEffect(() => {
    getProcessData(); //main list
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting('Master', dispatch);
    //eslint-disable-next-line
  }, []);

  const classes = useStyles();

  function getProcessData() {
    setNormalLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/process")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
          setNormalLoading(false);
          // setData(response.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setNormalLoading(false);
        }
      })
      .catch((error) => {
        setNormalLoading(false);
        handleError(error, dispatch, {api : "api/process"})

      });
  }

  function editHandler(id) {
    setSelectedIdForEdit(id);
    setIsEdit(true);
    setModalOpen(true);

    const Index = apiData.findIndex((a) => a.id === id);
    if (Index > -1) {
      setProcessNm(apiData[Index].process_name.split(" -")[0]);
      setGoldMetal(parseInt(apiData[Index].is_gold_metal))
      setStudding(parseInt(apiData[Index].is_studding))
      setMIssue(parseInt(apiData[Index].is_multiple_issue))
       // setSelectedMainDepart({
      //   value: apiData[Index].Department.id,
      //   label: apiData[Index].Department.name,
      // });
    }
  }

  function handleInputChange(event) {

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "processNm") {
      setProcessNm(value);
      setProcessNmErr("");
    }else if (name === "aliasCode"){
      setAliasCode(value);
    }else if (name === "goldMetal"){
      setGoldMetal(parseInt(value));
    }else if (name === "studding"){
      setStudding(parseInt(value));
    }else if (name === "mIssue"){
      setMIssue(parseInt(value));
    }
  }

  function processNmValidation() {
    var Regex = /^[a-zA-Z0-9 ]+$/;
    if (!processNm || Regex.test(processNm) === false) {
      // setIsEdtStkGrpNmErr(true);
      setProcessNmErr("Please Enter Valid Process Name");
      return false;
    }
    return true;
  }


  const checkforUpdate = (evt) => {
    evt.preventDefault();
    // alert(`Submitting ${itemTypeName}`); && edtItemTypeValidation()
    if (processNmValidation()) {
      checkAndCallAPi();
    }
  };

  function checkAndCallAPi() {
    if (isEdit === true) {
      CallEditProcessApi();
    } else {
      CallAddProcessApi();
    }
  }

  function handleModalClose(callApi) {
    setModalOpen(false);
    setSelectedIdForEdit("");
    setIsEdit(false);
    setProcessNm(""); //first textbox creating new department
    setProcessNmErr("");
    setAliasCode("");
    setGoldMetal(0)
    setStudding(0)
    setMIssue(0)
    // setUnderDeptChecked(false);
    setSelectedMainDepart(""); //selected main department
    setMainDepartErrTxt("");
    // setAutoTransferChecked(false);
    // setSelectedAllDepart(""); //selected main department
    // setAllDepartErrTxt("");
    if (callApi === true) {
      getProcessData(); //main list
      //   getMainDepartments(); //main depart if under department is checked, for dropdown
      //   getAllDepartments(); //if auto transfer is checked, for dropdown
    }
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function callDeleteProcessApi() {
    axios
      .delete(Config.getCommonUrl() + "api/process/" + selectedIdForDelete)
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          getProcessData();
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setSelectedIdForDelete("");
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        setOpen(false);
        handleError(error, dispatch, {api : "api/process/" + selectedIdForDelete})
      });
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function CallAddProcessApi() {
    //add item type
    setLoading(true);
    const body = {
      process_name: processNm,
      // aliase_code : aliasCode,
      is_gold_metal : goldMetal,
      is_studding : studding,
      is_multiple_issue : mIssue,
      department_id : window.localStorage.getItem("SelectedDepartment")
    }


    axios
      .post(Config.getCommonUrl() + "api/process", body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          handleModalClose(true);
          setLoading(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {api : "api/process",body })
      });
  }

  function CallEditProcessApi() {
    setLoading(true);
    const body = {
      process_name: processNm,
      // aliase_code : aliasCode,
      is_gold_metal : goldMetal,
      is_studding : studding,
      is_multiple_issue : mIssue,
      department_id : window.localStorage.getItem("SelectedDepartment")
    }

    axios
      .put(Config.getCommonUrl() + "api/process/" + selectedIdForEdit, body)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          handleModalClose(true);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setLoading(false);
        } else {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {api : "api/process/" + selectedIdForEdit, body})

      });
  }

  function onSearchHandler(sData) {
    setSearchData(sData);
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
      <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={4} sm={4} md={4} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                <Typography className="pl-28 pt-16 text-18 font-700">
                    Process
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                key="2"
                style={{ textAlign: "right" }}
              >
                {/* <Link
                  to="/dashboard/masters/addemployee"
                  style={{ textDecoration: "none", color: "inherit" }}
                > */}
                <Button
                  className={classes.button}
                  size="small"
                  onClick={(event) => {
                    setModalOpen(true);
                    setIsEdit(false);
                  }}
                >
                  Add New
                </Button>
                {/* </Link> */}
              </Grid>
            </Grid>
            <div className="main-div-alll ">
            <div>
            <div style={{ borderRadius: "7px !important" }} component="form" className={classes.search}>
          <InputBase
            className={classes.input}
            placeholder="Search"
            inputProps={{ 'aria-label': 'search' }}
            value={searchData}
            onChange={(event) => setSearchData(event.target.value)}
          />
          <IconButton type="submit" className={classes.iconButton} aria-label="search">
            <SearchIcon />
          </IconButton>
        </div>
        </div>
            
            {normalLoading && <Loader />}
            <div className="mt-56">
            <Paper
              id="process-tbl-mt"
              className={clsx(classes.tabroot, " process_master_tabel_dv")}
            >
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      className={classes.tableRowPad}
                      style={{ maxWidth: 100 }}
                    >
                      ID
                    </TableCell>

                    <TableCell
                      className={classes.tableRowPad}
                      style={{ maxWidth: 300 }}
                      align="left"
                    >
                      Process Name
                    </TableCell>

                    <TableCell
                      className={classes.tableRowPad}
                      style={{ maxWidth: 300 }}
                      align="left"
                    >
                      Is Gold Metal
                    </TableCell>

                    <TableCell
                      className={classes.tableRowPad}
                      style={{ maxWidth: 300 }}
                      align="left"
                    >
                      Is Studding
                    </TableCell>

                    <TableCell
                      className={classes.tableRowPad}
                      style={{ maxWidth: 300 }}
                      align="left"
                    >
                      Is Multiple Issue
                    </TableCell>

                    <TableCell
                      className={classes.tableRowPad}
                      style={{ maxWidth: 200 }}
                      align="left"
                    >
                      Action
                    </TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiData
                    .filter(
                      (temp) =>
                        temp.process_name
                          .toLowerCase()
                          .includes(searchData.toLowerCase()) ||
                        temp.Department?.name
                          .toLowerCase()
                          .includes(searchData.toLowerCase())
                    )
                    .map((row) => (
                      <TableRow key={row.id}>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ maxWidth: 100 }}
                        >
                          {row.id}
                        </TableCell>

                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ maxWidth: 300 }}
                        >
                          {row.process_name}
                        </TableCell>

                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ maxWidth: 300 }}
                        >
                          {row.is_gold_metal === 0 ? "No" : "Yes"}
                        </TableCell>

                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ maxWidth: 300 }}
                        >
                          {row.is_studding === 0 ? "No" : "Yes"}
                        </TableCell>

                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ maxWidth: 300 }}
                        >
                          {row.is_multiple_issue === 0 ? "No" : "Yes"}
                        </TableCell>

                        <TableCell
                          className={classes.tableRowPad}
                          style={{ maxWidth: 200 }}
                        >
                          <IconButton
                            style={{ padding: "0" }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              ev.stopPropagation();
                              editHandler(row.id);
                            }}
                          >
                        <Icon className="mr-8 edit-icone">
                                  <img src={Icones.edit} alt="" />
                                </Icon>
                          </IconButton>

                          <IconButton
                            style={{ padding: "0" }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              ev.stopPropagation();
                              deleteHandler(row.id);
                            }}
                          >
                          <Icon className="mr-8 delete-icone">
                                  <img src={Icones.delete_red} alt="" />
                                </Icon>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Paper>
</div>
</div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" className="popup-delete">{"Alert!!!"}
              <IconButton
                    style={{ position: "absolute", marginTop:"-5px", right: "15px"}}
                    onClick={handleClose}
                  >
                    <img src={Icones.cross} className="delete-dialog-box-image-size" alt="" />
                  </IconButton>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this record?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} className="delete-dialog-box-cancle-button">
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteProcessApi}
                  className="delete-dialog-box-delete-button"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

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
            >
              <div style={modalStyle} className={clsx(classes.paper,"rounded-8")}>
                <h5 className="popup-head p-20">
                  {isEdit === false ? "Add New Process" : "Edit Process"}
                  <IconButton
                    style={{ position: "absolute", top:5, right:8}}
                    onClick={handleModalClose}
                  ><Icon>
                      <img src={Icones.cross} alt="" />
                    </Icon></IconButton>
                </h5>
                <div className="p-40 pb-32">

                  <span style={{ color: "red" }}>
                    {mainDepartErrTxt.length > 0 ? mainDepartErrTxt : ""}
                  </span>

                  <p className="popup-labl pl-1 pb-1">Process name</p>
                  <TextField
                    placeholder="Enter process name"
                    name="processNm"
                    value={processNm}
                    error={processNmErr.length > 0 ? true : false}
                    helperText={processNmErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                  />

      
                  <FormControl
                    component="fieldset"
                    className="mt-16 pl-5"
                  >
                    <FormLabel  component="legend">Gold Metal :</FormLabel>
                    <RadioGroup
                      aria-label="Gold Metal"
                      name="goldMetal"
                      className={classes.group}
                      value={goldMetal}
                      onChange={handleInputChange}
                    >
                      <Grid item xs={12} >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value={0}
                          control={<Radio />}
                          label="No"
                        />
                      </Grid>
                    </RadioGroup>
                  </FormControl>

                  <FormControl
                    component="fieldset"
                    className="mt-16 pl-32"
                  >
                    <FormLabel  component="legend">Studding :</FormLabel>
                    <RadioGroup
                      aria-label="Studding"
                      name="studding"
                      className={classes.group}
                      value={studding}
                      onChange={handleInputChange}
                    >
                      <Grid item xs={12} >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value={0}
                          control={<Radio />}
                          label="No"
                        />
                      </Grid>
                    </RadioGroup>
                  </FormControl>


                  <FormControl
                    component="fieldset"
                    className="mt-16 pl-5"
                  >
                    <FormLabel  component="legend">Multiple Issue :</FormLabel>
                    <RadioGroup
                      aria-label="Multiple Issue"
                      name="mIssue"
                      className={classes.group}
                      value={mIssue}
                      onChange={handleInputChange}
                    >
                      <Grid item xs={12} >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value={0}
                          control={<Radio />}
                          label="No"
                        />
                      </Grid>
                    </RadioGroup>
                  </FormControl>


                  <div className="popup-button-div">
                      <Button
                        style={{width:"100%"}}
                        variant="contained"
                        className="save-button-css"
                        onClick={(e) => checkforUpdate(e)}
                      >
                        Save
                      </Button>
                      </div>

                  {/* <Button
                    variant="contained"
                    color="primary"
                    className="w-full mx-auto mt-16"
                    style={{
                      backgroundColor: "#4caf50",
                      border: "none",
                      color: "white",
                    }}
                    onClick={(e) => checkforUpdate(e)}
                  >
                    Save
                  </Button> */}
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default Process;

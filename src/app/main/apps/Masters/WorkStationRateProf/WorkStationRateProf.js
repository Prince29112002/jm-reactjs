import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, InputBase } from "@material-ui/core";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
// import BreadcrumbsHelper from "../../../BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
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
import Grid from "@material-ui/core/Grid";
import Search from "../SearchHelper/SearchHelper";
import Modal from "@material-ui/core/Modal";
import { TextField } from "@material-ui/core";
import Loader from "../../../Loader/Loader";
import LoaderPopup from "../../../Loader/LoaderPopup";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import sampleFile from "app/main/SampleFiles/RateProfiles/Jobworker_vendor_rate_profile.csv";

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
  //   button: {
  //     margin: 5,
  //     textTransform: "none",
  //     backgroundColor: "cornflowerblue",
  //     color: "white",
  //   },
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
    // minWidth: 200,
    textOverflow: "ellipsis",
    // maxWidth: 250,
    // min-width: 200px;
    // text-overflow: ellipsis;
    // max-width: 250px;
    overflow: "hidden",
    padding: 7,
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
    float: "right",
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
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
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

const WorkStationRateProf = (props) => {
  const [apiData, setApiData] = useState([]); // display list
  const [searchData, setSearchData] = useState("");

  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  const [open, setOpen] = useState(false); //confirm delete Dialog

  const [rateProfNm, setRateProfNm] = useState("");
  const [rateProfNmErr, setRateProfNmErr] = useState("");
  const [modalStyle] = useState(getModalStyle);

  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [loading, setLoading] = useState(false);

  const [normalLoading, setNormalLoading] = useState(true);

  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    // if (isVoucherSelected) {
    if (rateProfValidation()) {
      hiddenFileInput.current.click();
    }

    // } else {
    // setSelectVoucherErr("Please Select Voucher");
    // }
  };

  useEffect(() => {
    NavbarSetting("Master", dispatch);
  }, []);

  useEffect(() => {
    // visible true -> false
    if (normalLoading) {
      //setTimeout(() => setLoaded(true), 250); // 0.25초 뒤에 해제
      //debugger;
      setTimeout(() => setNormalLoading(false), 7000); // 10초 뒤에
    }

    //setLoaded(loaded);
  }, [normalLoading]);

  useEffect(() => {
    // visible true -> false
    if (loading) {
      //setTimeout(() => setLoaded(true), 250); // 0.25초 뒤에 해제
      //debugger;
      setTimeout(() => setLoading(false), 50000); // 10초 뒤에
    }

    //setLoaded(loaded);
  }, [loading]);

  const handlefilechange = (event) => {
    handleFile(event);
    console.log("handlefilechange");
  };

  useEffect(() => {
    console.log("useEffect");

    getJwAndVendRateProfile();

    //eslint-disable-next-line
  }, [dispatch]);

  const classes = useStyles();

  function getJwAndVendRateProfile() {
    setNormalLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/workStationRateProfile")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
          // setData(response.data);
          setNormalLoading(false);
        } else {
          setApiData([]);

          dispatch(Actions.showMessage({ message: response.data.message }));
          setNormalLoading(false);
        }
      })
      .catch((error) => {
        setNormalLoading(false);
        handleError(error, dispatch, { api: "api/workStationRateProfile" });
      });
  }

  function editHandler(id) {
    console.log("editHandler", id);
    setSelectedIdForEdit(id);
    setIsEdit(true);
    setModalOpen(true);

    const Index = apiData.findIndex((a) => a.id === id);
    console.log(Index);
    if (Index > -1) {
      console.log(apiData[Index]);
      setRateProfNm(apiData[Index].profile_name);
    }
  }

  function deleteHandler(id) {
    console.log("deleteHandler", id);
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function viewHandler(id) {
    console.log("viewHandler", id);
    props.history.push(
      "/dashboard/masters/workstationrateprof/viewworkstationrateprofile",
      { id: id }
    );
  }

  function callDeleteRateProfileApi() {
    axios
      .delete(
        Config.getCommonUrl() +
          "api/workStationRateProfile/delete/" +
          selectedIdForDelete
      )
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          getJwAndVendRateProfile();
          setSelectedIdForDelete("");
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setOpen(false);
        handleError(error, dispatch, {
          api: "api/jobworkerRateProfile/" + selectedIdForDelete,
        });
      });
  }

  function handleClose() {
    console.log("handleClose");
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function onSearchHandler(sData) {
    // console.log("Search on", sData);
    setSearchData(sData);
  }

  function handleModalClose(callApi) {
    // console.log("handle close", callApi);
    setModalOpen(false);
    setSelectedIdForEdit("");
    setIsEdit(false);
    setRateProfNm("");
    setRateProfNmErr("");

    if (callApi === true) {
      getJwAndVendRateProfile(); //main list
    }
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "rateProfNm") {
      setRateProfNm(value);
      setRateProfNmErr("");
    }
  }

  function rateProfValidation() {
    // var Regex = /^[a-zA-Z0-9 ]+$/;
    if (rateProfNm === "") {
      // setIsEdtStkGrpNmErr(true);
      setRateProfNmErr("Please Enter rate profile name");

      return false;
    }
    return true;
  }

  function handleFile(e) {
    e.preventDefault();
    console.log("handleFile");
    var files = e.target.files,
      f = files[0];
    uploadfileapicall(f);
  }

  function uploadfileapicall(f) {
    const formData = new FormData();
    formData.append("file", f);
    formData.append("profile_name", rateProfNm);
    if (isEdit === true) {
      formData.append("id", selectedIdForEdit);
    }
    setLoading(true);

    axios
      .post(
        Config.getCommonUrl() + "api/workStationRateProfile/upload",
        formData
      )
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // console.log(response);

          // let OrdersData = response.data.data;
          setLoading(false);

          if (response.data.hasOwnProperty("url")) {
            // console.log("found url", response.data.url);
            let downloadUrl = response.data.url;
            // window.open(downloadUrl);
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.click();
          }
          dispatch(Actions.showMessage({ message: response.data.message }));
          handleModalClose(true);
        } else {
          setLoading(false);

          dispatch(Actions.showMessage({ message: response.data.message }));
          document.getElementById("fileinput").value = "";
        }
      })
      .catch((error) => {
        setLoading(false);
        // console.log(error);
        document.getElementById("fileinput").value = "";
        handleError(error, dispatch, {
          api: "api/workStationRateProfile/upload",
          body: JSON.stringify(formData),
        });
      });
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
                    Work Station Rate Profile
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
                {/* <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={(event) => {
                    setModalOpen(true);
                    setIsEdit(false);
                  }}
                >
                  Add New
                </Button> */}
                <Button
                  variant="contained"
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
                <div
                  style={{ borderRadius: "7px !important" }}
                  component="form"
                  className={classes.search}
                >
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
              </div>

              <div className="mt-56 department-tbl-mt-dv">
                <Paper
                  className={clsx(classes.tabroot)}
                  id="btoclient_tabel_dv"
                  style={{ height: "calc(100vh - 280px)" }}
                >
                  {/* <div className="table-responsive btoclients-tabel-dv  btwo_stock_group_tbel"> */}
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ maxWidth: 100 }}
                        >
                          ID
                        </TableCell>

                        <TableCell className={classes.tableRowPad} align="left">
                          Rate Profile
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad} align="left">
                        Category Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Wastage
                      </TableCell> */}

                        <TableCell className={classes.tableRowPad} align="left">
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiData
                        .filter(
                          (temp) =>
                            temp?.profile_name
                              .toLowerCase()
                              .includes(searchData.toLowerCase())
                          // temp.process_category.category_name
                          //   .toLowerCase()
                          //   .includes(searchData.toLowerCase())
                        )
                        .map((row, i) => (
                          <TableRow key={row.id}>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ maxWidth: 100 }}
                            >
                              {i + 1}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                              style={{ maxWidth: 300 }}
                            >
                              {row.profile_name}
                            </TableCell>
                            {/* <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ maxWidth: 300 }}
                        >
                          {row.Department !== null ? row.Department.name : "-"}
                          {row.process_category.category_name}
                        </TableCell> */}
                            <TableCell className={classes.tableRowPad}>
                              <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  //   // ev.preventDefault();
                                  //   // ev.stopPropagation();
                                  editHandler(row.id);
                                }}
                              >
                                <Icon
                                  className="mr-8"
                                  style={{ color: "dodgerblue" }}
                                >
                                  create
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
                                <Icon className="mr-8" style={{ color: "red" }}>
                                  delete
                                </Icon>
                              </IconButton>

                              <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  viewHandler(row.id);
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
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  {/* </div> */}
                </Paper>
              </div>

              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Alert!!!"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this record ?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button
                    onClick={callDeleteRateProfileApi}
                    color="primary"
                    autoFocus
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
                style={{ overflow: "scroll" }}
              >
                <div style={modalStyle} className={classes.paper}>
                  {loading && <LoaderPopup />}
                  <h5
                    className="p-5"
                    style={{
                      textAlign: "center",
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    {isEdit === false
                      ? "Add Work Station Rate Profile"
                      : "Edit Work Station Rate Profile"}
                    <IconButton
                      style={{ position: "absolute", top: "0", right: "0" }}
                      onClick={handleModalClose}
                    >
                      <Icon style={{ color: "white" }}>close</Icon>
                    </IconButton>
                  </h5>
                  <div className="p-5 pl-16 pr-16">
                    <label>Rate Profile Name</label>
                    <TextField
                      name="rateProfNm"
                      className=""
                      placeholder="Enter Rate Profile Name"
                      value={rateProfNm}
                      error={rateProfNmErr.length > 0 ? true : false}
                      helperText={rateProfNmErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      autoFocus
                      fullWidth
                    />

                    <a
                      href={sampleFile}
                      download="workstation_rate_profile.csv"
                    >
                      Download Sample{" "}
                    </a>
                    <Button
                      variant="contained"
                      color="primary"
                      className="w-full mx-auto mt-16"
                      style={{
                        backgroundColor: "#4caf50",
                        border: "none",
                        color: "white",
                      }}
                      onClick={handleClick}
                    >
                      Upload a file
                    </Button>

                    <input
                      type="file"
                      id="fileinput"
                      // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      accept=".csv"
                      ref={hiddenFileInput}
                      onChange={handlefilechange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default WorkStationRateProf;

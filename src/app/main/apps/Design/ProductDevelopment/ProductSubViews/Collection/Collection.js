import React, { useState, useEffect } from "react";
import {  Icon, IconButton, InputBase } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as authActions from "app/auth/store/actions";
import * as Actions from "app/store/actions";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import moment from "moment";
import History from "@history";
import Loader from "../../../../../Loader/Loader";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import sampleFile from "app/main/SampleFiles/DesignModule/addCollection.csv";
import Icones from "assets/fornt-icons/Mainicons";
import SearchIcon from "@material-ui/icons/Search";

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
    margin: 5,
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
  // searchBox: {
  //   padding: 6,
  //   fontSize: "12pt",
  //   borderColor: "darkgray",
  //   borderWidth: 1,
  //   borderRadius: 5,
  // },
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
  Transfer: {
    paddingRight: " 0px !important",
  },
}));

const Collection = ({ props }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [modalView, setModalView] = useState(2);
  const [collectionCSV, setCollectionCSV] = useState("");
  const [addModal, setAddModal] = useState("");

  const [collectionList, setCollectionList] = useState([]);
  const [designJobList, setDesignJobList] = useState([]);
  const [completedJobList, setCompletedJobList] = useState([]);

  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");

  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [loading, setLoading] = useState(false);
  const hiddenFileInput = React.useRef(null);
  const [transfer, setTransfer] = useState(false);
  const [transferId, setTransferId] = useState("");

  const [searchData, setSearchData] = useState("");
  const loginId = localStorage.getItem("userId");
  const [authAccessArr, setAuthAccessArr] = useState([]);
  const roleOfUser = localStorage.getItem("permission")
    ? JSON.parse(localStorage.getItem("permission"))
    : [];

  useEffect(() => {
    const arr = roleOfUser["Product Development"]?.["Design Job"];
    const arrData = [];
    if (arr.length > 0) {
      arr.map((item) => {
        arrData.push(item.name);
      });
    }
    setAuthAccessArr(arrData);
  }, []);

  useEffect(() => {
    if (modalView === 1) {
      getCollectionList();
    } else if (modalView === 2) {
      getDesignJobList();
    } else if (modalView === 3) {
      getCompletedJobList();
    }
  }, [modalView]);

  // useEffect(() => {
  //   if (props.location.state) {
  //     if (props.location.state.tab === 1) {
  //       setModalView(1)
  //     }
  //   } else {
  //     setModalView(2)
  //   }
  // }, [])

  useEffect(() => {
    if (addModal && addModal === 1) {
      History.push(`/dashboard/design/createcollection`, {
        id: editId,
        edit: edit,
      });
    } else if (addModal && addModal === 2) {
      History.push(`/dashboard/design/createdesignjob`);
    } else {
      History.push(`/dashboard/design`, { view: 1, sub: 1, tab: 1 });
    }
  }, [addModal]);

  function getCollectionList() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/designcollection")
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setCollectionList(res.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: "api/designcollection" });
      });
  }

  function getDesignJobList() {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() + `api/designjob?is_close=0&user_id=${loginId}`
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setDesignJobList(res.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/designjob?is_close=0&user_id=${loginId}`,
        });
      });
  }

  function getCompletedJobList() {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() + `api/designjob?is_close=1&user_id=${loginId}`
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setCompletedJobList(res.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/designjob?is_close=1&user_id=${loginId}`,
        });
      });
  }
  const handlefilechange = (e) => {
    // setIsCsvErr(false);
    e.preventDefault();
    setCollectionCSV(e.target.files[0]);
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  function uploadCollectionCsv() {
    const formData = new FormData();
    formData.append("csvfiles", collectionCSV);
    axios
      .post(
        Config.getCommonUrl() + `api/designcollection/design-collection/upload`,
        formData
      )
      .then((response) => {
        if (response.data.success) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          getCollectionList();
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error"
            })
          );
          let downloadUrl = response.data.url;
          window.open(downloadUrl);
          document.getElementById("fileinput").value = "";
        }
        setCollectionCSV("");
      })
      .catch((error) => {
        document.getElementById("fileinput").value = "";
        handleError(error, dispatch, {
          api: `api/designcollection/design-collection/upload`,
          body: JSON.stringify(formData),
        });
      });
  }
  useEffect(() => {
    if (collectionCSV !== "" && collectionCSV !== null) {
      uploadCollectionCsv();
    }
  }, [collectionCSV]);
  const ButtonArr = [
    { id: 1, text: "Create New Collection" },
    { id: 3, text: "Completed Job" },
  ];

  const handleClose = () => {
    setAddModal("");
    setEdit(false);
    setEditId("");
  };

  const handleModalSave = () => {
    if (modalView === 1) {
      getCollectionList();
    } else {
      getDesignJobList();
    }
    setAddModal("");
    setEdit(false);
    setEditId("");
  };

  const deleteHandler = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  function handleCloseDelete() {
    setDeleteId("");
    setOpen(false);
  }

  function handleCloseTransfer() {
    setTransferId("");
    setTransfer(false);
  }

  function callDeleteApi() {
    if (modalView === 1) {
      var api = `api/designcollection/${deleteId}`;
    } else {
      var api = `api/designjob/${deleteId}`;
    }
    axios
      .delete(Config.getCommonUrl() + api)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          if (modalView === 1) {
            getCollectionList();
          } else {
            getDesignJobList();
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        setOpen(false);
      })
      .catch((error) => {
        setOpen(false);
        handleError(error, dispatch, { api: api });
      });
  }

  function callTransferApi() {
    axios
      .put(
        Config.getCommonUrl() + `api/designjobreceive/transfer/${transferId}`
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
          getCompletedJobList();
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        setTransfer(false);
      })
      .catch((error) => {
        setTransfer(false);
        handleError(error, dispatch, {
          api: `api/designjobreceive/transfer/${transferId}`,
        });
      });
  }

  const handleJobEdit = (id) => {
    History.push("/dashboard/design/editcollection", {
      id: id,
      isViewOnly: false,
    });
  };
  const viewHandler = (id) => {
    History.push("/dashboard/design/editcollection", {
      id: id,
      isViewOnly: true,
    });
  };

  const checkStatus = (rowData) => {
    const endDate = moment(rowData.end_date).format("YYYY-MM-DD");
    // const assDate = moment(rowData.created_at).format("DD-MM-YYYY");
    const today = moment().format("YYYY-MM-DD");
    if (today > endDate && rowData.receive_images === 0) {
      return "#FFDBDB";
    } else if (today > endDate && rowData.receive_images !== 0) {
      return "#FFDBDB";
    } else if (endDate >= today && rowData.receive_images === 0) {
      // return "FEB560"
    } else if (endDate >= today && rowData.receive_images !== 0) {
      // return "FEB560"
    } else {
      return null;
    }
  };
  const displayStatus = (rowData) => {
    // const assDate = moment(rowData.created_at).format("YYYY-MM-DD");
    const endDate = moment(rowData.end_date).format("YYYY-MM-DD");
    const today = moment().format("YYYY-MM-DD");
    // const nextThreeDays = moment(assDate, "DD-MM-YYYY").add(3, 'days').format("DD-MM-YYYY");
    if (today > endDate && rowData.receive_images === 0) {
      return <span style={{ color: "#FF4C4C" }}>Delay</span>;
    } else if (today > endDate && rowData.receive_images !== 0) {
      return <span style={{ color: "#FF4C4C" }}>Delay</span>;
    } else if (endDate >= today && rowData.receive_images === 0) {
      return <span style={{ color: "#FEB560" }}>Pending</span>;
    } else if (endDate >= today && rowData.receive_images !== 0) {
      return <span style={{ color: "#6898FE" }}>In Process</span>;
    } else {
      return null;
    }
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            <div className="main-div-alll">
              <Grid
                className="w-full create-account-main-dv"
                container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0 }}
              >
                <Grid item xs={12} sm={4} md={5} key="1" style={{ padding: 0 }}>
                  <Button
                    // variant="contained"
                    className={
                      modalView === 2
                        ? "btn-design-list m-5"
                        : "btn-design-list-hover m-5"
                    }
                    size="small"
                    key={2}
                    onClick={(event) => setModalView(2)}
                  >
                    Design Job List
                  </Button>
                  {ButtonArr.map((btndata, idx) => {
                    if (authAccessArr.includes(btndata.text)) {
                      return (
                        <Button
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
                </Grid>
                <Grid
                  className="title-search-input"
                  item
                  xs={12}
                  sm={4}
                  md={7}
                  key="2"
                  style={{ textAlign: "right", padding: "0px" }}
                >
                  {modalView === 2 &&
                    authAccessArr.includes("Create New Job") && (
                      <Button
                        variant="contained"
                        // className={classes.button2}
                        className="w-155 popup-save"
                        size="small"
                        onClick={() => setAddModal(modalView)}
                      >
                        Create New Job
                      </Button>
                    )}
                  {modalView === 1 &&
                    authAccessArr.includes("Add Collection") && (
                      <>
                        <Button
                          variant="contained"
                          // className={classes.button2}
                          className="w-155 popup-save"
                          size="small"
                          onClick={() => setAddModal(modalView)}
                        >
                          Create Collection
                        </Button>
                        <Button
                          variant="contained"
                          //  className={classes.button2}
                          className="w-155 popup-save ml-5 mr-5"
                          size="small"
                        //  onClick={handleClick}
                        >
                          <label>
                            Upload file
                            <input
                              type="file"
                              id="fileinput"
                              // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                              // accept=".csv, .xlsx"
                              accept=".csv"
                              // ref={hiddenFileInput}
                              onChange={handlefilechange}
                              style={{ display: "none" }}
                            />{" "}
                          </label>
                        </Button>
                        <a href={sampleFile} download="add_collection.csv">
                          Download Sample{" "}
                        </a>
                      </>
                    )}
                  {/* <label style={{ display: "contents" }}> Search : </label>
                <input
                  id="input-ml"
                  type="search"
                  className={classes.searchBox}
                  onChange={(event) => setSearchData(event.target.value)}
                /> */}
                  <div className={clsx(classes.search, "ml-10")}>
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
              </Grid>
              {loading && <Loader />}
              {/* {addModal === 1 && <CreateNewCollection modalColsed={handleClose} edit={edit} id={editId} modalSave={handleModalSave}/>}
            {addModal === 2 && <CreateNewDesinJob modalColsed={handleClose} modalSave={handleModalSave}/>} */}
              <div className="mt-16 design_list_tbl">
                <Paper
                  className={clsx(
                    classes.tabroot,
                    "table-responsive design_list_blg view_design_list_blg"
                  )}
                >
                  {modalView === 1 && (
                    <>
                      <MaUTable className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              Category
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Collection Name
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Design Description
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Created Date
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {collectionList
                            .filter(
                              (temp) =>
                                temp.ProductCategoryName?.category_name
                                  ?.toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                temp.name
                                  ?.toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                temp.description
                                  ?.toLowerCase()
                                  .includes(searchData.toLowerCase())
                            )
                            .map((row, i) => (
                              <TableRow key={i}>
                                <TableCell className={classes.tableRowPad}>
                                  {row.ProductCategoryName.category_name}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.name}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.description}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {authAccessArr.includes(
                                    "Edit Collection"
                                  ) && (
                                      <IconButton
                                        style={{ padding: "0" }}
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          ev.stopPropagation();
                                          setEdit(true);
                                          setAddModal(modalView);
                                          setEditId(row.id);
                                        }}
                                      >
                                        <Icon className="mr-8 edit-icone">
                                          <img src={Icones.edit} alt="" />
                                        </Icon>
                                      </IconButton>
                                    )}
                                  {authAccessArr.includes(
                                    "Delete Collection"
                                  ) && (
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
                                    )}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </MaUTable>
                    </>
                  )}
                  {modalView === 2 && (
                    <>
                      <MaUTable className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              Category
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Collection Name
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Design Job Number
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              No of Design
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              No Of Design Receive
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Design Description
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Assign Date
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              End Date
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Designer Location
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
                          {designJobList
                            .filter(
                              (temp) =>
                                temp.DesignCollectionName.ProductCategoryName.category_name
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                temp.DesignCollectionName.name
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                temp.JobNumber.number
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                temp.no_of_design
                                  .toString()
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                temp.receive_images
                                  .toString()
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                temp.description
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                moment
                                  .utc(temp.created_at)
                                  .local()
                                  .format("DD-MM-YYYY")
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                moment
                                  .utc(temp.end_date)
                                  .local()
                                  .format("DD-MM-YYYY")
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                temp.Location?.location
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase())
                            )
                            .map((row, i) => (
                              <TableRow
                                key={i}
                                style={{
                                  backgroundColor: checkStatus(row),
                                  paddingRight: "0px important",
                                }}
                              >
                                <TableCell className={classes.tableRowPad}>
                                  {row.DesignCollectionName
                                    ? row.DesignCollectionName
                                      .ProductCategoryName.category_name
                                    : ""}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.DesignCollectionName
                                    ? row.DesignCollectionName.name
                                    : ""}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.JobNumber ? row.JobNumber.number : ""}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.no_of_design}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.receive_images}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  <p
                                    style={{
                                      maxWidth: "185px",
                                      overflow: "hidden",
                                      whiteSpace: "nowrap",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {row.description}
                                  </p>
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {moment
                                    .utc(row.created_at)
                                    .local()
                                    .format("DD-MM-YYYY")}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {moment
                                    .utc(row.end_date)
                                    .local()
                                    .format("DD-MM-YYYY")}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.Location !== null
                                    ? row.Location.location
                                    : ""}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {displayStatus(row)}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {authAccessArr.includes(
                                    "View Design Job"
                                  ) && (
                                      <IconButton
                                        style={{ padding: "0" }}
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          ev.stopPropagation();
                                          // handleJobEdit(row.id);
                                          viewHandler(row.id);
                                        }}
                                        disabled={
                                          row.close_job === 1 ? true : false
                                        }
                                      >
                                        {/* <Icon
                                    className="mr-8"
                                    style={
                                      row.close_job === 1
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
                                  {authAccessArr.includes(
                                    "Edit Design job"
                                  ) && (
                                      <IconButton
                                        style={{ padding: "0" }}
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          ev.stopPropagation();
                                          handleJobEdit(row.id);
                                        }}
                                        disabled={
                                          row.close_job === 1 ? true : false
                                        }
                                      >
                                        {/* <Icon
                                className="mr-8"
                                style={
                                  row.close_job === 1
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
                                  {authAccessArr.includes(
                                    "Delete Design Job"
                                  ) && (
                                      <IconButton
                                        style={{ padding: "0" }}
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          ev.stopPropagation();
                                          deleteHandler(row.id);
                                        }}
                                        disabled={
                                          row.close_job === 1 ? true : false
                                        }
                                      >
                                        {/* <Icon
                                className="mr-8"
                                style={
                                  row.close_job === 1
                                    ? { color: "gray" }
                                    : { color: "red" }
                                }
                              >
                                delete
                              </Icon> */}
                                        <Icon className="mr-8 delete-icone">
                                          <img src={Icones.delete_red} alt="" />
                                        </Icon>
                                      </IconButton>
                                    )}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </MaUTable>
                    </>
                  )}
                  {modalView === 3 && (
                    <>
                      <MaUTable className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              Category
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Collection Name
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Design Job Number
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              No of Design
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              No Of Design Receive
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Completed Date
                            </TableCell>
                            {!Config.idDesigner() && (
                              <TableCell className={classes.tableRowPad}>
                                Transfer
                              </TableCell>
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {completedJobList
                            .filter(
                              (temp) =>
                                temp.DesignCollectionName.ProductCategoryName.category_name
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                temp.DesignCollectionName.name
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                temp.JobNumber.number
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                temp.no_of_design
                                  .toString()
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                temp.receive_images
                                  .toString()
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                temp.description
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                moment
                                  .utc(temp.created_at)
                                  .local()
                                  .format("DD-MM-YYYY")
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                moment
                                  .utc(temp.end_date)
                                  .local()
                                  .format("DD-MM-YYYY")
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase())
                            )
                            .map((row, i) => (
                              <TableRow key={i}>
                                <TableCell className={classes.tableRowPad}>
                                  {row.DesignCollectionName
                                    ? row.DesignCollectionName
                                      .ProductCategoryName.category_name
                                    : ""}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.DesignCollectionName
                                    ? row.DesignCollectionName.name
                                    : ""}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.JobNumber ? row.JobNumber.number : ""}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.no_of_design}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.receive_images}
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  style={{ paddingRight: "28px" }}
                                >
                                  {moment
                                    .utc(row.updated_at)
                                    .local()
                                    .format("DD-MM-YYYY")}
                                </TableCell>
                                {!Config.idDesigner() && (
                                  <TableCell
                                    className={clsx(
                                      classes.tableRowPad,
                                      classes.Transfer
                                    )}
                                  >
                                    <Button
                                      variant="contained"
                                      className="w-155 popup-save"
                                      aria-label="Register"
                                      onClick={(e) => {
                                        setTransfer(true);
                                        setTransferId(row.id);
                                      }}
                                    >
                                      Transfer for CAD
                                    </Button>
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                        </TableBody>
                      </MaUTable>
                    </>
                  )}
                </Paper>
              </div>
            </div>
            <Dialog
              open={open}
              onClose={handleCloseDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" className="popup-delete">
                {"Alert!!!"}
                <IconButton
                  style={{
                    position: "absolute",
                    marginTop: "-5px",
                    right: "15px",
                  }}
                  onClick={handleCloseDelete}
                >
                  <img
                    src={Icones.cross}
                    className="delete-dialog-box-image-size"
                    alt=""
                  />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this record?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseDelete}
                  className="cancle-button-css"
                >
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteApi}
                  autoFocus
                  className="delete-dialog-box-delete-button"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={transfer}
              onClose={handleCloseTransfer}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" className="popup-delete">
                {"Alert!!!"}{" "}
                <IconButton
                  style={{
                    position: "absolute",
                    marginTop: "-5px",
                    right: "15px",
                  }}
                  onClick={handleCloseTransfer}
                >
                  <img
                    src={Icones.cross}
                    className="delete-dialog-box-image-size"
                    alt=""
                  />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to transfer for cad?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseTransfer}
                  className="cancle-button-css"
                >
                  Cancel
                </Button>
                <Button
                  onClick={callTransferApi}
                  autoFocus
                  className="save-button-css"
                >
                  Transfer
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default Collection;

import React, { useState, useEffect } from "react";
import { TextareaAutosize, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Icon, IconButton } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Loader from "../../../Loader/Loader";
import Modal from "@material-ui/core/Modal";
import { TextField } from "@material-ui/core";
import LoaderPopup from "../../../Loader/LoaderPopup";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
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
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    // height: "100%",
    height: "100%",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  wrapText: {
    whiteSpace: "nowrap",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  Modalwidth: {
    width: "30%",
  },
  description: {
    height: "100px",
    overflow: "scroll",
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

const CMS = (props) => {
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [apiData, setApiData] = useState([]);
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [popupLoading, setPopupLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [modalStyle] = useState(getModalStyle);

  const [isViewOnly, setIsViewOnly] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");

  const [cmsName, setCmsName] = useState("");
  const [cmsNmErr, setCmsNmErr] = useState("");

  const [title, setTitle] = useState("");
  const [titleErr, setTitleErr] = useState("");

  const [description, setDescription] = useState("");
  const [descErr, setDescErr] = useState("");

  const [keyData, setKeyData] = useState("");
  const [keyErr, setKeyErr] = useState("");

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  function editHandler(row) {
    setIsViewOnly(false);
    setSelectedIdForEdit(row.id);
    setIsEdit(true);
    setModalOpen(true);

    setKeyData(row.key);
    setKeyErr("");
    setTitle(row.title);
    setTitleErr("");
    setCmsName(row.name);
    setCmsNmErr("");
    setDescription(row.description);
    setDescErr("");
  }

  function viewHandler(row) {
    setIsViewOnly(true);
    setSelectedIdForEdit("");
    setIsEdit(true);
    setModalOpen(true);

    setKeyData(row.key);
    setKeyErr("");
    setTitle(row.title);
    setTitleErr("");
    setCmsName(row.name);
    setCmsNmErr("");
    setDescription(row.description);
    setDescErr("");
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function callDeleteCMSApi() {
    setLoading(true);
    axios
      .delete(Config.getCommonUrl() + "api/cmspages/" + selectedIdForDelete)
      .then(function (response) {
        console.log(response);
        setOpen(false);
        setLoading(false);
        if (response.data.success === true) {
          // selectedIdForDelete
          getCMSData();
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setSelectedIdForDelete("");
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
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/cmspages/" + selectedIdForDelete,
        });
      });
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    if (popupLoading) {
      setTimeout(() => setPopupLoading(false), 7000);
    }
  }, [popupLoading]);

  useEffect(() => {
    getCMSData();
    //eslint-disable-next-line
  }, [dispatch]);

  function getCMSData() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/cmspages")
      .then(function (response) {
        setLoading(false);
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;

          setApiData(tempData);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "api/cmspages" });
      });
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "cmsName") {
      setCmsName(value);
      setCmsNmErr("");
    } else if (name === "title") {
      setTitle(value);
      setTitleErr("");
    } else if (name === "description") {
      setDescription(value);
      setDescErr("");
    } else if (name === "keyData") {
      setKeyData(value);
      setKeyErr("");
    }
  }

  function titleValidation() {
    var Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (!title || Regex.test(title) === false) {
      setTitleErr("Please Enter Valid Title");
      return false;
    }
    return true;
  }

  function keyDataValidation() {
    if (!keyData) {
      setKeyErr("Please Enter Valid Key");
      return false;
    }
    return true;
  }

  function descValidation() {
    if (!description) {
      setDescErr("Please Enter Valid Description");
      return false;
    }
    return true;
  }

  function cmsNameValidation() {
    var Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (!cmsName || Regex.test(cmsName) === false) {
      setCmsNmErr("Please Enter Valid Name");
      return false;
    }
    return true;
  }

  const checkforUpdate = (evt) => {
    evt.preventDefault();

    if (
      cmsNameValidation() &&
      titleValidation() &&
      keyDataValidation() &&
      descValidation()
    ) {
      if (isEdit === true) {
        CallUpdateCMSApi();
      } else {
        CallAddCMSApi();
      }
    }
  };

  function CallUpdateCMSApi() {
    let data = {
      name: cmsName,
      title: title,
      description: description,
      key: keyData,
    };
    setPopupLoading(true);
    axios
      .put(Config.getCommonUrl() + "api/cmspages/" + selectedIdForEdit, data)
      .then(function (response) {
        console.log(response);
        setPopupLoading(false);

        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          handleModalClose(true);
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
        setPopupLoading(false);

        handleError(error, dispatch, {
          api: "api/cmspages/" + selectedIdForEdit,
          body: data,
        });
      });
  }

  function CallAddCMSApi() {
    let data = {
      name: cmsName,
      title: title,
      description: description,
      key: keyData,
    };
    setPopupLoading(true);

    axios
      .post(Config.getCommonUrl() + "api/cmspages", data)
      .then(function (response) {
        console.log(response);
        setPopupLoading(false);

        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          handleModalClose(true);
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
        setPopupLoading(false);
        handleError(error, dispatch, { api: "api/cmspages", body: data });
      });
  }

  function handleModalOpen() {
    setIsViewOnly(false);
    setSelectedIdForEdit("");
    setIsEdit(false);
    setTitle("");
    setTitleErr("");
    setKeyData("");
    setKeyErr("");
    setDescription("");
    setDescErr("");
    setCmsName("");
    setCmsNmErr("");
    setModalOpen(true);
  }

  function handleModalClose(callApi) {
    setModalOpen(false);
    setIsViewOnly(false);
    setSelectedIdForEdit("");
    setIsEdit(false);

    setTitle("");
    setTitleErr("");
    setKeyData("");
    setKeyErr("");
    setDescription("");
    setDescErr("");
    setCmsName("");
    setCmsNmErr("");

    if (callApi === true) {
      getCMSData();
    }
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    CMS
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              >
                {/* <Link
                                    // to="/dashboard/mobappadmin/adduser"
                                    to={{
                                        pathname: '/dashboard/mobappadmin/adduser',
                                        state: {
                                            row: "",
                                            isViewOnly: false,
                                            isEdit: false
                                        }
                                    }}
                                    style={{ textDecoration: "none", color: "inherit" }}
                                > */}
                <Button
                  id="btn-save"
                  variant="contained"
                  // className={classes.button}
                  size="small"
                  onClick={(event) => {
                    handleModalOpen();
                  }}
                >
                  Add New
                </Button>
                {/* </Link> */}
              </Grid>
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll ">
              <div className="mt-8 department-tbl-mt-dv">
                <Paper className={classes.tabroot} id="department-tbl-fix ">
                  <div
                    className="table-responsive "
                    style={{ maxHeight: "calc(100vh - 235px)" }}
                  >
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Name
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Title
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Key
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Description
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {apiData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.name}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.title}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.key}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={clsx(
                                classes.tableRowPad,
                                classes.wrapText
                              )}
                            >
                              {/* description */}
                              {row.description}
                            </TableCell>

                            <TableCell className={classes.tableRowPad}>
                              <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  editHandler(row);
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
                                  viewHandler(row);
                                }}
                              >
                                <Icon className="mr-8 view-icone">
                                  <img src={Icones.view} alt="" />
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
                  </div>
                </Paper>
              </div>
            </div>

            <Dialog
              open={open}
              onClose={handleClose}
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
                  onClick={handleClose}
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
                  onClick={handleClose}
                  className="delete-dialog-box-cancle-button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteCMSApi}
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
              style={{ overflow: "scroll" }}
            >
              <div
                style={modalStyle}
                className={clsx(classes.paper, classes.Modalwidth, "rounded-8")}
              >
                {popupLoading && <LoaderPopup />}

                <h5
                  className="popup-head p-20"
                  style={{
                    padding: "14px",
                  }}
                >
                  {isViewOnly
                    ? "View CMS"
                    : isEdit === false
                    ? "Add CMS"
                    : "Update CMS"}
                  <IconButton
                    style={{ position: "absolute", top: "-2px", right: "8px" }}
                    onClick={handleModalClose}
                  >
                    {" "}
                    <Icon>
                      <img src={Icones.cross} alt="" />
                    </Icon>
                  </IconButton>
                </h5>

                <div className="p-40 pb-32">
                  <p className="popup-labl p-4">Name</p>
                  <TextField
                    placeholder="Name"
                    name="cmsName"
                    style={{ marginBottom: "15px" }}
                    value={cmsName}
                    error={cmsNmErr.length > 0 ? true : false}
                    helperText={cmsNmErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    disabled={isViewOnly}
                  />

                  <p className="popup-labl p-4">Title</p>
                  <TextField
                    placeholder="Title"
                    name="title"
                    style={{ marginBottom: "15px" }}
                    value={title}
                    error={titleErr.length > 0 ? true : false}
                    helperText={titleErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    disabled={isViewOnly}
                  />
                  <p className="popup-labl p-4">Key</p>
                  <TextField
                    placeholder="Key"
                    name="keyData"
                    style={{ marginBottom: "15px" }}
                    value={keyData}
                    error={keyErr.length > 0 ? true : false}
                    helperText={keyErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    disabled={isViewOnly}
                  />
                  {/* <TextField
                                        placeholder="Description"
                                        name="description"
                                        className={clsx(classes.description)}
                                        value={description}
                                        error={descErr.length > 0 ? true : false}
                                        helperText={descErr}
                                        onChange={(e) => handleInputChange(e)}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        multiline
                                        disabled={isViewOnly}
                                    /> */}
                  <div>
                    <div>
                      <p className="popup-labl p-4">Description</p>
                    </div>
                    <div>
                      <TextareaAutosize
                        placeholder="Description"
                        name="description"
                        error={descErr.length > 0 ? true : false}
                        helperText={descErr}
                        onChange={(e) => handleInputChange(e)}
                        maxRows={5}
                        aria-label="maximum height"
                        value={description}
                        style={{
                          width: "100%",
                          border: "1px solid #CCCCCC",
                          borderRadius: "7px",
                          height: "100px",
                          padding: "7px",
                          overflow:"scroll"
                        }}
                        disabled={isViewOnly}
                      />
                    </div>
                  </div>
                  {!isViewOnly && (
                    // <Button
                    //     variant="contained"
                    //     color="primary"
                    //     className="w-full mx-auto department-btn-dv"
                    //     style={{
                    //         backgroundColor: "#4caf50",
                    //         border: "none",
                    //         color: "white",
                    //     }}
                    //     onClick={(e) => checkforUpdate(e)}
                    // >
                    //     Save
                    // </Button>
                    <div className="model-actions flex flex-row ">
                      <Button
                        variant="contained"
                        className="w-128 mx-auto mt-20 popup-cancel"
                        onClick={(e) => handleModalClose(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        className="w-128 mx-auto mt-20 popup-save"
                        onClick={(e) => checkforUpdate(e)}
                      >
                        Save
                      </Button>
                    </div>
                  )}
                  {isViewOnly && (
                    <Button
                      variant="contained"
                      // color="primary"
                      className="w-full mx-auto department-btn-dv popup-cancel"
                      // style={{
                      //     backgroundColor: "#4caf50",
                      //     border: "none",
                      //     color: "white",
                      // }}
                      onClick={(e) => handleModalClose(false)}
                    >
                      close
                    </Button>
                  )}
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default CMS;

import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, InputBase } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
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
import Modal from "@material-ui/core/Modal";
import { TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Loader from "../../../Loader/Loader";
import LoaderPopup from "app/main/Loader/LoaderPopup";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
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
    wordBreak: "break-all",
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

const VariantAttribute = (props) => {
  const [apiData, setApiData] = useState([]); // display list
  const [searchData, setSearchData] = useState("");

  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);

  const [isEdit, setIsEdit] = useState(false);
  const [attributeName, setAttributeName] = useState("");
  const [attributeNameErr, setAttributeNameErr] = useState("");
  const [open, setOpen] = useState(false); //confirm delete Dialog
  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [loading, setLoading] = useState(false);
  const [normalLoading, setNormalLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    if (normalLoading) {
      setTimeout(() => setNormalLoading(false), 7000);
    }
  }, [normalLoading]);

  useEffect(() => {
    getAllAttributeData(); //main list
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);

  const classes = useStyles();

  function getAllAttributeData() {
    setNormalLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/variantattribute")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
          setNormalLoading(false);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant:"error"            })
          );
          setNormalLoading(false);
        }
      })
      .catch((error) => {
        setNormalLoading(false);
        handleError(error, dispatch, { api: "api/variantattribute" });
      });
  }

  function editHandler(id) {
    setSelectedIdForEdit(id);
    setIsEdit(true);
    setModalOpen(true);
    getOneDataApiCall(id);
  }

  function getOneDataApiCall(id) {
    setNormalLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/variantattribute/${id}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setAttributeName(response.data.data.name);
          setNormalLoading(false);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
          setNormalLoading(false);
        }
      })
      .catch((error) => {
        setNormalLoading(false);
        handleError(error, dispatch, { api: `api/variantattribute/${id}` });
      });
  }

  function handleModalClose(callApi) {
    setModalOpen(false);
    setSelectedIdForEdit("");
    setIsEdit(false);
    setAttributeName(""); //first textbox creating new department
    setAttributeNameErr("");
    if (callApi === true) {
      getAllAttributeData(); //main list
    }
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function callDeleteProcessApi() {
    axios
      .delete(
        Config.getCommonUrl() + `api/variantattribute/${selectedIdForDelete}`
      )
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          getAllAttributeData();
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
        setOpen(false);
        handleError(error, dispatch, {
          api: `api/variantattribute/${selectedIdForDelete}`,
        });
      });
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function validateName() {
    if (attributeName === "") {
      setAttributeNameErr("Enter Name");
      return false;
    }
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateName()) {
      if (isEdit) {
        callUpdateApi();
      } else {
        CallAddDataApi();
      }
    }
  };

  function CallAddDataApi() {
    setLoading(true);

    const body = {
      name: attributeName,
    };
    axios
      .post(Config.getCommonUrl() + "api/variantattribute", body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          handleModalClose(true);
          setLoading(false);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/variantattribute",
          body: body,
        });
      });
  }

  function callUpdateApi() {
    setLoading(true);
    const body = {
      name: attributeName,
    };

    axios
      .put(
        Config.getCommonUrl() + `api/variantattribute/${selectedIdForEdit}`,
        body
      )
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          handleModalClose(true);
          setLoading(false);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/variantattribute/${selectedIdForEdit}`,
          body: body,
        });
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={6} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Variant Attribute
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              >
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
              </Grid>
            </Grid>
            <div className="main-div-alll ">
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
                          Attribute Name
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
                        .filter((temp) =>
                          temp.name
                            .toLowerCase()
                            .includes(searchData.toLowerCase())
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
                              {row.name}
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
              <DialogTitle id="alert-dialog-title">{"Alert!!!"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this record?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteProcessApi}
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
            >
              <div
                style={modalStyle}
                className={clsx(classes.paper, "rounded-8")}
              >
                {loading && <LoaderPopup />}
                <h5 className="popup-head p-20">
                  {isEdit === false
                    ? "Add New Variant Attribute"
                    : "Edit Variant Attribute"}
                  <IconButton
                    style={{ position: "absolute", top: 5, right: 8 }}
                    onClick={handleModalClose}
                  >
                    <Icon>
                      <img src={Icones.cross} alt="" />
                    </Icon>
                  </IconButton>
                </h5>
                <div className="p-40 ">
                  <p className="popup-labl pb-1">Attribute Name</p>

                  <TextField
                    placeholder="Attribute Name"
                    name="attributeName"
                    className="mt-16"
                    value={attributeName}
                    error={attributeNameErr.length > 0 ? true : false}
                    helperText={attributeNameErr}
                    onChange={(e) => {
                      setAttributeName(e.target.value);
                      setAttributeNameErr("");
                    }}
                    variant="outlined"
                    fullWidth
                  />

                  <div className="popup-button-div">
                    <Button
                      onClick={handleModalClose}
                      className="delete-dialog-box-cancle-button"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      className="save-button-css"
                      onClick={(e) => handleSubmit(e)}
                    >
                      {isEdit ? "update" : "save"}
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

export default VariantAttribute;

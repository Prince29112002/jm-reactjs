import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, InputBase } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import PurityAddEdit from "./subViews/StateAddEdit";
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
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
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
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
    marginRight: "16px",
  },
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
  },
}));

const StateMaster = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [stateData, setStateData] = useState([]);
  const [modalView, setModalView] = useState(false);
  const [edit, setEdit] = useState("");
  const [searchData, setSearchData] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    getStateData();
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);

  function getStateData() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/state`)
      .then((response) => {
        console.log(response);
        setStateData(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: `api/state` });
      });
  }

  const handleClose = () => {
    setEdit("");
    setModalView(false);
    getStateData();
  };
  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setDeleteOpen(true);
  }
  function handledeleteClose() {
    setSelectedIdForDelete("");
    setDeleteOpen(false);
  }

  const headerClose = () => {
    setEdit("");
    setModalView(false);
  };

  const editHandler = (id) => {
    if (id) {
      setModalView(true);
      setEdit(id);
    }
  };

  function deleteApiCall() {
    axios
      .delete(Config.getCommonUrl() + `api/state/${selectedIdForDelete}`)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setSelectedIdForDelete("");
          setDeleteOpen(false);
          getStateData();
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
          api: `api/state/${selectedIdForDelete}`,
        });
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              className=" department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={6} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    State Master
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
                  className={classes.button}
                  size="small"
                  onClick={() => setModalView(true)}
                >
                  Add New
                </Button>
              </Grid>
            </Grid>
            <div className="main-div-alll ">
              {loading && <Loader />}
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
              {modalView === true && (
                <PurityAddEdit
                  modalColsed={handleClose}
                  data={edit}
                  headerClose={headerClose}
                />
              )}
              <div className="mt-56">
                <Paper className={classes.tabroot} id="finishpurity_tabel_dv">
                  {/* <div className="table-responsive "> */}
                  <MaUTable className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          Statename
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Country
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Gst
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Whatsapp No.
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stateData
                        .filter(
                          (temp) =>
                            (temp.name !== null &&
                              temp.name
                                .toString()
                                .toLowerCase()
                                .includes(searchData.toLowerCase())) ||
                            (temp.countryname?.name !== null &&
                              temp.countryname?.name
                                .toLowerCase()
                                .includes(searchData.toLowerCase())) ||
                            (temp.gst_code !== null &&
                              temp.gst_code
                                .toLowerCase()
                                .includes(searchData.toLowerCase()))
                        )
                        .map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className={classes.tableRowPad}>
                              {row.name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row.countryname?.name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row.gst_code}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row.whatsapp_contact}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  editHandler(row.id);
                                }}
                              >
                                <Icon className="mr-8">
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
                                hidden={true}
                              >
                                <Icon className="mr-8" style={{ color: "red" }}>
                                  delete
                                </Icon>
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </MaUTable>
                  {/* </div> */}
                </Paper>
                <Dialog
                  open={deleteOpen}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    {"Alert!!!"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to delete this record?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handledeleteClose} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={deleteApiCall} color="primary" autoFocus>
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default StateMaster;

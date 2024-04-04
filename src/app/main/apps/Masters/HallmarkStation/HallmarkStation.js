import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, InputBase } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
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
import Button from "@material-ui/core/Button";
import Loader from "../../../Loader/Loader";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddEditStation from "./SubViews/AddEditStation";
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
  },
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
  },
}));

const HallmarkStation = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [stationList, setStationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalView, setModalView] = useState(false);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    getAllStationList();
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);

  function getAllStationList() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/hallmarkissue/station")
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setStationList(response.data.Stations);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: "api/hallmarkissue/station" });
      });
  }

  const editHandler = (rowData) => {
    setModalView(true);
    setEditData(rowData.id);
  };

  const deleteHandler = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  function callDeleteApi() {
    axios
      .delete(Config.getCommonUrl() + `api/hallmarkissue/remove/${deleteId}`)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          getAllStationList();
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
        handleError(error, dispatch, {
          api: `api/hallmarkissue/remove/${deleteId}`,
        });
      });
  }

  const handleCloseDelete = () => {
    setDeleteId("");
    setOpen(false);
  };

  const handleClose = () => {
    setModalView("");
    setEditData("");
    getAllStationList();
  };

  const handleCloseHeader = () => {
    setModalView("");
    setEditData("");
  };

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
              <Grid item xs={6} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Hallmark Station
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
                  Add Station
                </Button>
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
              {loading && <Loader />}
              {modalView === true && (
                <AddEditStation
                  modalColsed={handleClose}
                  data={editData}
                  headerClose={handleCloseHeader}
                />
              )}

              <div className="mt-56">
                <Paper
                  className={clsx(
                    classes.tabroot,
                    "table-responsive voucher-tbel-blg "
                  )}
                >
                  <MaUTable className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          ID
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Station Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Station Address
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Contact No.
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {console.log(stationList)}
                      {stationList
                        .filter(
                          (temp) =>
                            temp.name
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.address
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.contact
                              .toLowerCase()
                              .includes(searchData.toLowerCase())
                        )
                        .map((row, i) => (
                          <TableRow key={row.id}>
                            <TableCell className={classes.tableRowPad}>
                              {i + 1}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row.name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row.address}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {/* {row.contact} */}
                              {row?.first_country?.phonecode
                                ? "+" + row?.first_country?.phonecode
                                : "" + " "}{" "}
                              {row.contact}
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
                  </MaUTable>
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
                  Are you sure you want to delete this station?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleCloseDelete}
                  className="delete-dialog-box-cancle-button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteApi}
                  className="delete-dialog-box-delete-button"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default HallmarkStation;

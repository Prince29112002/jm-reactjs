import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
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
import moment from "moment";
import { Link } from "react-router-dom";
import Loader from "../../../Loader/Loader";
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
    padding: theme.spacing(4),
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
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
  searchBox: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
  wrapText: {
    whiteSpace: "nowrap",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const NewsAndUpdate = (props) => {
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [apiData, setApiData] = useState([]);
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  function editHandler(row) {
    props.history.push("/dashboard/mobappadmin/addnewsupdate", {
      row: row,
      isViewOnly: false,
      isEdit: true,
    });
  }

  function viewHandler(row) {
    props.history.push("/dashboard/mobappadmin/addnewsupdate", {
      row: row,
      isViewOnly: true,
      isEdit: false,
    });
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function callDeleteApi() {
    axios
      .delete(
        Config.getCommonUrl() + "api/newsandupdates/" + selectedIdForDelete
      )
      .then(function (response) {
        setOpen(false);
        if (response.data.success === true) {
          getNewsAndUpdates();
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
          api: "api/newsandupdates/" + selectedIdForDelete,
        });
      });
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    getNewsAndUpdates();
    // getting list of ALL clients
    //eslint-disable-next-line
  }, [dispatch]);

  function getNewsAndUpdates() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/newsAndUpdates")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;

          setApiData(tempData);
          setLoading(false);
          // setData(response.data);
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
        handleError(error, dispatch, { api: "api/newsAndUpdates" });
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
              <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    News & Updates
                  </Typography>
                </FuseAnimate>
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              >
                <Link
                  // to="#"
                  // to="/dashboard/mobappadmin/addnewsupdate"
                  to={{
                    pathname: "/dashboard/mobappadmin/addnewsupdate",
                    state: {
                      row: "",
                      isViewOnly: false,
                      isEdit: false,
                    },
                  }}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button
                    id="btn-save"
                    variant="contained"
                    className={classes.button}
                    size="small"
                    onClick={(event) => {
                      //   setDefaultView(btndata.id);
                      //   setIsEdit(false);
                    }}
                  >
                    Add News & Updates
                  </Button>
                </Link>
              </Grid>
            </Grid>

            {/* <div style={{ textAlign: "right" }} className="mr-16">
              <label style={{ display: "contents" }}> Search : </label>
              <Search
                className={classes.searchBox}
                onSearch={onSearchHandler}
              />
            </div> */}
            {loading && <Loader />}
            <div className="main-div-alll ">
              <div className="department-tbl-mt-dv">
                <Paper className={classes.tabroot} id="department-tbl-fix ">
                  <div
                    className="table-responsive "
                    style={{ maxHeight: "calc(100vh - 235px)" }}
                  >
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>
                            Title
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Date
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Media
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Short Description
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
                            {/* component="th" scope="row" */}
                            <TableCell className={classes.tableRowPad}>
                              {row.title}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {moment
                                .utc(row.date)
                                .local()
                                .format("DD-MM-YYYY")}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.media_type === 0 ? "Video - URL" : "Image"}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={clsx(
                                classes.tableRowPad,
                                classes.wrapText
                              )}
                            >
                              {row.shortDesc}
                            </TableCell>

                            <TableCell
                              align="left"
                              // className={classes.tableRowPad}
                              className={clsx(
                                classes.tableRowPad,
                                classes.wrapText
                              )}
                            >
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

export default NewsAndUpdate;

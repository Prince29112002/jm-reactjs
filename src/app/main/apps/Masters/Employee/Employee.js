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
import { Link } from "react-router-dom";
import Search from "../SearchHelper/SearchHelper";
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
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  filterBtn: {
    margin: 5,
    textTransform: "none",
    // backgroundColor: "darkviolet",
    // color: "white"
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
}));

const Employee = (props) => {
  const [defaultView, setDefaultView] = useState("1");
  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [searchData, setSearchData] = useState("");

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    NavbarSetting("Master", dispatch);
  }, []);

  function editHandler(id) {
    setSelectedIdForEdit(id);
    setIsEdit(true);
    setDefaultView("2");
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function onSearchHandler(sData) {
    setSearchData(sData);
  }

  function callDeleteEmpApi() {
    axios
      .delete(Config.getCommonUrl() + "api/employee/" + selectedIdForDelete)
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          // selectedIdForDelete

          const findIndex = apiData.findIndex(
            (a) => a.id === selectedIdForDelete
          );

          findIndex !== -1 && apiData.splice(findIndex, 1);

          dispatch(
            Actions.showMessage({
              message: "Deleted Successfully",
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
          api: "api/employee/" + selectedIdForDelete,
        });
      });
  }

  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    // getting list of ALL users
    axios
      .get(Config.getCommonUrl() + "api/employee")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/employee" });
      });
  }, [dispatch, defaultView]);

  const classes = useStyles();

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="p-16 pb-8 text-18 font-700">
                    Employee
                  </Typography>
                </FuseAnimate>
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
                md={9}
                key="2"
                style={{ textAlign: "right", paddingRight: "5%" }}
              >
                <Link
                  to="/dashboard/masters/addemployee"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button
                    variant="contained"
                    className={classes.button}
                    size="small"
                    onClick={(event) => {
                      //   setDefaultView(btndata.id);
                      //   setIsEdit(false);
                    }}
                  >
                    Add New
                  </Button>
                </Link>
              </Grid>
            </Grid>
            <div style={{ textAlign: "right" }} className="mr-16">
              <label style={{ display: "contents" }}> Search : </label>
              <Search
                className={classes.searchBox}
                onSearch={onSearchHandler}
              />
            </div>
            <div className="m-16 mt-56">
              <Paper className={classes.tabroot}>
                <div className="table-responsive">
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          ID
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Designation Department
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Joining Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Address
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Contact No.
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiData.map((row) => (
                        <TableRow key={row.id}>
                          {/* component="th" scope="row" */}
                          <TableCell className={classes.tableRowPad}>
                            {row.id}
                          </TableCell>
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
                            {row.designation}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {row.joining_date}
                          </TableCell>

                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {row.address}
                          </TableCell>

                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {row.number}
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
                              <Icon className="mr-8" style={{ color: "red" }}>
                                delete
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
                <Button onClick={callDeleteEmpApi} color="primary" autoFocus>
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

export default Employee;

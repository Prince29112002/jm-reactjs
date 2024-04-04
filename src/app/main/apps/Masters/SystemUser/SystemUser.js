import React, { useState, useEffect } from "react";
import { InputBase, Typography } from "@material-ui/core";
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
import CreateSysUser from "./SubViews/CreateSysUser";
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";
import SearchIcon from "@material-ui/icons/Search";

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

const SystemUser = (props) => {
  const [defaultView, setDefaultView] = useState("1");
  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchData, setSearchData] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
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

  function callDeleteItemTypeApi() {
    axios
      .delete(Config.getCommonUrl() + "api/admin/" + selectedIdForDelete)
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          // selectedIdForDelete

          const findIndex = apiData.findIndex(
            (a) => a.id === selectedIdForDelete
          );

          findIndex !== -1 && apiData.splice(findIndex, 1);

          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setSelectedIdForDelete("");
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/admin/" + selectedIdForDelete,
        });
      });
  }

  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    // getting list of ALL users
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/admin")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
          setLoading(false);
          // setData(response.data);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "api/admin" });
      });
  }, [dispatch, defaultView]);

  const classes = useStyles();

  const ButtonArr = [
    { id: "1", text: "Back" },
    { id: "2", text: "Create User" },
  ];

  function changeView() {
    setDefaultView("1");
    setIsEdit(false);
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              className="department-main-dv systemuser-title-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={6} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  {defaultView === "1" ? (
                    <Typography className="pl-28 pt-16 text-18 font-700">
                      System Users
                    </Typography>
                  ) : (
                    <Typography className="pl-28 pt-16 text-18 font-700">
                      {isEdit === false ? "CREATE USER" : "EDIT USER"}
                    </Typography>
                  )}
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={6}
                sm={8}
                md={9}
                key="2"
                style={{ textAlign: "right" }}
              >
                {ButtonArr.filter((btn) => defaultView !== btn.id).map(
                  (btndata, idx) => {
                    // if (defaultView !== btndata.id) {
                    return btndata.text == "Create User" ? (
                      <Button
                      
                        className={classes.button}
                        size="small"
                        key={idx}
                        onClick={(event) => {
                          setDefaultView(btndata.id);
                          setIsEdit(false);
                        }}
                      >
                        {btndata.text}
                      </Button>
                    ) : (
                      <div className="btn-back">
                        <img src={Icones.arrow_left_pagination} alt="" />
                        <Button
                          id="btn-back"
                          size="small"
                          key={idx}
                          onClick={(event) => {
                            setDefaultView(btndata.id);
                            setIsEdit(false);
                          }}
                        >
                          {btndata.text}
                        </Button>
                      </div>
                    );
                    // }
                  }
                )}
              </Grid>
            </Grid>
            <div className="main-div-alll ">
              <div>
                {defaultView === "1" && (
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
                )}
              </div>

              {loading && <Loader />}
              {defaultView === "1" && (
                <div className="mt-56" >
                  <Paper
                    className={clsx(
                      classes.tabroot,
                      "table-responsive "
                    )}
                    id="systemuser_tabel_dv"
                  >
                    {/* <div className="table-responsive "> */}
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>
                            ID
                          </TableCell>

                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            User Name
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Role
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {apiData
                         .filter((temp) => 
                          temp.username.toLowerCase().includes(searchData.toLowerCase()) ||
                          temp.role_name
                              .toLowerCase()
                              .includes(searchData.toLowerCase())
                        ).map((row, index) => (
                          <TableRow key={row.id}>
                            {/* component="th" scope="row" */}
                            <TableCell className={classes.tableRowPad}>
                              {index + 1}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.username}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.role_name}
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
                                <Icon className="mr-8 delete-icone">
                                  <img src={Icones.delete_red} alt="" />
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
              )}
              {defaultView === "2" && (
                <CreateSysUser
                  changeView={changeView}
                  isEdit={isEdit}
                  editID={selectedIdForEdit}
                />
              )}
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
                  onClick={callDeleteItemTypeApi}
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

export default SystemUser;

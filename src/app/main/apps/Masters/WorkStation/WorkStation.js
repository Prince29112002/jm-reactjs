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
import { Link } from "react-router-dom";
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";
import SearchIcon from "@material-ui/icons/Search";
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

const WorkStation = (props) => {
  // const [defaultView, setDefaultView] = useState("1");
  // const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  // const [isEdit, setIsEdit] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [apiData, setApiData] = useState([]);
  const [apiSearchData, setApiSearchData] = useState([]);
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    NavbarSetting('Master', dispatch);
    //eslint-disable-next-line
  }, []);

  function editHandler(id) {
    const index = apiData.findIndex((a) => a.id === id);
    if (index > -1) {
      props.history.push("/dashboard/masters/editworkstation", {
        row: apiData[index],
      });
    }
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

 
  function callDeleteWorkStaionApi() {
    axios
      .delete(Config.getCommonUrl() + "api/workstation/" + selectedIdForDelete)
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          // selectedIdForDelete
          getWorkStation();

          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setSelectedIdForDelete("");
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch ,{api : "api/workstation/" + selectedIdForDelete})

      });
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    getWorkStation();
    // getting list of ALL clients
    //eslint-disable-next-line
  }, [dispatch]);

  function getWorkStation() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/workstation")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
          // setData(response.data);

          let tempData = response.data.data;

          let data = tempData.map((row) => {
            return {
              id: row.id,
              name: row.name,
              departmentNm: row.department.name,
              workers: row.workstation_worker
                .map((worker, indx) =>
                  indx === row.workstation_worker.length - 1
                    ? worker.name
                    : worker.name + " | "
                )
                .join(""),
            };
          });
          setApiSearchData(data);
          setLoading(false);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {api :"api/workstation"})

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
              <Grid item xs={6} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                <Typography className="pl-28 pt-16 text-18 font-700">
                    Work Station
                  </Typography>
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
                <Link
                  to="/dashboard/masters/addworkstation"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button
                  
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
            <div className="main-div-alll ">
            {loading && <Loader />}
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

            <div className="mt-56">
              <Paper className={clsx(classes.tabroot,"table-responsive inner-workstation-tabel-dv")} id="workstation-tabel-dv">
                {/* <div className="table-responsive inner-workstation-tabel-dv"> */}
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          ID
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Work Station Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Department Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Worker Name
                        </TableCell>

                        <TableCell className={classes.tableRowPad} align="left">
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiSearchData
                        .filter(
                          (temp) =>
                            temp.name
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.departmentNm
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.workers
                              .toLowerCase()
                              .includes(searchData.toLowerCase())
                        )
                        .map((row) => (
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
                              {row.departmentNm}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {/* {row.client_contact_name !== null
                              ? row.client_contact_name
                              : "-"} */}
                              {row.workers}
                              {/* {row.workstation_worker.map((worker, indx) =>
                                indx === row.workstation_worker.length - 1
                                  ? worker.name
                                  : worker.name + " | "
                              )} */}
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
                  onClick={callDeleteWorkStaionApi}
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

export default WorkStation;

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
// import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import SearchIcon from "@material-ui/icons/Search";
import Icones from "assets/fornt-icons/Mainicons";
import History from "@history";
import moment from "moment";

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
    // margin: 5,
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
  wrapText: {
    whiteSpace: "nowrap",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const OrderRetailer = (props) => {
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [searchData, setSearchData] = useState("");
  const [apiData, setApiData] = useState([]);
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const roleOfUser = localStorage.getItem("permission")
    ? JSON.parse(localStorage.getItem("permission"))
    : null;
  const [authAccessArr, setAuthAccessArr] = useState([]);

  useEffect(() => {
    let arr = roleOfUser
      ? roleOfUser["Orders-Retailer"]["Order-Retailer"]
        ? roleOfUser["Orders-Retailer"]["Order-Retailer"]
        : []
      : [];
    const arrData = [];
    if (arr.length > 0) {
      arr.map((item) => {
        arrData.push(item.name);
      });
    }
    setAuthAccessArr(arrData);
  }, []);


  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  useEffect(() => {
    NavbarSetting("Orders-Retailer", dispatch);
  }, []);

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function onSearchHandler(sData) {
    setSearchData(sData);
  }

  function callDeleteClientApi() {
    axios
      .delete(Config.getCommonUrl() + "retailerProduct/api/clientRet/delete/" + selectedIdForDelete)
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          getClients();
          dispatch(Actions.showMessage({ message: response.data.message, variant: "success" }));
          setSelectedIdForDelete("");
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
      })
      .catch((error) => {
        setOpen(false);

        handleError(error, dispatch, {
          api: "retailerProduct/api/clientRet/delete/" + selectedIdForDelete,
        });
      });
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    getClients();
    // getting list of ALL clients
    //eslint-disable-next-line
  }, [dispatch]);
  function editHandler(row, isEditAllow, isViewAllow) {
    props.history.push("/dashboard/orderretailer/addorderretailer", {
      id: row.id,
      isViewOnly: isViewAllow,
      isEditOnly: isEditAllow,
      orderNumber: row.order_number
    });
  }
  
  function getClients() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/order/")
      .then(function (response) {
        if (response.data.success === true) {
          const arrData = response.data.data.map((item) => {
            return {
              ...item,
              purity: item.purity === 14 ? "14 KT" : item.purity === 18 ? "18 KT" : item.purity === 20 ? "20 KT" : item.purity === 22 ? "22 KT" : "24 KT",


              status: item.order_status === 1 ? "New Order" : item.order_status === 2 ? "Running" : item.order_status === 3 ? "Completed" : item.order_status === 4 ? "Customer Cancelled" : "Declined",
            }
          })
          setApiData(arrData);
          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "retailerProduct/api/order/" });
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full ")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            <Grid
              container
              alignItems="center"
              style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
            >
              <Grid item xs={5} sm={4} md={4} lg={5} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Order
                  </Typography>
                </FuseAnimate>
              </Grid>

              {
                authAccessArr.includes('Add Order-Retailer') && <Grid
                  item xs={7} sm={8} md={8} lg={7} key="2" style={{ textAlign: "right" }}
                >
                  <Button
                    variant="contained"
                    className={classes.button}
                    size="small"
                    onClick={() => History.push('/dashboard/orderretailer/addorderretailer')}
                  >
                    Add New
                  </Button>
                </Grid>
              }

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
              {/* {loading && <Loader />} */}
              <div className="mt-56 department-tbl-mt-dv">
                <Paper className={classes.tabroot} id="department-tbl-fix ">
                  <div
                    className="table-responsive "
                    style={{ height: "calc(100vh - 280px)" }}
                  >
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>Id</TableCell>
                          <TableCell className={classes.tableRowPad}>Order Number</TableCell>
                          <TableCell className={classes.tableRowPad}>Date</TableCell>
                          <TableCell className={classes.tableRowPad}> Customer Name</TableCell>
                          <TableCell className={classes.tableRowPad}>Status</TableCell>
                          <TableCell className={classes.tableRowPad}>Karat</TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {apiData
                          .filter(
                            (temp) =>
                              temp.order_number
                                .toLowerCase()
                                .includes(searchData.toLowerCase()) ||
                              (moment(temp.created_at).format("DD-MM-YYYY"))
                                .toLowerCase()
                                .includes(searchData.toLowerCase()) ||
                              (temp.customername !== null ? temp.customername.client_Name : "-")
                                .toLowerCase()
                                .includes(searchData.toLowerCase()) ||
                              temp.status
                                .toLowerCase()
                                .includes(searchData.toLowerCase()) ||
                              (temp.purity !== null
                                ? temp.purity
                                : "-")
                                .toLowerCase()
                                .includes(searchData.toLowerCase())

                          )

                          .map((row, i) => (
                            <TableRow key={row.id}>
                              {/* component="th" scope="row" */}
                              <TableCell className={classes.tableRowPad}>
                                {i + 1}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.order_number}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {moment(row.created_at).format(
                                  "DD-MM-YYYY"
                                )}                          </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.customername !== null ? row.customername.client_Name : "-"}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >

                                {row.status}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.purity !== null
                                  ? row.purity
                                  : "-"}
                              </TableCell>

                              <TableCell className={classes.tableRowPad}>
                                {row.is_used === 0 && authAccessArr.includes('Edit Order-Retailer') ?
                                  <IconButton
                                    style={{ padding: "0" }}
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      editHandler(row, true, false);
                                    }}
                                  >
                                    <Icon className="mr-8 edit-icone">
                                      <img src={Icones.edit} alt="" />
                                    </Icon>
                                  </IconButton> : ""}
                                  {
                                    authAccessArr.includes('View Order-Retailer') && <IconButton
                                    style={{ padding: "0" }}
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      editHandler(row, false, true);
                                    }}
                                  >
                                    <Icon className="mr-8 view-icone">
                                      <img src={Icones.view} alt="" />
                                    </Icon>
                                  </IconButton>
                                  }
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
                  onClick={callDeleteClientApi}
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

export default OrderRetailer;

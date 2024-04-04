import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, InputBase } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CreateVoucherRetailer from "../VoucherRetailer/SubViewsRetailer/CreateVoucherRetailer";
import * as Actions from "app/store/actions";
import Loader from '../../../Loader/Loader';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";
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
      color: "white",
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
    searchBox: {
      padding: 6,
      fontSize: "12pt",
      borderColor: "darkgray",
      borderWidth: 1,
      borderRadius: 5,
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
  }));

const OtherAccVoucherRetailer = (props) => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const [voucherList, setVoucherList] = useState([]);
    const [modalView, setModalView] = useState(false);
    const [searchData, setSearchData] = useState("");
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState("");
    const roleOfUser = localStorage.getItem("permission")
    ? JSON.parse(localStorage.getItem("permission"))
    : null;
  const [authAccessArr, setAuthAccessArr] = useState([]);

  useEffect(() => {
    let arr = roleOfUser
        ? roleOfUser["Accounts-Retailer"]["Other Voucher-Retailer"]
          ? roleOfUser["Accounts-Retailer"]["Other Voucher-Retailer"]
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

    useEffect(() => {
        if (loading) {
          setTimeout(() => setLoading(false), 7000);
        }
      }, [loading]);
    
      useEffect(() => {
        getAllVoucherList();
        //eslint-disable-next-line
      }, [authAccessArr])
    
      const handleClose = (id) => {
        setModalView(false);
        if (id) {
          editHandler(id)
        }
      };
    
      const deleteHandler = (id) => {
        setDeleteId(id)
        setOpen(true);
      }
    
      useEffect(() => {
        NavbarSetting('Accounts-Retailer',dispatch)
        //eslint-disable-next-line
      }, [])
    
      function getAllVoucherList() {
        setLoading(true);
        axios.get(Config.getCommonUrl() + "retailerProduct/api/vouchersettingdetail")
          .then((response) => {
            console.log(response);
            setVoucherList(response.data.data);
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            handleError(error, dispatch, {api : "retailerProduct/api/vouchersettingdetail"})
          })
      }
    
      function editHandler(id,isEditAllow,isViewAllow) {
        props.history.push('/dashboard/accountretailer/otheraccvoucherretailer/editvoucherretailer', { id: id,isEdit : isEditAllow , isView : isViewAllow })
      }
    
      function handleCloseDelete() {
        setDeleteId("");
        setOpen(false);
      }
      function callDeleteApi() {
        axios.delete(Config.getCommonUrl() + `retailerProduct/api/vouchersettingdetail/${deleteId}`)
          .then((response) => {
            console.log(response);
            if (response.data.success) {
              dispatch(Actions.showMessage({ message: response.data.message,variant:"success"}));
              getAllVoucherList();
            } else {
              dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
            }
            setOpen(false);
          })
          .catch((error) => {
            setOpen(false);
            handleError(error, dispatch, {api:`retailerProduct/api/vouchersettingdetail/${deleteId}`})
          })
      }

    return (
        <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">

            <Grid
             container
             alignItems="center"
             style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
            >
              <Grid item xs={8} sm={4} md={4} lg={5} key="1">
                <FuseAnimate delay={300}>
                <Typography className="text-18 font-700">
                   Other Voucher
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
              <Grid item xs={4} sm={8} md={8} lg={7} key="2"
                style={{ textAlign: "right" }}
              >
                  {
                  authAccessArr.includes('Add Other Vouchers-Retailer') && <Button id="voucher-list-btn"
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={() => setModalView(true)}
                >
                  Create Voucher
                </Button>
                  }
                
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
            {loading && <Loader />}
            {modalView === true && <CreateVoucherRetailer modalColsed={handleClose} />}

            <div className="mt-56">
              <Paper className={clsx(classes.tabroot, "table-responsive voucher-tbel-blg-new voucher-tbel-blg-dv createaccount-tbel-dv")}>
                <MaUTable className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad}>ID</TableCell>
                      <TableCell className={classes.tableRowPad}>Voucher Name</TableCell>
                      <TableCell className={classes.tableRowPad}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {voucherList.filter((temp) =>
                      temp.name.toLowerCase().includes(searchData.toLowerCase())
                    ).map((row, i) => (
                      <TableRow key={row.id}>
                        <TableCell className={classes.tableRowPad}>
                          {i + 1}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {row.name}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                        {
                            authAccessArr.includes('View Other Vouchers-Retailer') &&  <IconButton
                            style={{ padding: "0" }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              ev.stopPropagation();
                              editHandler(row.id,false,true);
                            }}
                          >
                            <Icon className="mr-8 view-icone">
                                <img src={Icones.view} alt="" />
                              </Icon>
                          </IconButton>
                          }
                        {
                            authAccessArr.includes('Edit Other Vouchers-Retailer') &&  <IconButton
                            style={{ padding: "0" }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              ev.stopPropagation();
                              editHandler(row.id,true,false);
                            }}
                          >
                            <Icon className="mr-8 edit-icone">
                                <img src={Icones.edit} alt="" />
                            </Icon>
                          </IconButton>
                        }
                         {
                            authAccessArr.includes('Delete Other Vouchers-Retailer') &&   <IconButton
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
                         }
                        </TableCell>
                      </TableRow>
                    ))
                    }
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
                Are you sure you want to delete this record?
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
    )
}

export default OtherAccVoucherRetailer;
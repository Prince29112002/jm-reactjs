import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, InputBase } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import CreateGroup from './SubViews/CreateGroup';
import CreateLedger from './SubViews/CreateLedger';
import CreateSubGroup from './SubViews/CreateSubGroup';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from "@material-ui/core/Paper";
import Loader from '../../../Loader/Loader';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
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
  search: {
    display: "flex",
    border: "1px solid #cccccc",
    float: "right",
    height: "38px",
    width: "340px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    alignItems: "center",
    marginRight: "10px",
  },
  iconButton: {
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
    marginLeft: "100px"
  },
  searchBox: {
    padding: 6,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "50%",
  },
  tab: {
    padding: 0,
    minWidth: "auto",
    marginRight: 30,
    textTransform: "capitalize",
  },
}));

const CreateAccountRetailer = (props) => {

  const [modalView, setModalView] = useState("");
  const [accountList, setAccountList] = useState([]);
  const [accountGroupList, setAccountGroupList] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [editData, setEditData] = useState(false);
  const [ledId, setLedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [tabView, setTabView] = useState(0)
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteData, setDeleteData] = useState("")
  const classes = useStyles();
  const dispatch = useDispatch();
  const roleOfUser = localStorage.getItem("permission")
    ? JSON.parse(localStorage.getItem("permission"))
    : null;
  const [authAccessArr, setAuthAccessArr] = useState([]);

  useEffect(() => {
    let arr = roleOfUser
        ? roleOfUser["Accounts-Retailer"]["Account-Retailer"]
          ? roleOfUser["Accounts-Retailer"]["Account-Retailer"]
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
    const timeout = setTimeout(() => {
      if (searchData && tabView === 0) {
        getAccountData(searchData);
      } else if (tabView === 1) {
        getGroupData(searchData)
      } else if (tabView === 0 && searchData === "") {
        getAccountData();
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    }
    //eslint-disable-next-line      
  }, [searchData, tabView])

  useEffect(() => {
    NavbarSetting('Accounts-Retailer', dispatch)
    //eslint-disable-next-line
  }, [])

  function getAccountData(text) {
    setLoading(true);
    const api = text ? `retailerProduct/api/account?search=${text}` : `retailerProduct/api/account`;
    axios.get(Config.getCommonUrl() + api)
      .then((response) => {
        console.log(response,"//////////111");
        if (response.data.success) {
          setAccountList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: api })
      })
  }

  function getGroupData(text) {
    setLoading(true);
    const api = text ? `retailerProduct/api/account/group?search=${text}` : `retailerProduct/api/account/group`;
    axios.get(Config.getCommonUrl() + api)
      .then((response) => {
        console.log(response);
        setAccountGroupList(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: api })
      })
  }

  const editHandler = (rowData, isEdit) => {
    setModalView(3)
    setLedId(rowData.id)
    setEditData(isEdit)
  }

  const clearSearch = () => {
    document.getElementById("input-ml").value = "";
  }

  const handleDeleteClose = () => {
    clearSearch()
    setDeleteModal(false)
    setDeleteData("")
  }

  const callDeleteApi = () => {
    if (tabView === 0) {
      var api = `retailerProduct/api/ledger/${deleteData.id}`
    } else if (tabView === 1) {
      var api = `retailerProduct/api/group/${deleteData.id}`
    }
    axios.delete(Config.getCommonUrl() + api)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "success"}));
          handleDeleteClose()
          if (tabView === 0) {
            getAccountData();
          } else {
            getGroupData();
          }
        }
        else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: api })
      })
  }

  const handleClose = () => {
    setModalView("");
    clearSearch()
    setEditData(false);
    setLedId("")
    if (tabView === 0) {
      getAccountData();
    } else {
      getGroupData();
    }
  };

  const headerClose = () => {
    setModalView("");
    setLedId("")
    setEditData(false);
  }

  const ButtonArr = [
    { id: 1, text: "Create Group" , isAccesss : authAccessArr.includes('Add Group-Retailer')},
    // { id: 2, text: "Create Sub Group" },
    { id: 3, text: "Create Ledger", isAccesss : authAccessArr.includes('Add /Edit Ledger-Retailer')},
  ];

  const handleChangeTab = (event, value) => {
    setTabView(value);
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
              <Grid item xs={3} sm={4} md={4} lg={5} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Account
                  </Typography>
                </FuseAnimate>
              </Grid>
              <Grid
               item xs={9} sm={8} md={8} lg={7} key="2"
                style={{display:"flex",columnGap:"10px", justifyContent:"flex-end"}}
              >
                {ButtonArr.map((btndata, idx) => {
                  if(btndata.isAccesss){
                    
                   return   <Button
                      variant="contained"
                      className={classes.button}
                      size="small"
                      key={idx}
                      onClick={(event) => setModalView(btndata.id)}
                    >
                      {btndata.text}
                    </Button>
                    
                  }})}
              </Grid>
            </Grid>

            {modalView === 1 && <CreateGroup modalColsed={handleClose} data={editData} headerClose={headerClose} />}
            {modalView === 2 && <CreateSubGroup modalColsed={handleClose} data={editData} headerClose={headerClose} />}
            {modalView === 3 && <CreateLedger modalColsed={handleClose} isView={editData} headerClose={headerClose} ledgerId={ledId} />}
            {loading && <Loader />}

            <div className="main-div-alll">
              <Grid container justifyContent="space-between" alignItems="center">
           
                <Grid item xs={12} sm={6}>
                  <AppBar position="static" className="add-header-purchase">
                      <Tabs value={tabView} onChange={handleChangeTab}>
                        <Tab label="Ledger List" className={classes.tab} />
                        {
                          authAccessArr.includes('View Group-Retailer') && <Tab label="Group List" className={classes.tab} />
                        }
                      </Tabs>
                    </AppBar>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <div
                    style={{ borderRadius: "7px !important" }}
                    component="form"
                    className={classes.search}
                  >
                    <InputBase
                      className={classes.input}
                      placeholder="Search"
                      inputProps={{ "aria-label": "search" }}
                      id="input-ml"
                      onChange={(event) => setSearchData(event.target.value)}
                    // value={searchData}
                    // onChange={(event) => setSearchData(event.target.value)}
                    />
                    <IconButton
                      type="submit"
                      className={classes.iconButton}
                      aria-label="search"
                    >
                      <SearchIcon />
                    </IconButton>
                  </div>
                </Grid>
                
              </Grid>
              <div>
                
              </div>

              <Grid className="hallmark-main-tbl-dv">
                <div className={classes.root}>
                  
                </div>
              </Grid>

              {
                tabView === 1 && <div className="mt-5">
                  <Paper className={clsx(classes.tabroot, "table-responsive createaccount-tbel-blg createaccount-tbel-dv")}>
                    <MaUTable className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>Main Head</TableCell>
                          <TableCell className={classes.tableRowPad}>Group</TableCell>
                          <TableCell className={classes.tableRowPad}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {accountGroupList.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className={classes.tableRowPad}>
                              {row.head_name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row.groups_name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {
                                 authAccessArr.includes('Delete Group-Retailer') &&  <IconButton
                                 style={{ padding: "0" }}
                                 onClick={(ev) => {
                                   ev.preventDefault();
                                   ev.stopPropagation();
                                   setDeleteModal(true);
                                   setDeleteData(row)
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
              }
              {
                tabView === 0 && <div className="mt-5">
                  <Paper className={clsx(classes.tabroot, "table-responsive createaccount-tbel-blg createaccount-tbel-dv")}>
                    <MaUTable className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>Ledger</TableCell>
                          <TableCell className={classes.tableRowPad}>Main Head</TableCell>
                          <TableCell className={classes.tableRowPad}>Group</TableCell>
                          <TableCell className={classes.tableRowPad}>Action</TableCell>
                          {/* <TableCell className={classes.tableRowPad}>Sub Group</TableCell>
                          <TableCell className={classes.tableRowPad}>Main Group</TableCell> */}
                          {/* <TableCell className={classes.tableRowPad}>Action</TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {accountList.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className={classes.tableRowPad}>
                              {row.ladger_name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row.head_name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row.groups_name}
                            </TableCell>
                            {/* <TableCell className={classes.tableRowPad}>
                            {row.main_group_name}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {row.sub_group_name}
                          </TableCell> */}
                            <TableCell className={classes.tableRowPad}>
                              {
                                  authAccessArr.includes('View Ledger-Retailer') &&   <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    editHandler(row, true);
                                  }}
                                >
                                  <Icon className="mr-8 view-icone">
                                    <img src={Icones.view} alt="" />
                                  </Icon>
                                </IconButton>
                                  }
                                  {
                                  authAccessArr.includes('Add /Edit Ledger-Retailer') &&  <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    editHandler(row, false);
                                  }}
                                >
                                  <Icon className="mr-8 edit-icone">
                                    <img src={Icones.edit} alt="" />
                                  </Icon>
                                </IconButton>
                              }
                              {
                                  authAccessArr.includes('Delete Ledger-Retailer') && <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    setDeleteModal(true);
                                    setDeleteData(row)
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
              }
            </div>

            <Dialog
              open={deleteModal}
              onClose={handleDeleteClose}
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
                  onClick={handleDeleteClose}
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
                  onClick={handleDeleteClose}
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

export default CreateAccountRetailer;
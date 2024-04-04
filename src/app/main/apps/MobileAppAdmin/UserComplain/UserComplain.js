import React, { useState, useEffect, useLayoutEffect } from "react";
import { TablePagination, TextField, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import BreadcrumbsHelper from "../../../BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import { makeStyles,useTheme } from "@material-ui/core/styles";
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
import Loader from '../../../Loader/Loader';
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";
import useSortableData from "../../Stock/Components/useSortableData";
import ViewStatus from "./EditUserComplain/ViewStatus";

import Select, { createFilter } from "react-select";
import History from "@history";


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
        whiteSpace: 'nowrap',
        width: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }
}));

const UserComplain = (props) => {

    const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
    const [openFlag, setOpenFlag] = useState(false);
    const theme = useTheme();

    const [apiData, setApiData] = useState([]);
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [count, setCount] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searching, setSearching] = useState(false);
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const roleOfUser = localStorage.getItem("permission")
    ? JSON.parse(localStorage.getItem("permission"))
    : null;
    const [authAccessArr, setAuthAccessArr] = useState([]);
    useEffect(() => {
        let arr = roleOfUser
            ? roleOfUser["Mobile-app Admin"]["User Complain"]
              ? roleOfUser["Mobile-app Admin"]["User Complain"]
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

    const [searchData, setSearchData] = useState({
        complain_number: "",
        full_name: "",
        mobile_number: "",
        created_at:"",
        status:"",
        
      });
       const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState, [name]: value
    })
    );
    setSearching(true);
  }
  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };
  const statusArr = [
    {value: 1 , label: "New complain"},
    {value : 2, label : "Pending"},
    {value: 3 , label: "In-process"},
    {value : 4, label : "Solved"},
    {value: 5 , label: "Cancelled by Party"},
    {value : 6, label : "Cancelled by Company"}
  ]
  const handleSearchStatusData = (value) => {
    setSearchData((prevState)=>({
      ...prevState , ['status'] : value ? value : ''
    }))
    setSearching(true);
  }
  useLayoutEffect(() =>{
    console.log(props,"999999999999")
    setSearching(false);
    const timeout = setTimeout(() => {
        if (searchData && props.location && props.location.state) {
          const preDta = props.location.state
          setApiData(preDta.apiData)
          setPage(preDta.page)
          setCount(preDta.count)
          setSearchData(preDta.search)
          if(preDta.page === 0){
            setApiData([])
            setCount(0)
            setPage(0)
            setFilters();
          }
          History.replace("/dashboard/mobappadmin/usercomplain" , null)
        }else{
          console.log("in5555")
          setApiData([])
          setCount(0)
          setPage(0)
          setFilters();
        }
    }, 800);
    return () => {
        clearTimeout(timeout);
    };
  },[])
  useEffect(()=>{
    if(props.location && props.location.state && props.location.state.iseditView){
      if(apiData.length > 0 && page && count){
        console.log("inn99999999")
        setFilters(Number(page + 1));
      }
    }
  },[apiData,page,count])
  
  useEffect(() =>{
    const timeout = setTimeout(() => {
        if (searchData && searching) {
          console.log("innnnppppppppppppp")
          setApiData([])
          setCount(0)
          setPage(0)
          setFilters();
        } 
    }, 800);
    return () => {
        clearTimeout(timeout);
    };
  },[searchData])
  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage +1) * 10 > apiData.length) {
        setFilters(Number(newPage + 1))
    }
  }
  
  function setFilters(tempPageNo) {
  
    let url = "api/userComplain/listing?"
  
    if (page !== "") {
        if (!tempPageNo) {
            url = url + "page=" + 1
  
        } else {
            url = url + "page=" + tempPageNo
        }
    }
    const serchingData = props.location && props.location.state ? props.location.state.search : searchData
  
  
  
    if(serchingData.complain_number !== "" ){
        url = url + "&complain_number=" + serchingData.complain_number
    }
    if(serchingData.full_name !== "" ){
        url = url + "&full_name=" + serchingData.full_name
    }
    if(serchingData.mobile_number !== "" ){
        url = url + "&mobile_number=" + serchingData.mobile_number
    }
    if(serchingData.created_at !== "" ){
        url = url + "&date=" + moment(serchingData.created_at).format("DD-MM-YYYY")
    }
    if(serchingData.status !== "" ){
        url = url + "&status=" + serchingData.status.value
    }
  
  
    if (!tempPageNo) {
        getComplainUser(url);
    } else {
         if (count > apiData.length) {
            getComplainUser(url);
        } 
    }
  }
  
  function editHandler(row) {
      console.log("editHandler", row);
      
      props.history.push("/dashboard/mobappadmin/usercomplain/editusercomplain", 
      {
          row: row,
            isViewOnly: false,
            isEdit: true,
            page : page,
            search : searchData,
            count : count,
            apiData : apiData
        });

    }

    

    function handleClose() {
        setSelectedIdForDelete("");
        setOpen(false);
        setOpenFlag(false)
        
    }
    
    function callDeleteApi() {
        axios
            .delete(Config.getCommonUrl() + "api/newsandupdates/" + selectedIdForDelete)
            .then(function (response) {
                console.log(response);
                setOpen(false);
                if (response.data.success === true) {
                    // getNewsAndUpdates();
                    dispatch(Actions.showMessage({ message: response.data.message }));
                    setSelectedIdForDelete("");
                } else {
                    dispatch(Actions.showMessage({ message: response.data.message }));
                }
            })
            .catch((error) => {
                // console.log(error);
                setOpen(false);
                handleError(error, dispatch, { api: "api/newsandupdates/" + selectedIdForDelete })
                
            });
    }

    useEffect(() => {
        if (loading) {
            setTimeout(() => setLoading(false), 7000);
        }
    }, [loading]);
    
    useEffect(() => {
        NavbarSetting('Mobile-app Admin', dispatch)
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        console.log("useEffect");
        // getComplainUser();
        // getting list of ALL clients
        //eslint-disable-next-line
    }, [dispatch]);

    function getComplainUser(url) {
        setLoading(true);
        axios
            .get(Config.getCommonUrl() + url)
            .then(function (response) {
                if (response.data.success === true) {
                    console.log(response);
                    setCount(Number(response.data.count))
                    let tempData = response.data.data;
                    // setApiData(tempData)
                    if (apiData.length === 0) {
                        setApiData(tempData)
                        } else {
                          console.log("innnnnnnnnnn")
                        setApiData((apiData)=>[...apiData, ...tempData]);
                        }
                    setLoading(false);
                } else {
                    dispatch(Actions.showMessage({ message: response.data.message }));
                }
            })
            .catch(function (error) {
                setLoading(false);
                handleError(error, dispatch, { api: url })
                
            });
    }

    const handleModalClose = () => {
        setOpenFlag(false)  
        
    }
    const { items, requestSort, sortConfig } = useSortableData(apiData);
    return (
        <div className={clsx(classes.root, props.className, "w-full")}>
            <FuseAnimate animation="transition.slideUpIn" delay={200}>
                <div className="flex flex-col md:flex-row container">
                    <div className="flex flex-1 flex-col min-w-0">
                        <Grid
                            container
                            alignItems="center"
                        >
                            <Grid item xs={8} sm={8} md={8} key="1">
                                <FuseAnimate delay={300}>
                                    <Typography className="p-16 pb-8 text-18 font-700">
                                        User Complain
                                    </Typography>
                                </FuseAnimate>

                                {/* <BreadcrumbsHelper /> */}
                            </Grid>

                            {/* <Grid
                                item
                                xs={4}
                                sm={4}
                                md={4}
                                key="2"
                                style={{ textAlign: "right", paddingRight: 16 }}
                            >
                                <Link
                                    // to="#"
                                    // to="/dashboard/mobappadmin/addnewsupdate"
                                    to={{
                                        pathname: '/dashboard/mobappadmin/usercomplain/editusercomplain',
                                       
                                    }}
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
                                        Add News & Updates
                                    </Button>
                                </Link>
                            </Grid> */}
                        </Grid>

                        {/* <div style={{ textAlign: "right" }} className="mr-16">
              <label style={{ display: "contents" }}> Search : </label>
              <Search
                className={classes.searchBox}
                onSearch={onSearchHandler}
              />
            </div> */}
                        {loading && <Loader />}
                        <div className="m-16 mt-56 department-tbl-mt-dv" >
                            <Paper className={classes.tabroot} id="department-tbl-fix ">
                                <div className="table-responsive new-add_stock_group_tbel" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                                <TablePagination
                    labelRowsPerPage=''
                    component="div"
                    count={count}
                    rowsPerPage={10}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                     onPageChange={handleChangePage}
                />
                                    <Table className={classes.table}>
                                        <TableHead>
                                            <TableRow>
                                            <TableCell className={classes.tableRowPad}>
                                            Complain Number
                                                </TableCell>
                                                <TableCell className={classes.tableRowPad}>
                                                User Name
                                                </TableCell>
                                                <TableCell className={classes.tableRowPad} align="left">
                                                Mobile Number
                                                </TableCell>
                                                <TableCell className={classes.tableRowPad} align="left">
                                                Created date 
                                                </TableCell>
                                                <TableCell className={classes.tableRowPad} align="left">
                                                Status 
                                                </TableCell>
                                                <TableCell className={classes.tableRowPad} align="left">
                                                Action 
                                                </TableCell>
                                            </TableRow>
                                           <TableRow>
                                           <TableCell className={classes.tableRowPad}>
                          <TextField  inputProps={{ className: "all-Search-box-data" }} name="complain_number" onChange={handleSearchData} value={searchData.complain_number}/>

                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <TextField  inputProps={{ className: "all-Search-box-data" }} name="full_name" onChange={handleSearchData} value={searchData.full_name}/>

                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <TextField  inputProps={{ className: "all-Search-box-data" }} name="mobile_number" onChange={handleSearchData} value={searchData.mobile_number}/>

                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <TextField name="created_at" type="date" inputProps={{  className: "all-Search-box-data" ,
                              max: moment().format("YYYY-MM-DD"),
                            }} onChange={handleSearchData} value={searchData.created_at}/>

                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                        <Select
                            styles={{ selectStyles }}
                            options={statusArr.map((group) => ({
                                value: group.value,
                                label: group.label,
                            }))}
                            isClearable
                            value={searchData.status}
                            filterOption={createFilter({ ignoreAccents: false })}
                            onChange={handleSearchStatusData}
                            />

                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          
                        </TableCell>
                                      
                    </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {items
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => (
                                                    <TableRow key={row.id}>
                                                        <TableCell className={classes.tableRowPad}>
                                                            {row.complain_number}
                                                        </TableCell>
                                                        <TableCell className={classes.tableRowPad}>
                                                            {row.userMasterDetails.full_name}
                                                        </TableCell>
                                                        <TableCell className={classes.tableRowPad}>
                                                            {row.userMasterDetails.mobile_number}
                                                        </TableCell>
                                                        <TableCell className={classes.tableRowPad}>
                                                        {moment.utc(row.created_at).local().format("DD-MM-YYYY")}
                                                        </TableCell>
                                                        <TableCell className={classes.tableRowPad}>
                                                            {row.status}
                                                        </TableCell>
                                                        <TableCell className={classes.tableRowPad}>
                                                          
                                                            {console.log(row.status)}
                                                            {authAccessArr.includes('View User Complain') &&
                                                                (row.status !== "Solved" && row.status !== "Cancelled by Company"&& row.status !== "Cancelled by Party") ? (
                                                                <IconButton
                                                                    style={{ padding: "0" }}
                                                                    onClick={(ev) => {
                                                                        ev.preventDefault();
                                                                        ev.stopPropagation();
                                                                        editHandler(row);
                                                                    }}
                                                                >
                                                                    <Icon className="mr-8" style={{ color: "dodgerblue" }}>
                                                                        create
                                                                    </Icon>
                                                                </IconButton>
                                                            ) : (
                                                                <IconButton
                                                                    style={{ padding: "0" }}
                                                                    onClick={(ev) => {
                                                                        ev.preventDefault();
                                                                        ev.stopPropagation();
                                                                        editHandler(row);
                                                                    }}
                                                                >
                                                                    <Icon className="mr-8" style={{ color: "dodgerblue" }}>
                                                                        visibility
                                                                    </Icon>
                                                                </IconButton>
                                                            )
                                                            }

                                                            </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                    <TablePagination
                    labelRowsPerPage=''
                    component="div"
                    count={count}
                    rowsPerPage={10}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                     onPageChange={handleChangePage}
                />
                                </div>
                            </Paper>
                        </div>
                        {openFlag && <ViewStatus modalColsed={handleClose}  handleModalClose={handleModalClose}  />}
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Alert!!!"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Are you sure you want to delete this record ?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleClose} color="primary">
                                    Cancel
                                </Button>
                                <Button onClick={callDeleteApi} color="primary" autoFocus>
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

export default UserComplain;

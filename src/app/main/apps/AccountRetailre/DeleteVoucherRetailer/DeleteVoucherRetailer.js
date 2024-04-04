import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { Icon, IconButton } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import { TextField } from "@material-ui/core";
import Loader from '../../../Loader/Loader';
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";
import ViewPopupRetailer from "app/main/apps/SalesPurchaseRetailer/ViewPopupRetailer/ViewPopupRetailer";
import moment from 'moment';
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100px"
    },
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
        color: "white",
    },
      filterBtn: {
    textTransform: "none",
    backgroundColor: "#415BD4",
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
    hoverClass: {
        // backgroundColor: "#fff",
        color: "#1e90ff",
        "&:hover": {
          // backgroundColor: "#999",
          cursor: "pointer",
        },
      },
}));

const DeleteVoucherRetailer =  (props) => {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState([]);
    const [searchData, setSearchData] = useState({
        vnum: "",
        deluser:"",
        deldate:"",
        vdate:"",
        vtype:"",
        createuser :"",
        delres:""
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [row, setRow] = useState("");
    const classes = useStyles();
    const [startDate, setStartDate] = useState(moment().startOf("month").format("YYYY-MM-DD"));
    const [startDateErr, setStartDateErr] = useState("");
    const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
    const [endDateErr, setEndDateErr] = useState("");

    useEffect(() => {
        NavbarSetting('Accounts-Retailer', dispatch)
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        getDeletedVoucherList()
    },[])

    function getDeletedVoucherList(data){
        if(data){
            var api = `retailerProduct/api/voucherentry/delete/entry/details`
        }else{
            var api = `retailerProduct/api/voucherentry/delete/entry/details?start=${startDate}&end=${endDate}`
        }
        setLoading(true);
        axios.get(Config.getCommonUrl() + api)
        .then((response) => {
            console.log(response);
        setLoading(false);
            if(response.data.success){
                let dataset = response.data.data.map((x)=>{
                      return {
                        ... x,
                        delete_remark:x.delete_remark ?x.delete_remark:"-",
                        deleted_by:x.deleted_by ?x.deleted_by:"-",
                        created_by:x.created_by ?x.created_by:"-",

                      }
                })
                setApiData(dataset)
            
            }else{
                setApiData([])
                dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
            }
        })
        .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: `api` })
        })
    }

    function getcsvData(){
        if(validateStartDate() && validateEndDate() && validateBothDate()){
            setLoading(true);
            axios.get(Config.getCommonUrl() + `retailerProduct/api/voucherentry/delete/entry/export?start=${startDate}&end=${endDate}`)
            .then((response) => {
                console.log(response);
                setLoading(false);
                if(response.data.success){
                    let downloadUrl = response.data.export_url;
                    window.open(downloadUrl);
                }else{
                    dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
                }
            })
                .catch((error) => {
                setLoading(false);
                handleError(error, dispatch, { api: `retailerProduct/api/voucherentry/delete/entry/export?start=${startDate}&end=${endDate}` })
            })
        }
    }

    const handleSearchData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        // const searchItem = searchData;
        setSearchData((prevState) => ({
            ...prevState, [name]: value
        })
        );
    }

    const handleLinkClick = (element) => {
        setModalOpen(true);
        setRow(element);
      };

      const handleMOdalClose = () => {
        setModalOpen(false);
        setRow("");
      };

      const ResetData = () => {
        if (startDate || endDate) {
          setStartDate("")
          setEndDate("")
          getDeletedVoucherList("all");
        }
      }

      function validateStartDate() {
        if (startDate === "") {
          setStartDateErr("Please Enter Start Date");
          return false;
        }
        return true;
      }
    
      function validateEndDate() {
        if (endDate === "") {
          setEndDateErr("Please Enter End Date");
          return false;
        }
        return true;
      }
    
      function validateBothDate() {
        let startVal = moment(startDate).format("YYYY-MM-DD"); //new Date(value);
        let endVal = moment(endDate).format("YYYY-MM-DD"); //new Date(value);
        if (startVal > endVal) {
          setStartDateErr("Please Enter valid Date");
          setEndDateErr("Please Enter valid Date");
          return false;
        }
        return true;
      }

      const callFilterApi = () => {
        if (validateStartDate() && validateEndDate() && validateBothDate()) {
            getDeletedVoucherList()
          }
      }

      function handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        if (name === "startDate") {
          setStartDate(value);
          setStartDateErr("");
        } else if (name === "endDate") {
          setEndDate(value);
          setEndDateErr("");
        }
      }

    return (
        <div className={clsx(classes.root, props.className, "w-full")}>
            <FuseAnimate animation="transition.slideUpIn" delay={200}>
                <div className="flex flex-col md:flex-row container">
                <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
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
                                        Deleted Voucher
                                    </Typography>
                                </FuseAnimate>

                                {/* <BreadcrumbsHelper /> */}
                            </Grid>
                            </Grid>
                       <div className="main-div-alll ">
                            
                            <Grid  container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0, width: "100%" }}>
                               
                <Grid item lg={3} md={4} sm={12} xs={12} style={{ padding: 6 }}>
                                    <p>From date</p>
                                    <TextField
                                    // label="From Date"
                                    name="startDate"
                                    value={startDate}
                                    error={startDateErr.length > 0 ? true : false}
                                    helperText={startDateErr}
                                    type="date"
                                    onChange={(e) => handleInputChange(e)}
                                    onKeyDown={(e => e.preventDefault())}
                                    variant="outlined"
                                    fullWidth
                                    format="yyyy/MM/dd"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    />
                                </Grid>
                <Grid item lg={3} md={4} sm={12} xs={12} style={{ padding: 6 }}>
                                    <p>To date</p>
                                    <TextField
                                    // className="pl-5"
                                    // label="To Date"
                                    name="endDate"
                                    value={endDate}
                                    error={endDateErr.length > 0 ? true : false}
                                    helperText={endDateErr}
                                    type="date"
                                    onChange={(e) => handleInputChange(e)}
                                    onKeyDown={(e => e.preventDefault())}
                                    variant="outlined"
                                    fullWidth
                                    format="yyyy/MM/dd"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    />
                                </Grid>
                <Grid item lg={3} md={4} sm={12} xs={12}                   style={{ alignItems: "end", display: "flex" }}
>
                                    <Button
                                    variant="contained" 
                                                        className={classes.filterBtn}

                                    size="small"
                                    onClick={callFilterApi}
                                    >
                                    Filter
                                    </Button>
                                    <Button
                                    variant="contained"
                                                        className={clsx(classes.filterBtn, "ml-16")}

                                    size="small"
                                    onClick={ResetData}
                                    >
                                    Reset
                                    </Button>
                                    <IconButton
                                    style={{ padding: "0"}}
                                    className="ml-2"
                                    onClick={getcsvData}
                                    >
                                   <Icon className="mr-8 download-icone" style={{ color: "dodgerblue" }}>
                                                        <img src={Icones.download_green} alt="" />
                                                    </Icon>
                                    </IconButton>
                                </Grid>
                               

                            </Grid>
                          
                        

                        {loading && <Loader />}
                        <div className=" mt-56 department-tbl-mt-dv">
                            <Paper className={classes.tabroot} id="department-tbl-fix ">
                                <div className="table-responsive new-add_stock_group_tbel" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                                    <Table className={classes.table}>
                                        <TableHead>
                                            <TableRow>
                                            <TableCell className={classes.tableRowPad} align="left">
                                                    Voucher Date
                                                </TableCell>
                                                <TableCell className={classes.tableRowPad} align="left">
                                                    Voucher Number
                                                </TableCell>
                                                <TableCell className={classes.tableRowPad} align="left">
                                                    Voucher Type
                                                </TableCell>
                                                <TableCell className={classes.tableRowPad} align="left">
                                                    Created By
                                                </TableCell>
                                                <TableCell className={classes.tableRowPad} align="left">
                                                    Deleted By
                                                </TableCell>
                                                <TableCell className={classes.tableRowPad} align="left">
                                                    Deleted Date
                                                </TableCell>
                                                <TableCell className={classes.tableRowPad} align="left">
                                                    Deleted Reason
                                                </TableCell>
                                                <TableCell className={classes.tableRowPad} align="left">
                                                    Action
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                            <TableCell className={classes.tableRowPad}>
                                                <TextField
                                                name="vdate"
                                                onChange={handleSearchData}
                                                inputProps={{ className: "all-Search-box-data" }}
                                                />
                                            </TableCell>
                                            <TableCell className={classes.tableRowPad}>
                                                <TextField
                                                name="vnum"
                                                onChange={handleSearchData}
                                                inputProps={{ className: "all-Search-box-data" }}
                                                />
                                            </TableCell>
                                            <TableCell className={classes.tableRowPad}>
                                            <TextField
                                                name="vtype"
                                                onChange={handleSearchData}
                                                inputProps={{ className: "all-Search-box-data" }}
                                                />
                                            </TableCell>
                                            <TableCell className={classes.tableRowPad}>
                                                <TextField
                                                name="createuser"
                                                onChange={handleSearchData}
                                                inputProps={{ className: "all-Search-box-data" }}
                                                />
                                            </TableCell>
                                            <TableCell className={classes.tableRowPad}>
                                                <TextField
                                                name="deluser"
                                                onChange={handleSearchData}
                                                inputProps={{ className: "all-Search-box-data" }}
                                                />
                                            </TableCell>
                                            <TableCell className={classes.tableRowPad}>
                                                <TextField
                                                name="deldate"
                                                onChange={handleSearchData}
                                                inputProps={{ className: "all-Search-box-data" }}
                                                />
                                            </TableCell>
                                            <TableCell className={classes.tableRowPad}>
                                                <TextField
                                                name="delres"
                                                onChange={handleSearchData}
                                                inputProps={{ className: "all-Search-box-data" }}
                                                />
                                            </TableCell>
                                                <TableCell
                                                className={classes.tableRowPad}
                                                align="left"
                                            ></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {apiData
                                                .filter((temp) => {
                                                    if (searchData.vnum) {//&& temp.category_name
                                                        return temp.voucher_no
                                                            .toLowerCase()
                                                            .includes(searchData.vnum.toLowerCase())
                                                    }else if (searchData.vtype) {
                                                        return temp.voucher_type
                                                            .toLowerCase()
                                                            .includes(searchData.vtype.toLowerCase())
                                                    } else if (searchData.deluser) {
                                                        return temp.deleted_by
                                                            .toLowerCase()
                                                            .includes(searchData.deluser.toLowerCase())
                                                    } else if (searchData.deldate) {
                                                        return moment.utc(temp.deleted_at).local().format("DD-MM-YYYY")
                                                            .toLowerCase()
                                                            .includes(searchData.deldate.toLowerCase())
                                                    } else if (searchData.delres) {
                                                        return temp.delete_remark
                                                            .toLowerCase()
                                                            .includes(searchData.delres.toLowerCase())
                                                    }else if (searchData.createuser) {
                                                        return temp.created_by
                                                            .toLowerCase()
                                                            .includes(searchData.createuser.toLowerCase())
                                                    }else if (searchData.vdate) {
                                                        return temp.voucher_date
                                                            .toLowerCase()
                                                            .includes(searchData.vdate.toLowerCase())
                                                    }else {
                                                        return temp
                                                    }
                                                })
                                                .map((row) => (
                                                    <TableRow key={row.flag_id}>
                                                        <TableCell align="left" className={classes.tableRowPad} >
                                                            {moment.utc(row.voucher_date).local().format("DD-MM-YYYY")}
                                                        </TableCell>
                                                        <TableCell align="left" className={clsx(
                                                                classes.tableRowPad,
                                                                classes.hoverClass
                                                              )}
                                                             onClick={() => handleLinkClick(row)}
                                                        >
                                                            {row.voucher_no}
                                                        </TableCell>
                                                        <TableCell
                                                            align="left"
                                                            className={classes.tableRowPad}
                                                        >
                                                            {row.voucher_type}
                                                        </TableCell>
                                                        <TableCell
                                                            align="left"
                                                            className={classes.tableRowPad}
                                                        >
                                                            {row.created_by}
                                                        </TableCell>
                                                        <TableCell
                                                            align="left"
                                                            className={classes.tableRowPad}
                                                        >
                                                            {row.deleted_by}
                                                        </TableCell>
                                                        <TableCell
                                                            align="left"
                                                            className={classes.tableRowPad}
                                                        >
                                                            {moment.utc(row.deleted_at).local().format("DD-MM-YYYY")}
                                                        </TableCell>   <TableCell
                                                            align="left"
                                                            className={classes.tableRowPad}
                                                        >
                                                            {row.delete_remark}
                                                        </TableCell>
                                                        <TableCell className={classes.tableRowPad}>
                                                            <IconButton
                                                                style={{ padding: "0" }}
                                                                onClick={(ev) => {
                                                                    ev.preventDefault();
                                                                    ev.stopPropagation();
                                                                    handleLinkClick(row);
                                                                }}
                                                            >
                                                                <Icon className="mr-8 view-icone">
                                  <img src={Icones.view} alt="" />
                                </Icon>
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </div>
                                {modalOpen && <ViewPopupRetailer rowData={row} modalColsed={handleMOdalClose} fromReport="Accounts-Retailer" forDeletedVoucher={true} />}
                            </Paper>
                        </div>
                        </div>
                    </div>
                </div>
            </FuseAnimate>
        </div>
    );
}

export default DeleteVoucherRetailer;
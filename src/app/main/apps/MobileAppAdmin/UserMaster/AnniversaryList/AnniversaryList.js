import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import History from "@history";
import Loader from "../../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100px",
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
    bolderName: {
        fontWeight: 700,
    },
}));

const AnniversaryList = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [future, setFuture] = useState([]);
    const [current, setCurrent] = useState([]);
    const [past, setPast] = useState([]);

    useEffect(() => {
        NavbarSetting("Mobile-app Admin", dispatch);
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (loading) {
            setTimeout(() => setLoading(false), 7000);
        }
    }, [loading]);

    useEffect(() => {
        getAnniversaryData();
        //eslint-disable-next-line
    }, [dispatch]);

    function getAnniversaryData() {
        setLoading(true);
        axios
            .get(Config.getCommonUrl() + "api/usermaster/user/annivessary")
            .then(function (response) {
                if (response.data.success === true) {
                    console.log(response);
                    let tempFuture = response.data.data?.response?.userFuture;
                    let tempCurrent = response.data.data?.response?.userCurrent;
                    let tempPast = response.data.data?.response?.userPast;

                    setCurrent(tempCurrent);
                    setFuture(tempFuture);
                    setPast(tempPast);
                    setLoading(false);
                } else {
                    dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
                }
            })
            .catch(function (error) {
                setLoading(false);
                handleError(error, dispatch, { api: "api/usermaster/user/annivessary" });
            });
    }

    return (
        <div className={clsx(classes.root, props.className, "w-full")}>
            <FuseAnimate animation="transition.slideUpIn" delay={200}>
                <div className="flex flex-col md:flex-row container">
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
                                    {/* <Typography className="p-16 pb-8 text-18 font-700"> */}
                                    <Typography className="pl-28 pt-16 text-18 font-700">

                                        Anniversary List
                                    </Typography>
                                </FuseAnimate>

                                {/* <BreadcrumbsHelper /> */}
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={6}
                                key="2"
                                style={{ textAlign: "right" }}
                            >
                                <div className="btn-back">
                                    <Button
                                        id="btn-back"
                                        size="small"
                                        onClick={(event) => {
                                            History.goBack();
                                        }}
                                    >
                                          <img
                                            className="back_arrow"
                                            src={Icones.arrow_left_pagination}
                                            alt=""/>
                  
                                        Back
                                    </Button>
                                </div>
                            </Grid>

                            {/* <Grid
                                item
                                xs={12}
                                sm={6}
                                md={6}
                                key="2"
                                style={{ textAlign: "right" }}
                            >
                                <Button
                                    variant="contained"
                                    className={classes.button}
                                    size="small"
                                    onClick={(event) => {
                                        History.goBack();
                                    }}
                                >
                                    Back
                                </Button>
                            </Grid> */}
                        </Grid>
                        {loading && <Loader />}
                        <div className="main-div-alll">
                            <div
                                // className="m-16 mt-56 department-tbl-mt-dv"
                                className="department-tbl-mt-dv"
                                style={{ marginBottom: "8%" }}
                            >
                                {/* <Paper className={classes.tabroot} id="department-tbl-fix "> */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Grid item xs="auto">
                                            <h3>Today:</h3>
                                        </Grid>
                                        <Grid item xs="auto">
                                            <div className="table-responsive new-add_stock_group_tbel ">
                                                <Table className={classes.table}>
                                                    <TableHead>
                                                        <TableRow>
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
                                                                Mobile No
                                                            </TableCell>
                                                            <TableCell
                                                                className={classes.tableRowPad}
                                                                align="left"
                                                            >
                                                                User Type
                                                            </TableCell>
                                                            <TableCell
                                                                className={classes.tableRowPad}
                                                                align="left"
                                                            >
                                                                Company
                                                            </TableCell>
                                                            <TableCell
                                                                className={classes.tableRowPad}
                                                                align="left"
                                                            >
                                                                Date of Anniversary
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {current.map((row) => (
                                                            <TableRow key={row.id}>
                                                                <TableCell
                                                                    align="left"
                                                                    className={clsx(classes.tableRowPad)}
                                                                >
                                                                    {row.full_name}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="left"
                                                                    className={classes.tableRowPad}
                                                                >
                                                                    {/* mobile_number */}
                                                                    {row.mobile_number}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="left"
                                                                    className={classes.tableRowPad}
                                                                >
                                                                    {/* userType */}
                                                                    {row.type_name}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="left"
                                                                    className={classes.tableRowPad}
                                                                >
                                                                    {/* Company */}
                                                                    {row.company_name}
                                                                </TableCell>

                                                                <TableCell
                                                                    align="left"
                                                                    className={classes.tableRowPad}
                                                                >
                                                                    {/* date_of_anniversary */}
                                                                    {moment(row.date_of_anniversary).format("DD-MM-YYYY")}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Grid item xs="auto">
                                            <h3>Future:</h3>
                                        </Grid>
                                        <Grid item xs="auto">
                                            <div className="table-responsive new-add_stock_group_tbel ">
                                                <Table className={classes.table}>
                                                    <TableHead>
                                                        <TableRow>
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
                                                                Mobile No
                                                            </TableCell>
                                                            <TableCell
                                                                className={classes.tableRowPad}
                                                                align="left"
                                                            >
                                                                User Type
                                                            </TableCell>
                                                            <TableCell
                                                                className={classes.tableRowPad}
                                                                align="left"
                                                            >
                                                                Company
                                                            </TableCell>
                                                            <TableCell
                                                                className={classes.tableRowPad}
                                                                align="left"
                                                            >
                                                                Date of Anniversary
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {future.map((row) => (
                                                            <TableRow key={row.id}>
                                                                <TableCell
                                                                    align="left"
                                                                    className={clsx(classes.tableRowPad)}
                                                                >
                                                                    {row.full_name}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="left"
                                                                    className={classes.tableRowPad}
                                                                >
                                                                    {/* mobile_number */}
                                                                    {row.mobile_number}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="left"
                                                                    className={classes.tableRowPad}
                                                                >
                                                                    {/* userType */}
                                                                    {row.type_name}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="left"
                                                                    className={classes.tableRowPad}
                                                                >
                                                                    {/* Company */}
                                                                    {row.company_name}
                                                                </TableCell>

                                                                <TableCell
                                                                    align="left"
                                                                    className={classes.tableRowPad}
                                                                >
                                                                    {/* date_of_anniversary */}
                                                                    {moment(row.date_of_anniversary).format("DD-MM-YYYY")}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Grid item xs="auto">
                                            <h3>Past:</h3>
                                        </Grid>
                                        <Grid item xs="auto">
                                            <div className="table-responsive new-add_stock_group_tbel ">
                                                <Table className={classes.table}>
                                                    <TableHead>
                                                        <TableRow>
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
                                                                Mobile No
                                                            </TableCell>
                                                            <TableCell
                                                                className={classes.tableRowPad}
                                                                align="left"
                                                            >
                                                                User Type
                                                            </TableCell>
                                                            <TableCell
                                                                className={classes.tableRowPad}
                                                                align="left"
                                                            >
                                                                Company
                                                            </TableCell>
                                                            <TableCell
                                                                className={classes.tableRowPad}
                                                                align="left"
                                                            >
                                                                Date of Anniversary
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {past.map((row) => (
                                                            <TableRow key={row.id}>
                                                                <TableCell
                                                                    align="left"
                                                                    className={clsx(classes.tableRowPad)}
                                                                >
                                                                    {row.full_name}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="left"
                                                                    className={classes.tableRowPad}
                                                                >
                                                                    {/* mobile_number */}
                                                                    {row.mobile_number}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="left"
                                                                    className={classes.tableRowPad}
                                                                >
                                                                    {/* userType */}
                                                                    {row.type_name}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="left"
                                                                    className={classes.tableRowPad}
                                                                >
                                                                    {/* Company */}
                                                                    {row.company_name}
                                                                </TableCell>

                                                                <TableCell
                                                                    align="left"
                                                                    className={classes.tableRowPad}
                                                                >
                                                                    {/* date_of_anniversary */}
                                                                    {moment(row.date_of_anniversary).format("DD-MM-YYYY")}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* </Paper> */}
                            </div>
                        </div>
                    </div>
                </div>
            </FuseAnimate>
        </div>
    );

}

export default AnniversaryList
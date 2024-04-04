import React, { useState, useEffect } from "react";
import { TablePagination, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import moment from "moment";
import Config from "app/fuse-configs/Config";

import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import History from "@history";
import { Icon, IconButton } from "@material-ui/core";
import Loader from "app/main/Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Icones from "assets/fornt-icons/Mainicons";

import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    // width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
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
  searchBox: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
}));

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


const LoginSubDetails = (props) => {
  const classes = useStyles();
  // const history = useHistory();
  const [modalStyle] = React.useState(getModalStyle);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  const dataToBeView = props.location.state;
  console.log(dataToBeView, "datat to be view...........");

  useEffect(() => {
    console.log("dataToBeView", dataToBeView);

    if (dataToBeView !== undefined) {
      setFilters(null,dataToBeView.id);
    }
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
  }, []);

  function getLoginSubDetails(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          let tempData = response.data.data;
          setCount(Number(response.data.count))

          if (apiData.length === 0) {
            console.log("if")
            setApiData(tempData);
       } else {
           // setApiData(...apiData, ...rows)
           setApiData((apiData) => [...apiData, ...tempData]);
           // console.log([...apiData, ...rows])
       }
          // setApiData(tempData);
          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: url,
        });
      });
  }

  function setFilters(tempPageNo,id) {

    let url = `api/usermaster/history/${id}`

  
    if (page !== "") {
        if (!tempPageNo) {
            url = url + "page=" + 1
  
        } else {
            url = url + "page=" + tempPageNo
        }
    }
  
    if (!tempPageNo) {
      console.log("innnnnnnnnnnnnnn444444")
      getLoginSubDetails(url);
    } else {
         if (count > apiData.length) {
          getLoginSubDetails(url);
        } 
    }
  }
  
  function handleChangePage(event, newPage) {
    // console.log(newPage , page)
    // console.log((newPage +1) * 10 > apiData.length)
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage +1) * 10 > apiData.length) {
        setFilters(Number(newPage + 1))
        // getRetailerMasterData()
    }
    // console.log(apiData.length);
}

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
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
                    Login Sub Details
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
                  <div className="btn-back mt-2">
                    <Button
                      id="btn-back"
                      size="small"
                      onClick={(event) => { dataToBeView && !dataToBeView.from ?
                        History.push('/dashboard/mobappadmin/logindetails', { page : dataToBeView.page , search : dataToBeView.search , apiData : dataToBeView.apiData, count : dataToBeView.count}):
                        dataToBeView && dataToBeView.from === "/dashboard/mobappadmin/crm/editcrm" ? 
                        History.push('/dashboard/mobappadmin/crm/editcrm',{modalTab:dataToBeView.modalTab,
                          propsData:dataToBeView.propsData}) 
                        : History.goBack()
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
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll ">
              <Grid
                className="department-main-dv"
                container
                spacing={12}
                alignItems="stretch"
                style={{ fontSize: 16 }}
              >
                <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                  <span style={{ fontWeight: 700, marginRight: 10 }}>
                    {" "}
                    UserName:
                  </span>{" "}
                  {apiData[0]?.user?.full_name}
                </Grid>
              </Grid>
              <div>
                {/* <Grid item xs={8} sm={8} md={8} key="1" style={{ padding: 0 }}> */}

                <div className="mt-16 department-tbl-mt-dv">
                  <Paper className={classes.tabroot} id="department-tbl-fix ">
                    <div
                      className="table-responsive "
                      style={{ maxHeight: "calc(100vh - 200px)" }}
                    >
                       <TablePagination
                              labelRowsPerPage=''
                              component="div"
                              // count={apiData.length}
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
                              // onChangeRowsPerPage={handleChangeRowsPerPage}
                              />
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Device Type
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Device Brand
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Device Model
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Device Version
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Device Id
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              IP Address
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Login time
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Logout Time
                            </TableCell>

                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Total Login Time
                            </TableCell>

                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Location
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {apiData
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row, index) => (
                            <TableRow key={index}>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.device_type}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.device_brand}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.device_model}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.device_version}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.device_id}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.ip_address}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {moment
                                  .utc(row.login_time, "DD-MM-YYYY HH:mm:ss")
                                  .local()
                                  .format("DD-MM-YYYY HH:mm:ss ")}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {moment
                                  .utc(row.logout_time, "DD-MM-YYYY HH:mm:ss")
                                  .local()
                                  .format("DD-MM-YYYY HH:mm:ss")}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.total_login_time}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.latitude == 0 && row.longitude == 0 ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    -
                                  </div>
                                ) : (
                                  <Button
                                    variant="contained"
                                    size="small"
                                    id="btn-save"
                                    onClick={() =>
                                      window.open(
                                        `http://www.google.com/maps/place/${row.latitude},${row.longitude}`
                                      )
                                    }
                                  >
                                    Location
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <TablePagination
                              labelRowsPerPage=''
                              component="div"
                              // count={apiData.length}
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
                              // onChangeRowsPerPage={handleChangeRowsPerPage}
                          />
                    </div>
                  </Paper>
                </div>

                <div className="mb-56"></div>
                {/* </Grid> */}
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default LoginSubDetails;

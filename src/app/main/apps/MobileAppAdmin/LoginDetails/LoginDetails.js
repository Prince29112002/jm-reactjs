import React, { useState, useEffect } from "react";
import {
  Link,
  TablePagination,
  TextField,
  Typography,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
import Loader from "../../../Loader/Loader";
import moment from "moment";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import History from "@history";
import useSortableData from "../../Stock/Components/useSortableData";
import Icones from "assets/fornt-icons/Mainicons";
import Select, { createFilter } from "react-select";

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
}));


const LoginDetails = (props) => {
  const theme = useTheme();
  const [userDetails, setUserDetails] = useState([]);
  const [apiData, setApiData] = useState([]);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    user_name: "",
    counts: "",
    total_login_time: "",
    mobile_number:"",
    company_name:"",
    type_name:"",
  });

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };
  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState, [name]: value
    })
    );
  }
  const handleusertypeChange = (value) => {
    setSearchData((prevState)=>({
      ...prevState , ['type_name'] : value ? value : ''
    }))
    console.log(value);
  }
  const { items, requestSort, sortConfig } = useSortableData(userDetails);
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
    console.log("useEffect");
    // getUserDetails();
  }, [dispatch]);

  function viewHandler(row) {
    console.log("viewHandler", row);

    History.push("/dashboard/mobappadmin/loginsubdetails", {
      id: row.id,
      page: page,
      search: searchData,
      count: count,
      apiData: userDetails
      // isViewOnly: true/,
    });
  }
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchData && props.location && props.location.state) {
        const propsData = props.location.state
        setPage(propsData.page)
        setCount(propsData.count)
        setUserDetails(propsData.apiData)
        setSearchData(propsData.search)
        History.replace("/dashboard/mobappadmin/logindetails", null)
      } else {
        console.log("innnn2222")
        setUserDetails([])
        setCount(0)
        setPage(0)
        setFilters();
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchData])
  function getUserDetails(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then((res) => {
        if (res.data.success) {
          const temp = res.data.data;
          setCount(Number(res.data.count))
          if (userDetails.length === 0) {
            console.log("if")
            setUserDetails(temp);
          } else {
            setUserDetails((userDetails) => [...userDetails, ...temp]);
          }
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: url });
      });
  }
  function setFilters(tempPageNo) {

    let url = "api/usermaster/log/history?";
    if (page !== "") {
      if (!tempPageNo) {
        url = url + "page=" + 1;
      } else {
        url = url + "page=" + tempPageNo;
      }
    }
    if (searchData.user_name !== "") {
      url = url + "&full_name=" + searchData.user_name;
    }
    if (searchData.type_name !== "") {
      url = url + "&user_type=" + searchData.type_name.value;
    }
    if (searchData.company_name !== "") {
      url = url + "&company_name=" + searchData.company_name;
    }
    if (searchData.mobile_number !== "") {
      url = url + "&mobile_number=" + searchData.mobile_number;
    }
    if (searchData.counts !== "") {
      url = url + "&count=" + searchData.counts;
    }

    if (!tempPageNo) {
      getUserDetails(url);
    } else {
      if (count > userDetails.length) {
        getUserDetails(url);
      }
    }
  }
  function handleChangePage(event, newPage) {
    // console.log(newPage , page)
    // console.log((newPage +1) * 10 > apiData.length)
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 10 > userDetails.length) {
      setFilters(Number(newPage + 1))
      // getRetailerMasterData()
    }
    // console.log(apiData.length);
  }

  const usertypeArr = [
    { value: 1 , label: "Distributor"},
    { value : 2, label : "Overseas Distributors"},
    { value: 3, label: "Direct Retailers"},
    { value : 4, label : "Corporate Retailers"},
    { value : 6, label : "Retailer"}
  ]


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
                    Login Details
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
              ></Grid>
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll ">
              <div className="m-8 department-tbl-mt-dv">
                <Paper className={classes.tabroot} id="department-tbl-fix ">
                  <div
                    className="table-responsive new-add_stock_group_tbel"
                    style={{ maxHeight: "calc(100vh - 200px)" }}
                  >
                    <TablePagination
                      labelRowsPerPage=""
                      component="div"
                      // count={apiData.length}
                      count={count}
                      rowsPerPage={10}
                      page={page}
                      backIconButtonProps={{
                        "aria-label": "Previous Page",
                      }}
                      nextIconButtonProps={{
                        "aria-label": "Next Page",
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
                            User Name
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
                            Company Name
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Mobile Number
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Number Of Time Login
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
                            Action
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>
                            <TextField
                              inputProps={{ className: "all-Search-box-data" }}
                              name="user_name"
                              onChange={handleSearchData}
                              value={searchData.user_name} 
                              // inputProps={{
                              //   className:
                              //     "all-Search-box-data all-Search-box-data-input",
                              // }}
                            />
                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("user_name")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "user_name" &&
                                sortConfig.direction === "ascending" && (
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "#000" }}
                                  >
                                    {" "}
                                    arrow_downward{" "}
                                  </Icon>
                                )}
                              {sortConfig &&
                                sortConfig.key === "user_name" &&
                                sortConfig.direction === "descending" && (
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "#000" }}
                                  >
                                    {" "}
                                    arrow_upward{" "}
                                  </Icon>
                                )}
                            </IconButton>
                          </TableCell>

                          <TableCell className={classes.tableRowPad}>
                            <Select
                              inputProps={{
                                className: "all-Search-box-data ",
                              }}
                              styles={{ selectStyles }}
                              options={usertypeArr.map((group) => ({
                                value: group.value,
                                label: group.label,
                              }))}
                              isClearable
                              value={searchData.type_name}
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              onChange={handleusertypeChange}
                            />
                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("company_name")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "company_name" &&
                                sortConfig.direction === "ascending" && (
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "#000" }}
                                  >
                                    {" "}
                                    arrow_downward{" "}
                                  </Icon>
                                )}
                              {sortConfig &&
                                sortConfig.key === "company_name" &&
                                sortConfig.direction === "descending" && (
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "#000" }}
                                  >
                                    {" "}
                                    arrow_upward{" "}
                                  </Icon>
                                )}
                            </IconButton>
                          </TableCell>

                          <TableCell className={classes.tableRowPad}>
                            <TextField
                              inputProps={{
                                className: "all-Search-box-data ",
                              }}
                              name="company_name"
                              onChange={handleSearchData}
                              value={searchData.company_name}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("company_name")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "company_name" &&
                                sortConfig.direction === "ascending" && (
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "#000" }}
                                  >
                                    {" "}
                                    arrow_downward{" "}
                                  </Icon>
                                )}
                              {sortConfig &&
                                sortConfig.key === "company_name" &&
                                sortConfig.direction === "descending" && (
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "#000" }}
                                  >
                                    {" "}
                                    arrow_upward{" "}
                                  </Icon>
                                )}
                            </IconButton>
                          </TableCell>

                          <TableCell className={classes.tableRowPad}>
                            <TextField
                              inputProps={{
                                className: "all-Search-box-data ",
                              }}
                              name="mobile_number"
                              onChange={handleSearchData}
                              value={searchData.mobile_number}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("mobile_number")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "mobile_number" &&
                                sortConfig.direction === "ascending" && (
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "#000" }}
                                  >
                                    {" "}
                                    arrow_downward{" "}
                                  </Icon>
                                )}
                              {sortConfig &&
                                sortConfig.key === "mobile_number" &&
                                sortConfig.direction === "descending" && (
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "#000" }}
                                  >
                                    {" "}
                                    arrow_upward{" "}
                                  </Icon>
                                )}
                            </IconButton>
                          </TableCell>

                          <TableCell className={classes.tableRowPad}>
                            <TextField
                              name="counts"
                              onChange={handleSearchData}
                              inputProps={{
                                className: "all-Search-box-data ",
                              }}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("count")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "count" &&
                                sortConfig.direction === "ascending" && (
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "#000" }}
                                  >
                                    {" "}
                                    arrow_downward{" "}
                                  </Icon>
                                )}
                              {sortConfig &&
                                sortConfig.key === "count" &&
                                sortConfig.direction === "descending" && (
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "#000" }}
                                  >
                                    {" "}
                                    arrow_upward{" "}
                                  </Icon>
                                )}
                            </IconButton>
                          </TableCell>

                          {/* <TableCell className={classes.tableRowPad}>
                            <TextField
                              name="total_login_time"
                              onChange={handleSearchData}
                              inputProps={{
                                className: "all-Search-box-data",
                              }}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("total_login_time")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "total_login_time" &&
                                sortConfig.direction === "ascending" && (
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "#000" }}
                                  >
                                    {" "}
                                    arrow_downward{" "}
                                  </Icon>
                                )}
                              {sortConfig &&
                                sortConfig.key === "total_login_time" &&
                                sortConfig.direction === "descending" && (
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "#000" }}
                                  >
                                    {" "}
                                    arrow_upward{" "}
                                  </Icon>
                                )}
                            </IconButton>
                          </TableCell> */}

                          <TableCell className={classes.tableRowPad}></TableCell>
                          <TableCell className={classes.tableRowPad}></TableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {items
                          .filter((temp) => {
                            if (searchData.user_name) {
                              return temp.user_name
                                .toLowerCase()
                                .includes(searchData.user_name.toLowerCase());
                            } else if (searchData.type_name) {
                              return temp.type_name
                                .toLowerCase()
                                .includes(searchData.type_name.toLowerCase());
                            } else if (searchData.company_name) {
                              return temp.company_name
                                .toLowerCase()
                                .includes(
                                  searchData.company_name.toLowerCase()
                                );
                            } else if (searchData.mobile_number) {
                              return temp.mobile_number
                                .toLowerCase()
                                .includes(
                                  searchData.mobile_number.toLowerCase()
                                );
                            } else if (searchData.counts) {
                              return String(temp.count)
                                .toLowerCase()
                                .includes(searchData.counts.toLowerCase());
                            } else if (searchData.total_login_time) {
                              return temp.total_login_time
                                .toLowerCase()
                                .includes(
                                  searchData.total_login_time.toLowerCase()
                                );
                            } else {
                              return temp;
                            }
                          })
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => (
                            <TableRow key={row.id}>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.user_name}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.user_type}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.company_name}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.mobile_number}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.count}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.total_login_time}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    viewHandler(row);
                                  }}
                                >
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "dodgerblue" }}
                                  >
                                    visibility
                                  </Icon>
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                    <TablePagination
                      labelRowsPerPage=""
                      component="div"
                      // count={apiData.length}
                      count={count}
                      rowsPerPage={10}
                      page={page}
                      backIconButtonProps={{
                        "aria-label": "Previous Page",
                      }}
                      nextIconButtonProps={{
                        "aria-label": "Next Page",
                      }}
                      onPageChange={handleChangePage}
                      // onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                  </div>
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default LoginDetails;

import React, { useState, useEffect } from "react";
import { TablePagination, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import moment from "moment";
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
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { TextField } from "@material-ui/core";
import useSortableData from "../../Stock/Components/useSortableData";
import Icones from "assets/fornt-icons/Mainicons";
import Select, { createFilter } from "react-select";

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
  bolderName: {
    fontWeight: 700,
  },
}));

const SalesmanMob = (props) => {
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const theme = useTheme();
  const dispatch = useDispatch();
  const [apiData, setApiData] = useState([]);
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searching, setSearching] = useState(false);
  const isReactivate = props.location.state
    ? props.location.state.isReactivate
    : false;
  const [searchData, setSearchData] = useState({
    full_name: "",
    gender: "",
    mobile_number: "",
    designation: "",
    // type_name: "",
    company: "",
    email: "",
    // date_of_birth: "",
    // date_of_anniversary: "",
    created_at: "",
    status: "",
  });

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setSearching(true);
  };

  function editHandler(row) {
    props.history.push("/dashboard/mobappadmin/addsalesman", {
      row: row,
      isViewOnly: false,
      isEdit: true,
      page: page,
      search: searchData,
      count: count,
      apiData: apiData,
    });
  }

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  function viewHandler(row) {
    props.history.push("/dashboard/mobappadmin/addsalesman", {
      row: row,
      isViewOnly: true,
      isEdit: false,
      page: page,
      search: searchData,
      count: count,
      apiData: apiData,
    });
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

  const genderArr = [
    { value: 0, label: "Male" },
    { value: 1, label: "Female" },
  ];

  const statusArr = [
    { value: 0, label: "Deactive" },
    { value: 1, label: "Active" },
  ];

  useEffect(() => {
    console.log(props, "999999999999");
    setSearching(false);
    const timeout = setTimeout(() => {
      if (searchData && props.location && props.location.state) {
        console.log("innnn1");
        const preDta = props.location.state;
        setPage(preDta.page);
        setCount(preDta.count);
        setApiData(preDta.apiData);
        setSearchData(preDta.search);
        if (preDta.page === 0) {
          setApiData([]);
          setCount(0);
          setPage(0);
          setFilters();
        }
        History.replace("/dashboard/mobappadmin/salesman", null);
      } else {
        console.log("innnn2222");
        setApiData([]);
        setCount(0);
        setPage(0);
        setFilters();
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (
      props.location &&
      props.location.state &&
      props.location.state.iseditView
    ) {
      if (apiData.length > 0 && page && count) {
        console.log("-");
        setFilters(Number(page + 1));
      }
    }
  }, [apiData, page, count]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchData && searching) {
        console.log("..");
        setApiData([]);
        setCount(0);
        setPage(0);
        setFilters();
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchData]);

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function callDeleteSalesmanApi() {
    const haveMany = apiData.length > 1 ? true : false;
    apiData.splice(page * rowsPerPage);
    setApiData(apiData);

    axios
      .delete(
        Config.getCommonUrl() + "api/salesManMaster/" + selectedIdForDelete
      )
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          // selectedIdForDelete
          getSalesmanData();
          if (haveMany) {
            setFilters(Number(page + 1));
          } else {
            setSearching(false);
            getSalesmanData(`api/salesManMaster?page=1`);
            setSearchData({
              full_name: "",
              gender: "",
              mobile_number: "",
              designation: "",
              company: "",
              email: "",
              date_of_birth: "",
              date_of_anniversary: "",
              created_at: "",
              status: "",
            });
          }

          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setSelectedIdForDelete("");
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch((error) => {
        setOpen(false);
        handleError(error, dispatch, {
          api: "api/salesManMaster/" + selectedIdForDelete,
        });
      });
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    // getSalesmanData();
    //eslint-disable-next-line
  }, [dispatch]);

  function getSalesmanData() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/salesManMaster")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setCount(Number(response.data.count));
          let tempData = response.data.data;
          let tempApi = tempData.map((x) => {
            return {
              ...x,
              selected: false,
              compName: x.company_name,
              gender: x.gender === 0 ? "Male" : "Female",
              status: x.status == "0" ? "Deactive" : "Active",
              // date_of_birth: moment(x.date_of_birth, "YYYY-MM-DD").format(
              //   "DD-MM-YYYY"
              // ),
              // date_of_anniversary: moment(
              //   x.date_of_anniversary,
              //   "YYYY-MM-DD"
              // ).format("DD-MM-YYYY"),
              created_at: moment(x.created_at, "YYYY-MM-DD").format(
                "DD-MM-YYYY"
              ),
            };
          });
          setApiData(tempApi);
          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "api/salesManMaster" });
      });
  }

  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 10 > apiData.length) {
      setFilters(Number(newPage + 1));
    }
  }

  function setFilters(tempPageNo) {
    let url = "api/salesManMaster?";
    if (page !== "") {
      if (!tempPageNo) {
        url = url + "page=" + 1;
      } else {
        url = url + "page=" + tempPageNo;
      }
    }
    const serchingData =
      props.location && props.location.state
        ? props.location.state.search
        : searchData;

    if (serchingData.full_name !== "") {
      url = url + "&full_name=" + serchingData.full_name;
    }

    if (serchingData.gender !== "") {
      url = url + "&gender=" + serchingData.gender.value;
    }

    if (serchingData.mobile_number !== "") {
      url = url + "&mobile_number=" + serchingData.mobile_number;
    }

    if (serchingData.designation !== "") {
      url = url + "&designation=" + serchingData.designation;
    }

    if (serchingData.company !== "") {
      url = url + "&company_name=" + serchingData.company;
    }

    if (serchingData.email !== "") {
      url = url + "&email=" + serchingData.email;
    }

    if (serchingData.date_of_birth !== "") {
      url =
        url +
        "&date_of_birth=" +
        moment(serchingData.date_of_birth).format("DD-MM-YYYY");
    }

    if (serchingData.date_of_anniversary !== "") {
      url =
        url +
        "&date_of_anniversary=" +
        moment(serchingData.date_of_anniversary).format("DD-MM-YYYY");
    }

    if (serchingData.created_at !== "") {
      url =
        url +
        "&created_at=" +
        moment(serchingData.created_at).format("DD-MM-YYYY");
    }

    if (serchingData.status !== "") {
      url = url + "&status=" + serchingData.status.value;
    }
    console.log(url, "---------", tempPageNo);
    if (!tempPageNo) {
      // console.log("innnnnnnnnnnnnnn444444")
      getSalesmanData(url);
    } else {
      if (count > apiData.length) {
        getSalesmanData(url);
      }
    }
  }

  const handlegenderChange = (value) => {
    setSearchData((prevState) => ({
      ...prevState,
      ["gender"]: value ? value : "",
    }));
    setSearching(true);
  };

  const handlestatusChange = (value) => {
    setSearchData((prevState) => ({
      ...prevState,
      ["status"]: value ? value : "",
    }));
    setSearching(true);
  };

  const { items, requestSort, sortConfig } = useSortableData(apiData);

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
                    Salesman Master
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
                <Link
                  // to="/dashboard/mobappadmin/adduser"
                  to={{
                    pathname: "/dashboard/mobappadmin/deletedsalesman",
                    state: {
                      row: "",
                      isViewOnly: false,
                      isEdit: false,
                      // isReactivate : authAccessArr.includes('Reactivate Deleted Salesman')
                    },
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
                    Deleted Salesman
                  </Button>
                </Link>

                <Link
                  // to="/dashboard/mobappadmin/adduser"
                  to={{
                    pathname: "/dashboard/mobappadmin/addsalesman",
                    state: {
                      row: "",
                      isViewOnly: false,
                      isEdit: false,
                    },
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
                    Add New Salesman
                  </Button>
                </Link>
              </Grid>
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll ">
              <div className="department-tbl-mt-dv">
                <Paper className={classes.tabroot} id="department-tbl-fix ">
                  <div
                    className="table-responsive  "
                    style={{ maxHeight: "calc(100vh - 235px)" }}
                  >
                    <TablePagination
                      labelRowsPerPage=""
                      component="div"
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
                    />

                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Name
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Gender
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
                            Designation
                          </TableCell>
                          {/* <TableCell className={classes.tableRowPad} align="left">
                          User Type
                        </TableCell> */}
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
                            Email ID
                          </TableCell>
                          {/* <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Date of Birth
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Date of Anni
                          </TableCell> */}
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Creation date
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Status
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>
                            <TextField
                              name="full_name"
                              onChange={handleSearchData}
                              value={searchData.full_name}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("full_name")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "full_name" &&
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
                                sortConfig.key === "full_name" &&
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
                            {/* <Select
                              styles={{ selectStyles }}
                              options={genderArr.map((group) => ({
                                value: group.value,
                                label: group.label,
                              }))}
                              isClearable
                              value={searchData.gender}
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              onChange={handlegenderChange}
                            /> */}
                            <TextField
                              name="gender"
                              onChange={handleSearchData}
                              value={searchData.gender}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("gender")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "gender" &&
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
                                sortConfig.key === "gender" &&
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
                              name="designation"
                              onChange={handleSearchData}
                              value={searchData.designation}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("designation")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "designation" &&
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
                                sortConfig.key === "designation" &&
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
                              name="company"
                              onChange={handleSearchData}
                              value={searchData.company}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("compName")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "compName" &&
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
                                sortConfig.key === "compName" &&
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
                              name="email"
                              onChange={handleSearchData}
                              value={searchData.email}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("email")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "email" &&
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
                                sortConfig.key === "email" &&
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
                          <TextField name="date_of_birth" type="date" inputProps={{
                            max: moment().format("YYYY-MM-DD")
                          }} onChange={handleSearchData} value={searchData.date_of_birth}/>

                          <IconButton style={{ padding: "0" }} onClick={() => requestSort('date_of_birth', true)} >
                            <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                            {(sortConfig && sortConfig.key === "date_of_birth" && sortConfig.direction === "ascending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                            }
                            {(sortConfig && sortConfig.key === "date_of_birth" && sortConfig.direction === "descending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                            }
                          </IconButton>
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <TextField name="date_of_anniversary" type="date" inputProps={{
                            max: moment().format("YYYY-MM-DD")
                          }} onChange={handleSearchData} value={searchData.date_of_anniversary}/>

                          <IconButton style={{ padding: "0" }} onClick={() => requestSort('date_of_anniversary', true)} >
                            <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                            {(sortConfig && sortConfig.key === "date_of_anniversary" && sortConfig.direction === "ascending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                            }
                            {(sortConfig && sortConfig.key === "date_of_anniversary" && sortConfig.direction === "descending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                            }
                          </IconButton>
                        </TableCell> */}
                          <TableCell className={classes.tableRowPad}>
                            <TextField
                              name="created_at"
                              type="date"
                              inputProps={{
                                max: moment().format("YYYY-MM-DD"),
                              }}
                              onChange={handleSearchData}
                              value={searchData.created_at}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("created_at", true)}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "created_at" &&
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
                                sortConfig.key === "created_at" &&
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
                            {/* <Select
                              styles={{ selectStyles }}
                              options={statusArr.map((group) => ({
                                value: group.value,
                                label: group.label,
                              }))}
                              isClearable
                              value={searchData.status}
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              onChange={handlestatusChange}
                            /> */}
                            <TextField
                              name="status"
                              onChange={handleSearchData}
                              value={searchData.status}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("status")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "status" &&
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
                                sortConfig.key === "status" &&
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
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {console.log(items)}
                        {items
                          .filter((temp) => {
                            if (searchData.full_name) {
                              return temp.full_name
                                .toLowerCase()
                                .includes(searchData.full_name.toLowerCase());
                            } else if (searchData?.gender) {
                              return temp?.gender
                                .toLowerCase()
                                .includes(searchData?.gender.toLowerCase());
                            } else if (searchData.mobile_number) {
                              return temp.mobile_number
                                .toLowerCase()
                                .includes(
                                  searchData.mobile_number.toLowerCase()
                                );
                            } else if (searchData.designation) {
                              return temp.designation
                                .toString()
                                .toLowerCase()
                                .includes(searchData.designation.toLowerCase());
                            }
                            // else if (searchData.type_name) {
                            //   return temp.hasOwnProperty("type_name") ? temp.type_name
                            //     .toLowerCase()
                            //     .includes(searchData.type_name.toLowerCase()) : null
                            // }
                            else if (searchData.company) {
                              return temp.compName
                                .toLowerCase()
                                .includes(searchData.company.toLowerCase());
                            } else if (searchData.email) {
                              return temp.email
                                .toString()
                                .toLowerCase()
                                .includes(searchData.email.toLowerCase());
                            }
                            // else if (searchData.date_of_birth) {
                            //   return temp.date_of_birth
                            //     .toString()
                            //     .toLowerCase()
                            //     .includes(
                            //       searchData.date_of_birth.toLowerCase()
                            //     );
                            // } else if (searchData.date_of_anniversary) {
                            //   return temp.date_of_anniversary
                            //     .toString()
                            //     .toLowerCase()
                            //     .includes(
                            //       searchData.date_of_anniversary.toLowerCase()
                            //     );
                            // }
                            else if (searchData.created_at) {
                              return temp.created_at
                                .toLowerCase()
                                .includes(searchData.created_at.toLowerCase());
                            } else if (searchData.status) {
                              return temp.status
                                .toString()
                                .toLowerCase()
                                .includes(searchData.status.toLowerCase());
                            } else {
                              return temp;
                            }
                          })
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row) => (
                            <TableRow key={row.id}>
                              <TableCell
                                align="left"
                                className={clsx(
                                  classes.tableRowPad,
                                  `${
                                    row.status == "Deactive"
                                      ? classes.bolderName
                                      : ""
                                  }`
                                )}
                              >
                                {row.full_name}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.gender}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {/* mobile_number */}
                                {row.country_code === undefined
                                  ? +row.mobile_number
                                  : "" +
                                    row.country_code +
                                    " " +
                                    row.mobile_number}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                                style={{ overflowWrap: "anywhere" }}
                              >
                                {/* designation */}
                                {row.designation}
                              </TableCell>
                              {/* <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {/* userType 
                              {row.hasOwnProperty("type_name") ? row.type_name : ""}

                            </TableCell> */}
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {/* Company */}
                                {row.compName}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                                style={{ overflowWrap: "anywhere" }}
                              >
                                {/* email */}
                                {row.email}
                              </TableCell>
                              {/* <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                          
                                {row.date_of_birth}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                      
                                {row.date_of_anniversary}
                              </TableCell> */}
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {/* created_at */}
                                {row.created_at}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {/* status */}
                                {row.status}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    editHandler(row);
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
                                    viewHandler(row);
                                  }}
                                >
                                  <Icon className="mr-8 view-icone">
                                    <img src={Icones.view} alt="" />
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

                    <TablePagination
                      labelRowsPerPage=""
                      component="div"
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
                    />
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
                  onClick={callDeleteSalesmanApi}
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

export default SalesmanMob;

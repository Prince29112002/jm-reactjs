import React, { useState, useEffect } from "react";
import { Button, TablePagination, Typography } from "@material-ui/core";
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
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import { TextField } from "@material-ui/core";
import Loader from "../../../Loader/Loader";
import DragDrop from "./AssociationDragDrop/DragDrop";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import useSortableData from "../../Stock/Components/useSortableData";
import { Icon, IconButton } from "@material-ui/core";
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
  // button: {
  //   margin: 5,
  //   textTransform: "none",
  //   backgroundColor: "cornflowerblue",
  //   color: "white",
  // },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
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
}));

const SalesmanAssociation = (props) => {
  const [apiData, setApiData] = useState([]);
  const classes = useStyles();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [openPopUp, setOpenPopUp] = useState(false); //popup

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);

  const [salesmanId, setSalesmanId] = useState(""); //selected row

  const [distriComp, setDistriComp] = useState([]);

  const [is_salesmanDataFrom, setIs_salesmanDataFrom] = useState("");

  const [searchData, setSearchData] = useState({
    salesman: "",
    mobNo: "",
    email: "",
    city: "",
  });

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    getSalesMan();
    // getting list of ALL clients
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    console.log("useEffect");
    // getSalesMan()
    // setFilters();
    setApiData([]);
    setCount(0);
    setPage(0);
    setFilters();
    // getting list of ALL clients
    //eslint-disable-next-line
  }, [searchData]);

  function getSalesMan() {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() +
          "api/salesmanassociation/list/listSalesmanAndSalesmanInUser"
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          setCount(Number(response.data.count));

          let tempApiData = tempData.map((x) => {
            return {
              ...x,
              selected: false,
              cityNm: x.city_name.name,
            };
          });
          setApiData(tempApiData);
          setLoading(false);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setApiData([]);
          setLoading(false);
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/salesmanassociation/list/listSalesmanAndSalesmanInUser",
        });
      });
  }

  function setFilters(tempPageNo) {
    let url = "api/salesmanassociation/list/listSalesmanAndSalesmanInUser?";

    if (page !== "") {
      if (!tempPageNo) {
        url = url + "page=" + 1;
      } else {
        url = url + "page=" + tempPageNo;
      }
    }

    if (searchData.salesman !== "") {
      url = url + "&name=" + searchData.salesman;
    }
    if (searchData.mobNo !== "") {
      url = url + "&number=" + searchData.mobNo;
    }
    if (searchData.email !== "") {
      url = url + "&email=" + searchData.email;
    }
    if (searchData.city !== "") {
      url = url + "&city_name=" + searchData.city;
    }

    console.log(url, "---------", tempPageNo);

    if (!tempPageNo) {
      console.log("innnnnnnnnnnnnnn444444");
      getSalesMan(url);
    } else {
      if (count > apiData.length) {
        getSalesMan(url);
      }
    }
  }
  function handleChangePage(event, newPage) {
    // console.log(newPage , page)
    // console.log((newPage +1) * 10 > apiData.length)
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 10 > apiData.length) {
      setFilters(Number(newPage + 1));
      // getRetailerMasterData()
    }
    // console.log(apiData.length);
  }

  function handleAllocation(row) {
    setOpenPopUp(true);
    setSalesmanId(row.salesman_id);
    setIs_salesmanDataFrom(row.is_salesmanDataFrom);
    getDistriCompanies(row.salesman_id, row.is_salesmanDataFrom);
  }

  function getDistriCompanies(userId, isFrom) {
    axios
      .get(
        Config.getCommonUrl() +
          `api/salesmanassociation/list/distributorsFor/${userId}?is_salesmanDataFrom=${isFrom}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;

          setDistriComp(tempData);
          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/salesmanassociation/list/distributorsFor/${userId}?is_salesmanDataFrom=${isFrom}`,
        });
      });
  }

  const handleClose = () => {
    setOpenPopUp(false);
    setDistriComp([]);
    setSalesmanId("");
    getSalesMan();
  };

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const { items, requestSort, sortConfig } = useSortableData(apiData);

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0  makeStyles-root-1 pt-20">
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
                    Salesman Association
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
                {/* <Link
                                      to="/dashboard/mobappadmin/addsalesman"
                                    // to="#"
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
                                        Add Salesman
                                    </Button>
                                </Link> */}
              </Grid>
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll ">
              <div className="mt-8 department-tbl-mt-dv">
                <Paper className={classes.tabroot} id="department-tbl-fix ">
                  <div
                    className="table-responsive "
                    style={{ maxHeight: "calc(100vh - 235px)" }}
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
                    />
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          {/* <TableCell className={classes.tableRowPad}>
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        checked={MasterChecked}
                                                        id="mastercheck"
                                                        onChange={(e) => onMasterCheck(e)}
                                                    />
                                                </TableCell> */}
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Salesman
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Mobile No.
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Email-id
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            City
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          {/* <TableCell className={classes.tableRowPad}></TableCell> */}
                          <TableCell className={classes.tableRowPad}>
                            {/* Salesman */}
                            <TextField
                              name="salesman"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />

                            <IconButton
                              style={{ padding: "10px" }}
                              onClick={() => requestSort("name")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "name" &&
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
                                sortConfig.key === "name" &&
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
                            align="left"
                          >
                            {/* Mobile No. */}
                            <TextField
                              name="mobNo"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />

                            <IconButton
                              style={{ padding: "10px" }}
                              onClick={() => requestSort("number")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "number" &&
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
                                sortConfig.key === "number" &&
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
                            align="left"
                          >
                            {/*  Email-id */}
                            <TextField
                              name="email"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                            <IconButton
                              style={{ padding: "10px" }}
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
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            {/* City */}
                            <TextField
                              name="city"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />

                            <IconButton
                              style={{ padding: "10px" }}
                              onClick={() => requestSort("cityNm")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "cityNm" &&
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
                                sortConfig.key === "cityNm" &&
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
                            align="left"
                          >
                            {/* Actions */}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {items
                          .filter((temp) => {
                            if (searchData.salesman) {
                              return temp.name
                                .toLowerCase()
                                .includes(searchData.salesman.toLowerCase());
                            } else if (searchData.mobNo) {
                              return temp.number
                                .toLowerCase()
                                .includes(searchData.mobNo.toLowerCase());
                            } else if (searchData.email) {
                              return temp.email
                                .toLowerCase()
                                .includes(searchData.email.toLowerCase());
                            } else if (searchData.city) {
                              return temp.city_name.name
                                .toLowerCase()
                                .includes(searchData.city.toLowerCase());
                            } else {
                              return temp;
                            }
                          })
                          .map((row, index) => (
                            <TableRow key={index}>
                              {/* component="th" scope="row" */}
                              {/* <TableCell className={classes.tableRowPad}>
                                                            <input
                                                                type="checkbox"
                                                                checked={row.selected}
                                                                className="form-check-input"
                                                                id="rowcheck{user.id}"
                                                                onChange={(e) => onItemCheck(e, row)}
                                                            />
                                                        </TableCell> */}
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
                                {row.number}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.email}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                                style={{ overflowWrap: "anywhere" }}
                              >
                                {row.city_name.name}
                              </TableCell>

                              <TableCell className={classes.tableRowPad}>
                                <Button
                                  className={classes.button}
                                  variant="contained"
                                  onClick={(e) => handleAllocation(row)}
                                >
                                  Allocate Distributor
                                </Button>

                                {/* <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(e) => handleAllocation(row)}
                                >
                                  <Icon className="mr-8 allocationdis-icone">
                                    <img
                                      src={Icones.allocation_distributor}
                                      alt=""
                                    />
                                  </Icon>
                                </IconButton> */}
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
                    />
                  </div>
                </Paper>
              </div>
            </div>
            {openPopUp && (
              <DragDrop
                modalColsed={handleClose}
                salesmanId={salesmanId}
                distriComp={distriComp}
                is_salesmanDataFrom={is_salesmanDataFrom}
              />
            )}
            {/* selectedCType={selectedCType}  retComp={retComp} distriId={distriId} retId={retId} */}
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default SalesmanAssociation;

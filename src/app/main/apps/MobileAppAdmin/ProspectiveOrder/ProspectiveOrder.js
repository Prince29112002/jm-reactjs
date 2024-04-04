import React, { useState, useEffect } from "react";
import { TablePagination, TextField, Typography } from "@material-ui/core";
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
import { Icon, IconButton } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import History from "@history";
import useSortableData from "../../Stock/Components/useSortableData";
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
  hoverClass: {
    color: "#1e90ff",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const ProspectiveOrder = (props) => {
  const [apiData, setApiData] = useState([]);
  const classes = useStyles();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [totalEntry, setTotalEntry] = useState("")
  const [totalGrossWeight, setTotalGrossWeight] = useState("");
  const [totalNetweight, setTotalNetweight] = useState("");
  const [totalQty, setTotalQty] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [searching, setSearching] = useState(false);
  const [searchData, setSearchData] = useState({
    user_name: "",
    comName: "",
    gross_weight: "",
    net_weight: "",
    pcs: "",
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
  const { items, requestSort, sortConfig } = useSortableData(apiData);

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
  }, []);

  useEffect(() => {
    console.log(props, "999999999999")
    getCalculationWgt()
    setSearching(false);
    const timeout = setTimeout(() => {
      if (searchData && props.location && props.location.state) {
        console.log("innnn1")
        const propsData = props.location.state
        setPage(propsData.page)
        setCount(propsData.count)
        setApiData(propsData.apiData)
        setSearchData(propsData.search)
        if(propsData.page === 0){
          setApiData([])
          setCount(0)
          setPage(0)
          setFilters();
        }
        History.replace("/dashboard/mobappadmin/prospectiveorders", null)
      } else {
        console.log("innnn2222")
        setApiData([])
        setCount(0)
        setPage(0)
        setFilters();
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [])

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
  }, [searchData])

  function viewHandler(row) {
    History.push("/dashboard/mobappadmin/prosorderdetail", {
      id: row.id,
      page: page,
      search: searchData,
      count: count,
      apiData: apiData
      // isViewOnly: true/,
    });
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  function getCalculationWgt() {
    axios
      .get(Config.getCommonUrl() + `api/usermaster/user/cart/count`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          let tempData = response.data.data;
          setTotalEntry(tempData.TotalUserCount)
          setTotalGrossWeight(tempData.TotalGrossWeight)
          setTotalNetweight(tempData.TotalNetWeight)
          setTotalQty(tempData.TotalPcs)
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/usermaster/user/cart/count`,
        });
      });
  }

  
  function getProspectiveOrder(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setCount(Number(response.data.count))
          let tempData = response.data.data.map((item) => {

            return {
              ...item,
              comName: item.client_company_name !== null ? item.client_company_name :
                item.retailer_company_id !== null ? item.retailer_company_name : "-"
            }
          });
          // function grossWeight(item) {
          //   return parseFloat(item.gross_weight);
          // }
          // function netWeight(item) {
          //   return parseFloat(item.net_weight);
          // }
          // function qty(item) {
          //   return item.pcs;
          // }
          // let tempGrossWtTot = parseFloat(
          //   tempData
          //     .filter((data) => data.grossWeight !== "")
          //     .map(grossWeight)
          //     .reduce(function (a, b) {
          //       // sum all resulting numbers
          //       return parseFloat(a) + parseFloat(b);
          //     }, 0)
          // ).toFixed(3);

          // setTotalGrossWeight(parseFloat(tempGrossWtTot).toFixed(3));
          // let tempNetWtTot = parseFloat(
          //   tempData
          //     .filter((data) => data.netWeight !== "")
          //     .map(netWeight)
          //     .reduce(function (a, b) {
          //       // sum all resulting numbers
          //       return parseFloat(a) + parseFloat(b);
          //     }, 0)
          // ).toFixed(3);
          // setTotalNetweight(parseFloat(tempNetWtTot).toFixed(3));
          // let tempQtyTot = tempData
          //   .filter((data) => data.qty !== "")
          //   .map(qty)
          //   .reduce(function (a, b) {
          //     // sum all resulting numbers
          //     return a + b;
          //   }, 0);
          // setTotalQty(tempQtyTot);
          if (apiData.length === 0) {
            setApiData(tempData);
          } else {
            setApiData((apiData) => [...apiData, ...tempData]);
          }
          setLoading(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: url });
      });
  }

  function setFilters(tempPageNo) {

    let url = "api/usermaster/user/cart?"
    if (page !== "") {
      if (!tempPageNo) {
        url = url + "page=" + 1
      } else {
        url = url + "page=" + tempPageNo
      }
    }
    if (searchData.user_name !== "") {
      url = url + "&full_name=" + searchData.user_name
    }
    if (searchData.comName !== "") {
      url = url + "&company_name=" + searchData.comName
    }
    if (searchData.pcs !== "") {
      url = url + "&pcs=" + searchData.pcs
    }
    console.log(url, "---------", tempPageNo)
    if (!tempPageNo) {
      console.log("innnnnnnnnnnnnnn444444")
      getProspectiveOrder(url);
    } else {
      if (count > apiData.length) {
        getProspectiveOrder(url);
      }
    }
  }
  function handleChangePage(event, newPage) {
    // console.log(newPage , page)
    // console.log((newPage +1) * 10 > apiData.length)
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 10 > apiData.length) {
      setFilters(Number(newPage + 1))
      // getRetailerMasterData()
    }
    // console.log(apiData.length);
  }
  const openHandler = (path, data) => {
    History.push(path, data)
  }
  console.log(apiData)


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
                    Prospective Orders
                  </Typography>
                </FuseAnimate>
              </Grid>
            </Grid>
            <div className="main-div-alll ">
              <Grid
                className={clsx("mx-0", "p-16", "pl-0")}
                container
                // spacing={2}
                alignItems="stretch"
                //   style={{ margin: 0 }}
              >
                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={3}
                  key="1"
                  style={{ padding: 0, fontSize: 20 }}
                >
                  <span style={{ fontWeight: 700, marginRight: 10 }}>
                    Total User:
                  </span>
                  {totalEntry}
                </Grid>
                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={3}
                  key="2"
                  style={{ padding: 0, fontSize: 20 }}
                >
                  {" "}
                  <span style={{ fontWeight: 700, marginRight: 10 }}>
                    Total Gross Weight:
                  </span>
                  {totalGrossWeight}
                </Grid>
                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={3}
                  key="3"
                  style={{ padding: 0, fontSize: 20 }}
                >
                  <span style={{ fontWeight: 700, marginRight: 10 }}>
                    Total Net Weight:
                  </span>
                  {totalNetweight}
                </Grid>
                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={3}
                  key="4"
                  style={{ padding: 0, fontSize: 20 }}
                >
                  {" "}
                  <span style={{ fontWeight: 700, marginRight: 10 }}>
                    Total Pieces:
                  </span>
                  {totalQty}
                </Grid>
              </Grid>
              {loading && <Loader />}
              <div className="mt-8 department-tbl-mt-dv">
                <Paper className={classes.tabroot} id="department-tbl-fix ">
                  <div
                    className="table-responsive new-add_stock_group_tbel"
                    style={{ maxHeight: "calc(100vh - 300px)" }}
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
                            User Name
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
                            Gross Weight
                          </TableCell>

                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Net Weight
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Pieces
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
                              name="user_name"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
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
                            <TextField
                              name="comName"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("comName")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "comName" &&
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
                                sortConfig.key === "comName" &&
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
                              name="gross_weight"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("gross_weight")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "gross_weight" &&
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
                                sortConfig.key === "gross_weight" &&
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
                              name="net_weight"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("net_weight")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "net_weight" &&
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
                                sortConfig.key === "net_weight" &&
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
                              name="pcs"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("pcs")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "pcs" &&
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
                                sortConfig.key === "pcs" &&
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
                        {items
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .filter((temp) => {
                            if (searchData.user_name) {
                              return temp.user_name
                                .toLowerCase()
                                .includes(searchData.user_name.toLowerCase());
                            } else if (searchData.comName) {
                              return temp.comName
                                .toLowerCase()
                                .includes(searchData.comName.toLowerCase());
                            } else if (searchData.gross_weight) {
                              return String(temp.gross_weight)
                                .toLowerCase()
                                .includes(
                                  searchData.gross_weight.toLowerCase()
                                );
                            } else if (searchData.net_weight) {
                              return String(temp.net_weight)
                                .toLowerCase()
                                .includes(searchData.net_weight.toLowerCase());
                            } else if (searchData.pcs) {
                              return String(temp.pcs)
                                .toLowerCase()
                                .includes(searchData.pcs.toLowerCase());
                            } else {
                              return temp;
                            }
                          })
                          .map((row) => (
                            <TableRow key={row.id}>
                              <TableCell
                                align="left"
                                className={clsx(
                                  classes.tableRowPad,
                                  classes.hoverClass
                                )}
                              >
                                <span
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    openHandler(
                                      "/dashboard/mobappadmin/adduser",
                                      {
                                        row: row.id,
                                        isViewOnly: true,
                                        isEdit: false,
                                        from : "/dashboard/mobappadmin/prospectiveorders",
                                        page: page,
                                        search: searchData,
                                        count: count,
                                        apiData: apiData 
                                      }
                                    );
                                  }}
                                >
                                  {" "}
                                  {row.user_name}
                                </span>
                              </TableCell>
                              <TableCell
                                align="left"
                                className={clsx(
                                  classes.tableRowPad,
                                  classes.hoverClass
                                )}
                              >
                                {row.client_company_name !== null ? (
                                  <span
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      openHandler(
                                        "/dashboard/mobappadmin/createdistributor",
                                        {
                                          row: row.client_company_id,
                                          isViewOnly: false,
                                          from : "/dashboard/mobappadmin/prospectiveorders",
                                          page: page,
                                          search: searchData,
                                          count: count,
                                          apiData: apiData 
                                        }
                                      );
                                    }}
                                  >
                                    {" "}
                                    {row.comName}
                                  </span>
                                ) : row.retailer_company_id !== null ? (
                                  <span
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      openHandler(
                                        "/dashboard/mobappadmin/createretailer",
                                        {
                                          row: row.retailer_company_id,
                                          isViewOnly: true,
                                          isEdit: false,
                                          from : "/dashboard/mobappadmin/prospectiveorders",
                                          page: page,
                                          search: searchData,
                                          count: count,
                                          apiData: apiData 
                                        }
                                      );
                                    }}
                                  >
                                    {" "}
                                    {row.comName}
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {parseFloat(row.gross_weight).toFixed(3)}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {parseFloat(row.net_weight).toFixed(3)}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.pcs}
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
                                  <Icon className="mr-8 view-icone">
                                    <img src={Icones.view} alt="" />
                                  </Icon>
                                </IconButton>
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
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default ProspectiveOrder;

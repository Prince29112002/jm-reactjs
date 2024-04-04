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
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import History from "@history";
import { Icon, IconButton } from "@material-ui/core";
import Loader from "app/main/Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";

import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";
import useSortableData from "../../../Stock/Components/useSortableData";

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

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const ProsOrderDetail = (props) => {
  const classes = useStyles();
  // const history = useHistory();
  const [modalStyle] = React.useState(getModalStyle);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [searchData, setSearchData] = useState({
    variant_number: "",
    karat: "",
    net_weight: "",
    pcs: "",
    gross_weight:"",
    date:"",
    remark:"",
  });
  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState, [name]: value
    })
    );
  }
  const { items, requestSort, sortConfig } = useSortableData(apiData);
console.log(items);
  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  const dataToBeView = props.location.state;

  useEffect(() => {
    console.log("dataToBeView", dataToBeView);

    if (dataToBeView !== undefined) {
      // setIsView(dataToBeView.isViewOnly)
      setFilters();
    }
    //eslint-disable-next-line
  }, [dispatch]);
  useEffect(() =>{
    if (dataToBeView.id) {
      setApiData([])
                  setCount(0)
                  setPage(0)
                  setFilters();
                
     
    }
      
     },[searchData])

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  function getReadOneProsOrderApi(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        console.log(response);
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
  function setFilters(tempPageNo) {
    const id = dataToBeView.id
        let url = `api/usermaster/user/cart/${id}?`
    
      
        if (page !== "") {
            if (!tempPageNo) {
                url = url + "page=" + 1
      
            } else {
                url = url + "page=" + tempPageNo
            }
        }
      
     
    // if (searchData.user_name !== "") {
    //   url = url + "&category_name=" + searchData.user_name
    // }
    // if (searchData.comName !== "") {
    //   url = url + "&variant_number=" + searchData.comName
    // } if (searchData.gross_weight !== "") {
    //   url = url + "&show_in_app=" + searchData.gross_weight
    // }
    // if (searchData.net_weight !== "") {
    //   url = url + "&category_name=" + searchData.net_weight
    // }
    // if (searchData.pcs !== "") {
    //   url = url + "&variant_number=" + searchData.pcs
    // }
   
        console.log(url,"---------",tempPageNo)
      
        if (!tempPageNo) {
          console.log("innnnnnnnnnnnnnn444444")
          getReadOneProsOrderApi(url);
        } else {
             if (count > apiData.length) {
              getReadOneProsOrderApi(url);
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
  const readFile = () => {
    setLoading(true);
    // console.log("test")
    axios
      .get(Config.getCommonUrl() + `api/usermaster/cart/csv/${dataToBeView.id}`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          let tempData = response.data.data.xl_url;
          console.log(tempData, "tempData")
          window.open(tempData);

          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/usermaster/cart/csv/${dataToBeView.id}`,
        });
      });
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
                    Prospective Order
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
                    // onClick={(event) => {
                    //   History.goBack();
                    // }}
                    onClick={(event) => {
                      dataToBeView ? History.push('/dashboard/mobappadmin/prospectiveorders', { page : dataToBeView.page , search : dataToBeView.search , apiData : dataToBeView.apiData, count : dataToBeView.count}): History.goBack()
                    }}
                  >
                    <img
                      className="back_arrow"
                      src={Icones.arrow_left_pagination}
                      alt=""
                    />
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>

            {loading && <Loader />}

            <div className="main-div-alll ">
              <Grid
                className="department-main-dv flex flex-row justify-between"
                container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 10, marginLeft: 0, fontSize: 20 }}
              >
                <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                  <span style={{ fontWeight: 700, marginRight: 10 }}>
                    {" "}
                    UserName:
                  </span>{" "}
                  {apiData[0]?.full_name}
                </Grid>
                <IconButton
                  style={{ padding: "0", height: "100%" }}
                  className="mr-1"
                  onClick={() => readFile()}
                >
                  <Icon
                    className="mr-8 download-icone"
                    style={{ color: "dodgerblue" }}
                  >
                    <img src={Icones.download_green} alt="" />
                  </Icon>
                </IconButton>
              </Grid>
              <Grid
                className="department-main-dv "
                container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0 }}
              >
                <div className="department-tbl-mt-dv">
                  <Paper className={classes.tabroot} id="department-tbl-fix ">
                    <div className="table-responsive ">
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
                            <TableCell className={classes.tableRowPad}>
                              Variant Number
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Karat
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
                              Gross Wt
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Net Wt
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Remark
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Date
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Image
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              <TextField
                                name="variant_number"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />

                              <IconButton
                                style={{ padding: "0" }}
                                onClick={() => requestSort("variant_number")}
                              >
                                <Icon
                                  className="mr-8"
                                  style={{ color: "#000" }}
                                >
                                  {" "}
                                  sort{" "}
                                </Icon>

                                {sortConfig &&
                                  sortConfig.key === "variant_number" &&
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
                                  sortConfig.key === "variant_number" &&
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
                                name="karat"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />

                              <IconButton
                                style={{ padding: "0" }}
                                onClick={() => requestSort("karat")}
                              >
                                <Icon
                                  className="mr-8"
                                  style={{ color: "#000" }}
                                >
                                  {" "}
                                  sort{" "}
                                </Icon>

                                {sortConfig &&
                                  sortConfig.key === "karat" &&
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
                                  sortConfig.key === "karat" &&
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
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />

                              <IconButton
                                style={{ padding: "0" }}
                                onClick={() => requestSort("pcs")}
                              >
                                <Icon
                                  className="mr-8"
                                  style={{ color: "#000" }}
                                >
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
                            <TableCell className={classes.tableRowPad}>
                              <TextField
                                name="gross_weight"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />

                              <IconButton
                                style={{ padding: "0" }}
                                onClick={() => requestSort("gross_weight")}
                              >
                                <Icon
                                  className="mr-8"
                                  style={{ color: "#000" }}
                                >
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
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />

                              <IconButton
                                style={{ padding: "0" }}
                                onClick={() => requestSort("net_weight")}
                              >
                                <Icon
                                  className="mr-8"
                                  style={{ color: "#000" }}
                                >
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
                                name="remark"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />

                              <IconButton
                                style={{ padding: "0" }}
                                onClick={() => requestSort("remark")}
                              >
                                <Icon
                                  className="mr-8"
                                  style={{ color: "#000" }}
                                >
                                  {" "}
                                  sort{" "}
                                </Icon>

                                {sortConfig &&
                                  sortConfig.key === "remark" &&
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
                                  sortConfig.key === "remark" &&
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
                                name="date"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />

                              <IconButton
                                style={{ padding: "0" }}
                                onClick={() => requestSort("date")}
                              >
                                <Icon
                                  className="mr-8"
                                  style={{ color: "#000" }}
                                >
                                  {" "}
                                  sort{" "}
                                </Icon>

                                {sortConfig &&
                                  sortConfig.key === "date" &&
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
                                  sortConfig.key === "date" &&
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
                              if (searchData.variant_number) {
                                return temp.variant_number
                                  .toLowerCase()
                                  .includes(
                                    searchData.variant_number.toLowerCase()
                                  );
                              } else if (searchData.karat) {
                                return String(temp.karat)
                                  .toLowerCase()
                                  .includes(searchData.karat.toLowerCase());
                              } else if (searchData.pcs) {
                                return String(temp.pcs)
                                  .toLowerCase()
                                  .includes(searchData.pcs.toLowerCase());
                              } else if (searchData.gross_weight) {
                                return String(temp.gross_weight)
                                  .toLowerCase()
                                  .includes(
                                    searchData.gross_weight.toLowerCase()
                                  );
                              } else if (searchData.net_weight) {
                                return String(temp.net_weight)
                                  .toLowerCase()
                                  .includes(
                                    searchData.net_weight.toLowerCase()
                                  );
                              } else if (searchData.remark) {
                                return temp.remark
                                  .toLowerCase()
                                  .includes(searchData.remark.toLowerCase());
                              } else if (searchData.date) {
                                return temp.date
                                  .toLowerCase()
                                  .includes(searchData.date.toLowerCase());
                              } else {
                                return temp;
                              }
                            })
                            .map((row, index) => (
                              <TableRow key={index}>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {row.variant_number}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {row.karat}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {row.pcs}
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
                                  {row.remark}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {row.date}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  <img
                                    src={row.ImageURL}
                                    alt=""
                                    height={50}
                                    width={50}
                                  />
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
              </Grid>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default ProsOrderDetail;

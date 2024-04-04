import React, { useState, useEffect } from "react";
import { Typography, TextField, TablePagination } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
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
import { Link } from "react-router-dom";
import Loader from "../../../Loader/Loader";
import moment from "moment";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";
import useSortableData from "../../Stock/Components/useSortableData";

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

const ExhibitionMaster = (props) => {
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [apiData, setApiData] = useState([]);
  const classes = useStyles();
  const [searching, setSearching] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { items, requestSort, sortConfig } = useSortableData(apiData);

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    name: "",
    end_date: "",
    start_date: "",
    ExhibitionMasterDesigns: "",
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

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  function viewHandler(row) {
    props.history.push("/dashboard/mobappadmin/addexhibition", {
      id: row.id,
      isViewOnly: true,
      page: page,
      search: searchData,
      count: count,
      apiData: apiData,
    });
  }

  useEffect(() => {
    setSearching(false);

    console.log(props, "999999999999");
    const timeout = setTimeout(() => {
      if (searchData && props.location && props.location.state) {
        console.log("innnn1");
        const propsData = props.location.state;
        setPage(propsData.page);
        setCount(propsData.count);
        setApiData(propsData.apiData);
        setSearchData(propsData.search);
        if (propsData.page === 0) {
          setApiData([]);
          setCount(0);
          setPage(0);
          setFilters();
        }
        History.replace("/dashboard/mobappadmin/exhibitionmaster", null);
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
    const timeout = setTimeout(() => {
      if (searchData && searching) {
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

  function callDeleteClientApi() {
    const haveMany = apiData.length > 1 ? true : false;
    apiData.splice(page * rowsPerPage);
    setApiData(apiData);
    axios
      .delete(
        Config.getCommonUrl() + "api/exhibitionMaster/" + selectedIdForDelete
      )
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          // selectedIdForDelete
          if (haveMany) {
            setFilters(Number(page + 1));
          } else {
            setSearching(false);
            getExhibitionMasterData(`api/exhibitionMaster/web/read?page=1`);
            setSearchData({
              name: "",
              end_date: "",
              start_date: "",
              ExhibitionMasterDesigns: "",
            });
          }
          dispatch(Actions.showMessage({ message: response.data.message }));
          setSelectedIdForDelete("");
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        // console.log(error);
        setOpen(false);
        handleError(error, dispatch, {
          api: "api/exhibitionMaster/" + selectedIdForDelete,
        });
      });
  }

  function setFilters(tempPageNo) {
    let url = "api/exhibitionMaster/web/read?";

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
    if (serchingData.name !== "") {
      url = url + "&name=" + serchingData.name;
    }
    if (serchingData.ExhibitionMasterDesigns !== "") {
      url = url + "&count=" + serchingData.ExhibitionMasterDesigns;
    }
    if (serchingData.start_date !== "") {
      url = url + "&start_date=" + serchingData.start_date;
    }
    if (serchingData.end_date !== "") {
      url = url + "&end_date=" + serchingData.end_date;
    }

    console.log(url, "---------", tempPageNo);

    if (!tempPageNo) {
      console.log("innnnnnnnnnnnnnn444444");
      getExhibitionMasterData(url);
    } else {
      if (count > apiData.length) {
        getExhibitionMasterData(url);
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

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    // getExhibitionMasterData();
    //eslint-disable-next-line
  }, [dispatch]);

  function getExhibitionMasterData(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              let tempData = response.data.data;
              setCount(Number(response.data.count));

              let tempApiData = tempData.map((x) => {
                return {
                  ...x,
                  selected: false,
                };
              });
              console.log(tempApiData);
              if (apiData.length === 0) {
                console.log("if");
                setApiData(tempApiData);
              } else {
                // setApiData(...apiData, ...rows)
                setApiData((apiData) => [...apiData, ...tempApiData]);
                // console.log([...apiData, ...rows])
              }
            } else {
              setApiData([]);
            }
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
            setApiData([]);
          }

          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: url });
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
                  <Typography className="pl-32 pt-16 pb-8 text-18 font-700">
                    Exhibition Master
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
                  to="/dashboard/mobappadmin/addexhibition"
                  // to="#"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button
                    className={classes.button}
                    size="small"
                    onClick={(event) => {
                      //   setDefaultView(btndata.id);
                      //   setIsEdit(false);
                    }}
                  >
                    Add Exhibition
                  </Button>
                </Link>
              </Grid>
            </Grid>

            {/* <div style={{ textAlign: "right" }} className="mr-16">
              <label style={{ display: "contents" }}> Search : </label>
              <Search
                className={classes.searchBox}
                onSearch={onSearchHandler}
              />
            </div> */}
            {loading && <Loader />}
            <div className="main-div-alll">
              {" "}
              <div className="department-tbl-mt-dv">
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
                      // onChangeRowsPerPage={handleChangeRowsPerPage}
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
                            Exhibition Name
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Exhibition Start Date
                          </TableCell>

                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Exhibition End Date
                          </TableCell>

                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            No. of Products
                          </TableCell>
                          {/* <TableCell className={classes.tableRowPad} align="left">
                                                    No. of Retailers
                                                </TableCell> */}
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
                              name="name"
                              onChange={handleSearchData}
                              value={searchData.name}
                            />

                            <IconButton
                              style={{ padding: "0" }}
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
                          <TableCell className={classes.tableRowPad}>
                            <TextField
                              name="start_date"
                              onChange={handleSearchData}
                              value={searchData.start_date}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("start_date")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "start_date" &&
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
                                sortConfig.key === "start_date" &&
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
                              name="end_date"
                              onChange={handleSearchData}
                              value={searchData.end_date}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() => requestSort("end_date")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "end_date" &&
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
                                sortConfig.key === "end_date" &&
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
                              name="ExhibitionMasterDesigns"
                              onChange={handleSearchData}
                              value={searchData.ExhibitionMasterDesigns}
                            />

                            <IconButton
                              style={{ padding: "0" }}
                              onClick={() =>
                                requestSort("ExhibitionMasterDesigns")
                              }
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "ExhibitionMasterDesigns" &&
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
                                sortConfig.key === "ExhibitionMasterDesigns" &&
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
                        {apiData
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row) => (
                            <TableRow key={row.id}>
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

                              {/* <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {moment
                                .utc(row.end_date)
                                .local()
                                .format("DD-MM-YYYY")}
                            </TableCell> */}
                              {/* <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.ExhibitionMasterDesigns?.length}
                            </TableCell> */}
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {moment
                                  .utc(row.start_date)
                                  .local()
                                  .format("DD-MM-YYYY")}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {moment
                                  .utc(row.end_date)
                                  .local()
                                  .format("DD-MM-YYYY")}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.count}
                              </TableCell>

                              {/* <TableCell
                                                            align="left"
                                                            className={classes.tableRowPad}
                                                        >
                                                            {row.ExhibitionMasterRetailers.length}
                                                        </TableCell> */}

                              <TableCell className={classes.tableRowPad}>
                                {/* <IconButton
                                                                style={{ padding: "0" }}
                                                                onClick={(ev) => {
                                                                    ev.preventDefault();
                                                                    ev.stopPropagation();
                                                                    // editHandler(row);
                                                                }}
                                                            >   <Icon className="mr-8 edit-icone">
                                  <img src={Icones.edit} alt="" />
                                </Icon>
                                                            </IconButton> */}

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
                  color="primary"
                  className="delete-dialog-box-cancle-button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteClientApi}
                  color="primary"
                  autoFocus
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

export default ExhibitionMaster;

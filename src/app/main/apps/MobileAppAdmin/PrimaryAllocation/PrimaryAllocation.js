import React, { useState, useEffect } from "react";
import { TablePagination, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
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
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import History from "@history";
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
}));

const PrimaryAllocation = (props) => {
  const [selectedIdForDelete, setSelectedIdForDelete] = useState();

  const [apiData, setApiData] = useState([]);
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0)
  const [searching, setSearching] = useState(false);

  // const [MasterChecked, setMasterChecked] = useState(false)
  // const [buttonVisisble, setButtonVisisble] = useState(false)

  const [searchData, setSearchData] = useState({
    name: "",
    showInApp:"",
    numOfProduct:""
});



  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  function callDeleteStagingDesignApi() {
    setLoading(true)
    const haveMany = apiData.length > 1 ? true : false;
    apiData.splice((page*rowsPerPage))
    setApiData(apiData)

    axios
      .delete(
        Config.getCommonUrl() + `api/designStaging/${selectedIdForDelete}`
      )
      .then(function (response) {
        console.log(response);
        setOpen(false);
        // setButtonVisisble(false);
        if (response.data.success === true) {
          setSelectedIdForDelete("");  
          if(haveMany){
            setFilters(Number(page+1));
          }else{
            setSearching(false);
            getStagingDesingsList(`api/designStaging?page=1`)
            setSearchData({
              name: "",
              showInApp:"",
              numOfProduct:""
            })
          }
          dispatch(Actions.showMessage({ message: response.data.message }));
        }else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        setOpen(false);
        // setButtonVisisble(false);
        handleError(error, dispatch, {
          api: `api/designStaging/${selectedIdForDelete}`,
        });
      });
  }

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() =>{
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
            History.replace("/dashboard/mobappadmin/primaryallocation", null)
          }else{
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
    },[])

    useEffect(() => {
        if (loading) {
            setTimeout(() => setLoading(false), 7000);
        }
    }, [loading]);

    useEffect(() =>{
      const timeout = setTimeout(() => {
          if (searchData && searching) {
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

  useEffect(() => {
    getStagingDesingsList();
    //eslint-disable-next-line
  }, [dispatch]);

  function getStagingDesingsList() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/designStaging")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          setCount(Number(response.data.count))
          let tempApiData = tempData.map((x) => {
            return {
              ...x,
              selected: false,
            };
          });
          setApiData(tempApiData);
          setLoading(false);
        } else {
          setApiData([]);
          setLoading(false);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        setApiData([]);
        setLoading(false);
        handleError(error, dispatch, { api: "api/designStaging" });
      });
  }

  function setFilters(tempPageNo) {
    let url = "api/designStaging?"
    if (page !== "") {
        if (!tempPageNo) {
            url = url + "page=" + 1
  
        } else {
            url = url + "page=" + tempPageNo
        }
    }
    const serchingData = props.location && props.location.state ? props.location.state.search : searchData
    if(serchingData.name !== "") {
        url = url + "&name=" + serchingData.name
    }
    if(serchingData.numOfProduct !== "") {
      url = url + "&count=" + serchingData.numOfProduct
  }
    if (!tempPageNo) {
      getStagingDesingsList(url);
    } else {
         if (count > apiData.length) {
          getStagingDesingsList(url);
        } 
    }
  }
  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage +1) * 10 > apiData.length) {
        setFilters(Number(newPage + 1))
    }
}

useEffect(()=>{
  if(props.location && props.location.state && props.location.state.iseditView){
    if(apiData.length > 0 && page && count){
      setFilters(Number(page + 1));
    }
  }
},[apiData,page,count])

  const redirectToAddPage = () => {
    History.push("/dashboard/mobappadmin/addprimaryallocation", {
      id: "",
      isViewOnly: false,
      isEdit: false,
      page : page,
      search : searchData,
      count : count,
      apiData : apiData
    });
  };

  const editHandler = (id) => {
    History.push("/dashboard/mobappadmin/addprimaryallocation", {
      id: id,
      isViewOnly: false,
      isEdit: true,
      page : page,
      search : searchData,
      count : count,
      apiData : apiData
    });
  };

  const viewHandler = (id) => {
    History.push("/dashboard/mobappadmin/addprimaryallocation", {
      id: id,
      isViewOnly: true,
      isEdit: false,
      page : page,
      search : searchData,
      count : count,
      apiData : apiData
    });
  };

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
                    Primary Allocation
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
                <Button
                  className={classes.button}
                  size="small"
                  onClick={(event) => {
                    //   setDefaultView(btndata.id);
                    // setDesignFlag(true);
                    redirectToAddPage();
                  }}
                >
                  Add New
                </Button>
              </Grid>
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
                            Name
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            No. of Products
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
                              name="name"
                              onChange={handleSearchData}
                              inputProps={{
                                className:
                                  "all-Search-box-data all-Search-box-data-input",
                              }}
                            />
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <TextField
                              name="numOfProduct"
                              onChange={handleSearchData}
                              inputProps={{
                                className:
                                  "all-Search-box-data all-Search-box-data-input",
                              }}
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
                            if (searchData.name) {
                              return temp.name
                                .toLowerCase()
                                .includes(searchData.name.toLowerCase());
                            } else if (searchData.numOfProduct) {
                              return String(temp.count)
                                .toLowerCase()
                                .includes(
                                  searchData.numOfProduct.toLowerCase()
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
                                {row.name}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.count}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    editHandler(row.id);
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
                                    viewHandler(row.id);
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
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Alert!!!"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this record?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteStagingDesignApi}
                  color="primary"
                  autoFocus
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

export default PrimaryAllocation;

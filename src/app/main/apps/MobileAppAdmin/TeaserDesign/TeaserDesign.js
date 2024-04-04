import React, { useState, useEffect } from "react";
import { TablePagination, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
import { Link } from "react-router-dom";
import Loader from "../../../Loader/Loader";
import AddDesigns from "../AddDesignsComponent/AddDesigns";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
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
}));

const TeaserDesign = (props) => {
  const [selectedIdForDelete, setSelectedIdForDelete] = useState([]);

  const [apiData, setApiData] = useState([]);
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const theme = useTheme();

  const [designFlag, setDesignFlag] = useState(false);

  const [MasterChecked, setMasterChecked] = useState(false);
  const [buttonVisisble, setButtonVisisble] = useState(false);
  const [searching, setSearching] = useState(false);

  const [searchData, setSearchData] = useState({
    category: "",
    desingNo: "",
    showInApp: "",
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
          History.replace("/dashboard/mobappadmin/exhibitionmaster", null)
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
  }, [searchData])

  function deleteHandler(id) {
    setSelectedIdForDelete([id]);
    setOpen(true);
  }

  function handleClose() {
    setSelectedIdForDelete([]);
    setOpen(false);
  }

  function deleteAllEntry() {
    let delArr = [];
    apiData.map((item) => {
      if (item.selected) {
        delArr.push(item.design_id);
      }
    });
    setSelectedIdForDelete(delArr);
    setOpen(true);
  }

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (MasterChecked) {
      setButtonVisisble(true);
    } else {
      setButtonVisisble(false);
    }
  }, [MasterChecked]);

  function callDeleteTeaserDesignApi() {
    setLoading(true);
    const haveMany = apiData.length > 1 ? true : false;
    apiData.splice((page*rowsPerPage))
    setApiData(apiData)
    const body = {
      designsList: selectedIdForDelete,
    };
    console.log(body);

    axios
      .post(Config.getCommonUrl() + "api/teaserDesigns/removeDesigns", body)
      .then(function (response) {
        console.log(response);
        setLoading(false);
        setOpen(false);
        setButtonVisisble(false);
        if (response.data.success === true) {
          if(haveMany){
            setFilters(Number(page+1));
          }else{
            setSearching(false);
            getTeaserDesingsList(`api/teaserDesigns/listTeaserDesigns?page=1`)
            setSearchData({
              category: "",
              desingNo: "",
              showInApp: "",
            })
          }
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setSelectedIdForDelete([]);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        setOpen(false);
        setButtonVisisble(false);
        handleError(error, dispatch, {
          api: "api/teaserDesigns/removeDesigns",
          body: body,
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

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    getTeaserDesingsList();
    //eslint-disable-next-line
  }, [dispatch]);

  function getTeaserDesingsList() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/teaserDesigns/listTeaserDesigns")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          setCount(Number(response.data.count))
          let tempApiData = tempData.map((x) => {
            return {
              ...x,
              status: x.design?.show_in_app == "1" ? "Yes" : "No",
              selected: false,
            };
          });
          setApiData(tempApiData);
          setLoading(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setApiData([]);
          setLoading(false);
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/teaserDesigns/listTeaserDesigns",
        });
      });
  }

  function setFilters(tempPageNo) {

    let url = "api/teaserDesigns/listTeaserDesigns?"
    if (page !== "") {
        if (!tempPageNo) {
            url = url + "page=" + 1
  
        } else {
            url = url + "page=" + tempPageNo
        }
    }
    if(searchData.category !== "") {
      url = url + "&category_name=" + searchData.category
  }
   if(searchData.desingNo !== "") {
    url = url + "&variant_number=" + searchData.desingNo
}
if(searchData.showInApp !== "") {
    url = url + "&show_in_app=" + searchData.showInApp.value
}
    console.log(url,"---------",tempPageNo)
    if (!tempPageNo) {
      getTeaserDesingsList(url);
    } else {
         if (count > apiData.length) {
            getTeaserDesingsList(url);
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

const handlegenderChange = (value) => {
  setSearchData((prevState)=>({
    ...prevState , ['showInApp'] : value ? value : ''
  }))
}
const genderArr = [
  {value : 0, label : "No"},
  {value: 1 , label: "Yes"},
]


  function onMasterCheck(e) {
    let tempList = apiData;
    tempList.map((user) => (user.selected = e.target.checked));

    setMasterChecked(e.target.checked);
    setApiData(tempList);
  }

  function onItemCheck(e, item) {
    let tempList = apiData; //this.state.List;
    let temp = tempList.map((row) => {
      if (row.id === item.id) {
        row.selected = e.target.checked;
      }
      return row;
    });

    const totalItems = apiData.length;
    const totalCheckedItems = temp.filter((e) => e.selected).length;
    if (totalCheckedItems !== 0) {
      setButtonVisisble(true);
    } else {
      setButtonVisisble(false);
    }
    setApiData(temp);
    setMasterChecked(totalItems === totalCheckedItems);
  }

  function handleDesignClose(callApi) {
    setDesignFlag(false);
    if (callApi) {
      getTeaserDesingsList();
    }
  }

  function handleDesignSubmit(data) {
    console.log("handleDesignSubmit", data);
    // setDesignData([...designData, ...data])
    // console.log([...designData, ...data])
    // let tempData = [...designData, ...data]
    addTeaserDesign(data);
    setApiData([])
    setCount(0)
    setPage(0)
    // setFilters();
    console.log(apiData,open,count);
  }

  function addTeaserDesign(listData) {
    let data = {
      designsList: listData.map((x) => x.id),
    };
    axios
      .post(Config.getCommonUrl() + "api/teaserDesigns/addDesigns", data)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
         
          setDesignFlag(false);
          getTeaserDesingsList();

          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/teaserDesigns/addDesigns",
          body: data,
        });
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 ">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0, marginTop: "15px" }}
            >
              <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Teaser Design
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
                style={{ textAlign: "right", paddingRight: "17px" }}
              >
                <Link
                  //   to="/dashboard/mobappadmin/adduser"
                  to="#"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button
                    className={classes.button}
                    size="small"
                    onClick={(event) => {
                      //   setDefaultView(btndata.id);
                      setDesignFlag(true);
                    }}
                  >
                    Add Products
                  </Button>
                </Link>
                <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  style={
                    buttonVisisble
                      ? { backgroundColor: "#696969", color: "#FFFFFF" }
                      : null
                  }
                  disabled={!buttonVisisble}
                  onClick={() => {
                    deleteAllEntry();
                  }}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll">
              <Paper className={classes.tabroot} id="department-tbl-fix ">
                <div
                  className="table-responsive "
                  style={{ maxHeight: "calc(100vh - 219px)" }}
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
                        <TableCell className={classes.tableRowPad}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={MasterChecked}
                            id="mastercheck"
                            onChange={(e) => onMasterCheck(e)}
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Categories
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Item Code
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Image
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Show In App
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Actions
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {/* Categories */}
                          <TextField
                            name="category"
                            onChange={handleSearchData}
                            value={searchData.category}
                            inputProps={{ className: "all-Search-box-data" }}
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {/* Design No. */}
                          <TextField
                            name="desingNo"
                            onChange={handleSearchData}
                            value={searchData.desingNo}
                            inputProps={{ className: "all-Search-box-data" }}
                          />
                        </TableCell>

                        <TableCell
                          className={classes.tableRowPad} align="left">
                        </TableCell>
                       
                       {/* <TableCell className={classes.tableRowPad} align="left">
                        <Select
                            styles={{ selectStyles }}
                            options={genderArr.map((group) => ({
                                value: group.value,
                                label: group.label,
                            }))}
                            isClearable
                            value={searchData.showInApp}
                            filterOption={createFilter({ ignoreAccents: false })}
                            onChange={handlegenderChange}
                            />
                        </TableCell> */}

                        <TableCell className={classes.tableRowPad} align="left">
                          <TextField
                            name="showInApp"
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
                          // category: "",
                          // desingNo: "",
                          if (searchData.category) {
                            return temp.design.Category.category_name
                              .toLowerCase()
                              .includes(searchData.category.toLowerCase());
                          } else if (searchData.desingNo) {
                            return temp.design.variant_number
                              .toLowerCase()
                              .includes(searchData.desingNo.toLowerCase());
                          } else if (searchData.showInApp) {
                            return temp.status
                              .toString()
                              .toLowerCase()
                              .includes(searchData.showInApp.toLowerCase());
                          } else {
                            return temp;
                          }
                        })
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <TableRow key={row.id}>
                            {/* component="th" scope="row" */}
                            <TableCell className={classes.tableRowPad}>
                              <input
                                type="checkbox"
                                checked={row.selected}
                                className="form-check-input"
                                id="rowcheck{user.id}"
                                onChange={(e) => onItemCheck(e, row)}
                              />
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.design.Category.category_name}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.design.variant_number}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.design.hasOwnProperty("image_files") &&
                                row.design.image_files.length > 0 && (
                                  <img
                                    src={row.design.image_files[0].ImageURL}
                                    height={50}
                                    width={50}
                                  />
                                )}
                            </TableCell>
                            <TableCell
                              align="center"
                              className={classes.tableRowPad}
                            >
                              {row.status}
                            </TableCell>
                            <TableCell
                             className={classes.tableRowPad}>
                              <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  deleteHandler(row.design_id);
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
                  onClick={callDeleteTeaserDesignApi}
                  className="delete-dialog-box-delete-button"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            {designFlag && (
              <AddDesigns
                handleClose={handleDesignClose}
                handleSubmit={handleDesignSubmit}
                showFileUpload={true}
              />
            )}
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default TeaserDesign;

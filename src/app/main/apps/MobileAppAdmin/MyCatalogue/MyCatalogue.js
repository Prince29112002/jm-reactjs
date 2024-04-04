import React, { useState, useEffect } from "react";
import { Icon, IconButton, TablePagination, Typography } from "@material-ui/core";
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
import { TextField } from "@material-ui/core";
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

const useStyles = makeStyles((theme) => ({
  root: {},
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
}));


const MyCatalogue = (props) => {

  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [searchData, setSearchData] = useState({
      name: "",
      expDt: "",
      numOfProduct:"",
  });

  const [apiData, setApiData] = useState([]);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);


  function editHandler(row, index) {
      console.log("editHandler", row);
      // setSelectedIdForEdit(row.id);
      apiData[index].menuOpen = false
      props.history.push("/dashboard/mobappadmin/addcatalogue", {
          row: row,
          isViewOnly: false,
          isEdit: true,
           page : page,
          search : searchData,
          count : count,
          apiData : apiData
      });
  }

  useEffect(() => {
      NavbarSetting('Mobile-app Admin', dispatch)
      //eslint-disable-next-line
  }, [])

  function viewHandler(row, index) {
      console.log("editHandler", row);
      // setSelectedIdForEdit(row.id);
      apiData[index].menuOpen = false
      props.history.push("/dashboard/mobappadmin/addcatalogue", {
          row: row,
          isViewOnly: true,
          isEdit: false,
           page : page,
          search : searchData,
          count : count,
          apiData : apiData
      });
  }

  function handleOpenUrl(id) {
      handleClose()
      window.open(Config.getCatalogUrl() + `catalogues/${id}`);
  }

  function sendEmail(rowData, index) {
      apiData[index].menuOpen = false
      console.log(rowData);
      const body = {
          selection_type: rowData.user_selection_type,
          catalogue_id: rowData.id,
          // link: Config.getSiteUrl() + `viewcatalogue/mycatalogue/${rowData.id}`
          link: Config.getCatalogUrl() + `catalogues/${rowData.id}`
      }
      console.log(body);
      setLoading(true);
      axios
          .post(Config.getCommonUrl() + "api/catalogue/mobileapp/mail", body)
          .then(function (response) {
              if (response.data.success === true) {
                  console.log(response);
                  let tempData = response.data.data;
                  dispatch(Actions.showMessage({ message: response.data.message }));
                  setLoading(false);
                  // setData(response.data);
              } else {
                  dispatch(Actions.showMessage({ message: response.data.message }));
              }
          })
          .catch(function (error) {
              setLoading(false);
              handleError(error, dispatch, { api: "api/catalogue/mobileapp/mail", body: body })
          });
  }

  useEffect(() =>{
      console.log(props,"999999999999")
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
            window.history.replaceState(null, null, '/dashboard/mobappadmin/mycatalogue');
            // History.replace("/dashboard/mobappadmin/mycatalogue", null)
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
      console.log("useEffect");
      // getAllCatalogues()
      //eslint-disable-next-line
  }, [dispatch]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  // const open = Boolean(anchorEl);

  // const [open, setOpen] = useState([])

  const handleClick = (event, index) => {
      console.log(index)
      setAnchorEl(event.currentTarget);
      let temp = [...apiData]

      let tempArr = temp.map((item, ind) => {
          if (index === ind) {
              return {
                  ...item,
                  menuOpen: true
              }
          } else {
              return {
                  ...item,
                  menuOpen: false
              }
          }

      })
      setApiData(tempArr)
      console.log(tempArr)

  };
  const handleClose = () => {
      setAnchorEl(null);
      let temp = [...apiData]

      let tempArr = temp.map((item, ind) => {

          return {
              ...item,
              menuOpen: false
          }


      })
      setApiData(tempArr)
  };

  function getAllCatalogues(url) {
      setLoading(true);
      axios
          .get(Config.getCommonUrl() + url)
          .then(function (response) {
              if (response.data.success === true) {
                  console.log(response);
                  let tempData = response.data.data;
                  setCount(Number(response.data.count))

                  let tempApiData = tempData.map(x => {
                      return {
                          ...x,
                          menuOpen: false
                      }
                  })
                   if (apiData.length === 0) {
                      console.log("if")
                     setApiData(tempApiData)
                 } else {
                      console.log("else", apiData)
                     // setApiData(...apiData, ...rows)
                     setApiData((apiData) => [...apiData, ...tempApiData]);
                     // console.log([...apiData, ...rows])
                 }
                  // console.log(tempApiData)
                  // setApiData(tempApiData);
                  setLoading(false);
                  // setData(response.data);
              } else {
                  dispatch(Actions.showMessage({ message: response.data.message }));
              }
          })
          .catch(function (error) {
              setLoading(false);
              handleError(error, dispatch, { api: url })
          });
  }
function setFilters(tempPageNo) {

      let url = "api/catalogue?"
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
      if(serchingData.expDt !== "") {
          url = url + "&expiry_date=" + moment(serchingData.expDt).format("DD-MM-YYYY");        }
      if(serchingData.numOfProduct !== "") {
          url = url + "&count=" + serchingData.numOfProduct
      }
      console.log(url,"---------",tempPageNo)
    
      if (!tempPageNo) {
        getAllCatalogues(url);
      } else {
           if (count > apiData.length) {
              getAllCatalogues(url);
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
  const handleSearchData = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      // console.log(name,value)
      // const searchItem = searchData;
      setSearchData((prevState) => ({
          ...prevState, [name]: value
      })
      );
      setSearching(true);
  }
  useEffect(()=>{
      if(props.location && props.location.state && props.location.state.iseditView){
        if(apiData.length > 0 && page && count){
          setFilters(Number(page + 1));
        }
      }
    },[apiData,page,count])
  function callDeleteApi() {
      const haveMany = apiData.length > 1 ? true : false;
      apiData.splice((page*rowsPerPage))
      setApiData(apiData)
      axios
          .delete(Config.getCommonUrl() + "api/catalogue/" + selectedIdForDelete)
          .then(function (response) {
              console.log(response);
              setDeleteOpen(false);
              // setFilters(Number(page+1))
              if (response.data.success === true) {
                  dispatch(Actions.showMessage({ message: response.data.message }));
                  setSelectedIdForDelete("");
                  if(haveMany){
                      setFilters(Number(page+1));
                    }else{
                      setSearching(false);
                      getAllCatalogues(`api/catalogue?page=1`)
                      setSearchData({
                          name: "",
                          expDt: "",
                          numOfProduct:"",
                      })
                    }
              } else {
                  dispatch(Actions.showMessage({ message: response.data.message }));
              }
          })
          .catch((error) => {
              setDeleteOpen(false);
              setFilters(Number(page+1))
              handleError(error, dispatch, { api: "api/catalogue/" + selectedIdForDelete })
          });
  }

  function deleteHandler(id) {
      console.log("deleteHandler", id);
      handleClose()
      setSelectedIdForDelete(id);
      setDeleteOpen(true);
  }

  function handlePDf(id) {
      handleClose()
      console.log(id)
      setLoading(true)
      axios
          .get(Config.getCommonUrl() + "api/catalogue/get-pdf/" + id)
          .then(function (response) {
              console.log(response.data);
              if (response.data.success === true) {
                  let data = response.data.data;
                  if (data.hasOwnProperty("pdf_url")) {
                      let downloadUrl = data.pdf_url;
                      // window.open(downloadUrl);
                      const link = document.createElement("a");
                      link.setAttribute('target', '_blank');
                      link.href = downloadUrl;
                      link.click();
                  }
                  
              } else {
                  dispatch(Actions.showMessage({ message: response.data.message }));
              }
              setLoading(false);
          })
          .catch(function (error) {
              setLoading(false);
              handleError(error, dispatch, { api: "api/catalogue/get-pdf/" + id })

          });
  }

  function handleDeleteClose() {
      setSelectedIdForDelete("");
      setDeleteOpen(false);
  }


  
  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
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
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    My Catalogue
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
                  // to="#"
                  to={{
                    pathname: "/dashboard/mobappadmin/addcatalogue",
                    state: {
                      row: "",
                      isViewOnly: false,
                      isEdit: false,
                    },
                  }}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button
                    id="btn-save"
                    variant="contained"
                    // className={classes.button}
                    size="small"
                    onClick={(event) => {
                      //   setDefaultView(btndata.id);
                      //   setIsEdit(false);
                    }}
                  >
                    Add Catalogue
                  </Button>
                </Link>
              </Grid>
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll ">
              <div className="department-tbl-mt-dv">
                <Paper className={classes.tabroot} id="department-tbl-fix ">
                  <div
                    className="table-responsive "
                    style={{ maxHeight: "calc(100vh - 235px)" }}
                  >
                      <TablePagination
                           // rowsPerPageOptions={[5, 10, 25]}
                           labelRowsPerPage=''
                           component="div"
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
                           />

                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          {/* <TableCell className={classes.tableRowPad}>

                                                </TableCell> */}
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
                            Expiry Date
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            No. of Products
                          </TableCell>
                          {/* <TableCell className={classes.tableRowPad} align="left">
                                                    Catalogues Type
                                                </TableCell> */}
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                            style={{ paddingRight: "94px" }}
                          >
                            Action
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          {/* <TableCell className={classes.tableRowPad}></TableCell> */}
                          <TableCell className={classes.tableRowPad}>
                            {/* Name */}

                            <TextField
                              name="name"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            {/* expDt */}
                            <TextField
                              name="expDt"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <TextField
                              name="numOfProduct"
                              onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          {/* <TableCell className={classes.tableRowPad} align="left">
                                                    Catalogues Type
                                                </TableCell> */}
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            {/* Actions */}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {apiData
                          .filter((temp) => {
                            if (searchData.name) {
                              return temp.name
                                .toLowerCase()
                                .includes(searchData.name.toLowerCase());
                            } else if (searchData.expDt) {
                              return temp.expiry_date
                                .toLowerCase()
                                .includes(searchData.expDt.toLowerCase());
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
                          .map((row, index) => (
                            <TableRow key={row.id}>
                              {/* <TableCell className={classes.tableRowPad}>

                                                        </TableCell> */}
                              <TableCell className={classes.tableRowPad}>
                                {row.name}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {moment
                                  .utc(row.expiry_date)
                                  .local()
                                  .format("DD-MM-YYYY")}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.count}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <IconButton
                                  style={{ padding: "0", float: "right" }}
                                  id={`menu_item${row.id}-2`}
                                  onClick={() => deleteHandler(row.id)}
                                >
                                  <Icon className="mr-8 delete-icone">
                                    <img src={Icones.delete_red} alt="" />
                                  </Icon>
                                </IconButton>
                                <IconButton
                                  style={{ padding: "0", float: "right" }}
                                  id={`menu_item${row.id}-5`}
                                  onClick={() => sendEmail(row)}
                                >
                                  <Icon className="mr-8 email-icone">
                                    <img src={Icones.email} alt="" />
                                  </Icon>
                                </IconButton>
                                <IconButton
                                  style={{ padding: "0", float: "right" }}
                                  id={`menu_item${row.id}-4`}
                                  onClick={() => handleOpenUrl(row.id)}
                                >
                                  <Icon className="mr-8 link-icone">
                                    <img src={Icones.link} alt="" />
                                  </Icon>
                                </IconButton>
                                <IconButton
                                  style={{ padding: "0", float: "right" }}
                                  id={`menu_item${row.id}-3`}
                                  onClick={() => handlePDf(row.id)}
                                >
                                  <Icon className="mr-8 pdf-icone">
                                    <img src={Icones.view_pdf} alt="" />
                                  </Icon>
                                </IconButton>
                                <IconButton
                                  style={{ padding: "0", float: "right" }}
                                  id={`menu_item${row.id}-0`}
                                  onClick={() => viewHandler(row, index)}
                                >
                                  <Icon className="mr-8 view-icone">
                                    <img src={Icones.view} alt="" />
                                  </Icon>
                                </IconButton>
                                <IconButton
                                  style={{ padding: "0", float: "right" }}
                                  id={`menu_item${row.id}-1`}
                                  onClick={() => editHandler(row, index)}
                                >
                                  <Icon className="mr-8 edit-icone">
                                    <img src={Icones.edit} alt="" />
                                  </Icon>
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>

                    <TablePagination
                          // rowsPerPageOptions={[5, 10, 25]}
                          labelRowsPerPage=''
                          component="div"
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
                          />

                  </div>
                </Paper>
              </div>
            </div>
            <Dialog
              open={deleteOpen}
              onClose={handleDeleteClose}
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
                  onClick={handleDeleteClose}
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
                  onClick={handleDeleteClose}
                  className="delete-dialog-box-cancle-button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteApi}
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

export default MyCatalogue;

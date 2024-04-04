import React, { useState, useEffect } from "react";
import { TablePagination, Typography } from "@material-ui/core";
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
import { TextField } from "@material-ui/core";
import { Link } from "react-router-dom";
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import useSortableData from "../../Stock/Components/useSortableData";
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
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
}));


const RetailerMaster = (props) => {

  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [apiData, setApiData] = useState([]);
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0)
  const [MasterChecked, setMasterChecked] = useState(false)
  const [searching, setSearching] = useState(false);

  const [searchData, setSearchData] = useState({
      companyNm: "",
      city: "",
      mobNo: "",
      email: "",
  });
  console.log(searchData);

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  function editHandler(row) {
      props.history.push("/dashboard/mobappadmin/createretailer", {
          row: row.id,
          isViewOnly: false,
          isEdit: true,
          page : page,
          search : searchData,
          count : count,
          apiData : apiData
      });
  }

  function viewHandler(row) {
      props.history.push("/dashboard/mobappadmin/createretailer", {
          row: row.id,
          isViewOnly: true,
          isEdit: false,
          page : page,
          search : searchData,
          count : count,
          apiData : apiData
      });
  }

  function deleteHandler(id) {
      setSelectedIdForDelete(id);
      setOpen(true);
  }

  function handleClose() {
      setSelectedIdForDelete("");
      setOpen(false);
  }

  function deleteRetailerMaster() {
      const haveMany = apiData.length > 1 ? true : false;
      apiData.splice((page*rowsPerPage))
      setApiData(apiData)
      axios
          .delete(Config.getCommonUrl() + "api/retailerMaster/" + selectedIdForDelete)
          .then(function (response) {
              console.log(response);
              setOpen(false);
              if (response.data.success === true) {
                  if(haveMany){
                      setFilters(Number(page+1));
                    }else{
                      setSearching(false);
                      getRetailerMasterData(`api/retailerMaster?page=1`)
                      setSearchData({
                          companyNm: "",
                          city: "",
                          mobNo: "",
                          email: "",
                      })
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
              handleError(error, dispatch, { api: "api/retailerMaster/" + selectedIdForDelete })
          });
  }

  useEffect(() => {
      if (loading) {
          setTimeout(() => setLoading(false), 7000);
      }
  }, [loading]);

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
            // /dashboard/mobappadmin/createretailer
            // History.back("/dashboard/mobappadmin/retailermaster", null)
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

    useEffect(()=>{
      if(props.location && props.location.state && props.location.state.iseditView){
        if(apiData.length > 0 && page && count){
          console.log("inn99999999")
          setFilters(Number(page + 1));
        }
      }
    },[apiData,page,count])

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
    },[searchData])

  function getRetailerMasterData(url) {
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
                          selected: false,
                          city_name: x.city_name?.name
                      }
                  })
                  console.log(tempApiData)
                  if (apiData.length === 0) {
                       console.log("if")
                      setApiData(tempApiData)
                  } else {
                       console.log("else", apiData)
                      // setApiData(...apiData, ...rows)
                      setApiData((apiData) => [...apiData, ...tempApiData]);
                      // console.log([...apiData, ...rows])
                  }
                  setLoading(false);
                  // setApiData(tempApiData);
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
      let url = "api/retailerMaster?"
      if (page !== "") {
          if (!tempPageNo) {
              url = url + "page=" + 1
    
          } else {
              url = url + "page=" + tempPageNo
          }
      }
      const serchingData = props.location && props.location.state ? props.location.state.search : searchData
      if(serchingData.email !== "") {
          url = url + "&company_email_for_orders=" + serchingData.email
      }
      if(serchingData.mobNo !== "") {
          url = url + "&company_mob=" + serchingData.mobNo
      }
      if(serchingData.city !== "") {
          url = url + "&city_id=" + serchingData.city
      }
      if(serchingData.companyNm !== "") {
          url = url + "&company_name=" + serchingData.companyNm
      }
    
      console.log(url,"---------",tempPageNo)
    
      if (!tempPageNo) {
        console.log("innnnnnnnnnnnnnn444444")
        getRetailerMasterData(url);
      } else {
           if (count > apiData.length) {
              getRetailerMasterData(url);
          } 
      }
    }

  function onMasterCheck(e) {
      let tempList = apiData;
      // Check/ UnCheck All Items
      tempList.map((user) => (user.selected = e.target.checked));

      //Update State
      setMasterChecked(e.target.checked);
      setApiData(tempList);

      console.log(tempList)
      // this.setState({
      //     MasterChecked: e.target.checked,
      //     List: tempList,
      //     SelectedList: this.state.List.filter((e) => e.selected),
      // });
  }

  // Update List Item's state and Master Checkbox State
  function onItemCheck(e, item) {
      // console.log("onItemCheck---------", item)
      let tempList = apiData//this.state.List;
      let temp = tempList.map((row) => {
          // console.log(row)
          if (row.id === item.id) {
              console.log("match")
              row.selected = e.target.checked;
          }
          return row;
      });

      //To Control Master Checkbox State
      const totalItems = apiData.length;
      const totalCheckedItems = temp.filter((e) => e.selected).length;
      setApiData(temp);
      setMasterChecked(totalItems === totalCheckedItems);

      // Update State
      // this.setState({
      //     MasterChecked: totalItems === totalCheckedItems,
      //     List: tempList,
      //     SelectedList: this.state.List.filter((e) => e.selected),
      // });
  }

  const handleSearchData = (event) => {
      console.log(event.target.value, event.target.name)

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
  // console.log(apiData.length);

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
                    Retailer Master
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
                  // to=""
                  to={{
                    pathname: "/dashboard/mobappadmin/createretailer",
                    state: {
                      row: "",
                      isViewOnly: false,
                      isEdit: false,
                    },
                  }}
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
                    Create Company
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
            <div className="main-div-alll ">
              <div className=" mt-8 department-tbl-mt-dv">
                <Paper className={classes.tabroot} id="department-tbl-fix ">
                  <div
                    className="table-responsive "
                    style={{ maxHeight: "calc(100vh - 235px)" }}
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
                            Company Name
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
                            Mobile Number
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
                            Action
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          {/* <TableCell className={classes.tableRowPad}></TableCell> */}
                          <TableCell className={classes.tableRowPad}>
                            {/* Company Name */}

                            <TextField
                              name="companyNm"
                              onChange={handleSearchData}
                              inputProps={{
                                className:
                                  "all-Search-box-data all-Search-box-data-input",
                              }}
                            />

                            <IconButton
                              style={{ padding: "10px" }}
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
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            {/* City */}
                            <TextField
                              name="city"
                              onChange={handleSearchData}
                              inputProps={{
                                className:
                                  "all-Search-box-data all-Search-box-data-input",
                              }}
                            />

                            <IconButton
                              style={{ padding: "10px" }}
                              onClick={() => requestSort("city_name")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "city_name" &&
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
                                sortConfig.key === "city_name" &&
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
                            {/* Mobile Number */}
                            <TextField
                              name="mobNo"
                              onChange={handleSearchData}
                              inputProps={{
                                className:
                                  "all-Search-box-data all-Search-box-data-input",
                              }}
                            />

                            <IconButton
                              style={{ padding: "10px" }}
                              onClick={() => requestSort("company_mob")}
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "company_mob" &&
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
                                sortConfig.key === "company_mob" &&
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
                            {/* Email-id */}
                            <TextField
                              name="email"
                              onChange={handleSearchData}
                              inputProps={{
                                className:
                                  "all-Search-box-data all-Search-box-data-input",
                              }}
                            />

                            <IconButton
                              style={{ padding: "10px" }}
                              onClick={() =>
                                requestSort("company_email_for_orders")
                              }
                            >
                              <Icon className="mr-8" style={{ color: "#000" }}>
                                {" "}
                                sort{" "}
                              </Icon>

                              {sortConfig &&
                                sortConfig.key === "company_email_for_orders" &&
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
                                sortConfig.key === "company_email_for_orders" &&
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
                            if (searchData.companyNm) {
                              //&& temp.category_name
                              return temp.company_name
                                .toLowerCase()
                                .includes(searchData.companyNm.toLowerCase());
                            } else if (searchData.city) {
                              return temp.city_name
                                .toLowerCase()
                                .includes(searchData.city.toLowerCase());
                            } else if (searchData.mobNo) {
                              return temp.company_mob
                                .toLowerCase()
                                .includes(searchData.mobNo.toLowerCase());
                            } else if (searchData.email) {
                              return temp.company_email_for_orders
                                .toLowerCase()
                                .includes(searchData.email.toLowerCase());
                            } else {
                              return temp;
                            }
                          })
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                                {row.company_name}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.city_name}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {/* {row.company_mob} */}
                                {row.country_name?.phonecode === undefined ? + row.company_mob : "+" +row.country_name?.phonecode + " " + row.company_mob }
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.company_email_for_orders}
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
                  onClick={deleteRetailerMaster}
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

export default RetailerMaster;

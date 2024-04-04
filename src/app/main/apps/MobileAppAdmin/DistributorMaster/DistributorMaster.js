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


const DistributorMaster = (props) => {

  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [apiData, setApiData] = useState([]);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const [MasterChecked, setMasterChecked] = useState(false)

  const [searchData, setSearchData] = useState({
    partyName: "",
    type: "",
    CompanyNm: "",
    city: "",
    mobNo: "",
    email: "",
  });

  useEffect(() => {
    NavbarSetting('Mobile-app Admin', dispatch)
    //eslint-disable-next-line
  }, [])

  function editHandler(row) {
    console.log("editHandler", row);
    props.history.push("/dashboard/mobappadmin/createdistributor", {
      row: row.id,
      isViewOnly: false,
      page : page,
      search : searchData,
      count : count,
      apiData : apiData
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
          // History.replace("/dashboard/mobappadmin/distributormaster", null)
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
  // function viewHandler(row) {
  //   console.log("viewHandler", row);

  //   props.history.push("/dashboard/masters/editclient", {
  //     row: row,
  //     isViewOnly: true,
  //   });
  // }

  // function deleteHandler(id) {
  //   console.log("deleteHandler", id);
  //   setSelectedIdForDelete(id);
  //   setOpen(true);
  // }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function callDeleteClientApi() {
    axios
      .delete(Config.getCommonUrl() + "api/client/" + selectedIdForDelete)
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {

          dispatch(Actions.showMessage({ message: response.data.message }));
          setSelectedIdForDelete("");
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        // console.log(error);
        setOpen(false);
        handleError(error, dispatch, { api: "api/client/" + selectedIdForDelete })

      });
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    console.log("useEffect");
    // getClients();
    // getting list of ALL clients
    //eslint-disable-next-line
  }, [dispatch]);

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

  useEffect(() => {
    console.log("useEffect");
    // getDistributorMasterData();
    //eslint-disable-next-line
  }, [dispatch]);

  function getDistributorMasterData(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          let tempApiData = tempData.map(x => {
            setCount(Number(response.data.count))
            let comp = x.clientCompanies.length > 0 && x.companyId ? x.clientCompanies.filter(y => {
              return y.id === x.companyId.company_id
            }) : "";

            return {
              ...x,
              // toBeSelect: x.clientCompanies.length > 0 ? true : false,
              companyDetails: comp,
              selected: false,//below keys are used for sorting purpose
              email: x.companyId ? x.companyId.distibutor_master_email : "",
              mobNo: x.clientContacts.length > 0 ? x.clientContacts[0].number : "",
              cityNm: comp.length > 0 ? comp[0].CityName.name : "",
              compNm: comp.length > 0 ? comp[0].company_name : "",
            }
          })
console.log(tempApiData);

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
        handleError(error, dispatch, { api: url})
      });
  }
  function setFilters(tempPageNo) {

    let url = "api/client/all/client?"    
    if (page !== "") {
        if (!tempPageNo) {
            url = url + "page=" + 1
        } else {
            url = url + "page=" + tempPageNo
        }
    }
    const serchingData = props.location && props.location.state ? props.location.state.search : searchData
    if(serchingData.partyName !== "") {
        url = url + "&name=" + serchingData.partyName
    }
    if(serchingData.type !== "") {
        url = url + "&typeIdName=" + serchingData.type
    }
    if(serchingData.city !== "") {
        url = url + "&cityName=" + serchingData.city
    }
    if(serchingData.CompanyNm !== "") {
        url = url + "&company_name=" + serchingData.CompanyNm
    }
    if(serchingData.mobNo !== "") {
      url = url + "&number=" + serchingData.mobNo
  }
  if(serchingData.email !== "") {
    url = url + "&email=" + serchingData.email
}
    console.log(url,"---------",tempPageNo)
    if (!tempPageNo) {
      console.log("innnnnnnnnnnnnnn444444")
      getDistributorMasterData(url);
    } else {
         if (count > apiData.length) {
          getDistributorMasterData(url);
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
                    Distributor Master
                  </Typography>
                </FuseAnimate>
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
                        <TableCell className={classes.tableRowPad} align="left">
                          Party Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Type
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Company Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          City
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Mobile No
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Email-id
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Actions
                        </TableCell>
                      </TableRow>
                      
                      <TableRow>
                        {/* <TableCell className={classes.tableRowPad}></TableCell> */}
                        <TableCell className={classes.tableRowPad}>
                          {/* Party Name */}

                          <TextField 
                                    name="partyName" 
                                    onChange={handleSearchData} 
                                    inputProps={{ className: "all-Search-box-data" }}  
                                    value={searchData.partyName} />
                          <IconButton style={{ padding: "10px" }} onClick={() => requestSort('name')} >
                            <Icon className="mr-8" style={{ color: "#000" }}> sort  </Icon>

                            {(sortConfig && sortConfig.key === "name" && sortConfig.direction === "ascending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                            }
                            {(sortConfig && sortConfig.key === "name" && sortConfig.direction === "descending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                            }
                          </IconButton>
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {/* Type */}
                          <TextField 
                                    name="type" 
                                    onChange={handleSearchData} 
                                    inputProps={{ className: "all-Search-box-data" }}  
                                    value={searchData.type}/>

                          <IconButton style={{ padding: "10px" }} onClick={() => requestSort('type_name')} >
                            <Icon className="mr-8" style={{ color: "#000" }}> sort  </Icon>

                            {(sortConfig && sortConfig.key === "type_name" && sortConfig.direction === "ascending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                            }
                            {(sortConfig && sortConfig.key === "type_name" && sortConfig.direction === "descending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                            }
                          </IconButton>
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {/* company */}
                          <TextField 
                                    name="CompanyNm" 
                                    onChange={handleSearchData} 
                                    inputProps={{ className: "all-Search-box-data" }} 
                                    value={searchData.CompanyNm}/>

                          <IconButton style={{ padding: "10px" }} onClick={() => requestSort('compNm')} >
                            <Icon className="mr-8" style={{ color: "#000" }}> sort  </Icon>

                            {(sortConfig && sortConfig.key === "compNm" && sortConfig.direction === "ascending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                            }
                            {(sortConfig && sortConfig.key === "compNm" && sortConfig.direction === "descending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                            }
                          </IconButton>
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {/* City */}
                          <TextField 
                                    name="city" 
                                    onChange={handleSearchData} 
                                    inputProps={{ className: "all-Search-box-data" }} 
                                    value={searchData.city} />

                          <IconButton style={{ padding: "10px" }} onClick={() => requestSort('cityNm')} >
                            <Icon className="mr-8" style={{ color: "#000" }}> sort  </Icon>

                            {(sortConfig && sortConfig.key === "cityNm" && sortConfig.direction === "ascending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                            }
                            {(sortConfig && sortConfig.key === "cityNm" && sortConfig.direction === "descending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                            }
                          </IconButton>
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {/* Mobile No */}
                          <TextField 
                                    name="mobNo" 
                                    onChange={handleSearchData} 
                                    inputProps={{ className: "all-Search-box-data" }} 
                                    value={searchData.mobNo} />

                          <IconButton style={{ padding: "10px" }} onClick={() => requestSort('mobNo')} >
                            <Icon className="mr-8" style={{ color: "#000" }}> sort  </Icon>

                            {(sortConfig && sortConfig.key === "mobNo" && sortConfig.direction === "ascending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                            }
                            {(sortConfig && sortConfig.key === "mobNo" && sortConfig.direction === "descending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                            }
                          </IconButton>
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {/* Email-id */}
                          <TextField 
                                    name="email" 
                                    onChange={handleSearchData} 
                                    inputProps={{ className: "all-Search-box-data" }} 
                                    value={searchData.email}/>

                          <IconButton style={{ padding: "10px" }} onClick={() => requestSort('email')} >
                            <Icon className="mr-8" style={{ color: "#000" }}> sort  </Icon>

                            {(sortConfig && sortConfig.key === "email" && sortConfig.direction === "ascending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                            }
                            {(sortConfig && sortConfig.key === "email" && sortConfig.direction === "descending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                            }
                          </IconButton>
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {/* Actions */}
                        </TableCell>
                      </TableRow>

                    </TableHead>
                    <TableBody>
                      {items
                        // .filter((temp) => {
                        //   if (searchData.partyName) {
                        //     return temp.name
                        //       .toLowerCase()
                        //       .includes(searchData.partyName.toLowerCase())
                        //   } else if (searchData.type) {
                        //     return temp.type_name
                        //       .toLowerCase()
                        //       .includes(searchData.type.toLowerCase())
                        //   } else if (searchData.CompanyNm) {//&& temp.category_name
                        //     return  temp.compNm
                        //         .toLowerCase()
                        //         .includes(searchData.CompanyNm.toLowerCase()) 
                        //   } else if (searchData.city) {
                        //     return  temp.cityNm
                        //         .toLowerCase()
                        //         .includes(searchData.city.toLowerCase()) 
                        //   } else if (searchData.mobNo) {
                        //     return temp.clientContacts.length > 0 ?
                        //       temp.clientContacts[0].number
                        //         .toLowerCase()
                        //         .includes(searchData.mobNo.toLowerCase()) : null
                        //   } else if (searchData.email) {
                        //     return temp.companyId.distibutor_master_email
                        //       .toLowerCase()
                        //       .includes(searchData.email.toLowerCase())
                        //   } else {
                        //     return temp
                        //   }
                        // })
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => (
                          <TableRow key={row.id}>
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
                              {row.type_name}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {/* company */}
                              {row.compNm}

                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {/* city */}
                              {row.cityNm}

                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {/* mobile_number */}
                              {row.clientContacts.length > 0
                                ? row.clientContacts[0].number
                                : "-"}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {/* email */}
                              {row.companyId
                                ? row.companyId.distibutor_master_email
                                : "-"}
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
                                    <Icon className="mr-8 edit-icone" >
                                    <img src={Icones.edit}  alt="" />
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
                  onClick={callDeleteClientApi}
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

export default DistributorMaster;

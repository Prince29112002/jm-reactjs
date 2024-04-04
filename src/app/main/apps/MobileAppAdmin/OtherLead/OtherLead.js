import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import BreadcrumbsHelper from "../../../BreadCrubms/BreadcrumbsHelper";
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
import Loader from '../../../Loader/Loader';
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { TextField } from "@material-ui/core";
import TablePagination from '@material-ui/core/TablePagination';
import History from "@history";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Select, { createFilter } from "react-select";
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
    // backgroundColor: "cornflowerblue",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    // color: "white",
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


const OtherLead = (props) => {
  const theme = useTheme();
  const [apiData, setApiData] = useState([]);
  const [open, setOpen] = useState(false);
  const [opendelete, setOpendelete] = useState(false);
  const [openDoneMsg, setOpenDoneMsg] = useState(false);
  const [doneMsgId, setDoneMsgId] = useState("");

    const [selectedIdForConvert, setSelectedIdForConvert] = useState("");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const classes = useStyles();
    const [searchData, setSearchData] = useState({
      full_name: "",
      mobile_number: "",
      designation: "",
      company_name: "",
      pincode:"",
      email: "",
      addedBy: "",
      entry_reference : "",
  });
  const [modalView, setModalView] = useState(0)
  const [page, setPage] = React.useState(0);
  const [count, setCount] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searching, setSearching] = useState(false);
  const roleOfUser = localStorage.getItem("permission")
  ? JSON.parse(localStorage.getItem("permission"))
  : null;
  const [authAccessArr, setAuthAccessArr] = useState([]);
  useEffect(() => {
      let arr = roleOfUser
          ? roleOfUser["Mobile-app Admin"]["Other Lead"]
            ? roleOfUser["Mobile-app Admin"]["Other Lead"]
            : []
          : [];
      const arrData = [];
      if (arr.length > 0) {
        arr.map((item) => {
          arrData.push(item.name);
        });
      }
      setAuthAccessArr(arrData);
    }, []);
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
            const preDta = props.location.state
            setPage(preDta.page)
            setCount(preDta.count)
            setApiData(preDta.apiData)
            setSearchData(preDta.search)
            if(preDta.page === 0){
              setApiData([])
              setCount(0)
              setPage(0)
              setFilters();
            }
            History.replace("/dashboard/mobappadmin/otherlead" , null)
          }else{
            setApiData([])
            setCount(0)
            setPage(0)
            setFilters();
          } 
      }, 800);
      return () => {
          clearTimeout(timeout);
      };
    },[modalView])

    useEffect(()=>{
      if(props.location && props.location.state && props.location.state.iseditView){
        if(apiData.length > 0 && page && count){
          setFilters(Number(page + 1));
        }
      }
    },[apiData,page,count])

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

  const entryfromarray = [
    { value: 1, label: "By Admin" },
    { value: 2, label: "By My Catalogue" },
    { value: 3, label: "By Dist. Catalogue" }
  ]
    useEffect(() => {
        NavbarSetting('Mobile-app Admin', dispatch)
        //eslint-disable-next-line
      }, [])

      useEffect(() => {
        if (loading) {
          setTimeout(() => setLoading(false), 7000);
        }
      }, [loading]);


      function setFilters(tempPageNo) {

        let url 
        if(modalView === 1){
          url = "api/usermaster/lead/existingUser?"
        }else if(modalView === 0){
          url = "api/usermaster/lead/user?"
        }
        
        if (page !== "") {
            if (!tempPageNo) {
                url = url + "page=" + 1
            } else {
                url = url + "page=" + tempPageNo
            }
        }
        const serchingData = props.location && props.location.state ? props.location.state.search : searchData
        if(serchingData.full_name !== "" ){
            url = url + "&full_name=" + serchingData.full_name
        }
      
        if (serchingData.mobile_number !== "") {
            url = url + "&mobile_number=" + serchingData.mobile_number
        }
      
        if (serchingData.designation !== "") {
            url = url + "&designation=" + serchingData.designation
        }
      
        if (serchingData.company_name !== "") {
            url = url + "&company_name=" + serchingData.company_name
        }

        if (serchingData.pincode !== "") {
          url = url + "&pincode=" + serchingData.pincode
      }
      
        if(serchingData.email !== "") {
            url = url + "&email=" + serchingData.email
        }
      
        if(serchingData.addedBy !== "") {
            url = url + "&addedBy=" + serchingData.addedBy
        }
      
        if(serchingData.entry_reference !== "") {
            url = url + "&entry_reference=" + serchingData.entry_reference
        }
        console.log(url,"---------",tempPageNo)
        if (!tempPageNo) {
          console.log("innnnnnnnnnnnnnn444444")
          getOtherLeadData(url);
        } else {
             if (count > apiData.length) {
              getOtherLeadData(url);
            } 
        }
      }
    
      function getOtherLeadData(url,setNew) {
        setLoading(true);
        axios
          .get(Config.getCommonUrl() + url)
          .then(function (response) {
            if (response.data.success === true) {
              console.log(response);
              setCount(Number(response.data.count))
              const tempApi = response.data.data
              if (apiData.length === 0 || setNew) {
                setApiData(tempApi)
                } else {
                setApiData((apiData) => [...apiData, ...tempApi]);
                }
            } else {
              dispatch(Actions.showMessage({ message: response.data.message }));
            }
            setLoading(false);
          })
          .catch(function (error) {
            setLoading(false);
            handleError(error, dispatch, { api: url })
          });
      }

      const handleSearchData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        setSearchData((prevState) => ({
            ...prevState, [name]: value
        })
        );
        setSearching(true);
    }

    const editHandler = (row) => {
        props.history.push("/dashboard/mobappadmin/addnewlead", {
          row: row,
          isEdit: true,
          isViewOnly: false,
          page : page,
          search : searchData,
          count : count,
          apiData : apiData,
          modalView : modalView
      });
    }

    function viewHandler(row) {
      props.history.push("/dashboard/mobappadmin/addnewlead", {
          row: row,
          isViewOnly: true,
          isEdit: false,
          page : page,
          search : searchData,
          count : count,
          apiData : apiData,
          modalView : modalView
      });
  }
  function callDeleteUserApi() {
    const haveMany = apiData.length > 1 ? true : false;
    apiData.splice((page*rowsPerPage))
    setApiData(apiData)
    axios
      .delete(Config.getCommonUrl() + "api/usermaster/lead/user/" + selectedIdForConvert)
      .then(function (response) {
        console.log(response);
        setOpendelete(false);
        if (response.data.success === true) {
            if(haveMany){
              setFilters(Number(page+1));
            }else{
              setSearching(false);
              getOtherLeadData(`api/usermaster/lead/user?page=1`)
              setSearchData({
                full_name: "",
                mobile_number: "",
                designation: "",
                company_name: "",
                pincode : "",
                email: "",
                addedBy: "",
                entry_reference : "",
              })
            }
          dispatch(Actions.showMessage({ message: response.data.message }));
          setSelectedIdForConvert("");
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        // console.log(error);
        setOpendelete(false);
        handleError(error, dispatch, { api: "api/usermaster/lead/user/" + selectedIdForConvert })

      });
  }
  function handleClose() {
    setSelectedIdForConvert("");
    setOpendelete(false);
  }
  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage +1) * 10 > apiData.length) {
        setFilters(Number(newPage + 1))
    }
  }
  const handleEntryFromChange = (value) => {
    console.log(value);
    setSearchData((prevState) => ({
      ...prevState, ['addedBy']: value ? value.value : ''
    }))
    setSearching(true);
  }
    const callConvertLeadApi = () => {
      setLoading(true);
      const haveMany = apiData.length > 1 ? true : false;
      apiData.splice((page*rowsPerPage))
      setApiData(apiData)
      axios
      .put(Config.getCommonUrl() + `api/usermaster/lead-to-retailer/${selectedIdForConvert}`)
      .then(function (response) {
          console.log(response);
          setOpen(false);
          if (response.data.success === true) {
            if(haveMany){
              setFilters(Number(page+1));
            }else{
              setSearching(false);
              getOtherLeadData(`api/usermaster/lead/user?page=1`)
              setSearchData({
                full_name: "",
                mobile_number: "",
                designation: "",
                company_name: "",
                pincode:"",
                email: "",
                addedBy: "",
                entry_reference : "",
              })
            }
            dispatch(Actions.showMessage({ message: response.data.message }));
            setSelectedIdForConvert("");
          } else {
              dispatch(Actions.showMessage({ message: response.data.message }));
          }
          setLoading(false);
      })
      .catch((error) => {
          setLoading(false);
          setOpen(false);
          handleError(error, dispatch, { api: `api/usermaster/lead-to-retailer/${selectedIdForConvert}`})
      });
    }

    const callDoneConversationApi = () => {
      setLoading(true);
      axios
      .put(Config.getCommonUrl() + `api/usermaster/lead/doneConversation/${doneMsgId}`)
      .then(function (response) {
          console.log(response);
          setSearchData({
            full_name: "",
            mobile_number: "",
            designation: "",
            company_name: "",
            pincode:"",
            email: "",
            addedBy: "",
            entry_reference : "",
          })
          getOtherLeadData("api/usermaster/lead/existingUser?page=1" , true)
          setOpenDoneMsg(false);
          setDoneMsgId("");
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
      })
      .catch((error) => {
          setLoading(false);
          setOpen(false);
          handleError(error, dispatch, { api: `api/usermaster/lead/doneConversation/${doneMsgId}`})
      });
    }

    const handleChangeTab = (e,value) => {
      setModalView(value);
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
                    Other Lead
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
                  to={{
                    pathname: "/dashboard/mobappadmin/addnewlead",
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
                    Add New Lead
                  </Button>
                </Link>
              </Grid>
            </Grid>

            <Grid className="pb-16 pt-32 pl-16 pr-16">
                <AppBar position="static">
                    <Tabs value={modalView} onChange={handleChangeTab}>
                        <Tab label="Other Lead User" />
                        <Tab label="Existing User" />
                    </Tabs>
                </AppBar>
                </Grid>

            {/* "name, company name, country/state/city, designation, the mobile number" */}

            {loading && <Loader />}
            <div className="main-div-alll ">
              {/* <div className="m-16 mt-56 department-tbl-mt-dv"> */}
              <div className="department-tbl-mt-dv">
            
                <Paper className={classes.tabroot} id="department-tbl-fix ">
                  <div
                    className="table-responsive new-add_stock_group_tbel "
                    style={{ maxHeight: "calc(100vh - 200px)" }}
                  >
                    <TablePagination
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
                          <TableCell className={classes.tableRowPad} align="left">
                            Name
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                            Mobile No
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                            Designation
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                            Company
                          </TableCell>  
                          <TableCell className={classes.tableRowPad} align="left">
                            Pin Code
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                            Email ID
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                            Entry From
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                             Entry Reference From
                          </TableCell>
                          <TableCell className={classes.tableRowPad} align="left">
                             Created at
                          </TableCell>

                          <TableCell className={classes.tableRowPad} align="left">
                            Actions
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>
                            <TextField name="full_name" onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <TextField name="mobile_number" onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <TextField name="designation" onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            <TextField name="company_name" onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                             <TextField name="pincode" onChange={handleSearchData} 
                            //  value={searchData.pincode} 
                             inputProps={{ className: "all-Search-box-data"}}/>
                          </TableCell>

                          <TableCell className={classes.tableRowPad}>
                            <TextField name="email" onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                            />
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                          {console.log(entryfromarray)}
                                <Select 
                                name="entryVia" 
                                // onChange={handleSearchData}
                                styles={{ selectStyles }}
                                options={entryfromarray.map((group) => ({
                                  value: group.value,
                                  label: group.label,
                                }))}
                                isClearable
                                // value={searchData.addedBy}
                                filterOption={createFilter({ ignoreAccents: false })}
                                onChange={handleEntryFromChange}
                              />
                          </TableCell>

                          <TableCell className={classes.tableRowPad}>
                            <TextField name="entry_reference" onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}/>
                          </TableCell>
                          <TableCell className={classes.tableRowPad}></TableCell>
                          <TableCell className={classes.tableRowPad}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {apiData.length === 0 ? (
                            <>
                              <TableRow>
                                <TableCell style={{textAlign:"center"}}>
                                  No Data Found
                                </TableCell>
                              </TableRow>
                            </>
                          ) : ( apiData
                          .filter((temp) => {
                            if (searchData.full_name) {
                              return temp.full_name
                                .toLowerCase()
                                .includes(searchData.full_name.toLowerCase());
                            } else if (searchData.mobile_number) {
                              return temp.mobile_number
                                .toLowerCase()
                                .includes(searchData.mobile_number.toLowerCase());
                            } else if (searchData.designation) {
                              return temp.designation
                                .toLowerCase()
                                .includes(searchData.designation.toLowerCase());
                            } else if (searchData.company_name) {
                              return temp.company_name
                                .toLowerCase()
                                .includes(searchData.company_name.toLowerCase());
                            } else if (searchData.email) {
                              return temp.email
                                .toLowerCase()
                                .includes(searchData.email.toLowerCase());
                            } else if (searchData.entryVia) {
                              return temp.addedBy && 
                              temp.addedBy === searchData.entryVia;
                            }else if (searchData.entry_reference) {
                              return temp.entry_reference
                                .toLowerCase()
                                .includes(searchData.entry_reference.toLowerCase());
                            }

                             else {
                              return temp;
                            }
                          })
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => (
                            <TableRow key={row.id}>
                              <TableCell
                                align="left"
                                className={clsx(
                                  classes.tableRowPad,
                                  `${row.status == "Deactive"
                                    ? classes.bolderName
                                    : ""
                                  }`
                                )}
                              >
                                {row.full_name}
                              </TableCell>
                              <TableCell align="left" className={classes.tableRowPad}>
                                {/* phonecode + mobile_number  */}
                                {row.country_name?.phonecode === undefined ? + row.mobile_number : "+" +row.country_name?.phonecode + " " + row.mobile_number}
                              </TableCell>
                              <TableCell align="left" className={classes.tableRowPad}
                                style={{ overflowWrap: "anywhere" }}>
                                {/* designation */}
                                {row.designation}
                              </TableCell>

                              <TableCell align="left" className={classes.tableRowPad} >
                                {row.company_name}
                              </TableCell>

                              <TableCell align="left" className={classes.tableRowPad}>
                                  {row.pincode}
                                </TableCell>

                              <TableCell align="left" className={classes.tableRowPad} style={{ overflowWrap: "anywhere" }}>
                                {/* email */}
                                {row.email}
                              </TableCell>

                              <TableCell align="left" className={classes.tableRowPad}
                                style={{ overflowWrap: "anywhere" }}>
                                {/* entry via */}
                                {row.addedBy_text}
                                <div>{row.distributor_catalogues_details !==null ?row.distributor_catalogues_details.Distributor.client.name:""} </div>
                                 <div>{row.catalogues_details!== null?row.catalogues_details.name:row.distributor_catalogues_details !== null ?row.distributor_catalogues_details.name:""}</div>
                              </TableCell>

                              <TableCell align="left" className={classes.tableRowPad}
                                  style={{ overflowWrap: "anywhere" }}>
                                  {/*  entry_reference from */}
                                  {row.entry_reference}
                                </TableCell>

                                <TableCell align="left" className={classes.tableRowPad}
                                  style={{ overflowWrap: "anywhere" }}>
                                  {/*  created at */}
                                  {moment(row.created_at).format("DD-MM-YYYY HH:mm:ss")}
                                </TableCell>

                              <TableCell className={classes.tableRowPad}>
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
                                  {/* <Icon
                                  className="mr-8"
                                  style={{ color: "dodgerblue" }}
                                >
                                  visibility
                                </Icon> */}
                                </IconButton>
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
                                    setOpendelete(true)
                                    setSelectedIdForConvert(row.id);
                                  }}
                                >
                                  <Icon className="mr-8 delete-icone">
                                    <img src={Icones.deleted_blue} alt="" />
                                  </Icon>
                                </IconButton>

                                <Button
                                  variant="contained"
                                  className={classes.button}
                                  size="small"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    setOpen(true);
                                    setSelectedIdForConvert(row.id);
                                  }}
                                >
                                  Convert to Retailer
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                    <TablePagination
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

            {/* <Dialog
                  open={openDoneMsg}
                  onClose={()=>{setOpenDoneMsg(false); setDoneMsgId("") }}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">{"Alert!!!"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Are you sure you want to end the conversation?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={()=>{setOpenDoneMsg(false); setDoneMsgId("") }} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={callDoneConversationApi} color="primary" autoFocus>
                      Yes
                    </Button>
                  </DialogActions>
                </Dialog> */}
          
            <Dialog
              open={open}
              onClose={() => {
                setOpen(false);
                setSelectedIdForConvert("");
              }}
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
                  onClick={() => {
                    setOpen(false);
                    setSelectedIdForConvert("");}}
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
                Are you sure you want to convert this user as a retailer?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                onClick={() => {
             setOpen(false);
            setSelectedIdForConvert("");
            }}          
                    className="delete-dialog-box-cancle-button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={callConvertLeadApi}
                  className="delete-dialog-box-cancle-button"
                    >
                  Yes
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={opendelete}
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
                    alt="x"
                  />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                Are you sure you want to Delete this Record ?
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
                  onClick={() => {callDeleteUserApi()}}
                  className="delete-dialog-box-cancle-button">
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

export default OtherLead;

import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, Box } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import { TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import History from "@history";
import Loader from "../../../../Loader/Loader";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Select, { createFilter } from "react-select";
import OrderHistory from "../../RetailerMaster/CreateCompany/SubView/OrderHistory";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    height: "70%",
  },
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  inputBox: {
    marginTop: 8,
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "15%",
  },
  form: {
    marginTop: "3%",
    display: "contents",
  },
  submitBtn: {
    marginTop: 8,
    padding: 8,
    fontSize: "12pt",
    marginLeft: 15,
    backgroundColor: "#4caf50",
    border: "none",
    color: "white",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    borderRadius: 8,
    cursor: "pointer",
  },
}));


const EditCRM = (props) => {
  console.log(props.location.state)
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  const [apiData, setApiData] = useState([]);
  const propsData = props.location.state?.propsData ? props.location.state?.propsData : props.location.state;
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [entryId, setEntryId] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionErr, setDescriptionErr] = useState("");
  const [modalView, setModalView] = useState(0);
  const [userDetails, setUserDetails] = useState([]);
  const [comUserList, setComUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedUserErr, setSelectedUserErr] = useState("")

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log(propsData)
    if (propsData !== undefined) {
      const newProps = propsData.propsData ? propsData.propsData : propsData
      setEntryId(newProps.row);
      setIsEdit(newProps.isEdit);
      setIsView(newProps.isView);
      getHistoryData(newProps.row)
      if(props?.location?.state?.modalTab){
        setModalView(props?.location?.state?.modalTab)
      }else{
        setModalView(0)
      }
      getUserList()
      getUserDetailsData()
    }
  }, []);

  const getUserDetailsData = () => {
    setLoading(true);
    const api = `api/crm/loginDetailsList?company_name=${propsData.userData?.company_name}&association_type=${propsData.userData?.type}`;
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          if (response.data.data.length > 0) {
            setUserDetails(response.data.data);
          } else {
            // dispatch(Actions.showMessage({ message: response.data.message }));
          }
        } else {
          setUserDetails([]);
          // dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setUserDetails([]);
        handleError(error, dispatch, { api: api });
      });
  };

  const getUserList = () => {
    const api = `api/crm/companyUserList?company_name=${propsData.userData?.company_name}&association_type=${propsData.userData?.type}`;
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          if (response.data.data.length > 0) {
            setComUserList(response.data.data);
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
        } else {
          setComUserList([]);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setComUserList([]);
        handleError(error, dispatch, { api: api });
      });
  };

  function getHistoryData(id) {
    setLoading(true);
    const api = `api/crm/user-list/history?distributor_id=${propsData.userData?.type === "Distributor" ? id : 0 }&retailer_id=${propsData.userData?.type === "Retailer" ? id : 0 }`
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        setLoading(false);
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: api,
        });
      });
  }

  const validateUser = () => {
    if(selectedUser === ""){
      setSelectedUserErr("Select User");
      return false;
    }
    return true;
  }

  const descriptionValidation = () => {
    if(description === ""){
      setDescriptionErr("Add Description");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateUser() && descriptionValidation()) {
      const body = {
        subject: subject,
        description: description,
        user_id : selectedUser.value
      };
      setLoading(true);
      const api = `api/crm/user?distributor_id=${propsData.userData?.type === "Distributor" ? entryId : 0}&retailer_id=${propsData.userData?.type === "Retailer" ? entryId : 0}`
      axios
        .post(Config.getCommonUrl() + api, body)
        .then(function (response) {
          setLoading(false);
          setSubject("");
          setDescription("");
          setDescriptionErr("");
          setSelectedUser("");
          setSelectedUserErr("")
          dispatch(Actions.showMessage({ message: response.data.message }));
          getHistoryData(entryId);
        })
        .catch((error) => {
          setLoading(false);
          handleError(error, dispatch, {
            api: api,
            body,
          });
        });
    } else {
      setDescriptionErr("Add Description ");
    }
  };

  const handleChangeTab = (event, value) => {
    setModalView(value);
  }

  const handleUserSelect = (value) => {
    setSelectedUser(value);
    setSelectedUserErr("")
  }

  function viewHandler(row) {
    History.push("/dashboard/mobappadmin/loginsubdetails", {
      id: row.id,
      from:"/dashboard/mobappadmin/crm/editcrm",
      modalTab:modalView,
      propsData:propsData
    });
  }


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              container
              alignItems="center"
              style={{ paddingInline: 16, marginBlock: 16 }}
            >
              <Grid item xs={12} sm={6} md={6} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                  {propsData.userData?.type} : {propsData.userData?.company_name}
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
                <div className="btn-back mt-2">
                    <Button
                      id="btn-back"
                      size="small"
                      onClick={(e) =>  History.push('/dashboard/mobappadmin/crm')}
                    >
                        <img
                           className="back_arrow"
                           src={Icones.arrow_left_pagination}
                           alt=""/>
                  
                      Back
                    </Button>
                  </div>

              </Grid>
            </Grid>
            <Box style={{ paddingInline: 16, marginTop: 16 }}>
              {loading && <Loader />}
              <AppBar position="static">
                <Tabs value={modalView} onChange={handleChangeTab}>
                    <Tab label="Company History" />
                    <Tab label="Login Details" />
                    <Tab label="Order History" />
                </Tabs>
            </AppBar>
            {
              modalView === 0 && (<>
               {isEdit && (
                <>
                  <Grid container spacing={2} className="mt-16">
                  <Grid item xs={4}>
                      <label style={{ marginBottom: 10 }}>User Name</label>
                      <Select
                        className={classes.itemTypeStyle}
                        filterOption={createFilter({ ignoreAccents: false })}
                        options={comUserList.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.full_name,
                        }))}
                        value={selectedUser}
                        onChange={handleUserSelect}
                        placeholder="Select User"
                        fullWidth
                      />
                      <span style={{color: 'red'}}>{selectedUserErr}</span>
                    </Grid>
                    <Grid item xs={8}>
                      <TextField
                        className="mt-16"
                        label="Subject"
                        name="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        name="description"
                        value={description}
                        error={descriptionErr.length > 0 ? true : false}
                        helperText={descriptionErr}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          setDescriptionErr("");
                        }}
                        variant="outlined"
                        required
                        fullWidth
                        multiline
                        minRows={4}
                        maxrows={4}
                        disabled={isView}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
              <Grid
                container
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBlock: 16,
                }}
              >
                <Grid item>
                  <Typography className="text-18 font-700">
                    Conversation History :
                  </Typography>
                </Grid>
                <Grid item>
                  {isEdit && (
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ float: "right" }}
                      className="mx-auto"
                      aria-label="Register"
                      hidden={isView}
                      type="submit"
                      onClick={(e) => {
                        handleFormSubmit(e);
                      }}
                    >
                      Submit
                    </Button>
                  )}
                </Grid>
              </Grid>

              <div className="department-tbl-mt-dv">
                <Paper
                  className={clsx(classes.tabroot, "stockitemyype-tabe-dv")}
                >
                 <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad} style={{width : "50px"}}>User Name</TableCell>
                      <TableCell className={classes.tableRowPad} style={{width : "50px"}}>Admin Name</TableCell>
                      <TableCell className={classes.tableRowPad} style={{width : "50px"}}>Created Date</TableCell>
                      <TableCell className={classes.tableRowPad} style={{width : "100px"}}>Subject</TableCell>
                      <TableCell className={classes.tableRowPad} style={{width : "150px"}}>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiData.map((row) => (
                      <TableRow key={row.createdAt}>
                        <TableCell className={classes.tableRowPad} style={{width : "50px"}}>{row.userName}</TableCell>
                        <TableCell className={classes.tableRowPad} style={{width : "50px"}}>{row.adminName}</TableCell>
                        <TableCell className={classes.tableRowPad} style={{width : "50px"}}>{row.createdAt}</TableCell>
                        <TableCell className={classes.tableRowPad} style={{width : "100px"}}>{row.subject}</TableCell>
                        <TableCell className={classes.tableRowPad} style={{width : "150px"}}>
                          {row.description.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                              {line}
                              {index !== row.description.split('\n').length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </Paper>
              </div>
              </>)
            }{
              modalView === 1 && <div className="department-tbl-mt-dv">
              <Paper
                className={clsx(classes.tabroot, "stockitemyype-tabe-dv")}
              >
               <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableRowPad} >User Name</TableCell>
                    <TableCell className={classes.tableRowPad} >Mobile Number</TableCell>
                    <TableCell className={classes.tableRowPad} >Email</TableCell>
                    <TableCell className={classes.tableRowPad} >Number Of Time Login</TableCell>
                    <TableCell className={classes.tableRowPad} >Total Login Time</TableCell>
                    <TableCell className={classes.tableRowPad} >Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userDetails.map((row,index) => (
                    <TableRow key={index}>
                      <TableCell className={classes.tableRowPad} >{row?.user_name}</TableCell>
                      <TableCell className={classes.tableRowPad} >{row?.mobile_number}</TableCell>
                      <TableCell className={classes.tableRowPad} >{row?.email}</TableCell>
                      <TableCell className={classes.tableRowPad} >{row?.count}</TableCell>
                      <TableCell className={classes.tableRowPad} >{row?.total_login_time}</TableCell>
                      <TableCell className={classes.tableRowPad} >   <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  viewHandler(row);
                                }}
                              >
                                <Icon
                                  className="mr-8"
                                  style={{ color: "dodgerblue" }}
                                >
                                  visibility
                                </Icon>
                              </IconButton>
                        </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </Paper>
            </div>
            }
            {
              modalView === 2 && <>
              <div className="mt-16">
              <OrderHistory client_id={propsData.userData?.id} type={propsData.userData?.type} propsData={propsData} modalTab={modalView}/>  
              </div>
              </>
            }
            </Box>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default EditCRM;

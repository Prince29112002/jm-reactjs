import React, { useState, useEffect } from "react";
import { Typography, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import BreadcrumbsHelper from "../../../BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Select, { createFilter } from "react-select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Icon, IconButton } from "@material-ui/core";

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
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    minWidth: 1000,
  },
  tableRowPad: {
    padding: 7,
  },
  selectBox: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
  },
}));


const CRM = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [clientType, setClientType] = useState([]);
  const [selectedCType, setSelectedCType] = useState("");
  const [companyNameSearch, setCompanyNamesearch] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyList, setCompanyList] = useState([]);
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    GetClientTypeList();
    //eslint-disable-next-line
  }, [dispatch]);

  function GetClientTypeList() {
    axios
      .get(Config.getCommonUrl() + "api/client/company-association-typelist")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const key = Object.keys(response.data.data);
          const values = Object.values(response.data.data);
          let temp = [];
          for (let i = 0; i < values.length; i++) {
            temp.push({
              value: key[i],
              label: values[i],
            });
          }
          setClientType(temp);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/client/company-association-typelist",
        });
      });
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (companyNameSearch) {
        getCompanyDetailsData(companyNameSearch);
      } else {
        setCompanyList([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
    //eslint-disable-next-line
  }, [companyNameSearch]);

  const getCompanyDetailsData = (companyNameSearch) => {
    setLoading(true);
    const api = `api/crm/company-list?company_name=${companyNameSearch}&association_type=${selectedCType.label}`;
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        setLoading(false);
        if (response.data.success === true) {
          console.log(response);
          if (response.data.data.length > 0) {
            setCompanyList(response.data.data);
          } else {
            setCompanyList([]);
            dispatch(
              Actions.showMessage({
                message: "Please Insert Proper Name",
              })
            );
          }
        } else {
          setLoading(false);
          setCompanyList([]);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: api });
      });
  };

  const getUserDetailsData = (companyNameS) => {
    setLoading(true);
    const api = `api/crm/companyDetails?company_name=${companyNameS}`;
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        setLoading(false);
        if (response.data.success === true) {
          setApiData(response.data.companyDetails);
        } else {
          setLoading(false);
          setApiData([]);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);
        setApiData([]);
        handleError(error, dispatch, { api: api });
      });
  };

  const handleCompanySelect = (comName) => {
    let filteredArray
    if(selectedCType.value === "1"){
       filteredArray = companyList.filter(
        (item) => item.companyDetails?.company_name === comName
      );
    }else{
       filteredArray = companyList.filter(
        (item) => item.company_name === comName
      );
    }
   
    if (filteredArray.length > 0) {
      setCompanyName(comName);
      getUserDetailsData(comName);
    } else {
      setCompanyName("");
    }
  };

  const editHandler = (row, isEdit) => {
    props.history.push("/dashboard/mobappadmin/crm/editcrm", {
      row: row.id,
      isEdit: isEdit,
      isView: !isEdit,
      userData : row,
      //   page : page,
      //   search : searchData,
      //   count : count,
      //   apiData : apiData,
      //   modalView : modalView
    });
  };


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 pb-64 flex-col min-w-0">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={8} sm={8} md={8} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="p-16 pb-8 text-18 font-700">
                    CRM
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key="2"
                style={{ textAlign: "right" }}
              ></Grid>
            </Grid>
            {loading && <Loader />}
            <Grid
              container
              spacing={2}
              style={{
                paddingInline: 16,
                alignItems: "flex-end",
                marginTop: 16,
              }}
            >
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <label style={{ marginBottom: 10 }}>Client Type</label>
                <Select
                  className={classes.itemTypeStyle}
                  filterOption={createFilter({ ignoreAccents: false })}
                  options={clientType.map((suggestion) => ({
                    value: suggestion.value,
                    label: suggestion.label,
                    key: suggestion.value,
                  }))}
                  value={selectedCType}
                  onChange={(e) => {
                    setSelectedCType(e); 
                    setCompanyNamesearch("")
                    setCompanyName("")
                    setApiData([])
                    setCompanyList([])
                  }}
                  placeholder="Select Client Type"
                  fullWidth
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="packing-slip-input"
              >
                <Autocomplete
                  id="free-solo-demos"
                  freeSolo
                  disableClearable
                  onChange={(event, newValue) => {
                    console.log(newValue);
                    handleCompanySelect(newValue);
                  }}
                  disabled={selectedCType ? false : true}
                  onInputChange={(event, newInputValue) => {
                    if (event !== null) {
                      if (event.type === "change")
                        setCompanyNamesearch(newInputValue);
                    } else {
                      setCompanyNamesearch("");
                    }
                  }}
                  value={companyName}
                  options={ selectedCType.value === "1" ? companyList.map(
                    (option) => option?.companyDetails?.company_name
                  ) : companyList.map(
                    (option) => option?.company_name
                  )}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search Company Name"
                      variant="outlined"
                      style={{
                        padding: 0,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <div className="m-16 mt-56 department-tbl-mt-dv">
              <Paper className={classes.tabroot} id="department-tbl-fix ">
                <div
                  className="table-responsive new-add_stock_group_tbel "
                  style={{ maxHeight: "calc(100vh - 200px)" }}
                >
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                      <TableCell className={classes.tableRowPad} align="left">
                        Company Name
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad} align="left">
                        User Name
                        </TableCell> */}
                        <TableCell className={classes.tableRowPad} align="left">
                          Mobile No
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad} align="left">
                          Designation
                        </TableCell> */}
                        <TableCell className={classes.tableRowPad} align="left">
                          Email ID
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          User Type
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad} align="left">
                          Gender
                        </TableCell> */}
                         <TableCell className={classes.tableRowPad} align="left">
                          City
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad} align="left">
                          State
                        </TableCell> */}
                        <TableCell className={classes.tableRowPad} align="left">
                          Last entry Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Total Entries
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiData.length === 0 ? (
                        <>
                          <TableRow>
                            <TableCell colSpan={8} align="center" style={{textAlign:"center"}}>
                              <div style={{textAlign: "center"}}>No Data avilable</div>
                            </TableCell>
                          </TableRow>
                        </>
                      ) : (
                        apiData.map((row) => (
                          <TableRow key={row.id}>
                            <TableCell className={classes.tableRowPad}>
                              {" "}
                              {row?.company_name}
                            </TableCell>
                            {/* <TableCell className={classes.tableRowPad}>
                              {" "}
                              {row?.full_name}
                            </TableCell> */}
                            <TableCell className={classes.tableRowPad}>
                              {" "}
                              {row?.number}
                            </TableCell>
                            {/* <TableCell className={classes.tableRowPad}>
                              {" "}
                              {row?.designation}
                            </TableCell> */}
                            <TableCell className={classes.tableRowPad}>
                              {" "}
                              {row?.email}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {" "}
                              {row?.type}
                            </TableCell>
                            {/* <TableCell className={classes.tableRowPad}>
                              {" "}
                              {row?.gender}
                            </TableCell> */}
                            <TableCell className={classes.tableRowPad}>
                              {" "}
                              {row?.city_name}
                            </TableCell>
                            {/* <TableCell className={classes.tableRowPad}>
                              {" "}
                              {row?.state_name?.name}
                            </TableCell> */}
                            <TableCell className={classes.tableRowPad}>
                              {" "}
                              {row?.last_entry_date}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {" "}
                              {row?.total_entries}
                            </TableCell>

                            <TableCell className={classes.tableRowPad}>
                              <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  editHandler(row, false);
                                }}
                              >
                                <Icon
                                  className="mr-8"
                                  style={{ color: "dodgerblue" }}
                                >
                                  visibility
                                </Icon>
                              </IconButton>

                              <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  editHandler(row, true);
                                }}
                              >
                                <Icon
                                  className="mr-8"
                                  style={{ color: "dodgerblue" }}
                                >
                                  create
                                </Icon>
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Paper>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default CRM;

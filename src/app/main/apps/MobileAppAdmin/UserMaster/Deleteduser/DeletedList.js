import React, { useState, useEffect } from "react";
import { Icon, IconButton, TablePagination, TextField, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import History from "@history";
import Loader from "../../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import useSortableData from "../../../Stock/Components/useSortableData";
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
    wordWrap: "break-word",
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

const DeletedList = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [count, setCount] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchData, setSearchData] = useState({
    full_name: "",
    gender: "",
    mobile_number: "",
    designation: "",
    type_name: "",
    company: "",
    state: "",
    email: "",
    date_of_birth: "",
    date_of_anniversary: "",
    created_at: "",
    status: "",
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

  const reActive = props.location.state ? props.location.state.isReactive : false;
  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState, [name]: value
    })
    );
  }

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  const genderArr = [
    { value: 0, label: "Male" },
    { value: 1, label: "Female" }
  ]

  const statusArr = [
    { value: 0, label: "Deactive" },
    { value: 1, label: "Active" }
  ]

  const usertypeArr = [
    { value: 0, label: "Distributor" },
    { value: 1, label: "Overseas Distributors" },
    { value: 2, label: "Direct Retailers" },
    { value: 3, label: "Corporate Retailers" },
    { value: 4, label: "Retailer" }
  ]

  function getDeletedUserData(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          setCount(Number(response.data.count))

          let tempApi = tempData.map((x) => {
            let compNm = "";
            let d = "";
            if (x.user_type === 6) {
              compNm =
                x.hasOwnProperty("RetailerName") && x.RetailerName !== null
                  ? x.RetailerName.company_name
                  : null;
            } else if (
              x.user_type === 1 ||
              x.user_type === 2 ||
              x.user_type === 3 ||
              x.user_type === 4 ||
              x.user_type === 6
            ) {
              compNm =
                x.hasOwnProperty("ClientName") && x.ClientName !== null
                  ? x.ClientName.hasOwnProperty("company_name")
                    ? x.ClientName.company_name
                    : null
                  : null;
            }
            console.log("compNm", compNm);
            return {
              ...x,
              selected: false,
              compName: compNm ? compNm : "-",
              state: x.state_name ? x.state_name.name : "-",
              gender: x.gender === 0 ? "Male" : "Female",
              status: x.status == "0" ? "Deactive" : "Active",
              type_name: x.type_name != null ? x.type_name : "-",
              date_of_birth: moment(x.date_of_birth, "YYYY-MM-DD").format(
                "DD-MM-YYYY"
              ),
              date_of_anniversary:
                x.date_of_anniversary !== null
                  ? moment(x.date_of_anniversary, "YYYY-MM-DD").format(
                    "DD-MM-YYYY"
                  )
                  : " ",
              created_at: moment(x.created_at, "YYYY-MM-DD").format(
                "DD-MM-YYYY"
              ),
            };
          });
          if (apiData.length === 0) {
            console.log("if")
            setApiData(tempApi)
          } else {
            console.log("else", apiData)
            // setApiData(...apiData, ...rows)
            setApiData((apiData) => [...apiData, ...tempApi]);
            // console.log([...apiData, ...rows])
          }
          console.log(tempApi);
          // setApiData(tempApi);
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

  function updateStatusApi(id) {
    let data = {
      id: id,
    };

    axios
      .put(Config.getCommonUrl() + `api/usermaster/reactivate-user`, data)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id

          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.push("/dashboard/masters/clients");
          History.goBack();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/usermaster/reactivate-user",
          body: data,
        });
      });
  }

  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 10 > apiData.length) {
      setFilters(Number(newPage + 1))
    }
  }

  useEffect(() => {
    console.log("useEffect");
    setApiData([])
    setCount(0)
    setPage(0)
    setFilters();
    //eslint-disable-next-line
  }, [searchData]);

  function setFilters(tempPageNo) {
    let url = "api/usermaster/get/deletedUsers?"

    if (page !== "") {
      if (!tempPageNo) {
        url = url + "page=" + 1

      } else {
        url = url + "page=" + tempPageNo
      }
    }

    if (searchData.full_name !== "") {
      url = url + "&full_name=" + searchData.full_name
    }
    if (searchData.gender !== "") {
      url = url + "&gender=" + searchData.gender.value
    }
    if (searchData.mobile_number !== "") {
      url = url + "&mobile_number=" + searchData.mobile_number
    }
    if (searchData.designation !== "") {
      url = url + "&designation=" + searchData.designation
    }
    if (searchData.type_name !== "") {
      url = url + "&type_name=" + searchData.type_name.value
    }
    if (searchData.company !== "") {
      url = url + "&company_name=" + searchData.company
    }
    if (searchData.state !== "") {
      url = url + "&state=" + searchData.state
    }
    if (searchData.email !== "") {
      url = url + "&email=" + searchData.email
    }
    if (searchData.date_of_birth !== "") {
      url = url + "&date_of_birth=" + moment(searchData.date_of_birth).format("DD-MM-YYYY")
    }
    if (searchData.date_of_anniversary !== "") {
      url = url + "&date_of_anniversary=" + moment(searchData.date_of_anniversary).format("DD-MM-YYYY")
    }
    if (searchData.created_at !== "") {
      url = url + "&created_at=" + moment(searchData.created_at).format("DD-MM-YYYY")
    }
    if (searchData.status !== "") {
      url = url + "&status=" + searchData.status.value
    }
    console.log(url, "---------", tempPageNo)

    if (!tempPageNo) {
      getDeletedUserData(url);
    } else {
      if (count > apiData.length) {
        getDeletedUserData(url);
      }
    }
  }

  const handlegenderChange = (value) => {
    setSearchData((prevState) => ({
      ...prevState, ['gender']: value ? value : ''
    }))
  }

  const handlestatusChange = (value) => {
    console.log(value);
    setSearchData((prevState) => ({
      ...prevState, ['status']: value ? value : ''
    }))
  }

  const handleusertypeChange = (value) => {
    setSearchData((prevState) => ({
      ...prevState, ['type_name']: value ? value : ''
    }))
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
                    Deleted User List
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
                    onClick={(event) => {
                      History.goBack();
                    }}
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

            {loading && <Loader />}
            <div className="main-div-alll">
              <div
                className=" department-tbl-mt-dv"
                style={{ marginBottom: "8%" }}
              >
                {/* <Paper className={classes.tabroot} id="department-tbl-fix "> */}
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Grid item xs="auto">
                      <div className="table-responsive  ">
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
                        onPageChange={handleChangePage} />
                        <Table className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                User Name
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Gender
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Mobile No
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Designation
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                State
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                User Type
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Company
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Email ID
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Date of Birth
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Date of Anni
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Creation Date
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Status
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
                              <TextField name="full_name"
                                onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                              />

                              <IconButton style={{ padding: "0" }}
                                onClick={() => requestSort('full_name')} >
                                <Icon className="mr-8" style={{ color: "#000" }}> sort  </Icon>

                                {(sortConfig && sortConfig.key === "full_name" && sortConfig.direction === "ascending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                }
                                {(sortConfig && sortConfig.key === "full_name" && sortConfig.direction === "descending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                }
                              </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                               {/* <Select
                                styles={{ selectStyles }}
                                options={genderArr.map((group) => ({
                                  value: group.value,
                                  label: group.label,
                                }))}
                                isClearable
                                inputProps={{ className: "all-Search-box-data" }}
                                value={searchData.gender}
                                filterOption={createFilter({ ignoreAccents: false })}
                                onChange={handlegenderChange}
                              /> */}
                              <TextField name="gender" onChange={handleSearchData} 
                              inputProps={{ className: "all-Search-box-data" }}
                              />

                              <IconButton style={{ padding: "0" }} onClick={() => requestSort('gender')} >
                                <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                {(sortConfig && sortConfig.key === "gender" && sortConfig.direction === "ascending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                }
                                {(sortConfig && sortConfig.key === "gender" && sortConfig.direction === "descending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                }
                              </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <TextField name="mobile_number" onChange={handleSearchData} 
                              inputProps={{ className: "all-Search-box-data" }}
                              />

                              <IconButton style={{ padding: "0" }} onClick={() => requestSort('mobile_number')} >
                                <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                {(sortConfig && sortConfig.key === "mobile_number" && sortConfig.direction === "ascending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                }
                                {(sortConfig && sortConfig.key === "mobile_number" && sortConfig.direction === "descending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                }
                              </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <TextField name="designation" onChange={handleSearchData} 
                              inputProps={{ className: "all-Search-box-data" }}
                              />

                              <IconButton style={{ padding: "0" }} onClick={() => requestSort('designation')} >
                                <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                {(sortConfig && sortConfig.key === "designation" && sortConfig.direction === "ascending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                }
                                {(sortConfig && sortConfig.key === "designation" && sortConfig.direction === "descending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                }
                              </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <TextField name="state" onChange={handleSearchData}
                               inputProps={{ className: "all-Search-box-data" }}
                               value={searchData.state} />

                              <IconButton style={{ padding: "0" }} onClick={() => requestSort('state')}>
                                <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>
                                {(sortConfig && sortConfig.key === "state" && sortConfig.direction === "ascending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                }
                                {(sortConfig && sortConfig.key === "state" && sortConfig.direction === "descending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                }
                              </IconButton>
                            </TableCell>

                            <TableCell className={classes.tableRowPad}>
                              {/* <Select
                                styles={{ selectStyles }}
                                options={usertypeArr.map((group) => ({
                                  value: group.value,
                                  label: group.label,
                                }))}
                                isClearable
                                value={searchData.type_name}
                                inputProps={{ className: "all-Search-box-data" }}
                                filterOption={createFilter({ ignoreAccents: false })}
                                onChange={handleusertypeChange}
                              /> */}
                               <TextField name="type_name" onChange={handleSearchData} 
                              inputProps={{ className: "all-Search-box-data" }}
                              />

                              <IconButton style={{ padding: "0" }} onClick={() => requestSort('type_name')} >
                                <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                {(sortConfig && sortConfig.key === "type_name" && sortConfig.direction === "ascending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                }
                                {(sortConfig && sortConfig.key === "type_name" && sortConfig.direction === "descending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                }
                              </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <TextField name="company" onChange={handleSearchData} 
                              inputProps={{ className: "all-Search-box-data" }}
                              />

                              <IconButton style={{ padding: "0" }} onClick={() => requestSort('compName')} >
                                <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                {(sortConfig && sortConfig.key === "compName" && sortConfig.direction === "ascending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                }
                                {(sortConfig && sortConfig.key === "compName" && sortConfig.direction === "descending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                }
                              </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <TextField name="email" onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                               />

                              <IconButton style={{ padding: "0" }} onClick={() => requestSort('email')} >
                                <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                {(sortConfig && sortConfig.key === "email" && sortConfig.direction === "ascending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                }
                                {(sortConfig && sortConfig.key === "email" && sortConfig.direction === "descending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                }
                              </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <TextField name="date_of_birth" onChange={handleSearchData}
                              inputProps={{  max: moment().format("YYYY-MM-DD"), className: "all-Search-box-data" }}
                               />

                              <IconButton style={{ padding: "0" }} onClick={() => requestSort('date_of_birth', true)} >
                                <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                {(sortConfig && sortConfig.key === "date_of_birth" && sortConfig.direction === "ascending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                }
                                {(sortConfig && sortConfig.key === "date_of_birth" && sortConfig.direction === "descending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                }
                              </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                          <TextField type="date" name="date_of_anniversary" onChange={handleSearchData}
                              inputProps={{ max: moment().format("YYYY-MM-DD"), className: "all-Search-box-data" }}
                              />

                          <IconButton style={{ padding: "0" }} onClick={() => requestSort('date_of_anniversary', true)} >
                            <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                            {(sortConfig && sortConfig.key === "date_of_anniversary" && sortConfig.direction === "ascending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                            }
                            {(sortConfig && sortConfig.key === "date_of_anniversary" && sortConfig.direction === "descending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                            }
                          </IconButton>
                        </TableCell>
                            {/* <TableCell className={classes.tableRowPad}></TableCell> */}
                            <TableCell className={classes.tableRowPad}>
                              <TextField name="created_at" type="date" onChange={handleSearchData} 
                              inputProps={{ max: moment().format("YYYY-MM-DD"), className: "all-Search-box-data" }}
                              />

                              <IconButton style={{ padding: "0" }} onClick={() => requestSort('created_at', true)} >
                                <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                {(sortConfig && sortConfig.key === "created_at" && sortConfig.direction === "ascending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                }
                                {(sortConfig && sortConfig.key === "created_at" && sortConfig.direction === "descending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                }
                              </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                            {/* <Select
                                styles={{ selectStyles }}
                                options={statusArr.map((group) => ({
                                  value: group.value,
                                  label: group.label,
                                }))}
                                isClearable
                                inputProps={{ className: "all-Search-box-data" }}
                                value={searchData.status}
                                filterOption={createFilter({ ignoreAccents: false })}
                                onChange={handlestatusChange}
                              /> */}
                              <TextField name="status" onChange={handleSearchData}
                              inputProps={{ className: "all-Search-box-data" }}
                               />

                              <IconButton style={{ padding: "0" }} onClick={() => requestSort('status')} >
                                <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                                {(sortConfig && sortConfig.key === "status" && sortConfig.direction === "ascending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                                }
                                {(sortConfig && sortConfig.key === "status" && sortConfig.direction === "descending") &&
                                  <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                                }
                              </IconButton>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}></TableCell>
                          </TableRow>
                          </TableHead>
                          <TableBody>
                          {items
                           .filter(
                            (temp) => {
  
                              if (searchData.full_name) {
                                return temp.full_name
                                  .toLowerCase()
                                  .includes(searchData.full_name.toLowerCase())
                              } else if (searchData.gender) {
                                return temp.gender
                                  .toLowerCase()
                                  .includes(searchData.gender.toLowerCase())
                              } else if (searchData.mobile_number) {
                                return temp.mobile_number
                                  .toLowerCase()
                                  .includes(searchData.mobile_number.toLowerCase())
                              } else if (searchData.designation) {
                                return temp.designation.toString()
                                  .toLowerCase()
                                  .includes(searchData.designation.toLowerCase())
                              } else if (searchData.type_name) {
                                return temp.hasOwnProperty("type_name") ? temp.type_name
                                  .toLowerCase()
                                  .includes(searchData.type_name.toLowerCase()) : null
                              } else if (searchData.company) {
                                return temp.compName.toLowerCase()
                                  .includes(searchData.company.toLowerCase())
                              } else if (searchData.email) {
                                return temp.email.toString()
                                  .toLowerCase()
                                  .includes(searchData.email.toLowerCase())
                              } else if (searchData.date_of_birth) {
                                return temp.date_of_birth.toString()
                                  .toLowerCase()
                                  .includes(searchData.date_of_birth.toLowerCase())
                              }
                              else if (searchData.date_of_anniversary) {
                                return temp.date_of_anniversary.toString()
                                  .toLowerCase()
                                  .includes(searchData.date_of_anniversary.toLowerCase())
                              }
                              else if (searchData.created_at) {
                                return temp.created_at
                                  .toLowerCase()
                                  .includes(searchData.created_at.toLowerCase())
                              } else if (searchData.status) {
                                return temp.status.toString()
                                  .toLowerCase()
                                  .includes(searchData.status.toLowerCase())
                              } else {
                                return temp
                              }
                            })
                           .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                           .map((row) => (
                              <TableRow key={row.id}>
                                <TableCell
                                  align="left"
                                  className={clsx(classes.tableRowPad)}
                                >
                                  {row.full_name}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={clsx(classes.tableRowPad)}
                                >
                                  {row.gender}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* mobile_number */}
                                  {/* {row.mobile_number} */}
                                  {row.first_country ? "+" +
                                   row.first_country.phonecode + " " 
                                   + row.mobile_number : row.mobile_number}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* Designation */}
                                  {row.designation}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                  style={{ overflowWrap: "anywhere" }}
                                >
                                  {/* designation */}
                                  {row.state}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* userType */}
                                  {row.type_name}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* Company */}
                                  {row.compName}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* Email */}
                                  {row.email}
                                </TableCell>

                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* date_of_birth */}
                                  {row.date_of_birth}
                                </TableCell>

                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* date_of_anni */}
                                  {row.date_of_anniversary}
                                </TableCell>

                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* created_at */}
                                  {row.created_at}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* status */}
                                  {row.status}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  <Button
                                    id="btn-save"
                                    variant="contained"
                                    // className={classes.button}
                                    size="small"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      updateStatusApi(row.id);
                                      // editHandler(row);
                                    }}
                                  >
                                    Reactivate
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
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
                           onPageChange={handleChangePage} />
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                {/* </Paper> */}
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default DeletedList;

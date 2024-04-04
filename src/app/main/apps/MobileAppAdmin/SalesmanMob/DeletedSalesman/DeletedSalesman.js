import React, { useState, useEffect } from "react";
import { Icon, IconButton, TablePagination, TextField, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles,useTheme } from "@material-ui/core/styles";
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
import { wrap } from "lodash";
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

const DeletedSalesman = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [count, setCount] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const isReactivate = props.location.state ? props.location.state.isReactivate : false;

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);


  const [searchData, setSearchData] = useState({
    full_name: "",
    gender: "",
    mobile_number: "",
    designation: "",
    // type_name: "",
    company: "",
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

  const genderArr = [
    { value: 0, label: "Male" },
    { value: 1, label: "Female" }
  ]

  const statusArr = [
    { value: 0, label: "Deactive" },
    { value: 1, label: "Active" }
  ]


  function getDeletedSalesmanData() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/salesManMaster/get/deletedSalesmen")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          setCount(Number(response.data.count))

          let tempApi = tempData.map((x) => {
            return {
              ...x,
              selected: false,
              compName: x.company_name,
              gender: x.gender === 0 ? "Male" : "Female",
              status: x.status == "0" ? "Deactive" : "Active",
              date_of_birth: moment(x.date_of_birth, "YYYY-MM-DD").format("DD-MM-YYYY"),
              date_of_anniversary: moment(x.date_of_anniversary,"YYYY-MM-DD").format("DD-MM-YYYY"),
              created_at: moment(x.created_at, "YYYY-MM-DD").format("DD-MM-YYYY"),
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
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/salesManMaster/get/deletedSalesmen",
        });
      });
  }

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState, [name]: value
    })
    );
  }

  function setFilters(tempPageNo) {
    let url = "api/salesManMaster/get/deletedSalesmen?"

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
    // if (searchData.type_name !== "") {
    //   url = url + "&type_name=" + searchData.type_name.value
    // }
    if (searchData.company !== "") {
      url = url + "&company_name=" + searchData.company
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
      getDeletedSalesmanData(url);
    } else {
      if (count > apiData.length) {
        getDeletedSalesmanData(url);
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

          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          // History.push("/dashboard/masters/clients");
          History.goBack();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/usermaster/reactivate-user",
          body: data,
        });
      });
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
              <Grid item xs={6} sm={5} md={5} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                  Deleted Salesman List
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid item xs={6} sm={7} md={7} key="2">
                <div className="btn-back">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    className=""
                    size="small"
                    onClick={(event) => {
                      // History.push("/dashboard/masters/clients");
                      History.goBack();
                      //   setDefaultView(btndata.id);
                      //   setIsEdit(false);
                    }}
                  >
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll ">
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
                                Name
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
                              <TextField  inputProps={{ className: "all-Search-box-data" }} name="full_name" onChange={handleSearchData} value={searchData.full_name} />

                              <IconButton style={{ padding: "0" }} onClick={() => requestSort('full_name')} >
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
                            <Select  inputProps={{ className: "all-Search-box-data" }}
                                styles={{ selectStyles }}
                                options={genderArr.map((group) => ({
                                  value: group.value,
                                  label: group.label,
                                }))}
                                isClearable
                                value={searchData.gender}
                                filterOption={createFilter({ ignoreAccents: false })}
                                onChange={handlegenderChange}
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
                              <TextField inputProps={{ className: "all-Search-box-data" }} name="mobile_number" onChange={handleSearchData} value={searchData.mobile_number}/>

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
                              <TextField  inputProps={{ className: "all-Search-box-data" }} name="designation" onChange={handleSearchData} value={searchData.designation}/>

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
                            {/* <TableCell className={classes.tableRowPad}>
                          <TextField name="type_name" onChange={handleSearchData} />

                          <IconButton style={{ padding: "0" }} onClick={() => requestSort('type_name')} >
                            <Icon className="mr-8" style={{ color: "#000" }}> sort </Icon>

                            {(sortConfig && sortConfig.key === "type_name" && sortConfig.direction === "ascending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_downward </Icon>
                            }
                            {(sortConfig && sortConfig.key === "type_name" && sortConfig.direction === "descending") &&
                              <Icon className="mr-8" style={{ color: "#000" }}> arrow_upward </Icon>
                            }
                          </IconButton>
                        </TableCell> */}

                            <TableCell className={classes.tableRowPad}>
                              <TextField  inputProps={{ className: "all-Search-box-data" }} name="company" onChange={handleSearchData} value={searchData.company} />

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
                              <TextField inputProps={{ className: "all-Search-box-data" }} name="email" onChange={handleSearchData} value={searchData.email}/>

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
                              <TextField name="date_of_birth" type="date" 
                              inputProps={{className: "all-Search-box-data",max: moment().format("YYYY-MM-DD")
                          }} onChange={handleSearchData} value={searchData.date_of_birth}/>

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
                              <TextField name="date_of_anniversary" type="date" 
                              inputProps={{className: "all-Search-box-data", max: moment().format("YYYY-MM-DD")
                          }} onChange={handleSearchData} value={searchData.date_of_anniversary}/>

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

                            <TableCell className={classes.tableRowPad}>
                              <TextField  
                              name="created_at" type="date" 
                              inputProps={{ className: "all-Search-box-data",max: moment().format("YYYY-MM-DD")
                          }}
                           onChange={handleSearchData} value={searchData.created_at}/>

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
                            <Select  
                                inputProps={{ className: "all-Search-box-data" }}
                                styles={{ selectStyles }}
                                options={statusArr.map((group) => ({
                                  value: group.value,
                                  label: group.label,
                                }))}
                                isClearable
                                value={searchData.status}
                                filterOption={createFilter({ ignoreAccents: false })}
                                onChange={handlestatusChange}
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
                          {console.log(items)}
                            {items
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
                              {row.country_code === undefined ? + row.mobile_number 
                                : "" + row.country_code + " " + row.mobile_number
                              }
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
                                >
                                  {/* Company */}
                                  {row.company_name}
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
                                {/* {
                                  isReactivate &&   */}
                                   <Button
                                    variant="contained"
                                    className={classes.button}
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
                                {/* } */}

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

export default DeletedSalesman;

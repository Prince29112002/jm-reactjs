import React, { useState, useEffect } from "react";
import {
  Typography,
  Icon,
  IconButton,
  InputBase,
  TextField,
  Box,
} from "@material-ui/core";
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
import Grid from "@material-ui/core/Grid";
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {},
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
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
  table: {
    tableLayout: "auto",
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "340px",
    height: "37px",
    color: "#CCCCCC",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter",
  },
  search: {
    display: "flex",
    border: "1px solid #cccccc",
    float: "right",
    height: "38px",
    width: "340px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
  },
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
  },
}));

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const AccountBlankPage = (props) => {
  const [apiData, setApiData] = useState([]);
  console.log(apiData, "111111111111");
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);

  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({
    client_name: "",
    value: "",
    debits_value: "",
    debits_client_name: "",
  });
  const classes = useStyles();

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    NavbarSetting("Accounts", dispatch);
    DebitCreditApi();
    //eslint-disable-next-line
  }, []);
  function DebitCreditApi() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/metalledger/reportclient`)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          console.log(response.data.data, "/////");
          setApiData(response.data.data);
          setLoading(false);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/metalledger/reportclient" });
      });
  }

  const debits = [];
  const credits = [];
  //  setCreditData(debits)
  //  setdeDitData(credits)
  apiData.forEach((item) => {
    if (parseFloat(item.credit) !== 0) {
      const creditObj = {
        client_name: item.client_name,
        value: parseFloat(item.credit),
      };
      credits.push(creditObj);
    }

    if (parseFloat(item.debit) !== 0) {
      const debitObj = {
        client_name: item.client_name,
        value: parseFloat(item.debit),
      };
      debits.push(debitObj);
    }
  });

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={4} sm={4} md={4} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Debit / Credit
                  </Typography>
                </FuseAnimate>
              </Grid>
            </Grid>
            <div className="main-div-alll ">
              {/* <div>
                <div
                  style={{ borderRadius: "7px !important" }}
                  component="form"
                  className={classes.search}
                >
                  <InputBase
                    className={classes.input}
                    placeholder="Search"
                    inputProps={{ "aria-label": "search" }}
                    value={searchData}
                    onChange={(event) => setSearchData(event.target.value)}
                  />
                  <IconButton
                    type="submit"
                    className={classes.iconButton}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </div>
              </div> */}
              <div className="department-tbl-mt-dv"></div>

              <Paper className={clsx(classes.tabroot, "hsnmaster_tabel")}>
                {loading && <Loader />}
                {/* <d style={{display:"flex"}}> */}
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item xs={12} lg={6}>
                    <Box style={{ overflowX: "auto" }}>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              ID
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Party Name{" "}
                            </TableCell>
                            {/* <TableCell className={classes.tableRowPad}>
                      Debit 
                      </TableCell> */}
                            <TableCell className={classes.tableRowPad}>
                              Credit{" "}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            ></TableCell>{" "}
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              <TextField
                                name="client_name"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />
                            </TableCell>{" "}
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              <TextField
                                name="value"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {credits.length > 0 ? (
                            credits
                              .filter((temp) => {
                                if (searchData.client_name) {
                                  //&& temp.category_name
                                  return temp.client_name
                                    .toLowerCase()
                                    .includes(
                                      searchData.client_name.toLowerCase()
                                    );
                                } else if (searchData.value) {
                                  return String(temp.value)
                                    .toLowerCase()
                                    .includes(searchData.value.toLowerCase());
                                } else {
                                  return temp;
                                }
                              })
                              .map((row, i) => (
                                <TableRow>
                                  <TableCell className={classes.tableRowPad}>
                                    {i + 1}
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className={classes.tableRowPad}
                                  >
                                    {row.client_name}
                                  </TableCell>
                                  {/* <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {row.debit}
                          </TableCell> */}
                                  <TableCell
                                    align="left"
                                    className={classes.tableRowPad}
                                  >
                                    {row.value}
                                  </TableCell>
                                </TableRow>
                              ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan="3"
                                style={{ textAlign: "center", color: "red" }}
                              >
                                <b>No Data Available</b>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </Box>
                  </Grid>

                  <Grid item xs={12} lg={6} style={{marginBottom: "20px"}}>
                    <Box style={{ overflowX: "auto" }}>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              ID
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Party Name{" "}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Debit
                            </TableCell>
                            {/* <TableCell className={classes.tableRowPad}>Credit </TableCell> */}
                          </TableRow>
                          <TableRow>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            ></TableCell>{" "}
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              <TextField
                                name="debits_client_name"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />
                            </TableCell>{" "}
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              <TextField
                                name="debits_value"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {debits.length > 0 ? (
                            debits
                              .filter((temp) => {
                                if (searchData.client_name) {
                                  //&& temp.category_name
                                  return temp.client_name
                                    .toLowerCase()
                                    .includes(
                                      searchData.client_name.toLowerCase()
                                    );
                                } else if (searchData.value) {
                                  return String(temp.value)
                                    .toLowerCase()
                                    .includes(searchData.value.toLowerCase());
                                } else {
                                  return temp;
                                }
                              })
                              .map((row, i) => (
                                <TableRow>
                                  <TableCell className={classes.tableRowPad}>
                                    {i + 1}
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className={classes.tableRowPad}
                                  >
                                    {row.client_name}
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className={classes.tableRowPad}
                                  >
                                    {row.value}
                                  </TableCell>
                                  {/* <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {row.credit}
                          </TableCell> */}
                                </TableRow>
                              ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan="3"
                                style={{ textAlign: "center", color: "red" }}
                              >
                                <b>No Data Available</b>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AccountBlankPage;

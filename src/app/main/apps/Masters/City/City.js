import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, InputBase } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";

import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import CityAddEdit from "./subView/CityAddEdit";
import Select, { createFilter } from "react-select";
import Icones from "assets/fornt-icons/Mainicons";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {},
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
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
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

const City = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [modalView, setModalView] = useState(false);
  const [edit, setEdit] = useState("");
  const [searchData, setSearchData] = useState("");
  const [loading, setLoading] = useState(true);

  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryErr, setSelectedCountryErr] = useState("");

  const [stateData, setStateData] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedStateErr, setSelectedStateErr] = useState("");

  const [cityData, setCityData] = useState([]);
  const [stateId, setStateId] = useState("");

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };
  const theme = useTheme();

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    getCountrydata();
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);

  const handleClose = () => {
    setEdit("");
    setModalView(false);
    if (stateId) {
      getCityData(stateId);
    }
  };

  const headerClose = () => {
    setEdit("");
    setModalView(false);
  };

  function getCountrydata() {
    axios
      .get(Config.getCommonUrl() + "api/country")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setCountryData(response.data.data);
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
        handleError(error, dispatch, { api: "api/country" });
      });
  }
  function getStatedata(countryID) {
    axios
      .get(Config.getCommonUrl() + "api/country/state/" + countryID)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStateData(response.data.data);
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
        handleError(error, dispatch, { api: "api/country/state/" + countryID });
      });
  }
  function getCityData(id) {
    axios
      .get(Config.getCommonUrl() + "api/city/" + id)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setCityData(response.data.data);
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
        handleError(error, dispatch, { api: "api/city/" + id });
      });
  }

  function handleCountryChange(value) {
    setSelectedCountry(value);
    setSelectedCountryErr("");
    setStateData([]);
    setSelectedState("");
    setSelectedStateErr("");
    getStatedata(value.value);
  }

  function handleChangeState(value) {
    setSelectedState(value);
    setSelectedStateErr("");
    setStateId(value.value);
    getCityData(value.value);
  }

  const editHandler = (id) => {
    if (id) {
      setModalView(true);
      setEdit(id);
    }
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              className=" department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={6} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    City
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              >
                <Button
                  // variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={() => setModalView(true)}
                >
                  Add New
                </Button>
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll ">
              <div>
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
              </div>
              <Grid container>
                <Grid item lg={3} md={3} sm={3} xs={12} style={{ padding: 6 }}>
                  <p>Select country</p>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={countryData.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.name,
                    }))}
                    // components={components}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    placeholder="Country"
                  />

                  <span style={{ color: "red" }}>
                    {selectedCountryErr.length > 0 ? selectedCountryErr : ""}
                  </span>
                </Grid>
                <Grid
                  item
                  lg={3}
                  md={3}
                  sm={3}
                  xs={12}
                  style={{ padding: 6 }}
                  className="packing-slip-input"
                >
                  <p>Select state</p>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={stateData.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.name,
                    }))}
                    // components={components}
                    value={selectedState}
                    onChange={handleChangeState}
                    placeholder="State"
                  />

                  <span style={{ color: "red" }}>
                    {selectedStateErr.length > 0 ? selectedStateErr : ""}
                  </span>
                </Grid>
              </Grid>
              {modalView === true && (
                <CityAddEdit
                  modalColsed={handleClose}
                  data={edit}
                  headerClose={headerClose}
                />
              )}
              <div className="mt-32">
                <Paper className={classes.tabroot} id="finishpurity_tabel_dv">
                  <div className="table-responsive ">
                    <MaUTable className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>
                            Country Name
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            State Name
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            City Name
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cityData.length > 0 ? (
                          cityData
                            .filter(
                              (temp) =>
                                temp.statename?.countryname?.name
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                temp.statename?.name
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase()) ||
                                temp.name
                                  .toLowerCase()
                                  .includes(searchData.toLowerCase())
                            )
                            .map((row, i) => (
                              <TableRow key={i}>
                                <TableCell className={classes.tableRowPad}>
                                  {row.statename?.countryname?.name}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.statename?.name}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.name}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
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
                                    }}
                                    hidden={true}
                                  >
                                    <Icon className="mr-8 delete-icone">
                                      <img src={Icones.delete_red} alt="" />
                                    </Icon>
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan="4"
                              style={{ textAlign: "center" }}
                            >
                              <b>Please Select Country And State</b>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </MaUTable>
                  </div>
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default City;

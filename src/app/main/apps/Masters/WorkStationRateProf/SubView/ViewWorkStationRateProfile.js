import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, InputBase } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import SearchIcon from "@material-ui/icons/Search";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import History from "@history";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Loader from "../../../../Loader/Loader";
import Search from "../../SearchHelper/SearchHelper";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { CSVLink } from "react-csv";
import { FuseAnimate } from "@fuse";
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
    backgroundColor: "cornflowerblue",
    color: "white",
  },

  //   tabroot: {
  //     // width: "fit-content",
  //     // marginTop: theme.spacing(3),
  //     overflowX: "auto",
  //     overflowY: "auto",
  //     // height: "100%",
  //     height: "100%",
  //     boxShadow: "none",
  //     backgroundColor: "transparent",
  //   },
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    height: "600px",
  },

  table: {
    minWidth: 650,
  },
  //   tableRowPad: {
  //     padding: 7,
  //   },
  tableRowPad: {
    // minWidth: 200,
    textOverflow: "ellipsis",
    // maxWidth: 250,
    // min-width: 200px;
    // text-overflow: ellipsis;
    // max-width: 250px;
    overflow: "hidden",
    padding: 7,
  },
  searchBox: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
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
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
  },
}));

const ViewWorkstationRateProfile = (props) => {
  const dataToBeEdited = props.location.state;

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState([]);
  const [exportData, setExportData] = useState([]);
  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    console.log("useEffect", dataToBeEdited);

    if (dataToBeEdited !== undefined) {
      getPerticularTaggingRateProf();
    } else {
      setLoading(false);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);

  function onSearchHandler(sData) {
    // console.log("Search on", sData);
    setSearchData(sData);
  }

  //   function getPerticularTaggingRateProf() {
  //     setLoading(true);

  //     axios
  //       .get(
  //         Config.getCommonUrl() +
  //           `api/workStationRateProfile/getRateProfile/${dataToBeEdited.id}`
  //       )
  //       .then(function (response) {
  //         if (response.data.success === true) {
  //           console.log(response);
  //           setApiData(response.data.data);
  //           // setData(response.data);
  //           setLoading(false);
  //           let tempDlData = response.data.data.map((item) => {
  //             return {
  //               "Category Code": item.category_code,
  //               "Wastage %": item.wastage_per,
  //               "Per Gram/pcs/Stone/Manual": item.per_gram_pcs_stone_manual,
  //               "labour Rate in INR": item.rate,
  //             };
  //           });
  //           setExportData(tempDlData);
  //         } else {
  //           setApiData([]);
  //           setExportData([]);
  //           dispatch(Actions.showMessage({ message: response.data.message }));
  //           setLoading(false);
  //         }
  //       })
  //       .catch(function (error) {
  //         setLoading(false);
  //         handleError(error, dispatch, {
  //           api: `api/workStationRateProfile/getRateProfile/${dataToBeEdited.id}`,
  //         });
  //       });
  //   }
  function getPerticularTaggingRateProf() {
    setLoading(true);

    axios
      .get(
        Config.getCommonUrl() +
          `api/workStationRateProfile/getRateProfile/${dataToBeEdited.id}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
          // setData(response.data);
          setLoading(false);
          let tempDlData = response.data.data.map((item) => {
            return {
              "Category Code": item.category_code,
              "Wastage %": item.wastage_per,
              "Per Gram/pcs/Stone/Manual": item.per_gram_pcs_stone_manual,
              "labour Rate in INR": item.rate,
            };
          });
          setExportData(tempDlData);
        } else {
          setApiData([]);
          setExportData([]);
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/workStationRateProfile/getRateProfile/${dataToBeEdited.id}`,
        });
      });
  }
  const classes = useStyles();

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
                    Work Station Rate Profile
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                key="2"
                style={{ textAlign: "right" }}
              >
                {/* <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={(event) => {
                    setModalOpen(true);
                    setIsEdit(false);
                  }}
                >
                  Add New
                </Button> */}
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
                      alt=""
                    />
                    Back
                  </Button>
                </div>
                {/* </Link> */}
              </Grid>
            </Grid>
            <div className="main-div-alll ">
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
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
                <IconButton
                  style={{
                    padding: "0",
                    height: "100%",
                    marginLeft: "10px",
                  }}
                  className="ml-0"
                  disabled={exportData.length === 0}
                >
                  <CSVLink
                    data={exportData}
                    filename="workstation_Rate_Profile.csv"
                  >
                    <Icon
                      style={{
                        color: exportData.length === 0 ? "gray" : "dodgerblue",
                      }}
                    >
                      get_app
                    </Icon>
                  </CSVLink>
                </IconButton>
              </div>
              {loading && <Loader />}
              <div className="mt-20 department-tbl-mt-dv">
                <Paper className={classes.tabroot}>
                  {/* <div className="new-add_stock_group_tbel"> */}
                  <Table className={clsx(classes.table)}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          Category Code
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Stock Code
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Wastage (%)
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Pieces / Gram
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Rate
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiData
                        .filter(
                          (temp) =>
                            (temp.category_code !== null &&
                              temp.category_code
                                .toLowerCase()
                                .includes(searchData.toLowerCase())) ||
                            (temp.stock_code !== null &&
                              temp.stock_code
                                .toLowerCase()
                                .includes(searchData.toLowerCase())) ||
                            (temp.per_gram_pcs !== null &&
                              temp.per_gram_pcs
                                .toLowerCase()
                                .includes(searchData.toLowerCase())) ||
                            (temp.rate !== null &&
                              temp.rate
                                .toString()
                                .toLowerCase()
                                .includes(searchData.toLowerCase())) ||
                            (temp.wastage_per !== null &&
                              temp.wastage_per
                                .toString()
                                .toLowerCase()
                                .includes(searchData.toLowerCase()))
                        )
                        .map((row) => (
                          <TableRow key={row.id}>
                            {/* * component="th" scope="row" */}
                            <TableCell className={classes.tableRowPad}>
                              {row.category_code ? row.category_code : "NA"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row.stock_code ? row.stock_code : "NA"}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row?.wastage_per}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row?.per_gram_pcs}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row?.rate}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  {/* </div> */}
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default ViewWorkstationRateProfile;

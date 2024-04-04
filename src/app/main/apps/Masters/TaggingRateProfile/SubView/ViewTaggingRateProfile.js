import React, { useState, useEffect } from "react";
import { IconButton, InputBase, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
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
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";
import SearchIcon from "@material-ui/icons/Search";
import { FuseAnimate } from "@fuse";

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

const ViewTaggingRateProfile = (props) => {
  const dataToBeEdited = props.location.state;

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState([]);

  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    // visible true -> false
    if (loading) {
      //setTimeout(() => setLoaded(true), 250);
      //debugger;
      // setTimeout(() => setLoading(false), 10000);
    }

    //setLoaded(loaded);
  }, [loading, apiData]);

  useEffect(() => {

    if (dataToBeEdited !== undefined) {
      getPerticularTaggingRateProf();
      // setTimeout(() => getPerticularTaggingRateProf(), 10000);
    } else {
      setLoading(false);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    NavbarSetting("Master", dispatch);
  }, []);



  function getPerticularTaggingRateProf() {
    setLoading(true);

    axios
      .get(
        Config.getCommonUrl() +
          `api/taggingRateProfile/getStock/${dataToBeEdited.id}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
          // setData(response.data);
          setLoading(false);
        } else {
          setApiData([]);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setLoading(false);
        }
      })
      .catch(function (error) {
        setLoading(false);

        handleError(error, dispatch, {
          api: `api/taggingRateProfile/getStock/${dataToBeEdited.id}`,
        });
      });
  }

  const classes = useStyles();

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
                View Tagging Rate Profile               
                 </Typography>
              </FuseAnimate>

              {/* {!isViewOnly && <BreadcrumbsHelper />} */}
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
          <div className="main-div-alll ">
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
            {loading && <Loader />}

            {/* {apiData.length === 0 ? ( */}
            <div className="mt-56 department-tbl-mt-dv">
              <div className="table-responsive ">
                <Paper className={classes.tabroot}>
                  <div className="table-responsive">
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>
                            Category Code
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Stock Code
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Pieces / Gram
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Rate
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Weight
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {apiData
                          .filter(
                            (temp) =>
                              temp.category_code
                                .toLowerCase()
                                .includes(searchData.toLowerCase()) ||
                              temp.stock_code
                                .toLowerCase()
                                .includes(searchData.toLowerCase()) ||
                              temp.rate
                                .toString()
                                .toLowerCase()
                                .includes(searchData.toLowerCase()) ||
                              temp.is_pcs_grm
                                .toString()
                                .toLowerCase()
                                .includes(searchData.toLowerCase()) ||
                              temp.weight
                                .toString()
                                .toLowerCase()
                                .includes(searchData.toLowerCase())
                          )
                          .map((row) => (
                            <TableRow key={row.id}>
                              {/* component="th" scope="row" */}
                              <TableCell className={classes.tableRowPad}>
                                {row.category_code}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.stock_code}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.is_pcs_grm}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.rate}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.weight}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </div>
      </FuseAnimate>
    </div>
  );
};

export default ViewTaggingRateProfile;

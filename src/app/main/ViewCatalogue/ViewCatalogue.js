import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
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
import History from "@history";
import Loader from "app/main/Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import moment from "moment";
import { BorderAll } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100px",
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
    height: "100%",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  selectBox: {
    // marginTop: 8,
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    // marginLeft: 15,
  },
}));

const ViewCatalogue = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [catalogueName, setCatalogueName] = useState("");
  const [catNamErr, setCatNameErr] = useState("");

  const [expDate, setExpDate] = useState("");
  const [expDtErr, setExpDtErr] = useState("");

  const [showAppFlag, setShowAppFlag] = useState("");
  const [showAppErr, setShowAppErr] = useState("");

  const [whom, setWhom] = useState("");
  const [whomErr, setWhomErr] = useState("");

  const [userList, setUserList] = useState([]);

  const [MasterChecked, setMasterChecked] = useState(false);

  const [designFlag, setDesignFlag] = useState(false);
  const today = moment().format("YYYY-MM-DD");

  const [designData, setDesignData] = useState([]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    const id = props.match.params.id;
    getViewOneCatalogue(id);
  }, []);

  function getViewOneCatalogue(id) {
    axios
      .get(Config.getCommonUrl() + `api/catalogue/mobileapp/url/${id}`)
      .then(function (response) {
        console.log(response.data.data);
        if (response.data.success === true) {
          var data = response.data.data;
          setExpDate(data.expiry_date);
          setCatalogueName(data.name);
          setDesignData(data.CatalogueDesign);
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
        handleError(error, dispatch, {
          api: `api/catalogue/mobileapp/url/${id}`,
        });
      });
  }
  function getUserMaster(uList) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/usermaster")
      .then(function (response) {
        if (response.data.success === true) {
          let tempData = response.data.data;
          let tempApi = tempData.map((x) => {
            let compNm = "";
            if (x.user_type === 6) {
              compNm =
                x.hasOwnProperty("RetailerName") && x.RetailerName !== null
                  ? x.RetailerName.company_name
                  : "";
            } else if (
              x.user_type === 1 ||
              x.user_type === 2 ||
              x.user_type === 3 ||
              x.user_type === 6
            ) {
              compNm =
                x.hasOwnProperty("ClientName") && x.ClientName !== null
                  ? x.ClientName.hasOwnProperty("company_name")
                    ? x.ClientName.company_name
                    : ""
                  : "";
            }
            return {
              ...x,
              selected:
                uList.length > 0
                  ? uList.some((item) => item.user_id === x.id)
                  : false,
              compName: compNm,
            };
          });
          setUserList(tempApi);
          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "api/usermaster" });
      });
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
                <Typography className="pl-28 pt-16 text-18 font-700">
                  View Catalogue
                </Typography>
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll ">
              <div className="w-full flex flex-row flex-wrap  ">
                <div className="add-textfiled">
                  <p>Catalogue Name</p>
                  <TextField
                    className=""
                    placeholder="Name"
                    name="catalogueName"
                    value={catalogueName}
                    variant="outlined"
                    required
                    fullWidth
                    disabled
                  />
                </div>
                <div>
                  {today <= expDate ? (
                    <div className="m-8 department-tbl-mt-dv">
                      <Paper
                        className={classes.tabroot}
                        id="department-tbl-fix "
                      >
                        <div className="table-responsive ">
                          <Table className={classes.table}>
                            <TableHead>
                              <TableRow>
                                <TableCell className={classes.tableRowPad}>
                                  Catagories
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  align="left"
                                >
                                  Item Code
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  align="left"
                                >
                                  Image
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {designData.map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell
                                    align="left"
                                    className={classes.tableRowPad}
                                  >
                                    {row.category_name}
                                  </TableCell>

                                  <TableCell
                                    align="left"
                                    className={classes.tableRowPad}
                                  >
                                    {row.variant_number}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    <img
                                      src={row.design_image}
                                      height={50}
                                      width={50}
                                      alt=""
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </Paper>
                    </div>
                  ) : (
                    <div
                      style={{
                        height: "70vh",
                        width: "100vw",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <h1 style={{ color: "rgb(255,115,71)" }}>
                        This Catalogue is expired, Please contact VK Jewels Pvt.
                        Ltd.
                      </h1>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default ViewCatalogue;

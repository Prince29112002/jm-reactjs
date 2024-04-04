import React, { useContext, useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppContext from "app/AppContext";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Loader from "app/main/Loader/Loader";
import Select, { createFilter } from "react-select";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
  table: {
    minWidth: 650,
  },
  filterbtn: {
    textAlign:"left",

    [theme.breakpoints.down('sm')]: {
      textAlign:"right"
    },
  },
}));

const HallmarkIssuedList = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [clientdata, setClientdata] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectClientErr, setSelectClientErr] = useState("");

  const [clientCompanies, setClientCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompErr, setSelectedCompErr] = useState("");
  const [issuehallmarkList, setIssueHallmarkList] = useState([]);

  const [loading, setLoading] = useState(false);

  const appContext = useContext(AppContext);

  const { selectedDepartment } = appContext;

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  useEffect(() => {
    NavbarSetting("Hallmark", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedClient) {
      getClientCompanies(selectedClient.value);
    }
  }, [selectedClient]);

  useEffect(() => {
    getClientData();
  }, []);

  const onClick = () => {
    if (validateparty() && validateFirm()) {
      if (selectedClient && selectedCompany) {
        getHallMarkIssueList();
      }
    }
  };
  function getClientData() {
    axios
      .get(Config.getCommonUrl() + "api/client/listing/listing")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setClientdata(response.data.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant:"error"
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/client/listing/listing" });
      });
  }

  function getClientCompanies(clientId) {
    axios
      .get(
        Config.getCommonUrl() + `api/client/company/listing/listing/${clientId}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          var compData = response.data.data;
          setClientCompanies(compData);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant:"error"
            })
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/client/company/listing/listing/${clientId}`,
        });
      });
  }

  function handlePartyChange(value) {
    setSelectedClient(value);
    setSelectedCompany("");
    setSelectClientErr("");
  }

  function handleCompanyChange(value) {
    setSelectedCompany(value);
    setSelectedCompErr("");
  }

  function getHallMarkIssueList() {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() +
          `api/hallmarkissue/hallmark/list/${selectedClient.value}/${
            selectedCompany.value
          }/${selectedDepartment.value.split("-")[1]}`
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log(response.data.data);
          if (response.data.data.length > 0) {
            const slipDataArr = [];
            response.data.data.map((item) => {
              item.PackingSlipData.map((temp) => {
                slipDataArr.push({
                  ...temp,
                  req_num: item.request_number,
                });
              });
            });
            setIssueHallmarkList(slipDataArr);
          } else {
            dispatch(
              Actions.showMessage({ message: "No Data", variant: "error" })
            );
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant:"error"
            })
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/hallmarkissue/hallmark/list/${selectedClient.value}/${
            selectedCompany.value
          }/${selectedDepartment.value.split("-")[1]}`,
        });
      });
  }

  function validateparty() {
    if (selectedClient === "" || selectedClient === null) {
      setSelectClientErr("Select Party Name");
      return false;
    }
    return true;
  }

  function validateFirm() {
    if (selectedCompany === "" || selectedCompany === null) {
      setSelectedCompErr("Select Firm Name");
      return false;
    }
    return true;
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container table-width-mt">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className=" department-main-dv pb-8"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={4} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Issued Hallmark List
                  </Typography>
                </FuseAnimate>
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll ">
              <Grid container >
                <Grid item lg={4} md={4} sm={6} xs={12} style={{ padding: 6 }}>
                  <label>Party name</label>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={clientdata.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.name,
                    }))}
                    value={selectedClient}
                    onChange={handlePartyChange}
                    placeholder="Party Name"
                  />

                  <span style={{ color: "red" }}>
                    {selectClientErr.length > 0 ? selectClientErr : ""}
                  </span>
                </Grid>
                <Grid
                  item
                  lg={4}
                  md={4}
                  sm={6}
                  xs={12}
                  style={{ padding: 6 }}
                  className="packing-slip-input"
                >
                  <label>Firm name</label>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={clientCompanies.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.company_name,
                    }))}
                    value={selectedCompany}
                    onChange={handleCompanyChange}
                    placeholder="Firm Name"
                  />

                  <span style={{ color: "red" }}>
                    {selectedCompErr.length > 0 ? selectedCompErr : ""}
                  </span>
                </Grid>
                <Grid item lg={4} md={4} xs={12} sm={12} style={{ padding: 6}} className={classes.filterbtn}>
                  <Button
                    id="btn-save"
                    variant="contained"
                    color="primary"
                    className="mt-20"
                    aria-label="Register"
                    onClick={onClick}
                  >
                    Load Data
                  </Button>
                </Grid>
              </Grid>
              
              <div className="mt-16">
                <Paper className={classes.tabroot} id="finishpurity_tabel_dv">
                  <div className="table-responsive ">
                    <MaUTable className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>
                            Req. No
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Packing Slip No
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            purity
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Net Weight
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Fine
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {issuehallmarkList.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className={classes.tableRowPad}>
                              {row.req_num}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {" "}
                              {row.BarCodePackingSlip
                                ? row.BarCodePackingSlip.barcode
                                : ""}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row.purity}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row.net_wgt}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {((row.net_wgt * row.purity) / 100).toFixed(3)}
                            </TableCell>
                          </TableRow>
                        ))}
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

export default HallmarkIssuedList;

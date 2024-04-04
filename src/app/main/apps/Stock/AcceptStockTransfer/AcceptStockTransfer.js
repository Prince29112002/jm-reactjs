import React, { useContext, useState, useEffect } from "react";
import { Checkbox, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import History from "@history";
import AppContext from "app/AppContext";
import Loader from "app/main/Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

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
    tableLayout: "auto",
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
}));


const AcceptStockTransfer = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // const theme = useTheme();
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [checkRejectAll, setRejectCheckAll] = useState(false);
  const [modalView, setModalView] = useState(0);
  const [transferedApiData, setTransferedApiData] = useState([]);
  const appContext = useContext(AppContext);

  const { selectedDepartment } = appContext;
  const pgName = props.location.pathname;

  useEffect(() => {
    console.log(">>>>>>>>", selectedDepartment);
    if (selectedDepartment !== "") {
      getPendingStock(
        `api/stock/pending?department_id=${
          selectedDepartment.value.split("-")[1]
        }`
      );
      getTransferPendingStock();
    }
    //eslint-disable-next-line
  }, [selectedDepartment]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    if (pgName === "/dashboard/stock/accepttransferstock") {
      NavbarSetting("Tagging", dispatch);
    } else {
      NavbarSetting("Stock", dispatch);
    }
    //eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   // getPendingStock();

  // }, [dispatch])
  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);
  function getTransferPendingStock() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/stock/pending/users`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setLoading(false);

          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              setTransferedApiData(response.data.data);
            } else {
              setTransferedApiData([]);
            }
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
            setTransferedApiData([]);
          }
        } else {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
          setTransferedApiData([]);
        }
      })
      .catch(function (error) {
        // console.log(error);
        setLoading(false);

        handleError(error, dispatch, {
          api: `api/stock/pending/users`,
        });
      });
  }
  function getPendingStock(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setLoading(false);

          if (response.data.hasOwnProperty("data")) {
            if (response.data.data !== null) {
              setApiData(response.data.data);
            } else {
              setApiData([]);
            }
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
            setApiData([]);
          }
        } else {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
          setApiData([]);
        }
      })
      .catch(function (error) {
        // console.log(error);
        setLoading(false);

        handleError(error, dispatch, { api: url });
      });
  }

  const acceptRejectHandler = (e, flag, row) => {
    e.preventDefault();
    console.log("row", row);

    if (flag === 0) {
      //reject
      AcceptRejectApi("api/stock/reject", {
        stock_transfer_ids: row.stock_transfer_id, //already array
        to_department_id: selectedDepartment.value.split("-")[1], //current selected department
        stock_code_weight: [
          {
            stock_name_code_id: row.stock_name_code_id,
            weight: row.net_weight,
            from_department_id: row.from_department_id,
            ...([5, 6, 14, 15, 16].includes(row.item_id) && { pcs: row.pcs }),
          },
        ],
      });
    } else if (flag === 1) {
      //accept
      AcceptRejectApi("api/stock/accept", {
        stock_transfer_ids: row.stock_transfer_id, //already array
        to_department_id: selectedDepartment.value.split("-")[1], //current selected department
        stock_code_weight: [
          {
            stock_name_code_id: row.stock_name_code_id,
            weight: row.net_weight,
            from_department_id: row.from_department_id,
            ...([5, 6, 14, 15, 16].includes(row.item_id) && { pcs: row.pcs }),
          },
        ],
      });
    } else if (flag === 2) {
      //accept all
      let tempArr = [];
      apiData.map((item) => {
        if (item.checked) {
          tempArr.push(...item.stock_transfer_id);
        }
      });
      // console.log(tempArr)
      AcceptRejectApi("api/stock/accept", {
        stock_transfer_ids: tempArr,
        to_department_id: selectedDepartment.value.split("-")[1], //current selected department
        stock_code_weight: apiData.map((item) => {
          return {
            stock_name_code_id: item.stock_name_code_id,
            weight: item.net_weight,
            from_department_id: item.from_department_id,
            ...([5, 6, 14, 15, 16].includes(item.item_id) && { pcs: item.pcs }),
          };
        }),
      });
    }
    return null;
  };

  function AcceptRejectApi(url, payload) {
    setLoading(true);
    axios
      .post(Config.getCommonUrl() + url, payload)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
          getPendingStock(
            `api/stock/pending?department_id=${
              selectedDepartment.value.split("-")[1]
            }`
          );
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
        }
        setCheckAll(false);
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);
        handleError(error, dispatch, {
          api: url,
          body: payload,
        });
      });
  }

  const handleBack = () => {
    if (pgName === "/dashboard/stock/accepttransferstock/:stock") {
      History.push("/dashboard/stock/:stock");
    } else {
      History.push("/dashboard/stock");
    }
  };

  const handleReject = (row, flag) => {
    if (checkCheckedStatus(transferedApiData)) {
      handleRejectTransferbyUser(row, flag);
    }
  };
  const handleAccept = (e, flag, row) => {
    if (checkCheckedStatus(apiData)) {
      acceptRejectHandler(e, flag, row);
    }
  };
  function handleRejectTransferbyUser(row, flag) {
    let body;
    let tempArr = [];
    transferedApiData.map((item) => {
      if (item.checked) {
        tempArr.push(...item.stock_transfer_id);
      }
    });
    if (flag === 1) {
      body = {
        stock_transfer_ids: row.stock_transfer_id,
        to_department_id: row.to_department_id,
        stock_code_weight: [
          {
            stock_name_code_id: row.stock_name_code_id,
            weight: row.net_weight,
            from_department_id: row.from_department_id,
            ...([5, 6, 14, 15, 16].includes(row.item_id) && { pcs: row.pcs }),
          },
        ],
      };
    } else {
      body = {
        stock_transfer_ids: tempArr,
        to_department_id: selectedDepartment.value.split("-")[1],
        stock_code_weight: transferedApiData.map((item) => {
          return {
            stock_name_code_id: item.stock_name_code_id,
            weight: item.net_weight,
            from_department_id: item.from_department_id,
            ...([5, 6, 14, 15, 16].includes(item.item_id) && { pcs: item.pcs }),
          };
        }),
      };
    }
    console.log(row);

    axios
      .post(Config.getCommonUrl() + `api/stock/reject`, body)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          getTransferPendingStock();
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
          api: `api/stock/reject`,
          body: body,
        });
      });
  }

  const handleCheckedAll = (e) => {
    setCheckAll(e.target.checked);
    if (e.target.checked) {
      const allId = [];
      const dataArr = [...apiData];

      const arr = dataArr.map((item) => {
        allId.push(item.id);
        return {
          ...item,
          checked: true,
        };
      });
      setSelectedId(allId);
      setApiData(arr);
    } else {
      const dataArr = [...apiData];
      const arr = dataArr.map((item) => {
        return {
          ...item,
          checked: false,
        };
      });
      setApiData(arr);
      setSelectedId([]);
    }
  };

  const handleRejectCheckedAll = (e) => {
    setRejectCheckAll(e.target.checked);
    if (e.target.checked) {
      const allId = [];
      const dataArr = [...transferedApiData];

      const arr = dataArr.map((item) => {
        allId.push(item.id);
        return {
          ...item,
          checked: true,
        };
      });
      // setSelectedId(allId);
      setTransferedApiData(arr);
    } else {
      const dataArr = [...transferedApiData];
      const arr = dataArr.map((item) => {
        return {
          ...item,
          checked: false,
        };
      });
      setTransferedApiData(arr);
      // setSelectedId([]);
    }
  };

  const handleChecked = (e, i) => {
    setCheckAll(false);
    if (e.target.checked) {
      const dataArr = [...apiData];
      dataArr[i]["checked"] = true;
      setApiData(dataArr);
    } else {
      const dataArr = [...apiData];
      dataArr[i]["checked"] = false;
      setApiData(dataArr);
    }
  };

  const handleRejectChecked = (e, i) => {
    setRejectCheckAll(false);
    if (e.target.checked) {
      const dataArr = [...transferedApiData];
      dataArr[i]["checked"] = true;
      setTransferedApiData(dataArr);
    } else {
      const dataArr = [...transferedApiData];
      dataArr[i]["checked"] = false;
      setTransferedApiData(dataArr);
    }
  };

  const handleChangeTab = (event, value) => {
    setModalView(value);
  };

  function checkCheckedStatus(data) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].checked === true) {
        return true;
      }
    }
    dispatch(
      Actions.showMessage({
        message: "Plz Select Stock",
        variant: "error",
      })
    );
    return false;
  }


  return (
    <div className={clsx(classes.root, props.className, "w-full header_navbar_effect")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container department-fullwidth">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            <Grid
              container
              alignItems="center"
              style={{ marginBottom: 20, marginTop: 30, paddingInline: 30 }}
            >
              <Grid item xs={12} sm={8} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Accept Stock
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                md={9}
                key="2"
                style={{ textAlign: "right", display: "flex", alignItems: "center", justifyContent: "flex-end"}}
              >
                <div className="btn-back">
                  <Button
                    id="btn-back"
                    size="small"
                    onClick={handleBack}
                    style={{marginRight: 10}}
                  >
                      <img
                          className="back_arrow"
                          src={Icones.arrow_left_pagination}
                          alt=""/>
                  
                    Back
                  </Button>
                </div>
                {modalView === 0 && (
                <Button
                  variant="contained"
                  className={clsx(classes.button)}
                  size="small"
                  id="btn-save"
                  // style={{margin: 0}}
                  style={{
                    backgroundColor: "#415bd4",
                    border: "none",
                    color: "white",
                  }}
                  onClick={(e) => handleAccept(e, 2, null)}
                >
                  Accept 
                </Button>
                )}

              {modalView === 1 && (
                <Button
                  variant="contained"
                  className={clsx(classes.button)}
                  size="small"
                  id="btn-save"
                  // style={{margin: 0}}
                  style={{
                    backgroundColor: "#e72222",
                    border: "none",
                    color: "white",
                    margin: 2,
                    textTransform: "capitalize",
                  }}
                  // onClick={(event) => setModalView(btndata.id)}
                  onClick={(e) => handleReject(null, 2)}
                >
                  Reject
                </Button>
                )}

                {/* <Button
                  variant="contained"
                  className={clsx(classes.button)}
                  size="small"
                  id="btn-save"
                  style={{margin: 0}}
                  onClick={(e) => acceptRejectHandler(e, 2, null)}
                >
                  Accept All
                </Button> */}

              </Grid>
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll">
              <Paper
                className={clsx(
                  classes.tabroot,
                  "table-responsive accepttransfer-blg-dv accepttransfer-table-blg "
                )}
              >
                 {modalView === 0 && (
                <MaUTable className={classes.table}>
                  <TableHead>
                    <TableRow>
                    <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "80px" }}
                        >
                          <Checkbox
                            name="selectdesign"
                            onChange={handleCheckedAll}
                            checked={checkAll}
                            disabled={apiData.length === 0}
                          />
                        </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Stock Type
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Stock Code
                      </TableCell>
                      {/* <TableCell className={classes.tableRowPad}>Category</TableCell> */}
                      <TableCell className={classes.tableRowPad}>
                        Purity
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Pieces
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Gross Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Net Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Other Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell
                            className={classes.tableRowPad}
                            style={{ width: "80px" }}
                          >
                            <Checkbox
                              name="selectdesign"
                              onChange={(e) => handleChecked(e, index, row)}
                              // checked={selectedId.includes(row.id.toString()) ? true : false}
                              checked={row.checked ? true : false}
                            />
                          </TableCell>
                        <TableCell align="left" className={classes.tableRowPad}>
                          {row.stockType}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {row.stock_name_code}
                        </TableCell>
                        <TableCell align="left" className={classes.tableRowPad}>
                          {row.purity}
                        </TableCell>

                        <TableCell align="left" className={classes.tableRowPad}>
                          {row.pcs}
                        </TableCell>

                        <TableCell align="left" className={classes.tableRowPad}>
                          {parseFloat(row.gross_weight).toFixed(3)}
                        </TableCell>
                        <TableCell align="left" className={classes.tableRowPad}>
                          {parseFloat(row.net_weight).toFixed(3)}
                        </TableCell>
                        <TableCell align="left" className={classes.tableRowPad}>
                          {parseFloat(row.other_weight).toFixed(3)}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <Button
                            variant="contained"
                            className={classes.button}
                            style={{
                              backgroundColor: "#4caf50",
                              border: "none",
                              color: "white",
                            }}
                            size="small"
                            onClick={(e) => acceptRejectHandler(e, 1, row)}
                          >
                            Accept
                          </Button>

                          {/* <Button
                            variant="contained"
                            className={classes.button}
                            size="small"
                            style={{
                              backgroundColor: "red",
                              border: "none",
                              color: "white",
                            }}
                            onClick={(e) => acceptRejectHandler(e, 0, row)}
                          >
                            Reject
                          </Button> */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </MaUTable>
                 )}
                 
                {modalView === 1 && (
                  // <TableContainer
                  //   className={classes.scroll}
                  //   style={{ marginBottom: 16 }}
                  // >
                  <MaUTable
                    className={classes.table}
                    style={{ tableLayout: "auto" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "80px" }}
                        >
                          <Checkbox
                            name="selectdesign"
                            onChange={handleRejectCheckedAll}
                            checked={checkRejectAll}
                            disabled={transferedApiData.length === 0}
                            style={{ padding: 2 }}
                          />
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ paddingLeft: 20 }}
                        >
                          Stock Type
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Stock Code
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          From Department
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          To Department
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad}>Category</TableCell> */}
                        <TableCell className={classes.tableRowPad}>
                          Purity
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Pieces
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Gross Weight
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Net Weight
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Other Weight
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ paddingRight: 20 }}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {console.log(transferedApiData)}
                      {transferedApiData.length === 0 ? (
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            colSpan={11}
                            align="center"
                            style={{textAlign:"center"}}
                          >
                            No Data Found
                          </TableCell>
                        </TableRow>
                      ) : (
                        transferedApiData.map((row, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{ width: "80px" }}
                              >
                                <Checkbox
                                  name="selectdesign"
                                  style={{ padding: 2 }}
                                  onChange={(e) =>
                                    handleRejectChecked(e, index, row)
                                  }
                                  // checked={selectedId.includes(row.id.toString()) ? true : false}
                                  checked={row.checked ? true : false}
                                />
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                                style={{ paddingLeft: 20 }}
                              >
                                {row.stockType}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.stock_name_code}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.from_deparment_name}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.to_deparment_name}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.purity}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.pcs}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {parseFloat(row.gross_weight).toFixed(3)}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {parseFloat(row.net_weight).toFixed(3)}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {parseFloat(row.other_weight).toFixed(3)}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{ paddingRight: 20 }}
                              >
                                <Button
                                  variant="contained"
                                  className={classes.button}
                                  size="small"
                                  style={{
                                    backgroundColor: "#e72222",
                                    border: "none",
                                    color: "white",
                                    margin: 2,
                                    textTransform: "capitalize",
                                  }}
                                  onClick={(e) =>
                                    handleRejectTransferbyUser(row, 1)
                                  }
                                >
                                  Reject
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </MaUTable>
                  // </TableContainer>
                )}
              </Paper>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AcceptStockTransfer;

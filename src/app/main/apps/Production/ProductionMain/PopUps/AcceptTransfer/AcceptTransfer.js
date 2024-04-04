import { FuseAnimate } from "@fuse";
import History from "@history";
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { Add, Delete, KeyboardBackspace, Search } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import Config from "app/fuse-configs/Config";
// import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import Loader from "app/main/Loader/Loader";
import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import AppContext from "app/AppContext";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  bredcrumbTitle: {
    fontWeight: "700",
    fontSize: "18px",
    marginBottom: 12,
    paddingLeft: 16,
  },
  modalContainer: {
    paddingBlock: "20px",
    background: "rgba(0,0,0,0)",
    justifyContent: "space-between",
  },
  addBtn: {
    display: "block",
    borderRadius: "8px",
    background: "#1E65FD",
    minWidth: "40px",
  },
  addStockTableContainer: {
    fontSize: 14,
    minWidth: 700,
  },
  addTableHead: {
    fontSize: 12,
    lineHeight: 1.5,
    padding: 10,
  },
  scroll: {
    overflowX: "auto",
  },
  setPadding: {
    padding: 8,
  },
  tablehead: {
    // background
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
}));

const AcceptTransfer = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);

  const appContext = useContext(AppContext);

  const { selectedDepartment } = appContext;

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);
  useEffect(() => {
    getPendingStock();
  }, [localStorage.getItem("SelectedDepartment")]);
  const department = localStorage.getItem("SelectedDepartment");
  console.log(department);

  function getPendingStock() {
    setLoading(true);
    Axios.get(
      Config.getCommonUrl() +
        `api/productionStock/transfer?department_id=${department}`
    )
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

        handleError(error, dispatch, {
          api: `api/productionStock/transfer?department_id=${department}`,
        });
      });
  }

  function handleAcceptTransfer(row, flag) {
    if (flag === 1) {
      const body = {
        stock_transfer_ids: row.stock_transfer_id,
        to_department_id: selectedDepartment.value.split("-")[1],
        stock_code_weight: [
          {
            stock_name_code_id: row.stock_name_code_id,
            weight: row.net_weight,
            from_department_id: row.from_department_id,
            ...(row.item_id === 5 && {
              pcs: row.pcs,
            }),
          },
        ],
      };

      Axios.post(Config.getCommonUrl() + `api/stock/accept`, body)
        .then(function (response) {
          if (response.data.success === true) {
            console.log(response);
            getPendingStock();
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
            api: `api/stock/accept`,
            body: body,
          });
        });
    } else if (flag === 2) {
      let tempArr = [];
      apiData.map((item) => {
        tempArr.push(...item.stock_transfer_id);
        return null;
      });
      const body = {
        stock_transfer_ids: tempArr,
        to_department_id: selectedDepartment.value.split("-")[1],
        stock_code_weight: apiData.map((item) => {
          return {
            stock_name_code_id: item.stock_name_code_id,
            weight: item.net_weight,
            from_department_id: item.from_department_id,
            ...(item.item_id === 5 && {
              pcs: item.pcs,
            }),
          };
        }),
      };

      Axios.post(Config.getCommonUrl() + `api/stock/accept`, body)
        .then(function (response) {
          if (response.data.success === true) {
            console.log(response);
            getPendingStock();
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
            api: `api/stock/accept`,
            body: body,
          });
        });
    }
  }
  function handleRejectTransfer(row) {
    const body = {
      stock_transfer_ids: row.stock_transfer_id,
      to_department_id: selectedDepartment.value.split("-")[1],
      stock_code_weight: [
        {
          stock_name_code_id: row.stock_name_code_id,
          weight: row.net_weight,
          from_department_id: row.from_department_id,
          ...(row.item_id === 5 && {
            pcs: row.pcs,
          }),
        },
      ],
    };
    Axios.post(Config.getCommonUrl() + `api/stock/reject`, body)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          getPendingStock();
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
  return (
    <>
      {/* <Modal open={openPopup}> */}
      <Box className={classes.model} style={{ overflowY: "auto" }}>
        <Grid container className={classes.modalContainer}>
          <Grid item xs={12} sm={4} md={3} key="1">
            <FuseAnimate delay={300}>
              <Typography className="pl-28 pb-16 pt-16 text-18 font-700">
                Accept Transfer
              </Typography>
            </FuseAnimate>
            {/* <BreadcrumbsHelper /> */}
          </Grid>
          <Grid
            item
            sm={8}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 16,
              columnGap: 10,
            }}
          >
            <div className="btn-back mt-2">
              {" "}
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
            <Button
              id="btn-all-production"
              variant="contained"
              style={{
                color: "#FFFFFF",
                // marginTop: 15,
                display: "block",
              }}
              onClick={(e) => handleAcceptTransfer(null, 2)}
            >
              Accept All
            </Button>
          </Grid>
        </Grid>
        {loading && <Loader />}
        <div className="main-div-alll ">
          <Box style={{ paddingInline: 16 }}>
            <Box>
              <TableContainer
                className={classes.scroll}
                style={{ marginBottom: 16 }}
              >
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
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
                    {apiData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          colSpan={8}
                          align="center"
                        >
                          <div style={{ textAlign: "center" }}>
                            No Data Found
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      apiData.map((row, index) => {
                        console.log(row);
                        return (
                          <TableRow key={index}>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.stockType}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row.stock_name_code}
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
                            <TableCell className={classes.tableRowPad}>
                              <Button
                                variant="contained"
                                className={classes.button}
                                style={{
                                  backgroundColor: "#11980c",
                                  border: "none",
                                  color: "white",
                                  margin: 2,
                                  textTransform: "capitalize",
                                }}
                                size="small"
                                onClick={(e) => handleAcceptTransfer(row, 1)}
                              >
                                Accept
                              </Button>

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
                                onClick={(e) => handleRejectTransfer(row)}
                              >
                                Reject
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </div>
      </Box>
      {/* </Modal> */}
    </>
  );
};

export default AcceptTransfer;

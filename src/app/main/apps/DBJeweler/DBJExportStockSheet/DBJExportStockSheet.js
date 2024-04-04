import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { FuseAnimate } from "@fuse";
import {
  Box,
  Button,
  Grid,
  Icon,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as Actions from "app/store/actions";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Axios from "axios";
import Icones from "assets/fornt-icons/Mainicons";
import * as XLSX from "xlsx";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    minWidth: 1000,
    tableLayout: "fixed",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  tableRowPad: {
    padding: 7,
  },
  //   errorMessage: {
  //     color: "#f44336",
  //     position: "absolute",
  //     bottom: "-3px",
  //     fontSize: "11px",
  //     lineHeight: "7px",
  //     marginTop: 3,
  //     fontFamily: 'Muli,Roboto,"Helvetica",Arial,sans-serif'
  //   },
  modalStyle: {
    background: "#FFFFFF",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#000000",
    position: "absolute",
  },
}));

const DBJExportStockSheet = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [apiData, setApiData] = useState([]);
  console.log(apiData);
  const [scaneCode, setScaneCode] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    NavbarSetting("DBJewellers-Retailer", dispatch);
  }, []);

  //   const handleStockeCodeFileUpload = (e) => {
  //     e.preventDefault();
  //     if (stockCodeFile === null) {
  //       setStockCodeErr("Please choose file");
  //     } else {
  //       const formData = new FormData();
  //       for (let i = 0; i < stockCodeFile.length; i++) {
  //         formData.append("file", stockCodeFile[i]);
  //         // formData.append("department_id", selectedDepartmentData.value);
  //       }
  //       callStockCodeFileUploadApi(formData);
  //     }
  //   };
  useEffect(() => {
    if (scaneCode) {
      getScaneLotData();
    }
  }, [scaneCode]);

  function getScaneLotData() {
    var api = `retailerProduct/api/dbjewellres/search/printed/barcode?name=${scaneCode}`;
    Axios.get(Config.getCommonUrl() + api)
      .then((response) => {
        if (response.data.success) {
          console.log(response);
          const res = response.data.data;
          setScaneCode("");
          if (apiData.length === 0) {
            setApiData(res);
          } else {
            setApiData((prevApiData) => {
              const filteredRes = res.filter((newItem) => {
                return !prevApiData.some(
                  (existingItem) =>
                    existingItem.json_data.NAME === newItem.json_data.NAME
                );
              });
              return [...prevApiData, ...filteredRes];
            });
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
        // setLoading(false);
      })
      .catch((error) => {
        // setLoading(false);
        console.log(error);
        handleError(error, dispatch, { api: api });
      });
  }
  function deleteProduct(index) {
    apiData.splice(index, 1);
    setApiData([...apiData]);
  }
  const exportToExcel = (type, fn, dl) => {
    console.log(type, fn, dl);
    if (apiData.length > 0) {
      const wb = XLSX.utils.book_new();
      const tbl1 = document.getElementById("tbl_exporttable_to_xls");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(wb, fn || `Stock_Sheet_Report.${type || "xlsx"}`);
    } else {
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data" }));
    }
  };
  const handleBoxClick = () => {
    inputRef.current.focus();
  };

  return (
    <>
      {/* {!modalOpen && loading && <Loader />} */}
      <div className={clsx(classes.root, "w-full ")}>
        <FuseAnimate animation="transition.slideUpIn" delay={200}>
          {/* <div className="flex flex-col md:flex-row container"> */}
          <Box>
            <Grid
              container
              alignItems="center"
              style={{
                paddingInline: "28px",
                marginTop: "30px",
                marginBottom: "16px",
                justifyContent: "space-between",
              }}
            >
              <Grid item xs={6} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Export Stock Sheet
                  </Typography>
                </FuseAnimate>
              </Grid>
              <Grid
                item
                xs={6}
                style={{ textAlign: "right" }}
                // key="2"
              >
                {/* <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  //   onClick={() => addNewHandler()}
                >
                  Add New
                </Button> */}
              </Grid>
            </Grid>
            <div className="main-div-alll">
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                style={{ paddingBlock: 7 }}
                spacing={2}
              >
                <Grid item>
                  <TextField
                    name="scanebarcode"
                    placeholder="Scane Barcode"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setScaneCode(e.target.value)}
                    value={scaneCode}
                    inputRef={inputRef}
                  />
                </Grid>
                <Grid item style={{ textAlign: "right" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    // className="mt-16"
                    style={{
                      backgroundColor: "#4caf50",
                      border: "none",
                      color: "white",
                    }}
                    onClick={() => {
                      exportToExcel("csv");
                    }}
                  >
                    Export CSV
                  </Button>
                </Grid>
              </Grid>
              <Paper style={{ marginTop: "16px", overflowY: "auto" }}>
                {apiData.length === 0 ? (
                  <>
                    <Box
                      style={{
                        height: 400,
                        background: "#e4e4e4",
                        fontSize: 42,
                        fontWeight: 800,
                        color: "#adadad",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        handleBoxClick();
                      }}
                    >
                      Scane Barcode or QRCode
                    </Box>
                  </>
                ) : (
                  <>
                    <Table
                      style={{
                        tableLayout: "auto",
                        //   width: "max-content"
                      }}
                    >
                      <TableBody>
                        {apiData.map((item, index) => {
                          return (
                            <React.Fragment key={index}>
                              {index + 1 === 1 && (
                                <TableRow style={{ background: "#EBEEFB " }}>
                                  <TableCell
                                    className={clsx(classes.tableRowPad)}
                                    width={50}
                                  ></TableCell>
                                  {Object.entries(item.json_data).map(
                                    ([key, value], innerIndex) => (
                                      <React.Fragment key={innerIndex}>
                                        {key !== "index" && key !== "Qr" && (
                                          <TableCell
                                            className={clsx(
                                              classes.tableRowPad,
                                              "textLeft"
                                            )}
                                          >
                                            <b>{key}</b>
                                          </TableCell>
                                        )}
                                      </React.Fragment>
                                    )
                                  )}
                                </TableRow>
                              )}
                              <TableRow key={index}>
                                <TableCell className={classes.tableRowPad}>
                                  <Icon
                                    className="delete-icone"
                                    style={{ verticalAlign: "middle" }}
                                    onClick={() => deleteProduct(index)}
                                  >
                                    <img src={Icones.delete_red} alt="delete" />
                                  </Icon>
                                </TableCell>
                                {Object.entries(item.json_data).map(
                                  ([key, value], innerIndex) => (
                                    <React.Fragment key={innerIndex}>
                                      {key !== "index" && key !== "Qr" && (
                                        <TableCell
                                          className={clsx(
                                            classes.tableRowPad,
                                            "textLeft"
                                          )}
                                        >
                                          {value ? value : "-"}
                                        </TableCell>
                                      )}
                                    </React.Fragment>
                                  )
                                )}
                              </TableRow>
                            </React.Fragment>
                          );
                        })}
                      </TableBody>
                    </Table>
                    <Table
                      style={{
                        tableLayout: "auto",
                        display: "none",
                      }}
                      id="tbl_exporttable_to_xls"
                    >
                      <TableBody>
                        {apiData.map((item, index) => {
                          return (
                            <React.Fragment key={index}>
                              {index + 1 === 1 && (
                                <TableRow style={{ background: "#EBEEFB " }}>
                                  {Object.entries(item.json_data).map(
                                    ([key, value], innerIndex) => (
                                      <React.Fragment key={innerIndex}>
                                        {key !== "index" && key !== "Qr" && (
                                          <TableCell
                                            className={clsx(
                                              classes.tableRowPad,
                                              "textLeft"
                                            )}
                                          >
                                            <b>{key}</b>
                                          </TableCell>
                                        )}
                                      </React.Fragment>
                                    )
                                  )}
                                </TableRow>
                              )}
                              <TableRow key={index}>
                                {Object.entries(item.json_data).map(
                                  ([key, value], innerIndex) => (
                                    <React.Fragment key={innerIndex}>
                                      {key !== "index" && key !== "Qr" && (
                                        <TableCell
                                          className={clsx(
                                            classes.tableRowPad,
                                            "textLeft"
                                          )}
                                        >
                                          {value ? value : "-"}
                                        </TableCell>
                                      )}
                                    </React.Fragment>
                                  )
                                )}
                              </TableRow>
                            </React.Fragment>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </>
                )}
              </Paper>
            </div>
          </Box>
          {/* </div> */}
        </FuseAnimate>
      </div>
    </>
  );
};

export default DBJExportStockSheet;

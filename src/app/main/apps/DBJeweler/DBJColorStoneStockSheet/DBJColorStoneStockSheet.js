import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import History from "@history";
import { FuseAnimate } from "@fuse";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Icon,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";
import * as Actions from "app/store/actions";
import Loader from "app/main/Loader/Loader";
import InfiniteScroll from "react-infinite-scroll-component";

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

const DBJColorStoneStockSheet = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  //   const [searchData, setSearchData] = useState("");
  const [apiData, setApiData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedBarcode, setSelectedBarcode] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);

  console.log(apiData);
  useEffect(() => {
    NavbarSetting("DBJewellers-Retailer", dispatch);
  }, []);

  useEffect(() => {
    getTagedList();
  }, [page]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  const fetchData = () => {
    console.log("fetch", page);
    setPage(page + 1);
    // setSearchData((prevState) => ({
    //   ...prevState,
    //   pageNumber : page + 1,
    // }));
  };
  function getTagedList() {
    setLoading(true);
    Axios.get(
      Config.getCommonUrl() +
        `retailerProduct/api/tagPrintPendingList/tag/printed/list/colorstone?page=${page}`
    )
      .then((res) => {
        const response = res.data.data;
        console.log(res.data.data);
        // setApiData(res.data.data);
        const columns = Object.keys(res.data.data[0].json_data);
        setColumns(columns);
        if (page === 1) {
          setApiData(response);
        } else {
          setApiData([...apiData, ...response]);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `retailerProduct/api/tagPrintPendingList/tag/printed/list/colorstone?page=${page}`,
        });
      });
  }

  const handleSelectedBarcode = (obj) => {
    if (selectedBarcode.includes(obj.id)) {
      const updatedArray = selectedBarcode.filter((item) => item !== obj.id);
      setSelectedBarcode(updatedArray);
    } else {
      const updateBarcodeData = [...selectedBarcode, obj.id];
      setSelectedBarcode(updateBarcodeData);
    }
  };
  const handleSelectAll = () => {
    if (selectedBarcode.length === apiData.length) {
      // If all rows are selected, unselect all
      setSelectedBarcode([]);
    } else {
      // Otherwise, select all rows
      const allRowNames = apiData.map((data) => data.id);
      setSelectedBarcode(allRowNames);
    }
  };

  function handleCloseAlert() {
    setOpenAlert(false);
  }
  function handleOpenAlert() {
    setOpenAlert(true);
  }
  const handleCallDeleteApi = () => {
    setLoading(true);
    console.log(selectedBarcode);
    const body = {
      deleteTagArray: selectedBarcode,
    };
    console.log(body);
    var api = `retailerProduct/api/tagPrintPendingList/tag/delete?is_colorstone=${1}`;
    Axios.post(Config.getCommonUrl() + api, body)
      .then((response) => {
        if (response.data.success) {
          setSelectedBarcode([]);
          setOpenAlert(false);
          setApiData([]);
          getTagedList();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        handleError(error, dispatch, { api: api, body: body });
      });
  };

  return (
    <>
      {/* {!modalOpen && loading && <Loader />} */}
      <div className={clsx(classes.root, "w-full ")}>
        <FuseAnimate animation="transition.slideUpIn" delay={200}>
          {/* <div className="flex flex-col md:flex-row container"> */}
          <Box>
            {loading && <Loader />}
            <Grid
              container
              alignItems="center"
              style={{
                paddingInline: "28px",
                paddingTop: "30px",
                paddingBottom: "16px",
                justifyContent: "space-between",
              }}
            >
              <Grid item xs={6} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Color Stone Stock Sheet
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
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      backgroundColor: "#F15656",
                      border: "none",
                      color: "white",
                    }}
                    onClick={() => {
                      if (selectedBarcode.length === 0) {
                        dispatch(
                          Actions.showMessage({
                            message: "Please Select Barcode",
                            variant: "error",
                          })
                        );
                      } else {
                        handleOpenAlert();
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>
              <Paper
                style={{
                  marginTop: "16px",
                  overflow: "auto",
                  height: "calc(100vh - 260px)",
                }}
              >
                {apiData.length === 0 ? (
                  <Box className={classes.tableRowPad}>No Data Found</Box>
                ) : (
                  <>
                    <InfiniteScroll
                      dataLength={apiData.length}
                      next={fetchData}
                      hasMore={apiData.length !== totalRecords}
                      loader={loading && <Loader />}
                      scrollableTarget="ScrollTable"
                    >
                      <Table
                        style={{ tableLayout: "auto", width: "max-content" }}
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              <Checkbox
                                style={{ color: "#415BD4", padding: 0 }}
                                color="primary"
                                checked={
                                  selectedBarcode.length === apiData.length
                                }
                                onChange={handleSelectAll}
                              />
                            </TableCell>
                            {columns.map((column, index) => (
                              <TableCell
                                key={index}
                                className={clsx(
                                  classes.tableRowPad,
                                  "textLeft"
                                )}
                              >
                                {column}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {apiData.map((item, index) => {
                            // const parsedJsonData = JSON.parse(item.json_data);
                            return (
                              <TableRow key={index}>
                                <TableCell className={classes.tableRowPad}>
                                  <Checkbox
                                    style={{ color: "#415BD4", padding: 0 }}
                                    color="primary"
                                    checked={selectedBarcode.includes(item.id)}
                                    onChange={() => handleSelectedBarcode(item)}
                                  />
                                </TableCell>
                                {columns.map((column, i) => {
                                  return (
                                    <TableCell
                                      key={`${column}+${i}`}
                                      className={clsx(
                                        classes.tableRowPad,
                                        "textLeft"
                                      )}
                                    >
                                      {item.json_data[column]
                                        ? item.json_data[column]
                                        : "-"}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </InfiniteScroll>
                  </>
                )}
              </Paper>
            </div>
          </Box>
          {/* </div> */}
        </FuseAnimate>
        <Dialog
          open={openAlert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            className="alertbox popup-delete"
          >
            {"Alert!!!"}
            <IconButton
              style={{
                position: "absolute",
                marginTop: "-5px",
                right: "15px",
              }}
              onClick={handleCloseAlert}
            >
              <img
                src={Icones.cross}
                className="delete-dialog-box-image-size"
                alt=""
              />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to 'Delete' all selected data?
            </DialogContentText>
          </DialogContent>
          <DialogActions className="alertbox">
            <Button
              onClick={handleCloseAlert}
              className="delete-dialog-box-cancle-button"
            >
              No
            </Button>
            <Button
              className="delete-dialog-box-delete-button"
              autoFocus
              onClick={handleCallDeleteApi}
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default DBJColorStoneStockSheet;

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { FuseAnimate } from "@fuse";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Icon,
  IconButton,
  Modal,
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
import { useReactToPrint } from "react-to-print";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Axios from "axios";
import { TaggingPrint } from "../TaggingPrintComponent/TaggingPrint";
import taggingDataFile from "app/main/SampleFiles/DBJTagging/tagging_sample_file.csv";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import DoneAllIcon from "@material-ui/icons/DoneAll";

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

const DBJeweler = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [apiData, setApiData] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [stockCodeFile, setStockCodeFile] = useState(null);
  const [stockCodeErr, setStockCodeErr] = useState("");
  const [selectedBarcode, setSelectedBarcode] = useState([]);
  const [selectedArray, setSelectedArray] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(["NAME", "Qr"]);
  const [filteredSelectedArray, setFilteredSelectedArray] = useState([]);
  const [exportTagedData, setExportTagedData] = useState([]);
  console.log(exportTagedData);

  useEffect(() => {
    NavbarSetting("DBJewellers-Retailer", dispatch);
  }, []);

  const [printObj, setPrintObj] = useState([]);

  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
    //eslint-disable-next-line
  }, [componentRef.current]);

  function getDateAndTime() {
    return (
      new Date().getDate() +
      "_" +
      (new Date().getMonth() + 1) +
      "_" +
      new Date().getFullYear() +
      "_" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes()
    );
  }

  const handleBeforePrint = React.useCallback(() => {}, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        // setLoading(false);
        resolve();
      }, 10);
    });
  }, []); //setText

  const handleAfterPrint = () => {
    setModalOpen(false);
    setSelectedArray([]);
    setSelectedBarcode([]);
  };

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "QRCode" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });
  function checkforPrint() {
    handlePrint();
  }

  function handleClose() {
    setModalOpen(false);
  }
  function handleModalOpen() {
    setModalOpen(true);
  }
  function handleInputstockecodeChangea(e) {
    setStockCodeFile(e.target.files);
    setStockCodeErr("");
  }
  const handleStockeCodeFileUpload = (e) => {
    e.preventDefault();
    if (stockCodeFile === null) {
      setStockCodeErr("Please choose file");
    } else {
      const formData = new FormData();
      for (let i = 0; i < stockCodeFile.length; i++) {
        formData.append("file", stockCodeFile[i]);
        // formData.append("department_id", selectedDepartmentData.value);
      }
      callStockCodeFileUploadApi(formData);
    }
  };

  useEffect(() => {
    handleFilterData();
  }, [selectedArray, selectedColumn]);

  function callStockCodeFileUploadApi(formData) {
    // setLoading(true);
    const body = formData;
    var api = "retailerProduct/api/tagPrintPendingList/upload/csv";
    Axios.post(Config.getCommonUrl() + api, body)
      .then((response) => {
        if (response.data.success) {
          setStockCodeFile("");
          handleClose();
          dispatch(
            Actions.showMessage({
              message: "File Uploaded Successfully",
              variant: "success",
            })
          );
          setApiData(response.data.data);
          setPrintObj(response.data.data);
        } else {
          let downloadUrl = response.data.url;
          window.open(downloadUrl);

          setStockCodeErr("");
          handleClose();
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
        // setLoading(false);
      })
      .catch((error) => {
        // setLoading(false);
        console.log(error);
        handleError(error, dispatch, { api: api, body: body });
      });
  }

  function callExportTaggedDataApi() {
    // setLoading(true);
    const body = {
      tagArray: exportTagedData,
    };
    var api = "retailerProduct/api/tagPrintPendingList/diamond/tag/save";
    Axios.post(Config.getCommonUrl() + api, body)
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
        // setLoading(false);
      })
      .catch((error) => {
        // setLoading(false);
        console.log(error);
        handleError(error, dispatch, { api: api, body: body });
      });
  }

  const handleSelectAll = () => {
    if (selectedBarcode.length === apiData.length) {
      // If all rows are selected, unselect all
      setSelectedBarcode([]);
      setSelectedArray([]);
      setExportTagedData([]);
    } else {
      // Otherwise, select all rows
      const allRowNames = apiData.map((data) => data.NAME);
      setSelectedBarcode(allRowNames);
      setSelectedArray(apiData);
      setExportTagedData(apiData);
    }
  };
  const handleSelectedBarcode = (obj) => {
    if (selectedBarcode.includes(obj.NAME)) {
      const updatedArray = selectedBarcode.filter((item) => item !== obj.NAME);
      const updatedObj = selectedArray.filter((item) => item.NAME !== obj.NAME);
      const updateExportTagedData = exportTagedData.filter(
        (item) => item.NAME !== obj.NAME
      );
      setSelectedBarcode(updatedArray);
      setSelectedArray(updatedObj);
      setExportTagedData(updateExportTagedData);
    } else {
      const updateBarcodeData = [...selectedBarcode, obj.NAME];
      const updateBarcodeObj = [...selectedArray, obj];
      const updateExportTagedData = [...exportTagedData, obj];

      setSelectedBarcode(updateBarcodeData);
      setSelectedArray(updateBarcodeObj);
      setExportTagedData(updateExportTagedData);
    }
  };
  const handleSelectedColumn = (name) => {
    if (name === "NAME") {
      // 'NAME' is always selected, do nothing
      return;
    }
    if (selectedColumn.includes(name)) {
      const updateColumnName = selectedColumn.filter((item) => item !== name);
      console.log(updateColumnName);
      setSelectedColumn(updateColumnName);
    } else {
      if (selectedColumn.length > 8) {
        dispatch(
          Actions.showMessage({
            message: "You can select only 9 Barcode",
            variant: "error",
          })
        );
      } else {
        const updateColumnName = [...selectedColumn, name];
        setSelectedColumn(updateColumnName);
      }
    }
  };
  function handleFilterData() {
    const filteredData = selectedArray.map((item) => {
      const filteredItem = {};
      selectedColumn.forEach((key) => {
        if (item.hasOwnProperty(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    setFilteredSelectedArray(filteredData);
  }

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
                    Taggin Sheet For Real Dimond
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
                justifyContent="flex-end"
                alignItems="center"
                style={{ paddingBlock: 7 }}
                spacing={2}
              >
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    className="btn-print-save"
                    aria-label="Register"
                    // onClick={checkforPrint}
                    onClick={(e) => {
                      if (selectedArray.length === 0) {
                        dispatch(
                          Actions.showMessage({
                            message: "Please Select Barcode",
                            variant: "error",
                          })
                        );
                      } else {
                        checkforPrint();
                        callExportTaggedDataApi();
                      }
                    }}
                  >
                    Print
                  </Button>
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
                      handleModalOpen();
                    }}
                  >
                    Excel Upload
                  </Button>
                </Grid>
              </Grid>
              <Paper style={{ marginTop: "16px", overflowY: "auto" }}>
                {/* <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        className={clsx(classes.tableRowPad)}
                        width={50}
                      >
                        {apiData.length !== 0 && (
                          <Checkbox
                            style={{ color: "#415BD4", padding: 0 }}
                            color="primary"
                            checked={selectedBarcode.length === apiData.length}
                            onChange={handleSelectAll}
                          />
                        )}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Sr No.
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        Gross Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        18WT
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        -6RDCT
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        +6RDCT
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        TPCT
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        WQWT
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        MKG
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {console.log(apiData)}
                    {apiData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className={classes.tableRowPad}
                          style={{ textAlign: "center" }}
                        >
                          No Data Found
                        </TableCell>
                      </TableRow>
                    ) : (
                      apiData.map((data, index) => {
                        console.log(data);
                        return (
                          <TableRow key={index}>
                            <TableCell className={classes.tableRowPad}>
                              <Checkbox
                                style={{ color: "#415BD4", padding: 0 }}
                                color="primary"
                                checked={selectedBarcode.includes(data.name)}
                                onChange={() => handleSelectedBarcode(data)}
                              />
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {index + 1}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {data.name}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="right"
                            >
                              {data.grossWT ? data.grossWT : "-"}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="right"
                            >
                              {data.Weight18 ? data.Weight18 : "-"}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="right"
                            >
                              {data.M6RDCT ? data.M6RDCT : "-"}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="right"
                            >
                              {data.P6RDCT ? data.P6RDCT : "-"}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="right"
                            >
                              {data.TPCT ? data.TPCT : "-"}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ paddingRight: 28 }}
                              align="right"
                            >
                              {data.MQWT ? data.MQWT : "-"}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ paddingRight: 28 }}
                              align="right"
                            >
                              {data.MKG ? data.MKG : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table> */}
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
                        handleModalOpen();
                      }}
                    >
                      Upload CSV File
                    </Box>
                  </>
                ) : (
                  <Table style={{ tableLayout: "auto", width: "max-content" }}>
                    <TableBody>
                      {apiData.map((item, index) => {
                        return (
                          <React.Fragment key={index}>
                            {index + 1 === 1 && (
                              <TableRow
                                // key={index}
                                style={{ background: "#EBEEFB " }}
                              >
                                <TableCell
                                  className={clsx(classes.tableRowPad)}
                                  width={50}
                                >
                                  {apiData.length !== 0 && (
                                    <Checkbox
                                      style={{ color: "#415BD4", padding: 0 }}
                                      color="primary"
                                      checked={
                                        selectedBarcode.length ===
                                        apiData.length
                                      }
                                      onChange={handleSelectAll}
                                    />
                                  )}
                                </TableCell>
                                {Object.entries(item).map(
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

                                          <Checkbox
                                            style={{
                                              color: "green",
                                              padding: 0,
                                              marginInline: 5,
                                            }}
                                            // color="s"
                                            icon={<CheckBoxOutlineBlankIcon />}
                                            checkedIcon={
                                              <DoneAllIcon
                                                style={{ color: "green" }}
                                              />
                                            }
                                            disabled={
                                              key === "NAME" || key === "Qr"
                                            }
                                            checked={
                                              selectedColumn.includes(key) ||
                                              key === "NAME" ||
                                              key === "Qr"
                                            }
                                            onChange={() =>
                                              handleSelectedColumn(key)
                                            }
                                          />
                                        </TableCell>
                                      )}
                                      {/* <TableCell>{value}</TableCell> */}
                                    </React.Fragment>
                                  )
                                )}
                              </TableRow>
                            )}
                            <TableRow key={index}>
                              <TableCell className={classes.tableRowPad}>
                                <Checkbox
                                  style={{ color: "#415BD4", padding: 0 }}
                                  color="primary"
                                  checked={selectedBarcode.includes(item.NAME)}
                                  onChange={() => handleSelectedBarcode(item)}
                                />
                              </TableCell>
                              {Object.entries(item).map(
                                ([key, value], innerIndex) => (
                                  <React.Fragment key={innerIndex}>
                                    {/* <TableCell>{key}</TableCell> */}
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
                )}
              </Paper>
            </div>
          </Box>
          {/* </div> */}
        </FuseAnimate>
        <Modal open={modalOpen} onClose={handleClose}>
          <Box className={classes.modalStyle}>
            <h5
              className="p-5"
              style={{
                textAlign: "center",
                backgroundColor: "#415BD4",
                color: "white",
                position: "relative",
              }}
            >
              Upload Stock File
              <IconButton
                style={{ position: "absolute", top: "0", right: "0" }}
                onClick={handleClose}
              >
                <Icon style={{ color: "white" }}>close</Icon>
              </IconButton>
            </h5>

            <div className="p-5 pl-16 pr-16">
              <p>Upload CSV Excel File</p>
              <TextField
                id="fileinputstock"
                className="mb-16"
                // label="Upload CSV Excel File"
                name="stockcode"
                type="file"
                error={stockCodeErr.length > 0 ? true : false}
                helperText={stockCodeErr}
                onChange={(e) => handleInputstockecodeChangea(e)}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  accept: ".csv",
                }}
              />
              <Grid
                item
                lg={6}
                md={6}
                sm={6}
                xs={12}
                style={{ padding: 2 }}
                className=""
              >
                <a href={taggingDataFile} download="tagging_sample_file.csv">
                  Download Sample{" "}
                </a>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                className="w-full mx-auto mt-16"
                style={{
                  backgroundColor: "#4caf50",
                  border: "none",
                  color: "white",
                }}
                onClick={(e) => handleStockeCodeFileUpload(e)}
              >
                Upload
              </Button>
            </div>
          </Box>
        </Modal>
        {/* <div style={{ display: "none" }}> */}
        <TaggingPrint
          ref={componentRef}
          printObj={filteredSelectedArray}
          flag={1}
          allData={apiData}
        />
        {/* </div> */}
      </div>
    </>
  );
};

export default DBJeweler;

import { FuseAnimate } from "@fuse";
import History from "@history";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { Add, Delete, KeyboardBackspace, Search } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
// import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import React, { useEffect, useState } from "react";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Select, { createFilter } from "react-select";
import { useReactToPrint } from "react-to-print";
import { ReceiveBalanceStockPrint } from "./ReceiveBalanceStockPrint/ReceiveBalanceStockPrint";
import Icones from "assets/fornt-icons/Mainicons";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import { HtmlPrintAddApi } from "app/main/apps/Production/ProductionMain/Helper/HtmlPrintAdd";
import ReactDOM from 'react-dom';

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
    // minWidth: 700,
  },
  addTableHead: {
    fontSize: 12,
    lineHeight: 1.5,
    padding: 10,
  },
  scroll: {
    overflowX: "initial",
  },
  setPadding: {
    padding: 8,
  },
  tablePad: {
    padding: 0,
  },
  tableRowPad: {
    padding: 7,
  },
  inputBoxTEST: {
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  errorMessage: {
    color: "#f44336",
    position: "absolute",
    bottom: "-7px",
    fontSize: "9px",
    lineHeight: "8px",
  },
}));

const ReceiveBalanceStock = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [stockCodeList, setStockCodeList] = useState([]);
  const [workStationList, setWorkStationList] = useState([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState([]);
  const [printObj, setPrintObj] = useState("");
  const [addStockData, setAddStockData] = useState([
    {
      stockCode: "",
      purity: "",
      pcs: "",
      weight: "",
      errors: {
        stockCode: "",
        purity: "",
        pcs: "",
        weight: "",
      },
    },
  ]);
  const [workstationStockData, setWorkstationStockData] = useState([]);
  const [fieldData, setFieldData] = useState({
    workstation: [],
    process: [],
    lotremark: "",
    grossweight: "",
    status: "",
    remark: "",
    errors: {
      workstation: "",
      // process: "",
      // lotremark: "",
      // grossweight: "",
      // status: "",
      // remark: "",
    },
  });

  useEffect(() => {
    NavbarSetting("Production", dispatch);
  }, []);

  useEffect(() => {
    clearData();
    getStockCode();
  }, [window.localStorage.getItem("SelectedDepartment")]);

  function clearData() {
    setFieldData({
      workstation: [],
      process: [],
      lotremark: "",
      grossweight: "",
      status: "",
      remark: "",
      errors: {
        workstation: "",
        // process: "",
        // lotremark: "",
        // grossweight: "",
        // status: "",
        // remark: "",
      },
    });
    setAddStockData([
      {
        stockCode: "",
        purity: "",
        pcs: "",
        weight: "",
        errors: {
          stockCode: "",
          purity: "",
          pcs: "",
          weight: "",
        },
      },
    ]);
    setSelectedRowIndex([]);
    setWorkstationStockData([]);
  }
  console.log(fieldData);
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
        // setText("New, Updated Text!");
        resolve();
      }, 10);
    });
  }, []); //setText

  useEffect(() => {
    if(printObj){
      handlePrint();
    }
  }, [printObj]);

  const handleAfterPrint = () => {
    const componentInstance = <ReceiveBalanceStockPrint ref={componentRef} printObj={printObj} />;
    const containerDiv = document.createElement('div');
    ReactDOM.render(componentInstance, containerDiv);
    const printedContent = containerDiv.innerHTML;
    console.log("Printed HTML content:", printedContent);
    HtmlPrintAddApi(dispatch, printedContent, [printObj]);
    ReactDOM.unmountComponentAtNode(containerDiv);
    containerDiv.remove();
    History.goBack()
  };

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Receive_Balance_Stock_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });

  useEffect(() => {
    getStockCode();
    getWorkStationList();
    // getProcessList();
  }, []);
  useEffect(() => {
    if (fieldData.workstation?.value) {
      workstationStockBalance();
    }
  }, [fieldData.workstation?.value]);
  function getStockCode() {
    Axios.get(Config.getCommonUrl() + `api/production/receive/BalanceStockCode`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockCodeList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/production/receive/BalanceStockCode`,
        });
      });
  }
  function getWorkStationList() {
    Axios.get(Config.getCommonUrl() + "api/workstation")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setWorkStationList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/workstation",
        });
      });
  }
  function workstationStockBalance() {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/workStation/stockList?workstation_id=${
          fieldData.workstation?.value
        }&department_id=${parseFloat(
          window.localStorage.getItem("SelectedDepartment")
        )}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setWorkstationStockData(response.data.data);
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
          api: `api/production/workStation/stockList?workstation_id=${
            fieldData.workstation?.value
          }&department_id=${parseFloat(
            window.localStorage.getItem("SelectedDepartment")
          )}`,
        });
      });
  }
  let handleChange = (e, i) => {
    const { name, value } = e.target;
    if (
      (name === "weight" || name === "purity") &&
      !/^\d*\.?\d*$/.test(value)
    ) {
      return;
    }
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData[i][e.target.name] = e.target.value;
    addStockUpdatedData[i].errors = {
      ...addStockUpdatedData[i].errors,
      [name]: "",
    };
    setAddStockData(addStockUpdatedData);
  };
  function deleteLotHandler(index) {
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData.splice(index, 1);
    setAddStockData(addStockUpdatedData);
  }

  function handleStockCodeSelect(option, i) {
    console.log(option);
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData[i].stockCode = {
      value: option.value,
      label: option.label,
    };
    addStockUpdatedData[i].purity = option.data.purity;
    setAddStockData(addStockUpdatedData);

    if (addStockData.length - i === 1) {
      setAddStockData([
        ...addStockData,
        {
          stockCode: "",
          purity: "",
          pcs: "",
          weight: "",
          errors: {
            stockCode: "",
            purity: "",
            pcs: "",
            weight: "",
          },
        },
      ]);
    }
  }
  function handleWorkstationSelect(option, i) {
    console.log(option);
    const updatedWorkStation = {
      value: option.value,
      label: option.label,
    };
    setFieldData((prevFieldData) => ({
      ...prevFieldData,
      workstation: updatedWorkStation,
      errors: {
        ...prevFieldData.errors,
        workstation: "",
      },
    }));
  }

  console.log(addStockData);
  function handleSubmitData(isPrint) {
    console.log(addStockData);
    const updatedData = addStockData
      .filter((data) => data.stockCode !== "")
      .map((item) => {
        return {
          stock_name_code_id: item.stockCode.value,
          weight: item.weight,
          pcs: item.pcs,
        };
      });
    console.log(updatedData);
    const body = {
      department_id: parseFloat(
        window.localStorage.getItem("SelectedDepartment")
      ),
      stock_code_id: selectedRowIndex?.stock_name_code_id,
      work_station_id: fieldData.workstation.value,
      stockArray: updatedData,
    };
    Axios.post(
      Config.getCommonUrl() + `api/production/recieve/balanceStock`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          if (isPrint === 1) {
            handleReceivePrint(
              response.data.production_receive_balance_stock_id,
              response.data.activityNumber
            );
          } else {
            clearData();
          }
          console.log(response);
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
          api: `api/production/recieve/balanceStock`,
          body: body,
        });
      });
  }

  function handleReceivePrint(stockId,actNumber) {
    const body = {
      production_receive_balance_stock_id: stockId,
      activityNumber : actNumber
    };
    Axios.post(
      Config.getCommonUrl() +
        `api/productionPrintVoucher/receiveBalanceStock/print`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          console.log(response);
          setPrintObj(response.data.data);
          clearData();
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
          api: `api/productionPrintVoucher/receiveBalanceStock/print`,
          body: body,
        });
      });
  }

  const validateWorkStationData = () => {
    let isValid = true;
    const updatedErrors = {
      workstation: "",
      process: "",
      lotremark: "",
      grossweight: "",
      status: "",
      remark: "",
    };

    if (!fieldData.workstation || fieldData.workstation.length === 0) {
      updatedErrors.workstation = "Select a Worker / Work Station";
      isValid = false;
    }
    // if (!fieldData.process || fieldData.process.length === 0) {
    //   updatedErrors.process = "Select a Process";
    //   isValid = false;
    // }
    // if (!fieldData.lotremark) {
    //   updatedErrors.lotremark = "Enter a Remark";
    //   isValid = false;
    // }
    // if (!fieldData.grossweight) {
    //   updatedErrors.grossweight = "Enter a Gross Weight";
    //   isValid = false;
    // }
    // if (!fieldData.status) {
    //   updatedErrors.status = "Enter a Status";
    //   isValid = false;
    // }
    setFieldData((prevFieldData) => ({
      ...prevFieldData,
      errors: updatedErrors,
    }));
    return isValid;
  };
  function handleSubmitStock(isPrint) {
    if (
      validateWorkStationData() &&
      workstationStockValidate() &&
      addStockValidate()
    ) {
      handleSubmitData(isPrint);
    }
  }
  // const addStockValidate = () => {
  //   let hasErrors = false;

  //   const updatedAddStockData = addStockData.map((data) => {
  //     if (data.stockCode) {
  //       if (data.pcs === "") {
  //         data.errors = {
  //           ...data.errors,
  //           pcs: "Plz Enter Pcs",
  //         };
  //         hasErrors = true;
  //       }
  //       if (data.weight === "") {
  //         data.errors = {
  //           ...data.errors,
  //           weight: "Plz Enter Weight",
  //         };
  //         hasErrors = true;
  //       }
  //       if (!hasErrors) {
  //         data.errors = {
  //           stockCode: "",
  //           weight: "",
  //           pcs: "",
  //         };
  //       }
  //     }
  //     return data;
  //   });

  //   const isValid = updatedAddStockData
  //     .filter((item) => item.stockCode)
  //     .every((data) => data.stockCode && data.pcs !== "" && data.weight !== "");

  //   setAddStockData(updatedAddStockData);
  //   return isValid;
  // };
  const workstationStockValidate = () => {
    if (selectedRowIndex.length === 0) {
      dispatch(
        Actions.showMessage({
          message: "Plz Select Workstation Stock",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  };
  const addStockValidate = () => {
    let hasErrors = false;

    const updatedAddStockData = addStockData.map((data) => {
      if (data.stockCode) {
        // if (data.pcs === "") {
        //   data.errors = {
        //     ...data.errors,
        //     pcs: "Plz Enter Pcs",
        //   };
        //   hasErrors = true;
        // }
        if (data.weight === "") {
          data.errors = {
            ...data.errors,
            weight: "Plz Enter Weight",
          };
          hasErrors = true;
        }
        if (!hasErrors) {
          data.errors = {
            stockCode: "",
            weight: "",
            // pcs: "",
          };
        }
      }
      return data;
    });

    const isValid = updatedAddStockData
      .filter((item) => item.stockCode)
      .every(
        (data) =>
          data.stockCode &&
          // data.pcs !== "" &&
          data.weight !== ""
      );

    if (updatedAddStockData.filter((item) => item.stockCode).length === 0) {
      dispatch(
        Actions.showMessage({
          message: "Plz Add Stock",
          variant: "error",
        })
      );
      return false;
    }
    setAddStockData(updatedAddStockData);
    return isValid;
  };
  const handleCheckboxChange = (data) => {
    if (data?.stock_name_code_id === selectedRowIndex?.stock_name_code_id) {
      setSelectedRowIndex([]);
    } else {
      setSelectedRowIndex(data);
    }
    setAddStockData([
      {
        stockCode: "",
        purity: "",
        pcs: "",
        weight: "",
        errors: {
          stockCode: "",
          purity: "",
          pcs: "",
          weight: "",
        },
      },
    ]);
  };
  return (
    <>
      {/* <Modal open={openPopup}> */}
      <Box className={classes.model} style={{ overflowY: "auto" }}>
        <Grid container className={classes.modalContainer}>
          <Grid item xs={12} sm={4} md={3} key="1">
            <FuseAnimate delay={300}>
              <Typography className="pl-28 pb-16 pt-16 text-18 font-700">
                Receive Balance Stock
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
              {/* <img src={Icones.arrow_left_pagination} alt="" /> */}
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
          </Grid>
        </Grid>
        <div className="main-div-alll ">
          <Box style={{ paddingInline: 16 }}>
            <Grid container spacing={2}>
              <Grid item md={12} lg={7}>
                <Grid container spacing={1} style={{ marginBottom: 16 }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    style={{ position: "relative" }}
                  >
                    <Typography style={{ fontWeight: "600" }}>
                      Worker / Work Station Name
                    </Typography>
                    {console.log(workStationList)}
                    <Select
                      filterOption={createFilter({
                        ignoreAccents: false,
                      })}
                      placeholder="Worker / Work Station Name"
                      options={workStationList
                        .filter(
                          (item) =>
                            item.department_id ===
                            parseFloat(
                              window.localStorage.getItem("SelectedDepartment")
                            )
                        )
                        .map((data) => ({
                          value: data.id,
                          label: data.name,
                          data: data,
                        }))}
                      value={fieldData.workstation}
                      onChange={(e) => handleWorkstationSelect(e)}
                    />
                    {fieldData.errors.workstation && (
                      <span className={classes.errorMessage}>
                        {fieldData.errors.workstation}
                      </span>
                    )}
                  </Grid>
                  {/* <Grid item xs={12} sm={6} md={4} lg={4}>
                  <Typography style={{ fontWeight: "600" }}>Process</Typography>
                  <Select
                    filterOption={createFilter({
                      ignoreAccents: false,
                    })}
                    placeholder="Process"
                    options={processList.map((data) => ({
                      value: data.id,
                      label: data.process_name,
                      data: data,
                    }))}
                    onChange={(e) => handleProcessSelect(e)}
                  />
                </Grid> */}
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={7}>
                <Box>
                  <Typography
                    style={{
                      paddingBlock: 5,
                      paddingLeft: 16,
                      background: "#e3e3e3",
                      fontWeight: "700",
                    }}
                  >
                    Received Metal
                  </Typography>
                  <TableContainer className={classes.scroll}>
                    <Table className={classes.addStockTableContainer}>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            width={40}
                            align="center"
                          ></TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Stock Code
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Purity
                          </TableCell>
                          {/* <TableCell className={classes.tableRowPad}>
                          Pcs
                        </TableCell> */}
                          <TableCell className={classes.tableRowPad}>
                            Weight
                          </TableCell>
                          {/* <TableCell className={classes.tableRowPad}>
                          Remark
                        </TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {addStockData.map((data, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell
                                style={{
                                  padding: "4px",
                                  textAlign: "center",
                                  border: "1px solid #e6e6e6",
                                  borderBottom: "2px solid #e6e6e6",
                                }}
                              >
                                <IconButton
                                  style={{ padding: "0" }}
                                  tabIndex="-1"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    if (addStockData.length - 1 !== index) {
                                      deleteLotHandler(index);
                                    }
                                  }}
                                >
                                  <Icon className="" style={{ color: "red" }}>
                                    delete
                                  </Icon>
                                </IconButton>
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                {console.log(selectedRowIndex)}
                                <Select
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  placeholder="Stock code"
                                  options={stockCodeList
                                    .filter(
                                      (item) =>
                                        item.purity ===
                                        selectedRowIndex?.WorkStationStockCode
                                          ?.purity
                                    )
                                    .map((data) => ({
                                      value: data.id,
                                      label: data.stock_code,
                                      data: data,
                                    }))}
                                  value={data.stockCode}
                                  onChange={(e) =>
                                    handleStockCodeSelect(e, index)
                                  }
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  variant="outlined"
                                  value={data.purity}
                                  name="purity"
                                  disabled
                                  style={{ width: "100%" }}
                                  onChange={(e) => handleChange(e, index)}
                                  error={
                                    data.errors !== undefined
                                      ? data.errors.purity
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    data.errors !== undefined
                                      ? data.errors.purity
                                      : ""
                                  }
                                />
                              </TableCell>
                              {/* <TableCell className={classes.tablePad}>
                              <TextField
                                name="pcs"
                                variant="outlined"
                                type="number"
                                className={classes.inputBoxTEST}
                                value={data.pcs}
                                style={{ width: "100%" }}
                                onChange={(e) => handleChange(e, index)}
                                error={
                                  data.errors !== undefined
                                    ? data.errors.pcs
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  data.errors !== undefined
                                    ? data.errors.pcs
                                    : ""
                                }
                              />
                            </TableCell> */}
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="weight"
                                  variant="outlined"
                                  value={data.weight}
                                  style={{ width: "100%" }}
                                  onChange={(e) => handleChange(e, index)}
                                  error={
                                    data.errors !== undefined
                                      ? data.errors.weight
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    data.errors !== undefined
                                      ? data.errors.weight
                                      : ""
                                  }
                                />
                              </TableCell>
                              {/* <TableCell className={classes.tablePad}>
                              <TextField
                                name="remark"
                                variant="outlined"
                                value={data.remark}
                                style={{ width: "100%" }}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </TableCell> */}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
              <Grid item xs={5}>
                {console.log(fieldData.workstation?.label)}
                <Typography
                  style={{
                    paddingBlock: 5,
                    paddingLeft: 16,
                    background: "#e3e3e3",
                    fontWeight: "700",
                  }}
                >
                  <b style={{ paddingRight: 7, fontSize: 16, fontWeight: 700 }}>
                    {fieldData.workstation?.label}
                  </b>
                  Workstation Stock List
                </Typography>
                <TableContainer className={classes.scroll}>
                  <Table className={classes.addStockTableContainer}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          width={40}
                          align="center"
                        ></TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Stock Code
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Purity
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Balance Weight
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {workstationStockData.length === 0 ? (
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            align="center"
                            colSpan={4}
                          >
                            <div style={{ textAlign: "center" }}>No Data</div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        workstationStockData.map((data, index) => {
                          console.log(data);
                          return (
                            <TableRow key={index}>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  padding: "4px",
                                  textAlign: "center",
                                  border: "1px solid #e6e6e6",
                                  borderBottom: "2px solid #e6e6e6",
                                }}
                              >
                                <Checkbox
                                  style={{ color: "#306ff1", padding: 0 }}
                                  color="primary"
                                  checked={
                                    selectedRowIndex.stock_name_code_id ===
                                    data.stock_name_code_id
                                  }
                                  onChange={() => handleCheckboxChange(data)}
                                />
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data.WorkStationStockCode.stock_code}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data.WorkStationStockCode.purity}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data.available_weight}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  columnGap: 10,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  id="btn-all-production"
                  variant="contained"
                  style={{
                    // background: "#1FD319",
                    color: "#FFFFFF",
                    marginTop: 15,
                    display: "block",
                  }}
                  onClick={handleSubmitStock}
                >
                  Save
                </Button>
                <Button
                  id="btn-all-production"
                  variant="contained"
                  style={{
                    // background: "#1FD319",
                    color: "#FFFFFF",
                    marginTop: 15,
                    display: "block",
                  }}
                  onClick={() => handleSubmitStock(1)}
                >
                  Save & Print
                </Button>
              </Grid>
            </Grid>
          </Box>
          <div style={{ display: "none" }}>
            <ReceiveBalanceStockPrint ref={componentRef} printObj={printObj} />
          </div>
        </div>
      </Box>
      {/* </Modal> */}
    </>
  );
};

export default ReceiveBalanceStock;

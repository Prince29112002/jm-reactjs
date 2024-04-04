import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/styles";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Icon,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import History from "@history";
import { AddAReferenceNumPrint } from "./AddAReferenceNumPrint/AddAReferenceNumPrint";
import { useReactToPrint } from "react-to-print";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Select, { createFilter } from "react-select";
import clsx from "clsx";
import { HtmlPrintAddApi } from "app/main/apps/Production/ProductionMain/Helper/HtmlPrintAdd";
import ReactDOM from "react-dom";
import Icones from "assets/fornt-icons/Mainicons";


const useStyles = makeStyles((theme) => ({
  // root: {},
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    padding: 12,
    background: "#415bd4",
    color: "#FFFFFF",
  },
  modalBody: {
    padding: 20,
  },
  actionBtn: {
    background: "#1fd319",
    color: "#FFFFFF",
    width: "100%",
    borderRadius: "10px",
  },
  textfield: {
    width: "100%",
    marginBottom: 15,
    // borderRadius: 7
  },
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
  tableRowPad: {
    padding: 7,
  },
  errorMessage: {
    color: "#f44336",
    position: "absolute",
    bottom: "-3px",
    fontSize: "9px",
    lineHeight: "8px",
  },
}));

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const AddAReferenceNumber = () => {
  const [printObj, setPrintObj] = useState("");
  const [isView, setIsView] = useState(false); //for view Only
  const [referenceApiData, setReferenceApiData] = useState([]);
  const [updatedReferenceApiData, setUpdatedReferenceApiData] = useState([]);
  const [remarks, setRemarks] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [processName, setProcessName] = useState("");
  const [processList, setProcessList] = useState([]);
  const [voucherNumber, setVoucherNumber] = useState("");
  const [remarksErr, setRemarksErr] = useState("");
  const [selectedDepartmentErr, setSelectedDepartmentErr] = useState("");
  const [selectedProcessNameErr, setSelectedProcessNameErr] = useState("");
  const [open, setOpen] = React.useState(false);
  const savepopuphandle = () => {
    if (referenceValid()) {
      setOpen(true);
    }
  };
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);
  const [selectedReference, setSelectedReference] = useState([]);
  const [selectedArray, setSelectedArray] = useState([]);

  useEffect(() => {
    cleardata();
    getAReferenceData();
  }, [window.localStorage.getItem("SelectedDepartment")]);

  const handleFieldChange = (value) => {
    console.log(value);
    setProcessName(value);
    setSelectedProcessNameErr("");
  };

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const handleChangeDept = (value) => {
    setSelectedDepartment(value);
    setSelectedDepartmentErr("");
  };

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "remarks") {
      setRemarks(value);
      setRemarksErr("");
    }
  }

  useEffect(() => {
    getProcessData();
    departmentData();
    getVoucherNumber();
  }, []);

  function getProcessData(id) {
    console.log(id);
    Axios.get(Config.getCommonUrl() + "api/process")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProcessList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/process" });
      });
  }

  function departmentData(id) {
    console.log(id);
    // setLoading(true)
    Axios.get(Config.getCommonUrl() + "api/admin/getdepartmentlist")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setDepartmentList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          // setLoading(false)
        }
      })
      .catch((error) => {
        // setLoading(false)
        handleError(error, dispatch, { api: "api/admin/getdepartmentlist" });
      });
  }

  function getVoucherNumber() {
    Axios.get(Config.getCommonUrl() + "api/stock/transferinvoucher")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // setProductCategory(response.data.data);
          setVoucherNumber(response.data.data.voucherNo);
          // if (response.data.data.allowed_back_date_entry === 1) {
          //   setAllowedBackDate(true);
          //   setBackEnteyDays(response.data.data.back_entry_days);
          // } else {
          //   setAllowedBackDate(false);
          //   setBackEnteyDays(0);
          // }
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/stock/transferinvoucher" });
      });
  }

  useEffect(() => {
    if (printObj) {
      handlePrint();
    }
  }, [printObj]);

  const handleAfterPrint = () => {
    const componentInstance = (
      <AddAReferenceNumPrint ref={componentRef} printObj={printObj} />
    );
    const containerDiv = document.createElement("div");
    ReactDOM.render(componentInstance, containerDiv);
    const printedContent = containerDiv.innerHTML;
    console.log("Printed HTML content:", printedContent);
    HtmlPrintAddApi(dispatch, printedContent, [printObj]);
    ReactDOM.unmountComponentAtNode(containerDiv);
    containerDiv.remove();
    History.goBack();
  };

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;
      setTimeout(() => {
        resolve();
      }, 10);
    });
  }, []); //setText

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

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Add_A_Reference_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  const validateTransferData = () => {
    let isValid = true;
    console.log(selectedDepartment);
    if (!selectedDepartment) {
      setSelectedDepartmentErr("Please Select Department");
      isValid = false;
    }
    console.log(processName);
    // if (!processName) {
    //   setSelectedProcessNameErr("Plz Select Process");
    //   isValid = false;
    // }
    // if (!remarks) {
    //   setRemarksErr("Plz Enter Remark");
    //   isValid = false;
    // }
    return isValid;
  };

  const savehandle = (onlySave, isTransfer) => {
    if (referenceValid()) {
      if (onlySave === 1) {
        getAReferencenumber(onlySave, isTransfer);
        setOpen(false);
      } else {
        if (validateTransferData()) {
          getAReferencenumber(onlySave, isTransfer);
          setOpen(false);
        }
      }
    }
  };

  const referenceValid = () => {
    console.log(referenceApiData, "referenceApiData");
    if (selectedArray.length === 0) {
      dispatch(
        Actions.showMessage({ message: "Please Select Tree", variant: "error" })
      );
    } else {
      let hasErrors = false;

      const updatedReferenceData = referenceApiData.map((data) => {
        console.log(data);
        if (selectedReference.includes(data.tree_number)) {
          console.log("dasfsadf asdf asdf asdf");
          if (data.reference_number === "" || data.reference_number === null) {
            data.errors = {
              ...data.errors,
              referenceno: "Please Enter Reference No.",
            };
            hasErrors = true;
          }
          if (!hasErrors) {
            data.errors = {
              referenceno: "",
            };
          }
        }
        return data;
      });

      if (!hasErrors) {
        return true;
      }
      setReferenceApiData(updatedReferenceData);
    }

    // if (updatedReferenceApiData.length === 0) {
    //   dispatch(
    //     Actions.showMessage({
    //       message: "Please add a reference number",
    //       variant: "error",
    //     })
    //   );
    //   return false;
    // }

    // return true;
  };
  console.log(selectedArray);
  function getAReferencenumber(onlySave, isTransfer) {
    const updatedReferenceArr = selectedArray.map((item) => ({
      id: item.id,
      reference_number: item.reference_number,
    }));
    console.log(updatedReferenceArr);
    console.log(onlySave);
    let body;
    if (onlySave === 1) {
      body = {
        is_Transfer: isTransfer,
        referenceArray: updatedReferenceArr,
        transfer_department_id: parseFloat(
          window.localStorage.getItem("SelectedDepartment")
        ),
        from_department_id: parseFloat(
          window.localStorage.getItem("SelectedDepartment")
        ),
      };
    } else {
      body = {
        remarks: remarks,
        is_Transfer: isTransfer,
        referenceArray: updatedReferenceArr,
        process_id: processName.value,
        transfer_department_id: selectedDepartment.value,
        from_department_id: parseFloat(
          window.localStorage.getItem("SelectedDepartment")
        ),
      };
    }
    Axios.post(
      Config.getCommonUrl() + `api/production/add/reference/number`,
      body
    )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log(response.data.data);
          if (onlySave === 1) {
            cleardata();
            getAReferenceData();
          } else {
            handleUpdate(response.data.activityNumber);
          }
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          getVoucherNumber();
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
          api: `api/production/add/reference/number`,
          body: body,
        });
      });
  }

  useEffect(() => {
    getAReferenceData();
  }, []);

  function getAReferenceData() {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/tree/listing?department_id=${window.localStorage.getItem(
          "SelectedDepartment"
        )}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let responseData = response.data.data;
          if (responseData.length > 0) {
            console.log(response.data);
            setReferenceApiData(responseData);
          } else {
            setReferenceApiData([]);
          }
        } else {
          setReferenceApiData([]);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/production/tree/listing?department_id=${window.localStorage.getItem(
            "SelectedDepartment"
          )}`,
        });
      });
  }

  const InputChange = (event, index) => {
    const { name, value } = event.target;
    console.log(name, value);
    let newArr = [...referenceApiData];
    newArr[index].reference_number = event.target.value;
    newArr[index].errors = {
      // ...newArr[index].errors,
      [name]: "",
    };
    console.log(newArr);
    // const updatedApiData = newArr
    //   .filter(
    //     (item) => "reference_number" in item && item.reference_number !== ""
    //   )
    //   .map((item) => ({
    //     id: item.id,
    //     reference_number: item.reference_number,
    //   }));
    // console.log(updatedApiData);
    // setUpdatedReferenceApiData(updatedApiData);
    console.log(newArr);
    setReferenceApiData(newArr);
  };

  const cleardata = () => {
    // setUpdatedReferenceApiData([]);
    setSelectedArray([]);
    setSelectedReference([]);
    setReferenceApiData([]);
    setVoucherNumber("");
    setSelectedDepartment("");
    setProcessName("");
    setRemarks("");
  };

  function handleUpdate(actNumber) {
    const updatedTreeIds = selectedArray.map((item) => item.id);
    console.log(updatedTreeIds);
    const body = {
      tree_ids: updatedTreeIds,
      from_department_id: parseFloat(
        window.localStorage.getItem("SelectedDepartment")
      ),
      transfer_department_id: selectedDepartment.value,
      voucher_number: voucherNumber,
      activityNumber: actNumber,
    };
    console.log(selectedDepartment);
    console.log(selectedDepartment.value);
    Axios.post(
      Config.getCommonUrl() + `api/productionPrintVoucher/transfer/tree/print`,
      body
    )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log(response.data.data);
          setPrintObj(response.data.data);
          cleardata();
          getAReferenceData();
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
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
          api: `api/production/add/reference/number`,
          body: body,
        });
      });
  }

  const handleSelectAll = () => {
    if (selectedReference.length === referenceApiData.length) {
      // If all rows are selected, unselect all
      setSelectedReference([]);
      setSelectedArray([]);
      // setExportTagedData([]);
    } else {
      // Otherwise, select all rows
      const allRowNames = referenceApiData.map((data) => data.tree_number);
      setSelectedReference(allRowNames);
      setSelectedArray(referenceApiData);
      // setExportTagedData(apiData);
    }
  };

  const handleSelectedBarcode = (obj) => {
    if (selectedReference.includes(obj.tree_number)) {
      const updatedArray = selectedReference.filter(
        (item) => item !== obj.tree_number
      );
      const updatedObj = selectedArray.filter(
        (item) => item.tree_number !== obj.tree_number
      );
      // const updateExportTagedData = exportTagedData.filter(
      //   (item) => item.NAME !== obj.NAME
      // );
      setSelectedReference(updatedArray);
      setSelectedArray(updatedObj);
      // setExportTagedData(updateExportTagedData);
    } else {
      const updateBarcodeData = [...selectedReference, obj.tree_number];
      const updateBarcodeObj = [...selectedArray, obj];
      // const updateExportTagedData = [...exportTagedData, obj];

      setSelectedReference(updateBarcodeData);
      setSelectedArray(updateBarcodeObj);
      // setExportTagedData(updateExportTagedData);
    }
  };

  return (
    <>
      <Box className={classes.model} style={{ overflowY: "auto" }}>
        <Grid container className={classes.modalContainer}>
          <Grid item xs={12} sm={4} md={3} key="1">
            <FuseAnimate delay={300}>
              <Typography className="pl-28 pb-16 pt-16 text-18 font-700">
                Add a Reference Number
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
          <TableContainer
            className={classes.scroll}
            style={{ marginBottom: 16 }}
          >
            <Table className={`${classes.table}`} style={{ minWidth: "900px" }}>
              <TableHead className={classes.tablehead}>
                <TableRow>
                  <TableCell
                    className={classes.tableRowPad}
                    style={{ width: "50px" }}
                  >
                    {referenceApiData.length !== 0 && (
                      <Checkbox
                        style={{ color: "#415BD4", padding: 0 }}
                        color="primary"
                        checked={
                          selectedReference.length === referenceApiData.length
                        }
                        onChange={handleSelectAll}
                      />
                    )}
                  </TableCell>
                  <TableCell className={classes.tableRowPad} width="110px">
                    Stock Type
                  </TableCell>
                  <TableCell className={classes.tableRowPad} width="135px">
                    Stock Code
                  </TableCell>
                  <TableCell className={classes.tableRowPad} width="170px">
                    Category
                  </TableCell>
                  <TableCell className={classes.tableRowPad} width="70px">
                    Purity
                  </TableCell>
                  <TableCell className={classes.tableRowPad} width="60px">
                    Qty
                  </TableCell>
                  <TableCell className={classes.tableRowPad} width="120px">
                    Tree Weight
                  </TableCell>
                  <TableCell className={classes.tableRowPad} width="120px">
                    Wax Weight
                  </TableCell>
                  <TableCell className={classes.tableRowPad} width="130px">
                    Gross Weight
                  </TableCell>
                  <TableCell className={classes.tableRowPad} width="130px">
                    Stone Weight
                  </TableCell>
                  <TableCell className={classes.tableRowPad} width="120px">
                    Net Weight
                  </TableCell>
                  <TableCell className={classes.tableRowPad} width="200px">
                    Reference No
                  </TableCell>
                  <TableCell className={classes.tableRowPad}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {referenceApiData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      className={classes.tableRowPad}
                      colSpan={13}
                      align="center"
                    >
                      No Data
                    </TableCell>
                  </TableRow>
                ) : (
                  referenceApiData.map((data, index) => {
                    {
                      console.log(data);
                    }
                    return (
                      <TableRow key={index}>
                        <TableCell className={classes.tableRowPad}>
                          <Checkbox
                            style={{
                              color: "#415BD4",
                              padding: 0,
                            }}
                            color="primary"
                            checked={selectedReference.includes(
                              data.tree_number
                            )}
                            onChange={() => handleSelectedBarcode(data)}
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Tree
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {data.tree_number}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {data.category_name}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {data.purity ? data.purity : "-"}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {data.pcs}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {data.wax_weight}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {data.total_gross_wgt}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {data.total_stone_weight}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {data.total_net_wgt}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          <TextField
                            name="referenceno"
                            variant="outlined"
                            style={{ width: "100%" }}
                            value={
                              data.reference_number ? data.reference_number : ""
                            }
                            onChange={(event) => {
                              InputChange(event, index);
                            }}
                            error={
                              data?.errors &&
                              data?.errors.referenceno.length > 0
                            }
                            helperText={
                              data?.errors && data?.errors.referenceno
                            }
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container>
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                columnGap: "10px",
              }}
            >
              <Button
                id="btn-all-production"
                variant="contained"
                style={{
                  color: "#FFFFFF",
                  marginTop: 15,
                  display: "block"
                }}
                onClick={savepopuphandle}
              >
                Save Print & Transfer
              </Button>

              {/* <Button
                variant="contained"
                style={{ background: "#1fd319", color: "#FFFFFF" }}
                onClick={handleOpen}
              >
                Save & Print
              </Button> */}
              <Button
                id="btn-all-production"
                variant="contained"
                style={{
                  color: "#FFFFFF",
                  marginTop: 15,
                  display: "block",
                  // marginLeft: "auto",
                }}
                onClick={() => savehandle(1, 0)}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Box>
        <div style={{ display: "none" }}>
          <AddAReferenceNumPrint ref={componentRef} printObj={printObj} />
        </div>

        <div>
        <Modal open={open} onClose={handleClose} className={classes.modal}>
          <div style={{ width: 500, background: "#FFFFFF" }}>
            <Typography
              variant="h6"
              className={classes.title}
              style={{ textAlign: "center", position: "relative" }}
            >
              Transfer
              <IconButton
                style={{
                  padding: "0",
                  position: "absolute",
                  right: "5px",
                  top: "16px",
                }}
                onClick={handleClose}
              >
                <Icon className="mr-8" style={{ color: "#ffffff" }}>
                  close
                </Icon>
              </IconButton>
            </Typography>
            <Grid container className={classes.modalBody} spacing={2}>
              <Grid item xs={12}>
                <TextField
                  className=""
                  label="Voucher Number"
                  name="voucherNumber"
                  value={voucherNumber}
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  required
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} style={{ position: "relative" }}>
                <Select
                  id="heading-select-input"
                  classes={clsx(classes, "mb-16")}
                  filterOption={createFilter({ ignoreAccents: false })}
                  styles={selectStyles}
                  value={selectedDepartment}
                  onChange={handleChangeDept}
                  optionsProps={{
                    style: {
                      height: "10px",
                      backgroundColor: "red",
                    },
                  }}
                  options={departmentList
                    .filter(
                      (item) =>
                        item.id !==
                        parseFloat(
                          window.localStorage.getItem("SelectedDepartment")
                        )
                    )
                    .map((suggestion) => {
                      console.log(suggestion);
                      return {
                        value: suggestion.id,
                        label: suggestion.name,
                      };
                    })}
                  placeholder="Department Name"
                />
                {selectedDepartmentErr && (
                  <span className={classes.errorMessage}>
                    {selectedDepartmentErr}
                  </span>
                )}
              </Grid>
              {/* <Grid item xs={12} style={{ position: "relative" }}>
                <Select
                  id="heading-select-input"
                  classes={clsx(classes, "mb-16")}
                  filterOption={createFilter({ ignoreAccents: false })}
                  styles={selectStyles}
                  value={processName}
                  onChange={handleFieldChange}
                  optionsProps={{
                    style: {
                      height: "10px",
                      backgroundColor: "red",
                    },
                  }}
                  options={processList.map((suggestion) => {
                    console.log(suggestion);
                    return {
                      value: suggestion.id,
                      label: suggestion.process_name,
                    };
                  })}
                  placeholder="Process Name"
                />
                {selectedProcessNameErr && (
                  <span className={classes.errorMessage}>
                    {selectedProcessNameErr}
                  </span>
                )}
              </Grid> */}
              <Grid item xs={12}>
                <TextField
                  label="Remarks"
                  name="remarks"
                  value={remarks}
                  error={remarksErr.length > 0 ? true : false}
                  helperText={remarksErr}
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  fullWidth
                  // disabled={isViewOnly}
                />
              </Grid>
              <Grid item xs={12}>
                {/* <Button
                  variant="contained"
                  className={classes.actionBtn}
                  onClick={() => savehandle(2)}
                >
                  Save
                </Button> */}
                <Button
                  id="btn-all-production"
                  variant="contained"
                  style={{
                    color: "#FFFFFF",
                    marginTop: 15,
                    display: "block",
                  }}
                  onClick={() => savehandle(0, 1)}
                >
                  Save & Print
                </Button>
              </Grid>
            </Grid>
          </div>
        </Modal>
      </div>
        </div>
      </Box>
    </>
  );
};

export default AddAReferenceNumber;

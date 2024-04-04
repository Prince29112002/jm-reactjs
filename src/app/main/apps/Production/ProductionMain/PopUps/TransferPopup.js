import {
  Button,
  FormControl,
  Grid,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import Select, { createFilter } from "react-select";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { VoucherPopupPrintCom } from "app/main/apps/Stock/VoucherPopupPrintCom/VoucherPopupPrintCom";
import { useReactToPrint } from "react-to-print";
import { HtmlPrintAddApi } from "app/main/apps/Production/ProductionMain/Helper/HtmlPrintAdd";
import ReactDOM from "react-dom";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
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
  errorMessage: {
    color: "#f44336",
    position: "absolute",
    bottom: "-3px",
    fontSize: "9px",
    lineHeight: "8px",
  },
}));

const TransferPopup = (props) => {
  const {
    openPopup,
    closePopup,
    selectedRowData,
    selectedTreeIds,
    fromDepartmentId,
    submitTransfer,
    rowData,
    stock_name_code_id,
  } = props;
  console.log("selectedTreeIds", selectedTreeIds);
  console.log("fromDepartmentId", fromDepartmentId);
  console.log("selectedRowData", selectedRowData);
  console.log("rowData", rowData);
  console.log("stock_name_code_id", stock_name_code_id);

  const dispatch = useDispatch();
  const classes = useStyles();
  const [processList, setProcessList] = useState([]);
  const [processLineList, setProcessLineList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDepartmentErr, setSelectedDepartmentErr] = useState("");
  const [remarks, setRemarks] = useState("");
  const [remarksErr, setRemarksErr] = useState("");
  const [voucherNumber, setVoucherNumber] = useState("");
  const [processName, setProcessName] = useState("");
  const [processNameErr, setProcessNameErr] = useState("");
  const [printObj, setPrintObj] = useState([]);
  const [printData, setPrintData] = useState([]);
  const [voucherandId, setVoucherandId] = useState({});

  const [idsArr, setIdsArr] = useState([]);

  const theme = useTheme();

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };
  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
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

  useEffect(()=>{
    if(printData,printObj.length > 0) {
      handlePrint();
    }
  },[printData,printObj]);

  const handleAfterPrint = () => {
      // Create a new instance of the component
      const componentInstance = (
        <VoucherPopupPrintCom
          ref={componentRef}
          printObj={printObj}
          printData={printData}
          StockType={voucherandId}
        />
      );
  
      // Create a container div element
      const containerDiv = document.createElement("div");
  
      // Append the component to the container div
      ReactDOM.render(componentInstance, containerDiv);
  
      // Access the HTML content of the container div
      const printedContent = containerDiv.innerHTML;
  
      // Log or use the printed content as needed
      HtmlPrintAddApi(dispatch, printedContent, [{activityNumber : printData.activityNumber}]);
  
      // Clean up: Unmount the component and remove the container div
      ReactDOM.unmountComponentAtNode(containerDiv);
      containerDiv.remove();
  };

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "production_print_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });

  useEffect(() => {
    // getProcessData();
    departmentData();
    getVoucherNumber();
    console.log("props", props);
    console.log(">>>>>>", rowData);
    let data = rowData;

    let arr = [];

    data.map((item) => {
      if (item.isSame === true) {
        arr.push(...item.ids);
      } else {
        arr.push({
          is_split: item.is_split,
          weight: item.weight,
          pcs: item.pcs,
          stock_name_code_id: item.stock_name_code_id,
          department_id: item.department_id,
          voucher_no: item.voucher_no,
        });
      }
      return item;
    });

    // if (stock_name_code_id) {
    //   set_stock_name_code_id(stock_name_code_id);
    // } else {
    //   set_stock_name_code_id([]);
    // }

    console.log("arr", arr);
    setIdsArr(arr);
    //eslint-disable-next-line
  }, [rowData]);

  useEffect(() => {
    if (rowData.length > 0) {
      setProcessName({
        value: rowData[0].process_id,
        label: rowData[0].current_process,
      });
    }
  }, [rowData]);

  // useEffect(() => {
  //   getProcessData();
  //   departmentData();
  //   getVoucherNumber();
  // }, []);

  function departmentData(id) {
    console.log(id);
    // setLoading(true)
    Axios.get(Config.getCommonUrl() + "api/department/common/all")
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
        handleError(error, dispatch, { api: "api/department/common/all" });
      });
  }
  function getProcessData(id) {
    console.log(id);
    // setLoading(true)
    Axios.get(Config.getCommonUrl() + "api/process")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProcessList(response.data.data);
          // const desiredObject = response.data.data.find(
          //   (item) => item.product_category_id === id
          // );
          // if (desiredObject) {
          //   setProcessName({
          //     value: desiredObject.product_category_id,
          //     label: desiredObject.process_line_name,
          //   });
          // }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          // setLoading(false)
        }
      })
      .catch((error) => {
        // setLoading(false)
        handleError(error, dispatch, { api: "api/process" });
      });
  }
  function postTransferApiData() {
    const body = {
      stock_ids: idsArr,
      ...(stock_name_code_id.length !== 0 && {
        stock_code_weight: stock_name_code_id,
      }),
      transfer_department_id: selectedDepartment.value,
      from_department_id: fromDepartmentId,
      remarks: remarks,
    };
    Axios.post(Config.getCommonUrl() + `api/stock/transfer`, body)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // closeModal();
          closePopup();
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          PostStockListPrintData(response.data.activityNumber);
          submitTransfer();
          setRemarks("");
          setSelectedDepartment("");
          setVoucherNumber("");
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
          api: `api/stock/transfer`,
          body,
        });
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
  const validateTransferData = () => {
    let isValid = true;
    if (!selectedDepartment) {
      setSelectedDepartmentErr("Plz Select Department");
      isValid = false;
    }
    // if (!remarks) {
    //   setRemarksErr("Plz Enter Remark");
    //   isValid = false;
    // }
    return isValid;
  };
  function handleFormSubmit() {
    if (validateTransferData()) {
      postTransferApiData();
    }
  }
  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "remarks") {
      setRemarks(value);
      setRemarksErr("");
    }
  }
  const handleChangeDept = (value) => {
    setSelectedDepartment(value);
    setSelectedDepartmentErr("");
  };

  const handleProcessChange = (value) => {
    setProcessName(value);
    setProcessNameErr("");
  };

  function PostStockListPrintData(actNumber) {
    let voucherFlag = rowData[0].flag;
    let arr = [];
    rowData.map((item) => {
      if (item.isSame === true) {
        arr.push(...item.ids);
      }
      return item;
    });
    const body = {
      voucher_number: voucherNumber,
      stock_ids: arr,
      activityNumber: actNumber,
    };
    Axios.post(
      Config.getCommonUrl() + `api/productionPrintVoucher/transfer/stock/print`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setPrintObj(response.data.data);
          setPrintData(response.data);
          setVoucherandId(voucherFlag);
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
          api: `api/productionPrintVoucher/transfer/stock/print`,
          body: body,
        });
      });
  }

  return (
    <div>
      <Modal open={openPopup} onClose={closePopup} className={classes.modal}>
        <div style={{ width: 500, background: "#FFFFFF" }}>
          <div style={{ position: "relative", textAlign: "center" }}>
            <Typography variant="h6" className={classes.title}>
              Transfer
            </Typography>
            <IconButton
              style={{ position: "absolute", top: 0, right: 0 }}
              onClick={closePopup}
            >
              <Icon>
                <img src={Icones.cross} alt="" />
              </Icon>
            </IconButton>
          </div>

          {console.log(fromDepartmentId)}
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
                  .filter((item) => item.id !== parseFloat(fromDepartmentId))
                  .map((suggestion) => {
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
            <Grid item xs={12}>
              <TextField
                label="Remarks"
                name="remarks"
                value={remarks}
                onChange={(e) => handleInputChange(e)}
                variant="outlined"
                fullWidth
                error={remarksErr.length > 0 ? true : false}
                helperText={remarksErr}
              />
            </Grid>
            <Button
              id="popup-cancel-btn"
              variant="contained"
              className="w-128 mx-auto mt-20"
              onClick={closePopup}
            >
              Cancel
            </Button>
            <Button
              id="color-popup-save"
              variant="contained"
              className="w-128 mx-auto mt-20 "
              onClick={(e) => handleFormSubmit(e)}
            >
              Save & Print
            </Button>
          </Grid>
        </div>
      </Modal>
      <div style={{ display: "none" }}>
        <VoucherPopupPrintCom
          ref={componentRef}
          printObj={printObj}
          printData={printData}
          StockType={voucherandId}
        />
      </div>
    </div>
  );
};

export default TransferPopup;

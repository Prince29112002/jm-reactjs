import React, { useState, useEffect } from "react";
import { Icon, IconButton } from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import { TextField } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import History from "@history";
import Select, { createFilter } from "react-select";
import axios from "axios";
import * as Actions from "app/store/actions";
import Config from "app/fuse-configs/Config";
import LoaderPopup from "app/main/Loader/LoaderPopup";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import { VoucherPopupTransferPrintCom } from "../VoucherPopupPrintCom/VoucherPopupTransferPrintComp";
import Axios from "axios";
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
    backgroundColor: "cornflowerblue",
    color: "white",
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


const StockTransfer = (props) => {
  console.log(props.stockType);
  console.log(props.Ids);
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [printObj, setPrintObj] = useState([]);
  const [printData, setPrintData] = useState("");

  const [departmentList, setDepartmentList] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDepartmentErr, setSelectedDepartmentErr] = useState("");

  const [remarks, setRemarks] = useState("");
  const [remarksErr, setRemarksErr] = useState("");

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

  const [idsArr, setIdsArr] = useState([]);
  const [stock_name_code_id, set_stock_name_code_id] = useState([]);
  const [isView, setIsView] = useState(false); //for view Only

  useEffect(() => {
    getDepartmentList();
    getVoucherNumber();
    console.log("props", props);
    console.log(">>>>>>", props.Ids);
    //check here if props.Ids has isSame === true then copy all ids array as "stock_id": 1
    // else isSame === false then look for is_split and other vars
    let data = props.Ids;

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

    if (props.hasOwnProperty("stock_name_code_id")) {
      set_stock_name_code_id(props.stock_name_code_id);
    } else {
      set_stock_name_code_id([]);
    }

    console.log("arr", arr);
    setIdsArr(arr);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

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

  const handleAfterPrint = () => {
    if (props.pgName === "/dashboard/stock") {
      History.push("/dashboard/stock");
    } else {
      History.push("/dashboard/stock/:stock");
    }

    props.resetVar();
  };

  const printHandler = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Stock_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  function checkforPrint() {
    printHandler();
  }

  useEffect(() => {
    if (printObj.length > 0) {
      checkforPrint();
    }
  }, [printObj]);

  function getDepartmentList() {
    axios
      .get(Config.getCommonUrl() + "api/department/common/all")
      .then((res) => {
        console.log(res);
        setDepartmentList(res.data.data);
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/department/common/all" });
      });
  }

  function getVoucherNumber() {
    axios
      .get(Config.getCommonUrl() + "api/stock/transferinvoucher")
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

  const handleChangeDept = (value) => {
    setSelectedDepartment(value);
    setSelectedDepartmentErr("");
  };

  function validateDept() {
    if (selectedDepartment === "") {
      setSelectedDepartmentErr("Select Department Name");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (event) => {
    // event.preventDefault();
    if (validateDept()) {
      transferstockRequest();
    }
  };

  function transferstockRequest() {
    setLoading(true);
    axios
      .post(Config.getCommonUrl() + "api/stock/transfer", {
        transfer_department_id: selectedDepartment.value,
        from_department_id: window.localStorage.getItem("SelectedDepartment"),
        stock_ids: idsArr, //props.Ids,
        remarks: remarks,
        ...(props.hasOwnProperty("stock_name_code_id") && {
          stock_code_weight: stock_name_code_id,
        }),
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id
          // History.goBack();
          PostStockListPrintData();
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
              autoHideDuration: 2000,
            })
          );
          setLoading(false);
          setOpen(false);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
              autoHideDuration: 2000,
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);

        handleError(error, dispatch, {
          api: "api/stock/transfer",
          body: {
            transfer_department_id: selectedDepartment.value,
            stock_ids: idsArr, //props.Ids,
            remarks: remarks,
          },
        });
      });
  }

  const handleClose = () => {
    setOpen(false);
    props.resetVar();
    if (props.pgName === "/dashboard/stock") {
      History.push("/dashboard/stock");
    } else {
      History.push("/dashboard/stock/:stock");
    }
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

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "remarks") {
      setRemarks(value);
      setRemarksErr("");
    }
  }

  function PostStockListPrintData() {
    const body = {
      voucher_number: voucherNumber,
      //  props.data.voucher_no,
      //
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
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            {open === true && (
              <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={(_, reason) => {
                  if (reason !== "backdropClick") {
                    handleClose();
                  }
                }}
              >
                <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
                  {loading && <LoaderPopup />}
                  <h5
                    className="popup-head"
                    style={{
                      padding: "14px",
                    }}
                  >
                    Transfer
                    <IconButton
                      style={{ position: "absolute", top: "-2px", right: "8px" }}
                      onClick={handleClose}
                    >
                      <Icon>
                        <img src={Icones.cross} alt="" />
                      </Icon>
                    </IconButton>
                  </h5>
                  <div className="p-5 pl-16 pr-16">
                    <lebel>Voucher Number</lebel>
                    <TextField
                      className="pb-5"
                      placeholder="Voucher Number"
                      name="voucherNumber"
                      value={voucherNumber}
                      error={voucherNumErr.length > 0 ? true : false}
                      helperText={voucherNumErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled
                    />

                    <lebel>Department Name</lebel>
                    <Select
                      className="pb-5"
                      classes={classes}
                      styles={selectStyles}
                      options={departmentList
                        .filter(
                          (x) =>
                            x.id.toString() !==
                            window.localStorage.getItem("SelectedDepartment")
                        ) //removing above selected department will not transfer to same dept
                        .map((optn) => ({
                          value: optn.id,
                          label: optn.name,
                        }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={selectedDepartment}
                      onChange={handleChangeDept}
                      placeholder="Department Name"
                    />

                    <span style={{ color: "red" }}>
                      {selectedDepartmentErr.length > 0
                        ? selectedDepartmentErr
                        : ""}
                    </span>

                    <lebel>Remarks</lebel>
                    <TextField
                      placeholder="Remarks"
                      name="remarks"
                      value={remarks}
                      error={remarksErr.length > 0 ? true : false}
                      helperText={remarksErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                    // disabled={isViewOnly}
                    />

                    {/* <Button
                      variant="contained"
                      color="primary"
                      className="w-full mx-auto mt-16"
                      style={{
                        backgroundColor: "#4caf50",
                        border: "none",
                        color: "white",
                      }}
                      onClick={(e) => handleFormSubmit(e)}
                    >
                      SAVE
                    </Button> */}

                    <div style={{ paddingBottom: "30px", textAlign: "center" }}>
                      <Button
                        variant="contained"
                        className="w-128 mx-auto mt-20 popup-cancel"
                        aria-label="Register"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>

                      <Button
                        variant="contained"
                        className="w-228 mx-auto mt-20 popup-save"
                        style={{ marginLeft: "20px" }}
                        aria-label="Register"
                        onClick={(e) => handleFormSubmit(e)}
                    >
                      Save & Print
                      </Button>
                    </div>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </FuseAnimate>
      <div style={{ display: "none" }}>
        <VoucherPopupTransferPrintCom
          ref={componentRef}
          printObj={printObj}
          printData={printData}
          StockType={props.stockType}
        />
      </div>
    </div>
  );
};

export default StockTransfer;

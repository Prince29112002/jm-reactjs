import React, { useState, useEffect } from "react";
import { Icon, IconButton } from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import { TextField } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Select, { createFilter } from "react-select";
import LoaderPopup from "app/main/Loader/LoaderPopup";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as Actions from "app/store/actions";

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
  errorMessage: {
    color: "#f0594e",
    bottom: 0,
    display: "block",
    position: "relative",
    fontSize: "11px",
    lineHeight: "8px",
    marginTop: 3,
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

const LotTransfer = ({ openModal, closeModal, rowData }) => {
  console.log(rowData);
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [departmentList, setDepartmentList] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDepartmentErr, setSelectedDepartmentErr] = useState("");

  const [remarks, setRemarks] = useState("");
  const [remarksErr, setRemarksErr] = useState("");

  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");

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
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    getVoucherNumber();
    getDepartmentList();
  }, []);

  const handleChangeDept = (value) => {
    setSelectedDepartment(value);
    setSelectedDepartmentErr("");
  };

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
  function handleTransferLot() {
    // const updatedDesign = selectedDesign.map((item) => ({ design_id: item }));
    const body = {
      stock_ids: [{ stock_id: rowData.StockDataForLot.id }],
      transfer_department_id: selectedDepartment.value,
      from_department_id: rowData.department_id,
      // lot_ids: [rowData.id],
      remarks: remarks,
      // tree_ids: [],
    };
    Axios.post(Config.getCommonUrl() + `api/stock/transfer`, body)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          closeModal();
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          clearData();
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
          api: `api/stock/transfer`,
          body,
        });
      });
  }
  const handleFormSubmit = () => {
    if (selectedDepartment) {
      handleTransferLot();
    } else {
      setSelectedDepartmentErr("Plz Select Department");
    }
  };

  function getDepartmentList() {
    Axios.get(Config.getCommonUrl() + "api/admin/getdepartmentlist")
      .then((res) => {
        console.log(res);
        setDepartmentList(res.data.data);
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/admin/getdepartmentlist" });
      });
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
  const handleClose = () => {
    clearData();
    closeModal();
  };
  const clearData = () => {
    setSelectedDepartment("");
    // setVoucherNumber("");
    setRemarks("");
  };
  if (!openModal) return null;
  return (
    <div className={clsx(classes.root, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            {/* {open === true && ( */}
            <Modal open={openModal} onClose={handleClose}>
              <div style={modalStyle} className={classes.paper}>
                {loading && <LoaderPopup />}
                <h5
                  className="p-5"
                  style={{
                    textAlign: "center",
                    backgroundColor: "black",
                    color: "white",
                  }}
                >
                  Transfer
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={handleClose}
                  >
                    <Icon style={{ color: "white" }}>close</Icon>
                  </IconButton>
                </h5>
                <div className="p-5 pl-16 pr-16">
                  <TextField
                    className=""
                    label="Voucher Number"
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
                  <Select
                    className="mt-16"
                    classes={classes}
                    styles={selectStyles}
                    options={departmentList
                      .filter((x) => x.id !== rowData.department_id)
                      .map((optn) => ({
                        value: optn.id,
                        label: optn.name,
                      }))}
                    filterOption={createFilter({ ignoreAccents: false })}
                    value={selectedDepartment}
                    onChange={handleChangeDept}
                    placeholder="Department Name"
                  />
                  <span className={classes.errorMessage}>
                    {selectedDepartmentErr.length > 0
                      ? selectedDepartmentErr
                      : ""}
                  </span>
                  <TextField
                    className="mt-16"
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
                  <Button
                    variant="contained"
                    color="primary"
                    className="w-full mx-auto mt-16"
                    style={{
                      backgroundColor: "#4caf50",
                      border: "none",
                      color: "white",
                    }}
                    onClick={(e) => handleFormSubmit(e)}
                    // onClick={(e) => handleFormSubmit(e)}
                  >
                    SAVE
                  </Button>
                </div>
              </div>
            </Modal>
            {/* )} */}
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default LotTransfer;

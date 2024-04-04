import React, { useState, useEffect, useContext } from "react";
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
import AppContext from "app/AppContext";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
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

const TransferHm = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [departmentList, setDepartmentList] = useState([]);
  const [processList, setProcessList] = useState([]);

  const [selectedDepartmentSingle, setSelectedDepartment] = useState("");
  const [selectedDepartmentErr, setSelectedDepartmentErr] = useState("");

  const [selectedProcess, setSelectedProcess] = useState("");
  const [selectedProcessErr, setSelectedProcessErr] = useState("");

  const [remark, setRemark] = useState("");
  const appContext = useContext(AppContext);

  const { selectedDepartment } = appContext;

  useEffect(() => {
    getDepartmentList();
    getProcessList();
  }, [dispatch]);

  function getDepartmentList() {
    axios
      .get(Config.getCommonUrl() + "api/department/all")
      .then((res) => {
        console.log(res);
        setDepartmentList(res.data.data);
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/department/all" });
      });
  }

  function getProcessList() {
    axios
      .get(Config.getCommonUrl() + "api/process")
      .then((res) => {
        console.log(res);
        setProcessList(res.data.data);
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/process" });
      });
  }

  const handleChangeDept = (value) => {
    setSelectedDepartment(value);
    setSelectedDepartmentErr("");
  };

  const handleChangeProcess = (value) => {
    setSelectedProcess(value);
    setSelectedProcessErr("");
  };

  function validateDept() {
    if (selectedDepartmentSingle === "") {
      setSelectedDepartmentErr("Select Department Name");
      return false;
    }
    return true;
  }
  function validateProcess() {
    if (selectedProcess === "") {
      setSelectedProcessErr("Select Process Name");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (validateDept() && validateProcess()) {
      addTransferApi();
    }
  };

  function addTransferApi() {
    var url;
    if (props.from === "hallmark") {
      var body = {
        hallmark_issue_id: props.lot_id,
        department_id: selectedDepartmentSingle.value,
        process_id: selectedProcess.value,
        note: remark,
        from_department: selectedDepartment.value.split("-")[1],
      };
      url = `api/hallmarkissue/transfer/hallmark/receive`;
    } else {
      var body = {
        packing_slip_id: props.lot_id,
        department_id: selectedDepartmentSingle.value,
        process_id: selectedProcess.value,
        note: remark,
        from_department: selectedDepartment.value.split("-")[1],
      };
      url = `api/hallmarkissue/transfer/slip`;
    }
    axios
      .post(Config.getCommonUrl() + url, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(
            Actions.showMessage({
              message: "Transfer successfully",
              variant: "success",
            })
          );
          setOpen(false);
          History.push("/dashboard/hallmark");
          props.getData();
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
        handleError(error, dispatch, { api: url, body: body });
      });
  }
  const handleClose = () => {
    setOpen(false);
    props.getData();
    History.push("/dashboard/hallmark");
  };

  const handleModalClose = () => {
    setOpen(false);
    History.push("/dashboard/hallmark");
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
                <div style={modalStyle} className={classes.paper}>
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
                    <Select
                      className="mt-16"
                      classes={classes}
                      styles={selectStyles}
                      options={departmentList.map((optn) => ({
                        value: optn.id,
                        label: optn.name,
                      }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={selectedDepartmentSingle}
                      onChange={handleChangeDept}
                      placeholder="Department Name"
                    />

                    <span style={{ color: "red" }}>
                      {selectedDepartmentErr.length > 0
                        ? selectedDepartmentErr
                        : ""}
                    </span>

                    <Select
                      className="mt-16"
                      classes={classes}
                      styles={selectStyles}
                      options={processList.map((optn) => ({
                        value: optn.id,
                        label: optn.process_name,
                      }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={selectedProcess}
                      onChange={handleChangeProcess}
                      placeholder="Process Name"
                    />

                    <span style={{ color: "red" }}>
                      {selectedProcessErr.length > 0 ? selectedProcessErr : ""}
                    </span>

                    <TextField
                      className="mt-16"
                      label="Remark"
                      name="remark"
                      value={remark}
                      onChange={(e) => setRemark(e.target.value)}
                      variant="outlined"
                      fullWidth
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
                    >
                      SAVE
                    </Button>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default TransferHm;

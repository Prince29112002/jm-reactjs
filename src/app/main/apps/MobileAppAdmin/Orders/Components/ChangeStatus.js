import React, { useState, useEffect } from "react";

import Select, { createFilter } from "react-select";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import Modal from "@material-ui/core/Modal";
import { Icon, IconButton, TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import clsx from "clsx";
import Icones from "assets/fornt-icons/Mainicons";

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 700,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
}));


const ChangeStatus = (props) => {
  const [open, setOpen] = useState(true);
  const [modalStyle] = useState(getModalStyle);
  const theme = useTheme();
  const dispatch = useDispatch();

  const [userNmErr, setUserNmErr] = useState("");
  const [statusErr, setStatusErr] = useState("");
  const [statusData, setStatusData] = useState([]);
  const [oldorder, setoldorder] = useState("");
  const [oldremark, setoldremark] = useState("");
  const [orderHis, setOrderHis] = useState([]);
  const classes = useStyles();

  function changeStatus(value) {
    setoldorder(value);
    setStatusErr("");
  }

  const handleClose = () => {
    setOpen(false);
    props.modalColsed(); //closing from here so we can change the view to first one
    // window.location.reload();
  };

  const validateAndSubmit = (evt) => {
    evt.preventDefault();
    if (statusValidation() && NameValidation()) {
      callChangeStatusApi();
    }
  };
  function handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    setoldremark(value);

    if (name === "remark") {
      setoldremark(value);
      setUserNmErr("");
    }
  }

  function NameValidation() {
    if (oldremark === "") {
      setUserNmErr("Please Enter Remark");
      return false;
    }
    return true;
  }

  function statusValidation() {
    if (oldorder === "") {
      setStatusErr("Please Select Status");
      return false;
    }
    return true;
  }

  function Statuslist() {
    axios
      .get(Config.getCommonUrl() + "api/mobileOrderStatusLogs/statusDropDown")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const key = Object.values(response.data.data);
          const values = Object.keys(response.data.data);
          let temp = [];
          for (let i = 0; i < values.length; i++) {
            temp.push({
              value: values[i],
              label: key[i],
            });
          }
          setStatusData(temp);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/mobileOrderStatusLogs/statusDropDown",
        });
      });
  }

  function orderlist() {
    axios
      .get(
        Config.getCommonUrl() +
          `api/mobileOrderStatusLogs/get/history/${props.orderId}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setOrderHis(response.data.data.rows);
          setoldorder({
            value : response.data.data.rows[0].order_status,
            label : response.data.data.rows[0].order_status_text
          });
          setoldremark(response.data.data.rows[0].remark);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/mobileOrderStatusLogs/get/history/${props.orderId}`,
        });
      });
  }
  function callChangeStatusApi() {

    const body = {
      order_status: oldorder.value,
      order_id: props.orderId,
      remark: oldremark,
    }

    axios
      .put(Config.getCommonUrl() + "api/mobileOrderStatusLogs/change-status", body)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true && response.status === 200) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          handleClose();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/mobileOrderStatusLogs/change-status",
          body: body,
        });
      });
  }

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
    Statuslist();
    orderlist();
    return () => {
      console.log("cleaned up");
    };
  }, []);


  return (
    <div>
      <Modal
        // disableBackdropClick
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            // handleClose();
            setOpen(false);
            props.handleModalClose();
          }
        }}
      >
        <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
          <h5 className="popup-head p-20">
          {`Change Status  (${props.orderNumView})`}

            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={() => {
                setOpen(false);
                props.handleModalClose();
              }}
            >
              <Icon className="">
                <img src={Icones.cross} alt="" />
              </Icon>
            </IconButton>
          </h5>
          <div className="flex flex-row justify-between w-full ">
            <div className="w-2/4 m-5 ">
              <h4 className="font-bolds">Status:</h4>
              <Select
                filterOption={createFilter({ ignoreAccents: false })}
                className="mb-10 mt-1 "
                classes={classes}
                styles={selectStyles}
                options={statusData}
                value={oldorder}
                onChange={changeStatus}
                placeholder={oldorder}
              />
              <span style={{ color: "red" }}>
                {statusErr.length > 0 ? statusErr : ""}
              </span>

              <TextField
                className="mb-10 "
                placeholder="Remark"
                name="remark"
                autoFocus
                value={oldremark}
                onChange={(e) => handleInputChange(e)}
                variant="outlined"
                fullWidth
                multiline
                minRows={6}
                maxrows={6}
              />
              <span style={{ color: "red" }}>
                {userNmErr.length > 0 ? userNmErr : ""}
              </span>
            </div>

            <div className="w-2/4 m-5 ">
              <h4 className="font-bolds">Order History:</h4>
              <div
                style={{
                  height: "calc(60vh)",
                  overflowX: "hidden",
                  overflowY: "auto",
                }}
              >
                {orderHis.map((element, index) => (
                  <ul
                    className="list-none mt-1 mb-5 border-black border-1"
                    style={{ borderRadius: "7px" }}
                  >
                    <li>
                      <span className="p-1 text-16 font-bold">
                        {" "}
                        Last Update:
                      </span>
                      {element.created_at}
                    </li>
                    <li>
                      <span className="p-1 text-16 font-bold">
                        Order Status:
                      </span>
                      {element.order_status_text}
                    </li>
                    <li className="overflow-x-scroll overflow-y-hidden">
                      <span className="p-1 text-16 font-bold"> Remarks:</span>
                      {element.remark}
                    </li>
                  </ul>
                ))}
              </div>
            </div>
          </div>
          <div className="model-actions flex flex-row pb-20">
            <Button
              variant="contained"
              className="w-128 mx-auto mt-20 popup-cancel"
              onClick={() => {
                setOpen(false);
                props.handleModalClose();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              className="w-128 mx-auto mt-20 popup-save"
              onClick={(e) => validateAndSubmit(e)}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChangeStatus;

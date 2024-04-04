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
import History from "@history";
import OtpInput from 'react-otp-input';
import { flatMap } from "lodash";

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
        width: 900,
        zIndex: 1,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        // padding: theme.spacing(4),
        outline: "none",
    },
    paperr: {
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
        backgroundColor: "cornflowerblue",
        color: "white",
    },
}));

const ViewStatus = (props) => {
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
    const [status, setStatus] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [otp, setOtp] = useState('');

    function changeStatus(value) {
        setoldorder(value);
        setStatusErr("");
    }
    const Status = [
        { id: 1, label: "New complain" },
        { id: 2, label: "Pendding" },
        { id: 3, label: "In-process" },
        { id: 4, label: "Solve" },
        { id: 5, label: "Cancel by company" },
        { id: 6, label: "Cancel by party" },

    ]
    const handleClose = () => {
        setOpen(false);
        props.modalColsed(); //closing from here so we can change the view to first one
        // window.location.reload();
    };

    const validateAndSubmit = (evt) => {
        evt.preventDefault();
        console.log(status);
        if (status.value === 4) {
            setModalOpen(true)
            // callChangeStatusApi();
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
    function handleSubmit(ev) {
        ev.preventDefault();
        console.log("0000");
        setModalOpen(false)
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
                    console.log(values);
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
                        value: response.data.data.rows[0].order_status,
                        label: response.data.data.rows[0].order_status_text
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
    function handleChangeStatus(event) {
        setStatus(event);
        setStatusErr("");
    }
    function handleModalClose(call) {
        setModalOpen(false)
    }
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
                <div style={modalStyle} className={classes.paper}>
                    <h5
                        className="p-5"
                        style={{
                            textAlign: "center",
                            backgroundColor: "black",
                            color: "white",
                        }}
                    >
                        {`Change Status  (${props.orderNumView})`}
                        <IconButton
                            style={{ position: "absolute", top: "0", right: "0" }}
                            onClick={() => {
                                setOpen(false);
                                props.handleModalClose();
                            }}
                        >
                            <Icon style={{ color: "white" }}>close</Icon>
                        </IconButton>
                    </h5>
                    <div className="flex flex-row justify-between w-full ">
                        <div className="w-2/4 m-5 ">
                            <h4 className="font-bolds">Status:</h4>
                            <Select
                                placeholder={<div>Select Status</div>}
                                className=" mr-2"
                                styles={{ selectStyles }}
                                options={Status.map((group) => ({
                                    value: group.id,
                                    label: group.label,
                                    key: group.id
                                }))}
                                filterOption={createFilter({ ignoreAccents: false })}
                                value={status}
                                onChange={(e) => handleChangeStatus(e)}

                            />

                            <span style={{ color: "red" }}>
                                {statusErr.length > 0 ? statusErr : ""}
                            </span>

                            <TextField
                                className="textarea-input-dv mb-10 mt-16"
                                label="Description"
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
                            <h4 className="font-bolds">Complain History:</h4>
                            <div
                                style={{
                                    height: "calc(60vh)",
                                    overflowX: "hidden",
                                    overflowY: "auto",
                                }}
                            >
                                {/* {orderHis.map((element, index) => ( */}
                                <ul className="list-none mt-5 mb-5 border-black" style={{ width: "330px", background: "#faebd7", borderRadius: "5px" }} key={1}>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            {" "}
                                            Last Update:
                                        </span>
                                        {/* {element.created_at} */}
                                        23-9-2023

                                    </li>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            Order Status:
                                        </span>
                                        {/* {element.order_status_text} */}
                                        In-process
                                    </li>
                                    <li className="overflow-x-scroll overflow-y-hidden">
                                        <span className="p-1 text-16 font-bold"> Remarks:</span>
                                        {/* {element.remark} */}
                                        not set propar design
                                    </li>
                                </ul>
                                <ul className="list-none mt-5 mb-5 border-black" style={{ width: "330px", background: "#f5f5dc", borderRadius: "5px", marginLeft: "auto" }} key={1}>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            {" "}
                                            Last Update:
                                        </span>
                                        {/* {element.created_at} */}
                                        23-9-2023

                                    </li>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            Order Status:
                                        </span>
                                        {/* {element.order_status_text} */}
                                        In-process
                                    </li>
                                    <li className="overflow-x-scroll overflow-y-hidden">
                                        <span className="p-1 text-16 font-bold"> Remarks:</span>
                                        {/* {element.remark} */}
                                        not set propar design
                                    </li>
                                </ul>
                                <ul className="list-none mt-5 mb-5 border-black" style={{ width: "330px", background: "#faebd7", borderRadius: "5px" }} key={1}>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            {" "}
                                            Last Update:
                                        </span>
                                        {/* {element.created_at} */}
                                        23-9-2023

                                    </li>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            Order Status:
                                        </span>
                                        {/* {element.order_status_text} */}
                                        In-process
                                    </li>
                                    <li className="overflow-x-scroll overflow-y-hidden">
                                        <span className="p-1 text-16 font-bold"> Remarks:</span>
                                        {/* {element.remark} */}
                                        not set propar design
                                    </li>
                                </ul>
                                <ul className="list-none mt-5 mb-5 border-black" style={{ width: "330px", background: "#f5f5dc", borderRadius: "5px", marginLeft: "auto" }} key={1}>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            {" "}
                                            Last Update:
                                        </span>
                                        {/* {element.created_at} */}
                                        23-9-2023

                                    </li>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            Order Status:
                                        </span>
                                        {/* {element.order_status_text} */}
                                        In-process
                                    </li>
                                    <li className="overflow-x-scroll overflow-y-hidden">
                                        <span className="p-1 text-16 font-bold"> Remarks:</span>
                                        {/* {element.remark} */}
                                        not set propar design
                                    </li>
                                </ul>
                                <ul className="list-none mt-5 mb-5 border-black" style={{ width: "330px", background: "#faebd7", borderRadius: "5px" }} key={1}>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            {" "}
                                            Last Update:
                                        </span>
                                        {/* {element.created_at} */}
                                        23-9-2023

                                    </li>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            Order Status:
                                        </span>
                                        {/* {element.order_status_text} */}
                                        In-process
                                    </li>
                                    <li className="overflow-x-scroll overflow-y-hidden">
                                        <span className="p-1 text-16 font-bold"> Remarks:</span>
                                        {/* {element.remark} */}
                                        not set propar design
                                    </li>
                                </ul>
                                <ul className="list-none mt-5 mb-5 border-black" style={{ width: "330px", background: "#f5f5dc", borderRadius: "5px", marginLeft: "auto" }} key={1}>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            {" "}
                                            Last Update:
                                        </span>
                                        {/* {element.created_at} */}
                                        23-9-2023

                                    </li>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            Order Status:
                                        </span>
                                        {/* {element.order_status_text} */}
                                        In-process
                                    </li>
                                    <li className="overflow-x-scroll overflow-y-hidden">
                                        <span className="p-1 text-16 font-bold"> Remarks:</span>
                                        {/* {element.remark} */}
                                        not set propar design
                                    </li>
                                </ul>
                                <ul className="list-none mt-5 mb-5 border-black" style={{ width: "330px", background: "#faebd7", borderRadius: "5px" }} key={1}>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            {" "}
                                            Last Update:
                                        </span>
                                        {/* {element.created_at} */}
                                        23-9-2023

                                    </li>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            Order Status:
                                        </span>
                                        {/* {element.order_status_text} */}
                                        In-process
                                    </li>
                                    <li className="overflow-x-scroll overflow-y-hidden">
                                        <span className="p-1 text-16 font-bold"> Remarks:</span>
                                        {/* {element.remark} */}
                                        not set propar design
                                    </li>
                                </ul>
                                <ul className="list-none mt-5 mb-5 border-black" style={{ width: "330px", background: "#f5f5dc", borderRadius: "5px", marginLeft: "auto" }} key={1}>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            {" "}
                                            Last Update:
                                        </span>
                                        {/* {element.created_at} */}
                                        23-9-2023

                                    </li>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            Order Status:
                                        </span>
                                        {/* {element.order_status_text} */}
                                        In-process
                                    </li>
                                    <li className="overflow-x-scroll overflow-y-hidden">
                                        <span className="p-1 text-16 font-bold"> Remarks:</span>
                                        {/* {element.remark} */}
                                        not set propar design
                                    </li>
                                </ul>
                                <ul className="list-none mt-5 mb-5 border-black" style={{ width: "330px", background: "#faebd7", borderRadius: "5px" }} key={1}>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            {" "}
                                            Last Update:
                                        </span>
                                        {/* {element.created_at} */}
                                        23-9-2023

                                    </li>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            Order Status:
                                        </span>
                                        {/* {element.order_status_text} */}
                                        In-process
                                    </li>
                                    <li className="overflow-x-scroll overflow-y-hidden">
                                        <span className="p-1 text-16 font-bold"> Remarks:</span>
                                        {/* {element.remark} */}
                                        not set propar design
                                    </li>
                                </ul>
                                <ul className="list-none mt-5 mb-5 border-black" style={{ width: "330px", background: "#f5f5dc", borderRadius: "5px", marginLeft: "auto" }} key={1}>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            {" "}
                                            Last Update:
                                        </span>
                                        {/* {element.created_at} */}
                                        23-9-2023

                                    </li>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            Order Status:
                                        </span>
                                        {/* {element.order_status_text} */}
                                        In-process
                                    </li>
                                    <li className="overflow-x-scroll overflow-y-hidden">
                                        <span className="p-1 text-16 font-bold"> Remarks:</span>
                                        {/* {element.remark} */}
                                        not set propar design
                                    </li>
                                </ul>
                                <ul className="list-none mt-5 mb-5 border-black" style={{ width: "330px", background: "#faebd7", borderRadius: "5px" }} key={1}>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            {" "}
                                            Last Update:
                                        </span>
                                        {/* {element.created_at} */}
                                        23-9-2023

                                    </li>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            Order Status:
                                        </span>
                                        {/* {element.order_status_text} */}
                                        In-process
                                    </li>
                                    <li className="overflow-x-scroll overflow-y-hidden">
                                        <span className="p-1 text-16 font-bold"> Remarks:</span>
                                        {/* {element.remark} */}
                                        not set propar design
                                    </li>
                                </ul>
                                <ul className="list-none mt-5 mb-5 border-black" style={{ width: "330px", background: "#f5f5dc", borderRadius: "5px", marginLeft: "auto" }} key={1}>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            {" "}
                                            Last Update:
                                        </span>
                                        {/* {element.created_at} */}
                                        23-9-2023

                                    </li>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            Order Status:
                                        </span>
                                        {/* {element.order_status_text} */}
                                        In-process
                                    </li>
                                    <li className="overflow-x-scroll overflow-y-hidden">
                                        <span className="p-1 text-16 font-bold"> Remarks:</span>
                                        {/* {element.remark} */}
                                        not set propar design
                                    </li>
                                </ul>
                                <ul className="list-none mt-5 mb-5 border-black" style={{ width: "330px", background: "#faebd7", borderRadius: "5px" }} key={1}>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            {" "}
                                            Last Update:
                                        </span>
                                        {/* {element.created_at} */}
                                        23-9-2023

                                    </li>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            Order Status:
                                        </span>
                                        {/* {element.order_status_text} */}
                                        In-process
                                    </li>
                                    <li className="overflow-x-scroll overflow-y-hidden">
                                        <span className="p-1 text-16 font-bold"> Remarks:</span>
                                        {/* {element.remark} */}
                                        not set propar design
                                    </li>
                                </ul>
                                <ul className="list-none mt-5 mb-5 border-black" style={{ width: "330px", background: "#f5f5dc", borderRadius: "5px", marginLeft: "auto" }} key={1}>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            {" "}
                                            Last Update:
                                        </span>
                                        {/* {element.created_at} */}
                                        23-9-2023

                                    </li>
                                    <li>
                                        <span className="p-1 text-16 font-bold">
                                            Order Status:
                                        </span>
                                        {/* {element.order_status_text} */}
                                        In-process
                                    </li>
                                    <li className="overflow-x-scroll overflow-y-hidden">
                                        <span className="p-1 text-16 font-bold"> Remarks:</span>
                                        {/* {element.remark} */}
                                        not set propar design
                                    </li>
                                </ul>
                                {/* ))} */}
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="contained"
                        color="primary"
                        className="w-full mx-auto mt-16"
                        style={{
                            backgroundColor: "#4caf50",
                            border: "none",
                            color: "white",
                        }}
                        onClick={(e) => validateAndSubmit(e)}
                    >
                        Save
                    </Button>
                </div>
            </Modal>
            <Modal
                // disableBackdropClick
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={modalOpen}
                onClose={(_, reason) => {
                    if (reason !== "backdropClick") {
                        handleModalClose(false);
                    }
                }}

            >
                <div style={modalStyle} className={classes.paperr}>
                    <h5
                        className="p-5"
                        style={{
                            textAlign: "center",
                            backgroundColor: "black",
                            color: "white",
                        }}
                    >
                        {"Enter OTP"}
                        <IconButton
                            style={{ position: "absolute", top: "0", right: "0" }}
                            onClick={() => handleModalClose(false)}
                        >
                            <Icon style={{ color: "white" }}>close</Icon>
                        </IconButton>
                    </h5>
                        <form
                            onSubmit={handleSubmit}
                        >
                    <div className="flex w-full flex-col otpInput">
                    <TextField
                          label="Phone"
                          name="number"
                        //   value={element.number || ""}
                        //   error={
                        //     element.errors !== undefined
                        //       ? element.errors.number
                        //         ? true
                        //         : false
                        //       : false
                        //   }
                        //   helperText={
                        //     element.errors !== undefined
                        //       ? element.errors.number
                        //       : ""
                        //   }
                        //   onChange={(e) => handleContactChange(index, e)}
                          variant="outlined"
                          fullWidth
                        />
                            <OtpInput
                                containerStyle={"w-flex w-full justify-center"}
                                inputStyle={"border-b-2 border-b-primary-light w-full flex px-4 mr-3 text-base outline-none"}
                                value={otp}
                                onChange={setOtp}
                                numInputs={6}
                                inputType="tel"
                                renderSeparator={<span></span>}
                                renderInput={(props) => <input {...props} />}
                                shouldAutoFocus={true}
                            />

                            <Button
                                variant="contained"
                    type="submit"
                                color="primary"
                                className="w-full mx-auto mt-16"
                                style={{
                                    backgroundColor: "#4caf50",
                                    border: "none",
                                    color: "white",
                                }}
                            // onClick={(e) => setModalOpen(false)}
                            >
                                ok
                            </Button>
                    </div>
                        </form>
                </div>
            </Modal>
        </div>
    );
};

export default ViewStatus;

import React, { useState, useEffect } from "react";
import { Icon, IconButton } from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Modal from "@material-ui/core/Modal";
import LoaderPopup from "app/main/Loader/LoaderPopup";
import { useReactToPrint } from "react-to-print";
import { VoucherPopupPrintCom } from "../../VoucherPopupPrintCom/VoucherPopupPrintCom";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    // width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  table: {
    // minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
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

const VoucherPopup = (props) => {
  console.log(props);
  console.log(props.data.voucher_no);
  const [open, setOpen] = React.useState(props.openFlag);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [printObj, setPrintObj] = useState([]);
  const [printData, setPrintData] = useState([]);
  const [lotData, setLotData] = useState([]);
  const [isView, setIsView] = useState(false); //for view Only
  const [voucherNumber, setVoucherNumber] = useState("");

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 5000);
    }
  }, [loading]);

  useEffect(() => {
    console.log("data", props.data);

    //eslint-disable-next-line
  }, [props]);

  const handleClose = () => {
    console.log("handleClose");
    setOpen(false);
    props.setOpenFlag();
  };

  function viewHandler() {
    // console.log("viewHandler", id);
    // props.history.push("/dashboard/sales/addsalejobwork", {
    //     id: id
    // });
  }

  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);

  const handleAfterPrint = () => {
    console.log("`onAfterPrint` called", isView); // tslint:disable-line no-console
    checkAndReset();
  };

  function checkAndReset() {
    if (isView === false) {
      console.log("cond true", isView);
      // resetForm();
    }
  }
  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    // setLoading(true);
    // setText("Loading new text...");
    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;
      setTimeout(() => {
        // setLoading(false);
        // setText("New, Updated Text!");
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

  const handlePrint = () => {
    PostStockListPrintData();
    setTimeout(() => {
      printHandler();
    }, 1000);
  };

  const printHandler = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Stock-list_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  function PostStockListPrintData() {
    const body = {
      voucher_number: props.data.voucher_no,
      stock_ids: props.data.id,
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

                        {open === true &&
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
                                <div style={modalStyle} className={clsx(classes.paper,"rounded-8")}>
                                    {loading && <LoaderPopup />}
                                    <h5 style={{height:"50px"}}
                                        className="popup-head p-5"
                                        // style={{
                                        //     textAlign: "center",
                                        //     backgroundColor: "black",
                                        //     color: "white",
                                        // }}
                                    >
                                        {props.data.voucher_no}
                                        <IconButton
                                            style={{ position: "absolute", top: "0", right: "0" }}
                                            onClick={handleClose}
                                        ><Icon style={{ color: "white" }}>
                                                close
                                            </Icon></IconButton>
                                    </h5>
                                    <div className="p-5 pl-16 pr-16 custom_stocklist_dv">

                                        <Table className={classes.table}>
                                            <TableHead>
                                                <TableRow>

                                                    <TableCell
                                                        className={classes.tableRowPad}
                                                        align="center"
                                                    >
                                                        View
                                                    </TableCell>
                                                    <TableCell
                                                        className={classes.tableRowPad}
                                                        align="center"
                                                        style={{width:"13%"}}
                                                    >
                                                        Print
                                                    </TableCell>
                                                    <TableCell
                                                        className={classes.tableRowPad}
                                                        align="center"
                                                    >
                                                        Trans Details
                                                    </TableCell>
                                                    <TableCell
                                                        className={classes.tableRowPad}
                                                        align="center"
                                                        style={{textAlign:"center"}}
                                                    >
                                                        Destination Details
                                                    </TableCell>

                                                </TableRow>
                                            </TableHead>
                                            <TableBody>

                                                <TableRow>
                                                    <TableCell
                                                        align="center"
                                                        className={classes.tableRowPad}
                                                    >
                                                        <IconButton
                                                            style={{ padding: "0" }}
                                                            onClick={(ev) => {
                                                                ev.preventDefault();
                                                                ev.stopPropagation();
                                                                viewHandler();
                                                            }}
                                                        >
                                                            <Icon
                                                                // className="mr-8"
                                                                style={{ color: "dodgerblue" }}
                                                            >
                                                                visibility
                                                            </Icon>
                                                        </IconButton>
                                                    </TableCell>

                                                    <TableCell
                                                        align="center"
                                                        className={classes.tableRowPad}
                                                    >
                                                        <IconButton
                                                            style={{ padding: "0" }}
                                                            onClick={(ev) => {
                                                                ev.preventDefault();
                                                                ev.stopPropagation();
                                                                handlePrint();
                                                            }}
                                                        >
                                                            <Icon
                                                                // className="mr-8"
                                                                style={{ color: "dodgerblue" }}
                                                            >
                                                                print
                                                            </Icon>
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell
                                                        align="left"
                                                        className={classes.tableRowPad}
                                                    >
                                                        Doc Type :
                                                       <br /> Doc No :{" "}
                                                          {props.data.transfer_voucher
                                                             ? props.data.transfer_voucher
                                                             : "-"}
                                                      <br /> Doc Date :{" "}
                                                      {props.data.doc_date ? props.data.doc_date : "-"}
                                                      <br /> Remarks :{" "}
                                                     {props.data.remarks ? props.data.remarks : "-"}
                                                       <br /> Status :

                                                    </TableCell>
                                                    <TableCell
                                                        // align="left"
                                                        className={classes.tableRowPad}
                                                        style={{textAlign:"center"}}
                                                    >
                                                        Department :
                                                        {props.data.source_department
                                                         ? props.data.source_department
                                                       : "-"}
                                                    </TableCell>


                                                </TableRow>

                                            </TableBody>
                                        </Table>

                                    </div>
                                </div>
                            </Modal>
                        }
                    </div>
                </div>
            </FuseAnimate>

            <div style={{ display: "none" }}>
              <VoucherPopupPrintCom
                   ref={componentRef}
                   printObj={printObj}
                   printData={printData}
                  StockType={props.stockType}
        />
      </div>

        </div>
    );

}

export default VoucherPopup;
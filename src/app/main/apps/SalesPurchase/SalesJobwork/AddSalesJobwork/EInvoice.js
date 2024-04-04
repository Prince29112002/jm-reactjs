import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Icon, IconButton } from "@material-ui/core";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button, TextField } from "@material-ui/core";
import Axios from "axios";
import { useDispatch } from "react-redux";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
// import { callFileUploadApi } from "./DocumentUpload";
import LoaderPopup from "app/main/Loader/LoaderPopup";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import axios from "axios";

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
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
  },
  //   tableheader: {
  //     display: "inline-block",
  //     textAlign: "center",
  //   },
  table: {
    // minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
  cancle: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "red",
    color: "white",
  },
}));

function EInvoice(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [docFile, setDocFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [envoiceAlert, setEnvoiceAlert] = useState(false);

  const dispatch = useDispatch();

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  useEffect(() => {
    // getheroID(props.id)
    //  console.log(props.id,"//////");
  }, []);

  function getheroID() {
    // console.log(id);
    setLoading(true);

    const body = { id: props.id.id };
    axios
      .post(Config.getCommonUrl() + "api/gstHero/jobwork/invoice", body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setOpen(false);
          {
            props.handleClose();
          }
          setLoading(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/gstHero/jobwork/invoice",
          body: body,
        });
        setLoading(false);
      });
  }
  function getPDF() {
    console.log(props.id.id);
    const body = { id: props.id.id };
    axios
      .post(Config.getCommonUrl() + "api/gstHero/invoice/jobwork/pdf", body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          window.open(response.data.data.pdf_url, "_blank");
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/gstHero/invoice/jobwork/pdf",
          body: body,
        });
      });
  }
  function getcancel() {
    console.log(props.InvoiceIRN);
    setLoading(true);

    const body = { irn_number: props.InvoiceIRN };
    axios
      .post(Config.getCommonUrl() + "api/gstHero/invoice/cancel", body)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/gstHero/invoice/cancel",
          body: body,
        });
        setLoading(false);
      });
  }
  function handleCloseEenvoiceModal() {
    setEnvoiceAlert(false);
  }
  function handleGenerateEenvoice() {
    getheroID();
    setEnvoiceAlert(false);
  }
  return (
    <>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.open}
        onClose={(_, reason) => {
          // console.log("onClose", reason);//should be closed on esc key, not on outside click
          if (reason !== "backdropClick") {
            props.handleClose();
          }
        }}
      >
        <div id="modesize-dv" style={modalStyle} className={classes.paper}>
          <h5
            className="p-5"
            style={{
              textAlign: "center",
              backgroundColor: "black",
              color: "white",
            }}
          >
            E-INVOICE
            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={props.handleClose}
            >
              <Icon style={{ color: "white" }}>close</Icon>
            </IconButton>
          </h5>
          {loading && <LoaderPopup />}

          <div
            className="pb-5 pl-16 pr-16 mt-10"
            style={{ maxHeight: "500px", overflow: "scroll" }}
          >
            {props.flag == 1 && props.isgenerate == 0 ? (
              <MaUTable className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableRowPad}>Date</TableCell>
                    <TableCell className={classes.tableRowPad}>
                      IRN number
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell className={classes.tableRowPad}>
                      {props.InvoiceDate}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {props.InvoiceIRN}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {/* <a
                        target="_blank"
                        href={row.docUrl}
                        download
                      >
                        <Icon style={{ color: "black" }}>get_app</Icon>
                      </a> */}
                      <Button
                        variant="contained"
                        className={classes.button}
                        size="small"
                        onClick={(event) => {
                          //   setDefaultView(btndata.id);
                          //   setIsEdit(false);
                          getPDF();
                        }}
                      >
                        PDF
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.button}
                        size="small"
                        onClick={(event) => {
                          //   setDefaultView(btndata.id);
                          //   setIsEdit(false);
                        }}
                      >
                        Excel
                      </Button>
                      <Button
                        variant="contained"
                        className={classes.cancle}
                        size="small"
                        onClick={(event) => {
                          setOpen(true);
                          // getcancel()
                        }}
                      >
                        Cancel E-Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </MaUTable>
            ) : (
              <Button
                variant="contained"
                //  className={classes.cancle}
                style={{
                  marginInline: "auto",
                  display: "block",
                  backgroundColor: "limegreen",
                }}
                size="small"
                onClick={(event) => {
                  //  setOpen(true)
                  // getcancel()
                  //  getheroID()
                  setEnvoiceAlert(true);
                }}
              >
                {props.isgenerate == 1 ? " RE-Generate" : "E-Invoice Generate"}
              </Button>
            )}
          </div>
        </div>
      </Modal>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Alert!!!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to cancel this E-Invoice from GST Portal ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={(event) => {
              setOpen(true);
              getcancel();
            }}
            color="primary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={envoiceAlert}
        onClose={handleCloseEenvoiceModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Alert!!!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to Generate E-Invoice?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEenvoiceModal} color="primary">
            Cancel
          </Button>
          <Button
            onClick={(event) => {
              handleGenerateEenvoice();
              // getcancel()
            }}
            color="primary"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EInvoice;

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
import { callFileUploadApi } from "./DocumentUpload";
import LoaderPopup from "app/main/Loader/LoaderPopup";
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
}));

function ViewDocModal(props) {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [docFile, setDocFile] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function callDeleteDocument() {
    setOpen(false);
    setLoading(true)
    Axios
      .delete(
        Config.getCommonUrl() + "api/salespurchasedocs/" + selectedIdForDelete
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          props.updateDocument(selectedIdForDelete)
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setSelectedIdForDelete("");
          setLoading(false)
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setLoading(false)
        }
      })
      .catch((error) => {
        setLoading(false)
        handleError(error, dispatch, { api: "api/salespurchasedocs/" + selectedIdForDelete })

      });
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }


  useEffect(() => {

    if (docFile) {
      setLoading(true)
      callFileUploadApi(docFile, props.purchase_flag, props.purchase_flag_id)
        .then((response) => {
          console.log(response)
          if (response.data.success) {
            const arrData = response.data.data;
            dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
            props.concateDocument(arrData)
            setDocFile("")
            setLoading(false)
          } else {
            dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
            setLoading(false)
          }
        })
        .catch((error) => {
          setLoading(false)
          handleError(error, dispatch, { api: "api/salespurchasedocs/upload", body: docFile })
        })
    }
  }, [docFile])


  return (
    <>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            props.handleClose();
          }
        }}
      >
        <div id="modesize-dv" style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
          <h5
            className="popup-head p-5"
         
          >
            Document list
            <IconButton
              style={{ position: "absolute", top: -2, right: 0 }}
              onClick={props.handleClose}
            >
                 <Icon> <img src={Icones.cross} alt="" /> </Icon>
            </IconButton>
          </h5>
          

          <p 
              className="ml-16 mt-16"
              >Upload document</p>
          {!props.viewPopup &&
            <TextField
              className="ml-16 mb-16  uploadDoc"
              // label="Upload Document"
              style={{ width: '30%' }}
              type="file"
              inputProps={{
                multiple: true
              }}
              onChange={(e) => setDocFile(e.target.files)}
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          }

          <div className="pb-5 pl-16 pr-16" style={{ maxHeight: "500px", overflow: 'scroll' }}>
            <MaUTable className={classes.table}>
            {loading && <LoaderPopup />}
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableRowPad}>No</TableCell>
                  <TableCell className={classes.tableRowPad}>File Name</TableCell>
                  <TableCell className={classes.tableRowPad}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.documentList.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className={classes.tableRowPad}>{i + 1}</TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.original_file_name}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {/* <a
                        target="_blank"
                        href={row.docUrl}
                        download
                      >
                        <Icon style={{ color: "black" }}>get_app</Icon>
                      </a> */}
                      <IconButton
                        style={{ padding: "0" }}
                        onClick={(ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          window.open(row.docUrl, '_blank');
                        }}
                      >
                       <Icon className="mr-8 download-icone" style={{ color: "dodgerblue" }}>
                                                        <img src={Icones.download_green} alt="" />
                                                    </Icon>
                      </IconButton>

                      {!props.viewPopup &&
                        <IconButton
                          style={{ padding: "0" }}
                          onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            deleteHandler(row.id);
                          }}
                        >
                         <Icon className="mr-8 delete-icone">
                                    <img src={Icones.delete_red} alt="" />
                                  </Icon>
                        </IconButton>
                      }

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </MaUTable>
          </div>
        </div>
      </Modal>
      <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" className="popup-delete">
                {"Alert!!!"}
                <IconButton
                  style={{
                    position: "absolute",
                    marginTop: "-5px",
                    right: "15px",
                  }}
                  onClick={handleClose}
                >
                  <img
                    src={Icones.cross}
                    className="delete-dialog-box-image-size"
                    alt=""
                  />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this record?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  className="delete-dialog-box-cancle-button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteDocument}
                  className="delete-dialog-box-delete-button"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
    </>
  );
}

export default ViewDocModal;

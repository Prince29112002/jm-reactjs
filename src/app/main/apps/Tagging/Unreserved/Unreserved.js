import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from "@material-ui/core/Paper";
import { TextField } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import History from "@history";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"

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
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    minWidth: 650,
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

const Unreserved = (props) => {

  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  // const theme = useTheme();
  const dispatch = useDispatch();

  const [addBarCode, setAddBarcode] = useState("");
  const [addBarCodeErrTxt, setAddBarCodeErrTxt] = useState("");

  const [remark, setRemark] = useState("");
  const [remarkErrTxt, setRemarkErrTxt] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();
    History.push('/dashboard/stock')
  }

  useEffect(() => {
    NavbarSetting('Tagging', dispatch)
    //eslint-disable-next-line
  }, [])

  const handleClose = () => {
    setOpen(false)
    History.push('/dashboard/stock')
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 pt-20">
            <Grid
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
              className="pb-10"
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Tagging
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>
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
                <div style={modalStyle} className={clsx(classes.paper, "rounded-8 w-512")}>
                  <h5
                    className="popup-head mb-10"
                    style={{
                      padding: "14px",
                    }}
                  >
                    Unreserve Barcode
                    <IconButton
                      style={{ position: "absolute", top: "0", right: "0" }}
                      onClick={handleClose}
                    ><Icon style={{ color: "white" }}>
                        close
                      </Icon></IconButton>
                  </h5>
                  <div className="p-5 pl-24 pr-24">
                    <label>Add barcode</label>
                    <TextField
                      className="mt-1 mb-20"
                      placeholder="Enter barcode"
                      name="addbarcode"
                      value={addBarCode}
                      error={addBarCodeErrTxt.length > 0 ? true : false}
                      helperText={addBarCodeErrTxt}
                      // onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                    />
                    <label>Remark</label>
                    <TextField
                      className="mt-1 mb-20"
                      placeholder="Remark"
                      name="remark"
                      value={remark}
                      error={remarkErrTxt.length > 0 ? true : false}
                      helperText={remarkErrTxt}
                      // onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                    />
                    <div style={{ textAlign: "center" }} className="p-20">
                      <Button
                        variant="contained"
                        className="w-128 mx-auto popup-cancel"
                        aria-label="Register"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>

                      <Button
                        variant="contained"
                        className="w-160 mx-auto popup-save"
                        style={{ marginLeft: "20px" }}
                        aria-label="Register"
                        onClick={(e) => handleFormSubmit(e)}
                      >
                        Unreserve
                      </Button>
                    </div>
                  </div>
                </div>
              </Modal>
            }
            <div className="main-div-alll">
              <div className="m-16">
                <Paper className={classes.tabroot}>
                  <div className="table-responsive">
                    <MaUTable className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>Stock Code</TableCell>
                          <TableCell className={classes.tableRowPad}>Category</TableCell>
                          <TableCell className={classes.tableRowPad}>Purity</TableCell>
                          <TableCell className={classes.tableRowPad}>Pieces</TableCell>
                          <TableCell className={classes.tableRowPad}>Gross Weight</TableCell>
                          <TableCell className={classes.tableRowPad}>Stone Weight</TableCell>
                          <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
                          <TableCell className={classes.tableRowPad}>Transit</TableCell>
                          <TableCell className={classes.tableRowPad}>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>

                          </TableCell>
                          <TableCell className={classes.tableRowPad}>

                          </TableCell>
                          <TableCell className={classes.tableRowPad}>

                          </TableCell>
                          <TableCell className={classes.tableRowPad}>

                          </TableCell>
                          <TableCell className={classes.tableRowPad}>

                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </MaUTable>
                  </div>
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
}

export default Unreserved;
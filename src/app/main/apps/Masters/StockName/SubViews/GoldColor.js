import React, { useState, useEffect } from "react";
import { Icon, IconButton, InputBase } from "@material-ui/core";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import { TextField } from "@material-ui/core";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    // overflowX: "auto",
    // overflowY: "auto",
    // height: "90%",
  },
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
  },
  table: {
    minWidth: 650,
    tableLayout: "auto"
  },
  tableRowPad: {
    padding: 7,
  },
  inputBox: {
    marginTop: 8,
    padding: 8,
    fontSize: "12pt",
    border: "1px solid #CCCCCC",
    borderRadius: "7px !important",
    width: "300px",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "340px",
    height: "37px",
    color: "#242424",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter",
  },
  form: {
    marginTop: "3%",
    display: "contents",
  },
  submitBtn: {
    marginTop: 8,
    padding: 8,
    marginLeft: 15,
    border: "none",
    color: "white",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    cursor: "pointer",
  },
  search: {
    display: "flex",
    width: 400,
    border: "1px solid #cccccc",
    float: "right",
    height: "38px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
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

const GoldColor = (props) => {
  const [searchData, setSearchData] = useState("");
  const [GoldColor, setGoldColor] = useState("");
  const [goldColorErrTxt, setGoldColorErrTxt] = useState("");
  const dispatch = useDispatch();
  const [apiData, setApiData] = useState([]);
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [edtOpen, setEdtOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [editGoldColor, setEditGoldColor] = useState("");
  const [edtGoldColorErrTxt, setEdtGoldColorErrTxt] = useState("");

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (goldColorValidation()) {
      callAddGoldColorApi();
    }
  };

  function goldColorValidation() {
    var Regex = /^[a-zA-Z\s]*$/;
    if (!GoldColor || Regex.test(GoldColor) === false) {
      setGoldColorErrTxt("Please Enter Valid Gold Color");

      return false;
    }
    return true;
  }

  useEffect(() => {
    getGoldColor();

    //eslint-disable-next-line
  }, [dispatch]);

  function getGoldColor() {
    axios
      .get(Config.getCommonUrl() + "api/goldcolor")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/goldcolor" });
      });
  }

  function callAddGoldColorApi() {
    axios
      .post(Config.getCommonUrl() + "api/goldcolor", {
        name: GoldColor,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id
          setGoldColor("");
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          getGoldColor();
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
          api: "api/goldcolor",
          body: {
            name: GoldColor,
          },
        });
      });
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function handleEdtClose() {
    setEdtOpen(false);
    setSelectedIdForEdit("");
    setEditGoldColor("");
  }

  function editHandler(id, color) {
    setSelectedIdForEdit(id);
    setEditGoldColor(color);

    setEdtOpen(true);
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "edtGoldColor") {
      setEditGoldColor(value);
      setEdtGoldColorErrTxt("");
    }
  }

  const checkforUpdate = (evt) => {
    evt.preventDefault();
    // alert(`Submitting ${itemTypeName}`);
    if (edtGoldColorValidation()) {
      callEditGoldColorApi();
    }
  };

  function edtGoldColorValidation() {
    var Regex = /^[a-zA-Z\s]*$/;
    if (!editGoldColor || Regex.test(editGoldColor) === false) {
      // setEditStoneSize(true);
      setEdtGoldColorErrTxt("Please Enter Valid Gold Color");

      return false;
    }
    return true;
  }

  function callEditGoldColorApi() {
    axios
      .put(Config.getCommonUrl() + "api/goldcolor/" + selectedIdForEdit, {
        name: editGoldColor,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          setSelectedIdForEdit("");
          setEdtOpen(false);
          setEdtGoldColorErrTxt("");
          setEditGoldColor("");
          getGoldColor();
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
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
          api: "api/goldcolor/" + selectedIdForEdit,
          body: {
            name: editGoldColor,
          },
        });
      });
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function callDeleteStoneSizeApi() {
    axios
      .delete(Config.getCommonUrl() + "api/goldcolor/" + selectedIdForDelete)
      .then(function (response) {
        setOpen(false);
        if (response.data.success === true) {
          // selectedIdForDelete

          // const findIndex = apiData.findIndex(
          //   (a) => a.id === selectedIdForDelete
          // );

          // findIndex !== -1 && apiData.splice(findIndex, 1);
          getGoldColor();

          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setSelectedIdForDelete("");
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
          api: "api/goldcolor/" + selectedIdForDelete,
        });
      });
  }

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  return (
    <div className={clsx(classes.root, props.className)}>
      <div
        className="flex flex-col md:flex-row container"
      >
        <div className="flex flex-1 flex-col min-w-0">
          <div
            className="pb-16 flex flex-row justify-between"
            style={{ paddingTop: "40px" }}
          >
            <div>
              <form className={classes.form} onSubmit={handleSubmit}>
                <label> Add Gold Color </label>
                <br></br>
                <input
                  // {classes.item}
                  className={classes.inputBox}
                  type="text"
                  placeholder="Gold Color"
                  value={GoldColor}
                  onChange={(e) => {
                    setGoldColor(e.target.value);
                    setGoldColorErrTxt("");
                  }}
                />

                <button
                  id="btn-save"
                  className={clsx(classes.submitBtn, "allsubmit-btn")}
                  type="submit"
                  value="Save"
                >
                  Save
                </button>
              </form>
              {/* <button className={classes.submitBtn} onClick={exportHandler}>
              Export
            </button> */}
              <br></br>
              <span style={{ color: "red" }}>
                {goldColorErrTxt.length > 0 ? goldColorErrTxt : ""}
              </span>
            </div>
            <div
              style={{ borderRadius: "7px !important", marginTop: "-40px" }}
              component="form"
              className={clsx(classes.search)}
            >
              <InputBase
                className={classes.input}
                placeholder="Search"
                inputProps={{ "aria-label": "search" }}
                value={searchData}
                onChange={(event) => setSearchData(event.target.value)}
              />
              <IconButton
                type="submit"
                className={classes.iconButton}
                aria-label="search"
              >
                <Icon>
                  <img src={Icones.search_light_grey} alt="" />
                </Icon>
              </IconButton>
            </div>
          </div>

          <Paper
            className={clsx(
              classes.tabroot,
              "goldcolor_tabel_dv srockname-tabel-bdr"
            )}
          >
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableRowPad}>ID</TableCell>
                  <TableCell className={classes.tableRowPad} align="left">
                    Gold Color
                  </TableCell>
                  <TableCell className={classes.tableRowPad} align="left">
                    Action
                  </TableCell>

                  {/* <TableCell align="right">Fat&nbsp;(g)</TableCell>
                    <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                    <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {apiData
                  .filter((temp) =>
                    temp.name.toLowerCase().includes(searchData.toLowerCase())
                  )
                  .map((row) => (
                    <TableRow key={row.id}>
                      {/* component="th" scope="row" */}
                      <TableCell className={classes.tableRowPad}>
                        {row.id}
                      </TableCell>

                      <TableCell align="left" className={classes.tableRowPad}>
                        {row.name}
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        <IconButton
                          style={{ padding: "0" }}
                          onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            editHandler(row.id, row.name);
                          }}
                        >
                          <Icon className="mr-8 edit-icone">
                            <img src={Icones.edit} alt="" />
                          </Icon>
                        </IconButton>

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
                      </TableCell>
                      {/*<TableCell align="right">{row.carbs}</TableCell>
                      
                      <TableCell align="right">{row.protein}</TableCell> */}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </Paper>

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
                onClick={callDeleteStoneSizeApi}
                className="delete-dialog-box-delete-button"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>

          <Modal
            // disableBackdropClick
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={edtOpen}
            onClose={(_, reason) => {
              if (reason !== "backdropClick") {
                handleEdtClose();
              }
            }}
          >
            <div
              style={modalStyle}
              className={clsx(classes.paper, "rounded-8")}
            >
              <h5 className="popup-head p-20">
                Edit Gold Color
                <IconButton
                  style={{ position: "absolute", top: 8, right: 8 }}
                  onClick={handleEdtClose}
                >
                  <img src={Icones.cross} alt="" />
                </IconButton>
              </h5>
              <div className="pl-32 pr-32 pb-10 pt-10">
                <p className="popup-labl mt-16 ">Gold Color</p>
                <TextField
                  className="mt-4 mb-8"
                  placeholder="Gold Color"
                  name="edtGoldColor"
                  value={editGoldColor}
                  error={edtGoldColorErrTxt.length > 0 ? true : false}
                  helperText={edtGoldColorErrTxt}
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  fullWidth
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
                  onClick={(e) => checkforUpdate(e)}
                >
                  Save
                </Button> */}

                <div className="popup-button-div">
                  <Button
                    variant="contained"
                    className="cancle-button-css"
                    onClick={handleEdtClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    className="save-button-css"
                    onClick={(e) => checkforUpdate(e)}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default GoldColor;

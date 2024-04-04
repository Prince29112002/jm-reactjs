import React, { useState, useEffect } from "react";
import {
  Icon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  InputBase,
} from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import { TextField } from "@material-ui/core";
import Loader from "../../../../Loader/Loader";
import LoaderPopup from "app/main/Loader/LoaderPopup";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import SearchIcon from "@material-ui/icons/Search";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    height: "80%",
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
  button: {
    margin: 5,
    textTransform: "none",
    background: "#415BD4 ",
    color: "#ffffff",
    borderradius: "6px",
    fontsize: "14px",
  },
  table: {
    minWidth: 650,
    tableLayout: "auto",
  },
  tableRowPad: {
    // minWidth:200,
    textOverflow: "ellipsis",

    overflow: "hidden",
    padding: 7,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "340px",
    height: "37px",
    color: "#CCCCCC",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter",
  },
  search: {
    display: "flex",
    border: "1px solid #cccccc",
    float: "right",
    height: "38px",
    width: "340px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
    // marginRight: "16px",
  },
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
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

const Unit = (props) => {
  const [open, setOpen] = useState(false);
  const [apiData, setApiData] = useState([]);
  const [searchData, setSearchData] = useState("");

  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);

  const [unitName, setUnitName] = useState("");
  const [unitNmErr, setUnitNameErr] = useState("");

  const [shortName, setShortName] = useState("");
  const [shortNameErr, setShortNameErr] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    getUnitData(); //main list
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Master", dispatch);
  }, []);

  const classes = useStyles();

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "unitName") {
      setUnitName(value);
      setUnitNameErr("");
    } else if (name === "shortName") {
      setShortName(value);
      setShortNameErr("");
    }
  };

  function UnitNameValidation() {
    const Regex = /^[a-zA-Z\s]*$/;
    if (!unitName || Regex.test(unitName) === false) {
      setUnitNameErr("Enter Valid Unit Name");
      return false;
    }
    return true;
  }

  function ShortNameValidation() {
    const Regex = /^[a-zA-Z\s]*$/;
    if (!shortName || Regex.test(shortName) === false) {
      setUnitNameErr("Please Enter Valid Short Name");
      return false;
    }
    return true;
  }

  const checkforUpdate = (evt) => {
    evt.preventDefault();
    if (UnitNameValidation() && ShortNameValidation()) {
      checkAndCallAPi();
    }
  };

  function checkAndCallAPi() {
    if (isEdit === true) {
      CallEditUnitApi();
    } else {
      CallAddUnitApi();
    }
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function handleModalClose(callApi) {
    setModalOpen(false);
    setSelectedIdForEdit("");
    setIsEdit(false);
    setUnitName("");
    setShortName("");
    setUnitNameErr("");
    if (callApi === true) {
      getUnitData(); //main list
    }
  }

  function editHandler(id) {
    setSelectedIdForEdit(id);
    setIsEdit(true);
    setModalOpen(true);

    const Index = apiData.findIndex((a) => a.id === id);
    if (Index > -1) {
      setUnitName(apiData[Index].unit_name);
      setShortName(apiData[Index].shortname);
    }
  }
  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function getUnitData() {
    axios
      .get(Config.getCommonUrl() + "api/unitofmeasurement/")
      .then(function (response) {
        if (response.data.success === true) {
          setApiData(response.data.data);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/unitofmeasurement/" });
      });
  }

  function CallAddUnitApi() {
    setLoading(true);
    axios
      .post(Config.getCommonUrl() + "api/unitofmeasurement/", {
        unit_name: unitName,
        shortname: shortName,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          handleModalClose(true);
          setLoading(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);

        handleError(error, dispatch, {
          api: "api/unitofmeasurement/",
          body: {
            // name: processNm,
            unit_name: unitName,
            shortname: shortName,
          },
        });
      });
  }

  function CallEditUnitApi() {
    setLoading(true);
    axios
      .put(
        Config.getCommonUrl() + "api/unitofmeasurement/" + selectedIdForEdit,
        {
          unit_name: unitName,
          shortname: shortName,
        }
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          handleModalClose(true);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setLoading(false);
        } else {
          setLoading(false);

          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        }
      })
      .catch((error) => {
        setLoading(false);

        handleError(error, dispatch, {
          api: "api/unitofmeasurement/" + selectedIdForEdit,
          body: {
            unit_name: unitName,
            shortname: shortName,
          },
        });
      });
  }
  function callDeleteProcessApi() {
    axios
      .delete(
        Config.getCommonUrl() + "api/unitofmeasurement/" + selectedIdForDelete
      )
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          getUnitData();

          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));

          setSelectedIdForDelete("");
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        setOpen(false);
        handleError(error, dispatch, {
          api: "api/unitofmeasurement/" + selectedIdForDelete,
        });
      });
  }

  return (
    <div className={clsx(classes.root, props.className)}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            <br />
            <div style={{ display: "flex", justifyContent: "right",marginTop: "-20px", marginLeft:"10px" }}>
              <div className="add-new-unit">
                <Button
                  variant="contained"
                  className={clsx(classes.button)}
                  size="small"
                  onClick={(event) => {
                    setModalOpen(true);
                    setIsEdit(false);
                  }}
                >
                  Add New Unit
                </Button>
              </div>
              {/* <div style={{ textAlign: "right" }} className="mr-16">
                <label style={{ display: "contents" }}> Search : </label>
                <input
                  id="input-ml"
                  type="search"
                  className={classes.searchBox}
                  onChange={(e) => {
                    setSearchData(e.target.value);
                  }}
                />
              </div> */}
              <div
                style={{ borderRadius: "7px !important"}}
                component="form"
                className={classes.search}
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
                  <SearchIcon />
                </IconButton>
              </div>
            </div>
            {loading && <Loader />}
            <Paper
              id="process-tbl-mt"
              className={clsx(
                classes.tabroot,
                "process_master_tabel_dv "
              )}
            >
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      className={classes.tableRowPad}
                      style={{ maxWidth: 100 }}
                    >
                      ID
                    </TableCell>

                    <TableCell
                      className={classes.tableRowPad}
                      style={{ maxWidth: 300 }}
                      align="left"
                    >
                      Unit Name
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      style={{ maxWidth: 300 }}
                      align="left"
                    >
                      Short Name
                    </TableCell>

                    <TableCell
                      className={classes.tableRowPad}
                      style={{ maxWidth: 200 }}
                      align="left"
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiData
                    .filter(
                      (temp) =>
                        temp.unit_name
                          .toLowerCase()
                          .includes(searchData.toLowerCase()) ||
                        temp.shortname
                          .toLowerCase()
                          .includes(searchData.toLowerCase()) ||
                        temp.id
                          .toString()
                          .toLowerCase()
                          .includes(searchData.toLowerCase())
                    )
                    .map((row) => (
                      <TableRow key={row.id}>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ maxWidth: 100 }}
                        >
                          {row.id}
                        </TableCell>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ maxWidth: 300 }}
                        >
                          {row.unit_name}
                        </TableCell>
                        <TableCell
                          align="left"
                          className={classes.tableRowPad}
                          style={{ maxWidth: 300 }}
                        >
                          {row.shortname}
                          {/* {row.Department.name} */}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ maxWidth: 200 }}
                        >
                          <IconButton
                            style={{ padding: "0" }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              ev.stopPropagation();
                              editHandler(row.id);
                            }}
                          >
                                <Icon className="mr-8 edit-icone" >
                                    <img src={Icones.edit}  alt="" />
                                  </Icon>
                          </IconButton>
                          <IconButton
                            style={{ padding: "0" }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              ev.stopPropagation();
                              deleteHandler(row.id);
                            }}
                            hidden={true}
                          >
                                 <Icon className="mr-8 delete-icone">
                                    <img src={Icones.delete_red} alt="" />
                                  </Icon>
                          </IconButton>
                        </TableCell>
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
              <DialogTitle id="alert-dialog-title">{"Alert!!!"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this record?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteProcessApi}
                  color="primary"
                  autoFocus
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            <Modal
              // disableBackdropClick
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={modalOpen}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleModalClose();
                }
              }}
            >
              <div style={modalStyle} className={clsx(classes.paper,"rounded-8")}>
                {/* {loading && <LoaderPopup />} */}
                <h5 className="popup-head p-5">
                  {isEdit === false ? "Add New Unit" : "Edit Unit"}
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={handleModalClose}
                  >
                    <Icon className="">
                      <img src={Icones.cross} alt="" />
                    </Icon>
                  </IconButton>
                </h5>
                <div className="p-32 pb-32">
                  <p className="popup-labl p-4 ">Stock unit name</p>
                  <TextField
                    placeholder="Enter unit name "
                    name="unitName"
                    className="mb-32"
                    value={unitName}
                    error={unitNmErr.length > 0 ? true : false}
                    helperText={unitNmErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                  />
                  <p className="popup-labl p-4 ">Stock unit short name</p>
                  <TextField
                    placeholder="Enter stock unit short name"
                    name="shortName"
                    className="mb-16"
                    value={shortName}
                    error={shortNameErr.length > 0 ? true : false}
                    helperText={shortNameErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                  />
                  {/* <div className="model-actions flex flex-row">
                    <Button
                      variant="contained"
                      color="primary"
                      className="w-full mx-auto mt-20 popup-save p-3"
                      onClick={(e) => checkforUpdate(e)}
                    >
                      Save
                    </Button>
                  </div> */}

                  <div className="popup-button-div">
                    <Button
                        variant="contained"
                        className="cancle-button-css"
                        onClick={handleModalClose}
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
      </FuseAnimate>
    </div>
  );
};

export default Unit;

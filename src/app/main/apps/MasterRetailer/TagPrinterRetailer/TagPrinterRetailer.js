import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, InputBase } from "@material-ui/core";
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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import { TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    // overflowX: "auto",
    // overflowY: "auto",
    // height: "80%",
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
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
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
    font: "normal normal normal 14px/17px Inter"

  },
  search: {
    display: 'flex',
    border: "1px solid #cccccc",
    float: "right",
    height: "38px",
    width: "340px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: '2px 4px',
    alignItems: "center",
  },
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC"
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

const TagPrinterRetailer = (props) => {
  const [apiData, setApiData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);
  const [systemName, setSystemName] = useState("");
  const [systemNameErr, setSystemNameErr] = useState("");
  const [systemMac, setSystemMac] = useState("");
  const [MacErr, setMacErr] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [open, setOpen] = useState(false); //confirm delete Dialog
  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const roleOfUser = localStorage.getItem("permission")
  ? JSON.parse(localStorage.getItem("permission"))
  : null;
    const [authAccessArr, setAuthAccessArr] = useState([]);

    useEffect(() => {
      let arr = roleOfUser
          ? roleOfUser["Master-Retailer"]["Tag Printer-Retailer"]
            ? roleOfUser["Master-Retailer"]["Tag Printer-Retailer"]
            : []
          : [];
      const arrData = [];
      if (arr.length > 0) {
        arr.map((item) => {
          arrData.push(item.name);
        });
      }
      setAuthAccessArr(arrData);
    }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    getTagSystemData();
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Master-Retailer", dispatch);
    //eslint-disable-next-line
  }, []);

  const classes = useStyles();

  function getTagSystemData() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/tagprinter")
      .then(function (response) {
        if (response.data.success === true) { 
          setApiData(response.data.data);
          setLoading(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {api : "retailerProduct/api/tagprinter"})
      });
  }

  function editHandler(id,isEditAllow,isViewAllow) {
    setSelectedIdForEdit(id);
    setIsEdit(isEditAllow);
    setIsView(isViewAllow);
    const index = apiData.findIndex((element) => element.id === id);
    if (index > -1) {
      setSystemName(apiData[index].name);
      setSystemMac(apiData[index].original_name);
    }
    setModalOpen(true);
  }

  function handleInputChange(event) {

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "SystemName") {
      setSystemName(value);
      setSystemNameErr("");
    } else if (name === "macAddress") {
      setSystemMac(value);
      setMacErr("");
    }
  }

  function MACAddressValidation() {
       
    if (systemMac === "") {
      setMacErr("Enter original printer name");

      return false;
    }
    return true;
  }

  function SystemNameValidation() {
    if (systemName === "") {
      // setIsEdtStkGrpNmErr(true);
      setSystemNameErr("Enter printer name");
      return false;
    }
    return true;
  }

  const checkforUpdate = (evt) => {
    evt.preventDefault();
    // alert(`Submitting ${itemTypeName}`); && edtItemTypeValidation()
    if (SystemNameValidation() && MACAddressValidation()) {
      if (isEdit === true) {
        callEditTagSystemDetailsApi();
      } else {
        callAddTagSystemDetailsApi();
      }
    }
  };

  function handleModalClose() {
    setModalOpen(false);
    setSelectedIdForEdit("");
    setIsEdit(false);
    setIsView(false);
    setSystemMac("");
    setSystemName("");
    setSystemNameErr("");
    setMacErr("");
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function callDeleteTagSystemApi() {
    axios
      .delete(Config.getCommonUrl() + "retailerProduct/api/tagprinter/" + selectedIdForDelete)
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          getTagSystemData();
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setSelectedIdForDelete("");
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        setApiData([])
        setOpen(false);
        handleError(error, dispatch,{api : "retailerProduct/api/tagprinter/" + selectedIdForDelete})
      });
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function callAddTagSystemDetailsApi() {
    //add item type
    axios
      .post(Config.getCommonUrl() + "retailerProduct/api/tagprinter/", {
        name: systemName,
        original_name: systemMac,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setSystemMac("");
          setSystemName("");
          setModalOpen(false);
          getTagSystemData();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch , {api : "retailerProduct/api/tagprinter/", body : {
          name: systemName,
          original_name: systemMac,
        }})
      });
  }

  function callEditTagSystemDetailsApi() {
    axios
      .put(Config.getCommonUrl() + "retailerProduct/api/tagprinter/" + selectedIdForEdit, {
        name: systemName,
        original_name: systemMac,
      })
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setSelectedIdForEdit("");
          setModalOpen(false);
          setSystemMac("");
          setSystemName("");
          getTagSystemData();
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        setSelectedIdForEdit("");
        setSystemMac("");
        setSystemName("");
        handleError(error, dispatch , {api : "retailerProduct/api/tagprinter/" + selectedIdForEdit, body : {
          name: systemName,
          original_name: systemMac,
        }})
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
      <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">

        <div className="flex flex-1 flex-col min-w-0">
          <Grid
            container
            alignItems="center"
            style={{ paddingInline: 30, marginBlock: 20 }}
          >
            <Grid item xs={4} sm={4} md={4} key="1">
              <FuseAnimate delay={300}>
              <Typography className="text-18 font-700">
                  Tag Printer
                </Typography>
              </FuseAnimate>

              {/* <BreadcrumbsHelper /> */}
            </Grid>
            {
              authAccessArr.includes('Add /Edit Tag Printer-Retailer') &&    <Grid
              item
              xs={8}
              sm={8}
              md={8}
              key="2"
              style={{ textAlign: "right" }}
            >
              
              <Button
                className={classes.button}
                size="small"
                onClick={(event) => {
                  setModalOpen(true);
                  setIsEdit(false);
                  setIsView(false);
                }}
              >
                Add New
              </Button>
            </Grid>
          }
          </Grid>
          <div className="main-div-alll ">
            <div>
            <div style={{ borderRadius: "7px !important" }} component="form" className={classes.search}>
          <InputBase
            className={classes.input}
            placeholder="Search"
            inputProps={{ 'aria-label': 'search' }}
            value={searchData}
            onChange={(event) => setSearchData(event.target.value)}
          />
          <IconButton type="submit" className={classes.iconButton} aria-label="search">
            <SearchIcon />
          </IconButton>
        </div>
        </div>
          {loading && <Loader />}
          <div className="department-tbl-mt-dv"></div>

          <Paper
            className={clsx(
              classes.tabroot,
              "table-responsive createaccount-tbel-blg createaccount-tbel-dv mt-56"
            )}
          >
            <Table className={clsx(classes.table,"Table_UI")}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableRowPad}>ID</TableCell>

                  <TableCell className={classes.tableRowPad}>
                    Printer Name
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    Original Printer Name
                  </TableCell>

                  <TableCell className={classes.tableRowPad}>
                    Action
                  </TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {apiData
                .filter(
                  (temp) =>
                    temp.name
                      .toLowerCase()
                      .includes(searchData.toLowerCase()) ||
                      temp.original_name
                      .toLowerCase()
                      .includes(searchData.toLowerCase()) 
                ).map((row,index) => (
                  <TableRow key={row.id}>
                    {/* component="th" scope="row" */}
                    <TableCell className={classes.tableRowPad}>
                      {index+1}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.name}
                      {/* row.item_type.id */}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.original_name}
                    </TableCell>
                    
                    <TableCell className={classes.tableRowPad}>
                    {
                        authAccessArr.includes('Add /Edit Tag Printer-Retailer') &&  <IconButton
                        style={{ padding: "0"}}
                        onClick={(ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          editHandler(row.id,true,false);
                        }}
                      >
                    <Icon className="mr-8 edit-icone">
                        <img src={Icones.edit} alt="" />
                      </Icon>
                      </IconButton>
                    }
                    {
                      authAccessArr.includes('View Tag Printer-Retailer') && <IconButton
                      style={{ padding: "0" }}
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        editHandler(row.id,false,true);
                      }}
                    >
                      <Icon className="mr-8 view-icone">
                        <img src={Icones.view} alt="" />
                      </Icon>
                    </IconButton>
                    }
                    {
                      authAccessArr.includes('Delete Tag Printer-Retailer') &&  <IconButton
                      style={{ padding: "0" }}
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        deleteHandler(row.id);
                      }}
                    >
                      <Icon className="delete-icone">
                        <img src={Icones.delete_red} alt="" />
                      </Icon>
                    </IconButton>
                    }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          </div>

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
                  onClick={callDeleteTagSystemApi}
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
            open={modalOpen}
            onClose={(_, reason) => {
              if (reason !== "backdropClick") {
                handleModalClose();
              }
            }}
          >
            <div style={modalStyle} className={clsx(classes.paper,"rounded-8")}>
              <h5
                className="popup-head p-20"
              >
                {isEdit ? "Edit Printer Details" : isView ? "View Printer Details" : "Add New Printer Details"}
                <IconButton
                  style={{ position: "absolute", top:5, right:8}}
                  onClick={handleModalClose}
                ><Icon style={{ color: "white" }}>
                     <img src={Icones.cross} alt="" />
                  </Icon></IconButton>
              </h5>
              <div className="p-32 pb-10">
                <p className="popup-labl">Printer Name</p>
                <TextField
                  className="mt-4 input-select-bdr-dv mb-8"
                  placeholder="Enter Printer Name"
                  name="SystemName"
                  value={systemName}
                  error={systemNameErr.length > 0 ? true : false}
                  helperText={systemNameErr}
                  onChange={(e) => handleInputChange(e)}
                  autoFocus
                  variant="outlined"
                  fullWidth
                  disabled={isView}
                />

                <p className="popup-labl mt-16">Original Printer Name</p>
                <TextField
                  className="mt-4 input-select-bdr-dv"
                  placeholder="Enter Original Printer Name"
                  name="macAddress"
                  value={systemMac}
                  error={MacErr.length > 0 ? true : false}
                  helperText={MacErr}
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  fullWidth
                  disabled={isView}
                />
                {
                  !isView && <div className="popup-button-div">
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
                      {isEdit ? "Update" : "Save" }
                    </Button>
                </div>
                }
              </div>
            </div>
          </Modal>
        </div>
      </div>
      </FuseAnimate>
    </div>
  );
};

export default TagPrinterRetailer;

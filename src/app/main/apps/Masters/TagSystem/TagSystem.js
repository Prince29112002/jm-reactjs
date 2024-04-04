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

const TagSystem = (props) => {
  const [apiData, setApiData] = useState([]);

  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);

  const [systemName, setSystemName] = useState("");
  const [systemNameErr, setSystemNameErr] = useState("");

  const [systemMac, setSystemMac] = useState("");
  const [MacErr, setMacErr] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [open, setOpen] = useState(false); //confirm delete Dialog
  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    getTagSystemData();
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting('Master', dispatch);
  }, []);

  const classes = useStyles();

  function getTagSystemData() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/tagsystem")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {api : "api/tagsystem"})
      });
  }

  function editHandler(id) {
    setSelectedIdForEdit(id);
    setIsEdit(true);
    const index = apiData.findIndex((element) => element.id === id);
    console.log(index);
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
      setMacErr("Please Enter Valid Mac Address");

      return false;
    }
    return true;
  }

  function SystemNameValidation() {
    if (systemName === "") {
      // setIsEdtStkGrpNmErr(true);
      setSystemNameErr("Please Enter Valid System Name");

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
      .delete(Config.getCommonUrl() + "api/tagsystem/" + selectedIdForDelete)
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          // selectedIdForDelete

          // const findIndex = apiData.findIndex(
          //   (a) => a.id === selectedIdForDelete
          // );

          // findIndex !== -1 && apiData.splice(findIndex, 1);
          getTagSystemData();
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));

          setSelectedIdForDelete("");
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {

        setOpen(false);
        handleError(error, dispatch, {api : "api/tagsystem/" + selectedIdForDelete})
      });
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function callAddTagSystemDetailsApi() {
    //add item type
    axios
      .post(Config.getCommonUrl() + "api/tagsystem", {
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

        handleError(error, dispatch, {api : "api/tagsystem", body: {
          name: systemName,
          original_name: systemMac,
        }})
      });
  }

  function callEditTagSystemDetailsApi() {
    axios
      .put(Config.getCommonUrl() + "api/tagsystem/" + selectedIdForEdit, {
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

        handleError(error, dispatch, {api : "api/tagsystem/" + selectedIdForEdit, body : {
          name: systemName,
          original_name: systemMac,
        }})
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
    
      <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
      
        <div className="flex flex-1 flex-col min-w-0">
          <Grid
            className="department-main-dv"
            container
            spacing={4}
            alignItems="stretch"
            style={{ margin: 0 }}
          >
            <Grid item xs={4} sm={4} md={4} key="1" style={{ padding: 0 }}>
              <FuseAnimate delay={300}>
              <Typography className="pl-28 pt-16 text-18 font-700">

                  Tag System
                </Typography>
              </FuseAnimate>

              {/* <BreadcrumbsHelper /> */}
            </Grid>

            <Grid
              item
              xs={8}
              sm={8}
              md={8}
              key="2"
              style={{ textAlign: "right" }}
            >
              {/* <Link
                  to="/dashboard/masters/addemployee"
                  style={{ textDecoration: "none", color: "inherit" }}
                > */}
              <Button
      
                className={classes.button}
                size="small"
                onClick={(event) => {
                  setModalOpen(true);
                  setIsEdit(false);
                }}
              >
                Add New
              </Button>
              {/* </Link> */}
            </Grid>
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

          <Paper className={clsx(classes.tabroot, "mt-56 hsnmaster_tabel_dv ")}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableRowPad}>ID</TableCell>

                  <TableCell className={classes.tableRowPad} align="left">
                    System Name
                  </TableCell>
                  <TableCell className={classes.tableRowPad} align="left">
                    MAC Address
                  </TableCell>

                  <TableCell className={classes.tableRowPad} align="left">
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
                ).map((row) => (
                  <TableRow key={row.id}>
                    {/* component="th" scope="row" */}
                    <TableCell className={classes.tableRowPad}>
                      {row.id}
                    </TableCell>
                    <TableCell align="left" className={classes.tableRowPad}>
                      {row.name}
                      {/* row.item_type.id */}
                    </TableCell>
                    <TableCell align="left" className={classes.tableRowPad}>
                      {row.original_name}
                    </TableCell>
                    
                    <TableCell className={classes.tableRowPad}>
                      <IconButton
                        style={{ padding: "0" }}
                        onClick={(ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          editHandler(row.id);
                        }}
                      >
              <Icon className="mr-8 edit-icone">
                                  <img src={Icones.edit} alt="" />
                                </Icon>
                      </IconButton>

                      
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
              <Button onClick={callDeleteTagSystemApi} color="primary" autoFocus>
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
                {isEdit === false ? "Add New Tag System Details" : "Edit System Details"}
                <IconButton
                  style={{ position: "absolute", top:5, right:8}}
                  onClick={handleModalClose}
                ><Icon>
                    <img src={Icones.cross} alt="" />
                  </Icon></IconButton>
              </h5>
              <div className="pl-32 pr-32 pb-10 pt-10">
              <p className="popup-labl mt-16 ">System Name</p>
                <TextField
                  className="mt-4 input-select-bdr-dv mb-8"
                  placeholder="Enter System Name"
                  name="SystemName"
                  value={systemName}
                  error={systemNameErr.length > 0 ? true : false}
                  helperText={systemNameErr}
                  onChange={(e) => handleInputChange(e)}
                  autoFocus
                  variant="outlined"
                  fullWidth
                />

                <p className="popup-labl mt-16">MAC Address</p>
                <TextField
                  className="mt-4 input-select-bdr-dv"
                  placeholder="Enter MAC Address"
                  name="macAddress"
                  value={systemMac}
                  error={MacErr.length > 0 ? true : false}
                  helperText={MacErr}
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  fullWidth
                />
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
                {/* <Button
                id="btn-save"
                  variant="contained"
                  color="primary"
                  className="w-full mx-auto mt-20"
                  style={{
                    backgroundColor: "#4caf50",
                    border: "none",
                    color: "white",
                  }}
                  onClick={(e) => checkforUpdate(e)}
                >
                  Save
                </Button> */}
              </div>
            </div>
          </Modal>
        </div>
      </div>
      </FuseAnimate>
    </div>
  );
};

export default TagSystem;

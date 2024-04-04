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

const HSNMastersRetailer = (props) => {
  const [apiData, setApiData] = useState([]);

  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);

  const [HSNNumber, setHSNNumber] = useState("");
  const [HSNNumberErr, setHSNNumberErr] = useState("");

  const [GSTPercent, setGSTPercent] = useState("");
  const [GSTPercentErr, setGSTPercentErr] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [open, setOpen] = useState(false); //confirm delete Dialog
  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchData, setSearchData] = useState("");
  const roleOfUser = localStorage.getItem("permission")
  ? JSON.parse(localStorage.getItem("permission"))
  : null;
    const [authAccessArr, setAuthAccessArr] = useState([]);

    useEffect(() => {
      let arr = roleOfUser
          ? roleOfUser["Master-Retailer"]["HSN Master-Retailer"]
            ? roleOfUser["Master-Retailer"]["HSN Master-Retailer"]
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
    //get item types
      getHSNData();
    //eslint-disable-next-line
  }, [authAccessArr]);

  useEffect(() => {
    NavbarSetting("Master-Retailer", dispatch);
    //eslint-disable-next-line
  }, []);

  const classes = useStyles();

  function getHSNData() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/hsnmaster")
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
        handleError(error, dispatch, {api :  "retailerProduct/api/hsnmaster"})
      });
  }

  function editHandler(id,isEditAllow,isViewAllow) {
    setSelectedIdForEdit(id);
    setIsEdit(isEditAllow);
    setIsView(isViewAllow)
    const index = apiData.findIndex((element) => element.id === id);
    // let Name = "";
    if (index > -1) {
      setHSNNumber(apiData[index].hsn_number);
      setGSTPercent(apiData[index].gst);
    }
    setModalOpen(true);
  }

  function handleInputChange(event) {

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "HsnNumber") {
      setHSNNumber(value);
      setHSNNumberErr("");
    } else if (name === "gstPerc") {
      setGSTPercent(value);
      setGSTPercentErr("");
    }
  }

  function GSTPercentValidation() {
    var Regex = /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/;
    if (!GSTPercent || Regex.test(GSTPercent) === false) {
      if(GSTPercent == ""){
        setGSTPercentErr("Enter percentage")
      }else{
        setGSTPercentErr("Enter valid percentage");
      }
      return false;
    }
    return true;
  }

  function HSNNumValidation() {
    const Regex = /^(\d{1,8})$/;
    if (!HSNNumber || Regex.test(HSNNumber) === false) {
      if(HSNNumber == ""){
        setHSNNumberErr("Enter hsn number")
      }else{
        setHSNNumberErr("Enter valid hsn number");
      }
      // setIsEdtStkGrpNmErr(true);

      return false;
    }
    return true;
  }

  const checkforUpdate = (evt) => {
    evt.preventDefault();
    // alert(`Submitting ${itemTypeName}`); && edtItemTypeValidation()
    if (HSNNumValidation() && GSTPercentValidation()) {
      if (isEdit === true) {
        callEditHSNDetailsApi();
      } else {
        callAddHSNDetailsApi();
      }
    }
  };

  function handleModalClose() {
    setModalOpen(false);
    setSelectedIdForEdit("");
    setIsEdit(false);
    setIsView(false);
    setHSNNumberErr("")
    setGSTPercentErr("");
    setHSNNumber("");
    setGSTPercent("")
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function callDeleteHSNNumApi() {
    axios
      .delete(Config.getCommonUrl() + "api/hsnmaster/" + selectedIdForDelete)
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          // selectedIdForDelete

          // const findIndex = apiData.findIndex(
          //   (a) => a.id === selectedIdForDelete
          // );

          // findIndex !== -1 && apiData.splice(findIndex, 1);
          getHSNData();
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));

          setSelectedIdForDelete("");
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {

        setOpen(false);
        handleError(error, dispatch, {api : "api/hsnmaster/" + selectedIdForDelete})
      });
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function callAddHSNDetailsApi() {
    //add item type
    axios
      .post(Config.getCommonUrl() + "retailerProduct/api/hsnmaster", {
        hsn_number: HSNNumber,
        gst: GSTPercent,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setGSTPercent("");
          setHSNNumber("");
          setModalOpen(false);
          getHSNData();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {

        handleError(error, dispatch, {api : "api/hsnmaster",body: {
          hsn_number: HSNNumber,
          gst: GSTPercent,
        }})
      });
  }

  function callEditHSNDetailsApi() {
    axios
      .put(Config.getCommonUrl() + "retailerProduct/api/hsnmaster/" + selectedIdForEdit, {
        hsn_number: HSNNumber,
        gst: GSTPercent,
      })
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setSelectedIdForEdit("");
          setModalOpen(false);
          setGSTPercent("");
          setHSNNumber("");
          getHSNData();
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {

        setSelectedIdForEdit("");
        setGSTPercent("");
        setHSNNumber("");

        handleError(error, dispatch, {api : "api/hsnmaster/" + selectedIdForEdit, body :{
          hsn_number: HSNNumber,
          gst: GSTPercent,
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
            <Grid item xs={6} sm={4} md={4} key="1">
              <FuseAnimate delay={300}>
              <Typography className="text-18 font-700">
                  HSN Master
                </Typography>
              </FuseAnimate>

              {/* <BreadcrumbsHelper /> */}
            </Grid>

            <Grid
              item
              xs={6}
              sm={8}
              md={8}
              key="2"
              style={{ textAlign: "right" }}
            >
                {
                  authAccessArr.includes('Add /Edit HSN Master-Retailer') && <Button
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
                }
            </Grid>
          </Grid>
          <div className="main-div-alll">
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
                    HSN Number
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    GST
                  </TableCell>
                  {/* <TableCell className={classes.tableRowPad} align="left">
                      HSN / HAC
                    </TableCell> */}
                  {/* <TableCell className={classes.tableRowPad} align="left">
                      Description
                    </TableCell> */}
                  <TableCell className={classes.tableRowPad}>
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
                temp.hsn_number
                .toLowerCase()
                .includes(searchData.toLowerCase()) ||
                String(temp.gst)
                .toLowerCase()
                .includes(searchData.toLowerCase())
                )
                .map((row) => (
                  <TableRow key={row.id}>
                    {/* component="th" scope="row" */}
                    <TableCell className={classes.tableRowPad}>
                      {row.id}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.hsn_number}
                      {/* row.item_type.id */}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {row.gst}
                    </TableCell>
                    {/* <TableCell align="left" className={classes.tableRowPad}>
                        {row.hsn_hac}
                      </TableCell>
                      <TableCell align="left" className={classes.tableRowPad}>
                        {row.description}
                      </TableCell> */}
                    <TableCell className={classes.tableRowPad}>
                      {
                        authAccessArr.includes('Add /Edit HSN Master-Retailer') && <IconButton
                        style={{ padding: "0" }}
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
                        authAccessArr.includes('View HSN Master-Retailer') && <IconButton
                        style={{ padding: "0" }}
                        onClick={(ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          editHandler(row.id,false,true);
                        }}
                      >
                        <Icon className="view-icone">
                          <img src={Icones.view} alt="" />
                        </Icon>
                      </IconButton>
                      }
                      {/* jobwork HSN is fixed no need to delete, this hsn is used in sales purchase repairing*/} 
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
              <Button onClick={callDeleteHSNNumApi} color="primary" autoFocus>
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
                {isEdit  ? "Edit hsn details" : isView ? "View New Hsn Details" : "Add New Hsn Details"   }
                <IconButton
                  style={{ position: "absolute", top:5, right:8}}
                  onClick={handleModalClose}
                ><Icon style={{ color: "white" }}>
                     <img src={Icones.cross} alt="" />
                  </Icon></IconButton>
              </h5>
              <div className="p-32 pb-10">
              <p className="popup-labl">HSN Number</p>
                <TextField
                  className="mt-4 input-select-bdr-dv mb-8"
                  placeholder="Enter Hsn Number"
                  name="HsnNumber"
                  value={HSNNumber}
                  error={HSNNumberErr.length > 0 ? true : false}
                  helperText={HSNNumberErr}
                  onChange={(e) => handleInputChange(e)}
                  autoFocus
                  variant="outlined"
                  fullWidth
                  disabled={isView}
                />

                <p className="popup-labl mt-16">GST(%)</p>
                <TextField
                  className="mt-4 input-select-bdr-dv"
                  placeholder="Enter GST(%)"
                  name="gstPerc"
                  value={GSTPercent}
                  error={GSTPercentErr.length > 0 ? true : false}
                  helperText={GSTPercentErr}
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
                      Save
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

export default HSNMastersRetailer;

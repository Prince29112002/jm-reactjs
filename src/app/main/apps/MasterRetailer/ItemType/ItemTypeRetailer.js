import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
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
import Modal from "@material-ui/core/Modal";
import { TextField } from "@material-ui/core";
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { CSVLink } from "react-csv";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    height: "70%",
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
    // minWidth: 650,
    tableLayout: "auto"
  },
  tableRowPad: {
    padding: 7,
  },
  inputBox: {
    marginTop: 8,
    padding: 8,
    fontSize: "12pt",
    borderWidth: 1,
    borderRadius: "6px !important",
    width: "300px",
  },
  form: {
    marginTop: "3%",
    display: "contents",
  },
  submitBtn: {
    marginTop: 7,
    padding: 8,
    marginLeft: 15,
    border: "none",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    cursor: "pointer",
  },
  filterbtn: {
    marginTop:'25px',
    justifyContent: 'flex-start',

    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-end',
    },
  },
  filterBtn: {
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
    marginBlock: "3px",
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

const ItemTypeRetailer = (props) => {
  const [modalStyle] = useState(getModalStyle);

  const csvLink = React.useRef(null);
  const [csvData, setCsvData] = useState([]);

  const [itemTypeName, setItemTypeName] = useState("");
  const [apiData, setApiData] = useState([]);

  const [isItemTypeErr, setIsItemTypeErr] = useState(false);
  const [itemTypeErrTxt, setItemTypeErrTxt] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [edtOpen, setEdtOpen] = useState(false);

  const [editItemNm, setEditItemNm] = useState("");
  const [isEdtItemNmErr, setIsEdtItemNmErr] = useState(false);
  const [edtItemNmErrTxt, setEdtItemNmErrTxt] = useState("");
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const roleOfUser = localStorage.getItem("permission")
  ? JSON.parse(localStorage.getItem("permission"))
  : null;
    const [authAccessArr, setAuthAccessArr] = useState([]);

    useEffect(() => {
      let arr = roleOfUser
          ? roleOfUser["Master-Retailer"]["Main Item Type-Retailer"]
            ? roleOfUser["Master-Retailer"]["Main Item Type-Retailer"]
            : []
          : [];
      const arrData = [];
      if (arr.length > 0) {
        arr.map((item) => {
          arrData.push(item.name);
        });
      }
      setAuthAccessArr(arrData);
    }, [])

  useEffect(() => {
    //get item types
    getItemType();
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Master-Retailer", dispatch);
    //eslint-disable-next-line
  }, []);
  function getItemType() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/itemtype")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
          setLoading(false);

          const arrData = response.data?.data?.map((item) => {
            return {
              "Item Type": item.name,
            };
          });
          setCsvData(arrData);
          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: "retailerProduct/api/itemtype" });
      });
  }

  const classes = useStyles();

  function itemTypeValidation() {
    var usernameRegex = /^[a-zA-Z0-9 ]+$/;
    if (!itemTypeName || usernameRegex.test(itemTypeName) === false) {
      setIsItemTypeErr(true);
      setItemTypeErrTxt("Please Enter item type name");

      return false;
    }
    return true;
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    // alert(`Submitting ${itemTypeName}`);
    if (itemTypeValidation()) {
      // if (selectedIdForEdit !== "") {
      //   callEditItemTypeApi();
      // } else {
      callAddItemTypeApi();
      // }
    }
  };

  function callAddItemTypeApi() {
    //add item type
    axios
      .post(Config.getCommonUrl() + "retailerProduct/api/itemtype", {
        itemName: itemTypeName,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id
          setItemTypeName("");
          getItemType();
          // setApiData([
          //   ...apiData,
          //   {
          //     id: response.data.data.id,
          //     name: response.data.data.name,
          //   },
          // ]);
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
          api: "retailerProduct/api/itemtype",
          body: {
            itemName: itemTypeName,
          },
        });
      });
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "itemName") {
      setEditItemNm(value);
      setIsEdtItemNmErr(false);
      setEdtItemNmErrTxt("");
    }
  }

  function edtItemTypeValidation() {
    var usernameRegex = /^[a-zA-Z0-9 ]+$/;
    if (!editItemNm || usernameRegex.test(editItemNm) === false) {
      setIsEdtItemNmErr(true);
      setEdtItemNmErrTxt("Please Enter Valid Name");

      return false;
    }
    return true;
  }

  const checkforUpdate = (evt) => {
    evt.preventDefault();
    // alert(`Submitting ${itemTypeName}`);
    if (edtItemTypeValidation()) {
      callEditItemTypeApi();
    }
  };

  function handleEdtClose() {
    setEdtOpen(false);
    setSelectedIdForEdit("");
    setEditItemNm("");
  }

  function callEditItemTypeApi() {
    axios
      .put(Config.getCommonUrl() + "retailerProduct/api/itemtype/" + selectedIdForEdit, {
        itemName: editItemNm,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          getItemType();

          setSelectedIdForEdit("");
          setEdtOpen(false);
          setIsEdtItemNmErr(false);
          setEdtItemNmErrTxt("");
          setEditItemNm("");

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
          api: "retailerProduct/api/itemtype/" + selectedIdForEdit,
          body: {
            itemName: editItemNm,
          },
        });
      });
  }

  // function deleteHandler(id) {
  //   setSelectedIdForDelete(id);
  //   setOpen(true);
  // }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function callDeleteItemTypeApi() {
    axios
      .delete(Config.getCommonUrl() + "retailerProduct/api/itemtype/" + selectedIdForDelete)
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          // selectedIdForDelete

          // const findIndex = apiData.findIndex(
          //   (a) => a.id === selectedIdForDelete
          // );

          // findIndex !== -1 && apiData.splice(findIndex, 1);
          getItemType();

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
        setOpen(false);
        handleError(error, dispatch, {
          api: "retailerProduct/api/itemtype/" + selectedIdForDelete,
        });
      });
  }

  function exportHandler() {
    if (apiData.length > 0) {
      csvLink.current.link.click();
    } else {
      dispatch(
        Actions.showMessage({
          message: "Can not Export Empty Data",
          variant: "error",
        })
      );
    }
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div
            className="flex flex-1 flex-col min-w-0 makeStyles-root-1"
            style={{ marginTop: "30px" }}
          >
            <Grid
              container
              alignItems="center"
              style={{ paddingInline: "30px" }}
            >
              <Grid item xs={9} sm={9} md={8} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Stock Item Type
                  </Typography>
                </FuseAnimate>
              </Grid>
            </Grid>

            <div className="main-div-alll" style={{marginTop: "20px"}}>
              <div>
                <form
                  id="item-form-dv"
                  className={classes.form}
                  onSubmit={handleSubmit}
                >
                  {/* <label className="form-title-dv"> Add Main Item Type </label>
                  <br></br>
                  <input
                    // {classes.item}
                    className={classes.inputBox}
                    type="text"
                    placeholder="Item type name"
                    value={itemTypeName}
                    onChange={(e) => {
                      setItemTypeName(e.target.value);
                      setIsItemTypeErr(false);
                      setItemTypeErrTxt("");
                    }}
                  /> */}
                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid item xs={12} sm={4} md={4} lg={3}>
                    <p style={{marginBottom: "5px"}}>Add Main Item Type</p>{" "}
                    <TextField
                      type="text"
                      name="rateValue"
                      value={itemTypeName}
                      onChange={(e) => {
                        setItemTypeName(e.target.value);
                        setIsItemTypeErr(false);
                        setItemTypeErrTxt("");
                      }}
                      variant="outlined"
                      fullWidth
                      autoFocus
                      placeholder="Item Type Name"
                    />
                     <span style={{ color: "red" }}>
                  {isItemTypeErr ? itemTypeErrTxt : ""}
                </span>
                  </Grid>
                  <Grid item xs={12} sm={4} md={4} lg={3}>
                    { authAccessArr.includes('Add Main Item Type-Retailer') && 
                    <Button
                      variant="contained"
                      type="submit"
                    value="Save"
                    className={classes.filterBtn}
                    size="small"
                    >
                      Save
                    </Button>}
                    { authAccessArr.includes('Export Main Item Type-Retailer') && 

                    <Button
                      variant="contained"
                      onClick={exportHandler}
                      className={clsx(classes.filterBtn,"ml-16")}
                      size="small"
                    >
                      Export
                    </Button>}
                    <CSVLink
                  data={csvData}
                  style={{ display: "none" }}
                  ref={csvLink}
                  target="_blank"
                  filename={"ItemType.csv"}
                >
                  Export
                </CSVLink>
               
                  </Grid>
                  </Grid>
                  {/* <button
                    id="btn-save"
                    className={classes.submitBtn}
                    type="submit"
                    value="Save"
                  >
                    Save
                  </button> */}
                </form>
                {/* <button
                  id="btn-save"
                  className={classes.submitBtn}
                  onClick={exportHandler}
                >
                  Export
                </button>
                <CSVLink
                  data={csvData}
                  style={{ display: "none" }}
                  ref={csvLink}
                  target="_blank"
                  filename={"ItemType.csv"}
                >
                  Export
                </CSVLink> */}
                <br></br>
                {/* <span style={{ color: "red" }}>
                  {isItemTypeErr ? itemTypeErrTxt : ""}
                </span> */}
              </div>

              {loading && <Loader />}

              <Paper
                className={clsx(classes.tabroot)}
                style={{maxHeight: "calc(100vh - 290px)"}}
              >
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad} style={{minWidth: 70}}>ID</TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Item Type
                      </TableCell>
                      {/* <TableCell className={classes.tableRowPad} align="left">
                      Action
                    </TableCell> */}

                      {/* <TableCell align="right">Fat&nbsp;(g)</TableCell>
                    <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                    <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiData
                      // .filter(
                      //   (temp) =>
                      //     temp.name
                      //       .toLowerCase()
                      //       .includes(searchData.toLowerCase())
                      //     //   ||
                      //     // temp.variantName
                      //     //   .toLowerCase()
                      //     //   .includes(searchData.toLowerCase())
                      // )
                      .map((row) => (
                        <TableRow key={row.id}>
                          {/* component="th" scope="row" */}
                          <TableCell className={classes.tableRowPad}>
                            {row.id}
                          </TableCell>

                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {row.name}
                          </TableCell>

                          {/* <TableCell className={classes.tableRowPad}>
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
                      </TableCell> */}
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
                    onClick={callDeleteItemTypeApi}
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
                open={edtOpen}
                onClose={(_, reason) => {
                  if (reason !== "backdropClick") {
                    handleEdtClose();
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
                    Edit Item Type
                    <IconButton
                      style={{ position: "absolute", top: "0", right: "0" }}
                      onClick={handleEdtClose}
                    >
                      <Icon style={{ color: "white" }}>close</Icon>
                    </IconButton>
                  </h5>
                  <div className="p-5 pl-16 pr-16">
                    <TextField
                      className="mb-16"
                      label="Item Type"
                      name="itemName"
                      value={editItemNm}
                      error={isEdtItemNmErr}
                      helperText={edtItemNmErrTxt}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                    />

                    <Button
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
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default ItemTypeRetailer;

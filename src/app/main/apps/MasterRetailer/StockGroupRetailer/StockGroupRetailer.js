import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, Grid } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import Select, { createFilter } from "react-select";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { CSVLink } from "react-csv";
import Icones from "assets/fornt-icons/Mainicons";

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
    tableLayout: "auto",
    minWidth: 550,
  },
  tableRowPad: {
    padding: 7,
  },
  inputBox: {
    // marginTop: 8,
    // padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
  },
  form: {
    // marginTop: "3%",
    display: "flex",
  },
  submitBtn: {
 textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
    marginBlock: "3px",
  },
  selectBox: {
    // marginTop: 8,
    // padding: 8,
    fontSize: "12pt",
    borderRadius: 5,
    width: "100% !important",
    // marginLeft: 15,
  },
  edtSelectBox: {
    width: "100%",
    padding: 10,
    fontSize: "12pt",
    borderRadius: 7,
  },
    filterbtn: {
    marginTop:'24px',
    display: 'flex',
    justifyContent: 'flex-start',

    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-end',
    },
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

const StockGroupRetailer = (props) => {
  const [apiData, setApiData] = useState([]);
  const [dropdownData, setDropDownData] = useState([]);
  const theme = useTheme();

  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);
  const [stockGroupName, setStockGroupName] = useState("");
  const [itemType, setItemType] = useState("0");

  const csvLink = React.useRef(null);
  const [csvData, setCsvData] = useState([]);
  // const [isStkGrpNmErr, setIsStkGrpNmErr] = useState(false);
  const [stkGrpNmErrTxt, setStkGrpNmErrTxt] = useState("");

  const [isItemTypeErr, setIsItemTypeErr] = useState(false);
  const [itemTypeErrTxt, setItemTypeErrTxt] = useState("");

  const [open, setOpen] = useState(false);
  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [edtOpen, setEdtOpen] = useState(false);
  const [edtStockGrpNm, setEdtStockGrpNm] = useState("");

  const [isEdtStkGrpNmErr, setIsEdtStkGrpNmErr] = useState(false);
  const [edtStkGrpNmErrTxt, setEdtStkGrpNmErrTxt] = useState("");

  const [edtItemType, setEdtItemType] = useState("0");
  // const [isEdtItemTypeError, setISEdtItemTypeErr] = useState(false);
  // const [edtItemTypeErrTxt, setEdtItemTypeErrTxt] = useState("")
  const [loading, setLoading] = useState(true);
  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };
  const roleOfUser = localStorage.getItem("permission")
  ? JSON.parse(localStorage.getItem("permission"))
  : null;
    const [authAccessArr, setAuthAccessArr] = useState([]);

    useEffect(() => {
      let arr = roleOfUser
          ? roleOfUser["Master-Retailer"]["Stock Group-Retailer"]
            ? roleOfUser["Master-Retailer"]["Stock Group-Retailer"]
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
    NavbarSetting("Master-Retailer", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    getStockGroups();

    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/itemtype")
      .then(function (response) {
        if (response.data.success === true) {
          setDropDownData(response.data.data);
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
        handleError(error, dispatch, { api: "retailerProduct/api/itemtype" });
      });

    //eslint-disable-next-line
  }, [dispatch]);

  function getStockGroups() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/stockgroup")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
          setLoading(false);

          const arrData = response.data?.data?.map((item) => {
            return {
              "Item Type": item.item_type.name,
              "Stock Group Name": item.group_name,
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
        handleError(error, dispatch, { api: "retailerProduct/api/stockgroup" });
      });
  }

  const classes = useStyles();

  function editHandler(id, name, itemID) {
    setSelectedIdForEdit(id);
    setEdtStockGrpNm(name);
    setEdtItemType(itemID); //setting idem id and gettig it from view Array
    setEdtOpen(true);
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "edtStockGroup") {
      setEdtStockGrpNm(value);
      setIsEdtStkGrpNmErr(false);
      setEdtStkGrpNmErrTxt("");
    }
  }
  function handleChangeState(value) {
    setItemType(value);
    setIsItemTypeErr(false);
    setItemTypeErrTxt("");
  }

  // function edtItemTypeValidation() {
  //   // var usernameRegex = /^[a-zA-Z0-9 ]+$/;
  //   if (edtItemType === "0") {

  //     setISEdtItemTypeErr(true);
  //     setEdtItemTypeErrTxt("Please select Valid Item Name");

  //     return false;
  //   }
  //   return true;
  // }

  function edtStockGrpNmValidation() {
    var Regex = /^[a-zA-Z0-9 ]+$/;
    if (!edtStockGrpNm || Regex.test(edtStockGrpNm) === false) {
      setIsEdtStkGrpNmErr(true);
      setEdtStkGrpNmErrTxt("Please Enter Valid Stock Group Name");

      return false;
    }
    return true;
  }

  const checkforUpdate = (evt) => {
    evt.preventDefault();
    // alert(`Submitting ${itemTypeName}`); && edtItemTypeValidation()
    if (edtStockGrpNmValidation()) {
      callEditStockGroupApi();
    }
  };

  function handleEdtClose() {
    setEdtOpen(false);
    setSelectedIdForEdit("");
    setEdtStockGrpNm("");
    setEdtItemType(""); //setting idem id and gettig it from view Array
  }

  function callDeleteItemTypeApi() {
    axios
      .delete(Config.getCommonUrl() + "retailerProduct/api/stockgroup/" + selectedIdForDelete)
      .then(function (response) {
        setOpen(false);
        if (response.data.success === true) {
          // selectedIdForDelete

          // const findIndex = apiData.findIndex(
          //   (a) => a.id === selectedIdForDelete
          // );

          // findIndex !== -1 && apiData.splice(findIndex, 1);
          getStockGroups();

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
          api: "retailerProduct/api/stockgroup/" + selectedIdForDelete,
        });
      });
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
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

  function itemTypeValidation() {
    // var usernameRegex = /^[a-zA-Z0-9 ]+$/;
    if (itemType === "0") {
      setIsItemTypeErr(true);
      setItemTypeErrTxt("Please select Valid Item Name");

      return false;
    }
    return true;
  }

  function StockGrpNmValidation() {
    var Regex = /^[a-zA-Z0-9 ]+$/;
    if (!stockGroupName || Regex.test(stockGroupName) === false) {
      // setIsStkGrpNmErr(true);
      setStkGrpNmErrTxt("Please Enter Valid Stock Group Name");

      return false;
    }
    return true;
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (StockGrpNmValidation() && itemTypeValidation()) {
      callAddStockGroupApi();
      // }
    }
  };

  function callAddStockGroupApi() {
    //add item type
    axios
      .post(Config.getCommonUrl() + "retailerProduct/api/stockgroup", {
        item_id: itemType.value,
        group_name: stockGroupName,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          getStockGroups();

          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );

          setItemType("0");
          setStockGroupName("");
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
          api: "retailerProduct/api/stockgroup",
          body: {
            item_id: itemType,
            group_name: stockGroupName,
          },
        });
      });
  }

  function callEditStockGroupApi() {
    axios
      .put(Config.getCommonUrl() + "retailerProduct/api/stockgroup/" + selectedIdForEdit, {
        item_id: edtItemType,
        group_name: edtStockGrpNm,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          getStockGroups();

          setSelectedIdForEdit("");
          setEdtStockGrpNm("");
          setEdtItemType("0"); //setting idem id and gettig it from view Array
          setEdtOpen(false);
          setEdtStockGrpNm("");
          setIsEdtStkGrpNmErr(false);
          setEdtStkGrpNmErrTxt("");

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
          api: "retailerProduct/api/stockgroup/" + selectedIdForEdit,
          body: {
            item_id: edtItemType,
            group_name: edtStockGrpNm,
          },
        });
      });
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
                    Stock Group Master
                  </Typography>
                </FuseAnimate>
              </Grid>
            </Grid>

            {/* <BreadcrumbsHelper /> */}

            {loading && <Loader />}
            <div className="main-div-alll" style={{ marginTop: "20px" }}>
              <div className="stock-input-main" style={{marginBottom: "20px"}}>
                <form
                  id="item-form-dv stock-group-input"
                  className={classes.form}
                  onSubmit={handleSubmit}
                >
                  <Grid container spacing={2} alignItems="flex-end">
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <label className="form-title-dv">
                        {" "}
                        Add New Stock Group
                      </label>
                      <br></br>
                      {/* <input
                  className={classes.inputBox}
                  type="text"
                  placeholder="Stock Group Name"
                  value={stockGroupName}
                  onChange={(e) => {
                    setStockGroupName(e.target.value);pmain
                    setIsStkGrpNmErr(false);
                    setStkGrpNmErrTxt("");
                  }}
                /> */}
                      <TextField
                        className={classes.inputBox}
                        placeholder="Enter Stock Group Name"
                        name="partyVoucherNum"
                        value={stockGroupName}
                        error={stkGrpNmErrTxt.length > 0 ? true : false}
                        helperText={stkGrpNmErrTxt}
                        onChange={(e) => {
                          setStockGroupName(e.target.value);
                          // setIsStkGrpNmErr(false);
                          setStkGrpNmErrTxt("");
                        }}
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                      <label
                        className="form-title-dv item-type-label"
                        // style={{ marginLeft: "15px" }}
                      >
                        {" "}
                        Item Type
                      </label>
                      <br></br>
                      <Select
                        className={classes.selectBox}
                        filterOption={createFilter({
                          ignoreAccents: false,
                        })}
                        styles={selectStyles}
                        options={dropdownData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        value={itemType}
                        onChange={(e) => {
                          handleChangeState(e)
                        }}
                        placeholder="Select Item Type"
                      />

                      <span style={{ color: "red" }}>
                        {isItemTypeErr ? itemTypeErrTxt : ""}
                      </span>
                    </Grid>

                    <Grid item>
                    { authAccessArr.includes('Add Stock Group-Retailer') && 

                    <Button
                      id="btn-save"
                      className={classes.submitBtn}
                      type="submit"
                      value="Save"
                    >
                      Save
                    </Button>}
                    { authAccessArr.includes('Export Stock Group-Retailer') && 

                    <Button
                      id="btn-save"
                      className={clsx(classes.submitBtn,"ml-16")}
                      onClick={exportHandler}
                    >
                      Export
                    </Button>}

                    <CSVLink
                      data={csvData}
                      style={{ display: "none" }}
                      ref={csvLink}
                      target="_blank"
                      filename={"StockGroup.csv"}
                    >
                      Export
                    </CSVLink>
                    </Grid>
                  </Grid>
                </form>

                {/* <br></br> */}
                {/* <span style={{ color: "red" }}>
                {isItemTypeErr ? itemTypeErrTxt : ""}
              </span> */}

                {/* <span style={{ color: "red" }}>
                {isStkGrpNmErr ? stkGrpNmErrTxt : ""}
              </span> */}
              </div>

              <Paper
                className={clsx(classes.tabroot)}
                style={{maxHeight: "calc(100vh - 290px)"}}
              >
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad}>ID</TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Item Type
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="left">
                        Stock Group Name
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
                    {apiData.map((row) => (
                      <TableRow key={row.id}>
                        {/* component="th" scope="row" */}
                        <TableCell className={classes.tableRowPad}>
                          {row.id}
                        </TableCell>
                        <TableCell align="left" className={classes.tableRowPad}>
                          {row.item_type.name}
                          {/* row.item_type.id */}
                        </TableCell>
                        <TableCell align="left" className={classes.tableRowPad}>
                          {row.group_name}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                        { authAccessArr.includes('Edit Stock Group-Retailer') && 

                          <IconButton
                            style={{ padding: "0" }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              ev.stopPropagation();
                              editHandler(
                                row.id,
                                row.group_name,
                                row.item_type.id
                              );
                            }}
                          >
                            <Icon className="mr-8 edit-icone">
                              <img src={Icones.edit} alt="" />
                            </Icon>
                          </IconButton>}

                          {/* <IconButton
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
                        </IconButton> */}
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
                <div
                  style={modalStyle}
                  className={clsx(classes.paper, "rounded-8")}
                >
                  <h5 className="popup-head p-20" style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                    Edit Stock Group Name
                    <IconButton
                      style={{
                        position: "absolute",
                        right: 5,
                      }}
                      onClick={handleEdtClose}
                    >
                      <Icon className="">
                        <img src={Icones.cross} alt="" />
                      </Icon>
                    </IconButton>
                  </h5>
                  <div style={{padding: "30px"}}>
                    <p className="popup-labl" style={{marginBottom: "10px"}}>Stock group name</p>
                    <TextField
                      className="input-select-bdr-dv"
                      style={{marginBottom: "30px"}}
                      // label="Stock Group Name"
                      name="edtStockGroup"
                      value={edtStockGrpNm}
                      error={isEdtStkGrpNmErr}
                      helperText={edtStkGrpNmErrTxt}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                    />
                    <p className="popup-labl" style={{marginBottom: "10px"}}>Item type</p>

                    <select
                      className={classes.edtSelectBox}
                      style={{marginBottom: "30px"}}
                      required
                      value={edtItemType}
                      onChange={(e) => {
                        setEdtItemType(e.target.value);
                        // setIsItemTypeErr(false);
                        // setItemTypeErrTxt("");
                      }}
                    >
                      <option hidden value="0">
                        Item Type
                      </option>
                      {dropdownData.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                      ;
                    </select>
                    <div className="model-actions flex flex-row justify-between">
                      <Button
                        variant="contained"
                        className="w-128 popup-cancel"
                        onClick={handleEdtClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        className="w-128 popup-save"
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
      </FuseAnimate>
    </div>
  );
};

export default StockGroupRetailer;

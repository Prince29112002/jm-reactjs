import React, { useState, useEffect } from "react";
import { Icon, IconButton } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
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
import Grid from "@material-ui/core/Grid";
import Select, { createFilter } from "react-select";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
  },
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
    border: 7,
  },
  button: {
    margin: 5,
    textTransform: "none",
    background: "#415BD4 ",
    color: "#ffffff",
    borderradius: "6px",
    fontsize: "14px",
  },
  group: {
    // margin: theme.spacing(1, 0),
    flexDirection: "row",
    fontSize: "14px",
  },
  table: {
    minWidth: 650,
    tableLayout: "auto"
  },
  tableRowPad: {
    // minWidth:200,
    textOverflow: "ellipsis",

    // min-width: 200px;
    // text-overflow: ellipsis;
    // max-width: 250px;
    overflow: "hidden",
    padding: 7,
  },
  searchBox: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
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

const StockNameDesc = (props) => {
  const theme = useTheme();

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };
  const [apiData, setApiData] = useState([]); // display list
  //   const [searchData, setSearchData] = useState("");

  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);

  const [stockNameData, setStockNameData] = useState([]);
  const [selectedStockNm, setSelectedStockNmn] = useState("");
  const [stockNameErrTxt, setStockNameErrTxt] = useState("");

  const [stockNmDesc, setStockNmDesc] = useState("");
  const [stkNmdescErrTxt, setstkNmdescErrTxt] = useState("");

  //   const [processNm, setProcessNm] = useState("");
  //   const [processNmErr, setProcessNmErr] = useState("");

  const [stockNmPieces, setStockNmPieces] = useState("");
  const [stockNmPiecesErr, setStockNmPiecesErr] = useState("");

  const [taggingDetail, setTaggingDetail] = useState("");
  const [taggingDetErr, setTaggingDetErr] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [open, setOpen] = useState(false); //confirm delete Dialog
  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    //get item types
    getStockName();
    getDescList();
    //eslint-disable-next-line
  }, [dispatch]);

  const classes = useStyles();

  function getDescList() {
    axios
      .get(Config.getCommonUrl() + "api/stockdescription")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
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
        handleError(error, dispatch, { api: "api/stockdescription" });
      });
  }

  function getStockName() {
    //only records will comes which data is not set like stock_code, description etc
    axios
      .get(Config.getCommonUrl() + "api/stockname?pending_stock_code=1")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockNameData(response.data.data);
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
        handleError(error, dispatch, {
          api: "api/stockname?pending_stock_code=1",
        });
      });
  }

  function editHandler(id) {
    setSelectedIdForEdit(id);
    setIsEdit(true);
    setModalOpen(true);

    const Index = apiData.findIndex((a) => a.id === id);
    if (Index > -1) {
      setSelectedStockNmn({
        value: apiData[Index].stock_name.id,
        label: apiData[Index].stock_name.stock_name,
      });

      setStockNmDesc(apiData[Index].description);

      setStockNmPieces(apiData[Index].pcs_require.toString());

      setTaggingDetail(apiData[Index].is_separate.toString());
    }
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "stockNmDesc") {
      setStockNmDesc(value);
      setstkNmdescErrTxt("");
    }
  }

  function validateStockNmSelected() {
    if (selectedStockNm === "") {
      setStockNameErrTxt("Please Select Stock Name");
      return false;
    }
    return true;
  }

  function stockNameDescValidation() {
    // var Regex = /^[a-zA-Z0-9 ]+$/; Regex.test(stockNmDesc) === false
    if (!stockNmDesc || stockNmDesc.trim() === "") {
      setstkNmdescErrTxt("Enter Valid Stock Name Description");
      return false;
    }
    return true;
  }

  function validateStockNmPieces() {
    if (stockNmPieces === "") {
      setStockNmPiecesErr("Please Select Option");
      return false;
    }
    return true;
  }

  function validateTaggingDetail() {
    if (taggingDetail === "") {
      setTaggingDetErr("Please Select Option");
      return false;
    }
    return true;
  }

  const checkforUpdate = (evt) => {
    evt.preventDefault();
    // alert(`Submitting ${itemTypeName}`); && edtItemTypeValidation()
    if (
      validateStockNmSelected() &&
      stockNameDescValidation() &&
      validateStockNmPieces() & validateTaggingDetail()
    ) {
      checkAndCallAPi();
    }
  };

  function checkAndCallAPi() {
    if (isEdit === true) {
      CallEditDescApi();
    } else {
      CallAddDescApi();
    }
  }

  function handleModalClose(callApi) {
    setModalOpen(false);
    setSelectedIdForEdit("");
    setIsEdit(false);
    setStockNmDesc(""); //first textbox creating new department
    setstkNmdescErrTxt("");
    setSelectedStockNmn("");
    setStockNmPieces("");
    setTaggingDetail("");
    setStockNameErrTxt("");
    setStockNmPiecesErr("");
    setTaggingDetErr("");

    if (callApi === true) {
      getDescList();
    }
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function callDeleteDescApi() {
    axios
      .delete(
        Config.getCommonUrl() + "api/stockdescription/" + selectedIdForDelete
      )
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );

          setSelectedIdForDelete("");
          reset();
          getDescList();
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
          api: "api/stockdescription/" + selectedIdForDelete,
        });
      });
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function CallAddDescApi() {
    axios
      .post(Config.getCommonUrl() + "api/stockdescription", {
        description: stockNmDesc,
        stock_name_id: selectedStockNm.value,
        pcs_require: stockNmPieces,
        is_separate: taggingDetail,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );

          handleModalClose(true);
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
          api: "api/stockdescription",
          body: {
            description: stockNmDesc,
            stock_name_id: selectedStockNm.value,
            pcs_require: stockNmPieces,
            is_separate: taggingDetail,
          },
        });
      });
  }

  function CallEditDescApi() {
    axios
      .put(
        Config.getCommonUrl() + "api/stockdescription/" + selectedIdForEdit,
        {
          description: stockNmDesc,
          stock_name_id: selectedStockNm.value,
          pcs_require: stockNmPieces,
          is_separate: taggingDetail,
        }
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          handleModalClose(true);
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
          api: "api/stockdescription/" + selectedIdForEdit,
          body: {
            description: stockNmDesc,
            stock_name_id: selectedStockNm.value,
            pcs_require: stockNmPieces,
            is_separate: taggingDetail,
          },
        });
      });
  }

  function handleChangeStockType(value) {
    setSelectedStockNmn(value);
    setStockNameErrTxt("");
  }

  function handleStockNmPiecesChange(event) {
    // 1 means yes
    // 0 means no
    setStockNmPieces(event.target.value);
    setStockNmPiecesErr("");
  }

  function handleTaggingDetChange(event) {
    // 1 means yes
    // 0 means no
    setTaggingDetail(event.target.value);
    setTaggingDetErr("");
  }

  function reset() {
    setIsEdit(false);
    setSelectedIdForEdit("");
    setStockNmDesc(""); //first textbox creating new department
    setstkNmdescErrTxt("");
    setSelectedStockNmn("");
    setStockNmPieces("");
    setTaggingDetail("");
    setStockNameErrTxt("");
    setStockNmPiecesErr("");
    setTaggingDetErr("");
  }

  function handleModalOpen() {
    setModalOpen(true);
    reset();
  }

  return (
    <div className={clsx(classes.root, props.className)}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              container
              alignItems="center"
            >
              <Grid item xs={4} sm={4} md={4} key="1" style={{ padding: 0 }}>
                {/* <FuseAnimate delay={300}>
                  <Typography className="p-16 pb-8 text-18 font-700">
                    Process Master
                  </Typography>
                </FuseAnimate>

                <BreadcrumbsHelper/> */}
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
                  variant="contained"
                  className={clsx(classes.button)}
                  size="small"
                  onClick={(event) => {
                    handleModalOpen();
                  }}
                >
                  Add New Stock Name Description
                </Button>
                {/* </Link> */}
              </Grid>
            </Grid>

            {/* <div
              style={{ textAlign: "right", float: "right" }}
              className="mr-16"
            >
              <label style={{ display: "contents" }}> Search : </label>
              <Search
                className={classes.searchBox}
                onSearch={onSearchHandler}
              />
            </div> */}
            <Grid className="stock-description">
              <Paper
                id=" process-tbl-mt "
                className={clsx(
                  classes.tabroot,
                  "stocknamedec_tabel_dv srockname-tabel-bdr mt-20"
                )}
              >
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ maxWidth: 100 }}
                      >
                        Description
                      </TableCell>

                      <TableCell
                        className={classes.tableRowPad}
                        style={{ maxWidth: 300 }}
                        align="left"
                      >
                        Stock Name
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
                      // .filter(
                      //   (temp) =>
                      //     temp.process_name
                      //       .toLowerCase()
                      //       .includes(searchData.toLowerCase()) ||
                      //     temp.Department.name
                      //       .toLowerCase()
                      //       .includes(searchData.toLowerCase())
                      // )
                      .map((row) => (
                        <TableRow key={row.id}>
                          <TableCell
                            className={classes.tableRowPad}
                            style={{ maxWidth: 100 }}
                          >
                            {row.description}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                            style={{ maxWidth: 300 }}
                          >
                            {row.stock_name.stock_name}
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
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>

            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" className="popup-delete">
                {"Alert!!!"}{" "}
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
                  onClick={callDeleteDescApi}
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
              <div
                style={modalStyle}
                className={clsx(classes.paper, "rounded-8")}
              >
                <h5 className="popup-head p-20">
                  {isEdit === false
                    ? "Add Stock Name Description"
                    : "Update Stock Name Description"}
                  <IconButton
                    style={{
                      position: "absolute",
                      marginTop: "-11px",
                      right: 8,
                    }}
                    onClick={handleModalClose}
                  >
                    <img src={Icones.cross} alt="" />
                  </IconButton>
                </h5>
                <div style={{padding: "30px"}}>
                  <p className="popup-labl" style={{marginBottom: "10px"}}>Stock name</p>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    className=" input-select-bdr-dv"
                    classes={classes}
                    styles={selectStyles}
                    options={stockNameData.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.stock_name,
                    }))}
                    // components={components}
                    value={selectedStockNm}
                    onChange={handleChangeStockType}
                    placeholder=" Select stock name"
                  />

                  <span style={{ color: "red" }}>
                    {stockNameErrTxt.length > 0 ? stockNameErrTxt : ""}
                  </span>
                  <p className="popup-labl" style={{marginBottom: "10px", marginTop: "30px"}} >
                    Stock name description
                  </p>
                  <TextField
                    className="input-select-bdr-dv"
                    placeholder=" Enter stock name description"
                    name="stockNmDesc"
                    value={stockNmDesc}
                    error={stkNmdescErrTxt.length > 0 ? true : false}
                    helperText={stkNmdescErrTxt}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                  />

                  <FormControl
                    id="redio-input-dv"
                    component="fieldset"
                    style={{marginTop: "30px"}}
                  >
                    <FormLabel>
                      <p className="popup-labl" style={{marginBottom: "10px"}}>Stock In Pieces Required?</p>
                    </FormLabel>

                    <RadioGroup
                      aria-label="Gender"
                      name="stockNmPieces"
                      className={classes.group}
                      value={stockNmPieces}
                      onChange={handleStockNmPiecesChange}
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio style={{paddingBlock: 0}} />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="0"
                        control={<Radio style={{paddingBlock: 0}} />}
                        label="No"
                        className="ml-6"
                      />
                    </RadioGroup>
                    <span style={{ color: "red" }}>
                      {stockNmPiecesErr.length > 0 ? stockNmPiecesErr : ""}
                    </span>
                  </FormControl>

                  <FormControl
                    id="redio-input-dv"
                    component="fieldset"
                    style={{marginTop: "30px"}}
                  >
                    <FormLabel className="popup-labl">
                      <p className="popup-labl" style={{marginBottom: "10px"}}>
                        Separate in Tagging detail Required?{" "}
                      </p>
                    </FormLabel>

                    <RadioGroup
                      aria-label="Gender"
                      name="taggingDetail"
                      className={classes.group}
                      value={taggingDetail}
                      onChange={handleTaggingDetChange}
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio style={{paddingBlock: 0}} />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="0"
                        control={<Radio style={{paddingBlock: 0}} />}
                        label="No"
                        className="ml-6"
                      />
                    </RadioGroup>
                    <span style={{ color: "red" }}>
                      {taggingDetErr.length > 0 ? taggingDetErr : ""}
                    </span>
                  </FormControl>

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
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default StockNameDesc;

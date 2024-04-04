import React, { useState, useEffect } from "react";
import { Typography, Icon, IconButton, InputBase } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import moment from "moment";
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
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select, { createFilter } from "react-select";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
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
    font: "normal normal normal 14px/17px Inter",
  },
  inputBox: {
    marginTop: 8,
    // padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    // width: "15%",
  },
  searchBox: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
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

const LedgerRate = (props) => {
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
  const [modalStyle] = useState(getModalStyle);

  const classes = useStyles();
  const dispatch = useDispatch();

  const [ledgersListRate, setLedgersListRate] = useState([]); // display list
  //   const [apiSearchData, setApiSearchData] = useState([]);
  //   const [searchData, setSearchData] = useState("");

  const [ledgerMainData, setLedgerMainData] = useState([]);
  const [selectMainLedger, setSelectMainLedger] = useState("");
  const [selMainLedgerErr, setSelMainLedgerErr] = useState("");

  const [rateDate, setRateDate] = useState("");
  const [rateDtErr, setRateDtErr] = useState("");

  const [rateValue, setRateValue] = useState("");
  const [rateValueErr, setRateValueErr] = useState("");

  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [searchData, setSearchData] = useState("");
  const today = moment().format("YYYY-MM-DD");

  useEffect(() => {
    getAllLedgerFromAccount();

    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);

  function getAllLedgerFromAccount() {
    //showing list in popup in main page

    axios
      .get(Config.getCommonUrl() + "api/ledgerMastar/ledgerfromaccount")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setLedgerMainData(response.data.data);
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
          api: "api/ledgerMastar/ledgerfromaccount",
        });
      });
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("YYYY-MM-DD"); //new Date();

    // if (name === "rateDate") {
    //   setRateDate(value);
    //   setRateDtErr("");
    // } else if (name === "rateValue") {
    //   setRateValue(value);
    //   setRateValueErr("");
    // }

    

    if (name === "rateDate") {
      setRateDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal) {
        setRateDtErr("");
      } else {
        setRateDtErr("Enter Valid Date");
      }
    } else if (name === "rateValue") {
      setRateValue(value);
      setRateValueErr("");
    }
  }

  function dateValidation() {
    const Regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    if (!rateDate || Regex.test(rateDate) === false) {
      setRateDtErr("Enter Valid Date");
      return false;
    }
    return true;
  }

  function rateValueValidation() {
    const Regex = /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/;
    if (!rateValue || Regex.test(rateValue) === false) {
      setRateValueErr("Enter Valid Rate");
      return false;
    }
    return true;
  }

  const checkforUpdate = (evt) => {
    evt.preventDefault();
    if (dateValidation() && rateValueValidation()) {
      checkAndCallAPi();
    }
  };

  function checkAndCallAPi() {
    if (isEdit === true) {
      CallUpdateOld();
    } else {
      CallAddNew();
    }
  }

  function CallAddNew() {
    axios
      .post(Config.getCommonUrl() + "api/ledgerMastar", {
        ledger_id_from_account: selectMainLedger.value,
        change_date: rateDate,
        rate: rateValue,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id

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
          api: "api/ledgerMastar",
          body: {
            ledger_id_from_account: selectMainLedger.value,
            change_date: rateDate,
            rate: rateValue,
          },
        });
      });
  }

  function CallUpdateOld() {
    axios
      .put(Config.getCommonUrl() + `api/ledgerMastar/${selectedIdForEdit}`, {
        // ledger_id_from_account: selectMainLedger.value,
        change_date: rateDate,
        rate: rateValue,
      })
      .then(function (response) {
        if (response.data.success === true) {
          // response.data.data
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
          api: `api/ledgerMastar/${selectedIdForEdit}`,
          body: {
            // ledger_id_from_account: selectMainLedger.value,
            change_date: rateDate,
            rate: rateValue,
          },
        });
      });
  }

  function handleModalOpen() {
    setSelectedIdForEdit("");
    setIsEdit(false);
    setRateDate("");
    setRateDtErr("");
    setRateValue("");
    setRateValueErr("");
    setModalOpen(true);
  }

  function handleModalClose(callApi) {
    setModalOpen(false);
    setSelectedIdForEdit("");
    setIsEdit(false);
    setRateDate("");
    setRateDtErr("");
    setRateValue("");
    setRateValueErr("");

    if (callApi === true) {
      getLedgersForSelected(selectMainLedger.value);
    }
  }

  function handleMainLedgerChange(data) {
    setSelectMainLedger(data);
    setSelMainLedgerErr("");
    //call Api from here
    getLedgersForSelected(data.value);
  }

  function getLedgersForSelected(ledgerId) {
    //showing list of selected Ledger

    axios
      .get(Config.getCommonUrl() + `api/ledgerMastar/${ledgerId}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          if (response.data.data !== null) {
            let ledgerRate = response.data.data.LedgerRate;
            let tempArray = [];
            let LedgerName = response.data.data.Ledger.name;
            for (let item of ledgerRate) {
              tempArray.push({
                LedgerName: LedgerName,
                change_date: item.change_date,
                rate: item.rate,
                id: item.id,
              });
            }

            setLedgersListRate(tempArray);
          } else {
            setLedgersListRate([]);
          }
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
        handleError(error, dispatch, { api: `api/ledgerMastar/${ledgerId}` });
      });
  }

  function checkAndAdd() {
    if (selectMainLedger !== "") {
      //   const findIndex = vendorData.findIndex((a) => a.id === vendorSelected.value);

      //   if(findIndex !== -1){
      //     // vendorData.splice(findIndex, 1);

      //     props.history.push("/dashboard/sales/addratevendor", {
      //       vendorID: vendorSelected,
      //     //   companyId: vendorData[findIndex].firm_name,
      //     }); //, { row: row }
      //   }
      handleModalOpen();
    } else {
      setSelMainLedgerErr("Please Select Ledger");
    }
  }

  const deleteHandler = (id) => {
        setDeleteId(id);
    setOpen(true);
      };

  function handleClose() {
    setDeleteId("");
    setOpen(false);
  }

  function callDeleteApi() {
    axios
      .delete(Config.getCommonUrl() + `api/ledgerMastar/${deleteId}`)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          getLedgersForSelected(selectMainLedger.value);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        setOpen(false);
      })
      .catch((error) => {
        setOpen(false);
        handleError(error, dispatch, { api: `api/ledgerMastar/${deleteId}` });
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
                    TCS / TDS Ledger Rate
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
                <Button
                  className={classes.button}
                  size="small"
                  onClick={(event) => {
                    checkAndAdd();
                  }}
                >
                  Add New
                </Button>
                {/* </Link> */}
              </Grid>
            </Grid>
            <div className="main-div-alll ">
              <div>
                <div
                  style={{ borderRadius: "7px !important" }}
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

              <div className="mt-56">
                <div className="my-16" style={{ width: "30%" }}>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={ledgerMainData.map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    // components={components}
                    value={selectMainLedger}
                    onChange={handleMainLedgerChange}
                    placeholder="Ledger for Sales"
                    autoFocus
                    blurInputOnSelect
                    tabSelectsValue={false}
                  />

                  <span style={{ color: "red" }}>
                    {selMainLedgerErr.length > 0 ? selMainLedgerErr : ""}
                  </span>
                </div>

                {ledgersListRate.length > 0 && (
                  <Paper
                    className={clsx(
                      classes.tabroot,
                      "mt-16 ledgerrate_tabel_dv ledgerrate_tabel_main_dv"
                    )}
                  >
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            ID
                          </TableCell>

                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Ledger Name
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Date
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Rate (%)
                          </TableCell>

                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {ledgersListRate
                          .filter(
                            (temp) =>
                              String(temp.LedgerName)
                                .toLowerCase()
                                .includes(searchData.toLowerCase()) ||
                              temp.change_date
                                .toLowerCase()
                                .includes(searchData.toLowerCase()) ||
                              String(temp.rate)
                                .toLowerCase()
                                .includes(searchData.toLowerCase())
                          )
                          .map((row, i) => (
                            <TableRow key={row.id}>
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                {i + 1}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.LedgerName}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {moment
                                  .utc(row.change_date)
                                  .local()
                                  .format("DD-MM-YYYY")}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.rate}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.change_date === today && (
                                  <IconButton
                                    style={{ padding: "0" }}
                                    onClick={(ev) => {
                                      // ev.preventDefault();
                                      // ev.stopPropagation();
                                      // editHandler(row);
                                      deleteHandler(row.id);
                                    }}
                                    disabled={
                                      row.change_date === today ? false : true
                                    }
                                  >
                                    <Icon>
                                      <img src={Icones.delete_red} alt="" />
                                    </Icon>
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </Paper>
                )}
              </div>
            </div>
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
              style={{ overflow: "scroll" }}
            >
              <div
                style={modalStyle}
                className={clsx(classes.paper, "rounded-8")}
              >
                <h5 className="popup-head p-20">
                  {isEdit === false
                    ? "Add Ledger Date and Rate"
                    : "Update Ledger Date and Rate"}
                  <IconButton
                    style={{ position: "absolute", top: 5, right: 8 }}
                    onClick={handleModalClose}
                  >
                    <Icon style={{ color: "white" }}>
                      <img src={Icones.cross} alt="" />
                    </Icon>
                  </IconButton>
                </h5>
                <div className="pl-32 pr-32 pb-10 pt-10">
                  <p className="popup-labl mt-16 ">Date</p>
                  <TextField
                    placeholder="Date"
                    type="date"
                    className={clsx(
                      classes.inputBox,
                      "mt-4 input-select-bdr-dv mb-4"
                    )}
                    name="rateDate"
                    value={rateDate}
                    error={rateDtErr.length > 0 ? true : false}
                    helperText={rateDtErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                    autoFocus

                    InputLabelProps={{
                      shrink: true,
                    }}
                                        inputProps={{
                      max: moment().format("YYYY-MM-DD"),
                      // max: moment().format("YYYY-MM-DD"),
                    }}
                  />

                  <p className="popup-labl mt-16 ">Rate (%)</p>
                  <TextField
                    className="mt-4 input-select-bdr-dv"
                    placeholder=" Enter Rate (%)"
                    name="rateValue"
                    value={rateValue}
                    error={rateValueErr.length > 0 ? true : false}
                    helperText={rateValueErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
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
                  onClick={callDeleteApi}
                  className="delete-dialog-box-delete-button"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default LedgerRate;

import React, { useState, useEffect } from "react";
import { Typography, TextField, Icon, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import Modal from "@material-ui/core/Modal";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Loader from "../../../Loader/Loader";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import moment from "moment";
import History from "@history";
import Select, { createFilter } from "react-select";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { Label } from "@material-ui/icons";
import Icones from "assets/fornt-icons/Mainicons";

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
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    tableLayout: "auto",
    minWidth: 700,
  },
  tableRowPad: {
    padding: 7,
  },
  filterbtn: {
    marginTop:'22px',
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

const VoucherHistory = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [modalStyle] = React.useState(getModalStyle);

  const [voucherList, setVoucherList] = useState([]);
  // const [startDate, setStartDate] = useState(moment().startOf("month").format("YYYY-MM-DD"));
  const [startDate, setStartDate] = useState("");
  const [startDateErr, setStartDateErr] = useState("");
  const [endDate, setEndDate] = useState("");
  // const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDateErr, setEndDateErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [preVoucher, setPreVoucher] = useState([]);
  const [selectedPreVoucher, setSelectedPreVoucher] = useState("");
  const [voucherArrList, setVoucherArrList] = useState("");
  const [searchData, setSearchData] = useState({
    voucher_date: "",
    voucher_number: "",
    LedgereName: "",
    credit_debit: "",
    amount: "",
  });
  const today = moment().format("YYYY-MM-DD");
  const adminId = localStorage.getItem("userId");
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteReasonErr, setDeleteReasonErr] = useState("");

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  useEffect(() => {
    if (props.location.state) {
      const list = props.location.state.voucherArrList;
      const voucher = props.location.state.voucher;
      setVoucherArrList(list);
      setOpenModal(false);
      setSelectedPreVoucher(voucher);
    } else {
      setOpenModal(true);
      getPreVoucherList();
    }
  }, [dispatch]);

  useEffect(() => {
    if (voucherArrList) {
      getAllVoucherList();
    }
  }, [voucherArrList]);

  useEffect(() => {
    if (openModal) {
      getPreVoucherList();
    }
  }, [openModal]);

  useEffect(() => {
    NavbarSetting("Accounts", dispatch);
  }, []);

  function getPreVoucherList() {
    axios
      .get(Config.getCommonUrl() + "api/vouchersettingdetail/setting/details")
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setPreVoucher(res.data.data);
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/vouchersettingdetail/setting/details",
        });
      });
  }

  function getAllVoucherList(filter) {
    setLoading(true);
    const body = {
      voucher_setting_detail_id: voucherArrList,
    };
    if (filter) {
      var api = `api/voucherentry/entry/details/?start=${startDate}&end=${endDate}`;
    } else {
      var api = `api/voucherentry/entry/details`;
    }
    axios
      .post(Config.getCommonUrl() + api, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          let tempData = response.data.data;
          let data = [];
          let count = 1;
          tempData.map((item) => {
            item.VoucherEntryDetails.map((val, i) => {
              data.push({
                id: item.id,
                LedgereName: val.LedgerName ? val.LedgerName.name : "",
                voucher_date: item.voucher_date ? item.voucher_date : "",
                voucher_number: item.voucher_number ? item.voucher_number : "",
                credit_debit: val.credit_debit === 1 ? "Cr" : "Dr",
                amount: val.purchase_flag_id
                  ? val.amount
                    ? val.amount.toString()
                    : ""
                  : val.total_amt
                  ? val.total_amt.toString()
                  : "",
                rowspan: i === 0 ? item.VoucherEntryDetails.length : 0,
                num: i == 0 ? count++ : null,
                isDelete:
                  item.VoucherSettingDetails.allowed_delete === 0
                    ? false
                    : true,
              });
            });
          });
          setVoucherList(data);
          if (data.length > 0) {
            setOpenModal(false);
          } else {
            dispatch(
              Actions.showMessage({
                message: "No data available",
                variant: "error",
              })
            );
            if (!filter) {
              setOpenModal(true);
            }
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setOpenModal(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: api, body: body });
      });
  }

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("YYYY-MM-DD"); 
    // const name = event.target.name;
    // const value = event.target.value;

    // if (name === "startDate") {
    //   setStartDate(value);
    //   if (startDate >= today ) {
    //     setStartDateErr("");
    //   } else {
    //     setStartDateErr("Enter Valid Date");
    //   }
    // }

    if (name === "startDate") {
      setStartDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      if (dateVal <= today && minDateVal < dateVal) {
        setStartDateErr("");
      } else {
        setStartDateErr("Enter Valid Date");
      }
    } else if (name === "endDate") {
      setEndDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      if (dateVal <= today && minDateVal < dateVal) {
        setEndDateErr("");
      } else {
        setEndDateErr("Enter Valid Date");
      }
    }
  };

  const deleteHandler = (id) => {
    setDeleteId(id);
    setOpen(true);
  };

  function handleClose() {
    setDeleteId("");
    setOpen(false);
    setDeleteReason("");
    setDeleteReasonErr("");
  }

  const validateDelete = () => {
    if (deleteReason === "") {
      setDeleteReasonErr("Enter Valid delete reason");
      return false;
    }
    return true;
  };

  function callDeleteApi() {
    if (validateDelete()) {
      const body = {
        delete_remark: deleteReason,
        admin_id: adminId,
      };
      axios
        .post(
          Config.getCommonUrl() + `api/voucherentry/delete/${deleteId}`,
          body
        )
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            dispatch(
              Actions.showMessage({
                message: response.data.message,
                variant: "success",
              })
            );
            getAllVoucherList();
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
            api: `api/voucherentry/delete/${deleteId}`,
            body: body,
          });
        });
      handleClose();
    }
  }

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function callFilterApi() {
    if (validateStartDate() && validateEndDate() && validateBothDate()) {
      setStartDateErr("");
      setEndDateErr("");
      getAllVoucherList(true);
    }
  }

  function validateStartDate() {
    if (startDate === "") {
      setStartDateErr("Please Enter Start Date");
      return false;
    }
    return true;
  }

  function validateEndDate() {
    if (endDate === "") {
      setEndDateErr("Please Enter End Date");
      return false;
    }
    return true;
  }

  function validateBothDate() {
    let startVal = moment(startDate).format("YYYY-MM-DD"); //new Date(value);
    let endVal = moment(endDate).format("YYYY-MM-DD"); //new Date(value);
    if (startVal > endVal) {
      setStartDateErr("Please Enter valid Date");
      setEndDateErr("Please Enter valid Date");
      return false;
    }
    return true;
  }
  function ResetData() {
    if (startDate || endDate) {
      setStartDate("");
      setEndDate("");
      getAllVoucherList();
    }
  }

  const viewEditHandler = (id, viewPage) => {
    if (id !== null) {
      History.push("/dashboard/accounts/vouchereditview", {
        id: id,
        viewPage: viewPage,
        voucherArrList: voucherArrList,
        voucher: selectedPreVoucher,
      });
    }
  };

  const handleSelectedVoucher = (voucher) => {
    setSelectedPreVoucher(voucher);
    const idArr = [];
    voucher.VoucherSettingDetails.map((item) => {
      idArr.push(item.id);
    });
    setVoucherArrList(idArr);
  };

  function ModalView() {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={openModal}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            setOpenModal(false);
          }
        }}
      >
        <div
          id="voucher-model-popup"
          style={modalStyle}
          className={clsx(classes.paper, "rounded-8")}
        >
          <h5 className="popup-head p-5">
            Select Voucher
            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={() => setOpenModal(false)}
            >
              <Icon style={{ color: "white" }}>close</Icon>
            </IconButton>
          </h5>
          <div style={{ padding: "30px" }}>
            <div>
              <label style={{display: "block", marginBottom: "10px", paddingLeft: "15px", color: "#242424"}}>Select voucher</label>
              <Select
                classes={classes}
                styles={selectStyles}
                autoFocus
                options={preVoucher.map((optn) => ({
                  value: optn.id,
                  label: optn.name,
                  VoucherSettingDetails: optn.VoucherSettingDetails,
                }))}
                filterOption={createFilter({ ignoreAccents: false })}
                value={selectedPreVoucher}
                onChange={handleSelectedVoucher}
                placeholder="Select voucher"
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <div
      className={clsx(classes.root, props.className, "w-full")}
      style={{ height: "calc(100vh - 60px)", overflowX: "hidden" }}
    >
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div
            className="flex flex-1 flex-col min-w-0 makeStyles-root-1"
            style={{ marginTop: "30px" }}
          >
            <Grid
              className="voucherhistory-main-dv"
              container
              alignItems="center"
              style={{ paddingInline: "30px" }}
            >
              <Grid item xs={9} sm={9} md={8} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Voucher History
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
              <Grid
                item
                xs={3}
                sm={3}
                md={4}
                key="2"
                style={{ textAlign: "right" }}
              >
                {" "}
                <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={() => {
                    setOpenModal(true);
                    setStartDate("");
                    setStartDateErr("");
                    setEndDate("");
                    setEndDateErr("");
                  }}
                >
                  Change Voucher
                </Button>
              </Grid>
            </Grid>
            {loading && <Loader />}
            {openModal && ModalView()}
            <div className="main-div-alll" style={{ marginTop: "20px" }}>
              <Grid
                className="voucherhistory-main-dv"
                container
                alignItems="center"
                style={{ marginBottom: "20px" }}
              >
                {" "}
                <Grid
                  item
                  xs={12}
                  sm={8}
                  md={6}
                  key="1"
                  style={{ display: "flex" }}
                >
                  <label>Voucher Name : </label>
                  <Typography style={{ paddingInline: "10px" }}>
                    <b>{selectedPreVoucher.label}</b>
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    From date
                  </label>
                  <TextField
                    placeholder="From date"
                    name="startDate"
                    type="date"
                    value={startDate}
                    error={startDateErr.length > 0 ? true : false}
                    helperText={startDateErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                    inputProps={{
                      max: moment().format("YYYY-MM-DD")
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    To date
                  </label>
                  <TextField
                    placeholder="To date"
                    name="endDate"
                    type="date"
                    value={endDate}
                    error={endDateErr.length > 0 ? true : false}
                    helperText={endDateErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                    inputProps={{
                      max: moment().format("YYYY-MM-DD")
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12} sm={12} md={4} lg={3}
                  className={classes.filterbtn}
                >
                  <Button
                    variant="contained"
                    className={clsx(classes.button, "mb-1")}
                    size="small"
                    onClick={callFilterApi}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="contained"
                    className={clsx(classes.button, "mb-1 ml-16")}
                    size="small"
                    onClick={ResetData}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
              <div className="mt-16">
                <Paper
                  className={clsx(
                    classes.tabroot,
                    "mt-56 table-responsive createaccount-tbel-blg createaccount-tbel-dv"
                  )}
                >
                  <MaUTable className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          ID
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Voucher Number
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Ledger Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Cr
                        </TableCell>
                        <TableCell
                          className={clsx(
                            classes.tableRowPad,
                            "text-right pr-28"
                          )}
                        >
                          Dr
                        </TableCell>
                        <TableCell className={classes.tableRowPad} style={{textAlign:"center"}}>
                          Action
                        </TableCell>
                      </TableRow>
                      {/* <TableRow>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}><TextField placeholder="Date" name="voucher_date" onChange={handleSearchData} /></TableCell>
                      <TableCell className={classes.tableRowPad}><TextField placeholder="Voucher Number" name="voucher_number" onChange={handleSearchData} /></TableCell>
                      <TableCell className={classes.tableRowPad}><TextField placeholder="Ledger Name" name="LedgereName" onChange={handleSearchData} /></TableCell>
                      <TableCell className={classes.tableRowPad}><TextField placeholder="Cr" name="amount" onChange={handleSearchData} /></TableCell>
                      <TableCell className={classes.tableRowPad}><TextField placeholder="Dr" name="amount" onChange={handleSearchData} /></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                    </TableRow> */}
                    </TableHead>
                    <TableBody>
                      {voucherList
                        // .filter((temp) => {
                        //   if (searchData.voucher_date) {
                        //     return temp.voucher_date.toLowerCase().includes(searchData.voucher_date.toLowerCase())
                        //   } else if (searchData.voucher_number) {
                        //     return temp.voucher_number.toLowerCase().includes(searchData.voucher_number.toLowerCase())
                        //   } else if (searchData.LedgereName) {
                        //     return temp.LedgereName.toLowerCase().includes(searchData.LedgereName.toLowerCase())
                        //   } else if (searchData.credit_debit) {
                        //     return temp.credit_debit.toLowerCase().includes(searchData.credit_debit.toLowerCase())
                        //   } else if (searchData.amount) {
                        //     return temp.amount.toLowerCase().includes(searchData.amount.toLowerCase())
                        //   } else {
                        //     return temp
                        //   }
                        // })
                        .map((row, i) => (
                          <TableRow key={i}>
                            {row.rowspan !== 0 ? (
                              <>
                                <TableCell
                                  className={classes.tableRowPad}
                                  rowSpan={row.rowspan}
                                  style={{border:"1px solid #EBEEFB"}}
                                >
                                  {row.num}
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  rowSpan={row.rowspan}
                                  style={{border:"1px solid #EBEEFB"}}
                                >
                                  {moment(row.voucher_date).format(
                                    "DD-MM-YYYY"
                                  )}
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  rowSpan={row.rowspan}
                                  style={{border:"1px solid #EBEEFB"}}
                                >
                                  {row.voucher_number}
                                </TableCell>
                              </>
                            ) : null}
                            <TableCell className={classes.tableRowPad} style={{border:"1px solid #EBEEFB"}}>
                              {row.LedgereName}
                            </TableCell>
                            <TableCell className={classes.tableRowPad} style={{border:"1px solid #EBEEFB"}}>
                              {row.credit_debit === "Cr"
                                ? Config.numWithComma(row.amount)
                                : ""}
                            </TableCell>
                            <TableCell className={classes.tableRowPad} style={{border:"1px solid #EBEEFB",textAlign:"start"}}>
                              {row.credit_debit === "Dr"
                                ? Config.numWithComma(row.amount)
                                : ""}
                            </TableCell>
                            {row.rowspan !== 0 ? (
                              <TableCell
                                className={classes.tableRowPad}
                                rowSpan={row.rowspan}
                                style={{border:"1px solid #EBEEFB",textAlign:"center"}}
                              >
                                <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    viewEditHandler(row.id, true);
                                  }}
                                >
                                  <Icon className="mr-8 view-icone">
                                    <img src={Icones.view} alt="" />
                                  </Icon>
                                </IconButton>
                                <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    viewEditHandler(row.id, false);
                                  }}
                                >
                                  <Icon className="mr-8 edit-icone">
                                    <img src={Icones.edit} alt="" />
                                  </Icon>
                                </IconButton>
                                {row.isDelete && (
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
                                )}
                              </TableCell>
                            ) : null}
                          </TableRow>
                        ))}
                    </TableBody>
                  </MaUTable>
                </Paper>
              </div>
            </div>
            {/* <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Alert!!!"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  If you delete this entry , then voucher related to this entry will be deleted.<br />
                  <b>Are you sure you want to delete this record?</b>
                </DialogContentText>
                <div className="pl-32 pr-32 pb-5 pt-5">
                <TextField
                  className="mt-16"
                  label="Deletion Reason"
                  name="deleteReason"
                  value={deleteReason}
                  error={deleteReasonErr.length > 0 ? true : false}
                  helperText={deleteReasonErr}
                  onChange={(e) => { setDeleteReason(e.target.value); setDeleteReasonErr("") }}
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  maxrows={4}
                  minRows={4}
                />
                 </div>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteApi}
                  color="primary"
                  autoFocus
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog> */}
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              id="VoucherHistoryDialogBox"
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
                <DialogContentText id="alert-dialog-description" style={{lineHeight: 1.2}}>
                  <div>
                    If you delete this entry , then voucher related to this
                    entry will be deleted.
                    <br />
                    <b>Are you sure you want to delete this record?</b>
                  </div>
                </DialogContentText>
              </DialogContent>
              <div className="pl-32 pr-32 pb-5 pt-5">
                <p className="popup-labl" style={{marginBottom: "10px", paddingLeft: "15px"}}>Deletion reason</p>
                <TextField
                  className="mt-1 input-select-bdr-dv"
                  placeholder="Deletion Reason"
                  name="deleteReason"
                  value={deleteReason}
                  error={deleteReasonErr.length > 0 ? true : false}
                  helperText={deleteReasonErr}
                  onChange={(e) => {
                    setDeleteReason(e.target.value);
                    setDeleteReasonErr("");
                  }}
                  variant="outlined"
                  required
                  fullWidth
                  multiline
                  maxrows={4}
                  minRows={4}
                />
              </div>
              <DialogActions style={{display: "flex", columnGap: "20px", justifyContent: "center", marginTop: "20px"}}>
                <Button
                  onClick={handleClose}
                  className="delete-dialog-box-cancle-button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteApi}
                  className="delete-dialog-box-delete-button"
                  autoFocus
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

export default VoucherHistory;

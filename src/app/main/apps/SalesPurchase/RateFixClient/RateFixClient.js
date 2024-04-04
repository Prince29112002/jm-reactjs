import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, styled } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Icon, IconButton, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Loader from '../../../Loader/Loader';
import moment from "moment";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  filterBtn: {
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
    marginBlock: "3px",
  },
  button: {
    textTransform: "none",
    backgroundColor: "#415BD4", 
    color: "white",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  filterbtn: {
    marginTop:'22px',
    display: 'flex',
    justifyContent: 'flex-start',

    [theme.breakpoints.down('xs')]: {
      justifyContent: 'flex-end',
    },
  },
}));


const RateFixClient = (props) => {

  const [listData, setListData] = useState([]);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [startDate, setStartDate] = useState(moment().startOf("month").format("YYYY-MM-DD"));
  const [startDateErr, setStartDateErr] = useState("");
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDateErr, setEndDateErr] = useState("");
  const [searchData, setSearchData] = useState({
    date: '',
    voucher_no: '',
    Fname: '',
    Cname: '',
    weight: '',
    rate: '',
    amount: '',
    balance: '',
  });
  const dispatch = useDispatch();
  const adminId = localStorage.getItem('userId')
  const [deleteReason, setDeleteReason] = useState("")
  const [deleteReasonErr, setDeleteReasonErr] = useState("")
 
  useEffect(() => {
    // getAllClientRateFix();
    callSearchFilterApi()
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Sales", dispatch);
    //eslint-disable-next-line
  }, []);

  function getAllClientRateFix() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/ratefix/all/client/rate")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let fixData = response.data.data;
          let tempData = response.data.clientTempRateFix;
          let dataArr = [...fixData, ...tempData];
          setListData(dataArr);
        }
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {api:"api/ratefix/all/client/rate"})

      });
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
    setDeleteReason("")
    setDeleteReasonErr("")
  }

  const validateDelete = () => {
    if(deleteReason === ""){
      setDeleteReasonErr("Enter Valid delete reason");
      return false
    }
    return true;
  }

  function callDeleteRateFixApi() {
    if(validateDelete()){
      const body = {
        delete_remark : deleteReason,
        admin_id : adminId
      }  
      axios
      .post(Config.getCommonUrl() + "api/ratefix/" + selectedIdForDelete , body)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          getAllClientRateFix()
          dispatch(Actions.showMessage({ message: "Deleted Successfully" }));
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {api:"api/ratefix/" + selectedIdForDelete, body})
      });
      handleClose()
    }
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "startDate") {
      setStartDate(value);
      setStartDateErr("");
    } else if (name === "endDate") {
      setEndDate(value);
      setEndDateErr("");
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

  function callFilterApi() {
    if (validateStartDate() && validateEndDate() && validateBothDate()) {
      callSearchFilterApi()
    }
  }

  function callSearchFilterApi() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/ratefix/all/client/rate?start=${startDate}&end=${endDate}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let fixData = response.data.data;
          let tempData = response.data.clientTempRateFix;
          let dataArr = [...fixData, ...tempData]
          setListData(dataArr);
        }
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {api:`api/ratefix/all/client/rate?start=${startDate}&end=${endDate}`})

      });
  }

  function ResetData() {
    if (startDate || endDate) {
      setStartDate("")
      setEndDate("")
      getAllClientRateFix();
    }
  }

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState, [name]: value
    })
    );
  }

  function checkAndAdd() {
    props.history.push("/dashboard/sales/addrateClient");
  }


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0" style={{ marginTop: "30px" }}>
            <Grid
              container
              alignItems="center"
              style={{ paddingInline: "30px" }}
            >
              <Grid item xs={9} sm={9} md={8} key="1">
                <FuseAnimate delay={300}>
                  {/* <Typography className="p-16 pb-0 text-18 font-700"> */}
                  <Typography className="text-18 font-700">
                    Rate Fix Client
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
                <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={(event) => {
                    checkAndAdd();
                  }}
                >
                  Add New
                </Button>
              </Grid>
            </Grid>
            <div className="main-div-alll" style={{ marginTop: "20px" }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item lg={3} xs={12} sm={4} md={3} key="2">
                  <label style={{ paddingBottom: "5px" }}>From Date</label>
                  <TextField
                      name="startDate"
                      className="mt-1"
                      value={startDate}
                      error={startDateErr.length > 0 ? true : false}
                      helperText={startDateErr}
                      type="date"
                      onChange={(e) => handleInputChange(e)}
                      // onKeyDown={(e => e.preventDefault())}
                      variant="outlined"
                      fullWidth
                      format="yyyy/MM/dd"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                </Grid>

                <Grid item lg={3} xs={12} sm={4} md={3} key="3">
                  <label style={{ paddingBottom: "5px" }}>To Date</label>
                  <TextField
                    className="mt-1"
                    name="endDate"
                    value={endDate}
                    error={endDateErr.length > 0 ? true : false}
                    helperText={endDateErr}
                    type="date"
                    onChange={(e) => handleInputChange(e)}
                    // onKeyDown={(e => e.preventDefault())}
                    variant="outlined"
                     fullWidth
                      format="yyyy/MM/dd"
                      InputLabelProps={{
                        shrink: true,
                      }}
                  />
                </Grid>

                <Grid item lg={3} md={4} sm={4} xs={12} className={classes.filterbtn}>
                  <Button
                    variant="contained"
                    className={classes.filterBtn}
                    size="small"
                    onClick={callFilterApi}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="contained"
                    className={clsx(classes.filterBtn, "ml-16")}
                    size="small"
                    onClick={ResetData}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
              {loading && <Loader />}
              <div className="mt-20">
                <Paper
                  className={clsx(
                    classes.tabroot,
                    "table-responsive ratefix_tabel_dv ratefix_tabel_dv-blg view_ratefix_tabel_dv-blg"
                  )}
                >
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>ID</TableCell>

                        <TableCell className={classes.tableRowPad} align="left">
                          Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Voucher No
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Firm Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Client Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Balance
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Weight
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Rate
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Total
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Action
                        </TableCell>
                      </TableRow>
                         <TableRow>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}>
                        <TextField  
                            placeholder="Date" 
                            name="date" 
                            inputProps={{ className: "all-Search-box-data" }}
                            onChange={handleSearchData} />
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        <TextField 
                            placeholder="Voucher Number"  
                            inputProps={{ className: "all-Search-box-data" }}
                        name="voucher_no" onChange={handleSearchData} />
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        <TextField placeholder="Firm Name" name="Fname" inputProps={{ className: "all-Search-box-data" }}
                        onChange={handleSearchData} />
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        <TextField placeholder="Client Name" name="Cname" inputProps={{ className: "all-Search-box-data" }}
                        onChange={handleSearchData} />
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        <TextField placeholder="Balance" name="balance" inputProps={{ className: "all-Search-box-data" }}
                        onChange={handleSearchData} />
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        <TextField placeholder="Weight" name="weight" inputProps={{ className: "all-Search-box-data" }}
                        onChange={handleSearchData} />
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        <TextField placeholder="Rate" name="rate" inputProps={{ className: "all-Search-box-data" }}
                        onChange={handleSearchData} />
                      </TableCell>

                      <TableCell className={classes.tableRowPad}>
                        <TextField placeholder="Total" name="amount" inputProps={{ className: "all-Search-box-data" }}
                         onChange={handleSearchData} />
                      </TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                      {listData.length > 0 ? (
                        listData
                        .filter(
                          (temp) => {
                            if (searchData.date) {
                              return temp.date
                                .toLowerCase()
                                .includes(searchData.date.toLowerCase())
                            } else if (searchData.voucher_no) {
                              return temp.voucher_no
                                .toLowerCase()
                                .includes(searchData.voucher_no.toLowerCase())
                            } else if (searchData.Fname) {
                              return temp.Compnyname !== null ? temp.Compnyname.company_name
                                .toLowerCase()
                                .includes(searchData.Fname.toLowerCase()) : null
                            } else if (searchData.Cname) {
                              return temp.Clientname !== null ? temp.Clientname.name
                                .toLowerCase()
                                .includes(searchData.Cname.toLowerCase()) : null
                            } else if (searchData.balance) {
                              return temp.balance ? temp.balance
                                .toLowerCase()
                                .includes(searchData.balance.toLowerCase()) : null
                            } else if (searchData.weight) {
                              return temp.weight.toString()
                                .toLowerCase()
                                .includes(searchData.weight.toLowerCase())
                            } else if (searchData.rate) {
                              return temp.rate.toString()
                                .toLowerCase()
                                .includes(searchData.rate.toLowerCase())
                            } else if (searchData.amount) {
                              return temp.amount.toString()
                                .toLowerCase()
                                .includes(searchData.amount.toLowerCase())
                            } else {
                              return temp
                            }
                          })
                          .map((row, i) => (
                            <TableRow key={i}>
                          <TableCell className={classes.tableRowPad}>
                            {i + 1}
                          </TableCell>
                          {console.log(row)}
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {/* {row.date} */}

                            {row.date}
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            {row.voucher_no}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {row.Compnyname !== null
                              ? row.Compnyname.company_name
                              : "-"}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {row.Clientname ? row.Clientname.name : "-"}
                          </TableCell>
                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {row.balance ? parseFloat(row.balance).toFixed(3) : parseFloat(row.weight).toFixed(3)}
                          </TableCell>
                          <TableCell
                            // align="left"
                            style={{textAlign:"left"}}
                            className={classes.tableRowPad}
                          >
                            {parseFloat(row.weight).toFixed(3)}
                          </TableCell>

                          <TableCell
                            // align="left"
                            style={{textAlign:"left"}}
                            className={classes.tableRowPad}
                          >
                            {Config.numWithComma(row.rate)}
                          </TableCell>

                          <TableCell
                            align="left"
                            className={classes.tableRowPad}
                          >
                            {Config.numWithComma(row.amount)}
                          </TableCell>

                          <TableCell className={classes.tableRowPad}>   
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
                          ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan="9"
                            style={{ textAlign: "center", color: "red" }}
                          >
                            <b>No Data Available</b>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Paper>
              </div>
            </div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              id="DialogBox"
            >
              <DialogTitle id="alert-dialog-title" className="popup-delete">{"Alert!!!"}<IconButton
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
                </IconButton></DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this record?
                </DialogContentText>
                <div className="pl-32 pr-32 pb-5 pt-5">
                <p className="popup-labl">Deletion reason</p>
                <TextField
                      className="mt-1 input-select-bdr-dv"
                      placeholder="Deletion reason"
                      name="deleteReason"
                      value={deleteReason}
                      error={deleteReasonErr.length > 0 ? true : false}
                      helperText={deleteReasonErr}
                      onChange={(e) => {setDeleteReason(e.target.value); setDeleteReasonErr("")}}
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
                <Button onClick={handleClose} className="delete-dialog-box-cancle-button">
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteRateFixApi}
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

export default RateFixClient;

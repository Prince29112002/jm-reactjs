import React, { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
// import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import { FuseAnimate } from "@fuse";
// import Select, { createFilter } from "react-select";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import { TextField, Checkbox, FormControl, FormControlLabel } from "@material-ui/core";
import clsx from "clsx";
import AppContext from "app/AppContext";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { CSVLink } from "react-csv";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import {
  Button,
  Box,
  Grid,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";
import { Today } from "@material-ui/icons";
import moment from "moment";
import RadioGroup from "@material-ui/core/RadioGroup";
import Icones from "assets/fornt-icons/Mainicons";
import { Icon, IconButton } from "@material-ui/core";

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
    margin: 5,
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
    minWidth: 1000,
  },
  tableRowPad: {
    padding: 7,
  },
  colorBox: {
    display: "block",
    width: 20,
    height: 20,
  },
  danger: {
    backgroundColor: "#ff1b1c33",
  },
  orange: {
    backgroundColor: "#ff8a8d",
  },
  green: {
    backgroundColor: "#ff7f114d",
  },
  paperModal: {
    position: "absolute",
    maxWidth: 1150,
    width: "calc(100% - 30px)",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
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

const WeeklyReminderReport = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const appContext = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [reportMortage, setReportMortage] = useState([]);
  const [todayDate, setTodayDate] = useState("");
  const [reminderDate, setReminderDate] = useState("")
  const [reminderDateErr, setReminderDateErr] = useState("")
  const [notes, setNotes] = useState("")
  const [editId, setEditId] = useState("")
  const [modalStyle] = useState(getModalStyle);
  // for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [count, setCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [showGoldSilverVarient, setShowGoldSilverVarient] = useState(1);
  const [flagFilter, setFlagFilter] = useState("4");
  const [modalOpenView, setModalOpenView] = useState(false);
  const [readOneData, setReadOneData] = useState([]);
  const [imgFiles, setImgFile] = useState([]);
  const [mortgagePayments, setMortgagePayments] = useState([]);
  const [mortagePartialEntry, setMortagePartialEntry] = useState([]);
  const [productData, setProductData] = useState([]);
  const [totalSilverWeight, setTotalSilverWeight] = useState("");
  const [totalGoldWeight, setTotalGoldWeight] = useState("");
  const csvLink = React.useRef(null);
  const [csvData, setCSVData] = useState([])
  // const MaxDate = moment().add(5, 'days').format("DD-MM-YYYY");
  // const MinDate = moment().subtract(5, "days").format("DD-MM-YYYY");

  // console.log(MaxDate ,MinDate)
  // console.log(MaxDate)

  useEffect(() => {
    NavbarSetting("Reports-Retailer", dispatch);
  }, []);

  const dispatch = useDispatch();
  useEffect(() => {
    setReportMortage([])
    setPage(0)
    setCount(0)
    setFilters();
  }, [flagFilter]);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const setToday = `${year}-${month}-${day}`;
    setTodayDate(setToday);
  }, []);

  function getMortageReportData(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          const data = response.data.data;
          setCount(Number(response.data.totalRecord));
          if (reportMortage.length === 0) {
            console.log("if");
            setReportMortage(data);
          } else {
            setReportMortage((reportMortage) => [...reportMortage, ...data]);
          }
          setLoading(false);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: url,
        });
      });
  }

  function setFilters(tempPageNo) {
    // retailerProduct/api/mortage/list/collectionReport?filter=3&is_gold_silver=1&page=1&filterFlag=0
    //  `retailerProduct/api/mortage/list/report?filter=${3}&is_gold_silver=${showGoldSilverVarient}&`;
     let url = `retailerProduct/api/mortage/list/collectionReport?filter=${3}&`
    if (page !== "") {
      if (!tempPageNo) {
        url = url + "page=" + 1;
      } else {
        url = url + "page=" + tempPageNo;
      }
    }

    if(flagFilter && flagFilter !== "4"){
      url = url + "&filterFlag=" + flagFilter;
    }
    
    if (!tempPageNo) {
      getMortageReportData(url);
    } else {
      if (count > reportMortage.length) {
        getMortageReportData(url);
      }
    }
  }

  function exportFile() {
    if (reportMortage.length > 0) {
      getCsvReportData()
    } else {
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data",variant:"error" }));
    }
  }

  function getCsvReportData() {
    setLoading(true);
    const api = `retailerProduct/api/mortage/list/collectionReport?filter=3&filterFlag=${flagFilter}&is_download=1`
    axios
      .get(Config.getCommonUrl() + api)
      .then(function (response) {
        if (response.data.success === true) {
          const data = response.data.data;
          const csvArr = []
          data.map((item)=>{
            csvArr.push({
              "Issue Date" : item.issue_date,
              "Document No." : item.doc_number,
              "Name" : item.MortgageUser.name,
              "Mobile No." : item.MortgageUser.name,
              "Notes": item?.notes,
              "Reminder Date": item?.reminder_date,
              "Net WT(Gram)" : item.weight,
              "Interest (%)" : item.percentage,
              "Principle Amount" : Config.numWithComma(item.principal_amount),
              "Close Amount" :  Config.numWithComma(
                item.close_amount
              ),
            })
          })
          setCSVData(csvArr);
          setLoading(false);
          csvLink.current.link.click();
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: api,
        });
      });
  }


  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 20 > reportMortage.length) {
      setFilters(Number(newPage + 1));
    }
  }

  const editHandler = (data) => {
    setModalOpen(true);
    setEditId(data.id)
    setReminderDate(data.reminder_date)
    setNotes(data.notes)
  }

  function getMortgageDetail(clientId) {
    axios
      .get(Config.getCommonUrl() + `retailerProduct/api/mortage/${clientId}`)
      .then(function (response) {
        if (response.data.success === true) {
          setModalOpenView(true);
          setReadOneData(response.data.data);
          setImgFile(response.data.data.MortgageDoc);
          setMortagePartialEntry(response.data.data.MortagePartialEntry);
          setMortgagePayments(response.data.data.MortgagePayments);
          setProductData(response.data.data.MortgageProducts);
          if (response.data.data.is_gold_silver) {
            const silverProducts = response.data.data.MortgageProducts.filter(
              (product) => product.is_gold_silver === 2
            );
            const goldProducts = response.data.data.MortgageProducts.filter(
              (product) => product.is_gold_silver === 1
            );

            const totalSilverWeights = silverProducts.reduce(
              (total, product) => total + parseFloat(product.weight),
              0
            );
            const totalGoldWeights = goldProducts.reduce(
              (total, product) => total + parseFloat(product.weight),
              0
            );

            setTotalGoldWeight(totalGoldWeights);
            setTotalSilverWeight(totalSilverWeights);
          }
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/client/company/listing/listing/${clientId}`,
        });
      });
  }

  const handleModalClose = () => {
    setModalOpen(false);
    setReminderDate("")
    setReminderDateErr("")
    setNotes("")
    setEditId("")
  }

  const validateDate = (date) => {
    if(reminderDate === "") {
      setReminderDateErr("Select Reminder Date")
      return false
    }
    return true
  }

  const checkforUpdate = () => {
    if(validateDate()){
      const body = {
        "reminder_date": reminderDate,
        "notes": notes
      }
      axios
      .put(Config.getCommonUrl() + `retailerProduct/api/mortage/reminderDate/collectionReport/${editId}`, body)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setReportMortage([])
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          handleModalClose();  
          getMortageReportData(`retailerProduct/api/mortage/list/report?filter=${3}&page=1`)
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
          api: `retailerProduct/api/mortage/reminderDate/collectionReport/${editId}`,
          body
        });
      });
    }
  }

  const perPageWgtTotal = (key) => {
    const data = reportMortage.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    const total = HelperFunc.getTotalOfField(data, key);
    return total;
  };

  function handleModalCloseView() {
    setModalOpenView(false);
    setTotalSilverWeight("");
    setTotalGoldWeight("");
  }


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0  makeStyles-root-1">
            <Grid
              container
              alignItems="center"
              style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
            >
              <Grid item xs={9} sm={9} md={8} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Collection Reminder Report
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>
            <div className="main-div-alll">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: "20px",
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                }}
              >
                 <FormControl component="fieldset" className={classes.formControl}>
      <RadioGroup
        name="flagFilter"
        className={classes.group}
        value={flagFilter}
        onChange={(event)=>setFlagFilter(event.target.value)} // Handle change of selected value
        style={{ flexDirection: "row" }}
      >
         <FormControlLabel
          value="4"
          control={<Radio />}
          label="All Data"
        />
        <FormControlLabel
          value="0"
          control={<Radio />}
          label={
            <div style={{ display: "flex", columnGap: "10px" }}>
              <span className={`${classes.colorBox} ${classes.orange}`}></span>
              <p>Interest {">"} Total Amount</p>
            </div>
          }
        />
        <FormControlLabel
          value="1"
          control={<Radio />}
          label={
            <div style={{ display: "flex", columnGap: "10px" }}>
              <span className={`${classes.colorBox} ${classes.danger}`}></span>
              <p>Today's date & Past date</p>
            </div>
          }
        />
        <FormControlLabel
          value="2"
          control={<Radio />}
          label={
            <div style={{ display: "flex", columnGap: "10px" }}>
              <span className={`${classes.colorBox} ${classes.green}`}></span>
              <p>Within a week</p>
            </div>
          }
        />
      </RadioGroup>
                  </FormControl>
                  <Button
                    className={clsx(classes.filterBtn, "ml-16")}
                    // className="ml-2"
                    variant="contained"
                    color="primary"
                    aria-label="Register"
                    onClick={(event) => {
                      // setFilters();
                      exportFile();
                    }}
                  >
                    Export
                  </Button>
                  <CSVLink
                    data={csvData}
                    style={{ display: "none" }}
                    ref={csvLink}
                    target="_blank"
                    filename={
                      "Collection_Reminder" +
                      new Date().getDate() +
                      "_" +
                      (new Date().getMonth() + 1) +
                      "_" +
                      new Date().getFullYear() +
                      ".csv"
                    }
                  >
                    Export
                  </CSVLink>
              </div>
              <Paper
                style={{
                  marginTop: "16px",
                  overflowY: "auto",
                  maxHeight: "calc(100vh - 289px)",
                }}
              >
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      {/* <TableCell className={classes.tableRowPad}>Sr No.</TableCell> */}
                      <TableCell className={classes.tableRowPad}>
                        Issued Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Doc. No.
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Name
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Mobile No.
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Notes
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Reminder Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        {/* {showGoldSilverVarient === 1 ? "Gold" : "Silver"}  */}
                        Net WT(Gram)
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        Interest (%)
                      </TableCell>
                      {/* <TableCell className={classes.tableRowPad}>
                        Interest Amount
                      </TableCell> */}
                      <TableCell className={classes.tableRowPad} align="right">
                        Principal Amount
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="right"
                      >
                        Close Amount
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportMortage.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className={classes.tableRowPad}
                          style={{ textAlign: "center" }}
                        >
                          No Data Found
                        </TableCell>
                      </TableRow>
                    ) : (
                      reportMortage
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((data, i) => {
                          // console.log(moment(data.reminder_date).diff(todayDate, 'days'));
                          // console.log(moment(data.reminder_date).diff(todayDate, 'days') > 7);
                          return (
                            <TableRow
                              key={i}
                              style={{
                                backgroundColor:
                                  data.product_amount_total !== 0 &&
                                  data.close_amount > data.product_amount_total
                                    ? "#ff8a8d"
                                    : moment(data.reminder_date).isSameOrBefore(
                                        todayDate,
                                        "day"
                                      )
                                    ? "#ff1b1c33"
                                    : moment(data.reminder_date).diff(
                                        todayDate,
                                        "days"
                                      ) > 7
                                    ? "initial"
                                    : "#ff7f1129",
                              }}
                            >
                              {/* <TableCell className={classes.tableRowPad}>
                            {page * rowsPerPage + i + 1}
                          </TableCell> */}
                              <TableCell className={classes.tableRowPad}>
                                {/* {data.issue_date} */}
                                {moment(data.issue_date).format("DD-MM-YYYY")}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data.doc_number}
                                {data.deleted_at && data.is_close === 0 && (
                                  <span
                                    style={{
                                      paddingInline: 4,
                                      paddingBlock: 2,
                                      borderRadius: 25,
                                      marginLeft: 15,
                                      background: "red",
                                      color: "#ffffff",
                                      display: "inline-block",
                                    }}
                                  >
                                    Deleted
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data.MortgageUser.name}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data.MortgageUser.mobile_number}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data.notes ? data.notes : "-"}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {moment(data.reminder_date).format(
                                  "DD-MM-YYYY"
                                )}
                                {/* {data.reminder_date} */}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="right"
                              >
                                {data.weight}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="right"
                              >
                                {data.percentage}
                              </TableCell>
                              {/* <TableCell className={classes.tableRowPad}>
                            {data.interest_amount
                                ? data.interest_amount
                                : "-"}
                          </TableCell> */}
                              <TableCell
                                className={classes.tableRowPad}
                                align="right"
                              >
                                {Config.numWithComma(data.principal_amount)}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad} align="right"
                              >
                                {Config.numWithComma(data.close_amount)}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad} align="right"
                               style={{paddingRight:"26px"}}
                              >
                                  <IconButton
                                    style={{ padding: "0" }}
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                       editHandler(data);
                                    }}
                                  >
                                     
                                    <Icon className="mr-8 edit-icone">
                                      <img src={Icones.edit} alt="" />
                                    </Icon>
                                    </IconButton> 
                                    <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    getMortgageDetail(
                                      data.mortage_id
                                        ? data.mortage_id
                                        : data.id
                                    );
                                  }}
                                >
                                  <Icon className="mr-8 view-icone">
                                    <img src={Icones.view} alt="" />
                                  </Icon>
                                    </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow style={{ backgroundColor: "#ebeefb" }}>
                      <TableCell className={classes.tableRowPad} colSpan={2}>
                        <b>Grand Total</b>
                      </TableCell>

                      {/* <TableCell className={classes.tableRowPad}></TableCell> */}
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        <b>{perPageWgtTotal("weight")}</b>
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        align="right"
                      ></TableCell>
                      {/* <TableCell className={classes.tableRowPad}>
                        <b>
                          {HelperFunc.getTotalOfField(
                            reportMortage,
                            "interest_amount"
                          )}
                        </b>
                      </TableCell> */}
                      <TableCell className={classes.tableRowPad} align="right">
                        <b>
                          {Config.numWithComma(
                            perPageWgtTotal("principal_amount")
                          )}
                          {/* {Config.numWithComma(HelperFunc.getTotalOfField(
                            reportMortage,
                            "principal_amount"
                          ))} */}
                        </b>
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad} align="right"
                        // style={{ paddingRight: "20px" }}
                      >
                        <b>
                          {Config.numWithComma(perPageWgtTotal("close_amount"))}
                          {/* {Config.numWithComma(HelperFunc.getTotalOfField(
                            reportMortage,
                            "principal_amount"
                          ))} */}
                        </b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </Paper>
              <TablePagination
                labelRowsPerPage=""
                component="div"
                // count={apiData.length}
                count={count}
                rowsPerPage={20}
                page={page}
                backIconButtonProps={{
                  "aria-label": "Previous Page",
                }}
                nextIconButtonProps={{
                  "aria-label": "Next Page",
                }}
                onPageChange={handleChangePage}
                // onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </div>
            <Modal
              // disableBackdropClick
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={modalOpen}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleModalClose(false);
                }
              }}
            >
              <div
                style={modalStyle}
                className={clsx(classes.paper, "rounded-8")}
              >
                <h5 className="popup-head p-20">
                 Reminder Date
                  <IconButton
                    style={{ position: "absolute", top: "3px", right: "6px" }}
                    onClick={handleModalClose}
                  >
                    <Icon>
                      <img src={Icones.cross} alt="" />
                    </Icon>
                  </IconButton>
                </h5>
                <div
                  className="pl-32 pr-32 pt-10 pb-10"
                  
                >
                  <p className="popup-labl pb-4 pt-12">Reminder Date</p>
                  <TextField
                  // label="From Date"
                  name="reminderDate"
                  value={reminderDate}
                  error={reminderDateErr.length > 0 ? true : false}
                  helperText={reminderDateErr}
                  type="date"
                  onChange={(e) => {setReminderDate(e.target.value); setReminderDateErr("")}}
                  onKeyDown={(e => e.preventDefault())}
                  variant="outlined"
                  fullWidth
                  // inputProps={{
                  //   min : moment().format("YYYY-MM-DD")
                  // }}
                  format="yyyy/MM/dd"
                  InputLabelProps={{
                      shrink: true,
                  }} />

                <p className="popup-labl pb-4 pt-12">Notes</p>
                  <TextField
                  name="notes"
                  value={notes}
                  onChange={(e) => {setNotes(e.target.value);}}
                  variant="outlined"
                  fullWidth
                  
                  />
                  <br />
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
            <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={modalOpenView}
            onClose={(_, reason) => {
              if (reason !== "backdropClick") {
                handleModalCloseView(false);
              }
            }}
          >
            <div
              style={modalStyle}
              className={clsx(classes.paperModal, "rounded-8")}
            >
              <>
                <h5 className="popup-head p-20">
                  {/* {isEdit === true
              ? "Edit Category"
              : isView
              ? "View Category"
              : "Add New Category"} */}
                  View Mortgage Details
                  <IconButton
                    style={{ position: "absolute", top: "3px", right: "6px" }}
                    onClick={handleModalCloseView}
                  >
                    <Icon>
                      <img src={Icones.cross} alt="" />
                    </Icon>
                  </IconButton>
                </h5>
                <Box
                  style={{
                    overflowX: "auto",
                    maxHeight: "calc(100vh - 200px)",
                  }}
                >
                  <div style={{ padding: "30px" }}>
                    <Grid container spacing={2} alignItems="flex-end">
                      <Grid item xs={12}>
                        {/* <div style={{padding: 7, background: "#ccc", display: "inline-block", borderRadius: 10}}> */}
                        {console.log(readOneData.is_gold_silver)}
                        <Tabs
                          value={readOneData.is_gold_silver}
                          variant="scrollable"
                          scrollButtons="auto"
                        >
                          <Tab label="Gold" className={classes.tab} value={1} />
                          <Tab
                            label="Silver"
                            className={classes.tab}
                            value={2}
                          />
                          <Tab label="Mix" className={classes.tab} value={3} />
                        </Tabs>
                        {/* </div> */}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        style={{ marginTop: "15px", position: "relative" }}
                      >
                        <label className={classes.label}>Document No</label>
                        <TextField
                          name="documentnumb"
                          variant="outlined"
                          fullWidth
                          value={readOneData.doc_number}
                          disabled
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        style={{ marginTop: "15px", position: "relative" }}
                      >
                        <label className={classes.label}>Name</label>
                        <TextField
                          name="name"
                          variant="outlined"
                          fullWidth
                          value={readOneData?.MortgageUser?.name}
                          required
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>Mobile Number</label>
                        <TextField
                          name="mobilenumber"
                          variant="outlined"
                          fullWidth
                          value={readOneData?.MortgageUser?.mobile_number}
                          required
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>Address</label>
                        <TextField
                          name="address"
                          variant="outlined"
                          type="text"
                          fullWidth
                          value={readOneData?.MortgageUser?.address}
                          required
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>Issue Date</label>
                        <TextField
                          name="issue_date"
                          value={readOneData.issue_date}
                          type="date"
                          variant="outlined"
                          fullWidth
                          inputProps={{
                            max: moment().format("DD-MM-YYYY"),
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          required
                          disabled
                        />
                      </Grid>
                      {readOneData.is_gold_silver === 3 && (
                        <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <label className={classes.label}>
                                {/* {selectshowGoldSilverVarient === 1 ? "Gold" : "Silver"} */}
                                Total Gold Weight(G)
                              </label>
                              <TextField
                                name="gold_weight"
                                variant="outlined"
                                fullWidth
                                value={parseFloat(totalGoldWeight).toFixed(3)}
                                disabled
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <label className={classes.label}>
                                {/* {selectshowGoldSilverVarient === 1 ? "Gold" : "Silver"} */}
                                Total Silver Weight(G)
                              </label>
                              <TextField
                                name="gold_weight"
                                variant="outlined"
                                fullWidth
                                value={parseFloat(totalSilverWeight).toFixed(3)}
                                disabled
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>
                          {/* {selectshowGoldSilverVarient === 1 ? "Gold" : "Silver"} */}
                          Total Weight(G)
                        </label>
                        <TextField
                          name="gold_weight"
                          variant="outlined"
                          fullWidth
                          value={parseFloat(readOneData.weight).toFixed(3)}
                          required
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <div>
                          <label className={classes.label}>Issue Amount</label>
                          <TextField
                            name="issue_amount"
                            variant="outlined"
                            fullWidth
                            value={readOneData.principal_amount}
                            required
                            disabled
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <div>
                          <label className={classes.label}>
                            Customer Review
                          </label>
                          <TextField
                            name="cutomerreview"
                            variant="outlined"
                            fullWidth
                            value={readOneData?.review}
                            required
                            disabled
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>
                          Interest Percentage (%)
                        </label>
                        <TextField
                          name="percentage"
                          variant="outlined"
                          fullWidth
                          value={readOneData.percentage}
                          required
                          disabled
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        style={{ marginTop: "15px", position: "relative" }}
                      >
                        <div className="packing-slip-input height">
                          <label className={classes.label}>Note</label>
                          <TextField
                            name="notes"
                            variant="outlined"
                            fullWidth
                            value={readOneData?.notes}
                            required
                            disabled
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} md={6} style={{ marginTop: "15px" }}>
                        <label className={classes.label}>Reminder Date</label>
                        <TextField
                          name="remindardate"
                          type="date"
                          variant="outlined"
                          fullWidth
                          inputProps={{
                            max: moment().format("DD-MM-YYYY"),
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          value={readOneData.reminder_date}
                        />
                      </Grid>
                      <Grid item xs={12} style={{ marginTop: "15px" }}>
                        <RadioGroup
                          row
                          aria-labelledby="demo-radio-buttons-group-label"
                          value={parseFloat(readOneData?.is_simple_compound)}
                          name="simpleorcompound"
                        >
                          <FormControlLabel
                            value={1}
                            disabled
                            control={<Radio />}
                            label="Simple Interest"
                          />
                          <FormControlLabel
                            value={2}
                            disabled
                            control={<Radio />}
                            label="Compound Interest (Monthly)"
                          />
                          <FormControlLabel
                            value={3}
                            disabled
                            control={<Radio />}
                            label="Compound Interest (Yearly)"
                          />
                        </RadioGroup>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      spacing={2}
                      justifyContent="flex-start"
                      style={{ marginTop: 16 }}
                    >
                      <>
                        {imgFiles
                          // .filter((row) =>
                          //   /\.(gif|jpe?g|png|webp|bmp|svg)$/i.test(row.upload_file_name)
                          // )
                          .map((row, index) => {
                            console.log(row.image_file);
                            return (
                              <Grid item key={index}>
                                <div
                                  style={{
                                    padding: 10,
                                    border: "1px dashed black",
                                    borderRadius: "25px",
                                    cursor: "pointer",
                                    position: "relative",
                                  }}
                                >
                                  {console.log(row)}
                                  <img
                                    src={row.image_file}
                                    style={{
                                      width: "auto",
                                      height: "100px",
                                      marginInline: "auto",
                                      display: "block",
                                    }}
                                    alt="img"
                                    onClick={() => {
                                      // setModalView(3);
                                      // setImageUrl(row.image_file);
                                      // setImage(row.upload_file_name);
                                    }}
                                  />
                                </div>
                              </Grid>
                            );
                          })}
                      </>
                    </Grid>
                  </div>
                  {productData.length !== 0 ? (
                    <Paper
                      style={{
                        padding: "30px",
                        boxShadow: "none",
                        paddingTop: 0,
                      }}
                    >
                      <h3 style={{ marginBottom: "10px" }}>Product Details</h3>
                      <Table style={{ marginTop: 10, tableLayout: "auto" }}>
                        <TableHead style={{ position: "static" }}>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              Issue Date
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Metal Type
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Product Name
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Gross Weight
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Net Weight
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Purity
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Fine
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Rate
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              PCS
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Amount
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ paddingRight: 20, textAlign: "left" }}
                            >
                              Close Date
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {productData.map((data, index) => (
                            <TableRow
                              key={index}
                              style={{
                                backgroundColor:
                                  data.close_date !== null
                                    ? "#ffcfcf4a"
                                    : "inherit",
                              }}
                            >
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {moment(data.issue_date).format("DD-MM-YYYY")}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {data.is_gold_silver === 1 ? "Gold" : "Silver"}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {data.product_name}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {data.gross_weight
                                  ? parseFloat(data.gross_weight).toFixed(3)
                                  : "-"}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {parseFloat(data.weight).toFixed(3)}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {data.purity ? data.purity : "-"}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {data.fine ? data.fine : "-"}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {data.current_rate ? data.current_rate : "-"}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {data.pcs ? data.pcs : "-"}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                }}
                              >
                                {data.product_amount
                                  ? data.product_amount
                                  : "-"}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{
                                  paddingRight: 20,
                                  color:
                                    data.close_date !== null
                                      ? "#d12e2e"
                                      : "inherit",
                                  textAlign: "left",
                                }}
                              >
                                {data.close_date
                                  ? moment(data.close_date).format("DD-MM-YYYY")
                                  : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper>
                  ) : null}

                  <>
                    {mortgagePayments.length > 1 ? (
                      <Paper
                        style={{
                          padding: "30px",
                          boxShadow: "none",
                          paddingTop: 0,
                        }}
                      >
                        <h3 style={{ marginBottom: "10px" }}>
                          New Issue Amount
                        </h3>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
                                Date
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Amount
                              </TableCell>
                              {/* <TableCell
                                className={classes.tableRowPad}
                                style={{ textAlign: "left" }}
                              >
                                Interest
                              </TableCell> */}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {mortgagePayments
                              .filter((data) => data.is_added !== 0)
                              .map((data, i) => (
                                <TableRow key={i}>
                                  <TableCell className={classes.tableRowPad}>
                                    {moment(data.issue_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    style={{ textAlign: "left" }}
                                  >
                                    {data.amount}
                                  </TableCell>
                                  {/* <TableCell
                                  className={classes.tableRowPad}
                                  style={{ textAlign: "left" }}
                                >
                                  {data.interest}
                                </TableCell> */}
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    ) : null}
                  </>
                  <>
                    {mortagePartialEntry.length > 0 ? (
                      <Paper
                        style={{
                          padding: "30px",
                          boxShadow: "none",
                          paddingTop: 0,
                        }}
                      >
                        <h3 style={{ marginBottom: "10px" }}>
                          Partial Payments
                        </h3>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
                                Date
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Principal Amount
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Refinance Amount
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Interest
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Paid Amount
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Balance
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                style={{ textAlign: "left" }}
                              >
                                Type
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {mortagePartialEntry
                              // .filter((data) => data.is_added !== 1)
                              .map((data, i) => (
                                <TableRow key={i}>
                                  <TableCell className={classes.tableRowPad}>
                                    {moment(data.payment_date).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.principal_amount}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.added_amount}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.interest}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.part_pay_amount}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.remaining_balance}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    style={{ textAlign: "left" }}
                                  >
                                    <span
                                      style={{
                                        padding: 3,
                                        borderRadius: 4,
                                        background: "#ebeefb",
                                        color:
                                          data.is_added === 1 ? "green" : "red",
                                      }}
                                    >
                                      {data.is_added === 1 ? "Added" : "Paid"}
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </Paper>
                    ) : null}
                  </>
                </Box>
              </>
            </div>
          </Modal>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default WeeklyReminderReport;

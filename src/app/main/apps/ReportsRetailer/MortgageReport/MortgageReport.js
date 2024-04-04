import React, { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
// import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import { FuseAnimate } from "@fuse";
import Select, { AsyncCreatable, createFilter } from "react-select";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import AppContext from "app/AppContext";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";
import SearchIcon from "@material-ui/icons/Search";
import Icones from "assets/fornt-icons/Mainicons";
import * as XLSX from "xlsx";

import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Icon,
  IconButton,
  InputBase,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { MortgageReportPrint } from "./MortgageReportPrint/MortgageReportPrint";
// import { createFilter } from "react-select";

const useStyles = makeStyles((theme) => ({
  root: {},
  paperModal: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  paper: {
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
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    minWidth: 1500,
    // marginTop: 16,
    // height: "calc(100vh - 200px)",
    // overflowX: "auto",
  },
  tableRowPad: {
    padding: 7,
  },
  button: {
    // margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  overflowSet: {},
  search: {
    display: "flex",
    border: "1px solid #cccccc",
    height: "38px",
    width: "100%",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
    marginLeft: "auto",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "100%",
    height: "37px",
    color: "#CCCCCC",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter",
  },
  tab: {
    padding: 0,
    minWidth: "auto",
    marginInline: 10,
    textTransform: "uppercase",
    zIndex: 9,
    minHeight: "40px",
    // lineHeight: "initial",
    color: "#415BD4",
  },
  textright: {
    textAlign: "right !important",
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
const MortgageReport = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const csvLink = React.useRef(null);
  const [modalStyle] = React.useState(getModalStyle);
  const appContext = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [reportMortage, setReportMortage] = useState([]);
  const [openModal, setOpenModal] = useState(true);
  const [morUser, setMorUser] = useState([]);
  const [selectedMorUser, setSelectedMorUser] = useState("");
  const [userArrList, setUserArrList] = useState("");
  const [userID, setUserId] = useState("");
  const [searchData, setSearchData] = useState("");
  const [totalPartPayAmount, setTotalPartPayAmount] = useState("");
  const [totalInterestPartPayAmount, setTotalInterestPartPayAmount] =
    useState("");

  // for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [readOneData, setReadOneData] = useState([]);

  const [showGoldSilverVarient, setShowGoldSilverVarient] = useState(1);

  const [imgFiles, setImgFile] = useState([]);
  const [mortgagePayments, setMortgagePayments] = useState([]);
  const [mortagePartialEntry, setMortagePartialEntry] = useState([]);
  const [productData, setProductData] = useState([]);

  const [totalSilverWeight, setTotalSilverWeight] = useState("");
  const [totalGoldWeight, setTotalGoldWeight] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [actualArray, setActualArray] = useState([]);
  const [printObj, setPrintObj] = useState([]);

  useEffect(() => {
    NavbarSetting("Reports-Retailer", dispatch);
  }, []);

  useEffect(() => {
    // if (userArrList) {
    getMortageUsers();
    // }
  }, []);

  const dispatch = useDispatch();

  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
    //eslint-disable-next-line
  }, [componentRef.current]);

  function getDateAndTime() {
    return (
      new Date().getDate() +
      "_" +
      (new Date().getMonth() + 1) +
      "_" +
      new Date().getFullYear() +
      "_" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes()
    );
  }

  const handleBeforePrint = React.useCallback(() => {}, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        // setLoading(false);
        // setText("New, Updated Text!");
        resolve();
      }, 10);
    });
  }, []); //setText

  const handleAfterPrint = () => {
    //React.useCallback
    //resetting after print
    // checkAndReset();
    setModalOpen(false);
  };

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "mortgage" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });
  function checkforPrint() {
    handlePrint();
  }

  const handleSelectedVoucher = (voucher) => {
    setReportMortage([]);
    setSelectedMorUser(voucher);
    console.log(voucher.value, "////////");
    setUserId(voucher.value);
    setOpenModal(false);
    // if (voucher.value !== "") {
    //   getMortageReportData()
    // }
    // const idArr = [];
    // voucher.VoucherSettingDetails.map((item) => {
    //   idArr.push(item.id);
    // });
    // setUserArrList(idArr);
  };

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  function getMortageUsers() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/mortage/user")
      .then(function (response) {
        if (response.data.success === true) {
          console.log("setMorUser", response.data.data);
          setMorUser(response.data.data);
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
          api: "retailerProduct/api/mortage/user",
        });
      });
  }

  useEffect(() => {
    if (selectedMorUser) {
      setFilters();
    }
  }, [selectedMorUser]);
  // useEffect(() => {
  //   if (searchData) {
  //     setFilters();
  //   }
  // }, [searchData]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (selectedMorUser) {
        console.log("innnnppppppppppppp");
        setReportMortage([]);
        setCount(0);
        setPage(0);
        setFilters();
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchData]);

  function getMortageReportData(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          const data = response.data.data;
          setActualArray(data);
          const arrData = [];
          data.map((item, index) => {
            const mLen = item.MortagePartialEntry.length;
            const colorId = index + 1;
            if (mLen > 0) {
              // arrData.push({...item,rowId : index + 1 , rowspans :mLen + 1 , ismain : true, colorId })
              item.MortagePartialEntry.map((entry, i) => {
                if (i === 0) {
                  arrData.push({
                    ...item,
                    ...entry,
                    principal_amount_main: item.principal_amount,
                    colorId,
                    rowId: index + 1,
                    rowspans: mLen,
                    ismain: true,
                  });
                } else {
                  arrData.push({
                    ...item,
                    ...entry,
                    principal_amount_main: item.principal_amount,
                    colorId,
                  });
                }
              });
            } else {
              arrData.push({
                ...item,
                principal_amount_main: item.principal_amount,
                rowId: index + 1,
                ismain: true,
                colorId,
              });
            }
          });
          console.log(arrData, "myarrrrr");
          setCount(Number(response.data.totalRecord));
          setRowsPerPage(10);
          if (reportMortage.length === 0) {
            setReportMortage(arrData);
          } else {
            setReportMortage((reportMortage) => [...reportMortage, ...arrData]);
          }
          let totalPartPayAmount = 0;
          data.forEach((item) => {
            if (
              item.MortagePartialEntry &&
              Array.isArray(item.MortagePartialEntry)
            ) {
              item.MortagePartialEntry.forEach((entry) => {
                console.log(entry);
                console.log(entry.part_pay_amount);
                totalPartPayAmount += parseFloat(entry.part_pay_amount);
              });
            }
          });
          setTotalPartPayAmount(totalPartPayAmount);
          let totalPartInterestPayAmount = 0;
          data.forEach((item) => {
            if (
              item.MortagePartialEntry &&
              Array.isArray(item.MortagePartialEntry)
            ) {
              item.MortagePartialEntry.forEach((entry) => {
                totalPartInterestPayAmount += parseFloat(entry.interest);
              });
            }
            if (item.MortagePartialEntry.length === 0) {
              totalPartInterestPayAmount += parseFloat(item.final_interest);
            }
          });
          setTotalInterestPartPayAmount(totalPartInterestPayAmount);
          console.log(totalPartPayAmount);
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

  const exportToExcel = (type, fn, dl) => {
    if (reportMortage.length > 0) {
        const wb = XLSX.utils.book_new();

        // Export the first table
        const tbl1 = document.getElementById("tbl_exporttable_to_xls");
        // Remove last column from table
        const tbl1Modified = removeLastColumnFromTable(tbl1);
        const ws1 = XLSX.utils.table_to_sheet(tbl1Modified);
        XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

        return dl
            ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
            : XLSX.writeFile(
                wb,
                fn || `User_mortgage.${type || "xlsx"}`
            );
    } else {
        dispatch(Actions.showMessage({ message: "Can not Export Empty Data" }));
    }
};

// Function to remove last column from a table
const removeLastColumnFromTable = (table) => {
    const rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].cells;
        if (cells.length > 0) {
            rows[i].deleteCell(cells.length - 1); // Delete last cell in each row
        }
    }
    return table;
};

  function setFilters(tempPageNo) {
    let url = `retailerProduct/api/mortage/list/report?filter=${2}&user_id=${userID}&search=${searchData}&`;

    if (page !== "") {
      if (!tempPageNo) {
        url = url + "page=" + 1;
      } else {
        url = url + "page=" + tempPageNo;
      }
    }
    if (!tempPageNo) {
      getMortageReportData(url);
    } else {
      if (count > reportMortage.length) {
        getMortageReportData(url);
      }
    }
  }

  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 10 > reportMortage.length) {
      setFilters(Number(newPage + 1));
    }
  }

  function getMortgageDetail(clientId) {
    axios
      .get(Config.getCommonUrl() + `retailerProduct/api/mortage/${clientId}`)
      .then(function (response) {
        if (response.data.success === true) {
          setModalOpen(true);
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
            setPrintObj(response.data.data);
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

  function handleModalClose() {
    setModalOpen(false);
    setTotalSilverWeight("");
    setTotalGoldWeight("");
  }

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
          className={clsx(classes.paperModal, "rounded-8")}
        >
          <h5 className="popup-head p-5">
            Select User
            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={() => setOpenModal(false)}
            >
              <Icon style={{ color: "white" }}>close</Icon>
            </IconButton>
          </h5>
          <div className="p-5 pl-16 pr-16">
            <div>
              <label>Select User</label>
              <Select
                className="mt-1"
                classes={classes}
                styles={selectStyles}
                autoFocus
                options={morUser.map((optn) => ({
                  value: optn.id,
                  label: optn.name +" - " + optn.mobile_number,
                }))}
                filterOption={createFilter({ ignoreAccents: false })}
                value={selectedMorUser}
                onChange={handleSelectedVoucher}
                placeholder="Select User"
              />
              {console.log(morUser)}
            </div>
          </div>
        </div>
      </Modal>
    );
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
              <Grid item xs={6} sm={6} md={6} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    User Mortgage Report
                  </Typography>
                </FuseAnimate>
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              >
                <Button
                  variant="contained"
                  onClick={() => setOpenModal(true)}
                  className={classes.button}
                >
                  Change User
                </Button>
              </Grid>
            </Grid>
            {openModal && ModalView()}
            <div className="main-div-alll">
              <Grid
                container spacing={2}
                style={{
                  display: "flex",
                  alignItems: "center",
                  // justifyContent: "space-between",
                }}
              >
                <Grid item>
                  <h2 style={{ textTransform: "capitalize" }}>
                    {selectedMorUser?.label?.split("-")[0]}
                  </h2>
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2} style={{ marginLeft: "auto"}}>
                  <div
                    style={{ borderRadius: "7px !important" }}
                    component="form"
                    className={classes.search}
                  >
                    <InputBase
                      className={classes.input}
                      placeholder="Search By Doc No."
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
                </Grid>
                <Grid item >
                  <Button
                  className={clsx(classes.filterBtn, "ml-16")}
                  variant="contained"
                  color="primary"
                  aria-label="Register"
                  size="small"
                  onClick={(event) => {
                    exportToExcel("xlsx");
                  }}
                >
                  Export 
                </Button>
                </Grid>
              </Grid>
              <Paper
                style={{ marginTop: "16px", overflowY: "auto", height: "auto" }}
                className={classes.tabroot}
              >
                <Table className={classes.table} id="tbl_exporttable_to_xls">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad}>
                        Issue Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Doc. No.
                      </TableCell>
                      {/* <TableCell className={classes.tableRowPad}>
                        Name
                      </TableCell> */}
                      <TableCell className={classes.tableRowPad}>
                        Metal Type
                      </TableCell>
                      {/* <TableCell className={classes.tableRowPad}>
                        Notes
                      </TableCell> */}
                      <TableCell className={classes.tableRowPad}>
                        Net WT(Gram)
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        Total Amount
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Interest(%)
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Payment Date
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        Principal Amount
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        Refinance Amount
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        Interest Amount
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        Part Pay Amount
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="center">
                        Balance
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Type
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ paddingRight: "20px" }}
                      >
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  {console.log(reportMortage)}
                  <TableBody>
                    {reportMortage.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={13}
                          className={classes.tableRowPad}
                          style={{ textAlign: "center" }}
                        >
                          No Data Found
                        </TableCell>
                      </TableRow>
                    ) : (
                      reportMortage.map((data, i) => {
                        console.log(data);
                        console.log(data.close_amount);
                        console.log(data.product_amount_total);
                        return (
                          <TableRow
                            key={i}
                            style={{
                              backgroundColor:
                                data.product_amount_total !== 0 &&
                                data.close_amount > data.product_amount_total
                                  ? "#ff1b1c33"
                                  : data.colorId % 2 == 0
                                  ? "#F7F8FB"
                                  : "#FFFFFF",
                              border: "1px solid #F7F8FB",
                            }}
                          >
                            {data.ismain ? (
                              <>
                                <TableCell
                                  className={classes.tableRowPad}
                                  rowSpan={data.rowspans}
                                  style={{ border: "1px solid #EBEEFB" }}
                                >
                                  {moment(data?.issue_date).format(
                                    "DD-MM-YYYY"
                                  )}
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  rowSpan={data.rowspans}
                                  style={{ border: "1px solid #EBEEFB" }}
                                >
                                  {data.doc_number}
                                  {data.is_close === 1 && (
                                    <span
                                      style={{
                                        paddingInline: 4,
                                        paddingBlock: 2,
                                        borderRadius: 25,
                                        marginLeft: 15,
                                        background: "#415BD4",
                                        color: "#ffffff",
                                        display: "inline-block",
                                      }}
                                    >
                                      Closed
                                    </span>
                                  )}
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
                                {/* <TableCell className={classes.tableRowPad} rowSpan={data.rowspans} style={{border:"1px solid #EBEEFB"}}>
                               {data.MortgageUser.name}
                             </TableCell> */}
                                <TableCell
                                  className={classes.tableRowPad}
                                  rowSpan={data.rowspans}
                                  style={{ border: "1px solid #EBEEFB" }}
                                >
                                  {data.is_gold_silver === 1
                                    ? "Gold"
                                    : data.is_gold_silver === 2
                                    ? "Silver"
                                    : "Mix"}
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  rowSpan={data.rowspans}
                                  style={{ border: "1px solid #EBEEFB" }}
                                >
                                  {data.weight}
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  rowSpan={data.rowspans}
                                  style={{
                                    border: "1px solid #EBEEFB",
                                    textAlign: "right",
                                  }}
                                >
                                  {Config.numWithComma(
                                    data.principal_amount_main
                                  )}
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  rowSpan={data.rowspans}
                                  style={{ border: "1px solid #EBEEFB" }}
                                >
                                  {data.percentage}
                                </TableCell>
                              </>
                            ) : null}
                            <TableCell
                              className={classes.tableRowPad}
                              style={{
                                border: "1px solid #EBEEFB",
                                paddingLeft: 7,
                              }}
                            >
                              {data?.payment_date
                                ? moment(data.payment_date).format("DD-MM-YYYY")
                                : `-`}
                            </TableCell>
                            <TableCell
                              className={clsx(classes.tableRowPad, "textright")}
                              style={{
                                border: "1px solid #EBEEFB",
                                textAlign: "right",
                              }}
                            >
                              {data?.principal_amount
                                ? parseFloat(data.principal_amount).toFixed(2)
                                : `-`}
                            </TableCell>
                            <TableCell
                              className={clsx(classes.tableRowPad, "textright")}
                              style={{
                                border: "1px solid #EBEEFB",
                                textAlign: "right",
                              }}
                            >
                              {data?.added_amount
                                ? parseFloat(data.added_amount).toFixed(2)
                                : `-`}
                            </TableCell>
                            <TableCell
                              className={clsx(classes.tableRowPad, "textright")}
                              style={{
                                border: "1px solid #EBEEFB",
                                textAlign: "right",
                              }}
                            >
                              {!data.interest
                                ? Config.numWithComma(data.final_interest)
                                : Config.numWithComma(data.interest)
                                ? Config.numWithComma(data.interest)
                                : "-"}
                            </TableCell>
                            <TableCell
                              className={clsx(classes.tableRowPad, "textright")}
                              style={{
                                border: "1px solid #EBEEFB",
                                textAlign: "right",
                              }}
                            >
                              {data.part_pay_amount
                                ? Config.numWithComma(data.part_pay_amount)
                                : "-"}
                            </TableCell>
                            {console.log(
                              data.close_amount,
                              data.remaining_balance
                            )}
                            <TableCell
                              className={clsx(classes.tableRowPad, "textright")}
                              style={{
                                border: "1px solid #EBEEFB",
                                textAlign: "right",
                              }}
                            >
                              {!data.remaining_balance
                                ? data.close_amount
                                : data.remaining_balance
                                ? Config.numWithComma(data.remaining_balance)
                                : "-"}
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              style={{
                                border: "1px solid #EBEEFB",
                                textAlign: "left",
                              }}
                            >
                              <sapn
                                style={{
                                  padding: 3,
                                  borderRadius: 4,
                                  background: "#ebeefb",
                                  color:
                                    data.is_added === 1
                                      ? "green"
                                      : data.is_added === 0
                                      ? "red"
                                      : "-",
                                }}
                              >
                                {data.is_added === 1
                                  ? "Added"
                                  : data.is_added === 0
                                  ? "Paid"
                                  : "-"}
                              </sapn>
                            </TableCell>
                            {data.ismain ? (
                              <TableCell
                                className={classes.tableRowPad}
                                rowSpan={data.rowspans}
                                style={{
                                  border: "1px solid #EBEEFB",
                                  paddingRight: "20px",
                                }}
                              >
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
                            ) : null}
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
                      <TableCell className={classes.tableRowPad}></TableCell>
                      {/* <TableCell className={classes.tableRowPad}></TableCell> */}
                      {/* <TableCell className={classes.tableRowPad}></TableCell> */}
                      <TableCell className={classes.tableRowPad}>
                        {console.log(reportMortage)}
                        <b>
                          {HelperFunc.getTotalOfField(actualArray, "weight")}
                        </b>
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ textAlign: "right" }}
                      >
                        <b>
                          {Config.numWithComma(
                            HelperFunc.getTotalOfField(
                              actualArray,
                              "principal_amount"
                            )
                          )}
                        </b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ textAlign: "right" }}
                      >
                        {/* <b>
                          {Config.numWithComma(HelperFunc.getTotalOfField(
                            actualArray,
                            "principal_amount"
                          ))}
                        </b> */}
                      </TableCell>
                      <TableCell
                        className={classes.tableRowPad}
                        style={{ textAlign: "right" }}
                      >
                        <b>
                          {Config.numWithComma(
                            parseFloat(totalInterestPartPayAmount).toFixed(2)
                          )}
                        </b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad} align="right">
                        <b style={{ textAlign: "right" }}>
                          {Config.numWithComma(
                            parseFloat(totalPartPayAmount).toFixed(2)
                          )}
                        </b>
                      </TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </Paper>
              {/* <TablePagination
                  labelRowsPerPage=""
                  component="div"
                  // count={apiData.length}
                  count={count}
                  rowsPerPage={10}
                  page={page}
                  backIconButtonProps={{
                    "aria-label": "Previous Page",
                  }}
                  nextIconButtonProps={{
                    "aria-label": "Next Page",
                  }}
                  onPageChange={handleChangePage}
                  // onChangeRowsPerPage={handleChangeRowsPerPage}
                /> */}
            </div>
          </div>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={modalOpen}
            // onClose={(_, reason) => {
            //   if (reason !== "backdropClick") {
            //     handleModalClose(false);
            //   }
            // }}
          >
            {/* {modalOpen && loading ? <Loader /> : ""} */}
            <div
              style={modalStyle}
              className={clsx(classes.paper, "rounded-8")}
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
                    onClick={handleModalClose}
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
                  <Grid container style={{ marginBottom: 30 }}>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                      <Button
                        variant="contained"
                        className="w-160 mx-auto popup-save"
                        style={{ marginLeft: "20px" }}
                        onClick={checkforPrint}
                      >
                        Print
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </>
            </div>
          </Modal>
        </div>
      </FuseAnimate>
      <div style={{ display: "none" }}>
        <MortgageReportPrint ref={componentRef} printObj={printObj} />
      </div>
    </div>
  );
};

export default MortgageReport;

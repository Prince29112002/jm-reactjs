import React, { useEffect, useState, useContext } from "react";
import { useDispatch } from "react-redux";
import { FuseAnimate } from "@fuse";
import Select, { createFilter } from "react-select";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import AppContext from "app/AppContext";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";
import {
  Button,
  Grid,
  Icon,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import * as XLSX from "xlsx";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    minWidth: 1000,
    tableLayout: "auto",
  },
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
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
  filterBtn: {
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
    marginBlock: "3px",
  },
  overflowSet: {},
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
const UserSchemeReport = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [modalStyle] = React.useState(getModalStyle);
  const appContext = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [reportUserScheme, setReportUserScheme] = useState([]);
  console.log(reportUserScheme);
  const [openModal, setOpenModal] = useState(true);
  const [clientlist, setClientList] = useState([]);
  const [selectedClient, setSelectedClientList] = useState("");
  const [userArrList, setUserArrList] = useState("");
  const [userID, setUserId] = useState("");
  const [documentList, setDocumentList] = useState([]);
  const [documentId, setDocumentId] = useState("");
  const [SelectedDocumentList, setSelectedDocumentList] = useState("");
  const [ReportUserSchemePayment, setReportUserSchemePayment] = useState();
  const [totalAmount, setTotalAmount] = useState(0);
  console.log(totalAmount);
  const [documenlabel, setDocumenlabel] = useState("");

  React.useEffect(() => {
    if (ReportUserSchemePayment) {
      const calculatedTotalAmount = ReportUserSchemePayment.reduce(
        (accumulator, currentValue) => {
          return accumulator + parseFloat(currentValue.amount);
        },
        0
      );

      // Update the totalAmount state with the calculated total
      setTotalAmount(calculatedTotalAmount);
    }
  }, [ReportUserSchemePayment]);

  // for pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);

  useEffect(() => {
    NavbarSetting("Reports-Retailer", dispatch);
  }, []);

  useEffect(() => {
    // if (userArrList) {
    getClintList();
    // }
  }, []);

  useEffect(() => {
    if (userID) {
      getDocumentList();
    }
  }, [userID]);

  const dispatch = useDispatch();

  const handleSelectedVoucher = (voucher) => {
    console.log(voucher.value);

    setSelectedClientList(voucher);
    setUserId(voucher.value);
  };

  const handleSelecDocument = (Document) => {
    console.log(Document);
    setReportUserScheme([]);
    setSelectedDocumentList(Document);
    setDocumentId(Document.value);
    setDocumenlabel(Document.label);
    setOpenModal(false);
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

  function getClintList() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/scheme/list/user")
      .then(function (response) {
        if (response.data.success === true) {
          console.log("setClientList", response.data.data);
          setClientList(response.data.data);
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

  function getDocumentList() {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() + `retailerProduct/api/scheme/list/doc/${userID}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log("DocumentList", response.data.data);
          if (userID) {
            setDocumentList(response.data.data);
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
          api: "retailerProduct/api/mortage/user",
        });
      });
  }

  useEffect(() => {
    if (SelectedDocumentList) {
      setFilters();
    }
  }, [SelectedDocumentList]);

  function getUserSchemeReportData(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          const data = response.data.data;
          console.log(data);
          setCount(Number(response.data.totalRecord));
          if (reportUserScheme.length === 0) {
            setReportUserScheme(data);
            console.log(data[0].SchemePayment);
            setReportUserSchemePayment(data[0].SchemePayment);
          } else {
            setReportUserScheme((reportUserScheme) => [
              ...reportUserScheme,
              ...data,
            ]);
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
    let url = `retailerProduct/api/scheme/list/userreport?&client_id=${userID}&scheme_id=${documentId}`;

    if (!tempPageNo) {
      getUserSchemeReportData(url);
    } else {
      if (count > reportUserScheme.length) {
        getUserSchemeReportData(url);
      }
    }
  }

  // function handleChangePage(event, newPage) {
  //   let tempPage = page;
  //   setPage(newPage);
  //   if (newPage > tempPage && (newPage + 1) * 10 > reportUserScheme.length) {
  //     setFilters(Number(newPage + 1));
  //   }
  // }

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
            Select Customer
            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={() => setOpenModal(false)}
            >
              <Icon style={{ color: "white" }}>close</Icon>
            </IconButton>
          </h5>
          <div className="p-5 pl-16 pr-16">
            <div>
              <label>Select Customer</label>
              <Select
                className="mt-1"
                classes={classes}
                styles={selectStyles}
                autoFocus
                options={clientlist.map((optn) => ({
                  value: optn.id,
                  label: optn.client_Name,
                }))}
                filterOption={createFilter({ ignoreAccents: false })}
                value={selectedClient}
                onChange={handleSelectedVoucher}
                placeholder="Select Customer"
              />
            </div>
            <div className="mt-3">
              <label>Select Document</label>
              <Select
                className="mt-1"
                classes={classes}
                styles={selectStyles}
                options={documentList.map((optn) => ({
                  value: optn.id,
                  label: optn.doc_number,
                }))}
                filterOption={createFilter({ ignoreAccents: false })}
                value={documenlabel}
                onChange={handleSelecDocument}
                placeholder="Select Document"
              />
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  const exportToExcel = (type, fn, dl) => {
    if (reportUserScheme.length > 0) {
      const wb = XLSX.utils.book_new();

      // Export the first table
      const tbl1 = document.getElementById("tbl_exporttable_to_xls");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(wb, fn || `User Scheme Report.${type || "xlsx"}`);
    } else {
      dispatch(
        Actions.showMessage({
          message: "Can not Export Empty Data",
          variant: "error",
        })
      );
    }
  };

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
                    User Scheme Reports
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
                  className={clsx(classes.filterBtn)}
                  variant="contained"
                  aria-label="Register"
                  size="small"
                  onClick={(event) => {
                    exportToExcel("xlsx");
                  }}
                >
                  Export
                </Button>
                <Button
                style={{marginLeft:8}}
                  variant="contained"
                  size="small"
                  onClick={() => setOpenModal(true)}
                  className={classes.button}
                >
                  Change Customer
                </Button>
              </Grid>
            </Grid>

            {openModal && ModalView()}
            <div className="main-div-alll">
              <div className="department-tbl-mt-dv">
                <Paper
                  className={clsx(
                    classes.tabroot,
                    "table-responsive repairedissue-table"
                  )}
                >
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          Sr no
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Gold/Silver
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Document no.
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Note
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Pay By
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ paddingLeft: "20px" }}
                        >
                          Due Date
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ textAlign: "right" }}
                        >
                          EMI Amount
                        </TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Payment Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Status
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad} style={{paddingRight: "20px"}}>
                        Part Pay Amount
                      </TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportUserScheme.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={11}
                            className={classes.tableRowPad}
                            style={{ textAlign: "center" }}
                          >
                            No Data Found
                          </TableCell>
                        </TableRow>
                      ) : (
                        reportUserScheme
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((data, i) => {
                            return (
                              <>
                                <TableRow key={i}>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    rowSpan={data.SchemePayment.length}
                                  >
                                    {page * rowsPerPage + i + 1}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    rowSpan={data.SchemePayment.length}
                                  >
                                    {data.is_gold_silver === 0
                                      ? "Gold"
                                      : "silver"}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    rowSpan={data.SchemePayment.length}
                                  >
                                    {data.doc_number}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    rowSpan={data.SchemePayment.length}
                                  >
                                    {data.ClientDetails?.client_Name}
                                    {/* {moment(data.issue_date).format("DD-MM-YYYY")} */}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    rowSpan={data.SchemePayment.length}
                                  >
                                    {data.notes}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    style={{ paddingLeft: "20px" }}
                                  >
                                    {data.SchemePayment[0].paid_by === 0
                                      ? "Customer"
                                      : "Admin"}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    style={{ paddingLeft: "20px" }}
                                  >
                                    {moment
                                      .utc(data.SchemePayment[0].due_date)
                                      .local()
                                      .format("DD-MM-YYYY")}
                                  </TableCell>

                                  <TableCell
                                    className={classes.tableRowPad}
                                    style={{ textAlign: "right" }}
                                  >
                                    {parseFloat(
                                      data.SchemePayment[0].amount
                                    ).toFixed(2)}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    style={{ textAlign: "right" }}
                                  ></TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.SchemePayment[0].payment_date
                                      ? moment
                                          .utc(
                                            data.SchemePayment[0].payment_date
                                          )
                                          .local()
                                          .format("DD-MM-YYYY")
                                      : "-"}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    style={{ paddingRight: "26px" }}
                                  >
                                    {data.SchemePayment[0].paid_by === 1
                                      ? "-"
                                      : data.SchemePayment[0].is_paid === 1
                                      ? "Paid"
                                      : "Pending"}
                                  </TableCell>
                                </TableRow>
                                {data.SchemePayment.slice(1).map(
                                  (item, index) => (
                                    <TableRow>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.paid_by === 0
                                          ? "Customer"
                                          : "Admin"}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                        style={{ paddingLeft: "20px" }}
                                      >
                                        {moment
                                          .utc(item.due_date)
                                          .local()
                                          .format("DD-MM-YYYY")}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                        style={{ textAlign: "right" }}
                                      >
                                        {parseFloat(item.amount).toFixed(2)}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                        style={{ textAlign: "right" }}
                                      ></TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.payment_date
                                          ? moment
                                              .utc(item.payment_date)
                                              .local()
                                              .format("DD-MM-YYYY")
                                          : "-"}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                        style={{ paddingRight: "26px" }}
                                      >
                                        {item.paid_by === 1
                                          ? "-"
                                          : item.is_paid === 1
                                          ? "Paid"
                                          : "Pending"}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </>
                            );
                          })
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow style={{ backgroundColor: "#ebeefb" }}>
                        <TableCell className={classes.tableRowPad} colSpan={2}>
                          <b>Total</b>
                        </TableCell>

                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {/* <b>
                          {HelperFunc.getTotalOfField(
                            reportUserScheme,
                            "gold_weight"
                          )}
                        </b> */}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ textAlign: "right" }}
                        >
                          <b>{Config.numWithComma(totalAmount)}</b>
                        </TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {/* <b>
                          {isNaN(HelperFunc.getTotalOfField(
                            reportUserScheme,
                            "interest_amount"
                          ))
                            ? 0.000
                            : Config.numWithComma(HelperFunc.getTotalOfField(
                                reportUserScheme,
                                "interest_amount"
                              ))}
                        </b> */}
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad} style={{paddingRight: "20px"}}>
                        <b>
                        {isNaN(HelperFunc.getTotalOfField(
                            reportUserScheme,
                            "part_pay_amount"
                          ))
                            ? 0.000
                            : Config.numWithComma(HelperFunc.getTotalOfField(
                                reportUserScheme,
                                "part_pay_amount"
                              ))}
                        </b>
                      </TableCell> */}
                      </TableRow>
                    </TableFooter>
                  </Table>

                  <Table
                    className={classes.table}
                    id="tbl_exporttable_to_xls"
                    style={{ display: "none" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          Sr no
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Gold/Silver
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Document no.
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Pay By
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ paddingLeft: "20px" }}
                        >
                          Due Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Note
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ textAlign: "right" }}
                        >
                          EMI Amount
                        </TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Payment Date
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          Status
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad} style={{paddingRight: "20px"}}>
                        Part Pay Amount
                      </TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportUserScheme.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={9}
                            className={classes.tableRowPad}
                            style={{ textAlign: "center" }}
                          >
                            No data found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        reportUserScheme
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((data, i) => {
                            return (
                              <>
                                <TableRow key={i}>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    rowSpan={data.SchemePayment.length}
                                  >
                                    {page * rowsPerPage + i + 1}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    rowSpan={data.SchemePayment.length}
                                  >
                                    {data.is_gold_silver === 0
                                      ? "Gold"
                                      : "silver"}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    rowSpan={data.SchemePayment.length}
                                  >
                                    {data.doc_number}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    rowSpan={data.SchemePayment.length}
                                  >
                                    {data.ClientDetails?.client_Name}
                                    {/* {moment(data.issue_date).format("DD-MM-YYYY")} */}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    style={{ paddingLeft: "20px" }}
                                  >
                                    {data.SchemePayment[0].paid_by === 0
                                      ? "Customer"
                                      : "Admin"}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    style={{ paddingLeft: "20px" }}
                                  >
                                    {moment
                                      .utc(data.SchemePayment[0].due_date)
                                      .local()
                                      .format("YYYY-MM-DD")}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.SchemePayment[0].notes}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    style={{ textAlign: "right" }}
                                  >
                                    {parseFloat(
                                      data.SchemePayment[0].amount
                                    ).toFixed(2)}
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                    style={{ textAlign: "right" }}
                                  ></TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.SchemePayment[0].payment_date
                                      ? moment
                                          .utc(
                                            data.SchemePayment[0].payment_date
                                          )
                                          .local()
                                          .format("YYYY-MM-DD")
                                      : ""}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.SchemePayment[0].paid_by === 1
                                      ? "-"
                                      : data.SchemePayment[0].is_paid === 1
                                      ? "Paid"
                                      : "Pending"}
                                  </TableCell>
                                </TableRow>
                                {data.SchemePayment.slice(1).map(
                                  (item, index) => (
                                    <TableRow>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.paid_by === 0
                                          ? "Customer"
                                          : "Admin"}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                        style={{ paddingLeft: "20px" }}
                                      >
                                        {moment
                                          .utc(item.due_date)
                                          .local()
                                          .format("YYYY-MM-DD")}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.notes}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                        style={{ textAlign: "right" }}
                                      >
                                        {parseFloat(item.amount).toFixed(2)}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                        style={{ textAlign: "right" }}
                                      ></TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.payment_date
                                          ? moment
                                              .utc(item.payment_date)
                                              .local()
                                              .format("YYYY-MM-DD")
                                          : ""}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.paid_by === 1
                                          ? "-"
                                          : item.is_paid === 1
                                          ? "Paid"
                                          : "Pending"}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </>
                            );
                          })
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow style={{ backgroundColor: "#ebeefb" }}>
                        <TableCell className={classes.tableRowPad} colSpan={2}>
                          <b>Total</b>
                        </TableCell>

                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {/* <b>
                          {HelperFunc.getTotalOfField(
                            reportUserScheme,
                            "gold_weight"
                          )}
                        </b> */}
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ textAlign: "right" }}
                        >
                          <b>{Config.numWithComma(totalAmount)}</b>
                        </TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {/* <b>
                          {isNaN(HelperFunc.getTotalOfField(
                            reportUserScheme,
                            "interest_amount"
                          ))
                            ? 0.000
                            : Config.numWithComma(HelperFunc.getTotalOfField(
                                reportUserScheme,
                                "interest_amount"
                              ))}
                        </b> */}
                        </TableCell>
                        {/* <TableCell className={classes.tableRowPad} style={{paddingRight: "20px"}}>
                        <b>
                        {isNaN(HelperFunc.getTotalOfField(
                            reportUserScheme,
                            "part_pay_amount"
                          ))
                            ? 0.000
                            : Config.numWithComma(HelperFunc.getTotalOfField(
                                reportUserScheme,
                                "part_pay_amount"
                              ))}
                        </b>
                      </TableCell> */}
                      </TableRow>
                    </TableFooter>
                  </Table>
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default UserSchemeReport;

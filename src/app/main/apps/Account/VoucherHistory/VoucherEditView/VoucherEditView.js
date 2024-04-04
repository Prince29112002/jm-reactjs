import React, { useState, useEffect } from "react";
import { Typography, TextField, Icon, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import History from "@history";
import Loader from "../../../../Loader/Loader";
import moment from "moment";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import LoaderPopup from "app/main/Loader/LoaderPopup";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
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
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "white",
  },
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  tableheader: {
    display: "inline-block",
    textAlign: "center",
  },
  table: {
    // minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
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

const VoucherEditView = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [modalStyle] = React.useState(getModalStyle);
  const [loading, setLoading] = useState(false);
  const [pageView, setPageView] = useState("");
  const [voucherEntryId, setVoucherEntryId] = useState("");

  const [voucherName, setVoucherName] = useState("");
  const [mainVoucherName, setMainVoucherName] = useState("");
  const [voucherDate, setVoucherDate] = useState("");

  const [otherVoucherNumber, setOtherVoucherNumber] = useState("");
  const [refVoucherNumber, setRefVoucherNumber] = useState("");
  const [refVoucherNumberErr, setRefVoucherNumberErr] = useState("");
  const [supplyVoucherNumber, setSupplyVoucher] = useState("");
  const [partyVoucherDate, setPartyVoucherDate] = useState("");
  const [rows, setRows] = useState([]);
  const [narration, setNnarration] = useState("");

  const [viewArrList, setViewArrList] = useState("");
  const [documentList, setDocumentList] = useState([]);
  const [open, setOpen] = useState(false);
  const [viewPopSide, setViewPopSide] = useState(false);
  const [voucher, setVoucher] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [loadingPop, setLoadingPop] = useState(false);
  const [docFile, setDocFile] = useState("");

  const [taxLedger, setTaxLedger] = useState("");
  const [type, setType] = useState("");
  const [ledgerRate, setLedgerRate] = useState("");
  const [ledAmount, setLedAmount] = useState("");
  const [finalAmoutTotal, setFinalAmoutTotal] = useState("");

  useEffect(() => {
    if (props.reportView === "Report") {
      NavbarSetting("Factory Report", dispatch);
    } else if (props.reportView === "Account") {
      NavbarSetting("Accounts", dispatch);
    } else {
      NavbarSetting("Accounts", dispatch);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (props.location) {
      const id = props.location.state.id;
      const viewPage = props.location.state.viewPage;
      const list = props.location.state.voucherArrList;
      const Voucher = props.location.state.voucher;
      getDataForEdit(id);
      setVoucherEntryId(id);
      setPageView(viewPage);
      setViewArrList(list);
      setVoucher(Voucher);
    } else {
      if (props.viewPopup) {
        const id = props.id;
        const viewPage = props.viewPage;
        getDataForEdit(id);
        setVoucherEntryId(id);
        setPageView(viewPage);
        setViewPopSide(props.viewPopup);
      } else {
        History.push("/dashboard/sales");
      }
    }
  }, [dispatch]);

  const handleClose = () => {
    setOpen(false);
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

  function getDataForEdit(id) {
    console.log(id);
    setLoading(true);
    let api = "";
    if (props.forDeletedVoucher) {
      api = `api/voucherentry/entry/view/${id}?deleted_at=1`;
    } else {
      api = `api/voucherentry/entry/view/${id}`;
    }
    axios
      .get(Config.getCommonUrl() + api)
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const apiData = res.data.data[0];
          setVoucherName(apiData.voucher_number);
          setMainVoucherName(apiData.voucher_type);
          setVoucherDate(
            moment.utc(apiData.created_at).local().format("YYYY-MM-DD")
          );
          setOtherVoucherNumber(apiData.other_voucher_no);
          setSupplyVoucher(apiData.supplier_voucher_number);
          setRows(apiData.VoucherEntryDetails);
          setNnarration(apiData.note);
          if (apiData.purchase_flag_id) {
            setRefVoucherNumber(
              apiData[apiData.purchase_flag].party_voucher_no
            );
            setDocumentList(apiData[apiData.purchase_flag].salesPurchaseDocs);
          } else {
            setRefVoucherNumber(apiData.refrence_voucher);
            setDocumentList(apiData.salesPurchaseDocs);
          }
          if (
            apiData.party_voucher_date !== null &&
            apiData.party_voucher_date !== ""
          ) {
            setPartyVoucherDate(
              moment(apiData.party_voucher_date).format("DD-MM-YYYY")
            );
          }
          if (
            apiData.created_at === "0000-00-00" &&
            apiData.created_at !== null
          ) {
            let dtval_t = moment
              .utc(apiData.created_at)
              .local()
              .format("YYYY-MM-DD");
            setVoucherDate(dtval_t);
          }
          if (apiData.TaxtionLedger !== null) {
            setTaxLedger(apiData.TaxtionLedger.name);
            setType(apiData.TaxtionLedger.is_tds_tcs === 1 ? "TCS" : "TDS");
            setLedgerRate(apiData.taxation_ledger_per);
            setLedAmount(apiData.taxable_amount);
            setFinalAmoutTotal(apiData.final_amount);
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: api });
      });
  }

  const handleInputDataChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "narration") {
      setNnarration(value);
    } else if (name === "refVoucherNumber") {
      setRefVoucherNumber(value);
      setRefVoucherNumberErr("");
    }
  };

  function validateRefNum() {
    if (refVoucherNumber === "") {
      setRefVoucherNumberErr("Enter Ref Voucher Number");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // if(validateRefNum()){
    callUpdateEntryApi();
    // }
  };

  function callUpdateEntryApi() {
    setLoading(true);
    const body = {
      refrence_voucher: refVoucherNumber,
      note: narration,
    };
    axios
      .put(
        Config.getCommonUrl() + `api/voucherentry/edit/${voucherEntryId}`,
        body
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          History.push("/dashboard/accounts/voucherhistory", {
            voucherArrList: viewArrList,
            voucher: voucher,
          });
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
        setLoading(false);
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/voucherentry/edit/${voucherEntryId}`,
          body: body,
        });
        setLoading(false);
      });
  }

  function deleteHandler(id) {
    // required document id, voucher id
    setSelectedIdForDelete(id);
    setDeleteOpen(true);
  }

  function handleDeleteClose() {
    setSelectedIdForDelete("");
    setDeleteOpen(false);
  }

  function callDeleteDocument() {
    setDeleteOpen(false);
    setLoadingPop(true);
    axios
      .delete(
        Config.getCommonUrl() +
          "api/voucherentry/voucherDocs/delete/" +
          selectedIdForDelete
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          updateDocumentArray(selectedIdForDelete);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setSelectedIdForDelete("");
          setLoadingPop(false);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
          setLoadingPop(false);
        }
      })
      .catch((error) => {
        setLoadingPop(false);
        handleError(error, dispatch, {
          api: "api/voucherentry/voucherDocs/delete/" + selectedIdForDelete,
        });
      });
  }

  const updateDocumentArray = (id) => {
    let tempDocList = [...documentList];
    const arr = tempDocList.filter((x) => x.id !== id);
    setDocumentList(arr);
  };

  const concateDocument = (newData) => {
    setDocumentList((documentList) => [...documentList, ...newData]);
  };

  useEffect(() => {
    if (docFile) {
      setLoadingPop(true);
      const formData = new FormData();
      for (let i = 0; i < docFile.length; i++) {
        formData.append("files", docFile[i]);
      }
      formData.append("voucher_entry_id", voucherEntryId);

      const body = formData;
      axios
        .put(Config.getCommonUrl() + "api/voucherentry/voucherDocs/edit", body)
        // callFileUploadApi(docFile, props.purchase_flag, props.purchase_flag_id)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            const arrData = response.data.data;
            dispatch(
              Actions.showMessage({
                message: response.data.message,
                variant: "success",
              })
            );
            concateDocument(arrData);
            setDocFile("");
            setLoadingPop(false);
          } else {
            dispatch(
              Actions.showMessage({
                message: response.data.message,
                variant: "error",
              })
            );
            setLoadingPop(false);
          }
        })
        .catch((error) => {
          setLoadingPop(false);
          handleError(error, dispatch, {
            api: "api/voucherentry/voucherDocs/edit",
            body: body,
          });
        });
    }
  }, [docFile]);

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container voucherentry-table">
          <div
            className="flex flex-1 flex-col min-w-0 makeStyles-root-1"
            style={{ marginTop: "30px" }}
          >
            {!viewPopSide && (
              <Grid
                container
                alignItems="stretch"
                style={{ paddingInline: "30px" }}
              >
                <Grid item xs={9} sm={9} md={8} key="1">
                  <FuseAnimate delay={300}>
                    <Typography className="text-18 font-700">
                      {pageView ? "View Voucher Entry" : "Edit Voucher Entry"}
                    </Typography>
                  </FuseAnimate>
                  {/* <BreadcrumbsHelper />  {pageView ? <b>view</b> : <b>edit</b>} */}
                </Grid>
                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={4}
                  key="2"
                  style={{ textAlign: "right" }}
                >
                  {/* <Button
                    variant="contained"
                    className={classes.button}
                    size="small"
                    onClick={() => History.push('/dashboard/accounts/voucherhistory', { voucherArrList: viewArrList ,voucher : voucher })}
                  >
                    Back
                  </Button> */}
                  <div className="btn-back">
                    {" "}
                    <img src={Icones.arrow_left_pagination} alt="" />
                    <Button
                      id="btn-back"
                      size="small"
                      onClick={() =>
                        History.push("/dashboard/accounts/voucherhistory", {
                          voucherArrList: viewArrList,
                          voucher: voucher,
                        })
                      }
                    >
                      Back
                    </Button>
                  </div>
                </Grid>
              </Grid>
            )}

            {loading && <Loader />}
            <div className="main-div-alll" style={{ marginTop: "20px" }}>
              <div>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3} lg={2}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                      Date
                    </label>
                    <TextField
                      placeholder="Date"
                      autoFocus
                      name="backDate"
                      type="date"
                      onKeyDown={(e) => e.preventDefault()}
                      value={voucherDate}
                      variant="outlined"
                      required
                      fullWidth
                      disabled
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={2}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                      Voucher number
                    </label>
                    <TextField
                      autoFocus
                      placeholder="Voucher number"
                      value={voucherName}
                      disabled
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={3} lg={2}>
                    <label style={{ display: "block", marginBottom: "5px" }}>
                      Voucher name (type)
                    </label>
                    <TextField
                      autoFocus
                      placeholder="Voucher name (type)"
                      value={mainVoucherName}
                      disabled
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  {otherVoucherNumber !== null && otherVoucherNumber !== "" ? (
                    <Grid item xs={12} sm={6} md={3} lg={2}>
                      <label style={{ display: "block", marginBottom: "5px" }}>
                        Other voucher num
                      </label>
                      <TextField
                        placeholder="Other voucher num"
                        name="otherVoucherNumber"
                        value={otherVoucherNumber}
                        variant="outlined"
                        required
                        fullWidth
                        disabled
                      />
                    </Grid>
                  ) : null}
                  {refVoucherNumber !== null && refVoucherNumber !== "" ? (
                    <Grid item xs={12} sm={6} md={3} lg={2}>
                      <label style={{ display: "block", marginBottom: "5px" }}>
                        Party voucher number
                      </label>
                      <TextField
                        placeholder="Party voucher number"
                        name="refVoucherNumber"
                        autoFocus
                        value={refVoucherNumber}
                        error={refVoucherNumberErr ? true : false}
                        helperText={refVoucherNumberErr}
                        onChange={handleInputDataChange}
                        variant="outlined"
                        disabled={pageView ? true : false}
                        required
                        fullWidth
                      />
                    </Grid>
                  ) : null}

                  {partyVoucherDate !== null && partyVoucherDate !== "" ? (
                    <Grid item xs={12} sm={6} md={3} lg={2}>
                      <label style={{ display: "block", marginBottom: "5px" }}>
                        Party voucher date
                      </label>
                      <TextField
                        placeholder="Party voucher date"
                        name="partyVoucherDate"
                        value={partyVoucherDate}
                        variant="outlined"
                        required
                        fullWidth
                        disabled
                      />
                    </Grid>
                  ) : null}
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    lg={2}
                    style={{ display: "flex", alignItems: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      className={classes.button}
                      onClick={() => setOpen(true)}
                    >
                      View Documents
                    </Button>
                  </Grid>
                </Grid>
              </div>

              <div
                className="table_full_width voucherentry-main-table  voucherentry-tabel-fix"
                style={{ marginTop: "20px" }}
              >
                <div
                  className="table-metal-purchase voucherentry-blog-main"
                  style={{
                    border: "1px solid #D1D8F5",
                    borderRadius: "7px",
                  }}
                >
                  <div
                    className="metal-tbl-head"
                    style={{ background: "#EBEEFB", fontWeight: "700" }}
                  >
                    <div
                      className={clsx(classes.tableheader, "delete_icons_dv")}
                    ></div>
                    <div className={clsx(classes.tableheader, "ml-2")}>
                      Cr/Dr
                    </div>
                    <div className={clsx(classes.tableheader, "ml-2")}>
                      Ledger
                    </div>
                    {rows.length > 0 && rows[0].HsnNumber !== null && (
                      <div className={clsx(classes.tableheader, "ml-2")}>
                        HSN Number
                      </div>
                    )}
                    <div className={clsx(classes.tableheader, "ml-2")}>
                      Amount
                    </div>
                    {rows.length > 0 && rows[0].cgst_per !== null && (
                      <div className={clsx(classes.tableheader, "ml-2")}>
                        CGST(%)
                      </div>
                    )}
                    {rows.length > 0 && rows[0].cgst !== null && (
                      <div className={clsx(classes.tableheader, "ml-2")}>
                        CGST
                      </div>
                    )}
                    {rows.length > 0 && rows[0].sgst_per !== null && (
                      <div className={clsx(classes.tableheader, "ml-2")}>
                        SGST(%)
                      </div>
                    )}
                    {rows.length > 0 && rows[0].sgst !== null && (
                      <div className={clsx(classes.tableheader, "ml-2")}>
                        SGST
                      </div>
                    )}
                    {rows.length > 0 && rows[0].igst_per !== null && (
                      <div className={clsx(classes.tableheader, "ml-2")}>
                        IGST(%)
                      </div>
                    )}
                    {rows.length > 0 && rows[0].igst !== null && (
                      <div className={clsx(classes.tableheader, "ml-2")}>
                        IGST
                      </div>
                    )}
                    {rows.length > 0 && rows[0].total_amt !== null && (
                      <div className={clsx(classes.tableheader, "ml-2")}>
                        Total
                      </div>
                    )}
                  </div>

                  {rows.map((element, index) => (
                    <div
                      key={index}
                      className="mt-5 castum-row-dv voucher-row-dv"
                      style={{ margin: "0px", padding: "0px" }}
                    >
                      <div
                        className={clsx(classes.tableheader, "delete_icons_dv")}
                      >
                        <IconButton style={{ padding: "0" }} disabled={true}>
                          <Icon
                            className="mr-8 delete-icone"
                            style={{ marginTop: "8px" }}
                          >
                            <img src={Icones.delete_red} alt="" />
                          </Icon>
                        </IconButton>
                      </div>

                      <TextField
                        value={element.credit_debit === 1 ? "Cr" : "Dr"}
                        disabled
                        variant="outlined"
                        required
                        fullWidth
                      />
                      <TextField
                        value={
                          element.LedgerName ? element.LedgerName.name : "-"
                        }
                        disabled
                        variant="outlined"
                        required
                        fullWidth
                      />
                      {element.HsnNumber !== null && (
                        <TextField
                          value={element.HsnNumber.hsn_number}
                          disabled
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                      <TextField
                        name="Amount"
                        value={
                          element.amount
                            ? Config.numWithComma(element.amount)
                            : "-"
                        }
                        disabled
                        variant="outlined"
                        required
                        fullWidth
                      />
                      {element.cgst_per !== null && (
                        <TextField
                          value={element.cgst_per}
                          disabled
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                      {element.cgst !== null && (
                        <TextField
                          value={Config.numWithComma(element.cgst)}
                          disabled
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                      {element.sgst_per !== null && (
                        <TextField
                          value={element.sgst_per}
                          disabled
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                      {element.sgst !== null && (
                        <TextField
                          value={Config.numWithComma(element.sgst)}
                          disabled
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                      {element.igst_per !== null && (
                        <TextField
                          value={element.igst_per}
                          disabled
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                      {element.igst !== null && (
                        <TextField
                          value={Config.numWithComma(element.igst)}
                          disabled
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                      {element.total_amt !== null && (
                        <TextField
                          value={Config.numWithComma(element.total_amt)}
                          disabled
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                    </div>
                  ))}
                  {
                    //   rows.length > 0 && rows[0].HsnNumber !== null &&  <div
                    //   className="metal-tbl-head"
                    //   style={{ background: "lightgray", fontWeight: "700"}}
                    // ><div className={clsx(classes.tableheader, "delete_icons_dv")}>
                    // </div>
                    //   <div className={clsx(classes.tableheader )}>
                    //   </div>
                    //   <div className={clsx(classes.tableheader, "")}>
                    //   </div>
                    //   {rows.length > 0 && rows[0].HsnNumber !== null && <div className={clsx(classes.tableheader, "")}>
                    //   </div>}
                    //   {/* {hsnNum === 1 && <div className={clsx(classes.tableheader, "")}>
                    //   </div>} */}
                    //   <div className={clsx(classes.tableheader, "")} >
                    //       {HelperFunc.getTotalOfField(rows, "amount")}
                    //   </div>
                    //   {rows.length > 0 && rows[0].cgst_per !== null &&  <div className={clsx(classes.tableheader, "")}>
                    //   </div>}
                    //   {rows.length > 0 && rows[0].cgst !== null &&  <div className={clsx(classes.tableheader, "")}>
                    //       {HelperFunc.getTotalOfField(rows, "cgst")}
                    //   </div>}
                    //   {rows.length > 0 && rows[0].sgst_per !== null &&  <div className={clsx(classes.tableheader, "")}>
                    //   </div>}
                    //   {rows.length > 0 && rows[0].sgst !== null &&  <div className={clsx(classes.tableheader, "")}>
                    //       {HelperFunc.getTotalOfField(rows, "sgst")}
                    //   </div>}
                    //   {rows.length > 0 && rows[0].igst_per !== null &&  <div className={clsx(classes.tableheader, "")}>
                    //   </div>}
                    //   {rows.length > 0 && rows[0].igst !== null &&  <div className={clsx(classes.tableheader, "")}>
                    //       {HelperFunc.getTotalOfField(rows, "igst")}
                    //   </div>}
                    //   {rows.length > 0 && rows[0].cgst !== null &&  <div className={clsx(classes.tableheader, "")} >
                    //       {HelperFunc.getTotalOfField(rows, "total_amt")}
                    //   </div>}
                    //   </div>
                  }
                </div>
              </div>
              {taxLedger !== "" && (
                <>
                  <div
                    className="mt-16 ml-16"
                    style={{
                      border: "1px solid lightgray",
                      paddingBottom: 5,
                      marginRight: "18px",
                    }}
                  >
                    <div
                      className="metal-tbl-head"
                      style={{ background: "lightgray", fontWeight: "700" }}
                    >
                      <div className={classes.tableheader}>Voucher Number</div>

                      <div className={classes.tableheader}>Taxation Ledger</div>

                      <div className={classes.tableheader}>Ledger Name</div>

                      <div className={classes.tableheader}>(%)</div>

                      <div className={classes.tableheader}>Amount</div>
                    </div>

                    <div className="mt-5 table-row-source">
                      <TextField
                        className="ml-2"
                        value={voucherName}
                        variant="outlined"
                        fullWidth
                        disabled
                      />
                      <TextField
                        className="ml-2"
                        value={type}
                        variant="outlined"
                        fullWidth
                        disabled
                      />
                      <TextField
                        className="ml-2"
                        value={taxLedger}
                        variant="outlined"
                        fullWidth
                        disabled
                      />
                      <TextField
                        className="ml-2"
                        value={ledgerRate}
                        variant="outlined"
                        fullWidth
                        disabled
                      />
                      <TextField
                        name="ledgerAmount"
                        className="ml-2"
                        value={Config.numWithComma(ledAmount)}
                        disabled
                        variant="outlined"
                        fullWidth
                      />
                    </div>
                  </div>
                  <div
                    className="mt-16 ml-16 p-head meta-final-amoount meta-final-amoount-dv"
                    style={{
                      border: "1px solid lightgray",
                      background: "lightgray",
                      fontWeight: "700",
                      justifyContent: "end",
                      display: "flex",
                      marginRight: "18px",
                    }}
                  >
                    <div className="metal-tbl-head addmetal-head">
                      <label>Final Amount :</label>
                      <label> {finalAmoutTotal} </label>
                    </div>
                  </div>
                </>
              )}
              <Grid container alignItems="center" style={{ marginTop: "20px" }}>
                {narration !== null && (
                  <Grid item xs={12} sm={4} md={3} key="1">
                    <TextField
                      label="Narration"
                      name="narration"
                      value={narration}
                      //   error={narrationErr ? true : false}
                      //   helperText={narrationErr}
                      onChange={handleInputDataChange}
                      disabled={pageView ? true : false}
                      variant="outlined"
                      required
                      multiline
                      fullWidth
                      maxRows="3"
                    />
                  </Grid>
                )}
              </Grid>
              <Grid container alignItems="center" style={{ marginTop: "20px" }}>
                {!pageView && (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    style={{ textAlign: "right" }}
                  >
                    <Button
                      id="btn-save"
                      variant="contained"
                      className="w-224"
                      aria-label="Register"
                      onClick={(e) => {
                        handleFormSubmit(e);
                      }}
                    >
                      Update
                    </Button>
                  </Grid>
                )}
              </Grid>
            </div>
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={open}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleClose();
                }
              }}
            >
              <div
                id="modesize-dv"
                style={modalStyle}
                className={clsx(classes.paper, "rounded-8")}
              >
                <h5 className="popup-head p-5">
                  Document list
                  <IconButton
                    style={{ position: "absolute", top: "-1px", right: "7px" }}
                    onClick={handleClose}
                  >
                    <Icon style={{ color: "white" }}>close</Icon>
                  </IconButton>
                </h5>
                {loadingPop && <LoaderPopup />}
                <div style={{ padding: "30px" }}>
                  {!pageView && (
                    <div>
                      <Grid item xs={6} lg={6} sm={6}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "10px",
                            paddingLeft: "15px",
                            color: "#242424"
                          }}
                        >
                          Upload document
                        </label>
                        <TextField
                          className="uploadDoc mb-10"
                          placeholder="Upload document"
                          type="file"
                          inputProps={{
                            multiple: true,
                          }}
                          onChange={(e) => setDocFile(e.target.files)}
                          variant="outlined"
                          fullWidth
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </div>
                  )}

                  <div style={{ maxHeight: "500px", overflow: "scroll" }}>
                    <MaUTable className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>
                            No
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            File Name
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {documentList.map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className={classes.tableRowPad}>
                              {i + 1}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row.file_name
                                ? row.file_name
                                : row.original_file_name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {/* <a target="_blank" href={`${Config.getS3Url()}vkjdev/voucherentry/document/${row.file_name}`} download>
                                        <Icon style={{ color: "black" }}>get_app</Icon>
                                      </a> */}
                              <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  row.file_name
                                    ? window.open(
                                        `${Config.getS3Url()}vkjdev/voucherentry/document/${
                                          row.file_name
                                        }`,
                                        "_blank"
                                      )
                                    : window.open(`${row.docUrl}`, "_blank");
                                }}
                              >
                                  <Icon className="mr-8 download-icone" style={{ color: "dodgerblue" }}>
                                                        <img src={Icones.download_green} alt="" />
                                                    </Icon>
                              </IconButton>

                              {!pageView && (
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
                          </TableRow>
                        ))}
                      </TableBody>
                    </MaUTable>
                  </div>
                </div>
              </div>
            </Modal>

            <Dialog
              open={deleteOpen}
              onClose={handleDeleteClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" className="popup-delete">{"Alert!!!"}
               <IconButton
                  style={{
                    position: "absolute",
                    marginTop: "-5px",
                    right: "15px",
                  }}
                  onClick={handleDeleteClose}
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
                <Button onClick={handleDeleteClose}
                className="delete-dialog-box-cancle-button"
                >
                  Cancel
                </Button>
                <Button onClick={callDeleteDocument}
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

export default VoucherEditView;

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Icon, IconButton } from "@material-ui/core";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import moment from "moment";
import Loader from "app/main/Loader/Loader";
import History from "@history";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { Autocomplete } from "@material-ui/lab";
import Select, { createFilter } from "react-select";
import sendOfReproduction from "app/main/SampleFiles/SendOfReproduction/sendOfReproductionLot.csv";

const useStyles = makeStyles((theme) => ({
  root: {},
  table: {
    // minWidth: 650,
  },
  inputBoxTEST: {
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  tableRowPad: {
    padding: 7,
  },
  tablePad: {
    padding: 0,
  },
  form: {
    marginTop: "3%",
    display: "contents",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  selectBox: {
    marginLeft: "0.5rem",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "10%",
    display: "inline-block",
  },
  tableheader: {
    display: "inline-block",
    textAlign: "center",
  },
  normalSelect: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
  button: {
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
  },
  modalStyle: {
    background: "#FFFFFF",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#000000",
    position: "absolute",
  },
  errorMessage: {
    color: "#f44336",
    position: "absolute",
    bottom: "-3px",
    fontSize: "9px",
    lineHeight: "8px",
    marginTop: 3,
  },
}));

const ViewSendOfReproduction = React.memo((props) => {
  const dispatch = useDispatch();
  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };
  const classes = useStyles();
  // const inputRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const [readOneData, setReadOneData] = useState([]);

  const [voucherNumber, setVoucherNumber] = useState("");

  const [voucherDate, setVoucherDate] = useState(moment().format("YYYY-MM-DD"));

  const [metalNarration, setMetalNarration] = useState("");

  const [combinedData, setCombinedData] = useState([]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [loading]);

  useEffect(() => {
    if (props.reportView === "Report") {
      NavbarSetting("Report", dispatch);
    } else if (props.reportView === "Account") {
      NavbarSetting("Accounts", dispatch);
    } else {
      NavbarSetting("Sales Purchase", dispatch);
    }
  }, []);

  useEffect(() => {
    if (props.location && props.location.state) {
      const idToBeView = props.location.state;
      const data = idToBeView.data;

      console.log(data);
      // Combine data from lotBarcodesDetails and reproductionBarcodes
      if (data) {
        const formattedData = data?.reproductionBarcodes.map(
          (reproBarcode) => ({
            lotNumber: reproBarcode.reproLot?.number,
            categoryName: data.ProductCategory.category_name,
            purity: reproBarcode.reproLot?.purity,
            barcode: reproBarcode.lotBarcodesDetails,
          })
        );
        setCombinedData(formattedData);
        setMetalNarration(data.note)
        setVoucherDate(data.party_voucher_date)
        setVoucherNumber(data.party_voucher_no)
        console.log(data.party_voucher_no);
      }
    }
  }, [props.location]);

  console.log(readOneData, "readOneData");

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            {!props.viewPopup && (
              <Grid container alignItems="center">
                <Grid item xs={7} sm={7} md={7} key="1">
                  <FuseAnimate delay={300}>
                    <Typography className="p-16 pb-8 text-18 font-700">
                      View Send Of Reproduction
                    </Typography>
                  </FuseAnimate>

                  <BreadcrumbsHelper />
                </Grid>

                <Grid
                  item
                  xs={5}
                  sm={5}
                  md={5}
                  key="2"
                  style={{ textAlign: "right", paddingRight: "16px" }}
                >
                  <Button
                    variant="contained"
                    className={classes.button}
                    size="small"
                    onClick={(event) => {
                      History.goBack();
                    }}
                  >
                    Back
                  </Button>
                </Grid>
              </Grid>
            )}

            {/* {loading && <Loader />} */}
            <div
              className="pb-32 pt-32 pl-16 pr-16"
              style={{ marginBottom: "10%", height: "90%" }}
            >
              <div>
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  // onSubmit={handleFormSubmit}
                >
                  <Grid container spacing={2}>
                    <Grid item lg={2} md={4} sm={4} xs={12}>
                      <TextField
                        type="date"
                        name="voucherDate"
                        value={moment(voucherDate).format("YYYY-MM-DD")}
                        label="Party Voucher Date"
                        // onChange={(e) => handleInputChange(e)}
                        // onBlur={handleDateBlur}
                        variant="outlined"
                        required
                        fullWidth
                        // InputProps={{inputProps: { min: moment(new Date("2022-03-17")).format("YYYY-MM-DD"), max: moment().format("YYYY-MM-DD")} }}
                        //   inputProps={{
                        //     min: moment()
                        //       .subtract(backEntryDays, "day")
                        //       .format("YYYY-MM-DD"),
                        //     max: moment().format("YYYY-MM-DD"),
                        //   }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                      />
                    </Grid>
                    {/* )} */}
                    <Grid item lg={2} md={4} sm={4} xs={12}>
                      <TextField
                        label="Party Voucher Number"
                        className={classes.inputBoxTEST}
                        name="voucherNumber"
                        value={voucherNumber}
                        // onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                        disabled
                      />
                    </Grid>
                  </Grid>
                  <Paper style={{ marginTop: 30 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>
                            Lot Number
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Category Name
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Barcode
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Purity
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                        combinedData.length === 0 ? 
                        (<TableRow>
                          <TableCell className={classes.tableRowPad} colSpan={4} style={{textAlign: "center"}}>
                            No Data
                          </TableCell>
                        </TableRow>
                        ) : (
                        combinedData.map((item, index) => {
                          console.log(item);
                          return (
                            <React.Fragment key={item.lotNumber}>
                              <TableRow>
                                <TableCell className={classes.tableRowPad}>
                                  {item.lotNumber}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {item.categoryName}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {item.barcode[0]?.barcode}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {item.purity}
                                </TableCell>
                              </TableRow>
                              {item.barcode?.slice(1).map((barcode, index) => (
                                <TableRow key={`${item.lotNumber}-${index}`}>
                                  <TableCell className={classes.tableRowPad}>
                                    {item.lotNumber}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {item.categoryName}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {barcode.barcode}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {item.purity}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </React.Fragment>
                          )
                        }))}
                      </TableBody>
                    </Table>
                  </Paper>
                </form>

                <div className="textarea-row">
                  <TextField
                    className="mt-16 mr-2"
                    style={{ width: "50%" }}
                    label="Note"
                    name="metalNarration"
                    value={metalNarration}
                    // onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                    multiline
                    minRows={4}
                    maxrows={4}
                    disabled
                  />
                </div>

                {/* {isView && (
                  <Button
                    variant="contained"
                    className={clsx(classes.button, "mt-16 mr-16")}
                    onClick={() => setDocModal(true)}
                  >
                    View Documents
                  </Button>
                )} */}
              </div>
            </div>

            {/* <ViewDocModal
              documentList={documentList}
              handleClose={handleDocModalClose}
              open={docModal}
              updateDocument={updateDocumentArray}
              purchase_flag_id={idToBeView?.id}
              purchase_flag="5"
              concateDocument={concateDocument}
              viewPopup={props.viewPopup}
            /> */}
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
});

export default ViewSendOfReproduction;

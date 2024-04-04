import React, { useState, useEffect } from "react";
import { FuseAnimate } from "@fuse";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import History from "@history";
import axios from "axios";
import * as Actions from "app/store/actions";
import Config from "app/fuse-configs/Config";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Select, { createFilter } from "react-select";
import {
  TextField,
  Checkbox,
  Typography,
} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import moment from "moment";
import Loader from "../../../../../../Loader/Loader";
// "../../../../../../BreadCrubms/BreadcrumbsHelper";
import Autocomplete from "@material-ui/lab/Autocomplete";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { useReactToPrint } from "react-to-print";
import { IsueeSilverCastingPrintComp } from "./PrintComp/IsueeSilverCastingPrintComp";
import sampleFile from "app/main/SampleFiles/DesignModule/cadIssueRead.csv";
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
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  button1: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    // minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  searchBox: {
    padding: 6,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
}));


const IsueeSilverCasting = (props) => {
  const [printObj, setPrintObj] = useState({
    remark: "",
    cadjobNumber: "",
    designerName: "",
    endDate: "",
    voucherNumber: "",
  });

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);

  const handleAfterPrint = () => {
    //React.useCallback
    //resetting after print
    // checkAndReset()
    History.push(`/dashboard/design`, { view: 1, sub: 5, tab: 1 });
  };

  const handleBeforePrint = React.useCallback(() => {
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        resolve();
      }, 10);
    });
  }, []); //setText

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
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
  const onKeyDown = (e) => {
    e.preventDefault();
  };

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Assign_For_Silver_Casting_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  function checkforPrint() {
    if (
      validateNumber() &&
      validatename() &&
      validateEndDate() &&
      validateSelectbox()
    ) {
      callIssueToworker(true);
    }
  }

  useEffect(() => {
    NavbarSetting("Design", dispatch);
  }, []);

  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [cadNo, setCadNo] = useState("");
  const [cadErr, setCadErr] = useState("");
  const [cadApiData, setCadApiData] = useState([]);
  const [cadSearch, setCadSearch] = useState("");
  const [refCADNumberCSV, setRefCADNumberCSV] = useState("");
  const [cadNumList, setCadNumList] = useState([]);

  const [designerList, setDesignerList] = useState([]);
  const [designerName, setDesignerName] = useState("");
  const [designerNameErr, setDesignerNameErr] = useState("");

  const [endDate, setEndDate] = useState("");
  const [endDateErr, setEndDateErr] = useState("");
  const [remark, setRemark] = useState("");

  const [loading, setLoading] = useState(false);

  const [selectDesign, setSelectDesign] = useState([]);
  const [selectErr, setSelectErr] = useState("");

  const [voucherNum, setVoucherNum] = useState("");

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
    getDesignerList();
    getVoucherNum();
  }, []);

  useEffect(() => {
    if (refCADNumberCSV !== "" && refCADNumberCSV !== null) {
      uploadMasterIssueCsv();
    }
  }, [refCADNumberCSV]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (cadSearch) {
        //&& cadSearch.length > 2
        getCADData(cadSearch);
      } else {
        setCadApiData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
    //eslint-disable-next-line
  }, [cadSearch]);

  function getCADData(JobNo) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/cadjob/cad/${JobNo}?tab=5`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log(response.data.data);
          if (response.data.data.length > 0) {
            setCadApiData(response.data.data);
          } else {
            setCadApiData([]);
            dispatch(
              Actions.showMessage({
                message: "Please Insert Proper Job No",
                variant: "error",
              })
            );
          }
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
        setLoading(false);
        handleError(error, dispatch, { api: `api/cadjob/cad/${JobNo}?tab=5` });
      });
  }

  function getVoucherNum() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/silvercasting/getVoucher`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setVoucherNum(response.data.data.voucherNo);
          setPrintObj({
            ...printObj,
            voucherNumber: response.data.data.voucherNo,
          });
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
        setLoading(false);
        handleError(error, dispatch, { api: `api/silvercasting/getVoucher` });
      });
  }

  function getDesignerList() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/cadjob/designer?is_design_master=1`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          const tempData = response.data.data;
          setDesignerList(tempData);
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
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/cadjob/designer?is_design_master=1`,
        });
      });
  }

  let handleJobNoSelect = (JobNo) => {
    let filteredArray = cadApiData.filter(
      (item) => item.CadJobNumber.cad_number === JobNo
    );
    if (filteredArray.length > 0) {
      setCadApiData(filteredArray);
      setCadNumList([
        ...cadNumList,
        ...filteredArray[0].ReceiveJobDetails.map((item) => {
          return {
            id: item.id,
            cad_number: item.temp_cad_no,
          };
        }),
      ]);
      setCadErr("");
      setCadNo(JobNo);
      setPrintObj({ ...printObj, cadjobNumber: JobNo });
    } else {
      setCadNo("");
      setCadNumList([]);

      setCadErr("Please Select Proper CAD No");
    }
  };

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value ? e.target.value : e.target.files;
    const target = e.target;
    const endDateValue = target.type === "checkbox" ? target.checked : target.value;
    var today = moment().format("YYYY-MM-DD"); 

    if (name === "endDate") {
      setEndDate(endDateValue);
      let dateVal = moment(endDateValue).format("YYYY-MM-DD"); //new Date(value);
      if (dateVal >= today ) {
        setEndDateErr("");
      } else {
        setEndDateErr("Enter Valid Date");
      }
      setPrintObj({ ...printObj, endDate: value });
    } else if (name === "remark") {
      setRemark(value);
      setPrintObj({ ...printObj, remark: value });
    } else if (name === "refCADNumber") {
      setRefCADNumberCSV(e.target.files[0]);
      setCadErr("");
    }
  };

  const handleChangeDesigner = (value) => {
    setDesignerName(value);
    setDesignerNameErr("");
    setPrintObj({ ...printObj, designerName: value.label });
  };

  function validateNumber() {
    if (cadNo === "" && refCADNumberCSV === "") {
      setCadErr("Enter valid Job number or upload file");
      return false;
    }
    return true;
  }

  function validateSelectbox() {
    if (selectDesign.length === 0) {
      setSelectErr("Select CAD job number");
      return false;
    }
    return true;
  }

  function validatename() {
    if (designerName === "" || designerName === null) {
      setDesignerNameErr("Select Designer Name");
      return false;
    }
    return true;
  }

  function validateEndDate() {
    if (endDate === "" || endDate === null) {
      setEndDateErr("Enter end date");
      return false;
    }
    return true;
  }

  function uploadMasterIssueCsv() {
    const formData = new FormData();
    formData.append("file", refCADNumberCSV);
    setLoading(true);
    axios
      .post(
        Config.getCommonUrl() + `api/silvercasting/cad/issue/casting`,
        formData
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          let tempData = response.data.data;
          let list = tempData.map((item) => {
            return {
              id: item.id,
              cad_number: item.temp_cad_no,
            };
          });
          setCadNumList(list);
        } else {
          let downloadUrl = response.data.url;
          window.open(downloadUrl);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
          document.getElementById("fileinput").value = "";
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/silvercasting/cad/issue/casting`,
          body: JSON.stringify(formData),
        });
        document.getElementById("fileinput").value = "";
      });
  }

  const handleChangeChecked = (event) => {
    const newVal = event.target.value;
    let newDesignSelect;
    if (selectDesign.indexOf(newVal) > -1) {
      newDesignSelect = selectDesign.filter((s) => s !== newVal);
    } else {
      newDesignSelect = [...selectDesign, newVal];
    }
    setSelectDesign(newDesignSelect);
    setSelectErr("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (
      validateNumber() &&
      validatename() &&
      validateEndDate() &&
      validateSelectbox()
    ) {
      callIssueToworker(false);
    }
  };

  function callIssueToworker(isPrint) {
    const body = {
      employee_id: designerName.value,
      end_date: endDate,
      // select_all: 0,
      remark: remark,
      camJobIds: selectDesign.length > 0 ? selectDesign : null,
      cad_number: cadNo ? cadNo : null,
    };
    setLoading(true);
    axios
      .post(Config.getCommonUrl() + `api/silvercasting/issuedToJobWorker`, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          if (isPrint) {
            handlePrint();
          } else {
            History.push(`/dashboard/design`, { view: 1, sub: 5, tab: 1 });
          }
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
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/silvercasting/issuedToJobWorker`,
          body: body,
        });
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Assign For Silver Casting{" "}
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
              {loading && <Loader />}
              <Grid
                item
                xs={12}
                sm={4}
                md={9}
                key="2"
                style={{ textAlign: "right" }}
              >
                {/* <Button
                  id="voucher-list-btn"
                  variant="contained"
                  className={classes.button1}
                  size="small"
                  onClick={() =>
                    History.push(`/dashboard/design`, { view: 1, sub: 5, tab: 1 })
                  }
                >
                  Back
                </Button> */}

                <div className="btn-back mt-2">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    size="small"
                    onClick={() =>
                      History.push(`/dashboard/design`, {
                        view: 1,
                        sub: 5,
                        tab: 1,
                      })
                    }
                  >
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>
            <div className="main-div-alll">
              <div className="pb-8  pl-8 pr-8 mt-8">
                <Grid container spacing={3}>
                  <Grid
                    item
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>Voucher number</label>
                    <TextField
                      className="mt-1"
                      placeholder="Voucher number"
                      disabled
                      value={voucherNum}
                      variant="outlined"
                      fullWidth
                    />{" "}
                  </Grid>
                  <Grid
                    item
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                    className="packing-slip-input"
                  >
                    <label>Search cad job number</label>
                    <Autocomplete
                      className="mt-1"
                      id="free-solo-demo"
                      freeSolo
                      disableClearable
                      onChange={(event, newValue) => {
                        handleJobNoSelect(newValue);
                      }}
                      onInputChange={(event, newInputValue) => {
                        if (event !== null) {
                          if (event.type === "change")
                            // not using this condition because all other data is showing in dropdown
                            setCadSearch(newInputValue);
                          setCadNumList([]);
                        } else {
                          setCadSearch("");
                        }
                      }}
                      value={cadNo}
                      options={cadApiData.map(
                        (option) => option.CadJobNumber.cad_number
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          style={{ padding: 0 }}
                          placeholder="Search cad job number"
                          disabled={refCADNumberCSV ? true : false}
                          autoFocus
                        />
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>Brows excel</label>
                    <TextField
                      className="mt-1"
                      id="fileinput"
                      placeholder="Brows excel"
                      type="file"
                      inputProps={{
                        multiple: true,
                      }}
                      name="refCADNumber"
                      error={cadErr.length > 0 ? true : false}
                      helperText={cadErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                      disabled={cadNo !== "" ? true : false}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                    className="mt-10"
                  >
                    <a
                      href={sampleFile}
                      download="Silver_Casting_issue_to_worker.csv"
                    >
                      Download Sample{" "}
                    </a>
                  </Grid>
                  <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="mb-16 table_scroll mt-5"
                  >
                    <>
                      <MaUTable className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              CAD Job Number
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {/* CAD Job Number */}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {cadNumList.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="float-left">
                                <FormControlLabel
                                  key={item.id}
                                  label={item.cad_number}
                                  control={
                                    <Checkbox
                                      name={item.cad_number}
                                      value={item.id}
                                      onChange={handleChangeChecked}
                                    />
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>

                        <span style={{ color: "red" }}>
                          {selectErr.length > 0 ? selectErr : ""}
                        </span>
                      </MaUTable>
                    </>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>Designer name</label>
                    <Select
                      className="mt-1"
                      classes={classes}
                      styles={selectStyles}
                      options={designerList.map((group) => ({
                        value: group.id,
                        label: group.username,
                      }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={designerName}
                      onChange={handleChangeDesigner}
                      placeholder="Designer name"
                    />
                    <span style={{ color: "red" }}>
                      {designerNameErr.length > 0 ? designerNameErr : ""}
                    </span>
                  </Grid>
                  <Grid
                    item
                    lg={4}
                    md={4}
                    sm={4}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>End Date</label>
                    <TextField
                      className="mt-1"
                      type="date"
                      placeholder="End Date"
                      name="endDate"
                      value={endDate}
                      error={endDateErr.length > 0 ? true : false}
                      helperText={endDateErr}
                      onChange={(e) => handleInputChange(e)}
                      // onKeyDown={onKeyDown}
                      variant="outlined"
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
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>Remark</label>
                    <TextField
                      className="mt-1"
                      placeholder="Remark"
                      name="remark"
                      value={remark}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                      multiline
                    />
                  </Grid>

                  <Grid lg={12} md={12} sm={12} xs={12} className="mt-10">
                    <Button
                      id="btn-save"
                      className="float-right mr-2"
                      variant="contained"
                      color="primary"
                      onClick={(e) => handleFormSubmit(e)}
                    >
                      SAVE
                    </Button>

                    <Button
                      id="btn-save"
                      className="float-right mr-10"
                      variant="contained"
                      color="primary"
                      onClick={(e) => checkforPrint(e)}
                      hidden={true}
                    >
                      {"save & Print"}{" "}
                    </Button>
                  </Grid>
                  <div style={{ display: "none" }}>
                    <IsueeSilverCastingPrintComp
                      ref={componentRef}
                      printObj={printObj}
                    />
                  </div>
                </Grid>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default IsueeSilverCasting;
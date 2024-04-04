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
import { TextField, Typography, IconButton, Icon } from "@material-ui/core";
import moment from "moment";
import Loader from "../../../../../../Loader/Loader";
// "../../../../../../BreadCrubms/BreadcrumbsHelper";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useReactToPrint } from "react-to-print";
import { CAMRejectionReceivedPrintComp } from "./PrintComp/CAMRejectionReceivedPrintComp";
import sampleFile from "app/main/SampleFiles/DesignModule/camReceiveCSV.csv";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},

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
}));

const CAMRejectionReceived = (props) => {
  const [printObj, setPrintObj] = useState({
    remark: "",
    cadjobNumber: "",
    workerName: "",
    processType: "",
  });

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);

  const handleAfterPrint = () => {
    //React.useCallback
    //resetting after print
    // checkAndReset()
    History.push(`/dashboard/design`, { view: 1, sub: 3, tab: 4 });
  };

  const handleBeforePrint = React.useCallback(() => {}, []);

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

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "CAM_Repairing_Receive_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  function checkforPrint() {
    handlePrint();
    // if (
    //   validateFile() &&
    //   validateWorker() &&
    //   validateNextProcess() &&
    //   receiveLength()
    // ) {
    //   callRepairingReceiveApi();
    // }
  }
  const classes = useStyles();
  const dispatch = useDispatch();

  const [cadErr, setCadErr] = useState("");
  const [refCADNumberCSV, setRefCADNumberCSV] = useState("");
  const [cadNumList, setCadNumList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [workerList, setworkerList] = useState([]);
  const [workerName, setworkerName] = useState("");
  const [workerNameErr, setworkerNameErr] = useState("");

  const [processTypeData, setProcessTypeData] = useState([]);
  const [processType, setProcessType] = useState("");
  const [ProcessTypeErr, setProcessTypeErr] = useState("");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    NavbarSetting("Design", dispatch);
  }, []);

  useEffect(() => {
    getworkerList();
    getProcessData();
  }, [dispatch]);

  useEffect(() => {
    if (refCADNumberCSV !== "" && refCADNumberCSV !== null) {
      uploadReceiveJobWorkerCsv();
    }
  }, [refCADNumberCSV]);

  function getworkerList() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/cadjob/designer?is_design_master=1`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          const tempData = response.data.data;
          setworkerList(tempData);
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

  const handleChangeworker = (value) => {
    setworkerName(value);
    setworkerNameErr("");
    setPrintObj({ ...printObj, workerName: value.label });
  };

  function validateFile() {
    if (refCADNumberCSV === "") {
      setCadErr("upload file");
      return false;
    }
    return true;
  }

  function validateWorker() {
    if (workerName === "") {
      setworkerNameErr("Select worker name");
      return false;
    }
    return true;
  }

  function validateNextProcess() {
    if (processType === "") {
      setProcessTypeErr("Select next process");
      return false;
    }
    return true;
  }
  function receiveLength() {
    if (cadNumList.length === 0) {
      dispatch(
        Actions.showMessage({ message: "You does not have receive entry" })
      );
      return false;
    }
    return true;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (
      validateFile() &&
      validateWorker() &&
      validateNextProcess() &&
      receiveLength()
    ) {
      callRepairingReceiveApi();
    }
  };

  function callRepairingReceiveApi() {
    let arrData = [];
    cadNumList.map((item) => {
      arrData.push({
        cam_issue_to_job_worker_id: item.id,
        cam_weight: item.cad_weight,
        size: item.size,
        cad_id: item.cad_id,
      });
    });
    const body = {
      employee_id: workerName.value,
      next_process: processType.value,
      repairing_remark: remark,
      camJobReceive: arrData,
    };
    setLoading(true);
    axios
      .post(Config.getCommonUrl() + `api/camJob/repair/receive`, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          History.push(`/dashboard/design`, { view: 1, sub: 3 });
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
          api: `api/camJob/repair/receive`,
          body: body,
        });
      });
  }

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "remark") {
      setRemark(value);
      setPrintObj({ ...printObj, remark: value });
    } else if (name === "refCADNumber") {
      if (e.target.files[0].type === "text/csv") {
        setRefCADNumberCSV(e.target.files[0]);
        setCadErr("");
      } else {
        // setCadErr("Invalid File Format");
        dispatch(Actions.showMessage({ message: "Accept only csv format" }));
        document.getElementById("fileinput").value = "";
      }
    }
  };

  function uploadReceiveJobWorkerCsv() {
    const formData = new FormData();
    formData.append("file", refCADNumberCSV);
    setLoading(true);
    axios
      .post(
        Config.getCommonUrl() + `api/camJob/csv/read/issue/received`,
        formData
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setCadNumList(response.data.data);
        } else {
          setCadNumList([]);
          let downloadUrl = response.data.url;
          window.open(downloadUrl);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          document.getElementById("fileinput").value = "";
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/camJob/csv/read/issue/received`,
          body: JSON.stringify(formData),
        });
        document.getElementById("fileinput").value = "";
      });
  }

  function getProcessData(arrData) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/cadjob/next/process")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const key = Object.values(response.data.data);
          const values = Object.keys(response.data.data);
          let temp = [];
          for (let i = 0; i < values.length; i++) {
            temp.push({
              value: key[i],
              label: values[i],
            });
          }
          setProcessTypeData(temp);
          const findIndex = temp.findIndex((a) => a.value === arrData);
          if (findIndex !== -1) {
            setProcessType({
              label: temp[findIndex].label,
            });
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
        handleError(error, dispatch, { api: "api/cadjob/next/process" });
      });
  }

  function handleChangePocessType(value) {
    setProcessType(value);
    setProcessTypeErr("");
    setPrintObj({ ...printObj, processType: value.label });
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
                    CAM Repairing Receive
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
                    History.push(`/dashboard/design`, { view: 1, sub: 3, tab: 4 })
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
                        sub: 3,
                        tab: 4,
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
                    <label>Worker name</label>
                    <Select
                      className="mt-1"
                      classes={classes}
                      // styles={selectStyles}
                      options={workerList.map((group) => ({
                        value: group.id,
                        label: group.username,
                      }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={workerName}
                      onChange={handleChangeworker}
                      placeholder="Worker name"
                    />
                    <span style={{ color: "red" }}>
                      {workerNameErr.length > 0 ? workerNameErr : ""}
                    </span>
                  </Grid>
                  <Grid
                    item
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>Next process</label>
                    <Select
                      className="mt-1"
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      // styles={selectStyles}
                      options={processTypeData.filter(
                        (x) => x.label != "Cam Job"
                      )}
                      value={processType}
                      onChange={handleChangePocessType}
                      placeholder="Next process"
                    />
                    <span style={{ color: "red" }}>
                      {ProcessTypeErr.length > 0 ? ProcessTypeErr : ""}
                    </span>
                  </Grid>

                  <Grid item lg={3} md={6} sm={6} xs={6} style={{ padding: 6 }}>
                    <label>Brows excel</label>
                    <TextField
                      className="mt-1"
                      id="fileinput"
                      placeholder="Brows excel"
                      type="file"
                      inputProps={{
                        accept: ".csv",
                      }}
                      name="refCADNumber"
                      // error={cadErr.length > 0 ? true : false}
                      // helperText={cadErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <span style={{ color: "red" }}>
                      {cadErr.length > 0 ? cadErr : ""}
                    </span>
                  </Grid>

                  <Grid
                    item
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{
                      padding: 6,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <a href={sampleFile} download="CAM_repairing_receive.csv">
                      Download Sample{" "}
                    </a>
                  </Grid>

                  <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="mt-16 mb-16 table_scroll"
                  >
                    <div className="view_design_list_blg">
                      <MaUTable className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              CAD Number
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              CAM Weight
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Size
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {cadNumList.map((row, i) => (
                            <TableRow key={i}>
                              <TableCell className={classes.tableRowPad}>
                                {row.final_cad_number}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.cad_weight}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row.size}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </MaUTable>
                    </div>
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
                    <CAMRejectionReceivedPrintComp
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

export default CAMRejectionReceived;

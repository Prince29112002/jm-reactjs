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
import sampleFile from "app/main/SampleFiles/DesignModule/cadCSV.csv";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},

  button1: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
  },
}));

const CADRejectionReceived = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [workerList, setworkerList] = useState([]);
  const [workerName, setworkerName] = useState("");
  const [workerNameErr, setworkerNameErr] = useState("");

  const [processType, setProcessType] = useState("");
  const [ProcessTypeErr, setProcessTypeErr] = useState("");

  const [cadFiles, setCadFiles] = useState("");
  const [cadFilesErr, setCadFilesErr] = useState("");

  const [engImages, setEngImages] = useState("");
  const [engImgErr, setEngImgErr] = useState("");

  const [detailsFile, setDetailsFile] = useState("");
  const [detFilesErr, setDetFilesErr] = useState("");

  const [remark, setRemark] = useState("");

  const [jobNumList, setJobNumList] = useState([]);
  const [selectedCadJob, setSelectedCadJob] = useState("");
  const [selectedCadJobErr, setSelectedCadJobErr] = useState("");

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
    NavbarSetting("Design", dispatch);
  }, []);

  useEffect(() => {
    getworkerList();
    getJobNumApiCall();
  }, [dispatch]);

  const processTypeData = [
    { id: 2, name: "CAM Master" },
    { id: 1, name: "Direct Casting" },
  ];

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

  function getJobNumApiCall() {
    axios
      .get(Config.getCommonUrl() + "api/cadjob/list/issue")
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setJobNumList(res.data.data);
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/cadjob/list/issue" });
      });
  }

  const handleChangeworker = (value) => {
    setworkerName(value);
    setworkerNameErr("");
  };

  function handleChangePocessType(value) {
    setProcessType(value);
    setProcessTypeErr("");
  }

  const handleInputChange = (e) => {
    const name = e.target.name;

    if (name === "cadFiles") {
      if(Config.checkFile(e.target.files,"")){
        setCadFiles(e.target.files);
        setCadFilesErr("");
      }else{
        dispatch(Actions.showMessage({ message: "Accept only dwg format" }));
        document.getElementById("fileinput1").value = "";
      }
    } else if (name === "engImages") {
      if(Config.checkFile(e.target.files,"image")){
        setEngImages(e.target.files);
      setEngImgErr("");    

      }else{
        dispatch(Actions.showMessage({ message: "Accept only image format" }));
        document.getElementById("fileinput2").value = "";
      }
    } else if (name === "detailsFile") {
      if(e.target.files[0].type==="text/csv"){
        setDetailsFile(e.target.files[0]);
        setDetFilesErr("");
      }else{
        dispatch(Actions.showMessage({ message: "Accept only csv format" }));
        document.getElementById("fileinput3").value = "";
      }
    }
  };

  const handleChangeJobNum = (value) => {
    setSelectedCadJob(value);
    setSelectedCadJobErr("");
  };

  function cadFilesValidation() {
    if (cadFiles === "") {
      setCadFilesErr("Please Select CAD Files");
      return false;
    }
    return true;
  }

  function EngImgsValidation() {
    if (engImages === "") {
      setEngImgErr("Please Select Images");
      return false;
    }
    return true;
  }

  function detailsFileValidation() {
    if (detailsFile === "") {
      setDetFilesErr("Please Upload Details File");
      return false;
    }
    return true;
  }

  function validateJobNum() {
    if (selectedCadJob === "" || selectedCadJob === null) {
      setSelectedCadJobErr("Select CAD job number");
      return false;
    }
    return true;
  }

  function validateWorkerName() {
    if (workerName === "") {
      setworkerNameErr("Select worker name");
      return false;
    }
    return true;
  }

  function validateProcess() {
    if (processType === "") {
      setProcessTypeErr("Select next process");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (
      validateJobNum() &&
      validateWorkerName() &&
      validateProcess() &&
      cadFilesValidation() &&
      EngImgsValidation() &&
      detailsFileValidation()
    ) {
      const formData = new FormData();

      if (engImages !== null) {
        for (let i = 0; i < engImages.length; i++) {
          formData.append("images", engImages[i]);
        }
      }
      if (cadFiles !== null) {
        for (let i = 0; i < cadFiles.length; i++) {
          formData.append("cadfiles", cadFiles[i]);
        }
      }
      formData.append("csvfiles", detailsFile);
      callUploadDesign(formData);
    }
  };

  function callUploadDesign(formData) {
    setLoading(true);

    formData.append("employee_id", workerName.value);
    formData.append("remark", remark);
    formData.append("next_process", processType.value);

    axios.post(Config.getCommonUrl() + `api/cadJob/cadjob-repair-received-designs/upload/${selectedCadJob.id}/${selectedCadJob.value}`, formData)

      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          History.push(`/dashboard/design`, { view: 1, sub: 2 });
        } else {
          let downloadUrl = response.data.url;
          window.open(downloadUrl);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
          document.getElementById("fileinput1").value = "";
          document.getElementById("fileinput2").value = "";
          document.getElementById("fileinput3").value = "";        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        document.getElementById("fileinput1").value = "";
        document.getElementById("fileinput2").value = "";
        document.getElementById("fileinput3").value = "";
        handleError(error, dispatch, { api: `api/cadJob/cadjob-reject-received-designs/upload/${selectedCadJob.id}/${selectedCadJob.value}`, body: JSON.stringify(formData) })
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0  makeStyles-root-1 pt-20">
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
                    CAD Repairing Received
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
                  onClick={() => History.push(`/dashboard/design`, { view: 1, sub: 2, tab: 3 })}
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
                        sub: 2,
                        tab: 3,
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
                    lg={4}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>CAD number</label>
                    <Select
                      className="mt-1"
                      classes={classes}
                      styles={selectStyles}
                      options={jobNumList.map((group) => ({
                        value: group.id,
                        label: group.temp_cad_no,
                        id: group.CadJobDetails.id,
                      }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={selectedCadJob}
                      autoFocus
                      onChange={handleChangeJobNum}
                      placeholder="CAD number"
                    />
                    <span style={{ color: "red" }}>
                      {selectedCadJobErr.length > 0 ? selectedCadJobErr : ""}
                    </span>
                  </Grid>
                  <Grid
                    item
                    lg={4}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>Worker name</label>
                    <Select
                      className="mt-1"
                      classes={classes}
                      styles={selectStyles}
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
                    lg={4}
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
                      styles={selectStyles}
                      options={processTypeData.map((group) => ({
                        value: group.id,
                        label: group.name,
                      }))}
                      value={processType}
                      onChange={handleChangePocessType}
                      placeholder="Next process"
                    />
                    <span style={{ color: "red" }}>
                      {ProcessTypeErr.length > 0 ? ProcessTypeErr : ""}
                    </span>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>Upload cad</label>
                    <TextField
                      className="mt-1"
                      placeholder="Upload CAD File (DWG/3DM/JCD)"
                      id="fileinput"
                      type="file"
                      inputProps={{
                        multiple: true,
                      accept:".DWG, .3DM, .JCD",
                      }}
                      name="cadFiles"
                      error={cadFilesErr.length > 0 ? true : false}
                      helperText={cadFilesErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>Engineered image</label>
                    <TextField
                      className="mt-1"
                      placeholder="Engineered Image File (JPED/PNG/JPG)"
                      id="fileinput"
                      type="file"
                      inputProps={{
                        multiple: true,
                      accept:".jpeg,.png,.jpg",
                      }}
                      name="engImages"
                      error={engImgErr.length > 0 ? true : false}
                      helperText={engImgErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
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
                  >
                    <label>Upload details (excel)</label>
                    <TextField
                      className="mt-1"
                      placeholder="Upload Details File (CSV)"
                      id="fileinput"
                      type="file"
                      inputProps={{
                        accept:".csv"
                      }}
                      // inputProps={{
                      //     multiple: true
                      // }}
                      name="detailsFile"
                      error={detFilesErr.length > 0 ? true : false}
                      helperText={detFilesErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    lg={1}
                    md={4}
                    sm={6}
                    xs={12}
                    style={{
                      padding: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <a href={sampleFile} download="cadCSV.csv">
                      Download Sample{" "}
                    </a>
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
                      onChange={(e) => setRemark(e.target.value)}
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
                      // onClick={(e) => handleFormSubmit(e)}
                  hidden={true}

                    >
                      SAVE & PRINT
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default CADRejectionReceived;

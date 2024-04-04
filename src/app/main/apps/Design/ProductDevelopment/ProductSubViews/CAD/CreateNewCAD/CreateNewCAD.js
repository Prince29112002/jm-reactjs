import React, { useState, useEffect, useRef } from "react";
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
  Card,
  CardContent,
  Checkbox,
  CardHeader,
  Typography,
} from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import moment from "moment";
import Loader from "../../../../../../Loader/Loader";
// "../../../../../../BreadCrubms/BreadcrumbsHelper";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import { CreateCadPrintComp } from "./PrintComp/CreateCadPrintComp";
import { useReactToPrint } from "react-to-print";
import Icones from "assets/fornt-icons/Mainicons";
import { Label } from "@material-ui/icons";

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

const CreateNewCAD = (props) => {

  const [printObj, setPrintObj] = useState({ remark: "", endDate: "", designerName: "", selectedCadJob: "" })

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);

  const handleAfterPrint = () => { //React.useCallback
    //resetting after print 
    // checkAndReset()
    History.push(`/dashboard/design`, { view: 1, sub: 2, tab: 1, })

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
  }, []);//setText

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  function getDateAndTime() {
    return new Date().getDate() + "_" + (new Date().getMonth() + 1) + "_" + new Date().getFullYear() + "_" + new Date().getHours() + ":" + new Date().getMinutes()
  }
  const onKeyDown = (e) => {
    e.preventDefault();
  };


  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "New_CAD_Request_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true
  });

  function checkforPrint() {
    if (
      validateJobNum() &&
      validatename() &&
      validateEndDate() &&
      validateCheckeddesign()
    ) {
      callAddCADapi(true);
    }
  }

  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [jobNumList, setJobNumList] = useState([]);
  const [selectedCadJob, setSelectedCadJob] = useState("");
  const [selectedCadJobErr, setSelectedCadJobErr] = useState("");

  const [designerList, setDesignerList] = useState([]);
  const [designerName, setDesignerName] = useState("");
  const [designerNameErr, setDesignerNameErr] = useState("");

  const [endDate, setEndDate] = useState("");
  const [endDateErr, setEndDateErr] = useState("");

  const [designAll, setDesignAll] = useState("1");
  const [designAllErr, setDesignOAllErr] = useState("");

  const [designList, setDesignList] = useState([]);
  const [selectDesign, setSelectDesign] = useState([]);

  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    NavbarSetting("Design", dispatch);
  }, []);

  useEffect(() => {
    getJonNumApiCall();
    getDesignerList();
  }, []);

  function getJonNumApiCall() {
    axios
      .get(Config.getCommonUrl() + "api/designjob/job/number")
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setJobNumList(res.data.data);
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/designjob/job/number" });
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
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: `api/cadjob/designer?is_design_master=1` });
      });
  }

  function fetchDesignList(selectedJobNoID) {
    axios
      .get(
        Config.getCommonUrl() +
        `api/designjob/design/list/${selectedJobNoID}`
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setDesignList(res.data.data);
        }
        else {
          setDesignList([])
        }
      })
      .catch((error) => {
        setDesignList([])
        handleError(error, dispatch, {
          api: `api/designjob/design/list/${selectedJobNoID}`,
        });
      });
  }

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const handleChangeChecked = (event) => {
    const newVal = event.target.value;
    let newDesignSelect;
    if (selectDesign.indexOf(newVal) > -1) {
      newDesignSelect = selectDesign.filter((s) => s !== newVal);
    } else {
      newDesignSelect = [...selectDesign, newVal];
    }
    setSelectDesign(newDesignSelect);
  };

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
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
      setPrintObj({ ...printObj, endDate: value })
    } else if (name === "designAll") {
      if (validateJobNum()) {
        setDesignAll(value);
        setDesignOAllErr("");
        if (value === "0") {
          if (validateJobNum()) {
            fetchDesignList(selectedCadJob.value);
          }
        }
      }
    } else if (name === "remark") {
      setRemark(value);
      setPrintObj({ ...printObj, remark: value })
    }
  };
  const handleChangeJobNum = (value) => {
    setSelectedCadJob(value);
    setSelectedCadJobErr("");
    // setDesignAll("")
    setPrintObj({ ...printObj, selectedCadJob: value.label })
    if (designAll === "0") {
      // if (validateJobNum()) {
      fetchDesignList(value.value);
      // }
    }
  };
  const handleChangeDesigner = (value) => {
    setDesignerName(value);
    setDesignerNameErr("");
    setPrintObj({ ...printObj, designerName: value.label })
  };

  function validateJobNum() {
    if (selectedCadJob === "" || selectedCadJob === null) {
      setSelectedCadJobErr("Select CAD job number");
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

  function validateCheckeddesign() {
    if (designAll === "0" && selectDesign.length === 0) {
      setDesignOAllErr("Select Sketch number");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (
      validateJobNum() &&
      validatename() &&
      validateEndDate() &&
      validateCheckeddesign()
    ) {
      callAddCADapi(false);
    }
  };

  function callAddCADapi(isPrint) {
    const body = {
      design_job_id: selectedCadJob.value,
      employee_id: designerName.value,
      end_date: endDate,
      select_all: designAll,
      remark: remark,
      design_job_receive_designs_id: selectDesign
    };
    axios
      .post(Config.getCommonUrl() + `api/cadjob`, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          if (isPrint) {
            handlePrint();
          } else {
            History.push(`/dashboard/design`, { view: 1, sub: 2, tab: 1, })
          }
          dispatch(Actions.showMessage({ message: response.data.message, variant: "success" }));
        }
        else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/cadjob`, body: body });
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
                    New CAD Request
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
                  onClick={() => History.push(`/dashboard/design`, { view: 1, sub: 2, tab: 1, })}
                >
                  Back
                </Button> */}
                <div className="btn-back mt-2">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    size="small"
                    onClick={() => History.push(`/dashboard/design`, { view: 1, sub: 2, tab: 1, })}
                  >
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>
            <div className="main-div-alll">
              <div className="pb-8  pl-8 pr-8 mt-8">
                <Grid container spacing={3}>
                  <Grid item lg={4} md={4} sm={6} xs={12} style={{ padding: 6 }}>
                    <label>CAD job number</label>
                    <Select
                      className="mt-1"
                      classes={classes}
                      styles={selectStyles}
                      options={jobNumList.map((group) => ({
                        value: group.id,
                        label: group.JobNumber.number,
                      }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={selectedCadJob}
                      autoFocus
                      onChange={handleChangeJobNum}
                      placeholder="CAD job number"
                    />
                    <span style={{ color: "red" }}>
                      {selectedCadJobErr.length > 0 ? selectedCadJobErr : ""}
                    </span>
                  </Grid>
                  <Grid item lg={4} md={4} sm={6} xs={12} style={{ padding: 6 }}>
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
                  <Grid item lg={4} md={4} sm={4} xs={12} style={{ padding: 6 }}>
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
                        max: moment().format("YYYY-MM-DD"),
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item lg={6} md={4} sm={4} xs={12} style={{ padding: 6 }}>
                    <FormControl
                      id="redio-input-dv"
                      component="fieldset"
                      className={classes.formControl}
                    >
                      <RadioGroup
                        aria-label="Gender"
                        id="radio-row-dv"
                        name="designAll"
                        className={classes.group}
                        value={designAll}
                        onChange={handleInputChange}
                      >
                        <Grid item xs={12} style={{ padding: 0 }}>
                          <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="All Design"
                          />
                          <FormControlLabel
                            value="0"
                            control={<Radio />}
                            label="Select Design"
                          />
                        </Grid>
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {designAll === "0" ? (
                    <Grid
                      item
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      style={{ padding: 6 }}
                    >
                      <Card sx={{ minWidth: 275 }}>
                        <CardHeader
                          style={{ backgroundColor: "#EBEEFB", padding: 5 }}
                          subheader="Sketch No"
                        />
                        <CardContent>
                          <Grid container spacing={3}>
                            {designList.map((item, index) => (
                              <Grid

                                item
                                key={index}
                                lg={2}
                                md={2}
                                sm={2}
                                xs={2}
                                style={{ padding: 6 }}
                              >

                                <FormControlLabel
                                  key={item.id}
                                  // label={item.image_file.split(".")[0]}
                                  control={
                                    <>
                                      <Checkbox
                                        name={item.image_file}
                                        value={item.id}
                                        onChange={handleChangeChecked}

                                      />
                                      <img
                                        src={`${Config.getS3Url()}vkjdev/designjobreceive/image/${item.upload_file_name}?w=248&fit=crop&auto=format`}
                                        style={{ width: "40px", height: "40px", border: "1px solid gray", }}
                                      />
                                      <span className="mx-2">{item.image_file.split(".")[0]}</span>
                                    </>
                                  }
                                />
                              </Grid>
                            ))}
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ) : (
                    ""
                  )}

                  <span style={{ color: "red" }}>
                    {designAllErr.length > 0 ? designAllErr : ""}
                  </span>

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
                      className="float-right mr-2"
                      id="btn-save"
                      variant="contained"
                      color="primary"
                      onClick={(e) => handleFormSubmit(e)}
                    >
                      SAVE
                    </Button>
                    <Button
                      className="float-right mr-10"
                      id="btn-save"
                      variant="contained"
                      color="primary"
                      onClick={(e) => checkforPrint(e)}
                    hidden={true}

                    >
                      Save & Print
                    </Button>
                  </Grid>
                  {/* <Grid item lg={2} md={2} sm={2} xs={2} style={{ padding: 6 }}>
                   
                  </Grid> */}
                  {/* <Grid item lg={2} md={2} sm={2} xs={2} style={{ padding: 6 }}>
                   
                  </Grid> */}
                  <div style={{ display: "none" }}>
                    <CreateCadPrintComp ref={componentRef} printObj={printObj} />
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

export default CreateNewCAD;

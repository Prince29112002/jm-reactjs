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
import { TextField, Checkbox, Typography } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Loader from "../../../../../../Loader/Loader";
// "../../../../../../BreadCrubms/BreadcrumbsHelper";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ReceiveWorkerMasterPrintCom } from "./ReceiveWorkerMasterPrintCom/ReceiveWorkerMasterPrintCom";
import { useReactToPrint } from "react-to-print";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import sampleFile from "app/main/SampleFiles/DesignModule/camReceiveCSV.csv"
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

const ReceiveFromWorkerMaster = (props) => {

  const [printObj, setPrintObj] = useState({ remark: "", designerName: "", invoicenumber: "" })

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);

  const handleAfterPrint = () => { //React.useCallback
    //resetting after print 
    // checkAndReset()
    History.push(`/dashboard/design`, { view: 1, sub: 4, tab: 2, })

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

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Master_Receive_From_Worker_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true
  });

  function checkforPrint() {
    if (validatename() && validateNumber()) {
      if (checked) {
        if (validateinum()) {
          callCAmReceiveWorkerapi(true);

        }
      } else {
        callCAmReceiveWorkerapi(true);
      }
    }
  }

  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [cadErr, setCadErr] = useState("");
  const [cadNumList, setCadNumList] = useState([]);

  const [designerList, setDesignerList] = useState([]);
  const [designerName, setDesignerName] = useState("");
  const [designerNameErr, setDesignerNameErr] = useState("");
  const [refCADNumberCSV, setRefCADNumberCSV] = useState("");

  const [partyInvoice, setPartyInvoice] = useState(false);

  const [inum, setInum] = useState("");
  const [inumErr, setInumErr] = useState("");

  const [remark, setRemark] = useState("");

  const [loading, setLoading] = useState(false);

  const [checked, setChecked] = useState(false);
  const [text, setText] = useState("");

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
    NavbarSetting('Design', dispatch);
  }, []);

  useEffect(() => {
    getDesignerList();
  }, []);

  useEffect(() => {
    if (refCADNumberCSV !== "" && refCADNumberCSV !== null) {
      uploadReceiveJobWorkerCsv();
    }
  }, [refCADNumberCSV]);

  function getDesignerList() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/cadjob/designer?is_design_master=1`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          const tempData = response.data.data;
          setDesignerList(tempData);
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: `api/cadjob/designer?is_design_master=1` });
      });
  }

  const handleChangeDesigner = (value) => {
    setDesignerName(value);
    setDesignerNameErr("");
    setPrintObj({ ...printObj, designerName: value.label })
  };

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value ? e.target.value : "";

    if (name === "remark") {
      setRemark(value);
      setPrintObj({ ...printObj, remark: value })
    } else if (name === "refCADNumber") {
      setRefCADNumberCSV(e.target.files[0]);
      setCadErr("");
    } else if (name === "inum") {
      setInum(value);
      setInumErr("");
      setPrintObj({ ...printObj, invoicenumber: value })
    } else if (name === "partyInvoice") {
      setPartyInvoice(e.target.checked);

    }
  };

  function uploadReceiveJobWorkerCsv() {
    const formData = new FormData();
    formData.append("file", refCADNumberCSV);
    setLoading(true);
    axios
      .post(
        Config.getCommonUrl() + `api/cammasterfinish/csv/read`,
        formData
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setCadNumList(response.data.data);
        } else {
          let downloadUrl = response.data.url;
          window.open(downloadUrl);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          document.getElementById("fileinput").value = "";
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/cammasterfinish/csv/read`,
          body: JSON.stringify(formData),
        });
        document.getElementById("fileinput").value = "";
      });
  }

  function validatename() {
    if (designerName === "" || designerName === null) {
      setDesignerNameErr("Select Designer Name");
      return false;
    }
    return true;
  }

  function validateNumber() {
    if (refCADNumberCSV === "") {
      setCadErr("upload file");
      return false;
    }
    return true;
  }

  function validateinum() {
    if (inum === "") {
      setInumErr("Enter Party Invoice Number ");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validatename() && validateNumber()) {
      if (checked) {
        if (validateinum()) {
          callCAmReceiveWorkerapi(false);

        }
      } else {

        callCAmReceiveWorkerapi(false);
      }
    }
  };

  function callCAmReceiveWorkerapi(isPrint) {
    let arrData = [];
    cadNumList.map((item) => {
      arrData.push({
        cam_finish_master_id: item.id,
        cam_weight: item.cad_weight,
        size: item.size,
        // amount: item.amount,
        // receipt_number: item.recept_number,
      });
    });
    const body = {
      receipt_number: inum,
      employee_id: designerName.value,
      receive_remark: remark,
      camJobReceive: arrData,
    };
    setLoading(true);
    axios
      .post(Config.getCommonUrl() + `api/cammasterfinish/receive`, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          if (isPrint) {
            handlePrint();
          } else {
            History.push(`/dashboard/design`, { view: 1, sub: 4, tab: 2 })
          }
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: `api/cammasterfinish/receive`, body: body });
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
                {" "}
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Master Receive From Worker
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
                    History.push(`/dashboard/design`, { view: 1, sub: 4, tab: 2 })
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
                      History.push(`/dashboard/design`, { view: 1, sub: 4, tab: 2 })
                    }
                  >
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>
            <div className="main-div-alll">
              <div className="pb-8 mt-8">
              <Grid container spacing={3}>
                <Grid
                  item
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  style={{ padding: 6 }}
                >
                  {" "}
                  <div className="model-row-blg-dv">
                    <Grid
                      item
                      lg={4}
                      md={12}
                      sm={12}
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
                      md={6}
                      sm={6}
                      xs={6}
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
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />


                    </Grid>
                    <Grid
                      item
                      lg={4}
                      md={6}
                      sm={6}
                      xs={6}
                      style={{ padding: 6 }}
                    >
                      <a href={sampleFile} download="Master_Finish_receive_from_worker.csv" >Download Sample </a>

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
                                CAM Size
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
                                <TableCell className={clsx(classes.tableRowPad,"pr-28")}>
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
                      lg={6}
                      md={4}
                      sm={6}
                      xs={12}
                      style={{ padding: 6 }}
                      className="packing-slip-input"
                    >
                      <FormControlLabel
                        label="Party Invoice Number"
                        control={
                          <Checkbox
                            name="partyInvoice"
                            value={partyInvoice}
                            checked={checked}
                            onChange={() => {
                              if (checked) {
                                setText("");
                              }
                              setChecked(!checked);
                            }}
                          />
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      lg={6}
                      md={12}
                      sm={12}
                      xs={12}
                        style={{ padding: 6 }}
                        hidden={!checked}
                      >
                        <label>Invoice number</label>
                        <TextField
                          className="mt-1"
                        placeholder="Invoice number"
                        name="inum"
                        error={inumErr.length > 0 ? true : false}
                        helperText={inumErr}
                        onChange={(e) => {
                          handleInputChange(e);
                          setText(e.target.value);
                        }}
                        variant="outlined"
                        fullWidth
                        // hidden={!checked}
                        value={text}
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
                      // onClick={(e) => handleFormSubmit(e)}
                      hidden={true}
                      >
                        Save & Print
                      </Button>
                    </Grid>
                    <div style={{ display: "none" }}>
                      <ReceiveWorkerMasterPrintCom ref={componentRef} printObj={printObj} />
                    </div>
                  </div>
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

export default ReceiveFromWorkerMaster;

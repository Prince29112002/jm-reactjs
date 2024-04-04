import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Grid from "@material-ui/core/Grid";
import History from "@history";
import Select, { createFilter } from "react-select";
import { Icon, IconButton } from "@material-ui/core";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  form: {
    marginTop: "3%",
    display: "contents",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  dynamicInput: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainDepttable: {
    textAlign: "left",
    borderBottom: "1px solid gray",
    padding: "5px 5px 5px 15px",
  },
}));

const AddProcessline = (props) => {
  // const isEdit = props.isEdit; //if comes from edit
  // const idToBeEdited = props.editID;

  // const [apiData, setApiData] = useState([]);
  const dispatch = useDispatch();

  const [processName, setprocessName] = useState("");
  const [processNameErr, setprocessNameErr] = useState("");

  const [categoryData, setcategoryData] = useState([]);
  const [selectedcategory, setSelectedcategory] = useState("");
  const [selectedcategoryErr, setselectedcategoryErr] = useState("");

  const [processData, setProcessData] = useState([]);
  const data = [
    { id: "1", name: "brijesh" },
    { id: "2", name: "jenish" },
    { id: "3", name: "jay" },
  ];
  const [selectedprocess, setSelectedprocessy] = useState("");
  const [selectedprocessErr, setselectedprocessErr] = useState("");
  //   const [selectedProcess, setSelectedProcess] = useState("");
  //   const [selectedProcessErr, setSelectedProcessErr] = useState("");

  const [processDataformValues, setProcessDataFormValues] = useState([
    {
      value: "",
      label: "",
      errors: {
        label: null,
      },
    },
  ]);
  console.log(processDataformValues);
  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    console.log("useEffect");
    getProductCategories();
    getProcessData();
  }, [dispatch]);

  let addProcessFormFields = () => {
    if (processselect()) {
      let tempRecord = [...processDataformValues];
      tempRecord.push({
        value: selectedprocess.value,
        label: selectedprocess.label,
        errors: {
          label: null,
        },
      });
      setProcessDataFormValues(tempRecord);
      setSelectedprocessy("");
      console.log(tempRecord);
    }
  };

  let removeProcessFormFields = (i) => {
    let newFormValues = [...processDataformValues];
    newFormValues.splice(i, 1);
    setProcessDataFormValues(newFormValues);
  };

  const theme = useTheme();

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

  function departmentNmValidation() {
    if (selectedcategory === "") {
      setselectedcategoryErr("Please Select Category");
      return false;
    }
    return true;
  }
  function processselect() {
    if (selectedprocess === "") {
      setselectedprocessErr("Please Select Process");
      return false;
    }
    return true;
  }
  function processselcetdata() {
    if (processDataformValues.length === 1) {
      dispatch(Actions.showMessage({ message: "Please Select Process Name" }));
      return false;
    }
    return true;
  }
  function processselectname() {
    if (processName === "") {
      setprocessNameErr("Enter Process Name");
      return false;
    }
    return true;
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();
    if (
      processselectname() &&
      // departmentNmValidation() &&
      processselcetdata()
    ) {
      callAddWorkStationApi();
    }
  }

  function callAddWorkStationApi() {
    // console.log(gstType);
    let ProcessData = processDataformValues
      .filter((element) => element.label !== "")
      .map((x) => {
        return {
          process_id: x.value,
        };
      });
    console.log(ProcessData);
    axios
      .post(Config.getCommonUrl() + "api/processline", {
        // code: vendorCode,
        process_line_name: processName,
        // product_category_id: selectedcategory.value,
        process_item: ProcessData,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data
          // setGoldColor("");
          History.goBack(); //.push("/dashboard/masters/vendors");

          dispatch(Actions.showMessage({ message: response.data.message }));
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/processline",
          body: {
            // code: vendorCode,
            process_line_name: processName,
            // product_category_id: selectedcategory.value,
            process_item: ProcessData,
          },
        });
      });
  }

  function handleChnageDepartment(value) {
    // console.log(value);
    setSelectedcategory(value);
    setselectedcategoryErr("");
  }
  function handleProcessChange(value) {
    // console.log(value);
    setSelectedprocessy(value);
    setselectedprocessErr("");
  }
  function handleInputChange(event) {
    // console.log("handleInputChange");

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "processName") {
      setprocessName(value);
      setprocessNameErr("");
    }
  }
  function getProductCategories() {
    // setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/productcategory")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setcategoryData(response.data.data);
        }
      })
      .catch(function (error) {
        // setLoading(false);
        handleError(error, dispatch, { api: "api/productcategory" });
      });
  }
  function getProcessData() {
    axios
      .get(Config.getCommonUrl() + "api/process")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);

          setProcessData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/process" });
      });
  }
  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={8} sm={8} md={8} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Add Process Line
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={4}
                sm={4}
                md={4}
                key="2"
                style={{ textAlign: "right" }}
              >
                <div className="btn-back">
                  <Button
                    id="btn-back"
                    size="small"
                    onClick={(event) => {
                      History.goBack();
                    }}
                  >
                    <img
                      className="back_arrow"
                      src={Icones.arrow_left_pagination}
                      alt=""
                    />
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>
            <div className="main-div-alll " style={{ marginTop: 16 }}>
              <div
                className="pb-32 pt-32 pl-16 pr-16"
                style={{ marginBottom: "10%", height: "90%" }}
              >
                {/* {JSON.stringify(contDetails)} */}
                <div>
                  <form
                    name="registerForm"
                    noValidate
                    className="flex flex-col justify-center w-full"
                    onSubmit={handleFormSubmit}
                  >
                    <label>Process Name</label>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          className=""
                          // label="Process Name"
                          // autoFocus
                          placeholder="Process Name"
                          name="processName"
                          value={processName}
                          error={processNameErr.length > 0 ? true : false}
                          helperText={processNameErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    {/* {processDataformValues.map((element, index) => ( */}
                    <div className="form-inline mt-16 mb-2">
                      <Grid
                        container
                        spacing={2}
                        // style={{ width: "50%" }}
                        className="mt-2"
                      >
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          // style={{ padding: 0, paddingInline: "12px" }}
                        >
                          {/* {console.log(element)} */}
                          <label>Select Process</label>
                          <Select
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            classes={classes}
                            styles={selectStyles}
                            options={processData
                              .filter((array) =>
                                processDataformValues.every(
                                  (item) =>
                                    !(
                                      item.label === array.process_name &&
                                      item.value === array.id
                                    )
                                )
                              )
                              .map((suggestion) => ({
                                value: suggestion.id,
                                label: suggestion.process_name,
                              }))}
                            // components={components}
                            value={selectedprocess}
                            onChange={(e) => {
                              handleProcessChange(e);
                            }}
                            placeholder="Select Process "
                          />
                          <span style={{ color: "red" }}>
                            {selectedprocessErr.length > 0
                              ? selectedprocessErr
                              : ""}
                          </span>
                        </Grid>

                        {/* {index === processDataformValues.length - 1 && ( */}
                        <Grid
                          item
                          xs={1}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-end",
                            marginBottom: "6px",
                          }}
                        >
                          <IconButton
                            style={{ padding: "0" }}
                            onClick={() => addProcessFormFields()}
                          >
                            <Icon className="mr-8" style={{ color: "blue" }}>
                              add_box
                            </Icon>
                          </IconButton>
                        </Grid>
                        {/* )} */}
                      </Grid>
                    </div>
                    {/* ))} */}
                    {/* </div> */}

                    <Grid container spacing={2} style={{ marginTop: "16px" }}>
                      <Grid item xs={6} style={{ border: "1px solid #eee" }}>
                        <div style={{ background: "#eee" }}>
                          <Typography
                            className="p-16"
                            style={{ fontWeight: "700" }}
                          >
                            Process
                          </Typography>
                        </div>
                        {processDataformValues.map((val, idx) => {
                          return (
                            val.label !== "" && (
                              <div className="mt-16" key={idx}>
                                <div
                                  className={clsx(
                                    classes.dynamicInput,
                                    classes.mainDepttable
                                  )}
                                >
                                  <label> {idx}</label>
                                  <label> {val.label}</label>

                                  {processDataformValues.length !== 1 && (
                                    <IconButton
                                      style={{ padding: "0" }}
                                      onClick={() =>
                                        removeProcessFormFields(idx)
                                      }
                                    >
                                      <Icon
                                        className="mr-8"
                                        style={{ color: "red" }}
                                      >
                                        delete
                                      </Icon>
                                    </IconButton>
                                  )}
                                </div>
                              </div>
                            )
                          );
                        })}
                      </Grid>
                    </Grid>
                    {/* <div
                    className="mt-16 mb-2"
                    style={{ border: "1px solid #eee", width: "40%" }}
                  ></div> */}
                  </form>

                  <Button
                    style={{ marginTop: "30px" }}
                    variant="contained"
                    className="w-128 mx-auto mt-20 popup-save"
                    onClick={(e) => {
                      handleFormSubmit(e);
                    }}
                  >
                    Save
                  </Button>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddProcessline;

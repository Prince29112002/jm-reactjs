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
    padding: "5px 5px 5px 15px",
  },
}));

const AddWorkStation = (props) => {
  // const isEdit = props.isEdit; //if comes from edit
  // const idToBeEdited = props.editID;

  // const [apiData, setApiData] = useState([]);
  const dispatch = useDispatch();

  const [workStationName, setWorkStationName] = useState("");
  const [workStationNameErr, setWorkStationNameErr] = useState("");

  const [departmentData, setDepartmentData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDepartmentErr, setSelectedCDepartmentErr] = useState("");

  const [processData, setProcessData] = useState([]);
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

  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);

  let handleProcessChange = (i, e) => {
    let newFormValues = [...processDataformValues];
    newFormValues[i] = {
      value: e.value,
      label: e.label,
      errors: { label: null },
    };
    setProcessDataFormValues(newFormValues);
  };

  let addProcessFormFields = () => {
    if (prevIsValidProcess()) {
      setProcessDataFormValues([
        ...processDataformValues,
        {
          value: "",
          label: "",
          errors: {
            label: null,
          },
        },
      ]);
    }
  };

  const prevIsValidProcess = () => {
    if (processDataformValues.length === 0) {
      return true;
    }

    const someEmpty = processDataformValues.some((item) => item.label === "");

    if (someEmpty) {
      processDataformValues.map((item, index) => {
        const allPrev = [...processDataformValues];
        if (processDataformValues[index].label === "") {
          allPrev[index].errors.label = "Required";
        }
        setProcessDataFormValues(allPrev);
        return true;
      });
    }

    return !someEmpty;
  };

  let removeProcessFormFields = (i) => {
    let newFormValues = [...processDataformValues];
    newFormValues.splice(i, 1);
    setProcessDataFormValues(newFormValues);
  };

  // let handleProcessSubmit = (event) => {
  //   event.preventDefault();
  //   alert(JSON.stringify(processDataformValues));
  // };

  const [workStationformValues, setWorkStationFormValues] = useState([
    {
      name: "",
      errors: {
        name: null,
      },
    },
  ]);

  let handleWorkStationChange = (i, e) => {
    let newFormValues = [...workStationformValues];
    newFormValues[i][e.target.name] = e.target.value;
    newFormValues[i].errors.name =
      e.target.value.length > 0 ? null : [e.target.name] + "required";
    setWorkStationFormValues(newFormValues);

    // setWorkStationFormValues((prev) => {
    //     return prev.map((item,i)=>{
    //         if(i !== index){
    //             return item;
    //         }

    //         return {
    //             ...workStationformValues
    //         }
    //     })
    // })
  };

  const prevIsValid = () => {
    if (workStationformValues.length === 0) {
      return true;
    }

    const someEmpty = workStationformValues.some((item) => item.name === "");

    if (someEmpty) {
      workStationformValues.map((item, index) => {
        const allPrev = [...workStationformValues];
        if (workStationformValues[index].name === "") {
          allPrev[index].errors.name = "Required";
        }
        setWorkStationFormValues(allPrev);
        return true;
      });
    }

    return !someEmpty;
  };

  let addWorkStationFormFields = () => {
    if (prevIsValid()) {
      setWorkStationFormValues([
        ...workStationformValues,
        {
          name: "",
          errors: {
            name: null,
          },
        },
      ]);
    }
  };

  let removeWorkStationFormFields = (i) => {
    let newFormValues = [...workStationformValues];
    newFormValues.splice(i, 1);
    setWorkStationFormValues(newFormValues);
  };

  // let handleWorkStationSubmit = (event) => {
  //   event.preventDefault();
  //   alert(JSON.stringify(workStationformValues));
  // };

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

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "workStationName") {
      setWorkStationName(value);
      setWorkStationNameErr("");
    }
  }

  function workStationNameValidation() {
    var Regex = /^[a-zA-Z\s]*$/;
    if (!workStationName || Regex.test(workStationName) === false) {
      setWorkStationNameErr("Enter Valid Work Station Name");
      return false;
    }
    return true;
  }

  function departmentNmValidation() {
    if (selectedDepartment === "") {
      setSelectedCDepartmentErr("Please Select Department");
      return false;
    }
    return true;
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();

    if (workStationNameValidation() && departmentNmValidation()) {
      const someEmpty = workStationformValues.some((item) => item.name === "");
      if (!someEmpty) {
        const someProcessEmpty = processDataformValues.some(
          (item) => item.label === ""
        );

        if (!someProcessEmpty) {
          callAddWorkStationApi();
        } else {
          processDataformValues.map((item, index) => {
            const allPrev = [...processDataformValues];
            if (processDataformValues[index].label === "") {
              allPrev[index].errors.label = "Required";
            }
            setProcessDataFormValues(allPrev);
            return true;
          });
        }
      } else {
        workStationformValues.map((item, index) => {
          const allPrev = [...workStationformValues];
          if (workStationformValues[index].name === "") {
            allPrev[index].errors.name = "Required";
          }
          setWorkStationFormValues(allPrev);
          return true;
        });
      }
    } else {
    }
  }

  function callAddWorkStationApi() {
    let ProcessData = processDataformValues.map((x) => {
      return {
        process_id: x.value,
      };
    });
    axios
      .post(Config.getCommonUrl() + "api/workstation", {
        name: workStationName,
        department_id: selectedDepartment.value,
        workerData: workStationformValues,
        processData: ProcessData,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data
          // setGoldColor("");
          History.goBack(); //.push("/dashboard/masters/vendors");

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
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/workstation",
          body: {
            // code: vendorCode,
            name: workStationName,
            department_id: selectedDepartment.value,
            workerData: workStationformValues,
            processData: ProcessData,
          },
        });
      });
  }

  useEffect(() => {
    getAllDepartments();
    getProcessData();
 
  }, [dispatch]);

  function getProcessData() {
    axios
      .get(Config.getCommonUrl() + "api/process")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProcessData(response.data.data);
          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/process" });
      });
  }

  function getAllDepartments() {
    axios
      .get(Config.getCommonUrl() + "api/department/all")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setDepartmentData(response.data.data);

          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "api/department/all" });
      });
  }

  function handleChnageDepartment(value) {
    setSelectedDepartment(value);
    setSelectedCDepartmentErr("");
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={6} sm={5} md={5} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Add Work Station
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              {/* <Grid
                item
                xs={6}
                sm={7}
                md={7}
                key="2"
                style={{ textAlign: "right" }}
              >
                <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={(event) => {
                    // History.push("/dashboard/masters/vendors");
                    History.goBack();
                    //   setDefaultView(btndata.id);
                    //   setIsEdit(false);
                  }}
                >
                  Back
                </Button>
              </Grid> */}

              <Grid item xs={6} sm={7} md={7} key="2">
                <div className="btn-back">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    className=""
                    size="small"
                    onClick={(event) => {
                      // History.push("/dashboard/masters/clients");
                      History.goBack();
                      //   setDefaultView(btndata.id);
                      //   setIsEdit(false);
                    }}
                  >
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>

            <div className="main-div-alll">
              {/* {JSON.stringify(contDetails)} */}
              <div>
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  onSubmit={handleFormSubmit}
                >
                  <div className="w-full">
                    <div style={{ display: "flex" }}>
                      <div className="add-textfiled">
                        <label>Work station name*</label>
                        <TextField
                          className=""
                          placeholder="Enter work station name"
                          autoFocus
                          name="workStationName"
                          value={workStationName}
                          error={workStationNameErr.length > 0 ? true : false}
                          helperText={workStationNameErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      </div>

                      <div className="add-textfiled">
                        <label>Department name</label>
                        <Select
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          options={departmentData.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.name,
                          }))}
                          // components={components}
                          value={selectedDepartment}
                          onChange={handleChnageDepartment}
                          placeholder="Select department"
                        />
                        <span style={{ color: "red" }}>
                          {selectedDepartmentErr.length > 0
                            ? selectedDepartmentErr
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div>
                      {workStationformValues.map((element, index) => (
                        <>
                          <div style={{ display: "flex" }} key={`W_${index}`}>
                            <div style={{ width: "340px", paddingTop: "15px" }}>
                              <label>Worker name</label>
                              <TextField
                                className=""
                                placeholder="Enter worker name"
                                name="name"
                                value={element.name || ""}
                                error={
                                  element.errors !== undefined
                                    ? element.errors.name
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  element.errors !== undefined
                                    ? element.errors.name
                                    : ""
                                }
                                onChange={(e) =>
                                  handleWorkStationChange(index, e)
                                }
                                variant="outlined"
                                fullWidth
                              />
                            </div>
                            {index === workStationformValues.length - 1 && (
                              <Button
                                id="btn-save"
                                variant="contained"
                                className="w-130 mt-36"
                                style={{ height: "37px", marginLeft: "15px" }}
                                aria-label="Register"
                                onClick={() => addWorkStationFormFields()}
                              >
                                Add Worker
                              </Button>
                            )}
                          </div>
                        </>
                      ))}
                    </div>

                    <div
                      className="mt-16"
                      style={{
                        border: "1px solid #EBEEFB",
                        width: "340px",
                        borderRadius: "7px 7px 0px 0px",
                        borderBottom: "none",
                        borderLeft: "none",
                        borderRight: "none",
                      }}
                    >
                      <div
                        style={{
                          background: "#EBEEFB",
                          borderRadius: "7px 7px 0px 0px",
                          height: "37px",
                        }}
                      >
                        <Typography
                          style={{
                            fontWeight: "700",
                            padding: "10px",
                            paddingLeft: "20px",
                          }}
                        >
                          Worker Name
                        </Typography>
                      </div>
                      {workStationformValues.map((val, idx) => {
                        return (
                          val.name !== "" && (
                            <div className="mt-16" key={idx}>
                              <div
                                className={clsx(
                                  classes.dynamicInput,
                                  classes.mainDepttable
                                )}
                              >
                                <label> {val.name}</label>

                                {workStationformValues.length !== 1 && (
                                  <IconButton
                                    style={{ padding: "0" }}
                                    onClick={() =>
                                      removeWorkStationFormFields(idx)
                                    }
                                  >
                                    <Icon className="mr-8">
                                      <img src={Icones.delete_red} alt="" />
                                    </Icon>
                                  </IconButton>
                                )}
                              </div>
                            </div>
                          )
                        );
                      })}
                    </div>
                    <div
                      className="add-client-row"
                      style={{ paddingTop: "20px" }}
                    ></div>

                    {/* <div style={{ display: "flex", paddingTop: "35px" }}> */}
                    {processDataformValues.map((element, index) => (
                      <>
                        <div
                          style={{ display: "flex", paddingTop: "15px" }}
                          key={`P_${index}`}
                        >
                          <div style={{ width: "340px", paddingTop: "10px" }}>
                            <label>Process name</label>
                            <Select
                              filterOption={createFilter({
                                ignoreAccents: false,
                              })}
                              classes={classes}
                              styles={selectStyles}
                              options={processData.map((suggestion) => ({
                                value: suggestion.id,
                                label: suggestion.process_name,
                              }))}
                              value={element.value === "" ? "" : element}
                              onChange={(e) => {
                                handleProcessChange(index, e);
                              }}
                              placeholder="Select process"
                            />
                          </div>
                          <span style={{ color: "red" }}>
                            {element.errors !== undefined
                              ? element.errors.label
                              : ""}
                          </span>

                          {index === processDataformValues.length - 1 && (
                            <Button
                              id="btn-save"
                              variant="contained"
                              color="primary"
                              className="w-130 mt-32"
                              style={{ height: "37px", marginLeft: "15px" }}
                              aria-label="Register"
                              onClick={() => addProcessFormFields()}
                            >
                              Add Process
                            </Button>
                          )}
                        </div>
                      </>
                    ))}
                    <div
                      className="mt-16"
                      style={{
                        border: "1px solid #EBEEFB",
                        width: "340px",
                        borderRadius: "7px 7px 0px 0px",
                        borderBottom: "none",
                        borderLeft: "none",
                        borderRight: "none",
                      }}
                    >
                      <div
                        style={{
                          background: "#EBEEFB",
                          borderRadius: "7px 7px 0px 0px",
                          height: "37px",
                        }}
                      >
                        <Typography
                          style={{
                            fontWeight: "700",
                            padding: "10px",
                            paddingLeft: "20px",
                          }}
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
                                <label> {val.label}</label>

                                {processDataformValues.length !== 1 && (
                                  <IconButton
                                    style={{ padding: "0" }}
                                    onClick={() => removeProcessFormFields(idx)}
                                  >
                                    <Icon className="mr-8">
                                      <img src={Icones.delete_red} alt="" />
                                    </Icon>
                                  </IconButton>
                                )}
                              </div>
                            </div>
                          )
                        );
                      })}
                    </div>
                  </div>
                </form>

                <Button
                  id="btn-save"
                  className="w-40 mx-auto mt-16 float-right"
                  aria-label="Register"
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
      </FuseAnimate>
    </div>
  );
};

export default AddWorkStation;

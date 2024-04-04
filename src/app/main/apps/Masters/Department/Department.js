import React, { useState, useEffect } from "react";
import {
  Typography,
  Icon,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputBase,
} from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import { TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Search from "../SearchHelper/SearchHelper";
import Select, { createFilter } from "react-select";
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import SearchIcon from "@material-ui/icons/Search";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    height: "80%",
  },
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
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "340px",
    height: "37px",
    color: "#CCCCCC",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter",
  },
  search: {
    display: "flex",
    border: "1px solid #cccccc",
    float: "right",
    height: "38px",
    width: "340px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
  },
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
  },
  dynamicInput: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fromTrans: {
    width: "100%",
  },
  mainDepttable: {
    textAlign: "left",
    borderBottom: "1px solid gray",
    padding: "5px 5px 5px 15px",
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

const Department = (props) => {
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
  const [apiData, setApiData] = useState([]); // display list
  const [apiSearchData, setApiSearchData] = useState([]);
  const [searchData, setSearchData] = useState("");

  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);

  const [departmentNm, setDepartmentNm] = useState(""); //first textbox creating new department
  const [departmentNmErr, setDepartmentNmErr] = useState("");

  const [aliasCode, setAliasCode] = useState("");
  const [aliasCodeErr, setAliasCodeErr] = useState("");

  const [underDeptChecked, setUnderDeptChecked] = useState(false);

  const [mainDepartmentData, setMainDepartmentData] = useState([]); //dropdown data if first checkbox is checked

  const [selectedMainDepart, setSelectedMainDepart] = useState(""); //selected main department
  const [mainDepartErrTxt, setMainDepartErrTxt] = useState("");

  const [autoTransferChecked, setAutoTransferChecked] = useState(false);

  const [allDepartmentData, setAllDepartmentData] = useState([]);

  const [selectedAllDepart, setSelectedAllDepart] = useState([]); //selected main department
  const [allDepartErrTxt, setAllDepartErrTxt] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [open, setOpen] = useState(false); //confirm delete Dialog
  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const [fromTransValues, setFromTransValues] = useState([""]);
  const [loading, setLoading] = useState(true);
  const [isViewOnly, setIsViewOnly] = useState(false);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    NavbarSetting("Master", dispatch);
  }, []);

  useEffect(() => {
    //get item types
    getDepartmentData(); //main list
    getMainDepartments(); //main depart if under department is checked, for dropdown
    getAllDepartments(); //if auto transfer is checked, for dropdown
    //eslint-disable-next-line
  }, [dispatch]);

  const classes = useStyles();

  function getDepartmentData() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/department")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);

          let tempData = response.data.data;

          let data = tempData.map((item) => {
            return {
              id: item.id,
              departmentName:
                item.parent_id !== null
                  ? item.mainDepartmentname !== null
                    ? item.mainDepartmentname.name
                    : item.name
                  : item.name,
              aliasCode: item.aliase_code !== null ? item.aliase_code : "-",
              subDepartmentNm: item.parent_id !== null ? item.name : "-",
            };
          });
          setApiSearchData(data);
          setLoading(false);
      
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: "api/department" });
      });
  }

  function getMainDepartments() {
    axios
      .get(Config.getCommonUrl() + "api/department/onlymain")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setMainDepartmentData(response.data.data);
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
        handleError(error, dispatch, { api: "api/department/onlymain" });
      });
  }

  function getAllDepartments() {
    axios
      .get(Config.getCommonUrl() + "api/department/all")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setAllDepartmentData(response.data.data);
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
        handleError(error, dispatch, { api: "api/department/all" });
      });
  }

  function handleMainDepartChange(value) {
    setSelectedMainDepart(value);
    setMainDepartErrTxt("");
  }



  function viewHandler(id) {
    setIsViewOnly(true);
    setSelectedIdForEdit("");
    setIsEdit(true);
    setModalOpen(true);

    setDepartmentNm(""); //first textbox creating new department
    setAliasCode("");
    setDepartmentNmErr("");
    setUnderDeptChecked(false);
    setSelectedMainDepart(""); //selected main department
    setMainDepartErrTxt("");
    setAutoTransferChecked(false);
    setSelectedAllDepart(""); //selected main department
    setAllDepartErrTxt("");
    setFromTransValues([""]);

    getOneDepartmentData(id);
  }

  function editHandler(id) {
    setIsViewOnly(false);
    setSelectedIdForEdit(id);
    setIsEdit(true);
    setModalOpen(true);

    setDepartmentNm(""); //first textbox creating new department
    setAliasCode("");
    setDepartmentNmErr("");
    setUnderDeptChecked(false);
    setSelectedMainDepart(""); //selected main department
    setMainDepartErrTxt("");
    setAutoTransferChecked(false);
    setSelectedAllDepart(""); //selected main department
    setAllDepartErrTxt("");
    setFromTransValues([""]);

    getOneDepartmentData(id);
  }

  function getOneDepartmentData(id) {
    // setClientCompanies
    axios
      .get(Config.getCommonUrl() + "api/department/" + id)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let Res = response.data.data;

          setDepartmentNm(Res.name);
          setAliasCode(Res.aliase_code);
          if (Res.parent_id === null) {
            setUnderDeptChecked(false);
            setSelectedMainDepart("");
          } else {
            setUnderDeptChecked(true);
            setSelectedMainDepart({
              value: Res.mainDepartmentname.id,
              label: Res.mainDepartmentname.name,
            });
          }
          if (Res.is_auto_transfer === 0) {
            setAutoTransferChecked(false);
            setSelectedAllDepart("");
          } else {
            setAutoTransferChecked(true);

            if (Res.FromDepartmentList !== false) {
       
              const temp = [];
              for (const item of Res.FromDepartmentList) {
                temp.push({ value: parseInt(item.id), label: item.name });
              }
              setSelectedAllDepart(temp);
              setFromTransValues(temp);
              // }
            }
          }
          // }
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
        handleError(error, dispatch, { api: "api/department/" + id });
      });
  }

  function handleInputChange(event) {

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "departmentNm") {
      setDepartmentNm(value);
      setDepartmentNmErr("");
    } else if (name === "underDepart") {
      setUnderDeptChecked(value);
    } else if (name === "autoTrans") {
      setAutoTransferChecked(value);
    } else if (name === "aliasCode") {
      setAliasCode(value);
      setAliasCodeErr("");
    }
  }

  function departmentNmValidation() {
    var Regex = /^[a-zA-Z0-9 ]+$/;
    if (!departmentNm || Regex.test(departmentNm) === false) {
      // setIsEdtStkGrpNmErr(true);
      setDepartmentNmErr("Please Enter Valid Department Name");

      return false;
    }
    return true;
  }

  function mainDepartNmValidation() {
    if (selectedMainDepart === "") {
      setMainDepartErrTxt("Please Select Department");
      return false;
    }
    return true;
  }

  function allDepartNmValidation() {
    if (selectedAllDepart === "") {
      setAllDepartErrTxt("Please Select Department");
      return false;
    }
    return true;
  }

  function aliasCodeValidation() {
    var Regex = /^[a-zA-Z0-9 ]+$/;
    if (!aliasCode || Regex.test(aliasCode) === false) {
      setAliasCodeErr("Enter Valid Alias Code");
      return false;
    }
    return true;
  }

  const checkforUpdate = (evt) => {
    evt.preventDefault();
    // alert(`Submitting ${itemTypeName}`); && edtItemTypeValidation()
    if (departmentNmValidation() && aliasCodeValidation()) {
      if (underDeptChecked === true) {
        //under department checkbox
        if (mainDepartNmValidation()) {
          if (autoTransferChecked === true) {
            //auto trasnfer checked
            if (allDepartNmValidation()) {
              checkAndCallAPi();
            }
          } else {
            checkAndCallAPi();
          }
        }
      } else {
        if (autoTransferChecked === true) {
          //auto trasnfer checked
          if (allDepartNmValidation()) {
            checkAndCallAPi();
          }
        } else {
          checkAndCallAPi();
        }
      }
    }
  };

  function checkAndCallAPi() {
    if (isEdit === true) {
      CallEditDepartmentApi();
    } else {
      CallAddDepartmentApi();
    }
  }

  function handleModalOpen() {
    setIsViewOnly(false);
    setSelectedIdForEdit("");
    setIsEdit(false);
    setDepartmentNm(""); //first textbox creating new department
    setAliasCode("");
    setDepartmentNmErr("");
    setUnderDeptChecked(false);
    setSelectedMainDepart(""); //selected main department
    setMainDepartErrTxt("");
    setAutoTransferChecked(false);
    setSelectedAllDepart(""); //selected main department
    setAllDepartErrTxt("");
    setModalOpen(true);
    setFromTransValues([""]);
  }

  function handleModalClose(callApi) {
    setModalOpen(false);
    setIsViewOnly(false);
    setSelectedIdForEdit("");
    setIsEdit(false);
    setDepartmentNm(""); //first textbox creating new department
    setAliasCode("");
    setAliasCodeErr("");
    setDepartmentNmErr("");
    setUnderDeptChecked(false);
    setSelectedMainDepart(""); //selected main department
    setMainDepartErrTxt("");
    setAutoTransferChecked(false);
    setSelectedAllDepart(""); //selected main department
    setAllDepartErrTxt("");
    if (callApi === true) {
      getDepartmentData(); //main list
      getMainDepartments(); //main depart if under department is checked, for dropdown
      getAllDepartments(); //if auto transfer is checked, for dropdown
    }
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function callDeleteDepartmentApi() {
    axios
      .delete(Config.getCommonUrl() + "api/department/" + selectedIdForDelete)
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          // selectedIdForDelete

          // const findIndex = apiData.findIndex(
          //   (a) => a.id === selectedIdForDelete
          // );

          // findIndex !== -1 && apiData.splice(findIndex, 1);
          getDepartmentData(); //main list
          getMainDepartments(); //main depart if under department is checked, for dropdown
          getAllDepartments();

          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );

          setSelectedIdForDelete("");
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
        setOpen(false);
        handleError(error, dispatch, {
          api: "api/department/" + selectedIdForDelete,
        });
      });
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function CallAddDepartmentApi() {
    let finalID;
    if (selectedAllDepart !== "") {
      let fromTransId = selectedAllDepart
        .map(function (e) {
          return e.value;
        })
        .join(", ");
      finalID = fromTransId.split(",").map(Number);
    } else {
      finalID = null;
    }
    //add item type
    axios
      .post(Config.getCommonUrl() + "api/department", {
        name: departmentNm,
        is_auto_transfer: autoTransferChecked === true ? 1 : 0,
        from_transfer_department_id:
          autoTransferChecked === true ? finalID : null,
        parent_id: underDeptChecked === true ? selectedMainDepart.value : null,
        aliase_code: aliasCode === "" ? null : aliasCode,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
       
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          //   setGSTPercent("");
          //   setDepartmentNm("");
          //   setModalOpen(false);
          handleModalClose(true);
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
          api: "api/department",
          body: {
            name: departmentNm,
            is_auto_transfer: autoTransferChecked === true ? 1 : 0,
            from_transfer_department_id:
              autoTransferChecked === true ? finalID : null,
            parent_id:
              underDeptChecked === true ? selectedMainDepart.value : null,
            aliase_code: aliasCode === "" ? null : aliasCode,
          },
        });
      });
  }

  function CallEditDepartmentApi() {
    let finalID;
    if (selectedAllDepart !== "") {
      let fromTransId = selectedAllDepart
        .map(function (e) {
          return e.value;
        })
        .join(", ");
      finalID = fromTransId.split(",").map(Number);
    } else {
      finalID = null;
    }
    axios
      .put(Config.getCommonUrl() + "api/department/" + selectedIdForEdit, {
        name: departmentNm,
        is_auto_transfer: autoTransferChecked === true ? 1 : 0,
        from_transfer_department_id:
          autoTransferChecked === true ? finalID : null,
        parent_id: underDeptChecked === true ? selectedMainDepart.value : null,
        aliase_code: aliasCode === "" ? null : aliasCode,
      })
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          handleModalClose(true);
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
          api: "api/department/" + selectedIdForEdit,
          body: {
            name: departmentNm,
            is_auto_transfer: autoTransferChecked === true ? 1 : 0,
            from_transfer_department_id:
              autoTransferChecked === true ? finalID : null,
            parent_id:
              underDeptChecked === true ? selectedMainDepart.value : null,
            aliase_code: aliasCode === "" ? null : aliasCode,
          },
        });
      });
  }

  function onSearchHandler(sData) {
    setSearchData(sData);
  }

  let addFormFields = () => {
    setFromTransValues([...fromTransValues, ""]);
  };

  let removeFormFields = (i, allDeptID) => {
    // selectedAllDepart
    if (isEdit === true) {
      axios
        .delete(
          Config.getCommonUrl() +
            "api/department/deletefrom/" +
            selectedIdForEdit +
            "/" +
            allDeptID
        )
        .then(function (response) {
          console.log(response);
          setOpen(false);
          if (response.data.success === true) {
            // selectedIdForDelete

            var filteredArray = selectedAllDepart.filter(function (val, i, a) {
              return val.value !== allDeptID;
            });

            setSelectedAllDepart(filteredArray);

            let newFormValues = [...fromTransValues];
            newFormValues.splice(i, 1);
            setFromTransValues(newFormValues);
            if (newFormValues.length === 0) {
              setFromTransValues([""]);
            }

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
          setOpen(false);
          handleError(error, dispatch, {
            api:
              "api/department/deletefrom/" +
              selectedIdForEdit +
              "/" +
              allDeptID,
          });
        });
    } else {
      var filteredArray = selectedAllDepart.filter(function (val, i, a) {
        return val.value !== allDeptID;
      });

      setSelectedAllDepart(filteredArray);

      let newFormValues = [...fromTransValues];
      newFormValues.splice(i, 1);
      setFromTransValues(newFormValues);
      if (newFormValues.length === 0) {
        setFromTransValues([""]);
      }
    }
  };

  let handleChange = (i, value) => {
    let newFormValues = [...fromTransValues];
    newFormValues[i] = value;
    setFromTransValues(newFormValues);

    let newDropDownData = [...selectedAllDepart];
    newDropDownData[i] = value;
    setSelectedAllDepart(newDropDownData);
    // setAllDepartErrTxt("");
  };

  const filterByReference = (arr1, arr2) => {
  

    if (arr2.length !== 0) {
      const arr3 = arr2.map((x) => {
        return x.value;
      });
      var updated = arr1.filter((element) => {
        return !arr3.includes(element.id);
      });
     
      return updated.map((suggestion) => ({
        value: suggestion.id,
        label: suggestion.name,
      }));
    }

    return arr1.map((suggestion) => ({
      value: suggestion.id,
      label: suggestion.name,
    }));

    // return updated
    // .map((suggestion) => ({
    //       value: suggestion.id,
    //       label: suggestion.name,
    //     }));
    // return arr1
    // .map((suggestion) => ({
    //       value: suggestion.id,
    //       label: suggestion.name,
    //     }));
  };

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
              <Grid item xs={4} sm={4} md={4} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Department
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                key="2"
                style={{ textAlign: "right" }}
              >
                {/* <Link
                  to="/dashboard/masters/addemployee"
                  style={{ textDecoration: "none", color: "inherit" }}
                > */}
                <Button
                  className={classes.button}
                  size="small"
                  onClick={(event) => {
                    handleModalOpen();
                  }}
                >
                  Add New
                </Button>
                {/* </Link> */}
              </Grid>
            </Grid>
            <div className="main-div-alll ">
              {loading && <Loader />}

              <div>
                <div
                  style={{ borderRadius: "7px !important" }}
                  component="form"
                  className={classes.search}
                >
                  <InputBase
                    className={classes.input}
                    placeholder="Search"
                    inputProps={{ "aria-label": "search" }}
                    value={searchData}
                    onChange={(event) => setSearchData(event.target.value)}
                  />
                  <IconButton
                    type="submit"
                    className={classes.iconButton}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </div>
              </div>
              {/* <div className="pb-32 pt-32 pl-16"></div> */}
              <div className="mt-56">
                <Paper
                  className={clsx(classes.tabroot, "department-tbl-mt-dv  ")}
                  id="systemuser_tabel_dv"
                >
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          ID
                        </TableCell>

                        <TableCell className={classes.tableRowPad} align="left">
                          Department Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Alias Code
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Sub Department Name
                        </TableCell>

                        <TableCell className={classes.tableRowPad} align="left">
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiSearchData
                        .filter(
                          (temp) =>
                            temp.departmentName
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.aliasCode
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.subDepartmentNm
                              .toLowerCase()
                              .includes(searchData.toLowerCase())
                        )
                        .map((row) => (
                          <TableRow key={row.id}>
                            {/* component="th" scope="row" */}
                            <TableCell className={classes.tableRowPad}>
                              {row.id}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.departmentName}

                              {/*if parent id is null then row.name is main department else if there is parent id than row.mainDepartmentname.name is maindepartment
                        and row.name is sub department*/}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.aliasCode}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.subDepartmentNm}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  editHandler(row.id);
                                }}
                              >
                                <Icon className="mr-8 edit-icone">
                                  <img src={Icones.edit} alt="" />
                                </Icon>
                              </IconButton>

                              <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  viewHandler(row.id);
                                }}
                              >
                                <Icon className="mr-8 view-icone">
                                  <img src={Icones.view} alt="" />
                                </Icon>
                              </IconButton>
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
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Paper>
              </div>
            </div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" className="popup-delete">
                {"Alert!!!"}
                <IconButton
                  style={{
                    position: "absolute",
                    marginTop: "-5px",
                    right: "15px",
                  }}
                  onClick={handleClose}
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
                <Button
                  onClick={handleClose}
                  className="delete-dialog-box-cancle-button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteDepartmentApi}
                  className="delete-dialog-box-delete-button"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            <Modal
              // disableBackdropClick
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={modalOpen}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleModalClose();
                }
              }}
              style={{ overflow: "scroll" }}
            >
              <div
                style={modalStyle}
                className={clsx(classes.paper, "rounded-8")}
              >
                <h5 className="popup-head p-20">
                  {isViewOnly
                    ? "View Departmemt"
                    : isEdit === false
                    ? "Add Department"
                    : "Edit Department"}
                  <IconButton
                    style={{ position: "absolute", top: 5, right: 8 }}
                    onClick={handleModalClose}
                  >
                    <Icon>
                      <img src={Icones.cross} alt="" />
                    </Icon>
                  </IconButton>
                </h5>
                <div className="pl-32 pr-32 pb-10 pt-10">
                  <p className="popup-labl mt-16 ">Department name</p>
                  <TextField
                    placeholder="Enter Department"
                    className="mt-4 mb-8"
                    name="departmentNm"
                    value={departmentNm}
                    error={departmentNmErr.length > 0 ? true : false}
                    helperText={departmentNmErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    disabled={isViewOnly}
                  />

                  <p className="popup-labl mt-16 ">Alias Code</p>
                  <TextField
                    placeholder="Enter alias code"
                    name="aliasCode"
                    className="mt-4 mb-8"
                    value={aliasCode}
                    error={aliasCodeErr.length > 0 ? true : false}
                    helperText={aliasCodeErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    disabled={isViewOnly}
                  />

                  <FormControl className="items-center checkbox-department mt-3 mb-4">
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="underDepart"
                          checked={underDeptChecked}
                          onChange={(e) => handleInputChange(e)}
                          disabled={isViewOnly}
                        />
                      }
                      label="Under any department"
                    />
                  </FormControl>

                  {underDeptChecked === true && (
                    <div className="dynamic-dropdown-blg mb-4">
                      <p className="popup-labl mt-16 mb-1">Sub Department name</p>
                      <Select
                        classes={classes}
                        filterOption={createFilter({ ignoreAccents: false })}
                        styles={selectStyles}
                        options={mainDepartmentData.map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.name,
                        }))}
                        // components={components}
                        value={selectedMainDepart}
                        onChange={handleMainDepartChange}
                        placeholder="Enter department"
                        isDisabled={isViewOnly}
                      />

                      <span style={{ color: "red" }}>
                        {mainDepartErrTxt.length > 0 ? mainDepartErrTxt : ""}
                      </span>
                    </div>
                  )}

                  <FormControl className="items-center checkbox-department pt-6">
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="autoTrans"
                          checked={autoTransferChecked}
                          onChange={(e) => handleInputChange(e)}
                          disabled={isViewOnly}
                        />
                      }
                      label="Allow auto transfer from department"
                    />
                  </FormControl>

                  {autoTransferChecked === true &&
                    fromTransValues.map((element, index) => (
                      <>
                        <p className="popup-labl mt-16">Transfer Department name</p>
                        <div
                          className={clsx(
                            classes.dynamicInput,
                            "mt-3 dynamic-dropdown-dv pb-4"
                          )}
                          key={index}
                        >
                          <Select
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            className={classes.fromTrans}
                            classes={classes}
                            styles={selectStyles}
                            options={filterByReference(
                              allDepartmentData,
                              selectedAllDepart
                            )}
                            value={selectedAllDepart[index]}
                            onChange={(e) => handleChange(index, e)}
                            placeholder="Enter department"
                            isDisabled={isViewOnly}
                          />

                          <span style={{ color: "red" }}>
                            {allDepartErrTxt.length > 0 ? allDepartErrTxt : ""}
                          </span>

                          {!isViewOnly &&
                            index === fromTransValues.length - 1 && (
                              <IconButton
                                className="icons-plus"
                                style={{ padding: "0" }}
                                onClick={addFormFields}
                                disabled={isViewOnly}
                              >
                                <Icon style={{ color: "blue" }}>
                                  add_circle
                                </Icon>
                              </IconButton>
                            )}
                        </div>
                      </>
                    ))}
                  <div
                    className="mt-3"
                    style={{
                      border: "1px solid #eeeeee",
                      borderRadius: "7px 7px 0px 0px",
                    }}
                  >
                    <div
                      style={{
                        background: "#eeeeee",
                        borderRadius: "7px 7px 0px 0px",
                      }}
                    >
                      <Typography
                        className="transfer-department-label"
                        style={{ fontWeight: "700" }}
                      >
                        Transfer Department Name
                      </Typography>
                    </div>
                    {autoTransferChecked === true &&
                      fromTransValues.map((val, idx) => {
                        return (
                          fromTransValues[idx] !== "" && (
                            <div className="department-tbl-source" key={idx}>
                              <div
                                className={clsx(
                                  classes.dynamicInput,
                                  classes.mainDepttable
                                )}
                              >
                                <label> {val.label}</label>

                                {/* {idx !== 0 && ( */}
                                {!isViewOnly && (
                                  <IconButton
                                    style={{ padding: "0" }}
                                    onClick={() =>
                                      removeFormFields(idx, val.value)
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

                                {/* )} */}
                              </div>
                            </div>
                          )
                        );
                      })}
                  </div>

                  {!isViewOnly && (
                    <div className="popup-button-div">
                      <Button
                        variant="contained"
                        className="cancle-button-css"
                        onClick={handleModalClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        className="save-button-css"
                        onClick={(e) => checkforUpdate(e)}
                      >
                        Save
                      </Button>
                    </div>
                    // <Button
                    //   variant="contained"
                    //   color="primary"
                    //   className="w-full mx-auto department-btn-dv"
                    //   style={{
                    //     backgroundColor: "#4caf50",
                    //     border: "none",
                    //     color: "white",
                    //   }}
                    //   onClick={(e) => checkforUpdate(e)}
                    // >
                    //   Save
                    // </Button>
                  )}
                  {isViewOnly && (
                    <Button
                      variant="contained"
                      color="primary"
                      className="w-128 mx-auto ml-96 mt-24"
                      id="btn-save"
                      onClick={(e) => handleModalClose(false)}
                    >
                      close
                    </Button>
                  )}
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default Department;

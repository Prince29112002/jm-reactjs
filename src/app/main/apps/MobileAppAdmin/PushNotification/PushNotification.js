import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Select, { createFilter } from "react-select";
import { Button, TextField } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import AndroidOutlinedIcon from "@material-ui/icons/AndroidOutlined";
import AppleIcon from "@material-ui/icons/Apple";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Loader from "../../../Loader/Loader";
// import JEWELLOGO from "../../../../../assets/images/logo/logo 2.png";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { appsConfigs } from "../../appsConfigs";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    // height: "100%",
    height: "100%",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  previewCls: {
    border: "1px solid #1C4E80",
    padding: "5px",
    borderRadius: "10px",
  },
  prevText: {
    padding: "10px",
    textAlign: "center",
    margin: "-10px -10px 0 -10px",
    borderRadius: "7px 7px 0 0",
    backgroundColor: "#415BD4",
    color: "#ffffff",
  },
}));

const PushNotification = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [imageUploadFile, setImageUploadFile] = useState(null);

  const [whom, setWhom] = useState("");
  const [catalogue, setCatalouge] = useState("2");
  const [ordertype, setOrdertype] = useState("-1");
  const [selectedCatalouge, setSelectedCatalouge] = useState("");
  const [catalougeData, setCatalougeData] = useState([]);

  const [whomErr, setWhomErr] = useState("");
  const [catalougeErr, setCatalougeErr] = useState("");
  const [userList, setUserList] = useState([]);

  const [MasterChecked, setMasterChecked] = useState(false);

  const [title, setTitle] = useState("");
  const [titleErr, setTitleErr] = useState("");

  const [message, setMessage] = useState("");
  const [msgErr, setMsgErr] = useState("");

  const [is_send_now, setIs_send_now] = useState(0);
  const [dateTime, setDateTime] = useState("");
  const [dateTimeErr, setDateTimeErr] = useState("");
  const theme = useTheme();

  const [searchData, setSearchData] = useState({
    name: "",
    gender: "",
    mobileno: "",
    designation: "",
    usertype: "",
    company: "",
    emailid: "",
  });
  const handlegenderChange = (value) => {
    setSearchData((prevState) => ({
      ...prevState,
      ["gender"]: value ? value : "",
    }));
  };
  const genderArr = [
    { value: 0, label: "Male" },
    { value: 1, label: "Female" },
  ];
  const handleUserChange = (value) => {
    setSearchData((prevState) => ({
      ...prevState,
      ["usertype"]: value ? value : "",
    }));
  };
  const userArr = [
    { value: 1, label: "Distributor" },
    { value: 2, label: "Overseas Distributors" },
    { value: 3, label: "Direct Retailers" },
    { value: 4, label: "Corporate Retailers" },
    { value: 6, label: "Retailer" },
    { value: 5, label: "Salesman" },
  ];
  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    getcatalougeData();
    //eslint-disable-next-line
  }, []);
  function getcatalougeData() {
    axios
      .get(Config.getCommonUrl() + "api/catalogue/dropDown/catalogues")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setCatalougeData(response.data.data);
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
          api: "api/catalogue/dropDown/catalogues",
        });
      });
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "whom") {
      setWhom(value);
      setWhomErr("");
      if (value === "3" && userList.length === 0) {
        getUserMaster();
      }
    } else if (name === "catalouge") {
      setCatalouge(value);
      if (value == 2) {
        setOrdertype("-1");
      } else {
        setOrdertype("4");
      }
    } else if (name === "title") {
      setTitle(value);
      setTitleErr("");
    } else if (name === "message") {
      setMessage(value);
      setMsgErr("");
    } else if (name === "dateTime") {
      setIs_send_now(0);
      setDateTime(value);
      setDateTimeErr("");
    }
  }

  function titleValidation() {
    var Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (!title || Regex.test(title) === false) {
      setTitleErr("Please Enter Valid Title");
      return false;
    }
    return true;
  }

  function whomValidation() {
    if (catalogue == 2) {
      if (whom === "") {
        setWhomErr("Please Select Users");
        return false;
      }
      return true;
    } else {
      if (selectedCatalouge == "") {
        setCatalougeErr("Please Select catalouge");
        return false;
      }
      return true;
    }
  }
  function handleCatalougeChange(value) {
    setSelectedCatalouge(value);
  }

  function dateValidation() {
    if (dateTime === "") {
      setDateTimeErr("Please Select Date and Time");
      return false;
    }

    return true;
  }

  function getUserMaster() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/usermaster/common/listAll")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          let tempApi = tempData.map((x) => {
            let compNm = "";
            if (x.user_type === 6) {
              compNm =
                x.hasOwnProperty("RetailerName") && x.RetailerName !== null
                  ? x.RetailerName.company_name
                  : "";
            } else if (
              x.user_type === 1 ||
              x.user_type === 2 ||
              x.user_type === 3 ||
              x.user_type === 6
            ) {
              compNm =
                x.hasOwnProperty("ClientName") && x.ClientName !== null
                  ? x.ClientName.hasOwnProperty("company_name")
                    ? x.ClientName.company_name
                    : ""
                  : "";
            } else if (x.user_type === 5) {
              compNm = x.company_name;
            }
            return {
              ...x,
              selected: false,
              compName: compNm,
            };
          });
          setLoading(false);
          setUserList(tempApi);

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
        setLoading(false);
        handleError(error, dispatch, { api: "api/usermaster/common/listAll" });
      });
  }

  function onMasterCheck(e) {
    let tempList = userList;
    // Check/ UnCheck All Items
    tempList.map((user) => (user.selected = e.target.checked));

    //Update State
    setMasterChecked(e.target.checked);
    setUserList(tempList);
  }

  function onItemCheck(e, item) {
    let tempList = userList; //this.state.List;
    let temp = tempList.map((row) => {
      if (row.id === item.id) {
        row.selected = e.target.checked;
      }
      return row;
    });

    const totalItems = userList.length;
    const totalCheckedItems = temp.filter((e) => e.selected).length;
    setUserList(temp);
    setMasterChecked(totalItems === totalCheckedItems);
  }

  function setCurrentDateTime() {
    setIs_send_now(1);
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var value = now.toISOString().slice(0, 16);
    setDateTime(value);
    setDateTimeErr("");
  }

  const minDtTime = () => {
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    var value = now.toISOString().slice(0, 16);
    return value;
  };

  function imageValidation() {
    if (imageUploadFile === "" || imageUploadFile === null) {
      dispatch(
        Actions.showMessage({
          message: "Please Select Image",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (
      titleValidation() &&
      imageValidation() &&
      dateValidation() &&
      whomValidation()
    ) {
      if (whom === "3") {
        if (userList.filter((item) => item.selected).length === 0) {
          dispatch(
            Actions.showMessage({
              message: "Please Select User from List",
              variant: "error",
            })
          );
        } else {
          addPushNotification();
        }
      } else {
        addPushNotification();
      }
    }
  }

  function addPushNotification() {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", message);
    formData.append("is_send_now", Number(is_send_now));
    formData.append("time", new Date(dateTime).toISOString());
    formData.append("image", imageUploadFile);
    formData.append("order_type", ordertype);
    formData.append("user_selection_type", Number(whom));
    formData.append("catalogue_id", selectedCatalouge.value);
    formData.append(
      "users",
      JSON.stringify(
        userList.filter((item) => item.selected).map((data) => data.id)
      )
    );

    axios
      .post(Config.getCommonUrl() + "api/pushNotification", formData)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          setLoading(false);

          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          document.getElementById("fileinput").value = "";
          setTitle("");
          setMessage("");
          setImageUploadFile("");
          setIs_send_now(0);
          setDateTime("");
          setWhom("");
          setCatalouge("2");
          setSelectedCatalouge("");
          setUserList([]);
          setMasterChecked(false);
        } else {
          document.getElementById("fileinput").value = "";
          setTitle("");
          setMessage("");
          setImageUploadFile("");
          setIs_send_now(0);
          setDateTime("");
          setWhom("");
          setCatalouge("2");
          setSelectedCatalouge("");
          setUserList([]);
          setMasterChecked(false);
          setLoading(false);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch((error) => {
        document.getElementById("fileinput").value = "";
        setLoading(false);

        handleError(error, dispatch, {
          api: "api/pushNotification",
          body: JSON.stringify(formData),
        });
      });
  }
  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-8 text-18 font-700">
                    Push Notification
                  </Typography>
                </FuseAnimate>
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll ">
              <div>
                <Grid
                  className="department-main-dv"
                  container
                  spacing={4}
                  alignItems="stretch"
                  style={{ margin: 0 }}
                >
                  <Grid
                    item
                    xs={8}
                    sm={8}
                    md={8}
                    key="1"
                    style={{ padding: 0 }}
                  >
                    <Typography className=" pb-8 text-18 font-700">
                      What and When?
                    </Typography>

                    <Grid
                      className="department-main-dv "
                      container
                      spacing={4}
                      alignItems="stretch"
                      style={{ margin: 0 }}
                    >
                      {/* <Grid container={true} item xs={4} sm={4} md={4} key="1" style={{ padding: 0 }}> */}

                      <Grid
                        item
                        xs={8}
                        sm={8}
                        md={8}
                        key="1"
                        style={{ padding: 5 }}
                      >
                        <TextField
                          className=""
                          label="Title"
                          name="title"
                          value={title}
                          error={titleErr.length > 0 ? true : false}
                          helperText={titleErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sm={4}
                        md={4}
                        key="2"
                        style={{ padding: 5 }}
                      >
                        <Button
                          id="upload-btn-jewellery"
                          variant="contained"
                          onClick={handleClick}
                        >
                          Browse Image
                        </Button>

                        <input
                          type="file"
                          id="fileinput"
                          ref={hiddenFileInput}
                          onChange={(event) => {
                            setImageUploadFile(event.target.files[0]);
                          }}
                          accept="image/*"
                          style={{ display: "none" }}
                        />
                        <div style={{ height: "20px", textAlign: "center" }}>
                          {imageUploadFile !== null ? imageUploadFile.name : ""}
                        </div>
                      </Grid>
                      <Grid
                        item
                        xs={8}
                        sm={8}
                        md={8}
                        key="3"
                        style={{ padding: 5 }}
                      >
                        <TextField
                          className="mt-16 mr-2"
                          // style={{ width: "50%" }}
                          label="Message"
                          name="message"
                          value={message}
                          error={msgErr.length > 0 ? true : false}
                          helperText={msgErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          multiline
                          minRows={5}
                          maxrows={5}
                          // disabled={isView}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        sm={4}
                        md={4}
                        key="4"
                        style={{ padding: 5 }}
                      >
                        <div className="mt-16">Scan when ?</div>
                        <Button
                          variant="contained"
                          id="btn-save"
                          className="w-full"
                          onClick={() => setCurrentDateTime()}
                        >
                          Now
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={8}
                        sm={8}
                        md={8}
                        key="5"
                        style={{ padding: 5 }}
                      ></Grid>
                      <Grid
                        item
                        xs={4}
                        sm={4}
                        md={4}
                        key="6"
                        style={{ padding: 5, marginTop: "-60px" }}
                      >
                        <div className="">Calendar</div>

                        <TextField
                          id="datetime-local"
                          className=""
                          label=""
                          name="dateTime"
                          // disabled={isViewOnly}
                          value={dateTime}
                          type="datetime-local"
                          variant="outlined"
                          error={dateTimeErr.length > 0 ? true : false}
                          helperText={dateTimeErr}
                          onChange={(e) => handleInputChange(e)}
                          fullWidth
                          inputProps={{
                            min: minDtTime(), //moment().format("YYYY-MM-DD"),
                          }}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Typography className="p-8 pt-0 text-18 font-700">
                      My Catalogue
                    </Typography>
                    <FormControl id="redio-input-dv" component="fieldset">
                      {/* <FormLabel component="legend">Categories :</FormLabel> */}
                      <RadioGroup
                        aria-label="Gender"
                        id="radio-row-dv"
                        name="catalouge"
                        className={classes.group}
                        style={{ flexDirection: "initial" }}
                        value={catalogue}
                        onChange={handleInputChange}
                      >
                        <Grid
                          item
                          lg={4}
                          md={4}
                          sm={4}
                          xs={4}
                          style={{ padding: 6 }}
                        >
                          <FormControlLabel
                            value="1"
                            control={<Radio />}
                            label="Yes"
                          />
                        </Grid>

                        <Grid
                          item
                          lg={4}
                          md={4}
                          sm={4}
                          xs={4}
                          style={{ padding: 6 }}
                        >
                          <FormControlLabel
                            value="2"
                            control={<Radio />}
                            label="No"
                          />
                        </Grid>

                        <Grid
                          item
                          lg={4}
                          md={4}
                          sm={4}
                          xs={4}
                          style={{ padding: 6 }}
                        ></Grid>
                      </RadioGroup>
                    </FormControl>
                    {catalogue == 2 ? (
                      <div>
                        <Typography className="p-8 pt-8 text-16 font-700">
                          Whom?
                        </Typography>

                        <FormControl id="redio-input-dv" component="fieldset">
                          {/* <FormLabel component="legend">Categories :</FormLabel> */}
                          <RadioGroup
                            aria-label="Gender"
                            id="radio-row-dv"
                            name="whom"
                            className={classes.group}
                            style={{ flexDirection: "initial" }}
                            value={whom}
                            onChange={handleInputChange}
                          >
                            <Grid
                              item
                              lg={4}
                              md={4}
                              sm={4}
                              xs={4}
                              style={{ padding: 6 }}
                            >
                              <FormControlLabel
                                value="1"
                                control={<Radio />}
                                label="All Users"
                              />
                            </Grid>

                            <Grid
                              item
                              lg={4}
                              md={4}
                              sm={4}
                              xs={4}
                              style={{ padding: 6 }}
                            >
                              <FormControlLabel
                                value="2"
                                control={<Radio />}
                                label="Unregistered Users"
                              />
                            </Grid>

                            <Grid
                              item
                              lg={4}
                              md={4}
                              sm={4}
                              xs={4}
                              style={{ padding: 6 }}
                            >
                              <FormControlLabel
                                value="3"
                                control={<Radio />}
                                label="Selective"
                              />
                            </Grid>
                          </RadioGroup>
                          <span style={{ color: "red" }}>
                            {whomErr.length > 0 ? whomErr : ""}
                          </span>
                        </FormControl>
                      </div>
                    ) : (
                      <Grid
                        item
                        xs={4}
                        sm={6}
                        md={6}
                        key="1"
                        style={{ padding: 12 }}
                      >
                        <p className="pb-1">Select Catalouge</p>
                        <Select
                          filterOption={createFilter({ ignoreAccents: false })}
                          classes={classes}
                          styles={selectStyles}
                          options={catalougeData.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.name,
                          }))}
                          // components={components}
                          value={selectedCatalouge}
                          onChange={handleCatalougeChange}
                          placeholder="Select Catalouge"
                        />
                        <span style={{ color: "red" }}>
                          {catalougeErr.length > 0 ? catalougeErr : ""}
                        </span>
                      </Grid>
                    )}
                  </Grid>

                  <Grid
                    item
                    xs={4}
                    sm={4}
                    md={4}
                    key="2"
                    style={{ padding: 10, height: "100%", marginTop: "35px" }}
                    className={clsx(classes.previewCls, "")}
                  >
                    <div className={clsx(classes.prevText, "font-700")}>
                      {" "}
                      Preview{" "}
                    </div>

                    <div className="mt-10" style={{ display: "flex" }}>
                      <AppleIcon style={{ fontSize: 16 }} />
                      <label className="ml-1 "> For IPhone</label>
                    </div>

                    <div
                      className={clsx(classes.previewCls, "mt-16 previewbg")}
                    >
                      <div className=" flex flex-row previewbg">
                        <img
                          src={Config.getjvmLogo()}
                          style={{ maxWidth: "55%" }}
                          alt="logo"
                        />
                        <div className="ml-20">
                          <div className="mt-8q font-700">Title:{title}</div>
                          <div className="mt-1">Message: {message}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-20" style={{ display: "flex" }}>
                      <AndroidOutlinedIcon style={{ fontSize: 16 }} />
                      <label className="ml-1"> For Android</label>
                    </div>
                    <div
                      className={clsx(classes.previewCls, "mt-16 previewbg")}
                    >
                      <div className=" flex flex-row previewbg">
                        <img
                          src={Config.getjvmLogo()}
                          style={{ maxWidth: "55%" }}
                          alt="logo"
                        />
                        <div className="ml-20">
                          <div className="mt-8 font-700">Title:{title}</div>
                          <div className="mt-1">Message:{message}</div>
                        </div>
                      </div>
                    </div>

                    {/* btn div */}
                  </Grid>
                </Grid>
                <div>
                  {/* <Button
                  variant="contained"
                  // color="primary"
                  style={{ float: "right", backgroundColor: "limegreen" }}
                  className="mx-auto mt-16 mr-16"
                  aria-label="Register"
                  //   disabled={!isFormValid()}
                  // type="submit"
                  // onClick={checkforPrint}
                  onClick={(event) => {
                    History.goBack();
                  }}
                >
                  Cancel
                </Button> */}

                  <Button
                    id="btn-save"
                    style={{ float: "right" }}
                    className=" mr-16 mt-auto"
                    aria-label="Register"
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
              <Grid
                className="department-main-dv"
                container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0 }}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  key="1"
                  style={{ padding: 0 }}
                >
                  {whom === "3" && (
                    <div className="m-8 mt-20 department-tbl-mt-dv">
                      <Paper
                        className={classes.tabroot}
                        id="department-tbl-fix"
                      >
                        <div className="table-responsive new-add_stock_group_tbel">
                          <Table className={classes.table}>
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  className={classes.tableRowPad}
                                  style={{ width: "10%", textAlign: "center" }}
                                >
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={MasterChecked}
                                    id="mastercheck"
                                    onChange={(e) => onMasterCheck(e)}
                                  />
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  align="left"
                                >
                                  Name
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  align="left"
                                >
                                  Gender
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  align="left"
                                >
                                  Mobile No
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  align="left"
                                >
                                  Designation
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  align="left"
                                >
                                  User Type
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  align="left"
                                >
                                  Company
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  align="left"
                                >
                                  Email ID
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  className={classes.tableRowPad}
                                ></TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  <TextField
                                    name="name"
                                    onChange={handleSearchData}
                                  />
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  <Select
                                    styles={{ selectStyles }}
                                    options={genderArr.map((group) => ({
                                      value: group.value,
                                      label: group.label,
                                    }))}
                                    isClearable
                                    value={searchData.showInApp}
                                    filterOption={createFilter({
                                      ignoreAccents: false,
                                    })}
                                    onChange={handlegenderChange}
                                  />
                                  {/* <TextField name="gender" onChange={handleSearchData} /> */}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  <TextField
                                    name="mobileno"
                                    onChange={handleSearchData}
                                  />
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  <TextField
                                    name="designation"
                                    onChange={handleSearchData}
                                  />
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  <Select
                                    styles={{ selectStyles }}
                                    options={userArr.map((group) => ({
                                      value: group.value,
                                      label: group.label,
                                    }))}
                                    isClearable
                                    value={searchData.showInApp}
                                    filterOption={createFilter({
                                      ignoreAccents: false,
                                    })}
                                    onChange={handleUserChange}
                                  />
                                  {/* <TextField name="usertype" onChange={handleSearchData} /> */}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  <TextField
                                    name="company"
                                    onChange={handleSearchData}
                                  />
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  <TextField
                                    name="emailid"
                                    onChange={handleSearchData}
                                  />
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {userList
                                .filter((temp) => {
                                  if (searchData.name) {
                                    return temp.full_name
                                      .toLowerCase()
                                      .includes(searchData.name.toLowerCase());
                                  } else if (searchData.gender) {
                                    console.log(searchData.gender);
                                    console.log(temp.gender);
                                    return temp.gender
                                      .toString()
                                      .toLowerCase()
                                      .includes(
                                        searchData.gender.value
                                          .toString()
                                          .toLowerCase()
                                      );
                                  } else if (searchData.mobileno) {
                                    return temp.mobile_number
                                      .toLowerCase()
                                      .includes(
                                        searchData.mobileno.toLowerCase()
                                      );
                                  } else if (searchData.designation) {
                                    return temp.designation
                                      .toLowerCase()
                                      .includes(
                                        searchData.designation.toLowerCase()
                                      );
                                  } else if (searchData.usertype) {
                                    console.log(searchData.usertype);
                                    console.log(temp.user_type);
                                    return temp.user_type !== undefined &&
                                      temp.user_type !== null
                                      ? temp.user_type
                                          .toString()
                                          .toLowerCase()
                                          .includes(
                                            searchData.usertype.value
                                              .toString()
                                              .toLowerCase()
                                          )
                                      : null;
                                  } else if (searchData.company) {
                                    return temp.compName
                                      .toLowerCase()
                                      .includes(
                                        searchData.company.toLowerCase()
                                      );
                                  } else if (searchData.emailid) {
                                    return temp.email
                                      .toLowerCase()
                                      .includes(
                                        searchData.emailid.toLowerCase()
                                      );
                                  } else {
                                    return temp;
                                  }
                                })
                                .map((row) => (
                                  <TableRow key={row.id}>
                                    {/* component="th" scope="row" */}
                                    <TableCell
                                      className={classes.tableRowPad}
                                      style={{ textAlign: "center" }}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={row.selected}
                                        className="form-check-input"
                                        id="rowcheck{user.id}"
                                        onChange={(e) => onItemCheck(e, row)}
                                      />
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      className={classes.tableRowPad}
                                    >
                                      {row.full_name}
                                    </TableCell>

                                    <TableCell
                                      align="left"
                                      className={classes.tableRowPad}
                                    >
                                      {row.gender === 0 ? "Male" : "Female"}
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      className={classes.tableRowPad}
                                    >
                                      {/* mobile_number */}
                                      {/* {row.mobile_number} */}
                                      {/* {row.first_country?.phonecode} */}
                                      {row.first_country?.phonecode ===
                                      undefined
                                        ? +row.mobile_number
                                        : "+" +
                                          row.first_country?.phonecode +
                                          " " +
                                          row.mobile_number}
                                    </TableCell>

                                    <TableCell
                                      align="left"
                                      className={classes.tableRowPad}
                                      style={{ overflowWrap: "anywhere" }}
                                    >
                                      {/* designation */}
                                      {row.designation}
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      className={classes.tableRowPad}
                                    >
                                      {/* userType */}
                                      {row.hasOwnProperty("type_name")
                                        ? row.type_name
                                        : "-"}
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      className={classes.tableRowPad}
                                    >
                                      {/* Company */}
                                      {row.compName ? row.compName : "-"}
                                    </TableCell>
                                    <TableCell
                                      align="left"
                                      className={classes.tableRowPad}
                                      style={{ overflowWrap: "anywhere" }}
                                    >
                                      {/* email */}
                                      {row.email ? row.email : "-"}
                                    </TableCell>
                                  </TableRow>
                                ))}
                            </TableBody>
                          </Table>
                        </div>
                      </Paper>
                    </div>
                  )}
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default PushNotification;

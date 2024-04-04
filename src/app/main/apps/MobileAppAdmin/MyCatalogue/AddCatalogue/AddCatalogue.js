import React, { useState, useEffect } from "react";
import { TablePagination, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Icon, IconButton } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import History from "@history";
import Loader from "app/main/Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import moment from "moment";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddMycatalogDesingCom from "../../AddDesignsComponent/AddMycatalogDesingCom";
import Icones from "assets/fornt-icons/Mainicons";
import { Link } from "react-router-dom";
import Select, { createFilter } from "react-select";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100px",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  selectBox: {
    // marginTop: 8,
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    // marginLeft: 15,
  },
}));


const AddCatalogue = (props) => {
  const propsData = props?.location?.state;
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
  const theme = useTheme();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [catalogueName, setCatalogueName] = useState("");
  const [catNamErr, setCatNameErr] = useState("");
  const [hidden, sethidden] = useState(false);

  const [expDate, setExpDate] = useState("");
  const [expDtErr, setExpDtErr] = useState("");

  const [showAppFlag, setShowAppFlag] = useState("");
  const [showAppErr, setShowAppErr] = useState("");

  const [whom, setWhom] = useState("");
  const [whomErr, setWhomErr] = useState("");

  const [userList, setUserList] = useState([]);
  const [userLoginDetail, setUserLoginDetail] = useState([]);

  const [MasterChecked, setMasterChecked] = useState(false);

  const [designFlag, setDesignFlag] = useState(false);

  const [designData, setDesignData] = useState([]);
  const [uniqueDesign, setUniqueDesign] = useState([]);

  const [isView, setIsView] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [catId, setCatId] = useState("");
  const [pages, setPages] = useState("");
  const [searchs, setsearchs] = useState("");
  const [apiDatas, setapiDatas] = useState("");
  const [counts, setcounts] = useState("");

  const [searchData, setSearchData] = useState({
    category: "",
    variant_number: "",
    showInApp: "",
    name: "",
    gender: "",
    mobileno: "",
    designation: "",
    usertype: "",
    company: "",
    emailid: "",
  });
  const [logInSearchData, setLogInSearchData] = useState({
    userName: "",
    gender: "",
    mobileno: "",
    companyName: "",
    city: "",
    usertype: "",
    dateTime: "",
  });
  const genderArrdata = [
    { value: 0, label: "Male" },
    { value: 1, label: "Female" },
  ];
  const userArr = [
    { value: 1, label: "Distributor" },
    { value: 2, label: "Overseas Distributors" },
    { value: 3, label: "Direct Retailers" },
    { value: 4, label: "Corporate Retailers" },
    { value: 6, label: "Retailer" },
    { value: 5, label: "Salesman" },
  ];
  const handlegenderChanges = (value) => {
    setSearchData((prevState) => ({
      ...prevState,
      ["gender"]: value ? value : "",
    }));
  };
  const handleUserChange = (value) => {
    setSearchData((prevState) => ({
      ...prevState,
      ["usertype"]: value ? value : "",
    }));
  };
  const handleLoginGenderChanges = (value) => {
    setLogInSearchData((prevState) => ({
      ...prevState,
      ["gender"]: value ? value : "",
    }));
  };
  const handleLoginUserChange = (value) => {
    setLogInSearchData((prevState) => ({
      ...prevState,
      ["usertype"]: value ? value : "",
    }));
  };
  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    console.log("useEffect");
    // getClients();
    // getting list of ALL clients
    //eslint-disable-next-line
  }, [dispatch]);
  useEffect(() => {
    if (isEdit || isView) {
      setDesignData([]);
      setCount(0);
      setPage(0);
      setFilters();
    }
  }, [searchData]);
  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log("propsData", propsData);
    if (propsData !== undefined) {
      setIsView(propsData.isViewOnly);
      setsearchs(propsData.search);
      setPages(propsData.page);
      setapiDatas(propsData.apiData);
      setcounts(propsData.count);
      setIsEdit(propsData.isEdit);
      if (propsData.row !== "") {
        setCatId(propsData.row.id);
        setFilters();
        getLoginDetails(propsData.row.id);
      }
    }
    //eslint-disable-next-line
  }, []);

  function GetOneCatalogue(url) {
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        console.log(response.data.data);
        if (response.data.success === true) {
          var data = response.data.data;
          setCount(Number(response.data.count));

          setCatalogueName(data.name);
          setExpDate(data.expiry_date);
          setShowAppFlag(data.is_display === true ? "1" : "0");
          setWhom(data.user_selection_type.toString());
          if (data.user_selection_type === 3) {
            getUserMaster(data.CatalogueUser);
          }

          let tempDesign = data.CatalogueDesign.map((item) => {
            return {
              mainId: item.id,
              Category: {
                billing_category_name: item.designs.Category.category_name,
              },
              variant_number: item.designs.variant_number,
              id: item.design_id,
              status: item.designs.show_in_app == 1 ? "Yes" : "No",
              image_files: [
                { image_file: item.designs.image_files[0].image_file },
              ],
            };
          });
          if (designData.length === 0) {
            console.log("if");
            setDesignData(tempDesign);
          } else {
            // console.log("else", apiData)
            // setApiData(...apiData, ...rows)
            setDesignData((designData) => [...designData, ...tempDesign]);
            // console.log([...apiData, ...rows])
          }
          console.log(tempDesign);
          // setDesignData(tempDesign);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: url });
      });
  }
  function setFilters(tempPageNo) {
    const ids = propsData?.row.id;
    console.log(propsData?.row.id);
    let url = `api/catalogue/${ids}?`;

    if (page !== "") {
      if (!tempPageNo) {
        url = url + "page=" + 1;
      } else {
        url = url + "page=" + tempPageNo;
      }
    }

    if (searchData.category !== "") {
      url = url + "&category_name=" + searchData.category;
    }
    if (searchData.variant_number !== "") {
      url = url + "&variant_number=" + searchData.variant_number;
    }
    if (searchData.showInApp !== "") {
      url = url + "&show_in_app=" + searchData.showInApp.value;
    }

    console.log(url, "---------", tempPageNo);

    if (!tempPageNo) {
      console.log("innnnnnnnnnnnnnn444444");
      GetOneCatalogue(url);
    } else {
      if (count > designData.length) {
        GetOneCatalogue(url);
      }
    }
  }
  function handleChangePage(event, newPage) {
    // console.log(newPage , page)
    // console.log((newPage +1) * 10 > apiData.length)
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 10 > designData.length) {
      setFilters(Number(newPage + 1));
      // getRetailerMasterData()
    }
    // console.log(apiData.length);
  }
  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "catalogueName") {
      setCatalogueName(value);
      setCatNameErr("");
    } else if (name === "expDate") {
      setExpDate(value);
      setExpDtErr("");
    } else if (name === "showAppFlag") {
      setShowAppFlag(value);
      setShowAppErr("");
    } else if (name === "whom") {
      setWhom(value);
      setWhomErr("");
      if (value === "3" && userList.length === 0) {
        getUserMaster([]);
      }
    }
  }

  function getUserMaster(uList) {
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
              x.type_name = "Salesman";
            }
            return {
              ...x,
              selected:
                uList.length > 0
                  ? uList.some((item) => item.user_id === x.id)
                  : false,
              compName: compNm,
            };
          });
          console.log(tempApi);
          setUserList(tempApi);
          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "api/usermaster/common/listAll" });
      });
  }

  function getLoginDetails(id) {
    axios.get(
      Config.getCommonUrl() + `api/catalogue/catalogue-user/history/${id}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const arrData = response.data.data;
          setUserLoginDetail(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        console.log(error);
        handleError(error, dispatch, {
          api: `api/catalogue/catalogue-user/history/${id}`,
        });
      });
  }

  function onMasterCheck(e) {
    let tempList = userList;
    // Check/ UnCheck All Items
    tempList.map((user) => (user.selected = e.target.checked));

    //Update State
    setMasterChecked(e.target.checked);
    setUserList(tempList);

    console.log(tempList);
  }

  // Update List Item's state and Master Checkbox State
  function onItemCheck(e, item) {
    // console.log("onItemCheck---------", item)
    let tempList = userList; //this.state.List;
    let temp = tempList.map((row) => {
      // console.log(row)
      if (row.id === item.id) {
        console.log("match");
        row.selected = e.target.checked;
      }
      return row;
    });

    //To Control Master Checkbox State
    const totalItems = userList.length;
    const totalCheckedItems = temp.filter((e) => e.selected).length;
    setUserList(temp);
    setMasterChecked(totalItems === totalCheckedItems);
  }

  function handleDesignClose() {
    setDesignFlag(false);
  }

  function handleDesignSubmit(data) {
    sethidden(true);
    console.log("handleDesignSubmit", data);
    const design = [...designData];
    let unique = [...uniqueDesign];
    let status = false;
    data.map((item) => {
      if (!uniqueDesign.includes(item.DesingNo)) {
        design.push(item);
        unique.push(item.DesingNo);
      } else {
        status = true;
      }
    });
    setDesignData(design);
    setUniqueDesign(unique);
    if (status) {
      dispatch(Actions.showMessage({ message: "Duplicate Design Number" }));
    }
    setDesignFlag(false);
  }

  function nameValidation() {
    // var Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (catalogueName === "") {
      setCatNameErr("Enter Catalogue Name");
      return false;
    }
    return true;
  }

  function dateValidation() {
    if (expDate === "") {
      setExpDtErr("Enter Date");
      return false;
    }
    return true;
  }

  function showAppValidation() {
    if (showAppFlag === "") {
      setShowAppErr("Please Select Any Option");
      return false;
    }
    return true;
  }

  function whomValidation() {
    if (whom === "") {
      setWhomErr("Please Select Users");
      return false;
    }
    return true;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (
      nameValidation() &&
      dateValidation() &&
      showAppValidation() &&
      whomValidation()
    ) {
      if (whom === "3") {
        if (userList.filter((item) => item.selected).length === 0) {
          dispatch(
            Actions.showMessage({ message: "Please Select User from List" })
          );
        } else {
          checkDesign();
        }
      } else {
        checkDesign();
      }
    }
  }

  function checkDesign() {
    if (designData.length === 0) {
      dispatch(Actions.showMessage({ message: "Please Add Designs" }));
    } else {
      if (isEdit === true) {
        console.log("updt");
        updateCatalogueApi();
      } else {
        AddCatalogueApi();
      }
    }
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

  const handleSearchLoginData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setLogInSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function updateCatalogueApi() {
    setLoading(true);
    let data = {
      name: catalogueName,
      expiry_date: expDate,
      is_display: Number(showAppFlag),
      user_selection_type: Number(whom),
      catalogue_designs: designData.map((x) => x.id),
      // ...(whom === "3" && {
      catalogue_users: userList
        .filter((item) => item.selected)
        .map((data) => data.id),
      // }),
    };
    axios
      .put(Config.getCommonUrl() + "api/catalogue/" + catId, data)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data
          // setGoldColor("");
          setLoading(false);

          History.goBack(); //.push("/dashboard/masters/vendors");

          dispatch(Actions.showMessage({ message: response.data.message }));
        } else {
          setLoading(false);

          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);

        handleError(error, dispatch, {
          api: "api/catalogue/" + catId,
          body: data,
        });
      });
  }

  function AddCatalogueApi() {
    setLoading(true);
    let data = {
      name: catalogueName,
      expiry_date: expDate,
      is_display: Number(showAppFlag),
      user_selection_type: Number(whom),
      catalogue_designs: designData.map((x) => x.id),
      catalogue_users: userList
        .filter((item) => item.selected)
        .map((data) => data.id),
    };
    axios
      .post(Config.getCommonUrl() + "api/catalogue", data)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data
          // setGoldColor("");
          setLoading(false);

          History.goBack(); //.push("/dashboard/masters/vendors");

          dispatch(Actions.showMessage({ message: response.data.message }));
        } else {
          setLoading(false);

          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        // console.log(error);
        setLoading(false);

        handleError(error, dispatch, { api: "api/catalogue", body: data });
      });
  }

  function deleteHandler() {
    designData.splice(page * rowsPerPage);
    setDesignData(designData);

    axios
      .delete(Config.getCommonUrl() + `api/catalogue/delete/${deleteId}`)
      .then((response) => {
        if (response.data.success) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setDeleteModal(false);
          setDeleteId("");
          setFilters(Number(page + 1));
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/catalogue/delete/${deleteId}`,
        });
      });
  }

  const handleOpenPdf = () => {
    console.log("safd sdafg fdg sd");
    setLoading(true);

    axios
      .get(Config.getCommonUrl() + "api/catalogue/get-pdf/" + catId)
      .then(function (response) {
        console.log(response.data);
        if (response.data.success === true) {
          let data = response.data.data;
          if (data.hasOwnProperty("pdf_url")) {
            let downloadUrl = data.pdf_url;
            // window.open(downloadUrl);
            const link = document.createElement("a");
            link.setAttribute("target", "_blank");
            link.href = downloadUrl;
            link.click();
          }
          setLoading(false);
        } else {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "api/catalogue/get-pdf/" + catId });
      });
  };

  function handleOpenUrl() {
    window.open(Config.getCatalogUrl() + `catalogues/${catId}`);
  }

  const onKeyDown = (e) => {
    e.preventDefault();
  };
  const handlegenderChange = (value) => {
    setSearchData((prevState) => ({
      ...prevState,
      ["showInApp"]: value ? value : "",
    }));
  };
  const genderArr = [
    { value: 0, label: "No" },
    { value: 1, label: "Yes" },
  ];


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
          <div
            className="flex flex-1 flex-col min-w-0"
            style={{ paddingTop: "30px" }}
          >
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pb-16 pl-32 text-18 font-700">
                    My Catalogue
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              >

                <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={() => {
                    isView || isEdit
                      ? History.push("/dashboard/mobappadmin/mycatalogue", {
                          page: pages,
                          search: searchs,
                          apiData: apiDatas,
                          count: counts,
                        })
                      : History.goBack();
                  }}
                >
                    <img
                  className="back_arrow"
                  src={Icones.arrow_left_pagination}
                  alt=""/>
                  
                  Back
                </Button>

              </Grid>
            </Grid>

            {loading && <Loader />}

            {/* <Typography className=" pb-16 pl-32 text-18 font-700">
              What and When?
            </Typography> */}

            <div className="main-div-alll">
              <Grid
                className="department-main-dv"
                container
                spacing={4}
                alignItems="stretch"
                style={{ margin: 0 }}
              >
                {/* <Grid item xs={8} sm={8} md={8} key="1" style={{ padding: 0 }}> */}
                {/* <Typography className="p-16 pb-8 text-18 font-700">
                         What and When?
                     </Typography> */}
                <Grid
                  className="department-main-dv p-16"
                  container
                  spacing={4}
                  alignItems="stretch"
                  style={{ margin: 0 }}
                >
                  {/* <Grid container={true} item xs={4} sm={4} md={4} key="1" style={{ padding: 0 }}> */}

                  <Grid
                    item xs={4} sm={4} md={4}
                    key="1"
                    style={{ padding: 5 }}
                  >
                    <lebel className="pl-1">Catalogue name*</lebel>
                    <TextField
                    className=""
                    placeholder="Catalogue Name"
                    name="catalogueName"
                    value={catalogueName}
                    error={catNamErr.length > 0 ? true : false}
                    helperText={catNamErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                    disabled={isView}
                  />
                  </Grid>

                  <Grid
                    item
                    xs={4}
                    sm={4}
                    md={4}
                    key="2"
                    style={{ padding: 5, marginLeft: "30px" }}
                  >
                    {/* <div>Expiry Date</div> */}
                    <lebel className="pl-1">Expiry date*</lebel>
                    <TextField
                      className="pt-1"
                      placeholder="Expiry Date"
                      onKeyDown={onKeyDown}
                      name="expDate"
                      disabled={isView}
                      value={expDate}
                      type="date"
                      variant="outlined"
                      fullWidth
                      error={expDtErr.length > 0 ? true : false}
                      helperText={expDtErr}
                      onChange={(e) => handleInputChange(e)}
                      format="yyyy/MM/dd"
                      inputProps={{
                        min: moment().format("YYYY-MM-DD"),
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  {/* <Grid item xs={4} sm={4} md={4} key="3" style={{ padding: 5 }}>
                                        <div>Catalogue Type</div>

                                        <select name="CatalogueType"
                                            className={classes.selectBox}
                                        >
                                            <option value="desing">Design Based</option>
                                            
                                            <option value="other">other</option>
                                        </select>
                                    </Grid> */}
                  {/* <Grid item xs={4} sm={4} md={4} key="4" style={{ padding: 5 }}>
                                        <TextField
                                            className=""
                                            label="Mobile Number"
                                            // name="phoneNotwo"
                                            // value={phoneNumTwo}
                                            // error={phoneNumTwoErr.length > 0 ? true : false}
                                            // helperText={phoneNumTwoErr}
                                            // onChange={(e) => handleInputChange(e)}
                                            variant="outlined"
                                            required
                                            fullWidth
                                        />
                                    </Grid> */}
                  <Grid
                    item
                    xs={3}
                    sm={3}
                    md={3}
                    key="5"
                    style={{ padding: 5, paddingLeft: "30px" }}
                  >
                    <FormControl
                      id="redio-input-dv"
                      component="fieldset"
                      // className={classes.formControl}
                      className={clsx(classes.formControl)}
                    >
                      <FormLabel component="legend">
                        Show Catalogue in App :
                      </FormLabel>
                      <RadioGroup
                        aria-label="Gender"
                        id="radio-row-dv"
                        name="showAppFlag"
                        className={classes.group}
                        style={{ flexDirection: "initial" }}
                        value={showAppFlag}
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
                            disabled={isView}
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
                            disabled={isView}
                            value="0"
                            control={<Radio />}
                            label="No"
                          />
                        </Grid>
                      </RadioGroup>
                    </FormControl>
                    <span style={{ color: "red" }}>
                      {showAppErr.length > 0 ? showAppErr : ""}
                    </span>
                  </Grid>
                  <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    {/* <a onClick={handleOpenUrl}>Catalouge URL</a>  */}
                    {isEdit || isView ? (
                      <>
                        <Grid
                          item
                          lg={12}
                          md={12}
                          sm={12}
                          xs={12}
                          style={{ padding: 6 }}
                        >
                          <div>
                            <span>Download PDF:</span>
                            <Link
                              onClick={handleOpenPdf}
                              style={{ fontSize: 15 }}
                            >
                              {" "}
                              PDF Download{" "}
                            </Link>
                          </div>
                          <div>
                            <span> Catalouge URL:</span>
                            <Link
                              onClick={handleOpenUrl}
                              style={{ fontSize: 15 }}
                            >
                              {" "}
                              {Config.getCatalogUrl() + `catalogues/${catId}`}
                            </Link>{" "}
                          </div>
                        </Grid>
                      </>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>

                <Typography className="p-16 pb-8 text-16 font-700">
                  Whom?
                </Typography>

                <FormControl
                  id="redio-input-dv"
                  component="fieldset"
                  // className={classes.formControl}
                  className={clsx(classes.formControl)}
                >
                  {/* <FormLabel component="legend">Categories :</FormLabel> */}
                  <RadioGroup
                    aria-label="Gender"
                    id="radio-row-dv"
                    name="whom"
                    className={classes.group}
                    style={{ flexDirection: "initial", paddingLeft: "15px" }}
                    value={whom}
                    onChange={handleInputChange}
                  >
                    <Grid item lg={2} md={2} sm={2} xs={2}>
                      <FormControlLabel
                        disabled={isView}
                        value="1"
                        control={<Radio />}
                        label="All Users"
                      />
                    </Grid>

                    <Grid item lg={2} md={2} sm={2} xs={2}>
                      <FormControlLabel
                        disabled={isView}
                        value="2"
                        control={<Radio />}
                        label="Unregistered Users"
                      />
                    </Grid>

                    <Grid item lg={2} md={2} sm={2} xs={2}>
                      <FormControlLabel
                        disabled={isView}
                        value="3"
                        control={<Radio />}
                        label="Selective"
                      />
                    </Grid>
                  </RadioGroup>
                  <span style={{ color: "red" }}>
                    {whomErr.length > 0 ? whomErr : ""}
                  </span>

                  <div style={{ paddingBottom: "30px" }}>
                    {!isView && (
                      <Button
                        id="btn-save"
                        style={{ float: "right" }}
                        aria-label="Register"
                        // type="submit"
                        onClick={(e) => {
                          handleSubmit(e);
                        }}
                      >
                        Save
                      </Button>
                    )}

                    <Button
                      aria-label="Register"
                      onClick={() => {
                        History.goBack();
                      }}
                      id="btn-save"
                      style={{
                        float: "right",
                        width: "66px",
                        marginRight: "20px",
                      }}
                      // style={{marginLeft: "10px"}}
                    >
                      {!isView ? "Cancel" : "Back"}
                    </Button>
                  </div>
                </FormControl>

                {whom === "3" && (
                  <div className="m-16  department-tbl-mt-dv">
                    <Paper className={classes.tabroot} id="department-tbl-fix ">
                      <div
                        className="table-responsive "
                        style={{
                          height: "calc(67vh - 280px)",
                          overflowX: "hidden",
                          overflowY: "auto",
                        }}
                      >
                        <Table className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
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
                          </TableHead>
                          <TableBody>
                            {userList.map((row) => (
                              <TableRow key={row.id}>
                                {/* component="th" scope="row" */}
                                <TableCell className={classes.tableRowPad}>
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
                                  {row.mobile_number}
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
                                    : ""}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {/* Company */}
                                  {row.compName}
                                </TableCell>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                  style={{ overflowWrap: "anywhere" }}
                                >
                                  {/* email */}
                                  {row.email}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </Paper>
                  </div>
                )}

                {/*  */}
                <div className="add-client-row"></div>

                <Grid item xs={12} sm={6} md={6} >
                  <Typography className="pt-20 pb-10 text-16 font-700">
                    Login Details
                  </Typography>
                </Grid>

                <div className="mb-68 department-tbl-mt-dv">
                  <Paper className={classes.tabroot} id="department-tbl-fix ">
                    <div className="table-responsive ">
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              User Name	
                            </TableCell>
                            <TableCell className={classes.tableRowPad} align="left">
                               Gender                         
                             </TableCell>
                            <TableCell className={classes.tableRowPad} align="left" >
                               Mobile No	
                            </TableCell>
                            <TableCell className={classes.tableRowPad} align="left" >
                              Company Name
                            </TableCell>
                            <TableCell className={classes.tableRowPad} align="left" >
                              City	
                            </TableCell>
                            <TableCell className={classes.tableRowPad} align="left" >
                               User Type		
                            </TableCell>
                            <TableCell className={classes.tableRowPad} style={{display:"flex"}} align="left" >
                              Date and Time
                            </TableCell>
                            
                          </TableRow>

                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              {/* User Name */}
                              <TextField
                                name="userName"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />
                              
                            </TableCell>

                            <TableCell
                              className={classes.tableRowPad} align="left">
                              {/* Gender */}
                              {/* <TextField
                                name="variant_number"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              /> */}
                                <Select
                            styles={{ selectStyles }}
                            inputProps={{
                              className: "all-Search-box-data",
                            }}

                            options={genderArrdata.map((group) => ({
                              value: group.value,
                              label: group.label,
                            }))}
                            isClearable
                            value={logInSearchData.showInApp}
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            onChange={handleLoginGenderChanges}
                          />
                            </TableCell>

                            <TableCell
                              className={classes.tableRowPad} align="left">
                              {/* Movile No */}
                              <TextField
                                name="mobileno"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />
                            </TableCell>

                            <TableCell
                              className={classes.tableRowPad} align="left">
                              {/* Company Name */}
                              <TextField
                                name="companyName"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />
                            </TableCell>

                            <TableCell className={classes.tableRowPad}>
                              {/* City */}
                              <TextField
                                name="city"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />
                            </TableCell>

                            <TableCell className={classes.tableRowPad}>
                              {/* User Type */}
                              {/* <TextField
                                name="category"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              /> */}
                             <Select
                               styles={{ selectStyles }}
                               options={userArr.map((group) => ({
                               value: group.value,
                               label: group.label,
                              }))}
                               isClearable
                               value={logInSearchData.showInApp}
                               filterOption={createFilter({
                               ignoreAccents: false,
                              })}
                             onChange={handleLoginUserChange}
                            />
                            </TableCell>

                            <TableCell className={classes.tableRowPad}>
                              {/* Date and Time */}
                              <TextField
                                 name="dateTime"
                                 type="date"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />
                            </TableCell>

                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {userLoginDetail
                            // .filter(
                            //     (temp) => {
                            //         //             compName: "",
                            //         //                 mobNo: "",
                            //         // email: "",
                            //         // city: "",
                            //         if (searchData.compName) {
                            //             return temp.company_name
                            //                 .toLowerCase()
                            //                 .includes(searchData.compName.toLowerCase())
                            //         } else if (searchData.mobNo) {
                            //             return temp.company_mob
                            //                 .toLowerCase()
                            //                 .includes(searchData.mobNo.toLowerCase())
                            //         } else if (searchData.email) {
                            //             return temp.company_email_for_orders
                            //                 .toLowerCase()
                            //                 .includes(searchData.email.toLowerCase())
                            //         } else if (searchData.city) {
                            //             return temp.city_name.name
                            //                 .toLowerCase()
                            //                 .includes(searchData.city.toLowerCase())
                            //         } else {
                            //             return temp
                            //         }
                            //     })
                            .filter((temp) => {
                              if (searchData.category) {
                                return temp.Category.billing_category_name
                                  .toLowerCase()
                                  .includes(searchData.category.toLowerCase());
                              } else if (searchData.variant_number) {
                                return temp.variant_number
                                  .toLowerCase()
                                  .includes(
                                    searchData.variant_number.toLowerCase()
                                  );
                              } else if (searchData.showInApp) {
                                return temp.status
                                  .toString()
                                  .toLowerCase()
                                  .includes(searchData.showInApp.toLowerCase());
                              } else {
                                return temp;
                              }
                            })
                            .map((row, index) => (
                              <TableRow key={index}>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {row.Category.billing_category_name}
                                </TableCell>

                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {row.variant_number}
                                </TableCell>
                                {/* <TableCell
                                                                    align="left"
                                                                    className={classes.tableRowPad}
                                                                >
                                                                    gross
                                                                </TableCell> */}
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {row.status}
                                </TableCell>

                                <TableCell className={classes.tableRowPad}>
                                  <img
                                    src={row.image_files[0].image_file}
                                    height={50}
                                    width={50}
                                    alt=""
                                  />
                                </TableCell>
                                {!isView && !row.selected ? (
                                  <TableCell
                                    className={classes.tableRowPad}
                                    align="left"
                                  >
                                    <IconButton
                                      style={{ padding: "0" }}
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                        ev.stopPropagation();
                                        setDeleteModal(true);
                                        setDeleteId(row.mainId);
                                      }}
                                    >
                                      <Icon className="mr-8 delete-icone">
                                        <img src={Icones.delete_red} alt="" />
                                      </Icon>
                                    </IconButton>
                                  </TableCell>
                                ) : (
                                  ""
                                )}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>

                    <Dialog
                      open={deleteModal}
                      onClose={() => setDeleteModal(false)}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle
                        id="alert-dialog-title"
                        className="popup-delete"
                      >
                        {"Alert!!!"}
                   
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Are you sure you want to delete this record?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => setDeleteModal(false)}
                          className="delete-dialog-box-cancle-button"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={deleteHandler}
                          className="delete-dialog-box-delete-button"
                        >
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Paper>
                </div>



                {/* <Grid
                                    className="department-main-dv"
                                    container
                                    spacing={4}
                                    alignItems="stretch"
                                    style={{ margin: 0, paddingTop: "30px"}}
                                > */}

              <div className="add-client-row"></div>

                <Grid item xs={12} sm={6} md={6} key="1">
                  <Typography className="pt-20 pb-10 text-16 font-700">
                    Add Design
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  key="2"
                  style={{
                    textAlign: "right",
                    paddingTop: "20px",
                    paddingBottom: "10px",
                  }}
                >
                  {!isView && (
                    <Button
                      id="btn-save"
                      variant="contained"
                      className={classes.button}
                      size="small"
                      onClick={(event) => {
                        //   setDefaultView(btndata.id);
                        setDesignFlag(true);
                      }}
                    >
                      Add Products
                    </Button>
                  )}
                </Grid>
                {/* </Grid> */}

                <div className="mb-68 department-tbl-mt-dv">
                  <Paper className={classes.tabroot} id="department-tbl-fix ">
                    <div className="table-responsive ">
                    <TablePagination
                        // rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage=""
                        component="div"
                        // count={apiData.length}
                        count={count}
                        rowsPerPage={10}
                        page={page}
                        backIconButtonProps={{
                          "aria-label": "Previous Page",
                        }}
                        nextIconButtonProps={{
                          "aria-label": "Next Page",
                        }}
                        onPageChange={handleChangePage}
                        // onChangeRowsPerPage={handleChangeRowsPerPage}
                      />
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              Catagories
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Item Code
                            </TableCell>
                            {/* <TableCell className={classes.tableRowPad} align="left">
                                                            Gross Wt
                                                            
                                                        </TableCell> */}
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Show In App
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              Image
                            </TableCell>
                            {!isView && (
                              <TableCell
                                className={classes.tableRowPad}
                                align="left"
                              >
                                Actions
                              </TableCell>
                            )}
                          </TableRow>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              {/* Categories */}
                              <TextField
                                name="category"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              {/* item code. */}
                              <TextField
                                name="variant_number"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              align="left"
                            >
                              {/* status. */}
                              <TextField
                                name="showInApp"
                                onChange={handleSearchData}
                                inputProps={{
                                  className: "all-Search-box-data",
                                }}
                              />
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                            {!isView && (
                              <TableCell
                                className={classes.tableRowPad}
                              ></TableCell>
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                        {(isView || (isEdit && hidden === false)
                          ? designData.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                          : designData
                        )
                            // .filter((temp) => {
                            //   if (searchData.category) {
                            //     return temp.Category.billing_category_name
                            //       .toLowerCase()
                            //       .includes(searchData.category.toLowerCase());
                            //   } else if (searchData.variant_number) {
                            //     return temp.variant_number
                            //       .toLowerCase()
                            //       .includes(
                            //         searchData.variant_number.toLowerCase()
                            //       );
                            //   } else if (searchData.showInApp) {
                            //     return temp.status
                            //       .toString()
                            //       .toLowerCase()
                            //       .includes(searchData.showInApp.toLowerCase());
                            //   } else {
                            //     return temp;
                            //   }
                            // })
                            .map((row, index) => (
                              <TableRow key={index}>
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {row.Category.billing_category_name}
                                </TableCell>

                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {row.variant_number}
                                </TableCell>
                                {/* <TableCell
                                                                    align="left"
                                                                    className={classes.tableRowPad}
                                                                >
                                                                    gross
                                                                </TableCell> */}
                                <TableCell
                                  align="left"
                                  className={classes.tableRowPad}
                                >
                                  {row.status}
                                </TableCell>

                                <TableCell className={classes.tableRowPad}>
                                  <img
                                    src={row.image_files[0].image_file}
                                    height={50}
                                    width={50}
                                    alt=""
                                  />
                                </TableCell>
                                {!isView && !row.selected ? (
                                  <TableCell
                                    className={classes.tableRowPad}
                                    align="left"
                                  >
                                    <IconButton
                                      style={{ padding: "0" }}
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                        ev.stopPropagation();
                                        setDeleteModal(true);
                                        setDeleteId(row.mainId);
                                      }}
                                    >
                                      <Icon className="mr-8 delete-icone">
                                        <img src={Icones.delete_red} alt="" />
                                      </Icon>
                                    </IconButton>
                                  </TableCell>
                                ) : (
                                  ""
                                )}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                      {((isEdit && hidden === false) || isView) && (
                      <TablePagination
                        // rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage=""
                        component="div"
                        // count={apiData.length}
                        count={count}
                        rowsPerPage={10}
                        page={page}
                        backIconButtonProps={{
                          "aria-label": "Previous Page",
                        }}
                        nextIconButtonProps={{
                          "aria-label": "Next Page",
                        }}
                        onPageChange={handleChangePage}
                        // onChangeRowsPerPage={handleChangeRowsPerPage}
                      />
                    )}
                    </div>

                    <Dialog
                      open={deleteModal}
                      onClose={() => setDeleteModal(false)}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle
                        id="alert-dialog-title"
                        className="popup-delete"
                      >
                        {"Alert!!!"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Are you sure you want to delete this record?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={() => setDeleteModal(false)}
                          className="delete-dialog-box-cancle-button"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={deleteHandler}
                          className="delete-dialog-box-delete-button"
                        >
                          Delete
                        </Button>
                      </DialogActions>
                    </Dialog>

                  </Paper>
                </div>
              </Grid>
            </div>

            {designFlag && (
              <AddMycatalogDesingCom
                handleClose={handleDesignClose}
                handleSubmit={handleDesignSubmit}
                showFileUpload={true}
              />
            )}
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddCatalogue;

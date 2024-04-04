import React, { useState, useEffect } from "react";
import { InputBase, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Modal from "@material-ui/core/Modal";
import { TextField } from "@material-ui/core";
import Search from "../SearchHelper/SearchHelper";
import Select, { createFilter } from "react-select";
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import SearchIcon from "@material-ui/icons/Search";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
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
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
    // height: "90%",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  tableRowPadd: {
    padding: 7,
    justifyContent: "end !important",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
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
    marginRight: "16px",
  },
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
  },
  wrapText: {
    whiteSpace: "nowrap",
    width: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
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

const BToCClient = (props) => {
  // const [defaultView, setDefaultView] = useState("1");
  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [apiData, setApiData] = useState([]);

  const [modalStyle] = useState(getModalStyle);
  const [modalOpen, setModalOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState("");

  const [number, setNumber] = useState("");
  const [numberErr, setNumberErr] = useState("");

  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");

  const [address, setAddress] = useState("");
  const [addresErr, setAddressErr] = useState("");

  const [countryData, setCountryData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryErr, setSelectedCountryErr] = useState("");

  const [stateData, setStateData] = useState([]); // hsn details dropdown
  const [stateSelected, setStateSelected] = useState("");
  const [stateErrTxt, setStateErrTxt] = useState("");

  const [cityData, setCityData] = useState([]); // hsn details dropdown
  const [citySelected, setCitySelected] = useState("");
  const [cityErrTxt, setCityErrTxt] = useState("");

  const [pincode, setPincode] = useState("");
  const [pincodeErr, setPincodeErr] = useState("");

  const [getGovProofData, setGetGovProofData] = useState([]); // hsn details dropdown
  const [idSelected, setIdSelected] = useState("");
  const [idErrTxt, setIdErrTxt] = useState("");

  const [mobileNoContry, setMobileNoContry] = useState("");
  const [SecltedmobileNoContry, setSelectedMobileNoContry] = useState("");
  const [mobileNoContryErr, setMobileNoContryErr] = useState("");

  const [govProofId, setGovProofId] = useState("");
  const [govProofIdErr, setGovProofIdErr] = useState("");
  // const [hsnNumber, setHsnNumber] = useState("");
  // const [hsnNumberErr, setHsnNumberErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState("");
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

  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);

  function handleModalClose() {
    setModalOpen(false);
    setIsViewOnly(false);
    setName("");
    setNumber("");
    setEmail("");
    setAddress("");
    setPincode("");
    setIdSelected("");
    setStateSelected("");
    setCitySelected("");
    setSelectedIdForEdit("");
    setNameErr("");
    setNumberErr("");
    setEmailErr("");
    setAddressErr("");
    setSelectedCountryErr("");
    setStateErrTxt("");
    setCityErrTxt("");
    setPincodeErr("");
    setGovProofIdErr("");
    setIdErrTxt("");
    setIsEdit(false);
    setMobileNoContryErr("");
    setSelectedMobileNoContry("");
    setMobileNoContry("");
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "Name") {
      setName(value);
      setNameErr("");
    } else if (name === "Number") {
      setNumber(value);
      setNumberErr("");
    } else if (name === "email") {
      setEmail(value);
      setEmailErr("");
    } else if (name === "address") {
      setAddress(value);
      setAddressErr("");
    } else if (name === "pincode") {
      setPincode(value);
      setPincodeErr("");
    } else if (name === "govProofId") {
      setGovProofId(value);
      setGovProofIdErr("");
    }
  }

  function NmValidation() {
    var Regex = /^[a-zA-Z0-9 ]+$/;
    if (!name || Regex.test(name) === false) {
      setNameErr("Enter Valid Name");
      return false;
    }
    return true;
  }

  function NumberValidation() {
    var Regex = /^[0-9]{10}$/;
    if (!number || Regex.test(number) === false) {
      setNumberErr("Enter Valid Number");
      return false;
    }
    return true;
  }

  function emailValidation() {
    //var Regex = /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g;
    var Regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || Regex.test(email) === false) {
      setEmailErr("Enter Valid Email Id");
      return false;
    }
    return true;
  }
  function addressValidation() {
    if (address === "") {
      setAddressErr("Enter address");
      return false;
    }
    return true;
  }

  function countryCodeValidation() {
    if (mobileNoContry === "") {
      setMobileNoContryErr("Please select country code");
      return false;
    }
    return true;
  }

  function countryValidation() {
    if (selectedCountry === "") {
      setSelectedCountryErr("Select Country");
      return false;
    }
    return true;
  }

  function stateValidation() {
    if (stateSelected === "") {
      setStateErrTxt("Select state");
      return false;
    }
    return true;
  }

  function cityValidation() {
    if (citySelected === "") {
      setCityErrTxt("Select City");
      return false;
    }
    return true;
  }

  function pincodeValidation() {
    var Regex = /^(\d{4}|\d{6})$/;
    if (!pincode || Regex.test(pincode) === false) {
      setPincodeErr("Enter Valid pincode");
      return false;
    }
    return true;
  }

  function idValidation() {
    // var Regex = /^[a-zA-Z0-9 ]+$/;
    if (idSelected === "") {
      setIdErrTxt("Enter Valid Gov. Id Proof");
      return false;
    }
    return true;
  }

  function govIdValidation() {
    if (govProofId === "") {
      setGovProofIdErr("Enter Valid govId number");
      return false;
    }
    return true;
  }

  function handleChangefirstcode(value) {
    setMobileNoContry(value);
    setSelectedMobileNoContry(value.Ccode);
    setMobileNoContryErr("");
  }

  const checkforUpdate = (evt) => {
    evt.preventDefault();

    if (
      NmValidation() &&
      countryCodeValidation() &&
      NumberValidation() &&
      emailValidation() &&
      addressValidation() &&
      countryValidation() &&
      stateValidation() &&
      cityValidation() &&
      pincodeValidation() &&
      idValidation() &&
      govIdValidation()
    ) {
      checkAndCallAPi();
    }
  };
  function checkAndCallAPi() {
    if (isEdit === true) {
      updateBTOCClientApi();
    } else {
      addBTOCClientApi();
    }
  }

  function addBTOCClientApi() {
    axios
      .post(Config.getCommonUrl() + "api/btocclient", {
        name: name,
        number: number,
        email: email,
        address: address,
        country: selectedCountry.value,
        state: stateSelected.value,
        city: citySelected.value,
        pincode: pincode,
        government_proof: idSelected.value,
        government_proof_id: govProofId,
        first_country_id: mobileNoContry.value,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // Data stored successfully
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );

          setName("");
          setNumber("");
          setEmail("");
          setAddress("");
          setPincode("");
          setIdSelected("");
          setStateSelected("");
          setCitySelected("");
          setGovProofId("");
          setModalOpen(false);
          setMobileNoContry("");
          setSelectedMobileNoContry("");
          getbtocclient();
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
        handleError(error, dispatch, { api: "api/btocclient" });
      });
  }

  function updateBTOCClientApi() {
    axios
      .put(Config.getCommonUrl() + "api/btocclient/" + selectedIdForEdit, {
        name: name,
        number: number,
        email: email,
        address: address,
        country: selectedCountry.value,
        state: stateSelected.value,
        city: citySelected.value,
        pincode: pincode,
        government_proof: idSelected.value,
        government_proof_id: govProofId,
        first_country_id: mobileNoContry.value,
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
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }

        setModalOpen(false);
        setName("");
        setNumber("");
        setEmail("");
        setAddress("");
        setPincode("");
        setIdSelected("");
        setStateSelected("");
        setCitySelected("");
        setGovProofId("");
        setSelectedIdForEdit("");
        setIsEdit(false);
        getbtocclient();
        setMobileNoContry("");
        setSelectedMobileNoContry("");
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/btocclient/" + selectedIdForEdit,
          body: {
            name: name,
            number: number,
            email: email,
            address: address,
            country: selectedCountry.value,
            state: stateSelected.value,
            city: citySelected.value,
            pincode: pincode,
            government_proof: idSelected.value,
            government_proof_id: govProofId,
            first_country_id: mobileNoContry.value,
          },
        });
      });
  }

  function viewHandler(id) {
    setIsViewOnly(true);
    setSelectedIdForEdit("");
    setIsEdit(true);
    //find index and set data to modal form

    const index = apiData.findIndex((element) => element.id === id);
    // let Name = "";
    if (index > -1) {
      setData(index);
    }
  }

  function editHandler(id) {
    setSelectedIdForEdit(id);
    setIsEdit(true);
    setIsViewOnly(false);
    //find index and set data to modal form

    const index = apiData.findIndex((element) => element.id === id);
    // let Name = "";
    if (index > -1) {
      setData(index);
    }
  }
  {
    console.log(apiData);
  }
  function setData(index) {
    // getbtocclient();
    {
      console.log(apiData[index]);
    }
    setModalOpen(true);
    setName(apiData[index].name);
    setNumber(apiData[index].number);
    setEmail(apiData[index].email);
    setAddress(apiData[index].address);
    // const ind = countryData.findIndex((item)=> item.id === apiData[index].country)
    // if(ind>-1){
    setSelectedCountry({
      value: apiData[index].country_name.id,
      label: apiData[index].country_name.name,
    });
    getStateData(apiData[index].country);
    // }

    setStateSelected({
      value: apiData[index].state_name.id,
      label: apiData[index].state_name.name,
    });
    setCitySelected({
      value: apiData[index].city_name.id,
      label: apiData[index].city_name.name,
    });
    setMobileNoContry({
      value: apiData[index]?.country_name?.id,
      label: `${apiData[index].country_name?.name} (${apiData[index].country_name?.phonecode})`,
      Ccode: apiData[index].country_name?.phonecode,
    });
    setPincode(apiData[index].pincode);
    setIdSelected({
      value:
        apiData[index].government_proof === "PanCard"
          ? 1
          : apiData[index].government_proof === "AadharCard"
          ? 2
          : apiData[index].government_proof === "ElectionCard"
          ? 3
          : apiData[index].government_proof === "DrivingLicensce"
          ? 4
          : apiData[index].government_proof === "Passport"
          ? 5
          : 1,
      label: apiData[index].government_proof,
    });
    setGovProofId(apiData[index].government_proof_id);
  }

  function deleteHandler(id) {
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function onSearchHandler(sData) {
    setSearchData(sData);
  }

  function callDeleteBToCClientApi() {
    axios
      .delete(Config.getCommonUrl() + "api/btocclient/" + selectedIdForDelete)
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          // selectedIdForDelete

          // const findIndex = apiData.findIndex(
          //   (a) => a.id === selectedIdForDelete
          // );

          // findIndex !== -1 && apiData.splice(findIndex, 1);
          getbtocclient();
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
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
        handleError(error, dispatch, {
          api: "api/btocclient/" + selectedIdForDelete,
        });
      });
  }

  function handleCountryChange(value) {
    setSelectedCountry(value);
    setSelectedCountryErr("");

    setStateData([]);
    setStateSelected("");
    setStateErrTxt("");

    setCityData([]);
    setCitySelected("");
    // getCityData(value.value);
    getStateData(value.value);
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    getCountrydata();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    getbtocclient();
    getGovProofDatafunc();
    // getStateData();
    // if (stateSelected !== "") {
    //   getCityData();
    // } , stateSelected
    //eslint-disable-next-line
  }, [dispatch]);

  function getbtocclient() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/btocclient")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: "api/btocclient" });
      });
  }

  function getCountrydata() {
    axios
      .get(Config.getCommonUrl() + "api/country")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setCountryData(response.data.data);
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
        handleError(error, dispatch, { api: "api/country" });
      });
  }

  function getStateData(countryID) {
    axios
      .get(Config.getCommonUrl() + "api/country/state/" + countryID)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setStateData(response.data.data);
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
        handleError(error, dispatch, { api: "api/country/state/" + countryID });
      });
  }
  function getCityData(stateId) {
    axios
      .get(Config.getCommonUrl() + "api/country/city/" + stateId)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setCityData(response.data.data);
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
        handleError(error, dispatch, { api: "api/country/city/" + stateId });
      });
  }
  function getGovProofDatafunc() {
    axios
      .get(Config.getCommonUrl() + "api/btocclient/proof")
      .then(function (response) {
        if (response.data.success === true) {
          const object = response.data.data;
          const finalData = [];
          for (const [key, value] of Object.entries(object)) {
            finalData.push({ id: key, name: value });
          }
          setGetGovProofData(finalData);
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
        handleError(error, dispatch, { api: "api/btocclient/proof" });
      });
  }

  function handleChangeGovId(value) {
    setIdSelected(value);
    setIdErrTxt("");
  }

  function handleChangeState(value) {
    setStateSelected(value);
    setCitySelected("");
    setStateErrTxt("");

    setCityData([]);
    getCityData(value.value);
  }
  function handleChangeCity(value) {
    setCitySelected(value);
    setCityErrTxt("");
  }

  function openModalHandler() {
    setIsViewOnly(false);
    setName("");
    setNumber("");
    setEmail("");
    setAddress("");
    setPincode("");
    setIdSelected("");
    setSelectedCountry("");
    setStateSelected("");
    setCitySelected("");
    setGovProofId("");
    setSelectedIdForEdit("");
    setModalOpen(true);
  }

  const classes = useStyles();

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
                    B2C Client
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
                <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={(event) => {
                    openModalHandler();
                    // getbtocclient();
                  }}
                >
                  Add New
                </Button>

                {/* </Link> */}
              </Grid>
            </Grid>
            <div className="main-div-alll ">
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

              <div className="mt-56 department-tbl-mt-dv">
                <Paper
                  className={clsx(classes.tabroot)}
                  id="btoclient_tabel_dv"
                  style={{ height: "calc(100vh - 280px)" }}
                >
                  {/* <div className="table-responsive btoclients-tabel-dv  btwo_stock_group_tbel"> */}
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "85px" }}
                        >
                          ID
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "150px" }}
                          align="left"
                        >
                          Client Name
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "150px" }}
                          align="left"
                        >
                          Contact No.
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "200px" }}
                          align="left"
                        >
                          Email
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "400px" }}
                          align="left"
                        >
                          Address/Location
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "120px" }}
                          align="left"
                        >
                          State
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "120px" }}
                          align="left"
                        >
                          City
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "120px" }}
                          align="left"
                        >
                          Pincode
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "150px" }}
                          align="left"
                        >
                          Gov. Proof Name
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          style={{ width: "135px" }}
                          align="left"
                        >
                          Proof Id
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPadd}
                          style={{ width: "120px" }}
                          align="left"
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {console.log(apiData)}
                      {apiData
                        .filter(
                          (temp) =>
                            temp.name
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.number
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.email
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.address
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.state_name.name
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.city_name.name
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.pincode
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.government_proof
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.government_proof_id
                              .toLowerCase()
                              .includes(searchData.toLowerCase())
                        )
                        .map((row) => (
                          <TableRow key={row.id}>
                            {/* component="th" scope="row" */}
                            <TableCell
                              className={classes.tableRowPad}
                              style={{ width: "70px" }}
                            >
                              {row.id}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.name}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {"+" +
                                row.country_name.phonecode +
                                " " +
                                row.number}
                              {/* {row.number} */}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.email}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={clsx(
                                classes.tableRowPad,
                                classes.wrapText
                              )}
                            >
                              {row.address}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.state_name.name}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.city_name.name}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.pincode}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.government_proof}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.government_proof_id}
                            </TableCell>

                            <TableCell className={classes.tableRowPadd}>
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
                  {/* </div> */}
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
                  onClick={callDeleteBToCClientApi}
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
            >
              <div
                style={modalStyle}
                className={clsx(classes.paper, "rounded-8 ")}
              >
                <h5 className="popup-head p-20">
                  {isViewOnly
                    ? "View B2C Client"
                    : isEdit === false
                    ? "Add New B2C Client"
                    : "Edit B2C Client"}
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={handleModalClose}
                  >
                    <Icon className="">
                      <img src={Icones.cross} alt="" />
                    </Icon>
                  </IconButton>
                </h5>
                <div
                  className="pl-40 pr-40 overflow-y-scroll"
                  style={{ height: "70vh" }}
                >
                  <p className="popup-labl pb-4 pt-16 ">Name*</p>
                  <TextField
                    className=" input-select-bdr-dv mb-6"
                    placeholder="Enter name"
                    name="Name"
                    disabled={isViewOnly}
                    value={name}
                    error={nameErr.length > 0 ? true : false}
                    helperText={nameErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                  />

                  <p className="popup-labl pb-4 pt-12 ">Country Code</p>
                  <Select
                    className="mb-6 input-select-bdr-dv"
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    placeholder={<div>Country Code</div>}
                    options={countryData.map((suggestion) => ({
                      value: suggestion.id,
                      label: `${suggestion.name} (${suggestion.phonecode})
                            `,
                      Ccode: suggestion.phonecode,
                    }))}
                    value={mobileNoContry}
                    onChange={handleChangefirstcode}
                    isDisabled={isViewOnly}
                  />
                  <span className={classes.errorMessage}>
                    {mobileNoContryErr.length > 0 ? mobileNoContryErr : ""}
                  </span>

                  <p className="popup-labl pb-4 pt-12 ">Phone number*</p>
                  <TextField
                    className="mb-6 input-select-bdr-dv"
                    placeholder="Enter phone number"
                    name="Number"
                    disabled={isViewOnly}
                    value={number}
                    error={numberErr.length > 0 ? true : false}
                    helperText={numberErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    required
                  />
                  <p className="popup-labl pb-4 pt-12 ">Email</p>
                  <TextField
                    className="mb-6 input-select-bdr-dv"
                    placeholder="Enter email"
                    name="email"
                    value={email}
                    disabled={isViewOnly}
                    error={emailErr.length > 0 ? true : false}
                    helperText={emailErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    required
                  />
                  <p className="popup-labl pb-4 pt-12 ">Address</p>

                  <TextField
                    className="mb-6 input-select-bdr-dv"
                    placeholder="Enter address"
                    name="address"
                    value={address}
                    disabled={isViewOnly}
                    error={addresErr.length > 0 ? true : false}
                    helperText={addresErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    required
                  />
                  <p className="popup-labl pb-4 pt-12 ">Country</p>

                  <Select
                    className="mb-6 input-select-bdr-dv"
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={countryData.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.name,
                    }))}
                    // components={components}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    placeholder="Enter country"
                    isDisabled={isViewOnly}
                  />

                  <span style={{ color: "red" }}>
                    {selectedCountryErr.length > 0 ? selectedCountryErr : ""}
                  </span>
                  <p className="popup-labl pb-4 pt-12 ">State</p>

                  <Select
                    className="mb-6 input-select-bdr-dv"
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={stateData.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.name,
                    }))}
                    value={stateSelected}
                    onChange={handleChangeState}
                    placeholder="Enter states"
                    isDisabled={isViewOnly}
                  />
                  <span style={{ color: "red" }}>
                    {stateErrTxt.length > 0 ? stateErrTxt : ""}
                  </span>
                  <p className="popup-labl pb-4 pt-12 ">City</p>

                  <Select
                    className="mb-6 input-select-bdr-dv"
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={cityData.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.name,
                    }))}
                    value={citySelected}
                    disabled={stateSelected !== ""}
                    onChange={handleChangeCity}
                    placeholder="Enter city"
                    isDisabled={isViewOnly}
                  />
                  <span style={{ color: "red" }}>
                    {cityErrTxt.length > 0 ? cityErrTxt : ""}
                  </span>
                  <p className="popup-labl pb-4 pt-12 ">Pincode*</p>

                  <TextField
                    className="mb-6 input-select-bdr-dv"
                    placeholder="Enter pincode"
                    name="pincode"
                    value={pincode}
                    error={pincodeErr.length > 0 ? true : false}
                    helperText={pincodeErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    required
                    disabled={isViewOnly}
                  />
                  <p className="popup-labl pb-4 pt-12 ">Government Proof</p>

                  <Select
                    className="mb-6 input-select-bdr-dv"
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={getGovProofData.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.name,
                    }))}
                    // components={components}
                    value={idSelected}
                    onChange={handleChangeGovId}
                    placeholder="Enter government proof"
                    isDisabled={isViewOnly}
                  />
                  <span style={{ color: "red" }}>
                    {idErrTxt.length > 0 ? idErrTxt : ""}
                  </span>
                  <p className="popup-labl pb-4 pt-12 ">Gov. Proof Id*</p>

                  <TextField
                    className="input-select-bdr-dv"
                    placeholder="Enter gov. proof id"
                    name="govProofId"
                    value={govProofId}
                    error={govProofIdErr.length > 0 ? true : false}
                    helperText={govProofIdErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    required
                    disabled={isViewOnly}
                  />

                  {!isViewOnly && (
                    <div className="model-actions flex flex-row mb-10">
                      <Button
                        variant="contained"
                        className="w-128 mx-auto mt-20 popup-cancel"
                        onClick={handleModalClose}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        className="w-128 mx-auto mt-20 popup-save"
                        onClick={(e) => checkforUpdate(e)}
                      >
                        Save
                      </Button>
                    </div>
                  )}

                  {isViewOnly && (
                    <div className="model-actions flex flex-row mb-10">
                      <Button
                        variant="contained"
                        color="primary"
                        className="w-128 mt-20 ml-92 popup-cancel"
                        onClick={(e) => handleModalClose()}
                      >
                        Close
                      </Button>
                    </div>
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

export default BToCClient;

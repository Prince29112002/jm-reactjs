import React, { useState, useEffect } from "react";
import { InputBase, Typography,  Modal, Box,TextareaAutosize,
    TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
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
import { Link } from "react-router-dom";
// import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import SearchIcon from "@material-ui/icons/Search";
import Icones from "assets/fornt-icons/Mainicons";
import History from "@history";
import moment from "moment";
import AddNewMortgageUser from "../AddMortage/AddNewMortgageUser";

const useStyles = makeStyles((theme) => ({
  root: {},
  inputBoxTEST: {
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  table: {
    minWidth: 1000,
    tableLayout: "auto",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  search: {
    display: "flex",
    border: "1px solid #cccccc",
    height: "38px",
    width: "340px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
    marginLeft: "auto",
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
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
  },
  tableRowPad: {
    padding: 7,
  },
  tablePad: {
    padding: 0,
  },
  paper: {
    position: "absolute",
    maxWidth: 950,
    width: "calc(100% - 30px)",
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
  },
  label: {
    marginBottom: 7,
    paddingLeft: 7,
  },
  uibuttion: {
    marginBottom: "0px !important",
  },
  closeIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    borderRadius: "50%",
    background: "#c1c1c1",
    opacity: "0.4",
    transition: "0.4s",
    "&:hover": {
      background: "#415bd4",
      opacity: 1,
      color: "#FFFFFF",
    },
  },
  errorMessage: {
    color: "#f44336",
    position: "absolute",
    bottom: "-3px",
    fontSize: "11px",
    lineHeight: "7px",
    marginTop: 3,
    fontFamily: 'Muli,Roboto,"Helvetica",Arial,sans-serif',
  },
  tab: {
    padding: 0,
    minWidth: "auto",
    marginInline: 10,
    textTransform: "uppercase",
    zIndex: 9,
    minHeight: "40px",
    // lineHeight: "initial",
    color: "#415BD4",
  },
  customIndicator: {
    backgroundColor: "#415BD4 !important",
    zIndex: 1,
    minHeight: "40px",
    top: 0,
    bottom: 0,
    borderRadius: 7,
  },
  selectVarient: {
    maxHeight: 40,
    minHeight: 40,
  },
  addBtn: {
    display: "flex",
    borderRadius: "8px",
    background: "#1E65FD",
    minWidth: "40px",
    maxWidth: "40px",
    alignItems: "center",
    justifyContent: "center",
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

const UserList = (props) => {
  const [apiData, setApiData] = useState([]);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState("")
  const [newUser, setNewUser] = useState("");
  const [newUserErr, setNewUserErr] = useState("");
  const [mortageMobile, setMortageMobile] = useState("");
  const [mortageMobileErr, setMortageMobileErr] = useState("");
  const [mortageAddress, setMortageAddress] = useState("");
  const [mortageAddressErr, setMortageAddressErr] = useState("");
  const [modalStyle] = useState(getModalStyle);
  const [searchData, setSearchData] = useState("");

  useEffect(() => {
    NavbarSetting("Orders-Retailer", dispatch);
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    getUserList();
  }, [dispatch]);

  useEffect(() => {
    if(isEdit){
        getOneUserData()
    }
  },[isEdit])

  function editHandler(row) {
    setIsEdit(true)
    setEditId(row.id)
  }

  function getOneUserData(){
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `retailerProduct/api/mortage/user/readOne/${editId}`)
      .then(function (response) {
        if (response.data.success === true) {
            const arrData = response.data.data
            setNewUser(arrData.name);
            setMortageMobile(arrData.mobile_number);
            setMortageAddress(arrData.address);
          setLoading(false);
        } else {
            setApiData([])
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
      })
      .catch(function (error) {
        setApiData([])
        setLoading(false);
        handleError(error, dispatch, { api: `retailerProduct/api/mortage/user/readOne/${editId}` });
      });
  }
  
  function getUserList() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/mortage/user")
      .then(function (response) {
        if (response.data.success === true) {
          setApiData(response.data.data);
          setLoading(false);
        } else {
            setApiData([])
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
      })
      .catch(function (error) {
        setApiData([])
        setLoading(false);
        handleError(error, dispatch, { api: "retailerProduct/api/mortage/user" });
      });
  }

  const handleModalClose = () => {
    setIsEdit(false);
    setEditId("")
  }

  function nameValidation(value) {
    console.log(typeof(value));
    if (value === undefined || value === "") {
      setNewUserErr("Please Enter Name");
      return false;
    } else {
      setNewUserErr("");
      return true;
    }
  }
  function mobileNumberValidation(value) {
    const Regex = /^[0-9]{10}$/;
    console.log(value);
    if (value === "") {
      setMortageMobileErr("");
      return false;
    } else 
    if (Regex.test(value) === false) {
      setMortageMobileErr("Please Enter Valid Mobile Number");
      return false;
    } else {
      setMortageMobileErr("");
      return true;
    }
  }
  function addressValidation(value) {
    if (value === "") {
      setMortageAddressErr("Please Enter Address");
      return false;
    }  else {
      setMortageAddressErr("");
      return true;
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "newuser") {
      setNewUser(value);
      nameValidation(value);
    }
    if (name === "mnumber") {
      if (/^\d{0,10}$/.test(value)) {
        setMortageMobile(value);
        mobileNumberValidation(value);
      }
    }
    if (name === "address") {
      setMortageAddress(value);
      addressValidation(value);
    }
  };

  function handleSubmit() {
    const nUser = newUser;
    const mNumber = mortageMobile;
    const mAddress = mortageAddress;
    if(
      nameValidation(nUser)  
      // mobileNumberValidation(mNumber) && 
      // addressValidation(mAddress)
      ) {
      postMortageUserData();
    }
  }

  function postMortageUserData() {
    const payload = {
      name: newUser,
      mobile_number: mortageMobile,
      address: mortageAddress
    };
    axios
      .put(Config.getCommonUrl() + `retailerProduct/api/mortage/user/edit/${editId}`, payload)
      .then(function (response) {
        if (response.data.success === true) {
          console.log("setMortageGetData", response.data.data);
          // setMortgageUserList(response.data);
          handleModalClose();
          setNewUser("");
          setMortageMobile("");
          setMortageAddress("");
          getUserList()
          // setMortageUserData(response.data.data);
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
              variant: "success",
            })
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `retailerProduct/api/mortage/user/edit/${editId}`,
          payload,
        });
      });
  }

  return (
    <>
    <div className={clsx(classes.root, "w-full ")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
      <Box>
      <Grid
              container
              alignItems="center"
              style={{
                paddingInline: "28px",
                marginTop: "30px",
                marginBottom: "16px",
                justifyContent: "space-between",
              }}
            >
              <Grid item xs={6} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">Mortage User List</Typography>
                </FuseAnimate>
              </Grid>
             
              <Grid
                item
                xs={6}
                style={{ textAlign: "right" }}
                 key="2"
              >
                 <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={() => History.push(`/dashboard/mortage`)}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
            <div className="main-div-alll">
            <Grid
                container
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Grid item>
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
                </Grid>
              </Grid>
                <Paper style={{ marginTop: "16px", overflowY: "auto" }}>
                  <div
                    className="table-responsive "
                    style={{ height: "calc(100vh - 280px)" }}
                  >
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableRowPad}>Id</TableCell>
                          <TableCell className={classes.tableRowPad}>Name</TableCell>
                          <TableCell className={classes.tableRowPad}>Mobile Number</TableCell>
                          <TableCell className={classes.tableRowPad}>Address</TableCell>
                          <TableCell className={classes.tableRowPad}>Created At</TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {apiData
                          .filter(
                            (temp) =>
                              temp.name
                                .toLowerCase()
                                .includes(searchData.toLowerCase()) ||
                              (moment(temp.created_at).format("DD-MM-YYYY"))
                                .toLowerCase()
                                .includes(searchData.toLowerCase()) ||
                              (temp.mobile_number)
                                .toLowerCase()
                                .includes(searchData.toLowerCase()) ||
                              temp.address
                                .toLowerCase()
                                .includes(searchData.toLowerCase()) 
                          ).map((row, i) => (
                            <TableRow key={row.id}>
                              {/* component="th" scope="row" */}
                              <TableCell className={classes.tableRowPad}>
                                {i + 1}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {row?.name}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row?.mobile_number}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >

                                {row?.address}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {moment(row?.created_at).format("DD-MM-YYYY")}
                              </TableCell>

                              <TableCell className={classes.tableRowPad}>
                                       <IconButton
                                    style={{ padding: "0" }}
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      editHandler(row);
                                    }}
                                  >
                                    <Icon className="mr-8 edit-icone">
                                      <img src={Icones.edit} alt="" />
                                    </Icon>
                                  </IconButton> 
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </Paper>
                </div> 
              </Box>
      </FuseAnimate>
      {
                isEdit && <>
                 <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={isEdit}
    >
      <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
        <>
          <h5 className="popup-head p-20">
            Edit User
            <IconButton
              style={{ position: "absolute", top: "3px", right: "6px" }}
              onClick={handleModalClose}
            >
              <Icon>
                <img src={Icones.cross} alt="" />
              </Icon>
            </IconButton>
          </h5>
          <Box style={{ padding: "30px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <label>Name</label>
                <TextField
                  name="newuser"
                  variant="outlined"
                  type="text"
                  fullWidth
                  autoFocus
                  onChange={(e) => handleInputChange(e)}
                  value={newUser}
                  error={newUserErr.length > 0 ? true : false}
                  helperText={newUserErr}
                />
              </Grid>
              <Grid item xs={12}>
                <label>Mobile No.</label>
                <TextField
                  name="mnumber"
                  variant="outlined"
                  type="text"
                  fullWidth
                  onChange={(e) => handleInputChange(e)}
                  value={mortageMobile}
                  error={mortageMobileErr.length > 0 ? true : false}
                  helperText={mortageMobileErr}
                />
              </Grid>
              <Grid item xs={12} style={{position: "relative"}}>
                <label>Address</label>
                {/* <TextareaAutosize
                  name="address"
                  variant="outlined"
                  type="text"
                  fullWidth
                  onChange={(e) => handleInputChange(e)}
                  value={mortageAddress}
                  error={mortageAddressErr.length > 0 ? true : false}
                  helperText={mortageAddressErr}
                /> */}
        
                <TextareaAutosize
                  name="address"
                  value={mortageAddress}
                  error={mortageAddressErr !== "" ? true : false}
                  helperText={mortageAddressErr}
                  onChange={(e) => handleInputChange(e)}
                  maxRows={4}
                  variant="outlined"
                  style={{
                    width: "100%",
                    border: "1px solid #cccccc",
                    paddingInline: 6,
                    paddingBlock: 9,
                    borderRadius: 7
                  }}
                />
                <span
                    className={classes.errorMessage}
                  >
                    {mortageAddressErr ? mortageAddressErr : ""}
                  </span>
              </Grid>
              <Grid item xs={12} style={{textAlign: "right"}}>
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Box>
        </>
      </div>
    </Modal>
                </>
            }
    </div>
   
    </>
  );
};

export default UserList;

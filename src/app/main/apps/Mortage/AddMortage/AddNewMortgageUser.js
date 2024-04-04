import {
  Box,
  Button,
  Grid,
  Icon,
  IconButton,
  Modal,
  TextField,
  TextareaAutosize,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { useDispatch } from "react-redux";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Icones from "assets/fornt-icons/Mainicons";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Autocomplete from "@material-ui/lab/Autocomplete";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 600,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
  },
  button: {
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  errorMessage: {
    color: "#f44336",
    position: "absolute",
    bottom: "-3px",
    fontSize: "11px",
    lineHeight: "7px",
    marginTop: 3,
    fontFamily: 'Muli,Roboto,"Helvetica",Arial,sans-serif',
    display: "block"
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
const AddNewMortgageUser = (props) => {
  const { newUserName, setOpenClientModal, openClientModal, onFormSubmit } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);
  console.log(newUserName.value);
  const defaultValue = newUserName.value;
  const [newUser, setNewUser] = useState(defaultValue);
  const [newUserErr, setNewUserErr] = useState("");
  const [mortageMobile, setMortageMobile] = useState("");
  const [mortageMobileErr, setMortageMobileErr] = useState("");
  const [mortageAddress, setMortageAddress] = useState("");
  const [mortageAddressErr, setMortageAddressErr] = useState("");

  const [addressApiData, setAddressApiData] = useState([]);


  useEffect(() => {
    NavbarSetting("Mortage-Retailer", dispatch);
  }, []);

  useEffect(() => {
    setNewUser(newUserName.value);
  }, [newUserName.value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mortageAddress) {
        getAddressData(mortageAddress);
      } else {
        setAddressApiData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [mortageAddress]);

  function getAddressData(sData) {
    console.log(sData);
    axios
      .get(Config.getCommonUrl() + `retailerProduct/api/mortage/search/address?&address=${sData}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let responseData = response.data.data
          if (responseData.length > 0) {
            console.log(response.data);
            setAddressApiData(responseData);
          } else {
            setAddressApiData([]);
          }
        } else {
          setAddressApiData([]);
          // dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        // handleError(error, dispatch, {
        //   api: "retailerProduct/api/mortage/search/product",
        // });
      });
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
    console.log(value);
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
    console.log(nameValidation(nUser));
    console.log(mobileNumberValidation(mNumber));
    if(
      nameValidation(nUser) && 
      // mobileNumberValidation(mNumber) && 
      addressValidation(mAddress)) {
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
      .post(Config.getCommonUrl() + "retailerProduct/api/mortage/user", payload)
      .then(function (response) {
        if (response.data.success === true) {
          console.log("setMortageGetData", response.data.data);
          // setMortgageUserList(response.data);
          onFormSubmit(response.data.data);
          handleModalClose();
          setNewUser("");
          setMortageMobile("");
          setMortageAddress("");
          // setMortageUserData(response.data.data);
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
          api: "retailerProduct/api/mortage/user",
          payload,
        });
      });
  }
  function handleModalClose() {
    setOpenClientModal(false);
    setMortageMobile("");
    setNewUser("");
  }

  let handleAddressSelect = (value) => {
    console.log("innnn", value)
    let filteredArray = addressApiData.filter(
      (item) => item.address === value
    );
    if (filteredArray.length > 0) {
      setAddressApiData(filteredArray);
      setMortageAddressErr("");
      setMortageAddress(value);
    }
  };

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={openClientModal}
    >
      <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
        <>
          <h5 className="popup-head p-20">
            Add New Borrower
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
                <Autocomplete
                  id="free-solo-demos"
                  freeSolo
                  disableClearable
                  name="address"
                  onChange={(event, newValue) => {
                    console.log(newValue,);
                    handleAddressSelect(newValue);
                  }}
                  onInputChange={(event, newInputValue) => {
                    console.log(newInputValue);
                    console.log(event);
                    if (event !== null) {
                      if (event.type === "change")
                      setMortageAddress(newInputValue);
                    } 
                    else {
                      setMortageAddress("");
                    }
                  }}
                  value={mortageAddress}
                  options={addressApiData.map(
                    (option) => option.address
                  )}
                  fullWidth
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      multiline
                      minRows={3}
                      style={{
                        padding: "0px !important"
                      }}
                    />
                  )}
                />
                {/* <TextareaAutosize
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
                /> */}
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
  );
};

export default AddNewMortgageUser;

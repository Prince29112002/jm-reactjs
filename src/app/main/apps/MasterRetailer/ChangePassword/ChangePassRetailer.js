import React, { useState } from "react";
import {
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogContentText,
  IconButton,
  DialogTitle,
  Icon,
} from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as authActions from "app/auth/store/actions";
import { makeStyles } from "@material-ui/styles";
import * as Actions from "app/store/actions";
import { darken } from "@material-ui/core/styles/colorManipulator";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import History from "@history";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {
    background:
      "linear-gradient(to right, " +
      theme.palette.primary.dark +
      " 0%, " +
      darken(theme.palette.primary.dark, 0.5) +
      " 100%)",
    color: theme.palette.primary.contrastText,
  },
}));

const ChangePassRetailer = () => {
  const classes = useStyles();
  
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCpassword] = useState("");
  const [isoldPwdErr, setIsOldPwdErr] = useState(false);
  const [oldpwdErrTxt, setOldPwdErrTxt] = useState("");

  const [isPwdErr, setIsPwdErr] = useState(false);
  const [pwdErrTxt, setPwdErrTxt] = useState("");

  const [isCPwdErr, setIsCPwdErr] = useState(false);
  const [cPwdErrTxt, setCPwdErrTxt] = useState("");

  const [open, setOpen] = useState(false);

  // const [apiResErr, setApiResErr] = useState(false);
  // const [apiResErrTxt, setApiResErrTxt] = useState("");

  const dispatch = useDispatch();

  function password_validate() {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!password || regex.test(password) === false) {
      setIsPwdErr(true);
      setPwdErrTxt(
        "Password must have uppercase, lowercase, special character,number and limit 8 must be required"
      );

      return false;
    }
    return true;
  }

  function validateConfiPwd() {
    if (password !== cPassword) {
      setIsCPwdErr(true);
      setCPwdErrTxt("Passwords don't match");
      return false;
    }
    return true;
  }


  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "oldpassword") {
      setOldPassword(value);
      setIsOldPwdErr(false);
      setOldPwdErrTxt("");
    } else
    if (name === "password") {
      setPassword(value);
      setIsPwdErr(false);
      setPwdErrTxt("");
    } else if (name === "cPassword") {
      setIsCPwdErr(false);
      setCPwdErrTxt("");
      setCpassword(value);
    }
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if ( password_validate() && validateConfiPwd()) {
      updateSelfPassword();
      // setOpen(true);
    }
    // resetForm();
  }

  function updateSelfPassword() {
    console.log("function");
    axios
      .put(Config.getCommonUrl() + "api/admin", {
        oldPassword:oldPassword,
        password: password,
      })
      .then(function (response) {
        console.log(response,"77777777777777777777777777777777777777");

        if (response.data.success === true) {
        console.log("569455456454545545");

          dispatch(
            Actions.showMessage({
              message: "Updated SuccessFully",
              variant: "success",
            })
          );
          callLogOutApi();
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
        console.log("010101010");
        handleError(error, dispatch, {
          api: "api/admin",
          body: {
        oldPassword:oldPassword,
            password: password,
          },
        });
      });
  }

  function callLogOutApi() {
    axios
      .post(Config.getCommonUrl() + "admin/logout")
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          dispatch(authActions.logoutUser("Logout", { api: "admin/logout" }));
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
        handleError(error, dispatch, { api: "admin/logout" });
      });
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div
      className={clsx(
        classes.root,
        "flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32"
      )}
      style={{ background: "initial" }}
    >
      <div className="flex flex-col items-center justify-center w-full login_pt_dv">
        <FuseAnimate animation="transition.expandIn">
          <Card className="w-full max-w-400 login_dv">
            <h5 className="popup-head p-20">Password Change</h5>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="w-full mt-6">
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  onSubmit={handleSubmit}
                >
                  <lebal className="font">Old Password*</lebal>
                  <TextField
                    className="mb-16"
                    placeholder="Enter Old Password"
                    type="oldpassword"
                    name="oldpassword"
                    value={oldPassword}
                    onChange={(e) => handleInputChange(e)}
                    error={isoldPwdErr}
                    helperText={oldpwdErrTxt}
                    variant="outlined"
                    required
                    fullWidth
                  />
                  <lebal className="font">New Password*</lebal>
                  <TextField
                    placeholder="Enter New Password"
                    type="password"
                    name="password"
                    // error={isPwdErr}
                    // helperText={pwdErrTxt}
                    value={password}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                  />
                   <span className="fornt-Err-Select">
                        {pwdErrTxt.length > 0 ? pwdErrTxt : ""}
                      </span>

                  <lebal className="font mt-16">Confirm Password*</lebal>
                  <TextField
                    className="mb-16 "
                    placeholder="Enter Confirm Password"
                    type="password"
                    name="cPassword"
                    error={isCPwdErr}
                    helperText={cPwdErrTxt}
                    value={cPassword}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                  />

                  {/* {apiResErr === true && (
                    <span style={{ color: "red" }}>{apiResErrTxt}</span>
                  )} */}

                  {/* <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="w-full mx-auto mt-16 mb-16 login-btn normal-case"
                    aria-label="LOG IN"
                    // disabled={!isFormValid}
                    value="legacy"
                  >
                    Save
                  </Button> */}
                  <div className="popup-button-div">
                    <Button
                      variant="contained"
                      className="cancle-button-css"
                      onClick={(event) => {
                        History.goBack();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      className="save-button-css"
                      aria-label="LOG IN"
                      value="legacy"
                    >
                      Save
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </FuseAnimate>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="successmessage"
        >
          <DialogTitle id="alert-dialog-description">
            {/* <img src={Icones.right_green} className="image-size" alt="" /> */}
            <IconButton
              style={{ position: "absolute", marginTop: "-5px", right: "20px" }}
              onClick={handleClose}
            >
              <Icon style={{ color: "black" }}>close</Icon>
            </IconButton>
          </DialogTitle>
          <div>
            <DialogContentText id="alert-dialog-description">
              <img src={Icones.right_green} className="image-size" alt="" />
            </DialogContentText>
            <DialogContentText
              id="alert-dialog-description"
              style={{ fontSize: "2.4rem" }}
            >
              Your Password Has Been Changed Successfully!
            </DialogContentText>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default ChangePassRetailer;

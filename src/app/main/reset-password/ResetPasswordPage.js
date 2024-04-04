import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, TextField, Typography } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate } from '@fuse';
import { useForm } from '@fuse/hooks';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import axios from "axios";
import handleError from '../ErrorComponent/ErrorComponent';
import Config from 'app/fuse-configs/Config';
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import logo from "assets/images/logo/logo 2.png";
import History from "@history";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
const useStyles = makeStyles(theme => ({
  root: {
    // background: 'radial-gradient(' + darken(theme.palette.primary.dark, 0.5) + ' 0%, ' + theme.palette.primary.dark + ' 80%)',
    color: theme.palette.primary.contrastText
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  card: {
    boxShadow: " 3px 3px 40px 0px rgba(0,0,80,0.2), 0px 0px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    borderRadius: "7px",
  },
  resetPassword :{
position:"static !important"
  }

}));

function ResetPasswordPage(props) {


  useEffect(() => {
    const propsdata = props.location.search
    const urlParams = new URLSearchParams(propsdata);
    const resettokenUrl = urlParams.get('resettoken');
    console.log('Reset Token:', resettokenUrl);
    setResettoken(resettokenUrl)
    const emailRegex = /[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}/;
    const match = propsdata.match(emailRegex);
    const emailUrl = match ? match[0] : null;
    setEmail(emailUrl)
    console.log('Email:', emailUrl);
  }, []);

  useEffect(() => {
    NavbarSetting("Resettoken", dispatch);
  }, []);
  const classes = useStyles();

  // const {form, resetForm} = useForm({
  //     name           : '',
  //     email          : '',
  //     password       : '',
  //     passwordConfirm: ''
  // });
  function handleChange(event) {
    // console.log("handleInputChange");

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "email") {
      setEmail(value);
      setEmailErr(false);
      setEmailErrTxt("");
    } else if (name === "resetttoken") {
      setResettoken(value);
      // setEmailErr(false);
      // setEmailErrTxt("");
    }
    else if (name === "password") {
      setPassword(value);
      setIsPwdErr(false);
      setPwdErrTxt("");
    } else if (name === "passwordConfirm") {
      setIsCPwdErr(false);
      setCPwdErrTxt("");
      setCpassword(value);
    }
  }
  // function isFormValid()
  // {

  // }
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [cPassword, setCpassword] = useState("");
  const [email, setEmail] = useState("");
  const [resettoken, setResettoken] = useState("");

  const [emailErr, setEmailErr] = useState(false);
  const [emailErrTxt, setEmailErrTxt] = useState("");

  const [isPwdErr, setIsPwdErr] = useState(false);
  const [pwdErrTxt, setPwdErrTxt] = useState("");

  const [isCPwdErr, setIsCPwdErr] = useState(false);
  const [cPwdErrTxt, setCPwdErrTxt] = useState("");
  function emailValidation() {
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || emailRegex.test(email) === false) {
      setEmailErr(true);
      setEmailErrTxt("Email is not valid");

      return false;
    }
    return true;
  }
  function password_validate() {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!password || regex.test(password) === false) {
      setIsPwdErr(true);
      setPwdErrTxt(
        "Password must have Uppercase, Lowercase, special character,number and limit 8 must be required"
      );

      return false;
    }
    return true;
  }
  function validateConfiPwd() {
    // console.log(password,cPassword)
    if (password !== cPassword) {
      setIsCPwdErr(true);
      setCPwdErrTxt("Confirm password does not match with passsword");
      return false;
    }
    return true;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (emailValidation() && password_validate() && validateConfiPwd()) {
      console.log("success");
      updateSelfPassword();

    }
    // updateSelfPassword();
    // resetForm();
  }
  function updateSelfPassword() {
    // const userId = localStorage.getItem("userId");
    // console.log("pwd", password,userId)

    axios
      .post(Config.getCommonUrl() + "api/admin/resetPassword", {
        "email": email,
        "password": password,
        "reset_token": resettoken
        // "id": userId
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {

          History.push("/login");
          dispatch(Actions.showMessage({ message: response.data.message, variant: "success" }));


        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/admin/resetPassword", body: {
            "email": email,
            "newPassword": password
          }
        })
      });
  }

  return (
    <div className={clsx(classes.root, "flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32")}>

      <div className="flex flex-col items-center justify-center w-full">

        <FuseAnimate animation="transition.expandIn">

          <Card className={clsx(classes.card, "w-full max-w-384")}>

            <CardContent className="flex flex-col items-center justify-center p-32">

              <div className="m-32">
                <img src={Config.getjvmLogo()} alt="logo" />
              </div>

              <Typography variant="h6" className="mt-16 mb-32">RESET YOUR PASSWORD</Typography>

              <form
                name="resetForm"
                noValidate
                className="flex flex-col justify-center w-full"
                onSubmit={handleSubmit}
              >
                <label >
                  Email ID*
                </label>

                <TextField
                  className="mb-16"
                  // label="Email"
                  autoFocus
                  type="email"
                  name="email"
                  error={emailErr}
                  helperText={emailErrTxt}

                  value={email}
                  onChange={(e) => handleChange(e)}
                  variant="outlined"
                  required
                  fullWidth
                  placeholder='Enter email id'
                />
                {/* <label >
                  Resettoken*
                </label>

                <TextField
                  className="mb-16"
                  // label="Email"
                  autoFocus
                  type="resetttoken"
                  name="resetttoken"
                  disabled
                  value={resettoken}
                  onChange={(e) => handleChange(e)}
                  variant="outlined"
                  required
                  fullWidth
                  placeholder='Enter email id'
                /> */}
                <label>
                  Password*
                </label>
                <TextField
                  className="mb-16 All-Error-show"
                  // id='asdfg'
                  // label="Password"
                  type="password"
                  name="password"

                  error={isPwdErr}
                  helperText={pwdErrTxt}
                  value={password}
                  onChange={(e) => handleChange(e)}
                  variant="outlined"
                  required
                  fullWidth
                  placeholder='Enter password'
                />
                <label >
                  Password (Confirm)
                </label>
                <TextField
                  className="mb-16 All-Error-show"
                  // label="Password (Confirm)"
                  type="password"
                  name="passwordConfirm"
                  error={isCPwdErr}
                  helperText={cPwdErrTxt}
                  value={cPassword}
                  onChange={(e) => handleChange(e)}
                  variant="outlined"
                  required
                  fullWidth
                />

                <Button

                  // variant="contained"
                  // color="primary"
                  className={classes.button}
                  // aria-label="Reset"
                  // disabled={!isFormValid()}
                  type="submit"
                >
                  RESET MY PASSWORD
                </Button>

              </form>

              <div className="flex flex-col items-center justify-center pt-32 pb-24">
                <Link className="font-medium" to="/pages/auth/login">Go back to login</Link>
              </div>

            </CardContent>
          </Card>
        </FuseAnimate>
      </div>
    </div>
  );
}

export default ResetPasswordPage;

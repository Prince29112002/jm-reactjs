import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
  InputAdornment,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { darken } from "@material-ui/core/styles/colorManipulator";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import jwtService from "app/services/jwtService";
import { setUserData } from "app/auth/store/actions";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import * as Actions from "app/store/actions";
import handleError from "../ErrorComponent/ErrorComponent";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";
import Icon from "assets/fornt-icons/Mainicons";
import vector1 from "assets/images/Login Vector/Vector 1.svg";
import vector2 from "assets/images/Login Vector/Vector 2.svg";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

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

function Login() {
  const classes = useStyles();

  const [userName, setUserName] = useState("");
  const [pwd, setPwd] = useState("");

  const [userNameError, setUnameErr] = useState(false);
  const [pwdError, setPwdErr] = useState(false);

  const [userNameErrTxt, setUnameErrTxt] = useState("");
  const [pwdErrorTxt, setPwdErrTxt] = useState("");

  const [siteData, setSiteData] = useState([])
  const [profileData, setProfileData] = useState([])
  const [isretaile, setIsretailer] = useState("");

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [ip, setIp] = useState()
  useEffect(() => {
    NavbarSetting("Login", dispatch);
    //eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    getIp()
    getAllStiteSettingData();
  }, [])

  // useEffect(() => {
  //   if(localStorage.getItem("siteSetting")){
  //     console.log("innnnnnn")
  //     const siteSetData = localStorage.getItem("siteSetting")
  //     setSiteData(siteSetData)
  //   }
  // }, [siteData])
console.log(isretaile,"//////////////////");
  const getIp = async () => {
    // Connect ipapi.co with fetch()
    const response = await fetch('https://jsonip.com/')
    const data = await response.json()
    // Set the IP address to the constant `ip`
    localStorage.setItem('ip',data.ip)
    setIp(data.ip)
  }

  function getAllStiteSettingData() {
    axios
      .get(Config.getCommonUrl() + "api/siteSetting/")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          var apiRes = JSON.stringify(response.data.data);
          localStorage.setItem("siteSetting", apiRes);
          setSiteData(response.data.data)
        }else{
          localStorage.setItem("siteSetting", []);
          setSiteData([])
        }
      })
      .catch(function (error) {
        localStorage.setItem("siteSetting", []);
        setSiteData([])
        handleError(error, dispatch, {api : "siteSetting"})
      });
  }
  function getAllMyprofileData() {
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/myprofile")
      .then(function (response) {
        if (response.data.success === true) {
          var apiRes = JSON.stringify(response.data.data[0]);
          localStorage.setItem("myprofile", apiRes);
          setProfileData(response.data.data)
        }else{
          localStorage.setItem("myprofile", []);
          setProfileData([])
        }
      })
      .catch(function (error) {
        localStorage.setItem("myprofile", []);
        setProfileData([])
        handleError(error, dispatch, {api : "retailerProduct/api/myprofile"})
      });
  }
  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function emailValidation() {
    var usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!userName || usernameRegex.test(userName) === false) {
      setUnameErr(true);
      setUnameErrTxt("User name is not valid");

      return false;
    }
    return true;
  }

  function password_validate() {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!pwd) {
      setPwdErr(true);
      setPwdErrTxt("Password must be required");
      return false;
    } else if (regex.test(pwd) === false) {
      setPwdErr(true);
      setPwdErrTxt(
        "Password must have Uppercase, Lowercase, special character,number and limit 8 must be required"
      );
      return false;
    }
    return true;
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "userName") {
      setUnameErr(false);
      setUnameErrTxt("");
      setUserName(value);
    } else {
      setPwdErr(false);
      setPwdErrTxt("");
      setPwd(value);
    }
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    if (emailValidation() && password_validate()) {
      signInWithEmailAndPassword(userName, pwd);
    } else {
      dispatch(
        Actions.showMessage({
          message: "Please enter valid credentials",
          variant: "error",
        })
      );
    }
  }

  const tempUser = {
    uuid: "XgbuVEXBU5gtSKdbQRP1Zbbby1i1",
    from: "custom-db",
    password: "admin",
    role: "admin",
    data: {
      displayName: userName,
      photoURL: "assets/images/avatars/Abbott.jpg",
      email: "admin",
      settings: {
        layout: {
          style: "layout1",
          config: {
            scroll: "content",
            navbar: {
              display: true,
              // folded  : true, to always open false, default is false
              position: "left",
            },
            toolbar: {
              display: true,
              style: "fixed",
              position: "above",
            },
            footer: {
              display: true,
              style: "fixed",
              position: "below",
            },
            mode: "fullwidth",
          },
        },
        customScrollbars: false,
        theme: {
          main: "default",
          navbar: "default",
          toolbar: "default",
          footer: "default",
        },
      },
      shortcuts: ["calendar", "mail", "contacts"],
    },
  };

  const signInWithEmailAndPassword = (email, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      axios
        .post(Config.getCommonUrl() + "admin/login", {
          username: email,
          password: password,
        })
        .then((response) => {
          if (response.data.success === true) {
            jwtService.setSession(response.data.authToken, null, null);
            jwtService.setRefreshToken(response.data.refreshToken);
            getUserPermissions();
            if(response.data.is_retailer_admin === 1){
              getAllMyprofileData()

            }
            setIsretailer(response.data.is_retailer_admin)
            localStorage.setItem("is_retailer_admin", response.data.is_retailer_admin);
            localStorage.setItem("userName", email);
            localStorage.setItem("userId", response.data.id);
            localStorage.setItem("isSuperAdmin", response.data.is_super_admin);
            localStorage.setItem("isPasswordTwo",response.data.is_password)
            localStorage.setItem("isChainRetailer",response.data.is_chain_retailer);
            localStorage.setItem("isSchemeRetailer",response.data.is_scheme_retailer)
            localStorage.setItem("isChainZamZam",response.data.is_chain_zam_zam)
            if (response.data.location !== null) {
              localStorage.setItem("isDesigner", true);

              setTimeout(() => {
                setLoading(false);
                dispatch(setUserData(tempUser));
                dispatch({
                  type: LOGIN_SUCCESS,
                });
              }, 800);
            } else {
              localStorage.setItem("isDesigner", false);
              setTimeout(() => {
                setLoading(false);
                dispatch(setUserData(tempUser));
                dispatch({
                  type: LOGIN_SUCCESS,
                });
              }, 800);
            }

            // setApiResErr(false);
            // setApiResErrTxt("");
          }
        })
        .catch((error) => {
          setLoading(false);
          handleError(error, dispatch, {
            api: "admin/login",
            body: {
              username: email,
              password: password,
            },
          });
          dispatch({
            type: LOGIN_ERROR,
            payload: error.response?.data.message,
          });

        });
    });
  };

  function getUserPermissions() {
    axios
      .get(Config.getCommonUrl() + "admin/permission/user")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          // setRoleOfUser(response.data.data)
          localStorage.setItem(
            "permission",
            JSON.stringify(response.data.data)
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, { api: "admin/permission/user" });
      });
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
        {loading && <Loader />}

        <FuseAnimate animation="transition.expandIn">
          <Box className="main_div ">
            <div className="Llogin_dv ">
              <Carousel
                infiniteLoop
                autoPlay
                showStatus={false}
                showArrows={false}
                showThumbs={false}
                interval={3000}
              >
                <div>
                  <img src={vector1} alt="Item1" className="Llogin_dv_vec" />
                  <p className="Llogin_vec_fdec mt-10">
                  Sparkle and Shine                  </p>
                  <p className="Llogin_vec_sdec mt-8">
                  Empower Your Jewellery Business  with   our  <br /> All-in-One Technical Solution!

                  
                  
                  </p>
                </div>
                <div>
                  <img src={vector2} alt="Item3" className="Llogin_dv_vec" />
                  <p className="Llogin_vec_fdec mt-10">
                  Dazzle Your Success                  </p>
                  <p className="Llogin_vec_sdec mt-8">
                  Unlock the Brilliance of Your Jewellery Business with our 
                    <br />
                    Comprehensive Technical Solution!
                  </p>{" "}
                </div>
              </Carousel>
            </div>
            {console.log(siteData,"dataaaaaaaaa")}
            <div className="Rlogin_dv">
              <img src={`https://jewelmakerit.s3.ap-south-1.amazonaws.com/vkjdev/siteSetting/image/${siteData.image_file}`}
                className="Rdv_f_child" alt="logo" />
              <div className="Rdv_s_child">
                <p className="sc_Ftext">
                  <b>Welcome back!</b>
                </p>
                <p className="sc_Stext">
                  <small>
                    Enter your email id and password to access admin panel.
                  </small>
                </p>
              </div>
              <div className="w-full p-3 Rdv_t_child">
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  onSubmit={handleSubmit}
                >
                  <label htmlFor="userName" className="log-label mb-2">
                    User Name*
                  </label>
                  <TextField
                    className="mb-16 h-50"
                    type="text"
                    name="userName"
                    error={userNameError}
                    helperText={userNameErrTxt}
                    value={userName}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                    InputLabelProps={{ shrink: userName ? true : false }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img src={Icon.user} alt="" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <label htmlFor="password" className="log-label mb-2">
                    Password*
                  </label>
                  <TextField
                    className="mb-16 h-50"
                    type={values.showPassword ? "text" : "password"}
                    name="password"
                    error={pwdError}
                    helperText={pwdErrorTxt}
                    value={pwd}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                    InputLabelProps={{ shrink: pwd ? true : false }}
                    style={{paddingInline: 0}}
                    InputProps={{
                      style: { paddingRight: 0 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <img src={Icon.password} alt="" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end" style={{position: "absolute", right: 0}}>
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {values.showPassword ? (
                              <img src={Icon.eye_hide} alt="" />
                            ) : (
                              <img src={Icon.eye_show} alt="" />
                            )}
                          </IconButton>{" "}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <div className="Rdv_fo_child">
                    <FormControlLabel
                      control={
                        <Checkbox defaultChecked className="forgt_check" />
                      }
                      label="Remember me"
                    />

                    <Link className="forget_link mt-3" to="/forgot-password">
                      <u>Forgot password?</u>
                    </Link>
                  </div>

                  {/* {apiResErr === true && (
                    <span style={{ color: "red" }}>{apiResErrTxt}</span>
                  )} */}

                  <button
                    type="submit"
                    variant="contained"
                    className="w-full mx-auto mt-16 mb-16 login-btn h-50 "
                    aria-label="LOG IN"
                    // disabled={!isFormValid}
                    value="legacy"
                  >
                    Login
                  </button>
                </form>
              </div>
            </div>
          </Box>
        </FuseAnimate>
      </div>
    </div>
  );
}

export default Login;

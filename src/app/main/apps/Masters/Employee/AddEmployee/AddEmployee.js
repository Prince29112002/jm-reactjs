import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { Button, TextField } from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";

import History from "@history";
import Select, { createFilter } from "react-select";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    overflowX: "auto",
  },
  tabText: {
    textTransform: "none",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  inputBox: {
    // marginTop: 8,
    // padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
  },
  form: {
    marginTop: "3%",
    display: "contents",
  },
  submitBtn: {
    marginTop: 8,
    padding: 8,
    fontSize: "12pt",
    marginLeft: 15,
    backgroundColor: "#4caf50",
    border: "none",
    color: "white",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    borderRadius: 8,
    cursor: "pointer",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  formControl: {
    // margin: theme.spacing(3),
  },
  group: {
    margin: theme.spacing(1, 0),
    flexDirection: "row",
  },
}));

const AddEmployee = (props) => {
  const isEdit = props.isEdit; //if comes from edit
  const [stockGroup, setStockGroup] = React.useState(null);

  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCpassword] = useState("");

  const [isUNmErr, setIsUNmErr] = useState(false);
  const [uNmErrTxt, setUNmErrTxt] = useState("");

  const [isPwdErr, setIsPwdErr] = useState(false);
  const [pwdErrTxt, setPwdErrTxt] = useState("");

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
  }, []);

  const stockGroupSuggestions = [
    { label: "Loose metal", stockGroup: "gold" },
    { label: "HHCZ", stockGroup: "stone" },
    { label: "Silver collet", stockGroup: "silver" },
  ].map((suggestion) => ({
    value: suggestion.label,
    label: suggestion.stockGroup,
  }));

  function handleChangeStockGroup(value) {
    setStockGroup(value);
  }

  const [value, setValue] = React.useState("female");

  function handleChange(event) {
    setValue(event.target.value);
  }

  const classes = useStyles();

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "userName") {
      setIsUNmErr(false);
      setUNmErrTxt("");
      setUserName(value);
    } else if (name === "password") {
      setIsPwdErr(false);
      setPwdErrTxt("");
      setPassword(value);
    } else if (name === "pConfirm") {
      setCpassword(value);
    }
  }

  function emailValidation() {
    //username
    // const regex = /[a-zA-Z0-9]+[.]?([a-zA-Z0-9]+)?[@][a-z]{3,9}[.][a-z]{2,5}/g;        regex.test(email) === false ||
    var usernameRegex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (!userName || usernameRegex.test(userName) === false) {
      setIsUNmErr(true);
      setUNmErrTxt("User name is not valid");

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
    if (password !== cPassword) {
      return false;
    }
    return true;
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();
    if (isEdit === false) {
      // add new flow
      if (emailValidation() && password_validate() && validateConfiPwd()) {
      }
    } else {
      //edit flow
      if (password !== "" || cPassword !== "") {
        if (password_validate() && validateConfiPwd()) {
        }
      } else {
      }
    }
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="p-16 pb-8 text-18 font-700">
                    Add New Employee
                  </Typography>
                </FuseAnimate>
              </Grid>

              <Grid
                item
                xs={12}
                sm={4}
                md={9}
                key="2"
                style={{ textAlign: "right", paddingRight: "5%" }}
              >
                <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={(event) => {
                    // History.push("/dashboard/masters/employee");
                    History.goBack();
                    //   setDefaultView(btndata.id);
                    //   setIsEdit(false);
                  }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>

            <div className="pb-32 pt-32 pl-16 pr-16">
              <div>
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  onSubmit={handleFormSubmit}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <TextField
                        className="mb-16"
                        label="Name"
                        autoFocus
                        type="name"
                        name="name"
                        value={userName}
                        error={isUNmErr}
                        helperText={uNmErrTxt}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        id="date"
                        label="Joining Date"
                        type="date"
                        className={classes.inputBox}
                        name="joiningDt"
                        value={password}
                        error={isPwdErr}
                        helperText={pwdErrTxt}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Select
                        className="mb-16"
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={stockGroupSuggestions}
                        // components={components}
                        value={stockGroup}
                        onChange={handleChangeStockGroup}
                        placeholder="Department / Workstation"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        className="mb-16"
                        label="Designation"
                        name="designation"
                        value={userName}
                        error={isUNmErr}
                        helperText={uNmErrTxt}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField
                        className="mb-16"
                        label="Phone No"
                        name="contact"
                        value={userName}
                        error={isUNmErr}
                        helperText={uNmErrTxt}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField
                        className="mb-16"
                        label="Email Id"
                        name="designation"
                        value={userName}
                        error={isUNmErr}
                        helperText={uNmErrTxt}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <FormControl
                        component="fieldset"
                        className={classes.formControl}
                      >
                        <FormLabel component="legend">
                          Salary Paid By :
                        </FormLabel>
                        <RadioGroup
                          aria-label="Gender"
                          name="gender1"
                          className={classes.group}
                          value={value}
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            value="company"
                            control={<Radio />}
                            label="Company"
                          />
                          <FormControlLabel
                            value="contractor"
                            control={<Radio />}
                            label="Contractor"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Button
                    variant="contained"
                    color="primary"
                    className="w-224 mx-auto mt-16"
                    aria-label="Register"
                    //   disabled={!isFormValid()}
                    // type="submit"
                    onClick={handleFormSubmit}
                  >
                    Next
                  </Button>

                  {/* <div style={{ display: "flex",justifyContent:'space-around' }}>
                    <div>row1</div>
                    <div>row2</div>
                    <div>row3</div>
                  </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddEmployee;

import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Radio from "@material-ui/core/Radio";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Loader from "../../../Loader/Loader";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
}));

const MakingChargesRetailer = (props) => {
  const [SelectedValue, setSelectedValue] = useState("");
  const [PerGramInr, setPerGramInr] = useState("");
  const [PerGramInrErr, setPerGramInrErr] = useState("");
  const [PerGrampercentage, setPerGrampercentage] = useState("");
  const [PerGrampercentageErr, setPerGrampercentageErr] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [pcs, setPcs] = useState("");
  const [pcsErr, setPcsErr] = useState("");
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    NavbarSetting("Master-Retailer", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    getmakingChargeApi();
    //eslint-disable-next-line
  }, []);

  function handleChange(event) {
    setSelectedValue(event.target.value);
  }
  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  function getmakingChargeApi() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/makingCharge")
      .then(function (response) {
        if (response.data.success === true) {
          const makingCharges = response.data.data;
          for (const charge of makingCharges) {
            if (charge.type === "INR") {
              setPerGramInr(charge.value);
              setSelectedValue(charge.type);
              setSelectedId(charge.id);
            } else if (charge.type === "PER") {
              setPerGrampercentage(charge.value);
              setSelectedValue(charge.type);
              setSelectedId(charge.id);
            } else if (charge.type === "PCS") {
              setPcs(charge.value);
              setSelectedValue(charge.type);
              setSelectedId(charge.id);
            }
          }
          setLoading(false);
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
        handleError(error, dispatch, {
          api: "retailerProduct/api/makingCharge",
        });
      });
  }

  function addmakingChargeApi() {
    let body;
    if (SelectedValue === "INR") {
      body = { id: selectedId, type: SelectedValue, value: PerGramInr };
    } else if (SelectedValue === "PER") {
      body = { id: selectedId, type: SelectedValue, value: PerGrampercentage };
    } else {
      body = { id: selectedId, type: SelectedValue, value: pcs };
    }
    axios
      .put(
        Config.getCommonUrl() +
          `retailerProduct/api/makingCharge/${selectedId}`,
        body
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          if (SelectedValue == "INR") {
            setPerGrampercentage("");
            setPcs("");
          } else if (SelectedValue == "PER") {
            setPerGramInr("");
            setPcs("");
          } else if (SelectedValue == "PCS") {
            setPerGramInr("");
            setPerGrampercentage("");
          }
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
          api: `retailerProduct/api/makingCharge/${selectedId}`,
          body: body,
        });
      });
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    if (name === "pergraminr" && !isNaN(value)) {
      setPerGramInr(value);
      setPerGramInrErr("");
    } else if (name === "pergram%" && !isNaN(value)) {
      setPerGrampercentage(value);
      setPerGrampercentageErr("");
    } else if (name === "pcs" && !isNaN(value)) {
      setPcs(value);
      setPcsErr("");
    }
  }

  function Validation() {
    if (SelectedValue == "INR") {
      var Regex =
        /^(?!0+(?:\.0+)?$)(?:\d{1,6}(?:\.\d{1,2})?|\d{1,3}(?:,\d{3}){0,2}(?:\.\d{1,2})?)$/;
      if (!PerGramInr || Regex.test(PerGramInr) === false) {
        setPerGramInrErr("Please enter a number between 1 and 999999.99.");
        return false;
      }
      return true;
    } else if (SelectedValue == "PER") {
      var Regex = /^((0\.\d{1,})|([1-9]\d{0,1}(\.\d{1,})?|100(\.0{1,})?))$/;
      if (!PerGrampercentage || Regex.test(PerGrampercentage) === false) {
        setPerGrampercentageErr("Please enter a percentage between 1 and 100.");
        return false;
      }
      return true;
    } else if (SelectedValue == "PCS") {
      if (!pcs || pcs === "") {
        setPcsErr("Please enter a pcs");
        return false;
      }
      return true;
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (Validation()) {
      addmakingChargeApi();
    }
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            <Grid
              container
              alignItems="center"
              style={{ paddingInline: 30, marginBlock: 20 }}
            >
              <Grid item xs={12} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Making Charges
                  </Typography>
                </FuseAnimate>
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll ">
              <Grid style={{marginBottom: 10}}>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <RadioGroup
                    name="SelectedValue"
                    className={classes.group}
                    value={SelectedValue}
                    onChange={handleChange}
                    style={{ display: "block" }}
                  >
                    <FormControlLabel
                      value="INR"
                      control={<Radio />}
                      label="Per Gram INR"
                    />
                    <FormControlLabel
                      value="PER"
                      control={<Radio />}
                      label="Per Gram %"
                    />
                    <FormControlLabel
                      value="PCS"
                      control={<Radio />}
                      label="Per Pcs"
                    />
                  </RadioGroup>
                  <span style={{ color: "red" }}>
                    {/* {gstTypeErr.length > 0 ? gstTypeErr : ""} */}
                  </span>
                </FormControl>
              </Grid>
              {SelectedValue === "INR" && (
                <>
                  <div className="add-textfiled error-errer">
                    <p>Per Gram INR</p>
                    <TextField
                      placeholder="Enter Per Gram INR"
                      name="pergraminr"
                      value={PerGramInr}
                      error={PerGramInrErr.length > 0 ? true : false}
                      helperText={PerGramInrErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
                </>
              )}
              {SelectedValue === "PER" && (
                <>
                  <div className="add-textfiled error-errer">
                    <p>Per Gram %</p>
                    <TextField
                      placeholder="Enter Per Gram %"
                      name="pergram%"
                      value={PerGrampercentage}
                      error={PerGrampercentageErr.length > 0 ? true : false}
                      helperText={PerGrampercentageErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
                </>
              )}
              {SelectedValue === "PCS" && (
                <>
                  <div className="add-textfiled error-errer">
                    <p>Per Pcs</p>
                    <TextField
                      placeholder="Enter Per Pcs"
                      name="pcs"
                      value={pcs}
                      error={pcsErr.length > 0 ? true : false}
                      helperText={pcsErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </div>
                </>
              )}
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  // className=" mx-auto"
                  id="btn-save"
                  onClick={(e) => handleFormSubmit(e)}
                  disabled={SelectedValue == ""}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default MakingChargesRetailer;

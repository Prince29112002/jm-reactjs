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

const MortgageInterestSetting = (props) => {
  const [SelectedValue, setSelectedValue] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    NavbarSetting("Master-Retailer", dispatch);
  }, []);

  useEffect(() => {
    getInterestRateApi();
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  function getInterestRateApi() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "retailerProduct/api/interestManage")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setSelectedValue(response.data.data[0].int_option);
          setSelectedId(response.data.data[0].id);
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
          api: "retailerProduct/api/interestManage",
        });
      });
  }

  function addInterestRateApi() {
    const body = {
      int_option: SelectedValue,
    };
    axios
      .put(
        Config.getCommonUrl() +
          `retailerProduct/api/interestManage/${selectedId}`,
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
          getInterestRateApi();
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
          api: `retailerProduct/api/interestManage/${selectedId}`,
          body: body,
        });
      });
  }
  function handleChange(event) {
    const { value } = event.target;
    console.log(event.target.value);
    const selectedValue = parseFloat(value);
    setSelectedValue(selectedValue);
  }
  function handleFormSubmit(e) {
    e.preventDefault();
    addInterestRateApi();
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
                    Interest Setting
                  </Typography>
                </FuseAnimate>
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll ">
              <Grid style={{ marginBottom: 10 }}>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                  style={{ display: "block" }}
                >
                  <RadioGroup
                    name="SelectedValue"
                    className={classes.group}
                    value={SelectedValue}
                    onChange={(e) => handleChange(e)}
                  >
                    <FormControlLabel
                      value={0}
                      control={<Radio />}
                      label="Default(Per Day)"
                    />
                    <FormControlLabel
                      value={1}
                      control={<Radio />}
                      label="Less than 15 days = 15 days interest ||
                      More than 15 days = 1 month interest"
                    />
                    <FormControlLabel
                      value={2}
                      control={<Radio />}
                      label="1 day out of 1 month then also take 1 month's interest"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  id="btn-save"
                  onClick={(e) => handleFormSubmit(e)}
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

export default MortgageInterestSetting;

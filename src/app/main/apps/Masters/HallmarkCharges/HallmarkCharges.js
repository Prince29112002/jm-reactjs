import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  searchBox: {
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
}));

const HallmarkCharges = (props) => {
  //   const theme = useTheme();

  const classes = useStyles();
  const dispatch = useDispatch();

  const [rateValue, setRateValue] = useState("");
  const [rateValueErr, setRateValueErr] = useState("");

  useEffect(() => {
    getHallmarkCharges();
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);

  const inputRef = React.useRef();

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current.focus();
    }, 800);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  function getHallmarkCharges() {
    axios
      .get(Config.getCommonUrl() + "api/goldRateToday/hallmarkcharges")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // setLedgerMainData(response.data.data);
          setRateValue(response.data.data.per_piece_charges);
        } else {
          dispatch(
            Actions.showMessage({
              message: "Today's Gold Rate is not set",
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/goldRateToday/hallmarkcharges",
        });
      });
  }

  function handleInputChange(event) {

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "rateValue") {
      setRateValue(value);
      setRateValueErr("");
    }
  }

  function rateValueValidation() {
    // const Regex = /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/;
    if (!rateValue || isNaN(Number(rateValue))) {
      setRateValueErr("Enter Valid Rate");
      return false;
    }
    return true;
  }

  const checkforUpdate = (evt) => {
    evt.preventDefault();
    if (rateValueValidation()) {
      addHallmarkCharges();
    }
  };

  function addHallmarkCharges() {
    axios
      .post(Config.getCommonUrl() + "api/goldRateToday/hallmarkcharges", {
        per_piece_charges: rateValue,
      })
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id
          // setRateValue("")
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          //   handleModalClose(true);
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
          api: "api/goldRateToday/hallmarkcharges",
          body: {
            per_piece_charges: rateValue,
          },
        });
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            <Grid
              className="jewellerypreturn-main"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: "0", marginBottom: "20px" }}
            >
              <Grid item xs={4} sm={4} md={4} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28  text-18 font-700">
                    Hallmark Charges
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>
            <div className="main-div-alll ">
              <div>
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                >
                  <div className="w-full flex flex-row flex-wrap  ">
                    <div className="add-textfiled">
                      <p className="mb-4">Hallmark Charges Per Piece</p>
                      <TextField
                        className=""
                        placeholder="Enter Hallmark Charges Per Piece"
                        name="rateValue"
                        value={rateValue}
                        error={rateValueErr.length > 0 ? true : false}
                        helperText={rateValueErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        inputRef={inputRef}
                        autoFocus
                      />
                    </div>
                    <div className="add-textfiled">
                      <Button
                        id="btn-save"
                        variant="contained"
                        color="primary"
                        className="w-128 mx-auto mt-20 float-left"
                        onClick={(e) => checkforUpdate(e)}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default HallmarkCharges;

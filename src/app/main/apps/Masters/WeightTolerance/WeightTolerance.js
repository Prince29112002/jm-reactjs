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
import Loader from "app/main/Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const LotWgtVariation = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [taggingVariation, setTaggingVariation] = useState("");
  const [taggingVariationErr, setTggingVariationErr] = useState("");

  const [stoneVariation, setStoneVariation] = useState("");
  const [stoneVarErr, setStoneVarErr] = useState("");

  const [findingVariation, setFindingVariation] = useState("");
  const [findVarErr, setFindVarErr] = useState("");

  const [toleranceVariation, setToleranceVariation] = useState("");
  const [toleranceVarErr, setToleranceVarErr] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  useEffect(() => {
    getAllVariations();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);

  function getAllVariations() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/lotWeightVariation")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let data = response.data.data[0];

          setTaggingVariation(data.tagging_lot_variation);
          setStoneVariation(data.stone_variation);
          setFindingVariation(data.findings_variation);
          setToleranceVariation(data?.casting_tolerance_rate);
          setLoading(false);
        } else {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "api/lotWeightVariation" });
      });
  }

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "taggingVariation") {
      setTaggingVariation(value);
      setTggingVariationErr("");
    } else if (name === "stoneVariation") {
      setStoneVariation(value);
      setStoneVarErr("");
    } else if (name === "findingVariation") {
      setFindingVariation(value);
      setFindVarErr(""); 
    } else if (name === "toleranceVariation") {
      setToleranceVariation(value);
      setToleranceVarErr("");
    }
  };

  function validate() {
    const regex = /^(100(\.0{1,2})?|[1-9]?\d(\.\d{1,2})?)$/;
    let Error = false;
    if (taggingVariation !== "") {
      if (!taggingVariation || regex.test(taggingVariation) === false) {
        setTggingVariationErr("Enter Valid Lot weight variation");
        // return false;
        Error = true;
      }
    }

    if (stoneVariation !== "") {
      if (!stoneVariation || regex.test(stoneVariation) === false) {
        setStoneVarErr("Enter Valid Stone Variation");
        // return false;
        Error = true;
      }
    }

    if (findingVariation !== "") {
      if (!findingVariation || regex.test(findingVariation) === false) {
        setFindVarErr("Enter Valid Findings Variation");
        // return false;
        Error = true;
      }
    }

    if(toleranceVariation !== "" ) {
      if (!toleranceVariation || !/^(\d{1,2}(\.\d+)?|100)$/.test(toleranceVariation) || 
         toleranceVariation < 1 || toleranceVariation > 100) {
           setToleranceVarErr("Enter Valid Tolerance Variation between 1-100")
           // return false;
           Error = true;
    }
  }

    return Error === true ? false : true;
  }

  const formsubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      callAddLotVariant();
    }
  };

  function callAddLotVariant() {
    setLoading(true);

    if (
      taggingVariation === "" &&
      stoneVariation === "" &&
      findingVariation === "" && 
      toleranceVariation === ""
    ) {
      return;
    }

    const body = {
      tagging_lot_variation: taggingVariation,
      stone_variation: stoneVariation,
      findings_variation: findingVariation,
      casting_tolerance_rate : toleranceVariation,
    };
    axios
      .post(Config.getCommonUrl() + "api/lotWeightVariation", body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        } else {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {api: "api/lotWeightVariation",body: body});
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: "0px 0px 20px 0px" }}
            >
              <Grid item xs={6} sm={5} md={5} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Weight Tolerance
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

         
            </Grid>
            {loading && <Loader />}

            <div className="main-div-alll ">
              {/* {JSON.stringify(contDetails)} */}
              <div >
                <form
                  name="registerForm"
                  noValidate
                  className="flex flex-col justify-center w-full"
                  // onSubmit={handleFormSubmit}
                >
                  <div className="w-full flex flex-row flex-wrap" 
                  style={{display:"block"}}>

                 <div className="add-textfiled">
                  <p>Tagging lot variation in %*</p>
                  <TextField
                    className=""
                    placeholder="Enter Tagging Lot Variation in %"
                    name="taggingVariation"
                    value={taggingVariation}
                    error={taggingVariationErr.length > 0 ? true : false}
                    helperText={taggingVariationErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                  />
                  </div>

                  <div className="add-textfiled">
                    <p>Stone variation in %*</p>
                    <TextField
                      placeholder="Enter Stone Variation in %"
                      name="stoneVariation"
                      value={stoneVariation}
                      error={stoneVarErr.length > 0 ? true : false}
                      helperText={stoneVarErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                    </div>

                    <div className="add-textfiled">
                      <p>Findings variation in %*</p>
                      <TextField
                        className=""
                        placeholder="Enter Findings Variation in %"
                        name="findingVariation"
                        value={findingVariation}
                        error={findVarErr.length > 0 ? true : false}
                        helperText={findVarErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>

                    <div className="add-textfiled">
                      <p>Casting Tolerance Rate (1-100)*</p>
                      <TextField
                        className=""
                        placeholder="Enter Casting Tolerance Rate (1-100)"
                        name="toleranceVariation"
                        value={toleranceVariation}
                        error={toleranceVarErr.length > 0 ? true : false}
                        helperText={toleranceVarErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    </div>

                    <div className="add-textfiled">
                      <Button
                        id="btn-save"
                        variant="contained"
                        color="primary"
                        className="w-128 mx-auto mt-16 float-left"
                        onClick={(e) => formsubmit(e)}
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

export default LotWgtVariation;

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import axios from "axios";
import * as Actions from "app/store/actions";
import Config from "app/fuse-configs/Config";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Select, { createFilter } from "react-select";
import { TextField, Typography } from "@material-ui/core";
import moment from "moment";
import { FuseAnimate } from "@fuse";
import Loader from "../../../../../../Loader/Loader";
// "../../../../../../BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import History from "@history";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Icones from "assets/fornt-icons/Mainicons";

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
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  button1: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    // minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  searchBox: {
    padding: 6,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
}));

const CreateNewDesignJob = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [collectionList, setCollectionList] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedCollectionErr, setSelectedCollectionErr] = useState("");

  const [locationList, setLocationList] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedLocationErr, setSelectedLocationErr] = useState("");

  const [noOfDesigns, setNoOfDesigns] = useState("");
  const [noOfDesignsErr, setNoOfDesignsErr] = useState("");

  const [endDate, setEndDate] = useState("");
  const [endDateErr, setEndDateErr] = useState("");

  const [designDescriptiopns, setDesignDescriptiopns] = useState("");
  const [designDescriptiopnsErr, setDesignDescriptiopnsErr] = useState("");

  const [refImages, setRefImages] = useState(null);
  const [refImagesErr, setRefImagesErr] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    NavbarSetting("Design", dispatch);
  }, []);

  useEffect(() => {
    getCollectionList();
    getLocationList();
  }, [dispatch]);

  function getCollectionList() {
    axios
      .get(Config.getCommonUrl() + "api/designcollection")
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setCollectionList(res.data.data);
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/designcollection" });
      });
  }

  function getLocationList() {
    axios
      .get(Config.getCommonUrl() + "api/designerlocation")
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          setLocationList(res.data.data);
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/designerlocation" });
      });
  }

  const handleChangeCollection = (value) => {
    setSelectedCollection(value);
    setSelectedCollectionErr("");
  };

  const handleChangeLocation = (value) => {
    setSelectedLocation(value);
    setSelectedLocationErr("");
  };

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value ? e.target.value : e.target.files;

    const target = e.target;
    const endDateValue = target.type === "checkbox" ? target.checked : target.value;
    var today = moment().format("YYYY-MM-DD"); 

    if (name === "noOfDesigns" && !isNaN(value)) {
      setNoOfDesigns(value);
      setNoOfDesignsErr("");
    } else if (name === "endDate") {
      setEndDate(endDateValue);
      let dateVal = moment(endDateValue).format("YYYY-MM-DD"); //new Date(value);
      if (dateVal >= today ) {
        setEndDateErr("");
      } else {
        setEndDateErr("Enter Valid Date");
      }
    }
    // if (name === "endDate") {
    //   setEndDate(value);
    //   setEndDateErr("");
    // } 
    else if (name === "designDescriptiopns") {
      setDesignDescriptiopns(value);
      setDesignDescriptiopnsErr("");
    } else if (name === "refImages") {
      if(Config.checkFile(e.target.files,"image")){
      setRefImages(e.target.files);
      setRefImagesErr("");
    }else{
      dispatch(Actions.showMessage({ message: "Accept only image format" }));
      document.getElementById("fileinput").value = "";
    }
    }
  };
  const onKeyDown = (e) => {
    e.preventDefault();
  };

  function validateDesign() {
    if (noOfDesigns === "" || noOfDesigns === null) {
      setNoOfDesignsErr("Enter Number od design");
      return false;
    }
    return true;
  }

  function validateCollection() {
    if (selectedCollection === "" || selectedCollection === null) {
      setSelectedCollectionErr("Select Collection");
      return false;
    }
    return true;
  }

  function validateLocation() {
    if (selectedLocation === "" || selectedLocation === null) {
      setSelectedLocationErr("Select Designer Location");
      return false;
    }
    return true;
  }

  function validateDate() {
    if (endDate === "" || endDate === null) {
      setEndDateErr("Enter Date");
      return false;
    }
    return true;
  }

  // function validateImage(){
  //   if(refImages === "" || refImages === null){
  //     setRefImagesErr("Upload images");
  //     return false;
  //   }
  //   return true;
  // }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // History.push("/dashboard/design", { tab: 2, sub: 1, view: 1 });
    if(!event.detail || event.detail == 1){
    if (
      validateCollection() &&
      validateLocation() &&
      validateDate() &&
      validateDesign()
    ) {
      const formData = new FormData();
      if (refImages) {
        for (let i = 0; i < refImages.length; i++) {
          formData.append("files", refImages[i]);
        }
      }
      callAddDesignJob(formData);
      // History.push("/dashboard/design", { tab: 2, sub: 1, view: 1 });
    }}
  };

  function callAddDesignJob(formData) {
    formData.append(
      "design_collection_id",
      selectedCollection.value.toString()
    );
    formData.append("no_of_design", noOfDesigns);
    formData.append("end_date", endDate);
    formData.append("designer_location_id", selectedLocation.value.toString());
    formData.append("description", designDescriptiopns);

    axios
      .post(Config.getCommonUrl() + "api/designjob/reference/image", formData)
      .then((response) => {
        console.log(response);
        if (response.data.success) {

          dispatch(
            Actions.showMessage({
              message: "New job added successfully",
              variant: "success",
            })
          );
          History.push("/dashboard/design", { tab: 2, sub: 1, view: 1 });
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
          api: "api/designjob/reference/image",
          body: JSON.stringify(formData),
        });
      });
  }

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={6} sm={5} md={5} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Create New Design job
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
              {loading && <Loader />}
              {/* <Grid item xs={6} sm={7} md={7} key="2"
                style={{ textAlign: "right" }}
              >
                <Button id="voucher-list-btn"
                  variant="contained"
                  className={classes.button1}
                  size="small"
                  onClick={() => History.push(`/dashboard/design`, { view: 1, sub: 1, tab: 2, })}
                >
                  Back
                </Button>
              </Grid> */}
              <Grid item xs={6} sm={7} md={7} key="2">
                <div className="btn-back">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    size="small"
                    onClick={() =>
                      History.push(`/dashboard/design`, {
                        view: 1,
                        sub: 1,
                        tab: 2,
                      })
                    }
                  >
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>
            <div className="main-div-alll">
              <div className="pb-16 packing-full-width-input mt-16">
                <Grid container>
                  <Grid
                    item
                    lg={2}
                    md={6}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>Select collection name</label>
                    <Select
                      className="mt-1"
                      classes={classes}
                      styles={selectStyles}
                      options={collectionList.map((group) => ({
                        value: group.id,
                        label: group.name,
                      }))}
                      autoFocus
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={selectedCollection}
                      onChange={handleChangeCollection}
                      placeholder="Select collection name"
                    />
                    <span style={{ color: "red" }}>
                      {selectedCollectionErr.length > 0
                        ? selectedCollectionErr
                        : ""}
                    </span>
                  </Grid>

                  <Grid
                    item
                    lg={2}
                    md={6}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>Select designer location name</label>
                    <Select
                      className="mt-1"
                      classes={classes}
                      styles={selectStyles}
                      options={locationList.map((group) => ({
                        value: group.id,
                        label: group.location,
                      }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={selectedLocation}
                      onChange={handleChangeLocation}
                      placeholder="Select designer location name"
                    />
                    <span style={{ color: "red" }}>
                      {selectedLocationErr.length > 0
                        ? selectedLocationErr
                        : ""}
                    </span>
                  </Grid>

                  <Grid
                    item
                    lg={2}
                    md={6}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>End Date</label>
                    <TextField
                      className="mt-1"
                      type="date"
                      placeholder="End Date"
                      name="endDate"
                      value={endDate}
                      error={endDateErr.length > 0 ? true : false}
                      helperText={endDateErr}
                      onChange={(e) => handleInputChange(e)}
                      // onKeyDown={onKeyDown}
                      variant="outlined"
                      fullWidth
                      inputProps={{
                        max: moment().format("YYYY-MM-DD"),
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid
                    item
                    lg={3}
                    md={6}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>No of design</label>
                    <TextField
                      className="mt-1"
                      placeholder=" Enter no of design"
                      name="noOfDesigns"
                      value={noOfDesigns}
                      error={noOfDesignsErr.length > 0 ? true : false}
                      helperText={noOfDesignsErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  <Grid item lg={3} md={6} sm={6} xs={6} className="p-8">
                    <label>Reference images</label>
                    <TextField
                      placeholder="Enter reference images"
                      type="file"
                      inputProps={{
                        multiple: true,
                      accept:".jpeg,.png,.jpg",
                      }}
                      name="refImages"
                      error={refImagesErr.length > 0 ? true : false}
                      helperText={refImagesErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item lg={9} md={6} sm={6} xs={6}>
                    <label>Design description</label>
                    <TextField
                      className="mt-1"
                      placeholder="Enter design description"
                      name="designDescriptiopns"
                      value={designDescriptiopns}
                      error={designDescriptiopnsErr.length > 0 ? true : false}
                      helperText={designDescriptiopnsErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                      multiline
                    />
                  </Grid>

                  <Grid item lg={3} md={6} sm={6} xs={6} className="p-8">
                    <Button
                      id="btn-save"
                      variant="contained"
                      className="w-128 mx-auto mt-36 float-right"
                      onClick={(e) => handleFormSubmit(e)}
                    >
                      SAVE
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default CreateNewDesignJob;

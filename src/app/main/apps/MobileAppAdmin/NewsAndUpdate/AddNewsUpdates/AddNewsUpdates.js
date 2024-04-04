import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import moment from "moment";
import History from "@history";
import Loader from "app/main/Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
  selectBox: {
    // marginTop: 8,
    padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    // marginLeft: 15,
  },
  horiDiv: {
    float: "left",
    clear: "none",
    // width: '45%'
  },
}));

const AddNewsUpdates = (props) => {
  const propsData = props.location.state;
  const classes = useStyles();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [updtDate, setUpdtDate] = useState("");
  const [updtDateErr, setUpdtDateErr] = useState("");

  const [title, setTitle] = useState("");
  const [titleErr, setTitleErr] = useState("");

  const [mediaType, setMediaType] = useState("");
  const [mTypeErr, setMTypeErr] = useState("");

  const [shortDesc, setShortDesc] = useState("");
  const [shortDescErr, setShortDescErr] = useState("");

  const [description, setDescription] = useState("");
  const [descErr, setDescErr] = useState("");

  const [videoUrl, setVideoUrl] = useState("");
  const [videoUrlErr, setVideoUrlErr] = useState("");
  const [uplodVideoFile, setUplodVideoFile] = useState(null);
  const [uplodVideoFileErr, setUplodVideoFileErr] = useState("");
  const [uplodedvideoUrl, setUplodedVideoUrl] = useState("");

  const [imageUploadFile, setImageUploadFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imgErr, setImgErr] = useState("");

  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    if (propsData !== undefined) {
      setIsView(propsData.isViewOnly);
      setIsEdit(propsData.isEdit);
      GetOneNewsUpdt(propsData.row.id);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  function GetOneNewsUpdt(id) {
    axios
      .get(Config.getCommonUrl() + "api/newsAndUpdates/" + id)
      .then(function (response) {
        if (response.data.success === true) {
          var data = response.data.data;
          // setOneData(data)
          setTitle(data.title);
          setMediaType(data.media_type.toString());
          setShortDesc(data.shortDesc);
          setDescription(data.description);

          setUpdtDate(moment(new Date(data.date)).format("YYYY-MM-DD"));

          if (data.media_type === 0) {
            setVideoUrl(data.videoOrImageUrl);
          }
          if (data.media_type === 1) {
            setImageUrl(data.videoOrImageUrl);
          }
          if (data.media_type === 2) {
            setUplodedVideoUrl(data.videoOrImageUrl);
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
        handleError(error, dispatch, { api: "api/newsAndUpdates/" + id });
      });
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("YYYY-MM-DD"); //new Date();

    if (name === "updtDate") {
      setUpdtDate(value);
      // today.setHours(0,0,0,0);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      if (dateVal <= today && minDateVal < dateVal) {
        setUpdtDateErr("");
      } else {
        setUpdtDateErr("Enter Valid Date");
      }
    }

    // if (name === "updtDate") {
    //   setUpdtDateErr("");
    //   setUpdtDate(value);
    // }
    else if (name === "title") {
      setTitle(value);
      setTitleErr("");
    } else if (name === "shortDesc") {
      setShortDesc(value);
      setShortDescErr("");
    } else if (name === "description") {
      setDescription(value);
      setDescErr("");
    } else if (name === "videoUrl") {
      setVideoUrl(value);
      setVideoUrlErr("");
    }
  }

  function dateValidation() {
    // var Regex = /^[a-zA-Z\s]*$/;
    if (updtDate === "") {
      setUpdtDateErr("Enter Date");
      return false;
    }
    return true;
  }

  function titleValidation() {
    // var Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    // if (!title || Regex.test(title) === false) {
    if (title === "") {
      setTitleErr("Enter Title");
      return false;
    }
    return true;
  }

  function shortDescValidation() {
    // var Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (shortDesc === "") {
      setShortDescErr("Enter Short Description");
      return false;
    }

    return true;
  }

  function descValidation() {
    // var Regex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (description === "") {
      setDescErr("Enter Description");
      return false;
    }

    return true;
  }

  function videoUrlValidation() {
    // var re = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/
    // var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
    if (videoUrl === "") {
      setVideoUrlErr("Enter Youtube Video Url");
      return false;
    }

    return true;
  }

  function imageValidation() {
    if (imageUploadFile === null) {
      setImgErr("Please Select Image to Upload");
      return false;
    }
    return true;
  }

  function videoUploadValidation() {
    if (uplodedvideoUrl === "") {
      setUplodVideoFileErr("Upload Video file");
      return false;
    }
    return true;
  }

  function mTypeValidation() {
    if (mediaType === "") {
      setMTypeErr("Please Select Media Type");
      return false;
    }
    return true;
  }

  function extaintionValidate(file) {
    var reg = /(.*?)\.(jpg|jpeg|png)$/;
    if (!reg.test(file.name)) {
      return false;
    }
    return true;
  }

  function setImages(imgFile) {
    if (extaintionValidate(imgFile)) {
      setImageUrl(URL.createObjectURL(imgFile));
      setImageUploadFile(imgFile);
    } else {
      dispatch(
        Actions.showMessage({
          message: "Accept only .jpg, .png, or .jpeg files.",
        })
      );
    }
  }

  function isVideoFile(fileName) {
    console.log(fileName);
    const videoFileRegex = /\.(mp4|mov|avi|mkv|wmv|flv|webm)$/;
    return videoFileRegex.test(fileName.name.toLowerCase());
  }

  const uploadVideoHandle = (e) => {
    if (isVideoFile(e.target.files[0])) {
      setUplodVideoFile(e.target.files[0]);
      setUplodVideoFileErr("");
      const videoUrl = URL.createObjectURL(e.target.files[0]);
      console.log(videoUrl, "666");
      setUplodedVideoUrl(videoUrl);
    } else {
      dispatch(
        Actions.showMessage({
          message: "Accept only mp4|mov|avi|mkv|wmv|flv|webm format files.",
        })
      );
    }
  };
  function handleFormSubmit(ev) {
    ev.preventDefault();
    // resetForm();

    if (
      dateValidation() &&
      titleValidation() &&
      mTypeValidation() &&
      shortDescValidation() &&
      descValidation()
    ) {
      if (mediaType === "1") {
        //image
        if (isEdit === true) {
          updateNewsUpdtApi();
        } else {
          if (imageValidation()) {
            AddNewsUpdtApi();
          }
        }
      } else if (mediaType === "0") {
        //video
        if (videoUrlValidation()) {
          if (isEdit === true) {
            updateNewsUpdtApi();
          } else {
            AddNewsUpdtApi();
          }
        }
      } else if (mediaType.value === 2) {
        //video - upload
        if (videoUploadValidation()) {
          if (isEdit === true) {
            updateVideoApi();
          } else {
            AddNewsUploadVdApi();
          }
        }
      }
    }
  }
  function updateVideoApi() {
    setLoading(true);
    const formData = new FormData();
    formData.append("video", uplodVideoFile ? uplodVideoFile : uplodedvideoUrl);
    formData.append("date", updtDate);
    formData.append("title", title);
    formData.append("media_type", mediaType.value);
    formData.append("shortDesc", shortDesc);
    formData.append("description", description);
    axios
      .put(
        Config.getCommonUrl() + "api/newsandupdates/video/" + propsData.row.id,
        formData
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
          History.goBack();
        } else {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/newsandupdates/video/" + propsData.row.id,
          body: JSON.stringify(formData),
        });
      });
  }
  function AddNewsUploadVdApi() {
    setLoading(true);
    const formData = new FormData();
    formData.append("video", uplodVideoFile);
    formData.append("date", updtDate);
    formData.append("title", title);
    formData.append("media_type", mediaType.value);
    formData.append("shortDesc", shortDesc);
    formData.append("description", description);
    axios
      .post(Config.getCommonUrl() + "api/newsandupdates/video", formData)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
          History.goBack();
        } else {
          setLoading(false);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/newsandupdates/video",
          body: JSON.stringify(formData),
        });
      });
  }

  function updateNewsUpdtApi() {
    setLoading(true);
    const formData = new FormData();
    if (mediaType === "1") {
      formData.append("image", imageUploadFile);
    } else if (mediaType === "0") {
      formData.append("videoOrImageUrl", videoUrl);
    }

    formData.append("date", updtDate);
    formData.append("title", title);
    formData.append("media_type", Number(mediaType));
    formData.append("shortDesc", shortDesc);
    formData.append("description", description);

    axios
      .put(
        Config.getCommonUrl() + "api/newsandupdates/" + propsData.row.id,
        formData
      )
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data.id
          setLoading(false);

          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          // History.push("/dashboard/masters/clients");
          History.goBack();
        } else {
          setLoading(false);

          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch((error) => {
        setLoading(false);

        handleError(error, dispatch, {
          api: "api/newsandupdates/" + propsData.row.id,
          body: JSON.stringify(formData),
        });
      });
  }

  function hangleMTypeChange(e) {
    let value = e.target.value;
    setMediaType(value);
    setMTypeErr("");
  }

  function AddNewsUpdtApi() {
    setLoading(true);
    const formData = new FormData();
    if (mediaType === "1") {
      formData.append("image", imageUploadFile);
    } else if (mediaType === "0") {
      formData.append("videoOrImageUrl", videoUrl);
    }

    formData.append("date", updtDate);
    formData.append("title", title);
    formData.append("media_type", Number(mediaType));
    formData.append("shortDesc", shortDesc);
    formData.append("description", description);

    axios
      .post(Config.getCommonUrl() + "api/newsandupdates", formData)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // response.data.data
          // setGoldColor("");
          setLoading(false);

          History.goBack(); //.push("/dashboard/masters/vendors");

          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        } else {
          setLoading(false);

          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        }
      })
      .catch((error) => {
        setLoading(false);

        handleError(error, dispatch, {
          api: "api/newsandupdates",
          body: JSON.stringify(formData),
        });
      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    {isEdit
                      ? "Edit News & Updates"
                      : "Add News & Updates"
                      ? isView
                        ? "View News & Updates"
                        : "Add News & Updates"
                      : "Add News & Updates"}
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              ></Grid>
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll ">
              <div>
                <Grid
                  className="department-main-dv"
                  container
                  spacing={4}
                  alignItems="stretch"
                  style={{ margin: 0 }}
                >
                  <Grid
                    className="department-main-dv"
                    container
                    spacing={4}
                    alignItems="stretch"
                    style={{ margin: 0 }}
                  >
                    <Grid
                      item
                      xs={3}
                      sm={3}
                      md={3}
                      key="1"
                      style={{ paddingLeft: "0px" }}
                    >
                      <div>Date*</div>

                      <TextField
                        // className="mt-16"
                        // label="Date"
                        name="updtDate"
                        value={updtDate}
                        type="date"
                        variant="outlined"
                        fullWidth
                        error={updtDateErr.length > 0 ? true : false}
                        helperText={updtDateErr}
                        onChange={(e) => handleInputChange(e)}
                        inputProps={{
                          max: moment().format("YYYY-MM-DD"),
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={isView}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sm={3}
                      md={3}
                      key="2"
                      style={{ paddingLeft: "0px" }}
                    >
                      {/* <div>Expiry Date</div> */}
                      <div>Title*</div>

                      <TextField
                        // className="mt-16"
                        // label="Title"
                        name="title"
                        value={title}
                        error={titleErr.length > 0 ? true : false}
                        helperText={titleErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        disabled={isView}
                        placeholder="Select"
                      />
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sm={3}
                      md={3}
                      key="3"
                      style={{ paddingLeft: "0px" }}
                    >
                      <div>Media*</div>

                      <select
                        name="mediaType"
                        className={classes.selectBox}
                        value={mediaType}
                        disabled={isView}
                        onChange={(e) => {
                          hangleMTypeChange(e);
                        }}
                        style={{ height: "36px" }}
                        placeholder="Select"
                      >
                        <option hidden value="">
                          Select Media Type
                        </option>
                        <option value="0">Video - URL</option>
                        <option value="1">Image</option>
                        <option value="2">Video - Upload</option>
                      </select>

                      <span style={{ color: "red" }}>
                        {mTypeErr.length > 0 ? mTypeErr : ""}
                      </span>
                    </Grid>

                    <Grid
                      item
                      xs={3}
                      sm={3}
                      md={3}
                      key="5"
                      style={{ paddingLeft: "0px" }}
                    >
                      <div>Short description*</div>

                      <TextField
                        // className="mt-16"
                        // label="Short Description (Max 150 Characters)"
                        name="shortDesc"
                        value={shortDesc}
                        error={shortDescErr.length > 0 ? true : false}
                        helperText={shortDescErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        inputProps={{ maxLength: 150 }}
                        disabled={isView}
                        placeholder="Enter short description"
                      />
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      sm={6}
                      md={6}
                      key="4"
                      style={{ paddingLeft: "0px" }}
                    >
                      <div>Description*</div>

                      <TextField
                        // className="mt-16 mr-2"
                        style={{ paddingLeft: "0px" }}
                        // label="Description"
                        name="description"
                        value={description}
                        error={descErr.length > 0 ? true : false}
                        helperText={descErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        required
                        fullWidth
                        multiline
                        minRows={4}
                        maxrows={4}
                        disabled={isView}
                        placeholder="Enter description"
                      />
                    </Grid>

                    {mediaType === "1" && (
                      <Grid
                        item
                        xs={6}
                        sm={6}
                        md={6}
                        key="6"
                        style={{ paddingLeft: "0px" }}
                      >
                        <div>Image*</div>

                        <div className={classes.horiDiv}>
                          <Button
                            variant="contained"
                            component="span"
                            id="btn-save"
                            disabled={isView}
                          >
                            <label htmlFor="contained-button-file">
                              <input
                                id="contained-button-file"
                                type="file"
                                style={{ display: "none" }}
                                onChange={(event) => {
                                  setImageUploadFile(event.target.files[0]);
                                  setImageUrl(
                                    URL.createObjectURL(event.target.files[0])
                                  );
                                  setImgErr("");
                                }}
                                accept="image/*"
                              />
                              Browse
                            </label>
                          </Button>
                        </div>
                        <div
                          className={classes.horiDiv}
                          style={{ marginLeft: "5%" }}
                        >
                          {/* {imageUploadFile !== null ? imageUploadFile.name : ""} */}
                          {imageUrl !== "" && (
                            <img
                              src={imageUrl}
                              style={{ width: "200px", height: "200px" }}
                              alt=""
                            />
                          )}
                        </div>

                        <span style={{ color: "red", marginLeft: "5%" }}>
                          {imgErr.length > 0 ? imgErr : ""}
                        </span>
                      </Grid>
                    )}

                    {mediaType === "0" && (
                      <Grid
                        item
                        xs={6}
                        sm={6}
                        md={6}
                        key="6"
                        style={{ paddingLeft: "0px" }}
                      >
                        <div>Video URl*</div>
                        <TextField
                          // className="mt-16"
                          // label="Video URL"
                          name="videoUrl"
                          value={videoUrl}
                          error={videoUrlErr.length > 0 ? true : false}
                          helperText={videoUrlErr}
                          onChange={(e) => handleInputChange(e)}
                          variant="outlined"
                          required
                          fullWidth
                          disabled={isView}
                          placeholder="Video url"
                        />
                        {/* <div>Only MP4 Files Allowed</div> */}
                      </Grid>
                    )}

                    {mediaType === "2" && (
                      <Grid
                        item
                        xs={6}
                        sm={6}
                        md={6}
                        key="6"
                        style={{ paddingLeft: "0px" }}
                      >
                        <div>Video*</div>
                        <div
                          // className={classes.horiDiv}
                          className={classes.horiDiv}
                        >
                          <Button
                            variant="contained"
                            component="span"
                            id="btn-save"
                            style={{
                              backgroundColor: "#415bd4 !important",
                              color: "#ffffff !important",
                            }}
                            disabled={isView}
                          >
                            <label htmlFor="contained-button-file">
                              <input
                                id="contained-button-file"
                                type="file"
                                style={{ display: "none" }}
                                onChange={uploadVideoHandle}
                                accept="video/*"
                              />
                              Upload video
                            </label>
                          </Button>
                        </div>
                        {/* <div>Only MP4 Files Allowed</div> */}
                      </Grid>
                    )}
                  </Grid>

                  {/* </Grid> */}
                </Grid>

                <div>
                  <Button
                    id="btn-save"
                    variant="contained"
                    color="primary"
                    style={{ float: "right" }}
                    className="mx-auto mt-16 ml-16"
                    aria-label="Register"
                    hidden={isView}
                    // type="submit"
                    onClick={(e) => {
                      handleFormSubmit(e);
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    id="btn-save"
                    style={{ float: "right" }}
                    className="mx-auto mt-16  "
                    aria-label="Register"
                    //   disabled={!isFormValid()}
                    // type="submit"
                    onClick={(e) => History.goBack()}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddNewsUpdates;

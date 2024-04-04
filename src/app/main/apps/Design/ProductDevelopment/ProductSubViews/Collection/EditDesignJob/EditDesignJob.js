import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
// "../../../../../../BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import Modal from "@material-ui/core/Modal";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as authActions from "app/auth/store/actions";
import * as Actions from "app/store/actions";
import {
  TextField,
  ImageListItemBar,
  Icon,
  IconButton,
  ImageListItem,
  ImageList,
  Box,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import History from "@history";
import { Typography } from "@material-ui/core";
import Select, { createFilter } from "react-select";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Loader from "../../../../../../Loader/Loader";
import LoaderPopup from "../../../../../../Loader/LoaderPopup";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import moment from "moment";
import { useReactMediaRecorder } from "react-media-recorder";
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
    backgroundColor: "#1FD319",
    color: "white",
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
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  imgBox: {
    width: "200px",
    height: "200px",
    borderRadius: "7px",
  },
  audioBox: {
    padding: "10px",
    borderRadius: "30px",
  },
  button3: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#707070",
    color: "white",
    float: "right",
  },
  searchBox: {
    padding: 6,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
}));

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const EditDesignJob = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDesigner = localStorage.getItem("isDesigner");
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [noOfdesign, setNoOfdesign] = useState("");
  const [designerName, setDesignerName] = useState("");
  const [designerNameId, setDesignerNameId] = useState("");
  const [imgArr, setImageArr] = useState([]);
  const [refImgArr, setRefImgArr] = useState([]);

  const [refImages, setRefImages] = useState(null);
  const [refImagesErr, setRefImagesErr] = useState("");
  const [editId,setEditId] = useState("")

  const [totalDesign, setTotalDesign] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [designDataId, setDesigndataId] = useState("");
  const [designData, setDesigndata] = useState("");
  const [closeJobModal, setCloseJobModal] = useState(false);
  const [commentMsg, setCommentMsg] = useState("");
  const [recordings, setRecordings] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

  useEffect(() => {
    if (props.location.state) {
      const id = props.location.state.id;
      const view = props.location.state.isViewOnly;
      setEditId(id)
      setIsViewOnly(view);
      getDataForEdit(id);
    } else {
      History.push("/dashboard/design", { view: 1, sub: 1, tab: 2 });
    }
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Design", dispatch);
  }, []);

  useEffect(() => {
    if (modalOpen) {
      getCommentData();
    }
  }, [modalOpen]);

  function getCommentData() {
    setModalLoading(true);
    axios
      .get(
        Config.getCommonUrl() +
          `api/designjobreceive/all-comment/${designDataId}`
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          const apiData = response.data.data;
          setDesigndata(apiData);
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
          api: `api/designjobreceive/all-comment/${designDataId}`,
        });
      });
    setModalLoading(false);
  }

  function getDataForEdit(id) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/designjobreceive/receive/one/${id}`)
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const apiData = res.data;
          setCollectionName(apiData.data.name);
          setJobNumber(apiData.data.number);
          setTotalDesign(apiData.data.no_of_design);
          setNoOfdesign(apiData.data.receive_images);
          setImageArr(apiData.DesignJobReceiveData);
          setDesignerName(
            apiData.data.EmployeeName ? apiData.data.EmployeeName.username : ""
          );
          setDesignerNameId(
            apiData.data.EmployeeName ? apiData.data.EmployeeName.id : ""
          );
          setRefImgArr(apiData.data.RefImageFile);
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/designjobreceive/receive/one/${id}`,
        });
      });
  }

  const handleCloseJob = () => {
    if (jobNumber) {
      axios.put(Config.getCommonUrl() + `api/designjobreceive/close/${editId}`)

        .then((response) => {
          console.log(response);
          if (response.data.success) {
            dispatch(
              Actions.showMessage({
                message: "Close Job successfully",
                variant: "success",
              })
            );
            History.push("/dashboard/design", { view: 1, sub: 1, tab: 2 });
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
          handleError(error, dispatch, { api: `api/designjobreceive/close/${editId}` })

        });
    }
  };
  const handleApproveReject = (Did, data) => {
    axios.put(Config.getCommonUrl() + `api/designjobreceive/approve/reject/${editId}/${Did}?approve=${data}`)
    .then((response) => {
      console.log(response);
      if (response.data.success) {
        dispatch(Actions.showMessage({ message: response.data.message,variant:"success"}));
        getDataForEdit(editId)
      } else {
        dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
      }
    })
    .catch((error) => {
      handleError(error, dispatch, { api: `api/designjobreceive/approve/reject/${editId}/${Did}?approve=${data}`})
    })
  }

  const handleCloseModal = () => {
    setModalOpen(false);
    setRecordings(false);
    setCommentMsg("");
    setDesigndataId("");
    setDesigndata("");
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentMsg || mediaBlobUrl) {
      if (mediaBlobUrl) {
        handleSave();
      } else {
        addCommentApi();
      }
    }
  };

  const handleSave = async () => {
    const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
    const audioFile = new File([audioBlob], "voice.wav", { type: "audio/wav" });

    addCommentApi(audioFile); // sending to the server
  };

  function addCommentApi(audioFile) {
    setLoading(true);
    const adminDesignerId = isDesigner === "true" ? 2 : 1;
    const formData = new FormData(); // preparing to send to the server
    formData.append("file", audioFile); // preparing to send to the server
    formData.append("comment", commentMsg);
    formData.append("admin_worker", adminDesignerId);
    axios
      .post(
        Config.getCommonUrl() + `api/designjobreceive/comment/${designDataId}`,
        formData
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setModalOpen(false);
          setRecordings(false);
          setCommentMsg("");
          setDesigndataId("");
          setDesigndata("");
          getDataForEdit(editId)
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
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
          api: `api/designjobreceive/comment/${designDataId}`,
          body: JSON.stringify(formData),
        });
      });
    setLoading(false);
  }

  function validateImage() {
    if (refImages === "" || refImages === null) {
      setRefImagesErr("Upload Design");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (validateImage()) {
      const formData = new FormData();
      for (let i = 0; i < refImages.length; i++) {
        formData.append("files", refImages[i]);
      }
      callUploadDesign(formData);
    }
  };

  function callUploadDesign(formData) {
    setLoading(true);
    formData.append("admin_id", designerNameId);

    axios
      .post(
        Config.getCommonUrl() +
          `api/designjobreceive/receive/image/${jobNumber}`,
        formData
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          getDataForEdit(editId)
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/designjobreceive/receive/image/${jobNumber}`,
          body: JSON.stringify(formData),
        });
      });
  }
  const handleInputChange = (e) => {
    const name = e.target.name;

    if (name === "refImages") {
      if(Config.checkFile(e.target.files,"image")){
        setRefImages(e.target.files);
        setRefImagesErr("");    
      }else{
        dispatch(Actions.showMessage({ message: "Accept only image format" }));
        document.getElementById("fileinput").value = "";
      }
    } 
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div
            className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20"
            style={{ height: "calc(100vh - 100px)", overflowX: "hidden" }}
          >
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Design Job
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> <b>{jobNumber}</b> */}
              </Grid>
              {loading && <Loader />}
              <Grid
                item
                xs={12}
                sm={4}
                md={9}
                key="2"
                style={{ textAlign: "right" }}
              >
                <div className="btn-back mt-2">
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
                {/* <Button id="voucher-list-btn"
                  variant="contained"
                  className={classes.button1}
                  size="small"
                  onClick={() => History.push(`/dashboard/design`, { view: 1, sub: 1, tab: 2 })}
                >
                  Back
                </Button> */}
              </Grid>
            </Grid>
            <div className="main-div-alll">
              <div className="pb-8 mt-8">
                <Grid container spacing={3}>
                  <Grid item xs={2} lg={2} style={{ padding: 5 }}>
                    <label>Collection name</label>
                    <TextField
                      className="mt-1"
                      placeholder="Collection Name"
                      name="collectionName"
                      value={collectionName}
                      variant="outlined"
                      disabled
                      fullWidth
                    />
                  </Grid>

                  <Grid item xs={2} lg={2} style={{ padding: 5 }}>
                    <label>Job number</label>
                    <TextField
                      className="mt-1"
                      placeholder="Job Number"
                      name="jobNumber"
                      value={jobNumber}
                      disabled
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>

                  {/* <Grid item xs={2} style={{ padding: 5 }}>
                  <TextField
                    className="mt-16"
                    label="Designer Name"
                    value={designerName}
                    disabled
                    variant="outlined"
                    fullWidth
                  />
                </Grid> */}

                  <Grid item xs={1} lg={2} style={{ padding: 5 }}>
                    <label>No of design</label>
                    <TextField
                      className="mt-1"
                      placeholder="No of design"
                      name="noOfdesign"
                      value={noOfdesign}
                      disabled
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={1} style={{ paddingTop: 35 }}>
                    <b> / {totalDesign}</b>
                  </Grid>

                  {isDesigner === "true" && (
                    <>
                      <Grid
                        item
                        xs={2}
                        lg={3}
                        hidden={isViewOnly}
                        style={{ padding: 5 }}
                      >
                        <label>Upload design</label>
                        <TextField
                          className="mt-1"
                          placeholder="Upload design"
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
                      <Grid item xs={2} lg={2} style={{ padding: 1 }}>
                        <Button
                          className="mt-10 float-right"
                          id="btn-save"
                          variant="contained"
                          color="primary"
                          // className="w-full mx-auto mt-16"
                          // // size="small"
                          // style={{
                          //   backgroundColor: "#1761FD",
                          //   border: "none",
                          //   color: "white",
                          // }}
                          onClick={(e) => handleFormSubmit(e)}
                          hidden={isViewOnly}
                        >
                          UPLOAD
                        </Button>
                      </Grid>
                    </>
                  )}

                  {isDesigner !== "true" && (
                    // <Grid item xs={2} lg={4} style={{ padding: 5 }}>
                    //     <Button
                    //       id="btn-save"
                    //     variant="contained"
                    //     color="primary"
                    //     // className="w-full mx-auto mt-16"
                    //     // // size="small"
                    //     // style={{
                    //     //   backgroundColor: "#1761FD",
                    //     //   border: "none",
                    //     //   color: "white",
                    //     // }}
                    //     onClick={(e) => handleFormSubmit(e)}
                    //     hidden={isViewOnly}
                    //   >
                    //     UPLOAD
                    //   </Button>
                    // </Grid>
                    // :
                    <>
                     {/*  <Grid item xs={2} lg={4} style={{ textAlign: "right" }}>
                        <Button
                          variant="contained"
                          className="mt-16"
                          style={{
                            backgroundColor: "#1761FD",
                            border: "none",
                            color: "white",
                          }}
                          hidden={isViewOnly}
                          onClick={(e) => updateDesignSubmit(e, true)}
                        >
                          SAVE & CLOSE JOB
                        </Button>
                      </Grid> */}
                      <Grid item xs={6} lg={5}>
                        <Button
                          variant="contained"
                          className="mt-16 float-right"
                          style={{
                            backgroundColor: "#FE450B",
                            border: "none",
                            color: "white",
                          }}
                          hidden={isViewOnly}
                          onClick={(e) => setCloseJobModal(true)}
                        >
                          CLOSE JOB
                        </Button>
                      </Grid>
                    </>
                  )}
                </Grid>
              </div>
              <div className="m-16">
                {isDesigner === "true" ? (
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={3}>
                      {imgArr.map((item, i) => (
                        <Grid
                          item
                          xs={3}
                          sm={3}
                          md={3}
                          key={i}
                          style={{ display: "flex" }}
                        >
                          <Grid xs={4} sm={4} md={4} item key={i}>
                            <img
                              src={`${Config.getS3Url()}vkjdev/designjobreceive/image/${
                                item.upload_file_name
                              }?w=248&fit=crop&auto=format`}
                              srcSet={`${item.upload_file_name}?w=248&fit=crop&auto=format&dpr=2 2x`}
                              alt={item.upload_file_name}
                              loading="lazy"
                              style={{
                                width: "100px",
                                height: "100px",
                                border: "1px solid gray",
                                borderRadius: "7px",
                              }}
                            />
                          </Grid>
                          <Grid item xs={4} sm={4} md={4}>
                            <Grid item xs="auto">
                              {item.approve_reject !== null ? (
                                item.approve_reject === 1 ? (
                                  <b style={{ color: "#1FD319" }}>Approve</b>
                                ) : (
                                  <b style={{ color: "red" }}>Reject</b>
                                )
                              ) : (
                                ""
                              )}
                            </Grid>
                            <Grid item xs="auto">
                              <TextField
                                value={item.upload_file_name.split(".")[0]}
                              />
                            </Grid>
                            <Grid item xs="auto">
                            <b  hidden={isViewOnly}>{item.ReceiveComment.length} comments</b>
                            </Grid>
                            <Grid item xs="auto" >
                              <Button
                                variant="contained"
                                className={classes.button}
                                size="small"
                                hidden={isViewOnly}
                                style={{
                                  backgroundColor: "#707070",
                                  border: "none",
                                  color: "white",
                                }}
                                onClick={() => {
                                  setModalOpen(true);
                                  setDesigndataId(item.id);
                                }}
                              >
                                Add Comments
                              </Button>
                          
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ) : (
                  <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={6}>
                      {imgArr.map((item, i) => (
                        <Grid
                          item
                          xs="auto"
                          key={i}
                          style={{ position: "relative" }}
                        >
                          <img
                            src={`${Config.getS3Url()}vkjdev/designjobreceive/image/${
                              item.upload_file_name
                            }?w=248&fit=crop&auto=format`}
                            srcSet={`${item.upload_file_name}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt={item.upload_file_name}
                            loading="lazy"
                            className={classes.imgBox}
                            style={
                              item.approve_reject !== null
                                ? item.approve_reject === 1
                                  ? { border: "2px solid #1FD319" }
                                  : { border: "2px solid red" }
                                : { border: "1px solid gray" }
                            }
                          />
                          <div>
                            <p
                              style={{
                                maxWidth: "185px",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.upload_file_name}
                            </p>
                            <div style={{ float: "right" }}>
                              <b>
                                {item.EmployeeName
                                  ? item.EmployeeName.username
                                  : ""}
                              </b>
                            </div>
                          </div>
                          <div>
                            <Button
                              variant="contained"
                              className={classes.button}
                              size="small"
                              hidden={isViewOnly}
                              style={{
                                width: "80px",
                              }}
                              onClick={() => handleApproveReject(item.id, 1)}
                            >
                              Approve
                            </Button>
                            <div style={{ float: "right" }}>
                              <Button
                                variant="contained"
                                className={classes.button}
                                size="small"
                                hidden={isViewOnly}
                                style={{
                                  backgroundColor: "#C22707",
                                  width: "80px",
                                }}
                                onClick={() => handleApproveReject(item.id, 0)}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Button
                              variant="contained"
                              className={classes.button}
                              size="small"
                              hidden={isViewOnly}
                              style={{
                                backgroundColor: "#707070",
                                border: "none",
                                color: "white",
                                width: "200px",
                              }}
                              onClick={() => {
                                setModalOpen(true);
                                setDesigndataId(item.id);
                              }}
                            >
                              Add Comment
                            </Button>
                            <b style={{
                                border: "none",
                                color: "black",
                                width: "50px"
                              }} hidden={isViewOnly}>{item.ReceiveComment.length} comments
                            </b>
                          </div>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </div>
              <div className="m-16">
                {refImgArr.length > 0 && (
                  <Typography className="pt-20 pb-8 text-18 font-700">
                    Refrence ImageList
                  </Typography>
                )}
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={3}>
                    {refImgArr.map((item, i) => (
                      <React.Fragment key={i}>
                        <Grid item xs="auto" key={i}>
                          <img
                            src={`${Config.getS3Url()}vkjdev/designjob/image/${
                              item.upload_file_name
                            }?w=248&fit=crop&auto=format`}
                            srcSet={`${item.upload_file_name}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            alt={item.upload_file_name}
                            loading="lazy"
                            style={{
                              width: "100px",
                              height: "100px",
                              border: "1px solid gray",
                              borderRadius: "7px",
                            }}
                          />
                          <div>
                            <b>{item.upload_file_name.split(".")[0]}</b>
                          </div>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                </Box>
              </div>

                      
            </div>
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={modalOpen}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleCloseModal();
                }
              }}
            >
              <div
                style={modalStyle}
                className={clsx(classes.paper, "rounded-8")}
                id="modesize-dv"
              >
                <h5 className="popup-head p-20">
                  Comment
                  <IconButton
                    style={{ position: "absolute", top: 5, right: 8 }}
                    onClick={handleCloseModal}
                  >
                    <Icon>
                      {" "}
                      <img src={Icones.cross} alt="" />{" "}
                    </Icon>
                  </IconButton>
                </h5>
                {modalLoading && <LoaderPopup />}
                <div className="row">
                  <div style={{ maxHeight: 300, overflow: "auto" }}>
                    {designData !== ""
                      ? designData.ReceiveComment.map((temp, i) => (
                          <div
                            className="p-5 pl-16 pr-16  model-row-blg-dv"
                            key={i}
                          >
                            <b>
                              {moment
                                .utc(temp.created_at)
                                .local()
                                .format("DD-MM-YYYY h:mm:ss a")}{" "}
                              {temp.admin_worker === 2
                                ? `(By Designer)`
                                : "(By admin)"}
                            </b>

                            <Grid
                              item
                              lg={12}
                              md={12}
                              sm={12}
                              xs={12}
                              style={{ padding: 6 }}
                            >
                              <p>{temp.comment}</p>
                            </Grid>
                            {temp.voice_file_name !== null && (
                              <Grid
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                                style={{ padding: 0 }}
                              >
                                <audio
                                  className={classes.audioBox}
                                  src={
                                    Config.getS3Url() +
                                    `vkjdev/designjobreceive/voice-comment/${temp.voice_file_name}`
                                  }
                                  controls
                                />
                              </Grid>
                            )}
                          </div>
                        ))
                      : ""}
                  </div>
                  <div className="p-5 pl-16 pr-16  model-row-blg-dv">
                    <Grid
                      item
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      style={{ padding: 6 }}
                    >
                      <label>Add your comments</label>
                      <TextField
                        className="mt-1"
                        placeholder="Add your comments"
                        name="comment"
                        value={commentMsg}
                        onChange={(event) => setCommentMsg(event.target.value)}
                        variant="outlined"
                        fullWidth
                        multiline
                        maxRows="7"
                      />
                    </Grid>
                    <Grid
                      item
                      lg={3}
                      md={2}
                      sm={4}
                      xs={6}
                      style={{ padding: 6 }}
                    >
                      <Button
                        variant="contained"
                        className={classes.button}
                        size="small"
                        style={{
                          backgroundColor: "#707070",
                          border: "none",
                          color: "white",
                        }}
                        onClick={(e) => setRecordings(true)}
                      >
                        Add Voice Message
                      </Button>
                    </Grid>

                    {recordings && (
                      <>
                        <Grid
                          item
                          lg={3}
                          md={2}
                          sm={4}
                          xs={3}
                          style={{ padding: 3 }}
                        >
                          <p>{status}</p>
                          <Button
                            onClick={startRecording}
                            style={{
                              backgroundColor: "#415BD4",
                              border: "none",
                              color: "white",
                            }}
                          >
                            Start
                          </Button>
                          <Button
                            onClick={stopRecording}
                            style={{
                              backgroundColor: "#DF3636",
                              border: "none",
                              color: "white",
                              marginLeft: "10px",
                            }}
                          >
                            Stop
                          </Button>
                        </Grid>
                        <Grid
                          item
                          lg={3}
                          md={2}
                          sm={4}
                          xs={6}
                          style={{ padding: 6 }}
                        >
                          <audio
                            className={classes.audioBox}
                            src={mediaBlobUrl}
                            controls
                          />
                        </Grid>
                      </>
                    )}

                    <Grid
                      item
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      style={{ padding: 6 }}
                    >
                      {/* <Button
                        variant="contained"
                        color="primary"
                        className="w-full mx-auto mt-16"
                        style={{
                          backgroundColor: "#4caf50",
                          border: "none",
                          color: "white",
                        }}
                        onClick={(e) => handleCommentSubmit(e)}
                      >
                        SAVE
                      </Button> */}
                      <div className="comments_popup_button_div">
                        <Button
                          variant="contained"
                          className="cancle-button-css"
                          onClick={handleCloseModal}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          className="save-button-css"
                          onClick={(e) => handleCommentSubmit(e)}
                        >
                          SAVE
                        </Button>
                      </div>
                    </Grid>
                  </div>
                </div>
              </div>
            </Modal>
            <Dialog
              open={closeJobModal}
              onClose={() => setCloseJobModal(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" className="popup-delete">{"Alert!!!"}<IconButton
                  style={{
                    position: "absolute",
                    marginTop: "-5px",
                    right: "15px",
                  }}
                  onClick={() => setCloseJobModal(false)}
                >
                  <img
                    src={Icones.cross}
                    className="delete-dialog-box-image-size"
                    alt=""
                  />
                </IconButton></DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to close the job?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setCloseJobModal(false)} className="delete-dialog-box-cancle-button">
                  Cancel
                </Button>
                <Button onClick={handleCloseJob} className="delete-dialog-box-cancle-button" autoFocus>
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default EditDesignJob;

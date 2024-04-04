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
import { TextField, ImageListItemBar, Icon, IconButton, Card,
  CardContent,
  Checkbox,
  CardHeader, ImageListItem, ImageList, Box } from "@material-ui/core";
  import FormControlLabel from "@material-ui/core/FormControlLabel";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import History from "@history";
import { Typography } from "@material-ui/core";
import Select, { createFilter } from "react-select";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Loader from '../../../../../../Loader/Loader';
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import moment from "moment";
import { useReactMediaRecorder } from "react-media-recorder";
import sampleFile from "app/main/SampleFiles/DesignModule/cadCSV.csv"
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
    width: "220px",
    height: "220px"
  },
  audioBox: {
    padding: "10px",
    borderRadius: "30px"
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

const EditCAD = (props) => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [jobNumber, setJobNumber] = useState("");
  const [designerName, setDesignerName] = useState("");
  const [noOfdesign, setNoOfdesign] = useState("");
  const [approvedImage, setApprovedImage] = useState("");
  const [imgArr, setImageArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [closeJobModal, setCloseJobModal] = useState(false);
  const [pageView, setPageView] = useState(false)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStyle] = React.useState(getModalStyle);
  const [designDataId, setDesigndataId] = useState("");
  const [designData, setDesigndata] = useState("");
  const [commentMsg, setCommentMsg] = useState("");
  const [recordings, setRecordings] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [designerList, setDesignerList] = useState([]);
  const [cadFiles, setCadFiles] = useState("");
  const [cadFilesErr, setCadFilesErr] = useState(""); 
  const [engImages, setEngImages] = useState("")
  const [engImgErr, setEngImgErr] = useState("");
  const [totalComments, setTotalComments] = useState([])
  const [detailsFile, setDetailsFile] = useState("")
  const [detFilesErr, setDetFilesErr] = useState("")
  const isDesigner = localStorage.getItem('isDesigner')
  const [editId,setEditId] = useState("")

  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });

  useEffect(() => {
    if (props.location.state) {
      const id = props.location.state.id;
      const viewPage = props.location.state.viewPage;
      setEditId(id)

      getDataForEdit(id)
      setPageView(viewPage)
    } else {
      History.push('/dashboard/design', { view: 1, sub: 2 })
    }
  }, [dispatch])

  useEffect(() => {
    NavbarSetting('Design', dispatch);
  }, []);

  useEffect(() => {
    if (modalOpen) {
      getCommentData()
    }
  }, [modalOpen])

  function getCommentData() {
    setModalLoading(true)
    axios.get(Config.getCommonUrl() + `api/cadjobreceivedesign/all-comment/${designDataId}`)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          const apiData = response.data.data;
          setDesigndata(apiData)
          const arr = [...totalComments]
          arr[designDataId.toString()] = apiData.ReceiveComment.length
          setTotalComments(arr)
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `api/cadjobreceivedesign/all-comment/${designDataId}` })
      })
    setModalLoading(false)
  }

  function getDataForEdit(id) {
    setLoading(true)
    axios.get(Config.getCommonUrl() + `api/cadjobreceivedesign/receive/one/${id}`)
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const apiData = res.data.data;
          setJobNumber(apiData.CadJobNumber.cad_number)
          setDesignerName(apiData.CadDesigner.username)
          setApprovedImage(res.data.approvedCount)
          setNoOfdesign(apiData.no_of_design)
          setImageArr(apiData.ReceiveJobDetails)
          setDesignerList(apiData.DesignFile)
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        handleError(error, dispatch, { api: `api/cadjobreceivedesign/receive/one/${editId}` })
      })
  }

  const handleCloseJob = () => {
    if (jobNumber) {
      axios.put(Config.getCommonUrl() + `api/cadjobreceivedesign/close/${editId}`)

        .then((response) => {
          console.log(response);
          if (response.data.success) {
            dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
            History.push('/dashboard/design', { view: 1, sub: 2 })
          } else {
            dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          }
        })
        .catch((error) => {
          handleError(error, dispatch, { api: `api/cadjobreceivedesign/close/${editId}` })
        })
    }
  }

  const handleApproveReject = (Did, data) => {
    axios.put(Config.getCommonUrl() + `api/cadjobreceivedesign/approve/reject/${editId}/${Did}?approve=${data}`)
    .then((response) => {
      console.log(response);
      if (response.data.success) {
        dispatch(Actions.showMessage({ message: response.data.message,variant:"success"})); 
        getDataForEdit(editId)
      }else {
        dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
      }
    })
    .catch((error) => {
      handleError(error, dispatch, { api: `api/cadjobreceivedesign/approve/reject/${editId}/${Did}?approve=${data}`})
    })
}


  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentMsg || mediaBlobUrl) {
      if (mediaBlobUrl) {
        handleSave()
      } else {
        addCommentApi()
      }
    }
  }

  const handleSave = async () => {
    const audioBlob = await fetch(mediaBlobUrl).then((r) => r.blob());
    const audioFile = new File([audioBlob], 'voice.wav', { type: 'audio/wav' });

    addCommentApi(audioFile); // sending to the server
  };

  function addCommentApi(audioFile) {
    setLoading(true)
    const formData = new FormData(); // preparing to send to the server
    formData.append('file', audioFile);  // preparing to send to the server
    formData.append("comment", commentMsg)
    formData.append("admin_worker", isDesigner === "true" ? 2 : 1)
    axios.post(Config.getCommonUrl() + `api/cadjobreceivedesign/comment/${designDataId}`, formData)
      .then(response => {
        console.log(response)
        if (response.data.success) {
          setModalOpen(false)
          setRecordings(false)
          setCommentMsg("")
          setDesigndataId("")
          setDesigndata("")
          getCommentData()
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch(error => {
        handleError(error, dispatch, { api: `api/cadjobreceivedesign/comment/${designDataId}`, body: JSON.stringify(formData) })
      })
    setLoading(false)
  }

  const handleInputChange = (e) => {
    const name = e.target.name;
    if (name === "cadFiles") {

    if(Config.checkFile(e.target.files,"")){
      setCadFiles(e.target.files);
      setCadFilesErr("");
    }else{
      dispatch(Actions.showMessage({ message: "Accept only dwg format" }));
      document.getElementById("fileinput1").value = "";
    }
  } else if (name === "engImages") {
    if(Config.checkFile(e.target.files,"image")){
      setEngImages(e.target.files);
      setEngImgErr("");    
    }else{
      dispatch(Actions.showMessage({ message: "Accept only image format" }));
      document.getElementById("fileinput2").value = "";
    }
  } else if (name === "detailsFile") {
    if(e.target.files[0].type==="text/csv"){
      setDetailsFile(e.target.files[0]);
      setDetFilesErr("");
    }else{
      dispatch(Actions.showMessage({ message: "Accept only csv format" }));
      document.getElementById("fileinput3").value = "";
    }
    }
  }

  function detailsFileValidation() {
    if (detailsFile === "") {
      setDetFilesErr("Please Upload Details File")
      return false;
    }
    return true;
  }

  function EngImgsValidation() {
    if (engImages === "") {
      setEngImgErr("Please Select Images")
      return false;
    }
    return true;
  }

  function cadFilesValidation() {
    if (cadFiles === "") {
      setCadFilesErr("Please Select CAD Files")
      return false;
    }
    return true;
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    if (cadFilesValidation() && EngImgsValidation() && detailsFileValidation()) {
      const formData = new FormData();

      if (engImages !== null) {
        for (let i = 0; i < engImages.length; i++) {
          formData.append("images", engImages[i]);
        }
      }
      if (cadFiles !== null) {
        for (let i = 0; i < cadFiles.length; i++) {
          formData.append("cadfiles", cadFiles[i]);
        }
      }
      formData.append("csvfiles", detailsFile);
      callUploadDesign(formData)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false);
    setRecordings(false)
    setCommentMsg("")
    setDesigndataId("")
    setDesigndata("")
  }

  function callUploadDesign(formData) {
    setLoading(true)
    axios.post(Config.getCommonUrl() + `api/cadJob/cadjob-received-designs/upload/${editId}`, formData)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          getDataForEdit(editId)
          History.push(`/dashboard/design`, { view: 1, sub: 2 })
        } else {
          let downloadUrl = response.data.url;
          window.open(downloadUrl);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        handleError(error, dispatch, { api: `api/cadJob/cadjob-received-designs/upload/${editId}`, body: JSON.stringify(formData) })
      })
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20" style={{ height: 'calc(100vh - 100px)', overflowX: 'hidden' }}>
            <Grid className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    CAD Files
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> <b>{jobNumber}</b> */}
              </Grid>
              {loading && <Loader />}
              <Grid item xs={12} sm={4} md={9} key="2"
                style={{ textAlign: "right" }}
              >
                {/* <Button id="voucher-list-btn"
                  variant="contained"
                  className={classes.button1}
                  size="small"
                  onClick={() => History.push(`/dashboard/design`, { view: 1, sub: 2 })}
                >
                  Back
                </Button> */}
                     <div className="btn-back mt-2">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    size="small"
                    onClick={() => History.push(`/dashboard/design`, { view: 1, sub: 2 })}
                  >
                    Back
                  </Button>
                </div>
                {/* {
                  isDesigner !== "true" && pageView === false &&
                  <Button 
                      id="btn-save"
                    variant="contained"
                    className={classes.button}
                    size="small"
                    onClick={(e) => updateDesignSubmit(e, false)}
                  >
                    SAVE
                  </Button>
                } */}
              </Grid>
            </Grid>
            <div className="main-div-alll">
              <div className="pb-8  pl-8 pr-8 mt-8">
              <Grid container spacing={3}>
                  <Grid item xs={2} style={{ padding: 5 }}>
                    <label>Job number</label>
                  <TextField
                    className="mt-1"
                    placeholder="Job number"
                    name="jobNumber"
                    value={jobNumber}
                    disabled
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                  <Grid item xs={2} style={{ padding: 5 }}>
                    <label>Designer name</label>
                  <TextField
                    className="mt-1"
                    placeholder="Designer name"
                    name="designerName"
                    value={designerName}
                    disabled
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

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

                  <Grid item xs={1} lg={2} style={{ padding: 5 }}>
                    <label>Approved cad</label>
                  <TextField
                    className="mt-1"
                    placeholder="Approved cad"
                    name="approvedImage"
                    value={approvedImage}
                    disabled
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                {
                  isDesigner !== "true" && !pageView &&
                  <>
                      <Grid item xs={2} >
                      <Button
                        variant="contained"
                        color="primary"
                        className="mt-16"
                        style={{
                          backgroundColor: "#FE450B",
                          border: "none",
                          color: "white",
                        }}
                        onClick={(e) => setCloseJobModal(true)}
                      >
                        CLOSE JOB
                      </Button>
                    </Grid>
                  </>

                }
                
                {
                  isDesigner === "true" && !pageView &&
                  <>
                      <Grid item xs={2} style={{ padding: 5 }}>
                        <label>Upload cad file (DWG/3DM/JCD)</label>
                      <TextField
                        className="mt-1"
                        placeholder="Upload CAD File (DWG/3DM/JCD)"
                        type="file"
                        inputProps={{
                          accept:".DWG, .3DM, .JCD",
                        }}
                        name="cadFiles"
                        error={cadFilesErr.length > 0 ? true : false}
                        helperText={cadFilesErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                      <Grid item xs={2} style={{ padding: 5 }}>
                        <label>Engineered image (JPED/PNG/JPG)</label>
                      <TextField
                        className="mt-1"
                        placeholder="Engineered Image File (JPED/PNG/JPG)"
                        type="file"
                        inputProps={{
                          accept:".jpeg,.png,.jpg",
                        }}
                        name="engImages"
                        error={engImgErr.length > 0 ? true : false}
                        helperText={engImgErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                      <Grid item xs={2} style={{ padding: 5 }}>
                        <label>Upload details (csv)</label>
                      <TextField
                        className="mt-1"
                        placeholder="Upload Details File (CSV)"
                        type="file"
                        inputProps={{
                          accept:".csv"
                        }}
                        name="detailsFile"
                        error={detFilesErr.length > 0 ? true : false}
                        helperText={detFilesErr}
                        onChange={(e) => handleInputChange(e)}
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>

                    <Grid item lg={2} md={2} sm={2} xs={2} style={{ padding: 1,display: 'flex'}} className="mt-10">

                      <a href={sampleFile} download="cadCSV.csv" >Download Sample </a>

                    </Grid>

                    <Grid item xs={2} lg={12} style={{ padding: 5 }}>
                        <Button
                          className="float-right"
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
                      >
                        UPLOAD
                      </Button>
                    </Grid>
                  </>
                }
                 <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <Card sx={{ minWidth: 275 }}>
                      <CardHeader
                        style={{ backgroundColor: "#EBEEFB", padding: 5 }}
                        subheader="Designs"
                      />
                      <CardContent>
                        <Grid container spacing={3}>
                        {designerList.map((item, index) => (
                        <Grid
                          item
                          key={index}
                          lg={2}
                          md={2}
                          sm={2}
                          xs={2}
                            style={{ padding: 6 }}
                            className="ml-10"
                        >
                                <FormControlLabel
                                  key={item.id}
                                  label={<> {item.DesignImage.image_file.split(".")[0] }  </> }
                                  control={
                                    <img src={`${Config.getS3Url()}vkjdev/designjobreceive/image/${item.DesignImage.upload_file_name}`}  
                                    style={{ width: "40px", height: "40px", border: "1px solid gray", marginRight: "5px" }} /> }
                                />
                            </Grid>
                            ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
              </Grid>
            </div>
            <div className="m-16" style={{ height: 'calc(100vh - 280px)', overflowX: 'hidden', overflowY: 'auto' }}>
              {
                isDesigner === "true" ?
                  <Box sx={{ flexGrow: 1 }} >
                    <Grid container spacing={3}>
                      {imgArr.map((item, i) => (
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} key={i} style={{ display: 'flex', marginTop: 10 }}>
                          <Grid item xs={3} sm={3} md={3} style={{ position: "relative" }}>
                            <img
                              src ={`${Config.getS3Url()}vkjdev/cadJob/images/${item.image_file}`}
                              alt={item.image_file}
                              loading="lazy"
                              className={classes.imgBox}
                              style={{ border: "1px solid gray" }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={6} md={6}>
                            <Grid item xs="auto" style={{ height: "20px" }}>
                              <b>Temp CAD No </b> : <span>{item.temp_cad_no}</span>
                            </Grid>
                            <Grid item xs="auto" style={{ height: "160px", overflow: "auto" }}>
                              <div style={{ marginTop: "2px" }}>
                                <table className="design_table_mold_stone_d">
                                  <tbody>
                                    <tr>
                                      <td style={{ paddingLeft: "20px", paddingRight: "20px", textAlign: "center",backgroundColor: "#EBEEFB" }}><b>Mold Code</b></td>
                                      <td style={{ paddingLeft: "20px", paddingRight: "20px", textAlign: "center",backgroundColor: "#EBEEFB" }}><b>No Of Mold</b></td>
                                      <td style={{ paddingLeft: "20px", paddingRight: "20px", textAlign: "center",backgroundColor: "#EBEEFB" }}><b>Stones Code</b></td>
                                      <td style={{ paddingLeft: "20px", paddingRight: "20px", textAlign: "center",backgroundColor: "#EBEEFB" }}><b>No of stones</b></td>
                                    </tr>
                                    {/* {
                                      item.CadMoldDetails.map((temp, indexs) => (
                                        <tr key={indexs}>
                                          <td rowSpan={temp.CadMoldStockDetails.length}>{temp.mold_number}</td>
                                          <td rowSpan={temp.CadMoldStockDetails.length}>{temp.mold_pcs}</td>
                                          {
                                            temp.CadMoldStockDetails.map((col, index) => (
                                              <React.Fragment key={index}>
                                                <td>{col.StockNameCode.stock_code}</td>
                                                <td>{col.stone_pcs}</td>
                                              </React.Fragment>
                                            ))
                                          }
                                        </tr>
                                      ))
                                    } */}
                                    {item.CadMoldDetails.map((temp, indexs) => (

                                      <React.Fragment key={indexs}>
                                        <tr style={{ padding: 5, textAlign: "center", }} >
                                          <td rowSpan={temp.CadMoldStockDetails.length} style={{ background: '#FFF' }}>
                                            {temp.mold_number}
                                          </td>
                                          <td rowSpan={temp.CadMoldStockDetails.length} style={{ background: '#FFF' }}>{temp.mold_pcs}</td>
                                          <td style={{ background: '#FFF' }}> {temp.CadMoldStockDetails.length !== 0 ? temp.CadMoldStockDetails[0]?.StockNameCode.stock_code : ""} </td>
                                          <td style={{ background: '#FFF' }}> {temp.CadMoldStockDetails.length !== 0 ? temp.CadMoldStockDetails[0]?.stone_pcs : ""}</td>

                                        </tr>

                                        {
                                          temp.CadMoldStockDetails.map((col, index) => (
                                            index > 0 &&
                                            <tr key={index} style={{ padding: 5, textAlign: "center" }}>
                                              <td style={{ background: '#FFF' }}>{col.StockNameCode.stock_code}</td>
                                              <td style={{ background: '#FFF' }}>{col.stone_pcs}</td>
                                            </tr>

                                          ))
                                        }

                                      </React.Fragment>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </Grid>
                            <Grid item xs="auto" >
                              <div >
                                <Button
                                  variant="contained"
                                  className={classes.button}
                                  size="small"
                                  hidden={pageView}
                                  style={{
                                    backgroundColor: "#707070",
                                    border: "none",
                                    color: "white",
                                    width: "200px"
                                  }}

                                  onClick={() => { setDesigndataId(item.id); setModalOpen(true) }}
                                >

                                  Add Comment
                                </Button>
                                <b>{totalComments[item.id] ? totalComments[item.id] : item.ReceiveComment?.length } Comments</b>
                                {/* <a href={`${Config.getS3Url()}vkjdev/cadJob/cadFiles/${item.cad_file}`} download>
                                      <Icon style={{ color: "black" }}>get_app</Icon>
                                  </a> */}
                                <IconButton
                                  style={{ paddingLeft: "0", height: "100%" }}
                                  className="ml-0"
                                  onClick={() => { window.open(`${Config.getS3Url()}vkjdev/cadJob/cadFiles/${item.cad_file}`, '_blank'); }}
                                >

<Icon className="mr-8 download-icone" style={{ color: "dodgerblue" }}>
                                                        <img src={Icones.download_green} alt="" />
                                                    </Icon>

                                </IconButton>
                                {item.approve_reject !== null ? item.approve_reject === 1 ? <b style={{ color: "#1FD319" }}>Approve</b> : <b style={{ color: "red" }}>Reject</b> : ""}
                              </div>
                            </Grid>
                          </Grid>
                        </Grid>
                      ))
                      }
                    </Grid>
                  </Box>
                  :
                  <Box sx={{ flexGrow: 1 }} >
                    <Grid container spacing={3}>
                      {imgArr.map((item, i) => (
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} key={i} style={{ display: 'flex', marginTop: 10 }}>
                          <Grid item xs={3} sm={3} md={3} style={{ position: "relative" }}>

                            <img
                              src={`${Config.getS3Url()}vkjdev/cadJob/images/${item.image_file}`}
                              alt={item.image_file}
                              loading="lazy"
                              className={classes.imgBox}
                              style={item.approve_reject !== null ? item.approve_reject === 1 ? { border: "2px solid #1FD319", borderRadius: "7px" } : { border: "2px solid red", borderRadius: "7px" } : { border: "1px solid gray", borderRadius: "7px" }}
                            />
                          </Grid>
                          <Grid item xs={6} sm={6} md={6}>
                            <Grid item xs="auto" style={{ height: "20px" }}>
                              <b>Temp CAD No </b> : <span>{item.temp_cad_no}</span>
                            </Grid>
                            <Grid item xs="auto" style={{ height: "160px"}}>
                              <div style={{ marginTop: "2px" }} >
                                <table class="design_table_mold_stone_d">
                                  <tbody>
                                    <tr>
                                      <td style={{ paddingLeft: "20px", paddingRight: "20px", textAlign: "center" }}><b>Mold Code</b></td>
                                      <td style={{ paddingLeft: "20px", paddingRight: "20px", textAlign: "center" }}><b>No Of Mold</b></td>
                                      <td style={{ paddingLeft: "20px", paddingRight: "20px", textAlign: "center" }}><b>Stones Code</b></td>
                                      <td style={{ paddingLeft: "20px", paddingRight: "20px", textAlign: "center" }}><b>No of stones</b></td>
                                    </tr>
                                    {/* {item.CadMoldDetails.map((temp, indexs) => (
                                        <tr key={indexs} style={{ padding: 5, textAlign: "center" }}>
                                          <td rowSpan={temp.CadMoldStockDetails.length}>{temp.mold_number}</td>
                                          <td rowSpan={temp.CadMoldStockDetails.length}>{temp.mold_pcs}</td>
                                          {
                                            temp.CadMoldStockDetails.map((col, index) => (
                                              <React.Fragment key={index}>
                                                <td>{col.StockNameCode.stock_code}</td>
                                                <td>{col.stone_pcs}</td>
                                              </React.Fragment>
                                            ))
                                          }
                                        </tr>
                                      ))} */}
                                    {item.CadMoldDetails.map((temp, indexs) => (

                                      <React.Fragment key={indexs}>
                                        <tr style={{ padding: 5, textAlign: "center", }} >
                                          <td rowSpan={temp.CadMoldStockDetails.length} style={{ background: '#FFF' }}>
                                            {temp.mold_number}
                                          </td>
                                          <td rowSpan={temp.CadMoldStockDetails.length} style={{ background: '#FFF' }}>{temp.mold_pcs}</td>
                                          <td style={{ background: '#FFF' }}> {temp.CadMoldStockDetails.length !== 0 ? temp.CadMoldStockDetails[0]?.StockNameCode.stock_code : ""} </td>
                                          <td style={{ background: '#FFF' }}> {temp.CadMoldStockDetails.length !== 0 ? temp.CadMoldStockDetails[0]?.stone_pcs : ""}</td>

                                        </tr>

                                        {
                                          temp.CadMoldStockDetails.map((col, index) => (
                                            index > 0 &&
                                            <tr key={index} style={{ padding: 5, textAlign: "center" }}>
                                              <td style={{ background: '#FFF' }}>{col.StockNameCode.stock_code}</td>
                                              <td style={{ background: '#FFF' }}>{col.stone_pcs}</td>
                                            </tr>

                                          ))
                                        }

                                      </React.Fragment>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </Grid>
                            <Grid item xs="auto">
                              <div>
                              
                                    <Button
                                      variant="contained"
                                      className={classes.button}
                                      size="small"
                                      hidden={pageView}
                                      style={{
                                        width: "80px"
                                      }}
                                      onClick={() => handleApproveReject(item.id, 1)}
                                    >
                                      Approve
                                    </Button>
                                    <Button
                                      variant="contained"
                                      className={classes.button}
                                      size="small"
                                      hidden={pageView}
                                      style={{
                                        backgroundColor: "#C22707",
                                        width: "80px",

                                      }}
                                      onClick={() => handleApproveReject(item.id, 2)}
                                    >
                                      Reject
                                    </Button>
                                  
                                <b>{totalComments[item.id] ? totalComments[item.id] : item.ReceiveComment?.length } Comments</b>

                                {/* <div style={{ float: "right" }}> */}
                                <IconButton
                                  style={{ padding: 7, height: "100%", float: "right" }}
                                  className="ml-0"
                                  onClick={() => { window.open(`${Config.getS3Url()}vkjdev/cadJob/cadFiles/${item.cad_file}`, '_blank'); }}
                                >

                                  <Icon className="mr-8 view-icone">
                                    <img src={Icones.download_green} alt="" />
                                  </Icon>

                                </IconButton>

                                <Button
                                  variant="contained"
                                  className={classes.button}
                                  size="small"
                                  style={{
                                    backgroundColor: "#707070",
                                    border: "none",
                                    color: "white",
                                    float: "right"
                                    // width: "200px"
                                  }}
                                  // onClick={handleCloseModal}
                                  onClick={() => { setDesigndataId(item.id); setModalOpen(true) }}

                                >
                                  {pageView ? " View Comment" : "Add Comment"}
                                </Button>
                                {/* <a href={`${Config.getS3Url()}vkjdev/cadJob/cadFiles/${item.cad_file}`} download>
                                  <Icon style={{ color: "black" }}>get_app</Icon>
                                </a> */}

                                {/* </div> */}
                              </div>
                            </Grid>
                          </Grid>
                          {/* <Grid item xs={2} sm={2} md={2}>
                          </Grid> */}
                        </Grid>
                      ))
                      }
                    </Grid>
                  </Box>
              }
              </div>
              </div>
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={modalOpen}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleCloseModal()
                }
              }}
            >
              <div style={modalStyle} className={clsx(classes.paper,"rounded-8")} id="modesize-dv">
                <h5
              className="popup-head p-20"
                >
                  Comment
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={handleCloseModal}
                  >   <Icon>
                      <img src={Icones.cross} alt="" />
                    </Icon></IconButton>
                </h5>
                <div className="row">
                  <div style={{ maxHeight: 300, overflow: 'auto' }}>
                    {
                      designData !== "" ? designData.ReceiveComment.map((temp, i) => (
                        <div className="p-5 pl-16 pr-16  model-row-blg-dv" key={i}>
                          <b>{moment.utc(temp.created_at).local().format("DD-MM-YYYY h:mm:ss a")} {temp.admin_worker === 2 ? `(By Designer)` : "(By admin)"}</b>

                          <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: 6 }}>
                            <p>{temp.comment}</p>
                          </Grid>
                          {
                            temp.voice_file_name !== null &&
                            <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: 0 }}>
                              <audio className={classes.audioBox}
                                src={Config.getS3Url() + `vkjdev/designjobreceive/voice-comment/${temp.voice_file_name}`} controls />
                            </Grid>
                          }

                        </div>
                      )) : ''
                    }
                  </div>
                  <div className="p-5 pl-16 pr-16  model-row-blg-dv">
                    <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: 6 }}>
                      <label>Add your comments</label>
                        <TextField
                          className="mt-1"
                          placeholder="Add your comments"
                          name="comment"
                          value={commentMsg}
                          hidden={pageView}
                          onChange={(event) => setCommentMsg(event.target.value)}
                          variant="outlined"
                          fullWidth
                          multiline
                          maxRows="7"
                        />
                      </Grid>
                      <Grid item lg={3} md={2} sm={4} xs={6} style={{ padding: 6 }}>
                        <Button
                          variant="contained"
                          className={classes.button}
                          size="small"
                          hidden={pageView}
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

                      {recordings &&
                        <>
                          <Grid item lg={3} md={2} sm={4} xs={3} style={{ padding: 3 }}>
                            <p>{status}</p>
                            <Button 
                            onClick={startRecording} 
                            hidden={pageView}
                              style={{
                                backgroundColor: "#415BD4",
                                border: "none",
                                color: "white",
                              }}>
                              Start
                            </Button>
                            <Button 
                            onClick={stopRecording}
                            hidden={pageView}
                              style={{
                                backgroundColor: "#DF3636",
                                border: "none",
                                color: "white",
                                marginLeft: "10px"
                              }}>
                              Stop
                            </Button>
                          </Grid>
                          <Grid item lg={3} md={2} sm={4} xs={6} style={{ padding: 6 }}>
                            <audio className={classes.audioBox} src={mediaBlobUrl} controls />
                          </Grid>
                        </>

                      }

                      <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: 6 }}>
                        {/* <Button
                          variant="contained"
                          color="primary"
                          hidden={pageView}
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
                <Button
                  onClick={() => setCloseJobModal(false)}
                className="cancle-button-css"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCloseJob}
                  className="save-button-css"
                  autoFocus
                >
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </FuseAnimate >
    </div >
  )
}

export default EditCAD
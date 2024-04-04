import React,{useState, useEffect , useCallback} from "react";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import * as authActions from "app/auth/store/actions";
import * as Actions from "app/store/actions";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import { Icon, IconButton, TextField } from "@material-ui/core";
import Loader from '../../../../Loader/Loader';
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Dropzone from 'react-dropzone-uploader'
import 'react-dropzone-uploader/dist/styles.css'
import clsx from "clsx";
import { formatBytes, formatDuration } from 'react-dropzone-uploader'

function getModalStyle() {
    const top = 50; //+ rand();
    const left = 50; //+ rand();
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
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
      backgroundColor: "cornflowerblue",
      color: "white",
    },
  }));
 
const ImageUpload = (props) => {

    const [open, setOpen] = React.useState(true);
    const [modalStyle] = React.useState(getModalStyle);
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const [loading,setLoading] = useState(false);
    const [length,setLength] = useState(0);
    const [upload,setUpload] = useState(0);
    const getUploadParams = ({ file, meta }) => {
      const body = new FormData()
      body.append('image_files', file)
      const headers = { 'Authorization' : 'Bearer ' +localStorage.getItem("authToken") ,
      "x-real-ip" : localStorage.getItem("ip"),
      "x-forwarded-for" : localStorage.getItem("ip")}
      return  {url : Config.getCommonUrl() + "api/design/uploadImage", body : body , headers : headers }
    }

    // called every time a file's `status` changes
  const handleChangeStatus = ( meta ,status,file) => 
  { 
    setLength(`${file.length}`)
  if(status==="done"){
    const add = upload +1
    setUpload(add)
  }
    
  }
  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files, allFiles) => {
    allFiles.forEach(f => f.remove())
    setLength(0)
    setUpload(0)
  }

    const handleClose = () => {
        setOpen(false);
        props.modalColsed()
    };

    const handleCloseModal = () => {
      setOpen(false);
      props.moldalheaderClose()
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
        <div>
           {loading && <Loader />}
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={(_, reason) => {
              if (reason !== "backdropClick") {
                handleCloseModal();
              }
            }}
        >
            <div style={modalStyle} className={clsx(classes.paper,"rounded-8")} id="modesize-dv">
            <h5
                className="popup-head p-20"
                style={{
                textAlign: "center",
                backgroundColor: "#415BD4",
                color: "white",
                }}
            >
                Upload New Image
                <IconButton
                style={{ position: "absolute", top: "0", right: "0" }}
                onClick={handleCloseModal}
                  ><Icon style={{color: "white"}}>
                  close
                </Icon></IconButton>
            </h5>
            
                <div className="p-5 pl-16 pr-16" style={{ paddingTop: "35px"}} > 
                <span  style={{position:"fixed", top:"65px",backgroundColor:"#2484ff",padding:"3px 30px ",color:"#ffff",}}><b>{upload} / {length}</b></span>
         
                <Dropzone
                  getUploadParams={getUploadParams}
                  onChangeStatus={handleChangeStatus}
                  maxFiles={150}
                  maxSizeBytes={10485760}
                  accept="image/*"
                  onSubmit={handleSubmit}
                  submitButtonContent={"Clear"}
                  PreviewComponent={props => <MyCustomPreview {...props} extraProp={10} />}
                  inputContent={(files, extra) => (extra.reject ? 'Image files only' : 'Drag Files or Click to Browse')}
                  styles={{ dropzone: { minHeight: 200, maxHeight: 480,marginTop:10  }  ,previewImage: { maxHeight:"150px", maxWidth:"150px"}, preview:{ padding:"80px"}, 
                  inputLabelWithFiles:{position:"fixed",top:"45px",marginLeft:"88%", color:"#ffff", backgroundColor:"#2484ff",},
                  submitButtonContainer:{position:"fixed", top:"37px",marginLeft:"70%",padding:4 }} }
               />
                </div>
            </div>
        </Modal>
    </div>
    );
};
const MyCustomPreview = ({
  className,
  imageClassName,
  style,
  imageStyle,
  meta,
  fileWithMeta,
  isUpload,
  canCancel,
  canRemove,
  canRestart,
  extra,
  remove,
}) => {
  const { name = '', percent = 0, size = 0, previewUrl, status, duration, validationError } = meta;

  let title = `${name || '?'}, ${formatBytes(size)}`;
  if (duration) title = `${title}, ${formatDuration(duration)}`;

  if (status === 'error_file_size' || status === 'error_validation') {
    return (
      <div className={className} style={style}>
        <span className="dzu-previewFileNameError">{title}</span>
        {status === 'error_file_size' && <span>{size < extra.minSizeBytes ? 'File too small' : 'File too big'}</span>}
        {status === 'error_validation' && <span>{String(validationError)}</span>}
        {canRemove && <span className="dzu-previewButton" onClick={remove} />}
      </div>
    );
  }

  if (status === 'error_upload_params' || status === 'exception_upload' || status === 'error_upload') {
    title = `${title} (upload failed)`;
  }
  if (status === 'aborted') title = `${title} (cancelled)`;

  return (
    <div className={className} style={style}>
      {previewUrl && (
        <img className={imageClassName} style={imageStyle} src={previewUrl} alt={title} title={title} />
      )}
      {previewUrl && <span className="dzu-previewFileName">{name}</span>}

      <div className="dzu-previewStatusContainer">
        {isUpload && <progress max={100} value={status === 'done' || status === 'headers_received' ? 100 : percent} />}

        {status === 'uploading' && canCancel && (
          <IconButton onClick={fileWithMeta.cancel}>
            <Icon>pause</Icon>
          </IconButton>
        )}
        {status !== 'preparing' && status !== 'getting_upload_params' && status !== 'uploading' && canRemove && (
          <IconButton onClick={remove}>
            <Icon>cancel</Icon>
          </IconButton>
        )}
        {['error_upload_params', 'exception_upload', 'error_upload', 'aborted', 'ready'].includes(status) &&
          canRestart && (
            <IconButton onClick={fileWithMeta.restart}>
              <Icon>play_arrow</Icon>
            </IconButton>
          )}
      </div>
    </div>
  );
};

export default ImageUpload;
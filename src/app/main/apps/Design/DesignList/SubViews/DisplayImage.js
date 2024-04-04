import React,{ useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Icon, IconButton } from "@material-ui/core";
import clsx from "clsx";
import Icones from "assets/fornt-icons/Mainicons";
import ImgSlider from "./ImageSlider";

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
    width: "750px",
    // maxWidth: "calc(100vw - 200px)",
    // maxHeight:"calc(100vh - 200px)",
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
}));

const DisplayImage = (props) => {

  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const [defaultImg, setDefaultImg] = useState(props.index);
  
  const handleClose = () => {
    setOpen(false);
    props.modalColsed()
  };

  const handlePrev = () => {
    console.log(defaultImg);
    if (defaultImg === 0) {
      setDefaultImg(props.data.length - 1);
    } else {
      setDefaultImg((prev) => prev - 1);
    }
  };
  const handleNext = () => {
    console.log(defaultImg);
    if (defaultImg === props.data.length - 1) {
      setDefaultImg(0);
    } else {
      setDefaultImg((prev) => prev + 1);
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose()
          }
        }}
      >
        <div style={modalStyle} className={clsx(classes.paper,"rounded-8")}>
          <h5
            className="popup-head p-20"
          >
            {props?.from === "list" ? props.data[defaultImg]?.variant_number : Image}
            
            <IconButton
                style={{ position: "absolute", top: "3px", right: "0" }}
                onClick={handleClose}
                  > <Icon>
                      <img src={Icones.cross} alt="" />
                    </Icon></IconButton>
          </h5>
          <div  className={
              props?.from === "list"
                ? "p-5 pl-16 pr-16 text-center slide_img_varient_master"
                : "p-5 pl-16 pr-16 text-center"
            }>
             {props?.from === "list" ? (
              <ImgSlider
                images={props.data}
                defaultIndex={defaultImg}
                nextImg={handleNext}
                prevImg={handlePrev}
              />
            ) : (
              <img
                src={props.image}
                style={{
                  maxHeight: "calc(100vh - 200px)",
                  maxWidth: "calc(100vw - 200px)",
                }}
                alt="img"
              />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DisplayImage
import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Icon, IconButton } from "@material-ui/core";
import clsx from "clsx";
import Icones from "assets/fornt-icons/Mainicons";

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
    width: "100%",
    maxHeight: "calc(100vh - 130px)",
    maxWidth: "500px",
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

  const handleClose = () => {
    setOpen(false);
    props.modalColsed();
  };
  console.log(props);

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
      >
        <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
          <h5 className="popup-head p-20">
            Image
            <IconButton
              style={{ position: "absolute", top: "3px", right: "0" }}
              onClick={handleClose}
            >
              {" "}
              <Icon>
                <img src={Icones.cross} alt="close" />
              </Icon>
            </IconButton>
          </h5>
          <div className="p-5 pl-16 pr-16 text-center" style={{position: "relative"}}>
            <a
              href={props.imageUrl}
              download={props.image}
              target="_blank"
              rel="noopener noreferrer"
              style={{ position: "absolute", top: "10px", right: "10px" }}
            >
              <img src={Icones.download_green} />
            </a>
            <img src={props.imageUrl} style={{width: "100%", maxHeight: "calc(100vh - 213px)"}} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DisplayImage;
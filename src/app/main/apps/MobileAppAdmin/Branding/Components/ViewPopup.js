import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Grid, Icon, IconButton } from "@material-ui/core";

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
    // width: 400,
    maxWidth: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
    maxHeight: "calc(100vh - 100px)",
    overflowY: "auto"
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
}));

const ViewPopup = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  // const theme = useTheme();

  useEffect(() => {
    console.log("ViewPopup", props);
    //eslint-disable-next-line
  }, []);

  const handleClose = () => {
    setOpen(false);
    props.modalColsed();
  };

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
        <div style={modalStyle} className={classes.paper}>
          <h5
            className="p-5"
            style={{
              textAlign: "center",
              backgroundColor: "black",
              color: "white",
            }}
          >
            Image
            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={handleClose}
            >
              <Icon style={{ color: "white" }}>close</Icon>
            </IconButton>
          </h5>
          <div className="p-5 pl-16 pr-16 text-center">
            {props.modalFlag === 1 && (
              <>
                <Grid container>
                  <Grid item xs={12}>
                    <div>
                      <span className="font-700"> Title : </span>
                      {props.modalData.title}
                    </div>
                    <div style={{ maxHeight: "150px", overflow: "auto" }}>
                      <span className="font-700"> Description : </span>{" "}
                      {props.modalData.description}
                    </div>
                  </Grid>
                  <Grid item xs={12}>
                    <div className="mt-16">
                      <img src={props.modalData.imageUrl} alt="" />
                    </div>
                  </Grid>
                </Grid>
              </>
            )}
            {props.modalFlag === 2 && (
              <img src={props.modalData.imageUrl} alt="" />
            )}
            {props.modalFlag === 3 && (
              <>
                <label>
                  <span className="font-700">Category : </span>
                  {props.modalData.forCategory_name.category_name}
                </label>
                <div className="mt-16">
                  <img src={props.modalData.imageUrl} alt="" />
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ViewPopup;

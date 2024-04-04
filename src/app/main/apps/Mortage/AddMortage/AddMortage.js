import { FuseAnimate } from "@fuse";
import { Box, Button, Grid, TextField, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import History from "@history";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import arrow_left_pagination from "../../../../../assets/fornt-icons/arrow left pagination.svg";
import { useDispatch } from "react-redux";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";

const Icones = {
  arrow_left_pagination: arrow_left_pagination,
};
const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
}));

const AddMortage = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    NavbarSetting("Mortage-Retailer", dispatch);
  }, []);
  
  return (
    <div className={clsx(classes.root, props.className, "w-full ")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        {/* <div className="flex flex-col md:flex-row container"> */}
        <Box>
          <Grid
            container
            alignItems="center"
            style={{
              paddingInline: "28px",
              marginTop: "30px",
              marginBottom: "16px",
              justifyContent: "space-between",
            }}
          >
            <Grid item xs={6} key="1">
              <FuseAnimate delay={300}>
                <Typography className="text-18 font-700">
                  Add New Order
                </Typography>
              </FuseAnimate>
            </Grid>
            <Grid
              item
              xs={6}
              style={{ textAlign: "right" }}
              // key="2"
            >
              <div className="btn-back">
                {" "}
                <img src={Icones.arrow_left_pagination} alt="" />
                <Button
                  id="btn-back"
                  className=""
                  size="small"
                  onClick={(event) => {
                    History.goBack();
                  }}
                >
                  Back
                </Button>
              </div>
            </Grid>
          </Grid>
          <div className="main-div-alll">
            <Box>
              <Grid container>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <label>Name</label>
                  <TextField name="name" variant="outlined" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <label>Name</label>
                  <TextField name="goldRate" variant="outlined" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <div>
                    <label>Name</label>
                    <TextField name="amount" variant="outlined" fullWidth />
                  </div>
                  <div>
                    <label>Note</label>
                    <TextField name="note" variant="outlined" fullWidth />
                  </div>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <label>Name</label>
                  <TextField name="percentage" variant="outlined" fullWidth />
                </Grid>
              </Grid>
            </Box>
          </div>
        </Box>
        {/* </div> */}
      </FuseAnimate>
    </div>
  );
};

export default AddMortage;

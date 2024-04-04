import { Box, Button, Chip, Grid } from "@material-ui/core";
import React, { useState } from "react";
import Filling from "./WaxCreationSubView/Filling/Filling";
import Setting from "./WaxCreationSubView/Setting/Setting";
import Polish from "./WaxCreationSubView/Polish/Polish";
import Plating from "./WaxCreationSubView/Plating/Plating";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  hideScroll: {
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "-ms-overflow-style": "none" /* IE and Edge */,
    "scrollbar-width": "none" /* Firefox */,
  },

  titleWidth: {
    width: "110px",
    paddingRight: "10px",
    [theme.breakpoints.up("md")]: {
      width: "200px",
      textAlign: "right",
    },
  },
  subMenu: {
    alignItems: "center",
    marginBlock: 15,
  },
  activeSubButton: {
    background: "#707070",
    color: "#FFFFFF",
  },
  subButton: {
    background: "#F5F5F5",
    color: "#707070",
  },
}));

const WaxCreation = () => {
  const classes = useStyles();
  const [subModalView, setSubModalView] = useState(1);
  const SubDepartment = [
    { id: 1, text: "Filling" },
    { id: 2, text: "Setting" },
    { id: 3, text: "Polish" },
    { id: 4, text: "Plating" },
  ];

  return (
    <Box sx={{ width: "100%", paddingTop: "20px" }}>
      <Grid container className={classes.subMenu}>
        <span className={classes.titleWidth}>Sub Department</span>
        <Box
          style={{
            columnGap: "10px",
            display: "flex",
            overflowX: "auto",
            marginInline: 5,
          }}
          className={`${classes.hideScroll}`}
        >
          {SubDepartment.map((btndata, idx) => (
            <Button
              className={
                btndata.id === subModalView
                  ? classes.activeSubButton
                  : classes.subButton
              }
              variant="contained"
              size="medium"
              // size="small"
              key={idx}
              onClick={(event) => setSubModalView(btndata.id)}
            >
              {btndata.text}
            </Button>
          ))}
        </Box>
      </Grid>

      {subModalView === 1 && <Filling />}
      {subModalView === 2 && <Setting />}
      {subModalView === 3 && <Polish />}
      {subModalView === 4 && <Plating />}
    </Box>
  );
};

export default WaxCreation;

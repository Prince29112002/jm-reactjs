import { Box, Button, Chip, Grid } from "@material-ui/core";
import React, { useState } from "react";
import Filling from "../WaxCreation/WaxCreationSubView/Filling/Filling"; 
import Setting from "../WaxCreation/WaxCreationSubView/Setting/Setting"; 
import Polish from "../WaxCreation/WaxCreationSubView/Polish/Polish"; 
import Plating from "../WaxCreation/WaxCreationSubView/Plating/Plating"; 
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  processItem: {
    background: "#FFDA00",
    color: "#0A0802",
  },
  shortItem: {
    background: "#fff",
    color: "inherit",
    "&:hover":{
   background: "#fff",
    borderBottom: "3px solid #415BD4",
    borderRadius: "3px !important",
 
    },
    "&:focus":{
      background: "#fff",
      borderBottom: "3px solid #415BD4",
      // borderRadius: "3px !important",
  

    }
  },
  shortItemActive: {
    background: "#4a053a",
    color: "#ffffff",
  },
  processContainer: {
    alignItems: "center",
    flexWrap: "nowrap",
    marginBlock: 15,
  },
  shortContainer: {
    alignItems: "center",
    columnGap: 5,
    flexWrap: "nowrap",
    marginBlock: 15,
  },
  hideScroll: {
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "-ms-overflow-style": "none" /* IE and Edge */,
    "scrollbar-width": "none" /* Firefox */,
  },
  shortItems: {
    columnGap: "5px",
    display: "flex",
    overflowX: "auto",
    paddingRight: 5,
  },
  titleWidth: {
    width: "110px",
    paddingRight: "10px",
    [theme.breakpoints.up("md")]: {
      // width: "200px",
      // textAlign: "right",
    },
  },
  subMenu: {
    alignItems: "center",
    marginBlock: 15,
  },
  subButton: {
    background: "#E5EAF3",
    color: "#306ff1",
  },
  activeSubButton: {
    background: "#306ff1",
    color: "white",
  },
}));

const TreeMaking = () => {
  const classes = useStyles();
  const [subModalView, setSubModalView] = useState(1);
  const SubDepartment = [
    { id: 1, text: "Filling" },
    { id: 2, text: "Setting" },
    { id: 3, text: "Polish" },
    { id: 4, text: "Plating" },
  ];
  const Process = [
    "Filling",
    "Reparing",
    "Magnate",
    "Stone Remove",
    "Setting",
    "Metal Setting",
    "Pre Polish",
    "Repeat Pre Polish",
  ];
  const ShortBy = [
    "Only Lot",
    "Only Tree",
    "With worker",
    "Without Worker",
    "Stone",
    "Gold",
    "Alloye",
    "Job Bags",
    "Silver",
    "Other Metal",
    "Brass",
  ];
  return (
    <Box sx={{ width: "100%", paddingTop: "20px" }}>
      <Grid container className={classes.subMenu}>
        <span className={clsx(classes.titleWidth,"text-15 font-700")}>Sub Department</span>
        <Box
          style={{
            columnGap: "10px",
            display: "flex",
            overflowX: "auto",
            marginInline: 5,
          }}
          className={`${classes.hideScroll}`}
        >
          {SubDepartment.map((btndata) => (
            <Button
              className={
                btndata.id === subModalView
                  ? classes.activeSubButton
                  : classes.subButton
              }
              variant="contained"
              size="medium"
              // size="small"
              // key={idx}
              onClick={(event) => setSubModalView(btndata.id)}
            >
              {btndata.text}
            </Button>
          ))}
        </Box>
      </Grid>
      <Grid container className={`${classes.processContainer}`}>
        <span className={clsx(classes.titleWidth,"text-15 font-700")}>Process</span>
        <Chip
          className={classes.processItem}
          size="medium"
          label={"Filling"}
          style={{ marginInline: 5 }}
        />
        <Box
          style={{ columnGap: "5px", display: "flex", overflowX: "auto" }}
          className={`${classes.hideScroll}`}
        >
          {Process.map((process) => (
            <Chip
            
              className={classes.processItem}
              size="medium"
              label={process}
              clickable
            />
          ))}
        </Box>
      </Grid>
      <Grid container className={classes.shortContainer}>
        <span className={clsx(classes.titleWidth,"text-15 font-700")}>Short By</span>
        <Box className={`${classes.shortItems} ${classes.hideScroll}`}>
          {ShortBy.map((shortitem) => (
            <Chip
              className={classes.shortItem}
              size="small"
              label={shortitem}
              clickable
            />
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

export default TreeMaking;

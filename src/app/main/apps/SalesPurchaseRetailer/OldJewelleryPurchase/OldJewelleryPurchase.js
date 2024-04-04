import { FuseAnimate } from '@fuse';
import { Button, Grid, Typography, makeStyles } from '@material-ui/core';
import { Link } from "react-router-dom";
import React, { useState } from 'react';
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    root: {},
    button: {
        // margin: 5,
        textTransform: "none",
        backgroundColor: "#415BD4",
        color: "white",
      },
}))

function OldJewelleryPurchase(props) {

  const classes = useStyles();

  const [authAccessArr, setAuthAccessArr] = useState([]);
 
 
  return (

    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            <Grid
             container
             alignItems="center"
             style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
            >
              <Grid item xs={6} sm={6} md={6} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                  Old jewellery purchase
                  </Typography>
                </FuseAnimate>
              </Grid>

              
               <Grid
                item
                xs={6}
                sm={6}
                md={6}
                key="2"
                style={{ justifyContent:"flex-end", display:"flex" }}
              > 
                <Link
                  to="/dashboard/sales/oldjewellerypurchase/addoldjewellerypurchase">
                  <Button  
                  style={{ textDecoration: "none", marginRight: "10px"}}
                    variant="contained"
                    // id="btn-save"
                    className={classes.button}
                    size="small"
                    onClick={(event) => {
                      //   setDefaultView(btndata.id);
                      //   setIsEdit(false);
                    }}

                  >
                    Add New
                  </Button>
                </Link> 
                 </Grid>
              </Grid>
            </div>
            </div>
            </FuseAnimate>
            </div>
  )
}
export default OldJewelleryPurchase;

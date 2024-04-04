import React, {useState,useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import ProductDevelopment from '../ProductDevelopment/ProductDevelopment'
import DesignList from "../DesignList/DesignList";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";

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
    button1: {
      margin: 5,
      textTransform: "none",
       backgroundColor: "#E7EFFF",
       color: "blue",
    },
    button: {
      margin: 5,
      textTransform: "none",
      backgroundColor: "cornflowerblue",
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
    tableFooter: {
      padding: 7,
      backgroundColor: '#E3E3E3'
    },
    searchBox: {
      padding: 6,
      fontSize: "12pt",
      borderColor: "darkgray",
      borderWidth: 1,
      borderRadius: 5,
    },
  }));


const MainDesignPage = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [modalView , setModalView] = useState("")

    useEffect(() => {
      if(props.location.state){
          setModalView(props.location.state.view )
      }else{
        setModalView(1)
      }
  },[])

  useEffect(() => {  
    NavbarSetting('Design',dispatch);
    },[]);

const isDesigner = localStorage.getItem('isDesigner')

let ButtonArr = [];
if(isDesigner != "true"){
  ButtonArr = [
    { id: 1, text: "Product Development"},
    { id: 2, text: "Variant Master" },
  ];
}else{
  ButtonArr = [
    { id: 1, text: "Product Development"}
  ];
}

    return(
        <div className={clsx(classes.root, props.className, "w-full")}>
          <FuseAnimate animation="transition.slideUpIn" delay={200}>
            <div className="flex flex-col md:flex-row container">
              <div className="flex flex-1 flex-col min-w-0">
                <Grid className="department-main-dv create-account-main-dv"
                  container
                  spacing={4}
                  alignItems="stretch"
                  style={{ margin: 0 }}
                >
                  {/* <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                  {ButtonArr.map((btndata, idx) => (
                      <Button
                        variant="contained"
                        className={btndata.id === modalView ? classes.button : classes.button1}
                        size="small"
                        key={idx}
                        onClick={(event) => setModalView(btndata.id)}
                      >
                        {btndata.text}
                      </Button>
                    ))}
                  </Grid> */}
                  <Grid className="title-search-input"
                    item
                    xs={12}
                    sm={4}
                    md={9}
                    key="2"
                    style={{ textAlign: "right"}}
                  >
                    {/* <label style={{ display: "contents" }}> Search  :   </label>
                    <input id="input-ml" type="search" className={classes.searchBox}  onChange={(event) => setSearchData(event.target.value)} /> */}
                  
                  </Grid>
                </Grid>
              {modalView === 1 && <ProductDevelopment  props={props}/>}
              {modalView === 2 && <DesignList />}
              
              </div>
            </div>
          </FuseAnimate>
        </div>
      );
}

export default MainDesignPage
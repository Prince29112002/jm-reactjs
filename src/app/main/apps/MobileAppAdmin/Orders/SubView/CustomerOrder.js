import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import CustOrdersComponent from "../Components/CustOrdersComponent";

const useStyles = makeStyles((theme) => ({
    root: {},
    button1: {
        margin: 5,
        textTransform: "none",
        backgroundColor: "#F5F5F5",
        color: "gray",
    },
    button: {
        margin: 5,
        textTransform: "none",
        backgroundColor: "#707070",
        color: "white",
    },
}));

const CustomerOrder = ({props,Statuslist}) => {
    const classes = useStyles();

    const [modalView, setModalView] = useState("");
    const [filter, setfilter] = useState(false)//show filter

    useEffect(() => {
        if(props.location.state){
            setModalView(props.location.state.subTab)
        }else{
            setModalView("0")
        }
    },[props])

    
    return (
        <div className={clsx(classes.root, props.className, "w-full")} style={{ height: 'calc(100vh - 60px)', overflowX: 'hidden' }}>
            {/* <FuseAnimate animation="transition.slideUpIn" delay={200}> */}
                <div className="flex flex-col md:flex-row container">
                    <div className="flex flex-1 flex-col min-w-0">
                        <Grid className="department-main-dv create-account-main-dv"
                            container
                            spacing={4}
                            alignItems="stretch"
                            style={{ margin: 0 }}
                        >
                            <Grid item xs={12} sm={12} md={12} key="1" style={{ padding: 0 }}>
                                {Statuslist.map((btndata, idx) => (
                                    <Button
                                        // variant="contained"
                                        className={btndata.value == modalView ?  "btn-hover mr-16" : "btn mr-16"}
                                        size="small"
                                        key={idx}
                                        onClick={(event) => {
                                            setModalView(btndata.value)
                                            setfilter(false)
                                        }}
                                    >
                                        {btndata.label}
                                    </Button>
                                ))}
                            </Grid>
                            {/* <Grid item xs={2} sm={2} md={2} key="2" style={{ padding: 0, textAlign: "right" }}>
                                <IconButton
                                    style={{ padding: "0", margin: 5 }}
                                    onClick={(ev) => {
                                        ev.preventDefault();
                                        ev.stopPropagation();
                                        setfilter(!filter)
                                    }}
                                >

                                    <Icon className="mr-8" >
                                        filter_list
                                    </Icon>
                                    Filter
                                </IconButton>
                            </Grid> */}

                        </Grid>

                        {modalView === "0" && <CustOrdersComponent filter={filter} tabFilter={modalView} Statuslist={Statuslist} props={props}/>}
                        {modalView === "1" && <CustOrdersComponent filter={filter} tabFilter={modalView} Statuslist={Statuslist} props={props}/>}
                        {modalView === "2" && <CustOrdersComponent filter={filter} tabFilter={modalView} Statuslist={Statuslist} props={props}/>}
                        {modalView === "3" && <CustOrdersComponent filter={filter} tabFilter={modalView} Statuslist={Statuslist} props={props}/>}
                        {modalView === "4" && <CustOrdersComponent filter={filter} tabFilter={modalView} Statuslist={Statuslist} props={props}/>}
                        {modalView === "5" && <CustOrdersComponent filter={filter} tabFilter={modalView} Statuslist={Statuslist} props={props}/>}
                        {modalView === "6" && <CustOrdersComponent filter={filter} tabFilter={modalView} Statuslist={Statuslist} props={props}/>}
                        {modalView === "7" && <CustOrdersComponent filter={filter} tabFilter={modalView} Statuslist={Statuslist} props={props}/>}
                        {modalView === "8" && <CustOrdersComponent filter={filter} tabFilter={modalView} Statuslist={Statuslist} props={props}/>}
                        {modalView === "9" && <CustOrdersComponent filter={filter} tabFilter={modalView} Statuslist={Statuslist} props={props}/>}

                    </div>
                </div>
            {/* </FuseAnimate> */}
        </div>
    );
};

export default CustomerOrder;

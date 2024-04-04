import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import History from "@history";
import Loader from "app/main/Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import TypeZeroComp from "../Components/TypeZeroComp";
import TypeOneComp from "../Components/TypeOneComp";
import TypeThreeComp from "../Components/TypeThreeComp";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

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
    tableRowPad: {
        padding: 7,
    },
}));

const OrderDetails = (props) => {

    var propsData = props.location.state;

    const [orderType, setOrderType] = useState("")

    const [apiData, setApiData] = useState([]);
    const classes = useStyles();

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const [subTab, setSubTab] = useState("")
    const [mainTab, setMainTab] = useState("")

    const [isEdit, setIsEdit] = useState(false)

    const [isView, setIsView] = useState(false)
    useEffect(() => {
        NavbarSetting('Mobile-app Admin', dispatch)
    }, [])

    useEffect(() => {
        if (props.location.state) {
            setMainTab(props.location.state.mainTab)
            setSubTab(props.location.state.subTab)
        }
    }, [props])

    useEffect(() => {
        if (propsData !== undefined) {
            setIsEdit(propsData.isEdit)
            setIsView(propsData.isView)
            getOrderDetails(propsData.id)
            setOrderType(propsData.order_type)
        }
    }, []);

    useEffect(() => {
        if (loading) {
            setTimeout(() => setLoading(false), 7000);
        }
    }, [loading]);


    function getOrderDetails(id) {
        setLoading(true);
        axios
            .get(Config.getCommonUrl() + "api/order/details/" + id)
            .then(function (response) {
                if (response.data.success === true) {
                    console.log(response);
                    let tempData = response.data.data;
                    if (propsData.order_type === 0 || propsData.order_type === 1 || propsData.order_type === 2 || 
                        propsData.order_type === 3 || propsData.order_type === 4) {
                        setApiData(tempData);
                    } else {
                        setOrderType(5)
                        setApiData(tempData);
                    }
                    setLoading(false);
                    // setData(response.data);
                } else {
                    dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
                }
            })
            .catch(function (error) {
                setLoading(false);
                handleError(error, dispatch, {api : "api/order/details/" + id})

            });
    }

    return (
        <div className={clsx(classes.root, props.className, "w-full")}>
            <FuseAnimate animation="transition.slideUpIn" delay={200}>
                <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
                        <Grid
                            className="department-main-dv"
                            container
                            spacing={4}
                            alignItems="stretch"
                            style={{ margin: 0 }}
                        >
                            <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                                        Orders
                                    </Typography>
                                </FuseAnimate>

                                {/* <BreadcrumbsHelper />  */}
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={6}
                                key="2"
                                style={{ textAlign: "right" }}
                            >
                <div className="btn-back">
                  {" "}
                  <img src={Icones.arrow_left_pagination} />
                                <Button
                    id="btn-back"
                                    size="small"
                                    onClick={(event) => {
                                        History.push('/dashboard/mobappadmin/orders', { mainTab: mainTab, subTab: subTab })
                                    }}
                                >
                                    Back
                                </Button>
                </div>
                            </Grid>
                        </Grid>

                        {loading && <Loader />}
            <div className="main-div-alll">
            / <b>{propsData.order_number}</b>
                        
                        {/* <div className="mx-16 mt-76 mb-76"> */}
                        <div className="mx-16 mt-30 mb-76">
{                    console.log(orderType)}

                            {orderType === 0 &&
                                <TypeZeroComp apiData={apiData} isEdit={isEdit} isView={isView} callApi={getOrderDetails} />
                            }

                            {/* {orderType === 1 && not in cutomer order 1 is bulk order, not getting order type so manually added 5
                                <TypeOneComp apiData={apiData} isEdit={isEdit} isView={isView} callApi={getOrderDetails}/>
                            } */}

                            {orderType === 2 &&
                                // <TypeTwoComp apiData={apiData} />
                                <TypeThreeComp apiData={apiData} callApi={getOrderDetails} isEdit={isEdit} isView={isView} />
                            }

                            {orderType === 3 &&
                                <TypeThreeComp apiData={apiData} callApi={getOrderDetails} isEdit={isEdit} isView={isView} />
                            }

                            {orderType === 4 &&
                                <TypeThreeComp apiData={apiData} callApi={getOrderDetails} isEdit={isEdit} isView={isView} />
                            }

                            {/* below for bulk order details view manually added ordertype 5 */}
                            {orderType === 5 &&
                                <TypeOneComp apiData={apiData} isEdit={isEdit} isView={isView} callApi={getOrderDetails} />
                            }
                        </div>
                        </div>

                    </div>
                </div>
            </FuseAnimate>
        </div>
    );
};

export default OrderDetails;

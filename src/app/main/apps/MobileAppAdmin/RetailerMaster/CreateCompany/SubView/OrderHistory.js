import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import Loader from "app/main/Loader/Loader";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import TablePagination from '@material-ui/core/TablePagination';
import moment from "moment";
import History from "@history";
import handleError from "app/main/ErrorComponent/ErrorComponent";

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
    hoverClass: {
        color: "#1e90ff",
        "&:hover": {
          cursor: "pointer",
        },
      },
}));

const OrderHistory = (props) => {
    const classes = useStyles();
    const propsData = props.propsData
    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [page, setPage] = React.useState(0);
    const [count, setCount] = useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    useEffect(() => {
        if (loading) {
            setTimeout(() => setLoading(false), 7000);
        }

    }, [loading]);

    useEffect(() => {
        console.log("OrderHistory", props);
        // setFilterFlag(props.filter)
        if (props.client_id) {
            setFilters("")
        }
        // if (props.tabFilter !== tabFilter) {
        //     setTabFilter(props.tabFilter)
        // }
        //eslint-disable-next-line
    }, [props]);

    function setFilters(tempPageNo) {
        // api/order/distributor-order-history/2?page=1
        let url = "api/order/distributor-order-history/" + props.client_id 

        if (page !== "") {
            if (tempPageNo === "") {
                url = url + "?page=" + Number(page + 1)

            } else {
                url = url + "?page=" + tempPageNo
            }
        }

        console.log(url);
        if (tempPageNo === "") {
            getOrdersDetails(url);
        } else {
            if (count > apiData.length) {
                getOrdersDetails(url);
            } else {
                // console.log("else count", count, "apiData", apiData.length)
            }
        }
    }

    function getOrdersDetails(url) {
        setLoading(true);
        axios
            .get(Config.getCommonUrl() + url)
            .then(function (response) {
                setLoading(false);
                console.log(response);
                if (response.data.success === true) {
                    let rows = response.data.data.rows
                    console.log(rows)
                    setCount(Number(response.data.data.count))
                    if (apiData.length === 0) {
                        console.log("if")
                        setApiData(rows)
                    } else {
                        // console.log("else", apiData)
                        // setApiData(...apiData, ...rows)
                        setApiData((apiData) => [...apiData, ...rows]);
                        // console.log([...apiData, ...rows])
                    }
                } else {
                    dispatch(Actions.showMessage({ message: response.data.message }));
                    setApiData([]);
                }
            })
            .catch(function (error) {
                // console.log(error);
                setLoading(false);
                handleError(error, dispatch, {api : url})
            });
    }

    function handleChangePage(event, newPage) {
        console.log(newPage)
        let tempPage = page;
        setPage(newPage);
        if (newPage > tempPage) {
            setFilters(Number(newPage + 1))
        }
    }

    const openHandler = (path, data) => {
        History.push(path, data);
      };

    return (
        <div>

            {/* {loading && <Loader />} */}
            

            <Paper className={clsx(classes.tabroot, "table-responsive")}>
                <MaUTable className={classes.table}>
                    <TableHead>

                        <TableRow>
                            <TableCell className={classes.tableRowPad} style={{ width: "110px"}}>Order No</TableCell>
                            <TableCell className={classes.tableRowPad} style={{ width: "110px"}}>Date</TableCell>
                            <TableCell className={classes.tableRowPad} style={{ width: "110px"}}>Order Type</TableCell>
                            <TableCell className={classes.tableRowPad} style={{ width: "180px"}}>Status</TableCell>
                            <TableCell className={classes.tableRowPad} style={{ width: "80px" }}>Pieces</TableCell>
                            <TableCell className={classes.tableRowPad} style={{ width: "100px"}}>Gross Weight</TableCell>
                            <TableCell className={classes.tableRowPad} style={{ width: "100px"}}>Net Weight</TableCell>
                            <TableCell className={classes.tableRowPad} style={{ width: "80px" }}>Karat</TableCell>
                            {/* <TableCell className={classes.tableRowPad}>Subject</TableCell> */}
                            <TableCell className={classes.tableRowPad} style={{ width: "200px" }}>Remarks</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {apiData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((element, index) => (
                                <TableRow key={index}>
                                    <TableCell className={clsx( classes.tableRowPad, classes.hoverClass)} style={{ width: "110px" }}>
                                        {/* order No */}
                                        <span
                                            onClick={(ev) => {
                                                ev.preventDefault();
                                                ev.stopPropagation();
                                                openHandler(
                                                "/dashboard/mobappadmin/orders/orderView",
                                                {
                                                    id: element.id,
                                                    order_type: element.order_type,
                                                    order_number: element.order_number,
                                                    isEdit: false,
                                                    isView: true,
                                                    // hispage: page,
                                                    // hiscount: count,
                                                    // hisapiData: apiData,
                                                    tabs:2,
                                                    hisfrom: props?.type ? "/dashboard/mobappadmin/crm/editcrm" 
                                                    : "/dashboard/mobappadmin/retailermaster/createretailer",
                                                    propsData : props?.propsData,
                                                    modalTab : props?.modalTab,
                                                    page: propsData?.page, 
                                                    search: propsData?.search, 
                                                    apiData: propsData?.apiData, 
                                                    count: propsData?.count,
                                                    dId : propsData?.row,
                                                    bView : propsData?.isViewOnly,
                                                    bEdit : propsData?.isEdit,
                                                    from : '/dashboard/mobappadmin/retailermaster'
                                                }
                                                );
                                            }}
                                            >
                                            {" "}
                                            {element.order_number}
                                            </span>
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad} style={{ width: "110px" }}>
                                        {moment(element.created_at).format(
                                            "DD-MM-YYYY"
                                        )}
                                    </TableCell>
                                    
                                    <TableCell className={classes.tableRowPad} style={{ width: "110px" }}>
                                        {element.order_type === 0 && "Customer Order" }
                                        {element.order_type === 1 && "Bulk Order"}
                                        {element.order_type === 2 && "Cart Order"}
                                        {element.order_type === 3 &&  "Exhibition Order"}
                                        {element.order_type === 4 &&  "Link Order"}
                                    </TableCell>
                                    
                                    <TableCell className={classes.tableRowPad} style={{ width: "150px" }}>
                                    {element.order_status === 1 && "New Order" }
                                        {element.order_status === 2 && "Order Accepted"}
                                        {element.order_status === 3 && "Order Confirmed by Party/Client"}
                                        {element.order_status === 4 &&  "Order Processed (Awaiting Intimation by Distributor)"}
                                        {element.order_status === 5 &&  "In Production (WIP)"}
                                        {element.order_status === 6 &&  "Order Partially Dispatched"}
                                        {element.order_status === 7 &&  "Order Fully Dispatched"}
                                        {element.order_status === 8 &&  "Party Cancelled"}
                                        {element.order_status === 9 &&  "Declined by Company"}
                                    </TableCell>
                                    
                                    <TableCell className={classes.tableRowPad} style={{ width: "80px" }}>
                                        {element.total_pieces}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad} style={{ width: "100px" }}>
                                        {element.total_gross_weight ? element.total_gross_weight : "-"}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad} style={{ width: "100px" }}>
                                        {element.total_net_weight ? element.total_net_weight : "-"}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad} style={{ width: "80px" }}>
                                        {element.karat}
                                    </TableCell>
                                    {/* <TableCell className={classes.tableRowPad}>
                                        customer order
                                    </TableCell> */}
                                    <TableCell className={classes.tableRowPad} style={{width: "200px", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {element.final_order_remark}
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </MaUTable>
                <TablePagination
                    // rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage=''
                    component="div"
                    // count={apiData.length}
                    count={count}
                    rowsPerPage={10}
                    page={page}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                    }}
                    onPageChange={handleChangePage}
                // onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>

        </div>
    );
};

export default OrderHistory;

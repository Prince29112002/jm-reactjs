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
import TablePagination from "@material-ui/core/TablePagination";
import moment from "moment";
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
}));

const OrderHistory = (props) => {
  const classes = useStyles();
  const propsData = props.propsData

  // const [filterFlag, setFilterFlag] = useState(false)// show/hide filter

  // const [karat, setKarat] = useState("")

  // const [tabFilter, setTabFilter] = useState("")

  const [apiData, setApiData] = useState([]);

  // const [dtFilter, setDtFilter] = useState("")

  // const [pcsFilter, setPcsFilter] = useState("")

  // const [fromWtFilter, setFromWtFilter] = useState("")
  // const [frmWtErr, setFrmWtErr] = useState("")

  // const [toWtFilter, setToWtFilter] = useState("")
  // const [toWtErr, setToWtErr] = useState("")

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const [page, setPage] = React.useState(0);

  const [count, setCount] = useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // const [openFlag, setOpenFlag] = useState(false);

  // const [orderId, setOrderId] = useState("")


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
      console.log(props)
      let url
      if(props.type === "Distributor"){
          url = "api/order/distributor-order-history/" + props.client_id
      }else{
          url = "api/order/retailer-order-history/" + props.client_id 
      }

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
      {loading && <Loader />}
      <div className="main-div-alll">
        <Paper className={clsx(classes.tabroot, "table-responsive")}>
          <MaUTable className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableRowPad}>Order No</TableCell>
                <TableCell className={classes.tableRowPad}>Date</TableCell>
                <TableCell className={classes.tableRowPad}>
                  Order Type
                </TableCell>
                <TableCell className={classes.tableRowPad}>Status</TableCell>
                <TableCell className={classes.tableRowPad}>Pieces</TableCell>
                <TableCell className={classes.tableRowPad}>
                  Gross Weight
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  Net Weight
                </TableCell>
                <TableCell className={classes.tableRowPad}>Karat</TableCell>
                {/* <TableCell className={classes.tableRowPad}>Subject</TableCell> */}
                <TableCell
                  className={classes.tableRowPad}
                  style={{ textAlign: "left" }}
                >
                  Remarks
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apiData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((element, index) => (
                  <TableRow key={index}>
                    <TableCell className={classes.tableRowPad}>
                      {/* order No */}
                      {/* {element.order_number} */}
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
                                                    hisfrom: props?.type ? "/dashboard/mobappadmin/crm/editcrm" : "/dashboard/mobappadmin/retailermaster/createretailer",
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
                    <TableCell className={classes.tableRowPad}>
                      {moment(element.created_at).format("DD-MM-YYYY")}
                    </TableCell>
                    {element.order_type === 0 && (
                      <TableCell className={classes.tableRowPad}>
                        Customer Order
                      </TableCell>
                    )}
                    {element.order_type === 1 && (
                      <TableCell className={classes.tableRowPad}>
                        Bulk Order
                      </TableCell>
                    )}
                    {element.order_type === 2 && (
                      <TableCell className={classes.tableRowPad}>
                        Cart Order
                      </TableCell>
                    )}
                    {element.order_type === 3 && (
                      <TableCell className={classes.tableRowPad}>
                        Exhibition Order
                      </TableCell>
                    )}
                    {element.order_status === 1 && (
                      <TableCell className={classes.tableRowPad}>
                        New Order
                      </TableCell>
                    )}
                    {element.order_status === 2 && (
                      <TableCell className={classes.tableRowPad}>
                        Accepted
                      </TableCell>
                    )}
                    {element.order_status === 3 && (
                      <TableCell className={classes.tableRowPad}>
                        Completed
                      </TableCell>
                    )}
                    {element.order_status === 4 && (
                      <TableCell className={classes.tableRowPad}>
                        Customer Cancelled
                      </TableCell>
                    )}
                    {element.order_status === 5 && (
                      <TableCell className={classes.tableRowPad}>
                        Declined
                      </TableCell>
                    )}
                    <TableCell className={classes.tableRowPad}>
                      {element.total_pieces}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {element.total_gross_weight
                        ? element.total_gross_weight
                        : "-"}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {element.total_net_weight
                        ? element.total_net_weight
                        : "-"}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {element.karat}
                    </TableCell>
                    {/* <TableCell className={classes.tableRowPad}>
                      {/* subject 
                      customer order
                    </TableCell> */}
                    <TableCell
                      className={classes.tableRowPad}
                      style={{ textAlign: "left" }}
                    >
                      {element.final_order_remark}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </MaUTable>
          <TablePagination
            // rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage=""
            component="div"
            // count={apiData.length}
            count={count}
            rowsPerPage={10}
            page={page}
            backIconButtonProps={{
              "aria-label": "Previous Page",
            }}
            nextIconButtonProps={{
              "aria-label": "Next Page",
            }}
            onPageChange={handleChangePage}
            // onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
};

export default OrderHistory;

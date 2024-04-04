import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  Icon,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import moment from "moment";
import { withRouter } from "react-router-dom";
import * as XLSX from "xlsx";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Icones from "assets/fornt-icons/Mainicons";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import Loader from "app/main/Loader/Loader";
import History from "@history";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
  },
  tabroot: {
    overflowY: "auto",
  },
  table: {
    minWidth: 1500,
  },
  tableRowPad: {
    padding: 7,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "260px",
    height: "37px",
    color: "#CCCCCC",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter",
  },
  search: {
    display: "flex",
    border: "1px solid #cccccc",
    float: "right",
    height: "38px",
    width: "260px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
  },
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
  },
}));

const PlanningOrders = (props) => {
  // const csvLink = React.useRef(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { planningOrdersData = [] } = props;
  const [isExpert, setIsExpert] = useState(false);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [apiPdfData, setApiPdfData] = useState({});

  const [tabFilter, setTabFilter] = useState("");
  const [planningOrdersList, setPlanningOrdersList] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchData, setSearchData] = useState({
    orderNo: "",
    orderDate: "",
    shipingDate: "",
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchData && searching) {
        setPlanningOrdersList([]);
        setCount(0);
        setPage(0);
        setFilters();
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchData]);

  console.log(searchData);

  function getPlanningOrders(url) {
    setLoading(true);
    Axios.get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);

          if (planningOrdersList.length === 0) {
            console.log("if");
            setPlanningOrdersList(response.data.data);
          } else {
            console.log("else", planningOrdersList);
            // setApiData(...apiData, ...rows)
            // setPlanningOrdersList(response.data.data);
            setPlanningOrdersList((apiData) => [
              ...apiData,
              ...response.data.data,
            ]);
            // console.log([...apiData, ...rows])
          }
          setCount(response.data.count);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: url,
        });
      });
  }

  function getPdfData(id) {
    Axios.get(
      Config.getCommonUrl() + `api/productionreport/order/summation/${id}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setApiPdfData(response.data.data);
          checkforPrint();
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/productionreport/order/summation/${id}`,
        });
      });
  }

  useEffect(() => {
    setFilters();
  }, []);

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);

  const handleAfterPrint = () => {
    //React.useCallback
    console.log("`onAfterPrint` called"); // tslint:disable-line no-console
    //resetting after print
    // checkAndReset()
  };

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        resolve();
      }, 10);
    });
  }, []);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);

  function getDateAndTime() {
    return (
      new Date().getDate() +
      "_" +
      (new Date().getMonth() + 1) +
      "_" +
      new Date().getFullYear() +
      "_" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes()
    );
  }

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Order_Summary" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    removeAfterPrint: true,
  });

  function checkforPrint() {
    console.log("checkforPrint");
    handlePrint();
  }
  
  function editHandler(id) {
    props.history.push(
      "/dashboard/planningdashboard/planningorders/createplanandlot",
      {
        row: id,
      }
    );
  }

  // const filteredData = planningOrdersList.filter((row) => {
  //   const searchDataLower = searchData.toLowerCase();
  //   const fieldsToSearch = [
  //     "customer_name",
  //     "order_number",
  //     "karat",
  //     "total_pieces",
  //     "total_gross_weight",
  //     "total_stone_weight",
  //     "total_net_weight",
  //     "weight",
  //   ];

  //   return fieldsToSearch.some((field) => {
  //     const fieldValue = String(row[field]).toLowerCase();
  //     return fieldValue.includes(searchDataLower);
  //   });
  // });

  const handleSearchChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setSearching(true);
  };

  const exportToExcel = (type, fn, dl) => {
    setIsExpert(true);
    if (planningOrdersList.length > 0) {
      const wb = XLSX.utils.book_new();

      // Export the first table
      const tbl1 = document.getElementById("tbl_exporttable_to_xls");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(wb, fn || `Planning Orders.${type || "xlsx"}`);
    } else {
      setIsExpert(false);
      dispatch(
        Actions.showMessage({
          message: "Can not Export Empty Data",
          variant: "error",
        })
      );
    }
    setIsExpert(false);
  };

  function editOrderHandler(element) {
    console.log(element);
    History.push("/dashboard/planningdashboard/planningorders/orderView", {
      id: element.id,
      order_type: 2,
      order_number: element.order_number,
      mainTab: 0,
      subTab: tabFilter,
      isEdit: true,
      isView: false,
    });
  }

  function viewHandler(element) {
    History.push("/dashboard/planningdashboard/planningorders/orderView", {
      id: element.id,
      order_type: 2,
      order_number: element.order_number,
      mainTab: 0,
      subTab: tabFilter,
      isEdit: false,
      isView: true,
    });
  }

  function pdfHandler(element) {
    getPdfData(element.id);
  }

  function setFilters(tempPageNo) {
    let url = "api/ProductionOrder/orders/listing?";

    if (page !== "") {
      if (!tempPageNo) {
        url = url + "page=" + 1;
      } else {
        url = url + "page=" + tempPageNo;
      }
    }

    if (searchData.orderDate !== "") {
      url =
        url +
        "&order_date=" +
        moment(searchData.orderDate).format("DD-MM-YYYY");
    }

    if (searchData.shipingDate !== "") {
      url =
        url +
        "&shiping_date=" +
        moment(searchData.shipingDate).format("DD-MM-YYYY");
    }

    if (searchData.orderNo !== "") {
      url = url + "&order_no=" + searchData.orderNo;
    }

    console.log(url, "---------", tempPageNo);

    if (!tempPageNo) {
      console.log("innnnnnnnnnnnnnn444444");
      getPlanningOrders(url);
    } else {
      if (count > planningOrdersList.length) {
        getPlanningOrders(url);
      }
    }
  }

  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 10 > planningOrdersList.length) {
      setFilters(Number(newPage + 1));
    }
  }


  return (
    <>
      <Grid
        container
        spacing={2}
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Grid item xs={4} style={{ marginTop: "18px" }}>
          <div className={classes.search} component="form">
            <InputBase
              name="orderNo"
              className={classes.input}
              placeholder="Search (By Order No.)"
              inputProps={{ "aria-label": "search" }}
              value={searchData.orderNo}
              onChange={handleSearchChange}
            />
            <IconButton
              type="submit"
              className={classes.iconButton}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
          </div>
        </Grid>

        <Grid item xs={3} lg={2}>
          <label>Order Date</label>
          <TextField
            type="date"
            name="orderDate"
            value={searchData.orderDate}
            onChange={handleSearchChange}
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={3} lg={2}>
          <label>Shipment Date</label>
          <TextField
            type="date"
            name="shipingDate"
            value={searchData.shipingDate}
            onChange={handleSearchChange}
            variant="outlined"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={2} lg={1} style={{ paddingTop: "23px" }}>
          <Button
            variant="contained"
            aria-label="Register"
            onClick={(event) => {
              exportToExcel("xlsx");
            }}
            size="small"
            id="voucher-list-btn"
            className={classes.button}
            style={{ marginBlock: 5, background: "#415BD4", color: "#FFFFFF" }}
          >
            Download
          </Button>
        </Grid>
      </Grid>

      <div className="mt-16">
        <TablePagination
          labelRowsPerPage=""
          component="div"
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
          style={{ background: "#FFFFFF" }}
        />
        {loading && <Loader />}
        <Paper className={classes.tabroot}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableRowPad} align="left">
                  Order No
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Client Name
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Purity
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Qty
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Gross weight
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Stone Weight
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Net Weight
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Status
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Order Date
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Shipment Date
                </TableCell>
                <TableCell
                  className={classes.tableRowPad}
                  align="center"
                  style={{ width: "19%" }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {planningOrdersList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => (
                  <TableRow key={i}>
                    {/* component="th" scope="row" */}

                    <TableCell align="left" className={classes.tableRowPad}>
                      {row.order_number}
                    </TableCell>

                    <TableCell align="left" className={classes.tableRowPad}>
                      {row.distributor
                        ? row.distributor.client.name
                        : row.leadUsersName.full_name}
                    </TableCell>

                    <TableCell align="left" className={classes.tableRowPad}>
                      {row.karat}
                    </TableCell>

                    <TableCell align="left" className={classes.tableRowPad}>
                      {row.total_pieces}
                    </TableCell>

                    <TableCell align="left" className={classes.tableRowPad}>
                      {row.total_gross_weight}
                    </TableCell>

                    <TableCell align="left" className={classes.tableRowPad}>
                      {row.total_stone_weight}
                    </TableCell>

                    <TableCell align="left" className={classes.tableRowPad}>
                      {row.total_net_weight}
                    </TableCell>

                    <TableCell align="left" className={classes.tableRowPad}>
                      {"Pending"}
                    </TableCell>

                    <TableCell align="left" className={classes.tableRowPad}>
                      {moment.utc(row.created_at).format("DD-MM-YYYY")}
                    </TableCell>

                    <TableCell align="left">
                      {row.shipment_date
                        ? moment(row.shipment_date).format("DD-MM-YYYY")
                        : "-"}
                    </TableCell>

                   <TableCell className={classes.tableRowPad}>

                    <IconButton
                        style={{ padding: "0" }}
                        onClick={(ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          viewHandler(row);
                        }}
                      >
                        <Icon className="mr-8 view-icone">
                          <img src={Icones.view} alt="" />
                        </Icon>
                      </IconButton>

                      <Button
                        style={{
                          width: "95px",
                          backgroundColor: "#415bd4",
                          marginRight: "9px",
                        }}
                        variant="contained"
                        color="primary"
                        aria-label="Register"
                        onClick={(ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          editOrderHandler(row);
                        }}
                      >
                        Edit Bom
                      </Button>

                      <Button
                        style={{ width: "153px", backgroundColor: "#415bd4" }}
                        variant="contained"
                        color="primary"
                        aria-label="Register"
                        onClick={(ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          editHandler(row.id);
                        }}
                      >
                        Create Plan & Lot
                      </Button>
                    </TableCell>

                    {/* <TableCell className={classes.tableRowPad}></TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <Table
            className={classes.table}
            id="tbl_exporttable_to_xls"
            style={{ display: "none" }}
          >
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableRowPad} align="left">
                  Order No
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Client Name
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Purity
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Qty
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Gross weight
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Stone Weight
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Net Weight
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Status
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Order Date
                </TableCell>
                <TableCell className={classes.tableRowPad} align="left">
                  Shipment Date
                </TableCell>
                <TableCell
                  className={classes.tableRowPad}
                  style={{ textAlign: "center" }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {planningOrdersList.map((row, i) => (
                <TableRow key={i}>
                  {console.log(row)}
                  {/* component="th" scope="row" */}

                  <TableCell align="left" className={classes.tableRowPad}>
                    {row.order_number}
                  </TableCell>

                  <TableCell align="left" className={classes.tableRowPad}>
                    {row.distributor
                      ? row.distributor.client.name
                      : row.leadUsersName.full_name}
                  </TableCell>

                  <TableCell align="left" className={classes.tableRowPad}>
                    {row.karat}
                  </TableCell>

                  <TableCell align="left" className={classes.tableRowPad}>
                    {row.total_pieces}
                  </TableCell>

                  <TableCell align="left" className={classes.tableRowPad}>
                    {row.total_gross_weight}
                  </TableCell>

                  <TableCell align="left" className={classes.tableRowPad}>
                    {row.total_stone_weight}
                  </TableCell>

                  <TableCell align="left" className={classes.tableRowPad}>
                    {row.total_net_weight}
                  </TableCell>

                  <TableCell align="left" className={classes.tableRowPad}>
                    {"Pending"}
                  </TableCell>

                  <TableCell align="left" className={classes.tableRowPad}>
                    {moment.utc(row.created_at).format("DD-MM-YYYY")}
                  </TableCell>

                  <TableCell align="left">
                    {row.shipment_date
                      ? moment(row.shipment_date).format("DD-MM-YYYY")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    </>
  );
};

export default withRouter(PlanningOrders);

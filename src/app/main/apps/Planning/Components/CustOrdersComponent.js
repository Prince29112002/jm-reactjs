import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import Modal from "@material-ui/core/Modal";
import { Button, TextField } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Loader from "app/main/Loader/Loader";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import TablePagination from "@material-ui/core/TablePagination";
import moment from "moment";
import { Icon, IconButton } from "@material-ui/core";
import ChangeStatus from "./ChangeStatus";
import History from "@history";
import Select, { createFilter } from "react-select";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 600,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    // height: "100%",
    maxHeight: "calc(100vh - 310px)",
  },
  table: {
    minWidth: 1500,
  },
  tableRowPad: {
    padding: 7,
  },
  formControl: {
    // margin: theme.spacing(3),
  },
  group: {
    // margin: theme.spacing(1, 0),
    marginTop: "4px",
    flexDirection: "row",
  },
  hoverClass: {
    color: "#1e90ff",
    "&:hover": {
      cursor: "pointer",
    },
  },
  selectBox: {
    display: "inline-block",
  },
}));

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const CustOrdersComponent = (props) => {
  const subtabsIndex = props.subtabsIndex;
  console.log(subtabsIndex);
  const theme = useTheme();
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [filterFlag, setFilterFlag] = useState(false); // show/hide filter

  const [karat, setKarat] = useState("");
  const [orderType, setOrderType] = useState("");
  const [tabFilter, setTabFilter] = useState("");

  const [apiData, setApiData] = useState([]);

  const [dtFilter, setDtFilter] = useState("");

  const [pcsFilter, setPcsFilter] = useState("");

  const [fromWtFilter, setFromWtFilter] = useState("");
  const [frmWtErr, setFrmWtErr] = useState("");

  const [toWtFilter, setToWtFilter] = useState("");
  const [toWtErr, setToWtErr] = useState("");

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const [page, setPage] = React.useState(0);

  const [count, setCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [openFlag, setOpenFlag] = useState(false);

  const [orderId, setOrderId] = useState("");
  const [orderNum, setOrderNum] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [format, setFormat] = useState("1");
  const [fileType, setFileType] = useState("0");
  const ProductionOrderStatus = [
    { id: 1, name: "New Order" },
    { id: 2, name: "Pending Order" },
    { id: 3, name: "Transfer Order" },
    { id: 4, name: "Completed" },
    { id: 5, name: "Approved" },
  ];

  const [searchData, setSearchData] = useState({
    dtFilter: "",
    karat: "",
    pcsFilter: "",
    remark: "",
    total_net_weight: "",
    total_gross_weight: "",
    username: "",
    retailer_name: "",
    distributor_name: "",
    order_number: "",
    order_type: "",
    order_status: "",
  });

  const handleTypeChange = (value) => {
    setSearchData((prevState) => ({
      ...prevState,
      ["order_type"]: value ? value : "",
    }));
  };

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  // useEffect(() => {
  //     setFilterFlag(props.filter)
  //     if (props.tabFilter !== tabFilter) {
  //         setTabFilter(props.tabFilter)
  //         setRowsPerPage(10)
  //     }
  //     //eslint-disable-next-line
  // }, [props]);

  // useEffect(() => {
  //     const timeout = setTimeout(() => {
  //         if (searchData) {
  //             ApplyFilter();
  //         }
  //     }, 800);
  //     return () => {
  //         clearTimeout(timeout);
  //     };
  // }, [searchData])
  useEffect(() => {
    getOrdersDetails();
  }, []);
  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };
  const handleModalClose = () => {
    setOpenFlag(false);
    setOrderNum("");
    setOrderId("");
  };
  const clearFilters = () => {
    setPage(0);
    setApiData([]);
    setCount(0);
    setLoading(true);
    setKarat("");
    setPcsFilter("");
    setFromWtFilter("");
    setOrderType("");
    setToWtFilter("");
    setDtFilter("");
    setFrmWtErr("");
    setToWtErr("");
    setRowsPerPage(10);
    let url = "api/order?order_status=" + props.tabFilter + "&page=" + 1;

    // getOrdersDetails(url)
  };

  const ApplyFilter = () => {
    setLoading(true);
    setApiData([]);
    setCount(0);
    setPage(0);
    // setTimeout(() => setFilters(1), 1500);
    let url = "";
    if (props.tabFilter === 0) {
      url = "api/order/allorder?";
    } else {
      url = "api/order?order_status=" + props.tabFilter + "&page=" + 1;
    }

    if (karat !== "" || searchData.karat !== "") {
      const karatData = karat ? karat.value : searchData.karat;
      url = url + "&karat=" + karatData;
    }

    if (searchData.order_status !== "" && searchData.order_status.value !== 0) {
      url = url + "&order_status=" + searchData.order_status.value;
    }

    if (pcsFilter !== "" || searchData.pcsFilter !== "") {
      const pcsData = pcsFilter ? pcsFilter : searchData.pcsFilter;
      url = url + "&total_pieces=" + pcsData;
    }

    if (dtFilter !== "" || searchData.dtFilter !== "") {
      const dateData = dtFilter ? dtFilter : searchData.dtFilter;
      url = url + "&date=" + dateData;
    }

    if (searchData.remark !== "") {
      url = url + "&remark=" + searchData.remark;
    }

    if (searchData.total_net_weight !== "") {
      url = url + "&total_net_weight=" + searchData.total_net_weight;
    }

    if (searchData.total_gross_weight !== "") {
      url = url + "&total_gross_weight=" + searchData.total_gross_weight;
    }

    if (searchData.username !== "") {
      url = url + "&username=" + searchData.username;
    }

    if (searchData.retailer_name !== "") {
      url = url + "&retailer_name=" + searchData.retailer_name;
    }

    if (searchData.distributor_name !== "") {
      url = url + "&distributor_name=" + searchData.distributor_name;
    }

    if (searchData.order_number !== "") {
      url = url + "&order_number=" + searchData.order_number;
    }

    if (orderType !== "" || searchData.order_type !== "") {
      const type = orderType ? orderType.value : searchData.order_type.value;
      url = url + "&order_type=" + type;
    }

    // if (fromWtFilter !== "" || toWtFilter !== "") {
    //     if (fromWtValidation() && toWtValidation()) {
    //         url = url + "&weight_from=" + fromWtFilter + "&weight_to=" + toWtFilter
    //     } else {
    //         setLoading(false)
    //         return;
    //     }
    // }

    // getOrdersDetails(url);
  };

  function setFilters(tempPageNo) {
    let url = "";
    if (props.tabFilter === 0) {
      url = "api/order/allorder?";
    } else {
      url = "api/order?order_status=" + props.tabFilter;
    }

    if (page !== "") {
      if (tempPageNo === "") {
        url = url + "&page=" + Number(page + 1);
      } else {
        url = url + "&page=" + tempPageNo;
      }
    }

    if (searchData.order_status !== "" && searchData.order_status.value !== 0) {
      url = url + "&order_status=" + searchData.order_status.value;
    }

    if (karat !== "" || searchData.karat !== "") {
      const karatData = karat ? karat.value : searchData.karat;
      url = url + "&karat=" + karatData;
    }

    if (pcsFilter !== "" || searchData.pcsFilter !== "") {
      const pcsData = pcsFilter ? pcsFilter : searchData.pcsFilter;
      url = url + "&total_pieces=" + pcsData;
    }

    if (dtFilter !== "" || searchData.dtFilter !== "") {
      const dateData = dtFilter ? dtFilter : searchData.dtFilter;
      url = url + "&date=" + dateData;
    }
    if (searchData.remark !== "") {
      url = url + "&remark=" + searchData.remark;
    }

    if (searchData.total_net_weight !== "") {
      url = url + "&total_net_weight=" + searchData.total_net_weight;
    }

    if (searchData.total_gross_weight !== "") {
      url = url + "&total_gross_weight=" + searchData.total_gross_weight;
    }

    if (searchData.username !== "") {
      url = url + "&username=" + searchData.username;
    }

    if (searchData.retailer_name !== "") {
      url = url + "&retailer_name=" + searchData.retailer_name;
    }

    if (searchData.distributor_name !== "") {
      url = url + "&distributor_name=" + searchData.distributor_name;
    }

    if (searchData.order_number !== "") {
      url = url + "&order_number=" + searchData.order_number;
    }

    if (orderType !== "" || searchData.order_type !== "") {
      const type = orderType ? orderType.value : searchData.order_type.value;
      url = url + "&order_type=" + type;
    }
    // if (fromWtFilter !== "" || toWtFilter !== "") {
    //     if (fromWtValidation() && toWtValidation()) {
    //         url = url + "&weight_from=" + fromWtFilter + "&weight_to=" + toWtFilter
    //     } else {
    //         setLoading(false)
    //         return;
    //     }
    // }

    if (tempPageNo === "") {
      // getOrdersDetails(url);
    } else {
      if (count > apiData.length) {
        // getOrdersDetails(url);
      }
    }
  }

  function getOrdersDetails() {
    let url = "";
    if (props.tabFilter === 0) {
      url = "api/ProductionOrder/orders/listing?order_status";
    } else {
      url =
        "api/ProductionOrder/orders/listing?order_status=" + props.tabFilter;
    }
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        setLoading(false);
        console.log(response);
        if (response.data.success === true) {
          let rows = response.data.data;
          setCount(Number(response.data.data.count));
          if (apiData.length === 0) {
            setApiData(rows);
          } else {
            setApiData((apiData) => [...apiData, ...rows]);
          }
          setLoading(false);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
          setApiData([]);
        }
      })
      .catch(function (error) {
        setLoading(false);

        handleError(error, dispatch, {
          api: "api/ProductionOrder/orders/listing",
        });
      });
  }

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "dtFilter") {
      setDtFilter(value);
    } else if (name === "pcsFilter") {
      setPcsFilter(value);
    } else if (name === "fromWtFilter") {
      setFromWtFilter(value);
      setFrmWtErr("");
    } else if (name === "toWtFilter") {
      setToWtFilter(value);
      setToWtErr("");
    }
  };

  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 10 > apiData.length) {
      setFilters(Number(newPage + 1));
    }
  }

  const handleClose = () => {
    setOpenFlag(false);
    setApiData([]);
    setCount(0);
    setOrderId("");
    setLoading(true);
    getOrdersDetails();
  };

  function editHandler(element) {
    History.push("/dashboard/productionorders/orderView", {
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

  function handlePDf(id, orderNm, formatType, typefile) {
    if (typefile === "2") {
      var body = {
        is_excel: 1,
        format: formatType,
      };
    } else {
      var body = {
        format: formatType ? formatType : null,
        order_number: orderNm ? orderNm : null,
        is_csv: typefile === "1" ? 1 : null,
      };
    }

    setLoading(true);
    axios
      .post(Config.getCommonUrl() + "api/order/download-order/" + id, body)
      .then(function (response) {
        console.log(response.data);
        if (response.data.success === true) {
          let data = response.data.data;
          if (data.hasOwnProperty("pdf_url")) {
            let downloadUrl = data.pdf_url;
            // window.open(downloadUrl);
            const link = document.createElement("a");
            link.setAttribute("target", "_blank");
            link.href = downloadUrl;
            link.click();
          }
          if (data.hasOwnProperty("xl_url")) {
            let downloadUrl = data.xl_url;
            // window.open(downloadUrl);
            const link = document.createElement("a");
            link.setAttribute("target", "_blank");
            link.href = downloadUrl;
            link.click();
          }

          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/order/download-order/" + id,
          body: body,
        });
      });
  }

  function handleFormatModalClose() {
    setModalOpen(false);
  }

  const karatArr = [{ value: 14 }, { value: 18 }, { value: 20 }, { value: 22 }];

  const handleKaratChange = (value) => {
    setKarat(value);
  };

  const handleOrderTypeChange = (value) => {
    setOrderType(value);
  };

  const orderArr = [
    { id: 0, label: "Customer" },
    { id: 2, label: "Cart" },
    { id: 3, label: "Exhibition" },
    { id: 4, label: "Link" },
  ];

  const handleStatusChange = (value) => {
    setSearchData((prevState) => ({
      ...prevState,
      ["order_status"]: value ? value : "",
    }));
  };

  const openHandler = (path, data) => {
    History.push(path, data);
  };

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div>
      {filterFlag && (
        <Grid
          className="department-main-dv create-account-main-dv"
          container
          spacing={4}
          alignItems="stretch"
          style={{ margin: 10 }}
        >
          <Grid item xs={2} sm={2} md={2} key="1" style={{ padding: 5 }}>
            <TextField
              // className="mt-32"
              label="Date"
              name="dtFilter"
              value={dtFilter}
              type="date"
              variant="outlined"
              onKeyDown={(e) => e.preventDefault()}
              fullWidth
              // error={birthDateErr.length > 0 ? true : false}
              // helperText={birthDateErr}
              onChange={(e) => handleInputChange(e)}
              format="yyyy/MM/dd"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={1} sm={1} md={1} key="2" style={{ padding: 5 }}>
            <TextField
              className=""
              label="Pieces"
              name="pcsFilter"
              value={pcsFilter}
              // error={designationErr.length > 0 ? true : false}
              // helperText={designationErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              // required
              fullWidth
              // disabled={isView}
            />
          </Grid>
          <Grid item xs={2} sm={2} md={2} key="3" style={{ padding: 5 }}>
            <TextField
              className=""
              label="Weight From (in Grams)"
              name="fromWtFilter"
              value={fromWtFilter}
              error={frmWtErr.length > 0 ? true : false}
              helperText={frmWtErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              // required
              fullWidth
              // disabled={isView}
            />
          </Grid>

          <Grid item xs={2} sm={2} md={2} key="4" style={{ padding: 5 }}>
            <TextField
              className=""
              label="Weight To  (in Grams)"
              name="toWtFilter"
              value={toWtFilter}
              error={toWtErr.length > 0 ? true : false}
              helperText={toWtErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              // required
              fullWidth
              // disabled={isView}
            />
          </Grid>

          <Grid item xs={1} sm={1} md={1} key="5" style={{ padding: 5 }}>
            <Select
              styles={{ selectStyles }}
              options={karatArr.map((group) => ({
                value: group.value,
                label: group.value,
              }))}
              placeholder={<div>Karat</div>}
              filterOption={createFilter({ ignoreAccents: false })}
              value={karat}
              onChange={handleKaratChange}
            />
          </Grid>

          <Grid item xs={2} sm={2} md={2} key="6" style={{ padding: 5 }}>
            <Select
              styles={{ selectStyles }}
              options={orderArr.map((group) => ({
                value: group.id,
                label: group.label,
              }))}
              placeholder={<div>Order Type</div>}
              filterOption={createFilter({ ignoreAccents: false })}
              value={orderType}
              onChange={handleOrderTypeChange}
            />
          </Grid>

          <Grid
            item
            xs={2}
            sm={2}
            md={2}
            key="7"
            style={{ padding: 5, textAlign: "right" }}
          >
            <Button
              variant="contained"
              color="primary"
              className="mx-auto"
              aria-label="Register"
              // disabled={isView}
              // type="submit"
              onClick={(e) => {
                ApplyFilter();
              }}
            >
              Submit
            </Button>
            <IconButton
              // style={{ position: "absolute", top: "0", right: "0" }}
              onClick={() => {
                clearFilters();
              }}
            >
              <Icon
              // style={{ color: "white" }}
              >
                close
              </Icon>
            </IconButton>
          </Grid>
        </Grid>
      )}

      {loading && <Loader />}

      <Paper
        className={clsx(classes.tabroot, "table-responsive")}
        id="department-tbl-fix "
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <MaUTable className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableRowPad}>Stock Group</TableCell>
              <TableCell className={classes.tableRowPad}>Order No</TableCell>
              <TableCell className={classes.tableRowPad}>Client Name</TableCell>
              <TableCell className={classes.tableRowPad}>
                Sales Person
              </TableCell>
              <TableCell className={classes.tableRowPad}>karat</TableCell>
              <TableCell className={classes.tableRowPad}>Qty</TableCell>
              <TableCell className={classes.tableRowPad}>
                Gross Weight
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                Stone Weight
              </TableCell>
              <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
              <TableCell className={classes.tableRowPad}>
                Order Weight
              </TableCell>
              <TableCell className={classes.tableRowPad}>Status</TableCell>

              <TableCell className={classes.tableRowPad}>Order Date</TableCell>
              <TableCell className={classes.tableRowPad}>
                Shipment Date
              </TableCell>
              <TableCell className={classes.tableRowPad} width="150px">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {console.log()}
            {apiData.map((element, index) => (
              <TableRow key={index}>
                <TableCell className={classes.tableRowPad}>
                  {element.StockGroup.group_name}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {element.order_number}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {element.customer_name}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {element.SalesMan?.full_name}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {element.karat}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {element.total_pieces}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {element.total_gross_weight}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {element.total_stone_weight}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {element.total_net_weight}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {element.weight}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  <span style={{ color: "#d48a70" }}>
                    {" "}
                    {element.order_type === 0 && "Customer Order"}
                  </span>
                  <span style={{ color: "#ff9800" }}>
                    {" "}
                    {element.order_status === 2 && "Pending  Order"}
                  </span>
                  <span style={{ color: "#008eff" }}>
                    {" "}
                    {element.order_status === 1 && "New Order"}
                  </span>
                  <span style={{ color: "#ff0101" }}>
                    {" "}
                    {element.order_status === 3 && "Transfer  Order"}
                  </span>
                  <span style={{ color: "#00e909" }}>
                    {" "}
                    {element.order_status === 4 && "Completed"}
                  </span>
                  <span style={{ color: "green" }}>
                    {" "}
                    {element.order_status === 5 && "Approved"}
                  </span>
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {moment.utc(element.created_at).local().format("DD-MM-YYYY")}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {moment
                    .utc(element.shipment_date)
                    .local()
                    .format("DD-MM-YYYY")}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {/* {element.order_type === 3 && */}
                  <IconButton
                    style={{ padding: "0" }}
                    onClick={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      editHandler(element);
                    }}
                  >
                    <Icon className="mr-8 edit-icone">
                      <img src={Icones.edit} alt="" />
                    </Icon>
                  </IconButton>
                  {/* } */}

                  <IconButton
                    style={{ padding: "0" }}
                    onClick={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      viewHandler(element);
                    }}
                  >
                    <Icon className="mr-8 view-icone">
                      <img src={Icones.view} alt="" />
                    </Icon>
                  </IconButton>

                  <IconButton
                    style={{ padding: "0" }}
                    onClick={(ev) => {
                      ev.preventDefault();
                      ev.stopPropagation();
                      setOpenFlag(true);
                      setOrderId(element.id);
                      setOrderNum(element.order_number);
                    }}
                  >
                    <Icon className="mr-8 refresh-icone">
                      <img src={Icones.refresh} alt="" />
                    </Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </MaUTable>
      </Paper>
      {openFlag && (
        <ChangeStatus
          modalColsed={handleClose}
          orderId={orderId}
          handleModalClose={handleModalClose}
          orderNumView={orderNum}
        />
      )}
      <Modal
        // disableBackdropClick
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={modalOpen}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleFormatModalClose();
          }
        }}
      >
        <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
          <h5 className="popup-head p-12">
            Select Format
            <IconButton
              style={{ position: "absolute", top: "0", right: "7px" }}
              onClick={handleFormatModalClose}
            >
              {" "}
              <img src={Icones.cross} alt="" />
            </IconButton>
          </h5>
          <div className="p-5 pl-16 pr-16" style={{ display: "block" }}>
            <FormControl
              id="redio-input-dv"
              component="fieldset"
              className={classes.formControl}
            >
              <FormLabel component="legend">
                <b>File Type</b>
              </FormLabel>
              <RadioGroup
                aria-label="Gender"
                id="radio-row-dv"
                name="filetype"
                className={classes.group}
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
              >
                <FormControlLabel value="0" control={<Radio />} label="PDF" />

                <FormControlLabel value="1" control={<Radio />} label="CSV" />
                <FormControlLabel value="2" control={<Radio />} label="Excel" />
              </RadioGroup>
            </FormControl>
            {fileType === "0" && (
              <Grid item xs={3} sm={3} md={9} key="5" style={{ padding: 5 }}>
                <FormControl
                  id="redio-input-dv"
                  component="fieldset"
                  className={classes.formControl}
                >
                  <RadioGroup
                    aria-label="Gender"
                    id="radio-row-dv"
                    name="format"
                    // className={classes.group}
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="PDF Without Remark"
                    />

                    <FormControlLabel
                      value="2"
                      control={<Radio />}
                      label="PDF With Remark"
                    />

                    <FormControlLabel
                      value="3"
                      control={<Radio />}
                      label="PDF With Karat"
                    />

                    <FormControlLabel
                      value="4"
                      control={<Radio />}
                      label="Single Design PDF"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            )}
            {fileType === "2" && (
              <Grid item xs={3} sm={3} md={9} key="5" style={{ padding: 5 }}>
                <FormControl
                  id="redio-input-dv"
                  component="fieldset"
                  className={classes.formControl}
                >
                  <RadioGroup
                    aria-label="Gender"
                    id="radio-row-dv"
                    name="format"
                    // className={classes.group}
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                  >
                    <FormControlLabel
                      value="2"
                      control={<Radio />}
                      label="Excel with Remark"
                    />

                    <FormControlLabel
                      value="3"
                      control={<Radio />}
                      label="Excel Without Remark"
                    />

                    <FormControlLabel
                      value="5"
                      control={<Radio />}
                      label="Format - 5"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            )}
            {/* <Button
                            variant="contained"
              id="btn-save"
              className="w-full mx-auto mt-16"
                            style={{
                                backgroundColor: "#4caf50",
                                border: "none",
                                color: "white",
                            }}
                            onClick={(e) => handlePDf(orderId, orderNum, format, fileType)}
                        >
                            Download
                        </Button> */}
            <div className="model-actions flex flex-row pb-20">
              <Button
                variant="contained"
                className="w-128 mx-auto mt-20 popup-cancel"
                onClick={handleFormatModalClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="w-128 mx-auto mt-20 popup-save"
                onClick={(e) => handlePDf(orderId, orderNum, format, fileType)}
              >
                Download
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustOrdersComponent;

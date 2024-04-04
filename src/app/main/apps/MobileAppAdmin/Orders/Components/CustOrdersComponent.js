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
import TablePagination from '@material-ui/core/TablePagination';
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
    console.log(props);

    const theme = useTheme();
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    const [filterFlag, setFilterFlag] = useState(false)// show/hide filter

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
    const [openFlag, setOpenFlag] = useState(false);

    const [count, setCount] = useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [orderId, setOrderId] = useState("");
    const [orderNum, setOrderNum] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [format, setFormat] = useState("1");
    const [fileType, setFileType] = useState("0");

    const [modalLoading, setModalLoading] = useState(false);
    const [searching, setSearching] = useState(false); 

    const [searchData, setSearchData] = useState({
        dtFilter: '',
        karat: '',
        pcsFilter: '',
        remark: '',
        total_net_weight: '',
        total_gross_weight: '',
        username: '',
        retailer_name: '',
        distributor_name: '',
        order_number: '',
        order_type: '',
        order_status: ''
    });

    const handleTypeChange = (value) => {

        setSearchData((prevState) => ({
            ...prevState, 
            ['order_type']: value ? value : ''
        }));
      setSearching(true);
    }

    useEffect(() => {
        if (loading) {
            setTimeout(() => setLoading(false), 7000);
        }
    }, [loading]);

    useEffect(() => {
        console.log(props);
        setFilterFlag(props.filter);
        if (props.tabFilter !== tabFilter) {
            setTabFilter(props.tabFilter);
            setRowsPerPage(10);
        }
        //eslint-disable-next-line
    }, [props]);

    useEffect(() => {
        setSearching(false);
        const timeout = setTimeout(() => {
          if (props.props?.location && props.props?.location.state) {
            const preDta = props.props.location.state;
            setPage(preDta.page);
            setCount(preDta.count);
            setApiData(preDta.apiData);
            setSearchData(preDta.search);
            if (preDta.page === 0) {
              setApiData([]);
              setCount(0);
              setPage(0);
              setFilters();
            }
            History.replace("/dashboard/mobappadmin/orders", null);
          } else {
            setApiData([]);
            setCount(0);
            setPage(0);
            setFilters();
          }
        }, 800);
        return () => {
          clearTimeout(timeout);
        };
      }, []);


      useEffect(() => {
        if (
          props.props?.location &&
          props.props?.location?.state &&
          props.props?.location?.state?.iseditView
        ) {
          if (apiData.length > 0 && page && count) {
            setFilters(Number(page + 1));
          }
        }
      }, [apiData, page, count]);

    useEffect(() => {
        const timeout = setTimeout(() => {
          if (searchData && searching) {
            setApiData([]);
            setCount(0);
            setPage(0);
            setFilters();
          }
        }, 800);
        return () => {
          clearTimeout(timeout);
        };
      }, [searchData]);


    const selectStyles = {
        input: (base) => ({
            ...base,
            color: theme.palette.text.primary,
            "& input": {
                font: "inherit",
            },
        }),
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
        let url = "api/order?order_status=" + props.tabFilter + "&page=" + page;
        getOrdersDetails(url);
    }


    function setFilters(tempPageNo) {
        const serchingData =
          props?.props?.location && props?.props?.location?.state
            ? props?.props?.location?.state?.search
            : searchData;
        let url = "";
    
        if (props.tabFilter === "0") {
          url = "api/order/allorder?";
        } else {
          url = "api/order?order_status=" + props.tabFilter;
        }
    
        if (page !== "") {
          if (!tempPageNo) {
            url = url + "&page=" + 1;
          } else {
            url = url + "&page=" + tempPageNo;
          }
        }
    
        if (
          serchingData.order_status !== "" &&
          serchingData.order_status.value != 0
        ) {
          url = url + "&order_status=" + serchingData.order_status.value;
        }
    
        if (karat !== "" || serchingData.karat !== "") {
          const karatData = karat ? karat.value : serchingData.karat;
          url = url + "&karat=" + karatData;
        }
    
        if (pcsFilter !== "" || serchingData.pcsFilter !== "") {
          const pcsData = pcsFilter ? pcsFilter : serchingData.pcsFilter;
          url = url + "&total_pieces=" + pcsData;
        }
    
        if (dtFilter !== "" || serchingData.dtFilter !== "") {
          const dateData = dtFilter
            ? dtFilter
            : moment(serchingData.dtFilter).format("DD-MM-YYYY");
          url = url + "&date=" + dateData;
        }
    
        if (serchingData.remark !== "") {
          url = url + "&remark=" + serchingData.remark;
        }
    
        if (serchingData.total_net_weight !== "") {
          url = url + "&total_net_weight=" + serchingData.total_net_weight;
        }
    
        if (serchingData.total_gross_weight !== "") {
          url =
            url + "&total_gross_weight=" + serchingData.total_gross_weight;
        }
    
        if (serchingData.username !== "") {
          url = url + "&username=" + serchingData.username;
        }
    
        if (serchingData.retailer_name !== "") {
          url = url + "&retailer_name=" + serchingData.retailer_name;
        }
    
        if (serchingData.distributor_name !== "") {
          url = url + "&distributor_name=" + serchingData.distributor_name;
        }
    
        if (serchingData.order_number !== "") {
          url = url + "&order_number=" + serchingData.order_number;
        }
    
        if (orderType !== "" || serchingData.order_type !== "") {
          const type = orderType ? orderType.value : serchingData.order_type.value;
          url = url + "&order_type=" + type;
        }
        if (!tempPageNo) {
          console.log(11111111111111);
          getOrdersDetails(url);
        } else {
          if (count > apiData.length) {
            getOrdersDetails(url);
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
                    setCount(Number(response.data.data.count))
                    if (apiData.length === 0) {
                        setApiData(rows)
                    } else {
                        setApiData((apiData) => [...apiData, ...rows]);
                    }
                } else {
                    dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
                    setApiData([]);
                }
            })
            .catch(function (error) {
                setLoading(false);
                handleError(error, dispatch, { api: url })
            });
    }

    const handleInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        if (name === "dtFilter") {
            setDtFilter(value)
        } else if (name === "pcsFilter") {
            setPcsFilter(value)
        } else if (name === "fromWtFilter") {
            setFromWtFilter(value)
            setFrmWtErr("")
        } else if (name === "toWtFilter") {
            setToWtFilter(value)
            setToWtErr("")
        }
    }

    function fromWtValidation() {
        var Regex = /^[0-9]{1,11}(?:\.[0-9]{1,6})?$/; // /[1-9][0-9]*(?:\/[1-9][0-9])*/g;
        if (!fromWtFilter || Regex.test(fromWtFilter) === false) {
          setFrmWtErr("Please Enter Valid Weight");
          return false;
        }
        return true;
      }
    
      function toWtValidation() {
        var Regex = /^[0-9]{1,11}(?:\.[0-9]{1,6})?$/; // /[1-9][0-9]*(?:\/[1-9][0-9])*/g;
        if (!toWtFilter || Regex.test(toWtFilter) === false) {
          setToWtErr("Please Enter Valid Weight");
          return false;
        }
        return true;
      }

    function handleChangePage(event, newPage) {
        let tempPage = page;
        setPage(newPage);
        if (newPage > tempPage && (newPage + 1) * 10 > apiData.length) {
            setFilters(Number(newPage + 1))
        }
    }

    const handleClose = () => {
         setOpenFlag(false);
         setApiData([]);
         setCount(0);
         setOrderId("");
         setOrderNum("");
         setLoading(true);
         setPage(0);
         setTimeout(() => setFilters(""), 1000);
       };

       const handleModalClose = () => {
        setOpenFlag(false);
        setOrderNum("");
        setOrderId("");
      };

    function editHandler(element) {
        console.log("editHandler", element);
        History.push("/dashboard/mobappadmin/orders/orderView", {
          id: element.id,
          order_type: element.order_type,
          order_number: element.order_number,
          mainTab: 0,
          subTab: tabFilter,
          isEdit: true,
          isView: false,
          page: page,
          search: searchData,
          count: count,
          apiData: apiData,
        });
      }
      
    function viewHandler(element) {
        console.log("viewHandler", element);
        History.push("/dashboard/mobappadmin/orders/orderView", {
          id: element.id,
          order_type: element.order_type,
          order_number: element.order_number,
          mainTab: 0,
          subTab: tabFilter,
          isEdit: false,
          isView: true,
          page: page,
          search: searchData,
          count: count,
          apiData: apiData,
        });
      }

    function handlePDf(id, orderNm, formatType, typefile) {
        console.log(id, orderNm, formatType, typefile);
        setModalLoading(true);
        let body;
        let url;
        if (formatType === "7") {
          url = `api/productionreport/order/summation/`;
          axios
            .get(Config.getCommonUrl() + url + id)
            .then(function (response) {
              console.log(response.data);
              if (response.data.success === true) {
                let data = response.data.data;
                // setPrintObj(response.data.data);
                if (data.hasOwnProperty("pdf_url")) {
                  let downloadUrl = data.pdf_url;
                  // window.open(downloadUrl);
                  const link = document.createElement("a");
                  link.setAttribute("target", "_blank");
                  link.href = downloadUrl;
                  link.click();
                }
                setModalLoading(false);
                // setData(response.data);
              } else {
                dispatch(Actions.showMessage({ message: response.data.message }));
              }
            })
            .catch(function (error) {
              setModalLoading(false);
              handleError(error, dispatch, {
                api: url + id,
              });
            });
        } else {
          url = "api/order/download-order/";
          if (typefile === "2") {
            body = {
              is_excel: 1,
              format: formatType,
            };
          } else {
            body = {
              format: formatType ? formatType : null,
              order_number: orderNm ? orderNm : null,
              is_csv: typefile === "1" ? 1 : null,
            };
          }
          axios
            .post(Config.getCommonUrl() + url + id, body)
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
    
                setModalLoading(false);
                // setData(response.data);
              } else {
                dispatch(Actions.showMessage({ message: response.data.message }));
              }
            })
            .catch(function (error) {
              setModalLoading(false);
              handleError(error, dispatch, {
                api: url + id,
                body: body,
              });
            });
        }
      }

    function handleFormatModalClose() {
        setModalOpen(false);
    }

    const karatArr = [
        { value: 14 },
        { value: 18 },
        { value: 20 },
        { value: 22 },
    ]

    const handleKaratChange = (value) => {
        setKarat(value);
    }

    const handleOrderTypeChange = (value) => {
        setOrderType(value);
    }

    const orderArr = [
        { id: 0, label: "Customer" },
        { id: 2, label: "Cart" },
        { id: 3, label: "Exhibition" },
        { id: 4, label: "Link" },
    ]

    const handleStatusChange = (value) => {
        setSearchData((prevState) => ({
            ...prevState, 
            ['order_status']: value ? value : ''}));
        setSearching(true);
    }

    const openHandler = (path, data) => {
        History.push(path, data)
    }

    const handleSearchData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setSearchData((prevState) => ({
            ...prevState, [name]: value
        })
        );
        setSearching(true);
    }

    function TranferOrder(id) {
        const haveMany = apiData.length > 1 ? true : false;
        apiData.splice(page * rowsPerPage);
        setApiData(apiData);
        axios
          .post(Config.getCommonUrl() + "api/productionorder/create/order", {
            order_id: id,
          })
          .then((response) => {
            console.log(response);
            if (response.data.success) {
              console.log(response);
              dispatch(Actions.showMessage({ message: response.data.message }));
              if (haveMany) {
                setFilters(Number(page + 1));
              } else {
                setSearching(false);
                getOrdersDetails(`api/usermaster/lead/user?page=1`);
                setSearchData({
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
              }
            } else {
              dispatch(Actions.showMessage({ message: response.data.message }));
            }
          })
          .catch((error) => {
            handleError(error, dispatch, {
              api: "api/productionorder/create/order",
              body: {
                order_id: id,
              },
            });
          });
      }


    return (
        <div>
            {filterFlag &&
                <Grid className="department-main-dv create-account-main-dv"
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
                            onKeyDown={(e => e.preventDefault())}
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

                    <Grid item xs={2} sm={2} md={2} key="7" style={{ padding: 5, textAlign: "right" }}>
                        <Button
                            variant="contained"
                            color="primary"
                            className="mx-auto"
                            aria-label="Register"
                            // disabled={isView}
                            // type="submit"
                            onClick={(e) => {
                                // ApplyFilter()
                            }}
                        >
                            Submit
                        </Button>
                        <IconButton
                            // style={{ position: "absolute", top: "0", right: "0" }}
                            onClick={() => {
                                clearFilters()
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
            }

            {loading && <Loader />}

            <Paper className={clsx(classes.tabroot, "table-responsive")} id="department-tbl-fix " style={{ maxHeight: 'calc(100vh - 200px)'}}>
                <MaUTable className={classes.table} >
                    <TableHead>

                        <TableRow>
                            <TableCell className={classes.tableRowPad}>Order Number</TableCell>
                            <TableCell className={classes.tableRowPad}>Date</TableCell>
                            <TableCell className={classes.tableRowPad}>
                                Distributor
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>Retailer</TableCell>
                            <TableCell className={classes.tableRowPad}>
                                User Name
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                                Type of Order
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>Pieces</TableCell>
                            <TableCell className={classes.tableRowPad}>Gross Weight</TableCell>
                            <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
                            <TableCell className={classes.tableRowPad}>Karat</TableCell>
                            {
                                tabFilter === 0 && <TableCell className={classes.tableRowPad}>
                                    Status
                                </TableCell>
                            }
                            <TableCell className={classes.tableRowPad}>
                                Remarks
                            </TableCell>
                            <TableCell className={classes.tableRowPad} width="14%">
                                Actions
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.tableRowPad} align="left">
                                {/* order number */}
                                <TextField name="order_number" onChange={handleSearchData} inputProps={{ className: "all-Search-box-data" }}/>
                            </TableCell>
                            <TableCell className={classes.tableRowPad} align="left">
                                {/* Date */}
                                <TextField name="dtFilter" onChange={handleSearchData} inputProps={{ className: "all-Search-box-data" }}/>
                            </TableCell>
                            <TableCell className={classes.tableRowPad} align="left">
                                {/* Distributer */}
                                <TextField name="distributor_name" onChange={handleSearchData} inputProps={{ className: "all-Search-box-data" }}/>
                            </TableCell>
                            <TableCell className={classes.tableRowPad} align="left">
                                {/* Retailer */}
                                <TextField name="retailer_name" onChange={handleSearchData} inputProps={{ className: "all-Search-box-data" }}/>
                            </TableCell>
                            <TableCell className={classes.tableRowPad} align="left">
                                {/* User name */}
                                <TextField name="username" onChange={handleSearchData} inputProps={{ className: "all-Search-box-data" }}/>
                            </TableCell>
                            <TableCell className={classes.tableRowPad} align="left">
                                {/* type of order */}
                                <Select
                                    styles={{ selectStyles }}
                                    options={orderArr.map((group) => ({
                                        value: group.id,
                                        label: group.label,
                                    }))}
                                    isClearable
                                    filterOption={createFilter({ ignoreAccents: false })}
                                    onChange={handleTypeChange}
                                />
                            </TableCell>
                            <TableCell className={classes.tableRowPad} align="left">
                                {/* pcs */}
                                <TextField name="pcsFilter" onChange={handleSearchData} type="number" inputProps={{ className: "all-Search-box-data" }}/>
                            </TableCell>
                            <TableCell className={classes.tableRowPad} align="left">
                                {/* Gross wgt */}
                                <TextField name="total_gross_weight" onChange={handleSearchData} inputProps={{ className: "all-Search-box-data" }}/>
                            </TableCell>
                            <TableCell className={classes.tableRowPad} align="left">
                                {/* Net weight */}
                                <TextField name="total_net_weight" onChange={handleSearchData} inputProps={{ className: "all-Search-box-data" }}/>
                            </TableCell>
                            <TableCell className={classes.tableRowPad} align="left">
                                {/* Karat */}
                                <TextField name="karat" onChange={handleSearchData} inputProps={{ className: "all-Search-box-data" }}/>
                            </TableCell>
                            {
                                tabFilter === 0 && 
                                <TableCell className={classes.tableRowPad} align="left">
                                    {/* Status */}
                                    <Select
                                        styles={{ selectStyles }}
                                        options={props.Statuslist.map((group) => ({
                                            value: group.value,
                                            label: group.label,
                                        }))}
                                        isClearable
                                        value={searchData.order_status}
                                        filterOption={createFilter({ ignoreAccents: false })}
                                        onChange={handleStatusChange}
                                    />
                                </TableCell>
                            }
                            <TableCell className={classes.tableRowPad} align="left">
                                {/* Remark */}
                                <TextField name="remark" onChange={handleSearchData} inputProps={{ className: "all-Search-box-data" }}/>
                            </TableCell>
                            <TableCell className={classes.tableRowPad} align="left">
                                {/* Action */}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {apiData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((element, index) => (
                                <TableRow key={index}>
                                    <TableCell className={classes.tableRowPad}>
                                        {element.order_number ? element.order_number : "-"}

                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                        {moment.utc(element.created_at).local().format("DD-MM-YYYY")}

                                    </TableCell>
                                    <TableCell className={element.distributor !== null ? clsx(classes.tableRowPad, classes.hoverClass) : clsx(classes.tableRowPad)} align="center">
                                        {element.distributor !== null ?
                                            <span onClick={(ev) => {
                                                ev.preventDefault();
                                                ev.stopPropagation();

                                                // openHandler("/dashboard/mobappadmin/createdistributor", { row: element.distributor.client.id, isViewOnly: false });
                                                openHandler(
                                                    "/dashboard/mobappadmin/orders/createdistributor",
                                                    {
                                                      row: element.distributor.client.id,
                                                      isViewOnly: false,
                                                      from: "/dashboard/mobappadmin/orders",
                                                      mainTab: 0,
                                                      subTab: tabFilter,
                                                      page: page,
                                                      search: searchData,
                                                      count: count,
                                                      apiData: apiData,
                                                    }
                                                  );

                                            }}> {element.distributor.client.name}</span>
                                            : "-"}
                                    </TableCell>
                                    <TableCell className={element.retailer !== null && element.retailer_id !== 0 ? clsx(classes.tableRowPad, classes.hoverClass) : clsx(classes.tableRowPad)} align="center">
                                        {element.retailer !== null && element.retailer_id !== 0 ?
                                            <span onClick={(ev) => {
                                                ev.preventDefault();
                                                ev.stopPropagation();
                                                openHandler("/dashboard/mobappadmin/createretailer", { row: element.retailer_id, isViewOnly: true, isEdit: false });
                                            }}> {element.retailer.company_name}</span>
                                            : element.retailer ? element.retailer.company_name : "-"}
                                    </TableCell>
                                    {
                                        element.order_type === 4 && element.username && element.username.id ?
                                            <TableCell className={clsx(classes.tableRowPad, classes.hoverClass)} align="center">
                                                <span onClick={(ev) => {
                                                    ev.preventDefault();
                                                    ev.stopPropagation();
                                                    openHandler("/dashboard/mobappadmin/adduser", { row: element.username.id, isViewOnly: true, isEdit: false });
                                                }}> {element.username.full_name}</span>
                                            </TableCell>
                                            : element.order_type === 4 && element.leadusername ?
                                                <TableCell className={clsx(classes.tableRowPad, classes.hoverClass)} align="center">
                                                    <span onClick={(ev) => {
                                                        ev.preventDefault();
                                                        ev.stopPropagation();
                                                        openHandler("/dashboard/mobappadmin/addnewlead", { row: element.leadusername.id, isViewOnly: true, isEdit: false });
                                                    }}> {element.leadusername.full_name}</span>
                                                </TableCell>
                                                : element.username && element.username.id ?
                                                    <TableCell className={clsx(classes.tableRowPad, classes.hoverClass)} align="center">
                                                        <span onClick={(ev) => {
                                                            ev.preventDefault();
                                                            ev.stopPropagation();
                                                            openHandler("/dashboard/mobappadmin/adduser", { row: element.username.id, isViewOnly: true, isEdit: false });
                                                        }}> {element.username.full_name}</span>
                                                    </TableCell>
                                                    :
                                                    <TableCell className={classes.tableRowPad} align="center">
                                                        {element.username ? element.username.full_name : "-"}
                                                    </TableCell>
                                    }
                                    {/* <TableCell className={classes.tableRowPad} align="center">
                                        {element.order_type === 3 ? element.salesman_id === 0 ?  element.username.full_name : element.salesman?.name :
                                        element.order_type === 4 ? element.leadusername ? element.leadusername.full_name : element.username?.full_name :
                                        element.username ? element.username.full_name : "-"}
                                    </TableCell> */}

                                    <TableCell className={classes.tableRowPad}>
                                        {element.order_type === 0 && "Customer Order"}
                                        {element.order_type === 1 && "Bulk Order"}
                                        {element.order_type === 2 && "Cart Order"}
                                        {element.order_type === 3 && "Exhibition Order"}
                                        {element.order_type === 4 && "Link Order"}
                                    </TableCell>

                                    <TableCell className={classes.tableRowPad} align="center">
                                        {element.total_pieces}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad} align="center">
                                        {element.total_gross_weight !== null ? parseFloat(element.total_gross_weight).toFixed(3) : "-"}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad} align="center">
                                        {element.total_net_weight !== null ? parseFloat(element.total_net_weight).toFixed(3) : "-"}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad} align="center">
                                        {element.karat !== null ? element.karat : "-"}
                                    </TableCell>
                                    {
                                        tabFilter === 0 && 
                                        <TableCell className={classes.tableRowPad}>
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
                                    }
                                    <TableCell className={classes.tableRowPad} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {element.order_type === 0 ? element.customer_remark !== null ? element.customer_remark : "-" :
                                            element.final_order_remark !== null ? element.final_order_remark : "-"}
                                    </TableCell>

                                    <TableCell className={classes.tableRowPad}>

                                        {/* {element.order_type === 3 && */}
                                        {[3, 4, 5, 6, 7].includes(element.order_status) && (
                                         <Button 
                                            variant="contained"
                                            aria-label="Register"
                                            disabled={element.convert_to_production === 1}
                                            style={{
                                             fontSize: 11,
                                             }}
                                            onClick={(e) => {
                                              TranferOrder(element.id);
                                            }}
                                            size="small"
                                            className={clsx(classes.button, "mx-1, mr-8")}
                                            >
                                            {element.convert_to_production === 0
                                             ? "Transfer"
                                             : "Converted"}
                                            </Button>
                                           )}

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
                                                setOpenFlag(true)
                                                setOrderId(element.id)
                                                setOrderNum(element.order_number)

                                            }}
                                        >
                                            <Icon className="mr-8 refresh-icone">
                                                <img src={Icones.refresh} alt="" />
                                            </Icon>
                                        </IconButton>

                                        {
                                            element.order_type === 2 || element.order_type === 3 || element.order_type === 4 ?
                                                <IconButton
                                                    style={{ padding: "0" }}
                                                    onClick={(ev) => {
                                                        ev.preventDefault();
                                                        ev.stopPropagation();
                                                        // setOpenFlag(true)
                                                        setOrderId(element.id)
                                                        setOrderNum(element.order_number)
                                                        setModalOpen(true)
                                                    }}
                                                >
                                                    <Icon className="mr-8 download-icone" style={{ color: "dodgerblue" }}>
                                                        <img src={Icones.download_green} alt="" />
                                                    </Icon>
                                                </IconButton> : <IconButton
                                                    style={{ padding: "0" }}
                                                    onClick={(ev) => {
                                                        ev.preventDefault();
                                                        ev.stopPropagation();
                                                        handlePDf(element.id, element.order_number)
                                                    }}
                                                >
                                                    <Icon className="mr-8 download-icone" style={{ color: "dodgerblue" }}>
                                                        <img src={Icones.download_green} alt="" />
                                                    </Icon>
                                                </IconButton>

                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </MaUTable>

                {modalLoading}
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

            {openFlag && <ChangeStatus modalColsed={handleClose} orderId={orderId} handleModalClose={handleModalClose} orderNumView={orderNum} />}
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
                    <h5
                        className="popup-head p-12"
                    >
                        Select Format
                        <IconButton
                            style={{ position: "absolute", top: "0", right: "7px" }}
                            onClick={handleFormatModalClose}
                        > <img src={Icones.cross} alt="" /></IconButton>
                    </h5>
                    <div className="p-5 pl-16 pr-16" style={{ display: 'block' }}>

                        <FormControl
                            id="redio-input-dv"
                            component="fieldset"
                            className={classes.formControl}
                        >
                            <FormLabel component="legend"><b>File Type</b></FormLabel>
                            <RadioGroup
                                aria-label="Gender"
                                id="radio-row-dv"
                                name="filetype"
                                className={classes.group}
                                value={fileType}
                                onChange={(e) => setFileType(e.target.value)}
                            >

                                <FormControlLabel
                                    value="0"
                                    control={<Radio />}
                                    label="PDF"
                                />

                                <FormControlLabel
                                    value="1"
                                    control={<Radio />}
                                    label="CSV"
                                />
                                <FormControlLabel
                                    value="2"
                                    control={<Radio />}
                                    label="Excel"
                                />
                            </RadioGroup>
                        </FormControl>
                        {
                            fileType === "0" && <Grid item xs={3} sm={3} md={9} key="5" style={{ padding: 5 }}>
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
                        }
                        {
                            fileType === "2" && <Grid item xs={3} sm={3} md={9} key="5" style={{ padding: 5 }}>
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
                        }
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
                                onClick={handleFormatModalClose} >
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

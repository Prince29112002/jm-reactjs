import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
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
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Select, { createFilter } from "react-select";
import Icones from "assets/fornt-icons/Mainicons";

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

        flexDirection: "row",
    },
    selectBox: {
        display: "inline-block",
      },
      hoverClass: {
        color: "#1e90ff",
        "&:hover": {
          cursor: "pointer",
        },
      },
     
}));

const BulkOrderComponent = (props) => {
    const classes = useStyles();
    const theme = useTheme();

    const [filterFlag, setFilterFlag] = useState(false)// show/hide filter

    const [karat, setKarat] = useState("")

    const [tabFilter, setTabFilter] = useState("")

    const [apiData, setApiData] = useState([]);

    const [dtFilter, setDtFilter] = useState("")

    const [pcsFilter, setPcsFilter] = useState("")

    const [fromWtFilter, setFromWtFilter] = useState("")
    const [frmWtErr, setFrmWtErr] = useState("")
    const [orderNumberView, setOrderNumberView] = useState("")

    const [toWtFilter, setToWtFilter] = useState("")
    const [toWtErr, setToWtErr] = useState("")

    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    const [page, setPage] = React.useState(0);

    const [count, setCount] = useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const selectStyles = {
        input: (base) => ({
          ...base,
          color: theme.palette.text.primary,
          "& input": {
            font: "inherit",
          },
        }),
      };
    const [openFlag, setOpenFlag] = useState(false);
    const [orderId, setOrderId] = useState("")
    const [searchData, setSearchData] = useState({
        dtFilter : '',
        karat : '',
        pcsFilter : '',
        remark : '',
        total_net_weight : '',
        total_gross_weight : '',
        username : '',
        retailer_name : '',
        distributor_name : '',
        order_number : '',
        order_status : ""
      });

      useEffect(() => {
        if (loading) {
            setTimeout(() => setLoading(false), 7000);
        }
    }, [loading]);

    useEffect(() => {
        setFilterFlag(props.filter)

        if (props.tabFilter !== tabFilter) {
            setTabFilter(props.tabFilter)
            setRowsPerPage(10)
        }
        //eslint-disable-next-line
    }, [props]);

      useEffect(() =>{
        const timeout = setTimeout(() => {
            if (searchData) {
                ApplyFilter(searchData);
            }
        }, 800);
        return () => {
            clearTimeout(timeout);
        };

      },[searchData])

    const clearFilters = () => {
        setPage(0)
        setApiData([])
        setCount(0)
        setLoading(true)
        setKarat("")
        setPcsFilter("")
        setFromWtFilter("")
        setToWtFilter("")
        setFrmWtErr("")
        setToWtErr("")
        setDtFilter("")
        let url = "api/order/bulk-list?order_status=" + props.tabFilter + "&page=" + 1

        getOrdersDetails(url)

    }
    const handleModalClose = () => {
        setOpenFlag(false)  
        setOrderNumberView("")
        setOrderId("")
    }

    const ApplyFilter = () => {
        setLoading(true)
        setApiData([])
        setCount(0)
        setPage(0)
        // setTimeout(() => setFilters(""), 800);

        let url = ""
        if(props.tabFilter === 0){
            url = "api/order/allbulkorder?"
        }else{
            url = "api/order/bulk-list?order_status=" + props.tabFilter + "&page=" + 1
        }

        if (searchData.karat !== "") {
            url = url + "&karat=" + searchData.karat 
        }

        if(searchData.order_status !== "" &&  searchData.order_status.value !== 0){
            url = url + "&order_status=" + searchData.order_status.value
        }

        if (searchData.pcsFilter !== "") {
            url = url + "&total_pieces=" + searchData.pcsFilter
        }

        if (searchData.dtFilter !== "") {
            url = url + "&date=" + searchData.dtFilter
        }

        if(searchData.remark !== "") {
            url = url + "&remark=" + searchData.remark
        }

        if(searchData.total_net_weight !== "") {
            url = url + "&total_net_weight=" + searchData.total_net_weight
        }

        if(searchData.total_gross_weight !== "") {
            url = url + "&total_gross_weight=" + searchData.total_gross_weight
        }

        if(searchData.username !== "") {
            url = url + "&username=" + searchData.username
        }

        if(searchData.retailer_name !== "") {
            url = url + "&retailer_name=" + searchData.retailer_name
        }

        if(searchData.distributor_name !== "") {
            url = url + "&distributor_name=" + searchData.distributor_name
        }

        if(searchData.order_number !== "") {
            url = url + "&order_number=" + searchData.order_number
        }


       

        getOrdersDetails(url);

    }
    function setFilters(tempPageNo) {

        let url = ""
        if(props.tabFilter === 0){
            url = "api/order/allbulkorder?"
        }else{
            url = "api/order/bulk-list?order_status=" + props.tabFilter
        }

        if (page !== "") {
            if (tempPageNo === "") {
                url = url + "&page=" + Number(page + 1)

            } else {
                url = url + "&page=" + tempPageNo
            }
        }

        if(searchData.order_status !== "" &&  searchData.order_status.value !== 0){
            url = url + "&order_status=" + searchData.order_status.value
        }

        if (searchData.karat !== "") {
            url = url + "&karat=" + searchData.karat 
        }

        if (searchData.pcsFilter !== "") {
            url = url + "&total_pieces=" + searchData.pcsFilter
        }

        if (searchData.dtFilter !== "") {
            url = url + "&date=" + searchData.dtFilter
        }

        if(searchData.remark !== "") {
            url = url + "&remark=" + searchData.remark
        }

        if(searchData.total_net_weight !== "") {
            url = url + "&total_net_weight=" + searchData.total_net_weight
        }

        if(searchData.total_gross_weight !== "") {
            url = url + "&total_gross_weight=" + searchData.total_gross_weight
        }

        if(searchData.username !== "") {
            url = url + "&username=" + searchData.username
        }

        if(searchData.retailer_name !== "") {
            url = url + "&retailer_name=" + searchData.retailer_name
        }

        if(searchData.distributor_name !== "") {
            url = url + "&distributor_name=" + searchData.distributor_name
        }

        if(searchData.order_number !== "") {
            url = url + "&order_number=" + searchData.order_number
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

        if (name === "karat") {
            setKarat(value)
        } else if (name === "dtFilter") {
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



    function handleChangePage(event, newPage) {
       
        let tempPage = page;
        setPage(newPage);
        if (newPage > tempPage && (newPage +1) * 10 > apiData.length) {
            setFilters(Number(newPage + 1))
        }
    }

    const handleClose = () => {
        setOpenFlag(false)
        setApiData([])
        setCount(0)
        setOrderNumberView("")
        // let index = apiData.findIndex(item => item.id === orderId)
        // if (index > -1) {
        //     apiData.splice(index, 1)
        // }
        setOrderId("")
        setLoading(true)
        setTimeout(() => setFilters(""), 1000);

    };

    function editHandler(element) {
        History.push("/dashboard/mobappadmin/orders/orderView", {
            id: element.id,
            order_type: element.order_type,
            order_number : element.order_number,
            mainTab: 0,
            subTab: tabFilter,
            isEdit: true,
            isView: false
        });
    }

    function viewHandler(element) {
        History.push("/dashboard/mobappadmin/orders/orderView", {
            id: element.id,
            order_type: element.order_type,
            order_number : element.order_number,
            mainTab: 1,
            subTab: tabFilter,
            isEdit: false,
            isView: true
        });
    }

    function handlePDf(id, orderNm) {
        const body = {
            order_number: orderNm ? orderNm : null,
        }
        setLoading(true)
        axios
            .post(Config.getCommonUrl() + "api/order/download-order/" + id, body)
            .then(function (response) {
                if (response.data.success === true) {
                    let data = response.data.data;
                    if (data.hasOwnProperty("pdf_url")) {
                        let downloadUrl = data.pdf_url;
                        // window.open(downloadUrl);
                        const link = document.createElement("a");
                        link.setAttribute('target', '_blank');
                        link.href = downloadUrl;
                        link.click();
                    }

                    setLoading(false);
                    // setData(response.data);
                } else {
                    dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
                }
            })
            .catch(function (error) {
                setLoading(false);
                handleError(error, dispatch, { api: "api/order/download-order/" + id, body: body })

            });
    }

    const openHandler = (path,data) => {
        History.push(path, data)
    }

    const handleStatusChange = (value) => {
        setSearchData((prevState)=>({
            ...prevState , ['order_status'] : value ? value : ''
        }))
    }

    const handleSearchData = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setSearchData((prevState) => ({
          ...prevState, [name]: value
        })
        );
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
            <p className="pb-2">Date</p>
                        <TextField
                            // className="mt-32"
              placeholder="Date"
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
            <p className="pb-2">Pieces</p>
                        <TextField
                            className=""
              placeholder="Pieces"
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
            <p className="pb-2">Weight From (in Grams)</p>
                        <TextField
                            className=""
              placeholder="Weight From (in Grams)"
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
            <p className="pb-2">Weight To (in Grams)</p>
                        <TextField
                            className=""
              placeholder="Weight To  (in Grams)"
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

                    <Grid item xs={3} sm={3} md={3} key="5" style={{ padding: 5 }}>
                        <FormControl
                            id="redio-input-dv"
                            component="fieldset"
              className={clsx(classes.formControl, "mt-2")}
                        >
                            <FormLabel component="legend"> Karat</FormLabel>
                            <RadioGroup
                                aria-label="Gender"
                                id="radio-row-dv"
                                name="karat"
                                className={classes.group}
                                value={karat}
                                onChange={handleInputChange}
                            >

                                <FormControlLabel
                                    value="14"
                                    control={<Radio />}
                                    label="14"
                                />

                                <FormControlLabel
                                    value="18"
                                    control={<Radio />}
                                    label="18"
                                />

                                <FormControlLabel
                                    value="20"
                                    control={<Radio />}
                                    label="20"
                                />

                                <FormControlLabel
                                    value="22"
                                    control={<Radio />}
                                    label="22"
                                />


                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    {/* <Grid item xs={2} sm={2} md={2} key="6" style={{ padding: 5 }}>
                        <div>
                            Subject
                        </div>
                    </Grid> */}

                    <Grid item xs={2} sm={2} md={2} key="7" style={{ padding: 5, textAlign: "right" }}>

                        <Button
              id="btn-save"
                            variant="contained"
                            color="primary"
                            className="mx-auto"
                            aria-label="Register"
                            // disabled={isView}
                            // type="submit"
                            onClick={(e) => {
                                ApplyFilter()
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
                            <TableCell className={classes.tableRowPad}>From Weight</TableCell>
                            <TableCell className={classes.tableRowPad}>To Weight</TableCell>
                            <TableCell className={classes.tableRowPad}>Karat</TableCell>
                            {
                                tabFilter === 0 &&  <TableCell className={classes.tableRowPad}>
                                Status
                            </TableCell>
                            }
                            <TableCell className={classes.tableRowPad}>
                                Remarks
                            </TableCell>
                            <TableCell className={classes.tableRowPad} width="150px">
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
                                tabFilter === 0 && <TableCell className={classes.tableRowPad} align="left">
                                {/* Status */}    
                                <Select
                                    className={classes.selectBox}
                                    classes={classes}
                                    styles={selectStyles}
                                    options={props.Statuslist.map((group) => ({
                                        value: group.value,
                                        label: group.label,
                                    }))}
                                    isClearable
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
                                        {element.order_number ? element.order_number : ""}

                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                        {moment.utc(element.created_at).local().format("DD-MM-YYYY")}

                                    </TableCell>
                                    <TableCell align="center" className={element.distributor !== null ? clsx(classes.tableRowPad, classes.hoverClass) : clsx(classes.tableRowPad)}>
                                    {element.distributor !== null ?
                                     <span onClick={(ev) => {
                                        ev.preventDefault();
                                        ev.stopPropagation();
                                        openHandler("/dashboard/mobappadmin/createdistributor",{ row : element.distributor.client.id , isViewOnly: false});
                                      }}> {element.distributor.client.name}</span>
                                    : "-" }
                                    </TableCell>
                                    <TableCell className={element.retailer !== null && element.retailer_id !== 0 ? clsx(classes.tableRowPad, classes.hoverClass) : clsx(classes.tableRowPad)} align="center" >
                                        { element.retailer !== null && element.retailer_id !== 0 ?
                                     <span onClick={(ev) => {
                                        ev.preventDefault();
                                        ev.stopPropagation();
                                        openHandler("/dashboard/mobappadmin/createretailer",{ row : element.retailer_id , isViewOnly: true,  isEdit: false});
                                      }}> {element.retailer.company_name}</span>
                                        // <Link to={{pathname : "/dashboard/mobappadmin/createretailer" , state :{ row : element.retailer_id , isViewOnly: true,  isEdit: false} }}  
                                        // >
                                        //  {element.retailer.company_name} </Link> 
                                    : element.retailer ? element.retailer.company_name : "-" }
                                    </TableCell>
                                   
                                    {element.username && element.username.id ?
                                     <TableCell className={clsx(classes.tableRowPad, classes.hoverClass)} align="center">
                                     <span onClick={(ev) => {
                                     ev.preventDefault();
                                     ev.stopPropagation();
                                     openHandler("/dashboard/mobappadmin/adduser",{ row : element.username.id , isViewOnly: true,  isEdit: false});
                                   }}> {element.username.full_name}</span>
                                    </TableCell>
                                    : 
                                    <TableCell className={classes.tableRowPad} align="center">
                                    {element.username ? element.username.full_name : "-"}
                                    </TableCell>
                                    }
                                    
                                    <TableCell className={classes.tableRowPad}>
                                        Bulk Order
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad} align="center">
                                        {element.total_pieces}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad} align="center">
                                        {element.CategoryWeightRatioDetails.length > 0 ? parseFloat(element.CategoryWeightRatioDetails[0]?.avgFromWeight).toFixed(3) : ""}
                                        {/* {element.fromWgtTotal !== null ? parseFloat(element.fromWgtTotal).toFixed(3) : ""} */}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad} align="center">
                                        {element.CategoryWeightRatioDetails.length > 0 ? parseFloat(element.CategoryWeightRatioDetails[0]?.avgToWeight).toFixed(3) : ""}

                                        {/* {element.toWgtTotal !== null ? parseFloat(element.toWgtTotal).toFixed(3) : ""} */}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad} align="center">
                                        {element.karat}
                                    </TableCell>
                                    {
                                        tabFilter === 0 && <TableCell className={classes.tableRowPad}>
                                        {element.order_status === 1 && "New Order" }
                                        {element.order_status === 2 && "Accepted"}
                                        {element.order_status === 3 && "Completed"}
                                        {element.order_status === 4 &&  "Customer Cancelled"}
                                        {element.order_status === 5 &&  "Declined"}
                                       
                                    </TableCell>
                                    }
                                    <TableCell className={classes.tableRowPad} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {element.final_order_remark}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>

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
                                                setOrderNumberView(element.order_number)
                                                setOrderId(element.id)
                                            }}
                                        >
                      <Icon className="mr-8 refresh-icone">
                        <img src={Icones.refresh} alt="" />
                                            </Icon>
                                        </IconButton>

                                        <IconButton
                                            style={{ padding: "0" }}
                                            onClick={(ev) => {
                                                ev.preventDefault();
                                                ev.stopPropagation();
                                                // setOpenFlag(true)
                                                // setOrderId(element.id)
                                                handlePDf(element.id, element.order_number)
                                            }}
                                        >
                     <Icon className="mr-8 download-icone" style={{ color: "dodgerblue" }}>
                        <img src={Icones.download_green} alt="" />
                                            </Icon>
                                        </IconButton>
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
            {openFlag && <ChangeStatus modalColsed={handleClose} orderId={orderId} handleModalClose={handleModalClose}  orderNumView={orderNumberView} />}
        </div>
    );
};

export default BulkOrderComponent;

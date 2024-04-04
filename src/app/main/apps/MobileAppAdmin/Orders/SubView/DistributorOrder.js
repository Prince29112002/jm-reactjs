import React, { useEffect, useState } from "react";
import { makeStyles, useTheme} from "@material-ui/core/styles";
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
import { Icon, IconButton , Button} from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import History from "@history";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { Link } from "react-router-dom";
import Modal from "@material-ui/core/Modal";
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
        backgroundColor: "cornflowerblue",
        color: "white",
    },
    tabroot: {
        overflowX: "auto",
        overflowY: "auto",
        // height: "100%",
        maxHeight: 'calc(100vh - 350px)'
    },
    table: {
        minWidth: 1000,
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
    hoverClass: {
        color: "#1e90ff",
        "&:hover": {
          cursor: "pointer",
        },
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

const DistributorOrder = ({props}) => {
    const [modalStyle] = useState(getModalStyle);
    const classes = useStyles();
    const [apiData, setApiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [page, setPage] = React.useState(0);
    const [downloadModal, setDownloadModal] = useState(false);
    const [fileType, setFileType] = useState("0")
    const [orderId, setOrderId] = useState("")
    const [count, setCount] = useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
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
        order_type : '',
        order_status: ''
      });

    useEffect(() => {
        if (loading) {
            setTimeout(() => setLoading(false), 7000);
        }
    }, [loading]);

    useEffect(() => {
        ApplyFilter()
    },[props])

    const ApplyFilter = () => {
        setLoading(true)
        setApiData([])
        setCount(0)
        setPage(0)
        // setTimeout(() => setFilters(1), 1500);
        let  url = "api/distCatalogueOrder?page=" + 1

        if (searchData.karat !== "") {
            url = url + "&karat=" + searchData.karat
        }

        if(searchData.order_status !== ""){
            url = url + "&order_status=" + searchData.order_status.value
        }

        if (searchData.pcsFilter !== "") {
            url = url + "&total_pieces=" + searchData.pcsFilter
        }

        if (searchData.dtFilter !== "") {
            url = url + "&date=" + searchData.dtFilter
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

        if(searchData.distributor_name !== "") {
            url = url + "&distributor_name=" + searchData.distributor_name
        }

        getOrdersDetails(url);

    }

    function setFilters(tempPageNo) {

        let  url = "api/distCatalogueOrder?" + 1

        if (page !== "") {
            if (tempPageNo === "") {
                url = url + "&page=" + Number(page + 1)

            } else {
                url = url + "&page=" + tempPageNo
            }
        }

        
        if (searchData.karat !== "") {
            url = url + "&karat=" + searchData.karat
        }

        if(searchData.order_status !== ""){
            url = url + "&order_status=" + searchData.order_status.value
        }

        if (searchData.pcsFilter !== "") {
            url = url + "&total_pieces=" + searchData.pcsFilter
        }

        if (searchData.dtFilter !== "") {
            url = url + "&date=" + searchData.dtFilter
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

        if(searchData.distributor_name !== "") {
            url = url + "&distributor_name=" + searchData.distributor_name
        }

        if (tempPageNo === "") {
            getOrdersDetails(url);
        } else {
             if (count > apiData.length) {
                getOrdersDetails(url);
             } 
        }
    }

    function handleChangePage(event, newPage) {
        let tempPage = page;
        setPage(newPage);
        if (newPage > tempPage && (newPage +1) * 10 > apiData.length) {
            setFilters(Number(newPage + 1))
        }
    }

    function getOrdersDetails(api) {
        setLoading(true);
        axios
            .get(Config.getCommonUrl() + api)
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
                setApiData([]);
                handleError(error, dispatch, { api: api })
            });
    }

  

      function viewHandler(element,isView) {
        History.push("/dashboard/mobappadmin/orders/distributorview", {
            id: element.id,
            order_number : element.order_number,
            isView : isView 
        });
    }

    function handlePDf(id,type) {
        setLoading(true)
        const body = {
            is_excel : type
        }
        axios
            .post(Config.getCommonUrl() + `api/distCatalogueOrder/pdf/${id}`,body)
            .then(function (response) {
                if (response.data.success === true) {
                    let data = response.data.data;
                    let downloadUrl = ""
                    if(type == 1){
                        if (data.hasOwnProperty("xl_url")) {
                             downloadUrl = data.xl_url;
                        }
                    }else{
                        if (data.hasOwnProperty("pdf_url")) {
                             downloadUrl = data.pdf_url;
                        }
                    } 
                    const link = document.createElement("a");
                    link.setAttribute('target', '_blank');
                    link.href = downloadUrl;
                    link.click();
                    setDownloadModal(false);
                    setOrderId("")
                    setLoading(false);
                } else {
                    dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
                }
            })
            .catch(function (error) {
                setLoading(false);
                handleError(error, dispatch, { api: `api/distCatalogueOrder/pdf/${id}`,body })
            });
    }

    const openHandler = (path,data) => {
        History.push(path, data)
    }

    return (
        <div className={clsx(classes.root, props.className, "w-full")} style={{ height: 'calc(100vh - 60px)', overflowX: 'hidden' }}>
            <div className="flex flex-col md:flex-row container">
                <div className="flex flex-1 flex-col min-w-0">
                {loading && <Loader />}
                    <Paper className={clsx(classes.tabroot, "table-responsive")} id="department-tbl-fix " style={{ maxHeight: 'calc(100vh - 200px)' }}>
                        <MaUTable className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.tableRowPad}>Order Number</TableCell>
                                    <TableCell className={classes.tableRowPad}>Date</TableCell>
                                    <TableCell className={classes.tableRowPad}>Distributor</TableCell>
                                    <TableCell className={classes.tableRowPad}>User Name</TableCell>
                                    <TableCell className={classes.tableRowPad} align="center">Pieces</TableCell>
                                    <TableCell className={classes.tableRowPad} align="center">Gross Weight</TableCell>
                                    <TableCell className={classes.tableRowPad} align="center">Net Weight</TableCell>
                                    <TableCell className={classes.tableRowPad}>Distributor Catalogue Name</TableCell>
                                    <TableCell className={classes.tableRowPad} style={{textAlign: 'center'}} width="120px">Actions</TableCell>
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
                                            <TableCell className={clsx(classes.tableRowPad, classes.hoverClass)}>
                                            {element.distributor !== null ?
                                             <span onClick={(ev) => {
                                                ev.preventDefault();
                                                ev.stopPropagation();
                                                openHandler("/dashboard/mobappadmin/createdistributor",{ row : element.distributor.client.client_id , isViewOnly: false});
                                              }}> {element.distributor.client.name}</span>
                                            : "-" }
                                            </TableCell>
                                            <TableCell className={clsx(classes.tableRowPad, classes.hoverClass)}>
                                                {element.UserMaster ?  
                                                    <span onClick={(ev) => {
                                                        ev.preventDefault();
                                                        ev.stopPropagation();
                                                        openHandler("/dashboard/mobappadmin/adduser",{ row : element.UserMaster.id , isViewOnly: true,  isEdit: false});
                                                    }}> {element.UserMaster.full_name}</span> :
                                                element.LeadUser ? 
                                                <span onClick={(ev) => {
                                                    ev.preventDefault();
                                                    ev.stopPropagation();
                                                    openHandler("/dashboard/mobappadmin/addnewlead",{ row : element.LeadUser.id , isViewOnly: true,  isEdit: false});
                                                }}> {element.LeadUser.full_name}</span>
                                                 : "-"}
                                            </TableCell>
                                            <TableCell className={classes.tableRowPad} align="center">
                                                {element.total_quantity}
                                            </TableCell>
                                            <TableCell className={classes.tableRowPad} align="center">
                                                {element.total_gross_weight !== null ? parseFloat(element.total_gross_weight).toFixed(3) : "-"}
                                            </TableCell>
                                            <TableCell className={classes.tableRowPad} align="center">
                                                {element.total_net_weight !== null ? parseFloat(element.total_net_weight).toFixed(3) : "-"}
                                            </TableCell>
                                            <TableCell className={classes.tableRowPad} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {element.DistributorCatalogue ?  <Link to={{pathname : "/dashboard/mobappadmin/addDiscatalogue" ,
                                                 state :{ row : element.DistributorCatalogue.id , isViewOnly: true} }}  
                                                >
                                                {element.DistributorCatalogue.name} </Link>  : "-"}
                                            </TableCell>
                                            <TableCell className={classes.tableRowPad} style={{textAlign: 'center'}}>
                                                <IconButton
                                                    style={{ padding : "0" }}
                                                    onClick={(ev) => {
                                                        ev.preventDefault();
                                                        ev.stopPropagation();
                                                        viewHandler(element, true);
                                                    }}
                                                >
                                                    <Icon
                                                        className="mr-8"
                                                        style={{ color: "dodgerblue" }}
                                                    >
                                                        visibility
                                                    </Icon>
                                                </IconButton>
                                                <IconButton
                                                    style={{ padding: "0" }}
                                                    onClick={(ev) => {
                                                        ev.preventDefault();
                                                        ev.stopPropagation();
                                                        viewHandler(element,false);
                                                    }}
                                                >
                                                    <Icon className="mr-8" style={{ color: "dodgerblue" }}>
                                                        create
                                                    </Icon>
                                                </IconButton>
                          
                                               <IconButton
                                                style={{ padding: "0" }}
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                    ev.stopPropagation();
                                                    setDownloadModal(true);
                                                    setOrderId(element.id)
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
                </div>
                <Modal
                // disableBackdropClick
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={downloadModal}
                onClose={(_, reason) => {
                    if (reason !== "backdropClick") {
                        setDownloadModal(false);
                        setOrderId("")
                    }
                }}
            >
                <div style={modalStyle} className={classes.paper}>
                    <h5
                        className="p-5"
                        style={{
                            textAlign: "center",
                            backgroundColor: "black",
                            color: "white",
                        }}
                    >
                        Select Format
                        <IconButton
                            style={{ position: "absolute", top: "0", right: "0" }}
                            onClick={() => { setDownloadModal(false);
                                setOrderId("")}}
                        ><Icon style={{ color: "white" }}>
                                close
                            </Icon></IconButton>
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
                                    label="Excel"
                                />
                            </RadioGroup>
                        </FormControl>
                        <Button
                            variant="contained"
                            color="primary"
                            className="w-full mx-auto "
                            style={{
                                backgroundColor: "#4caf50",
                                border: "none",
                                color: "white",
                            }}
                            onClick={(e) => handlePDf(orderId,fileType)}
                        >
                            Download
                        </Button>
                    </div>
                </div>
            </Modal>
            </div>
        </div>
    );
};

export default DistributorOrder;

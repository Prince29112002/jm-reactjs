import React, { useState, useEffect } from "react";
import { Icon, IconButton } from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Modal from "@material-ui/core/Modal";
import LoaderPopup from "app/main/Loader/LoaderPopup";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
    root: {},
    paper: {
        position: "absolute",
        // width: 400,
        zIndex: 1,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        outline: "none",
    },
    table: {
        // minWidth: 650,
    },
    tableRowPad: {
        padding: 7,
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

const DetailsReportPopup = (props) => {

    const [open, setOpen] = React.useState(props.openFlag);
    const [modalStyle] = React.useState(getModalStyle);
    const classes = useStyles();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const [lotData, setLotData] = useState([])
    const [barCodeData, setBarCodeData] = useState([])
    const [variantData, setVariantData] = useState([]);
    const [packetData, setPacketData] = useState([])
    // const [packingSlipData, setPackingSlipData] = useState([])

    const [packPacketData, setPackPacketData] = useState([]) //packing slip packet data
    const [packProdData, setPackProdData] = useState([])//packing slip product data

    useEffect(() => {
        if (loading) {
            setTimeout(() => setLoading(false), 7000);
        }
    }, [loading]);

    // const stockFlag = {
    //   goldStockCode: 1,
    //   looseStockCode: 2,
    //   lot: 3,
    //   barCode: 4,
    //   packet: 5,
    //   packingSlip: 6,
    // };


    useEffect(() => {
        console.log("data", props)
        let data = props.data;
        getDetailsData(data.stock_name_code_id)

    }, [props])

    function getDetailsData(id) {
        setLoading(true)
        axios
            .get(Config.getCommonUrl() + `api/stock/stockcode?stock_name_code_id=${id}&end=${props.date}`)
            .then(function (response) {
                console.log(response);

                if (response.data.success === true) {
                    // console.log(response.data.data);
                    setLotData(response.data.data)

                    setLoading(false)
                } else {
                    setLoading(false)

                }
            })
            .catch(function (error) {
                // console.log(error);
                setLoading(false)
                handleError(error, dispatch, {api :  `api/stock/stockcode?stock_name_code_id=${id}&end=${props.date}`})

            });
    }



    const handleClose = () => {
        setOpen(false);
        props.setOpenFlag()
    }

    return (
        <div className={clsx(classes.root, props.className, "w-full")}>
            <FuseAnimate animation="transition.slideUpIn" delay={200}>
                <div className="flex flex-col md:flex-row container">
                    <div className="flex flex-1 flex-col min-w-0">


                        <Modal
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            open={open}
                            onClose={(_, reason) => {
                                if (reason !== "backdropClick") {
                                    handleClose();
                                }
                            }}
                        >
                            <div style={modalStyle} className={classes.paper}>
                                {loading && <LoaderPopup />}
                                <h5
                                    className="p-5 custom_stocklist_tabel_dv"
                                    style={{
                                        textAlign: "center",
                                        backgroundColor: "black",
                                        color: "white",
                                    }}
                                >
                                    {props.data.stock_name_code}
                                    <IconButton
                                        style={{ position: "absolute", top: "0", right: "0" }}
                                        onClick={handleClose}
                                    ><Icon style={{ color: "white" }}>
                                            close
                                        </Icon></IconButton>
                                </h5>
                                <div className=" pl-16 pr-16 custom_stocklist_dv lotview-modelpopup-dv">


                                    <MaUTable className={classes.table}>
                                        <TableHead>
                                            <TableRow>

                                                <TableCell className={classes.tableRowPad}>Department Name</TableCell>

                                                <TableCell className={classes.tableRowPad}>Pieces</TableCell>

                                                <TableCell className={classes.tableRowPad}>Weight</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {lotData.map((element, index) => (

                                                <TableRow key={index}>

                                                    <TableCell className={classes.tableRowPad}>
                                                        {element.department_id}
                                                    </TableCell>
                                                    <TableCell className={classes.tableRowPad} >
                                                        {element.stock_code_data.item_id === 5 ? element.stock_code_data.pcs : "-"}
                                                    </TableCell>
                                                    <TableCell className={classes.tableRowPad}>
                                                        {element.stock_code_data.weight}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </MaUTable>


                                </div>
                            </div>
                        </Modal>

                    </div>
                </div>
            </FuseAnimate>
        </div>
    );

}

export default DetailsReportPopup;
import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
// "../../../../../../BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as authActions from "app/auth/store/actions";
import * as Actions from "app/store/actions";
import { Typography, TextField, Card, CardContent, Icon, IconButton, ImageListItem, ImageList, Switch, FormGroup, FormControlLabel } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import History from "@history";
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Select, { createFilter } from "react-select";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Loader from '../../../../../../Loader/Loader';
import moment from "moment";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
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
        color: "white",
    },
    tabroot: {
        overflowX: "auto",
        overflowY: "auto",
        height: "100%",
    },
    table: {
        //  minWidth: 650,
    },
    tableRowPad: {
        padding: 7,
    },
    tableFooter: {
        padding: 7,
        backgroundColor: '#E3E3E3'
    },
    searchBox: {
        padding: 6,
        fontSize: "12pt",
        borderColor: "darkgray",
        borderWidth: 1,
        borderRadius: 5,
    },
    hoverClass: {
        // backgroundColor: "#fff",
        color: "#1e90ff",
        "&:hover": {
            // backgroundColor: "#999",
            cursor: "pointer",
        },
    },
}));

const ViewEditEngImg = (props) => {

    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [cad_number, setCardNumber] = useState('');
    const [image_file, setImageFile] = useState('');
    const [temp_cad_num, setTempCadNum] = useState('');
    const [weight, setWeight] = useState('');
    const [weightErr, setWeightErr] = useState('');

    const [size, setSize] = useState('');
    const [sizeErr, setSizeErr] = useState('');

    const [createdDate, setCreatedDate] = useState('');
    const [createdDateErr, setCreatedDateErr] = useState('');

    const [remark, setRemark] = useState('');
    const [moldDetails, setMoldDetails] = useState([]);
    const [status, setStatus] = useState('');

    const [view, setView] = useState(true);
    const [showinapp, setShowInApp] = useState('');
    const [viewStatus, setViewStatus] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const selectStyles = {
        input: (base) => ({
            ...base,
            color: theme.palette.text.primary,
            "& input": {
                font: "inherit",
            },
        }),
    };

    useEffect(() => {
        NavbarSetting('Design', dispatch);
    }, []);

    useEffect(() => {
        if (props.location.state) {
            const vId = props.location.state.id
            const isView = props.location.state.view
            getEngImgData(vId)
            setView(isView)
        } else {
            History.push('/dashboard/design', { view: 1, sub: 8 });
        }
    }, [])

    function getEngImgData(id) {
        setLoading(true);
        axios.get(Config.getCommonUrl() + `api/cadjobreceivedesign/engg/data/info/${id}`)
            .then((response) => {
                console.log(response)
                if (response.data.success) {
                    const apiData = response.data.data
                    setCardNumber(apiData.CadJobDetails?.CadJobNumber?.cad_number)
                    setImageFile(apiData.image_file ? apiData.image_file : '')
                    setTempCadNum(apiData.temp_cad_no ? apiData.temp_cad_no : '')
                    setWeight(apiData.EngineeringDetails ? apiData.EngineeringDetails.weight ? apiData.EngineeringDetails.weight : '' : '')
                    setCreatedDate(apiData.updated_at ? moment.utc(apiData.updated_at).local().format("YYYY-MM-DD") : '')
                    setSize(apiData.EngineeringDetails ? apiData.EngineeringDetails.size ? apiData.EngineeringDetails.size : '0' : '0')
                    setRemark(apiData.remark ? apiData.remark : '')
                    setMoldDetails(apiData.CadMoldDetails ? apiData.CadMoldDetails : [])
                    setStatus(apiData.EngineeringDetails ? apiData.EngineeringDetails.active_deactive : "")
                } else {
                    dispatch(Actions.showMessage({ message: response.data.message, variant: "success" }));
                }
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                handleError(error, dispatch, { api: `api/cadjobreceivedesign/engg/data/info/${id}` })
            })
    }

    const handleChangeToggle = (event, id) => {

        const status = event.target.checked
        if (status) {
            setViewStatus(1)
        } else if (!status) {
            setViewStatus(0)
        }
    }
    const handleInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        if (name === "weight") {
            if (!isNaN(Number(value)) && value <= 999) {
                setWeight(value);
                setWeightErr("")
            } else {
                setWeightErr("Weight must be number and less than 999")
            }
        } else if (name === "size") {
            if (!isNaN(Number(value)) && value <= 99) {
                setSize(value);
                setSizeErr("");
            } else {
                setSizeErr("Size must be number and less than 99")
            }
        } else if (name === "date") {
            setCreatedDate(value);
            setCreatedDateErr("")
        } else if (name === "remark") {
            setRemark(value);
        }
    };
    function validateWeight() {
        if (weight === "" || weight > 999) {
            setWeightErr("Weight must be number and less than 999");
            return false;
        }
        return true;
    }

    //   function validateDate() {
    //     if (size === "") {
    //         setSizeErr("Enter valid size");
    //       return false;
    //     }
    //     return true;
    //   }

    function validateSize() {
        if (size === "" || size > 99) {
            setSizeErr("Size must be number and less than 99");
            return false;
        }
        return true;
    }

    function validateDate() {
        if (createdDate === "") {
            setCreatedDateErr("Select date");
            return false;
        }
        return true;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validateWeight() && validateDate() && validateSize()) {
            callUpdateApi();
        }
    }
    function callUpdateApi() {
        const vId = props.location.state.id;
        const body = {
            cam_weight: weight,
            size: size,
            remark: remark,
        }
        axios.put(Config.getCommonUrl() + `api/cadjobreceivedesign//engineering-img-data-update/${vId}`, body)
            .then((response) => {
                console.log(response)
                if (response.data.success) {
                    History.push('/dashboard/design', { view: 1, sub: 8 });
                }
                dispatch(Actions.showMessage({ message: response.data.message, variant: "success" }));
            })
            .catch((error) => {
                handleError(error, dispatch.apply, { api: `api/cadjobreceivedesign//engineering-img-data-update/${vId}`, body: body })
            })
    }

    const handleTransferJob = () => {
        const vId = props.location.state.id;
        axios.put(Config.getCommonUrl() + `api/cadjobreceivedesign/cad/active/deactive/${vId}/0`)
            .then((response) => {
                console.log(response);
                dispatch(Actions.showMessage({ message: response.data.message, variant: "success" }));
                if (response.data.success) {
                    History.push('/dashboard/design', { view: 1, sub: 8 });
                }
            })
            .catch((error) => {
                handleError(error, dispatch, { api: `api/cadjobreceivedesign/cad/active/deactive/${vId}/0` })
            })
    }

    return (
        <div className={clsx(classes.root, props.className, "w-full")}>
            <FuseAnimate animation="transition.slideUpIn" delay={200}>
                <div className="flex flex-col md:flex-row container">
                    <div className="flex flex-1 flex-col min-w-0  makeStyles-root-1 pt-20">
                        <Grid
                            container
                            spacing={4}
                            alignItems="stretch"
                            style={{ margin: 0 }}
                        >
                            <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                                <FuseAnimate delay={300}>
                                    <Typography className="pl-28 pt-16 text-18 font-700">
                                        Engineer Image and Data
                                    </Typography>
                                </FuseAnimate>
                                {/* <BreadcrumbsHelper /> {view ? "View" : "Edit"} engineer image and data */}
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                sm={4}
                                md={9}
                                key="2"
                                style={{ textAlign: "right", paddingRight: "47px" }}
                            >
                                {/* <Button
                                    variant="contained"
                                    className={classes.button}
                                    size="small"
                                    onClick={(event) => {
                                        History.push('/dashboard/design', { view: 1, sub : 8 });
                                    }}
                                >
                                    Back
                                </Button> */}
                                <div className="btn-back mt-2">
                                    {" "}
                                    <img src={Icones.arrow_left_pagination} alt="" />
                                    <Button
                                        id="btn-back"
                                        size="small"
                                        onClick={(event) => {
                                            History.push('/dashboard/design', { view: 1, sub: 8 });
                                        }}
                                    >
                                        Back
                                    </Button>
                                </div>


                            </Grid>
                        </Grid>
                        <div className="main-div-alll">
                            {
                                !view && <Button
                                    // variant="contained"
                                    // id="btn-save"
                                    className={classes.button}
                                    size="small"
                                    style={{
                                        float: "right"
                                    }}
                                    onClick={handleSubmit}
                                >
                                    Save
                                </Button>
                            }
                            <Grid
                                container
                                spacing={4}
                                alignItems="stretch"
                                style={{ margin: 0 }}
                            >

                                <Grid item xs={12} sm={4} md={3} style={{ padding: 10 }}>
                                    <label>CAD number</label>
                                    <TextField
                                        className="mb-16 mt-1"
                                        placeholder="CAD number"
                                        autoFocus
                                        name="cad_number"
                                        value={cad_number}
                                        variant="outlined"
                                        required
                                        fullWidth
                                        disabled
                                    />
                                </Grid>
                                {
                                    status === 1 && <Grid item xs={12} sm={4} md={3} style={{ padding: 10 }}>
                                        <Button
                                            className="mt-24"
                                            variant="contained"
                                            style={{ backgroundColor: "#FE450B", color: "white" }}
                                            size="small"
                                            onClick={() => {
                                                setModalOpen(true);
                                            }}
                                        >
                                            Repair
                                        </Button>
                                    </Grid>
                                }
                            </Grid>
                            {loading && <Loader />}
                            <Grid className="editdesign-main-blg">
                                <Grid className="editdesign-mb" container spacing={3}>
                                    <Grid item xs={3} style={{ padding: 5 }}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} style={{ position: "relative" }}>
                                                <img src={`${Config.getS3Url()}vkjdev/cadJob/images/${image_file}`} style={{ width: "500px", height: "300px", borderRadius: "7px" }} />
                                                {/* <IconButton size="small" onClick={(e) => handleDelete(e, image_file[0])} className="icone-circle" style={{ backgroundColor: "red" }}>
                                                <Icon style={{ color: "white" }}>close</Icon>
                                            </IconButton> */}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={9}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                {/* <Card> */}
                                                {/* <CardContent> */}
                                                <Grid container spacing={3}>
                                                    <Grid item xs={2} md={4} sm={4} col={12}>
                                                        <label>Temp cad number</label>
                                                        <TextField
                                                            className="mb-16 mt-1"
                                                            placeholder="Temp cad number"
                                                            name="temp_cad_num"
                                                            value={temp_cad_num}
                                                            variant="outlined"
                                                            required
                                                            fullWidth
                                                            disabled
                                                        />
                                                    </Grid>

                                                    <Grid item xs={2} md={4} sm={4} col={12}>
                                                        <label>Weight</label>
                                                        <TextField
                                                            className="mb-16 mt-1"
                                                            placeholder="Weight"
                                                            name="weight"
                                                            value={weight}
                                                            error={weightErr.length > 0 ? true : false}
                                                            helperText={weightErr}
                                                            onChange={(e) => handleInputChange(e)}
                                                            variant="outlined"
                                                            required
                                                            fullWidth
                                                            disabled={view}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={2} md={4} sm={4} col={12}>
                                                        <label>Date</label>
                                                        <TextField
                                                            className="mb-16 mt-1"
                                                            type="date"
                                                            placeholder="Date"
                                                            name="date"
                                                            value={createdDate}
                                                            // error={createdDateErr.length > 0 ? true : false}
                                                            // helperText={createdDateErr}
                                                            // onChange={(e) => handleInputChange(e)} 
                                                            variant="outlined"
                                                            fullWidth
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            disabled
                                                        />
                                                    </Grid>
                                                    <Grid item xs={2} md={4} sm={4} col={12}>
                                                        <label>Size</label>
                                                        <TextField
                                                            className="mb-16 mt-1"
                                                            placeholder="Size"
                                                            name="size"
                                                            value={size}
                                                            error={sizeErr.length > 0 ? true : false}
                                                            helperText={sizeErr}
                                                            onChange={(e) => handleInputChange(e)}
                                                            variant="outlined"
                                                            required
                                                            fullWidth
                                                            disabled={view}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={8} md={8} sm={8}>
                                                        <label>Remarks</label>
                                                        <TextField
                                                            className="mb-16"
                                                            placeholder="Remarks"
                                                            name="remark"
                                                            value={remark}
                                                            onChange={(e) => handleInputChange(e)}
                                                            variant="outlined"
                                                            fullWidth
                                                            disabled={view}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                {/* </CardContent> */}
                                                {/* </Card> */}
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={4}>
                                                <Typography className="mt-16 ml-2 mb-5">
                                                    <b>Mold Details</b>
                                                </Typography>
                                            </Grid>
                                            <div>
                                                {/* <div id="inner-createpacket-tbl-dv" className={moldDetails.length >= 5 ? `table-responsive hallmarkrejection-firsttabel` : `table-responsive`}> */}
                                                <MaUTable>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className={classes.tableRowPad}>Mold Code</TableCell>
                                                            <TableCell className={classes.tableRowPad}>No Of Mold</TableCell>
                                                            <TableCell className={classes.tableRowPad}>Stones Code</TableCell>
                                                            <TableCell className={classes.tableRowPad}>No of stones</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            moldDetails.map((temp, i) => (
                                                                <>
                                                                    <TableRow key={i}>
                                                                        <TableCell className={classes.tableRowPad} rowSpan={temp.CadMoldStockDetails.length}>
                                                                            {temp.mold_number ? temp.mold_number : ''}
                                                                        </TableCell>
                                                                        <TableCell className={classes.tableRowPad} rowSpan={temp.CadMoldStockDetails.length}>
                                                                            {temp.mold_pcs ? temp.mold_pcs : ''}
                                                                        </TableCell>
                                                                        <TableCell className={classes.tableRowPad}>
                                                                            {temp.CadMoldStockDetails.length !== 0 ? temp.CadMoldStockDetails[0]?.StockNameCode.stock_code : ""}
                                                                        </TableCell>
                                                                        <TableCell className={classes.tableRowPad}>
                                                                            {temp.CadMoldStockDetails.length !== 0 ? temp.CadMoldStockDetails[0]?.stone_pcs : ""}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    {
                                                                        temp.CadMoldStockDetails.map((col, index) => (index > 0 &&
                                                                            <TableRow key={index}>
                                                                                <TableCell className={classes.tableRowPad}>{col.StockNameCode.stock_code}</TableCell>
                                                                                <TableCell className={classes.tableRowPad}>{col.stone_pcs}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                </>
                                                            ))
                                                        }
                                                    </TableBody>
                                                </MaUTable>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Dialog
                                    open={modalOpen}
                                    onClose={() => {
                                        setModalOpen(false);
                                    }}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title" className="popup-delete">{"Alert!!!"}<IconButton
                                        style={{
                                            position: "absolute",
                                            marginTop: "-5px",
                                            right: "15px",
                                        }}
                                        onClick={() => {
                                            setModalOpen(false);
                                        }}
                                    >
                                        <img
                                            src={Icones.cross}
                                            className="delete-dialog-box-image-size"
                                            alt=""
                                        />
                                    </IconButton></DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Are you sure you want to transfer for the repair?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button
                                            onClick={() => {
                                                setModalOpen(false);
                                            }}
                                            className="delete-dialog-box-cancle-button">
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleTransferJob}
                                            className="delete-dialog-box-cancle-button"
                                            autoFocus
                                        >
                                            OK
                                        </Button>
                                    </DialogActions>
                                </Dialog>
                            </Grid>
                        </div>
                    </div>
                </div>
            </FuseAnimate>
        </div>
    );
}

export default ViewEditEngImg;
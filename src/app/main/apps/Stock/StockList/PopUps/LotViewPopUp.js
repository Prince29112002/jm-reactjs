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

const LotViewPopUp = (props) => {

    const [open, setOpen] = React.useState(props.openFlag);
    const [modalStyle] = React.useState(getModalStyle);
    const classes = useStyles();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    const [lotData, setLotData] = useState([])
    const [barCodeData, setBarCodeData] = useState([])

    console.log(989797987,barCodeData);
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
        console.log("data", props.data)
        let data = props.data;
        if (data) {

            // if (data.type === 4) {
            //   getLotData(data.lot_id);
            // } else if (data.type === 1 || data.type === 2 || data.type === 3) {
            //   getBarcodeData(data);
            // }

            if (data.flag === 3) {
                getLotData(data.lot_id)
            } else if (data.flag === 4) {
                getBarcodeData(data)
            } else if (data.flag === 5) {
                // packet_id
                getPacketData(data.packet_id)
            } else if (data.flag === 6) {

                console.log(987979898798)
                // packing_slip_id
                getPackingSlipData(data.packing_slip_id)
            }

        }
        //eslint-disable-next-line
    }, [props])

    function getPackingSlipData(id) {
        axios
            .get(Config.getCommonUrl() + `api/packingslip/list/${id}`)
            .then(function (response) {
                console.log(response);

                if (response.data.success === true) {
                    // console.log(response.data.data);
                    // setPackingSlipData(response.data.data)
                    setPackPacketData(response.data.mydata) //packing slip packet data
                    // setPackProdData(response.data.data[0].productData)//packing slip product data
                    setLoading(false)
                } else {
                    setLoading(false)

                }
            })
            .catch(function (error) {
                // console.log(error);
                setLoading(false)
                handleError(error, dispatch, {api:`api/packingslip/list/${id}`})

            });
    }

    function getPacketData(id) {
        axios
            .get(Config.getCommonUrl() + `api/packet/set/${id}`)
            .then(function (response) {
                console.log(response);

                if (response.data.success === true) {
                    // console.log(response.data.data);
                    setPacketData(response.data.data)

                    setLoading(false)
                } else {
                    setLoading(false)

                }
            })
            .catch(function (error) {
                // console.log(error);
                setLoading(false)
                handleError(error, dispatch, {api: `api/packet/set/${id}`})

            });
    }

    function getBarcodeData(data) {
        axios
          .get(
            Config.getCommonUrl() +
              `api/lotdetail/barcode/info/all/${data.stock_name_code}?department_id=${data.department_id}&type=${data.type}`
          )
          .then(function (response) {
            console.log(response);

            if (response.data.success === true && response.data.data) {
              const details = response.data.data.details;
              console.log(details);
              setBarCodeData(details);
              setLoading(false);
            } else {
                console.log(32123131321321)
              console.log("Error occurred");
              setLoading(false);
              
            }
          })
          .catch(function (error) {
            // console.log(error);
            setLoading(false);
            handleError(error, dispatch, {
              api: `api/lotdetail/barcode/info/all/${data.stock_name_code}?department_id=${data.department_id}&type=${data.type}`,
            });
          });
    }

    function getLotData(lot_id) {
        // setLoading(true)
        axios
            .get(Config.getCommonUrl() + `api/stock/lot/${lot_id}`)
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
                handleError(error, dispatch, {api:`api/stock/lot/${lot_id}`})

            });
    }



    const handleClose = () => {
        console.log("handleClose")
        setOpen(false);
        // props.getData()
        // History.push('/dashboard/stock');
        props.setOpenFlag()
    }

    return (
      <div className={clsx(classes.root, props.className, "w-full")}>
        <FuseAnimate animation="transition.slideUpIn" delay={200}>
          <div className="flex flex-col md:flex-row container">
            <div className="flex flex-1 flex-col min-w-0">
              {open === true && (
                <Modal
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  open={open}
                  style={{ overflow: "scroll" }}
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
                      >
                        <Icon style={{ color: "white" }}>close</Icon>
                      </IconButton>
                    </h5>
                    <div className=" pl-16 pr-16 custom_stocklist_dv lotview-modelpopup-dv">
                      {props.data.type === 4 && (
                        <MaUTable className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
                                Item Group
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Stock Code
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Type
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Pieces
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Purity
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Size
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Weight
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {lotData.map((element, index) => (
                              <TableRow key={index}>
                                {console.log(element)}
                                <TableCell className={classes.tableRowPad}>
                                  {/* Item Group */}
                                  {element.material_detail}
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  // className={clsx(classes.tableRowPad, classes.hoverClass)}
                                  // onClick={(e) =>
                                  //     handleClick(element)
                                  // }
                                >
                                  {/* Variant Name */}
                                  {element.stock_code}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {/* TYPE */}
                                  {element.stock_description}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {element.pcs}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {element.purity ? element.purity : "-"}
                                </TableCell>

                                <TableCell className={classes.tableRowPad}>
                                  {element.size}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {element.weight}
                                </TableCell>
                              </TableRow>
                            ))}

                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
                                {/* Item Group */}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* Variant Name */}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* Type */}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* Pcs */}
                                {parseFloat(
                                  lotData
                                    .filter((item) => item.pcs !== "")
                                    .map((item) => parseFloat(item.pcs))
                                    .reduce(function (a, b) {
                                      return parseFloat(a) + parseFloat(b);
                                    }, 0)
                                )}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* Type */}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* Purity */}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* Weight */}
                                {parseFloat(
                                  lotData
                                    .filter((item) => item.weight !== "")
                                    .map((item) => parseFloat(item.weight))
                                    .reduce(function (a, b) {
                                      return parseFloat(a) + parseFloat(b);
                                    }, 0)
                                ).toFixed(3)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </MaUTable>
                      )}

                      {props.data.type === 1 && (
                        <>
                          {Object.keys(barCodeData).length > 0 ? (
                            <div className="p-5 pl-16 pr-16 regenbarcode-model-popup-dv">
                              <div className="inner-regenbarcode-model-popup">
                                <MaUTable className={classes.table}>
                                  <TableBody>
                                    {Object.entries(barCodeData).map(
                                      ([key, value], index) => (
                                        <TableRow key={index}>
                                          <TableCell
                                            className={classes.tableRowPad}
                                          >
                                            {key}
                                          </TableCell>
                                          <TableCell
                                            className={classes.tableRowPad}
                                          >
                                            {value}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </MaUTable>
                              </div>
                            </div>
                          ) : (
                            <div className="p-5 pl-16 pr-16 regenbarcode-model-popup-dv">
                              <div className="inner-regenbarcode-model-popup">
                                <MaUTable className={classes.table}>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        This is uploaded barcode !! Data not
                                        found
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </MaUTable>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {props.data.type === 2 && (
                        <MaUTable className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
                                BarCode
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Purity
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Pieces
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Gross Weight
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Net Weight
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {packetData.map((rows, idx) => (
                              <TableRow key={idx}>
                                {console.log(rows)}
                                <TableCell className={classes.tableRowPad}>
                                  {rows.LotDetails.BarCodeProduct
                                    ? rows.LotDetails.BarCodeProduct.barcode
                                    : rows.LotDetails.barcode}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {rows.LotDetails.purity}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {rows.LotDetails.phy_pcs}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {rows.LotDetails.gross_wgt}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {rows.LotDetails.net_wgt}
                                </TableCell>
                              </TableRow>
                            ))}

                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
                                {/* Item Group */}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* Variant Name */}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* Pcs */}
                                {parseFloat(
                                  packetData
                                    .filter(
                                      (item) => item.LotDetails.phy_pcs !== ""
                                    )
                                    .map((item) =>
                                      parseFloat(item.LotDetails.phy_pcs)
                                    )
                                    .reduce(function (a, b) {
                                      return parseFloat(a) + parseFloat(b);
                                    }, 0)
                                )}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* Weight */}
                                {parseFloat(
                                  packetData
                                    .filter(
                                      (item) => item.LotDetails.gross_wgt !== ""
                                    )
                                    .map((item) =>
                                      parseFloat(item.LotDetails.gross_wgt)
                                    )
                                    .reduce(function (a, b) {
                                      return parseFloat(a) + parseFloat(b);
                                    }, 0)
                                ).toFixed(3)}
                              </TableCell>

                              <TableCell className={classes.tableRowPad}>
                                {/* Weight */}
                                {parseFloat(
                                  packetData
                                    .filter(
                                      (item) => item.LotDetails.net_wgt !== ""
                                    )
                                    .map((item) =>
                                      parseFloat(item.LotDetails.net_wgt)
                                    )
                                    .reduce(function (a, b) {
                                      return parseFloat(a) + parseFloat(b);
                                    }, 0)
                                ).toFixed(3)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </MaUTable>
                      )}
                      {props.data.type === 3 && (
                        <MaUTable className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
                                Stock Code
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Purity
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Pieces
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Gross Weight
                              </TableCell>
                              {/* <TableCell className={classes.tableRowPad}>Stone Weight</TableCell> */}
                              <TableCell className={classes.tableRowPad}>
                                Net Weight
                              </TableCell>
                              {/* <TableCell className={classes.tableRowPad}>Other Weight</TableCell> */}
                              <TableCell className={classes.tableRowPad}>
                                Hallmark Charges
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Wastage(%)p
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {packPacketData.map((row, idx) => (
                              <TableRow key={idx}>
                                {console.log(row)}
                                <TableCell className={classes.tableRowPad}>
                                  {row.Packet.PacBarCode
                                    ? row.Packet.PacBarCode.barcode
                                    : row.Packet.barcode}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.Packet.purity}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.Packet.pcs}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.Packet.gross_wgt}
                                </TableCell>
                                {/* <TableCell className={classes.tableRowPad}>
                                                        {row.Packet.stone_wgt}
                                                        </TableCell> */}
                                <TableCell className={classes.tableRowPad}>
                                  {row.Packet.net_wgt}
                                </TableCell>
                                {/* <TableCell className={classes.tableRowPad}>
                                                        {row.Packet.other_wgt}
                                                        </TableCell> */}
                                <TableCell className={classes.tableRowPad}>
                                  {row.Packet.hallmark_charges
                                    ? row.Packet.hallmark_charges
                                    : ""}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {row.Packet.wastage}
                                </TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
                                {/* Item Group */}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* Variant Name */}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* Pcs */}
                                {parseFloat(
                                  packPacketData
                                    .filter((item) => item.Packet.pcs !== "")
                                    .map((item) => parseFloat(item.Packet.pcs))
                                    .reduce(function (a, b) {
                                      return parseFloat(a) + parseFloat(b);
                                    }, 0)
                                )}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* Weight */}
                                {parseFloat(
                                  packPacketData
                                    .filter(
                                      (item) => item.Packet.gross_wgt !== ""
                                    )
                                    .map((item) =>
                                      parseFloat(item.Packet.gross_wgt)
                                    )
                                    .reduce(function (a, b) {
                                      return parseFloat(a) + parseFloat(b);
                                    }, 0)
                                ).toFixed(3)}
                              </TableCell>

                              <TableCell className={classes.tableRowPad}>
                                {/* Weight */}
                                {parseFloat(
                                  packPacketData
                                    .filter(
                                      (item) => item.Packet.net_wgt !== ""
                                    )
                                    .map((item) =>
                                      parseFloat(item.Packet.net_wgt)
                                    )
                                    .reduce(function (a, b) {
                                      return parseFloat(a) + parseFloat(b);
                                    }, 0)
                                ).toFixed(3)}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* Weight */}
                                {parseFloat(
                                  packPacketData
                                    .filter(
                                      (item) =>
                                        item.Packet.hallmark_charges !== ""
                                    )
                                    .map((item) =>
                                      parseFloat(item.Packet.hallmark_charges)
                                    )
                                    .reduce(function (a, b) {
                                      return parseFloat(a) + parseFloat(b);
                                    }, 0)
                                ).toFixed(3)}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* Purity */}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </MaUTable>
                      )}
                    </div>
                  </div>
                </Modal>
              )}
            </div>
          </div>
        </FuseAnimate>
      </div>
    );

}

export default LotViewPopUp;
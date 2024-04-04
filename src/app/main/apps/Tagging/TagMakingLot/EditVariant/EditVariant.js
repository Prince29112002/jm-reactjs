import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { TextField, Icon, IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AppContext from "app/AppContext";
import handleError from "app/main/ErrorComponent/ErrorComponent";

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

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
    backgroundColor: "cornflowerblue",
    color: "white",
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

const EditVariant = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [barcodeNum, setBarcodeNum] = useState("");
  const [barcodeNumErr, setBarcodeNumErr] = useState("");

  const [lotArray, setLotArr] = useState([]);
  const [lotId, setLotId] = useState("");
  const [grossWeight, setGrossWeight] = useState("");
  const [grossWeightErr, setGrossWeightErr] = useState("");

  const [netWeight, setNetWeight] = useState("");
  const [variantNum, setVariantNum] = useState("");
  const [image, setImage] = useState("");
  const [variantData, setVariantData] = useState([]);
  const [jsonObj, setJsonObj] = useState("");
  const [modalView, setModalView] = useState(false);
  const [variantTotalWeight, setVariantTotalWeight] = useState(0);
  const appContext = useContext(AppContext);

  const { selectedDepartment } = appContext;

  useEffect(() => {
    if (grossWeight > 0) {
      callNetWeightcalculation();
    } else {
      setNetWeight(0);
    }
  }, [grossWeight]);

  useEffect(() => {
    if (props.barcode) {
      callBarcodeDetailsApi(props.barcode);
    }
  }, [props]);

  function callNetWeightcalculation() {
    if (grossWeight !== "" && variantTotalWeight !== "" && grossWeight >= 0) {
      var qtyWiseWeight = grossWeight - variantTotalWeight;
      if (qtyWiseWeight <= 0) {
        setGrossWeightErr(
          "Net Weight should not be negative , so enter valid Gross Weight or phy qty"
        );
      } else {
        setNetWeight(qtyWiseWeight.toFixed(3));
      }
    } else {
      setNetWeight(0);
      setGrossWeightErr("Enter valid gross weight");
    }
  }

  function callBarcodeDetailsApi(barcodeInput) {
    const barcodeId = barcodeInput.toString();
    axios
      .get(
        Config.getCommonUrl() +
          `api/lotdetail/scan/product/${barcodeId}/${
            selectedDepartment.value.split("-")[1]
          }`
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          if (res.data.data[0].length > 0) {
            const arrData = res.data.data[0][0];
            setLotId(arrData.id);
            setGrossWeight(arrData.gross_wgt);
            setNetWeight(arrData.net_wgt);
            setLotArr(arrData);
            setJsonObj(arrData.details_json);
            const resData = JSON.parse(arrData.details_json);
            const tempData = [];
            tempData.push(resData);
            setVariantData(tempData);
            setVariantTotalWeight(tempData[0]["Total Weight"]);
            setVariantNum(tempData[0]["Variant"]);
            setImage(
              `${Config.getS3Url()}vkjdev/design/image/${arrData.image_file}`
            );
          } else {
            dispatch(
              Actions.showMessage({
                message: "This lot is from different Department",
                variant: "error",
              })
            );
          }
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/lotdetail/scan/product/${barcodeId}/${
            selectedDepartment.value.split("-")[1]
          }`,
        });
      });
  }

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "grossWeight") {
      if (!isNaN(Number(value)) && value.length < 9) {
        setGrossWeight(value);
        setGrossWeightErr("");
      }
    }
  };

  function validateGrossWeight() {
    if (grossWeight === "" || grossWeight == 0) {
      setGrossWeightErr("Enter Valid Gross Weight");
      return false;
    }
    return true;
  }

  const handleDataSubmit = (event) => {
    event.preventDefault();
    if (validateGrossWeight()) {
      callUpdateRegenrateApi();
    }
  };

  function callUpdateRegenrateApi() {
    const body = {
      //   lot_id : lotId,
      gross_wgt: grossWeight,
      net_wgt: netWeight,
      //   details_json : jsonObj
    };
    axios
      .put(Config.getCommonUrl() + `api/lotdetail/regenerate/${lotId}`, body)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: "Edited SuccessFully",
              variant: "success",
            })
          );
          setOpen(false);
          props.modalColsed();
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
          api: `api/lotdetail/regenerate/${lotId}`,
          body: body,
        });
      });
  }
  const handleClose = () => {
    setOpen(false);
    props.modalColsed();
  };

  return (
    <div>
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
          <h5
            className="p-5"
            style={{
              textAlign: "center",
              backgroundColor: "black",
              color: "white",
            }}
          >
            Edit Variant
            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={handleClose}
            >
              <Icon style={{ color: "white" }}>close</Icon>
            </IconButton>
          </h5>
          <div className="p-5 pl-16 pr-16">
            {/* <div className="m-16 ReGenBarcode-tbl-dv">
                  <Paper className={classes.tabroot}>
                    <div className="table-responsive inner-ReGenBarcode-tbl-dv">
                    <MaUTable  className={classes.table}>
                      <TableHead>
                          <TableRow>
                              <TableCell className={classes.tableRowPad}>BarCode No</TableCell>
                              <TableCell className={classes.tableRowPad}>Design No</TableCell>
                              <TableCell className={classes.tableRowPad}>Batch No</TableCell>
                              <TableCell className={classes.tableRowPad}>Lot No</TableCell>
                              <TableCell className={classes.tableRowPad}>Purity</TableCell>
                              <TableCell className={classes.tableRowPad}>Phy Pieces</TableCell>
                              <TableCell className={classes.tableRowPad}>Gross Weight</TableCell>
                              <TableCell className={classes.tableRowPad}>Net Weight</TableCell>
                              <TableCell className={classes.tableRowPad}>Other Weight</TableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray.barcode}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {variantNum}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray.batch_number ? lotArray.batch_number : ''}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray.lot_no ? lotArray.lot_no : ''}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray.purity ? lotArray.purity : ''}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray.phy_pcs ? lotArray.phy_pcs : ''}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray.gross_wgt ? lotArray.gross_wgt : ''}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray.net_wgt ? lotArray.net_wgt : ''}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {lotArray.other_wgt ? lotArray.other_wgt : ''}
                            </TableCell>
                          </TableRow>    
                      </TableBody>
                    </MaUTable>
                    </div>
                  </Paper>
              </div> */}

            {/* <div className="m-16">
                  <Grid container spacing={3}>
                     <Grid className="regenbarcode-main-image_dv" item  lg={12} md={12} sm={12} xs={12} >
                       <Grid  className="img-box-blg-main regenbarcode-main-image_left">
                        <Grid  className="img-box-blg-dv" style={{backgroundColor:"gray", padding : 20}}>
                            <img src={image} />
                        </Grid>
                      </Grid>
                    <Grid className="img-box-blg-main regenbarcode-input-dv"> */}
            <TextField
              className=" mb-5"
              name="grossWeight"
              label="Gross Weight"
              placeholder="0"
              autoFocus
              value={grossWeight}
              error={grossWeightErr.length > 0 ? true : false}
              helperText={grossWeightErr}
              onChange={(e) => handleInputChange(e)}
              variant="outlined"
              fullWidth
            />
            <TextField
              className="mb-5"
              label="Net Weight"
              placeholder="0"
              value={netWeight}
              variant="outlined"
              fullWidth
            />

            <Button
              variant="contained"
              className={classes.button}
              size="small"
              style={{
                backgroundColor: "#4caf50",
                border: "none",
                color: "white",
              }}
              onClick={handleDataSubmit}
            >
              Save
            </Button>
            {/* </Grid>
                     </Grid>
                      
                  </Grid> */}
            {/* </div> */}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditVariant;
